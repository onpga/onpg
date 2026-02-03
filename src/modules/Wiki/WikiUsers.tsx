import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import WikiSidebar from './components/WikiSidebar';
import './WikiUsers.css';
import './WikiDashboard.css';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const WikiUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('wiki_token');
    const userData = localStorage.getItem('wiki_user');
    
    if (!token || !userData) {
      navigate('/wiki/login');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/wiki');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('wiki_token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('wiki_token');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Utilisateur créé avec succès !' });
        setFormData({ username: '', email: '', password: '', role: 'viewer' });
        setShowForm(false);
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la création' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('wiki_token');
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Utilisateur supprimé avec succès !' });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

  return (
    <div className="wiki-dashboard-page">
      <WikiSidebar currentPage="users" />

      <main className="wiki-dashboard-main">
        <header className="wiki-page-header">
          <div>
            <h1>👥 Gestion des Utilisateurs</h1>
            <p>Créez et gérez les accès à la documentation</p>
          </div>
          <button className="wiki-btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '❌ Annuler' : '➕ Créer un utilisateur'}
          </button>
        </header>

        {message && (
          <div className={`wiki-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="wiki-form-card">
            <h2>Créer un nouvel utilisateur</h2>
            <form onSubmit={handleSubmit} className="wiki-user-form">
              <div className="wiki-form-group">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                  placeholder="julie"
                />
              </div>

              <div className="wiki-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="julie@cips-tech.ga"
                />
              </div>

              <div className="wiki-form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
                <small>Minimum 6 caractères</small>
              </div>

              <div className="wiki-form-group">
                <label>Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="viewer">Viewer - Lecture seule</option>
                  <option value="editor">Editor - Édition</option>
                  <option value="admin">Admin - Administration complète</option>
                </select>
              </div>

              <button type="submit" className="wiki-btn-primary" disabled={loading}>
                {loading ? '🔄 Création...' : '💾 Créer l\'utilisateur'}
              </button>
            </form>
          </div>
        )}

        <div className="wiki-users-list">
          <h2>Liste des utilisateurs ({users.length})</h2>
          <div className="wiki-users-table">
            {users.map((user) => (
              <div key={user._id} className="wiki-user-card">
                <div className="wiki-user-info">
                  <div className="wiki-user-avatar">👤</div>
                  <div>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                    <span className={`wiki-role-badge ${user.role}`}>
                      {user.role === 'admin' ? '🔑 Admin' : user.role === 'editor' ? '✏️ Editor' : '👁️ Viewer'}
                    </span>
                  </div>
                </div>
                <div className="wiki-user-actions">
                  <span className="wiki-user-date">
                    Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="wiki-btn-danger"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WikiUsers;

