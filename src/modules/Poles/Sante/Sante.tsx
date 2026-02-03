import { useState, useEffect, useRef } from 'react';
import './Sante.css';
import './SanteHeroOptions.css'; // Options de design Hero
import { santeImages } from '../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../utils/cloudinary';
import { useSwipe } from '../../../hooks/useSwipe';
import TestimonialsCarousel from '../../../components/TestimonialsCarousel';
import { santeTestimonials } from '../../../config/testimonialsData';
import './SanteTestimonials.css';

// Composants d'icônes SVG
const MedicalCabinIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cabine médicale */}
    <rect x="16" y="12" width="32" height="40" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Écran/Interface */}
    <rect x="20" y="16" width="24" height="16" rx="1" fill="#2C5AA0"/>
    <rect x="22" y="18" width="20" height="12" rx="0.5" fill="#4CAF50"/>
    
    {/* Croix médicale */}
    <rect x="30" y="22" width="4" height="8" fill="white"/>
    <rect x="28" y="24" width="8" height="4" fill="white"/>
    
    {/* Capteurs/Équipements */}
    <circle cx="24" cy="40" r="3" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    <circle cx="32" cy="40" r="3" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    <circle cx="40" cy="40" r="3" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    
    {/* Câbles */}
    <line x1="24" y1="43" x2="24" y2="46" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="32" y1="43" x2="32" y2="46" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="40" y1="43" x2="40" y2="46" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Porte */}
    <rect x="26" y="46" width="12" height="6" rx="1" fill="#2C5AA0"/>
  </svg>
);

const TelemedicineIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Écran ordinateur */}
    <rect x="14" y="16" width="36" height="24" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Visage du médecin (simplifié) */}
    <circle cx="32" cy="26" r="5" fill="#FFD700"/>
    <rect x="24" y="30" width="16" height="8" rx="1" fill="#2C5AA0"/>
    
    {/* Stéthoscope */}
    <circle cx="40" cy="34" r="2" fill="#FF6B6B"/>
    <path d="M 40 36 Q 38 38, 36 38" stroke="#FF6B6B" strokeWidth="1.5" fill="none"/>
    
    {/* Pied de l'écran */}
    <rect x="28" y="40" width="8" height="3" fill="#2C5AA0"/>
    <rect x="24" y="43" width="16" height="2" fill="#2C5AA0"/>
    
    {/* Signal de connexion */}
    <path d="M 48 18 Q 52 22, 48 26" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 52 16 Q 58 22, 52 28" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

const DiagnosticIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tableau de diagnostic */}
    <rect x="12" y="14" width="40" height="36" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Graphique cardiaque (ECG) */}
    <path d="M 16 28 L 22 28 L 24 20 L 28 36 L 32 28 L 48 28" stroke="#FF6B6B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    
    {/* Indicateurs vitaux */}
    <circle cx="20" cy="40" r="2" fill="#4CAF50"/>
    <text x="24" y="42" fontSize="4" fill="white">HR</text>
    
    <circle cx="36" cy="40" r="2" fill="#FFD700"/>
    <text x="40" y="42" fontSize="4" fill="white">BP</text>
    
    {/* Coche de validation */}
    <path d="M 42 20 L 45 23 L 50 18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

const ConnectedHealthIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Smartphone/Tablette */}
    <rect x="22" y="12" width="20" height="32" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Écran */}
    <rect x="24" y="16" width="16" height="22" rx="1" fill="#2C5AA0"/>
    
    {/* Icône santé (coeur + pulse) */}
    <path d="M 32 24 L 34 22 Q 36 20, 37 22 Q 38 24, 32 28 Q 26 24, 27 22 Q 28 20, 30 22 Z" fill="#FF6B6B"/>
    <path d="M 26 30 L 28 32 L 30 30 L 32 34 L 34 30 L 36 32 L 38 30" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
    
    {/* Bouton home */}
    <circle cx="32" cy="40" r="1.5" fill="#2C5AA0"/>
    
    {/* Connexions cloud */}
    <ellipse cx="48" cy="20" rx="4" ry="3" fill="#FFD700"/>
    <ellipse cx="46" cy="22" rx="3" ry="2" fill="#FFD700"/>
    <ellipse cx="50" cy="22" rx="3" ry="2" fill="#FFD700"/>
    
    {/* Ligne de connexion */}
    <line x1="42" y1="24" x2="46" y2="22" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="2 1"/>
  </svg>
);

const Sante = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [isSlideshow, setIsSlideshow] = useState<boolean>(false);
  const [advantagesVisible, setAdvantagesVisible] = useState<boolean>(false);
  const [typedTexts, setTypedTexts] = useState<string[]>([]);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const advantagesSectionRef = useRef<HTMLElement | null>(null);
  const typingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Liste des images du pôle santé
  const galleryImages = santeImages;
  
  // Hook pour le swipe sur mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    () => {
      // Swipe gauche = image suivante
      if (selectedImage !== null && selectedImage < galleryImages.length - 1) {
        handleImageChange(selectedImage + 1);
      } else if (selectedImage !== null) {
        handleImageChange(0);
      }
    },
    () => {
      // Swipe droite = image précédente
      if (selectedImage !== null && selectedImage > 0) {
        handleImageChange(selectedImage - 1);
      } else if (selectedImage !== null) {
        handleImageChange(galleryImages.length - 1);
      }
    },
    50 // Distance minimale de swipe en pixels
  );
  
  // Précharger les images adjacentes
  const preloadAdjacentImages = (currentIndex: number) => {
    const imagesToPreload: number[] = [];
    
    // Image précédente
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    imagesToPreload.push(prevIndex);
    
    // Image suivante
    const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    imagesToPreload.push(nextIndex);
    
    // Précharger en arrière-plan
    imagesToPreload.forEach(index => {
      if (!preloadedImages.has(index)) {
        const img = new Image();
        img.src = getGalleryFullscreenUrl(galleryImages[index].path);
        setPreloadedImages(prev => new Set([...prev, index]));
      }
    });
  };
  
  // Gérer le changement d'image avec préchargement
  const handleImageChange = (newIndex: number) => {
    setLoadingImage(true);
    setSelectedImage(newIndex);
    preloadAdjacentImages(newIndex);
    
    // Vérifier si l'image est déjà chargée
    const img = new Image();
    img.onload = () => setLoadingImage(false);
    img.onerror = () => setLoadingImage(false);
    img.src = getGalleryFullscreenUrl(galleryImages[newIndex].path);
    
    // Timeout de sécurité
    setTimeout(() => setLoadingImage(false), 500);
  };
  
  // Précharger les images adjacentes quand le modal s'ouvre
  useEffect(() => {
    if (selectedImage !== null) {
      preloadAdjacentImages(selectedImage);
    }
  }, [selectedImage]);
  
  // Gérer le slideshow automatique
  useEffect(() => {
    if (isSlideshow && selectedImage !== null) {
      slideshowIntervalRef.current = setInterval(() => {
        const nextIndex = selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0;
        handleImageChange(nextIndex);
      }, 3000); // Changer d'image toutes les 3 secondes
    } else if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }
    
    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isSlideshow, selectedImage]);
  
  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === 'ArrowLeft') {
        const newIndex = selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1;
        handleImageChange(newIndex);
      } else if (e.key === 'ArrowRight') {
        const newIndex = selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0;
        handleImageChange(newIndex);
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
        setLoadingImage(false);
        setIsSlideshow(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  const services = [
    {
      icon: <MedicalCabinIcon />,
      title: 'Cabines Médicales Connectées',
      description: 'Cabines autonomes équipées de capteurs de dernière génération pour des diagnostics complets et précis'
    },
    {
      icon: <TelemedicineIcon />,
      title: 'Télémédecine & Consultation à Distance',
      description: 'Consultations médicales à distance via webcam avec des professionnels de santé qualifiés'
    },
    {
      icon: <DiagnosticIcon />,
      title: 'Diagnostics Automatisés',
      description: 'Mesure automatique de la tension, température, rythme cardiaque, saturation en oxygène et autres paramètres vitaux'
    },
    {
      icon: <ConnectedHealthIcon />,
      title: 'Plateforme de Santé Intégrée',
      description: 'Système complet de gestion des données médicales et de suivi des patients'
    }
  ];

  const advantages = [
    'Accès aux soins facilité dans les zones reculées',
    'Diagnostic rapide et fiable',
    'Équipements médicaux de pointe',
    'Confidentialité des données garantie',
    'Personnel médical qualifié',
    'Disponibilité 24/7'
  ];

  // Intersection Observer pour animer les avantages un par un avec effet typewriter
  useEffect(() => {
    if (!advantagesSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setAdvantagesVisible(true);
              startTypewriterEffect();
            }, 600);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    observer.observe(advantagesSectionRef.current);

    return () => {
      if (advantagesSectionRef.current) {
        observer.unobserve(advantagesSectionRef.current);
      }
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutsRef.current = [];
    };
  }, []);

  // Effet typewriter professionnel
  const startTypewriterEffect = () => {
    const typingSpeed = 50;
    const delayBetweenItems = 800;
    
    advantages.forEach((advantage, index) => {
      const timeout = setTimeout(() => {
        let currentText = '';
        const chars = advantage.split('');
        
        chars.forEach((char, charIndex) => {
          setTimeout(() => {
            currentText += char;
            setTypedTexts(prev => {
              const newTexts = [...prev];
              newTexts[index] = currentText;
              return newTexts;
            });
          }, charIndex * typingSpeed);
        });
      }, index * delayBetweenItems);
      
      typingTimeoutsRef.current.push(timeout);
    });
  };



  return (
    <div className="sante-page">
      {/* Hero Section */}
      <section className="sante-hero option-1">
        <div className="sante-hero-content">
          <h1>SANTÉ CONNECTÉE</h1>
          <p className="sante-hero-subtitle">
            Le Pôle Santé du Groupe CIPS démocratise l'accès aux soins de qualité 
            grâce à des solutions de santé connectée innovantes et accessibles.
          </p>
          <p className="sante-hero-description">
            Nos cabines médicales connectées et notre plateforme de télémédecine permettent à 
            tous d'accéder à des consultations et des diagnostics de qualité, quel que soit 
            l'endroit. Nous rendons la santé accessible, moderne et efficace pour tous les Africains.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="sante-services section">
        <div className="container">
          <h2>Nos solutions de santé connectée</h2>
          <div className="sante-services-grid">
            {services.map((service, index) => (
              <div key={index} className="sante-service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="sante-gallery section">
        <div className="container">
          <h2 className="sante-gallery-title">Galerie de nos solutions</h2>
          <div className="sante-gallery-grid">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="sante-gallery-item"
                onClick={() => handleImageChange(index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={getGalleryThumbnailUrl(image.path, 600, 450)}
                  alt={image.title}
                  loading="lazy"
                />
                <div className="sante-gallery-overlay">
                  <span>{image.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="sante-why-choose" ref={advantagesSectionRef}>
        <div className="container">
          <h2>Les avantages de nos solutions</h2>
          <ul className="sante-advantages-list">
            {advantages.map((advantage, index) => {
              const displayedText = typedTexts[index] || '';
              const isTyping = advantagesVisible && displayedText.length < advantage.length;
              
              return (
                <li 
                  key={index}
                  className={advantagesVisible ? 'advantage-item-visible' : 'advantage-item-hidden'}
                  style={{ '--delay': `${index * 0.2}s` } as React.CSSProperties}
                >
                  <span className="check-icon">✓</span>
                  <span className="advantage-text">
                    {displayedText}
                    {isTyping && <span className="typewriter-cursor">|</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Technology Section */}
      <section className="sante-technology section">
        <div className="container">
          <h2>Innovation au service de la santé</h2>
          <div className="sante-technology-content">
            <div className="technology-image">
              <div className="placeholder-image">
                <span>⚕️</span>
              </div>
            </div>
            <div className="technology-text">
              <TestimonialsCarousel testimonials={santeTestimonials} poleName="sante" />
            </div>
          </div>
        </div>
      </section>

      {/* Présence Section */}
      <section className="sante-presence section">
        <div className="container">
          <h2>Notre présence</h2>
          <div className="sante-presence-content">
            <div className="presence-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200"
                alt="Carte d'Afrique centrale"
                className="presence-map-image"
                loading="lazy"
              />
            </div>
            <div className="presence-text">
              <h3>Réseau de services</h3>
              <p>
                Nos solutions de santé connectée sont déployées dans plusieurs villes d'Afrique centrale. 
                Nous continuons d'étendre notre réseau pour rendre nos services accessibles au plus grand nombre, 
                en nous concentrant sur les zones où nos solutions peuvent apporter le plus de valeur.
              </p>
              <ul className="presence-features">
                <li>
                  <span className="feature-bullet"></span>
                  <span>Zones urbaines et périurbaines</span>
                </li>
                <li>
                  <span className="feature-bullet"></span>
                  <span>Villages et zones reculées</span>
                </li>
                <li>
                  <span className="feature-bullet"></span>
                  <span>Entreprises et sites industriels</span>
                </li>
                <li>
                  <span className="feature-bullet"></span>
                  <span>Écoles et universités</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div className="image-modal" onClick={() => { 
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          setSelectedImage(null); 
          setLoadingImage(false); 
          setIsSlideshow(false); 
        }}>
          <div 
            className="image-modal-content" 
            ref={modalContentRef} 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button className="modal-close" onClick={() => { 
              if (document.fullscreenElement) {
                document.exitFullscreen();
              }
              setSelectedImage(null); 
              setLoadingImage(false); 
              setIsSlideshow(false); 
            }}>×</button>
            {loadingImage && (
              <div className="modal-loading">
                <div className="modal-spinner"></div>
              </div>
            )}
            <img 
              src={getGalleryFullscreenUrl(galleryImages[selectedImage].path)} 
              alt={galleryImages[selectedImage].title}
              className={`modal-image ${loadingImage ? 'loading' : ''}`}
              onLoad={() => setLoadingImage(false)}
              onError={() => setLoadingImage(false)}
              onClick={(e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
                setSelectedImage(null);
                setLoadingImage(false);
                setIsSlideshow(false);
              }}
            />
            <div className="modal-nav">
              <button 
                className="modal-nav-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1;
                  handleImageChange(newIndex);
                }}
                aria-label="Image précédente"
              >
                ‹
              </button>
              <button 
                className={`modal-nav-btn slideshow ${isSlideshow ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSlideshow(!isSlideshow);
                }}
                aria-label={isSlideshow ? "Arrêter le diaporama" : "Démarrer le diaporama"}
                title={isSlideshow ? "Arrêter le diaporama" : "Démarrer le diaporama"}
              >
                {isSlideshow ? '⏸' : '▶'}
              </button>
              <span className="modal-counter">
                {selectedImage + 1} / {galleryImages.length}
              </span>
              <button 
                className="modal-nav-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex = selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0;
                  handleImageChange(newIndex);
                }}
                aria-label="Image suivante"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="sante-cta section">
        <div className="container">
          <div className="sante-cta-content">
            <h2>Intéressé par nos solutions de santé connectée ?</h2>
            <p>Contactez-nous pour en savoir plus sur nos services et leur déploiement</p>
            <div className="sante-cta-buttons">
              <a href="/devis" className="btn btn-primary">Demander un devis</a>
              <a href="/contact" className="btn btn-secondary">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sante;

