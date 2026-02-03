import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les lois
interface Law {
  id: string;
  number: string;
  title: string;
  publicationDate: string;
  entryDate: string;
  category: string;
  summary: string;
  tableOfContents: {
    title: string;
    articles: string[];
  }[];
  keyArticles: string[];
  tags: string[];
  status: 'active' | 'modified' | 'repealed';
  downloads: number;
  views: number;
  featured: boolean;
  language: string;
}

// Données fictives de lois
const mockLaws: Law[] = [
  {
    id: 'loi-pharmacie-2023',
    number: '003/2023',
    title: 'Loi relative à l\'exercice de la pharmacie au Gabon',
    publicationDate: '2023-07-15',
    entryDate: '2023-08-01',
    category: 'Santé publique',
    summary: 'Loi fondamentale régissant l\'exercice de la profession de pharmacien et l\'organisation du système pharmaceutique gabonais.',
    tableOfContents: [
      {
        title: 'Titre I - Dispositions générales',
        articles: ['Article 1 : Objet de la loi', 'Article 2 : Définitions', 'Article 3 : Champ d\'application']
      },
      {
        title: 'Titre II - Organisation professionnelle',
        articles: ['Article 4 : Ordre National des Pharmaciens', 'Article 5 : Conseil National', 'Article 6 : Chambres disciplinaires']
      },
      {
        title: 'Titre III - Conditions d\'exercice',
        articles: ['Article 7 : Qualifications requises', 'Article 8 : Autorisation d\'exercice', 'Article 9 : Obligations professionnelles']
      }
    ],
    keyArticles: [
      'Article 1 : Objet de la loi',
      'Article 4 : Création de l\'Ordre National des Pharmaciens',
      'Article 7 : Conditions d\'accès à la profession',
      'Article 12 : Code de déontologie'
    ],
    tags: ['pharmacie', 'exercice professionnel', 'organisation', 'déontologie'],
    status: 'active',
    downloads: 2156,
    views: 5678,
    featured: true,
    language: 'fr'
  },
  {
    id: 'loi-medicaments-2022',
    number: '045/2022',
    title: 'Loi sur les médicaments et les produits de santé',
    publicationDate: '2022-12-20',
    entryDate: '2023-01-15',
    category: 'Médicaments',
    summary: 'Loi régissant la mise sur le marché, la distribution et le contrôle des médicaments au Gabon.',
    tableOfContents: [
      {
        title: 'Chapitre I - Autorisation de mise sur le marché',
        articles: ['Article 1 : Procédure d\'AMM', 'Article 2 : Critères d\'évaluation', 'Article 3 : Durée de validité']
      },
      {
        title: 'Chapitre II - Distribution et dispensation',
        articles: ['Article 4 : Circuit de distribution', 'Article 5 : Rôle des pharmaciens', 'Article 6 : Traçabilité']
      }
    ],
    keyArticles: [
      'Article 1 : Autorisation de mise sur le marché',
      'Article 5 : Rôle du pharmacien dans la dispensation',
      'Article 8 : Pharmacovigilance'
    ],
    tags: ['médicaments', 'AMM', 'distribution', 'pharmacovigilance'],
    status: 'active',
    downloads: 1897,
    views: 4231,
    featured: false,
    language: 'fr'
  }
];

const Lois = () => {
  const [laws, setLaws] = useState<Law[]>(mockLaws);
  const [filteredLaws, setFilteredLaws] = useState<Law[]>(mockLaws);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const lawsPerPage = 6;

  useEffect(() => {
    let filtered = laws.filter(law => {
      const matchesSearch = law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           law.number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Toutes' || law.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    setFilteredLaws(filtered);
    setCurrentPage(1);
  }, [laws, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredLaws.length / lawsPerPage);
  const currentLaws = filteredLaws.slice((currentPage - 1) * lawsPerPage, currentPage * lawsPerPage);

  const stats = useMemo(() => ({
    totalLaws: laws.length,
    activeLaws: laws.filter(l => l.status === 'active').length,
    totalDownloads: laws.reduce((sum, l) => sum + l.downloads, 0),
    totalViews: laws.reduce((sum, l) => sum + l.views, 0),
    featuredLaws: laws.filter(l => l.featured).length
  }), [laws]);

  const getStatusLabel = (status: Law['status']) => {
    const labels = {
      'active': 'En vigueur',
      'modified': 'Modifiée',
      'repealed': 'Abrogée'
    };
    return labels[status];
  };

  const getStatusColor = (status: Law['status']) => {
    const colors = {
      'active': '#27ae60',
      'modified': '#f39c12',
      'repealed': '#e74c3c'
    };
    return colors[status];
  };

  const openLawDetail = (law: Law) => {
    setSelectedLaw(law);
    setShowTableOfContents(false);
  };

  const closeLawDetail = () => {
    setSelectedLaw(null);
    setShowTableOfContents(false);
  };

  return (
    <div className="ressources-page">
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Corps</span>
              <span className="hero-title-subtitle">Législatif</span>
            </h1>
            <p className="hero-description">
              Lois, décrets et textes législatifs régissant la pharmacie au Gabon.
              Avec sommaire interactif pour navigation facilitée.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalLaws}</div>
              <div className="stat-label">Lois</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeLaws}</div>
              <div className="stat-label">En vigueur</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalDownloads.toLocaleString()}</div>
              <div className="stat-label">Téléchargements</div>
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
                  placeholder="Numéro, titre..."
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
              {Array.from(new Set(laws.map(l => l.category))).map(category => (
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
            <span className="breadcrumb-current">Lois</span>
          </nav>

          <div className="laws-list">
            {currentLaws.map(law => (
              <article key={law.id} className={`law-card ${law.featured ? 'featured' : ''}`}>
                <div className="law-header">
                  <div className="law-meta">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(law.status) }}
                    >
                      {getStatusLabel(law.status)}
                    </span>
                    {law.featured && <span className="featured-badge">⭐ À la une</span>}
                    <span className="law-number">Loi n° {law.number}</span>
                    <span className="law-language">{law.language.toUpperCase()}</span>
                  </div>
                  <div className="law-category">{law.category}</div>
                </div>

                <div className="law-content">
                  <h3 className="law-title">
                    <Link to={`/ressources/lois/${law.id}`} onClick={(e) => { e.preventDefault(); openLawDetail(law); }}>
                      {law.title}
                    </Link>
                  </h3>

                  <div className="law-dates">
                    <div className="date-item">
                      <strong>Publication :</strong> {new Date(law.publicationDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="date-item">
                      <strong>Entrée en vigueur :</strong> {new Date(law.entryDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <p className="law-summary">{law.summary}</p>

                  <div className="law-table-of-contents-preview">
                    <strong>Sommaire ({law.tableOfContents.length} titres) :</strong>
                    <div className="toc-preview">
                      {law.tableOfContents.slice(0, 2).map((section, index) => (
                        <div key={index} className="toc-section">
                          <span className="toc-title">{section.title}</span>
                          <span className="toc-articles">({section.articles.length} articles)</span>
                        </div>
                      ))}
                      {law.tableOfContents.length > 2 && (
                        <div className="toc-section">
                          <span className="toc-more">et {law.tableOfContents.length - 2} autres titres...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="law-key-articles">
                    <strong>Articles clés :</strong>
                    <div className="key-articles-list">
                      {law.keyArticles.slice(0, 2).map((article, index) => (
                        <span key={index} className="key-article-tag">{article}</span>
                      ))}
                      {law.keyArticles.length > 2 && (
                        <span className="key-article-tag more">+{law.keyArticles.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="law-footer">
                  <div className="law-stats">
                    <span className="stat-item">👁️ {law.views.toLocaleString()} vues</span>
                    <span className="stat-item">⬇️ {law.downloads} téléchargements</span>
                  </div>

                  <div className="law-actions">
                    <button
                      className="law-toc-btn"
                      onClick={() => {
                        setSelectedLaw(law);
                        setShowTableOfContents(true);
                      }}
                    >
                      📋 Sommaire
                    </button>
                    <Link to={`/ressources/lois/${law.id}`} onClick={(e) => { e.preventDefault(); openLawDetail(law); }} className="law-read-more">
                      📖 Consulter →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>

      {/* Modal pour le détail de la loi avec sommaire interactif */}
      {selectedLaw && (
        <div className="law-modal-overlay" onClick={closeLawDetail}>
          <div className="law-modal-content" onClick={e => e.stopPropagation()}>
            <button className="law-modal-close" onClick={closeLawDetail}>✕</button>

            <div className="law-modal-header">
              <h2>Loi n° {selectedLaw.number}</h2>
              <h3>{selectedLaw.title}</h3>
              <div className="law-modal-meta">
                <span>📅 Publication: {new Date(selectedLaw.publicationDate).toLocaleDateString('fr-FR')}</span>
                <span>⚖️ Statut: {getStatusLabel(selectedLaw.status)}</span>
                <span>📄 {selectedLaw.downloads} téléchargements</span>
              </div>
            </div>

            <div className="law-modal-body">
              {/* Sommaire interactif */}
              <div className="law-toc-sidebar">
                <h4>📋 Sommaire</h4>
                <div className="interactive-toc">
                  {selectedLaw.tableOfContents.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="toc-section-interactive">
                      <h5 className="toc-section-title">{section.title}</h5>
                      <ul className="toc-articles-list">
                        {section.articles.map((article, articleIndex) => (
                          <li key={articleIndex} className="toc-article-item">
                            <a href={`#article-${sectionIndex}-${articleIndex}`} className="toc-article-link">
                              {article}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu de la loi */}
              <div className="law-content-main">
                <div className="law-summary-section">
                  <h4>Résumé</h4>
                  <p>{selectedLaw.summary}</p>
                </div>

                <div className="law-full-toc">
                  <h4>Table des matières détaillée</h4>
                  {selectedLaw.tableOfContents.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="toc-section-full">
                      <h5>{section.title}</h5>
                      <div className="articles-grid">
                        {section.articles.map((article, articleIndex) => (
                          <div
                            key={articleIndex}
                            id={`article-${sectionIndex}-${articleIndex}`}
                            className="article-preview"
                          >
                            <h6>{article}</h6>
                            <p className="article-placeholder">
                              [Contenu de l'article - Texte complet disponible dans le document officiel]
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="law-key-articles-section">
                  <h4>Articles clés</h4>
                  <div className="key-articles-detailed">
                    {selectedLaw.keyArticles.map((article, index) => (
                      <div key={index} className="key-article-detailed">
                        <span className="article-number">{index + 1}.</span>
                        <span className="article-title">{article}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="law-modal-footer">
              <div className="law-modal-stats">
                <span>👁️ {selectedLaw.views.toLocaleString()} consultations</span>
                <span>⬇️ {selectedLaw.downloads} téléchargements</span>
              </div>
              <div className="law-modal-actions">
                <button className="law-modal-action secondary">❤️ Sauvegarder</button>
                <button className="law-modal-action secondary">🔗 Partager</button>
                <button className="law-modal-action primary">⬇️ Télécharger PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lois;

