/**
 * @file pokemon-binder.js
 * @description Custom Web Component for displaying and managing a Pokémon card binder with a page-turning feature and modal interactions.
 * @class PokemonBinder
 */

import { showAssignCardModal } from "../../assets/scripts/assign-card-modal.js";
import { formatMarketPrice } from '../../assets/scripts/priceHelper.js';

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 800px;
      height: 600px;
      border: 2px solid #333;
      background: #f9f9f9;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      perspective: 1000px;
    }
    .binder {
      display: flex;
      width: 100%;
      height: 100%;
      position: relative;
    }
    /* Container for each side’s backing + flipping leaves */
    .leaf-container {
      flex: 1;
      position: relative;
    }
    .leaf-back, .leaf-flip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .leaf-back { z-index: 1; }
    .leaf-back .page.back { display: none; }
    .leaf-flip { z-index: 2; }
    .leaf-flip .leaf-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.3s ease;
    }
    .left-leaf .leaf-flip .leaf-inner { transform-origin: right center; }
    .right-leaf .leaf-flip .leaf-inner { transform-origin: left center; }
    .leaf-flip.flip-forward .leaf-inner { transform: rotateY(-180deg); }
    .leaf-flip.flip-back    .leaf-inner { transform: rotateY( 180deg); }
    .page {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      backface-visibility: hidden;
      box-sizing: border-box;
      padding: 10px;
      background: #fff;
    }
    :host-context(body.dark-mode) .page {
      background: #2a2a2a;
      color: #fff;
    }
    .page.back { transform: rotateY(180deg); }
    .page.back .page-number { visibility: hidden; }
    .leaf.flip-forward .page.back .page-number,
    .leaf.flip-back .page.back .page-number { visibility: visible; }
    .leaf-inner.instant { transition: none !important; }
    .page-number {
      font-family: 'Luckiest Guy','Segoe UI',Tahoma,Verdana,sans-serif !important;
      font-weight: bold;
      color: #2a75bb;
      font-size: 18px !important;
      margin-bottom: 15px !important;
      text-shadow: 1px 1px 2px #ffcb05;
      letter-spacing: 1.25px;
    }
    .cards-container {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, auto);
      gap: 10px;
    }
    .card-slot {
      cursor: pointer;
      width: 100%;
      background: #eaeaea;
      border: 1px dashed #bbb;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1/1.4;
      transition: background 0.3s, border-color 0.3s;
    }
    :host-context(body.dark-mode) .card-slot {
      background: #3a3a3a;
      border: 1px dashed #666;
    }
    :host-context(body.dark-mode) .card-slot:hover {
      border-color: #4180bb !important;
      box-shadow: 0 4px 16px #4180bb66;
    }
    .card-slot img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: pointer;
    }
    .card-slot:hover {
      border-color: #2a75bb !important;
      box-shadow: 0 4px 16px #2a75bb33;
    }
    .pokemon-card {
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom right, #fff, #f9f9f9);
      border: 2px solid #2a75bb;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 8px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .pokemon-card:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      z-index: 5;
    }
    .card-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      pointer-events: none;
      overflow: auto;
    }
    .card-modal.hidden { display: none; }
    .modal-content {
      display: flex;
      flex-direction: row;
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 8px 32px #2228;
      padding: 24px 16px;
      max-width: 95vw;
      max-height: 95vh;
      align-items: center;
      pointer-events: auto;
      gap: 24px;
      position: relative;
      box-sizing: border-box;
      margin: auto;
      flex-shrink: 1;
    }
    .modal-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 180px;
      color: #222;
    }
    .modal-name {
      font-family: 'Luckiest Guy','Segoe UI',Tahoma,Verdana,sans-serif;
      color: #ee1515;
      font-size: 2rem;
      margin: 0 0 8px;
      text-shadow: 1px 1px 0 #ffcb05, 2px 2px 0 #2a75bb;
    }
    .modal-details {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .modal-details li {
      font-size: 1.1rem;
      color: #2a75bb;
      font-weight: bold;
    }
    @media (max-width:600px) {
      .modal-content { flex-direction:column; padding:12px 4px; gap:12px; max-width:98vw; max-height:98vh; }
      .modal-image { min-width:60px; min-height:60px; padding:4px; }
      .modal-card { max-width:60px; max-height:60px; }
    }
  </style>
  <div class="binder">
    <div class="leaf-container left-leaf">
      <div class="leaf leaf-back">
        <div class="page front">
          <div class="page-number"></div>
          <div class="cards-container"></div>
        </div>
      </div>
      <div class="leaf leaf-flip">
        <div class="leaf-inner">
          <div class="page front">
            <div class="page-number"></div>
            <div class="cards-container"></div>
          </div>
          <div class="page back">
            <div class="page-number"></div>
            <div class="cards-container"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="leaf-container right-leaf">
      <div class="leaf leaf-back">
        <div class="page front">
          <div class="page-number"></div>
          <div class="cards-container"></div>
        </div>
      </div>
      <div class="leaf leaf-flip">
        <div class="leaf-inner">
          <div class="page front">
            <div class="page-number"></div>
            <div class="cards-container"></div>
          </div>
          <div class="page back">
            <div class="page-number"></div>
            <div class="cards-container"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

/**
 * @class PokemonBinder
 * @extends HTMLElement
 * @description Web Component encapsulating binder DOM, state, and user interactions, including page turning and modals.
 */
class PokemonBinder extends HTMLElement {
  /**
   * @description Creates shadow DOM, initializes leaf containers, and renders initial faces.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    /**
     * @private @type {HTMLElement} Container for left-side leaves
     */
    this._leftLeafContainer = this.shadowRoot.querySelector('.left-leaf');

    /**
     * @private @type {HTMLElement} Container for right-side leaves
     */
    this._rightLeafContainer = this.shadowRoot.querySelector('.right-leaf');

    /**
     * @private @type {HTMLElement} Static backing leaf on the left
     */
    this._leftBackLeaf = this._leftLeafContainer.querySelector('.leaf-back');

    /**
     * @private @type {HTMLElement} Animated flip leaf on the left
     */
    this._leftFlipLeaf = this._leftLeafContainer.querySelector('.leaf-flip');

    /**
     * @private @type {HTMLElement} Static backing leaf on the right
     */
    this._rightBackLeaf = this._rightLeafContainer.querySelector('.leaf-back');

    /**
     * @private @type {HTMLElement} Animated flip leaf on the right
     */
    this._rightFlipLeaf = this._rightLeafContainer.querySelector('.leaf-flip');

    /**
     * @private @type {HTMLElement} Inner element of left flip leaf for CSS transforms
     */
    this._leftFlipInner = this._leftFlipLeaf.querySelector('.leaf-inner');

    /**
     * @private @type {HTMLElement} Inner element of right flip leaf for CSS transforms
     */
    this._rightFlipInner = this._rightFlipLeaf.querySelector('.leaf-inner');

    /**
     * @type {Map<number, (string|undefined)[]>} Map from page number to up to 9 card image URLs
     */
    this.pagesData = new Map();

    /**
     * @type {number} Current left-front page index
     */
    this.currentIndex = 1;

    /**
     * @type {boolean} Flag indicating if a page-flip animation is in progress
     */
    this.flipping = false;

    this._renderFaces();
  }

  /**
   * @description Takes a flat collection of card objects and constructs pages data.
   * @param {Array<{ name: string, imgUrl: string, page: number|string, slot: number|string }>} collection Flat array of card info
   * @returns {void}
   */
  setPages(collection) {
    if (!Array.isArray(collection)) return;
    const pagesMap = new Map();
    for (const card of collection) {
      const page = parseInt(card.page, 10);
      const slot = parseInt(card.slot, 10);
      if (!Number.isInteger(page) || page < 1 || !Number.isInteger(slot) || slot < 0 || slot > 8 || !card.imgUrl) continue;
      if (!pagesMap.has(page)) pagesMap.set(page, Array(9).fill(undefined));
      pagesMap.get(page)[slot] = card.imgUrl;
    }
    this.pagesData = pagesMap;
    if (this.currentIndex < 1) this.currentIndex = 1;
    this._renderFaces();
  }

  /**
   * @private
   * @description Updates the four visible pages on the binder leaves according to currentIndex.
   * @returns {void}
   */
  _renderFaces() {
    const leftFrontData = this.pagesData.get(this.currentIndex);
    const leftBackData = this.pagesData.get(this.currentIndex - 1);
    const rightFrontData = this.pagesData.get(this.currentIndex + 1);
    const rightBackData = this.pagesData.get(this.currentIndex + 2);

    this._loadFace(this._leftBackLeaf.querySelector('.page.front'), this.pagesData.get(this.currentIndex - 2), this.currentIndex - 2);
    this._loadFace(this._rightBackLeaf.querySelector('.page.front'), this.pagesData.get(this.currentIndex + 3), this.currentIndex + 3);

    this._loadFace(this._leftFlipLeaf.querySelector('.page.front'), leftFrontData, this.currentIndex);
    this._loadFace(this._leftFlipLeaf.querySelector('.page.back'), leftBackData, this.currentIndex - 1);
    this._loadFace(this._rightFlipLeaf.querySelector('.page.front'), rightFrontData, this.currentIndex + 1);
    this._loadFace(this._rightFlipLeaf.querySelector('.page.back'), rightBackData, this.currentIndex + 2);
  }

  /**
   * @private
   * @description Populates a face element with card images and page label.
   * @param {HTMLElement} faceEl DOM element for the page face
   * @param {Array<string>|undefined} cardUrls Array of up to 9 image URLs
   * @param {number} pageNumber Page index for labeling
   * @returns {void}
   */
  _loadFace(faceEl, cardUrls, pageNumber) {
    const pageLabel = faceEl.querySelector(".page-number");
    pageLabel.textContent = pageNumber > 0 ? `Page ${pageNumber}` : "";
    const container = faceEl.querySelector(".cards-container");
    container.innerHTML = "";
    const urls = Array.isArray(cardUrls) ? cardUrls : [];
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement("div");
      slot.className = "card-slot";
      if (urls[i]) {
        const img = document.createElement("img");
        img.src = urls[i];
        img.alt = "Pokémon card";
        img.onerror = () => { img.onerror = null; img.src = 'assets/images/card-back.png'; };
        img.addEventListener("click", () => this.showModal(img.src));
        slot.appendChild(img);
      } else {
        slot.addEventListener("click", () => showAssignCardModal(pageNumber, i));
      }
      container.appendChild(slot);
    }
  }

  /**
   * @description Performs a forward page-flip animation and updates binder state.
   * @returns {void}
   */
  flipForward() {
    if (this.flipping) return;
    this.flipping = true;
    this._rightFlipLeaf.style.zIndex = 3;
    this._rightFlipLeaf.classList.add('flip-forward');

    this._rightFlipInner.addEventListener('transitionend', () => {
      this._rightFlipInner.classList.add('instant');
      this._rightFlipInner.style.transform = 'rotateY(0deg)';
      void this._rightFlipInner.offsetWidth;
      this._rightFlipInner.classList.remove('instant');
      this._rightFlipInner.style.transform = '';
      this._rightFlipLeaf.style.zIndex = 2;
      this.currentIndex += 2;
      this.flipping = false;
      this._rightFlipLeaf.classList.remove('flip-forward');
      this._renderFaces();
    }, { once: true });
  }

  /**
   * @description Performs a backward page-flip animation and updates binder state.
   * @returns {void}
   */
  flipBackward() {
    if (this.currentIndex < 2 || this.flipping) return;
    this.flipping = true;
    this._leftFlipLeaf.style.zIndex = 3;
    this._leftFlipLeaf.classList.add('flip-back');

    this._leftFlipInner.addEventListener('transitionend', () => {
      this._leftFlipInner.classList.add('instant');
      this._leftFlipInner.style.transform = 'rotateY(0deg)';
      void this._leftFlipInner.offsetWidth;
      this._leftFlipInner.classList.remove('instant');
      this._leftFlipInner.style.transform = '';
      this._leftFlipLeaf.style.zIndex = 2;
      this.currentIndex -= 2;
      this.flipping = false;
      this._leftFlipLeaf.classList.remove('flip-back');
      this._renderFaces();
    }, { once: true });
  }


  /**
   * @description Displays a modal with a larger view of the clicked card and offers a remove from binder option.
   * @param {string} imgSrc
   */
  async showModal(imgSrc) {
    const oldModal = document.getElementById("global-pokemon-modal");
    if (oldModal) oldModal.remove();

    const raw = localStorage.getItem("pokemonCollection");
    let fullCard = null;
    try {
      if (raw) {
        const collection = JSON.parse(raw);
        const match = collection.find(c => c.imgUrl === imgSrc);
        if (match?.id) {
          const { getCardById } = await import("../../demos/api-search/api/pokemonAPI.js");
          fullCard = await getCardById(match.id);
        }
      }
    } catch (err) {
      console.error("Failed to load full card info:", err);
    }
    const name = fullCard?.name || 'Unknown';
    const price = formatMarketPrice(fullCard);
    const rarity = fullCard?.rarity || 'Unknown';
    const set = fullCard?.set?.name || '--';
    const number = fullCard?.number || '-';
    const setSize = fullCard?.set?.printedTotal || '-';
    const modal = document.createElement("div");
    modal.className = "card-modal";
    modal.id = "global-pokemon-modal";
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
          <button id="removeBinderBtn" style="margin-top: 12px; padding: 8px 12px; background: red; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;"> Remove from Binder
          </button>
        </article>
      </section>
    `;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
    
    setTimeout(() => {
      const removeBtn = modal.querySelector("#removeBinderBtn");
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
        const raw = localStorage.getItem("pokemonCollection");
        if (!raw) return;
        try {
          const collection = JSON.parse(raw);
          const updated = collection.map(card => {
            if (card.imgUrl === imgSrc) {
              return { ...card, page: null, slot: null };
            }
            return card;
          });
          localStorage.setItem("pokemonCollection", JSON.stringify(updated));
          this.setPages(updated);
          } catch (err) {
            console.error("Failed to remove card from binder:", err);
          }
          modal.remove();
        });
      }
    }, 0);

    document.body.appendChild(modal);
    setTimeout(() => {
      modal.classList.remove("hidden");
    }, 10);
  }

  /**
   * @description Hides/removes the currently displayed modal.
   */
  toggleModal() {
    const modal = document.getElementById("global-pokemon-modal");
    if (modal) modal.remove();
  }
}

customElements.define("pokemon-binder", PokemonBinder);
