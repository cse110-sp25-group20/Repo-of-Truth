// addCardModal.js
// Shared Add Card modal for both binder and collection views

/**
 * Displays a modal popup to search for and add a Pokémon card to the collection or binder.
 * The modal allows searching via the Pokémon TCG API, selecting a card, and confirming the addition.
 * @param {('binder'|'collection')} context - Determines if the card is added to the binder or just the collection.
 */
export function showAddCardModal(context) {
  const oldModal = document.getElementById('global-pokemon-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.className = 'card-modal';
  modal.id = 'global-pokemon-modal';
  modal.innerHTML = `
    <style>
      .card.selected {
        border: 2px solid #2a75bb;
        box-shadow: 0 0 10px rgba(42, 117, 187, 0.6);
      }
      .modal-content {
        overflow: hidden !important;
        box-sizing: border-box;
        max-height: 98vh !important;
      }
      .modal-name {
        margin-top: 16px;
      }
    </style>
    <section class="modal-content" role="dialog" aria-modal="true">
      <article class="modal-info" style="flex: 1;">
        <h2 class="modal-name">Add a Pokémon Card</h2>
        <input id="cardSearchInput" type="text" placeholder="Enter Pokemon name" style="padding: 8px; width: 100%; box-sizing: border-box;" />
        <div id="cardSearchResult" style="
          margin-top: 16px; 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 50px;
          max-height:60vh;
          overflow-y: auto;
          padding: 10px;
        "></div>
        <button id="confirmAddCardBtn" style="display: none; margin-top: 10px; padding: 8px 12px; background: #ffcb05; color: black; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Add Card</button>
      </article>
    </section>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    // Close the modal if the background is clicked
    if (e.target === modal) modal.remove();
  });

  const input = modal.querySelector('#cardSearchInput');
  const resultBox = modal.querySelector('#cardSearchResult');
  const confirmBtn = modal.querySelector('#confirmAddCardBtn');
  let selectedCard = null;

  /**
   * Handles the confirmation of adding a selected card.
   * Adds the card to the collection and/or binder, refreshes views, and closes the modal.
   */
  confirmBtn.addEventListener('click', () => {
    if (selectedCard && selectedCard.images?.small) {
      if (window.addCardToCollection) {
        window.addCardToCollection({
          name: selectedCard.name,
          imgUrl: selectedCard.images.small,
        });
      }
      if (context === 'binder' && window.handleAddCard) {
        window.handleAddCard(selectedCard.images.small);
      }
      // Refresh views as needed
      const collEl = document.querySelector('pokemon-collection');
      if (collEl && typeof collEl.render === 'function') collEl.render();
      const binderEl = document.querySelector('pokemon-binder');
      if (binderEl && typeof binderEl.setPages === 'function' && window.getBinderPages) binderEl.setPages(window.getBinderPages());
      document.getElementById('global-pokemon-modal')?.remove();
    }
  });

  /**
   * Handles searching for cards as the user types in the input box.
   * Fetches cards from the Pokémon TCG API and displays them in the modal.
   * @param {Event} e - The input event from the search box.
   */
  input.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    resultBox.innerHTML = '<p style="text-align:center;">Loading...</p>';
    try {
      const { getCardsByName } = await import('../../demos/api-search/api/pokemonAPI.js');
      const cards = await getCardsByName(query);
      resultBox.innerHTML = '';
      if (!cards.length) {
        resultBox.innerHTML = '<p>No cards found.</p>';
        return;
      }
      cards.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        Object.assign(cardDiv.style, {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, border 0.2s ease',
          maxWidth: '110px',
          margin: 'auto',
        });
        cardDiv.addEventListener('mouseover', () => {
          cardDiv.style.transform = 'scale(1.05)';
        });
        cardDiv.addEventListener('mouseout', () => {
          cardDiv.style.transform = 'scale(1)';
        });
        /**
         * Handles selecting a card from the search results.
         * Highlights the selected card and enables the confirm button.
         */
        cardDiv.addEventListener('click', () => {
          resultBox.querySelectorAll('.card.selected').forEach((el) => el.classList.remove('selected'));
          cardDiv.classList.add('selected');
          selectedCard = card;
          confirmBtn.style.display = 'block';
        });
        const img = document.createElement('img');
        img.src = card.images.small;
        img.alt = card.name;
        Object.assign(img.style, {
          width: '100%',
          borderRadius: '6px',
        });
        const nameEl = document.createElement('div');
        nameEl.className = 'card-name';
        nameEl.textContent = card.name;
        Object.assign(nameEl.style, {
          marginTop: '8px',
          fontWeight: 'bold',
          fontSize: '12px',
          textAlign: 'center',
          wordBreak: 'break-word',
        });
        cardDiv.appendChild(img);
        cardDiv.appendChild(nameEl);
        resultBox.appendChild(cardDiv);
      });
    } catch (err) {
      resultBox.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  });
} 