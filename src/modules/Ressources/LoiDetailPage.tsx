import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import ShareButtons from '../../components/ShareButtons/ShareButtons';
import '../../components/ShareButtons/ShareButtons.css';
import './Lois.css';

interface LawDetail {
  _id: string;
  number: string;
  title: string;
  publicationDate: string;
  entryDate: string;
  category: string;
  summary: string;
  keyArticles: string[];
  tags: string[];
  status: 'active' | 'modified' | 'repealed';
  language: string;
  featured: boolean;
  pdfUrl: string;
  content: string;
}

const STATUS_CONFIG = {
  active:   { label: 'En vigueur',  color: '#065F46', bg: '#D1FAE5', icon: '✅' },
  modified: { label: 'Modifiée',    color: '#92400E', bg: '#FEF3C7', icon: '⚠️' },
  repealed: { label: 'Abrogée',     color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
};

const formatDate = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
  catch { return d; }
};

const LoiDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [law, setLaw] = useState<LawDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) { navigate('/ressources/lois'); return; }
      try {
        const data = await fetchResourceById('lois', id);
        if (!data) { navigate('/ressources/lois'); return; }
        setLaw({
          _id:             String(data._id || ''),
          number:          data.number        || '',
          title:           data.title         || '',
          publicationDate: data.publicationDate || data.date || '',
          entryDate:       data.entryDate      || data.date || '',
          category:        data.category       || 'Législation',
          summary:         data.summary        || '',
          keyArticles:     Array.isArray(data.keyArticles) ? data.keyArticles : [],
          tags:            Array.isArray(data.tags)        ? data.tags        : [],
          status:          (data.status as LawDetail['status']) || 'active',
          language:        data.language || 'fr',
          featured:        data.featured || false,
          pdfUrl:          data.pdfUrl || '',
          content:         data.content || '',
        });
      } catch {
        navigate('/ressources/lois');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="lois-page">
        <div className="lois-content">
          <div className="lois-loading">
            <div className="lois-loader" />
            <p>Chargement du texte législatif…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!law) return null;

  const statusCfg = STATUS_CONFIG[law.status] ?? STATUS_CONFIG.active;

  return (
    <div className="lois-page">

      {/* ── HERO ── */}
      <section className="lois-hero">
        <div className="lois-hero-bg">
          <div className="lois-orb lois-orb-1" />
          <div className="lois-orb lois-orb-2" />
          <div className="lois-orb lois-orb-3" />
        </div>
        <div className="lois-hero-content">

          {/* Fil d'Ariane */}
          <nav style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link to="/ressources" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Ressources</Link>
            <span>›</span>
            <Link to="/ressources/lois" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Lois</Link>
            <span>›</span>
            <span style={{ color: '#fff' }}>{law.number || law.title}</span>
          </nav>

          {/* Badge numéro + statut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {law.number && (
              <div className="lois-card-number" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                📜 Loi n° {law.number}
              </div>
            )}
            <span className="lois-status-badge" style={{ color: statusCfg.color, background: statusCfg.bg, fontSize: '0.85rem', padding: '0.35rem 1rem' }}>
              {statusCfg.icon} {statusCfg.label}
            </span>
            {law.featured && (
              <span style={{ background: '#F59E0B', color: '#000', padding: '0.3rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>⭐ Texte clé</span>
            )}
          </div>

          {/* Titre */}
          <h1 className="lois-hero-title" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>
            {law.title}
          </h1>

          {/* Catégorie */}
          {law.category && (
            <div className="lois-hero-badge" style={{ marginBottom: '1.5rem' }}>
              <span>⚖️</span>
              <span>{law.category}</span>
            </div>
          )}

          {/* Bouton PDF — si disponible */}
          {law.pdfUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <a
                href={law.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  background: '#fff', color: '#008F45',
                  padding: '0.75rem 1.75rem', borderRadius: 50,
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008F45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9,15 12,18 15,15"/>
                </svg>
                Télécharger le texte officiel (PDF)
              </a>
            </div>
          )}

          {/* Dates */}
          <div className="lois-card-dates" style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', justifyContent: 'center' }}>
            <div className="lois-date-item">
              <span className="lois-date-ico">📅</span>
              <span className="lois-date-lbl" style={{ color: 'rgba(255,255,255,0.7)' }}>Publication :</span>
              <span className="lois-date-val" style={{ color: '#fff' }}>{formatDate(law.publicationDate)}</span>
            </div>
            <div className="lois-date-sep" style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
            <div className="lois-date-item">
              <span className="lois-date-ico">⚡</span>
              <span className="lois-date-lbl" style={{ color: 'rgba(255,255,255,0.7)' }}>Entrée en vigueur :</span>
              <span className="lois-date-val" style={{ color: '#fff' }}>{formatDate(law.entryDate)}</span>
            </div>
            {law.language && (
              <>
                <div className="lois-date-sep" style={{ color: 'rgba(255,255,255,0.3)' }}>·</div>
                <div className="lois-date-item">
                  <span className="lois-date-ico">🌐</span>
                  <span className="lois-date-val" style={{ color: '#fff' }}>{law.language === 'fr' ? 'Français' : 'Anglais'}</span>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* ── CONTENU ── */}
      <div className="lois-content" style={{ maxWidth: 860 }}>

        {/* Bouton retour */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/ressources/lois" className="lois-card-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', color: '#008F45', border: '1.5px solid #008F45', padding: '0.55rem 1.2rem' }}>
            ← Retour aux lois
          </Link>
        </div>

        {/* Résumé */}
        {law.summary && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Résumé
            </h2>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.75, margin: 0 }}>
              {law.summary}
            </p>
          </section>
        )}

        {/* Analyse detaillee */}
        {law.content && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🧭 Analyse detaillee
            </h2>
            <div
              style={{ color: '#334155', lineHeight: 1.75, fontSize: '0.97rem' }}
              dangerouslySetInnerHTML={{ __html: law.content }}
            />
          </section>
        )}

        {/* Articles clés */}
        {law.keyArticles.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📜 Articles clés
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {law.keyArticles.map((article, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, background: '#00A651', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, marginTop: 1 }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.65 }}>
                    {article}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {law.tags.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem' }}>
              🏷️ Mots-clés
            </h2>
            <div className="lois-card-tags">
              {law.tags.map((tag, i) => (
                <span key={i} className="lois-tag">#{tag}</span>
              ))}
            </div>
          </section>
        )}

        {/* Boutons de partage */}
        <ShareButtons
          title={law.title}
          description={law.summary}
          tags={law.tags}
        />

        {/* Si tout est vide */}
        {!law.summary && law.keyArticles.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px dashed #CBD5E1', padding: '3rem 2rem', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Le contenu détaillé de ce texte sera disponible prochainement.</p>
          </div>
        )}

        {/* Bouton retour bas de page */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/ressources/lois" className="lois-card-btn">
            ← Retour à la liste des lois
          </Link>
        </div>
      </div>

    </div>
  );
};

export default LoiDetailPage;
