import './Organigramme.css';

/* ── Icônes SVG institutionnelles ─────────────────────────── */
const IconCrown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 19h20M4 15l4-8 4 4 4-8 4 8"/>
    <rect x="2" y="19" width="20" height="2" rx="1"/>
  </svg>
);

const IconPen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconPerson = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

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

            <div className="org-connector org-connector-ordre">
              <div className="connector-arrow"></div>
            </div>

            {/* Présidente */}
            <div className="org-node-premium org-node-president">
              <h3 className="org-node-title">
                <span className="org-icon"><IconCrown /></span>
                Présidente
              </h3>
              <p className="org-node-person">Dr Patience Asseko NTOGONO OKE</p>
            </div>

            <div className="org-connector org-connector-president">
              <div className="connector-arrow"></div>
            </div>

            {/* Secrétaire et Sections */}
            <div className="org-branch-container">
              <div className="org-node-premium org-node-secretaire">
                <h4 className="org-node-title-small">
                  <span className="org-icon"><IconPen /></span>
                  Secrétaire
                </h4>
                <p className="org-node-person-small">—</p>
              </div>

              <div className="org-sections-container">
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section A — Officinaux</h4>
                </div>
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section B — Biologistes</h4>
                </div>
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section C — Fonctionnaires</h4>
                </div>
                <div className="org-node-premium org-node-section">
                  <h4 className="org-node-title-small">Section D — Fabricants / Grossistes</h4>
                </div>
              </div>
            </div>

            <div className="org-connector org-connector-sections">
              <div className="connector-arrow"></div>
            </div>

            {/* Conseillers */}
            <div className="org-conseillers-grid">
              {['Conseiller', 'Conseiller', 'Conseiller'].map((role, i) => (
                <div key={i} className="org-node-premium org-node-conseiller">
                  <h4 className="org-node-title-small">
                    <span className="org-icon"><IconPerson /></span>
                    {role}
                  </h4>
                  <p className="org-node-person-small">—</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organigramme;
