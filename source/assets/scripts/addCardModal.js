// addCardModal.js
// Shared Add Card modal for both binder and collection views

import { handleAddCard } from './binder-controller.js';
/**
 * Displays a modal popup to search for and add a Pokémon card to the collection or binder.
 * The modal allows searching via the Pokémon TCG API, selecting a card, and confirming the addition.
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
          <input id="cardSearchInputName" type="text" placeholder="Enter Pokemon name" style="padding: 8px; width: 100%; box-sizing: border-box;" />
          <input id="cardSearchInputNum" type="text" placeholder="Enter Pokemon number" style="padding: 8px; width: 100%; box-sizing: border-box;" />
          <button id="cardSearchSubmit">Search</button>


          
          <div id="cardSearchResult" style="
            margin-top: 16px; 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 50px;
            max-height:40vh;
            overflow-y: auto;
            padding: 8px;">
          </div>
          <button id="confirmAddCardBtn" style="display: none; margin-top: 10px; padding: 8px 12px; background: #ffcb05; color: black; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Add to Collection</button>
        </article>
      </section>
    `;

    document.body.appendChild(modal);

    //close on background click
    modal.addEventListener('click', (e) => {
      if(e.target === modal) modal.remove();
    });
    const resultBox = modal.querySelector("#cardSearchResult");
    const confirmBtn = modal.querySelector("#confirmAddCardBtn");

    let selectedCard = null;
    let inputName = null;
    let inputNum = null;

  confirmBtn.addEventListener('click', () => {
    if (selectedCard && selectedCard.images?.small) {
      const COLLECTION_KEY = 'pokemonCollection';
      const cardData = { name: selectedCard.name, imgUrl: selectedCard.images.small, id: selectedCard.id };

      // Save to localStorage
      let collection = JSON.parse(localStorage.getItem(COLLECTION_KEY)) || [];
      collection.push(cardData);
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));

      if (window.addCardToCollection) {
        window.addCardToCollection(cardData);
      }

      // Update binder
      handleAddCard(selectedCard.images.small);

      // Force-refresh the collection by replacing the element
      const oldCollection = document.querySelector('pokemon-collection');
      if (oldCollection) {
        const newCollection = oldCollection.cloneNode();
        oldCollection.replaceWith(newCollection);
      }

      // Close modal
      document.getElementById('global-pokemon-modal')?.remove();
    }
  });


    cardSearchSubmit.addEventListener('click', async () => {
      inputName = modal.querySelector("#cardSearchInputName");
      inputNum = modal.querySelector("#cardSearchInputNum");

      const name = inputName.value.trim();
      const num = inputNum.value.trim();      
      let cards;
      try {
        const { getCardsByName, getCardsByNameAndNumber } = await import('../../demos/api-search/api/pokemonAPI.js');
        resultBox.innerHTML = '<p style="text-align:center;">Loading...</p>';
        
        if (name && !num) {
          cards = await getCardsByName(name);
        }
        else if (name && num) {
          cards = await getCardsByNameAndNumber(name, num);
        }
        else {
          resultBox.innerHTML = '<p style="text-align:center;">Please enter a Pokemon name.</p>';
        }
        

        resultBox.innerHTML = '';
        
        if (cards.length === 0) {
          resultBox.innerHTML = '<p>No cards found.</p>';
          return;
        }


      // Display each card
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
        cardDiv.style.transition = 'transform 0.2s ease';
        cardDiv.style.maxWidth = '110px';
        cardDiv.style.margin = 'auto';

        cardDiv.classList.add('card');
        

        cardDiv.style.border = '2px solid transparent'; // default
        cardDiv.style.transition = 'transform 0.2s ease, border 0.2s ease';


        cardDiv.addEventListener('mouseover', () => {
          cardDiv.style.transform = 'scale(1.05)';
        });

        cardDiv.addEventListener('mouseout', () => {
          cardDiv.style.transform = 'scale(1)';
        });

        cardDiv.addEventListener('click', () => {
          //deselect previously selceted
          resultBox.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
          
          cardDiv.classList.add('selected');
          selectedCard = card;
          confirmBtn.style.display = 'block';

        })
        

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
      resultBox.innerHTML = `<p>Error: ${err.message}</p>`;
    }
    })
  }