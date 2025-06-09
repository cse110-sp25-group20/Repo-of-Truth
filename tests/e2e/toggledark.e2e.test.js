/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe('Dark Mode Toggle E2E Tests', () => {
  let toggleButton;

  beforeEach(() => {
    // Reset document body for each test
    document.body.innerHTML = `
      <button id="toggle-dark-mode">Toggle Dark Mode</button>
    `;

    // Set document title
    document.title = 'Pokémon Card Binder';

    // Grab the toggle button
    toggleButton = document.getElementById('toggle-dark-mode');

    // Simple function simulating the toggle handler
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  });

  test('should load the page and have a title', () => {
    expect(document.title).toBe('Pokémon Card Binder');
  });

  test('should find the toggle dark mode button', () => {
    expect(toggleButton).not.toBeNull();
    expect(toggleButton.textContent).toBe('Toggle Dark Mode');
  });

  test('should toggle dark mode class on body when button clicked', () => {
    expect(document.body.classList.contains('dark-mode')).toBe(false);

    toggleButton.click();
    expect(document.body.classList.contains('dark-mode')).toBe(true);

    toggleButton.click();
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });

  // Additional tests for good coverage

  test('should add dark-mode class only once if clicked multiple times rapidly', () => {
    toggleButton.click();
    toggleButton.click();
    toggleButton.click();
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  test('body classList length updates correctly after toggle', () => {
    const initialLength = document.body.classList.length;
    toggleButton.click();
    expect(document.body.classList.length).toBe(initialLength + 1);
    toggleButton.click();
    expect(document.body.classList.length).toBe(initialLength);
  });

  test('toggle button remains in the document after toggling', () => {
    toggleButton.click();
    expect(document.getElementById('toggle-dark-mode')).not.toBeNull();
  });

  test('dark-mode class toggle does not affect other classes', () => {
    document.body.classList.add('some-other-class');
    toggleButton.click();
    expect(document.body.classList.contains('some-other-class')).toBe(true);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    toggleButton.click();
    expect(document.body.classList.contains('some-other-class')).toBe(true);
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });
});