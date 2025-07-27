import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GestionChainesJSON from '../contracts/GestionChaines.json';
import { Link } from 'react-router-dom';

// Simple professional styles
const styles = {
    container: {
        maxWidth: 600,
        margin: '40px auto',
        padding: 32,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        fontFamily: 'Segoe UI, Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#2d3748',
        marginBottom: 32,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 1,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 24,
        background: '#f7fafc',
        padding: 18,
        borderRadius: 10,
        border: '1px solid #e2e8f0',
    },
    label: {
        fontWeight: 500,
        color: '#4a5568',
        marginBottom: 4,
    },
    input: {
        padding: 8,
        borderRadius: 6,
        border: '1px solid #cbd5e1',
        fontSize: 16,
        marginBottom: 8,
    },
    button: {
        background: '#3182ce',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '10px 0',
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        marginTop: 6,
        transition: 'background 0.2s',
    },
    buttonSecondary: {
        background: '#4a5568',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '10px 0',
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        marginTop: 6,
        transition: 'background 0.2s',
    },
    section: {
        marginBottom: 28,
    },
    resultBox: {
        background: '#e6fffa',
        border: '1px solid #b2f5ea',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        color: '#234e52',
        fontWeight: 500,
    },
    infoBox: {
        background: '#f1f5f9',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        color: '#2d3748',
        fontSize: 15,
    },
    link: {
        display: 'inline-block',
        marginTop: 24,
        color: '#3182ce',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: 16,
    },
    hr: {
        border: 'none',
        borderTop: '1px solid #e2e8f0',
        margin: '24px 0',
    },
};

function GestionChainesPage() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [concatA, setConcatA] = useState('');
    const [concatB, setConcatB] = useState('');
    const [concatResult, setConcatResult] = useState('');
    const [concatAvec, setConcatAvec] = useState('');
    const [concatAvecResult, setConcatAvecResult] = useState('');
    const [longueurStr, setLongueurStr] = useState('');
    const [longueurResult, setLongueurResult] = useState('');
    const [comparerA, setComparerA] = useState('');
    const [comparerB, setComparerB] = useState('');
    const [comparerResult, setComparerResult] = useState('');
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
            const deployedNetwork = GestionChainesJSON.networks[networkId];
            if (deployedNetwork) {
                const contract = new web3.eth.Contract(
                    GestionChainesJSON.abi,
                    deployedNetwork.address
                );
                setContract(contract);
                const block = await web3.eth.getBlock('latest');
                setLatestBlock(block.number);
                const msg = await contract.methods.getMessage().call();
                setMessage(msg);
            } else {
                alert('GestionChaines contract is not deployed on this network.');
            }
        };
        init();
    }, []);

    const handleSetMessage = async (e) => {
        e.preventDefault();
        try {
            const receipt = await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
            setTxHash(receipt.transactionHash);
            setGasUsed(receipt.gasUsed);
            const msg = await contract.methods.getMessage().call();
            setMessage(msg);
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de setMessage');
        }
    };

    const handleGetMessage = async () => {
        try {
            const msg = await contract.methods.getMessage().call();
            setMessage(msg);
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de getMessage');
        }
    };

    const handleConcatener = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.concatener(concatA, concatB).call();
            setConcatResult(result);
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de concatener');
        }
    };

    const handleConcatenerAvec = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.concatenerAvec(concatAvec).call();
            setConcatAvecResult(result);
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de concatenerAvec');
        }
    };

    const handleLongueur = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.longueur(longueurStr).call();
            setLongueurResult(result);
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de longueur');
        }
    };

    const handleComparer = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.comparer(comparerA, comparerB).call();
            setComparerResult(result ? 'Identiques' : 'Différents');
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de comparer');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Exercice 3 : Gestion des chaînes</h2>

            {/* setMessage */}
            <div style={styles.section}>
                <form onSubmit={handleSetMessage} style={styles.form}>
                    <label style={styles.label}>
                        Nouveau message :
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Entrez un nouveau message"
                        />
                    </label>
                    <button type="submit" style={styles.button}>Définir le message</button>
                </form>
            </div>

            {/* getMessage */}
            <div style={styles.section}>
                <button onClick={handleGetMessage} style={styles.buttonSecondary}>Afficher le message actuel</button>
                <div style={styles.resultBox}>
                    <strong>Message actuel :</strong> {message}
                </div>
            </div>

            <hr style={styles.hr} />

            {/* concatener */}
            <div style={styles.section}>
                <form onSubmit={handleConcatener} style={styles.form}>
                    <label style={styles.label}>
                        Chaîne A :
                        <input
                            type="text"
                            value={concatA}
                            onChange={(e) => setConcatA(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Chaîne A"
                        />
                    </label>
                    <label style={styles.label}>
                        Chaîne B :
                        <input
                            type="text"
                            value={concatB}
                            onChange={(e) => setConcatB(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Chaîne B"
                        />
                    </label>
                    <button type="submit" style={styles.button}>Concaténer</button>
                </form>
                {concatResult && (
                    <div style={styles.resultBox}>
                        <strong>Résultat concaténation :</strong>
                        <div>{concatResult}</div>
                    </div>
                )}
            </div>

            {/* concatenerAvec */}
            <div style={styles.section}>
                <form onSubmit={handleConcatenerAvec} style={styles.form}>
                    <label style={styles.label}>
                        Chaîne à concaténer avec le message :
                        <input
                            type="text"
                            value={concatAvec}
                            onChange={(e) => setConcatAvec(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Chaîne à concaténer"
                        />
                    </label>
                    <button type="submit" style={styles.button}>Concaténer avec message</button>
                </form>
                {concatAvecResult && (
                    <div style={styles.resultBox}>
                        <strong>Résultat concaténation avec message :</strong>
                        <div>{concatAvecResult}</div>
                    </div>
                )}
            </div>

            {/* longueur */}
            <div style={styles.section}>
                <form onSubmit={handleLongueur} style={styles.form}>
                    <label style={styles.label}>
                        Chaîne pour longueur :
                        <input
                            type="text"
                            value={longueurStr}
                            onChange={(e) => setLongueurStr(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Chaîne à mesurer"
                        />
                    </label>
                    <button type="submit" style={styles.button}>Calculer longueur</button>
                </form>
                {longueurResult && (
                    <div style={styles.resultBox}>
                        <strong>Longueur :</strong>
                        <div>{longueurResult}</div>
                    </div>
                )}
            </div>

            {/* comparer */}
            <div style={styles.section}>
                <form onSubmit={handleComparer} style={styles.form}>
                    <label style={styles.label}>
                        Chaîne A :
                        <input
                            type="text"
                            value={comparerA}
                            onChange={(e) => setComparerA(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Chaîne A"
                        />
                    </label>
                    <label style={styles.label}>
                        Chaîne B :
                        <input
                            type="text"
                            value={comparerB}
                            onChange={(e) => setComparerB(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Chaîne B"
                        />
                    </label>
                    <button type="submit" style={styles.button}>Comparer</button>
                </form>
                {comparerResult && (
                    <div style={styles.resultBox}>
                        <strong>Résultat comparaison :</strong>
                        <div>{comparerResult}</div>
                    </div>
                )}
            </div>

            <hr style={styles.hr} />

            {/* Infos Blockchain */}
            <div style={styles.infoBox}>
                <strong>Infos Blockchain</strong>
                <div>Compte connecté : <span style={{ color: '#3182ce' }}>{accounts[0]}</span></div>
                <div>Dernier bloc : {latestBlock}</div>
            </div>

            {/* Infos transaction */}
            {txHash && (
                <div style={styles.infoBox}>
                    <strong>Détails de la dernière transaction</strong>
                    <div>Transaction Hash : <span style={{ color: '#3182ce' }}>{txHash}</span></div>
                    <div>Gas utilisé : {gasUsed}</div>
                </div>
            )}

            {/* Lien vers sommaire */}
            <Link to="/" style={styles.link}>← Retour au sommaire</Link>
        </div>
    );
}

export default GestionChainesPage;
