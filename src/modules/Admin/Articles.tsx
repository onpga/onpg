import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { useToast } from '../../components/Toast';
import './Articles.css';
import './Dashboard.css';

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  pole: string;
  publishedAt: string;
  visibleFrom?: string;
  visibleUntil?: string;
  status: string;
  featured: boolean;
  views: number;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    checkAuth();
    fetchArticles();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/articles?all=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchArticles();
        showSuccess('Article supprimé avec succès');
      } else {
        showError('Erreur lors de la suppression');
      }
    } catch (error) {
      showError('Erreur de connexion');
    }
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => a.category === filter);

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="articles" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>📰 Gestion des articles</h1>
            <p>{articles.length} articles au total</p>
          </div>
          <Link to="/admin/articles/new" className="btn-primary">
            ➕ Nouvel article
          </Link>
        </header>

        {/* Filtres */}
        <div className="filters-bar">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            Tous ({articles.length})
          </button>
          <button onClick={() => setFilter('pedagogique')} className={filter === 'pedagogique' ? 'active' : ''}>
            Guides
          </button>
          <button onClick={() => setFilter('actualites')} className={filter === 'actualites' ? 'active' : ''}>
            Actualités
          </button>
          <button onClick={() => setFilter('comparatifs')} className={filter === 'comparatifs' ? 'active' : ''}>
            Comparatifs
          </button>
          <button onClick={() => setFilter('innovations')} className={filter === 'innovations' ? 'active' : ''}>
            Innovations
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th>Vues</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map(article => (
                  <tr key={article._id}>
                    <td>
                      <div className="article-cell">
                        {article.featured && <span className="badge-featured">⭐</span>}
                        <strong>{article.title}</strong>
                      </div>
                    </td>
                    <td><span className="badge">{article.category}</span></td>
                    <td>
                      {article.visibleFrom ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                          {(() => {
                            const now = new Date();
                            const visibleFrom = new Date(article.visibleFrom);
                            const visibleUntil = article.visibleUntil ? new Date(article.visibleUntil) : null;
                            
                            if (article.status !== 'published') {
                              return <span style={{ fontSize: '11px', color: '#d32f2f' }}>❌ Non publié</span>;
                            } else if (visibleFrom > now) {
                              return (
                                <span style={{ fontSize: '11px', color: '#ed6c02' }}>
                                  ⏳ {visibleFrom.toLocaleDateString('fr-FR')} à {visibleFrom.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              );
                            } else if (visibleUntil && visibleUntil < now) {
                              return <span style={{ fontSize: '11px', color: '#d32f2f' }}>❌ Expiré</span>;
                            } else {
                              return <span style={{ fontSize: '11px', color: '#2e7d32' }}>✅ Visible</span>;
                            }
                          })()}
                        </div>
                      ) : (
                        new Date(article.publishedAt).toLocaleDateString('fr-FR')
                      )}
                    </td>
                    <td>{article.views}</td>
                    <td>
                      {(() => {
                        const now = new Date();
                        const visibleFrom = article.visibleFrom ? new Date(article.visibleFrom) : null;
                        const visibleUntil = article.visibleUntil ? new Date(article.visibleUntil) : null;
                        
                        if (article.status !== 'published') {
                          return (
                            <span className="status-badge draft">
                              📝 Brouillon
                            </span>
                          );
                        } else if (visibleFrom && visibleFrom > now) {
                          return (
                            <span className="status-badge published" style={{ backgroundColor: '#ed6c02', color: 'white' }}>
                              ⏳ Programmée
                            </span>
                          );
                        } else if (visibleUntil && visibleUntil < now) {
                          return (
                            <span className="status-badge draft" style={{ backgroundColor: '#d32f2f', color: 'white' }}>
                              ❌ Expirée
                            </span>
                          );
                        } else {
                          return (
                            <span className="status-badge published">
                              ✅ Publié
                            </span>
                          );
                        }
                      })()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/actualites/${article.slug}`} target="_blank" className="btn-icon" title="Voir">
                          👁️
                        </Link>
                        <Link to={`/admin/articles/edit/${article._id}`} className="btn-icon" title="Modifier">
                          ✏️
                        </Link>
                        <button onClick={() => deleteArticle(article._id)} className="btn-icon danger" title="Supprimer">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Articles;

