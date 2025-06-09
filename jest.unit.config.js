export default {
    rootDir: './tests',
    testMatch: ['**/*.unit.test.js'],
    collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
      }
    },
    testEnvironment: 'jsdom', // default environment
  };
  