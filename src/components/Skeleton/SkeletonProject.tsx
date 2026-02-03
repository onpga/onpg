import './Skeleton.css';

/**
 * Composant Skeleton pour les projets
 * Affiche des blocs gris qui ressemblent à la structure d'un projet
 */
const SkeletonProject = () => {
  return (
    <div className="skeleton-project">
      <div className="skeleton-project-image skeleton" />
      <div className="skeleton-project-content">
        <div className="skeleton-project-badge skeleton" />
        <div className="skeleton-project-title skeleton" />
        <div className="skeleton-project-title-short skeleton" />
        <div className="skeleton-project-description skeleton" />
        <div className="skeleton-project-description skeleton" />
        <div className="skeleton-project-description-short skeleton" />
        <div className="skeleton-project-meta">
          <div className="skeleton-project-meta-item skeleton" />
          <div className="skeleton-project-meta-item skeleton" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProject;













