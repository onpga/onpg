import { FormEvent, useEffect, useMemo, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { useToast } from '../../components/Toast';
import './Dashboard.css';
import './PharmaciesAdmin.css';

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
  const { showSuccess, showError, showWarning } = useToast();
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [associatingPharmacie, setAssociatingPharmacie] = useState<string | null>(null);
  const [selectedPharmacienId, setSelectedPharmacienId] = useState('');
  const [pharmacienSearch, setPharmacienSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('toutes');
  const [gardeFilter, setGardeFilter] = useState<'toutes' | 'garde' | 'non-garde'>('toutes');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [message]);

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
      showWarning('Veuillez sélectionner un pharmacien.');
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
        setMessage({ type: 'success', text: 'Pharmacie associée avec succès.' });
        showSuccess('Pharmacie associée avec succès.');
      }
    } catch (error) {
      console.error('Erreur association:', error);
      setMessage({ type: 'error', text: "Erreur lors de l'association." });
      showError("Erreur lors de l'association.");
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
    const { name, value, type } = e.currentTarget;
    const checked = e.currentTarget instanceof HTMLInputElement ? e.currentTarget.checked : false;
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
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la sauvegarde de la pharmacie.' });
        return;
      }

      await loadData();
      setShowForm(false);
      setEditingPharmacie(null);
      setMessage({
        type: 'success',
        text: editingPharmacie ? 'Pharmacie mise à jour avec succès.' : 'Pharmacie créée avec succès.'
      });
      showSuccess(editingPharmacie ? 'Pharmacie mise à jour avec succès.' : 'Pharmacie créée avec succès.');
    } catch (error) {
      console.error('Erreur sauvegarde pharmacie:', error);
      setMessage({ type: 'error', text: 'Erreur serveur lors de la sauvegarde de la pharmacie.' });
      showError('Erreur serveur lors de la sauvegarde de la pharmacie.');
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
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression de la pharmacie.' });
        return;
      }
      await loadData();
      setMessage({ type: 'success', text: 'Pharmacie supprimée.' });
      showSuccess('Pharmacie supprimée.');
    } catch (error) {
      console.error('Erreur suppression pharmacie:', error);
      setMessage({ type: 'error', text: 'Erreur serveur lors de la suppression de la pharmacie.' });
      showError('Erreur serveur lors de la suppression de la pharmacie.');
    }
  };

  const filteredPharmaciens = pharmaciens.filter((p) => {
    const q = pharmacienSearch.trim().toLowerCase();
    if (!q) return true;
    const fullName = `${p.prenom} ${p.nom}`.toLowerCase();
    const username = (p.username || '').toLowerCase();
    return fullName.includes(q) || username.includes(q);
  });

  const uniqueCities = useMemo(
    () =>
      Array.from(
        new Set(
          pharmacies
            .map((p) => (p.ville || '').trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [pharmacies]
  );

  const visiblePharmacies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return pharmacies.filter((p) => {
      const haystack = `${p.nom || ''} ${p.ville || ''} ${p.quartier || ''} ${p.adresse || ''} ${p.telephone || ''}`.toLowerCase();
      const searchMatch = q ? haystack.includes(q) : true;
      const cityMatch = cityFilter === 'toutes' ? true : p.ville === cityFilter;
      const gardeMatch =
        gardeFilter === 'toutes'
          ? true
          : gardeFilter === 'garde'
            ? p.garde === true
            : p.garde !== true;
      return searchMatch && cityMatch && gardeMatch;
    });
  }, [pharmacies, searchQuery, cityFilter, gardeFilter]);

  const stats = useMemo(() => {
    const total = pharmacies.length;
    const garde = pharmacies.filter((p) => p.garde === true).length;
    const nonGarde = total - garde;
    const associees = pharmacies.filter((p) => !!p.pharmacienId).length;
    const nonAssociees = total - associees;
    return { total, garde, nonGarde, associees, nonAssociees };
  }, [pharmacies]);

  const hasFilters = searchQuery.trim() !== '' || cityFilter !== 'toutes' || gardeFilter !== 'toutes';

  const resetFilters = () => {
    setSearchQuery('');
    setCityFilter('toutes');
    setGardeFilter('toutes');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="pharmacies" />
      <main className="admin-main">
        <div className="admin-content">
          <h1 className="pharmacies-title">Gestion des pharmacies</h1>
          <p className="pharmacies-subtitle">
            Création, association et suivi des pharmacies.
          </p>

          {message && (
            <div className={`pharmacies-toast ${message.type}`}>
              {message.text}
            </div>
          )}

          <section className="dashboard-section pharmacies-kpis">
            <article className="pharmacy-kpi"><span>Total</span><strong>{stats.total}</strong></article>
            <article className="pharmacy-kpi"><span>De garde</span><strong>{stats.garde}</strong></article>
            <article className="pharmacy-kpi"><span>Hors garde</span><strong>{stats.nonGarde}</strong></article>
            <article className="pharmacy-kpi"><span>Associées</span><strong>{stats.associees}</strong></article>
            <article className="pharmacy-kpi"><span>Non associées</span><strong>{stats.nonAssociees}</strong></article>
          </section>

          <section className="dashboard-section pharmacies-toolbar">
            <div className="pharmacies-toolbar-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, ville, quartier, adresse..."
                className="pharmacies-search"
              />
              <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="pharmacies-select">
                <option value="toutes">Toutes les villes</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select
                value={gardeFilter}
                onChange={(e) => setGardeFilter(e.target.value as 'toutes' | 'garde' | 'non-garde')}
                className="pharmacies-select"
              >
                <option value="toutes">Toutes (garde)</option>
                <option value="garde">Pharmacies de garde</option>
                <option value="non-garde">Pharmacies hors garde</option>
              </select>
              {hasFilters && (
                <button type="button" className="btn-secondary" onClick={resetFilters}>
                  Réinitialiser
                </button>
              )}
              <button className="btn-primary" onClick={openCreateForm} type="button">
                Nouvelle pharmacie
              </button>
            </div>
            <p className="pharmacies-count">
              {visiblePharmacies.length} affichee(s) • {stats.total} total
            </p>
          </section>

          {loading ? (
            <p className="pharmacies-loading">Chargement...</p>
          ) : (
            <div className="table-container">
              <table className="data-table pharmacies-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Nom</th>
                    <th>Ville</th>
                    <th>Quartier</th>
                    <th>Adresse</th>
                    <th>Garde</th>
                    <th>Pharmacien</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="pharmacies-empty">
                        Aucune pharmacie enregistrée
                      </td>
                    </tr>
                  ) : visiblePharmacies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="pharmacies-empty">
                        Aucune pharmacie ne correspond aux filtres
                      </td>
                    </tr>
                  ) : (
                    visiblePharmacies.map((pharmacie) => (
                      <tr key={pharmacie._id}>
                        <td>
                          <img
                            src={pharmacie.photo || ONPG_IMAGES.logo}
                            alt={pharmacie.nom}
                            onError={(e) => { (e.target as HTMLImageElement).src = ONPG_IMAGES.logo; }}
                            className={`pharmacies-avatar ${pharmacie.photo ? 'has-photo' : 'is-fallback'}`}
                          />
                        </td>
                        <td className="pharmacies-name">{pharmacie.nom}</td>
                        <td>{pharmacie.ville}</td>
                        <td>{pharmacie.quartier || '—'}</td>
                        <td>{pharmacie.adresse}</td>
                        <td>
                          {pharmacie.garde ? (
                            <span className="pharmacies-badge guard">De garde</span>
                          ) : (
                            <span className="pharmacies-badge neutral">Hors garde</span>
                          )}
                        </td>
                        <td>
                          {pharmacie.pharmacienId ? (
                            <span className="pharmacies-badge linked">
                              {getPharmacienName(pharmacie.pharmacienId)}
                            </span>
                          ) : (
                            <span className="pharmacies-muted">— Non associee</span>
                          )}
                        </td>
                        <td>
                          <div className="pharmacies-actions">
                          <button
                            type="button"
                            onClick={() => openEditForm(pharmacie)}
                            className="pharmacies-action-btn edit"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAssociatingPharmacie(pharmacie._id);
                              setSelectedPharmacienId(pharmacie.pharmacienId || '');
                            }}
                            className="pharmacies-action-btn associate"
                          >
                            Associer
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePharmacie(pharmacie)}
                            className="pharmacies-action-btn delete"
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

          {/* Modal association */}
          {associatingPharmacie && (
            <div className="pharmacies-associate-overlay" onClick={() => setAssociatingPharmacie(null)}>
              <div className="pharmacies-associate-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="pharmacies-associate-title">Associer une pharmacie</h2>
                <div className="form-group">
                  <label className="pharmacies-associate-label">
                    Sélectionner un pharmacien
                  </label>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou pseudo..."
                    value={pharmacienSearch}
                    onChange={(e) => setPharmacienSearch(e.target.value)}
                    className="pharmacies-associate-search"
                  />
                  <select
                    value={selectedPharmacienId}
                    onChange={(e) => setSelectedPharmacienId(e.target.value)}
                    className="pharmacies-associate-select"
                  >
                    <option value="">— Aucun —</option>
                    {filteredPharmaciens.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.prenom} {p.nom} {p.username && `(${p.username})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pharmacies-associate-actions">
                  <button
                    onClick={() => handleAssociate(associatingPharmacie)}
                    className="btn-primary"
                    type="button"
                  >
                    Associer
                  </button>
                  <button
                    onClick={() => setAssociatingPharmacie(null)}
                    className="btn-secondary"
                    type="button"
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
              className="pharmacie-modal-overlay"
              onClick={() => {
                setShowForm(false);
                setEditingPharmacie(null);
              }}
            >
              <div
                className="pharmacie-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pharmacie-modal-header">
                  <div className="pharmacie-modal-icon">
                    {editingPharmacie ? '✏️' : '🏥'}
                  </div>
                  <h2 className="pharmacie-modal-title">
                  {editingPharmacie ? 'Modifier la pharmacie' : 'Créer une nouvelle pharmacie'}
                </h2>
                  <button
                    className="pharmacie-modal-close"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPharmacie(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitPharmacie} className="pharmacie-form">
                  {/* Section Informations principales */}
                  <div className="pharmacie-form-section">
                    <div className="pharmacie-section-header">
                      <span className="pharmacie-section-icon">📋</span>
                      <h3>Informations principales</h3>
                    </div>
                    <div className="pharmacie-form-group">
                      <label className="pharmacie-label">
                        <span className="pharmacie-label-icon">🏢</span>
                        Nom de la pharmacie <span className="required">*</span>
                      </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                        className="pharmacie-input"
                        placeholder="Ex: Pharmacie Centrale"
                      required
                    />
                  </div>
                    <div className="pharmacie-form-row">
                      <div className="pharmacie-form-group" style={{ flex: 1 }}>
                        <label className="pharmacie-label">
                          <span className="pharmacie-label-icon">📍</span>
                          Ville <span className="required">*</span>
                        </label>
                      <input
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleFormChange}
                          className="pharmacie-input"
                          placeholder="Ex: Libreville"
                        required
                      />
                    </div>
                      <div className="pharmacie-form-group" style={{ flex: 1 }}>
                        <label className="pharmacie-label">
                          <span className="pharmacie-label-icon">🏘️</span>
                          Quartier
                        </label>
                      <input
                        type="text"
                        name="quartier"
                        value={formData.quartier}
                        onChange={handleFormChange}
                          className="pharmacie-input"
                          placeholder="Ex: Mont-Bouët"
                      />
                    </div>
                  </div>
                    <div className="pharmacie-form-group">
                      <label className="pharmacie-label">
                        <span className="pharmacie-label-icon">🗺️</span>
                        Adresse complète <span className="required">*</span>
                      </label>
                    <textarea
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleFormChange}
                        className="pharmacie-textarea"
                        rows={3}
                        placeholder="Ex: Avenue Léon Mba, près du marché"
                      required
                    />
                    </div>
                  </div>

                  {/* Section Contact */}
                  <div className="pharmacie-form-section">
                    <div className="pharmacie-section-header">
                      <span className="pharmacie-section-icon">📞</span>
                      <h3>Coordonnées</h3>
                    </div>
                    <div className="pharmacie-form-row">
                      <div className="pharmacie-form-group" style={{ flex: 1 }}>
                        <label className="pharmacie-label">
                          <span className="pharmacie-label-icon">📱</span>
                          Téléphone
                        </label>
                      <input
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleFormChange}
                          className="pharmacie-input"
                          placeholder="Ex: +241 01 23 45 67"
                      />
                    </div>
                      <div className="pharmacie-form-group" style={{ flex: 1 }}>
                        <label className="pharmacie-label">
                          <span className="pharmacie-label-icon">✉️</span>
                          Email
                        </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                          className="pharmacie-input"
                          placeholder="Ex: contact@pharmacie.ga"
                      />
                      </div>
                    </div>
                  </div>

                  {/* Section Localisation */}
                  <div className="pharmacie-form-section">
                    <div className="pharmacie-section-header">
                      <span className="pharmacie-section-icon">🌍</span>
                      <h3>Localisation GPS (optionnel)</h3>
                    </div>
                    <div className="pharmacie-form-row">
                      <div className="pharmacie-form-group" style={{ flex: 1 }}>
                        <label className="pharmacie-label">
                          <span className="pharmacie-label-icon">📍</span>
                          Latitude
                        </label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleFormChange}
                          className="pharmacie-input"
                          placeholder="Ex: 0.3921"
                      />
                    </div>
                      <div className="pharmacie-form-group" style={{ flex: 1 }}>
                        <label className="pharmacie-label">
                          <span className="pharmacie-label-icon">📍</span>
                          Longitude
                        </label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleFormChange}
                          className="pharmacie-input"
                          placeholder="Ex: 9.4546"
                      />
                      </div>
                    </div>
                  </div>

                  {/* Section Options */}
                  <div className="pharmacie-form-section">
                    <div className="pharmacie-section-header">
                      <span className="pharmacie-section-icon">⚙️</span>
                      <h3>Options</h3>
                    </div>
                    <div className="pharmacie-form-group">
                      <label className="pharmacie-checkbox-label">
                      <input
                        type="checkbox"
                        name="garde"
                        checked={formData.garde}
                        onChange={handleFormChange}
                          className="pharmacie-checkbox"
                        />
                        <span className="pharmacie-checkbox-custom"></span>
                        <div className="pharmacie-checkbox-content">
                          <span className="pharmacie-checkbox-icon">🕐</span>
                          <div>
                            <strong>Pharmacie de garde</strong>
                            <p>Cette pharmacie assure des gardes de nuit et week-end</p>
                          </div>
                        </div>
                    </label>
                  </div>
                    <div className="pharmacie-form-group">
                      <label className="pharmacie-label">
                        <span className="pharmacie-label-icon">👤</span>
                        Associer à un pharmacien de l'Ordre
                      </label>
                    <select
                      name="pharmacienId"
                      value={formData.pharmacienId}
                      onChange={handleFormChange}
                        className="pharmacie-select"
                    >
                        <option value="">— Aucun pharmacien —</option>
                      {pharmaciens.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.prenom} {p.nom} {p.username && `(${p.username})`}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                  <div className="pharmacie-form-actions">
                    <button
                      type="button"
                      className="pharmacie-btn-secondary"
                      onClick={() => {
                        setShowForm(false);
                        setEditingPharmacie(null);
                      }}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="pharmacie-btn-primary">
                      <span>💾</span>
                      {editingPharmacie ? 'Mettre à jour' : 'Créer la pharmacie'}
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
