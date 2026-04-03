import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import './Ressources.css';

interface LocationState {
  pdfUrl?: string;
  title?: string;
  author?: string;
  year?: number;
  university?: string;
  director?: string;
  abstract?: string;
  keywords?: string[];
}

const ThesePdfViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const state = (location.state || {}) as LocationState;
  const [fallbackTitle, setFallbackTitle] = useState<string>('');
  const [fallbackAuthor, setFallbackAuthor] = useState<string>('');
  const [fallbackYear, setFallbackYear] = useState<number | string | undefined>(undefined);
  const [fallbackUniversity, setFallbackUniversity] = useState<string>('');
  const [fallbackDirector, setFallbackDirector] = useState<string>('');
  const [fallbackAbstract, setFallbackAbstract] = useState<string>('');
  const [fallbackKeywords, setFallbackKeywords] = useState<string[]>([]);

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
          const y = data.year;
          setFallbackYear(
            y !== undefined && y !== null && String(y).trim() !== ''
              ? Number.isNaN(Number(y))
                ? y
                : Number(y)
              : undefined
          );
          setFallbackUniversity(String(data.university || ''));
          setFallbackDirector(String(data.director || ''));
          setFallbackAbstract(String(data.abstract || ''));
          const kw = data.keywords ?? (data as { motsCles?: unknown }).motsCles;
          if (Array.isArray(kw)) {
            setFallbackKeywords(kw.map(String).map((k) => k.trim()).filter(Boolean));
          } else if (typeof kw === 'string' && kw.trim()) {
            setFallbackKeywords(kw.split(',').map((k) => k.trim()).filter(Boolean));
          } else {
            setFallbackKeywords([]);
          }
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
  const year = state.year ?? fallbackYear;
  const university = state.university || fallbackUniversity;
  const director = state.director || fallbackDirector;
  const abstract = state.abstract || fallbackAbstract;
  const keywords = (state.keywords && state.keywords.length > 0 ? state.keywords : fallbackKeywords) || [];
  const hasMeta =
    !!author ||
    year !== undefined ||
    !!university ||
    !!director ||
    !!abstract ||
    keywords.length > 0;

  const downloadHref = id ? `${API_URL}/public/theses/${id}/pdf?download=1` : '';

  if (!pdfUrl) {
    return (
      <div className="article-detail-page these-pdf-page">
        <div className="error-state">
          <h1>PDF non disponible</h1>
          <p>
            Impossible d'afficher le document. Veuillez revenir à la liste des thèses
            et réessayer.
          </p>
          <button type="button" className="thesis-pdf-btn thesis-pdf-btn--primary" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <p style={{ marginTop: '1rem' }}>
            Ou revenir à la page des thèses :{' '}
            <Link to="/ressources/theses" className="thesis-pdf-btn thesis-pdf-btn--secondary">
              Liste des thèses
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page these-pdf-page" style={{ paddingBottom: 0 }}>
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
            {year !== undefined && year !== null && String(year).trim() !== '' && ` (${year})`}
          </h1>

          {hasMeta && (
            <div className="these-pdf-meta">
              {author && (
                <p className="these-pdf-meta-row">
                  <span className="these-pdf-meta-label">Auteur</span>
                  <span className="these-pdf-meta-value">{author}</span>
                </p>
              )}
              {university && (
                <p className="these-pdf-meta-row">
                  <span className="these-pdf-meta-label">Université</span>
                  <span className="these-pdf-meta-value">{university}</span>
                </p>
              )}
              {director && (
                <p className="these-pdf-meta-row">
                  <span className="these-pdf-meta-label">Directeur de thèse</span>
                  <span className="these-pdf-meta-value">{director}</span>
                </p>
              )}
              {keywords.length > 0 && (
                <p className="these-pdf-meta-row">
                  <span className="these-pdf-meta-label">Mots-clés</span>
                  <span className="these-pdf-meta-value these-pdf-keywords">
                    {keywords.map((k, i) => (
                      <span key={`${k}-${i}`} className="these-pdf-keyword">
                        {k}
                      </span>
                    ))}
                  </span>
                </p>
              )}
              {abstract && (
                <div className="these-pdf-meta-row these-pdf-meta-row--block">
                  <span className="these-pdf-meta-label">Résumé</span>
                  <p className="these-pdf-abstract">{abstract}</p>
                </div>
              )}
            </div>
          )}

          <div className="these-pdf-header-nav">
            <button type="button" className="thesis-pdf-btn thesis-pdf-btn--ghost" onClick={() => navigate(-1)}>
              ← Retour
            </button>
          </div>
        </div>
      </header>

      <div className="article-content-wrapper these-pdf-content" style={{ paddingTop: 0 }}>
        <div className="article-content-container these-pdf-content-inner">
          <main className="article-main these-pdf-main">
            <div className="these-pdf-toolbar">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="thesis-pdf-btn thesis-pdf-btn--primary"
              >
                <span className="thesis-pdf-btn-ico" aria-hidden>
                  ↗
                </span>
                Ouvrir dans un nouvel onglet
              </a>
              {downloadHref && (
                <a href={downloadHref} className="thesis-pdf-btn thesis-pdf-btn--secondary">
                  <span className="thesis-pdf-btn-ico" aria-hidden>
                    ⬇
                  </span>
                  Télécharger le PDF
                </a>
              )}
            </div>
            <div className="these-pdf-frame">
              <iframe src={pdfUrl} title={title} className="these-pdf-iframe" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ThesePdfViewer;


