/**
 * @jest-environment jsdom
 */

// Use relative path with .js extension
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
    // Simulate removal of cards
    localStorage.removeItem(COLLECTION_KEY);
    element.render();
    const message = element.shadowRoot.querySelector('p');
    expect(message).not.toBeNull();
    expect(message.textContent).toContain('No cards in your collection yet');
  });
});