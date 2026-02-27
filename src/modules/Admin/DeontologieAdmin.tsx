import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Aligné avec les autres uploads (photos, hero...) pour éviter les problèmes
// de variables d'environnement manquantes en prod.
const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET = 'onpg_uploads';

interface Deontologie {
  _id?: string;
  title: string;
  pdfUrl: string;
  description?: string;
  lastUpdated?: string;
  isActive: boolean;
}

const DeontologieAdmin = () => {
  const [deontologie, setDeontologie] = useState<Deontologie | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<Deontologie>({
    title: '',
    pdfUrl: '',
    description: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    isActive: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/deontologie`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const items = response.data.data || [];
      if (Array.isArray(items) && items.length > 0) {
        setDeontologie(items[0]);
        setFormData({
          title: items[0].title || '',
          pdfUrl: items[0].pdfUrl || '',
          description: items[0].description || '',
          lastUpdated: items[0].lastUpdated || new Date().toISOString().split('T')[0],
          isActive: items[0].isActive !== undefined ? items[0].isActive : true
        });
      } else {
        setDeontologie(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la déontologie:', error);
      setDeontologie(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Le fichier PDF ne doit pas dépasser 10 Mo');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || '');
      formData.append('resource_type', 'raw'); // Pour les PDFs

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const uploadData = await uploadResponse.json();
      setFormData((prev) => ({
        ...prev,
        pdfUrl: uploadData.secure_url
      }));
    } catch (error) {
      console.error('Erreur upload PDF:', error);
      setUploadError('Erreur lors de l\'upload du PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePdf = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce PDF du formulaire ?')) {
      setFormData((prev) => ({
        ...prev,
        pdfUrl: ''
      }));
      setUploadError(null);
    }
  };

  const handleDeleteDeontologie = async () => {
    if (!deontologie?._id) return;
    
    const confirmed = window.confirm(
      '⚠️ Attention : Cette action est irréversible.\n\n' +
      'Êtes-vous sûr de vouloir supprimer définitivement ce document de déontologie ?\n\n' +
      'Le PDF et toutes les informations associées seront supprimés.'
    );
    
    if (!confirmed) return;
    
    setDeleting(true);
    setMessage(null);
    
    try {
      await axios.delete(`${API_URL}/admin/deontologie/${deontologie._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      
      setMessage({ type: 'success', text: 'Document de déontologie supprimé avec succès.' });
      setDeontologie(null);
      setFormData({
        title: '',
        pdfUrl: '',
        description: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        isActive: true
      });
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du document.' });
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pdfUrl) {
      alert('Veuillez uploader un PDF');
      return;
    }

    try {
      if (deontologie?._id) {
        await axios.put(`${API_URL}/admin/deontologie/${deontologie._id}`, {
          ...formData,
          lastUpdated: new Date().toISOString().split('T')[0]
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
      } else {
        await axios.post(`${API_URL}/admin/deontologie`, {
          ...formData,
          lastUpdated: new Date().toISOString().split('T')[0]
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
      }
      setMessage({ type: 'success', text: 'Document de déontologie sauvegardé avec succès.' });
      await fetchData();
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde. Veuillez réessayer.' });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="deontologie" />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>📋 Gestion de la Déontologie</h1>
            <p style={{ fontSize: '1.05rem', marginTop: '0.4rem', color: '#666' }}>
              Gérez le document de déontologie pharmaceutique visible par les visiteurs
            </p>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#666' }}>Chargement...</div>
            </div>
          ) : (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Message de feedback */}
              {message && (
                <div
                  className={`message ${message.type}`}
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '10px',
                    background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: message.type === 'success' ? '#065f46' : '#991b1b',
                    border: `2px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{message.type === 'success' ? '✅' : '❌'}</span>
                  <span>{message.text}</span>
                </div>
              )}

              {/* Section: Document actuel */}
              {deontologie && (
                <div className="deontologie-current-section" style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  borderRadius: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
                        📄 Document actuel
                      </h3>
                      <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Document publié sur le site
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteDeontologie}
                      disabled={deleting}
                      className="btn-delete"
                      style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {deleting ? '⏳ Suppression...' : '🗑️ Supprimer le document'}
                    </button>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ color: '#374151', fontSize: '1rem' }}>Titre :</strong>
                      <p style={{ color: '#111827', fontSize: '1.1rem', marginTop: '0.25rem', fontWeight: '600' }}>
                        {deontologie.title || 'Sans titre'}
                      </p>
                    </div>

                    {deontologie.description && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong style={{ color: '#374151', fontSize: '1rem' }}>Description :</strong>
                        <p style={{ color: '#4b5563', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                          {deontologie.description}
                        </p>
                      </div>
                    )}

                    {deontologie.pdfUrl ? (
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <a
                          href={deontologie.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: '#9b59b6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#8e44ad'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#9b59b6'}
                        >
                          👁️ Voir le PDF
                        </a>
                        <span style={{
                          padding: '0.5rem 1rem',
                          background: deontologie.isActive ? '#d1fae5' : '#fee2e2',
                          color: deontologie.isActive ? '#065f46' : '#991b1b',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {deontologie.isActive ? '✓ Actif' : '✗ Inactif'}
                        </span>
                        {deontologie.lastUpdated && (
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                            📅 Mis à jour : {new Date(deontologie.lastUpdated).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: '600' }}>
                        ⚠️ Aucun PDF associé
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Formulaire */}
              <div className="deontologie-form-section" style={{
                padding: '2.5rem',
                background: 'white',
                borderRadius: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #e5e7eb'
              }}>
                <h2 style={{
                  marginBottom: '2rem',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {deontologie ? '✏️ Modifier le document' : '➕ Créer un nouveau document'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Titre */}
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        marginBottom: '0.75rem',
                        fontWeight: '700',
                        fontSize: '1.05rem',
                        color: '#374151'
                      }}>
                        Titre du document <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Ex: Code de déontologie des pharmaciens du Gabon"
                        style={{
                          width: '100%',
                          fontSize: '1rem',
                          padding: '0.875rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#9b59b6'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        marginBottom: '0.75rem',
                        fontWeight: '700',
                        fontSize: '1.05rem',
                        color: '#374151'
                      }}>
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="Description du document de déontologie (optionnel)"
                        style={{
                          width: '100%',
                          fontSize: '1rem',
                          padding: '0.875rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#9b59b6'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                      />
                    </div>

                    {/* Fichier PDF */}
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        marginBottom: '0.75rem',
                        fontWeight: '700',
                        fontSize: '1.05rem',
                        color: '#374151'
                      }}>
                        Fichier PDF <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        padding: '1.5rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #d1d5db'
                      }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="btn-primary"
                            style={{
                              fontSize: '1rem',
                              padding: '0.875rem 1.75rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            {uploading ? '⏳ Upload en cours...' : '📄 Choisir un fichier PDF'}
                          </button>
                          {formData.pdfUrl && (
                            <>
                              <a
                                href={formData.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.875rem 1.5rem',
                                  background: '#10b981',
                                  color: 'white',
                                  textDecoration: 'none',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  fontSize: '0.95rem'
                                }}
                              >
                                👁️ Prévisualiser
                              </a>
                              <button
                                type="button"
                                onClick={handleDeletePdf}
                                style={{
                                  padding: '0.875rem 1.5rem',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  fontSize: '0.95rem',
                                  cursor: 'pointer'
                                }}
                              >
                                🗑️ Retirer
                              </button>
                            </>
                          )}
                        </div>
                        {uploadError && (
                          <div style={{
                            padding: '0.75rem',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginTop: '0.5rem'
                          }}>
                            ❌ {uploadError}
                          </div>
                        )}
                        {formData.pdfUrl && !uploadError && (
                          <div style={{
                            padding: '0.75rem',
                            background: '#d1fae5',
                            color: '#065f46',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            ✅ PDF sélectionné et prêt à être sauvegardé
                          </div>
                        )}
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.75rem' }}>
                          📌 Format accepté : PDF uniquement (max 10 Mo)
                        </p>
                      </div>
                    </div>

                    {/* Date de mise à jour */}
                    <div className="form-group">
                      <label style={{
                        display: 'block',
                        marginBottom: '0.75rem',
                        fontWeight: '700',
                        fontSize: '1.05rem',
                        color: '#374151'
                      }}>
                        Date de mise à jour
                      </label>
                      <input
                        type="date"
                        value={formData.lastUpdated}
                        onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
                        style={{
                          width: '100%',
                          fontSize: '1rem',
                          padding: '0.875rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          maxWidth: '300px'
                        }}
                      />
                    </div>

                    {/* Statut actif */}
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '10px'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        id="isActive"
                        style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                      />
                      <label htmlFor="isActive" style={{
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        color: '#374151',
                        cursor: 'pointer'
                      }}>
                        Document actif (visible sur le site)
                      </label>
                    </div>

                    {/* Boutons d'action */}
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '1rem',
                      paddingTop: '1.5rem',
                      borderTop: '2px solid #e5e7eb'
                    }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={!formData.pdfUrl || uploading}
                        style={{
                          fontSize: '1.1rem',
                          padding: '1rem 2.5rem',
                          fontWeight: '700',
                          borderRadius: '10px',
                          flex: 1,
                          maxWidth: '300px'
                        }}
                      >
                        {deontologie ? '💾 Enregistrer les modifications' : '➕ Créer le document'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeontologieAdmin;











