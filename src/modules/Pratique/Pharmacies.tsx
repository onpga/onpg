import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Pharmacies.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Types pour les pharmacies (basé sur l'API)
interface Pharmacy {
  _id: string;
  nom: string;
  adresse: string;
  ville: string;
  quartier: string;
  telephone: string;
  email?: string;
  garde: boolean;
  latitude?: number;
  longitude?: number;
  distance?: number;
  photo?: string;
  horaires?: {
    lundi?: string;
    mardi?: string;
    mercredi?: string;
    jeudi?: string;
    vendredi?: string;
    samedi?: string;
    dimanche?: string;
  };
  ouvert?: boolean;
}

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous');
  const [gardeOnly, setGardeOnly] = useState(false);
  const [ouvertOnly, setOuvertOnly] = useState(false);
  const [prochesOnly, setProchesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'map'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const filtersRef = useRef<HTMLDivElement>(null);

  const pharmaciesPerPage = 12;

  // Charger les pharmacies depuis l'API
  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (selectedCity !== 'Toutes') {
          params.append('ville', selectedCity);
        }
        if (selectedQuartier !== 'Tous') {
          params.append('quartier', selectedQuartier);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (gardeOnly) {
          params.append('garde', 'true');
        }
        if (currentLocation) {
          params.append('latitude', currentLocation.lat.toString());
          params.append('longitude', currentLocation.lng.toString());
        }

        const url = `${API_URL}/public/pharmacies?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Mapper les données de l'API vers le format attendu
          const mappedPharmacies: Pharmacy[] = data.data.map((ph: any) => ({
            _id: ph._id,
            nom: ph.nom || '',
            adresse: ph.adresse || '',
            ville: ph.ville || '',
            quartier: ph.quartier || '',
            telephone: ph.telephone || '',
            email: ph.email,
            garde: ph.garde || false,
            latitude: ph.latitude,
            longitude: ph.longitude,
            photo: ph.photo || '',
            horaires: ph.horaires || {},
            ouvert: ph.ouvert !== undefined ? ph.ouvert : true, // Par défaut ouvert
            distance: ph.distance
          }));
          setPharmacies(mappedPharmacies);
        } else {
          setPharmacies([]);
        }
      } catch (error) {
        console.error('Erreur chargement pharmacies:', error);
        setPharmacies([]);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, [selectedCity, selectedQuartier, searchQuery, gardeOnly, currentLocation]);

  // Gestion du scroll pour masquer/afficher les filtres
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && filtersVisible) {
          setFiltersVisible(false);
        } else if (currentScrollY < lastScrollY && !filtersVisible) {
          setFiltersVisible(true);
        }
      } else {
        setFiltersVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, filtersVisible]);

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

  // Filtrage local (les filtres principaux sont déjà appliqués par l'API)
  useEffect(() => {
    let filtered = [...pharmacies];

    // Filtrage ouvert uniquement (fait côté client car l'API ne le gère pas)
    if (ouvertOnly) {
      filtered = filtered.filter(pharmacy => pharmacy.ouvert !== false);
    }

    // Tri par distance si activé
    if (prochesOnly && currentLocation) {
      filtered = filtered
        .filter(p => p.latitude && p.longitude)
        .map(p => {
          if (!p.distance && p.latitude && p.longitude) {
            p.distance = calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              p.latitude,
              p.longitude
            );
          }
          return p;
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredPharmacies(filtered);
    setCurrentPage(1);
  }, [pharmacies, ouvertOnly, prochesOnly, currentLocation]);

  // Pagination
  const totalPages = Math.ceil(filteredPharmacies.length / pharmaciesPerPage);
  const startIndex = (currentPage - 1) * pharmaciesPerPage;
  const endIndex = startIndex + pharmaciesPerPage;
  const currentPharmacies = filteredPharmacies.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalPharmacies: pharmacies.length,
    gardePharmacies: pharmacies.filter(p => p.garde).length,
    ouvertMaintenant: pharmacies.filter(p => p.ouvert !== false).length,
    villesCount: new Set(pharmacies.map(p => p.ville).filter(v => v)).size,
    quartiersCount: new Set(pharmacies.map(p => p.quartier).filter(q => q)).size
  }), [pharmacies]);

  const cities = [...new Set(pharmacies.map(p => p.ville).filter(v => v))].sort();
  const quartiers = useMemo(() => {
    if (selectedCity === 'Toutes') {
      return [...new Set(pharmacies.map(p => p.quartier).filter(q => q))].sort();
    }
    return [...new Set(pharmacies.filter(p => p.ville === selectedCity).map(p => p.quartier).filter(q => q))].sort();
  }, [pharmacies, selectedCity]);

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
    return days[new Date().getDay()] as keyof NonNullable<Pharmacy['horaires']>;
  };

  if (loading) {
    return (
      <div className="pratique-page">
        <div className="loading-state" style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Chargement des pharmacies...</p>
        </div>
      </div>
    );
  }

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
      <div className="filters-wrapper">
        <div 
          ref={filtersRef}
          className={`pratique-filters ${filtersVisible ? 'visible' : 'hidden'}`}
        >
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
        {/* Bouton pour afficher/masquer les filtres */}
        <button 
          className="toggle-filters-btn"
          onClick={() => setFiltersVisible(!filtersVisible)}
          title={filtersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
        >
          {filtersVisible ? '▲' : '▼'} Filtres
        </button>
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
                  key={pharmacy._id}
                  className={`pharmacy-card-detail ${pharmacy.garde ? 'garde' : ''} ${pharmacy.ouvert !== false ? 'ouvert' : 'ferme'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="pharmacy-photo">
                    <img src={pharmacy.photo || 'https://res.cloudinary.com/dduvinjnu/image/upload/w_400,h_300,c_fill,q_80,f_auto,b_rgb:00A651/e_grayscale/onpg/hero/hero-1'} alt={pharmacy.nom} />
                    <div className="pharmacy-photo-gradient" />
                    <div className="photo-overlay">
                      {pharmacy.garde && (
                        <span className="garde-badge-photo">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" fill="currentColor"/></svg>
                          GARDE
                        </span>
                      )}
                      <span className={`ouvert-badge-photo ${pharmacy.ouvert !== false ? 'ouvert' : 'ferme'}`}>
                        <span className="status-dot" />
                        {pharmacy.ouvert !== false ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>
                    {pharmacy.distance && (
                      <div className="distance-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>
                        {pharmacy.distance.toFixed(1)} km
                      </div>
                    )}
                  </div>

                  <div className="pharmacy-content-detail">
                    <h3 className="pharmacy-name-detail">{pharmacy.nom}</h3>

                    <div className="pharmacy-location-detail">
                      <div className="location-address-detail">{pharmacy.adresse}</div>
                      <div className="location-city-detail">
                        📍 {pharmacy.ville} - {pharmacy.quartier}
                      </div>
                    </div>

                    <div className="pharmacy-contact-detail">
                      <div className="contact-item-detail">
                        <span className="contact-icon-detail">📞</span>
                        <a href={`tel:${pharmacy.telephone}`} className="contact-link">
                          {pharmacy.telephone}
                        </a>
                      </div>
                    </div>

                    <div className="pharmacy-horaires-detail">
                      <div className="horaires-today-detail">
                        <strong>Aujourd'hui ({getCurrentDay().charAt(0).toUpperCase() + getCurrentDay().slice(1)}):</strong>
                        <span className={pharmacy.ouvert !== false ? 'horaires-ouvert' : 'horaires-ferme'}>
                          {pharmacy.horaires?.[getCurrentDay()] || 'Non renseigné'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pharmacy-icon-actions">
                    {/* Numéro cliquable en pill */}
                    <a href={`tel:${pharmacy.telephone}`} className="pharmacy-phone-pill" aria-label="Appeler">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" fill="currentColor"/>
                      </svg>
                      {pharmacy.telephone}
                    </a>

                    {/* Groupe d'icônes */}
                    <div className="pharmacy-icon-group">
                      {/* Itinéraire */}
                      <a
                        href={pharmacy.latitude && pharmacy.longitude
                          ? `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.adresse + ' ' + pharmacy.ville)}`
                        }
                        target="_blank" rel="noopener noreferrer"
                        className="pharmacy-action-btn nav"
                        data-tooltip="Itinéraire"
                        aria-label="Voir l'itinéraire"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                        </svg>
                      </a>

                      {/* Appeler */}
                      <a
                        href={`tel:${pharmacy.telephone}`}
                        className="pharmacy-action-btn phone"
                        data-tooltip="Appeler"
                        aria-label="Appeler la pharmacie"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" fill="currentColor"/>
                        </svg>
                      </a>

                      {/* Email si disponible */}
                      {pharmacy.email && (
                        <a
                          href={`mailto:${pharmacy.email}`}
                          className="pharmacy-action-btn email"
                          data-tooltip="Email"
                          aria-label="Envoyer un email"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                          </svg>
                        </a>
                      )}

                      {/* Partager */}
                      <button
                        className="pharmacy-action-btn share"
                        data-tooltip="Partager"
                        aria-label="Partager"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: pharmacy.nom,
                              text: `${pharmacy.nom} — ${pharmacy.adresse}, ${pharmacy.ville}`,
                              url: window.location.href
                            });
                          }
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
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
                  key={pharmacy._id}
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
                      <h3>{pharmacy.nom}</h3>
                      <div className="pharmacy-location-compact">
                        {pharmacy.adresse}, {pharmacy.ville}
                      </div>
                      <div className="pharmacy-horaires-compact">
                        Aujourd'hui: {pharmacy.horaires?.[getCurrentDay()] || 'Non renseigné'}
                        {pharmacy.distance && (
                          <span className="distance-compact"> • {pharmacy.distance.toFixed(1)} km</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pharmacy-icon-actions compact">
                    <a
                      href={pharmacy.latitude && pharmacy.longitude
                        ? `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.adresse + ' ' + pharmacy.ville)}`
                      }
                      target="_blank" rel="noopener noreferrer"
                      className="pharmacy-action-btn nav"
                      data-tooltip="Itinéraire"
                      aria-label="Itinéraire"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                      </svg>
                    </a>
                    <a
                      href={`tel:${pharmacy.telephone}`}
                      className="pharmacy-action-btn phone"
                      data-tooltip="Appeler"
                      aria-label="Appeler"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" fill="currentColor"/>
                      </svg>
                    </a>
                    {pharmacy.email && (
                      <a
                        href={`mailto:${pharmacy.email}`}
                        className="pharmacy-action-btn email"
                        data-tooltip="Email"
                        aria-label="Email"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                        </svg>
                      </a>
                    )}
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
                    <div key={pharmacy._id} className="map-marker">
                      📍 {pharmacy.nom}
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

