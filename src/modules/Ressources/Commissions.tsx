import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les commissions
interface Commission {
  id: string;
  name: string;
  description: string;
  president: string;
  members: string[];
  creationDate: string;
  category: string;
  missions: string[];
  meetings: number;
  reports: number;
  status: 'active' | 'inactive';
  featured: boolean;
}

interface Meeting {
  id: string;
  commissionId: string;
  date: string;
  title: string;
  summary: string;
  documents: string[];
}

// Données fictives de commissions
const mockCommissions: Commission[] = [
  {
    id: 'commission-deontologie',
    name: 'Commission de Déontologie',
    description: 'Commission chargée de veiller au respect des règles déontologiques par les pharmaciens',
    president: 'Dr. Marie Dubois',
    members: ['Dr. Jean Martin', 'Dr. Sophie Bernard', 'Dr. Alain Moreau', 'Dr. Claire Leroy'],
    creationDate: '2020-01-15',
    category: 'Éthique professionnelle',
    missions: [
      'Contrôle du respect du code de déontologie',
      'Instruction des plaintes déontologiques',
      'Proposition de sanctions disciplinaires',
      'Formation continue en déontologie'
    ],
    meetings: 24,
    reports: 12,
    status: 'active',
    featured: true
  },
  {
    id: 'commission-formation',
    name: 'Commission de Formation Continue',
    description: 'Commission responsable de l\'organisation et du suivi de la formation continue des pharmaciens',
    president: 'Pr. Michel Dubois',
    members: ['Dr. Pierre Leroy', 'Dr. Nathalie Petit', 'Dr. Olivier Durand'],
    creationDate: '2019-06-01',
    category: 'Formation',
    missions: [
      'Établissement du programme annuel de formation',
      'Validation des formations proposées',
      'Contrôle de l\'assiduité des pharmaciens',
      'Évaluation de la qualité des formations'
    ],
    meetings: 18,
    reports: 8,
    status: 'active',
    featured: false
  },
  {
    id: 'commission-tarification',
    name: 'Commission de Tarification',
    description: 'Commission chargée de l\'étude et de la proposition des tarifs de rémunération des pharmaciens',
    president: 'Dr. Antoine Leroy',
    members: ['Dr. Isabelle Thomas', 'Dr. Laurent Robert', 'Dr. Catherine Moreau'],
    creationDate: '2021-03-10',
    category: 'Économique',
    missions: [
      'Analyse des coûts de revient',
      'Proposition d\'évolution des tarifs',
      'Négociation avec les partenaires',
      'Suivi des indicateurs économiques'
    ],
    meetings: 15,
    reports: 6,
    status: 'active',
    featured: false
  }
];

const Commissions = () => {
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>(mockCommissions);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const commissionsPerPage = 6;

  useEffect(() => {
    let filtered = commissions.filter(commission => {
      const matchesSearch = commission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           commission.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Toutes' || commission.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    setFilteredCommissions(filtered);
    setCurrentPage(1);
  }, [commissions, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredCommissions.length / commissionsPerPage);
  const currentCommissions = filteredCommissions.slice((currentPage - 1) * commissionsPerPage, currentPage * commissionsPerPage);

  const stats = useMemo(() => ({
    totalCommissions: commissions.length,
    activeCommissions: commissions.filter(c => c.status === 'active').length,
    totalMeetings: commissions.reduce((sum, c) => sum + c.meetings, 0),
    totalReports: commissions.reduce((sum, c) => sum + c.reports, 0)
  }), [commissions]);

  return (
    <div className="ressources-page">
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Commissions</span>
              <span className="hero-title-subtitle">ONPG</span>
            </h1>
            <p className="hero-description">
              Présentation des différentes commissions de l'ONPG, leurs missions et leurs activités.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCommissions}</div>
              <div className="stat-label">Commissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeCommissions}</div>
              <div className="stat-label">Actives</div>
            </div>
          </div>
        </div>
        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      <div className="ressources-container">
        <aside className="ressources-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Recherche</h3>
            <form className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Nom, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Catégorie</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedCategory === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('Toutes')}
              >
                Toutes les catégories
              </button>
              {Array.from(new Set(commissions.map(c => c.category))).map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="ressources-main">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Commissions</span>
          </nav>

          <div className="commissions-list">
            {currentCommissions.map(commission => (
              <article key={commission.id} className={`commission-card ${commission.featured ? 'featured' : ''}`}>
                <div className="commission-header">
                  <div className="commission-meta">
                    <span className={`status-badge ${commission.status}`}>
                      {commission.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    {commission.featured && <span className="featured-badge">⭐</span>}
                  </div>
                  <div className="commission-category">{commission.category}</div>
                </div>

                <div className="commission-content">
                  <h3 className="commission-title">
                    <Link to={`/ressources/commissions/${commission.id}`}>
                      {commission.name}
                    </Link>
                  </h3>

                  <p className="commission-description">{commission.description}</p>

                  <div className="commission-president">
                    <strong>Président :</strong> {commission.president}
                  </div>

                  <div className="commission-members">
                    <strong>Membres ({commission.members.length}) :</strong>
                    <div className="members-list">
                      {commission.members.slice(0, 3).map((member, index) => (
                        <span key={index} className="member-tag">{member}</span>
                      ))}
                      {commission.members.length > 3 && (
                        <span className="member-tag more">+{commission.members.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="commission-missions">
                    <strong>Missions principales :</strong>
                    <ul>
                      {commission.missions.slice(0, 2).map((mission, index) => (
                        <li key={index}>{mission}</li>
                      ))}
                      {commission.missions.length > 2 && (
                        <li><em>et {commission.missions.length - 2} autres missions...</em></li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="commission-footer">
                  <div className="commission-stats">
                    <span>📅 {commission.meetings} réunions</span>
                    <span>📄 {commission.reports} rapports</span>
                  </div>
                  <Link to={`/ressources/commissions/${commission.id}`} className="commission-read-more">
                    📖 En savoir plus →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Commissions;

