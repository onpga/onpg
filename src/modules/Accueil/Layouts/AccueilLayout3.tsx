import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Layout3.css';

const AccueilLayout3 = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Solutions technologiques pour l\'Afrique';

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const poles = [
    { title: 'Pôle Énergie', icon: '⚡', link: '/poles/energie', code: 'ENERGY' },
    { title: 'Traitement de Données Géospatiales', icon: '🗺️', link: '/poles/geospatial', code: 'GEO' },
    { title: 'ODS - Services Drones', icon: '🚁', link: '/poles/drone', code: 'DRONE' },
    { title: 'Santé Connectée', icon: '⚕️', link: '/poles/sante', code: 'HEALTH' },
    { title: 'Sécurité Numérique', icon: '🔒', link: '/poles/securite', code: 'SECURE' }
  ];

  return (
    <div className="accueil-layout3">
      {/* Progress Bar */}
      <div className="layout3-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* Hero Dark Tech - Adapté à la charte CIPS */}
      <section className="layout3-hero">
        <div className="layout3-hero-grid"></div>
        <div className="layout3-hero-content">
          <div className="layout3-code-badge">
            <span className="layout3-code-dot"></span>
            <span>CSIP.TECH</span>
          </div>
          <h1 className="layout3-hero-title">
            <span className="layout3-title-code">const</span>{' '}
            <span className="layout3-title-var">innovation</span>{' '}
            <span className="layout3-title-code">=</span>{' '}
            <span className="layout3-title-string">&quot;sécurité&quot;</span>
          </h1>
          <p className="layout3-hero-subtitle">
            {typedText}
            <span className="layout3-cursor">|</span>
          </p>
          <div className="layout3-hero-buttons">
            <Link to="/poles" className="layout3-btn-tech">
              <span>Découvrir</span>
              <span className="layout3-btn-arrow">&rarr;</span>
            </Link>
            <Link to="/contact" className="layout3-btn-outline-tech">Contact</Link>
          </div>
        </div>
        <div className="layout3-hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="layout3-particle" style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}></div>
          ))}
        </div>
      </section>

      {/* Pôles - Code Style avec charte CIPS */}
      <section className="layout3-poles">
        <div className="container">
          <div className="layout3-section-header">
            <span className="layout3-section-comment">// Nos Pôles d'Activité</span>
            <h2 className="layout3-section-title">poles.map(pole =&gt; ...)</h2>
          </div>
          <div className="layout3-poles-grid">
            {poles.map((pole, index) => (
              <Link
                key={index}
                to={pole.link}
                className="layout3-pole-card"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="layout3-card-header">
                  <span className="layout3-card-icon">{pole.icon}</span>
                  <span className="layout3-card-code">{pole.code}</span>
                </div>
                <h3>{pole.title}</h3>
                <div className="layout3-card-footer">
                  <span className="layout3-card-link">view &rarr;</span>
                </div>
                <div className="layout3-card-glow"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About - Terminal Style */}
      <section className="layout3-about">
        <div className="container">
          <div className="layout3-terminal">
            <div className="layout3-terminal-header">
              <div className="layout3-terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="layout3-terminal-title">about.ts</span>
            </div>
            <div className="layout3-terminal-content">
              <div className="layout3-terminal-line">
                <span className="layout3-terminal-prompt">$</span>
                <span className="layout3-terminal-text">cat about.txt</span>
              </div>
              <div className="layout3-terminal-output">
                <p>
                  Basé au Gabon, CIPS développe des solutions technologiques<br />
                  pour répondre aux défis énergétiques, numériques,<br />
                  environnementaux et sanitaires de l'Afrique.
                </p>
              </div>
              <div className="layout3-terminal-line">
                <span className="layout3-terminal-prompt">$</span>
                <Link to="/apropos" className="layout3-terminal-link">
                  <span>learnMore()</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="layout3-cta">
        <div className="container">
          <div className="layout3-cta-content">
            <h2 className="layout3-cta-title">
              ready<span className="layout3-code-symbol">?</span>
            </h2>
            <div className="layout3-cta-buttons">
              <Link to="/devis" className="layout3-btn-tech">
                <span>startProject()</span>
                <span className="layout3-btn-arrow">&rarr;</span>
              </Link>
              <Link to="/contact" className="layout3-btn-outline-tech">contact()</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout3;
