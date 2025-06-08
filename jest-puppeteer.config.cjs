module.exports = {
  launch: {
    headless: false,
    slowMo: 150, // slower actions
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 },
  },
  browserContext: 'default',
};
