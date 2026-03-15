import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import HeroONPG from './components/HeroONPG';
import AnimatedSection from '../../components/AnimatedSection';
import ONPG_CONFIG from '../../config/onpg-config';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import { getImageWithFallback } from '../../utils/imageFallback';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './AccueilONPG.css';
import './AccueilONPG-Elegant.css';

interface Actualite {
  _id: string;
  title: string;
  excerpt?: string;
  summary?: string;
  content?: string;
  image?: string;
  category?: string;
  publishedAt?: string;
  date?: string;
  createdAt?: string;
  author?: string;
  readTime?: number;
  featured?: boolean;
}

type NewsTabKey = 'actualites' | 'communiques' | 'lois';

interface NewsHubItem {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: number;
}

const AccueilONPG = () => {
  // État pour les actualités réelles
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [communiques, setCommuniques] = useState<NewsHubItem[]>([]);
  const [lois, setLois] = useState<NewsHubItem[]>([]);
  const [loadingActualites, setLoadingActualites] = useState(true);
  const [activeNewsTab, setActiveNewsTab] = useState<NewsTabKey>('actualites');
  
  // État pour le carousel avec 3 blocs et défilement subtil
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // État pour les photos du site (depuis la base de données)
  const [siteImages, setSiteImages] = useState({
    presidentPhoto: ONPG_IMAGES.president,
    heroImage: ONPG_IMAGES.hero1
  });

  // Mise à jour du canonical pour la page d'accueil ONPG
  useEffect(() => {
    document.title = ONPG_CONFIG.app.title;
  }, []);

  // Charger les photos du site depuis l'API
  useEffect(() => {
    const loadSiteImages = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL ||
          (import.meta.env.PROD
            ? 'https://backendonpg-production.up.railway.app/api'
            : 'http://localhost:3001/api');
        
        const response = await fetch(`${API_URL}/public/site-settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setSiteImages({
              presidentPhoto: data.data.presidentPhoto || ONPG_IMAGES.president,
              heroImage: data.data.heroImage || ONPG_IMAGES.hero1
            });
          }
        }
      } catch (error) {
        console.error('Erreur chargement images site:', error);
        // Garder les images par défaut en cas d'erreur
      }
    };
    loadSiteImages();
  }, []);

  // Charger les actualités depuis l'API
  useEffect(() => {
    const mapSorted = (rows: any[], categoryLabel: string): NewsHubItem[] =>
      rows
        .map((item: any) => ({
          _id: String(item._id || ''),
          title: String(item.title || item.name || item.reference || ''),
          excerpt: String(item.excerpt || item.summary || item.description || ''),
          image: getImageWithFallback(item.backgroundImage || item.image || item.featuredImage, 'article'),
          category: String(item.category || categoryLabel),
          publishedAt: String(item.publishedAt || item.date || item.publicationDate || item.createdAt || new Date().toISOString()),
          author: typeof item.author === 'object' && item.author !== null
            ? String(item.author.name || 'ONPG')
            : String(item.author || 'ONPG'),
          readTime: Number(item.readTime || 3)
        }))
        .filter((item) => item._id && item.title)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const loadNewsHub = async () => {
      try {
        setLoadingActualites(true);
        const [actualitesData, communiquesData, loisData] = await Promise.all([
          fetchResourceData('actualites'),
          fetchResourceData('communiques'),
          fetchResourceData('lois')
        ]);

        const actualitesRows = Array.isArray(actualitesData) ? actualitesData : (actualitesData ? [actualitesData] : []);
        const communiquesRows = Array.isArray(communiquesData) ? communiquesData : (communiquesData ? [communiquesData] : []);
        const loisRows = Array.isArray(loisData) ? loisData : (loisData ? [loisData] : []);

        const sortedActualites = mapSorted(actualitesRows, 'ACTUALITÉS');
        const sortedCommuniques = mapSorted(communiquesRows, 'COMMUNIQUÉS');
        const sortedLois = mapSorted(loisRows, 'LOIS');

        setActualites(sortedActualites.map((item) => ({
          _id: item._id,
          title: item.title,
          excerpt: item.excerpt,
          image: item.image,
          category: item.category,
          publishedAt: item.publishedAt,
          author: item.author,
          readTime: item.readTime
        })));
        setCommuniques(sortedCommuniques);
        setLois(sortedLois);
      } catch (error) {
        console.error('Erreur chargement actualités:', error);
        setActualites([]);
        setCommuniques([]);
        setLois([]);
      } finally {
        setLoadingActualites(false);
      }
    };
    
    loadNewsHub();
  }, []);

  // Auto-défilement naturel avec séquence logique
  useEffect(() => {
    if (actualites.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        // Durée totale de l'animation séquentielle
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % actualites.length);
          setIsAnimating(false);
        }, 1000); // Animation complète en 1 seconde
      }
    }, 7000); // Changement toutes les 7 secondes pour rythme naturel

    return () => clearInterval(interval);
  }, [isAnimating, actualites.length]);

  // Calculer les actualités visibles (3 ou 4 selon l'animation)
  const getVisibleNews = () => {
    if (actualites.length === 0) return [];
    
    const result = [];
    // Toujours 3 cartes de base
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % actualites.length;
      result.push(actualites[index]);
    }

    // Pendant l'animation, ajouter la 4ème carte qui arrive
    if (isAnimating && actualites.length > 3) {
      const nextIndex = (currentIndex + 3) % actualites.length;
      result.push(actualites[nextIndex]);
    }

    return result;
  };

  const visibleNews = getVisibleNews();

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const month = months[date.getMonth()];
    return { day: day.toString(), month };
  };

  const newsHubConfig: Record<NewsTabKey, { title: string; subtitle: string; route: string }> = {
    actualites: {
      title: 'Actualités',
      subtitle: "Restez informés des dernières actualités de l'ONPG",
      route: '/ressources/actualites'
    },
    communiques: {
      title: 'Communiqués',
      subtitle: 'Informations officielles et annonces institutionnelles',
      route: '/ressources?tab=communiques'
    },
    lois: {
      title: 'Lois',
      subtitle: 'Textes réglementaires essentiels pour la profession',
      route: '/ressources?tab=lois'
    }
  };

  const activeNewsItems = (
    activeNewsTab === 'actualites'
      ? actualites
      : activeNewsTab === 'communiques'
        ? communiques
        : lois
  ) as NewsHubItem[];

  // Pause élégante au survol
  const [isHovered] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
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
      icon: 'health',
      title: 'Protection de la Santé Publique',
      description: 'Garantir la qualité et la sécurité des médicaments au Gabon',
      color: '#00A651',
      link: '/ordre/sante-publique'
    },
    {
      icon: 'defense',
      title: 'Défense des Pharmaciens',
      description: 'Représenter et défendre les intérêts professionnels',
      color: '#008F45',
      link: '/ordre/defense-professionnelle'
    },
    {
      icon: 'formation',
      title: 'Formation Continue',
      description: 'Assurer le développement des compétences',
      color: '#2ECC71',
      link: '/pratique/formation-continue'
    },
    {
      icon: 'ethics',
      title: 'Régulation Éthique',
      description: 'Contrôler et réguler l\'exercice professionnel',
      color: '#27AE60',
      link: '/pratique/deontologie'
    }
  ];

  const renderMissionIcon = (icon: string) => {
    switch (icon) {
      case 'health':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="mission-icon-svg" aria-hidden="true">
            <path d="M12 4.2v15.6M4.2 12h15.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        );
      case 'defense':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="mission-icon-svg" aria-hidden="true">
            <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4.5 18.5c0-2.5 2-4.5 4.5-4.5h.2c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13.2 18.5c.2-1.9 1.8-3.5 3.8-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'formation':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="mission-icon-svg" aria-hidden="true">
            <path d="m3.5 9 8.5-4 8.5 4-8.5 4-8.5-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M7 11.5V15c0 1.1 2.2 2 5 2s5-.9 5-2v-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.5 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" className="mission-icon-svg" aria-hidden="true">
            <path d="M12 3.8 19.3 7v5.1c0 4.3-3 7.8-7.3 8.8-4.3-1-7.3-4.5-7.3-8.8V7L12 3.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m9.2 12.2 1.9 1.9 3.7-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

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
          <span className="icon-emoji">{renderMissionIcon(mission.icon)}</span>
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
              <div className="engagement-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="engagement-icon-svg">
                  <path d="M8 3.5h8M10 3.5v4.2l-4.7 7.8a3 3 0 0 0 2.6 4.5h8.2a3 3 0 0 0 2.6-4.5L14 7.7V3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 14h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="engagement-card-title">Qualité &amp; Sécurité</h3>
              <p className="engagement-card-text">
                Garantir l'excellence des médicaments et la sécurité des soins
                à travers une régulation stricte et des contrôles permanents.
              </p>
            </div>

            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="engagement-icon-svg">
                  <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.7"/>
                  <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M4.5 18.5c0-2.5 2-4.5 4.5-4.5h.2c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M13.4 18.5c.1-1.9 1.7-3.5 3.7-3.5h.2c1.2 0 2.2.5 3 1.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="engagement-card-title">Protection Professionnelle</h3>
              <p className="engagement-card-text">
                Défendre les intérêts des pharmaciens et promouvoir l'excellence
                professionnelle à travers une représentation forte et unie.
              </p>
            </div>

            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="engagement-icon-svg">
                  <path d="m3 9 9-4 9 4-9 4-9-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                  <path d="M7 11.2V15c0 1.1 2.2 2 5 2s5-.9 5-2v-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 9v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="engagement-card-title">Formation Continue</h3>
              <p className="engagement-card-text">
                Assurer le développement des compétences et l'adaptation permanente
                aux évolutions scientifiques et réglementaires du secteur.
              </p>
            </div>

            <div className="engagement-card">
              <div className="engagement-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="engagement-icon-svg">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M3.8 12h16.4M12 3.8c2.5 2.3 3.9 5.2 3.9 8.2S14.5 17.9 12 20.2M12 3.8C9.5 6.1 8.1 9 8.1 12s1.4 5.9 3.9 8.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
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
            <h2 className="president-titleband-title">Message de la Présidente</h2>
            <div className="president-titleband-rule" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      {/* Message de la Présidente - Nouveau Design Professionnel avec Bloc Interactif */}
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
                      src={siteImages.presidentPhoto}
                      alt="Présidente ONPG - Dr Patience Asseko NTOGONO OKE"
                      className="president-photo-professional"
                      loading="eager"
                      fetchPriority="high"
                      onError={(e) => {
                        // Empêcher les multiples tentatives
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.errorHandled) {
                          target.dataset.errorHandled = 'true';
                          console.warn('Image présidente introuvable:', siteImages.presidentPhoto);
                        }
                      }}
                    />

                    {/* Badge Institutionnel */}
                    <div className="president-badge-professional">
                      <div className="badge-professional-content">
                        <span className="badge-professional-title">PRÉSIDENTE</span>
                        <div className="badge-professional-accent"></div>
                        <span className="badge-professional-org">Ordre National</span>
                      </div>
                    </div>

                    {/* Informations Institutionnelles — masquées sur mobile (voir .president-info-below-mobile) */}
                    <div className="president-info-professional">
                      <h3 className="president-name-professional">Dr Patience Asseko NTOGONO OKE</h3>
                      <p className="president-position-professional">
                        Présidente de l'Ordre National<br />
                        des Pharmaciens du Gabon
                      </p>
                    </div>
                  </div>

                  {/* Bloc nom/fonction affiché SOUS la photo uniquement sur mobile */}
                  <div className="president-info-below-mobile">
                    <h3 className="president-name-professional">Dr Patience Asseko NTOGONO OKE</h3>
                    <p className="president-position-professional">
                      Présidente de l'Ordre National des Pharmaciens du Gabon
                    </p>
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

      {/* Hub editorial compact a onglets */}
      <section className="onpg-news news-section section" data-animate>
        <div className="container">
          <div className="news-hub-tabs" role="tablist" aria-label="Categories editoriales accueil">
            <button
              type="button"
              role="tab"
              aria-selected={activeNewsTab === 'actualites'}
              className={`news-hub-tab ${activeNewsTab === 'actualites' ? 'active' : ''}`}
              onClick={() => setActiveNewsTab('actualites')}
            >
              Actualités
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeNewsTab === 'communiques'}
              className={`news-hub-tab ${activeNewsTab === 'communiques' ? 'active' : ''}`}
              onClick={() => setActiveNewsTab('communiques')}
            >
              Communiqués
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeNewsTab === 'lois'}
              className={`news-hub-tab ${activeNewsTab === 'lois' ? 'active' : ''}`}
              onClick={() => setActiveNewsTab('lois')}
            >
              Lois
            </button>
          </div>

          <div className="news-header-professional">
            <div className="news-header-accent"></div>
            <h2 className="news-title-professional">{newsHubConfig[activeNewsTab].title}</h2>
            <p className="news-subtitle-professional">
              {newsHubConfig[activeNewsTab].subtitle}
            </p>
          </div>

          <div className="news-grid">
            {loadingActualites ? (
              // Skeleton loading
              [1, 2, 3].map(i => (
                <div key={i} className="news-card" style={{ opacity: 0.6 }}>
                  <div className="news-image">
                    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }}></div>
                  </div>
                  <div className="news-content">
                    <h3 className="news-title" style={{ background: '#f0f0f0', height: '20px', borderRadius: '4px' }}></h3>
                    <p className="news-excerpt" style={{ background: '#f0f0f0', height: '60px', borderRadius: '4px', marginTop: '10px' }}></p>
                  </div>
                </div>
              ))
            ) : activeNewsItems.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                Aucun contenu disponible pour cette catégorie.
              </p>
            ) : (
              activeNewsItems.slice(0, 3).map((item) => {
                const dateFormatted = formatDate(item.publishedAt || new Date().toISOString());
                const imageUrl = getImageWithFallback(item.image, 'article');
                return (
                  <div key={item._id} className="news-card">
                    <div className="news-image">
                      <img 
                        src={imageUrl} 
                        alt={item.title} 
                        onError={(e) => {
                          // Si l'image échoue, utiliser le fallback article
                          (e.target as HTMLImageElement).src = getImageWithFallback(null, 'article');
                        }}
                      />
                      <div className="news-image-overlay"></div>
                      <div className="news-date">
                        <span className="date-day">{dateFormatted.day}</span>
                        <span className="date-month">{dateFormatted.month}</span>
                      </div>
                      <div className="news-category" style={{ backgroundColor: '#27ae60' }}>
                        <span className="category-text">{item.category || newsHubConfig[activeNewsTab].title.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="news-content">
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-excerpt">{item.excerpt || "Consultez les informations importantes de l'ONPG."}</p>
                      <div className="news-meta">
                        <span className="meta-author">{item.author || 'ONPG'}</span>
                        <span className="meta-separator">•</span>
                        <span className="meta-read-time">{item.readTime || 3} min</span>
                      </div>
                      <Link to={newsHubConfig[activeNewsTab].route} className="news-link">
                        <span className="link-text">Voir dans ressources</span>
                        <span className="link-arrow">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="news-actions">
            <Link to={newsHubConfig[activeNewsTab].route} className="btn btn-primary">
              <span className="news-btn-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="news-btn-icon-svg">
                  <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span>Voir tout {newsHubConfig[activeNewsTab].title.toLowerCase()}</span>
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
              <span className="badge-icon-ultra" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="formation-icon-svg">
                  <path d="m3.5 9 8.5-4 8.5 4-8.5 4-8.5-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M7 11.5V15c0 1.1 2.2 2 5 2s5-.9 5-2v-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.5 9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
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
                  <span className="benefit-icon-ultra" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="formation-icon-svg">
                      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M17.8 6.2 14.8 9.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="benefit-text-ultra">Certifiée</span>
                </div>
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="formation-icon-svg">
                      <circle cx="9" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M5.2 17c0-2 1.6-3.6 3.6-3.6h.4c2 0 3.6 1.6 3.6 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M15.5 7h3.2m-3.2 3h3.2m-3.2 3h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="benefit-text-ultra">Experts</span>
                </div>
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="formation-icon-svg">
                      <rect x="4" y="5.5" width="16" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M2.8 19h18.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="benefit-text-ultra">Hybride</span>
                </div>
                <div className="benefit-ultra">
                  <span className="benefit-icon-ultra" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="formation-icon-svg">
                      <path d="M8 5h8v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M9.5 11.2V14h5v-2.8M8 19h8M10 16.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M8 7H6.5a2 2 0 0 0 0 4H8m8-4h1.5a2 2 0 1 1 0 4H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="benefit-text-ultra">Qualité</span>
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
                  src={siteImages.heroImage || ONPG_IMAGES.hero4}
                  alt="Formation Continue ONPG"
                  onError={(e) => {
                    // Empêcher les multiples tentatives
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.errorHandled) {
                      target.dataset.errorHandled = 'true';
                      // Essayer d'abord une autre image existante
                      target.src = ONPG_IMAGES.hero4;
                    } else {
                      // Si ça ne marche toujours pas, utiliser le placeholder
                      target.onerror = null; target.style.display = 'none'; const parent = target.parentElement; if (parent) { parent.style.background = 'linear-gradient(135deg,#27ae60,#1a7a42)'; parent.style.display = 'flex'; parent.style.alignItems = 'center'; parent.style.justifyContent = 'center'; }
                    }
                  }}
                  loading="lazy"
                />
                <div className="formation-image-overlay-ultra"></div>

                {/* Éléments flottants discrets */}
                <div className="formation-floating-ultra">
                  <div className="floating-item-ultra">
                    <span className="floating-icon-ultra">+</span>
                  </div>
                  <div className="floating-item-ultra delay-1">
                    <span className="floating-icon-ultra">ONPG</span>
                  </div>
                  <div className="floating-item-ultra delay-2">
                    <span className="floating-icon-ultra">Formation continue</span>
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
                Notre équipe est à votre écoute pour vous orienter sur les démarches, la réglementation
                et les informations utiles relatives à l'Ordre National des Pharmaciens du Gabon.
              </p>
            </div>

            {/* Grille de contact WOW */}
            <div className="contact-cta-grid-professional">
              <a href="tel:+24176502032" className="contact-cta-item-professional contact-link">
                <div className="contact-icon-frame-professional">
                  <div className="contact-cta-icon-professional" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="contact-cta-icon-svg">
                      <path d="M6.8 3.5h2.4c.5 0 .9.3 1 .8l.6 2.6c.1.4 0 .8-.3 1.1l-1.2 1.2a15.3 15.3 0 0 0 5.5 5.5l1.2-1.2c.3-.3.7-.4 1.1-.3l2.6.6c.5.1.8.5.8 1v2.4c0 .6-.4 1.1-1 1.2-1 .1-2 .2-3 .1A16.9 16.9 0 0 1 5.6 6.6c0-1 .1-2 .2-3 .1-.6.6-1.1 1.2-1.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="icon-glow-professional"></div>
                </div>
                <div className="contact-content-professional">
                  <h3 className="contact-item-title-professional">Par téléphone</h3>
                  <p className="contact-info-professional">076 50 20 32</p>
                  <small className="contact-note-professional">Lundi au vendredi, 08:30–17:30</small>
                </div>
                <div className="contact-decoration-professional"></div>
              </a>

              <a href="mailto:contact@onpg.ga" className="contact-cta-item-professional contact-link">
                <div className="contact-icon-frame-professional">
                  <div className="contact-cta-icon-professional" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="contact-cta-icon-svg">
                      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="m4.5 7 7.5 6L19.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="icon-glow-professional"></div>
                </div>
                <div className="contact-content-professional">
                  <h3 className="contact-item-title-professional">Par email</h3>
                  <p className="contact-info-professional">contact@onpg.ga</p>
                  <small className="contact-note-professional">Réponse sous 24h</small>
                </div>
                <div className="contact-decoration-professional"></div>
              </a>

              <a href="https://www.google.com/maps/search/?api=1&query=CC4J%2BWC6+Montee+Louis+Libreville+Gabon" target="_blank" rel="noopener noreferrer" className="contact-cta-item-professional contact-link">
                <div className="contact-icon-frame-professional">
                  <div className="contact-cta-icon-professional" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="contact-cta-icon-svg">
                      <path d="M12 20s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <div className="icon-glow-professional"></div>
                </div>
                <div className="contact-content-professional">
                  <h3 className="contact-item-title-professional">Sur place</h3>
                  <p className="contact-info-professional">CC4J+WC6, Montee Louis, Libreville</p>
                  <small className="contact-note-professional">Après le Ministère de la Promotion de la Bonne Gouvernance</small>
                </div>
                <div className="contact-decoration-professional"></div>
              </a>
            </div>

            {/* Bouton Nous contacter */}
            <div className="contact-main-cta-professional">
              <Link to="/pratique/contact" className="btn-contact-primary-professional">
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
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  // Ref pour préserver la position de scroll entre les re-renders
  const scrollPosRef = useRef(0);

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
          // Reset scroll position au début quand le bloc devient visible
          scrollPosRef.current = 0;
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
  // scrollPosRef conserve la position entre les re-renders (mouse hover ne repart plus à 0)
  useEffect(() => {
    if (!isVisible || !isAutoScrolling || !contentRef.current) return;

    const content = contentRef.current;
    let animationId: number;

    const scroll = () => {
      scrollPosRef.current += 0.5;
      const maxScroll = content.scrollHeight - content.clientHeight;
      if (maxScroll <= 0) return; // Pas assez de contenu à scroller
      if (scrollPosRef.current >= maxScroll) {
        scrollPosRef.current = 0; // Recommencer depuis le début
      }
      content.scrollTop = scrollPosRef.current;
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
            <span className="badge-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="discourse-badge-icon-svg">
                <path d="M7 4.5h10a2 2 0 0 1 2 2V19l-2.2-1-2.3 1-2.3-1-2.2 1-2.3-1L5 19V6.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9h6M9 12h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </span>
            Discours d'investiture
          </div>
          <button 
            className={`auto-scroll-toggle ${isAutoScrolling ? 'active' : ''}`}
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            title={isAutoScrolling ? 'Pause auto-scroll' : 'Activer auto-scroll'}
            aria-label={isAutoScrolling ? "Mettre en pause le défilement automatique" : "Activer le défilement automatique"}
          >
            <span className="auto-scroll-toggle-icon" aria-hidden="true">
              {isAutoScrolling ? (
                <svg viewBox="0 0 24 24" fill="none" className="auto-scroll-toggle-svg">
                  <rect x="7" y="6" width="3.5" height="12" rx="1" fill="currentColor" />
                  <rect x="13.5" y="6" width="3.5" height="12" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="auto-scroll-toggle-svg">
                  <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
                </svg>
              )}
            </span>
            <span className="auto-scroll-toggle-text">
              {isAutoScrolling ? 'Pause' : 'Auto'}
            </span>
          </button>
        </div>
            <h3 className="discourse-title">Message de la Présidente</h3>
        <p className="discourse-subtitle">Cérémonie d'investiture du nouveau bureau</p>
      </div>
      
      <div 
        className={`discourse-scroll-container ${isVisible ? 'is-visible' : ''}`}
        ref={contentRef}
        onMouseEnter={() => setIsAutoScrolling(false)}
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
          <span className="signature-text">Dr Patience Asseko NTOGONO OKE<br />Présidente de l'ONPG</span>
        </div>
      </div>
    </div>
  );
};

export default AccueilONPG;
// Force Vite to recompile
