import './APropos.css';
import AfricaMap from './components/AfricaMap';

// Composants d'icônes pour les valeurs
const InnovationIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="16" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
    <line x1="32" y1="8" x2="32" y2="14" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="50" x2="32" y2="56" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="32" x2="14" y2="32" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="50" y1="32" x2="56" y2="32" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="15" x2="20" y2="20" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="44" y1="44" x2="49" y2="49" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="49" y1="15" x2="44" y2="20" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <line x1="20" y1="44" x2="15" y2="49" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="32" cy="32" r="6" fill="#FFA500"/>
  </svg>
);

const DurabiliteIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="38" r="20" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2"/>
    <path d="M 32 18 Q 26 24, 32 30 Q 38 24, 32 18" fill="#2E7D32"/>
    <path d="M 28 32 Q 32 36, 36 32" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="26" cy="40" r="2" fill="white"/>
    <circle cx="32" cy="42" r="2" fill="white"/>
    <circle cx="38" cy="40" r="2" fill="white"/>
  </svg>
);

const FiabiliteIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 32 8 L 48 18 L 48 36 Q 48 48, 32 56 Q 16 48, 16 36 L 16 18 Z" fill="#2196F3" stroke="#1565C0" strokeWidth="2"/>
    <path d="M 24 32 L 30 38 L 42 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const ImpactIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="26" r="8" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2"/>
    <path d="M 20 36 Q 20 32, 24 32 L 40 32 Q 44 32, 44 36 L 44 48 Q 44 52, 40 52 L 24 52 Q 20 52, 20 48 Z" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="2"/>
    <circle cx="16" cy="20" r="4" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1.5"/>
    <circle cx="48" cy="20" r="4" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1.5"/>
    <path d="M 28 38 L 28 46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M 36 38 L 36 46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const APropos = () => {
  const values = [
    {
      icon: <InnovationIcon />,
      title: 'Innovation',
      description: 'Concevoir des solutions adaptées aux besoins africains'
    },
    {
      icon: <DurabiliteIcon />,
      title: 'Durabilité',
      description: 'Promouvoir des technologies propres et responsables'
    },
    {
      icon: <FiabiliteIcon />,
      title: 'Fiabilité',
      description: 'Garantir la performance et la sécurité de nos services'
    },
    {
      icon: <ImpactIcon />,
      title: 'Impact Social',
      description: 'Rendre la technologie utile et accessible à tous'
    }
  ];

  const poles = [
    {
      title: 'Pôle Énergie',
      description: 'Solutions énergétiques intelligentes, fiables et adaptées aux réalités africaines',
      items: [
        'Kits solaires photovoltaïques autonomes',
        'Groupes électrogènes et onduleurs',
        'Transformateurs',
        'Bornes de recharge pour véhicules électriques'
      ],
      objective: 'Garantir l\'indépendance énergétique'
    },
    {
      title: 'Pôle Traitement de Données Géospatiales',
      description: 'Collecte, analyse et modélisation des données spatiales',
      items: [
        'Modélisation 3D et orthophotographie',
        'Relevés topographiques et plans de dimensionnement',
        'Modèles numériques de terrain (MNT/MNS)',
        'Cartes hydrographiques et analyses côtières'
      ],
      objective: 'Maîtriser et gérer intelligemment les territoires'
    },
    {
      title: 'ODS – Optimum Drone Services',
      description: 'Services professionnels par drone pour tous secteurs',
      items: [
        'Captation événementielle et médiatique',
        'Inspection aérienne d\'infrastructures',
        'Surveillance et monitoring',
        'Formations diplômantes et conseil technique'
      ],
      objective: 'Révolutionner la collecte de données aériennes'
    },
    {
      title: 'Pôle Sécurité Numérique',
      description: 'Protection et sécurisation des infrastructures digitales',
      items: [
        'Cybersécurité et cryptage',
        'Audit et gestion des accès',
        'Supervision et protection des systèmes',
        'Développement d\'outils numériques sécurisés'
      ],
      objective: 'Sécuriser l\'écosystème numérique africain'
    },
    {
      title: 'Pôle Santé',
      description: 'Santé connectée et accessible pour tous',
      items: [
        'Cabines médicales connectées',
        'Capteurs médicaux de dernière génération',
        'Consultation à distance via webcam',
        'Plateforme médicale intégrée'
      ],
      objective: 'Démocratiser l\'accès aux soins de qualité'
    }
  ];

  return (
    <div className="apropos-page">
      {/* Hero Section */}
      <section className="apropos-hero">
        <div className="apropos-hero-content">
          <h1>QUI SOMMES-NOUS</h1>
          <p className="hero-subtitle">
            CIPS – Conception Innovante pour la Sécurité
          </p>
        </div>
      </section>

      {/* Présentation Section */}
      <section className="apropos-presentation section">
        <div className="container">
          <div className="presentation-content">
            <h2>Notre Entreprise</h2>
            <p className="lead-text">
              CIPS est une entreprise pluridisciplinaire africaine dédiée à la création de solutions 
              technologiques innovantes au service de la sécurité, de l'énergie, de la santé et de la 
              transformation numérique.
            </p>
            <p>
              Basé au Gabon, nous développons des solutions technologiques pour répondre aux défis 
              énergétiques, numériques, environnementaux et sanitaires de l'Afrique. Notre expertise 
              combine innovation technologique et connaissance approfondie des réalités du continent.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="apropos-mission-vision">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <h3>Notre Mission</h3>
              <p>
                Développer des technologies durables et accessibles qui répondent aux besoins concrets 
                des populations et des organisations en Afrique. Nous mettons l'innovation au service 
                du développement et de la sécurité du continent.
              </p>
            </div>
            <div className="vision-card">
              <h3>Notre Vision</h3>
              <p>
                Faire de CIPS un acteur de référence de la sécurité globale et du développement 
                durable, en combinant innovation, impact social et expertise technique. Devenir le groupe 
                africain leader de la transformation technologique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Domaines d'expertise */}
      <section className="apropos-expertise section">
        <div className="container">
          <h2>Nos Domaines d'Expertise</h2>
          <p className="section-intro">
            CIPS intervient à travers 5 pôles d'activité complémentaires, 
            chacun apportant des solutions concrètes aux défis africains.
          </p>
          <div className="expertise-poles">
            {poles.map((pole, index) => (
              <div key={index} className="pole-card">
                <h3>{pole.title}</h3>
                <p className="pole-description">{pole.description}</p>
                <ul className="pole-items">
                  {pole.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p className="pole-objective">
                  <strong>Objectif :</strong> {pole.objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="apropos-values">
        <div className="container">
          <h2>Nos Valeurs</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires & Certifications */}
      <section className="apropos-partners section">
        <div className="container">
          <div className="partners-header">
            <h2>Nos Partenaires Stratégiques</h2>
            <p className="partners-intro">
              CIPS s'appuie sur des partenariats solides avec des leaders mondiaux 
              pour offrir à ses clients les meilleures technologies et solutions.
            </p>
          </div>
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-logo-wrapper">
                <div className="partner-logo-bg"></div>
                <img 
                  src="/partenaires/logo SUN X.jpg" 
                  alt="SUN X - Partenaire énergie solaire" 
                  className="partner-logo"
                />
              </div>
              <div className="partner-content">
                <h3>SUN X</h3>
                <p className="partner-category">Énergie Solaire</p>
                <p className="partner-description">
                  Leader mondial des solutions solaires intelligentes. Partenaire privilégié 
                  pour la distribution de panneaux photovoltaïques haute performance, onduleurs 
                  hybrides et systèmes de monitoring en temps réel.
                </p>
                <div className="partner-benefits">
                  <span className="benefit-tag">Technologie de pointe</span>
                  <span className="benefit-tag">Garantie 25 ans</span>
                </div>
              </div>
            </div>

            <div className="partner-card">
              <div className="partner-logo-wrapper">
                <div className="partner-logo-bg"></div>
                <img 
                  src="/partenaires/pegasus.jpg" 
                  alt="Pegasus - Partenaire drones" 
                  className="partner-logo"
                />
              </div>
              <div className="partner-content">
                <h3>Pegasus</h3>
                <p className="partner-category">Solutions Drones</p>
                <p className="partner-description">
                  Expert reconnu dans le domaine des drones professionnels et des solutions 
                  aériennes innovantes. Partenaire technique pour nos services ODS, formations 
                  et certifications drone.
                </p>
                <div className="partner-benefits">
                  <span className="benefit-tag">Expertise technique</span>
                  <span className="benefit-tag">Formations certifiées</span>
                </div>
              </div>
            </div>

            <div className="partner-card">
              <div className="partner-logo-wrapper">
                <div className="partner-logo-bg"></div>
                <img 
                  src="/partenaires/logo-gi-energy.png" 
                  alt="GI Energie - Partenaire énergie" 
                  className="partner-logo"
                />
              </div>
              <div className="partner-content">
                <h3>GI Energie</h3>
                <p className="partner-category">Solutions Énergétiques</p>
                <p className="partner-description">
                  Spécialiste des solutions énergétiques durables et des équipements de qualité. 
                  Partenaire pour la fourniture de groupes électrogènes, transformateurs et 
                  systèmes d'énergie de secours.
                </p>
                <div className="partner-benefits">
                  <span className="benefit-tag">Qualité premium</span>
                  <span className="benefit-tag">Support local</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Ambition */}
      <section className="apropos-ambition section">
        <div className="container">
          <div className="ambition-content">
            <h2>Notre Ambition</h2>
            <blockquote>
              « Devenir le groupe africain de référence en matière de sécurité intégrée, 
              d'énergie durable, de santé connectée et de données intelligentes. »
            </blockquote>
            <p>
              Nous ambitionnons de devenir un acteur panafricain de la sécurité globale et de la 
              transition technologique, en déployant nos solutions dans toute l'Afrique centrale 
              et au-delà. Notre objectif est de contribuer significativement au développement 
              durable du continent en apportant des réponses technologiques adaptées, accessibles 
              et performantes.
            </p>
          </div>
        </div>
      </section>

      {/* Couverture géographique */}
      <section className="apropos-coverage">
        <div className="container">
          <h2>Notre Couverture Géographique</h2>
          <div className="coverage-content">
            <div className="coverage-map">
              <AfricaMap />
            </div>
            <div className="coverage-text">
              <h3>Présence et Expansion</h3>
              <p>
                Basés au Gabon, nous sommes idéalement positionnés pour servir l'ensemble de 
                l'Afrique centrale. Notre ambition est de nous étendre progressivement à 
                l'ensemble du continent africain.
              </p>
              <ul>
                <li><strong>Siège :</strong> Libreville, Gabon</li>
                <li><strong>Zone actuelle :</strong> Gabon et Afrique Centrale</li>
                <li><strong>Expansion prévue :</strong> Afrique de l'Ouest et de l'Est</li>
                <li><strong>Vision :</strong> Couverture panafricaine</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="apropos-cta section">
        <div className="container">
          <div className="apropos-cta-content">
            <h2>Rejoignez-nous dans cette aventure</h2>
            <p>Ensemble, construisons l'Afrique de demain avec des solutions technologiques innovantes</p>
            <div className="apropos-cta-buttons">
              <a href="/poles" className="btn btn-primary">Découvrir nos pôles</a>
              <a href="/contact" className="btn btn-secondary">Nous contacter</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APropos;
