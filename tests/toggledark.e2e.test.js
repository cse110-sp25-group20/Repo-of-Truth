describe('Dark Mode Toggle', () => {
  beforeAll(async () => {
    // Go to your EXACT local URL
    await page.goto('http://127.0.0.1:5500/source/', {
      waitUntil: 'networkidle0', // Wait until page fully loads
      timeout: 30000 // 30 second timeout
    });
  });

  it('should toggle dark mode when pokeball is clicked', async () => {
    // Wait for and verify toggle button exists
    await expect(page).toMatchElement('#darkModeToggle');
    
    // Get initial dark mode state
    const initialDarkMode = await page.evaluate(() => 
      document.body.classList.contains('dark-mode') // Adjust class name if different
    );
    
    // Click the toggle
    await expect(page).toClick('#darkModeToggle');
    
    // Verify change
    await expect(page).toMatchElement('body.dark-mode'); // Adjust selector if different
    
    // Optional: Click again to verify toggle back
    await expect(page).toClick('#darkModeToggle');
    await expect(page).not.toMatchElement('body.dark-mode');
  });
});