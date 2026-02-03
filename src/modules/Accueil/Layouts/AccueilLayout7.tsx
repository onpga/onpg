import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Layout7.css';

const AccueilLayout7 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
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
    <div className="accueil-layout7">
      <section className="layout7-hero" style={{ '--mouse-x': mousePosition.x, '--mouse-y': mousePosition.y } as React.CSSProperties}>
        <div className="layout7-hero-background"></div>
        <div className="layout7-hero-content">
          <div className="layout7-hero-badge">Innovation Technologique</div>
          <h1 className="layout7-hero-title">
            Conception innovante<br />
            <span className="layout7-title-gradient">pour la sécurité</span>
          </h1>
          <p className="layout7-hero-subtitle">Solutions technologiques pour l'Afrique</p>
          <div className="layout7-hero-buttons">
            <Link to="/poles" className="layout7-btn-primary">Découvrir</Link>
            <Link to="/contact" className="layout7-btn-secondary">Contact</Link>
          </div>
        </div>
      </section>

      <section className="layout7-poles">
        <div className="container">
          <div className="layout7-poles-header">
            <h2 className="layout7-section-title">Nos Pôles d'Activité</h2>
            <p className="layout7-section-subtitle">5 domaines d'expertise</p>
          </div>
          <div className="layout7-poles-grid">
            {poles.map((pole, index) => (
              <Link key={index} to={pole.link} className="layout7-pole-card" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
                <div className="layout7-pole-icon">{pole.icon}</div>
                <h3>{pole.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="layout7-about">
        <div className="layout7-about-content">
          <div className="layout7-about-text">
            <h2>Qui sommes-nous ?</h2>
            <p>Basé au Gabon, CIPS développe des solutions technologiques pour répondre aux défis énergétiques, numériques, environnementaux et sanitaires de l'Afrique.</p>
            <Link to="/apropos" className="layout7-link">En savoir plus &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="layout7-cta">
        <div className="container">
          <h2>Prêt à démarrer votre projet ?</h2>
          <div className="layout7-cta-buttons">
            <Link to="/devis" className="layout7-btn-primary">Demander un devis</Link>
            <Link to="/contact" className="layout7-btn-secondary">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout7;

