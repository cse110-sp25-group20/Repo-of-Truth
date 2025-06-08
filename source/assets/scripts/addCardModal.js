// addCardModal.js
// Shared Add Card modal for both binder and collection views

import { handleAddCard } from './binder-controller.js';

/**
 * Displays a modal popup to search for and add a Pokémon card to the collection or binder.
 * The modal allows searching via the Pokémon TCG API, selecting a card, and confirming the addition.
 * 
 * This function sets up:
 * - A search input for name and number
 * - Dynamic card result rendering
 * - Selection handling and confirmation
 * - Saving to localStorage
 * - Updating UI via `handleAddCard`
 * 
 * @param {('binder'|'collection')} context - Determines if the card is added to the binder or just the collection.
 */
export function showAddCardModal() {
  const oldModal = document.getElementById('global-pokemon-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.className = 'card-modal';
  modal.id = 'global-pokemon-modal';
  modal.innerHTML = `
    <style>
      .card.selected {
        border: 2px solid #2a75bb !important;
        box-shadow: 0 0 12px #2a75bb !important;
        background-color: #e0f7ff !important;
        transform: scale(1.05);
      }
    </style>
    <section class="modal-content" role="dialog" aria-modal="true">
      <article class="modal-info" style="flex: 1;">
        <h2 class="modal-name">Add a Pokémon Card</h2>
        <input id="cardSearchInputName" type="text" placeholder="Enter Pokémon name" />
        <input id="cardSearchInputNum" type="text" placeholder="Enter the card number within its set (found on the card, usually at the bottom, e.g., 17/102)" />
        <button id="cardSearchSubmit">Search</button>
        <div id="cardSearchResult" style="margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 50px; max-height: 40vh; overflow-y: auto;"></div>
        <button id="confirmAddCardBtn" style="display: none; margin-top: 10px;">Add to Collection</button>
      </article>
    </section>
  `;

  document.body.appendChild(modal);

  /** @type {HTMLElement} */
  const resultBox = modal.querySelector("#cardSearchResult");

  /** @type {HTMLButtonElement} */
  const confirmBtn = modal.querySelector("#confirmAddCardBtn");

  /** @type {Object|null} */
  let selectedCard = null;

  /** Closes the modal when clicking outside the modal content */
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  /**
   * Handles confirmation of the selected card.
   * Saves the card to localStorage and updates the binder and collection view.
   */
  confirmBtn.addEventListener('click', () => {
    if (selectedCard && selectedCard.images?.small) {
      const COLLECTION_KEY = 'pokemonCollection';
      const cardData = {
        name: selectedCard.name,
        imgUrl: selectedCard.images.small,
        id: selectedCard.id
      };

      // Save to localStorage
      let collection = JSON.parse(localStorage.getItem(COLLECTION_KEY)) || [];
      collection.push(cardData);
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));

      // Optional external update handler
      if (window.addCardToCollection) {
        window.addCardToCollection(cardData);
      }

      // Update binder view
      handleAddCard(selectedCard.images.small);

      // Refresh collection view if it exists
      const oldCollection = document.querySelector('pokemon-collection');
      if (oldCollection) {
        const newCollection = oldCollection.cloneNode();
        oldCollection.replaceWith(newCollection);
      }

      // Close modal
      document.getElementById('global-pokemon-modal')?.remove();
    }
  });

  /**
   * Handles the card search based on name and optional number.
   * Dynamically loads and displays card options from the Pokémon TCG API.
   */
  const cardSearchSubmit = modal.querySelector('#cardSearchSubmit');
  cardSearchSubmit.addEventListener('click', async () => {
    const inputName = modal.querySelector("#cardSearchInputName");
    const inputNum = modal.querySelector("#cardSearchInputNum");

    const name = inputName.value.trim();
    const num = inputNum.value.trim();
    let cards;

    try {
      const { getCardsByName, getCardsByNameAndNumber } = await import('../../api/pokemonAPI.js');
      resultBox.innerHTML = '<p style="text-align:center;">Loading...</p>';

      if (name && !num) {
        cards = await getCardsByName(name);
      } else if (name && num) {
        cards = await getCardsByNameAndNumber(name, num);
      } else {
        resultBox.innerHTML = '<p style="text-align:center;">Please enter a Pokémon name.</p>';
        return;
      }

      resultBox.innerHTML = '';

      if (cards.length === 0) {
        resultBox.innerHTML = '<p>No cards found.</p>';
        return;
      }

      // Render card options
      cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.display = 'flex';
        cardDiv.style.flexDirection = 'column';
        cardDiv.style.alignItems = 'center';
        cardDiv.style.justifyContent = 'center';
        cardDiv.style.padding = '10px';
        cardDiv.style.border = '1px solid #ccc';
        cardDiv.style.borderRadius = '8px';
        cardDiv.style.backgroundColor = '#fff';
        cardDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        cardDiv.style.cursor = 'pointer';
        cardDiv.style.transition = 'transform 0.2s ease, border 0.2s ease';
        cardDiv.style.maxWidth = '110px';
        cardDiv.style.margin = 'auto';

        cardDiv.addEventListener('mouseover', () => {
          cardDiv.style.transform = 'scale(1.05)';
        });

        cardDiv.addEventListener('mouseout', () => {
          cardDiv.style.transform = 'scale(1)';
        });

        cardDiv.addEventListener('click', () => {
          // Deselect previous
          resultBox.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));

          cardDiv.classList.add('selected');
          selectedCard = card;
          confirmBtn.style.display = 'block';
        });

        const img = document.createElement('img');
        img.src = card.images.small;
        img.alt = card.name;
        img.style.width = '100%';
        img.style.borderRadius = '6px';

        const nameEl = document.createElement('div');
        nameEl.className = 'card-name';
        nameEl.textContent = card.name;
        nameEl.style.marginTop = '8px';
        nameEl.style.fontWeight = 'bold';
        nameEl.style.fontSize = '12px';
        nameEl.style.textAlign = 'center';
        nameEl.style.wordBreak = 'break-word';

        cardDiv.appendChild(img);
        cardDiv.appendChild(nameEl);
        resultBox.appendChild(cardDiv);
      });

    } catch (err) {
      if (err instanceof TypeError) {
        resultBox.innerHTML = `<p>Please enter a non-empty string in name.</p>`;
        console.error('TypeError occurred:', err);
      } else {
        resultBox.innerHTML = `<p>Error: ${err.message}</p>`;
        console.error('Error fetching cards:', err);
      }
    }
  });
}
