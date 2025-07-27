import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PaymentJSON from '../contracts/Payment.json';
import { Link } from 'react-router-dom';

function PaymentPage() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [gasUsed, setGasUsed] = useState('');
  const [latestBlock, setLatestBlock] = useState(null);
  const [withdrawResult, setWithdrawResult] = useState('');

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
      const deployedNetwork = PaymentJSON.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(
          PaymentJSON.abi,
          deployedNetwork.address
        );
        setContract(contract);
        const block = await web3.eth.getBlock('latest');
        setLatestBlock(block.number);
        const rec = await contract.methods.recipient().call();
        setRecipient(rec);
      } else {
        alert('Payment contract is not deployed on this network.');
      }
    };
    init();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const receipt = await contract.methods.receivePayment().send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed);
      setWithdrawResult('');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du paiement');
    }
  };

  const handleWithdraw = async () => {
    try {
      const receipt = await contract.methods.withdraw().send({ from: accounts[0] });
      setTxHash(receipt.transactionHash);
      setGasUsed(receipt.gasUsed);
      setWithdrawResult('Retrait effectué avec succès');
      const block = await web3.eth.getBlock('latest');
      setLatestBlock(block.number);
    } catch (err) {
      console.error(err);
      setWithdrawResult("Erreur lors du retrait : " + err.message);
    }
  };

  return (
    <div>
      <h2>Exercice 4 : Payment</h2>
      <div>
        <p>Destinataire (recipient) : {recipient}</p>
      </div>
      {/* Formulaire de paiement */}
      <form onSubmit={handlePayment}>
        <label>
          Montant à envoyer (en Ether) :
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.000000000000000001" step="any" />
        </label>
        <button type="submit">Envoyer le paiement</button>
      </form>
      {/* Bouton de retrait */}
      <div>
        <button onClick={handleWithdraw}>Retirer les fonds (pour le destinataire)</button>
        {withdrawResult && <p>{withdrawResult}</p>}
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

export default PaymentPage;