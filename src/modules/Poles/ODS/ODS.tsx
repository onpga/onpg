import { useState, useEffect, useRef } from 'react';
import './ODS.css';
import './ODSHeroOptions.css'; // Options de design Hero
import { droneImages } from '../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../utils/cloudinary';
import { useSwipe } from '../../../hooks/useSwipe';
import TestimonialsCarousel from '../../../components/TestimonialsCarousel';
import { odsTestimonials } from '../../../config/testimonialsData';
import './ODSTestimonials.css';

// Composants d'icônes SVG
const EventCaptureIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Caméra vidéo professionnelle */}
    <rect x="14" y="24" width="28" height="18" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    <circle cx="28" cy="33" r="6" fill="none" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="28" cy="33" r="3" fill="#FFD700"/>
    
    {/* Objectif */}
    <rect x="42" y="28" width="10" height="10" rx="1" fill="#2C5AA0"/>
    <line x1="52" y1="33" x2="56" y2="33" stroke="#2C5AA0" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Microphone */}
    <rect x="18" y="18" width="4" height="6" rx="2" fill="#FF6B6B"/>
    <line x1="20" y1="24" x2="20" y2="26" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Voyant enregistrement */}
    <circle cx="38" cy="28" r="2" fill="#FF6B6B"/>
  </svg>
);

const InspectionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Infrastructure (tour/bâtiment) */}
    <rect x="12" y="20" width="12" height="32" rx="1" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="14" y1="26" x2="22" y2="26" stroke="#2C5AA0" strokeWidth="1"/>
    <line x1="14" y1="32" x2="22" y2="32" stroke="#2C5AA0" strokeWidth="1"/>
    <line x1="14" y1="38" x2="22" y2="38" stroke="#2C5AA0" strokeWidth="1"/>
    <line x1="14" y1="44" x2="22" y2="44" stroke="#2C5AA0" strokeWidth="1"/>
    
    {/* Drone d'inspection */}
    <circle cx="38" cy="28" r="4" fill="#2C5AA0"/>
    <line x1="38" y1="28" x2="32" y2="22" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="38" y1="28" x2="44" y2="22" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="32" cy="22" r="3" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
    <circle cx="44" cy="22" r="3" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
    
    {/* Ligne de visée/scan */}
    <path d="M 38 28 L 18 40" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="2 2"/>
    <circle cx="18" cy="40" r="2" fill="#FF6B6B"/>
  </svg>
);

const SurveillanceIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Terrain surveillé */}
    <rect x="10" y="32" width="44" height="20" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2"/>
    
    {/* Parcelles */}
    <line x1="26" y1="32" x2="26" y2="52" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="38" y1="32" x2="38" y2="52" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="10" y1="42" x2="54" y2="42" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Drone de surveillance */}
    <ellipse cx="32" cy="18" rx="6" ry="4" fill="#2C5AA0"/>
    <line x1="32" y1="18" x2="24" y2="12" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="32" y1="18" x2="40" y2="12" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="24" cy="12" r="3" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
    <circle cx="40" cy="12" r="3" fill="none" stroke="#FFD700" strokeWidth="1.5"/>
    
    {/* Champ de vision */}
    <path d="M 28 22 L 20 32 L 44 32 L 36 22" stroke="#FF6B6B" strokeWidth="1.5" fill="none" opacity="0.5"/>
  </svg>
);

const TrainingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Chapeau de graduation */}
    <path d="M 32 18 L 12 26 L 32 34 L 52 26 Z" fill="#2C5AA0" stroke="#2C5AA0" strokeWidth="2"/>
    <path d="M 32 34 L 32 44" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="32" cy="44" r="2" fill="#2C5AA0"/>
    
    {/* Diplôme/Certificat */}
    <rect x="18" y="38" width="16" height="12" rx="1" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="20" y1="42" x2="32" y2="42" stroke="#2C5AA0" strokeWidth="1"/>
    <line x1="20" y1="46" x2="32" y2="46" stroke="#2C5AA0" strokeWidth="1"/>
    
    {/* Sceau/Tampon */}
    <circle cx="30" cy="48" r="2" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    
    {/* Télécommande drone */}
    <rect x="42" y="40" width="10" height="8" rx="1" fill="#2C5AA0"/>
    <circle cx="45" cy="44" r="1" fill="#FFD700"/>
    <circle cx="49" cy="44" r="1" fill="#FFD700"/>
  </svg>
);

const ODS = () => {
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
  
  // Liste des images du pôle drone depuis Cloudinary
  const galleryImages = droneImages;
  
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
      icon: <EventCaptureIcon />,
      title: 'Captation Événementielle & Médiatique',
      description: 'Couverture aérienne d\'événements, reportages et productions audiovisuelles de qualité professionnelle'
    },
    {
      icon: <InspectionIcon />,
      title: 'Inspection d\'Infrastructures',
      description: 'Inspection visuelle détaillée de bâtiments, ponts, tours, lignes électriques et installations industrielles'
    },
    {
      icon: <SurveillanceIcon />,
      title: 'Surveillance & Monitoring',
      description: 'Surveillance de sites, agriculture de précision, gestion forestière et suivi environnemental'
    },
    {
      icon: <TrainingIcon />,
      title: 'Formations Diplômantes & Conseil',
      description: 'Formations certifiantes pour télépilotes, conseil technique et assistance opérationnelle'
    }
  ];

  const advantages = [
    'Drones professionnels dernière génération',
    'Pilotes certifiés et expérimentés',
    'Respect strict des réglementations aériennes',
    'Solutions sur mesure adaptées à vos besoins',
    'Couverture rapide et économique',
    'Livrables haute résolution (photo/vidéo 4K)'
  ];

  // Intersection Observer pour animer les avantages un par un avec effet typewriter
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
      }, 3000); // Change d'image toutes les 3 secondes
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

  // Logs de débogage pour les images
  useEffect(() => {
    const debugGallery = () => {
      console.log('=== DEBUG GALLERY ===');
      const galleryItems = document.querySelectorAll('.gallery-item');
      const galleryImageElements = document.querySelectorAll('.gallery-image');
      
      console.log(`Nombre d'items de galerie: ${galleryItems.length}`);
      console.log(`Nombre d'images: ${galleryImageElements.length}`);
      
      galleryItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(item);
        console.log(`\n--- Item ${index + 1} ---`);
        console.log(`Dimensions conteneur: ${rect.width}x${rect.height}`);
        console.log(`Padding: ${computedStyle.padding}`);
        console.log(`Margin: ${computedStyle.margin}`);
        console.log(`Aspect-ratio: ${computedStyle.aspectRatio}`);
        console.log(`Background: ${computedStyle.backgroundColor}`);
        console.log(`Overflow: ${computedStyle.overflow}`);
        console.log(`Display: ${computedStyle.display}`);
      });
      
      galleryImageElements.forEach((img, index) => {
        const imgElement = img as HTMLImageElement;
        const rect = imgElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(imgElement);
        console.log(`\n--- Image ${index + 1} ---`);
        console.log(`Dimensions image: ${rect.width}x${rect.height}`);
        console.log(`Dimensions naturelles: ${imgElement.naturalWidth}x${imgElement.naturalHeight}`);
        console.log(`Object-fit: ${computedStyle.objectFit}`);
        console.log(`Object-position: ${computedStyle.objectPosition}`);
        console.log(`Padding: ${computedStyle.padding}`);
        console.log(`Margin: ${computedStyle.margin}`);
        console.log(`Display: ${computedStyle.display}`);
        console.log(`Width: ${computedStyle.width}`);
        console.log(`Height: ${computedStyle.height}`);
        console.log(`Position: ${computedStyle.position}`);
        console.log(`Top: ${computedStyle.top}, Left: ${computedStyle.left}`);
      });
      
      const galleryGrid = document.querySelector('.gallery-grid');
      if (galleryGrid) {
        const gridStyle = window.getComputedStyle(galleryGrid);
        const gridRect = galleryGrid.getBoundingClientRect();
        console.log(`\n--- Gallery Grid ---`);
        console.log(`Dimensions: ${gridRect.width}x${gridRect.height}`);
        console.log(`Padding: ${gridStyle.padding}`);
        console.log(`Gap: ${gridStyle.gap}`);
        console.log(`Grid-template-columns: ${gridStyle.gridTemplateColumns}`);
      }
      
      console.log('=== FIN DEBUG ===\n');
    };

    // Déclencher le debug après un court délai pour laisser le temps au rendu
    const timeoutId = setTimeout(debugGallery, 500);
    
    // Également déclencher après le chargement de toutes les images
    const images = document.querySelectorAll('.gallery-image');
    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setTimeout(debugGallery, 100);
      }
    };
    
    images.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      images.forEach((img) => {
        img.removeEventListener('load', checkAllLoaded);
      });
    };
  }, [galleryImages.length]);

  // Handler pour loguer les dimensions des images au chargement
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    const img = e.currentTarget;
    const container = img.closest('.gallery-item');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const scaleRatio = Math.max(
        containerRect.width / img.naturalWidth,
        containerRect.height / img.naturalHeight
      );
      const qualityNote = scaleRatio > 1 
        ? '⚠️ Image agrandie (perte de qualité possible)' 
        : scaleRatio < 0.5 
        ? '⚠️ Image fortement réduite (qualité optimale)' 
        : '✅ Taille appropriée';
      
      console.log(`[Image ${index + 1}] Chargée:`, {
        imagePath: galleryImages[index].path,
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displayedSize: `${imgRect.width}x${imgRect.height}`,
        containerSize: `${containerRect.width}x${containerRect.height}`,
        scaleRatio: scaleRatio.toFixed(2),
        qualityNote: qualityNote,
        ratio: `${(imgRect.width / containerRect.width * 100).toFixed(1)}% x ${(imgRect.height / containerRect.height * 100).toFixed(1)}%`
      });
    }
  };

  return (
    <div className="ods-page">
      {/* Hero Section - OPTIONS DE DESIGN */}
      {/* Pour changer d'option, modifier la classe : option-1, option-2, ou option-3 */}
      <section className="ods-hero option-1">
        {/* Overlay gradient léger pour améliorer la lisibilité */}
        <div className="hero-overlay"></div>
        {/* Images configurées dans heroImagesConfig.ts : positions 3, 8, 9, 12, 13 */}
        <div className="hero-image-layer-3"></div>
        <div className="hero-image-layer-4"></div>
        <div className="hero-image-layer-5"></div>
        {/* Option 2 : Grille de 3 images (décommenter pour activer) */}
        {/* <div className="hero-images-grid">
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(droneImages[0]?.path || '', 800, 600)} alt={droneImages[0]?.title} />
          </div>
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(droneImages[2]?.path || '', 800, 600)} alt={droneImages[2]?.title} />
          </div>
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(droneImages[4]?.path || '', 800, 600)} alt={droneImages[4]?.title} />
          </div>
        </div> */}
        
        {/* Option 3 : Vignettes (décommenter pour activer) */}
        {/* <div className="hero-vignettes">
          <div className="hero-vignette">
            <img src={getGalleryThumbnailUrl(droneImages[1]?.path || '', 400, 300)} alt={droneImages[1]?.title} />
          </div>
          <div className="hero-vignette">
            <img src={getGalleryThumbnailUrl(droneImages[3]?.path || '', 400, 300)} alt={droneImages[3]?.title} />
          </div>
        </div> */}
        
        <div className="ods-hero-content">
          <h1>ODS - OPTIMUM DRONE SERVICES</h1>
          <p className="ods-hero-subtitle">
            ODS (Optimum Drone Services) est le pôle spécialisé du Groupe CIPS dédié aux services 
            professionnels par drone : captation, inspection, surveillance et formation.
          </p>
          <p className="ods-hero-description">
            Nous mettons à votre disposition une flotte de drones professionnels et une équipe de 
            pilotes certifiés pour répondre à tous vos besoins en prises de vues aériennes, 
            inspection d'infrastructures, surveillance de sites et formation professionnelle.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="ods-services section">
        <div className="container">
          <h2>Nos services drones professionnels</h2>
          <div className="ods-services-grid">
            {services.map((service, index) => (
              <div key={index} className="ods-service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="ods-advantages" ref={advantagesSectionRef}>
        <div className="container">
          <h2>Pourquoi choisir ODS ?</h2>
          <ul className="ods-advantages-list">
            {advantages.map((advantage, index) => {
              const displayedText = typedTexts[index] || '';
              const isTyping = advantagesVisible && displayedText.length < advantage.length;
              
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

      {/* Certifications Section */}
      <section className="ods-certifications section">
        <div className="container">
          <h2>Formations & Certifications</h2>
          <div className="ods-certifications-content">
            <div className="certifications-image">
              <div className="placeholder-image">
                <span>🎓</span>
              </div>
            </div>
            <div className="certifications-text">
              <h3>Devenez télépilote de drone certifié</h3>
              <p>
                ODS propose des formations complètes pour devenir télépilote de drone professionnel. 
                Nos programmes incluent la théorie, la pratique et la préparation aux examens officiels 
                de certification.
              </p>
              <ul>
                <li>Formation théorique et pratique</li>
                <li>Préparation aux examens de certification</li>
                <li>Accompagnement personnalisé</li>
                <li>Diplômes reconnus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="ods-testimonials section">
        <div className="container">
          <h2>Témoignages clients</h2>
          <div className="ods-testimonials-content">
            <TestimonialsCarousel testimonials={odsTestimonials} poleName="ods" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="ods-gallery section">
        <div className="container">
          <h2>Galerie de nos réalisations</h2>
          <p className="gallery-subtitle">
            Découvrez quelques-unes de nos missions de captation, inspection et surveillance par drone
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
                  onLoad={(e) => handleImageLoad(e, index)}
                  onError={() => {
                    console.error(`[Image ${index + 1}] Erreur de chargement:`, image.path);
                  }}
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
      <section className="ods-cta section">
        <div className="container">
          <div className="ods-cta-content">
            <h2>Un projet de prise de vue ou d'inspection ?</h2>
            <p>Contactez nos experts pour discuter de vos besoins en services drones</p>
            <div className="ods-cta-buttons">
              <a href="/devis" className="btn btn-primary">Demander un devis</a>
              <a href="/contact" className="btn btn-secondary">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ODS;

