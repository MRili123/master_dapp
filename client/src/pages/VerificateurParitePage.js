import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VerificateurPariteJSON from '../contracts/VerificateurParite.json';
import { Link } from 'react-router-dom';

function VerificateurParitePage() {
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
            const deployedNetwork = VerificateurPariteJSON.networks[networkId];
            if (deployedNetwork) {
                const contract = new web3.eth.Contract(
                    VerificateurPariteJSON.abi,
                    deployedNetwork.address
                );
                setContract(contract);
                const block = await web3.eth.getBlock('latest');
                setLatestBlock(block.number);
            } else {
                alert('VerificateurParite contract is not deployed on this network.');
            }
        };
        init();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.estPair(nombre).call();
            setResult(result ? 'Pair' : 'Impair');
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la vérification de parité');
        }
    };

    // Inline styles for a professional look
    const styles = {
        container: {
            maxWidth: '480px',
            margin: '40px auto',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '32px 28px',
            fontFamily: 'Segoe UI, Arial, sans-serif',
        },
        title: {
            textAlign: 'center',
            color: '#2d3748',
            marginBottom: '24px',
            fontWeight: 700,
            fontSize: '1.6rem',
            letterSpacing: '0.5px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
        },
        label: {
            fontWeight: 500,
            color: '#4a5568',
            marginBottom: '6px',
        },
        input: {
            padding: '10px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border 0.2s',
        },
        button: {
            background: 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'background 0.2s',
        },
        section: {
            background: '#f7fafc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        },
        result: {
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#3182ce',
            marginTop: '8px',
        },
        infoLabel: {
            fontWeight: 500,
            color: '#2d3748',
        },
        infoValue: {
            color: '#4a5568',
            marginLeft: '6px',
        },
        link: {
            display: 'inline-block',
            marginTop: '18px',
            color: '#5a67d8',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s',
        },
        hr: {
            border: 'none',
            borderTop: '1px solid #e2e8f0',
            margin: '18px 0',
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Exercice 7 : Vérificateur Parité</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Nombre :
                    <input
                        type="number"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={styles.input}
                        min="0"
                        placeholder="Entrez un nombre"
                    />
                </label>
                <button type="submit" style={styles.button}>
                    Vérifier la parité
                </button>
            </form>
            {result && (
                <div style={styles.section}>
                    <h3 style={styles.infoLabel}>Résultat :</h3>
                    <p style={styles.result}>{result}</p>
                </div>
            )}
            <div style={styles.section}>
                <h3 style={styles.infoLabel}>Infos Blockchain</h3>
                <p>
                    <span style={styles.infoLabel}>Compte connecté :</span>
                    <span style={styles.infoValue}>{accounts[0]}</span>
                </p>
                <p>
                    <span style={styles.infoLabel}>Dernier bloc :</span>
                    <span style={styles.infoValue}>{latestBlock}</span>
                </p>
            </div>
            {txHash && (
                <div style={styles.section}>
                    <h3 style={styles.infoLabel}>Détails de la dernière transaction</h3>
                    <p>
                        <span style={styles.infoLabel}>Transaction Hash :</span>
                        <span style={styles.infoValue}>{txHash}</span>
                    </p>
                    <p>
                        <span style={styles.infoLabel}>Gas utilisé :</span>
                        <span style={styles.infoValue}>{gasUsed}</span>
                    </p>
                </div>
            )}
            <hr style={styles.hr} />
            <Link to="/" style={styles.link}>← Retour au sommaire</Link>
        </div>
    );
}

export default VerificateurParitePage;