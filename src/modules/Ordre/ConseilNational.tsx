import { useEffect, useMemo, useState } from 'react';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './ConseilNationalPremium.css';

interface ConseilMember {
  id: string;
  name: string;
  photo: string;
  role: 'Présidente' | 'Secrétaire' | 'Conseiller';
  section: string;
  mission: string;
}

const conseilMembersBase: ConseilMember[] = [
  {
    id: '1',
    name: 'Dr Patience Asseko NTOGONO OKE',
    photo: 'https://res.cloudinary.com/dduvinjnu/image/upload/v1772385445/pnbqq9jnq8rm0cpvqnj2.jpg',
    role: 'Présidente',
    section: 'Gouvernance',
    mission: 'Pilotage stratégique de l’Ordre et représentation institutionnelle.'
  },
  {
    id: '2',
    name: 'Dr Jean Martin',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=520&h=520&fit=crop&crop=face',
    role: 'Secrétaire',
    section: 'Administration',
    mission: 'Coordination administrative, suivi des décisions et archives du Conseil.'
  },
  {
    id: '3',
    name: 'Dr Sophie Bernard',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=520&h=520&fit=crop&crop=face',
    role: 'Conseiller',
    section: 'Section A',
    mission: 'Appui aux orientations techniques et représentation des officinaux.'
  },
  {
    id: '4',
    name: 'Dr Michel Dubois',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=520&h=520&fit=crop&crop=face',
    role: 'Conseiller',
    section: 'Section B',
    mission: 'Suivi des dossiers scientifiques et enjeux de biologie médicale.'
  },
  {
    id: '5',
    name: 'Dr Nathalie Petit',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=520&h=520&fit=crop&crop=face',
    role: 'Conseiller',
    section: 'Section C',
    mission: 'Contribution aux politiques publiques et coordination institutionnelle.'
  },
  {
    id: '6',
    name: 'Dr Antoine Leroy',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=520&h=520&fit=crop&crop=face',
    role: 'Conseiller',
    section: 'Section D',
    mission: 'Veille sur l’industrie et la chaîne de distribution pharmaceutique.'
  }
];

type RoleFilter = 'Tous' | 'Présidence' | 'Secrétariat' | 'Conseillers';

const ConseilNational = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('Tous');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMemberId(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const conseilMembers = conseilMembersBase;

  const stats = useMemo(
    () => ({
      totalMembers: conseilMembers.length,
      presidents: conseilMembers.filter((m) => m.role === 'Présidente').length,
      conseillers: conseilMembers.filter((m) => m.role === 'Conseiller').length
    }),
    []
  );

  const filteredMembers = useMemo(() => {
    switch (roleFilter) {
      case 'Présidence':
        return conseilMembers.filter((m) => m.role === 'Présidente');
      case 'Secrétariat':
        return conseilMembers.filter((m) => m.role === 'Secrétaire');
      case 'Conseillers':
        return conseilMembers.filter((m) => m.role === 'Conseiller');
      default:
        return conseilMembers;
    }
  }, [roleFilter]);

  const selectedMember = useMemo(
    () => conseilMembers.find((m) => m.id === selectedMemberId) || null,
    [selectedMemberId, conseilMembers]
  );

  return (
    <div className="ordre-page conseil-premium-page">
      <section className="cn-hero" aria-labelledby="cn-title">
        <div className="cn-container">
          <span className="cn-eyebrow">Gouvernance ONPG</span>
          <h1 id="cn-title" className="cn-title">Conseil National</h1>
          <p className="cn-lead">
            Instance de gouvernance stratégique de l’Ordre National des Pharmaciens du Gabon.
          </p>

          <div className="cn-kpi-grid">
            <article className="cn-kpi-card">
              <strong>{stats.totalMembers}</strong>
              <span>Membres</span>
            </article>
            <article className="cn-kpi-card">
              <strong>{stats.presidents}</strong>
              <span>Présidence</span>
            </article>
            <article className="cn-kpi-card">
              <strong>{stats.conseillers}</strong>
              <span>Conseillers</span>
            </article>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-container">
          <header className="cn-section-header">
            <h2>Membres du Conseil</h2>
            <p>Composition actuelle du Conseil National, avec rôles et champs de contribution.</p>
          </header>

          <div className="cn-filter-row" role="group" aria-label="Filtrer par rôle">
            {(['Tous', 'Présidence', 'Secrétariat', 'Conseillers'] as RoleFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                className={`cn-filter-chip ${roleFilter === filter ? 'is-active' : ''}`}
                onClick={() => setRoleFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="cn-grid">
            {filteredMembers.map((member) => (
              <article
                key={member.id}
                className={`cn-card ${member.role === 'Présidente' ? 'is-president' : ''}`}
                onClick={() => setSelectedMemberId(member.id)}
              >
                <div className="cn-card-photo-wrap">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="cn-card-photo"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                    }}
                  />
                </div>
                <h3>{member.name}</h3>
                <span className={`cn-role-badge role-${member.role.toLowerCase()}`}>{member.role}</span>
                <p className="cn-card-section">{member.section}</p>
              </article>
            ))}
          </div>

          <div className="cn-trust-strip">
            <div className="cn-trust-item">
              <span>Source</span>
              <strong>Ordre National des Pharmaciens du Gabon</strong>
            </div>
            <div className="cn-trust-item">
              <span>Dernière mise à jour</span>
              <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
            </div>
          </div>
        </div>
      </section>

      {selectedMember && (
        <div className="cn-modal-overlay" onClick={() => setSelectedMemberId(null)} role="presentation">
          <div className="cn-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="cn-modal-close" onClick={() => setSelectedMemberId(null)} aria-label="Fermer">
              ×
            </button>
            <img
              src={selectedMember.photo}
              alt={selectedMember.name}
              className="cn-modal-photo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
              }}
            />
            <h2>{selectedMember.name}</h2>
            <span className={`cn-role-badge role-${selectedMember.role.toLowerCase()}`}>{selectedMember.role}</span>
            <p className="cn-modal-section"><strong>Périmètre:</strong> {selectedMember.section}</p>
            <p className="cn-modal-mission"><strong>Mission:</strong> {selectedMember.mission}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConseilNational;
