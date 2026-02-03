import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les instances
interface Instance {
  id: string;
  name: string;
  type: 'gouvernance' | 'executif' | 'disciplinaire' | 'technique';
  description: string;
  president: string;
  members: number;
  attributions: string[];
  reunions: string;
  icon: string;
  color: string;
  composition: string[];
}

interface Member {
  id: string;
  name: string;
  role: string;
  section: string;
  photo: string;
  mandate: string;
}

// Données fictives des instances
const instances: Instance[] = [
  {
    id: 'conseil-national',
    name: 'Conseil National',
    type: 'gouvernance',
    description: 'Instance suprême de l\'Ordre, composée de 25 membres élus, chargée de définir la politique générale et d\'adopter les décisions majeures.',
    president: 'Dr. Alain Moreau',
    members: 25,
    attributions: [
      'Définition de la politique générale de l\'Ordre',
      'Adoption du budget et des comptes',
      'Élection du Président et du Bureau',
      'Approbation des textes réglementaires'
    ],
    reunions: 'Trimestrielles',
    icon: '🏛️',
    color: '#00A651',
    composition: ['Président', 'Vice-Présidents', 'Secrétaire Général', 'Trésorier', 'Membres élus']
  },
  {
    id: 'bureau-executif',
    name: 'Bureau Exécutif',
    type: 'executif',
    description: 'Organe exécutif chargé de la mise en œuvre des décisions du Conseil National et de la gestion quotidienne de l\'Ordre.',
    president: 'Dr. Alain Moreau',
    members: 7,
    attributions: [
      'Exécution des décisions du Conseil National',
      'Gestion administrative et financière',
      'Représentation de l\'Ordre',
      'Préparation des travaux du Conseil'
    ],
    reunions: 'Mensuelles',
    icon: '⚡',
    color: '#008F45',
    composition: ['Président', 'Vice-Président', 'Secrétaire Général', 'Trésorier', '3 Membres']
  },
  {
    id: 'chambre-disciplinaire',
    name: 'Chambre Disciplinaire',
    type: 'disciplinaire',
    description: 'Jurisdiction disciplinaire chargée de l\'instruction et du jugement des manquements déontologiques.',
    president: 'Dr. Isabelle Thomas',
    members: 9,
    attributions: [
      'Instruction des plaintes disciplinaires',
      'Jugement des manquements déontologiques',
      'Prononcé des sanctions',
      'Protection de l\'intérêt public'
    ],
    reunions: 'Selon les besoins',
    icon: '⚖️',
    color: '#e74c3c',
    composition: ['Président', 'Vice-Président', '6 Membres', 'Rapporteur']
  },
  {
    id: 'commission-deontologie',
    name: 'Commission de Déontologie',
    type: 'technique',
    description: 'Commission spécialisée chargée de veiller au respect du code de déontologie et de proposer des évolutions.',
    president: 'Pr. Michel Dubois',
    members: 5,
    attributions: [
      'Contrôle du respect du code de déontologie',
      'Proposition d\'évolutions déontologiques',
      'Formation en déontologie',
      'Conseil aux instances disciplinaires'
    ],
    reunions: 'Bimestrielles',
    icon: '🛡️',
    color: '#2ECC71',
    composition: ['Président', '4 Membres experts']
  }
];

// Membres du Bureau Exécutif
const bureauMembers: Member[] = [
  {
    id: '1',
    name: 'Dr. Alain Moreau',
    role: 'Président',
    section: 'Section A',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    mandate: '2023-2026'
  },
  {
    id: '2',
    name: 'Dr. Marie Dubois',
    role: 'Vice-Président',
    section: 'Section A',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    mandate: '2023-2026'
  },
  {
    id: '3',
    name: 'Dr. Jean Martin',
    role: 'Secrétaire Général',
    section: 'Section C',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    mandate: '2023-2026'
  },
  {
    id: '4',
    name: 'Dr. Sophie Bernard',
    role: 'Trésorier',
    section: 'Section B',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    mandate: '2023-2026'
  }
];

const Instance = () => {
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [activeTab, setActiveTab] = useState('instances');

  const stats = useMemo(() => ({
    totalInstances: instances.length,
    totalMembers: instances.reduce((sum, instance) => sum + instance.members, 0),
    governanceInstances: instances.filter(i => i.type === 'gouvernance').length,
    executiveMembers: instances.find(i => i.type === 'executif')?.members || 0
  }), []);

  const openInstanceDetail = (instance: Instance) => {
    setSelectedInstance(instance);
  };

  const closeInstanceDetail = () => {
    setSelectedInstance(null);
  };

  const getInstanceTypeLabel = (type: Instance['type']) => {
    const labels = {
      'gouvernance': 'Gouvernance',
      'executif': 'Exécutif',
      'disciplinaire': 'Disciplinaire',
      'technique': 'Technique'
    };
    return labels[type];
  };

  return (
    <div className="ordre-page">
      {/* Hero Section */}
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Nos</span>
              <span className="hero-title-subtitle">Instances</span>
            </h1>
            <p className="hero-description">
              Découvrez les organes de gouvernance et de direction de l'ONPG.
              Des instances démocratiques au service de la profession pharmaceutique.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏛️ Gouvernance démocratique</span>
              <span className="highlight-item">⚖️ Justice et équité</span>
              <span className="highlight-item">🎯 Transparence totale</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalInstances}</div>
              <div className="stat-label">Instances</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalMembers}</div>
              <div className="stat-label">Membres</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.governanceInstances}</div>
              <div className="stat-label">Gouvernance</div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Navigation par onglets */}
      <div className="instance-tabs">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'instances' ? 'active' : ''}`}
            onClick={() => setActiveTab('instances')}
          >
            🏛️ Instances
          </button>
          <button
            className={`tab-btn ${activeTab === 'bureau' ? 'active' : ''}`}
            onClick={() => setActiveTab('bureau')}
          >
            👥 Bureau Exécutif
          </button>
          <button
            className={`tab-btn ${activeTab === 'organisation' ? 'active' : ''}`}
            onClick={() => setActiveTab('organisation')}
          >
            📊 Organisation
          </button>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'instances' && (
        <section className="instances-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">🏛️</span>
                Instances de l'ONPG
              </h2>
              <p className="section-subtitle">
                Les organes de décision et d'exécution de l'Ordre National des Pharmaciens du Gabon
              </p>
            </div>

            <div className="instances-grid">
              {instances.map((instance, index) => (
                <div
                  key={instance.id}
                  className="instance-card"
                  onClick={() => openInstanceDetail(instance)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="instance-header">
                    <div
                      className="instance-icon"
                      style={{ backgroundColor: instance.color }}
                    >
                      {instance.icon}
                    </div>
                    <div className="instance-type">
                      {getInstanceTypeLabel(instance.type)}
                    </div>
                  </div>

                  <div className="instance-content">
                    <h3 className="instance-title">{instance.name}</h3>
                    <p className="instance-description">{instance.description}</p>

                    <div className="instance-info">
                      <div className="info-item">
                        <span className="info-label">Président:</span>
                        <span className="info-value">{instance.president}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Membres:</span>
                        <span className="info-value">{instance.members}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Réunions:</span>
                        <span className="info-value">{instance.reunions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="instance-actions">
                    <button className="instance-btn">
                      En savoir plus →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'bureau' && (
        <section className="bureau-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">👥</span>
                Bureau Exécutif 2023-2026
              </h2>
              <p className="section-subtitle">
                L'équipe dirigeante élue pour assurer la gestion quotidienne de l'ONPG
              </p>
            </div>

            <div className="bureau-grid">
              {bureauMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="member-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="member-photo">
                    <img src={member.photo} alt={member.name} />
                    <div className="member-overlay">
                      <span className="mandate-badge">{member.mandate}</span>
                    </div>
                  </div>

                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-role">{member.role}</div>
                    <div className="member-section">Section {member.section}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'organisation' && (
        <section className="organisation-detail-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">📊</span>
                Organisation Institutionnelle
              </h2>
              <p className="section-subtitle">
                Structure hiérarchique et fonctionnement des instances de l'ONPG
              </p>
            </div>

            <div className="organisation-diagram">
              <div className="org-level conseil">
                <div className="org-box">
                  <h3>Conseil National</h3>
                  <p>25 membres élus</p>
                  <p>Instance suprême</p>
                </div>
              </div>

              <div className="org-connector">↓</div>

              <div className="org-level bureau">
                <div className="org-box">
                  <h3>Bureau Exécutif</h3>
                  <p>7 membres</p>
                  <p>Organe exécutif</p>
                </div>
              </div>

              <div className="org-connector">↓</div>

              <div className="org-level commissions">
                <div className="org-box commission-box">
                  <h3>Commissions</h3>
          <div className="commission-list">
            <span>Commission de Déontologie</span>
            <span>Commission de Formation</span>
            <span>Commission de Tarification</span>
            <span>Autres commissions spécialisées</span>
          </div>
        </div>
      </div>

              <div className="org-connector">↓</div>

              <div className="org-level membres">
                <div className="org-box">
                  <h3>Membres</h3>
                  <p>1200+ pharmaciens</p>
                  <p>4 sections professionnelles</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal de détail d'instance */}
      {selectedInstance && (
        <div className="instance-modal-overlay" onClick={closeInstanceDetail}>
          <div className="instance-modal-content" onClick={e => e.stopPropagation()}>
            <button className="instance-modal-close" onClick={closeInstanceDetail}>✕</button>

            <div className="instance-modal-header">
              <div
                className="instance-modal-icon"
                style={{ backgroundColor: selectedInstance.color }}
              >
                {selectedInstance.icon}
              </div>
              <div className="instance-modal-info">
                <h2>{selectedInstance.name}</h2>
                <div className="instance-type-badge">
                  {getInstanceTypeLabel(selectedInstance.type)}
                </div>
              </div>
            </div>

            <div className="instance-modal-body">
              <div className="instance-description">
                <h3>Description</h3>
                <p>{selectedInstance.description}</p>
              </div>

              <div className="instance-details">
                <div className="detail-section">
                  <h4>Composition</h4>
                  <ul>
                    {selectedInstance.composition.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Attributions</h4>
                  <ul>
                    {selectedInstance.attributions.map((attribution, index) => (
                      <li key={index}>{attribution}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Informations pratiques</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Président:</strong> {selectedInstance.president}
                    </div>
                    <div className="info-item">
                      <strong>Membres:</strong> {selectedInstance.members}
                    </div>
                    <div className="info-item">
                      <strong>Réunions:</strong> {selectedInstance.reunions}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instance;

