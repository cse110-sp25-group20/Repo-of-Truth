/**
 * @jest-environment jsdom
 */

import { showOfflineAddCardModal } from '../../source/assets/scripts/offline-add-card-modal.js';
import { offlineCards } from '../../source/assets/offline/offline-cards.js';

describe('offlineAddCardModal E2E', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();

    // Mock global functions expected by modal
    window.addCardToCollection = jest.fn();
    window.handleAddCard = jest.fn();
    window.getBinderPages = jest.fn(() => []);
  });

  test('modal renders offline cards correctly', () => {
    showOfflineAddCardModal('collection');

    const modal = document.getElementById('offline-pokemon-modal');
    expect(modal).toBeTruthy();

    const cards = modal.querySelectorAll('.card');
    expect(cards.length).toBe(offlineCards.length);  // Use real offlineCards length

    // Check first card's name and image
    expect(cards[0].textContent).toContain(offlineCards[0].name);
    expect(cards[0].querySelector('img').src).toContain(offlineCards[0].imgPath);
  });

  test('clicking a card selects it and shows Add button', () => {
    showOfflineAddCardModal('binder');

    const modal = document.getElementById('offline-pokemon-modal');
    const cards = modal.querySelectorAll('.card');
    const addBtn = modal.querySelector('#confirmOfflineAddBtn');

    expect(addBtn.style.display).toBe('none');

    cards[1].click();

    expect(cards[1].classList.contains('selected')).toBe(true);
    expect(addBtn.style.display).toBe('block');
  });

  test('Add button saves card, calls hooks, and closes modal', () => {
    showOfflineAddCardModal('collection');

    const modal = document.getElementById('offline-pokemon-modal');
    const cards = modal.querySelectorAll('.card');
    const addBtn = modal.querySelector('#confirmOfflineAddBtn');

    // Select first card and click Add
    cards[0].click();
    addBtn.click();

    const stored = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe(offlineCards[0].name);

    expect(window.addCardToCollection).toHaveBeenCalledWith(
      expect.objectContaining({ name: offlineCards[0].name })
    );

    // Modal should be removed after adding
    expect(document.getElementById('offline-pokemon-modal')).toBeNull();
  });

  test('clicking outside modal closes it', () => {
    showOfflineAddCardModal('collection');

    const modal = document.getElementById('offline-pokemon-modal');

    // Simulate click on modal background (outside modal-content)
    modal.click();

    expect(document.getElementById('offline-pokemon-modal')).toBeNull();
  });
});