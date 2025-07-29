import { useState, useEffect } from "react";

import Web3 from "web3";

const url = "http://127.0.0.1:7545";

export const initWeb3 = async () => {

  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    await web3.eth.net.isListening();
    return web3;
  } catch (err) {
    console.error("Failed to connect to Ganache:", err);
  }
};

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

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState({
    web3: null,
    accounts: [],
    networkId: null,
    currentAccount: "",
    isConnected: false,
  });

  const [contracts, setContracts] = useState({});



  useEffect(() => {
    const initializeWeb3 = async () => {
      try {

        const web3Instance = await initWeb3();

        const accounts = await web3Instance.eth.getAccounts();

        const networkId = await web3Instance.eth.net.getId();

        setWeb3State({
          web3: web3Instance,
          accounts,
          networkId: Number(networkId),
          currentAccount: accounts[0],
          isConnected: accounts.length > 0,
        });

        await loadContracts(web3Instance);
      } catch (err) {
        console.error("Failed to initialize Web3:", err);
      } 
    };

    initializeWeb3();
  }, []);

  const loadContracts = async (web3) => {
    try {

      const contractNames = [
        "AdditionContract",
        "Convertisseur",
        "GestionChaines",
        "Payment",
        "Rectangle",
        "SommeTableau",
        "VerificateurParite",
        "VerificateurPositif",
      ];

      const contractInstances = {};

      for (const contractName of contractNames) {
        try {
          const contractArtifact = await import(`./contracts/${contractName}.json`);
          const contractInstance = await getContract(web3, contractArtifact);
          contractInstances[contractName] = contractInstance;
        } catch (err) {
          console.log(`Failed to load ${contractName}:`, err);
        }
      }

      setContracts(contractInstances);
    } catch (err) {
      console.log("Failed to load contracts:", err);
    }
  };



  return {
    ...web3State,
    contracts,
  };
};
