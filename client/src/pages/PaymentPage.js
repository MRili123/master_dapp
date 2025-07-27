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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            padding: '40px 0'
        }}>
            <div style={{
                maxWidth: 480,
                margin: '0 auto',
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: 32
            }}>
                <h2 style={{
                    textAlign: 'center',
                    color: '#2d3a4b',
                    marginBottom: 24,
                    letterSpacing: 1
                }}>Exercice 4 : Payment</h2>
                <div style={{
                    background: '#f0f4f8',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 24,
                    fontSize: 15
                }}>
                    <strong>Destinataire :</strong> <span style={{ color: '#007bff' }}>{recipient}</span>
                </div>
                {/* Formulaire de paiement */}
                <form onSubmit={handlePayment} style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Montant à envoyer (en Ether) :
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            min="0.000000000000000001"
                            step="any"
                            style={{
                                display: 'block',
                                width: '100%',
                                marginTop: 8,
                                padding: '10px 12px',
                                borderRadius: 6,
                                border: '1px solid #cfd8dc',
                                fontSize: 16,
                                background: '#f9fafb'
                            }}
                            placeholder="0.01"
                        />
                    </label>
                    <button type="submit" style={{
                        width: '100%',
                        marginTop: 16,
                        padding: '12px 0',
                        background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}>
                        Envoyer le paiement
                    </button>
                </form>
                {/* Bouton de retrait */}
                <div style={{ marginBottom: 24 }}>
                    <button onClick={handleWithdraw} style={{
                        width: '100%',
                        padding: '12px 0',
                        background: 'linear-gradient(90deg, #28a745 0%, #218838 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 16,
                        cursor: 'pointer',
                        marginBottom: 8,
                        transition: 'background 0.2s'
                    }}>
                        Retirer les fonds (pour le destinataire)
                    </button>
                    {withdrawResult && <p style={{
                        color: withdrawResult.startsWith('Erreur') ? '#dc3545' : '#28a745',
                        margin: 0,
                        fontWeight: 500
                    }}>{withdrawResult}</p>}
                </div>
                {/* Infos Blockchain */}
                <div style={{
                    background: '#f8fafc',
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 24,
                    fontSize: 15
                }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2d3a4b', fontSize: 17 }}>Infos Blockchain</h3>
                    <p style={{ margin: 0 }}>
                        <strong>Compte connecté :</strong> <span style={{ color: '#007bff' }}>{accounts[0]}</span>
                    </p>
                    <p style={{ margin: 0 }}>
                        <strong>Dernier bloc :</strong> <span style={{ color: '#007bff' }}>{latestBlock}</span>
                    </p>
                </div>
                {/* Infos transaction */}
                {txHash && (
                    <div style={{
                        background: '#e9f7ef',
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 24,
                        fontSize: 15
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#218838', fontSize: 17 }}>Détails de la dernière transaction</h3>
                        <p style={{ margin: 0 }}>
                            <strong>Transaction Hash :</strong> <span style={{ wordBreak: 'break-all' }}>{txHash}</span>
                        </p>
                        <p style={{ margin: 0 }}>
                            <strong>Gas utilisé :</strong> {gasUsed}
                        </p>
                    </div>
                )}
                {/* Lien vers sommaire */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Link to="/" style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: 15
                    }}>← Retour au sommaire</Link>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;