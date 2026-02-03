import { useState, useEffect } from 'react';
import './Devis.css';
import { trackDevisSubmit } from '../../utils/analytics';
import { useAutoSave } from '../../hooks/useAutoSave';
import FormProgress from '../../components/FormProgress';
import { useToast } from '../../components/Toast';

const Devis = () => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    // Informations personnelles
    fullName: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    country: 'Gabon',
    
    // Type de projet
    poles: [] as string[],
    specificServices: [] as string[],
    
    // Détails du projet
    projectDescription: '',
    desiredDate: '',
    estimatedBudget: '',
    
    // Services complémentaires
    additionalServices: [] as string[],
    
    // Préférences de contact
    contactPreference: [] as string[],
    callbackTime: '',
    
    // Consentement
    privacyConsent: false
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Status retiré - utilisation des toasts uniquement

  const totalSteps = 5;
  const stepLabels = [
    'Informations personnelles',
    'Sélection des pôles',
    'Détails du projet',
    'Services complémentaires',
    'Finalisation'
  ];

  // Validation par étape
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Le nom complet est requis';
        if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email invalide';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis';
        if (!formData.city.trim()) newErrors.city = 'La ville est requise';
        break;
      
      case 2:
        if (formData.poles.length === 0) {
          newErrors.poles = 'Veuillez sélectionner au moins un pôle';
        }
        break;
      
      case 3:
        if (!formData.projectDescription.trim()) {
          newErrors.projectDescription = 'La description du projet est requise';
        } else if (formData.projectDescription.trim().length < 20) {
          newErrors.projectDescription = 'La description doit contenir au moins 20 caractères';
        } else if (formData.projectDescription.trim().length > 3000) {
          newErrors.projectDescription = 'La description ne doit pas dépasser 3000 caractères';
        }
        break;
      
      case 5:
        if (!formData.privacyConsent) {
          newErrors.privacyConsent = 'Vous devez accepter la politique de confidentialité';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Auto-save du formulaire
  const { restoreDraft, clearDraft } = useAutoSave(formData, 'devis', 1000);

  // Restaurer le brouillon au chargement
  useEffect(() => {
    const saved = restoreDraft();
    if (saved) {
      setFormData(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const { checked } = checkbox;
      
      if (name === 'privacyConsent') {
        setFormData({ ...formData, [name]: checked });
      } else if (name === 'poles' || name === 'specificServices' || name === 'additionalServices' || name === 'contactPreference') {
        const currentArray = formData[name] as string[];
        setFormData({
          ...formData,
          [name]: checked 
            ? [...currentArray, value]
            : currentArray.filter(item => item !== value)
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider la dernière étape
    if (!validateStep(5)) {
      setActiveStep(5);
      return;
    }

    setLoading(true);
    // Status retiré - utilisation des toasts uniquement

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      const response = await fetch('/api/quotes/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        trackDevisSubmit(formData.poles[0]);
        clearDraft();
        
        const successMessage = 'Votre demande de devis a été envoyée avec succès ! Nous vous contacterons sous 48h.';
        showSuccess(successMessage, 7000); // 7 secondes pour laisser le temps de lire
        // Pas besoin de setStatus, le toast suffit
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
          setFormData({
            fullName: '',
            company: '',
            email: '',
            phone: '',
            city: '',
            country: 'Gabon',
            poles: [],
            specificServices: [],
            projectDescription: '',
            desiredDate: '',
            estimatedBudget: '',
            additionalServices: [],
            contactPreference: [],
            callbackTime: '',
            privacyConsent: false
          });
          setFiles([]);
        }, 3000);
      } else {
        let errorMessage = data.error || 'Une erreur est survenue. Veuillez réessayer.';
        if (data.details && data.details.length > 0) {
          errorMessage = data.details.map((err: any) => err.msg).join('. ');
        }
        showError(errorMessage);
        // Pas besoin de setStatus, le toast suffit
      }
    } catch (error) {
      const errorMessage = 'Erreur de connexion. Veuillez réessayer plus tard.';
      showError(errorMessage);
      // Pas besoin de setStatus, le toast suffit
    } finally {
      setLoading(false);
    }
  };


  const scrollToForm = () => {
    const formSection = document.querySelector('.devis-form-section');
    if (formSection) {
      const elementPosition = formSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // Offset de 100px pour voir le formulaire
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="devis-page">
      {/* Hero Section */}
      <section className="devis-hero">
        <div className="container">
          <h1>Demandez votre devis personnalisé</h1>
          <p>Remplissez le formulaire ci-dessous pour recevoir une estimation rapide et adaptée à vos besoins.</p>
          <button 
            type="button"
            onClick={scrollToForm}
            className="hero-cta-button"
            aria-label="Commencer ma demande de devis"
          >
            <span>Commencer ma demande</span>
            <svg className="arrow-down" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Formulaire */}
      <section className="devis-form-section">
        <div className="container">
          <form onSubmit={handleSubmit} className="devis-form">
            <div className="form-layout">
              {/* Barre de progression - Vertical à gauche */}
              <div className="form-progress-sidebar">
                <FormProgress 
                  currentStep={activeStep} 
                  totalSteps={totalSteps}
                  stepLabels={stepLabels}
                />
              </div>

              {/* Contenu du formulaire - À droite */}
              <div className="form-content">
                {/* Message de status retiré - utilisation des toasts uniquement */}

                {/* Étape 1: Informations personnelles */}
                <div className={`form-step ${activeStep === 1 ? 'active' : ''}`}>
                <h2 className="step-title">Informations personnelles</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Nom complet *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? 'error' : ''}
                      placeholder="Votre nom complet"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Entreprise / Organisation</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nom de votre entreprise (facultatif)"
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
                      className={errors.email ? 'error' : ''}
                      placeholder="votre@email.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Numéro de téléphone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+241 XX XX XX XX"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Ville *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Libreville, Akanda..."
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Pays *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="Gabon">Gabon</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Congo">Congo</option>
                      <option value="RDC">RDC</option>
                      <option value="Tchad">Tchad</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
                </div>

                {/* Étape 2: Sélection des pôles */}
                <div className={`form-step ${activeStep === 2 ? 'active' : ''}`}>
                <h2 className="step-title">Sélection des pôles</h2>
                <p className="step-subtitle">Sélectionnez un ou plusieurs pôles concernés par votre projet</p>
                
                <div className="checkbox-grid">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="poles"
                      value="energie"
                      checked={formData.poles.includes('energie')}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">
                      <strong>Énergie</strong>
                    </span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="poles"
                      value="geospatial"
                      checked={formData.poles.includes('geospatial')}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">
                      <strong>Traitement de données géospatiales</strong>
                    </span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="poles"
                      value="drone"
                      checked={formData.poles.includes('drone')}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">
                      <strong>Drone / ODS</strong>
                    </span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="poles"
                      value="securite"
                      checked={formData.poles.includes('securite')}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">
                      <strong>Sécurité numérique</strong>
                    </span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="poles"
                      value="sante"
                      checked={formData.poles.includes('sante')}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">
                      <strong>Santé connectée</strong>
                    </span>
                  </label>
                </div>
                {errors.poles && <span className="error-message">{errors.poles}</span>}
                </div>

                {/* Étape 3: Détails du projet */}
                <div className={`form-step ${activeStep === 3 ? 'active' : ''}`}>
                <h2 className="step-title">Détails du projet</h2>
                
                <div className="form-group full-width">
                  <label htmlFor="projectDescription">
                    Description du projet / besoin *
                    <span className="char-counter">
                      {formData.projectDescription.length} / 3000 caractères
                    </span>
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    className={errors.projectDescription ? 'error' : ''}
                    rows={8}
                    maxLength={3000}
                    placeholder="Décrivez en détail votre projet, vos besoins et vos attentes (minimum 20 caractères)..."
                  ></textarea>
                  {errors.projectDescription && (
                    <span className="error-message">{errors.projectDescription}</span>
                  )}
                  {!errors.projectDescription && formData.projectDescription.length > 0 && (
                    <span className="char-hint">
                      {formData.projectDescription.length < 20 
                        ? `Encore ${20 - formData.projectDescription.length} caractères minimum requis`
                        : 'Longueur valide ✓'
                      }
                    </span>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="desiredDate">Date souhaitée de réalisation</label>
                    <input
                      type="date"
                      id="desiredDate"
                      name="desiredDate"
                      value={formData.desiredDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="estimatedBudget">Budget estimatif (optionnel)</label>
                    <select
                      id="estimatedBudget"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez une fourchette</option>
                      <option value="< 1M FCFA">Moins de 1M FCFA</option>
                      <option value="1M - 5M FCFA">1M - 5M FCFA</option>
                      <option value="5M - 10M FCFA">5M - 10M FCFA</option>
                      <option value="10M - 50M FCFA">10M - 50M FCFA</option>
                      <option value="> 50M FCFA">Plus de 50M FCFA</option>
                    </select>
                  </div>
                </div>
                </div>

                {/* Étape 4: Services complémentaires */}
                <div className={`form-step ${activeStep === 4 ? 'active' : ''}`}>
                <h2 className="step-title">Services complémentaires</h2>
                <p className="step-subtitle">Sélectionnez les services supplémentaires qui vous intéressent</p>
                
                <div className="checkbox-grid">
                  {[
                    'Simulation / estimation énergétique',
                    'Installation clé en main',
                    'Formation et accompagnement',
                    'Maintenance / SAV',
                    'Conseil / Audit personnalisé'
                  ].map((service) => (
                    <label key={service} className="checkbox-item">
                      <input
                        type="checkbox"
                        name="additionalServices"
                        value={service}
                        checked={formData.additionalServices.includes(service)}
                        onChange={handleChange}
                      />
                      <span className="checkbox-label">{service}</span>
                    </label>
                  ))}
                </div>
                </div>

                {/* Étape 5: Finalisation */}
                <div className={`form-step ${activeStep === 5 ? 'active' : ''}`}>
                <h2 className="step-title">Finalisation</h2>
                
                {/* Pièces jointes */}
                <div className="form-group full-width">
                  <label htmlFor="files">Pièces jointes (optionnel)</label>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                    className="file-input"
                  />
                  <p className="file-hint">Plans, photos, cahier des charges technique...</p>
                  {files.length > 0 && (
                    <div className="file-list">
                      {files.map((file, index) => (
                        <span key={index} className="file-tag">{file.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Préférences de contact */}
                <div className="form-group">
                  <label>Je souhaite être contacté par :</label>
                  <div className="checkbox-grid inline">
                    {['Email', 'Téléphone', 'WhatsApp'].map((method) => (
                      <label key={method} className="checkbox-item inline">
                        <input
                          type="checkbox"
                          name="contactPreference"
                          value={method}
                          checked={formData.contactPreference.includes(method)}
                          onChange={handleChange}
                        />
                        <span className="checkbox-label">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="callbackTime">Me rappeler pendant :</label>
                  <select
                    id="callbackTime"
                    name="callbackTime"
                    value={formData.callbackTime}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez un moment</option>
                    <option value="Matin">Matin (8h - 12h)</option>
                    <option value="Après-midi">Après-midi (12h - 17h)</option>
                    <option value="Soirée">Soirée (17h - 20h)</option>
                  </select>
                </div>

                {/* Consentement */}
                <div className="form-group full-width">
                  <label className="checkbox-item consent">
                    <input
                      type="checkbox"
                      name="privacyConsent"
                      checked={formData.privacyConsent}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">
                      J'accepte la politique de confidentialité et les mentions légales. *
                    </span>
                  </label>
                  {errors.privacyConsent && <span className="error-message">{errors.privacyConsent}</span>}
                </div>
                </div>

                {/* Navigation entre étapes */}
                <div className="form-navigation">
                  {activeStep > 1 && (
                    <button
                      type="button"
                      className="btn-nav btn-previous"
                      onClick={handlePrevious}
                    >
                      ← Précédent
                    </button>
                  )}
                  
                  <div className="nav-spacer"></div>
                  
                  {activeStep < totalSteps ? (
                    <button
                      type="button"
                      className="btn-nav btn-next"
                      onClick={handleNext}
                    >
                      Suivant →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-nav btn-submit"
                      disabled={loading}
                    >
                      {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="form-note">* Champs obligatoires</p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Devis;
