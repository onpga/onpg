import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { useThrottledScroll } from '../../hooks/useThrottledScroll';
import './NavbarONPG.css';

// Déplacer navItems en constante externe pour éviter recréation
const NAV_ITEMS = [
  {
    path: '/',
    label: 'Accueil',
    icon: '🏠',
    hasDropdown: false,
    id: 'accueil'
  },
  {
    path: '/ordre',
    label: "L'Ordre",
    icon: '👥',
    hasDropdown: true,
    id: 'ordre',
    dropdown: [
      { path: '/ordre/a-propos', label: 'À propos' },
      { path: '/ordre/organigramme', label: 'Organigramme' },
      { path: '/ordre/conseil-national', label: 'Conseil National' }
    ]
  },
  {
    path: '/membres',
    label: 'Membres',
    icon: '👨‍👩‍👧‍👦',
    hasDropdown: true,
    id: 'membres',
    dropdown: [
      { path: '/membres/tableau-ordre', label: 'Tableau de l\'Ordre' },
      { path: '/membres/section-a', label: 'Section A' },
      { path: '/membres/section-b', label: 'Section B' },
      { path: '/membres/section-c', label: 'Section C' },
      { path: '/membres/section-d', label: 'Section D' }
    ]
  },
  {
    path: '/pratique',
    label: 'Pratique',
    icon: '📋',
    hasDropdown: true,
    id: 'pratique',
    dropdown: [
      { path: '/pratique/formation-continue', label: 'Formation Continue' },
      { path: '/pratique/deontologie', label: 'Déontologie' },
      { path: '/pratique/pharmacies', label: 'Pharmacies' },
      { path: '/pratique/contact', label: 'Contact' }
    ]
  },
  {
    path: '/ressources',
    label: 'Ressources',
    icon: '💬',
    hasDropdown: true,
    id: 'ressources',
    dropdown: [
      { path: '/ressources/actualites', label: 'Actualités' },
      { path: '/ressources/communiques', label: 'Communiqués' },
      { path: '/ressources/photos', label: 'Photos' },
      { path: '/ressources/videos', label: 'Vidéos' },
      { path: '/ressources/articles', label: 'Articles' },
      { path: '/ressources/theses', label: 'Thèses' },
      { path: '/ressources/decrets', label: 'Décrets' },
      { path: '/ressources/decisions', label: 'Décisions' },
      { path: '/ressources/commissions', label: 'Commissions' },
      { path: '/ressources/lois', label: 'Lois' }
    ]
  },
  {
    path: '/pratique/pharmacies',
    label: 'Trouver une pharmacie',
    icon: '',
    isButton: true,
    hasPlus: true,
    id: 'pharmacies'
  },
  {
    path: '/espace',
    label: 'Espace',
    icon: '🩹',
    hasDropdown: false,
    id: 'espace'
  }
] as const;

/**
 * Navbar ONPG - Inspirée du site officiel
 * Header blanc avec logo + recherche
 * Navigation bar vert menthe avec icônes
 */
const NavbarONPG = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  // Empêcher le menu de navigation (barre verte) de se cacher lors du scroll
  // Optimisé avec useRef au lieu de querySelector
  const handleNavbarScroll = useCallback(() => {
    if (navbarRef.current) {
      navbarRef.current.style.position = 'sticky';
      navbarRef.current.style.top = '0';
      navbarRef.current.style.zIndex = '999';
      navbarRef.current.style.visibility = 'visible';
      navbarRef.current.style.opacity = '1';
    }
  }, []);

  // Appliquer immédiatement au montage
  useEffect(() => {
    handleNavbarScroll();
  }, [handleNavbarScroll]);

  // Utiliser le hook optimisé pour le scroll
  useThrottledScroll(handleNavbarScroll, 100, []);

  // Fermer le menu au clic extérieur et bloquer le scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      // Bloquer le scroll du body
      document.body.style.overflow = 'hidden';
      
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (
          menuRef.current &&
          !menuRef.current.contains(target) &&
          overlayRef.current &&
          overlayRef.current.contains(target) &&
          !target.closest('.onpg-mobile-toggle')
        ) {
          setMobileMenuOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const [ordreDropdownOpen, setOrdreDropdownOpen] = useState(false);
  const [membresDropdownOpen, setMembresDropdownOpen] = useState(false);
  const [pratiqueDropdownOpen, setPratiqueDropdownOpen] = useState(false);
  const [ressourcesDropdownOpen, setRessourcesDropdownOpen] = useState(false);

  // Mémoïser navItems pour éviter recréation
  const navItems = useMemo(() => NAV_ITEMS, []);

  // Mémoïser le calcul isActive pour chaque item
  const activeItems = useMemo(() => {
    const currentPath = location.pathname;
    return new Set(
      navItems
        .filter(item => {
          if (item.path === '/') {
            return currentPath === '/';
          }
          return currentPath === item.path || currentPath.startsWith(item.path + '/');
        })
        .map(item => item.id)
    );
  }, [location.pathname, navItems]);

  // Ouvrir tous les dropdowns en mobile quand le menu s'ouvre
  useEffect(() => {
    if (mobileMenuOpen && window.innerWidth <= 768) {
      setOrdreDropdownOpen(true);
      setMembresDropdownOpen(true);
      setPratiqueDropdownOpen(true);
      setRessourcesDropdownOpen(true);
    } else if (!mobileMenuOpen) {
      // Fermer tous les dropdowns quand le menu se ferme
      setOrdreDropdownOpen(false);
      setMembresDropdownOpen(false);
      setPratiqueDropdownOpen(false);
      setRessourcesDropdownOpen(false);
    }
  }, [mobileMenuOpen]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la recherche
  }, []);

  // Optimiser les handlers de dropdown avec useCallback
  const handleDropdownToggle = useCallback((itemId: string, currentState: boolean) => {
    switch (itemId) {
      case 'ordre':
        setOrdreDropdownOpen(!currentState);
        break;
      case 'membres':
        setMembresDropdownOpen(!currentState);
        break;
      case 'pratique':
        setPratiqueDropdownOpen(!currentState);
        break;
      case 'ressources':
        setRessourcesDropdownOpen(!currentState);
        break;
    }
  }, []);

  const handleDropdownOpen = useCallback((itemId: string) => {
    switch (itemId) {
      case 'ordre':
        setOrdreDropdownOpen(true);
        break;
      case 'membres':
        setMembresDropdownOpen(true);
        break;
      case 'pratique':
        setPratiqueDropdownOpen(true);
        break;
      case 'ressources':
        setRessourcesDropdownOpen(true);
        break;
    }
  }, []);

  const handleDropdownClose = useCallback((itemId: string) => {
    switch (itemId) {
      case 'ordre':
        setOrdreDropdownOpen(false);
        break;
      case 'membres':
        setMembresDropdownOpen(false);
        break;
      case 'pratique':
        setPratiqueDropdownOpen(false);
        break;
      case 'ressources':
        setRessourcesDropdownOpen(false);
        break;
    }
  }, []);

  // Helper pour obtenir l'état d'un dropdown
  const getDropdownState = useCallback((itemId: string) => {
    switch (itemId) {
      case 'ordre':
        return ordreDropdownOpen;
      case 'membres':
        return membresDropdownOpen;
      case 'pratique':
        return pratiqueDropdownOpen;
      case 'ressources':
        return ressourcesDropdownOpen;
      default:
        return false;
    }
  }, [ordreDropdownOpen, membresDropdownOpen, pratiqueDropdownOpen, ressourcesDropdownOpen]);

  return (
    <>
      {/* Header moderne et épuré */}
      <header className="onpg-header">
        <div className="onpg-header-container-compact">
          {/* Logo avec effets premium */}
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
                <span className="flag-emoji">🇬🇦</span>
                République Gabonaise
              </span>
            </div>
          </Link>

          {/* Barre de recherche élégante avec icônes */}
          <div className="header-actions">
            <form className="onpg-search-form" onSubmit={handleSearch}>
              <div className="search-container">
                <div className="search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  className="onpg-search-input"
                  placeholder="Rechercher des informations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="onpg-search-button" aria-label="Rechercher">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>

            {/* Boutons d'actions élégants */}
            <div className="header-buttons">
              <button className="action-btn notification-btn" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 006 8C6 14 3 16 3 16H21S18 14 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9043 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9043 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="notification-dot"></span>
              </button>

              <button className="action-btn user-btn" aria-label="Mon compte">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Ligne décorative élégante */}
        <div className="header-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="decoration-line"></div>
        </div>
      </header>

      {/* Navigation bar optimisée sans scrolls */}
      <nav className="onpg-navbar" ref={navbarRef}>
        <div className="onpg-navbar-container">
          {/* Bouton mobile amélioré */}
          <button
            className="onpg-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <div className="hamburger-icon">
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            </div>
          </button>

          {/* Indicateur de progression subtil */}
          <div className="nav-progress-indicator">
            <div className="progress-bar"></div>
          </div>

          {/* Overlay pour fermer le menu */}
          {mobileMenuOpen && (
            <div
              ref={overlayRef}
              className="mobile-menu-overlay"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          <ul 
            ref={menuRef}
            className={`onpg-nav-menu ${mobileMenuOpen ? 'open' : ''}`}
          >
            {navItems.map((item) => {
              // Utiliser le Set mémoïsé pour vérifier isActive
              const isActive = activeItems.has(item.id);
              const dropdownOpen = getDropdownState(item.id);
              
              return (
                <li
                  key={item.path}
                  className={`onpg-nav-item ${item.isButton ? 'nav-button' : ''} ${isActive ? 'active' : ''}`}
                  onMouseEnter={item.hasDropdown ? () => handleDropdownOpen(item.id) : undefined}
                  onMouseLeave={item.hasDropdown ? (e) => {
                    const relatedTarget = e.relatedTarget as HTMLElement | null;
                    if (relatedTarget && relatedTarget instanceof Element) {
                      if (relatedTarget.closest('.onpg-dropdown')) {
                        return;
                      }
                    }
                    handleDropdownClose(item.id);
                  } : undefined}
                >
                  <Link
                    to={item.path}
                    className="onpg-nav-link"
                    onClick={(e) => {
                      // En mobile seulement : empêcher la navigation et toggle le dropdown
                      if (window.innerWidth <= 768 && item.hasDropdown) {
                        e.preventDefault();
                        handleDropdownToggle(item.id, dropdownOpen);
                      } else if (!item.hasDropdown) {
                        // Fermer le menu mobile seulement pour les liens sans dropdown
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    {/* Icône moderne avec fond animé */}
                    {item.icon && (
                      <div className="nav-icon-wrapper">
                        <span className="nav-icon-bg"></span>
                        <span className="nav-icon">{item.icon}</span>
                      </div>
                    )}

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

                    {/* Flèche avec animation */}
                    {item.hasDropdown && (
                      <div className="nav-arrow-wrapper">
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`nav-arrow mobile-only ${dropdownOpen ? 'open' : ''}`}
                        >
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    {/* Indicateur actif subtil */}
                    {isActive && (
                      <div className="nav-active-indicator">
                        <div className="active-dot"></div>
                      </div>
                    )}
                  </Link>
                  
                  {item.hasDropdown && item.dropdown && (
                    <ul 
                      className={`onpg-dropdown ${item.id}-dropdown ${dropdownOpen ? 'open' : ''}`}
                      onMouseEnter={() => handleDropdownOpen(item.id)}
                      onMouseLeave={(e) => {
                        const relatedTarget = e.relatedTarget as HTMLElement | null;
                        if (relatedTarget && relatedTarget instanceof Element) {
                          if (relatedTarget.closest('li')) {
                            return;
                          }
                        }
                        handleDropdownClose(item.id);
                      }}
                    >
                      {item.dropdown.map((subItem, subIndex) => (
                        <li key={subItem.path} style={{ animationDelay: `${subIndex * 0.05}s` }}>
                          <Link
                            to={subItem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="dropdown-link"
                          >
                            {/* Design minimaliste - texte unique */}
                            <div className="dropdown-content">
                              <span className="dropdown-text">{subItem.label}</span>
                              <div className="dropdown-arrow-wrapper">
                                <svg className="dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>

                            {/* Ligne décorative subtile */}
                            <div className="dropdown-line"></div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

// Mémoïser le composant pour éviter re-renders inutiles
export default memo(NavbarONPG);