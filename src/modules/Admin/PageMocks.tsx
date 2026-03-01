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

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/* ─── Utilitaire YouTube ─────────────────────────────────── */
const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/, // déjà un ID brut
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

const youtubeThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/* ─── Types ──────────────────────────────────────────────── */
interface VideoFormData {
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  speaker: string;
  event: string;
  category: string;
  tags: string; // saisie CSV
  featured: boolean;
  isActive: boolean;
  order: number;
}

const EMPTY_VIDEO: VideoFormData = {
  title: '',
  description: '',
  youtubeUrl: '',
  youtubeId: '',
  thumbnail: '',
  duration: '',
  speaker: '',
  event: '',
  category: 'Institution',
  tags: '',
  featured: false,
  isActive: true,
  order: 1,
};

const VIDEO_CATEGORIES = [
  'Institution',
  'Formation Continue',
  'Réglementation',
  'Éthique',
  'Innovation',
  'Événement',
  'Conférence',
];

/* ─── Composant carte de prévisualisation ────────────────── */
const VideoPreviewCard = ({ v }: { v: VideoFormData }) => {
  const thumb = v.thumbnail || (v.youtubeId ? youtubeThumbnail(v.youtubeId) : null);
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      maxWidth: '380px',
      fontFamily: 'inherit',
    }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111' }}>
        {thumb
          ? <img src={thumb} alt="thumbnail" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.85rem' }}>Miniature YouTube</div>
        }
        {/* Badge durée */}
        {v.duration && (
          <span style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: 'rgba(0,0,0,0.75)', color: '#fff',
            padding: '2px 7px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700,
          }}>{v.duration}</span>
        )}
        {/* Badge featured */}
        {v.featured && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#f59e0b', color: '#fff',
            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
          }}>⭐ Vedette</span>
        )}
        {/* Icône play */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      {/* Infos */}
      <div style={{ padding: '1rem' }}>
        {v.category && (
          <span style={{
            display: 'inline-block', background: '#EFF6FF', color: '#2563EB',
            padding: '2px 10px', borderRadius: '20px', fontSize: '0.73rem', fontWeight: 700,
            marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>{v.category}</span>
        )}
        <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.97rem', color: '#1C1917', lineHeight: 1.35 }}>
          {v.title || <span style={{ color: '#aaa' }}>Titre de la vidéo…</span>}
        </p>
        {v.description && (
          <p style={{ margin: '0 0 0.6rem', fontSize: '0.82rem', color: '#57534E', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {v.description}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
          {v.speaker && (
            <span style={{ fontSize: '0.78rem', color: '#78716C' }}>👤 {v.speaker}</span>
          )}
          {v.event && (
            <span style={{ fontSize: '0.78rem', color: '#78716C' }}>📍 {v.event}</span>
          )}
        </div>
        {v.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
            {v.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
              <span key={tag} style={{
                background: '#F5F5F4', color: '#57534E',
                padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem',
              }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Composant formulaire vidéo ─────────────────────────── */
const VideoForm = ({
  initial,
  onSave,
  onCancel,
}: {
  initial: VideoFormData;
  onSave: (data: VideoFormData) => Promise<void>;
  onCancel: () => void;
}) => {
  const [v, setV] = useState<VideoFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [urlError, setUrlError] = useState('');

  const handleUrlChange = (raw: string) => {
    setUrlError('');
    const id = extractYoutubeId(raw.trim());
    if (raw && !id) {
      setUrlError('URL YouTube non reconnue');
    }
    setV(prev => ({
      ...prev,
      youtubeUrl: raw,
      youtubeId: id || prev.youtubeId,
      thumbnail: id ? youtubeThumbnail(id) : prev.thumbnail,
    }));
  };

  const set = (field: keyof VideoFormData, val: any) =>
    setV(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.title) { alert('Le titre est obligatoire'); return; }
    if (!v.youtubeId) { alert("Entrez une URL YouTube valide"); return; }
    setSaving(true);
    try { await onSave(v); } finally { setSaving(false); }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.9rem',
    border: '1.5px solid #E7E5E0', borderRadius: '8px',
    fontSize: '0.95rem', boxSizing: 'border-box', background: '#FAFAF8',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* URL YouTube */}
        <div className="form-group">
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
            🔗 URL YouTube <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            value={v.youtubeUrl}
            onChange={e => handleUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{ ...fieldStyle, borderColor: urlError ? '#dc2626' : '#E7E5E0' }}
          />
          {urlError && <p style={{ color: '#dc2626', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>{urlError}</p>}
          {v.youtubeId && (
            <p style={{ color: '#059669', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>
              ✅ ID détecté : <code style={{ background: '#F0FDF4', padding: '1px 6px', borderRadius: '4px' }}>{v.youtubeId}</code>
            </p>
          )}
        </div>

        {/* Titre */}
        <div className="form-group">
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
            📝 Titre <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input type="text" value={v.title} onChange={e => set('title', e.target.value)}
            placeholder="Titre de la vidéo" style={fieldStyle} required />
        </div>

        {/* Description */}
        <div className="form-group">
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>📄 Description</label>
          <textarea value={v.description} onChange={e => set('description', e.target.value)}
            rows={4} placeholder="Description de la vidéo…"
            style={{ ...fieldStyle, resize: 'vertical' }} />
        </div>

        {/* Speaker & Event */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>👤 Intervenant / Auteur</label>
            <input type="text" value={v.speaker} onChange={e => set('speaker', e.target.value)}
              placeholder="Nom du conférencier" style={fieldStyle} />
          </div>
          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>📍 Événement</label>
            <input type="text" value={v.event} onChange={e => set('event', e.target.value)}
              placeholder="Conférence, séminaire…" style={fieldStyle} />
          </div>
        </div>

        {/* Catégorie & Durée */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>🏷️ Catégorie</label>
            <select value={v.category} onChange={e => set('category', e.target.value)} style={fieldStyle}>
              {VIDEO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>⏱️ Durée (ex : 15:30)</label>
            <input type="text" value={v.duration} onChange={e => set('duration', e.target.value)}
              placeholder="mm:ss" style={fieldStyle} />
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>🔖 Tags (séparés par des virgules)</label>
          <input type="text" value={v.tags} onChange={e => set('tags', e.target.value)}
            placeholder="ONPG, pharmacie, formation…" style={fieldStyle} />
        </div>

        {/* Ordre */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Ordre d'affichage</label>
            <input type="number" value={v.order} min={1}
              onChange={e => set('order', parseInt(e.target.value) || 1)} style={fieldStyle} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '1.6rem' }}>
            <input type="checkbox" checked={v.featured} onChange={e => set('featured', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
            <span style={{ fontWeight: 600 }}>⭐ Mise en vedette</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '1.6rem' }}>
            <input type="checkbox" checked={v.isActive} onChange={e => set('isActive', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#00A651' }} />
            <span style={{ fontWeight: 600 }}>✅ Publié / Actif</span>
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? '⏳ Enregistrement…' : '💾 Enregistrer la vidéo'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
        </div>
      </form>

      {/* Aperçu */}
      <div style={{ position: 'sticky', top: '1rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>👁️ Aperçu de la carte</p>
        <VideoPreviewCard v={v} />
        {v.youtubeId && (
          <a
            href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              marginTop: '1rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ▶ Ouvrir sur YouTube ↗
          </a>
        )}
      </div>
    </div>
  );
};

/* ─── Grille de vidéos (liste admin) ─────────────────────── */
const VideoCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const thumb = item.thumbnail || (item.youtubeId ? youtubeThumbnail(item.youtubeId) : null);
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #E7E5E0',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111' }}>
        {thumb
          ? <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No thumb</div>
        }
        {item.duration && (
          <span style={{
            position: 'absolute', bottom: 6, right: 6,
            background: 'rgba(0,0,0,0.75)', color: '#fff',
            padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
          }}>{item.duration}</span>
        )}
        {item.featured && (
          <span style={{
            position: 'absolute', top: 6, left: 6,
            background: '#f59e0b', color: '#fff',
            padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
          }}>⭐</span>
        )}
        {!item.isActive && (
          <span style={{
            position: 'absolute', top: 6, right: 6,
            background: '#dc2626', color: '#fff',
            padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
          }}>Inactif</span>
        )}
        {/* Play button */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(220,38,38,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {item.category && (
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.category}
          </span>
        )}
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#1C1917', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.title}
        </p>
        {item.speaker && <p style={{ margin: 0, fontSize: '0.78rem', color: '#78716C' }}>👤 {item.speaker}</p>}
        {item.youtubeId && (
          <a href={`https://youtu.be/${item.youtubeId}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            ▶ youtu.be/{item.youtubeId}
          </a>
        )}
      </div>
      <div style={{ padding: '0.6rem 0.85rem', borderTop: '1px solid #F5F5F4', display: 'flex', gap: '0.5rem' }}>
        <button onClick={onEdit} className="btn-edit" style={{ flex: 1 }}>✏️ Modifier</button>
        <button onClick={onDelete} className="btn-delete">🗑️</button>
      </div>
    </div>
  );
};

/* ─── Composant principal ────────────────────────────────── */
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
    order: 1,
    image: '',
    backgroundImage: ''
  });
  const [videoFormData, setVideoFormData] = useState<VideoFormData>(EMPTY_VIDEO);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const isVideos = selectedCollection === 'videos';

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
    { id: 'videos', name: '🎬 Vidéos (YouTube)', singleItem: false }
  ];

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

  /* ── Édition / création ── */
  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (isVideos) {
      setVideoFormData({
        title: item.title || '',
        description: item.description || '',
        youtubeUrl: item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '',
        youtubeId: item.youtubeId || '',
        thumbnail: item.thumbnail || (item.youtubeId ? youtubeThumbnail(item.youtubeId) : ''),
        duration: item.duration || '',
        speaker: item.speaker || '',
        event: item.event || '',
        category: item.category || 'Institution',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        featured: item.featured || false,
        isActive: item.isActive !== undefined ? item.isActive : true,
        order: item.order || 1,
      });
    } else {
      setFormData({
        title: item.title || '',
        content: item.content || '',
        category: item.category || '',
        featured: item.featured || false,
        excerpt: item.excerpt || item.summary || '',
        isActive: item.isActive !== undefined ? item.isActive : true,
        order: item.order || 1,
        ...item
      });
    }
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNew = () => {
    setEditingItem(null);
    if (isVideos) {
      setVideoFormData(EMPTY_VIDEO);
    } else {
      setFormData({ title: '', content: '', category: '', featured: false, excerpt: '', isActive: true, order: 1 });
    }
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;
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

  /* ── Sauvegarde vidéo ── */
  const handleVideoSave = async (v: VideoFormData) => {
    const tagsArray = v.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: v.title,
      description: v.description,
      youtubeId: v.youtubeId,
      thumbnail: v.thumbnail || youtubeThumbnail(v.youtubeId),
      duration: v.duration,
      speaker: v.speaker,
      event: v.event,
      category: v.category,
      tags: tagsArray,
      featured: v.featured,
      isActive: v.isActive,
      order: v.order,
    };
    const url = editingItem
      ? `${API_URL}/admin/videos/${editingItem._id}`
      : `${API_URL}/admin/videos`;
    const method = editingItem ? 'put' : 'post';
    await axios[method](url, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    setShowForm(false);
    setEditingItem(null);
    fetchData();
    alert('✅ Vidéo enregistrée avec succès !');
  };

  /* ── Upload image Cloudinary (autres collections) ── */
  const handleImageUpload = async (file: File, type: 'image' | 'backgroundImage') => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert("Configuration d'upload image manquante.");
      return;
    }
    if (type === 'image') setUploadingImage(true);
    else setUploadingBackground(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev: any) => ({ ...prev, [type]: data.secure_url }));
      } else {
        alert("Erreur lors de l'envoi de l'image");
      }
    } catch {
      alert("Erreur lors de l'envoi de l'image");
    } finally {
      if (type === 'image') setUploadingImage(false);
      else setUploadingBackground(false);
    }
  };

  /* ── Sauvegarde autres collections ── */
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
            <button className="btn-primary" onClick={handleNew}>
              ➕ {isVideos ? 'Nouvelle vidéo' : 'Nouveau contenu'}
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

          {/* ── Liste ── */}
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : isVideos ? (
            /* Grille cards vidéo */
            data.length === 0 ? (
              <div className="empty-state">
                <p>Aucune vidéo. Cliquez sur &quot;Nouvelle vidéo&quot; pour en ajouter une.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.25rem',
                marginTop: '1rem',
              }}>
                {data.map(item => (
                  <VideoCard
                    key={item._id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item._id)}
                  />
                ))}
              </div>
            )
          ) : (
            /* Tableau générique */
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
                      <th>Vedette</th>
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

          {/* ── Formulaire ── */}
          {showForm && (
            <section ref={formRef} className="dashboard-section" style={{ marginTop: '2.5rem' }}>
              <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem' }}>
                  {isVideos
                    ? `🎬 ${editingItem ? 'Modifier la vidéo' : 'Ajouter une vidéo YouTube'}`
                    : `${editingItem ? 'Modifier' : 'Créer'} — ${collections.find(c => c.id === selectedCollection)?.name}`
                  }
                </h1>
              </div>

              {isVideos ? (
                <VideoForm
                  initial={videoFormData}
                  onSave={handleVideoSave}
                  onCancel={() => setShowForm(false)}
                />
              ) : (
                /* Formulaire générique */
                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="form-group">
                    <label>Titre *</label>
                    <input type="text" value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required placeholder="Titre du contenu" />
                  </div>

                  <div className="form-group">
                    <label>Résumé / Extrait</label>
                    <textarea value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3} placeholder="Résumé court du contenu" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Image principale</label>
                      <input type="file" accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'image'); }}
                        disabled={uploadingImage} />
                      {formData.image && (
                        <div style={{ marginTop: '10px' }}>
                          <img src={formData.image} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                          <button type="button" onClick={() => setFormData({ ...formData, image: '' })}
                            style={{ marginLeft: '10px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Supprimer
                          </button>
                        </div>
                      )}
                      {uploadingImage && <p style={{ color: '#666', fontSize: '0.9rem' }}>Upload en cours...</p>}
                    </div>

                    <div className="form-group">
                      <label>Image d'arrière-plan (pour actualités)</label>
                      <input type="file" accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'backgroundImage'); }}
                        disabled={uploadingBackground} />
                      {formData.backgroundImage && (
                        <div style={{ marginTop: '10px' }}>
                          <img src={formData.backgroundImage} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                          <button type="button" onClick={() => setFormData({ ...formData, backgroundImage: '' })}
                            style={{ marginLeft: '10px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Supprimer
                          </button>
                        </div>
                      )}
                      {uploadingBackground && <p style={{ color: '#666', fontSize: '0.9rem' }}>Upload en cours...</p>}
                    </div>
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
                      <select value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
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
                      <input type="number" value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                        min="1" />
                    </div>
                    <div className="form-group">
                      <label>
                        <input type="checkbox" checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                        Mettre en vedette
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <input type="checkbox" checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                        Publié / Actif
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">💾 {editingItem ? 'Modifier' : 'Publier'}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
                  </div>
                </form>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default PageMocks;
