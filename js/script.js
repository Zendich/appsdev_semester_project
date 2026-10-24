const root = document.getElementById('app-root');
const cartCount = document.getElementById('cart-count');
const navButtons = {
  home: document.getElementById('nav-home'),
  menu: document.getElementById('nav-menu'),
  cart: document.getElementById('nav-cart'),
  history: document.getElementById('nav-history'),
  profile: document.getElementById('nav-profile'),
};

function render() {
  renderNav();
  clearRoot();
  renderContent();
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  state.isAuthenticated = false;
  state.view = 'auth';
  state.authMode = 'login';
  render();
  document.addEventListener('navigateMenu', () => setView('menu'));
});
