import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour optimiser les event listeners de scroll avec throttling
 * @param callback Fonction à appeler lors du scroll
 * @param delay Délai en millisecondes (défaut: 16ms pour ~60fps)
 * @param deps Dépendances pour recréer le callback
 */
export function useThrottledScroll(
  callback: (event: Event) => void,
  delay: number = 16,
  deps: any[] = []
) {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Mettre à jour la référence du callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    const throttledCallback = (event: Event) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callbackRef.current(event);
      } else {
        // Annuler le timeout précédent
        if (timeoutRef.current !== null) {
          cancelAnimationFrame(timeoutRef.current);
        }

        // Programmer l'exécution pour la fin du délai
        timeoutRef.current = requestAnimationFrame(() => {
          const now = Date.now();
          if (now - lastRun.current >= delay) {
            lastRun.current = now;
            callbackRef.current(event);
          }
        });
      }
    };

    window.addEventListener('scroll', throttledCallback, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledCallback);
      if (timeoutRef.current !== null) {
        cancelAnimationFrame(timeoutRef.current);
      }
    };
  }, [delay, ...deps]);
}

/**
 * Hook pour optimiser les event listeners de scroll avec requestAnimationFrame
 * Plus fluide pour les animations
 */
export function useScrollAnimation(
  callback: (scrollY: number) => void,
  deps: any[] = []
) {
  const callbackRef = useRef(callback);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          callbackRef.current(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [...deps]);
}




