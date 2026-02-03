import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import './PolesOverview.css';

interface Pole {
  id: string;
  name: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const PolesOverview = () => {
  const poles: Pole[] = [
    {
      id: 'energie',
      name: 'Pôle énergie',
      description: 'Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines',
      icon: '⚡',
      link: '/poles/energie',
      color: '#252572'
    },
    {
      id: 'geospatial',
      name: 'Pôle traitement de données géospatiales',
      description: 'Collecte, analyse et modélisation des données spatiales',
      icon: '🛰',
      link: '/poles/geospatial',
      color: '#36601e'
    },
    {
      id: 'drone',
      name: 'Pôle drone - ODS',
      description: 'Services drones professionnels pour l\'inspection, la surveillance et la formation',
      icon: '🚁',
      link: '/poles/drone',
      color: '#1b77b6'
    },
    {
      id: 'sante',
      name: 'Pôle Santé connectée',
      description: 'Solutions innovantes pour la santé connectée et le suivi médical',
      icon: '🏥',
      link: '/poles/sante',
      color: '#22a6e1'
    },
    {
      id: 'securite',
      name: 'Pôle Sécurité numérique',
      description: 'Cybersécurité et protection des systèmes d\'information',
      icon: '💻',
      link: '/poles/securite',
      color: '#DBB041'
    }
  ];

  // Composant PoleCard avec animation au scroll
  const PoleCard = ({ pole }: { pole: Pole }) => {
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
        {
          threshold: 0.2,
          rootMargin: '0px'
        }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    const isDrone = pole.icon === '🚁';

    return (
      <Link 
        ref={cardRef}
        to={pole.link} 
        className={`pole-card ${isVisible ? 'icon-animated' : ''}`}
        style={{ borderTopColor: pole.color }}
      >
        <div className="pole-content-wrapper">
          <div 
            className={`pole-icon ${isDrone ? 'icon-drone' : ''}`}
            style={{ 
              backgroundColor: pole.color, 
              color: 'white', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem',
              position: 'relative',
              '--pole-color': pole.color
            } as React.CSSProperties & { '--pole-color': string }}
          >
            <span className="icon-emoji">{pole.icon}</span>
            <div className="icon-glow" style={{ '--pole-color': pole.color } as React.CSSProperties & { '--pole-color': string }}></div>
          </div>
          <h3>{pole.name}</h3>
          <p>{pole.description}</p>
        </div>
        <span className="pole-link" style={{ color: pole.color }}>En savoir plus →</span>
      </Link>
    );
  };

  return (
    <section className="section poles-overview-section">
      <div className="container">
        <h2 className="section-title">Nos pôles d'expertise</h2>
        <div className="poles-grid">
          {poles.map((pole) => (
            <PoleCard key={pole.id} pole={pole} />
          ))}
        </div>
        <div className="poles-cta">
          <Link to="/devis" className="btn btn-primary">
            Demander un devis
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PolesOverview;

