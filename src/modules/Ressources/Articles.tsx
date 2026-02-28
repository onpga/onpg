import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Articles.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

// Types pour les articles
interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year: number;
  doi?: string;
  keywords: string[];
  category: string;
  downloads: number;
  citations: number;
  featured: boolean;
  language: string;
  publicationType: 'article' | 'review' | 'case-report' | 'letter';
}

interface Journal {
  id: string;
  name: string;
  issn: string;
  publisher: string;
  impactFactor?: number;
  articlesCount: number;
}

// Données fictives de journaux (statiques pour l'affichage)
const mockJournals: Journal[] = [
  {
    id: 'rev-pharm-gab',
    name: 'Revue Pharmaceutique Gabonaise',
    issn: '1234-5678',
    publisher: 'ONPG Editions',
    impactFactor: 2.3,
    articlesCount: 156
  },
  {
    id: 'acta-pharm-afr',
    name: 'Acta Pharmaceutica Africana',
    issn: '2345-6789',
    publisher: 'Société Africaine de Pharmacie',
    impactFactor: 1.8,
    articlesCount: 89
  },
  {
    id: 'bull-sante-pub',
    name: 'Bulletin de Santé Publique',
    issn: '3456-7890',
    publisher: 'Ministère de la Santé',
    impactFactor: 2.1,
    articlesCount: 124
  }
];

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [journals, setJournals] = useState<Journal[]>(mockJournals);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  
  // Charger depuis MongoDB - plusieurs articles possibles
  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchResourceData('articles');
      if (!data) {
        setArticles([]);
        setFilteredArticles([]);
        return;
      }

      // Gérer un tableau de données
      const rawArray = Array.isArray(data) ? data : [data];
      
      const mapped: Article[] = rawArray.map((item: any) => ({
        id: String(item._id || ''),
        title: item.title || '',
        authors: item.authors || [],
        abstract: item.excerpt || item.abstract || '',
        journal: item.journal || '',
        year: item.year || new Date().getFullYear(),
        keywords: item.tags || item.keywords || [],
        category: item.category || 'Général',
        downloads: item.downloads || 0,
        citations: item.citations || 0,
        featured: item.featured || false,
        language: item.language || 'fr',
        publicationType: (item.publicationType as 'article' | 'review' | 'case-report' | 'letter') || 'article'
      }));

      setArticles(mapped);
      setFilteredArticles(mapped);
    };
    loadArticles();
  }, []);
  const [selectedJournal, setSelectedJournal] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'citations' | 'downloads'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const articlesPerPage = 6;

  // Filtrage et tri des articles
  useEffect(() => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesJournal = selectedJournal === 'Tous' || article.journal === selectedJournal;
      const matchesCategory = selectedCategory === 'Toutes' || article.category === selectedCategory;
      const matchesType = selectedType === 'Tous' || article.publicationType === selectedType;
      const matchesYear = selectedYear === 'Toutes' || article.year.toString() === selectedYear;
      return matchesSearch && matchesJournal && matchesCategory && matchesType && matchesYear;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.year - a.year;
        case 'citations':
          return b.citations - a.citations;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, searchQuery, selectedJournal, selectedCategory, selectedType, selectedYear, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalArticles: articles.length,
    totalCitations: articles.reduce((sum, article) => sum + article.citations, 0),
    totalDownloads: articles.reduce((sum, article) => sum + article.downloads, 0),
    featuredArticles: articles.filter(article => article.featured).length,
    categoriesCount: new Set(articles.map(a => a.category)).size,
    yearsRange: `${Math.min(...articles.map(a => a.year))}-${Math.max(...articles.map(a => a.year))}`
  }), [articles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedJournal('Tous');
    setSelectedCategory('Toutes');
    setSelectedType('Tous');
    setSelectedYear('Toutes');
    setSortBy('date');
    setCurrentPage(1);
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length <= 2) {
      return authors.join(', ');
    }
    return `${authors[0]} et al.`;
  };

  const getPublicationTypeLabel = (type: Article['publicationType']) => {
    const labels = {
      'article': 'Article original',
      'review': 'Revue',
      'case-report': 'Cas clinique',
      'letter': 'Lettre'
    };
    return labels[type];
  };

  const getPublicationTypeColor = (type: Article['publicationType']) => {
    const colors = {
      'article': '#3498db',
      'review': '#2ecc71',
      'case-report': '#e74c3c',
      'letter': '#f39c12'
    };
    return colors[type];
  };

  return (
    <div className="articles-page ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Bibliothèque</span>
              <span className="hero-title-subtitle">Scientifique</span>
            </h1>
            <p className="hero-description">
              Accédez à notre collection d'articles scientifiques, revues et publications académiques.
              Recherche avancée, citations et téléchargements disponibles.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalArticles}</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCitations}</div>
              <div className="stat-label">Citations</div>
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
      <div className="ressources-container-modern">
        {/* Main content */}
        <main className="ressources-main-modern">
          <nav className="breadcrumb-modern">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Articles</span>
          </nav>

          {/* Filtres horizontaux modernes */}
          <div className="filters-modern-container">
            <div className="filters-header-modern">
              <div className="filters-header-left">
                <h2 className="results-title-modern">
                  {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                </h2>
                <div className="results-meta-modern">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
              <button 
                className="toggle-filters-btn-modern"
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-label="Toggle filters"
              >
                <span className="toggle-filters-icon">{filtersOpen ? '▲' : '▼'}</span>
                <span>Filtres</span>
              </button>
            </div>

            {/* Barre de recherche principale */}
            <form onSubmit={handleSearch} className="search-bar-modern">
              <div className="search-input-wrapper-modern">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par titre, auteur, mots-clés..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-modern"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="clear-search-btn"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Filtres collapsibles */}
            <div className={`filters-content-modern ${filtersOpen ? 'open' : ''}`}>
              <div className="filters-grid-modern">
                {/* Filtre Journal */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Journal</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedJournal === 'Tous' ? 'active' : ''}`}
                      onClick={() => setSelectedJournal('Tous')}
                    >
                      Tous
                    </button>
                    {journals.map(journal => (
                      <button
                        key={journal.id}
                        className={`filter-chip-modern ${selectedJournal === journal.name ? 'active' : ''}`}
                        onClick={() => setSelectedJournal(journal.name)}
                      >
                        {journal.name}
                        <span className="chip-count">({journal.articlesCount})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Catégorie */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Catégorie</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedCategory === 'Toutes' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('Toutes')}
                    >
                      Toutes
                    </button>
                    {Array.from(new Set(articles.map(a => a.category))).map(category => (
                      <button
                        key={category}
                        className={`filter-chip-modern ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <span className="chip-count">
                          ({articles.filter(a => a.category === category).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Type */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Type</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedType === 'Tous' ? 'active' : ''}`}
                      onClick={() => setSelectedType('Tous')}
                    >
                      Tous
                    </button>
                    {['article', 'review', 'case-report', 'letter'].map(type => (
                      <button
                        key={type}
                        className={`filter-chip-modern ${selectedType === type ? 'active' : ''}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {getPublicationTypeLabel(type as Article['publicationType'])}
                        <span className="chip-count">
                          ({articles.filter(a => a.publicationType === type).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Année */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Année</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedYear === 'Toutes' ? 'active' : ''}`}
                      onClick={() => setSelectedYear('Toutes')}
                    >
                      Toutes
                    </button>
                    {Array.from(new Set(articles.map(a => a.year.toString()))).sort().reverse().slice(0, 10).map(year => (
                      <button
                        key={year}
                        className={`filter-chip-modern ${selectedYear === year ? 'active' : ''}`}
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                        <span className="chip-count">
                          ({articles.filter(a => a.year.toString() === year).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tri */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Trier par</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${sortBy === 'date' ? 'active' : ''}`}
                      onClick={() => setSortBy('date')}
                    >
                      📅 Plus récent
                    </button>
                    <button
                      className={`filter-chip-modern ${sortBy === 'citations' ? 'active' : ''}`}
                      onClick={() => setSortBy('citations')}
                    >
                      📊 Plus cité
                    </button>
                    <button
                      className={`filter-chip-modern ${sortBy === 'downloads' ? 'active' : ''}`}
                      onClick={() => setSortBy('downloads')}
                    >
                      ⬇️ Plus téléchargé
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions filtres */}
              <div className="filters-actions-modern">
                <button onClick={clearFilters} className="clear-filters-btn-modern">
                  <span>🗑️</span> Effacer tous les filtres
                </button>
                <div className="filters-stats-modern">
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.featuredArticles}</span>
                    <span className="stat-mini-label">À la une</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.categoriesCount}</span>
                    <span className="stat-mini-label">Catégories</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.yearsRange}</span>
                    <span className="stat-mini-label">Années</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {currentArticles.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-icon">📚</div>
              <h3>Aucun article trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
              <button onClick={clearFilters} className="empty-action-btn">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="articles-grid-modern">
              {currentArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/ressources/articles/${article.id}`}
                  className={`article-card-modern ${article.featured ? 'featured' : ''}`}
                >
                  {article.featured && (
                    <div className="featured-badge-modern">
                      <span style={{ fontSize: '0.7rem' }}>⭐</span> À la une
                    </div>
                  )}
                  <div className="article-card-header-modern">
                    <h3 className="article-card-title-modern">{article.title}</h3>
                    <span
                      className="article-type-badge-modern"
                      style={{ backgroundColor: getPublicationTypeColor(article.publicationType) }}
                    >
                      {getPublicationTypeLabel(article.publicationType)}
                    </span>
                  </div>
                  <div className="article-card-body-modern">
                    <div className="article-authors-modern">
                      <span>👤</span> {formatAuthors(article.authors)}
                    </div>
                    <div className="article-journal-modern">
                      <span>📖</span> {article.journal}
                      {article.volume && `, Vol. ${article.volume}`}
                      {article.issue && `, N° ${article.issue}`}
                    </div>
                    <p className="article-abstract-modern">{article.abstract}</p>
                    {article.keywords && article.keywords.length > 0 && (
                      <div className="article-keywords-modern">
                        {article.keywords.slice(0, 5).map(keyword => (
                          <span key={keyword} className="article-keyword-modern">#{keyword}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="article-card-footer-modern">
                    <div className="article-stats-modern">
                      <div className="article-stat-modern">
                        <span className="stat-value-modern">{article.downloads}</span>
                        <span className="stat-label-modern">Téléchargements</span>
                      </div>
                      <div className="article-stat-modern">
                        <span className="stat-value-modern">{article.citations}</span>
                        <span className="stat-label-modern">Citations</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span className="article-year-modern">{article.year}</span>
                      <span className="read-more-modern">Lire →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-modern">
              <button
                className="pagination-btn-modern"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn-modern ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn-modern"
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

export default Articles;

