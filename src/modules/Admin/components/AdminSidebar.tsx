import { Link, useNavigate } from 'react-router-dom';
import '../Dashboard.css';

interface AdminSidebarProps {
  currentPage: string;
}

const AdminSidebar = ({ currentPage }: AdminSidebarProps) => {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const user = localStorage.getItem('admin_user') 
    ? JSON.parse(localStorage.getItem('admin_user')!) 
    : null;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <img src="/CIPS_logo_noir_HD_transparent.png" alt="CIPS" className="sidebar-logo" />
        <h2>Admin CIPS</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}>
          📊 Dashboard
        </Link>
        {/* Menu ONPG : Ressources, Pharmacies, Pharmaciens, Analytics, Logs, Paramètres */}
        <Link to="/admin/resources" className={`nav-item ${currentPage === 'resources' ? 'active' : ''}`}>
          📚 Ressources
        </Link>
        <Link to="/admin/pharmacies" className={`nav-item ${currentPage === 'pharmacies' ? 'active' : ''}`}>
          🏥 Pharmacies
        </Link>
        <Link to="/admin/pharmaciens" className={`nav-item ${currentPage === 'pharmaciens' ? 'active' : ''}`}>
          👨‍⚕️ Pharmaciens
        </Link>
        <Link to="/admin/analytics" className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}>
          📈 Analytics
        </Link>
        <Link to="/admin/logs" className={`nav-item ${currentPage === 'logs' ? 'active' : ''}`}>
          📋 Logs système
        </Link>
        <Link to="/admin/settings" className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}>
          ⚙️ Paramètres
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-avatar">👤</span>
          <div>
            <p className="user-name">{user?.username || 'Admin'}</p>
            <p className="user-role">{user?.role || 'Administrateur'}</p>
          </div>
        </div>
        <button onClick={logout} className="logout-btn">
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

