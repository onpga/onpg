import React, { useState, useEffect, useMemo } from 'react';
import './TrouverPharmacie.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Interface pour une pharmacie
interface Pharmacie {
  _id: string;
  nom: string;
  ville: string;
  quartier: string;
  adresse: string;
  telephone: string;
  email?: string;
  photo: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance en mètres
  messages?: Message[];
  horaires?: any;
}

interface Message {
  _id: string;
  type: 'visiteur' | 'ordre' | 'autre';
  titre: string;
  contenu: string;
  visibleVisiteurs: boolean;
  visibleOrdre: boolean;
}

const TrouverPharmacie: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVille, setSelectedVille] = useState('Toutes les villes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous les quartiers');
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Charger les pharmacies depuis l'API
  useEffect(() => {
    loadPharmacies();
  }, [selectedVille, selectedQuartier, searchQuery, userLocation]);

  // Demander la géolocalisation si activée
  useEffect(() => {
    if (useLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          setUseLocation(false);
          alert('Impossible d\'obtenir votre position. Vérifiez les permissions de géolocalisation.');
        }
      );
    } else if (!useLocation) {
      setUserLocation(null);
    }
  }, [useLocation]);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedVille !== 'Toutes les villes') {
        params.append('ville', selectedVille);
      }
      if (selectedQuartier !== 'Tous les quartiers') {
        params.append('quartier', selectedQuartier);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (userLocation) {
        params.append('latitude', userLocation.lat.toString());
        params.append('longitude', userLocation.lng.toString());
      }

      const response = await fetch(`${API_URL}/public/pharmacies?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setPharmacies(data.data || []);
      } else {
        // Fallback sur données mock si API échoue
        setPharmacies([]);
      }
    } catch (error) {
      console.error('Erreur chargement pharmacies:', error);
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  // Villes et quartiers disponibles depuis les pharmacies
  const villes = useMemo(() => {
    const uniqueVilles = [...new Set(pharmacies.map(p => p.ville).filter(v => v))].sort();
    return ['Toutes les villes', ...uniqueVilles];
  }, [pharmacies]);

  const quartiers = useMemo(() => {
    if (selectedVille === 'Toutes les villes') {
      const allQuartiers = [...new Set(pharmacies.map(p => p.quartier).filter(q => q))].sort();
      return ['Tous les quartiers', ...allQuartiers];
    }
    const cityQuartiers = [...new Set(
      pharmacies
        .filter(p => p.ville === selectedVille)
        .map(p => p.quartier)
        .filter(q => q)
    )].sort();
    return ['Tous les quartiers', ...cityQuartiers];
  }, [pharmacies, selectedVille]);

  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <div className="trouver-pharmacie-page">
      {/* Hero Section */}
      <section className="pharmacie-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <h1>Trouver une Pharmacie</h1>
          <p>Localisez facilement une pharmacie près de chez vous au Gabon</p>
        </div>
      </section>

      {/* Barre de recherche et filtres */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-filters">
            {/* Champ de recherche */}
            <div className="search-input-group" style={{ flex: '2' }}>
              <label htmlFor="search-input" className="sr-only">Rechercher une pharmacie</label>
              <input
                id="search-input"
                type="text"
                placeholder="Nom de la pharmacie ou adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              />
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Liste déroulante Ville */}
            <div className="filter-group">
              <label htmlFor="ville-select" className="sr-only">Ville</label>
              <select
                id="ville-select"
                value={selectedVille}
                onChange={(e) => {
                  setSelectedVille(e.target.value);
                  setSelectedQuartier('Tous les quartiers');
                }}
                className="filter-select"
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              >
                {villes.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            {/* Liste déroulante Quartier */}
            <div className="filter-group">
              <label htmlFor="quartier-select" className="sr-only">Quartier</label>
              <select
                id="quartier-select"
                value={selectedQuartier}
                onChange={(e) => setSelectedQuartier(e.target.value)}
                className="filter-select"
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              >
                {quartiers.map(quartier => (
                  <option key={quartier} value={quartier}>{quartier}</option>
                ))}
              </select>
            </div>

            {/* Toggle Géolocalisation */}
            <div className="filter-group checkbox-group">
              <label className="checkbox-label" style={{ fontSize: '1.1rem', padding: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={useLocation}
                  onChange={(e) => setUseLocation(e.target.checked)}
                  className="checkbox-input"
                  style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}
                />
                <span className="checkbox-text">📍 Trier par distance</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="results-section">
        <div className="results-container">
          <div className="results-header">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {loading ? 'Chargement...' : `Résultats (${pharmacies.length})`}
            </h2>
            {userLocation && (
              <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
                📍 Triées par distance depuis votre position
              </p>
            )}
            {!loading && pharmacies.length === 0 && (
              <p className="no-results" style={{ fontSize: '1.2rem', padding: '2rem' }}>
                Aucune pharmacie trouvée pour ces critères.
              </p>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem' }}>
              Chargement des pharmacies...
            </div>
          ) : (
            <div className="pharmacies-grid">
              {pharmacies.map(pharmacie => (
                <div key={pharmacie._id} className="pharmacie-card" style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                >
                  {pharmacie.photo && (
                    <div className="card-image" style={{ height: '200px', overflow: 'hidden' }}>
                      <img
                        src={pharmacie.photo}
                        alt={`Pharmacie ${pharmacie.nom}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="card-content" style={{ padding: '1.5rem' }}>
                    <h3 className="pharmacie-nom" style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                      {pharmacie.nom}
                    </h3>
                    
                    {pharmacie.distance && (
                      <div style={{ 
                        display: 'inline-block', 
                        background: '#00A651', 
                        color: 'white', 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.9rem', 
                        fontWeight: '600',
                        marginBottom: '0.75rem'
                      }}>
                        📍 {formatDistance(pharmacie.distance)}
                      </div>
                    )}

                    <div className="pharmacie-location" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
                      <span className="location-text">
                        {pharmacie.ville} {pharmacie.quartier && `- ${pharmacie.quartier}`}
                      </span>
                    </div>

                    <div className="pharmacie-adresse" style={{ 
                      display: 'flex', 
                      alignItems: 'start', 
                      gap: '0.5rem', 
                      marginBottom: '0.75rem',
                      fontSize: '1rem',
                      color: '#666'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="adresse-text">{pharmacie.adresse}</span>
                    </div>

                    {pharmacie.telephone && (
                      <div className="pharmacie-contact" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '0.5rem',
                        fontSize: '1rem'
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C15.72 20.22 10.92 16.52 7.92 12.32C4.92 8.12 3.92 3.32 4.72 1.32C5.02 0.72 5.52 0.32 6.12 0.32H9.12C9.52 0.32 9.82 0.62 9.82 1.02C9.82 1.32 9.72 1.62 9.52 1.82L8.12 3.22C7.92 3.42 7.82 3.72 7.92 4.02C8.12 7.02 9.72 9.92 12.02 12.22C14.32 14.52 17.22 16.12 20.22 16.32C20.52 16.32 20.82 16.22 21.02 16.02L22.42 14.62C22.62 14.42 22.92 14.32 23.22 14.32C23.62 14.32 23.92 14.62 23.92 15.02V18.02C23.92 18.52 23.42 18.92 22.92 18.92H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <a href={`tel:${pharmacie.telephone}`} className="telephone-link" style={{ color: '#00A651', textDecoration: 'none' }}>
                          {pharmacie.telephone}
                        </a>
                      </div>
                    )}

                    {pharmacie.email && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '0.5rem',
                        fontSize: '1rem',
                        color: '#666'
                      }}>
                        <span>✉️</span>
                        <span>{pharmacie.email}</span>
                      </div>
                    )}

                    {/* Messages/Alerte visibles aux visiteurs */}
                    {pharmacie.messages && pharmacie.messages.length > 0 && (
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: '#fff3cd', 
                        borderRadius: '8px',
                        border: '1px solid #ffc107'
                      }}>
                        {pharmacie.messages
                          .filter(m => m.visibleVisiteurs)
                          .map((msg) => (
                            <div key={msg._id} style={{ marginBottom: '0.5rem' }}>
                              <strong style={{ color: '#856404', fontSize: '1rem' }}>⚠️ {msg.titre}</strong>
                              <p style={{ marginTop: '0.25rem', fontSize: '0.95rem', color: '#856404' }}>
                                {msg.contenu}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrouverPharmacie;
