// Service de logging des erreurs frontend
// Envoie les erreurs critiques au backend pour centralisation

interface ErrorMetadata {
  userAgent?: string;
  ip?: string;
  referrer?: string;
  userId?: string;
  sessionId?: string;
  browser?: string;
  os?: string;
  device?: string;
}

interface ErrorData {
  message: string;
  stack?: string;
  module?: string;
  url?: string;
  metadata?: ErrorMetadata;
  data?: any;
}

class ErrorLogger {
  private isInitialized = false;
  private errorQueue: ErrorData[] = [];
  private isSending = false;

  // Détecter le navigateur
  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  // Détecter l'OS
  private detectOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Détecter le type d'appareil
  private detectDevice(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  // Obtenir les métadonnées
  private getMetadata(): ErrorMetadata {
    return {
      userAgent: navigator.userAgent,
      referrer: document.referrer || window.location.href,
      browser: this.detectBrowser(),
      os: this.detectOS(),
      device: this.detectDevice(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };
  }

  // Obtenir l'ID de session
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('error_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('error_session_id', sessionId);
    }
    return sessionId;
  }

  // Obtenir l'ID utilisateur (si connecté)
  private getUserId(): string | undefined {
    try {
      const adminUser = localStorage.getItem('admin_user');
      if (adminUser) {
        const user = JSON.parse(adminUser);
        return user._id || user.id;
      }
    } catch (e) {
      // Ignorer
    }
    return undefined;
  }

  // Envoyer une erreur au backend
  private async sendError(errorData: ErrorData): Promise<void> {
    try {
      const response = await fetch('/api/errors/frontend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...errorData,
          level: 'error' // Seulement les erreurs critiques
        })
      });

      if (!response.ok) {
        console.error('[ErrorLogger] Erreur lors de l\'envoi de l\'erreur au backend');
      }
    } catch (error) {
      console.error('[ErrorLogger] Erreur de connexion au backend:', error);
      // Ajouter à la queue pour réessayer plus tard
      this.errorQueue.push(errorData);
    }
  }

  // Traiter la queue d'erreurs
  private async processQueue(): Promise<void> {
    if (this.isSending || this.errorQueue.length === 0) {
      return;
    }

    this.isSending = true;

    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift();
      if (error) {
        await this.sendError(error);
        // Attendre un peu entre chaque envoi
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.isSending = false;
  }

  // Logger une erreur critique
  public logError(error: Error | string, module?: string, data?: any): void {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const errorData: ErrorData = {
      message: errorMessage,
      stack: errorStack,
      module: module || 'Unknown',
      url: window.location.href,
      metadata: this.getMetadata(),
      data: data || {}
    };

    // Logger dans la console aussi
    console.error(`[ErrorLogger] ${errorMessage}`, {
      module,
      url: errorData.url,
      error
    });

    // Envoyer au backend
    this.sendError(errorData).catch(() => {
      // Si l'envoi échoue, ajouter à la queue
      this.errorQueue.push(errorData);
    });
  }

  // Initialiser le système de capture d'erreurs globales
  public init(): void {
    if (this.isInitialized) return;

    // Capturer les erreurs JavaScript non gérées
    window.addEventListener('error', (event) => {
      this.logError(
        event.error || event.message,
        'GlobalError',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      );
    });

    // Capturer les promesses rejetées non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'UnhandledPromiseRejection',
        {
          reason: event.reason
        }
      );
    });

    // Traiter la queue périodiquement
    setInterval(() => {
      this.processQueue();
    }, 30000); // Toutes les 30 secondes

    this.isInitialized = true;
  }
}

// Instance singleton
const errorLogger = new ErrorLogger();

export default errorLogger;











