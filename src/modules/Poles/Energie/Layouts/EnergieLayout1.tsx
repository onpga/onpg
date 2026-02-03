import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EnergieLayout1.css';
import { energieImages } from '../../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../../utils/cloudinary';
import TestimonialsCarousel from '../../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../../config/testimonialsData';

// Layout 1 : Style Apple - Minimaliste, scroll reveal, animations fluides, vidéo/particules
const EnergieLayout1 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = [
    {
      icon: '☀️',
      title: 'Kits solaires photovoltaïques autonomes',
      description: 'Pour particuliers, entreprises et collectivités',
      color: '#FFD700'
    },
    {
      icon: '⚡',
      title: 'Groupes électrogènes & onduleurs',
      description: 'Des solutions de secours pour assurer une continuité énergétique',
      color: '#FF8C42'
    },
    {
      icon: '🔌',
      title: 'Bornes de recharge pour véhicules électriques',
      description: 'Déploiement d\'infrastructures modernes pour accompagner la mobilité durable',
      color: '#002F6C'
    },
    {
      icon: '🔋',
      title: 'Transformateurs & solutions hybrides',
      description: 'Assurer la fiabilité et la stabilité du réseau',
      color: '#4CAF50'
    }
  ];

  const advantages = [
    'Expertise locale et internationale',
    'Équipements certifiés et durables',
    'Solutions adaptées aux réalités africaines',
    'Installation et maintenance par nos équipes spécialisées',
    'Réduction de l\'empreinte carbone'
  ];

  return (
    <div className="energie-layout1">
      {/* Hero Section - Fullscreen avec parallax */}
      <section className="apple-hero" ref={heroRef}>
        <div className="apple-hero-bg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}></div>
        <div className="apple-hero-particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
        <div className="apple-hero-content">
          <h1 className="apple-hero-title">
            <span className="reveal-text">PÔLE</span>
            <span className="reveal-text" style={{ animationDelay: '0.2s' }}>ÉNERGIE</span>
          </h1>
          <p className="apple-hero-subtitle reveal-text" style={{ animationDelay: '0.4s' }}>
            Solutions énergétiques intelligentes, fiables et adaptées
          </p>
          <p className="apple-hero-description reveal-text" style={{ animationDelay: '0.6s' }}>
            Le Pôle Énergie du Groupe CIPS conçoit, installe et maintient des solutions 
            énergétiques performantes, fiables et durables.
          </p>
          <div className="apple-hero-cta reveal-text" style={{ animationDelay: '0.8s' }}>
            <Link to="/simulateur" className="apple-btn-primary">
              Découvrir nos solutions
            </Link>
            <Link to="/contact" className="apple-btn-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
        <div className="apple-scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Solutions Section - Cards avec hover 3D */}
      <section className="apple-solutions">
        <div className="container">
          <h2 className="section-title reveal-text">Nos solutions énergétiques</h2>
          <div className="apple-solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className="apple-solution-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="apple-card-icon" style={{ '--icon-color': solution.color } as React.CSSProperties}>
                  <span>{solution.icon}</span>
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <div className="apple-card-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulateur CTA - Style Apple */}
      <section className="apple-simulateur">
        <div className="container">
          <div className="apple-simulateur-content">
            <div className="apple-simulateur-icon">
              <svg viewBox="0 0 100 100" fill="none">
                <path d="M50 20 L40 50 L50 50 L35 80 L65 50 L50 50 L60 20 Z" 
                      fill="currentColor" 
                      className="lightning-animated"/>
              </svg>
            </div>
            <h2>Découvrez votre solution idéale</h2>
            <p>
              Calculez en quelques minutes le kit solaire adapté à vos besoins et 
              économisez jusqu'à 60% sur vos factures énergétiques
            </p>
            <div className="apple-simulateur-features">
              {['Estimation gratuite', 'Recommandation personnalisée', 'Calcul automatique'].map((feature, i) => (
                <div key={i} className="apple-feature-item">
                  <span className="apple-check">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link to="/simulateur" className="apple-btn-large">
              Lancer la simulation
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose - Timeline style */}
      <section className="apple-why-choose">
        <div className="container">
          <h2 className="section-title reveal-text">Pourquoi choisir CIPS Énergie ?</h2>
          <div className="apple-advantages-timeline">
            {advantages.map((advantage, index) => (
              <div key={index} className="apple-timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <span className="timeline-check">✓</span>
                  <span>{advantage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery - Masonry style */}
      <section className="apple-gallery">
        <div className="container">
          <h2 className="section-title reveal-text">Galerie de nos réalisations</h2>
          <div className="apple-gallery-grid">
            {energieImages.slice(0, 9).map((image, index) => (
              <div 
                key={image.id} 
                className="apple-gallery-item"
                onClick={() => setSelectedImage(index)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img 
                  src={getGalleryThumbnailUrl(image.path, 800, 600)} 
                  alt={image.title}
                  loading="lazy"
                />
                <div className="apple-gallery-overlay">
                  <span className="gallery-icon">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="apple-testimonials">
        <div className="container">
          <h2 className="section-title reveal-text">Témoignages clients</h2>
          <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="apple-cta">
        <div className="container">
          <div className="apple-cta-content">
            <h2>Prêt à passer à l'énergie durable ?</h2>
            <p>Contactez nos experts pour une étude personnalisée</p>
            <div className="apple-cta-buttons">
              <Link to="/devis" className="apple-btn-primary">Demander un devis</Link>
              <Link to="/contact" className="apple-btn-secondary">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="apple-modal" onClick={() => setSelectedImage(null)}>
          <div className="apple-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="apple-modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img 
              src={getGalleryFullscreenUrl(energieImages[selectedImage].path)} 
              alt={energieImages[selectedImage].title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergieLayout1;

