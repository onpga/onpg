import { useEffect, useMemo, useState } from 'react';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './Pharmacies.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

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

type ViewMode = 'cards' | 'list' | 'map';

const PAGE_SIZE = 12;

const formatDistance = (meters?: number) => {
  if (meters === undefined || meters === null || Number.isNaN(meters)) return '';
  if (meters < 1000) return `${Math.round(meters)} m`;
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
};

const getCurrentDay = (): keyof NonNullable<Pharmacy['horaires']> => {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const;
  return days[new Date().getDay()];
};

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous');
  const [gardeOnly, setGardeOnly] = useState(false);
  const [ouvertOnly, setOuvertOnly] = useState(false);
  const [prochesOnly, setProchesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (prochesOnly && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setProchesOnly(false);
          setCurrentLocation(null);
        }
      );
    } else if (!prochesOnly) {
      setCurrentLocation(null);
    }
  }, [prochesOnly]);

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCity !== 'Toutes') params.append('ville', selectedCity);
        if (selectedQuartier !== 'Tous') params.append('quartier', selectedQuartier);
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (gardeOnly) params.append('garde', 'true');
        if (currentLocation) {
          params.append('latitude', String(currentLocation.lat));
          params.append('longitude', String(currentLocation.lng));
        }

        const response = await fetch(`${API_URL}/public/pharmacies?${params.toString()}`);
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.data)) {
          const mapped: Pharmacy[] = data.data.map((ph: any) => ({
            _id: String(ph._id || ''),
            nom: String(ph.nom || ''),
            adresse: String(ph.adresse || ''),
            ville: String(ph.ville || ''),
            quartier: String(ph.quartier || ''),
            telephone: String(ph.telephone || ''),
            email: ph.email || '',
            garde: Boolean(ph.garde),
            latitude: ph.latitude,
            longitude: ph.longitude,
            distance: ph.distance,
            photo: ph.photo || '',
            horaires: ph.horaires || {},
            ouvert: ph.ouvert !== false
          }));
          setPharmacies(mapped);
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
  }, [selectedCity, selectedQuartier, debouncedSearch, gardeOnly, currentLocation]);

  const filtered = useMemo(() => {
    let rows = [...pharmacies];
    if (ouvertOnly) rows = rows.filter((p) => p.ouvert !== false);
    if (prochesOnly) rows = rows.sort((a, b) => (a.distance || 9999) - (b.distance || 9999));
    return rows;
  }, [pharmacies, ouvertOnly, prochesOnly]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtered.length, viewMode, selectedCity, selectedQuartier, gardeOnly, ouvertOnly, prochesOnly, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const currentPharmacies = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const stats = useMemo(
    () => ({
      total: pharmacies.length,
      garde: pharmacies.filter((p) => p.garde).length,
      ouvertes: pharmacies.filter((p) => p.ouvert !== false).length
    }),
    [pharmacies]
  );

  const cities = useMemo(
    () => [...new Set(pharmacies.map((p) => p.ville).filter(Boolean))].sort(),
    [pharmacies]
  );

  const quartiers = useMemo(() => {
    const source =
      selectedCity === 'Toutes'
        ? pharmacies
        : pharmacies.filter((p) => p.ville === selectedCity);
    return [...new Set(source.map((p) => p.quartier).filter(Boolean))].sort();
  }, [pharmacies, selectedCity]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('Toutes');
    setSelectedQuartier('Tous');
    setGardeOnly(false);
    setOuvertOnly(false);
    setProchesOnly(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPharmacy(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const fullWeek = (horaires?: Pharmacy['horaires']) => [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' },
    { key: 'dimanche', label: 'Dimanche' }
  ].map((d) => ({
    label: d.label,
    value: horaires?.[d.key as keyof NonNullable<Pharmacy['horaires']>] || 'Non renseigne'
  }));

  const hasFilters =
    debouncedSearch.length > 0 ||
    selectedCity !== 'Toutes' ||
    selectedQuartier !== 'Tous' ||
    gardeOnly ||
    ouvertOnly ||
    prochesOnly;

  return (
    <div className="ph-page">
      <section className="ph-hero" aria-labelledby="ph-title">
        <div className="ph-container">
          <span className="ph-eyebrow">Pratique</span>
          <h1 id="ph-title" className="ph-title">Annuaire des pharmacies</h1>
          <p className="ph-lead">
            Trouvez rapidement une pharmacie par ville, quartier, statut de garde ou proximite.
          </p>

          <div className="ph-kpis">
            <article className="ph-kpi">
              <strong>{stats.total}</strong>
              <span>Pharmacies</span>
            </article>
            <article className="ph-kpi">
              <strong>{stats.garde}</strong>
              <span>De garde</span>
            </article>
            <article className="ph-kpi">
              <strong>{stats.ouvertes}</strong>
              <span>Ouvertes</span>
            </article>
          </div>
        </div>
      </section>

      <section className="ph-filters">
        <div className="ph-container">
          <div className="ph-filter-shell">
            <div className="ph-field search">
              <label htmlFor="ph-search">Recherche</label>
              <input
                id="ph-search"
                type="text"
                placeholder="Nom, adresse, quartier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="ph-field">
              <label htmlFor="ph-city">Ville</label>
              <select id="ph-city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="Toutes">Toutes les villes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="ph-field">
              <label htmlFor="ph-quartier">Quartier</label>
              <select id="ph-quartier" value={selectedQuartier} onChange={(e) => setSelectedQuartier(e.target.value)}>
                <option value="Tous">Tous les quartiers</option>
                {quartiers.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <label className="ph-check">
              <input type="checkbox" checked={gardeOnly} onChange={(e) => setGardeOnly(e.target.checked)} />
              <span>Garde uniquement</span>
            </label>

            <label className="ph-check">
              <input type="checkbox" checked={ouvertOnly} onChange={(e) => setOuvertOnly(e.target.checked)} />
              <span>Ouvertes maintenant</span>
            </label>

            <label className="ph-check">
              <input type="checkbox" checked={prochesOnly} onChange={(e) => setProchesOnly(e.target.checked)} />
              <span>Les plus proches</span>
            </label>

            <div className="ph-view-toggle" role="group" aria-label="Mode affichage">
              <button type="button" className={viewMode === 'cards' ? 'active' : ''} onClick={() => setViewMode('cards')}>
                Cartes
              </button>
              <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                Liste
              </button>
              <button type="button" className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>
                Carte
              </button>
            </div>

            {hasFilters && (
              <button type="button" className="ph-clear" onClick={clearFilters}>
                Effacer filtres
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="ph-results">
        <div className="ph-container">
          <header className="ph-results-head">
            <h2>
              {loading
                ? 'Chargement...'
                : `${filtered.length} pharmacie${filtered.length > 1 ? 's' : ''} trouvee${filtered.length > 1 ? 's' : ''}`}
            </h2>
            <span>Page {safePage} / {totalPages}</span>
          </header>

          {loading ? (
            <div className="ph-empty"><div className="ph-loader"></div><p>Chargement des pharmacies...</p></div>
          ) : filtered.length === 0 ? (
            <div className="ph-empty">
              <h3>Aucun resultat</h3>
              <p>Aucune pharmacie ne correspond aux criteres actuels.</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="ph-map-placeholder">
              <h3>Vue carte</h3>
              <p>La vue carte detaillee sera activee dans une prochaine iteration.</p>
              <div className="ph-map-list">
                {currentPharmacies.slice(0, 8).map((p) => (
                  <span key={p._id}>• {p.nom} ({p.ville})</span>
                ))}
              </div>
            </div>
          ) : (
            <div className={viewMode === 'cards' ? 'ph-grid cards' : 'ph-grid list'}>
              {currentPharmacies.map((pharmacy) => (
                <article
                  key={pharmacy._id}
                  className="ph-card"
                  onClick={() => setSelectedPharmacy(pharmacy)}
                >
                  <div className="ph-media">
                    <img
                      src={pharmacy.photo || ONPG_IMAGES.logo}
                      alt={pharmacy.nom}
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (t.src !== ONPG_IMAGES.logo) t.src = ONPG_IMAGES.logo;
                      }}
                    />
                    <div className="ph-badges">
                      {pharmacy.garde && <span className="ph-badge garde">Garde</span>}
                      {pharmacy.ouvert !== false
                        ? <span className="ph-badge open">Ouverte</span>
                        : <span className="ph-badge closed">Fermee</span>}
                      {pharmacy.distance !== undefined && pharmacy.distance !== null
                        ? <span className="ph-badge dist">{formatDistance(pharmacy.distance)}</span>
                        : null}
                    </div>
                  </div>

                  <div className="ph-body">
                    <h3>{pharmacy.nom}</h3>
                    <p className="ph-loc">{pharmacy.adresse}, {pharmacy.ville}{pharmacy.quartier ? ` - ${pharmacy.quartier}` : ''}</p>
                    <p className="ph-hours">
                      <strong>Aujourd&apos;hui :</strong> {pharmacy.horaires?.[getCurrentDay()] || 'Non renseigne'}
                    </p>

                    <div className="ph-actions">
                      <a
                        href={`tel:${pharmacy.telephone}`}
                        className="ph-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {pharmacy.telephone}
                      </a>
                      {pharmacy.email && (
                        <a
                          href={`mailto:${pharmacy.email}`}
                          className="ph-link secondary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {pharmacy.email}
                        </a>
                      )}
                      <a
                        href={
                          pharmacy.latitude && pharmacy.longitude
                            ? `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.adresse + ' ' + pharmacy.ville)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ph-link tertiary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Itineraire
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="ph-pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                Precedent
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedPharmacy && (
        <div className="ph-modal-overlay" onClick={() => setSelectedPharmacy(null)} role="presentation">
          <div
            className="ph-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Details ${selectedPharmacy.nom}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="ph-modal-close"
              onClick={() => setSelectedPharmacy(null)}
              aria-label="Fermer"
            >
              ×
            </button>

            <div className="ph-modal-head">
              <img
                src={selectedPharmacy.photo || ONPG_IMAGES.logo}
                alt={selectedPharmacy.nom}
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (t.src !== ONPG_IMAGES.logo) t.src = ONPG_IMAGES.logo;
                }}
              />
              <div>
                <h3>{selectedPharmacy.nom}</h3>
                <p>{selectedPharmacy.adresse}, {selectedPharmacy.ville}{selectedPharmacy.quartier ? ` - ${selectedPharmacy.quartier}` : ''}</p>
                <div className="ph-modal-badges">
                  {selectedPharmacy.garde && <span className="ph-badge garde">Garde</span>}
                  {selectedPharmacy.ouvert !== false
                    ? <span className="ph-badge open">Ouverte</span>
                    : <span className="ph-badge closed">Fermee</span>}
                  {selectedPharmacy.distance !== undefined && selectedPharmacy.distance !== null
                    ? <span className="ph-badge dist">{formatDistance(selectedPharmacy.distance)}</span>
                    : null}
                </div>
              </div>
            </div>

            <div className="ph-modal-grid">
              <section>
                <h4>Contact</h4>
                <div className="ph-modal-actions">
                  <a href={`tel:${selectedPharmacy.telephone}`} className="ph-link">{selectedPharmacy.telephone}</a>
                  {selectedPharmacy.email && <a href={`mailto:${selectedPharmacy.email}`} className="ph-link secondary">{selectedPharmacy.email}</a>}
                  <a
                    href={
                      selectedPharmacy.latitude && selectedPharmacy.longitude
                        ? `https://www.google.com/maps/dir/?api=1&destination=${selectedPharmacy.latitude},${selectedPharmacy.longitude}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPharmacy.adresse + ' ' + selectedPharmacy.ville)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ph-link tertiary"
                  >
                    Itineraire
                  </a>
                </div>
              </section>

              <section>
                <h4>Horaires</h4>
                <div className="ph-week-grid">
                  {fullWeek(selectedPharmacy.horaires).map((d) => (
                    <div key={d.label} className="ph-week-row">
                      <span>{d.label}</span>
                      <strong>{d.value}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacies;
