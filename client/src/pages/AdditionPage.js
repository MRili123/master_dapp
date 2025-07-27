import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AdditionContractJSON from '../contracts/AdditionContract.json';
import { Link } from 'react-router-dom';

// Simple professional CSS-in-JS styles
const styles = {
    container: {
        maxWidth: '420px',
        margin: '40px auto',
        padding: '32px',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
        fontFamily: 'Segoe UI, Arial, sans-serif',
    },
    heading: {
        color: '#1a237e',
        marginBottom: '24px',
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '0.5px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        marginBottom: '28px',
    },
    label: {
        fontWeight: 500,
        color: '#333',
        marginBottom: '6px',
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #bdbdbd',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border 0.2s',
    },
    button: {
        background: 'linear-gradient(90deg,#3949ab 0,#1976d2 100%)',
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
        background: '#f5f7fa',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '18px',
        boxShadow: '0 1px 4px rgba(60,60,60,0.04)',
    },
    sectionTitle: {
        color: '#1976d2',
        fontWeight: 600,
        marginBottom: '8px',
        fontSize: '1.1rem',
    },
    info: {
        color: '#222',
        fontSize: '1rem',
        margin: '4px 0',
        wordBreak: 'break-all',
    },
    link: {
        display: 'inline-block',
        marginTop: '18px',
        color: '#1976d2',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        transition: 'color 0.2s',
    },
};

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
                .call();

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
        <div style={styles.container}>
            <div style={styles.heading}>Exercice 1 : Addition de deux variables</div>

            <form style={styles.form} onSubmit={handleSubmit}>
                <div>
                    <label style={styles.label}>
                        A :
                        <input
                            type="number"
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            required
                            style={styles.input}
                            min="0"
                        />
                    </label>
                </div>
                <div>
                    <label style={styles.label}>
                        B :
                        <input
                            type="number"
                            value={b}
                            onChange={(e) => setB(e.target.value)}
                            required
                            style={styles.input}
                            min="0"
                        />
                    </label>
                </div>
                <button type="submit" style={styles.button}>
                    Calculer la somme
                </button>
            </form>

            {result && (
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Résultat :</div>
                    <div style={styles.info}>{result}</div>
                </div>
            )}

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Infos Blockchain</div>
                <div style={styles.info}>
                    <strong>Compte connecté :</strong> {accounts[0] || 'Non connecté'}
                </div>
                <div style={styles.info}>
                    <strong>Dernier bloc :</strong> {latestBlock || '...'}
                </div>
            </div>

            {txHash && (
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Détails de la dernière transaction</div>
                    <div style={styles.info}>
                        <strong>Transaction Hash :</strong> {txHash}
                    </div>
                    <div style={styles.info}>
                        <strong>Gas utilisé :</strong> {gasUsed}
                    </div>
                </div>
            )}

            <Link to="/" style={styles.link}>
                ← Retour au sommaire
            </Link>
        </div>
    );
}

export default AdditionPage;
