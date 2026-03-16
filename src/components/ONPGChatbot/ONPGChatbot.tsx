import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { getBotReply } from './engine';
import { CHATBOT_WELCOME, QUICK_QUESTIONS } from './knowledge';
import { ChatMessage } from './types';
import './ONPGChatbot.css';

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const TOKEN_REGEX =
  /(https?:\/\/[^\s]+|\/[a-z0-9\-\/]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s]{6,})/gi;

const renderMessage = (text: string): ReactNode[] => {
  return text.split('\n').map((line, lineIndex) => {
    const parts: ReactNode[] = [];
    let currentIndex = 0;
    let match: RegExpExecArray | null;
    const regex = new RegExp(TOKEN_REGEX);

    while ((match = regex.exec(line)) !== null) {
      const token = match[0];
      const start = match.index;
      const end = start + token.length;

      if (start > currentIndex) {
        parts.push(line.slice(currentIndex, start));
      }

      let href = token;
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(token)) {
        href = `mailto:${token}`;
      } else if (/^\+?\d[\d\s]{6,}$/.test(token)) {
        href = `tel:${token.replace(/\s+/g, '')}`;
      } else if (token.startsWith('/')) {
        href = token;
      }
      const openInNewTab = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/');

      parts.push(
        <a
          key={`${lineIndex}-${start}`}
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {token}
        </a>
      );
      currentIndex = end;
    }

    if (currentIndex < line.length) {
      parts.push(line.slice(currentIndex));
    }

    return <p key={`${line}-${lineIndex}`}>{parts}</p>;
  });
};

const ONPGChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showPrompt, setShowPrompt] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nowId(), sender: 'bot', text: CHATBOT_WELCOME, createdAt: Date.now() },
  ]);

  const quickQuestions = useMemo(() => QUICK_QUESTIONS, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: nowId(),
      sender: 'user',
      text: trimmed,
      createdAt: Date.now(),
    };

    const botMessage: ChatMessage = {
      id: nowId(),
      sender: 'bot',
      text: getBotReply(trimmed),
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <>
      {!open && (
        <>
          {showPrompt && (
            <div className="onpg-chatbot-prompt" role="note" aria-live="polite">
              <button
                type="button"
                className="onpg-chatbot-prompt-text"
                onClick={() => setOpen(true)}
                aria-label="Ouvrir l'assistant ONPG"
              >
                Bonjour, comment puis-je vous aider ?
              </button>
              <button
                type="button"
                className="onpg-chatbot-prompt-close"
                onClick={dismissPrompt}
                aria-label="Fermer ce message"
              >
                ×
              </button>
            </div>
          )}
          <button
            type="button"
            className="onpg-chatbot-toggle"
            aria-label="Ouvrir l'assistant ONPG"
            onClick={() => setOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </>
      )}

      {open && (
        <section className="onpg-chatbot-panel" aria-label="Assistant ONPG">
          <header className="onpg-chatbot-header">
            <div>
              <div className="onpg-chatbot-title">Assistant ONPG</div>
              <div className="onpg-chatbot-subtitle-secondary">Inscription, demarches, orientation</div>
            </div>
            <button
              type="button"
              className="onpg-chatbot-close"
              aria-label="Fermer l'assistant"
              onClick={() => setOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <div className="onpg-chatbot-quick">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                className="onpg-chatbot-chip"
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="onpg-chatbot-messages">
            {messages.map((m) => (
              <article key={m.id} className={`onpg-chatbot-message ${m.sender}`}>
                {renderMessage(m.text)}
              </article>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="onpg-chatbot-composer">
            <input
              className="onpg-chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Posez votre question..."
            />
            <button
              type="button"
              className="onpg-chatbot-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
            >
              Envoyer
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default ONPGChatbot;

