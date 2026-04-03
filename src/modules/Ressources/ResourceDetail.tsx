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
      const description =
        resource.excerpt ||
        resource.summary ||
        resource.abstract ||
        resource.content?.substring(0, 200) ||
        `Découvrez ${resource.title} sur le site de l'ONPG`;

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

  const isThesis = collection === 'theses';

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

          {!isThesis && resource.category && (
            <div className="article-category-badge">{resource.category}</div>
          )}

          <h1 className="article-title">{resource.title}</h1>

          {isThesis ? (
            <div className="article-meta thesis-public-inline-meta">
              {resource.author && (
                <span className="meta-item">👤 {resource.author}</span>
              )}
              {resource.year != null && String(resource.year).trim() !== '' && (
                <span className="meta-item">📅 {resource.year}</span>
              )}
              {resource.university && (
                <span className="meta-item">🏛️ {resource.university}</span>
              )}
              {resource.director && (
                <span className="meta-item">📚 Directeur de thèse : {resource.director}</span>
              )}
            </div>
          ) : (
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
          )}

          {!isThesis && (
            <div className="article-hero-image">
              <img src={getImageWithFallback(resource.image, 'article')} alt={resource.title} />
            </div>
          )}
        </div>
      </header>

      <div className="article-content-wrapper">
        <div className="article-content-container">
          <main className="article-main">
            {isThesis ? (
              <>
                {resource.abstract && (
                  <div className="thesis-public-block">
                    <h2 className="thesis-public-heading">Résumé</h2>
                    <p className="article-lead thesis-public-abstract">{resource.abstract}</p>
                  </div>
                )}
                {Array.isArray(resource.keywords) && resource.keywords.length > 0 && (
                  <div className="article-tags thesis-public-keywords-block">
                    <h3 className="thesis-public-heading">Mots-clés</h3>
                    <div className="tags-list">
                      {resource.keywords.map((tag: string, idx: number) => (
                        <span key={`${tag}-${idx}`} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {resource?._id && (
                  <div className="thesis-public-pdf-card">
                    <h3 className="thesis-public-heading">Document PDF</h3>
                    <p className="thesis-public-pdf-lead">
                      Consultez le document dans le navigateur ou enregistrez une copie sur votre appareil.
                    </p>
                    <div className="thesis-pdf-actions">
                      <Link
                        to={`/ressources/theses/${resource._id}/pdf`}
                        state={{
                          pdfUrl: `${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://backendonpg-production.up.railway.app/api' : 'http://localhost:3001/api')}/public/theses/${resource._id}/pdf`,
                          title: resource.title,
                          author: resource.author,
                          year: resource.year,
                          university: resource.university,
                          director: resource.director,
                          abstract: resource.abstract,
                          keywords: resource.keywords
                        }}
                        className="thesis-pdf-btn thesis-pdf-btn--primary"
                      >
                        <span className="thesis-pdf-btn-ico" aria-hidden>▶</span>
                        Ouvrir le PDF
                      </Link>
                      <a
                        href={`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://backendonpg-production.up.railway.app/api' : 'http://localhost:3001/api')}/public/theses/${resource._id}/pdf?download=1`}
                        className="thesis-pdf-btn thesis-pdf-btn--secondary"
                      >
                        <span className="thesis-pdf-btn-ico" aria-hidden>⬇</span>
                        Télécharger le PDF
                      </a>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
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
                        <span key={tag} className="tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <ShareButtons
              title={resource.title}
              description={
                resource.excerpt ||
                resource.summary ||
                resource.abstract ||
                ''
              }
              tags={
                Array.isArray(resource.tags)
                  ? resource.tags
                  : Array.isArray(resource.keywords)
                    ? resource.keywords
                    : []
              }
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;

