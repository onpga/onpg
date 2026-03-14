import { useEffect, useMemo, useState } from 'react';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './TrouverPharmacie.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

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
  distance?: number;
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

const formatDistance = (meters?: number) => {
  if (!meters) return '';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
};

const getTodaySchedule = (horaires?: Pharmacie['horaires']) => {
  if (!horaires) return '';
  const dayMap = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const;
  const key = dayMap[new Date().getDay()];
  return horaires[key] || '';
};

const TrouverPharmacie = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [allPharmacies, setAllPharmacies] = useState<Pharmacie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVille, setSelectedVille] = useState('Toutes les villes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous les quartiers');
  const [gardeOnly, setGardeOnly] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const loadMetaPharmacies = async () => {
      try {
        const response = await fetch(`${API_URL}/public/pharmacies`);
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          setAllPharmacies(data.data);
        } else {
          setAllPharmacies([]);
        }
      } catch (error) {
        console.error('Erreur chargement meta pharmacies:', error);
        setAllPharmacies([]);
      }
    };
    loadMetaPharmacies();
  }, []);

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
          console.error('Erreur geolocalisation:', error);
          setUseLocation(false);
          setUserLocation(null);
        }
      );
    } else if (!useLocation) {
      setUserLocation(null);
    }
  }, [useLocation]);

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedVille !== 'Toutes les villes') params.append('ville', selectedVille);
        if (selectedQuartier !== 'Tous les quartiers') params.append('quartier', selectedQuartier);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (gardeOnly) params.append('garde', 'true');
        if (userLocation) {
          params.append('latitude', String(userLocation.lat));
          params.append('longitude', String(userLocation.lng));
        }

        const url = `${API_URL}/public/pharmacies?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          setPharmacies(data.data);
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
  }, [selectedVille, selectedQuartier, searchQuery, gardeOnly, userLocation]);

  const villes = useMemo(() => {
    const uniqueVilles = [...new Set(allPharmacies.map((p) => p.ville).filter(Boolean))].sort();
    return ['Toutes les villes', ...uniqueVilles];
  }, [allPharmacies]);

  const quartiers = useMemo(() => {
    if (selectedVille === 'Toutes les villes') {
      const q = [...new Set(allPharmacies.map((p) => p.quartier).filter(Boolean))].sort();
      return ['Tous les quartiers', ...q];
    }
    const cityQ = [
      ...new Set(
        allPharmacies
          .filter((p) => p.ville === selectedVille)
          .map((p) => p.quartier)
          .filter(Boolean)
      )
    ].sort();
    return ['Tous les quartiers', ...cityQ];
  }, [allPharmacies, selectedVille]);

  const stats = useMemo(
    () => ({
      total: pharmacies.length,
      garde: pharmacies.filter((p) => p.garde).length,
      nearest: pharmacies.filter((p) => typeof p.distance === 'number').length
    }),
    [pharmacies]
  );

  const hasFilters =
    searchQuery.trim().length > 0 ||
    selectedVille !== 'Toutes les villes' ||
    selectedQuartier !== 'Tous les quartiers' ||
    gardeOnly ||
    useLocation;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedVille('Toutes les villes');
    setSelectedQuartier('Tous les quartiers');
    setGardeOnly(false);
    setUseLocation(false);
  };

  return (
    <div className="trouver-pharmacie-page">
      <section className="tp-hero" aria-labelledby="tp-title">
        <div className="tp-container">
          <span className="tp-eyebrow">Ressources publiques</span>
          <h1 id="tp-title" className="tp-title">Trouver une pharmacie</h1>
          <p className="tp-lead">
            Localisez rapidement les pharmacies actives au Gabon, avec filtres par ville,
            quartier, statut de garde et tri par proximite.
          </p>

          <div className="tp-kpi-grid">
            <article className="tp-kpi-card">
              <strong>{stats.total}</strong>
              <span>Resultats</span>
            </article>
            <article className="tp-kpi-card">
              <strong>{stats.garde}</strong>
              <span>Pharmacies de garde</span>
            </article>
            <article className="tp-kpi-card">
              <strong>{stats.nearest}</strong>
              <span>Avec distance</span>
            </article>
          </div>
        </div>
      </section>

      <section className="tp-filters">
        <div className="tp-container">
          <div className="tp-filters-shell">
            <div className="tp-filter-field search">
              <label htmlFor="tp-search">Recherche</label>
              <input
                id="tp-search"
                type="text"
                placeholder="Nom de la pharmacie ou adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="tp-filter-field">
              <label htmlFor="tp-ville">Ville</label>
              <select
                id="tp-ville"
                value={selectedVille}
                onChange={(e) => {
                  setSelectedVille(e.target.value);
                  setSelectedQuartier('Tous les quartiers');
                }}
              >
                {villes.map((ville) => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            <div className="tp-filter-field">
              <label htmlFor="tp-quartier">Quartier</label>
              <select
                id="tp-quartier"
                value={selectedQuartier}
                onChange={(e) => setSelectedQuartier(e.target.value)}
              >
                {quartiers.map((quartier) => (
                  <option key={quartier} value={quartier}>{quartier}</option>
                ))}
              </select>
            </div>

            <label className="tp-check">
              <input
                type="checkbox"
                checked={gardeOnly}
                onChange={(e) => setGardeOnly(e.target.checked)}
              />
              <span>Pharmacies de garde uniquement</span>
            </label>

            <button
              type="button"
              className={`tp-geo-btn ${useLocation ? 'is-active' : ''}`}
              onClick={() => setUseLocation((v) => !v)}
            >
              {useLocation ? 'Tri proximite actif' : 'Afficher les plus proches'}
            </button>

            {hasFilters && (
              <button type="button" className="tp-reset-btn" onClick={resetFilters}>
                Reinitialiser filtres
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="tp-results">
        <div className="tp-container">
          <header className="tp-results-head">
            <h2>{loading ? 'Chargement...' : `Resultats (${pharmacies.length})`}</h2>
            {userLocation && <p>Liste triee par distance depuis votre position.</p>}
          </header>

          {loading ? (
            <div className="tp-empty">
              <div className="tp-loader"></div>
              <h3>Chargement des pharmacies...</h3>
            </div>
          ) : pharmacies.length === 0 ? (
            <div className="tp-empty">
              <h3>Aucune pharmacie trouvee</h3>
              <p>
                {hasFilters
                  ? 'Essayez d ajuster les filtres de recherche.'
                  : 'Les pharmacies seront affichees ici des qu elles seront disponibles.'}
              </p>
            </div>
          ) : (
            <div className="tp-grid">
              {pharmacies.map((pharmacie) => {
                const publicMessage = pharmacie.messages?.find((m) => m.visibleVisiteurs);
                const todaySchedule = getTodaySchedule(pharmacie.horaires);
                return (
                  <article key={pharmacie._id} className="tp-card">
                    <div className="tp-card-media">
                      <img
                        src={pharmacie.photo || ONPG_IMAGES.fallbackArticle}
                        alt={pharmacie.nom}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== ONPG_IMAGES.fallbackArticle) {
                            target.src = ONPG_IMAGES.fallbackArticle;
                          }
                        }}
                      />
                      <div className="tp-badge-row">
                        {pharmacie.garde && <span className="tp-badge garde">Garde</span>}
                        {pharmacie.distance && (
                          <span className="tp-badge distance">{formatDistance(pharmacie.distance)}</span>
                        )}
                      </div>
                    </div>

                    <div className="tp-card-body">
                      <h3>{pharmacie.nom}</h3>
                      <p className="tp-location">{pharmacie.ville}{pharmacie.quartier ? ` - ${pharmacie.quartier}` : ''}</p>
                      {pharmacie.adresse && <p className="tp-text">{pharmacie.adresse}</p>}

                      <div className="tp-contact-row">
                        {pharmacie.telephone && (
                          <a href={`tel:${pharmacie.telephone}`} className="tp-link">
                            {pharmacie.telephone}
                          </a>
                        )}
                        {pharmacie.email && (
                          <a href={`mailto:${pharmacie.email}`} className="tp-link secondary">
                            {pharmacie.email}
                          </a>
                        )}
                      </div>

                      {todaySchedule && (
                        <p className="tp-schedule">
                          <strong>Aujourd&apos;hui :</strong> {todaySchedule}
                        </p>
                      )}

                      {publicMessage && (
                        <div className="tp-alert">
                          <strong>{publicMessage.titre}</strong>
                          <p>{publicMessage.contenu}</p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TrouverPharmacie;
