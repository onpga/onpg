import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonArticle } from '../../components/Skeleton';
import './Actualites.css';

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
}

// Layout 1 : Inspiré de Notion Blog - Épuré, cards compactes, typographie soignée
const RessourcesActualites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedPole, setSelectedPole] = useState<string>('all');

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

  const poles = ['Énergie', 'Sécurité Numérique', 'Drone', 'Géospatial'];

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
        name: 'Dr. Marie Dupont',
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
    // Utiliser les données mockées au lieu d'appeler l'API
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000); // Simuler un délai de chargement
  }, []);

  useEffect(() => {
    filterArticles();
  }, [selectedCategory, selectedPole, searchQuery, selectedTag, articles]);

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

    if (selectedPole !== 'all') {
      filtered = filtered.filter(a => a.pole === selectedPole);
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

  return (
    <div className="actualites-page notion-layout">
      <header className="notion-header">
        <div className="container">
          <div className="notion-header-badge">Actualités</div>
          <h1>Actualités ONPG</h1>
          <p className="notion-subtitle">Restez informé des dernières actualités de l'Ordre National des Pharmaciens du Gabon</p>
        </div>
      </header>

      <section className="notion-filters">
        <div className="container">
          <div className="notion-search">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notion-search-input"
            />
          </div>

          <div className="notion-filters-row">
            <div className="notion-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`notion-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="notion-poles">
              <select
                value={selectedPole}
                onChange={(e) => setSelectedPole(e.target.value)}
                className="notion-pole-select"
              >
                <option value="all">Tous les pôles</option>
                {poles.map(pole => (
                  <option key={pole} value={pole}>{pole}</option>
                ))}
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="notion-tags">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`notion-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="notion-articles">
        <div className="container">
          {loading ? (
            <div className="notion-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonArticle key={i} />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="notion-empty">
              <p>Aucun article trouvé</p>
            </div>
          ) : (
            <div className="notion-grid">
              {filteredArticles.map(article => (
                <Link
                  key={article._id}
                  to={`/actualites/${article.slug}`}
                  className="notion-card"
                >
                  {article.image && (
                    <div className="notion-card-image">
                      <img src={article.image} alt={article.title} />
                      <div
                        className="notion-card-badge"
                        style={{ backgroundColor: getCategoryColor(article.category) }}
                      >
                        {getCategoryLabel(article.category)}
                      </div>
                    </div>
                  )}
                  <div className="notion-card-content">
                    <div className="notion-card-meta">
                      <span className="notion-card-category">{article.category}</span>
                      <span className="notion-card-pole">{article.pole}</span>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <div className="notion-card-footer">
                      <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                      <span>{article.readTime} min</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="notion-card-tags">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="notion-card-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RessourcesActualites;
