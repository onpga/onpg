import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import TextEditor from './components/TextEditor';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface PageMock {
  _id?: string;
  pageId: string;
  title: string;
  content: string;
  type: string;
  order: number;
  metadata: Record<string, any>;
  isActive: boolean;
}

const PageMocks = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('actualites');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: '',
    content: '',
    category: '',
    featured: false,
    excerpt: '',
    isActive: true,
    order: 1
  });

  const formRef = useRef<HTMLDivElement>(null);

  const collections = [
    { id: 'actualites', name: 'Actualités', singleItem: true },
    { id: 'communiques', name: 'Communiqués', singleItem: true },
    { id: 'articles', name: 'Articles', singleItem: true },
    { id: 'commissions', name: 'Commissions', singleItem: true },
    { id: 'decisions', name: 'Décisions', singleItem: true },
    { id: 'decrets', name: 'Décrets', singleItem: true },
    { id: 'lois', name: 'Lois', singleItem: true },
    { id: 'photos', name: 'Photos', singleItem: true },
    { id: 'theses', name: 'Thèses', singleItem: true },
    { id: 'videos', name: 'Vidéos', singleItem: false }
  ];

  // Catégories selon le type de page
  const getCategoriesForPage = (pageId: string) => {
    const categoriesMap: Record<string, string[]> = {
      'actualites': ['actualites', 'pedagogique', 'comparatifs', 'innovations', 'communiques', 'partenariats'],
      'communiques': ['urgent', 'information', 'presse', 'administratif'],
      'articles': ['Général', 'Recherche', 'Clinique', 'Économie'],
      'commissions': ['Général', 'Éthique', 'Formation', 'Réglementation'],
      'decisions': ['Général', 'Juridique', 'Disciplinaire'],
      'decrets': ['Général', 'Santé', 'Formation', 'Réglementation'],
      'lois': ['Législation', 'Santé', 'Profession', 'Éthique'],
      'photos': ['Général', 'Événements', 'Formation', 'Institution'],
      'theses': ['Recherche', 'Clinique', 'Économie', 'Santé Publique'],
      'videos': ['Institution', 'Formation Continue', 'Réglementation', 'Éthique', 'Innovation']
    };
    return categoriesMap[pageId] || ['Général'];
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/${selectedCollection}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const items = response.data.data || [];
      // Toujours travailler avec un tableau pour pouvoir afficher une vraie liste
      setData(Array.isArray(items) ? items : (items ? [items] : []));
    } catch (error) {
      console.error(`Erreur lors du chargement de ${selectedCollection}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCollection]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      content: item.content || '',
      category: item.category || '',
      featured: item.featured || false,
      excerpt: item.excerpt || item.summary || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || 1,
      ...item // Inclure tous les autres champs
    });
    setShowForm(true);
    // Scroller vers le formulaire après un court délai pour laisser le DOM se mettre à jour
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette donnée ?')) return;
    try {
      await axios.delete(`${API_URL}/admin/${selectedCollection}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchData();
      alert('✅ Supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem
        ? `${API_URL}/admin/${selectedCollection}/${editingItem._id}`
        : `${API_URL}/admin/${selectedCollection}`;
      const method = editingItem ? 'put' : 'post';
      
      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        featured: formData.featured,
        excerpt: formData.excerpt,
        isActive: formData.isActive,
        order: formData.order,
        ...Object.fromEntries(
          Object.entries(formData).filter(([key]) => 
            !['title', 'content', 'category', 'featured', 'excerpt', 'isActive', 'order'].includes(key)
          )
        )
      };
      
      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      
      setShowForm(false);
      setEditingItem(null);
      setFormData({ title: '', content: '', category: '', featured: false, excerpt: '', isActive: true, order: 1 });
      fetchData();
      alert('✅ Enregistré avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="resources" />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="user-info-compact">
            <span className="user-avatar-small">👤</span>
            <span>Admin</span>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>📄 Gestion des Ressources</h1>
            <button className="btn-primary" onClick={() => {
              // Nouveau contenu vide pour la collection sélectionnée
              setEditingItem(null);
              setFormData({
                title: '',
                content: '',
                category: '',
                featured: false,
                excerpt: '',
                isActive: true,
                order: 1
              });
              setShowForm(true);
              // Scroller vers le formulaire après un court délai pour laisser le DOM se mettre à jour
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}>
              ➕ Nouveau contenu
            </button>
          </div>

          <div className="filters-bar">
            <select
              value={selectedCollection}
              onChange={(e) => {
                setSelectedCollection(e.target.value);
                setEditingItem(null);
                setShowForm(false);
              }}
              className="filter-select"
            >
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>{collection.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            <div className="table-container">
              {data.length === 0 ? (
                <div className="empty-state">
                  <p>Aucune donnée dans cette collection. Cliquez sur &quot;Nouveau contenu&quot; pour en ajouter une.</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Catégorie</th>
                      <th>Ordre</th>
                      <th>Actif</th>
                      <th>Mise en vedette</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.category || '-'}</td>
                        <td>{item.order || 1}</td>
                        <td>{item.isActive ? '✅' : '❌'}</td>
                        <td>{item.featured ? '⭐' : ''}</td>
                        <td>
                          <button onClick={() => handleEdit(item)} className="btn-edit">✏️</button>
                          <button onClick={() => handleDelete(item._id)} className="btn-delete">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {showForm && (
            <section ref={formRef} className="dashboard-section" style={{ marginTop: '2rem' }}>
              <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem' }}>
                  {editingItem ? 'Modifier' : 'Créer'} - {collections.find(c => c.id === selectedCollection)?.name}
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Titre du contenu"
                  />
                </div>

                <div className="form-group">
                  <label>Résumé / Extrait</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    placeholder="Résumé court du contenu"
                  />
                </div>

                <div className="form-group">
                  <label>Contenu complet *</label>
                  <TextEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    placeholder="Rédigez le contenu avec l'éditeur riche..."
                    height="400px"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {getCategoriesForPage(selectedCollection).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ordre</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      Mettre en vedette
                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      Publié / Actif
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">💾 {editingItem ? 'Modifier' : 'Publier'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default PageMocks;
