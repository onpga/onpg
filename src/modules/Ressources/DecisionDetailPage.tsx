import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import ShareButtons from '../../components/ShareButtons/ShareButtons';
import '../../components/ShareButtons/ShareButtons.css';
import './Decisions.css';

const DECISION_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  favorable:                { label: 'Favorable',               color: '#065F46', bg: '#D1FAE5', icon: '✅' },
  defavorable:              { label: 'Défavorable',             color: '#991B1B', bg: '#FEE2E2', icon: '❌' },
  'partiellement favorable':{ label: 'Part. favorable',         color: '#92400E', bg: '#FEF3C7', icon: '⚖️' },
  irrecevable:              { label: 'Irrecevable',             color: '#4B5563', bg: '#F3F4F6', icon: '🚫' },
};

const formatDate = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
  catch { return d; }
};

const DecisionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) { navigate('/ressources/decisions'); return; }
      try {
        const data = await fetchResourceById('decisions', id);
        if (!data) { navigate('/ressources/decisions'); return; }
        setDecision({
          title:       data.title        || '',
          reference:   data.reference    || '',
          date:        data.date         || '',
          jurisdiction:data.jurisdiction || '',
          category:    data.category     || 'Général',
          summary:     data.summary      || '',
          content:     data.content      || '',
          parties:     Array.isArray(data.parties)  ? data.parties  : [],
          outcome:     data.decision     || 'favorable',
          keywords:    Array.isArray(data.keywords) ? data.keywords : [],
          featured:    data.featured     || false,
        });
      } catch {
        navigate('/ressources/decisions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="decisions-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: '#666' }}>
          <div className="decisions-loader" />
          <p>Chargement de la décision…</p>
        </div>
      </div>
    );
  }

  if (!decision) return null;

  const cfg = DECISION_CONFIG[decision.outcome] ?? DECISION_CONFIG.favorable;

  return (
    <div className="decisions-page">

      {/* ── HERO ── */}
      <section className="decisions-hero">
        <div className="decisions-hero-content">

          {/* Fil d'Ariane */}
          <nav style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link to="/ressources" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Ressources</Link>
            <span>›</span>
            <Link to="/ressources/decisions" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Décisions</Link>
            <span>›</span>
            <span style={{ color: '#fff' }}>{decision.reference || decision.title}</span>
          </nav>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {decision.reference && (
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.88rem', fontWeight: 700 }}>
                ⚖️ {decision.reference}
              </span>
            )}
            <span style={{ color: cfg.color, background: cfg.bg, padding: '0.35rem 1rem', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700 }}>
              {cfg.icon} {cfg.label}
            </span>
            {decision.featured && (
              <span style={{ background: '#F59E0B', color: '#000', padding: '0.3rem 0.9rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>⭐ Décision clé</span>
            )}
          </div>

          {/* Titre */}
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.25, margin: '0 0 1.25rem', textAlign: 'center', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
            {decision.title}
          </h1>

          {/* Métadonnées */}
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '0.85rem 1.5rem', justifyContent: 'center' }}>
            {decision.date && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>📅 Date :</span> {formatDate(decision.date)}
              </span>
            )}
            {decision.jurisdiction && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>🏛️ Juridiction :</span> {decision.jurisdiction}
              </span>
            )}
            {decision.category && (
              <span style={{ color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ opacity: 0.7 }}>📁</span> {decision.category}
              </span>
            )}
          </div>

        </div>
      </section>

      {/* ── CONTENU ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Bouton retour */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/ressources/decisions" className="decisions-card-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', color: '#008F45', border: '1.5px solid #008F45', padding: '0.55rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            ← Retour aux décisions
          </Link>
        </div>

        {/* Résumé */}
        {decision.summary && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Résumé de la décision
            </h2>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.75, margin: 0 }}>
              {decision.summary}
            </p>
          </section>
        )}

        {/* Analyse detaillee */}
        {decision.content && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🧭 Analyse detaillee
            </h2>
            <div
              style={{ color: '#334155', lineHeight: 1.75, fontSize: '0.97rem' }}
              dangerouslySetInnerHTML={{ __html: decision.content }}
            />
          </section>
        )}

        {/* Parties concernées */}
        {decision.parties.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.75rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👥 Parties concernées
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {decision.parties.map((p: string, i: number) => (
                <span key={i} style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 20, padding: '0.4rem 1rem', fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                  {p}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Mots-clés */}
        {decision.keywords.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #E2E8F0', padding: '1.25rem 2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#008F45', marginBottom: '0.85rem' }}>
              🏷️ Mots-clés
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {decision.keywords.map((kw: string, i: number) => (
                <span key={i} style={{ background: 'rgba(0,166,81,0.08)', color: '#008F45', border: '1px solid rgba(0,166,81,0.2)', borderRadius: 20, padding: '0.3rem 0.85rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  #{kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Boutons de partage */}
        <ShareButtons
          title={decision.title}
          description={decision.summary}
          tags={decision.keywords}
        />

        {/* Fallback contenu vide */}
        {!decision.summary && decision.parties.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px dashed #CBD5E1', padding: '3rem 2rem', textAlign: 'center', color: '#94A3B8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚖️</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Le détail de cette décision sera disponible prochainement.</p>
          </div>
        )}

        {/* Retour bas de page */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/ressources/decisions" className="decisions-card-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#00A651', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
            ← Retour à la liste des décisions
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DecisionDetailPage;
