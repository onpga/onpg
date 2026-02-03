import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout3.css';

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

// Layout 3 : Inspiré de Linear Blog - Futuriste, animations, dark mode ready
const ActualitesLayout3 = () => {
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
    <div className="linear-layout">
      <header className="linear-header">
        <div className="container">
          <h1>Actualités</h1>
          <div className="linear-search-bar">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="linear-search-input"
            />
          </div>
        </div>
      </header>

      <section className="linear-filters">
        <div className="container">
          <div className="linear-filters-grid">
            <div className="linear-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`linear-filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <select
              value={selectedPole}
              onChange={(e) => setSelectedPole(e.target.value)}
              className="linear-select"
            >
              <option value="all">Tous les pôles</option>
              {poles.map(pole => (
                <option key={pole} value={pole}>{pole}</option>
              ))}
            </select>
          </div>

          {allTags.length > 0 && (
            <div className="linear-tags">
              {allTags.slice(0, 15).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`linear-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="linear-articles">
        <div className="container">
          {loading ? (
            <div className="linear-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="linear-empty">
              <p>Aucun article trouvé</p>
            </div>
          ) : (
            <div className="linear-grid">
              {filteredArticles.map(article => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className="linear-card"
                >
                  {article.featuredImage && (
                    <div className="linear-card-image">
                      <img src={article.featuredImage} alt={article.title} />
                      <div className="linear-card-overlay" />
                    </div>
                  )}
                  <div className="linear-card-content">
                    <div className="linear-card-badge">
                      <span>{article.category}</span>
                      <span>{article.pole}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <div className="linear-card-footer">
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      <span>·</span>
                      <span>{article.readTime} min</span>
                    </div>
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

export default ActualitesLayout3;
