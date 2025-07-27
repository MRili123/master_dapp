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
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            padding: '40px 0'
        }}>
            <style>{`
                .rectangle-container {
                    background: #fff;
                    max-width: 500px;
                    margin: 0 auto;
                    border-radius: 18px;
                    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);
                    padding: 36px 32px 32px 32px;
                }
                .rectangle-title {
                    text-align: center;
                    font-size: 2.1rem;
                    font-weight: 700;
                    color: #2d3a4b;
                    margin-bottom: 28px;
                    letter-spacing: 1px;
                }
                .rectangle-form label {
                    display: block;
                    margin-bottom: 12px;
                    font-weight: 500;
                    color: #34495e;
                }
                .rectangle-form input[type="number"] {
                    width: 80px;
                    padding: 7px 10px;
                    margin-left: 8px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 1rem;
                    margin-right: 18px;
                }
                .rectangle-form button {
                    background: #4f8cff;
                    color: #fff;
                    border: none;
                    padding: 10px 22px;
                    border-radius: 6px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 10px;
                    transition: background 0.2s;
                }
                .rectangle-form button:hover {
                    background: #2563eb;
                }
                .rectangle-section {
                    margin: 24px 0 0 0;
                    padding: 18px 0 0 0;
                    border-top: 1px solid #e5e7eb;
                }
                .rectangle-section button {
                    background: #e0e7ff;
                    color: #1e293b;
                    border: none;
                    padding: 8px 18px;
                    border-radius: 6px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 8px;
                    margin-right: 10px;
                    transition: background 0.2s;
                }
                .rectangle-section button:hover {
                    background: #a5b4fc;
                }
                .rectangle-section p {
                    margin: 8px 0 0 0;
                    color: #374151;
                    font-size: 1.05rem;
                }
                .rectangle-blockchain, .rectangle-tx {
                    background: #f3f4f6;
                    border-radius: 10px;
                    padding: 16px 18px;
                    margin-top: 18px;
                }
                .rectangle-blockchain h3, .rectangle-tx h3 {
                    margin: 0 0 10px 0;
                    color: #2563eb;
                    font-size: 1.1rem;
                    font-weight: 600;
                }
                .rectangle-blockchain p, .rectangle-tx p {
                    margin: 4px 0;
                    color: #374151;
                    font-size: 0.98rem;
                }
                .rectangle-link {
                    display: block;
                    text-align: center;
                    margin-top: 28px;
                    color: #4f8cff;
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 1.05rem;
                    transition: color 0.2s;
                }
                .rectangle-link:hover {
                    color: #2563eb;
                    text-decoration: underline;
                }
            `}</style>
            <div className="rectangle-container">
                <div className="rectangle-title">Exercice 5 : Rectangle</div>
                {/* Déplacer la forme */}
                <form className="rectangle-form" onSubmit={handleDeplacer}>
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
                <div className="rectangle-section">
                    <button onClick={handleAfficheXY}>Afficher x et y</button>
                    {xy && <p>{xy}</p>}
                </div>
                {/* Afficher Infos */}
                <div className="rectangle-section">
                    <button onClick={handleAfficheInfos}>Afficher infos</button>
                    {infos && <p>{infos}</p>}
                </div>
                {/* Surface */}
                <div className="rectangle-section">
                    <button onClick={handleSurface}>Afficher surface</button>
                    {surface && <p>Surface : {surface}</p>}
                </div>
                {/* Afficher lo/la */}
                <div className="rectangle-section">
                    <button onClick={handleAfficheLoLa}>Afficher lo et la</button>
                    {lola && <p>{lola}</p>}
                </div>
                {/* Infos Blockchain */}
                <div className="rectangle-blockchain">
                    <h3>Infos Blockchain</h3>
                    <p>Compte connecté : {accounts[0]}</p>
                    <p>Dernier bloc : {latestBlock}</p>
                </div>
                {/* Infos transaction */}
                {txHash && (
                    <div className="rectangle-tx">
                        <h3>Détails de la dernière transaction</h3>
                        <p>Transaction Hash : {txHash}</p>
                        <p>Gas utilisé : {gasUsed}</p>
                    </div>
                )}
                {/* Lien vers sommaire */}
                <Link className="rectangle-link" to="/">← Retour au sommaire</Link>
            </div>
        </div>
    );
}

export default RectanglePage;