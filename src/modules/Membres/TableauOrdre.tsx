import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './TableauOrdre.css';

// Types pour les membres (simplifié : nom, prenom, section)
interface Member {
  id: string;
  nom: string;
  prenom: string;
  section: string; // Vide pour le moment
}

const TableauOrdre = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'prenom'>('nom');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const membersPerPage = 12;

  // Charger les données depuis MongoDB (comme Resources)
  useEffect(() => {
    const loadPharmaciens = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('pharmaciens');
        if (Array.isArray(data) && data.length > 0) {
          const loadedMembers: Member[] = data.map((pharmacien: any) => ({
            id: String(pharmacien._id || ''),
            nom: pharmacien.nom || '',
            prenom: pharmacien.prenom || '',
            section: pharmacien.section || '' // Vide pour le moment
          }));
          setMembers(loadedMembers);
          setFilteredMembers(loadedMembers);
        } else {
          setMembers([]);
          setFilteredMembers([]);
        }
      } catch (error) {
        console.error('Erreur chargement pharmaciens:', error);
        setMembers([]);
        setFilteredMembers([]);
      } finally {
        setLoading(false);
      }
    };
    loadPharmaciens();
  }, []);

  // Filtrage et tri
  useEffect(() => {
    let filtered = members.filter(member => {
      const fullName = `${member.nom} ${member.prenom}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                           member.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.prenom.toLowerCase().includes(searchQuery.toLowerCase());
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

    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [members, searchQuery, selectedSection, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalMembers: members.length
  }), [members]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSection('Toutes');
    setSortBy('nom');
    setCurrentPage(1);
  };

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
      <div className="membres-filters">
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
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.length > 0 ? (
                      currentMembers.map(member => (
                        <tr key={member.id} className="member-row">
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
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
                currentMembers.map(member => (
                  <div key={member.id} className="member-card-tableau">
                    <div className="member-card-content">
                      <h3 className="member-card-name">{member.nom}</h3>
                      <div className="member-card-name">{member.prenom}</div>
                      <div className="member-card-section">
                        Section: {member.section || <span style={{ color: '#999' }}>Non assignée</span>}
                      </div>
                    </div>
                  </div>
                ))
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
