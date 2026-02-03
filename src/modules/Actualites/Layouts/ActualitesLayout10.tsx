import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout10.css';

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

// Layout 10 : Rétrofuturisme + Brutalisme Moderne - Typographie audacieuse, grilles strictes, esthétique rétro-futuriste
const ActualitesLayout10 = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedPole, setSelectedPole] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'TOUS' },
    { id: 'pedagogique', label: 'GUIDES' },
    { id: 'actualites', label: 'ACTUALITÉS' },
    { id: 'comparatifs', label: 'COMPARATIFS' },
    { id: 'innovations', label: 'INNOVATIONS' },
    { id: 'communiques', label: 'COMMUNIQUÉS' },
    { id: 'partenariats', label: 'PARTENARIATS' }
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
    <div className="brutal-layout">
      <div className="brutal-grid-bg"></div>

      <header className="brutal-header">
        <div className="container">
          <div className="brutal-header-content">
            <h1 className="brutal-title">
              <span className="brutal-title-main">ACTUALITÉS</span>
              <span className="brutal-title-accent">CIPS</span>
            </h1>
            <div className="brutal-header-line"></div>
            <p className="brutal-subtitle">INNOVATION & EXCELLENCE</p>
          </div>
        </div>
      </header>

      <section className="brutal-filters">
        <div className="container">
          <div className="brutal-search-wrapper">
            <input
              type="text"
              placeholder="RECHERCHER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="brutal-search"
            />
          </div>

          <div className="brutal-filters-row">
            <div className="brutal-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`brutal-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="brutal-poles">
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="brutal-pole-select"
              >
                <option value="all">TOUS LES PÔLES</option>
                {poles.map(pole => (
                  <option key={pole} value={pole}>{pole.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="brutal-tags">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`brutal-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  #{tag.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="brutal-articles">
        <div className="container">
          {loading ? (
            <div className="brutal-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="brutal-empty">
              <p>AUCUN ARTICLE TROUVÉ</p>
            </div>
          ) : (
            <div className="brutal-grid">
              {filteredArticles.map((article, index) => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className={`brutal-card ${index % 4 === 0 ? 'brutal-card-featured' : ''}`}
                >
                  <div className="brutal-card-border"></div>
                  
                  {article.featuredImage && (
                    <div className="brutal-card-image">
                      <img src={article.featuredImage} alt={article.title} />
                      <div className="brutal-image-overlay"></div>
                    </div>
                  )}
                  
                  <div className="brutal-card-content">
                    <div className="brutal-card-meta">
                      <span className="brutal-card-category">{article.category.toUpperCase()}</span>
                      <span className="brutal-card-pole">{article.pole.toUpperCase()}</span>
                    </div>
                    <h3 className="brutal-card-title">{article.title.toUpperCase()}</h3>
                    <p className="brutal-card-excerpt">{article.excerpt}</p>
                    <div className="brutal-card-footer">
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }).toUpperCase()}</span>
                      <span>⚡ {article.readTime} MIN</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="brutal-card-tags">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="brutal-card-tag">#{tag.toUpperCase()}</span>
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

export default ActualitesLayout10;







