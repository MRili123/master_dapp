import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ConvertisseurJSON from '../contracts/Convertisseur.json';
import { Link } from 'react-router-dom';

function ConvertisseurPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ether, setEther] = useState('');
  const [wei, setWei] = useState('');
  const [resultEtherToWei, setResultEtherToWei] = useState('');
  const [resultWeiToEther, setResultWeiToEther] = useState('');
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
      const deployedNetwork = ConvertisseurJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          ConvertisseurJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
      } else {
        alert('Convertisseur contract is not deployed on this network.');
      }
    };
    init();
  }, []);

  const handleEtherToWei = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.etherEnWei(ether).call();
      setResultEtherToWei(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la conversion Ether -> Wei');
    }
  };

  const handleWeiToEther = async (e) => {
    e.preventDefault();
    try {
      const result = await contract.methods.weiEnEther(wei).call();
      setResultWeiToEther(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la conversion Wei -> Ether');
    }
  };

  return (
    <div>
      <h2>Exercice 2 : Convertisseur</h2>
      {/* Formulaire Ether -> Wei */}
      <form onSubmit={handleEtherToWei}>
        <label>
          Montant en Ether :
          <input type="number" value={ether} onChange={(e) => setEther(e.target.value)} required />
        </label>
        <button type="submit">Convertir en Wei</button>
      </form>
      {resultEtherToWei && (
        <div>
          <h3>Résultat Ether → Wei :</h3>
          <p>{resultEtherToWei} Wei</p>
        </div>
      )}
      {/* Formulaire Wei -> Ether */}
      <form onSubmit={handleWeiToEther}>
        <label>
          Montant en Wei :
          <input type="number" value={wei} onChange={(e) => setWei(e.target.value)} required />
        </label>
        <button type="submit">Convertir en Ether</button>
      </form>
      {resultWeiToEther && (
        <div>
          <h3>Résultat Wei → Ether :</h3>
          <p>{resultWeiToEther} Ether</p>
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

export default ConvertisseurPage;