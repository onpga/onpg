import './Skeleton.css';

/**
 * Composant Skeleton pour les offres d'emploi
 * Affiche des blocs gris qui ressemblent à la structure d'une offre
 */
const SkeletonJob = () => {
  return (
    <div className="skeleton-job">
      <div className="skeleton-job-header">
        <div className="skeleton-job-title skeleton" />
        <div className="skeleton-job-badge skeleton" />
      </div>
      <div className="skeleton-job-meta">
        <div className="skeleton-job-meta-item skeleton" />
        <div className="skeleton-job-meta-item skeleton" />
        <div className="skeleton-job-meta-item skeleton" />
      </div>
      <div className="skeleton-job-description skeleton" />
      <div className="skeleton-job-description skeleton" />
      <div className="skeleton-job-description-short skeleton" />
      <div className="skeleton-job-competences">
        <div className="skeleton-job-competences-label skeleton" />
        <div className="skeleton-job-competences-list">
          <div className="skeleton-job-competence-tag skeleton" />
          <div className="skeleton-job-competence-tag skeleton" />
          <div className="skeleton-job-competence-tag skeleton" />
          <div className="skeleton-job-competence-tag skeleton" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonJob;













