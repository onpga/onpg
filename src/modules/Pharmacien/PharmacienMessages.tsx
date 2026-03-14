import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';
import './PharmacienMessages.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface PharmacienMessage {
  _id: string;
  subject: string;
  message: string;
  createdAt: string;
  reply?: string;
  replyAt?: string;
}

const PharmacienMessages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<PharmacienMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageOrdre, setMessageOrdre] = useState({
    sujet: '',
    message: ''
  });
  const [sendingMessageOrdre, setSendingMessageOrdre] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (!storedUser) {
      navigate('/admin');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'pharmacien') {
      navigate('/admin');
      return;
    }

    setUser(userData);
    loadMessages(userData);
  }, [navigate]);

  const loadMessages = async (currentUser = user) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const userId = currentUser?._id || JSON.parse(localStorage.getItem('admin_user') || '{}')._id;

      const res = await fetch(`${API_URL}/pharmacien/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        }
      });
      const data = await res.json();
      if (data.success) {
        const list: PharmacienMessage[] = data.data || [];
        setMessages(list);
        if (!selectedId && list.length > 0) {
          setSelectedId(list[0]._id);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Erreur chargement messages pharmacien:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessageOrdre = async () => {
    setFeedback(null);

    if (!messageOrdre.sujet || !messageOrdre.message) {
      setFeedback({ type: 'error', text: 'Veuillez renseigner le sujet et le message.' });
      return;
    }

    try {
      setSendingMessageOrdre(true);
      const token = localStorage.getItem('admin_token');
      const userId = user._id;

      const response = await fetch(`${API_URL}/pharmacien/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify(messageOrdre)
      });

      const data = await response.json();
      if (data.success) {
        setFeedback({ type: 'success', text: 'Message envoyé à l\'Ordre avec succès.' });
        setMessageOrdre({ sujet: '', message: '' });
        setShowNewMessageForm(false);
        await loadMessages();
      } else {
        setFeedback({ type: 'error', text: data.error || 'Erreur lors de l\'envoi du message.' });
      }
    } catch (error) {
      console.error('Erreur envoi message ordre:', error);
      setFeedback({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setSendingMessageOrdre(false);
    }
  };

  const selectedMessage = messages.find((m) => m._id === selectedId) || null;

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!user) return null;

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="messages" />
      <main className="admin-main pharmacien-messages-page">
        <div className="admin-content pharmacien-messages-content">
          <div className="admin-header pharmacien-messages-header">
            <div>
              <h1>Messages a l Ordre</h1>
              <p className="pharmacien-messages-subtitle">
                Envoyez des messages à l'Ordre et consultez les réponses.
              </p>
              <div className="pharmacien-messages-kpis">
                <span className="pharmacien-messages-kpi">
                  {messages.length} message{messages.length > 1 ? 's' : ''}
                </span>
                <span className="pharmacien-messages-kpi">
                  {messages.filter((m) => !m.reply).length} en attente
                </span>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowNewMessageForm(!showNewMessageForm)}
            >
              {showNewMessageForm ? 'Annuler' : 'Nouveau message'}
            </button>
          </div>

          {feedback && (
            <div
              className={`pharmacien-messages-feedback ${feedback.type}`}
            >
              {feedback.text}
            </div>
          )}

          {showNewMessageForm && (
            <div className="profile-section pharmacien-messages-compose">
              <h2>Envoyer un message a l Ordre</h2>
              <div className="profile-edit-form pharmacien-messages-compose-form">
                <div className="form-group">
                  <label htmlFor="msgSujet">Sujet *</label>
                  <input
                    type="text"
                    id="msgSujet"
                    value={messageOrdre.sujet}
                    onChange={(e) => setMessageOrdre({ ...messageOrdre, sujet: e.target.value })}
                    className="pharmacien-messages-input"
                    placeholder="Ex: Question sur les cotisations"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="msgTexte">Message *</label>
                  <textarea
                    id="msgTexte"
                    value={messageOrdre.message}
                    onChange={(e) => setMessageOrdre({ ...messageOrdre, message: e.target.value })}
                    rows={6}
                    className="pharmacien-messages-input"
                    placeholder="Votre message à l'Ordre..."
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={handleSendMessageOrdre}
                  disabled={sendingMessageOrdre}
                >
                  {sendingMessageOrdre ? 'Envoi...' : 'Envoyer le message'}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="pharmacien-messages-loading">Chargement des messages...</p>
            ) : messages.length === 0 ? (
            <div className="messages-detail-empty">
              <p>Aucun message envoyé pour le moment.</p>
            </div>
            ) : (
            <div className="messages-layout">
              <aside className="messages-sidebar">
                <div className="messages-list">
                  {sortedMessages.map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      className={`message-item ${m._id === selectedId ? 'active' : ''} ${
                        m.reply ? '' : 'unread'
                      }`}
                      onClick={() => setSelectedId(m._id)}
                    >
                      <div className="message-item-header">
                        <span className="message-item-name">Message à l'Ordre</span>
                        <span className="message-item-date">
                          {new Date(m.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="message-item-subject">{m.subject}</div>
                      <div className="message-item-meta">
                        {m.reply ? (
                          <span className="message-source-pill public">
                            Repondu
                          </span>
                        ) : (
                          <span className="message-source-pill pharmacien">
                            En attente
                          </span>
                        )}
                        {!m.reply && (
                          <span className="message-status-dot" aria-label="En attente de réponse" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="messages-detail">
                {!selectedMessage ? (
                  <div className="messages-detail-empty">
                    <p>Sélectionnez un message dans la liste pour l&apos;afficher.</p>
                  </div>
                ) : (
                  <div className="messages-detail-card">
                    <header className="messages-detail-header">
                      <div>
                        <h2>{selectedMessage.subject}</h2>
                        <div className="messages-detail-meta">
                          <span className="messages-detail-name">Message envoyé à l'Ordre</span>
                        </div>
                      </div>
                      <div className="messages-detail-right">
                        <span className="messages-detail-date">
                          {new Date(selectedMessage.createdAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </header>

                    <div className="messages-detail-body">
                      <p className="pharmacien-message-body-text">{selectedMessage.message}</p>
                    </div>

                    <footer className="messages-detail-footer">
                      {selectedMessage.reply ? (
                        <div className="messages-reply-block">
                          <div className="messages-reply-display">
                            <div className="messages-reply-label">Réponse de l'Ordre</div>
                            <div className="messages-reply-content">
                              {selectedMessage.reply}
                            </div>
                            {selectedMessage.replyAt && (
                              <div className="messages-reply-meta">
                                  Répondu le{' '}
                                {new Date(selectedMessage.replyAt).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              )}
                          </div>
                        </div>
                          ) : (
                        <div className="messages-reply-block">
                          <div className="pharmacien-awaiting-reply">
                            En attente de reponse de l Ordre
                          </div>
                        </div>
                      )}
                    </footer>
              </div>
            )}
              </section>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PharmacienMessages;


