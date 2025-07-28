import { useState, useEffect } from "react";
import { initWeb3, getContract } from "../utils/web3Utils";

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState({
    web3: null,
    accounts: [],
    networkId: null,
    currentAccount: "",
    isConnected: false,
  });

  const [contracts, setContracts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Connecting to blockchain...");
        const web3Instance = await initWeb3();

        const accounts = await web3Instance.eth.getAccounts();
        console.log("Found accounts:", accounts);

        const networkId = await web3Instance.eth.net.getId();
        console.log("Connected to network:", networkId);

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
        setError(err instanceof Error ? err.message : "Failed to connect to blockchain");
      } finally {
        setLoading(false);
      }
    };

    initializeWeb3();
  }, []);

  const loadContracts = async (web3) => {
    try {
      console.log("Loading contract instances...");

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
          const contractArtifact = await import(`../contracts/${contractName}.json`);
          const contractInstance = await getContract(web3, contractArtifact);
          contractInstances[contractName] = contractInstance;
          console.log(`Loaded ${contractName} contract`);
        } catch (err) {
          console.warn(`Failed to load ${contractName}:`, err);
        }
      }

      setContracts(contractInstances);
      console.log("All contracts loaded successfully");
    } catch (err) {
      console.error("Failed to load contracts:", err);
      setError("Failed to load smart contracts");
    }
  };

  const refreshAccounts = async () => {
    if (web3State.web3) {
      try {
        const accounts = await web3State.web3.eth.getAccounts();
        setWeb3State((prev) => ({
          ...prev,
          accounts,
          currentAccount: accounts[0],
          isConnected: accounts.length > 0,
        }));
      } catch (err) {
        console.error("Failed to refresh accounts:", err);
      }
    }
  };

  return {
    ...web3State,
    contracts,
    loading,
    error,
    refreshAccounts,

    hasContracts: Object.keys(contracts).length > 0,
    isReady: web3State.isConnected && Object.keys(contracts).length > 0,
  };
};
