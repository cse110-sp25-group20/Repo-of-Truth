/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const MODULE_PATH = '../source/toggleMode.js';

describe("toggleMode.js", () => {
  let toggleButton;

  beforeEach(() => {
    document.body.innerHTML = `<button id="darkModeToggle">Toggle Mode</button>`;
    localStorage.clear();
    toggleButton = document.getElementById('darkModeToggle');

    // Clear previous class
    document.body.classList.remove('dark-mode');

    // Force Jest to clear module cache
    jest.resetModules();
  });

  test("applies dark mode class if localStorage is 'true'", async () => {
    localStorage.setItem('pokemonDarkMode', 'true');
    await import(MODULE_PATH);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  test("does not apply dark mode if localStorage is not 'true'", async () => {
    localStorage.setItem('pokemonDarkMode', 'false');
    await import(MODULE_PATH);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });

  test("toggles dark mode and updates localStorage on button click", async () => {
    await import(MODULE_PATH);

    toggleButton.click();
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('pokemonDarkMode')).toBe('true');

    toggleButton.click();
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('pokemonDarkMode')).toBe('false');
  });

  test("does nothing if toggle button is missing", async () => {
    document.body.innerHTML = ''; // Remove toggle button
    await expect(import(MODULE_PATH)).resolves.not.toThrow();
  });

  test("persists dark mode across reloads", async () => {
    // First load: set localStorage to true and import module
    localStorage.setItem('pokemonDarkMode', 'true');
    await import(MODULE_PATH);
    expect(document.body.classList.contains('dark-mode')).toBe(true);

    // Simulate reload by resetting modules and removing class
    jest.resetModules();
    document.body.classList.remove('dark-mode');

    // Re-import module to simulate page reload
    await import(MODULE_PATH);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });
});
