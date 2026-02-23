import { useState, useMemo } from 'react';
import './ConseilNational.css';

interface ConseilMember {
  id: string;
  name: string;
  photo: string;
  role: string;
}

const conseilMembers: ConseilMember[] = [
  {
    id: '1',
    name: 'Dr Patience Asseko NTOGONO OKE',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    role: 'Présidente'
  },
  {
    id: '2',
    name: 'Dr. Jean Martin',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'Secrétaire'
  },
  {
    id: '3',
    name: 'Dr. Sophie Bernard',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    role: 'Conseiller'
  },
  {
    id: '4',
    name: 'Dr. Michel Dubois',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    role: 'Conseiller'
  },
  {
    id: '5',
    name: 'Dr. Nathalie Petit',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    role: 'Conseiller'
  },
  {
    id: '6',
    name: 'Dr. Antoine Leroy',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    role: 'Conseiller'
  }
];

const ConseilNational = () => {
  const [selectedMember, setSelectedMember] = useState<ConseilMember | null>(null);

  const stats = useMemo(() => ({
    totalMembers: conseilMembers.length,
    presidents: conseilMembers.filter(m => m.role === 'Présidente' || m.role === 'Président').length,
    conseillers: conseilMembers.filter(m => m.role === 'Conseiller').length
  }), []);

  return (
    <div className="ordre-page">
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Conseil</span>
              <span className="hero-title-subtitle">National</span>
            </h1>
            <p className="hero-description">
              Découvrez les membres du Conseil National de l&apos;ONPG.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalMembers}</div>
              <div className="stat-label">Membres</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.presidents}</div>
              <div className="stat-label">Présidence</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.conseillers}</div>
              <div className="stat-label">Conseillers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="conseil-members-section">
        <div className="section-container">
          <div className="conseil-members-grid">
            {conseilMembers.map((member) => (
              <div
                key={member.id}
                className={`conseil-member-card ${member.role === 'Présidente' || member.role === 'Président' ? 'president' : ''}`}
                onClick={() => setSelectedMember(member)}
              >
                <div className="conseil-member-photo-wrapper">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="conseil-member-photo"
                  />
                </div>
                <h3 className="conseil-member-name">{member.name}</h3>
                <div className={`conseil-member-role ${member.role === 'Présidente' || member.role === 'Président' ? 'role-president' : 'role-conseiller'}`}>
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de détail */}
      {selectedMember && (
        <div
          className="conseil-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="conseil-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="conseil-modal-close"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>
            <img
              src={selectedMember.photo}
              alt={selectedMember.name}
              className="conseil-modal-photo"
            />
            <h2 className="conseil-modal-name">{selectedMember.name}</h2>
            <div className={`conseil-modal-role ${selectedMember.role === 'Présidente' || selectedMember.role === 'Président' ? 'role-president' : 'role-conseiller'}`}>
              {selectedMember.role}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConseilNational;
