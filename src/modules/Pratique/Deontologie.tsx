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
            <div className="deontologie-empty">
              <p>Aucun document de déontologie disponible pour le moment.</p>
            </div>
          ) : (
            <div className="deontologie-card">
              <h2 className="deontologie-title">
                {deontologie.title}
              </h2>
              {deontologie.description && (
                <p className="deontologie-description">
                  {deontologie.description}
                </p>
              )}
              {deontologie.lastUpdated && (
                <p className="deontologie-updated">
                  Dernière mise à jour : {new Date(deontologie.lastUpdated).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              <div className="deontologie-pdf-container">
                <iframe
                  src={deontologie.pdfUrl}
                  width="100%"
                  height="800px"
                  className="deontologie-iframe"
                  title={deontologie.title}
                />
                <div className="deontologie-actions">
                  <a
                    href={deontologie.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deontologie-download-btn"
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

