import { useEffect, useState, useMemo } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './ThesesAdmin.css';

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

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SkeletonCard = () => (
  <div className="these-skeleton-card">
    <div className="sk-line sk-avatar" />
    <div className="sk-line sk-title" />
    <div className="sk-line sk-sub" />
    <div className="sk-line sk-badge" />
    <div className="sk-line sk-resume" />
    <div className="sk-line sk-footer" />
  </div>
);

const ThesesAdmin = () => {
  const [theses, setTheses]         = useState<These[]>([]);
  const [loading, setLoading]       = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch]         = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const loadTheses = async () => {
    try {
      setLoading(true);
      setIsSpinning(true);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/admin/theses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTheses(data.data || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors du chargement des thèses.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
      setTimeout(() => setIsSpinning(false), 600);
    }
  };

  useEffect(() => { loadTheses(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cette thèse ?')) return;
    try {
      setDeletingId(id);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/admin/theses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Thèse supprimée avec succès.' });
        await loadTheses();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setDeletingId(null);
    }
  };

  const buildDownloadFileName = (t: These) => {
    const sanitize = (v: string) =>
      v.toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '')
       .replace(/[^a-z0-9]/g, '_')
       .replace(/_+/g, '_')
       .replace(/^_+|_+$/g, '');
    const parts = ['these'];
    if (t.titre)                parts.push(sanitize(t.titre));
    if (t.pharmacienNomComplet) parts.push(sanitize(t.pharmacienNomComplet));
    if (t.annee)                parts.push(String(t.annee));
    return parts.join('_') + '.pdf';
  };

  const availableYears = useMemo(() => {
    const years = theses
      .map(t => t.annee ? String(t.annee) : null)
      .filter(Boolean) as string[];
    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, [theses]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return theses.filter(t => {
      const matchSearch =
        !q ||
        (t.titre || '').toLowerCase().includes(q) ||
        (t.pharmacienNomComplet || '').toLowerCase().includes(q) ||
        (t.resume || '').toLowerCase().includes(q);
      const matchYear = !yearFilter || String(t.annee) === yearFilter;
      return matchSearch && matchYear;
    });
  }, [theses, search, yearFilter]);

  const totalTheses = theses.length;
  const withPdf     = theses.filter(t => !!t.fichierUrl).length;
  const uniqueYears = availableYears.length;

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="theses" />

      <main className="dashboard-main">

        {/* En-tête */}
        <div className="theses-page-header">
          <div className="theses-header-left">
            <div className="theses-header-icon">📄</div>
            <div className="theses-header-text">
              <h1>Gestion des thèses</h1>
              <p>Thèses et mémoires déposés par les pharmaciens inscrits</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {message && (
          <div className={`theses-toast ${message.type}`}>
            <span>{message.type === 'success' ? '✓' : '⚠'}</span>
            {message.text}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="theses-stats-bar">
            <div className="theses-stat-chip">
              <div className="theses-stat-chip-icon green">📄</div>
              <div>
                <div className="theses-stat-chip-value">{totalTheses}</div>
                <div className="theses-stat-chip-label">thèse{totalTheses !== 1 ? 's' : ''} au total</div>
              </div>
            </div>
            <div className="theses-stat-chip">
              <div className="theses-stat-chip-icon blue">📎</div>
              <div>
                <div className="theses-stat-chip-value">{withPdf}</div>
                <div className="theses-stat-chip-label">avec fichier PDF</div>
              </div>
            </div>
            <div className="theses-stat-chip">
              <div className="theses-stat-chip-icon amber">📅</div>
              <div>
                <div className="theses-stat-chip-value">{uniqueYears}</div>
                <div className="theses-stat-chip-label">année{uniqueYears !== 1 ? 's' : ''} représentée{uniqueYears !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="theses-toolbar">
          <div className="theses-search-wrap">
            <span className="theses-search-icon">🔍</span>
            <input
              type="text"
              className="theses-search-input"
              placeholder="Rechercher par titre, pharmacien, résumé…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {availableYears.length > 0 && (
            <select
              className="theses-filter-select"
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
            >
              <option value="">Toutes les années</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}

          <button
            className="theses-refresh-btn"
            onClick={loadTheses}
            disabled={loading}
          >
            <span className={isSpinning ? 'spin' : ''}>↻</span>
            {loading ? 'Actualisation…' : 'Actualiser'}
          </button>
        </div>

        {/* Compteur résultats */}
        {!loading && theses.length > 0 && (
          <p className="theses-results-count">
            <strong>{filtered.length}</strong> résultat{filtered.length !== 1 ? 's' : ''}
            {(search || yearFilter) && ` sur ${totalTheses} thèse${totalTheses !== 1 ? 's' : ''}`}
          </p>
        )}

        {/* Grille */}
        {loading && theses.length === 0 ? (
          <div className="theses-skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="theses-grid">
            {filtered.length === 0 ? (
              <div className="theses-empty-state">
                <span className="theses-empty-icon">📭</span>
                <h3>
                  {search || yearFilter
                    ? 'Aucune thèse ne correspond à votre recherche'
                    : 'Aucune thèse enregistrée'}
                </h3>
                <p>
                  {search || yearFilter
                    ? "Essayez d'ajuster les filtres ci-dessus."
                    : 'Les thèses déposées par les pharmaciens apparaîtront ici.'}
                </p>
              </div>
            ) : (
              filtered.map(these => (
                <article key={these._id} className="these-card">
                  <div className="these-card-body">

                    <div className="these-card-header">
                      <div className="these-avatar">
                        {getInitials(these.pharmacienNomComplet)}
                      </div>
                      <div className="these-card-meta">
                        <h3 className="these-card-title">
                          {these.titre || 'Sans titre'}
                        </h3>
                        <p className="these-card-pharmacien">
                          👤 {these.pharmacienNomComplet || 'Pharmacien inconnu'}
                        </p>
                      </div>
                    </div>

                    <div className="these-badges">
                      {these.annee && (
                        <span className="these-badge-year">📅 {these.annee}</span>
                      )}
                      {these.fichierUrl
                        ? <span className="these-badge-pdf">📎 PDF disponible</span>
                        : <span className="these-badge-no-pdf">Pas de fichier</span>
                      }
                    </div>

                    {these.resume
                      ? <p className="these-resume">{these.resume}</p>
                      : <p className="these-no-resume">Aucun résumé renseigné</p>
                    }

                    {these.createdAt && (
                      <div className="these-date">
                        <span>🕐</span>
                        <span>Déposé le {new Date(these.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}</span>
                      </div>
                    )}
                  </div>

                  <div className="these-card-footer">
                    {these.fichierUrl && (
                      <>
                        <a
                          href={these.fichierUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="these-btn these-btn-view"
                        >
                          👁 Consulter
                        </a>
                        <a
                          href={these.fichierUrl}
                          download={buildDownloadFileName(these)}
                          className="these-btn these-btn-download"
                        >
                          ⬇ Télécharger
                        </a>
                      </>
                    )}
                    <button
                      className="these-btn these-btn-delete"
                      onClick={() => handleDelete(these._id)}
                      disabled={deletingId === these._id}
                    >
                      {deletingId === these._id ? '⏳ Suppression…' : '🗑 Supprimer'}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default ThesesAdmin;
