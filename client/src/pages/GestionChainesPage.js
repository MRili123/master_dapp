import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GestionChainesJSON from '../contracts/GestionChaines.json';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 32,
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: 32,
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
    background: '#f7fafc',
    padding: 18,
    borderRadius: 10,
    border: '1px solid #e2e8f0',
  },
  label: {
    fontWeight: 500,
    color: '#4a5568',
    marginBottom: 4,
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: '1px solid #cbd5e1',
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    background: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 0',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 6,
    transition: 'background 0.2s',
  },
  buttonSecondary: {
    background: '#4a5568',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 0',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 6,
    transition: 'background 0.2s',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
  },
  resultBox: {
    background: '#e6fffa',
    border: '1px solid #b2f5ea',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    color: '#234e52',
    fontWeight: 500,
  },
  infoBox: {
    background: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    color: '#2d3748',
    fontSize: 15,
    wordBreak: 'break-word',
  },
  link: {
    display: 'inline-block',
    marginTop: 24,
    color: '#3182ce',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16,
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '24px 0',
  },
};

function GestionChainesPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [concatA, setConcatA] = useState('');
  const [concatB, setConcatB] = useState('');
  const [concatResult, setConcatResult] = useState('');
  const [concatAvec, setConcatAvec] = useState('');
  const [concatAvecResult, setConcatAvecResult] = useState('');
  const [longueurStr, setLongueurStr] = useState('');
  const [longueurResult, setLongueurResult] = useState('');
  const [comparerA, setComparerA] = useState('');
  const [comparerB, setComparerB] = useState('');
  const [comparerResult, setComparerResult] = useState('');
  const [txHash, setTxHash] = useState('');
  const [gasUsed, setGasUsed] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);

  // Helper to format timestamp
const formatTimestamp = (timestamp) =>
  timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : '';


  useEffect(() => {
    const init = async () => {
      try {
        let web3Instance;
        let accountsList;
        if (window.ethereum) {
          web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          accountsList = await web3Instance.eth.getAccounts();
        } else {
          web3Instance = new Web3('http://localhost:7545');
          accountsList = await web3Instance.eth.getAccounts();
        }
        setWeb3(web3Instance);
        setAccounts(accountsList);
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = GestionChainesJSON.networks[networkId];
        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            GestionChainesJSON.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          const block = await web3Instance.eth.getBlock('latest');
          setLatestBlock(block);

          const msg = await contractInstance.methods.getMessage().call();
          setMessage(msg);
        } else {
          alert('GestionChaines contract is not deployed on this network.');
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'initialisation de Web3 ou du contrat.");
      }
    };
    init();
  }, []);

  const updateBlockAndTxDetails = async (txHash) => {
    if (!web3) return;
    try {
      const tx = await web3.eth.getTransaction(txHash);
      setTransaction(tx);

      if (tx && tx.blockNumber) {
        const block = await web3.eth.getBlock(tx.blockNumber);
        setLatestBlock(block);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la transaction ou du bloc:', err);
    }
  };

  const handleSetMessage = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed);
      const msg = await contract.methods.getMessage().call();
      setMessage(msg);
      await updateBlockAndTxDetails(receipt.transactionHash);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de setMessage');
    }
  };

  // Your other handlers remain the same but fetch latest block and clear transaction for call methods

  // For brevity, only handleGetMessage shown below, others similar:
  const handleGetMessage = async () => {
    try {
      const msg = await contract.methods.getMessage().call();
      setMessage(msg);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block);
      setTransaction(null);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de getMessage');
    }
  };

  // ... (handleConcatener, handleConcatenerAvec, handleLongueur, handleComparer similar, omitted here for brevity)

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Exercice 3 : Gestion des chaînes</h2>

      {/* setMessage */}
      <div style={styles.section}>
        <form onSubmit={handleSetMessage} style={styles.form}>
          <label style={styles.label}>
            Nouveau message :
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
              style={styles.input}
              placeholder="Entrez un nouveau message"
            />
          </label>
          <button type="submit" style={styles.button}>Définir le message</button>
        </form>
      </div>

      {/* getMessage */}
      <div style={styles.section}>
        <button onClick={handleGetMessage} style={styles.buttonSecondary}>Afficher le message actuel</button>
        <div style={styles.resultBox}>
          <strong>Message actuel :</strong> {message}
        </div>
      </div>

      {/* ... (Other form sections omitted for brevity) */}

      <hr style={styles.hr} />

      {/* Block Information */}
      {latestBlock && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Informations du bloc</div>
          <p><strong>Numéro du bloc:</strong> {latestBlock.number}</p>
          <p><strong>Hash:</strong> {latestBlock.hash}</p>
          <p><strong>Timestamp:</strong> {formatTimestamp(latestBlock.timestamp)}</p>
          <p><strong>Parent Hash:</strong> {latestBlock.parentHash}</p>
          <p><strong>Nonce:</strong> {latestBlock.nonce}</p>
          <p><strong>Transaction Count:</strong> {latestBlock.transactions.length}</p>
          <p><strong>Miner:</strong> {latestBlock.miner}</p>
          <p><strong>Gas Limit:</strong> {latestBlock.gasLimit}</p>
          <p><strong>Gas Used:</strong> {latestBlock.gasUsed}</p>
          <p><strong>Size:</strong> {latestBlock.size}</p>
        </div>
      )}

      {/* Transaction Information */}
      {transaction && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Détails de la transaction</div>
          <p><strong>Numéro:</strong> {transaction.transactionIndex}</p>
          <p><strong>Expéditeur:</strong> {transaction.from}</p>
          <p><strong>Destinataire:</strong> {transaction.to}</p>
          <p><strong>Hash:</strong> {transaction.hash}</p>
          <p><strong>Nonce:</strong> {transaction.nonce}</p>
          <p><strong>Montant:</strong> {web3.utils.fromWei(transaction.value || '0', "ether")} ETH</p>
          <p><strong>Gas Price:</strong> {web3.utils.fromWei(transaction.gasPrice || '0', "gwei")} Gwei</p>
          <p><strong>Limite de gas:</strong> {transaction.gas}</p>
          <p><strong>Bloc:</strong> {transaction.blockNumber}</p>
          <p><strong>Horodatage:</strong> {formatTimestamp(latestBlock?.timestamp)}</p>
          <p><strong>Fonction appelée:</strong> setMessage</p>
          <p><strong>Nom du contrat:</strong> GestionChaines</p>
        </div>
      )}

      {/* Connected account info */}
      <div style={styles.infoBox}>
        <strong>Compte connecté :</strong> <span style={{ color: '#3182ce' }}>{accounts[0]}</span>
      </div>

      <Link to="/" style={styles.link}>← Retour au sommaire</Link>
    </div>
  );
}

export default GestionChainesPage;
