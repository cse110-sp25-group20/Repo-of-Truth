/**
 * @jest-environment jsdom
 */

import { describe, test, expect } from '@jest/globals';
import { formatMarketPrice } from '../source/assets/scripts/priceHelper.js';


describe('formatMarketPrice', () => {

  test('returns "Price unavailable" if no prices exist', () => {
    expect(formatMarketPrice({})).toBe('Price unavailable');
    expect(formatMarketPrice({ tcgplayer: {} })).toBe('Price unavailable');
    expect(formatMarketPrice({ tcgplayer: { prices: undefined } })).toBe('Price unavailable');
  });

  test('returns "Price unavailable" if all market prices are missing', () => {
    const card = { tcgplayer: { prices: { normal: {}, holo: {} } } };
    expect(formatMarketPrice(card)).toBe('Price unavailable');
  });

  test('returns "$X.XX" if all market prices are the same', () => {
    const card = { tcgplayer: { prices: { normal: { market: 2.5 }, holo: { market: 2.5 } } } };
    expect(formatMarketPrice(card)).toBe('$2.50');
  });

  test('returns "$X.XX – $Y.YY" if there is a price range', () => {
    const card = { tcgplayer: { prices: { normal: { market: 1.5 }, holo: { market: 3.25 } } } };
    expect(formatMarketPrice(card)).toBe('$1.50 – $3.25');
  });
});