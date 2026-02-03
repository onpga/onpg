import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import detailedAnalytics from './utils/detailedAnalytics';
import errorLogger from './utils/errorLogger';

// Composant pour scroll en haut à chaque changement de route
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

// Initialiser le système de tracking détaillé
detailedAnalytics.init();

// Initialiser le système de logging des erreurs
errorLogger.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

