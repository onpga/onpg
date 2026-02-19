/**
 * Script pour insérer les mocks des pages Ressources en MongoDB
 * 1 mock par page (sauf Videos qui a 26 vidéos réelles)
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './backend-config.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'onpg';

const ressourcesMocks = [
  // Communiqués - 1 mock
  {
    pageId: 'communiques',
    title: 'Communiqué de presse : Nouveau protocole de sécurité médicamenteuse',
    content: JSON.stringify({
      reference: 'CP-2024-001',
      date: '2024-01-15',
      type: 'presse',
      category: 'Sécurité',
      excerpt: 'L\'ONPG annonce un nouveau protocole révolutionnaire pour renforcer la sécurité médicamenteuse dans les officines gabonaises.',
      content: 'L\'ONPG, en collaboration avec le Ministère de la Santé, présente aujourd\'hui un nouveau protocole de sécurité médicamenteuse qui vise à élever les standards de qualité et de sécurité dans toutes les officines du Gabon.',
      urgent: false,
      featured: false
    }),
    type: 'communique',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Articles - 1 mock
  {
    pageId: 'articles',
    title: 'L\'avenir de la pharmacie au Gabon : perspectives et défis',
    content: JSON.stringify({
      author: 'Dr. Marie Dubois',
      date: '2024-01-20',
      category: 'Actualités',
      excerpt: 'Analyse approfondie des enjeux de la profession pharmaceutique au Gabon et des perspectives d\'évolution.',
      content: 'La profession pharmaceutique au Gabon connaît une transformation majeure avec l\'intégration des nouvelles technologies et l\'évolution des besoins de santé publique...',
      tags: ['pharmacie', 'Gabon', 'avenir', 'technologie']
    }),
    type: 'article',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Commissions - 1 mock
  {
    pageId: 'commissions',
    title: 'Commission de Formation Continue',
    content: JSON.stringify({
      president: 'Dr. Alain Moreau',
      members: 8,
      description: 'Commission chargée de l\'organisation et du suivi de la formation continue des pharmaciens.',
      attributions: ['Organisation des formations', 'Validation des programmes', 'Suivi des participants']
    }),
    type: 'commission',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Décisions - 1 mock
  {
    pageId: 'decisions',
    title: 'Décision relative à l\'inscription au tableau de l\'Ordre',
    content: JSON.stringify({
      reference: 'DEC-2024-001',
      date: '2024-01-20',
      jurisdiction: 'Conseil National de l\'Ordre',
      category: 'Inscription',
      summary: 'Le Conseil National décide de l\'inscription au tableau de l\'Ordre d\'un pharmacien titulaire d\'un diplôme étranger.',
      decision: 'favorable',
      featured: false
    }),
    type: 'decision',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Décrets - 1 mock
  {
    pageId: 'decrets',
    title: 'Décret n°2024-001 relatif à l\'exercice de la pharmacie',
    content: JSON.stringify({
      number: '2024-001',
      date: '2024-01-10',
      category: 'Réglementation',
      summary: 'Décret fixant les conditions d\'exercice de la profession pharmaceutique au Gabon.',
      published: true
    }),
    type: 'decret',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Lois - 1 mock
  {
    pageId: 'lois',
    title: 'Loi n°2024-001 sur l\'Ordre National des Pharmaciens',
    content: JSON.stringify({
      number: '2024-001',
      date: '2024-01-05',
      category: 'Législation',
      summary: 'Loi portant création et organisation de l\'Ordre National des Pharmaciens du Gabon.',
      chapters: 5,
      articles: 45
    }),
    type: 'loi',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Photos - 1 mock
  {
    pageId: 'photos',
    title: 'Congrès National 2024',
    content: JSON.stringify({
      album: 'Congrès National 2024',
      date: '2024-01-15',
      description: 'Photos du 15ème Congrès National des Pharmaciens du Gabon',
      image: 'https://res.cloudinary.com/dduvinjnu/image/upload/v1/onpg/photos/congres-2024',
      category: 'Événements',
      featured: true
    }),
    type: 'photo',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // Thèses - 1 mock
  {
    pageId: 'theses',
    title: 'Étude sur la pharmacovigilance au Gabon',
    content: JSON.stringify({
      author: 'Dr. Jean Martin',
      university: 'Université Omar Bongo',
      year: 2024,
      category: 'Recherche',
      summary: 'Thèse de doctorat portant sur l\'analyse du système de pharmacovigilance au Gabon.',
      keywords: ['pharmacovigilance', 'Gabon', 'sécurité médicamenteuse']
    }),
    type: 'these',
    order: 1,
    metadata: {},
    isActive: true
  },
  
  // TrouverPharmacie - 1 mock (peut être vide, c'est une page de recherche)
  {
    pageId: 'trouver-pharmacie',
    title: 'Annuaire des Pharmacies',
    content: JSON.stringify({
      description: 'Recherchez une pharmacie près de chez vous',
      totalPharmacies: 120
    }),
    type: 'annuaire',
    order: 1,
    metadata: {},
    isActive: true
  }
];

// Vidéos réelles - 26 vidéos
const videosMocks = [
  {
    pageId: 'videos',
    title: 'Ordre National de Pharmacie du Gabon - Mission et Organisation',
    content: JSON.stringify({
      description: 'Découvrez l\'Ordre National de Pharmacie du Gabon, son rôle, ses missions et son organisation pour la régulation de la profession pharmaceutique.',
      thumbnail: 'https://img.youtube.com/vi/5tG0sc39-dg/maxresdefault.jpg',
      youtubeId: '5tG0sc39-dg',
      duration: '15:30',
      views: 2847,
      likes: 156,
      publishedDate: '2024-12-15',
      category: 'Institution',
      speaker: 'Président ONPG',
      event: 'Présentation Institutionnelle',
      tags: ['ONPG', 'Gabon', 'pharmacie', 'institution', 'régulation'],
      featured: true
    }),
    type: 'video',
    order: 1,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Formation Continue - Actualisation des Compétences Pharmaceutiques',
    content: JSON.stringify({
      description: 'Programme de formation continue obligatoire pour les pharmaciens du Gabon.',
      thumbnail: 'https://img.youtube.com/vi/wffHcFlZi4Y/maxresdefault.jpg',
      youtubeId: 'wffHcFlZi4Y',
      duration: '22:45',
      views: 1923,
      likes: 98,
      publishedDate: '2024-12-10',
      category: 'Formation Continue',
      speaker: 'Dr. Formation ONPG',
      tags: ['formation', 'continue', 'compétences'],
      featured: true
    }),
    type: 'video',
    order: 2,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Réglementation Pharmaceutique - Mise à jour 2024',
    content: JSON.stringify({
      description: 'Évolution de la législation pharmaceutique au Gabon.',
      thumbnail: 'https://img.youtube.com/vi/e6p7SoO1NNg/maxresdefault.jpg',
      youtubeId: 'e6p7SoO1NNg',
      duration: '28:20',
      views: 1567,
      likes: 87,
      publishedDate: '2024-12-05',
      category: 'Réglementation',
      speaker: 'Juriste ONPG',
      tags: ['réglementation', 'loi'],
      featured: false
    }),
    type: 'video',
    order: 3,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Innovation Technologique en Pharmacie Gabonaise',
    content: JSON.stringify({
      description: 'Découvrez les dernières innovations technologiques adoptées par les pharmacies gabonaises.',
      thumbnail: 'https://img.youtube.com/vi/U40yBCKlJqw/maxresdefault.jpg',
      youtubeId: 'U40yBCKlJqw',
      duration: '25:15',
      views: 2134,
      likes: 142,
      publishedDate: '2024-11-28',
      category: 'Innovation',
      speaker: 'Directeur Innovation ONPG',
      tags: ['innovation', 'digital', 'technologie'],
      featured: true
    }),
    type: 'video',
    order: 4,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Éthique et Déontologie Pharmaceutique',
    content: JSON.stringify({
      description: 'Principes éthiques et déontologiques de la profession pharmaceutique au Gabon.',
      thumbnail: 'https://img.youtube.com/vi/U40yBCKlJqw/maxresdefault.jpg',
      youtubeId: 'U40yBCKlJqw',
      duration: '31:40',
      views: 1789,
      likes: 113,
      publishedDate: '2024-11-20',
      category: 'Éthique',
      speaker: 'Commission Éthique ONPG',
      tags: ['éthique', 'déontologie'],
      featured: false
    }),
    type: 'video',
    order: 5,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Ne donnez jamais de miel à un bébé de moins d\'un an ! Voici pourquoi…',
    content: JSON.stringify({
      description: 'Découvrez pourquoi il est dangereux de donner du miel aux bébés de moins d\'un an.',
      thumbnail: 'https://img.youtube.com/vi/b7mwmuAhAv4/maxresdefault.jpg',
      youtubeId: 'b7mwmuAhAv4',
      duration: '12:30',
      views: 3456,
      likes: 234,
      publishedDate: '2024-12-20',
      category: 'Pédiatrie',
      speaker: 'Docteur Pédiatre ONPG',
      tags: ['bébé', 'miel', 'pédiatrie'],
      featured: true
    }),
    type: 'video',
    order: 6,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Le sommeil, c\'est la vie : Comment le réparer',
    content: JSON.stringify({
      description: 'Conseils pratiques du Docteur Lionel Ozounguet Fock sur les troubles du sommeil.',
      thumbnail: 'https://img.youtube.com/vi/ea_OR1rZwzk/maxresdefault.jpg',
      youtubeId: 'ea_OR1rZwzk',
      duration: '18:45',
      views: 4123,
      likes: 312,
      publishedDate: '2024-12-18',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['sommeil', 'troubles', 'santé'],
      featured: true
    }),
    type: 'video',
    order: 7,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Taches sombres persistantes ? Le mélasma pourrait être la cause. Voici comment unifier votre peau !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes du mélasma.',
      thumbnail: 'https://img.youtube.com/vi/svPh3zMP8lU/maxresdefault.jpg',
      youtubeId: 'svPh3zMP8lU',
      duration: '15:20',
      views: 3876,
      likes: 267,
      publishedDate: '2024-12-16',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['mélasma', 'taches', 'peau'],
      featured: false
    }),
    type: 'video',
    order: 8,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Pourquoi le stress abîme votre corps plus que vous ne l\'imaginez',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock détaille les impacts néfastes du stress.',
      thumbnail: 'https://img.youtube.com/vi/ouz5RZUBJLA/maxresdefault.jpg',
      youtubeId: 'ouz5RZUBJLA',
      duration: '22:10',
      views: 5234,
      likes: 398,
      publishedDate: '2024-12-14',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['stress', 'santé', 'bien-être'],
      featured: true
    }),
    type: 'video',
    order: 9,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Pourquoi la baisse de désir peut toucher tout le monde (et comment réagir)',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock aborde le sujet de la baisse de libido.',
      thumbnail: 'https://img.youtube.com/vi/LE5r8yAnclw/maxresdefault.jpg',
      youtubeId: 'LE5r8yAnclw',
      duration: '19:35',
      views: 4567,
      likes: 334,
      publishedDate: '2024-12-12',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['libido', 'désir', 'santé'],
      featured: false
    }),
    type: 'video',
    order: 10,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Muguet, fesses rouges, coliques… Et si c\'était la candidose ?',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les symptômes de la candidose.',
      thumbnail: 'https://img.youtube.com/vi/FE0eQtsm_Jk/maxresdefault.jpg',
      youtubeId: 'FE0eQtsm_Jk',
      duration: '16:40',
      views: 3987,
      likes: 289,
      publishedDate: '2024-12-10',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['candidose', 'mycose', 'symptômes'],
      featured: false
    }),
    type: 'video',
    order: 11,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Douleurs menstruelles : simple malaise ou vraie maladie ?',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock fait la distinction entre les douleurs menstruelles normales et pathologiques.',
      thumbnail: 'https://img.youtube.com/vi/rHwFlRaCENI/maxresdefault.jpg',
      youtubeId: 'rHwFlRaCENI',
      duration: '21:15',
      views: 5678,
      likes: 423,
      publishedDate: '2024-12-08',
      category: 'Gynécologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['menstruelles', 'douleurs', 'santé'],
      featured: true
    }),
    type: 'video',
    order: 12,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Douleur au dos qui descend dans la jambe ? Attention à la sciatique !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes de la sciatique.',
      thumbnail: 'https://img.youtube.com/vi/HjQYuzfiQWM/maxresdefault.jpg',
      youtubeId: 'HjQYuzfiQWM',
      duration: '17:50',
      views: 4789,
      likes: 356,
      publishedDate: '2024-12-06',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['sciatique', 'dos', 'douleur'],
      featured: false
    }),
    type: 'video',
    order: 13,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Crise hémorroïdaire : 5 erreurs qui aggravent la douleur + 3 solutions rapides',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock détaille les erreurs courantes lors des crises hémorroïdaires.',
      thumbnail: 'https://img.youtube.com/vi/kZ62K07kX_Y/maxresdefault.jpg',
      youtubeId: 'kZ62K07kX_Y',
      duration: '14:25',
      views: 5234,
      likes: 387,
      publishedDate: '2024-12-04',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['hémorroïdes', 'douleur', 'solutions'],
      featured: false
    }),
    type: 'video',
    order: 14,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Crise d\'eczéma : comprendre, soulager et prévenir',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les mécanismes de l\'eczéma.',
      thumbnail: 'https://img.youtube.com/vi/6qtnyl_Zzvk/maxresdefault.jpg',
      youtubeId: '6qtnyl_Zzvk',
      duration: '18:30',
      views: 4567,
      likes: 312,
      publishedDate: '2024-12-02',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['eczéma', 'dermatologie', 'peau'],
      featured: true
    }),
    type: 'video',
    order: 15,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Gencives qui saignent ? Attention à la gingivite !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock alerte sur les signes de gingivite.',
      thumbnail: 'https://img.youtube.com/vi/01ag-EReOwg/maxresdefault.jpg',
      youtubeId: '01ag-EReOwg',
      duration: '15:45',
      views: 3890,
      likes: 267,
      publishedDate: '2024-11-30',
      category: 'Médecine Dentaire',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['gingivite', 'gencives', 'dentaire'],
      featured: false
    }),
    type: 'video',
    order: 16,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Démangeaisons, pertes blanches ? Et si c\'était une mycose vaginale ?',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les symptômes de la mycose vaginale.',
      thumbnail: 'https://img.youtube.com/vi/pSZvJuhXZcQ/maxresdefault.jpg',
      youtubeId: 'pSZvJuhXZcQ',
      duration: '16:20',
      views: 6789,
      likes: 498,
      publishedDate: '2024-11-28',
      category: 'Gynécologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['mycose', 'vaginale', 'diagnostic'],
      featured: true
    }),
    type: 'video',
    order: 17,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Diabète : 7 signes qui doivent t\'alerter ! (Même si tu te sens bien)',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock détaille les 7 signes précurseurs du diabète.',
      thumbnail: 'https://img.youtube.com/vi/_0gFoNXwWpE/maxresdefault.jpg',
      youtubeId: '_0gFoNXwWpE',
      duration: '20:15',
      views: 8923,
      likes: 634,
      publishedDate: '2024-11-26',
      category: 'Endocrinologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['diabète', 'signes', 'dépistage'],
      featured: true
    }),
    type: 'video',
    order: 18,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Cystite : brûlures, envies pressantes ? Ce que tu dois savoir !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes de la cystite.',
      thumbnail: 'https://img.youtube.com/vi/jNBwBOoWRbM/maxresdefault.jpg',
      youtubeId: 'jNBwBOoWRbM',
      duration: '17:40',
      views: 7567,
      likes: 523,
      publishedDate: '2024-11-24',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['cystite', 'brûlures', 'urinaire'],
      featured: false
    }),
    type: 'video',
    order: 19,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Habitudes simples pour garder les reins en bonne santé !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock partage des conseils pour préserver la santé rénale.',
      thumbnail: 'https://img.youtube.com/vi/n5ST7c4xRvQ/maxresdefault.jpg',
      youtubeId: 'n5ST7c4xRvQ',
      duration: '19:25',
      views: 6234,
      likes: 412,
      publishedDate: '2024-11-22',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['reins', 'santé', 'prévention'],
      featured: false
    }),
    type: 'video',
    order: 20,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Tu as de l\'acné ? Voici ce que personne ne te dit !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock révèle les vraies causes de l\'acné.',
      thumbnail: 'https://img.youtube.com/vi/rvsRSAQx4CU/maxresdefault.jpg',
      youtubeId: 'rvsRSAQx4CU',
      duration: '18:55',
      views: 8345,
      likes: 587,
      publishedDate: '2024-11-20',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['acné', 'peau', 'dermatologie'],
      featured: true
    }),
    type: 'video',
    order: 21,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Carie dentaire : causes, symptômes et prévention | Protégez vos dents !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes des caries dentaires.',
      thumbnail: 'https://img.youtube.com/vi/alHZR3bks2Q/maxresdefault.jpg',
      youtubeId: 'alHZR3bks2Q',
      duration: '15:30',
      views: 7123,
      likes: 456,
      publishedDate: '2024-11-18',
      category: 'Médecine Dentaire',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['carie', 'dentaire', 'prévention'],
      featured: false
    }),
    type: 'video',
    order: 22,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Asthme : Causes, Symptômes et Solutions pour Mieux Respirer !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock détaille les causes de l\'asthme.',
      thumbnail: 'https://img.youtube.com/vi/H-0bNOdT3VI/maxresdefault.jpg',
      youtubeId: 'H-0bNOdT3VI',
      duration: '21:45',
      views: 9456,
      likes: 678,
      publishedDate: '2024-11-16',
      category: 'Pneumologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['asthme', 'respiration', 'poumons'],
      featured: true
    }),
    type: 'video',
    order: 23,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Bouffées de Chaleur : Causes, Solutions et Astuces pour Mieux les Vivre !',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes des bouffées de chaleur.',
      thumbnail: 'https://img.youtube.com/vi/fcg1JwLWkkw/maxresdefault.jpg',
      youtubeId: 'fcg1JwLWkkw',
      duration: '19:20',
      views: 8234,
      likes: 543,
      publishedDate: '2024-11-14',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['bouffées', 'chaleur', 'ménopause'],
      featured: false
    }),
    type: 'video',
    order: 24,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Douleur au Pied : Comment Soulager l\'Aponévrosite Plantaire Rapidement ?',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock explique l\'aponévrosite plantaire.',
      thumbnail: 'https://img.youtube.com/vi/9Qsp5BLAh_c/maxresdefault.jpg',
      youtubeId: '9Qsp5BLAh_c',
      duration: '16:50',
      views: 6789,
      likes: 423,
      publishedDate: '2024-11-12',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['aponévrosite', 'pied', 'douleur'],
      featured: false
    }),
    type: 'video',
    order: 25,
    metadata: {},
    isActive: true
  },
  {
    pageId: 'videos',
    title: 'Les différents types d\'alopécie et solutions de traitement',
    content: JSON.stringify({
      description: 'Le Docteur Lionel Ozounguet Fock présente les différents types d\'alopécie.',
      thumbnail: 'https://img.youtube.com/vi/VyXLwvmlugM/maxresdefault.jpg',
      youtubeId: 'VyXLwvmlugM',
      duration: '22:15',
      views: 7654,
      likes: 598,
      publishedDate: '2024-11-10',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      tags: ['alopécie', 'cheveux', 'dermatologie'],
      featured: true
    }),
    type: 'video',
    order: 26,
    metadata: {},
    isActive: true
  }
];

async function insertMocks() {
  let client;
  try {
    console.log('🔌 Connexion à MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('pageMocks');

    // Supprimer les anciens mocks pour ces pages
    const pageIds = ['communiques', 'articles', 'commissions', 'decisions', 'decrets', 'lois', 'photos', 'theses', 'trouver-pharmacie', 'videos'];
    console.log('🗑️  Suppression des anciens mocks...');
    await collection.deleteMany({ pageId: { $in: pageIds } });
    console.log('✅ Anciens mocks supprimés');

    // Insérer les mocks des pages Ressources (1 par page)
    console.log('📝 Insertion des mocks Ressources...');
    const resultRessources = await collection.insertMany(ressourcesMocks);
    console.log(`✅ ${resultRessources.insertedCount} mocks Ressources insérés`);

    // Insérer les 26 vidéos
    console.log('📹 Insertion des 26 vidéos...');
    const resultVideos = await collection.insertMany(videosMocks);
    console.log(`✅ ${resultVideos.insertedCount} vidéos insérées`);

    console.log('\n🎉 Tous les mocks ont été insérés avec succès !');
    console.log(`📊 Total: ${resultRessources.insertedCount + resultVideos.insertedCount} mocks`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

insertMocks();



