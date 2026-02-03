import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Layout5.css';

const AccueilLayout5 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const poles = [
    { 
      title: 'Pôle Énergie', 
      icon: '⚡', 
      link: '/poles/energie',
      description: 'Solutions énergétiques durables'
    },
    { 
      title: 'Traitement de Données Géospatiales', 
      icon: '🗺️', 
      link: '/poles/geospatial',
      description: 'Cartographie et modélisation'
    },
    { 
      title: 'ODS - Services Drones', 
      icon: '🚁', 
      link: '/poles/drone',
      description: 'Captation aérienne professionnelle'
    },
    { 
      title: 'Santé Connectée', 
      icon: '⚕️', 
      link: '/poles/sante',
      description: 'Télémédecine'
    },
    { 
      title: 'Sécurité Numérique', 
      icon: '🔒', 
      link: '/poles/securite',
      description: 'Cybersécurité'
    }
  ];

  return (
    <div className="accueil-layout5">
      {/* Hero Parallax Immersif */}
      <section className="layout5-hero" ref={heroRef}>
        <div 
          className="layout5-hero-background"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        <div className="layout5-hero-overlay"></div>
        <div className="layout5-hero-content">
          <div className="layout5-hero-badge">Innovation Technologique</div>
          <h1 className="layout5-hero-title">
            <span className="layout5-title-word">Conception</span>
            <span className="layout5-title-word">innovante</span>
            <span className="layout5-title-word">pour la</span>
            <span className="layout5-title-word highlight">sécurité</span>
          </h1>
          <p className="layout5-hero-subtitle">
            Solutions technologiques pour l'Afrique
          </p>
          <div className="layout5-hero-buttons">
            <Link to="/poles" className="layout5-btn-primary">
              <span>Découvrir</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="layout5-btn-secondary">Contact</Link>
          </div>
        </div>
        <div className="layout5-hero-indicators">
          {poles.map((_, index) => (
            <div
              key={index}
              className={`layout5-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* Section Pôles - Storytelling Alterné */}
      <section className="layout5-poles">
        <div className="container">
          <div className="layout5-poles-header">
            <h2 className="layout5-section-title">Nos Pôles d'Activité</h2>
            <p className="layout5-section-subtitle">5 domaines d'expertise pour l'Afrique</p>
          </div>
          <div className="layout5-poles-list">
            {poles.map((pole, index) => (
              <Link
                key={index}
                to={pole.link}
                className={`layout5-pole-item ${index % 2 === 0 ? 'layout5-pole-left' : 'layout5-pole-right'}`}
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="layout5-pole-visual">
                  <div className="layout5-pole-icon">{pole.icon}</div>
                  <div className="layout5-pole-glow"></div>
                </div>
                <div className="layout5-pole-content">
                  <h3>{pole.title}</h3>
                  <p>{pole.description}</p>
                  <div className="layout5-pole-arrow">
                    <span>En savoir plus</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section About - Immersive */}
      <section className="layout5-about">
        <div className="layout5-about-content">
          <div className="layout5-about-text">
            <div className="layout5-about-badge">À Propos</div>
            <h2>Qui sommes-nous ?</h2>
            <p>
              Basé au Gabon, CIPS développe des solutions technologiques pour répondre aux défis 
              énergétiques, numériques, environnementaux et sanitaires de l'Afrique.
            </p>
            <Link to="/apropos" className="layout5-link-arrow">
              En savoir plus
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="layout5-about-visual">
            <div className="layout5-visual-layers">
              {[1, 2, 3].map((i) => (
                <div key={i} className="layout5-visual-layer" style={{ '--layer': i } as React.CSSProperties}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Immersive */}
      <section className="layout5-cta">
        <div className="layout5-cta-background"></div>
        <div className="container">
          <div className="layout5-cta-content">
            <h2>Prêt à démarrer votre projet ?</h2>
            <p>Rejoignez-nous dans la transformation technologique de l'Afrique</p>
            <div className="layout5-cta-buttons">
              <Link to="/devis" className="layout5-btn-primary">Demander un devis</Link>
              <Link to="/contact" className="layout5-btn-secondary-white">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout5;
