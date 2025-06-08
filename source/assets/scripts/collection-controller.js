// collection-controller.js

import "../../components/collection/collection-view.js";
import { getCardsByPage } from "../../demos/api-search/api/pokemonAPI.js";
import { showAddCardModal } from './addCardModal.js';
import { showOfflineAddCardModal } from './offline-add-card-modal.js';

const COLLECTION_KEY = 'pokemonCollection';

/**
 * Shows the collection view and hides the binder view.
 * Modifies control bar classes and visibility of navigation buttons accordingly.
 * @returns {void}
 */
function showCollection() {
  document.querySelector('pokemon-collection').style.display = 'flex';
  document.querySelector('pokemon-binder').style.display = 'none';
  const controls = document.querySelector('.controls');
  controls.style.display = 'flex';
  controls.classList.add('collection-controls');
  controls.classList.remove('binder-controls');
  document.getElementById('turnPageLeft').style.display = 'none';
  document.getElementById('turnPageRight').style.display = 'none';
  document.getElementById('addCard').style.display = 'inline-block';
}

/**
 * Shows the binder view and hides the collection view.
 * Adjusts navigation and control elements to suit the binder layout.
 * @returns {void}
 */
function showBinder() {
  document.querySelector('pokemon-collection').style.display = 'none';
  document.querySelector('pokemon-binder').style.display = '';
  const controls = document.querySelector('.controls');
  controls.style.display = 'flex';
  controls.classList.remove('collection-controls');
  controls.classList.add('binder-controls');
  document.getElementById('turnPageLeft').style.display = 'inline-block';
  document.getElementById('turnPageRight').style.display = 'inline-block';
  document.getElementById('addCard').style.display = 'inline-block';
}

// Navigation event listeners

/**
 * Handles navigation click to show the collection view.
 * @param {MouseEvent} e - Click event from the navigation link.
 * @returns {void}
 */
document.getElementById('navCollection').addEventListener('click', e => {
  e.preventDefault();
  showCollection();
});

/**
 * Handles navigation click to show the binder view.
 * @param {MouseEvent} e - Click event from the navigation link.
 * @returns {void}
 */
document.getElementById('navBinder').addEventListener('click', e => {
  e.preventDefault();
  showBinder();
});

/**
 * Adds a card to the user's collection if it's not already present.
 * Stores the card data in localStorage under a defined key.
 * 
 * @param {Object} card - Card object returned from the API.
 * @param {string} card.id - Unique identifier of the card.
 * @param {string} card.name - Name of the card.
 * @param {Object} card.images - Image object for the card.
 * @param {string} card.images.small - URL for the small-sized image.
 * @returns {void}
 */
window.addCardToCollection = function(card) {
  const collection = document.querySelector("pokemon-collection").getCollection();
  if (!collection.some(c => c.imgUrl === card.imgUrl)) {
    collection.push({
      id: card.id,
      name: card.name,
      imgUrl: card.images.small
    });
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }
};

// Initial UI setup

/**
 * Event listener for initial page load.
 * - Displays the collection view by default.
 * - Hides pagination buttons if the binder is not active.
 * - Attaches a click handler to the "Add Card" button, which:
 *   - Tries to check online API availability.
 *   - Shows the appropriate modal depending on network status and active view.
 */
window.addEventListener('DOMContentLoaded', () => {
  showCollection();

  const collectionVisible =
    document.querySelector('pokemon-collection').style.display !== 'none';
  if (collectionVisible) {
    document.getElementById('turnPageLeft').style.display = 'none';
    document.getElementById('turnPageRight').style.display = 'none';
  }

  document.getElementById('addCard')?.addEventListener('click', async () => {
    const isBinderView = document.querySelector('pokemon-binder').style.display !== 'none';

    const ping = getCardsByPage(1, 1);
    const timer = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 3000)
    );

    try {
      await Promise.race([ping, timer]);
      showAddCardModal(isBinderView ? 'binder' : 'collection');
    } catch (err) {
      console.warn("API ping failed:", err);
      showOfflineAddCardModal(isBinderView ? 'binder' : 'collection');
    }
  });
});
