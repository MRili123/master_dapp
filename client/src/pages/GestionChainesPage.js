
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GestionChainesJSON from '../contracts/GestionChaines.json';
import { Link } from 'react-router-dom';

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
  const [latestBlock, setLatestBlock] = useState(null);

  useEffect(() => {
    const init = async () => {
      let web3;
      let accounts;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
      } else {
        web3 = new Web3('http://localhost:7545');
        accounts = await web3.eth.getAccounts();
      }
      setWeb3(web3);
      setAccounts(accounts);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GestionChainesJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          GestionChainesJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
        // Get current message
        const msg = await contract.methods.getMessage().call();
        setMessage(msg);
      } else {
        alert('GestionChaines contract is not deployed on this network.');
      }
    };
    init();
  }, []);

  const handleSetMessage = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed);
      const msg = await contract.methods.getMessage().call();
      setMessage(msg);
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de setMessage');
    }
  };

  const handleGetMessage = async () => {
    try {
      const msg = await contract.methods.getMessage().call();
      setMessage(msg);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de getMessage');
    }
  };

  const handleConcatener = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.concatener(concatA, concatB).call();
      setConcatResult(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de concatener');
    }
  };

  const handleConcatenerAvec = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.concatenerAvec(concatAvec).call();
      setConcatAvecResult(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de concatenerAvec');
    }
  };

  const handleLongueur = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.longueur(longueurStr).call();
      setLongueurResult(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de longueur');
    }
  };

  const handleComparer = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.comparer(comparerA, comparerB).call();
      setComparerResult(result ? 'Identiques' : 'Différents');
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de comparer');
    }
  };

  return (
    <div>
      <h2>Exercice 3 : Gestion des chaînes</h2>
      {/* setMessage */}
      <form onSubmit={handleSetMessage}>
        <label>
          Nouveau message :
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required />
        </label>
        <button type="submit">Définir le message</button>
      </form>
      {/* getMessage */}
      <div>
        <button onClick={handleGetMessage}>Afficher le message actuel</button>
        <p>Message actuel : {message}</p>
      </div>
      {/* concatener */}
      <form onSubmit={handleConcatener}>
        <label>
          Chaîne A :
          <input type="text" value={concatA} onChange={(e) => setConcatA(e.target.value)} required />
        </label>
        <label>
          Chaîne B :
          <input type="text" value={concatB} onChange={(e) => setConcatB(e.target.value)} required />
        </label>
        <button type="submit">Concaténer</button>
      </form>
      {concatResult && (
        <div>
          <h3>Résultat concaténation :</h3>
          <p>{concatResult}</p>
        </div>
      )}
      {/* concatenerAvec */}
      <form onSubmit={handleConcatenerAvec}>
        <label>
          Chaîne à concaténer avec le message :
          <input type="text" value={concatAvec} onChange={(e) => setConcatAvec(e.target.value)} required />
        </label>
        <button type="submit">Concaténer avec message</button>
      </form>
      {concatAvecResult && (
        <div>
          <h3>Résultat concaténation avec message :</h3>
          <p>{concatAvecResult}</p>
        </div>
      )}
      {/* longueur */}
      <form onSubmit={handleLongueur}>
        <label>
          Chaîne pour longueur :
          <input type="text" value={longueurStr} onChange={(e) => setLongueurStr(e.target.value)} required />
        </label>
        <button type="submit">Calculer longueur</button>
      </form>
      {longueurResult && (
        <div>
          <h3>Longueur :</h3>
          <p>{longueurResult}</p>
        </div>
      )}
      {/* comparer */}
      <form onSubmit={handleComparer}>
        <label>
          Chaîne A :
          <input type="text" value={comparerA} onChange={(e) => setComparerA(e.target.value)} required />
        </label>
        <label>
          Chaîne B :
          <input type="text" value={comparerB} onChange={(e) => setComparerB(e.target.value)} required />
        </label>
        <button type="submit">Comparer</button>
      </form>
      {comparerResult && (
        <div>
          <h3>Résultat comparaison :</h3>
          <p>{comparerResult}</p>
        </div>
      )}
      {/* Infos Blockchain */}
      <div>
        <h3>Infos Blockchain</h3>
        <p>Compte connecté : {accounts[0]}</p>
        <p>Dernier bloc : {latestBlock}</p>
      </div>
      {/* Infos transaction */}
      {txHash && (
        <div>
          <h3>Détails de la dernière transaction</h3>
          <p>Transaction Hash : {txHash}</p>
          <p>Gas utilisé : {gasUsed}</p>
        </div>
      )}
      {/* Lien vers sommaire */}
      <br />
      <Link to="/">← Retour au sommaire</Link>
    </div>
  );
}

export default GestionChainesPage;
