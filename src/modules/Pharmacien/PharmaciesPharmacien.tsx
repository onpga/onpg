import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';
import './PharmaciesPharmacien.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

// Cloudinary : variables d'env si dispo, sinon valeurs par défaut du projet
const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'onpg_uploads';

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
  horaires: {
    lundi?: string;
    mardi?: string;
    mercredi?: string;
    jeudi?: string;
    vendredi?: string;
    samedi?: string;
    dimanche?: string;
  };
  garde?: boolean;
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

const EMPTY_HORAIRES = {
  lundi: '',
  mardi: '',
  mercredi: '',
  jeudi: '',
  vendredi: '',
  samedi: '',
  dimanche: ''
};

const normalizeHoraires = (horaires?: Pharmacie['horaires']) => ({
  lundi: horaires?.lundi ?? '',
  mardi: horaires?.mardi ?? '',
  mercredi: horaires?.mercredi ?? '',
  jeudi: horaires?.jeudi ?? '',
  vendredi: horaires?.vendredi ?? '',
  samedi: horaires?.samedi ?? '',
  dimanche: horaires?.dimanche ?? ''
});

const PharmaciesPharmacien = () => {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPharmacie, setEditingPharmacie] = useState<Pharmacie | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activePharmacieId, setActivePharmacieId] = useState<string | null>(null);
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
    horaires: { ...EMPTY_HORAIRES },
    garde: false
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

  // Références pour faire défiler automatiquement vers les formulaires
  const formRef = useRef<HTMLDivElement | null>(null);
  const messageFormRef = useRef<HTMLDivElement | null>(null);

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

  // Quand on ouvre le formulaire pharmacie, on fait défiler la page jusqu'à lui
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Sécurité : forcer aussi le scroll de la fenêtre tout en bas
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [showForm]);

  // Même chose pour le formulaire de message / alerte
  useEffect(() => {
    if (showMessageForm && messageFormRef.current) {
      messageFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [showMessageForm]);

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
          latitude: '', longitude: '', telephone: '', email: '', 
          horaires: { lundi: '', mardi: '', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: '' },
          garde: false
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        alert('Erreur: ' + (errorData.error || 'Erreur lors de la sauvegarde'));
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
      <main className="admin-main pharmacies-pharmacien-page">
        <div className="admin-content pharmacies-pharmacien-content">
          <div className="pharmacies-header">
            <div>
              <h1>Mes Pharmacies</h1>
              <p className="pharmacies-header-subtitle">
                Pilotez vos informations, horaires et alertes depuis un espace premium.
              </p>
              <div className="pharmacies-header-kpis">
                <span className="pharmacies-header-kpi">
                  {pharmacies.length} pharmacie{pharmacies.length > 1 ? 's' : ''}
                </span>
                <span className="pharmacies-header-kpi">
                  {pharmacies.filter((p) => p.garde).length} de garde
                </span>
              </div>
            </div>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingPharmacie(null);
                setFormData({
                  nom: '', ville: '', quartier: '', adresse: '', photo: '',
                  latitude: '', longitude: '', telephone: '', email: '', 
                  horaires: { ...EMPTY_HORAIRES },
                  garde: false
                });
                setShowForm(true);
              }}
            >
              Nouvelle pharmacie
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
            <div className="pharmacies-grid">
              {pharmacies.map((pharmacie) => (
                <div
                  key={pharmacie._id}
                  className={`pharmacie-card ${activePharmacieId === pharmacie._id ? 'active' : ''}`}
                  onClick={() => {
                    setActivePharmacieId(pharmacie._id);
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
                      horaires: normalizeHoraires(pharmacie.horaires),
                      garde: pharmacie.garde || false
                    });
                    setShowForm(true);
                  }}
                >
                  <img 
                    src={pharmacie.photo || '/logopharmacie.jpg'} 
                    alt={pharmacie.nom}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== window.location.origin + '/logopharmacie.jpg') {
                        target.src = '/logopharmacie.jpg';
                      }
                    }}
                    className="pharmacie-card-image"
                  />
                  <h3 className="pharmacie-card-title">
                    {pharmacie.nom}
                    {pharmacie.garde && (
                      <span className="pharmacie-garde-pill">
                        De garde
                      </span>
                    )}
                  </h3>
                  <p><strong>📍</strong> {pharmacie.adresse}, {pharmacie.quartier}, {pharmacie.ville}</p>
                  {pharmacie.telephone && <p><strong>📞</strong> {pharmacie.telephone}</p>}
                  {pharmacie.email && <p><strong>✉️</strong> {pharmacie.email}</p>}
                  {pharmacie.horaires && Object.keys(pharmacie.horaires).some(k => pharmacie.horaires?.[k as keyof typeof pharmacie.horaires]) && (
                    <div className="pharmacie-card-info-block">
                      <strong className="pharmacie-card-block-title">🕐 Horaires :</strong>
                      {pharmacie.horaires.lundi && <div>Lun: {pharmacie.horaires.lundi}</div>}
                      {pharmacie.horaires.mardi && <div>Mar: {pharmacie.horaires.mardi}</div>}
                      {pharmacie.horaires.mercredi && <div>Mer: {pharmacie.horaires.mercredi}</div>}
                      {pharmacie.horaires.jeudi && <div>Jeu: {pharmacie.horaires.jeudi}</div>}
                      {pharmacie.horaires.vendredi && <div>Ven: {pharmacie.horaires.vendredi}</div>}
                      {pharmacie.horaires.samedi && <div>Sam: {pharmacie.horaires.samedi}</div>}
                      {pharmacie.horaires.dimanche && <div>Dim: {pharmacie.horaires.dimanche}</div>}
                    </div>
                  )}
                  
                  {pharmacie.messages && pharmacie.messages.length > 0 && (
                    <div className="pharmacie-card-info-block">
                      <strong className="pharmacie-card-block-title">Messages / Alertes :</strong>
                      {pharmacie.messages.map((msg) => (
                        <div key={msg._id} className="pharmacie-card-message-item">
                          <div className="pharmacie-card-message-top">
                            <div>
                              <strong>{msg.titre}</strong> ({msg.type})
                              <p className="pharmacie-card-message-content">{msg.contenu}</p>
                              <div className="pharmacie-card-message-visibility">
                                {msg.visibleVisiteurs && <span>👁️ Visiteurs </span>}
                                {msg.visibleOrdre && <span>👁️ Ordre </span>}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteMessage(pharmacie._id, msg._id)}
                              className="pharmacie-card-message-delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pharmacie-card-actions" onClick={(e) => e.stopPropagation()}>
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
                          horaires: normalizeHoraires(pharmacie.horaires),
                          garde: pharmacie.garde || false
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

          {/* Formulaire pharmacie - INLINE sur la même page */}
          {showForm && (
            <div
              ref={formRef}
              className="pharmacie-inline-form-card">
              <div className="pharmacie-inline-form-header">
                <h2>{editingPharmacie ? 'Modifier' : 'Nouvelle'} pharmacie</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPharmacie(null);
                    setFormData({
                      nom: '', ville: '', quartier: '', adresse: '', photo: '',
                      latitude: '', longitude: '', telephone: '', email: '', 
                      horaires: { ...EMPTY_HORAIRES },
                      garde: false
                    });
                  }}
                  className="btn-danger"
                >
                  Fermer
                </button>
              </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom de la pharmacie *</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                      className="pharmacie-form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ville *</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      required
                      className="pharmacie-form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Quartier</label>
                    <input
                      type="text"
                      value={formData.quartier}
                      onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                      className="pharmacie-form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse *</label>
                    <textarea
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      required
                      rows={3}
                      className="pharmacie-form-input"
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
                      className="pharmacie-form-input"
                    />
                    {formData.photo && (
                      <img src={formData.photo} alt="Preview" className="pharmacie-form-photo-preview" />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Localisation (GPS)</label>
                    <div className="pharmacie-form-gps-row">
                      <input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="pharmacie-form-input"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="pharmacie-form-input"
                      />
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="pharmacie-gps-btn"
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
                      className="pharmacie-form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pharmacie-form-input"
                    />
                  </div>

                  {/* Horaires */}
                  <div className="form-group pharmacie-form-section">
                    <label className="pharmacie-form-section-title">🕐 Horaires d'ouverture</label>
                    <div className="pharmacie-form-hours-grid">
                      {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((jour) => (
                        <div key={jour}>
                          <label className="pharmacie-form-day-label">
                            {jour}
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: 8h-20h"
                            value={formData.horaires[jour as keyof typeof formData.horaires] || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              horaires: { ...formData.horaires, [jour]: e.target.value }
                            })}
                            className="pharmacie-form-input"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Garde */}
                  <div className="form-group pharmacie-form-section">
                    <label className="pharmacie-form-check">
                      <input
                        type="checkbox"
                        checked={formData.garde}
                        onChange={(e) => setFormData({ ...formData, garde: e.target.checked })}
                        className="pharmacie-form-checkbox"
                      />
                      <span>🚨 Pharmacie de garde</span>
                    </label>
                  </div>

                  <div className="pharmacie-form-actions-row">
                    <button type="submit" className="btn-primary pharmacie-form-action-btn">
                      {editingPharmacie ? '💾 Modifier' : '✅ Créer'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingPharmacie(null);
                        setFormData({
                          nom: '', ville: '', quartier: '', adresse: '', photo: '',
                          latitude: '', longitude: '', telephone: '', email: '', 
                          horaires: { ...EMPTY_HORAIRES },
                          garde: false
                        });
                      }}
                      className="btn-secondary"
                      
                    >
                      Annuler
                    </button>
                  </div>
                </form>
            </div>
          )}

          {/* Formulaire message - INLINE sur la même page */}
          {showMessageForm && (
            <div
              ref={messageFormRef}
              className="pharmacie-inline-form-card">
              <div className="pharmacie-inline-form-header">
                <h2>Ajouter un message ou une alerte</h2>
                <button
                  onClick={() => {
                    setShowMessageForm(false);
                    setMessageForm({
                      pharmacieId: '',
                      type: 'visiteur',
                      titre: '',
                      contenu: '',
                      visibleVisiteurs: true,
                      visibleOrdre: false
                    });
                  }}
                  className="btn-danger"
                >
                  Fermer
                </button>
              </div>
                <form onSubmit={handleAddMessage}>
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      value={messageForm.type}
                      onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value as any })}
                      required
                      className="pharmacie-form-input"
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
                      className="pharmacie-form-input"
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
                      className="pharmacie-form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="pharmacie-form-check">
                      <input
                        type="checkbox"
                        checked={messageForm.visibleVisiteurs}
                        onChange={(e) => setMessageForm({ ...messageForm, visibleVisiteurs: e.target.checked })}
                        className="pharmacie-form-checkbox"
                      />
                      Visible aux visiteurs du site
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="pharmacie-form-check">
                      <input
                        type="checkbox"
                        checked={messageForm.visibleOrdre}
                        onChange={(e) => setMessageForm({ ...messageForm, visibleOrdre: e.target.checked })}
                        className="pharmacie-form-checkbox"
                      />
                      Visible à l'ordre des pharmaciens
                    </label>
                  </div>

                  <div className="pharmacie-form-actions-row">
                    <button type="submit" className="btn-primary pharmacie-form-action-btn">
                      ✅ Ajouter
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowMessageForm(false);
                        setMessageForm({
                          pharmacieId: '',
                          type: 'visiteur',
                          titre: '',
                          contenu: '',
                          visibleVisiteurs: true,
                          visibleOrdre: false
                        });
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PharmaciesPharmacien;

