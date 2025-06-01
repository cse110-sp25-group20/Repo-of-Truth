function initializeFilters() {
    const checkElements = setInterval(() => {
        const header = document.querySelector('header');
        const pokemonBinder = document.querySelector('pokemon-binder');

        if (header && pokemonBinder) {
            clearInterval(checkElements);
            createFilterPanel();
        }
    }, 100);

    function createFilterPanel() {
        const existingFilter = document.querySelector('.filter-wrapper');
        if (existingFilter) existingFilter.remove();

        const filterWrapper = document.createElement('div');
        filterWrapper.className = 'filter-wrapper';
        filterWrapper.innerHTML = `
            <div class="filter-container">
                <h3 class="filter-title">FILTER CARDS</h3>
                <div class="filter-controls">
                    <input type="text" id="filter-input" class="filter-select" placeholder="e.g. Base, Pikachu, 2025" />
                    <button class="filter-btn">APPLY</button>
                </div>
            </div>
        `;
        document.body.appendChild(filterWrapper);
        positionFilterPanel();
        window.addEventListener('resize', positionFilterPanel);

        document.querySelector('.filter-btn').addEventListener('click', () => {
            const query = document.getElementById('filter-input').value.trim().toLowerCase();
            filterCardsBy(query);
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

    function filterCardsBy(query) {
        const binder = document.querySelector('pokemon-binder');
        const cards = Array.from(binder.querySelectorAll('.card'));
        let firstMatchIndex = -1;

        cards.forEach((card, index) => {
            const data = Object.values(card.dataset).join(' ').toLowerCase();
            const match = data.includes(query);

            card.style.display = match ? '' : 'none';
            if (match && firstMatchIndex === -1) firstMatchIndex = index;
        });

        // Flip to the page with the first matching card
        if (firstMatchIndex !== -1) {
            const cardsPerPage = getCardsPerPage(); // assume function or fixed value
            const targetPage = Math.floor(firstMatchIndex / cardsPerPage);
            if (typeof binder.flipToPage === 'function') {
                binder.flipToPage(targetPage);
            } else {
                binder.setAttribute('page', targetPage); // fallback if no flipToPage
            }
        }
    }

    function getCardsPerPage() {
        // Adjust to your app's actual cards per page
        return 9;
    }

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
        }
        .filter-btn {
            padding: 5px 10px;
            font-size: 0.8rem;
            background-color: #e91e63;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
        }
        .filter-btn:hover {
            background-color: #d81b60;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', initializeFilters);
