const NodeCache = require('node-cache');

const CACHE_DURATION = parseInt(process.env.CACHE_DURATION || '10') * 60; // Convert to seconds
const cache = new NodeCache({ stdTTL: CACHE_DURATION });

const CACHE_KEYS = {
  INDICATORS: 'bull_market_indicators',
  LAST_ERROR: 'last_error_data'
};

function getCachedData(key) {
  return cache.get(key);
}

function setCachedData(key, data, ttl = CACHE_DURATION) {
  return cache.set(key, data, ttl);
}

function getCacheStats(key) {
  const ttl = cache.getTtl(key);
  const now = Date.now();
  
  return {
    exists: cache.has(key),
    age: ttl ? Math.floor((now - (ttl - CACHE_DURATION * 1000)) / 1000) : 0,
    remainingTtl: ttl ? Math.floor((ttl - now) / 1000) : 0
  };
}

function clearCache(key = null) {
  if (key) {
    return cache.del(key);
  }
  return cache.flushAll();
}

module.exports = {
  getCachedData,
  setCachedData,
  getCacheStats,
  clearCache,
  CACHE_KEYS,
  CACHE_DURATION
};