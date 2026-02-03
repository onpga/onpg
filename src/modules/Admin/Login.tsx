import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        // Stocker le token
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        // Rediriger vers le dashboard
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="login-header">
            <img src="/CIPS_logo_noir_HD_transparent.png" alt="CIPS Logo" className="login-logo" />
            <h1>Panneau d'administration</h1>
            <p>Connexion sécurisée</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                ❌ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '🔄 Connexion...' : '🔐 Se connecter'}
            </button>
          </form>

          {/* Info */}
          <div className="login-footer">
            <p className="login-info">
              🔒 Connexion sécurisée avec chiffrement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

