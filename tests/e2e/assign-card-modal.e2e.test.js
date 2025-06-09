/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';
// In tests/e2e/assign-card-modal.e2e.test.js
import { showAssignCardModal } from '../../source/assets/scripts/assign-card-modal.js';


describe('Assign Card Modal E2E Tests', () => {
  const COLLECTION_STORAGE_KEY = 'pokemonCollection';
  let mockCollection;

  beforeEach(() => {
    // Reset DOM and localStorage
    document.body.innerHTML = '';
    localStorage.clear();

    // Prepare a mock collection
    mockCollection = [
      { id: 1, name: 'Pikachu', imgUrl: 'pikachu.png' },
      { id: 2, name: 'Charmander', imgUrl: 'charmander.png' },
      { id: 3, name: 'Bulbasaur', imgUrl: 'bulbasaur.png' },
    ];

    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(mockCollection));

    // Mock pokemon-binder element with setPages spy function
    const binder = document.createElement('pokemon-binder');
    binder.setPages = jest.fn();
    document.body.appendChild(binder);
  });

  test('should render the modal with cards from localStorage', () => {
    showAssignCardModal(0, 0);

    const modal = document.getElementById('assign-card-modal');
    expect(modal).not.toBeNull();

    // Confirm there are 3 card divs rendered
    const cards = modal.querySelectorAll('.card');
    expect(cards.length).toBe(mockCollection.length);

    // Check card names and images
    expect(cards[0].querySelector('.card-name').textContent).toBe('Pikachu');
    expect(cards[1].querySelector('.card-name').textContent).toBe('Charmander');
    expect(cards[2].querySelector('.card-name').textContent).toBe('Bulbasaur');

    expect(cards[0].querySelector('img').src).toContain('pikachu.png');
  });

  test('should open confirm button only after selecting a card', () => {
    showAssignCardModal(0, 0);

    const modal = document.getElementById('assign-card-modal');
    const confirmBtn = modal.querySelector('#confirmAssignCardBtn');
    expect(confirmBtn.style.display).toBe('none');

    // Simulate clicking the first card
    const firstCard = modal.querySelector('.card');
    firstCard.click();

    expect(confirmBtn.style.display).toBe('block');

    // Clicking another card switches selection
    const secondCard = modal.querySelectorAll('.card')[1];
    secondCard.click();

    expect(secondCard.classList.contains('selected')).toBe(true);
    expect(firstCard.classList.contains('selected')).toBe(false);
  });

  test('should assign card to given page and slot on confirm and update localStorage', () => {
    showAssignCardModal(2, 5);

    const modal = document.getElementById('assign-card-modal');
    const confirmBtn = modal.querySelector('#confirmAssignCardBtn');

    // Select the second card (Charmander)
    const secondCard = modal.querySelectorAll('.card')[1];
    secondCard.click();

    // Confirm the assign
    confirmBtn.click();

    // Modal should be removed after confirmation
    expect(document.getElementById('assign-card-modal')).toBeNull();

    // localStorage should be updated with page and slot for Charmander
    const updatedCollection = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY));
    expect(updatedCollection[1].page).toBe(2);
    expect(updatedCollection[1].slot).toBe(5);

    // Other cards should not have page or slot set
    expect(updatedCollection[0].page).toBeUndefined();
    expect(updatedCollection[2].page).toBeUndefined();

    // pokemon-binder's setPages should have been called with updated collection
    const binder = document.querySelector('pokemon-binder');
    expect(binder.setPages).toHaveBeenCalledWith(updatedCollection);
  });

  test('should close the modal when clicking outside modal content', () => {
    showAssignCardModal(0, 0);

    const modal = document.getElementById('assign-card-modal');
    expect(modal).not.toBeNull();

    // Simulate clicking the modal background (outside the modal content)
    modal.click();

    // Modal should be removed
    expect(document.getElementById('assign-card-modal')).toBeNull();
  });

  test('should not close modal when clicking inside modal content', () => {
    showAssignCardModal(0, 0);

    const modal = document.getElementById('assign-card-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Simulate click inside modal content
    const event = new MouseEvent('click', { bubbles: true });
    modalContent.dispatchEvent(event);

    // Modal should still exist
    expect(document.getElementById('assign-card-modal')).not.toBeNull();
  });

  test('should fallback to default card back image if image fails to load', () => {
    showAssignCardModal(0, 0);

    const modal = document.getElementById('assign-card-modal');
    const firstImg = modal.querySelector('img');

    // Trigger error event to simulate image load failure
    firstImg.onerror();

    expect(firstImg.src).toContain('assets/images/card-back.png');
  });
});