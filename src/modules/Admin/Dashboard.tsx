import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

interface Stats {
  articles: number;
  projects: number;
  jobs: number;
  applications: number;
}

interface RecentItem {
  _id: string;
  title: string;
  type: 'article' | 'project';
  publishedAt: string;
  views?: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ articles: 0, projects: 0, jobs: 0, applications: 0 });
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
      const [articles, projects, jobs, applications] = await Promise.all([
        fetch('/api/articles').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/jobs').then(r => r.json()),
        fetch('/api/applications').then(r => r.json())
      ]);

      setStats({
        articles: articles.count || 0,
        projects: projects.count || 0,
        jobs: jobs.count || 0,
        applications: applications.count || 0
      });

      // Récupérer les items récents
      const allItems: RecentItem[] = [
        ...(articles.data || []).slice(0, 5).map((a: any) => ({ 
          _id: a._id, 
          title: a.title, 
          type: 'article' as const, 
          publishedAt: a.publishedAt,
          views: a.views 
        })),
        ...(projects.data || []).slice(0, 5).map((p: any) => ({ 
          _id: p._id, 
          title: p.title, 
          type: 'project' as const, 
          publishedAt: p.date 
        }))
      ];

      // Trier par date
      allItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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
                <h3>{stats.articles}</h3>
                <p>Articles publiés</p>
              </div>
              <Link to="/admin/articles" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">🗂️</div>
              <div className="stat-info">
                <h3>{stats.projects}</h3>
                <p>Projets réalisés</p>
              </div>
              <Link to="/admin/projects" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <h3>{stats.jobs}</h3>
                <p>Offres d'emploi</p>
              </div>
              <Link to="/admin/jobs" className="stat-link">Gérer →</Link>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">📧</div>
              <div className="stat-info">
                <h3>{stats.applications}</h3>
                <p>Candidatures</p>
              </div>
              <Link to="/admin/jobs" className="stat-link">Voir →</Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2>Actions rapides</h2>
          <div className="actions-grid">
            <Link to="/admin/articles/new" className="action-card">
              <span className="action-icon">➕</span>
              <h3>Nouvel article</h3>
              <p>Créer un article de blog</p>
            </Link>

            <Link to="/admin/projects/new" className="action-card">
              <span className="action-icon">➕</span>
              <h3>Nouveau projet</h3>
              <p>Ajouter une réalisation</p>
            </Link>

            <Link to="/admin/calendar" className="action-card">
              <span className="action-icon">📅</span>
              <h3>Calendrier</h3>
              <p>Planifier les publications</p>
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
            <Link to="/admin/calendar" className="view-all-link">Tout voir →</Link>
          </div>

          <div className="recent-list">
            {recentItems.length === 0 ? (
              <div className="empty-state">
                <p>Aucune publication pour le moment</p>
                <Link to="/admin/articles/new" className="btn-primary">Créer un article</Link>
              </div>
            ) : (
              recentItems.map(item => (
                <div key={`${item.type}-${item._id}`} className="recent-item">
                  <div className="recent-item-icon">
                    {item.type === 'article' ? '📰' : '🗂️'}
                  </div>
                  <div className="recent-item-content">
                    <h4>{item.title}</h4>
                    <div className="recent-item-meta">
                      <span className="item-type">
                        {item.type === 'article' ? 'Article' : 'Projet'}
                      </span>
                      <span className="item-date">
                        {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                      </span>
                      {item.views !== undefined && (
                        <span className="item-views">👁️ {item.views} vues</span>
                      )}
                    </div>
                  </div>
                  <Link 
                    to={item.type === 'article' ? `/admin/articles` : `/admin/projects`}
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
              <h3>📈 Performance</h3>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Articles publiés</span>
                  <span className="progress-value">{stats.articles}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min((stats.articles / 24) * 100, 100)}%` }}></div>
                </div>
                <small>Objectif: 24 articles (calendrier éditorial)</small>
              </div>

              <div className="progress-item">
                <div className="progress-label">
                  <span>Projets en vitrine</span>
                  <span className="progress-value">{stats.projects}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill green" style={{ width: `${Math.min((stats.projects / 12) * 100, 100)}%` }}></div>
                </div>
                <small>Objectif: 12 projets minimum</small>
              </div>
            </div>

            <div className="overview-card">
              <h3>💼 Recrutement</h3>
              <div className="stat-row">
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.jobs}</div>
                  <div className="stat-mini-label">Offres actives</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-mini-value">{stats.applications}</div>
                  <div className="stat-mini-label">Candidatures</div>
                </div>
              </div>
              <Link to="/admin/jobs" className="card-link">Gérer les offres →</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

