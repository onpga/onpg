import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface Stats {
  actualites: number;
  communiques: number;
  pharmaciens: number;
  pharmacies: number;
  formations: number;
  articles: number;
  lois: number;
  decisions: number;
}

interface RecentItem {
  _id: string;
  title: string;
  type: 'actualite' | 'communique' | 'formation' | 'pharmacie';
  publishedAt: string;
  date?: string;
}

interface AdminUser {
  username?: string;
  role?: string;
}

type DashboardIconName =
  | 'news'
  | 'megaphone'
  | 'users'
  | 'building'
  | 'graduation'
  | 'book'
  | 'scale'
  | 'file'
  | 'folder'
  | 'userShield'
  | 'globe';

const DashboardIcon = ({ name }: { name: DashboardIconName }) => {
  if (name === 'news') {
    return <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === 'megaphone') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M4 13V9l11-4v12L4 13Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M15 9h2a3 3 0 0 1 0 6h-2M6 13l1.6 5.2a1.1 1.1 0 0 0 2.1-.6L8.7 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === 'users') {
    return <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 18a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M16.5 6.5a2.5 2.5 0 1 1 0 5M15.5 18a4.5 4.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === 'building') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V21M2 21h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M8 8h2M14 8h2M8 12h2M14 12h2M11 21v-4h2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === 'graduation') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M6.5 11.5V15c0 1.8 2.5 3.3 5.5 3.3s5.5-1.5 5.5-3.3v-3.5M21 10v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === 'book') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z" stroke="currentColor" strokeWidth="1.8" /><path d="M18 19.5h-9.5A2.5 2.5 0 0 1 6 17V7" stroke="currentColor" strokeWidth="1.8" /></svg>;
  }
  if (name === 'scale') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M7 7h10M4 21h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="m7 7-3 5h6L7 7Zm10 0-3 5h6l-3-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
  }
  if (name === 'file') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z" stroke="currentColor" strokeWidth="1.8" /><path d="M14 3.5V8h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === 'folder') {
    return <svg viewBox="0 0 24 24" fill="none"><path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H10l2 2h7.5A1.5 1.5 0 0 1 21 9.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z" stroke="currentColor" strokeWidth="1.8" /></svg>;
  }
  if (name === 'userShield') {
    return <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M3.5 18a5.5 5.5 0 0 1 11 0M15 5l5 2v4.5c0 3.2-2.1 5.8-5 6.7-2.9-.9-5-3.5-5-6.7V7l5-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    actualites: 0,
    communiques: 0,
    pharmaciens: 0,
    pharmacies: 0,
    formations: 0,
    articles: 0,
    lois: 0,
    decisions: 0
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (!token || !userData) {
      navigate('/admin');
      return;
    }
    
    setUser(JSON.parse(userData) as AdminUser);
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [actualites, communiques, pharmaciens, pharmacies, formations, articles, lois, decisions] = await Promise.all([
        fetch(`${API_URL}/admin/actualites`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/communiques`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/pharmaciens`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/pharmacies`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/formations`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/articles`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/lois`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] })),
        fetch(`${API_URL}/admin/decisions`, { headers }).then(r => r.json()).catch(() => ({ success: false, data: [] }))
      ]);

      setStats({
        actualites: actualites.success ? (actualites.data?.length || 0) : 0,
        communiques: communiques.success ? (communiques.data?.length || 0) : 0,
        pharmaciens: pharmaciens.success ? (pharmaciens.data?.length || 0) : 0,
        pharmacies: pharmacies.success ? (pharmacies.data?.length || 0) : 0,
        formations: formations.success ? (formations.data?.length || 0) : 0,
        articles: articles.success ? (articles.data?.length || 0) : 0,
        lois: lois.success ? (lois.data?.length || 0) : 0,
        decisions: decisions.success ? (decisions.data?.length || 0) : 0
      });

      // Récupérer les items récents
      const allItems: RecentItem[] = [
        ...(actualites.success && actualites.data ? actualites.data.slice(0, 3).map((a: any) => ({ 
          _id: a._id, 
          title: a.title || 'Actualité sans titre', 
          type: 'actualite' as const, 
          publishedAt: a.date || a.createdAt || new Date().toISOString(),
          date: a.date || a.createdAt
        })) : []),
        ...(communiques.success && communiques.data ? communiques.data.slice(0, 3).map((c: any) => ({ 
          _id: c._id, 
          title: c.title || 'Communiqué sans titre', 
          type: 'communique' as const, 
          publishedAt: c.date || c.createdAt || new Date().toISOString(),
          date: c.date || c.createdAt
        })) : []),
        ...(formations.success && formations.data ? formations.data.slice(0, 2).map((f: any) => ({ 
          _id: f._id, 
          title: f.title || 'Formation sans titre', 
          type: 'formation' as const, 
          publishedAt: f.date || f.createdAt || new Date().toISOString(),
          date: f.date || f.createdAt
        })) : []),
        ...(pharmacies.success && pharmacies.data ? pharmacies.data.slice(0, 2).map((p: any) => ({ 
          _id: p._id, 
          title: p.nom || 'Pharmacie sans nom', 
          type: 'pharmacie' as const, 
          publishedAt: p.createdAt || new Date().toISOString(),
          date: p.createdAt
        })) : [])
      ];

      // Trier par date
      allItems.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.date || 0).getTime();
        const dateB = new Date(b.publishedAt || b.date || 0).getTime();
        return dateB - dateA;
      });
      setRecentItems(allItems.slice(0, 6));
      setLastUpdated(new Date().toISOString());

    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setError('Impossible de charger les statistiques pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const contentTotal = stats.actualites + stats.communiques + stats.articles + stats.lois + stats.decisions;
  const documentationTotal = stats.articles + stats.lois + stats.decisions;

  const statCards = [
    { key: 'actualites', value: stats.actualites, label: 'Actualites', icon: 'news' as DashboardIconName, route: '/admin/resources', color: 'blue' },
    { key: 'communiques', value: stats.communiques, label: 'Communiques', icon: 'megaphone' as DashboardIconName, route: '/admin/resources', color: 'green' },
    { key: 'pharmaciens', value: stats.pharmaciens, label: 'Pharmaciens', icon: 'userShield' as DashboardIconName, route: '/admin/pharmaciens', color: 'orange' },
    { key: 'pharmacies', value: stats.pharmacies, label: 'Pharmacies', icon: 'building' as DashboardIconName, route: '/admin/pharmacies', color: 'purple' },
    { key: 'formations', value: stats.formations, label: 'Formations', icon: 'graduation' as DashboardIconName, route: '/admin/formations', color: 'blue' },
    { key: 'articles', value: stats.articles, label: 'Articles', icon: 'book' as DashboardIconName, route: '/admin/resources', color: 'green' },
    { key: 'lois', value: stats.lois, label: 'Lois', icon: 'scale' as DashboardIconName, route: '/admin/resources', color: 'orange' },
    { key: 'decisions', value: stats.decisions, label: 'Decisions', icon: 'file' as DashboardIconName, route: '/admin/resources', color: 'purple' }
  ] as const;

  const quickActions = [
    { icon: 'folder' as DashboardIconName, title: 'Gerer les ressources', description: 'Actualites, communiques, articles, lois...', route: '/admin/resources' },
    { icon: 'graduation' as DashboardIconName, title: 'Nouvelle formation', description: 'Creer une formation continue', route: '/admin/formations' },
    { icon: 'users' as DashboardIconName, title: 'Gerer les pharmaciens', description: 'Voir et modifier les pharmaciens', route: '/admin/pharmaciens' },
    { icon: 'building' as DashboardIconName, title: 'Gerer les pharmacies', description: 'Ajouter, associer et superviser les pharmacies', route: '/admin/pharmacies' }
  ] as const;

  const getItemTypeLabel = (type: RecentItem['type']) => {
    if (type === 'actualite') return 'Actualite';
    if (type === 'communique') return 'Communique';
    if (type === 'formation') return 'Formation';
    return 'Pharmacie';
  };

  const getItemTypeIcon = (type: RecentItem['type']): DashboardIconName => {
    if (type === 'actualite') return 'news';
    if (type === 'communique') return 'megaphone';
    if (type === 'formation') return 'graduation';
    return 'building';
  };

  const getItemRoute = (type: RecentItem['type']) => {
    if (type === 'formation') return '/admin/formations';
    if (type === 'pharmacie') return '/admin/pharmacies';
    return '/admin/resources';
  };

  const userInitial = (user?.username || 'A').charAt(0).toUpperCase();

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="dashboard" />

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="user-info-compact">
            <span className="user-avatar-small">{userInitial}</span>
            <div>
              <p className="user-name-small">{user?.username}</p>
              <p className="user-role-small">{user?.role}</p>
            </div>
          </div>
          <div className="dashboard-topbar-actions">
            <button onClick={fetchStats} className="btn-secondary dashboard-refresh-btn" type="button">
              Actualiser
            </button>
            <button onClick={logout} className="logout-btn-header" type="button">
              Deconnexion
            </button>
          </div>
        </div>

        <header className="dashboard-header">
          <div className="dashboard-header-main">
            <h1>Tableau de bord</h1>
            <p>Bienvenue {user?.username || 'Administrateur'} ! Voici un apercu de votre espace.</p>
          </div>
          <div className="dashboard-header-kpis">
            <div className="dashboard-mini-kpi">
              <span>Contenus</span>
              <strong>{contentTotal}</strong>
            </div>
            <div className="dashboard-mini-kpi">
              <span>Membres</span>
              <strong>{stats.pharmaciens + stats.pharmacies}</strong>
            </div>
          </div>
        </header>

        {error && <div className="dashboard-alert error">{error}</div>}
        {loading && <div className="dashboard-alert info">Chargement des donnees...</div>}
        {!loading && !error && lastUpdated && (
          <div className="dashboard-meta-note">
            Mise a jour: {new Date(lastUpdated).toLocaleString('fr-FR')}
          </div>
        )}

        <section className="dashboard-health-strip">
          <article className="health-card">
            <p className="health-label">Ressources editoriales</p>
            <h3>{contentTotal}</h3>
            <small>Actualites + communiques + documents</small>
          </article>
          <article className="health-card">
            <p className="health-label">Formation continue</p>
            <h3>{stats.formations}</h3>
            <small>Formations disponibles</small>
          </article>
          <article className="health-card">
            <p className="health-label">Annuaire ONPG</p>
            <h3>{stats.pharmaciens + stats.pharmacies}</h3>
            <small>Pharmaciens et pharmacies</small>
          </article>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            {statCards.map((card) => (
              <div key={card.key} className={`stat-card ${card.color}`}>
                <div className="stat-icon"><DashboardIcon name={card.icon} /></div>
                <div className="stat-info">
                  <h3>{card.value}</h3>
                  <p>{card.label}</p>
                </div>
                <Link to={card.route} className="stat-link">Gerer</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="quick-actions-section">
          <h2>Actions rapides</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.route} className="action-card">
                <span className="action-icon"><DashboardIcon name={action.icon} /></span>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </Link>
            ))}

            <Link to="/" className="action-card" target="_blank" rel="noreferrer">
              <span className="action-icon"><DashboardIcon name="globe" /></span>
              <h3>Voir le site</h3>
              <p>Apercu public</p>
            </Link>
          </div>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <h2>Publications recentes</h2>
            <Link to="/admin/resources" className="view-all-link">Tout voir</Link>
          </div>

          <div className="recent-list">
            {recentItems.length === 0 ? (
              <div className="empty-state">
                <p>Aucune publication recente</p>
                <Link to="/admin/resources" className="btn-primary">Gerer les ressources</Link>
              </div>
            ) : (
              recentItems.map((item) => (
                <div key={`${item.type}-${item._id}`} className="recent-item">
                  <div className="recent-item-icon"><DashboardIcon name={getItemTypeIcon(item.type)} /></div>
                  <div className="recent-item-content">
                    <h4>{item.title}</h4>
                    <div className="recent-item-meta">
                      <span className="item-type">{getItemTypeLabel(item.type)}</span>
                      <span className="item-date">
                        {item.publishedAt || item.date
                          ? new Date(item.publishedAt || item.date || new Date().toISOString()).toLocaleDateString('fr-FR')
                          : 'Date inconnue'
                        }
                      </span>
                    </div>
                  </div>
                  <Link to={getItemRoute(item.type)} className="recent-item-action">
                    Ouvrir
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="overview-section">
          <h2>Vue d'ensemble</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Contenu</h3>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Actualites publiees</span>
                  <span className="progress-value">{stats.actualites}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((stats.actualites / 50) * 100, 100)}%` }}></div>
                </div>
                <small>Objectif: 50 actualites minimum</small>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Communiques</span>
                  <span className="progress-value">{stats.communiques}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: `${Math.min((stats.communiques / 30) * 100, 100)}%` }}></div>
                </div>
                <small>Objectif: 30 communiques minimum</small>
              </div>
            </div>

            <div className="overview-card">
              <h3>Membres</h3>
              <div className="stat-row">
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.pharmaciens}</div>
                  <div className="stat-mini-label">Pharmaciens</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.pharmacies}</div>
                  <div className="stat-mini-label">Pharmacies</div>
                </div>
              </div>
              <Link to="/admin/pharmaciens" className="card-link">Gerer les membres</Link>
            </div>

            <div className="overview-card">
              <h3>Formations</h3>
              <div className="stat-row">
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.formations}</div>
                  <div className="stat-mini-label">Formations actives</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-value">{documentationTotal}</div>
                  <div className="stat-mini-label">Documents</div>
                </div>
              </div>
              <Link to="/admin/formations" className="card-link">Gerer les formations</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;















