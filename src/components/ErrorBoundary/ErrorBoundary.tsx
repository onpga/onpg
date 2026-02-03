import { Component, ErrorInfo, ReactNode } from 'react';
import errorLogger from '../../utils/errorLogger';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Logger l'erreur
    errorLogger.logError(error, 'ErrorBoundary', {
      componentStack: errorInfo.componentStack
    });

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Sinon, afficher le fallback par défaut
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h1>Une erreur s'est produite</h1>
            <p>
              Désolé, une erreur inattendue s'est produite. L'erreur a été enregistrée 
              et notre équipe technique en a été informée.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Détails de l'erreur (mode développement)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button onClick={this.handleReset} className="error-boundary-button">
                Réessayer
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="error-boundary-button secondary"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

