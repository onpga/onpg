/**
 * Génère une URL Cloudinary optimisée pour les images de galerie
 * @param url - URL Cloudinary complète ou public_id
 * @param options - Options de transformation
 * @returns URL Cloudinary avec transformations
 */
export function getCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'limit' | 'fill' | 'fit' | 'scale';
  } = {}
): string {
  if (!url) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit'
  } = options;

  // Si c'est déjà une URL Cloudinary complète, l'utiliser
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    // Extraire les parties de l'URL Cloudinary
    const parts = url.split('/upload/');
    if (parts.length !== 2) {
      return url;
    }

    const baseUrl = parts[0] + '/upload';
    const restOfUrl = parts[1];

    // Construire les transformations
    const transformations: string[] = [];

    if (width || height) {
      const size = width && height ? `w_${width},h_${height}` : width ? `w_${width}` : `h_${height}`;
      transformations.push(size);
    }

    if (crop) {
      transformations.push(`c_${crop}`);
    }

    if (quality) {
      transformations.push(`q_${quality}`);
    }

    if (format) {
      transformations.push(`f_${format}`);
    }

    // Ajouter les transformations à l'URL
    if (transformations.length > 0) {
      return `${baseUrl}/${transformations.join(',')}/${restOfUrl}`;
    }

    return url;
  }

  // Si c'est un public_id ou une URL partielle, construire l'URL complète
  // Format attendu: cips/poles/drone/drone-1 ou URL complète
  let publicId = url;
  if (url.includes('cips/poles/')) {
    publicId = url;
  } else if (url.startsWith('/')) {
    // Si c'est un chemin local, retourner tel quel (fallback)
    return url;
  }

  // Construire l'URL Cloudinary complète
  // Note: Vous devrez remplacer YOUR_CLOUD_NAME par votre vrai cloud_name
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Construire les transformations
  const transformations: string[] = [];

  if (width || height) {
    const size = width && height ? `w_${width},h_${height}` : width ? `w_${width}` : `h_${height}`;
    transformations.push(size);
  }

  if (crop) {
    transformations.push(`c_${crop}`);
  }

  if (quality) {
    transformations.push(`q_${quality}`);
  }

  if (format) {
    transformations.push(`f_${format}`);
  }

  // Construire l'URL finale
  if (transformations.length > 0) {
    return `${baseUrl}/${transformations.join(',')}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
}

/**
 * Extrait le public_id et la version d'une URL Cloudinary, en supprimant toutes les transformations
 * @param url - URL Cloudinary complète (peut contenir des transformations)
 * @returns { baseUrl: string, version: string, publicId: string } ou null si URL invalide
 */
function extractCloudinaryPath(url: string): { baseUrl: string; version: string; publicId: string } | null {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }

  // Extraire la base URL (https://res.cloudinary.com/cloud_name/image/upload)
  const uploadMatch = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload)/);
  if (!uploadMatch) {
    return null;
  }

  const baseUrl = uploadMatch[1];
  
  // Extraire tout ce qui vient après /upload/
  const afterUpload = url.split('/upload/')[1];
  if (!afterUpload) {
    return null;
  }

  // Format attendu dans ce projet : 
  // - Avec transformations : [TRANSFORMATIONS]/v[VERSION]/cips/poles/...
  // - Sans transformations : v[VERSION]/cips/poles/... ou cips/poles/...
  
  // Stratégie simple : Chercher le pattern "cips/" qui est unique et indique le début du public_id
  const cipsIndex = afterUpload.indexOf('cips/');
  if (cipsIndex !== -1) {
    const publicId = afterUpload.substring(cipsIndex); // "cips/poles/..."
    
    // Chercher la version juste avant "cips/"
    const beforeCips = afterUpload.substring(0, cipsIndex);
    const versionMatch = beforeCips.match(/v(\d+)\//);
    const version = versionMatch ? `v${versionMatch[1]}` : '';
    
    return { baseUrl, version, publicId };
  }
  
  // Si pas de "cips/", chercher le pattern de version (v[chiffres]/) suivi d'un chemin
  const versionMatch = afterUpload.match(/v(\d+)\/(.+)$/);
  if (versionMatch) {
    const version = `v${versionMatch[1]}`;
    const publicId = versionMatch[2];
    return { baseUrl, version, publicId };
  }
  
  // Fallback : utiliser tout ce qui vient après /upload/ comme public_id (sans version)
  // Cela gère le cas où l'URL n'a pas de transformations ni de version explicite
  return { baseUrl, version: '', publicId: afterUpload };
}

/**
 * Génère une URL Cloudinary pour une image de galerie (thumbnail)
 * Optimisé pour la rapidité d'affichage avec :
 * - Qualité auto:eco (30-40% plus léger)
 * - Format auto (AVIF/WebP prioritaire)
 */
export function getGalleryThumbnailUrl(url: string, width: number = 600, height: number = 450): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const pathInfo = extractCloudinaryPath(url);
  if (!pathInfo) {
    return url; // Fallback sur l'URL originale si extraction échoue
  }

  const { baseUrl, version, publicId } = pathInfo;

  // Transformations optimisées pour la vitesse - uniquement celles supportées
  const transformations = [
    `w_${width}`,       // Largeur
    `h_${height}`,      // Hauteur
    'c_fill',           // Crop fill pour maintenir le ratio
    'q_auto:eco',       // Qualité optimisée pour vitesse
    'f_auto'            // Format auto (WebP si supporté)
  ].join(',');

  // Reconstruire l'URL propre : /upload/TRANSFORMATIONS/vVERSION/PUBLIC_ID
  if (version) {
    return `${baseUrl}/${transformations}/${version}/${publicId}`;
  } else {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
}

/**
 * Génère une URL Cloudinary pour une image en haute résolution (modal)
 * Optimisé avec les mêmes paramètres que fullscreen mais résolution intermédiaire
 */
export function getGalleryFullSizeUrl(url: string, width: number = 1920): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const pathInfo = extractCloudinaryPath(url);
  if (!pathInfo) {
    return url; // Fallback sur l'URL originale si extraction échoue
  }

  const { baseUrl, version, publicId } = pathInfo;

  // Transformations optimisées pour modal (qualité haute) - uniquement celles supportées
  const transformations = [
    `w_${width}`,       // Largeur
    'c_limit',          // Crop limit pour maintenir les proportions
    'q_auto:best',      // Qualité optimale
    'f_auto'            // Format auto (WebP si supporté)
  ].join(',');

  // Reconstruire l'URL propre : /upload/TRANSFORMATIONS/vVERSION/PUBLIC_ID
  if (version) {
    return `${baseUrl}/${transformations}/${version}/${publicId}`;
  } else {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
}

/**
 * Génère une URL Cloudinary optimisée pour les images de background Hero
 * Optimisé pour performance : 1920px de largeur, qualité auto, format auto
 * @param url - URL Cloudinary complète
 * @returns URL Cloudinary optimisée pour Hero backgrounds
 */
export function getHeroBackgroundUrl(url: string): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const pathInfo = extractCloudinaryPath(url);
  if (!pathInfo) {
    return url;
  }

  const { baseUrl, version, publicId } = pathInfo;

  // Transformations optimisées pour Hero backgrounds
  // w_1920 : largeur adaptée aux écrans modernes (pas besoin de 4K pour background)
  // c_limit : maintient les proportions sans couper
  // q_auto:best : qualité optimale pour backgrounds
  // f_auto : format auto (WebP/AVIF si supporté)
  const transformations = [
    'w_1920',
    'c_limit',
    'q_auto:best',
    'f_auto'
  ].join(',');

  if (version) {
    return `${baseUrl}/${transformations}/${version}/${publicId}`;
  } else {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
}

/**
 * Génère une URL Cloudinary pour une image en très haute résolution (plein écran)
 * Utilise une résolution 4K (3840px) pour les grands écrans
 * Optimisé pour la meilleure qualité/performance
 */
export function getGalleryFullscreenUrl(url: string): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const pathInfo = extractCloudinaryPath(url);
  if (!pathInfo) {
    return url; // Fallback sur l'URL originale si extraction échoue
  }

  const { baseUrl, version, publicId } = pathInfo;

  // Détecter la taille de l'écran pour charger la bonne résolution
  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.screen.height : 1080;
  
  // Calculer la résolution nécessaire (largeur ou hauteur selon l'orientation)
  const maxDimension = Math.max(screenWidth, screenHeight);
  
  // Utiliser 4K (3840px) pour les grands écrans, sinon adapter
  let width = 1920; // Résolution par défaut plus raisonnable
  if (maxDimension <= 1920) {
    width = 1920;
  } else if (maxDimension <= 2560) {
    width = 2560;
  } else {
    width = 3840; // 4K pour très grands écrans
  }

  // Transformations optimisées pour plein écran - uniquement celles supportées
  const transformations = [
    `w_${width}`,       // Largeur
    'c_limit',          // Crop limit pour maintenir les proportions
    'q_auto:best',      // Qualité optimale pour plein écran
    'f_auto'            // Format auto (WebP si supporté)
  ].join(',');

  // Reconstruire l'URL propre : /upload/TRANSFORMATIONS/vVERSION/PUBLIC_ID
  if (version) {
    return `${baseUrl}/${transformations}/${version}/${publicId}`;
  } else {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
}

