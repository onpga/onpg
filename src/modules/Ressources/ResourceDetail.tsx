/**
 * Composant générique pour afficher le détail d'une ressource
 * Utilisé pour Articles, Communiqués, Décisions, Décrets, Lois, Commissions, Thèses
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './Ressources.css';

interface ResourceDetailProps {
  collection: string;
  backPath: string;
  title: string;
}

const ResourceDetail = ({ collection, backPath, title }: ResourceDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResource = async () => {
      try {
        const data = await fetchResourceData(collection);
        if (data && !Array.isArray(data)) {
          setResource(data);
          setLoading(false);
        } else {
          navigate(backPath);
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
        navigate(backPath);
      }
    };
    loadResource();
  }, [collection, backPath, navigate]);

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content"></div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="article-detail-page">
        <div className="error-state">
          <h1>Ressource non trouvée</h1>
          <p>Cette ressource n'existe pas ou a été supprimée.</p>
          <Link to={backPath} className="back-link">← Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <header className="article-header">
        <div className="article-header-content">
          <nav className="article-breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="separator">›</span>
            <Link to="/ressources">Ressources</Link>
            <span className="separator">›</span>
            <Link to={backPath}>{title}</Link>
            <span className="separator">›</span>
            <span className="current">Détail</span>
          </nav>

          {resource.category && (
            <div className="article-category-badge">{resource.category}</div>
          )}

          <h1 className="article-title">{resource.title}</h1>

          <div className="article-meta">
            {resource.date && (
              <span className="meta-item">
                📅 {new Date(resource.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            {resource.readTime && (
              <span className="meta-item">⏱️ {resource.readTime} min de lecture</span>
            )}
          </div>

          {resource.image && (
            <div className="article-hero-image">
              <img src={resource.image} alt={resource.title} />
            </div>
          )}
        </div>
      </header>

      <div className="article-content-wrapper">
        <div className="article-content-container">
          <main className="article-main">
            {resource.excerpt && (
              <p className="article-lead">{resource.excerpt}</p>
            )}

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: resource.content || '' }}
            />

            {resource.tags && resource.tags.length > 0 && (
              <div className="article-tags">
                <h3>Tags associés :</h3>
                <div className="tags-list">
                  {resource.tags.map((tag: string) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;

