import { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './FormationContinue.css';

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M8 7h8" /><path d="M8 11h8" />
  </svg>
);
const IconGraduation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

interface Formation {
  _id?: string;
  title: string;
  description: string;
  duration: string;
  price?: number;
  showPrice: boolean;
  category: string;
  instructor?: string;
  date?: string;
  location?: string;
  isActive: boolean;
  featured?: boolean;
  content?: string;
}

const FormationContinue = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const loadFormations = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('formations');
        if (!data) {
          setFormations([]);
          return;
        }

        const rawArray = Array.isArray(data) ? data : [data];
        const mapped: Formation[] = rawArray
          .filter((item: any) => item.isActive !== false)
          .map((item: any) => ({
            _id: String(item._id || ''),
            title: item.title || '',
            description: item.description || '',
            duration: item.duration || '',
            price: item.price,
            showPrice: item.showPrice || false,
            category: item.category || '',
            instructor: item.instructor || '',
            date: item.date || '',
            location: item.location || '',
            isActive: item.isActive !== undefined ? item.isActive : true,
            featured: item.featured || false,
            content: item.content || ''
          }));

        setFormations(mapped);
      } catch (error) {
        console.error('Erreur chargement formations:', error);
        setFormations([]);
      } finally {
        setLoading(false);
      }
    };
    loadFormations();
  }, []);

  const activeFormations = formations.filter(f => f.isActive);
  const featuredFormations = activeFormations.filter(f => f.featured);
  const categories = Array.from(
    new Set(activeFormations.map(f => f.category).filter(Boolean))
  ).sort();

  const filteredByCategory =
    selectedCategory === 'Toutes'
      ? activeFormations
      : activeFormations.filter(f => f.category === selectedCategory);

  const displayedFormations = showOnlyFeatured
    ? filteredByCategory.filter(f => f.featured)
    : filteredByCategory;

  const truncate = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}…`;
  };

  return (
    <div className="formations-page pratique-page premium-page">
      {/* Hero Section - Premium */}
      <section className="pratique-hero fc-hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">Pratique professionnelle</span>
            <h1 className="hero-title">
              <span className="hero-title-main">Formation</span>
              <span className="hero-title-subtitle">Continue</span>
            </h1>
            <p className="hero-description">
              Développez vos compétences avec notre catalogue complet de formations
              continues obligatoires et spécialisées pour pharmaciens.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item"><IconBook /> Catalogue complet</span>
              <span className="highlight-item"><IconGraduation /> Formation obligatoire</span>
              <span className="highlight-item"><IconBriefcase /> Développement professionnel</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{activeFormations.length}</div>
              <div className="stat-label">Formations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{featuredFormations.length}</div>
              <div className="stat-label">À la une</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{new Set(activeFormations.map(f => f.category)).size}</div>
              <div className="stat-label">Catégories</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="section-content">
        <div className="section-container">
          {loading ? (
            <div className="formations-loading">
              <p>Chargement des formations...</p>
            </div>
          ) : activeFormations.length === 0 ? (
            <div className="formations-empty">
              <div className="empty-icon"><IconBook /></div>
              <h2>Aucune formation disponible</h2>
              <p>Le catalogue de formations sera bientôt disponible. Revenez prochainement pour découvrir nos programmes de formation continue.</p>
            </div>
          ) : (
            <>
              <div className="formations-toolbar">
                <div className="formations-toolbar-left">
                  <h2>Catalogue des formations</h2>
                  <p>
                    Filtrez par catégorie et mettez en avant les formations à la une pour
                    construire facilement votre parcours de développement professionnel.
                  </p>
                </div>
                <div className="formations-toolbar-right">
                  {categories.length > 1 && (
                    <div className="formations-filter">
                      <label htmlFor="categoryFilter">Catégorie</label>
                      <select
                        id="categoryFilter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="Toutes">Toutes les catégories</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    type="button"
                    className={`featured-toggle ${showOnlyFeatured ? 'active' : ''}`}
                    onClick={() => setShowOnlyFeatured((prev) => !prev)}
                  >
                    {showOnlyFeatured ? 'Afficher toutes les formations' : 'Voir uniquement les formations à la une'}
                  </button>
                </div>
              </div>

              {displayedFormations.length === 0 ? (
                <div className="formations-empty-filters">
                  <h3>Aucune formation ne correspond à vos filtres</h3>
                  <p>
                    Essayez de changer de catégorie ou de désactiver le filtre &laquo; À la une &raquo;
                    pour voir davantage de résultats.
              </p>
            </div>
          ) : (
            <div className="formations-grid">
              {displayedFormations.map((formation) => (
                <div
                  key={formation._id}
                  className={`formation-card ${formation.featured ? 'featured' : ''}`}
                >
                  <div className="formation-card-accent" />
                  {formation.featured && (
                    <div className="formation-badge"><IconStar /> À la une</div>
                  )}
                  <div className="formation-card-body">
                    {formation.category && (
                      <span className="formation-category-chip">{formation.category}</span>
                    )}
                    <h3 className="formation-title">{formation.title}</h3>
                    <p className="formation-description">
                      {truncate(formation.description || formation.content || '', 180)}
                    </p>
                    <div className="formation-info-grid">
                      {formation.duration && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Durée</span>
                          <span className="formation-info-value"><IconClock /> {formation.duration}</span>
                        </div>
                      )}
                      {formation.instructor && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Formateur</span>
                          <span className="formation-info-value"><IconUser /> {formation.instructor}</span>
                        </div>
                      )}
                      {formation.date && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Date</span>
                          <span className="formation-info-value">
                            <IconCalendar /> {new Date(formation.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {formation.location && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Lieu</span>
                          <span className="formation-info-value"><IconMapPin /> {formation.location}</span>
                        </div>
                      )}
                    </div>
                    {formation.showPrice && formation.price && (
                      <div className="formation-price">
                        {formation.price.toLocaleString()} FCFA
                      </div>
                    )}
                  </div>
                  <div className="formation-card-footer">
                    <button
                      type="button"
                      className="formation-detail-link"
                      onClick={() => { setSelectedFormation(formation); setIsDetailOpen(true); }}
                    >
                      Voir le programme complet
                    </button>
                  </div>
                </div>
              ))}
            </div>
              )}
            </>
          )}
        </div>
      </section>

      {isDetailOpen && selectedFormation && (
        <div
          className="formation-modal-overlay"
          onClick={() => {
            setIsDetailOpen(false);
            setSelectedFormation(null);
          }}
        >
          <div
            className="formation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="formation-modal-close"
              onClick={() => {
                setIsDetailOpen(false);
                setSelectedFormation(null);
              }}
            >
              ✕
            </button>

            <div className="formation-detail-header">
              {selectedFormation.category && (
                <span className="formation-detail-chip">
                  {selectedFormation.category}
                </span>
              )}
              {selectedFormation.featured && (
                <span className="formation-detail-chip featured">
                  <IconStar /> À la une
                </span>
              )}
            </div>

            <h2 className="formation-modal-title">{selectedFormation.title}</h2>

            <div className="formation-detail-main">
              <div className="formation-detail-meta">
                {selectedFormation.duration && (
                  <div className="formation-detail-meta-item">
                    <span className="label">Durée</span>
                    <span className="value">{selectedFormation.duration}</span>
                  </div>
                )}
                {selectedFormation.date && (
                  <div className="formation-detail-meta-item">
                    <span className="label">Date</span>
                    <span className="value">
                      {new Date(selectedFormation.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {selectedFormation.location && (
                  <div className="formation-detail-meta-item">
                    <span className="label">Lieu</span>
                    <span className="value">{selectedFormation.location}</span>
                  </div>
                )}
                {selectedFormation.instructor && (
                  <div className="formation-detail-meta-item">
                    <span className="label">Formateur</span>
                    <span className="value">{selectedFormation.instructor}</span>
                  </div>
                )}
                {selectedFormation.showPrice && selectedFormation.price && (
                  <div className="formation-detail-meta-item highlight">
                    <span className="label">Tarif</span>
                    <span className="value">
                      {selectedFormation.price.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
              </div>

              <div className="formation-detail-body">
                <p className="formation-detail-text">
                  {(selectedFormation.content || selectedFormation.description || '').trim()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationContinue;
