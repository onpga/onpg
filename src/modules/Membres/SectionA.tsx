import { useState, useEffect, useMemo } from 'react';

// Types pour les membres de la section A
interface Pharmacien {
  id: string;
  number: string;
  name: string;
  pharmacy: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  status: 'active' | 'suspended' | 'retired';
  registrationDate: string;
  garde: boolean;
  ouvert: boolean;
  horaires: {
    lundi: string;
    mardi: string;
    mercredi: string;
    jeudi: string;
    vendredi: string;
    samedi: string;
    dimanche: string;
  };
}

const mockPharmaciens: Pharmacien[] = [
  {
    id: '1',
    number: 'A001-2020',
    name: 'Dr. Alain Moreau',
    pharmacy: 'Pharmacie Centrale',
    address: 'Boulevard du Bord de Mer, Centre-ville',
    city: 'Libreville',
    region: 'Libreville',
    phone: '+241 XX XX XX XX',
    email: 'pharmacie.centrale@email.ga',
    status: 'active',
    registrationDate: '2020-01-15',
    garde: true,
    ouvert: true,
    horaires: {
      lundi: '8h00-18h00',
      mardi: '8h00-18h00',
      mercredi: '8h00-18h00',
      jeudi: '8h00-18h00',
      vendredi: '8h00-18h00',
      samedi: '8h00-12h00',
      dimanche: 'Fermé'
    }
  },
  {
    id: '2',
    number: 'A002-2020',
    name: 'Dr. Marie Dubois',
    pharmacy: 'Pharmacie du Bien-être',
    address: 'Avenue de l\'Indépendance, Quartier Louis',
    city: 'Libreville',
    region: 'Libreville',
    phone: '+241 XX XX XX XX',
    email: 'pharmacie.bienetre@email.ga',
    status: 'active',
    registrationDate: '2020-02-01',
    garde: false,
    ouvert: true,
    horaires: {
      lundi: '8h00-19h00',
      mardi: '8h00-19h00',
      mercredi: '8h00-19h00',
      jeudi: '8h00-19h00',
      vendredi: '8h00-19h00',
      samedi: '8h00-13h00',
      dimanche: 'Fermé'
    }
  },
  {
    id: '3',
    number: 'A003-2020',
    name: 'Dr. Jean Martin',
    pharmacy: 'Pharmacie Port-Gentil',
    address: 'Boulevard Maritime, Centre-ville',
    city: 'Port-Gentil',
    region: 'Port-Gentil',
    phone: '+241 XX XX XX XX',
    email: 'pharmacie.portgentil@email.ga',
    status: 'active',
    registrationDate: '2020-02-15',
    garde: true,
    ouvert: false,
    horaires: {
      lundi: '7h30-17h30',
      mardi: '7h30-17h30',
      mercredi: '7h30-17h30',
      jeudi: '7h30-17h30',
      vendredi: '7h30-17h30',
      samedi: '8h00-12h00',
      dimanche: 'Fermé'
    }
  }
];

const SectionA = () => {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>(mockPharmaciens);
  const [filteredPharmaciens, setFilteredPharmaciens] = useState<Pharmacien[]>(mockPharmaciens);
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [gardeOnly, setGardeOnly] = useState(false);
  const [ouvertOnly, setOuvertOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const pharmaciensPerPage = 12;

  // Filtrage
  useEffect(() => {
    let filtered = pharmaciens.filter(pharmacien => {
      const matchesSearch = pharmacien.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pharmacien.pharmacy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           pharmacien.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'Toutes' || pharmacien.region === selectedRegion;
      const matchesStatus = selectedStatus === 'Tous' || pharmacien.status === selectedStatus;
      const matchesGarde = !gardeOnly || pharmacien.garde;
      const matchesOuvert = !ouvertOnly || pharmacien.ouvert;
      return matchesSearch && matchesRegion && matchesStatus && matchesGarde && matchesOuvert;
    });

    setFilteredPharmaciens(filtered);
    setCurrentPage(1);
  }, [pharmaciens, searchQuery, selectedRegion, selectedStatus, gardeOnly, ouvertOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredPharmaciens.length / pharmaciensPerPage);
  const startIndex = (currentPage - 1) * pharmaciensPerPage;
  const endIndex = startIndex + pharmaciensPerPage;
  const currentPharmaciens = filteredPharmaciens.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalPharmaciens: pharmaciens.length,
    activePharmaciens: pharmaciens.filter(p => p.status === 'active').length,
    gardePharmacies: pharmaciens.filter(p => p.garde).length,
    ouvertMaintenant: pharmaciens.filter(p => p.ouvert).length,
    regionsCount: new Set(pharmaciens.map(p => p.region)).size
  }), [pharmaciens]);

  const regions = [...new Set(pharmaciens.map(p => p.region))].sort();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('Toutes');
    setSelectedStatus('Tous');
    setGardeOnly(false);
    setOuvertOnly(false);
    setCurrentPage(1);
  };

  const getStatusLabel = (status: Pharmacien['status']) => {
    const labels = {
      'active': 'Actif',
      'suspended': 'Suspendu',
      'retired': 'Retraité'
    };
    return labels[status];
  };

  const getStatusColor = (status: Pharmacien['status']) => {
    const colors = {
      'active': '#27ae60',
      'suspended': '#f39c12',
      'retired': '#95a5a6'
    };
    return colors[status];
  };

  const getCurrentDay = () => {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return days[new Date().getDay()] as keyof Pharmacien['horaires'];
  };

  const isOpenNow = (horaires: Pharmacien['horaires']) => {
    const currentDay = getCurrentDay();
    const horaire = horaires[currentDay];
    if (horaire === 'Fermé') return false;

    const now = new Date();
    const [start, end] = horaire.split('-').map(h => {
      const [hours, minutes] = h.trim().split('h').map(Number);
      return hours * 60 + (minutes || 0);
    });

    const currentTime = now.getHours() * 60 + now.getMinutes();
    return currentTime >= start && currentTime <= end;
  };

  return (
    <div className="membres-page">
      {/* Hero Section spécialisée pour les officinaux */}
      <section className="membres-hero section-a-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section A</span>
              <span className="hero-title-subtitle">Officinaux</span>
            </h1>
            <p className="hero-description">
              Pharmaciens titulaires d'officine. Découvrez l'annuaire complet des pharmacies
              gabonaises avec informations de garde et horaires d'ouverture.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏥 Pharmacies d'officine</span>
              <span className="highlight-item">⏰ Horaires d'ouverture</span>
              <span className="highlight-item">🩺 Service de garde</span>
            </div>
          </div>

          {/* Stats Cards spécialisées */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalPharmaciens}</div>
              <div className="stat-label">Pharmaciens</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.gardePharmacies}</div>
              <div className="stat-label">Pharmacies de garde</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.ouvertMaintenant}</div>
              <div className="stat-label">Ouvertes maintenant</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Filtres spécialisés pour les pharmacies */}
      <div className="membres-filters">
        <div className="filters-container">
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Rechercher une pharmacie ou un pharmacien..."
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
              <label>Région:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="Toutes">Toutes les régions</option>
                {regions.map(region => (
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

            <div className="checkbox-filters">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={gardeOnly}
                  onChange={(e) => setGardeOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                Pharmacies de garde uniquement
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ouvertOnly}
                  onChange={(e) => setOuvertOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                Ouvertes maintenant
              </label>
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
              >
                ⊞ Cartes
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰ Liste
              </button>
            </div>
          </div>

          <div className="sort-section">
            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="section-a-content">
        <div className="section-container">
          <div className="results-header">
            <h2 className="results-title">
              {filteredPharmaciens.length} pharmacien{filteredPharmaciens.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedRegion !== 'Toutes' && ` en ${selectedRegion}`}
              {gardeOnly && ' (garde uniquement)'}
              {ouvertOnly && ' (ouvertes maintenant)'}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {viewMode === 'cards' ? (
            /* Vue cartes spécialisées pharmacies */
            <div className="pharmacies-grid">
              {currentPharmaciens.map((pharmacien, index) => (
                <div
                  key={pharmacien.id}
                  className={`pharmacy-card ${pharmacien.garde ? 'garde' : ''} ${pharmacien.ouvert ? 'ouvert' : 'ferme'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="pharmacy-header">
                    <div className="pharmacy-status">
                      {pharmacien.garde && (
                        <span className="garde-badge">🩺 GARDE</span>
                      )}
                      <span
                        className={`ouvert-badge ${pharmacien.ouvert ? 'ouvert' : 'ferme'}`}
                      >
                        {pharmacien.ouvert ? '🟢 Ouvert' : '🔴 Fermé'}
                      </span>
                    </div>
                    <div className="pharmacy-number">N° {pharmacien.number}</div>
                  </div>

                  <div className="pharmacy-content">
                    <h3 className="pharmacy-name">{pharmacien.pharmacy}</h3>
                    <div className="pharmacy-owner">Dr. {pharmacien.name}</div>

                    <div className="pharmacy-location">
                      <div className="location-address">{pharmacien.address}</div>
                      <div className="location-city">📍 {pharmacien.city}</div>
                    </div>

                    <div className="pharmacy-contact">
                      <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        {pharmacien.phone}
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        {pharmacien.email}
                      </div>
                    </div>

                    <div className="pharmacy-horaires">
                      <div className="horaires-today">
                        <strong>Aujourd'hui ({getCurrentDay().charAt(0).toUpperCase() + getCurrentDay().slice(1)}):</strong>
                        <span className={pharmacien.ouvert ? 'horaires-ouvert' : 'horaires-ferme'}>
                          {pharmacien.horaires[getCurrentDay()]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pharmacy-actions">
                    <button className="pharmacy-btn primary">
                      📍 Itinéraire
                    </button>
                    <button className="pharmacy-btn secondary">
                      📞 Appeler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Vue liste spécialisée pharmacies */
            <div className="pharmacies-list">
              {currentPharmaciens.map((pharmacien, index) => (
                <div
                  key={pharmacien.id}
                  className="pharmacy-list-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="pharmacy-list-status">
                    <div className="status-indicators">
                      {pharmacien.garde && <span className="garde-indicator">🩺</span>}
                      <span className={`ouvert-indicator ${pharmacien.ouvert ? 'ouvert' : 'ferme'}`}>
                        {pharmacien.ouvert ? '🟢' : '🔴'}
                      </span>
                    </div>
                    <div className="pharmacy-number">N° {pharmacien.number}</div>
                  </div>

                  <div className="pharmacy-list-content">
                    <div className="pharmacy-list-header">
                      <h3>{pharmacien.pharmacy}</h3>
                      <div className="pharmacy-owner">Dr. {pharmacien.name}</div>
                    </div>
                    <div className="pharmacy-list-location">
                      <span>{pharmacien.address}, {pharmacien.city}</span>
                      <span className="horaires-preview">
                        Aujourd'hui: {pharmacien.horaires[getCurrentDay()]}
                      </span>
                    </div>
                  </div>

                  <div className="pharmacy-list-actions">
                    <button className="pharmacy-btn primary">
                      📍 Itinéraire
                    </button>
                    <button className="pharmacy-btn secondary">
                      📞 Appeler
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

      {/* Section informations pratiques */}
      <section className="info-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">ℹ️</span>
              Informations Pratiques
            </h2>
            <p className="section-subtitle">
              Tout savoir sur les pharmacies au Gabon
            </p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🩺</div>
              <h3>Pharmacies de Garde</h3>
              <p>
                Les pharmacies de garde assurent la continuité des soins 24h/24.
                Elles sont clairement signalées et alternent selon un planning établi.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">💊</div>
              <h3>Médicaments</h3>
              <p>
                Toutes les pharmacies sont habilitées à délivrer les médicaments
                sur prescription médicale ainsi que certains médicaments sans ordonnance.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Horaires d'Ouverture</h3>
              <p>
                Les pharmacies sont généralement ouvertes du lundi au vendredi
                de 8h à 18h, le samedi de 8h à 12h. Certaines ouvrent plus tard.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Urgences</h3>
              <p>
                En cas d'urgence médicale, contactez le service d'urgence
                ou rendez-vous à la pharmacie de garde la plus proche.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectionA;

