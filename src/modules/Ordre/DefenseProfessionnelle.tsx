import { Link } from 'react-router-dom';
import './DefenseProfessionnelle.css';

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconScale = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);
const IconHandshake = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m11 12 2.22 2.22a2 2 0 0 0 2.83 0l3.38-3.38a2 2 0 0 0 0-2.83L16 4" />
    <path d="m7 16-4 4" /><path d="m3 12 2.22-2.22a2 2 0 0 1 2.83 0L9.4 10.4" />
  </svg>
);
const IconMegaphone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
);

const DefenseProfessionnelle = () => {
  return (
    <div className="pratique-page premium-page defense-professionnelle-page">
      <section className="pratique-hero dp-hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">Ordre National des Pharmaciens</span>
            <h1 className="hero-title">
              <span className="hero-title-main">Défense des</span>
              <span className="hero-title-subtitle">Pharmaciens</span>
            </h1>
            <p className="hero-description">
              Représenter et défendre les intérêts professionnels.
              L'ONPG est le porte-parole de la profession pharmaceutique 
              et défend activement les droits de tous les pharmaciens.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item"><IconUsers /> Représentation</span>
              <span className="highlight-item"><IconScale /> Défense des droits</span>
              <span className="highlight-item"><IconHandshake /> Accompagnement</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Engagement</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Disponibilité</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Soutien</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="section-content">
        <div className="section-container">
          <div className="defense-professionnelle-card">
            <h2 className="defense-professionnelle-title">
              Notre Mission
            </h2>
            <p className="defense-professionnelle-description">
              L'Ordre National des Pharmaciens du Gabon (ONPG) représente et défend 
              les intérêts légitimes de la profession pharmaceutique au Gabon, 
              en veillant à la reconnaissance et au respect des droits des pharmaciens.
            </p>

            <h3 className="defense-professionnelle-subtitle">
              Nos Actions
            </h3>
            <div className="dp-actions-grid">
              <div className="defense-professionnelle-action-card">
                <div className="dp-action-icon"><IconMegaphone /></div>
                <h4 className="defense-professionnelle-action-title">
                  Représentation professionnelle
                </h4>
                <p className="defense-professionnelle-action-description">
                  Représenter les pharmaciens auprès des pouvoirs publics, des institutions 
                  et des organismes nationaux et internationaux.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <div className="dp-action-icon"><IconScale /></div>
                <h4 className="defense-professionnelle-action-title">
                  Défense des droits
                </h4>
                <p className="defense-professionnelle-action-description">
                  Défendre les droits et intérêts des pharmaciens dans le cadre de leur 
                  exercice professionnel.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <div className="dp-action-icon"><IconBriefcase /></div>
                <h4 className="defense-professionnelle-action-title">
                  Négociation collective
                </h4>
                <p className="defense-professionnelle-action-description">
                  Participer aux négociations concernant les conditions d'exercice, 
                  la rémunération et les avantages sociaux des pharmaciens.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <div className="dp-action-icon"><IconHandshake /></div>
                <h4 className="defense-professionnelle-action-title">
                  Conseil et accompagnement
                </h4>
                <p className="defense-professionnelle-action-description">
                  Offrir un accompagnement juridique et professionnel aux pharmaciens 
                  confrontés à des difficultés dans leur pratique.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <div className="dp-action-icon"><IconTrendingUp /></div>
                <h4 className="defense-professionnelle-action-title">
                  Promotion de la profession
                </h4>
                <p className="defense-professionnelle-action-description">
                  Promouvoir l'image et la valeur de la profession pharmaceutique 
                  auprès du public et des autorités.
                </p>
              </div>
            </div>

            <h3 className="defense-professionnelle-subtitle">
              Engagement
            </h3>
            <div className="defense-professionnelle-engagement">
              <p className="defense-professionnelle-engagement-text">
                L'ONPG s'engage à être le porte-parole de la profession pharmaceutique 
                et à défendre activement les intérêts de tous les pharmaciens inscrits 
                à l'Ordre, dans le respect de l'éthique et de la déontologie professionnelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="defense-professionnelle-nav">
        <div className="defense-professionnelle-nav-buttons">
          <Link to="/" className="defense-professionnelle-nav-btn secondary">
            ← Retour à l'accueil
          </Link>
          <Link to="/ordre/a-propos" className="defense-professionnelle-nav-btn primary">
            En savoir plus sur l'Ordre →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DefenseProfessionnelle;
