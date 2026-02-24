import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacienSidebar from './components/PharmacienSidebar';
import '../Admin/Dashboard.css';

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
  const [messageOrdre, setMessageOrdre] = useState({
    sujet: '',
    message: ''
  });
  const [sendingMessageOrdre, setSendingMessageOrdre] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setMessages(data.data || []);
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

  if (!user) return null;

  return (
    <div className="admin-layout">
      <PharmacienSidebar currentPage="messages" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>✉️ Messages à l'Ordre</h1>

          {feedback && (
            <div className={`message ${feedback.type}`} style={{ marginBottom: '1rem' }}>
              {feedback.text}
            </div>
          )}

          <div className="profile-section">
            <h2>Envoyer un message à l'Ordre</h2>
            <div className="profile-edit-form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="msgSujet">Sujet *</label>
                <input
                  type="text"
                  id="msgSujet"
                  value={messageOrdre.sujet}
                  onChange={(e) => setMessageOrdre({ ...messageOrdre, sujet: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="msgTexte">Message *</label>
                <textarea
                  id="msgTexte"
                  value={messageOrdre.message}
                  onChange={(e) => setMessageOrdre({ ...messageOrdre, message: e.target.value })}
                  rows={6}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <button
                className="action-btn primary"
                onClick={handleSendMessageOrdre}
                disabled={sendingMessageOrdre}
              >
                {sendingMessageOrdre ? '✉️ Envoi...' : '✉️ Envoyer le message à l\'Ordre'}
              </button>
            </div>
          </div>

          <div className="profile-section" style={{ marginTop: '2rem' }}>
            <h2>Historique de mes messages</h2>
            {loading ? (
              <p>Chargement des messages...</p>
            ) : messages.length === 0 ? (
              <p>Aucun message envoyé pour le moment.</p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sujet</th>
                      <th>Message</th>
                      <th>Réponse de l'Ordre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m) => (
                      <tr key={m._id}>
                        <td>
                          {new Date(m.createdAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>{m.subject}</td>
                        <td style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>{m.message}</td>
                        <td style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
                          {m.reply ? (
                            <>
                              <div>{m.reply}</div>
                              {m.replyAt && (
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                                  Répondu le{' '}
                                  {new Date(m.replyAt).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              )}
                            </>
                          ) : (
                            <span style={{ color: '#999' }}>En attente de réponse</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PharmacienMessages;


