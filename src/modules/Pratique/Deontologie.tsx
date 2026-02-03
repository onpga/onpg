import { useState, useEffect } from 'react';

const Deontologie = () => {
  return (
    <div className="pratique-page">
      <section className="pratique-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Déontologie</span>
              <span className="hero-title-subtitle">Pharmaceutique</span>
            </h1>
            <p className="hero-description">
              Découvrez le code de déontologie des pharmaciens gabonais,
              les principes éthiques et les jurisprudences.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">⚖️ Code déontologique</span>
              <span className="highlight-item">🛡️ Éthique professionnelle</span>
              <span className="highlight-item">📋 Jurisprudence</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">2023</div>
              <div className="stat-label">Dernière mise à jour</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">25</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Respect</div>
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
            <div className="coming-soon-icon">⚖️</div>
            <h2>Déontologie Pharmaceutique</h2>
            <p>Code déontologique en cours de développement</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%' }}></div>
            </div>
            <p className="progress-text">85% terminé</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Deontologie;

