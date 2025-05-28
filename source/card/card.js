const API_BASE = 'https://api.pokemontcg.io/v2';

/**
 * Builds a Lucene query for the Pokémon name, handling multi-word names.
 * @param {string} name
 * @returns {string} Query string for the API
 */
function buildNameQuery(name) {
  const trimmed = name.trim();
  if (!trimmed) return '';

  // If the name contains spaces, treat it as an exact phrase
  if (/\s/.test(trimmed)) {
    return `name:"${trimmed}"`;
  }

  // Single word: use wildcard for partial matches
  return `name:*${trimmed}*`;
}

// Function to fetch a card by ID
// async function getCardByID(cardId) {
//   const headers = API_KEY ? { "X-Api-Key": API_KEY } : {};
//   const query = encodeURIComponent(`name:*${cardId}*`);
//   const url = `${API_BASE}/${query}`;

//   const res = await fetch(url, {
//     headers,
//   });

//   if (!res.ok) {
//     throw new Error(`API error: ${res.status} ${res.statusText}`);
//   }

//   const data = await response.json();
//   return data.data;
// }

// Example usage
// getCard("base1-102")
//   .then((card) => {
//     console.log(card.name); // Mewtwo - Base Set 10/102
//   })
//   .catch((error) => {
//     console.error("Error fetching card:", error);
//   });

/**
 * Fetches all cards whose name matches (or contains) the given Pokémon name.
 * @param {string} pokemonName
 * @returns {Promise<Array>} Array of card objects
 */
async function getCardsByName(pokemonName) {
  const queryString = buildNameQuery(pokemonName);
  if (!queryString) return [];

  const qParam = encodeURIComponent(queryString);
  const url = `${API_BASE}/cards?q=${qParam}`;

  const res = await fetch(url, {
    headers: { 'X-Api-Key': API_KEY }
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const { data } = await res.json();
  return data;
}

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

