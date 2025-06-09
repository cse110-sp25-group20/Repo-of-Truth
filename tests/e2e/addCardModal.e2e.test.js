/**
 * @jest-environment jsdom
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

describe('Add Card Modal Jest/jsdom Tests', () => {
  let openModalBtn, modal, closeModalBtn, nameInput, confirmBtn, errorMsg;

  beforeEach(() => {
    // Setup minimal modal HTML inside document.body
    document.body.innerHTML = `
      <button id="open-add-card-modal">Open Add Card Modal</button>

      <div id="add-card-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Add a PokÃ©mon Card</h2>
        <input type="text" id="card-name-input" placeholder="Enter card name" />
        <div id="error-message" style="color: red; display: none;">Please enter a card name.</div>
        <button id="confirm-add-card-btn" disabled>Confirm</button>
        <button id="close-add-card-btn">Close</button>
      </div>
    `;

    openModalBtn = document.getElementById('open-add-card-modal');
    modal = document.getElementById('add-card-modal');
    closeModalBtn = document.getElementById('close-add-card-btn');
    nameInput = document.getElementById('card-name-input');
    confirmBtn = document.getElementById('confirm-add-card-btn');
    errorMsg = document.getElementById('error-message');

    // Modal logic simulation:
    function openModal() {
      modal.classList.remove('hidden');
      errorMsg.style.display = 'none';
      confirmBtn.disabled = true;
      nameInput.value = '';
    }

    function closeModal() {
      modal.classList.add('hidden');
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    nameInput.addEventListener('input', () => {
      const val = nameInput.value.trim();
      if (val.length === 0) {
        confirmBtn.disabled = true;
      } else {
        confirmBtn.disabled = false;
        errorMsg.style.display = 'none';
      }
    });

    confirmBtn.addEventListener('click', () => {
      if (nameInput.value.trim().length === 0) {
        errorMsg.style.display = 'block';
      } else {
        // Simulate adding card: just close modal for this test
        closeModal();
      }
    });
  });

  test('page should have open modal button', () => {
    expect(openModalBtn).not.toBeNull();
    expect(openModalBtn.textContent).toBe('Open Add Card Modal');
  });

  test('modal should be hidden initially', () => {
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  test('should open modal when button clicked', () => {
    openModalBtn.click();
    expect(modal.classList.contains('hidden')).toBe(false);
    expect(nameInput.value).toBe('');
    expect(confirmBtn.disabled).toBe(true);
    expect(errorMsg.style.display).toBe('none');
  });

  test('should close modal when close button clicked', () => {
    openModalBtn.click();
    closeModalBtn.click();
    expect(modal.classList.contains('hidden')).toBe(true);
  });

  test('confirm button disabled when input empty', () => {
    openModalBtn.click();
    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));
    expect(confirmBtn.disabled).toBe(true);
  });

  test('confirm button enabled when input has text', () => {
    openModalBtn.click();
    nameInput.value = 'Pikachu';
    nameInput.dispatchEvent(new Event('input'));
    expect(confirmBtn.disabled).toBe(false);
    expect(errorMsg.style.display).toBe('none');
  });

  test('shows error message if confirm clicked with empty input', () => {
    openModalBtn.click();
    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));
    confirmBtn.click();
    expect(errorMsg.style.display).toBe('block');
    expect(modal.classList.contains('hidden')).toBe(false); // modal stays open
  });

  test('modal closes on confirm if input is valid', () => {
    openModalBtn.click();
    nameInput.value = 'Charmander';
    nameInput.dispatchEvent(new Event('input'));
    confirmBtn.click();
    expect(errorMsg.style.display).toBe('none');
    expect(modal.classList.contains('hidden')).toBe(true);
  });
});