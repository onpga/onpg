import { useEffect, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface These {
  _id: string;
  titre?: string;
  resume?: string;
  annee?: string | number;
  fichierUrl?: string;
  createdAt?: string;
  pharmacienNomComplet?: string;
}

const ThesesAdmin = () => {
  const [theses, setTheses] = useState<These[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadTheses = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/admin/theses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTheses(data.data || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors du chargement des thèses.' });
      }
    } catch (err) {
      console.error('Erreur chargement thèses admin:', err);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cette thèse ?')) return;
    try {
      setDeletingId(id);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/admin/theses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Thèse supprimée avec succès.' });
        await loadTheses();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression.' });
      }
    } catch (err) {
      console.error('Erreur suppression thèse:', err);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setDeletingId(null);
    }
  };

  const buildDownloadFileName = (these: These) => {
    const sanitize = (v: string) =>
      v
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    const parts = ['these'];
    if (these.titre) parts.push(sanitize(these.titre));
    if (these.pharmacienNomComplet) parts.push(sanitize(these.pharmacienNomComplet));
    if (these.annee) parts.push(String(these.annee));
    return parts.join('_') + '.pdf';
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="theses" />
      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>📄 Gestion des thèses</h1>
            <p>Liste de toutes les thèses déposées par les pharmaciens.</p>
          </div>
        </header>

        <div className="settings-container">
          {message && (
            <div className={`message ${message.type}`} style={{ marginBottom: '1rem' }}>
              {message.text}
            </div>
          )}

          <div className="table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Thèses déposées</h2>
              <button
                className="btn-secondary"
                onClick={loadTheses}
                disabled={loading}
              >
                {loading ? '⏳ Actualisation...' : '🔄 Actualiser'}
              </button>
            </div>

            {loading && theses.length === 0 ? (
              <p>Chargement des thèses...</p>
            ) : theses.length === 0 ? (
              <p>Aucune thèse enregistrée pour le moment.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Pharmacien</th>
                      <th>Année</th>
                      <th>Date dépôt</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {theses.map((these) => (
                      <tr key={these._id}>
                        <td>{these.titre || '-'}</td>
                        <td>{these.pharmacienNomComplet || 'Pharmacien'}</td>
                        <td>{these.annee || '-'}</td>
                        <td>
                          {these.createdAt
                            ? new Date(these.createdAt).toLocaleString('fr-FR')
                            : '-'}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {these.fichierUrl && (
                            <>
                              <a
                                href={these.fichierUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ marginRight: '0.5rem' }}
                              >
                                👁️ Consulter
                              </a>
                              <a
                                href={these.fichierUrl}
                                download={buildDownloadFileName(these)}
                                className="btn-secondary"
                                style={{ marginRight: '0.5rem' }}
                              >
                                ⬇️ Télécharger
                              </a>
                            </>
                          )}
                          <button
                            className="btn-danger"
                            onClick={() => handleDelete(these._id)}
                            disabled={deletingId === these._id}
                          >
                            {deletingId === these._id ? 'Suppression...' : '🗑️ Supprimer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThesesAdmin;


