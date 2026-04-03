/**
 * Utilitaire pour récupérer les données des collections depuis l'API backend
 * Chaque page Resources a sa propre collection MongoDB (actualites, articles, videos, etc.)
 */

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

export interface ResourceData {
  _id?: string;
  title: string;
  content?: string;
  [key: string]: any;
}

function firstNonEmptyStr(...vals: unknown[]): string {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (s) return s;
  }
  return '';
}

/** Alignement des clés API / Mongo (FR) vers le format attendu par les pages publiques */
export function normalizePublicThesis(raw: Record<string, unknown> | null | undefined): ResourceData {
  if (!raw || typeof raw !== 'object') {
    return raw as ResourceData;
  }
  const university = firstNonEmptyStr(
    raw.university,
    raw.universite,
    (raw as { Universite?: unknown }).Universite
  );
  const director = firstNonEmptyStr(raw.director, raw.directeur);
  const abstract = firstNonEmptyStr(raw.abstract, raw.resume);
  let keywords: string[] = [];
  const kw =
    raw.keywords ??
    raw.motsCles ??
    (raw as { mots_cles?: unknown }).mots_cles ??
    (raw as { tags?: unknown }).tags;
  if (Array.isArray(kw)) {
    keywords = kw.map(String).map((k) => k.trim()).filter(Boolean);
  } else if (typeof kw === 'string' && kw.trim()) {
    keywords = kw.split(',').map((k) => k.trim()).filter(Boolean);
  }
  return {
    ...raw,
    title: firstNonEmptyStr(raw.title, raw.titre),
    university,
    director,
    abstract,
    keywords
  } as ResourceData;
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
      if (collection === 'theses' && Array.isArray(data.data)) {
        return data.data.map((item: Record<string, unknown>) => normalizePublicThesis(item));
      }
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
    if (!id || id.trim() === '') {
      console.error(`ID invalide pour ${collection}`);
      return null;
    }
    
    const response = await fetch(`${API_URL}/public/${collection}/${id}`);
    
    if (!response.ok) {
      console.error(`Erreur HTTP ${response.status} pour ${collection}/${id}`);
      return null;
    }
    
    const data = await response.json();
    if (data.success && data.data) {
      if (collection === 'theses') {
        return normalizePublicThesis(data.data as Record<string, unknown>);
      }
      return data.data;
    }
    
    console.warn(`Aucune donnée trouvée pour ${collection}/${id}`);
    return null;
  } catch (error) {
    console.error(`Erreur chargement ${collection}/${id}:`, error);
    return null;
  }
}
