import { Link } from 'react-router-dom';
import './SantePublique.css';

const SantePublique = () => {
  return (
    <div className="pratique-page">
      {/* Hero Section - Style similaire à Déontologie */}
      <section className="pratique-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Protection de la</span>
              <span className="hero-title-subtitle">Santé Publique</span>
            </h1>
            <p className="hero-description">
              Garantir la qualité et la sécurité des médicaments au Gabon.
              L'ONPG veille à la protection de la santé publique par le contrôle
              et la régulation de la profession pharmaceutique.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏥 Qualité des médicaments</span>
              <span className="highlight-item">🛡️ Sécurité sanitaire</span>
              <span className="highlight-item">📋 Réglementation</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Engagement</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Vigilance</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Protection</div>
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
          <div className="sante-publique-card">
            <h2 className="sante-publique-title">
              Notre Mission
            </h2>
            <p className="sante-publique-description">
              L'Ordre National des Pharmaciens du Gabon (ONPG) a pour mission fondamentale 
              de protéger la santé publique en garantissant la qualité, la sécurité et 
              l'efficacité des médicaments et produits de santé disponibles au Gabon.
            </p>

            <h3 className="sante-publique-subtitle">
              Nos Actions
            </h3>
            <div>
              <div className="sante-publique-action-card">
                <h4 className="sante-publique-action-title">
                  Contrôle de la qualité des médicaments
                </h4>
                <p className="sante-publique-action-description">
                  Veiller à ce que tous les médicaments commercialisés respectent les normes 
                  de qualité et de sécurité établies.
                </p>
              </div>

              <div className="sante-publique-action-card">
                <h4 className="sante-publique-action-title">
                  Lutte contre les médicaments falsifiés
                </h4>
                <p className="sante-publique-action-description">
                  Mettre en place des mécanismes de détection et de prévention contre 
                  les médicaments contrefaits ou falsifiés.
                </p>
              </div>

              <div className="sante-publique-action-card">
                <h4 className="sante-publique-action-title">
                  Surveillance pharmaceutique
                </h4>
                <p className="sante-publique-action-description">
                  Assurer une veille active sur les effets indésirables et les problèmes 
                  de sécurité liés aux médicaments.
                </p>
              </div>

              <div className="sante-publique-action-card">
                <h4 className="sante-publique-action-title">
                  Formation et sensibilisation
                </h4>
                <p className="sante-publique-action-description">
                  Informer les professionnels de santé et le public sur les bonnes pratiques 
                  d'utilisation des médicaments.
                </p>
              </div>

              <div className="sante-publique-action-card">
                <h4 className="sante-publique-action-title">
                  Réglementation
                </h4>
                <p className="sante-publique-action-description">
                  Participer à l'élaboration et à l'application des textes réglementaires 
                  relatifs à la pharmacie et aux médicaments.
                </p>
              </div>
            </div>

            <h3 className="sante-publique-subtitle">
              Engagement
            </h3>
            <div className="sante-publique-engagement">
              <p className="sante-publique-engagement-text">
                L'ONPG s'engage à travailler en étroite collaboration avec les autorités 
                sanitaires, les professionnels de santé et les patients pour garantir 
                un accès sécurisé aux médicaments de qualité au Gabon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="sante-publique-nav">
        <div className="sante-publique-nav-buttons">
          <Link to="/" className="sante-publique-nav-btn secondary">
            ← Retour à l'accueil
          </Link>
          <Link to="/ordre/a-propos" className="sante-publique-nav-btn primary">
            En savoir plus sur l'Ordre →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SantePublique;
