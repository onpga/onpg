import { useState, useEffect } from 'react';
import './CookieBanner.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieConsent = localStorage.getItem('cips_cookie_consent');
    
    if (!cookieConsent) {
      // Afficher le bandeau après 1 seconde
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cips_cookie_consent', 'all');
    localStorage.setItem('cips_cookie_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cips_cookie_consent', 'essential');
    localStorage.setItem('cips_cookie_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  const handleSavePreferences = () => {
    const analyticsCheckbox = document.getElementById('analytics-cookies') as HTMLInputElement;
    const marketingCheckbox = document.getElementById('marketing-cookies') as HTMLInputElement;
    
    const preferences = {
      essential: true,
      analytics: analyticsCheckbox?.checked || false,
      marketing: marketingCheckbox?.checked || false
    };
    
    localStorage.setItem('cips_cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('cips_cookie_date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
            <circle cx="8" cy="8" r="1" fill="currentColor"></circle>
            <circle cx="16" cy="8" r="1" fill="currentColor"></circle>
            <circle cx="9" cy="16" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="15" r="1" fill="currentColor"></circle>
          </svg>
        </div>

        <div className="cookie-content">
          <h3>🍪 Gestion des cookies</h3>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site, analyser notre trafic et personnaliser le contenu. 
            En cliquant sur "Accepter tout", vous consentez à notre utilisation des cookies.
          </p>
          <p className="cookie-link">
            Consultez notre <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a> pour plus d'informations.
          </p>

          {showDetails && (
            <div className="cookie-details">
              <div className="cookie-category">
                <div className="cookie-category-header">
                  <input type="checkbox" id="essential-cookies" checked disabled />
                  <label htmlFor="essential-cookies">
                    <strong>Cookies essentiels</strong> (obligatoires)
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Nécessaires au bon fonctionnement du site (navigation, sécurité, formulaires).
                </p>
              </div>

              <div className="cookie-category">
                <div className="cookie-category-header">
                  <input type="checkbox" id="analytics-cookies" defaultChecked />
                  <label htmlFor="analytics-cookies">
                    <strong>Cookies analytiques</strong>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Nous aident à comprendre comment vous utilisez le site pour l'améliorer (Google Analytics).
                </p>
              </div>

              <div className="cookie-category">
                <div className="cookie-category-header">
                  <input type="checkbox" id="marketing-cookies" />
                  <label htmlFor="marketing-cookies">
                    <strong>Cookies marketing</strong>
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Utilisés pour afficher des publicités pertinentes et mesurer l'efficacité de nos campagnes.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="cookie-actions">
          {!showDetails ? (
            <>
              <button onClick={handleAcceptAll} className="cookie-btn accept">
                Accepter tout
              </button>
              <button onClick={handleRejectAll} className="cookie-btn reject">
                Refuser tout
              </button>
              <button onClick={handleCustomize} className="cookie-btn customize">
                Personnaliser
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSavePreferences} className="cookie-btn accept">
                Enregistrer mes choix
              </button>
              <button onClick={() => setShowDetails(false)} className="cookie-btn customize">
                Retour
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

