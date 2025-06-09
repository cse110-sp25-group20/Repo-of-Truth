/**
 * @jest-environment jsdom
 */

import '../../../source/assets/scripts/collection-controller.js';

describe('collection-controller integration', () => {
  let navCollection, navBinder, addCard, collectionEl, binderEl, controls;

  beforeEach(() => {
    // Set up minimal DOM needed by collection-controller
    document.body.innerHTML = `
      <div id="navCollection" class=""></div>
      <div id="navBinder" class="active"></div>
      <div id="turnPageLeft"></div>
      <div id="turnPageRight"></div>
      <div id="addCard"></div>
      <div class="controls"></div>
      <pokemon-collection style="display: none;"></pokemon-collection>
      <pokemon-binder style="display: flex;"></pokemon-binder>
    `;

    navCollection = document.getElementById('navCollection');
    navBinder = document.getElementById('navBinder');
    addCard = document.getElementById('addCard');
    collectionEl = document.querySelector('pokemon-collection');
    binderEl = document.querySelector('pokemon-binder');
    controls = document.querySelector('.controls');
  });

  test('clicking navCollection shows collection view and hides binder view', () => {
    // Simulate click
    navCollection.click();

    expect(navCollection.classList.contains('active')).toBe(true);
    expect(navBinder.classList.contains('active')).toBe(false);
    expect(collectionEl.style.display).toBe('flex');
    expect(binderEl.style.display).toBe('none');
    expect(controls.classList.contains('collection-controls')).toBe(true);
  });

  test('clicking navBinder shows binder view and hides collection view', () => {
    // Simulate click
    navBinder.click();

    expect(navCollection.classList.contains('active')).toBe(false);
    expect(navBinder.classList.contains('active')).toBe(true);
    expect(collectionEl.style.display).toBe('none');
    expect(binderEl.style.display).toBe('');
    expect(controls.classList.contains('binder-controls')).toBe(true);
  });

  test('clicking Add Card uses offline modal on API timeout', async () => {
    // Spy on modal functions
    window.showAddCardModal = jest.fn();
    window.showOfflineAddCardModal = jest.fn();

    // Patch fetch call to delay and force timeout
    jest.spyOn(global, 'fetch').mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ json: () => [] }), 5000))
    );

    // Trigger add card button click
    await addCard.click();

    expect(window.showAddCardModal).not.toHaveBeenCalled();
    expect(window.showOfflineAddCardModal).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});