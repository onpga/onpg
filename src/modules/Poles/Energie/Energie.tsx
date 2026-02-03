import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Energie.css';
import './EnergieHeroOptions.css'; // Options de design Hero
import { energieImages } from '../../../config/polesImages';
import { getGalleryThumbnailUrl, getGalleryFullscreenUrl } from '../../../utils/cloudinary';
import { useSwipe } from '../../../hooks/useSwipe';
import TestimonialsCarousel from '../../../components/TestimonialsCarousel';
import { energieTestimonials } from '../../../config/testimonialsData';
import './EnergieTestimonials.css';

// Composants d'icônes SVG (style professionnel inspiré de Heroicons)
const SolarPanelIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Panneau solaire principal */}
    <rect x="8" y="18" width="48" height="28" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Grille de cellules photovoltaïques (3x4) */}
    <line x1="24" y1="18" x2="24" y2="46" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="40" y1="18" x2="40" y2="46" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="8" y1="27" x2="56" y2="27" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="8" y1="37" x2="56" y2="37" stroke="#2C5AA0" strokeWidth="2"/>
    
    {/* Support incliné */}
    <path d="M12 46 L8 52 M32 46 L32 52 M52 46 L56 52" stroke="#2C5AA0" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="8" y1="52" x2="56" y2="52" stroke="#2C5AA0" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Soleil stylisé */}
    <circle cx="52" cy="8" r="5" fill="#FFD700" stroke="#FFA500" strokeWidth="1.5"/>
    <line x1="52" y1="2" x2="52" y2="0" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <line x1="58" y1="8" x2="60" y2="8" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <line x1="56" y1="4" x2="57.5" y2="2.5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const GeneratorIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Châssis/Base avec roues */}
    <rect x="10" y="42" width="40" height="4" rx="1" fill="#2C5AA0"/>
    <circle cx="16" cy="48" r="3" fill="#1a3a6e" stroke="#2C5AA0" strokeWidth="1.5"/>
    <circle cx="44" cy="48" r="3" fill="#1a3a6e" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Corps principal du générateur (caisse métallique) */}
    <rect x="10" y="22" width="38" height="20" rx="1" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Échappement/Silencieux vertical (élément clé!) */}
    <rect x="48" y="12" width="6" height="30" rx="1" fill="#2C5AA0" stroke="#1a3a6e" strokeWidth="2"/>
    <rect x="47" y="10" width="8" height="3" rx="1" fill="#1a3a6e"/>
    {/* Fumée/vapeur */}
    <circle cx="51" cy="7" r="2" fill="#E0E0E0" opacity="0.6"/>
    <circle cx="49" cy="4" r="1.5" fill="#E0E0E0" opacity="0.4"/>
    <circle cx="53" cy="5" r="1.5" fill="#E0E0E0" opacity="0.4"/>
    
    {/* Grilles de ventilation (lignes) */}
    <line x1="14" y1="26" x2="24" y2="26" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="14" y1="29" x2="24" y2="29" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="14" y1="32" x2="24" y2="32" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="14" y1="35" x2="24" y2="35" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="14" y1="38" x2="24" y2="38" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Panneau de contrôle */}
    <rect x="28" y="26" width="16" height="14" rx="1" fill="#2C5AA0" stroke="#1a3a6e" strokeWidth="1"/>
    
    {/* Voyants */}
    <circle cx="32" cy="30" r="1.5" fill="#FF6B6B"/>
    <circle cx="40" cy="30" r="1.5" fill="#4CAF50"/>
    
    {/* Jauge/Compteur */}
    <rect x="30" y="34" width="12" height="4" rx="0.5" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5"/>
    
    {/* Réservoir de carburant (capuchon) */}
    <circle cx="18" cy="20" r="2.5" fill="#2C5AA0" stroke="#1a3a6e" strokeWidth="1"/>
    <circle cx="18" cy="20" r="1.2" fill="#FFD700"/>
  </svg>
);

const ChargingStationIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Corps de la borne */}
    <rect x="20" y="12" width="16" height="32" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Écran/Display */}
    <rect x="23" y="16" width="10" height="8" rx="1" fill="#2C5AA0"/>
    <rect x="24" y="17" width="8" height="6" rx="0.5" fill="#4CAF50"/>
    
    {/* Symbole éclair (charge électrique) */}
    <path d="M30 29 L27 35 L30 35 L28 40 L33 34 L30 34 L32 29 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    
    {/* Câble de charge */}
    <path d="M36 26 Q 42 26, 44 30 L44 40" stroke="#2C5AA0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="44" cy="42" r="3.5" fill="#2C5AA0" stroke="#1a3a6e" strokeWidth="1.5"/>
    <circle cx="44" cy="42" r="1.5" fill="#FFD700"/>
    
    {/* Base/Socle */}
    <rect x="16" y="44" width="24" height="4" rx="1" fill="#2C5AA0"/>
    <rect x="18" y="48" width="20" height="2" fill="#1a3a6e"/>
  </svg>
);

const TransformerIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Structure principale du transformateur */}
    <rect x="16" y="18" width="32" height="30" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Bobines/Enroulements (3 colonnes) */}
    <circle cx="24" cy="30" r="4" fill="none" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="24" cy="30" r="2" fill="none" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    <circle cx="32" cy="30" r="4" fill="none" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="32" cy="30" r="2" fill="none" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    <circle cx="40" cy="30" r="4" fill="none" stroke="#2C5AA0" strokeWidth="2"/>
    <circle cx="40" cy="30" r="2" fill="none" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Barres de connexion haute tension */}
    <line x1="24" y1="23" x2="24" y2="18" stroke="#2C5AA0" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="23" x2="32" y2="18" stroke="#2C5AA0" strokeWidth="2" strokeLinecap="round"/>
    <line x1="40" y1="23" x2="40" y2="18" stroke="#2C5AA0" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Connexions de sortie */}
    <rect x="20" y="40" width="24" height="6" rx="1" fill="#2C5AA0"/>
    <line x1="26" y1="43" x2="26" y2="46" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="43" x2="32" y2="46" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <line x1="38" y1="43" x2="38" y2="46" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Isolateurs en haut */}
    <circle cx="24" cy="14" r="2.5" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    <circle cx="32" cy="14" r="2.5" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    <circle cx="40" cy="14" r="2.5" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    
    {/* Indicateur haute tension */}
    <path d="M20 24 L18 28 L20 28 L18 32" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="0.5"/>
  </svg>
);

const Energie = () => {
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
  
  // Liste des images du pôle énergie (groupes électrogènes d'abord, puis panneaux solaires)
  // energieImages est déjà combiné dans polesImages.ts avec les groupes électrogènes en premier
  const galleryImages = energieImages;
  
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

  const solutions = [
    {
      icon: <SolarPanelIcon />,
      title: 'Kits solaires photovoltaïques autonomes',
      description: 'Pour particuliers, entreprises et collectivités',
      stat: '60%',
      statLabel: 'd\'économies',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FF8C42 100%)'
    },
    {
      icon: <GeneratorIcon />,
      title: 'Groupes électrogènes & onduleurs',
      description: 'Des solutions de secours pour assurer une continuité énergétique',
      stat: '24/7',
      statLabel: 'disponibilité',
      gradient: 'linear-gradient(135deg, #002F6C 0%, #001a3d 100%)'
    },
    {
      icon: <ChargingStationIcon />,
      title: 'Bornes de recharge pour véhicules électriques',
      description: 'Déploiement d\'infrastructures modernes pour accompagner la mobilité durable en Afrique',
      stat: '100%',
      statLabel: 'renouvelable',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
    },
    {
      icon: <TransformerIcon />,
      title: 'Transformateurs & solutions hybrides',
      description: 'Assurer la fiabilité et la stabilité du réseau',
      stat: '99%',
      statLabel: 'fiabilité',
      gradient: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)'
    }
  ];

  const advantages = [
    'Expertise locale et internationale',
    'Équipements certifiés et durables',
    'Solutions adaptées aux réalités africaines',
    'Installation et maintenance par nos équipes spécialisées',
    'Réduction de l\'empreinte carbone'
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

  // Logs pour debug background image
  useEffect(() => {
    const heroSection = document.querySelector('.energie-hero');
    if (heroSection) {
      const styles = window.getComputedStyle(heroSection);
      const bgImage = styles.backgroundImage;
      const bgSize = styles.backgroundSize;
      const bgPosition = styles.backgroundPosition;
      
      console.log('🔍 DEBUG HERO BACKGROUND:');
      console.log('Background Image:', bgImage);
      console.log('Background Size:', bgSize);
      console.log('Background Position:', bgPosition);
      console.log('Hero element:', heroSection);
      console.log('Hero height:', heroSection.getBoundingClientRect().height);
      
      // Vérifier si l'image est chargée
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image de background chargée avec succès');
        console.log('Image dimensions:', img.width, 'x', img.height);
      };
      img.onerror = () => {
        console.error('❌ Erreur de chargement de l\'image de background');
      };
      img.src = 'https://res.cloudinary.com/drbaadexk/image/upload/v1763559407/cips/poles/energie/energie-gabonese-technician-adjusting-a-solar-panel-confident-smile-natural-light-professional-documentary-rendering-jpg.jpg';
    }
  }, []);

  return (
    <div className="energie-page">
      {/* Hero Section - OPTIONS DE DESIGN */}
      {/* Pour changer d'option, modifier la classe : option-1, option-2, ou option-3 */}
      <section className="energie-hero option-1">
        {/* Overlay gradient léger pour améliorer la lisibilité */}
        <div className="hero-overlay"></div>
        {/* Images configurées dans heroImagesConfig.ts : positions 4, 5, 9, 10, 11 */}
        <div className="hero-image-layer-3"></div>
        <div className="hero-image-layer-4"></div>
        <div className="hero-image-layer-5"></div>
        
        {/* Option 2 : Grille de 3 images (décommenter pour activer) */}
        {/* <div className="hero-images-grid">
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(energieImages[3]?.path || '', 800, 600)} alt={energieImages[3]?.title} />
          </div>
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(energieImages[2]?.path || '', 800, 600)} alt={energieImages[2]?.title} />
          </div>
          <div className="hero-image-item">
            <img src={getGalleryThumbnailUrl(energieImages[5]?.path || '', 800, 600)} alt={energieImages[5]?.title} />
          </div>
        </div> */}
        
        {/* Option 3 : Vignettes (décommenter pour activer) */}
        {/* <div className="hero-vignettes">
          <div className="hero-vignette">
            <img src={getGalleryThumbnailUrl(energieImages[8]?.path || '', 400, 300)} alt={energieImages[8]?.title} />
          </div>
          <div className="hero-vignette">
            <img src={getGalleryThumbnailUrl(energieImages[9]?.path || '', 400, 300)} alt={energieImages[9]?.title} />
          </div>
        </div> */}
        
        <div className="energie-hero-content">
          <h1>PÔLE ÉNERGIE</h1>
          <p className="energie-hero-subtitle">
            Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines
          </p>
          <p className="energie-hero-description">
            Le Pôle Énergie du Groupe CIPS conçoit, installe et maintient des solutions 
            énergétiques performantes, fiables et durables. Notre objectif : garantir 
            l'autonomie énergétique des particuliers, entreprises et collectivités, tout en 
            réduisant la dépendance aux énergies fossiles.
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="energie-solutions section">
        <div className="container">
          <div className="energy-section-header">
            <h2 className="energy-section-title">Nos solutions énergétiques</h2>
            <p className="energy-section-subtitle">Des technologies de pointe pour un avenir durable</p>
          </div>
          <div className="energie-solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className="energie-solution-card"
                style={{ '--gradient': solution.gradient } as React.CSSProperties}
              >
                <div className="energy-card-glow"></div>
                <div className="energy-card-shine"></div>
                <div className="solution-icon">{solution.icon}</div>
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

      {/* Simulateur CTA Section */}
      <section className="energie-simulateur-cta section">
        <div className="container">
          <div className="simulateur-cta-content">
            <div className="simulateur-cta-header">
              <div className="simulateur-cta-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="simulateur-cta-title">Découvrez votre solution idéale</h2>
              <p className="simulateur-cta-description">
                Calculez en quelques minutes le kit solaire adapté à vos besoins et économisez jusqu'à 60% sur vos factures énergétiques
              </p>
            </div>
            
            <div className="simulateur-advantages">
              <div className="simulateur-advantage-item">
                <div className="simulateur-advantage-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Estimation gratuite et rapide</span>
              </div>
              <div className="simulateur-advantage-item">
                <div className="simulateur-advantage-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Recommandation personnalisée</span>
              </div>
              <div className="simulateur-advantage-item">
                <div className="simulateur-advantage-check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Calcul automatique des économies</span>
              </div>
            </div>

            <div className="simulateur-cta-wrapper">
              <Link to="/simulateur" className="simulateur-cta-btn">
                <span>Lancer la simulation</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="simulateur-cta-badge">
                <span className="simulateur-badge-icon">💡</span>
                <span>Gratuit • Sans engagement • 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="energie-why-choose" ref={advantagesSectionRef}>
        <div className="container">
          <h2>Pourquoi choisir CIPS Énergie ?</h2>
          <ul className="energie-advantages-list">
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

      {/* Gallery Section */}
      <section className="energie-gallery section">
        <div className="container">
          <h2 className="energie-gallery-title">Galerie de nos réalisations</h2>
          <div className="energie-gallery-grid">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="energie-gallery-item"
                onClick={() => handleImageChange(index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={getGalleryThumbnailUrl(image.path, 600, 450)}
                  alt={image.title}
                  loading="lazy"
                />
                <div className="energie-gallery-overlay">
                  <span>{image.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="energie-achievements section">
        <div className="container">
          <h2>Témoignages clients</h2>
          <div className="energie-achievements-content">
            <div className="achievements-text">
              <TestimonialsCarousel testimonials={energieTestimonials} poleName="energie" />
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
      <section className="energie-cta section">
        <div className="container">
          <div className="energie-cta-content">
            <div className="energie-cta-header">
              <div className="energie-cta-icon-wrapper">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="var(--cips-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="energie-cta-title">Prêt à passer à l'énergie durable ?</h2>
              <p className="energie-cta-description">Contactez nos experts pour une étude personnalisée de vos besoins</p>
            </div>
            <div className="energie-cta-buttons">
              <a href="/devis" className="energie-cta-btn-primary">
                <span>Demander un devis</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/contact" className="energie-cta-btn-secondary">
                <span>Nous contacter</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Energie;

