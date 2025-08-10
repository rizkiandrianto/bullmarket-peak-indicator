# Vercel API Conversion Plan

## Project Structure

Create the following file structure for your Vercel project:

```
bullmarket-peak-indicator/
├── api/
│   ├── indicators.js          # Main scraping endpoint
│   ├── health.js             # Health check endpoint
│   └── cache/
│       └── clear.js          # Cache clearing endpoint
├── lib/
│   ├── scraper.js            # Core scraping logic
│   ├── cache.js              # Caching utilities
│   ├── puppeteer-config.js   # Puppeteer configuration
│   └── error-handler.js      # Error handling utilities
├── vercel.json               # Vercel configuration
├── package.json              # Updated dependencies
└── README.md                 # Updated API documentation
```

## 1. Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x",
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "env": {
    "CACHE_DURATION": "10",
    "SCRAPE_TIMEOUT": "30",
    "MAX_RETRIES": "3"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

## 2. Updated Package.json

```json
{
  "name": "bullmarket-peak-indicator-api",
  "version": "1.0.0",
  "description": "Vercel API for Bitcoin bull market peak indicators",
  "main": "api/indicators.js",
  "scripts": {
    "dev": "vercel dev",
    "build": "vercel build",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "puppeteer-core": "^21.0.0",
    "chrome-aws-lambda": "^10.1.0",
    "node-cache": "^5.1.2"
  },
  "devDependencies": {
    "vercel": "^32.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 3. Puppeteer Configuration (lib/puppeteer-config.js)

```javascript
const chromium = require('chrome-aws-lambda');

const getPuppeteerConfig = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Local development configuration
    return {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    };
  }
  
  // Production Vercel configuration
  return {
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  };
};

module.exports = { getPuppeteerConfig };
```

## 4. Core Scraper Logic (lib/scraper.js)

```javascript
const puppeteer = require('puppeteer-core');
const { getPuppeteerConfig } = require('./puppeteer-config');
const { handleError } = require('./error-handler');

const SCRAPE_TIMEOUT = parseInt(process.env.SCRAPE_TIMEOUT || '30') * 1000;
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');

async function scrapeBullMarketIndicators(retryCount = 0) {
  let browser = null;
  
  try {
    const config = await getPuppeteerConfig();
    browser = await puppeteer.launch(config);
    const page = await browser.newPage();
    
    // Set timeout and navigate
    page.setDefaultTimeout(SCRAPE_TIMEOUT);
    await page.goto('https://www.coinglass.com/bull-market-peak-signals', {
      waitUntil: 'networkidle0',
      timeout: SCRAPE_TIMEOUT,
    });

    // Wait for the table to load
    await page.waitForSelector('.ant-table-row', { timeout: SCRAPE_TIMEOUT });

    // Extract data
    const data = await page.evaluate(() => {
      const items = [];
      const elements = document.querySelectorAll('.ant-table-row');

      elements.forEach((el) => {
        const cells = el.querySelectorAll('.ant-table-cell');
        if (cells.length >= 7) {
          const title = cells[1]?.innerText?.trim() || '';
          const current = (cells[2]?.innerText || '').replace(/,/g, '').trim();
          const reference = (cells[3]?.innerText || '').replace(/,/g, '').trim();
          const hitted = !cells[4]?.querySelector('.fall-color');
          const progressText = cells[6]?.querySelector('.MuiBox-root')?.innerText || '';
          const progress = parseFloat(progressText.replace('%', '')) || 0;
          
          if (title) {
            items.push({
              title,
              current,
              reference,
              hitted,
              progress,
            });
          }
        }
      });

      return items;
    });

    await browser.close();
    
    return {
      date: new Date().toISOString(),
      data,
      summary: {
        total: data.length,
        hit: data.filter(item => item.hitted).length,
        hitRate: data.length > 0 ? Math.round((data.filter(item => item.hitted).length / data.length) * 100) : 0
      }
    };
    
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Scraping failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return scrapeBullMarketIndicators(retryCount + 1);
    }
    
    throw handleError(error, 'SCRAPING_FAILED');
  }
}

module.exports = { scrapeBullMarketIndicators };
```

## 5. Caching Utilities (lib/cache.js)

```javascript
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
```

## 6. Error Handler (lib/error-handler.js)

```javascript
function handleError(error, type = 'UNKNOWN_ERROR') {
  const errorMap = {
    SCRAPING_FAILED: {
      message: 'Failed to scrape bull market indicators',
      statusCode: 503,
      retryable: true
    },
    TIMEOUT_ERROR: {
      message: 'Request timeout while scraping data',
      statusCode: 504,
      retryable: true
    },
    NETWORK_ERROR: {
      message: 'Network error occurred',
      statusCode: 502,
      retryable: true
    },
    UNKNOWN_ERROR: {
      message: 'An unexpected error occurred',
      statusCode: 500,
      retryable: false
    }
  };

  const errorInfo = errorMap[type] || errorMap.UNKNOWN_ERROR;
  
  console.error(`[${type}] ${errorInfo.message}:`, error.message);
  
  return {
    type,
    message: errorInfo.message,
    statusCode: errorInfo.statusCode,
    retryable: errorInfo.retryable,
    timestamp: new Date().toISOString(),
    originalError: error.message
  };
}

function createErrorResponse(error, fallbackData = null) {
  return {
    success: false,
    error: {
      type: error.type,
      message: error.message,
      timestamp: error.timestamp
    },
    data: fallbackData,
    meta: {
      cached: !!fallbackData,
      fallback: !!fallbackData
    }
  };
}

module.exports = { handleError, createErrorResponse };
```

## 7. Main API Endpoint (api/indicators.js)

```javascript
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
```

## 8. Health Check Endpoint (api/health.js)

```javascript
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
```

## 9. Cache Clear Endpoint (api/cache/clear.js)

```javascript
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
```

## 10. Environment Variables

Create a `.env.local` file for local development:

```env
CACHE_DURATION=10
SCRAPE_TIMEOUT=30
MAX_RETRIES=3
NODE_ENV=development
```

For production, set these in your Vercel dashboard or via CLI:

```bash
vercel env add CACHE_DURATION production
vercel env add SCRAPE_TIMEOUT production
vercel env add MAX_RETRIES production
```

## 11. Deployment Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 12. API Usage Examples

### Get Bull Market Indicators
```bash
curl https://your-project.vercel.app/api/indicators
```

### Force Refresh (bypass cache)
```bash
curl https://your-project.vercel.app/api/indicators?refresh=true
```

### Health Check
```bash
curl https://your-project.vercel.app/api/health
```

### Clear Cache
```bash
curl -X POST https://your-project.vercel.app/api/cache/clear
```

## 13. Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "date": "2025-01-10T02:49:32.393Z",
    "data": [
      {
        "title": "Bitcoin MVRV Z-Score",
        "current": "2.1",
        "reference": "7.0",
        "hitted": false,
        "progress": 30.0
      }
    ],
    "summary": {
      "total": 15,
      "hit": 3,
      "hitRate": 20
    }
  },
  "meta": {
    "cached": false,
    "cacheAge": 0,
    "nextUpdate": "2025-01-10T03:04:32.393Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "type": "SCRAPING_FAILED",
    "message": "Failed to scrape bull market indicators",
    "timestamp": "2025-01-10T02:49:32.393Z"
  },
  "data": null,
  "meta": {
    "cached": false,
    "fallback": false
  }
}
```

## 14. Performance Optimizations

1. **Cold Start Mitigation**: Cache browser instances when possible
2. **Memory Management**: Properly close browser instances
3. **Timeout Handling**: Set appropriate timeouts for all operations
4. **Error Recovery**: Implement retry logic with exponential backoff
5. **Response Compression**: Enable gzip compression in Vercel
6. **Monitoring**: Add logging for performance tracking

## 15. Security Considerations

1. **Rate Limiting**: Implement request rate limiting
2. **CORS**: Configure appropriate CORS headers
3. **Input Validation**: Validate all query parameters
4. **Error Handling**: Don't expose sensitive error details
5. **Environment Variables**: Use secure environment variable storage

## Next Steps

1. Create the file structure as outlined above
2. Install dependencies: `npm install`
3. Test locally: `vercel dev`
4. Deploy to Vercel: `vercel --prod`
5. Monitor performance and adjust cache settings as needed

This architecture provides a robust, production-ready API that can handle the demands of scraping bull market indicators while providing excellent performance through caching and proper error handling.