import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EnergieTestLayout2.css';
import { energieImages } from '../../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../../utils/cloudinary';
import TestimonialsCarousel from '../../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../../config/testimonialsData';

// Layout 2 : Scrollytelling avec révélations progressives et micro-interactions
const EnergieTestLayout2 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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
    <div className="energie-test-layout2">
      <section className="scroll-hero">
        <div className="scroll-hero-bg" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="scroll-hero-content">
          <h1 className="scroll-title">
            <span className="scroll-title-word">PÔLE</span>
            <span className="scroll-title-word scroll-accent">ÉNERGIE</span>
          </h1>
          <p className="scroll-subtitle">Solutions énergétiques intelligentes, fiables et adaptées</p>
          <Link to="/simulateur" className="scroll-btn">Découvrir nos solutions</Link>
        </div>
      </section>

      <section className="scroll-solutions">
        <div className="container">
          <h2 className="scroll-reveal" id="solutions-title">Nos solutions énergétiques</h2>
          <div className="scroll-solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className={`scroll-solution-card scroll-reveal ${visibleSections.has(`solution-${index}`) ? 'visible' : ''}`}
                id={`solution-${index}`}
              >
                <div className="scroll-solution-icon">{solution.icon}</div>
                <div className="scroll-solution-stat">
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

      <section className="scroll-simulateur scroll-reveal" id="simulateur">
        <div className="container">
          <div className="scroll-simulateur-content">
            <div className="scroll-simulateur-header">
              <div className="scroll-simulateur-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Découvrez votre solution idéale</h2>
              <p>Calculez en quelques minutes le kit solaire adapté à vos besoins et économisez jusqu'à 60% sur vos factures énergétiques</p>
            </div>
            
            <div className="scroll-simulateur-features">
              <div className="scroll-feature-item">
                <div className="scroll-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Estimation gratuite et rapide</span>
              </div>
              <div className="scroll-feature-item">
                <div className="scroll-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Recommandation personnalisée</span>
              </div>
              <div className="scroll-feature-item">
                <div className="scroll-feature-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Calcul automatique des économies</span>
              </div>
            </div>

            <div className="scroll-simulateur-cta-wrapper">
              <Link to="/simulateur" className="scroll-btn scroll-btn-large">Lancer la simulation</Link>
              <div className="scroll-simulateur-badge">
                <span className="scroll-badge-icon">💡</span>
                <span>Gratuit • Sans engagement • 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-advantages">
        <div className="container">
          <h2 className="scroll-reveal" id="advantages-title">Pourquoi choisir CIPS Énergie ?</h2>
          <div className="scroll-advantages-list">
            {advantages.map((advantage, index) => (
              <div 
                key={index} 
                className={`scroll-advantage-item scroll-reveal ${visibleSections.has(`advantage-${index}`) ? 'visible' : ''}`}
                id={`advantage-${index}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="scroll-check">✓</span>
                <span>{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-gallery">
        <div className="container">
          <h2 className="scroll-reveal" id="gallery-title">Galerie de nos réalisations</h2>
          <div className="scroll-gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className={`scroll-gallery-item scroll-reveal ${visibleSections.has(`gallery-${index}`) ? 'visible' : ''}`}
                id={`gallery-${index}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={getGalleryThumbnailUrl(image.path, 600, 450)} alt={image.title} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-testimonials">
        <div className="container">
          <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
        </div>
      </section>

      <section className="scroll-cta">
        <div className="container">
          <h2>Prêt à passer à l'énergie durable ?</h2>
          <Link to="/devis" className="scroll-btn">Demander un devis</Link>
        </div>
      </section>

      {selectedImage !== null && (
        <div className="scroll-modal" onClick={() => setSelectedImage(null)}>
          <div className="scroll-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="scroll-modal-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={getGalleryFullscreenUrl(galleryImages[selectedImage].path)} alt={galleryImages[selectedImage].title} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergieTestLayout2;

