import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { useApiCache } from '../../hooks/useApiCache';
import { useDebounce } from '../../hooks/useDebounce';
import { useThrottledScroll } from '../../hooks/useThrottledScroll';
import './TableauOrdre.css';

// Types pour les membres (simplifié : nom, prenom, section)
interface Member {
  id: string;
  nom: string;
  prenom: string;
  section: string; // Vide pour le moment
  photo?: string;
}

const TableauOrdre = () => {
  const [selectedSection, setSelectedSection] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'prenom'>('nom');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const filtersRef = useRef<HTMLDivElement>(null);

  const membersPerPage = 12;

  // Debouncer la recherche pour éviter trop de recalculs
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Charger les données avec cache (30 minutes pour données statiques)
  const { data: rawData, loading } = useApiCache<Member[]>(
    async () => {
      const data = await fetchResourceData('pharmaciens');
      if (Array.isArray(data) && data.length > 0) {
        return data.map((pharmacien: any) => ({
          id: String(pharmacien._id || ''),
          nom: pharmacien.nom || '',
          prenom: pharmacien.prenom || '',
          section: pharmacien.section || '',
          photo: pharmacien.photo || ''
        }));
      }
      return [];
    },
    [],
    { ttl: 30 * 60 * 1000, staleWhileRevalidate: true, key: 'pharmaciens_tableau' }
  );

  const members = rawData || [];

  // Filtrage et tri avec useMemo pour éviter recalculs inutiles
  const filteredMembers = useMemo(() => {
    let filtered = members.filter(member => {
      const fullName = `${member.nom} ${member.prenom}`.toLowerCase();
      const searchLower = debouncedSearchQuery.toLowerCase();
      const matchesSearch = fullName.includes(searchLower) ||
                           member.nom.toLowerCase().includes(searchLower) ||
                           member.prenom.toLowerCase().includes(searchLower);
      const matchesSection = selectedSection === 'Toutes' || member.section === selectedSection;
      return matchesSearch && matchesSection;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nom':
          return a.nom.localeCompare(b.nom);
        case 'prenom':
          return a.prenom.localeCompare(b.prenom);
        default:
          return 0;
      }
    });

    return filtered;
  }, [members, debouncedSearchQuery, selectedSection, sortBy]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedSection, sortBy]);

  // Pagination avec useMemo
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);
    return { totalPages, currentMembers };
  }, [filteredMembers, currentPage, membersPerPage]);

  const { totalPages, currentMembers } = pagination;

  // Statistiques
  const stats = useMemo(() => ({
    totalMembers: members.length
  }), [members.length]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSection('Toutes');
    setSortBy('nom');
    setCurrentPage(1);
  }, []);

  // Gestion du scroll optimisée avec throttling
  useThrottledScroll(
    useCallback(() => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        const scrollingDown = currentScrollY > (window as any).lastScrollY;
        if (scrollingDown && filtersVisible) {
          setFiltersVisible(false);
        } else if (!scrollingDown && !filtersVisible) {
          setFiltersVisible(true);
        }
      } else {
        setFiltersVisible(true);
      }
      
      (window as any).lastScrollY = currentScrollY;
    }, [filtersVisible]),
    100, // Throttle à 100ms
    [filtersVisible]
  );

  if (loading) {
    return (
      <div className="membres-page">
        <div className="loading-state">
          <p>Chargement des pharmaciens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="membres-page">
      {/* Hero Section */}
      <section className="membres-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Tableau</span>
              <span className="hero-title-subtitle">de l'Ordre</span>
            </h1>
            <p className="hero-description">
              Répertoire officiel des pharmaciens inscrits à l'ONPG.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalMembers}</div>
              <div className="stat-label">Membres</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres et contrôles */}
      <div className="filters-wrapper">
        <div 
          ref={filtersRef}
          className={`membres-filters ${filtersVisible ? 'visible' : 'hidden'}`}
        >
          <div className="filters-container">
            <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou prénom..."
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

          <div className="filters-row">
            <div className="filter-group">
              <label>Section:</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="Toutes">Toutes</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            <div className="sort-controls">
              <label>Trier par:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="nom">Nom</option>
                <option value="prenom">Prénom</option>
              </select>
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Effacer les filtres
            </button>
          </div>
          </div>
        </div>
        {/* Bouton pour afficher/masquer les filtres */}
        <button 
          className="toggle-filters-btn"
          onClick={() => setFiltersVisible(!filtersVisible)}
          title={filtersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
        >
          {filtersVisible ? '▲' : '▼'} Filtres
        </button>
      </div>

      {/* Contenu principal */}
      <section className="tableau-content">
        <div className="section-container">
          <div className="results-header">
            <h2 className="results-title">
              {filteredMembers.length} pharmacien{filteredMembers.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {viewMode === 'table' ? (
            /* Vue tableau */
            <div className="tableau-container">
              <div className="table-responsive">
                <table className="membres-table">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.length > 0 ? (
                      currentMembers.map(member => {
                        const hasValidPhoto =
                          member.photo &&
                          member.photo !== 'null' &&
                          member.photo !== 'undefined';
                        const photoUrl = hasValidPhoto ? member.photo! : ONPG_IMAGES.fallback;

                        return (
                          <tr key={member.id} className="member-row">
                            <td>
                              <img
                                src={photoUrl}
                                alt={`${member.prenom} ${member.nom}`}
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target.src !== ONPG_IMAGES.fallback) {
                                    target.src = ONPG_IMAGES.fallback;
                                  }
                                }}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  border: '2px solid #00A651'
                                }}
                              />
                            </td>
                            <td className="member-name-cell">
                              <strong>{member.nom}</strong>
                            </td>
                            <td className="member-name-cell">
                              {member.prenom}
                            </td>
                            <td>
                              {member.section || <span style={{ color: '#999' }}>—</span>}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                          Aucun pharmacien trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Vue cartes */
            <div className="membres-cards-grid">
              {currentMembers.length > 0 ? (
                currentMembers.map(member => {
                  const hasValidPhoto =
                    member.photo &&
                    member.photo !== 'null' &&
                    member.photo !== 'undefined';
                  const photoUrl = hasValidPhoto ? member.photo! : ONPG_IMAGES.fallback;
                  return (
                    <div key={member.id} className="member-card-tableau">
                      <div className="member-card-content">
                        <img
                          src={photoUrl}
                          alt={`${member.prenom} ${member.nom}`}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== ONPG_IMAGES.fallback) {
                              target.src = ONPG_IMAGES.fallback;
                            }
                          }}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid #00A651',
                            marginBottom: '1rem',
                            display: 'block',
                            margin: '0 auto 1rem'
                          }}
                        />
                        <h3 className="member-card-name">{member.nom}</h3>
                        <div className="member-card-name">{member.prenom}</div>
                        <div className="member-card-section">
                          Section: {member.section || <span style={{ color: '#999' }}>Non assignée</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                  Aucun pharmacien trouvé
                </div>
              )}
            </div>
          )}

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
        </div>
      </section>
    </div>
  );
};

export default TableauOrdre;
