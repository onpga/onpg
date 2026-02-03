import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout8.css';

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

// Layout 8 : 3D Interactif + Parallax - Effets 3D immersifs, cartes flottantes avec perspective
const ActualitesLayout8 = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedPole, setSelectedPole] = useState<string>('all');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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
    <div className="d3-layout" ref={containerRef}>
      <div 
        className="d3-cursor-light"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      ></div>

      <header className="d3-header">
        <div className="container">
          <h1 className="d3-title">
            <span className="d3-title-3d">Actualités</span>
            <span className="d3-title-shadow">Actualités</span>
          </h1>
          <p className="d3-subtitle">CIPS Innovation Hub</p>
        </div>
      </header>

      <section className="d3-filters">
        <div className="container">
          <div className="d3-search-wrapper">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="d3-search"
            />
          </div>

          <div className="d3-filters-row">
            <div className="d3-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`d3-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="d3-poles">
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="d3-pole-select"
              >
                <option value="all">Tous les pôles</option>
                {poles.map(pole => (
                  <option key={pole} value={pole}>{pole}</option>
                ))}
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="d3-tags">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`d3-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="d3-articles">
        <div className="container">
          {loading ? (
            <div className="d3-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="d3-empty">
              <p>Aucun article trouvé</p>
            </div>
          ) : (
            <div className="d3-grid">
              {filteredArticles.map((article, index) => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className="d3-card"
                  style={{
                    '--index': index,
                    '--mouse-x': `${mousePosition.x}px`,
                    '--mouse-y': `${mousePosition.y}px`
                  } as React.CSSProperties}
                >
                  <div className="d3-card-3d">
                    <div className="d3-card-face d3-card-front">
                      {article.featuredImage && (
                        <div className="d3-card-image">
                          <img src={article.featuredImage} alt={article.title} />
                        </div>
                      )}
                      <div className="d3-card-content">
                        <div className="d3-card-meta">
                          <span className="d3-card-category">{article.category}</span>
                          <span className="d3-card-pole">{article.pole}</span>
                        </div>
                        <h3 className="d3-card-title">{article.title}</h3>
                        <p className="d3-card-excerpt">{article.excerpt}</p>
                        <div className="d3-card-footer">
                          <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                          <span>⚡ {article.readTime} min</span>
                        </div>
                        {article.tags && article.tags.length > 0 && (
                          <div className="d3-card-tags">
                            {article.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="d3-card-tag">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d3-card-face d3-card-back"></div>
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

export default ActualitesLayout8;







