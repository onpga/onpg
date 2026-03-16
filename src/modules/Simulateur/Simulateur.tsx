import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Simulateur.css';
import FormProgress from '../../components/FormProgress';
import { useToast } from '../../components/Toast';

interface FormData {
  usage: string;
  appareils: {
    refrigerateur: boolean;
    television: boolean;
    climatisation: boolean;
    ordinateur: boolean;
    eclairage: boolean;
    chargeurs: boolean;
    congelateur: boolean;
    ventilateurs: boolean;
  };
  nombrePersonnes: string;
  heuresUtilisation: string;
  budget: string;
  ville: string;
  pays: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
}

interface KitRecommendation {
  nom: string;
  puissance: string;
  prix: number;
  economiesAnnuelles: number;
  description: string;
  contenu: string[];
  adapte: string[];
}

const Simulateur = () => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState<FormData>({
    usage: '',
    appareils: {
      refrigerateur: false,
      television: false,
      climatisation: false,
      ordinateur: false,
      eclairage: false,
      chargeurs: false,
      congelateur: false,
      ventilateurs: false
    },
    nombrePersonnes: '',
    heuresUtilisation: '',
    budget: '',
    ville: '',
    pays: 'GABON',
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  });

  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [resultat, setResultat] = useState<KitRecommendation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const totalSteps = 6;
  const stepLabels = [
    'Type d\'usage',
    'Appareils',
    'Utilisation',
    'Budget',
    'Localisation',
    'Contact'
  ];

  // Validation par étape
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.usage.trim()) {
          newErrors.usage = 'Veuillez sélectionner un type d\'usage';
        }
        break;
      
      case 2:
        const appareilsSelectionnes = Object.values(formData.appareils).some(v => v === true);
        if (!appareilsSelectionnes) {
          newErrors.appareils = 'Veuillez sélectionner au moins un appareil';
        }
        break;
      
      case 3:
        if (!formData.nombrePersonnes) {
          newErrors.nombrePersonnes = 'Veuillez sélectionner le nombre de personnes';
        }
        if (!formData.heuresUtilisation) {
          newErrors.heuresUtilisation = 'Veuillez sélectionner les heures d\'utilisation';
        }
        break;
      
      case 4:
        if (!formData.budget) {
          newErrors.budget = 'Veuillez sélectionner un budget';
        }
        break;
      
      case 5:
        if (!formData.ville.trim()) {
          newErrors.ville = 'Veuillez saisir votre ville';
        }
        break;
      
      case 6:
        if (!formData.prenom.trim()) {
          newErrors.prenom = 'Veuillez saisir votre prénom';
        }
        if (!formData.nom.trim()) {
          newErrors.nom = 'Veuillez saisir votre nom';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Veuillez saisir votre email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Veuillez saisir un email valide';
        }
        if (!formData.telephone.trim()) {
          newErrors.telephone = 'Veuillez saisir votre numéro de téléphone';
        } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.telephone)) {
          newErrors.telephone = 'Veuillez saisir un numéro de téléphone valide';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, totalSteps));
      // Garder le scroll actuel - ne pas scroller
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    setErrors({});
    // Garder le scroll actuel - ne pas scroller
  };

  // Liste des villes avec leur pays
  const villesPays: {[key: string]: string} = {
    'libreville': 'GABON',
    'port-gentil': 'GABON',
    'franceville': 'GABON',
    'oyem': 'GABON',
    'moanda': 'GABON',
    'mouila': 'GABON',
    'lambaréné': 'GABON',
    'tchibanga': 'GABON',
    'koulamoutou': 'GABON',
    'makokou': 'GABON',
    'bitam': 'GABON',
    'mounana': 'GABON',
    'gamba': 'GABON',
    'mayumba': 'GABON',
    'ndendé': 'GABON',
    'mitzic': 'GABON',
    'booué': 'GABON',
    'lastoursville': 'GABON',
    'okondja': 'GABON',
    'yaoundé': 'CAMEROUN',
    'douala': 'CAMEROUN',
    'garoua': 'CAMEROUN',
    'bafoussam': 'CAMEROUN',
    'bamenda': 'CAMEROUN',
    'ngaoundéré': 'CAMEROUN',
    'maroua': 'CAMEROUN',
    'brazzaville': 'CONGO',
    'pointe-noire': 'CONGO',
    'dolisie': 'CONGO',
    'kinshasa': 'RDC',
    'lubumbashi': 'RDC',
    'goma': 'RDC',
    'bukavu': 'RDC',
    'kisangani': 'RDC',
    'ndjamena': 'TCHAD',
    'moundou': 'TCHAD',
    'sarh': 'TCHAD'
  };

  const kitsDisponibles: KitRecommendation[] = [
    {
      nom: 'Kit Essentiel',
      puissance: '500W - 1kW',
      prix: 450000,
      economiesAnnuelles: 180000,
      description: 'Solution d\'entrée de gamme pour les besoins basiques',
      contenu: [
        '2 panneaux solaires 250W',
        '1 batterie 12V 100Ah',
        '1 onduleur 1000W',
        'Câblage et accessoires',
        'Installation incluse'
      ],
      adapte: ['Éclairage', 'Télévision', 'Chargeurs', 'Ventilateurs']
    },
    {
      nom: 'Kit Confort',
      puissance: '1.5kW - 3kW',
      prix: 950000,
      economiesAnnuelles: 450000,
      description: 'Solution équilibrée pour un foyer moyen',
      contenu: [
        '4 panneaux solaires 375W',
        '2 batteries 12V 200Ah',
        '1 onduleur 3000W',
        'Régulateur MPPT',
        'Câblage et protection',
        'Installation et formation'
      ],
      adapte: ['Réfrigérateur', 'Télévision', 'Ordinateur', 'Éclairage', 'Ventilateurs', 'Chargeurs']
    },
    {
      nom: 'Kit Premium',
      puissance: '5kW - 10kW',
      prix: 2500000,
      economiesAnnuelles: 1200000,
      description: 'Solution complète pour grandes maisons et petites entreprises',
      contenu: [
        '8 panneaux solaires 550W',
        '4 batteries Lithium 200Ah',
        '1 onduleur hybride 10kW',
        'Régulateur MPPT intelligent',
        'Système monitoring',
        'Câblage et protection complète',
        'Installation professionnelle',
        'Formation et SAV 1 an'
      ],
      adapte: ['Climatisation', 'Réfrigérateur', 'Congélateur', 'Télévision', 'Ordinateurs', 'Éclairage complet', 'Tous appareils']
    },
    {
      nom: 'Kit Professionnel',
      puissance: '15kW - 30kW',
      prix: 6500000,
      economiesAnnuelles: 3000000,
      description: 'Solution industrielle pour entreprises et commerces',
      contenu: [
        '16 panneaux solaires 550W',
        'Batteries Lithium haute capacité',
        'Onduleur triphasé 30kW',
        'Système de monitoring cloud',
        'Régulation intelligente',
        'Groupe électrogène backup',
        'Installation certifiée',
        'Maintenance incluse 2 ans'
      ],
      adapte: ['Climatisation commerciale', 'Équipements industriels', 'Bureaux complets', 'Magasins', 'Ateliers']
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        appareils: {
          ...formData.appareils,
          [name]: checkbox.checked
        }
      });
      // Effacer l'erreur appareils si un appareil est sélectionné
      if (checkbox.checked && errors.appareils) {
        setErrors({ ...errors, appareils: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Filtrer les villes et afficher suggestions
      if (name === 'ville') {
        const query = value.toLowerCase().trim();
        
        if (query.length > 0) {
          const matches = Object.keys(villesPays)
            .filter(ville => ville.startsWith(query))
            .slice(0, 10)
            .map(ville => ville.charAt(0).toUpperCase() + ville.slice(1));
          
          setFilteredCities(matches);
          setShowSuggestions(matches.length > 0);
        } else {
          setShowSuggestions(false);
          setFilteredCities([]);
        }
      }
    }
  };

  const selectCity = (ville: string) => {
    const villeNormalisee = ville.toLowerCase().trim();
    const paysDetecte = villesPays[villeNormalisee] || 'GABON';
    
    setFormData({ ...formData, ville, pays: paysDetecte });
    setShowSuggestions(false);
    setFilteredCities([]);
    if (errors.ville) {
      setErrors({ ...errors, ville: '' });
    }
  };

  const calculerRecommandation = (): KitRecommendation => {
    let score = 0;
    
    const appareilsSelectionnes = Object.entries(formData.appareils).filter(([_, selected]) => selected);
    score += appareilsSelectionnes.length;
    
    if (formData.appareils.climatisation) score += 3;
    if (formData.appareils.refrigerateur) score += 2;
    if (formData.appareils.congelateur) score += 2;
    
    const nbPersonnes = parseInt(formData.nombrePersonnes) || 0;
    if (nbPersonnes > 5) score += 2;
    else if (nbPersonnes > 3) score += 1;
    
    const heures = parseInt(formData.heuresUtilisation) || 0;
    if (heures > 12) score += 2;
    else if (heures > 8) score += 1;
    
    const budget = parseInt(formData.budget) || 0;
    if (budget > 2000000) score += 2;
    else if (budget > 800000) score += 1;
    
    if (formData.usage === 'professionnel' || formData.usage === 'mixte') {
      score += 3;
    }
    
    if (score >= 12) return kitsDisponibles[3];
    if (score >= 8) return kitsDisponibles[2];
    if (score >= 4) return kitsDisponibles[1];
    return kitsDisponibles[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider la dernière étape
    if (!validateStep(6)) {
      setActiveStep(6);
      return;
    }

    const recommendation = calculerRecommandation();
    setResultat(recommendation);
    setShowResults(true);

    try {
      const response = await fetch('/api/simulations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usage: formData.usage,
          appareils: formData.appareils,
          nombrePersonnes: formData.nombrePersonnes,
          heuresUtilisation: formData.heuresUtilisation,
          budget: formData.budget,
          ville: formData.ville,
          pays: formData.pays,
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          kitRecommande: {
            nom: recommendation.nom,
            puissance: recommendation.puissance,
            prix: recommendation.prix,
            economiesAnnuelles: recommendation.economiesAnnuelles,
            description: recommendation.description,
            contenu: recommendation.contenu,
            adapte: recommendation.adapte
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage = 'Votre simulation a été enregistrée avec succès ! Nous vous contacterons sous 48h.';
        showSuccess(successMessage, 7000);
      } else {
        const errorMessage = data.error || 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Erreur enregistrement simulation:', error);
      showError('Erreur de connexion. Veuillez réessayer plus tard.');
    }
    
    setTimeout(() => {
      document.getElementById('resultats')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };


  const scrollToForm = () => {
    const formSection = document.querySelector('.simulateur-form-section');
    if (formSection) {
      const elementPosition = formSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // Offset de 100px pour voir "Type d'usage"
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="simulateur-page">
      {/* Hero Section */}
      <section className="simulateur-hero">
        <div className="container">
          <div className="hero-content-wrapper">
            <h1>SIMULATEUR ÉNERGÉTIQUE</h1>
            <p className="hero-subtitle">
              Découvrez le kit solaire idéal pour vos besoins<br />et estimez vos économies
            </p>
            <button 
              type="button"
              onClick={scrollToForm}
              className="hero-cta-button"
              aria-label="Commencer ma simulation"
            >
              <span>Commencer ma simulation</span>
              <svg className="arrow-down" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="simulateur-form-section">
        <div className="container">
          <form onSubmit={handleSubmit} className="simulateur-form">
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
                {/* Étape 1: Type d'usage */}
                <div className={`form-step ${activeStep === 1 ? 'active' : ''}`}>
                <h2 className="step-title">Type d'usage</h2>
                <p className="step-subtitle">Sélectionnez le type d'utilisation prévu pour votre installation</p>
                
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="usage"
                      value="residentiel"
                      checked={formData.usage === 'residentiel'}
                      onChange={handleChange}
                    />
                    <span>Résidentiel (maison)</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="usage"
                      value="professionnel"
                      checked={formData.usage === 'professionnel'}
                      onChange={handleChange}
                    />
                    <span>Professionnel (bureau, commerce)</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="usage"
                      value="mixte"
                      checked={formData.usage === 'mixte'}
                      onChange={handleChange}
                    />
                    <span>Mixte</span>
                  </label>
                </div>
                {errors.usage && <span className="error-message">{errors.usage}</span>}
                </div>

                {/* Étape 2: Appareils */}
                <div className={`form-step ${activeStep === 2 ? 'active' : ''}`}>
                <h2 className="step-title">Appareils à alimenter</h2>
                <p className="step-subtitle">Sélectionnez les appareils que vous souhaitez alimenter</p>
                
                <div className="checkbox-grid">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="refrigerateur"
                      checked={formData.appareils.refrigerateur}
                      onChange={handleChange}
                    />
                    <span>Réfrigérateur</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="television"
                      checked={formData.appareils.television}
                      onChange={handleChange}
                    />
                    <span>Télévision</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="climatisation"
                      checked={formData.appareils.climatisation}
                      onChange={handleChange}
                    />
                    <span>Climatisation</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="ordinateur"
                      checked={formData.appareils.ordinateur}
                      onChange={handleChange}
                    />
                    <span>Ordinateur</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="eclairage"
                      checked={formData.appareils.eclairage}
                      onChange={handleChange}
                    />
                    <span>Éclairage</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="chargeurs"
                      checked={formData.appareils.chargeurs}
                      onChange={handleChange}
                    />
                    <span>Chargeurs (téléphone, etc.)</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="congelateur"
                      checked={formData.appareils.congelateur}
                      onChange={handleChange}
                    />
                    <span>Congélateur</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      name="ventilateurs"
                      checked={formData.appareils.ventilateurs}
                      onChange={handleChange}
                    />
                    <span>Ventilateurs</span>
                  </label>
                </div>
                {errors.appareils && <span className="error-message">{errors.appareils}</span>}
                </div>

                {/* Étape 3: Utilisation */}
                <div className={`form-step ${activeStep === 3 ? 'active' : ''}`}>
                <h2 className="step-title">Utilisation</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nombrePersonnes">Nombre de personnes dans le foyer/local *</label>
                    <select
                      id="nombrePersonnes"
                      name="nombrePersonnes"
                      value={formData.nombrePersonnes}
                      onChange={handleChange}
                      className={errors.nombrePersonnes ? 'error' : ''}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="1">1-2 personnes</option>
                      <option value="3">3-4 personnes</option>
                      <option value="5">5-6 personnes</option>
                      <option value="7">Plus de 6 personnes</option>
                    </select>
                    {errors.nombrePersonnes && <span className="error-message">{errors.nombrePersonnes}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="heuresUtilisation">Heures d'utilisation par jour *</label>
                    <select
                      id="heuresUtilisation"
                      name="heuresUtilisation"
                      value={formData.heuresUtilisation}
                      onChange={handleChange}
                      className={errors.heuresUtilisation ? 'error' : ''}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="4">Moins de 6h (usage minimal)</option>
                      <option value="8">6-10h (usage modéré)</option>
                      <option value="12">10-16h (usage important)</option>
                      <option value="20">Plus de 16h (usage intensif)</option>
                    </select>
                    {errors.heuresUtilisation && <span className="error-message">{errors.heuresUtilisation}</span>}
                  </div>
                </div>
                  </div>

                {/* Étape 4: Budget */}
                <div className={`form-step ${activeStep === 4 ? 'active' : ''}`}>
                <h2 className="step-title">Budget</h2>
                <p className="step-subtitle">Quel est votre budget estimatif pour cette installation ?</p>
                
                <div className="form-group">
                  <label htmlFor="budget">Budget estimatif (FCFA) *</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={errors.budget ? 'error' : ''}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="300000">Moins de 500 000 FCFA</option>
                    <option value="700000">500 000 - 1 000 000 FCFA</option>
                    <option value="1500000">1 000 000 - 2 000 000 FCFA</option>
                    <option value="3000000">Plus de 2 000 000 FCFA</option>
                  </select>
                  {errors.budget && <span className="error-message">{errors.budget}</span>}
                </div>
                </div>

                {/* Étape 5: Localisation */}
                <div className={`form-step ${activeStep === 5 ? 'active' : ''}`}>
                <h2 className="step-title">Localisation</h2>
                <p className="step-subtitle">Où souhaitez-vous installer votre système solaire ?</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="ville">Ville *</label>
                    <div className="autocomplete-wrapper">
                      <input
                        type="text"
                        id="ville"
                        name="ville"
                        value={formData.ville}
                        onChange={handleChange}
                        onFocus={() => {
                          if (filteredCities.length > 0) setShowSuggestions(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        placeholder="Tapez votre ville..."
                        className={errors.ville ? 'error' : ''}
                        autoComplete="off"
                      />
                      {showSuggestions && filteredCities.length > 0 && (
                        <ul className="suggestions-list">
                          {filteredCities.map((ville, index) => (
                            <li 
                              key={index}
                              onClick={() => selectCity(ville)}
                              className="suggestion-item"
                            >
                              {ville}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {errors.ville && <span className="error-message">{errors.ville}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pays">Pays</label>
                    <input
                      type="text"
                      id="pays"
                      name="pays"
                      value={formData.pays}
                      onChange={handleChange}
                      className="text-input pays-input"
                      readOnly
                    />
                  </div>
                </div>
                  </div>

                {/* Étape 6: Contact */}
                <div className={`form-step ${activeStep === 6 ? 'active' : ''}`}>
                <h2 className="step-title">Vos coordonnées</h2>
                <p className="step-subtitle">Nous avons besoin de vos informations pour vous contacter et vous envoyer votre devis personnalisé</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom *</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      className={errors.prenom ? 'error' : ''}
                    />
                    {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className={errors.nom ? 'error' : ''}
                    />
                    {errors.nom && <span className="error-message">{errors.nom}</span>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telephone">Téléphone *</label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+241 04 80 23 44"
                      className={errors.telephone ? 'error' : ''}
                    />
                    {errors.telephone && <span className="error-message">{errors.telephone}</span>}
                  </div>
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
                    >
                      Calculer mon installation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Résultats */}
      {showResults && resultat && (
        <section className="resultat-section" id="resultats">
          <div className="container">
            <div className="resultat-header">
              <h2>Votre Kit Recommandé</h2>
              <p>Basé sur vos besoins et votre budget</p>
            </div>

            <div className="resultat-content">
              <div className="kit-result-wrapper">
                <div className="kit-title-bar">
                  <h3>{resultat.nom}</h3>
                  <div className="kit-puissance">{resultat.puissance}</div>
                </div>

                <div className="kit-card-result">
                  <div className="kit-left-column">
                    <p className="kit-description">{resultat.description}</p>

                    <div className="kit-prix-block">
                      <div className="prix-label">Prix installation complète</div>
                      <div className="prix-value">{resultat.prix.toLocaleString('fr-FR')} FCFA</div>
                      <div className="economies-info">
                        <div className="economies-value">
                          💰 Économies annuelles : {resultat.economiesAnnuelles.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className="roi-value">
                          ⏱️ ROI : {Math.round(resultat.prix / resultat.economiesAnnuelles * 12)} mois
                        </div>
                      </div>
                    </div>

                    <div className="resultat-cta-inline">
                      <p className="cta-text">Intéressé par cette solution ?</p>
                      <div className="cta-buttons">
                        <Link to="/devis" className="btn btn-primary-sim">
                          Demander un devis
                        </Link>
                        <Link to="/contact" className="btn btn-secondary-sim">
                          Nous contacter
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="kit-right-column">
                    <div className="kit-contenu">
                      <h4>Contenu du kit :</h4>
                      <ul>
                        {resultat.contenu.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="kit-adapte">
                      <h4>Adapté pour :</h4>
                      <div className="adapte-tags">
                        {resultat.adapte.map((item, index) => (
                          <span key={index} className="adapte-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="resultat-footer">
                <button 
                  className="btn-reset"
                  onClick={() => {
                    setShowResults(false);
                    setResultat(null);
                    setActiveStep(1);
                    setFormData({
                      usage: '',
                      appareils: {
                        refrigerateur: false,
                        television: false,
                        climatisation: false,
                        ordinateur: false,
                        eclairage: false,
                        chargeurs: false,
                        congelateur: false,
                        ventilateurs: false
                      },
                      nombrePersonnes: '',
                      heuresUtilisation: '',
                      budget: '',
                      ville: '',
                      pays: 'GABON',
                      prenom: '',
                      nom: '',
                      email: '',
                      telephone: ''
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  ← Faire une nouvelle simulation
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Avantages solaire */}
      <section className="avantages-section">
        <div className="container">
          <h2>Pourquoi choisir le solaire ?</h2>
          <div className="avantages-grid">
            <div className="simulateur-avantage-card">
              <div className="simulateur-avantage-icon">💰</div>
              <h3>Économies</h3>
              <p>Jusqu'à 80% d'économies sur votre facture d'électricité</p>
            </div>
            <div className="simulateur-avantage-card">
              <div className="simulateur-avantage-icon">🌍</div>
              <h3>Écologique</h3>
              <p>Énergie propre et renouvelable, zéro émission</p>
            </div>
            <div className="simulateur-avantage-card">
              <div className="simulateur-avantage-icon">🔋</div>
              <h3>Autonomie</h3>
              <p>Indépendance énergétique face aux coupures</p>
            </div>
            <div className="simulateur-avantage-card">
              <div className="simulateur-avantage-icon">⚡</div>
              <h3>Fiabilité</h3>
              <p>Garantie 25 ans sur les panneaux solaires</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Simulateur;
