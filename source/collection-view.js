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
        .collection-outer {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px 0 rgba(34,34,34,0.10), 0 0 0 4px #2a75bb22;
          padding: 24px 16px 32px 16px;
          margin: 32px 0;
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 2.5px solid #2a75bb;
        }
        .collection-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px 28px;
          width: 100%;
          justify-items: center;
          min-height: 220px;
        }
        .collection-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(135deg, #fff 60%, #ffcb05 100%);
          border: 2px solid #2a75bb;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(34,34,34,0.10);
          padding: 16px 10px 12px 10px;
          width: 140px;
          min-height: 200px;
          margin: 0;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .collection-card img {
          width: 100px;
          height: 140px;
          object-fit: contain;
          border-radius: 8px;
          background: #f0f0f0;
          margin-bottom: 12px;
        }
        .collection-card .card-name {
          font-weight: bold;
          font-size: 1.1rem;
          color: #2a75bb;
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
      container.innerHTML = '<p style="width:100%;text-align:center;">No cards in your collection yet.</p>';
      return;
    }
    collection.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'collection-card';
      const img = document.createElement('img');
      img.src = card.imgUrl;
      img.alt = card.name;
      const nameEl = document.createElement('div');
      nameEl.className = 'card-name';
      nameEl.textContent = card.name;
      cardDiv.appendChild(img);
      cardDiv.appendChild(nameEl);
      container.appendChild(cardDiv);
    });
  }
}

customElements.define('pokemon-collection', PokemonCollection);

/**
 * Shows the collection view and hides the binder view.
 * @returns {void}
 */
function showCollection() {
  document.querySelector('pokemon-collection').style.display = 'flex';
  document.querySelector('pokemon-binder').style.display = 'none';
}

/**
 * Shows the binder view and hides the collection view.
 * @returns {void}
 */
function showBinder() {
  document.querySelector('pokemon-collection').style.display = 'none';
  document.querySelector('pokemon-binder').style.display = '';
}

// Navigation event listeners
/**
 * Handles navigation to the collection view.
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navCollection').addEventListener('click', e => {
  e.preventDefault();
  showCollection();
});

/**
 * Handles navigation to the binder view.
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navBinder').addEventListener('click', e => {
  e.preventDefault();
  showBinder();
});

/**
 * Handles navigation to the home view (binder).
 * @param {Event} e -  click event.
 * @returns {void}
 */
document.getElementById('navHome').addEventListener('click', e => {
  e.preventDefault();
  showBinder();
});

/**
 * Adds a card to the user's collection in localStorage if it does not exist.
 * @param {Object} card - The card stores image  
 * @returns {void}
 */
window.addCardToCollection = function(card) {
  let collection = PokemonCollection.getCollection();
  if (!collection.some(c => c.imgUrl === card.imgUrl)) {
    collection.push(card);
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }
} 