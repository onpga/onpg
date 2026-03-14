import { Link } from 'react-router-dom';
import './OrganigrammePremium.css';

const IconCrown = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 18.5h18M5 15l3.7-7 3.3 3.7L15.4 6 19 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 18.5h16v2H4z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconBoard = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="4" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconSection = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.8" y="4.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.7" y="4.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.8" y="14.4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.7" y="14.4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="7.6" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 19.3c0-3 2.5-5.4 5.5-5.4h3c3 0 5.5 2.4 5.5 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const sections = [
  { code: 'A', name: 'Officinaux', detail: 'Pharmacies d’officine' },
  { code: 'B', name: 'Biologistes', detail: 'Biologie médicale' },
  { code: 'C', name: 'Fonctionnaires', detail: 'Secteur public' },
  { code: 'D', name: 'Fabricants / Grossistes', detail: 'Industrie & distribution' }
];

const operationalRoles = [
  { title: 'Secrétariat', value: 'Poste en cours de mise à jour' },
  { title: 'Conseiller 1', value: 'Poste en cours de mise à jour' },
  { title: 'Conseiller 2', value: 'Poste en cours de mise à jour' },
  { title: 'Conseiller 3', value: 'Poste en cours de mise à jour' }
];

const Organigramme = () => {
  return (
    <div className="ordre-page organigramme-premium-page">
      <section className="org-hero" aria-labelledby="org-title">
        <div className="org-container">
          <span className="org-eyebrow">Gouvernance institutionnelle</span>
          <h1 id="org-title" className="org-title">
            Organigramme de l&apos;ONPG
          </h1>
          <p className="org-lead">
            Une structure claire et représentative pour piloter la profession pharmaceutique au Gabon.
          </p>

          <div className="org-kpi-grid">
            <article className="org-kpi-card">
              <strong>1</strong>
              <span>Présidence</span>
            </article>
            <article className="org-kpi-card">
              <strong>25</strong>
              <span>Membres du Conseil National</span>
            </article>
            <article className="org-kpi-card">
              <strong>4</strong>
              <span>Sections professionnelles</span>
            </article>
          </div>
        </div>
      </section>

      <section className="org-section">
        <div className="org-container">
          <header className="org-section-header">
            <h2>Hiérarchie institutionnelle</h2>
            <p>Lecture simplifiée de la structure de décision et de représentation.</p>
          </header>

          <div className="org-tree">
            <article className="org-level-card root">
              <h3>Ordre National des Pharmaciens</h3>
              <p>Institution de régulation de la profession pharmaceutique</p>
            </article>

            <div className="org-tree-connector" aria-hidden="true" />

            <article className="org-level-card presidency">
              <div className="org-level-title">
                <IconCrown />
                <h3>Présidence</h3>
              </div>
              <p>Dr Patience Asseko NTOGONO OKE</p>
            </article>

            <div className="org-tree-connector" aria-hidden="true" />

            <article className="org-level-card board">
              <div className="org-level-title">
                <IconBoard />
                <h3>Conseil National</h3>
              </div>
              <p>Instance de gouvernance, d’orientation et de supervision</p>
            </article>
          </div>
        </div>
      </section>

      <section className="org-section org-section-alt">
        <div className="org-container">
          <header className="org-section-header">
            <h2>Sections professionnelles</h2>
            <p>Quatre sections pour représenter l’ensemble des modes d’exercice.</p>
          </header>

          <div className="org-sections-grid">
            {sections.map((section) => (
              <article key={section.code} className="org-section-card">
                <div className="org-section-top">
                  <div className="org-section-icon">
                    <IconSection />
                  </div>
                  <span className="org-section-code">Section {section.code}</span>
                </div>
                <h3>{section.name}</h3>
                <p>{section.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="org-section">
        <div className="org-container">
          <header className="org-section-header">
            <h2>Gouvernance opérationnelle</h2>
            <p>Rôles d’appui à la coordination du Conseil National.</p>
          </header>

          <div className="org-roles-grid">
            {operationalRoles.map((role) => (
              <article key={role.title} className="org-role-card">
                <div className="org-role-title">
                  <IconUser />
                  <h3>{role.title}</h3>
                </div>
                <p>{role.value}</p>
              </article>
            ))}
          </div>

          <div className="org-trust-strip">
            <div className="org-trust-item">
              <span>Source</span>
              <strong>Ordre National des Pharmaciens du Gabon</strong>
            </div>
            <div className="org-trust-item">
              <span>Dernière mise à jour</span>
              <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="org-cta">
        <div className="org-container">
          <div className="org-cta-content">
            <h2>Poursuivre votre parcours institutionnel</h2>
            <p>Consultez les membres et la présentation complète de l’Ordre.</p>
            <div className="org-cta-actions">
              <Link to="/membres/tableau-ordre" className="org-cta-btn primary">Tableau de l&apos;Ordre</Link>
              <Link to="/ordre/a-propos" className="org-cta-btn secondary">À propos de l&apos;ONPG</Link>
              <Link to="/pratique/contact" className="org-cta-btn secondary">Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organigramme;
