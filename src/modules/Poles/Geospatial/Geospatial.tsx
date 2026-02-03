import { useState, useEffect, useRef } from 'react';
import './Geospatial.css';
import './GeospatialHeroOptions.css'; // Options de design Hero
import { geospatialImages } from '../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../utils/cloudinary';
import { useSwipe } from '../../../hooks/useSwipe';
import TestimonialsCarousel from '../../../components/TestimonialsCarousel';
import { geospatialTestimonials } from '../../../config/testimonialsData';
import './GeospatialTestimonials.css';

// Composants d'icônes SVG
const CartographyIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Carte avec points topographiques */}
    <rect x="8" y="12" width="48" height="40" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Lignes topographiques */}
    <path d="M 12 20 Q 20 22, 28 20 T 44 20 T 52 20" stroke="#2C5AA0" strokeWidth="1.5" fill="none"/>
    <path d="M 12 28 Q 20 30, 28 28 T 44 28 T 52 28" stroke="#2C5AA0" strokeWidth="1.5" fill="none"/>
    <path d="M 12 36 Q 20 38, 28 36 T 44 36 T 52 36" stroke="#2C5AA0" strokeWidth="1.5" fill="none"/>
    <path d="M 12 44 Q 20 46, 28 44 T 44 44 T 52 44" stroke="#2C5AA0" strokeWidth="1.5" fill="none"/>
    
    {/* Points de mesure */}
    <circle cx="20" cy="22" r="2" fill="#FF6B6B"/>
    <circle cx="32" cy="30" r="2" fill="#FF6B6B"/>
    <circle cx="44" cy="38" r="2" fill="#FF6B6B"/>
    
    {/* Grille */}
    <line x1="24" y1="12" x2="24" y2="52" stroke="#2C5AA0" strokeWidth="1" opacity="0.3"/>
    <line x1="40" y1="12" x2="40" y2="52" stroke="#2C5AA0" strokeWidth="1" opacity="0.3"/>
  </svg>
);

const DroneIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Corps du drone */}
    <ellipse cx="32" cy="32" rx="8" ry="6" fill="#2C5AA0"/>
    
    {/* Bras du drone */}
    <line x1="32" y1="32" x2="16" y2="18" stroke="#2C5AA0" strokeWidth="2.5"/>
    <line x1="32" y1="32" x2="48" y2="18" stroke="#2C5AA0" strokeWidth="2.5"/>
    <line x1="32" y1="32" x2="16" y2="46" stroke="#2C5AA0" strokeWidth="2.5"/>
    <line x1="32" y1="32" x2="48" y2="46" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Hélices */}
    <circle cx="16" cy="18" r="6" fill="none" stroke="#4A90E2" strokeWidth="2"/>
    <circle cx="48" cy="18" r="6" fill="none" stroke="#4A90E2" strokeWidth="2"/>
    <circle cx="16" cy="46" r="6" fill="none" stroke="#4A90E2" strokeWidth="2"/>
    <circle cx="48" cy="46" r="6" fill="none" stroke="#4A90E2" strokeWidth="2"/>
    
    {/* Caméra */}
    <circle cx="32" cy="36" r="3" fill="#FFD700"/>
  </svg>
);

const Model3DIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cube 3D */}
    <path d="M 32 12 L 50 22 L 50 42 L 32 52 L 14 42 L 14 22 Z" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    <path d="M 32 12 L 32 32" stroke="#2C5AA0" strokeWidth="2"/>
    <path d="M 32 32 L 50 42" stroke="#2C5AA0" strokeWidth="2"/>
    <path d="M 32 32 L 14 42" stroke="#2C5AA0" strokeWidth="2"/>
    <path d="M 32 12 L 50 22 L 32 32 L 14 22 Z" fill="#2C5AA0" opacity="0.3"/>
    
    {/* Points de référence */}
    <circle cx="32" cy="12" r="2" fill="#FFD700"/>
    <circle cx="50" cy="22" r="2" fill="#FFD700"/>
    <circle cx="14" cy="22" r="2" fill="#FFD700"/>
  </svg>
);

const AnalysisIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Écran/Graphique */}
    <rect x="8" y="12" width="48" height="36" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Graphique de données */}
    <path d="M 14 38 L 22 32 L 30 28 L 38 34 L 46 24 L 50 26" stroke="#FFD700" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    
    {/* Grille */}
    <line x1="14" y1="20" x2="50" y2="20" stroke="#2C5AA0" strokeWidth="1" opacity="0.3"/>
    <line x1="14" y1="28" x2="50" y2="28" stroke="#2C5AA0" strokeWidth="1" opacity="0.3"/>
    <line x1="14" y1="36" x2="50" y2="36" stroke="#2C5AA0" strokeWidth="1" opacity="0.3"/>
    
    {/* Points de données */}
    <circle cx="22" cy="32" r="2" fill="#FF6B6B"/>
    <circle cx="30" cy="28" r="2" fill="#FF6B6B"/>
    <circle cx="38" cy="34" r="2" fill="#FF6B6B"/>
    <circle cx="46" cy="24" r="2" fill="#FF6B6B"/>
    
    {/* Pied */}
    <rect x="28" y="48" width="8" height="4" fill="#2C5AA0"/>
  </svg>
);

const Geospatial = () => {
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
  
  // Liste des images du pôle TGS depuis Cloudinary
  const galleryImages = geospatialImages;
  
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

  // Scroll vers le haut et empêcher le scroll du body quand le modal s'ouvre
  useEffect(() => {
    if (selectedImage !== null) {
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
      
      // Scroll le modal-content vers le haut avec un petit délai pour s'assurer que le DOM est prêt
      const scrollToTop = () => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      };
      
      // Scroll immédiatement
      scrollToTop();
      
      // Scroll aussi après un court délai pour s'assurer que l'image est chargée
      setTimeout(scrollToTop, 100);
    } else {
      // Restaurer le scroll du body
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const services = [
    {
      icon: <CartographyIcon />,
      title: 'Cartographie & Relevés Topographiques',
      description: 'Plans de dimensionnement, relevés de terrain et cartes thématiques pour vos projets'
    },
    {
      icon: <DroneIcon />,
      title: 'Prises de Vues Aériennes',
      description: 'Collecte de données par drone pour une vue d\'ensemble précise de vos territoires'
    },
    {
      icon: <Model3DIcon />,
      title: 'Modélisation 3D & Orthophotographie',
      description: 'Modèles numériques de terrain (MNT/MNS) et reconstructions 3D haute définition'
    },
    {
      icon: <AnalysisIcon />,
      title: 'Analyse & Traitement de Données',
      description: 'Analyse côtière, hydrographique et études environnementales approfondies'
    }
  ];

  const applications = [
    'Urbanisme et aménagement du territoire',
    'Agriculture de précision et suivi de végétation',
    'Gestion des ressources naturelles',
    'Détection de zones à risque',
    'Infrastructures et BTP',
    'Études environnementales'
  ];

  // Intersection Observer pour animer les applications un par un avec effet typewriter
  useEffect(() => {
    if (!advantagesSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Délai pour laisser le temps de scroll - tempo professionnel
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
      // Nettoyer les timeouts
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutsRef.current = [];
    };
  }, []);

  // Effet typewriter professionnel
  const startTypewriterEffect = () => {
    const typingSpeed = 50; // ms par caractère - tempo professionnel
    const delayBetweenItems = 800; // ms entre chaque élément
    
    applications.forEach((application, index) => {
      const timeout = setTimeout(() => {
        let currentText = '';
        const chars = application.split('');
        
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

  // Précharger les images adjacentes quand le modal s'ouvre
  useEffect(() => {
    if (selectedImage !== null) {
      preloadAdjacentImages(selectedImage);
    }
  }, [selectedImage]);

  // Gérer le diaporama automatique et le plein écran
  useEffect(() => {
      if (isSlideshow && selectedImage !== null) {
      // Activer le plein écran quand on démarre le slideshow
      if (modalContentRef.current && !document.fullscreenElement) {
        const element = modalContentRef.current as any;
        if (element.requestFullscreen) {
          element.requestFullscreen().catch((err: Error) => {
            console.log('Impossible d\'activer le plein écran:', err);
          });
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      slideshowIntervalRef.current = setInterval(() => {
        setSelectedImage(prev => {
          if (prev === null) return null;
          const nextIndex = prev < galleryImages.length - 1 ? prev + 1 : 0;
          handleImageChange(nextIndex);
          return nextIndex;
        });
      }, 3000);
    } else {
      // Désactiver le plein écran quand on arrête le slideshow
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.log('Impossible de désactiver le plein écran:', err);
        });
      }

      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = null;
      }
    }

    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isSlideshow, selectedImage, galleryImages.length]);

  // Gérer la sortie du plein écran avec Échap
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isSlideshow) {
        // Si on sort du plein écran, arrêter le slideshow
        setIsSlideshow(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isSlideshow]);

  // Navigation au clavier dans le modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1;
        handleImageChange(newIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0;
        handleImageChange(newIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        // Si on est en plein écran, sortir du plein écran d'abord
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsSlideshow(false);
        } else {
          setSelectedImage(null);
          setLoadingImage(false);
          setIsSlideshow(false);
        }
      }
    };

    if (selectedImage !== null) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, galleryImages.length]);

  // Touch Gestures (swipe) pour navigation mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    () => {
      // Swipe gauche = image suivante
      if (selectedImage !== null) {
        const newIndex = selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0;
        handleImageChange(newIndex);
      }
    },
    () => {
      // Swipe droite = image précédente
      if (selectedImage !== null) {
        const newIndex = selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1;
        handleImageChange(newIndex);
      }
    },
    50 // Distance minimale de swipe en pixels
  );

  return (
    <div className="geospatial-page">
      {/* Hero Section - OPTIONS DE DESIGN */}
      {/* Pour changer d'option, modifier la classe : option-1, option-2, ou option-3 */}
      <section className="geospatial-hero option-1">
        {/* Overlay gradient léger pour améliorer la lisibilité */}
        <div className="hero-overlay"></div>
        {/* Images 3, 7, 16 : Couches supplémentaires du carrousel (images 1, 2, 3, 7, 16) */}
        <div className="hero-image-layer-3"></div>
        <div className="hero-image-layer-4"></div>
        <div className="hero-image-layer-5"></div>
        
        {/* Option 2 : Grille de 3 images (décommenter pour activer) */}
        {/* <div className="hero-images-grid">
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(geospatialImages[17]?.path || '', 800, 600)} alt={geospatialImages[17]?.title} />
          </div>
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(geospatialImages[19]?.path || '', 800, 600)} alt={geospatialImages[19]?.title} />
          </div>
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(geospatialImages[20]?.path || '', 800, 600)} alt={geospatialImages[20]?.title} />
          </div>
        </div> */}
        
        {/* Option 3 : Vignettes (décommenter pour activer) */}
        {/* <div className="hero-vignettes">
          <div className="hero-vignette">
            <img src={getGalleryThumbnailUrl(geospatialImages[18]?.path || '', 400, 300)} alt={geospatialImages[18]?.title} />
          </div>
          <div className="hero-vignette">
            <img src={getGalleryThumbnailUrl(geospatialImages[21]?.path || '', 400, 300)} alt={geospatialImages[21]?.title} />
          </div>
        </div> */}
        
        <div className="geospatial-hero-content">
          <h1>TRAITEMENT DE DONNÉES GÉOSPATIALES</h1>
          <p className="geospatial-hero-subtitle">
            Le Pôle Traitement de Données Géospatiales du Groupe CIPS collecte, analyse et modélise 
            les données spatiales pour une meilleure compréhension et gestion des territoires.
          </p>
          <p className="geospatial-hero-description">
            Grâce à des technologies de pointe en cartographie, relevés topographiques et traitement d'images aériennes, 
            nous fournissons des données géospatiales précises et exploitables pour vos projets d'aménagement, 
            d'urbanisme, d'agriculture et de gestion environnementale.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="geospatial-services section">
        <div className="container">
          <h2>Nos services géospatiales</h2>
          <div className="geospatial-services-grid">
            {services.map((service, index) => (
              <div key={index} className="geospatial-service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="geospatial-applications" ref={advantagesSectionRef}>
        <div className="container">
          <h2>Domaines d'application</h2>
          <ul className="geospatial-applications-list">
            {applications.map((application, index) => {
              const displayedText = typedTexts[index] || '';
              const isTyping = advantagesVisible && displayedText.length < application.length;
              
              return (
                <li 
                  key={index}
                  className={advantagesVisible ? 'advantage-item-visible' : 'advantage-item-hidden'}
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
      <section className="geospatial-technology section">
        <div className="container">
          <h2>Notre approche</h2>
          <div className="geospatial-technology-content">
            <div className="technology-image">
              <div className="placeholder-image">
                <span style={{fontSize: '60px', fontWeight: '700', color: 'white'}}>TGS</span>
              </div>
            </div>
            <div className="technology-text">
              <TestimonialsCarousel testimonials={geospatialTestimonials} poleName="geospatial" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="geospatial-gallery section">
        <div className="container">
          <h2>Galerie de nos réalisations</h2>
          <p className="gallery-subtitle">
            Découvrez quelques-unes de nos productions cartographiques et orthophotographies
          </p>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id} 
                className="gallery-item"
                onClick={() => handleImageChange(index)}
              >
                <img 
                  src={getGalleryThumbnailUrl(image.path, 600, 450)} 
                  alt={image.title}
                  loading="lazy"
                  className="gallery-image"
                  decoding="async"
                  fetchPriority={index < 4 ? "high" : "low"}
                />
                <div className="gallery-overlay">
                  <span className="gallery-icon">🔍</span>
                </div>
              </div>
            ))}
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
      <section className="geospatial-cta section">
        <div className="container">
          <div className="geospatial-cta-content">
            <h2>Un projet de cartographie ou d'analyse spatiale ?</h2>
            <p>Contactez nos experts pour discuter de vos besoins en données géospatiales</p>
            <div className="geospatial-cta-buttons">
              <a href="/devis" className="btn btn-primary">Demander un devis</a>
              <a href="/contact" className="btn btn-secondary">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Geospatial;

