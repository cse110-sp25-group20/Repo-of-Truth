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
    // Clear any existing DOM
    document.body.innerHTML = '';
    localStorage.clear();

    // Create the element
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

    // Manually call render() to refresh DOM after localStorage change
    element.render();

    const cards = element.shadowRoot.querySelectorAll('.collection-card');
    expect(cards.length).toBe(2);

    const firstCardImg = cards[0].querySelector('img');
    expect(firstCardImg.alt).toBe('Charmander');
    expect(firstCardImg.src).toContain('charmander.png');
  });
});