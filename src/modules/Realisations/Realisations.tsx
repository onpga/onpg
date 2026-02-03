import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Realisations.css';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  pole: string;
  mainImage: string;
  location: {
    city: string;
    country: string;
  };
  date: string;
  status: string;
  featured: boolean;
  tags: string[];
}

const Realisations = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPole, setSelectedPole] = useState<string>('tous');

  const poles = [
    { id: 'tous', label: 'Tous les projets', icon: '' },
    { id: 'energie', label: 'Énergie', icon: '' },
    { id: 'geospatial', label: 'Géospatial', icon: '' },
    { id: 'drone', label: 'Drones', icon: '' },
    { id: 'sante', label: 'Santé', icon: '' },
    { id: 'securite', label: 'Sécurité Numérique', icon: '' }
  ];

  const poleColors: {[key: string]: string} = {
    'energie': '#252572',
    'geospatial': '#36601e',
    'drone': '#1b77b6',
    'sante': '#22a6e1',
    'securite': '#DBB041'
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [selectedPole, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Erreur lors du chargement des projets');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (selectedPole === 'tous') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.pole === selectedPole));
    }
  };

  const getPoleLabel = (pole: string) => {
    return poles.find(p => p.id === pole)?.label || pole;
  };

  // Composant pour animer les stats du hero
  const AnimatedStatsRow = ({ projectsCount }: { projectsCount: number }) => {
    const statsRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [counters, setCounters] = useState({
      projects: 0,
      poles: 0,
      clients: 0
    });

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        },
        { threshold: 0.3 }
      );

      if (statsRef.current) {
        observer.observe(statsRef.current);
      }

      return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounters({
          projects: Math.floor(projectsCount * progress),
          poles: Math.floor(5 * progress),
          clients: Math.floor(100 * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters({
            projects: projectsCount,
            poles: 5,
            clients: 100
          });
        }
      }, interval);

      return () => clearInterval(timer);
    }, [isVisible, projectsCount]);

    return (
      <div ref={statsRef} className="stats-row">
        <div className="stat-item">
          <span className="stat-number">{counters.projects}+</span>
          <span className="stat-label">Projets réalisés</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{counters.poles}</span>
          <span className="stat-label">Pôles d'activité</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{counters.clients}%</span>
          <span className="stat-label">Clients satisfaits</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="realisations-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="realisations-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={fetchProjects} className="retry-btn">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="realisations-page">
      {/* Hero Section */}
      <section className="realisations-hero">
        <div className="container">
          <div className="hero-content-wrapper">
            <div className="realisations-hero-badge">Réalisations</div>
            <h1>NOS RÉALISATIONS</h1>
            <p className="hero-subtitle">
              Découvrez nos projets innovants à travers tout<br />le Gabon et l'Afrique centrale
            </p>
          </div>
          <AnimatedStatsRow projectsCount={projects.length} />
        </div>
      </section>

      {/* Filtres par pôle */}
      <section className="filters-section">
        <div className="container">
          <div className="filters">
            {poles.map(pole => (
              <button
                key={pole.id}
                className={`filter-btn ${selectedPole === pole.id ? 'active' : ''}`}
                onClick={() => setSelectedPole(pole.id)}
                style={
                  selectedPole === pole.id && pole.id !== 'tous'
                    ? { 
                        backgroundColor: poleColors[pole.id], 
                        borderColor: poleColors[pole.id],
                        color: 'white'
                      }
                    : {}
                }
              >
                <span className="filter-icon">{pole.icon}</span>
                <span className="filter-label">{pole.label}</span>
              </button>
            ))}
          </div>
          <p className="results-count">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Galerie de projets */}
      <section className="projects-grid-section">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="no-results">
              <p>Aucun projet trouvé pour ce filtre</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <Link 
                  to={`/realisations/${project._id}`} 
                  key={project._id} 
                  className="project-card"
                >
                  <div className="project-image">
                    <img src={project.mainImage} alt={project.title} />
                    {project.featured && (
                      <div className="featured-badge">Projet phare</div>
                    )}
                    <div 
                      className="project-pole-badge"
                      style={{ backgroundColor: poleColors[project.pole] }}
                    >
                      {poles.find(p => p.id === project.pole)?.icon} {getPoleLabel(project.pole)}
                    </div>
                  </div>
                  
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    
                    <p className="project-description">
                      {project.shortDescription}
                    </p>
                    
                    <div className="project-meta">
                      <span className="project-location">
                        {project.location.city}, {project.location.country}
                      </span>
                    </div>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="project-tags">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="project-cta">
                      <span>Voir le projet</span>
                      <span className="arrow">→</span>
                    </div>
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

export default Realisations;

