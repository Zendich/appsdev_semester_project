const foodImages = {
  margherita: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85',
  'bbq-chicken': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85',
  'greek-salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
  'caesar-salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=85',
  'beef-burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
  'veggie-burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85',
  'classic-wings': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=900&q=85',
  'garlic-fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',
  'truffle-risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=85',
  'prawn-alfredo': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85',
  'sushi-platter': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85',
  'steak-frites': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85',
  'chocolate-mousse': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85',
};

function renderHome() {
  const welcome = createSection('Welcome to Golden Palate', 'A polished restaurant demo with menu browsing, cart, orders, and local state persistence.');
  const hero = document.createElement('div');
  hero.className = 'hero-panel';
  hero.innerHTML = `
    <div class="hero-content">
      <span class="eyebrow">Chef-curated experience</span>
      <h3>Good food makes room for everyone.</h3>
      <p class="text-muted">Seasonal favorites, generous portions, and little details worth slowing down for.</p>
    </div>
    <figure class="hero-photo"><img src="${foodImages.margherita}" alt="Freshly baked pizza with basil and tomatoes" /><figcaption>Made fresh, served with care</figcaption></figure>
    <div class="hero-stats">
      <div class="stat-card"><strong>4.9/5</strong><span>guest rating</span></div>
      <div class="stat-card"><strong>24/7</strong><span>support</span></div>
      <div class="stat-card"><strong>Fast</strong><span>local delivery</span></div>
    </div>`;
  welcome.appendChild(hero);

  const quickActions = document.createElement('div');
  quickActions.className = 'tag-list';
  [['Menu', 'menu', 'Browse the menu'], ['Cart', 'cart', 'View cart'], ['Orders', 'history', 'See order history'], ['Profile', 'profile', 'Edit profile']].forEach(([, view, text]) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'secondary';
    button.onclick = () => setView(view);
    quickActions.appendChild(button);
  });
  welcome.appendChild(quickActions);

  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight-grid';
  menuItems.slice(0, 3).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'mini-card';
    card.innerHTML = `<img src="${foodImages[item.id]}" alt="${item.name}" loading="lazy" /><h4>${item.name}</h4><p>${item.description}</p>`;
    spotlight.appendChild(card);
  });
  welcome.appendChild(spotlight);
  root.appendChild(welcome);
}

function renderMenu() {
  const section = createSection('Menu', 'Browse items by category, search by name, and customize orders.');
  const controls = document.createElement('div');
  controls.className = 'card-row';
  controls.innerHTML = `<div class="input-group"><label for="item-search">Search menu</label><input id="item-search" type="search" placeholder="Search items..." value="${state.search}" /></div>`;
  section.appendChild(controls);

  const filters = document.createElement('div');
  filters.className = 'tag-list';
  ['All', ...new Set(menuItems.map((item) => item.category))].forEach((category) => {
    const button = document.createElement('button');
    button.textContent = category;
    button.className = state.category === category ? 'active' : '';
    button.onclick = () => setCategory(category);
    filters.appendChild(button);
  });
  section.appendChild(filters);
  controls.querySelector('#item-search').addEventListener('input', (event) => setSearch(event.target.value));

  const items = menuItems.filter((item) => {
    const matchesCategory = state.category === 'All' || item.category === state.category;
    const query = state.search.toLowerCase();
    return matchesCategory && (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
  });
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<p>No menu items match your search or category.</p>';
    section.appendChild(empty);
  } else {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.innerHTML = `<img class="menu-image" src="${foodImages[item.id]}" alt="${item.name}" loading="lazy" /><h3>${item.name}</h3><p>${item.description}</p><div class="meta"><span class="badge">${item.category}</span><span><strong>${formatMoney(item.price)}</strong></span></div><p class="small-note">Sizes: ${item.sizes.join(', ')}</p>`;
      const actions = document.createElement('div');
      actions.className = 'button-row';
      const customize = document.createElement('button');
      customize.className = 'secondary';
      customize.textContent = 'Customize';
      customize.onclick = () => setView('item', item.id);
      const add = document.createElement('button');
      add.className = 'primary';
      add.textContent = 'Add to cart';
      add.onclick = () => addToCart(item.id);
      actions.append(customize, add);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    section.appendChild(grid);
  }
  root.appendChild(section);
}

function renderItemDetail() {
  const item = getItemById(state.selectedItemId);
  if (!item) {
    root.appendChild(createSection('Item not found', 'Return to the menu and choose a valid item.'));
    return;
  }
  const section = createSection(item.name, item.description);
  const form = document.createElement('form');
  form.className = 'input-group';
  form.innerHTML = `<label>Choose size</label><select name="size">${item.sizes.map((size) => `<option value="${size}">${size}</option>`).join('')}</select><label>Quantity</label><input name="qty" type="number" min="1" value="1" /><p>Extras ($1.25 each)</p><div class="tag-list">${item.extras.map((extra) => `<label><input type="checkbox" value="${extra}" /> ${extra}</label>`).join('')}</div><label>Special notes</label><textarea name="notes" placeholder="Add delivery notes or requests..."></textarea><p class="small-note">Base price ${formatMoney(item.price)} · ${item.sizes.length} size option(s) · ${item.extras.length} extra(s)</p><button class="primary" type="submit">Add to cart</button>`;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addToCart(item.id, {
      qty: Number(form.elements.qty.value) || 1,
      size: form.elements.size.value,
      extras: Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value),
      notes: form.elements.notes.value.trim(),
    });
  });
  section.appendChild(form);
  root.appendChild(section);
}

function renderCart() {
  const section = createSection('Your Cart', 'Review items, update quantities, and complete checkout.');
  section.appendChild(renderMessage() || document.createElement('div'));
  if (state.cart.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<p>Your cart is empty right now.</p><button class="primary">Browse menu</button>';
    empty.querySelector('button').onclick = () => setView('menu');
    section.appendChild(empty);
    root.appendChild(section);
    return;
  }

  const list = document.createElement('div');
  state.cart.forEach((cartItem, index) => {
    const item = getItemById(cartItem.id);
    const card = document.createElement('div');
    card.className = 'cart-item';
    card.innerHTML = `<div><h4>${item.name}</h4><p class="item-meta">${cartItem.size} · ${cartItem.extras.length ? `Extras: ${cartItem.extras.join(', ')}` : 'No extras'}</p>${cartItem.notes ? `<p class="small-note">Notes: ${cartItem.notes}</p>` : ''}<p class="small-note">${formatMoney(item.price)} each + ${cartItem.extras.length ? formatMoney(cartItem.extras.length * 1.25) : '$0.00'} extras</p></div><div class="cart-item-controls"><input type="number" min="1" value="${cartItem.qty}" /><button class="secondary">Remove</button></div>`;
    card.querySelector('input').addEventListener('change', (event) => {
      state.cart[index].qty = Math.max(1, Number(event.target.value));
      saveState();
      render();
    });
    card.querySelector('button').onclick = () => {
      state.cart.splice(index, 1);
      state.message = 'Item removed from cart.';
      saveState();
      render();
    };
    list.appendChild(card);
  });
  section.appendChild(list);

  const total = state.cart.reduce((sum, cartItem) => sum + calculateItemTotal(getItemById(cartItem.id), cartItem), 0);
  const summary = document.createElement('div');
  summary.className = 'cart-summary';
  summary.innerHTML = `<h3>Order Summary</h3><p class="text-muted">${getCartCount()} items in cart</p><p><strong>Total: ${formatMoney(total)}</strong></p>`;
  section.appendChild(summary);

  const checkout = document.createElement('form');
  checkout.className = 'input-group';
  checkout.innerHTML = '<h3>Checkout Details</h3><label>Name</label><input name="name" type="text" placeholder="Your name" required /><label>Email</label><input name="email" type="email" placeholder="you@example.com" required /><label for="order-type">Order type</label><select id="order-type" name="orderType"><option value="dine-in">Dine in</option><option value="takeout" selected>Takeout</option></select><label>Order notes</label><textarea name="deliveryNotes" placeholder="Optional notes for the kitchen"></textarea><button class="success" type="submit">Place order</button>';
  checkout.elements.name.value = state.user.name === 'Guest' ? '' : state.user.name;
  checkout.elements.email.value = state.user.email;
  checkout.onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(checkout);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    if (!name || !email) {
      state.message = 'Please enter a valid name and email address.';
      render();
      return;
    }
    state.user = { name, email };
    placeOrder(data.get('deliveryNotes').trim(), data.get('orderType'));
  };
  section.appendChild(checkout);
  root.appendChild(section);
}

function renderHistory() {
  const section = createSection('Order History', 'Review past orders and details saved locally in your browser.');
  section.appendChild(renderMessage() || document.createElement('div'));
  if (state.orderHistory.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<p>No orders have been placed yet. Start by adding items to your cart.</p>';
    section.appendChild(empty);
  } else {
    state.orderHistory.forEach((order) => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `<div class="card-row"><div><h3>${order.id}</h3><p class="small-note">${order.status === 'Cancelled' ? `Cancelled on ${order.cancellation.date}` : `Placed on ${order.date}`}</p></div><span class="badge">${order.status}</span></div><p class="small-note">Customer: ${order.customer.name} · ${order.customer.email}</p>${order.orderType ? `<p class="small-note">Order type: ${order.orderType === 'dine-in' ? 'Dine in' : 'Takeout'}</p>` : ''}<p class="small-note">Total: <strong>${formatMoney(order.total)}</strong></p><div class="tag-list">${order.items.map((item) => `<span class="badge">${getItemById(item.id).name} x${item.qty}</span>`).join('')}</div>${order.status === 'Cancelled' ? `<div class="small-note"><p><strong>Cancellation reason:</strong> ${order.cancellation.reason}</p><p><strong>Feedback:</strong> ${order.cancellation.comments || 'None provided.'}</p></div>` : ''}${order.status !== 'Cancelled' ? '<button class="secondary">Cancel order</button>' : ''}`;
      const cancelButton = card.querySelector('button');
      if (cancelButton) cancelButton.onclick = () => openCancelDialog(order.id);
      section.appendChild(card);
    });
  }
  root.appendChild(section);
}

function renderProfile() {
  const section = createSection('Profile & Settings', 'Update your display name, email, and local app preferences.');
  const form = document.createElement('form');
  form.className = 'input-group';
  form.innerHTML = '<label>Name</label><input name="name" type="text" placeholder="Your name" /><label>Email</label><input name="email" type="email" placeholder="you@example.com" /><button class="primary" type="submit">Save profile</button>';
  form.elements.name.value = state.user.name === 'Guest' ? '' : state.user.name;
  form.elements.email.value = state.user.email;
  form.onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(form);
    state.user = { name: data.get('name').trim() || 'Guest', email: data.get('email').trim() };
    state.message = 'Profile saved locally.';
    saveState();
    render();
  };
  const signOutButton = document.createElement('button');
  signOutButton.type = 'button';
  signOutButton.className = 'secondary';
  signOutButton.textContent = 'Sign out';
  signOutButton.onclick = signOut;
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'danger';
  clearButton.textContent = 'Clear saved data';
  clearButton.onclick = () => {
    if (!confirm('This will clear your cart, order history, and profile data from this browser. Continue?')) return;
    localStorage.removeItem(STORAGE_KEY);
    state.cart = [];
    state.orderHistory = [];
    state.user = { name: 'Guest', email: '' };
    state.message = 'Saved data cleared.';
    render();
  };
  section.append(form, signOutButton, clearButton, renderMessage() || document.createElement('div'));
  root.appendChild(section);
}

function renderAuth() {
  const isSignup = state.authMode === 'signup';
  const screen = document.createElement('section');
  screen.className = 'auth-layout';
  screen.innerHTML = `
    <aside class="auth-story">
      <span class="eyebrow">Golden Palate</span>
      <h2>Your table is waiting.</h2>
      <p>Sign in to keep your details close and get back to the dishes you love.</p>
      <div class="auth-story-note"><span aria-hidden="true">01</span><span>Thoughtful food, made for sharing.</span></div>
    </aside>
    <div class="auth-form-panel">
      <div class="auth-heading"><p class="eyebrow">Your account</p><h2>${isSignup ? 'Create an account' : 'Welcome back'}</h2><p class="text-muted">${isSignup ? 'A few details and you are ready to order.' : 'Enter your details to continue.'}</p></div>
      <div class="auth-tabs" role="group" aria-label="Account action">
        <button type="button" data-auth-mode="login" class="${isSignup ? '' : 'active'}" aria-pressed="${!isSignup}">Log in</button>
        <button type="button" data-auth-mode="signup" class="${isSignup ? 'active' : ''}" aria-pressed="${isSignup}">Sign up</button>
      </div>
      <form class="auth-form" novalidate>
        ${isSignup ? '<label for="auth-name">Your name</label><input id="auth-name" name="name" type="text" autocomplete="name" placeholder="e.g. Alex Morgan" required />' : ''}
        <label for="auth-email">Email address</label>
        <input id="auth-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
        <label for="auth-password">Password</label>
        <input id="auth-password" name="password" type="password" autocomplete="${isSignup ? 'new-password' : 'current-password'}" placeholder="At least 8 characters" minlength="8" required />
        ${isSignup ? '<label for="auth-confirm-password">Confirm password</label><input id="auth-confirm-password" name="confirmPassword" type="password" autocomplete="new-password" placeholder="Enter your password again" minlength="8" required />' : ''}
        <p class="auth-demo-note">Demo only. This browser-only project does not verify accounts or store passwords. Connect a secure backend for real authentication.</p>
        <p class="auth-error" role="alert" aria-live="polite"></p>
        <button class="primary auth-submit" type="submit">${isSignup ? 'Create account' : 'Log in'}</button>
      </form>
    </div>`;

  screen.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.authMode = button.dataset.authMode;
      render();
    });
  });

  const form = screen.querySelector('.auth-form');
  form.elements.email.value = state.user.email;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const error = screen.querySelector('.auth-error');
    if (!email || !form.elements.email.validity.valid || password.length < 8) {
      error.textContent = 'Enter a valid email and a password with at least 8 characters.';
      return;
    }

    if (isSignup) {
      const name = form.elements.name.value.trim();
      if (!name) {
        error.textContent = 'Enter your name to create an account.';
        return;
      }
      if (password !== form.elements.confirmPassword.value) {
        error.textContent = 'Those passwords do not match.';
        return;
      }
      state.user = { name, email };
    } else {
      const savedName = state.user.email.toLowerCase() === email.toLowerCase() ? state.user.name : '';
      state.user = { name: savedName || email.split('@')[0], email };
    }

    saveState();
    state.isAuthenticated = true;
    state.view = 'menu';
    state.message = 'Demo profile ready. Account credentials are not verified.';
    render();
  });

  root.appendChild(screen);
}

function renderContent() {
  if (!state.isAuthenticated) {
    renderAuth();
    return;
  }

  switch (state.view) {
    case 'menu': renderMenu(); break;
    case 'item': renderItemDetail(); break;
    case 'cart': renderCart(); break;
    case 'history': renderHistory(); break;
    case 'profile': renderProfile(); break;
    case 'auth': renderAuth(); break;
    default: renderHome();
  }
}
