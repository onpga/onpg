import { ReactNode } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import './AnimatedSection.css';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight';
  delay?: number;
  className?: string;
}

/**
 * Composant AnimatedSection - Section avec animation au scroll
 * @param children - Contenu à animer
 * @param animation - Type d'animation (défaut: fadeIn)
 * @param delay - Délai en ms avant l'animation (défaut: 0)
 * @param className - Classes CSS supplémentaires
 */
const AnimatedSection = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  className = '' 
}: AnimatedSectionProps) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div
      ref={ref}
      className={`animated-section ${animation} ${isIntersecting ? 'visible' : ''} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;












