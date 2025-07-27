import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SommeTableauJSON from '../contracts/SommeTableau.json';
import { Link } from 'react-router-dom';

function SommeTableauPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ajoutResult, setAjoutResult] = useState('');
  const [index, setIndex] = useState('');
  const [element, setElement] = useState('');
  const [tableau, setTableau] = useState([]);
  const [somme, setSomme] = useState('');
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
      const deployedNetwork = SommeTableauJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          SommeTableauJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
      } else {
        alert('SommeTableau contract is not deployed on this network.');
      }
    };
    init();
  }, []);

  const handleAjouterNombre = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods.ajouterNombre(nombre).send({ from: accounts[0] });
      setAjoutResult('Nombre ajouté avec succès');
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed);
      setNombre('');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      setAjoutResult('Erreur lors de l\'ajout');
    }
  };

  const handleGetElement = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.getElement(index).call();
      setElement(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      setElement('Erreur lors de la récupération');
    }
  };

  const handleAfficheTableau = async () => {
    try {
      const result = await contract.methods.afficheTableau().call();
      setTableau(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      setTableau([]);
    }
  };

  const handleCalculerSomme = async () => {
    try {
      const result = await contract.methods.calculerSomme().call();
      setSomme(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      setSomme('Erreur');
    }
  };

  return (
    <div>
      <h2>Exercice 6 : Somme Tableau</h2>
      {/* Ajouter un nombre */}
      <form onSubmit={handleAjouterNombre}>
        <label>
          Nombre à ajouter :
          <input type="number" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <button type="submit">Ajouter</button>
      </form>
      {ajoutResult && <p>{ajoutResult}</p>}
      {/* Récupérer un élément */}
      <form onSubmit={handleGetElement}>
        <label>
          Index de l'élément :
          <input type="number" value={index} onChange={(e) => setIndex(e.target.value)} required />
        </label>
        <button type="submit">Obtenir l'élément</button>
      </form>
      {element && <p>Élément : {element}</p>}
      {/* Afficher le tableau */}
      <div>
        <button onClick={handleAfficheTableau}>Afficher le tableau</button>
        {tableau.length > 0 && <p>Tableau : [{tableau.join(', ')}]</p>}
      </div>
      {/* Calculer la somme */}
      <div>
        <button onClick={handleCalculerSomme}>Calculer la somme</button>
        {somme && <p>Somme : {somme}</p>}
      </div>
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

export default SommeTableauPage;