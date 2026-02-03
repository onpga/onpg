import { useState, useEffect } from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import './TestimonialsCarousel.css';

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  company: string;
  photo: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  poleName?: string; // Nom du pôle pour appliquer des styles spécifiques
}

const TestimonialsCarousel = ({ testimonials, poleName }: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Logs détaillés pour déboguer les distances et l'espace blanc
  useEffect(() => {
    const carousel = document.querySelector('.testimonials-carousel');
    const content = document.querySelector('.testimonials-carousel-content');
    const textContainer = document.querySelector('.testimonial-text-container');
    const quote = document.querySelector('.testimonial-quote');
    const authorInfo = document.querySelector('.author-info');
    const navigation = document.querySelector('.testimonials-navigation');

    if (carousel && content && textContainer && quote && authorInfo && navigation) {
      const carouselRect = carousel.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const textContainerRect = textContainer.getBoundingClientRect();
      const quoteRect = quote.getBoundingClientRect();
      const authorInfoRect = authorInfo.getBoundingClientRect();
      const navigationRect = navigation.getBoundingClientRect();

      const contentStyles = window.getComputedStyle(content as Element);
      const textContainerStyles = window.getComputedStyle(textContainer as Element);
      const quoteStyles = window.getComputedStyle(quote as Element);
      const authorInfoStyles = window.getComputedStyle(authorInfo as Element);
      const navigationStyles = window.getComputedStyle(navigation as Element);

      const distanceQuoteToAuthor = authorInfoRect.top - quoteRect.bottom;
      const distanceAuthorToNav = navigationRect.top - authorInfoRect.bottom;

      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 ANALYSE DÉTAILLÉE DES ESPACES BLANCS');
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('📏 HAUTEURS:');
      console.log('  Carousel total:', carouselRect.height, 'px');
      console.log('  Content:', contentRect.height, 'px');
      console.log('  Text container:', textContainerRect.height, 'px');
      console.log('  Quote (témoignage):', quoteRect.height, 'px');
      console.log('  Author info:', authorInfoRect.height, 'px');
      console.log('  Navigation:', navigationRect.height, 'px');
      console.log('');
      console.log('📐 ESPACEMENTS CSS:');
      console.log('  Content padding-bottom:', contentStyles.paddingBottom);
      console.log('  Content gap:', contentStyles.gap);
      console.log('  Text container gap:', textContainerStyles.gap);
      console.log('  Quote margin-bottom:', quoteStyles.marginBottom);
      console.log('  Quote padding-bottom:', quoteStyles.paddingBottom);
      console.log('  Author info margin-top:', authorInfoStyles.marginTop);
      console.log('  Author info margin-bottom:', authorInfoStyles.marginBottom);
      console.log('  Author info padding-top:', authorInfoStyles.paddingTop);
      console.log('  Author info padding-bottom:', authorInfoStyles.paddingBottom);
      console.log('  Navigation padding:', navigationStyles.padding);
      console.log('');
      console.log('📊 DISTANCES RÉELLES (getBoundingClientRect):');
      console.log('  Quote bottom:', quoteRect.bottom, 'px');
      console.log('  Author info top:', authorInfoRect.top, 'px');
      console.log('  ⚠️  ESPACE BLANC Quote → Author:', distanceQuoteToAuthor, 'px');
      console.log('  Author info bottom:', authorInfoRect.bottom, 'px');
      console.log('  Navigation top:', navigationRect.top, 'px');
      console.log('  ⚠️  ESPACE BLANC Author → Navigation:', distanceAuthorToNav, 'px');
      console.log('');
      console.log('🎯 PROBLÈME IDENTIFIÉ:');
      if (distanceQuoteToAuthor > 25) {
        console.log('  ❌ TROP D\'ESPACE entre témoignage et auteur:', distanceQuoteToAuthor, 'px');
        console.log('     → Vérifier: gap du text-container, margin du quote, margin de l\'author-info');
      } else if (distanceQuoteToAuthor < 5) {
        console.log('  ⚠️  PEU D\'ESPACE entre témoignage et auteur:', distanceQuoteToAuthor, 'px');
      } else {
        console.log('  ✅ Espace correct entre témoignage et auteur:', distanceQuoteToAuthor, 'px');
      }
      
      if (distanceAuthorToNav > 15) {
        console.log('  ❌ TROP D\'ESPACE entre auteur et navigation:', distanceAuthorToNav, 'px');
        console.log('     → Vérifier: padding-bottom du content, padding de l\'author-info, height/padding de la navigation');
      } else if (distanceAuthorToNav < 0) {
        console.log('  ⚠️  Chevauchement entre auteur et navigation:', distanceAuthorToNav, 'px');
      } else {
        console.log('  ✅ Espace correct entre auteur et navigation:', distanceAuthorToNav, 'px');
      }
      
      console.log('');
      console.log('🔘 ANALYSE NAVIGATION:');
      console.log('  Navigation top:', navigationRect.top, 'px');
      console.log('  Navigation bottom:', navigationRect.bottom, 'px');
      console.log('  Navigation height calculée:', navigationRect.height, 'px');
      console.log('  Navigation padding-top:', navigationStyles.paddingTop);
      console.log('  Navigation padding-bottom:', navigationStyles.paddingBottom);
      console.log('  Navigation margin-top:', navigationStyles.marginTop);
      console.log('  Navigation margin-bottom:', navigationStyles.marginBottom);
      console.log('');
      console.log('🔧 CALCULS RELATIFS AU CAROUSEL:');
      const carouselTop = carouselRect.top;
      const photoContainer = document.querySelector('.testimonial-author-photo-container');
      const photoRect = photoContainer ? photoContainer.getBoundingClientRect() : null;
      const contentTopRelative = contentRect.top - carouselTop;
      const contentBottomRelative = contentRect.bottom - carouselTop;
      const authorInfoBottomRelative = authorInfoRect.bottom - carouselTop;
      const navigationTopRelative = navigationRect.top - carouselTop;
      const quoteTopRelative = quoteRect.top - carouselTop;
      const photoBottomRelative = photoRect ? photoRect.bottom - carouselTop : 0;
      
      console.log('  Content top (relatif):', contentTopRelative, 'px');
      console.log('  Content bottom (relatif):', contentBottomRelative, 'px');
      console.log('  Photo bottom (relatif):', photoBottomRelative, 'px');
      console.log('  Quote top (relatif):', quoteTopRelative, 'px');
      console.log('  📏 ESPACE Photo → Quote:', quoteTopRelative - photoBottomRelative, 'px');
      console.log('  Author info bottom (relatif):', authorInfoBottomRelative, 'px');
      console.log('  Navigation top (relatif):', navigationTopRelative, 'px');
      console.log('  📏 ESPACE Author → Navigation:', navigationTopRelative - authorInfoBottomRelative, 'px');
      console.log('  Content devrait se terminer à: 300px (où l\'auteur se termine)');
      console.log('  Navigation devrait commencer à: 300px (juste après l\'auteur)');
      console.log('  ⚠️  PROBLÈME: Content bottom =', contentBottomRelative, 'mais devrait être 300px');
      console.log('  ⚠️  PROBLÈME: Navigation top =', navigationTopRelative, 'mais devrait être 300px');
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  // Swipe handlers pour mobile
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(
    goToNext,  // Swipe gauche = suivant
    goToPrevious, // Swipe droite = précédent
    50
  );

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div 
      className={`testimonials-carousel ${poleName ? `testimonials-carousel-${poleName}` : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="testimonials-carousel-content">
        {/* Photo fixe - change instantanément sans transition */}
        <div className="testimonial-author-photo-container">
          <img 
            key={currentTestimonial.id}
            src={currentTestimonial.photo} 
            alt={currentTestimonial.author} 
            className="author-photo" 
          />
        </div>

        {/* Zone de texte qui change avec transition */}
        <div className="testimonial-text-container">
          <blockquote className={`testimonial-quote ${isTransitioning ? 'fading' : ''}`}>
            {currentTestimonial.text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </blockquote>
          
          <div className={`author-info ${isTransitioning ? 'fading' : ''}`}>
            <p className="author-name">{currentTestimonial.author}</p>
            <div className="author-role-company-wrapper">
              <span className="author-role">{currentTestimonial.role}</span>
              <span className="author-company">{currentTestimonial.company}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Desktop - Masquée s'il n'y a qu'un seul témoignage */}
      {testimonials.length > 1 && (
        <div className="testimonials-navigation">
          <button 
            className="testimonials-nav-btn prev" 
            onClick={goToPrevious}
            aria-label="Témoignage précédent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          <div className="testimonials-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonials-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className="testimonials-nav-btn next" 
            onClick={goToNext}
            aria-label="Témoignage suivant"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsCarousel;

