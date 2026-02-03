import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les thèses
interface Thesis {
  id: string;
  title: string;
  author: string;
  director: string;
  university: string;
  faculty: string;
  department: string;
  degree: 'master' | 'phd' | 'doctorate';
  year: number;
  abstract: string;
  keywords: string[];
  pages: number;
  language: string;
  specialty: string;
  defenseDate: string;
  juryMembers: string[];
  downloads: number;
  citations: number;
  featured: boolean;
}

interface University {
  id: string;
  name: string;
  location: string;
  thesesCount: number;
}

// Données fictives d'universités
const mockUniversities: University[] = [
  {
    id: 'ussg',
    name: 'Université des Sciences de la Santé de Gabon',
    location: 'Libreville',
    thesesCount: 89
  },
  {
    id: 'univ-omvd',
    name: 'Université Omar Bongo Ondimba',
    location: 'Libreville',
    thesesCount: 67
  },
  {
    id: 'univ-mv',
    name: 'Université des Sciences et Techniques de Masuku',
    location: 'Franceville',
    thesesCount: 34
  }
];

// Données fictives de thèses
const mockTheses: Thesis[] = [
  {
    id: '1',
    title: 'Étude pharmaco-épidémiologique des prescriptions d\'antibiotiques dans les officines gabonaises : Analyse des pratiques et impact sur l\'antibiorésistance',
    author: 'Marie Dubois',
    director: 'Pr. Jean Martin',
    university: 'Université des Sciences de la Santé de Gabon',
    faculty: 'Faculté de Pharmacie',
    department: 'Département de Pharmacologie',
    degree: 'phd',
    year: 2023,
    abstract: 'Cette thèse analyse les prescriptions antibiotiques dans les officines gabonaises et leur impact sur l\'antibiorésistance bactérienne. L\'étude révèle une surprescription alarmante et propose des stratégies d\'amélioration des pratiques.',
    keywords: ['antibiotiques', 'pharmaco-épidémiologie', 'antibiorésistance', 'pratiques professionnelles'],
    pages: 245,
    language: 'fr',
    specialty: 'Pharmacologie Clinique',
    defenseDate: '2023-06-15',
    juryMembers: ['Pr. Jean Martin', 'Pr. Sophie Bernard', 'Dr. Alain Moreau', 'Pr. Catherine Leroy'],
    downloads: 234,
    citations: 12,
    featured: true
  },
  {
    id: '2',
    title: 'Évaluation de la qualité des médicaments génériques commercialisés au Gabon : Approche analytique et réglementaire',
    author: 'Pierre Leroy',
    director: 'Pr. Michel Dubois',
    university: 'Université des Sciences de la Santé de Gabon',
    faculty: 'Faculté de Pharmacie',
    department: 'Département de Pharmacie Galénique',
    degree: 'phd',
    year: 2023,
    abstract: 'Cette recherche évalue la qualité des médicaments génériques disponibles sur le marché gabonais. L\'analyse révèle des disparités importantes et formule des recommandations pour renforcer le contrôle qualité.',
    keywords: ['médicaments génériques', 'contrôle qualité', 'réglementation', 'bioéquivalence'],
    pages: 198,
    language: 'fr',
    specialty: 'Pharmacie Galénique',
    defenseDate: '2023-09-22',
    juryMembers: ['Pr. Michel Dubois', 'Dr. Isabelle Thomas', 'Pr. Olivier Durand', 'Dr. Nathalie Petit'],
    downloads: 187,
    citations: 8,
    featured: false
  },
  {
    id: '3',
    title: 'Impact socio-économique de la dispensation pharmaceutique dans les zones rurales gabonaises',
    author: 'Claire Moreau',
    director: 'Dr. Antoine Leroy',
    university: 'Université Omar Bongo Ondimba',
    faculty: 'Faculté des Sciences Économiques',
    department: 'Département d\'Économie Appliquée',
    degree: 'master',
    year: 2024,
    abstract: 'Cette étude analyse l\'impact socio-économique des pharmacies rurales au Gabon, en mettant l\'accent sur l\'accès aux soins et les conséquences économiques pour les populations locales.',
    keywords: ['pharmacies rurales', 'impact socio-économique', 'accès aux soins', 'développement rural'],
    pages: 156,
    language: 'fr',
    specialty: 'Économie de la Santé',
    defenseDate: '2024-01-18',
    juryMembers: ['Dr. Antoine Leroy', 'Pr. Catherine Moreau', 'Dr. Laurent Robert'],
    downloads: 145,
    citations: 5,
    featured: false
  },
  {
    id: '4',
    title: 'Développement et validation d\'une méthode chromatographique pour le dosage simultané des antipaludéens dans le plasma',
    author: 'Thomas Bernard',
    director: 'Pr. Catherine Moreau',
    university: 'Université des Sciences et Techniques de Masuku',
    faculty: 'Faculté des Sciences',
    department: 'Département de Chimie Analytique',
    degree: 'phd',
    year: 2023,
    abstract: 'Développement d\'une méthode HPLC-MS/MS pour le dosage simultané de trois antipaludéens majeurs dans le plasma humain, avec validation complète selon les normes internationales.',
    keywords: ['chromatographie', 'antipaludéens', 'dosage', 'validation analytique'],
    pages: 189,
    language: 'fr',
    specialty: 'Chimie Analytique',
    defenseDate: '2023-11-30',
    juryMembers: ['Pr. Catherine Moreau', 'Dr. Isabelle Thomas', 'Pr. Michel Dubois', 'Dr. Olivier Durand'],
    downloads: 267,
    citations: 18,
    featured: true
  },
  {
    id: '5',
    title: 'Préparation et caractérisation de formes galéniques pédiatriques innovantes pour les médicaments essentiels',
    author: 'Sophie Martin',
    director: 'Dr. Nathalie Petit',
    university: 'Université des Sciences de la Santé de Gabon',
    faculty: 'Faculté de Pharmacie',
    department: 'Département de Pharmacie Galénique',
    degree: 'doctorate',
    year: 2024,
    abstract: 'Développement de formes galéniques pédiatriques innovantes pour améliorer l\'observance et l\'efficacité des médicaments essentiels chez l\'enfant africain.',
    keywords: ['formes galéniques', 'pédiatrie', 'innovation', 'observance médicamenteuse'],
    pages: 223,
    language: 'fr',
    specialty: 'Pharmacie Galénique',
    defenseDate: '2024-02-08',
    juryMembers: ['Dr. Nathalie Petit', 'Pr. Michel Dubois', 'Dr. Isabelle Thomas', 'Pr. Olivier Durand'],
    downloads: 198,
    citations: 7,
    featured: false
  },
  {
    id: '6',
    title: 'Étude ethnopharmacologique des plantes médicinales utilisées en médecine traditionnelle gabonaise',
    author: 'Antoine Thomas',
    director: 'Pr. Olivier Durand',
    university: 'Université Omar Bongo Ondimba',
    faculty: 'Faculté des Sciences',
    department: 'Département de Biologie',
    degree: 'phd',
    year: 2023,
    abstract: 'Inventaire et analyse ethnopharmacologique des plantes médicinales traditionnellement utilisées au Gabon, avec évaluation de leur potentiel thérapeutique.',
    keywords: ['ethnopharmacologie', 'plantes médicinales', 'médecine traditionnelle', 'Gabon'],
    pages: 312,
    language: 'fr',
    specialty: 'Ethnopharmacologie',
    defenseDate: '2023-12-14',
    juryMembers: ['Pr. Olivier Durand', 'Dr. Laurent Robert', 'Pr. Catherine Moreau', 'Dr. Antoine Leroy'],
    downloads: 312,
    citations: 23,
    featured: true
  }
];

const Theses = () => {
  const [theses, setTheses] = useState<Thesis[]>(mockTheses);
  const [universities, setUniversities] = useState<University[]>(mockUniversities);
  const [filteredTheses, setFilteredTheses] = useState<Thesis[]>(mockTheses);
  const [selectedUniversity, setSelectedUniversity] = useState('Toutes');
  const [selectedDegree, setSelectedDegree] = useState('Tous');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'citations' | 'downloads'>('year');
  const [currentPage, setCurrentPage] = useState(1);

  const thesesPerPage = 6;

  // Filtrage et tri des thèses
  useEffect(() => {
    let filtered = theses.filter(thesis => {
      const matchesSearch = thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           thesis.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           thesis.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           thesis.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           thesis.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesUniversity = selectedUniversity === 'Toutes' || thesis.university === selectedUniversity;
      const matchesDegree = selectedDegree === 'Tous' || thesis.degree === selectedDegree;
      const matchesYear = selectedYear === 'Toutes' || thesis.year.toString() === selectedYear;
      const matchesSpecialty = selectedSpecialty === 'Toutes' || thesis.specialty === selectedSpecialty;
      return matchesSearch && matchesUniversity && matchesDegree && matchesYear && matchesSpecialty;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return b.year - a.year;
        case 'citations':
          return b.citations - a.citations;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredTheses(filtered);
    setCurrentPage(1);
  }, [theses, searchQuery, selectedUniversity, selectedDegree, selectedYear, selectedSpecialty, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredTheses.length / thesesPerPage);
  const startIndex = (currentPage - 1) * thesesPerPage;
  const endIndex = startIndex + thesesPerPage;
  const currentTheses = filteredTheses.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalTheses: theses.length,
    totalPages: theses.reduce((sum, thesis) => sum + thesis.pages, 0),
    totalCitations: theses.reduce((sum, thesis) => sum + thesis.citations, 0),
    totalDownloads: theses.reduce((sum, thesis) => sum + thesis.downloads, 0),
    featuredTheses: theses.filter(thesis => thesis.featured).length,
    universitiesCount: new Set(theses.map(t => t.university)).size,
    yearsRange: `${Math.min(...theses.map(t => t.year))}-${Math.max(...theses.map(t => t.year))}`
  }), [theses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedUniversity('Toutes');
    setSelectedDegree('Tous');
    setSelectedYear('Toutes');
    setSelectedSpecialty('Toutes');
    setSortBy('year');
    setCurrentPage(1);
  };

  const getDegreeLabel = (degree: Thesis['degree']) => {
    const labels = {
      'master': 'Master',
      'phd': 'Doctorat',
      'doctorate': 'Doctorat d\'État'
    };
    return labels[degree];
  };

  const getDegreeColor = (degree: Thesis['degree']) => {
    const colors = {
      'master': '#3498db',
      'phd': '#2ecc71',
      'doctorate': '#e74c3c'
    };
    return colors[degree];
  };

  return (
    <div className="ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Base de</span>
              <span className="hero-title-subtitle">Thèses</span>
            </h1>
            <p className="hero-description">
              Découvrez notre collection de thèses et mémoires en pharmacie.
              Recherche académique, innovation et expertise scientifique au service de la santé gabonaise.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalTheses}</div>
              <div className="stat-label">Thèses</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCitations}</div>
              <div className="stat-label">Citations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalPages.toLocaleString()}</div>
              <div className="stat-label">Pages</div>
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

      {/* Main Content */}
      <div className="ressources-container">
        {/* Sidebar */}
        <aside className="ressources-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Recherche</h3>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Titre, auteur, mots-clés..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Université</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedUniversity === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedUniversity('Toutes')}
              >
                Toutes les universités
              </button>
              {universities.map(university => (
                <button
                  key={university.id}
                  className={`category-filter ${selectedUniversity === university.name ? 'active' : ''}`}
                  onClick={() => setSelectedUniversity(university.name)}
                >
                  {university.name}
                  <span className="category-count">({university.thesesCount})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Grade</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedDegree === 'Tous' ? 'active' : ''}`}
                onClick={() => setSelectedDegree('Tous')}
              >
                Tous les grades
              </button>
              {['master', 'phd', 'doctorate'].map(degree => (
                <button
                  key={degree}
                  className={`category-filter ${selectedDegree === degree ? 'active' : ''}`}
                  onClick={() => setSelectedDegree(degree)}
                >
                  {getDegreeLabel(degree as Thesis['degree'])}
                  <span className="category-count">
                    ({theses.filter(t => t.degree === degree).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Spécialité</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedSpecialty === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty('Toutes')}
              >
                Toutes les spécialités
              </button>
              {Array.from(new Set(theses.map(t => t.specialty))).map(specialty => (
                <button
                  key={specialty}
                  className={`category-filter ${selectedSpecialty === specialty ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                  <span className="category-count">
                    ({theses.filter(t => t.specialty === specialty).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Année</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedYear === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedYear('Toutes')}
              >
                Toutes les années
              </button>
              {Array.from(new Set(theses.map(t => t.year.toString()))).sort().reverse().map(year => (
                <button
                  key={year}
                  className={`category-filter ${selectedYear === year ? 'active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                  <span className="category-count">
                    ({theses.filter(t => t.year.toString() === year).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Trier par</h3>
            <div className="sort-options">
              <button
                className={`sort-option ${sortBy === 'year' ? 'active' : ''}`}
                onClick={() => setSortBy('year')}
              >
                📅 Plus récent
              </button>
              <button
                className={`sort-option ${sortBy === 'citations' ? 'active' : ''}`}
                onClick={() => setSortBy('citations')}
              >
                📊 Plus cité
              </button>
              <button
                className={`sort-option ${sortBy === 'downloads' ? 'active' : ''}`}
                onClick={() => setSortBy('downloads')}
              >
                ⬇️ Plus téléchargé
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Effacer les filtres
            </button>
          </div>

          {/* Statistiques des thèses */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Statistiques</h3>
            <div className="thesis-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.featuredTheses}</span>
                <span className="stat-label">À la une</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.universitiesCount}</span>
                <span className="stat-label">Universités</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.yearsRange}</span>
                <span className="stat-label">Période</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="ressources-main">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Thèses</span>
          </nav>

          <div className="results-header">
            <h2 className="results-title">
              {filteredTheses.length} thèse{filteredTheses.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedUniversity !== 'Toutes' && ` - ${selectedUniversity}`}
              {selectedDegree !== 'Tous' && ` (${getDegreeLabel(selectedDegree as Thesis['degree'])})`}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {/* Thèses list */}
          <div className="theses-list">
            {currentTheses.map(thesis => (
              <article key={thesis.id} className={`thesis-card ${thesis.featured ? 'featured' : ''}`}>
                <div className="thesis-header">
                  <div className="thesis-meta">
                    <span
                      className="degree-badge"
                      style={{ backgroundColor: getDegreeColor(thesis.degree) }}
                    >
                      {getDegreeLabel(thesis.degree)}
                    </span>
                    {thesis.featured && (
                      <span className="featured-badge">⭐ À la une</span>
                    )}
                    <span className="thesis-year">{thesis.year}</span>
                    <span className="thesis-language">{thesis.language.toUpperCase()}</span>
                  </div>
                  <div className="thesis-specialty">{thesis.specialty}</div>
                </div>

                <div className="thesis-content">
                  <h3 className="thesis-title">
                    <Link to={`/ressources/theses/${thesis.id}`}>
                      {thesis.title}
                    </Link>
                  </h3>

                  <div className="thesis-author">
                    <strong>Candidat :</strong> {thesis.author}
                  </div>

                  <div className="thesis-director">
                    <strong>Directeur :</strong> {thesis.director}
                  </div>

                  <div className="thesis-university">
                    <strong>Université :</strong> {thesis.university} - {thesis.faculty}
                  </div>

                  <div className="thesis-defense">
                    <strong>Soutenance :</strong> {new Date(thesis.defenseDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  <p className="thesis-abstract">{thesis.abstract}</p>

                  <div className="thesis-keywords">
                    <strong>Mots-clés :</strong>
                    <div className="keywords-list">
                      {thesis.keywords.slice(0, 4).map(keyword => (
                        <span key={keyword} className="keyword-tag">#{keyword}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="thesis-footer">
                  <div className="thesis-stats">
                    <span className="stat-item">📄 {thesis.pages} pages</span>
                    <span className="stat-item">⬇️ {thesis.downloads} téléchargements</span>
                    <span className="stat-item">📊 {thesis.citations} citations</span>
                  </div>

                  <div className="thesis-actions">
                    <Link to={`/ressources/theses/${thesis.id}`} className="thesis-read-more">
                      📖 Consulter la thèse →
                    </Link>
                    <button className="thesis-download-btn">
                      ⬇️ Télécharger PDF
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Theses;

