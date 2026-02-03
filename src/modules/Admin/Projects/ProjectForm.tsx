import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import TextEditor from '../components/TextEditor';
import '../Dashboard.css';
import './Projects.css';
import { useToast } from '../../../components/Toast';

const ProjectForm = () => {
  const { showSuccess, showError } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    pole: '',
    mainImage: '',
    images: [] as { url: string; caption: string }[],
    location: { city: '', country: 'Gabon' },
    client: { name: '', company: '', logo: '' },
    testimonial: { text: '', author: '', position: '', photo: '', rating: 5 },
    duration: '',
    budget: '',
    team: '',
    date: new Date().toISOString().split('T')[0],
    status: 'termine',
    featured: false,
    published: true,
    priorite: 0,
    tags: [] as string[],
    visibleFrom: new Date().toISOString().split('T')[0],
    visibleUntil: '',
    beforeAfter: {
      before: { image: '', description: '' },
      after: { image: '', description: '' }
    }
  });

  const [newImage, setNewImage] = useState({ url: '', caption: '' });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleFromTime, setVisibleFromTime] = useState<string>('00:00');
  const [visibleUntilTime, setVisibleUntilTime] = useState<string>('00:00');
  const [imageFiles, setImageFiles] = useState<{main: File | null, gallery: File[]}>({
    main: null,
    gallery: []
  });

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const project = data.data;
        setFormData({
          ...project,
          date: new Date(project.date).toISOString().split('T')[0],
          visibleFrom: new Date(project.visibleFrom).toISOString().split('T')[0],
          visibleUntil: project.visibleUntil ? new Date(project.visibleUntil).toISOString().split('T')[0] : '',
          priorite: project.priorite || 0,
          beforeAfter: project.beforeAfter || {
            before: { image: '', description: '' },
            after: { image: '', description: '' }
          }
        });
        // Extraire l'heure des dates si elles existent
        if (project.visibleFrom) {
          const date = new Date(project.visibleFrom);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setVisibleFromTime(`${hours}:${minutes}`);
        }
        if (project.visibleUntil) {
          const date = new Date(project.visibleUntil);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setVisibleUntilTime(`${hours}:${minutes}`);
        }
      }
    } catch (error) {
      console.error('Erreur chargement projet:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else if (name.startsWith('client.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        client: { ...formData.client, [field]: value }
      });
    } else if (name.startsWith('testimonial.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        testimonial: { ...formData.testimonial, [field]: field === 'rating' ? parseInt(value) : value }
      });
    } else if (name.startsWith('beforeAfter.')) {
      const parts = name.split('.');
      const section = parts[1]; // 'before' ou 'after'
      const field = parts[2]; // 'image' ou 'description'
      setFormData({
        ...formData,
        beforeAfter: {
          ...formData.beforeAfter,
          [section]: {
            ...formData.beforeAfter[section as 'before' | 'after'],
            [field]: value
          }
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Upload image vers Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload/project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success && data.data && data.data.images && data.data.images.length > 0) {
        return data.data.images[0].url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Erreur upload Cloudinary:', error);
      showError('Erreur lors de l\'upload de l\'image');
      throw error;
    }
  };

  // Upload image principale
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      
      try {
        const url = await uploadToCloudinary(file);
        setFormData({ ...formData, mainImage: url });
        showSuccess('Image principale uploadée avec succès');
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Upload images galerie
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setLoading(true);
      
      try {
        const uploadPromises = files.map(file => uploadToCloudinary(file));
        const urls = await Promise.all(uploadPromises);
        
        const newImages = urls.map(url => ({ url, caption: '' }));
        setFormData({
          ...formData,
          images: [...formData.images, ...newImages]
        });
        
        showSuccess(`${urls.length} image(s) uploadée(s) avec succès`);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const removeGalleryImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
    
    const newFiles = [...imageFiles.gallery];
    newFiles.splice(index, 1);
    setImageFiles({ ...imageFiles, gallery: newFiles });
  };

  const updateImageCaption = (index: number, caption: string) => {
    const newImages = [...formData.images];
    newImages[index].caption = caption;
    setFormData({ ...formData, images: newImages });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combiner date + heure pour visibleFrom
      let visibleFromDate: Date | string = formData.visibleFrom;
      if (formData.visibleFrom) {
        const [hours, minutes] = visibleFromTime.split(':');
        visibleFromDate = new Date(`${formData.visibleFrom}T${hours}:${minutes}:00`).toISOString();
      }
      
      // Combiner date + heure pour visibleUntil
      let visibleUntilDate: string | null = null;
      if (formData.visibleUntil) {
        const [hours, minutes] = visibleUntilTime.split(':');
        visibleUntilDate = new Date(`${formData.visibleUntil}T${hours}:${minutes}:00`).toISOString();
      }
      
      const projectData = {
        ...formData,
        visibleFrom: visibleFromDate,
        visibleUntil: visibleUntilDate
      };
      
      const url = isEdit ? `/api/projects/${id}` : '/api/projects';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        showSuccess(isEdit ? 'Projet modifié avec succès' : 'Projet créé avec succès');
        setTimeout(() => navigate('/admin/projects'), 1000);
      } else {
        const data = await response.json();
        showError(data.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showError('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };


  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="projects" />

      <main className="dashboard-main">
        <div className="admin-form-page">
        <div className="admin-header">
          <h1>{isEdit ? 'Modifier le Projet' : 'Nouveau Projet'}</h1>
          <button onClick={() => navigate('/admin/projects')} className="btn btn-secondary">
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          {/* Informations de base */}
          <div className="form-section">
            <h2>Informations de base</h2>
            
            <div className="form-group">
              <label>Titre du projet *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Description courte * (max 300 caractères)</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                maxLength={300}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Description complète *</label>
              <TextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Rédigez la description complète du projet..."
                height="400px"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pôle *</label>
                <select name="pole" value={formData.pole} onChange={handleChange} required>
                  <option value="">Sélectionnez...</option>
                  <option value="energie">Énergie</option>
                  <option value="geospatial">Géospatial</option>
                  <option value="drone">Drones</option>
                  <option value="sante">Santé</option>
                  <option value="securite">Sécurité</option>
                </select>
              </div>

              <div className="form-group">
                <label>Statut *</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="termine">Terminé</option>
                  <option value="en_cours">En cours</option>
                  <option value="pilote">Pilote</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h2>Images</h2>
            
            <div className="form-group">
              <label>Image principale *</label>
              
              {/* Upload file */}
              <div className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  id="mainImageUpload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="mainImageUpload" className="btn btn-upload">
                  📤 Uploader une image
                </label>
                <span className="upload-hint">ou entrez une URL ci-dessous</span>
              </div>

              {/* URL manuelle */}
              <input
                type="url"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
              
              {formData.mainImage && (
                <div className="image-preview">
                  <img src={formData.mainImage} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mainImage: '' })}
                    className="btn-remove-image"
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Galerie d'images</label>
              
              {/* Upload multiple files */}
              <div className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  id="galleryUpload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="galleryUpload" className="btn btn-upload">
                  📤 Uploader des images
                </label>
                <span className="upload-hint">Vous pouvez sélectionner plusieurs images</span>
              </div>

              {/* Ajout manuel d'URL */}
              <div className="gallery-input">
                <input
                  type="url"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  placeholder="Ou entrez une URL..."
                />
                <input
                  type="text"
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  placeholder="Légende (optionnel)"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newImage.url) {
                      setFormData({
                        ...formData,
                        images: [...formData.images, newImage]
                      });
                      setNewImage({ url: '', caption: '' });
                    }
                  }}
                  className="btn btn-secondary"
                >
                  Ajouter
                </button>
              </div>

              {formData.images.length > 0 && (
                <div className="gallery-preview">
                  {formData.images.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img src={img.url} alt={img.caption} />
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                        placeholder="Légende"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="btn-remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Avant / Après */}
          <div className="form-section">
            <h2>📸 Comparaison Avant / Après (optionnel)</h2>
            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '14px' }}>
              Ajoutez des images pour montrer l'état avant et après le projet
            </p>
            
            <div className="form-row">
              {/* Image AVANT */}
              <div className="form-group" style={{ flex: 1 }}>
                <label>🟦 Image AVANT</label>
                
                {/* Upload image avant */}
                <div className="upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setLoading(true);
                        try {
                          const url = await uploadToCloudinary(file);
                          setFormData({
                            ...formData,
                            beforeAfter: {
                              ...formData.beforeAfter,
                              before: { ...formData.beforeAfter.before, image: url }
                            }
                          });
                          showSuccess('Image AVANT uploadée avec succès');
                        } catch (error) {
                          console.error('Erreur:', error);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    id="beforeImageUpload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="beforeImageUpload" className="btn btn-upload">
                    📤 Uploader image AVANT
                  </label>
                </div>
                
                {/* URL manuelle */}
                <input
                  type="url"
                  name="beforeAfter.before.image"
                  value={formData.beforeAfter.before.image}
                  onChange={handleChange}
                  placeholder="URL de l'image AVANT (optionnel)"
                  style={{ marginTop: '10px' }}
                />
                
                {/* Description avant */}
                <textarea
                  name="beforeAfter.before.description"
                  value={formData.beforeAfter.before.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description de l'état AVANT..."
                  style={{ marginTop: '10px' }}
                />
                
                {/* Preview image avant */}
                {formData.beforeAfter.before.image && (
                  <div className="image-preview" style={{ marginTop: '10px' }}>
                    <img src={formData.beforeAfter.before.image} alt="Avant" />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        beforeAfter: {
                          ...formData.beforeAfter,
                          before: { image: '', description: formData.beforeAfter.before.description }
                        }
                      })}
                      className="btn-remove-image"
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>

              {/* Image APRÈS */}
              <div className="form-group" style={{ flex: 1 }}>
                <label>🟩 Image APRÈS</label>
                
                {/* Upload image après */}
                <div className="upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setLoading(true);
                        try {
                          const url = await uploadToCloudinary(file);
                          setFormData({
                            ...formData,
                            beforeAfter: {
                              ...formData.beforeAfter,
                              after: { ...formData.beforeAfter.after, image: url }
                            }
                          });
                          showSuccess('Image APRÈS uploadée avec succès');
                        } catch (error) {
                          console.error('Erreur:', error);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                    id="afterImageUpload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="afterImageUpload" className="btn btn-upload">
                    📤 Uploader image APRÈS
                  </label>
                </div>
                
                {/* URL manuelle */}
                <input
                  type="url"
                  name="beforeAfter.after.image"
                  value={formData.beforeAfter.after.image}
                  onChange={handleChange}
                  placeholder="URL de l'image APRÈS (optionnel)"
                  style={{ marginTop: '10px' }}
                />
                
                {/* Description après */}
                <textarea
                  name="beforeAfter.after.description"
                  value={formData.beforeAfter.after.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Description de l'état APRÈS..."
                  style={{ marginTop: '10px' }}
                />
                
                {/* Preview image après */}
                {formData.beforeAfter.after.image && (
                  <div className="image-preview" style={{ marginTop: '10px' }}>
                    <img src={formData.beforeAfter.after.image} alt="Après" />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        beforeAfter: {
                          ...formData.beforeAfter,
                          after: { image: '', description: formData.beforeAfter.after.description }
                        }
                      })}
                      className="btn-remove-image"
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="form-section">
            <h2>Localisation</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Ville *</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pays</label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Client et Témoignage */}
          <div className="form-section">
            <h2>Client et Témoignage</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nom du client</label>
                <input
                  type="text"
                  name="client.name"
                  value={formData.client.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Entreprise</label>
                <input
                  type="text"
                  name="client.company"
                  value={formData.client.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Témoignage</label>
              <textarea
                name="testimonial.text"
                value={formData.testimonial.text}
                onChange={handleChange}
                rows={4}
                placeholder="Témoignage du client..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Auteur du témoignage</label>
                <input
                  type="text"
                  name="testimonial.author"
                  value={formData.testimonial.author}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Poste</label>
                <input
                  type="text"
                  name="testimonial.position"
                  value={formData.testimonial.position}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Note (1-5)</label>
                <input
                  type="number"
                  name="testimonial.rating"
                  value={formData.testimonial.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                />
              </div>
            </div>
          </div>

          {/* Détails du projet */}
          <div className="form-section">
            <h2>Détails du projet</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Durée</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Ex: 3 mois"
                />
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Ex: 500 000 FCFA"
                />
              </div>
              <div className="form-group">
                <label>Équipe</label>
                <input
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="Ex: 5 ingénieurs"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Date du projet</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <h2>Tags</h2>
            <div className="tags-input">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Ajouter un tag"
              />
              <button type="button" onClick={addTag} className="btn btn-secondary">
                Ajouter
              </button>
            </div>
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Visibilité et Priorité */}
          <div className="form-section">
            <h2>Visibilité et Priorité</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                  />
                  ✅ Projet publié
                </label>
                <small style={{ display: 'block', marginTop: '8px', color: '#666', lineHeight: '1.5' }}>
                  <strong>⚠️ Conditions de visibilité :</strong><br/>
                  Le projet sera visible publiquement uniquement si :<br/>
                  • Cette case est cochée <strong>ET</strong><br/>
                  • La date "Visible à partir du" est passée ou aujourd'hui <strong>ET</strong><br/>
                  • La date "Visible jusqu'au" n'est pas dépassée (si définie)
                  {(() => {
                    const now = new Date();
                    const pubDate = formData.visibleFrom ? new Date(`${formData.visibleFrom}T${visibleFromTime}:00`) : null;
                    const expDate = formData.visibleUntil ? new Date(`${formData.visibleUntil}T${visibleUntilTime}:00`) : null;
                    
                    if (!formData.published) {
                      return <span style={{ color: '#d32f2f', fontWeight: 'bold' }}><br/>❌ Actuellement : Non visible (projet non publié)</span>;
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
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  ⭐ Mis en avant
                </label>
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

            <div className="form-row">
              <div className="form-group">
                <label>Visible à partir du</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="date"
                    name="visibleFrom"
                    value={formData.visibleFrom}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="time"
                    value={visibleFromTime}
                    onChange={(e) => setVisibleFromTime(e.target.value)}
                    style={{ width: '120px' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Visible jusqu'au (optionnel)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="date"
                    name="visibleUntil"
                    value={formData.visibleUntil}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="time"
                    value={visibleUntilTime}
                    onChange={(e) => setVisibleUntilTime(e.target.value)}
                    style={{ width: '120px' }}
                    disabled={!formData.visibleUntil}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer le projet')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="btn btn-secondary"
            >
              Annuler
            </button>
          </div>
        </form>
        </div>
      </main>
    </div>
  );
};

export default ProjectForm;

