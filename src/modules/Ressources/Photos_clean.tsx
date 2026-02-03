import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

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
    name: 'Congrès National 2024',
    description: 'Photos du 15ème Congrès National des Pharmaciens du Gabon',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    photoCount: 45,
    featured: true,
    category: 'Événements',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'formations',
    name: 'Sessions de Formation',
    description: 'Moments capturés lors des formations continues et ateliers pratiques',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    photoCount: 28,
    featured: false,
    category: 'Formation',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'officines',
    name: 'Visites d\'Officines',
    description: 'Découverte des pharmacies modernes et espaces de dispensation',
    coverImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop',
    photoCount: 32,
    featured: true,
    category: 'Infrastructure',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'evenements',
    name: 'Événements Spéciaux',
    description: 'Cérémonies, remises de prix et moments importants de la profession',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    photoCount: 67,
    featured: false,
    category: 'Célébrations',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'laboratoire',
    name: 'Laboratoires & Recherche',
    description: 'Photos des laboratoires modernes et travaux de recherche',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    photoCount: 38,
    featured: true,
    category: 'Recherche',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'equipe',
    name: 'Équipe ONPG',
    description: 'Portraits et moments de vie de l\'équipe professionnelle',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    photoCount: 24,
    featured: false,
    category: 'Équipe',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
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

  // Statistiques améliorées
  const stats = useMemo(() => ({
    totalPhotos: photos.length,
    totalAlbums: albums.length,
    totalDownloads: photos.reduce((sum, photo) => sum + photo.downloads, 0),
    featuredPhotos: photos.filter(photo => photo.featured).length,
    popularPhotos: photos.filter(photo => photo.likes > 50).length,
    categories: [...new Set(photos.map(p => p.category))].length
  }), [photos, albums]);

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
      {/* Hero Section Époustouflant */}
      <section className="photos-hero" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-gradient-primary"></div>
          <div className="hero-gradient-secondary"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-badge">
              <span className="badge-icon">📸</span>
              <span className="badge-text">GALERIE ONPG</span>
            </div>

            <h1 className="hero-title">
              <span className="title-main">Moments</span>
              <span className="title-secondary">Inoubliables</span>
            </h1>

            <p className="hero-subtitle">
              Découvrez l'excellence de la pharmacie gabonaise à travers nos archives visuelles.
              Chaque image raconte une histoire de passion, d'innovation et de dévouement.
            </p>

            <div className="hero-actions">
              <button className="hero-btn primary" onClick={() => document.querySelector('.photos-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="btn-icon">👁️</span>
                <span className="btn-text">Explorer</span>
                <span className="btn-arrow">→</span>
              </button>
              <button className="hero-btn secondary" onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}>
                <span className="btn-icon">{viewMode === 'grid' ? '⬜' : '▦'}</span>
                <span className="btn-text">{viewMode === 'grid' ? 'Grille' : 'Mosaïque'}</span>
              </button>
            </div>
          </div>

          {/* Stats Cards 3D */}
          <div className="hero-stats-3d">
            <div className="stat-card-3d">
              <div className="stat-icon">🖼️</div>
              <div className="stat-content">
              <div className="stat-number">{stats.totalPhotos}</div>
              <div className="stat-label">Photos</div>
              </div>
              <div className="stat-glow"></div>
            </div>

            <div className="stat-card-3d">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
              <div className="stat-number">{stats.totalAlbums}</div>
              <div className="stat-label">Albums</div>
              </div>
              <div className="stat-glow"></div>
            </div>

            <div className="stat-card-3d">
              <div className="stat-icon">⬇️</div>
              <div className="stat-content">
              <div className="stat-number">{stats.totalDownloads.toLocaleString()}</div>
              <div className="stat-label">Téléchargements</div>
              </div>
              <div className="stat-glow"></div>
            </div>

            <div className="stat-card-3d">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{stats.featuredPhotos}</div>
                <div className="stat-label">À la une</div>
              </div>
              <div className="stat-glow"></div>
            </div>
          </div>
        </div>

        {/* Particules flottantes */}
        <div className="floating-particles">
          <div className="particle particle-1">💊</div>
          <div className="particle particle-2">🔬</div>
          <div className="particle particle-3">📸</div>
          <div className="particle particle-4">🎯</div>
          <div className="particle particle-5">⭐</div>
          <div className="particle particle-6">💡</div>
          <div className="particle particle-7">📋</div>
          <div className="particle particle-8">🏥</div>
          <div className="particle particle-9">⚕️</div>
          <div className="particle particle-10">🔍</div>
          <div className="particle particle-11">💊</div>
          <div className="particle particle-12">🔬</div>
          <div className="particle particle-13">📸</div>
          <div className="particle particle-14">🎯</div>
          <div className="particle particle-15">⭐</div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <div className="scroll-text">Scroll</div>
        </div>
      </section>

      {/* Navigation Bar Flottante */}
      <nav className="photos-nav">
        <div className="nav-container">
          <div className="nav-search">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Rechercher des photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="nav-filters">
            <div className="filter-group">
              <label className="filter-label">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Album</label>
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tous les albums ({albums.length})</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.name} ({album.photoCount})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="nav-results">
            <span className="results-count">
              {filteredPhotos.length} photo{filteredPhotos.length > 1 ? 's' : ''} trouvée{filteredPhotos.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </nav>

      {/* Loading State Époustouflant */}
      {isLoading && (
        <div className="loading-section">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-center">📸</div>
            </div>
            <h3 className="loading-title">Chargement de la galerie</h3>
            <p className="loading-subtitle">Préparation des moments inoubliables...</p>
          </div>
        </div>
      )}

      {/* Photos Grid Époustouflante */}
      {!isLoading && (
        <section className="photos-section">
          <div className="container">
            <div
              className={`photos-grid ${viewMode} ${filteredPhotos.length === 0 ? 'empty' : ''}`}
              ref={gridRef}
            >
              {filteredPhotos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3 className="empty-title">Aucune photo trouvée</h3>
                  <p className="empty-subtitle">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <button
                    className="empty-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedAlbum('all');
                    }}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                filteredPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`photo-item ${photo.orientation} ${photo.featured ? 'featured' : ''}`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      background: photo.colors ? `linear-gradient(135deg, ${photo.colors[0]}, ${photo.colors[1]})` : undefined
                    }}
                    onMouseEnter={() => setHoveredPhoto(photo.id)}
                    onMouseLeave={() => setHoveredPhoto(null)}
                    onClick={() => openLightbox(photo)}
                  >
                    <div className="photo-wrapper">
                      <img
                        src={photo.thumbnail}
                        alt={photo.title}
                        className="photo-img"
                        loading="lazy"
                      />

                      {/* Overlay avec effets 3D */}
                      <div className={`photo-overlay ${hoveredPhoto === photo.id ? 'active' : ''}`}>
                        <div className="overlay-content">
                          <div className="photo-info">
                            <h3 className="photo-title">{photo.title}</h3>
                            <p className="photo-desc">{photo.description.substring(0, 100)}...</p>
                            <div className="photo-meta">
                              <span className="meta-item">📅 {new Date(photo.date).toLocaleDateString('fr-FR')}</span>
                              {photo.location && <span className="meta-item">📍 {photo.location}</span>}
                            </div>
                          </div>

                          <div className="photo-actions">
                            <button className="action-btn like">
                              <span className="action-icon">❤️</span>
                              <span className="action-count">{photo.likes}</span>
                            </button>
                            <button className="action-btn download">
                              <span className="action-icon">⬇️</span>
                              <span className="action-count">{photo.downloads}</span>
                            </button>
                            <button className="action-btn view">
                              <span className="action-icon">👁️</span>
                              <span className="action-text">Voir</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Badges et indicateurs */}
                      {photo.featured && (
                        <div className="photo-badge featured">
                          <span className="badge-icon">⭐</span>
                          <span className="badge-text">À la une</span>
                        </div>
                      )}

                      <div className="photo-category">
                        <span className="category-text">{photo.category}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Époustouflant */}
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

                <div className="lightbox-nav">
                  <button className="nav-btn prev">
                    <span className="nav-icon">←</span>
                  </button>
                  <button className="nav-btn next">
                    <span className="nav-icon">→</span>
                  </button>
                </div>
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

                    {selectedPhoto.photographer && (
                      <div className="detail-item">
                        <span className="detail-icon">📸</span>
                        <div className="detail-content">
                          <span className="detail-label">Photographe</span>
                          <span className="detail-value">{selectedPhoto.photographer}</span>
                        </div>
                      </div>
                    )}

                    {selectedPhoto.location && (
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <div className="detail-content">
                          <span className="detail-label">Lieu</span>
                          <span className="detail-value">{selectedPhoto.location}</span>
                        </div>
                      </div>
                    )}

                    <div className="detail-item">
                      <span className="detail-icon">❤️</span>
                      <div className="detail-content">
                        <span className="detail-label">J'aime</span>
                        <span className="detail-value">{selectedPhoto.likes}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">⬇️</span>
                      <div className="detail-content">
                        <span className="detail-label">Téléchargements</span>
                        <span className="detail-value">{selectedPhoto.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lightbox-tags">
                  {selectedPhoto.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                <div className="lightbox-actions">
                  <button className="action-btn primary">
                    <span className="btn-icon">⬇️</span>
                    <span className="btn-text">Télécharger</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">❤️</span>
                    <span className="btn-text">J'aime</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">🔗</span>
                    <span className="btn-text">Partager</span>
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

export default Photos;
