import { useState, useEffect, useRef } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  staleWhileRevalidate?: boolean; // Afficher cache pendant revalidation
  key?: string; // Clé personnalisée pour le cache
}

/**
 * Hook pour mettre en cache les données API avec localStorage
 * @param fetcher Fonction qui retourne une Promise avec les données
 * @param deps Dépendances pour recharger les données
 * @param options Options de cache
 */
export function useApiCache<T>(
  fetcher: () => Promise<T>,
  deps: any[] = [],
  options: CacheOptions = {}
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes par défaut
    staleWhileRevalidate = true,
    key
  } = options;

  // Générer une clé unique basée sur la fonction et les deps
  const cacheKey = key || `api_cache_${fetcher.toString().slice(0, 50)}_${JSON.stringify(deps)}`;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = async (useCache: boolean = true) => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // Vérifier le cache si demandé
      if (useCache) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            const age = Date.now() - cachedData.timestamp;

            if (age < ttl) {
              // Cache valide
              setData(cachedData.data);
              setLoading(false);
              setError(null);

              // Revalidation en arrière-plan si staleWhileRevalidate
              if (staleWhileRevalidate && age > ttl * 0.5) {
                // Cache à moitié expiré, revalider en arrière-plan
                fetcher()
                  .then(newData => {
                    if (!abortControllerRef.current?.signal.aborted) {
                      setData(newData);
                      localStorage.setItem(cacheKey, JSON.stringify({
                        data: newData,
                        timestamp: Date.now()
                      }));
                    }
                  })
                  .catch(() => {
                    // Erreur silencieuse en revalidation
                  });
              }
              return;
            }
          } catch (e) {
            // Cache corrompu, continuer avec fetch
            localStorage.removeItem(cacheKey);
          }
        }
      }

      // Pas de cache valide, faire la requête
      setLoading(true);
      const result = await fetcher();

      if (!abortControllerRef.current?.signal.aborted) {
        setData(result);
        setError(null);
        // Sauvegarder dans le cache
        localStorage.setItem(cacheKey, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        const error = err instanceof Error ? err : new Error('Erreur inconnue');
        setError(error);
        setData(null);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    loadData(false); // Forcer le rechargement sans cache
  };

  useEffect(() => {
    loadData(true);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, deps);

  return { data, loading, error, refetch };
}

/**
 * Fonction utilitaire pour invalider un cache spécifique
 */
export function invalidateCache(key: string) {
  localStorage.removeItem(key);
}

/**
 * Fonction utilitaire pour nettoyer tous les caches expirés
 */
export function cleanExpiredCaches() {
  const now = Date.now();
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('api_cache_')) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const cachedData = JSON.parse(cached);
          // Supprimer les caches de plus de 24h
          if (now - cachedData.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // Cache corrompu, supprimer
        localStorage.removeItem(key);
      }
    }
  });
}

// Nettoyer les caches expirés au chargement
if (typeof window !== 'undefined') {
  cleanExpiredCaches();
}

