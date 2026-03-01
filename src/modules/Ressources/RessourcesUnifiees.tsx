import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { useDebounce } from '../../hooks/useDebounce';
import './RessourcesUnifiees.css';

/* ────────────────────────────────────────────
   TYPES
──────────────────────────────────────────── */
type TabKey = 'decrets' | 'lois' | 'decisions' | 'commissions' | 'theses' | 'articles' | 'communiques';

interface NormalizedItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  summary: string;
  badgeLabel: string;
  badgeColor: string;
  badgeBg: string;
  tags: string[];
  featured: boolean;
  detailUrl: string;
}

/* ────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────── */
const fmtDate = (s: string | number) => {
  if (!s) return '';
  if (typeof s === 'number') return String(s);
  try {
    return new Date(s as string).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch { return String(s); }
};

const truncate = (s: string, n = 160) =>
  s && s.length > n ? s.slice(0, n).trimEnd() + '…' : s;

/* ────────────────────────────────────────────
   NORMALISEURS PAR TYPE
──────────────────────────────────────────── */
const STATUS_DOC: Record<string, [string, string, string]> = {
  active:   ['En vigueur',  '#065F46', '#D1FAE5'],
  modified: ['Modifié',     '#92400E', '#FEF3C7'],
  abrogated:['Abrogé',      '#991B1B', '#FEE2E2'],
  repealed: ['Abrogée',     '#991B1B', '#FEE2E2'],
};

const normalizeDecret = (d: any): NormalizedItem => {
  const [bl, bc, bb] = STATUS_DOC[d.status] || STATUS_DOC.active;
  return {
    id: String(d._id || d.id || ''),
    title: d.title || '',
    subtitle: d.number ? `N° ${d.number}` : '',
    date: fmtDate(d.publicationDate || d.date || ''),
    category: d.category || 'Général',
    summary: truncate(d.summary || d.title || ''),
    badgeLabel: bl, badgeColor: bc, badgeBg: bb,
    tags: d.tags || [],
    featured: !!d.featured,
    detailUrl: `/ressources/decrets/${d._id || d.id}`,
  };
};

const normalizeLoi = (d: any): NormalizedItem => {
  const [bl, bc, bb] = STATUS_DOC[d.status] || STATUS_DOC.active;
  return {
    id: String(d._id || d.id || ''),
    title: d.title || '',
    subtitle: d.number ? `N° ${d.number}` : '',
    date: fmtDate(d.publicationDate || d.date || ''),
    category: d.category || 'Général',
    summary: truncate(d.summary || ''),
    badgeLabel: bl, badgeColor: bc, badgeBg: bb,
    tags: d.tags || [],
    featured: !!d.featured,
    detailUrl: `/ressources/lois/${d._id || d.id}`,
  };
};

const normalizeDecision = (d: any): NormalizedItem => {
  const DCONFIG: Record<string, [string, string, string]> = {
    favorable:               ['Favorable',    '#065F46', '#D1FAE5'],
    defavorable:             ['Défavorable',  '#991B1B', '#FEE2E2'],
    'partiellement favorable':['Part. favorable','#92400E','#FEF3C7'],
    irrecevable:             ['Irrecevable',  '#4B5563', '#F3F4F6'],
  };
  const [bl, bc, bb] = DCONFIG[d.decision] || ['—', '#4B5563', '#F3F4F6'];
  return {
    id: String(d._id || d.id || ''),
    title: d.title || '',
    subtitle: d.reference || '',
    date: fmtDate(d.date || ''),
    category: d.category || d.jurisdiction || 'Général',
    summary: truncate(d.summary || ''),
    badgeLabel: bl, badgeColor: bc, badgeBg: bb,
    tags: d.keywords || [],
    featured: !!d.featured,
    detailUrl: `/ressources/decisions/${d._id || d.id}`,
  };
};

const normalizeCommission = (d: any): NormalizedItem => {
  const active = d.status === 'active' || d.status !== 'inactive';
  return {
    id: String(d._id || d.id || ''),
    title: d.name || d.title || '',
    subtitle: d.president ? `Pdt : ${d.president}` : '',
    date: fmtDate(d.creationDate || ''),
    category: d.category || 'Général',
    summary: truncate(d.description || ''),
    badgeLabel: active ? 'Active' : 'Inactive',
    badgeColor: active ? '#065F46' : '#4B5563',
    badgeBg:   active ? '#D1FAE5' : '#F3F4F6',
    tags: d.missions ? d.missions.slice(0, 3) : [],
    featured: !!d.featured,
    detailUrl: `/ressources/commissions/${d._id || d.id}`,
  };
};

const normalizeThese = (d: any): NormalizedItem => {
  const DEGREE: Record<string, string> = { master: 'Master', phd: 'PhD', doctorate: 'Doctorat' };
  return {
    id: String(d._id || d.id || ''),
    title: d.title || '',
    subtitle: d.author || '',
    date: fmtDate(d.defenseDate || d.year || ''),
    category: d.specialty || d.department || 'Pharmacie',
    summary: truncate(d.abstract || ''),
    badgeLabel: DEGREE[d.degree] || d.degree || 'Thèse',
    badgeColor: '#3730A3',
    badgeBg:   '#EDE9FE',
    tags: (d.keywords || []).slice(0, 5),
    featured: !!d.featured,
    detailUrl: `/ressources/theses/${d._id || d.id}`,
  };
};

const normalizeArticle = (d: any): NormalizedItem => {
  const TYPE: Record<string, string> = {
    article: 'Article', review: 'Revue',
    'case-report': 'Cas clinique', letter: 'Lettre',
  };
  return {
    id: String(d._id || d.id || ''),
    title: d.title || '',
    subtitle: Array.isArray(d.authors) ? d.authors.slice(0, 2).join(', ') : d.authors || '',
    date: fmtDate(d.year || ''),
    category: d.journal || d.category || 'Général',
    summary: truncate(d.abstract || ''),
    badgeLabel: TYPE[d.publicationType] || 'Article',
    badgeColor: '#1D4ED8',
    badgeBg:   '#DBEAFE',
    tags: (d.keywords || []).slice(0, 5),
    featured: !!d.featured,
    detailUrl: `/ressources/articles/${d._id || d.id}`,
  };
};

const normalizeCommunique = (d: any): NormalizedItem => {
  const TYPE: Record<string, [string, string, string]> = {
    urgent:        ['Urgent',       '#991B1B', '#FEE2E2'],
    information:   ['Information',  '#065F46', '#D1FAE5'],
    presse:        ['Presse',       '#1D4ED8', '#DBEAFE'],
    administratif: ['Administratif','#4B5563', '#F3F4F6'],
  };
  const [bl, bc, bb] = TYPE[d.type] || ['Info', '#065F46', '#D1FAE5'];
  return {
    id: String(d._id || d.id || ''),
    title: d.title || '',
    subtitle: d.reference || '',
    date: fmtDate(d.date || ''),
    category: d.category || 'Général',
    summary: truncate(d.excerpt || d.content || ''),
    badgeLabel: bl, badgeColor: bc, badgeBg: bb,
    tags: [],
    featured: !!d.urgent || !!d.featured,
    detailUrl: `/ressources/communiques/${d._id || d.id}`,
  };
};

/* ────────────────────────────────────────────
   TAB CONFIGURATION
──────────────────────────────────────────── */
interface TabConfig {
  key: TabKey;
  label: string;
  dataKey: string;
  typeColor: string;     // left border / accent color per type
  normalize: (raw: any) => NormalizedItem;
  icon: React.ReactNode;
}

const IconScale = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 6 5 .5-3.5 3.5 1 5L12 14l-5.5 3 1-5L4 8.5 9 8z"/>
  </svg>
);
const IconBook = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconGavel = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14l6 6"/><path d="M4 4l6 6"/><rect x="2" y="10" width="6" height="4" rx="1" transform="rotate(-45 5 12)"/>
    <rect x="14" y="2" width="8" height="4" rx="1" transform="rotate(-45 18 4)"/>
  </svg>
);
const IconUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconGradCap = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IconNewspaper = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
  </svg>
);
const IconMegaphone = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
);

const TABS: TabConfig[] = [
  { key: 'decrets',     label: 'Décrets',      dataKey: 'decrets',     typeColor: '#00A651', normalize: normalizeDecret,    icon: <IconScale    /> },
  { key: 'lois',        label: 'Lois',         dataKey: 'lois',        typeColor: '#0D7377', normalize: normalizeLoi,       icon: <IconBook     /> },
  { key: 'decisions',   label: 'Décisions',    dataKey: 'decisions',   typeColor: '#7C3AED', normalize: normalizeDecision,  icon: <IconGavel    /> },
  { key: 'commissions', label: 'Commissions',  dataKey: 'commissions', typeColor: '#D97706', normalize: normalizeCommission, icon: <IconUsers    /> },
  { key: 'theses',      label: 'Thèses',       dataKey: 'theses',      typeColor: '#4338CA', normalize: normalizeThese,     icon: <IconGradCap  /> },
  { key: 'articles',    label: 'Articles',     dataKey: 'articles',    typeColor: '#2563EB', normalize: normalizeArticle,   icon: <IconNewspaper/> },
  { key: 'communiques', label: 'Communiqués',  dataKey: 'communiques', typeColor: '#B45309', normalize: normalizeCommunique, icon: <IconMegaphone/> },
];

const DEFAULT_TAB: TabKey = 'decrets';
const PER_PAGE = 8;

/* ────────────────────────────────────────────
   COMPOSANT CARD
──────────────────────────────────────────── */
const ResourceCard = ({ item, typeColor }: { item: NormalizedItem; typeColor: string }) => (
  <article className="ru-card" style={{ '--ru-type-color': typeColor } as React.CSSProperties}>
    {item.featured && <div className="ru-card-featured-bar" />}
    <div className="ru-card-inner">
      <div className="ru-card-top">
        <span
          className="ru-badge"
          style={{ color: item.badgeColor, background: item.badgeBg }}
        >
          {item.badgeLabel}
        </span>
        {item.date && <span className="ru-card-date">{item.date}</span>}
      </div>

      {item.subtitle && (
        <p className="ru-card-subtitle">{item.subtitle}</p>
      )}

      <h3 className="ru-card-title">{item.title}</h3>

      {item.category && (
        <span className="ru-card-category">{item.category}</span>
      )}

      {item.summary && (
        <p className="ru-card-summary">{item.summary}</p>
      )}

      {item.tags.length > 0 && (
        <div className="ru-card-tags">
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} className="ru-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="ru-card-footer">
        <Link to={item.detailUrl} className="ru-card-btn">
          Consulter
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  </article>
);

/* ────────────────────────────────────────────
   COMPOSANT PRINCIPAL
──────────────────────────────────────────── */
const RessourcesUnifiees = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get('tab') as TabKey) || DEFAULT_TAB;
  const activeTab = TABS.find(t => t.key === tabParam) ? tabParam : DEFAULT_TAB;

  const [dataCache, setDataCache] = useState<Partial<Record<TabKey, NormalizedItem[]>>>({});
  const [loadingTab, setLoadingTab] = useState<TabKey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  /* Charger données onglet actif */
  useEffect(() => {
    if (dataCache[activeTab] !== undefined) return;
    const tab = TABS.find(t => t.key === activeTab);
    if (!tab) return;

    setLoadingTab(activeTab);
    fetchResourceData(tab.dataKey)
      .then(raw => {
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
        setDataCache(prev => ({
          ...prev,
          [activeTab]: arr.map(tab.normalize).filter(i => i.id),
        }));
      })
      .catch(() => setDataCache(prev => ({ ...prev, [activeTab]: [] })))
      .finally(() => setLoadingTab(null));
  }, [activeTab]);

  /* Reset page + search on tab change */
  const switchTab = useCallback((key: TabKey) => {
    setSearchParams({ tab: key });
    setSearchQuery('');
    setCurrentPage(1);
  }, [setSearchParams]);

  /* Reset page on search */
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);

  const currentTabConfig = TABS.find(t => t.key === activeTab)!;
  const items = dataCache[activeTab] || [];
  const isLoading = loadingTab === activeTab;

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return items;
    const q = debouncedSearch.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [items, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  /* Compter les docs par onglet (depuis cache) */
  const tabCount = useCallback((key: TabKey) => {
    const d = dataCache[key];
    return d !== undefined ? d.length : null;
  }, [dataCache]);

  return (
    <div className="ru-page">

      {/* ── HERO ── */}
      <section className="ru-hero">
        <div className="ru-hero-inner">
          <p className="ru-hero-eyebrow">Bibliothèque officielle</p>
          <h1 className="ru-hero-title">Centre Documentaire</h1>
          <p className="ru-hero-subtitle">
            Accédez à l'ensemble des textes réglementaires, décisions, thèses et publications de l'ONPG en un seul endroit.
          </p>

          {/* Barre de recherche globale */}
          <div className="ru-hero-search">
            <div className="ru-hero-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              className="ru-hero-search-input"
              placeholder={`Rechercher dans les ${currentTabConfig.label.toLowerCase()}…`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className="ru-hero-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── ONGLETS ── */}
      <div className="ru-tabs-wrapper">
        <div className="ru-tabs-scroll">
          <nav className="ru-tabs" role="tablist" aria-label="Types de documents">
            {TABS.map(tab => {
              const count = tabCount(tab.key);
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`ru-tab ${isActive ? 'ru-tab--active' : ''}`}
                  style={{ '--ru-tab-color': tab.typeColor } as React.CSSProperties}
                  onClick={() => switchTab(tab.key)}
                >
                  <span className="ru-tab-icon">{tab.icon}</span>
                  <span className="ru-tab-label">{tab.label}</span>
                  {count !== null && (
                    <span className="ru-tab-count">{count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="ru-content">

        {/* En-tête résultats */}
        <div className="ru-results-header">
          <div className="ru-results-info">
            {!isLoading && (
              <>
                <span
                  className="ru-results-type-dot"
                  style={{ background: currentTabConfig.typeColor }}
                />
                <span className="ru-results-text">
                  {debouncedSearch
                    ? <>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour <strong>« {debouncedSearch} »</strong></>
                    : <>{items.length} {currentTabConfig.label.toLowerCase()}</>
                  }
                </span>
              </>
            )}
          </div>
          {totalPages > 1 && !isLoading && (
            <span className="ru-page-info">Page {currentPage} / {totalPages}</span>
          )}
        </div>

        {/* État chargement */}
        {isLoading && (
          <div className="ru-loading">
            <div className="ru-spinner" style={{ borderTopColor: currentTabConfig.typeColor }} />
            <p>Chargement des {currentTabConfig.label.toLowerCase()}…</p>
          </div>
        )}

        {/* État vide — base vide */}
        {!isLoading && items.length === 0 && (
          <div className="ru-empty">
            <div className="ru-empty-icon" style={{ color: currentTabConfig.typeColor }}>
              {currentTabConfig.icon}
            </div>
            <h3>Section en cours d'alimentation</h3>
            <p>Les {currentTabConfig.label.toLowerCase()} seront disponibles prochainement.</p>
          </div>
        )}

        {/* État vide — pas de résultats */}
        {!isLoading && items.length > 0 && filtered.length === 0 && (
          <div className="ru-empty">
            <div className="ru-empty-icon" style={{ color: '#adb5bd' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6M11 8v6"/>
              </svg>
            </div>
            <h3>Aucun résultat</h3>
            <p>Aucun document ne correspond à votre recherche.</p>
            <button className="ru-empty-reset" onClick={() => setSearchQuery('')}>
              Effacer la recherche
            </button>
          </div>
        )}

        {/* Grille de cards */}
        {!isLoading && paginated.length > 0 && (
          <div className="ru-grid">
            {paginated.map(item => (
              <ResourceCard
                key={item.id}
                item={item}
                typeColor={currentTabConfig.typeColor}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="ru-pagination">
            <button
              className="ru-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Précédent
            </button>

            <div className="ru-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`ru-page-num ${p === currentPage ? 'ru-page-num--active' : ''}`}
                  style={p === currentPage ? { background: currentTabConfig.typeColor, borderColor: currentTabConfig.typeColor } : {}}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              className="ru-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Suivant
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RessourcesUnifiees;

