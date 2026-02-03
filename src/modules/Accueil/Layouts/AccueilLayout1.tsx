import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import './Layout1.css';

const AccueilLayout1 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Canvas particles animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles: Array<{x: number; y: number; vx: number; vy: number; size: number}> = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
          });
        }
        
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(255, 140, 66, 0.3)';
          
          particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Connect particles
            particles.slice(i + 1).forEach(other => {
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 150) {
                ctx.strokeStyle = `rgba(255, 140, 66, ${0.2 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            });
          });
          
          requestAnimationFrame(animate);
        };
        
        animate();
        
        const handleResize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }

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
    <div className="accueil-layout1">
      {/* Hero Section - 3D Immersive */}
      <section className="layout1-hero" ref={heroRef}>
        <canvas ref={canvasRef} className="layout1-canvas"></canvas>
        <div 
          className="layout1-mouse-light"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        ></div>
        <div className="layout1-hero-content">
          <div className="layout1-hero-badge">Innovation Technologique</div>
          <h1 className="layout1-hero-title">
            <span className="layout1-title-word">Conception</span>
            <span className="layout1-title-word">innovante</span>
            <span className="layout1-title-word">pour la</span>
            <span className="layout1-title-word highlight">sécurité</span>
          </h1>
          <p className="layout1-hero-subtitle">
            Solutions technologiques pour l'Afrique
          </p>
          <div className="layout1-hero-buttons">
            <Link to="/poles" className="layout1-btn-magnetic">
              <span>Découvrir</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="layout1-btn-outline">Contact</Link>
          </div>
        </div>
        <div className="layout1-scroll-indicator">
          <div className="layout1-scroll-text">Scroll</div>
          <div className="layout1-scroll-line"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="layout1-stats">
        <div className="container">
          <div className="layout1-stats-grid">
            <div className="layout1-stat-item">
              <div className="layout1-stat-number" data-target="5">0</div>
              <div className="layout1-stat-label">Pôles d'Activité</div>
            </div>
            <div className="layout1-stat-item">
              <div className="layout1-stat-number" data-target="100">0</div>
              <div className="layout1-stat-label">Projets Réalisés</div>
            </div>
            <div className="layout1-stat-item">
              <div className="layout1-stat-number" data-target="15">0</div>
              <div className="layout1-stat-label">Années d'Expérience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Pôles - 3D Cards */}
      <section className="layout1-poles">
        <div className="container">
          <div className="layout1-poles-header">
            <h2 className="layout1-section-title">Nos Pôles d'Activité</h2>
            <p className="layout1-section-subtitle">5 domaines d'expertise pour l'Afrique</p>
          </div>
          <div className="layout1-poles-grid">
            {poles.map((pole, index) => (
              <Link 
                key={index}
                to={pole.link}
                className="layout1-pole-card"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="layout1-pole-glow"></div>
                <div className="layout1-pole-icon">{pole.icon}</div>
                <h3>{pole.title}</h3>
                <div className="layout1-pole-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section About - Split with 3D Effect */}
      <section className="layout1-about">
        <div className="layout1-about-content">
          <div className="layout1-about-text">
            <div className="layout1-about-badge">À Propos</div>
            <h2>Qui sommes-nous ?</h2>
            <p>
              Basé au Gabon, CIPS développe des solutions technologiques pour répondre aux défis 
              énergétiques, numériques, environnementaux et sanitaires de l'Afrique.
            </p>
            <Link to="/apropos" className="layout1-link-arrow">
              En savoir plus
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="layout1-about-visual">
            <div className="layout1-visual-3d">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="layout1-visual-item" style={{ '--i': i } as React.CSSProperties}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Immersive */}
      <section className="layout1-cta">
        <div className="layout1-cta-background"></div>
        <div className="container">
          <h2>Prêt à démarrer votre projet ?</h2>
          <p>Rejoignez-nous dans la transformation technologique de l'Afrique</p>
          <div className="layout1-cta-buttons">
            <Link to="/devis" className="layout1-btn-magnetic">Demander un devis</Link>
            <Link to="/contact" className="layout1-btn-outline-white">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccueilLayout1;
