import { useNavigate, Link } from 'react-router-dom';
import './NotFound404.css';

const QUICK_LINKS = [
  { to: '/',                       icon: '🏠', label: 'Accueil'            },
  { to: '/ordre/a-propos',         icon: '🏛️', label: "L'Ordre"           },
  { to: '/membres/tableau-ordre',  icon: '👥', label: 'Membres'           },
  { to: '/pratique/pharmacies',    icon: '💊', label: 'Pharmacies'        },
  { to: '/ressources',             icon: '📚', label: 'Ressources'        },
  { to: '/pratique/contact',       icon: '✉️', label: 'Contact'           },
];

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="nf-page">
      {/* Fond décoratif */}
      <div className="nf-bg" aria-hidden="true">
        <div className="nf-bg__circle nf-bg__circle--1" />
        <div className="nf-bg__circle nf-bg__circle--2" />
        <div className="nf-bg__pill" />
      </div>

      <div className="nf-content">
        {/* Numéro 404 animé */}
        <div className="nf-code" aria-hidden="true">
          <span className="nf-code__4">4</span>
          <span className="nf-code__0">
            {/* Pilule médicale SVG */}
            <svg viewBox="0 0 80 80" fill="none" className="nf-pill-svg">
              <circle cx="40" cy="40" r="36" fill="rgba(0,166,81,0.12)" stroke="#00A651" strokeWidth="3"/>
              <path d="M40 14 C40 14 52 26 52 40 C52 54 40 66 40 66 C40 66 28 54 28 40 C28 26 40 14 40 14Z" fill="#00A651" opacity="0.35"/>
              <line x1="40" y1="14" x2="40" y2="66" stroke="#00A651" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="40" cy="40" r="4" fill="#00A651"/>
            </svg>
          </span>
          <span className="nf-code__4 nf-code__4--right">4</span>
        </div>

        {/* Message principal */}
        <h1 className="nf-title">Page introuvable</h1>
        <p className="nf-desc">
          La page que vous cherchez n'existe pas ou a été déplacée.<br />
          Pas de panique, voici comment retrouver votre chemin&nbsp;:
        </p>

        {/* Boutons d'action */}
        <div className="nf-actions">
          <button className="nf-btn nf-btn--primary" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Page précédente
          </button>
          <Link to="/" className="nf-btn nf-btn--secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Accueil
          </Link>
        </div>

        {/* Liens rapides */}
        <div className="nf-links">
          <p className="nf-links__label">Ou accédez directement à :</p>
          <ul className="nf-links__grid">
            {QUICK_LINKS.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="nf-link-card">
                  <span className="nf-link-card__icon">{link.icon}</span>
                  <span className="nf-link-card__label">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound404;

