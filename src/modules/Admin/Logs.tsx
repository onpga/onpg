import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './Logs.css';

interface LogFile {
  name: string;
  size: number;
  created: string;
  modified: string;
}

interface CriticalError {
  _id: string;
  source: 'frontend' | 'backend';
  level: string;
  message: string;
  stack?: string;
  module?: string;
  url?: string;
  endpoint?: string;
  method?: string;
  status: 'new' | 'investigating' | 'resolved' | 'ignored';
  count: number;
  lastOccurredAt: string;
  createdAt: string;
  alertSent: boolean;
}

interface ErrorStats {
  bySource: Array<{ _id: string; count: number; uniqueErrors: number }>;
  byDay: Array<{ _id: string; count: number; uniqueErrors: number }>;
  byModule: Array<{ _id: string; count: number; uniqueErrors: number }>;
  unresolved: number;
  total: number;
}

const Logs = () => {
  const navigate = useNavigate();
  const [logLevel, setLogLevel] = useState('info');
  const [files, setFiles] = useState<LogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Erreurs critiques
  const [activeTab, setActiveTab] = useState<'logs' | 'errors'>('logs');
  const [criticalErrors, setCriticalErrors] = useState<CriticalError[]>([]);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [errorLoading, setErrorLoading] = useState(false);
  const [errorFilter, setErrorFilter] = useState<'all' | 'frontend' | 'backend'>('all');
  const [errorStatusFilter, setErrorStatusFilter] = useState<'all' | 'new' | 'investigating' | 'resolved' | 'ignored'>('all');

  const user = localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')!) : null;

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    } else {
      fetchLogLevel();
      fetchLogFiles();
      fetchCriticalErrors();
      fetchErrorStats();
    }
  }, []);

  useEffect(() => {
    if (autoRefresh && selectedFile) {
      const interval = setInterval(() => {
        fetchLogContent(selectedFile);
      }, 5000); // Rafraîchir toutes les 5 secondes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedFile]);

  const fetchLogLevel = async () => {
    try {
      const response = await fetch('/api/logs/level');
      const data = await response.json();
      if (data.success) {
        setLogLevel(data.level);
      }
    } catch (error) {
      console.error('Erreur chargement niveau log:', error);
    }
  };

  const fetchLogFiles = async () => {
    try {
      const response = await fetch('/api/logs/files');
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
        // Sélectionner automatiquement le fichier le plus récent
        if (data.files.length > 0 && !selectedFile) {
          setSelectedFile(data.files[0].name);
          fetchLogContent(data.files[0].name);
        }
      }
    } catch (error) {
      console.error('Erreur chargement fichiers logs:', error);
    }
  };

  const fetchLogContent = async (filename: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lines: '1000',
        ...(filterLevel !== 'all' && { level: filterLevel }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`/api/logs/files/${filename}?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Erreur chargement contenu log:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLogLevel = async (newLevel: string) => {
    try {
      const response = await fetch('/api/logs/level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: newLevel })
      });
      
      const data = await response.json();
      if (data.success) {
        setLogLevel(newLevel);
        alert(`✅ Niveau de log changé: ${newLevel.toUpperCase()}`);
      } else {
        alert('❌ Erreur lors du changement de niveau');
      }
    } catch (error) {
      console.error('Erreur changement niveau log:', error);
      alert('❌ Erreur serveur');
    }
  };

  const downloadLogFile = (filename: string) => {
    window.open(`/api/logs/files/${filename}/download`, '_blank');
  };

  const deleteLogFile = async (filename: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${filename} ?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/logs/files/${filename}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        alert('✅ Fichier supprimé');
        if (selectedFile === filename) {
          setSelectedFile(null);
          setLogs([]);
        }
        fetchLogFiles();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
      alert('❌ Erreur serveur');
    }
  };

  const clearAllLogs = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer TOUS les anciens fichiers de logs ?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/logs/clear', {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.deletedCount} fichier(s) supprimé(s)`);
        fetchLogFiles();
      } else {
        alert('❌ Erreur lors du nettoyage');
      }
    } catch (error) {
      console.error('Erreur nettoyage logs:', error);
      alert('❌ Erreur serveur');
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR');
  };

  const getLevelColor = (logLine: string) => {
    if (logLine.includes('[ERROR]')) return 'log-error';
    if (logLine.includes('[WARN]')) return 'log-warn';
    if (logLine.includes('[INFO]')) return 'log-info';
    if (logLine.includes('[DEBUG]')) return 'log-debug';
    return '';
  };

  // Fonctions pour les erreurs critiques
  const fetchCriticalErrors = async () => {
    setErrorLoading(true);
    try {
      const params = new URLSearchParams();
      if (errorFilter !== 'all') params.append('source', errorFilter);
      if (errorStatusFilter !== 'all') params.append('status', errorStatusFilter);
      params.append('limit', '50');
      
      const response = await fetch(`/api/errors/critical?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCriticalErrors(data.errors);
      }
    } catch (error) {
      console.error('Erreur chargement erreurs critiques:', error);
    } finally {
      setErrorLoading(false);
    }
  };

  const fetchErrorStats = async () => {
    try {
      const response = await fetch('/api/errors/stats?days=7');
      const data = await response.json();
      
      if (data.success) {
        setErrorStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement stats erreurs:', error);
    }
  };

  const updateErrorStatus = async (errorId: string, status: string) => {
    try {
      const response = await fetch(`/api/errors/${errorId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCriticalErrors();
        fetchErrorStats();
        alert(`✅ Statut mis à jour: ${status}`);
      } else {
        alert('❌ Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('❌ Erreur serveur');
    }
  };

  const deleteError = async (errorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette erreur ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/errors/${errorId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        fetchCriticalErrors();
        fetchErrorStats();
        alert('✅ Erreur supprimée');
      } else {
        alert('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur serveur');
    }
  };

  useEffect(() => {
    if (activeTab === 'errors') {
      fetchCriticalErrors();
      fetchErrorStats();
    }
  }, [activeTab, errorFilter, errorStatusFilter]);

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="logs" />

      <main className="dashboard-main">
        <header className="page-header">
          <div>
            <h1>📋 Logs système</h1>
            <p>Consultation et gestion des journaux d'activité et erreurs critiques</p>
          </div>
          <div className="user-info-compact">
            <span className="user-avatar-small">👤</span>
            <span className="user-name-small">{user?.username || 'Admin'}</span>
          </div>
        </header>

        {/* Onglets */}
        <div className="logs-tabs">
          <button
            className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📄 Fichiers de logs
          </button>
          <button
            className={`tab-btn ${activeTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveTab('errors')}
          >
            🚨 Erreurs critiques
            {errorStats && errorStats.unresolved > 0 && (
              <span className="error-badge">{errorStats.unresolved}</span>
            )}
          </button>
        </div>

        {/* Section Erreurs Critiques */}
        {activeTab === 'errors' && (
          <>
            {/* Statistiques */}
            {errorStats && (
              <section className="error-stats-section">
                <h3>📊 Statistiques (7 derniers jours)</h3>
                <div className="error-stats-grid">
                  <div className="stat-card error-stat">
                    <div className="stat-value">{errorStats.total}</div>
                    <div className="stat-label">Total erreurs</div>
                  </div>
                  <div className="stat-card error-stat critical">
                    <div className="stat-value">{errorStats.unresolved}</div>
                    <div className="stat-label">Non résolues</div>
                  </div>
                  <div className="stat-card error-stat">
                    <div className="stat-value">
                      {errorStats.bySource.find(s => s._id === 'frontend')?.count || 0}
                    </div>
                    <div className="stat-label">Frontend</div>
                  </div>
                  <div className="stat-card error-stat">
                    <div className="stat-value">
                      {errorStats.bySource.find(s => s._id === 'backend')?.count || 0}
                    </div>
                    <div className="stat-label">Backend</div>
                  </div>
                </div>
              </section>
            )}

            {/* Filtres */}
            <section className="error-filters-section">
              <div className="filter-group">
                <label>Source:</label>
                <select
                  value={errorFilter}
                  onChange={(e) => setErrorFilter(e.target.value as any)}
                >
                  <option value="all">Toutes</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Statut:</label>
                <select
                  value={errorStatusFilter}
                  onChange={(e) => setErrorStatusFilter(e.target.value as any)}
                >
                  <option value="all">Tous</option>
                  <option value="new">Nouveau</option>
                  <option value="investigating">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="ignored">Ignoré</option>
                </select>
              </div>
              <button onClick={fetchCriticalErrors} className="btn-refresh">
                🔄 Rafraîchir
              </button>
            </section>

            {/* Liste des erreurs */}
            <section className="critical-errors-section">
              <h3>🚨 Erreurs critiques ({criticalErrors.length})</h3>
              {errorLoading ? (
                <div className="loading-logs">Chargement...</div>
              ) : criticalErrors.length === 0 ? (
                <div className="no-logs">Aucune erreur critique</div>
              ) : (
                <div className="errors-list">
                  {criticalErrors.map(error => (
                    <div key={error._id} className={`error-card ${error.status}`}>
                      <div className="error-header">
                        <div className="error-source">
                          <span className={`source-badge ${error.source}`}>
                            {error.source === 'frontend' ? '🌐 Frontend' : '⚙️ Backend'}
                          </span>
                          <span className={`status-badge ${error.status}`}>
                            {error.status === 'new' && '🆕 Nouveau'}
                            {error.status === 'investigating' && '🔍 En cours'}
                            {error.status === 'resolved' && '✅ Résolu'}
                            {error.status === 'ignored' && '🚫 Ignoré'}
                          </span>
                          {error.alertSent && <span className="alert-badge">📧 Alerte envoyée</span>}
                        </div>
                        <div className="error-actions">
                          <select
                            value={error.status}
                            onChange={(e) => updateErrorStatus(error._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="new">Nouveau</option>
                            <option value="investigating">En cours</option>
                            <option value="resolved">Résolu</option>
                            <option value="ignored">Ignoré</option>
                          </select>
                          <button
                            onClick={() => deleteError(error._id)}
                            className="btn-icon btn-danger"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="error-content">
                        <div className="error-message">
                          <strong>{error.message}</strong>
                        </div>
                        <div className="error-details">
                          <div className="error-detail-item">
                            <span className="detail-label">Module:</span>
                            <span>{error.module || 'Unknown'}</span>
                          </div>
                          {error.url && (
                            <div className="error-detail-item">
                              <span className="detail-label">URL:</span>
                              <span>{error.url}</span>
                            </div>
                          )}
                          {error.endpoint && (
                            <div className="error-detail-item">
                              <span className="detail-label">Endpoint:</span>
                              <span>{error.method || ''} {error.endpoint}</span>
                            </div>
                          )}
                          <div className="error-detail-item">
                            <span className="detail-label">Occurrences:</span>
                            <span>{error.count}</span>
                          </div>
                          <div className="error-detail-item">
                            <span className="detail-label">Dernière occurrence:</span>
                            <span>{formatDate(error.lastOccurredAt)}</span>
                          </div>
                        </div>
                        {error.stack && (
                          <details className="error-stack">
                            <summary>Stack trace</summary>
                            <pre>{error.stack}</pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Configuration du niveau de log */}
        {activeTab === 'logs' && (
        <>
        <section className="log-config-section">
          <h3>⚙️ Configuration</h3>
          <div className="log-level-selector">
            <label>Niveau de log actuel :</label>
            <div className="level-buttons">
              {['error', 'warn', 'info', 'debug'].map(level => (
                <button
                  key={level}
                  className={`level-btn ${logLevel === level ? 'active' : ''}`}
                  onClick={() => changeLogLevel(level)}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="level-description">
              {logLevel === 'error' && '🔴 Erreurs critiques uniquement'}
              {logLevel === 'warn' && '⚠️ Avertissements + Erreurs'}
              {logLevel === 'info' && 'ℹ️ Informations + Warn + Erreurs (recommandé)'}
              {logLevel === 'debug' && '🔍 Tous les détails (mode debug complet)'}
            </p>
          </div>
        </section>

        {/* Liste des fichiers */}
        <section className="log-files-section">
          <div className="section-header-with-actions">
            <h3>📁 Fichiers de logs ({files.length})</h3>
            <div className="file-actions">
              <button onClick={fetchLogFiles} className="btn-refresh">
                🔄 Rafraîchir
              </button>
              <button onClick={clearAllLogs} className="btn-danger-small">
                🗑️ Nettoyer anciens logs
              </button>
            </div>
          </div>
          
          <div className="log-files-grid">
            {files.map(file => (
              <div
                key={file.name}
                className={`log-file-card ${selectedFile === file.name ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedFile(file.name);
                  fetchLogContent(file.name);
                }}
              >
                <div className="file-name">📄 {file.name}</div>
                <div className="file-info">
                  <span>📦 {formatFileSize(file.size)}</span>
                  <span>🕒 {formatDate(file.modified)}</span>
                </div>
                <div className="file-actions-inline">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadLogFile(file.name);
                    }}
                    className="btn-icon"
                    title="Télécharger"
                  >
                    📥
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLogFile(file.name);
                    }}
                    className="btn-icon btn-danger"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visualisation des logs */}
        {selectedFile && (
          <section className="log-viewer-section">
            <div className="section-header-with-actions">
              <h3>📖 Contenu : {selectedFile}</h3>
              <div className="viewer-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  🔄 Auto-refresh (5s)
                </label>
                
                <select
                  value={filterLevel}
                  onChange={(e) => {
                    setFilterLevel(e.target.value);
                    fetchLogContent(selectedFile);
                  }}
                >
                  <option value="all">Tous niveaux</option>
                  <option value="error">ERROR uniquement</option>
                  <option value="warn">WARN uniquement</option>
                  <option value="info">INFO uniquement</option>
                  <option value="debug">DEBUG uniquement</option>
                </select>

                <input
                  type="text"
                  placeholder="🔍 Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchLogContent(selectedFile);
                    }
                  }}
                />
                
                <button onClick={() => fetchLogContent(selectedFile)} className="btn-refresh-small">
                  🔄
                </button>
              </div>
            </div>

            <div className="log-viewer">
              {loading ? (
                <div className="loading-logs">Chargement...</div>
              ) : logs.length === 0 ? (
                <div className="no-logs">Aucun log à afficher</div>
              ) : (
                <div className="log-lines">
                  {logs.map((log, index) => (
                    <div key={index} className={`log-line ${getLevelColor(log)}`}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
        </>
        )}
      </main>
    </div>
  );
};

export default Logs;

