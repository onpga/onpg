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
  horaires?: {
    lundi?: string;
    mardi?: string;
    mercredi?: string;
    jeudi?: string;
    vendredi?: string;
    samedi?: string;
    dimanche?: string;
  };
  garde?: boolean;
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
  const [gardeOnly, setGardeOnly] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Charger les pharmacies depuis l'API
  useEffect(() => {
    loadPharmacies();
  }, [selectedVille, selectedQuartier, searchQuery, gardeOnly, userLocation]);

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
      if (gardeOnly) {
        params.append('garde', 'true');
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

            {/* Filtre Garde */}
            <div className="filter-group checkbox-group">
              <label className="checkbox-label" style={{ fontSize: '1.1rem', padding: '1rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={gardeOnly}
                  onChange={(e) => setGardeOnly(e.target.checked)}
                  className="checkbox-input"
                  style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}
                />
                <span className="checkbox-text">🚨 Pharmacies de garde</span>
              </label>
            </div>

            {/* Bouton Géolocalisation */}
            <button
              type="button"
              onClick={() => setUseLocation(!useLocation)}
              className="search-button"
              style={{ 
                fontSize: '1.1rem', 
                padding: '1rem 1.5rem',
                background: useLocation 
                  ? 'linear-gradient(135deg, #00a651 0%, #27ae60 100%)' 
                  : 'linear-gradient(135deg, #718096 0%, #4a5568 100%)'
              }}
            >
              📍 {useLocation ? 'Tri par distance activé' : 'Afficher les plus proches'}
            </button>
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
            <div className="pharmacies-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {pharmacies.map(pharmacie => (
                <div key={pharmacie._id} className="pharmacie-card" style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  display: 'flex',
                  flexDirection: 'column'
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
                    <div className="card-image" style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={pharmacie.photo}
                        alt={`Pharmacie ${pharmacie.nom}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      {pharmacie.garde && (
                        <div className="garde-badge" style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                          color: 'white',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)',
                          zIndex: 10
                        }}>
                          🚨 DE GARDE
                        </div>
                      )}
                    </div>
                  )}
                  {!pharmacie.photo && (
                    <div style={{ height: '120px', background: 'linear-gradient(135deg, #00A651 0%, #27AE60 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '3rem' }}>🏥</span>
                      {pharmacie.garde && (
                        <div style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                          color: 'white',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)'
                        }}>
                          🚨 DE GARDE
                        </div>
                      )}
                    </div>
                  )}

                  <div className="card-content" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <h3 className="pharmacie-nom" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, flex: 1 }}>
                        {pharmacie.nom}
                      </h3>
                      {pharmacie.distance && (
                        <div style={{ 
                          background: '#00A651', 
                          color: 'white', 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '12px', 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          marginLeft: '0.5rem'
                        }}>
                          📍 {formatDistance(pharmacie.distance)}
                        </div>
                      )}
                    </div>

                    <div className="pharmacie-location" style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                      <strong>📍</strong> {pharmacie.ville} {pharmacie.quartier && `- ${pharmacie.quartier}`}
                    </div>

                    <div className="pharmacie-adresse" style={{ 
                      fontSize: '0.9rem',
                      color: '#666',
                      marginBottom: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      {pharmacie.adresse}
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #e0e0e0',
                      fontSize: '0.9rem'
                    }}>
                      {pharmacie.telephone && (
                        <a href={`tel:${pharmacie.telephone}`} style={{ 
                          color: '#00A651', 
                          textDecoration: 'none', 
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          📞 {pharmacie.telephone}
                        </a>
                      )}
                      {pharmacie.email && (
                        <span style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          ✉️ {pharmacie.email}
                        </span>
                      )}
                    </div>

                    {/* Horaires - Compact */}
                    {pharmacie.horaires && Object.keys(pharmacie.horaires).some(k => pharmacie.horaires[k as keyof typeof pharmacie.horaires]) && (
                      <div style={{ 
                        marginTop: '0.75rem', 
                        padding: '0.75rem', 
                        background: '#f8f9fa', 
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}>
                        <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#2d3748', fontSize: '0.9rem' }}>🕐 Horaires :</strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', color: '#666' }}>
                          {pharmacie.horaires.lundi && <div>Lun: {pharmacie.horaires.lundi}</div>}
                          {pharmacie.horaires.mardi && <div>Mar: {pharmacie.horaires.mardi}</div>}
                          {pharmacie.horaires.mercredi && <div>Mer: {pharmacie.horaires.mercredi}</div>}
                          {pharmacie.horaires.jeudi && <div>Jeu: {pharmacie.horaires.jeudi}</div>}
                          {pharmacie.horaires.vendredi && <div>Ven: {pharmacie.horaires.vendredi}</div>}
                          {pharmacie.horaires.samedi && <div>Sam: {pharmacie.horaires.samedi}</div>}
                          {pharmacie.horaires.dimanche && <div>Dim: {pharmacie.horaires.dimanche}</div>}
                        </div>
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
