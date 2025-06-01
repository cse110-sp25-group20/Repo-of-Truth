import { getCardsByName, getCardById, getCardsByNameAndNumber } from "../api/pokemonAPI.js";

// test page is ./card-search-test.html
// demo to look up all cards by name, id, or name with number
// just a demo, if we want to use def needs to be refactored

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {

  const nameForm = document.getElementById('pokemon-name-form');
  const idForm = document.getElementById('pokemon-id-form');
  const resultsDiv = document.getElementById('results');

  nameForm.addEventListener('submit', async (e) => {
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

  idForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idInput = document.getElementById('pokemon-id').value.trim();
    resultsDiv.innerHTML = '<p>Loading...</p>';
    console.log("idValue:", idInput);

    try {
      const card = await getCardById(idInput);
      resultsDiv.innerHTML = '';

      if (card === null) {
        resultsDiv.innerHTML = '<p>No cards found.</p>';
        return;
      }

      // Display card
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
    } catch (err) {
      resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  });

  const nameAndNumberForm = document.getElementById('pokemon-name-number-form')

  nameAndNumberForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('pokemon-name-and').value.trim();
    const number = document.getElementById('pokemon-number').value.trim();
    resultsDiv.innerHTML = '<p>Loading...</p>';

    console.log("name:", name);
    console.log("number:", number);

    try {
      const cards = await getCardsByNameAndNumber(name, number);
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