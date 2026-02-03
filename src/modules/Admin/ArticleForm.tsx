import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import TextEditor from './components/TextEditor';
import './Articles.css';
import './Dashboard.css';
import { useToast } from '../../components/Toast';

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  pole: string;
  tags: string;
  status: string;
  featured: boolean;
  author: {
    name: string;
    role: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  visibleFrom: string;
  visibleUntil: string;
  readTime: number;
  priorite: number;
}

const ArticleForm = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [visibleFromTime, setVisibleFromTime] = useState<string>('00:00');
  const [visibleUntilTime, setVisibleUntilTime] = useState<string>('00:00');
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'pedagogique',
    pole: 'general',
    tags: '',
    status: 'published',
    featured: false,
    author: {
      name: 'Équipe CIPS',
      role: 'Rédaction'
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    },
    visibleFrom: new Date().toISOString().split('T')[0],
    visibleUntil: '',
    readTime: 5,
    priorite: 0
  });

  useEffect(() => {
    checkAuth();
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const article = data.data;
        setFormData({
          title: article.title || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          featuredImage: article.featuredImage || '',
          category: article.category || 'pedagogique',
          pole: article.pole || 'general',
          tags: article.tags?.join(', ') || '',
          status: article.status || 'published',
          featured: article.featured || false,
          author: article.author || { name: 'Équipe CIPS', role: 'Rédaction' },
          seo: {
            metaTitle: article.seo?.metaTitle || '',
            metaDescription: article.seo?.metaDescription || '',
            keywords: article.seo?.keywords?.join(', ') || ''
          },
          visibleFrom: article.visibleFrom ? new Date(article.visibleFrom).toISOString().split('T')[0] : '',
          visibleUntil: article.visibleUntil ? new Date(article.visibleUntil).toISOString().split('T')[0] : '',
          readTime: article.readTime || 5,
          priorite: article.priorite || 0
        });
        // Extraire l'heure des dates si elles existent
        if (article.visibleFrom) {
          const date = new Date(article.visibleFrom);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setVisibleFromTime(`${hours}:${minutes}`);
        }
        if (article.visibleUntil) {
          const date = new Date(article.visibleUntil);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setVisibleUntilTime(`${hours}:${minutes}`);
        }
        setImagePreview(article.featuredImage);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors du chargement de l\'article');
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner une image valide');
      return;
    }

    // Vérification de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('L\'image ne doit pas dépasser 5 MB');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload/article', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, featuredImage: data.data.url }));
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
    
    if (!formData.featuredImage) {
      showError('Veuillez uploader une image principale');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // Combiner date + heure pour visibleFrom (avec fuseau horaire local, converti en UTC)
      let visibleFromDate: string = new Date().toISOString();
      if (formData.visibleFrom) {
        const [hours, minutes] = visibleFromTime.split(':');
        // Créer la date dans le fuseau horaire local, puis la convertir en UTC (ISO string)
        const localDate = new Date(`${formData.visibleFrom}T${hours}:${minutes}:00`);
        visibleFromDate = localDate.toISOString();
      }
      
      // Combiner date + heure pour visibleUntil (avec fuseau horaire local, converti en UTC)
      let visibleUntilDate: string | null = null;
      if (formData.visibleUntil) {
        const [hours, minutes] = visibleUntilTime.split(':');
        // Créer la date dans le fuseau horaire local, puis la convertir en UTC (ISO string)
        const localDate = new Date(`${formData.visibleUntil}T${hours}:${minutes}:00`);
        visibleUntilDate = localDate.toISOString();
      }
      
      // Préparer les données
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(k => k)
        },
        visibleFrom: visibleFromDate,
        visibleUntil: visibleUntilDate
      };

      const url = isEdit ? `/api/articles/${id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });

      const data = await response.json();
      
      if (data.success) {
        showSuccess(`Article ${isEdit ? 'modifié' : 'créé'} avec succès`);
        setTimeout(() => navigate('/admin/articles'), 1000);
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
    
    if (name.startsWith('author.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        author: { ...prev.author, [field]: value }
      }));
    } else if (name.startsWith('seo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: { ...prev.seo, [field]: value }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="articles" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>{isEdit ? `✏️ Modifier l'article` : `➕ Nouvel article`}</h1>
            <p>Remplissez tous les champs requis</p>
          </div>
          <button onClick={() => navigate('/admin/articles')} className="btn-secondary">
            ← Retour
          </button>
        </header>

        <form onSubmit={handleSubmit} className="article-form">
          {/* Section Informations de base */}
          <div className="form-section">
            <h2>📝 Informations de base</h2>
            
            <div className="form-group">
              <label htmlFor="title">Titre *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Titre de l'article"
              />
              <small>{formData.title.length}/200 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Extrait *</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                maxLength={300}
                rows={3}
                placeholder="Court résumé de l'article"
              />
              <small>{formData.excerpt.length}/300 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="content">Contenu *</label>
              <TextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Rédigez le contenu de l'article avec l'éditeur riche..."
                height="400px"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="pedagogique">Pédagogique</option>
                  <option value="actualites">Actualités</option>
                  <option value="comparatifs">Comparatifs</option>
                  <option value="innovations">Innovations</option>
                  <option value="communiques">Communiqués</option>
                  <option value="partenariats">Partenariats</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pole">Pôle</label>
                <select
                  id="pole"
                  name="pole"
                  value={formData.pole}
                  onChange={handleChange}
                >
                  <option value="general">Général</option>
                  <option value="energie">Énergie</option>
                  <option value="geospatial">Géospatial</option>
                  <option value="drone">Drone</option>
                  <option value="sante">Santé</option>
                  <option value="securite">Sécurité</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (séparés par des virgules)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="solaire, énergie, Gabon"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="readTime">Temps de lecture (minutes)</label>
                <input
                  type="number"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  min="1"
                  max="60"
                />
              </div>

            </div>
          </div>

          {/* Section Image */}
          <div className="form-section">
            <h2>🖼️ Image principale *</h2>
            
            <div className="form-group">
              <label htmlFor="imageUpload">Upload image</label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              <small>Format: JPG, PNG, WEBP • Max: 5 MB • Recommandé: 1200x630px</small>
              {uploading && <p className="uploading">⏳ Upload en cours...</p>}
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          {/* Section Auteur */}
          <div className="form-section">
            <h2>👤 Auteur</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author.name">Nom</label>
                <input
                  type="text"
                  id="author.name"
                  name="author.name"
                  value={formData.author.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="author.role">Rôle</label>
                <input
                  type="text"
                  id="author.role"
                  name="author.role"
                  value={formData.author.role}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section SEO */}
          <div className="form-section">
            <h2>🔍 SEO</h2>
            
            <div className="form-group">
              <label htmlFor="seo.metaTitle">Meta Title</label>
              <input
                type="text"
                id="seo.metaTitle"
                name="seo.metaTitle"
                value={formData.seo.metaTitle}
                onChange={handleChange}
                maxLength={60}
                placeholder="Titre pour les moteurs de recherche"
              />
              <small>{formData.seo.metaTitle.length}/60 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="seo.metaDescription">Meta Description</label>
              <textarea
                id="seo.metaDescription"
                name="seo.metaDescription"
                value={formData.seo.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                placeholder="Description pour les moteurs de recherche"
              />
              <small>{formData.seo.metaDescription.length}/160 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="seo.keywords">Mots-clés (séparés par des virgules)</label>
              <input
                type="text"
                id="seo.keywords"
                name="seo.keywords"
                value={formData.seo.keywords}
                onChange={handleChange}
                placeholder="énergie solaire, Gabon, CIPS"
              />
            </div>
          </div>

          {/* Section Dates */}
          <div className="form-section">
            <h2>📅 Dates de visibilité</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="visibleFrom">Visible à partir de</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="date"
                    id="visibleFrom"
                    name="visibleFrom"
                    value={formData.visibleFrom}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="time"
                    id="visibleFromTime"
                    value={visibleFromTime}
                    onChange={(e) => setVisibleFromTime(e.target.value)}
                    style={{ width: '120px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="visibleUntil">Visible jusqu'au (optionnel)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="date"
                    id="visibleUntil"
                    name="visibleUntil"
                    value={formData.visibleUntil}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="time"
                    id="visibleUntilTime"
                    value={visibleUntilTime}
                    onChange={(e) => setVisibleUntilTime(e.target.value)}
                    style={{ width: '120px' }}
                    disabled={!formData.visibleUntil}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Statut et Priorité */}
          <div className="form-section">
            <h2>Paramètres de publication</h2>
            
            <div className="form-group">
              <label htmlFor="status">Statut</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
              <small style={{ display: 'block', marginTop: '8px', color: '#666', lineHeight: '1.5' }}>
                <strong>⚠️ Conditions de visibilité :</strong><br/>
                L'article sera visible publiquement uniquement si :<br/>
                • Le statut est "Publié" <strong>ET</strong><br/>
                • La date "Visible à partir de" est passée ou aujourd'hui <strong>ET</strong><br/>
                • La date "Visible jusqu'au" n'est pas dépassée (si définie)
                {(() => {
                  const now = new Date();
                  const pubDate = formData.visibleFrom ? new Date(`${formData.visibleFrom}T${visibleFromTime}:00`) : null;
                  const expDate = formData.visibleUntil ? new Date(`${formData.visibleUntil}T${visibleUntilTime}:00`) : null;
                  
                  if (formData.status !== 'published') {
                    return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}><br/>❌ Actuellement : Non visible (statut: {formData.status === 'draft' ? 'Brouillon' : 'Archivé'})</span>;
                  } else if (pubDate && pubDate > now) {
                    return <span style={{ color: '#ed6c02', fontWeight: 'bold' }}><br/>⏳ Actuellement : Programmée pour le {pubDate.toLocaleDateString('fr-FR')} à {pubDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>;
                  } else if (expDate && expDate < now) {
                    return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}><br/>❌ Actuellement : Expirée (date de fin dépassée)</span>;
                  } else {
                    return <span style={{ color: '#2e7d32', fontWeight: 'bold' }}><br/>✅ Actuellement : Visible publiquement</span>;
                  }
                })()}
              </small>
            </div>

            <div className="form-row">
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
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>⭐ Mettre en avant (Featured)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/articles')} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading || uploading} className="btn-primary">
              {loading ? '⏳ Enregistrement...' : (isEdit ? '💾 Enregistrer' : '✅ Créer l\'article')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ArticleForm;

