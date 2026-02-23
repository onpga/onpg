import { useState } from 'react';
import './Organigramme.css';

const Organigramme = () => {
  return (
    <div className="ordre-page">
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Organigramme</span>
              <span className="hero-title-subtitle">Institutionnel</span>
            </h1>
            <p className="hero-description">
              Structure organisationnelle de l&apos;Ordre National des Pharmaciens du Gabon.
            </p>
          </div>
        </div>
      </section>

      <section className="organigramme-section">
        <div className="section-container">
          <div className="organigramme-container-premium">
            {/* Ordre */}
            <div className="org-node-premium org-node-ordre">
              <h2 className="org-node-title">Ordre National des Pharmaciens</h2>
              <p className="org-node-subtitle">ONPG</p>
            </div>

            {/* Flèche vers le bas */}
            <div className="org-connector org-connector-ordre">
              <div className="connector-arrow"></div>
            </div>

            {/* Présidente */}
            <div className="org-node-premium org-node-president">
              <h3 className="org-node-title">👑 Présidente</h3>
              <p className="org-node-person">Dr Patience Asseko NTOGONO OKE</p>
            </div>

            {/* Flèche vers le bas */}
            <div className="org-connector org-connector-president">
              <div className="connector-arrow"></div>
            </div>

            {/* Secrétaire et Sections */}
            <div className="org-branch-container">
              {/* Secrétaire */}
              <div className="org-node-premium org-node-secretaire">
                <h4 className="org-node-title-small">📝 Secrétaire</h4>
                <p className="org-node-person-small">Dr. Jean Martin</p>
              </div>

              {/* Sections */}
              <div className="org-sections-container">
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section A - Officinaux</h4>
                </div>
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section B - Biologistes</h4>
                </div>
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section C - Fonctionnaires</h4>
                </div>
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section D - Fabricants/Grossistes</h4>
                </div>
              </div>
            </div>

            {/* Flèche vers le bas */}
            <div className="org-connector org-connector-sections">
              <div className="connector-arrow"></div>
            </div>

            {/* Conseillers */}
            <div className="org-conseillers-grid">
              <div className="org-node-premium org-node-conseiller">
                <h4 className="org-node-title-small">👤 Conseiller</h4>
                <p className="org-node-person-small">Dr. Sophie Bernard</p>
              </div>
              <div className="org-node-premium org-node-conseiller">
                <h4 className="org-node-title-small">👤 Conseiller</h4>
                <p className="org-node-person-small">Dr. Michel Dubois</p>
              </div>
              <div className="org-node-premium org-node-conseiller">
                <h4 className="org-node-title-small">👤 Conseiller</h4>
                <p className="org-node-person-small">Dr. Nathalie Petit</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organigramme;
