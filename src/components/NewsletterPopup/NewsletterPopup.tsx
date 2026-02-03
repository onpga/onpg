import { useState, useEffect, useRef } from 'react';
import './NewsletterPopup.css';

interface NewsletterPopupProps {
  onClose: () => void;
}

const NewsletterPopup = ({ onClose }: NewsletterPopupProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Fermeture par touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus trap pour accessibilité
  useEffect(() => {
    if (popupRef.current) {
      const focusableElements = popupRef.current.querySelectorAll(
        'button, input, textarea, select, a[href]'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, []);

  // Empêcher le scroll du body quand le popup est ouvert
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    console.log('📧 [Newsletter] Tentative d\'inscription:', { email, name });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();
      console.log('📡 [Newsletter] Réponse du serveur:', data);

      if (response.ok) {
        console.log('✅ [Newsletter] Inscription réussie !');
        setIsSuccess(true);
        setMessage('Merci pour votre inscription ! Vous recevrez bientôt nos actualités.');
        localStorage.setItem('newsletter_subscribed', 'true');
        console.log('💾 [Newsletter] État sauvegardé - Pop-up ne s\'affichera plus');
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        console.error('❌ [Newsletter] Erreur:', data.error);
        setMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('❌ [Newsletter] Erreur de connexion:', error);
      setMessage('Erreur de connexion. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="newsletter-popup-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
    >
      <div 
        className="newsletter-popup-content" 
        onClick={(e) => e.stopPropagation()}
        ref={popupRef}
      >
        <button 
          className="newsletter-popup-close" 
          onClick={onClose} 
          aria-label="Fermer la fenêtre d'inscription"
          type="button"
        >
          ✕
        </button>
        
        <div className="newsletter-popup-header">
          <h2 id="newsletter-title">📧 Restez informé !</h2>
          <p>Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et innovations.</p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="newsletter-popup-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="newsletter-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
            </div>

            <button 
              type="submit" 
              className="newsletter-submit-btn"
              disabled={loading}
            >
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </button>

            {message && (
              <div className={`newsletter-message ${isSuccess ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </form>
        ) : (
          <div className="newsletter-success">
            <div className="success-icon">✓</div>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterPopup;

