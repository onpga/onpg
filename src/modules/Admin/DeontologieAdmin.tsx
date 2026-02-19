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
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce PDF ?')) {
      setFormData((prev) => ({
        ...prev,
        pdfUrl: ''
      }));
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
      alert('Déontologie sauvegardée avec succès');
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="deontologie" />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Gestion de la Déontologie</h1>
        </div>

        <div className="admin-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                  {deontologie ? 'Modifier le PDF de déontologie' : 'Uploader le PDF de déontologie'}
                </h2>

                {deontologie && (
                  <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>PDF actuel :</p>
                    {deontologie.pdfUrl ? (
                      <a
                        href={deontologie.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#00A651', textDecoration: 'underline' }}
                      >
                        {deontologie.title || 'Voir le PDF'}
                      </a>
                    ) : (
                      <p style={{ color: '#666' }}>Aucun PDF uploadé</p>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Titre *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Ex: Code de déontologie des pharmaciens du Gabon"
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="Description du document de déontologie"
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Fichier PDF *
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="btn-primary"
                          style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}
                        >
                          {uploading ? 'Upload en cours...' : '📄 Parcourir'}
                        </button>
                        {formData.pdfUrl && (
                          <>
                            <a
                              href={formData.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#00A651', textDecoration: 'underline', fontSize: '1rem' }}
                            >
                              Voir le PDF
                            </a>
                            <button
                              type="button"
                              onClick={handleDeletePdf}
                              className="btn-delete"
                              style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                      {uploadError && (
                        <p style={{ color: '#e74c3c', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                          {uploadError}
                        </p>
                      )}
                      {formData.pdfUrl && !uploadError && (
                        <p style={{ color: '#27ae60', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                          ✅ PDF uploadé avec succès
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Date de mise à jour
                      </label>
                      <input
                        type="date"
                        value={formData.lastUpdated}
                        onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        id="isActive"
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="isActive" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Actif
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={!formData.pdfUrl}
                        style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
                      >
                        {deontologie ? 'Modifier' : 'Créer'}
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

