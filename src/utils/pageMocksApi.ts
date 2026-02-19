/**
 * Utilitaire pour récupérer les données des collections depuis l'API backend
 * Chaque page Resources a sa propre collection MongoDB (actualites, articles, videos, etc.)
 */

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://www.onpg.ga/api' : 'http://localhost:3001/api');

export interface ResourceData {
  _id?: string;
  title: string;
  content?: string;
  [key: string]: any;
}

/**
 * Récupère les données d'une collection
 * Pour videos: retourne un tableau
 * Pour les autres: retourne un objet unique ou null
 */
export async function fetchResourceData(collection: string): Promise<ResourceData | ResourceData[] | null> {
  try {
    const response = await fetch(`${API_URL}/public/${collection}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    return collection === 'videos' ? [] : null;
  } catch (error) {
    console.error(`Erreur chargement ${collection}:`, error);
    return collection === 'videos' ? [] : null;
  }
}

/**
 * Récupère une donnée spécifique d'une collection par son ID
 */
export async function fetchResourceById(collection: string, id: string): Promise<ResourceData | null> {
  try {
    const response = await fetch(`${API_URL}/public/${collection}/${id}`);
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error(`Erreur chargement ${collection}/${id}:`, error);
    return null;
  }
}
