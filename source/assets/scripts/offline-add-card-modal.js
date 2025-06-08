// assets/scripts/offlineAddCardModal.js

import { offlineCards } from "../offline/offline-cards.js";

/**
 * Displays a modal popup listing offline card subset to add to collection or binder.
 * 
 * - Allows user to choose from pre-defined offline cards.
 * - Supports selection, preview, and confirmation to add.
 * - Persists selection to localStorage and updates collection/binder views.
 * 
 * @param {('binder'|'collection')} context - Determines whether the selected card is added to the binder or the collection.
 * @returns {void}
 */
export function showOfflineAddCardModal(context) {
  // Remove any existing modal from the DOM
  const old = document.getElementById('offline-pokemon-modal');
  if (old) old.remove();

  // Validate and fetch offline cards
  const cards = Array.isArray(offlineCards) ? offlineCards : [];

  // Create modal container and structure
  const modal = document.createElement('div');
  modal.className = 'card-modal';
  modal.id = 'offline-pokemon-modal';
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
      <article class="modal-info" style="flex:1;">
        <h2 class="modal-name">Add an Offline Card</h2>
        <div id="offlineCardList" style="
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-height: 60vh;
          overflow-y: auto;
          padding: 10px;
        "></div>
        <button id="confirmOfflineAddBtn" style="display:none; margin-top:10px; padding:8px 12px; background:#ffcb05; color:black; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">
          Add Card
        </button>
      </article>
    </section>
  `;
  document.body.appendChild(modal);

  // Dismiss modal on background click
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });

  const listEl = modal.querySelector('#offlineCardList');
  const confirmBtn = modal.querySelector('#confirmOfflineAddBtn');
  let selected = null;

  /**
   * Renders the list of offline cards for selection.
   * Each card is selectable, displaying its image and name.
   */
  cards.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    Object.assign(div.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      maxWidth: '100px',
      margin: 'auto',
    });

    // Thumbnail image
    const img = document.createElement('img');
    img.src = card.imgPath;
    img.alt = card.name;
    Object.assign(img.style, { width: '100%', borderRadius: '6px' });

    // Name label
    const label = document.createElement('div');
    label.textContent = card.name;
    Object.assign(label.style, {
      marginTop: '6px', fontWeight: 'bold', fontSize: '12px', textAlign: 'center', wordBreak: 'break-word'
    });

    div.append(img, label);

    // Handle selection
    div.addEventListener('click', () => {
      listEl.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      selected = card;
      confirmBtn.style.display = 'block';
    });

    listEl.appendChild(div);
  });

  /**
   * Finalizes adding the selected offline card to localStorage.
   * Updates collection or binder based on current context.
   */
  confirmBtn.addEventListener('click', () => {
    if (!selected) return;

    const collectionKey = 'pokemonCollection';
    const stored = JSON.parse(localStorage.getItem(collectionKey)) || [];

    // Store card in localStorage
    stored.push({ name: selected.name, imgUrl: selected.imgPath });
    localStorage.setItem(collectionKey, JSON.stringify(stored));

    // Optionally trigger global card handling hooks
    if (window.addCardToCollection) {
      window.addCardToCollection({ name: selected.name, imgUrl: selected.imgPath });
    }
    if (context === 'binder' && window.handleAddCard) {
      window.handleAddCard(selected.imgPath);
    }

    // Refresh UI views
    const collEl = document.querySelector('pokemon-collection');
    if (collEl?.render) collEl.render();
    const binderEl = document.querySelector('pokemon-binder');
    if (binderEl?.setPages && window.getBinderPages) {
      binderEl.setPages(window.getBinderPages());
    }

    modal.remove();
  });
}
