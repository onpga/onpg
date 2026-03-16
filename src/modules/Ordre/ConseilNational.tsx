import { useEffect, useMemo, useState } from 'react';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './ConseilNationalPremium.css';

type CouncilRoleType = 'bureau' | 'conseiller';
type DisplayGroup = 'presidence' | 'bureau-principal' | 'bureau-adjoint' | 'conseillers';

interface ConseilMember {
  id: string;
  name: string;
  pharmacienId: string;
  photo: string;
  roleLabel: string;
  roleType: CouncilRoleType;
  section: string;
  mission: string;
  order: number;
}

const normalizeForMatch = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const isTresorier = (r: string, rNorm: string) =>
  rNorm.includes('tresorier') ||
  rNorm.includes('tresoriere') ||
  r.includes('trésorier') ||
  r.includes('trésorière') ||
  r.includes('trésoriére') ||
  r.includes('tresorier') ||
  r.includes('tresoriere') ||
  /tr[eéèê]sori[eéèê]r[e]?/.test(r);

const getDisplayGroup = (roleLabel: string): DisplayGroup => {
  const r = roleLabel.toLowerCase().trim();
  const rNorm = normalizeForMatch(roleLabel);
  if (r.includes('présidente') || r.includes('président') || rNorm.includes('presidente') || rNorm.includes('president'))
    return 'presidence';
  if ((rNorm.includes('secretaire') || isTresorier(r, rNorm)) && r.includes('adjoint')) return 'bureau-adjoint';
  if (rNorm.includes('secretaire') || r.includes('vice-président') || rNorm.includes('vice-president'))
    return 'bureau-principal';
  if (isTresorier(r, rNorm)) return 'bureau-principal';
  return 'conseillers';
};

interface PharmacienPublic {
  id: string;
  photo: string;
}

const defaultCouncilMembers = (presidentPhoto: string): ConseilMember[] => [
  {
    id: 'council-1',
    name: 'Dr Patience Asseko NTOGONO OKE',
    pharmacienId: '',
    photo: presidentPhoto || ONPG_IMAGES.president,
    roleLabel: 'Présidente',
    roleType: 'bureau',
    section: 'Gouvernance',
    mission: 'Pilotage stratégique et représentation institutionnelle.',
    order: 1
  },
  {
    id: 'council-2',
    name: '',
    pharmacienId: '',
    photo: '',
    roleLabel: 'Secrétaire général',
    roleType: 'bureau',
    section: 'Bureau',
    mission: '',
    order: 2
  },
  {
    id: 'council-3',
    name: '',
    pharmacienId: '',
    photo: '',
    roleLabel: 'Vice-président',
    roleType: 'bureau',
    section: 'Bureau',
    mission: '',
    order: 3
  },
  {
    id: 'council-4',
    name: '',
    pharmacienId: '',
    photo: '',
    roleLabel: 'Trésorier général',
    roleType: 'bureau',
    section: 'Bureau',
    mission: '',
    order: 4
  },
  {
    id: 'council-5',
    name: '',
    pharmacienId: '',
    photo: '',
    roleLabel: 'Secrétaire général adjoint',
    roleType: 'bureau',
    section: 'Bureau',
    mission: '',
    order: 5
  },
  {
    id: 'council-6',
    name: '',
    pharmacienId: '',
    photo: '',
    roleLabel: 'Trésorier général adjoint',
    roleType: 'bureau',
    section: 'Bureau',
    mission: '',
    order: 6
  },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `council-${index + 7}`,
    name: '',
    pharmacienId: '',
    photo: '',
    roleLabel: `Membre conseiller ${index + 1}`,
    roleType: 'conseiller' as CouncilRoleType,
    section: 'Conseil',
    mission: '',
    order: index + 7
  }))
];

const normalizeMembers = (rawMembers: any[], presidentPhoto: string): ConseilMember[] => {
  if (!Array.isArray(rawMembers) || rawMembers.length === 0) {
    return defaultCouncilMembers(presidentPhoto);
  }

  const mapped = rawMembers
    .map((member, index) => ({
      id: typeof member?.id === 'string' && member.id.trim() ? member.id : `council-${index + 1}`,
      name: typeof member?.fullName === 'string' ? member.fullName : '',
      pharmacienId: typeof member?.pharmacienId === 'string' ? member.pharmacienId : '',
      photo: typeof member?.photo === 'string' ? member.photo : '',
      roleLabel: typeof member?.roleLabel === 'string' ? member.roleLabel : 'Membre du conseil',
      roleType: (member?.roleType === 'conseiller' ? 'conseiller' : 'bureau') as CouncilRoleType,
      section: typeof member?.section === 'string' ? member.section : '',
      mission: typeof member?.mission === 'string' ? member.mission : '',
      order: Number.isFinite(Number(member?.order)) ? Number(member.order) : index + 1
    }))
    .sort((a, b) => a.order - b.order);

  if (mapped.length === 0) return defaultCouncilMembers(presidentPhoto);
  return mapped;
};

const ConseilNational = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [members, setMembers] = useState<ConseilMember[]>(defaultCouncilMembers(ONPG_IMAGES.president));
  const [pharmaciens, setPharmaciens] = useState<PharmacienPublic[]>([]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMemberId(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL ||
          (import.meta.env.PROD
            ? 'https://backendonpg-production.up.railway.app/api'
            : 'http://localhost:3001/api');

        const response = await fetch(`${API_URL}/public/site-settings`);
        if (!response.ok) return;

        const data = await response.json();
        if (!data?.success) return;

        const nextPhoto = data?.data?.presidentPhoto || ONPG_IMAGES.president;
        const nextMembers = normalizeMembers(data?.data?.councilMembers || [], nextPhoto);
        setMembers(nextMembers);

        try {
          const pharmaciensResponse = await fetch(`${API_URL}/public/pharmaciens`);
          if (pharmaciensResponse.ok) {
            const pharmaciensData = await pharmaciensResponse.json();
            if (pharmaciensData?.success && Array.isArray(pharmaciensData?.data)) {
              setPharmaciens(
                pharmaciensData.data.map((p: any) => ({
                  id: String(p._id || ''),
                  photo: String(p.photo || '')
                }))
              );
            }
          }
        } catch {
          // silencieux: fallback photo membre.
        }
      } catch {
        // Garder le fallback local en cas d'erreur.
      }
    };

    loadSettings();
  }, []);

  const pharmaciensById = useMemo(
    () => new Map(pharmaciens.map((p) => [p.id, p])),
    [pharmaciens]
  );

  const conseilMembers = useMemo(
    () =>
      [...members]
        .sort((a, b) => a.order - b.order)
        .map((member) => {
          if (!member.pharmacienId) return member;
          const linked = pharmaciensById.get(member.pharmacienId);
          if (linked?.photo) {
            return { ...member, photo: linked.photo };
          }
          return member;
        }),
    [members, pharmaciensById]
  );

  const stats = useMemo(
    () => ({
      totalMembers: conseilMembers.length,
      bureau: conseilMembers.filter((m) => m.roleType === 'bureau').length,
      conseillers: conseilMembers.filter((m) => m.roleType === 'conseiller').length
    }),
    [conseilMembers]
  );

  const groupedMembers = useMemo(() => {
    const groups: Record<DisplayGroup, ConseilMember[]> = {
      presidence: [],
      'bureau-principal': [],
      'bureau-adjoint': [],
      conseillers: []
    };
    for (const m of conseilMembers) {
      const g = getDisplayGroup(m.roleLabel);
      groups[g].push(m);
    }
    for (const g of Object.keys(groups) as DisplayGroup[]) {
      groups[g].sort((a, b) => a.order - b.order);
    }
    return groups;
  }, [conseilMembers]);

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
              <strong>{stats.bureau}</strong>
              <span>Bureau</span>
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
            <h2>Composition du Conseil</h2>
            <p>Organisation du Conseil National de l&apos;ONPG</p>
          </header>

          {/* Niveau 1 — Présidence (seule, centrée) */}
          {groupedMembers.presidence.length > 0 && (
            <div className="cn-block cn-block-presidence">
              <span className="cn-level-label">Présidence</span>
              <div className="cn-row cn-row-single">
                {groupedMembers.presidence.map((member) => (
                  <article
                    key={member.id}
                    className="cn-card cn-card-presidente"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <div className="cn-card-photo-wrap cn-card-photo-large">
                      <img
                        src={member.photo}
                        alt={member.name || member.roleLabel}
                        className="cn-card-photo"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                        }}
                      />
                    </div>
                    <h3>{member.name || 'Poste à pourvoir'}</h3>
                    <span className="cn-role-badge role-bureau">{member.roleLabel}</span>
                    {member.mission && <p className="cn-card-mission">{member.mission}</p>}
                  </article>
                ))}
              </div>
              <div className="cn-flow-connector" aria-hidden="true" />
            </div>
          )}

          {/* Niveau 2 — Bureau (SG, VP, Trésorier) */}
          {groupedMembers['bureau-principal'].length > 0 && (
            <div className="cn-block cn-block-bureau">
              <span className="cn-level-label">Bureau</span>
              <div
                className={`cn-row ${
                  groupedMembers['bureau-principal'].length === 2 ? 'cn-row-two' : 'cn-row-three'
                }`}
              >
                  {groupedMembers['bureau-principal'].map((member) => (
                  <article
                    key={member.id}
                    className="cn-card cn-card-bureau"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <div className="cn-card-photo-wrap">
                      <img
                        src={member.photo}
                        alt={member.name || member.roleLabel}
                        className="cn-card-photo"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                        }}
                      />
                    </div>
                    <h3>{member.name || 'Poste à pourvoir'}</h3>
                    <span className="cn-role-badge role-bureau">{member.roleLabel}</span>
                  </article>
                ))}
              </div>
              <div className="cn-flow-connector" aria-hidden="true" />
            </div>
          )}

          {/* Niveau 3 — Bureau adjoint */}
          {groupedMembers['bureau-adjoint'].length > 0 && (
            <div className="cn-block cn-block-adjoint">
              <span className="cn-level-label">Bureau adjoint</span>
              <div className="cn-row cn-row-two">
                {groupedMembers['bureau-adjoint'].map((member) => (
                  <article
                    key={member.id}
                    className="cn-card cn-card-adjoint"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <div className="cn-card-photo-wrap">
                      <img
                        src={member.photo}
                        alt={member.name || member.roleLabel}
                        className="cn-card-photo"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                        }}
                      />
                    </div>
                    <h3>{member.name || 'Poste à pourvoir'}</h3>
                    <span className="cn-role-badge role-bureau">{member.roleLabel}</span>
                  </article>
                ))}
              </div>
              <div className="cn-flow-connector" aria-hidden="true" />
            </div>
          )}

          {/* Niveau 4 — Conseillers */}
          {groupedMembers.conseillers.length > 0 && (
            <div className="cn-block cn-block-conseillers">
              <span className="cn-level-label">Conseillers</span>
              <div className="cn-grid cn-grid-conseillers">
                {groupedMembers.conseillers.map((member) => (
                  <article
                    key={member.id}
                    className="cn-card cn-card-conseiller"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <div className="cn-card-photo-wrap">
                      <img
                        src={member.photo}
                        alt={member.name || member.roleLabel}
                        className="cn-card-photo"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                        }}
                      />
                    </div>
                    <h3>{member.name || 'Poste à pourvoir'}</h3>
                    <span className="cn-role-badge role-conseiller">{member.roleLabel}</span>
                  </article>
                ))}
              </div>
            </div>
          )}

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
              alt={selectedMember.name || selectedMember.roleLabel}
              className="cn-modal-photo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
              }}
            />
            <h2>{selectedMember.name || 'Poste à pourvoir'}</h2>
            <span className={`cn-role-badge role-${selectedMember.roleType}`}>{selectedMember.roleLabel}</span>
            <p className="cn-modal-section"><strong>Périmètre:</strong> {selectedMember.section || 'Conseil national'}</p>
            <p className="cn-modal-mission"><strong>Mission:</strong> {selectedMember.mission || 'Missions à préciser.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConseilNational;
