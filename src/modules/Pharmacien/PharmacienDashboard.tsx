import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

const PharmacienDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalPharmacies: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (!storedUser) {
      navigate('/admin');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'pharmacien') {
      navigate('/admin');
      return;
    }

    setUser(userData);
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const userId = user?._id || JSON.parse(localStorage.getItem('admin_user') || '{}')._id;
      
      const response = await fetch(`${API_URL}/pharmacien/pharmacies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({ totalPharmacies: data.data?.length || 0 });
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="dashboard" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>Mon Profil</h1>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalPharmacies}</div>
                <div className="stat-label">Mes Pharmacies</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Informations personnelles</h2>
            <div className="profile-info">
              <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
              <p><strong>Email :</strong> {user.email || 'Non renseigné'}</p>
              <p><strong>Rôle :</strong> Pharmacien</p>
            </div>
          </div>

          <div className="quick-actions">
            <button 
              className="action-btn primary"
              onClick={() => navigate('/pharmacien/pharmacies')}
            >
              🏥 Gérer mes pharmacies
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacienDashboard;


