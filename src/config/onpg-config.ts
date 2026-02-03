/**
 * Configuration ONPG - Ordre National de Pharmacie du Gabon
 */

export const ONPG_CONFIG = {
  // Cloudinary
  cloudinary: {
    cloudName: 'dduvinjnu',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
    uploadPreset: 'onpg_uploads'
  },

  // Informations générales
  app: {
    title: 'Ordre National de Pharmacie du Gabon',
    shortTitle: 'ONPG',
    description: 'Ordre National de Pharmacie du Gabon - Excellence, professionnalisme et innovation au service de la santé',
    slogan: 'Excellence, professionnalisme et innovation au service de la santé'
  },

  // Navigation
  navigation: {
    main: [
      { path: '/', label: 'Accueil' },
      { path: '/missions', label: 'Nos missions' },
      { path: '/organisation', label: 'Organisation' },
      { path: '/formation', label: 'Formation' },
      { path: '/actualites', label: 'Actualités' },
      { path: '/contact', label: 'Contact' }
    ],
    footer: [
      { path: '/mentions-legales', label: 'Mentions légales' },
      { path: '/confidentialite', label: 'Politique de confidentialité' },
      { path: '/conditions-generales', label: 'Conditions générales' }
    ]
  },

  // Couleurs ONPG (à définir selon la charte graphique)
  colors: {
    primary: '#0066CC',    // Bleu institutionnel
    secondary: '#00A651',  // Vert santé
    accent: '#FF6B35',     // Orange accent
    neutral: '#2C3E50',    // Gris foncé
    light: '#F8F9FA'       // Gris clair
  },

  // Contact
  contact: {
    email: 'contact@onpg.ga',
    phone: '+241 XX XX XX XX',
    address: 'Libreville, Gabon'
  },

  // Réseaux sociaux
  social: {
    facebook: 'https://facebook.com/onpg',
    twitter: 'https://twitter.com/onpg',
    linkedin: 'https://linkedin.com/company/onpg',
    instagram: 'https://instagram.com/onpg'
  }
};

export default ONPG_CONFIG;

