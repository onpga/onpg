import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PhotoDetail.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

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

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const loadPhoto = async () => {
      if (!id) {
        navigate('/ressources/photos');
        return;
      }

      try {
        // Charger toutes les photos et trouver celle qui correspond
        const data = await fetchResourceData('photos');
        if (!data) {
          navigate('/ressources/photos');
          return;
        }

        const rawArray = Array.isArray(data) ? data : [data];
        let foundPhoto: Photo | null = null;

        rawArray.forEach((item: any, index: number) => {
          const albumId = String(item._id || `album-${index}`);
          const imageList: string[] = Array.isArray(item.images)
            ? item.images.filter((u: string) => !!u)
            : [item.image || item.thumbnail].filter((u: string) => !!u);

          imageList.forEach((url: string, idx: number) => {
            const photoId = `${albumId}-${idx}`;
            if (photoId === id) {
              foundPhoto = {
                id: photoId,
                title: (item.photoTitles && item.photoTitles[idx]) || `${item.album || item.title || 'Événement ONPG'} #${idx + 1}`,
                description: item.description || '',
                image: url,
                thumbnail: url,
                album: albumId,
                date: item.date || new Date().toISOString().split('T')[0],
                tags: item.tags || [],
                photographer: item.photographer,
                location: item.location,
                downloads: item.downloads || 0,
                likes: item.likes || 0,
                featured: item.featured || false,
                category: item.category || 'Événements',
                orientation: (item.orientation as 'portrait' | 'landscape' | 'square') || 'landscape',
                colors: item.colors || []
              };
            }
          });
        });

        if (foundPhoto) {
          setPhoto(foundPhoto);
        } else {
          navigate('/ressources/photos');
        }
      } catch (error) {
        console.error('Erreur chargement photo:', error);
        navigate('/ressources/photos');
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [id, navigate]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = photo?.title || '';
    const text = photo?.description || '';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const toggleFullscreen = () => {
    const img = document.querySelector('.photo-detail-image') as HTMLImageElement;
    if (!img) return;

    if (!isFullscreen) {
      if (img.requestFullscreen) {
        img.requestFullscreen();
      } else if ((img as any).webkitRequestFullscreen) {
        (img as any).webkitRequestFullscreen();
      } else if ((img as any).mozRequestFullScreen) {
        (img as any).mozRequestFullScreen();
      } else if ((img as any).msRequestFullscreen) {
        (img as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="photo-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de la photo...</p>
        </div>
      </div>
    );
  }

  if (!photo) {
    return null;
  }

  return (
    <div className="photo-detail-page">
      <div className="photo-detail-container">
        {/* Header avec bouton retour */}
        <div className="photo-detail-header">
          <button className="back-button" onClick={() => navigate('/ressources/photos')}>
            <span className="back-icon">←</span>
            <span className="back-text">Retour aux photos</span>
          </button>
        </div>

        {/* Contenu principal */}
        <div className="photo-detail-content">
          {/* Section photo */}
          <div className="photo-image-section">
            <div className="photo-image-wrapper">
              <img
                className="photo-detail-image"
                src={photo.image}
                alt={photo.title}
              />
              <div className="photo-image-controls">
                <button className="control-btn fullscreen-btn" onClick={toggleFullscreen}>
                  <span className="control-icon">{isFullscreen ? '⤓' : '⛶'}</span>
                  <span className="control-text">{isFullscreen ? 'Quitter plein écran' : 'Plein écran'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section informations */}
          <div className="photo-info-section">
            <div className="photo-info-header">
              <h1 className="photo-detail-title">{photo.title}</h1>
              {photo.featured && (
                <span className="featured-badge">
                  <span style={{ fontSize: '0.7rem' }}>⭐</span> À la une
                </span>
              )}
            </div>

            <div className="photo-info-meta">
              <div className="meta-item">
                <span className="meta-icon">❤️</span>
                <span className="meta-value">{photo.likes} j'aime</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⬇️</span>
                <span className="meta-value">{photo.downloads} téléchargements</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span className="meta-value">
                  {new Date(photo.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="photo-description">
              <p>{photo.description || 'Aucune description disponible.'}</p>
            </div>

            <div className="photo-details">
              {photo.photographer && (
                <div className="detail-row">
                  <span className="detail-label">Photographe :</span>
                  <span className="detail-value">{photo.photographer}</span>
                </div>
              )}
              {photo.location && (
                <div className="detail-row">
                  <span className="detail-label">Lieu :</span>
                  <span className="detail-value">{photo.location}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Catégorie :</span>
                <span className="detail-value category-tag">{photo.category}</span>
              </div>
            </div>

            {photo.tags && photo.tags.length > 0 && (
              <div className="photo-tags">
                <h3 className="tags-title">Tags</h3>
                <div className="tags-list">
                  {photo.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Section partage */}
            <div className="photo-share-section">
              <h3 className="share-title">Partager cette photo</h3>
              <div className="share-buttons">
                <button
                  className="share-btn facebook"
                  onClick={() => handleShare('facebook')}
                  aria-label="Partager sur Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  className="share-btn twitter"
                  onClick={() => handleShare('twitter')}
                  aria-label="Partager sur Twitter"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  className="share-btn linkedin"
                  onClick={() => handleShare('linkedin')}
                  aria-label="Partager sur LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button
                  className="share-btn copy"
                  onClick={() => handleShare('copy')}
                  aria-label="Copier le lien"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;

