import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ConvertisseurJSON from '../contracts/Convertisseur.json';
import { Link } from 'react-router-dom';

function ConvertisseurPage() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [ether, setEther] = useState('');
    const [wei, setWei] = useState('');
    const [resultEtherToWei, setResultEtherToWei] = useState('');
    const [resultWeiToEther, setResultWeiToEther] = useState('');
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
            const deployedNetwork = ConvertisseurJSON.networks[networkId];
            if (deployedNetwork) {
                const contract = new web3.eth.Contract(
                    ConvertisseurJSON.abi,
                    deployedNetwork.address
                );
                setContract(contract);
                const block = await web3.eth.getBlock('latest');
                setLatestBlock(block.number);
            } else {
                alert('Convertisseur contract is not deployed on this network.');
            }
        };
        init();
    }, []);

    const handleEtherToWei = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.etherEnWei(ether).call();
            setResultEtherToWei(result);
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la conversion Ether -> Wei');
        }
    };

    const handleWeiToEther = async (e) => {
        e.preventDefault();
        try {
            const result = await contract.methods.weiEnEther(wei).call();
            setResultWeiToEther(result);
            setTxHash('Appel en lecture (call)');
            setGasUsed('-');
            const block = await web3.eth.getBlock('latest');
            setLatestBlock(block.number);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la conversion Wei -> Ether');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            padding: '40px 0'
        }}>
            <style>
                {`
                    .convertisseur-container {
                        background: #fff;
                        max-width: 500px;
                        margin: 0 auto;
                        border-radius: 18px;
                        box-shadow: 0 6px 32px rgba(0,0,0,0.09), 0 1.5px 4px rgba(0,0,0,0.07);
                        padding: 36px 32px 28px 32px;
                    }
                    .convertisseur-title {
                        text-align: center;
                        font-size: 2rem;
                        font-weight: 700;
                        color: #2d3748;
                        margin-bottom: 28px;
                        letter-spacing: 0.5px;
                    }
                    .convertisseur-form {
                        margin-bottom: 22px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .convertisseur-form label {
                        font-weight: 500;
                        color: #4a5568;
                        margin-bottom: 4px;
                    }
                    .convertisseur-form input {
                        padding: 8px 12px;
                        border: 1px solid #cbd5e1;
                        border-radius: 6px;
                        font-size: 1rem;
                        transition: border 0.2s;
                    }
                    .convertisseur-form input:focus {
                        border: 1.5px solid #3182ce;
                        outline: none;
                    }
                    .convertisseur-form button {
                        margin-top: 8px;
                        background: #3182ce;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        padding: 10px 0;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .convertisseur-form button:hover {
                        background: #2563eb;
                    }
                    .convertisseur-result {
                        background: #f1f5f9;
                        border-radius: 8px;
                        padding: 12px 16px;
                        margin-bottom: 18px;
                        color: #2563eb;
                        font-weight: 600;
                        font-size: 1.08rem;
                    }
                    .convertisseur-section-title {
                        font-size: 1.1rem;
                        font-weight: 600;
                        color: #2d3748;
                        margin-top: 18px;
                        margin-bottom: 8px;
                    }
                    .convertisseur-info {
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 10px 16px;
                        margin-bottom: 12px;
                        color: #374151;
                        font-size: 0.98rem;
                    }
                    .convertisseur-tx {
                        background: #fef9c3;
                        border-radius: 8px;
                        padding: 10px 16px;
                        margin-bottom: 12px;
                        color: #b45309;
                        font-size: 0.98rem;
                    }
                    .convertisseur-link {
                        display: inline-block;
                        margin-top: 18px;
                        color: #3182ce;
                        text-decoration: none;
                        font-weight: 500;
                        transition: color 0.2s;
                    }
                    .convertisseur-link:hover {
                        color: #2563eb;
                        text-decoration: underline;
                    }
                `}
            </style>
            <div className="convertisseur-container">
                <div className="convertisseur-title">Exercice 2 : Convertisseur</div>
                {/* Formulaire Ether -> Wei */}
                <form className="convertisseur-form" onSubmit={handleEtherToWei}>
                    <label>
                        Montant en Ether :
                        <input type="number" value={ether} onChange={(e) => setEther(e.target.value)} required min="0" step="any" />
                    </label>
                    <button type="submit">Convertir en Wei</button>
                </form>
                {resultEtherToWei && (
                    <div className="convertisseur-result">
                        <div className="convertisseur-section-title">Résultat Ether → Wei :</div>
                        <div>{resultEtherToWei} Wei</div>
                    </div>
                )}
                {/* Formulaire Wei -> Ether */}
                <form className="convertisseur-form" onSubmit={handleWeiToEther}>
                    <label>
                        Montant en Wei :
                        <input type="number" value={wei} onChange={(e) => setWei(e.target.value)} required min="0" step="any" />
                    </label>
                    <button type="submit">Convertir en Ether</button>
                </form>
                {resultWeiToEther && (
                    <div className="convertisseur-result">
                        <div className="convertisseur-section-title">Résultat Wei → Ether :</div>
                        <div>{resultWeiToEther} Ether</div>
                    </div>
                )}
                {/* Infos Blockchain */}
                <div className="convertisseur-section-title">Infos Blockchain</div>
                <div className="convertisseur-info">
                    <div>Compte connecté : <b>{accounts[0]}</b></div>
                    <div>Dernier bloc : <b>{latestBlock}</b></div>
                </div>
                {/* Infos transaction */}
                {txHash && (
                    <div className="convertisseur-tx">
                        <div className="convertisseur-section-title">Détails de la dernière transaction</div>
                        <div>Transaction Hash : {txHash}</div>
                        <div>Gas utilisé : {gasUsed}</div>
                    </div>
                )}
                {/* Lien vers sommaire */}
                <Link className="convertisseur-link" to="/">← Retour au sommaire</Link>
            </div>
        </div>
    );
}

export default ConvertisseurPage;