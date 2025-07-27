// Simple in-memory cache for tweets
interface CacheEntry {
  data: unknown;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedData(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

export function setCachedData(key: string, data: unknown, ttlMinutes: number = 5): void {
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + (ttlMinutes * 60 * 1000)
  };
  
  cache.set(key, entry);
}

export function clearCache(): void {
  cache.clear();
}