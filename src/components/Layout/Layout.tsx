import { ReactNode, useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import NewsletterPopup from '../NewsletterPopup';
import CookieBanner from '../CookieBanner';
import Chatbot from '../Chatbot';
import ScrollToTop from '../ScrollToTop';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Composant Layout - Structure principale de page
 * Utilise les modules Navbar et Footer réutilisables
 */
const Layout = ({ children }: LayoutProps) => {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà inscrit ou a fermé le popup
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    const hasDismissed = localStorage.getItem('newsletter_dismissed');
    const dismissTime = localStorage.getItem('newsletter_dismiss_time');

    // Ne pas afficher si déjà inscrit
    if (hasSubscribed) {
      return;
    }

    // Ne pas afficher si fermé récemment (dans les dernières 24h)
    if (hasDismissed && dismissTime) {
      const timeDiff = Date.now() - parseInt(dismissTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        return;
      }
    }

    let cumulatedTime = 0; // Temps cumulé total
    let scrollStartTime: number | null = null;
    let scrollTimer: NodeJS.Timeout | null = null;
    let scrollEndTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Démarrer le chrono si pas déjà démarré
      if (scrollStartTime === null) {
        scrollStartTime = Date.now();
      }

      // Annuler le timeout d'arrêt précédent
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer);
      }

      // Démarrer l'interval de mise à jour si pas déjà fait
      if (!scrollTimer) {
        scrollTimer = setInterval(() => {
          if (scrollStartTime !== null) {
            const currentSession = (Date.now() - scrollStartTime) / 1000;
            const totalTime = cumulatedTime + currentSession;

            // Afficher le popup après 30 secondes cumulées
            if (totalTime >= 30) {
              setShowNewsletterPopup(true);
              if (scrollTimer) clearInterval(scrollTimer);
              window.removeEventListener('scroll', handleScroll);
            }
          }
        }, 1000);
      }

      // Programmer l'arrêt du scroll après 500ms d'inactivité
      scrollEndTimer = setTimeout(() => {
        if (scrollStartTime !== null) {
          const sessionTime = (Date.now() - scrollStartTime) / 1000;
          cumulatedTime += sessionTime;
          scrollStartTime = null;
        }
        if (scrollTimer) {
          clearInterval(scrollTimer);
          scrollTimer = null;
        }
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearInterval(scrollTimer);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
    };
  }, []);

  const handleClosePopup = () => {
    setShowNewsletterPopup(false);
    // Enregistrer que l'utilisateur a fermé le popup
    localStorage.setItem('newsletter_dismissed', 'true');
    localStorage.setItem('newsletter_dismiss_time', Date.now().toString());
  };

  return (
    <div className="app">
      <Navbar />
      <main>{children}</main>
      <Footer />
      {showNewsletterPopup && <NewsletterPopup onClose={handleClosePopup} />}
      <CookieBanner />
      <Chatbot />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
