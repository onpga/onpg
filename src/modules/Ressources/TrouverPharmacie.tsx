import React, { useState, useEffect, useMemo } from 'react';
import './TrouverPharmacie.css';

// Interface pour une pharmacie
interface Pharmacie {
  id: string;
  nom: string;
  ville: string;
  quartier: string;
  adresse: string;
  telephone: string;
  garde: boolean;
  horaires: string;
  image: string;
  latitude: number;
  longitude: number;
}

// Données mockées pour les pharmacies du Gabon
const mockPharmacies: Pharmacie[] = [
  {
    id: '1',
    nom: 'Pharmacie Centrale de Libreville',
    ville: 'Libreville',
    quartier: 'Centre-ville',
    adresse: 'Boulevard du Bord de Mer, BP 1234',
    telephone: '+241 01 44 55 66',
    garde: true,
    horaires: '24h/24',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    latitude: 0.4162,
    longitude: 9.4673
  },
  {
    id: '2',
    nom: 'Pharmacie du Bien-être',
    ville: 'Libreville',
    quartier: 'Plateau',
    adresse: 'Avenue du Général de Gaulle, Immeuble ABC',
    telephone: '+241 01 77 88 99',
    garde: false,
    horaires: '8h-20h',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    latitude: 0.3901,
    longitude: 9.4544
  },
  {
    id: '3',
    nom: 'Pharmacie Moderne Port-Gentil',
    ville: 'Port-Gentil',
    quartier: 'Centre',
    adresse: 'Rue de la République, Quartier des Affaires',
    telephone: '+241 05 22 33 44',
    garde: true,
    horaires: '24h/24',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031e2bb?w=400&h=300&fit=crop',
    latitude: -0.7193,
    longitude: 8.7815
  },
  {
    id: '4',
    nom: 'Pharmacie Familiale Franceville',
    ville: 'Franceville',
    quartier: 'Centre-ville',
    adresse: 'Boulevard de la Paix, BP 567',
    telephone: '+241 04 11 22 33',
    garde: false,
    horaires: '7h-22h',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    latitude: -1.6333,
    longitude: 13.5833
  },
  {
    id: '5',
    nom: 'Pharmacie Express Owendo',
    ville: 'Owendo',
    quartier: 'Zone Industrielle',
    adresse: 'Route de l\'Aéroport, Zone Franche',
    telephone: '+241 06 55 66 77',
    garde: true,
    horaires: '24h/24',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    latitude: 0.2833,
    longitude: 9.5000
  },
  {
    id: '6',
    nom: 'Pharmacie du Soleil Libreville',
    ville: 'Libreville',
    quartier: 'Nkembo',
    adresse: 'Avenue Félix Eboué, Quartier Nkembo',
    telephone: '+241 01 99 00 11',
    garde: false,
    horaires: '8h-19h',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    latitude: 0.4162,
    longitude: 9.4673
  },
  {
    id: '7',
    nom: 'Pharmacie 24h Lambaréné',
    ville: 'Lambaréné',
    quartier: 'Centre',
    adresse: 'Rue Albert Schweitzer, BP 890',
    telephone: '+241 02 33 44 55',
    garde: true,
    horaires: '24h/24',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    latitude: -0.6833,
    longitude: 10.2167
  },
  {
    id: '8',
    nom: 'Pharmacie Nouvelle Oyem',
    ville: 'Oyem',
    quartier: 'Centre-ville',
    adresse: 'Boulevard de l\'Indépendance',
    telephone: '+241 07 66 77 88',
    garde: false,
    horaires: '9h-18h',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031e2bb?w=400&h=300&fit=crop',
    latitude: 1.6167,
    longitude: 11.5833
  }
];

// Villes et quartiers disponibles
const villes = ['Toutes les villes', 'Libreville', 'Port-Gentil', 'Franceville', 'Owendo', 'Lambaréné', 'Oyem'];
const quartiers = ['Tous les quartiers', 'Centre-ville', 'Centre', 'Plateau', 'Nkembo', 'Zone Industrielle'];

const TrouverPharmacie: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVille, setSelectedVille] = useState('Toutes les villes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous les quartiers');
  const [gardeOnly, setGardeOnly] = useState(false);

  // Filtrage des pharmacies
  const filteredPharmacies = useMemo(() => {
    return mockPharmacies.filter(pharmacie => {
      const matchesSearch = pharmacie.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pharmacie.adresse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVille = selectedVille === 'Toutes les villes' || pharmacie.ville === selectedVille;
      const matchesQuartier = selectedQuartier === 'Tous les quartiers' || pharmacie.quartier === selectedQuartier;
      const matchesGarde = !gardeOnly || pharmacie.garde;

      return matchesSearch && matchesVille && matchesQuartier && matchesGarde;
    });
  }, [searchQuery, selectedVille, selectedQuartier, gardeOnly]);

  // Fonction pour obtenir les quartiers disponibles selon la ville sélectionnée
  const availableQuartiers = useMemo(() => {
    if (selectedVille === 'Toutes les villes') {
      return quartiers;
    }
    const cityPharmacies = mockPharmacies.filter(p => p.ville === selectedVille);
    const cityQuartiers = [...new Set(cityPharmacies.map(p => p.quartier))];
    return ['Tous les quartiers', ...cityQuartiers];
  }, [selectedVille]);

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
            <div className="search-input-group">
              <label htmlFor="search-input" className="sr-only">Rechercher une pharmacie</label>
              <input
                id="search-input"
                type="text"
                placeholder="Nom de la pharmacie ou adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
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
                  setSelectedQuartier('Tous les quartiers'); // Reset quartier quand ville change
                }}
                className="filter-select"
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
              >
                {availableQuartiers.map(quartier => (
                  <option key={quartier} value={quartier}>{quartier}</option>
                ))}
              </select>
            </div>

            {/* Checkbox Pharmacies de garde */}
            <div className="filter-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={gardeOnly}
                  onChange={(e) => setGardeOnly(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Pharmacies de garde</span>
              </label>
            </div>

            {/* Bouton Rechercher */}
            <button
              type="button"
              className="search-button"
              onClick={() => {
                // Le filtrage se fait automatiquement via useMemo
                console.log('Recherche effectuée avec', filteredPharmacies.length, 'résultats');
              }}
            >
              <span className="button-text">Rechercher</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="results-section">
        <div className="results-container">
          <div className="results-header">
            <h2>Résultats ({filteredPharmacies.length})</h2>
            {filteredPharmacies.length === 0 && (
              <p className="no-results">Aucune pharmacie trouvée pour ces critères.</p>
            )}
          </div>

          <div className="pharmacies-grid">
            {filteredPharmacies.map(pharmacie => (
              <div key={pharmacie.id} className="pharmacie-card">
                <div className="card-image">
                  <img
                    src={pharmacie.image}
                    alt={`Pharmacie ${pharmacie.nom}`}
                    loading="lazy"
                  />
                  {pharmacie.garde && (
                    <div className="garde-badge">
                      <span className="garde-text">GARDE</span>
                    </div>
                  )}
                </div>

                <div className="card-content">
                  <h3 className="pharmacie-nom">{pharmacie.nom}</h3>
                  <div className="pharmacie-location">
                    <span className="location-text">{pharmacie.ville} - {pharmacie.quartier}</span>
                  </div>
                  <div className="pharmacie-adresse">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="adresse-text">{pharmacie.adresse}</span>
                  </div>
                  <div className="pharmacie-contact">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C15.72 20.22 10.92 16.52 7.92 12.32C4.92 8.12 3.92 3.32 4.72 1.32C5.02 0.72 5.52 0.32 6.12 0.32H9.12C9.52 0.32 9.82 0.62 9.82 1.02C9.82 1.32 9.72 1.62 9.52 1.82L8.12 3.22C7.92 3.42 7.82 3.72 7.92 4.02C8.12 7.02 9.72 9.92 12.02 12.22C14.32 14.52 17.22 16.12 20.22 16.32C20.52 16.32 20.82 16.22 21.02 16.02L22.42 14.62C22.62 14.42 22.92 14.32 23.22 14.32C23.62 14.32 23.92 14.62 23.92 15.02V18.02C23.92 18.52 23.42 18.92 22.92 18.92H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <a href={`tel:${pharmacie.telephone}`} className="telephone-link">
                      {pharmacie.telephone}
                    </a>
                  </div>
                  <div className="pharmacie-horaires">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="horaires-text">{pharmacie.horaires}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrouverPharmacie;
