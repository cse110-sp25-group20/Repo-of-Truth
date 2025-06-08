// binder-controller.js

import "../../components/binder/pokemon-binder.js";

/**
 * Reads the flat collection array from localStorage (key: "pokemonCollection"),
 * parses it, and hands it to <pokemon-binder> to re-render.
 *
 * If the stored data is not a valid array or fails to parse,
 * it defaults to an empty array.
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
 * Instructs the <pokemon-binder> component to flip forward by two pages.
 * Typically used for navigating to the next set of card pages.
 */
function turnPageRight() {
  const binder = document.querySelector("pokemon-binder");
  if (binder) {
    binder.flipForward();
  }
}

/**
 * Instructs the <pokemon-binder> component to flip backward by two pages.
 * Typically used for navigating to the previous set of card pages.
 */
function turnPageLeft() {
  const binder = document.querySelector("pokemon-binder");
  if (binder) {
    binder.flipBackward();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateBinder();

  document
    .getElementById("turnPageRight")
    ?.addEventListener("click", turnPageRight);

  document
    .getElementById("turnPageLeft")
    ?.addEventListener("click", turnPageLeft);
});

/**
 * Handles the action after a card has been added to the collection.
 * This re-renders the binder view with the updated card data.
 *
 * @param {string} imgURL - The image URL of the card that was added. (Not currently used.)
 */
export function handleAddCard(imgURL) {
  updateBinder();
}
