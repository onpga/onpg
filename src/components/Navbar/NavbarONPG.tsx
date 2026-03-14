import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { useThrottledScroll } from '../../hooks/useThrottledScroll';
import './NavbarONPG.css';

interface NavDropdownItem {
  path: string;
  label: string;
  divider?: boolean;
  featured?: boolean;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
  id: string;
  hasDropdown?: boolean;
  dropdown?: NavDropdownItem[];
  isButton?: boolean;
  hasPlus?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    label: 'Accueil',
    icon: '',
    hasDropdown: false,
    id: 'accueil'
  },
  {
    path: '/ordre',
    label: "L'Ordre",
    icon: '',
    hasDropdown: true,
    id: 'ordre',
    dropdown: [
      { path: '/ordre/a-propos',        label: 'À propos'          },
      { path: '/ordre/organigramme',    label: 'Organigramme'      },
      { path: '/ordre/conseil-national',label: 'Conseil National'  }
    ]
  },
  {
    path: '/membres',
    label: 'Membres',
    icon: '',
    hasDropdown: true,
    id: 'membres',
    dropdown: [
      { path: '/membres/tableau-ordre', label: "Tableau de l'Ordre" },
      { path: '/membres/section-a',     label: 'Section A'          },
      { path: '/membres/section-b',     label: 'Section B'          },
      { path: '/membres/section-c',     label: 'Section C'          },
      { path: '/membres/section-d',     label: 'Section D'          }
    ]
  },
  {
    path: '/pratique',
    label: 'Pratique',
    icon: '',
    hasDropdown: true,
    id: 'pratique',
    dropdown: [
      { path: '/pratique/formation-continue', label: 'Formation Continue' },
      { path: '/pratique/deontologie',        label: 'Déontologie'        },
      { path: '/pratique/pharmacies',         label: 'Pharmacies'         },
      { path: '/pratique/contact',            label: 'Contact'            }
    ]
  },
  {
    path: '/ressources',
    label: 'Ressources',
    icon: '',
    hasDropdown: true,
    id: 'ressources',
    dropdown: [
      { path: '/ressources',                    label: 'Centre documentaire', featured: true },
      { path: '',                               label: 'Textes & Documents',  divider: true  },
      { path: '/ressources?tab=decrets',        label: 'Décrets'      },
      { path: '/ressources?tab=lois',           label: 'Lois'         },
      { path: '/ressources?tab=decisions',      label: 'Décisions'    },
      { path: '/ressources?tab=commissions',    label: 'Commissions'  },
      { path: '/ressources?tab=theses',         label: 'Thèses'       },
      { path: '/ressources?tab=articles',       label: 'Articles'     },
      { path: '/ressources?tab=communiques',    label: 'Communiqués'  },
      { path: '',                               label: 'Médias',       divider: true  },
      { path: '/ressources/actualites',         label: 'Actualités'   },
      { path: '/ressources/photos',             label: 'Photos'       },
      { path: '/ressources/videos',             label: 'Vidéos'       }
    ]
  },
  {
    path: '/pratique/pharmacies',
    label: 'Trouver une pharmacie',
    icon: '',
    isButton: true,
    hasPlus: true,
    id: 'pharmacies'
  }
];

const NavbarONPG = () => {
  const [mobileMenuOpen, setMobileMenuOpen]           = useState(false);
  const [logoError, setLogoError]                     = useState(false);
  const [ordreDropdownOpen, setOrdreDropdownOpen]     = useState(false);
  const [membresDropdownOpen, setMembresDropdownOpen] = useState(false);
  const [pratiqueDropdownOpen, setPratiqueDropdownOpen]     = useState(false);
  const [ressourcesDropdownOpen, setRessourcesDropdownOpen] = useState(false);

  const location   = useLocation();
  const menuRef     = useRef<HTMLUListElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const navbarRef   = useRef<HTMLElement>(null);
  const closebtnRef = useRef<HTMLButtonElement>(null);

  const closeAllDropdowns = useCallback(() => {
    setOrdreDropdownOpen(false);
    setMembresDropdownOpen(false);
    setPratiqueDropdownOpen(false);
    setRessourcesDropdownOpen(false);
  }, []);

  const handleNavbarScroll = useCallback(() => {
    if (navbarRef.current) {
      navbarRef.current.style.position   = 'sticky';
      navbarRef.current.style.top        = '0';
      navbarRef.current.style.zIndex     = '999';
      navbarRef.current.style.visibility = 'visible';
      navbarRef.current.style.opacity    = '1';

      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = (document.documentElement.scrollHeight || 0) - (window.innerHeight || 0);
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      navbarRef.current.style.setProperty('--scroll-progress', `${progress * 100}%`);
    }
  }, []);

  useEffect(() => { handleNavbarScroll(); }, [handleNavbarScroll]);
  useThrottledScroll(handleNavbarScroll, 100, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
          menuRef.current    && !menuRef.current.contains(target) &&
          overlayRef.current &&  overlayRef.current.contains(target) &&
          !target.closest('.onpg-mobile-toggle')
        ) setMobileMenuOpen(false);
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') { closeAllDropdowns(); setMobileMenuOpen(false); }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown',   handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown',   handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen, closeAllDropdowns]);

  const navItems = useMemo(() => NAV_ITEMS, []);

  const activeItems = useMemo(() => {
    const p = location.pathname;
    return new Set(
      navItems
        .filter(item => item.path === '/' ? p === '/' : p === item.path || p.startsWith(item.path + '/'))
        .map(item => item.id)
    );
  }, [location.pathname, navItems]);

  // Focus le bouton fermer à l'ouverture du drawer pour l'accessibilité clavier
  useEffect(() => {
    if (mobileMenuOpen) {
      const id = requestAnimationFrame(() => {
        closebtnRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    } else {
      closeAllDropdowns();
    }
  }, [mobileMenuOpen, closeAllDropdowns]);

  const handleDropdownToggle = useCallback((itemId: string, currentState: boolean) => {
    setOrdreDropdownOpen(false);
    setMembresDropdownOpen(false);
    setPratiqueDropdownOpen(false);
    setRessourcesDropdownOpen(false);
    if (!currentState) {
      switch (itemId) {
        case 'ordre':      setOrdreDropdownOpen(true);      break;
        case 'membres':    setMembresDropdownOpen(true);    break;
        case 'pratique':   setPratiqueDropdownOpen(true);   break;
        case 'ressources': setRessourcesDropdownOpen(true); break;
      }
    }
  }, []);

  const handleDropdownOpen = useCallback((itemId: string) => {
    switch (itemId) {
      case 'ordre':      setOrdreDropdownOpen(true);      break;
      case 'membres':    setMembresDropdownOpen(true);    break;
      case 'pratique':   setPratiqueDropdownOpen(true);   break;
      case 'ressources': setRessourcesDropdownOpen(true); break;
    }
  }, []);

  const handleDropdownClose = useCallback((itemId: string) => {
    switch (itemId) {
      case 'ordre':      setOrdreDropdownOpen(false);      break;
      case 'membres':    setMembresDropdownOpen(false);    break;
      case 'pratique':   setPratiqueDropdownOpen(false);   break;
      case 'ressources': setRessourcesDropdownOpen(false); break;
    }
  }, []);

  const getDropdownState = useCallback((itemId: string) => {
    switch (itemId) {
      case 'ordre':      return ordreDropdownOpen;
      case 'membres':    return membresDropdownOpen;
      case 'pratique':   return pratiqueDropdownOpen;
      case 'ressources': return ressourcesDropdownOpen;
      default:           return false;
    }
  }, [ordreDropdownOpen, membresDropdownOpen, pratiqueDropdownOpen, ressourcesDropdownOpen]);

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="onpg-header">
        <div className="onpg-header-container-compact">

          {/* Logo */}
          <Link to="/" className="onpg-logo-section">
            <div className="onpg-logo-wrapper">
              {!logoError ? (
                <img
                  src={ONPG_IMAGES.logo}
                  alt="ONPG Logo"
                  className="onpg-logo-img"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="onpg-logo-fallback">ONPG</span>
              )}
            </div>
            <div className="onpg-logo-text">
              <span className="logo-title">
                <span className="logo-highlight">Ordre National</span>
                <br />
                <span className="logo-main">des Pharmaciens</span>
              </span>
              <span className="logo-subtitle">
                <svg className="gabon-flag-svg" width="22" height="15" viewBox="0 0 22 15" aria-hidden="true" role="img">
                  <rect x="0" y="0"    width="22" height="5"  fill="#009E49" />
                  <rect x="0" y="5"    width="22" height="5"  fill="#FCD116" />
                  <rect x="0" y="10"   width="22" height="5"  fill="#003189" />
                </svg>
                République Gabonaise
              </span>
            </div>
          </Link>

          {/* Section droite */}
          <div className="header-right-section">
            <p className="header-tagline">Excellence · Éthique · Service</p>
            <Link to="/admin" className="header-member-btn">
              {/* Icône utilisateur */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Espace Membre</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="onpg-navbar" ref={navbarRef}>
        <div className="onpg-navbar-container">

          {/* Barre de progression scroll */}
          <div className="nav-progress-indicator" aria-hidden="true">
            <div className="progress-bar" />
          </div>

          {/* Brand visible uniquement sur mobile dans la barre sticky */}
          <div className="mobile-navbar-brand" aria-hidden="true">
            <div className="mobile-brand-logo-wrap">
              {!logoError ? (
                <img src={ONPG_IMAGES.logo} alt="" className="mobile-brand-logo-img" />
              ) : (
                <span className="mobile-brand-logo-fallback">ONPG</span>
              )}
            </div>
            <div className="mobile-brand-text">
              <span className="mobile-brand-name">Ordre des Pharmaciens</span>
              <span className="mobile-brand-country">🇬🇦 République Gabonaise</span>
            </div>
          </div>

          {/* Toggle mobile */}
          <button
            className="onpg-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="onpg-mobile-nav"
          >
            <div className="hamburger-icon" aria-hidden="true">
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            </div>
          </button>

          {/* Overlay */}
          {mobileMenuOpen && (
            <div
              ref={overlayRef}
              className="mobile-menu-overlay"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Menu */}
          <ul ref={menuRef} id="onpg-mobile-nav" className={`onpg-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>

            {/* ── En-tête du drawer (mobile uniquement) ── */}
            <li className="mobile-drawer-header" aria-hidden="true">
              <div className="mobile-drawer-logo-area">
                <div className="mobile-drawer-logo-box">
                  {!logoError ? (
                    <img src={ONPG_IMAGES.logo} alt="ONPG" className="mobile-drawer-logo-img" />
                  ) : (
                    <span className="mobile-drawer-logo-fallback">ONPG</span>
                  )}
                </div>
                <div className="mobile-drawer-org">
                  <span className="mobile-drawer-org-name">Ordre National des Pharmaciens</span>
                  <span className="mobile-drawer-org-country">🇬🇦 République Gabonaise</span>
                </div>
              </div>
              <button
                ref={closebtnRef}
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </li>

            {/* ── Items de navigation ── */}
            {navItems.map((item, navIndex) => {
              const isActive     = activeItems.has(item.id);
              const dropdownOpen = getDropdownState(item.id);

              return (
                <li
                  key={item.path}
                  className={`onpg-nav-item ${item.isButton ? 'nav-button' : ''} ${isActive ? 'active' : ''}`}
                  style={{ '--nav-index': navIndex } as React.CSSProperties}
                  onMouseEnter={item.hasDropdown ? () => handleDropdownOpen(item.id) : undefined}
                  onMouseLeave={item.hasDropdown ? (e) => {
                    const t = e.relatedTarget as HTMLElement | null;
                    if (t instanceof Element && t.closest('.onpg-dropdown')) return;
                    handleDropdownClose(item.id);
                  } : undefined}
                >
                  <Link
                    to={item.path}
                    className="onpg-nav-link"
                    onClick={(e) => {
                      if (window.innerWidth <= 768 && item.hasDropdown) {
                        e.preventDefault();
                        handleDropdownToggle(item.id, dropdownOpen);
                      } else if (!item.hasDropdown) {
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    <span className="nav-text">
                      {item.isButton ? (
                        <span className="nav-button-text">
                          <span className="pharmacy-cross">✚</span>
                          <span className="nav-button-label">Trouver une pharmacie</span>
                        </span>
                      ) : (
                        <span className="nav-label">{item.label}</span>
                      )}
                    </span>

                    {/* Flèche chevron (desktop + mobile) */}
                    {item.hasDropdown && (
                      <div className="nav-arrow-wrapper">
                        <svg
                          width="11" height="11"
                          viewBox="0 0 24 24" fill="none"
                          className={`nav-chevron ${dropdownOpen ? 'open' : ''}`}
                        >
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.hasDropdown && item.dropdown && (
                    <ul
                      className={`onpg-dropdown ${item.id}-dropdown ${dropdownOpen ? 'open' : ''}`}
                      onMouseEnter={() => handleDropdownOpen(item.id)}
                      onMouseLeave={(e) => {
                        const t = e.relatedTarget as HTMLElement | null;
                        if (t instanceof Element && t.closest('li')) return;
                        handleDropdownClose(item.id);
                      }}
                    >
                      {/* En-tête de catégorie */}
                      <li className="dropdown-category-header">
                        <span className="dropdown-category-label">{item.label}</span>
                      </li>

                      {/* Items */}
                      {item.dropdown.map((subItem: NavDropdownItem, subIndex: number) => {
                        // Séparateur de section
                        if (subItem.divider) {
                          return (
                            <li key={`divider-${subItem.label}`} className="dropdown-section-divider">
                              <span className="dropdown-section-label">{subItem.label}</span>
                            </li>
                          );
                        }
                        // Lien mis en avant (Centre documentaire)
                        if (subItem.featured) {
                          return (
                            <li key={subItem.path} className="dropdown-item-li dropdown-item-featured" style={{ '--item-index': subIndex } as React.CSSProperties}>
                              <Link
                                to={subItem.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="dropdown-link dropdown-link--featured"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                <span className="dropdown-text">{subItem.label}</span>
                                <svg className="dropdown-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </Link>
                            </li>
                          );
                        }
                        // Lien normal
                        return (
                          <li key={subItem.path} className="dropdown-item-li" style={{ '--item-index': subIndex } as React.CSSProperties}>
                            <Link
                              to={subItem.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="dropdown-link"
                            >
                              <span className="dropdown-item-dot" aria-hidden="true" />
                              <span className="dropdown-text">{subItem.label}</span>
                              <svg className="dropdown-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}

            {/* ── Footer du drawer (mobile uniquement) ── */}
            <li className="mobile-drawer-footer" aria-hidden="true">
              <Link
                to="/admin"
                className="mobile-drawer-member-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 20c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Espace Membre</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mobile-member-arrow">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </li>

          </ul>
        </div>
      </nav>
    </>
  );
};

export default memo(NavbarONPG);
