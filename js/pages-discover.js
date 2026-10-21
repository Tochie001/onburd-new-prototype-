window.OB = window.OB || {};
(() => {
  const { icon, img, esc, fmt } = OB;

  const pager = (pages = 6, current = 1) => `
    <nav class="pager" aria-label="Pagination">
      <button class="btn btn-secondary btn-sm" type="button" ${current === 1 ? 'disabled' : ''}>${icon('arrowLeft')} Previous</button>
      <div class="pager-pages">${[1, 2, 3, '…', pages].map((p) => p === '…' ? '<span class="muted" style="padding:8px">…</span>' : `<button type="button" ${p === current ? 'aria-current="page"' : ''} data-action="toast" data-msg="Page ${p} uses the same layout.">${p}</button>`).join('')}</div>
      <button class="btn btn-secondary btn-sm" type="button" data-action="toast" data-msg="Page 2 uses the same layout.">Next ${icon('arrowRight')}</button>
    </nav>`;

  const listSearch = (kind, title, sub) => {
    const q = OB.state.listQ[kind] || '';
    const ph = kind === 'events' ? 'Artist, event or venue' : 'Tours, day trips, spa days, places…';
    return `
    <div class="list-search"><div class="container">
      <div class="list-search-head"><h1>${title}</h1><p>${sub}</p></div>
      <form class="search-card list-search-card" data-form="list-search" role="search">
        <div class="search-fields">
          <label class="sfield q-field" for="ls-${kind}">
            <span class="sfield-icon">${icon('search')}</span>
            <span class="sfield-body"><span class="sf-label">Search ${kind}</span>
              <input id="ls-${kind}" type="search" placeholder="${ph}" value="${esc(q)}" data-action="list-q" data-kind="${kind}" autocomplete="off"></span>
          </label>
          <button class="search-go" type="submit" aria-label="Search">${icon('search')}<span class="search-go-label">Search</span></button>
        </div>
      </form>
    </div></div>`;
  };
  const matchQ = (q, fields) => !q || fields.some((v) => v.toLowerCase().includes(q.toLowerCase()));

  const cityToolbar = (label, chips, active, action) => `
    <div class="list-toolbar">
      <div class="row"><span class="text-sm" style="font-weight:600">${label}</span>
        <label class="sr-only" for="city">City</label>
        <select class="city-select" id="city"><option>Lagos</option><option>Abuja</option><option>Accra</option><option>Anywhere</option></select></div>
      <div class="row" role="group" aria-label="Filter by category" style="gap:8px;overflow-x:auto;scrollbar-width:none">
        ${chips.map((c) => `<button class="chip" type="button" data-action="${action}" data-v="${esc(c)}" aria-pressed="${c === active}">${esc(c)}</button>`).join('')}
      </div>
    </div>`;

  /* ---------- Events ---------- */
  OB.pages.events = () => {
    const cats = ['All', 'Concerts', 'Parties', 'Comedy', 'Theatre', 'Festivals', 'Food & drink'];
    const active = OB.state.eventCat;
    const q = (OB.state.listQ.events || '').trim();
    const list = OB.events.filter((e) => (active === 'All' || e.category === active) && matchQ(q, [e.title, e.venue, e.city, e.category]));
    return `
      ${OB.nav()}
      ${listSearch('events', 'Events', 'Concerts, comedy, theatre and the best parties in town.')}
      <main class="container page-body" style="gap:24px;padding-top:28px">
        ${cityToolbar('Events in', cats, active, 'event-cat')}
        ${q ? `<p class="text-sm muted">${list.length} result${list.length === 1 ? '' : 's'} for “${esc(q)}”</p>` : ''}
        ${list.length ? `<div class="grid-4">${list.map(OB.eventCard).join('')}</div>` : `<div class="panel empty">${icon('ticket')}<strong style="color:var(--ink)">${q ? `No events match “${esc(q)}”` : `No ${esc(active.toLowerCase())} events in Lagos yet`}</strong><span>${q ? 'Try an artist, venue or another category.' : 'New events are added every week.'}</span></div>`}
        ${q ? '' : pager(4)}
      </main>
      ${OB.footer()}`;
  };

  OB.eventOrder = (e) => {
    const lines = [];
    OB.ticketTiers.forEach((t) => { const q = OB.state.tickets[t.id] || 0; if (q) lines.push([`${t.name} × ${q}`, t.price * q]); });
    const sub = lines.reduce((a, [, v]) => a + v, 0);
    if (sub) lines.push(['Service fee', Math.round(sub * 0.03)]);
    return {
      kind: 'event', summaryTitle: 'Your tickets', steps: ['Choose tickets', 'Payment'], payStep: 1, back: `event~${e.id}`, ref: 'OB-47790',
      item: { img: e.img, title: e.title, sub: `${e.date} · ${e.time}` }, lines,
      confirmTitle: 'You’re going!', confirmBody: 'Your tickets are in My bookings and in your email. Show the QR code at the gate.'
    };
  };

  OB.pages.event = (id) => {
    const e = OB.find(OB.events, id);
    if (OB.state.eventId !== e.id) { OB.state.eventId = e.id; OB.state.tickets = {}; }
    const order = OB.eventOrder(e);
    const count = Object.values(OB.state.tickets).reduce((a, b) => a + b, 0);
    return `
      ${OB.nav()}
      <main class="container page-body" style="gap:40px">
        <div class="stack" style="gap:20px">
          ${OB.crumbs([['Home', 'home'], ['Events', 'events'], [e.title, '']])}
          <section class="event-hero">
            <div class="event-poster"><img src="${img(e.img)}" alt="${esc(e.title)} poster"></div>
            <div class="stack" style="gap:24px">
              <div class="detail-head">
                <div class="row"><span class="badge">${esc(e.category)}</span>${e.tag ? `<span class="badge badge-warning">${esc(e.tag)}</span>` : ''}</div>
                <h1>${esc(e.title)}</h1>
                <div class="row"><button class="btn btn-secondary btn-sm" type="button" data-action="share" data-kind="event" data-id="${e.id}">${icon('share')} Share</button>
                  <button class="btn btn-secondary btn-sm" type="button" data-action="fav" data-id="${e.id}" aria-pressed="${OB.state.favs.has(e.id)}">${icon('heart')} ${OB.state.favs.has(e.id) ? 'Saved' : 'Save'}</button></div>
              </div>
              <div class="facts">
                <div class="fact"><span class="fact-icon">${icon('calendar')}</span><div><strong>${e.date} 2026</strong><span>Starts ${e.time} · doors open 1 hour before</span></div></div>
                <div class="fact"><span class="fact-icon">${icon('pin')}</span><div><strong>${esc(e.venue)}</strong><span>${esc(e.city)} · Parking available on site</span></div></div>
                <div class="fact"><span class="fact-icon">${icon('user')}</span><div><strong>Hosted by Livespot Nation</strong><span>Verified organiser · 64 events on Onburd</span></div></div>
              </div>
              <div class="stack" style="gap:8px"><h2 style="font-size:var(--fs-h3)">About this event</h2>
                <p style="color:var(--ink-2);max-width:62ch">A night of the biggest Afrobeats hits played live with a full band, guest performances and a closing DJ set until 2am. Expect pyrotechnics, a 360° stage and food vendors from across Lagos. Ages 18 and over. Tickets are non-refundable but can be transferred to a friend in the app.</p>
              </div>
            </div>
          </section>
        </div>
        <div class="with-aside">
          <section class="stack" aria-labelledby="tickets-h" style="gap:14px">
            <h2 id="tickets-h" style="font-size:var(--fs-h2)">Choose tickets</h2>
            ${OB.ticketTiers.map((t) => {
              const q = OB.state.tickets[t.id] || 0;
              return `
              <div class="tier ${q ? 'is-selected' : ''} ${t.soldOut ? 'is-soldout' : ''}">
                <div><h4>${esc(t.name)}</h4><p>${esc(t.note)}</p><div class="price" style="margin-top:6px">${fmt(t.price)}</div></div>
                ${t.soldOut ? '<span class="badge badge-neutral">Sold out</span>' : `
                <div class="qty" role="group" aria-label="${esc(t.name)} quantity">
                  <button type="button" data-action="tickets" data-id="${t.id}" data-d="-1" ${q ? '' : 'disabled'} aria-label="Remove one">${icon('minus')}</button>
                  <output>${q}</output>
                  <button type="button" data-action="tickets" data-id="${t.id}" data-d="1" ${q >= 10 ? 'disabled' : ''} aria-label="Add one">${icon('plus')}</button>
                </div>`}
              </div>`;
            }).join('')}
            <div class="stack" style="gap:12px;margin-top:16px"><h2 style="font-size:var(--fs-h3)">Venue</h2>${OB.mapArt(e.venue)}</div>
          </section>
          <div class="aside-sticky">
            ${count ? OB.orderSummary(order, { cta: `<a class="btn btn-primary btn-lg btn-block" href="#pay~event">Continue to payment</a>`, note: `<span class="pss"><img src="assets/brand/pss-logo.svg" alt="Pay Small Small"><span class="text-xs muted">Pay 30% today, the rest over 3 months</span></span>` })
              : `<div class="summary"><h3>Your tickets</h3><p class="muted text-sm">Choose at least one ticket to continue.</p><button class="btn btn-primary btn-lg btn-block" type="button" disabled>Continue to payment</button></div>`}
            <div class="assure"><span>${icon('shield')} Verified tickets, delivered instantly</span><span>${icon('refresh')} Transfer tickets to friends any time</span></div>
          </div>
        </div>
        <section class="section">${OB.sectionHead('More events in Lagos', { href: 'events', rail: 'rail-more' })}${OB.rail('rail-more', OB.events.filter((x) => x.id !== e.id).slice(0, 6).map(OB.eventCard))}</section>
      </main>
      ${OB.mobileCta(count ? { label: `${count} ticket${count > 1 ? 's' : ''}`, amount: OB.fmt(OB.orderTotal(order)), button: '<a class="btn btn-primary" href="#pay~event">Continue</a>' }
        : { label: 'Tickets from', amount: OB.fmt(Math.min(...OB.ticketTiers.filter((t) => !t.soldOut).map((t) => t.price))), button: '<button class="btn btn-primary" type="button" data-action="scroll-to" data-target="tickets-h">Choose tickets</button>' })}
      ${OB.footer()}`;
  };

  /* ---------- Experiences ---------- */
  OB.pages.experiences = () => {
    const cats = ['All', 'Day trips', 'Tours', 'Wellness', 'Adventure', 'Food & drink'];
    const q = (OB.state.listQ.experiences || '').trim();
    const list = OB.experiences.filter((x) => matchQ(q, [x.title, x.place, x.by]));
    return `
      ${OB.nav()}
      ${listSearch('experiences', 'Experiences', 'Trips, day plans and retreats from operators we trust.')}
      <main class="container page-body" style="gap:24px;padding-top:28px">
        ${cityToolbar('Experiences from', cats, OB.state.expCat, 'exp-cat')}
        ${q ? `<p class="text-sm muted">${list.length} result${list.length === 1 ? '' : 's'} for “${esc(q)}”</p>` : ''}
        ${list.length ? `<div class="grid-4">${list.slice(0, 12).map(OB.expCard).join('')}</div>` : `<div class="panel empty">${icon('compass')}<strong style="color:var(--ink)">No experiences match “${esc(q)}”</strong><span>Try a place like Egypt or Lagos.</span></div>`}
        ${q ? '' : pager(8)}
      </main>
      ${OB.footer()}`;
  };

  OB.expOrder = (x) => {
    const n = OB.state.expGuests;
    return {
      kind: 'experience', summaryTitle: 'Your trip', steps: ['Experience', 'Contact & payment'], payStep: 1, back: `experience~${x.id}`, ref: 'OB-46102',
      item: { img: x.img, title: x.title, sub: `${x.place} · ${n} ${n === 1 ? 'adult' : 'adults'}` },
      lines: [[`${fmt(x.price)} × ${n} ${n === 1 ? 'adult' : 'adults'}`, x.price * n]],
      confirmTitle: 'Your experience is booked', confirmBody: `${x.by} will contact you within 24 hours with pickup details. Your voucher is in My bookings.`
    };
  };

  OB.pages['exp-checkout'] = (id) => {
    const x = OB.find(OB.experiences, id);
    const order = OB.expOrder(x);
    const total = OB.orderTotal(order);
    const u = OB.state.loggedIn ? OB.state.user : null;
    const xc = OB.state.xc;
    const v = (k, val) => esc(xc[k] ?? (u ? val : ''));
    const m = OB.state.xPay;
    return `
      ${OB.nav()}
      <main class="container" style="padding-block:0 72px">
        ${OB.stepper(order.steps, 1)}
        <form class="with-aside" style="margin-top:28px" data-form="exp-checkout" data-id="${x.id}" novalidate>
          <div class="stack" style="gap:24px">
            ${OB.backTitle('Contact & payment', `experience~${x.id}`)}
            <section class="panel" aria-labelledby="xc-contact">
              <div class="panel-head"><div><h2 id="xc-contact">Contact information</h2><p>We send your voucher here, and ${esc(x.by)} uses it to arrange pickup.</p></div></div>
              <div class="form-grid">
                <div class="field-group col-6"><label for="xc-first">First name</label><input class="input" id="xc-first" value="${v('first', u?.first)}" required autocomplete="given-name"></div>
                <div class="field-group col-6"><label for="xc-last">Surname</label><input class="input" id="xc-last" value="${v('last', u?.last)}" required autocomplete="family-name"></div>
                <div class="field-group col-6"><label for="xc-email">Email address</label><input class="input" id="xc-email" type="email" value="${v('email', u?.email)}" placeholder="you@example.com" required autocomplete="email"></div>
                <div class="field-group col-6"><label for="xc-phone">Phone number</label>
                  <div class="phone-input"><select class="select" id="xc-cc" aria-label="Country code"><option>🇳🇬 +234</option><option>🇬🇭 +233</option><option>🇰🇪 +254</option></select><input class="input" id="xc-phone" type="tel" value="${v('phone', '803 456 7890')}" placeholder="803 456 7890" required autocomplete="tel-national"></div></div>
                <div class="field-group col-12"><label for="xc-note">Note for the operator <span class="muted">(optional)</span></label><textarea class="textarea" id="xc-note" placeholder="Dietary needs, pickup hotel, accessibility…">${esc(xc.note || '')}</textarea></div>
              </div>
            </section>
            <section class="panel" aria-labelledby="xc-pay">
              <div class="panel-head"><div><h2 id="xc-pay">Payment</h2><p>You'll confirm the payment in a secure Paystack window.</p></div></div>
              <div class="pay-one" role="radiogroup" aria-label="Payment method">
                <label class="radio-card is-single"><input type="radio" name="xc-method" value="paystack" checked>
                  <span class="pay-one-text"><strong>Pay with card or bank</strong><small>Cards, bank transfer and USSD, processed securely by Paystack</small></span>
                  ${OB.paystackLogo()}
                </label>
              </div>
            </section>
            <div class="stack" style="gap:12px">
              <label class="check"><input type="checkbox" id="xc-terms" required ${xc.terms ? 'checked' : ''}><span>I agree to Onburd's <a href="#home">booking terms</a> and ${esc(x.by)}'s cancellation policy.</span></label>
              <p class="text-xs" id="xc-error" style="color:var(--danger-ink)" hidden>Please fill in your contact details and accept the booking terms.</p>
            </div>
            <div><button class="btn btn-primary btn-lg" type="submit">Pay ${fmt(total)}</button></div>
          </div>
          <div class="aside-sticky">${OB.orderSummary(order)}
            <div class="assure"><span>${icon('check')} Best price guaranteed</span></div>
          </div>
        </form>
      </main>
      ${OB.footer()}`;
  };

  OB.pages.experience = (id) => {
    const x = OB.find(OB.experiences, id);
    const order = OB.expOrder(x);
    const isEgypt = x.id === 'egypt-nile';
    const gal = isEgypt ? ['egypt-pyramid', 'egypt-pyramid-walk', 'egypt-camel', 'egypt-nile-cruise', 'egypt-balloon'] : [x.img, 'exp-beach-retreat', 'exp-floating-breakfast', 'exp-waterfall', 'who-solo'];
    return `
      ${OB.nav()}
      <main class="container page-body" style="gap:32px">
        <div class="stack" style="gap:16px">
          ${OB.crumbs([['Home', 'home'], ['Experiences', 'experiences'], [x.title, '']])}
          <div class="row-between" style="align-items:flex-end">
            <div class="detail-head">
              <h1>${esc(x.title)}</h1>
              <div class="detail-meta">
                <span><svg class="icon star" viewBox="0 0 24 24">${OB.ICONS.star}</svg><strong>${x.rating.toFixed(1)}</strong></span>
                <span>${icon('pin')} ${esc(x.place)}</span>
                <span>${icon('user')} Operated by ${esc(x.by)}</span>
              </div>
            </div>
            <div class="row"><button class="btn btn-secondary btn-sm" type="button" data-action="share" data-kind="experience" data-id="${x.id}">${icon('share')} Share</button>
              <button class="btn btn-secondary btn-sm" type="button" data-action="fav" data-id="${x.id}" aria-pressed="${OB.state.favs.has(x.id)}">${icon('heart')} ${OB.state.favs.has(x.id) ? 'Saved' : 'Save'}</button></div>
          </div>
          <div class="gallery-wrap"><div class="gallery">${gal.map((g, i) => `<img class="${i === 0 ? 'g-main' : ''}" src="${img(g)}" alt="">`).join('')}</div>
            <button class="btn btn-secondary btn-sm" type="button" data-action="toast" data-msg="The full gallery has 24 photos.">${icon('grid')} All photos</button></div>
        </div>
        <div class="with-aside">
          <div class="stack" style="gap:28px;min-width:0">
            <div class="stack" style="gap:10px"><h2 style="font-size:var(--fs-h2)">About this experience</h2>
              <p style="color:var(--ink-2);max-width:68ch">${isEgypt ? 'Discover Egypt’s ancient treasures on a 6-day private trip. Stand at the foot of the Great Pyramid, sail the Nile on a 5-star cruise, rise over Luxor in a hot air balloon at sunrise and explore the Valley of the Kings with an Egyptologist guide.' : `A hand-picked experience run by ${esc(x.by)}. Everything is arranged for you, from pickup to the last stop, so you can enjoy the day.`}</p></div>
            <div>
              <details class="acc" open><summary>What’s included ${icon('chevronDown')}</summary><div class="acc-body"><ul class="ticks">
                ${['5 nights’ accommodation: 2 in Cairo, 3 on a Nile cruise', 'Daily breakfast plus all meals on the cruise', 'Private Egyptologist guide and entry tickets to every site', 'Domestic flight Cairo–Luxor and all airport transfers', 'Visa-on-arrival support for Nigerian passport holders'].map((t) => `<li>${icon('check')}<span>${t}</span></li>`).join('')}
              </ul><p class="muted text-sm">Not included: international flights, sunrise balloon ride (+${fmt(340000)}), tips.</p></div></details>
              ${isEgypt ? `<details class="acc" open><summary>Itinerary ${icon('chevronDown')}</summary><div class="acc-body"><div class="itinerary">${OB.itinerary.map(([d, t, b]) => `<div class="it-day"><b>${d}</b><div><strong>${t}</strong><p>${b}</p></div></div>`).join('')}</div></div></details>` : ''}
              <details class="acc"><summary>Location ${icon('chevronDown')}</summary><div class="acc-body"><p>${icon('pin')} Starts in ${esc(x.place)}. Pickup from your hotel or the airport.</p>${OB.mapArt(x.place)}</div></details>
              <details class="acc"><summary>Availability &amp; how it works ${icon('chevronDown')}</summary><div class="acc-body"><p>Departs every Saturday from November 2026 to April 2027. Book at least 3 weeks ahead so we can arrange your visa support letter. After payment you get a voucher by email and your operator calls within 24 hours to confirm pickup.</p></div></details>
            </div>
          </div>
          <div class="aside-sticky">
            <div class="book-card">
              <span class="price-from">From</span>
              <div><span class="price">${fmt(x.price)}</span></div>
              <div class="row-between"><span class="label">Adults</span><div class="qty" role="group" aria-label="Adults">
                <button type="button" data-action="exp-guests" data-d="-1" ${OB.state.expGuests <= 1 ? 'disabled' : ''} aria-label="Remove adult">${icon('minus')}</button><output>${OB.state.expGuests}</output>
                <button type="button" data-action="exp-guests" data-d="1" ${OB.state.expGuests >= 8 ? 'disabled' : ''} aria-label="Add adult">${icon('plus')}</button></div></div>
              <hr class="divider">
              <div class="summary-total" style="border:0;padding:0"><span>Total</span><strong>${fmt(OB.orderTotal(order))}</strong></div>
              <a class="btn btn-primary btn-lg btn-block" href="#exp-checkout~${x.id}">Continue booking</a>
              <div class="assure"><span>${icon('check')} Best price guaranteed</span></div>
            </div>
          </div>
        </div>
        <section class="section">${OB.sectionHead('You may also like', { href: 'experiences', rail: 'rail-like' })}${OB.rail('rail-like', OB.experiences.filter((y) => y.id !== x.id).slice(-6).map(OB.expCard))}</section>
      </main>
      ${OB.mobileCta({ label: `${OB.state.expGuests} adult${OB.state.expGuests > 1 ? 's' : ''}`, amount: OB.fmt(OB.orderTotal(order)), button: `<a class="btn btn-primary" href="#exp-checkout~${x.id}">Continue</a>` })}
      ${OB.footer()}`;
  };

  /* ---------- Movies ---------- */
  OB.nowShowing = () => {
    const fs = OB.state.fs;
    const chain = OB.cinemaChains.find((c) => c.id === fs.mChain);
    const branchChain = fs.mBranch ? OB.cinemaChains.find((c) => c.branches.some(([b]) => b === fs.mBranch)) : null;
    const want = branchChain || chain;
    const list = OB.movies.filter((m) => { const s2 = OB.movieShowing[m.id]; return (!want || s2.chains.includes(want.id)) && (!s2.opens || s2.opens <= fs.mDate); });
    const where = fs.mBranch || (chain ? chain.name : '');
    return `
      <section class="section" aria-live="polite">
        <div class="section-head"><div><h2>Now showing${where ? ` at ${esc(where)}` : ''}</h2><p>${OB.state.moviesLoading ? 'Loading showtimes…' : `${list.length} movie${list.length === 1 ? '' : 's'}`} · ${OB.cDayLabel(fs.mDate)}</p></div></div>
        ${OB.state.moviesLoading
          ? `<div class="grid-4" aria-busy="true">${Array.from({ length: 4 }, () => `<div class="sk-card" aria-hidden="true"><span class="skel sk-poster"></span><span class="skel sk-line w80"></span><span class="skel sk-line w50"></span></div>`).join('')}</div>`
          : list.length ? `<div class="grid-4">${list.map(OB.movieCard).join('')}</div>` : `<div class="panel empty">${icon('film')}<strong style="color:var(--ink)">No showtimes yet for this day</strong><span>Try another date or location.</span></div>`}
      </section>`;
  };

  OB.pages.movies = () => {
    return `
    ${OB.nav()}
    <div class="list-search"><div class="container">
      <div class="list-search-head"><h1>Movies</h1><p>Showtimes and seats at cinemas across Nigeria.</p></div>
      <div class="search-card list-search-card">${OB.cinemaSearch(false)}</div>
    </div></div>
    <main class="container page-body" style="gap:24px;padding-top:28px">
      ${OB.nowShowing()}
    </main>
    ${OB.footer()}`;
  };

  const TAKEN = new Set(['A4', 'A5', 'B7', 'B8', 'C2', 'C3', 'C10', 'D6', 'D7', 'D8', 'E11', 'E12', 'F1', 'F2', 'G5', 'G6', 'G9', 'H3', 'H4', 'H12', 'J6', 'J7']);
  OB.movieOrder = (m) => {
    const c = OB.find(OB.cinemas, OB.state.show.cinema);
    const seats = [...OB.state.seats];
    const vip = seats.filter((s) => 'IJ'.includes(s[0])).length;
    const std = seats.length - vip;
    const lines = [];
    if (std) lines.push([`Standard × ${std}`, std * c.price]);
    if (vip) lines.push([`Recliner × ${vip}`, vip * Math.round(c.price * 1.5)]);
    if (seats.length) lines.push(['Booking fee', seats.length * 200]);
    return {
      kind: 'movie', summaryTitle: 'Your seats', steps: ['Showtime & seats', 'Payment'], payStep: 1, back: `movie~${m.id}`, ref: 'OB-38510',
      item: { img: m.img || 'hero-movies', title: m.title, sub: `${c.name} · ${OB.state.show.date}, ${OB.state.show.time}` }, lines,
      confirmTitle: 'Enjoy the movie', confirmBody: `Show the QR code at the ${c.name} entrance. Seats ${seats.join(', ')}.`
    };
  };

  OB.pages.movie = (id) => {
    const m = OB.find(OB.movies, id);
    if (OB.state.movieId !== m.id) { OB.state.movieId = m.id; OB.state.seats = new Set(); }
    const sh = OB.state.show;
    const order = OB.movieOrder(m);
    const days = [['Wed', 14, 'Oct'], ['Thu', 15, 'Oct'], ['Fri', 16, 'Oct'], ['Sat', 17, 'Oct'], ['Sun', 18, 'Oct'], ['Mon', 19, 'Oct'], ['Tue', 20, 'Oct']];
    const rows = 'ABCDEFGHIJ'.split('');
    const seatRow = (r) => `<div class="seat-row"><b>${r}</b>${Array.from({ length: 14 }, (_, i) => {
      const id2 = r + (i + 1); const taken = TAKEN.has(id2); const on = OB.state.seats.has(id2);
      return `${i === 3 || i === 11 ? '<span class="seat-gap"></span>' : ''}<button type="button" class="seat ${'IJ'.includes(r) ? 'vip' : ''}" data-action="seat" data-id="${id2}" aria-pressed="${on}" ${taken ? 'disabled' : ''} aria-label="Seat ${id2}${taken ? ', taken' : ''}">${i + 1}</button>`;
    }).join('')}<b>${r}</b></div>`;
    return `
      ${OB.nav()}
      <main class="container page-body" style="gap:32px">
        ${OB.crumbs([['Home', 'home'], ['Movies', 'movies'], [m.title, '']])}
        <section class="event-hero movie-hero">
          ${OB.poster(m)}
          <div class="stack" style="gap:16px;align-content:start">
            <div class="row"><span class="badge badge-neutral">${m.rating}</span><span class="badge">${esc(m.genre)}</span>${m.tag ? `<span class="badge badge-solid">${m.tag}</span>` : ''}</div>
            <h1 style="font-size:var(--fs-h1)">${esc(m.title)}</h1>
            <p class="muted">${m.runtime} · English, Yoruba subtitles</p>
            <p style="color:var(--ink-2);max-width:62ch">${m.id === 'hail-mary' ? 'A science teacher wakes up alone on a spaceship light-years from home with no memory of how he got there, and the fate of Earth depends on him.' : esc(m.tagline) + '. A Nollywood original showing exclusively in cinemas this month.'}</p>
            <div class="stack" style="gap:10px"><span class="label">Choose a date</span>
              <div class="date-chips">${days.map(([d, n, mo]) => { const lbl = `${d}, ${n} ${mo}`; return `<button class="date-chip" type="button" data-action="show-date" data-v="${lbl}" aria-pressed="${sh.date === lbl}">${d}<strong>${n}</strong>${mo}</button>`; }).join('')}</div></div>
          </div>
        </section>
        <div class="with-aside">
          <div class="stack" style="gap:24px;min-width:0">
            <section class="stack" style="gap:12px" aria-labelledby="st-h"><h2 id="st-h" style="font-size:var(--fs-h2)">Showtimes</h2>
              ${OB.cinemas.map((c) => `
                <div class="cinema"><header><div><h4>${esc(c.name)}</h4><span class="text-xs muted">${esc(c.area)} · from ${fmt(c.price)}</span></div></header>
                <div class="times">${c.times.map(([t, f]) => `<button class="time-btn" type="button" data-action="showtime" data-c="${c.id}" data-t="${t}" aria-pressed="${sh.cinema === c.id && sh.time === t}">${t}<small>${f}</small></button>`).join('')}</div></div>`).join('')}
            </section>
            <section class="panel stack" style="gap:16px" aria-labelledby="seat-h">
              <div class="row-between"><h2 id="seat-h" style="font-size:var(--fs-h3)">Pick your seats</h2><span class="text-sm muted">${esc(OB.find(OB.cinemas, sh.cinema).name)} · ${sh.time}</span></div>
              <div class="seatmap-wrap"><div class="seatmap"><div class="screen-arc">SCREEN</div>${rows.map(seatRow).join('')}</div></div>
              <div class="seat-legend"><span><i></i>Available</span><span><i style="background:var(--blue);border-color:var(--blue)"></i>Selected</span><span><i style="background:var(--line);border-color:var(--line)"></i>Taken</span><span><i style="border-color:var(--pss)"></i>Recliner (rows I–J)</span></div>
            </section>
          </div>
          <div class="aside-sticky">
            ${OB.state.seats.size ? OB.orderSummary(order, { cta: `<a class="btn btn-primary btn-lg btn-block" href="#pay~movie">Continue to payment</a>` })
              : `<div class="summary"><h3>Your seats</h3><p class="muted text-sm">Pick a showtime and tap seats on the map. You can choose up to 8.</p><button class="btn btn-primary btn-lg btn-block" type="button" disabled>Continue to payment</button></div>`}
          </div>
        </div>
      </main>
      ${OB.mobileCta(OB.state.seats.size ? { label: `${OB.state.seats.size} seat${OB.state.seats.size > 1 ? 's' : ''} · ${[...OB.state.seats].join(', ')}`, amount: OB.fmt(OB.orderTotal(order)), button: '<a class="btn btn-primary" href="#pay~movie">Continue</a>' }
        : { label: `${OB.find(OB.cinemas, sh.cinema).name} · ${sh.time}`, amount: '', button: '<button class="btn btn-primary" type="button" data-action="scroll-to" data-target="seat-h">Pick seats</button>' })}
      ${OB.footer()}`;
  };

  /* ---------- Hotels ---------- */
  OB.pages.hotels = () => `
    ${OB.nav()}
    <div class="searchbar"><div class="container"><form class="search-card" data-form="search" aria-label="Hotel search">${OB.searchForm('hotels')}</form></div></div>
    <main class="container page-body" style="gap:28px">
      <div class="section-head"><div><h1 style="font-size:var(--fs-h1)">Stays for your next trip</h1><p>Hand-picked hotels and resorts. Prices per night, taxes included.</p></div>
        <div class="seg" role="group" aria-label="Sort"><button type="button" aria-pressed="true">Recommended</button><button type="button" aria-pressed="false" data-action="toast" data-msg="Sorting uses the same grid.">Lowest price</button></div></div>
      <div class="notice notice-info">${icon('info')}<span>Hotel detail and room selection pages follow the experience detail layout and are next in the design queue.</span></div>
      <div class="grid-3">${OB.hotels.map(OB.hotelCard).join('')}</div>
    </main>
    ${OB.footer()}`;

  /* ---------- Travel extras (airport add-ons) ---------- */
  OB.addonOrder = () => {
    const lines = OB.airportAddons.filter((a) => OB.state.addons.has(a.id)).map((a) => [a.title, a.price]);
    return {
      kind: 'extras', summaryTitle: 'Price summary', steps: ['Choose extras', 'Payment'], payStep: 1, back: 'extras', ref: 'OB-48877',
      lines, confirmTitle: 'Your travel extras are booked', confirmBody: 'We’ll send service details and your protocol officer’s contact 24 hours before your flight.'
    };
  };

  OB.pages.extras = () => {
    const order = OB.addonOrder();
    return `
      ${OB.nav({ current: 'extras' })}
      <div class="searchbar searchbar-collapse ${OB.state.exOpen ? 'is-open' : ''}"><div class="container">
        <button class="search-summary" type="button" data-action="toggle-ex-search" aria-expanded="${!!OB.state.exOpen}">
          <span class="search-summary-text"><strong>${esc(OB.state.ex.airport)}</strong><small>${esc(OB.state.ex.date)} · ${esc(OB.state.ex.pax)}</small></span>
          <span class="search-summary-edit">${OB.state.exOpen ? 'Close' : 'Edit'} ${icon(OB.state.exOpen ? 'x' : 'edit')}</span>
        </button>
        <form class="search-card" data-form="search" aria-label="Travel extras search">${OB.searchForm('extras')}</form>
      </div></div>
      <main class="container page-body" style="gap:28px">
        <div class="with-aside">
          <div class="stack" style="gap:20px">
            <div><h1 style="font-size:var(--fs-h1)">Airport add-ons</h1><p class="muted">Available at ${esc(OB.state.ex.airport)} on ${esc(OB.state.ex.date)}.</p></div>
            ${OB.airportAddons.map((a) => {
              const on = OB.state.addons.has(a.id);
              return `
              <div class="addon-row ${on ? 'is-selected' : ''}">
                <span class="addon-thumb">${a.img ? `<img src="${img(a.img)}" alt="">` : icon(a.icon)}</span>
                <div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><a class="text-xs" href="#home">View terms</a></div>
                <div class="addon-side"><span class="price">${fmt(a.price)}</span>
                  <button class="btn btn-sm ${on ? 'btn-added' : 'btn-secondary'}" type="button" data-action="toggle-addon" data-id="${a.id}" aria-pressed="${on}">${on ? icon('check') + ' Added' : icon('plus') + ' Add'}</button></div>
              </div>`;
            }).join('')}
          </div>
          <div class="aside-sticky">
            ${order.lines.length ? OB.orderSummary(order, { cta: '<a class="btn btn-primary btn-lg btn-block" href="#pay~extras">Continue to payment</a>' })
              : `<div class="summary"><h3>Price summary</h3><p class="muted text-sm">Add a service to see your total.</p><button class="btn btn-primary btn-lg btn-block" type="button" disabled>Continue to payment</button></div>`}
          </div>
        </div>
      </main>
      ${OB.footer()}`;
  };
})();
