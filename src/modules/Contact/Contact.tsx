import { useState, useEffect } from 'react';
import './Contact.css';
import { trackContactSubmit } from '../../utils/analytics';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useToast } from '../../components/Toast';

const Contact = () => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  // Status retiré - utilisation des toasts uniquement

  // Auto-save du formulaire
  const { restoreDraft, clearDraft } = useAutoSave(formData, 'contact', 1000);

  // Restaurer le brouillon au chargement
  useEffect(() => {
    const saved = restoreDraft();
    if (saved) {
      setFormData(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Status retiré - utilisation des toasts uniquement

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Track conversion Google Analytics
        trackContactSubmit();
        
        // Effacer le brouillon après envoi réussi
        clearDraft();
        
        const successMessage = 'Merci pour votre message ! Nous vous répondrons sous 24h.';
        showSuccess(successMessage, 7000); // 7 secondes pour laisser le temps de lire
        // Pas besoin de setStatus, le toast suffit
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        // Afficher les détails des erreurs de validation si disponibles
        let errorMessage = data.error || 'Une erreur est survenue. Veuillez réessayer.';
        if (data.details && data.details.length > 0) {
          errorMessage = data.details.map((err: any) => err.msg).join('. ');
        }
        showError(errorMessage);
        // Pas besoin de setStatus, le toast suffit
      }
    } catch (error) {
      const errorMessage = 'Erreur de connexion. Veuillez réessayer plus tard.';
      showError(errorMessage);
      // Pas besoin de setStatus, le toast suffit
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Section Titre + Horaires */}
      <section className="contact-header">
        <div className="container">
          <h1>CONTACTEZ NOUS</h1>
          <p className="contact-hours">Ouvert du Lundi au Vendredi de 07h30 à 15h00</p>
        </div>
      </section>

      {/* Contact Info - 3 colonnes */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {/* Colonne 1 : Adresse */}
            <div className="info-col">
              <div className="info-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Adresse</h3>
              <p>Libreville</p>
              <p>GABON</p>
            </div>

            {/* Colonne 2 : Téléphone */}
            <a href="tel:+24174802344" className="info-col info-col-clickable">
              <div className="info-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3>Téléphone</h3>
              <p>+241 74 80 23 44</p>
            </a>

            {/* Colonne 3 : Mail */}
            <a href="mailto:contact@cips-tech.ga" className="info-col info-col-clickable">
              <div className="info-icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Mail</h3>
              <p>contact@cips-tech.ga</p>
            </a>
          </div>
        </div>
      </section>

      {/* Section Formulaire */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          {/* Formulaire principal */}
          <div className="contact-form-wrapper">
            <h2>Nous écrire</h2>
            
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nom - Prénom"
                  />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                  />
                </div>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Sujet"
                  className="full-width"
                />

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  placeholder="Message (minimum 10 caractères)"
                  className="full-width"
                  minLength={10}
                  maxLength={2000}
                ></textarea>

                {/* Message de status retiré - utilisation des toasts uniquement */}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE'}
                </button>
              </form>
          </div>

          {/* Encadré position géographique */}
          <div className="contact-map-box">
            <h3>📍 Notre localisation</h3>
            <div className="map-small">
              <iframe
                src="https://www.google.com/maps?q=0.4951944,9.4000833&hl=fr&z=17&output=embed"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation CIPS - Libreville, Gabon"
                allowFullScreen
              ></iframe>
            </div>
            <p className="map-address">
              <strong>Libreville</strong><br />
              GABON<br />
              Position GPS : 0°29'42.7"N, 9°24'00.3"E
            </p>
            <a 
              href="https://www.google.com/maps?q=0.4951944,9.4000833" 
              target="_blank" 
              rel="noopener noreferrer"
              className="open-maps-btn"
            >
              🗺️ Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
