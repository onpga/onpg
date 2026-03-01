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

/* ═══════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════ */
const extractYoutubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
};
const youtubeThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/* Shared style helpers */
const fs: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem',
  border: '1.5px solid #E7E5E0', borderRadius: '8px',
  fontSize: '0.95rem', boxSizing: 'border-box', background: '#FAFAF8',
};
const lbl = (text: string, required = false) => (
  <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
    {text}{required && <span style={{ color: '#dc2626' }}> *</span>}
  </label>
);
const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' };
const row3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' };

const ChkBox = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '1.6rem' }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
      style={{ width: 18, height: 18, accentColor: '#00A651' }} />
    <span style={{ fontWeight: 600 }}>{label}</span>
  </label>
);

const FormActions = ({ editing, saving, onCancel }: { editing: boolean; saving: boolean; onCancel: () => void }) => (
  <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
    <button type="submit" className="btn-primary" disabled={saving}>
      {saving ? '⏳ Enregistrement…' : `💾 ${editing ? 'Modifier' : 'Créer'}`}
    </button>
    <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
  </div>
);

/* Upload image Cloudinary */
const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const upload = async (file: File, key: string, cb: (url: string) => void) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) { alert('Config Cloudinary manquante'); return; }
    setUploading(p => ({ ...p, [key]: true }));
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.secure_url) cb(data.secure_url);
      else alert("Erreur upload Cloudinary");
    } catch { alert("Erreur upload Cloudinary"); }
    finally { setUploading(p => ({ ...p, [key]: false })); }
  };
  return { upload, uploading };
};

const ImageField = ({ label: lbl2, value, onChange, uploadKey, upload, uploading }: {
  label: string; value: string; onChange: (v: string) => void;
  uploadKey: string; upload: (f: File, k: string, cb: (u: string) => void) => void;
  uploading: Record<string, boolean>;
}) => (
  <div className="form-group">
    <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>{lbl2}</label>
    <input type="file" accept="image/*" disabled={uploading[uploadKey]}
      onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, uploadKey, onChange); }} />
    {uploading[uploadKey] && <p style={{ color: '#666', fontSize: '0.85rem', margin: '4px 0' }}>⏳ Upload en cours…</p>}
    {value && (
      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={value} alt="" style={{ maxWidth: 160, maxHeight: 100, borderRadius: 6, objectFit: 'cover' }} />
        <button type="button" onClick={() => onChange('')}
          style={{ padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem' }}>
          Supprimer
        </button>
      </div>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════
   1. ACTUALITÉS
═══════════════════════════════════════════════════════ */
const EMPTY_ACTU = { title: '', excerpt: '', content: '', image: '', backgroundImage: '', authorName: '', authorRole: '', category: 'actualites', pole: '', tags: '', readTime: 5, featured: false, isActive: true, order: 1 };
const ACTU_CATS = ['actualites', 'pedagogique', 'comparatifs', 'innovations', 'communiques', 'partenariats'];

const ActualiteForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_ACTU; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const { upload, uploading } = useCloudinaryUpload();
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave({ ...v, tags: v.tags.split(',').map(t => t.trim()).filter(Boolean), author: { name: v.authorName, role: v.authorRole } }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Titre', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre de l'actualité" /></div>
      <div className="form-group">{lbl('Résumé / Extrait')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.excerpt} onChange={e => s('excerpt', e.target.value)} rows={3} placeholder="Court résumé visible dans les listes…" /></div>
      <div style={row2}>
        <div className="form-group">{lbl("Nom de l'auteur")}<input style={fs} type="text" value={v.authorName} onChange={e => s('authorName', e.target.value)} placeholder="Dr. Jean Dupont" /></div>
        <div className="form-group">{lbl('Rôle / Titre de l\'auteur')}<input style={fs} type="text" value={v.authorRole} onChange={e => s('authorRole', e.target.value)} placeholder="Pharmacien, Président ONPG…" /></div>
      </div>
      <div style={row2}>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{ACTU_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="form-group">{lbl('Pôle')}<input style={fs} type="text" value={v.pole} onChange={e => s('pole', e.target.value)} placeholder="Pôle concerné" /></div>
      </div>
      <div style={row2}>
        <ImageField label="🖼️ Image principale" value={v.image} onChange={u => s('image', u)} uploadKey="image" upload={upload} uploading={uploading} />
        <ImageField label="🌄 Image d'arrière-plan" value={v.backgroundImage} onChange={u => s('backgroundImage', u)} uploadKey="bg" upload={upload} uploading={uploading} />
      </div>
      <div className="form-group">{lbl('Contenu complet')}
        <TextEditor value={v.content} onChange={val => s('content', val)} placeholder="Rédigez l'actualité…" height="380px" />
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Tags (virgules)')}<input style={fs} type="text" value={v.tags} onChange={e => s('tags', e.target.value)} placeholder="santé, formation, ONPG" /></div>
        <div className="form-group">{lbl('Temps de lecture (min)')}<input style={fs} type="number" min={1} value={v.readTime} onChange={e => s('readTime', +e.target.value)} /></div>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Mise en vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Publié / Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   2. COMMUNIQUÉS
═══════════════════════════════════════════════════════ */
const EMPTY_COMM = { title: '', reference: '', date: '', type: 'information', category: 'information', excerpt: '', content: '', urgent: false, featured: false, isActive: true, order: 1 };
const COMM_TYPES = ['urgent', 'information', 'presse', 'administratif'];
const COMM_CATS = ['urgent', 'information', 'presse', 'administratif'];

const CommuniqueForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_COMM; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { await onSave(v); } finally { setSaving(false); } };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Titre', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre du communiqué" /></div>
      <div style={row3}>
        <div className="form-group">{lbl('Référence')}<input style={fs} type="text" value={v.reference} onChange={e => s('reference', e.target.value)} placeholder="ONPG/2024/001" /></div>
        <div className="form-group">{lbl('Date')}<input style={fs} type="date" value={v.date} onChange={e => s('date', e.target.value)} /></div>
        <div className="form-group">{lbl('Type')}<select style={fs} value={v.type} onChange={e => s('type', e.target.value)}>{COMM_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
      </div>
      <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{COMM_CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}</select></div>
      <div className="form-group">{lbl('Résumé / Extrait')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.excerpt} onChange={e => s('excerpt', e.target.value)} rows={3} placeholder="Résumé court…" /></div>
      <div className="form-group">{lbl('Contenu complet')}
        <TextEditor value={v.content} onChange={val => s('content', val)} placeholder="Rédigez le communiqué…" height="380px" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.urgent} onChange={val => s('urgent', val)} label="🚨 Urgent" />
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   3. ARTICLES SCIENTIFIQUES
═══════════════════════════════════════════════════════ */
const EMPTY_ART = { title: '', authors: '', abstract: '', journal: '', volume: '', issue: '', pages: '', year: new Date().getFullYear(), doi: '', keywords: '', category: 'Général', language: 'fr', publicationType: 'article', featured: false, isActive: true, order: 1 };
const ART_CATS = ['Général', 'Recherche', 'Clinique', 'Économie', 'Santé Publique', 'Pharmacologie'];
const PUB_TYPES = [{ v: 'article', l: 'Article' }, { v: 'review', l: 'Revue' }, { v: 'case-report', l: 'Cas clinique' }, { v: 'letter', l: 'Lettre' }];

const ArticleScientifiqueForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_ART; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, authors: v.authors.split(',').map(a => a.trim()).filter(Boolean), keywords: v.keywords.split(',').map(k => k.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Titre', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre de l'article scientifique" /></div>
      <div className="form-group">{lbl('Auteurs (séparés par virgules)')}<input style={fs} type="text" value={v.authors} onChange={e => s('authors', e.target.value)} placeholder="Dr. Alice Martin, Dr. Paul Nze…" /></div>
      <div className="form-group">{lbl('Résumé (Abstract)')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.abstract} onChange={e => s('abstract', e.target.value)} rows={5} placeholder="Résumé scientifique de l'article…" /></div>
      <div style={row3}>
        <div className="form-group">{lbl('Journal / Revue')}<input style={fs} type="text" value={v.journal} onChange={e => s('journal', e.target.value)} placeholder="Journal de Pharmacie du Gabon" /></div>
        <div className="form-group">{lbl('Volume')}<input style={fs} type="text" value={v.volume} onChange={e => s('volume', e.target.value)} placeholder="12" /></div>
        <div className="form-group">{lbl('Numéro')}<input style={fs} type="text" value={v.issue} onChange={e => s('issue', e.target.value)} placeholder="3" /></div>
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Pages')}<input style={fs} type="text" value={v.pages} onChange={e => s('pages', e.target.value)} placeholder="45-62" /></div>
        <div className="form-group">{lbl('Année')}<input style={fs} type="number" value={v.year} onChange={e => s('year', +e.target.value)} min={1990} max={2099} /></div>
        <div className="form-group">{lbl('DOI')}<input style={fs} type="text" value={v.doi} onChange={e => s('doi', e.target.value)} placeholder="10.1234/jpg.2024.001" /></div>
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{ART_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="form-group">{lbl('Type de publication')}<select style={fs} value={v.publicationType} onChange={e => s('publicationType', e.target.value)}>{PUB_TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
        <div className="form-group">{lbl('Langue')}<select style={fs} value={v.language} onChange={e => s('language', e.target.value)}><option value="fr">Français</option><option value="en">Anglais</option></select></div>
      </div>
      <div className="form-group">{lbl('Mots-clés (virgules)')}<input style={fs} type="text" value={v.keywords} onChange={e => s('keywords', e.target.value)} placeholder="pharmacie, santé, recherche…" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   4. COMMISSIONS
═══════════════════════════════════════════════════════ */
const EMPTY_COMMISSION = { name: '', description: '', president: '', members: '', creationDate: '', category: 'Général', missions: '', status: 'active', featured: false, isActive: true, order: 1 };
const COMM_CATS2 = ['Général', 'Éthique', 'Formation', 'Réglementation', 'Disciplinaire', 'Technique'];

const CommissionForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_COMMISSION; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, title: v.name, members: v.members.split(',').map(m => m.trim()).filter(Boolean), missions: v.missions.split('\n').map(m => m.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Nom de la commission', true)}<input style={fs} type="text" value={v.name} onChange={e => s('name', e.target.value)} required placeholder="Commission de l'Éthique…" /></div>
      <div className="form-group">{lbl('Description')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.description} onChange={e => s('description', e.target.value)} rows={3} placeholder="Rôle et description de la commission…" /></div>
      <div style={row3}>
        <div className="form-group">{lbl('Président')}<input style={fs} type="text" value={v.president} onChange={e => s('president', e.target.value)} placeholder="Dr. Jean Dupont" /></div>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{COMM_CATS2.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="form-group">{lbl('Date de création')}<input style={fs} type="date" value={v.creationDate} onChange={e => s('creationDate', e.target.value)} /></div>
      </div>
      <div className="form-group">{lbl('Membres (séparés par virgules)')}<input style={fs} type="text" value={v.members} onChange={e => s('members', e.target.value)} placeholder="Dr. Alice, Dr. Paul, M. Henri…" /></div>
      <div className="form-group">{lbl('Missions (une par ligne)')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.missions} onChange={e => s('missions', e.target.value)} rows={5} placeholder="Veiller au respect du code de déontologie&#10;Émettre des avis consultatifs&#10;…" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 160px 1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <div className="form-group">{lbl('Statut')}<select style={fs} value={v.status} onChange={e => s('status', e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   5. DÉCISIONS
═══════════════════════════════════════════════════════ */
const EMPTY_DECISION = { title: '', reference: '', date: '', jurisdiction: '', category: 'Général', summary: '', parties: '', decision: 'favorable', keywords: '', featured: false, isActive: true, order: 1 };
const DEC_CATS = ['Général', 'Juridique', 'Disciplinaire', 'Administratif'];
const DEC_RESULTS = [{ v: 'favorable', l: '✅ Favorable' }, { v: 'defavorable', l: '❌ Défavorable' }, { v: 'partiellement favorable', l: '⚖️ Partiellement favorable' }, { v: 'irrecevable', l: '🚫 Irrecevable' }];

const DecisionForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_DECISION; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, parties: v.parties.split(',').map(p => p.trim()).filter(Boolean), keywords: v.keywords.split(',').map(k => k.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Titre de la décision', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre de la décision…" /></div>
      <div style={row3}>
        <div className="form-group">{lbl('Référence')}<input style={fs} type="text" value={v.reference} onChange={e => s('reference', e.target.value)} placeholder="DEC/2024/001" /></div>
        <div className="form-group">{lbl('Date')}<input style={fs} type="date" value={v.date} onChange={e => s('date', e.target.value)} /></div>
        <div className="form-group">{lbl('Juridiction')}<input style={fs} type="text" value={v.jurisdiction} onChange={e => s('jurisdiction', e.target.value)} placeholder="Conseil National ONPG" /></div>
      </div>
      <div style={row2}>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{DEC_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="form-group">{lbl('Résultat de la décision')}<select style={fs} value={v.decision} onChange={e => s('decision', e.target.value)}>{DEC_RESULTS.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}</select></div>
      </div>
      <div className="form-group">{lbl('Résumé')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.summary} onChange={e => s('summary', e.target.value)} rows={4} placeholder="Résumé de la décision et de ses implications…" /></div>
      <div className="form-group">{lbl('Parties concernées (séparées par virgules)')}<input style={fs} type="text" value={v.parties} onChange={e => s('parties', e.target.value)} placeholder="M. Dupont, Pharmacie Centrale…" /></div>
      <div className="form-group">{lbl('Mots-clés (virgules)')}<input style={fs} type="text" value={v.keywords} onChange={e => s('keywords', e.target.value)} placeholder="discipline, sanction, pharmacien…" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   6. DÉCRETS
═══════════════════════════════════════════════════════ */
const EMPTY_DECRET = { number: '', title: '', publicationDate: '', entryDate: '', ministry: '', category: 'Général', summary: '', keyArticles: '', tags: '', status: 'active', language: 'fr', featured: false, isActive: true, order: 1 };
const DECRET_CATS = ['Général', 'Santé', 'Formation', 'Réglementation', 'Fiscalité'];
const DECRET_STATUS = [{ v: 'active', l: '✅ En vigueur' }, { v: 'modified', l: '📝 Modifié' }, { v: 'abrogated', l: '❌ Abrogé' }];

const DecretForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_DECRET; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, keyArticles: v.keyArticles.split('\n').map(a => a.trim()).filter(Boolean), tags: v.tags.split(',').map(t => t.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={row2}>
        <div className="form-group">{lbl('Numéro du décret', true)}<input style={fs} type="text" value={v.number} onChange={e => s('number', e.target.value)} required placeholder="Décret n°2024-001" /></div>
        <div className="form-group">{lbl('Ministère signataire')}<input style={fs} type="text" value={v.ministry} onChange={e => s('ministry', e.target.value)} placeholder="Ministère de la Santé" /></div>
      </div>
      <div className="form-group">{lbl('Titre', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Objet du décret…" /></div>
      <div style={row3}>
        <div className="form-group">{lbl('Date de publication')}<input style={fs} type="date" value={v.publicationDate} onChange={e => s('publicationDate', e.target.value)} /></div>
        <div className="form-group">{lbl("Date d'entrée en vigueur")}<input style={fs} type="date" value={v.entryDate} onChange={e => s('entryDate', e.target.value)} /></div>
        <div className="form-group">{lbl('Statut')}<select style={fs} value={v.status} onChange={e => s('status', e.target.value)}>{DECRET_STATUS.map(st => <option key={st.v} value={st.v}>{st.l}</option>)}</select></div>
      </div>
      <div style={row2}>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{DECRET_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="form-group">{lbl('Langue')}<select style={fs} value={v.language} onChange={e => s('language', e.target.value)}><option value="fr">Français</option><option value="en">Anglais</option></select></div>
      </div>
      <div className="form-group">{lbl('Résumé')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.summary} onChange={e => s('summary', e.target.value)} rows={4} placeholder="Résumé du décret…" /></div>
      <div className="form-group">{lbl('Articles clés (un par ligne)')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.keyArticles} onChange={e => s('keyArticles', e.target.value)} rows={4} placeholder="Art. 1 — Toute pharmacie doit…&#10;Art. 5 — Le pharmacien est tenu de…" /></div>
      <div className="form-group">{lbl('Tags (virgules)')}<input style={fs} type="text" value={v.tags} onChange={e => s('tags', e.target.value)} placeholder="réglementation, santé, pharmacie…" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   7. LOIS
═══════════════════════════════════════════════════════ */
const EMPTY_LOI = { number: '', title: '', publicationDate: '', entryDate: '', category: 'Législation', summary: '', keyArticles: '', tags: '', status: 'active', language: 'fr', featured: false, isActive: true, order: 1 };
const LOI_CATS = ['Législation', 'Santé', 'Profession', 'Éthique', 'Formation', 'Commerce'];
const LOI_STATUS = [{ v: 'active', l: '✅ En vigueur' }, { v: 'modified', l: '📝 Modifiée' }, { v: 'repealed', l: '❌ Abrogée' }];

const LoiForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_LOI; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, keyArticles: v.keyArticles.split('\n').map(a => a.trim()).filter(Boolean), tags: v.tags.split(',').map(t => t.trim()).filter(Boolean) }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={row2}>
        <div className="form-group">{lbl('Numéro de la loi', true)}<input style={fs} type="text" value={v.number} onChange={e => s('number', e.target.value)} required placeholder="Loi n°2024-001" /></div>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{LOI_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <div className="form-group">{lbl('Titre / Objet', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Loi portant réglementation de…" /></div>
      <div style={row3}>
        <div className="form-group">{lbl('Date de publication')}<input style={fs} type="date" value={v.publicationDate} onChange={e => s('publicationDate', e.target.value)} /></div>
        <div className="form-group">{lbl("Date d'entrée en vigueur")}<input style={fs} type="date" value={v.entryDate} onChange={e => s('entryDate', e.target.value)} /></div>
        <div className="form-group">{lbl('Statut')}<select style={fs} value={v.status} onChange={e => s('status', e.target.value)}>{LOI_STATUS.map(st => <option key={st.v} value={st.v}>{st.l}</option>)}</select></div>
      </div>
      <div className="form-group">{lbl('Résumé')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.summary} onChange={e => s('summary', e.target.value)} rows={4} placeholder="Résumé de la loi et de ses dispositions essentielles…" /></div>
      <div className="form-group">{lbl('Articles clés (un par ligne)')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.keyArticles} onChange={e => s('keyArticles', e.target.value)} rows={4} placeholder="Art. 1 — …&#10;Art. 3 — …" /></div>
      <div style={row2}>
        <div className="form-group">{lbl('Tags (virgules)')}<input style={fs} type="text" value={v.tags} onChange={e => s('tags', e.target.value)} placeholder="loi, santé, pharmacie…" /></div>
        <div className="form-group">{lbl('Langue')}<select style={fs} value={v.language} onChange={e => s('language', e.target.value)}><option value="fr">Français</option><option value="en">Anglais</option></select></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   8. PHOTOS
═══════════════════════════════════════════════════════ */
const EMPTY_PHOTO = { title: '', description: '', image: '', thumbnail: '', album: '', date: '', photographer: '', location: '', category: 'Général', tags: '', orientation: 'landscape', featured: false, isActive: true, order: 1 };
const PHOTO_CATS = ['Général', 'Événements', 'Formation', 'Institution', 'Cérémonies', 'Conférences'];
const ORIENTATIONS = [{ v: 'landscape', l: '🖼️ Paysage' }, { v: 'portrait', l: '📱 Portrait' }, { v: 'square', l: '⬛ Carré' }];

const PhotoForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_PHOTO; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const { upload, uploading } = useCloudinaryUpload();
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, tags: v.tags.split(',').map(t => t.trim()).filter(Boolean), thumbnail: v.thumbnail || v.image }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Titre', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre de la photo" /></div>
      <div className="form-group">{lbl('Description')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.description} onChange={e => s('description', e.target.value)} rows={3} placeholder="Description de la photo…" /></div>
      <div style={row2}>
        <ImageField label="🖼️ Photo principale *" value={v.image} onChange={u => s('image', u)} uploadKey="photo" upload={upload} uploading={uploading} />
        <ImageField label="🔍 Miniature (optionnel)" value={v.thumbnail} onChange={u => s('thumbnail', u)} uploadKey="thumb" upload={upload} uploading={uploading} />
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Album')}<input style={fs} type="text" value={v.album} onChange={e => s('album', e.target.value)} placeholder="Congrès 2024, Inauguration…" /></div>
        <div className="form-group">{lbl('Photographe')}<input style={fs} type="text" value={v.photographer} onChange={e => s('photographer', e.target.value)} placeholder="Nom du photographe" /></div>
        <div className="form-group">{lbl('Lieu')}<input style={fs} type="text" value={v.location} onChange={e => s('location', e.target.value)} placeholder="Libreville, Gabon" /></div>
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Date')}<input style={fs} type="date" value={v.date} onChange={e => s('date', e.target.value)} /></div>
        <div className="form-group">{lbl('Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{PHOTO_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
        <div className="form-group">{lbl('Orientation')}<select style={fs} value={v.orientation} onChange={e => s('orientation', e.target.value)}>{ORIENTATIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
      </div>
      <div className="form-group">{lbl('Tags (virgules)')}<input style={fs} type="text" value={v.tags} onChange={e => s('tags', e.target.value)} placeholder="événement, formation, ONPG…" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   9. THÈSES
═══════════════════════════════════════════════════════ */
const EMPTY_THESE = { title: '', author: '', director: '', university: '', faculty: '', department: '', degree: 'phd', year: new Date().getFullYear(), abstract: '', keywords: '', pages: '', language: 'fr', specialty: '', defenseDate: '', juryMembers: '', pdfUrl: '', featured: false, isActive: true, order: 1 };
const THESE_DEGREES = [{ v: 'master', l: '🎓 Master' }, { v: 'phd', l: '🎓 Doctorat/PhD' }, { v: 'doctorate', l: '🎓 Doctorat d\'État' }];

const TheseForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_THESE; editing: boolean; onSave: (d: any) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await onSave({ ...v, keywords: v.keywords.split(',').map(k => k.trim()).filter(Boolean), juryMembers: v.juryMembers.split(',').map(m => m.trim()).filter(Boolean), pages: v.pages ? +v.pages : undefined }); }
    finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="form-group">{lbl('Titre de la thèse', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre complet de la thèse…" /></div>
      <div style={row2}>
        <div className="form-group">{lbl("Auteur (étudiant)", true)}<input style={fs} type="text" value={v.author} onChange={e => s('author', e.target.value)} required placeholder="Prénom Nom" /></div>
        <div className="form-group">{lbl('Directeur de thèse')}<input style={fs} type="text" value={v.director} onChange={e => s('director', e.target.value)} placeholder="Prof. Prénom Nom" /></div>
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Université')}<input style={fs} type="text" value={v.university} onChange={e => s('university', e.target.value)} placeholder="Université Omar Bongo" /></div>
        <div className="form-group">{lbl('Faculté')}<input style={fs} type="text" value={v.faculty} onChange={e => s('faculty', e.target.value)} placeholder="Faculté de Médecine" /></div>
        <div className="form-group">{lbl('Département')}<input style={fs} type="text" value={v.department} onChange={e => s('department', e.target.value)} placeholder="Pharmacie" /></div>
      </div>
      <div style={row3}>
        <div className="form-group">{lbl('Grade')}<select style={fs} value={v.degree} onChange={e => s('degree', e.target.value)}>{THESE_DEGREES.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}</select></div>
        <div className="form-group">{lbl('Spécialité')}<input style={fs} type="text" value={v.specialty} onChange={e => s('specialty', e.target.value)} placeholder="Pharmacologie, Biochimie…" /></div>
        <div className="form-group">{lbl('Année')}<input style={fs} type="number" value={v.year} onChange={e => s('year', +e.target.value)} min={1990} max={2099} /></div>
      </div>
      <div style={row2}>
        <div className="form-group">{lbl('Date de soutenance')}<input style={fs} type="date" value={v.defenseDate} onChange={e => s('defenseDate', e.target.value)} /></div>
        <div className="form-group">{lbl('Nombre de pages')}<input style={fs} type="number" value={v.pages} onChange={e => s('pages', e.target.value)} min={1} placeholder="120" /></div>
      </div>
      <div className="form-group">{lbl('Résumé (Abstract)')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.abstract} onChange={e => s('abstract', e.target.value)} rows={5} placeholder="Résumé scientifique de la thèse…" /></div>
      <div className="form-group">{lbl('Membres du jury (séparés par virgules)')}<input style={fs} type="text" value={v.juryMembers} onChange={e => s('juryMembers', e.target.value)} placeholder="Prof. A, Dr. B, Pr. C…" /></div>
      <div className="form-group">{lbl('Mots-clés (virgules)')}<input style={fs} type="text" value={v.keywords} onChange={e => s('keywords', e.target.value)} placeholder="pharmacologie, cancer, thérapie…" /></div>
      <div style={row2}>
        <div className="form-group">{lbl('Lien PDF')}<input style={fs} type="url" value={v.pdfUrl} onChange={e => s('pdfUrl', e.target.value)} placeholder="https://…/these.pdf" /></div>
        <div className="form-group">{lbl('Langue')}<select style={fs} value={v.language} onChange={e => s('language', e.target.value)}><option value="fr">Français</option><option value="en">Anglais</option></select></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
        <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
        <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
      </div>
      <FormActions editing={editing} saving={saving} onCancel={onCancel} />
    </form>
  );
};

/* ═══════════════════════════════════════════════════════
   10. VIDÉOS YOUTUBE (inchangé + preview card)
═══════════════════════════════════════════════════════ */
const EMPTY_VIDEO = { title: '', description: '', youtubeUrl: '', youtubeId: '', thumbnail: '', duration: '', speaker: '', event: '', category: 'Institution', tags: '', featured: false, isActive: true, order: 1 };
const VIDEO_CATS = ['Institution', 'Formation Continue', 'Réglementation', 'Éthique', 'Innovation', 'Événement', 'Conférence'];

const VideoPreviewCard = ({ v }: { v: typeof EMPTY_VIDEO }) => {
  const thumb = v.thumbnail || (v.youtubeId ? youtubeThumbnail(v.youtubeId) : null);
  return (
    <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', maxWidth: 380 }}>
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111' }}>
        {thumb ? <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.85rem' }}>Miniature YouTube</div>}
        {v.duration && <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '2px 7px', borderRadius: 4, fontSize: '0.78rem', fontWeight: 700 }}>{v.duration}</span>}
        {v.featured && <span style={{ position: 'absolute', top: 8, left: 8, background: '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>⭐ Vedette</span>}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(220,38,38,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>
      <div style={{ padding: '1rem' }}>
        {v.category && <span style={{ display: 'inline-block', background: '#EFF6FF', color: '#2563EB', padding: '2px 10px', borderRadius: 20, fontSize: '0.73rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{v.category}</span>}
        <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.97rem', color: '#1C1917', lineHeight: 1.35 }}>{v.title || <span style={{ color: '#aaa' }}>Titre de la vidéo…</span>}</p>
        {v.description && <p style={{ margin: '0 0 0.6rem', fontSize: '0.82rem', color: '#57534E', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {v.speaker && <span style={{ fontSize: '0.78rem', color: '#78716C' }}>👤 {v.speaker}</span>}
          {v.event && <span style={{ fontSize: '0.78rem', color: '#78716C' }}>📍 {v.event}</span>}
        </div>
        {v.tags && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>{v.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => <span key={tag} style={{ background: '#F5F5F4', color: '#57534E', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem' }}>#{tag}</span>)}</div>}
      </div>
    </div>
  );
};

const VideoForm = ({ initial, editing, onSave, onCancel }: { initial: typeof EMPTY_VIDEO; editing: boolean; onSave: (d: typeof EMPTY_VIDEO) => Promise<void>; onCancel: () => void }) => {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [urlError, setUrlError] = useState('');
  const s = (k: string, val: any) => setV(p => ({ ...p, [k]: val }));
  const handleUrl = (raw: string) => {
    setUrlError('');
    const id = extractYoutubeId(raw.trim());
    if (raw && !id) setUrlError('URL YouTube non reconnue');
    setV(p => ({ ...p, youtubeUrl: raw, youtubeId: id || p.youtubeId, thumbnail: id ? youtubeThumbnail(id) : p.thumbnail }));
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.youtubeId) { alert('Entrez une URL YouTube valide'); return; }
    setSaving(true);
    try { await onSave(v); } finally { setSaving(false); }
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          {lbl('🔗 URL YouTube', true)}
          <input style={{ ...fs, borderColor: urlError ? '#dc2626' : '#E7E5E0' }} type="text" value={v.youtubeUrl} onChange={e => handleUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
          {urlError && <p style={{ color: '#dc2626', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>{urlError}</p>}
          {v.youtubeId && <p style={{ color: '#059669', fontSize: '0.82rem', margin: '0.25rem 0 0' }}>✅ ID : <code style={{ background: '#F0FDF4', padding: '1px 6px', borderRadius: 4 }}>{v.youtubeId}</code></p>}
        </div>
        <div className="form-group">{lbl('Titre', true)}<input style={fs} type="text" value={v.title} onChange={e => s('title', e.target.value)} required placeholder="Titre de la vidéo" /></div>
        <div className="form-group">{lbl('Description')}<textarea style={{ ...fs, resize: 'vertical' }} value={v.description} onChange={e => s('description', e.target.value)} rows={4} placeholder="Description de la vidéo…" /></div>
        <div style={row2}>
          <div className="form-group">{lbl('👤 Intervenant / Auteur')}<input style={fs} type="text" value={v.speaker} onChange={e => s('speaker', e.target.value)} placeholder="Nom du conférencier" /></div>
          <div className="form-group">{lbl('📍 Événement')}<input style={fs} type="text" value={v.event} onChange={e => s('event', e.target.value)} placeholder="Conférence, séminaire…" /></div>
        </div>
        <div style={row2}>
          <div className="form-group">{lbl('🏷️ Catégorie')}<select style={fs} value={v.category} onChange={e => s('category', e.target.value)}>{VIDEO_CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div className="form-group">{lbl('⏱️ Durée (ex : 15:30)')}<input style={fs} type="text" value={v.duration} onChange={e => s('duration', e.target.value)} placeholder="mm:ss" /></div>
        </div>
        <div className="form-group">{lbl('🔖 Tags (virgules)')}<input style={fs} type="text" value={v.tags} onChange={e => s('tags', e.target.value)} placeholder="ONPG, pharmacie, formation…" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">{lbl('Ordre')}<input style={fs} type="number" min={1} value={v.order} onChange={e => s('order', +e.target.value)} /></div>
          <ChkBox checked={v.featured} onChange={val => s('featured', val)} label="⭐ Vedette" />
          <ChkBox checked={v.isActive} onChange={val => s('isActive', val)} label="✅ Actif" />
        </div>
        <FormActions editing={editing} saving={saving} onCancel={onCancel} />
      </form>
      <div style={{ position: 'sticky', top: '1rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>👁️ Aperçu de la carte</p>
        <VideoPreviewCard v={v} />
        {v.youtubeId && <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: '#dc2626', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>▶ Ouvrir sur YouTube ↗</a>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   CONFIG : map collection → composant + état initial + titre
═══════════════════════════════════════════════════════ */
type CollectionId = 'actualites' | 'communiques' | 'articles' | 'commissions' | 'decisions' | 'decrets' | 'lois' | 'photos' | 'theses' | 'videos';

const COLLECTION_CONFIG: Record<CollectionId, {
  name: string;
  icon: string;
  emptyData: () => any;
  toInitial: (item: any) => any;
  FormComponent: React.FC<any>;
}> = {
  actualites: {
    name: 'Actualités', icon: '📰',
    emptyData: () => ({ ...EMPTY_ACTU }),
    toInitial: (item: any) => ({ ...EMPTY_ACTU, ...item, authorName: item.author?.name || '', authorRole: item.author?.role || '', tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') }),
    FormComponent: ActualiteForm,
  },
  communiques: {
    name: 'Communiqués', icon: '📢',
    emptyData: () => ({ ...EMPTY_COMM }),
    toInitial: (item: any) => ({ ...EMPTY_COMM, ...item }),
    FormComponent: CommuniqueForm,
  },
  articles: {
    name: 'Articles scientifiques', icon: '🔬',
    emptyData: () => ({ ...EMPTY_ART }),
    toInitial: (item: any) => ({ ...EMPTY_ART, ...item, authors: Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || ''), keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : (item.keywords || '') }),
    FormComponent: ArticleScientifiqueForm,
  },
  commissions: {
    name: 'Commissions', icon: '🏛️',
    emptyData: () => ({ ...EMPTY_COMMISSION }),
    toInitial: (item: any) => ({ ...EMPTY_COMMISSION, ...item, name: item.name || item.title || '', members: Array.isArray(item.members) ? item.members.join(', ') : (item.members || ''), missions: Array.isArray(item.missions) ? item.missions.join('\n') : (item.missions || '') }),
    FormComponent: CommissionForm,
  },
  decisions: {
    name: 'Décisions', icon: '⚖️',
    emptyData: () => ({ ...EMPTY_DECISION }),
    toInitial: (item: any) => ({ ...EMPTY_DECISION, ...item, parties: Array.isArray(item.parties) ? item.parties.join(', ') : (item.parties || ''), keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : (item.keywords || '') }),
    FormComponent: DecisionForm,
  },
  decrets: {
    name: 'Décrets', icon: '📜',
    emptyData: () => ({ ...EMPTY_DECRET }),
    toInitial: (item: any) => ({ ...EMPTY_DECRET, ...item, keyArticles: Array.isArray(item.keyArticles) ? item.keyArticles.join('\n') : (item.keyArticles || ''), tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') }),
    FormComponent: DecretForm,
  },
  lois: {
    name: 'Lois', icon: '📗',
    emptyData: () => ({ ...EMPTY_LOI }),
    toInitial: (item: any) => ({ ...EMPTY_LOI, ...item, keyArticles: Array.isArray(item.keyArticles) ? item.keyArticles.join('\n') : (item.keyArticles || ''), tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') }),
    FormComponent: LoiForm,
  },
  photos: {
    name: 'Photos', icon: '📷',
    emptyData: () => ({ ...EMPTY_PHOTO }),
    toInitial: (item: any) => ({ ...EMPTY_PHOTO, ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') }),
    FormComponent: PhotoForm,
  },
  theses: {
    name: 'Thèses', icon: '🎓',
    emptyData: () => ({ ...EMPTY_THESE }),
    toInitial: (item: any) => ({ ...EMPTY_THESE, ...item, keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : (item.keywords || ''), juryMembers: Array.isArray(item.juryMembers) ? item.juryMembers.join(', ') : (item.juryMembers || ''), pages: item.pages?.toString() || '' }),
    FormComponent: TheseForm,
  },
  videos: {
    name: 'Vidéos (YouTube)', icon: '🎬',
    emptyData: () => ({ ...EMPTY_VIDEO }),
    toInitial: (item: any) => ({ ...EMPTY_VIDEO, ...item, youtubeUrl: item.youtubeId ? `https://www.youtube.com/watch?v=${item.youtubeId}` : '', tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') }),
    FormComponent: VideoForm,
  },
};

/* ═══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════ */
const PageMocks = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<CollectionId>('actualites');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formInitial, setFormInitial] = useState<any>({});
  const formRef = useRef<HTMLDivElement>(null);

  const config = COLLECTION_CONFIG[selectedCollection];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/${selectedCollection}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const items = response.data.data || [];
      setData(Array.isArray(items) ? items : (items ? [items] : []));
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedCollection]);

  const scrollToForm = () => setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

  const handleNew = () => {
    setEditingItem(null);
    setFormInitial(config.emptyData());
    setShowForm(true);
    scrollToForm();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormInitial(config.toInitial(item));
    setShowForm(true);
    scrollToForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return;
    try {
      await axios.delete(`${API_URL}/admin/${selectedCollection}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      fetchData();
      alert('✅ Supprimé avec succès !');
    } catch { alert('❌ Erreur lors de la suppression'); }
  };

  /* Sauvegarde vidéo (spécifique) */
  const handleVideoSave = async (v: typeof EMPTY_VIDEO) => {
    const tagsArray = v.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { title: v.title, description: v.description, youtubeId: v.youtubeId, thumbnail: v.thumbnail || youtubeThumbnail(v.youtubeId), duration: v.duration, speaker: v.speaker, event: v.event, category: v.category, tags: tagsArray, featured: v.featured, isActive: v.isActive, order: v.order };
    const url = editingItem ? `${API_URL}/admin/videos/${editingItem._id}` : `${API_URL}/admin/videos`;
    await axios[editingItem ? 'put' : 'post'](url, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });
    setShowForm(false); setEditingItem(null); fetchData();
    alert('✅ Vidéo enregistrée !');
  };

  /* Sauvegarde générique */
  const handleGenericSave = async (payload: any) => {
    const url = editingItem ? `${API_URL}/admin/${selectedCollection}/${editingItem._id}` : `${API_URL}/admin/${selectedCollection}`;
    await axios[editingItem ? 'put' : 'post'](url, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });
    setShowForm(false); setEditingItem(null); fetchData();
    alert('✅ Enregistré avec succès !');
  };

  const handleSave = selectedCollection === 'videos' ? handleVideoSave : handleGenericSave;

  const collections = Object.entries(COLLECTION_CONFIG).map(([id, cfg]) => ({ id: id as CollectionId, name: `${cfg.icon} ${cfg.name}` }));

  const FormComponent = config.FormComponent;

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
            <h1>{config.icon} Gestion — {config.name}</h1>
            <button className="btn-primary" onClick={handleNew}>
              ➕ Nouveau
            </button>
          </div>

          {/* Sélecteur de collection */}
          <div className="filters-bar">
            <select
              value={selectedCollection}
              onChange={e => {
                setSelectedCollection(e.target.value as CollectionId);
                setEditingItem(null);
                setShowForm(false);
              }}
              className="filter-select"
            >
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="loading">Chargement…</div>
          ) : selectedCollection === 'videos' ? (
            /* Grille vidéos */
            data.length === 0 ? (
              <div className="empty-state"><p>Aucune vidéo. Cliquez sur &quot;Nouveau&quot;.</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
                {data.map(item => {
                  const thumb = item.thumbnail || (item.youtubeId ? youtubeThumbnail(item.youtubeId) : null);
                  return (
                    <div key={item._id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #E7E5E0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111' }}>
                        {thumb ? <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No thumb</div>}
                        {item.duration && <span style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{item.duration}</span>}
                        {item.featured && <span style={{ position: 'absolute', top: 6, left: 6, background: '#f59e0b', color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>⭐</span>}
                        {!item.isActive && <span style={{ position: 'absolute', top: 6, right: 6, background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>Inactif</span>}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(220,38,38,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {item.category && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>{item.category}</span>}
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#1C1917', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                        {item.speaker && <p style={{ margin: 0, fontSize: '0.78rem', color: '#78716C' }}>👤 {item.speaker}</p>}
                        {item.youtubeId && <a href={`https://youtu.be/${item.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>▶ youtu.be/{item.youtubeId}</a>}
                      </div>
                      <div style={{ padding: '0.6rem 0.85rem', borderTop: '1px solid #F5F5F4', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(item)} className="btn-edit" style={{ flex: 1 }}>✏️ Modifier</button>
                        <button onClick={() => handleDelete(item._id)} className="btn-delete">🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Tableau générique */
            <div className="table-container">
              {data.length === 0 ? (
                <div className="empty-state"><p>Aucune donnée. Cliquez sur &quot;Nouveau&quot; pour en ajouter.</p></div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Titre / Nom</th>
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
                        <td>{item.title || item.name || item.reference || '—'}</td>
                        <td>{item.category || '—'}</td>
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

          {/* Formulaire dédié */}
          {showForm && (
            <section ref={formRef} className="dashboard-section" style={{ marginTop: '2.5rem' }}>
              <div className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.6rem' }}>
                  {editingItem ? `✏️ Modifier` : `➕ Nouveau`} — {config.icon} {config.name}
                </h1>
                <button className="btn-secondary" onClick={() => setShowForm(false)}>✕ Fermer</button>
              </div>
              <FormComponent
                key={`${selectedCollection}-${editingItem?._id ?? 'new'}`}
                initial={formInitial}
                editing={!!editingItem}
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default PageMocks;
