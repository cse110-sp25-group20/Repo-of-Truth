// toggleMode.js
// Handles toggling between light and dark mode for the Pokémon binder app

const darkModeToggleBtn = document.getElementById('darkModeToggle');
const bodyElement = document.body;

// On page load: apply saved dark mode preference
if (localStorage.getItem('pokemonDarkMode') === 'true') {
  bodyElement.classList.add('dark-mode');
}

// Toggle dark mode on button click and save preference
if (darkModeToggleBtn) {
  darkModeToggleBtn.addEventListener('click', () => {
    bodyElement.classList.toggle('dark-mode');
    localStorage.setItem('pokemonDarkMode', bodyElement.classList.contains('dark-mode'));
  });
}