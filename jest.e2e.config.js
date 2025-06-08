export default {
    rootDir: './tests',
    preset: 'jest-puppeteer',
    testMatch: ['**/*.e2e.test.js'],
    maxWorkers: 1,
    globals: {
      puppeteerOptions: {
        headless: false,
        args: ['--no-sandbox']
      }
    },
    reporters: ['default']
  };
  