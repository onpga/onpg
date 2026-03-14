import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import '../Admin/Dashboard.css';
import './PharmacienProfile.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET = 'onpg_uploads';

const PharmacienProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    telephone: '',
    adresse: '',
    photo: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordFormVisible, setPasswordFormVisible] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    setFormData({
      email: userData.email || '',
      telephone: userData.telephone || '',
      adresse: userData.adresse || '',
      photo: userData.photo || ''
    });

    // Rafraîchir les infos depuis l'API pour refléter les modifications admin
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL}/pharmacien/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-id': userData._id
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          const refreshedUser = { ...userData, ...data.data };
          setUser(refreshedUser);
          localStorage.setItem('admin_user', JSON.stringify(refreshedUser));
          setFormData({
            email: refreshedUser.email || '',
            telephone: refreshedUser.telephone || '',
            adresse: refreshedUser.adresse || '',
            photo: refreshedUser.photo || ''
          });
        }
      } catch (error) {
        console.error('Erreur chargement profil pharmacien:', error);
      }
    };
    loadProfile();
  }, [navigate]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMessage({ type: 'error', text: 'Configuration Cloudinary manquante' });
      return;
    }

    setUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, photo: data.secure_url }));
        setMessage({ type: 'success', text: 'Photo uploadee avec succes' });
      } else {
        setMessage({ type: 'error', text: "Erreur lors de l'upload de la photo" });
      }
    } catch (err) {
      console.error('Erreur upload Cloudinary:', err);
      setMessage({ type: 'error', text: "Erreur lors de l'upload de la photo" });
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('admin_token');
      const userId = user._id;

      const response = await fetch(`${API_URL}/pharmacien/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));
        setMessage({ type: 'success', text: 'Profil mis a jour avec succes !' });
        setEditing(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise a jour' });
      }
    } catch (error) {
      console.error('Erreur mise a jour profil:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    setMessage(null);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs de mot de passe.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe et la confirmation ne correspondent pas.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caracteres.' });
      return;
    }

    try {
      setPasswordSaving(true);
      const token = localStorage.getItem('admin_token');
      const userId = user._id;

      const response = await fetch(`${API_URL}/pharmacien/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Mot de passe mis a jour avec succes.' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordFormVisible(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise a jour du mot de passe.' });
      }
    } catch (error) {
      console.error('Erreur mise a jour mot de passe:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="profile" />
      <main className="admin-main pharmacien-profile-page">
        <div className="admin-content pharmacien-profile-content">
          <h1 className="pharmacien-profile-title">Mon profil pharmacien</h1>

          <div className="profile-section pharmacien-profile-card">
            <div className="pharmacien-profile-section-head">
              <h2>Informations personnelles</h2>
              {!editing && (
                <button className="btn-primary" onClick={() => setEditing(true)}>
                  Modifier
                </button>
              )}
            </div>

            {message && (
              <div className={`pharmacien-profile-message ${message.type}`}>
                {message.text}
              </div>
            )}

            {editing ? (
              <div className="profile-edit-form pharmacien-profile-form">
                <div className="form-group pharmacien-form-group">
                  <label>Photo de profil</label>
                  <div className="pharmacien-photo-upload">
                    {formData.photo && (
                      <img
                        src={formData.photo}
                        alt="Photo de profil"
                        className="pharmacien-photo-preview"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="pharmacien-file-input"
                    />
                    {uploadingPhoto && <p className="pharmacien-uploading-text">Upload en cours...</p>}
                  </div>
                </div>

                <div className="form-group pharmacien-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pharmacien-input"
                  />
                </div>

                <div className="form-group pharmacien-form-group">
                  <label htmlFor="telephone">Telephone</label>
                  <input
                    type="tel"
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="pharmacien-input"
                  />
                </div>

                <div className="form-group pharmacien-form-group">
                  <label htmlFor="adresse">Adresse</label>
                  <textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    rows={3}
                    className="pharmacien-input"
                  />
                </div>

                <div className="pharmacien-btn-row">
                  <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        email: user.email || '',
                        telephone: user.telephone || '',
                        adresse: user.adresse || '',
                        photo: user.photo || ''
                      });
                      setMessage(null);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info pharmacien-profile-info">
                <div className="pharmacien-photo-view">
                  <img
                    src={user.photo || ONPG_IMAGES.logo}
                    alt="Photo de profil"
                    onError={(e) => { (e.target as HTMLImageElement).src = ONPG_IMAGES.logo; }}
                    className={`pharmacien-photo-view-image ${user.photo ? 'has-photo' : 'fallback-photo'}`}
                  />
                </div>
                <div className="pharmacien-profile-meta">
                  <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
                  <p><strong>Email :</strong> {user.email || 'Non renseigne'}</p>
                  <p><strong>Telephone :</strong> {user.telephone || 'Non renseigne'}</p>
                  <p><strong>Adresse :</strong> {user.adresse || 'Non renseignee'}</p>
                  <p><strong>Role :</strong> Pharmacien</p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section pharmacien-profile-card">
            <div className="pharmacien-profile-section-head">
              <h2>Mot de passe</h2>
              {!passwordFormVisible && (
                <button className="btn-primary" onClick={() => setPasswordFormVisible(true)}>
                  Modifier mon mot de passe
                </button>
              )}
            </div>

            {passwordFormVisible && (
              <div className="profile-edit-form pharmacien-profile-form">
                <div className="form-group pharmacien-form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pharmacien-input"
                  />
                </div>

                <div className="form-group pharmacien-form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pharmacien-input"
                  />
                </div>

                <div className="form-group pharmacien-form-group">
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pharmacien-input"
                  />
                </div>

                <div className="pharmacien-btn-row">
                  <button className="btn-primary" onClick={handlePasswordChange} disabled={passwordSaving}>
                    {passwordSaving ? 'Sauvegarde...' : 'Enregistrer le mot de passe'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setPasswordFormVisible(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacienProfile;
