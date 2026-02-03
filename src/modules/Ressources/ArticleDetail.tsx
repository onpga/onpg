import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Ressources.css';

// Données fictives détaillées pour un article
const getArticleById = (id: string) => {
  const articles = [
    {
      id: '1',
      title: 'Nouveau décret sur la dispensation des médicaments',
      excerpt: 'Le ministre de la Santé annonce de nouvelles mesures concernant la dispensation des médicaments en officine.',
      content: `
        <p class="article-lead">Le ministre de la Santé et de la Protection sociale a annoncé ce jour de nouvelles mesures révolutionnaires concernant la dispensation des médicaments en officine. Ces changements visent à améliorer la sécurité des patients et à moderniser les pratiques pharmaceutiques.</p>

        <h2>Contexte et enjeux</h2>
        <p>Dans un contexte où la sécurité médicamenteuse constitue une priorité nationale, l'ONPG s'engage aux côtés du ministère de la Santé pour renforcer les protocoles de dispensation. Cette initiative s'inscrit dans la continuité des efforts déployés depuis plusieurs années pour améliorer la qualité des soins pharmaceutiques.</p>

        <blockquote class="article-quote">
          <p>"La sécurité des patients est notre priorité absolue. Ces nouvelles mesures permettront d'élever encore davantage les standards de qualité de notre profession."</p>
          <cite>- Dr. Marie Dupont, Présidente de l'ONPG</cite>
        </blockquote>

        <h2>Mesures principales</h2>
        <ul>
          <li><strong>Double vérification systématique</strong> : Chaque ordonnance fera l'objet d'une double vérification avant dispensation</li>
          <li><strong>Formation obligatoire</strong> : Tous les pharmaciens devront suivre une formation annuelle sur la sécurité médicamenteuse</li>
          <li><strong>Outils numériques</strong> : Mise en place d'un système informatisé de suivi des prescriptions</li>
          <li><strong>Contrôles qualité</strong> : Renforcement des audits internes dans les officines</li>
        </ul>

        <h2>Impact sur la profession</h2>
        <p>Ces nouvelles dispositions, bien que contraignantes, représentent une avancée majeure pour la profession pharmaceutique. Elles permettront non seulement d'améliorer la sécurité des patients, mais aussi de valoriser l'expertise des pharmaciens dans le système de santé gabonais.</p>

        <div class="article-stats-box">
          <div class="stat-item">
            <span class="stat-number">2,450</span>
            <span class="stat-label">Vues</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">89</span>
            <span class="stat-label">Partages</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">23</span>
            <span class="stat-label">Commentaires</span>
          </div>
        </div>

        <h2>Perspectives d'avenir</h2>
        <p>L'ONPG continuera à travailler en étroite collaboration avec les autorités de santé pour adapter ces mesures aux réalités du terrain et assurer leur mise en œuvre effective dans toutes les officines du Gabon.</p>
      `,
      author: {
        name: 'Dr. Marie Dupont',
        title: 'Présidente de l\'ONPG',
        bio: 'Pharmacienne spécialiste en santé publique avec plus de 15 ans d\'expérience dans la régulation pharmaceutique.',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        social: {
          linkedin: '#',
          twitter: '#'
        }
      },
      date: '2024-01-15',
      category: 'Réglementation',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=600&fit=crop',
      tags: ['décret', 'dispensation', 'médicaments', 'sécurité'],
      readTime: 5,
      featured: true,
      views: 2450,
      shares: 89,
      comments: 23,
      relatedArticles: ['2', '3', '4']
    },
    {
      id: '2',
      title: 'Formation continue : Nouvelles obligations pour 2024',
      excerpt: 'Découvrez les nouvelles exigences en matière de formation continue pour les pharmaciens.',
      content: `
        <p class="article-lead">L'ONPG annonce les nouvelles exigences en matière de formation continue pour l'année 2024. Ces mesures visent à maintenir et améliorer les compétences des professionnels de santé.</p>

        <h2>Nouvelles obligations</h2>
        <p>À compter du 1er janvier 2024, tous les pharmaciens exerçant au Gabon devront respecter de nouvelles exigences en matière de formation continue. Ces mesures s'inscrivent dans une démarche qualité et d'amélioration continue des soins.</p>

        <h2>Points clés</h2>
        <ul>
          <li><strong>20 heures minimum</strong> de formation par an</li>
          <li><strong>Domaines obligatoires</strong> : Sécurité médicamenteuse, pharmacologie, législation</li>
          <li><strong>Validation annuelle</strong> auprès de l'ONPG</li>
          <li><strong>Plateforme numérique</strong> pour le suivi des formations</li>
        </ul>

        <div class="article-highlight">
          <h3>📚 Formation digitale disponible</h3>
          <p>L'ONPG met à disposition une plateforme e-learning complète avec plus de 50 modules de formation interactifs.</p>
        </div>
      `,
      author: {
        name: 'Pr. Jean Martin',
        title: 'Directeur de la Formation',
        bio: 'Spécialiste en pédagogie pharmaceutique avec 20 ans d\'expérience dans la formation professionnelle.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        social: {
          linkedin: '#',
          twitter: '#'
        }
      },
      date: '2024-01-12',
      category: 'Formation',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop',
      tags: ['formation', 'obligation', '2024', 'e-learning'],
      readTime: 7,
      featured: false,
      views: 1890,
      shares: 67,
      comments: 15,
      relatedArticles: ['1', '3', '5']
    }
  ];

  return articles.find(article => article.id === id) || null;
};

// Composant ArticleDetail
const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      const articleData = getArticleById(id);
      if (articleData) {
        setArticle(articleData);
        // Simuler le chargement
        setTimeout(() => setLoading(false), 500);
      } else {
        navigate('/ressources/actualites');
      }
    }
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

  // Incrémenter les vues
  useEffect(() => {
    if (article) {
      // Simulation d'incrémentation des vues
      console.log('Vue incrémentée pour l\'article:', article.id);
    }
  }, [article]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Découvrez cet article : ${article.title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
    setShowShareModal(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // Afficher une notification de succès
    alert('Lien copié dans le presse-papiers !');
    setShowShareModal(false);
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
              <img src={article.author.avatar} alt={article.author.name} className="author-avatar" />
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
            <img src={article.image} alt={article.title} />
            {article.featured && (
              <div className="featured-overlay">
                <span className="featured-text">⭐ Article à la une</span>
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

            {/* Share Section */}
            <div className="article-share">
              <h3>Partager cet article :</h3>
              <div className="share-buttons">
                <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
                <button onClick={copyToClipboard} className="share-btn copy">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                  </svg>
                  Copier le lien
                </button>
              </div>
            </div>

            {/* Author Bio */}
            <div className="author-bio">
              <div className="author-bio-content">
                <img src={article.author.avatar} alt={article.author.name} className="author-bio-avatar" />
                <div className="author-bio-text">
                  <h3>À propos de l'auteur</h3>
                  <p>{article.author.bio}</p>
                  <div className="author-social">
                    <a href={article.author.social.linkedin} className="social-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href={article.author.social.twitter} className="social-link">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="article-sidebar">
            {/* Table of Contents */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Sommaire</h3>
              <nav className="table-of-contents">
                <a href="#introduction" className="toc-link">Introduction</a>
                <a href="#contexte" className="toc-link">Contexte et enjeux</a>
                <a href="#mesures" className="toc-link">Mesures principales</a>
                <a href="#impact" className="toc-link">Impact sur la profession</a>
                <a href="#perspectives" className="toc-link">Perspectives d'avenir</a>
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Statistiques</h3>
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-value">{article.views.toLocaleString()}</span>
                  <span className="stat-label">Vues</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{article.shares}</span>
                  <span className="stat-label">Partages</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{article.comments}</span>
                  <span className="stat-label">Commentaires</span>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Articles similaires</h3>
              <div className="related-articles">
                {article.relatedArticles.map((relatedId: string) => {
                  const relatedArticle = getArticleById(relatedId);
                  return relatedArticle ? (
                    <Link
                      key={relatedId}
                      to={`/ressources/actualites/${relatedId}`}
                      className="related-article"
                    >
                      <div className="related-image">
                        <img src={relatedArticle.image} alt={relatedArticle.title} />
                      </div>
                      <div className="related-content">
                        <h4>{relatedArticle.title.substring(0, 60)}...</h4>
                        <span className="related-category">{relatedArticle.category}</span>
                      </div>
                    </Link>
                  ) : null;
                })}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="sidebar-section newsletter-signup">
              <h3 className="sidebar-title">Restez informé</h3>
              <p>Recevez nos dernières actualités directement dans votre boîte mail.</p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  S'inscrire
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* Article Actions Bar */}
      <div className="article-actions-bar">
        <div className="actions-container">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`action-btn bookmark ${isBookmarked ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z"/>
            </svg>
            {isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}
          </button>

          <button onClick={() => setShowShareModal(true)} className="action-btn share">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.96 18.34C15.91 18.55 15.88 18.77 15.88 19C15.88 20.66 17.22 22 18.88 22S22 20.66 22 19 20.54 16 18.88 16C18.7 16 18.53 16.03 18.35 16.07L18 16.08Z"/>
            </svg>
            Partager
          </button>

          <Link to="/ressources/actualites" className="action-btn back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"/>
            </svg>
            Retour aux actualités
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

