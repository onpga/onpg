import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useToast } from '../../../components/Toast';
import '../Dashboard.css';
import './Projects.css';

interface Project {
  _id: string;
  title: string;
  pole: string;
  location: { city: string };
  date: string;
  status: string;
  featured: boolean;
  published: boolean;
  mainImage: string;
  visibleFrom?: string;
  visibleUntil?: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ pole: '', status: '', featured: '' });
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const poles = [
    { id: '', label: 'Tous les pôles' },
    { id: 'energie', label: 'Énergie' },
    { id: 'geospatial', label: 'Géospatial' },
    { id: 'drone', label: 'Drones' },
    { id: 'sante', label: 'Santé' },
    { id: 'securite', label: 'Sécurité' }
  ];

  const statuses = [
    { id: '', label: 'Tous les statuts' },
    { id: 'termine', label: 'Terminé' },
    { id: 'en_cours', label: 'En cours' },
    { id: 'pilote', label: 'Pilote' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('all', 'true'); // Récupérer tous les projets pour l'admin
      if (filter.pole) params.append('pole', filter.pole);
      if (filter.status) params.append('status', filter.status);
      if (filter.featured) params.append('featured', filter.featured);

      const response = await fetch(`/api/projects?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showSuccess('Projet supprimé avec succès');
        fetchProjects();
      } else {
        showError('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      showError('Erreur lors de la suppression');
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      });

      if (response.ok) {
        fetchProjects();
        showSuccess(`Projet ${!currentFeatured ? 'mis en vedette' : 'retiré de la vedette'} avec succès`);
      } else {
        showError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      showError('Erreur lors de la mise à jour');
    }
  };

  const togglePublished = async (id: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: !currentPublished })
      });

      if (response.ok) {
        fetchProjects();
        showSuccess(`Projet ${!currentPublished ? 'publié' : 'dépublié'} avec succès`);
      } else {
        showError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      showError('Erreur lors de la mise à jour');
    }
  };

  const getPoleLabel = (pole: string) => {
    return poles.find(p => p.id === pole)?.label || pole;
  };

  const getStatusBadge = (status: string) => {
    const badges: {[key: string]: {label: string, color: string}} = {
      'termine': { label: 'Terminé', color: '#4ade80' },
      'en_cours': { label: 'En cours', color: '#FF8C42' },
      'pilote': { label: 'Pilote', color: '#60a5fa' }
    };
    return badges[status] || { label: status, color: '#999' };
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };


  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="projects" />

      <main className="dashboard-main">
        <div className="admin-projects-page">
        <div className="admin-header">
          <h1>Gestion des Projets</h1>
          <Link to="/admin/projects/new" className="btn btn-primary">
            + Nouveau Projet
          </Link>
        </div>

        {/* Filtres */}
        <div className="admin-filters">
          <select
            value={filter.pole}
            onChange={(e) => setFilter({ ...filter, pole: e.target.value })}
            className="filter-select"
          >
            {poles.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="filter-select"
          >
            {statuses.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <select
            value={filter.featured}
            onChange={(e) => setFilter({ ...filter, featured: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous</option>
            <option value="true">Mis en avant</option>
            <option value="false">Standard</option>
          </select>
        </div>

        {/* Liste des projets */}
        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const statusBadge = getStatusBadge(project.status);
              
              return (
                <div key={project._id} className="project-card">
                  <div className="project-image">
                    <img src={project.mainImage} alt={project.title} />
                    {project.featured && (
                      <span className="featured-badge">Mis en avant</span>
                    )}
                    {!project.published && (
                      <span className="draft-badge">Brouillon</span>
                    )}
                  </div>

                  <div className="project-content">
                    <h3>{project.title}</h3>
                    
                    <div className="project-meta">
                      <span className="meta-pole">{getPoleLabel(project.pole)}</span>
                      <span 
                        className="meta-status"
                        style={{ backgroundColor: statusBadge.color }}
                      >
                        {statusBadge.label}
                      </span>
                      {(() => {
                        const now = new Date();
                        const visibleFrom = project.visibleFrom ? new Date(project.visibleFrom) : null;
                        const visibleUntil = project.visibleUntil ? new Date(project.visibleUntil) : null;
                        
                        if (!project.published) {
                          return (
                            <span 
                              className="meta-status"
                              style={{ backgroundColor: '#d32f2f', color: 'white', marginLeft: '0.5rem' }}
                            >
                              ❌ Non publié
                            </span>
                          );
                        } else if (visibleFrom && visibleFrom > now) {
                          return (
                            <span 
                              className="meta-status"
                              style={{ backgroundColor: '#ed6c02', color: 'white', marginLeft: '0.5rem' }}
                            >
                              ⏳ Programmée
                            </span>
                          );
                        } else if (visibleUntil && visibleUntil < now) {
                          return (
                            <span 
                              className="meta-status"
                              style={{ backgroundColor: '#d32f2f', color: 'white', marginLeft: '0.5rem' }}
                            >
                              ❌ Expirée
                            </span>
                          );
                        } else {
                          return (
                            <span 
                              className="meta-status"
                              style={{ backgroundColor: '#2e7d32', color: 'white', marginLeft: '0.5rem' }}
                            >
                              ✅ Visible
                            </span>
                          );
                        }
                      })()}
                    </div>

                    <div className="project-info">
                      <span>{project.location.city}</span>
                      <span>{new Date(project.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {project.visibleFrom && (
                      <div className="project-visibility" style={{ 
                        marginTop: '0.5rem', 
                        fontSize: '13px', 
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {(() => {
                          const now = new Date();
                          const visibleFrom = new Date(project.visibleFrom);
                          const visibleUntil = project.visibleUntil ? new Date(project.visibleUntil) : null;
                          
                          if (!project.published) {
                            return <span style={{ color: '#d32f2f' }}>❌ Non publié</span>;
                          } else if (visibleFrom > now) {
                            return (
                              <span style={{ color: '#ed6c02' }}>
                                ⏳ Programmée: {visibleFrom.toLocaleDateString('fr-FR')} à {visibleFrom.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            );
                          } else if (visibleUntil && visibleUntil < now) {
                            return <span style={{ color: '#d32f2f' }}>❌ Expiré</span>;
                          } else {
                            return <span style={{ color: '#2e7d32' }}>✅ Visible</span>;
                          }
                        })()}
                      </div>
                    )}

                    <div className="project-actions">
                      <button
                        className={`btn-toggle ${project.featured ? 'active' : ''}`}
                        onClick={() => toggleFeatured(project._id, project.featured)}
                        title="Mettre en avant"
                      >
                        ★
                      </button>
                      
                      <button
                        className={`btn-toggle ${project.published ? 'active' : ''}`}
                        onClick={() => togglePublished(project._id, project.published)}
                        title="Publier/Dépublier"
                      >
                        {project.published ? '👁️' : '👁️‍🗨️'}
                      </button>

                      <Link
                        to={`/realisations/${project._id}`}
                        target="_blank"
                        className="btn-icon"
                        title="Voir"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '4px', backgroundColor: '#f0f0f0', color: '#333', marginRight: '0.5rem' }}
                      >
                        👁️
                      </Link>

                      <Link
                        to={`/admin/projects/edit/${project._id}`}
                        className="btn-edit"
                      >
                        Modifier
                      </Link>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(project._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="empty-state">
            <p>Aucun projet trouvé</p>
            <Link to="/admin/projects/new" className="btn btn-primary">
              Créer un projet
            </Link>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default Projects;

