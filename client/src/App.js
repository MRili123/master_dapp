import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AdditionPage from './pages/AdditionPage';
import ConvertisseurPage from './pages/ConvertisseurPage';
import GestionChainesPage from './pages/GestionChainesPage';
import PaymentPage from './pages/PaymentPage';
import VerificateurParitePage from './pages/VerificateurParitePage';
import VerificateurPositifPage from './pages/VerificateurPositifPage';
import SommeTableauPage from './pages/SommeTableauPage';
import RectanglePage from './pages/RectanglePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/addition" element={<AdditionPage />} />
        <Route path="/convertisseur" element={<ConvertisseurPage />} />
        <Route path="/gestion-chaines" element={<GestionChainesPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/verificateur-parite" element={<VerificateurParitePage />} />
        <Route path="/verificateur-positif" element={<VerificateurPositifPage />} />
        <Route path="/somme-tableau" element={<SommeTableauPage />} />
        <Route path="/rectangle" element={<RectanglePage />} />
      </Routes>
    </Router>
  );
}

export default App;
