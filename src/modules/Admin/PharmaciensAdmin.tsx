import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { useToast } from '../../components/Toast';
import './Dashboard.css';
import './PharmaciensAdmin.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Configuration Cloudinary alignée sur la page Admin Settings
// On évite d'utiliser uniquement les variables d'environnement Vite,
// qui peuvent ne pas être correctement exposées en production.
const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET = 'onpg_uploads';

interface Pharmacien {
  _id?: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  numeroOrdre?: number;
  nationalite?: string;
  section?: string;
  cotisationsAJour?: boolean;
  dateRetardCotisations?: string | null;
  isActive?: boolean;
  photo?: string;
  metierExerce?: string;
  role?: string;
  these?: string;
}

const PharmaciensAdmin = () => {
  const { showSuccess, showError, showWarning } = useToast();
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cotisationFilter, setCotisationFilter] = useState<'tous' | 'ajour' | 'retard'>('tous');
  const [nationaliteFilter, setNationaliteFilter] = useState<'toutes' | 'gabonais' | 'etrangers'>('toutes');
  const [sectionFilter, setSectionFilter] = useState<'toutes' | 'A' | 'B' | 'C' | 'D'>('toutes');
  const [editingItem, setEditingItem] = useState<Pharmacien | null>(null);
  const [viewingItem, setViewingItem] = useState<Pharmacien | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<Pharmacien>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numeroOrdre: undefined,
    nationalite: '',
    section: '',
    cotisationsAJour: true,
    dateRetardCotisations: null,
    isActive: true,
    photo: '',
    metierExerce: '',
    role: '',
    these: ''
  });

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/pharmaciens`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const items = response.data.data || [];
      setPharmaciens(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Erreur lors du chargement des pharmaciens:', error);
      setPharmaciens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPharmaciens = useMemo(
    () =>
      normalizedQuery
        ? pharmaciens.filter((p) => {
            const haystack = `${p.nom || ''} ${p.prenom || ''} ${p.telephone || ''} ${p.numeroOrdre || ''} ${
              p.nationalite || ''
            } ${p.section || ''}`.toLowerCase();
            return haystack.includes(normalizedQuery);
          })
        : pharmaciens,
    [normalizedQuery, pharmaciens]
  );

  const isGabonais = (nationalite?: string) => {
    if (!nationalite) return false;
    const n = nationalite.toLowerCase();
    return n.includes('gabon');
  };

  const visiblePharmaciens = useMemo(
    () =>
      filteredPharmaciens.filter((p) => {
        let okCotisation = true;
        if (cotisationFilter === 'ajour') {
          okCotisation = p.cotisationsAJour !== false;
        } else if (cotisationFilter === 'retard') {
          okCotisation = p.cotisationsAJour === false;
        }

        let okNat = true;
        if (nationaliteFilter === 'gabonais') {
          okNat = isGabonais(p.nationalite);
        } else if (nationaliteFilter === 'etrangers') {
          okNat = !!p.nationalite && !isGabonais(p.nationalite);
        }

        const okSection = sectionFilter === 'toutes' ? true : (p.section || '') === sectionFilter;
        return okCotisation && okNat && okSection;
      }),
    [filteredPharmaciens, cotisationFilter, nationaliteFilter, sectionFilter]
  );

  const totalPharmaciens = pharmaciens.length;
  const totalCotisationsAjour = pharmaciens.filter(p => p.cotisationsAJour !== false).length;
  const totalCotisationsRetard = pharmaciens.filter(p => p.cotisationsAJour === false).length;
  const sectionA = pharmaciens.filter(p => p.section === 'A').length;
  const sectionB = pharmaciens.filter(p => p.section === 'B').length;
  const sectionC = pharmaciens.filter(p => p.section === 'C').length;
  const sectionD = pharmaciens.filter(p => p.section === 'D').length;
  const totalGabonais = pharmaciens.filter(p => isGabonais(p.nationalite)).length;
  const totalEtrangers = pharmaciens.filter(
    p => p.nationalite && !isGabonais(p.nationalite)
  ).length;
  const hasFilters =
    searchQuery.trim() !== '' ||
    cotisationFilter !== 'tous' ||
    nationaliteFilter !== 'toutes' ||
    sectionFilter !== 'toutes';

  const resetFilters = () => {
    setSearchQuery('');
    setCotisationFilter('tous');
    setNationaliteFilter('toutes');
    setSectionFilter('toutes');
  };

  const getStatusLabel = (p: Pharmacien) => {
    if (p.isActive === false) return 'Inactif';
    return p.cotisationsAJour === false ? 'Cotisation en retard' : 'Actif';
  };

  const getStatusClass = (p: Pharmacien) => {
    if (p.isActive === false) return 'inactive';
    return p.cotisationsAJour === false ? 'warning' : 'success';
  };

  const handleEdit = (pharmacien: Pharmacien) => {
    setEditingItem(pharmacien);
    setFormData({
      nom: pharmacien.nom || '',
      prenom: pharmacien.prenom || '',
      email: pharmacien.email || '',
      telephone: pharmacien.telephone || '',
      numeroOrdre: pharmacien.numeroOrdre,
      nationalite: pharmacien.nationalite || '',
      section: pharmacien.section || '',
      cotisationsAJour: pharmacien.cotisationsAJour !== undefined ? pharmacien.cotisationsAJour : true,
      dateRetardCotisations: pharmacien.dateRetardCotisations || null,
      isActive: pharmacien.isActive !== undefined ? pharmacien.isActive : true,
      photo: pharmacien.photo || '',
      metierExerce: pharmacien.metierExerce || pharmacien.role || '',
      role: pharmacien.role || '',
      these: pharmacien.these || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce pharmacien ?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/pharmaciens/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchData();
      showSuccess('Pharmacien supprimé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression.' });
      showError('Erreur lors de la suppression.');
    }
  };

  const handleNew = () => {
    setEditingItem(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      numeroOrdre: undefined,
      nationalite: '',
      section: '',
      cotisationsAJour: true,
      dateRetardCotisations: null,
      isActive: true,
      photo: '',
      metierExerce: '',
      role: '',
      these: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem && editingItem._id) {
        // Modification
        await axios.put(`${API_URL}/admin/pharmaciens/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
      } else {
        // Création
        await axios.post(`${API_URL}/admin/pharmaciens`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
      }
      setMessage({
        type: 'success',
        text: editingItem ? 'Pharmacien mis à jour avec succès.' : 'Pharmacien créé avec succès.'
      });
      showSuccess(editingItem ? 'Pharmacien mis à jour avec succès.' : 'Pharmacien créé avec succès.');
      setShowForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde du pharmacien.' });
      showError('Erreur lors de la sauvegarde du pharmacien.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      numeroOrdre: undefined,
      nationalite: '',
      section: '',
      cotisationsAJour: true,
      dateRetardCotisations: null,
      isActive: true,
      photo: '',
      metierExerce: '',
      role: '',
      these: ''
    });
  };

  const handlePhotoUpload = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      showWarning(
        "Configuration d'upload image manquante. Veuillez définir VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    setUploadingPhoto(true);
    setUploadError(null);

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
        setFormData((prev) => ({ ...prev, photo: data.secure_url }));
      } else {
        console.error('Erreur upload Cloudinary:', data);
        setUploadError("Erreur lors de l'envoi de la photo");
      }
    } catch (err) {
      console.error('Erreur upload Cloudinary:', err);
      setUploadError("Erreur lors de l'envoi de la photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="pharmaciens" />
      <main className="dashboard-main">
        <div className="dashboard-header pharmaciens-header">
          <h1>Gestion des pharmaciens</h1>
          <p>Suivi des inscriptions, des statuts et des cotisations des pharmaciens.</p>
        </div>

        <section className="dashboard-section pharmaciens-kpis">
          <article className="pharma-kpi">
            <span>Total</span>
            <strong>{totalPharmaciens}</strong>
          </article>
          <article className="pharma-kpi">
            <span>À jour</span>
            <strong>{totalCotisationsAjour}</strong>
          </article>
          <article className="pharma-kpi">
            <span>Retard cotisation</span>
            <strong>{totalCotisationsRetard}</strong>
          </article>
          <article className="pharma-kpi">
            <span>Nationaux / Étrangers</span>
            <strong>{totalGabonais} / {totalEtrangers}</strong>
          </article>
          <article className="pharma-kpi">
            <span>Sections A/B/C/D</span>
            <strong>{sectionA} / {sectionB} / {sectionC} / {sectionD}</strong>
          </article>
        </section>

        <section className="dashboard-section">
          <div className="pharmaciens-toolbar">
            <div className="pharmaciens-toolbar-head">
              <h2>Liste des pharmaciens</h2>
              <p>
                {visiblePharmaciens.length} affiché(s) • {totalPharmaciens} total
              </p>
            </div>

            <div className="pharmaciens-toolbar-controls">
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou n° d'ordre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pharma-search"
              />

              <select
                value={cotisationFilter}
                onChange={(e) => setCotisationFilter(e.target.value as 'tous' | 'ajour' | 'retard')}
                className="pharma-select"
              >
                <option value="tous">Toutes les cotisations</option>
                <option value="ajour">Cotisations à jour uniquement</option>
                <option value="retard">Cotisations en retard</option>
              </select>

              <select
                value={nationaliteFilter}
                onChange={(e) =>
                  setNationaliteFilter(e.target.value as 'toutes' | 'gabonais' | 'etrangers')
                }
                className="pharma-select"
              >
                <option value="toutes">Toutes les nationalités</option>
                <option value="gabonais">Nationaux (Gabon)</option>
                <option value="etrangers">Étrangers</option>
              </select>

              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value as 'toutes' | 'A' | 'B' | 'C' | 'D')}
                className="pharma-select"
              >
                <option value="toutes">Toutes les sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>

              {hasFilters && (
                <button type="button" onClick={resetFilters} className="btn-secondary">
                  Réinitialiser
                </button>
              )}

              <button
                type="button"
                onClick={handleNew}
                className="btn-primary"
              >
                Nouveau pharmacien
              </button>
            </div>
          </div>

          {loading ? (
            <div className="pharmaciens-loading">Chargement...</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>N° d&apos;ordre</th>
                    <th>Section</th>
                    <th>Nationalité</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmaciens.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="pharmaciens-empty">
                        Aucun pharmacien enregistré
                      </td>
                    </tr>
                  ) : visiblePharmaciens.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="pharmaciens-empty">
                        Aucun pharmacien ne correspond aux critères de recherche / filtrage
                      </td>
                    </tr>
                  ) : (
                    visiblePharmaciens.map((pharmacien) => (
                      <tr key={pharmacien._id}>
                        <td>
                          {pharmacien.photo ? (
                            <img
                              src={pharmacien.photo}
                              alt={`${pharmacien.prenom} ${pharmacien.nom}`}
                              className="pharmaciens-avatar"
                            />
                          ) : (
                            <span className="pharmaciens-muted">—</span>
                          )}
                        </td>
                        <td>{pharmacien.nom || '—'}</td>
                        <td>{pharmacien.prenom || '—'}</td>
                        <td>{pharmacien.numeroOrdre || '—'}</td>
                        <td>{pharmacien.section || '—'}</td>
                        <td>{pharmacien.nationalite || '—'}</td>
                        <td>
                          <span className={`pharmaciens-badge ${getStatusClass(pharmacien)}`}>
                            {getStatusLabel(pharmacien)}
                          </span>
                        </td>
                        <td>
                          <div className="pharmaciens-actions">
                            <button
                              type="button"
                              onClick={() => {
                                setViewingItem(pharmacien);
                                setShowViewModal(true);
                              }}
                              className="pharmaciens-action-btn view"
                              aria-label="Voir le détail"
                              title="Voir"
                            >
                              Voir
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(pharmacien)}
                              className="pharmaciens-action-btn edit"
                              aria-label="Modifier"
                              title="Modifier"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => pharmacien._id && handleDelete(pharmacien._id)}
                              className="pharmaciens-action-btn delete"
                              aria-label="Supprimer"
                              title="Supprimer"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Formulaire en modal */}
        {showForm && (
          <div className="pharmaciens-modal-overlay" onClick={handleCancel}>
            <section
              className="dashboard-section pharmaciens-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pharmaciens-modal-header">
                <h2>{editingItem ? 'Modifier un pharmacien' : 'Nouveau pharmacien'}</h2>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="pharmaciens-modal-close"
                  aria-label="Fermer le formulaire"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="pharmaciens-form-grid">
                <div>
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>N° d&apos;ordre</label>
                  <input
                    type="number"
                    value={formData.numeroOrdre || ''}
                    onChange={(e) => setFormData({ ...formData, numeroOrdre: e.target.value ? parseInt(e.target.value) : undefined })}
                  />
                </div>
                <div>
                  <label>Nationalité</label>
                  <input
                    type="text"
                    value={formData.nationalite || ''}
                    onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: nom@exemple.com"
                  />
                </div>
                <div>
                  <label>Téléphone</label>
                  <input
                    type="text"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="Ex: 07 12 34 56"
                  />
                </div>
                <div>
                  <label>Section</label>
                  <select
                    value={formData.section || ''}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  >
                    <option value="">— Non assignée —</option>
                    <option value="A">Section A - Officinaux</option>
                    <option value="B">Section B - Biologistes</option>
                    <option value="C">Section C - Fonctionnaires</option>
                    <option value="D">Section D - Fabricants/Grossistes</option>
                  </select>
                </div>
                <div>
                  <label>Cotisations à jour</label>
                  <select
                    value={formData.cotisationsAJour ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, cotisationsAJour: e.target.value === 'true' })}
                  >
                    <option value="true">✅ Oui</option>
                    <option value="false">❌ Non</option>
                  </select>
                </div>
                <div>
                  <label>Date retard cotisations (si non à jour)</label>
                  <input
                    type="date"
                    value={formData.dateRetardCotisations ? new Date(formData.dateRetardCotisations).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateRetardCotisations: e.target.value || null })}
                    disabled={formData.cotisationsAJour}
                  />
                </div>
                <div>
                  <label>Actif</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  >
                    <option value="true">✅ Actif</option>
                    <option value="false">❌ Inactif</option>
                  </select>
                </div>
                <div className="pharmaciens-form-full">
                  <label>Photo du pharmacien</label>
                  <div className="pharmaciens-photo-upload">
                    <div className="pharmaciens-photo-row">
                      <div className="pharmaciens-photo-preview">
                        <img
                          src={formData.photo || ONPG_IMAGES.logo}
                          alt="Aperçu"
                          onError={(e) => { (e.target as HTMLImageElement).src = ONPG_IMAGES.logo; }}
                          className={formData.photo ? '' : 'logo-fallback'}
                        />
                      </div>
                      {formData.photo && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setFormData({ ...formData, photo: '' })}
                        >
                          Supprimer la photo
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePhotoUpload(file);
                        }
                      }}
                    />
                    {uploadingPhoto && (
                      <span className="pharmaciens-upload-info">Envoi de la photo...</span>
                    )}
                    {uploadError && (
                      <span className="pharmaciens-upload-error">{uploadError}</span>
                    )}
                    <input
                      type="text"
                      value={formData.photo || ''}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="Ou collez une URL d'image (https://...)"
                    />
                  </div>
                </div>
                <div>
                  <label>Métier exercé</label>
                  <input
                    type="text"
                    value={formData.metierExerce || ''}
                    onChange={(e) => setFormData({ ...formData, metierExerce: e.target.value, role: e.target.value })}
                    placeholder="Ex: Pharmacien titulaire, Biologiste médical..."
                  />
                </div>
                <div>
                  <label>Thèse</label>
                  <textarea
                    value={formData.these || ''}
                    onChange={(e) => setFormData({ ...formData, these: e.target.value })}
                    placeholder="Titre de la thèse..."
                    rows={3}
                  />
                </div>
                <div className="pharmaciens-form-actions pharmaciens-form-full">
                  <button type="button" onClick={handleCancel} className="btn-secondary">
                  Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Enregistrer les modifications' : 'Créer le pharmacien'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Message global de confirmation / erreur */}
        {message && (
          <section className="dashboard-section">
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          </section>
        )}

        {/* Modal de visualisation */}
        {showViewModal && viewingItem && (
          <div className="pharmaciens-modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="pharmaciens-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pharmaciens-modal-header">
                <h2>Détails du pharmacien</h2>
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="pharmaciens-modal-close"
                >
                  ✕
                </button>
              </div>

              <div className="pharmaciens-view-grid">
                {viewingItem.photo && (
                  <div className="pharmaciens-view-avatar-wrap">
                    <img
                      src={viewingItem.photo}
                      alt={`${viewingItem.prenom} ${viewingItem.nom}`}
                      className="pharmaciens-view-avatar"
                    />
                  </div>
                )}
                <div>
                  <strong>Nom:</strong>
                  <p>{viewingItem.nom || '—'}</p>
                </div>
                <div>
                  <strong>Prénom:</strong>
                  <p>{viewingItem.prenom || '—'}</p>
                </div>
                <div>
                  <strong>N° d&apos;ordre:</strong>
                  <p>{viewingItem.numeroOrdre || '—'}</p>
                </div>
                <div>
                  <strong>Nationalité:</strong>
                  <p>{viewingItem.nationalite || '—'}</p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>{viewingItem.email || '—'}</p>
                </div>
                <div>
                  <strong>Téléphone:</strong>
                  <p>{viewingItem.telephone || '—'}</p>
                </div>
                <div>
                  <strong>Section:</strong>
                  <p>
                    {viewingItem.section || <span className="pharmaciens-muted">— Non assignée</span>}
                  </p>
                </div>
                <div>
                  <strong>Cotisations à jour:</strong>
                  <p>
                    {viewingItem.cotisationsAJour ? (
                      <span className="pharmaciens-badge success">Oui</span>
                    ) : (
                      <span className="pharmaciens-badge warning">Non</span>
                    )}
                  </p>
                </div>
                {!viewingItem.cotisationsAJour && viewingItem.dateRetardCotisations && (
                  <div>
                    <strong>Date retard cotisations:</strong>
                    <p>
                      {new Date(viewingItem.dateRetardCotisations).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                <div>
                  <strong>Statut:</strong>
                  <p>
                    {viewingItem.isActive ? (
                      <span className="pharmaciens-badge success">Actif</span>
                    ) : (
                      <span className="pharmaciens-badge inactive">Inactif</span>
                    )}
                  </p>
                </div>
                {(viewingItem.metierExerce || viewingItem.role) && (
                  <div>
                    <strong>Métier exercé:</strong>
                    <p>{viewingItem.metierExerce || viewingItem.role}</p>
                  </div>
                )}
                {viewingItem.these && (
                  <div>
                    <strong>Thèse:</strong>
                    <p>{viewingItem.these}</p>
                  </div>
                )}
              </div>

              <div className="pharmaciens-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingItem);
                  }}
                  className="btn-edit"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="btn-secondary"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PharmaciensAdmin;
