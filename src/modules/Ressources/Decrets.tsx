import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Decrets.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

interface Decret {
  id: string;
  number: string;
  title: string;
  publicationDate: string;
  entryDate: string;
  ministry: string;
  category: string;
  summary: string;
  keyArticles: string[];
  tags: string[];
  status: 'active' | 'modified' | 'abrogated';
  downloads: number;
  views: number;
  featured: boolean;
  language: string;
}

const STATUS_CONFIG = {
  active:   { label: 'En vigueur',  color: '#065F46', bg: '#D1FAE5', icon: '✅' },
  modified: { label: 'Modifié',     color: '#92400E', bg: '#FEF3C7', icon: '📝' },
  abrogated:{ label: 'Abrogé',      color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
};

const Decrets = () => {
  const [decrets, setDecrets] = useState<Decret[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchResourceData('decrets');
      if (!data) { setDecrets([]); setLoading(false); return; }
      const raw = Array.isArray(data) ? data : [data];
      setDecrets(raw.map((item: any) => ({
        id: String(item._id || ''),
        number: item.number || '',
        title: item.title || '',
        publicationDate: item.publicationDate || item.date || '',
        entryDate: item.entryDate || item.date || '',
        ministry: item.ministry || 'Ministère de la Santé',
        category: item.category || 'Général',
        summary: item.summary || item.title || '',
        keyArticles: item.keyArticles || [],
        tags: item.tags || [],
        status: (item.status as 'active' | 'modified' | 'abrogated') || 'active',
        downloads: item.downloads || 0,
        views: item.views || 0,
        featured: item.featured || false,
        language: item.language || 'fr',
      })));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return decrets;
    return decrets.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.number.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.ministry.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [decrets, searchQuery]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const fmtDate = (s: string) => {
    if (!s) return '—';
    try { return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return s; }
  };

  return (
    <div className="decrets-page">
      {/* ── HERO ── */}
      <section className="decrets-hero">
        <div className="decrets-hero-inner">
          <div className="decrets-hero-badge">⚖️ Textes réglementaires</div>
          <h1 className="decrets-hero-title">Décrets & Arrêtés</h1>
          <p className="decrets-hero-subtitle">
            Consultez les décrets, arrêtés et textes officiels régissant la profession pharmaceutique au Gabon
          </p>

          {/* Recherche compacte */}
          <div className="decrets-hero-search">
            <span className="decrets-hero-search-ico">🔍</span>
            <input
              type="text"
              className="decrets-hero-search-input"
              placeholder="Rechercher un décret, numéro, ministère…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
            {searchQuery && (
              <button className="decrets-hero-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Stats */}
          <div className="decrets-hero-stats">
            <div className="decrets-hero-stat">
              <span className="decrets-stat-val">{decrets.length}</span>
              <span className="decrets-stat-lbl">Décrets</span>
            </div>
            <div className="decrets-stat-div" />
            <div className="decrets-hero-stat">
              <span className="decrets-stat-val">{decrets.filter(d => d.status === 'active').length}</span>
              <span className="decrets-stat-lbl">En vigueur</span>
            </div>
            <div className="decrets-stat-div" />
            <div className="decrets-hero-stat">
              <span className="decrets-stat-val">{new Set(decrets.map(d => d.category)).size}</span>
              <span className="decrets-stat-lbl">Catégories</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <div className="decrets-content">
        {/* Résultats */}
        {searchQuery && (
          <p className="decrets-results-info">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour «&nbsp;{searchQuery}&nbsp;»
          </p>
        )}

        {loading ? (
          <div className="decrets-loading">
            <div className="decrets-spinner" />
            <p>Chargement des décrets…</p>
          </div>
        ) : decrets.length === 0 && !searchQuery ? (
          <div className="decrets-empty">
            <span className="decrets-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00A651" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </span>
            <h3>Section en cours d'alimentation</h3>
            <p>Les décrets et arrêtés seront disponibles prochainement.</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="decrets-empty">
            <span className="decrets-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </span>
            <h3>Aucun résultat</h3>
            <p>Aucun décret ne correspond à votre recherche.</p>
            <button className="decrets-reset-btn" onClick={() => setSearchQuery('')}>Effacer la recherche</button>
          </div>
        ) : (
          <>
            <div className="decrets-list">
              {paginated.map(decret => {
                const st = STATUS_CONFIG[decret.status] || STATUS_CONFIG.active;
                return (
                  <article key={decret.id} className={`decrets-card ${decret.featured ? 'decrets-card--featured' : ''}`}>
                    <div className="decrets-card-top">
                      <div className="decrets-card-meta">
                        {decret.number && (
                          <span className="decrets-number">N° {decret.number}</span>
                        )}
                        <span className="decrets-status-badge" style={{ background: st.bg, color: st.color }}>
                          {st.icon} {st.label}
                        </span>
                        {decret.featured && <span className="decrets-featured-badge">⭐</span>}
                      </div>
                      <div className="decrets-dates">
                        <span className="decrets-date-item">📅 Publié le {fmtDate(decret.publicationDate)}</span>
                        {decret.entryDate && decret.entryDate !== decret.publicationDate && (
                          <>
                            <span className="decrets-date-sep">·</span>
                            <span className="decrets-date-item">⚡ En vigueur le {fmtDate(decret.entryDate)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="decrets-card-body">
                      <div className="decrets-card-cat-row">
                        <span className="decrets-category">{decret.category}</span>
                        {decret.ministry && <span className="decrets-ministry">🏛️ {decret.ministry}</span>}
                      </div>
                      <h2 className="decrets-card-title">{decret.title}</h2>
                      {decret.summary && (
                        <p className="decrets-card-summary">{decret.summary}</p>
                      )}
                      {decret.keyArticles.length > 0 && (
                        <ul className="decrets-key-articles">
                          {decret.keyArticles.slice(0, 3).map((art, i) => (
                            <li key={i}>{art}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="decrets-card-footer">
                      <div className="decrets-tags">
                        {decret.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="decrets-tag">#{tag}</span>
                        ))}
                      </div>
                      <div className="decrets-card-actions">
                        <span className="decrets-stat-item">👁️ {decret.views}</span>
                        <span className="decrets-stat-item">⬇️ {decret.downloads}</span>
                        <Link to={`/ressources/decrets/${decret.id}`} className="decrets-card-btn">
                          Consulter <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="decrets-pagination">
                <button
                  className="decrets-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >← Précédent</button>
                <div className="decrets-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`decrets-page-num ${p === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(p)}
                    >{p}</button>
                  ))}
                </div>
                <button
                  className="decrets-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >Suivant →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Decrets;
