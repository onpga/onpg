import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EnergieTestLayout5.css';
import { energieImages } from '../../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../../utils/cloudinary';
import TestimonialsCarousel from '../../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../../config/testimonialsData';

// Layout 5 : Grille Interactive + Animations Fluides Type Apple - Inspiré Apple/Tesla
const EnergieTestLayout5 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = [
    { icon: '☀️', title: 'Kits solaires photovoltaïques autonomes', description: 'Pour particuliers, entreprises et collectivités', stat: '60%', statLabel: 'd\'économies', color: '#FFD700' },
    { icon: '⚡', title: 'Groupes électrogènes & onduleurs', description: 'Des solutions de secours pour assurer une continuité énergétique', stat: '24/7', statLabel: 'disponibilité', color: '#002F6C' },
    { icon: '🔌', title: 'Bornes de recharge pour véhicules électriques', description: 'Déploiement d\'infrastructures modernes pour accompagner la mobilité durable', stat: '100%', statLabel: 'renouvelable', color: '#4CAF50' },
    { icon: '🔋', title: 'Transformateurs & solutions hybrides', description: 'Assurer la fiabilité et la stabilité du réseau', stat: '99%', statLabel: 'fiabilité', color: '#FF8C42' }
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
    <div className="energie-test-layout5">
      {/* Hero avec grille interactive */}
      <section className="grid-hero" ref={heroRef}>
        <div 
          className="grid-hero-bg"
          style={{
            transform: `translateY(${scrollY * 0.4}px) scale(1.15)`,
            filter: `brightness(${0.3 + scrollY * 0.0001})`
          }}
        ></div>
        <div className="grid-hero-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="grid-hero-cell" style={{
              animationDelay: `${i * 0.1}s`
            }}></div>
          ))}
        </div>
        <div className="grid-hero-overlay"></div>
        <div className="grid-hero-content">
          <div className="grid-badge">
            <span className="grid-badge-glow"></span>
            Innovation Énergétique
          </div>
          <h1 className="grid-title">
            <span className="grid-title-word">PÔLE</span>
            <span className="grid-title-word grid-accent">ÉNERGIE</span>
          </h1>
          <p className="grid-subtitle">
            Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines
          </p>
          <div className="grid-stats">
            <div className="grid-stat">
              <div className="grid-stat-value">500+</div>
              <div className="grid-stat-label">Projets</div>
            </div>
            <div className="grid-stat">
              <div className="grid-stat-value">60%</div>
              <div className="grid-stat-label">Économies</div>
            </div>
            <div className="grid-stat">
              <div className="grid-stat-value">24/7</div>
              <div className="grid-stat-label">Support</div>
            </div>
          </div>
          <div className="grid-cta">
            <Link to="/simulateur" className="grid-btn grid-btn-primary">
              Découvrir nos solutions
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="grid-btn grid-btn-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions avec grille interactive */}
      <section className="grid-solutions">
        <div className="container">
          <h2 className="grid-section-title">Nos solutions énergétiques</h2>
          <div className="grid-solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className={`grid-solution-card ${hoveredCard === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  '--card-color': solution.color,
                  animationDelay: `${index * 0.15}s`
                } as React.CSSProperties}
              >
                <div className="grid-card-glow"></div>
                <div className="grid-card-pattern"></div>
                <div className="grid-solution-icon">{solution.icon}</div>
                <div className="grid-solution-stat">
                  <span>{solution.stat}</span>
                  <span>{solution.statLabel}</span>
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
                <div className="grid-card-border"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulateur avec effet de grille animée */}
      <section className="grid-simulateur">
        <div className="grid-simulateur-grid">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="grid-simulateur-cell"></div>
          ))}
        </div>
        <div className="container">
          <div className="grid-simulateur-content">
            <div className="grid-simulateur-header">
              <div className="grid-simulateur-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Découvrez votre solution idéale</h2>
              <p>Calculez en quelques minutes le kit solaire adapté à vos besoins et économisez jusqu'à 60% sur vos factures énergétiques</p>
            </div>
            
            <div className="grid-simulateur-features">
              <div className="grid-feature-item">
                <div className="grid-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Estimation gratuite et rapide</span>
              </div>
              <div className="grid-feature-item">
                <div className="grid-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Recommandation personnalisée</span>
              </div>
              <div className="grid-feature-item">
                <div className="grid-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Calcul automatique des économies</span>
              </div>
            </div>

            <div className="grid-simulateur-cta-wrapper">
              <Link to="/simulateur" className="grid-btn grid-btn-primary grid-btn-large">
                Lancer la simulation
              </Link>
              <div className="grid-simulateur-badge">
                <span className="grid-badge-icon">💡</span>
                <span>Gratuit • Sans engagement • 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages avec timeline animée */}
      <section className="grid-advantages">
        <div className="container">
          <h2 className="grid-section-title">Pourquoi choisir CIPS Énergie ?</h2>
          <div className="grid-advantages-timeline">
            {advantages.map((advantage, index) => (
              <div key={index} className="grid-advantage-item">
                <div className="grid-timeline-dot"></div>
                <div className="grid-timeline-line"></div>
                <div className="grid-advantage-content">
                  <div className="grid-advantage-check">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>{advantage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie avec grille masonry interactive */}
      <section className="grid-gallery">
        <div className="container">
          <h2 className="grid-section-title">Galerie de nos réalisations</h2>
          <div className="grid-gallery-masonry">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className={`grid-gallery-item grid-gallery-item-${index % 3 === 0 ? 'large' : 'normal'}`}
                onClick={() => setSelectedImage(index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img src={getGalleryThumbnailUrl(image.path, 600, 450)} alt={image.title} loading="lazy" />
                <div className="grid-gallery-overlay">
                  <div className="grid-gallery-content">
                    <span>{image.title}</span>
                    <div className="grid-gallery-icon">+</div>
                  </div>
                </div>
                <div className="grid-gallery-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-testimonials">
        <div className="container">
          <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
        </div>
      </section>

      <section className="grid-cta-final">
        <div className="grid-cta-grid">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="grid-cta-cell"></div>
          ))}
        </div>
        <div className="container">
          <h2>Prêt à passer à l'énergie durable ?</h2>
          <Link to="/devis" className="grid-btn grid-btn-primary">Demander un devis</Link>
        </div>
      </section>

      {selectedImage !== null && (
        <div className="grid-modal" onClick={() => setSelectedImage(null)}>
          <div className="grid-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="grid-modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={getGalleryFullscreenUrl(galleryImages[selectedImage].path)} alt={galleryImages[selectedImage].title} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergieTestLayout5;
