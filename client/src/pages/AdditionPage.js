import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AdditionContractJSON from '../contracts/AdditionContract.json';
import { Link } from 'react-router-dom';

function AdditionPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
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
      // Get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AdditionContractJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          AdditionContractJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        // Get latest block number
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
      } else {
        alert('AdditionContract is not deployed on this network.');
      }
    };
    init();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const sum = await contract.methods
      .addition2(parseInt(a), parseInt(b))
      .call();  // use call() because it's a view/pure function

    setResult(sum);
    setTxHash('');
    setGasUsed('');
    
    // Update latest block
    const block = await web3.eth.getBlock('latest');
    setLatestBlock(block.number);
  } catch (err) {
    console.error('Error calling addition2:', err);
    alert('Erreur lors de l’exécution: ' + (err.message || err));
  }
};



  return (
    <div>
      <h2>Exercice 1 : Addition de deux variables</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <label>
          A :
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} required />
        </label>
        <br />
        <label>
          B :
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Calculer la somme</button>
      </form>

      {/* Résultat */}
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

export default AdditionPage;
