import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './IdeaBlocks.css';
import { useToast } from '../../components/Toast';

interface IdeaBlock {
  _id: string;
  title: string;
  description?: string;
  category: string;
  pole: string;
  priority: number;
  status: 'new' | 'in_progress' | 'converted' | 'rejected';
  suggestedDate?: string;
  tags?: string[];
  notes?: string;
  articleId?: {
    _id: string;
    title: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

const IdeaBlocks = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [ideaBlocks, setIdeaBlocks] = useState<IdeaBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Champ rapide pour créer une idée
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('pedagogique');

  useEffect(() => {
    checkAuth();
    fetchIdeaBlocks();
  }, []);

  useEffect(() => {
    fetchIdeaBlocks();
  }, [filterStatus, filterCategory]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchIdeaBlocks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      let url = '/api/idea-blocks?';
      if (filterStatus !== 'all') url += `status=${filterStatus}&`;
      if (filterCategory !== 'all') url += `category=${filterCategory}&`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIdeaBlocks(data.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Création rapide d'une idée (juste avec le titre)
  const handleQuickCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickTitle.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/idea-blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: quickTitle.trim(),
          category: quickCategory,
          status: 'new'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQuickTitle('');
        fetchIdeaBlocks();
        showSuccess('Bloc d\'idée créé avec succès');
      } else {
        showError(data.error || data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de la création rapide');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bloc d\'idée ?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/idea-blocks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        showSuccess('Bloc d\'idée supprimé avec succès');
        fetchIdeaBlocks();
      } else {
        showError(data.error || data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de la suppression');
    }
  };

  const handleConvertToArticle = async (id: string) => {
    const ideaBlock = ideaBlocks.find(b => b._id === id);
    if (!ideaBlock) return;

    // Confirmation simple
    if (!confirm(`Convertir "${ideaBlock.title}" en article brouillon ?\n\nVous serez redirigé vers l'édition de l'article.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/idea-blocks/${id}/convert`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success && data.data.article) {
        showSuccess('Bloc d\'idée converti en article avec succès');
        // Rediriger directement vers l'édition de l'article (brouillon pré-rempli)
        setTimeout(() => navigate(`/admin/articles/edit/${data.data.article._id}`), 1000);
      } else {
        showError(data.error || data.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de la conversion. Veuillez réessayer.');
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#2196F3';
      case 'in_progress': return '#FF9800';
      case 'converted': return '#4CAF50';
      case 'rejected': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'in_progress': return 'En cours';
      case 'converted': return 'Converti';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };


  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="calendar" />
      
      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>💡 Blocs d'Idées</h1>
            <p>Gérez vos idées d'articles et convertissez-les en articles publiés</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin/calendar" className="btn-secondary">
              ← Retour au calendrier
            </Link>
          </div>
        </header>

        {/* Champ rapide pour créer une idée */}
        <div className="quick-create-box">
          <form onSubmit={handleQuickCreate} className="quick-create-form">
            <input
              type="text"
              placeholder="💡 Nouvelle idée... (appuyez sur Entrée pour créer)"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="quick-create-input"
              autoFocus
            />
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="quick-create-category"
              title="Catégorie"
            >
              <option value="pedagogique">Pédagogique</option>
              <option value="actualites">Actualités</option>
              <option value="comparatifs">Comparatifs</option>
              <option value="innovations">Innovations</option>
              <option value="communiques">Communiqués</option>
              <option value="partenariats">Partenariats</option>
            </select>
            <button type="submit" className="quick-create-btn" disabled={!quickTitle.trim()}>
              ➕
            </button>
          </form>
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
            💡 Simple : Tapez votre idée, choisissez une catégorie, puis appuyez sur Entrée. Pour créer l'article, cliquez sur "✨ Convertir" → vous serez redirigé vers l'édition avec le titre et la catégorie pré-remplis.
          </small>
        </div>

        {/* Filtres */}
        <div className="filters-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveau</option>
            <option value="in_progress">En cours</option>
            <option value="converted">Converti</option>
            <option value="rejected">Rejeté</option>
          </select>
          
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
            <option value="all">Toutes les catégories</option>
            <option value="pedagogique">Pédagogique</option>
            <option value="actualites">Actualités</option>
            <option value="comparatifs">Comparatifs</option>
            <option value="innovations">Innovations</option>
            <option value="communiques">Communiqués</option>
            <option value="partenariats">Partenariats</option>
          </select>
        </div>

        {/* Liste des blocs d'idées */}
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : ideaBlocks.length === 0 ? (
          <div className="empty-state">
            <p>💰 Aucun bloc d'idée pour le moment</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Utilisez le champ ci-dessus pour créer votre première idée rapidement !
            </p>
          </div>
        ) : (
          <div className="idea-blocks-grid">
            {ideaBlocks.map((block) => (
              <div key={block._id} className="idea-block-card">
                <div className="idea-block-header">
                  <div className="idea-block-title-row">
                    <h3>{block.title}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(block.status) }}
                    >
                      {getStatusLabel(block.status)}
                    </span>
                  </div>
                  <div className="idea-block-meta">
                    <span className="category-tag" title={`Catégorie: ${block.category}`}>
                      {block.category}
                    </span>
                  </div>
                </div>

                {block.articleId && (
                  <div className="converted-info">
                    ✅ Converti en : <Link to={`/admin/articles/edit/${block.articleId._id}`}>{block.articleId.title}</Link>
                  </div>
                )}

                {block.notes && (
                  <div className="idea-block-notes">
                    <strong>📝 Notes:</strong> {block.notes}
                  </div>
                )}

                <div className="idea-block-actions">
                  {block.status !== 'converted' && (
                    <button
                      onClick={() => handleConvertToArticle(block._id)}
                      className="btn-convert"
                      title="Créer un article brouillon à partir de cette idée"
                    >
                      ✨ Convertir en article
                    </button>
                  )}
                  {block.status === 'converted' && block.articleId && (
                    <Link 
                      to={`/admin/articles/edit/${block.articleId._id}`}
                      className="btn-convert"
                      style={{ textDecoration: 'none', display: 'inline-block' }}
                    >
                      📝 Voir l'article
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(block._id)}
                    className="btn-delete"
                    title="Supprimer cette idée"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default IdeaBlocks;

