const state = {
  view: 'auth',
  authMode: 'login',
  isAuthenticated: false,
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
