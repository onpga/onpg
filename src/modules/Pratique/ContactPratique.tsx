import { useState, useEffect } from 'react';

const ContactPratique = () => {
  return (
    <div className="pratique-page">
      <section className="pratique-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Contactez</span>
              <span className="hero-title-subtitle">l'ONPG</span>
            </h1>
            <p className="hero-description">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
              concernant la profession pharmaceutique.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">📞 Support professionnel</span>
              <span className="highlight-item">💬 Réponses rapides</span>
              <span className="highlight-item">🤝 Accompagnement</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Disponibilité</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">&lt;24h</div>
              <div className="stat-label">Réponse</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      <section className="section-content">
        <div className="section-container">
          <div className="coming-soon">
            <div className="coming-soon-icon">📞</div>
            <h2>Contact Pratique</h2>
            <p>Formulaire de contact en cours de développement</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '40%' }}></div>
            </div>
            <p className="progress-text">40% terminé</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPratique;

