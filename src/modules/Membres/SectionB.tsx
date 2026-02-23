import React, { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { ProfileImage } from '../../components/ProfileImage';
import './SectionB.css';

interface Pharmacien {
  _id?: string;
  nom: string;
  prenom: string;
  section?: string;
  photo?: string;
  role?: string;
  these?: string;
}

const mockPharmaciens: Pharmacien[] = [
  {
    _id: 'mock1',
    nom: 'Dubois',
    prenom: 'Pierre',
    section: 'B',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    role: 'Biologiste médical',
    these: 'Thèse sur la biologie clinique'
  },
  {
    _id: 'mock2',
    nom: 'Petit',
    prenom: 'Nathalie',
    section: 'B',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    role: 'Biologiste médical',
    these: 'Thèse sur les analyses médicales'
  }
];

const SectionB = () => {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPharmaciens = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('pharmaciens');
        if (Array.isArray(data)) {
          const sectionB = data.filter((p: any) => p.section === 'B' && p.isActive !== false);
          if (sectionB.length > 0) {
            setPharmaciens(
              sectionB.map((p: any) => ({
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
            setPharmaciens(mockPharmaciens);
          }
        } else {
          setPharmaciens(mockPharmaciens);
        }
      } catch (error) {
        console.error('Erreur chargement pharmaciens:', error);
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
      <section className="membres-hero section-b-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section B</span>
              <span className="hero-title-subtitle">Biologistes</span>
            </h1>
            <p className="hero-description">
              Pharmaciens biologistes spécialisés dans les analyses médicales.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{pharmaciens.length}</div>
              <div className="stat-label">Biologistes</div>
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
            />
          </div>
        </div>
      </div>

      <section className="section-b-content">
        <div className="section-container">
          {loading ? (
            <div className="loading-state">Chargement...</div>
          ) : filteredPharmaciens.length === 0 ? (
            <div className="empty-state">Aucun pharmacien trouvé</div>
          ) : (
            <div className="pharmaciens-grid">
              {filteredPharmaciens.map((pharmacien) => (
                <div
                  key={pharmacien._id}
                  className="pharmacien-card"
                >
                  <ProfileImage
                    src={pharmacien.photo}
                    alt={`${pharmacien.prenom} ${pharmacien.nom}`}
                    borderColor="#3498db"
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

export default SectionB;
