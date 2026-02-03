import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentationAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification avant d'afficher la documentation
    const token = localStorage.getItem('admin_token');
    if (!token) {
      // Rediriger vers la page de connexion si non authentifié
      navigate('/admin');
      return;
    }

    // Rediriger directement vers le HTML complet en plein écran
    window.location.href = '/documentation-admin-complet.html';
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#002F6C'
    }}>
      Vérification de l'authentification...
    </div>
  );
};

export default DocumentationAdmin;

