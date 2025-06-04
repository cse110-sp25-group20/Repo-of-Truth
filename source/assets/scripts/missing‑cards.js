/* missing-cards.js */

// Search for owned cards by img
export function getOwnedImgURLs(pages) {
    return new Set(pages.flat().filter(url => url));
}

// Build an array of pages
export function buildMissingPages(pages) {
    return pages
    .filter(page => page.some(url => !url))
    .map(page => {
        const copy = [...page];
        return copy;
    })
    .concat(
        pages.some(page => page.some(url => !url))
        ? []
        : [["", "", "", "", "", "", "", "", ""]]
    );
}