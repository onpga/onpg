import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WikiSidebar from './components/WikiSidebar';
import './WikiDashboard.css';

interface DocItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const WikiDashboard = () => {
  const navigate = useNavigate();

  const documents: DocItem[] = [
    {
      id: 'admin',
      title: 'Documentation Panneau d\'Administration',
      description: 'Guide complet pour utiliser le panneau d\'administration CIPS, incluant toutes les fonctionnalités, la gestion des contenus, et les paramètres système.',
      icon: '⚙️',
      link: '/documentation-admin-complet.html',
      color: '#667eea'
    },
    {
      id: 'technique',
      title: 'Documentation Technique',
      description: 'Architecture technique du projet, technologies utilisées (React, Node.js, MongoDB, Railway, Docker, Cloudinary), schémas d\'infrastructure et sécurité.',
      icon: '🔧',
      link: '/documentation-technique-cips.html',
      color: '#f093fb'
    },
    {
      id: 'deploiement',
      title: 'Guide de Déploiement Railway',
      description: 'Guide pas à pas pour déployer l\'application sur Railway, configuration des variables d\'environnement, intégration GitHub, et processus de déploiement.',
      icon: '🚀',
      link: '/guide-deploiement-railway-cips.html',
      color: '#4facfe'
    }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('wiki_token');
    const userData = localStorage.getItem('wiki_user');
    
    if (!token || !userData) {
      navigate('/wiki/login');
      return;
    }
  };

  const openDocument = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="wiki-dashboard-page">
      <WikiSidebar currentPage="dashboard" />

      <main className="wiki-dashboard-main">
        <header className="wiki-page-header">
          <div>
            <h1>📚 Centre de Documentation CIPS</h1>
            <p>Accédez à toute la documentation du projet</p>
          </div>
        </header>

        <div className="wiki-docs-grid">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="wiki-doc-card"
              onClick={() => openDocument(doc.link)}
              style={{ borderTopColor: doc.color }}
            >
              <div className="wiki-doc-icon" style={{ backgroundColor: doc.color + '20' }}>
                {doc.icon}
              </div>
              <h3>{doc.title}</h3>
              <p>{doc.description}</p>
              <button className="wiki-doc-btn" style={{ backgroundColor: doc.color }}>
                📖 Consulter →
              </button>
            </div>
          ))}
        </div>

        <div className="wiki-info-section">
          <div className="wiki-info-card">
            <h3>ℹ️ À propos</h3>
            <p>
              Ce centre de documentation regroupe tous les documents techniques et fonctionnels 
              du projet CIPS. Les documents sont accessibles en lecture seule et s'ouvrent dans un nouvel onglet.
            </p>
            <ul>
              <li>📄 Documentation administrative complète</li>
              <li>🏗️ Architecture technique détaillée</li>
              <li>🚀 Guide de déploiement pas à pas</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WikiDashboard;

