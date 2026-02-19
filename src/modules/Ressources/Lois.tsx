import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Lois.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

// Types pour les lois
interface Law {
  id: string;
  number: string;
  title: string;
  publicationDate: string;
  entryDate: string;
  category: string;
  summary: string;
  tableOfContents: {
    title: string;
    articles: string[];
  }[];
  keyArticles: string[];
  tags: string[];
  status: 'active' | 'modified' | 'repealed';
  downloads: number;
  views: number;
  featured: boolean;
  language: string;
}


const Lois = () => {
  const [laws, setLaws] = useState<Law[]>([]);
  const [filteredLaws, setFilteredLaws] = useState<Law[]>([]);
  
  // Charger depuis MongoDB - plusieurs lois possibles
  useEffect(() => {
    const loadLaws = async () => {
      const data = await fetchResourceData('lois');
      if (!data) {
        setLaws([]);
        setFilteredLaws([]);
        return;
      }

      // Gérer un tableau de données
      const rawArray = Array.isArray(data) ? data : [data];
      
      const mapped: Law[] = rawArray.map((item: any) => ({
        id: String(item._id || ''),
        number: item.number || '',
        title: item.title || '',
        publicationDate: item.publicationDate || item.date || new Date().toISOString().split('T')[0],
        entryDate: item.entryDate || item.date || new Date().toISOString().split('T')[0],
        category: item.category || 'Législation',
        summary: item.summary || item.title || '',
        tableOfContents: item.tableOfContents || [],
        keyArticles: item.keyArticles || [],
        tags: item.tags || [],
        status: (item.status as 'active' | 'modified' | 'repealed') || 'active',
        downloads: item.downloads || 0,
        views: item.views || 0,
        featured: item.featured || false,
        language: item.language || 'fr'
      }));

      setLaws(mapped);
      setFilteredLaws(mapped);
    };
    loadLaws();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const lawsPerPage = 6;

  useEffect(() => {
    let filtered = laws.filter(law => {
      const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           law.number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Toutes' || law.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    setFilteredLaws(filtered);
    setCurrentPage(1);
  }, [laws, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredLaws.length / lawsPerPage);
  const currentLaws = filteredLaws.slice((currentPage - 1) * lawsPerPage, currentPage * lawsPerPage);

  const stats = useMemo(() => ({
    totalLaws: laws.length,
    activeLaws: laws.filter(l => l.status === 'active').length,
    totalDownloads: laws.reduce((sum, l) => sum + l.downloads, 0),
    totalViews: laws.reduce((sum, l) => sum + l.views, 0),
    featuredLaws: laws.filter(l => l.featured).length
  }), [laws]);

  const getStatusLabel = (status: Law['status']) => {
    const labels = {
      'active': 'En vigueur',
      'modified': 'Modifiée',
      'repealed': 'Abrogée'
    };
    return labels[status];
  };

  const getStatusColor = (status: Law['status']) => {
    const colors = {
      'active': '#27ae60',
      'modified': '#f39c12',
      'repealed': '#e74c3c'
    };
    return colors[status];
  };


  return (
    <div className="ressources-page">
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Corps</span>
              <span className="hero-title-subtitle">Législatif</span>
            </h1>
            <p className="hero-description">
              Lois, décrets et textes législatifs régissant la pharmacie au Gabon.
              Avec sommaire interactif pour navigation facilitée.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalLaws}</div>
              <div className="stat-label">Lois</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeLaws}</div>
              <div className="stat-label">En vigueur</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalDownloads.toLocaleString()}</div>
              <div className="stat-label">Téléchargements</div>
            </div>
          </div>
        </div>
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      <div className="ressources-container">
        <aside className="ressources-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Recherche</h3>
            <form className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Numéro, titre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Catégorie</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedCategory === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Toutes')}
              >
                Toutes les catégories
              </button>
              {Array.from(new Set(laws.map(l => l.category))).map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="ressources-main">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Lois</span>
          </nav>

          <div className="laws-list">
            {currentLaws.map(law => (
              <article key={law.id} className={`law-card ${law.featured ? 'featured' : ''}`}>
                <div className="law-header">
                  <div className="law-meta">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(law.status) }}
                    >
                      {getStatusLabel(law.status)}
                    </span>
                    {law.featured && <span className="featured-badge">⭐ À la une</span>}
                    <span className="law-number">Loi n° {law.number}</span>
                    <span className="law-language">{law.language.toUpperCase()}</span>
                  </div>
                  <div className="law-category">{law.category}</div>
                </div>

                <div className="law-content">
                  <h3 className="law-title">
                    <Link to={`/ressources/lois/${law.id}`}>
                      {law.title}
                    </Link>
                  </h3>

                  <div className="law-dates">
                    <div className="date-item">
                      <strong>Publication :</strong> {new Date(law.publicationDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="date-item">
                      <strong>Entrée en vigueur :</strong> {new Date(law.entryDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <p className="law-summary">{law.summary}</p>

                  <div className="law-table-of-contents-preview">
                    <strong>Sommaire ({law.tableOfContents.length} titres) :</strong>
                    <div className="toc-preview">
                      {law.tableOfContents.slice(0, 2).map((section, index) => (
                        <div key={index} className="toc-section">
                          <span className="toc-title">{section.title}</span>
                          <span className="toc-articles">({section.articles.length} articles)</span>
                        </div>
                      ))}
                      {law.tableOfContents.length > 2 && (
                        <div className="toc-section">
                          <span className="toc-more">et {law.tableOfContents.length - 2} autres titres...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="law-key-articles">
                    <strong>Articles clés :</strong>
                    <div className="key-articles-list">
                      {law.keyArticles.slice(0, 2).map((article, index) => (
                        <span key={index} className="key-article-tag">{article}</span>
                      ))}
                      {law.keyArticles.length > 2 && (
                        <span className="key-article-tag more">+{law.keyArticles.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="law-footer">
                  <div className="law-stats">
                    <span className="stat-item">👁️ {law.views.toLocaleString()} vues</span>
                    <span className="stat-item">⬇️ {law.downloads} téléchargements</span>
                  </div>

                  <div className="law-actions">
                    <Link to={`/ressources/lois/${law.id}`} className="law-toc-btn">
                      📋 Sommaire
                    </Link>
                    <Link to={`/ressources/lois/${law.id}`} className="law-read-more">
                      📖 Consulter →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
};

export default Lois;

