import { useState, useEffect, FormEvent } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface Pharmacie {
  _id: string;
  nom: string;
  ville: string;
  quartier: string;
  adresse: string;
  telephone: string;
  email?: string;
  photo?: string;
  pharmacienId?: string;
  pharmacienNom?: string;
  latitude?: number | null;
  longitude?: number | null;
  garde?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

interface Pharmacien {
  _id: string;
  nom: string;
  prenom: string;
  username?: string;
}

const PharmaciesAdmin = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [associatingPharmacie, setAssociatingPharmacie] = useState<string | null>(null);
  const [selectedPharmacienId, setSelectedPharmacienId] = useState('');
  const [pharmacienSearch, setPharmacienSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingPharmacie, setEditingPharmacie] = useState<Pharmacie | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    quartier: '',
    adresse: '',
    telephone: '',
    email: '',
    latitude: '',
    longitude: '',
    garde: false,
    pharmacienId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      // Charger pharmacies
      const pharmaciesRes = await fetch(`${API_URL}/admin/pharmacies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pharmaciesData = await pharmaciesRes.json();
      console.log('Pharmacies chargées:', pharmaciesData);
      if (pharmaciesData.success) {
        setPharmacies(pharmaciesData.data || []);
      } else {
        console.error('Erreur API pharmacies:', pharmaciesData);
        setPharmacies([]);
      }

      // Charger pharmaciens
      const pharmaciensRes = await fetch(`${API_URL}/admin/pharmaciens`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pharmaciensData = await pharmaciensRes.json();
      setPharmaciens(pharmaciensData.data || []);

    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssociate = async (pharmacieId: string) => {
    if (!selectedPharmacienId) {
      alert('Veuillez sélectionner un pharmacien');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/pharmacies/${pharmacieId}/pharmacien`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pharmacienId: selectedPharmacienId })
      });

      if (response.ok) {
        await loadData();
        setAssociatingPharmacie(null);
        setSelectedPharmacienId('');
      }
    } catch (error) {
      console.error('Erreur association:', error);
    }
  };

  const getPharmacienName = (pharmacienId?: string) => {
    if (!pharmacienId) return '—';
    const pharmacien = pharmaciens.find(p => String(p._id) === String(pharmacienId));
    if (!pharmacien) return '—';
    return `${pharmacien.prenom} ${pharmacien.nom}`;
  };

  const openCreateForm = () => {
    setEditingPharmacie(null);
    setFormData({
      nom: '',
      ville: '',
      quartier: '',
      adresse: '',
      telephone: '',
      email: '',
      latitude: '',
      longitude: '',
      garde: false,
      pharmacienId: ''
    });
    setShowForm(true);
  };

  const openEditForm = (pharmacie: Pharmacie) => {
    setEditingPharmacie(pharmacie);
    setFormData({
      nom: pharmacie.nom || '',
      ville: pharmacie.ville || '',
      quartier: pharmacie.quartier || '',
      adresse: pharmacie.adresse || '',
      telephone: pharmacie.telephone || '',
      email: pharmacie.email || '',
      latitude: pharmacie.latitude != null ? String(pharmacie.latitude) : '',
      longitude: pharmacie.longitude != null ? String(pharmacie.longitude) : '',
      garde: pharmacie.garde || false,
      pharmacienId: pharmacie.pharmacienId ? String(pharmacie.pharmacienId) : ''
    });
    setShowForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitPharmacie = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const isEdit = !!editingPharmacie;
      const url = isEdit
        ? `${API_URL}/admin/pharmacies/${editingPharmacie!._id}`
        : `${API_URL}/admin/pharmacies`;
      const method = isEdit ? 'PUT' : 'POST';

      const payload: any = {
        nom: formData.nom,
        ville: formData.ville,
        quartier: formData.quartier,
        adresse: formData.adresse,
        telephone: formData.telephone,
        email: formData.email,
        garde: formData.garde
      };

      if (formData.latitude) payload.latitude = formData.latitude;
      if (formData.longitude) payload.longitude = formData.longitude;
      if (formData.pharmacienId) payload.pharmacienId = formData.pharmacienId;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error('Erreur création / édition pharmacie:', data);
        alert(data.error || 'Erreur lors de la sauvegarde de la pharmacie');
        return;
      }

      await loadData();
      setShowForm(false);
      setEditingPharmacie(null);
    } catch (error) {
      console.error('Erreur sauvegarde pharmacie:', error);
      alert('Erreur serveur lors de la sauvegarde de la pharmacie');
    }
  };

  const handleDeletePharmacie = async (pharmacie: Pharmacie) => {
    if (!window.confirm(`Supprimer la pharmacie « ${pharmacie.nom} » ?`)) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/pharmacies/${pharmacie._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error('Erreur suppression pharmacie:', data);
        alert(data.error || 'Erreur lors de la suppression de la pharmacie');
        return;
      }
      await loadData();
    } catch (error) {
      console.error('Erreur suppression pharmacie:', error);
      alert('Erreur serveur lors de la suppression de la pharmacie');
    }
  };

  const filteredPharmaciens = pharmaciens.filter((p) => {
    const q = pharmacienSearch.trim().toLowerCase();
    if (!q) return true;
    const fullName = `${p.prenom} ${p.nom}`.toLowerCase();
    const username = (p.username || '').toLowerCase();
    return fullName.includes(q) || username.includes(q);
  });

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="pharmacies" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>🏥 Gestion des Pharmacies</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Liste de toutes les pharmacies enregistrées. Vous pouvez créer, modifier, supprimer et associer
            chaque pharmacie à un pharmacien de l’Ordre.
          </p>

          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '1rem' }}
              onClick={openCreateForm}
            >
              ➕ Nouvelle pharmacie
            </button>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="table-container">
              <table className="data-table" style={{ fontSize: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Photo</th>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Nom</th>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Ville</th>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Quartier</th>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Adresse</th>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Pharmacien</th>
                    <th style={{ padding: '1rem', fontSize: '1.1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', fontSize: '1.1rem' }}>
                        Aucune pharmacie enregistrée
                      </td>
                    </tr>
                  ) : (
                    pharmacies.map((pharmacie) => (
                      <tr key={pharmacie._id}>
                        <td style={{ padding: '1rem' }}>
                          {pharmacie.photo ? (
                            <img
                              src={pharmacie.photo}
                              alt={pharmacie.nom}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            <div style={{ width: '60px', height: '60px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              🏥
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '600' }}>{pharmacie.nom}</td>
                        <td style={{ padding: '1rem' }}>{pharmacie.ville}</td>
                        <td style={{ padding: '1rem' }}>{pharmacie.quartier || '—'}</td>
                        <td style={{ padding: '1rem' }}>{pharmacie.adresse}</td>
                        <td style={{ padding: '1rem' }}>
                          {pharmacie.pharmacienId ? (
                            <span style={{ color: '#00A651', fontWeight: '500' }}>
                              {getPharmacienName(pharmacie.pharmacienId)}
                            </span>
                          ) : (
                            <span style={{ color: '#999' }}>— Non associée</span>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button
                            onClick={() => openEditForm(pharmacie)}
                            className="btn-secondary"
                            style={{ fontSize: '0.95rem', padding: '0.4rem 0.9rem', marginRight: '0.5rem' }}
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            onClick={() => {
                              setAssociatingPharmacie(pharmacie._id);
                              setSelectedPharmacienId(pharmacie.pharmacienId || '');
                            }}
                            className="btn-secondary"
                            style={{ fontSize: '0.95rem', padding: '0.4rem 0.9rem', marginRight: '0.5rem' }}
                          >
                            🔗 Associer
                          </button>
                          <button
                            onClick={() => handleDeletePharmacie(pharmacie)}
                            className="btn-secondary"
                            style={{ fontSize: '0.95rem', padding: '0.4rem 0.9rem', color: '#b91c1c' }}
                          >
                            🗑 Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal association */}
          {associatingPharmacie && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              onClick={() => setAssociatingPharmacie(null)}
            >
              <div
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  maxWidth: '500px',
                  width: '90%'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Associer une pharmacie</h2>
                <div className="form-group">
                  <label style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}>
                    Sélectionner un pharmacien
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou pseudo..."
                    value={pharmacienSearch}
                    onChange={(e) => setPharmacienSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.95rem',
                      marginTop: '0.25rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <select
                    value={selectedPharmacienId}
                    onChange={(e) => setSelectedPharmacienId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
                  >
                    <option value="">— Aucun —</option>
                    {filteredPharmaciens.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.prenom} {p.nom} {p.username && `(${p.username})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => handleAssociate(associatingPharmacie)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                  >
                    Associer
                  </button>
                  <button
                    onClick={() => setAssociatingPharmacie(null)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal création / édition de pharmacie */}
          {showForm && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              onClick={() => {
                setShowForm(false);
                setEditingPharmacie(null);
              }}
            >
              <div
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  maxWidth: '700px',
                  width: '95%',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                  {editingPharmacie ? 'Modifier la pharmacie' : 'Créer une nouvelle pharmacie'}
                </h2>
                <form onSubmit={handleSubmitPharmacie} className="settings-form">
                  <div className="form-group">
                    <label>Nom de la pharmacie</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Ville</label>
                      <input
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Quartier</label>
                      <input
                        type="text"
                        name="quartier"
                        value={formData.quartier}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Adresse complète</label>
                    <textarea
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleFormChange}
                      rows={2}
                      required
                    />
                  </div>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Téléphone</label>
                      <input
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Latitude (optionnel)</label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Longitude (optionnel)</label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        name="garde"
                        checked={formData.garde}
                        onChange={handleFormChange}
                      />
                      Pharmacie de garde
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Associer à un pharmacien de l’Ordre (optionnel)</label>
                    <select
                      name="pharmacienId"
                      value={formData.pharmacienId}
                      onChange={handleFormChange}
                    >
                      <option value="">— Aucun —</option>
                      {pharmaciens.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.prenom} {p.nom} {p.username && `(${p.username})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      💾 Enregistrer
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setShowForm(false);
                        setEditingPharmacie(null);
                      }}
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

export default PharmaciesAdmin;
