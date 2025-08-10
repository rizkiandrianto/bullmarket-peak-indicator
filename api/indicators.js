const { scrapeBullMarketIndicators } = require('../lib/scraper');
const { getCachedData, setCachedData, getCacheStats, CACHE_KEYS } = require('../lib/cache');
const { createErrorResponse } = require('../lib/error-handler');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    // Check cache first
    const cachedData = getCachedData(CACHE_KEYS.INDICATORS);
    const cacheStats = getCacheStats(CACHE_KEYS.INDICATORS);
    
    if (cachedData && !req.query.refresh) {
      return res.status(200).json({
        success: true,
        data: cachedData,
        meta: {
          cached: true,
          cacheAge: cacheStats.age,
          nextUpdate: new Date(Date.now() + cacheStats.remainingTtl * 1000).toISOString()
        }
      });
    }

    // Scrape fresh data
    const freshData = await scrapeBullMarketIndicators();
    
    // Cache the fresh data
    setCachedData(CACHE_KEYS.INDICATORS, freshData);
    
    // Also cache as fallback data
    setCachedData(CACHE_KEYS.LAST_ERROR, freshData, 86400); // 24 hours
    
    return res.status(200).json({
      success: true,
      data: freshData,
      meta: {
        cached: false,
        cacheAge: 0,
        nextUpdate: new Date(Date.now() + (parseInt(process.env.CACHE_DURATION || '10') * 60 * 1000)).toISOString()
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Try to return cached data as fallback
    const fallbackData = getCachedData(CACHE_KEYS.LAST_ERROR);
    const errorResponse = createErrorResponse(error, fallbackData);
    
    return res.status(error.statusCode || 500).json(errorResponse);
  }
}