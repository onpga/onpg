import { useState, useEffect } from 'react';
import './DetailedAnalyticsWidget.css';

interface DetailedAnalyticsData {
  period: number;
  summary: {
    totalSessions: number;
    totalPageViews: number;
    avgTimePerSession: number;
    totalTimeSpent: number;
  };
  geography: {
    countries: Array<{ country: string; count: number }>;
    cities: Array<{ city: string; count: number }>;
  };
  technology: {
    devices: { desktop?: number; mobile?: number; tablet?: number };
    browsers: Array<{ browser: string; count: number }>;
    operatingSystems: Array<{ os: string; count: number }>;
  };
  traffic: {
    referrers: Array<{ referrer: string; count: number }>;
  };
  content: {
    topPages: Array<{ page: string; views: number }>;
    avgTimePerPage: Array<{ page: string; avgTime: number }>;
  };
  recentSessions: Array<{
    sessionId: string;
    startedAt: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    referrer?: string;
    pageViews: number;
    timeSpent: number;
  }>;
}

const DetailedAnalyticsWidget = () => {
  const [data, setData] = useState<DetailedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7'); // 7, 30, 90 jours
  const [activeTab, setActiveTab] = useState('overview'); // overview, geography, technology, traffic, content

  useEffect(() => {
    fetchDetailedAnalytics();
  }, [period]);

  const fetchDetailedAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/detailed?period=${period}&limit=100`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Erreur chargement analytics détaillées:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatReferrer = (ref: string) => {
    if (ref === '(direct)') return 'Direct (URL tapée)';
    try {
      const url = new URL(ref);
      return url.hostname.replace('www.', '');
    } catch {
      return ref;
    }
  };

  if (loading) {
    return (
      <div className="detailed-analytics-widget">
        <div className="analytics-header">
          <h2>📊 Analytics Détaillées</h2>
        </div>
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="detailed-analytics-widget">
        <div className="analytics-header">
          <h2>📊 Analytics Détaillées</h2>
        </div>
        <div className="analytics-empty">
          <p>Aucune donnée disponible pour le moment.</p>
          <p className="empty-hint">Les visiteurs commenceront à être trackés automatiquement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detailed-analytics-widget">
      <div className="analytics-header">
        <h2>📊 Analytics Détaillées</h2>
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

      {/* Résumé global */}
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <div className="summary-value">{data.summary.totalSessions}</div>
            <div className="summary-label">Sessions</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📄</div>
          <div className="summary-content">
            <div className="summary-value">{data.summary.totalPageViews}</div>
            <div className="summary-label">Pages vues</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⏱️</div>
          <div className="summary-content">
            <div className="summary-value">{formatTime(data.summary.avgTimePerSession)}</div>
            <div className="summary-label">Temps moyen / session</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-value">
              {data.summary.totalPageViews > 0 
                ? (data.summary.totalPageViews / data.summary.totalSessions).toFixed(1)
                : '0'}
            </div>
            <div className="summary-label">Pages / session</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="analytics-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button
          className={activeTab === 'geography' ? 'active' : ''}
          onClick={() => setActiveTab('geography')}
        >
          🌍 Géographie
        </button>
        <button
          className={activeTab === 'technology' ? 'active' : ''}
          onClick={() => setActiveTab('technology')}
        >
          💻 Technologie
        </button>
        <button
          className={activeTab === 'traffic' ? 'active' : ''}
          onClick={() => setActiveTab('traffic')}
        >
          🔗 Trafic
        </button>
        <button
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          📄 Contenu
        </button>
      </div>

      {/* Contenu des tabs */}
      <div className="analytics-tab-content">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="tab-panel">
            <div className="panel-grid">
              {/* Top pays */}
              <div className="panel-section">
                <h3>🌍 Top Pays</h3>
                <div className="simple-list">
                  {data.geography.countries.slice(0, 5).map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.country}</span>
                      <span className="item-value">{item.count} visites</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top appareils */}
              <div className="panel-section">
                <h3>📱 Appareils</h3>
                <div className="device-stats">
                  <div className="device-item">
                    <span className="device-icon">🖥️</span>
                    <span className="device-label">Desktop</span>
                    <span className="device-value">{data.technology.devices.desktop || 0}</span>
                  </div>
                  <div className="device-item">
                    <span className="device-icon">📱</span>
                    <span className="device-label">Mobile</span>
                    <span className="device-value">{data.technology.devices.mobile || 0}</span>
                  </div>
                  <div className="device-item">
                    <span className="device-icon">📲</span>
                    <span className="device-label">Tablet</span>
                    <span className="device-value">{data.technology.devices.tablet || 0}</span>
                  </div>
                </div>
              </div>

              {/* Top pages */}
              <div className="panel-section full-width">
                <h3>📄 Pages les plus visitées</h3>
                <div className="simple-list">
                  {data.content.topPages.slice(0, 5).map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.page}</span>
                      <span className="item-value">{item.views} vues</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Géographie */}
        {activeTab === 'geography' && (
          <div className="tab-panel">
            <div className="panel-grid">
              <div className="panel-section">
                <h3>🌍 Pays</h3>
                <div className="simple-list">
                  {data.geography.countries.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.country}</span>
                      <span className="item-value">{item.count} sessions</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-section">
                <h3>🏙️ Villes</h3>
                <div className="simple-list">
                  {data.geography.cities.length > 0 ? (
                    data.geography.cities.map((item, index) => (
                      <div key={index} className="list-item">
                        <span className="item-rank">{index + 1}</span>
                        <span className="item-label">{item.city}</span>
                        <span className="item-value">{item.count} sessions</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">Données de villes non disponibles</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technologie */}
        {activeTab === 'technology' && (
          <div className="tab-panel">
            <div className="panel-grid">
              <div className="panel-section">
                <h3>🌐 Navigateurs</h3>
                <div className="simple-list">
                  {data.technology.browsers.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.browser}</span>
                      <span className="item-value">{item.count} sessions</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-section">
                <h3>💻 Systèmes d'exploitation</h3>
                <div className="simple-list">
                  {data.technology.operatingSystems.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.os}</span>
                      <span className="item-value">{item.count} sessions</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trafic */}
        {activeTab === 'traffic' && (
          <div className="tab-panel">
            <div className="panel-section full-width">
              <h3>🔗 Sources de trafic (Referrers)</h3>
              <div className="simple-list">
                {data.traffic.referrers.map((item, index) => (
                  <div key={index} className="list-item">
                    <span className="item-rank">{index + 1}</span>
                    <span className="item-label">{formatReferrer(item.referrer)}</span>
                    <span className="item-value">{item.count} sessions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contenu */}
        {activeTab === 'content' && (
          <div className="tab-panel">
            <div className="panel-grid">
              <div className="panel-section">
                <h3>📄 Pages les plus visitées</h3>
                <div className="simple-list">
                  {data.content.topPages.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.page}</span>
                      <span className="item-value">{item.views} vues</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-section">
                <h3>⏱️ Temps moyen par page</h3>
                <div className="simple-list">
                  {data.content.avgTimePerPage.map((item, index) => (
                    <div key={index} className="list-item">
                      <span className="item-rank">{index + 1}</span>
                      <span className="item-label">{item.page}</span>
                      <span className="item-value">{formatTime(item.avgTime)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sessions récentes */}
      <div className="recent-sessions">
        <h3>🔍 Sessions récentes</h3>
        <div className="sessions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Localisation</th>
                <th>Appareil</th>
                <th>Navigateur</th>
                <th>Source</th>
                <th>Pages</th>
                <th>Temps</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSessions.map((session, index) => (
                <tr key={index}>
                  <td>{new Date(session.startedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                  <td>
                    {session.city && session.country 
                      ? `${session.city}, ${session.country}`
                      : session.country || 'Inconnu'}
                  </td>
                  <td>{session.device || 'desktop'}</td>
                  <td>{session.browser || 'Inconnu'}</td>
                  <td className="referrer-cell">{formatReferrer(session.referrer || '(direct)')}</td>
                  <td>{session.pageViews}</td>
                  <td>{formatTime(session.timeSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalyticsWidget;

