const { getCacheStats, CACHE_KEYS } = require('../lib/cache');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const cacheStats = getCacheStats(CACHE_KEYS.INDICATORS);
    
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        scraper: 'operational',
        cache: cacheStats.exists ? 'operational' : 'empty'
      },
      cache: {
        hasData: cacheStats.exists,
        age: cacheStats.age,
        remainingTtl: cacheStats.remainingTtl
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}