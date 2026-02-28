import { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './FormationContinue.css';

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
    <div className="formations-page pratique-page">
      {/* Hero Section - Style similaire à Déontologie */}
      <section className="pratique-hero" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Formation</span>
              <span className="hero-title-subtitle">Continue</span>
            </h1>
            <p className="hero-description">
              Développez vos compétences avec notre catalogue complet de formations
              continues obligatoires et spécialisées pour pharmaciens.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">📚 Catalogue complet</span>
              <span className="highlight-item">🎓 Formation obligatoire</span>
              <span className="highlight-item">💼 Développement professionnel</span>
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
              <div className="empty-icon">📚</div>
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
                    <div className="formation-badge">⭐ À la une</div>
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
                          <span className="formation-info-value">⏱️ {formation.duration}</span>
                        </div>
                      )}
                      {formation.instructor && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Formateur</span>
                          <span className="formation-info-value">👤 {formation.instructor}</span>
                        </div>
                      )}
                      {formation.date && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Date</span>
                          <span className="formation-info-value">
                            📅 {new Date(formation.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {formation.location && (
                        <div className="formation-info-item">
                          <span className="formation-info-label">Lieu</span>
                          <span className="formation-info-value">📍 {formation.location}</span>
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
                  ⭐ À la une
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
