import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Photos.css';

// Types pour les photos avec plus de détails pour les effets wow
interface Photo {
  id: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  album: string;
  date: string;
  tags: string[];
  photographer?: string;
  location?: string;
  downloads: number;
  likes: number;
  featured: boolean;
  category: string;
  orientation: 'portrait' | 'landscape' | 'square';
  colors: string[];
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  photoCount: number;
  featured: boolean;
  category: string;
  gradient: string;
}

// Données améliorées avec plus de photos et d'effets
const mockAlbums: Album[] = [
  {
    id: 'congres-2024',
    name: '🏥 Congrès National Pharmaciens 2024',
    description: 'Événement majeur rassemblant l\'ensemble de la profession pharmaceutique gabonaise pour trois jours d\'échanges et d\'innovation',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    photoCount: 45,
    featured: true,
    category: 'Événement National',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'formations',
    name: '📚 Formation Continue & Développement',
    description: 'Programme intensif de formation professionnelle pour l\'amélioration des compétences et pratiques pharmaceutiques',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    photoCount: 28,
    featured: false,
    category: 'Formation Professionnelle',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'officines',
    name: '🏪 Visite des Officines Modernes',
    description: 'Découverte exclusive des pharmacies pilotes équipées des dernières technologies de dispensation automatisée',
    coverImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop',
    photoCount: 32,
    featured: true,
    category: 'Innovation Technologique',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'evenements',
    name: '🎓 Cérémonies & Remises de Prix',
    description: 'Moments solennels célébrant l\'excellence professionnelle et les distinctions honorifiques de la pharmacie gabonaise',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    photoCount: 67,
    featured: false,
    category: 'Célébrations Officielles',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'laboratoire',
    name: '🔬 Centre de Recherche Pharmacologique',
    description: 'Visite guidée du laboratoire de pointe spécialisé dans la recherche et le développement de médicaments essentiels',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    photoCount: 38,
    featured: true,
    category: 'Recherche Scientifique',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'equipe',
    name: '👥 Rencontre de l\'Équipe Direction ONPG',
    description: 'Séance de travail stratégique rassemblant les dirigeants et experts de l\'Ordre National des Pharmaciens du Gabon',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    photoCount: 24,
    featured: false,
    category: 'Gouvernance',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 'jpo-2024',
    name: '🎪 Journées Portes Ouvertes 2024',
    description: 'Événement public annuel permettant au grand public de découvrir les métiers de la pharmacie et les services de santé',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
    photoCount: 52,
    featured: true,
    category: 'Sensibilisation Publique',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  }
];

// Photos améliorées avec plus de détails pour les effets wow
const mockPhotos: Photo[] = [
  {
    id: '1',
    title: 'Ouverture du Congrès National',
    description: 'Cérémonie d\'ouverture du 15ème Congrès National des Pharmaciens du Gabon avec discours inaugural',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    album: 'congres-2024',
    date: '2024-01-15',
    tags: ['congrès', 'ouverture', 'cérémonie', 'discours'],
    photographer: 'Jean Dupont',
    location: 'Palais des Congrès, Libreville',
    downloads: 245,
    likes: 89,
    featured: true,
    category: 'Événements',
    orientation: 'landscape',
    colors: ['#2E8B57', '#00A651', '#228B22']
  },
  {
    id: '2',
    title: 'Atelier Formation Technologies',
    description: 'Session pratique interactive sur les nouvelles technologies en pharmacie et dispensation numérique',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    album: 'formations',
    date: '2024-01-12',
    tags: ['formation', 'technologie', 'atelier', 'numérique'],
    photographer: 'Marie Leroy',
    location: 'Centre de Formation ONPG',
    downloads: 156,
    likes: 67,
    featured: false,
    category: 'Formation',
    orientation: 'landscape',
    colors: ['#4169E1', '#0000FF', '#1E90FF']
  },
  {
    id: '3',
    title: 'Officine Moderne Technologique',
    description: 'Espace de dispensation moderne avec technologies avancées et interface digitale innovante',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    album: 'officines',
    date: '2024-01-10',
    tags: ['officine', 'moderne', 'technologie', 'innovation'],
    photographer: 'Pierre Martin',
    location: 'Pharmacie Centrale, Libreville',
    downloads: 198,
    likes: 134,
    featured: true,
    category: 'Infrastructure',
    orientation: 'landscape',
    colors: ['#32CD32', '#228B22', '#006400']
  },
  {
    id: '4',
    title: 'Remise des Diplômes 2024',
    description: 'Cérémonie solennelle de remise des diplômes aux nouveaux pharmaciens diplômés',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
    album: 'evenements',
    date: '2024-01-08',
    tags: ['diplômes', 'cérémonie', 'remise', 'graduation'],
    photographer: 'Sophie Bernard',
    location: 'Université des Sciences de la Santé',
    downloads: 312,
    likes: 201,
    featured: false,
    category: 'Célébrations',
    orientation: 'landscape',
    colors: ['#FFD700', '#FFA500', '#FF8C00']
  },
  {
    id: '5',
    title: 'Laboratoire de Recherche Avancé',
    description: 'Équipements de pointe dans notre laboratoire de recherche pharmacologique',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    album: 'laboratoire',
    date: '2024-01-05',
    tags: ['laboratoire', 'recherche', 'équipement', 'science'],
    photographer: 'Dr. Ahmed Kone',
    location: 'Centre de Recherche ONPG',
    downloads: 278,
    likes: 145,
    featured: true,
    category: 'Recherche',
    orientation: 'landscape',
    colors: ['#9370DB', '#8A2BE2', '#4B0082']
  },
  {
    id: '6',
    title: 'Équipe Direction ONPG',
    description: 'Portrait officiel de l\'équipe de direction lors de la réunion stratégique annuelle',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    album: 'equipe',
    date: '2024-01-03',
    tags: ['équipe', 'direction', 'portrait', 'professionnel'],
    photographer: 'Équipe Communication',
    location: 'Siège ONPG, Libreville',
    downloads: 189,
    likes: 98,
    featured: false,
    category: 'Équipe',
    orientation: 'landscape',
    colors: ['#708090', '#2F4F4F', '#556B2F']
  },
  {
    id: '7',
    title: 'Innovation Pharmacologique',
    description: 'Présentation des dernières innovations en pharmacologie lors du symposium annuel',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=1200&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop',
    album: 'congres-2024',
    date: '2024-01-14',
    tags: ['innovation', 'pharmacologie', 'symposium', 'recherche'],
    photographer: 'Marie Leroy',
    location: 'Salle Innovation, Palais des Congrès',
    downloads: 334,
    likes: 167,
    featured: true,
    category: 'Événements',
    orientation: 'portrait',
    colors: ['#FF69B4', '#FF1493', '#DC143C']
  },
  {
    id: '8',
    title: 'Formation Pratique Médicaments',
    description: 'Atelier pratique sur la manipulation et la dispensation sécurisée des médicaments',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    album: 'formations',
    date: '2024-01-11',
    tags: ['formation', 'pratique', 'médicaments', 'sécurité'],
    photographer: 'Pierre Martin',
    location: 'Laboratoire de Formation',
    downloads: 223,
    likes: 112,
    featured: false,
    category: 'Formation',
    orientation: 'landscape',
    colors: ['#FF6347', '#FF4500', '#DC143C']
  },
  {
    id: '9',
    title: 'Stand Information Santé Publique',
    description: 'Présentation interactive des programmes de prévention et d\'éducation pour la santé au Gabon',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    album: 'jpo-2024',
    date: '2024-03-15',
    tags: ['prévention', 'santé publique', 'éducation', 'gabon'],
    photographer: 'Équipe Communication ONPG',
    location: 'Centre Ville, Libreville',
    downloads: 189,
    likes: 156,
    featured: true,
    category: 'Sensibilisation Publique',
    orientation: 'landscape',
    colors: ['#00A651', '#2ECC71', '#27AE60']
  },
  {
    id: '10',
    title: 'Atelier Enfants - Les Métiers de la Santé',
    description: 'Séance ludique d\'initiation aux différents métiers du secteur de la santé pour les jeunes visiteurs',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
    album: 'jpo-2024',
    date: '2024-03-16',
    tags: ['enfants', 'métiers', 'santé', 'éducation'],
    photographer: 'Sophie Bernard',
    location: 'Espace Jeunesse, Palais des Congrès',
    downloads: 267,
    likes: 203,
    featured: false,
    category: 'Sensibilisation Publique',
    orientation: 'portrait',
    colors: ['#FFD700', '#FFA500', '#FF8C00']
  },
  {
    id: '11',
    title: 'Conférence - Innovation Technologique',
    description: 'Présentation des dernières avancées technologiques en pharmacie et leur impact sur les soins de santé',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=1200&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop',
    album: 'jpo-2024',
    date: '2024-03-17',
    tags: ['innovation', 'technologie', 'conférence', 'soins'],
    photographer: 'Dr. Lionel Ozounguet',
    location: 'Salle Innovation, Palais des Congrès',
    downloads: 334,
    likes: 278,
    featured: true,
    category: 'Sensibilisation Publique',
    orientation: 'portrait',
    colors: ['#9370DB', '#8A2BE2', '#4B0082']
  }
];

const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Simulation de chargement avec délai pour effet wow
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulation de chargement réseau
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPhotos(mockPhotos);
      setAlbums(mockAlbums);
      setFilteredPhotos(mockPhotos);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Effet de parallax subtil pour le hero (bouge plus lentement que le scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const rate = scrollY * -0.5; // Le hero bouge à 50% de la vitesse du scroll

        heroRef.current.style.transform = `translateY(${rate}px)`;

        // Le hero devient plus transparent au fur et à mesure
        const opacity = Math.max(0.3, 1 - (scrollY / 800));
        heroRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtrage avancé avec animations
  useEffect(() => {
    let filtered = photos.filter(photo => {
      const matchesSearch = !searchQuery ||
                           photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (photo.photographer && photo.photographer.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesAlbum = selectedAlbum === 'all' || photo.album === selectedAlbum;
      const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;

      return matchesSearch && matchesAlbum && matchesCategory;
    });

    setFilteredPhotos(filtered);
  }, [photos, searchQuery, selectedAlbum, selectedCategory]);


  // Gestion du lightbox avec animations
  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setSelectedPhoto(null), 300); // Délai pour animation
    document.body.style.overflow = 'auto';
  };

  // Navigation par catégories
  const categories = useMemo(() => {
    const cats = [...new Set(photos.map(p => p.category))];
    return [{ id: 'all', name: 'Toutes', count: photos.length },
            ...cats.map(cat => ({
              id: cat,
              name: cat,
              count: photos.filter(p => p.category === cat).length
            }))];
  }, [photos]);

  // Gestion du scroll pour effets parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestionnaire de soumission du formulaire de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche est déjà gérée en temps réel via onChange
    // Cette fonction empêche juste le rechargement de la page
  };

  // Fonction pour effacer les filtres
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAlbum('all');
  };

  return (
    <div className="photos-page">
      {/* Hero Section avec effet parallax */}
      <section className="photos-hero" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-gradient-primary"></div>
        </div>

        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-badge">
              <span className="badge-icon">📅</span>
              <span className="badge-text">ÉVÉNEMENTS ONPG</span>
            </div>

            <h1 className="hero-title">
              <span className="title-main">Événements</span>
              <span className="title-secondary">& Archives</span>
            </h1>

            <p className="hero-subtitle">
              Découvrez nos 7 événements marquants et plongez dans l'histoire de la pharmacie gabonaise.
            </p>

            <div className="hero-actions">
              <button className="hero-btn primary" onClick={() => document.querySelector('.albums-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="btn-icon">📂</span>
                <span className="btn-text">Découvrir les Événements</span>
                <span className="btn-arrow">→</span>
              </button>
              <div className="hero-quick-stats">
                <div className="quick-stat">
                  <span className="stat-number">{albums.length}</span>
                  <span className="stat-label">Événements</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-number">{photos.length}</span>
                  <span className="stat-label">Photos</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-number">{albums.filter(a => a.featured).length}</span>
                  <span className="stat-label">Événements Majeurs</span>
            </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Albums/Événements Grid */}
      {!isLoading && (
        <section className="albums-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ animationDelay: '0.2s' }}>Événements & Moments</h2>
              <p className="section-subtitle" style={{ animationDelay: '0.4s' }}>Découvrez nos événements marquants et collections photographiques</p>
          </div>

            <div className="albums-grid">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className={`album-card ${album.featured ? 'featured' : ''}`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    background: album.gradient
                  }}
                  onClick={() => {
                    const albumPhotos = photos.filter(p => p.album === album.id);
                    if (albumPhotos.length > 0) {
                      setFilteredPhotos(albumPhotos);
                      setSelectedAlbum(album.id);
                      openLightbox(albumPhotos[0]);
                    } else {
                      setSelectedAlbum(album.id);
                      setFilteredPhotos([]);
                    }
                  }}
                >
                  <div className="album-image-container">
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="album-cover"
                      loading="lazy"
                    />
                      <div className="album-overlay">
                        <div className="album-info">
                        <div className="album-category">{album.category}</div>
                        <h3 className="album-title">{album.name}</h3>
                        <p className="album-description">{album.description}</p>
                        <div className="album-stats">
                          <span className="stat-item">📸 {album.photoCount} photos</span>
                        </div>
                      </div>
                      <div className="album-actions">
                        <button className="explore-btn">
                          <span className="btn-icon">👁️</span>
                          <span className="btn-text">Explorer</span>
                        </button>
                      </div>
                </div>
              </div>

                  {album.featured && (
                    <div className="featured-badge">
                      <span className="badge-icon">⭐</span>
                      <span className="badge-text">Événement Majeur</span>
                    </div>
                  )}
                  </div>
                ))}
              </div>

            {/* Photos filtrées par album sélectionné */}
            {selectedAlbum !== 'all' && (
              <div className="album-photos-section">
                <div className="album-photos-header">
                  <h3 className="album-photos-title">
                    Photos de l'album: {albums.find(a => a.id === selectedAlbum)?.name}
                  </h3>
                  <button
                    className="back-to-albums-btn"
                    onClick={() => {
                      setSelectedAlbum('all');
                      setFilteredPhotos(photos);
                    }}
                  >
                    ← Retour aux albums
                  </button>
                </div>

                {filteredPhotos.length > 0 ? (
                  <div className="photos-grid">
                    {filteredPhotos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className={`photo-item ${photo.orientation}`}
                        onClick={() => openLightbox(photo)}
                      >
                        <div className="photo-wrapper">
                          <img
                            src={photo.thumbnail}
                            alt={photo.title}
                            className="photo-img"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-album-state">
                    <div className="empty-icon">📷</div>
                    <h3 className="empty-title">Aucune photo dans cet album</h3>
                    <p className="empty-subtitle">
                      Les photos de cet album sont en cours de traitement.
                    </p>
                  <button
                      className="back-to-albums-btn"
                      onClick={() => {
                        setSelectedAlbum('all');
                        setFilteredPhotos(photos);
                      }}
                    >
                      ← Retour aux albums
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-section">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-center">📸</div>
            </div>
            <h3 className="loading-title">Chargement de la galerie</h3>
            <p className="loading-subtitle">Préparation des moments inoubliables...</p>
          </div>
      </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container">
            <button className="lightbox-close" onClick={closeLightbox}>
              <span className="close-icon">✕</span>
            </button>

            <div className="lightbox-content">
              <div className="lightbox-image-section">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="lightbox-image"
                />
            </div>

            <div className="lightbox-info">
                <div className="info-header">
                  <h2 className="lightbox-title">{selectedPhoto.title}</h2>
                  <div className="lightbox-badges">
                    {selectedPhoto.featured && (
                      <span className="badge featured">⭐ À la une</span>
                    )}
                    <span className="badge category">{selectedPhoto.category}</span>
                  </div>
              </div>

                <p className="lightbox-description">{selectedPhoto.description}</p>

                <div className="lightbox-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div className="detail-content">
                        <span className="detail-label">Date</span>
                        <span className="detail-value">
                          {new Date(selectedPhoto.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
              </div>

                    {selectedPhoto.location && (
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <div className="detail-content">
                          <span className="detail-label">Lieu</span>
                          <span className="detail-value">{selectedPhoto.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
