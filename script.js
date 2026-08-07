import { menuItems } from './data.js';

const root = document.getElementById('app-root');
const cartCount = document.getElementById('cart-count');
const navButtons = {
  home: document.getElementById('nav-home'),
  menu: document.getElementById('nav-menu'),
  cart: document.getElementById('nav-cart'),
  history: document.getElementById('nav-history'),
  profile: document.getElementById('nav-profile'),
};

const state = {
  view: 'home',
  selectedItemId: null,
  cart: [],
  search: '',
  category: 'All',
  user: {
    name: 'Guest',
    email: '',
  },
  orderHistory: [],
  message: null,
};

const STORAGE_KEY = 'golden-palate-state';

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored);
    Object.assign(state, parsed);
  } catch (error) {
    console.warn('Could not restore saved state', error);
  }
}

function saveState() {
  const payload = {
    cart: state.cart,
    user: state.user,
    orderHistory: state.orderHistory,
    category: state.category,
    search: state.search,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

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
  Object.entries(navButtons).forEach(([view, button]) => {
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

function renderHome() {
  const welcome = createSection('Welcome to Golden Palate', 'A polished restaurant demo with menu browsing, cart, orders, and local state persistence.');
  welcome.innerHTML += `
    <div class="text-muted">
      <p>Use the navigation buttons above to explore the app. Every screen is generated from JavaScript data and state is saved to localStorage.</p>
      <ul>
        <li>Menu browsing with category filtering and search</li>
        <li>Customizable item detail pages</li>
        <li>Cart, checkout validation, and order history</li>
        <li>Responsive layout for phone and laptop</li>
      </ul>
    </div>
  `;

  const quickActions = document.createElement('div');
  quickActions.className = 'tag-list';
  ['Menu', 'Cart', 'Orders', 'Profile'].forEach((label) => {
    const btn = document.createElement('button');
    btn.textContent = `Go to ${label}`;
    btn.className = 'secondary';
    btn.onclick = () => setView(label.toLowerCase());
    quickActions.appendChild(btn);
  });

  welcome.appendChild(quickActions);
  root.appendChild(welcome);
}

function renderMenu() {
  const menuSection = createSection('Menu', 'Browse items by category, search by name, and customize orders.');

  const controls = document.createElement('div');
  controls.className = 'card-row';
  controls.innerHTML = `
    <div class="input-group">
      <label for="item-search">Search menu</label>
      <input id="item-search" type="search" placeholder="Search items..." value="${state.search}" />
    </div>
  `;
  menuSection.appendChild(controls);

  const categoryFilters = document.createElement('div');
  categoryFilters.className = 'tag-list';
  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.textContent = category;
    button.className = state.category === category ? 'active' : '';
    button.onclick = () => setCategory(category);
    categoryFilters.appendChild(button);
  });
  menuSection.appendChild(categoryFilters);

  const inputSearch = controls.querySelector('#item-search');
  inputSearch.addEventListener('input', (event) => setSearch(event.target.value));

  const items = menuItems.filter((item) => {
    const matchesCategory = state.category === 'All' || item.category === state.category;
    const matchesSearch = item.name.toLowerCase().includes(state.search.toLowerCase()) || item.description.toLowerCase().includes(state.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<p>No menu items match your search or category.</p>`;
    menuSection.appendChild(empty);
  } else {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="meta">
          <span class="badge">${item.category}</span>
          <span><strong>${formatMoney(item.price)}</strong></span>
        </div>
        <p class="small-note">Sizes: ${item.sizes.join(', ')}</p>
      `;
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '12px';
      const detailsButton = document.createElement('button');
      detailsButton.className = 'secondary';
      detailsButton.textContent = 'Customize';
      detailsButton.onclick = () => setView('item', item.id);
      const quickAdd = document.createElement('button');
      quickAdd.className = 'primary';
      quickAdd.textContent = 'Add to cart';
      quickAdd.onclick = () => addToCart(item.id);
      actions.appendChild(detailsButton);
      actions.appendChild(quickAdd);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    menuSection.appendChild(grid);
  }

  root.appendChild(menuSection);
}

function renderItemDetail() {
  const item = getItemById(state.selectedItemId);
  if (!item) {
    const empty = createSection('Item not found', 'Return to the menu and choose a valid item.');
    root.appendChild(empty);
    return;
  }

  const detailSection = createSection(item.name, item.description);
  const form = document.createElement('form');
  form.className = 'input-group';
  const sizeLabel = document.createElement('label');
  sizeLabel.textContent = 'Choose size';
  const sizeSelect = document.createElement('select');
  sizeSelect.name = 'size';
  item.sizes.forEach((size) => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  });

  const qtyLabel = document.createElement('label');
  qtyLabel.textContent = 'Quantity';
  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.name = 'qty';
  qtyInput.min = 1;
  qtyInput.value = 1;

  const extrasLabel = document.createElement('p');
  extrasLabel.textContent = 'Extras ($1.25 each)';
  const extrasList = document.createElement('div');
  extrasList.className = 'tag-list';
  item.extras.forEach((extra) => {
    const wrapper = document.createElement('label');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '10px';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = extra;
    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(extra));
    extrasList.appendChild(wrapper);
  });

  const notesLabel = document.createElement('label');
  notesLabel.textContent = 'Special notes';
  const notesInput = document.createElement('textarea');
  notesInput.name = 'notes';
  notesInput.placeholder = 'Add delivery notes or requests...';

  const summary = document.createElement('p');
  summary.className = 'small-note';
  summary.textContent = `Base price ${formatMoney(item.price)} · ${item.sizes.length} size option(s) · ${item.extras.length} extra(s)`;

  const addButton = document.createElement('button');
  addButton.className = 'primary';
  addButton.textContent = 'Add to cart';
  addButton.type = 'submit';

  form.append(sizeLabel, sizeSelect, qtyLabel, qtyInput, extrasLabel, extrasList, notesLabel, notesInput, summary, addButton);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedExtras = Array.from(extrasList.querySelectorAll('input:checked')).map((input) => input.value);
    addToCart(item.id, {
      qty: Number(qtyInput.value) || 1,
      size: sizeSelect.value,
      extras: selectedExtras,
      notes: notesInput.value.trim(),
    });
  });

  detailSection.appendChild(form);
  root.appendChild(detailSection);
}

function addToCart(itemId, customization = null) {
  const item = getItemById(itemId);
  if (!item) return;
  const defaultSize = item.sizes[0];
  const cartEntry = {
    id: item.id,
    qty: customization?.qty || 1,
    size: customization?.size || defaultSize,
    extras: customization?.extras || [],
    notes: customization?.notes || '',
  };

  const matchIndex = state.cart.findIndex(
    (existing) => existing.id === cartEntry.id && existing.size === cartEntry.size && arraysEqual(existing.extras, cartEntry.extras) && existing.notes === cartEntry.notes
  );

  if (matchIndex !== -1) {
    state.cart[matchIndex].qty += cartEntry.qty;
  } else {
    state.cart.push(cartEntry);
  }

  state.message = `${item.name} was added to your cart.`;
  saveState();
  setView('cart');
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

function renderCart() {
  const cartSection = createSection('Your Cart', 'Review items, update quantities, and complete checkout.');
  cartSection.appendChild(renderMessage() || document.createElement('div'));

  if (state.cart.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p>Your cart is empty right now.</p>
      <button class="primary" onclick="document.dispatchEvent(new CustomEvent('navigateMenu'))">Browse menu</button>
    `;
    cartSection.appendChild(empty);
    root.appendChild(cartSection);
    return;
  }

  const cartList = document.createElement('div');
  state.cart.forEach((cartItem, index) => {
    const item = getItemById(cartItem.id);
    const card = document.createElement('div');
    card.className = 'cart-item';
    card.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p class="item-meta">${cartItem.size} · ${cartItem.extras.length ? `Extras: ${cartItem.extras.join(', ')}` : 'No extras'}</p>
        ${cartItem.notes ? `<p class="small-note">Notes: ${cartItem.notes}</p>` : ''}
        <p class="small-note">${formatMoney(item.price)} each + ${cartItem.extras.length ? formatMoney(cartItem.extras.length * 1.25) : '$0.00'} extras</p>
      </div>
      <div class="cart-item-controls">
        <input type="number" min="1" value="${cartItem.qty}" data-index="${index}" />
        <button class="secondary" data-remove="${index}">Remove</button>
      </div>
    `;
    cartList.appendChild(card);
  });

  cartSection.appendChild(cartList);

  const totals = state.cart.reduce((sum, cartItem) => {
    const item = getItemById(cartItem.id);
    return sum + calculateItemTotal(item, cartItem);
  }, 0);

  const summaryPanel = document.createElement('div');
  summaryPanel.className = 'cart-summary';
  summaryPanel.innerHTML = `
    <h3>Order Summary</h3>
    <p class="text-muted">${getCartCount()} items in cart</p>
    <p><strong>Total: ${formatMoney(totals)}</strong></p>
  `;

  const checkoutForm = document.createElement('form');
  checkoutForm.className = 'input-group';
  checkoutForm.innerHTML = `
    <h3>Checkout Details</h3>
    <label>Name</label>
    <input name="name" type="text" placeholder="Your name" value="${state.user.name === 'Guest' ? '' : state.user.name}" required />
    <label>Email</label>
    <input name="email" type="email" placeholder="you@example.com" value="${state.user.email}" required />
    <label>Delivery instructions</label>
    <textarea name="deliveryNotes" placeholder="Optional notes for the kitchen"></textarea>
    <button class="success" type="submit">Place order</button>
  `;
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    if (!name || !email) {
      state.message = 'Please enter a valid name and email address.';
      render();
      return;
    }
    state.user.name = name;
    state.user.email = email;
    placeOrder(formData.get('deliveryNotes').trim());
  });

  cartSection.appendChild(summaryPanel);
  cartSection.appendChild(checkoutForm);
  root.appendChild(cartSection);

  cartSection.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('change', (event) => {
      const index = Number(event.target.dataset.index);
      const quantity = Math.max(1, Number(event.target.value));
      state.cart[index].qty = quantity;
      saveState();
      render();
    });
  });

  cartSection.querySelectorAll('button[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.remove);
      state.cart.splice(index, 1);
      state.message = 'Item removed from cart.';
      saveState();
      render();
    });
  });
}

function placeOrder(notes) {
  const orderTotal = state.cart.reduce((sum, cartItem) => {
    const item = getItemById(cartItem.id);
    return sum + calculateItemTotal(item, cartItem);
  }, 0);
  const order = {
    id: `ORD-${Date.now()}`,
    date: new Date().toLocaleString(),
    customer: { ...state.user },
    notes,
    items: state.cart.map((cartItem) => ({ ...cartItem })),
    total: orderTotal,
    status: 'Placed',
    cancellation: null,
  };
  state.orderHistory.unshift(order);
  state.cart = [];
  state.message = `Order placed successfully! Your total is ${formatMoney(orderTotal)}.`;
  saveState();
  setView('history');
}

function cancelOrder(orderId, reason, comments) {
  const order = state.orderHistory.find((entry) => entry.id === orderId);
  if (!order || order.status === 'Cancelled') return;
  order.status = 'Cancelled';
  order.cancellation = {
    reason,
    comments,
    date: new Date().toLocaleString(),
  };
  state.message = `Order ${order.id} cancelled. Thank you for your feedback.`;
  saveState();
  render();
}

function openCancelDialog(orderId) {
  const order = state.orderHistory.find((entry) => entry.id === orderId);
  if (!order || order.status === 'Cancelled') return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-card">
      <h3>Cancel ${order.id}</h3>
      <p class="small-note">Please let us know why you are cancelling.</p>
      <label>Reason</label>
      <select id="cancel-reason">
        <option value="">Select a reason</option>
        <option value="Changed my mind">Changed my mind</option>
        <option value="Found a better option">Found a better option</option>
        <option value="Delivery timing was wrong">Delivery timing was wrong</option>
        <option value="Something was missing">Something was missing</option>
        <option value="Other">Other</option>
      </select>
      <label>Additional feedback</label>
      <textarea id="cancel-comments" placeholder="Tell us more (optional)"></textarea>
      <div class="button-row">
        <button class="secondary" id="cancel-close">Close</button>
        <button class="danger" id="cancel-submit">Confirm cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#cancel-close').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#cancel-submit').addEventListener('click', () => {
    const reason = overlay.querySelector('#cancel-reason').value;
    const comments = overlay.querySelector('#cancel-comments').value.trim();
    if (!reason) {
      alert('Please choose a cancellation reason.');
      return;
    }
    cancelOrder(orderId, reason, comments);
    overlay.remove();
  });
}

function renderHistory() {
  const historySection = createSection('Order History', 'Review past orders and details saved locally in your browser.');
  historySection.appendChild(renderMessage() || document.createElement('div'));

  if (state.orderHistory.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<p>No orders have been placed yet. Start by adding items to your cart.</p>`;
    historySection.appendChild(empty);
    root.appendChild(historySection);
    return;
  }

  state.orderHistory.forEach((order) => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="card-row">
        <div>
          <h3>${order.id}</h3>
          <p class="small-note">${order.status === 'Cancelled' ? 'Cancelled on ' + order.cancellation.date : 'Placed on ' + order.date}</p>
        </div>
        <span class="badge">${order.status}</span>
      </div>
      <p class="small-note">Customer: ${order.customer.name} · ${order.customer.email}</p>
      <p class="small-note">Total: <strong>${formatMoney(order.total)}</strong></p>
      <div class="tag-list">${order.items
        .map((item) => `<span class="badge">${getItemById(item.id).name} x${item.qty}</span>`)
        .join('')}</div>
      ${order.status === 'Cancelled' ? `<div class="small-note"><p><strong>Cancellation reason:</strong> ${order.cancellation.reason}</p><p><strong>Feedback:</strong> ${order.cancellation.comments || 'None provided.'}</p></div>` : ''}
      ${order.status !== 'Cancelled' ? `<button class="secondary" data-cancel="${order.id}">Cancel order</button>` : ''}
    `;
    historySection.appendChild(card);
    const cancelButton = card.querySelector('[data-cancel]');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => openCancelDialog(order.id));
    }
  });
  root.appendChild(historySection);
}

function renderProfile() {
  const profileSection = createSection('Profile & Settings', 'Update your display name, email, and local app preferences.');
  const profileForm = document.createElement('form');
  profileForm.className = 'input-group';
  profileForm.innerHTML = `
    <label>Name</label>
    <input name="name" type="text" placeholder="Your name" value="${state.user.name === 'Guest' ? '' : state.user.name}" />
    <label>Email</label>
    <input name="email" type="email" placeholder="you@example.com" value="${state.user.email}" />
    <button class="primary" type="submit">Save profile</button>
  `;
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(profileForm);
    state.user.name = formData.get('name').trim() || 'Guest';
    state.user.email = formData.get('email').trim();
    state.message = 'Profile saved locally.';
    saveState();
    render();
  });

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'danger';
  clearButton.textContent = 'Clear saved data';
  clearButton.addEventListener('click', () => {
    if (!confirm('This will clear your cart, order history, and profile data from this browser. Continue?')) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    state.cart = [];
    state.orderHistory = [];
    state.user = { name: 'Guest', email: '' };
    state.message = 'Saved data cleared.';
    render();
  });

  const panel = document.createElement('div');
  panel.className = 'profile-panel';
  panel.innerHTML = `
    <p class="small-note">Local state is stored with localStorage. This is a demo app, not a real login system.</p>
  `;
  profileSection.appendChild(profileForm);
  profileSection.appendChild(panel);
  profileSection.appendChild(clearButton);
  profileSection.appendChild(renderMessage() || document.createElement('div'));
  root.appendChild(profileSection);
}

function renderContent() {
  switch (state.view) {
    case 'menu':
      renderMenu();
      break;
    case 'item':
      renderItemDetail();
      break;
    case 'cart':
      renderCart();
      break;
    case 'history':
      renderHistory();
      break;
    case 'profile':
      renderProfile();
      break;
    default:
      renderHome();
  }
}

function render() {
  renderNav();
  clearRoot();
  renderContent();
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();

  document.addEventListener('navigateMenu', () => setView('menu'));
});
