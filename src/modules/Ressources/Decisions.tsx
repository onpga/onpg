import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Decisions.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

interface Decision {
  id: string;
  reference: string;
  title: string;
  date: string;
  jurisdiction: string;
  category: string;
  summary: string;
  parties: string[];
  decision: 'favorable' | 'defavorable' | 'partiellement favorable' | 'irrecevable';
  keywords: string[];
  downloads: number;
  citations: number;
  featured: boolean;
}

const DECISION_CONFIG = {
  favorable:              { label: 'Favorable',              color: '#065F46', bg: '#D1FAE5', icon: '✅' },
  defavorable:            { label: 'Défavorable',            color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
  'partiellement favorable': { label: 'Partiellement favorable', color: '#92400E', bg: '#FEF3C7', icon: '⚠️' },
  irrecevable:            { label: 'Irrecevable',            color: '#4B5563', bg: '#F3F4F6', icon: '🚫' },
};

const Decisions = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchResourceData('decisions');
      if (!data) { setDecisions([]); setLoading(false); return; }
      const raw = Array.isArray(data) ? data : [data];
      setDecisions(raw.map((item: any) => ({
        id: String(item._id || ''),
        reference: item.reference || `DEC-${item._id?.substring(0, 8) || '001'}`,
        title: item.title || '',
        date: item.date || '',
        jurisdiction: item.jurisdiction || '',
        category: item.category || 'Général',
        summary: item.summary || item.title || '',
        parties: item.parties || [],
        decision: (item.decision as Decision['decision']) || 'favorable',
        keywords: item.keywords || [],
        downloads: item.downloads || 0,
        citations: item.citations || 0,
        featured: item.featured || false,
      })));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return decisions;
    return decisions.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.reference.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.jurisdiction.toLowerCase().includes(q) ||
      d.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [decisions, searchQuery]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const fmtDate = (s: string) => {
    if (!s) return '—';
    try { return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return s; }
  };

  return (
    <div className="decisions-page">
      {/* ── HERO ── */}
      <section className="decisions-hero">
        <div className="decisions-hero-inner">
          <div className="decisions-hero-badge">🏛️ Jurisprudence & décisions</div>
          <h1 className="decisions-hero-title">Décisions de l'Ordre</h1>
          <p className="decisions-hero-subtitle">
            Consultez les décisions disciplinaires, administratives et ordinales prises par l'ONPG
          </p>

          {/* Recherche compacte */}
          <div className="decisions-hero-search">
            <span className="decisions-hero-search-ico">🔍</span>
            <input
              type="text"
              className="decisions-hero-search-input"
              placeholder="Rechercher une décision, référence, juridiction…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
            {searchQuery && (
              <button className="decisions-hero-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Stats */}
          <div className="decisions-hero-stats">
            <div className="decisions-hero-stat">
              <span className="decisions-stat-val">{decisions.length}</span>
              <span className="decisions-stat-lbl">Décisions</span>
            </div>
            <div className="decisions-stat-div" />
            <div className="decisions-hero-stat">
              <span className="decisions-stat-val">{decisions.filter(d => d.decision === 'favorable').length}</span>
              <span className="decisions-stat-lbl">Favorables</span>
            </div>
            <div className="decisions-stat-div" />
            <div className="decisions-hero-stat">
              <span className="decisions-stat-val">{new Set(decisions.map(d => d.category)).size}</span>
              <span className="decisions-stat-lbl">Catégories</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <div className="decisions-content">
        {searchQuery && (
          <p className="decisions-results-info">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour «&nbsp;{searchQuery}&nbsp;»
          </p>
        )}

        {loading ? (
          <div className="decisions-loading">
            <div className="decisions-spinner" />
            <p>Chargement des décisions…</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="decisions-empty">
            <span className="decisions-empty-icon">🏛️</span>
            <h3>Aucune décision trouvée</h3>
            <p>Modifiez votre recherche pour afficher des résultats.</p>
            {searchQuery && <button className="decisions-reset-btn" onClick={() => setSearchQuery('')}>Effacer la recherche</button>}
          </div>
        ) : (
          <>
            <div className="decisions-list">
              {paginated.map(dec => {
                const cfg = DECISION_CONFIG[dec.decision] || DECISION_CONFIG.favorable;
                return (
                  <article key={dec.id} className={`decisions-card ${dec.featured ? 'decisions-card--featured' : ''}`}>
                    <div className="decisions-card-top">
                      <div className="decisions-card-meta">
                        {dec.reference && (
                          <span className="decisions-reference">Réf. {dec.reference}</span>
                        )}
                        <span className="decisions-decision-badge" style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.icon} {cfg.label}
                        </span>
                        {dec.featured && <span className="decisions-featured-badge">⭐</span>}
                      </div>
                      <div className="decisions-date-row">
                        <span className="decisions-date-item">📅 {fmtDate(dec.date)}</span>
                        {dec.jurisdiction && (
                          <>
                            <span className="decisions-date-sep">·</span>
                            <span className="decisions-date-item">🏛️ {dec.jurisdiction}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="decisions-card-body">
                      <span className="decisions-category">{dec.category}</span>
                      <h2 className="decisions-card-title">{dec.title}</h2>
                      {dec.summary && (
                        <p className="decisions-card-summary">{dec.summary}</p>
                      )}
                      {dec.parties.length > 0 && (
                        <div className="decisions-parties">
                          <span className="decisions-parties-label">Parties :</span>
                          {dec.parties.slice(0, 3).map((p, i) => (
                            <span key={i} className="decisions-party-chip">{p}</span>
                          ))}
                          {dec.parties.length > 3 && (
                            <span className="decisions-party-more">+{dec.parties.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="decisions-card-footer">
                      <div className="decisions-keywords">
                        {dec.keywords.slice(0, 4).map(k => (
                          <span key={k} className="decisions-keyword">#{k}</span>
                        ))}
                      </div>
                      <div className="decisions-card-actions">
                        <span className="decisions-stat-item">💬 {dec.citations}</span>
                        <span className="decisions-stat-item">⬇️ {dec.downloads}</span>
                        <Link to={`/ressources/decisions/${dec.id}`} className="decisions-card-btn">
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
              <div className="decisions-pagination">
                <button
                  className="decisions-page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >← Précédent</button>
                <div className="decisions-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`decisions-page-num ${p === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(p)}
                    >{p}</button>
                  ))}
                </div>
                <button
                  className="decisions-page-btn"
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

export default Decisions;
