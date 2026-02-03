import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout7.css';

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

// Layout 7 : Glassmorphism + Glow Design - Effets lumineux futuristes, cartes en verre dépoli
const ActualitesLayout7 = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedPole, setSelectedPole] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    <div className="glass-layout">
      <div className="glass-background-glow"></div>
      
      <header className="glass-header">
        <div className="container">
          <h1 className="glass-title">
            <span className="glass-title-glow">Actualités</span> CIPS
          </h1>
          <p className="glass-subtitle">Innovation & Excellence</p>
        </div>
      </header>

      <section className="glass-filters">
        <div className="container">
          <div className="glass-search-wrapper">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-search"
            />
            <div className="glass-search-glow"></div>
          </div>

          <div className="glass-filters-row">
            <div className="glass-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`glass-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="glass-btn-glow"></span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="glass-poles">
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="glass-pole-select"
              >
                <option value="all">Tous les pôles</option>
                {poles.map(pole => (
                  <option key={pole} value={pole}>{pole}</option>
                ))}
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="glass-tags">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`glass-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="glass-articles">
        <div className="container">
          {loading ? (
            <div className="glass-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="glass-empty">
              <p>Aucun article trouvé</p>
            </div>
          ) : (
            <div className="glass-grid">
              {filteredArticles.map(article => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className={`glass-card ${hoveredCard === article._id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredCard(article._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="glass-card-glow"></div>
                  <div className="glass-card-backdrop"></div>
                  
                  {article.featuredImage && (
                    <div className="glass-card-image">
                      <img src={article.featuredImage} alt={article.title} />
                      <div className="glass-image-overlay"></div>
                    </div>
                  )}
                  
                  <div className="glass-card-content">
                    <div className="glass-card-meta">
                      <span className="glass-card-category">{article.category}</span>
                      <span className="glass-card-pole">{article.pole}</span>
                    </div>
                    <h3 className="glass-card-title">{article.title}</h3>
                    <p className="glass-card-excerpt">{article.excerpt}</p>
                    <div className="glass-card-footer">
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                      <span>⚡ {article.readTime} min</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="glass-card-tags">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="glass-card-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ActualitesLayout7;







