// Configuration: base URL and API key
const BASE_URL = "https://api.pokemontcg.io/v2";
// require('dotenv').config();
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) {
//   throw new Error("Missing API_KEY - check your .env or environment");
// }
const API_KEY = "__API_KEY__";
export default API_KEY;

// Build a headers object that all requests share
function defaultHeaders() {
  return {
    "X-Api-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

// Helper to do GET requests and parse JSON (not to be exported)
async function _fetchJson(endpoint, params = {}) {
  // endpoint is a string like "/cards" or "/cards/{id}"
  const url = new URL(BASE_URL + endpoint);

  // If params = { q: 'name:pikachu' }, this turns into ?q=name:pikachu
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: defaultHeaders(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Pokémon TCG API error: ${response.status} ${response.statusText} - ${errText}`
    );
  }

  const json = await response.json();
  return json;
}

// ----------- Exported Functions for Interacting with API -------------

/**
 * Search for cards by (partial) name.
 * @param {string} name  - e.g. "pikachu" or "charizard".
 * @returns {Promise<Array<object>>}  - Resolves to an array of card objects, or [] if none.
 */
export async function getCardsByName(name) {
  if (!name || typeof name !== "string") {
    throw new Error("getCardsByName: name must be a non-empty string.");
  }

  // According to the Pokémon TCG docs, to search by name you do:
  // GET /v2/cards?q=name:[searchTerm]
  const trimmed = name.trim(); 
  const query = `name:"${trimmed}"`; // Using Pokemon TCG API syntax allowing for words with spaces

  // _fetchJson returns an object { data: [ …card objects… ], page, pageSize, count, … }
  const result = await _fetchJson("/cards", { q: query });

  // result.data might be undefined or not an array if something goes wrong
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Fetches a specific page of Pokémon cards from the TCG API.
 * @param {number} [page=1] - 1-indexed page number (must be ≥ 1).
 * @param {number} [pageSize=20] - Number of cards per page (must be ≥ 1).
 * @returns {Promise<Array>} Array of card objects for the given page.
 */
export async function getCardsByPage(page = 1, pageSize = 20) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("getCardsByPage: page must be a positive integer.");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new Error("getCardsByPage: pageSize must be a positive integer.");
  }

  // _fetchJson calls your API at `/cards` with the given query params
  const result = await _fetchJson("/cards", { page, pageSize });

  // Return just the array of cards (or empty array if something went wrong)
  return Array.isArray(result.data) ? result.data : [];
}


/**
 * Get a single card by its exact ID.
 * @param {string} id  - the card’s “id” field, e.g. "XY7-54" (set-number)
 * @returns {Promise<object|null>} - Resolves to the card object, or null if not found.
 */
export async function getCardById(id) {
  if (!id || typeof id !== "string") {
    throw new Error("getCardById: id must be a non-empty string.");
  }

  // Endpoint: GET /v2/cards/{id}
  try {
    const result = await _fetchJson(`/cards/${encodeURIComponent(id)}`);
    // result.data is a single card object
    return result.data || null;
  } catch (err) {
    if (err.message.includes("404")) {
      return null; // Not found
    }
    throw err; // Some other error
  }
}


/**
 * Search for a card by (partial) name and exact number.
 * @param {string} name   – e.g. "Charizard"
 * @param {string|number} number – e.g. "4" or 4
 * @returns {Promise<Array<object>>}
 */
export async function getCardsByNameAndNumber(name, number) {
  if (!name || !number) {
    throw new Error("getCardsByNameAndNumber: both name and number are required");
  }

  // build the name part (wrap multi-word in quotes, wildcard single words):
  const trimmed = name.trim();
  const nameQuery = /\s/.test(trimmed)
    ? `name:"${trimmed}"`
    : `name:*${trimmed}*`;

  // force number to string and escape:
  const numStr = String(number).trim();
  if (!numStr) {
    throw new Error("getCardsByNameAndNumber: number must be a non-empty string or number");
  }
  const numberQuery = `number:"${encodeURIComponent(numStr)}"`;

  // combine with a space (Lucene AND)
  const lucene = `${nameQuery} ${numberQuery}`;

  const result = await _fetchJson("/cards", { q: lucene });
  return Array.isArray(result.data) ? result.data : [];
}


/**
 * Get a list of all sets.
 * @returns {Promise<Array<object>>} - Array of set objects { id, name, series, … }.
 */
export async function getAllSets() {
  const result = await _fetchJson("/sets");
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Get all cards in the set with the set ID.
 * @param {string} setID  – e.g. "base1" or "base2"
 * @returns {Promise<Array<object>>}  – Array of card objects
 */
export async function getCardsBySet(setID) {
  if (!setID || typeof setID !== "string") {
    throw new Error("getCardsBySet: setID must be a valid string.");
  }

  const result = await _fetchJson("/cards", {
    q: `set.id:${encodeURIComponent(setID)}`,
    pageSize: 250
  });

  return Array.isArray(result.data) ? result.data : [];
}


// More functions should be added as needed: getCardsByType(type), getCardsBySet(setId), etc.
// Just follow the pattern: call _fetchJson(endpoint, params) and return result.data.