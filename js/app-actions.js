function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
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
  state.view = 'menu';
  state.selectedItemId = null;
  render();
  showToast(state.message);
}

function placeOrder(notes, orderType) {
  const orderTotal = state.cart.reduce((sum, cartItem) => {
    const item = getItemById(cartItem.id);
    return sum + calculateItemTotal(item, cartItem);
  }, 0);
  const order = {
    id: `ORD-${Date.now()}`,
    date: new Date().toLocaleString(),
    customer: { ...state.user },
    orderType,
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
