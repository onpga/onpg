import './Skeleton.css';

/**
 * Composant Skeleton pour les articles
 * Affiche des blocs gris qui ressemblent à la structure d'un article
 */
const SkeletonArticle = () => {
  return (
    <div className="skeleton-article">
      <div className="skeleton-article-image skeleton" />
      <div className="skeleton-article-content">
        <div className="skeleton-article-category skeleton" />
        <div className="skeleton-article-title skeleton" />
        <div className="skeleton-article-title-short skeleton" />
        <div className="skeleton-article-excerpt skeleton" />
        <div className="skeleton-article-excerpt skeleton" />
        <div className="skeleton-article-excerpt-short skeleton" />
        <div className="skeleton-article-meta">
          <div className="skeleton-article-meta-item skeleton" />
          <div className="skeleton-article-meta-item skeleton" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonArticle;













