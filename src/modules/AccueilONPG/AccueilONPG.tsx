import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Données des actualités pour le carousel
const NEWS_DATA = [
  {
    id: 1,
    image: 'hero1',
    title: 'Nouveau décret sur la dispensation des médicaments',
    excerpt: 'Publication du décret n°2024-XXX réglementant les conditions de dispensation des médicaments au Gabon.',
    date: { day: '15', month: 'Déc' },
    category: 'RÉGLEMENTATION',
    categoryClass: '',
    author: 'ONPG',
    readTime: '3 min',
    link: '/actualites/decret-medicaments'
  },
  {
    id: 2,
    image: 'hero2',
    title: 'Formation continue obligatoire 2024',
    excerpt: 'L\'ONPG lance le nouveau programme de formation continue pour tous les pharmaciens inscrits.',
    date: { day: '12', month: 'Déc' },
    category: 'FORMATION',
    categoryClass: 'category-formation',
    author: 'Service Formation',
    readTime: '2 min',
    link: '/actualites/formation-continue'
  },
  {
    id: 3,
    image: 'hero3',
    title: 'Conseil National : Session extraordinaire',
    excerpt: 'Réunion extraordinaire du Conseil National pour l\'examen des textes réglementaires en cours.',
    date: { day: '08', month: 'Déc' },
    category: 'CONSEIL',
    categoryClass: 'category-conseil',
    author: 'Secrétariat Général',
    readTime: '4 min',
    link: '/actualites/conseil-national'
  },
  {
    id: 4,
    image: 'hero4',
    title: 'Programme de formation 2025',
    excerpt: 'Découvrez le nouveau programme de formation continue obligatoire pour tous les pharmaciens.',
    date: { day: '05', month: 'Déc' },
    category: 'FORMATION',
    categoryClass: 'category-formation',
    author: 'Direction Formation',
    readTime: '3 min',
    link: '/actualites/formation-2025'
  },
  {
    id: 5,
    image: 'hero5',
    title: 'Nouvelles normes de stockage',
    excerpt: 'Mise à jour des normes de stockage et conservation des médicaments.',
    date: { day: '02', month: 'Déc' },
    category: 'RÉGLEMENTATION',
    categoryClass: '',
    author: 'Commission Qualité',
    readTime: '5 min',
    link: '/actualites/normes-stockage'
  },
  {
    id: 6,
    image: 'hero1',
    title: 'Journée Portes Ouvertes',
    excerpt: 'L\'ONPG organise une journée portes ouvertes pour présenter ses missions.',
    date: { day: '28', month: 'Nov' },
    category: 'ÉVÉNEMENT',
    categoryClass: 'category-evenement',
    author: 'Communication',
    readTime: '2 min',
    link: '/actualites/journee-portes-ouvertes'
  }
];
import HeroONPG from './components/HeroONPG';
import AnimatedSection from '../../components/AnimatedSection';
import ONPG_CONFIG from '../../config/onpg-config';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './AccueilONPG.css';
import './AccueilONPG-Elegant.css';

const AccueilONPG = () => {
  // État pour le carousel avec 3 blocs et défilement subtil
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Mise à jour du canonical pour la page d'accueil ONPG
  useEffect(() => {
    document.title = ONPG_CONFIG.app.title;
  }, []);

  // Auto-défilement naturel avec séquence logique
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        // Durée totale de l'animation séquentielle
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % NEWS_DATA.length);
          setIsAnimating(false);
        }, 1000); // Animation complète en 1 seconde
      }
    }, 7000); // Changement toutes les 7 secondes pour rythme naturel

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Calculer les actualités visibles (3 ou 4 selon l'animation)
  const getVisibleNews = () => {
    const result = [];
    // Toujours 3 cartes de base
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % NEWS_DATA.length;
      result.push(NEWS_DATA[index]);
    }

    // Pendant l'animation, ajouter la 4ème carte qui arrive
    if (isAnimating) {
      const nextIndex = (currentIndex + 3) % NEWS_DATA.length;
      result.push(NEWS_DATA[nextIndex]);
    }

    return result;
  };

  const visibleNews = getVisibleNews();

  // Pause élégante au survol
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isHovered) {
      // Pause immédiate
      setIsAnimating(true);
    } else {
      // Reprise douce après un délai naturel
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Délai pour éviter les interruptions intempestives
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isHovered]);

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

  // Composant pour les cartes de mission (version originale conservée)
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
      <section className="nos-engagements-transition section" data-animate>
        <div className="container engagements-container">
          {/* Header élégant */}
          <div className="engagements-header">
            <div className="engagements-header-accent"></div>
            <h2 className="engagements-title">Nos Engagements Institutionnels</h2>
            <p className="engagements-subtitle">
              Au service de la santé publique et de la profession pharmaceutique gabonaise
            </p>
          </div>

          {/* Grille des 4 engagements */}
          <div className="engagements-grid">
            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">🔬</div>
              <h3 className="engagement-card-title">Qualité &amp; Sécurité</h3>
              <p className="engagement-card-text">
                Garantir l'excellence des médicaments et la sécurité des soins
                à travers une régulation stricte et des contrôles permanents.
              </p>
            </div>

            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">👥</div>
              <h3 className="engagement-card-title">Protection Professionnelle</h3>
              <p className="engagement-card-text">
                Défendre les intérêts des pharmaciens et promouvoir l'excellence
                professionnelle à travers une représentation forte et unie.
              </p>
            </div>

            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">🎓</div>
              <h3 className="engagement-card-title">Formation Continue</h3>
              <p className="engagement-card-text">
                Assurer le développement des compétences et l'adaptation permanente
                aux évolutions scientifiques et réglementaires du secteur.
              </p>
            </div>

            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">🌍</div>
              <h3 className="engagement-card-title">Santé Publique</h3>
              <p className="engagement-card-text">
                Contribuer activement à l'amélioration de la santé de la population
                gabonaise et à l'accès équitable aux soins de qualité.
              </p>
            </div>
          </div>

          <div className="engagements-bg" aria-hidden="true">
            <div className="engagements-bg-shape shape-1"></div>
            <div className="engagements-bg-shape shape-2"></div>
          </div>
        </div>
      </section>

      {/* TITRE FIXE - NON ANIME */}
      <div className="president-titleband">
        <div className="container president-titleband-container">
          <div className="president-titleband-inner">
            <div className="president-titleband-rule" aria-hidden="true"></div>
            <h2 className="president-titleband-title">Message du Président</h2>
            <div className="president-titleband-rule" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      {/* Message du Président - Nouveau Design Professionnel avec Bloc Interactif */}
      <section className="onpg-president-message section" data-animate>
        <div className="container">
          <AnimatedSection animation="fadeIn">
            <div className="president-professional-section president-professional-section--spaced">


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

      {/* Mission Card Component - Design Simple et Cohérent */}
      <section className="onpg-missions missions-section section" data-animate>
        <div className="container">
          {/* Header simple et professionnel */}
            <div className="missions-header">
              <h2>Nos Missions</h2>
            <p>Engagés pour l'excellence de la santé publique</p>
            </div>

          {/* Grille des missions compacte */}
          <div className="missions-grid">
            {missions.map((mission, index) => (
              <MissionCard key={mission.title} mission={mission} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Actualites - 3 articles simples sans hero */}
      <section className="onpg-news news-section section" data-animate>
        <div className="container">
          {/* Header simple */}
          <div className="news-header-professional">
            <div className="news-header-accent"></div>
            <h2 className="news-title-professional">Actualités</h2>
            <p className="news-subtitle-professional">
              Restez informés des dernières actualités de l'ONPG
            </p>
          </div>

          {/* Grille avec seulement 3 articles */}
          <div className="news-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="news-card">
                <div className="news-image">
                  <img src={ONPG_IMAGES.president} alt={`Actualité ${i}`} />
                  <div className="news-image-overlay"></div>
                  <div className="news-date">
                    <span className="date-day">{15 + i}</span>
                    <span className="date-month">Déc</span>
                  </div>
                  <div className="news-category" style={{ backgroundColor: '#27ae60' }}>
                    <span className="category-text">Actualités</span>
                  </div>
                </div>
                <div className="news-content">
                  <h3 className="news-title">Actualité importante #{i}</h3>
                  <p className="news-excerpt">Découvrez les dernières nouvelles et informations importantes de l'ONPG...</p>
                  <div className="news-meta">
                    <span className="meta-author">ONPG</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-read-time">{3 + i} min</span>
                  </div>
                  <Link to={`/ressources/actualites`} className="news-link">
                    <span className="link-text">Lire l'article</span>
                    <span className="link-arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton voir toutes les actualités */}
          <div className="news-actions">
            <Link to="/ressources/actualites" className="btn btn-primary">
              <span>📰</span>
              <span>Voir toutes les actualités</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Formation Continue - ULTRA-COMPACT WOW */}
      <section className="onpg-formation formation-ultra-compact section" data-animate>
        <div className="container">
          {/* Header ultra-compact */}
          <div className="formation-header-ultra">
            <div className="formation-badge-ultra">
              <span className="badge-icon-ultra">🎓</span>
              <span className="badge-text-ultra">FORMATION CONTINUE</span>
            </div>
            <h2 className="formation-title-ultra">Excellence & Innovation</h2>
          </div>

          {/* Layout horizontal ultra-compact */}
          <div className="formation-content-ultra">
            {/* Section gauche - Tout le contenu textuel */}
            <div className="formation-left-ultra">
              <p className="formation-desc-ultra">
                Développez vos compétences avec les meilleurs experts pharmaceutiques.
                Formations certifiées et adaptées à vos besoins.
              </p>

              {/* Avantages en grille compacte 2x2 */}
              <div className="formation-benefits-ultra">
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra">🎯</span>
                  <span className="benefit-text-ultra">Certifiée</span>
                </div>
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra">👨‍🏫</span>
                  <span className="benefit-text-ultra">Experts</span>
                </div>
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra">💻</span>
                  <span className="benefit-text-ultra">Hybride</span>
                </div>
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra">🏆</span>
                  <span className="benefit-text-ultra">Qualité</span>
                </div>
              </div>

              {/* Stats en ligne ultra-compacts */}
              <div className="formation-stats-ultra">
                <div className="stat-ultra">
                  <span className="stat-number-ultra">500+</span>
                  <span className="stat-label-ultra">formés</span>
                </div>
                <div className="stat-ultra">
                  <span className="stat-number-ultra">98%</span>
                  <span className="stat-label-ultra">satisfaits</span>
                </div>
                <div className="stat-ultra">
                  <span className="stat-number-ultra">50+</span>
                  <span className="stat-label-ultra">sessions/an</span>
                </div>
              </div>

              {/* CTA compact */}
              <Link to="/pratique/formation-continue" className="btn-formation-ultra">
                <span className="btn-text-ultra">Voir formations</span>
                <span className="btn-arrow-ultra">→</span>
              </Link>
            </div>

            {/* Section droite - Image impactante */}
            <div className="formation-right-ultra">
              <div className="formation-image-wrapper-ultra">
                <img
                  src={ONPG_IMAGES.hero4}
                  alt="Formation Continue ONPG"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Essayer d'abord une autre image existante
                    target.src = ONPG_IMAGES.president;
                  }}
                  onErrorCapture={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    // Si ça ne marche pas, utiliser le placeholder
                    target.src = 'https://via.placeholder.com/450x350/27ae60/ffffff?text=Formation+Continue+ONPG';
                  }}
                  loading="lazy"
                />
                <div className="formation-image-overlay-ultra"></div>

                {/* Éléments flottants discrets */}
                <div className="formation-floating-ultra">
                  <div className="floating-item-ultra">
                    <span className="floating-icon-ultra">📚</span>
                  </div>
                  <div className="floating-item-ultra delay-1">
                    <span className="floating-icon-ultra">🏆</span>
                  </div>
                  <div className="floating-item-ultra delay-2">
                    <span className="floating-icon-ultra">🌟</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA - Design MÉGA-WOW Ultra-Époustouflant */}
      <section className="onpg-contact-cta contact-cta-section-professional section" data-animate>
        <div className="container">
          <div className="contact-cta-content-professional">
            {/* Header simplifié sans badge */}
            <div className="contact-header-professional">
              <h2 className="contact-title-professional">Une question ? Contactez-nous</h2>
              <p className="contact-subtitle-professional">
                Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions
                concernant la profession pharmaceutique, les démarches administratives
                ou toute autre information relative à l'ONPG.
              </p>
            </div>

            {/* Grille de contact WOW */}
            <div className="contact-cta-grid-professional">
              <a href="tel:+24101020304" className="contact-cta-item-professional contact-link">
                <div className="contact-icon-frame-professional">
                  <div className="contact-cta-icon-professional">📞</div>
                  <div className="icon-glow-professional"></div>
                </div>
                <div className="contact-content-professional">
                  <h3 className="contact-item-title-professional">Par téléphone</h3>
                  <p className="contact-info-professional">+241 01 02 03 04</p>
                  <small className="contact-note-professional">Lundi au vendredi, 8h-17h</small>
                </div>
                <div className="contact-decoration-professional"></div>
              </a>

              <a href="mailto:contact@onpg.ga" className="contact-cta-item-professional contact-link">
                <div className="contact-icon-frame-professional">
                  <div className="contact-cta-icon-professional">✉️</div>
                  <div className="icon-glow-professional"></div>
                </div>
                <div className="contact-content-professional">
                  <h3 className="contact-item-title-professional">Par email</h3>
                  <p className="contact-info-professional">contact@onpg.ga</p>
                  <small className="contact-note-professional">Réponse sous 24h</small>
                </div>
                <div className="contact-decoration-professional"></div>
              </a>

              <a href="https://www.google.com/maps/search/?api=1&query=Libreville,Gabon" target="_blank" rel="noopener noreferrer" className="contact-cta-item-professional contact-link">
                <div className="contact-icon-frame-professional">
                  <div className="contact-cta-icon-professional">📍</div>
                  <div className="icon-glow-professional"></div>
                </div>
                <div className="contact-content-professional">
                  <h3 className="contact-item-title-professional">Sur place</h3>
                  <p className="contact-info-professional">Libreville, Gabon</p>
                  <small className="contact-note-professional">Sur rendez-vous</small>
                </div>
                <div className="contact-decoration-professional"></div>
              </a>
            </div>


              {/* CTA principal WOW */}
            <div className="contact-main-cta-professional">
              <Link to="/contact" className="btn-contact-primary-professional">
                <span className="btn-text-professional">Nous contacter</span>
                <span className="btn-arrow-professional">→</span>
                </Link>

            </div>
          </div>

          {/* Particules WOW en arrière-plan */}
          <div className="contact-particles-professional">
            <div className="contact-particle-professional particle-1"></div>
            <div className="contact-particle-professional particle-2"></div>
            <div className="contact-particle-professional particle-3"></div>
            <div className="contact-particle-professional particle-4"></div>
            <div className="contact-particle-professional particle-5"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Composant pour le bloc de contenu du président avec discours défilant
const PresidentContentBlock = () => {
  const blockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const discours = `Excellence, chers confrères et consœurs,
Mesdames et Messieurs,
Distingués invités,

En ce jour solennel, c'est avec une immense gratitude et une profonde humilité que nous acceptons la charge de présider l'Ordre National des Pharmaciens du Gabon.

Nous remercions nos pairs pour la confiance qu'ils nous ont témoignée et rendons hommage au bureau sortant pour le travail accompli. C'est en tenant compte de vos échecs et vos succès que nous allons mieux nous orienter et bâtir ensemble une nouvelle dynamique, tournée vers l'avenir.

Notre mandat se reposera sur 4 priorités :

1. UNE GOUVERNANCE RENFORCÉE
Notre institution doit être exemplaire. L'Ordre ne peut jouer pleinement son rôle qu'en s'appuyant sur une gouvernance moderne, inclusive et efficace. Notre mandat s'inscrira dans une logique de participation accrue des membres, de décisions collégiales et de proximité avec toutes les sections pharmaceutiques.

2. TRANSPARENCE ET BONNE GESTION
La confiance se construit dans la clarté. C'est pourquoi nous nous engageons à instaurer une gestion financière et administrative transparente. Un rapport annuel détaillé des activités et de l'utilisation des ressources de l'Ordre sera publié et accessible à tous les membres.

3. DIGITALISATION ET MODERNISATION
Le monde avance, et notre institution doit évoluer avec lui. La digitalisation sera au cœur de nos priorités : pré-inscription en ligne, consultation du tableau de l'Ordre, dématérialisation des documents administratifs.

4. UN ORDRE AU SERVICE DE LA POPULATION
Nous renforcerons la lutte contre les médicaments falsifiés, encouragerons la promotion de la pharmacie hospitalière et soutiendrons le développement de la recherche pharmaceutique locale.

---

Mes chers collègues,

L'avenir de notre profession dépend de notre capacité à rester unis, responsables et innovants. Je vous tends la main pour construire ensemble un Ordre moderne, intègre et respecté.

Vive l'Ordre des Pharmaciens du Gabon,

Vive la pharmacie,

Et vive le Gabon !`;

  // Détection du scroll pour démarrer l'animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Reset scroll position au début quand visible
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll quand visible
  useEffect(() => {
    if (!isVisible || !isAutoScrolling || !contentRef.current) return;

    const content = contentRef.current;
    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 0.5;
      if (scrollPos >= content.scrollHeight - content.clientHeight) {
        scrollPos = 0; // Recommencer
      }
      content.scrollTop = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, isAutoScrolling]);

  return (
    <div className="president-discourse-block" ref={blockRef}>
      <div className="discourse-header">
        <div className="discourse-header-top">
          <div className="discourse-badge">
            <span className="badge-icon">📜</span>
            Discours d'investiture
          </div>
          <button 
            className={`auto-scroll-toggle ${isAutoScrolling ? 'active' : ''}`}
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            title={isAutoScrolling ? 'Pause auto-scroll' : 'Activer auto-scroll'}
          >
            {isAutoScrolling ? '⏸️' : '▶️'}
          </button>
        </div>
        <h3 className="discourse-title">Message du Président</h3>
        <p className="discourse-subtitle">Cérémonie d'investiture du nouveau bureau</p>
      </div>
      
      <div 
        className={`discourse-scroll-container ${isVisible ? 'is-visible' : ''}`}
        ref={contentRef}
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => setIsAutoScrolling(true)}
      >
        <div className="discourse-content-inner">
          {discours.split('\n\n').map((paragraph, index) => (
            <p key={index} className={
              paragraph.startsWith('---') ? 'discourse-separator' : 
              paragraph.match(/^\d\./) ? 'discourse-priority' : 
              paragraph.includes('Vive') ? 'discourse-closing' : 
              index === 0 ? 'discourse-opening' : ''
            }>
              {paragraph.replace('---', '• • •')}
            </p>
          ))}
        </div>
      </div>

      <div className="discourse-footer">
        <div className="discourse-signature">
          <span className="signature-line"></span>
          <span className="signature-text">Dr. Président de l'ONPG</span>
        </div>
      </div>
    </div>
  );
};

export default AccueilONPG;
