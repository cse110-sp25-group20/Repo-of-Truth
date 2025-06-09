/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { handleAddCard } from '../../source/assets/scripts/binder-controller.js';

describe('Binder Controller E2E Tests', () => {
  let binderElement;
  let turnRightBtn;
  let turnLeftBtn;

  beforeEach(() => {
    // Set up basic DOM with buttons and <pokemon-binder>
    document.body.innerHTML = `
      <button id="turnPageRight">Next Page</button>
      <button id="turnPageLeft">Previous Page</button>
      <pokemon-binder></pokemon-binder>
    `;

    // Mock <pokemon-binder> with spies for methods called by binder-controller
    binderElement = document.querySelector('pokemon-binder');
    binderElement.setPages = jest.fn();
    binderElement.flipForward = jest.fn();
    binderElement.flipBackward = jest.fn();

    turnRightBtn = document.getElementById('turnPageRight');
    turnLeftBtn = document.getElementById('turnPageLeft');

    // Clear localStorage before each test
    localStorage.clear();
  });

  test('updateBinder reads localStorage and calls setPages with collection', () => {
    const mockCollection = [{ name: 'Pikachu' }, { name: 'Bulbasaur' }];
    localStorage.setItem('pokemonCollection', JSON.stringify(mockCollection));

    // We trigger the updateBinder logic indirectly by calling handleAddCard,
    // since updateBinder is internal to binder-controller.
    handleAddCard();

    expect(binderElement.setPages).toHaveBeenCalledWith(mockCollection);
  });

  test('updateBinder handles invalid or missing localStorage gracefully', () => {
    // localStorage is empty or invalid JSON
    localStorage.setItem('pokemonCollection', 'not valid json');

    // Should not throw, and sets empty array
    expect(() => handleAddCard()).not.toThrow();
    expect(binderElement.setPages).toHaveBeenCalledWith([]);
  });

  test('clicking Next Page button calls flipForward on <pokemon-binder>', () => {
    turnRightBtn.click();
    expect(binderElement.flipForward).toHaveBeenCalled();
  });

  test('clicking Previous Page button calls flipBackward on <pokemon-binder>', () => {
    turnLeftBtn.click();
    expect(binderElement.flipBackward).toHaveBeenCalled();
  });

  test('handleAddCard triggers updateBinder and refreshes binder', () => {
    // Spy on setPages to confirm it's called
    handleAddCard();
    expect(binderElement.setPages).toHaveBeenCalled();
  });
});