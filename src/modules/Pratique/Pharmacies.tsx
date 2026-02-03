import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les pharmacies
interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  quartier: string;
  phone: string;
  garde: boolean;
  ouvert: boolean;
  latitude: number;
  longitude: number;
  distance?: number;
  horaires: {
    lundi: string;
    mardi: string;
    mercredi: string;
    jeudi: string;
    vendredi: string;
    samedi: string;
    dimanche: string;
  };
  services: string[];
  photo: string;
}

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Pharmacie Centrale',
    address: 'Boulevard du Bord de Mer, Centre-ville',
    city: 'Libreville',
    quartier: 'Plateau',
    phone: '+241 01 44 44 44',
    garde: true,
    ouvert: true,
    latitude: 0.4162,
    longitude: 9.4673,
    horaires: {
      lundi: '8h00-18h00',
      mardi: '8h00-18h00',
      mercredi: '8h00-18h00',
      jeudi: '8h00-18h00',
      vendredi: '8h00-18h00',
      samedi: '8h00-12h00',
      dimanche: 'Fermé'
    },
    services: ['Vaccination', 'Tests COVID', 'Livraison', 'Conseil'],
    photo: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Pharmacie du Bien-être',
    address: 'Avenue de l\'Indépendance, Quartier Louis',
    city: 'Libreville',
    quartier: 'Louis',
    phone: '+241 01 55 55 55',
    garde: false,
    ouvert: true,
    latitude: 0.3900,
    longitude: 9.4500,
    horaires: {
      lundi: '8h00-19h00',
      mardi: '8h00-19h00',
      mercredi: '8h00-19h00',
      jeudi: '8h00-19h00',
      vendredi: '8h00-19h00',
      samedi: '8h00-13h00',
      dimanche: 'Fermé'
    },
    services: ['Orthopédie', 'Homéopathie', 'Parapharmacie'],
    photo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Pharmacie Port-Gentil',
    address: 'Boulevard Maritime, Centre-ville',
    city: 'Port-Gentil',
    quartier: 'Centre-ville',
    phone: '+241 07 66 66 66',
    garde: true,
    ouvert: false,
    latitude: -0.7193,
    longitude: 8.7815,
    horaires: {
      lundi: '7h30-17h30',
      mardi: '7h30-17h30',
      mercredi: '7h30-17h30',
      jeudi: '7h30-17h30',
      vendredi: '7h30-17h30',
      samedi: '8h00-12h00',
      dimanche: 'Fermé'
    },
    services: ['Urgences', 'Médicaments rares', 'Consultation'],
    photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Pharmacie Moderne',
    address: 'Rue de la Paix, Quartier Glass',
    city: 'Libreville',
    quartier: 'Glass',
    phone: '+241 01 77 77 77',
    garde: false,
    ouvert: true,
    latitude: 0.4300,
    longitude: 9.4800,
    horaires: {
      lundi: '9h00-18h00',
      mardi: '9h00-18h00',
      mercredi: '9h00-18h00',
      jeudi: '9h00-18h00',
      vendredi: '9h00-18h00',
      samedi: '9h00-13h00',
      dimanche: 'Fermé'
    },
    services: ['Diététique', 'Cosmétique', 'Compléments alimentaires'],
    photo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop'
  }
];

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous');
  const [gardeOnly, setGardeOnly] = useState(false);
  const [ouvertOnly, setOuvertOnly] = useState(false);
  const [prochesOnly, setProchesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'map'>('cards');
  const [currentPage, setCurrentPage] = useState(1);

  const pharmaciesPerPage = 12;

  // Géolocalisation
  useEffect(() => {
    if (prochesOnly && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erreur de géolocalisation:', error);
          setProchesOnly(false);
        }
      );
    }
  }, [prochesOnly]);

  // Calcul des distances
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filtrage et tri
  useEffect(() => {
    let filtered = pharmacies.map(pharmacy => {
      let distance;
      if (currentLocation && prochesOnly) {
        distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          pharmacy.latitude,
          pharmacy.longitude
        );
      }
      return { ...pharmacy, distance };
    });

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.quartier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrage par ville
    if (selectedCity !== 'Toutes') {
      filtered = filtered.filter(pharmacy => pharmacy.city === selectedCity);
    }

    // Filtrage par quartier
    if (selectedQuartier !== 'Tous') {
      filtered = filtered.filter(pharmacy => pharmacy.quartier === selectedQuartier);
    }

    // Filtrage garde uniquement
    if (gardeOnly) {
      filtered = filtered.filter(pharmacy => pharmacy.garde);
    }

    // Filtrage ouvert uniquement
    if (ouvertOnly) {
      filtered = filtered.filter(pharmacy => pharmacy.ouvert);
    }

    // Tri par distance si activé
    if (prochesOnly && currentLocation) {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredPharmacies(filtered);
    setCurrentPage(1);
  }, [pharmacies, searchQuery, selectedCity, selectedQuartier, gardeOnly, ouvertOnly, prochesOnly, currentLocation]);

  // Pagination
  const totalPages = Math.ceil(filteredPharmacies.length / pharmaciesPerPage);
  const startIndex = (currentPage - 1) * pharmaciesPerPage;
  const endIndex = startIndex + pharmaciesPerPage;
  const currentPharmacies = filteredPharmacies.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalPharmacies: pharmacies.length,
    gardePharmacies: pharmacies.filter(p => p.garde).length,
    ouvertMaintenant: pharmacies.filter(p => p.ouvert).length,
    villesCount: new Set(pharmacies.map(p => p.city)).size,
    quartiersCount: new Set(pharmacies.map(p => p.quartier)).size
  }), [pharmacies]);

  const cities = [...new Set(pharmacies.map(p => p.city))].sort();
  const quartiers = [...new Set(pharmacies.map(p => p.quartier))].sort();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('Toutes');
    setSelectedQuartier('Tous');
    setGardeOnly(false);
    setOuvertOnly(false);
    setProchesOnly(false);
    setCurrentPage(1);
  };

  const getCurrentDay = () => {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return days[new Date().getDay()] as keyof Pharmacy['horaires'];
  };

  return (
    <div className="pratique-page">
      {/* Hero Section spécialisé pharmacies */}
      <section className="pratique-hero pharmacies-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Annuaire des</span>
              <span className="hero-title-subtitle">Pharmacies</span>
            </h1>
            <p className="hero-description">
              Trouvez la pharmacie la plus proche avec horaires d'ouverture,
              services de garde et géolocalisation en temps réel.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">📍 Géolocalisation</span>
              <span className="highlight-item">🩺 Pharmacies de garde</span>
              <span className="highlight-item">⏰ Horaires temps réel</span>
            </div>
          </div>

          {/* Stats Cards spécialisées */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalPharmacies}</div>
              <div className="stat-label">Pharmacies</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.gardePharmacies}</div>
              <div className="stat-label">De garde</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.ouvertMaintenant}</div>
              <div className="stat-label">Ouvertes</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Filtres avancés pour pharmacies */}
      <div className="pratique-filters">
        <div className="filters-container">
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Rechercher une pharmacie, une adresse..."
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
              <label>Ville:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="Toutes">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Quartier:</label>
              <select
                value={selectedQuartier}
                onChange={(e) => setSelectedQuartier(e.target.value)}
              >
                <option value="Tous">Tous les quartiers</option>
                {quartiers.map(quartier => (
                  <option key={quartier} value={quartier}>{quartier}</option>
                ))}
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

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={prochesOnly}
                  onChange={(e) => setProchesOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                Les plus proches
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
              <button
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Carte
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

      {/* Contenu principal selon la vue */}
      <section className="pharmacies-content">
        <div className="section-container">
          <div className="results-header">
            <h2 className="results-title">
              {filteredPharmacies.length} pharmac{filteredPharmacies.length > 1 ? 'ies' : 'ie'}
              trouvée{filteredPharmacies.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedCity !== 'Toutes' && ` à ${selectedCity}`}
              {gardeOnly && ' (garde uniquement)'}
              {ouvertOnly && ' (ouvertes maintenant)'}
              {prochesOnly && ' (triées par distance)'}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {viewMode === 'cards' && (
            /* Vue cartes détaillées */
            <div className="pharmacies-grid">
              {currentPharmacies.map((pharmacy, index) => (
                <div
                  key={pharmacy.id}
                  className={`pharmacy-card-detail ${pharmacy.garde ? 'garde' : ''} ${pharmacy.ouvert ? 'ouvert' : 'ferme'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="pharmacy-photo">
                    <img src={pharmacy.photo} alt={pharmacy.name} />
                    <div className="photo-overlay">
                      {pharmacy.garde && (
                        <span className="garde-badge-photo">🩺 GARDE</span>
                      )}
                      <span className={`ouvert-badge-photo ${pharmacy.ouvert ? 'ouvert' : 'ferme'}`}>
                        {pharmacy.ouvert ? '🟢 Ouvert' : '🔴 Fermé'}
                      </span>
                    </div>
                    {pharmacy.distance && (
                      <div className="distance-badge">
                        📍 {pharmacy.distance.toFixed(1)} km
                      </div>
                    )}
                  </div>

                  <div className="pharmacy-content-detail">
                    <h3 className="pharmacy-name-detail">{pharmacy.name}</h3>

                    <div className="pharmacy-location-detail">
                      <div className="location-address-detail">{pharmacy.address}</div>
                      <div className="location-city-detail">
                        📍 {pharmacy.city} - {pharmacy.quartier}
                      </div>
                    </div>

                    <div className="pharmacy-contact-detail">
                      <div className="contact-item-detail">
                        <span className="contact-icon-detail">📞</span>
                        <a href={`tel:${pharmacy.phone}`} className="contact-link">
                          {pharmacy.phone}
                        </a>
                      </div>
                    </div>

                    <div className="pharmacy-horaires-detail">
                      <div className="horaires-today-detail">
                        <strong>Aujourd'hui ({getCurrentDay().charAt(0).toUpperCase() + getCurrentDay().slice(1)}):</strong>
                        <span className={pharmacy.ouvert ? 'horaires-ouvert' : 'horaires-ferme'}>
                          {pharmacy.horaires[getCurrentDay()]}
                        </span>
                      </div>
                    </div>

                    <div className="pharmacy-services-detail">
                      <div className="services-list">
                        {pharmacy.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="service-tag">{service}</span>
                        ))}
                        {pharmacy.services.length > 3 && (
                          <span className="service-more">+{pharmacy.services.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pharmacy-actions-detail">
                    <button className="pharmacy-btn primary">
                      📍 Itinéraire
                    </button>
                    <button className="pharmacy-btn secondary">
                      📞 Appeler
                    </button>
                    <button className="pharmacy-btn tertiary">
                      ℹ️ Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            /* Vue liste compacte */
            <div className="pharmacies-list-compact">
              {currentPharmacies.map((pharmacy, index) => (
                <div
                  key={pharmacy.id}
                  className="pharmacy-list-item-compact"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="pharmacy-list-status-compact">
                    <div className="status-indicators-compact">
                      {pharmacy.garde && <span className="garde-indicator-compact">🩺</span>}
                      <span className={`ouvert-indicator-compact ${pharmacy.ouvert ? 'ouvert' : 'ferme'}`}>
                        {pharmacy.ouvert ? '🟢' : '🔴'}
                      </span>
                    </div>
                  </div>

                  <div className="pharmacy-list-content-compact">
                    <div className="pharmacy-list-header-compact">
                      <h3>{pharmacy.name}</h3>
                      <div className="pharmacy-location-compact">
                        {pharmacy.address}, {pharmacy.city}
                      </div>
                      <div className="pharmacy-horaires-compact">
                        Aujourd'hui: {pharmacy.horaires[getCurrentDay()]}
                        {pharmacy.distance && (
                          <span className="distance-compact"> • {pharmacy.distance.toFixed(1)} km</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pharmacy-list-actions-compact">
                    <button className="pharmacy-btn primary small">
                      📍 Itinéraire
                    </button>
                    <button className="pharmacy-btn secondary small">
                      📞 Appeler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'map' && (
            /* Vue carte (placeholder pour l'instant) */
            <div className="map-view">
              <div className="map-placeholder">
                <div className="map-icon">🗺️</div>
                <h3>Vue Carte</h3>
                <p>Fonctionnalité de carte interactive en cours de développement</p>
                <div className="map-preview">
                  {currentPharmacies.slice(0, 5).map(pharmacy => (
                    <div key={pharmacy.id} className="map-marker">
                      📍 {pharmacy.name}
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="info-icon">⏰</div>
              <h3>Horaires d'Ouverture</h3>
              <p>
                Les pharmacies sont généralement ouvertes du lundi au vendredi
                de 8h à 18h, le samedi de 8h à 12h. Certaines ouvrent plus tard.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🚨</div>
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

export default Pharmacies;

