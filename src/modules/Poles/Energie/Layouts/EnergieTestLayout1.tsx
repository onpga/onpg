import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EnergieTestLayout1.css';
import { energieImages } from '../../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../../utils/cloudinary';
import TestimonialsCarousel from '../../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../../config/testimonialsData';

// Layout 1 : Hero 3D Immersif avec Particules Énergétiques - Inspiré Tesla/SolarCity
const EnergieTestLayout1 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation canvas pour particules énergétiques
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.5 ? '#FF8C42' : '#002F6C'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Lignes entre particules proches
        particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (150 - distance) / 150 * 0.2;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const solutions = [
    { icon: '☀️', title: 'Kits solaires photovoltaïques autonomes', description: 'Pour particuliers, entreprises et collectivités', stat: '60%', statLabel: 'd\'économies', gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8C42 100%)' },
    { icon: '⚡', title: 'Groupes électrogènes & onduleurs', description: 'Des solutions de secours pour assurer une continuité énergétique', stat: '24/7', statLabel: 'disponibilité', gradient: 'linear-gradient(135deg, #002F6C 0%, #001a3d 100%)' },
    { icon: '🔌', title: 'Bornes de recharge pour véhicules électriques', description: 'Déploiement d\'infrastructures modernes pour accompagner la mobilité durable', stat: '100%', statLabel: 'renouvelable', gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' },
    { icon: '🔋', title: 'Transformateurs & solutions hybrides', description: 'Assurer la fiabilité et la stabilité du réseau', stat: '99%', statLabel: 'fiabilité', gradient: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)' }
  ];

  const advantages = [
    'Expertise locale et internationale',
    'Équipements certifiés et durables',
    'Solutions adaptées aux réalités africaines',
    'Installation et maintenance par nos équipes spécialisées',
    'Réduction de l\'empreinte carbone'
  ];

  const galleryImages = energieImages.slice(0, 9);

  return (
    <div className="energie-test-layout1">
      {/* Hero 3D Immersif avec Particules */}
      <section className="energy-hero" ref={heroRef}>
        <canvas ref={canvasRef} className="energy-particles-canvas"></canvas>
        <div 
          className="energy-hero-bg"
          style={{
            transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px) scale(1.15)`,
            filter: `brightness(${0.4 + mousePosition.y * 0.0001})`
          }}
        ></div>
        <div className="energy-hero-overlay"></div>
        <div className="energy-hero-glow" style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}></div>
        
        <div className="energy-hero-content">
          <div className="energy-badge">
            <span className="energy-badge-pulse"></span>
            Innovation Énergétique
          </div>
          <h1 className="energy-title">
            <span className="energy-title-line" data-text="PÔLE">PÔLE</span>
            <span className="energy-title-line energy-accent" data-text="ÉNERGIE">ÉNERGIE</span>
          </h1>
          <p className="energy-subtitle">
            Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines
          </p>
          <div className="energy-stats">
            <div className="energy-stat">
              <div className="energy-stat-value" data-value="500">0</div>
              <div className="energy-stat-label">Projets réalisés</div>
            </div>
            <div className="energy-stat">
              <div className="energy-stat-value" data-value="60">0</div>
              <div className="energy-stat-label">% Économies moyennes</div>
            </div>
            <div className="energy-stat">
              <div className="energy-stat-value">24/7</div>
              <div className="energy-stat-label">Support technique</div>
            </div>
          </div>
          <div className="energy-cta">
            <Link to="/simulateur" className="energy-btn energy-btn-primary">
              <span>Découvrir nos solutions</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="energy-btn energy-btn-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
        <div className="energy-scroll-indicator">
          <div className="energy-scroll-line"></div>
        </div>
      </section>

      {/* Solutions avec effets de lumière */}
      <section className="energy-solutions">
        <div className="container">
          <div className="energy-section-header">
            <h2 className="energy-section-title">Nos solutions énergétiques</h2>
            <p className="energy-section-subtitle">Des technologies de pointe pour un avenir durable</p>
          </div>
          <div className="energy-solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className="energy-solution-card"
                style={{ '--gradient': solution.gradient } as React.CSSProperties}
              >
                <div className="energy-card-glow"></div>
                <div className="energy-card-shine"></div>
                <div className="energy-solution-icon">{solution.icon}</div>
                <div className="energy-solution-stat">
                  <span className="energy-stat-number">{solution.stat}</span>
                  <span className="energy-stat-text">{solution.statLabel}</span>
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <div className="energy-card-border-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulateur CTA - Design professionnel et innovant */}
      <section className="energy-simulateur">
        <div className="energy-simulateur-bg"></div>
        <div className="container">
          <div className="energy-simulateur-content">
            <div className="energy-simulateur-header">
              <div className="energy-simulateur-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="energy-simulateur-title">Découvrez votre solution idéale</h2>
              <p className="energy-simulateur-description">
                Calculez en quelques minutes le kit solaire adapté à vos besoins et économisez jusqu'à 60% sur vos factures énergétiques
              </p>
            </div>
            
            <div className="energy-simulateur-features">
              <div className="energy-feature-item">
                <div className="energy-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Estimation gratuite et rapide</span>
              </div>
              <div className="energy-feature-item">
                <div className="energy-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Recommandation personnalisée</span>
              </div>
              <div className="energy-feature-item">
                <div className="energy-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Calcul automatique des économies</span>
              </div>
            </div>

            <div className="energy-simulateur-cta-wrapper">
              <Link to="/simulateur" className="energy-btn energy-btn-primary energy-btn-large">
                <span>Lancer la simulation</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
              <div className="energy-simulateur-badge">
                <span className="energy-badge-icon">💡</span>
                <span>Gratuit • Sans engagement • 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages avec timeline animée */}
      <section className="energy-advantages">
        <div className="container">
          <h2 className="energy-section-title">Pourquoi choisir CIPS Énergie ?</h2>
          <div className="energy-advantages-grid">
            {advantages.map((advantage, index) => (
              <div key={index} className="energy-advantage-item">
                <div className="energy-advantage-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="energy-advantage-content">
                  <div className="energy-advantage-check">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p>{advantage}</p>
                </div>
                <div className="energy-advantage-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie avec effet masonry et hover 3D */}
      <section className="energy-gallery">
        <div className="container">
          <h2 className="energy-section-title">Galerie de nos réalisations</h2>
          <div className="energy-gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className="energy-gallery-item"
                onClick={() => setSelectedImage(index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={getGalleryThumbnailUrl(image.path, 600, 450)} 
                  alt={image.title}
                  loading="lazy"
                />
                <div className="energy-gallery-overlay">
                  <div className="energy-gallery-content">
                    <span className="energy-gallery-title">{image.title}</span>
                    <div className="energy-gallery-icon">+</div>
                  </div>
                </div>
                <div className="energy-gallery-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="energy-testimonials">
        <div className="container">
          <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
        </div>
      </section>

      {/* CTA Final avec effet de particules */}
      <section className="energy-cta-final">
        <div className="energy-cta-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="energy-cta-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
        <div className="container">
          <h2>Prêt à passer à l'énergie durable ?</h2>
          <p>Contactez nos experts pour une étude personnalisée</p>
          <div className="energy-cta-buttons">
            <Link to="/devis" className="energy-btn energy-btn-primary">Demander un devis</Link>
            <Link to="/contact" className="energy-btn energy-btn-secondary">Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* Modal Image */}
      {selectedImage !== null && (
        <div className="energy-modal" onClick={() => setSelectedImage(null)}>
          <div className="energy-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="energy-modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img 
              src={getGalleryFullscreenUrl(galleryImages[selectedImage].path)} 
              alt={galleryImages[selectedImage].title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergieTestLayout1;
