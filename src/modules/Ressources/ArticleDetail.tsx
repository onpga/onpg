import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../../utils/imageFallback';
import './Ressources.css';
import './Actualites.css';
import { fetchResourceById } from '../../utils/pageMocksApi';
import { updateMetaTag, updateOpenGraph, updateTwitterCard, updateCanonical } from '../../utils/seo';

interface RessourceArticle {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  author?: {
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
    };
  };
  date?: string;
  category?: string;
  image?: string;
  tags?: string[];
  readTime?: number;
  featured?: boolean;
  views?: number;
  shares?: number;
  comments?: number;
}

// Composant ArticleDetail
const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  const normalizeImageUrl = (url?: string) => {
    if (!url || !url.trim()) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url;
    return `https://res.cloudinary.com/dduvinjnu/image/upload/${url.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        navigate('/ressources/actualites');
        return;
      }

      try {
        const data = await fetchResourceById('actualites', id);
        if (data) {
          const articleData: RessourceArticle = {
            _id: data._id as string,
            title: data.title || 'Sans titre',
            excerpt: data.excerpt || data.summary || '',
            content: data.content || '',
            author: {
              name: data.author?.name || 'ONPG',
              title: data.author?.title || data.author?.role || '',
              bio: data.author?.bio || '',
              avatar: data.author?.avatar || '',
              social: data.author?.social || {}
            },
            date: data.date || data.publishedAt || new Date().toISOString(),
            category: data.category || 'Actualités',
            image: data.image || data.featuredImage || '',
            tags: data.tags || [],
            readTime: data.readTime || 5,
            featured: data.featured || false,
            views: data.views || 0,
            shares: data.shares || 0,
            comments: data.comments || 0
          };
          setArticle(articleData);
          setLoading(false);
        } else {
          navigate('/ressources/actualites');
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'actualité:', error);
        navigate('/ressources/actualites');
      }
    };

    loadArticle();
  }, [id, navigate]);

  // Barre de progression de lecture
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mettre à jour les meta tags pour le partage social (méthode CSIP)
  useEffect(() => {
    if (article) {
      // Utiliser l'URL absolue avec le domaine
      const currentUrl = window.location.href.split('?')[0]; // Enlever les paramètres pour l'URL canonique
      // S'assurer que l'image est une URL absolue
      let imageUrl = article.image || 'https://res.cloudinary.com/dduvinjnu/image/upload/LOGO_ONPG_gvlag2.png';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://res.cloudinary.com/dduvinjnu/image/upload/${imageUrl}`;
      }
      const description = article.excerpt || article.content?.substring(0, 200) || 'Découvrez cet article sur le site de l\'ONPG';

      // Title et description
      document.title = `${article.title} | ONPG - Actualités`;
      
      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Open Graph pour Facebook (méthode CSIP - création directe)
      const ogTags = [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: article.title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:url', content: currentUrl },
        { property: 'og:site_name', content: 'ONPG - Ordre National de Pharmacie du Gabon' },
        { property: 'article:published_time', content: new Date(article.date || Date.now()).toISOString() },
        { property: 'article:author', content: article.author?.name || 'ONPG' }
      ];

      ogTags.forEach(tag => {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', tag.property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });

      if (article.category) {
        let metaTag = document.querySelector('meta[property="article:section"]');
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', 'article:section');
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', article.category);
      }

      // Twitter Card (méthode CSIP - création directe)
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: article.title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl }
      ];

      twitterTags.forEach(tag => {
        let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', tag.name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });

      // Canonical
      updateCanonical(currentUrl);
    }
  }, [article]);

  const handleShare = (platform: string) => {
    // Ajouter un paramètre de version pour forcer le rafraîchissement du cache Facebook
    const baseUrl = window.location.href.split('?')[0]; // Enlever les paramètres existants
    const url = `${baseUrl}?v=${Date.now()}`;
    const text = `Découvrez cet article : ${article.title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      // Ouvrir une fenêtre popup au lieu d'un nouvel onglet
      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(
        shareUrls[platform as keyof typeof shareUrls],
        'share',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no`
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // Afficher une notification de succès plus élégante
    const notification = document.createElement('div');
    notification.textContent = '✅ Lien copié dans le presse-papiers !';
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, #00A651, #008F45);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 166, 81, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
          <div className="skeleton-sidebar"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-page">
        <div className="error-state">
          <h1>Article non trouvé</h1>
          <p>Cet article n'existe pas ou a été supprimé.</p>
          <Link to="/ressources/actualites" className="back-link">
            ← Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${readingProgress}%` }}></div>

      {/* Article Header */}
      <header className="article-header">
        <div className="article-header-content">
          {/* Breadcrumb */}
          <nav className="article-breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="separator">›</span>
            <Link to="/ressources/actualites">Actualités</Link>
            <span className="separator">›</span>
            <span className="current">Article</span>
          </nav>

          {/* Category Badge */}
          <div className="article-category-badge">{article.category}</div>

          {/* Title */}
          <h1 className="article-title">{article.title}</h1>

          {/* Meta Information */}
          <div className="article-meta">
            <div className="article-author">
              {article.author.avatar ? (
                <ImageWithFallback
                  src={normalizeImageUrl(article.author.avatar)}
                  fallbackType="profile"
                  alt={article.author.name}
                  className="author-avatar"
                />
              ) : (
                <div className="author-avatar" style={{
                  background: 'linear-gradient(135deg, #00A651, #008F45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {article.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="author-info">
                <span className="author-name">{article.author.name}</span>
                <span className="author-title">{article.author.title}</span>
              </div>
            </div>
            <div className="article-stats">
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
                </svg>
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                {article.readTime} min de lecture
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                </svg>
                {article.views.toLocaleString()} vues
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="article-hero-image">
            <ImageWithFallback
              src={normalizeImageUrl(article.image)}
              fallbackType="article"
              alt={article.title}
            />
            {article.featured && (
              <div className="featured-overlay">
                <span className="featured-text">Article à la une</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="article-content-wrapper">
        <div className="article-content-container">
          {/* Main Content */}
          <main className="article-main">
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="article-tags">
              <h3>Tags associés :</h3>
              <div className="tags-list">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section - Design épuré avec icônes uniquement */}
            <div className="article-share">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }}>
                  <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.96 18.34C15.91 18.55 15.88 18.77 15.88 19C15.88 20.66 17.22 22 18.88 22S22 20.66 22 19 20.54 16 18.88 16C18.7 16 18.53 16.03 18.35 16.07L18 16.08Z"/>
                </svg>
                Partager
              </h3>
              <div className="share-buttons">
                <button onClick={() => handleShare('facebook')} className="share-btn facebook" aria-label="Partager sur Facebook" title="Partager sur Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button onClick={() => handleShare('twitter')} className="share-btn twitter" aria-label="Partager sur Twitter" title="Partager sur Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button onClick={() => handleShare('linkedin')} className="share-btn linkedin" aria-label="Partager sur LinkedIn" title="Partager sur LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button onClick={copyToClipboard} className="share-btn copy" aria-label="Copier le lien" title="Copier le lien">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Author Bio */}
            {article.author.bio && (
              <div className="author-bio">
                <div className="author-bio-content">
                  {article.author.avatar ? (
                    <ImageWithFallback
                      src={normalizeImageUrl(article.author.avatar)}
                      fallbackType="profile"
                      alt={article.author.name}
                      className="author-bio-avatar"
                    />
                  ) : (
                    <div className="author-bio-avatar" style={{
                      background: 'linear-gradient(135deg, #00A651, #008F45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: '700'
                    }}>
                      {article.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="author-bio-text">
                    <h3>À propos de l'auteur</h3>
                    <p>{article.author.bio}</p>
                    {(article.author.social?.linkedin || article.author.social?.twitter) && (
                      <div className="author-social">
                        {article.author.social.linkedin && (
                          <a href={article.author.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                        {article.author.social.twitter && (
                          <a href={article.author.social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Back Section */}
      <div className="back-section">
        <div className="container">
          <Link to="/ressources/actualites" className="back-link">
            ← Retour aux actualités
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

