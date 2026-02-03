// Système de tracking détaillé automatique
// Capture : appareil, navigateur, pays, ville, pages visitées, temps passé, etc.

interface AnalyticsSession {
  sessionId: string;
  userId?: string;
  landingPage: string;
  referrer: string;
  utmParams: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    vendor?: string;
    model?: string;
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
  };
  location: {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    timezone?: string;
    language?: string;
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
}

class DetailedAnalytics {
  private sessionId: string;
  private userId?: string;
  private currentPage: string;
  private pageStartTime: number;
  private isInitialized: boolean = false;
  private trackingEnabled: boolean = true;
  private heartbeatInterval?: number;
  // Circuit breaker pour éviter de surcharger le serveur
  private consecutiveHeartbeatErrors: number = 0;
  private maxConsecutiveErrors: number = 3; // Arrêter après 3 erreurs consécutives
  private heartbeatRetryDelay: number = 5 * 60 * 1000; // Réessayer après 5 minutes
  private heartbeatRetryTimeout?: number;
  private isHeartbeatPaused: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.currentPage = window.location.pathname;
    this.pageStartTime = Date.now();
  }

  // Générer un ID de session unique
  private generateSessionId(): string {
    // Vérifier si une session existe déjà (dans les 30 dernières minutes)
    const existingSessionId = localStorage.getItem('analytics_session_id');
    const sessionTimestamp = localStorage.getItem('analytics_session_timestamp');
    
    if (existingSessionId && sessionTimestamp) {
      const timestamp = parseInt(sessionTimestamp);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;
      
      // Si la session a moins de 30 minutes, la réutiliser
      if (now - timestamp < thirtyMinutes) {
        localStorage.setItem('analytics_session_timestamp', now.toString());
        return existingSessionId;
      }
    }
    
    // Sinon, créer une nouvelle session
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_session_id', newSessionId);
    localStorage.setItem('analytics_session_timestamp', Date.now().toString());
    return newSessionId;
  }

  // Détecter le type d'appareil
  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const ua = navigator.userAgent;
    
    console.log('[Analytics] UserAgent:', ua);
    
    // Détecter les tablettes (mais PAS les smartphones Android)
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
      // Exception : si c'est un petit écran, c'est probablement un téléphone
      if (window.screen.width <= 768) {
        console.log('[Analytics] Device détecté: mobile (petit écran Android)');
        return 'mobile';
      }
      console.log('[Analytics] Device détecté: tablet');
      return 'tablet';
    }
    
    // Détecter les mobiles
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      console.log('[Analytics] Device détecté: mobile');
      return 'mobile';
    }
    
    console.log('[Analytics] Device détecté: desktop');
    return 'desktop';
  }

  // Détecter le navigateur
  private detectBrowser(): { browser: string; version: string } {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      browser = 'Chrome';
      version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browser = 'Safari';
      version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edg') > -1) {
      browser = 'Edge';
      version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
      browser = 'Internet Explorer';
      version = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || '';
    }

    return { browser, version };
  }

  // Détecter le système d'exploitation
  private detectOS(): { os: string; version: string } {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    let version = 'Unknown';

    if (ua.indexOf('Windows NT 10.0') > -1) { os = 'Windows'; version = '10'; }
    else if (ua.indexOf('Windows NT 6.3') > -1) { os = 'Windows'; version = '8.1'; }
    else if (ua.indexOf('Windows NT 6.2') > -1) { os = 'Windows'; version = '8'; }
    else if (ua.indexOf('Windows NT 6.1') > -1) { os = 'Windows'; version = '7'; }
    else if (ua.indexOf('Mac OS X') > -1) {
      os = 'macOS';
      version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1].replace('_', '.') || '';
    }
    else if (ua.indexOf('Android') > -1) {
      os = 'Android';
      version = ua.match(/Android (\d+\.\d+)/)?.[1] || '';
    }
    else if (ua.indexOf('Linux') > -1) { os = 'Linux'; }
    else if (/iPhone|iPad|iPod/.test(ua)) {
      os = 'iOS';
      version = ua.match(/OS (\d+_\d+)/)?.[1].replace('_', '.') || '';
    }

    return { os, version };
  }

  // Extraire les paramètres UTM de l'URL
  private extractUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined
    };
  }

  // Obtenir la localisation (approximative via timezone et langue)
  private getLocation() {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }

  // Obtenir les infos d'écran
  private getScreenInfo() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth
    };
  }

  // Initialiser la session
  async init() {
    if (this.isInitialized) return;
    
    // 🚫 Ne pas initialiser les analytics en développement local
    if (import.meta.env.DEV) {
      console.log('[Analytics] ⏭️ Analytics désactivé en développement local');
      return;
    }
    
    // 🚫 Ne pas initialiser les analytics sur les pages admin
    if (window.location.pathname.startsWith('/admin')) {
      console.log('[Analytics] ⏭️ Analytics désactivé pour les pages admin');
      return;
    }
    
    try {
      const browserInfo = this.detectBrowser();
      const osInfo = this.detectOS();
      const location = this.getLocation();

      const sessionData: AnalyticsSession = {
        sessionId: this.sessionId,
        userId: this.userId,
        landingPage: window.location.pathname,
        referrer: document.referrer || '(direct)',
        utmParams: this.extractUTMParams(),
        device: {
          type: this.detectDeviceType(),
          browser: browserInfo.browser,
          browserVersion: browserInfo.version,
          os: osInfo.os,
          osVersion: osInfo.version
        },
        location: {
          timezone: location.timezone,
          language: location.language
        },
        screen: this.getScreenInfo()
      };

      // Envoyer au backend
      await this.sendToBackend(sessionData);

      this.isInitialized = true;
      
      // Tracker le changement de page (pour les SPAs)
      this.setupPageViewTracking();
      
      // Tracker la fermeture de la page
      this.setupBeforeUnload();

      // 🔥 HEARTBEAT : Ping régulier pour maintenir la session active
      this.setupHeartbeat();

    } catch (error) {
      console.error('[Analytics] Erreur initialisation:', error);
    }
  }

  // 🔥 NOUVEAU : Système de ping (heartbeat) régulier avec circuit breaker
  private setupHeartbeat() {
    if (!this.trackingEnabled) return;

    // Ping toutes les 60 secondes pour maintenir la session active
    this.heartbeatInterval = window.setInterval(() => {
      if (!this.trackingEnabled || !this.isInitialized || this.isHeartbeatPaused) {
        return;
      }

      // Envoyer un ping silencieux au backend
      this.sendHeartbeat();
    }, 60000); // 60 secondes

    console.log('[Analytics] Heartbeat activé (ping toutes les 60 secondes)');
  }

  // Envoyer un heartbeat avec gestion des erreurs et circuit breaker
  private async sendHeartbeat() {
    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          heartbeat: true // Indique que c'est juste un ping, pas une vraie action
        })
      });

      if (response.ok) {
        // Réinitialiser le compteur d'erreurs si la requête réussit
        this.consecutiveHeartbeatErrors = 0;
        this.isHeartbeatPaused = false;
        
        // Annuler le timeout de retry si on avait planifié un réessai
        if (this.heartbeatRetryTimeout) {
          clearTimeout(this.heartbeatRetryTimeout);
          this.heartbeatRetryTimeout = undefined;
        }
      } else {
        // Erreur HTTP (502, 500, etc.)
        this.handleHeartbeatError();
      }
    } catch (error) {
      // Erreur réseau (timeout, connexion refusée, etc.)
      this.handleHeartbeatError();
    }
  }

  // Gérer les erreurs de heartbeat avec circuit breaker
  private handleHeartbeatError() {
    this.consecutiveHeartbeatErrors++;

    if (this.consecutiveHeartbeatErrors >= this.maxConsecutiveErrors) {
      // Arrêter le heartbeat après trop d'erreurs
      this.isHeartbeatPaused = true;
      console.warn(`[Analytics] ⚠️ Heartbeat temporairement désactivé après ${this.consecutiveHeartbeatErrors} erreurs consécutives. Réessai dans ${this.heartbeatRetryDelay / 1000} secondes.`);

      // Planifier un réessai après le délai
      this.heartbeatRetryTimeout = window.setTimeout(() => {
        console.log('[Analytics] 🔄 Réessai du heartbeat après pause...');
        this.consecutiveHeartbeatErrors = 0;
        this.isHeartbeatPaused = false;
        // Tester immédiatement si le serveur répond
        this.sendHeartbeat();
      }, this.heartbeatRetryDelay);
    } else {
      console.debug(`[Analytics] Heartbeat failed (${this.consecutiveHeartbeatErrors}/${this.maxConsecutiveErrors} erreurs)`);
    }
  }

  // Setup tracking automatique des changements de page
  private setupPageViewTracking() {
    // Pour les applications React Router
    let lastPath = window.location.pathname;
    
    const checkPageChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        console.log(`[Analytics] 🔄 Changement de page détecté: ${lastPath} → ${currentPath}`);
        this.trackPageView(lastPath, currentPath);
        lastPath = currentPath;
      }
    };

    // Vérifier toutes les 500ms
    setInterval(checkPageChange, 500);

    // Aussi écouter les événements de navigation
    window.addEventListener('popstate', checkPageChange);
    
    console.log('[Analytics] ✅ Tracking des pages activé (vérification toutes les 500ms)');
  }

  // Tracker une page vue
  private async trackPageView(oldPath: string, newPath: string) {
    // 🚫 Ne pas tracker les pages admin
    if (oldPath.startsWith('/admin')) {
      console.log(`[Analytics] ⏭️ Page admin ignorée: ${oldPath}`);
      this.currentPage = newPath;
      this.pageStartTime = Date.now();
      return;
    }

    const timeSpent = Math.round((Date.now() - this.pageStartTime) / 1000); // en secondes
    
    console.log(`[Analytics] 📄 Tracking page: ${oldPath} (temps: ${timeSpent}s)`);
    
    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pageView: {
            path: oldPath,
            title: document.title,
            timestamp: new Date(this.pageStartTime),
            timeSpent
          }
        })
      });

      if (response.ok) {
        console.log(`[Analytics] ✅ Page trackée: ${oldPath}`);
        // Si le serveur répond, réinitialiser le compteur d'erreurs du heartbeat
        this.consecutiveHeartbeatErrors = 0;
        this.isHeartbeatPaused = false;
      } else {
        console.error(`[Analytics] ❌ Erreur HTTP ${response.status} pour page: ${oldPath}`);
        // Ne pas bloquer l'utilisateur si le tracking échoue
      }

      // Réinitialiser pour la nouvelle page
      this.currentPage = newPath;
      this.pageStartTime = Date.now();

    } catch (error) {
      console.error('[Analytics] Erreur tracking page view:', error);
      // Ne pas bloquer l'utilisateur si le tracking échoue
    }
  }

  // Avant de quitter la page
  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      // Arrêter le heartbeat
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
      }
      // Nettoyer aussi le timeout de retry
      if (this.heartbeatRetryTimeout) {
        clearTimeout(this.heartbeatRetryTimeout);
      }

      // 🚫 Ne pas envoyer de données si on est sur une page admin
      if (this.currentPage.startsWith('/admin')) {
        console.log(`[Analytics] ⏭️ Page admin ignorée au unload: ${this.currentPage}`);
        return;
      }

      const timeSpent = Math.round((Date.now() - this.pageStartTime) / 1000);
      
      // Utiliser sendBeacon pour envoyer de manière fiable avant la fermeture
      const data = JSON.stringify({
        sessionId: this.sessionId,
        pageView: {
          path: this.currentPage,
          title: document.title,
          timestamp: new Date(this.pageStartTime),
          timeSpent
        },
        endSession: true // Marquer la session comme terminée
      });

      navigator.sendBeacon('/api/analytics/session', new Blob([data], { type: 'application/json' }));
    });
  }

  // Envoyer les données au backend
  private async sendToBackend(data: any) {
    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error('[Analytics] Erreur envoi:', response.statusText);
      }
    } catch (error) {
      // Erreur silencieuse pour ne pas affecter l'UX
      console.error('[Analytics] Erreur réseau:', error);
    }
  }

  // Tracker un événement personnalisé
  async trackEvent(name: string, category?: string, label?: string, value?: number) {
    if (!this.trackingEnabled || this.isHeartbeatPaused) return;

    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          event: {
            name,
            category,
            label,
            value,
            timestamp: new Date()
          }
        })
      });

      if (response.ok) {
        // Si le serveur répond, réinitialiser le compteur d'erreurs du heartbeat
        this.consecutiveHeartbeatErrors = 0;
        this.isHeartbeatPaused = false;
      }
    } catch (error) {
      console.error('[Analytics] Erreur tracking event:', error);
      // Ne pas bloquer l'utilisateur si le tracking échoue
    }
  }

  // Définir un user ID (pour tracking multi-sessions)
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Désactiver le tracking (si l'utilisateur refuse)
  disable() {
    this.trackingEnabled = false;
    
    // Arrêter le heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    // Nettoyer aussi le timeout de retry
    if (this.heartbeatRetryTimeout) {
      clearTimeout(this.heartbeatRetryTimeout);
    }
  }
}

// Instance globale
const detailedAnalytics = new DetailedAnalytics();

// Initialiser automatiquement
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    detailedAnalytics.init();
  });
}

export default detailedAnalytics;

