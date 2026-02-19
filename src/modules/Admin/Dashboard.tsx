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
  const [user, setUser] = useState<any>(null);
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
    
    setUser(JSON.parse(userData));
  };

  const fetchStats = async () => {
    try {
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

    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="dashboard" />

      <main className="dashboard-main">
        {/* Top bar utilisateur */}
        <div className="dashboard-topbar">
          <div className="user-info-compact">
            <span className="user-avatar-small">👤</span>
            <div>
              <p className="user-name-small">{user?.username}</p>
              <p className="user-role-small">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="logout-btn-header">
            Déconnexion
          </button>
        </div>

        <header className="dashboard-header">
          <div>
            <h1>Tableau de bord</h1>
            <p>Bienvenue {user?.username} ! Voici un aperçu de votre site.</p>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">📰</div>
              <div className="stat-info">
                <h3>{stats.actualites}</h3>
                <p>Actualités</p>
              </div>
              <Link to="/admin/resources" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">📢</div>
              <div className="stat-info">
                <h3>{stats.communiques}</h3>
                <p>Communiqués</p>
              </div>
              <Link to="/admin/resources" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-info">
                <h3>{stats.pharmaciens}</h3>
                <p>Pharmaciens</p>
              </div>
              <Link to="/admin/pharmaciens" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <h3>{stats.pharmacies}</h3>
                <p>Pharmacies</p>
              </div>
              <Link to="/admin/pharmacies" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <h3>{stats.formations}</h3>
                <p>Formations</p>
              </div>
              <Link to="/admin/formations" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.articles}</h3>
                <p>Articles</p>
              </div>
              <Link to="/admin/resources" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">⚖️</div>
              <div className="stat-info">
                <h3>{stats.lois}</h3>
                <p>Lois</p>
              </div>
              <Link to="/admin/resources" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>{stats.decisions}</h3>
                <p>Décisions</p>
              </div>
              <Link to="/admin/resources" className="stat-link">Gérer →</Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2>Actions rapides</h2>
          <div className="actions-grid">
            <Link to="/admin/resources" className="action-card">
              <span className="action-icon">📚</span>
              <h3>Gérer les ressources</h3>
              <p>Actualités, communiqués, articles, lois...</p>
            </Link>

            <Link to="/admin/formations" className="action-card">
              <span className="action-icon">🎓</span>
              <h3>Nouvelle formation</h3>
              <p>Créer une formation continue</p>
            </Link>

            <Link to="/admin/pharmaciens" className="action-card">
              <span className="action-icon">👨‍⚕️</span>
              <h3>Gérer les pharmaciens</h3>
              <p>Voir et modifier les pharmaciens</p>
            </Link>

            <Link to="/" className="action-card" target="_blank">
              <span className="action-icon">👁️</span>
              <h3>Voir le site</h3>
              <p>Aperçu public</p>
            </Link>
          </div>
        </section>

        {/* Recent Publications */}
        <section className="recent-section">
          <div className="section-header">
            <h2>📝 Publications récentes</h2>
            <Link to="/admin/resources" className="view-all-link">Tout voir →</Link>
          </div>

          <div className="recent-list">
            {recentItems.length === 0 ? (
              <div className="empty-state">
                <p>Aucune publication récente</p>
                <Link to="/admin/resources" className="btn-primary">Gérer les ressources</Link>
              </div>
            ) : (
              recentItems.map(item => (
                <div key={`${item.type}-${item._id}`} className="recent-item">
                  <div className="recent-item-icon">
                    {item.type === 'actualite' ? '📰' : 
                     item.type === 'communique' ? '📢' : 
                     item.type === 'formation' ? '🎓' : 
                     item.type === 'pharmacie' ? '🏥' : '📄'}
                  </div>
                  <div className="recent-item-content">
                    <h4>{item.title}</h4>
                    <div className="recent-item-meta">
                      <span className="item-type">
                        {item.type === 'actualite' ? 'Actualité' : 
                         item.type === 'communique' ? 'Communiqué' : 
                         item.type === 'formation' ? 'Formation' : 
                         item.type === 'pharmacie' ? 'Pharmacie' : 'Autre'}
                      </span>
                      <span className="item-date">
                        {item.publishedAt || item.date ? 
                          new Date(item.publishedAt || item.date).toLocaleDateString('fr-FR') : 
                          'Date inconnue'}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={item.type === 'actualite' || item.type === 'communique' ? `/admin/resources` : 
                        item.type === 'formation' ? `/admin/formations` : 
                        item.type === 'pharmacie' ? `/admin/pharmacies` : `/admin/resources`}
                    className="recent-item-action"
                  >
                    →
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Overview Stats */}
        <section className="overview-section">
          <h2>📊 Vue d'ensemble</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>📈 Contenu</h3>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Actualités publiées</span>
                  <span className="progress-value">{stats.actualites}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((stats.actualites / 50) * 100, 100)}%` }}></div>
                </div>
                <small>Objectif: 50 actualités minimum</small>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Communiqués</span>
                  <span className="progress-value">{stats.communiques}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: `${Math.min((stats.communiques / 30) * 100, 100)}%` }}></div>
                </div>
                <small>Objectif: 30 communiqués minimum</small>
              </div>
            </div>

            <div className="overview-card">
              <h3>👥 Membres</h3>
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
              <Link to="/admin/pharmaciens" className="card-link">Gérer les membres →</Link>
            </div>

            <div className="overview-card">
              <h3>🎓 Formations</h3>
              <div className="stat-row">
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.formations}</div>
                  <div className="stat-mini-label">Formations actives</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.articles + stats.lois + stats.decisions}</div>
                  <div className="stat-mini-label">Documents</div>
                </div>
              </div>
              <Link to="/admin/formations" className="card-link">Gérer les formations →</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;


