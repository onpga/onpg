import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EnergieTestLayout4.css';
import { energieImages } from '../../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../../utils/cloudinary';
import TestimonialsCarousel from '../../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../../config/testimonialsData';

// Layout 4 : Split-Screen Parallax Avancé + Effets de Profondeur - Inspiré Apple/Tesla
const EnergieTestLayout4 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const solutions = [
    { icon: '☀️', title: 'Kits solaires photovoltaïques autonomes', description: 'Pour particuliers, entreprises et collectivités', stat: '60%', statLabel: 'd\'économies' },
    { icon: '⚡', title: 'Groupes électrogènes & onduleurs', description: 'Des solutions de secours pour assurer une continuité énergétique', stat: '24/7', statLabel: 'disponibilité' },
    { icon: '🔌', title: 'Bornes de recharge pour véhicules électriques', description: 'Déploiement d\'infrastructures modernes pour accompagner la mobilité durable', stat: '100%', statLabel: 'renouvelable' },
    { icon: '🔋', title: 'Transformateurs & solutions hybrides', description: 'Assurer la fiabilité et la stabilité du réseau', stat: '99%', statLabel: 'fiabilité' }
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
    <div className="energie-test-layout4">
      {/* Hero Split-Screen avec Parallax */}
      <section className="split-hero" ref={heroRef}>
        <div className="split-hero-left">
          <div 
            className="split-hero-bg"
            style={{
              transform: `translateY(${scrollY * 0.5}px) scale(1.1)`,
              backgroundPosition: `${50 + mousePosition.x * 0.01}% ${50 + mousePosition.y * 0.01}%`
            }}
          ></div>
          <div className="split-hero-overlay"></div>
        </div>
        <div className="split-hero-right">
          <div className="split-hero-content">
            <div className="split-badge">Innovation Énergétique</div>
            <h1 className="split-title">
              <span className="split-title-main">PÔLE</span>
              <span className="split-title-accent">ÉNERGIE</span>
            </h1>
            <p className="split-subtitle">
              Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines
            </p>
            <div className="split-stats">
              <div className="split-stat">
                <div className="split-stat-value">500+</div>
                <div className="split-stat-label">Projets</div>
              </div>
              <div className="split-stat">
                <div className="split-stat-value">60%</div>
                <div className="split-stat-label">Économies</div>
              </div>
              <div className="split-stat">
                <div className="split-stat-value">24/7</div>
                <div className="split-stat-label">Support</div>
              </div>
            </div>
            <div className="split-cta">
              <Link to="/simulateur" className="split-btn split-btn-primary">
                Découvrir nos solutions
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
              <Link to="/contact" className="split-btn split-btn-secondary">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
        <div className="split-divider"></div>
      </section>

      {/* Solutions avec effet de profondeur */}
      <section className="split-solutions">
        <div className="container">
          <h2 className="split-section-title">Nos solutions énergétiques</h2>
          <div className="split-solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className="split-solution-card"
                style={{
                  transform: `translateZ(${index * 20}px)`,
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <div className="split-card-depth"></div>
                <div className="split-solution-icon">{solution.icon}</div>
                <div className="split-solution-stat">
                  <span>{solution.stat}</span>
                  <span>{solution.statLabel}</span>
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulateur avec effet 3D */}
      <section className="split-simulateur">
        <div className="split-simulateur-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="container">
          <div className="split-simulateur-content">
            <div className="split-simulateur-header">
              <div className="split-simulateur-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Découvrez votre solution idéale</h2>
              <p>Calculez en quelques minutes le kit solaire adapté à vos besoins et économisez jusqu'à 60% sur vos factures énergétiques</p>
            </div>
            
            <div className="split-simulateur-features">
              <div className="split-feature-item">
                <div className="split-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Estimation gratuite et rapide</span>
              </div>
              <div className="split-feature-item">
                <div className="split-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Recommandation personnalisée</span>
              </div>
              <div className="split-feature-item">
                <div className="split-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Calcul automatique des économies</span>
              </div>
            </div>

            <div className="split-simulateur-cta-wrapper">
              <Link to="/simulateur" className="split-btn split-btn-primary split-btn-large">
                Lancer la simulation
              </Link>
              <div className="split-simulateur-badge">
                <span className="split-badge-icon">💡</span>
                <span>Gratuit • Sans engagement • 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages avec effet parallax */}
      <section className="split-advantages">
        <div className="container">
          <h2 className="split-section-title">Pourquoi choisir CIPS Énergie ?</h2>
          <div className="split-advantages-grid">
            {advantages.map((advantage, index) => (
              <div 
                key={index} 
                className="split-advantage-item"
                style={{
                  transform: `translateY(${scrollY * (0.1 + index * 0.02)}px)`,
                  opacity: Math.max(0.3, 1 - scrollY * 0.001)
                }}
              >
                <div className="split-advantage-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="split-advantage-content">
                  <div className="split-advantage-check">✓</div>
                  <span>{advantage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie avec effet masonry 3D */}
      <section className="split-gallery">
        <div className="container">
          <h2 className="split-section-title">Galerie de nos réalisations</h2>
          <div className="split-gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className="split-gallery-item"
                onClick={() => setSelectedImage(index)}
                style={{
                  transform: `translateZ(${index % 3 * 30}px) rotateY(${index % 2 === 0 ? -2 : 2}deg)`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <img src={getGalleryThumbnailUrl(image.path, 600, 450)} alt={image.title} loading="lazy" />
                <div className="split-gallery-overlay">
                  <span>{image.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="split-testimonials">
        <div className="container">
          <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
        </div>
      </section>

      <section className="split-cta-final">
        <div className="container">
          <h2>Prêt à passer à l'énergie durable ?</h2>
          <Link to="/devis" className="split-btn split-btn-primary">Demander un devis</Link>
        </div>
      </section>

      {selectedImage !== null && (
        <div className="split-modal" onClick={() => setSelectedImage(null)}>
          <div className="split-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="split-modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={getGalleryFullscreenUrl(galleryImages[selectedImage].path)} alt={galleryImages[selectedImage].title} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergieTestLayout4;
