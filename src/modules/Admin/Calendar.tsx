import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// FullCalendar CSS - Les styles sont inclus automatiquement avec les plugins
import AdminSidebar from './components/AdminSidebar';
import './Calendar.css';
import './Dashboard.css';

// Configuration de la locale française
const frLocaleConfig = {
  code: 'fr',
  week: {
    dow: 1, // Lundi
    doy: 4
  },
  buttonText: {
    prev: '◀ Précédent',
    next: 'Suivant ▶',
    today: 'Aujourd\'hui',
    year: 'Année',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    list: 'Liste'
  },
  allDayText: 'Toute la journée',
  moreLinkText: 'de plus',
  noEventsText: 'Aucun événement',
  weekText: 'Sem.'
};

interface Article {
  _id: string;
  title: string;
  visibleFrom: string;
  visibleUntil?: string;
  status: string;
  category?: string;
  pole?: string;
  featured?: boolean;
  publishedAt?: string;
}

const Calendar = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]); // Tous les articles non filtrés
  const [loading, setLoading] = useState(true);
  const [publicationStats, setPublicationStats] = useState<{
    last30Days: number;
    last7Days: number;
    averagePerWeek: number;
    trend: 'up' | 'down' | 'stable';
  } | null>(null);
  
  // Filtres
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPole, setFilterPole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    checkAuth();
    fetchArticles();
    
    // Charger le CSS FullCalendar uniquement pour cette page
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.19/index.global.min.css';
    document.head.appendChild(link);
    
    // Nettoyer quand on quitte la page
    return () => {
      const existingLink = document.querySelector(`link[href="${link.href}"]`);
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch('/api/articles?all=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      const articlesData = data.data || [];
      setAllArticles(articlesData);
      setArticles(articlesData);
      
      // Calculer les statistiques de publication
      calculatePublicationStats(articlesData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques de rythme de publication
  const calculatePublicationStats = (articlesList: Article[]) => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Articles publiés dans les 30 derniers jours
    const publishedLast30 = articlesList.filter(article => {
      if (article.status !== 'published') return false;
      const pubDate = article.visibleFrom ? new Date(article.visibleFrom) : (article.publishedAt ? new Date(article.publishedAt) : null);
      return pubDate && pubDate >= last30Days && pubDate <= now;
    }).length;

    // Articles publiés dans les 7 derniers jours
    const publishedLast7 = articlesList.filter(article => {
      if (article.status !== 'published') return false;
      const pubDate = article.visibleFrom ? new Date(article.visibleFrom) : (article.publishedAt ? new Date(article.publishedAt) : null);
      return pubDate && pubDate >= last7Days && pubDate <= now;
    }).length;

    // Articles publiés la semaine précédente (7-14 jours)
    const publishedPrevious7 = articlesList.filter(article => {
      if (article.status !== 'published') return false;
      const pubDate = article.visibleFrom ? new Date(article.visibleFrom) : (article.publishedAt ? new Date(article.publishedAt) : null);
      return pubDate && pubDate >= previous7Days && pubDate < last7Days;
    }).length;

    // Moyenne par semaine sur 30 jours
    const averagePerWeek = publishedLast30 / 4.3; // ~4.3 semaines dans 30 jours

    // Tendance (comparaison avec la semaine précédente)
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (publishedLast7 > publishedPrevious7) trend = 'up';
    else if (publishedLast7 < publishedPrevious7) trend = 'down';

    setPublicationStats({
      last30Days: publishedLast30,
      last7Days: publishedLast7,
      averagePerWeek: Math.round(averagePerWeek * 10) / 10,
      trend
    });
  };

  // Filtrer les articles selon les critères
  useEffect(() => {
    let filtered = [...allArticles];

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(article => article.status === filterStatus);
    }

    // Filtre par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(article => article.category === filterCategory);
    }

    // Filtre par pôle
    if (filterPole !== 'all') {
      filtered = filtered.filter(article => article.pole === filterPole);
    }

    // Recherche par titre
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        (article.category && article.category.toLowerCase().includes(query))
      );
    }

    setArticles(filtered);
  }, [allArticles, filterStatus, filterCategory, filterPole, searchQuery]);

  // Convertir les articles en événements pour FullCalendar
  const getEvents = () => {
    return articles.map((article) => {
      const now = new Date();
      const visibleFrom = article.visibleFrom ? new Date(article.visibleFrom) : (article.publishedAt ? new Date(article.publishedAt) : now);
      const visibleUntil = article.visibleUntil ? new Date(article.visibleUntil) : null;
      
      let status = 'visible';
      // Couleurs par catégorie
      const categoryColors: {[key: string]: string} = {
        'pedagogique': '#4CAF50',    // Vert
        'actualites': '#2196F3',     // Bleu
        'comparatifs': '#FF9800',    // Orange
        'innovations': '#9C27B0',    // Violet
        'communiques': '#F44336',    // Rouge
        'partenariats': '#00BCD4'    // Cyan
      };

      let color = categoryColors[article.category || 'pedagogique'] || '#4CAF50';
      let textColor = '#fff';
      
      if (visibleFrom > now) {
        status = 'scheduled';
        // Assombrir la couleur pour les articles programmés
        color = categoryColors[article.category || 'pedagogique'] || '#FF9800';
      } else if (visibleUntil && visibleUntil < now) {
        status = 'expired';
        color = '#9E9E9E'; // Gris pour expiré
        textColor = '#fff';
      } else if (article.featured) {
        // Conserver la couleur de catégorie mais ajouter une bordure spéciale
        color = categoryColors[article.category || 'pedagogique'] || '#2196F3';
      }

      return {
        id: article._id,
        title: article.title,
        start: visibleFrom.toISOString().split('T')[0], // Juste la date pour le calendrier mensuel
        end: visibleUntil ? visibleUntil.toISOString().split('T')[0] : undefined,
        backgroundColor: color,
        borderColor: color,
        textColor: textColor,
        className: article.featured ? 'fc-event-featured' : '',
        extendedProps: {
          article: article,
          status: status,
          category: article.category,
          pole: article.pole
        }
      };
    });
  };

  // Formater le contenu de l'event avec checkbox et tooltip
  const getEventContent = (eventInfo: any) => {
    const status = eventInfo.event.extendedProps.status;
    const article = eventInfo.event.extendedProps.article;
    const articleStatus = article?.status || 'published';
    const isPublished = articleStatus === 'published';
    const category = article?.category || 'pedagogique';
    
    const statusLabels = {
      visible: '✅ Visible',
      scheduled: '⏰ Programmé',
      expired: '⏹️ Expiré'
    };

    const categoryLabels: {[key: string]: string} = {
      'pedagogique': 'Pédagogique',
      'actualites': 'Actualités',
      'comparatifs': 'Comparatifs',
      'innovations': 'Innovations',
      'communiques': 'Communiqués',
      'partenariats': 'Partenariats'
    };

    const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      
      const articleId = article?._id;
      if (!articleId) return;

      const newStatus = isPublished ? 'draft' : 'published';
      await toggleArticleStatus(articleId, articleStatus, newStatus);
    };

    return (
      <div 
        className="fc-event-content" 
        title={`${article?.title || ''}\n${categoryLabels[category] || category}\nStatut: ${articleStatus === 'published' ? 'Publié' : articleStatus === 'draft' ? 'Brouillon' : 'Archivé'}\n${article?.excerpt ? `\n${article.excerpt.substring(0, 100)}...` : ''}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={handleCheckboxChange}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: '14px',
              height: '14px',
              cursor: 'pointer',
              margin: 0,
              flexShrink: 0
            }}
            title={isPublished ? 'Désactiver (passer en brouillon)' : 'Activer (publier)'}
          />
          <div className="fc-event-title" style={{ fontWeight: 600, fontSize: '0.85em', flex: 1, cursor: 'pointer' }}>
            {eventInfo.event.title}
          </div>
        </div>
        <div className="fc-event-status" style={{ fontSize: '0.7em', marginTop: '2px', opacity: 0.9 }}>
          {statusLabels[status as keyof typeof statusLabels]} • {categoryLabels[category] || category}
        </div>
      </div>
    );
  };

  // Quand on clique sur un événement
  const handleEventClick = (clickInfo: any) => {
    // Si Ctrl/Cmd + clic, toggle le statut
    if (clickInfo.jsEvent.ctrlKey || clickInfo.jsEvent.metaKey) {
      const article = clickInfo.event.extendedProps.article;
      if (article && article._id) {
        toggleArticleStatus(article._id, article.status || 'draft');
        clickInfo.jsEvent.preventDefault();
        return;
      }
    }
    // Sinon, navigation normale vers l'édition
    const articleId = clickInfo.event.id;
    navigate(`/admin/articles/edit/${articleId}`);
  };

  // Toggle le statut d'un article (via checkbox ou Ctrl/Cmd + clic)
  const toggleArticleStatus = async (articleId: string, currentStatus: string, newStatus?: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('❌ Vous devez être connecté');
        navigate('/admin');
        return;
      }

      // Si newStatus n'est pas fourni, déterminer automatiquement (pour Ctrl/Cmd + clic)
      let finalStatus = newStatus;
      if (!finalStatus) {
        if (currentStatus === 'draft') {
          finalStatus = 'published';
        } else if (currentStatus === 'published') {
          finalStatus = 'archived';
        } else {
          finalStatus = 'published';
        }
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: finalStatus })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const statusLabels: {[key: string]: string} = {
          'draft': 'Brouillon',
          'published': 'Publié',
          'archived': 'Archivé'
        };
        
        // Message alert uniquement si changé via Ctrl/Cmd + clic (quand newStatus n'était pas fourni)
        if (!newStatus) {
          alert(`✅ Statut changé : ${statusLabels[finalStatus]}`);
        }
        
        // Recharger les articles pour mettre à jour le calendrier
        await fetchArticles();
      } else {
        alert('❌ Erreur : ' + (data.error || data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('❌ Erreur lors du changement de statut. Veuillez réessayer.');
    }
  };


  // Quand on clique sur une date vide
  const handleDateClick = (dateInfo: any) => {
    const dateStr = dateInfo.dateStr;
    navigate(`/admin/articles/new?date=${dateStr}`);
  };

  // Gérer le drag & drop (changer la date de publication)
  const handleEventDrop = async (dropInfo: any) => {
    const articleId = dropInfo.event.id;
    const newDate = dropInfo.event.start;
    
    if (!articleId || !newDate) {
      dropInfo.revert();
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        dropInfo.revert();
        return;
      }

      // Format de date pour visibleFrom (juste la date, sans heure)
      // Créer une date à minuit dans le fuseau horaire local
      const dateAtMidnight = new Date(newDate);
      dateAtMidnight.setHours(0, 0, 0, 0);
      const dateStr = dateAtMidnight.toISOString();

      // Mettre à jour la date visibleFrom
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          visibleFrom: dateStr
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Recharger les articles pour mettre à jour le calendrier
        await fetchArticles();
      } else {
        // Annuler le déplacement en cas d'erreur
        dropInfo.revert();
        console.error('Erreur lors du déplacement:', data);
        alert('❌ Erreur lors du déplacement : ' + (data.error || data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      dropInfo.revert();
      alert('❌ Erreur lors du déplacement de l\'article');
    }
  };

  // Gérer le redimensionnement (changer la date d'expiration)
  const handleEventResize = async (resizeInfo: any) => {
    const articleId = resizeInfo.event.id;
    const newEndDate = resizeInfo.event.end;
    
    if (!articleId || !newEndDate) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          visibleUntil: newEndDate.toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchArticles();
      } else {
        resizeInfo.revert();
        alert('❌ Erreur lors du redimensionnement : ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Erreur lors du redimensionnement:', error);
      resizeInfo.revert();
      alert('❌ Erreur lors du redimensionnement de l\'article');
    }
  };

  // Gérer le clic droit sur une date (créer un article brouillon)
  const handleContextMenu = async (dateInfo: any, event: MouseEvent) => {
    event.preventDefault();
    
    try {
      const dateStr = dateInfo.dateStr || dateInfo.date?.toISOString().split('T')[0];
      
      if (!dateStr) {
        console.error('Date non disponible');
        return;
      }

      const title = prompt('Entrez le titre de l\'article :');
      
      if (!title || title.trim() === '') {
        return;
      }

      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('❌ Vous devez être connecté pour créer un article');
        navigate('/admin');
        return;
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: '',
          content: '',
          category: 'pedagogique',
          pole: 'general',
          tags: '',
          status: 'draft', // Brouillon
          featured: false,
          author: {
            name: 'Équipe CIPS',
            role: 'Rédaction'
          },
          seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: ''
          },
          visibleFrom: `${dateStr}T00:00:00.000Z`, // Date sélectionnée
          visibleUntil: '',
          readTime: 5,
          priorite: 0
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        alert(`✅ Article brouillon "${title}" créé avec succès !`);
        // Recharger les articles
        await fetchArticles();
        // Naviguer vers l'édition de l'article
        if (data.data._id) {
          navigate(`/admin/articles/edit/${data.data._id}`);
        }
      } else {
        alert('❌ Erreur lors de la création : ' + (data.error || data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      alert('❌ Erreur lors de la création de l\'article. Veuillez réessayer.');
    }
  };

  return (
    <div className="dashboard-page">
      <AdminSidebar currentPage="calendar" />

      <main className="dashboard-main">
        <header className="page-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1>📅 Calendrier éditorial - Articles</h1>
            <p>
              Visualisez et planifiez vos publications d'articles • 
              <strong> Astuces :</strong> 
              ☑️ Cochez/décochez la checkbox = activer/désactiver (Publié ↔ Brouillon) • 
              🖱️ Clic droit sur une date = créer un brouillon • 
              📝 Clic sur un article = éditer
            </p>
          </div>
          <div className="calendar-header-buttons">
            <Link to="/admin/idea-blocks" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              💡 Blocs d'idées
            </Link>
            <Link to="/admin/articles/new" className="btn-primary">
              ➕ Nouvel article
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="loading">Chargement du calendrier...</div>
        ) : (
          <div className="calendar-wrapper">
            {/* Indicateur de rythme de publication */}
            {publicationStats && (
              <div className="publication-rhythm-indicator">
                <h3>📊 Rythme de publication</h3>
                <div className="rhythm-stats">
                  <div className="rhythm-stat-item">
                    <span className="rhythm-label">7 derniers jours</span>
                    <span className="rhythm-value">{publicationStats.last7Days} article{publicationStats.last7Days > 1 ? 's' : ''}</span>
                    <span className={`rhythm-trend ${publicationStats.trend}`}>
                      {publicationStats.trend === 'up' && '📈'}
                      {publicationStats.trend === 'down' && '📉'}
                      {publicationStats.trend === 'stable' && '➡️'}
                    </span>
                  </div>
                  <div className="rhythm-stat-item">
                    <span className="rhythm-label">30 derniers jours</span>
                    <span className="rhythm-value">{publicationStats.last30Days} article{publicationStats.last30Days > 1 ? 's' : ''}</span>
                  </div>
                  <div className="rhythm-stat-item">
                    <span className="rhythm-label">Moyenne/semaine</span>
                    <span className="rhythm-value">{publicationStats.averagePerWeek} article{publicationStats.averagePerWeek > 1 ? 's' : ''}</span>
                    {publicationStats.averagePerWeek >= 3 && <span className="rhythm-good">✅ Rythme régulier</span>}
                    {publicationStats.averagePerWeek < 2 && <span className="rhythm-warning">⚠️ Rythme faible</span>}
                    {publicationStats.averagePerWeek >= 2 && publicationStats.averagePerWeek < 3 && <span className="rhythm-ok">✓ Acceptable</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Filtres et recherche */}
            <div className="calendar-filters">
              <div className="filters-row">
                <div className="filter-group">
                  <label>Statut</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">Tous</option>
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Catégorie</label>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">Toutes</option>
                    <option value="pedagogique">Pédagogique</option>
                    <option value="actualites">Actualités</option>
                    <option value="comparatifs">Comparatifs</option>
                    <option value="innovations">Innovations</option>
                    <option value="communiques">Communiqués</option>
                    <option value="partenariats">Partenariats</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Pôle</label>
                  <select value={filterPole} onChange={(e) => setFilterPole(e.target.value)}>
                    <option value="all">Tous</option>
                    <option value="general">Général</option>
                    <option value="energie">Énergie</option>
                    <option value="geospatial">Géospatial</option>
                    <option value="drone">Drone</option>
                    <option value="sante">Santé</option>
                    <option value="securite">Sécurité</option>
                  </select>
                </div>

                <div className="filter-group search-group">
                  <label>Recherche</label>
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '250px' }}
                  />
                </div>

                <div className="filter-group view-toggle">
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                  >
                    📅 Calendrier
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  >
                    📋 Liste
                  </button>
                </div>
              </div>
            </div>

            {/* Légende */}
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
                <span>Pédagogique</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#2196F3' }}></span>
                <span>Actualités</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#FF9800' }}></span>
                <span>Comparatifs</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#9C27B0' }}></span>
                <span>Innovations</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#F44336' }}></span>
                <span>Communiqués</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#00BCD4' }}></span>
                <span>Partenariats</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#9E9E9E' }}></span>
                <span>Expiré</span>
              </div>
            </div>

            {/* Vue Liste */}
            {viewMode === 'list' && (
              <div className="articles-list-view">
                <h3>📋 Liste des articles ({articles.length})</h3>
                <div className="articles-list">
                  {articles.map((article) => {
                    const pubDate = article.visibleFrom ? new Date(article.visibleFrom) : (article.publishedAt ? new Date(article.publishedAt) : null);
                    const categoryColors: {[key: string]: string} = {
                      'pedagogique': '#4CAF50',
                      'actualites': '#2196F3',
                      'comparatifs': '#FF9800',
                      'innovations': '#9C27B0',
                      'communiques': '#F44336',
                      'partenariats': '#00BCD4'
                    };
                    
                    return (
                      <div 
                        key={article._id} 
                        className="article-list-item"
                        onClick={() => navigate(`/admin/articles/edit/${article._id}`)}
                      >
                        <div className="article-list-checkbox">
                          <input
                            type="checkbox"
                            checked={article.status === 'published'}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleArticleStatus(article._id, article.status || 'draft', article.status === 'published' ? 'draft' : 'published');
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="article-list-content">
                          <h4>{article.title}</h4>
                          <div className="article-list-meta">
                            <span className="category-badge" style={{ backgroundColor: categoryColors[article.category || 'pedagogique'] }}>
                              {article.category}
                            </span>
                            <span className={`status-badge ${article.status}`}>
                              {article.status === 'published' ? '✅ Publié' : article.status === 'draft' ? '📝 Brouillon' : '📦 Archivé'}
                            </span>
                            {pubDate && (
                              <span className="date-badge">
                                📅 {pubDate.toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calendrier FullCalendar */}
            {viewMode === 'calendar' && (
            <div className="fullcalendar-container">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={frLocaleConfig}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                events={getEvents()}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventContent={getEventContent}
                height="auto"
                eventDisplay="block"
                dayMaxEvents={3}
                moreLinkClick="popover"
                editable={true}
                selectable={false}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                weekends={true}
                firstDay={1} // Lundi
                dayCellDidMount={(arg) => {
                  // Ajouter le gestionnaire de clic droit
                  arg.el.addEventListener('contextmenu', (e) => {
                    handleContextMenu(arg, e);
                  });
                }}
              />
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Calendar;