/**
 * Composant générique pour afficher le détail d'une ressource
 * Utilisé pour Articles, Communiqués, Décisions, Décrets, Lois, Commissions, Thèses
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchResourceData, fetchResourceById } from '../../utils/pageMocksApi';
import { getImageWithFallback } from '../../utils/imageFallback';
import ShareButtons from '../../components/ShareButtons/ShareButtons';
import '../../components/ShareButtons/ShareButtons.css';
import './Ressources.css';
import { updateMetaTag, updateOpenGraph, updateTwitterCard, updateCanonical } from '../../utils/seo';

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
        let data;
        
        // Essayer d'abord avec fetchResourceById si on a un id
        if (id) {
          data = await fetchResourceById(collection, id);
        } else {
          // Sinon utiliser fetchResourceData
          data = await fetchResourceData(collection);
          if (Array.isArray(data) && data.length > 0) {
            data = data[0];
          }
        }
        
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
  }, [id, collection, backPath, navigate]);

  // Mettre à jour les meta tags pour le partage social (méthode CSIP)
  useEffect(() => {
    if (resource) {
      // Utiliser l'URL absolue avec le domaine
      const currentUrl = window.location.href.split('?')[0]; // Enlever les paramètres pour l'URL canonique
      // S'assurer que l'image est une URL absolue
      let imageUrl = resource.image || resource.featuredImage || 'https://res.cloudinary.com/dduvinjnu/image/upload/LOGO_ONPG_gvlag2.png';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://res.cloudinary.com/dduvinjnu/image/upload/${imageUrl}`;
      }
      const description = resource.excerpt || resource.summary || resource.content?.substring(0, 200) || `Découvrez ${resource.title} sur le site de l'ONPG`;

      // Title et description
      document.title = `${resource.title} | ONPG - ${title}`;
      
      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      // Open Graph pour Facebook (méthode CSIP - création directe)
      const ogTags = [
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: resource.title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:url', content: currentUrl },
        { property: 'og:site_name', content: 'ONPG - Ordre National de Pharmacie du Gabon' }
      ];

      if (resource.date) {
        ogTags.push({ property: 'article:published_time', content: new Date(resource.date).toISOString() });
      }
      if (resource.author?.name) {
        ogTags.push({ property: 'article:author', content: resource.author.name });
      }
      if (resource.category) {
        ogTags.push({ property: 'article:section', content: resource.category });
      }

      ogTags.forEach(tag => {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', tag.property);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });

      // Twitter Card (méthode CSIP - création directe)
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: resource.title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: imageUrl }
      ];

      twitterTags.forEach(tag => {
        let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', tag.name);
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', tag.content);
      });

      // Canonical
      updateCanonical(currentUrl);
    }
  }, [resource, title]);

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

          <div className="article-hero-image">
            <img src={getImageWithFallback(resource.image, 'article')} alt={resource.title} />
          </div>
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

            {collection === 'theses' && resource?._id && (
              <div className="article-tags" style={{ marginTop: '1.5rem' }}>
                <h3>Document PDF :</h3>
                <div className="tags-list" style={{ gap: '0.75rem' }}>
                  <Link to={`/ressources/theses/${resource._id}/pdf`} className="back-link">
                    Ouvrir le PDF
                  </Link>
                  <a
                    href={`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://backendonpg-production.up.railway.app/api' : 'http://localhost:3001/api')}/public/theses/${resource._id}/pdf?download=1`}
                    className="back-link"
                  >
                    Télécharger le PDF
                  </a>
                </div>
              </div>
            )}

            {/* Boutons de partage */}
            <ShareButtons
              title={resource.title}
              description={resource.excerpt || resource.summary || ''}
              tags={Array.isArray(resource.tags) ? resource.tags : []}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;

