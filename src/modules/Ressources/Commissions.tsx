import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Commissions.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

// Types pour les commissions
interface Commission {
  id: string;
  name: string;
  description: string;
  president: string;
  members: string[];
  creationDate: string;
  category: string;
  missions: string[];
  meetings: number;
  reports: number;
  status: 'active' | 'inactive';
  featured: boolean;
}

interface Meeting {
  id: string;
  commissionId: string;
  date: string;
  title: string;
  summary: string;
  documents: string[];
}


const Commissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>([]);
  
  // Charger depuis MongoDB - plusieurs commissions possibles
  useEffect(() => {
    const loadCommissions = async () => {
      const data = await fetchResourceData('commissions');
      if (!data) {
        setCommissions([]);
        setFilteredCommissions([]);
        return;
      }

      // Gérer un tableau de données
      const rawArray = Array.isArray(data) ? data : [data];
      
      const mapped: Commission[] = rawArray.map((item: any) => ({
        id: String(item._id || ''),
        name: item.title || item.name || '',
        description: item.description || '',
        president: item.president || '',
        members: item.members || [],
        creationDate: item.creationDate || new Date().toISOString().split('T')[0],
        category: item.category || 'Général',
        missions: item.attributions || item.missions || [],
        meetings: item.meetings || 0,
        reports: item.reports || 0,
        status: (item.status as 'active' | 'inactive') || 'active',
        featured: item.featured || false
      }));

      setCommissions(mapped);
      setFilteredCommissions(mapped);
    };
    loadCommissions();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const commissionsPerPage = 6;

  useEffect(() => {
    let filtered = commissions.filter(commission => {
      const matchesSearch = commission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           commission.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Toutes' || commission.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    setFilteredCommissions(filtered);
    setCurrentPage(1);
  }, [commissions, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredCommissions.length / commissionsPerPage);
  const currentCommissions = filteredCommissions.slice((currentPage - 1) * commissionsPerPage, currentPage * commissionsPerPage);

  const stats = useMemo(() => ({
    totalCommissions: commissions.length,
    activeCommissions: commissions.filter(c => c.status === 'active').length,
    totalMeetings: commissions.reduce((sum, c) => sum + c.meetings, 0),
    totalReports: commissions.reduce((sum, c) => sum + c.reports, 0)
  }), [commissions]);

  return (
    <div className="commissions-page ressources-page">
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Commissions</span>
              <span className="hero-title-subtitle">ONPG</span>
            </h1>
            <p className="hero-description">
              Présentation des différentes commissions de l'ONPG, leurs missions et leurs activités.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCommissions}</div>
              <div className="stat-label">Commissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeCommissions}</div>
              <div className="stat-label">Actives</div>
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
            <span className="breadcrumb-current">Commissions</span>
          </nav>

          {/* Filtres horizontaux modernes */}
          <div className="filters-modern-container">
            <div className="filters-header-modern">
              <div className="filters-header-left">
                <h2 className="results-title-modern">
                  {filteredCommissions.length} commission{filteredCommissions.length > 1 ? 's' : ''} trouvée{filteredCommissions.length > 1 ? 's' : ''}
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
                  placeholder="Rechercher par nom, description..."
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
                    {Array.from(new Set(commissions.map(c => c.category))).map(category => (
                      <button
                        key={category}
                        className={`filter-chip-modern ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        <span className="chip-count">
                          ({commissions.filter(c => c.category === category).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions filtres */}
              <div className="filters-actions-modern">
                <button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Toutes');
                }} className="clear-filters-btn-modern">
                  <span>🗑️</span> Effacer tous les filtres
                </button>
                <div className="filters-stats-modern">
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.activeCommissions}</span>
                    <span className="stat-mini-label">Actives</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.totalMeetings}</span>
                    <span className="stat-mini-label">Réunions</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.totalReports}</span>
                    <span className="stat-mini-label">Rapports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentCommissions.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-icon">🏛️</div>
              <h3>Aucune commission trouvée</h3>
              <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('Toutes'); }} className="empty-action-btn">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="commissions-grid-modern">
              {currentCommissions.map(commission => (
                <Link
                  key={commission.id}
                  to={`/ressources/commissions/${commission.id}`}
                  className={`commission-card-modern ${commission.featured ? 'featured' : ''}`}
                >
                  <div className="commission-card-accent" />
                  <div className="commission-card-header-modern">
                    <h3 className="commission-card-title-modern">{commission.name}</h3>
                    <div className="commission-badges">
                      <span className={`status-badge-modern ${commission.status}`}>
                        {commission.status === 'active' ? '● Active' : '○ Inactive'}
                      </span>
                      {commission.featured && (
                        <span className="featured-badge-modern">⭐ À la une</span>
                      )}
                    </div>
                  </div>
                  <div className="commission-card-body-modern">
                    <span className="category-tag-modern">{commission.category}</span>
                    <p className="commission-description-modern">{commission.description}</p>
                    {commission.president && (
                      <div className="commission-president-modern">
                        <span>👤</span> <strong>Président :</strong> {commission.president}
                      </div>
                    )}
                    {commission.members.length > 0 && (
                      <div className="commission-members-modern">
                        {commission.members.slice(0, 3).map((member, i) => (
                          <span key={i} className="member-chip">{member}</span>
                        ))}
                        {commission.members.length > 3 && (
                          <span className="member-chip more">+{commission.members.length - 3}</span>
                        )}
                      </div>
                    )}
                    {commission.missions.length > 0 && (
                      <div className="commission-missions-modern">
                        <ul className="missions-list">
                          {commission.missions.slice(0, 2).map((mission, i) => (
                            <li key={i}>{mission}</li>
                          ))}
                          {commission.missions.length > 2 && (
                            <li style={{ fontStyle: 'italic', opacity: 0.7 }}>
                              +{commission.missions.length - 2} autres missions
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="commission-card-footer-modern">
                    <div className="commission-stats-modern">
                      <div className="comm-stat">
                        <span className="comm-stat-value">{commission.meetings}</span>
                        <span className="comm-stat-label">Réunions</span>
                      </div>
                      <div className="comm-stat">
                        <span className="comm-stat-value">{commission.reports}</span>
                        <span className="comm-stat-label">Rapports</span>
                      </div>
                    </div>
                    <span className="read-more-modern">En savoir plus →</span>
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
              >← Précédent</button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn-modern ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >{page}</button>
                ))}
              </div>
              <button
                className="pagination-btn-modern"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >Suivant →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Commissions;

