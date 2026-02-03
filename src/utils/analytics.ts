// Google Analytics 4 - Utilitaires de tracking

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialiser Google Analytics (appelé dans index.html)
export const initGA = (measurementId: string) => {
  if (typeof window !== 'undefined' && measurementId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  }
};

// Tracking des pages
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  }
};

// Tracking des événements de conversion
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Événements spécifiques
export const trackDevisSubmit = (pole?: string) => {
  trackEvent('submit_quote_form', {
    event_category: 'conversion',
    event_label: pole,
    value: 1,
  });
};

export const trackContactSubmit = () => {
  trackEvent('submit_contact_form', {
    event_category: 'conversion',
    value: 1,
  });
};

export const trackSimulationComplete = (kitName?: string) => {
  trackEvent('simulation_completed', {
    event_category: 'engagement',
    event_label: kitName,
  });
};

export const trackApplicationSubmit = (jobTitle?: string) => {
  trackEvent('submit_application', {
    event_category: 'conversion',
    event_label: jobTitle,
  });
};

export const trackButtonClick = (buttonName: string) => {
  trackEvent('button_click', {
    event_category: 'engagement',
    event_label: buttonName,
  });
};

export const trackPhoneClick = () => {
  trackEvent('phone_click', {
    event_category: 'engagement',
  });
};

export const trackEmailClick = () => {
  trackEvent('email_click', {
    event_category: 'engagement',
  });
};

export const trackSocialShare = (platform: string, content: string) => {
  trackEvent('social_share', {
    event_category: 'engagement',
    platform,
    content_title: content,
  });
};

export const trackDownload = (fileName: string) => {
  trackEvent('file_download', {
    event_category: 'engagement',
    file_name: fileName,
  });
};

