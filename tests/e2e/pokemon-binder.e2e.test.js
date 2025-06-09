/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mocked pokemon-binder functionality (simplified)
function renderPokemonBinder() {
  const container = document.getElementById('pokemon-binder');
  container.innerHTML = ''; // clear existing cards

  let collection = JSON.parse(localStorage.getItem('pokemonCollection') || '[]');
  if (collection.length === 0) {
    container.textContent = 'No cards in your binder.';
    return;
  }

  collection.forEach((card) => {
    const cardElem = document.createElement('div');
    cardElem.className = 'card';
    cardElem.textContent = card.name;
    container.appendChild(cardElem);
  });
}

// Simulated function to add a card to collection and re-render
function addCard(card) {
  let collection = JSON.parse(localStorage.getItem('pokemonCollection') || '[]');
  collection.push(card);
  localStorage.setItem('pokemonCollection', JSON.stringify(collection));
  renderPokemonBinder();
}

describe('Pokemon Binder Component Tests', () => {
  let binderContainer;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Setup container element in DOM
    document.body.innerHTML = `
      <div id="pokemon-binder"></div>
    `;
    binderContainer = document.getElementById('pokemon-binder');
  });

  test('should display empty message if no cards', () => {
    renderPokemonBinder();
    expect(binderContainer.textContent).toBe('No cards in your binder.');
  });

  test('should render cards from localStorage', () => {
    const mockCards = [
      { id: 1, name: 'Pikachu' },
      { id: 2, name: 'Charmander' },
    ];
    localStorage.setItem('pokemonCollection', JSON.stringify(mockCards));
    renderPokemonBinder();

    const cards = binderContainer.querySelectorAll('.card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toBe('Pikachu');
    expect(cards[1].textContent).toBe('Charmander');
  });

  test('should add a card to localStorage and render it', () => {
    renderPokemonBinder();
    expect(binderContainer.textContent).toBe('No cards in your binder.');

    const newCard = { id: 3, name: 'Bulbasaur' };
    addCard(newCard);

    const cards = binderContainer.querySelectorAll('.card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toBe('Bulbasaur');

    // Check localStorage is updated
    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored).toContainEqual(newCard);
  });

  test('should persist cards across multiple adds', () => {
    addCard({ id: 1, name: 'Squirtle' });
    addCard({ id: 2, name: 'Jigglypuff' });

    const cards = binderContainer.querySelectorAll('.card');
    expect(cards.length).toBe(2);
    expect(cards[0].textContent).toBe('Squirtle');
    expect(cards[1].textContent).toBe('Jigglypuff');
  });

  // Example: pagination or page-flipping could be tested here if implemented

  test('should clear and re-render correctly on multiple renders', () => {
    addCard({ id: 1, name: 'Meowth' });
    expect(binderContainer.children.length).toBe(1);

    // Add another card directly to localStorage (simulate external change)
    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    stored.push({ id: 2, name: 'Psyduck' });
    localStorage.setItem('pokemonCollection', JSON.stringify(stored));

    renderPokemonBinder();
    expect(binderContainer.children.length).toBe(2);
  });
});