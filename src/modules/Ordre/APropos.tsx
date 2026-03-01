import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './AProposOrdre.css';

/* ── Icônes SVG ────────────────────────────────────────────── */
const IcoShield = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);
const IcoScales = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M5 21h14M3 6l9 2 9-2M3 6l4 8c0 2-2 3-4 3s-4-1-4-3l4-8zM21 6l-4 8c0 2 2 3 4 3s4-1 4-3l-4-8z"/>
  </svg>
);
const IcoBook = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    <path d="M8 7h8M8 11h6"/>
  </svg>
);
const IcoLightbulb = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21h6M12 3a6 6 0 016 6c0 2.2-1.2 4.1-3 5.2V17a1 1 0 01-1 1H10a1 1 0 01-1-1v-2.8A6 6 0 0112 3z"/>
  </svg>
);
const IcoStar = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoShieldSmall = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IcoHandshake = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5l-2-2a2 2 0 012.83-2.83l1.17 1.17 2-2a2 2 0 012.83 2.83L13 13.5"/>
    <path d="M14.5 8.5l1.5-1.5a2 2 0 012.83 2.83l-6 6a2 2 0 01-2.83 0l-1.5-1.5"/>
    <path d="M3 11l4 4M17 3l4 4"/>
  </svg>
);
const IcoBulb = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21h6M12 3a6 6 0 016 6c0 2.2-1.2 4.1-3 5.2V17a1 1 0 01-1 1H10a1 1 0 01-1-1v-2.8A6 6 0 0112 3z"/>
  </svg>
);
const IcoBuilding = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2"/><path d="M9 22V12h6v10M9 7h1M14 7h1M9 11h1M14 11h1"/>
  </svg>
);
const IcoTarget = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IcoFlag = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);
const IcoChart = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IcoUsers = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IcoMission = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IcoGem = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 3 18 3 22 9 12 22 2 9 6 3"/><line x1="2" y1="9" x2="22" y2="9"/>
    <line x1="6" y1="3" x2="12" y2="22"/><line x1="18" y1="3" x2="12" y2="22"/>
  </svg>
);
const IcoOrg = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="2" width="8" height="5" rx="1"/><rect x="1" y="17" width="8" height="5" rx="1"/>
    <rect x="15" y="17" width="8" height="5" rx="1"/><path d="M12 7v4M8 19H5v-2M19 19h-3v-2M12 11h-7v6M12 11h7v6"/>
  </svg>
);

/* ── Types ─────────────────────────────────────────────────── */
interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Valeur {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

/* ── Données ───────────────────────────────────────────────── */
const missions: Mission[] = [
  {
    id: '1',
    title: 'Protection de la Santé Publique',
    description: 'Veiller à la qualité, à la sécurité et à l\'efficacité des médicaments et des produits de santé.',
    icon: <IcoShield />,
    color: '#00A651'
  },
  {
    id: '2',
    title: 'Défense de la Profession',
    description: 'Représenter et défendre les intérêts professionnels des pharmaciens gabonais.',
    icon: <IcoScales />,
    color: '#008F45'
  },
  {
    id: '3',
    title: 'Formation et Éthique',
    description: 'Assurer la formation continue et le respect du code de déontologie par tous les pharmaciens.',
    icon: <IcoBook />,
    color: '#2ECC71'
  },
  {
    id: '4',
    title: 'Innovation et Modernisation',
    description: 'Promouvoir l\'innovation technologique et l\'adaptation aux évolutions du système de santé.',
    icon: <IcoLightbulb />,
    color: '#27AE60'
  }
];

const valeurs: Valeur[] = [
  {
    id: '1',
    title: 'Excellence',
    description: 'Poursuite de l\'excellence dans tous les domaines d\'activité professionnelle.',
    icon: <IcoStar />
  },
  {
    id: '2',
    title: 'Éthique',
    description: 'Respect absolu du code de déontologie et des valeurs morales.',
    icon: <IcoShieldSmall />
  },
  {
    id: '3',
    title: 'Solidarité',
    description: 'Esprit de solidarité entre tous les membres de la profession.',
    icon: <IcoHandshake />
  },
  {
    id: '4',
    title: 'Innovation',
    description: 'Ouverture aux innovations technologiques et scientifiques.',
    icon: <IcoBulb />
  }
];

const APropos = () => {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [nombrePharmaciens, setNombrePharmaciens] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Charger le nombre réel de pharmaciens depuis la base de données
  useEffect(() => {
    const loadNombrePharmaciens = async () => {
      try {
        const data = await fetchResourceData('pharmaciens');
        if (data) {
          const rawArray = Array.isArray(data) ? data : [data];
          // Filtrer uniquement les pharmaciens actifs
          const actifs = rawArray.filter((p: any) => p.isActive !== false);
          setNombrePharmaciens(actifs.length);
        }
      } catch (error) {
        console.error('Erreur chargement nombre pharmaciens:', error);
        // En cas d'erreur, on laisse null pour ne pas afficher de nombre
      }
    };
    
    loadNombrePharmaciens();
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
                  <span className="highlight-item"><IcoBuilding /> Institution Officielle</span>
                  <span className="highlight-item"><IcoTarget /> Excellence Professionnelle</span>
                  <span className="highlight-item"><IcoFlag /> Service Public</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc stats fictives supprimé pour éviter de fausses informations */}
        </div>

        {/* Background Pattern */}
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Navigation interne (on utilise des ancres classiques pour forcer le scroll) */}
      <nav className="ordre-nav">
        <div className="nav-container">
          <a href="#mission" className="nav-link">Notre Mission</a>
          <a href="#valeurs" className="nav-link">Nos Valeurs</a>
          <a href="#organisation" className="nav-link">Organisation</a>
        </div>
      </nav>

      {/* Section Mission */}
      <section id="mission" className="mission-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon"><IcoMission /></span>
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
              <span className="title-icon"><IcoGem /></span>
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

      {/* Section Organisation */}
      <section id="organisation" className="organisation-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon"><IcoOrg /></span>
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
                <Link to="/ordre/organigramme" className="org-link">
                  <span className="link-icon"><IcoChart /></span>
                  Voir l'organigramme
                </Link>
                <Link to="/ordre/conseil-national" className="org-link">
                  <span className="link-icon"><IcoUsers /></span>
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
                  <div className="org-subtitle"><span className="org-number">25</span> membres élus</div>
                </div>
                <div className="org-level sections">
                  <div className="org-title"><span className="org-number">4</span> Sections Professionnelles</div>
                  <div className="org-subtitle">A, B, C, D</div>
                </div>
                <div className="org-level membres">
                  <div className="org-title">Membres</div>
                  <div className="org-subtitle">
                    {nombrePharmaciens !== null 
                      ? <><span className="org-number">{nombrePharmaciens}</span> pharmacien{nombrePharmaciens > 1 ? 's' : ''}</>
                      : 'Pharmaciens inscrits'}
                  </div>
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

