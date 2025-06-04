/**
 * @file pokemon-binder.js
 * @description Custom web component for displaying and managing a Pokemon card binder, including a page-turning feature.
 * @module PokemonBinder
 */

import { getCardsByName } from "../../demos/api-search/api/pokemonAPI.js";
import { handleAddCard } from "../../assets/scripts/binder-controller.js";

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
    .leaf {
      flex: 1;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s ease;
      overflow: hidden;
      z-index: 1;
    }
    .leaf.flip-forward,
    .leaf.flip-back {
      z-index: 2;
    }
    .leaf.flip-forward {
      transform-origin: left center;
      transform: rotateY(-180deg);
    }
    .leaf.flip-back {
      transform-origin: right center;
      transform: rotateY(180deg);
    }
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
    .page.back {
      transform: rotateY(180deg);
    }
    .page.back .page-number {
      transform: rotateY(180deg);
      visibility: hidden;
    }
    .leaf.flip-forward .page.back .page-number,
    .leaf.flip-back .page.back .page-number {
      visibility: visible;
    }
    .page-number {
      font-weight: bold;
      color: #2a75bb;
      font-size: 18px !important;
      margin-bottom: 15px !important;
      text-shadow: 1px 1px 2px #ffcb05;
    }
    .cards-container {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, auto);
      gap: 10px;
    }
    .card-slot {
      width: 100%;
      background: #eaeaea;
      border: 1px dashed #bbb;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1 / 1.4;
    }
    .card-slot img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: pointer;
    }
    .pokemon-card {
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom right, #fff, #f9f9f9);
      border: 2px solid #2a75bb;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      z-index: 5;
    }
    .card-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      pointer-events: none;
      overflow: auto;
    }
    .card-modal.hidden {
      display: none;
    }
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
    .modal-image {
      flex: 0 1 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ffcb05 0%, #fff 100%);
      border-radius: 16px;
      box-shadow: 0 2px 8px #2a75bb33;
      padding: 12px;
      min-width: 100px;
      min-height: 120px;
      margin: 0;
      flex-shrink: 1;
    }
    .modal-card {
      max-width: 100px;
      max-height: 120px;
      border-radius: 12px;
      box-shadow: 0 2px 8px #2a75bb33;
      background: #fff;
    }
    .modal-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 180px;
      color: #222;
    }
    .modal-name {
      font-family: 'Luckiest Guy', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #ee1515;
      font-size: 2rem;
      margin: 0 0 8px 0;
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
    @media (max-width: 600px) {
      .modal-content {
        flex-direction: column;
        padding: 12px 4px;
        gap: 12px;
        max-width: 98vw;
        max-height: 98vh;
      }
      .modal-image {
        min-width: 60px;
        min-height: 60px;
        padding: 4px;
      }
      .modal-card {
        max-width: 60px;
        max-height: 60px;
      }
    }
  </style>
  <div class="binder">
    <div class="leaf left-leaf">
      <div class="page front">
        <div class="page-number"></div>
        <div class="cards-container"></div>
      </div>
      <div class="page back">
        <div class="page-number"></div>
        <div class="cards-container"></div>
      </div>
    </div>
    <div class="leaf right-leaf">
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
`;

class PokemonBinder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // pagesData is now a Map<pageNumber, Array<9 imgUrls>>
    this.pagesData = new Map();
    this.currentIndex = 0; // this holds the “current page number” (1-based)

    this._leftLeaf = this.shadowRoot.querySelector(".left-leaf");
    this._rightLeaf = this.shadowRoot.querySelector(".right-leaf");
    this.modal = this.shadowRoot.querySelector(".card-modal");
    this.modalCard = this.shadowRoot.querySelector(".modal-card");

    this._renderFaces();
  }

  /**
   * @description Takes a flat collection of { name, imgUrl, page, slot } objects,
   *              builds a Map keyed by pageNumber → array of 9 img URLs,
   *              then re-renders the binder.
   * @param {Array<{ name: string, imgUrl: string, page: number|string, slot: number|string }>} collection
   */
  setPages(collection) {
    if (!Array.isArray(collection)) return;

    // 1) Build a Map<pageNumber, Array(9)>
    const pagesMap = new Map();

    for (const card of collection) {
      const page = parseInt(card.page, 10);
      const slot = parseInt(card.slot, 10);

      // Skip invalid page/slot/img
      if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(slot) ||
        slot < 0 ||
        slot > 8 ||
        !card.imgUrl
      ) {
        continue;
      }

      if (!pagesMap.has(page)) {
        pagesMap.set(page, Array(9).fill(undefined));
      }
      pagesMap.get(page)[slot] = card.imgUrl;
    }

    // 2) Swap in our new Map
    this.pagesData = pagesMap;

    // 3) Set currentIndex to the smallest pageNumber, or 0 if none
    if (pagesMap.size > 0) {
      this.currentIndex = Math.min(...pagesMap.keys());
    } else {
      this.currentIndex = 0;
    }

    // 4) Re-render
    this._renderFaces();
  }

  /**
   * @description Renders the four visible “faces” of the binder (two pages on each leaf).
   *              Uses page numbers relative to this.currentIndex.
   */
  _renderFaces() {
    // For each “face,” fetch the array of imgURLs from the Map (or undefined if missing)
    const leftFrontData = this.pagesData.get(this.currentIndex);
    const leftBackData = this.pagesData.get(this.currentIndex - 1);
    const rightFrontData = this.pagesData.get(this.currentIndex + 1);
    const rightBackData = this.pagesData.get(this.currentIndex + 2);

    // Left leaf: front face shows page “currentIndex”
    this._loadFace(
      this._leftLeaf.querySelector(".front"),
      leftFrontData,
      this.currentIndex
    );
    // Left leaf: back face shows page “currentIndex – 1”
    this._loadFace(
      this._leftLeaf.querySelector(".back"),
      leftBackData,
      this.currentIndex - 1
    );

    // Right leaf: front face shows page “currentIndex + 1”
    this._loadFace(
      this._rightLeaf.querySelector(".front"),
      rightFrontData,
      this.currentIndex + 1
    );
    // Right leaf: back face shows page “currentIndex + 2”
    this._loadFace(
      this._rightLeaf.querySelector(".back"),
      rightBackData,
      this.currentIndex + 2
    );
  }

  /**
   * @description Given a face element and its array of up to 9 img URLs, plus a pageNumber,
   *              populate the 3×3 grid.  If pageNumber ≤ 0, the label is blank.
   * @param {HTMLElement} faceEl
   * @param {Array<string>|undefined} cardUrls
   * @param {number} pageNumber
   */
  _loadFace(faceEl, cardUrls, pageNumber) {
    const pageLabel = faceEl.querySelector(".page-number");
    pageLabel.textContent = pageNumber > 0 ? `Page ${pageNumber}` : "";

    const container = faceEl.querySelector(".cards-container");
    container.innerHTML = "";

    // Normalize to array (or empty array)
    const urls = Array.isArray(cardUrls) ? cardUrls : [];

    for (let i = 0; i < 9; i++) {
      const slot = document.createElement("div");
      slot.className = "card-slot";

      if (urls[i]) {
        const img = document.createElement("img");
        img.src = urls[i];
        img.alt = "Pokemon card";
        img.addEventListener("click", () => this.showModal(img.src));
        slot.appendChild(img);
      }
      container.appendChild(slot);
    }
  }

  /**
   * @description Flip two pages forward (from currentIndex & currentIndex+1 to currentIndex+2 & +3)
   */
  flipForward() {
    // Preload the back face of the right leaf (which will become visible mid-flip)
    const nextBackData = this.pagesData.get(this.currentIndex + 2);
    this._loadFace(
      this._rightLeaf.querySelector(".back"),
      nextBackData,
      this.currentIndex + 2
    );

    this._rightLeaf.classList.add("flip-forward");
    this._rightLeaf.addEventListener(
      "transitionend",
      () => {
        this._rightLeaf.classList.remove("flip-forward");
        // Advance by two page-numbers
        this.currentIndex += 2;
        // Temporarily disable transition so we can re-render instantly
        const prevTransition = this._rightLeaf.style.transition;
        this._rightLeaf.style.transition = "none";
        this._renderFaces();
        // Force reflow then restore transition
        void this._rightLeaf.offsetWidth;
        this._rightLeaf.style.transition = prevTransition;
      },
      { once: true }
    );
  }

  /**
   * @description Flip two pages backward (from currentIndex & currentIndex−1 to currentIndex−2 & −3)
   */
  flipBackward() {
    if (this.currentIndex < 2) return; // nothing to flip if we're at page 0 or 1

    // Preload the back face of the left leaf (which reveals currentIndex−1)
    const prevBackData = this.pagesData.get(this.currentIndex - 1);
    this._loadFace(
      this._leftLeaf.querySelector(".back"),
      prevBackData,
      this.currentIndex - 1
    );

    this._leftLeaf.classList.add("flip-back");
    this._leftLeaf.addEventListener(
      "transitionend",
      () => {
        this._leftLeaf.classList.remove("flip-back");
        // Move back by two page-numbers
        this.currentIndex -= 2;
        const prevTransition = this._leftLeaf.style.transition;
        this._leftLeaf.style.transition = "none";
        this._renderFaces();
        void this._leftLeaf.offsetWidth;
        this._leftLeaf.style.transition = prevTransition;
      },
      { once: true }
    );
  }

  /**
   * @description Displays a modal with a larger view of the clicked card.
   * @param {string} imgSrc
   */
  showModal(imgSrc) {
    const oldModal = document.getElementById("global-pokemon-modal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.className = "card-modal";
    modal.id = "global-pokemon-modal";
    modal.innerHTML = `
      <section class="modal-content" role="dialog" aria-modal="true">
        <figure class="modal-image">
          <img class="modal-card" src="${imgSrc}" alt="Pokemon Card">
        </figure>
        <article class="modal-info">
          <h2 class="modal-name">Pikachu</h2>
          <ul class="modal-details">
            <li class="modal-type">Type: Electric</li>
            <li class="modal-hp">HP: 60</li>
            <li class="modal-rarity">Rarity: Common</li>
            <li class="modal-set">Set: Base</li>
          </ul>
        </article>
      </section>
    `;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
    setTimeout(() => {
      const modalCard = modal.querySelector(".modal-card");
      if (modalCard) {
        modalCard.addEventListener("click", () => this.toggleModal());
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

  /**
   * @description Opens a search modal to look up cards from the API and add them.
   */
  showAddCardModal() {
    const oldModal = document.getElementById("global-pokemon-modal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.className = "card-modal";
    modal.id = "global-pokemon-modal";
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
          <input id="cardSearchInput" type="text" placeholder="Enter Pokemon name" style="padding: 8px; width: 100%; box-sizing: border-box;" />
          <div id="cardSearchResult" style="
            margin-top: 16px; 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 50px;
            max-height:60vh;
            overflow-y: auto;">
          </div>
          <button id="confirmAddCardBtn" style="display: none; margin-top: 10px; padding: 8px 12px; background: #ffcb05; color: black; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Add to Binder</button>
        </article>
      </section>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    const input = modal.querySelector("#cardSearchInput");
    const resultBox = modal.querySelector("#cardSearchResult");
    const confirmBtn = modal.querySelector("#confirmAddCardBtn");
    let selectedCard = null;

    confirmBtn.addEventListener("click", () => {
      if (selectedCard && selectedCard.images?.small) {
        // Add to collection in localStorage or your data store
        if (window.addCardToCollection) {
          window.addCardToCollection({
            name: selectedCard.name,
            imgUrl: selectedCard.images.small,
            // You might assign default page/slot here or leave that to your binder-controller logic
          });
        }
        // Add to binder using binder-controller helper
        handleAddCard(selectedCard.images.small);
        // Refresh binder view
        const binderEl = document.querySelector("pokemon-binder");
        if (binderEl && window.getBinderPages) {
          binderEl.setPages(window.getBinderPages());
        }
        // If you have a separate collection component, refresh that too
        const collEl = document.querySelector("pokemon-collection");
        if (collEl && typeof collEl.render === "function") {
          collEl.render();
        }
        document.getElementById("global-pokemon-modal")?.remove();
      }
    });

    input.addEventListener("input", async (e) => {
      const query = e.target.value.trim();
      resultBox.innerHTML = '<p style="text-align:center;">Loading...</p>';

      try {
        const cards = await getCardsByName(query);
        resultBox.innerHTML = "";

        if (!cards.length) {
          resultBox.innerHTML = "<p>No cards found.</p>";
          return;
        }

        cards.forEach((card) => {
          const cardDiv = document.createElement("div");
          cardDiv.className = "card";
          Object.assign(cardDiv.style, {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "transform 0.2s ease, border 0.2s ease",
            maxWidth: "110px",
            margin: "auto",
            border: "2px solid transparent",
          });

          cardDiv.addEventListener("mouseover", () => {
            cardDiv.style.transform = "scale(1.05)";
          });
          cardDiv.addEventListener("mouseout", () => {
            cardDiv.style.transform = "scale(1)";
          });
          cardDiv.addEventListener("click", () => {
            resultBox
              .querySelectorAll(".card.selected")
              .forEach((el) => el.classList.remove("selected"));
            cardDiv.classList.add("selected");
            selectedCard = card;
            confirmBtn.style.display = "block";
          });

          const img = document.createElement("img");
          img.src = card.images.small;
          img.alt = card.name;
          Object.assign(img.style, {
            width: "100%",
            borderRadius: "6px",
          });

          const nameEl = document.createElement("div");
          nameEl.className = "card-name";
          nameEl.textContent = card.name;
          Object.assign(nameEl.style, {
            marginTop: "8px",
            fontWeight: "bold",
            fontSize: "12px",
            textAlign: "center",
            wordBreak: "break-word",
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
}

customElements.define("pokemon-binder", PokemonBinder);
