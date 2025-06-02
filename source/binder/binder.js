import { getAllSets, getCardsBySet } from "../api/pokemonAPI.js";
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

function getOwnedCardIDs() {
  const raw = window.localStorage.getItem("ownedCards");
  try {
    return raw ? JSON.parse(raw) : [];
  }
  catch {
    return [];
  }
}

function computeMissingCards(allCards, ownedIDs) {
  const ownedSet = new Set(ownedIDs);
  return allCards.filter(card => !ownedSet.has(card.id));
}

function buildPagesFromCardObjects(cardObjs) {
  const urls = cardObjs.map(c => c.images.small || "");
  const pagesArr = [];

  for (let i = 0; i < urls.length; i += 9) {
    const urlChunk = urls.slice(i, i + 9);
    while (urlChunk.length < 9) urlChunk.push("");
    pagesArr.push(urlChunk);
  }

  return pagesArr.length ? pagesArr : [["", "", "", "", "", "", "", "", ""]];
}

async function handleShowMissingCards() {
  const setSelector = document.getElementById("setSelector");
  const setID = setSelector.value;

  if (!setID) {
    return;
  }

  try {
    const allCards = await getCardsBySet(setID);
    const ownedIDs = getOwnedCardIDs();
    const missingCardObjs = computeMissingCards(allCards, ownedIDs);
    const missingPages = buildPagesFromCardObjects(missingCardObjs);

    pages = missingPages;
    currentPage = 0;
    
    updateBinder();
  }
  catch (err) {
    console.error("Error in handleShowMissingCards: ", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const setSelector = document.getElementById("setSelector");

  try {
    const allSets = await getAllSets();
    setSelector.innerHTML = `<option value="">-- choose a set --</option>`;

    allSets.forEach(setObj => {
      const opt = document.createElement("option");
      opt.value = setObj.id;
      opt.textContent = setObj.name;
      setSelector.appendChild(opt);
    });
  }
  catch (err) {
    console.error("Failed to load set list:", err);
  }

  updateBinder();

  document.getElementById("addCard").addEventListener("click", handleAddCard);
  document.getElementById("turnPageRight").addEventListener("click", turnPageRight);
  document.getElementById("turnPageLeft").addEventListener("click", turnPageLeft);
  document.getElementById("showMissing").addEventListener("click", handleShowMissingCards);
});

/*
document.addEventListener('DOMContentLoaded', updateBinder);
document.getElementById("addCard").addEventListener("click", handleAddCard);
document.getElementById("turnPageRight").addEventListener("click", turnPageRight);
document.getElementById("turnPageLeft").addEventListener("click", turnPageLeft);
*/
