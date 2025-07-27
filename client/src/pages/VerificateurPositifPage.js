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
                padding: '32px 28px'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    color: '#2d3a4b',
                    marginBottom: 24,
                    letterSpacing: 1
                }}>
                    Exercice 8 : Vérificateur Positif
                </h2>
                <form onSubmit={handleSubmit} style={{ marginBottom: 28 }}>
                    <label style={{
                        display: 'block',
                        marginBottom: 16,
                        color: '#4a5568',
                        fontWeight: 500
                    }}>
                        Nombre :
                        <input
                            type="number"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            style={{
                                marginLeft: 10,
                                padding: '8px 12px',
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                fontSize: 16,
                                width: 120,
                                outline: 'none',
                                transition: 'border 0.2s'
                            }}
                        />
                    </label>
                    <button
                        type="submit"
                        style={{
                            background: 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 28px',
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(90,103,216,0.08)',
                            transition: 'background 0.2s'
                        }}
                    >
                        Vérifier le signe
                    </button>
                </form>
                {result && (
                    <div style={{
                        background: result === 'Positif' ? '#e6fffa' : '#fff5f5',
                        border: `1.5px solid ${result === 'Positif' ? '#38b2ac' : '#f56565'}`,
                        borderRadius: 8,
                        padding: '14px 18px',
                        marginBottom: 22,
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            color: '#2d3a4b',
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 600
                        }}>Résultat :</h3>
                        <p style={{
                            color: result === 'Positif' ? '#319795' : '#e53e3e',
                            fontSize: 20,
                            fontWeight: 700,
                            margin: '8px 0 0 0'
                        }}>{result}</p>
                    </div>
                )}
                <div style={{
                    background: '#f7fafc',
                    borderRadius: 8,
                    padding: '14px 18px',
                    marginBottom: 18,
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        color: '#4a5568',
                        fontSize: 16,
                        margin: 0,
                        fontWeight: 600
                    }}>Infos Blockchain</h3>
                    <p style={{ margin: '8px 0 0 0', fontSize: 15 }}>
                        <span style={{ color: '#718096' }}>Compte connecté :</span> <span style={{ color: '#2d3a4b', fontWeight: 500 }}>{accounts[0]}</span>
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: 15 }}>
                        <span style={{ color: '#718096' }}>Dernier bloc :</span> <span style={{ color: '#2d3a4b', fontWeight: 500 }}>{latestBlock}</span>
                    </p>
                </div>
                {txHash && (
                    <div style={{
                        background: '#f7fafc',
                        borderRadius: 8,
                        padding: '14px 18px',
                        marginBottom: 18,
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{
                            color: '#4a5568',
                            fontSize: 16,
                            margin: 0,
                            fontWeight: 600
                        }}>Détails de la dernière transaction</h3>
                        <p style={{ margin: '8px 0 0 0', fontSize: 15 }}>
                            <span style={{ color: '#718096' }}>Transaction Hash :</span> <span style={{ color: '#2d3a4b', fontWeight: 500 }}>{txHash}</span>
                        </p>
                        <p style={{ margin: '2px 0 0 0', fontSize: 15 }}>
                            <span style={{ color: '#718096' }}>Gas utilisé :</span> <span style={{ color: '#2d3a4b', fontWeight: 500 }}>{gasUsed}</span>
                        </p>
                    </div>
                )}
                <div style={{ textAlign: 'center', marginTop: 18 }}>
                    <Link
                        to="/"
                        style={{
                            color: '#5a67d8',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: 15,
                            transition: 'color 0.2s'
                        }}
                    >
                        ← Retour au sommaire
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VerificateurPositifPage;