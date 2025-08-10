const chromium = require('@sparticuz/chromium');

const getPuppeteerConfig = async () => {
  const isDev = process.env.NODE_ENV === 'development' || process.env.VERCEL !== '1';
  
  if (isDev) {
    // Local development configuration - use system Chrome
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
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  };
};

module.exports = { getPuppeteerConfig };