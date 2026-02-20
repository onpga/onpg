import { useState } from 'react';
import './ContactPratique.css';

const ContactPratique = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    alert('Formulaire de contact en cours de développement');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            {/* Téléphone */}
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

            {/* Email */}
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

            {/* Adresse */}
            <div className="contact-info-card">
              <div className="contact-icon" style={{ backgroundColor: '#00A651' }}>
                <span style={{ fontSize: '2.5rem' }}>📍</span>
              </div>
              <h3>Adresse</h3>
              <p className="contact-detail">
                CC4J+WC6, Montee Louis<br />
                Libreville, Gabon
              </p>
              <p className="contact-note">Après le ministère de la corruption</p>
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
            ></iframe>
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
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Sujet *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="formation">Formation continue</option>
                  <option value="inscription">Inscription à l'Ordre</option>
                  <option value="deontologie">Déontologie</option>
                  <option value="pharmacie">Gestion de pharmacie</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Envoyer le message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPratique;
