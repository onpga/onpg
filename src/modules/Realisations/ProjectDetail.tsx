import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetail.css';
import { updateMetaTag, updateCanonical, updateOpenGraph, updateTwitterCard, addStructuredData } from '../../utils/seo';

interface ProjectDetail {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  pole: string;
  mainImage: string;
  images: Array<{ url: string; caption: string }>;
  videos: Array<{ url: string; title: string; thumbnail: string }>;
  beforeAfter: {
    before: { image: string; description: string };
    after: { image: string; description: string };
  };
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  client: {
    name: string;
    company: string;
    logo?: string;
  };
  testimonial: {
    text: string;
    author: string;
    position: string;
    photo?: string;
    rating: number;
  };
  results: Array<{ metric: string; value: string; icon: string }>;
  duration: string;
  budget: string;
  team: string;
  date: string;
  caseStudy: {
    challenge: string;
    solution: string;
    impact: string;
  };
  status: string;
  tags: string[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const poleLabels: {[key: string]: string} = {
    'energie': 'Pôle Énergie',
    'geospatial': 'Pôle Géospatial',
    'drone': 'Pôle Drones - ODS',
    'sante': 'Pôle Santé',
    'securite': 'Pôle Sécurité Numérique'
  };

  const poleColors: {[key: string]: string} = {
    'energie': '#252572',
    'geospatial': '#36601e',
    'drone': '#1b77b6',
    'sante': '#22a6e1',
    'securite': '#DBB041'
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Mise à jour des meta tags SEO
  useEffect(() => {
    if (project) {
      const baseUrl = 'https://csip.up.railway.app';
      const currentUrl = `${baseUrl}/realisations/${project._id}`;
      
      // Title et description
      document.title = `${project.title} | CIPS Réalisations`;
      updateMetaTag('description', project.shortDescription || project.description.substring(0, 160));
      
      // Canonical
      updateCanonical(currentUrl);
      
      // Open Graph
      updateOpenGraph({
        title: project.title,
        description: project.shortDescription || project.description.substring(0, 200),
        image: project.mainImage,
        url: currentUrl,
        type: 'website'
      });
      
      // Twitter Card
      updateTwitterCard({
        title: project.title,
        description: project.shortDescription || project.description.substring(0, 200),
        image: project.mainImage,
        card: 'summary_large_image'
      });
      
      // Structured Data (Schema.org)
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "Project",
        "name": project.title,
        "description": project.description,
        "image": project.mainImage,
        "url": currentUrl,
        "datePublished": project.date,
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": project.location?.city,
            "addressCountry": project.location?.country
          }
        }
      });
    }
  }, [project]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProject(data.data);
      } else {
        setError('Projet non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <Link to="/realisations" className="back-btn">← Retour aux réalisations</Link>
        </div>
      </div>
    );
  }

  const allImages = [{ url: project.mainImage, caption: 'Image principale' }, ...project.images];

  return (
    <div className="project-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Accueil</Link>
          <span> / </span>
          <Link to="/realisations">Réalisations</Link>
          <span> / </span>
          <span>{project.title}</span>
        </div>
      </div>

      {/* Hero Section avec Image */}
      <section className="project-hero">
        <div className="project-hero-image">
          <img src={project.mainImage} alt={project.title} />
          <div className="project-hero-overlay">
            <div className="container">
              <span className="project-pole-label" style={{ backgroundColor: poleColors[project.pole] }}>{poleLabels[project.pole]}</span>
              <h1>{project.title}</h1>
              <p className="project-location-hero">
                {project.location.city}, {project.location.country}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Info Bar */}
      <section className="project-info-bar">
        <div className="container">
          <div className="info-bar-grid">
            <div className="info-item">
              <span className="info-label">Durée</span>
              <span className="info-value">{project.duration}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Budget</span>
              <span className="info-value">{project.budget}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Équipe</span>
              <span className="info-value">{project.team}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="project-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column */}
            <div className="content-left">
              {/* Description */}
              <div className="section-block">
                <h2>À propos du projet</h2>
                <div 
                  className="project-description"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>

              {/* Case Study */}
              {project.caseStudy && (
                <div className="section-block">
                  <h2>Cas d'usage</h2>
                  <div className="case-study">
                    <div className="case-item">
                      <h3>Le défi</h3>
                      <p>{project.caseStudy.challenge}</p>
                    </div>
                    <div className="case-item">
                      <h3>La solution</h3>
                      <p>{project.caseStudy.solution}</p>
                    </div>
                    <div className="case-item">
                      <h3>L'impact</h3>
                      <p>{project.caseStudy.impact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Before/After */}
              {project.beforeAfter && project.beforeAfter.before && (
                <div className="section-block">
                  <h2>Avant / Après</h2>
                  <div className="before-after-grid">
                    <div className="before-after-item before">
                      <div className="before-after-image">
                        <img src={project.beforeAfter.before.image} alt="Avant" />
                        <span className="before-after-label">AVANT</span>
                      </div>
                      <p>{project.beforeAfter.before.description}</p>
                    </div>
                    <div className="before-after-item after">
                      <div className="before-after-image">
                        <img src={project.beforeAfter.after.image} alt="Après" />
                        <span className="before-after-label after-label">APRÈS</span>
                      </div>
                      <p>{project.beforeAfter.after.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery */}
              {allImages.length > 1 && (
                <div className="section-block">
                  <h2>Galerie photos</h2>
                  <div className="gallery">
                    <div className="gallery-main">
                      <img src={allImages[selectedImage].url} alt={allImages[selectedImage].caption} />
                      {allImages[selectedImage].caption && (
                        <p className="gallery-caption">{allImages[selectedImage].caption}</p>
                      )}
                    </div>
                    <div className="gallery-thumbnails">
                      {allImages.map((img, index) => (
                        <div
                          key={index}
                          className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img src={img.url} alt={img.caption} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Map */}
              {project.location.coordinates && project.location.coordinates.lat && (
                <div className="section-block">
                  <h2>Localisation</h2>
                  <div className="project-map">
                    <iframe
                      src={`https://www.google.com/maps?q=${project.location.coordinates.lat},${project.location.coordinates.lng}&hl=fr&z=14&output=embed`}
                      width="100%"
                      height="400"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Localisation - ${project.location.city}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="content-right">
              {/* Results */}
              {project.results && project.results.length > 0 && (
                <div className="sidebar-block results-block">
                  <h3>Résultats clés</h3>
                  <div className="results-list">
                    {project.results.map((result, index) => (
                      <div key={index} className="result-item">
                        <span className="result-icon">{result.icon}</span>
                        <div>
                          <p className="result-value">{result.value}</p>
                          <p className="result-metric">{result.metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client */}
              {project.client && (
                <div className="sidebar-block client-block">
                  <h3>Client</h3>
                  <div className="client-info">
                    <p className="client-name">{project.client.name}</p>
                    <p className="client-company">{project.client.company}</p>
                  </div>
                </div>
              )}

              {/* Testimonial */}
              {project.testimonial && (
                <div className="sidebar-block testimonial-block">
                  <h3>Témoignage</h3>
                  <div className="testimonial">
                    {project.testimonial.rating && (
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < project.testimonial.rating ? 'star filled' : 'star'}>
                            
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="testimonial-text">"{project.testimonial.text}"</p>
                    <div className="testimonial-author">
                      <p className="author-name">{project.testimonial.author}</p>
                      <p className="author-position">{project.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="sidebar-block tags-block">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="sidebar-block cta-block">
                <h3>Intéressé par nos services ?</h3>
                <p>Contactez-nous pour discuter de votre projet</p>
                <Link to="/devis" className="cta-btn">Demander un devis</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="back-section">
        <div className="container">
          <Link to="/realisations" className="back-link">← Retour aux réalisations</Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;

