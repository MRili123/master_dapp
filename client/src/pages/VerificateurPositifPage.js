import React, { useState, useEffect } from "react";
import Web3 from "web3";
import VerificateurPositifJSON from "../contracts/VerificateurPositif.json";
import { Link } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "32px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
    fontFamily: "Segoe UI, Arial, sans-serif",
  },
  heading: {
    color: "#1a237e",
    marginBottom: "24px",
    fontWeight: 700,
    fontSize: "1.5rem",
    letterSpacing: "0.5px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "28px",
  },
  label: {
    fontWeight: 500,
    color: "#333",
    marginBottom: "6px",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #bdbdbd",
    borderRadius: "6px",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    background: "linear-gradient(90deg,#3949ab 0,#1976d2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "12px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background 0.2s",
  },
  section: {
    background: "#f5f7fa",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "18px",
    boxShadow: "0 1px 4px rgba(60,60,60,0.04)",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  sectionTitle: {
    color: "#1976d2",
    fontWeight: 600,
    marginBottom: "8px",
    fontSize: "1.1rem",
  },
  info: {
    color: "#222",
    fontSize: "1rem",
    margin: "4px 0",
    wordBreak: "break-word",
  },
  link: {
    display: "inline-block",
    marginTop: "18px",
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    transition: "color 0.2s",
  },
};

function VerificateurPositifPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [result, setResult] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        let web3Instance;
        let accountsList;
        if (window.ethereum) {
          web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          accountsList = await web3Instance.eth.getAccounts();
        } else {
          web3Instance = new Web3("http://localhost:7545");
          accountsList = await web3Instance.eth.getAccounts();
        }

        setWeb3(web3Instance);
        setAccounts(accountsList);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = VerificateurPositifJSON.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3Instance.eth.Contract(
            VerificateurPositifJSON.abi,
            deployedNetwork.address
          );
          setContract(instance);

          const block = await web3Instance.eth.getBlock("latest");
          setLatestBlock(block);
        } else {
          setError(
            "Le contrat VerificateurPositif n'est pas déployé sur ce réseau."
          );
        }
      } catch (err) {
        setError("Erreur d'initialisation : " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !accounts.length) {
      alert("Contrat ou comptes introuvables.");
      return;
    }
    setError("");
    try {
      const receipt = await contract.methods
        .estPositif(nombre)
        .send({ from: accounts[0] });

      const positiveResult = await contract.methods.estPositif(nombre).call();

      setResult(positiveResult ? "Positif" : "Négatif");

      const tx = await web3.eth.getTransaction(receipt.transactionHash);
      const block = await web3.eth.getBlock(receipt.blockNumber);

      setTransaction(tx);
      setLatestBlock(block);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la transaction : " + err.message);
    }
  };

  const blockTimestamp = latestBlock?.timestamp
    ? new Date(Number(latestBlock.timestamp) * 1000).toLocaleString()
    : "Non disponible";

  if (loading) {
    return <div style={styles.container}>⏳ Connexion à la blockchain...</div>;
  }

  if (error) {
    return <div style={styles.container}>❌ {error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Exercice 8 : Vérificateur Positif</div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Nombre :
          <input
            type="number"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={styles.input}
            placeholder="Entrez un nombre"
          />
        </label>
        <button type="submit" style={styles.button}>
          Vérifier le signe
        </button>
      </form>

      {result && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Résultat :</div>
          <div style={styles.info}>{result}</div>
        </div>
      )}

      {latestBlock && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Informations du bloc</div>
          <p>
            <strong>Numéro du bloc:</strong> {latestBlock.number}
          </p>
          <p>
            <strong>Hash:</strong> {latestBlock.hash}
          </p>
          <p>
            <strong>Timestamp:</strong> {blockTimestamp}
          </p>
          <p>
            <strong>Parent Hash:</strong> {latestBlock.parentHash}
          </p>
          <p>
            <strong>Nonce:</strong> {latestBlock.nonce}
          </p>
          <p>
            <strong>Transaction Count:</strong> {latestBlock.transactions.length}
          </p>
          <p>
            <strong>Miner:</strong> {latestBlock.miner}
          </p>
          <p>
            <strong>Gas Limit:</strong> {latestBlock.gasLimit}
          </p>
          <p>
            <strong>Gas Used:</strong> {latestBlock.gasUsed}
          </p>
          <p>
            <strong>Size:</strong> {latestBlock.size}
          </p>
        </div>
      )}

      {transaction && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Détails de la transaction</div>
          <p>
            <strong>Hash:</strong> {transaction.hash}
          </p>
          <p>
            <strong>Bloc:</strong> {transaction.blockNumber}
          </p>
          <p>
            <strong>Expéditeur:</strong> {transaction.from}
          </p>
          <p>
            <strong>Destinataire:</strong> {transaction.to}
          </p>
          <p>
            <strong>Montant:</strong>{" "}
            {web3.utils.fromWei(transaction.value || "0", "ether")} ETH
          </p>
          <p>
            <strong>Nonce:</strong> {transaction.nonce}
          </p>
          <p>
            <strong>Gas utilisé:</strong> {transaction.gas}
          </p>
          <p>
            <strong>Prix du Gas:</strong>{" "}
            {web3.utils.fromWei(transaction.gasPrice, "gwei")} Gwei
          </p>
        </div>
      )}

      <Link to="/" style={styles.link}>
        ← Retour au sommaire
      </Link>
    </div>
  );
}

export default VerificateurPositifPage;
