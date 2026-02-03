// BACKUP FINAL - AccueilONPG.tsx - Créé le $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
// NE PAS MODIFIER CE FICHIER - COPIE DE SAUVEGARDE

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HeroONPG from './components/HeroONPG';
import AnimatedSection from '../../components/AnimatedSection';
import ONPG_CONFIG from '../../config/onpg-config';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './AccueilONPG.css';
import './AccueilONPG-Elegant.css';

const AccueilONPG = () => {

  // Mise à jour du canonical pour la page d'accueil ONPG
  useEffect(() => {
    document.title = ONPG_CONFIG.app.title;
  }, []);

  // Animations de révélation au scroll - Version simplifiée et plus fiable
  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    // Sélectionner tous les éléments avec la classe 'reveal'
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Navbar principale ONPG */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '2px solid #00A651',
        padding: '0',
        boxShadow: '0 2px 20px rgba(0, 166, 81, 0.15)',
        height: '70px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>

          {/* Logo ONPG */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #00A651, #008F45)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0, 166, 81, 0.3)'
            }}>
              ⚕️
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00A651', lineHeight: '1' }}>ONPG</div>
              <div style={{ fontSize: '0.7rem', color: '#6c757d', lineHeight: '1' }}>Ordre National</div>
            </div>
          </div>

          {/* Menu principal */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
            <Link to="/" style={{
              color: '#1a252f',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '1rem 1.5rem',
              borderRadius: '8px 0 0 8px',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              borderRight: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
              e.currentTarget.style.color = '#00A651';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1a252f';
            }}>
              Accueil
            </Link>

            {/* Dropdown L'Ordre */}
            <div style={{ position: 'relative', borderRight: '1px solid #e9ecef' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#1a252f',
                fontWeight: '600',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
                e.currentTarget.style.color = '#00A651';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1a252f';
              }}>
                L'Ordre ▼
              </button>
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '1rem 0',
                minWidth: '200px',
                opacity: '0',
                visibility: 'hidden',
                transform: 'translateY(-10px)',
                transition: 'all 0.3s ease',
                zIndex: '1000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.visibility = 'visible';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
                e.currentTarget.style.visibility = 'hidden';
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}>
                <Link to="/ordre/apropos" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  À propos
                </Link>
                <Link to="/ordre/instance" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Instance
                </Link>
                <Link to="/ordre/organigramme" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Organigramme
                </Link>
                <Link to="/ordre/conseil-national" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Conseil National
                </Link>
              </div>
            </div>

            {/* Dropdown Membres */}
            <div style={{ position: 'relative', borderRight: '1px solid #e9ecef' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#1a252f',
                fontWeight: '600',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
                e.currentTarget.style.color = '#00A651';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1a252f';
              }}>
                Membres ▼
              </button>
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '1rem 0',
                minWidth: '200px',
                opacity: '0',
                visibility: 'hidden',
                transform: 'translateY(-10px)',
                transition: 'all 0.3s ease',
                zIndex: '1000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.visibility = 'visible';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
                e.currentTarget.style.visibility = 'hidden';
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}>
                <Link to="/membres/tableau-ordre" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Tableau de l'Ordre
                </Link>
                <Link to="/membres/section-a" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Section A - Officinaux
                </Link>
                <Link to="/membres/section-b" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Section B - Biologistes
                </Link>
                <Link to="/membres/section-c" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Section C - Fonctionnaires
                </Link>
                <Link to="/membres/section-d" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Section D - Fabricants
                </Link>
              </div>
            </div>

            {/* Dropdown Pratique */}
            <div style={{ position: 'relative', borderRight: '1px solid #e9ecef' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#1a252f',
                fontWeight: '600',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
                e.currentTarget.style.color = '#00A651';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1a252f';
              }}>
                Pratique ▼
              </button>
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '1rem 0',
                minWidth: '200px',
                opacity: '0',
                visibility: 'hidden',
                transform: 'translateY(-10px)',
                transition: 'all 0.3s ease',
                zIndex: '1000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.visibility = 'visible';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
                e.currentTarget.style.visibility = 'hidden';
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}>
                <Link to="/pratique/formation-continue" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Formation Continue
                </Link>
                <Link to="/pratique/deontologie" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Déontologie
                </Link>
                <Link to="/pratique/pharmacies" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Pharmacies
                </Link>
                <Link to="/pratique/contact" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Contact
                </Link>
              </div>
            </div>

            {/* Dropdown Ressources */}
            <div style={{ position: 'relative' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: '#1a252f',
                fontWeight: '600',
                padding: '1rem 1.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                borderRadius: '0 8px 8px 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
                e.currentTarget.style.color = '#00A651';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1a252f';
              }}>
                Ressources ▼
              </button>
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '1rem 0',
                minWidth: '200px',
                opacity: '0',
                visibility: 'hidden',
                transform: 'translateY(-10px)',
                transition: 'all 0.3s ease',
                zIndex: '1000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.visibility = 'visible';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
                e.currentTarget.style.visibility = 'hidden';
                e.currentTarget.style.transform = 'translateY(-10px)';
              }}>
                <Link to="/ressources/actualites" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Actualités
                </Link>
                <Link to="/ressources/communiques" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Communiqués
                </Link>
                <Link to="/ressources/photos" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Photos
                </Link>
                <Link to="/ressources/videos" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Vidéos
                </Link>
                <Link to="/ressources/articles" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Articles
                </Link>
                <Link to="/ressources/theses" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Thèses
                </Link>
                <Link to="/ressources/decrets" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Décrets
                </Link>
                <Link to="/ressources/decisions" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Décisions
                </Link>
                <Link to="/ressources/commissions" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Commissions
                </Link>
                <Link to="/ressources/lois" style={{
                  display: 'block',
                  padding: '0.75rem 1.5rem',
                  color: '#1a252f',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 166, 81, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Lois
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

