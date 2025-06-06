// collection-controller.js

import "../../components/collection/collection-view.js";
import { showAddCardModal } from './addCardModal.js';

const COLLECTION_KEY = 'pokemonCollection';

/**
 * Shows the collection view and hides the binder view.
 * @returns {void}
 */
function showCollection() {
  document.querySelector('pokemon-collection').style.display = 'flex';
  document.querySelector('pokemon-binder').style.display = 'none';
  document.getElementById('addCardBinder').style.display = 'inline-block';
  document.getElementById('turnPageLeft').style.display = 'none';
  document.getElementById('turnPageRight').style.display = 'none';
  // Move controls above collection container
  const controls = document.querySelector('.controls');
  const main = document.body;
  main.insertBefore(controls, document.querySelector('pokemon-binder'));
  controls.style.position = 'absolute';
  controls.style.top = '180px';
  controls.classList.remove('binder-spacing');
  controls.classList.add('collection-spacing');
}

/**
 * Shows the binder view and hides the collection view.
 * @returns {void}
 */
function showBinder() {
  document.querySelector('pokemon-collection').style.display = 'none';
  document.querySelector('pokemon-binder').style.display = '';
  document.getElementById('addCardBinder').style.display = 'inline-block';
  document.getElementById('turnPageLeft').style.display = 'inline-block';
  document.getElementById('turnPageRight').style.display = 'inline-block';
  // Move controls below binder container
  const controls = document.querySelector('.controls');
  const binder = document.querySelector('pokemon-binder');
  binder.parentNode.insertBefore(controls, binder.nextSibling);
  controls.style.position = 'static';
  controls.style.top = '';
  controls.classList.add('binder-spacing');
  controls.classList.remove('collection-spacing');
}

// Navigation event listeners
/**
 * Handles navigation to the collection view.
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navCollection').addEventListener('click', e => {
  e.preventDefault();
  showCollection();
});

/**
 * Handles navigation to the binder view.
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navBinder').addEventListener('click', e => {
  e.preventDefault();
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
    collection.push(card);
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
  document.getElementById('addCardBinder')?.addEventListener('click', () => {
    const isBinderView = document.querySelector('pokemon-binder').style.display !== 'none';
    showAddCardModal(isBinderView ? 'binder' : 'collection');
  });
}); 