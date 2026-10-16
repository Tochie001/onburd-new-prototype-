window.OB = window.OB || {};
(() => {
  const { icon, img, esc } = OB;

  const sfield = (id, iconName, label, value, { wide = false, type = 'text', options = null, placeholder = '' } = {}) => `
    <div class="sfield ${wide ? 'sfield-wide' : ''}">
      <span class="sfield-icon">${icon(iconName)}</span>
      <div class="sfield-body">
        <label for="${id}">${label}</label>
        ${options
          ? `<select id="${id}">${options.map((o) => `<option ${o === value ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`
          : `<input id="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off">`}
      </div>
    </div>`;

  const go = (href, label = 'Search') => `<button class="search-go" type="submit" data-go="${href}" aria-label="${label}">${icon('search')}<span class="search-go-label">${label}</span></button>`;

  const TODAY = '2026-10-15';
  const parse = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const toIso = (dt) => dt.toISOString().slice(0, 10);
  OB.fsDate = (iso, opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) => parse(iso).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
  OB.fsShort = (iso) => OB.fsDate(iso, { weekday: 'short', day: 'numeric', month: 'short' });
  OB.nights = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);

  OB.fsField = (iso) => OB.fsDate(iso, { day: 'numeric', month: 'short', year: 'numeric' });
  OB.paxShort = () => {
    const { adults, children, infants } = OB.state.fs;
    const total = adults + children + infants;
    return children || infants ? `${total} travellers` : `${adults} adult${adults > 1 ? 's' : ''}`;
  };

  OB.paxLabel = () => {
    const { adults, children, infants } = OB.state.fs;
    const parts = [`${adults} adult${adults > 1 ? 's' : ''}`];
    if (children) parts.push(`${children} child${children > 1 ? 'ren' : ''}`);
    if (infants) parts.push(`${infants} infant${infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const monthGrid = (ym) => {
    const fs = OB.state.fs;
    const [y, m] = ym.split('-').map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1));
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const lead = (first.getUTCDay() + 6) % 7;
    const title = first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<span></span>');
    for (let d = 1; d <= days; d++) {
      const iso = toIso(new Date(Date.UTC(y, m - 1, d)));
      const past = iso < TODAY;
      const multi = fs.pop === 'mdate';
      const prevDate = multi && fs.mIdx > 0 ? fs.legs[fs.mIdx - 1].date : null;
      const beforeDep = multi ? (prevDate && iso < prevDate) : (fs.picking === 'ret' && fs.dep && iso < fs.dep);
      const start = multi ? iso === fs.legs[fs.mIdx].date : iso === fs.dep;
      const end = !multi && fs.trip === 'round' && iso === fs.ret;
      const inRange = !multi && fs.trip === 'round' && fs.ret && iso > fs.dep && iso < fs.ret;
      const cls = [start && 'is-start', end && 'is-end', inRange && 'in-range', !multi && start && fs.ret && fs.trip === 'round' && 'has-range', iso === TODAY && 'is-today'].filter(Boolean).join(' ');
      cells.push(`<button type="button" class="cal-day ${cls}" data-action="cal-day" data-d="${iso}" ${past || beforeDep ? 'disabled' : ''} aria-pressed="${start || end}" aria-label="${OB.fsDate(iso)}">${d}</button>`);
    }
    return `<div class="cal-month"><h4>${title}</h4>
      <div class="cal-grid cal-dow">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((x) => `<span>${x}</span>`).join('')}</div>
      <div class="cal-grid">${cells.join('')}</div></div>`;
  };

  OB.calendarPop = () => {
    const fs = OB.state.fs;
    const [y, m] = fs.calMonth.split('-').map(Number);
    const next = toIso(new Date(Date.UTC(y, m, 1))).slice(0, 7);
    const canPrev = fs.calMonth > TODAY.slice(0, 7);
    const round = fs.trip === 'round';
    if (fs.pop === 'mdate') {
      const lg = fs.legs[fs.mIdx];
      return `
      <div class="sf-pop cal-pop" role="dialog" aria-label="Choose date for flight ${fs.mIdx + 1}">
        <div class="cal-body">
          <button class="icon-btn cal-nav prev" type="button" data-action="cal-nav" data-dir="-1" ${canPrev ? '' : 'disabled'} aria-label="Previous month">${icon('chevronLeft')}</button>
          ${monthGrid(fs.calMonth)}${monthGrid(next)}
          <button class="icon-btn cal-nav next" type="button" data-action="cal-nav" data-dir="1" aria-label="Next month">${icon('chevronRight')}</button>
        </div>
        <div class="cal-foot"><span class="text-sm"><strong>Flight ${fs.mIdx + 1} · ${OB.cityOf(lg.from)} → ${OB.cityOf(lg.to)} · ${OB.fsShort(lg.date)}</strong></span>
          <button class="btn btn-primary btn-sm" type="button" data-action="fs-close">Done</button></div>
      </div>`;
    }
    const summary = round && fs.ret
      ? `${OB.fsShort(fs.dep)} → ${OB.fsShort(fs.ret)} · ${OB.nights(fs.dep, fs.ret)} nights`
      : OB.fsShort(fs.dep) + (round ? ' → return?' : ' · one way');
    return `
      <div class="sf-pop cal-pop" role="dialog" aria-label="Choose travel dates">
        <div class="cal-body">
          <button class="icon-btn cal-nav prev" type="button" data-action="cal-nav" data-dir="-1" ${canPrev ? '' : 'disabled'} aria-label="Previous month">${icon('chevronLeft')}</button>
          ${monthGrid(fs.calMonth)}${monthGrid(next)}
          <button class="icon-btn cal-nav next" type="button" data-action="cal-nav" data-dir="1" aria-label="Next month">${icon('chevronRight')}</button>
        </div>
        <div class="cal-foot">
          <span class="text-sm"><strong>${summary}</strong></span>
          <button class="btn btn-primary btn-sm" type="button" data-action="fs-close" ${round && !fs.ret ? 'disabled' : ''}>Done</button>
        </div>
      </div>`;
  };

  OB.cityOf = (v) => v.replace(/\s*\(.*\)/, '');
  OB.codeOf = (v) => (v.match(/\(([A-Z]{3})\)/) || [, v])[1];
  const TRIP_OPTS = [['round', 'Round trip', 'Fly out and back', 'refresh'], ['oneway', 'One way', 'A single flight', 'arrowRight'], ['multi', 'Multi-city', 'Up to 5 flights in one booking', 'layers']];
  const CABIN_OPTS = [['Economy', 'Best value fares', 'seat'], ['Premium economy', 'Extra legroom and priority boarding', 'seat'], ['Business', 'Lie-flat seats and lounge access', 'sofa'], ['First', 'The most space and service', 'crown']];
  OB.tripLabel = () => TRIP_OPTS.find((t) => t[0] === OB.state.fs.trip)[1];
  const optPop = (key, opts, current) => `
    <div class="sf-pop opt-pop" role="listbox" aria-label="${key === 'trip' ? 'Trip type' : 'Cabin class'}">
      ${opts.map(([v, label, note, ic]) => `
        <button class="opt" type="button" role="option" data-action="fs-opt" data-k="${key}" data-v="${v}" aria-selected="${v === current}">
          <span class="opt-text"><strong>${label}</strong></span>${v === current ? icon('check', 'opt-check') : ''}
        </button>`).join('')}
    </div>`;
  const optButton = (key, label, ic) => {
    const open = OB.state.fs.pop === key;
    return `<div class="sf-anchor opt-anchor"><button class="pill-btn ${open ? 'is-open' : ''}" type="button" data-action="fs-pop" data-pop="${key}" aria-expanded="${open}" aria-haspopup="listbox">${icon(ic)}${label}${icon('chevronDown', 'pill-caret')}</button>
      ${open ? (key === 'trip' ? optPop('trip', TRIP_OPTS.map(([v, l, n, i]) => [v, l, n, i]), OB.state.fs.trip) : optPop('cabin', CABIN_OPTS.map(([v, n, i]) => [v, v, n, i]), OB.state.fs.cabin)) : ''}</div>`;
  };
  const paxPill = () => {
    const open = OB.state.fs.pop === 'pax';
    return `<div class="sf-anchor opt-anchor pax-pill-anchor"><button class="pill-btn ${open ? 'is-open' : ''}" type="button" data-action="fs-pop" data-pop="pax" aria-expanded="${open}" aria-haspopup="dialog">${icon('user')}${OB.paxShort()}${icon('chevronDown', 'pill-caret')}</button>
      ${open ? OB.paxPop() : ''}</div>`;
  };
  OB.flightOptions = () => `<div class="search-options">${optButton('trip', OB.tripLabel(), 'plane')}${optButton('cabin', OB.state.fs.cabin, 'seat')}${OB.state.fs.trip === 'multi' ? paxPill() : ''}</div>`;

  const apLabel = (a) => `${a.city} (${a.code})`;
  const apGet = (key) => {
    const fs = OB.state.fs;
    const m = key.match(/^mc-(from|to)-(\d+)$/);
    return OB.codeOf(m ? fs.legs[+m[2]][m[1]] : fs[key]);
  };
  OB.apSet = (key, code) => {
    const fs = OB.state.fs; const a = OB.airport(code);
    const m = key.match(/^mc-(from|to)-(\d+)$/);
    if (m) fs.legs[+m[2]][m[1]] = apLabel(a); else fs[key] = apLabel(a);
    fs.recent = [code, ...fs.recent.filter((c) => c !== code)].slice(0, 4);
  };
  const apRow = (a, key, q = '') => {
    const hl = (t) => { if (!q) return OB.esc(t); const i = t.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? OB.esc(t) : `${OB.esc(t.slice(0, i))}<mark>${OB.esc(t.slice(i, i + q.length))}</mark>${OB.esc(t.slice(i + q.length))}`; };
    return `<button class="ap-row" type="button" data-action="ap-pick" data-k="${key}" data-code="${a.code}">
      <span class="ap-code">${hl(a.code)}</span><span class="ap-text"><strong>${hl(a.city)}, ${OB.esc(a.country)}</strong><small>${hl(a.name)}</small></span></button>`;
  };
  OB.airportPop = (key) => {
    const fs = OB.state.fs; const q = fs.apQuery.trim();
    const other = key.includes('from') ? key.replace('from', 'to') : key.replace('to', 'from');
    const exclude = apGet(other);
    let body;
    if (q) {
      const ql = q.toLowerCase();
      const hits = OB.airportList.filter((a) => a.code !== exclude && [a.code, a.city, a.country, a.name].some((v) => v.toLowerCase().includes(ql)))
        .sort((a, b) => (b.code.toLowerCase() === ql) - (a.code.toLowerCase() === ql) || (b.city.toLowerCase().startsWith(ql)) - (a.city.toLowerCase().startsWith(ql)));
      body = hits.length ? `<div class="ap-list" role="listbox">${hits.slice(0, 8).map((a) => apRow(a, key, q)).join('')}</div>`
        : `<div class="ap-empty">${icon('search')}<strong>No airports match “${OB.esc(q)}”</strong><span>Try a city name or a 3-letter airport code, like LOS.</span></div>`;
    } else {
      const chip = (c) => { const a = OB.airport(c); return `<button class="ap-chip" type="button" data-action="ap-pick" data-k="${key}" data-code="${c}">${OB.esc(a.city)}</button>`; };
      body = `
        ${fs.recent.length ? `<div class="ap-sec"><h4>Recent searches</h4><div class="ap-chips">${fs.recent.filter((c) => c !== exclude).map(chip).join('')}</div></div>` : ''}
        <div class="ap-sec"><h4>Popular cities</h4><div class="ap-list">${OB.popularCities.filter((c) => c !== exclude).map((c) => apRow(OB.airport(c), key)).join('')}</div></div>`;
    }
    return `
      <div class="sf-pop ap-pop" role="dialog" aria-label="${key.includes('from') ? 'Leaving from' : 'Going to'}">
        <div class="ap-search">${icon('search')}<input id="ap-q" type="text" placeholder="${key.includes('from') ? 'Leaving from' : 'Going to'}: city or airport" value="${OB.esc(fs.apQuery)}" data-action="ap-q" data-k="${key}" autocomplete="off" aria-label="Search airports"></div>
        <div class="ap-body">${body}</div>
      </div>`;
  };
  const apField = (key, label, ic) => {
    const fs = OB.state.fs; const a = OB.airport(apGet(key)); const open = fs.pop === 'ap' && fs.apKey === key;
    return `<div class="sf-anchor ap-anchor">
      <button class="sfield ap-field ${open ? 'is-open' : ''}" type="button" data-action="fs-pop" data-pop="ap" data-k="${key}" aria-expanded="${open}" aria-haspopup="dialog">
        <span class="sfield-icon">${icon(ic)}</span>
        <span class="sfield-body"><span class="sf-label">${label}</span><span class="sf-value" title="${OB.esc(a.city)} (${a.code}) · ${OB.esc(a.name)}">${OB.esc(a.country)}, ${OB.esc(a.name)}</span></span>
      </button>${open ? OB.airportPop(key) : ''}</div>`;
  };
  OB.apField = apField;

  OB.paxPop = () => {
    const fs = OB.state.fs;
    const total = fs.adults + fs.children + fs.infants;
    const row = (k, label, note, val, min, max) => `
      <div class="pax-row">
        <div><strong>${label}</strong><span>${note}</span></div>
        <div class="qty" role="group" aria-label="${label}">
          <button type="button" data-action="pax" data-k="${k}" data-d="-1" ${val <= min ? 'disabled' : ''} aria-label="Fewer ${label.toLowerCase()}">${icon('minus')}</button>
          <output>${val}</output>
          <button type="button" data-action="pax" data-k="${k}" data-d="1" ${val >= max || total >= 9 ? 'disabled' : ''} aria-label="More ${label.toLowerCase()}">${icon('plus')}</button>
        </div>
      </div>`;
    return `
      <div class="sf-pop pax-pop" role="dialog" aria-label="Choose travellers">
        ${row('adults', 'Adults', '12 years and over', fs.adults, 1, 9)}
        ${row('children', 'Children', '2 to 11 years', fs.children, 0, 8)}
        ${row('infants', 'Infants', 'Under 2, on an adult’s lap', fs.infants, 0, fs.adults)}
        <p class="text-xs muted">Ages are checked against the first departure date. Up to 9 travellers per booking, and one infant per adult.</p>
        <button class="btn btn-primary btn-block" type="button" data-action="fs-close">Done</button>
      </div>`;
  };

  const C_DAYS = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2026, 9, 16 + i)).toISOString().slice(0, 10));
  const cDayLabel = (iso, short = false) => {
    const i = C_DAYS.indexOf(iso);
    const base = OB.fsDate(iso, short ? { day: 'numeric', month: 'short' } : { weekday: 'short', day: 'numeric', month: 'long' });
    return i === 0 ? `Today, ${base.replace(/^\w+, /, '')}` : i === 1 ? `Tomorrow, ${base.replace(/^\w+, /, '')}` : base;
  };
  OB.cDayLabel = cDayLabel;
  const cTile = (c) => `<span class="c-tile" style="--c:${c.color}">${c.short[0]}</span>`;
  const cOpt = (k, v, inner, sel) => `<button class="c-opt" type="button" role="option" data-action="c-pick" data-k="${k}" data-v="${esc(v)}" aria-selected="${sel}">${inner}${sel ? icon('check', 'opt-check') : ''}</button>`;
  const cinemaPop = (key) => {
    const fs = OB.state.fs;
    if (key === 'cchain') return `
      <div class="sf-pop c-pop" role="listbox" aria-label="Select cinema">
        ${cOpt('chain', '', `<span class="c-tile c-tile-all">${icon('film')}</span><span class="c-text"><strong>All cinemas</strong><small>${OB.cinemaChains.reduce((n, c) => n + c.branches.length, 0)} locations</small></span>`, !fs.mChain)}
        ${OB.cinemaChains.map((c) => cOpt('chain', c.id, `${cTile(c)}<span class="c-text"><strong>${c.name}</strong><small>${c.branches.length} location${c.branches.length > 1 ? 's' : ''}</small></span>`, fs.mChain === c.id)).join('')}
      </div>`;
    if (key === 'cbranch') {
      const chains = fs.mChain ? OB.cinemaChains.filter((c) => c.id === fs.mChain) : OB.cinemaChains;
      return `
      <div class="sf-pop c-pop" role="listbox" aria-label="Select cinema location">
        ${cOpt('branch', '', `<span class="c-pin">${icon('pin')}</span><span class="c-text"><strong>All locations</strong><small>${fs.mChain ? chains[0].name : 'Every cinema'}</small></span>`, !fs.mBranch)}
        ${chains.map((c) => `${fs.mChain ? '' : `<h4 class="c-group">${c.name}</h4>`}${c.branches.map(([b, area]) => cOpt('branch', b, `<span class="c-pin">${icon('pin')}</span><span class="c-text"><strong>${b}</strong><small>${area}</small></span>`, fs.mBranch === b)).join('')}`).join('')}
      </div>`;
    }
    return `
      <div class="sf-pop c-pop c-date-pop" role="listbox" aria-label="Select date">
        <h4 class="c-group">Showtimes this week</h4>
        <div class="c-days">${C_DAYS.map((d, i) => `
          <button class="c-day" type="button" role="option" data-action="c-pick" data-k="date" data-v="${d}" aria-selected="${fs.mDate === d}">
            <small>${i === 0 ? 'Today' : i === 1 ? 'Tmrw' : OB.fsDate(d, { weekday: 'short' })}</small><strong>${OB.fsDate(d, { day: 'numeric' })}</strong><small>${OB.fsDate(d, { month: 'short' })}</small>
          </button>`).join('')}</div>
      </div>`;
  };
  const cField = (key, ic, label, value, empty) => {
    const open = OB.state.fs.pop === key;
    return `<div class="sf-anchor c-anchor">
      <button class="sfield c-field ${open ? 'is-open' : ''}" type="button" data-action="fs-pop" data-pop="${key}" aria-expanded="${open}" aria-haspopup="listbox">
        <span class="sfield-icon">${icon(ic)}</span>
        <span class="sfield-body"><span class="sf-label">${label}</span><span class="sf-value ${empty ? 'is-empty' : ''}">${value}</span></span>
        ${icon('chevronDown', 'sf-caret')}
      </button>${open ? cinemaPop(key) : ''}</div>`;
  };
  OB.cinemaSearch = () => {
    const fs = OB.state.fs; const chain = OB.cinemaChains.find((c) => c.id === fs.mChain);
    return `
      <p class="search-title">Find your next movie to watch</p>
      <div class="search-fields c-fields">
        ${cField('cchain', 'ticket', 'Select cinema', chain ? chain.name : 'All cinemas', !chain)}
        ${cField('cbranch', 'pin', 'Select cinema location', fs.mBranch || 'All locations', !fs.mBranch)}
        ${cField('cdate', 'calendar', 'Select date', cDayLabel(fs.mDate), false)}
      </div>`;
  };

  const Q_CFG = {
    events: { label: 'Search events', ph: 'Artist, event or venue', go: 'events', btn: 'Find events', empty: 'Try an artist, venue or “comedy”.',
      list: () => OB.events, href: (e) => `#event~${e.id}`, hay: (e) => [e.title, e.venue, e.city, e.category],
      meta: (e) => `${e.date} · ${e.venue}`, price: (e) => `From ${OB.fmt(e.price)}` },
    experiences: { label: 'Search experiences', ph: 'Tours, day trips, spa days, places…', go: 'experiences', btn: 'Find experiences', empty: 'Try a place like “Egypt” or “Lagos”, or “safari”.',
      list: () => OB.experiences, href: (x) => `#experience~${x.id}`, hay: (x) => [x.title, x.place, x.by],
      meta: (x) => `${x.place} · ★ ${x.rating.toFixed(1)}`, price: (x) => `${OB.fmt(x.price)} / ${x.unit}` }
  };
  const qHl = (t, q) => { if (!q) return esc(t); const i = t.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + q.length))}</mark>${esc(t.slice(i + q.length))}`; };
  const qPop = (kind) => {
    const c = Q_CFG[kind]; const q = OB.state.fs.qText.trim(); const ql = q.toLowerCase();
    const items = q ? c.list().filter((it) => c.hay(it).some((v) => v.toLowerCase().includes(ql))) : c.list().slice(0, 5);
    const rows = items.slice(0, 6).map((it) => `
      <a class="q-row" href="${c.href(it)}">
        <img src="${img(it.img)}" alt="">
        <span class="q-text"><strong>${qHl(it.title, q)}</strong><small>${qHl(c.meta(it), q)}</small></span>
        <span class="q-price">${c.price(it)}</span>
      </a>`).join('');
    return `
      <div class="sf-pop q-pop" role="listbox" aria-label="${c.label}">
        ${q ? (items.length ? `<h4>${items.length} result${items.length > 1 ? 's' : ''}</h4>${rows}${items.length > 6 ? `<button class="q-all" type="submit" data-go="${c.go}">See all ${items.length} results ${icon('arrowRight')}</button>` : ''}`
          : `<div class="ap-empty">${icon('search')}<strong>Nothing matches “${esc(q)}”</strong><span>${c.empty}</span></div>`)
          : `<h4>Popular right now</h4>${rows}`}
      </div>`;
  };
  OB.qSearch = (kind) => {
    const c = Q_CFG[kind]; const fs = OB.state.fs; const open = fs.pop === 'q' && fs.qKind === kind;
    return `
      <div class="search-fields">
        <div class="sf-anchor q-anchor">
          <label class="sfield q-field ${open ? 'is-open' : ''}" for="q-${kind}">
            <span class="sfield-icon">${icon('search')}</span>
            <span class="sfield-body"><span class="sf-label">${c.label}</span>
              <input id="q-${kind}" type="search" placeholder="${c.ph}" value="${esc(fs.qKind === kind ? fs.qText : '')}" data-action="q-input" data-kind="${kind}" autocomplete="off" aria-expanded="${open}" aria-haspopup="listbox"></span>
          </label>
          ${open ? qPop(kind) : ''}
        </div>
        ${go(c.go, c.btn)}
      </div>`;
  };

  OB.TABS = [
    { id: 'flights', label: 'Flights', icon: 'plane', hero: 'hero-balloons', pos: '50% 12%' },
    { id: 'hotels', label: 'Hotels', icon: 'bed', hero: 'dest-maldives', hidden: true },
    { id: 'events', label: 'Events', icon: 'ticket', hero: 'cat-music' },
    { id: 'experiences', label: 'Experiences', icon: 'compass', hero: 'hero-experiences', pos: '50% 40%' },
    { id: 'movies', label: 'Movies', icon: 'film', hero: 'hero-movies' },
    { id: 'extras', label: 'Travel extras', icon: 'luggage', hero: 'hero-extras', pos: '50% 45%' }
  ];

  OB.searchForm = (tab) => {
    switch (tab) {
      case 'hotels': return `
        <div class="search-fields">
          ${sfield('h-where', 'pin', 'Destination', 'Lekki, Lagos', { wide: true })}
          ${sfield('h-dates', 'calendar', 'Check-in – check-out', 'Fri, 18 Dec – Mon, 21 Dec')}
          ${sfield('h-guests', 'users', 'Guests and rooms', '2 adults · 1 room')}
          ${go('hotels', 'Search hotels')}
        </div>`;
      case 'events': return OB.qSearch('events');
      case 'experiences': return OB.qSearch('experiences');
      case 'movies': return OB.cinemaSearch();
      case 'extras': return `
        <div class="search-fields">
          ${sfield('a-airport', 'pin', 'Departure airport', 'Lagos (LOS), Terminal 2', { wide: true, options: ['Lagos (LOS), Terminal 2', 'Lagos (LOS), MMA2 domestic', 'Abuja (ABV)', 'Port Harcourt (PHC)'] })}
          ${sfield('a-date', 'calendar', 'Travel date', 'Fri, 18 Dec 2026')}
          ${sfield('a-pax', 'user', 'Travellers', '1 traveller', { options: ['1 traveller', '2 travellers', '3 travellers', '4 travellers'] })}
          ${go('extras', 'See extras')}
        </div>`;
      default: {
        const fs = OB.state.fs;
        const round = fs.trip === 'round';
        const paxField = `
          <div class="sf-anchor sf-pax-wrap">
            <button class="sfield sf-pax ${fs.pop === 'pax' ? 'is-open' : ''}" type="button" data-action="fs-pop" data-pop="pax" aria-expanded="${fs.pop === 'pax'}" aria-haspopup="dialog">
              <span class="sfield-icon">${icon('user')}</span>
              <span class="sfield-body"><span class="sf-label">Travellers</span><span class="sf-value">${OB.paxShort()}</span></span>
              ${icon('chevronDown', 'sf-caret')}
            </button>
            ${fs.pop === 'pax' ? OB.paxPop() : ''}
          </div>`;
        if (fs.trip === 'multi') return `
        ${OB.flightOptions()}
        <div class="mc-list">
          ${fs.legs.map((lg, i) => `
          <div class="mc-row" role="group" aria-label="Flight ${i + 1}">
            <div class="sfield-pair">
              ${apField('mc-from-' + i, 'From where', 'takeoff')}
              <button class="swap-btn" type="button" data-action="mc-swap" data-i="${i}" aria-label="Swap flight ${i + 1} origin and destination">${icon('swap')}</button>
              ${apField('mc-to-' + i, 'To where', 'landing')}
            </div>
            <div class="sf-anchor mc-date-wrap">
              <button class="sfield mc-date ${fs.pop === 'mdate' && fs.mIdx === i ? 'is-open' : ''}" type="button" data-action="fs-pop" data-pop="mdate" data-i="${i}" aria-haspopup="dialog">
                <span class="sfield-icon">${icon('calendar')}</span>
                <span class="sfield-body"><span class="sf-label">Date</span><span class="sf-value">${OB.fsField(lg.date)}</span></span>
              </button>
              ${fs.pop === 'mdate' && fs.mIdx === i ? OB.calendarPop() : ''}
            </div>
            ${i > 1 ? `<button class="icon-btn mc-remove" type="button" data-action="mc-remove" data-i="${i}" aria-label="Remove flight ${i + 1}">${icon('x')}</button>` : '<span class="mc-remove-spacer"></span>'}
          </div>`).join('')}
        </div>
        <div class="mc-foot">
          ${fs.legs.length < 5 ? `<button class="link-btn" type="button" data-action="mc-add">${icon('plus')} Add another flight</button>` : '<span class="text-xs muted">Up to 5 flights per booking</span>'}
          <button class="btn btn-primary btn-lg mc-search" type="submit" data-go="flights">${icon('search')} Search flights</button>
        </div>`;
        return `
        ${OB.flightOptions()}
        <div class="search-fields">
          <div class="sfield-pair">
            ${apField('from', 'From where', 'takeoff')}
            <button class="swap-btn" type="button" data-action="swap" aria-label="Swap origin and destination">${icon('swap')}</button>
            ${apField('to', 'To where', 'landing')}
          </div>
          <div class="sf-anchor sf-dates-wrap">
            <div class="sfield sf-dates ${fs.pop === 'dates' ? 'is-open' : ''}">
              <button class="sf-half" type="button" data-action="fs-pop" data-pop="dates" data-pick="dep" aria-expanded="${fs.pop === 'dates'}" aria-haspopup="dialog">
                <span class="sfield-icon">${icon('calendar')}</span>
                <span class="sfield-body"><span class="sf-label">Departure</span><span class="sf-value ${fs.pop === 'dates' && fs.picking === 'dep' ? 'is-picking' : ''}">${OB.fsField(fs.dep)}</span></span>
              </button>
              <span class="sf-divider" aria-hidden="true"></span>
              <button class="sf-half" type="button" data-action="fs-pop" data-pop="dates" data-pick="ret" aria-expanded="${fs.pop === 'dates'}" aria-haspopup="dialog">
                <span class="sfield-icon">${icon('calendar')}</span>
                <span class="sfield-body"><span class="sf-label">Return</span><span class="sf-value ${fs.pop === 'dates' && fs.picking === 'ret' ? 'is-picking' : ''} ${round && fs.ret ? '' : 'is-empty'}">${round ? (fs.ret ? OB.fsField(fs.ret) : 'Select date') : 'Add return'}</span></span>
              </button>
            </div>
            ${fs.pop === 'dates' ? OB.calendarPop() : ''}
          </div>
          ${paxField}
          ${go('flights', 'Search flights')}
        </div>`;
      }
    }
  };

  // Set to false to go back to the balloon photo on the v1 Flights hero.
  OB.HERO_VIDEO = false;

  OB.hero = (tab) => {
    const t = OB.TABS.find((x) => x.id === tab) || OB.TABS[0];
    const video = OB.HERO_VIDEO && t.id === 'flights';
    const bg = video
      ? `<img class="hero-poster" src="${img('hero-jet-poster')}" alt=""><video class="hero-video" data-src="hero-jet" autoplay muted loop playsinline preload="auto" poster="${img('hero-jet-poster')}" aria-hidden="true"><source src="assets/video/hero-jet.mp4" type="video/mp4"></video>`
      : `<img src="${img(t.hero)}" alt="" style="object-position:${t.pos || '50% 50%'}">`;
    return `
    <section class="hero ${video ? 'has-video' : ''}" aria-label="Search">
      <div class="hero-bg">${bg}</div>
      ${OB.nav({ overlay: true })}
      <div class="container hero-inner">
        <div>
          <h1>Book your next trip &amp; weekend plans, all in one place</h1>
          <p class="lede">Flights, concerts, experiences and cinema tickets across Africa.</p>
        </div>
        <div class="hero-tabs" role="tablist" aria-label="What are you booking?">
          ${OB.TABS.filter((x) => !x.hidden).map((x) => `<a class="hero-tab" role="tab" href="#home~${x.id}" aria-selected="${x.id === t.id}">${icon(x.icon)}${x.label}</a>`).join('')}
        </div>
        <form class="search-card" data-form="search" role="tabpanel" aria-label="${t.label} search">${OB.searchForm(t.id)}</form>
      </div>
    </section>`;
  };

  const sections = {
    flights: () => `<section class="section">${OB.sectionHead('Best flight deals', { rail: 'rail-deals' })}${OB.rail('rail-deals', OB.flightDeals.map(OB.dealCard))}</section>`,
    events: () => `<section class="section">${OB.sectionHead('Popular events this season', { sub: 'Concerts, comedy and parties in Lagos this Detty December.', href: 'events', rail: 'rail-events' })}${OB.rail('rail-events', OB.events.slice(0, 8).map(OB.eventCard))}</section>`,
    experiences: () => `<section class="section">${OB.sectionHead('Curated experiences', { sub: 'Hand-picked trips and day plans from trusted local operators.', href: 'experiences', rail: 'rail-exp' })}${OB.rail('rail-exp', OB.experiences.slice(0, 8).map(OB.expCard))}</section>`,
    movies: () => `<section class="section">${OB.sectionHead('Now showing in Lagos', { href: 'movies', rail: 'rail-movies' })}${OB.rail('rail-movies', OB.movies.map(OB.movieCard))}</section>`,
    hotels: () => `<section class="section">${OB.sectionHead('Stays our travellers love', { href: 'hotels', rail: 'rail-hotels' })}${OB.rail('rail-hotels', OB.hotels.map(OB.hotelCard))}</section>`,
    extras: () => `<section class="section">${OB.sectionHead('Travel extras for your next flight', { sub: 'Protocol, lounges, data and insurance, added in a minute.', href: 'extras' })}
      <div class="grid-3">${OB.airportAddons.slice(0, 3).map((a) => `
        <a class="panel row" href="#extras" style="align-items:flex-start;gap:16px;color:inherit;text-decoration:none">
          <span class="addon-thumb">${icon(a.icon)}</span>
          <span class="stack" style="gap:4px"><strong>${esc(a.title)}</strong><span class="muted text-sm">${OB.fmt(a.price)} per traveller</span></span>
        </a>`).join('')}</div></section>`
  };

  const skCard = () => `
    <div class="sk-card" aria-hidden="true">
      <span class="skel sk-media"></span>
      <span class="skel sk-line w80"></span><span class="skel sk-line w60"></span><span class="skel sk-line w40 sk-price"></span>
    </div>`;
  const skSection = () => `
    <section class="section">
      <div class="section-head"><div class="sk-head"><span class="skel sk-title"></span><span class="skel sk-line w50"></span></div></div>
      <div class="rail sk-rail">${Array.from({ length: 4 }, skCard).join('')}</div>
    </section>`;
  OB.homeSkeleton = (wide) => `
    <main class="container page-body ${wide}" aria-busy="true" aria-label="Loading deals and events">
      <span class="sr-only" role="status">Loading the latest deals…</span>
      <div class="banner-rail sk-banners"><span class="skel sk-banner"></span><span class="skel sk-banner"></span></div>
      ${skSection()}${skSection()}
      <span class="skel sk-strip"></span>
      ${skSection()}
    </main>`;

  OB.pages = OB.pages || {};
  OB.hero2 = (tab) => {
    const t = OB.TABS.find((x) => x.id === tab) || OB.TABS[0];
    return `
    ${OB.nav({ home: 'home2' })}
    <div class="hero2-frame">
      <section class="hero2" aria-label="Search">
        <div class="hero-bg hero2-bg"><img src="${img(t.hero)}" alt="" style="object-position:${t.pos || '50% 50%'}"></div>
        <div class="hero2-content">
          <h1>Book your next trip &amp; weekend plans, all in one place</h1>
          <p class="lede">Flights, concerts, experiences and cinema tickets across Africa.</p>
        </div>
        <div class="hero2-dock">
          <div class="hero-tabs hero2-tabs" role="tablist" aria-label="What are you booking?">
            ${OB.TABS.filter((x) => !x.hidden).map((x) => `<a class="hero-tab" role="tab" href="#home2~${x.id}" aria-selected="${x.id === t.id}">${icon(x.icon)}${x.label}</a>`).join('')}
          </div>
          <form class="search-card" data-form="search" role="tabpanel" aria-label="${t.label} search">${OB.searchForm(t.id)}</form>
        </div>
      </section>
    </div>`;
  };

  OB.pages.home2 = (tab = 'flights') => OB.pages.home(tab, OB.hero2);

  // Sections hidden from the homepage for now. Remove a name to bring it back.
  OB.HOME_HIDDEN = new Set(['movies', 'dining', 'hotels', 'extras', 'create']);

  OB.pages.home = (tab = 'flights', heroFn = OB.hero) => {
    OB.state.tab = tab;
    const shown = (k) => !OB.HOME_HIDDEN.has(k);
    const order = [tab, ...['flights', 'events', 'experiences', 'movies', 'hotels', 'extras'].filter((x) => x !== tab)].filter(shown);
    const wide = heroFn === OB.hero2 ? 'container-wide' : '';
    if (OB.state.homeLoading) return `${heroFn(tab)}${OB.homeSkeleton(wide)}${OB.footer()}`;
    const bodyRails = order.map((k) => sections[k]());
    return `
      ${heroFn(tab)}
      <main class="container page-body ${wide}">
        <div class="banner-rail" aria-label="Featured">
          <a class="banner" href="#event~afrobeats-live"><img src="${img('banner-fuji')}" alt="Fuji: Adekunle Gold live at the National Theatre, 26 December, 7pm"></a>
          <a class="banner" href="#extras"><img src="${img('banner-kalabash')}" alt="Kalabash Card: the ultimate travel companion"></a>
          <a class="banner" href="#events"><img src="${img('banner-esports')}" alt="Esports World Cup: Witness the action"></a>
        </div>
        ${bodyRails.slice(0, 2).join('')}
        ${OB.socialStrip()}
        ${bodyRails.slice(2, 4).join('')}
        ${shown('dining') ? `<section class="section">
          ${OB.sectionHead('Dining & nightlife', { sub: 'Book a table at the places everyone is talking about.', rail: 'rail-dining' })}
          ${OB.rail('rail-dining', OB.dining.map(OB.diningCard))}
        </section>` : ''}
        <section class="section">
          ${OB.sectionHead('Plans for every kind of crew')}
          <div class="grid-4 keep-2">
            ${OB.tile('Families', 'who-families', 'experiences')}${OB.tile('Couples', 'who-couples', 'experiences')}
            ${OB.tile('Kids', 'who-kids', 'experiences')}${OB.tile('Solo', 'who-solo', 'experiences')}
          </div>
        </section>
        ${bodyRails.slice(4).join('')}
        ${shown('create') ? `<section class="promo-split" aria-labelledby="create-title">
          <div class="stack" style="gap:16px;align-content:center">
            <span class="eyebrow">For organisers</span>
            <h2 id="create-title">Create and sell out your events with Onburd</h2>
            <p class="muted">List your event in minutes, sell tickets in naira or dollars, and let fans pay small small. Payouts land within 24 hours of each sale.</p>
            <div><button class="btn btn-primary" type="button" data-action="toast" data-msg="The organiser dashboard is a separate product, not part of this prototype.">Create an event ${icon('arrowRight')}</button></div>
          </div>
          <div class="promo-collage">
            <img class="short" src="${img('event-dj-portrait')}" alt="">
            <img class="tall" src="${img('event-crowd')}" alt="">
            <div class="rating-card"><span class="stars">${icon('star').repeat(5)}</span>4.8 on the App Store</div>
          </div>
          <div class="stat-list">
            <div><strong>11+</strong><span>years in travel</span></div>
            <div><strong>1,180+</strong><span>events listed</span></div>
            <div><strong>140K+</strong><span>happy customers</span></div>
          </div>
        </section>` : ''}
        ${OB.newsletter()}
      </main>
      ${OB.footer()}`;
  };
})();
