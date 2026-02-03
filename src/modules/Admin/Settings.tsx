import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Settings.css';
import './Dashboard.css';

const Settings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Mot de passe modifié avec succès !' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors du changement' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="settings" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>⚙️ Paramètres</h1>
            <p>Gestion de votre compte administrateur</p>
          </div>
        </header>

        <div className="settings-container">
          <div className="settings-card">
            <h2>🔐 Changer le mot de passe</h2>
            <p className="card-subtitle">Pour votre sécurité, changez régulièrement votre mot de passe</p>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
                <small>Minimum 6 caractères</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '🔄 Modification...' : '💾 Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

