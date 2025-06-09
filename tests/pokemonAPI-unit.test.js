import {
  getCardsByName,
  getCardsByPage,
  getCardById,
  getCardsByNameAndNumber,
  getAllSets,
  getCardsBySet
} from '../source/js/pokemonAPI';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

// Helper to build a good mock response
function buildResponse(ok, data = {}, status = 200, statusText = "OK") {
  return {
    ok,
    status,
    statusText,
    text: async () => JSON.stringify(data),
    json: async () => data
  };
}

describe('Pokemon API', () => {
  test('getCardsByName returns cards array on success', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: [{ id: "abc" }] }));
    const result = await getCardsByName('pikachu');
    expect(result).toEqual([{ id: "abc" }]);
  });

  test('getCardsByName returns [] on bad data', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, {}));
    const result = await getCardsByName('pikachu');
    expect(result).toEqual([]);
  });

  test('getCardsByPage handles query params and returns cards', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: [{ id: "page1" }] }));
    const result = await getCardsByPage(1, 10);
    expect(result).toEqual([{ id: "page1" }]);
  });

  test('getCardsByPage handles undefined/null params', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: [{ id: "p1" }] }));
    const result = await getCardsByPage(1);
    expect(result).toEqual([{ id: "p1" }]);
  });

  test('getCardById returns card object on success', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: { id: 'xy1-1' } }));
    const result = await getCardById('xy1-1');
    expect(result).toEqual({ id: 'xy1-1' });
  });

  test('getCardById returns null on 404', async () => {
    mockFetch.mockRejectedValueOnce(new Error("404 Not Found"));
    const result = await getCardById('notreal-id');
    expect(result).toBeNull();
  });

  test('getCardById throws on non-404 error', async () => {
    mockFetch.mockRejectedValueOnce(new Error("500 Internal Server Error"));
    await expect(getCardById('xy1-1')).rejects.toThrow();
  });

  test('getCardsByNameAndNumber returns matches', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: [{ id: '123' }] }));
    const result = await getCardsByNameAndNumber('Charizard', 4);
    expect(result).toEqual([{ id: '123' }]);
  });

  test('getCardsByNameAndNumber throws on empty number', async () => {
    await expect(getCardsByNameAndNumber('Charizard', '   ')).rejects.toThrow();
  });

  test('getAllSets returns sets array', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: [{ id: "base1" }] }));
    const sets = await getAllSets();
    expect(sets).toEqual([{ id: "base1" }]);
  });

  test('getCardsBySet returns cards in set', async () => {
    mockFetch.mockResolvedValueOnce(buildResponse(true, { data: [{ id: 'card1' }] }));
    const cards = await getCardsBySet('base1');
    expect(cards).toEqual([{ id: 'card1' }]);
  });

  test('throws error when fetch fails entirely', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));
    await expect(getCardsByPage(1, 10)).rejects.toThrow('Network Error');
  });

  test('throws with invalid name param in getCardsByName', async () => {
    await expect(getCardsByName(null)).rejects.toThrow();
  });

  test('throws with invalid page param in getCardsByPage', async () => {
    await expect(getCardsByPage(0)).rejects.toThrow();
  });

  test('throws with invalid pageSize param in getCardsByPage', async () => {
    await expect(getCardsByPage(1, -5)).rejects.toThrow();
  });

  test('throws if id is invalid in getCardById', async () => {
    await expect(getCardById(null)).rejects.toThrow();
  });

  test('throws if setID is invalid in getCardsBySet', async () => {
    await expect(getCardsBySet(null)).rejects.toThrow();
  });
});
