import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Communiques.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

// Types pour les communiqués
interface Communique {
  id: string;
  title: string;
  reference: string;
  date: string;
  type: 'urgent' | 'information' | 'presse' | 'administratif';
  category: string;
  excerpt: string;
  content: string;
  attachments?: string[];
  urgent: boolean;
  featured?: boolean;
}


const typeLabels = {
  urgent: 'Urgent',
  information: 'Information',
  presse: 'Presse',
  administratif: 'Administratif'
};

const typeColors = {
  urgent: '#e74c3c',
  information: '#3498db',
  presse: '#2ecc71',
  administratif: '#f39c12'
};

const Communiques = () => {
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [filteredCommuniques, setFilteredCommuniques] = useState<Communique[]>([]);
  // Charger depuis MongoDB - désormais plusieurs communiqués possibles
  useEffect(() => {
    const loadCommuniques = async () => {
      const data = await fetchResourceData('communiques');

      if (!data) {
        setCommuniques([]);
        setFilteredCommuniques([]);
        return;
      }

      const rawArray = Array.isArray(data) ? data : [data];

      const mapped: Communique[] = rawArray.map((item: any) => ({
        id: String(item._id || ''),
        title: item.title || '',
        reference: item.reference || '',
        date: item.date || new Date().toISOString().split('T')[0],
        type: (item.type as Communique['type']) || 'information',
        category: item.category || 'Général',
        excerpt: item.excerpt || item.summary || '',
        content: item.content || '',
        attachments: item.attachments || [],
        urgent: item.urgent || false,
        featured: item.featured || false
      }));

      setCommuniques(mapped);
      setFilteredCommuniques(mapped);
    };

    loadCommuniques();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const communiquesPerPage = 8;

  // Filtrage et tri
  useEffect(() => {
    let filtered = communiques.filter(communique => {
      const matchesSearch = communique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           communique.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           communique.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'Tous' || communique.type === selectedType;
      const matchesCategory = selectedCategory === 'Toutes' || communique.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.type.localeCompare(b.type);
      }
    });

    setFilteredCommuniques(filtered);
    setCurrentPage(1);
  }, [communiques, searchQuery, selectedType, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCommuniques.length / communiquesPerPage);
  const startIndex = (currentPage - 1) * communiquesPerPage;
  const endIndex = startIndex + communiquesPerPage;
  const currentCommuniques = filteredCommuniques.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalCommuniques: communiques.length,
    urgentCommuniques: communiques.filter(c => c.urgent).length,
    featuredCommuniques: communiques.filter(c => c.featured).length,
    typesCount: Object.keys(typeLabels).length,
    thisMonth: communiques.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).length
  }), [communiques]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('Tous');
    setSelectedCategory('Toutes');
    setSortBy('date');
    setCurrentPage(1);
  };

  return (
    <div className="communiques-page ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Communiqués</span>
              <span className="hero-title-subtitle">Officiels</span>
            </h1>
            <p className="hero-description">
              Informations officielles, communiqués de presse et annonces importantes de l'ONPG.
              Restez informé des dernières décisions et actualités institutionnelles.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCommuniques}</div>
              <div className="stat-label">Communiqués</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.urgentCommuniques}</div>
              <div className="stat-label">Urgents</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.thisMonth}</div>
              <div className="stat-label">Ce mois</div>
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
        <main className="ressources-main-modern">
          <nav className="breadcrumb-modern">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Communiqués</span>
          </nav>

          {/* Filtres horizontaux modernes */}
          <div className="filters-modern-container">
            <div className="filters-header-modern">
              <div className="filters-header-left">
                <h2 className="results-title-modern">
                  {filteredCommuniques.length} communiqué{filteredCommuniques.length > 1 ? 's' : ''} trouvé{filteredCommuniques.length > 1 ? 's' : ''}
                  {stats.urgentCommuniques > 0 && (
                    <span className="urgent-badge-header">🚨 {stats.urgentCommuniques} urgent{stats.urgentCommuniques > 1 ? 's' : ''}</span>
                  )}
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
                  placeholder="Rechercher par titre, référence, contenu..."
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
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <button
                        key={key}
                        className={`filter-chip-modern ${selectedType === key ? 'active' : ''}`}
                        onClick={() => setSelectedType(key)}
                        style={selectedType === key ? {
                          background: `linear-gradient(135deg, ${typeColors[key as keyof typeof typeColors]}, ${typeColors[key as keyof typeof typeColors]}dd)`
                        } : {}}
                      >
                        {key === 'urgent' && '🚨'}
                        {key === 'presse' && '📢'}
                        {key === 'information' && 'ℹ️'}
                        {key === 'administratif' && '📋'}
                        {label}
                        <span className="chip-count">
                          ({communiques.filter(c => c.type === key).length})
                        </span>
                        {key === 'urgent' && communiques.filter(c => c.type === key).length > 0 && (
                          <span className="urgent-indicator-chip">●</span>
                        )}
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
                    {Array.from(new Set(communiques.map(c => c.category))).map(category => (
                      <button
                        key={category}
                        className={`filter-chip-modern ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <span className="chip-count">
                          ({communiques.filter(c => c.category === category).length})
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
                      className={`filter-chip-modern ${sortBy === 'type' ? 'active' : ''}`}
                      onClick={() => setSortBy('type')}
                    >
                      📋 Par type
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
                  <div className="stat-mini urgent-stat-mini">
                    <span className="stat-mini-value">{stats.urgentCommuniques}</span>
                    <span className="stat-mini-label">Urgents</span>
                    {stats.urgentCommuniques > 0 && <span className="urgent-pulse-dot"></span>}
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.thisMonth}</span>
                    <span className="stat-mini-label">Ce mois</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.featuredCommuniques}</span>
                    <span className="stat-mini-label">À la une</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Communiqués Grid */}
          {currentCommuniques.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-icon">📢</div>
              <h3>Aucun communiqué trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
              <button onClick={clearFilters} className="empty-action-btn">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="communiques-grid-modern">
              {currentCommuniques.map((communique) => (
                <Link
                  key={communique.id}
                  to={`/ressources/communiques/${communique.id}`}
                  className={`communique-card-modern ${communique.urgent ? 'urgent' : ''} ${communique.featured ? 'featured' : ''}`}
                >
                  {communique.urgent && (
                    <div className="urgent-badge-modern">🚨 URGENT</div>
                  )}
                  {communique.featured && (
                    <div className="featured-badge-modern">
                      <span style={{ fontSize: '0.7rem' }}>⭐</span> À la une
                    </div>
                  )}
                  <div className="communique-card-header-modern">
                    <h3 className="communique-card-title-modern">{communique.title}</h3>
                    <span
                      className="communique-type-badge-modern"
                      style={{ backgroundColor: typeColors[communique.type] }}
                    >
                      {communique.type === 'urgent' && '🚨'}
                      {communique.type === 'presse' && '📢'}
                      {communique.type === 'information' && 'ℹ️'}
                      {communique.type === 'administratif' && '📋'}
                      {typeLabels[communique.type]}
                    </span>
                  </div>
                  <div className="communique-card-body-modern">
                    <div className="communique-reference-modern">
                      <span>📋</span> Réf: {communique.reference}
                    </div>
                    <p className="communique-excerpt-modern">{communique.excerpt}</p>
                  </div>
                  <div className="communique-card-footer-modern">
                    <span className="communique-date-modern">
                      {new Date(communique.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="read-more-modern">Lire →</span>
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

export default Communiques;
