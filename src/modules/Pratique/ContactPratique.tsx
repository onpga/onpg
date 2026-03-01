import { useState, useCallback } from 'react';
import './ContactPratique.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

/* ── Règles de validation ─────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s\-().]{6,20}$/;

type FieldKey = 'name' | 'email' | 'phone' | 'subject' | 'message';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type Errors   = Partial<Record<FieldKey, string>>;
type Touched  = Partial<Record<FieldKey, boolean>>;

function validate(data: FormData): Errors {
  const e: Errors = {};
  if (!data.name.trim())
    e.name = 'Le nom complet est requis.';
  else if (data.name.trim().length < 2)
    e.name = 'Le nom doit contenir au moins 2 caractères.';

  if (!data.email.trim())
    e.email = 'L\'adresse email est requise.';
  else if (!EMAIL_RE.test(data.email))
    e.email = 'Adresse email invalide (ex : prenom@domaine.com).';

  if (data.phone.trim() && !PHONE_RE.test(data.phone))
    e.phone = 'Numéro de téléphone invalide.';

  if (!data.subject)
    e.subject = 'Veuillez choisir un sujet.';

  if (!data.message.trim())
    e.message = 'Le message est requis.';
  else if (data.message.trim().length < 20)
    e.message = `Minimum 20 caractères (${data.message.trim().length}/20).`;

  return e;
}

const MSG_MAX = 1200;

const ContactPratique = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [errors,   setErrors]   = useState<Errors>({});
  const [touched,  setTouched]  = useState<Touched>({});
  const [submitting, setSubmitting]   = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage,   setErrorMessage]   = useState<string | null>(null);

  /* Validation en live dès qu'un champ est touché */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const next = { ...formData, [name]: value };
      setFormData(next);
      if (touched[name as FieldKey]) {
        setErrors(validate(next));
      }
    },
    [formData, touched]
  );

  /* Marque le champ comme touché + valide au blur */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const name = e.target.name as FieldKey;
      setTouched(prev => ({ ...prev, [name]: true }));
      setErrors(validate({ ...formData }));
    },
    [formData]
  );

  const isFormValid = Object.keys(validate(formData)).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /* Tout marquer comme touché pour afficher toutes les erreurs */
    setTouched({ name: true, email: true, phone: true, subject: true, message: true });
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }
      setSuccessMessage("Votre message a bien été envoyé. L'ONPG vous répondra dans les meilleurs délais.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (error: any) {
      console.error('Erreur envoi contact:', error);
      setErrorMessage("Une erreur est survenue lors de l'envoi du message. Merci de réessayer plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Helper CSS class pour un champ */
  const fieldClass = (key: FieldKey) => {
    if (!touched[key]) return '';
    return errors[key] ? 'field--error' : 'field--valid';
  };

  return (
    <div className="contact-pratique-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Contactez l'ONPG</h1>
          <p className="hero-subtitle">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
            concernant la profession pharmaceutique.
          </p>
        </div>
      </section>

      {/* Informations de contact */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon" style={{ backgroundColor: '#00A651' }}>
                <span style={{ fontSize: '2.5rem' }}>📞</span>
              </div>
              <h3>Téléphone</h3>
              <p className="contact-detail">
                <a href="tel:+24176502032" style={{ color: '#00A651', textDecoration: 'none' }}>
                  076 50 20 32
                </a>
              </p>
              <p className="contact-note">Lundi au jeudi, 08:30–17:30</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon" style={{ backgroundColor: '#00A651' }}>
                <span style={{ fontSize: '2.5rem' }}>✉️</span>
              </div>
              <h3>Email</h3>
              <p className="contact-detail">
                <a href="mailto:contact@onpg.ga" style={{ color: '#00A651', textDecoration: 'none' }}>
                  contact@onpg.ga
                </a>
              </p>
              <p className="contact-note">Réponse sous 24h</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon" style={{ backgroundColor: '#00A651' }}>
                <span style={{ fontSize: '2.5rem' }}>📍</span>
              </div>
              <h3>Adresse</h3>
              <p className="contact-detail">
                CC4J+WC6, Montee Louis<br />
                Libreville, Gabon
              </p>
              <p className="contact-note">Après le Ministère de la Promotion de la Bonne Gouvernance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carte Google Maps */}
      <section className="contact-map-section">
        <div className="container">
          <h2 className="section-title">Notre localisation</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5!2d9.4000833!3d0.4951944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCDigJwwLjQ5NSBOIDniwJwwOS40MDAgRQ!5e0!3m2!1sfr!2sga!4v1234567890&q=CC4J%2BWC6+Montee+Louis+Libreville"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation ONPG - CC4J+WC6, Montee Louis, Libreville"
            />
            <div className="map-link-container">
              <a
                href="https://www.google.com/maps/search/?api=1&query=CC4J%2BWC6+Montee+Louis+Libreville+Gabon"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-btn"
              >
                📍 Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="contact-form-section">
        <div className="container">
          <h2 className="section-title">Envoyez-nous un message</h2>

          {successMessage && (
            <div className="contact-success" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="contact-error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {errorMessage}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>

            <div className="form-row">
              {/* Nom */}
              <div className={`form-group ${fieldClass('name')}`}>
                <label htmlFor="name">
                  Nom complet <span className="field-required" aria-hidden="true">*</span>
                </label>
                <div className="field-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="name"
                    placeholder="Marie Dupont"
                    aria-describedby={errors.name && touched.name ? 'err-name' : undefined}
                    aria-invalid={!!(errors.name && touched.name)}
                  />
                  <span className="field-icon field-icon--valid"  aria-hidden="true">✓</span>
                  <span className="field-icon field-icon--error"  aria-hidden="true">✕</span>
                </div>
                {touched.name && errors.name && (
                  <p id="err-name" className="field-error-msg" role="alert">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className={`form-group ${fieldClass('email')}`}>
                <label htmlFor="email">
                  Email <span className="field-required" aria-hidden="true">*</span>
                </label>
                <div className="field-wrap">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    placeholder="marie@exemple.com"
                    aria-describedby={errors.email && touched.email ? 'err-email' : undefined}
                    aria-invalid={!!(errors.email && touched.email)}
                  />
                  <span className="field-icon field-icon--valid"  aria-hidden="true">✓</span>
                  <span className="field-icon field-icon--error"  aria-hidden="true">✕</span>
                </div>
                {touched.email && errors.email && (
                  <p id="err-email" className="field-error-msg" role="alert">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              {/* Téléphone */}
              <div className={`form-group ${fieldClass('phone')}`}>
                <label htmlFor="phone">Téléphone <span className="field-optional">(facultatif)</span></label>
                <div className="field-wrap">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                    placeholder="+241 06 12 34 56"
                    aria-describedby={errors.phone && touched.phone ? 'err-phone' : undefined}
                    aria-invalid={!!(errors.phone && touched.phone)}
                  />
                  <span className="field-icon field-icon--valid"  aria-hidden="true">✓</span>
                  <span className="field-icon field-icon--error"  aria-hidden="true">✕</span>
                </div>
                {touched.phone && errors.phone && (
                  <p id="err-phone" className="field-error-msg" role="alert">{errors.phone}</p>
                )}
              </div>

              {/* Sujet */}
              <div className={`form-group ${fieldClass('subject')}`}>
                <label htmlFor="subject">
                  Sujet <span className="field-required" aria-hidden="true">*</span>
                </label>
                <div className="field-wrap">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={errors.subject && touched.subject ? 'err-subject' : undefined}
                    aria-invalid={!!(errors.subject && touched.subject)}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="formation">Formation continue</option>
                    <option value="inscription">Inscription à l'Ordre</option>
                    <option value="deontologie">Déontologie</option>
                    <option value="pharmacie">Gestion de pharmacie</option>
                    <option value="autre">Autre</option>
                  </select>
                  <span className="field-icon field-icon--valid"  aria-hidden="true">✓</span>
                  <span className="field-icon field-icon--error"  aria-hidden="true">✕</span>
                </div>
                {touched.subject && errors.subject && (
                  <p id="err-subject" className="field-error-msg" role="alert">{errors.subject}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className={`form-group ${fieldClass('message')}`}>
              <label htmlFor="message">
                Message <span className="field-required" aria-hidden="true">*</span>
              </label>
              <div className="field-wrap">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={6}
                  maxLength={MSG_MAX}
                  placeholder="Décrivez votre demande en détail…"
                  aria-describedby={`msg-counter${errors.message && touched.message ? ' err-message' : ''}`}
                  aria-invalid={!!(errors.message && touched.message)}
                />
                <span className="field-icon field-icon--valid"  aria-hidden="true">✓</span>
                <span className="field-icon field-icon--error"  aria-hidden="true">✕</span>
              </div>
              <div className="msg-footer">
                {touched.message && errors.message && (
                  <p id="err-message" className="field-error-msg" role="alert">{errors.message}</p>
                )}
                <span
                  id="msg-counter"
                  className={`msg-counter${formData.message.length >= MSG_MAX * 0.9 ? ' msg-counter--warn' : ''}`}
                  aria-live="polite"
                >
                  {formData.message.length}/{MSG_MAX}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`submit-btn${!isFormValid ? ' submit-btn--disabled' : ''}`}
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <svg className="submit-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Envoi en cours…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Envoyer le message
                </>
              )}
            </button>

          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPratique;
