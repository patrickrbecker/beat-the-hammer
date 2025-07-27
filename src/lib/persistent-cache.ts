import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'tweets-cache.json');

interface CacheData {
  tweets: unknown[];
  timestamp: number;
  lastSuccessfulFetch: number;
}

export function getLastSuccessfulTweets(): unknown[] | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null;
    }
    
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    const cache: CacheData = JSON.parse(data);
    
    return cache.tweets || null;
  } catch (readError) {
    console.error('Error reading cached tweets:', readError);
    return null;
  }
}

export function saveSuccessfulTweets(tweets: unknown[]): void {
  try {
    const cacheData: CacheData = {
      tweets,
      timestamp: Date.now(),
      lastSuccessfulFetch: Date.now()
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (saveError) {
    console.error('Error saving tweets to cache:', saveError);
  }
}

export function getCacheAge(): number {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return Infinity;
    }
    
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    const cache: CacheData = JSON.parse(data);
    
    return Date.now() - cache.timestamp;
  } catch {
    return Infinity;
  }
}