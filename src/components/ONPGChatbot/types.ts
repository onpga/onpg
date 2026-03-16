export type Sender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  createdAt: number;
}

export interface ChatIntent {
  id: string;
  keywords: string[];
  answer: string;
}

