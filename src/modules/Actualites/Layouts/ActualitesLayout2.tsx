import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout2.css';

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

// Layout 2 : Inspiré de Stripe Blog - Minimaliste, élégant, beaucoup d'espace blanc
const ActualitesLayout2 = () => {
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
    <div className="stripe-layout">
      <header className="stripe-header">
        <div className="container">
          <h1>Actualités</h1>
          <div className="stripe-search-wrapper">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="stripe-search"
            />
          </div>
        </div>
      </header>

      <section className="stripe-filters">
        <div className="container">
          <div className="stripe-filters-inner">
            <div className="stripe-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`stripe-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <select
              value={selectedPole}
              onChange={(e) => setSelectedPole(e.target.value)}
              className="stripe-select"
            >
              <option value="all">Tous les pôles</option>
              {poles.map(pole => (
                <option key={pole} value={pole}>{pole}</option>
              ))}
            </select>
          </div>

          {allTags.length > 0 && (
            <div className="stripe-tags">
              {allTags.slice(0, 12).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`stripe-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="stripe-articles">
        <div className="container">
          {loading ? (
            <div className="stripe-list">
              {[1, 2, 3, 4, 5].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="stripe-empty">
              <p>Aucun article trouvé</p>
            </div>
          ) : (
            <div className="stripe-list">
              {filteredArticles.map(article => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className="stripe-card"
                >
                  <div className="stripe-card-content">
                    <div className="stripe-card-header">
                      <span className="stripe-card-category">{article.category}</span>
                      <span className="stripe-card-date">
                        {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                    <div className="stripe-card-footer">
                      <span className="stripe-card-pole">{article.pole}</span>
                      <span>{article.readTime} min de lecture</span>
                    </div>
                  </div>
                  {article.featuredImage && (
                    <div className="stripe-card-image">
                      <img src={article.featuredImage} alt={article.title} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ActualitesLayout2;
