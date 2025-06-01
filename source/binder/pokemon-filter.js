// pokemon-filter.js
export function initializeFilters() {
    // Wait for the custom element to be defined first
    customElements.whenDefined('pokemon-binder').then(() => {
        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <h3>Sort Cards</h3>
            <div class="filter-controls">
                <select id="sort-options">
                    <option value="set">By Set</option>
                    <option value="binder">By Binder Section</option>
                    <option value="date">By Date Added</option>
                    <option value="value">By Market Value</option>
                </select>
                <button class="filter-btn">Apply Sort</button>
            </div>
        `;

        // Try multiple insertion points with fallbacks
        const insertionPoints = [
            { selector: 'pokemon-binder', position: 'beforebegin' },
            { selector: '.controls', position: 'beforebegin' },
            { selector: 'header', position: 'afterend' }
        ];

        for (const point of insertionPoints) {
            const element = document.querySelector(point.selector);
            if (element) {
                element.insertAdjacentElement(point.position, filterContainer);
                setupFilterEvents();
                return;
            }
        }

        console.error('Could not find insertion point for filters');
    }).catch(error => {
        console.error('Failed to initialize filters:', error);
    });

    function setupFilterEvents() {
        const sortSelect = document.getElementById('sort-options');
        const applyButton = document.querySelector('.filter-btn');

        if (!sortSelect || !applyButton) {
            console.error('Filter controls not found');
            return;
        }

        applyButton.addEventListener('click', () => {
            const sortMethod = sortSelect.value;
            document.dispatchEvent(new CustomEvent('sortCards', {
                detail: { sortMethod }
            }));
        });
    }
}

// Initialize only if running directly (for testing)
if (import.meta.url.includes('pokemon-filter.js')) {
    document.addEventListener('DOMContentLoaded', initializeFilters);
}