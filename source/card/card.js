import { getCardsByName, getCardById } from "../api/pokemonAPI.js";

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pokemon-form');
  const resultsDiv = document.getElementById('results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('pokemon-name').value.trim();
    resultsDiv.innerHTML = '<p>Loading...</p>';

    try {
      const cards = await getCardsByName(nameInput);
      resultsDiv.innerHTML = '';

      if (cards.length === 0) {
        resultsDiv.innerHTML = '<p>No cards found.</p>';
        return;
      }

      // Display each card
      cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        const img = document.createElement('img');
        img.src = card.images.small;
        img.alt = card.name;

        const nameEl = document.createElement('div');
        nameEl.className = 'card-name';
        nameEl.textContent = card.name;

        cardDiv.appendChild(img);
        cardDiv.appendChild(nameEl);
        resultsDiv.appendChild(cardDiv);
      });
    } catch (err) {
      resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  });
});