import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Photos.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

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

  // Charger depuis MongoDB - 1 seule photo
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchResourceData('photos');
        if (data && !Array.isArray(data)) {
          const photo: Photo = {
            id: String(data._id || ''),
            title: data.title,
            description: data.description || '',
            image: data.image || '',
            thumbnail: data.image || data.thumbnail || '',
            album: data.album || 'Général',
            date: data.date || new Date().toISOString().split('T')[0],
            tags: data.tags || [],
            category: data.category || 'Général',
            photographer: data.photographer,
            location: data.location,
            downloads: data.downloads || 0,
            likes: data.likes || 0,
            featured: data.featured || false,
            orientation: (data.orientation as 'portrait' | 'landscape' | 'square') || 'landscape',
            colors: data.colors || []
          };
          setPhotos([photo]);
          setFilteredPhotos([photo]);
          
          // Créer un album pour cette photo
          const album: Album = {
            id: photo.album.toLowerCase().replace(/\s+/g, '-'),
            name: photo.album,
            description: data.albumDescription || `Album ${photo.album}`,
            coverImage: photo.image,
            photoCount: 1,
            featured: photo.featured,
            category: photo.category,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          };
          setAlbums([album]);
        } else {
          setPhotos([]);
          setFilteredPhotos([]);
          setAlbums([]);
        }
      } catch (error) {
        console.error('Erreur chargement photos:', error);
        setPhotos([]);
        setFilteredPhotos([]);
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
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
