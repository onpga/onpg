import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Settings.css';
import './Dashboard.css';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Credentials Cloudinary en dur
const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET = 'onpg_uploads';

const Settings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [siteImages, setSiteImages] = useState({
    // On initialise avec les mêmes valeurs par défaut que la page d'accueil,
    // pour que l'admin voie immédiatement ce qui est utilisé sur le site.
    presidentPhoto: ONPG_IMAGES.president,
    heroImage: ONPG_IMAGES.hero1
  });
  const [uploadingPresident, setUploadingPresident] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
    loadSiteImages();
  }, [navigate]);

  const loadSiteImages = async () => {
    try {
      console.log('[ADMIN SETTINGS] Chargement des images du site...');
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/site-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('[ADMIN SETTINGS] Réponse /admin/site-settings:', data);
        if (data.success && data.data) {
          addLog('Images chargées depuis la base (site-settings)');
          setSiteImages({
            // Si rien n'est encore enregistré en base, on garde les images par défaut
            presidentPhoto: data.data.presidentPhoto || ONPG_IMAGES.president,
            heroImage: data.data.heroImage || ONPG_IMAGES.hero1
          });
        } else {
          addLog('Aucune image personnalisée trouvée, utilisation des valeurs par défaut');
          console.log('[ADMIN SETTINGS] Données site-settings absentes ou invalides, images par défaut utilisées.');
        }
      } else {
        console.warn('[ADMIN SETTINGS] HTTP error sur /admin/site-settings:', response.status, response.statusText);
        addLog(`Erreur HTTP ${response.status} lors du chargement des images du site`);
      }
    } catch (error) {
      console.error('Erreur chargement images site:', error);
      addLog('Erreur lors du chargement des images du site');
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setUploadLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  const uploadToCloudinary = async (file: File, type: 'president' | 'hero'): Promise<string | null> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      addLog('Configuration Cloudinary manquante');
      return null;
    }

    try {
      addLog(`Début upload ${type === 'president' ? 'photo président' : 'image hero'}...`);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        addLog(`Erreur HTTP ${response.status}: ${JSON.stringify(errorData)}`);
        return null;
      }

      const data = await response.json();
      if (data.secure_url) {
        addLog(`Upload réussi: ${data.secure_url.substring(0, 50)}...`);
        return data.secure_url;
      } else {
        addLog(`Pas d'URL dans la réponse: ${JSON.stringify(data)}`);
        return null;
      }
    } catch (error: any) {
      addLog(`Erreur upload: ${error.message || error}`);
      console.error('Erreur upload Cloudinary:', error);
      return null;
    }
  };

  const handlePresidentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPresident(true);
    addLog(`Sélection photo président: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    const url = await uploadToCloudinary(file, 'president');
    if (url) {
      setSiteImages(prev => ({ ...prev, presidentPhoto: url }));
      await saveSiteImages({ ...siteImages, presidentPhoto: url });
    }
    setUploadingPresident(false);
    e.target.value = '';
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    addLog(`Sélection image hero: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    const url = await uploadToCloudinary(file, 'hero');
    if (url) {
      setSiteImages(prev => ({ ...prev, heroImage: url }));
      await saveSiteImages({ ...siteImages, heroImage: url });
    }
    setUploadingHero(false);
    e.target.value = '';
  };

  const saveSiteImages = async (images: { presidentPhoto: string; heroImage: string }) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(images)
      });

      const data = await response.json();
      if (data.success) {
        addLog('Images sauvegardées avec succès');
        setMessage({ type: 'success', text: 'Images sauvegardées avec succès.' });
      } else {
        addLog(`Erreur sauvegarde: ${data.error || 'Erreur inconnue'}`);
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la sauvegarde' });
      }
    } catch (error: any) {
      addLog(`Erreur réseau: ${error.message || error}`);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    }
  };

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
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès.' });
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
            <h1>Paramètres</h1>
            <p>Gestion de votre compte administrateur</p>
          </div>
        </header>

        <div className="settings-container">
          <div className="settings-card">
            <h2>Photos de la page d'accueil</h2>
            <p className="card-subtitle">Gérez les photos visibles sur la page d'accueil du site</p>

            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="presidentPhoto">Photo de la présidente</label>
                <div style={{ marginBottom: '1rem' }}>
                  {siteImages.presidentPhoto && (
                    <img
                      src={siteImages.presidentPhoto}
                      alt="Photo présidente"
                      style={{
                        width: '200px',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}
                    />
                  )}
                  <input
                    type="file"
                    id="presidentPhoto"
                    accept="image/*"
                    onChange={handlePresidentPhotoUpload}
                    disabled={uploadingPresident}
                    style={{ marginTop: '0.5rem' }}
                  />
                  {uploadingPresident && <p style={{ color: '#666', fontSize: '0.9rem' }}>Upload en cours...</p>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="heroImage">Image Hero (bannière principale)</label>
                <div style={{ marginBottom: '1rem' }}>
                  {siteImages.heroImage && (
                    <img
                      src={siteImages.heroImage}
                      alt="Image hero"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}
                    />
                  )}
                  <input
                    type="file"
                    id="heroImage"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    disabled={uploadingHero}
                    style={{ marginTop: '0.5rem' }}
                  />
                  {uploadingHero && <p style={{ color: '#666', fontSize: '0.9rem' }}>Upload en cours...</p>}
                </div>
              </div>

              {uploadLogs.length > 0 && (
                <div className="form-group">
                  <label>Logs d'upload</label>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '1rem',
                      borderRadius: '8px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    {uploadLogs.map((log, idx) => (
                      <div key={idx} style={{ marginBottom: '0.25rem' }}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="settings-card">
            <h2>Changer le mot de passe</h2>
            <p className="card-subtitle">Pour votre sécurité, changez régulièrement votre mot de passe</p>

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
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

