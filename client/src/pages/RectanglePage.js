import React, { useState, useEffect } from "react";
import Web3 from "web3";
import RectangleJSON from "../contracts/Rectangle.json";
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

function RectanglePage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [dx, setDx] = useState("");
  const [dy, setDy] = useState("");
  const [xy, setXY] = useState("");
  const [infos, setInfos] = useState("");
  const [surface, setSurface] = useState("");
  const [lola, setLoLa] = useState("");
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
        const deployedNetwork = RectangleJSON.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3Instance.eth.Contract(
            RectangleJSON.abi,
            deployedNetwork.address
          );
          setContract(instance);

          const block = await web3Instance.eth.getBlock("latest");
          setLatestBlock(block);
        } else {
          setError("Le contrat Rectangle n'est pas déployé sur ce réseau.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur d'initialisation : " + err.message);
      }
    };

    init();
  }, []);

  const handleDeplacer = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods
        .deplacerForme(dx, dy)
        .send({ from: accounts[0] });

      const tx = await web3.eth.getTransaction(receipt.transactionHash);
      const block = await web3.eth.getBlock(receipt.blockNumber);

      setTransaction(tx);
      setLatestBlock(block);

      setDx("");
      setDy("");
      setXY("");
      setInfos("");
      setSurface("");
      setLoLa("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors du déplacement.");
    }
  };

  const handleCall = async (method, setter, formatter = (v) => v) => {
    try {
      const result = await contract.methods[method]().call();
      setter(formatter(result));

      const block = await web3.eth.getBlock("latest");
      setLatestBlock(block);
    } catch (err) {
      console.error(err);
      alert(`Erreur lors de l'appel à ${method}`);
    }
  };

  const blockTimestamp = latestBlock?.timestamp
    ? new Date(Number(latestBlock.timestamp) * 1000).toLocaleString()
    : "Non disponible";

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Exercice 5 : Rectangle</div>

      <form style={styles.form} onSubmit={handleDeplacer}>
        <label style={styles.label}>
          dx:
          <input
            type="number"
            value={dx}
            onChange={(e) => setDx(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          dy:
          <input
            type="number"
            value={dy}
            onChange={(e) => setDy(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          Déplacer
        </button>
      </form>

      <div style={styles.section}>
        <button onClick={() => handleCall("afficheXY", setXY, (r) => `x: ${r[0]}, y: ${r[1]}`)} style={styles.button}>Afficher XY</button>
        {xy && <p style={styles.info}>{xy}</p>}
      </div>

      <div style={styles.section}>
        <button onClick={() => handleCall("afficheInfos", setInfos)} style={styles.button}>Afficher Infos</button>
        {infos && <p style={styles.info}>{infos}</p>}
      </div>

      <div style={styles.section}>
        <button onClick={() => handleCall("surface", setSurface)} style={styles.button}>Surface</button>
        {surface && <p style={styles.info}>Surface : {surface}</p>}
      </div>

      <div style={styles.section}>
        <button onClick={() => handleCall("afficheLoLa", setLoLa, (r) => `lo: ${r[0]}, la: ${r[1]}`)} style={styles.button}>Afficher LoLa</button>
        {lola && <p style={styles.info}>{lola}</p>}
      </div>

     {latestBlock && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Informations du bloc</div>
          <p><strong>Numéro du bloc:</strong> {latestBlock.number}</p>
          <p><strong>Hash:</strong> {latestBlock.hash}</p>
          <p><strong>Timestamp:</strong> {blockTimestamp}</p>
          <p><strong>Parent Hash:</strong> {latestBlock.parentHash}</p>
          <p><strong>Nonce:</strong> {latestBlock.nonce}</p>
          <p><strong>Transaction Count:</strong> {latestBlock.transactions.length}</p>
          <p><strong>Miner:</strong> {latestBlock.miner}</p>
          <p><strong>Gas Limit:</strong> {latestBlock.gasLimit}</p>
          <p><strong>Gas Used:</strong> {latestBlock.gasUsed}</p>
          <p><strong>Size:</strong> {latestBlock.size}</p>
        </div>
      )}

   {transaction && (
  <div style={styles.section}>
    <div style={styles.sectionTitle}>Détails de la transaction</div>
    <p style={styles.info}><strong>Hash:</strong> {transaction.hash}</p>
    <p style={styles.info}><strong>Bloc:</strong> {transaction.blockNumber}</p>
    <p style={styles.info}><strong>Expéditeur:</strong> {transaction.from}</p>
    <p style={styles.info}><strong>Destinataire:</strong> {transaction.to}</p>
    <p style={styles.info}><strong>Montant:</strong> {web3.utils.fromWei(transaction.value, "ether")} ETH</p>
    <p style={styles.info}><strong>Nonce:</strong> {transaction.nonce}</p>
    <p style={styles.info}><strong>Gas utilisé:</strong> {transaction.gas}</p>
    <p style={styles.info}><strong>Prix du Gas:</strong> {web3.utils.fromWei(transaction.gasPrice, "gwei")} Gwei</p>
    <p style={styles.info}><strong>Nom du contrat:</strong> Rectangle</p>
  </div>
)}


      <Link to="/" style={styles.link}>← Retour au sommaire</Link>
    </div>
  );
}

export default RectanglePage;
