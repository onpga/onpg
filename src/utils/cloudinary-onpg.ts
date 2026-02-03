/**
 * Utilitaires Cloudinary pour ONPG
 * URLs directes depuis Cloudinary
 */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dduvinjnu/image/upload';

/**
 * Construit une URL Cloudinary
 */
export function cloudinaryUrl(path: string): string {
  return `${CLOUDINARY_BASE}/${path}`;
}

/**
 * Construit une URL Cloudinary avec transformations
 */
export function cloudinaryUrlWithTransform(
  path: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
    quality?: 'auto' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  const transforms: string[] = [];

  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.crop) transforms.push(`c_${transformations.crop}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  if (transformations.format) transforms.push(`f_${transformations.format}`);

  if (transforms.length > 0) {
    return `${CLOUDINARY_BASE}/${transforms.join(',')}/${path}`;
  }

  return `${CLOUDINARY_BASE}/${path}`;
}

/**
 * URLs directes pour les images principales
 * URLs exactes depuis Cloudinary sans transformations
 */
export const ONPG_IMAGES = {
  // Logo (public_id exact depuis Cloudinary)
  logo: `${CLOUDINARY_BASE}/LOGO_ONPG_gvlag2.png`,

  // Hero images (principales) - utiliser les public_id réels
  hero1: `${CLOUDINARY_BASE}/onpg/hero/hero-1`,
  hero2: `${CLOUDINARY_BASE}/onpg/hero/hero-2`,
  hero3: `${CLOUDINARY_BASE}/onpg/hero/hero-3`,
  hero4: `${CLOUDINARY_BASE}/onpg/hero/hero-4`,
  hero5: `${CLOUDINARY_BASE}/onpg/hero/hero-5`,
  heroBg: `${CLOUDINARY_BASE}/onpg/hero/hero-bg`,

  // Hero carousel images (supplémentaires - non utilisées pour le moment)
  heroTheTonik: `${CLOUDINARY_BASE}/onpg/hero/the-tonik-5Lbyao5bzbc-unsplash`,
  heroMichal: `${CLOUDINARY_BASE}/onpg/hero/michal-parzuchowski-7TWRwDjfGew-unsplash`,
  heroPexelsKarola: `${CLOUDINARY_BASE}/onpg/hero/pexels-karola-g-4084639`,
  heroAfricanWoman: `${CLOUDINARY_BASE}/onpg/hero/african-american-woman-pharmacist-standing-with-serious-expression-pharmacy`,
  heroAlexander: `${CLOUDINARY_BASE}/onpg/hero/alexander-grey-FEPfs43yiPE-unsplash`,
  heroBrett: `${CLOUDINARY_BASE}/onpg/hero/brett-jordan-rJVflgqasr4-unsplash`,
  heroChristina: `${CLOUDINARY_BASE}/onpg/hero/christina-victoria-craft-ZHys6xN7sUE-unsplash`,
  heroDima: `${CLOUDINARY_BASE}/onpg/hero/dima-mukhin-DFhSL1pM90k-unsplash`,
  heroArpad: `${CLOUDINARY_BASE}/onpg/hero/arpad-czapp-tvP6pCnq9iI-unsplash`,
  heroFreestocks: `${CLOUDINARY_BASE}/onpg/hero/freestocks-0-HAIyTj7Xw-unsplash`,
  heroLaurynas: `${CLOUDINARY_BASE}/onpg/hero/laurynas-me-1TL8AoEDj_c-unsplash`,
  heroMariano: `${CLOUDINARY_BASE}/onpg/hero/mariano-baraldi-IIBRFPj5LQk-unsplash`,
  heroMarkus: `${CLOUDINARY_BASE}/onpg/hero/markus-winkler-pOu_UmkOG-0-unsplash`,
  heroNathaniel: `${CLOUDINARY_BASE}/onpg/hero/nathaniel-yeo-gUZo-UA0VGQ-unsplash`,
  heroPortrait1: `${CLOUDINARY_BASE}/onpg/hero/portrait-female-pharmacist-working-drugstore`,
  heroPortrait2: `${CLOUDINARY_BASE}/onpg/hero/portrait-female-pharmacist-working-drugstore (1)`,
  heroPortrait3: `${CLOUDINARY_BASE}/onpg/hero/portrait-female-pharmacist-working-drugstore (2)`,
  heroPortraitWoman: `${CLOUDINARY_BASE}/onpg/hero/portrait-woman-working-pharmaceutical-industry`,
  heroRoberto: `${CLOUDINARY_BASE}/onpg/hero/roberto-sorin-RS0-h_pyByk-unsplash`,
  heroVladislav: `${CLOUDINARY_BASE}/onpg/hero/vladislav-bychkov-NdbdD6matvE-unsplash`,
  heroPexelsMarkus: `${CLOUDINARY_BASE}/onpg/hero/pexels-markus-winkler-1430818-5699982`,
  heroFluDisease: `${CLOUDINARY_BASE}/onpg/hero/flu-disease-healthcare-medicine-concept-happy-african-american-male-doctor-white-coat-present-new-drugs-cure-from-disease-viruses-showing-pills-guarantee-good-quality-treatment`,

  // Photo président (public_id exact depuis Cloudinary)
  president: `${CLOUDINARY_BASE}/onpg/hero/flu-disease-healthcare-medicine-concept-happy-african-american-male-doctor-white-coat-present-new-drugs-cure-from-disease-viruses-showing-pills-guarantee-good-quality-treatment`,

  // Images pour les liens rapides
  quickLinkInscription: `${CLOUDINARY_BASE}/onpg/hero/portrait-female-pharmacist-working-drugstore`,
  quickLinkEPOP: `${CLOUDINARY_BASE}/onpg/hero/hero-1`,
  quickLinkEcologie: `${CLOUDINARY_BASE}/onpg/hero/hero-2`,
  quickLinkNouveaux: `${CLOUDINARY_BASE}/onpg/hero/hero-3`,
  quickLinkAnnuaire: `${CLOUDINARY_BASE}/onpg/hero/african-american-woman-pharmacist-standing-with-serious-expression-pharmacy`,
  quickLinkVenteLigne: `${CLOUDINARY_BASE}/onpg/hero/portrait-female-pharmacist-working-drugstore (1)`
};

export default ONPG_IMAGES;
