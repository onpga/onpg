import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface Pharmacien {
  _id?: string;
  nom: string;
  prenom: string;
  numeroOrdre?: number;
  nationalite?: string;
  section?: string;
  cotisationsAJour?: boolean;
  dateRetardCotisations?: string | null;
  isActive?: boolean;
  photo?: string;
  role?: string;
  these?: string;
}

const PharmaciensAdmin = () => {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Pharmacien | null>(null);
  const [viewingItem, setViewingItem] = useState<Pharmacien | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pharmacien>({
    nom: '',
    prenom: '',
    numeroOrdre: undefined,
    nationalite: '',
    section: '',
    cotisationsAJour: true,
    dateRetardCotisations: null,
    isActive: true,
    photo: '',
    role: '',
    these: ''
  });

  const formRef = useRef<HTMLDivElement>(null);

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

  const filteredPharmaciens = pharmaciens.filter((p) => {
    const haystack = `${p.nom || ''} ${p.prenom || ''} ${p.numeroOrdre || ''}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  const handleEdit = (pharmacien: Pharmacien) => {
    setEditingItem(pharmacien);
    setFormData({
      nom: pharmacien.nom || '',
      prenom: pharmacien.prenom || '',
      numeroOrdre: pharmacien.numeroOrdre,
      nationalite: pharmacien.nationalite || '',
      section: pharmacien.section || '',
      cotisationsAJour: pharmacien.cotisationsAJour !== undefined ? pharmacien.cotisationsAJour : true,
      dateRetardCotisations: pharmacien.dateRetardCotisations || null,
      isActive: pharmacien.isActive !== undefined ? pharmacien.isActive : true,
      photo: pharmacien.photo || '',
      role: pharmacien.role || '',
      these: pharmacien.these || ''
    });
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce pharmacien ?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/pharmaciens/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleNew = () => {
    setEditingItem(null);
    setFormData({
      nom: '',
      prenom: '',
      numeroOrdre: undefined,
      nationalite: '',
      section: '',
      cotisationsAJour: true,
      dateRetardCotisations: null,
      isActive: true,
      photo: '',
      role: '',
      these: ''
    });
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
      setShowForm(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      nom: '',
      prenom: '',
      numeroOrdre: undefined,
      nationalite: '',
      section: '',
      cotisationsAJour: true,
      dateRetardCotisations: null,
      isActive: true,
      photo: '',
      role: '',
      these: ''
    });
  };

  const handlePhotoUpload = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert(
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
        <div className="dashboard-header">
          <h1>👨‍⚕️ Gestion des pharmaciens</h1>
          <p>Gérez la liste des pharmaciens inscrits à l&apos;Ordre</p>
        </div>

        <section className="dashboard-section">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h2>Liste des pharmaciens</h2>
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.95rem' }}>
                {pharmaciens.length} pharmacien(s) au total
                {searchQuery.trim()
                  ? ` • ${filteredPharmaciens.length} résultat(s) pour "${searchQuery}"`
                  : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou n° d'ordre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  minWidth: '260px',
                  padding: '0.7rem 0.9rem',
                  fontSize: '1rem',
                  borderRadius: '999px',
                  border: '2px solid #ddd'
                }}
              />
              <button
                onClick={handleNew}
                className="btn-primary"
                style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}
              >
                ➕ Nouveau pharmacien
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>N° d&apos;ordre</th>
                    <th>Nationalité</th>
                    <th>Cotisations à jour</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmaciens.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                        Aucun pharmacien enregistré
                      </td>
                    </tr>
                  ) : (
                    (filteredPharmaciens.length === 0 ? pharmaciens : filteredPharmaciens).map((pharmacien) => (
                      <tr key={pharmacien._id}>
                        <td>
                          {pharmacien.photo ? (
                            <img
                              src={pharmacien.photo}
                              alt={`${pharmacien.prenom} ${pharmacien.nom}`}
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <span style={{ color: '#999' }}>—</span>
                          )}
                        </td>
                        <td>{pharmacien.nom || '—'}</td>
                        <td>{pharmacien.prenom || '—'}</td>
                        <td>{pharmacien.numeroOrdre || '—'}</td>
                        <td>{pharmacien.nationalite || '—'}</td>
                        <td>
                          {pharmacien.cotisationsAJour ? (
                            <span style={{ color: '#27ae60' }}>✅</span>
                          ) : (
                            <span style={{ color: '#e74c3c' }}>❌</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setViewingItem(pharmacien);
                                setShowViewModal(true);
                              }}
                              className="btn-primary"
                              style={{ fontSize: '1rem', padding: '0.35rem 0.6rem' }}
                              aria-label="Voir le détail"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => handleEdit(pharmacien)}
                              className="btn-edit"
                              style={{ fontSize: '1rem', padding: '0.35rem 0.6rem' }}
                              aria-label="Modifier"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => pharmacien._id && handleDelete(pharmacien._id)}
                              className="btn-delete"
                              style={{ fontSize: '1rem', padding: '0.35rem 0.6rem' }}
                              aria-label="Supprimer"
                            >
                              🗑️
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

        {/* Formulaire intégré */}
        {showForm && (
          <section className="dashboard-section" ref={formRef}>
            <h2>{editingItem ? '✏️ Modifier un pharmacien' : '➕ Nouveau pharmacien'}</h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    N° d&apos;ordre
                  </label>
                  <input
                    type="number"
                    value={formData.numeroOrdre || ''}
                    onChange={(e) => setFormData({ ...formData, numeroOrdre: e.target.value ? parseInt(e.target.value) : undefined })}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Nationalité
                  </label>
                  <input
                    type="text"
                    value={formData.nationalite || ''}
                    onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Section
                  </label>
                  <select
                    value={formData.section || ''}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">— Non assignée —</option>
                    <option value="A">Section A - Officinaux</option>
                    <option value="B">Section B - Biologistes</option>
                    <option value="C">Section C - Fonctionnaires</option>
                    <option value="D">Section D - Fabricants/Grossistes</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Cotisations à jour
                  </label>
                  <select
                    value={formData.cotisationsAJour ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, cotisationsAJour: e.target.value === 'true' })}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="true">✅ Oui</option>
                    <option value="false">❌ Non</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Date retard cotisations (si non à jour)
                  </label>
                  <input
                    type="date"
                    value={formData.dateRetardCotisations ? new Date(formData.dateRetardCotisations).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateRetardCotisations: e.target.value || null })}
                    disabled={formData.cotisationsAJour}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px', opacity: formData.cotisationsAJour ? 0.5 : 1 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Actif
                  </label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="true">✅ Actif</option>
                    <option value="false">❌ Inactif</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Photo du pharmacien
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '2px solid #ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5'
                        }}
                      >
                        {formData.photo ? (
                          <img
                            src={formData.photo}
                            alt="Aperçu"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '1.5rem', color: '#aaa' }}>👤</span>
                        )}
                      </div>
                      {formData.photo && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '0.95rem', padding: '0.4rem 0.9rem' }}
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
                      style={{ fontSize: '0.95rem' }}
                    />
                    {uploadingPhoto && (
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Envoi de la photo...</span>
                    )}
                    {uploadError && (
                      <span style={{ fontSize: '0.9rem', color: '#e74c3c' }}>{uploadError}</span>
                    )}
                    <input
                      type="text"
                      value={formData.photo || ''}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="Ou collez une URL d'image (https://...)"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '2px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Rôle
                  </label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Ex: Pharmacien titulaire, Biologiste médical..."
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Thèse
                  </label>
                  <textarea
                    value={formData.these || ''}
                    onChange={(e) => setFormData({ ...formData, these: e.target.value })}
                    placeholder="Titre de la thèse..."
                    rows={3}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={handleCancel} className="btn-secondary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
                  {editingItem ? '💾 Enregistrer les modifications' : '➕ Créer le pharmacien'}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Modal de visualisation */}
        {showViewModal && viewingItem && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowViewModal(false)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>👁️ Détails du pharmacien</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Nom:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{viewingItem.nom || '—'}</p>
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Prénom:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{viewingItem.prenom || '—'}</p>
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>N° d&apos;ordre:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{viewingItem.numeroOrdre || '—'}</p>
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Nationalité:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{viewingItem.nationalite || '—'}</p>
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Section:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                    {viewingItem.section || <span style={{ color: '#999' }}>— Non assignée</span>}
                  </p>
                </div>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Cotisations à jour:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                    {viewingItem.cotisationsAJour ? (
                      <span style={{ color: '#27ae60' }}>✅ Oui</span>
                    ) : (
                      <span style={{ color: '#e74c3c' }}>❌ Non</span>
                    )}
                  </p>
                </div>
                {!viewingItem.cotisationsAJour && viewingItem.dateRetardCotisations && (
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Date retard cotisations:</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                      {new Date(viewingItem.dateRetardCotisations).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Statut:</strong>
                  <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                    {viewingItem.isActive ? (
                      <span style={{ color: '#27ae60' }}>✅ Actif</span>
                    ) : (
                      <span style={{ color: '#999' }}>❌ Inactif</span>
                    )}
                  </p>
                </div>
                {viewingItem.photo && (
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Photo:</strong>
                    <div style={{ margin: '0.5rem 0' }}>
                      <img
                        src={viewingItem.photo}
                        alt={`${viewingItem.prenom} ${viewingItem.nom}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                )}
                {viewingItem.role && (
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Rôle:</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{viewingItem.role}</p>
                  </div>
                )}
                {viewingItem.these && (
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Thèse:</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{viewingItem.these}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(viewingItem);
                  }}
                  className="btn-edit"
                  style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
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
