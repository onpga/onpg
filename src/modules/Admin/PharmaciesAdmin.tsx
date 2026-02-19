import { useState, useEffect } from 'react';
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
  isActive: boolean;
  createdAt: string;
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
      setPharmacies(pharmaciesData.data || []);

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

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="pharmacies" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>🏥 Gestion des Pharmacies</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Liste de toutes les pharmacies. Vous pouvez associer une pharmacie à un pharmacien.
          </p>

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
                            onClick={() => {
                              setAssociatingPharmacie(pharmacie._id);
                              setSelectedPharmacienId(pharmacie.pharmacienId || '');
                            }}
                            className="btn-secondary"
                            style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                          >
                            🔗 Associer
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
                  <select
                    value={selectedPharmacienId}
                    onChange={(e) => setSelectedPharmacienId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
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
        </div>
      </main>
    </div>
  );
};

export default PharmaciesAdmin;
