import { useState, useEffect, useRef } from 'react';
import './SecuriteNumerique.css';
import './SecuriteHeroOptions.css'; // Options de design Hero
import TestimonialsCarousel from '../../../components/TestimonialsCarousel';
import './SecuriteNumeriqueTestimonials.css';
import { securiteTestimonials } from '../../../config/testimonialsData';

// Composants d'icônes SVG
const CybersecurityIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bouclier de protection */}
    <path d="M 32 8 L 48 16 L 48 32 Q 48 44, 32 52 Q 16 44, 16 32 L 16 16 Z" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Cadenas au centre */}
    <rect x="28" y="28" width="8" height="10" rx="1" fill="#2C5AA0"/>
    <path d="M 28 28 L 28 24 Q 28 20, 32 20 Q 36 20, 36 24 L 36 28" stroke="#2C5AA0" strokeWidth="2" fill="none"/>
    
    {/* Point clé */}
    <circle cx="32" cy="33" r="1.5" fill="#FFD700"/>
    
    {/* Symbole sécurisé (coche) */}
    <path d="M 26 22 L 29 25 L 34 18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

const AuditIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clipboard/Document d'audit */}
    <rect x="18" y="10" width="28" height="42" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Pince en haut */}
    <rect x="28" y="8" width="8" height="4" rx="1" fill="#2C5AA0"/>
    
    {/* Lignes de texte */}
    <line x1="24" y1="20" x2="40" y2="20" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="24" y1="26" x2="36" y2="26" stroke="#2C5AA0" strokeWidth="2"/>
    <line x1="24" y1="32" x2="38" y2="32" stroke="#2C5AA0" strokeWidth="2"/>
    
    {/* Cases à cocher */}
    <rect x="24" y="38" width="4" height="4" stroke="#2C5AA0" strokeWidth="1.5" fill="none"/>
    <rect x="24" y="44" width="4" height="4" stroke="#2C5AA0" strokeWidth="1.5" fill="none"/>
    
    {/* Coches de validation */}
    <path d="M 25 40 L 26 41 L 27.5 39" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M 25 46 L 26 47 L 27.5 45" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    
    {/* Loupe d'inspection */}
    <circle cx="42" cy="42" r="6" fill="none" stroke="#FFD700" strokeWidth="2"/>
    <line x1="46" y1="46" x2="50" y2="50" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EncryptionIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Deux documents */}
    <rect x="14" y="16" width="20" height="28" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2"/>
    <rect x="30" y="20" width="20" height="28" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Texte clair (gauche) */}
    <line x1="18" y1="22" x2="28" y2="22" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="18" y1="26" x2="28" y2="26" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="18" y1="30" x2="26" y2="30" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Texte crypté (droite) */}
    <line x1="34" y1="26" x2="38" y2="26" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="40" y1="26" x2="42" y2="26" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="44" y1="26" x2="46" y2="26" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="34" y1="30" x2="36" y2="30" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="38" y1="30" x2="42" y2="30" stroke="#2C5AA0" strokeWidth="1.5"/>
    <line x1="44" y1="30" x2="46" y2="30" stroke="#2C5AA0" strokeWidth="1.5"/>
    
    {/* Flèche de cryptage */}
    <path d="M 24 36 L 30 36" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 28 34 L 30 36 L 28 38" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" fill="none"/>
    
    {/* Cadenas */}
    <circle cx="40" cy="40" r="4" fill="#FFD700"/>
    <rect x="38" y="40" width="4" height="4" fill="#FFD700"/>
  </svg>
);

const MonitoringIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Écran de monitoring */}
    <rect x="10" y="14" width="44" height="30" rx="2" fill="#4A90E2" stroke="#2C5AA0" strokeWidth="2.5"/>
    
    {/* Graphiques de monitoring */}
    <path d="M 16 32 L 20 28 L 24 30 L 28 24 L 32 26 L 36 20 L 40 22 L 44 18" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M 16 36 L 20 34 L 24 36 L 28 32 L 32 34 L 36 30 L 40 32 L 44 28" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round"/>
    
    {/* Indicateurs */}
    <circle cx="18" cy="20" r="2" fill="#4CAF50"/>
    <circle cx="28" cy="20" r="2" fill="#FFD700"/>
    <circle cx="38" cy="20" r="2" fill="#FF6B6B"/>
    
    {/* Pied de l'écran */}
    <rect x="28" y="44" width="8" height="3" fill="#2C5AA0"/>
    <rect x="22" y="47" width="20" height="2" fill="#2C5AA0"/>
  </svg>
);

const SecuriteNumerique = () => {
  const [advantagesVisible, setAdvantagesVisible] = useState<boolean>(false);
  const [typedTexts, setTypedTexts] = useState<string[]>([]);
  const advantagesSectionRef = useRef<HTMLElement | null>(null);
  const typingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const services = [
    {
      icon: <CybersecurityIcon />,
      title: 'Cybersécurité & Cryptage',
      description: 'Protection avancée contre les cybermenaces, cryptage des données sensibles et sécurisation des communications'
    },
    {
      icon: <AuditIcon />,
      title: 'Audit & Gestion des Accès',
      description: 'Audit de sécurité informatique, gestion des identités et contrôle des accès aux systèmes'
    },
    {
      icon: <MonitoringIcon />,
      title: 'Supervision & Protection',
      description: 'Surveillance 24/7 des systèmes d\'information, détection des intrusions et réponse aux incidents'
    },
    {
      icon: <EncryptionIcon />,
      title: 'Développement Sécurisé',
      description: 'Conception et développement d\'outils numériques sécurisés et conformes aux standards internationaux'
    }
  ];

  const benefits = [
    'Protection contre les cyberattaques',
    'Conformité aux réglementations',
    'Confidentialité des données garantie',
    'Continuité d\'activité assurée',
    'Accompagnement personnalisé',
    'Technologies de pointe'
  ];

  // Intersection Observer pour animer les bénéfices un par un avec effet typewriter
  useEffect(() => {
    if (!advantagesSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Délai pour laisser le temps de scroll - tempo professionnel
            setTimeout(() => {
              setAdvantagesVisible(true);
              startTypewriterEffect();
            }, 600);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    observer.observe(advantagesSectionRef.current);

    return () => {
      if (advantagesSectionRef.current) {
        observer.unobserve(advantagesSectionRef.current);
      }
      // Nettoyer les timeouts
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutsRef.current = [];
    };
  }, []);

  // Effet typewriter professionnel
  const startTypewriterEffect = () => {
    const typingSpeed = 50; // ms par caractère - tempo professionnel
    const delayBetweenItems = 800; // ms entre chaque élément
    
    benefits.forEach((benefit, index) => {
      const timeout = setTimeout(() => {
        let currentText = '';
        const chars = benefit.split('');
        
        chars.forEach((char, charIndex) => {
          setTimeout(() => {
            currentText += char;
            setTypedTexts(prev => {
              const newTexts = [...prev];
              newTexts[index] = currentText;
              return newTexts;
            });
          }, charIndex * typingSpeed);
        });
      }, index * delayBetweenItems);
      
      typingTimeoutsRef.current.push(timeout);
    });
  };

  return (
    <div className="securite-page">
      {/* Hero Section - OPTIONS DE DESIGN */}
      {/* Pour changer d'option, modifier la classe : option-1, option-2, ou option-3 */}
      <section className="securite-hero option-1">
        {/* Option 2 : Grille de 3 images (décommenter pour activer) */}
        {/* <div className="hero-images-grid">
          <div className="hero-image-item">
            <img src="https://res.cloudinary.com/drbaadexk/image/upload/q_auto:best,f_auto,w_800/v1763559430/cips/poles/securite/securite-cybersecurite-1.jpg" alt="Cybersécurité 1" />
          </div>
          <div className="hero-image-item">
            <img src="https://res.cloudinary.com/drbaadexk/image/upload/q_auto:best,f_auto,w_800/v1763559432/cips/poles/securite/securite-cybersecurite-2.jpg" alt="Cybersécurité 2" />
          </div>
          <div className="hero-image-item">
            <img src="https://res.cloudinary.com/drbaadexk/image/upload/q_auto:best,f_auto,w_800/v1763559434/cips/poles/securite/securite-cybersecurite-3.jpg" alt="Cybersécurité 3" />
          </div>
        </div> */}
        
        {/* Option 3 : Vignettes (décommenter pour activer) */}
        {/* <div className="hero-vignettes">
          <div className="hero-vignette">
            <img src="https://res.cloudinary.com/drbaadexk/image/upload/q_auto:best,f_auto,w_400/v1763559432/cips/poles/securite/securite-cybersecurite-2.jpg" alt="Cybersécurité 2" />
          </div>
          <div className="hero-vignette">
            <img src="https://res.cloudinary.com/drbaadexk/image/upload/q_auto:best,f_auto,w_400/v1763559434/cips/poles/securite/securite-cybersecurite-3.jpg" alt="Cybersécurité 3" />
          </div>
        </div> */}
        
        <div className="securite-hero-content">
          <h1>SÉCURITÉ NUMÉRIQUE</h1>
          <p className="securite-hero-subtitle">
            Le Pôle Sécurité Numérique du Groupe CIPS protège vos systèmes d'information, 
            vos données et vos infrastructures digitales contre toutes les menaces.
          </p>
          <p className="securite-hero-description">
            Dans un monde de plus en plus connecté, la sécurité numérique est devenue un enjeu 
            stratégique majeur. Nous accompagnons les entreprises et organisations africaines dans 
            la protection de leurs actifs numériques par des solutions de cybersécurité robustes et 
            adaptées aux menaces actuelles.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="securite-services section">
        <div className="container">
          <h2>Nos services de sécurité numérique</h2>
          <div className="securite-services-grid">
            {services.map((service, index) => (
              <div key={index} className="securite-service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="securite-benefits" ref={advantagesSectionRef}>
        <div className="container">
          <h2>Les bénéfices de nos solutions</h2>
          <ul className="securite-benefits-list">
            {benefits.map((benefit, index) => {
              const displayedText = typedTexts[index] || '';
              const isTyping = advantagesVisible && displayedText.length < benefit.length;
              
              return (
                <li 
                  key={index}
                  className={advantagesVisible ? 'advantage-item-visible' : 'advantage-item-hidden'}
                >
                  <span className="check-icon">✓</span>
                  <span className="advantage-text">
                    {displayedText}
                    {isTyping && <span className="typewriter-cursor">|</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Approach Section */}
      <section className="securite-approach section">
        <div className="container">
          <h2>Notre approche</h2>
          <div className="securite-approach-content">
            <div className="approach-image">
              <div className="placeholder-image">
                <span>🔒</span>
              </div>
            </div>
            <div className="approach-text">
              <TestimonialsCarousel testimonials={securiteTestimonials} poleName="securite" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="securite-cta section">
        <div className="container">
          <div className="securite-cta-content">
            <h2>Besoin d'un audit de sécurité ?</h2>
            <p>Contactez nos experts pour évaluer et renforcer la sécurité de vos systèmes</p>
            <div className="securite-cta-buttons">
              <a href="/devis" className="btn btn-primary">Demander un devis</a>
              <a href="/contact" className="btn btn-secondary">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecuriteNumerique;

