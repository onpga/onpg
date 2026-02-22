/**
 * Utilitaire pour gérer les images de fallback
 * Fournit une image par défaut quand une image n'est pas définie
 */

import React from 'react';
import { ONPG_IMAGES } from './cloudinary-onpg';

/**
 * Image de fallback par défaut (logo ONPG stylisé)
 */
export const DEFAULT_FALLBACK_IMAGE = ONPG_IMAGES.logo;

/**
 * Image de fallback pour les articles/actualités (image générique d'article)
 * Utilise une image générique adaptée au contenu (PAS la présidente)
 */
export const ARTICLE_FALLBACK_IMAGE = (ONPG_IMAGES.fallbackArticle as string) || `${ONPG_IMAGES.logo.split('/LOGO_ONPG_gvlag2.png')[0]}/w_600,h_400,c_fill,q_85,f_auto/onpg/hero/hero-1`;

/**
 * Image de fallback pour les photos de profil (icône utilisateur)
 */
export const PROFILE_FALLBACK_IMAGE = `${ONPG_IMAGES.logo.split('/LOGO_ONPG_gvlag2.png')[0]}/w_200,h_200,c_fill,q_80,f_auto,b_rgb:F0F0F0/e_grayscale/onpg/hero/hero-1`;

/**
 * Retourne l'image fournie ou une image de fallback si elle est vide/undefined
 * @param imageUrl - URL de l'image (peut être undefined, null, ou vide)
 * @param fallbackType - Type de fallback à utiliser ('default' | 'article' | 'profile')
 * @returns URL de l'image ou du fallback
 */
export function getImageWithFallback(
  imageUrl: string | undefined | null,
  fallbackType: 'default' | 'article' | 'profile' = 'default'
): string {
  if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'undefined' || imageUrl === 'null') {
    switch (fallbackType) {
      case 'article':
        return ARTICLE_FALLBACK_IMAGE;
      case 'profile':
        return PROFILE_FALLBACK_IMAGE;
      default:
        return DEFAULT_FALLBACK_IMAGE;
    }
  }
  return imageUrl;
}

/**
 * Composant d'image avec fallback automatique
 * Gère aussi les erreurs de chargement
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackType = 'default',
  className,
  style,
  onError,
  ...props
}: {
  src?: string | null;
  alt: string;
  fallbackType?: 'default' | 'article' | 'profile';
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any;
}) {
  const imageSrc = getImageWithFallback(src, fallbackType);
  const fallbackSrc = fallbackType === 'article' ? ARTICLE_FALLBACK_IMAGE : 
                      fallbackType === 'profile' ? PROFILE_FALLBACK_IMAGE : 
                      DEFAULT_FALLBACK_IMAGE;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Si l'image de fallback échoue aussi, utiliser le logo
    if (target.src !== fallbackSrc && target.src !== DEFAULT_FALLBACK_IMAGE) {
      target.src = DEFAULT_FALLBACK_IMAGE;
    }
    onError?.(e);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
}

export default {
  getImageWithFallback,
  ImageWithFallback,
  DEFAULT_FALLBACK_IMAGE,
  ARTICLE_FALLBACK_IMAGE,
  PROFILE_FALLBACK_IMAGE
};
