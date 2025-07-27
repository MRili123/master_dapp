import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SommeTableauJSON from '../contracts/SommeTableau.json';
import { Link } from 'react-router-dom';

// Simple professional styles
const styles = {
    container: {
        maxWidth: '540px',
        margin: '40px auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '32px',
        fontFamily: 'Segoe UI, Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#2d3748',
        marginBottom: '28px',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.5px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
        background: '#f7fafc',
        padding: '18px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
    },
    label: {
        fontWeight: 500,
        color: '#4a5568',
        marginBottom: '4px',
    },
    input: {
        padding: '8px 10px',
        border: '1px solid #cbd5e1',
        borderRadius: '5px',
        fontSize: '1rem',
        outline: 'none',
        marginBottom: '8px',
    },
    button: {
        background: 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '10px 0',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '4px',
        transition: 'background 0.2s',
    },
    section: {
        marginBottom: '24px',
        padding: '16px',
        background: '#f7fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
    },
    infoTitle: {
        color: '#2b6cb0',
        fontWeight: 600,
        marginBottom: '8px',
        fontSize: '1.1rem',
    },
    infoText: {
        color: '#2d3748',
        marginBottom: '4px',
        fontSize: '1rem',
    },
    txSection: {
        background: '#e6fffa',
        border: '1px solid #b2f5ea',
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '18px',
    },
    link: {
        display: 'inline-block',
        marginTop: '18px',
        color: '#5a67d8',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        transition: 'color 0.2s',
    },
    result: {
        color: '#38a169',
        fontWeight: 500,
        marginTop: '4px',
        marginBottom: '0',
    },
    error: {
        color: '#e53e3e',
        fontWeight: 500,
        marginTop: '4px',
        marginBottom: '0',
    },
};

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
        <div style={styles.container}>
            <h2 style={styles.title}>Exercice 6 : Somme Tableau</h2>
            {/* Ajouter un nombre */}
            <form onSubmit={handleAjouterNombre} style={styles.form}>
                <label style={styles.label}>
                    Nombre à ajouter :
                    <input
                        type="number"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <button type="submit" style={styles.button}>Ajouter</button>
                {ajoutResult && (
                    <p style={ajoutResult.startsWith('Erreur') ? styles.error : styles.result}>
                        {ajoutResult}
                    </p>
                )}
            </form>
            {/* Récupérer un élément */}
            <form onSubmit={handleGetElement} style={styles.form}>
                <label style={styles.label}>
                    Index de l'élément :
                    <input
                        type="number"
                        value={index}
                        onChange={(e) => setIndex(e.target.value)}
                        required
                        style={styles.input}
                    />
                </label>
                <button type="submit" style={styles.button}>Obtenir l'élément</button>
                {element && (
                    <p style={element.startsWith('Erreur') ? styles.error : styles.result}>
                        Élément : {element}
                    </p>
                )}
            </form>
            {/* Afficher le tableau */}
            <div style={styles.section}>
                <button onClick={handleAfficheTableau} style={styles.button}>Afficher le tableau</button>
                {tableau.length > 0 && (
                    <p style={styles.infoText}>Tableau : [{tableau.join(', ')}]</p>
                )}
            </div>
            {/* Calculer la somme */}
            <div style={styles.section}>
                <button onClick={handleCalculerSomme} style={styles.button}>Calculer la somme</button>
                {somme && (
                    <p style={somme === 'Erreur' ? styles.error : styles.result}>
                        Somme : {somme}
                    </p>
                )}
            </div>
            {/* Infos Blockchain */}
            <div style={styles.section}>
                <div style={styles.infoTitle}>Infos Blockchain</div>
                <p style={styles.infoText}>Compte connecté : {accounts[0]}</p>
                <p style={styles.infoText}>Dernier bloc : {latestBlock}</p>
            </div>
            {/* Infos transaction */}
            {txHash && (
                <div style={styles.txSection}>
                    <div style={styles.infoTitle}>Détails de la dernière transaction</div>
                    <p style={styles.infoText}>Transaction Hash : {txHash}</p>
                    <p style={styles.infoText}>Gas utilisé : {gasUsed}</p>
                </div>
            )}
            {/* Lien vers sommaire */}
            <Link to="/" style={styles.link}>← Retour au sommaire</Link>
        </div>
    );
}

export default SommeTableauPage;