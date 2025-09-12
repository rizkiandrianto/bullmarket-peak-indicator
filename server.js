const express = require('express');
const puppeteer = require('puppeteer-core');
const cors = require('cors');
const dayjs = require('dayjs');
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Scraper function extracted from index.js
async function scrapeBullMarketIndicators() {
  let browser;
  
  try {
    // Launch Puppeteer browser with production-ready config
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the URL with more robust settings
    await page.goto('https://www.coinglass.com/bull-market-peak-signals', {
      waitUntil: 'domcontentloaded',
      timeout: 90000,
    });

    // Wait for the page content to load properly with retry logic
    try {
      await page.waitForSelector('.ant-table-row', { timeout: 30000 });
    } catch (error) {
      // Try alternative selectors if the main one fails
      console.log('Primary selector failed, trying alternatives...');
      try {
        await page.waitForSelector('table', { timeout: 15000 });
      } catch (altError) {
        // If both fail, take a screenshot for debugging and continue
        console.log('All selectors failed, attempting to extract any available data...');
        await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
      }
    }

    // Extract data from the page
    const result = await page.evaluate(() => {
      const items = [];
      const elements = document.querySelectorAll('.ant-table-row');
      const holdProgressBar = document.querySelector('.ant-progress-steps').previousElementSibling;

      let overallPosition = 0; // Default value

      const parseValue = (value) => {
        if (!value) return 0;
        const num = parseFloat(value.replace(/[^0-9.-]+/g, ''));
        return isNaN(num) ? 0 : num;
      };
      
      if (holdProgressBar) {
        const styles = window.getComputedStyle(holdProgressBar);
        // Try different properties to get progress position
        overallPosition = parseValue(styles.left) || 0;
      }

      elements.forEach((el) => {
        const cell = el.querySelectorAll('.ant-table-cell');
        const title = cell[1]?.innerText || '';
        const current = (cell[2]?.innerText || '').replace(/,/g, '');
        const reference = (cell[3]?.innerText || '').replace(/,/g, '');
        const hit = !(cell[4]?.querySelector('.fall-color'));
        const progress = (cell[6]?.querySelector('.MuiBox-root')?.innerText || '').replace('%', '');
        const floatProgress = parseFloat(progress);
        
        items.push({
          title,
          current,
          reference,
          hit,
          progress: floatProgress,
        });
      });

      return { items, overallPosition };
    });

    return {
      success: true,
      date: dayjs().tz("Asia/Jakarta").format(),
      count: result.items.length,
      overallPosition: result.overallPosition,
      data: result.items
    };

  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape data: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// API Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Bull Market Peak Indicator API'
  });
});

// Main indicators endpoint
app.get('/api/indicators', async (req, res) => {
  try {
    console.log('Starting scraping process...');
    const result = await scrapeBullMarketIndicators();
    
    res.json(result);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bull market indicators',
      message: error.message,
      timestamp: dayjs().tz("Asia/Jakarta").format()
    });
  }
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Bull Market Peak Indicator API',
    version: '1.0.0',
    description: 'API for scraping real-time bull market peak indicators from CoinGlass',
    endpoints: {
      'GET /': 'API documentation',
      'GET /health': 'Health check',
      'GET /api/indicators': 'Get bull market peak indicators'
    },
    usage: {
      example: `${req.protocol}://${req.get('host')}/api/indicators`,
      response_format: {
        success: true,
        date: '2025-01-10T02:49:32.393Z',
        data: [
          {
            title: 'Indicator Name',
            current: 'Current Value',
            reference: 'Reference Threshold',
            hitted: true,
            progress: 75.5
          }
        ],
        count: 1
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist`,
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /api/indicators'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    timestamp: dayjs().tz("Asia/Jakarta").format()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Bull Market Peak Indicator API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Indicators: http://localhost:${PORT}/api/indicators`);
});

module.exports = app;