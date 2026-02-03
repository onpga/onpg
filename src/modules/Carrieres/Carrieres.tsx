import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Carrieres.css';
import { useToast } from '../../components/Toast';

// Composants d'icônes
const BenefitIcon = ({ icon }: { icon: string }) => (
  <div className="benefit-icon">{icon}</div>
);

// Fonction pour extraire le texte brut du HTML
const stripHtml = (html: string): string => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Fonction pour tronquer le texte à une longueur maximale
const truncateText = (text: string, maxLength: number = 150): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

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
  actif: boolean;
}

const Carrieres = () => {
  const { showSuccess, showError } = useToast();
  const [offres, setOffres] = useState<Job[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPole, setSelectedPole] = useState<string>('tous');
  
  const poles = [
    { id: 'tous', label: 'Tous les pôles' },
    { id: 'Pôle Énergie', label: 'Pôle Énergie' },
    { id: 'Pôle Traitement de Données Géospatiales', label: 'Pôle Géospatial' },
    { id: 'ODS - Services Drones', label: 'Pôle Drones' },
    { id: 'Pôle Sécurité Numérique', label: 'Pôle Sécurité' },
    { id: 'Pôle Santé', label: 'Pôle Santé' }
  ];
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: '',
    cv: null as File | null
  });

  const [partnershipForm, setPartnershipForm] = useState({
    entreprise: '',
    nom: '',
    email: '',
    telephone: '',
    typePartenariat: '',
    message: ''
  });

  // Récupérer les offres d'emploi depuis l'API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des offres');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setOffres(data.data);
          setFilteredOffres(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filtrage par pôle
  useEffect(() => {
    if (selectedPole === 'tous') {
      setFilteredOffres(offres);
    } else {
      setFilteredOffres(offres.filter(offre => offre.departement === selectedPole));
    }
  }, [selectedPole, offres]);

  const avantages = [
    { icon: '', titre: 'Salaire Compétitif', description: 'Rémunération attractive et évolutive' },
    { icon: '', titre: 'Évolution de Carrière', description: 'Opportunités de développement professionnel' },
    { icon: '', titre: 'Formation Continue', description: 'Accès à des formations régulières' },
    { icon: '', titre: 'Couverture Santé', description: 'Assurance santé pour vous et votre famille' },
    { icon: '', titre: 'Impact Social', description: 'Contribuez au développement de l\'Afrique' },
    { icon: '', titre: 'Équipe Dynamique', description: 'Environnement de travail stimulant' }
  ];

  const typesPartenariat = [
    {
      titre: 'Distributeurs / Revendeurs',
      description: 'Devenez distributeur de nos solutions technologiques',
      icon: ''
    },
    {
      titre: 'Fournisseurs',
      description: 'Collaborez avec nous en tant que fournisseur de matériel ou services',
      icon: ''
    },
    {
      titre: 'ONG & Organisations',
      description: 'Partenariats pour des projets à impact social',
      icon: ''
    },
    {
      titre: 'Partenaires Technologiques',
      description: 'Alliances stratégiques pour l\'innovation',
      icon: ''
    }
  ];

  const valeurs = [
    'Innovation et excellence technique',
    'Engagement envers le développement durable',
    'Diversité et inclusion',
    'Esprit d\'équipe et collaboration',
    'Intégrité et transparence',
    'Passion pour l\'impact social'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cv) {
      showError('Veuillez joindre votre CV');
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('message', formData.message);
      // Pas de jobId pour candidature spontanée
      
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const successMessage = 'Votre candidature spontanée a été envoyée avec succès ! Nous vous contacterons bientôt.';
        showSuccess(successMessage, 7000);
        // Reset form
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          message: '',
          cv: null
        });
      } else {
        const errorMessage = data.message || 'Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la candidature:', error);
      showError('Erreur lors de l\'envoi de votre candidature. Veuillez réessayer plus tard.');
    }
  };

  const handlePartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/partnerships/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnershipForm),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const successMessage = 'Votre demande de partenariat a été envoyée avec succès ! Nous vous contacterons bientôt.';
        showSuccess(successMessage, 7000);
        // Reset form
        setPartnershipForm({
          entreprise: '',
          nom: '',
          email: '',
          telephone: '',
          typePartenariat: '',
          message: ''
        });
      } else {
        let errorMessage = data.error || 'Erreur lors de l\'envoi de votre demande. Veuillez vérifier les informations et réessayer.';
        if (data.details && data.details.length > 0) {
          errorMessage = data.details.map((err: any) => err.msg).join('. ');
        }
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande de partenariat:', error);
      showError('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handlePartnershipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPartnershipForm({
      ...partnershipForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="carrieres-page">
      {/* Hero Section */}
      <section className="carrieres-hero">
        <div className="carrieres-hero-content">
          <div className="carrieres-hero-badge">Carrières</div>
          <h1>CARRIÈRES & PARTENARIATS</h1>
          <p className="hero-subtitle">
            Rejoignez le Groupe CIPS et participez à la transformation technologique de l'Afrique
          </p>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="carrieres-valeurs section">
        <div className="container">
          <h2>Nos Valeurs d'Entreprise</h2>
          <p className="section-intro">
            Chez CIPS, nous croyons en une culture d'entreprise basée sur l'excellence, l'innovation et l'impact social.
          </p>
          <ul className="valeurs-list">
            {valeurs.map((valeur, index) => (
              <li key={index}>
                <span className="check-icon">✓</span>
                {valeur}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Offres d'emploi */}
      <section id="offres-emploi" className="carrieres-offres">
        <div className="container">
          <h2>Offres d'Emploi</h2>
          <p className="section-intro">
            Découvrez nos postes ouverts et trouvez l'opportunité qui vous correspond
          </p>
          
          {loading && (
            <div className="loading-state">
              <p>Chargement des offres d'emploi...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>Erreur : {error}</p>
            </div>
          )}
          
          {/* Filtres par pôle */}
          {!loading && !error && offres.length > 0 && (
            <div style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {poles.map(pole => (
                <button
                  key={pole.id}
                  onClick={() => setSelectedPole(pole.id)}
                  style={{
                    padding: '12px 24px',
                    border: `2px solid ${selectedPole === pole.id ? '#002F6C' : '#e0e0e0'}`,
                    backgroundColor: selectedPole === pole.id ? '#002F6C' : 'white',
                    color: selectedPole === pole.id ? 'white' : '#333',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {pole.label}
                </button>
              ))}
            </div>
          )}

          {!loading && !error && filteredOffres.length === 0 && offres.length > 0 && (
            <div className="empty-state">
              <p>Aucune offre d'emploi pour ce pôle.</p>
            </div>
          )}

          {!loading && !error && offres.length === 0 && (
            <div className="empty-state">
              <p>Aucune offre d'emploi disponible pour le moment.</p>
              <p>Revenez prochainement ou envoyez-nous une candidature spontanée !</p>
            </div>
          )}
          
          {!loading && !error && filteredOffres.length > 0 && (
            <div className="offres-grid">
              {filteredOffres.map((offre) => (
              <Link to={`/carrieres/${offre._id}`} key={offre._id} className="offre-card-link">
                <div className="offre-card">
                <div className="offre-header">
                  <h3>{offre.titre}</h3>
                  <span className="offre-type">{offre.type}</span>
                </div>
                <div className="offre-meta">
                  <span>{offre.localisation}</span>
                  <span>{offre.departement}</span>
                  <span>{offre.experience}</span>
                </div>
                <p className="offre-description">{truncateText(stripHtml(offre.description), 150)}</p>
                <div className="offre-competences">
                  <strong>Compétences recherchées :</strong>
                  <ul>
                    {offre.competences.map((comp, idx) => (
                      <li key={idx}>{comp}</li>
                    ))}
                  </ul>
                </div>
                <span className="btn btn-primary btn-small btn-view-detail">
                  Voir le détail →
                </span>
                </div>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Avantages */}
      <section className="carrieres-avantages">
        <div className="container">
          <h2>Pourquoi Rejoindre CIPS ?</h2>
          <div className="avantages-grid">
            {avantages.map((avantage, index) => (
              <div key={index} className="avantage-card">
                <BenefitIcon icon={avantage.icon} />
                <h3>{avantage.titre}</h3>
                <p>{avantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidature Spontanée */}
      <section id="candidature" className="carrieres-candidature section">
        <div className="container">
          <h2>Candidature Spontanée</h2>
          <p className="section-intro">
            Vous ne trouvez pas le poste qui vous correspond ? Envoyez-nous votre candidature spontanée !
          </p>
          <form onSubmit={handleSubmit} className="candidature-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom">Nom complet *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
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
              <label htmlFor="message">Lettre de motivation *</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cv">CV * (PDF, DOC ou DOCX - max 5MB)</label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid var(--cips-gray-light)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'Poppins, sans-serif',
                  cursor: 'pointer'
                }}
              />
              {formData.cv && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#002f6c' }}>
                  ✓ Fichier sélectionné : {formData.cv.name} ({(formData.cv.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Envoyer ma candidature
            </button>
          </form>
        </div>
      </section>

      {/* Partenariats */}
      <section className="carrieres-partenariats">
        <div className="container">
          <h2>Partenariats</h2>
          <p className="section-intro">
            Développons ensemble l'écosystème technologique africain
          </p>
          <div className="partenariats-types">
            {typesPartenariat.map((type, index) => (
              <div key={index} className="partenariat-type-card">
                <div className="partenariat-icon">{type.icon}</div>
                <h3>{type.titre}</h3>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire Partenariat */}
      <section className="carrieres-partenariat-form section">
        <div className="container">
          <h2>Demande de Partenariat</h2>
          <form onSubmit={handlePartnershipSubmit} className="partnership-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="entreprise">Nom de l'entreprise *</label>
                <input
                  type="text"
                  id="entreprise"
                  name="entreprise"
                  value={partnershipForm.entreprise}
                  onChange={handlePartnershipChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="p_nom">Nom du contact *</label>
                <input
                  type="text"
                  id="p_nom"
                  name="nom"
                  value={partnershipForm.nom}
                  onChange={handlePartnershipChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="p_email">Email *</label>
                <input
                  type="email"
                  id="p_email"
                  name="email"
                  value={partnershipForm.email}
                  onChange={handlePartnershipChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="p_telephone">Téléphone *</label>
                <input
                  type="tel"
                  id="p_telephone"
                  name="telephone"
                  value={partnershipForm.telephone}
                  onChange={handlePartnershipChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="typePartenariat">Type de partenariat *</label>
              <select
                id="typePartenariat"
                name="typePartenariat"
                value={partnershipForm.typePartenariat}
                onChange={handlePartnershipChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="distributeur">Distributeur / Revendeur</option>
                <option value="fournisseur">Fournisseur</option>
                <option value="ong">ONG / Organisation</option>
                <option value="technologique">Partenaire Technologique</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="p_message">Message *</label>
              <textarea
                id="p_message"
                name="message"
                rows={6}
                value={partnershipForm.message}
                onChange={handlePartnershipChange}
                placeholder="Décrivez votre projet de partenariat..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Envoyer la demande
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Carrieres;
