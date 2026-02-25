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

// Limite de taille pour les PDF de thèses (en Mo)
const MAX_THESE_PDF_SIZE_MB = 20;
const MAX_THESE_PDF_SIZE_BYTES = MAX_THESE_PDF_SIZE_MB * 1024 * 1024;

const PharmacienTheses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [theses, setTheses] = useState<any[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(false);
  const [thesisSaving, setThesisSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [thesisForm, setThesisForm] = useState({
    titre: '',
    resume: '',
    annee: '',
    fichierUrl: ''
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
    loadTheses(userData);
  }, [navigate]);

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

    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      setMessage({
        type: 'error',
        text: 'Merci de sélectionner un fichier PDF uniquement.'
      });
      e.target.value = '';
      return;
    }

    // Limiter la taille du fichier pour éviter les échecs silencieux côté Cloudinary
    if (file.size > MAX_THESE_PDF_SIZE_BYTES) {
      const sizeMo = (file.size / (1024 * 1024)).toFixed(1);
      setMessage({
        type: 'error',
        text: `Le fichier est trop volumineux (${sizeMo} Mo). Taille maximale autorisée : ${MAX_THESE_PDF_SIZE_MB} Mo.`
      });
      e.target.value = '';
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMessage({
        type: 'error',
        text: 'Configuration interne manquante pour l’upload des thèses. Veuillez contacter l’Ordre.'
      });
      e.target.value = '';
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

  if (!user) return null;

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="theses" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>📚 Mes Thèses</h1>

          {message && (
            <div className={`message ${message.type}`} style={{ marginBottom: '1rem' }}>
              {message.text}
            </div>
          )}

          <div className="profile-section">
            <h2>Ajouter / Mettre à jour une thèse</h2>
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
                <label>Fichier PDF de la thèse * (max. {MAX_THESE_PDF_SIZE_MB} Mo)</label>
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
                  type="button"
                  onClick={() => setThesisForm({ titre: '', resume: '', annee: '', fichierUrl: '' })}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          <div className="profile-section" style={{ marginTop: '2rem' }}>
            <h2>Historique de mes thèses</h2>
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
      </main>
    </div>
  );
};

export default PharmacienTheses;




