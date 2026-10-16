# Onburd prototype

A clickable HTML prototype of the Onburd web app, rebuilt from the Figma section
"This one might make it, let's see" (file: onburd-MVPs) with one consistent design system.

## Open it

Double-click `index.html`. It runs from the file system with no install or build step.
Use the **Screens** button to jump to any screen.

**Developers: start with [HANDOFF.md](HANDOFF.md)** for which screens are ready to build.

## What's inside

| Flow | Screens |
|---|---|
| Home | Hero with product tabs (Flights, Events, Experiences, Movies, Travel extras), skeleton loader and curated rails |
| Flight booking | Results with filters and fare matrix → Traveller details → Extras → Payment → Card payment → Confirmation |
| Events | Listing → Event detail with ticket tiers → Payment |
| Experiences | Listing → Detail with gallery, itinerary and reviews → Payment |
| Movies | Now showing → Showtimes and seat map → Payment |
| Hotels & extras | Hotel results, airport add-ons with price summary |
| Account | Log in, email code, create account, My bookings, Booking details, Profile |
| Handoff | Design system page: tokens, type, components, and a log of every change from the Figma |

Payment (Pay Small Small, card, bank transfer) is one shared screen for every product.

## Files

```
index.html            page shell
css/onburd.css        design tokens (top of file) and every component style
js/data.js            all content: events, flights, experiences, prices, bookings
js/ui.js              shared components: nav, footer, cards, hero search, summary
js/pages-*.js         one file per area (home, flights, discover, account, system)
js/app.js             routing, state and interactions
assets/img/           photos cropped from the Figma exports (swap freely)
assets/brand/         onburd logo (blue and white) and favicon
_source/              Figma exports, layer data and crops used to build this
```

## Changing things

- **Colours, type, radii:** edit the `:root` tokens at the top of `css/onburd.css`.
- **Copy, prices, listings:** edit `js/data.js`.
- **Images:** replace a file in `assets/img/` and keep its name. Hero photos are
  low resolution because they were cropped from frame exports, so swap in originals when you have them.
