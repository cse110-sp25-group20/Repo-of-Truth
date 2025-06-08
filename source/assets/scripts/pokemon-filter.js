// pokemon-filter.js

/**
 * Initializes the Pokémon filter panel.
 * 
 * - Waits for essential DOM elements to load.
 * - Adds a styled filter dropdown with sort options.
 * - Dispatches a 'sortCards' custom event with the selected sorting method.
 * 
 * This function should be called once after the DOM is fully loaded.
 * @returns {void}
 */
export function initializeFilters() {
    // Wait until the header and binder component are available in DOM
    const checkElements = setInterval(() => {
        const header = document.querySelector('header');
        const pokemonBinder = document.querySelector('pokemon-binder');
        
        if (header && pokemonBinder) {
            clearInterval(checkElements);
            createFilterPanel();
        }
    }, 100);

    /**
     * Creates and renders the filter panel on the page.
     * Includes a select dropdown and apply button for sorting cards.
     * @returns {void}
     */
    function createFilterPanel() {
        // Remove existing filter if one already exists
        const existingFilter = document.querySelector('.filter-wrapper');
        if (existingFilter) existingFilter.remove();

        // Create the outer wrapper
        const filterWrapper = document.createElement('div');
        filterWrapper.className = 'filter-wrapper';

        // Set the inner HTML content
        filterWrapper.innerHTML = `
            <div class="filter-container">
                <h3 class="filter-title">SORT CARDS</h3>
                <div class="filter-controls">
                    <select id="sort-options" class="filter-select">
                        <option value="set">By Set</option>
                        <option value="name">By Name</option>
                        <option value="binder">By Binder</option>
                        <option value="date">By Date</option>
                        <option value="value">By Value</option>
                        <option value="hp">By HP</option>
                    </select>
                    <button class="filter-btn">Apply</button>
                </div>
            </div>
        `;

        // Add the panel to the page
        document.body.appendChild(filterWrapper);

        // Position the panel correctly under the header
        positionFilterPanel();

        // Adjust panel position on window resize
        window.addEventListener('resize', positionFilterPanel);

        // Emit a custom event when Apply is clicked
        document.querySelector('.filter-btn').addEventListener('click', () => {
            const sortMethod = document.getElementById('sort-options').value;
            document.dispatchEvent(new CustomEvent('sortCards', {
                detail: { sortMethod }
            }));
        });
    }

    /**
     * Positions the filter panel relative to the header.
     * Ensures consistent spacing and visibility on screen.
     * @returns {void}
     */
    function positionFilterPanel() {
        const header = document.querySelector('header');
        const filterWrapper = document.querySelector('.filter-wrapper');
        
        if (!header || !filterWrapper) return;

        const headerRect = header.getBoundingClientRect();
        
        filterWrapper.style.cssText = `
            position: fixed;
            top: ${headerRect.bottom + 15}px;
            left: 20px;
            width: 180px;
            z-index: 1000;
        `;
    }

    /**
     * Appends custom styles for the filter panel directly to the document head.
     * Ensures cohesive styling with a clean and modern design.
     * @returns {void}
     */
    const style = document.createElement('style');
    style.textContent = `
        .filter-wrapper {
            transition: top 0.3s ease;
        }
        .filter-container {
            background: #fff;
            border: 2px solid #e91e63;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .filter-title {
            color: #e91e63;
            margin-bottom: 8px;
            font-size: 0.95rem;
            text-align: center;
        }
        .filter-controls {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .filter-select {
            padding: 5px 8px;
            font-size: 0.85rem;
            border: 1.5px solid #e91e63;
            border-radius: 5px;
            background-color: white;
            color: #333;
            cursor: pointer;
        }
        .filter-select:focus {
            outline: none;
            border-color: #c2185b;
        }
        .filter-btn {
            padding: 5px 10px;
            font-size: 0.8rem;
            background-color: #e91e63;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .filter-btn:hover {
            background-color: #d81b60;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Automatically initializes filters when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});
