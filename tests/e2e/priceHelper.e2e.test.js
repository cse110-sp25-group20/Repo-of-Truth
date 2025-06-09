import { formatMarketPrice } from '../../source/assets/scripts/priceHelper.js';

describe('formatMarketPrice', () => {
  test('returns "Price unavailable" if no tcgplayer or prices', () => {
    expect(formatMarketPrice({})).toBe('Price unavailable');
    expect(formatMarketPrice({ tcgplayer: null })).toBe('Price unavailable');
    expect(formatMarketPrice({ tcgplayer: {} })).toBe('Price unavailable');
  });

  test('returns "Price unavailable" if prices object has no numeric market values', () => {
    const card = {
      tcgplayer: {
        prices: {
          normal: { market: null },
          holo: {},
          reverseHolofoil: { market: 'N/A' }
        }
      }
    };
    expect(formatMarketPrice(card)).toBe('Price unavailable');
  });

  test('returns single price string if all variants share same market price', () => {
    const card = {
      tcgplayer: {
        prices: {
          normal: { market: 3.5 },
          holo: { market: 3.5 },
          reverseHolofoil: { market: 3.5 }
        }
      }
    };
    expect(formatMarketPrice(card)).toBe('$3.50');
  });

  test('returns price range string if variants have different prices', () => {
    const card = {
      tcgplayer: {
        prices: {
          normal: { market: 2.75 },
          holo: { market: 5.5 },
          reverseHolofoil: { market: 4.0 }
        }
      }
    };
    expect(formatMarketPrice(card)).toBe('$2.75 – $5.50');
  });

  test('ignores non-numeric market values and calculates range from valid ones', () => {
    const card = {
      tcgplayer: {
        prices: {
          normal: { market: 1.0 },
          holo: { market: 'unknown' },
          reverseHolofoil: { market: 2.5 }
        }
      }
    };
    expect(formatMarketPrice(card)).toBe('$1.00 – $2.50');
  });
});