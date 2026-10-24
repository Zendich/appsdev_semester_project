# Restaurant Ordering App Project Plan

## 1. Project concept
Build a frontend-only restaurant ordering app with:
- a menu browser
- item customization
- cart/checkout flow
- saved order history
- responsive UI for mobile and desktop

This meets the semester project bar: 5+ views, 3+ stateful features, data-driven rendering, and polish.

---

## 2. Required screens / views
1. **Home** / Landing page
2. **Menu** browsing page
3. **Item details** / customization page
4. **Cart** / checkout page
5. **Order history** / saved orders page
6. **Profile** or **Settings** page (optional fake login)

---

## 3. Core stateful features
- Cart state with quantities, customizations, and totals
- Filter/search state for menu browsing
- Saved favorites / order history persisted in `localStorage`
- Optional: fake login/profile state backed by `localStorage`

---

## 4. Data-driven architecture
- Store menu items in a JS/JSON data file
- Render all menus, categories, and order history from that data
- Do not hardcode menu HTML; generate it from arrays/objects

---

## 5. Tech stack recommendation
- Option A: Vanilla HTML, CSS, JavaScript
- Option B: React + Vite (recommended if you want better state management)
- Use `localStorage` to persist orders, cart contents, and user state

---

## 6. Milestones
1. **Setup**
   - scaffold project
   - create data file and base layout
2. **MVP**
   - implement menu browsing
   - implement item detail/customization
   - implement cart and totals
3. **Persistence**
   - save cart and history to `localStorage`
   - implement order history view
4. **Polish**
   - responsive layout
   - empty states, validation, confirmations
   - transitions, consistent theme
5. **Final**
   - test on phone/laptop
   - write README with usage and notes

---

## 7. Polish checklist
- empty cart / no search results states
- input validation on checkout
- confirmation modals for placing orders
- loading or transition effects
- consistent color/font styling
- mobile-friendly navigation and layout
- colorful UI layout

> If you want, I can turn this into a concrete feature list and task board next.
