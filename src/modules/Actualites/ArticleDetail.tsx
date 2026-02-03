import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArticleDetail.css';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  pole: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  views: number;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [similarArticles, setSimilarArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredSimilarArticle, setHoveredSimilarArticle] = useState<string | null>(null);
  const [showSuggestedSidebar, setShowSuggestedSidebar] = useState(false);
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  const hasAppearedRef = useRef(false);
  const sidebarDismissedRef = useRef(false);

  const categoryColors: {[key: string]: string} = {
    'pedagogique': '#252722',
    'actualites': '#034022',
    'comparatifs': '#1b77b6',
    'innovations': '#009b22',
    'communiques': '#ffce22',
    'partenariats': '#FF8C42'
  };

  const categoryLabels: {[key: string]: string} = {
    'pedagogique': 'Guides & Tutoriels',
    'actualites': 'Actualités',
    'comparatifs': 'Comparatifs',
    'innovations': 'Innovations',
    'communiques': 'Communiqués',
    'partenariats': 'Partenariats'
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || '#6c757d';
  };

  const getCategoryLabel = (category: string) => {
    return categoryLabels[category] || category;
  };

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
    // Charger les articles sauvegardés depuis localStorage (fonctionnalité à venir)
  }, [slug]);

  // Calculer les articles suggérés basés sur la catégorie
  useEffect(() => {
    console.log('📊 [Sidebar] Calcul suggestions:', { 
      hasArticle: !!article, 
      similarArticlesCount: similarArticles.length,
      articleTitle: article?.title
    });
    
    if (article && similarArticles.length > 0) {
      // Prendre les 3 premiers articles similaires
      const suggested = similarArticles.slice(0, 3);
      console.log('✅ [Sidebar] Articles suggérés:', suggested.length, suggested.map(a => a.title));
      setSuggestedArticles(suggested);
    } else {
      console.log('⚠️ [Sidebar] Pas d\'articles suggérés - article:', !!article, 'similar:', similarArticles.length);
      setSuggestedArticles([]);
    }
  }, [article, similarArticles]);

  // Vérifier si la sidebar a déjà été refusée ou affichée trop de fois
  useEffect(() => {
    const dismissed = localStorage.getItem('suggestedSidebarDismissed') === 'true';
    const showCount = parseInt(localStorage.getItem('suggestedSidebarShowCount') || '0', 10);
    
    console.log('🔍 [Sidebar] Vérification état:', { dismissed, showCount });
    
    // Pour les tests : réinitialiser si on est en développement et que le compteur est à 2
    // En production, on garde la limite de 2
    const isDev = process.env.NODE_ENV === 'development';
    const shouldReset = isDev && showCount >= 2 && !dismissed;
    
    if (shouldReset) {
      console.log('🔄 [Sidebar] Réinitialisation pour tests (dev mode)');
      localStorage.removeItem('suggestedSidebarShowCount');
      sidebarDismissedRef.current = false;
      return;
    }
    
    // Si refusée ou déjà affichée 2 fois, ne plus afficher
    if (dismissed || showCount >= 2) {
      console.log('❌ [Sidebar] Désactivée - dismissed:', dismissed, 'showCount:', showCount);
      sidebarDismissedRef.current = true;
      return;
    }
    
    console.log('✅ [Sidebar] Activée - peut être affichée');
    sidebarDismissedRef.current = false;
  }, []);

  // Gérer l'affichage de la sidebar selon le scroll - Apparaît en fin de lecture
  useEffect(() => {
    console.log('🔄 [Sidebar] Setup scroll listener - dismissed:', sidebarDismissedRef.current);
    
    // Si déjà refusée ou trop affichée, ne rien faire
    if (sidebarDismissedRef.current) {
      console.log('❌ [Sidebar] Désactivée par ref - ne pas afficher');
      setShowSuggestedSidebar(false);
      return;
    }
    
    // Réinitialiser quand on change d'article
    hasAppearedRef.current = false;
    setShowSuggestedSidebar(false);
    
    const handleScroll = () => {
      // Si déjà affichée ou refusée, ne rien faire
      if (hasAppearedRef.current || sidebarDismissedRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculer le pourcentage de scroll
      const scrollPercentage = (documentHeight - windowHeight > 0) 
        ? (scrollTop / (documentHeight - windowHeight)) * 100 
        : 0;
      
      console.log('📜 [Sidebar] Scroll:', { 
        scrollPercentage: Math.round(scrollPercentage), 
        scrollTop, 
        documentHeight, 
        windowHeight 
      });
      
      // Afficher la sidebar quand on approche de la fin (80% de scroll)
      if (scrollPercentage >= 80 && !hasAppearedRef.current) {
        const showCount = parseInt(localStorage.getItem('suggestedSidebarShowCount') || '0', 10);
        
        console.log('🎯 [Sidebar] Seuil atteint! Affichage - showCount:', showCount);
        
        // Incrémenter le compteur
        localStorage.setItem('suggestedSidebarShowCount', String(showCount + 1));
        
        setShowSuggestedSidebar(true);
        hasAppearedRef.current = true;
        console.log('✅ [Sidebar] Affichée!');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Vérifier au chargement initial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [article]);

  // Détecter les clics en dehors de la sidebar pour la masquer définitivement
  useEffect(() => {
    if (!showSuggestedSidebar) return;

    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.querySelector('.suggested-articles-sidebar');
      if (sidebar && !sidebar.contains(e.target as Node)) {
        // L'utilisateur a cliqué en dehors, masquer définitivement
        setShowSuggestedSidebar(false);
        localStorage.setItem('suggestedSidebarDismissed', 'true');
        sidebarDismissedRef.current = true;
      }
    };

    // Attendre un peu avant d'activer la détection (pour éviter les clics accidentels)
    const timeout = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 500);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSuggestedSidebar]);

  // Mettre à jour les meta tags pour le partage social
  useEffect(() => {
    if (article) {
      // Meta tags généraux
      document.title = article.seo?.metaTitle || article.title;
      
      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', article.seo?.metaDescription || article.excerpt);
      
      // Open Graph pour Facebook
      const ogTags = [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: article.title },
        { property: 'og:description', content: article.excerpt },
        { property: 'og:image', content: article.featuredImage },
        { property: 'og:url', content: window.location.href },
        { property: 'og:site_name', content: 'CIPS - Conception Innovante pour la Sécurité' },
        { property: 'article:published_time', content: article.publishedAt },
        { property: 'article:author', content: article.author.name }
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

      // Twitter Card
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: article.title },
        { name: 'twitter:description', content: article.excerpt },
        { name: 'twitter:image', content: article.featuredImage }
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
    }
  }, [article]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setArticle(data.data);
        // Fetch similar articles
        fetchSimilarArticles(slug!);
      } else {
        setError('Article non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarArticles = async (articleSlug: string) => {
    try {
      const response = await fetch(`/api/articles/${articleSlug}/similar`);
      const data = await response.json();
      
      if (data.success) {
        setSimilarArticles(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement articles similaires:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const shareArticle = (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt;
    
    const shareUrls: {[key: string]: string} = {
      // Facebook Feed Dialog avec quote (fonctionne mieux)
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + ' - ' + text)}`,
      // Twitter avec texte complet
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${article.tags.slice(0, 3).join(',')}`,
      // LinkedIn avec texte
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      // WhatsApp avec texte formaté
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent('📰 ' + title + '\n\n' + text + '\n\n👉 ' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer,width=600,height=700');
    }
  };


  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ Lien copié dans le presse-papiers !');
    }).catch(() => {
      // Fallback pour navigateurs anciens
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Lien copié dans le presse-papiers !');
    });
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <Link to="/actualites" className="back-btn">← Retour aux actualités</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Accueil</Link>
          <span> / </span>
          <Link to="/actualites">Actualités</Link>
          <span> / </span>
          <span>{article.title}</span>
        </div>
      </div>

      {/* Article Header avec Image en arrière-plan */}
      <article className="article-container">
        <section className="article-hero">
          <div className="article-hero-image">
            <img src={article.featuredImage} alt={article.title} />
            <div className="article-hero-overlay">
              <div className="container">
                <div className="article-header-content">
                  <div className="article-meta-top">
                    <span className="article-category" style={{ 
                      backgroundColor: getCategoryColor(article.category),
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>{getCategoryLabel(article.category)}</span>
                    <span className="article-read-time">{article.readTime} min de lecture</span>
                  </div>

                  <h1 className="article-title">{article.title}</h1>
                  
                  <p className="article-excerpt">{article.excerpt}</p>

                  <div className="article-author-info">
                    <div className="author-details">
                      <div className="author-avatar">
                        {article.author.avatar ? (
                          <img src={article.author.avatar} alt={article.author.name} />
                        ) : (
                          <div className="avatar-placeholder">✍️</div>
                        )}
                      </div>
                      <div className="author-text">
                        <p className="author-name">{article.author.name}</p>
                        <p className="author-role">{article.author.role}</p>
                      </div>
                    </div>
                    <div className="article-date">
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <div className="article-main">
          <div className="container">
            <div className="article-layout">
              {/* Main Content */}
              <div className="article-content">
                <div 
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="article-tags-section">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="article-share-section">
                  <h3>Partager cet article</h3>
                  <div className="share-buttons">
                    <button onClick={() => shareArticle('facebook')} className="share-btn facebook" title="Partager sur Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button onClick={() => shareArticle('twitter')} className="share-btn twitter" title="Partager sur Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button onClick={() => shareArticle('linkedin')} className="share-btn linkedin" title="Partager sur LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button onClick={() => shareArticle('whatsapp')} className="share-btn whatsapp" title="Partager sur WhatsApp">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    <button onClick={copyLink} className="share-btn copy" title="Copier le lien">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="article-sidebar">
                {/* Quick Stats */}
                <div className="sidebar-card stats-card">
                  <h3 className="stats-title">Statistiques</h3>
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-icon-wrapper views-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value">{article.views}</div>
                        <div className="stat-label">Vues</div>
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-icon-wrapper time-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <div className="stat-content">
                        <div className="stat-value">{article.readTime} min</div>
                        <div className="stat-label">Lecture</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="sidebar-card cta-card">
                  <h3>Besoin d'expertise ?</h3>
                  <p>Nos experts CIPS sont là pour vous accompagner dans vos projets.</p>
                  <Link to="/devis" className="cta-btn">Demander un devis</Link>
                  <Link to="/contact" className="cta-btn-secondary">Nous contacter</Link>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Similar Articles */}
        {similarArticles.length > 0 && (
          <div className="similar-articles-section">
            <div className="container">
              <h2 className="section-title">📰 Articles similaires</h2>
              <div className="similar-articles-grid">
                {similarArticles.map(simArticle => (
                  <div
                    key={simArticle._id}
                    className="similar-article-card-wrapper"
                    onMouseEnter={() => setHoveredSimilarArticle(simArticle._id)}
                    onMouseLeave={() => setHoveredSimilarArticle(null)}
                  >
                    <Link 
                      to={`/actualites/${simArticle.slug}`} 
                      className="similar-article-card"
                    >
                      <div className="similar-article-image">
                        <img src={simArticle.featuredImage} alt={simArticle.title} />
                        {simArticle.readTime <= 3 && (
                          <span className="quick-read-badge" title="Lecture rapide">
                            ⚡ {simArticle.readTime} min
                          </span>
                        )}
                      </div>
                      <div className="similar-article-content">
                        <h4>{simArticle.title}</h4>
                        <p>{simArticle.excerpt}</p>
                        <div className="similar-article-actions">
                          <span 
                            className="read-more magnetic-btn"
                            onMouseMove={(e) => {
                              const btn = e.currentTarget;
                              const rect = btn.getBoundingClientRect();
                              const x = e.clientX - rect.left - rect.width / 2;
                              const y = e.clientY - rect.top - rect.height / 2;
                              btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translate(0, 0)';
                            }}
                          >
                            Lire l'article →
                          </span>
                        </div>
                      </div>
                    </Link>
                    {hoveredSimilarArticle === simArticle._id && (
                      <div className="article-preview-overlay">
                        <div className="preview-content">
                          <h4>{simArticle.title}</h4>
                          <p>{simArticle.excerpt}</p>
                          <Link to={`/actualites/${simArticle.slug}`} className="preview-read-btn">
                            Lire l'article →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Sidebar "Vous pourriez aimer" - Apparaît en fin de lecture */}
      {(() => {
        const dismissed = localStorage.getItem('suggestedSidebarDismissed') === 'true';
        const showCount = parseInt(localStorage.getItem('suggestedSidebarShowCount') || '0', 10);
        console.log('🎨 [Sidebar] Render check:', { 
          showSuggestedSidebar, 
          suggestedArticlesCount: suggestedArticles.length,
          dismissed: sidebarDismissedRef.current,
          localStorageDismissed: dismissed,
          localStorageShowCount: showCount,
          hasAppeared: hasAppearedRef.current
        });
        return null;
      })()}
      {showSuggestedSidebar && suggestedArticles.length > 0 && (
        <aside className="suggested-articles-sidebar">
          <div className="suggested-header">
            <h3>📌 Vous pourriez aimer</h3>
            <button
              className="suggested-close-btn"
              onClick={() => {
                setShowSuggestedSidebar(false);
                localStorage.setItem('suggestedSidebarDismissed', 'true');
                sidebarDismissedRef.current = true;
              }}
              title="Fermer"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
          <div className="suggested-list">
            {suggestedArticles.map(article => (
              <Link
                key={article._id}
                to={`/actualites/${article.slug}`}
                className="suggested-article-item"
              >
                <div className="suggested-article-image">
                  <img src={article.featuredImage} alt={article.title} />
                </div>
                <div className="suggested-article-info">
                  <h4>{article.title}</h4>
                  <span className="suggested-article-time">{article.readTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* Back Button */}
      <div className="back-section">
        <div className="container">
          <Link to="/actualites" className="back-link">← Retour aux actualités</Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

