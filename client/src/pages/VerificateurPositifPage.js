import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VerificateurPositifJSON from '../contracts/VerificateurPositif.json';
import { Link } from 'react-router-dom';

function VerificateurPositifPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [nombre, setNombre] = useState('');
  const [result, setResult] = useState('');
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
      const deployedNetwork = VerificateurPositifJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          VerificateurPositifJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
      } else {
        alert('VerificateurPositif contract is not deployed on this network.');
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.estPositif(nombre).call();
      setResult(result ? 'Positif' : 'Négatif');
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la vérification du signe');
    }
  };

  return (
    <div>
      <h2>Exercice 8 : Vérificateur Positif</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre :
          <input type="number" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <button type="submit">Vérifier le signe</button>
      </form>
      {result && (
        <div>
          <h3>Résultat :</h3>
          <p>{result}</p>
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

export default VerificateurPositifPage;