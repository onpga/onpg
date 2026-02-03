import { useState, useEffect, useMemo } from 'react';

// Types pour les membres du conseil
interface ConseilMember {
  id: string;
  name: string;
  photo: string;
  role: string;
  section: string;
  specialty: string;
  region: string;
  mandate: string;
  email: string;
  phone: string;
  experience: number;
  achievements: string[];
}

const conseilMembers: ConseilMember[] = [
  {
    id: '1',
    name: 'Dr. Alain Moreau',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    role: 'Président',
    section: 'A',
    specialty: 'Pharmacie clinique',
    region: 'Libreville',
    mandate: '2023-2026',
    email: 'president@onpg.ga',
    phone: '+241 XX XX XX XX',
    experience: 25,
    achievements: ['Prix d\'excellence ONPG 2020', 'Membre fondateur association pharmaciens']
  },
  {
    id: '2',
    name: 'Dr. Marie Dubois',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    role: 'Vice-Président',
    section: 'A',
    specialty: 'Pharmacie hospitalière',
    region: 'Libreville',
    mandate: '2023-2026',
    email: 'vice-president@onpg.ga',
    phone: '+241 XX XX XX XX',
    experience: 22,
    achievements: ['Chef de service pharmacie CHU', 'Expert OMS Afrique Centrale']
  },
  {
    id: '3',
    name: 'Dr. Jean Martin',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'Secrétaire Général',
    section: 'C',
    specialty: 'Administration pharmaceutique',
    region: 'Libreville',
    mandate: '2023-2026',
    email: 'secretaire@onpg.ga',
    phone: '+241 XX XX XX XX',
    experience: 20,
    achievements: ['Directeur général pharmacie ministère', 'Réforme système santé 2018']
  },
  {
    id: '4',
    name: 'Dr. Sophie Bernard',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    role: 'Trésorier',
    section: 'B',
    specialty: 'Biologie médicale',
    region: 'Libreville',
    mandate: '2023-2026',
    email: 'tresorier@onpg.ga',
    phone: '+241 XX XX XX XX',
    experience: 18,
    achievements: ['Prix innovation labo 2021', 'Directeur réseau labos privés']
  },
  {
    id: '5',
    name: 'Dr. Michel Dubois',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    role: 'Membre',
    section: 'A',
    specialty: 'Pharmacie officinale',
    region: 'Port-Gentil',
    mandate: '2023-2026',
    email: 'michel.dubois@onpg.ga',
    phone: '+241 XX XX XX XX',
    experience: 28,
    achievements: ['Pharmacien modèle 2019', 'Fondateur chaîne pharmacies']
  },
  {
    id: '6',
    name: 'Dr. Nathalie Petit',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    role: 'Membre',
    section: 'C',
    specialty: 'Pharmacie industrielle',
    region: 'Franceville',
    mandate: '2023-2026',
    email: 'nathalie.petit@onpg.ga',
    phone: '+241 XX XX XX XX',
    experience: 24,
    achievements: ['Directeur qualité laboratoire', 'Normes ISO certification']
  }
];

const ConseilNational = () => {
  const [selectedMember, setSelectedMember] = useState<ConseilMember | null>(null);
  const [filterSection, setFilterSection] = useState('Toutes');
  const [filterRegion, setFilterRegion] = useState('Toutes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMembers = useMemo(() => {
    return conseilMembers.filter(member => {
      const matchesSection = filterSection === 'Toutes' || member.section === filterSection;
      const matchesRegion = filterRegion === 'Toutes' || member.region === filterRegion;
      return matchesSection && matchesRegion;
    });
  }, [filterSection, filterRegion]);

  const stats = useMemo(() => ({
    totalMembers: conseilMembers.length,
    sections: [...new Set(conseilMembers.map(m => m.section))].length,
    regions: [...new Set(conseilMembers.map(m => m.region))].length,
    avgExperience: Math.round(conseilMembers.reduce((sum, m) => sum + m.experience, 0) / conseilMembers.length)
  }), []);

  const sections = [...new Set(conseilMembers.map(m => m.section))].sort();
  const regions = [...new Set(conseilMembers.map(m => m.region))].sort();

  return (
    <div className="ordre-page">
      {/* Hero Section */}
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Conseil</span>
              <span className="hero-title-subtitle">National</span>
            </h1>
            <p className="hero-description">
              Découvrez les membres élus du Conseil National de l'ONPG.
              L'instance suprême de gouvernance démocratique de la profession.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏛️ Instance suprême</span>
              <span className="highlight-item">🗳️ Membres élus</span>
              <span className="highlight-item">🎯 Décisions stratégiques</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalMembers}</div>
              <div className="stat-label">Membres</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.sections}</div>
              <div className="stat-label">Sections</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.avgExperience}</div>
              <div className="stat-label">Ans expérience</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Filtres et contrôles */}
      <div className="conseil-filters">
        <div className="filters-container">
          <div className="filter-group">
            <label>Section:</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="Toutes">Toutes les sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Région:</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="Toutes">Toutes les régions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grille
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰ Liste
            </button>
          </div>
        </div>
      </div>

      {/* Membres du conseil */}
      <section className="conseil-members-section">
        <div className="section-container">
          <div className="members-header">
            <h2 className="section-title">
              <span className="title-icon">👥</span>
              Membres du Conseil National
            </h2>
            <p className="results-count">
              {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''}
              {filterSection !== 'Toutes' && ` de la section ${filterSection}`}
              {filterRegion !== 'Toutes' && ` en ${filterRegion}`}
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="members-grid">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="member-card conseil-card"
                  onClick={() => setSelectedMember(member)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="member-photo">
                    <img src={member.photo} alt={member.name} />
                    <div className="member-role-badge">{member.role}</div>
                  </div>

                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-section">Section {member.section}</div>
                    <div className="member-specialty">{member.specialty}</div>
                    <div className="member-region">📍 {member.region}</div>
                    <div className="member-experience">{member.experience} ans d'expérience</div>
                  </div>

                  <div className="member-actions">
                    <button className="member-detail-btn">
                      Voir profil →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="members-list">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="member-list-item"
                  onClick={() => setSelectedMember(member)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="member-list-photo">
                    <img src={member.photo} alt={member.name} />
                  </div>

                  <div className="member-list-info">
                    <div className="member-list-header">
                      <h3>{member.name}</h3>
                      <span className="member-list-role">{member.role}</span>
                      <span className="member-list-section">Section {member.section}</span>
                    </div>
                    <div className="member-list-details">
                      <span>{member.specialty}</span>
                      <span>📍 {member.region}</span>
                      <span>⏱️ {member.experience} ans</span>
                    </div>
                  </div>

                  <div className="member-list-actions">
                    <button className="member-detail-btn">
                      Détails →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de détail membre */}
      {selectedMember && (
        <div className="member-modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="member-modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="member-modal-close"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>

            <div className="member-modal-header">
              <div className="member-modal-photo">
                <img src={selectedMember.photo} alt={selectedMember.name} />
              </div>
              <div className="member-modal-info">
                <h2>{selectedMember.name}</h2>
                <div className="member-modal-role">{selectedMember.role}</div>
                <div className="member-modal-section">Section {selectedMember.section}</div>
                <div className="member-modal-mandate">Mandat: {selectedMember.mandate}</div>
              </div>
            </div>

            <div className="member-modal-body">
              <div className="member-details">
                <div className="detail-section">
                  <h3>Informations professionnelles</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Spécialité:</strong> {selectedMember.specialty}
                    </div>
                    <div className="detail-item">
                      <strong>Région:</strong> {selectedMember.region}
                    </div>
                    <div className="detail-item">
                      <strong>Expérience:</strong> {selectedMember.experience} ans
                    </div>
                    <div className="detail-item">
                      <strong>Email:</strong> {selectedMember.email}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Réalisations majeures</h3>
                  <ul className="achievements-list">
                    {selectedMember.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConseilNational;

