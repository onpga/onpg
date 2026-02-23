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
}

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

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
        setMessages(data.data || []);
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

  return (
    <div className="admin-layout">
      <AdminSidebar currentPage="messages" />
      <main className="admin-main">
        <div className="admin-content">
          <h1>💬 Messages de contact</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Messages envoyés via le formulaire de contact public du site.
          </p>

          {loading ? (
            <p>Chargement des messages...</p>
          ) : messages.length === 0 ? (
            <p>Aucun message pour le moment.</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Sujet</th>
                    <th>Message</th>
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
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.phone || '—'}</td>
                      <td>{m.subject}</td>
                      <td style={{ maxWidth: 320, whiteSpace: 'pre-wrap' }}>{m.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContactMessagesAdmin;


