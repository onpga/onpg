import { useEffect, useRef } from 'react';

/**
 * Hook pour auto-save des formulaires dans localStorage
 * @param formData - Les données du formulaire à sauvegarder
 * @param formKey - Clé unique pour identifier le formulaire (ex: 'devis', 'contact')
 * @param debounceDelay - Délai en ms avant de sauvegarder (défaut: 1000ms)
 */
export const useAutoSave = <T extends Record<string, any>>(
  formData: T,
  formKey: string,
  debounceDelay: number = 1000
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Ne pas sauvegarder au premier rendu (initialisation)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Sauvegarder après le délai
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`form_draft_${formKey}`, JSON.stringify(formData));
      } catch (error) {
        console.warn(`[AutoSave] Erreur lors de la sauvegarde du formulaire ${formKey}:`, error);
      }
    }, debounceDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, formKey, debounceDelay]);

  // Fonction pour restaurer les données sauvegardées
  const restoreDraft = (): T | null => {
    try {
      const saved = localStorage.getItem(`form_draft_${formKey}`);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch (error) {
      console.warn(`[AutoSave] Erreur lors de la restauration du formulaire ${formKey}:`, error);
    }
    return null;
  };

  // Fonction pour effacer le brouillon
  const clearDraft = () => {
    try {
      localStorage.removeItem(`form_draft_${formKey}`);
    } catch (error) {
      console.warn(`[AutoSave] Erreur lors de la suppression du brouillon ${formKey}:`, error);
    }
  };

  return { restoreDraft, clearDraft };
};












