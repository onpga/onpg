import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../../components/Skeleton';
import './Layout6.css';

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
  author: { name: string; role: string; };
}

// Layout 6 : Inspiré de Webflow Blog - Designer, grid créatif
const ActualitesLayout6 = () => {
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

  useEffect(() => { fetchArticles(); }, []);
  useEffect(() => { filterArticles(); }, [selectedCategory, selectedPole, searchQuery, selectedTag, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.success) setArticles(data.data);
    } catch (err) { console.error('Erreur:', err); } finally { setLoading(false); }
  };

  const filterArticles = () => {
    let filtered = articles;
    if (selectedCategory !== 'all') filtered = filtered.filter(a => a.category === selectedCategory);
    if (selectedPole !== 'all') filtered = filtered.filter(a => a.pole === selectedPole);
    if (selectedTag) filtered = filtered.filter(a => a.tags && a.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()));
    if (searchQuery) filtered = filtered.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || (a.tags && a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))));
    setFilteredArticles(filtered);
  };

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  return (
    <div className="webflow-layout">
      <header className="webflow-header">
        <div className="container">
          <h1>Actualités</h1>
          <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="webflow-search" />
        </div>
      </header>
      <section className="webflow-filters">
        <div className="container">
          <div className="webflow-filters-row">
            <div className="webflow-categories">
              {categories.map(cat => (
                <button key={cat.id} type="button" className={`webflow-category ${selectedCategory === cat.id ? 'active' : ''}`} onClick={() => setSelectedCategory(cat.id)}>{cat.label}</button>
              ))}
            </div>
            <select value={selectedPole} onChange={(e) => setSelectedPole(e.target.value)} className="webflow-select">
              <option value="all">Tous les pôles</option>
              {poles.map(pole => <option key={pole} value={pole}>{pole}</option>)}
            </select>
          </div>
          {allTags.length > 0 && (
            <div className="webflow-tags">
              {allTags.slice(0, 10).map(tag => (
                <button key={tag} type="button" className={`webflow-tag ${selectedTag === tag ? 'active' : ''}`} onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}>{tag}</button>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="webflow-articles">
        <div className="container">
          {loading ? <div className="webflow-grid">{[1, 2, 3, 4, 5, 6].map(i => <SkeletonArticle key={i} />)}</div> : filteredArticles.length === 0 ? <div className="webflow-empty"><p>Aucun article trouvé</p></div> : (
            <div className="webflow-grid">
              {filteredArticles.map(article => (
                <Link key={article._id} to={`/actualites/${article.slug}`} className="webflow-card">
                  {article.featuredImage && <div className="webflow-card-image"><img src={article.featuredImage} alt={article.title} /></div>}
                  <div className="webflow-card-content">
                    <div className="webflow-card-meta"><span>{article.category}</span><span>{article.pole}</span></div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <div className="webflow-card-footer">
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
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

export default ActualitesLayout6;
