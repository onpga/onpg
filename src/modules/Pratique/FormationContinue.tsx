import { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './FormationContinue.css';
import './Pratique.css';

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

  return (
    <div className="pratique-page">
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
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
              Chargement des formations...
            </div>
          ) : activeFormations.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00A651' }}>
                Aucune formation disponible
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Le catalogue de formations sera bientôt disponible.
                Revenez prochainement pour découvrir nos programmes de formation continue.
              </p>
            </div>
          ) : (
            <div className="formations-grid">
              {activeFormations.map((formation) => (
                <div
                  key={formation._id}
                  className={`formation-card ${formation.featured ? 'featured' : ''}`}
                >
                  {formation.featured && (
                    <div className="formation-badge">
                      ⭐ À la une
                    </div>
                  )}
                  <h3 className="formation-title">
                    {formation.title}
                  </h3>
                  <p className="formation-description">
                    {formation.description}
                  </p>
                  <div className="formation-meta">
                    <span className="formation-meta-item">
                      ⏱️ {formation.duration}
                    </span>
                    {formation.category && (
                      <span className="formation-category">
                        {formation.category}
                      </span>
                    )}
                  </div>
                  {formation.showPrice && formation.price && (
                    <div className="formation-price">
                      {formation.price.toLocaleString()} FCFA
                    </div>
                  )}
                  <div className="formation-meta">
                    {formation.instructor && (
                      <p className="formation-meta-item">
                        <strong>Formateur :</strong> {formation.instructor}
                      </p>
                    )}
                    {formation.date && (
                      <p className="formation-meta-item">
                        <strong>Date :</strong> {new Date(formation.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    {formation.location && (
                      <p className="formation-meta-item">
                        <strong>Lieu :</strong> {formation.location}
                      </p>
                    )}
                  </div>
                  {formation.content && (
                    <div className="formation-content">
                      {formation.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FormationContinue;
