// Sample binder data with your Venusaur-EX card
const binder = {
    name: "My Pokémon Binder",
    cards: [
      {
        "id": "xy1-1",
        "name": "Venusaur-EX",
        "supertype": "Pokémon",
        "subtypes": ["Basic", "EX"],
        "hp": "180",
        "types": ["Grass"],
        "evolvesTo": ["M Venusaur-EX"],
        "rules": ["Pokémon-EX rule: When a Pokémon-EX has been Knocked Out, your opponent takes 2 Prize cards."],
        "attacks": [
          {
            "name": "Poison Powder",
            "cost": ["Grass", "Colorless", "Colorless"],
            "convertedEnergyCost": 3,
            "damage": "60",
            "text": "Your opponent's Active Pokémon is now Poisoned."
          },
          {
            "name": "Jungle Hammer",
            "cost": ["Grass", "Grass", "Colorless", "Colorless"],
            "convertedEnergyCost": 4,
            "damage": "90",
            "text": "Heal 30 damage from this Pokémon."
          }
        ],
        "weaknesses": [{"type": "Fire", "value": "×2"}],
        "retreatCost": ["Colorless", "Colorless", "Colorless", "Colorless"],
        "convertedRetreatCost": 4,
        "set": {
          "id": "xy1",
          "name": "XY",
          "series": "XY",
          "printedTotal": 146,
          "total": 146,
          "legalities": {
            "unlimited": "Legal",
            "expanded": "Legal"
          },
          "ptcgoCode": "XY",
          "releaseDate": "2014/02/05",
          "updatedAt": "2018/03/04 10:35:00",
          "images": {
            "symbol": "https://images.pokemontcg.io/xy1/symbol.png",
            "logo": "https://images.pokemontcg.io/xy1/logo.png"
          }
        },
        "number": "1",
        "artist": "Eske Yoshinob",
        "rarity": "Rare Holo EX",
        "nationalPokedexNumbers": [3],
        "legalities": {
          "unlimited": "Legal",
          "expanded": "Legal"
        },
        "images": {
          "small": "https://images.pokemontcg.io/xy1/1.png",
          "large": "https://images.pokemontcg.io/xy1/1_hires.png"
        },
        "tcgplayer": {
          "url": "https://prices.pokemontcg.io/tcgplayer/xy1-1",
          "updatedAt": "2021/07/09",
          "prices": {
            "holofoil": {
              "low": 1.0,
              "mid": 3.46,
              "high": 12.95,
              "market": 3.32,
              "directLow": 2.95
            }
          }
        },
        // Additional fields for sorting
        "binderSection": "Rare Holos",
        "dateAdded": "2023-05-15"
      },
      // Add more cards here as needed
    ]
  };
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sort-options');
    const binderView = document.getElementById('binder-view');
    
    // Enhanced card rendering with more details
    function renderCard(card) {
      const attacksHTML = card.attacks.map(attack => 
        `<div class="attack">
          <strong>${attack.name}</strong>: ${attack.damage} damage<br>
          <small>${attack.text}</small>
        </div>`
      ).join('');
      
      const weaknessesHTML = card.weaknesses.map(w => 
        `<span class="weakness">${w.type} ${w.value}</span>`
      ).join('');
      
      return `
      <div class="card" data-id="${card.id}">
        <div class="card-header">
          <img src="${card.images.small}" alt="${card.name}" class="card-image">
          <div class="card-title">
            <h3>${card.name}</h3>
            <div class="card-subtitle">
              <span class="hp">HP: ${card.hp}</span>
              <span class="rarity">${card.rarity}</span>
            </div>
          </div>
        </div>
        
        <div class="card-details">
          <div class="card-types">
            ${card.types.map(type => `<span class="type ${type.toLowerCase()}">${type}</span>`).join('')}
          </div>
          
          <div class="card-set">
            <small>${card.set.name} #${card.number}</small>
          </div>
          
          <div class="card-weaknesses">
            <strong>Weaknesses:</strong> ${weaknessesHTML || 'None'}
          </div>
          
          <div class="card-attacks">
            ${attacksHTML}
          </div>
          
          <div class="card-footer">
            <div class="card-meta">
              <span class="binder-section">${card.binderSection || 'Uncategorized'}</span>
              <span class="date-added">Added: ${card.dateAdded || 'Unknown'}</span>
            </div>
            <div class="card-value">
              $${card.tcgplayer?.prices?.holofoil?.mid?.toFixed(2) || 'N/A'}
            </div>
          </div>
        </div>
      </div>
      `;
    }
  
    // Render the entire binder view
    function renderBinder(cards) {
      binderView.innerHTML = cards.map(card => renderCard(card)).join('');
    }
  
    // Sorting functions
    const sortFunctions = {
      set: (a, b) => a.set.name.localeCompare(b.set.name),
      name: (a, b) => a.name.localeCompare(b.name),
      binder: (a, b) => (a.binderSection || '').localeCompare(b.binderSection || ''),
      dateAdded: (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
      marketValue: (a, b) => {
        const aValue = a.tcgplayer?.prices?.holofoil?.mid || 0;
        const bValue = b.tcgplayer?.prices?.holofoil?.mid || 0;
        return bValue - aValue; // Descending order
      },
      hp: (a, b) => parseInt(b.hp) - parseInt(a.hp) // Higher HP first
    };
  
    // Handle sort selection
    sortSelect.addEventListener('change', (e) => {
      const sortMethod = e.target.value;
      const sortedCards = [...binder.cards].sort(sortFunctions[sortMethod]);
      renderBinder(sortedCards);
    });
  
    // Initial render
    renderBinder(binder.cards);
  });