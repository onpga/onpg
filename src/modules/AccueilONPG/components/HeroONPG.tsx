import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ONPG_IMAGES } from '../../../utils/cloudinary-onpg';
import './HeroONPG.css';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const HeroONPG = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Construire les slides avec les 5 images par défaut uniquement
  useEffect(() => {
    const defaultSlides: HeroSlide[] = [
      {
        image: ONPG_IMAGES.heroMichal,
        title: 'Ordre National de Pharmacie du Gabon',
        subtitle: 'Excellence, professionnalisme et innovation au service de la santé',
        buttonText: 'Découvrir nos missions',
        buttonLink: '/ordre/missions'
      },
      {
        image: ONPG_IMAGES.hero2,
        title: 'Protection de la Santé Publique',
        subtitle: 'Garantir la qualité et la sécurité des médicaments au Gabon',
        buttonText: 'Nos engagements',
        buttonLink: '/ordre/missions'
      },
      {
        image: ONPG_IMAGES.hero3,
        title: 'Formation et Développement',
        subtitle: 'Accompagner les professionnels de santé dans leur carrière',
        buttonText: 'Formation continue',
        buttonLink: '/membres/formation'
      },
      {
        image: ONPG_IMAGES.heroTheTonik,
        title: 'Innovation Pharmaceutique',
        subtitle: 'Promouvoir les avancées technologiques dans le domaine de la santé',
        buttonText: 'Nos initiatives',
        buttonLink: '/ressources/publications'
      },
      {
        image: ONPG_IMAGES.heroPexelsKarola,
        title: 'Régulation Professionnelle',
        subtitle: 'Définir et faire respecter les normes de la profession pharmaceutique',
        buttonText: 'En savoir plus',
        buttonLink: '/pratique/reglementation'
      }
    ];

    setSlides(defaultSlides);
  }, []);

  // Auto-play du carousel
  useEffect(() => {
    if (isAutoPlaying && slides.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Changement toutes les 5 secondes pour une meilleure expérience
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  // Gestionnaire de slide manuel
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Reset auto-play timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 2000);
    }
  };

  // Navigation automatique uniquement (pas de flèches)

  // Pause auto-play au hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Gestion du scroll pour parallax
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fallback si pas de slides
  if (slides.length === 0) {
    return (
      <section className="hero-onpg loading">
        <div className="hero-onpg-background">
          <div className="hero-onpg-loading">
            <div className="loading-spinner"></div>
            <p>Chargement de l'Ordre National de Pharmacie du Gabon...</p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  if (!currentSlideData) {
    return (
      <section className="hero-onpg loading">
        <div className="hero-onpg-background">
          <div className="hero-onpg-loading">
            <div className="loading-spinner"></div>
            <p>Erreur de chargement du hero...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="hero-onpg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background avec parallax */}
      <div className="hero-onpg-background">
        {/* Précharger toutes les images du carousel avec des img cachées */}
        {slides.map((slide, index) => (
          <img
            key={`preload-${index}`}
            src={slide.image}
            alt=""
            className="hero-onpg-preload"
            aria-hidden="true"
            role="presentation"
            onError={(e) => {
              // Empêcher les multiples tentatives
              const target = e.target as HTMLImageElement;
              if (!target.dataset.errorHandled) {
                target.dataset.errorHandled = 'true';
                setFailedImages(prev => new Set(prev).add(slide.image));
                console.warn('Image hero introuvable:', slide.image);
              }
            }}
          />
        ))}
        {/* Afficher l'image actuelle */}
        {slides.map((slide, index) => {
          const imageFailed = failedImages.has(slide.image);
          return (
            <div
              key={`bg-${index}`}
              className={`hero-onpg-bg-image ${index === currentSlide ? 'active' : 'hidden'}`}
              style={{ 
                backgroundImage: imageFailed ? 'none' : `url(${slide.image})`,
                backgroundColor: imageFailed ? '#27ae60' : 'transparent'
              }}
            />
          );
        })}
        <div className="hero-onpg-overlay" />
        <div className="hero-onpg-bg-pattern" />
      </div>

      {/* Contenu principal */}
      <div className="hero-onpg-content">
        <div className="hero-onpg-container">
          {/* Badge ONPG */}
          <div className="hero-onpg-badge">
            <span className="badge-text">Ordre National de Pharmacie du Gabon</span>
            <div className="badge-accent"></div>
          </div>

          {/* Titre principal */}
          <h1 className="hero-onpg-title">
            {currentSlideData.title}
          </h1>

          {/* Sous-titre */}
          <p className="hero-onpg-subtitle">
            {currentSlideData.subtitle}
          </p>

          {/* Boutons d'action */}
          <div className="hero-onpg-actions">
            <Link
              to={currentSlideData.buttonLink}
              className="btn btn-primary hero-onpg-cta"
            >
              {currentSlideData.buttonText}
            </Link>
            <Link
              to="/apropos"
              className="btn btn-secondary hero-onpg-secondary"
            >
              En savoir plus
            </Link>
          </div>

        </div>
      </div>

      {/* Navigation du carousel - Indicateurs uniquement (pas de flèches) */}
      <div className="hero-onpg-navigation">
        {/* Indicateurs */}
        <div className="hero-onpg-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`hero-onpg-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-onpg-scroll">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span className="scroll-text">Défiler pour découvrir</span>
      </div>
    </section>
  );
};

export default HeroONPG;
