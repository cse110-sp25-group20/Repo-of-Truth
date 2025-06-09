/* global jest */


/**
 * @jest-environment jsdom
 */

describe('assign-card-modal', () => {
  let showAssignCardModal;
  beforeAll(async () => {
    // Import the function (adjust the path as needed)
    ({ showAssignCardModal } = await import('../source/assets/scripts/assign-card-modal.js'));
  });

  afterEach(() => {
    // Clean up any modals
    document.getElementById('global-assign-card-modal')?.remove();
  });




  test('should render all cards from collection and allow selection', () => {
    // Prepare mock collection
    const mockCollection = [
      { name: 'Pikachu', imgUrl: 'pikachu.png', id: 1 },
      { name: 'Bulbasaur', imgUrl: 'bulbasaur.png', id: 2 }
    ];
    localStorage.setItem('pokemonCollection', JSON.stringify(mockCollection));
    showAssignCardModal(0, 0);
    const modal = document.getElementById('assign-card-modal');
    const cards = modal.querySelectorAll('.card');
    expect(cards.length).toBe(2);
    // Simulate selecting the second card
    cards[1].click();
    expect(cards[1].classList.contains('selected')).toBe(true);
    // Confirm button should be visible
    const confirmBtn = modal.querySelector('#confirmAssignCardBtn');
    expect(confirmBtn.style.display).toBe('block');
  });

  test('should assign card to slot and update localStorage', () => {
    const mockCollection = [
      { name: 'Pikachu', imgUrl: 'pikachu.png', id: 1 },
      { name: 'Bulbasaur', imgUrl: 'bulbasaur.png', id: 2 }
    ];
    localStorage.setItem('pokemonCollection', JSON.stringify(mockCollection));
    showAssignCardModal(1, 2);
    const modal = document.getElementById('assign-card-modal');
    const cards = modal.querySelectorAll('.card');
    // Select first card
    cards[0].click();
    // Click confirm
    const confirmBtn = modal.querySelector('#confirmAssignCardBtn');
    confirmBtn.click();
    // Modal should be removed
    expect(document.getElementById('assign-card-modal')).toBeNull();
    // Card should have page and slot assigned
    const updated = JSON.parse(localStorage.getItem('pokemonCollection'));
    expect(updated[0].page).toBe(1);
    expect(updated[0].slot).toBe(2);
  });

  test('should close modal on background click', () => {
    showAssignCardModal(0, 0);
    const modal = document.getElementById('assign-card-modal');
    // Simulate background click
    modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.getElementById('assign-card-modal')).toBeNull();
  });

  test('should scale cardDiv on hover and reset on mouseout', () => {
    const mockCollection = [
      { name: 'Pikachu', imgUrl: 'pikachu.png', id: 1 }
    ];
    localStorage.setItem('pokemonCollection', JSON.stringify(mockCollection));
    showAssignCardModal(0, 0);
    const modal = document.getElementById('assign-card-modal');
    const cardDiv = modal.querySelector('.card');
    // Simulate mouseover
    cardDiv.dispatchEvent(new Event('mouseover'));
    expect(cardDiv.style.transform).toBe('scale(1.05)');
    // Simulate mouseout
    cardDiv.dispatchEvent(new Event('mouseout'));
    expect(cardDiv.style.transform).toBe('scale(1)');
  });

  test('should set fallback image on error', () => {
    const mockCollection = [
      { name: 'Pikachu', imgUrl: 'pikachu.png', id: 1 }
    ];
    localStorage.setItem('pokemonCollection', JSON.stringify(mockCollection));
    showAssignCardModal(0, 0);
    const modal = document.getElementById('assign-card-modal');
    const img = modal.querySelector('img');
    // Simulate error event
    img.onerror();
    expect(img.src).toContain('assets/images/card-back.png');
  });

  // Add more tests as needed for card selection and confirmation
});
