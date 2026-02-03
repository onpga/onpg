import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../components/Skeleton';
import './Actualites.css';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  pole: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  author: {
    name: string;
    role: string;
  };
}

// Layout 1 : Inspiré de Notion Blog - Épuré, cards compactes, typographie soignée
const Actualites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedPole, setSelectedPole] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'pedagogique', label: 'Guides' },
    { id: 'actualites', label: 'Actualités' },
    { id: 'comparatifs', label: 'Comparatifs' },
    { id: 'innovations', label: 'Innovations' },
    { id: 'communiques', label: 'Communiqués' },
    { id: 'partenariats', label: 'Partenariats' }
  ];

  const poles = ['Énergie', 'Sécurité Numérique', 'Drone', 'Géospatial'];

  const categoryColors: {[key: string]: string} = {
    'pedagogique': '#252722',
    'actualites': '#034022',
    'comparatifs': '#1b77b6',
    'innovations': '#009b22',
    'communiques': '#ffce22',
    'partenariats': '#FF8C42'
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.id === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || '#002F6C';
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, selectedPole, searchQuery, selectedTag, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (selectedPole !== 'all') {
      filtered = filtered.filter(a => a.pole === selectedPole);
    }

    if (selectedTag) {
      filtered = filtered.filter(a => 
        a.tags && a.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.tags && a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    setFilteredArticles(filtered);
  };

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  return (
    <div className="actualites-page">
      {/* Hero Section */}
      <div className="actualites-hero">
        <div className="container">
          <div className="hero-content-wrapper">
            <h1>Actualités CIPS</h1>
            <p className="hero-subtitle">Restez informés des dernières actualités et innovations du secteur</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="container">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">
                  {cat.id === 'pedagogique' && '📚'}
                  {cat.id === 'actualites' && '📰'}
                  {cat.id === 'comparatifs' && '⚖️'}
                  {cat.id === 'innovations' && '💡'}
                  {cat.id === 'communiques' && '📋'}
                  {cat.id === 'partenariats' && '🤝'}
                  {cat.id === 'all' && '📖'}
                </span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="results-count">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      <div className="featured-articles-section">
        <div className="container">
          <h2 className="section-title">Articles à la une</h2>
          <div className="featured-grid">
            {filteredArticles.slice(0, 3).map(article => (
              <Link
                key={article._id}
                to={`/actualites/${article.slug}`}
                className="featured-article-card"
              >
                {article.featuredImage && (
                  <div className="featured-article-image">
                    <img src={article.featuredImage} alt={article.title} />
                    {article.featured && <div className="featured-badge">À la une</div>}
                    <div
                      className="article-category-badge"
                      style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                      {getCategoryLabel(article.category)}
                    </div>
                  </div>
                )}
                <div className="featured-article-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-meta">
                    <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                    <span>•</span>
                    <span>{article.readTime} min</span>
                  </div>
                  <div className="article-footer">
                    <span className="article-author">{article.author?.name || 'CIPS'}</span>
                    <span className="read-more">Lire l'article →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Regular Articles Grid */}
      <div className="articles-grid-section">
        <div className="container">
          <div className="articles-grid">
            {filteredArticles.slice(3).map(article => (
              <Link
                key={article._id}
                to={`/actualites/${article.slug}`}
                className="article-card"
              >
                {article.featuredImage && (
                  <div className="article-image">
                    <img src={article.featuredImage} alt={article.title} />
                    <div
                      className="article-category-badge-small"
                      style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                      {getCategoryLabel(article.category)}
                    </div>
                  </div>
                )}
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-tags">
                    {article.tags && article.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="article-actions">
                    <span className="read-more-link">Lire l'article</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des articles...</p>
        </div>
      )}

      {/* No results */}
      {!loading && filteredArticles.length === 0 && (
        <div className="no-results">
          <p>Aucun article trouvé pour votre recherche.</p>
        </div>
      )}
    </div>
  );
};

export default Actualites;
