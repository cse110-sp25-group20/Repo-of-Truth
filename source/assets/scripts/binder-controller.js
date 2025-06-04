// binder.js

import "../../components/binder/pokemon-binder.js";

const BINDER_STORAGE_KEY = 'pokemonBinderPages';

function saveBinderToStorage() {
  localStorage.setItem(BINDER_STORAGE_KEY, JSON.stringify(pages));
}

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

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'assignCardToSlot') {
    assignCardToSlot(event.data.cardImgUrl, event.data.pageIndex, event.data.slotIndex);
  }
});

export function getBinderPages() {
  return pages;
}
window.getBinderPages = getBinderPages;