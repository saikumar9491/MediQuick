const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });

  try {
    await page.goto('http://localhost:5173/admin/products', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Page loaded successfully.');
    
    const stats = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/stats/products-summary');
        const data = await res.json();
        return { status: res.status, data };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log('BROWSER FETCH STATS:', stats);

  } catch (e) {
    console.log('Failed to load:', e.message);
  }

  await browser.close();
})();
