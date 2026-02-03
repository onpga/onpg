import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './Articles.css';

interface Simulation {
  _id: string;
  usage: string;
  ville: string;
  pays: string;
  budget: string;
  kitRecommande: {
    nom: string;
    prix: number;
  };
  status: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const Simulations = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, nouveau: 0, contacte: 0, converti: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchSimulations();
    fetchStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/simulations/all?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setSimulations(data.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/simulations/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats({
          total: data.stats.total,
          nouveau: data.stats.parStatut.nouveau,
          contacte: data.stats.parStatut.contacte,
          converti: data.stats.parStatut.converti
        });
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/simulations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSimulations();
        fetchStats();
      }
    } catch (error) {
      console.error('Erreur update:', error);
    }
  };

  const deleteSimulation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette simulation ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/simulations/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSimulations();
        fetchStats();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      nouveau: { text: '🆕 Nouveau', class: 'status-nouveau' },
      contacte: { text: '📞 Contacté', class: 'status-contacte' },
      converti: { text: '✅ Converti', class: 'status-converti' },
      archive: { text: '📁 Archivé', class: 'status-archive' }
    };
    return badges[status] || badges.nouveau;
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="simulations" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>🔧 Simulations Énergétiques</h1>
            <p>Gestion des simulations de kits solaires</p>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card blue">
            <div className="stat-icon">🔧</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total simulations</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <h3>{stats.nouveau}</h3>
              <p>Nouveaux</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">📞</div>
            <div className="stat-info">
              <h3>{stats.contacte}</h3>
              <p>Contactés</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.converti}</h3>
              <p>Convertis</p>
            </div>
          </div>
        </div>

        {/* Liste des simulations */}
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="articles-list">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Localisation</th>
                  <th>Usage</th>
                  <th>Kit recommandé</th>
                  <th>Budget</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {simulations.map((sim) => {
                  const badge = getStatusBadge(sim.status);
                  return (
                    <tr key={sim._id}>
                      <td>{new Date(sim.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>{sim.ville}, {sim.pays}</td>
                      <td>
                        <span className="badge-usage">{sim.usage}</span>
                      </td>
                      <td>
                        <strong>{sim.kitRecommande?.nom || 'N/A'}</strong>
                        <br />
                        <small>{sim.kitRecommande?.prix?.toLocaleString()} FCFA</small>
                      </td>
                      <td>{parseInt(sim.budget).toLocaleString()} FCFA</td>
                      <td>
                        {sim.user?.email ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {sim.user.name && (
                              <div><strong style={{ color: '#002F6C' }}>{sim.user.name}</strong></div>
                            )}
                            <div>
                              <a href={`mailto:${sim.user.email}`} style={{ color: '#002F6C', textDecoration: 'none' }}>
                                📧 {sim.user.email}
                              </a>
                            </div>
                            {sim.user.phone && (
                              <div>
                                <a href={`tel:${sim.user.phone}`} style={{ color: '#002F6C', textDecoration: 'none' }}>
                                  📞 {sim.user.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#999', fontStyle: 'italic' }}>Anonyme</span>
                        )}
                      </td>
                      <td>
                        <select
                          value={sim.status}
                          onChange={(e) => updateStatus(sim._id, e.target.value)}
                          className={`status-select ${badge.class}`}
                        >
                          <option value="nouveau">🆕 Nouveau</option>
                          <option value="contacte">📞 Contacté</option>
                          <option value="converti">✅ Converti</option>
                          <option value="archive">📁 Archivé</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => deleteSimulation(sim._id)}
                            className="btn-delete"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {simulations.length === 0 && (
              <div className="empty-state">
                <p>Aucune simulation pour le moment</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Simulations;

