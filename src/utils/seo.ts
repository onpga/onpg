/**
 * Utilitaires SEO pour gérer les meta tags et structured data
 */

/**
 * Met à jour ou crée un meta tag
 */
export const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' | 'rel' = 'name') => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    if (attribute === 'rel') {
      meta.setAttribute('rel', name);
      meta.setAttribute('href', content);
    } else {
      meta.setAttribute(attribute, name);
      meta.setAttribute('content', content);
    }
    document.head.appendChild(meta);
  } else {
    if (attribute === 'rel') {
      meta.setAttribute('href', content);
    } else {
      meta.setAttribute('content', content);
    }
  }
};

/**
 * Ajoute des données structurées Schema.org
 */
export const addStructuredData = (data: object) => {
  // Supprimer les anciennes données structurées du même type si elles existent
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript && existingScript.textContent?.includes('"@type"')) {
    // On peut garder plusieurs structured data, donc on ajoute simplement
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Met à jour le canonical URL
 */
export const updateCanonical = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};

/**
 * Met à jour les meta tags Open Graph
 */
export const updateOpenGraph = (data: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  if (data.title) updateMetaTag('og:title', data.title, 'property');
  if (data.description) updateMetaTag('og:description', data.description, 'property');
  if (data.image) updateMetaTag('og:image', data.image, 'property');
  if (data.url) updateMetaTag('og:url', data.url, 'property');
  if (data.type) updateMetaTag('og:type', data.type, 'property');
};

/**
 * Met à jour les meta tags Twitter Card
 */
export const updateTwitterCard = (data: {
  title?: string;
  description?: string;
  image?: string;
  card?: string;
}) => {
  if (data.title) updateMetaTag('twitter:title', data.title);
  if (data.description) updateMetaTag('twitter:description', data.description);
  if (data.image) updateMetaTag('twitter:image', data.image);
  if (data.card) updateMetaTag('twitter:card', data.card);
};








