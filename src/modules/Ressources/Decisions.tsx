import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Ressources.css';
import './Decisions.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

// Types pour les décisions
interface Decision {
  id: string;
  reference: string;
  title: string;
  date: string;
  jurisdiction: string;
  category: string;
  summary: string;
  parties: string[];
  decision: 'favorable' | 'defavorable' | 'partiellement favorable' | 'irrecevable';
  keywords: string[];
  downloads: number;
  citations: number;
  featured: boolean;
}


const Decisions = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([]);
  
  // Charger depuis MongoDB - plusieurs décisions possibles
  useEffect(() => {
    const loadDecisions = async () => {
      const data = await fetchResourceData('decisions');
      if (!data) {
        setDecisions([]);
        setFilteredDecisions([]);
        return;
      }

      // Gérer un tableau de données
      const rawArray = Array.isArray(data) ? data : [data];
      
      const mapped: Decision[] = rawArray.map((item: any) => ({
        id: String(item._id || ''),
        reference: item.reference || `DEC-${item._id?.substring(0, 8) || '001'}`,
        title: item.title || '',
        date: item.date || new Date().toISOString().split('T')[0],
        jurisdiction: item.jurisdiction || '',
        category: item.category || 'Général',
        summary: item.summary || item.title || '',
        parties: item.parties || [],
        decision: (item.decision as 'favorable' | 'defavorable' | 'partiellement favorable' | 'irrecevable') || 'favorable',
        keywords: item.keywords || [],
        downloads: item.downloads || 0,
        citations: item.citations || 0,
        featured: item.featured || false
      }));

      setDecisions(mapped);
      setFilteredDecisions(mapped);
    };
    loadDecisions();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedDecision, setSelectedDecision] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'citations'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const decisionsPerPage = 6;

  useEffect(() => {
    let filtered = decisions.filter(decision => {
      const matchesSearch = decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           decision.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Toutes' || decision.category === selectedCategory;
      const matchesDecision = selectedDecision === 'Toutes' || decision.decision === selectedDecision;
      return matchesSearch && matchesCategory && matchesDecision;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'citations':
          return b.citations - a.citations;
        default:
          return 0;
      }
    });

    setFilteredDecisions(filtered);
    setCurrentPage(1);
  }, [decisions, searchQuery, selectedCategory, selectedDecision, sortBy]);

  const totalPages = Math.ceil(filteredDecisions.length / decisionsPerPage);
  const currentDecisions = filteredDecisions.slice((currentPage - 1) * decisionsPerPage, currentPage * decisionsPerPage);

  const stats = useMemo(() => ({
    totalDecisions: decisions.length,
    totalCitations: decisions.reduce((sum, d) => sum + d.citations, 0),
    featuredDecisions: decisions.filter(d => d.featured).length
  }), [decisions]);

  const getDecisionLabel = (decision: Decision['decision']) => {
    const labels = {
      'favorable': 'Favorable',
      'defavorable': 'Défavorable',
      'partiellement favorable': 'Partiellement favorable',
      'irrecevable': 'Irrecevable'
    };
    return labels[decision];
  };

  const getDecisionColor = (decision: Decision['decision']) => {
    const colors = {
      'favorable': '#27ae60',
      'defavorable': '#e74c3c',
      'partiellement favorable': '#f39c12',
      'irrecevable': '#7f8c8d'
    };
    return colors[decision];
  };

  return (
    <div className="ressources-page">
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Jurisprudence</span>
              <span className="hero-title-subtitle">Décisions</span>
            </h1>
            <p className="hero-description">
              Décisions de justice, avis et jurisprudences relatives à l'exercice de la pharmacie au Gabon.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalDecisions}</div>
              <div className="stat-label">Décisions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCitations}</div>
              <div className="stat-label">Citations</div>
            </div>
          </div>
        </div>
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      <div className="ressources-container-modern">
        <main className="ressources-main-modern">
          <nav className="breadcrumb-modern">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Décisions</span>
          </nav>

          {/* Filtres horizontaux modernes */}
          <div className="filters-modern-container">
            <div className="filters-header-modern">
              <div className="filters-header-left">
                <h2 className="results-title-modern">
                  {filteredDecisions.length} décision{filteredDecisions.length > 1 ? 's' : ''} trouvée{filteredDecisions.length > 1 ? 's' : ''}
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
            <form className="search-bar-modern">
              <div className="search-input-wrapper-modern">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par référence, titre..."
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
                {/* Filtre Type de décision */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Type de décision</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedDecision === 'Toutes' ? 'active' : ''}`}
                      onClick={() => setSelectedDecision('Toutes')}
                    >
                      Toutes
                    </button>
                    {['favorable', 'defavorable', 'partiellement favorable', 'irrecevable'].map(decision => (
                      <button
                        key={decision}
                        className={`filter-chip-modern ${selectedDecision === decision ? 'active' : ''}`}
                        onClick={() => setSelectedDecision(decision)}
                        style={selectedDecision === decision ? {
                          background: `linear-gradient(135deg, ${getDecisionColor(decision as Decision['decision'])}, ${getDecisionColor(decision as Decision['decision'])}dd)`
                        } : {}}
                      >
                        {getDecisionLabel(decision as Decision['decision'])}
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
                    {Array.from(new Set(decisions.map(d => d.category))).map(category => (
                      <button
                        key={category}
                        className={`filter-chip-modern ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <span className="chip-count">
                          ({decisions.filter(d => d.category === category).length})
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
                  </div>
                </div>
              </div>

              {/* Actions filtres */}
              <div className="filters-actions-modern">
                <button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Toutes');
                  setSelectedDecision('Toutes');
                  setSortBy('date');
                }} className="clear-filters-btn-modern">
                  <span>🗑️</span> Effacer tous les filtres
                </button>
                <div className="filters-stats-modern">
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.featuredDecisions}</span>
                    <span className="stat-mini-label">À la une</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.totalCitations}</span>
                    <span className="stat-mini-label">Citations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="decisions-list">
            {currentDecisions.map(decision => (
              <article key={decision.id} className={`decision-card ${decision.featured ? 'featured' : ''}`}>
                <div className="decision-header">
                  <div className="decision-meta">
                    <span
                      className="decision-type"
                      style={{ backgroundColor: getDecisionColor(decision.decision) }}
                    >
                      {getDecisionLabel(decision.decision)}
                    </span>
                    {decision.featured && <span className="featured-badge">⭐</span>}
                    <span className="decision-reference">{decision.reference}</span>
                  </div>
                  <div className="decision-category">{decision.category}</div>
                </div>

                <div className="decision-content">
                  <h3 className="decision-title">
                    <Link to={`/ressources/decisions/${decision.id}`}>
                      {decision.title}
                    </Link>
                  </h3>

                  <div className="decision-date">
                    📅 {new Date(decision.date).toLocaleDateString('fr-FR')}
                  </div>

                  <div className="decision-jurisdiction">
                    ⚖️ {decision.jurisdiction}
                  </div>

                  <p className="decision-summary">{decision.summary}</p>

                  <div className="decision-parties">
                    <strong>Parties :</strong>
                    <ul>
                      {decision.parties.map((party, index) => (
                        <li key={index}>{party}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="decision-footer">
                  <div className="decision-stats">
                    <span>📄 {decision.downloads} téléchargements</span>
                    <span>📊 {decision.citations} citations</span>
                  </div>
                  <Link to={`/ressources/decisions/${decision.id}`} className="decision-read-more">
                    📖 Consulter →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Decisions;

