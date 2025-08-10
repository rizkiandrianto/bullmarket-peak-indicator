const puppeteerCore = require('puppeteer-core');
const puppeteer = require('puppeteer');
const { getPuppeteerConfig } = require('./puppeteer-config');
const { handleError } = require('./error-handler');

const SCRAPE_TIMEOUT = parseInt(process.env.SCRAPE_TIMEOUT || '30') * 1000;
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');

async function scrapeBullMarketIndicators(retryCount = 0) {
  let browser = null;
  
  try {
    const config = await getPuppeteerConfig();
    const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL !== '1';
    
    // Use regular puppeteer for local dev, puppeteer-core for production
    browser = isDev ? await puppeteer.launch(config) : await puppeteerCore.launch(config);
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