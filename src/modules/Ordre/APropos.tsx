import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les données
interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Valeur {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
  color: string;
}

// Données fictives
const missions: Mission[] = [
  {
    id: '1',
    title: 'Protection de la Santé Publique',
    description: 'Veiller à la qualité, à la sécurité et à l\'efficacité des médicaments et des produits de santé.',
    icon: '🏥',
    color: '#00A651'
  },
  {
    id: '2',
    title: 'Défense de la Profession',
    description: 'Représenter et défendre les intérêts professionnels des pharmaciens gabonais.',
    icon: '⚖️',
    color: '#008F45'
  },
  {
    id: '3',
    title: 'Formation et Éthique',
    description: 'Assurer la formation continue et le respect du code de déontologie par tous les pharmaciens.',
    icon: '🎓',
    color: '#2ECC71'
  },
  {
    id: '4',
    title: 'Innovation et Modernisation',
    description: 'Promouvoir l\'innovation technologique et l\'adaptation aux évolutions du système de santé.',
    icon: '🚀',
    color: '#27AE60'
  }
];

const valeurs: Valeur[] = [
  {
    id: '1',
    title: 'Excellence',
    description: 'Poursuite de l\'excellence dans tous les domaines d\'activité professionnelle.',
    icon: '⭐'
  },
  {
    id: '2',
    title: 'Éthique',
    description: 'Respect absolu du code de déontologie et des valeurs morales.',
    icon: '🛡️'
  },
  {
    id: '3',
    title: 'Solidarité',
    description: 'Esprit de solidarité entre tous les membres de la profession.',
    icon: '🤝'
  },
  {
    id: '4',
    title: 'Innovation',
    description: 'Ouverture aux innovations technologiques et scientifiques.',
    icon: '💡'
  }
];

const stats: Stat[] = [
  {
    id: '1',
    value: '45+',
    label: 'Années d\'existence',
    icon: '📅',
    color: '#00A651'
  },
  {
    id: '2',
    value: '1200+',
    label: 'Pharmaciens inscrits',
    icon: '👥',
    color: '#008F45'
  },
  {
    id: '3',
    value: '300+',
    label: 'Officines actives',
    icon: '🏥',
    color: '#2ECC71'
  },
  {
    id: '4',
    value: '98.5%',
    label: 'Satisfaction patients',
    icon: '⭐',
    color: '#27AE60'
  }
];

const APropos = () => {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMissionHover = (missionId: string) => {
    setActiveMission(missionId);
  };

  const handleMissionLeave = () => {
    setActiveMission(null);
  };

  return (
    <div className="ordre-page">
      {/* Hero Section avec animation d'entrée */}
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className={`hero-animation ${isVisible ? 'animate' : ''}`}>
              <h1 className="hero-title">
                <span className="hero-title-main">À propos</span>
                <span className="hero-title-subtitle">de l'ONPG</span>
              </h1>
              <div className="hero-description">
                <p>
                  L'Ordre National des Pharmaciens du Gabon est l'institution officielle chargée
                  de représenter, défendre et réguler l'exercice de la profession pharmaceutique
                  sur le territoire national.
                </p>
                <div className="hero-highlights">
                  <span className="highlight-item">🏛️ Institution Officielle</span>
                  <span className="highlight-item">🎯 Excellence Professionnelle</span>
                  <span className="highlight-item">🇬🇦 Service Public</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards animées */}
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`stat-card ${isVisible ? 'animate' : ''}`}
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                  borderColor: stat.color
                }}
              >
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Pattern */}
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Navigation interne */}
      <nav className="ordre-nav">
        <div className="nav-container">
          <Link to="#mission" className="nav-link">Notre Mission</Link>
          <Link to="#valeurs" className="nav-link">Nos Valeurs</Link>
          <Link to="#histoire" className="nav-link">Notre Histoire</Link>
          <Link to="#organisation" className="nav-link">Organisation</Link>
        </div>
      </nav>

      {/* Section Mission */}
      <section id="mission" className="mission-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🎯</span>
              Notre Mission
            </h2>
            <p className="section-subtitle">
              Engagés pour l'excellence de la santé publique au Gabon
            </p>
          </div>

          <div className="missions-grid">
            {missions.map((mission, index) => (
              <div
                key={mission.id}
                className={`mission-card ${activeMission === mission.id ? 'active' : ''}`}
                onMouseEnter={() => handleMissionHover(mission.id)}
                onMouseLeave={handleMissionLeave}
                style={{
                  animationDelay: `${0.1 * index}s`,
                  borderColor: activeMission === mission.id ? mission.color : 'transparent'
                }}
              >
                <div className="mission-icon" style={{ backgroundColor: mission.color }}>
                  {mission.icon}
                </div>
                <div className="mission-content">
                  <h3 className="mission-title">{mission.title}</h3>
                  <p className="mission-description">{mission.description}</p>
                </div>
                <div
                  className="mission-accent"
                  style={{ backgroundColor: mission.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section id="valeurs" className="valeurs-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">💎</span>
              Nos Valeurs
            </h2>
            <p className="section-subtitle">
              Les principes fondamentaux qui guident notre action
            </p>
          </div>

          <div className="valeurs-grid">
            {valeurs.map((valeur, index) => (
              <div
                key={valeur.id}
                className="valeur-card"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="valeur-icon">
                  <span className="icon-emoji">{valeur.icon}</span>
                  <div className="icon-bg"></div>
                </div>
                <div className="valeur-content">
                  <h3 className="valeur-title">{valeur.title}</h3>
                  <p className="valeur-description">{valeur.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Histoire */}
      <section id="histoire" className="histoire-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📚</span>
              Notre Histoire
            </h2>
            <p className="section-subtitle">
              Plus de 45 ans au service de la santé gabonaise
            </p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line"></div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-year">1978</div>
                <h3 className="timeline-title">Création de l'Ordre</h3>
                <p className="timeline-description">
                  Fondation de l'Ordre National des Pharmaciens du Gabon pour réguler
                  et organiser la profession pharmaceutique.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-year">2005</div>
                <h3 className="timeline-title">Modernisation</h3>
                <p className="timeline-description">
                  Adoption du nouveau code de déontologie et mise en place
                  du système de formation continue obligatoire.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-year">2015</div>
                <h3 className="timeline-title">Numérisation</h3>
                <p className="timeline-description">
                  Lancement de la plateforme numérique et des services en ligne
                  pour faciliter les démarches administratives.
                </p>
              </div>
            </div>

            <div className="timeline-item active">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-year">2024</div>
                <h3 className="timeline-title">Innovation Continue</h3>
                <p className="timeline-description">
                  Développement de nouvelles technologies et partenariats
                  pour améliorer l'accès aux soins de santé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Organisation */}
      <section id="organisation" className="organisation-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🏗️</span>
              Organisation
            </h2>
            <p className="section-subtitle">
              Structure et gouvernance de l'institution
            </p>
          </div>

          <div className="organisation-content">
            <div className="organisation-text">
              <h3>Une structure démocratique et représentative</h3>
              <p>
                L'ONPG est organisé selon un modèle démocratique avec des instances
                représentatives de tous les secteurs de la profession pharmaceutique.
                Le Conseil National, élu par les pairs, définit la politique générale
                et veille à l'application des décisions.
              </p>

              <div className="organisation-links">
                <Link to="/ordre/instance" className="org-link">
                  <span className="link-icon">🏛️</span>
                  Découvrir nos instances
                </Link>
                <Link to="/ordre/organigramme" className="org-link">
                  <span className="link-icon">📊</span>
                  Voir l'organigramme
                </Link>
                <Link to="/ordre/conseil-national" className="org-link">
                  <span className="link-icon">👥</span>
                  Conseil National
                </Link>
              </div>
            </div>

            <div className="organisation-visual">
              <div className="org-structure">
                <div className="org-level president">
                  <div className="org-title">Président</div>
                </div>
                <div className="org-level conseil">
                  <div className="org-title">Conseil National</div>
                  <div className="org-subtitle">25 membres élus</div>
                </div>
                <div className="org-level sections">
                  <div className="org-title">4 Sections Professionnelles</div>
                  <div className="org-subtitle">A, B, C, D</div>
                </div>
                <div className="org-level membres">
                  <div className="org-title">Membres</div>
                  <div className="org-subtitle">1200+ pharmaciens</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Rejoignez notre communauté</h2>
          <p className="cta-description">
            Ensemble, construisons l'avenir de la pharmacie gabonaise
          </p>
          <div className="cta-buttons">
            <Link to="/membres/tableau-ordre" className="cta-btn primary">
              Consulter le tableau →
            </Link>
            <Link to="/contact" className="cta-btn secondary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APropos;

