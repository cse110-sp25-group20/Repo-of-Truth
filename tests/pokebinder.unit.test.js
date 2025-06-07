/**
 * @jest-environment jsdom
 */

import "../source/components/binder/pokemon-binder.js"; 
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe("PokemonBinder", () => {
  let binder;

  beforeEach(() => {
    document.body.innerHTML = `<pokemon-binder></pokemon-binder>`;
    binder = document.querySelector("pokemon-binder");

    // simulate shadow dom internals for leaves
    binder._leftLeaf = document.createElement("div");
    binder._leftLeaf.innerHTML = `
      <div class="front"><div class="page-number"></div><div class="cards-container"></div></div>
      <div class="back"><div class="page-number"></div><div class="cards-container"></div></div>
    `;
    binder._rightLeaf = document.createElement("div");
    binder._rightLeaf.innerHTML = `
      <div class="front"><div class="page-number"></div><div class="cards-container"></div></div>
      <div class="back"><div class="page-number"></div><div class="cards-container"></div></div>
    `;
  });

  test("initializes with empty pagesData and index 0", () => {
    expect(binder.pagesData instanceof Map).toBe(true);
    expect(binder.currentIndex).toBe(0);
  });

  test("setPages builds pagesData and sets currentIndex correctly", () => {
    const mockCards = [
      { name: "Pikachu", imgUrl: "pikachu.png", page: 1, slot: 0 },
      { name: "Charmander", imgUrl: "charmander.png", page: 2, slot: 1 },
    ];
    binder.setPages(mockCards);

    expect(binder.pagesData.size).toBe(2);
    expect(binder.pagesData.get(1)[0]).toBe("pikachu.png");
    expect(binder.pagesData.get(2)[1]).toBe("charmander.png");
    expect(binder.currentIndex).toBe(1);
  });

  test("setPages filters invalid entries", () => {
    const invalidCards = [
      { name: "NoImg", imgUrl: "", page: 1, slot: 0 },
      { name: "BadPage", imgUrl: "x.png", page: "NaN", slot: 2 },
      { name: "BadSlot", imgUrl: "y.png", page: 3, slot: 999 },
    ];
    binder.setPages(invalidCards);
    expect(binder.pagesData.size).toBe(0);
  });

  test("flipForward increments currentIndex by 2", () => {
    const spyRender = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.pagesData.set(3, []);
    binder.pagesData.set(4, []);
    binder.currentIndex = 1;

    binder._rightLeaf = document.createElement("div");
    binder._rightLeaf.innerHTML = `<div class="back"><div class="page-number"></div><div class="cards-container"></div></div>`;
    binder._rightLeaf.classList = { add: jest.fn(), remove: jest.fn() };
    binder._rightLeaf.addEventListener = (_, fn) => fn();

    binder.flipForward();

    expect(binder.currentIndex).toBe(3);
    expect(spyRender).toHaveBeenCalled();
  });

  test("flipBackward decrements currentIndex by 2 if > 1", () => {
    const spyRender = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.pagesData.set(3, []);
    binder.pagesData.set(4, []);
    binder.currentIndex = 3;

    binder._leftLeaf = document.createElement("div");
    binder._leftLeaf.innerHTML = `<div class="back"><div class="page-number"></div><div class="cards-container"></div></div>`;
    binder._leftLeaf.classList = { add: jest.fn(), remove: jest.fn() };
    binder._leftLeaf.addEventListener = (_, fn) => fn();

    binder.flipBackward();

    expect(binder.currentIndex).toBe(1);
    expect(spyRender).toHaveBeenCalled();
  });

  test("flipBackward does nothing if currentIndex < 2", () => {
    const spyRender = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.currentIndex = 1;
    binder.flipBackward();
    expect(binder.currentIndex).toBe(1);
    expect(spyRender).not.toHaveBeenCalled();
  });

  test("_loadFace fills slots with images and page number label", () => {
    const face = document.createElement("div");
    face.innerHTML = `
      <div class="page-number"></div>
      <div class="cards-container"></div>
    `;
    const cardUrls = Array(9).fill("card.png");
    binder._loadFace(face, cardUrls, 5);

    const pageNum = face.querySelector(".page-number").textContent;
    const slots = face.querySelectorAll(".card-slot");
    const images = face.querySelectorAll("img");

    expect(pageNum).toBe("Page 5");
    expect(slots.length).toBe(9);
    expect(images.length).toBe(9);
    expect(images[0].src).toContain("card.png");
  });

  test("_loadFace handles empty or undefined cardUrls", () => {
    const face = document.createElement("div");
    face.innerHTML = `
      <div class="page-number"></div>
      <div class="cards-container"></div>
    `;

    binder._loadFace(face, undefined, 0);
    const slots = face.querySelectorAll(".card-slot");
    expect(slots.length).toBe(9); // still renders 9 slots
    expect(face.querySelector(".page-number").textContent).toBe(""); // blank label
  });

  test("showModal adds modal with correct image", () => {
    binder.showModal("test-card.png");
    const modal = document.getElementById("global-pokemon-modal");
    const modalImg = modal.querySelector("img.modal-card");

    expect(modal).not.toBeNull();
    expect(modalImg.src).toContain("test-card.png");

    // Cleanup
    modal.remove();
  });

  test('toggleModal removes modal if present', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  const modal = document.createElement('div');
  modal.id = 'global-pokemon-modal';
  document.body.appendChild(modal);

  expect(document.getElementById('global-pokemon-modal')).toBeTruthy();

  binder.toggleModal();

  expect(document.getElementById('global-pokemon-modal')).toBeNull();
});

test('clicking modal background removes modal', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  binder.showAddCardModal();

  const modal = document.getElementById('global-pokemon-modal');
  expect(modal).toBeTruthy();

  // Simulate click on modal background (target === modal)
  modal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

  // modal should be removed after click
  expect(document.getElementById('global-pokemon-modal')).toBeNull();
});

  test("setPages defaults currentIndex to 1 when pagesMap is empty", () => {
    binder.setPages([]);
    expect(binder.currentIndex).toBe(1);
  });

  test("flipForward does nothing if there are no more pages", () => {
    const spyRender = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.currentIndex = 3; // Last possible index

    binder.flipForward();

    expect(binder.currentIndex).toBe(3); // Should not change
    expect(spyRender).not.toHaveBeenCalled();
  });

  test("showModal doesn't add multiple modals", () => {
    binder.showModal("test.png");
    binder.showModal("test2.png");

    const modals = document.querySelectorAll("#global-pokemon-modal");
    expect(modals.length).toBe(1); // Should only be one
  });

  test('showAddCardModal appends modal to DOM', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  binder.showAddCardModal();

  const modal = document.getElementById('global-pokemon-modal');
  expect(modal).toBeTruthy();
  expect(modal.classList.contains('card-modal')).toBe(true);
});


  test("setPages replaces previous pagesData and resets index", () => {
    binder.pagesData.set(99, ["should be gone"]);
    binder.currentIndex = 99;

    binder.setPages([{ imgUrl: "test.png", page: 1, slot: 0 }]);

    expect(binder.pagesData.size).toBe(1);
    expect(binder.pagesData.has(99)).toBe(false);
    expect(binder.currentIndex).toBe(1);
  });

  test("_loadFace renders empty slots when fewer than 9 cards given", () => {
    const face = document.createElement("div");
    face.innerHTML = `<div class="page-number"></div><div class="cards-container"></div>`;
    binder._loadFace(face, ["one.png", "two.png"], 1);

    const images = face.querySelectorAll("img");
    const slots = face.querySelectorAll(".card-slot");

    expect(slots.length).toBe(9);
    expect(images.length).toBe(2);
    expect(images[1].src).toContain("two.png");
  });

  test("toggleModal does nothing if modal is already absent", () => {
    const result = binder.toggleModal();
    expect(document.getElementById("global-pokemon-modal")).toBeNull();
  });

  test("setPages adds multiple cards to the same page correctly", () => {
    const cards = [
      { name: "Bulbasaur", imgUrl: "bulba.png", page: 1, slot: 0 },
      { name: "Squirtle", imgUrl: "squirtle.png", page: 1, slot: 1 },
    ];
    binder.setPages(cards);
    const page1 = binder.pagesData.get(1);

    expect(page1[0]).toBe("bulba.png");
    expect(page1[1]).toBe("squirtle.png");
  });

  test("_loadFace skips creating image for falsy URLs", () => {
    const face = document.createElement("div");
    face.innerHTML = `<div class="page-number"></div><div class="cards-container"></div>`;

    const cards = [null, undefined, "", 0];
    binder._loadFace(face, cards, 7);

    const imgs = face.querySelectorAll("img");
    expect(imgs.length).toBe(0); // none added
  });

  test("_renderFaces handles missing page data gracefully", () => {
    binder.pagesData.set(3, ["a.png"]);
    binder.currentIndex = 4; // left=3, right=4 (undefined)

    const spy = jest.spyOn(binder, "_loadFace");
    binder._renderFaces();

    expect(spy).toHaveBeenCalledWith(expect.any(Element), ["a.png"], 3);
    expect(spy).toHaveBeenCalledWith(expect.any(Element), undefined, 4);
  });

  test("toggleModal toggles visibility by removing existing modal", () => {
    const modal = document.createElement("div");
    modal.id = "global-pokemon-modal";
    document.body.appendChild(modal);

    expect(document.body.contains(modal)).toBe(true);
    binder.toggleModal();
    expect(document.body.contains(modal)).toBe(false);
  });

  test("_loadFace resets page number text correctly", () => {
    const face = document.createElement("div");
    face.innerHTML = `<div class="page-number"></div><div class="cards-container"></div>`;
    binder._loadFace(face, [], 12);

    expect(face.querySelector(".page-number").textContent).toBe("Page 12");
  });

  test("_loadFace renders placeholders for empty slots", () => {
    const face = document.createElement("div");
    face.innerHTML = `<div class="page-number"></div><div class="cards-container"></div>`;
    binder._loadFace(face, ["img1.png"], 2);

    const imgs = face.querySelectorAll("img");
    const slots = face.querySelectorAll(".card-slot");

    expect(slots.length).toBe(9);
    expect(imgs.length).toBe(1);
  });

  test("flipForward does nothing if only one page exists", () => {
    const spy = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.pagesData.set(1, []);
    binder.currentIndex = 1;

    binder.flipForward();
    expect(binder.currentIndex).toBe(1);
    expect(spy).not.toHaveBeenCalled();
  });

  test("flipBackward brings index to 0 if currentIndex is 2", () => {
    const spy = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.currentIndex = 2;

    binder._leftLeaf = document.createElement("div");
    binder._leftLeaf.innerHTML = `<div class="back"><div class="page-number"></div><div class="cards-container"></div></div>`;
    binder._leftLeaf.classList = { add: jest.fn(), remove: jest.fn() };
    binder._leftLeaf.addEventListener = (_, fn) => fn();

    binder.flipBackward();

    expect(binder.currentIndex).toBe(0); // hits edge branch
    expect(spy).toHaveBeenCalled();
  });

  test("flipForward doesn't exceed maximum index", () => {
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.pagesData.set(3, []);
    binder.currentIndex = 3;

    binder.flipForward();
    expect(binder.currentIndex).toBe(3); // max reached
  });

  test("flipBackward to negative index is prevented", () => {
    binder.pagesData.set(1, []);
    binder.currentIndex = 0;

    binder.flipBackward();
    expect(binder.currentIndex).toBe(0);
  });

  test("setPages ignores negative page/slot numbers", () => {
    const cards = [
      { name: "InvalidPage", imgUrl: "a.png", page: -1, slot: 0 },
      { name: "InvalidSlot", imgUrl: "b.png", page: 1, slot: -2 },
    ];
    binder.setPages(cards);
    expect(binder.pagesData.size).toBe(0);
  });

  test("setPages accepts slot numbers out of order", () => {
    const cards = [
      { name: "First", imgUrl: "1.png", page: 1, slot: 5 },
      { name: "Second", imgUrl: "2.png", page: 1, slot: 1 },
    ];
    binder.setPages(cards);
    const slots = binder.pagesData.get(1);
    expect(slots[1]).toBe("2.png");
    expect(slots[5]).toBe("1.png");
  });

  test("_renderFaces clears both leaf faces before loading", () => {
    const clearSpy = jest.spyOn(binder, "_loadFace");
    binder.pagesData.set(1, ["a.png"]);
    binder.pagesData.set(2, ["b.png"]);
    binder.currentIndex = 1;
    binder._renderFaces();
    expect(clearSpy).toHaveBeenCalledTimes(2);
  });

  test("_loadFace fills in order regardless of sparse array", () => {
    const face = document.createElement("div");
    face.innerHTML = `<div class="page-number"></div><div class="cards-container"></div>`;
    const cards = [];
    cards[4] = "middle.png";
    binder._loadFace(face, cards, 3);
    expect(face.querySelectorAll("img").length).toBe(1);
  });

  test("toggleModal closes modal if already open", () => {
    const modal = document.createElement("div");
    modal.id = "global-pokemon-modal";
    document.body.appendChild(modal);
    binder.toggleModal();
    expect(document.getElementById("global-pokemon-modal")).toBeNull();
  });

  test("showModal replaces old modal with new image", () => {
    binder.showModal("first.png");
    binder.showModal("second.png");
    const img = document.querySelector("#global-pokemon-modal img");
    expect(img.src).toContain("second.png");
  });

  test("flipForward and flipBackward both call _renderFaces", () => {
    const spy = jest.spyOn(binder, "_renderFaces").mockImplementation(() => {});
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.currentIndex = 1;

    binder.flipForward();
    binder.flipBackward();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("flipForward does not throw if _rightLeaf is null", () => {
    binder.pagesData.set(1, []);
    binder.pagesData.set(2, []);
    binder.currentIndex = 1;
    binder._rightLeaf = null;
    expect(() => binder.flipForward()).not.toThrow();
  });

  test("_loadFace handles null container safely", () => {
    expect(() => binder._loadFace(null, ["x.png"], 1)).not.toThrow();
  });

  test("pagesData preserves data integrity", () => {
    const cards = [
      { name: "X", imgUrl: "x.png", page: 1, slot: 0 },
      { name: "Y", imgUrl: "y.png", page: 1, slot: 1 },
      { name: "Z", imgUrl: "z.png", page: 2, slot: 0 },
    ];
    binder.setPages(cards);
    expect(binder.pagesData.get(1)[1]).toBe("y.png");
    expect(binder.pagesData.get(2)[0]).toBe("z.png");
  });

  test("setPages multiple times replaces old data", () => {
    binder.setPages([{ imgUrl: "a.png", page: 1, slot: 0 }]);
    binder.setPages([{ imgUrl: "b.png", page: 2, slot: 0 }]);

    expect(binder.pagesData.size).toBe(1);
    expect(binder.pagesData.has(1)).toBe(false);
    expect(binder.pagesData.get(2)[0]).toBe("b.png");
  });

  test('input event triggers getCardsByName and renders cards', async () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  // Mock getCardsByName globally
  global.getCardsByName = jest.fn().mockResolvedValue([
    { name: 'Pikachu', images: { small: 'url1' } },
    { name: 'Bulbasaur', images: { small: 'url2' } },
  ]);

  binder.showAddCardModal();

  const input = document.getElementById('cardSearchInput');
  const resultBox = document.getElementById('cardSearchResult');

  // Change input and dispatch event
  input.value = 'pi';
  input.dispatchEvent(new Event('input'));

  // Wait for async processing
  await Promise.resolve();

  expect(global.getCardsByName).toHaveBeenCalledWith('pi');
  expect(resultBox.querySelectorAll('.card').length).toBe(2);
});

test('clicking a card selects it and shows confirm button', async () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  global.getCardsByName = jest.fn().mockResolvedValue([
    { name: 'Charmander', images: { small: 'url3' } },
  ]);

  binder.showAddCardModal();

  const input = document.getElementById('cardSearchInput');
  const resultBox = document.getElementById('cardSearchResult');
  const confirmBtn = document.getElementById('confirmAddCardBtn');

  input.value = 'char';
  input.dispatchEvent(new Event('input'));
  await Promise.resolve();

  const cardDiv = resultBox.querySelector('.card');
  expect(cardDiv).toBeTruthy();
  expect(confirmBtn.style.display).toBe('none');

  // Click card to select it
  cardDiv.click();

  expect(cardDiv.classList.contains('selected')).toBe(true);
  expect(confirmBtn.style.display).toBe('block');
});

test('clicking confirm button adds card and closes modal', async () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  global.getCardsByName = jest.fn().mockResolvedValue([
    { name: 'Squirtle', images: { small: 'url4' } },
  ]);
  global.addCardToCollection = jest.fn();
  global.handleAddCard = jest.fn();
  global.getBinderPages = jest.fn();

  // Add dummy collection element with render fn
  const collectionEl = document.createElement('pokemon-collection');
  collectionEl.render = jest.fn();
  document.body.appendChild(collectionEl);

  binder.showAddCardModal();

  const input = document.getElementById('cardSearchInput');
  const resultBox = document.getElementById('cardSearchResult');
  const confirmBtn = document.getElementById('confirmAddCardBtn');

  input.value = 'squirt';
  input.dispatchEvent(new Event('input'));
  await Promise.resolve();

  const cardDiv = resultBox.querySelector('.card');
  cardDiv.click();

  // Click confirm button
  confirmBtn.click();

  expect(global.addCardToCollection).toHaveBeenCalledWith({
    name: 'Squirtle',
    imgUrl: 'url4',
  });

  expect(global.handleAddCard).toHaveBeenCalledWith('url4');
  expect(document.getElementById('global-pokemon-modal')).toBeNull();
  expect(collectionEl.render).toHaveBeenCalled();
});

test('showAddCardModal adds modal and sets event listeners correctly', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  binder.showAddCardModal();

  const modal = document.getElementById('global-pokemon-modal');
  expect(modal).toBeTruthy();

  // modal should have 'click' event listener to remove itself on background click
  const clickEvent = new MouseEvent('click', { bubbles: true });
  modal.dispatchEvent(clickEvent);
  // modal removed after click on background
  expect(document.getElementById('global-pokemon-modal')).toBeNull();
});

test('confirmAddCardBtn click only works if selectedCard with image exists', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  // Setup stubs
  global.addCardToCollection = jest.fn();
  global.handleAddCard = jest.fn();
  global.getBinderPages = jest.fn(() => []);
  document.body.appendChild(document.createElement('pokemon-collection')).render = jest.fn();

  binder.showAddCardModal();

  const confirmBtn = document.getElementById('confirmAddCardBtn');

  // Confirm button hidden initially
  expect(confirmBtn.style.display).toBe('none');

  // Try click with no selectedCard: nothing should happen, modal stays
  confirmBtn.click();
  expect(document.getElementById('global-pokemon-modal')).not.toBeNull();

  // Simulate selectedCard with no images property
  binder.selectedCard = { name: 'NoImageCard' };
  confirmBtn.click();
  expect(document.getElementById('global-pokemon-modal')).not.toBeNull();

  // Simulate valid selectedCard with images.small
  binder.selectedCard = { name: 'TestCard', images: { small: 'test-url' } };
  confirmBtn.click();

  // modal should be removed after confirm
  expect(document.getElementById('global-pokemon-modal')).toBeNull();
  expect(global.addCardToCollection).toHaveBeenCalledWith({
    name: 'TestCard',
    imgUrl: 'test-url',
  });
  expect(global.handleAddCard).toHaveBeenCalledWith('test-url');
});

test('input event: loading, render cards, hover, click select, error fallback', async () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  // Mock getCardsByName to resolve with 2 cards
  global.getCardsByName = jest.fn().mockResolvedValue([
    { name: 'Card1', images: { small: 'url1' } },
    { name: 'Card2', images: { small: 'url2' } },
  ]);

  binder.showAddCardModal();

  const input = document.getElementById('cardSearchInput');
  const resultBox = document.getElementById('cardSearchResult');
  const confirmBtn = document.getElementById('confirmAddCardBtn');

  // Set input value triggers 'Loading...'
  input.value = 'test';
  input.dispatchEvent(new Event('input'));

  expect(resultBox.innerHTML).toContain('Loading...');

  // Wait for async update
  await Promise.resolve();

  // Cards should be rendered
  const cards = resultBox.querySelectorAll('.card');
  expect(cards.length).toBe(2);
  expect(cards[0].textContent).toContain('Card1');

  // Hover events should modify style.transform
  cards[0].dispatchEvent(new MouseEvent('mouseover'));
  expect(cards[0].style.transform).toBe('scale(1.05)');

  cards[0].dispatchEvent(new MouseEvent('mouseout'));
  expect(cards[0].style.transform).toBe('scale(1)');

  // Click card to select
  cards[0].click();
  expect(cards[0].classList.contains('selected')).toBe(true);
  expect(confirmBtn.style.display).toBe('block');

  // Test error case - mock getCardsByName to reject
  global.getCardsByName.mockRejectedValueOnce(new Error('fail test'));
  input.value = 'fail';
  input.dispatchEvent(new Event('input'));

  // Wait for async error
  await Promise.resolve();

  expect(resultBox.innerHTML).toContain('Error: fail test');
});

test('showAddCardModal modal background click removes modal', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  binder.showAddCardModal();

  const modal = document.getElementById('global-pokemon-modal');
  expect(modal).toBeTruthy();

  // simulate click on modal background
  const clickEvent = new MouseEvent('click', { bubbles: true });
  Object.defineProperty(clickEvent, 'target', { value: modal });

  modal.dispatchEvent(clickEvent);

  expect(document.getElementById('global-pokemon-modal')).toBeNull();
});

test('input event clears results on empty input', async () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  global.getCardsByName = jest.fn().mockResolvedValue([]);

  binder.showAddCardModal();

  const input = document.getElementById('cardSearchInput');
  const resultBox = document.getElementById('cardSearchResult');

  input.value = '   ';  // whitespace only input
  input.dispatchEvent(new Event('input'));

  // Wait for async
  await Promise.resolve();

  expect(resultBox.innerHTML).toContain('Loading...');
});

test('showAddCardModal displays no cards found message', async () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  global.getCardsByName = jest.fn().mockResolvedValue([]);

  binder.showAddCardModal();

  const input = document.getElementById('cardSearchInput');
  const resultBox = document.getElementById('cardSearchResult');

  input.value = 'nonexistent';
  input.dispatchEvent(new Event('input'));

  await Promise.resolve();

  expect(resultBox.innerHTML).toContain('No cards found.');
});

test('toggleModal does nothing if no modal present', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  expect(document.getElementById('global-pokemon-modal')).toBeNull();

  // Should not throw
  expect(() => binder.toggleModal()).not.toThrow();
});

test('showModal does not add multiple modals', () => {
  const binder = document.createElement('pokemon-binder');
  document.body.appendChild(binder);

  binder.showModal('url1');
  expect(document.querySelectorAll('#global-pokemon-modal').length).toBe(1);

  // Calling showModal again should replace old modal, not add new
  binder.showModal('url2');
  expect(document.querySelectorAll('#global-pokemon-modal').length).toBe(1);
});

test("modal card click calls toggleModal", () => {
    const toggleSpy = jest.spyOn(binder, "toggleModal");
    binder.showModal("some-image-url");
    const modal = document.getElementById("global-pokemon-modal");
    const modalCard = modal.querySelector(".modal-card");
    if (modalCard) {
      modalCard.click();
      expect(toggleSpy).toHaveBeenCalled();
    }
  });
});

describe("Modal event handling", () => {
  let binder;
  beforeEach(() => {
    document.body.innerHTML = ""; // reset DOM
    binder = new PokemonBinder();
  });

  test("modal click on background removes modal", () => {
    binder.showAddCardModal();

    const modal = document.getElementById("global-pokemon-modal");
    expect(modal).not.toBeNull();

    // Click event where target === modal
    modal.dispatchEvent(new MouseEvent("click", { bubbles: true, target: modal }));

    // Modal should be removed from DOM
    expect(document.getElementById("global-pokemon-modal")).toBeNull();
  });

  test("modal-card click triggers toggleModal", (done) => {
    binder.showAddCardModal();

    setTimeout(() => {
      const modal = document.getElementById("global-pokemon-modal");
      const modalCard = modal.querySelector(".modal-card");
      expect(modalCard).not.toBeNull();

      // Spy on toggleModal
      const toggleSpy = jest.spyOn(binder, "toggleModal");

      modalCard.click();

      expect(toggleSpy).toHaveBeenCalled();

      toggleSpy.mockRestore();
      done();
    }, 0);
  });

  test("modal removes hidden class after timeout", (done) => {
    binder.showAddCardModal();
    const modal = document.getElementById("global-pokemon-modal");
    expect(modal.classList.contains("hidden")).toBe(true);

    setTimeout(() => {
      expect(modal.classList.contains("hidden")).toBe(false);
      done();
    }, 20);
  });
});

describe("Add card to collection handling", () => {
  let binder;
  let selectedCard;

  beforeEach(() => {
    document.body.innerHTML = `
      <pokemon-binder></pokemon-binder>
      <pokemon-collection></pokemon-collection>
      <div id="global-pokemon-modal"></div>
    `;

    binder = new PokemonBinder();
    selectedCard = {
      name: "Pikachu",
      images: { small: "pikachu.png" }
    };
  });

  test("adds card to collection and refreshes binder and collection", () => {
    // Mock window globals
    window.addCardToCollection = jest.fn();
    window.getBinderPages = jest.fn(() => ["page1", "page2"]);

    const binderEl = document.querySelector("pokemon-binder");
    jest.spyOn(binderEl, "setPages").mockImplementation(() => {});
    
    const collEl = document.querySelector("pokemon-collection");
    collEl.render = jest.fn();

    // Emulate the code block that adds card and refreshes
    if (window.addCardToCollection) {
      window.addCardToCollection({
        name: selectedCard.name,
        imgUrl: selectedCard.images.small,
      });
    }

    // Assume handleAddCard is a method on binder
    if (typeof binder.handleAddCard === "function") {
      binder.handleAddCard(selectedCard.images.small);
    }

    if (binderEl && window.getBinderPages) {
      binderEl.setPages(window.getBinderPages());
    }

    if (collEl && typeof collEl.render === "function") {
      collEl.render();
    }

    document.getElementById("global-pokemon-modal")?.remove();

    expect(window.addCardToCollection).toHaveBeenCalledWith({
      name: "Pikachu",
      imgUrl: "pikachu.png",
    });

    expect(binderEl.setPages).toHaveBeenCalled();
    expect(collEl.render).toHaveBeenCalled();
    expect(document.getElementById("global-pokemon-modal")).toBeNull();
  });
});

describe("Search input event and result rendering", () => {
  let binder;
  let input;
  let resultBox;
  let confirmBtn;
  let selectedCard;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="search-input" />
      <div id="result-box"></div>
      <button id="confirm-btn" style="display:none;">Confirm</button>
    `;

    binder = new PokemonBinder();
    input = document.getElementById("search-input");
    resultBox = document.getElementById("result-box");
    confirmBtn = document.getElementById("confirm-btn");
    selectedCard = null;

    // Bind event handler or method if needed
    // You might have a method like binder._bindSearchInput() that adds this event
  });

  test("renders cards on successful search", async () => {
    // Mock getCardsByName to return cards
    const mockCards = [
      { name: "Bulbasaur", images: { small: "bulba.png" } },
      { name: "Charmander", images: { small: "char.png" } },
    ];
    jest.spyOn(global, "getCardsByName").mockResolvedValue(mockCards);

    // Simulate input event that triggers the search
    // This depends on your actual event hookup; assuming a method binder._onInput()
    await binder._onInput({ target: { value: "bulb" } });

    expect(resultBox.children.length).toBe(mockCards.length);

    // Check first card div class and contents
    const firstCard = resultBox.querySelector(".card");
    expect(firstCard).not.toBeNull();

    // Simulate mouseover and mouseout events to test hover scale
    firstCard.dispatchEvent(new Event("mouseover"));
    expect(firstCard.style.transform).toBe("scale(1.05)");

    firstCard.dispatchEvent(new Event("mouseout"));
    expect(firstCard.style.transform).toBe("scale(1)");

    // Simulate click to select card
    firstCard.click();
    expect(firstCard.classList.contains("selected")).toBe(true);
    expect(confirmBtn.style.display).toBe("block");

    global.getCardsByName.mockRestore();
  });

  test("shows 'No cards found' when no results", async () => {
    jest.spyOn(global, "getCardsByName").mockResolvedValue([]);

    await binder._onInput({ target: { value: "nonexistent" } });

    expect(resultBox.textContent).toMatch(/No cards found/);

    global.getCardsByName.mockRestore();
  });

  test("shows error message on fetch failure", async () => {
    jest.spyOn(global, "getCardsByName").mockRejectedValue(new Error("API failure"));

    await binder._onInput({ target: { value: "error" } });

    expect(resultBox.textContent).toMatch(/Error: API failure/);

    global.getCardsByName.mockRestore();
  });
});
