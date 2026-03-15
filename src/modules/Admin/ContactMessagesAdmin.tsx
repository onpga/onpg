import { useEffect, useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
  source?: 'site-public' | 'pharmacien' | string;
  pharmacienId?: string;
  reply?: string;
  replyAt?: string;
}

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/admin/contact-messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const list: ContactMessage[] = data.data || [];
        setMessages(list);
        if (!selectedId && list.length > 0) {
          setSelectedId(list[0]._id);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Erreur chargement messages de contact:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markMessageStatus = async (id: string, status: 'new' | 'read' | 'archived') => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`${API_URL}/admin/contact-messages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status } : m))
      );
    } catch (error) {
      console.error('Erreur mise à jour statut message:', error);
    }
  };

  const handleSelectMessage = (m: ContactMessage) => {
    setSelectedId(m._id);
    setReplyText('');
    if (m.status === 'new') {
      markMessageStatus(m._id, 'read');
    }
  };

  const selectedMessage = messages.find((m) => m._id === selectedId) || null;

  const filteredMessages = messages
    .filter((m) => {
      if (filter === 'new') return m.status === 'new';
      if (filter === 'archived') return m.status === 'archived';
      return true;
    })
    .filter((m) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        m.subject.toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term) ||
        m.name.toLowerCase().includes(term) ||
        (m.email || '').toLowerCase().includes(term)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="messages" />
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-header" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h1>Messagerie</h1>
              <p style={{ fontSize: '1.05rem', marginTop: '0.4rem', color: '#666' }}>
                Tous les messages reçus du site public et des pharmaciens.
              </p>
            </div>
          </div>

          {loading ? (
            <p>Chargement des messages...</p>
          ) : messages.length === 0 ? (
            <p>Aucun message pour le moment.</p>
          ) : (
            <div className="messages-layout">
              <aside className="messages-sidebar">
                <div className="messages-filters">
                  <button
                    className={`messages-filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    Tous
                  </button>
                  <button
                    className={`messages-filter-btn ${filter === 'new' ? 'active' : ''}`}
                    onClick={() => setFilter('new')}
                  >
                    Non lus
                  </button>
                  <button
                    className={`messages-filter-btn ${filter === 'archived' ? 'active' : ''}`}
                    onClick={() => setFilter('archived')}
                  >
                    Archivés
                  </button>
                </div>

                <div className="messages-search">
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou sujet"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="messages-list">
                  {filteredMessages.map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      className={`message-item ${m._id === selectedId ? 'active' : ''} ${
                        m.status === 'new' ? 'unread' : ''
                      }`}
                      onClick={() => handleSelectMessage(m)}
                    >
                      <div className="message-item-header">
                        <span className="message-item-name">{m.name}</span>
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
                        <span
                          className={`message-source-pill ${
                            m.source === 'pharmacien' ? 'pharmacien' : 'public'
                          }`}
                        >
                          {m.source === 'pharmacien' ? 'Pharmacien' : 'Public'}
                        </span>
                        {m.status === 'new' && (
                          <span className="message-status-dot" aria-label="Nouveau message" />
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
                          <span className="messages-detail-name">{selectedMessage.name}</span>
                          <span className="messages-detail-email">{selectedMessage.email}</span>
                          {selectedMessage.phone && (
                            <span className="messages-detail-phone">
                              {selectedMessage.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="messages-detail-right">
                        <span
                          className={`message-source-pill ${
                            selectedMessage.source === 'pharmacien' ? 'pharmacien' : 'public'
                          }`}
                        >
                          {selectedMessage.source === 'pharmacien'
                            ? 'Message envoyé par un pharmacien'
                            : 'Message envoyé depuis le site public'}
                        </span>
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
                      <p>{selectedMessage.message}</p>
                    </div>

                    <footer className="messages-detail-footer">
                      <div className="messages-detail-actions">
                        {selectedMessage.status !== 'archived' && (
                          <button
                            type="button"
                            className="messages-action-btn secondary"
                            onClick={() => markMessageStatus(selectedMessage._id, 'archived')}
                          >
                            Archiver
                          </button>
                        )}
                        {selectedMessage.status === 'archived' && (
                          <button
                            type="button"
                            className="messages-action-btn secondary"
                            onClick={() => markMessageStatus(selectedMessage._id, 'read')}
                          >
                            Désarchiver
                          </button>
                        )}
                      </div>

                      {selectedMessage.source === 'pharmacien' && (
                        <div className="messages-reply-block">
                          {selectedMessage.reply ? (
                            <div className="messages-reply-display">
                              <div className="messages-reply-label">Réponse envoyée à ce pharmacien</div>
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
                          ) : (
                            <div className="messages-reply-form">
                              <label htmlFor="reply-textarea">
                                Répondre à ce pharmacien
                              </label>
                              <textarea
                                id="reply-textarea"
                                placeholder="Votre réponse à envoyer au pharmacien..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                              />
                              <button
                                type="button"
                                className="messages-action-btn primary"
                                onClick={async () => {
                                  if (!replyText.trim()) return;
                                  try {
                                    const token = localStorage.getItem('admin_token');
                                    const resReply = await fetch(
                                      `${API_URL}/admin/contact-messages/${selectedMessage._id}/reply`,
                                      {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          Authorization: `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ reply: replyText.trim() })
                                      }
                                    );
                                    const dataReply = await resReply.json().catch(() => ({}));
                                    if (resReply.ok && dataReply.success !== false) {
                                      setReplyText('');
                                      await loadMessages();
                                    } else {
                                      console.error(
                                        'Erreur réponse message:',
                                        (dataReply as any).error || 'Erreur'
                                      );
                                    }
                                  } catch (err) {
                                    console.error('Erreur réponse message:', err);
                                  }
                                }}
                              >
                                Envoyer la réponse
                              </button>
                            </div>
                          )}
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

export default ContactMessagesAdmin;



