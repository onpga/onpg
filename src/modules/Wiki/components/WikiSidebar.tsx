import { Link, useNavigate } from 'react-router-dom';
import '../WikiDashboard.css';

interface WikiSidebarProps {
  currentPage: string;
}

const WikiSidebar = ({ currentPage }: WikiSidebarProps) => {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('wiki_token');
    localStorage.removeItem('wiki_user');
    navigate('/wiki/login');
  };

  const user = localStorage.getItem('wiki_user') 
    ? JSON.parse(localStorage.getItem('wiki_user')!) 
    : null;

  return (
    <aside className="wiki-sidebar">
      <div className="wiki-sidebar-header">
        <img src="/CIPS_logo_noir_HD_transparent.png" alt="CIPS" className="wiki-sidebar-logo" />
        <h2>Wiki Documentation</h2>
      </div>

      <nav className="wiki-sidebar-nav">
        <Link to="/wiki" className={`wiki-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}>
          📚 Documentation
        </Link>
        <Link to="/wiki/users" className={`wiki-nav-item ${currentPage === 'users' ? 'active' : ''}`}>
          👥 Utilisateurs
        </Link>
        <Link to="/wiki/settings" className={`wiki-nav-item ${currentPage === 'settings' ? 'active' : ''}`}>
          ⚙️ Paramètres
        </Link>
      </nav>

      <div className="wiki-sidebar-footer">
        <div className="wiki-user-info">
          <span className="wiki-user-avatar">👤</span>
          <div>
            <p className="wiki-user-name">{user?.username || 'Utilisateur'}</p>
            <p className="wiki-user-role">{user?.role || 'Membre'}</p>
          </div>
        </div>
        <button onClick={logout} className="wiki-logout-btn">
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default WikiSidebar;

