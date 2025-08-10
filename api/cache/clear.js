const { clearCache, CACHE_KEYS } = require('../../lib/cache');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { message: 'Method not allowed' }
    });
  }

  try {
    const { key } = req.body;
    
    if (key && !Object.values(CACHE_KEYS).includes(key)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid cache key' }
      });
    }
    
    const cleared = clearCache(key);
    
    return res.status(200).json({
      success: true,
      message: key ? `Cache key '${key}' cleared` : 'All cache cleared',
      cleared: key ? (cleared > 0) : true
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
}