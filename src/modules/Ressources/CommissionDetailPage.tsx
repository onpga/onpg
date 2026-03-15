import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import ShareButtons from '../../components/ShareButtons/ShareButtons';
import '../../components/ShareButtons/ShareButtons.css';
import './Commissions.css';
import './CommissionDetail.css';

const CATEGORY_ICONS: Record<string, string> = {
  'Éthique': '⚖️', 'Formation': '🎓', 'Réglementation': '📜', 'Disciplinaire': '🔨',
  'Technique': '🔬', 'Finance': '💰', 'Communication': '📢', 'Général': '🏛️',
};

const CommissionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commission, setCommission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) { navigate('/ressources?tab=commissions'); return; }
        const data = await fetchResourceById('commissions', id);
        if (!data) { navigate('/ressources?tab=commissions'); return; }
        setCommission(data);
      } catch {
        navigate('/ressources?tab=commissions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="comm-detail-page">
        <div className="comm-detail-loading">
          <div className="comm-loader" />
          <p>Chargement de la commission…</p>
        </div>
      </div>
    );
  }

  if (!commission) return null;

  /* Normalisation des champs (la DB enregistre title = name) */
  const name        = commission.name || commission.title || '';
  const description = commission.description || '';
  const president   = commission.president || '';
  const members     = Array.isArray(commission.members) ? commission.members : [];
  const missions    = Array.isArray(commission.missions) ? commission.missions : [];
  const category    = commission.category || 'Général';
  const status      = commission.status || 'active';
  const creationDate = commission.creationDate || '';
  const featured    = commission.featured || false;
  const icon        = CATEGORY_ICONS[category] || '🏛️';
  const content     = commission.content || '';

  return (
    <div className="comm-detail-page">

      {/* ═══ HERO ═══ */}
      <section className="comm-hero" style={{ paddingBottom: '3rem' }}>
        <div className="comm-hero-bg">
          <div className="comm-orb comm-orb-1" />
          <div className="comm-orb comm-orb-2" />
          <div className="comm-orb comm-orb-3" />
        </div>
        <div className="comm-hero-content">
          {/* Breadcrumb */}
          <nav className="comm-detail-breadcrumb">
            <Link to="/">Accueil</Link>
            <span>›</span>
            <Link to="/ressources">Ressources</Link>
            <span>›</span>
            <Link to="/ressources?tab=commissions">Commissions</Link>
            <span>›</span>
            <span>{name}</span>
          </nav>

          {/* Badges */}
          <div className="comm-detail-badges">
            <span className="comm-hero-badge">
              <span>{icon}</span>
              <span>{category}</span>
            </span>
            <span className={`comm-status-badge ${status}`} style={{ marginLeft: 8 }}>
              {status === 'active' ? '● Active' : '○ Inactive'}
            </span>
            {featured && <span className="comm-card-featured" style={{ position: 'static', marginLeft: 8 }}>⭐ À la une</span>}
          </div>

          {/* Titre */}
          <h1 className="comm-hero-title" style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {name}
          </h1>

          {/* Métadonnée : date de création */}
          {creationDate && (
            <p className="comm-hero-subtitle" style={{ marginTop: '0.5rem', opacity: 0.85, fontSize: '0.95rem' }}>
              📅 Commission créée le {new Date(creationDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* ═══ BODY ═══ */}
      <div className="comm-detail-body">

        {/* Description */}
        {description && (
          <section className="comm-detail-section">
            <h2 className="comm-detail-section-title">📋 Présentation</h2>
            <p className="comm-detail-description">{description}</p>
          </section>
        )}

        {/* Analyse detaillee */}
        {content && (
          <section className="comm-detail-section">
            <h2 className="comm-detail-section-title">🧭 Analyse detaillee</h2>
            <div
              className="comm-detail-description"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </section>
        )}

        {/* Président */}
        {president && (
          <section className="comm-detail-section comm-detail-president-section">
            <h2 className="comm-detail-section-title">👤 Président de la commission</h2>
            <div className="comm-detail-president-card">
              <div className="comm-detail-president-avatar">{president.charAt(0).toUpperCase()}</div>
              <div>
                <div className="comm-detail-president-name">{president}</div>
                <div className="comm-detail-president-role">Président</div>
              </div>
            </div>
          </section>
        )}

        {/* Missions */}
        {missions.length > 0 && (
          <section className="comm-detail-section">
            <h2 className="comm-detail-section-title">🎯 Missions principales</h2>
            <ul className="comm-detail-missions-list">
              {missions.map((m: string, i: number) => (
                <li key={i} className="comm-detail-mission-item">
                  <span className="comm-detail-mission-bullet">✓</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Membres */}
        {members.length > 0 && (
          <section className="comm-detail-section">
            <h2 className="comm-detail-section-title">👥 Composition ({members.length} membre{members.length > 1 ? 's' : ''})</h2>
            <div className="comm-detail-members-grid">
              {members.map((m: string, i: number) => (
                <div key={i} className="comm-detail-member-card">
                  <div className="comm-detail-member-avatar">{m.charAt(0).toUpperCase()}</div>
                  <span className="comm-detail-member-name">{m}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Boutons de partage */}
        <ShareButtons
          title={name}
          description={description}
        />

        {/* Aucun contenu */}
        {!description && missions.length === 0 && members.length === 0 && (
          <section className="comm-detail-section">
            <div className="comm-empty" style={{ padding: '3rem 0' }}>
              <div className="comm-empty-icon">🏛️</div>
              <h3 className="comm-empty-title">Informations à venir</h3>
              <p className="comm-empty-text">Le détail de cette commission sera enrichi prochainement.</p>
            </div>
          </section>
        )}

        {/* Retour */}
        <div className="comm-detail-back">
          <Link to="/ressources?tab=commissions" className="comm-detail-back-btn">
            ← Retour aux commissions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommissionDetailPage;
