Your project must take the whole semester with AI helping you. That's a higher bar than you think, because AI is fast at exactly the part you're imagining right now.

A project is big enough if it has:

At least five distinct screens or views — not five sections of one page.
At least three features that hold and change state — a cart, a score, a saved list, a filter, a booking.
Data-driven rendering — content comes from JavaScript data, never from copy-pasted HTML.
Responsive design — it works on a phone and on a laptop.
Polish — empty states, input validation, confirmations, loading states, transitions, a consistent visual design.

Frontend Only

Everything runs in the browser. There is no server, no database, and no API you control.


You can use:

    HTML, CSS, vanilla JavaScript
    A JavaScript framework — React, Vue, Nuxt, Next, Svelte
    npm packages, a build step, a dev server
    localStorage to save data
    Hardcoded JSON / JS data files
    Google Fonts, icon libraries, CSS frameworks

You cannot use:

	A backend of any kind — Express, PHP, Laravel, .NET
    A real database — MySQL, PostgreSQL, MongoDB, Firebase
    Server routes, API routes, or anything under server/
    User accounts with real passwords
    Payment processing
    A language that isn't JavaScript or TypeScript

Choosing Your Stack

Vanilla HTML, CSS and JavaScript is the default, and it's a completely valid choice. Every concept this course has taught you applies directly, and nothing stands between you and the code.

What this means in practice

"Saving data" means localStorage. Your data lives in one browser on one computer, and that's fine — just be honest about it in your README.
"Logging in" means a fake login screen backed by localStorage. It's a demo of the interface, not real security. Never treat it as real.
"Products" or "levels" or "menu items" live in a JavaScript array of objects that you write.

Project Directions
Anything is fair game as long as it clears the size bar. Some directions:

Type:
Cafe / restaurant
Example:
Order system with a menu, cart, order queue, and receipt
What makes it semester-sized:
Menu browsing, customization, cart math, order history