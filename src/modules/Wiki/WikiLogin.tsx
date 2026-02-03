import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './WikiLogin.css';

const WikiLogin = () => {
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
        // Stocker le token pour le wiki
        localStorage.setItem('wiki_token', data.token);
        localStorage.setItem('wiki_user', JSON.stringify(data.user));
        
        // Rediriger vers le dashboard du wiki
        navigate('/wiki');
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
    <div className="wiki-login-page">
      <div className="wiki-login-container">
        <div className="wiki-login-card">
          {/* Logo */}
          <div className="wiki-login-header">
            <img src="/CIPS_logo_noir_HD_transparent.png" alt="CIPS Logo" className="wiki-login-logo" />
            <h1>Wiki Documentation</h1>
            <p>Centre de documentation CIPS</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="wiki-login-form">
            {error && (
              <div className="wiki-login-error">
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

            <button type="submit" className="wiki-login-btn" disabled={loading}>
              {loading ? '🔄 Connexion...' : '🔐 Se connecter'}
            </button>
          </form>

          {/* Info */}
          <div className="wiki-login-footer">
            <p className="wiki-login-info">
              🔒 Accès sécurisé à la documentation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiLogin;

