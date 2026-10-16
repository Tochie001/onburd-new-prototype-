window.OB = window.OB || {};
(() => {
  const { icon, esc } = OB;

  const colors = [
    ['Brand blue', '--blue', '#2C90FF', 'Primary buttons, links, active states'],
    ['Blue 600', '--blue-600', '#1878E6', 'Hover on primary'],
    ['Blue 50', '--blue-50', '#EDF6FF', 'Soft fills, icon bubbles, footer'],
    ['Ink', '--ink', '#101828', 'Headings and body text'],
    ['Ink 2', '--ink-2', '#344054', 'Secondary text, labels'],
    ['Muted', '--muted', '#667085', 'Meta text, hints'],
    ['Line', '--line', '#E4E7EC', 'Card borders, dividers'],
    ['Page', '--page', '#F6F9FF', 'App background'],
    ['Navy', '--navy', '#172A3F', 'Footer base, search bar band'],
    ['Navy 2', '--navy-2', '#1A408D', 'Newsletter gradient start'],
    ['Slate', '--slate', '#1E3138', 'Dark promo surfaces'],
    ['PSS orange', '--pss', '#F58220', 'Pay Small Small only'],
    ['Success', '--success', '#12B76A', 'Confirmed, refundable, added'],
    ['Danger', '--danger', '#F04438', 'Errors, remove actions']
  ];

  const type = [
    ['Display', '--fs-display', '48 / 700', 'Book your next trip'],
    ['H1', '--fs-h1', '34 / 700', 'Traveller details'],
    ['H2', '--fs-h2', '24 / 700', 'Popular events this season'],
    ['H3', '--fs-h3', '20 / 700', 'Personal details'],
    ['H4', '--fs-h4', '17 / 700', 'Lagos → London'],
    ['Body', '--fs-body', '15 / 400', 'Flights, hotels, concerts and cinema tickets across Africa.'],
    ['Small', '--fs-sm', '14 / 500', 'Return, 1 adult, taxes included'],
    ['Caption', '--fs-xs', '13 / 500', 'Fri, 18 Dec · 8:00 PM']
  ];

  const changes = [
    ['One typeface', 'Two fonts were in use: a rounded geometric face on discovery pages and a Roboto-style face on the flight checkout. Everything now uses Figtree.'],
    ['One navigation bar', 'Five nav variants (Travel Extras / Plan a Trip / Explore…, and Create Account vs Create Event as the main CTA) became one: Travel extras, My bookings, currency, Log in, Create account. It turns transparent over photo heroes.'],
    ['One footer', 'The light 2022 footer and the dark 2026 footer are merged: light link area, navy base bar, current year.'],
    ['Six consistent hero tabs', 'Flights, Hotels, Events, Experiences, Movies and Travel extras. Each tab changes only the photo and the search fields. The rails below keep the same order, with the selected product moved to the top.'],
    ['One card system', 'Event, flight deal, experience, hotel and dining cards share one frame: 4:3 photo, title, two meta lines, price row. Movies use a 2:3 poster.'],
    ['Pill buttons everywhere', 'Square checkout buttons and pill homepage buttons were mixed. All buttons are now pills, in three sizes.'],
    ['Section headers', '"View More" links and arrow buttons appeared on different rails. Every rail now has a title, an optional subtitle, "View all" and arrows.'],
    ['Checkout steps', 'Flight steps were Flight Search, Traveller Info, Review, Payment, but "Review" showed extras. Renamed to Select flight, Traveller details, Extras, Payment. Other products use a two-step version.'],
    ['Shared payment page', 'Pay Small Small, card and bank transfer appear the same way for every product. The bank account stays masked until the customer asks to see it.'],
    ['Real content', 'Placeholder text (Lorem Ipsum, nine copies of "Spiderman: The Return", every route "Lagos → London", every package "6 days at ITC Grand Goa") was replaced with believable listings, prices and copy.'],
    ['One width', 'Frames at 1440px and 1728px are unified on a 1200px content column that adapts down to phone width.'],
    ['Opt-in autofill', 'Saved passenger details fill in only after the customer taps "Use my saved details".'],
    ['Screens added to close gaps', 'Event detail with ticket tiers, movie showtimes with a seat map, hotel results, a booking confirmation and a hub of My bookings states. These were missing, so some flows had dead ends.']
  ];

  OB.pages.system = () => `
    ${OB.nav()}
    ${OB.pageBand('Onburd design system', 'The tokens and components every screen in this prototype is built from.', [['Home', 'home'], ['Design system', '']])}
    <main class="container page-body">
      <section class="section" aria-labelledby="ch-h">
        <div class="section-head"><div><h2 id="ch-h">What changed from the Figma</h2><p>Inconsistencies found across 33 frames in “This one might make it, let’s see”, and how each was resolved.</p></div></div>
        <ul class="change-list panel" style="padding-block:4px">${changes.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join('')}</ul>
      </section>

      <section class="section" aria-labelledby="c-h">
        <div class="section-head"><div><h2 id="c-h">Colour</h2><p>Sampled from the Figma exports. Use the token, never the raw hex.</p></div></div>
        <div class="ds-grid">${colors.map(([n, t, h, use]) => `<div class="swatch"><i style="background:var(${t})"></i><div><strong>${n}</strong><code>${t} · ${h}</code><span class="muted">${use}</span></div></div>`).join('')}</div>
      </section>

      <section class="section" aria-labelledby="t-h">
        <div class="section-head"><div><h2 id="t-h">Type</h2><p>Figtree throughout. Sizes in px, weight after the slash.</p></div></div>
        <div class="panel" style="padding-block:4px">${type.map(([n, t, s, sample]) => `<div class="type-row"><div><strong>${n}</strong><br><code>${t} · ${s}</code></div><div style="font-size:var(${t});font-weight:${s.split('/ ')[1]};line-height:1.2;min-width:0">${esc(sample)}</div></div>`).join('')}</div>
      </section>

      <section class="section" aria-labelledby="b-h">
        <div class="section-head"><div><h2 id="b-h">Buttons, chips &amp; badges</h2></div></div>
        <div class="panel stack" style="gap:20px">
          <div class="ds-specimen"><button class="btn btn-primary btn-lg">Primary large</button><button class="btn btn-primary">Primary</button><button class="btn btn-secondary">Secondary</button><button class="btn btn-soft">Soft</button><button class="btn btn-ghost">Ghost</button><button class="btn btn-primary btn-sm">Small</button><button class="btn btn-primary" disabled>Disabled</button></div>
          <div class="ds-specimen"><button class="chip" aria-pressed="true">Selected chip</button><button class="chip" aria-pressed="false">Chip</button><span class="badge">Info</span><span class="badge badge-success">Refundable</span><span class="badge badge-warning">12 seats left</span><span class="badge badge-danger">Cancelled</span><span class="badge badge-neutral">PG-13</span><span class="badge badge-pss">Pay Small Small</span><span class="badge badge-solid">Selling fast</span></div>
          <div class="ds-specimen">${OB.pss(208400)}<div class="qty"><button type="button" aria-label="Less">${icon('minus')}</button><output>2</output><button type="button" aria-label="More">${icon('plus')}</button></div><span class="toggle"><input type="checkbox" checked aria-label="Toggle example"><span></span></span><button class="icon-btn" aria-label="Back">${icon('chevronLeft')}</button></div>
          <p class="ds-note">Pay Small Small orange is reserved for instalment features. Do not use it for general emphasis or sale badges.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="f-h">
        <div class="section-head"><div><h2 id="f-h">Form fields</h2></div></div>
        <div class="panel"><div class="form-grid">
          <div class="field-group col-4"><label for="ds-1">Label</label><input class="input" id="ds-1" placeholder="Placeholder"><span class="hint">Hint text explains format.</span></div>
          <div class="field-group col-4"><label for="ds-2">Select</label><select class="select" id="ds-2"><option>Nigerian</option></select></div>
          <div class="field-group col-4"><label for="ds-3">Error state</label><input class="input is-invalid" id="ds-3" value="adaeze@"><span class="error">Enter a valid email address, like name@example.com.</span></div>
          <div class="col-12"><form class="search-card" style="max-width:none;box-shadow:none;border:1px solid var(--line)" data-form="search">${OB.searchForm('events')}</form></div>
        </div></div>
      </section>

      <section class="section" aria-labelledby="k-h">
        <div class="section-head"><div><h2 id="k-h">Cards</h2><p>All share one frame: 10px inset, 12px media radius, 16px card radius.</p></div></div>
        <div class="grid-4">${OB.eventCard(OB.events[0])}${OB.dealCard(OB.flightDeals[0])}${OB.expCard(OB.experiences[0])}${OB.movieCard(OB.movies[1])}</div>
      </section>

      <section class="section" aria-labelledby="i-h">
        <div class="section-head"><div><h2 id="i-h">Icons</h2><p>2px stroke, round caps, 24px grid. Swap in the team’s icon library when it is ready.</p></div></div>
        <div class="panel" style="display:flex;flex-wrap:wrap;gap:18px;font-size:22px;color:var(--ink-2)">${Object.keys(OB.ICONS).map((k) => `<span title="${k}">${icon(k)}</span>`).join('')}</div>
      </section>
    </main>
    ${OB.footer()}`;
})();
