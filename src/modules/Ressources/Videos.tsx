import React, { useState, useEffect, useMemo } from 'react';
import './Videos.css';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  duration: string;
  views: number;
  likes: number;
  publishedDate: string;
  category: string;
  speaker: string;
  event?: string;
  tags: string[];
  featured?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videos: Video[];
  category: string;
  featured?: boolean;
}

// Vidéos réelles de l'ONPG du Gabon et chaîne Obeta Tv Info
const mockVideos: Video[] = [
  {
    id: '1',
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
    featured: true
  },
  {
    id: '2',
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
    featured: true
  },
  {
    id: '3',
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
    featured: false
  },
  {
    id: '4',
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
    featured: true
  },
  {
    id: '5',
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
    featured: false
  },
  {
    id: '6',
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
    featured: true
  },
  {
    id: '7',
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
    featured: true
  },
  {
    id: '8',
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
    featured: false
  },
  {
    id: '9',
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
    featured: true
  },
  {
    id: '15',
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
    featured: false
  },
  {
    id: '16',
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
    featured: false
  },
  {
    id: '17',
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
    featured: true
  },
  {
    id: '18',
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
    featured: false
  },
  {
    id: '19',
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
    featured: false
  },
  {
    id: '20',
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
    featured: true
  },
  {
    id: '21',
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
    featured: false
  },
  {
    id: '22',
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
    featured: true
  },
  {
    id: '23',
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
    featured: true
  },
  {
    id: '24',
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
    featured: false
  },
  {
    id: '25',
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
    featured: false
  },
  {
    id: '26',
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
    featured: true
  },
  {
    id: '27',
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
    featured: false
  },
  {
    id: '28',
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
    featured: true
  },
  {
    id: '29',
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
    featured: false
  },
  {
    id: '30',
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
    featured: false
  },
  {
    id: '31',
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
    featured: true
  }
];

const mockPlaylists: Playlist[] = [
  {
    id: '1',
    title: 'ONPG - Présentation Institutionnelle',
    description: 'Découvrez l\'Ordre National de Pharmacie du Gabon : missions, organisation et rôle dans la profession',
    thumbnail: 'https://img.youtube.com/vi/5tG0sc39-dg/maxresdefault.jpg',
    videos: mockVideos.filter(v => v.category === 'Institution'),
    category: 'Institution',
    featured: true
  },
  {
    id: '2',
    title: 'Formation Continue Obligatoire 2024',
    description: 'Programme complet de formation continue pour les pharmaciens du Gabon - DPC et actualisation',
    thumbnail: 'https://img.youtube.com/vi/wffHcFlZi4Y/maxresdefault.jpg',
    videos: mockVideos.filter(v => v.category === 'Formation Continue'),
    category: 'Formation Continue',
    featured: true
  },
  {
    id: '3',
    title: 'Réglementation et Éthique Pharmaceutique',
    description: 'Cadre réglementaire, éthique professionnelle et déontologie pharmaceutique au Gabon',
    thumbnail: 'https://img.youtube.com/vi/e6p7SoO1NNg/maxresdefault.jpg',
    videos: mockVideos.filter(v => ['Réglementation', 'Éthique'].includes(v.category)),
    category: 'Réglementation',
    featured: false
  },
  {
    id: '4',
    title: 'Innovation et Digital en Pharmacie',
    description: 'Transformation digitale et innovations technologiques dans les pharmacies gabonaises',
    thumbnail: 'https://img.youtube.com/vi/U40yBCKlJqw/maxresdefault.jpg',
    videos: mockVideos.filter(v => ['Innovation', 'Digital'].includes(v.category)),
    category: 'Innovation',
    featured: false
  },
];

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(mockVideos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [viewMode, setViewMode] = useState<'videos' | 'playlists'>('videos');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');

  const stats = useMemo(() => ({
    totalVideos: videos.length,
    totalViews: videos.reduce((sum, video) => sum + video.views, 0),
    totalLikes: videos.reduce((sum, video) => sum + video.likes, 0)
  }), [videos]);

  const categories = useMemo(() => {
    const cats = ['Toutes', ...new Set(videos.map(v => v.category))];
    return cats;
  }, [videos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterVideos();
  };

  const filterVideos = () => {
    let filtered = videos;

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.speaker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'Toutes') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredVideos(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Toutes');
    setSortBy('date');
    setFilteredVideos(videos);
  };

  const openPlayer = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const closePlayer = () => {
    setSelectedVideo(null);
    setIsPlayerOpen(false);
  };

  useEffect(() => {
    filterVideos();
  }, [searchQuery, selectedCategory, sortBy, videos]);

  const formatDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(':');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="videos-page">
      {/* Hero Section avec effets glass */}
      <div className="videos-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎥</span>
            <span className="badge-text">Vidéothèque ONPG</span>
          </div>

          <h1 className="hero-title">
            Découvrez notre collection de
            <span className="highlight"> vidéos éducatives</span>
          </h1>

          <p className="hero-subtitle">
            Formations continues, conférences exclusives, expertises partagées.
            Accédez à plus de {stats.totalVideos} vidéos pour perfectionner vos compétences.
          </p>

          <div className="hero-actions">
            <button className="btn-primary-glass">
              <span className="btn-icon">▶️</span>
              Explorer les vidéos
            </button>
            <button className="btn-secondary-glass">
              <span className="btn-icon">📋</span>
              Voir les playlists
            </button>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floating-element elem-1">🎓</div>
          <div className="floating-element elem-2">💊</div>
          <div className="floating-element elem-3">🔬</div>
          <div className="floating-element elem-4">📊</div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="videos-content">
        {/* Contenu principal uniquement */}

        {/* Contenu principal */}
        <main className="videos-main">
          {viewMode === 'playlists' ? (
            /* Vue Playlists */
            <div className="playlists-view">
              <div className="content-header">
                <h2 className="content-title">Playlists recommandées</h2>
                <p className="content-subtitle">Découvrez nos collections thématiques</p>
              </div>

              <div className="playlists-grid">
                {playlists.map(playlist => (
                  <div key={playlist.id} className={`playlist-card ${playlist.featured ? 'featured' : ''}`}>
                    <div className="playlist-thumbnail">
                      <img src={playlist.thumbnail} alt={playlist.title} />
                      <div className="playlist-overlay">
                        <div className="playlist-badge">
                          {playlist.videos.length} vidéos
                        </div>
                        {playlist.featured && (
                          <div className="featured-badge">⭐</div>
                        )}
                        <button className="playlist-play-btn">
                          <span className="play-icon">▶️</span>
                        </button>
                      </div>
                    </div>
                    <div className="playlist-info">
                      <h3 className="playlist-title">{playlist.title}</h3>
                      <p className="playlist-description">{playlist.description}</p>
                      <div className="playlist-meta">
                        <span className="playlist-category">{playlist.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Vue Vidéos */
            <div className="videos-view">
              <div className="content-header">
                <h2 className="content-title">
                  {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''} disponible{filteredVideos.length > 1 ? 's' : ''}
                </h2>
                <p className="content-subtitle">
                  {searchQuery && `Résultats pour "${searchQuery}"`}
                  {selectedCategory !== 'Toutes' && !searchQuery && `Catégorie: ${selectedCategory}`}
                  {!searchQuery && selectedCategory === 'Toutes' && 'Toutes nos vidéos éducatives'}
                </p>
              </div>

              <div className="videos-grid">
                {filteredVideos.map(video => (
                  <div key={video.id} className={`video-card ${video.featured ? 'featured' : ''}`}>
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <div className="video-overlay">
                        <button
                          className="play-button"
                          onClick={() => openPlayer(video)}
                          aria-label={`Lire ${video.title}`}
                        >
                          <span className="play-icon">▶️</span>
                        </button>
                        <div className="video-duration">{formatDuration(video.duration)}</div>
                        {video.featured && <div className="featured-badge">⭐</div>}
                      </div>
                    </div>

                    <div className="video-content">
                      <h3
                        className="video-title"
                        onClick={() => openPlayer(video)}
                      >
                        {video.title}
                      </h3>
                      <p className="video-description">{video.description}</p>

                      <div className="video-meta">
                        <div className="video-speaker">
                          <span className="speaker-icon">👨‍⚕️</span>
                          {video.speaker}
                        </div>
                        <div className="video-stats">
                          <span className="stat-item">
                            {video.views.toLocaleString()} vues
                          </span>
                          <span className="stat-item">
                            {video.likes} j'aime
                          </span>
                        </div>
                      </div>

                      <div className="video-category">
                        <span className="category-tag">{video.category}</span>
                      </div>

                      {video.event && (
                        <div className="video-event">
                          <span className="event-icon">📅</span>
                          {video.event}
                        </div>
                      )}

                      <div className="video-tags">
                        {video.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="video-tag">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="videos-pagination">
                <button className="pagination-btn prev" disabled>
                  ‹ Précédent
                </button>

                <div className="pagination-numbers">
                  <button className="pagination-number active">1</button>
                </div>

                <button className="pagination-btn next" disabled>
                  Suivant ›
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Player */}
      {isPlayerOpen && selectedVideo && (
        <div className="video-modal-overlay" onClick={closePlayer}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closePlayer}>
              ✕
            </button>

            <div className="video-modal-content">
              <div className="video-player-section">
                <div className="video-player">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="video-info-section">
                <h2 className="video-modal-title">{selectedVideo.title}</h2>
                <p className="video-modal-description">{selectedVideo.description}</p>

                <div className="video-modal-meta">
                  <div className="video-speaker">
                    <strong>Intervenant:</strong> {selectedVideo.speaker}
                  </div>

                  {selectedVideo.event && (
                    <div className="video-event">
                      <strong>Événement:</strong> {selectedVideo.event}
                    </div>
                  )}

                  <div className="video-stats">
                    <span className="stat-item">
                      <span className="stat-icon">👁️</span>
                      {selectedVideo.views.toLocaleString()} vues
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">❤️</span>
                      {selectedVideo.likes} J'aime
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">📅</span>
                      {new Date(selectedVideo.publishedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="video-category">
                    <span className="category-tag">{selectedVideo.category}</span>
                  </div>
                </div>

                <div className="video-tags">
                  {selectedVideo.tags.map(tag => (
                    <span key={tag} className="video-tag">#{tag}</span>
                  ))}
                </div>

                <div className="video-modal-actions">
                  <button className="action-btn primary">
                    <span className="btn-icon">❤️</span>
                    J'aime cette vidéo
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">🔗</span>
                    Partager
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">⬇️</span>
                    Télécharger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;