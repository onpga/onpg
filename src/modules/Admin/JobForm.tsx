import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import TextEditor from './components/TextEditor';
import './Articles.css';
import './Dashboard.css';
import { useToast } from '../../components/Toast';

interface JobFormData {
  titre: string;
  type: string;
  localisation: string;
  departement: string;
  description: string;
  competences: string;
  experience: string;
  missions: string;
  profil: string;
  salaire: {
    min: number;
    max: number;
    devise: string;
    afficher: boolean;
  };
  avantages: string;
  actif: boolean;
  datePublication: string;
  dateExpiration: string;
  priorite: number;
  image?: string;
}

const JobForm = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [datePublicationTime, setDatePublicationTime] = useState<string>('00:00');
  const [dateExpirationTime, setDateExpirationTime] = useState<string>('00:00');
  
  const [formData, setFormData] = useState<JobFormData>({
    titre: '',
    type: 'CDI',
    localisation: 'Libreville, Gabon',
    departement: 'Pôle Énergie',
    description: '',
    competences: '',
    experience: '0-2 ans',
    missions: '',
    profil: '',
    salaire: {
      min: 0,
      max: 0,
      devise: 'FCFA',
      afficher: false
    },
    avantages: '',
    actif: true,
    datePublication: new Date().toISOString().split('T')[0],
    dateExpiration: '',
    priorite: 0,
    image: ''
  });

  useEffect(() => {
    checkAuth();
    if (isEdit) {
      fetchJob();
    }
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const job = data.data;
        setFormData({
          titre: job.titre || '',
          type: job.type || 'CDI',
          localisation: job.localisation || 'Libreville, Gabon',
          departement: job.departement || 'Pôle Énergie',
          description: job.description || '',
          competences: job.competences?.length > 0 ? job.competences.map((c: string) => `<p>${c}</p>`).join('') : '',
          experience: job.experience || '0-2 ans',
          missions: job.missions?.length > 0 ? job.missions.map((m: string) => `<p>${m}</p>`).join('') : '',
          profil: job.profil || '',
          salaire: job.salaire || {
            min: 0,
            max: 0,
            devise: 'FCFA',
            afficher: false
          },
          avantages: job.avantages?.length > 0 ? job.avantages.map((a: string) => `<p>${a}</p>`).join('') : '',
          actif: job.actif !== undefined ? job.actif : true,
          datePublication: job.datePublication ? new Date(job.datePublication).toISOString().split('T')[0] : '',
          dateExpiration: job.dateExpiration ? new Date(job.dateExpiration).toISOString().split('T')[0] : '',
          priorite: job.priorite || 0,
          image: job.image || ''
        });
        // Extraire l'heure des dates si elles existent
        if (job.datePublication) {
          const date = new Date(job.datePublication);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setDatePublicationTime(`${hours}:${minutes}`);
        }
        if (job.dateExpiration) {
          const date = new Date(job.dateExpiration);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setDateExpirationTime(`${hours}:${minutes}`);
        }
        if (job.image) {
          setImagePreview(job.image);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors du chargement de l\'offre');
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showError('L\'image ne doit pas dépasser 3 MB');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload/job', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        setImagePreview(data.data.url);
        showSuccess('Image uploadée avec succès');
      } else {
        showError('Erreur lors de l\'upload: ' + (data.error || 'Une erreur est survenue'));
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      showError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Combiner date + heure pour datePublication (avec fuseau horaire local, converti en UTC)
      let datePublicationDate: string = new Date().toISOString();
      if (formData.datePublication) {
        const [hours, minutes] = datePublicationTime.split(':');
        // Créer la date dans le fuseau horaire local, puis la convertir en UTC (ISO string)
        const localDate = new Date(`${formData.datePublication}T${hours}:${minutes}:00`);
        datePublicationDate = localDate.toISOString();
      }
      
      // Combiner date + heure pour dateExpiration (avec fuseau horaire local, converti en UTC)
      let dateExpirationDate: string | null = null;
      if (formData.dateExpiration) {
        const [hours, minutes] = dateExpirationTime.split(':');
        // Créer la date dans le fuseau horaire local, puis la convertir en UTC (ISO string)
        const localDate = new Date(`${formData.dateExpiration}T${hours}:${minutes}:00`);
        dateExpirationDate = localDate.toISOString();
      }
      
      // Fonction pour extraire le texte du HTML et le convertir en tableau
      const htmlToArray = (html: string): string[] => {
        if (!html || html.trim() === '') return [];
        // Créer un élément temporaire pour extraire le texte
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        // Extraire le texte et split par les retours à la ligne ou les balises <p>, <li>, <br>
        const text = tempDiv.textContent || tempDiv.innerText || '';
        // Split par les retours à la ligne, puis filtrer et nettoyer
        return text.split(/\n|<p>|<li>|<\/p>|<\/li>/)
          .map(item => item.replace(/<[^>]*>/g, '').trim())
          .filter(item => item.length > 0);
      };

      // Préparer les données
      const jobData = {
        ...formData,
        competences: htmlToArray(formData.competences),
        missions: htmlToArray(formData.missions),
        avantages: htmlToArray(formData.avantages),
        datePublication: datePublicationDate,
        dateExpiration: dateExpirationDate
      };

      const url = isEdit ? `/api/jobs/${id}` : '/api/jobs';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await response.json();
      
      if (data.success) {
        showSuccess(`Offre ${isEdit ? 'modifiée' : 'créée'} avec succès`);
        setTimeout(() => navigate('/admin/jobs'), 1000);
      } else {
        showError(data.error || data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('salaire.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salaire: { 
          ...prev.salaire, 
          [field]: field === 'afficher' ? (e.target as HTMLInputElement).checked : value 
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="jobs" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>{isEdit ? `✏️ Modifier l'offre` : `➕ Nouvelle offre d'emploi`}</h1>
            <p>Remplissez tous les champs requis</p>
          </div>
          <button onClick={() => navigate('/admin/jobs')} className="btn-secondary">
            ← Retour
          </button>
        </header>

        <form onSubmit={handleSubmit} className="article-form">
          {/* Section Informations de base */}
          <div className="form-section">
            <h2>📝 Informations de base</h2>
            
            <div className="form-group">
              <label htmlFor="titre">Titre du poste *</label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                placeholder="Ex: Ingénieur en énergie solaire"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Type de contrat *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="localisation">Localisation *</label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="departement">Département *</label>
              <select
                id="departement"
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                required
              >
                <option value="Pôle Énergie">Pôle Énergie</option>
                <option value="Pôle Traitement de Données Géospatiales">Pôle Traitement de Données Géospatiales</option>
                <option value="ODS - Services Drones">ODS - Services Drones</option>
                <option value="Pôle Sécurité Numérique">Pôle Sécurité Numérique</option>
                <option value="Pôle Santé">Pôle Santé</option>
                <option value="Direction Générale">Direction Générale</option>
                <option value="Ressources Humaines">Ressources Humaines</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description du poste *</label>
              <TextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Rédigez la description du poste..."
                height="300px"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Expérience requise *</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="Ex: 3-5 ans"
              />
            </div>
          </div>

          {/* Section Détails du poste */}
          <div className="form-section">
            <h2>💼 Détails du poste</h2>
            
            <div className="form-group">
              <label htmlFor="missions">Missions</label>
              <TextEditor
                value={formData.missions}
                onChange={(value) => setFormData({ ...formData, missions: value })}
                placeholder="Listez les missions du poste..."
                height="200px"
              />
            </div>

            <div className="form-group">
              <label htmlFor="competences">Compétences requises *</label>
              <TextEditor
                value={formData.competences}
                onChange={(value) => setFormData({ ...formData, competences: value })}
                placeholder="Listez les compétences requises..."
                height="200px"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profil">Profil recherché</label>
              <TextEditor
                value={formData.profil}
                onChange={(value) => setFormData({ ...formData, profil: value })}
                placeholder="Décrivez le profil recherché..."
                height="200px"
              />
            </div>

            <div className="form-group">
              <label htmlFor="avantages">Avantages</label>
              <TextEditor
                value={formData.avantages}
                onChange={(value) => setFormData({ ...formData, avantages: value })}
                placeholder="Listez les avantages du poste..."
                height="200px"
              />
            </div>
          </div>

          {/* Section Salaire */}
          <div className="form-section">
            <h2>💰 Rémunération</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaire.min">Salaire min</label>
                <input
                  type="number"
                  id="salaire.min"
                  name="salaire.min"
                  value={formData.salaire.min}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaire.max">Salaire max</label>
                <input
                  type="number"
                  id="salaire.max"
                  name="salaire.max"
                  value={formData.salaire.max}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaire.devise">Devise</label>
                <select
                  id="salaire.devise"
                  name="salaire.devise"
                  value={formData.salaire.devise}
                  onChange={handleChange}
                >
                  <option value="FCFA">FCFA</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="salaire.afficher"
                  checked={formData.salaire.afficher}
                  onChange={handleChange}
                />
                <span>Afficher le salaire publiquement</span>
              </label>
            </div>
          </div>

          {/* Section Image (optionnelle) */}
          <div className="form-section">
            <h2>🖼️ Image (optionnelle)</h2>
            
            <div className="form-group">
              <label htmlFor="imageUpload">Upload image</label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <small>Format: JPG, PNG, WEBP • Max: 3 MB</small>
              {uploading && <p className="uploading">⏳ Upload en cours...</p>}
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          {/* Section Dates et Priorité */}
          <div className="form-section">
            <h2>📅 Dates et priorité</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="datePublication">Date de publication</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="date"
                    id="datePublication"
                    name="datePublication"
                    value={formData.datePublication}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="time"
                    id="datePublicationTime"
                    value={datePublicationTime}
                    onChange={(e) => setDatePublicationTime(e.target.value)}
                    style={{ width: '120px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dateExpiration">Date d'expiration (optionnel)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="date"
                    id="dateExpiration"
                    name="dateExpiration"
                    value={formData.dateExpiration}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="time"
                    id="dateExpirationTime"
                    value={dateExpirationTime}
                    onChange={(e) => setDateExpirationTime(e.target.value)}
                    style={{ width: '120px' }}
                    disabled={!formData.dateExpiration}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priorite">Priorité d'affichage</label>
              <input
                type="number"
                id="priorite"
                name="priorite"
                value={formData.priorite}
                onChange={handleChange}
                min="0"
                max="10"
              />
              <small>
                <strong>Comment ça fonctionne :</strong><br/>
                Plus le nombre est élevé (0-10), plus l'élément est prioritaire et affiché en premier.<br/>
                <strong>Exemples :</strong><br/>
                • <strong>10</strong> = Priorité maximale (affiché en 1er)<br/>
                • <strong>9, 8, 7, 6, 5...</strong> = Priorité décroissante<br/>
                • <strong>1</strong> = Priorité faible<br/>
                • <strong>0</strong> = Ordre normal (tri par date)
              </small>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="actif"
                  checked={formData.actif}
                  onChange={handleChange}
                />
                <span>✅ Offre active</span>
              </label>
              <small style={{ display: 'block', marginTop: '8px', color: '#666', lineHeight: '1.5' }}>
                <strong>⚠️ Conditions de visibilité :</strong><br/>
                L'offre sera visible publiquement uniquement si :<br/>
                • Cette case est cochée <strong>ET</strong><br/>
                • La date de publication est passée ou aujourd'hui <strong>ET</strong><br/>
                • La date d'expiration n'est pas dépassée (si définie)
                {(() => {
                  const now = new Date();
                  const pubDate = formData.datePublication ? new Date(`${formData.datePublication}T${datePublicationTime}:00`) : null;
                  const expDate = formData.dateExpiration ? new Date(`${formData.dateExpiration}T${dateExpirationTime}:00`) : null;
                  
                  if (!formData.actif) {
                    return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}><br/>❌ Actuellement : Non visible (offre inactive)</span>;
                  } else if (pubDate && pubDate > now) {
                    return <span style={{ color: '#ed6c02', fontWeight: 'bold' }}><br/>⏳ Actuellement : Programmée pour le {pubDate.toLocaleDateString('fr-FR')} à {pubDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>;
                  } else if (expDate && expDate < now) {
                    return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}><br/>❌ Actuellement : Expirée (date d'expiration dépassée)</span>;
                  } else {
                    return <span style={{ color: '#2e7d32', fontWeight: 'bold' }}><br/>✅ Actuellement : Visible publiquement</span>;
                  }
                })()}
              </small>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/jobs')} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading || uploading} className="btn-primary">
              {loading ? '⏳ Enregistrement...' : (isEdit ? '💾 Enregistrer' : '✅ Créer l\'offre')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default JobForm;

