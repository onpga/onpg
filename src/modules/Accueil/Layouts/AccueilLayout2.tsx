import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Layout2.css';

const AccueilLayout2 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const poles = [
    { title: 'Pôle Énergie', icon: '⚡', link: '/poles/energie' },
    { title: 'Traitement de Données Géospatiales', icon: '🗺️', link: '/poles/geospatial' },
    { title: 'ODS - Services Drones', icon: '🚁', link: '/poles/drone' },
    { title: 'Santé Connectée', icon: '⚕️', link: '/poles/sante' },
    { title: 'Sécurité Numérique', icon: '🔒', link: '/poles/securite' }
  ];

  return (
    <div className="accueil-layout2">
      {/* Hero avec Glassmorphism et Cursor Light */}
      <section className="layout2-hero" ref={heroRef}>
        <div 
          className="layout2-cursor-light"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        ></div>
        <div className="layout2-hero-background">
          <div className="layout2-gradient-orb layout2-orb-1"></div>
          <div className="layout2-gradient-orb layout2-orb-2"></div>
          <div className="layout2-gradient-orb layout2-orb-3"></div>
        </div>
        <div className="layout2-hero-content">
          <div className="layout2-hero-glass">
            <div className="layout2-hero-badge">Innovation Technologique</div>
            <h1 className="layout2-hero-title">
              Conception innovante<br />
              <span className="layout2-title-highlight">pour la sécurité</span>
            </h1>
            <p className="layout2-hero-subtitle">
              Solutions technologiques pour l'Afrique
            </p>
            <div className="layout2-hero-buttons">
              <Link to="/poles" className="layout2-btn-glass">
                <span>Découvrir</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/contact" className="layout2-btn-outline">Contact</Link>
            </div>
          </div>
        </div>
        <div className="layout2-morphing-shapes">
          <div className="layout2-shape layout2-shape-1"></div>
          <div className="layout2-shape layout2-shape-2"></div>
          <div className="layout2-shape layout2-shape-3"></div>
        </div>
      </section>

      {/* Section Pôles - Glassmorphism Cards */}
      <section className="layout2-poles">
        <div className="container">
          <div className="layout2-poles-header">
            <h2 className="layout2-section-title">Nos Pôles d'Activité</h2>
            <p className="layout2-section-subtitle">5 domaines d'expertise pour l'Afrique</p>
          </div>
          <div className="layout2-poles-grid">
            {poles.map((pole, index) => (
              <Link 
                key={index}
                to={pole.link}
                className="layout2-pole-card"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="layout2-pole-glass">
                  <div className="layout2-pole-icon">{pole.icon}</div>
                  <h3>{pole.title}</h3>
                  <div className="layout2-pole-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section About - Split Glass */}
      <section className="layout2-about">
        <div className="layout2-about-content">
          <div className="layout2-about-text">
            <div className="layout2-about-badge">À Propos</div>
            <h2>Qui sommes-nous ?</h2>
            <p>
              Basé au Gabon, CIPS développe des solutions technologiques pour répondre aux défis 
              énergétiques, numériques, environnementaux et sanitaires de l'Afrique.
            </p>
            <Link to="/apropos" className="layout2-link-arrow">
              En savoir plus
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="layout2-about-visual">
            <div className="layout2-visual-glass">
              <div className="layout2-visual-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="layout2-visual-item"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Glassmorphism */}
      <section className="layout2-cta">
        <div className="layout2-cta-background"></div>
        <div className="container">
          <div className="layout2-cta-glass">
            <h2>Prêt à démarrer votre projet ?</h2>
            <p>Rejoignez-nous dans la transformation technologique de l'Afrique</p>
            <div className="layout2-cta-buttons">
              <Link to="/devis" className="layout2-btn-glass">Demander un devis</Link>
              <Link to="/contact" className="layout2-btn-outline-white">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout2;
