import puppeteer from "puppeteer";

export async function scrape() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process"
    ],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.coinglass.com/bull-market-peak-signals", { waitUntil: "networkidle0", timeout: 60000 });

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

  return finalData;
  } finally {
    await browser.close();
  }
}

// jalankan langsung kalau dipanggil manual
if (import.meta && import.meta.url === `file://${process.argv[1]}`) {
  scrape().then((d) => console.log(JSON.stringify(d, null, 2)));
}

