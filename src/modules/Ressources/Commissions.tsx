import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Commissions.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

interface Commission {
  id: string;
  name: string;
  description: string;
  president: string;
  members: string[];
  creationDate: string;
  category: string;
  missions: string[];
  meetings: number;
  reports: number;
  status: 'active' | 'inactive';
  featured: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Éthique': '⚖️', 'Formation': '🎓', 'Législation': '📜', 'Santé': '❤️',
  'Recherche': '🔬', 'Communication': '📢', 'Finance': '💰', 'Général': '🏛️',
};

const Commissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const commissionsPerPage = 6;

  useEffect(() => {
    const loadCommissions = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('commissions');
        if (!data) { setCommissions([]); setFilteredCommissions([]); return; }
        const rawArray = Array.isArray(data) ? data : [data];
        const mapped: Commission[] = rawArray.map((item: any) => ({
          id: String(item._id || ''),
          name: item.title || item.name || '',
          description: item.description || '',
          president: item.president || '',
          members: item.members || [],
          creationDate: item.creationDate || new Date().toISOString().split('T')[0],
          category: item.category || 'Général',
          missions: item.attributions || item.missions || [],
          meetings: item.meetings || 0,
          reports: item.reports || 0,
          status: (item.status as 'active' | 'inactive') || 'active',
          featured: item.featured || false,
        }));
        setCommissions(mapped);
        setFilteredCommissions(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadCommissions();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = commissions.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) ||
      c.president.toLowerCase().includes(q) || c.missions.some(m => m.toLowerCase().includes(q))
    );
    setFilteredCommissions(filtered);
    setCurrentPage(1);
  }, [commissions, searchQuery]);

  const totalPages = Math.ceil(filteredCommissions.length / commissionsPerPage);
  const currentCommissions = filteredCommissions.slice((currentPage - 1) * commissionsPerPage, currentPage * commissionsPerPage);

  const stats = useMemo(() => ({
    total: commissions.length,
    active: commissions.filter(c => c.status === 'active').length,
    totalMeetings: commissions.reduce((s, c) => s + c.meetings, 0),
    totalReports: commissions.reduce((s, c) => s + c.reports, 0),
  }), [commissions]);


  return (
    <div className="commissions-page">

      {/* ═══ HERO ═══ */}
      <section className="comm-hero">
        <div className="comm-hero-bg">
          <div className="comm-orb comm-orb-1" />
          <div className="comm-orb comm-orb-2" />
          <div className="comm-orb comm-orb-3" />
        </div>
        <div className="comm-hero-content">
          <div className="comm-hero-badge">
            <span>🏛️</span>
            <span>Organes Consultatifs</span>
          </div>
          <h1 className="comm-hero-title">
            Commissions<br />
            <span className="comm-hero-title-accent">de l'ONPG</span>
          </h1>
          <p className="comm-hero-subtitle">
            Les commissions spécialisées qui œuvrent pour l'excellence pharmaceutique gabonaise — missions, activités et compositions.
          </p>

          {/* ── SEARCH COMPACT ── */}
          <div className="comm-hero-search">
            <span className="comm-hero-search-ico">🔍</span>
            <input
              type="text"
              className="comm-hero-search-input"
              placeholder="Nom, description, président, mission…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="comm-hero-search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="comm-hero-stats">
            <div className="comm-hero-stat">
              <span className="comm-stat-val">{stats.total}</span>
              <span className="comm-stat-lbl">Commissions</span>
            </div>
            <div className="comm-stat-div" />
            <div className="comm-hero-stat">
              <span className="comm-stat-val">{stats.active}</span>
              <span className="comm-stat-lbl">Actives</span>
            </div>
            <div className="comm-stat-div" />
            <div className="comm-hero-stat">
              <span className="comm-stat-val">{stats.totalMeetings}</span>
              <span className="comm-stat-lbl">Réunions</span>
            </div>
            <div className="comm-stat-div" />
            <div className="comm-hero-stat">
              <span className="comm-stat-val">{stats.totalReports}</span>
              <span className="comm-stat-lbl">Rapports</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <div className="comm-content">
        {loading ? (
          <div className="comm-loading">
            <div className="comm-loader" />
            <p>Chargement des commissions…</p>
          </div>
        ) : currentCommissions.length === 0 ? (
          <div className="comm-empty">
            <div className="comm-empty-icon">🏛️</div>
            <h3 className="comm-empty-title">Aucune commission trouvée</h3>
            <p className="comm-empty-text">Modifiez vos critères de recherche.</p>
            {searchQuery && <button className="comm-empty-btn" onClick={() => setSearchQuery('')}>Effacer la recherche</button>}
          </div>
        ) : (
          <div className="comm-grid">
            {currentCommissions.map((commission, idx) => (
              <Link
                key={commission.id}
                to={`/ressources/commissions/${commission.id}`}
                className={`comm-card ${commission.featured ? 'featured' : ''} ${commission.status === 'inactive' ? 'inactive' : ''}`}
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {commission.featured && <div className="comm-card-featured">⭐ À la une</div>}

                <div className="comm-card-top">
                  <div className="comm-card-icon-wrap">
                    <span className="comm-card-icon">{CATEGORY_ICONS[commission.category] || '🏛️'}</span>
                  </div>
                  <div className="comm-card-badges">
                    <span className={`comm-status-badge ${commission.status}`}>
                      {commission.status === 'active' ? '● Active' : '○ Inactive'}
                    </span>
                    <span className="comm-category-badge">{commission.category}</span>
                  </div>
                </div>

                <h3 className="comm-card-name">{commission.name}</h3>

                {commission.president && (
                  <div className="comm-card-president">
                    <span className="comm-president-ico">👤</span>
                    <span><strong>Président :</strong> {commission.president}</span>
                  </div>
                )}

                {commission.description && (
                  <p className="comm-card-desc">{commission.description}</p>
                )}

                {commission.missions.length > 0 && (
                  <div className="comm-card-missions">
                    <span className="comm-missions-title">Missions principales</span>
                    <ul className="comm-missions-list">
                      {commission.missions.slice(0, 3).map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                      {commission.missions.length > 3 && (
                        <li className="comm-missions-more">+{commission.missions.length - 3} autres</li>
                      )}
                    </ul>
                  </div>
                )}

                {commission.members.length > 0 && (
                  <div className="comm-card-members">
                    {commission.members.slice(0, 4).map((m, i) => (
                      <span key={i} className="comm-member-chip">{m}</span>
                    ))}
                    {commission.members.length > 4 && (
                      <span className="comm-member-chip more">+{commission.members.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="comm-card-footer">
                  <div className="comm-card-stats">
                    <span className="comm-stat-pill">📅 {commission.meetings} réunions</span>
                    <span className="comm-stat-pill">📄 {commission.reports} rapports</span>
                  </div>
                  <span className="comm-card-cta">Voir →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="comm-pagination">
            <button className="comm-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Précédent</button>
            <div className="comm-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`comm-page-num ${currentPage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
            </div>
            <button className="comm-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Suivant →</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Commissions;
