import { useState } from 'react';
import './FAQ.css';

interface Question {
  id: number;
  question: string;
  reponse: string;
  categorie: string;
}

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('toutes');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const categories = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'technique', label: 'Technique' },
    { id: 'finance', label: 'Finance' },
    { id: 'installation', label: 'Installation' },
    { id: 'sav', label: 'SAV & Maintenance' },
    { id: 'general', label: 'Général' }
  ];

  const questions: Question[] = [
    // TECHNIQUE
    {
      id: 1,
      question: 'Quelle est la durée de vie des panneaux solaires ?',
      reponse: 'Les panneaux solaires photovoltaïques ont une durée de vie moyenne de 25 à 30 ans. Ils sont garantis par le fabricant pendant 25 ans avec un rendement minimum de 80%. Après cette période, ils continuent de fonctionner mais avec un rendement légèrement réduit.',
      categorie: 'technique'
    },
    {
      id: 2,
      question: 'Comment fonctionne un système solaire photovoltaïque ?',
      reponse: 'Un système solaire photovoltaïque convertit la lumière du soleil en électricité. Les panneaux captent les photons du soleil, l\'onduleur convertit le courant continu en courant alternatif, et les batteries stockent l\'énergie pour une utilisation nocturne ou lors des périodes nuageuses.',
      categorie: 'technique'
    },
    {
      id: 3,
      question: 'Quelle puissance de kit solaire me faut-il ?',
      reponse: 'La puissance nécessaire dépend de votre consommation quotidienne. Pour une estimation précise, utilisez notre simulateur en ligne. En règle générale : 1-2kW pour un petit foyer, 3-5kW pour une maison moyenne, 5-10kW pour une grande maison, et 15kW+ pour les commerces.',
      categorie: 'technique'
    },
    {
      id: 4,
      question: 'Les kits fonctionnent-ils pendant la saison des pluies ?',
      reponse: 'Oui ! Même par temps nuageux, les panneaux solaires produisent de l\'électricité (environ 20-30% de leur capacité maximale). C\'est pourquoi nos kits incluent des batteries de stockage pour garantir une alimentation continue, jour et nuit, quelle que soit la météo.',
      categorie: 'technique'
    },

    // FINANCE
    {
      id: 5,
      question: 'Quels sont les prix des kits solaires CIPS ?',
      reponse: 'Nos kits varient de 450 000 FCFA (Kit Essentiel 1kW) à 6 500 000 FCFA (Kit Professionnel 30kW). Le prix inclut les panneaux, batteries, onduleur, installation et formation. Utilisez notre simulateur pour obtenir une recommandation adaptée à votre budget.',
      categorie: 'finance'
    },
    {
      id: 6,
      question: 'Proposez-vous des facilités de paiement ?',
      reponse: 'Oui, nous proposons plusieurs options de paiement : paiement comptant avec remise, paiement en 3 fois sans frais, et financement bancaire partenaire jusqu\'à 36 mois. Contactez-nous pour étudier la meilleure solution pour votre projet.',
      categorie: 'finance'
    },
    {
      id: 7,
      question: 'Combien puis-je économiser avec le solaire ?',
      reponse: 'Les économies dépendent de votre consommation actuelle. En moyenne, nos clients économisent 60-80% sur leur facture d\'électricité. Un kit de 3kW permet d\'économiser environ 450 000 FCFA par an. Le retour sur investissement se fait généralement en 2-4 ans.',
      categorie: 'finance'
    },

    // INSTALLATION
    {
      id: 8,
      question: 'Combien de temps dure l\'installation d\'un kit solaire ?',
      reponse: 'L\'installation d\'un kit résidentiel prend généralement 1 à 2 jours. Pour les installations professionnelles plus importantes, comptez 3 à 5 jours. Notre équipe s\'occupe de tout : fixation des panneaux, raccordement électrique, configuration et formation.',
      categorie: 'installation'
    },
    {
      id: 9,
      question: 'Intervenez-vous partout au Gabon ?',
      reponse: 'Nous intervenons principalement à Libreville et dans les grandes villes du Gabon (Port-Gentil, Franceville, Oyem). Pour les zones plus éloignées, contactez-nous pour étudier la faisabilité et les conditions d\'intervention.',
      categorie: 'installation'
    },
    {
      id: 10,
      question: 'Faut-il un permis pour installer des panneaux solaires ?',
      reponse: 'Au Gabon, aucun permis spécifique n\'est requis pour les installations solaires résidentielles standard. Pour les installations professionnelles de grande puissance, une déclaration auprès de la SEEG peut être nécessaire. Nous vous accompagnons dans toutes les démarches.',
      categorie: 'installation'
    },

    // SAV
    {
      id: 11,
      question: 'Quelle garantie propose CIPS ?',
      reponse: 'Nous offrons : 25 ans de garantie fabricant sur les panneaux solaires, 5-10 ans sur les onduleurs selon le modèle, 3-5 ans sur les batteries, et 2 ans de garantie main d\'œuvre CIPS sur l\'installation. Un SAV réactif est disponible 6j/7.',
      categorie: 'sav'
    },
    {
      id: 12,
      question: 'Comment entretenir mon installation solaire ?',
      reponse: 'L\'entretien est minimal : nettoyage des panneaux 2-3 fois par an (eau savonneuse), vérification visuelle mensuelle, et contrôle annuel par nos techniciens. Nous proposons des contrats de maintenance préventive pour une tranquillité totale.',
      categorie: 'sav'
    },
    {
      id: 13,
      question: 'Que faire en cas de panne ?',
      reponse: 'Contactez notre SAV au +241 04 80 23 44. Nous intervenons sous 48h à Libreville. Pour les urgences, un diagnostic à distance est possible. La plupart des problèmes sont résolus en une seule visite. Pièces de rechange disponibles en stock.',
      categorie: 'sav'
    },

    // GÉNÉRAL
    {
      id: 14,
      question: 'CIPS est-elle une entreprise gabonaise ?',
      reponse: 'Oui, CIPS (Conception Innovante pour la Sécurité) est un groupe technologique basé à Libreville, Gabon. Nous développons des solutions adaptées aux réalités africaines avec une expertise locale et internationale.',
      categorie: 'general'
    },
    {
      id: 15,
      question: 'Proposez-vous d\'autres services que l\'énergie solaire ?',
      reponse: 'Oui ! CIPS dispose de 5 pôles d\'expertise : Énergie, Traitement de Données Géospatiales (cartographie, drones), Services Drones (ODS), Sécurité Numérique (cybersécurité), et Santé Connectée (télémédecine). Consultez notre page Nos Pôles pour en savoir plus.',
      categorie: 'general'
    },
    {
      id: 16,
      question: 'Comment obtenir un devis ?',
      reponse: 'Vous pouvez demander un devis gratuit de 3 façons : via notre formulaire en ligne sur la page Devis, en utilisant le simulateur énergétique pour une estimation automatique, ou en nous contactant directement par téléphone ou WhatsApp. Réponse sous 24-48h.',
      categorie: 'general'
    }
  ];

  // Filtrage des questions
  const filteredQuestions = questions.filter(q => {
    const matchCategory = selectedCategory === 'toutes' || q.categorie === selectedCategory;
    const matchSearch = searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.reponse.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="faq-page">
      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <h1>FOIRE AUX QUESTIONS</h1>
          <p className="hero-subtitle">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>
      </section>

      {/* Recherche et filtres */}
      <section className="faq-filters-section">
        <div className="container">
          {/* Barre de recherche */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filtres catégories */}
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Compteur */}
          <p className="results-count">
            {filteredQuestions.length} question{filteredQuestions.length > 1 ? 's' : ''} trouvée{filteredQuestions.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Questions */}
      <section className="faq-content-section">
        <div className="container">
          {filteredQuestions.length === 0 ? (
            <div className="no-results">
              <p>Aucune question ne correspond à votre recherche.</p>
              <button 
                className="btn-reset-search"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('toutes');
                }}
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="faq-list">
              {filteredQuestions.map((q) => (
                <div 
                  key={q.id} 
                  className={`faq-item ${openQuestion === q.id ? 'open' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <span className="question-text">{q.question}</span>
                    <span className="toggle-icon">
                      {openQuestion === q.id ? '−' : '+'}
                    </span>
                  </button>
                  
                  {openQuestion === q.id && (
                    <div className="faq-answer">
                      <p>{q.reponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Contact */}
      <section className="faq-cta-section">
        <div className="container">
          <div className="faq-cta-content">
            <h2>Vous n'avez pas trouvé votre réponse ?</h2>
            <p>Notre équipe est là pour vous aider</p>
            <div className="faq-cta-buttons">
              <a href="/contact" className="btn btn-primary">Nous contacter</a>
              <a href="tel:+24104802344" className="btn btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +241 04 80 23 44
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

