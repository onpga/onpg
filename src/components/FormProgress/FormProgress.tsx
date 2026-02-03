import './FormProgress.css';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

/**
 * Composant FormProgress - Indicateur de progression pour formulaires longs
 * @param currentStep - Étape actuelle (commence à 1)
 * @param totalSteps - Nombre total d'étapes
 * @param stepLabels - Labels optionnels pour chaque étape
 */
const FormProgress = ({ currentStep, totalSteps, stepLabels }: FormProgressProps) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="form-progress-container">
      <div className="form-progress-header">
        <span className="form-progress-text">
          Étape {currentStep} sur {totalSteps}
        </span>
      </div>
      <div className="form-progress-bar">
        <div 
          className="form-progress-fill" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Étape ${currentStep} sur ${totalSteps}`}
        />
      </div>
      {stepLabels && stepLabels.length === totalSteps && (
        <div className="form-progress-steps">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={`form-progress-step ${index + 1 <= currentStep ? 'active' : ''} ${index + 1 === currentStep ? 'current' : ''}`}
            >
              <div className="form-progress-step-indicator">
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              <span className="form-progress-step-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormProgress;

