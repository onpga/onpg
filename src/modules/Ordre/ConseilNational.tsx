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
    name: 'Dr. Marie Dupont',
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

      <section className="conseil-members-section" style={{ padding: '3rem 0' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
            padding: '2rem 0'
          }}>
            {conseilMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #00A651',
                      margin: '0 auto'
                    }}
                  />
                </div>
                <h3 style={{
                  margin: '0.5rem 0',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {member.name}
                </h3>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: member.role === 'Présidente' || member.role === 'Président' 
                    ? '#00A651' 
                    : '#3498db',
                  color: 'white',
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '0.95rem',
                  fontWeight: 'bold'
                }}>
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedMember(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              ✕
            </button>
            <img
              src={selectedMember.photo}
              alt={selectedMember.name}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #00A651',
                marginBottom: '1rem'
              }}
            />
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>{selectedMember.name}</h2>
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: selectedMember.role === 'Présidente' || selectedMember.role === 'Président'
                ? '#00A651'
                : '#3498db',
              color: 'white',
              borderRadius: '20px',
              display: 'inline-block',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              {selectedMember.role}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConseilNational;
