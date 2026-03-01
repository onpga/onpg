import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Lois.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

interface Law {
  id: string;
  number: string;
  title: string;
  publicationDate: string;
  entryDate: string;
  category: string;
  summary: string;
  tableOfContents: { title: string; articles: string[] }[];
  keyArticles: string[];
  tags: string[];
  status: 'active' | 'modified' | 'repealed';
  downloads: number;
  views: number;
  featured: boolean;
  language: string;
}

const STATUS_CONFIG = {
  active:   { label: 'En vigueur',  color: '#065F46', bg: '#D1FAE5', icon: '✅' },
  modified: { label: 'Modifiée',    color: '#92400E', bg: '#FEF3C7', icon: '⚠️' },
  repealed: { label: 'Abrogée',     color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
};

const Lois = () => {
  const [laws, setLaws] = useState<Law[]>([]);
  const [filteredLaws, setFilteredLaws] = useState<Law[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const lawsPerPage = 5;

  useEffect(() => {
    const loadLaws = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('lois');
        if (!data) { setLaws([]); setFilteredLaws([]); return; }
        const rawArray = Array.isArray(data) ? data : [data];
        const mapped: Law[] = rawArray.map((item: any) => ({
          id: String(item._id || ''),
          number: item.number || '',
          title: item.title || '',
          publicationDate: item.publicationDate || item.date || new Date().toISOString().split('T')[0],
          entryDate: item.entryDate || item.date || new Date().toISOString().split('T')[0],
          category: item.category || 'Législation',
          summary: item.summary || item.title || '',
          tableOfContents: item.tableOfContents || [],
          keyArticles: item.keyArticles || [],
          tags: item.tags || [],
          status: (item.status as 'active' | 'modified' | 'repealed') || 'active',
          downloads: item.downloads || 0,
          views: item.views || 0,
          featured: item.featured || false,
          language: item.language || 'fr',
        }));
        setLaws(mapped);
        setFilteredLaws(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLaws();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = laws.filter(l =>
      !q || l.title.toLowerCase().includes(q) || l.number.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q))
    );
    setFilteredLaws(filtered);
    setCurrentPage(1);
  }, [laws, searchQuery]);

  const totalPages = Math.ceil(filteredLaws.length / lawsPerPage);
  const currentLaws = filteredLaws.slice((currentPage - 1) * lawsPerPage, currentPage * lawsPerPage);

  const stats = useMemo(() => ({
    total: laws.length,
    active: laws.filter(l => l.status === 'active').length,
    totalDownloads: laws.reduce((s, l) => s + l.downloads, 0),
    totalViews: laws.reduce((s, l) => s + l.views, 0),
  }), [laws]);


  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="lois-page">

      {/* ═══ HERO ═══ */}
      <section className="lois-hero">
        <div className="lois-hero-bg">
          <div className="lois-orb lois-orb-1" />
          <div className="lois-orb lois-orb-2" />
          <div className="lois-orb lois-orb-3" />
        </div>
        <div className="lois-hero-content">
          <div className="lois-hero-badge">
            <span>⚖️</span>
            <span>Réglementation Pharmaceutique</span>
          </div>
          <h1 className="lois-hero-title">
            Corpus<br />
            <span className="lois-hero-title-accent">Législatif & Réglementaire</span>
          </h1>
          <p className="lois-hero-subtitle">
            Lois, décrets et textes officiels régissant l'exercice de la pharmacie au Gabon — accès direct et navigation facilitée.
          </p>

          {/* ── SEARCH COMPACT ── */}
          <div className="lois-hero-search">
            <span className="lois-hero-search-ico">🔍</span>
            <input
              type="text"
              className="lois-hero-search-input"
              placeholder="Numéro, titre, résumé, mots-clés…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="lois-hero-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="lois-hero-stats">
            <div className="lois-hero-stat">
              <span className="lois-stat-val">{stats.total}</span>
              <span className="lois-stat-lbl">Textes</span>
            </div>
            <div className="lois-stat-div" />
            <div className="lois-hero-stat">
              <span className="lois-stat-val">{stats.active}</span>
              <span className="lois-stat-lbl">En vigueur</span>
            </div>
            <div className="lois-stat-div" />
            <div className="lois-hero-stat">
              <span className="lois-stat-val">{stats.totalDownloads.toLocaleString()}</span>
              <span className="lois-stat-lbl">Téléchargements</span>
            </div>
            <div className="lois-stat-div" />
            <div className="lois-hero-stat">
              <span className="lois-stat-val">{stats.totalViews.toLocaleString()}</span>
              <span className="lois-stat-lbl">Consultations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <div className="lois-content">
        {loading ? (
          <div className="lois-loading">
            <div className="lois-loader" />
            <p>Chargement des textes législatifs…</p>
          </div>
        ) : currentLaws.length === 0 ? (
          <div className="lois-empty">
            <div className="lois-empty-icon">⚖️</div>
            <h3 className="lois-empty-title">Aucun texte trouvé</h3>
            <p className="lois-empty-text">Modifiez vos critères de recherche.</p>
            {searchQuery && <button className="lois-empty-btn" onClick={() => setSearchQuery('')}>Effacer la recherche</button>}
          </div>
        ) : (
          <div className="lois-list">
            {currentLaws.map((law, idx) => {
              const statusCfg = STATUS_CONFIG[law.status];
              return (
                <article key={law.id} className={`lois-card ${law.featured ? 'featured' : ''}`} style={{ animationDelay: `${idx * 0.07}s` }}>
                  {law.featured && <div className="lois-card-featured">⭐ Texte clé</div>}

                  <div className="lois-card-header">
                    <div className="lois-card-header-left">
                      {law.number && (
                        <div className="lois-card-number">
                          <span className="lois-number-icon">📜</span>
                          <span>Loi n° {law.number}</span>
                        </div>
                      )}
                      <span className="lois-card-category">{law.category}</span>
                    </div>
                    <div className="lois-card-header-right">
                      <span className="lois-status-badge" style={{ color: statusCfg.color, background: statusCfg.bg }}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="lois-card-title">
                    <Link to={`/ressources/lois/${law.id}`}>{law.title}</Link>
                  </h3>

                  <div className="lois-card-dates">
                    <div className="lois-date-item">
                      <span className="lois-date-ico">📅</span>
                      <span className="lois-date-lbl">Publication :</span>
                      <span className="lois-date-val">{formatDate(law.publicationDate)}</span>
                    </div>
                    <div className="lois-date-sep">·</div>
                    <div className="lois-date-item">
                      <span className="lois-date-ico">⚡</span>
                      <span className="lois-date-lbl">Entrée en vigueur :</span>
                      <span className="lois-date-val">{formatDate(law.entryDate)}</span>
                    </div>
                  </div>

                  {law.summary && (
                    <p className="lois-card-summary">{law.summary}</p>
                  )}

                  {law.tableOfContents.length > 0 && (
                    <div className="lois-toc">
                      <div className="lois-toc-header">
                        <span className="lois-toc-title">Sommaire</span>
                        <span className="lois-toc-count">{law.tableOfContents.length} titres</span>
                      </div>
                      <div className="lois-toc-items">
                        {law.tableOfContents.slice(0, 3).map((section, i) => (
                          <div key={i} className="lois-toc-item">
                            <span className="lois-toc-bullet">▸</span>
                            <span className="lois-toc-section-title">{section.title}</span>
                            <span className="lois-toc-articles">{section.articles.length} art.</span>
                          </div>
                        ))}
                        {law.tableOfContents.length > 3 && (
                          <div className="lois-toc-more">+ {law.tableOfContents.length - 3} autres titres</div>
                        )}
                      </div>
                    </div>
                  )}

                  {law.tags.length > 0 && (
                    <div className="lois-card-tags">
                      {law.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="lois-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="lois-card-footer">
                    <div className="lois-card-stats">
                      <span className="lois-stat-pill">👁️ {law.views.toLocaleString()} vues</span>
                      <span className="lois-stat-pill">⬇️ {law.downloads} téléch.</span>
                    </div>
                    <Link to={`/ressources/lois/${law.id}`} className="lois-card-btn">
                      Consulter le texte →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="lois-pagination">
            <button className="lois-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Précédent</button>
            <div className="lois-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`lois-page-num ${currentPage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
            </div>
            <button className="lois-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Suivant →</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Lois;
