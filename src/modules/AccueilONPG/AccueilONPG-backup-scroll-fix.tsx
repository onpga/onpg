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
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Une fois visible, on peut arrêter d'observer pour optimiser
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observer toutes les sections avec data-animate
    const sections = document.querySelectorAll('.section[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Données pour les missions
  const missions = [
    {
      icon: '🏥',
      title: 'Protection de la Santé Publique',
      description: 'Garantir la qualité et la sécurité des médicaments au Gabon',
      color: '#00A651',
      link: '/missions/sante-publique'
    },
    {
      icon: '👥',
      title: 'Défense des Pharmaciens',
      description: 'Représenter et défendre les intérêts professionnels',
      color: '#008F45',
      link: '/missions/defense-professionnelle'
    },
    {
      icon: '🎓',
      title: 'Formation Continue',
      description: 'Assurer le développement des compétences',
      color: '#2ECC71',
      link: '/missions/formation'
    },
    {
      icon: '⚖️',
      title: 'Régulation Éthique',
      description: 'Contrôler et réguler l\'exercice professionnel',
      color: '#27AE60',
      link: '/missions/reglementation'
    }
  ];

  // Composant pour les cartes de mission
  const MissionCard = ({ mission, index }: { mission: typeof missions[0], index: number }) => (
    <Link
      to={mission.link}
      className="mission-card section"
      data-animate
      style={{
        '--mission-color': mission.color,
        animationDelay: `${index * 0.2}s`
      } as React.CSSProperties}
    >
      <div className="mission-icon" style={{ backgroundColor: mission.color }}>
        <span className="icon-emoji">{mission.icon}</span>
        <div className="icon-glow"></div>
      </div>
      <h3>{mission.title}</h3>
      <p>{mission.description}</p>
      <span className="mission-cta">En savoir plus →</span>
    </Link>
  );

  return (
    <div className="accueil-onpg">
      {/* Hero Section */}
      <HeroONPG />

      {/* Section de transition - Nos Engagements Institutionnels */}
      <section className="nos-engagements-transition section" data-animate style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Header élégant */}
          <div className="engagements-header" style={{
            textAlign: 'center',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #00A651, #008F45)',
              borderRadius: '2px',
              margin: '0 auto 1.5rem',
              boxShadow: '0 2px 8px rgba(0, 166, 81, 0.3)'
            }}></div>

            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1a252f',
              margin: '0 0 1rem',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
              lineHeight: '1.1'
            }}>
              Nos Engagements Institutionnels
            </h2>

            <p style={{
              fontSize: '1.2rem',
              color: '#6c757d',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              Au service de la santé publique et de la profession pharmaceutique gabonaise
            </p>
          </div>

          {/* Grille des 4 engagements */}
          <div className="engagements-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Engagement 1 - Qualité et Sécurité */}
            <div className="engagement-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 166, 81, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div className="engagement-icon" style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #00A651, #008F45)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 25px rgba(0, 166, 81, 0.3)',
                position: 'relative'
              }}>
                🔬
                <div style={{
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00A651, #008F45)',
                  opacity: '0.3',
                  zIndex: '-1'
                }}></div>
              </div>

              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a252f',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Qualité & Sécurité
              </h3>

              <p style={{
                color: '#6c757d',
                lineHeight: '1.6',
                fontSize: '1rem',
                margin: '0'
              }}>
                Garantir l'excellence des médicaments et la sécurité des soins
                à travers une régulation stricte et des contrôles permanents.
              </p>
            </div>

            {/* Engagement 2 - Protection Professionnelle */}
            <div className="engagement-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 166, 81, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div className="engagement-icon" style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #008F45, #00A651)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 25px rgba(0, 143, 69, 0.3)',
                position: 'relative'
              }}>
                👥
                <div style={{
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #008F45, #00A651)',
                  opacity: '0.3',
                  zIndex: '-1'
                }}></div>
              </div>

              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a252f',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Protection Professionnelle
              </h3>

              <p style={{
                color: '#6c757d',
                lineHeight: '1.6',
                fontSize: '1rem',
                margin: '0'
              }}>
                Défendre les intérêts des pharmaciens et promouvoir l'excellence
                professionnelle à travers une représentation forte et unie.
              </p>
            </div>

            {/* Engagement 3 - Formation Continue */}
            <div className="engagement-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 166, 81, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div className="engagement-icon" style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #2ECC71, #00A651)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)',
                position: 'relative'
              }}>
                🎓
                <div style={{
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2ECC71, #00A651)',
                  opacity: '0.3',
                  zIndex: '-1'
                }}></div>
              </div>

              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a252f',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Formation Continue
              </h3>

              <p style={{
                color: '#6c757d',
                lineHeight: '1.6',
                fontSize: '1rem',
                margin: '0'
              }}>
                Assurer le développement des compétences et l'adaptation permanente
                aux évolutions scientifiques et réglementaires du secteur.
              </p>
            </div>

            {/* Engagement 4 - Santé Publique */}
            <div className="engagement-card" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '2px solid transparent',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(0, 166, 81, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}>
              <div className="engagement-icon" style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #27AE60, #008F45)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 25px rgba(39, 174, 96, 0.3)',
                position: 'relative'
              }}>
                🌍
                <div style={{
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #27AE60, #008F45)',
                  opacity: '0.3',
                  zIndex: '-1'
                }}></div>
              </div>

              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#1a252f',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                Santé Publique
              </h3>

              <p style={{
                color: '#6c757d',
                lineHeight: '1.6',
                fontSize: '1rem',
                margin: '0'
              }}>
                Contribuer activement à l'amélioration de la santé de la population
                gabonaise et à l'accès équitable aux soins de qualité.
              </p>
            </div>
          </div>

          {/* Pattern décoratif subtil */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '5%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 166, 81, 0.05) 0%, transparent 70%)',
            zIndex: '-1'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 143, 69, 0.05) 0%, transparent 70%)',
            zIndex: '-1'
          }}></div>
        </div>
      </section>

      {/* TITRE FIXE - NON ANIME */}
      <div style={{
        position: 'relative',
        zIndex: 1000,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 50%, #ffffff 100%)',
        padding: '2.5rem 0',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 166, 81, 0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0, 166, 81, 0.06)',
        marginBottom: '1rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 3rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              flex: 1,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #00A651 20%, #008F45 50%, #00A651 80%, transparent)',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0, 166, 81, 0.3)',
              opacity: 0.8
            }}></div>
            <h2 style={{
              fontSize: '3.2rem',
              fontWeight: 700,
              color: '#1a252f',
              margin: 0,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
              lineHeight: '1.1',
              background: 'none',
              WebkitTextFillColor: '#1a252f',
              textAlign: 'center',
              fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              textTransform: 'none',
              borderBottom: 'none',
              transition: 'all 0.3s ease'
            }}>
              Message du Président
            </h2>
            <div style={{
              flex: 1,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #00A651 20%, #008F45 50%, #00A651 80%, transparent)',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0, 166, 81, 0.3)',
              opacity: 0.8
            }}></div>
          </div>
        </div>
      </div>

      {/* Message du Président - Nouveau Design Professionnel avec Bloc Interactif */}
      <section className="onpg-president-message section" data-animate>
        <div className="container">
          <AnimatedSection animation="fadeIn">
            <div className="president-professional-section" style={{marginTop: '2rem'}}>


              {/* Layout Principal - Nouveau Design */}
              <div className="president-main-professional-new">

                {/* Section Photo - Style Institutionnel (Gauche) */}
                <div className="president-photo-professional">
                  <div className="photo-professional-frame">
                    <div className="photo-professional-border"></div>
                    <img
                      src={ONPG_IMAGES.president}
                      alt="Président ONPG"
                      className="president-photo-professional"
                    />

                    {/* Badge Institutionnel */}
                    <div className="president-badge-professional">
                      <div className="badge-professional-content">
                        <span className="badge-professional-title">PRÉSIDENT</span>
                        <div className="badge-professional-accent"></div>
                        <span className="badge-professional-org">Ordre National</span>
                      </div>
                    </div>

                    {/* Informations Institutionnelles */}
                    <div className="president-info-professional">
                      <h3 className="president-name-professional">Dr. [Nom du Président]</h3>
                      <p className="president-position-professional">
                        Président de l'Ordre National<br />
                        de Pharmacie du Gabon
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bloc Interactif à Droite - Design Pro avec Changement de Contenu */}
                <PresidentContentBlock />

              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission Card Component */}
      <section className="missions-section section" data-animate>
        <div className="container">
          <div className="missions-header">
            <h2>Nos Missions</h2>
            <p>Engagés pour l'excellence de la santé publique</p>
          </div>

          <div className="missions-grid">
            {missions.map((mission, index) => (
              <MissionCard key={mission.title} mission={mission} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Actualites & Communiqués */}
      <section className="news-section section" data-animate>
        <div className="container">
          <div className="news-header">
            <h2>Actualités & Communiqués</h2>
            <p>Dernières informations et annonces officielles</p>
          </div>

          <div className="news-grid">
            {/* Actualité 1 */}
            <div className="news-card">
              <div className="news-image">
                <img src={ONPG_IMAGES.hero1} alt="Actualité 1" />
                <div className="news-date">15 Déc 2024</div>
              </div>
              <div className="news-content">
                <h3>Nouveau décret sur la dispensation des médicaments</h3>
                <p>Publication du décret n°2024-XXX réglementant les conditions de dispensation des médicaments au Gabon.</p>
                <Link to="/actualites/decret-medicaments" className="news-link">Lire la suite →</Link>
              </div>
            </div>

            {/* Actualité 2 */}
            <div className="news-card">
              <div className="news-image">
                <img src={ONPG_IMAGES.hero2} alt="Actualité 2" />
                <div className="news-date">12 Déc 2024</div>
              </div>
              <div className="news-content">
                <h3>Formation continue obligatoire 2024</h3>
                <p>L'ONPG lance le nouveau programme de formation continue pour tous les pharmaciens inscrits.</p>
                <Link to="/actualites/formation-continue" className="news-link">Lire la suite →</Link>
              </div>
            </div>

            {/* Actualité 3 */}
            <div className="news-card">
              <div className="news-image">
                <img src={ONPG_IMAGES.hero3} alt="Actualité 3" />
                <div className="news-date">08 Déc 2024</div>
              </div>
              <div className="news-content">
                <h3>Conseil National : Session extraordinaire</h3>
                <p>Réunion extraordinaire du Conseil National pour l'examen des textes réglementaires en cours.</p>
                <Link to="/actualites/conseil-national" className="news-link">Lire la suite →</Link>
              </div>
            </div>
          </div>

          <div className="news-actions">
            <Link to="/actualites" className="btn-primary">Toutes les actualités</Link>
            <Link to="/communiques" className="btn-secondary">Communiqués officiels</Link>
          </div>
        </div>
      </section>

      {/* Formation Continue */}
      <section className="formation-section section" data-animate>
        <div className="container">
          <div className="formation-content">
            <div className="formation-text">
              <h2>Formation Continue</h2>
              <p>
                L'ONPG organise régulièrement des sessions de formation continue
                pour maintenir et développer les compétences des pharmaciens gabonais.
              </p>
              <ul className="formation-list">
                <li>✅ Formation obligatoire validée par l'ONPG</li>
                <li>✅ Experts reconnus dans leur domaine</li>
                <li>✅ Certification officielle délivrée</li>
                <li>✅ Formation en ligne et présentielle</li>
              </ul>
              <Link to="/pratique/formation-continue" className="btn-primary">Découvrir les formations</Link>
            </div>
            <div className="formation-image">
              <img src={ONPG_IMAGES.hero4} alt="Formation Continue ONPG" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta-section section" data-animate>
        <div className="container">
          <div className="contact-cta-content">
            <h2>Une question ? Contactez-nous</h2>
            <p>
              Notre équipe est à votre disposition pour répondre à toutes vos questions
              concernant la profession pharmaceutique, les démarches administratives
              ou toute autre information relative à l'ONPG.
            </p>
            <div className="contact-cta-grid">
              <div className="contact-cta-item">
                <div className="contact-cta-icon">📞</div>
                <h3>Par téléphone</h3>
                <p>+241 XX XX XX XX</p>
                <small>Lundi au vendredi, 8h-17h</small>
              </div>
              <div className="contact-cta-item">
                <div className="contact-cta-icon">✉️</div>
                <h3>Par email</h3>
                <p>contact@onpg.ga</p>
                <small>Réponse sous 24h</small>
              </div>
              <div className="contact-cta-item">
                <div className="contact-cta-icon">📍</div>
                <h3>Sur place</h3>
                <p>Libreville, Gabon</p>
                <small>Sur rendez-vous</small>
              </div>
            </div>
            <Link to="/contact" className="btn-primary-large">Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Composant pour le bloc de contenu du président
const PresidentContentBlock = () => {
  const [currentContent, setCurrentContent] = useState(0);

  const contents = [
    {
      title: "Vision 2025",
      content: "Notre vision pour l'avenir de la pharmacie gabonaise : innovation, qualité et accessibilité pour tous.",
      icon: "🔭",
      color: "#00A651"
    },
    {
      title: "Engagements",
      content: "Quatre engagements majeurs : qualité, protection professionnelle, formation et santé publique.",
      icon: "🤝",
      color: "#008F45"
    },
    {
      title: "Actions 2024",
      content: "Les grandes réalisations de l'année : nouvelles formations, contrôles qualité renforcés.",
      icon: "⚡",
      color: "#2ECC71"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % contents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [contents.length]);

  const current = contents[currentContent];

  return (
    <div className="president-interactive-block">
      <div className="interactive-header">
        <h3>Message du Président</h3>
        <div className="content-indicators">
          {contents.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentContent ? 'active' : ''}`}
              onClick={() => setCurrentContent(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentContent ? current.color : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 4px'
              }}
            />
          ))}
        </div>
      </div>

      <div className="interactive-content">
        <div className="content-icon" style={{ color: current.color, fontSize: '3rem', marginBottom: '1rem' }}>
          {current.icon}
        </div>
        <h4 style={{ color: current.color, marginBottom: '1rem', fontSize: '1.5rem' }}>
          {current.title}
        </h4>
        <p style={{ color: 'white', lineHeight: '1.6', fontSize: '1.1rem' }}>
          {current.content}
        </p>
      </div>

      <div className="interactive-actions">
        <button
          className="btn-cta"
          style={{
            background: `linear-gradient(135deg, ${current.color}, ${current.color}dd)`,
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 8px 25px ${current.color}40`,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = `0 12px 35px ${current.color}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 8px 25px ${current.color}40`;
          }}
        >
          En savoir plus →
        </button>
      </div>
    </div>
  );
};

export default AccueilONPG;
