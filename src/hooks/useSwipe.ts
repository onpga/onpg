import { useState } from 'react';

/**
 * Hook personnalisé pour gérer les gestes tactiles (swipe)
 * Permet de détecter les balayages gauche/droite sur mobile
 * 
 * @param onSwipeLeft - Callback appelé lors d'un swipe vers la gauche
 * @param onSwipeRight - Callback appelé lors d'un swipe vers la droite
 * @param minSwipeDistance - Distance minimale en pixels pour détecter un swipe (défaut: 50)
 * @returns Handlers à attacher aux éléments DOM
 */
export const useSwipe = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  minSwipeDistance: number = 50
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd pour éviter les conflits
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;  // Swipe vers la gauche (doigt va vers la gauche)
    const isRightSwipe = distance < -minSwipeDistance; // Swipe vers la droite (doigt va vers la droite)
    
    if (isLeftSwipe) {
      onSwipeLeft();
    }
    if (isRightSwipe) {
      onSwipeRight();
    }
    
    // Reset pour le prochain swipe
    setTouchStart(null);
    setTouchEnd(null);
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};












