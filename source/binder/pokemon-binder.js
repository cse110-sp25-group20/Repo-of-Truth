// pokemon-binder.js
const template = document.createElement('template');
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
      z-index: 1; /* base stacking */
    }
    /* bring flipping leaf above sibling */
    .leaf.flip-forward,
    .leaf.flip-back {
      z-index: 2;
    }
    /* flip forward: right leaf rotates away */
    .leaf.flip-forward {
      transform-origin: left center;
      transform: rotateY(-180deg);
    }
    /* flip backward: left leaf rotates away */
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
      background: #fff; /* ensure solid background during overlap */
    }
    .page.back {
      transform: rotateY(180deg);
    }
    /* hide page number on back face until leaf flips */
    .page.back .page-number {
      transform: rotateY(180deg); /* keep upright when visible */
      visibility: hidden;
    }
    .leaf.flip-forward .page.back .page-number,
    .leaf.flip-back .page.back .page-number {
      visibility: visible;
    }
    .page-number {
      font-size: 14px;
      text-align: center;
      margin-bottom: 10px;
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
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.pagesData = [];
    this.currentIndex = 0;
    this._leftLeaf = this.shadowRoot.querySelector('.left-leaf');
    this._rightLeaf = this.shadowRoot.querySelector('.right-leaf');
    this._renderFaces();
  }

  setPages(pages) {
    if (!Array.isArray(pages)) return;
    this.pagesData = pages;
    this.currentIndex = 0;
    this._renderFaces();
  }

  _renderFaces() {
    // left leaf
    this._loadFace(
      this._leftLeaf.querySelector('.front'),
      this.pagesData[this.currentIndex],
      this.currentIndex + 1
    );
    this._loadFace(
      this._leftLeaf.querySelector('.back'),
      this.pagesData[this.currentIndex - 1],
      this.currentIndex
    );
    // right leaf
    this._loadFace(
      this._rightLeaf.querySelector('.front'),
      this.pagesData[this.currentIndex + 1],
      this.currentIndex + 2
    );
    this._loadFace(
      this._rightLeaf.querySelector('.back'),
      this.pagesData[this.currentIndex + 2],
      this.currentIndex + 3
    );
  }

  _loadFace(faceEl, cardUrls, pageNumber) {
    faceEl.querySelector('.page-number').textContent =
      pageNumber ? `Page ${pageNumber}` : '';
    const container = faceEl.querySelector('.cards-container');
    container.innerHTML = '';
    const urls = Array.isArray(cardUrls) ? cardUrls : [];
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('div');
      slot.className = 'card-slot';
      if (urls[i]) {
        const img = document.createElement('img');
        img.src = urls[i];
        img.alt = 'Pokemon card';
        slot.appendChild(img);
      }
      container.appendChild(slot);
    }
  }

  flipForward() {
    this._loadFace(
      this._rightLeaf.querySelector('.back'),
      this.pagesData[this.currentIndex + 2],
      this.currentIndex + 3
    );
    this._rightLeaf.classList.add('flip-forward');
    this._rightLeaf.addEventListener(
      'transitionend',
      () => {
        this._rightLeaf.classList.remove('flip-forward');
        this.currentIndex += 2;
        const prev = this._rightLeaf.style.transition;
        this._rightLeaf.style.transition = 'none';
        this._renderFaces();
        void this._rightLeaf.offsetWidth;
        this._rightLeaf.style.transition = prev;
      },
      { once: true }
    );
  }

  flipBackward() {
    if (this.currentIndex < 2) return;
    this._loadFace(
      this._leftLeaf.querySelector('.back'),
      this.pagesData[this.currentIndex - 1],
      this.currentIndex
    );
    this._leftLeaf.classList.add('flip-back');
    this._leftLeaf.addEventListener(
      'transitionend',
      () => {
        this._leftLeaf.classList.remove('flip-back');
        this.currentIndex -= 2;
        const prev = this._leftLeaf.style.transition;
        this._leftLeaf.style.transition = 'none';
        this._renderFaces();
        void this._leftLeaf.offsetWidth;
        this._leftLeaf.style.transition = prev;
      },
      { once: true }
    );
  }
}

customElements.define('pokemon-binder', PokemonBinder);
