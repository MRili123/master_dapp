import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Segoe UI, Arial, sans-serif'
        }}>
            <div style={{
                background: '#fff',
                padding: '40px 32px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(60,72,88,0.12)',
                minWidth: '340px',
                maxWidth: '95vw'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '32px',
                    color: '#3730a3',
                    fontWeight: 700,
                    letterSpacing: '1px'
                }}>
                    TP3 - dApp
                </h1>
                <nav>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px'
                    }}>
                        <li>
                            <Link to="/addition" style={linkStyle}>
                                Exercice 1 : Somme de deux variables
                            </Link>
                        </li>
                        <li>
                            <Link to="/convertisseur" style={linkStyle}>
                                Exercice 2 : Conversion des cryptomonnaies
                            </Link>
                        </li>
                        <li>
                            <Link to="/gestion-chaines" style={linkStyle}>
                                Exercice 3 : Traitement des chaînes
                            </Link>
                        </li>
                        <li>
                            <Link to="/payment" style={linkStyle}>
                                Exercice 4 : Utilisation des variables globales
                            </Link>
                        </li>
                        <li>
                            <Link to="/verificateur-parite" style={linkStyle}>
                                Exercice 5 : Tester la parité
                            </Link>
                        </li>
                        <li>
                            <Link to="/verificateur-positif" style={linkStyle}>
                                Exercice 6 : Tester le signe
                            </Link>
                        </li>
                        <li>
                            <Link to="/somme-tableau" style={linkStyle}>
                                Exercice 7 : Gestion des tableaux
                            </Link>
                        </li>
                        <li>
                            <Link to="/rectangle" style={linkStyle}>
                                Exercice 8 : POO - Formes géométriques
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

const linkStyle = {
    display: 'block',
    padding: '12px 18px',
    borderRadius: '8px',
    background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1.05rem',
    transition: 'background 0.2s, transform 0.2s',
    boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
    letterSpacing: '0.5px'
};

export default HomePage;
