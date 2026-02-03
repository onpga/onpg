import './Dashboard.css';
// import AnalyticsWidget from './components/AnalyticsWidget'; // Désactivé temporairement
import DetailedAnalyticsWidget from './components/DetailedAnalyticsWidget';
import AdminSidebar from './components/AdminSidebar';

const Analytics = () => {
  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="analytics" />

      <main className="dashboard-main">
        {/* Top bar utilisateur */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <h1>📈 Analytics</h1>
            <p className="page-subtitle">Statistiques et analytics détaillées du site</p>
          </div>
          <div className="topbar-right">
            <div className="user-info-compact">
              <span className="user-avatar-small">👤</span>
              <span className="user-name-small">{user?.username || 'Admin'}</span>
            </div>
          </div>
        </div>

        {/* Google Analytics Widget - DÉSACTIVÉ TEMPORAIREMENT */}
        {/* <AnalyticsWidget /> */}

        {/* Detailed Analytics Widget - Notre système de tracking */}
        <DetailedAnalyticsWidget />
      </main>
    </div>
  );
};

export default Analytics;

