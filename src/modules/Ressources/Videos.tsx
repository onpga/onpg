import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
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

const formatViews = (views: number) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return String(views);
};

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('fr-FR');
};

const formatDuration = (duration: string) => {
  const parts = duration.split(':');
  if (parts.length === 2) return `${parts[0]}:${parts[1]}`;
  return duration || '0:00';
};

const Videos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('videos');
        if (!Array.isArray(data)) {
          setVideos([]);
          return;
        }

        const loadedVideos: Video[] = data.map((item: any) => ({
          id: String(item._id || ''),
          title: String(item.title || ''),
          description: String(item.description || ''),
          thumbnail: String(item.thumbnail || ''),
          youtubeId: String(item.youtubeId || ''),
          duration: String(item.duration || '0:00'),
          views: Number(item.views || 0),
          likes: Number(item.likes || 0),
          publishedDate: String(item.publishedDate || new Date().toISOString().split('T')[0]),
          category: String(item.category || 'General'),
          speaker: String(item.speaker || ''),
          event: item.event || '',
          tags: Array.isArray(item.tags) ? item.tags : [],
          featured: Boolean(item.featured)
        }));

        setVideos(loadedVideos);
      } catch (error) {
        console.error('Erreur chargement videos:', error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const categories = useMemo(
    () => ['Toutes', ...new Set(videos.map((v) => v.category))],
    [videos]
  );

  const filteredVideos = useMemo(() => {
    let next = [...videos];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      next = next.filter(
        (video) =>
          video.title.toLowerCase().includes(q) ||
          video.description.toLowerCase().includes(q) ||
          video.speaker.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'Toutes') {
      next = next.filter((video) => video.category === selectedCategory);
    }

    return next.sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  }, [videos, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Toutes');
  };

  return (
    <div className="videos-page">
      <section className="videos-hero" aria-labelledby="videos-title">
        <div className="videos-container">
          <span className="videos-eyebrow">Centre documentaire</span>
          <h1 id="videos-title" className="videos-hero-title">Videotheque ONPG</h1>
          <p className="videos-hero-subtitle">
            Formations, interventions et contenus institutionnels pour les professionnels de sante.
          </p>

          <div className="videos-kpi-grid">
            <article className="videos-kpi-card">
              <strong>{videos.length}</strong>
              <span>Videos publiees</span>
            </article>
            <article className="videos-kpi-card">
              <strong>{categories.length - 1}</strong>
              <span>Categories</span>
            </article>
            <article className="videos-kpi-card">
              <strong>{filteredVideos.length}</strong>
              <span>Resultats</span>
            </article>
          </div>
        </div>
      </section>

      <section className="videos-filters">
        <div className="videos-container">
          <div className="videos-filters-shell">
            <div className="videos-search-wrapper">
              <label htmlFor="videos-search">Recherche</label>
              <div className="videos-search-input-wrap">
                <input
                  id="videos-search"
                  type="text"
                  className="videos-search-input"
                  placeholder="Titre, description ou intervenant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="videos-search-icon" aria-hidden="true">⌕</span>
              </div>
            </div>

            <div className="videos-category-filters" role="group" aria-label="Filtrer par categorie">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`videos-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>

            {(searchQuery || selectedCategory !== 'Toutes') && (
              <button className="videos-clear-btn" onClick={clearFilters} type="button">
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="videos-content">
        <div className="videos-container">
          {loading ? (
            <div className="videos-loading-state">
              <div className="videos-loading-spinner"></div>
              <p>Chargement des videos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="videos-empty-state">
              <div className="videos-empty-icon">▶</div>
              <h3 className="videos-empty-title">Aucune video trouvee</h3>
              <p className="videos-empty-subtitle">
                {searchQuery || selectedCategory !== 'Toutes'
                  ? 'Essayez d ajuster vos criteres de recherche.'
                  : 'Aucune video disponible pour le moment.'}
              </p>
              {(searchQuery || selectedCategory !== 'Toutes') && (
                <button className="videos-empty-action-btn" onClick={clearFilters} type="button">
                  Reinitialiser
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="videos-results">
                <p className="videos-results-count">
                  {filteredVideos.length} video{filteredVideos.length > 1 ? 's' : ''} trouvee
                  {filteredVideos.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="videos-grid">
                {filteredVideos.map((video) => (
                  <article
                    key={video.id}
                    className={`video-card ${video.featured ? 'featured' : ''}`}
                    onClick={() => navigate(`/ressources/videos/${video.id}`)}
                  >
                    <div className="video-thumbnail">
                      <img
                        src={video.thumbnail || ONPG_IMAGES.fallbackArticle}
                        alt={video.title}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== ONPG_IMAGES.fallbackArticle) {
                            target.src = ONPG_IMAGES.fallbackArticle;
                          }
                        }}
                      />
                      <div className="video-overlay">
                        <div className="video-play-button">
                          <span className="video-play-icon">▶</span>
                        </div>
                      </div>
                      <div className="video-duration">{formatDuration(video.duration)}</div>
                      {video.featured && (
                        <div className="videos-featured-badge">A la une</div>
                      )}
                    </div>

                    <div className="video-card-content">
                      <h3 className="video-card-title">{video.title}</h3>
                      <p className="video-card-description">{video.description || 'Contenu video ONPG.'}</p>

                      <div className="video-card-meta">
                        <span className="video-category-tag">{video.category}</span>
                        {video.speaker && <span className="video-speaker-tag">{video.speaker}</span>}
                      </div>

                      <div className="video-card-foot">
                        <span>{formatViews(video.views)} vues</span>
                        <span>{video.likes} likes</span>
                        <span>{formatDate(video.publishedDate)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Videos;
