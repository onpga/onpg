import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../components/Skeleton';
import { getImageWithFallback } from '../../utils/imageFallback';
import './Actualites.css';
import { fetchResourceData } from '../../utils/pageMocksApi';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  pole: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  author: {
    name: string;
    role: string;
  };
  content?: string;
}

// Layout 1 : Inspiré de Notion Blog - Épuré, cards compactes, typographie soignée
const RessourcesActualites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'pedagogique', label: 'Guides' },
    { id: 'actualites', label: 'Actualités' },
    { id: 'comparatifs', label: 'Comparatifs' },
    { id: 'innovations', label: 'Innovations' },
    { id: 'communiques', label: 'Communiqués' },
    { id: 'partenariats', label: 'Partenariats' }
  ];

  const categoryColors: {[key: string]: string} = {
    'pedagogique': '#2E8B57',
    'actualites': '#00A651',
    'comparatifs': '#228B22',
    'innovations': '#32CD32',
    'communiques': '#006400',
    'partenariats': '#008000'
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.id === category)?.label || category;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || '#002F6C';
  };

  // Données mockées réalistes pour l'ONPG
  const mockArticles: Article[] = [
    {
      _id: '1',
      title: 'Nouveau décret sur la dispensation des médicaments en officine',
      slug: 'decret-dispensation-medicaments-2024',
      excerpt: 'Le ministre de la Santé annonce de nouvelles mesures concernant la dispensation des médicaments en officine pharmaceutique. Ces changements visent à améliorer la sécurité des patients et optimiser les pratiques professionnelles.',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
      category: 'actualites',
      pole: 'Énergie',
      publishedAt: '2024-01-15T10:00:00Z',
      readTime: 5,
      tags: ['décret', 'dispensation', 'médicaments', 'sécurité'],
      featured: true,
      author: {
        name: 'Dr Patience Asseko NTOGONO OKE',
        role: 'Présidente de l\'ONPG'
      }
    },
    {
      _id: '2',
      title: 'Formation continue obligatoire : Nouveaux programmes pour 2024',
      slug: 'formation-continue-obligatoire-2024',
      excerpt: 'L\'ONPG lance de nouveaux programmes de formation continue pour les pharmaciens. Découvrez les exigences et les avantages de ces formations certifiées en pharmacologie clinique et gestion des risques.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      category: 'pedagogique',
      pole: 'Sécurité Numérique',
      publishedAt: '2024-01-12T14:30:00Z',
      readTime: 7,
      tags: ['formation', 'obligation', '2024', 'certification', 'pharmacologie'],
      featured: false,
      author: {
        name: 'Pr. Jean Martin',
        role: 'Directeur Formation ONPG'
      }
    },
    {
      _id: '3',
      title: 'Étude exclusive : Impact économique des médicaments génériques',
      slug: 'etude-impact-economique-generiques',
      excerpt: 'Une étude réalisée par l\'ONPG révèle l\'impact positif majeur des médicaments génériques sur les dépenses de santé publique au Gabon avec des économies substantielles.',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop',
      category: 'innovations',
      pole: 'Drone',
      publishedAt: '2024-01-10T09:15:00Z',
      readTime: 8,
      tags: ['génériques', 'dépenses', 'étude', 'économie', 'santé publique'],
      featured: true,
      author: {
        name: 'Dr. Sophie Bernard',
        role: 'Économiste de la santé'
      }
    },
    {
      _id: '4',
      title: 'Protocoles de sécurité médicamenteuse renforcés',
      slug: 'protocoles-securite-medicamenteuse-2024',
      excerpt: 'L\'ONPG présente les nouveaux protocoles de sécurité médicamenteuse pour les officines. Formation obligatoire pour tous les pharmaciens avec prévention des erreurs médicamenteuses.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      category: 'communiques',
      pole: 'Géospatial',
      publishedAt: '2024-01-08T16:45:00Z',
      readTime: 6,
      tags: ['sécurité', 'protocoles', 'officines', 'prévention', 'erreurs'],
      featured: false,
      author: {
        name: 'Dr. Pierre Dubois',
        role: 'Expert en pharmacovigilance'
      }
    },
    {
      _id: '5',
      title: 'Négociations prix médicaments : Avancées significatives',
      slug: 'negociations-prix-medicaments-2024',
      excerpt: 'Les négociations entre l\'ONPG et les laboratoires pharmaceutiques aboutissent à de nouveaux accords avantageux pour le système de santé et l\'accessibilité aux médicaments essentiels.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      category: 'partenariats',
      pole: 'Énergie',
      publishedAt: '2024-01-05T11:20:00Z',
      readTime: 4,
      tags: ['prix', 'négociations', 'laboratoires', 'accessibilité', 'médicaments'],
      featured: false,
      author: {
        name: 'Mme Claire Leroy',
        role: 'Négociatrice ONPG'
      }
    },
    {
      _id: '6',
      title: 'Journée mondiale de la pharmacie : Programme spécial ONPG',
      slug: 'journee-mondiale-pharmacie-2024',
      excerpt: 'L\'ONPG organise une journée exceptionnelle pour célébrer la profession pharmaceutique avec conférences, stands d\'information et consultations gratuites.',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&h=400&fit=crop',
      category: 'actualites',
      pole: 'Sécurité Numérique',
      publishedAt: '2024-01-03T08:00:00Z',
      readTime: 3,
      tags: ['journée mondiale', 'pharmacie', 'sensibilisation', 'événements', 'célébration'],
      featured: false,
      author: {
        name: 'Équipe Communication ONPG',
        role: 'Service Communication'
      }
    },
    {
      _id: '7',
      title: 'Technologies innovantes : L\'IA au service des patients',
      slug: 'intelligence-artificielle-pharmacie-2024',
      excerpt: 'L\'ONPG explore les applications de l\'intelligence artificielle dans les pratiques pharmaceutiques modernes avec des applications pilotes prometteuses.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
      category: 'innovations',
      pole: 'Drone',
      publishedAt: '2024-01-01T12:30:00Z',
      readTime: 9,
      tags: ['IA', 'technologie', 'innovation', 'numérique', 'applications'],
      featured: true,
      author: {
        name: 'Dr. Ahmed Kone',
        role: 'Innovateur numérique'
      }
    },
    {
      _id: '8',
      title: 'Pharmacie rurale : Programme d\'accompagnement renforcé',
      slug: 'programme-pharmacie-rurale-2024',
      excerpt: 'Nouveau programme ONPG pour soutenir les pharmaciens exerçant en zone rurale avec aides financières, formations spécialisées et réseau de soutien technique.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
      category: 'pedagogique',
      pole: 'Géospatial',
      publishedAt: '2023-12-28T15:10:00Z',
      readTime: 6,
      tags: ['rural', 'accompagnement', 'territorial', 'accessibilité', 'formations'],
      featured: false,
      author: {
        name: 'Direction Régionale ONPG',
        role: 'Services Territoriaux'
      }
    },
    {
      _id: '9',
      title: 'Vaccination COVID-19 : Bilan et perspectives 2024',
      slug: 'vaccination-covid-bilan-2024',
      excerpt: 'L\'ONPG dresse le bilan de la campagne de vaccination COVID-19 et présente les perspectives pour 2024 avec l\'arrivée de nouveaux vaccins.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop',
      category: 'actualites',
      pole: 'Énergie',
      publishedAt: '2023-12-26T10:45:00Z',
      readTime: 7,
      tags: ['vaccination', 'COVID-19', 'bilan', 'perspectives', '2024'],
      featured: true,
      author: {
        name: 'Dr. Fatima Mbeki',
        role: 'Coordonnatrice Vaccination ONPG'
      }
    },
    {
      _id: '10',
      title: 'Prix Galien Gabon 2023 : Lauréats et innovations',
      slug: 'prix-galien-gabon-2023-laureats',
      excerpt: 'Découvrez les lauréats du Prix Galien Gabon 2023 qui récompense l\'excellence en recherche pharmaceutique et les innovations thérapeutiques.',
      image: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&h=400&fit=crop',
      category: 'innovations',
      pole: 'Sécurité Numérique',
      publishedAt: '2023-12-24T14:20:00Z',
      readTime: 5,
      tags: ['prix galien', 'lauréats', 'innovation', 'recherche', 'thérapeutique'],
      featured: false,
      author: {
        name: 'Comité Scientifique ONPG',
        role: 'Prix Galien Gabon'
      }
    }
  ];

  useEffect(() => {
    const loadActualites = async () => {
      setLoading(true);
      try {
        const data = await fetchResourceData('actualites');
        if (!data) {
          setArticles([]);
          setFilteredArticles([]);
          return;
        }

        // Gérer un tableau de données
        const rawArray = Array.isArray(data) ? data : [data];
        
        const mapped: Article[] = rawArray.map((item: any) => ({
          _id: String(item._id || ''),
          title: item.title || '',
          slug: item.title ? item.title.toLowerCase().replace(/\s+/g, '-') : '',
          excerpt: item.excerpt || item.summary || '',
          image: item.image || item.featuredImage || '',
          category: item.category || 'actualites',
          pole: item.pole || 'Général',
          publishedAt: item.date || item.publishedAt || new Date().toISOString(),
          readTime: item.readTime || 5,
          tags: item.tags || [],
          featured: item.featured || false,
          author: item.author || {
            name: 'ONPG',
            role: 'Équipe Communication'
          },
          content: item.content || ''
        }));

        setArticles(mapped);
        setFilteredArticles(mapped);
      } catch (error) {
        console.error('Erreur chargement actualités:', error);
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadActualites();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, searchQuery, selectedTag, articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(a =>
        a.tags && a.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.tags && a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    setFilteredArticles(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('');
  };

  return (
    <div className="ressources-page">
      {/* Hero Section */}
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Actualités</span>
              <span className="hero-title-subtitle">ONPG</span>
            </h1>
            <p className="hero-description">
              Restez informé des dernières actualités, communiqués et innovations de l'Ordre National des Pharmaciens du Gabon.
              Informations officielles, guides pratiques et actualités pharmaceutiques.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{filteredArticles.length}</div>
              <div className="stat-label">Articles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{filteredArticles.filter(a => a.featured).length}</div>
              <div className="stat-label">À la une</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categories.length - 1}</div>
              <div className="stat-label">Catégories</div>
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
        <main className="ressources-main-modern">
          <nav className="breadcrumb-modern">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Actualités</span>
          </nav>

          {/* Filtres horizontaux modernes */}
          <div className="filters-modern-container">
            <div className="filters-header-modern">
              <div className="filters-header-left">
                <h2 className="results-title-modern">
                  {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                </h2>
                <div className="results-meta-modern">
                  {filteredArticles.filter(a => a.featured).length > 0 && `${filteredArticles.filter(a => a.featured).length} à la une`}
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
            <div className="search-bar-modern">
              <div className="search-input-wrapper-modern">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par titre, contenu, tags..."
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
            </div>

            {/* Filtres collapsibles */}
            <div className={`filters-content-modern ${filtersOpen ? 'open' : ''}`}>
              <div className="filters-grid-modern">
                {/* Filtre Catégorie */}
                <div className="filter-group-modern">
                  <label className="filter-label-modern">Catégorie</label>
                  <div className="filter-chips-modern">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        className={`filter-chip-modern ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={selectedCategory === cat.id ? {
                          background: `linear-gradient(135deg, ${getCategoryColor(cat.id)}, ${getCategoryColor(cat.id)}dd)`
                        } : {}}
                      >
                        {cat.label}
                        {cat.id !== 'all' && (
                          <span className="chip-count">
                            ({articles.filter(a => a.category === cat.id).length})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre Tags */}
                {allTags.length > 0 && (
                  <div className="filter-group-modern">
                    <label className="filter-label-modern">Tags</label>
                    <div className="filter-chips-modern">
                      <button
                        className={`filter-chip-modern ${selectedTag === '' ? 'active' : ''}`}
                        onClick={() => setSelectedTag('')}
                      >
                        Tous les tags
                      </button>
                      {allTags.slice(0, 15).map(tag => (
                        <button
                          key={tag}
                          className={`filter-chip-modern ${selectedTag === tag ? 'active' : ''}`}
                          onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                        >
                          #{tag}
                          <span className="chip-count">
                            ({articles.filter(a => a.tags && a.tags.includes(tag)).length})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions filtres */}
              <div className="filters-actions-modern">
                <button onClick={clearFilters} className="clear-filters-btn-modern">
                  <span>🗑️</span> Effacer tous les filtres
                </button>
                <div className="filters-stats-modern">
                  <div className="stat-mini">
                    <span className="stat-mini-value">{filteredArticles.filter(a => a.featured).length}</span>
                    <span className="stat-mini-label">À la une</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{categories.length - 1}</span>
                    <span className="stat-mini-label">Catégories</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-mini-value">{allTags.length}</span>
                    <span className="stat-mini-label">Tags</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="articles-grid-modern">
              <SkeletonArticle />
              <SkeletonArticle />
              <SkeletonArticle />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="empty-state-modern">
              <div className="empty-icon">📰</div>
              <h3>Aucun article trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
              <button onClick={clearFilters} className="empty-action-btn">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="articles-grid-modern">
              {filteredArticles.map(article => {
                const articleId = String(article._id);
                return (
                  <Link
                    key={articleId}
                    to={`/ressources/actualites/${articleId}`}
                    className={`article-card-modern ${article.featured ? 'featured' : ''}`}
                  >
                    <div className="article-card-image-modern">
                      <img 
                        src={getImageWithFallback(article.image, 'article')} 
                        alt={article.title}
                      />
                      {article.featured && (
                        <div className="featured-badge-modern">⭐ À la une</div>
                      )}
                      <div
                        className="article-category-badge-modern"
                        style={{ backgroundColor: getCategoryColor(article.category) }}
                      >
                        {getCategoryLabel(article.category)}
                      </div>
                    </div>
                    <div className="article-card-content-modern">
                      <div className="article-card-meta-modern">
                        <span className="article-date-modern">
                          {new Date(article.publishedAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="article-readtime-modern">{article.readTime} min de lecture</span>
                      </div>
                      <h3 className="article-card-title-modern">{article.title}</h3>
                      <p className="article-card-excerpt-modern">{article.excerpt}</p>
                      {article.tags && article.tags.length > 0 && (
                        <div className="article-card-tags-modern">
                          {article.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="article-tag-modern">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="article-card-footer-modern">
                        <div className="article-author-modern">
                          <span className="author-name">{article.author?.name || 'ONPG'}</span>
                          <span className="author-role">{article.author?.role || 'Équipe Communication'}</span>
                        </div>
                        <span className="read-more-modern">Lire l'article →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RessourcesActualites;
