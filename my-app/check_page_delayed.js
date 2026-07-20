const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173/');
  
  // Wait for 15 seconds to see if it crashes after 5-6 seconds (like the banners changing)
  await new Promise(r => setTimeout(r, 15000));
  
  const content = await page.content();
  console.log("HTML length after 15s:", content.length);
  
  await browser.close();
})();
