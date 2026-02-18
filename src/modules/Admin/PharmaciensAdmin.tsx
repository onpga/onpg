import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
}

const PharmaciensAdmin = () => {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Pharmacien | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Pharmacien>({
    nom: '',
    prenom: '',
    numeroOrdre: undefined,
    nationalite: '',
    section: '',
    cotisationsAJour: true,
    dateRetardCotisations: null,
    isActive: true
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
      isActive: pharmacien.isActive !== undefined ? pharmacien.isActive : true
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
      isActive: true
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
      isActive: true
    });
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Liste des pharmaciens</h2>
            <button onClick={handleNew} className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}>
              ➕ Nouveau pharmacien
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>N° d&apos;ordre</th>
                    <th>Nationalité</th>
                    <th>Section</th>
                    <th>Cotisations à jour</th>
                    <th>Date retard cotisations</th>
                    <th>Actif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmaciens.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                        Aucun pharmacien enregistré
                      </td>
                    </tr>
                  ) : (
                    pharmaciens.map((pharmacien) => (
                      <tr key={pharmacien._id}>
                        <td>{pharmacien.nom || '—'}</td>
                        <td>{pharmacien.prenom || '—'}</td>
                        <td>{pharmacien.numeroOrdre || '—'}</td>
                        <td>{pharmacien.nationalite || '—'}</td>
                        <td>{pharmacien.section || <span style={{ color: '#999' }}>—</span>}</td>
                        <td>
                          {pharmacien.cotisationsAJour ? (
                            <span style={{ color: '#27ae60' }}>✅ Oui</span>
                          ) : (
                            <span style={{ color: '#e74c3c' }}>❌ Non</span>
                          )}
                        </td>
                        <td>
                          {pharmacien.dateRetardCotisations ? (
                            new Date(pharmacien.dateRetardCotisations).toLocaleDateString('fr-FR')
                          ) : (
                            <span style={{ color: '#999' }}>—</span>
                          )}
                        </td>
                        <td>
                          {pharmacien.isActive ? (
                            <span style={{ color: '#27ae60' }}>✅</span>
                          ) : (
                            <span style={{ color: '#999' }}>❌</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(pharmacien)}
                              className="btn-edit"
                              style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => pharmacien._id && handleDelete(pharmacien._id)}
                              className="btn-delete"
                              style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                            >
                              🗑️ Supprimer
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
      </main>
    </div>
  );
};

export default PharmaciensAdmin;
