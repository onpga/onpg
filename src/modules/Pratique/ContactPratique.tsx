import { useState, useCallback } from 'react';
import './ContactPratique.css';
import { useToast } from '../../components/Toast';

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
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [errors,   setErrors]   = useState<Errors>({});
  const [touched,  setTouched]  = useState<Touched>({});
  const [submitting, setSubmitting]   = useState(false);

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
      showSuccess("Votre message a bien été envoyé. L'ONPG vous répondra dans les meilleurs délais.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
      setTouched({});
    } catch (error: any) {
      console.error('Erreur envoi contact:', error);
      showError("Une erreur est survenue lors de l'envoi du message. Merci de réessayer plus tard.");
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
      <section className="cp-hero" aria-labelledby="cp-title">
        <div className="cp-container">
          <span className="cp-eyebrow">Assistance & Orientation</span>
          <h1 id="cp-title" className="cp-title">Contactez l&apos;ONPG</h1>
          <p className="cp-lead">
            Notre équipe vous accompagne pour vos questions relatives a l&apos;inscription,
            la deontologie, la formation continue et la vie professionnelle.
          </p>

          <div className="cp-kpi-grid">
            <article className="cp-kpi-card">
              <strong>Lun - Jeu</strong>
              <span>08:30 - 17:30</span>
            </article>
            <article className="cp-kpi-card">
              <strong>24h</strong>
              <span>Delai moyen de reponse</span>
            </article>
            <article className="cp-kpi-card">
              <strong>+241 076 50 20 32</strong>
              <span>Ligne d&apos;accueil ONPG</span>
            </article>
          </div>
        </div>
      </section>

      <section className="cp-contact-cards">
        <div className="cp-container">
          <div className="cp-cards-grid">
            <article className="cp-contact-card">
              <span className="cp-card-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2>Telephone</h2>
              <p className="cp-card-main">
                <a href="tel:+24176502032">076 50 20 32</a>
              </p>
              <p className="cp-card-note">Lundi au jeudi, 08:30 - 17:30</p>
            </article>

            <article className="cp-contact-card">
              <span className="cp-card-icon" aria-hidden="true">✉️</span>
              <h2>Email</h2>
              <p className="cp-card-main">
                <a href="mailto:contact@onpg.ga">contact@onpg.ga</a>
              </p>
              <p className="cp-card-note">Reponse sous 24h ouvrables</p>
            </article>

            <article className="cp-contact-card">
              <span className="cp-card-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="2.6" fill="currentColor" />
                </svg>
              </span>
              <h2>Adresse</h2>
              <p className="cp-card-main">
                CC4J+WC6, Montee Louis
                <br />
                Libreville, Gabon
              </p>
              <p className="cp-card-note">
                Apres le Ministere de la Promotion de la Bonne Gouvernance
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="cp-main">
        <div className="cp-container cp-main-grid">
          <div className="cp-form-panel">
            <header className="cp-panel-head">
              <h2>Envoyez-nous un message</h2>
              <p>
                Renseignez les champs ci-dessous. Les donnees sont traitees
                confidentiellement par l&apos;equipe ONPG.
              </p>
            </header>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
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
                    <span className="field-icon field-icon--valid" aria-hidden="true">✓</span>
                    <span className="field-icon field-icon--error" aria-hidden="true">✕</span>
                  </div>
                  {touched.name && errors.name && (
                    <p id="err-name" className="field-error-msg" role="alert">{errors.name}</p>
                  )}
                </div>

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
                    <span className="field-icon field-icon--valid" aria-hidden="true">✓</span>
                    <span className="field-icon field-icon--error" aria-hidden="true">✕</span>
                  </div>
                  {touched.email && errors.email && (
                    <p id="err-email" className="field-error-msg" role="alert">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group ${fieldClass('phone')}`}>
                  <label htmlFor="phone">
                    Telephone <span className="field-optional">(facultatif)</span>
                  </label>
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
                    <span className="field-icon field-icon--valid" aria-hidden="true">✓</span>
                    <span className="field-icon field-icon--error" aria-hidden="true">✕</span>
                  </div>
                  {touched.phone && errors.phone && (
                    <p id="err-phone" className="field-error-msg" role="alert">{errors.phone}</p>
                  )}
                </div>

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
                      <option value="">Selectionnez un sujet</option>
                      <option value="formation">Formation continue</option>
                      <option value="inscription">Inscription a l&apos;Ordre</option>
                      <option value="deontologie">Deontologie</option>
                      <option value="pharmacie">Gestion de pharmacie</option>
                      <option value="autre">Autre</option>
                    </select>
                    <span className="field-icon field-icon--valid" aria-hidden="true">✓</span>
                    <span className="field-icon field-icon--error" aria-hidden="true">✕</span>
                  </div>
                  {touched.subject && errors.subject && (
                    <p id="err-subject" className="field-error-msg" role="alert">{errors.subject}</p>
                  )}
                </div>
              </div>

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
                    placeholder="Decrivez votre demande en detail..."
                    aria-describedby={`msg-counter${errors.message && touched.message ? ' err-message' : ''}`}
                    aria-invalid={!!(errors.message && touched.message)}
                  />
                  <span className="field-icon field-icon--valid" aria-hidden="true">✓</span>
                  <span className="field-icon field-icon--error" aria-hidden="true">✕</span>
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
                disabled={submitting || !isFormValid}
                aria-busy={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="submit-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          <aside className="cp-side-panel">
            <article className="cp-side-card">
              <h3>Horaires d&apos;accueil</h3>
              <ul>
                <li><strong>Lundi - Jeudi:</strong> 08:30 - 17:30</li>
                <li><strong>Vendredi:</strong> 08:30 - 15:30</li>
                <li><strong>Week-end:</strong> Ferme</li>
              </ul>
            </article>

            <article className="cp-side-card">
              <h3>Notre localisation</h3>
              <div className="cp-map-wrap">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5!2d9.4000833!3d0.4951944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMCDigJwwLjQ5NSBOIDniwJwwOS40MDAgRQ!5e0!3m2!1sfr!2sga!4v1234567890&q=CC4J%2BWC6+Montee+Louis+Libreville"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation ONPG - CC4J+WC6, Montee Louis, Libreville"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=CC4J%2BWC6+Montee+Louis+Libreville+Gabon"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-btn"
              >
                Ouvrir dans Google Maps
              </a>
            </article>
          </aside>
        </div>
      </section>

      <section className="cp-trust-strip">
        <div className="cp-container cp-trust-grid">
          <div className="cp-trust-item">
            <span>Source</span>
            <strong>Ordre National des Pharmaciens du Gabon</strong>
          </div>
          <div className="cp-trust-item">
            <span>Derniere mise a jour</span>
            <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
          </div>
          <div className="cp-trust-item">
            <span>Canal recommande</span>
            <strong>Email institutionnel</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPratique;
