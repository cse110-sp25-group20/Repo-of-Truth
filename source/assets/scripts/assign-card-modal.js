// assign-card-modal.js

/**
 * Displays a modal popup listing existing cards from localStorage for assignment.
 * @param {number} pageIndex - The index of the binder page.
 * @param {number} slotIndex - The index of the slot on the binder page.
 */
export function showAssignCardModal(pageIndex, slotIndex) {
  // Remove any previous instance
  const oldModal = document.getElementById('assign-card-modal');
  if (oldModal) oldModal.remove();

  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'card-modal';
  modal.id = 'assign-card-modal';
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
        <h2 class="modal-name">Assign Card to Slot</h2>
        <div id="assignCardResult" style="
          margin-top: 16px; 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 50px;
          max-height:60vh;
          overflow-y: auto;
          padding: 10px;
        "></div>
        <button id="confirmAssignCardBtn" style="display: none; margin-top: 10px; padding: 8px 12px; background: #ffcb05; color: black; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Add to Slot</button>
      </article>
    </section>
  `;

  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const resultBox = modal.querySelector('#assignCardResult');
  const confirmBtn = modal.querySelector('#confirmAssignCardBtn');
  let selectedCard = null;
  let selectedIndex = null;

  // Load collection from localStorage
  const COLLECTION_STORAGE_KEY = 'pokemonCollection';
  const collection = JSON.parse(localStorage.getItem(COLLECTION_STORAGE_KEY)) || [];

  // Render existing cards as selectable thumbnails
  collection.forEach((card, idx) => {
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

    // Hover scaling
    cardDiv.addEventListener('mouseover', () => {
      cardDiv.style.transform = 'scale(1.05)';
    });
    cardDiv.addEventListener('mouseout', () => {
      cardDiv.style.transform = 'scale(1)';
    });

    // Selection handling
    cardDiv.addEventListener('click', () => {
      resultBox.querySelectorAll('.card.selected').forEach(el => el.classList.remove('selected'));
      cardDiv.classList.add('selected');
      selectedCard = card;
      selectedIndex = idx;
      confirmBtn.style.display = 'block';
    });

    // Thumbnail image
    const img = document.createElement('img');
    img.src = card.imgUrl || card.images?.small;
    img.alt = card.name;
    Object.assign(img.style, {
      width: '100%',
      borderRadius: '6px',
    });

    // Name label
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

  // Confirm assignment
  confirmBtn.addEventListener('click', () => {
    if (selectedCard !== null && selectedIndex !== null) {
      // Update the selected card's page and slot indices
      collection[selectedIndex] = {
        ...collection[selectedIndex],
        page: pageIndex,
        slot: slotIndex,
      };
      // Persist changes
      localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
      // Close modal
      document.getElementById('assign-card-modal')?.remove();
    }
  });
}
