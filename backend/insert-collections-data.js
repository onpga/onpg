/**
 * Script pour insérer les données initiales dans les collections MongoDB
 * Chaque page Resources a sa propre collection avec 1 seule donnée (sauf videos qui a 26)
 */

const { MongoClient } = require('mongodb');

// URI MongoDB forcée en dur (Railway)
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

// Données pour chaque collection (1 seule donnée sauf videos)
const collectionsData = {
  actualites: {
    title: 'Nouveau décret sur la dispensation des médicaments en officine',
    excerpt: 'Le ministre de la Santé annonce de nouvelles mesures concernant la dispensation des médicaments en officine pharmaceutique. Ces changements visent à améliorer la sécurité des patients et optimiser les pratiques professionnelles.',
    content: '<p>Le ministre de la Santé annonce de nouvelles mesures concernant la dispensation des médicaments en officine pharmaceutique. Ces changements visent à améliorer la sécurité des patients et optimiser les pratiques professionnelles.</p><p>Les nouvelles réglementations entreront en vigueur dès le 1er mars 2024 et concerneront toutes les officines du territoire gabonais.</p>',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
    category: 'actualites',
    pole: 'Général',
    date: '2024-01-15',
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 5,
    tags: ['décret', 'dispensation', 'médicaments', 'sécurité'],
    featured: true,
    author: {
      name: 'Dr. Marie Dupont',
      role: 'Présidente de l\'ONPG'
    },
    isActive: true,
    order: 1
  },

  articles: {
    title: 'L\'avenir de la pharmacie au Gabon : perspectives et défis',
    excerpt: 'Analyse approfondie des enjeux de la profession pharmaceutique au Gabon et des perspectives d\'évolution.',
    content: '<p>La profession pharmaceutique au Gabon connaît une transformation majeure avec l\'intégration des nouvelles technologies et l\'évolution des besoins de santé publique.</p><p>Cette analyse présente les défis actuels et les opportunités futures pour les pharmaciens gabonais.</p>',
    authors: ['Dr. Marie Dubois'],
    abstract: 'Analyse approfondie des enjeux de la profession pharmaceutique au Gabon et des perspectives d\'évolution.',
    journal: 'Revue Pharmaceutique Gabonaise',
    year: 2024,
    keywords: ['pharmacie', 'Gabon', 'avenir', 'technologie'],
    category: 'Recherche',
    downloads: 0,
    citations: 0,
    featured: false,
    language: 'fr',
    publicationType: 'article',
    isActive: true,
    order: 1
  },

  communiques: {
    title: 'Communiqué de presse : Nouveau protocole de sécurité médicamenteuse',
    reference: 'CP-2024-001',
    date: '2024-01-15',
    type: 'presse',
    category: 'Sécurité',
    excerpt: 'L\'ONPG annonce un nouveau protocole révolutionnaire pour renforcer la sécurité médicamenteuse dans les officines gabonaises.',
    content: '<p>L\'ONPG, en collaboration avec le Ministère de la Santé, présente aujourd\'hui un nouveau protocole de sécurité médicamenteuse qui vise à élever les standards de qualité et de sécurité dans toutes les officines du Gabon.</p>',
    urgent: false,
    featured: false,
    isActive: true,
    order: 1
  },

  decisions: {
    title: 'Décision relative à l\'inscription au tableau de l\'Ordre',
    reference: 'DEC-2024-001',
    date: '2024-01-20',
    jurisdiction: 'Conseil National de l\'Ordre',
    category: 'Inscription',
    summary: 'Le Conseil National décide de l\'inscription au tableau de l\'Ordre d\'un pharmacien titulaire d\'un diplôme étranger.',
    decision: 'favorable',
    parties: ['Pharmacien demandeur', 'Conseil National'],
    keywords: ['inscription', 'tableau', 'ordre'],
    downloads: 0,
    citations: 0,
    featured: false,
    isActive: true,
    order: 1
  },

  decrets: {
    title: 'Décret n°2024-001 relatif à l\'exercice de la pharmacie',
    number: '2024-001',
    publicationDate: '2024-01-10',
    entryDate: '2024-01-10',
    ministry: 'Ministère de la Santé et des Affaires Sociales',
    category: 'Réglementation',
    summary: 'Décret fixant les conditions d\'exercice de la profession pharmaceutique au Gabon.',
    keyArticles: ['Article 1', 'Article 2', 'Article 3'],
    tags: ['décret', 'exercice', 'pharmacie'],
    status: 'active',
    downloads: 0,
    views: 0,
    featured: false,
    language: 'fr',
    isActive: true,
    order: 1
  },

  lois: {
    title: 'Loi n°2024-001 sur l\'Ordre National des Pharmaciens',
    number: '2024-001',
    publicationDate: '2024-01-05',
    entryDate: '2024-01-05',
    category: 'Législation',
    summary: 'Loi portant création et organisation de l\'Ordre National des Pharmaciens du Gabon.',
    tableOfContents: [
      { title: 'Titre I - Dispositions générales', articles: ['Article 1', 'Article 2'] },
      { title: 'Titre II - Organisation', articles: ['Article 3', 'Article 4'] }
    ],
    keyArticles: ['Article 1', 'Article 5', 'Article 10'],
    tags: ['loi', 'ordre', 'pharmaciens'],
    status: 'active',
    downloads: 0,
    views: 0,
    featured: false,
    language: 'fr',
    isActive: true,
    order: 1
  },

  commissions: {
    title: 'Commission de Formation Continue',
    name: 'Commission de Formation Continue',
    description: 'Commission chargée de l\'organisation et du suivi de la formation continue des pharmaciens.',
    president: 'Dr. Alain Moreau',
    members: ['Dr. Marie Dupont', 'Dr. Jean Martin', 'Dr. Sophie Bernard', 'Dr. Pierre Dubois'],
    creationDate: '2023-01-01',
    category: 'Formation',
    missions: ['Organisation des formations', 'Validation des programmes', 'Suivi des participants'],
    meetings: 12,
    reports: 4,
    status: 'active',
    featured: false,
    isActive: true,
    order: 1
  },

  theses: {
    title: 'Étude sur la pharmacovigilance au Gabon',
    author: 'Dr. Jean Martin',
    director: 'Pr. Marie Dubois',
    university: 'Université Omar Bongo',
    faculty: 'Faculté de Médecine',
    department: 'Pharmacie',
    degree: 'phd',
    year: 2024,
    abstract: 'Thèse de doctorat portant sur l\'analyse du système de pharmacovigilance au Gabon et les améliorations possibles.',
    keywords: ['pharmacovigilance', 'Gabon', 'sécurité médicamenteuse'],
    pages: 250,
    language: 'fr',
    specialty: 'Pharmacie',
    defenseDate: '2024-06-15',
    juryMembers: ['Pr. Marie Dubois', 'Pr. Alain Moreau', 'Dr. Sophie Bernard'],
    downloads: 0,
    citations: 0,
    featured: false,
    isActive: true,
    order: 1
  },

  photos: {
    title: 'Congrès National 2024',
    description: 'Photos du 15ème Congrès National des Pharmaciens du Gabon',
    image: 'https://res.cloudinary.com/dduvinjnu/image/upload/v1/onpg/photos/congres-2024',
    thumbnail: 'https://res.cloudinary.com/dduvinjnu/image/upload/v1/onpg/photos/congres-2024',
    album: 'Congrès National 2024',
    date: '2024-01-15',
    tags: ['congrès', 'événement', 'pharmaciens'],
    category: 'Événements',
    photographer: 'Service Communication ONPG',
    location: 'Libreville, Gabon',
    downloads: 0,
    likes: 0,
    featured: true,
    orientation: 'landscape',
    colors: [],
    isActive: true,
    order: 1
  },

  videos: [
    {
      title: 'Ordre National de Pharmacie du Gabon - Mission et Organisation',
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
      featured: true,
      isActive: true,
      order: 1
    },
    {
      title: 'Formation Continue - Actualisation des Compétences Pharmaceutiques',
      description: 'Programme de formation continue obligatoire pour les pharmaciens du Gabon. Découvrez les nouvelles exigences et opportunités.',
      thumbnail: 'https://img.youtube.com/vi/wffHcFlZi4Y/maxresdefault.jpg',
      youtubeId: 'wffHcFlZi4Y',
      duration: '22:45',
      views: 1923,
      likes: 98,
      publishedDate: '2024-12-10',
      category: 'Formation Continue',
      speaker: 'Dr. Formation ONPG',
      event: 'Séminaire Formation 2024',
      tags: ['formation', 'continue', 'compétences', 'DPC', 'obligation'],
      featured: true,
      isActive: true,
      order: 2
    },
    {
      title: 'Réglementation Pharmaceutique - Mise à jour 2024',
      description: 'Évolution de la législation pharmaceutique au Gabon. Nouvelles réglementations, sanctions et bonnes pratiques.',
      thumbnail: 'https://img.youtube.com/vi/e6p7SoO1NNg/maxresdefault.jpg',
      youtubeId: 'e6p7SoO1NNg',
      duration: '28:20',
      views: 1567,
      likes: 87,
      publishedDate: '2024-12-05',
      category: 'Réglementation',
      speaker: 'Juriste ONPG',
      event: 'Journée Réglementaire 2024',
      tags: ['réglementation', 'loi', 'sanctions', 'bonnes pratiques'],
      featured: false,
      isActive: true,
      order: 3
    },
    {
      title: 'Innovation Technologique en Pharmacie Gabonaise',
      description: 'Découvrez les dernières innovations technologiques adoptées par les pharmacies gabonaises : digitalisation, e-prescription, télémédecine.',
      thumbnail: 'https://img.youtube.com/vi/U40yBCKlJqw/maxresdefault.jpg',
      youtubeId: 'U40yBCKlJqw',
      duration: '25:15',
      views: 2134,
      likes: 142,
      publishedDate: '2024-11-28',
      category: 'Innovation',
      speaker: 'Directeur Innovation ONPG',
      event: 'Forum Innovation Pharma 2024',
      tags: ['innovation', 'digital', 'technologie', 'e-prescription', 'télémédecine'],
      featured: true,
      isActive: true,
      order: 4
    },
    {
      title: 'Éthique et Déontologie Pharmaceutique',
      description: 'Principes éthiques et déontologiques de la profession pharmaceutique au Gabon. Code de conduite et responsabilités.',
      thumbnail: 'https://img.youtube.com/vi/U40yBCKlJqw/maxresdefault.jpg',
      youtubeId: 'U40yBCKlJqw',
      duration: '31:40',
      views: 1789,
      likes: 113,
      publishedDate: '2024-11-20',
      category: 'Éthique',
      speaker: 'Commission Éthique ONPG',
      event: 'Colloque Éthique 2024',
      tags: ['éthique', 'déontologie', 'code conduite', 'responsabilité', 'profession'],
      featured: false,
      isActive: true,
      order: 5
    },
    {
      title: 'Ne donnez jamais de miel à un bébé de moins d\'un an ! Voici pourquoi…',
      description: 'Découvrez pourquoi il est dangereux de donner du miel aux bébés de moins d\'un an. Risques, conséquences et conseils de santé infantile.',
      thumbnail: 'https://img.youtube.com/vi/b7mwmuAhAv4/maxresdefault.jpg',
      youtubeId: 'b7mwmuAhAv4',
      duration: '12:30',
      views: 3456,
      likes: 234,
      publishedDate: '2024-12-20',
      category: 'Pédiatrie',
      speaker: 'Docteur Pédiatre ONPG',
      event: 'Campagne Santé Infantile 2024',
      tags: ['bébé', 'miel', 'pédiatrie', 'santé', 'risques', 'alimentation'],
      featured: true,
      isActive: true,
      order: 6
    },
    {
      title: 'Le sommeil, c\'est la vie : Comment le réparer',
      description: 'Conseils pratiques du Docteur Lionel Ozounguet Fock sur les troubles du sommeil : diagnostic, traitement et prévention.',
      thumbnail: 'https://img.youtube.com/vi/ea_OR1rZwzk/maxresdefault.jpg',
      youtubeId: 'ea_OR1rZwzk',
      duration: '18:45',
      views: 4123,
      likes: 312,
      publishedDate: '2024-12-18',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Conférence Sommeil et Santé 2024',
      tags: ['sommeil', 'troubles', 'diagnostic', 'traitement', 'prévention', 'santé'],
      featured: true,
      isActive: true,
      order: 7
    },
    {
      title: 'Taches sombres persistantes ? Le mélasma pourrait être la cause. Voici comment unifier votre peau !',
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes du mélasma et donne des conseils pratiques pour unifier le teint de la peau.',
      thumbnail: 'https://img.youtube.com/vi/svPh3zMP8lU/maxresdefault.jpg',
      youtubeId: 'svPh3zMP8lU',
      duration: '15:20',
      views: 3876,
      likes: 267,
      publishedDate: '2024-12-16',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Dermatologique 2024',
      tags: ['mélasma', 'taches', 'peau', 'dermatologie', 'teint', 'unification'],
      featured: false,
      isActive: true,
      order: 8
    },
    {
      title: 'Pourquoi le stress abîme votre corps plus que vous ne l\'imaginez',
      description: 'Le Docteur Lionel Ozounguet Fock détaille les impacts néfastes du stress sur l\'organisme et propose des solutions pour le gérer.',
      thumbnail: 'https://img.youtube.com/vi/ouz5RZUBJLA/maxresdefault.jpg',
      youtubeId: 'ouz5RZUBJLA',
      duration: '22:10',
      views: 5234,
      likes: 398,
      publishedDate: '2024-12-14',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Séminaire Stress et Santé 2024',
      tags: ['stress', 'santé', 'organisme', 'gestion', 'bien-être', 'prévention'],
      featured: true,
      isActive: true,
      order: 9
    },
    {
      title: 'Pourquoi la baisse de désir peut toucher tout le monde (et comment réagir)',
      description: 'Le Docteur Lionel Ozounguet Fock aborde le sujet délicat de la baisse de libido et donne des conseils médicaux appropriés.',
      thumbnail: 'https://img.youtube.com/vi/LE5r8yAnclw/maxresdefault.jpg',
      youtubeId: 'LE5r8yAnclw',
      duration: '19:35',
      views: 4567,
      likes: 334,
      publishedDate: '2024-12-12',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Médicale Spécialisée 2024',
      tags: ['libido', 'désir', 'santé', 'bien-être', 'conseils', 'médical'],
      featured: false,
      isActive: true,
      order: 10
    },
    {
      title: 'Muguet, fesses rouges, coliques… Et si c\'était la candidose ?',
      description: 'Le Docteur Lionel Ozounguet Fock explique les symptômes de la candidose et donne des conseils pour la prévention et le traitement.',
      thumbnail: 'https://img.youtube.com/vi/FE0eQtsm_Jk/maxresdefault.jpg',
      youtubeId: 'FE0eQtsm_Jk',
      duration: '16:40',
      views: 3987,
      likes: 289,
      publishedDate: '2024-12-10',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Mycologique 2024',
      tags: ['candidose', 'muguet', 'mycose', 'symptômes', 'traitement', 'prévention'],
      featured: false,
      isActive: true,
      order: 11
    },
    {
      title: 'Douleurs menstruelles : simple malaise ou vraie maladie ?',
      description: 'Le Docteur Lionel Ozounguet Fock fait la distinction entre les douleurs menstruelles normales et celles qui nécessitent une consultation médicale.',
      thumbnail: 'https://img.youtube.com/vi/rHwFlRaCENI/maxresdefault.jpg',
      youtubeId: 'rHwFlRaCENI',
      duration: '21:15',
      views: 5678,
      likes: 423,
      publishedDate: '2024-12-08',
      category: 'Gynécologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Journée Santé Féminine 2024',
      tags: ['menstruelles', 'douleurs', 'règles', 'santé', 'féminin', 'diagnostic'],
      featured: true,
      isActive: true,
      order: 12
    },
    {
      title: 'Douleur au dos qui descend dans la jambe ? Attention à la sciatique !',
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes de la sciatique, ses symptômes et les traitements disponibles.',
      thumbnail: 'https://img.youtube.com/vi/HjQYuzfiQWM/maxresdefault.jpg',
      youtubeId: 'HjQYuzfiQWM',
      duration: '17:50',
      views: 4789,
      likes: 356,
      publishedDate: '2024-12-06',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Rhumatologique 2024',
      tags: ['sciatique', 'dos', 'jambe', 'douleur', 'rhumatisme', 'diagnostic'],
      featured: false,
      isActive: true,
      order: 13
    },
    {
      title: 'Crise hémorroïdaire : 5 erreurs qui aggravent la douleur + 3 solutions rapides',
      description: 'Le Docteur Lionel Ozounguet Fock détaille les erreurs courantes lors des crises hémorroïdaires et propose des solutions efficaces pour soulager la douleur.',
      thumbnail: 'https://img.youtube.com/vi/kZ62K07kX_Y/maxresdefault.jpg',
      youtubeId: 'kZ62K07kX_Y',
      duration: '14:25',
      views: 5234,
      likes: 387,
      publishedDate: '2024-12-04',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Proctologique 2024',
      tags: ['hémorroïdes', 'douleur', 'crise', 'solutions', 'traitement', 'prévention'],
      featured: false,
      isActive: true,
      order: 14
    },
    {
      title: 'Crise d\'eczéma : comprendre, soulager et prévenir',
      description: 'Le Docteur Lionel Ozounguet Fock explique les mécanismes de l\'eczéma, les méthodes de soulagement et les stratégies de prévention efficaces.',
      thumbnail: 'https://img.youtube.com/vi/6qtnyl_Zzvk/maxresdefault.jpg',
      youtubeId: '6qtnyl_Zzvk',
      duration: '18:30',
      views: 4567,
      likes: 312,
      publishedDate: '2024-12-02',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Séminaire Dermatologique 2024',
      tags: ['eczéma', 'dermatologie', 'peau', 'allergie', 'soulagement', 'prévention'],
      featured: true,
      isActive: true,
      order: 15
    },
    {
      title: 'Gencives qui saignent ? Attention à la gingivite !',
      description: 'Le Docteur Lionel Ozounguet Fock alerte sur les signes de gingivite et donne des conseils pour prévenir et traiter les problèmes de gencives.',
      thumbnail: 'https://img.youtube.com/vi/01ag-EReOwg/maxresdefault.jpg',
      youtubeId: '01ag-EReOwg',
      duration: '15:45',
      views: 3890,
      likes: 267,
      publishedDate: '2024-11-30',
      category: 'Médecine Dentaire',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Journée Santé Buccale 2024',
      tags: ['gingivite', 'gencives', 'saignement', 'dentaire', 'hygiène', 'prévention'],
      featured: false,
      isActive: true,
      order: 16
    },
    {
      title: 'Démangeaisons, pertes blanches ? Et si c\'était une mycose vaginale ?',
      description: 'Le Docteur Lionel Ozounguet Fock explique les symptômes de la mycose vaginale et propose des solutions adaptées pour le diagnostic et le traitement.',
      thumbnail: 'https://img.youtube.com/vi/pSZvJuhXZcQ/maxresdefault.jpg',
      youtubeId: 'pSZvJuhXZcQ',
      duration: '16:20',
      views: 6789,
      likes: 498,
      publishedDate: '2024-11-28',
      category: 'Gynécologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Gynécologique 2024',
      tags: ['mycose', 'vaginale', 'démangeaisons', 'pertes', 'diagnostic', 'traitement'],
      featured: true,
      isActive: true,
      order: 17
    },
    {
      title: 'Diabète : 7 signes qui doivent t\'alerter ! (Même si tu te sens bien)',
      description: 'Le Docteur Lionel Ozounguet Fock détaille les 7 signes précurseurs du diabète, même chez les personnes asymptomatiques, pour un dépistage précoce.',
      thumbnail: 'https://img.youtube.com/vi/_0gFoNXwWpE/maxresdefault.jpg',
      youtubeId: '_0gFoNXwWpE',
      duration: '20:15',
      views: 8923,
      likes: 634,
      publishedDate: '2024-11-26',
      category: 'Endocrinologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Journée Diabète et Prévention 2024',
      tags: ['diabète', 'signes', 'alerte', 'dépistage', 'prévention', 'endocrinologie'],
      featured: true,
      isActive: true,
      order: 18
    },
    {
      title: 'Cystite : brûlures, envies pressantes ? Ce que tu dois savoir !',
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes de la cystite, ses symptômes caractéristiques et les méthodes de prévention et traitement.',
      thumbnail: 'https://img.youtube.com/vi/jNBwBOoWRbM/maxresdefault.jpg',
      youtubeId: 'jNBwBOoWRbM',
      duration: '17:40',
      views: 7567,
      likes: 523,
      publishedDate: '2024-11-24',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Urologique 2024',
      tags: ['cystite', 'brûlures', 'envies', 'urinaire', 'infection', 'prévention'],
      featured: false,
      isActive: true,
      order: 19
    },
    {
      title: 'Habitudes simples pour garder les reins en bonne santé !',
      description: 'Le Docteur Lionel Ozounguet Fock partage des conseils pratiques et des habitudes quotidiennes pour préserver la santé rénale et prévenir les maladies.',
      thumbnail: 'https://img.youtube.com/vi/n5ST7c4xRvQ/maxresdefault.jpg',
      youtubeId: 'n5ST7c4xRvQ',
      duration: '19:25',
      views: 6234,
      likes: 412,
      publishedDate: '2024-11-22',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Semaine Santé Rénale 2024',
      tags: ['reins', 'santé', 'habitudes', 'prévention', 'néphrologie', 'bien-être'],
      featured: false,
      isActive: true,
      order: 20
    },
    {
      title: 'Tu as de l\'acné ? Voici ce que personne ne te dit !',
      description: 'Le Docteur Lionel Ozounguet Fock révèle les vraies causes de l\'acné et donne des conseils pratiques pour une peau saine au-delà des traitements classiques.',
      thumbnail: 'https://img.youtube.com/vi/rvsRSAQx4CU/maxresdefault.jpg',
      youtubeId: 'rvsRSAQx4CU',
      duration: '18:55',
      views: 8345,
      likes: 587,
      publishedDate: '2024-11-20',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Atelier Peau et Acné 2024',
      tags: ['acné', 'peau', 'dermatologie', 'causes', 'traitement', 'prévention'],
      featured: true,
      isActive: true,
      order: 21
    },
    {
      title: 'Carie dentaire : causes, symptômes et prévention | Protégez vos dents !',
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes des caries dentaires, leurs symptômes et donne des conseils pratiques pour une prévention efficace.',
      thumbnail: 'https://img.youtube.com/vi/alHZR3bks2Q/maxresdefault.jpg',
      youtubeId: 'alHZR3bks2Q',
      duration: '15:30',
      views: 7123,
      likes: 456,
      publishedDate: '2024-11-18',
      category: 'Médecine Dentaire',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Journée Prévention Dentaire 2024',
      tags: ['carie', 'dentaire', 'dents', 'prévention', 'hygiène', 'symptômes'],
      featured: false,
      isActive: true,
      order: 22
    },
    {
      title: 'Asthme : Causes, Symptômes et Solutions pour Mieux Respirer !',
      description: 'Le Docteur Lionel Ozounguet Fock détaille les causes de l\'asthme, ses symptômes caractéristiques et les solutions thérapeutiques pour mieux contrôler la maladie.',
      thumbnail: 'https://img.youtube.com/vi/H-0bNOdT3VI/maxresdefault.jpg',
      youtubeId: 'H-0bNOdT3VI',
      duration: '21:45',
      views: 9456,
      likes: 678,
      publishedDate: '2024-11-16',
      category: 'Pneumologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Forum Asthme et Allergies 2024',
      tags: ['asthme', 'respiration', 'poumons', 'allergies', 'traitement', 'prévention'],
      featured: true,
      isActive: true,
      order: 23
    },
    {
      title: 'Bouffées de Chaleur : Causes, Solutions et Astuces pour Mieux les Vivre !',
      description: 'Le Docteur Lionel Ozounguet Fock explique les causes des bouffées de chaleur et propose des solutions naturelles et médicales pour les soulager efficacement.',
      thumbnail: 'https://img.youtube.com/vi/fcg1JwLWkkw/maxresdefault.jpg',
      youtubeId: 'fcg1JwLWkkw',
      duration: '19:20',
      views: 8234,
      likes: 543,
      publishedDate: '2024-11-14',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Séminaire Ménopause et Santé 2024',
      tags: ['bouffées', 'chaleur', 'ménopause', 'symptômes', 'soulagement', 'solutions'],
      featured: false,
      isActive: true,
      order: 24
    },
    {
      title: 'Douleur au Pied : Comment Soulager l\'Aponévrosite Plantaire Rapidement ?',
      description: 'Le Docteur Lionel Ozounguet Fock explique l\'aponévrosite plantaire, ses causes et propose des méthodes efficaces pour soulager rapidement la douleur.',
      thumbnail: 'https://img.youtube.com/vi/9Qsp5BLAh_c/maxresdefault.jpg',
      youtubeId: '9Qsp5BLAh_c',
      duration: '16:50',
      views: 6789,
      likes: 423,
      publishedDate: '2024-11-12',
      category: 'Médecine Générale',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Consultation Podologique 2024',
      tags: ['aponévrosite', 'plantaire', 'pied', 'douleur', 'talon', 'traitement'],
      featured: false,
      isActive: true,
      order: 25
    },
    {
      title: 'Les différents types d\'alopécie et solutions de traitement',
      description: 'Le Docteur Lionel Ozounguet Fock présente les différents types d\'alopécie, leurs causes et les solutions thérapeutiques disponibles pour chaque cas.',
      thumbnail: 'https://img.youtube.com/vi/VyXLwvmlugM/maxresdefault.jpg',
      youtubeId: 'VyXLwvmlugM',
      duration: '22:15',
      views: 7654,
      likes: 598,
      publishedDate: '2024-11-10',
      category: 'Dermatologie',
      speaker: 'Docteur Lionel Ozounguet Fock',
      event: 'Colloque Alopécie et Cheveux 2024',
      tags: ['alopécie', 'cheveux', 'chute', 'dermatologie', 'traitement', 'solutions'],
      featured: true,
      isActive: true,
      order: 26
    }
  ]
};

async function insertData() {
  let client;
  try {
    console.log('🔌 Connexion à MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);
    let totalInserted = 0;

    // Insérer les données pour chaque collection (1 seule donnée sauf videos)
    for (const [collectionName, data] of Object.entries(collectionsData)) {
      console.log(`\n📝 Traitement de la collection: ${collectionName}`);
      
      // Supprimer les anciennes données
      await db.collection(collectionName).deleteMany({});
      console.log(`   🗑️  Anciennes données supprimées`);

      // Insérer les nouvelles données
      if (collectionName === 'videos') {
        // Videos : insérer toutes les vidéos
        const result = await db.collection(collectionName).insertMany(
          data.map(item => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        );
        console.log(`   ✅ ${result.insertedCount} vidéos insérées`);
        totalInserted += result.insertedCount;
      } else {
        // Autres collections : 1 seule donnée
        const result = await db.collection(collectionName).insertOne({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`   ✅ 1 donnée insérée`);
        totalInserted += 1;
      }
    }

    console.log('\n🎉 Toutes les données ont été insérées avec succès !');
    console.log(`📊 Total: ${totalInserted} documents insérés`);
    console.log('\n📋 Collections créées:');
    console.log('   - actualites (1 document)');
    console.log('   - articles (1 document)');
    console.log('   - communiques (1 document)');
    console.log('   - decisions (1 document)');
    console.log('   - decrets (1 document)');
    console.log('   - lois (1 document)');
    console.log('   - commissions (1 document)');
    console.log('   - theses (1 document)');
    console.log('   - photos (1 document)');
    console.log('   - videos (26 documents)');

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

insertData();

