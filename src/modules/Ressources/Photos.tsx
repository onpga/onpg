import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Charger depuis MongoDB - plusieurs événements/collections de photos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchResourceData('photos');

        if (!data) {
          setPhotos([]);
          setFilteredPhotos([]);
          setAlbums([]);
          return;
        }

        const rawArray = Array.isArray(data) ? data : [data];

        const mappedPhotos: Photo[] = [];
        const mappedAlbums: Album[] = [];

        rawArray.forEach((item: any, index: number) => {
          const albumId = String(item._id || `album-${index}`);
          const albumName = item.album || item.title || 'Événement ONPG';
          const category = item.category || 'Événements';
          const baseDate = item.date || new Date().toISOString().split('T')[0];

          // On accepte soit un champ "images" (tableau), soit un seul "image"
          const imageList: string[] = Array.isArray(item.images)
            ? item.images.filter((u: string) => !!u)
            : [item.image || item.thumbnail].filter((u: string) => !!u);

          if (imageList.length === 0) {
            return;
          }

          imageList.forEach((url: string, idx: number) => {
            mappedPhotos.push({
              id: `${albumId}-${idx}`,
              title: (item.photoTitles && item.photoTitles[idx]) || `${albumName} #${idx + 1}`,
              description: item.description || '',
              image: url,
              thumbnail: url,
              album: albumId,
              date: baseDate,
              tags: item.tags || [],
              photographer: item.photographer,
              location: item.location,
              downloads: item.downloads || 0,
              likes: item.likes || 0,
              featured: item.featured || false,
              category,
              orientation: (item.orientation as 'portrait' | 'landscape' | 'square') || 'landscape',
              colors: item.colors || []
            });
          });

          mappedAlbums.push({
            id: albumId,
            name: albumName,
            description: item.albumDescription || item.description || `Événement ${albumName}`,
            coverImage: imageList[0],
            photoCount: imageList.length,
            featured: item.featured || false,
            category,
            gradient: item.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          });
        });

        setPhotos(mappedPhotos);
        setFilteredPhotos(mappedPhotos);
        setAlbums(mappedAlbums);
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


  // Navigation vers la page détail
  const handlePhotoClick = (photo: Photo) => {
    navigate(`/ressources/photos/${photo.id}`);
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
      {/* Hero Section */}
      <section className="photos-hero" ref={heroRef}>
        <div className="photos-hero-background">
          <div className="photos-hero-gradient-primary"></div>
        </div>

        <div className="photos-hero-content">
          <div className="photos-hero-main">
            <div className="photos-hero-badge">
              <span className="photos-badge-icon">📅</span>
              <span className="photos-badge-text">ÉVÉNEMENTS ONPG</span>
            </div>

            <h1 className="photos-hero-title">
              <span className="photos-title-main">Événements</span>
              <span className="photos-title-secondary">& Archives</span>
            </h1>

            <p className="photos-hero-subtitle">
              Découvrez nos événements marquants et plongez dans l'histoire de la pharmacie gabonaise.
            </p>

            <div className="photos-quick-stats">
              <div className="photos-quick-stat">
                <span className="photos-stat-number">{albums.length}</span>
                <span className="photos-stat-label">Événements</span>
              </div>
              <div className="photos-quick-stat">
                <span className="photos-stat-number">{photos.length}</span>
                <span className="photos-stat-label">Photos</span>
              </div>
              <div className="photos-quick-stat">
                <span className="photos-stat-number">{albums.filter(a => a.featured).length}</span>
                <span className="photos-stat-label">Événements Majeurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <div className="photos-filters">
        <div className="photos-filters-container">
          {/* Recherche */}
          <div className="photos-search-wrapper">
            <input
              type="text"
              className="photos-search-input"
              placeholder="Rechercher par titre, description, photographe ou tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="photos-search-icon">🔍</span>
          </div>

          {/* Catégories */}
          <div className="photos-category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`photos-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Albums */}
          {albums.length > 0 && (
            <div className="photos-album-filters">
              <select
                className="photos-album-select"
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
              >
                <option value="all">Tous les albums</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.name} ({album.photoCount})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bouton effacer filtres */}
          {(searchQuery || selectedCategory !== 'all' || selectedAlbum !== 'all') && (
            <button className="photos-clear-btn" onClick={clearFilters}>
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* Albums/Événements Grid */}
      {!isLoading && (
        <section className="albums-section">
          <div className="photos-container">
            <div className="photos-section-header">
              <h2 className="photos-section-title">Événements & Moments</h2>
              <p className="photos-section-subtitle">Découvrez nos événements marquants et collections photographiques</p>
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
                      // Naviguer vers la première photo de l'album
                      navigate(`/ressources/photos/${albumPhotos[0].id}`);
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
                      <span style={{ fontSize: '0.7rem' }}>⭐</span>
                    </div>
                  )}
                  </div>
                ))}
              </div>

          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="photos-loading-section">
          <div className="photos-loading-container">
            <div className="photos-loading-spinner">
              <div className="photos-spinner-center">📸</div>
            </div>
            <h3 className="photos-loading-title">Chargement de la galerie</h3>
            <p className="photos-loading-subtitle">Préparation des moments inoubliables...</p>
          </div>
      </div>
      )}

    </div>
  );
};

export default Photos;
