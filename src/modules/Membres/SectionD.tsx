import { useState } from 'react';

const SectionD = () => {
  return (
    <div className="membres-page">
      <section className="membres-hero section-d-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section D</span>
              <span className="hero-title-subtitle">Fabricants & Grossistes</span>
            </h1>
            <p className="hero-description">
              Pharmaciens fabricants, grossistes et répartiteurs.
              Maillon essentiel de la chaîne d'approvisionnement pharmaceutique.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏭 Fabrication</span>
              <span className="highlight-item">📦 Distribution</span>
              <span className="highlight-item">🔗 Chaîne logistique</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">8</div>
              <div className="stat-label">Entreprises</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Couverture</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Médicaments</div>
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
            <div className="coming-soon-icon">🏭</div>
            <h2>Section D - Fabricants & Grossistes</h2>
            <p>Page en cours de développement</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '45%' }}></div>
            </div>
            <p className="progress-text">45% terminé</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectionD;

