const puppeteer = require('puppeteer');

(async () => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto('https://www.coinglass.com/bull-market-peak-signals', {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  // Wait for the page content to load properly
  await page.waitForSelector('.ant-table-row', { timeout: 60000 }); // Example selector, adjust it to the actual content

  // Get all the contents, for example, extracting the text of all the "bull-market" peaks
  const data = await page.evaluate(() => {
    const items = [];
    const elements = document.querySelectorAll('.ant-table-row'); // Replace with actual selector

    elements.forEach((el) => {
      const cell = el.querySelectorAll('.ant-table-cell');
      const title = cell[1]?.innerText || '';
      const current = (cell[2]?.innerText || '').replace(/,/g, ''); // Adjust based on actual structure
      const reference = (cell[3]?.innerText || '').replace(/,/g, ''); // Adjust based on actual structure
      const hitted = !(cell[4]?.querySelector('.fall-color'));
      const progress = (cell[6]?.querySelector('.MuiBox-root')?.innerText || '').replace('%', ''); // Adjust based on actual structure
      const floatProgress = parseFloat(progress);
      items.push({
        title, // Adjust based on actual structure
        current,
        reference,
        hitted,
        progress: floatProgress,   // Adjust based on actual structure        
      });
    });

    return items;
  });

  // Log the extracted data to console
  const finalData = {
    date: new Date().toISOString(),
    data,
  }
  console.log(finalData);

  // Close the browser
  await browser.close();
})();

