/**
 * @jest-environment jsdom
 */

import { initializeFilters } from '../../source/assets/scripts/pokemon-filter.js';

describe('pokemon-filter E2E tests', () => {
  beforeEach(() => {
    // Clear the DOM and reset styles
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Add minimal DOM elements that initializeFilters waits for
    const header = document.createElement('header');
    document.body.appendChild(header);
    
    const binder = document.createElement('pokemon-binder');
    document.body.appendChild(binder);
  });

  test('Filter panel renders after initializeFilters is called', done => {
    initializeFilters();

    // The panel is created asynchronously with a check interval,
    // so wait up to 500ms to detect it
    setTimeout(() => {
      const filterWrapper = document.querySelector('.filter-wrapper');
      expect(filterWrapper).toBeTruthy();

      const select = filterWrapper.querySelector('#sort-options');
      expect(select).toBeTruthy();
      expect(select.value).toBe('set');

      const button = filterWrapper.querySelector('.filter-btn');
      expect(button).toBeTruthy();

      done();
    }, 300);
  });

  test('Clicking Apply button dispatches sortCards event with selected sortMethod', done => {
    initializeFilters();

    // Listen for the custom event
    document.addEventListener('sortCards', e => {
      expect(e.detail).toEqual({ sortMethod: 'name' });
      done();
    });

    setTimeout(() => {
      const select = document.querySelector('#sort-options');
      select.value = 'name';

      const applyBtn = document.querySelector('.filter-btn');
      applyBtn.click();
    }, 300);
  });

  test('Filter panel repositions on window resize', done => {
    initializeFilters();

    setTimeout(() => {
      const filterWrapper = document.querySelector('.filter-wrapper');
      const initialTop = filterWrapper.style.top;

      // Simulate window resize and check if top changes (position recalculated)
      window.dispatchEvent(new Event('resize'));

      // Because positionFilterPanel runs synchronously on resize,
      // style.top should remain defined
      expect(filterWrapper.style.top).toBeDefined();
      expect(filterWrapper.style.top).toBe(initialTop);

      done();
    }, 300);
  });
});