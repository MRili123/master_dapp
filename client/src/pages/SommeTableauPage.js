import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SommeTableauJSON from "../contracts/SommeTableau.json";
import { Link } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "540px",
    margin: "40px auto",
    padding: "32px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
    fontFamily: "Segoe UI, Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.8rem",
    color: "#1a237e",
    marginBottom: "24px",
    fontWeight: 700,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  label: {
    fontWeight: 600,
    color: "#333",
  },
  input: {
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    width: "100px",
    marginRight: "12px",
  },
  button: {
    background: "#3949ab",
    color: "#fff",
    padding: "10px 18px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    transition: "background 0.2s",
  },
  section: {
    background: "#f4f6f8",
    borderRadius: "10px",
    padding: "16px",
    marginTop: "20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#1976d2",
    marginBottom: "10px",
  },
  info: {
    margin: "4px 0",
    fontSize: "0.95rem",
    color: "#222",
    wordBreak: "break-word",
  },
  link: {
    display: "block",
    marginTop: "28px",
    textAlign: "center",
    color: "#1976d2",
    fontWeight: 600,
    textDecoration: "none",
  },
};

function SommeTableauPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [ajoutResult, setAjoutResult] = useState("");
  const [index, setIndex] = useState("");
  const [element, setElement] = useState("");
  const [tableau, setTableau] = useState([]);
  const [somme, setSomme] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        let web3Instance;
        if (window.ethereum) {
          web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } else {
          web3Instance = new Web3("http://localhost:7545");
        }

        const userAccounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccounts(userAccounts);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = SommeTableauJSON.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3Instance.eth.Contract(
            SommeTableauJSON.abi,
            deployedNetwork.address
          );
          setContract(instance);

          const block = await web3Instance.eth.getBlock("latest");
          setLatestBlock(block);
        } else {
          setError("Le contrat SommeTableau n'est pas déployé sur ce réseau.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur d'initialisation : " + err.message);
      }
    };

    init();
  }, []);

  const handleAjouterNombre = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods
        .ajouterNombre(nombre)
        .send({ from: accounts[0] });

      const tx = await web3.eth.getTransaction(receipt.transactionHash);
      const block = await web3.eth.getBlock(receipt.blockNumber);

      setTransaction(tx);
      setLatestBlock(block);

      setAjoutResult("Nombre ajouté avec succès");
      setNombre("");
    } catch (err) {
      console.error(err);
      setAjoutResult("Erreur lors de l'ajout");
    }
  };

  const handleGetElement = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.getElement(index).call();
      setElement(result);

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);
      setTransaction(null);
    } catch (err) {
      console.error(err);
      setElement("Erreur lors de la récupération");
    }
  };

  const handleAfficheTableau = async () => {
    try {
      const result = await contract.methods.afficheTableau().call();
      setTableau(result);

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);
      setTransaction(null);
    } catch (err) {
      console.error(err);
      setTableau([]);
    }
  };

  const handleCalculerSomme = async () => {
    try {
      const result = await contract.methods.calculerSomme().call();
      setSomme(result);

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);
      setTransaction(null);
    } catch (err) {
      console.error(err);
      setSomme("Erreur");
    }
  };

  const blockTimestamp = latestBlock?.timestamp
    ? new Date(Number(latestBlock.timestamp) * 1000).toLocaleString()
    : "Non disponible";

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Exercice 6 : Somme Tableau</div>

      <form style={styles.form} onSubmit={handleAjouterNombre}>
        <label style={styles.label}>
          Nombre à ajouter:
          <input
            type="number"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          Ajouter
        </button>
        {ajoutResult && <p style={ajoutResult.startsWith("Erreur") ? { color: "#e53e3e", marginTop: 4 } : { color: "#38a169", marginTop: 4 }}>{ajoutResult}</p>}
      </form>

      <form style={styles.form} onSubmit={handleGetElement}>
        <label style={styles.label}>
          Index de l'élément:
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          Obtenir l'élément
        </button>
        {element !== "" && (
  <p
    style={
      typeof element === "string" && element.startsWith("Erreur")
        ? { color: "#e53e3e", marginTop: 4 }
        : { color: "#38a169", marginTop: 4 }
    }
  >
    Élément : {element.toString()}
  </p>
)}

      </form>

      <div style={styles.section}>
        <button onClick={handleAfficheTableau} style={styles.button}>
          Afficher le tableau
        </button>
        {tableau.length > 0 && <p style={styles.info}>Tableau : [{tableau.join(", ")}]</p>}
      </div>

      <div style={styles.section}>
        <button onClick={handleCalculerSomme} style={styles.button}>
          Calculer la somme
        </button>
        {somme && <p style={somme === "Erreur" ? { color: "#e53e3e", marginTop: 4 } : { color: "#38a169", marginTop: 4 }}>{`Somme : ${somme}`}</p>}
      </div>

      {latestBlock && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Informations du bloc</div>
          <p style={styles.info}>
            <strong>Numéro du bloc:</strong> {latestBlock.number}
          </p>
          <p style={styles.info}>
            <strong>Hash:</strong> {latestBlock.hash}
          </p>
          <p style={styles.info}>
            <strong>Timestamp:</strong> {blockTimestamp}
          </p>
          <p style={styles.info}>
            <strong>Parent Hash:</strong> {latestBlock.parentHash}
          </p>
          <p style={styles.info}>
            <strong>Nonce:</strong> {latestBlock.nonce}
          </p>
          <p style={styles.info}>
            <strong>Transaction Count:</strong> {latestBlock.transactions.length}
          </p>
          <p style={styles.info}>
            <strong>Miner:</strong> {latestBlock.miner}
          </p>
          <p style={styles.info}>
            <strong>Gas Limit:</strong> {latestBlock.gasLimit}
          </p>
          <p style={styles.info}>
            <strong>Gas Used:</strong> {latestBlock.gasUsed}
          </p>
          <p style={styles.info}>
            <strong>Size:</strong> {latestBlock.size}
          </p>
        </div>
      )}

      {transaction && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Détails de la transaction</div>
          <p style={styles.info}>
            <strong>Hash:</strong> {transaction.hash}
          </p>
          <p style={styles.info}>
            <strong>Bloc:</strong> {transaction.blockNumber}
          </p>
          <p style={styles.info}>
            <strong>Expéditeur:</strong> {transaction.from}
          </p>
          <p style={styles.info}>
            <strong>Destinataire:</strong> {transaction.to}
          </p>
          <p style={styles.info}>
            <strong>Montant:</strong> {web3.utils.fromWei(transaction.value, "ether")} ETH
          </p>
          <p style={styles.info}>
            <strong>Nonce:</strong> {transaction.nonce}
          </p>
          <p style={styles.info}>
            <strong>Gas utilisé:</strong> {transaction.gas}
          </p>
          <p style={styles.info}>
            <strong>Prix du Gas:</strong> {web3.utils.fromWei(transaction.gasPrice, "gwei")} Gwei
          </p>
          <p style={styles.info}>
            <strong>Nom du contrat:</strong> SommeTableau
          </p>
        </div>
      )}

      <Link to="/" style={styles.link}>
        ← Retour au sommaire
      </Link>
    </div>
  );
}

export default SommeTableauPage;
