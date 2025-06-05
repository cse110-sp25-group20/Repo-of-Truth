/* missing-cards.js */

/**
 * Return an array of pages that still have at least one empty slot.
 * If all pages are completely full, it will return [].
 * @param {Array<Array<string>>} pages
 * @returns {Array<Array<string>>}
 */
export function buildMissingPages(pages) {
    return pages.filter(page => page.some(url => !url));
}