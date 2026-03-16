import { CHAT_INTENTS, FALLBACK_ANSWER } from './knowledge';
import { ChatIntent } from './types';

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const scoreIntent = (intent: ChatIntent, normalizedInput: string): number => {
  let score = 0;
  const tokens = new Set(normalizedInput.split(' '));

  for (const keyword of intent.keywords) {
    const k = normalize(keyword);
    if (!k) continue;

    // Mot unique: correspondance stricte sur token
    if (!k.includes(' ')) {
      if (tokens.has(k)) {
        score += Math.max(1.2, k.length / 5);
      }
      continue;
    }

    // Expression: bonus fort uniquement si l'expression est vraiment presente
    if (normalizedInput.includes(k)) {
      score += Math.max(2, k.length / 4);
    }
  }
  return score;
};

export const getBotReply = (input: string): string => {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return FALLBACK_ANSWER;

  let bestIntent: ChatIntent | null = null;
  let bestScore = 0;
  let secondScore = 0;

  for (const intent of CHAT_INTENTS) {
    const score = scoreIntent(intent, normalizedInput);
    if (score > bestScore) {
      secondScore = bestScore;
      bestScore = score;
      bestIntent = intent;
    } else if (score > secondScore) {
      secondScore = score;
    }
  }

  // Threshold prudent + verification d'ambiguite pour eviter les reponses hors sujet.
  const isAmbiguous = secondScore > 0 && bestScore - secondScore < 0.9;
  if (!bestIntent || bestScore < 1.4 || isAmbiguous) {
    return FALLBACK_ANSWER;
  }

  return bestIntent.answer;
};

