import { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './Deontologie.css';

interface Deontologie {
  _id?: string;
  title: string;
  pdfUrl: string;
  description?: string;
  lastUpdated?: string;
  isActive: boolean;
}

const Deontologie = () => {
  const [deontologie, setDeontologie] = useState<Deontologie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeontologie = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('deontologie');
        if (!data) {
          setDeontologie(null);
          return;
        }

        const rawArray = Array.isArray(data) ? data : [data];
        const active = rawArray.find((item: any) => item.isActive !== false);
        
        if (active) {
          setDeontologie({
            _id: String(active._id || ''),
            title: active.title || 'Code de déontologie',
            pdfUrl: active.pdfUrl || '',
            description: active.description || '',
            lastUpdated: active.lastUpdated || '',
            isActive: active.isActive !== undefined ? active.isActive : true
          });
        } else {
          setDeontologie(null);
        }
      } catch (error) {
        console.error('Erreur chargement déontologie:', error);
        setDeontologie(null);
      } finally {
        setLoading(false);
      }
    };
    loadDeontologie();
  }, []);

  return (
    <div className="pratique-page">
      <section className="pratique-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Déontologie</span>
              <span className="hero-title-subtitle">Pharmaceutique</span>
            </h1>
            <p className="hero-description">
              Découvrez le code de déontologie des pharmaciens gabonais,
              les principes éthiques et les jurisprudences.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">⚖️ Code déontologique</span>
              <span className="highlight-item">🛡️ Éthique professionnelle</span>
              <span className="highlight-item">📋 Jurisprudence</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">
                {deontologie?.lastUpdated ? new Date(deontologie.lastUpdated).getFullYear() : '2024'}
              </div>
              <div className="stat-label">Dernière mise à jour</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{deontologie ? '1' : '0'}</div>
              <div className="stat-label">Document</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Respect</div>
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
            <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>
          ) : !deontologie || !deontologie.pdfUrl ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>Aucun document de déontologie disponible pour le moment.</p>
            </div>
          ) : (
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#00A651' }}>
                {deontologie.title}
              </h2>
              {deontologie.description && (
                <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  {deontologie.description}
                </p>
              )}
              {deontologie.lastUpdated && (
                <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '1.5rem' }}>
                  Dernière mise à jour : {new Date(deontologie.lastUpdated).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              <div style={{
                border: '2px solid #00A651',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#f8f9fa'
              }}>
                <iframe
                  src={deontologie.pdfUrl}
                  width="100%"
                  height="800px"
                  style={{ border: 'none', borderRadius: '8px' }}
                  title={deontologie.title}
                />
                <div style={{ marginTop: '1.5rem' }}>
                  <a
                    href={deontologie.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 2rem',
                      backgroundColor: '#00A651',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006637'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00A651'}
                  >
                    📄 Télécharger le PDF
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Deontologie;

