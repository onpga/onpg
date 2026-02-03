import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les membres
interface Member {
  id: string;
  number: string;
  name: string;
  section: 'A' | 'B' | 'C' | 'D';
  specialty: string;
  region: string;
  status: 'active' | 'suspended' | 'retired';
  registrationDate: string;
  email?: string;
  phone?: string;
}

const mockMembers: Member[] = [
  {
    id: '1',
    number: '001-2020',
    name: 'Dr. Alain Moreau',
    section: 'A',
    specialty: 'Pharmacie clinique',
    region: 'Libreville',
    status: 'active',
    registrationDate: '2020-01-15',
    email: 'alain.moreau@email.ga',
    phone: '+241 XX XX XX XX'
  },
  {
    id: '2',
    number: '002-2020',
    name: 'Dr. Marie Dubois',
    section: 'A',
    specialty: 'Pharmacie hospitalière',
    region: 'Libreville',
    status: 'active',
    registrationDate: '2020-02-01',
    email: 'marie.dubois@email.ga',
    phone: '+241 XX XX XX XX'
  },
  {
    id: '3',
    number: '003-2020',
    name: 'Dr. Jean Martin',
    section: 'C',
    specialty: 'Administration pharmaceutique',
    region: 'Libreville',
    status: 'active',
    registrationDate: '2020-02-15',
    email: 'jean.martin@email.ga',
    phone: '+241 XX XX XX XX'
  },
  {
    id: '4',
    number: '004-2020',
    name: 'Dr. Sophie Bernard',
    section: 'B',
    specialty: 'Biologie médicale',
    region: 'Libreville',
    status: 'active',
    registrationDate: '2020-03-01',
    email: 'sophie.bernard@email.ga',
    phone: '+241 XX XX XX XX'
  },
  {
    id: '5',
    number: '005-2020',
    name: 'Dr. Michel Dubois',
    section: 'A',
    specialty: 'Pharmacie officinale',
    region: 'Port-Gentil',
    status: 'active',
    registrationDate: '2020-03-15',
    email: 'michel.dubois@email.ga',
    phone: '+241 XX XX XX XX'
  }
];

const TableauOrdre = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(mockMembers);
  const [selectedSection, setSelectedSection] = useState('Toutes');
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'number' | 'date'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const membersPerPage = 12;

  // Filtrage et tri
  useEffect(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSection = selectedSection === 'Toutes' || member.section === selectedSection;
      const matchesRegion = selectedRegion === 'Toutes' || member.region === selectedRegion;
      const matchesStatus = selectedStatus === 'Tous' || member.status === selectedStatus;
      return matchesSearch && matchesSection && matchesRegion && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'number':
          return a.number.localeCompare(b.number);
        case 'date':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [members, searchQuery, selectedSection, selectedRegion, selectedStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    sectionsBreakdown: {
      A: members.filter(m => m.section === 'A').length,
      B: members.filter(m => m.section === 'B').length,
      C: members.filter(m => m.section === 'C').length,
      D: members.filter(m => m.section === 'D').length
    },
    regionsCount: new Set(members.map(m => m.region)).size
  }), [members]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSection('Toutes');
    setSelectedRegion('Toutes');
    setSelectedStatus('Tous');
    setSortBy('name');
    setCurrentPage(1);
  };

  const getSectionLabel = (section: Member['section']) => {
    const labels = {
      'A': 'Officinaux',
      'B': 'Biologistes',
      'C': 'Fonctionnaires',
      'D': 'Fabricants/Grossistes/Répartiteurs'
    };
    return labels[section];
  };

  const getStatusLabel = (status: Member['status']) => {
    const labels = {
      'active': 'Actif',
      'suspended': 'Suspendu',
      'retired': 'Retraité'
    };
    return labels[status];
  };

  const getStatusColor = (status: Member['status']) => {
    const colors = {
      'active': '#27ae60',
      'suspended': '#f39c12',
      'retired': '#95a5a6'
    };
    return colors[status];
  };

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
              Consultez les informations des professionnels de santé gabonais.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">📋 Répertoire officiel</span>
              <span className="highlight-item">🔍 Recherche avancée</span>
              <span className="highlight-item">📊 Statistiques détaillées</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalMembers}</div>
              <div className="stat-label">Membres</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeMembers}</div>
              <div className="stat-label">Actifs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4</div>
              <div className="stat-label">Sections</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
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
                  placeholder="Rechercher un membre..."
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
                <option value="Toutes">Toutes les sections</option>
                <option value="A">Section A - Officinaux</option>
                <option value="B">Section B - Biologistes</option>
                <option value="C">Section C - Fonctionnaires</option>
                <option value="D">Section D - Fabricants/Grossistes</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Région:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="Toutes">Toutes les régions</option>
                {Array.from(new Set(members.map(m => m.region))).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Statut:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="retired">Retraité</option>
              </select>
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📋 Tableau
              </button>
              <button
                className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                ⊞ Cartes
              </button>
            </div>
          </div>

          <div className="sort-section">
            <div className="sort-controls">
              <label>Trier par:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="name">Nom</option>
                <option value="number">Numéro</option>
                <option value="date">Date d'inscription</option>
              </select>
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Effacer les filtres
            </button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="tableau-content">
        <div className="section-container">
          <div className="results-header">
            <h2 className="results-title">
              {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedSection !== 'Toutes' && ` - ${getSectionLabel(selectedSection as Member['section'])}`}
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
                      <th>N° Inscription</th>
                      <th>Nom</th>
                      <th>Section</th>
                      <th>Spécialité</th>
                      <th>Région</th>
                      <th>Statut</th>
                      <th>Date d'inscription</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map(member => (
                      <tr key={member.id} className="member-row">
                        <td className="member-number">{member.number}</td>
                        <td className="member-name-cell">
                          <div className="member-name-info">
                            <strong>{member.name}</strong>
                            {member.email && <div className="member-email">{member.email}</div>}
                          </div>
                        </td>
                        <td>
                          <span className="section-badge section-a">{member.section}</span>
                        </td>
                        <td className="member-specialty">{member.specialty}</td>
                        <td className="member-region">{member.region}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(member.status) }}
                          >
                            {getStatusLabel(member.status)}
                          </span>
                        </td>
                        <td className="member-date">
                          {new Date(member.registrationDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn view" title="Voir le profil">
                              👁️
                            </button>
                            <button className="action-btn contact" title="Contacter">
                              📧
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Vue cartes */
            <div className="membres-cards-grid">
              {currentMembers.map(member => (
                <div key={member.id} className="member-card-tableau">
                  <div className="member-card-header">
                    <div className="member-number-badge">{member.number}</div>
                    <div className="member-status-indicator">
                      <span
                        className="status-dot"
                        style={{ backgroundColor: getStatusColor(member.status) }}
                      ></span>
                      {getStatusLabel(member.status)}
                    </div>
                  </div>

                  <div className="member-card-content">
                    <h3 className="member-card-name">{member.name}</h3>
                    <div className="member-card-section">
                      Section {member.section} - {getSectionLabel(member.section)}
                    </div>
                    <div className="member-card-specialty">{member.specialty}</div>
                    <div className="member-card-region">📍 {member.region}</div>
                    <div className="member-card-date">
                      Inscrit le {new Date(member.registrationDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="member-card-actions">
                    <button className="member-card-btn primary">
                      Voir le profil →
                    </button>
                  </div>
                </div>
              ))}
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

      {/* Section statistiques détaillées */}
      <section className="stats-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Répartition des membres
            </h2>
            <p className="section-subtitle">
              Statistiques détaillées par section et région
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card-large">
              <h3>Répartition par section</h3>
              <div className="sections-stats">
                <div className="section-stat">
                  <div className="section-info">
                    <span className="section-label">Section A - Officinaux</span>
                    <span className="section-count">{stats.sectionsBreakdown.A}</span>
                  </div>
                  <div className="section-bar">
                    <div
                      className="section-bar-fill"
                      style={{ width: `${(stats.sectionsBreakdown.A / stats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="section-stat">
                  <div className="section-info">
                    <span className="section-label">Section B - Biologistes</span>
                    <span className="section-count">{stats.sectionsBreakdown.B}</span>
                  </div>
                  <div className="section-bar">
                    <div
                      className="section-bar-fill"
                      style={{ width: `${(stats.sectionsBreakdown.B / stats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="section-stat">
                  <div className="section-info">
                    <span className="section-label">Section C - Fonctionnaires</span>
                    <span className="section-count">{stats.sectionsBreakdown.C}</span>
                  </div>
                  <div className="section-bar">
                    <div
                      className="section-bar-fill"
                      style={{ width: `${(stats.sectionsBreakdown.C / stats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="section-stat">
                  <div className="section-info">
                    <span className="section-label">Section D - Fabricants/Grossistes</span>
                    <span className="section-count">{stats.sectionsBreakdown.D}</span>
                  </div>
                  <div className="section-bar">
                    <div
                      className="section-bar-fill"
                      style={{ width: `${(stats.sectionsBreakdown.D / stats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card-large">
              <h3>Informations générales</h3>
              <div className="general-stats">
                <div className="stat-item-large">
                  <div className="stat-icon-large">👥</div>
                  <div className="stat-content">
                    <div className="stat-value-large">{stats.totalMembers}</div>
                    <div className="stat-label-large">Membres inscrits</div>
                  </div>
                </div>
                <div className="stat-item-large">
                  <div className="stat-icon-large">✅</div>
                  <div className="stat-content">
                    <div className="stat-value-large">{stats.activeMembers}</div>
                    <div className="stat-label-large">Membres actifs</div>
                  </div>
                </div>
                <div className="stat-item-large">
                  <div className="stat-icon-large">📍</div>
                  <div className="stat-content">
                    <div className="stat-value-large">{stats.regionsCount}</div>
                    <div className="stat-label-large">Régions couvertes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TableauOrdre;

