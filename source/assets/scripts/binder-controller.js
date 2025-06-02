// binder.js

import "./pokemon-binder.js";

//used placehodlers for testing cards ui
// TODO: replace with actual info from the api
let pages = [
  ["https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", "", "", "", "", "", "", "", ""]
];
let currentPage = 0;

function updateBinder() {
  const binder = document.querySelector("pokemon-binder");
  binder.setPages(pages);
}

function handleAddCard() {
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
  page[emptyIndex] = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";
  updateBinder();
}

// 
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
document.getElementById("addCard").addEventListener("click", handleAddCard);
document.getElementById("turnPageRight").addEventListener("click", turnPageRight);
document.getElementById("turnPageLeft").addEventListener("click", turnPageLeft);
