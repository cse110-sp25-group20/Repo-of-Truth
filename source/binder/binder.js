import "./pokemon-binder.js";

/**
 * @description Adds a new page to the binder with empty card slots and one card back image
 * @returns {void}
 */
function handleAddCard() {
  const binder = document.querySelector("pokemon-binder");
  binder.setPages([["card_back.png", "", "", "", "", "", "", "", ""]]);
}

/**
 * @description Flips the binder page forward to show the next two pages
 * @returns {void}
 */
function turnPageRight() {
  const binder = document.querySelector("pokemon-binder");
  binder.flipForward();
}

/**
 * @description Flips the binder page backward to show the previous two pages
 * @returns {void}
 */
function turnPageLeft() {
  const binder = document.querySelector("pokemon-binder");
  binder.flipBackward();
}

const addButton = document.getElementById("addCard");
addButton.addEventListener("click", handleAddCard);

const turnRightButton = document.getElementById("turnPageRight");
turnRightButton.addEventListener("click", turnPageRight);

const turnLeftButton = document.getElementById("turnPageLeft");
turnLeftButton.addEventListener("click", turnPageLeft);
