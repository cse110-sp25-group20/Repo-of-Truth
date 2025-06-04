// binder.js

import "../../components/binder/pokemon-binder.js";

/**
 * @constant {string} BINDER_STORAGE_KEY
 * @description The key used to store and retrieve the user's Pokemon binder pages from localStorage.
 */
const BINDER_STORAGE_KEY = 'pokemonBinderPages';

/**
 * Saves the current binder pages to localStorage using the BINDER_STORAGE_KEY.
 * @returns {void}
 */
function saveBinderToStorage() {
  localStorage.setItem(BINDER_STORAGE_KEY, JSON.stringify(pages));
}

/**
 * Loads the binder pages from localStorage using the BINDER_STORAGE_KEY.
 * If no valid data is found, returns a default single empty page.
 * @returns {Array<Array<string>>} The array of binder pages.
 */
function loadBinderFromStorage() {
  const stored = localStorage.getItem(BINDER_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Ignore JSON parse errors
    }
  }
  return [
    ["", "", "", "", "", "", "", "", ""]
  ];
}

let pages = loadBinderFromStorage();
let currentPage = 0;

function updateBinder() {
  const binder = document.querySelector("pokemon-binder");
  binder.setPages(pages);
  saveBinderToStorage();
}

export function handleAddCard(imgURL) {
  let page = pages[currentPage];
  let emptyIndex = page.indexOf("");
  if (emptyIndex === -1) {
    // If current page is full, add a new page
    page = ["", "", "", "", "", "", "", "", ""];
    pages.push(page);
    currentPage = pages.length - 1;
    emptyIndex = 0;
  }
  // Add a new card (Bulbasaur) this was also used for a placeholder for testing cards ui
  // TODO: replace with actual info from the api that user selects from the add button
  page[emptyIndex] = imgURL;
  updateBinder();
}

export function assignCardToSlot(cardImgUrl, pageIndex, slotIndex) {
  if (!pages[pageIndex]) pages[pageIndex] = ["", "", "", "", "", "", "", "", ""];
  pages[pageIndex][slotIndex] = cardImgUrl;
  updateBinder();
}

function turnPageRight() {
  const binder = document.querySelector("pokemon-binder");
  binder.flipForward();
  if (currentPage < pages.length - 1) currentPage++;
}

function turnPageLeft() {
  const binder = document.querySelector("pokemon-binder");
  binder.flipBackward();
  if (currentPage > 0) currentPage--;
}

document.addEventListener('DOMContentLoaded', updateBinder);

document.getElementById("addCard").addEventListener("click", () => {
  const binder = document.querySelector("pokemon-binder");
  binder.showAddCardModal();
});

document.getElementById("turnPageRight").addEventListener("click", turnPageRight);
document.getElementById("turnPageLeft").addEventListener("click", turnPageLeft);

/**
 * Returns the current binder pages array.
 * shows on window as window.getBinderPages so ui components 
 * can fetch the latest binder data after changes 
 * this is used to sync binder ui with localstorage changes 
 * @returns {Array<Array<string>>} The array of binder pages.
 */
export function getBinderPages() {
  return pages;
}
window.getBinderPages = getBinderPages;