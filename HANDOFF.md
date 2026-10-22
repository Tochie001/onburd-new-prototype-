# Onburd prototype: developer handoff

This repo is a clickable HTML/CSS/JS prototype. It is the design spec, not production code.
Rebuild the screens in the product's own stack, using this repo for exact styling, behaviour and content.

Open `index.html` in a browser (no install, no build). Use the **Screens** button to jump to any screen.

## Screen status

Only build screens marked **Ready for dev**. Screens marked **In design** will still change.

| Area | Screen | Route | Status |
|---|---|---|---|
| Home | Homepage v1 (photo hero, product tabs, rails) | `#home` | **Ready for dev** |
| Home | Homepage skeleton loader | `#home` (first load) | **Ready for dev** |
| Home | Homepage v2 (framed left-aligned hero) | `#home2` | Alternative, not chosen yet |
| Flights | Search widget: trip type, cabin, airport picker, calendar, travellers, multi-city | `#home~flights` | **Ready for dev** |
| Flights | Search loader (pop-up card) | on search | **Ready for dev** |
| Flights | Results listing: fare matrix, filters, flight cards, more flights | `#flights` | **Ready for dev** |
| Flights | Flight details pop-up | View flight details | **Ready for dev** |
| Flights | Share with friends pop-up | share buttons | **Ready for dev** |
| Flights | Traveller details | `#flight-trip` | In design |
| Flights | Extras | `#flight-extras` | In design |
| Checkout | Payment (Pay Small Small, card, transfer), confirmation | `#pay~flight`, `#confirmed` | In design |
| Events | Listing, detail, tickets | `#events`, `#event~…` | In design |
| Experiences | Listing, detail | `#experiences`, `#experience~…` | In design |
| Experiences | Checkout (contact details + Paystack payment) | `#exp-checkout~…` | In design |
| Movies | Now showing, showtimes and seats | `#movies`, `#movie~…` | In design |
| Travel extras | Airport add-ons | `#extras` | In design |
| Hotels | Results | `#hotels` | Hidden for now |
| Account | Sign in, OTP, sign up, bookings, booking detail, profile | `#signin`, `#bookings`, … | In design |

## Where things live

| File | Contents |
|---|---|
| `css/onburd.css` | Design tokens at the top of the file (colours, type scale, radii, shadows), then every component |
| `js/data.js` | All sample content and data shapes: airports, flights, fare matrix, events, experiences, bookings |
| `js/ui.js` | Shared components: nav, footer, cards, share pop-up, order summary |
| `js/pages-home.js` | Homepage, hero, search widget, airport picker, calendar, travellers, skeleton |
| `js/pages-flights.js` | Results, flight cards, details pop-up, search loader, checkout, payment |
| `js/pages-discover.js` | Events, experiences, movies, hotels, travel extras |
| `js/pages-account.js` | Auth and account screens |
| `js/app.js` | Routing, state and all interactions |
| `assets/` | Images, logos, airline logos, video |

## Rules built into the prototype

- Dates: past dates are disabled. Return can't be before departure. In multi-city, each flight can't be before the previous one.
- Travellers: at least 1 adult, at most 9 travellers, no more infants than adults. Ages follow IATA (infant under 2, child 2–11, adult 12+) and are checked against the first departure date.
- Airport picker: search matches city, country, airport name or code. The airport chosen in From is excluded from To. Picking From moves to To, and picking To opens the calendar.
- Results: sorted cheapest first. The first card is tagged Cheapest and the second Fastest.
- Search loader: blocks the page until results return.
- Saved passenger details fill in only when the user taps "Use my saved details".

## Placeholder data that needs real APIs

- Flights, fares, fare matrix, booking class letters, codeshare operator, segment times
- Airport list, popular cities, recent searches
- Homepage rails (deals, events, experiences)
- Loader and skeleton timings: these are fixed in the demo. In production, show them until the API responds.

## Prototype-only (do not build)

- The **Screens** button and drawer
- Demo login
- Toast messages that stand in for unbuilt features

## Open decisions

- Price format: flight cards use `NGN 1,036,200`, everywhere else uses `₦1,036,200`
- Button corners: flight cards use 8px radius, other buttons are pills
- Hotels is hidden from navigation for now

## Changelog

New design changes are committed with a short message describing the screen and change.
Use `git log` or GitHub's commit history to see what changed since your last pull.
