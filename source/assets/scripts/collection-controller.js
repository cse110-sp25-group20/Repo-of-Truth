// collection-controller.js

import "../../components/collection/collection-view.js";
import { showAddCardModal } from './addCardModal.js';
import { showOfflineAddCardModal } from './offline-add-card-modal.js';
import { getCardsByPage } from "../../demos/api-search/api/pokemonAPI.js";

const COLLECTION_KEY = 'pokemonCollection';

/**
 * Shows the collection view and hides the binder view.
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
 * Handles navigation to the collection view.
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navCollection').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('navBinder').classList.remove('active');
  document.getElementById('navCollection').classList.add('active');
  showCollection();
});

/**
 * Handles navigation to the binder view.
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navBinder').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('navCollection').classList.remove('active');
  document.getElementById('navBinder').classList.add('active');
  showBinder();
});

/**
 * Adds a card to the user's collection in localStorage if it does not exist.
 * @param {Object} card - The card stores image  
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
}

// On initial load, hide prev/next buttons if collection is visible
window.addEventListener('DOMContentLoaded', () => {
  // Always show collection view on load
  showCollection();
  // Hide prev/next buttons if collection is visible
  const collectionVisible =
    document.querySelector('pokemon-collection').style.display !== 'none';
  if (collectionVisible) {
    document.getElementById('turnPageLeft').style.display = 'none';
    document.getElementById('turnPageRight').style.display = 'none';
  }

  // Add Card button logic for both views
  document.getElementById('addCard')?.addEventListener('click', async () => {
    // taking this out until detecting whether online or offline

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