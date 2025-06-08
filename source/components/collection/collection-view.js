import { formatMarketPrice } from '../../assets/scripts/priceHelper.js';

/**
 * @constant {string} COLLECTION_KEY
 * @description The key used in local storage to store and retrieve the cards in the collection.
 */
const COLLECTION_KEY = 'pokemonCollection';

/**
 * @class PokemonCollection
 * @extends HTMLElement
 * @description Custom web component for displaying the collection view
 */
class PokemonCollection extends HTMLElement {
  /**
   * @constructor
   * @description Initializes the PokemonCollection component and sets up the shadow DOM.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          min-height: 400px;
        }
        .collection-list {
          display: flex;
          flex-wrap: wrap;
          gap: 18px 28px;
          width: 100%;
          justify-content: center;
          align-items: center;
          min-height: 220px;
        }
        .collection-list.has-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .empty-message {
          text-align: center;
          font-family: 'Luckiest Guy', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #2a75bb;
          font-size: 1.5rem;
          padding: 2rem;
          text-shadow: 1px 1px 2px #ffcb05;
          margin: auto;
          letter-spacing: 1px;
          max-width: 80%;
        }
        .collection-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s ease-in-out;
        }
        .collection-card:hover {
          cursor: pointer;
          transform: scale(1.02);
          transition: transform 0.15s ease-in-out;
        }
        .collection-card img {
          margin-bottom: 12px;
        }
        .collection-card .card-name {
          font-weight: bold;
          font-size: 1.1rem;
          text-align: center;
          margin-top: 4px;
          word-break: break-word;
        }
        @media (max-width: 800px) {
          .collection-outer {
            max-width: 98vw;
            padding: 10px 2vw;
          }
          .collection-list {
            gap: 10px 8px;
            grid-template-columns: repeat(2, 1fr);
          }
        }
      </style>
      <div class="collection-outer">
        <div class="collection-list" id="collection-list"></div>
      </div>
    `;
  }

  /**
   * Called when the element is inserted into the DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Retrieves the user's collection from localStorage using the constant COLLECTION_KEY.
   * @static
   * @returns {Array<Object>} The array of card objects in the collection.
   */
  static getCollection() {
    const stored = localStorage.getItem(COLLECTION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Ignore JSON parse errors
      }
    }
    return [];
  }

  /**
   * Gets the user's card collection.
   * @returns {Array<Object>} The array of card objects in the collection.
   */
  getCollection() {
    return PokemonCollection.getCollection();
  }

  /**
   * Renders the collection view, displaying all cards or a message if empty.
   * @returns {void}
   */
  render() {
    const container = this.shadowRoot.getElementById('collection-list');
    container.innerHTML = '';
    const collection = this.getCollection();
    if (collection.length === 0) {
      container.classList.remove('has-cards');
      container.innerHTML = '<p class="empty-message">No cards in your collection yet!</p>';
      return;
    }
    container.classList.add('has-cards');
    collection.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'collection-card';
      const img = document.createElement('img');
      img.src = card.imgUrl;
      img.alt = card.name;
      // Fallback to card-back.png if the image fails to load
      img.onerror = () => {
        img.onerror = null; // prevent infinite loop if fallback also missing
        img.src = 'assets/images/card-back.png';
      };

      const nameEl = document.createElement('div');
      nameEl.className = 'card-name';
      nameEl.textContent = card.name;
      cardDiv.appendChild(img);
      cardDiv.appendChild(nameEl);
      container.appendChild(cardDiv);

      cardDiv.addEventListener('click', () => {
        this.showCardModal(card.imgUrl);
      })
    });
  }

    async showCardModal(imgSrc) {
      const oldModal = document.getElementById('global-pokemon-modal');
      if (oldModal) oldModal.remove();

      let fullCard = null;
      try {
        const collection = this.getCollection();
        const cardMatch = collection.find(c => c.imgUrl === imgSrc);

        const { getCardById } = await import('../../api/pokemonAPI.js');
        
        if (cardMatch?.id) {
          fullCard = await getCardById(cardMatch.id);
        
        }
      } catch (err) {
        console.error('Error fetching card data for modal:', err);
      }

      const name = fullCard?.name || 'Unknown';
      const price = formatMarketPrice(fullCard);
      const rarity = fullCard?.rarity || 'Unknown';
      const set = fullCard?.set?.name || '--';
      const number = fullCard?.number || '-';
      const setSize = fullCard?.set?.printedTotal || '-';

      const modal = document.createElement('div');
      modal.className = 'card-modal';
      modal.id = 'global-pokemon-modal';

      modal.innerHTML = `
        <section class="modal-content" role="dialog" aria-modal="true">
          <figure class="modal-image">
            <img class="modal-card" src="${imgSrc}" alt="Pokemon Card">
          </figure>
          <article class="modal-info">
            <h2 class="modal-name">${name}</h2>
            <ul class="modal-details">
              <li class="modal-set">Set: ${set}</li>
              <li class="modal-type">Number: ${number}/${setSize}</li>
              <li class="modal-rarity">Rarity: ${rarity}</li>
              <li class="modal-hp">Price: ${price}</li>
            </ul>
            <button id="deleteCardBtn" style="margin-top: 12px; padding: 8px 12px; background: red; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
              Remove from Collection
            </button>
          </article>
        </section>
      `;

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      setTimeout(() => {
        const deleteBtn = modal.querySelector('#deleteCardBtn');
        deleteBtn.addEventListener('click', () => {
          const updated = this.getCollection().filter(c => c.imgUrl !== imgSrc);
          localStorage.setItem('pokemonCollection', JSON.stringify(updated));
          this.render();
          modal.remove();
        });
      }, 0);

      document.body.appendChild(modal);
      setTimeout(() => { modal.classList.remove('hidden'); }, 10);
    }

}

customElements.define('pokemon-collection', PokemonCollection);
