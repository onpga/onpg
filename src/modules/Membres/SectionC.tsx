import { useState, useEffect } from 'react';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './SectionC.css';

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
    nom: 'Leroy',
    prenom: 'Antoine',
    section: 'C',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien fonctionnaire',
    these: 'Thèse sur la pharmacie publique'
  },
  {
    _id: 'mock2',
    nom: 'Moreau',
    prenom: 'Alain',
    section: 'C',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'Pharmacien fonctionnaire',
    these: 'Thèse sur la santé publique'
  }
];

const SectionC = () => {
  const [pharmaciens, setPharmaciens] = useState<Pharmacien[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPharmaciens = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('pharmaciens');
        if (Array.isArray(data)) {
          const sectionC = data.filter((p: any) => p.section === 'C' && p.isActive !== false);
          if (sectionC.length > 0) {
            setPharmaciens(
              sectionC.map((p: any) => ({
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
      <section className="membres-hero section-c-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Section C</span>
              <span className="hero-title-subtitle">Fonctionnaires</span>
            </h1>
            <p className="hero-description">
              Pharmaciens de la fonction publique exerçant dans les établissements de santé publics.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{pharmaciens.length}</div>
              <div className="stat-label">Fonctionnaires</div>
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

      <section className="section-content">
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
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img
                      src={pharmacien.photo || 'https://via.placeholder.com/150'}
                      alt={`${pharmacien.prenom} ${pharmacien.nom}`}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #e74c3c',
                        marginBottom: '0.5rem'
                      }}
                    />
                  </div>
                  <h3 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                    Dr. {pharmacien.prenom} {pharmacien.nom}
                  </h3>
                  {pharmacien.role && (
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                      {pharmacien.role}
                    </p>
                  )}
                  {pharmacien.these && (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', fontStyle: 'italic' }}>
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

export default SectionC;
