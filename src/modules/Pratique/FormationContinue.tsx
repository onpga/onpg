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
      <section className="pratique-hero">
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

      <section className="section-content">
        <div className="section-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des formations...</div>
          ) : activeFormations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>Aucune formation disponible pour le moment.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem',
              padding: '2rem 0'
            }}>
              {activeFormations.map((formation) => (
                <div
                  key={formation._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    border: formation.featured ? '3px solid #00A651' : '1px solid #eee'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {formation.featured && (
                    <div style={{
                      backgroundColor: '#00A651',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginBottom: '1rem'
                    }}>
                      ⭐ À la une
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#00A651' }}>
                    {formation.title}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {formation.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#999' }}>
                      ⏱️ {formation.duration}
                    </span>
                    {formation.category && (
                      <span style={{
                        fontSize: '0.9rem',
                        backgroundColor: '#f0f0f0',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px'
                      }}>
                        {formation.category}
                      </span>
                    )}
                  </div>
                  {formation.showPrice && formation.price && (
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#00A651',
                      marginBottom: '1rem'
                    }}>
                      {formation.price.toLocaleString()} FCFA
                    </div>
                  )}
                  {formation.instructor && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Formateur :</strong> {formation.instructor}
                    </p>
                  )}
                  {formation.date && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      <strong>Date :</strong> {new Date(formation.date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  {formation.location && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      <strong>Lieu :</strong> {formation.location}
                    </p>
                  )}
                  {formation.content && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#555'
                    }}>
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

