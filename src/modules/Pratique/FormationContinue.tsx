import { useState, useEffect } from 'react';

const FormationContinue = () => {
  return (
    <div className="pratique-page">
      <section className="pratique-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Formation</span>
              <span className="hero-title-subtitle">Continue</span>
            </h1>
            <p className="hero-description">
              Développez vos compétences avec notre catalogue complet de formations
              continues obligatoires et spécialisées pour pharmaciens.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">📚 Catalogue complet</span>
              <span className="highlight-item">🎓 Formation obligatoire</span>
              <span className="highlight-item">💼 Développement professionnel</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Formations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1200+</div>
              <div className="stat-label">Participants</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
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
            <div className="coming-soon-icon">📚</div>
            <h2>Formation Continue</h2>
            <p>Catalogue de formations en cours de développement</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '30%' }}></div>
            </div>
            <p className="progress-text">30% terminé</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormationContinue;

