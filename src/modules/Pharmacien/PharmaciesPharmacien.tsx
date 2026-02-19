import { useState, useEffect } from 'react';
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

interface Pharmacie {
  _id: string;
  nom: string;
  ville: string;
  quartier: string;
  adresse: string;
  photo: string;
  latitude?: number;
  longitude?: number;
  telephone: string;
  email: string;
  horaires: any;
  messages: Message[];
  createdAt: string;
}

interface Message {
  _id: string;
  type: 'visiteur' | 'ordre' | 'autre';
  titre: string;
  contenu: string;
  visibleVisiteurs: boolean;
  visibleOrdre: boolean;
  createdAt: string;
}

const PharmaciesPharmacien = () => {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPharmacie, setEditingPharmacie] = useState<Pharmacie | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    quartier: '',
    adresse: '',
    photo: '',
    latitude: '',
    longitude: '',
    telephone: '',
    email: '',
    horaires: {}
  });
  const [messageForm, setMessageForm] = useState({
    pharmacieId: '',
    type: 'visiteur' as 'visiteur' | 'ordre' | 'autre',
    titre: '',
    contenu: '',
    visibleVisiteurs: true,
    visibleOrdre: false
  });
  const [showMessageForm, setShowMessageForm] = useState(false);

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

    loadPharmacies();
  }, [navigate]);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const userId = userData._id;
      
      const response = await fetch(`${API_URL}/pharmacien/pharmacies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId,
          'x-user-data': JSON.stringify(userData)
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPharmacies(data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('Configuration Cloudinary manquante');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Erreur upload photo:', error);
      return '';
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (error) => {
          alert('Erreur géolocalisation: ' + error.message);
        }
      );
    } else {
      alert('Géolocalisation non supportée');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const userId = JSON.parse(localStorage.getItem('admin_user') || '{}')._id;

      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const url = editingPharmacie
        ? `${API_URL}/pharmacien/pharmacies/${editingPharmacie._id}`
        : `${API_URL}/pharmacien/pharmacies`;

      const response = await fetch(url, {
        method: editingPharmacie ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId,
          'x-user-data': JSON.stringify(userData),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await loadPharmacies();
        setShowForm(false);
        setEditingPharmacie(null);
        setFormData({
          nom: '', ville: '', quartier: '', adresse: '', photo: '',
          latitude: '', longitude: '', telephone: '', email: '', horaires: {}
        });
      }
    } catch (error) {
      console.error('Erreur sauvegarde pharmacie:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette pharmacie ?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const userId = JSON.parse(localStorage.getItem('admin_user') || '{}')._id;

      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const response = await fetch(`${API_URL}/pharmacien/pharmacies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId,
          'x-user-data': JSON.stringify(userData)
        }
      });

      if (response.ok) {
        await loadPharmacies();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const userId = JSON.parse(localStorage.getItem('admin_user') || '{}')._id;

      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const response = await fetch(
        `${API_URL}/pharmacien/pharmacies/${messageForm.pharmacieId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-id': userId,
            'x-user-data': JSON.stringify(userData),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: messageForm.type,
            titre: messageForm.titre,
            contenu: messageForm.contenu,
            visibleVisiteurs: messageForm.visibleVisiteurs,
            visibleOrdre: messageForm.visibleOrdre
          })
        }
      );

      if (response.ok) {
        await loadPharmacies();
        setShowMessageForm(false);
        setMessageForm({
          pharmacieId: '',
          type: 'visiteur',
          titre: '',
          contenu: '',
          visibleVisiteurs: true,
          visibleOrdre: false
        });
      }
    } catch (error) {
      console.error('Erreur ajout message:', error);
    }
  };

  const handleDeleteMessage = async (pharmacieId: string, messageId: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const userId = JSON.parse(localStorage.getItem('admin_user') || '{}')._id;

      const userData = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const response = await fetch(
        `${API_URL}/pharmacien/pharmacies/${pharmacieId}/messages/${messageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-id': userId,
            'x-user-data': JSON.stringify(userData)
          }
        }
      );

      if (response.ok) {
        await loadPharmacies();
      }
    } catch (error) {
      console.error('Erreur suppression message:', error);
    }
  };

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="pharmacies" />
      <main className="admin-main">
        <div className="admin-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1>Mes Pharmacies</h1>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingPharmacie(null);
                setFormData({
                  nom: '', ville: '', quartier: '', adresse: '', photo: '',
                  latitude: '', longitude: '', telephone: '', email: '', horaires: {}
                });
                setShowForm(true);
              }}
            >
              ➕ Nouvelle Pharmacie
            </button>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : pharmacies.length === 0 ? (
            <div className="empty-state">
              <p>Vous n'avez pas encore de pharmacie enregistrée.</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                Ajouter ma première pharmacie
              </button>
            </div>
          ) : (
            <div className="pharmacies-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {pharmacies.map((pharmacie) => (
                <div key={pharmacie._id} className="pharmacie-card" style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {pharmacie.photo && (
                    <img 
                      src={pharmacie.photo} 
                      alt={pharmacie.nom}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                    />
                  )}
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{pharmacie.nom}</h3>
                  <p><strong>📍</strong> {pharmacie.adresse}, {pharmacie.quartier}, {pharmacie.ville}</p>
                  {pharmacie.telephone && <p><strong>📞</strong> {pharmacie.telephone}</p>}
                  {pharmacie.email && <p><strong>✉️</strong> {pharmacie.email}</p>}
                  
                  {pharmacie.messages && pharmacie.messages.length > 0 && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <strong>Messages/Alerte :</strong>
                      {pharmacie.messages.map((msg) => (
                        <div key={msg._id} style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                              <strong>{msg.titre}</strong> ({msg.type})
                              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{msg.contenu}</p>
                              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                                {msg.visibleVisiteurs && <span>👁️ Visiteurs </span>}
                                {msg.visibleOrdre && <span>👁️ Ordre </span>}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteMessage(pharmacie._id, msg._id)}
                              style={{ background: 'red', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        setEditingPharmacie(pharmacie);
                        setFormData({
                          nom: pharmacie.nom,
                          ville: pharmacie.ville,
                          quartier: pharmacie.quartier,
                          adresse: pharmacie.adresse,
                          photo: pharmacie.photo,
                          latitude: pharmacie.latitude?.toString() || '',
                          longitude: pharmacie.longitude?.toString() || '',
                          telephone: pharmacie.telephone,
                          email: pharmacie.email,
                          horaires: pharmacie.horaires
                        });
                        setShowForm(true);
                      }}
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDelete(pharmacie._id)}
                    >
                      🗑️ Supprimer
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        setMessageForm({
                          ...messageForm,
                          pharmacieId: pharmacie._id,
                          type: 'visiteur',
                          titre: '',
                          contenu: '',
                          visibleVisiteurs: true,
                          visibleOrdre: false
                        });
                        setShowMessageForm(true);
                      }}
                    >
                      💬 Ajouter Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire pharmacie */}
          {showForm && (
            <div className="modal-overlay" onClick={() => {
              setShowForm(false);
              setEditingPharmacie(null);
            }}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}>
                <h2>{editingPharmacie ? 'Modifier' : 'Nouvelle'} Pharmacie</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom de la pharmacie *</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ville *</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      required
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Quartier</label>
                    <input
                      type="text"
                      value={formData.quartier}
                      onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse *</label>
                    <textarea
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      required
                      rows={3}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handlePhotoUpload(file);
                          setFormData({ ...formData, photo: url });
                        }
                      }}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                    {formData.photo && (
                      <img src={formData.photo} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '8px' }} />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Localisation (GPS)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        style={{ padding: '0.75rem 1rem', background: '#00A651', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        📍 GPS
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>
                      {editingPharmacie ? 'Modifier' : 'Créer'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingPharmacie(null);
                      }}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Formulaire message */}
          {showMessageForm && (
            <div className="modal-overlay" onClick={() => setShowMessageForm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '90%'
              }}>
                <h2>Ajouter un Message/Alerte</h2>
                <form onSubmit={handleAddMessage}>
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      value={messageForm.type}
                      onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value as any })}
                      required
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    >
                      <option value="visiteur">Message pour visiteurs</option>
                      <option value="ordre">Message pour l'ordre</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Titre *</label>
                    <input
                      type="text"
                      value={messageForm.titre}
                      onChange={(e) => setMessageForm({ ...messageForm, titre: e.target.value })}
                      required
                      placeholder="Ex: Rupture de stock Doliprane"
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Contenu *</label>
                    <textarea
                      value={messageForm.contenu}
                      onChange={(e) => setMessageForm({ ...messageForm, contenu: e.target.value })}
                      required
                      rows={4}
                      placeholder="Détails du message..."
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={messageForm.visibleVisiteurs}
                        onChange={(e) => setMessageForm({ ...messageForm, visibleVisiteurs: e.target.checked })}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Visible aux visiteurs du site
                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={messageForm.visibleOrdre}
                        onChange={(e) => setMessageForm({ ...messageForm, visibleOrdre: e.target.checked })}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Visible à l'ordre des pharmaciens
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>
                      Ajouter
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                    >
                      Annuler
                    </button>
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

export default PharmaciesPharmacien;

