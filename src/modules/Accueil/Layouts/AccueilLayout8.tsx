import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Layout8.css';

const AccueilLayout8 = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const poles = [
    { title: 'Pôle Énergie', icon: '⚡', link: '/poles/energie' },
    { title: 'Traitement de Données Géospatiales', icon: '🗺️', link: '/poles/geospatial' },
    { title: 'ODS - Services Drones', icon: '🚁', link: '/poles/drone' },
    { title: 'Santé Connectée', icon: '⚕️', link: '/poles/sante' },
    { title: 'Sécurité Numérique', icon: '🔒', link: '/poles/securite' }
  ];

  return (
    <div className="accueil-layout8">
      <section className="layout8-hero" style={{ '--scroll': scrollY } as React.CSSProperties}>
        <div className="layout8-hero-background"></div>
        <div className="layout8-hero-content">
          <div className="layout8-hero-badge">Innovation Technologique</div>
          <h1 className="layout8-hero-title">
            Conception innovante<br />
            <span className="layout8-title-accent">pour la sécurité</span>
          </h1>
          <p className="layout8-hero-subtitle">Solutions technologiques pour l'Afrique</p>
          <div className="layout8-hero-buttons">
            <Link to="/poles" className="layout8-btn-primary">Découvrir</Link>
            <Link to="/contact" className="layout8-btn-secondary">Contact</Link>
          </div>
        </div>
      </section>

      <section className="layout8-poles">
        <div className="container">
          <div className="layout8-poles-header">
            <h2 className="layout8-section-title">Nos Pôles d'Activité</h2>
            <p className="layout8-section-subtitle">5 domaines d'expertise</p>
          </div>
          <div className="layout8-poles-grid">
            {poles.map((pole, index) => (
              <Link key={index} to={pole.link} className="layout8-pole-card" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
                <div className="layout8-pole-icon">{pole.icon}</div>
                <h3>{pole.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="layout8-about">
        <div className="layout8-about-content">
          <div className="layout8-about-text">
            <h2>Qui sommes-nous ?</h2>
            <p>Basé au Gabon, CIPS développe des solutions technologiques pour répondre aux défis énergétiques, numériques, environnementaux et sanitaires de l'Afrique.</p>
            <Link to="/apropos" className="layout8-link">En savoir plus &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="layout8-cta">
        <div className="container">
          <h2>Prêt à démarrer votre projet ?</h2>
          <div className="layout8-cta-buttons">
            <Link to="/devis" className="layout8-btn-primary">Demander un devis</Link>
            <Link to="/contact" className="layout8-btn-secondary">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout8;







