// binder-controller.js

import "../../components/binder/pokemon-binder.js";

/**
 * Reads the flat collection array from localStorage (key: "pokemonCollection"),
 * parses it, and hands it to <pokemon-binder> to re-render.
 */
function updateBinder() {
  const raw = localStorage.getItem("pokemonCollection");
  let collection = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      collection = parsed;
    }
  } catch {
    collection = [];
  }

  const binder = document.querySelector("pokemon-binder");
  if (binder) {
    binder.setPages(collection);
  }
}

/**
 * Tells the binder component to flip forward two pages.
 */
function turnPageRight() {
  const binder = document.querySelector("pokemon-binder");
  if (binder) {
    binder.flipForward();
  }
}

/**
 * Tells the binder component to flip backward two pages.
 */
function turnPageLeft() {
  const binder = document.querySelector("pokemon-binder");
  if (binder) {
    binder.flipBackward();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateBinder();

  document.getElementById("addCard")?.addEventListener("click", () => {
    document.querySelector("pokemon-binder")?.showAddCardModal();
  });

  document
    .getElementById("turnPageRight")
    ?.addEventListener("click", turnPageRight);

  document
    .getElementById("turnPageLeft")
    ?.addEventListener("click", turnPageLeft);
});

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