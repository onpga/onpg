import React, { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { ProfileImage } from '../../components/ProfileImage/ProfileImage';
import './SectionA.css';

interface Pharmacien {
  _id?: string;
  nom: string;
  prenom: string;
  section?: string;
  photo?: string;
  role?: string;
  these?: string;
}

// Mock data pour visualisation si sections vides
const mockPharmaciens: Pharmacien[] = [
  {
    _id: 'mock1',
    nom: 'Dupont',
    prenom: 'Marie',
    section: 'A',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien titulaire',
    these: 'Thèse sur la pharmacie clinique'
  },
  {
    _id: 'mock2',
    nom: 'Martin',
    prenom: 'Jean',
    section: 'A',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien adjoint',
    these: 'Thèse sur la pharmacovigilance'
  },
  {
    _id: 'mock3',
    nom: 'Bernard',
    prenom: 'Sophie',
    section: 'A',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien titulaire',
    these: 'Thèse sur la pharmacie hospitalière'
  }
];

const SectionA = () => {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPharmaciens = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('pharmaciens');
        if (Array.isArray(data)) {
          // Filtrer par section A
          const sectionA = data.filter((p: any) => p.section === 'A' && p.isActive !== false);
          if (sectionA.length > 0) {
            // Mapper explicitement les champs attendus par le type Pharmacien
            setPharmaciens(
              sectionA.map((p: any) => ({
                _id: p._id,
                nom: p.nom || '',
                prenom: p.prenom || '',
                section: p.section,
                photo: p.photo,
                role: p.role,
                these: p.these
              }))
            );
          } else {
            // Utiliser mock si aucune donnée
            setPharmaciens(mockPharmaciens);
          }
        } else {
          // Utiliser mock si aucune donnée
          setPharmaciens(mockPharmaciens);
        }
      } catch (error) {
        console.error('Erreur chargement pharmaciens:', error);
        // Utiliser mock en cas d'erreur
        setPharmaciens(mockPharmaciens);
      } finally {
        setLoading(false);
      }
    };
    loadPharmaciens();
  }, []);

  const filteredPharmaciens = pharmaciens.filter(p =>
    `${p.nom} ${p.prenom}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="membres-page">
      <section className="membres-hero section-a-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section A</span>
              <span className="hero-title-subtitle">Officinaux</span>
            </h1>
            <p className="hero-description">
              Pharmaciens titulaires d'officine. Découvrez les membres de la section A.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{pharmaciens.length}</div>
              <div className="stat-label">Pharmaciens</div>
            </div>
          </div>
        </div>
      </section>

      <div className="membres-filters">
        <div className="filters-container">
          <div className="search-section">
            <input
              type="text"
              placeholder="Rechercher par nom ou prénom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ fontSize: '1.1rem', padding: '0.75rem' }}
            />
          </div>
        </div>
      </div>

      <section className="section-a-content">
        <div className="section-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>
          ) : filteredPharmaciens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Aucun pharmacien trouvé</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              padding: '2rem 0'
            }}>
              {filteredPharmaciens.map((pharmacien) => (
                <div
                  key={pharmacien._id}
                  className="pharmacien-card"
                >
                  <ProfileImage
                    src={pharmacien.photo}
                    alt={`${pharmacien.prenom} ${pharmacien.nom}`}
                    borderColor="#00A651"
                    size={120}
                  />
                  <h3 className="pharmacien-name">
                    Dr. {pharmacien.prenom} {pharmacien.nom}
                  </h3>
                  {pharmacien.role && (
                    <p className="pharmacien-role">
                      {pharmacien.role}
                    </p>
                  )}
                  {pharmacien.these && (
                    <p className="pharmacien-these">
                      {pharmacien.these}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SectionA;
