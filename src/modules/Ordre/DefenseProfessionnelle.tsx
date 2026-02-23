import { Link } from 'react-router-dom';
import './DefenseProfessionnelle.css';

const DefenseProfessionnelle = () => {
  return (
    <div className="pratique-page">
      {/* Hero Section - Style similaire à Déontologie */}
      <section className="pratique-hero">
        <div className="hero-content">
          <div className="hero-text">
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
              <span className="highlight-item">👥 Représentation</span>
              <span className="highlight-item">⚖️ Défense des droits</span>
              <span className="highlight-item">🤝 Accompagnement</span>
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
            <div>
              <div className="defense-professionnelle-action-card">
                <h4 className="defense-professionnelle-action-title">
                  Représentation professionnelle
                </h4>
                <p className="defense-professionnelle-action-description">
                  Représenter les pharmaciens auprès des pouvoirs publics, des institutions 
                  et des organismes nationaux et internationaux.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <h4 className="defense-professionnelle-action-title">
                  Défense des droits
                </h4>
                <p className="defense-professionnelle-action-description">
                  Défendre les droits et intérêts des pharmaciens dans le cadre de leur 
                  exercice professionnel.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <h4 className="defense-professionnelle-action-title">
                  Négociation collective
                </h4>
                <p className="defense-professionnelle-action-description">
                  Participer aux négociations concernant les conditions d'exercice, 
                  la rémunération et les avantages sociaux des pharmaciens.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
                <h4 className="defense-professionnelle-action-title">
                  Conseil et accompagnement
                </h4>
                <p className="defense-professionnelle-action-description">
                  Offrir un accompagnement juridique et professionnel aux pharmaciens 
                  confrontés à des difficultés dans leur pratique.
                </p>
              </div>

              <div className="defense-professionnelle-action-card">
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
