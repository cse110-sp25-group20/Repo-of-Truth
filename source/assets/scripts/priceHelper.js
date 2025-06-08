/**
 * Given a Poké TCG API card object, computes and formats the market‐price range
 * across all available pricing variants, or returns a fallback if none exist.
 *
 * @param {Object} fullCard
 *   The full card data as returned by the Poké TCG API.
 * @param {Object} [fullCard.tcgplayer]
 *   Optional TCGPlayer block containing pricing information.
 * @param {Object.<string, {market:number}>} [fullCard.tcgplayer.prices]
 *   An object whose keys are variant names (e.g. "normal", "reverseHolofoil")
 *   and whose values contain a `market` number.
 * @returns {string}
 *   A formatted price string:
 *     - `"$X.XX"` if all variants share the same market price,  
 *     - `"$X.XX – $Y.YY"` if there’s a range,  
 *     - `"Price unavailable"` if no data is present.
 */
export function formatMarketPrice(fullCard) {
  const prices = fullCard?.tcgplayer?.prices;
  if (!prices) return 'Price unavailable';

  const markets = Object.values(prices)
    .map(p => p.market)
    .filter(p => typeof p === 'number');

  if (markets.length === 0) {
    return 'Price unavailable';
  }

  const min = Math.min(...markets);
  const max = Math.max(...markets);

  return min === max
    ? `$${min.toFixed(2)}`
    : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
}