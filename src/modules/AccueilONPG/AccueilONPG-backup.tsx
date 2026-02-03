import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
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
      icon: '🎓',
      title: 'Formation et Développement',
      description: 'Accompagner les professionnels de santé dans leur carrière',
      color: '#00A651',
      link: '/missions/formation'
    },
    {
      icon: '⚖️',
      title: 'Régulation Professionnelle',
      description: 'Définir et faire respecter les normes de la profession',
      color: '#FF6B35',
      link: '/missions/regulation'
    },
    {
      icon: '🤝',
      title: 'Représentation',
      description: 'Défendre les intérêts des pharmaciens auprès des autorités',
      color: '#DBB041',
      link: '/missions/representation'
    }
  ];



  // Composant Discours Complet du Président - UNE PAGE SANS SCROLLING
  const PresidentContentBlock = () => {
    return (
      <div className="president-full-discourse">
        {/* Ouverture élégante du discours */}
        <div className="discourse-opening-compact">
          <div className="opening-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-icon">📜</div>
            <div className="decoration-line"></div>
          </div>
          <div className="greeting-professional-compact">
            <p className="greeting-professional-text">
              Excellence, chers confrères et consœurs,<br />
              Mesdames et Messieurs,<br />
              Distingués invités,
            </p>
          </div>
        </div>

        {/* Corps principal du discours - SANS NUMÉROS */}
        <div className="discourse-body-compact">
          {/* Premier paragraphe */}
          <div className="discourse-paragraph-simple">
            <p className="discourse-text-compact">
              En ce jour solennel, c'est avec une immense gratitude et une profonde humilité
              que nous acceptons la charge de présider l'Ordre National des Pharmaciens du Gabon.
            </p>
          </div>

          {/* Deuxième paragraphe */}
          <div className="discourse-paragraph-simple">
            <p className="discourse-text-compact">
              Nous remercions nos pairs pour la confiance qu'ils nous ont témoignée et rendons
              hommage au bureau sortant pour le travail accompli. C'est en tenant compte de
              vos échecs et vos succès que nous allons mieux nous orienter et bâtir ensemble
              une nouvelle dynamique, tournée vers l'avenir.
            </p>
          </div>

          {/* Troisième paragraphe avec mise en avant */}
          <div className="discourse-paragraph-highlight-simple">
            <p className="discourse-text-highlight">
              Notre mandat se reposera sur <strong className="emphasis-text">4 priorités essentielles</strong> pour renforcer notre institution
              et mieux servir la profession pharmaceutique au Gabon.
            </p>
          </div>
        </div>

        {/* Section des 4 Priorités - GRILLE COMPACTE */}
        <div className="priorities-compact-section">
          <div className="priorities-header-compact">
            <div className="priorities-section-badge">
              <span className="badge-icon">🎯</span>
              <span className="badge-text">NOS 4 PRIORITÉS 2026</span>
            </div>
          </div>

          <div className="priorities-compact-grid">
            {/* BLOC 1 - UNE GOUVERNANCE RENFORCÉE */}
            <div className="priority-compact-card priority-card-1">
              <div className="priority-compact-header">
                <div className="priority-compact-number">1</div>
                <div className="priority-compact-icon">🏛️</div>
                <h4 className="priority-compact-title">Gouvernance Renforcée</h4>
              </div>
              <div className="priority-compact-content">
                <p className="priority-compact-text">
                  Notre institution doit être exemplaire avec une gouvernance moderne, inclusive et efficace.
                </p>
              </div>
            </div>

            {/* BLOC 2 - TRANSPARENCE ET BONNE GESTION */}
            <div className="priority-compact-card priority-card-2">
              <div className="priority-compact-header">
                <div className="priority-compact-number">2</div>
                <div className="priority-compact-icon">📊</div>
                <h4 className="priority-compact-title">Transparence & Gestion</h4>
              </div>
              <div className="priority-compact-content">
                <p className="priority-compact-text">
                  Gestion financière transparente avec rapports annuels et audits réguliers.
                </p>
              </div>
            </div>

            {/* BLOC 3 - DIGITALISATION ET MODERNISATION */}
            <div className="priority-compact-card priority-card-3">
              <div className="priority-compact-header">
                <div className="priority-compact-number">3</div>
                <div className="priority-compact-icon">💻</div>
                <h4 className="priority-compact-title">Digitalisation</h4>
              </div>
              <div className="priority-compact-content">
                <p className="priority-compact-text">
                  Outils numériques pour faciliter les adhésions et services administratifs.
                </p>
              </div>
            </div>

            {/* BLOC 4 - UN ORDRE AU SERVICE DE LA POPULATION */}
            <div className="priority-compact-card priority-card-4">
              <div className="priority-compact-header">
                <div className="priority-compact-number">4</div>
                <div className="priority-compact-icon">🌍</div>
                <h4 className="priority-compact-title">Service Population</h4>
              </div>
              <div className="priority-compact-content">
                <p className="priority-compact-text">
                  Garantir la qualité et sécurité des médicaments pour tous les Gabonais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion Inspirante - COMPACT */}
        <div className="conclusion-compact-section">
          <div className="conclusion-compact-content">
            <div className="conclusion-compact-highlight">
              <strong>Mes chers collègues,</strong>
            </div>
            <p className="conclusion-compact-text">
              L'avenir de notre profession dépend de notre capacité à rester unis,
              responsables et innovants.
            </p>
            <div className="conclusion-compact-commitment">
              <p className="conclusion-compact-commitment-text">
                Nous prenons l'engagement solennel d'exercer ce mandat avec rigueur et transparence.
                <strong className="final-emphasis">Ensemble, faisons de l'Ordre des Pharmaciens du Gabon une institution forte et crédible !</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Citation finale du président */}
        <div className="final-quote-compact">
          <div className="final-quote-container">
            <blockquote className="final-quote-text">
              "Ensemble, faisons de l'Ordre des Pharmaciens du Gabon une institution forte,
              crédible et résolument tournée vers l'avenir."
            </blockquote>
            <div className="final-quote-author">
              <span className="final-author-name">Dr. [Nom du Président]</span>
              <span className="final-author-title">Président de l'ONPG</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant MissionCard avec animation
  const MissionCard = ({ mission }: { mission: typeof missions[0] }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: '0px' }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <Link
        ref={cardRef}
        to={mission.link}
        className={`mission-card ${isVisible ? 'animated' : ''}`}
        style={{ '--mission-color': mission.color } as React.CSSProperties}
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
  };

  return (
    <div className="accueil-onpg">
      {/* Hero Section */}
      <HeroONPG />

      {/* Message du Président - Nouveau Design Professionnel avec Bloc Interactif */}
      <section className="onpg-president-message section" data-animate>
        <div className="container">
          <AnimatedSection animation="fadeIn">
            <div className="president-professional-section">

              {/* Header Institutionnel */}
              <div className="president-header-professional">
                <div className="header-professional-content">
                  <div className="header-professional-line"></div>
                  <div className="header-professional-text">
                    <span className="header-professional-label">Institution</span>
                    <h2 className="header-professional-title">Message du Président</h2>
                  </div>
                  <div className="header-professional-line"></div>
                </div>
              </div>

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
                <div className="president-interactive-block">
                  <PresidentContentBlock />
                </div>

              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>




      {/* Section Missions */}
      <section className="onpg-missions section" data-animate>
        <div className="container">
          <AnimatedSection animation="fadeIn">
            <div className="missions-header">
              <h2>Nos Missions</h2>
              <p className="section-subtitle">
                L'ONPG s'engage quotidiennement pour la qualité des soins et la protection de la santé publique
              </p>
            </div>
          </AnimatedSection>

          <div className="missions-grid">
            {missions.map((mission, index) => (
              <AnimatedSection key={index} animation="slideUp" delay={index * 150}>
                <MissionCard mission={mission} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Section Actualités */}
      <section className="onpg-news section" data-animate>
        <div className="container">
          <AnimatedSection animation="fadeIn">
            <div className="news-header">
              <h2>Actualités & Communiqués</h2>
              <p className="section-subtitle">
                Restez informé des dernières nouvelles et décisions de l'ONPG
              </p>
              <Link to="/actualites" className="btn btn-onpg-secondary">
                Toutes les actualités
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={200}>
            <div className="news-preview">
              <div className="news-placeholder">
                <div className="news-icon">📰</div>
                <h3>Communiqués Officiels</h3>
                <p>Décisions, réglementations et annonces importantes</p>
              </div>
              <div className="news-placeholder">
                <div className="news-icon">📅</div>
                <h3>Événements</h3>
                <p>Formations, conférences et manifestations professionnelles</p>
              </div>
              <div className="news-placeholder">
                <div className="news-icon">📚</div>
                <h3>Publications</h3>
                <p>Guides, études et ressources pour les professionnels</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section Formation */}
      <section className="onpg-formation section" data-animate>
        <div className="container">
          <AnimatedSection animation="fadeIn">
            <div className="formation-content">
              <div className="formation-text">
                <h2>Formation Continue</h2>
                <h3>Développez vos compétences</h3>
                <p>
                  L'ONPG propose un programme complet de formation continue pour maintenir
                  et développer les compétences des pharmaciens gabonais. Nos formations
                  sont conçues pour répondre aux évolutions de la profession et aux besoins
                  du système de santé.
                </p>
                <ul className="formation-benefits">
                  <li>Formations certifiées et reconnues</li>
                  <li>Experts et professionnels de santé</li>
                  <li>Approche pratique et actualisée</li>
                  <li>Évaluation continue des compétences</li>
                </ul>
                <Link to="/formation" className="btn btn-onpg-primary">
                  Découvrir nos formations
                </Link>
              </div>
              <div className="formation-visual">
                <div className="formation-illustration">
                  <div className="book-icon">📚</div>
                  <div className="graduation-icon">🎓</div>
                  <div className="certificate-icon">🏆</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section Contact CTA */}
      <section className="onpg-contact-cta section" data-animate>
        <div className="container">
          <AnimatedSection animation="slideUp">
            <div className="contact-cta-content">
              <h2>Une question ? Contactez-nous</h2>
              <p>
                Notre équipe est à votre disposition pour répondre à vos questions
                et vous accompagner dans vos démarches professionnelles.
              </p>
              <div className="contact-cta-actions">
                <Link to="/contact" className="btn btn-onpg-primary">
                  Nous contacter
                </Link>
                <div className="contact-info">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>{ONPG_CONFIG.contact.email}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <span>{ONPG_CONFIG.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default AccueilONPG;
