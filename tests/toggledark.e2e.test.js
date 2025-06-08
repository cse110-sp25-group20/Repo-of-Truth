// tests/toggledark.e2e.test.js
import puppeteer from 'puppeteer';

describe('Puppeteer Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(); // Let jest-puppeteer handle config
    page = await browser.newPage();
    await page.goto('http://localhost:5500'); // Your Live Server URL
  }, 30000); // 30s timeout

  afterAll(async () => {
    await page.close();
    await browser.close(); // Critical to avoid Jest hanging
  });

  it('should load the page', async () => {
    const title = await page.title();
    expect(title).toBeTruthy(); // Basic check
  }, 10000); // 10s timeout
});