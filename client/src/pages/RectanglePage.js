import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import RectangleJSON from '../contracts/Rectangle.json';
import { Link } from 'react-router-dom';

function RectanglePage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [dx, setDx] = useState('');
  const [dy, setDy] = useState('');
  const [xy, setXY] = useState('');
  const [infos, setInfos] = useState('');
  const [surface, setSurface] = useState('');
  const [lola, setLoLa] = useState('');
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
      const deployedNetwork = RectangleJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          RectangleJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
      } else {
        alert('Rectangle contract is not deployed on this network.');
      }
    };
    init();
  }, []);

  const handleDeplacer = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods.deplacerForme(dx, dy).send({ from: accounts[0] });
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed);
      setXY('');
      setInfos('');
      setSurface('');
      setLoLa('');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du déplacement');
    }
  };

  const handleAfficheXY = async () => {
    try {
      const result = await contract.methods.afficheXY().call();
      setXY(`x: ${result[0]}, y: ${result[1]}`);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de afficheXY');
    }
  };

  const handleAfficheInfos = async () => {
    try {
      const result = await contract.methods.afficheInfos().call();
      setInfos(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de afficheInfos');
    }
  };

  const handleSurface = async () => {
    try {
      const result = await contract.methods.surface().call();
      setSurface(result);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de surface');
    }
  };

  const handleAfficheLoLa = async () => {
    try {
      const result = await contract.methods.afficheLoLa().call();
      setLoLa(`lo: ${result[0]}, la: ${result[1]}`);
      setTxHash('Appel en lecture (call)');
      setGasUsed('-');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de afficheLoLa');
    }
  };

  return (
    <div>
      <h2>Exercice 5 : Rectangle</h2>
      {/* Déplacer la forme */}
      <form onSubmit={handleDeplacer}>
        <label>
          dx :
          <input type="number" value={dx} onChange={(e) => setDx(e.target.value)} required />
        </label>
        <label>
          dy :
          <input type="number" value={dy} onChange={(e) => setDy(e.target.value)} required />
        </label>
        <button type="submit">Déplacer la forme</button>
      </form>
      {/* Afficher XY */}
      <div>
        <button onClick={handleAfficheXY}>Afficher x et y</button>
        {xy && <p>{xy}</p>}
      </div>
      {/* Afficher Infos */}
      <div>
        <button onClick={handleAfficheInfos}>Afficher infos</button>
        {infos && <p>{infos}</p>}
      </div>
      {/* Surface */}
      <div>
        <button onClick={handleSurface}>Afficher surface</button>
        {surface && <p>Surface : {surface}</p>}
      </div>
      {/* Afficher lo/la */}
      <div>
        <button onClick={handleAfficheLoLa}>Afficher lo et la</button>
        {lola && <p>{lola}</p>}
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

export default RectanglePage;