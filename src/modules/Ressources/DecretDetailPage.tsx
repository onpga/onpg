import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import ShareButtons from '../../components/ShareButtons/ShareButtons';
import '../../components/ShareButtons/ShareButtons.css';
import './Decrets.css';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  active:    { label: 'En vigueur', color: '#065F46', bg: '#D1FAE5', icon: '✅' },
  modified:  { label: 'Modifié',   color: '#92400E', bg: '#FEF3C7', icon: '⚠️' },
  abrogated: { label: 'Abrogé',    color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
};

const formatDate = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
  catch { return d; }
};

const DecretDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decret, setDecret] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) { navigate('/ressources/decrets'); return; }
      try {
        const data = await fetchResourceById('decrets', id);
        if (!data) { navigate('/ressources/decrets'); return; }
        setDecret({
          number:          data.number          || '',
          title:           data.title           || '',
          publicationDate: data.publicationDate || data.date || '',
          entryDate:       data.entryDate       || '',
          ministry:        data.ministry        || '',
          category:        data.category        || 'Général',
          status:          data.status          || 'active',
          summary:         data.summary         || '',
          keyArticles:     Array.isArray(data.keyArticles) ? data.keyArticles : [],
          tags:            Array.isArray(data.tags)        ? data.tags        : [],
          language:        data.language        || 'fr',
          featured:        data.featured        || false,
        });
      } catch {
        navigate('/ressources/decrets');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="decrets-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: '#666' }}>
          <div className="decrets-loader" />
          <p>Chargement du décret…</p>
        </div>
      </div>
    );
  }

  if (!decret) return null;

  const cfg = STATUS_CONFIG[decret.status] ?? STATUS_CONFIG.active;

  return (
    <div className="decrets-page">

      {/* ── HERO ── */}
      <section className="decrets-hero">
        <div className="decrets-hero-content">

          {/* Fil d'Ariane */}
          <nav style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link to="/ressources" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Ressources</Link>
            <span>›</span>
            <Link to="/ressources/decrets" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Décrets</Link>
            <span>›</span>
            <span style={{ color: '#fff' }}>{decret.number || decret.title}</span>
          </nav>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {decret.number && (
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.88rem', fontWeight: 700 }}>
                📜 {decret.number}
              </span>
            )}
            <span style={{ color: cfg.color, background: cfg.bg, padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700 }}>
              {cfg.icon} {cfg.label}
            </span>
            {decret.featured && (
              <span style={{ background: '#F59E0B', color: '#000', padding: '0.3rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>⭐ Texte clé</span>
            )}
          </div>

          {/* Titre */}
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.25, margin: '0 0 1.25rem', textAlign: 'center', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
            {decret.title}
          </h1>

          {/* Métadonnées */}
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '0.85rem 1.5rem', justifyContent: 'center' }}>
            {decret.publicationDate && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>📅 Publication :</span> {formatDate(decret.publicationDate)}
              </span>
            )}
            {decret.entryDate && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>⚡ En vigueur :</span> {formatDate(decret.entryDate)}
              </span>
            )}
            {decret.ministry && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>🏛️</span> {decret.ministry}
              </span>
            )}
            {decret.language && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>🌐</span> {decret.language === 'fr' ? 'Français' : 'Anglais'}
              </span>
            )}
          </div>

        </div>
      </section>

      {/* ── CONTENU ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Bouton retour */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/ressources/decrets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', color: '#008F45', border: '1.5px solid #008F45', padding: '0.55rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            ← Retour aux décrets
          </Link>
        </div>

        {/* Résumé */}
        {decret.summary && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Résumé
            </h2>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.75, margin: 0 }}>
              {decret.summary}
            </p>
          </section>
        )}

        {/* Articles clés */}
        {decret.keyArticles.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📜 Articles clés
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {decret.keyArticles.map((article: string, i: number) => (
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
        {decret.tags.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem' }}>
              🏷️ Tags
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {decret.tags.map((tag: string, i: number) => (
                <span key={i} style={{ background: 'rgba(0,166,81,0.08)', color: '#008F45', border: '1px solid rgba(0,166,81,0.2)', borderRadius: 20, padding: '0.3rem 0.85rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Boutons de partage */}
        <ShareButtons
          title={decret.title}
          description={decret.summary}
          tags={decret.tags}
        />

        {/* Fallback contenu vide */}
        {!decret.summary && decret.keyArticles.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px dashed #CBD5E1', padding: '3rem 2rem', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📜</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Le contenu détaillé de ce décret sera disponible prochainement.</p>
          </div>
        )}

        {/* Retour bas de page */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/ressources/decrets" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#00A651', color: '#fff', padding: '0.75rem 2rem', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
            ← Retour à la liste des décrets
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DecretDetailPage;
