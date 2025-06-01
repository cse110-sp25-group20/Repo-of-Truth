// pokemon-filter.js
export function initializeFilters() {
    // Wait for essential elements to be available
    const checkElements = setInterval(() => {
        const header = document.querySelector('header');
        const pokemonBinder = document.querySelector('pokemon-binder');
        
        if (header && pokemonBinder) {
            clearInterval(checkElements);
            createFilterPanel();
        }
    }, 100);

    function createFilterPanel() {
        // Remove existing filter if present
        const existingFilter = document.querySelector('.filter-wrapper');
        if (existingFilter) existingFilter.remove();

        // Create filter container
        const filterWrapper = document.createElement('div');
        filterWrapper.className = 'filter-wrapper';
        filterWrapper.innerHTML = `
            <div class="filter-container">
                <h3 class="filter-title">SORT CARDS</h3>
                <div class="filter-controls">
                    <select id="sort-options" class="filter-select">
                        <option value="set">BY BASE</option>
                        <option value="binder">BY BINDER</option>
                        <option value="date">DATE ADDED</option>
                        <option value="value">BY VALUE</option>
                    </select>
                    <button class="filter-btn">APPLY</button>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(filterWrapper);

        // Position relative to header
        positionFilterPanel();

        // Handle window resize
        window.addEventListener('resize', positionFilterPanel);

        // Add event listeners
        document.querySelector('.filter-btn').addEventListener('click', () => {
            const sortMethod = document.getElementById('sort-options').value;
            document.dispatchEvent(new CustomEvent('sortCards', {
                detail: { sortMethod }
            }));
        });
    }

    function positionFilterPanel() {
        const header = document.querySelector('header');
        const filterWrapper = document.querySelector('.filter-wrapper');
        
        if (!header || !filterWrapper) return;

        const headerRect = header.getBoundingClientRect();
        
        filterWrapper.style.cssText = `
            position: fixed;
            top: ${headerRect.bottom + 20}px;
            left: 20px;
            width: 180px;
            z-index: 1000;
        `;
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .filter-wrapper {
            transition: top 0.3s ease;
        }
        .filter-container {
            background-color: var(--card-bg-color);
            border: 2px solid var(--accent-color);
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        }
        .filter-title {
            color: var(--accent-color);
            margin: 0 0 10px 0;
            font-size: 1rem;
            text-transform: uppercase;
            text-align: center;
        }
        .filter-controls {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .filter-select {
            padding: 6px 10px;
            background-color: var(--bg-color);
            color: var(--text-color);
            border: 2px solid var(--accent-color);
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.9rem;
            cursor: pointer;
            width: 100%;
        }
        .filter-btn {
            padding: 6px 10px;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.85rem;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
        }
        .filter-btn:hover {
            background-color: var(--accent-hover-color);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});
