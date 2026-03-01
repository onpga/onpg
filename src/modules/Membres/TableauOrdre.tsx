import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { useApiCache } from '../../hooks/useApiCache';
import { useDebounce } from '../../hooks/useDebounce';
import { useThrottledScroll } from '../../hooks/useThrottledScroll';
import './TableauOrdre.css';

interface Member {
  id: string;
  nom: string;
  prenom: string;
  section: string;
  photo?: string;
}

/* ── SVG Icons ── */
const IconTable = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
  </svg>
);
const IconCards = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconUserEmpty = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconSearchEmpty = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6M11 8v6"/>
  </svg>
);

/* ── Smart Pagination ── */
const getPaginationRange = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
};

const TableauOrdre = () => {
  const [selectedSection, setSelectedSection] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'prenom'>('nom');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const filtersRef = useRef<HTMLDivElement>(null);

  const membersPerPage = 12;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const filteredMembers = useMemo(() => {
    const searchLower = debouncedSearchQuery.toLowerCase();
    let filtered = members.filter(member => {
      const fullName = `${member.nom} ${member.prenom}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchLower) ||
        member.nom.toLowerCase().includes(searchLower) ||
        member.prenom.toLowerCase().includes(searchLower);
      const matchesSection = selectedSection === 'Toutes' || member.section === selectedSection;
      return matchesSearch && matchesSection;
    });
    filtered.sort((a, b) =>
      sortBy === 'nom'
        ? a.nom.localeCompare(b.nom)
        : a.prenom.localeCompare(b.prenom)
    );
    return filtered;
  }, [members, debouncedSearchQuery, selectedSection, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearchQuery, selectedSection, sortBy]);

  const pagination = useMemo(() => {
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    const startIndex = (currentPage - 1) * membersPerPage;
    const currentMembers = filteredMembers.slice(startIndex, startIndex + membersPerPage);
    return { totalPages, currentMembers };
  }, [filteredMembers, currentPage]);

  const { totalPages, currentMembers } = pagination;

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSection('Toutes');
    setSortBy('nom');
    setCurrentPage(1);
  }, []);

  useThrottledScroll(
    useCallback(() => {
      const y = window.scrollY;
      if (y > 100) {
        const down = y > ((window as any).lastScrollY || 0);
        if (down && filtersVisible) setFiltersVisible(false);
        else if (!down && !filtersVisible) setFiltersVisible(true);
      } else {
        setFiltersVisible(true);
      }
      (window as any).lastScrollY = y;
    }, [filtersVisible]),
    100,
    [filtersVisible]
  );

  const getPhotoUrl = useCallback((photo?: string) => {
    const valid = photo && photo !== 'null' && photo !== 'undefined' && photo !== '';
    return valid ? photo! : ONPG_IMAGES.logo;
  }, []);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="membres-page">
        <div className="to-loading-container">
          <div className="to-loading-spinner" />
          <p className="to-loading-text">Chargement du tableau de l'Ordre…</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = debouncedSearchQuery !== '' || selectedSection !== 'Toutes';
  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="membres-page">

      {/* ── Hero ── */}
      <section className="membres-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Tableau</span>
              <span className="hero-title-subtitle">de l'Ordre</span>
            </h1>
            <p className="hero-description">
              Répertoire officiel des pharmaciens inscrits à l'Ordre National des Pharmaciens du Gabon.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card animate">
              <span className="stat-number">{members.length}</span>
              <span className="stat-label">Membres inscrits</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filtres ── */}
      <div className="filters-wrapper">
        <div
          ref={filtersRef}
          className={`membres-filters ${filtersVisible ? 'visible' : 'hidden'}`}
        >
          <div className="filters-container">

            {/* Recherche */}
            <div className="search-section">
              <form onSubmit={e => e.preventDefault()} className="search-form">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou prénom…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-input"
                    autoComplete="off"
                  />
                  <button type="submit" className="search-button" aria-label="Rechercher">
                    <IconSearch />
                  </button>
                </div>
              </form>
            </div>

            {/* Contrôles */}
            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="section-select">Section :</label>
                <select
                  id="section-select"
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                >
                  <option value="Toutes">Toutes</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>

              <div className="sort-controls">
                <label htmlFor="sort-select">Trier par :</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'nom' | 'prenom')}
                >
                  <option value="nom">Nom</option>
                  <option value="prenom">Prénom</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  <IconTrash />
                  Effacer
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Toggle filtres */}
        <button
          className="toggle-filters-btn"
          onClick={() => setFiltersVisible(v => !v)}
          title={filtersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
        >
          {filtersVisible ? <IconChevronUp /> : <IconChevronDown />}
          Filtres
        </button>
      </div>

      {/* ── Contenu ── */}
      <section className="tableau-content">
        <div className="section-container">

          {/* En-tête résultats + toggle vue */}
          <div className="results-header">
            <h2 className="results-title">
              {filteredMembers.length > 0
                ? <>
                    <span className="to-count">{filteredMembers.length}</span>
                    {' '}pharmacien{filteredMembers.length > 1 ? 's' : ''}
                    {debouncedSearchQuery && <span className="to-search-tag"> « {debouncedSearchQuery} »</span>}
                  </>
                : 'Résultats'}
            </h2>

            <div className="to-results-right">
              {totalPages > 1 && (
                <span className="results-meta">Page {currentPage} / {totalPages}</span>
              )}
              {/* Toggle vue */}
              <div className="to-view-toggle" role="group" aria-label="Mode d'affichage">
                <button
                  className={`to-view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Vue tableau"
                  aria-pressed={viewMode === 'table'}
                >
                  <IconTable />
                </button>
                <button
                  className={`to-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Vue cartes"
                  aria-pressed={viewMode === 'cards'}
                >
                  <IconCards />
                </button>
              </div>
            </div>
          </div>

          {/* ── Vue Tableau ── */}
          {viewMode === 'table' && (
            <div className="tableau-container">
              <div className="table-responsive">
                <table className="membres-table">
                  <thead>
                    <tr>
                      <th style={{ width: '68px' }}>Photo</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.length > 0 ? (
                      currentMembers.map(member => (
                        <tr key={member.id} className="member-row">
                          <td>
                            <img
                              src={getPhotoUrl(member.photo)}
                              alt={`${member.prenom} ${member.nom}`}
                              loading="lazy"
                              onError={e => {
                                const t = e.target as HTMLImageElement;
                                if (t.src !== ONPG_IMAGES.logo) t.src = ONPG_IMAGES.logo;
                              }}
                              className="to-member-avatar"
                            />
                          </td>
                          <td className="member-name-cell">
                            <strong>{member.nom}</strong>
                          </td>
                          <td className="member-name-cell">{member.prenom}</td>
                          <td>
                            {member.section
                              ? <span className="to-section-badge">{member.section}</span>
                              : <span className="to-section-empty">—</span>}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>
                          <div className="to-empty-state">
                            <div className="to-empty-icon">
                              {members.length === 0 ? <IconUserEmpty /> : <IconSearchEmpty />}
                            </div>
                            {members.length === 0 ? (
                              <>
                                <h3>Aucun pharmacien enregistré</h3>
                                <p>Le tableau de l'Ordre ne contient pas encore de données.</p>
                              </>
                            ) : (
                              <>
                                <h3>Aucun résultat</h3>
                                <p>Aucun pharmacien ne correspond à votre recherche.</p>
                                <button onClick={clearFilters} className="to-empty-clear-btn">
                                  Effacer les filtres
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Vue Cartes ── */}
          {viewMode === 'cards' && (
            <div className="membres-cards-grid">
              {currentMembers.length > 0 ? (
                currentMembers.map(member => (
                  <div key={member.id} className="member-card-tableau">
                    <div className="member-card-content">
                      <img
                        src={getPhotoUrl(member.photo)}
                        alt={`${member.prenom} ${member.nom}`}
                        loading="lazy"
                        onError={e => {
                          const t = e.target as HTMLImageElement;
                          if (t.src !== ONPG_IMAGES.logo) t.src = ONPG_IMAGES.logo;
                        }}
                        className="to-card-avatar"
                      />
                      <h3 className="member-card-name">{member.nom}</h3>
                      <p className="to-card-prenom">{member.prenom}</p>
                      <div className="member-card-section">
                        {member.section
                          ? <>Section <strong>{member.section}</strong></>
                          : <span className="to-section-empty">Section non assignée</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="to-empty-state">
                    <div className="to-empty-icon">
                      {members.length === 0 ? <IconUserEmpty /> : <IconSearchEmpty />}
                    </div>
                    {members.length === 0 ? (
                      <>
                        <h3>Aucun pharmacien enregistré</h3>
                        <p>Le tableau de l'Ordre ne contient pas encore de données.</p>
                      </>
                    ) : (
                      <>
                        <h3>Aucun résultat</h3>
                        <p>Aucun pharmacien ne correspond à votre recherche.</p>
                        <button onClick={clearFilters} className="to-empty-clear-btn">
                          Effacer les filtres
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Pagination intelligente ── */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-numbers">
                {paginationRange.map((page, idx) =>
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="to-pagination-ellipsis">…</span>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
