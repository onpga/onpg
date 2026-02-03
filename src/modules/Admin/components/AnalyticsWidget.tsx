import { useState, useEffect } from 'react';
import './AnalyticsWidget.css';

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  avgDuration: string;
  mobilePercentage: number;
  sessions: number;
  conversions: {
    devis: number;
    contacts: number;
    simulations: number;
  };
  topPages: Array<{ page: string; views: number }>;
  trafficSources: Array<{ source: string; medium: string; users: number }>;
  adsKeywords: Array<{ keyword: string; campaign: string; users: number; conversions: number; cost: number }>;
}

const AnalyticsWidget = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30'); // 7, 30, 90 jours

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Appeler l'API backend qui interroge Google Analytics
      const response = await fetch(`/api/analytics/stats?period=${period}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-widget">
        <div className="analytics-header">
          <h2>📊 Statistiques du Site</h2>
        </div>
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-widget">
        <div className="analytics-header">
          <h2>📊 Statistiques du Site</h2>
        </div>
        <div className="analytics-error">
          <p>❌ Erreur lors du chargement des statistiques</p>
          <button onClick={fetchAnalytics} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-widget">
      <div className="analytics-header">
        <h2>📊 Statistiques du Site</h2>
        <div className="period-selector">
          <button
            className={period === '7' ? 'active' : ''}
            onClick={() => setPeriod('7')}
          >
            7 jours
          </button>
          <button
            className={period === '30' ? 'active' : ''}
            onClick={() => setPeriod('30')}
          >
            30 jours
          </button>
          <button
            className={period === '90' ? 'active' : ''}
            onClick={() => setPeriod('90')}
          >
            90 jours
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{data.visitors.toLocaleString()}</div>
            <div className="metric-label">Visiteurs</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📄</div>
          <div className="metric-content">
            <div className="metric-value">{data.pageViews.toLocaleString()}</div>
            <div className="metric-label">Pages vues</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{data.avgDuration}</div>
            <div className="metric-label">Durée moyenne</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📱</div>
          <div className="metric-content">
            <div className="metric-value">{data.mobilePercentage}%</div>
            <div className="metric-label">Mobile</div>
          </div>
        </div>
      </div>

      {/* Conversions */}
      <div className="analytics-section">
        <h3>🎯 Conversions</h3>
        <div className="conversions-grid">
          <div className="conversion-item">
            <span className="conversion-icon">✉️</span>
            <span className="conversion-label">Devis envoyés</span>
            <span className="conversion-value">{data.conversions.devis}</span>
          </div>
          <div className="conversion-item">
            <span className="conversion-icon">📞</span>
            <span className="conversion-label">Contacts</span>
            <span className="conversion-value">{data.conversions.contacts}</span>
          </div>
          <div className="conversion-item">
            <span className="conversion-icon">🔧</span>
            <span className="conversion-label">Simulations</span>
            <span className="conversion-value">{data.conversions.simulations}</span>
          </div>
        </div>
      </div>

      {/* Sources de trafic */}
      <div className="analytics-section">
        <h3>🌍 D'où viennent vos visiteurs ?</h3>
        <div className="traffic-sources">
          {data.trafficSources && data.trafficSources.length > 0 ? (
            data.trafficSources.map((source, index) => {
              const totalUsers = data.trafficSources.reduce((sum, s) => sum + s.users, 0);
              const percentage = Math.round((source.users / totalUsers) * 100);
              
              return (
                <div key={index} className="traffic-item">
                  <div className="traffic-info">
                    <span className="traffic-source">
                      {source.source === '(direct)' ? 'Direct (URL tapée)' : source.source}
                    </span>
                    <span className="traffic-medium">{source.medium}</span>
                  </div>
                  <div className="traffic-bar">
                    <div className="traffic-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="traffic-stats">{percentage}% ({source.users} visiteurs)</span>
                </div>
              );
            })
          ) : (
            <p className="no-data">Aucune donnée disponible</p>
          )}
        </div>
      </div>

      {/* Google Ads - Mots-clés */}
      {data.adsKeywords && data.adsKeywords.length > 0 && (
        <div className="analytics-section ads-section">
          <h3>💰 Publicités Google Ads - Mots-clés</h3>
          <div className="ads-keywords">
            {data.adsKeywords.map((ad, index) => (
              <div key={index} className="ad-keyword-item">
                <div className="ad-keyword-header">
                  <span className="ad-keyword">🔑 "{ad.keyword}"</span>
                  <span className="ad-campaign">📢 {ad.campaign}</span>
                </div>
                <div className="ad-stats">
                  <span className="ad-stat">
                    <span className="ad-label">Visiteurs:</span>
                    <span className="ad-value">{ad.users}</span>
                  </span>
                  <span className="ad-stat">
                    <span className="ad-label">Conversions:</span>
                    <span className="ad-value green">{ad.conversions}</span>
                  </span>
                  <span className="ad-stat">
                    <span className="ad-label">Coût:</span>
                    <span className="ad-value">{ad.cost.toLocaleString()} FCFA</span>
                  </span>
                  {ad.conversions > 0 && (
                    <span className="ad-stat">
                      <span className="ad-label">Coût/conversion:</span>
                      <span className="ad-value">{Math.round(ad.cost / ad.conversions).toLocaleString()} FCFA</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="ads-note">
            💡 Ces données proviennent de vos campagnes Google Ads. 
            Assurez-vous que Google Ads est bien lié à Google Analytics.
          </p>
        </div>
      )}

      {/* Top pages */}
      <div className="analytics-section">
        <h3>📈 Pages les plus visitées</h3>
        <div className="top-pages">
          {data.topPages.map((page, index) => (
            <div key={index} className="page-item">
              <span className="page-rank">{index + 1}</span>
              <span className="page-path">{page.page}</span>
              <span className="page-views">{page.views} vues</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lien vers Google Analytics */}
      <div className="analytics-footer">
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ga-link"
        >
          📊 Voir les statistiques complètes sur Google Analytics →
        </a>
      </div>
    </div>
  );
};

export default AnalyticsWidget;

