import { useState, useEffect, useCallback } from 'react';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [visible, setVisible]     = useState(false);
  const [progress, setProgress]   = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setVisible(scrollY > 320);
    setProgress(docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  /* SVG ring : r=18 ⟹ circonférence = 2π×18 ≈ 113.1 */
  const CIRC      = 113.1;
  const dashOffset = CIRC * (1 - progress);

  return (
    <button
      className={`stt-btn${visible ? ' stt-btn--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      title="Retour en haut"
    >
      {/* Anneau de progression */}
      <svg className="stt-ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="stt-ring__bg"  cx="22" cy="22" r="18" />
        <circle
          className="stt-ring__fill"
          cx="22" cy="22" r="18"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Flèche */}
      <svg className="stt-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 19V5M5 12L12 5L19 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
