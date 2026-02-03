import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EnergieTestLayout3.css';
import { energieImages } from '../../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../../utils/cloudinary';
import TestimonialsCarousel from '../../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../../config/testimonialsData';

// Layout 3 : Morphing Shapes + Effets de Lumière Dynamiques - Inspiré Apple/Modern Energy
const EnergieTestLayout3 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    <div className="energie-test-layout3">
      <div className="morph-bg-shapes">
        <div className="morph-shape morph-shape-1" style={{ '--progress': scrollProgress } as React.CSSProperties}></div>
        <div className="morph-shape morph-shape-2" style={{ '--progress': scrollProgress } as React.CSSProperties}></div>
        <div className="morph-shape morph-shape-3" style={{ '--progress': scrollProgress } as React.CSSProperties}></div>
      </div>

      <section className="morph-hero">
        <div className="morph-hero-bg"></div>
        <div className="morph-hero-lights">
          <div className="morph-light morph-light-1"></div>
          <div className="morph-light morph-light-2"></div>
          <div className="morph-light morph-light-3"></div>
        </div>
        <div className="morph-hero-content">
          <div className="morph-badge">
            <span className="morph-badge-dot"></span>
            Innovation Énergétique
          </div>
          <h1 className="morph-title">
            <span className="morph-title-word">PÔLE</span>
            <span className="morph-title-word morph-accent">ÉNERGIE</span>
          </h1>
          <p className="morph-subtitle">
            Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines
          </p>
          <div className="morph-stats">
            <div className="morph-stat">
              <div className="morph-stat-value">500+</div>
              <div className="morph-stat-label">Projets</div>
            </div>
            <div className="morph-stat">
              <div className="morph-stat-value">60%</div>
              <div className="morph-stat-label">Économies</div>
            </div>
            <div className="morph-stat">
              <div className="morph-stat-value">24/7</div>
              <div className="morph-stat-label">Support</div>
            </div>
          </div>
          <div className="morph-cta">
            <Link to="/simulateur" className="morph-btn morph-btn-primary">
              Découvrir nos solutions
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="morph-btn morph-btn-secondary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      <section className="morph-solutions">
        <div className="container">
          <h2 className="morph-section-title">Nos solutions énergétiques</h2>
          <div className="morph-solutions-grid">
            {solutions.map((solution, index) => (
              <div key={index} className="morph-solution-card">
                <div className="morph-card-morph"></div>
                <div className="morph-card-light"></div>
                <div className="morph-solution-icon">{solution.icon}</div>
                <div className="morph-solution-stat">
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

      <section className="morph-simulateur">
        <div className="morph-simulateur-bg"></div>
        <div className="container">
          <div className="morph-simulateur-content">
            <div className="morph-simulateur-header">
              <div className="morph-simulateur-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Découvrez votre solution idéale</h2>
              <p>Calculez en quelques minutes le kit solaire adapté à vos besoins et économisez jusqu'à 60% sur vos factures énergétiques</p>
            </div>
            
            <div className="morph-simulateur-features">
              <div className="morph-feature-item">
                <div className="morph-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Estimation gratuite et rapide</span>
              </div>
              <div className="morph-feature-item">
                <div className="morph-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Recommandation personnalisée</span>
              </div>
              <div className="morph-feature-item">
                <div className="morph-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Calcul automatique des économies</span>
              </div>
            </div>

            <div className="morph-simulateur-cta-wrapper">
              <Link to="/simulateur" className="morph-btn morph-btn-primary morph-btn-large">
                Lancer la simulation
              </Link>
              <div className="morph-simulateur-badge">
                <span className="morph-badge-icon">💡</span>
                <span>Gratuit • Sans engagement • 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="morph-advantages">
        <div className="container">
          <h2 className="morph-section-title">Pourquoi choisir CIPS Énergie ?</h2>
          <div className="morph-advantages-list">
            {advantages.map((advantage, index) => (
              <div key={index} className="morph-advantage-item">
                <div className="morph-advantage-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="morph-gallery">
        <div className="container">
          <h2 className="morph-section-title">Galerie de nos réalisations</h2>
          <div className="morph-gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={image.id} className="morph-gallery-item" onClick={() => setSelectedImage(index)}>
                <img src={getGalleryThumbnailUrl(image.path, 600, 450)} alt={image.title} loading="lazy" />
                <div className="morph-gallery-overlay">
                  <span>{image.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="morph-testimonials">
        <div className="container">
          <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
        </div>
      </section>

      <section className="morph-cta-final">
        <div className="container">
          <h2>Prêt à passer à l'énergie durable ?</h2>
          <Link to="/devis" className="morph-btn morph-btn-primary">Demander un devis</Link>
        </div>
      </section>

      {selectedImage !== null && (
        <div className="morph-modal" onClick={() => setSelectedImage(null)}>
          <div className="morph-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="morph-modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={getGalleryFullscreenUrl(galleryImages[selectedImage].path)} alt={galleryImages[selectedImage].title} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergieTestLayout3;
