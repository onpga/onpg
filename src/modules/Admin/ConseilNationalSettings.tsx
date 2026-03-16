import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './ConseilNationalSettings.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
const CLOUDINARY_UPLOAD_PRESET = 'onpg_uploads';

type RoleType = 'bureau' | 'conseiller';

interface CouncilMember {
  id: string;
  fullName: string;
  roleLabel: string;
  roleType: RoleType;
  pharmacienId: string;
  photo: string;
  section: string;
  mission: string;
  order: number;
}

interface PharmacienOption {
  id: string;
  label: string;
  photo: string;
}

const ConseilNationalSettings = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pharmacienOptions, setPharmacienOptions] = useState<PharmacienOption[]>([]);
  const [memberSearch, setMemberSearch] = useState<Record<string, string>>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    loadMembers();
    loadPharmaciens();
  }, [navigate]);

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => a.order - b.order),
    [members]
  );

  const stats = useMemo(() => {
    const bureau = members.filter((m) => m.roleType === 'bureau').length;
    const conseillers = members.filter((m) => m.roleType === 'conseiller').length;
    return { total: members.length, bureau, conseillers };
  }, [members]);

  const loadMembers = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/site-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Chargement impossible');
      }

      const councilMembers = Array.isArray(data?.data?.councilMembers) ? data.data.councilMembers : [];
      setMembers(
        councilMembers.map((member: any, index: number) => ({
          id: member?.id || `council-${index + 1}`,
          fullName: member?.fullName || '',
          roleLabel: member?.roleLabel || 'Membre du conseil',
          roleType: member?.roleType === 'conseiller' ? 'conseiller' : 'bureau',
          pharmacienId: member?.pharmacienId || '',
          photo: member?.photo || '',
          section: member?.section || '',
          mission: member?.mission || '',
          order: Number.isFinite(Number(member?.order)) ? Number(member.order) : index + 1
        }))
      );
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Erreur de chargement' });
    } finally {
      setLoading(false);
    }
  };

  const loadPharmaciens = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/pharmaciens`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok || !data?.success || !Array.isArray(data?.data)) return;

      const options = data.data.map((p: any) => ({
        id: String(p._id),
        label: `${String(p.prenom || '').trim()} ${String(p.nom || '').trim()}`.trim() || 'Pharmacien',
        photo: String(p.photo || '')
      }));
      setPharmacienOptions(options);
    } catch {
      // silencieux
    }
  };

  const updateMember = (index: number, patch: Partial<CouncilMember>) => {
    setMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, ...patch } : member))
    );
  };

  const getFilteredPharmaciens = (member: CouncilMember) => {
    const query = (memberSearch[member.id] || '').trim().toLowerCase();
    if (!query) return pharmacienOptions;
    return pharmacienOptions.filter((option) => option.label.toLowerCase().includes(query));
  };

  const addMember = (roleType: RoleType) => {
    setMembers((prev) => [
      ...prev,
      {
        id: `council-${Date.now()}`,
        fullName: '',
        roleLabel: roleType === 'conseiller' ? 'Membre conseiller' : 'Membre du bureau',
        roleType,
        pharmacienId: '',
        photo: '',
        section: roleType === 'conseiller' ? 'Conseil' : 'Bureau',
        mission: '',
        order: prev.length + 1
      }
    ]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((member, newIndex) => ({ ...member, order: newIndex + 1 }))
    );
  };

  const moveMember = (index: number, direction: 'up' | 'down') => {
    setMembers((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
      return copy.map((member, newIndex) => ({ ...member, order: newIndex + 1 }));
    });
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (!response.ok || !data?.secure_url) {
        return null;
      }
      return data.secure_url;
    } catch {
      return null;
    }
  };

  const handlePhotoUpload = async (index: number, file?: File) => {
    if (!file) return;
    setUploadingIndex(index);
    setMessage(null);
    const url = await uploadToCloudinary(file);
    if (!url) {
      setMessage({ type: 'error', text: "Échec de l'upload de la photo." });
      showError("Échec de l'upload de la photo.");
      setUploadingIndex(null);
      return;
    }
    updateMember(index, { photo: url });
    setUploadingIndex(null);
  };

  const saveMembers = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        councilMembers: sortedMembers.map((member, index) => ({
          ...member,
          order: index + 1
        }))
      };

      const response = await fetch(`${API_URL}/admin/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Sauvegarde impossible');
      }

      setMessage({ type: 'success', text: 'Conseil national sauvegardé avec succès.' });
      showSuccess('Conseil national sauvegardé avec succès.');
      await loadMembers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Erreur de sauvegarde' });
      showError(error?.message || 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="settings-conseil" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>Paramètres - Conseil national</h1>
            <p>Configuration dynamique des postes et membres (masculin/féminin libre).</p>
          </div>
        </header>

        <section className="cns-layout">
          <div className="cns-toolbar">
            <div className="cns-kpis">
              <span>Total: {stats.total}</span>
              <span>Bureau: {stats.bureau}</span>
              <span>Conseillers: {stats.conseillers}</span>
            </div>
            <div className="cns-actions">
              <button type="button" className="btn-secondary" onClick={() => addMember('bureau')}>
                + Bureau
              </button>
              <button type="button" className="btn-secondary" onClick={() => addMember('conseiller')}>
                + Conseiller
              </button>
              <button type="button" className="btn-primary" onClick={saveMembers} disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>

          {message && <div className={`message ${message.type}`}>{message.text}</div>}

          {loading ? (
            <div className="cns-loading">Chargement...</div>
          ) : (
            <div className="cns-list">
              {sortedMembers.map((member, index) => (
                <article key={member.id} className="cns-card">
                  <div className="cns-card-top">
                    <strong>Position #{index + 1}</strong>
                    <div className="cns-card-controls">
                      <button type="button" onClick={() => moveMember(index, 'up')} disabled={index === 0}>
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMember(index, 'down')}
                        disabled={index === sortedMembers.length - 1}
                      >
                        ↓
                      </button>
                      <button type="button" className="danger" onClick={() => removeMember(index)}>
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="cns-grid">
                    <label>
                      Type
                      <select
                        value={member.roleType}
                        onChange={(e) => updateMember(index, { roleType: e.target.value as RoleType })}
                      >
                        <option value="bureau">Bureau</option>
                        <option value="conseiller">Conseiller</option>
                      </select>
                    </label>

                    <label>
                      Intitulé du poste
                      <input
                        type="text"
                        value={member.roleLabel}
                        onChange={(e) => updateMember(index, { roleLabel: e.target.value })}
                        placeholder="Ex: Présidente, Président, Trésorière générale..."
                      />
                    </label>

                    <label className="cns-pharmacien-combo">
                      Pharmacien lié
                      <div className="cns-combo-wrap">
                        <input
                          type="text"
                          value={
                            openDropdownId === member.id
                              ? (memberSearch[member.id] ?? '')
                              : pharmacienOptions.find((o) => o.id === member.pharmacienId)?.label ?? ''
                          }
                          onChange={(e) => {
                            setMemberSearch((prev) => ({ ...prev, [member.id]: e.target.value }));
                            setOpenDropdownId(member.id);
                          }}
                          onFocus={() => setOpenDropdownId(member.id)}
                          onBlur={() => setTimeout(() => setOpenDropdownId(null), 150)}
                          placeholder="Nom ou prénom..."
                          autoComplete="off"
                        />
                        {openDropdownId === member.id && (
                          <ul className="cns-combo-list" role="listbox">
                            <li
                              role="option"
                              className="cns-combo-option"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                updateMember(index, { pharmacienId: '' });
                                setMemberSearch((prev) => ({ ...prev, [member.id]: '' }));
                              }}
                            >
                              — Aucun —
                            </li>
                            {getFilteredPharmaciens(member).map((option) => (
                              <li
                                key={option.id}
                                role="option"
                                className={`cns-combo-option ${member.pharmacienId === option.id ? 'selected' : ''}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  updateMember(index, { pharmacienId: option.id });
                                  setMemberSearch((prev) => ({ ...prev, [member.id]: '' }));
                                  setOpenDropdownId(null);
                                }}
                              >
                                {option.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </label>

                    <label>
                      Nom complet
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => updateMember(index, { fullName: e.target.value })}
                        placeholder="Ex: Dr Jane Doe"
                      />
                    </label>

                    <label>
                      Section
                      <input
                        type="text"
                        value={member.section}
                        onChange={(e) => updateMember(index, { section: e.target.value })}
                        placeholder="Ex: Gouvernance"
                      />
                    </label>
                  </div>

                  <label className="cns-full">
                    Mission
                    <textarea
                      value={member.mission}
                      onChange={(e) => updateMember(index, { mission: e.target.value })}
                      placeholder="Description courte du périmètre"
                      rows={3}
                    />
                  </label>

                  <div className="cns-photo-row">
                    <div className="cns-photo-preview">
                      {member.photo ? <img src={member.photo} alt={member.fullName || member.roleLabel} /> : <span>Aucune photo</span>}
                    </div>
                    <label className="btn-secondary cns-upload-btn">
                      {uploadingIndex === index ? 'Upload...' : 'Changer photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(index, e.target.files?.[0])}
                        disabled={uploadingIndex !== null}
                      />
                    </label>
                    <button type="button" className="btn-secondary" onClick={() => updateMember(index, { photo: '' })}>
                      Retirer photo
                    </button>
                  </div>
                  {member.pharmacienId && (
                    <p className="cns-sync-note">
                      La photo de profil du pharmacien lié est prioritaire sur cette photo manuelle.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ConseilNationalSettings;
