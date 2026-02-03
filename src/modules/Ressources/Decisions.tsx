import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Types pour les décisions
interface Decision {
  id: string;
  reference: string;
  title: string;
  date: string;
  jurisdiction: string;
  category: string;
  summary: string;
  parties: string[];
  decision: 'favorable' | 'defavorable' | 'partiellement favorable' | 'irrecevable';
  keywords: string[];
  downloads: number;
  citations: number;
  featured: boolean;
}

// Données fictives de décisions
const mockDecisions: Decision[] = [
  {
    id: '1',
    reference: 'DEC-2024-001',
    title: 'Décision relative à l\'inscription au tableau de l\'Ordre d\'un pharmacien étranger',
    date: '2024-01-20',
    jurisdiction: 'Conseil National de l\'Ordre',
    category: 'Inscription',
    summary: 'Le Conseil National décide de l\'inscription au tableau de l\'Ordre d\'un pharmacien titulaire d\'un diplôme étranger, sous réserve de validation des équivalences.',
    parties: ['Demandeur : Dr. Jean Dupont', 'Ordre National des Pharmaciens du Gabon'],
    decision: 'favorable',
    keywords: ['inscription', 'diplôme étranger', 'équivalence', 'tableau'],
    downloads: 234,
    citations: 8,
    featured: true
  },
  {
    id: '2',
    reference: 'DEC-2023-156',
    title: 'Sanction disciplinaire pour violation des règles déontologiques',
    date: '2023-12-15',
    jurisdiction: 'Chambre Disciplinaire',
    category: 'Déontologie',
    summary: 'Prononcé d\'une sanction disciplinaire de suspension temporaire pour violation des règles déontologiques relatives à la publicité des médicaments.',
    parties: ['Prévenu : Pharmacie Centrale SA', 'Ministère Public Ordinal'],
    decision: 'defavorable',
    keywords: ['sanction', 'déontologie', 'publicité', 'suspension'],
    downloads: 456,
    citations: 15,
    featured: false
  },
  {
    id: '3',
    reference: 'DEC-2023-089',
    title: 'Recours contre décision de radiation du tableau',
    date: '2023-11-30',
    jurisdiction: 'Conseil National de l\'Ordre',
    category: 'Radiation',
    summary: 'Rejet du recours formé contre la décision de radiation du tableau pour faute professionnelle grave.',
    parties: ['Recourant : Dr. Marie Leroy', 'Ordre National des Pharmaciens du Gabon'],
    decision: 'defavorable',
    keywords: ['recours', 'radiation', 'faute professionnelle', 'rejet'],
    downloads: 321,
    citations: 12,
    featured: false
  }
];

const Decisions = () => {
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions);
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>(mockDecisions);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedDecision, setSelectedDecision] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'citations'>('date');
  const [currentPage, setCurrentPage] = useState(1);

  const decisionsPerPage = 6;

  useEffect(() => {
    let filtered = decisions.filter(decision => {
      const matchesSearch = decision.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           decision.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Toutes' || decision.category === selectedCategory;
      const matchesDecision = selectedDecision === 'Toutes' || decision.decision === selectedDecision;
      return matchesSearch && matchesCategory && matchesDecision;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'citations':
          return b.citations - a.citations;
        default:
          return 0;
      }
    });

    setFilteredDecisions(filtered);
    setCurrentPage(1);
  }, [decisions, searchQuery, selectedCategory, selectedDecision, sortBy]);

  const totalPages = Math.ceil(filteredDecisions.length / decisionsPerPage);
  const currentDecisions = filteredDecisions.slice((currentPage - 1) * decisionsPerPage, currentPage * decisionsPerPage);

  const stats = useMemo(() => ({
    totalDecisions: decisions.length,
    totalCitations: decisions.reduce((sum, d) => sum + d.citations, 0),
    featuredDecisions: decisions.filter(d => d.featured).length
  }), [decisions]);

  const getDecisionLabel = (decision: Decision['decision']) => {
    const labels = {
      'favorable': 'Favorable',
      'defavorable': 'Défavorable',
      'partiellement favorable': 'Partiellement favorable',
      'irrecevable': 'Irrecevable'
    };
    return labels[decision];
  };

  const getDecisionColor = (decision: Decision['decision']) => {
    const colors = {
      'favorable': '#27ae60',
      'defavorable': '#e74c3c',
      'partiellement favorable': '#f39c12',
      'irrecevable': '#7f8c8d'
    };
    return colors[decision];
  };

  return (
    <div className="ressources-page">
      <section className="ressources-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Jurisprudence</span>
              <span className="hero-title-subtitle">Décisions</span>
            </h1>
            <p className="hero-description">
              Décisions de justice, avis et jurisprudences relatives à l'exercice de la pharmacie au Gabon.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalDecisions}</div>
              <div className="stat-label">Décisions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCitations}</div>
              <div className="stat-label">Citations</div>
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
                  placeholder="Référence, titre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Type de décision</h3>
            <div className="category-filters">
              <button
                className={`category-filter ${selectedDecision === 'Toutes' ? 'active' : ''}`}
                onClick={() => setSelectedDecision('Toutes')}
              >
                Toutes les décisions
              </button>
              {['favorable', 'defavorable', 'partiellement favorable', 'irrecevable'].map(decision => (
                <button
                  key={decision}
                  className={`category-filter ${selectedDecision === decision ? 'active' : ''}`}
                  onClick={() => setSelectedDecision(decision)}
                >
                  {getDecisionLabel(decision as Decision['decision'])}
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
            <span className="breadcrumb-current">Décisions</span>
          </nav>

          <div className="decisions-list">
            {currentDecisions.map(decision => (
              <article key={decision.id} className={`decision-card ${decision.featured ? 'featured' : ''}`}>
                <div className="decision-header">
                  <div className="decision-meta">
                    <span
                      className="decision-type"
                      style={{ backgroundColor: getDecisionColor(decision.decision) }}
                    >
                      {getDecisionLabel(decision.decision)}
                    </span>
                    {decision.featured && <span className="featured-badge">⭐</span>}
                    <span className="decision-reference">{decision.reference}</span>
                  </div>
                  <div className="decision-category">{decision.category}</div>
                </div>

                <div className="decision-content">
                  <h3 className="decision-title">
                    <Link to={`/ressources/decisions/${decision.id}`}>
                      {decision.title}
                    </Link>
                  </h3>

                  <div className="decision-date">
                    📅 {new Date(decision.date).toLocaleDateString('fr-FR')}
                  </div>

                  <div className="decision-jurisdiction">
                    ⚖️ {decision.jurisdiction}
                  </div>

                  <p className="decision-summary">{decision.summary}</p>

                  <div className="decision-parties">
                    <strong>Parties :</strong>
                    <ul>
                      {decision.parties.map((party, index) => (
                        <li key={index}>{party}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="decision-footer">
                  <div className="decision-stats">
                    <span>📄 {decision.downloads} téléchargements</span>
                    <span>📊 {decision.citations} citations</span>
                  </div>
                  <Link to={`/ressources/decisions/${decision.id}`} className="decision-read-more">
                    📖 Consulter →
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

export default Decisions;

