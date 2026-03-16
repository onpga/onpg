import { ChatIntent } from './types';

export const ONPG_CONTACT_BLOCK = [
  'Pour une confirmation officielle, contactez directement l\'ONPG :',
  'Tel : 076 50 20 32',
  'Email : onpg2025@gmail.com',
  'Adresse : CC4J+WC6, Montee Louis, Libreville',
].join('\n');

export const CHATBOT_WELCOME =
  'Bonjour, je suis l\'assistant ONPG. Je peux vous aider sur l\'inscription a l\'Ordre, la deontologie, la formation continue, les sections, les pharmacies et les demarches administratives.';

export const QUICK_QUESTIONS: string[] = [
  'Comment s\'inscrire a l\'Ordre ?',
  'Quelles pieces fournir ?',
  'Quels sont les delais ?',
  'Comment contacter l\'ONPG ?',
];

export const CHAT_INTENTS: ChatIntent[] = [
  {
    id: 'greeting',
    keywords: ['bonjour', 'salut', 'bonsoir', 'hello', 'hey'],
    answer:
      'Bonjour. Je peux vous guider sur les demarches ONPG : inscription, pieces, sections, deontologie, formation continue et contact.',
  },
  {
    id: 'inscription-steps',
    keywords: ['inscription', 'inscrire', 'adherer', 'adhesion', 'tableau ordre', 'tableau'],
    answer: [
      'Pour l\'inscription a l\'Ordre, suivez en general ces etapes :',
      '1) Constituer le dossier administratif et professionnel.',
      '2) Deposer la demande aupres de l\'ONPG.',
      '3) Verification du dossier et passage en commission si necessaire.',
      '4) Notification de decision puis inscription au tableau.',
      '',
      'Je peux vous detailler les pieces a fournir.',
    ].join('\n'),
  },
  {
    id: 'inscription-documents',
    keywords: ['piece', 'pieces', 'document', 'dossier', 'fournir', 'justificatif'],
    answer: [
      'Pieces couramment demandees (selon profil) :',
      '- Piece d\'identite valide',
      '- Diplome en pharmacie / attestations',
      '- Extrait de casier judiciaire (si requis)',
      '- Photos d\'identite',
      '- Formulaire de demande complet',
      '- Justificatif de paiement des frais eventuels',
      '',
      'La liste exacte peut varier. Verifiez toujours avec l\'ONPG avant depot.',
      ONPG_CONTACT_BLOCK,
    ].join('\n'),
  },
  {
    id: 'inscription-delay',
    keywords: ['delai', 'duree', 'combien de temps', 'temps traitement', 'quand reponse'],
    answer: [
      'Le delai depend de la completude du dossier et du calendrier de traitement.',
      'Un dossier complet est traite plus rapidement qu\'un dossier incomplet.',
      'Pour un delai officiel actualise, utilisez le contact ONPG :',
      ONPG_CONTACT_BLOCK,
    ].join('\n'),
  },
  {
    id: 'sections',
    keywords: [
      'section',
      'sections',
      'section a',
      'section b',
      'section c',
      'section d',
      'categorie pharmacien',
      'tableau ordre',
    ],
    answer: [
      'L\'ONPG organise les membres par sections (A, B, C, D) selon le cadre d\'exercice.',
      'La section exacte depend de votre situation professionnelle.',
      'Si vous voulez, je peux vous orienter vers la page des sections et le tableau de l\'Ordre.',
    ].join('\n'),
  },
  {
    id: 'deontologie',
    keywords: ['deontologie', 'ethique', 'code', 'obligation professionnelle', 'discipline'],
    answer: [
      'La deontologie encadre les obligations professionnelles du pharmacien :',
      '- Qualite et securite de la dispensation',
      '- Confidentialite et secret professionnel',
      '- Respect du cadre legal et des bonnes pratiques',
      '',
      'Vous pouvez consulter le document de deontologie dans la rubrique Pratique.',
    ].join('\n'),
  },
  {
    id: 'formation',
    keywords: ['formation', 'continue', 'fmc', 'obligatoire', 'catalogue'],
    answer: [
      'La formation continue permet de maintenir et renforcer les competences professionnelles.',
      'Dans la rubrique Formation continue, vous trouverez le catalogue, les details et les modalites.',
      'Je peux aussi vous indiquer comment contacter l\'ONPG pour les sessions a venir.',
    ].join('\n'),
  },
  {
    id: 'pharmacies',
    keywords: ['pharmacie', 'garde', 'trouver pharmacie', 'annuaire'],
    answer: [
      'Vous pouvez utiliser l\'annuaire ONPG pour trouver une pharmacie par ville/quartier, y compris celles de garde.',
      'Page utile : /pratique/pharmacies',
    ].join('\n'),
  },
  {
    id: 'contact',
    keywords: ['contact', 'telephone', 'mail', 'email', 'adresse', 'joindre', 'appeler'],
    answer: ONPG_CONTACT_BLOCK,
  },
  {
    id: 'legal',
    keywords: ['cgu', 'confidentialite', 'mentions legales', 'donnees personnelles'],
    answer:
      'Les pages legales sont disponibles en pied de page : Mentions legales, Politique de confidentialite, CGU.',
  },
  {
    id: 'thanks',
    keywords: ['merci', 'parfait', 'ok', 'super'],
    answer: 'Avec plaisir. Si vous voulez, je peux vous guider pas a pas pour votre dossier d\'inscription.',
  },
];

export const FALLBACK_ANSWER = [
  'Je n\'ai pas une certitude suffisante pour vous donner une reponse officielle sur ce point.',
  ONPG_CONTACT_BLOCK,
].join('\n');

