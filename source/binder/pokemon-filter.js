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
                        <option value="set">BY SET</option>
                        <option value="name">BY NAME</option>
                        <option value="binder">BY BINDER</option>
                        <option value="date">BY DATE</option>
                        <option value="value">BY VALUE</option>
                        <option value="hp">BY HP</option>
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
            width: 220px;
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
            border: 3px solid var(--accent-color);
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .filter-title {
            color: var(--accent-color);
            margin: 0 0 15px 0;
            font-size: 1.2rem;
            text-transform: uppercase;
            text-align: center;
        }
        .filter-controls {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .filter-select {
            padding: 8px 12px;
            background-color: var(--bg-color);
            color: var(--text-color);
            border: 2px solid var(--accent-color);
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
        }
        .filter-btn {
            padding: 8px 16px;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
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