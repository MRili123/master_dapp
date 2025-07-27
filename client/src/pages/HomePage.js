import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>TP3 - dApp</h1>
      <nav>
        <ul>
          <li><Link to="/addition">Exercice 1 : Somme de deux variables</Link></li>
          <li><Link to="/convertisseur">Exercice 2 : Conversion des cryptomonnaies</Link></li>
          <li><Link to="/gestion-chaines">Exercice 3 : Traitement des chaînes</Link></li>
          <li><Link to="/payment">Exercice 4 : Utilisation des variables globales</Link></li>
          <li><Link to="/verificateur-parite">Exercice 5 : Tester la parité</Link></li>
          <li><Link to="/verificateur-positif">Exercice 6 : Tester le signe</Link></li>
          <li><Link to="/somme-tableau">Exercice 7 : Gestion des tableaux</Link></li>
          <li><Link to="/rectangle">Exercice 8 : POO - Formes géométriques</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;
