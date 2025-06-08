const puppeteer = require('puppeteer');
jest.setTimeout(30000);
describe('Toggle Dark Mode E2E Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
  console.log('Launching browser...');
  browser = await puppeteer.launch({ headless: false, slowMo: 50, devtools: true });
  page = await browser.newPage();
  console.log('Navigating to http://localhost:5000');
  await page.goto('http://127.0.0.1:5000', { waitUntil: 'networkidle2' });
  console.log('Page loaded');
});

  afterAll(async () => {
    await browser.close();
  });

  it('should load the page and have a title', async () => {
    const title = await page.title();
    expect(title).toBeDefined();
    // Optionally check title text if you want
    // expect(title).toContain('Your App Title');
  });

  it('should find the toggle dark mode button', async () => {
    await page.waitForSelector('button#darkModeToggle', { timeout: 2000 });
    const button = await page.$('button#darkModeToggle');
    expect(button).not.toBeNull();
  });

  it('should toggle dark mode class on body when button clicked', async () => {
  const buttonSelector = 'button#darkModeToggle';

  await page.waitForSelector(buttonSelector, { timeout: 3000 });

  // Ensure dark mode is off
  let hasDarkClass = await page.$eval('body', el =>
    el.classList.contains('dark-mode')
  );
  expect(hasDarkClass).toBe(false);

  // Toggle on
  await page.click(buttonSelector);
  await page.waitForFunction(() =>
    document.body.classList.contains('dark-mode')
  );
  hasDarkClass = await page.$eval('body', el =>
    el.classList.contains('dark-mode')
  );
  expect(hasDarkClass).toBe(true);

  // Toggle off
  await page.click(buttonSelector);
  await page.waitForFunction(() =>
    !document.body.classList.contains('dark-mode')
  );
  hasDarkClass = await page.$eval('body', el =>
    el.classList.contains('dark-mode')
  );
  expect(hasDarkClass).toBe(false);
}, 10000);


});