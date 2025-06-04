import { assignCardToSlot } from './assets/scripts/binder-controller.js';

const COLLECTION_KEY = 'pokemonCollection';

class PokemonCollection extends HTMLElement {
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
    this.assignMode = false;
    this.assignTarget = null;
  }

  connectedCallback() {
    this.render();
  }

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

  getCollection() {
    return PokemonCollection.getCollection();
  }

  setAssignMode(assignTarget) {
    this.assignMode = true;
    this.assignTarget = assignTarget;
    this.render();
  }

  clearAssignMode() {
    this.assignMode = false;
    this.assignTarget = null;
    this.render();
  }

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
      if (this.assignMode && this.assignTarget) {
        cardDiv.style.cursor = 'pointer';
        cardDiv.title = 'Assign this card to binder slot';
        cardDiv.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('assign-card-to-slot', {
            detail: {
              cardImgUrl: card.imgUrl,
              pageIndex: this.assignTarget.pageIndex,
              slotIndex: this.assignTarget.slotIndex
            }
          }));
          this.clearAssignMode();
          this.style.display = 'none';
        });
      }
      container.appendChild(cardDiv);
    });
  }
}

customElements.define('pokemon-collection', PokemonCollection);

// --- Integration logic for nav and assignment modal ---

function showCollection() {
  document.querySelector('pokemon-collection').style.display = 'flex';
  document.querySelector('pokemon-binder').style.display = 'none';
}
function showBinder() {
  document.querySelector('pokemon-collection').style.display = 'none';
  document.querySelector('pokemon-binder').style.display = '';
}

document.getElementById('navCollection').addEventListener('click', e => {
  e.preventDefault();
  showCollection();
  document.querySelector('pokemon-collection').clearAssignMode();
});
document.getElementById('navBinder').addEventListener('click', e => {
  e.preventDefault();
  showBinder();
});
document.getElementById('navHome').addEventListener('click', e => {
  e.preventDefault();
  showBinder();
});

// Listen for assign modal requests from binder
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'showAssignCardModal') {
    showCollection();
    document.querySelector('pokemon-collection').setAssignMode({
      pageIndex: event.data.pageIndex,
      slotIndex: event.data.slotIndex
    });
  }
});

// Listen for assignment from collection
window.addEventListener('assign-card-to-slot', (e) => {
  const { cardImgUrl, pageIndex, slotIndex } = e.detail;
  assignCardToSlot(cardImgUrl, pageIndex, slotIndex);
  showBinder();
});

window.addCardToCollection = function(card) {
  let collection = PokemonCollection.getCollection();
  if (!collection.some(c => c.imgUrl === card.imgUrl)) {
    collection.push(card);
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }
} 