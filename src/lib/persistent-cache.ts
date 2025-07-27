import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'tweets-cache.json');

interface CacheData {
  tweets: any[];
  timestamp: number;
  lastSuccessfulFetch: number;
}

export function getLastSuccessfulTweets(): any[] | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return null;
    }
    
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    const cache: CacheData = JSON.parse(data);
    
    return cache.tweets || null;
  } catch (error) {
    console.error('Error reading cached tweets:', error);
    return null;
  }
}

export function saveSuccessfulTweets(tweets: any[]): void {
  try {
    const cacheData: CacheData = {
      tweets,
      timestamp: Date.now(),
      lastSuccessfulFetch: Date.now()
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('Error saving tweets to cache:', error);
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
  } catch (error) {
    return Infinity;
  }
}