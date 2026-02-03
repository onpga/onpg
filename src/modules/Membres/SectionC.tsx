import { useState } from 'react';

const SectionC = () => {
  return (
    <div className="membres-page">
      <section className="membres-hero section-c-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section C</span>
              <span className="hero-title-subtitle">Fonctionnaires</span>
            </h1>
            <p className="hero-description">
              Pharmaciens de la fonction publique exerçant dans les établissements
              de santé publics. Gardiens de la santé publique.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏥 Santé publique</span>
              <span className="highlight-item">👨‍⚕️ Fonction publique</span>
              <span className="highlight-item">💼 Service public</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">45</div>
              <div className="stat-label">Fonctionnaires</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Établissements</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Disponibilité</div>
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
            <div className="coming-soon-icon">🏥</div>
            <h2>Section C - Fonctionnaires</h2>
            <p>Page en cours de développement</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
            <p className="progress-text">60% terminé</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectionC;

