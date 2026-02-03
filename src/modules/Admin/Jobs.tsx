import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { useToast } from '../../components/Toast';
import './Articles.css';
import './Dashboard.css';

interface Job {
  _id: string;
  titre: string;
  type: string;
  departement: string;
  localisation: string;
  actif: boolean;
  datePublication: string;
  dateExpiration?: string;
  priorite: number;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    checkAuth();
    fetchJobs();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/jobs?all=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchJobs();
        showSuccess('Offre supprimée avec succès');
      } else {
        showError('Erreur lors de la suppression');
      }
    } catch (error) {
      showError('Erreur de connexion');
    }
  };

  const toggleJobStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actif: !currentStatus })
      });

      if (response.ok) {
        fetchJobs();
        showSuccess(`Offre ${!currentStatus ? 'activée' : 'désactivée'} avec succès`);
      } else {
        showError('Erreur lors de la mise à jour');
      }
    } catch (error) {
      showError('Erreur lors de la mise à jour');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'active') return job.actif;
    if (filter === 'inactive') return !job.actif;
    return true;
  });

  const activeCount = jobs.filter(j => j.actif).length;
  const inactiveCount = jobs.filter(j => !j.actif).length;

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="jobs" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>💼 Gestion des offres d'emploi</h1>
            <p>{jobs.length} offres au total ({activeCount} actives)</p>
          </div>
          <Link to="/admin/jobs/new" className="btn-primary">
            ➕ Nouvelle offre
          </Link>
        </header>

        {/* Filtres */}
        <div className="filters-bar">
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'active' : ''}
          >
            Toutes ({jobs.length})
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={filter === 'active' ? 'active' : ''}
          >
            Actives ({activeCount})
          </button>
          <button 
            onClick={() => setFilter('inactive')} 
            className={filter === 'inactive' ? 'active' : ''}
          >
            Inactives ({inactiveCount})
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
                  <th>Type</th>
                  <th>Département</th>
                  <th>Localisation</th>
                  <th>Date publication</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                      Aucune offre d'emploi
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(job => (
                    <tr key={job._id}>
                      <td>
                        <div className="article-cell">
                          {job.priorite > 0 && <span className="badge-featured">🔥</span>}
                          <strong>{job.titre}</strong>
                        </div>
                      </td>
                      <td><span className="badge">{job.type}</span></td>
                      <td>{job.departement}</td>
                      <td>{job.localisation}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>{new Date(job.datePublication).toLocaleDateString('fr-FR')}</span>
                          {(() => {
                            const now = new Date();
                            const datePublication = new Date(job.datePublication);
                            const dateExpiration = job.dateExpiration ? new Date(job.dateExpiration) : null;
                            
                            if (!job.actif) {
                              return <span style={{ fontSize: '11px', color: '#d32f2f' }}>❌ Inactive</span>;
                            } else if (datePublication > now) {
                              return (
                                <span style={{ fontSize: '11px', color: '#ed6c02' }}>
                                  ⏳ {datePublication.toLocaleDateString('fr-FR')} à {datePublication.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              );
                            } else if (dateExpiration && dateExpiration < now) {
                              return <span style={{ fontSize: '11px', color: '#d32f2f' }}>❌ Expiré</span>;
                            } else {
                              return <span style={{ fontSize: '11px', color: '#2e7d32' }}>✅ Visible</span>;
                            }
                          })()}
                        </div>
                      </td>
                      <td>
                        {(() => {
                          const now = new Date();
                          const datePublication = new Date(job.datePublication);
                          const dateExpiration = job.dateExpiration ? new Date(job.dateExpiration) : null;
                          
                          if (!job.actif) {
                            return (
                              <span className="status-badge draft">
                                ⏸️ Inactive
                              </span>
                            );
                          } else if (datePublication > now) {
                            return (
                              <span className="status-badge published" style={{ backgroundColor: '#ed6c02', color: 'white' }}>
                                ⏳ Programmée
                              </span>
                            );
                          } else if (dateExpiration && dateExpiration < now) {
                            return (
                              <span className="status-badge draft" style={{ backgroundColor: '#d32f2f', color: 'white' }}>
                                ❌ Expirée
                              </span>
                            );
                          } else {
                            return (
                              <span className="status-badge published">
                                ✅ Active
                              </span>
                            );
                          }
                        })()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/carrieres/${job._id}`} 
                            target="_blank" 
                            className="btn-icon" 
                            title="Voir"
                          >
                            👁️
                          </Link>
                          <Link 
                            to={`/admin/jobs/edit/${job._id}`} 
                            className="btn-icon" 
                            title="Modifier"
                          >
                            ✏️
                          </Link>
                          <button 
                            onClick={() => toggleJobStatus(job._id, job.actif)} 
                            className="btn-icon" 
                            title={job.actif ? 'Désactiver' : 'Activer'}
                          >
                            {job.actif ? '⏸️' : '▶️'}
                          </button>
                          <button 
                            onClick={() => deleteJob(job._id)} 
                            className="btn-icon danger" 
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;

