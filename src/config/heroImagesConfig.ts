/**
 * Configuration centralisée des images Hero pour chaque pôle
 * 
 * Pour modifier les images du Hero, changez simplement les numéros dans ce fichier.
 * Les numéros correspondent à la position dans la galerie (1-indexé, de gauche à droite, de haut en bas).
 * 
 * Exemple pour Géospatial :
 * - Position 1 = "Drone de relevé géospatial au Gabon" (première image de la galerie)
 * - Position 2 = "Équipe professionnelle de topographie au Gabon" (deuxième image)
 * - etc.
 */

export const heroImagesConfig = {
  energie: {
    // Positions dans la galerie Énergie (1-indexé)
    carouselImages: [4, 5, 9, 10, 11],
    // Options d'affichage pour que les images soient entièrement visibles
    imageDisplay: {
      backgroundSize: 'contain', // Affiche l'image entière sans coupure
      backgroundPosition: 'center', // Centre l'image
      backgroundRepeat: 'no-repeat'
    }
  },
  geospatial: {
    // Positions dans la galerie Géospatial (1-indexé)
    carouselImages: [1, 2, 4, 7, 16],
  },
  ods: {
    // Positions dans la galerie ODS/Drones (1-indexé)
    carouselImages: [3, 8, 9, 12, 13],
  },
  sante: {
    carouselImages: [1, 2, 3],
  },
  securite: {
    carouselImages: [1, 2, 3],
  },
};
