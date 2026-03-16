import { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './Deontologie.css';

const IconScale = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
  </svg>
);

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

  // Fonction pour corriger les URLs Cloudinary incorrectes (image/upload -> raw/upload pour PDFs)
  const fixPdfUrl = (url: string): string => {
    if (!url) return url;
    // Si l'URL contient /image/upload/ et se termine par .pdf, corriger
    if (url.includes('/image/upload/') && url.toLowerCase().endsWith('.pdf')) {
      return url.replace('/image/upload/', '/raw/upload/');
    }
    return url;
  };

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
          const pdfUrl = fixPdfUrl(active.pdfUrl || '');
          setDeontologie({
            _id: String(active._id || ''),
            title: active.title || 'Code de déontologie',
            pdfUrl: pdfUrl,
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
    <div className="pratique-page premium-page deontologie-page">
      <section className="pratique-hero deo-hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-eyebrow">Pratique professionnelle</span>
            <h1 className="hero-title">
              <span className="hero-title-main">Déontologie</span>
              <span className="hero-title-subtitle">Pharmaceutique</span>
            </h1>
            <p className="hero-description">
              Découvrez le code de déontologie des pharmaciens gabonais,
              les principes éthiques et les jurisprudences.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item"><IconScale /> Code déontologique</span>
              <span className="highlight-item"><IconShield /> Éthique professionnelle</span>
              <span className="highlight-item"><IconFile /> Jurisprudence</span>
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
            <div className="deontologie-loading">Chargement...</div>
          ) : !deontologie || !deontologie.pdfUrl ? (
            <div className="deontologie-empty">
              <p>Aucun document de déontologie disponible pour le moment.</p>
            </div>
          ) : (
            <div className="deontologie-card">
              <div className="deontologie-header">
                <div className="deontologie-header-content">
                  <h2 className="deontologie-title">
                    {deontologie.title}
                  </h2>
                  {deontologie.lastUpdated && (
                    <div className="deontologie-meta">
                      <span className="deontologie-meta-item">
                        📅 Dernière mise à jour : {new Date(deontologie.lastUpdated).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
                <div className="deontologie-header-actions">
                  <a
                    href={deontologie.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deontologie-download-btn-header"
                    download
                  >
                    <span className="btn-icon">⬇️</span>
                    <span className="btn-text">Télécharger</span>
                  </a>
                  <a
                    href={deontologie.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="deontologie-view-btn-header"
                  >
                    <span className="btn-icon">👁️</span>
                    <span className="btn-text">Ouvrir dans un nouvel onglet</span>
                  </a>
                </div>
              </div>

              {deontologie.description && (
                <div className="deontologie-description-box">
                  <p className="deontologie-description">
                    {deontologie.description}
                  </p>
                </div>
              )}

              <div className="deontologie-pdf-container">
                <div className="deontologie-pdf-wrapper">
                  <iframe
                    src={`${deontologie.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    width="100%"
                    height="900px"
                    className="deontologie-iframe"
                    title={deontologie.title}
                    style={{ border: 'none' }}
                  />
                </div>
                <div className="deontologie-pdf-overlay">
                  <div className="deontologie-pdf-info">
                    <span className="pdf-icon">📄</span>
                    <span className="pdf-text">Document PDF</span>
                  </div>
                </div>
              </div>

              <div className="deontologie-actions-footer">
                <a
                  href={deontologie.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deontologie-download-btn-footer"
                  download
                >
                  <span className="btn-icon">⬇️</span>
                  <span className="btn-text">Télécharger le PDF</span>
                </a>
                <a
                  href={deontologie.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deontologie-view-btn-footer"
                >
                  <span className="btn-icon">🔗</span>
                  <span className="btn-text">Ouvrir dans un nouvel onglet</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Deontologie;

