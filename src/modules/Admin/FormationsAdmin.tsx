import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface Formation {
  _id?: string;
  title: string;
  description: string;
  duration: string; // Ex: "2 jours", "40 heures"
  price?: number;
  showPrice: boolean;
  category: string;
  instructor?: string;
  date?: string;
  location?: string;
  isActive: boolean;
  featured?: boolean;
  content?: string;
}

const FormationsAdmin = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Formation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Formation>({
    title: '',
    description: '',
    duration: '',
    price: 0,
    showPrice: false,
    category: '',
    instructor: '',
    date: '',
    location: '',
    isActive: true,
    featured: false,
    content: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/formations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const items = response.data.data || [];
      setFormations(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFormations = formations.filter((f) => {
    const haystack = `${f.title || ''} ${f.description || ''} ${f.category || ''}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  const handleEdit = (formation: Formation) => {
    setEditingItem(formation);
    setFormData({
      title: formation.title || '',
      description: formation.description || '',
      duration: formation.duration || '',
      price: formation.price || 0,
      showPrice: formation.showPrice !== undefined ? formation.showPrice : false,
      category: formation.category || '',
      instructor: formation.instructor || '',
      date: formation.date || '',
      location: formation.location || '',
      isActive: formation.isActive !== undefined ? formation.isActive : true,
      featured: formation.featured || false,
      content: formation.content || ''
    });
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;
    try {
      await axios.delete(`${API_URL}/admin/formations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?._id) {
        await axios.put(`${API_URL}/admin/formations/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
      } else {
        await axios.post(`${API_URL}/admin/formations`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        price: 0,
        showPrice: false,
        category: '',
        instructor: '',
        date: '',
        location: '',
        isActive: true,
        featured: false,
        content: ''
      });
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
      title: '',
      description: '',
      duration: '',
      price: 0,
      showPrice: false,
      category: '',
      instructor: '',
      date: '',
      location: '',
      isActive: true,
      featured: false,
      content: ''
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="formations" />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Gestion des Formations</h1>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                title: '',
                description: '',
                duration: '',
                price: 0,
                showPrice: false,
                category: '',
                instructor: '',
                date: '',
                location: '',
                isActive: true,
                featured: false,
                content: ''
              });
              setShowForm(true);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
            className="btn-primary"
            style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem' }}
          >
            ➕ Nouvelle formation
          </button>
        </div>

        <div className="admin-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '500px',
                fontSize: '1.1rem',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#00A651', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Titre</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Durée</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Catégorie</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Tarif</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFormations.map((formation) => (
                  <tr key={formation._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{formation.title}</td>
                    <td style={{ padding: '1rem' }}>{formation.duration}</td>
                    <td style={{ padding: '1rem' }}>{formation.category}</td>
                    <td style={{ padding: '1rem' }}>
                      {formation.showPrice && formation.price
                        ? `${formation.price.toLocaleString()} FCFA`
                        : 'Non affiché'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          backgroundColor: formation.isActive ? '#d4edda' : '#f8d7da',
                          color: formation.isActive ? '#155724' : '#721c24'
                        }}
                      >
                        {formation.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(formation)}
                          className="btn-edit"
                          style={{ fontSize: '1rem', padding: '0.35rem 0.6rem' }}
                          aria-label="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => formation._id && handleDelete(formation._id)}
                          className="btn-delete"
                          style={{ fontSize: '1rem', padding: '0.35rem 0.6rem' }}
                          aria-label="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filteredFormations.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              Aucune formation trouvée
            </div>
          )}

          {showForm && (
            <div ref={formRef} style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                {editingItem ? 'Modifier la formation' : 'Nouvelle formation'}
              </h2>
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
                      style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Durée *
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Ex: 2 jours, 40 heures"
                        required
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Catégorie *
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: Obligatoire, Spécialisée"
                        required
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Tarif (FCFA)
                      </label>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        min="0"
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.showPrice}
                        onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                        id="showPrice"
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="showPrice" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        Afficher le tarif
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Formateur
                      </label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Lieu
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{ width: '100%', fontSize: '1.1rem', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Contenu détaillé
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
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

                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      id="featured"
                      style={{ width: '20px', height: '20px', marginLeft: '2rem' }}
                    />
                    <label htmlFor="featured" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                      À la une
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
                    >
                      {editingItem ? 'Modifier' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                      style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FormationsAdmin;

