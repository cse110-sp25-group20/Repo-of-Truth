const sum = require('../tests/sum');
const multiply = require('../tests/multiply');

test('adds 1 + 1 to equal 2', () => {
  expect(1 + 1).toBe(2);
});

// Example of importing from another file:
/*import { sum } from '../code-to-unit-test/sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1,2)).toBe(3);
});*/

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('multiplies 3 * 2 to equal 6', () => {
  expect(multiply(3, 2)).toBe(6);
});
