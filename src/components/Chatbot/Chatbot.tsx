import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Détection simple des URLs / numéros pour les transformer en liens cliquables avec un libellé propre
const renderMessageText = (text: string) => {
  const tokenPattern = /(https?:\/\/[^\s]+|\/[a-zA-Z0-9\-\/]+|\+?[0-9][0-9\s]{5,})/g;

  const getLabelForToken = (token: string) => {
    const lower = token.toLowerCase();
    if (lower.includes('/simulateur')) return 'Simulateur énergétique';
    if (lower.includes('/devis')) return 'Demander un devis';
    if (lower.includes('/contact')) return 'Nous contacter';
    if (lower.includes('wa.me') || lower.includes('whatsapp')) return 'WhatsApp';
    // Pour les numéros de téléphone, on garde le texte original
    return token;
  };

  const renderLine = (line: string, lineIndex: number) => {
    const parts: any[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const regex = new RegExp(tokenPattern, 'g');

    while ((match = regex.exec(line)) !== null) {
      const token = match[0];
      const start = match.index;
      const end = start + token.length;

      if (start > lastIndex) {
        parts.push(line.slice(lastIndex, start));
      }

      const lower = token.toLowerCase();
      const isAbsoluteUrl = token.startsWith('http://') || token.startsWith('https://');
      const isWhatsApp = lower.includes('wa.me') || lower.includes('whatsapp');
      const isPhone = /^\+?[0-9][0-9\s]{5,}$/.test(token);

      let href: string;

      if (isWhatsApp) {
        // S'assure qu'on a bien une URL complète
        const base = token.replace(/^https?:\/\//i, '');
        href = `https://${base}`;
      } else if (isPhone) {
        const clean = token.replace(/\s+/g, '');
        href = `tel:${clean}`;
      } else if (isAbsoluteUrl) {
        href = token;
      } else {
        href = token;
      }

      const label = getLabelForToken(token);

      parts.push(
        <a
          key={`${lineIndex}-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="chatbot-link"
        >
          {label}
        </a>
      );

      lastIndex = end;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return <p key={lineIndex}>{parts}</p>;
  };

  return text.split('\n').map((line, i) => renderLine(line, i));
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis l\'assistant virtuel CIPS. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Base de connaissances locale (fallback) du chatbot
  const getBotFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Salutations
    if (lowerMessage.match(/bonjour|salut|hello|hey|bonsoir/)) {
      return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ? Je peux vous renseigner sur nos pôles d\'activité, nos services, nos coordonnées ou prendre un rendez-vous.';
    }

    // Horaires
    if (lowerMessage.match(/heure|horaire|ouvert|fermé|quand/)) {
      return 'Nos horaires d\'ouverture sont du Lundi au Vendredi de 07h30 à 15h00. Nous sommes fermés les week-ends et jours fériés.';
    }

    // Contact
    if (lowerMessage.match(/contact|téléphone|appel|numéro|joindre|mail|email/)) {
      return 'Vous pouvez nous contacter par :\n📞 Téléphone : +241 04 80 23 44\n📧 Email : contact@cips-gabon.com\n📍 Adresse : Libreville, GABON\n\nSouhaitez-vous que je vous mette en relation avec notre équipe ?';
    }

    // Pôles d'activité
    if (lowerMessage.match(/pôle|activité|service|domaine|spécialité/)) {
      return 'CIPS dispose de 5 pôles d\'expertise :\n\n⚡ Pôle Énergie - Solutions énergétiques innovantes\n🛰 Pôle Traitement de Données Géospatiales - Cartographie et modélisation\n🚁 Pôle Drones (ODS) - Services professionnels par drones\n🏥 Pôle Santé Connectée - Télémédecine et suivi médical\n💻 Pôle Sécurité Numérique - Cybersécurité et protection\n\nSur quel pôle souhaitez-vous en savoir plus ?';
    }

    // Énergie
    if (lowerMessage.match(/énergie|solaire|électricité|panneaux|photovoltaïque/)) {
      return 'Notre Pôle Énergie propose des solutions d\'énergies renouvelables adaptées à l\'Afrique : kits solaires, installations photovoltaïques, systèmes de stockage. Souhaitez-vous un devis personnalisé ?';
    }

    // Géospatial
    if (lowerMessage.match(/géospatial|carte|cartographie|topographie|territoire|mnt|mns/)) {
      return 'Notre Pôle Géospatial offre des services de collecte, analyse et modélisation de données spatiales : relevés topographiques, cartographie 3D, MNT/MNS. Avez-vous un projet spécifique ?';
    }

    // Drones
    if (lowerMessage.match(/drone|ods|inspection|surveillance|aérien|captation/)) {
      return 'ODS (Optimum Drone Services) propose : inspections techniques, surveillance, photogrammétrie, formations professionnelles. Quel type de mission vous intéresse ?';
    }

    // Santé
    if (lowerMessage.match(/santé|médical|télémédecine|cabine|consultation/)) {
      return 'Notre Pôle Santé Connectée développe des solutions de télémédecine et de suivi médical à distance avec nos cabines médicales connectées. Voulez-vous en savoir plus ?';
    }

    // Sécurité
    if (lowerMessage.match(/sécurité|cyber|protection|audit|si|système d'information/)) {
      return 'Notre Pôle Sécurité Numérique assure : audits de sécurité, supervision SOC, protection des systèmes d\'information, développement d\'outils sécurisés. Comment pouvons-nous sécuriser votre organisation ?';
    }

    // Devis
    if (lowerMessage.match(/devis|prix|coût|tarif|budget|estimation/)) {
      return 'Pour obtenir un devis personnalisé, je vous invite à remplir notre formulaire en ligne ou à nous contacter directement au +241 04 80 23 44. Quel type de projet souhaitez-vous réaliser ?';
    }

    // Rendez-vous
    if (lowerMessage.match(/rendez-vous|rdv|rencontre|visite|voir/)) {
      return 'Pour prendre rendez-vous, vous pouvez :\n• Nous appeler au +241 04 80 23 44\n• Nous écrire à contact@cips-gabon.com\n• Utiliser notre formulaire de contact\n\nNotre équipe vous répondra dans les plus brefs délais.';
    }

    // Localisation
    if (lowerMessage.match(/où|adresse|localisation|situé|trouver|lieu/)) {
      return 'Nous sommes situés à Libreville, GABON. Pour obtenir notre adresse exacte et les indications, consultez notre page Contact ou contactez-nous directement.';
    }

    // Carrières
    if (lowerMessage.match(/carrière|emploi|recrutement|job|travail|poste|cv/)) {
      return 'Nous recrutons régulièrement des talents dans nos 5 pôles d\'activité. Consultez notre page Carrières pour voir nos offres d\'emploi actuelles. Quel type de poste vous intéresse ?';
    }

    // Réalisations
    if (lowerMessage.match(/projet|réalisation|référence|portfolio|exemple/)) {
      return 'CIPS a réalisé de nombreux projets en Afrique dans les domaines de l\'énergie, de la géospatialisation, des drones, de la santé et de la cybersécurité. Consultez notre page Réalisations pour découvrir nos projets phares !';
    }

    // Actualités
    if (lowerMessage.match(/actualité|news|nouveau|innovation|blog|article/)) {
      return 'Restez informé des dernières innovations et actualités CIPS sur notre blog. Nous publions régulièrement des articles sur les technologies, nos projets et les tendances du secteur.';
    }

    // Remerciements
    if (lowerMessage.match(/merci|remercie|thanks|super|parfait|ok|d'accord/)) {
      return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider. 😊';
    }

    // Au revoir
    if (lowerMessage.match(/au revoir|bye|à bientôt|ciao|tchao/)) {
      return 'Au revoir ! N\'hésitez pas à revenir si vous avez besoin d\'aide. Bonne journée ! 👋';
    }

    // Aide
    if (lowerMessage.match(/aide|help|comment|quoi|que faire/)) {
      return 'Je peux vous aider avec :\n• Informations sur nos 5 pôles d\'activité\n• Nos coordonnées et horaires\n• Demande de devis\n• Prise de rendez-vous\n• Nos réalisations et actualités\n• Offres d\'emploi\n\nQue souhaitez-vous savoir ?';
    }

    // Réponse par défaut
    return 'Je ne suis pas sûr de bien comprendre votre question. Pour une réponse précise, je vous invite à contacter notre équipe au +241 04 80 23 44 ou par email à contact@cips-gabon.com. Puis-je vous aider avec autre chose ?';
  };

  const callChatbotApi = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Si le backend a une réponse textuelle structurée, on la renvoie telle quelle
      if (data.answer) {
        return data.answer as string;
      }

      // Fallback si pas de réponse claire
      return getBotFallbackResponse(userMessage);
    } catch (error) {
      console.error('[Chatbot] Erreur appel API chatbot:', error);
      // En cas d'erreur API, on revient à la logique locale
      return getBotFallbackResponse(userMessage);
    }
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await callChatbotApi(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur. Veuillez utiliser Chrome ou Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Bouton flottant - visible uniquement quand fermé */}
      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le chatbot"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="chatbot-window">
          {/* En-tête */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <img src="/CIPS_logo_noir_HD_transparent.png" alt="CIPS Logo" className="chatbot-logo" />
              </div>
              <div>
                <h3>Assistant CIPS</h3>
                <span className="chatbot-status">En ligne</span>
              </div>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {renderMessageText(message.text)}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="chatbot-input-area">
            <button
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceRecognition}
              title="Saisie vocale"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
              </svg>
            </button>
            <input
              type="text"
              className="chatbot-input"
              placeholder={isListening ? "Parlez maintenant..." : "Tapez votre message..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isListening}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={inputValue.trim() === ''}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

