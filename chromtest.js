// test-chrome.js
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Adjust for your OS
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('✅ Chrome launched successfully!');
    console.log('WS Endpoint:', browser.wsEndpoint());
    await browser.close();
  } catch (error) {
    console.error('❌ Chrome failed to launch:', error);
  }
})();