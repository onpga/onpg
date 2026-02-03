import React, { useEffect, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  const duration = toast.duration || 4000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    // Animation de la jauge qui se vide
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [toast.id, duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`} role="alert" aria-live="polite">
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => onClose(toast.id)}
        aria-label="Fermer la notification"
      >
        ×
      </button>
      <div className="toast-progress-bar">
        <div 
          className="toast-progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ToastComponent;

