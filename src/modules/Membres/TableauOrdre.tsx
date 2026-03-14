import { useMemo, useState } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { useApiCache } from '../../hooks/useApiCache';
import { useDebounce } from '../../hooks/useDebounce';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './TableauOrdrePremium.css';

type ViewMode = 'table' | 'cards';
type SortMode = 'nom' | 'prenom';

interface Member {
  id: string;
  nom: string;
  prenom: string;
  section: string;
  photo?: string;
}

const membersPerPage = 12;

const getPaginationRange = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
};

const normalizeSection = (section?: string) => {
  if (!section) return '';
  const s = section.trim().toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(s)) return s;
  return section;
};

const TableauOrdre = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Toutes');
  const [sortBy, setSortBy] = useState<SortMode>('nom');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const { data: membersRaw, loading } = useApiCache<Member[]>(
    async () => {
      const data = await fetchResourceData('pharmaciens');
      const arr = Array.isArray(data) ? data : [];
      return arr
        .filter((p: any) => p && p.isActive !== false)
        .map((p: any) => ({
          id: String(p._id || `${p.nom ?? ''}-${p.prenom ?? ''}`),
          nom: String(p.nom || '').trim(),
          prenom: String(p.prenom || '').trim(),
          section: normalizeSection(p.section || ''),
          photo: p.photo || ''
        }));
    },
    [],
    { ttl: 30 * 60 * 1000, staleWhileRevalidate: true, key: 'tableau_ordre_members_premium' }
  );

  const members = membersRaw || [];

  const filteredMembers = useMemo(() => {
    const q = debouncedSearchQuery.trim().toLowerCase();
    const bySearch = members.filter((m) => {
      if (!q) return true;
      const full = `${m.nom} ${m.prenom}`.toLowerCase();
      return full.includes(q) || m.nom.toLowerCase().includes(q) || m.prenom.toLowerCase().includes(q);
    });

    const bySection = bySearch.filter((m) => selectedSection === 'Toutes' || m.section === selectedSection);
    const sorted = [...bySection].sort((a, b) =>
      sortBy === 'nom' ? a.nom.localeCompare(b.nom) : a.prenom.localeCompare(b.prenom)
    );
    return sorted;
  }, [members, debouncedSearchQuery, selectedSection, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * membersPerPage;
  const pageMembers = filteredMembers.slice(pageStart, pageStart + membersPerPage);
  const paginationRange = getPaginationRange(safePage, totalPages);
  const hasFilters = selectedSection !== 'Toutes' || debouncedSearchQuery.length > 0;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSection('Toutes');
    setSortBy('nom');
    setCurrentPage(1);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortMode) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const getPhotoUrl = (photo?: string) => {
    if (!photo || photo === 'null' || photo === 'undefined') return ONPG_IMAGES.logo;
    return photo;
  };

  return (
    <div className="tb-page">
      <section className="tb-hero" aria-labelledby="tb-title">
        <div className="tb-container">
          <span className="tb-eyebrow">Registre professionnel</span>
          <h1 id="tb-title" className="tb-title">Tableau de l&apos;Ordre</h1>
          <p className="tb-lead">
            Répertoire officiel des pharmaciens inscrits à l’Ordre National des Pharmaciens du Gabon.
          </p>
          <div className="tb-kpi-row">
            <article className="tb-kpi-card">
              <strong>{members.length}</strong>
              <span>Membres inscrits</span>
            </article>
            <article className="tb-kpi-card">
              <strong>4</strong>
              <span>Sections professionnelles</span>
            </article>
            <article className="tb-kpi-card">
              <strong>{filteredMembers.length}</strong>
              <span>Résultats filtrés</span>
            </article>
          </div>
        </div>
      </section>

      <section className="tb-section">
        <div className="tb-container">
          <div className="tb-controls">
            <div className="tb-search-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Rechercher par nom ou prénom..."
                className="tb-search-input"
                aria-label="Rechercher un pharmacien"
              />
            </div>

            <div className="tb-select-wrap">
              <label htmlFor="tb-section-select">Section</label>
              <select
                id="tb-section-select"
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="tb-select"
              >
                <option value="Toutes">Toutes</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            <div className="tb-select-wrap">
              <label htmlFor="tb-sort-select">Tri</label>
              <select
                id="tb-sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortMode)}
                className="tb-select"
              >
                <option value="nom">Nom</option>
                <option value="prenom">Prénom</option>
              </select>
            </div>

            <div className="tb-view-toggle" role="group" aria-label="Mode d'affichage">
              <button
                type="button"
                className={`tb-view-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Tableau
              </button>
              <button
                type="button"
                className={`tb-view-btn ${viewMode === 'cards' ? 'is-active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                Cartes
              </button>
            </div>

            {hasFilters && (
              <button type="button" onClick={clearFilters} className="tb-clear-btn">
                Effacer filtres
              </button>
            )}
          </div>

          <div className="tb-results-bar">
            <h2>{filteredMembers.length} pharmacien{filteredMembers.length > 1 ? 's' : ''}</h2>
            <span>Page {safePage} / {totalPages}</span>
          </div>

          {loading ? (
            <div className="tb-empty-state">
              <h3>Chargement du tableau...</h3>
              <p>Récupération des données en cours.</p>
            </div>
          ) : pageMembers.length === 0 ? (
            <div className="tb-empty-state">
              <h3>Aucun résultat</h3>
              <p>Aucun pharmacien ne correspond aux critères actuels.</p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="tb-table-wrap">
              <table className="tb-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Section</th>
                  </tr>
                </thead>
                <tbody>
                  {pageMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <img
                          src={getPhotoUrl(member.photo)}
                          alt={`${member.prenom} ${member.nom}`}
                          className="tb-avatar"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                          }}
                        />
                      </td>
                      <td><strong>{member.nom || '—'}</strong></td>
                      <td>{member.prenom || '—'}</td>
                      <td>
                        <span className="tb-section-badge">{member.section || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="tb-cards-grid">
              {pageMembers.map((member) => (
                <article key={member.id} className="tb-card">
                  <img
                    src={getPhotoUrl(member.photo)}
                    alt={`${member.prenom} ${member.nom}`}
                    className="tb-card-avatar"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                    }}
                  />
                  <h3>{member.nom || '—'}</h3>
                  <p>{member.prenom || '—'}</p>
                  <span className="tb-section-badge">Section {member.section || '—'}</span>
                </article>
              ))}
            </div>
          )}

          {filteredMembers.length > membersPerPage && (
            <div className="tb-pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="tb-page-btn"
              >
                Précédent
              </button>

              <div className="tb-page-numbers">
                {paginationRange.map((entry, i) =>
                  entry === 'ellipsis' ? (
                    <span key={`ellipsis-${i}`} className="tb-ellipsis">…</span>
                  ) : (
                    <button
                      key={entry}
                      type="button"
                      className={`tb-page-number ${safePage === entry ? 'is-active' : ''}`}
                      onClick={() => setCurrentPage(entry)}
                    >
                      {entry}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="tb-page-btn"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TableauOrdre;
