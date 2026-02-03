import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout9.css';

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

// Layout 9 : Formes Organiques + Asymétrie - Design fluide moderne, formes courbes, mise en page asymétrique
const ActualitesLayout9 = () => {
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
    <div className="organic-layout">
      <div className="organic-bg-shapes">
        <div className="organic-shape organic-shape-1"></div>
        <div className="organic-shape organic-shape-2"></div>
        <div className="organic-shape organic-shape-3"></div>
      </div>

      <header className="organic-header">
        <div className="container">
          <div className="organic-header-content">
            <h1 className="organic-title">
              Actualités
              <span className="organic-title-accent">CIPS</span>
            </h1>
            <p className="organic-subtitle">Innovation & Excellence</p>
          </div>
        </div>
      </header>

      <section className="organic-filters">
        <div className="container">
          <div className="organic-search-wrapper">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="organic-search"
            />
          </div>

          <div className="organic-filters-row">
            <div className="organic-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`organic-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="organic-poles">
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="organic-pole-select"
              >
                <option value="all">Tous les pôles</option>
                {poles.map(pole => (
                  <option key={pole} value={pole}>{pole}</option>
                ))}
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="organic-tags">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`organic-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="organic-articles">
        <div className="container">
          {loading ? (
            <div className="organic-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="organic-empty">
              <p>Aucun article trouvé</p>
            </div>
          ) : (
            <div className="organic-grid">
              {filteredArticles.map((article, index) => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className={`organic-card ${index % 3 === 0 ? 'organic-card-large' : ''} ${index % 5 === 0 ? 'organic-card-tilt-left' : ''} ${index % 7 === 0 ? 'organic-card-tilt-right' : ''}`}
                >
                  <div className="organic-card-blob"></div>
                  
                  {article.featuredImage && (
                    <div className="organic-card-image">
                      <img src={article.featuredImage} alt={article.title} />
                      <div className="organic-image-mask"></div>
                    </div>
                  )}
                  
                  <div className="organic-card-content">
                    <div className="organic-card-meta">
                      <span className="organic-card-category">{article.category}</span>
                      <span className="organic-card-pole">{article.pole}</span>
                    </div>
                    <h3 className="organic-card-title">{article.title}</h3>
                    <p className="organic-card-excerpt">{article.excerpt}</p>
                    <div className="organic-card-footer">
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                      <span>⚡ {article.readTime} min</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="organic-card-tags">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="organic-card-tag">#{tag}</span>
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

export default ActualitesLayout9;







