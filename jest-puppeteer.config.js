module.exports = {
  launch: {
    headless: process.env.CI === 'true' || false,
    slowMo: 20,
    devtools: false, // Disable DevTools to avoid port conflicts
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--remote-debugging-port=9223', // Use a custom port (e.g., 9223)
      '--disable-dev-shm-usage'
    ],
    executablePath: process.env.PUPPETEER_EXEC_PATH 
      || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  },
  browserContext: 'default',
  exitOnPageError: false
};