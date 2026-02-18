import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Decrets.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

// Types pour les décrets
interface Decret {
  id: string;
  number: string;
  title: string;
  publicationDate: string;
  entryDate: string;
  ministry: string;
  category: string;
  summary: string;
  keyArticles: string[];
  tags: string[];
  status: 'active' | 'modified' | 'abrogated';
  downloads: number;
  views: number;
  featured: boolean;
  language: string;
}


const Decrets = () => {
  const [decrets, setDecrets] = useState<Decret[]>([]);
  const [filteredDecrets, setFilteredDecrets] = useState<Decret[]>([]);
  
  // Charger depuis MongoDB - 1 seul décret
  useEffect(() => {
    const loadDecrets = async () => {
      const data = await fetchResourceData('decrets');
      if (data && !Array.isArray(data)) {
        const decret: Decret = {
          id: data._id,
          number: data.number || '',
          title: data.title,
          publicationDate: data.publicationDate || data.date || new Date().toISOString().split('T')[0],
          entryDate: data.entryDate || data.date || new Date().toISOString().split('T')[0],
          ministry: data.ministry || 'Ministère de la Santé et des Affaires Sociales',
          category: data.category || 'Général',
          summary: data.summary || data.title,
          keyArticles: data.keyArticles || [],
          tags: data.tags || [],
          status: (data.status as 'active' | 'modified' | 'abrogated') || 'active',
          downloads: data.downloads || 0,
          views: data.views || 0,
          featured: data.featured || false,
          language: data.language || 'fr'
        };
        setDecrets([decret]);
        setFilteredDecrets([decret]);
      } else {
        setDecrets([]);
        setFilteredDecrets([]);
      }
    };
    loadDecrets();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'downloads'>('date');
  const [currentPage, setCurrentPage] = useState(1);

  const decretsPerPage = 6;

  // Filtrage et tri des décrets
  useEffect(() => {
    let filtered = decrets.filter(decret => {
      const matchesSearch = decret.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           decret.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           decret.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           decret.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Toutes' || decret.category === selectedCategory;
      const matchesStatus = selectedStatus === 'Tous' || decret.status === selectedStatus;
      const matchesYear = selectedYear === 'Toutes' || decret.publicationDate.startsWith(selectedYear);
      return matchesSearch && matchesCategory && matchesStatus && matchesYear;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'number':
          return b.number.localeCompare(a.number);
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredDecrets(filtered);
    setCurrentPage(1);
  }, [decrets, searchQuery, selectedCategory, selectedStatus, selectedYear, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredDecrets.length / decretsPerPage);
  const startIndex = (currentPage - 1) * decretsPerPage;
  const endIndex = startIndex + decretsPerPage;
  const currentDecrets = filteredDecrets.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalDecrets: decrets.length,
    activeDecrets: decrets.filter(d => d.status === 'active').length,
    totalDownloads: decrets.reduce((sum, decret) => sum + decret.downloads, 0),
    totalViews: decrets.reduce((sum, decret) => sum + decret.views, 0),
    featuredDecrets: decrets.filter(decret => decret.featured).length,
    categoriesCount: new Set(decrets.map(d => d.category)).size,
    yearsRange: `${Math.min(...decrets.map(d => new Date(d.publicationDate).getFullYear()))}-${Math.max(...decrets.map(d => new Date(d.publicationDate).getFullYear()))}`
  }), [decrets]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Toutes');
    setSelectedStatus('Tous');
    setSelectedYear('Toutes');
    setSortBy('date');
    setCurrentPage(1);
  };

  const getStatusLabel = (status: Decret['status']) => {
    const labels = {
      'active': 'En vigueur',
      'modified': 'Modifié',
      'abrogated': 'Abrogé'
    };
    return labels[status];
  };

  const getStatusColor = (status: Decret['status']) => {
    const colors = {
      'active': '#27ae60',
      'modified': '#f39c12',
      'abrogated': '#e74c3c'
    };
    return colors[status];
  };

  return (
    <div className="ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Textes</span>
              <span className="hero-title-subtitle">Officiels</span>
            </h1>
            <p className="hero-description">
              Décrets, arrêtés et textes réglementaires régissant l'exercice de la pharmacie au Gabon.
              Accès direct aux textes officiels en vigueur.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalDecrets}</div>
              <div className="stat-label">Décrets</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeDecrets}</div>
              <div className="stat-label">En vigueur</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalDownloads.toLocaleString()}</div>
              <div className="stat-label">Téléchargements</div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Main Content */}
      <div className="ressources-container">
        {/* Sidebar */}
        <aside className="ressources-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Recherche</h3>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Numéro, titre, contenu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
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
              {Array.from(new Set(decrets.map(d => d.category))).map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  <span className="category-count">
                    ({decrets.filter(d => d.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Statut</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedStatus === 'Tous' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('Tous')}
              >
                Tous les statuts
              </button>
              {['active', 'modified', 'abrogated'].map(status => (
                <button
                  key={status}
                  className={`category-filter ${selectedStatus === status ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {getStatusLabel(status as Decret['status'])}
                  <span className="category-count">
                    ({decrets.filter(d => d.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Année</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedYear === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedYear('Toutes')}
              >
                Toutes les années
              </button>
              {Array.from(new Set(decrets.map(d => new Date(d.publicationDate).getFullYear().toString()))).sort().reverse().map(year => (
                <button
                  key={year}
                  className={`category-filter ${selectedYear === year ? 'active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                  <span className="category-count">
                    ({decrets.filter(d => new Date(d.publicationDate).getFullYear().toString() === year).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Trier par</h3>
            <div className="sort-options">
              <button
                className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => setSortBy('date')}
              >
                📅 Plus récent
              </button>
              <button
                className={`sort-option ${sortBy === 'number' ? 'active' : ''}`}
                onClick={() => setSortBy('number')}
              >
                🔢 Par numéro
              </button>
              <button
                className={`sort-option ${sortBy === 'downloads' ? 'active' : ''}`}
                onClick={() => setSortBy('downloads')}
              >
                ⬇️ Plus téléchargé
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Effacer les filtres
            </button>
          </div>

          {/* Statistiques des décrets */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Métriques</h3>
            <div className="decret-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.featuredDecrets}</span>
                <span className="stat-label">À la une</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.categoriesCount}</span>
                <span className="stat-label">Catégories</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.yearsRange}</span>
                <span className="stat-label">Période</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="ressources-main">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Décrets</span>
          </nav>

          <div className="results-header">
            <h2 className="results-title">
              {filteredDecrets.length} décret{filteredDecrets.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedCategory !== 'Toutes' && ` - ${selectedCategory}`}
              {selectedStatus !== 'Tous' && ` (${getStatusLabel(selectedStatus as Decret['status'])})`}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {/* Décrets list */}
          <div className="decrets-list">
            {currentDecrets.map(decret => (
              <article key={decret.id} className={`decret-card ${decret.featured ? 'featured' : ''}`}>
                <div className="decret-header">
                  <div className="decret-meta">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(decret.status) }}
                    >
                      {getStatusLabel(decret.status)}
                    </span>
                    {decret.featured && (
                      <span className="featured-badge">⭐ À la une</span>
                    )}
                    <span className="decret-number">N° {decret.number}</span>
                    <span className="decret-language">{decret.language.toUpperCase()}</span>
                  </div>
                  <div className="decret-category">{decret.category}</div>
                </div>

                <div className="decret-content">
                  <h3 className="decret-title">
                    <Link to={`/ressources/decrets/${decret.id}`}>
                      {decret.title}
                    </Link>
                  </h3>

                  <div className="decret-dates">
                    <div className="date-item">
                      <strong>Publication :</strong> {new Date(decret.publicationDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="date-item">
                      <strong>Entrée en vigueur :</strong> {new Date(decret.entryDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="decret-ministry">
                    <strong>Ministère :</strong> {decret.ministry}
                  </div>

                  <p className="decret-summary">{decret.summary}</p>

                  <div className="decret-articles">
                    <strong>Articles clés :</strong>
                    <ul className="articles-list">
                      {decret.keyArticles.slice(0, 3).map((article, index) => (
                        <li key={index}>{article}</li>
                      ))}
                      {decret.keyArticles.length > 3 && (
                        <li><em>et {decret.keyArticles.length - 3} autres articles...</em></li>
                      )}
                    </ul>
                  </div>

                  <div className="decret-tags">
                    <strong>Mots-clés :</strong>
                    <div className="tags-list">
                      {decret.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="decret-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="decret-footer">
                  <div className="decret-stats">
                    <span className="stat-item">👁️ {decret.views.toLocaleString()} vues</span>
                    <span className="stat-item">⬇️ {decret.downloads} téléchargements</span>
                  </div>

                  <div className="decret-actions">
                    <Link to={`/ressources/decrets/${decret.id}`} className="decret-read-more">
                      📄 Consulter le décret →
                    </Link>
                    <button className="decret-download-btn">
                      ⬇️ Télécharger PDF
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Decrets;

