import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Ressources.css';

// Types pour les communiqués
interface Communique {
  id: string;
  title: string;
  reference: string;
  date: string;
  type: 'urgent' | 'information' | 'presse' | 'administratif';
  category: string;
  excerpt: string;
  content: string;
  attachments?: string[];
  urgent: boolean;
}

// Données fictives de communiqués
const mockCommuniques: Communique[] = [
  {
    id: '1',
    title: 'Communiqué de presse : Nouveau protocole de sécurité médicamenteuse',
    reference: 'CP-2024-001',
    date: '2024-01-15',
    type: 'presse',
    category: 'Sécurité',
    excerpt: 'L\'ONPG annonce un nouveau protocole révolutionnaire pour renforcer la sécurité médicamenteuse dans les officines gabonaises.',
    content: `L'ONPG, en collaboration avec le Ministère de la Santé, présente aujourd'hui un nouveau protocole de sécurité médicamenteuse qui vise à élever les standards de qualité et de sécurité dans toutes les officines du Gabon.

Ce protocole comprend plusieurs mesures innovantes :
- Système de double vérification automatisé
- Formation continue obligatoire sur les nouvelles technologies
- Mise en place d'un système de traçabilité complet
- Renforcement des contrôles qualité internes

Cette initiative s'inscrit dans la volonté de l'ONPG de garantir la sécurité des patients et la qualité des soins pharmaceutiques au Gabon.`,
    urgent: false
  },
  {
    id: '2',
    title: 'URGENT : Suspension temporaire de commercialisation de spécialité pharmaceutique',
    reference: 'URG-2024-002',
    date: '2024-01-12',
    type: 'urgent',
    category: 'Alerte',
    excerpt: 'Suspension immédiate de la commercialisation du médicament XYZ suite à des effets indésirables graves signalés.',
    content: `Suite à des signalements d'effets indésirables graves, l'ONPG ordonne la suspension immédiate de la commercialisation du médicament XYZ dans toutes les officines du territoire national.

Les pharmaciens sont tenus de :
- Retirer immédiatement ce produit des rayons
- Informer les patients détenteurs de ce médicament
- Rapporter tout effet indésirable au système national de pharmacovigilance

Cette mesure de précaution vise à garantir la sécurité des patients.`,
    urgent: true
  },
  {
    id: '3',
    title: 'Information : Modification des tarifs de rémunération pour 2024',
    reference: 'INFO-2024-003',
    date: '2024-01-10',
    type: 'information',
    category: 'Tarification',
    excerpt: 'Publication des nouveaux tarifs de rémunération des pharmaciens pour l\'année 2024 suite aux négociations conventionnelles.',
    content: `À l'issue des négociations conventionnelles, l'ONPG et les syndicats représentatifs ont établi les nouveaux tarifs de rémunération pour l'année 2024.

Les principales modifications concernent :
- Augmentation de 2.5% des honoraires de dispensation
- Révision des tarifs de préparation des mélanges
- Nouveaux tarifs pour les entretiens pharmaceutiques

Ces nouveaux tarifs entreront en vigueur à compter du 1er février 2024.`,
    urgent: false
  },
  {
    id: '4',
    title: 'Communiqué administratif : Nouvelles modalités d\'inscription à l\'Ordre',
    reference: 'ADMIN-2024-004',
    date: '2024-01-08',
    type: 'administratif',
    category: 'Inscription',
    excerpt: 'Modification des procédures d\'inscription à l\'Ordre National des Pharmaciens du Gabon.',
    content: `L'ONPG informe les nouveaux diplômés et les pharmaciens souhaitant s'inscrire à l'Ordre des modifications apportées aux procédures d'inscription.

Les nouvelles modalités incluent :
- Dématérialisation complète du processus d'inscription
- Suppression du stage d'adaptation pour les diplômés étrangers
- Renforcement des exigences en matière de formation continue
- Mise en place d'un système de validation en ligne

Ces mesures visent à simplifier et moderniser les démarches administratives.`,
    urgent: false
  },
  {
    id: '5',
    title: 'Point presse : Bilan annuel 2023 de l\'activité pharmaceutique',
    reference: 'PP-2024-005',
    date: '2024-01-05',
    type: 'presse',
    category: 'Statistiques',
    excerpt: 'Présentation du bilan annuel 2023 : croissance de 15% de l\'activité pharmaceutique au Gabon.',
    content: `L'ONPG dresse un bilan positif de l'activité pharmaceutique au Gabon pour l'année 2023, avec une croissance globale de 15% par rapport à 2022.

Les chiffres clés :
- 45 millions de prescriptions traitées
- 98.5% de taux de service des officines
- 2.3 millions de patients accompagnés dans le cadre du bilan médicamenteux
- 850 pharmaciens formés aux nouvelles technologies

Cette performance s'explique par l'engagement des professionnels de santé et les investissements technologiques réalisés.`,
    urgent: false
  }
];

const typeLabels = {
  urgent: 'Urgent',
  information: 'Information',
  presse: 'Presse',
  administratif: 'Administratif'
};

const typeColors = {
  urgent: '#e74c3c',
  information: '#3498db',
  presse: '#2ecc71',
  administratif: '#f39c12'
};

const Communiques = () => {
  const [communiques, setCommuniques] = useState<Communique[]>(mockCommuniques);
  const [filteredCommuniques, setFilteredCommuniques] = useState<Communique[]>(mockCommuniques);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');
  const [currentPage, setCurrentPage] = useState(1);

  const communiquesPerPage = 8;

  // Filtrage et tri
  useEffect(() => {
    let filtered = communiques.filter(communique => {
      const matchesSearch = communique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           communique.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           communique.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'Tous' || communique.type === selectedType;
      const matchesCategory = selectedCategory === 'Toutes' || communique.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.type.localeCompare(b.type);
      }
    });

    setFilteredCommuniques(filtered);
    setCurrentPage(1);
  }, [communiques, searchQuery, selectedType, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCommuniques.length / communiquesPerPage);
  const startIndex = (currentPage - 1) * communiquesPerPage;
  const endIndex = startIndex + communiquesPerPage;
  const currentCommuniques = filteredCommuniques.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => ({
    totalCommuniques: communiques.length,
    urgentCommuniques: communiques.filter(c => c.urgent).length,
    featuredCommuniques: communiques.filter(c => c.featured).length,
    typesCount: Object.keys(typeLabels).length,
    thisMonth: communiques.filter(c => new Date(c.date).getMonth() === new Date().getMonth()).length
  }), [communiques]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('Tous');
    setSelectedCategory('Toutes');
    setSortBy('date');
    setCurrentPage(1);
  };

  return (
    <div className="ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Communiqués</span>
              <span className="hero-title-subtitle">Officiels</span>
            </h1>
            <p className="hero-description">
              Informations officielles, communiqués de presse et annonces importantes de l'ONPG.
              Restez informé des dernières décisions et actualités institutionnelles.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCommuniques}</div>
              <div className="stat-label">Communiqués</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.urgentCommuniques}</div>
              <div className="stat-label">Urgents</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.thisMonth}</div>
              <div className="stat-label">Ce mois</div>
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
            <h3 className="sidebar-title">Rechercher</h3>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Rechercher un communiqué..."
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
            <h3 className="sidebar-title">Type de communiqué</h3>
            <div className="category-filters">
              <button
                className={`category-filter all-types ${selectedType === 'Tous' ? 'active' : ''}`}
                onClick={() => setSelectedType('Tous')}
              >
                <span className="filter-icon">📋</span>
                <span className="filter-text">Tous les types</span>
                <span className="category-count">
                  ({communiques.length})
                </span>
              </button>
              {Object.entries(typeLabels).map(([key, label]) => (
                <button
                  key={key}
                  className={`category-filter type-filter ${selectedType === key ? 'active' : ''}`}
                  onClick={() => setSelectedType(key)}
                  style={{
                    '--type-color': typeColors[key as keyof typeof typeColors]
                  } as React.CSSProperties}
                >
                  <span className="filter-icon">
                    {key === 'urgent' && '🚨'}
                    {key === 'presse' && '📢'}
                    {key === 'information' && 'ℹ️'}
                    {key === 'administratif' && '📋'}
                  </span>
                  <span className="filter-text">{label}</span>
                  <span className="category-count">
                    ({communiques.filter(c => c.type === key).length})
                  </span>
                  {key === 'urgent' && communiques.filter(c => c.type === key).length > 0 && (
                    <span className="urgent-indicator">●</span>
                  )}
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
              {Array.from(new Set(communiques.map(c => c.category))).map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  <span className="category-count">
                    ({communiques.filter(c => c.category === category).length})
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
                className={`sort-option ${sortBy === 'type' ? 'active' : ''}`}
                onClick={() => setSortBy('type')}
              >
                📋 Par type
              </button>
            </div>
          </div>

          {/* Statistiques des communiqués */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">📊 Métriques</h3>
            <div className="communiques-stats">
              <div className="stat-item">
                <div className="stat-icon">📄</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalCommuniques}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
              <div className="stat-item urgent-stat">
                <div className="stat-icon">🚨</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.urgentCommuniques}</span>
                  <span className="stat-label">Urgents</span>
                </div>
                {stats.urgentCommuniques > 0 && (
                  <div className="urgent-pulse-dot"></div>
                )}
              </div>
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.thisMonth}</span>
                  <span className="stat-label">Ce mois</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.featuredCommuniques}</span>
                  <span className="stat-label">À la une</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Effacer les filtres
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ressources-main">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Communiqués</span>
          </nav>

          <div className="results-header">
            <h2 className="results-title">
              {filteredCommuniques.length} communiqué{filteredCommuniques.length > 1 ? 's' : ''}
              {searchQuery && ` pour "${searchQuery}"`}
              {selectedType !== 'Tous' && ` de type ${typeLabels[selectedType as keyof typeof typeLabels]}`}
            </h2>
            <div className="results-meta">
              Page {currentPage} sur {totalPages}
            </div>
          </div>

          {/* Communiqués list */}
          <div className="communiques-list">
            {currentCommuniques.map((communique, index) => (
              <article
                key={communique.id}
                className={`communique-card ${communique.urgent ? 'urgent' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Badge d'urgence flottant */}
                {communique.urgent && (
                  <div className="urgent-floating-badge">
                    <div className="urgent-pulse"></div>
                    <span>🚨 URGENT</span>
                  </div>
                )}

                {/* Header avec icône et statut */}
                <div className="communique-header">
                  <div className="communique-icon-section">
                    <div className="communique-icon">
                      {communique.type === 'urgent' && '🚨'}
                      {communique.type === 'presse' && '📢'}
                      {communique.type === 'information' && 'ℹ️'}
                      {communique.type === 'administratif' && '📋'}
                    </div>
                    <div className="communique-status-info">
                      <span
                        className="communique-type-badge"
                        style={{ backgroundColor: typeColors[communique.type] }}
                      >
                        {typeLabels[communique.type]}
                      </span>
                    </div>
                  </div>

                  <div className="communique-meta-info">
                    <div className="communique-reference">Réf: {communique.reference}</div>
                    <div className="communique-category-badge">{communique.category}</div>
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="communique-content">
                  <div className="communique-date-section">
                    <span className="communique-date">
                      📅 {new Date(communique.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="communique-title">
                    <Link to={`/ressources/communiques/${communique.id}`}>
                      {communique.title}
                    </Link>
                  </h3>

                  <p className="communique-excerpt">
                    {communique.excerpt}
                  </p>

                  {/* Indicateurs visuels */}
                  <div className="communique-indicators">
                    {communique.attachments && communique.attachments.length > 0 && (
                      <div className="indicator-item attachments-indicator">
                        <span className="indicator-icon">📎</span>
                        <span className="indicator-text">
                          {communique.attachments.length} pièce{communique.attachments.length > 1 ? 's' : ''} jointe{communique.attachments.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <div className="indicator-item read-time">
                      <span className="indicator-icon">⏱️</span>
                      <span className="indicator-text">2 min de lecture</span>
                    </div>
                  </div>
                </div>

                {/* Footer avec actions améliorées */}
                <div className="communique-footer">
                  <div className="communique-actions">
                    <Link to={`/ressources/communiques/${communique.id}`} className="communique-read-more">
                      <span className="read-more-text">Lire le communiqué</span>
                      <span className="read-more-arrow">→</span>
                    </Link>

                    <div className="communique-quick-actions">
                      <button className="quick-action-btn" title="Marquer comme lu">
                        ✅
                      </button>
                      <button className="quick-action-btn" title="Partager">
                        🔗
                      </button>
                      <button className="quick-action-btn" title="Télécharger">
                        ⬇️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Effet de survol amélioré */}
                <div className="communique-hover-effect"></div>
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

export default Communiques;
