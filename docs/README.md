# Golden Palate

A frontend-only restaurant ordering app built for the semester project.

## Features

- Menu browsing with category filters and search
- Item detail customization with extras and quantity selection
- Cart state, quantity updates, and live totals
- Checkout form with input validation and local order saving
- Order history saved in `localStorage`
- Responsive layout for mobile and desktop
- Login and sign-up screens for the frontend demo

## Files

- `index.html` — main entry point
- `css/styles.css` — app styling
- `js/data.js` — menu item data
- `js/script.js` — app bootstrap and render entry point
- `js/app-state.js` — application state and localStorage persistence
- `js/app-utils.js` — shared formatting, navigation, and DOM helpers
- `js/app-actions.js` — cart, checkout, and order actions
- `js/app-views.js` — screen rendering for home, menu, cart, orders, and profile

## Usage

1. Open `index.html` in a browser.
2. Browse the menu, customize any item, and add it to your cart.
3. Review the cart, update quantities, and place an order.
4. Visit the Orders screen to see saved order history.
5. Use the Profile screen to update your local name and email.
6. Sign in or create an account to open the menu. Reloading the page returns to sign-in.

## Notes

- The app runs entirely in the browser.
- There is no backend, database, or real authentication. Login and sign-up are UI demos; passwords are neither verified nor stored.
- All state is stored locally using `localStorage`.
