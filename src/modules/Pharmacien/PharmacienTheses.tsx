import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Credentials Cloudinary en dur
const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET = 'onpg_uploads';

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

  // Scroll automatique vers le message quand il apparaît
  useEffect(() => {
    if (message) {
      // Attendre un peu pour que le DOM soit mis à jour
      setTimeout(() => {
        const messageElement = document.querySelector('.message');
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [message]);

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
    console.log('[THESE UPLOAD] Début handleThesisUpload');
    const file = e.target.files?.[0];
    if (!file) {
      console.log('[THESE UPLOAD] ❌ Aucun fichier sélectionné');
      return;
    }

    console.log('[THESE UPLOAD] 📄 Fichier sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeMo: (file.size / (1024 * 1024)).toFixed(2) + ' Mo'
    });

    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      console.log('[THESE UPLOAD] ❌ Type de fichier invalide:', file.type);
      setMessage({
        type: 'error',
        text: 'Merci de sélectionner un fichier PDF uniquement.'
      });
      return;
    }
    console.log('[THESE UPLOAD] ✅ Type PDF valide');

    // Limiter la taille du fichier pour éviter les échecs silencieux côté Cloudinary
    if (file.size > MAX_THESE_PDF_SIZE_BYTES) {
      const sizeMo = (file.size / (1024 * 1024)).toFixed(1);
      console.log('[THESE UPLOAD] ❌ Fichier trop volumineux:', sizeMo, 'Mo (max:', MAX_THESE_PDF_SIZE_MB, 'Mo)');
      setMessage({
        type: 'error',
        text: `Le fichier est trop volumineux (${sizeMo} Mo). Taille maximale autorisée : ${MAX_THESE_PDF_SIZE_MB} Mo.`
      });
      return;
    }
    console.log('[THESE UPLOAD] ✅ Taille valide');

    // ⚠️ Pour les thèses, on force désormais l'upload via le backend,
    // même si Cloudinary est configuré côté frontend, afin d'éviter
    // les problèmes de preset / configuration et centraliser la logique.
    const useBackendUpload = true;
    
    if (useBackendUpload) {
      console.log('[THESE UPLOAD] ⚠️ Utilisation forcée de l’upload via backend pour les thèses');
      setThesisSaving(true);
      try {
        // Convertir le fichier en base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const base64 = e.target?.result as string;
            const token = localStorage.getItem('admin_token');
            const currentUser = user || JSON.parse(localStorage.getItem('admin_user') || '{}');
            const userId = currentUser._id;

            console.log('[THESE UPLOAD] 📤 Upload via backend...');
            const response = await fetch(`${API_URL}/pharmacien/theses/upload-pdf`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-user-id': userId
              },
              body: JSON.stringify({
                fileBase64: base64,
                fileName: file.name
              })
            });

            const data = await response.json();
            console.log('[THESE UPLOAD] 📥 Réponse backend:', data);

            if (data.success && data.url) {
              console.log('[THESE UPLOAD] ✅ Upload réussi via backend, URL:', data.url);
              setThesisForm(prev => ({ ...prev, fichierUrl: data.url }));
              setMessage({ 
                type: 'success', 
                text: `Fichier PDF uploadé avec succès${data.method === 'base64' ? ' (stockage temporaire)' : ''}.` 
              });
            } else {
              console.log('[THESE UPLOAD] ❌ Erreur upload backend');
              setMessage({ 
                type: 'error', 
                text: data.error || 'Erreur lors de l\'upload du PDF via le serveur.' 
              });
            }
          } catch (err: any) {
            console.error('[THESE UPLOAD] ❌ Erreur upload backend:', err);
            setMessage({ 
              type: 'error', 
              text: `Erreur lors de l'upload du PDF: ${err?.message || 'Erreur inconnue'}` 
            });
          } finally {
            setThesisSaving(false);
          }
        };
        reader.onerror = () => {
          setMessage({ type: 'error', text: 'Erreur lors de la lecture du fichier.' });
          setThesisSaving(false);
        };
        reader.readAsDataURL(file);
        return; // Sortir de la fonction, le reste sera géré dans reader.onload
      } catch (err: any) {
        console.error('[THESE UPLOAD] ❌ Erreur préparation upload backend:', err);
        setMessage({ type: 'error', text: `Erreur: ${err?.message || 'Erreur inconnue'}` });
        setThesisSaving(false);
        return;
      }
    }
    console.log('[THESE UPLOAD] ✅ Configuration Cloudinary OK');

    setThesisSaving(true);
    console.log('[THESE UPLOAD] 📤 Début upload vers Cloudinary...');
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      console.log('[THESE UPLOAD] 🌐 Appel Cloudinary:', {
        url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        cloudName: CLOUDINARY_CLOUD_NAME,
        hasPreset: !!CLOUDINARY_UPLOAD_PRESET
      });

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      console.log('[THESE UPLOAD] 📥 Réponse Cloudinary:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      const data = await res.json();
      console.log('[THESE UPLOAD] 📦 Données Cloudinary:', {
        hasSecureUrl: !!data.secure_url,
        secureUrl: data.secure_url ? data.secure_url.substring(0, 50) + '...' : null,
        error: data.error || null,
        fullResponse: data
      });

      if (data.secure_url) {
        console.log('[THESE UPLOAD] ✅ Upload réussi, URL:', data.secure_url);
        setThesisForm(prev => ({ ...prev, fichierUrl: data.secure_url }));
        setMessage({ type: 'success', text: 'Fichier PDF de la thèse uploadé avec succès.' });
      } else {
        console.log('[THESE UPLOAD] ❌ Pas d\'URL dans la réponse Cloudinary');
        setMessage({ 
          type: 'error', 
          text: `Erreur lors de l'upload du PDF. ${data.error ? `Détail: ${data.error.message || data.error}` : ''}` 
        });
      }
    } catch (err: any) {
      console.error('[THESE UPLOAD] ❌ Erreur exception:', err);
      console.error('[THESE UPLOAD] ❌ Stack:', err?.stack);
      setMessage({ 
        type: 'error', 
        text: `Erreur lors de l'upload du PDF: ${err?.message || 'Erreur inconnue'}` 
      });
    } finally {
      setThesisSaving(false);
      console.log('[THESE UPLOAD] 🏁 Fin handleThesisUpload');
      // On NE vide plus le champ pour que le navigateur affiche bien le nom du fichier choisi
    }
  };

  const handleThesisSave = async () => {
    console.log('[THESE SAVE] Début handleThesisSave');
    setMessage(null);

    console.log('[THESE SAVE] 📋 Données du formulaire:', {
      titre: thesisForm.titre,
      annee: thesisForm.annee,
      resume: thesisForm.resume ? thesisForm.resume.substring(0, 50) + '...' : '',
      hasFichierUrl: !!thesisForm.fichierUrl,
      fichierUrl: thesisForm.fichierUrl ? thesisForm.fichierUrl.substring(0, 50) + '...' : null
    });

    if (!thesisForm.titre || !thesisForm.fichierUrl) {
      console.log('[THESE SAVE] ❌ Validation échouée:', {
        hasTitre: !!thesisForm.titre,
        hasFichierUrl: !!thesisForm.fichierUrl
      });
      let errorMsg = 'Veuillez renseigner ';
      const missing = [];
      if (!thesisForm.titre) missing.push('le titre');
      if (!thesisForm.fichierUrl) missing.push('uploader le fichier PDF');
      errorMsg += missing.join(' et ');
      errorMsg += '.';
      setMessage({ type: 'error', text: errorMsg });
      return;
    }
    console.log('[THESE SAVE] ✅ Validation OK');

    try {
      setThesisSaving(true);
      const token = localStorage.getItem('admin_token');
      const userId = user._id;

      console.log('[THESE SAVE] 🔐 Authentification:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        userId: userId,
        apiUrl: API_URL
      });

      console.log('[THESE SAVE] 🌐 Appel API:', {
        url: `${API_URL}/pharmacien/theses`,
        method: 'POST',
        body: thesisForm
      });

      const response = await fetch(`${API_URL}/pharmacien/theses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify(thesisForm)
      });

      console.log('[THESE SAVE] 📥 Réponse API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      const data = await response.json();
      console.log('[THESE SAVE] 📦 Données API:', data);

      if (data.success) {
        console.log('[THESE SAVE] ✅ Thèse enregistrée avec succès');
        setMessage({ type: 'success', text: 'Thèse enregistrée avec succès.' });
        setThesisForm({
          titre: '',
          resume: '',
          annee: '',
          fichierUrl: ''
        });
        await loadTheses();
      } else {
        console.log('[THESE SAVE] ❌ Erreur API:', data.error);
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'enregistrement de la thèse.' });
      }
    } catch (error: any) {
      console.error('[THESE SAVE] ❌ Erreur exception:', error);
      console.error('[THESE SAVE] ❌ Stack:', error?.stack);
      setMessage({ 
        type: 'error', 
        text: `Erreur de connexion au serveur: ${error?.message || 'Erreur inconnue'}` 
      });
    } finally {
      setThesisSaving(false);
      console.log('[THESE SAVE] 🏁 Fin handleThesisSave');
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
            <div 
              className={`message ${message.type}`} 
              style={{ 
                marginBottom: '1.5rem',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: message.type === 'error' ? '600' : '500',
                border: message.type === 'error' ? '2px solid #ef4444' : '2px solid #10b981',
                backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                color: message.type === 'error' ? '#991b1b' : '#065f46',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {message.type === 'error' ? '❌ ' : '✅ '}
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




