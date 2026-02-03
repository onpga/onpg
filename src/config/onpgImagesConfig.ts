/**
 * Configuration des images ONPG - Ordre National de Pharmacie du Gabon
 * Utilise Cloudinary pour l'optimisation automatique des images
 */

import onpgImagesData from './onpg-cloudinary-images.json';

// Types pour la configuration des images
export interface CloudinaryImage {
  url: string;
  optimized: string;
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// Fonction utilitaire pour obtenir l'URL d'une image Cloudinary ONPG
export function getONPGImageUrl(imageKey: string, optimized: boolean = true): string {
  const imageData = onpgImagesData.images[imageKey];
  const optimizedData = onpgImagesData.optimized[imageKey];

  if (!imageData) {
    console.warn(`Image ONPG non trouvée: ${imageKey}`);
    return '';
  }

  return optimized ? (optimizedData || imageData) : imageData;
}

// Fonction pour obtenir le logo ONPG
export function getONPGLogo(optimized: boolean = true): string {
  return getONPGImageUrl('logo-onpg', optimized);
}

// Fonction pour obtenir une image hero
export function getONPGHeroImage(imageKey: string, optimized: boolean = true): string {
  return getONPGImageUrl(imageKey, optimized);
}

// Configuration des slides du carousel hero
export const onpgHeroSlides: HeroSlide[] = onpgImagesData.hero_slides;

// Fonction pour obtenir tous les slides hero avec les URLs complètes
export function getONPGHeroSlides(): HeroSlide[] {
  return onpgHeroSlides.map(slide => ({
    ...slide,
    image: getONPGHeroImage(slide.image, true)
  }));
}

// Fonction pour obtenir l'image de fond hero
export function getONPGHeroBg(optimized: boolean = true): string {
  return getONPGHeroImage('hero-bg', optimized);
}

// Liste des clés d'images disponibles
export const availableONPGImages = Object.keys(onpgImagesData.images);

// Export des données brutes si nécessaire
export { onpgImagesData };

