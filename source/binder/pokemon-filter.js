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

        // Create filter container with cleaner design
        const filterWrapper = document.createElement('div');
        filterWrapper.className = 'filter-wrapper';
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
            top: ${headerRect.bottom + 15}px;
            left: 20px;
            width: 180px;
            z-index: 1000;
        `;
    }

    // Add cleaner styles matching your preferred design
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

document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});