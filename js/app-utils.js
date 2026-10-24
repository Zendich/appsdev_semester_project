let toastTimeoutId;

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function calculateItemTotal(item, cartItem) {
  const base = item.price * cartItem.qty;
  const extrasCost = cartItem.extras.length * 1.25 * cartItem.qty;
  return base + extrasCost;
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function getItemById(id) {
  return menuItems.find((item) => item.id === id);
}

function setView(view, selectedItemId = null) {
  state.view = view;
  state.selectedItemId = selectedItemId;
  state.message = null;
  render();
}

function signOut() {
  state.isAuthenticated = false;
  state.view = 'auth';
  state.authMode = 'login';
  render();
}

function setCategory(category) {
  state.category = category;
  render();
}

function setSearch(value) {
  state.search = value;
  render();
}

function updateCartCount() {
  cartCount.textContent = getCartCount();
}

function renderNav() {
  document.querySelector('.app-header').hidden = !state.isAuthenticated;
  Object.entries(navButtons).forEach(([view, button]) => {
    button.hidden = !state.isAuthenticated;
    button.classList.toggle('active', state.view === view);
    button.title = `Go to ${view.charAt(0).toUpperCase() + view.slice(1)}`;
    button.onclick = () => setView(view);
  });
  updateCartCount();
}

function clearRoot() {
  root.innerHTML = '';
}

function createSection(title, description) {
  const card = document.createElement('section');
  card.className = 'section-card';
  if (title) {
    const heading = document.createElement('div');
    heading.className = 'card-row';
    heading.innerHTML = `<h2>${title}</h2><p class="text-muted">${description || ''}</p>`;
    card.appendChild(heading);
  }
  return card;
}

function renderMessage() {
  if (!state.message) return null;
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.textContent = state.message;
  return alert;
}

function showToast(message) {
  clearTimeout(toastTimeoutId);
  document.querySelector('.toast')?.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);
  toastTimeoutId = setTimeout(() => toast.remove(), 2500);
}
