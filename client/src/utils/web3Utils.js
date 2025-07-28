// src/utils/web3Utils.js

import Web3 from "web3";

const GANACHE_URL = "http://127.0.0.1:7545";

/**
 * Initialize Web3 connection
 * Tries MetaMask first, falls back to Ganache local blockchain
 */
export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      // Request access to MetaMask accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return new Web3(window.ethereum);
    } catch (err) {
      console.warn("MetaMask access denied. Falling back to Ganache.", err);
    }
  }

  // Fallback: Connect to Ganache local blockchain
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));
    await web3.eth.net.isListening();
    return web3;
  } catch (err) {
    console.error("Failed to connect to Ganache:", err);
    throw new Error(
      "Cannot connect to blockchain. Make sure Ganache is running on port 7545"
    );
  }
};

/**
 * Create a contract instance from ABI and network deployment info
 */
export const getContract = async (web3, contractArtifact) => {
  try {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = contractArtifact.networks[networkId.toString()];

    if (!deployedNetwork) {
      throw new Error(`Contract not deployed on network ID ${networkId}`);
    }

    return new web3.eth.Contract(contractArtifact.abi, deployedNetwork.address);
  } catch (err) {
    console.error("Error loading contract:", err);
    throw err;
  }
};

/**
 * Get list of accounts from web3 provider
 */
export const getAccounts = async (web3) => {
  const accounts = await web3.eth.getAccounts();

  if (accounts.length === 0) {
    throw new Error("No accounts found. Connect your wallet or unlock MetaMask.");
  }

  return accounts;
};

/**
 * Get Ether balance of an account
 */
export const getBalance = async (web3, address) => {
  const balanceWei = await web3.eth.getBalance(address);
  const balanceEther = web3.utils.fromWei(balanceWei, "ether");

  return {
    wei: balanceWei,
    ether: balanceEther,
    formatted: `${parseFloat(balanceEther).toFixed(4)} ETH`,
  };
};

/**
 * Call a contract's read-only method
 */
export const callContractFunction = async (
  contract,
  functionName,
  params = [],
  fromAccount = null
) => {
  try {
    return await contract.methods[functionName](...params).call({ from: fromAccount });
  } catch (err) {
    console.error(`Error calling contract function ${functionName}:`, err);
    throw err;
  }
};

/**
 * Send a transaction to contract (state-changing)
 */
export const sendContractTransaction = async (
  contract,
  functionName,
  params = [],
  fromAccount,
  value = 0
) => {
  try {
    const transaction = contract.methods[functionName](...params);
    const gasEstimate = await transaction.estimateGas({ from: fromAccount, value });

    const receipt = await transaction.send({
      from: fromAccount,
      gas: Math.floor(gasEstimate * 1.1),
      value,
    });

    return receipt;
  } catch (err) {
    console.error("Error sending contract transaction:", err);
    throw err;
  }
};

/**
 * Utility: Validate Ethereum address
 */
export const isValidAddress = (address) => Web3.utils.isAddress(address);

/**
 * Utility: Convert Wei to Ether
 */
export const weiToEther = (wei) => {
  if (!wei) return "0";
  try {
    return Web3.utils.fromWei(wei.toString(), "ether");
  } catch {
    return "0";
  }
};

/**
 * Utility: Convert Ether to Wei
 */
export const etherToWei = (ether) => Web3.utils.toWei(ether.toString(), "ether");

/**
 * Shorten Ethereum address for display: 0x1234...abcd
 */
export const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Handle common Web3 errors to friendly messages
 */
export const handleWeb3Error = (error) => {
  if (!error) return "Unknown error";

  if (error.code === 4001) return "Transaction cancelled by user";
  if (error.message?.includes("insufficient funds")) return "Insufficient funds for transaction";
  if (error.message?.includes("gas required exceeds allowance"))
    return "Transaction requires more gas than allowed";
  if (error.message?.includes("revert")) return "Transaction reverted - check contract conditions";

  return error.message || "Unknown blockchain error";
};

export default {
  initWeb3,
  getContract,
  getAccounts,
  getBalance,
  callContractFunction,
  sendContractTransaction,
  isValidAddress,
  weiToEther,
  etherToWei,
  shortenAddress,
  handleWeb3Error,
};
