import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Layout20.css';

const mockArticles = [
  {
    id: '1',
    title: 'Le prix des panneaux solaires baisse de 30% en 2024',
    excerpt: 'La chute des prix mondiaux des panneaux photovoltaïques rend l\'énergie solaire plus accessible que jamais au Gabon.',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400',
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1400',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400'
    ],
    category: 'Actualités',
    pole: 'Énergie',
    date: '6 nov',
    readTime: 6
  },
  {
    id: '2',
    title: 'Nouveaux protocoles de sécurité pour les infrastructures critiques',
    excerpt: 'Mise en place de solutions de cybersécurité avancées pour protéger les systèmes essentiels du Gabon.',
    images: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1400',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400'
    ],
    category: 'Innovations',
    pole: 'Sécurité Numérique',
    date: '4 nov',
    readTime: 8
  },
  {
    id: '3',
    title: 'Inspection de lignes électriques par drone',
    excerpt: 'Utilisation de drones équipés de caméras thermiques pour l\'inspection préventive des réseaux électriques.',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1400',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1400'
    ],
    category: 'Guides',
    pole: 'Drone',
    date: '2 nov',
    readTime: 5
  },
  {
    id: '4',
    title: 'Cartographie 3D des zones urbaines de Libreville',
    excerpt: 'Projet de modélisation géospatiale pour l\'aménagement urbain et la planification des infrastructures.',
    images: [
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400'
    ],
    category: 'Actualités',
    pole: 'Géospatial',
    date: '1 nov',
    readTime: 7
  }
];

const ActualitesLayout20 = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const article = mockArticles[currentIndex];
  const currentImage = article.images[imageIndex] || article.images[0];

  useEffect(() => {
    const interval = setInterval(() => {
      if (imageIndex < article.images.length - 1) {
        setImageIndex(imageIndex + 1);
      } else {
        setImageIndex(0);
        if (currentIndex < mockArticles.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [imageIndex, currentIndex, article.images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      if (distance > 0 && currentIndex < mockArticles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setImageIndex(0);
      } else if (distance < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setImageIndex(0);
      }
    }
  };

  const nextArticle = () => {
    if (currentIndex < mockArticles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageIndex(0);
    }
  };

  const prevArticle = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageIndex(0);
    }
  };

  const nextImage = () => {
    if (imageIndex < article.images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else {
      setImageIndex(0);
    }
  };

  return (
    <div className="layout20-page">
      <div 
        className="fullscreen-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="carousel-background"
          style={{ backgroundImage: `url(${currentImage})` }}
        >
          <div className="carousel-overlay"></div>
        </div>

        <div className="carousel-progress">
          {mockArticles.map((_, idx) => (
            <div key={idx} className="progress-bar">
              <div 
                className={`progress-fill ${idx === currentIndex ? 'active' : ''}`}
                style={{ 
                  width: idx === currentIndex ? '100%' : idx < currentIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        <div className="carousel-content">
          <div className="container">
            <div className="carousel-badges">
              <span className="carousel-category">{article.category}</span>
              <span className="carousel-pole">{article.pole}</span>
            </div>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="carousel-meta">
              <span>{article.date}</span>
              <span>{article.readTime} min</span>
            </div>
            <Link to={`/actualites/${article.id}`} className="carousel-cta">
              Lire l'article complet →
            </Link>
          </div>
        </div>

        {article.images.length > 1 && (
          <div className="carousel-image-nav">
            <button type="button" className="image-nav-btn" onClick={nextImage}>
              Image suivante ({imageIndex + 1}/{article.images.length})
            </button>
            <div className="image-dots">
              {article.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`image-dot ${idx === imageIndex ? 'active' : ''}`}
                  onClick={() => setImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="carousel-nav">
          <button 
            type="button" 
            className="carousel-nav-btn prev" 
            onClick={prevArticle}
            disabled={currentIndex === 0}
          >
            ‹
          </button>
          <div className="carousel-thumbnails">
            {mockArticles.map((art, idx) => (
              <button
                key={art.id}
                type="button"
                className={`carousel-thumb ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setImageIndex(0);
                }}
              >
                <img src={art.images[0]} alt={art.title} />
              </button>
            ))}
          </div>
          <button 
            type="button" 
            className="carousel-nav-btn next" 
            onClick={nextArticle}
            disabled={currentIndex === mockArticles.length - 1}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualitesLayout20;







