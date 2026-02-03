import { useState } from 'react';

const SectionB = () => {
  return (
    <div className="membres-page">
      <section className="membres-hero section-b-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section B</span>
              <span className="hero-title-subtitle">Biologistes</span>
            </h1>
            <p className="hero-description">
              Pharmaciens biologistes spécialisés dans les analyses médicales.
              Découvrez les laboratoires de biologie médicale au Gabon.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🧪 Analyses médicales</span>
              <span className="highlight-item">🔬 Biologie médicale</span>
              <span className="highlight-item">📊 Résultats fiables</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">15</div>
              <div className="stat-label">Biologistes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">Laboratoires</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98.5%</div>
              <div className="stat-label">Fiabilité</div>
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
            <div className="coming-soon-icon">🧪</div>
            <h2>Section B - Biologistes</h2>
            <p>Page en cours de développement</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
            <p className="progress-text">75% terminé</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectionB;

