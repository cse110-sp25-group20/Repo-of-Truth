/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect } from '@jest/globals';
import '../source/components/collection/collection-view.js' 

const COLLECTION_KEY = 'pokemonCollection';

describe('PokemonCollection Web Component', () => {
  let element;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    element = document.createElement('pokemon-collection');
    document.body.appendChild(element);
  });

  test('should attach shadow DOM on construction', () => {
    expect(element.shadowRoot).not.toBeNull();
  });

  test('should display "No cards in your collection yet." if localStorage is empty', () => {
    const message = element.shadowRoot.querySelector('p');
    expect(message).not.toBeNull();
    expect(message.textContent).toContain('No cards in your collection yet');
  });

  test('getCollection() should return an empty array if localStorage is not set', () => {
    expect(element.getCollection()).toEqual([]);
  });

  test('getCollection() should return a parsed array if localStorage is valid', () => {
    const fakeCards = [
      { name: 'Pikachu', imgUrl: 'https://example.com/pikachu.png' }
    ];
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(fakeCards));
    expect(element.getCollection()).toEqual(fakeCards);
  });

  test('should render cards from localStorage', () => {
    const fakeCards = [
      { name: 'Charmander', imgUrl: 'https://example.com/charmander.png' },
      { name: 'Bulbasaur', imgUrl: 'https://example.com/bulbasaur.png' }
    ];
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(fakeCards));
    element.render();
    const cards = element.shadowRoot.querySelectorAll('.collection-card');
    expect(cards.length).toBe(2);
    const firstCardImg = cards[0].querySelector('img');
    expect(firstCardImg.alt).toBe('Charmander');
    expect(firstCardImg.src).toContain('charmander.png');
  });

  test('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(COLLECTION_KEY, 'invalid JSON');
    expect(() => element.getCollection()).not.toThrow();
    expect(element.getCollection()).toEqual([]);
  });

  test('should not render any cards if localStorage is empty', () => {
    const cards = element.shadowRoot.querySelectorAll('.collection-card');
    expect(cards.length).toBe(0);
  });

  test('should update the DOM when new cards are added to localStorage', () => {
    const newCards = [
      { name: 'Squirtle', imgUrl: 'https://example.com/squirtle.png' }
    ];
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(newCards));
    element.render();
    const cards = element.shadowRoot.querySelectorAll('.collection-card');
    expect(cards.length).toBe(1);
    const cardImg = cards[0].querySelector('img');
    expect(cardImg.alt).toBe('Squirtle');
    expect(cardImg.src).toContain('squirtle.png');
  });

  test('should display a message when all cards are removed from localStorage', () => {
    const initialCards = [
      { name: 'Eevee', imgUrl: 'https://example.com/eevee.png' }
    ];
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(initialCards));
    element.render();
    localStorage.removeItem(COLLECTION_KEY);
    element.render();
    const message = element.shadowRoot.querySelector('p');
    expect(message).not.toBeNull();
    expect(message.textContent).toContain('No cards in your collection yet');
  });

  test('should open a modal with card details when a card is clicked', async () => {
    const fakeCards = [
      { name: 'Pikachu', imgUrl: 'https://example.com/pikachu.png', id: 'xy1-1' }
    ];
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(fakeCards));
    element.render();
    const cardDiv = element.shadowRoot.querySelector('.collection-card');
    // Mock getCardById import
    const getCardById = jest.fn().mockResolvedValue({
      name: 'Pikachu', rarity: 'Rare', set: { name: 'Base', printedTotal: 100 }, number: '1', tcgplayer: { prices: { normal: { market: 2.5 } } }
    });
    // Patch dynamic import
    jest.spyOn(element, 'getCollection').mockReturnValue(fakeCards);
    global.import = jest.fn().mockResolvedValue({ getCardById });
    // Simulate click
    cardDiv.click();
    // Wait for modal to appear
    await new Promise(r => setTimeout(r, 20));
    const modal = document.getElementById('global-pokemon-modal');
    expect(modal).not.toBeNull();
    expect(modal.innerHTML).toContain('Pikachu');
    expect(modal.innerHTML).toContain('Base');
    expect(modal.innerHTML).toContain('Rare');
    expect(modal.innerHTML).toContain('$2.50');
  });

  test('should remove card from collection when delete button is clicked in modal', async () => {
    const fakeCards = [
      { name: 'Pikachu', imgUrl: 'https://example.com/pikachu.png', id: 'xy1-1' }
    ];
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(fakeCards));
    element.render();
    const cardDiv = element.shadowRoot.querySelector('.collection-card');
    // Mock getCardById import
    const getCardById = jest.fn().mockResolvedValue({
      name: 'Pikachu', rarity: 'Rare', set: { name: 'Base', printedTotal: 100 }, number: '1', tcgplayer: { prices: { normal: { market: 2.5 } } }
    });
    jest.spyOn(element, 'getCollection').mockReturnValue(fakeCards);
    global.import = jest.fn().mockResolvedValue({ getCardById });
    // Simulate click
    cardDiv.click();
    // Wait for modal to appear
    await new Promise(r => setTimeout(r, 20));
    const modal = document.getElementById('global-pokemon-modal');
    expect(modal).not.toBeNull();
    // Simulate delete button click
    const deleteBtn = modal.querySelector('#deleteCardBtn');
    deleteBtn.click();
    // Wait for DOM update
    await new Promise(r => setTimeout(r, 20));
    expect(localStorage.getItem(COLLECTION_KEY)).toBe(JSON.stringify([]));
    expect(document.getElementById('global-pokemon-modal')).toBeNull();
  });
});
