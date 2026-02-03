import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les articles
interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year: number;
  doi?: string;
  keywords: string[];
  category: string;
  downloads: number;
  citations: number;
  featured: boolean;
  language: string;
  publicationType: 'article' | 'review' | 'case-report' | 'letter';
}

interface Journal {
  id: string;
  name: string;
  issn: string;
  publisher: string;
  impactFactor?: number;
  articlesCount: number;
}

// Données fictives de journaux
const mockJournals: Journal[] = [
  {
    id: 'rev-pharm-gab',
    name: 'Revue Pharmaceutique Gabonaise',
    issn: '1234-5678',
    publisher: 'ONPG Editions',
    impactFactor: 2.3,
    articlesCount: 156
  },
  {
    id: 'acta-pharm-afr',
    name: 'Acta Pharmaceutica Africana',
    issn: '2345-6789',
    publisher: 'Société Africaine de Pharmacie',
    impactFactor: 1.8,
    articlesCount: 89
  },
  {
    id: 'bull-sante-pub',
    name: 'Bulletin de Santé Publique',
    issn: '3456-7890',
    publisher: 'Ministère de la Santé',
    impactFactor: 2.1,
    articlesCount: 124
  }
];

// Données fictives d'articles
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Étude pharmaco-épidémiologique des prescriptions antibiotiques en officine au Gabon',
    authors: ['Dr. Marie Dubois', 'Pr. Jean Martin', 'Dr. Sophie Bernard'],
    abstract: 'Cette étude analyse les prescriptions antibiotiques dans les officines gabonaises sur une période de 12 mois. Les résultats montrent une prévalence élevée d\'antibiotiques de dernière ligne et soulignent la nécessité de renforcer les programmes d\'antibiorésistance.',
    journal: 'Revue Pharmaceutique Gabonaise',
    volume: '12',
    issue: '3',
    pages: '145-162',
    year: 2024,
    doi: '10.1234/rpg.2024.12.3.145',
    keywords: ['antibiotiques', 'pharmaco-épidémiologie', 'antibiorésistance', 'Gabon'],
    category: 'Pharmaco-épidémiologie',
    downloads: 1250,
    citations: 23,
    featured: true,
    language: 'fr',
    publicationType: 'article'
  },
  {
    id: '2',
    title: 'Impact des génériques sur les dépenses de santé publique : Analyse comparative Gabon vs Afrique Centrale',
    authors: ['Dr. Alain Moreau', 'Dr. Claire Leroy'],
    abstract: 'Analyse économique comparative de l\'impact des médicaments génériques sur les dépenses de santé dans différents pays d\'Afrique Centrale, avec un focus particulier sur le Gabon.',
    journal: 'Acta Pharmaceutica Africana',
    volume: '8',
    issue: '2',
    pages: '78-95',
    year: 2023,
    doi: '10.5678/apa.2023.8.2.78',
    keywords: ['génériques', 'dépenses santé', 'économie pharmaceutique', 'Afrique Centrale'],
    category: 'Économie de la Santé',
    downloads: 987,
    citations: 34,
    featured: false,
    language: 'fr',
    publicationType: 'article'
  },
  {
    id: '3',
    title: 'Préparation des mélanges magistraux pédiatriques : Bonnes pratiques et risques associés',
    authors: ['Pr. Michel Dubois', 'Dr. Pierre Martin'],
    abstract: 'Revue des bonnes pratiques de préparation des mélanges magistraux en pédiatrie et analyse des risques potentiels associés à ces préparations.',
    journal: 'Revue Pharmaceutique Gabonaise',
    volume: '11',
    issue: '4',
    pages: '203-218',
    year: 2023,
    doi: '10.1234/rpg.2023.11.4.203',
    keywords: ['mélanges magistraux', 'pédiatrie', 'préparation', 'risques'],
    category: 'Préparation Magistrale',
    downloads: 756,
    citations: 18,
    featured: false,
    language: 'fr',
    publicationType: 'review'
  },
  {
    id: '4',
    title: 'Cas clinique : Réaction allergique sévère à un anti-inflammatoire non stéroïdien',
    authors: ['Dr. Isabelle Thomas', 'Dr. Laurent Robert'],
    abstract: 'Présentation d\'un cas clinique rare d\'anaphylaxie à l\'ibuprofène chez un patient adulte, avec discussion des mécanismes physiopathologiques et implications thérapeutiques.',
    journal: 'Bulletin de Santé Publique',
    volume: '15',
    issue: '1',
    pages: '45-52',
    year: 2024,
    doi: '10.9012/bsp.2024.15.1.45',
    keywords: ['allergie', 'AINS', 'anaphylaxie', 'cas clinique'],
    category: 'Cas Cliniques',
    downloads: 643,
    citations: 12,
    featured: false,
    language: 'fr',
    publicationType: 'case-report'
  },
  {
    id: '5',
    title: 'Évaluation des pratiques de dispensation dans les pharmacies rurales gabonaises',
    authors: ['Dr. Nathalie Petit', 'Dr. Olivier Durand'],
    abstract: 'Étude qualitative et quantitative des pratiques de dispensation dans les pharmacies rurales du Gabon, identifiant les défis spécifiques et proposant des solutions adaptées.',
    journal: 'Revue Pharmaceutique Gabonaise',
    volume: '12',
    issue: '1',
    pages: '23-41',
    year: 2024,
    doi: '10.1234/rpg.2024.12.1.23',
    keywords: ['dispensation', 'pharmacies rurales', 'pratiques', 'Gabon'],
    category: 'Pratiques Professionnelles',
    downloads: 892,
    citations: 27,
    featured: true,
    language: 'fr',
    publicationType: 'article'
  },
  {
    id: '6',
    title: 'Pharmacocinétique des antipaludéens chez l\'enfant africain : Revue systématique',
    authors: ['Pr. Catherine Moreau', 'Dr. Antoine Leroy'],
    abstract: 'Revue systématique de la littérature sur la pharmacocinétique des antipaludéens chez l\'enfant africain, avec implications pour l\'optimisation thérapeutique.',
    journal: 'Acta Pharmaceutica Africana',
    volume: '9',
    issue: '1',
    pages: '12-28',
    year: 2024,
    doi: '10.5678/apa.2024.9.1.12',
    keywords: ['antipaludéens', 'pharmacocinétique', 'enfant', 'Afrique'],
    category: 'Pharmacologie',
    downloads: 1156,
    citations: 45,
    featured: false,
    language: 'fr',
    publicationType: 'review'
  }
];

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [journals, setJournals] = useState<Journal[]>(mockJournals);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);
  const [selectedJournal, setSelectedJournal] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedYear, setSelectedYear] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'citations' | 'downloads'>('date');
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 6;

  // Filtrage et tri des articles
  useEffect(() => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesJournal = selectedJournal === 'Tous' || article.journal === selectedJournal;
      const matchesCategory = selectedCategory === 'Toutes' || article.category === selectedCategory;
      const matchesType = selectedType === 'Tous' || article.publicationType === selectedType;
      const matchesYear = selectedYear === 'Toutes' || article.year.toString() === selectedYear;
      return matchesSearch && matchesJournal && matchesCategory && matchesType && matchesYear;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.year - a.year;
        case 'citations':
          return b.citations - a.citations;
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, searchQuery, selectedJournal, selectedCategory, selectedType, selectedYear, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalArticles: articles.length,
    totalCitations: articles.reduce((sum, article) => sum + article.citations, 0),
    totalDownloads: articles.reduce((sum, article) => sum + article.downloads, 0),
    featuredArticles: articles.filter(article => article.featured).length,
    categoriesCount: new Set(articles.map(a => a.category)).size,
    yearsRange: `${Math.min(...articles.map(a => a.year))}-${Math.max(...articles.map(a => a.year))}`
  }), [articles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedJournal('Tous');
    setSelectedCategory('Toutes');
    setSelectedType('Tous');
    setSelectedYear('Toutes');
    setSortBy('date');
    setCurrentPage(1);
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length <= 2) {
      return authors.join(', ');
    }
    return `${authors[0]} et al.`;
  };

  const getPublicationTypeLabel = (type: Article['publicationType']) => {
    const labels = {
      'article': 'Article original',
      'review': 'Revue',
      'case-report': 'Cas clinique',
      'letter': 'Lettre'
    };
    return labels[type];
  };

  const getPublicationTypeColor = (type: Article['publicationType']) => {
    const colors = {
      'article': '#3498db',
      'review': '#2ecc71',
      'case-report': '#e74c3c',
      'letter': '#f39c12'
    };
    return colors[type];
  };

  return (
    <div className="ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Bibliothèque</span>
              <span className="hero-title-subtitle">Scientifique</span>
            </h1>
            <p className="hero-description">
              Accédez à notre collection d'articles scientifiques, revues et publications académiques.
              Recherche avancée, citations et téléchargements disponibles.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalArticles}</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCitations}</div>
              <div className="stat-label">Citations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalDownloads.toLocaleString()}</div>
              <div className="stat-label">Téléchargements</div>
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
            <h3 className="sidebar-title">Recherche avancée</h3>
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
            <h3 className="sidebar-title">Journal</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedJournal === 'Tous' ? 'active' : ''}`}
                onClick={() => setSelectedJournal('Tous')}
              >
                Tous les journaux
              </button>
              {journals.map(journal => (
                <button
                  key={journal.id}
                  className={`category-filter ${selectedJournal === journal.name ? 'active' : ''}`}
                  onClick={() => setSelectedJournal(journal.name)}
                >
                  {journal.name}
                  <span className="category-count">({journal.articlesCount})</span>
                </button>
              ))}
            </div>
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
              {Array.from(new Set(articles.map(a => a.category))).map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  <span className="category-count">
                    ({articles.filter(a => a.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Type de publication</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedType === 'Tous' ? 'active' : ''}`}
                onClick={() => setSelectedType('Tous')}
              >
                Tous les types
              </button>
              {['article', 'review', 'case-report', 'letter'].map(type => (
                <button
                  key={type}
                  className={`category-filter ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {getPublicationTypeLabel(type as Article['publicationType'])}
                  <span className="category-count">
                    ({articles.filter(a => a.publicationType === type).length})
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
              {Array.from(new Set(articles.map(a => a.year.toString()))).sort().reverse().map(year => (
                <button
                  key={year}
                  className={`category-filter ${selectedYear === year ? 'active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                  <span className="category-count">
                    ({articles.filter(a => a.year.toString() === year).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Trier par</h3>
            <div className="sort-options">
              <button
                className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => setSortBy('date')}
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

          {/* Statistiques de la bibliothèque */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Métriques</h3>
            <div className="library-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.featuredArticles}</span>
                <span className="stat-label">À la une</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.categoriesCount}</span>
                <span className="stat-label">Catégories</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.yearsRange}</span>
                <span className="stat-label">Années</span>
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
            <span className="breadcrumb-current">Articles</span>
          </nav>

          <div className="results-header">
            <h2 className="results-title">
              {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedJournal !== 'Tous' && ` dans ${selectedJournal}`}
              {selectedCategory !== 'Toutes' && ` - ${selectedCategory}`}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {/* Articles list */}
          <div className="articles-scientific-list">
            {currentArticles.map(article => (
              <article key={article.id} className={`article-card ${article.featured ? 'featured' : ''}`}>
                <div className="article-header">
                  <div className="article-meta">
                    <span
                      className="publication-type"
                      style={{ backgroundColor: getPublicationTypeColor(article.publicationType) }}
                    >
                      {getPublicationTypeLabel(article.publicationType)}
                    </span>
                    {article.featured && (
                      <span className="featured-badge">⭐ À la une</span>
                    )}
                    <span className="article-year">{article.year}</span>
                  </div>
                  <div className="article-category">{article.category}</div>
                </div>

                <div className="article-content">
                  <h3 className="article-title">
                    <Link to={`/ressources/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <div className="article-authors">
                    <strong>Auteurs :</strong> {formatAuthors(article.authors)}
                  </div>

                  <div className="article-journal">
                    <strong>Journal :</strong> {article.journal}
                    {article.volume && `, Vol. ${article.volume}`}
                    {article.issue && `, N° ${article.issue}`}
                    {article.pages && `, pp. ${article.pages}`}
                  </div>

                  <p className="article-abstract">{article.abstract}</p>

                  <div className="article-keywords">
                    <strong>Mots-clés :</strong>
                    <div className="keywords-list">
                      {article.keywords.map(keyword => (
                        <span key={keyword} className="keyword-tag">#{keyword}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="article-footer">
                  <div className="article-stats">
                    <span className="stat-item">📄 {article.downloads} téléchargements</span>
                    <span className="stat-item">📊 {article.citations} citations</span>
                    <span className="stat-item">🌐 {article.language.toUpperCase()}</span>
                  </div>

                  <div className="article-actions">
                    <Link to={`/ressources/articles/${article.id}`} className="article-read-more">
                      📖 Lire l'article →
                    </Link>
                    {article.doi && (
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-doi"
                      >
                        🔗 DOI
                      </a>
                    )}
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

export default Articles;

