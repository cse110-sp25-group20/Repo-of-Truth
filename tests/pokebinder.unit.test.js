describe("Unit Tests", () => {
  test("placeholder test", () => {
    expect(true).toBe(true);
  });
});
/**
 * @jest-environment jsdom
 */

import "../source/components/binder/pokemon-binder.js"; 
import { jest, describe, test, expect } from '@jest/globals';

describe("PokemonBinder", () => {
  let binder;

  beforeEach(() => {
    document.body.innerHTML = `<pokemon-binder></pokemon-binder>`;
    binder = document.querySelector("pokemon-binder");

    // simulate shadow dom internals
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

test("toggleModal removes existing modal", () => {
  const modal = document.createElement("div");
  modal.id = "global-pokemon-modal";
  document.body.appendChild(modal);

  expect(document.getElementById("global-pokemon-modal")).not.toBeNull();

  binder.toggleModal();

  expect(document.getElementById("global-pokemon-modal")).toBeNull();
});

test("setPages defaults currentIndex to 1 when pagesMap is empty", () => {
  binder.setPages([]);
  expect(binder.currentIndex).toBe(1);
});
});
