window.OB = window.OB || {};
(() => {
  const { icon, fmt } = OB;
  const $ = (sel, el = document) => el.querySelector(sel);

  OB.state = {
    loggedIn: false,
    user: { ...OB.user, passport: { ...OB.user.passport } },
    tab: 'flights',
    favs: new Set(['isimi-lagos']),
    ff: { sort: 'cheapest', stops: 'any', hiddenAirlines: new Set(), refundable: false, maxPrice: 1400000 },
    fs: { qText: '', qKind: null, from: 'Lagos (LOS)', to: 'Dubai (DXB)', apKey: null, apQuery: '', recent: ['LHR', 'ACC'], trip: 'round', cabin: 'Economy', dep: '2026-12-18', ret: '2027-01-03', adults: 1, children: 0, infants: 0, pop: null, picking: 'dep', calMonth: '2026-12', mIdx: 0,
      legs: [{ from: 'Lagos (LOS)', to: 'Dubai (DXB)', date: '2026-12-18' }, { from: 'Dubai (DXB)', to: 'London (LHR)', date: '2026-12-27' }] },
    openFlight: null,
    searchOpen: false,
    filtersOpen: false,
    flightId: 'f2',
    priceWatch: false,
    paxPrefill: false,
    promo: '',
    extras: new Set(['reminder']),
    addons: new Set(['protocol', 'vip-lounge']),
    payMethod: 'card',
    pssMonths: 3,
    bankShown: false,
    order: null,
    eventId: null, tickets: {}, eventCat: 'All', expCat: 'All',
    expGuests: 2, expDate: 'Sat, 21 Nov 2026',
    movieId: null, seats: new Set(), show: { cinema: 'filmhouse-lekki', time: '18:00', date: 'Wed, 14 Oct' },
    bkTab: 'All', bkQuery: '',
    editing: '',
    pendingEmail: '',
    returnTo: '',
    overlay: null
  };
  const S = OB.state;

  const SCREENS = [
    ['Home', [['home~flights', 'Flights tab'], ['home~hotels', 'Hotels tab'], ['home~events', 'Events tab'], ['home~experiences', 'Experiences tab'], ['home~movies', 'Movies tab'], ['home~extras', 'Travel extras tab']]],
    ['Home v2 · left-aligned hero', [['home2~flights', 'Flights tab'], ['home2~hotels', 'Hotels tab'], ['home2~events', 'Events tab'], ['home2~experiences', 'Experiences tab'], ['home2~movies', 'Movies tab'], ['home2~extras', 'Travel extras tab']]],
    ['Flight booking', [['flights', 'Search results'], ['flight-trip', 'Traveller details'], ['flight-extras', 'Extras'], ['pay~flight', 'Payment'], ['card-payment', 'Card payment (Paystack)'], ['confirmed', 'Confirmation']]],
    ['Events', [['events', 'Events listing'], ['event~afrobeats-live', 'Event detail & tickets']]],
    ['Experiences', [['experiences', 'Experiences listing'], ['experience~egypt-nile', 'Experience detail']]],
    ['Movies', [['movies', 'Now showing'], ['movie~hail-mary', 'Showtimes & seats']]],
    ['Hotels & extras', [['hotels', 'Hotel results'], ['extras', 'Airport add-ons']]],
    ['Account', [['signin', 'Log in / sign up'], ['otp', 'Verify email code'], ['signup', 'Create account'], ['bookings', 'My bookings', 1], ['booking~OB-48213', 'Booking details', 1], ['profile', 'My profile', 1]]],
    ['Handoff', [['system', 'Design system & changes']]]
  ];

  const orderFor = (kind) => ({
    flight: OB.flightOrder,
    event: () => OB.eventOrder(OB.find(OB.events, S.eventId || 'afrobeats-live')),
    experience: () => OB.expOrder(OB.find(OB.experiences, 'egypt-nile')),
    movie: () => OB.movieOrder(OB.find(OB.movies, S.movieId || 'hail-mary')),
    extras: OB.addonOrder
  }[kind] || OB.flightOrder)();

  const resolve = (hash) => {
    const raw = (hash || '').replace(/^#/, '') || 'home';
    const [name, arg] = raw.split('~');
    switch (name) {
      case 'home': return () => OB.pages.home(arg || S.tab);
      case 'home2': return () => OB.pages.home2(arg || S.tab);
      case 'pay':
        S.bankShown = false;
        if (arg === 'event' && !Object.values(S.tickets).some(Boolean)) { S.eventId = S.eventId || 'afrobeats-live'; S.tickets = { vip: 2 }; }
        if (arg === 'movie' && !S.seats.size) { S.movieId = S.movieId || 'hail-mary'; S.seats = new Set(['F7', 'F8']); }
        if (arg === 'extras' && !S.addons.size) S.addons = new Set(['protocol']);
        S.order = orderFor(arg || 'flight');
        return OB.pages.payment;
      case 'payment': S.order = orderFor(S.order?.kind || 'flight'); return OB.pages.payment;
      case 'card-payment':
        S.order = S.order || orderFor('flight'); S.payMethod = 'card';
        return () => { setTimeout(() => openOverlay(OB.paystackModal(OB.orderTotal(S.order)))); return OB.pages.payment(); };
      case 'confirmed': S.order = S.order || orderFor('flight'); return OB.pages.confirmed;
      case 'profile-travellers': return () => { setTimeout(() => $('#travellers')?.scrollIntoView()); return OB.pages.profile(); };
      default: return OB.pages[name] ? () => OB.pages[name](arg) : () => OB.pages.home(S.tab);
    }
  };

  let lastHash = null;
  const routeName = (h) => ((h || '').replace(/^#/, '') || 'home').split('~')[0];
  let lastRoute = null;
  const render = () => {
    const hash = location.hash;
    const changed = hash !== lastHash;
    const rn = routeName(hash);
    if (changed && (rn === 'home' || rn === 'home2') && lastRoute !== rn) {
      S.homeLoading = true;
      clearTimeout(S.homeTimer);
      S.homeTimer = setTimeout(() => { S.homeLoading = false; if (routeName(location.hash) === rn) render(); }, 1400);
    }
    if (changed) lastRoute = rn;
    const y = window.scrollY;
    const oldVideo = document.querySelector('.hero-video');
    const active = document.activeElement;
    const keep = !changed && active && active.id && active.matches('input, textarea') ? { id: active.id, start: active.selectionStart, end: active.selectionEnd } : null;
    $('#app').innerHTML = resolve(hash)() + protoFab();
    if (keep) { const n = document.getElementById(keep.id); if (n) { n.focus(); try { n.setSelectionRange(keep.start, keep.end); } catch {} } }
    const slot = document.querySelector('.hero-video');
    if (oldVideo && slot && oldVideo.dataset.src === slot.dataset.src) { slot.replaceWith(oldVideo); oldVideo.play().catch(() => {}); }
    if (changed) { closeOverlay(); window.scrollTo(0, 0); lastHash = hash; } else window.scrollTo(0, y);
  };
  OB.render = render;

  const protoFab = () => `<button class="proto-fab" type="button" data-action="screens">${icon('layers')}<span class="proto-fab-label">Screens</span></button>`;

  const screensDrawer = () => {
    const cur = (location.hash || '#home').slice(1);
    return `
    <div class="proto-drawer" data-action="close-overlay">
      <div class="proto-panel" role="dialog" aria-label="All screens" data-stop>
        <div class="row-between"><h2>All screens</h2><button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close">${icon('x')}</button></div>
        <p class="text-sm muted" style="margin-top:-12px">Jump to any screen. Every screen is also clickable from inside the prototype.</p>
        ${SCREENS.map(([g, items]) => `<div class="proto-group"><h3>${g}</h3>${items.map(([r, l, login]) => `
          <a class="proto-link ${cur === r ? 'is-current' : ''}" href="#${r}" data-action="proto-go" data-login="${login ? 1 : ''}">${l}<small>#${r}</small></a>`).join('')}</div>`).join('')}
      </div>
    </div>`;
  };

  const openOverlay = (html) => { $('#overlay-root').innerHTML = html; S.overlay = true; document.body.style.overflow = 'hidden'; $('#overlay-root [data-stop] button, #overlay-root [data-stop] a')?.focus(); };
  const closeOverlay = () => { $('#overlay-root').innerHTML = ''; S.overlay = null; document.body.style.overflow = ''; };

  let toastTimer;
  const toast = (msg) => {
    const t = $('#toast');
    t.innerHTML = `${icon('checkCircle')}<span>${OB.esc(msg)}</span>`;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
  };
  OB.toast = toast;

  let loadTimer;
  const startFlightSearch = () => {
    clearTimeout(loadTimer);
    document.querySelector('.fll-backdrop')?.remove();
    const host = document.createElement('div');
    host.innerHTML = OB.flightLoaderModal();
    const el = host.firstElementChild;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    document.activeElement?.blur();
    loadTimer = setTimeout(() => {
      if (location.hash === '#flights') { render(); window.scrollTo(0, 0); } else go('flights');
      el.classList.add('is-leaving');
      setTimeout(() => { el.remove(); document.body.style.overflow = ''; }, 250);
    }, 2800);
  };

  const go = (route) => { if (location.hash === '#' + route) render(); else location.hash = route; };

  const login = () => { S.loggedIn = true; };

  const actions = {
    menu: () => openOverlay(OB.menuSheet()),
    screens: () => openOverlay(screensDrawer()),
    'close-overlay': () => closeOverlay(),
    'proto-go': (el) => { if (el.dataset.login) login(); closeOverlay(); },
    currency: () => toast('Currency: NGN. USD, GHS and KES follow the same layout.'),
    toast: (el) => toast(el.dataset.msg),
    rail: (el) => { const r = document.getElementById(el.dataset.target); r?.scrollBy({ left: r.clientWidth * 0.8 * +el.dataset.dir, behavior: 'smooth' }); },
    fav: (el) => { const id = el.dataset.id; S.favs.has(id) ? S.favs.delete(id) : S.favs.add(id); toast(S.favs.has(id) ? 'Saved to your wishlist' : 'Removed from your wishlist'); render(); },
    swap: () => { const fs = S.fs; [fs.from, fs.to] = [fs.to, fs.from]; render(); },
    'flight-details': (el) => { S.fdOpen = 0; openOverlay(OB.flightDetailsModal(OB.getFlight(el.dataset.id))); },
    'fd-toggle': (el) => {
      const i = +el.dataset.i; S.fdOpen = S.fdOpen === i ? -1 : i;
      const panel = document.querySelector('#overlay-root .modal-panel'); const y = panel?.scrollTop || 0;
      document.getElementById('overlay-root').innerHTML = OB.flightDetailsModal(OB.getFlight(el.dataset.id));
      const p2 = document.querySelector('#overlay-root .modal-panel'); if (p2) p2.scrollTop = y;
    },
    'select-flight': (el) => { S.flightId = el.dataset.id; go('flight-trip'); },
    matrix: (el) => {
      const al = el.dataset.al; const only = S.ff.hiddenAirlines.size && !S.ff.hiddenAirlines.has(al);
      S.ff.hiddenAirlines = only ? new Set() : new Set(Object.keys(OB.airlines).filter((c) => c !== al));
      const x = document.getElementById('fm-track')?.scrollLeft || 0;
      render(); const t = document.getElementById('fm-track'); if (t) t.scrollLeft = x;
      toast(only ? 'Showing all airlines' : `Showing ${OB.airlines[al].name} only`);
    },
    'price-watch': (el) => { S.priceWatch = el.checked; toast(S.priceWatch ? 'We’ll email you if this route drops below ₦1,000,000.' : 'Price alerts turned off'); },
    'clear-filters': () => { S.ff = { sort: S.ff.sort, stops: 'any', hiddenAirlines: new Set(), refundable: false, maxPrice: 1400000 }; render(); },
    'filter-stops': (el) => { S.ff.stops = el.value; render(); },
    'filter-airline': (el) => { el.checked ? S.ff.hiddenAirlines.delete(el.dataset.al) : S.ff.hiddenAirlines.add(el.dataset.al); render(); },
    'filter-price': (el) => { S.ff.maxPrice = +el.value; render(); $('#max-price')?.focus(); },
    'filter-refundable': (el) => { S.ff.refundable = el.checked; render(); },
    'more-flights': (el) => { S.openMore = S.openMore === el.dataset.id ? null : el.dataset.id; render(); },
    'scroll-to': (el) => document.getElementById(el.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    'toggle-search': () => { S.searchOpen = !S.searchOpen; render(); },
    'toggle-filters': () => { S.filtersOpen = !S.filtersOpen; render(); },
    'fs-pop': (el) => {
      const fs = S.fs;
      if (fs.pop === el.dataset.pop && (!el.dataset.pick || el.dataset.pick === fs.picking)) { fs.pop = null; render(); return; }
      if (el.dataset.pop === 'mdate') {
        const i = +el.dataset.i;
        if (fs.pop === 'mdate' && fs.mIdx === i) { fs.pop = null; render(); return; }
        fs.pop = 'mdate'; fs.mIdx = i; fs.calMonth = fs.legs[i].date.slice(0, 7); render(); return;
      }
      if (el.dataset.pop === 'ap') {
        const k = el.dataset.k;
        if (fs.pop === 'ap' && fs.apKey === k) { fs.pop = null; render(); return; }
        fs.pop = 'ap'; fs.apKey = k; fs.apQuery = ''; render(); $('#ap-q')?.focus(); return;
      }
      fs.pop = el.dataset.pop;
      if (el.dataset.pick) {
        fs.picking = el.dataset.pick;
        if (fs.picking === 'ret' && fs.trip === 'oneway') { fs.trip = 'round'; fs.ret = null; }
        fs.calMonth = ((fs.picking === 'ret' && fs.ret) || fs.dep).slice(0, 7);
      }
      render();
    },
    'fs-close': () => { S.fs.pop = null; render(); },
    'cal-nav': (el) => {
      const [y, m] = S.fs.calMonth.split('-').map(Number);
      S.fs.calMonth = new Date(Date.UTC(y, m - 1 + +el.dataset.dir, 1)).toISOString().slice(0, 7); render();
    },
    'cal-day': (el) => {
      const fs = S.fs; const d = el.dataset.d;
      if (fs.pop === 'mdate') {
        fs.legs[fs.mIdx].date = d;
        for (let k = fs.mIdx + 1; k < fs.legs.length; k++) if (fs.legs[k].date < d) fs.legs[k].date = d;
        fs.pop = null; render(); return;
      }
      if (fs.trip === 'oneway') { fs.dep = d; fs.pop = null; }
      else if (fs.picking === 'dep') { fs.dep = d; fs.ret = null; fs.picking = 'ret'; }
      else if (d <= fs.dep) { fs.dep = d; fs.ret = null; }
      else { fs.ret = d; fs.pop = null; fs.picking = 'dep'; }
      render();
    },
    'fs-trip-btn': (el) => { S.fs.trip = el.dataset.v; if (S.fs.trip === 'round' && !S.fs.ret) S.fs.picking = 'ret'; if (S.fs.trip === 'oneway') S.fs.picking = 'dep'; render(); },
    'ap-pick': (el) => {
      const fs = S.fs; const k = el.dataset.k; OB.apSet(k, el.dataset.code); fs.apQuery = '';
      const next = k === 'from' ? 'to' : k === 'to' ? null : k.startsWith('mc-from') ? k.replace('from', 'to') : null;
      if (next) { fs.apKey = next; render(); $('#ap-q')?.focus(); }
      else if (k === 'to') { fs.pop = 'dates'; fs.picking = 'dep'; fs.calMonth = fs.dep.slice(0, 7); render(); }
      else { fs.pop = null; render(); }
    },
    'fs-opt': (el) => {
      const fs = S.fs;
      if (el.dataset.k === 'trip') {
        fs.trip = el.dataset.v;
        if (fs.trip === 'round' && !fs.ret) { fs.pop = 'dates'; fs.picking = 'ret'; fs.calMonth = fs.dep.slice(0, 7); render(); return; }
      } else fs.cabin = el.dataset.v;
      fs.pop = null; render();
    },
    'mc-add': () => {
      const legs = S.fs.legs; const last = legs[legs.length - 1];
      const d = new Date(last.date + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 5);
      legs.push({ from: last.to, to: 'Accra (ACC)', date: d.toISOString().slice(0, 10) }); render();
    },
    'mc-remove': (el) => { S.fs.legs.splice(+el.dataset.i, 1); render(); },
    'mc-swap': (el) => { const l = S.fs.legs[+el.dataset.i]; [l.from, l.to] = [l.to, l.from]; render(); },
    pax: (el) => {
      const fs = S.fs; const k = el.dataset.k;
      fs[k] = Math.max(k === 'adults' ? 1 : 0, fs[k] + +el.dataset.d);
      if (fs.infants > fs.adults) fs.infants = fs.adults;
      render();
    },
    sort: (el) => { S.ff.sort = el.dataset.sort; render(); },
    prefill: () => { S.paxPrefill = true; render(); toast('Filled in from your profile. Check everything matches your passport.'); },
    'apply-promo': () => { const v = $('#promo').value.trim().toUpperCase(); if (v === 'DETTYDEC') { S.promo = v; render(); toast('Promo applied'); } else toast(v ? `${v} isn’t a valid code. Try DETTYDEC.` : 'Enter a promo code first.'); },
    'toggle-extra': (el) => { const id = el.dataset.id; S.extras.has(id) ? S.extras.delete(id) : S.extras.add(id); render(); },
    'toggle-addon': (el) => { const id = el.dataset.id; S.addons.has(id) ? S.addons.delete(id) : S.addons.add(id); render(); },
    'pay-method': (el) => { S.payMethod = el.dataset.m; render(); },
    'pss-plan': (el) => { S.pssMonths = +el.value; render(); },
    'open-paystack': (el) => openOverlay(OB.paystackModal(+el.dataset.amount)),
    'show-bank': () => { S.bankShown = true; render(); },
    'confirm-paid': () => { toast('Payment received'); go('confirmed'); },
    share: (el) => openOverlay(OB.shareModal(el.dataset.kind, el.dataset.id)),
    'share-instagram': (el) => { const t = el.dataset.text; const done = () => toast('Link copied. Paste it in your Instagram story or DM.'); try { navigator.clipboard.writeText(t).then(done, done); } catch { done(); } },
    copy: (el) => { const text = el.dataset.text; const done = () => toast('Copied: ' + text); try { navigator.clipboard.writeText(text).then(done, done); } catch { done(); } },
    'event-cat': (el) => { S.eventCat = el.dataset.v; render(); },
    'exp-cat': (el) => { S.expCat = el.dataset.v; render(); toast('Category filters narrow the same grid.'); },
    tickets: (el) => { const id = el.dataset.id; S.tickets[id] = Math.max(0, Math.min(10, (S.tickets[id] || 0) + +el.dataset.d)); render(); },
    'exp-date': (el) => { S.expDate = el.value; render(); },
    'exp-guests': (el) => { S.expGuests = Math.max(1, Math.min(8, S.expGuests + +el.dataset.d)); render(); },
    'show-date': (el) => { S.show.date = el.dataset.v; render(); },
    showtime: (el) => { S.show.cinema = el.dataset.c; S.show.time = el.dataset.t; S.seats = new Set(); render(); },
    seat: (el) => { const id = el.dataset.id; if (S.seats.has(id)) S.seats.delete(id); else if (S.seats.size < 8) S.seats.add(id); else toast('You can choose up to 8 seats.'); render(); },
    'social-login': () => { S.pendingEmail = 'adaeze.mensah@gmail.com'; login(); toast(`Welcome back, ${S.user.first}`); go(S.returnTo || 'home'); },
    'demo-login': () => { login(); render(); },
    signout: () => { S.loggedIn = false; toast('Signed out'); go('home'); },
    'bk-tab': (el) => { S.bkTab = el.dataset.v; render(); },
    edit: (el) => { S.editing = el.dataset.v; render(); },
    reveal: (el) => { const i = document.getElementById(el.dataset.for); i.type = i.type === 'password' ? 'text' : 'password'; el.innerHTML = icon(i.type === 'password' ? 'eye' : 'eyeOff'); }
  };

  document.addEventListener('click', (ev) => {
    const qIn = ev.target.closest('[data-action="q-input"]');
    if (qIn && !(S.fs.pop === 'q' && S.fs.qKind === qIn.dataset.kind)) {
      if (S.fs.qKind !== qIn.dataset.kind) S.fs.qText = '';
      S.fs.pop = 'q'; S.fs.qKind = qIn.dataset.kind; render(); return;
    }
    if (S.fs.pop && !ev.target.closest('.sf-pop, [data-action="fs-pop"], .q-field')) {
      S.fs.pop = null;
      if (!ev.target.closest('[data-action], a, button, input, select, label')) { render(); return; }
      render();
    }
    const el = ev.target.closest('[data-action]');
    if (!el) return;
    const name = el.dataset.action;
    if (['filter-stops', 'filter-airline', 'filter-price', 'filter-refundable', 'price-watch', 'pss-plan', 'exp-date', 'bk-search', 'pw', 'fs-trip', 'fs-cabin'].includes(name)) return;
    if (name === 'close-overlay' && ev.target.closest('[data-stop]') && !ev.target.closest('button[data-action="close-overlay"]')) return;
    if (el.tagName !== 'A' || name === 'toast') ev.preventDefault();
    actions[name]?.(el, ev);
  });

  document.addEventListener('change', (ev) => {
    const mc = ev.target.id && ev.target.id.match(/^mc-(from|to)-(\d+)$/);
    if (mc) { S.fs.legs[+mc[2]][mc[1]] = ev.target.value; return; }
    const el = ev.target.closest('[data-action]');
    if (!el) return;
    const name = el.dataset.action;
    if (['filter-stops', 'filter-airline', 'filter-refundable', 'price-watch', 'pss-plan', 'exp-date'].includes(name)) actions[name](el, ev);
    if (name === 'fs-trip') { S.fs.trip = el.value; if (el.value === 'round' && !S.fs.ret) { S.fs.pop = 'dates'; S.fs.picking = 'ret'; S.fs.calMonth = S.fs.dep.slice(0, 7); } render(); }
    if (name === 'fs-cabin') S.fs.cabin = el.value;
  });

  let bkTimer;
  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.dataset.action === 'filter-price') actions['filter-price'](el);
    if (el.dataset.action === 'q-input') { S.fs.qText = el.value; S.fs.qKind = el.dataset.kind; S.fs.pop = 'q'; render(); }
    if (el.dataset.action === 'ap-q') {
      S.fs.apQuery = el.value; const pos = el.selectionStart; render();
      const n = $('#ap-q'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
    }
    if (el.dataset.action === 'bk-search') {
      clearTimeout(bkTimer);
      bkTimer = setTimeout(() => { S.bkQuery = el.value; const pos = el.selectionStart; render(); const n = $('#bk-q'); n.focus(); n.setSelectionRange(pos, pos); }, 250);
    }
    if (el.dataset.action === 'pw') {
      const v = el.value; const score = [v.length >= 8, /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
      document.querySelectorAll('.pw-meter i').forEach((i, n) => i.classList.toggle('on', n < score));
    }
    if (el.dataset.otp !== undefined) {
      el.value = el.value.replace(/\D/g, '').slice(0, 1);
      if (el.value) document.getElementById('otp-' + (+el.dataset.otp + 1))?.focus();
    }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && S.overlay) closeOverlay();
    if (ev.key === 'Escape' && S.fs.pop) { S.fs.pop = null; render(); }
    const el = ev.target;
    if (ev.key === 'Enter' && el.id === 'ap-q') { ev.preventDefault(); document.querySelector('.ap-pop .ap-row, .ap-pop .ap-chip')?.click(); }
    if (el.dataset?.otp !== undefined && ev.key === 'Backspace' && !el.value) document.getElementById('otp-' + (+el.dataset.otp - 1))?.focus();
  });

  document.addEventListener('paste', (ev) => {
    const el = ev.target;
    if (el.dataset?.otp === undefined) return;
    const digits = (ev.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    ev.preventDefault();
    [...digits].forEach((d, i) => { const n = document.getElementById('otp-' + i); if (n) n.value = d; });
    document.getElementById('otp-' + Math.min(digits.length, 5))?.focus();
  });

  const forms = {
    search: (form, ev) => {
      const target = ev.submitter?.dataset.go || form.querySelector('[data-go]')?.dataset.go || 'flights';
      if (target !== 'flights') { go(target); return; }
      S.fs.pop = null; S.searchOpen = false; S.openMore = null;
      startFlightSearch();
    },
    newsletter: (form) => { toast('Subscribed. Your first deals email arrives Thursday.'); form.reset(); },
    pax: () => {
      const ok = $('#tc-general').checked;
      $('#pax-error').hidden = ok;
      if (ok) go('flight-extras'); else $('#tc-general').focus();
    },
    card: () => {
      closeOverlay();
      toast(`Payment of ${fmt(OB.orderTotal(S.order))} successful`);
      go('confirmed');
    },
    signin: () => {
      const v = $('#si-email').value.trim();
      const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
      $('#si-error').hidden = ok; $('#si-email').classList.toggle('is-invalid', !ok);
      if (ok) { S.pendingEmail = v; go('otp'); }
    },
    otp: () => {
      const code = [...document.querySelectorAll('[data-otp]')].map((i) => i.value).join('');
      if (code.length < 6) { toast('Enter all 6 digits of the code.'); return; }
      go('signup');
    },
    signup: () => {
      S.user.first = $('#su-first').value.trim() || S.user.first;
      S.user.last = $('#su-last').value.trim() || S.user.last;
      if (S.pendingEmail) S.user.email = S.pendingEmail;
      login(); toast(`Account created. Welcome to Onburd, ${S.user.first}`);
      go(S.returnTo || 'home');
    },
    'profile-personal': () => {
      const [first, ...rest] = $('#pf-name').value.trim().split(' ');
      Object.assign(S.user, { first: first || S.user.first, last: rest.join(' ') || S.user.last, email: $('#pf-email').value, phone: $('#pf-phone').value, dob: $('#pf-dob').value, nationality: $('#pf-nat').value, residence: $('#pf-res').value });
      S.editing = ''; render(); toast('Personal details saved');
    },
    'profile-passport': () => {
      Object.assign(S.user.passport, { number: $('#pp-num').value, country: $('#pp-country').value, issued: $('#pp-issued').value, expiry: $('#pp-exp').value });
      S.editing = ''; render(); toast('Passport saved');
    }
  };

  document.addEventListener('submit', (ev) => {
    const form = ev.target.closest('[data-form]');
    if (!form) return;
    ev.preventDefault();
    forms[form.dataset.form]?.(form, ev);
  });

  window.addEventListener('hashchange', render);
  render();
})();
