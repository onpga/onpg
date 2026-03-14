import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';
import './PharmacienTheses.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Credentials Cloudinary en dur
const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_API_KEY = '311692364197472';
const CLOUDINARY_API_SECRET = 'YlKz6EoFE2hiETe6hH3H2lTsvlk';

// Limite de taille pour les PDF de thèses (en Mo)
const MAX_THESE_PDF_SIZE_MB = 20;
const MAX_THESE_PDF_SIZE_BYTES = MAX_THESE_PDF_SIZE_MB * 1024 * 1024;

const PharmacienTheses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [theses, setTheses] = useState<any[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(false);
  const [thesisSaving, setThesisSaving] = useState(false);
  const [deletingThesisId, setDeletingThesisId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [thesisForm, setThesisForm] = useState({
    titre: '',
    resume: '',
    annee: '',
    universite: '',
    motsCles: '',
    directeur: '',
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

    // SIMPLE : Envoyer le fichier au backend, il s'occupe de tout
    setThesisSaving(true);
    console.log('[THESE UPLOAD] 📤 Upload via backend...');
    try {
      const token = localStorage.getItem('admin_token');
      const currentUser = user || JSON.parse(localStorage.getItem('admin_user') || '{}');
      const userId = currentUser._id;

      const formData = new FormData();
      formData.append('pdf', file);
      // Envoyer le titre si disponible pour générer un nom de fichier personnalisé
      if (thesisForm.titre) {
        formData.append('titre', thesisForm.titre);
      }

      const res = await fetch(`${API_URL}/pharmacien/theses/upload-pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: formData
      });

      console.log('[THESE UPLOAD] 📥 Réponse Cloudinary:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      const data = await res.json();
      console.log('[THESE UPLOAD] 📥 Réponse backend:', data);

      if (data.success && data.url) {
        console.log('[THESE UPLOAD] ✅ Upload réussi, URL:', data.url);
        const updatedForm = { ...thesisForm, fichierUrl: data.url };
        setThesisForm(updatedForm);
        
        // Enregistrement automatique en base avec tous les champs
        console.log('[THESE UPLOAD] 💾 Enregistrement automatique en base...');
        setTimeout(async () => {
          try {
            const token = localStorage.getItem('admin_token');
            const currentUser = user || JSON.parse(localStorage.getItem('admin_user') || '{}');
            const userId = currentUser._id;

            const response = await fetch(`${API_URL}/pharmacien/theses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-user-id': userId
              },
              body: JSON.stringify(updatedForm)
            });

            const saveData = await response.json();
            if (saveData.success) {
              console.log('[THESE UPLOAD] ✅ Thèse enregistrée en base');
              setMessage({ type: 'success', text: 'Thèse uploadée et enregistrée avec succès.' });
              setThesisForm({ titre: '', resume: '', annee: '', universite: '', motsCles: '', directeur: '', fichierUrl: '' });
              await loadTheses();
            } else {
              console.log('[THESE UPLOAD] ❌ Erreur enregistrement:', saveData.error);
              setMessage({ type: 'error', text: saveData.error || 'Erreur lors de l\'enregistrement.' });
            }
          } catch (err: any) {
            console.error('[THESE UPLOAD] ❌ Erreur enregistrement:', err);
            setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement en base.' });
          }
        }, 500);
      } else {
        console.log('[THESE UPLOAD] ❌ Erreur upload');
        setMessage({ 
          type: 'error', 
          text: data.error || 'Erreur lors de l\'upload du PDF.' 
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

    if (!thesisForm.fichierUrl || !thesisForm.titre || !thesisForm.annee || !thesisForm.universite) {
      console.log('[THESE SAVE] ❌ Validation échouée');
      const missing = [];
      if (!thesisForm.titre) missing.push('le titre');
      if (!thesisForm.annee) missing.push('l\'année');
      if (!thesisForm.universite) missing.push('l\'université');
      if (!thesisForm.fichierUrl) missing.push('le fichier PDF');
      setMessage({ type: 'error', text: `Veuillez renseigner ${missing.join(', ')}.` });
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
          universite: '',
          motsCles: '',
          directeur: '',
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

  const handleDeleteThesis = async (id: string) => {
    const confirmed = window.confirm('Supprimer cette thèse ? Cette action est irréversible.');
    if (!confirmed) return;

    try {
      setDeletingThesisId(id);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const userId = user?._id;

      const response = await fetch(`${API_URL}/pharmacien/theses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        }
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        setMessage({
          type: 'error',
          text: data.error || 'Impossible de supprimer la thèse.'
        });
        return;
      }

      setMessage({ type: 'success', text: 'Thèse supprimée avec succès.' });
      if (thesisForm.fichierUrl && theses.length <= 1) {
        setThesisForm({
          titre: '',
          resume: '',
          annee: '',
          universite: '',
          motsCles: '',
          directeur: '',
          fichierUrl: ''
        });
      }
      await loadTheses();
    } catch (error) {
      console.error('Erreur suppression thèse:', error);
      setMessage({ type: 'error', text: 'Erreur serveur lors de la suppression.' });
    } finally {
      setDeletingThesisId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="theses" />
      <main className="admin-main theses-page">
        <div className="admin-content theses-content">
          <section className="theses-hero">
            <h1>Mes theses</h1>
            <p>Publiez et gerez vos theses dans un espace dedie.</p>
            <div className="theses-hero-kpis">
              <div className="theses-kpi">
                <span className="theses-kpi-value">{theses.length}</span>
                <span className="theses-kpi-label">Theses publiees</span>
              </div>
              <div className="theses-kpi">
                <span className="theses-kpi-value">{theses.filter((t) => t.fichierUrl).length}</span>
                <span className="theses-kpi-label">Avec PDF</span>
              </div>
            </div>
          </section>

          {message && (
            <div 
              className={`theses-feedback ${message.type}`} 
            >
              {message.text}
            </div>
          )}

          <section className="theses-card">
            <h2>Ajouter ou mettre a jour une these</h2>
            <div className="theses-form">
              <div className="form-group">
                <label htmlFor="thesisTitre">Titre de la thèse *</label>
                <input
                  type="text"
                  id="thesisTitre"
                  value={thesisForm.titre}
                  onChange={(e) => setThesisForm({ ...thesisForm, titre: e.target.value })}
                  className="theses-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="thesisAnnee">Année *</label>
                <input
                  type="text"
                  id="thesisAnnee"
                  placeholder="Ex: 2024"
                  value={thesisForm.annee}
                  onChange={(e) => setThesisForm({ ...thesisForm, annee: e.target.value })}
                  className="theses-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="thesisUniversite">Université *</label>
                <input
                  type="text"
                  id="thesisUniversite"
                  placeholder="Ex: Université Omar Bongo"
                  value={thesisForm.universite}
                  onChange={(e) => setThesisForm({ ...thesisForm, universite: e.target.value })}
                  className="theses-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="thesisDirecteur">Directeur de thèse (optionnel)</label>
                <input
                  type="text"
                  id="thesisDirecteur"
                  placeholder="Ex: Pr. Jean Dupont"
                  value={thesisForm.directeur}
                  onChange={(e) => setThesisForm({ ...thesisForm, directeur: e.target.value })}
                  className="theses-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="thesisMotsCles">Mots-clés (optionnel)</label>
                <input
                  type="text"
                  id="thesisMotsCles"
                  placeholder="Ex: pharmacie, médicament, santé"
                  value={thesisForm.motsCles}
                  onChange={(e) => setThesisForm({ ...thesisForm, motsCles: e.target.value })}
                  className="theses-input"
                />
              </div>

              <div className="form-group theses-form-full">
                <label htmlFor="thesisResume">Résumé (optionnel)</label>
                <textarea
                  id="thesisResume"
                  value={thesisForm.resume}
                  onChange={(e) => setThesisForm({ ...thesisForm, resume: e.target.value })}
                  rows={3}
                  className="theses-input"
                />
              </div>

              <div className="form-group theses-form-full">
                <label>Fichier PDF de la thèse * (max. {MAX_THESE_PDF_SIZE_MB} Mo)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleThesisUpload}
                  disabled={thesisSaving}
                  className="theses-file-input"
                />
                {thesisForm.fichierUrl && (
                  <p className="theses-file-ready">
                    Fichier pret : <a href={thesisForm.fichierUrl} target="_blank" rel="noopener noreferrer">ouvrir le PDF</a>
                  </p>
                )}
              </div>

              <div className="theses-actions">
                <button
                  className="btn-primary"
                  onClick={handleThesisSave}
                  disabled={thesisSaving}
                >
                  {thesisSaving ? 'Sauvegarde...' : 'Enregistrer la these'}
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => setThesisForm({ titre: '', resume: '', annee: '', universite: '', motsCles: '', directeur: '', fichierUrl: '' })}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </section>

          <section className="theses-card">
            <h2>Historique de mes theses</h2>
            {loadingTheses ? (
              <p className="theses-empty-state">Chargement des theses...</p>
            ) : theses.length === 0 ? (
              <p className="theses-empty-state">Aucune these enregistree pour le moment.</p>
            ) : (
              <ul className="theses-list">
                {theses.map((thesis) => (
                  <li key={thesis._id} className="theses-list-item">
                    <div className="theses-list-top">
                      <strong>{thesis.titre}</strong>
                      {thesis.annee && <span>{thesis.annee}</span>}
                    </div>
                    <div className="theses-list-meta">
                      {thesis.universite && <span>{thesis.universite}</span>}
                      {thesis.directeur && <span>Dir. {thesis.directeur}</span>}
                    </div>
                    <div className="theses-list-link">
                      <a href={thesis.fichierUrl} target="_blank" rel="noopener noreferrer">
                        Ouvrir le PDF
                      </a>
                      <button
                        type="button"
                        className="theses-delete-btn"
                        onClick={() => handleDeleteThesis(thesis._id)}
                        disabled={deletingThesisId === thesis._id}
                      >
                        {deletingThesisId === thesis._id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PharmacienTheses;




