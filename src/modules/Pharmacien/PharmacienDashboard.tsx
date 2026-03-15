import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import '../Admin/Dashboard.css';
import './PharmacienDashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

type PharmacienStats = {
  totalPharmacies: number;
  totalTheses: number;
  totalMessages: number;
};

const PharmacienDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PharmacienStats>({
    totalPharmacies: 0,
    totalTheses: 0,
    totalMessages: 0
  });

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
    void loadStats(userData);
  }, [navigate]);

  const loadStats = async (currentUser: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const userId = currentUser?._id;

      const response = await fetch(`${API_URL}/pharmacien/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId
        }
      });

      if (!response.ok) return;
      const data = await response.json();
      setStats({
        totalPharmacies: data.data?.totalPharmacies || 0,
        totalTheses: data.data?.totalTheses || 0,
        totalMessages: data.data?.totalMessages || 0
      });
    } catch (error) {
      console.error('Erreur chargement stats pharmacien:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  let displayFirstName = 'Pharmacien';
  if (user.prenoms) {
    displayFirstName = String(user.prenoms).split(' ')[0];
  } else if (user.username && String(user.username).length > 1) {
    const uname = String(user.username);
    const candidate = uname.slice(1);
    displayFirstName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
  } else if (user.username) {
    displayFirstName = String(user.username);
  }

  const quickActions = [
    {
      title: 'Mon profil',
      description: 'Modifier photo, telephone, adresse et mot de passe.',
      button: 'Ouvrir le profil',
      to: '/pharmacien/profile'
    },
    {
      title: 'Ma pharmacie',
      description: 'Gerer les informations de votre officine.',
      button: 'Gerer ma pharmacie',
      to: '/pharmacien/pharmacies'
    },
    {
      title: 'Mes theses',
      description: 'Publier vos theses PDF depuis l espace dedie.',
      button: 'Acceder aux theses',
      to: '/pharmacien/theses'
    },
    {
      title: 'Messages a l Ordre',
      description: 'Envoyer et consulter vos echanges.',
      button: 'Voir les messages',
      to: '/pharmacien/messages'
    }
  ];

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="dashboard" />
      <main className="admin-main pharmacien-dashboard-page">
        <div className="admin-content">
          <section className="pharmacien-hero">
            <div>
              <h1>Bonjour {displayFirstName}</h1>
              <p>Bienvenue dans votre espace professionnel.</p>
            </div>
            <img
              src={user.photo || ONPG_IMAGES.logo}
              alt="Photo du pharmacien"
              className="pharmacien-hero-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ONPG_IMAGES.logo;
              }}
            />
          </section>

          <section className="pharmacien-stats-grid">
            <article className="pharmacien-stat-card">
              <h3>Ma pharmacie</h3>
              <p>{loading ? '...' : stats.totalPharmacies}</p>
            </article>
            <article className="pharmacien-stat-card">
              <h3>Mes theses</h3>
              <p>{loading ? '...' : stats.totalTheses}</p>
            </article>
            <article className="pharmacien-stat-card">
              <h3>Messages envoyes</h3>
              <p>{loading ? '...' : stats.totalMessages}</p>
            </article>
          </section>

          <section className="pharmacien-quick-grid">
            {quickActions.map((action) => (
              <article key={action.to} className="pharmacien-quick-card">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate(action.to)}
                >
                  {action.button}
                </button>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PharmacienDashboard;






