import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

const PharmacienDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<{ totalPharmacies: number; totalTheses?: number; totalMessages?: number }>({
    totalPharmacies: 0,
    totalTheses: 0,
    totalMessages: 0
  });
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
  const [theses, setTheses] = useState<any[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(false);
  const [thesisSaving, setThesisSaving] = useState(false);
  const [thesisForm, setThesisForm] = useState({
    titre: '',
    resume: '',
    annee: '',
    fichierUrl: ''
  });
  const [messageOrdre, setMessageOrdre] = useState({
    sujet: '',
    message: ''
  });
  const [sendingMessageOrdre, setSendingMessageOrdre] = useState(false);

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
    loadStats(userData);
    loadTheses(userData);
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
        setMessage({ type: 'success', text: 'Photo uploadée avec succès' });
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
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setEditing(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
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
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
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
        setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordFormVisible(false);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour du mot de passe.' });
      }
    } catch (error) {
      console.error('Erreur mise à jour mot de passe:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const loadStats = async (currentUser = user) => {
    try {
      const token = localStorage.getItem('admin_token');
      const userId = currentUser?._id || JSON.parse(localStorage.getItem('admin_user') || '{}')._id;
      
      const response = await fetch(`${API_URL}/pharmacien/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalPharmacies: data.data?.totalPharmacies || 0,
          totalTheses: data.data?.totalTheses || 0,
          totalMessages: data.data?.totalMessages || 0
        });
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadTheses = async (currentUser = user) => {
    try {
      setLoadingTheses(true);
      const token = localStorage.getItem('admin_token');
      const userId = currentUser?._id || JSON.parse(localStorage.getItem('admin_user') || '{}')._id;

      const response = await fetch(`${API_URL}/pharmacien/theses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTheses(data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement thèses:', error);
    } finally {
      setLoadingTheses(false);
    }
  };

  const handleThesisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMessage({ type: 'error', text: 'Configuration Cloudinary manquante pour l\'upload de thèse.' });
      return;
    }

    setThesisSaving(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setThesisForm(prev => ({ ...prev, fichierUrl: data.secure_url }));
        setMessage({ type: 'success', text: 'Fichier PDF de la thèse uploadé avec succès.' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de l\'upload du PDF.' });
      }
    } catch (err) {
      console.error('Erreur upload thèse:', err);
      setMessage({ type: 'error', text: 'Erreur lors de l\'upload du PDF.' });
    } finally {
      setThesisSaving(false);
      e.target.value = '';
    }
  };

  const handleThesisSave = async () => {
    setMessage(null);

    if (!thesisForm.titre || !thesisForm.fichierUrl) {
      setMessage({ type: 'error', text: 'Veuillez renseigner au minimum le titre et uploader le fichier PDF.' });
      return;
    }

    try {
      setThesisSaving(true);
      const token = localStorage.getItem('admin_token');
      const userId = user._id;

      const response = await fetch(`${API_URL}/pharmacien/theses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify(thesisForm)
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Thèse enregistrée avec succès.' });
        setThesisForm({
          titre: '',
          resume: '',
          annee: '',
          fichierUrl: ''
        });
        await loadTheses();
        await loadStats();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'enregistrement de la thèse.' });
      }
    } catch (error) {
      console.error('Erreur sauvegarde thèse:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setThesisSaving(false);
    }
  };

  const handleSendMessageOrdre = async () => {
    setMessage(null);

    if (!messageOrdre.sujet || !messageOrdre.message) {
      setMessage({ type: 'error', text: 'Veuillez renseigner le sujet et le message.' });
      return;
    }

    try {
      setSendingMessageOrdre(true);
      const token = localStorage.getItem('admin_token');
      const userId = user._id;

      const response = await fetch(`${API_URL}/pharmacien/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify(messageOrdre)
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Message envoyé à l\'Ordre avec succès.' });
        setMessageOrdre({ sujet: '', message: '' });
        await loadStats();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'envoi du message.' });
      }
    } catch (error) {
      console.error('Erreur envoi message ordre:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setSendingMessageOrdre(false);
    }
  };

  if (!user) return null;

  const displayFirstName =
    (user.prenoms && String(user.prenoms).split(' ')[0]) ||
    (user.username && String(user.username)) ||
    'Pharmacien';

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="dashboard" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>Bonjour {displayFirstName}</h1>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalPharmacies}</div>
                <div className="stat-label">Mes Pharmacies</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalTheses || 0}</div>
                <div className="stat-label">Mes Thèses</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalMessages || 0}</div>
                <div className="stat-label">Messages envoyés à l'Ordre</div>
              </div>
            </div>
          </div>

          <div id="profil" className="profile-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Informations personnelles</h2>
              {!editing && (
                <button 
                  className="action-btn primary"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Modifier
                </button>
              )}
            </div>

            {message && (
              <div className={`message ${message.type}`} style={{ marginBottom: '1rem' }}>
                {message.text}
              </div>
            )}

            {editing ? (
              <div className="profile-edit-form">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Photo de profil</label>
                  <div style={{ marginBottom: '1rem' }}>
                    {formData.photo && (
                      <img
                        src={formData.photo}
                        alt="Photo de profil"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          marginBottom: '0.5rem',
                          display: 'block',
                          border: '3px solid #00A651'
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    {uploadingPhoto && <p style={{ color: '#666', fontSize: '0.9rem' }}>⏳ Upload en cours...</p>}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="adresse">Adresse</label>
                  <textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    rows={3}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="action-btn primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? '💾 Sauvegarde...' : '💾 Enregistrer'}
                  </button>
                  <button 
                    className="action-btn"
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
              <div className="profile-info">
                <div style={{ marginBottom: '1rem' }}>
                  {user.photo && (
                    <img
                      src={user.photo}
                      alt="Photo de profil"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        marginBottom: '1rem',
                        border: '3px solid #00A651'
                      }}
                    />
                  )}
                </div>
                <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
                <p><strong>Email :</strong> {user.email || 'Non renseigné'}</p>
                <p><strong>Téléphone :</strong> {user.telephone || 'Non renseigné'}</p>
                <p><strong>Adresse :</strong> {user.adresse || 'Non renseignée'}</p>
                <p><strong>Rôle :</strong> Pharmacien</p>
              </div>
            )}
          </div>

          <div className="profile-section" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Mot de passe</h2>
              {!passwordFormVisible && (
                <button
                  className="action-btn primary"
                  onClick={() => setPasswordFormVisible(true)}
                >
                  🔒 Modifier mon mot de passe
                </button>
              )}
            </div>

            {passwordFormVisible && (
              <div className="profile-edit-form">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className="action-btn primary"
                    onClick={handlePasswordChange}
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? '🔒 Sauvegarde...' : '🔒 Enregistrer le mot de passe'}
                  </button>
                  <button
                    className="action-btn"
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

          <div id="theses" className="profile-section" style={{ marginTop: '2rem' }}>
            <h2>Mes Thèses (PDF)</h2>

            <div className="profile-edit-form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="thesisTitre">Titre de la thèse *</label>
                <input
                  type="text"
                  id="thesisTitre"
                  value={thesisForm.titre}
                  onChange={(e) => setThesisForm({ ...thesisForm, titre: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="thesisAnnee">Année</label>
                <input
                  type="text"
                  id="thesisAnnee"
                  placeholder="Ex: 2024"
                  value={thesisForm.annee}
                  onChange={(e) => setThesisForm({ ...thesisForm, annee: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="thesisResume">Résumé (facultatif)</label>
                <textarea
                  id="thesisResume"
                  value={thesisForm.resume}
                  onChange={(e) => setThesisForm({ ...thesisForm, resume: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Fichier PDF de la thèse *</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleThesisUpload}
                  disabled={thesisSaving}
                />
                {thesisForm.fichierUrl && (
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    ✔ Fichier prêt : <a href={thesisForm.fichierUrl} target="_blank" rel="noopener noreferrer">ouvrir le PDF</a>
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="action-btn primary"
                  onClick={handleThesisSave}
                  disabled={thesisSaving}
                >
                  {thesisSaving ? '📚 Sauvegarde...' : '📚 Enregistrer la thèse'}
                </button>
                <button
                  className="action-btn"
                  onClick={() => setThesisForm({ titre: '', resume: '', annee: '', fichierUrl: '' })}
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3>Historique de mes thèses</h3>
              {loadingTheses ? (
                <p>Chargement des thèses...</p>
              ) : theses.length === 0 ? (
                <p>Aucune thèse enregistrée pour le moment.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  {theses.map((thesis) => (
                    <li key={thesis._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                      <strong>{thesis.titre}</strong>
                      {thesis.annee && <span> — {thesis.annee}</span>}
                      <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        <a href={thesis.fichierUrl} target="_blank" rel="noopener noreferrer">
                          Ouvrir le PDF
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div id="messages-ordre" className="profile-section" style={{ marginTop: '2rem' }}>
            <h2>Message à l'Ordre</h2>
            <div className="profile-edit-form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="msgSujet">Sujet *</label>
                <input
                  type="text"
                  id="msgSujet"
                  value={messageOrdre.sujet}
                  onChange={(e) => setMessageOrdre({ ...messageOrdre, sujet: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="msgTexte">Message *</label>
                <textarea
                  id="msgTexte"
                  value={messageOrdre.message}
                  onChange={(e) => setMessageOrdre({ ...messageOrdre, message: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <button
                className="action-btn primary"
                onClick={handleSendMessageOrdre}
                disabled={sendingMessageOrdre}
              >
                {sendingMessageOrdre ? '✉️ Envoi...' : '✉️ Envoyer le message à l\'Ordre'}
              </button>
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






