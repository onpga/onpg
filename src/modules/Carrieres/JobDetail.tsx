import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './JobDetail.css';
import { useToast } from '../../components/Toast';
import { updateMetaTag, updateCanonical, updateOpenGraph, updateTwitterCard, addStructuredData } from '../../utils/seo';

interface Job {
  _id: string;
  titre: string;
  type: string;
  localisation: string;
  departement: string;
  description: string;
  competences: string[];
  experience: string;
  missions?: string[];
  profil?: string;
  avantages?: string[];
  actif: boolean;
}

const JobDetail = () => {
  const { showSuccess, showError } = useToast();
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  
  const handleRetourOffres = () => {
    navigate('/carrieres');
    // Attendre que la navigation soit terminée avant de scroller
    setTimeout(() => {
      const offresSection = document.getElementById('offres-emploi');
      if (offresSection) {
        offresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: '',
    cv: null as File | null
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error('Offre non trouvée');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setJob(data.data);
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  // Mise à jour des meta tags SEO
  useEffect(() => {
    if (job) {
      const baseUrl = 'https://csip.up.railway.app';
      const currentUrl = `${baseUrl}/carrieres/${job._id}`;
      
      // Title et description
      document.title = `${job.titre} | CIPS Carrières`;
      updateMetaTag('description', job.description.substring(0, 160));
      
      // Canonical
      updateCanonical(currentUrl);
      
      // Open Graph
      updateOpenGraph({
        title: job.titre,
        description: job.description.substring(0, 200),
        url: currentUrl,
        type: 'job'
      });
      
      // Twitter Card
      updateTwitterCard({
        title: job.titre,
        description: job.description.substring(0, 200),
        card: 'summary'
      });
      
      // Structured Data (Schema.org - JobPosting)
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.titre,
        "description": job.description,
        "employmentType": job.type,
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.localisation,
            "addressCountry": "GA"
          }
        },
        "hiringOrganization": {
          "@type": "Organization",
          "name": "CIPS - Conception Innovante pour la Sécurité",
          "sameAs": "https://csip.up.railway.app"
        }
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier la taille (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        showError('Le fichier est trop volumineux. Taille maximum : 5 MB');
        e.target.value = ''; // Reset l'input
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showError('Format de fichier non accepté. Utilisez PDF ou Word (.doc, .docx)');
        e.target.value = ''; // Reset l'input
        return;
      }
      
      setFormData({
        ...formData,
        cv: file
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cv) {
      showError('Veuillez sélectionner votre CV');
      return;
    }
    
    try {
      // Utiliser FormData pour envoyer le fichier
      const formDataToSend = new FormData();
      formDataToSend.append('jobId', job?._id || '');
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('message', formData.message);
      
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      console.log('📤 Envoi de la candidature avec CV...');

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formDataToSend
        // Ne pas définir Content-Type, le navigateur le fait automatiquement avec boundary
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Candidature envoyée avec succès');
        showSuccess('Votre candidature a été envoyée avec succès ! Nous vous contacterons bientôt.');
        setTimeout(() => handleRetourOffres(), 1500);
      } else {
        showError('Erreur : ' + (data.message || 'Une erreur est survenue'));
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      showError('Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="job-detail-page">
        <section className="section">
          <div className="container">
            <div className="loading-state">Chargement...</div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page">
        <section className="section">
          <div className="container">
            <div className="error-state">
              <p>Offre non trouvée</p>
              <Link to="/carrieres" className="btn btn-secondary">Retour aux offres</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      {/* Hero Section */}
      <section className="job-detail-hero">
        <div className="job-detail-hero-content">
          <button onClick={handleRetourOffres} className="back-link">← Retour aux offres</button>
          <div className="job-header">
            <div className="job-header-left">
              <h1>{job.titre}</h1>
              <div className="job-meta">
                <span className="job-type">{job.type}</span>
                <span>📍 {job.localisation}</span>
                <span>🏢 {job.departement}</span>
                <span>⏱️ {job.experience}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary btn-postuler"
            >
              Postuler maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Détails Section */}
      <section className="job-details section">
        <div className="container">
          <div className="job-details-grid">
            {/* Colonne gauche - Détails */}
            <div className="job-details-left">
              <div className="job-section">
                <h2>Description du poste</h2>
                <div 
                  className="job-description"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {job.missions && job.missions.length > 0 && (
                <div className="job-section">
                  <h2>Missions principales</h2>
                  <ul className="job-list">
                    {job.missions.map((mission, index) => (
                      <li key={index}>{mission}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="job-section">
                <h2>Compétences requises</h2>
                <div className="competences-tags">
                  {job.competences.map((comp, index) => (
                    <span key={index} className="competence-tag">{comp}</span>
                  ))}
                </div>
              </div>

              {job.profil && (
                <div className="job-section">
                  <h2>Profil recherché</h2>
                  <div 
                    className="job-profil"
                    dangerouslySetInnerHTML={{ __html: job.profil }}
                  />
                </div>
              )}

              {job.avantages && job.avantages.length > 0 && (
                <div className="job-section">
                  <h2>Avantages</h2>
                  <ul className="job-list">
                    {job.avantages.map((avantage, index) => (
                      <li key={index}>{avantage}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Colonne droite - CTA */}
            <div className="job-details-right">
              <div className="job-cta-card">
                <h3>Intéressé par ce poste ?</h3>
                <p>Rejoignez le Groupe CIPS et contribuez à la transformation technologique de l'Afrique</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary btn-block"
                >
                  Postuler maintenant
                </button>
                <button onClick={handleRetourOffres} className="btn btn-secondary btn-block">
                  Voir toutes les offres
                </button>
              </div>

              <div className="job-info-card">
                <h4>Informations</h4>
                <ul>
                  <li><strong>Type :</strong> {job.type}</li>
                  <li><strong>Localisation :</strong> {job.localisation}</li>
                  <li><strong>Département :</strong> {job.departement}</li>
                  <li><strong>Expérience :</strong> {job.experience}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de candidature (Modal/Section) */}
      {showForm && (
        <section className="job-application-form-section">
          <div className="application-overlay" onClick={() => setShowForm(false)}></div>
          <div className="application-form-container">
            <div className="application-form-header">
              <h2>Postuler : {job.titre}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-group">
                <label htmlFor="nom">Nom complet *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre.email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telephone">Téléphone *</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    placeholder="+241 XX XX XX XX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cv">CV (PDF ou Word) *</label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="file-input"
                />
                <div className="file-info">
                  Formats acceptés : PDF, DOC, DOCX • Taille max : 5 MB
                </div>
                {formData.cv && (
                  <div className="file-selected">
                    ✓ Fichier sélectionné : {formData.cv.name} ({(formData.cv.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Lettre de motivation *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Présentez votre parcours et votre motivation pour ce poste..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Envoyer ma candidature
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default JobDetail;

