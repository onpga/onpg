import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Theses.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface Thesis {
  id: string;
  title: string;
  author: string;
  director: string;
  university: string;
  faculty: string;
  department: string;
  degree: 'master' | 'phd' | 'doctorate';
  year: number;
  abstract: string;
  keywords: string[];
  pages: number;
  language: string;
  specialty: string;
  defenseDate: string;
  juryMembers: string[];
  downloads: number;
  citations: number;
  featured: boolean;
  pdfUrl?: string;
}

const buildDownloadFileName = (thesis: Thesis) => {
  const sanitize = (value: string) =>
    value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  return ['these', sanitize(thesis.title), sanitize(thesis.author), String(thesis.year)].join('_') + '.pdf';
};

const Theses = () => {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [filteredTheses, setFilteredTheses] = useState<Thesis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const thesesPerPage = 6;

  useEffect(() => {
    const loadTheses = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('theses');
        if (!data) { setTheses([]); setFilteredTheses([]); return; }
        const rawArray = Array.isArray(data) ? data : [data];
        const mapped: Thesis[] = rawArray.map((item: any) => ({
          id: String(item._id || ''),
          title: item.title || '',
          author: item.author || '',
          director: item.director || '',
          university: item.university || '',
          faculty: item.faculty || '',
          department: item.department || '',
          degree: (item.degree as 'master' | 'phd' | 'doctorate') || 'phd',
          year: item.year || new Date().getFullYear(),
          abstract: item.abstract || item.excerpt || '',
          keywords: item.keywords || [],
          pages: item.pages || 0,
          language: item.language || 'fr',
          specialty: item.specialty || 'Pharmacie',
          defenseDate: item.defenseDate || '',
          juryMembers: item.juryMembers || [],
          downloads: item.downloads || 0,
          citations: item.citations || 0,
          featured: item.featured || false,
          pdfUrl: item._id ? `${API_URL}/public/theses/${item._id}/pdf` : (item.pdfUrl || item.fichierUrl || '')
        }));
        setTheses(mapped);
        setFilteredTheses(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadTheses();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = theses.filter(t =>
      !q || t.title.toLowerCase().includes(q) || t.author.toLowerCase().includes(q) ||
      t.director.toLowerCase().includes(q) || t.abstract.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    );
    filtered.sort((a, b) => b.year - a.year);
    setFilteredTheses(filtered);
    setCurrentPage(1);
  }, [theses, searchQuery]);

  const totalPages = Math.ceil(filteredTheses.length / thesesPerPage);
  const currentTheses = filteredTheses.slice((currentPage - 1) * thesesPerPage, currentPage * thesesPerPage);

  const stats = useMemo(() => ({
    total: theses.length,
    totalCitations: theses.reduce((s, t) => s + t.citations, 0),
    totalDownloads: theses.reduce((s, t) => s + t.downloads, 0),
    universities: new Set(theses.map(t => t.university)).size,
  }), [theses]);

  const getDegreeConfig = (degree: Thesis['degree']) => ({
    label: { master: 'Master', phd: 'Doctorat', doctorate: "Doctorat d'État" }[degree],
    color: { master: '#3B82F6', phd: '#10B981', doctorate: '#8B5CF6' }[degree],
    icon: { master: '🎓', phd: '📚', doctorate: '🏅' }[degree],
  });


  return (
    <div className="theses-page">

      {/* ═══ HERO ═══ */}
      <section className="theses-hero">
        <div className="theses-hero-bg">
          <div className="theses-hero-orb theses-orb-1" />
          <div className="theses-hero-orb theses-orb-2" />
          <div className="theses-hero-orb theses-orb-3" />
        </div>
        <div className="theses-hero-content">
          <div className="theses-hero-badge">
            <span>🎓</span>
            <span>Recherche Académique</span>
          </div>
          <h1 className="theses-hero-title">
            Base de Données<br />
            <span className="theses-hero-title-accent">Thèses & Mémoires</span>
          </h1>
          <p className="theses-hero-subtitle">
            Collection scientifique de référence en pharmacie gabonaise — thèses, doctorats et mémoires de recherche.
          </p>

          {/* ── SEARCH COMPACT ── */}
          <div className="theses-hero-search">
            <span className="theses-hero-search-ico">🔍</span>
            <input
              type="text"
              className="theses-hero-search-input"
              placeholder="Titre, auteur, directeur, mots-clés…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="theses-hero-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="theses-hero-stats">
            <div className="theses-hero-stat">
              <span className="theses-hero-stat-value">{stats.total}</span>
              <span className="theses-hero-stat-label">Thèses</span>
            </div>
            <div className="theses-hero-stat-divider" />
            <div className="theses-hero-stat">
              <span className="theses-hero-stat-value">{stats.totalCitations}</span>
              <span className="theses-hero-stat-label">Citations</span>
            </div>
            <div className="theses-hero-stat-divider" />
            <div className="theses-hero-stat">
              <span className="theses-hero-stat-value">{stats.universities}</span>
              <span className="theses-hero-stat-label">Universités</span>
            </div>
            <div className="theses-hero-stat-divider" />
            <div className="theses-hero-stat">
              <span className="theses-hero-stat-value">{stats.totalDownloads}</span>
              <span className="theses-hero-stat-label">Téléchargements</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LISTE ═══ */}
      <div className="theses-content">
        {loading ? (
          <div className="theses-loading">
            <div className="theses-loader" />
            <p>Chargement des thèses…</p>
          </div>
        ) : theses.length === 0 && !searchQuery ? (
          <div className="theses-empty">
            <div className="theses-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00A651" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3 className="theses-empty-title">Section en cours d'alimentation</h3>
            <p className="theses-empty-text">Les thèses et mémoires seront disponibles prochainement.</p>
          </div>
        ) : currentTheses.length === 0 ? (
          <div className="theses-empty">
            <div className="theses-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <h3 className="theses-empty-title">Aucun résultat</h3>
            <p className="theses-empty-text">Aucune thèse ne correspond à votre recherche.</p>
            <button className="theses-empty-btn" onClick={() => setSearchQuery('')}>Effacer la recherche</button>
          </div>
        ) : (
          <div className="theses-list">
            {currentTheses.map((thesis, idx) => {
              const degConf = getDegreeConfig(thesis.degree);
              return (
                <article key={thesis.id} className={`theses-card ${thesis.featured ? 'featured' : ''}`} style={{ animationDelay: `${idx * 0.07}s` }}>
                  {thesis.featured && <div className="theses-card-featured-strip">⭐ À la une</div>}

                  <div className="theses-card-left">
                    <div className="theses-card-year-badge">{thesis.year}</div>
                    <div className="theses-card-degree" style={{ background: degConf.color }}>
                      <span>{degConf.icon}</span>
                      <span>{degConf.label}</span>
                    </div>
                    {thesis.pages > 0 && <div className="theses-card-pages">{thesis.pages}p.</div>}
                  </div>

                  <div className="theses-card-body">
                    <div className="theses-card-meta-top">
                      <span className="theses-card-specialty">{thesis.specialty}</span>
                      <span className="theses-card-lang">{thesis.language.toUpperCase()}</span>
                    </div>

                    <h3 className="theses-card-title">
                      <Link to={`/ressources/theses/${thesis.id}`}>{thesis.title}</Link>
                    </h3>

                    <div className="theses-card-authors">
                      <span className="theses-author-item">
                        <span className="theses-author-ico">👤</span>
                        <span><strong>{thesis.author}</strong></span>
                      </span>
                      {thesis.director && (
                        <span className="theses-author-item">
                          <span className="theses-author-ico">🎓</span>
                          <span>Dir. {thesis.director}</span>
                        </span>
                      )}
                      {thesis.university && (
                        <span className="theses-author-item">
                          <span className="theses-author-ico">🏛️</span>
                          <span>{thesis.university}</span>
                        </span>
                      )}
                    </div>

                    {thesis.abstract && (
                      <p className="theses-card-abstract">{thesis.abstract}</p>
                    )}

                    {thesis.keywords.length > 0 && (
                      <div className="theses-card-keywords">
                        {thesis.keywords.slice(0, 5).map(k => (
                          <span key={k} className="theses-keyword">#{k}</span>
                        ))}
                      </div>
                    )}

                    <div className="theses-card-footer">
                      <div className="theses-card-stats">
                        <span className="theses-stat-pill">⬇️ {thesis.downloads}</span>
                        <span className="theses-stat-pill">📊 {thesis.citations} citations</span>
                      </div>
                      <div className="theses-card-actions">
                        {thesis.pdfUrl ? (
                          <>
                            <Link to={`/ressources/theses/${thesis.id}`} className="theses-btn-primary">
                              Consulter →
                            </Link>
                            <a
                              href={`${API_URL}/public/theses/${thesis.id}/pdf?download=1`}
                              download={buildDownloadFileName(thesis)}
                              className="theses-btn-secondary"
                            >
                              ⬇️ PDF
                            </a>
                          </>
                        ) : (
                          <Link to={`/ressources/theses/${thesis.id}`} className="theses-btn-primary">
                            Voir la fiche →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="theses-pagination">
            <button className="theses-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              ← Précédent
            </button>
            <div className="theses-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`theses-page-num ${currentPage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
            </div>
            <button className="theses-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Suivant →
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Theses;
