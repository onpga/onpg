import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import './Ressources.css';

interface LocationState {
  pdfUrl?: string;
  title?: string;
  author?: string;
  year?: number;
}

const ThesePdfViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const state = (location.state || {}) as LocationState;
  const [fallbackTitle, setFallbackTitle] = useState<string>('');
  const [fallbackAuthor, setFallbackAuthor] = useState<string>('');
  const [fallbackYear, setFallbackYear] = useState<number | undefined>(undefined);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
      ? 'https://backendonpg-production.up.railway.app/api'
      : 'http://localhost:3001/api');

  useEffect(() => {
    const loadThesis = async () => {
      if (!id) return;
      try {
        const data = await fetchResourceById('theses', id);
        if (data) {
          setFallbackTitle(String(data.title || 'Thèse'));
          setFallbackAuthor(String(data.author || ''));
          setFallbackYear(data.year ? Number(data.year) : undefined);
        }
      } catch {
        // no-op: fallback values remain empty
      }
    };
    loadThesis();
  }, [id]);

  const pdfUrl = state.pdfUrl || (id ? `${API_URL}/public/theses/${id}/pdf` : '');
  const title = state.title || fallbackTitle || 'Thèse';
  const author = state.author || fallbackAuthor;
  const year = state.year || fallbackYear;

  if (!pdfUrl) {
    return (
      <div className="article-detail-page">
        <div className="error-state">
          <h1>PDF non disponible</h1>
          <p>
            Impossible d'afficher le document. Veuillez revenir à la liste des thèses
            et réessayer.
          </p>
          <button
            className="back-link"
            onClick={() => navigate(-1)}
          >
            ← Retour
          </button>
          <p style={{ marginTop: '1rem' }}>
            Ou revenir à la page des thèses :{' '}
            <Link to="/ressources/theses" className="back-link">
              Thèses
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page" style={{ paddingBottom: 0 }}>
      <header className="article-header">
        <div className="article-header-content">
          <nav className="article-breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="separator">›</span>
            <Link to="/ressources/theses">Thèses</Link>
            <span className="separator">›</span>
            <span className="current">Consultation</span>
          </nav>

          <h1 className="article-title">
            {title}
            {year && ` (${year})`}
          </h1>
          {author && (
            <div className="article-meta">
              <span className="meta-item">👤 {author}</span>
              {id && <span className="meta-item">ID: {id}</span>}
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <button
              className="back-link"
              onClick={() => navigate(-1)}
            >
              ← Retour aux résultats
            </button>
          </div>
        </div>
      </header>

      <div className="article-content-wrapper" style={{ paddingTop: 0 }}>
        <div
          className="article-content-container"
          style={{ maxWidth: '100%', paddingLeft: 0, paddingRight: 0 }}
        >
          <main className="article-main">
            <div
              style={{
                height: 'calc(100vh - 200px)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                marginTop: '0.5rem'
              }}
            >
              <iframe
                src={pdfUrl}
                title={title}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ThesePdfViewer;


