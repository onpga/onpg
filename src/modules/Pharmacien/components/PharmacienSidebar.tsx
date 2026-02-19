import { Link, useNavigate } from 'react-router-dom';
import '../../Admin/Dashboard.css';

interface PharmacienSidebarProps {
  currentPage: string;
}

const PharmacienSidebar = ({ currentPage }: PharmacienSidebarProps) => {
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
        <img src="/onpg-logo.png" alt="ONPG" className="sidebar-logo" />
        <h2>Espace Pharmacien</h2>
      </div>

      <nav className="sidebar-nav">
        <Link to="/pharmacien/dashboard" className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}>
          📊 Mon Profil
        </Link>
        <Link to="/pharmacien/pharmacies" className={`nav-item ${currentPage === 'pharmacies' ? 'active' : ''}`}>
          🏥 Mes Pharmacies
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-avatar">👨‍⚕️</span>
          <div>
            <p className="user-name">{user?.username || 'Pharmacien'}</p>
            <p className="user-role">Pharmacien</p>
          </div>
        </div>
        <button onClick={logout} className="logout-btn">
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default PharmacienSidebar;


