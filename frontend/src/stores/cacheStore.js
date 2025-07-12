import { create } from "zustand";

// Cache configuration with TTL (time-to-live) in milliseconds
const CACHE_CONFIG = {
  athletes: { ttl: 5 * 60 * 1000 }, // 5 minutes
  measurables: { ttl: 10 * 60 * 1000 }, // 10 minutes
  trainingPeriods: { ttl: 5 * 60 * 1000 }, // 5 minutes
  programs: { ttl: 2 * 60 * 1000 }, // 2 minutes
  programDetails: { ttl: 1 * 60 * 1000 }, // 1 minute
  programAssignments: { ttl: 1 * 60 * 1000 }, // 1 minute
};

const useCacheStore = create((set, get) => ({
  // Cache storage
  cache: new Map(),

  // Cache timestamps
  timestamps: new Map(),

  // Get cached data if valid
  getCachedData: (key) => {
    const { cache, timestamps } = get();
    const timestamp = timestamps.get(key);
    const config = CACHE_CONFIG[key];

    if (!timestamp || !config) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - timestamp > config.ttl;

    if (isExpired) {
      // Remove expired cache
      cache.delete(key);
      timestamps.delete(key);
      return null;
    }

    return cache.get(key);
  },

  // Set cached data with timestamp
  setCachedData: (key, data) => {
    const { cache, timestamps } = get();
    cache.set(key, data);
    timestamps.set(key, Date.now());
  },

  // Check if cache is valid
  isCacheValid: (key) => {
    return get().getCachedData(key) !== null;
  },

  // Invalidate specific cache
  invalidateCache: (key) => {
    const { cache, timestamps } = get();
    cache.delete(key);
    timestamps.delete(key);
  },

  // Invalidate multiple caches
  invalidateMultiple: (keys) => {
    keys.forEach((key) => get().invalidateCache(key));
  },

  // Clear all cache
  clearAllCache: () => {
    const { cache, timestamps } = get();
    cache.clear();
    timestamps.clear();
  },

  // Get cache statistics
  getCacheStats: () => {
    const { cache, timestamps } = get();
    const stats = {};

    for (const [key, timestamp] of timestamps.entries()) {
      const config = CACHE_CONFIG[key];
      const now = Date.now();
      const age = now - timestamp;
      const isExpired = age > config.ttl;

      stats[key] = {
        hasData: cache.has(key),
        age: age,
        ttl: config.ttl,
        isExpired: isExpired,
        remainingTime: Math.max(0, config.ttl - age),
      };
    }

    return stats;
  },

  // Prefetch data (useful for background updates)
  prefetchData: async (key, fetchFunction) => {
    try {
      const data = await fetchFunction();
      get().setCachedData(key, data);
      return data;
    } catch (error) {
      console.error(`Failed to prefetch ${key}:`, error);
      throw error;
    }
  },
}));

export default useCacheStore;
