import { Link } from 'react-router-dom';
import './Layout9.css';

const AccueilLayout9 = () => {
  const poles = [
    { title: 'Pôle Énergie', icon: '⚡', link: '/poles/energie' },
    { title: 'Traitement de Données Géospatiales', icon: '🗺️', link: '/poles/geospatial' },
    { title: 'ODS - Services Drones', icon: '🚁', link: '/poles/drone' },
    { title: 'Santé Connectée', icon: '⚕️', link: '/poles/sante' },
    { title: 'Sécurité Numérique', icon: '🔒', link: '/poles/securite' }
  ];

  return (
    <div className="accueil-layout9">
      <section className="layout9-hero">
        <div className="layout9-hero-content">
          <div className="layout9-hero-badge">Innovation Technologique</div>
          <h1 className="layout9-hero-title">
            Conception innovante<br />
            <span className="layout9-title-highlight">pour la sécurité</span>
          </h1>
          <p className="layout9-hero-subtitle">Solutions technologiques pour l'Afrique</p>
          <div className="layout9-hero-buttons">
            <Link to="/poles" className="layout9-btn-primary">Découvrir</Link>
            <Link to="/contact" className="layout9-btn-secondary">Contact</Link>
          </div>
        </div>
      </section>

      <section className="layout9-poles">
        <div className="container">
          <div className="layout9-poles-header">
            <h2 className="layout9-section-title">Nos Pôles d'Activité</h2>
            <p className="layout9-section-subtitle">5 domaines d'expertise</p>
          </div>
          <div className="layout9-poles-grid">
            {poles.map((pole, index) => (
              <Link key={index} to={pole.link} className="layout9-pole-card" style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}>
                <div className="layout9-pole-icon">{pole.icon}</div>
                <h3>{pole.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="layout9-about">
        <div className="layout9-about-content">
          <div className="layout9-about-text">
            <h2>Qui sommes-nous ?</h2>
            <p>Basé au Gabon, CIPS développe des solutions technologiques pour répondre aux défis énergétiques, numériques, environnementaux et sanitaires de l'Afrique.</p>
            <Link to="/apropos" className="layout9-link">En savoir plus &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="layout9-cta">
        <div className="container">
          <h2>Prêt à démarrer votre projet ?</h2>
          <div className="layout9-cta-buttons">
            <Link to="/devis" className="layout9-btn-primary">Demander un devis</Link>
            <Link to="/contact" className="layout9-btn-secondary">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout9;







