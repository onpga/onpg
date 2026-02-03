import { useState, useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook pour détecter quand un élément entre dans la vue (viewport)
 * Utile pour les animations au scroll
 * 
 * @param options - Options de configuration pour IntersectionObserver
 * @returns Tuple [ref, isIntersecting] - ref à attacher à l'élément, isIntersecting indique si visible
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement>, boolean] => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        if (triggerOnce && hasTriggered) {
          return;
        }

        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, hasTriggered]);

  return [elementRef, isIntersecting];
};












