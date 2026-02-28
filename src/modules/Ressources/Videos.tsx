import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Videos.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

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

const Videos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [loading, setLoading] = useState(true);

  // Charger les vidéos depuis MongoDB
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('videos');
        if (Array.isArray(data) && data.length > 0) {
          const loadedVideos: Video[] = data.map(item => ({
            id: String(item._id || ''),
            title: item.title,
            description: item.description || '',
            thumbnail: item.thumbnail || '',
            youtubeId: item.youtubeId || '',
            duration: item.duration || '0:00',
            views: item.views || 0,
            likes: item.likes || 0,
            publishedDate: item.publishedDate || new Date().toISOString().split('T')[0],
            category: item.category || 'Général',
            speaker: item.speaker || '',
            event: item.event,
            tags: item.tags || [],
            featured: item.featured || false
          }));
          setVideos(loadedVideos);
          setFilteredVideos(loadedVideos);
        }
      } catch (error) {
        console.error('Erreur chargement vidéos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  // Catégories disponibles
  const categories = useMemo(() => {
    const cats = ['Toutes', ...new Set(videos.map(v => v.category))];
    return cats;
  }, [videos]);

  // Filtrage en temps réel
  useEffect(() => {
    let filtered = videos;

    // Recherche par titre, description ou auteur
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.speaker.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'Toutes') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    // Tri par date (plus récent en premier)
    filtered.sort((a, b) => {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    setFilteredVideos(filtered);
  }, [searchQuery, selectedCategory, videos]);

  const handleVideoClick = (video: Video) => {
    navigate(`/ressources/videos/${video.id}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Toutes');
  };

  const formatDuration = (duration: string) => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return duration;
  };

  return (
    <div className="videos-page">
      {/* Hero Section */}
      <div className="videos-hero">
        <div className="hero-content">
          <h1 className="hero-title">Vidéothèque ONPG</h1>
          <p className="hero-subtitle">
            Découvrez nos vidéos éducatives, formations et conférences
          </p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="videos-filters">
        <div className="filters-container">
          {/* Recherche */}
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par titre, description ou auteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Catégories */}
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Bouton effacer filtres */}
          {(searchQuery || selectedCategory !== 'Toutes') && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="videos-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement des vidéos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎥</div>
            <h3 className="empty-title">Aucune vidéo trouvée</h3>
            <p className="empty-subtitle">
              {searchQuery || selectedCategory !== 'Toutes'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucune vidéo disponible pour le moment'}
            </p>
            {(searchQuery || selectedCategory !== 'Toutes') && (
              <button className="empty-action-btn" onClick={clearFilters}>
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="videos-results">
              <p className="results-count">
                {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''} trouvée{filteredVideos.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="videos-grid">
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  className={`video-card ${video.featured ? 'featured' : ''}`}
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} loading="lazy" />
                    <div className="video-overlay">
                      <div className="play-button">
                        <span className="play-icon">▶</span>
                      </div>
                    </div>
                    <div className="video-duration">{formatDuration(video.duration)}</div>
                    {video.featured && (
                      <div className="featured-badge">
                        <span style={{ fontSize: '0.7rem' }}>⭐</span>
                      </div>
                    )}
                  </div>

                  <div className="video-card-content">
                    <h3 className="video-card-title">{video.title}</h3>
                    <div className="video-card-meta">
                      <span className="video-category">{video.category}</span>
                      {video.speaker && (
                        <span className="video-speaker">👤 {video.speaker}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Videos;
