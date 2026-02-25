import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../Admin/Dashboard.css';
import { ONPG_IMAGES } from '../../../utils/cloudinary-onpg';

interface PharmacienSidebarProps {
  currentPage: string;
}

const PharmacienSidebar = ({ currentPage }: PharmacienSidebarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin');
  };

  const user = localStorage.getItem('admin_user') 
    ? JSON.parse(localStorage.getItem('admin_user')!) 
    : null;

  return (
    <>
    {/* Bouton hamburger mobile */}
    <button
      type="button"
      className="pharmacien-sidebar-toggle"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Ouvrir le menu pharmacien"
    >
      <span />
      <span />
      <span />
    </button>

    {/* Overlay clicable pour fermer sur mobile */}
    {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

    <aside className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <img src={ONPG_IMAGES.logo} alt="ONPG" className="sidebar-logo" />
        <h2>Espace Pharmacien</h2>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/pharmacien/dashboard"
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          📊 Tableau de bord
        </Link>
        <Link
          to="/pharmacien/dashboard"
          className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          👤 Gérer mon profil
        </Link>
        <Link
          to="/pharmacien/theses"
          className={`nav-item ${currentPage === 'theses' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          📚 Mes Thèses
        </Link>
        <Link
          to="/pharmacien/messages"
          className={`nav-item ${currentPage === 'messages' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          ✉️ Messages à l'Ordre
        </Link>
        <Link
          to="/pharmacien/pharmacies"
          className={`nav-item ${currentPage === 'pharmacies' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
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
        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="logout-btn"
        >
          🚪 Déconnexion
        </button>
      </div>
    </aside>
    </>
  );
};

export default PharmacienSidebar;






