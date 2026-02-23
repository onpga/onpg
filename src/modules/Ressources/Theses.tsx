import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Ressources.css';
import './Theses.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

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


const Theses = () => {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [universities, setUniversities] = useState<University[]>(mockUniversities);
  const [filteredTheses, setFilteredTheses] = useState<Thesis[]>([]);
  
  // Charger depuis MongoDB - plusieurs thèses possibles
  useEffect(() => {
    const loadTheses = async () => {
      const data = await fetchResourceData('theses');
      if (!data) {
        setTheses([]);
        setFilteredTheses([]);
        return;
      }

      // Gérer un tableau de données
      const rawArray = Array.isArray(data) ? data : [data];
      
      const mapped: Thesis[] = rawArray.map((item: any) => ({
        id: String(item._id || ''),
        title: item.title || '',
        author: item.author || '',
        director: item.director || '',
        university: item.university || '',
        faculty: item.faculty || '',
        department: item.department || '',
        degree: (item.degree as 'master' | 'phd' | 'doctorate') || 'phd',
        year: item.year || new Date().getFullYear(),
        abstract: item.abstract || item.excerpt || '',
        keywords: item.keywords || [],
        pages: item.pages || 0,
        language: item.language || 'fr',
        specialty: item.specialty || 'Pharmacie',
        defenseDate: item.defenseDate || new Date().toISOString().split('T')[0],
        juryMembers: item.juryMembers || [],
        downloads: item.downloads || 0,
        citations: item.citations || 0,
        featured: item.featured || false
      }));

      setTheses(mapped);
      setFilteredTheses(mapped);
    };
    loadTheses();
  }, []);
  const [selectedUniversity, setSelectedUniversity] = useState('Toutes');
  const [selectedDegree, setSelectedDegree] = useState('Tous');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'year' | 'citations' | 'downloads'>('year');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      <div className="ressources-container-modern">
        {/* Main content */}
        <main className="ressources-main-modern">
          <nav className="breadcrumb-modern">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Thèses</span>
          </nav>

          {/* Filtres horizontaux modernes */}
          <div className="filters-modern-container">
            <div className="filters-header-modern">
              <div className="filters-header-left">
                <h2 className="results-title-modern">
                  {filteredTheses.length} thèse{filteredTheses.length > 1 ? 's' : ''} trouvée{filteredTheses.length > 1 ? 's' : ''}
                </h2>
                <div className="results-meta-modern">
                  Page {currentPage} sur {totalPages}
                </div>
              </div>
              <button 
                className="toggle-filters-btn-modern"
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-label="Toggle filters"
              >
                <span className="toggle-filters-icon">{filtersOpen ? '▲' : '▼'}</span>
                <span>Filtres</span>
              </button>
            </div>

            {/* Barre de recherche principale */}
            <form onSubmit={handleSearch} className="search-bar-modern">
              <div className="search-input-wrapper-modern">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par titre, auteur, mots-clés..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-modern"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="clear-search-btn"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Filtres collapsibles */}
            <div className={`filters-content-modern ${filtersOpen ? 'open' : ''}`}>
              <div className="filters-grid-modern">
                {/* Filtre Université */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Université</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedUniversity === 'Toutes' ? 'active' : ''}`}
                      onClick={() => setSelectedUniversity('Toutes')}
                    >
                      Toutes
                    </button>
                    {universities.map(university => (
                      <button
                        key={university.id}
                        className={`filter-chip-modern ${selectedUniversity === university.name ? 'active' : ''}`}
                        onClick={() => setSelectedUniversity(university.name)}
                      >
                        {university.name}
                        <span className="chip-count">({university.thesesCount})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Grade */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Grade</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedDegree === 'Tous' ? 'active' : ''}`}
                      onClick={() => setSelectedDegree('Tous')}
                    >
                      Tous
                    </button>
                    {['master', 'phd', 'doctorate'].map(degree => (
                      <button
                        key={degree}
                        className={`filter-chip-modern ${selectedDegree === degree ? 'active' : ''}`}
                        onClick={() => setSelectedDegree(degree)}
                      >
                        {getDegreeLabel(degree as Thesis['degree'])}
                        <span className="chip-count">
                          ({theses.filter(t => t.degree === degree).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Spécialité */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Spécialité</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedSpecialty === 'Toutes' ? 'active' : ''}`}
                      onClick={() => setSelectedSpecialty('Toutes')}
                    >
                      Toutes
                    </button>
                    {Array.from(new Set(theses.map(t => t.specialty))).map(specialty => (
                      <button
                        key={specialty}
                        className={`filter-chip-modern ${selectedSpecialty === specialty ? 'active' : ''}`}
                        onClick={() => setSelectedSpecialty(specialty)}
                      >
                        {specialty}
                        <span className="chip-count">
                          ({theses.filter(t => t.specialty === specialty).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Année */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Année</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${selectedYear === 'Toutes' ? 'active' : ''}`}
                      onClick={() => setSelectedYear('Toutes')}
                    >
                      Toutes
                    </button>
                    {Array.from(new Set(theses.map(t => t.year.toString()))).sort().reverse().slice(0, 10).map(year => (
                      <button
                        key={year}
                        className={`filter-chip-modern ${selectedYear === year ? 'active' : ''}`}
                        onClick={() => setSelectedYear(year)}
                      >
                        {year}
                        <span className="chip-count">
                          ({theses.filter(t => t.year.toString() === year).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tri */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Trier par</label>
                  <div className="filter-chips-modern">
                    <button
                      className={`filter-chip-modern ${sortBy === 'year' ? 'active' : ''}`}
                      onClick={() => setSortBy('year')}
                    >
                      📅 Plus récent
                    </button>
                    <button
                      className={`filter-chip-modern ${sortBy === 'citations' ? 'active' : ''}`}
                      onClick={() => setSortBy('citations')}
                    >
                      📊 Plus cité
                    </button>
                    <button
                      className={`filter-chip-modern ${sortBy === 'downloads' ? 'active' : ''}`}
                      onClick={() => setSortBy('downloads')}
                    >
                      ⬇️ Plus téléchargé
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions filtres */}
              <div className="filters-actions-modern">
                <button onClick={clearFilters} className="clear-filters-btn-modern">
                  <span>🗑️</span> Effacer tous les filtres
                </button>
                <div className="filters-stats-modern">
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.featuredTheses}</span>
                    <span className="stat-mini-label">À la une</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.universitiesCount}</span>
                    <span className="stat-mini-label">Universités</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{stats.yearsRange}</span>
                    <span className="stat-mini-label">Période</span>
                  </div>
                </div>
              </div>
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

