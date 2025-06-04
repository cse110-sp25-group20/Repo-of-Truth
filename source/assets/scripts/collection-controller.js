// collection-controller.js

import "../../components/collection/collection-view.js";

const COLLECTION_KEY = 'pokemonCollection';

/**
 * Shows the collection view and hides the binder view.
 * @returns {void}
 */
function showCollection() {
  document.querySelector('pokemon-collection').style.display = 'flex';
  document.querySelector('pokemon-binder').style.display = 'none';
  document.getElementById('turnPageLeft').style.display = 'none';
  document.getElementById('turnPageRight').style.display = 'none';
}

/**
 * Shows the binder view and hides the collection view.
 * @returns {void}
 */
function showBinder() {
  document.querySelector('pokemon-collection').style.display = 'none';
  document.querySelector('pokemon-binder').style.display = '';
  document.getElementById('turnPageLeft').style.display = 'inline-block';
  document.getElementById('turnPageRight').style.display = 'inline-block';
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