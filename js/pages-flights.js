window.OB = window.OB || {};
(() => {
  const { icon, img, esc, fmt } = OB;
  const FLIGHT_STEPS = ['Select flight', 'Traveller details', 'Extras', 'Payment'];
  const retIso = () => OB.state.fs.ret || OB.state.fs.dep;

  const searchbar = () => {
    const fs = OB.state.fs; const open = OB.state.searchOpen;
    const route = fs.trip === 'multi' ? OB.routeTitle() : `${OB.cityOf(fs.from)} → ${OB.cityOf(fs.to)}`;
    const dates = fs.trip === 'multi' ? `${fs.legs.length} flights` : `${OB.fsShort(fs.dep)}${fs.trip === 'round' && fs.ret ? ' – ' + OB.fsShort(fs.ret) : ''}`;
    return `
    <div class="searchbar searchbar-collapse ${open ? 'is-open' : ''}"><div class="container">
      <button class="search-summary" type="button" data-action="toggle-search" aria-expanded="${open}">
        <span class="search-summary-text"><strong>${OB.esc(route)}</strong><small>${dates} · ${OB.paxShort()} · ${fs.cabin}</small></span>
        <span class="search-summary-edit">${open ? 'Close' : 'Edit'} ${icon(open ? 'x' : 'edit')}</span>
      </button>
      <form class="search-card" data-form="search" aria-label="Edit flight search">${OB.searchForm('flights')}</form>
    </div></div>`;
  };

  const timeline = (f, leg, date) => {
    const a = OB.airlines[f.al].name;
    if (!leg.stops) {
      return `<div class="timeline">
        <div class="tl-item"><div class="tl-time">${leg.dep}<small>${date}</small></div><div class="tl-rail"><i></i><b></b></div><div class="tl-body"><strong>${OB.airports[leg.from]} (${leg.from})</strong><span>${a} · ${f.no} · ${f.cabin} · Boeing 777-300ER</span></div></div>
        <div class="tl-item"><div class="tl-time">${leg.arr}<small>${leg.plus ? 'next day' : date}</small></div><div class="tl-rail"><i></i></div><div class="tl-body"><strong>${OB.airports[leg.to]} (${leg.to})</strong><span>Flight time ${leg.dur}</span></div></div>
      </div>`;
    }
    return `<div class="timeline">
      <div class="tl-item"><div class="tl-time">${leg.dep}<small>${date}</small></div><div class="tl-rail"><i></i><b></b></div><div class="tl-body"><strong>${OB.airports[leg.from]} (${leg.from})</strong><span>${a} · ${f.no} · ${f.cabin}</span></div></div>
      <div class="tl-item"><div class="tl-time">—</div><div class="tl-rail"><i></i></div><div class="tl-body"><strong>${OB.airports[leg.via]} (${leg.via})</strong><span>Change planes</span></div></div>
      <div class="layover"><span>Layover in ${OB.airports[leg.via].split(' ')[0]}</span><span>2h 50m</span></div>
      <div class="tl-item"><div class="tl-time">${leg.arr}<small>${leg.plus ? 'next day' : date}</small></div><div class="tl-rail"><i></i></div><div class="tl-body"><strong>${OB.airports[leg.to]} (${leg.to})</strong><span>Total journey ${leg.dur}</span></div></div>
    </div>`;
  };

  const CITY = { LOS: 'Lagos', DXB: 'Dubai', ABV: 'Abuja', ACC: 'Accra', LHR: 'London', NBO: 'Nairobi', CDG: 'Paris' };
  const TRIP_WORD = { round: 'Round trip', oneway: 'One way', multi: 'Multi-city' };
  OB.journeyLegs = (f) => {
    const fs = OB.state.fs;
    if (fs.trip === 'multi') return fs.legs.map((l, i) => [{ ...(i % 2 ? f.ret : f.out), from: OB.codeOf(l.from), to: OB.codeOf(l.to) }, l.date]);
    const o = OB.codeOf(fs.from), d = OB.codeOf(fs.to);
    return [[{ ...f.out, from: o, to: d }, fs.dep], ...(fs.trip === 'round' ? [[{ ...f.ret, from: d, to: o }, fs.ret || fs.dep]] : [])];
  };
  OB.routeTitle = () => {
    const fs = OB.state.fs;
    if (fs.trip === 'multi') return [OB.cityOf(fs.legs[0].from), ...fs.legs.map((l) => OB.cityOf(l.to))].join(' → ');
    return `${OB.cityOf(fs.from)} to ${OB.cityOf(fs.to)}`;
  };
  OB.routeSub = () => {
    const fs = OB.state.fs;
    const dates = fs.trip === 'multi' ? `${fs.legs.length} flights · ${OB.fsShort(fs.legs[0].date)} – ${OB.fsShort(fs.legs[fs.legs.length - 1].date)}`
      : `${OB.fsDate(fs.dep)}${fs.trip === 'round' ? ' – ' + OB.fsDate(fs.ret || fs.dep) : ' · One way'}`;
    return `${dates} · ${OB.paxLabel()} · ${fs.cabin}`;
  };
  const durLong = (d) => d.replace('h ', 'hr ');
  const addMin = (t, m) => { const [h, mm] = t.split(':').map(Number); const x = (h * 60 + mm + m + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };
  OB.altFlights = (f) => [[-185, 0.06], [240, 0.11]].map(([shift, up], i) => ({
    ...f, id: `${f.id}-alt${i}`, alt: true, tags: [],
    no: f.no.replace(/\d+$/, (n) => +n + (i + 1) * 2),
    price: Math.round(f.price * (1 + up) / 100) * 100,
    out: { ...f.out, dep: addMin(f.out.dep, shift), arr: addMin(f.out.arr, shift) },
    ret: { ...f.ret, dep: addMin(f.ret.dep, -shift), arr: addMin(f.ret.arr, -shift) }
  }));
  OB.getFlight = (id) => OB.flights.find((f) => f.id === id) || OB.flights.flatMap(OB.altFlights).find((f) => f.id === id) || OB.flights[0];

  const legRow = (leg) => `
    <div class="fleg">
      <div class="fleg-pt"><strong>${leg.dep}</strong><span>${OB.airport(leg.from).city} (${leg.from})</span></div>
      <div class="fleg-mid"><span class="fleg-pill">${durLong(leg.dur)} ${icon('plane')} ${leg.stops ? '1 Stop' : 'Non-stop'}</span></div>
      <div class="fleg-pt"><strong>${leg.arr}${leg.plus ? '<sup> +1</sup>' : ''}</strong><span>${OB.airport(leg.to).city} (${leg.to})</span></div>
    </div>`;

  const flightCard = (f, label = '') => {
    const round = OB.state.fs.trip === 'round';
    const moreOpen = !f.alt && OB.state.openMore === f.id;
    const alts = f.alt ? [] : OB.altFlights(f);
    const airline = OB.airlines[f.al].name;
    return `
    <article class="fcard2 ${label ? 'has-flag' : ''} ${f.alt ? 'is-alt' : ''}">
      ${label ? `<span class="fcard-flag flag-${label.toLowerCase()}">${label}</span>` : ''}
      <div class="fcard2-body">
        <div class="fcard2-main">
          <div class="fcard2-head"><div class="row fcard2-airline">${OB.airlineLogo(f.al)}<strong>${airline}</strong></div></div>
          ${OB.journeyLegs(f).map(([leg]) => legRow(leg)).join('<hr class="fdash">')}
        </div>
        <div class="fprice">
          <div class="row-between"><span class="fprice-cabin">${f.cabin} Class</span>${f.refundable ? '<span class="badge badge-success">Refundable</span>' : '<span class="badge badge-neutral">Non-refundable</span>'}</div>
          <div><span class="fprice-label">Full Fare</span><span class="fprice-amt">NGN ${Math.round(f.price).toLocaleString('en-NG')}</span></div>
          <div class="fprice-foot">
            <span class="fprice-pss"><img src="assets/brand/pss-logo.svg" alt=""><span><small>Pay Small Small</small><strong>${fmt(OB.pssMonthly(f.price))}</strong></span></span>
            <button class="fbook" type="button" data-action="select-flight" data-id="${f.id}">Book Now</button>
          </div>
        </div>
        <button class="fdetails-tab" type="button" data-action="flight-details" data-id="${f.id}" aria-haspopup="dialog">View flight details</button>
      </div>
      ${moreOpen ? `<div class="fmore-cards">${alts.map((a) => flightCard(a)).join('')}</div>` : ''}
      ${alts.length ? `<button class="fmore" type="button" data-action="more-flights" data-id="${f.id}" aria-expanded="${moreOpen}">${moreOpen ? 'Hide' : '+'} ${alts.length} ${airline} flights ${icon('chevronDown')}</button>` : ''}
    </article>`;
  };

  const AIRCRAFT = { QR: 'Boeing 787-9', ET: 'Boeing 787-8', KQ: 'Boeing 737-800', AF: 'Airbus A350-900' };
  const LAYOVER = 170;
  // Booking class letter (RBD) for each fare brand
  const RBD = { Saver: 'T', Classic: 'K', Comfort: 'M', Lite: 'V', Basic: 'Q', Standard: 'L', EcoFly: 'T' };
  const nextDay = (iso) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
  const toMin = (d) => { const m = d.match(/(\d+)h (\d+)m/); return +m[1] * 60 + +m[2]; };
  const fmtDur = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
  const segments = (f, leg) => {
    if (!leg.stops) return [{ from: leg.from, to: leg.to, dep: leg.dep, arr: leg.arr, dur: toMin(leg.dur), no: f.no, day: 0 }];
    const fly = toMin(leg.dur) - LAYOVER;
    const s1 = Math.round(fly * 0.55), s2 = fly - s1;
    const a1 = addMin(leg.dep, s1), d2 = addMin(a1, LAYOVER);
    return [
      { from: leg.from, to: leg.via, dep: leg.dep, arr: a1, dur: s1, no: f.no, day: 0 },
      { from: leg.via, to: leg.to, dep: d2, arr: leg.arr, dur: s2, no: f.no.replace(/\d+$/, (n) => +n + 1), day: d2 < leg.dep ? 1 : 0 }
    ];
  };

  OB.flightDetailsModal = (f) => {
    const round = OB.state.fs.trip === 'round';
    const al = OB.airlines[f.al].name;
    const openIdx = OB.state.fdOpen ?? 0;
    const legs = OB.journeyLegs(f);
    const segRow = (sg, iso) => `
      <div class="fd-seg">
        <div class="fd-seg-al">${OB.airlineLogo(f.al, true)}<div><strong>${al}</strong><span>${sg.no} · ${AIRCRAFT[f.al]}</span></div>
          <em>${OB.fsDate(sg.day ? nextDay(iso) : iso, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}<i aria-hidden="true">|</i>Class: ${RBD[f.fare] || 'Y'}</em>
          ${f.operatedBy && f.operatedBy.seg === sg.idx ? `<b class="fd-operator">Operator: ${f.operatedBy.name}</b>` : ''}</div>
        <div class="fd-track">
          <div class="fd-times"><strong>${sg.dep}</strong>${icon('plane')}<strong>${sg.arr}</strong></div>
          <div class="fd-line"><i></i><i></i><i></i></div>
          <div class="fd-codes"><span>${sg.from}</span><small>${fmtDur(sg.dur)} · Non-stop</small><span>${sg.to}</span></div>
        </div>
      </div>`;
    const legBlock = ([leg, iso], i) => {
      const open = i === openIdx;
      const segs = segments(f, leg);
      return `
      <section class="fd-journey ${open ? 'is-open' : ''}">
        <button class="fd-jhead" type="button" data-action="fd-toggle" data-i="${i}" data-id="${f.id}" aria-expanded="${open}">
          <span class="fd-jtitle"><small>${i + 1} of ${legs.length}</small>${leg.from} to ${leg.to}</span>
          <span class="fd-jmeta">${segs[0].no}</span>
          <span class="fd-jmeta">${OB.fsDate(iso, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          <span class="fd-jmeta">${leg.dur} · ${leg.stops ? '1 stop' : 'Non-stop'}</span>
          ${icon('chevronDown')}
        </button>
        ${open ? `<div class="fd-jbody">
          ${segs.map((sg, k) => (k ? `<div class="fd-layover"><strong>${fmtDur(LAYOVER)}</strong><span>Layover: ${OB.airports[leg.via]}</span></div>` : '') + segRow({ ...sg, idx: k }, iso)).join('')}
          <div class="fd-bag">${icon('luggage')}<span>${f.bag.replace(' × ', 'PCS x ').replace('kg', 'Kg')} checked · 1 × 7Kg cabin</span></div>
        </div>` : ''}
      </section>`;
    };
    return `
    <div class="modal" data-action="close-overlay">
      <div class="modal-panel modal-lg" role="dialog" aria-modal="true" aria-label="Flight details" data-stop>
        <div class="modal-head"><div class="row">${OB.airlineLogo(f.al)}<div><h2>${al}</h2><span class="text-xs muted">${f.no} · ${f.cabin} ${f.fare}</span></div></div>
          <button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close">${icon('x')}</button></div>
        <div class="fd-body">
          ${legs.map(legBlock).join('')}
        </div>
        <div class="fd-foot">
          <span class="fprice-amt">NGN ${Math.round(f.price).toLocaleString('en-NG')}</span>
          <span class="fd-per">${TRIP_WORD[OB.state.fs.trip]} per passenger</span>
          <button class="fbook fbook-lg" type="button" data-action="select-flight" data-id="${f.id}">Book Flight</button>
        </div>
      </div>
    </div>`;
  };

  const durMin = (d) => { const m = d.match(/(\d+)h (\d+)m/); return +m[1] * 60 + +m[2]; };

  OB.filteredFlights = () => {
    const s = OB.state.ff;
    let list = OB.flights.filter((f) => (s.stops === 'any' || (s.stops === '0' ? f.out.stops === 0 : f.out.stops > 0))
      && !s.hiddenAirlines.has(f.al) && (!s.refundable || f.refundable) && f.price <= s.maxPrice);
    const sorters = {
      cheapest: (a, b) => a.price - b.price,
      fastest: (a, b) => durMin(a.out.dur) - durMin(b.out.dur)
    };
    return list.sort(sorters.cheapest);
  };

  const PLANE = '<svg class="fl-plane" viewBox="0 0 120 52" aria-hidden="true"><path d="M27 24 15 7H9l6 17z" fill="#1878E6"/><path d="M24 28.5 13 37H8l6-8.5z" fill="#1878E6"/><path d="M82 24 59 5h-8l15 19z" fill="#1878E6"/><path d="M10 23.5h88c7.5 0 13.5 1.2 13.5 2.6s-6 2.7-13.5 2.7H10a2.65 2.65 0 0 1 0-5.3z" fill="#2C90FF"/><path d="M82 28.8 59 47h-8l15-18.2z" fill="#2C90FF"/><path d="M28 25.6h60" stroke="#fff" stroke-width="1.5" stroke-dasharray="2.4 3.6" stroke-linecap="round"/><path d="M101 24.6c3 .2 5.5.7 7 1.4" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>';
  const TRIP_TXT = { round: 'Return trip', oneway: 'One way', multi: 'Multi-city' };
  OB.flightLoaderModal = () => {
    const fs = OB.state.fs;
    const multi = fs.trip === 'multi';
    const ap = (v) => `${OB.cityOf(v)} (${OB.codeOf(v)})`;
    const route = multi ? fs.legs.map((l) => OB.codeOf(l.from)).concat(OB.codeOf(fs.legs[fs.legs.length - 1].to)).join(' → ')
      : `${ap(fs.from)} <span class="fll-arrow" aria-label="to"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M21 12c0-.8-.7-1.4-1.6-1.4h-5.1L9.6 3H7.4l2.4 7.6H5.2L3.6 8.4H2l1 3.6-1 3.6h1.6l1.6-2.2h4.6L7.4 21h2.2l4.7-7.6h5.1c.9 0 1.6-.6 1.6-1.4z" fill="currentColor"/></svg></span> ${ap(fs.to)}`;
    const d = (iso) => OB.fsDate(iso, { day: 'numeric', month: 'short', year: 'numeric' });
    const dates = multi ? `${d(fs.legs[0].date)} – ${d(fs.legs[fs.legs.length - 1].date)}` : fs.trip === 'round' && fs.ret ? `${d(fs.dep)} – ${d(fs.ret)}` : d(fs.dep);
    const pax = fs.adults + fs.children + fs.infants;
    return `
    <div class="fll-backdrop">
      <div class="fll-card" role="status" aria-live="polite" aria-label="Searching flights">
        <div class="fll-icon" aria-hidden="true">
          <span class="fll-cloud k1"></span><span class="fll-cloud k2"></span><span class="fll-cloud k3"></span>
          ${PLANE}
        </div>
        <p class="fll-kicker">Finding the best fares for you</p>
        <h2 class="fll-route">${route}</h2>
        <p class="fll-meta">${dates}</p>
        <p class="fll-meta">${pax} ${pax > 1 ? 'passengers' : 'passenger'}, ${TRIP_TXT[fs.trip]}</p>
        <div class="fll-bar"><span></span></div>
      </div>
    </div>`;
  };

  OB.pages.flights = () => {
    const s = OB.state.ff;
    const list = OB.filteredFlights();
    const cheapest = [...OB.flights].sort((a, b) => a.price - b.price)[0];
    const fastest = [...OB.flights].sort((a, b) => durMin(a.out.dur) - durMin(b.out.dur))[0];
    const codes = OB.airlineOrder;
    const allFares = OB.fareMatrix.flatMap((c) => c.fares).filter(Boolean);
    const lowest = Math.min(...allFares);
    const STOP_ROWS = ['Non-stop', '1 stop', '2+ stops'];
    const matrixCol = ({ al: c, via, fares }) => `
      <div class="fm-col ${s.hiddenAirlines.size && !s.hiddenAirlines.has(c) ? 'is-active' : ''}">
        <div class="fm-head">${OB.airlineLogo(c)}<span>${OB.airlines[c].name}<small>${via}</small></span></div>
        ${fares.map((v, i) => v
          ? `<button class="fm-cell ${v === lowest ? 'is-lowest' : ''}" type="button" data-action="matrix" data-al="${c}" aria-label="${OB.airlines[c].name}, ${STOP_ROWS[i]}, ${fmt(v)}">${fmt(v)}</button>`
          : '<span class="fm-cell is-empty" aria-label="Not available">—</span>').join('')}
      </div>`;
    return `
      ${OB.nav({ current: 'flights' })}
      ${searchbar()}
      <main class="container" style="padding-block:0 72px">
        ${OB.stepper(FLIGHT_STEPS, 0)}
        <div class="stack" style="gap:24px;margin-top:24px">
          <div class="row-between">
            <div><h1 style="font-size:var(--fs-h1)">${OB.routeTitle()}</h1><p class="muted text-sm">${OB.routeSub()}</p></div>
            <button class="btn btn-secondary" type="button" data-action="share" data-kind="search" data-id="LOS-DXB">Share with friends ${icon('share')}</button>
          </div>
          <section class="fm" aria-label="Fares by airline and stops">
            <div class="fm-labels" aria-hidden="true"><span class="fm-head"></span>${STOP_ROWS.map((r) => `<span class="fm-cell">${r}</span>`).join('')}</div>
            <div class="fm-scroller">
              <button class="icon-btn fm-nav prev" type="button" data-action="rail" data-dir="-1" data-target="fm-track" aria-label="Previous airlines">${icon('arrowLeft')}</button>
              <div class="fm-track" id="fm-track">${OB.fareMatrix.map(matrixCol).join('')}</div>
              <button class="icon-btn fm-nav next" type="button" data-action="rail" data-dir="1" data-target="fm-track" aria-label="More airlines">${icon('arrowRight')}</button>
            </div>
          </section>
          <div class="results-layout">
            <button class="btn btn-secondary filters-toggle" type="button" data-action="toggle-filters" aria-expanded="${OB.state.filtersOpen}">${icon('sliders')} ${OB.state.filtersOpen ? 'Hide filters' : 'Filters'}</button>
            <aside class="filters-wrap ${OB.state.filtersOpen ? 'is-open' : ''}" aria-label="Sort and filter">
            <div class="row-between filters-title"><h2>Sort &amp; filter</h2><button class="link-btn" type="button" data-action="clear-filters">Clear all</button></div>
            <div class="filters">
              <div class="filter-group">
                <label class="row-between" style="cursor:pointer"><span><strong class="text-sm">Price watch</strong><span class="text-xs muted" style="display:block">${OB.fsDate(OB.state.fs.dep, { day: 'numeric', month: 'short' })}${OB.state.fs.trip === 'round' ? ' – ' + OB.fsDate(retIso(), { day: 'numeric', month: 'short' }) : ''}</span></span>
                <span class="toggle"><input type="checkbox" id="price-watch" data-action="price-watch" ${OB.state.priceWatch ? 'checked' : ''}><span></span></span></label>
              </div>
              <div class="filter-group"><h4>Stops</h4>
                ${[['any', 'Any number of stops'], ['0', 'Non-stop only'], ['1', '1 stop']].map(([v, l]) => `
                  <label class="check"><input type="radio" name="stops" value="${v}" data-action="filter-stops" ${s.stops === v ? 'checked' : ''}>${l}</label>`).join('')}
              </div>
              <div class="filter-group"><h4>Airlines</h4>
                ${codes.map((c) => `<div class="filter-opt"><label class="check"><input type="checkbox" data-action="filter-airline" data-al="${c}" ${s.hiddenAirlines.has(c) ? '' : 'checked'}>${OB.airlines[c].name}</label><span class="num">${fmt(OB.flights.find((f) => f.al === c).price)}</span></div>`).join('')}
              </div>
              <div class="filter-group"><h4>Max price <span class="num text-xs">${fmt(s.maxPrice)}</span></h4>
                <label class="sr-only" for="max-price">Maximum price</label>
                <input class="range" id="max-price" type="range" min="1000000" max="1400000" step="10000" value="${s.maxPrice}" data-action="filter-price">
                <div class="row-between text-xs muted"><span>₦1.0m</span><span>₦1.4m</span></div>
              </div>
              <div class="filter-group"><h4>Fare type</h4>
                <label class="check"><input type="checkbox" data-action="filter-refundable" ${s.refundable ? 'checked' : ''}>Refundable fares only</label>
              </div>
            </div>
            </aside>
            <div class="stack" style="gap:16px;min-width:0">
              <p class="text-sm muted">${list.length} of ${OB.flights.length} flights, cheapest first</p>
              ${list.length ? list.map((f, i) => flightCard(f, ['Cheapest', 'Fastest'][i] || '')).join('') : `
                <div class="panel empty">${icon('search')}<strong style="color:var(--ink)">No flights match these filters</strong><span>Try allowing stops or raising the max price.</span><button class="btn btn-secondary" type="button" data-action="clear-filters">Clear filters</button></div>`}
            </div>
          </div>
        </div>
      </main>
      ${OB.footer()}`;
  };

  OB.flightOrder = () => {
    const f = OB.getFlight(OB.state.flightId);
    const fs = OB.state.fs;
    const total = Math.round(f.price * (fs.adults + fs.children * 0.75 + fs.infants * 0.1) * (fs.trip === 'round' ? 1 : fs.trip === 'multi' ? 0.55 * fs.legs.length : 0.55));
    const lines = [[`Base fare (${OB.paxLabel()})`, Math.round(total * 0.64)], ['Taxes & airport fees', total - Math.round(total * 0.64)]];
    OB.flightExtras.forEach((x) => { if (OB.state.extras.has(x.id)) lines.push([x.title, x.price]); });
    lines.push(['Service charge', 4500]);
    if (OB.state.promo) lines.push([`Promo ${OB.state.promo}`, -Math.round(total * 0.05), 'neg']);
    return {
      kind: 'flight', summaryTitle: 'Trip summary', steps: FLIGHT_STEPS, payStep: 3, back: 'flight-extras', ref: 'OB-48213',
      item: { img: 'dest-dubai', title: 'Lagos ⇄ Dubai', sub: `${OB.airlines[f.al].name} · ${fs.trip === 'round' ? 'Return' : 'One way'} · ${OB.paxLabel()}` },
      lines, confirmTitle: 'Your flight is booked', confirmBody: `${OB.airlines[f.al].name} will issue your e-ticket within 30 minutes. We have emailed your itinerary and receipt.`
    };
  };

  const tripLegs = (f) => `
    ${[['Outbound', f.out, OB.fsShort(OB.state.fs.dep)], ...(OB.state.fs.trip === 'round' ? [['Return', f.ret, OB.fsShort(retIso())]] : [])].map(([label, leg, date]) => `
      <div class="trip-leg">
        <div class="row">${OB.airlineLogo(f.al)}<div><span class="trip-leg-label">${label}</span><div class="text-sm"><strong>${date}</strong> · ${OB.airlines[f.al].name}</div></div></div>
        ${legRow(leg)}
        <a class="link-btn text-xs" href="#flights">Change</a>
      </div>`).join('')}`;

  OB.pages['flight-trip'] = () => {
    const f = OB.getFlight(OB.state.flightId);
    const order = OB.flightOrder();
    const u = OB.state.paxPrefill ? OB.state.user : null;
    const v = (x) => (u ? esc(x) : '');
    return `
      ${OB.nav()}
      <main class="container" style="padding-block:0 72px">
        ${OB.stepper(FLIGHT_STEPS, 1)}
        <div class="with-aside" style="margin-top:28px">
          <form class="stack" style="gap:28px" data-form="pax" novalidate>
            ${OB.backTitle('Traveller details', 'flights')}
            <div class="notice notice-success">${icon('checkCircle')}<span>Good pick. This is one of the best-value fares for your dates, and seats at this price are limited.</span></div>
            <div class="stack" style="gap:10px">${tripLegs(f)}</div>

            <section class="panel" aria-labelledby="pax1">
              <div class="panel-head">
                <div><h2 id="pax1">Passenger 1 · Adult</h2><p>Enter names exactly as they appear on the passport.</p></div>
                ${OB.state.loggedIn ? `<button class="btn btn-soft btn-sm" type="button" data-action="prefill">${icon('user')} Use my saved details</button>` : ''}
              </div>
              <div class="form-grid">
                <div class="field-group col-3"><label for="p-title">Title</label><select class="select" id="p-title"><option>Ms</option><option>Mr</option><option>Mrs</option><option>Dr</option></select></div>
                <div class="field-group col-3"><label for="p-first">First name</label><input class="input" id="p-first" value="${v(OB.state.user.first)}" placeholder="As on passport" required></div>
                <div class="field-group col-3"><label for="p-middle">Middle name <span class="muted">(optional)</span></label><input class="input" id="p-middle"></div>
                <div class="field-group col-3"><label for="p-last">Surname</label><input class="input" id="p-last" value="${v(OB.state.user.last)}" placeholder="As on passport" required></div>
                <div class="field-group col-4"><label for="p-dob">Date of birth</label><input class="input" id="p-dob" type="date" value="${u ? u.dob : ''}" required><span class="hint">Checked against your departure date, ${OB.fsDate(OB.state.fs.dep, { day: "numeric", month: "short", year: "numeric" })}.</span></div>
                <div class="field-group col-4"><label for="p-gender">Gender</label><select class="select" id="p-gender"><option>Female</option><option>Male</option></select></div>
                <div class="field-group col-4"><label for="p-nat">Nationality</label><select class="select" id="p-nat"><option>Nigerian</option><option>Ghanaian</option><option>Kenyan</option><option>South African</option></select></div>
              </div>
              <hr class="divider" style="margin:24px 0 20px">
              <div class="row" style="margin-bottom:16px"><h3 style="font-size:var(--fs-h4)">Passport</h3><span class="badge badge-neutral">Required for international flights</span></div>
              <div class="form-grid">
                <div class="field-group col-4"><label for="p-pass">Passport number</label><input class="input" id="p-pass" value="${u ? u.passport.number : ''}" placeholder="A01234567" required></div>
                <div class="field-group col-4"><label for="p-exp">Expiry date</label><input class="input" id="p-exp" type="date" value="${u ? u.passport.expiry : ''}" required><span class="hint">Must be valid until at least 3 Jul 2027.</span></div>
                <div class="field-group col-4"><label for="p-issuer">Issuing country</label><select class="select" id="p-issuer"><option>Nigeria</option><option>Ghana</option><option>Kenya</option></select></div>
              </div>
            </section>

            <section class="panel" aria-labelledby="contact">
              <div class="panel-head"><div><h2 id="contact">Contact details</h2><p>We send your e-ticket and any schedule changes here.</p></div></div>
              <div class="form-grid">
                <div class="field-group col-6"><label for="c-email">Email address</label><input class="input" id="c-email" type="email" value="${OB.state.loggedIn ? esc(OB.state.user.email) : ''}" placeholder="you@example.com" required></div>
                <div class="field-group col-6"><label for="c-phone">Phone number</label>
                  <div class="phone-input"><select class="select" id="c-cc" aria-label="Country code"><option>🇳🇬 +234</option><option>🇬🇭 +233</option><option>🇰🇪 +254</option></select><input class="input" id="c-phone" type="tel" value="${OB.state.loggedIn ? '803 456 7890' : ''}" placeholder="803 456 7890" required></div></div>
              </div>
            </section>

            <details class="panel" ${OB.state.promo ? 'open' : ''}>
              <summary class="row-between" style="cursor:pointer;list-style:none"><strong>Have a promo code?</strong>${icon('chevronDown')}</summary>
              <div class="row" style="margin-top:16px;align-items:flex-end;flex-wrap:wrap">
                <div class="field-group" style="flex:1 1 220px"><label for="promo">Promo code</label><input class="input" id="promo" value="${esc(OB.state.promo || '')}" placeholder="e.g. DETTYDEC"></div>
                <button class="btn btn-secondary" type="button" data-action="apply-promo">Apply</button>
              </div>
              ${OB.state.promo ? `<p class="text-sm" style="color:var(--success-ink);margin-top:10px">${icon('checkCircle')} ${esc(OB.state.promo)} applied: 5% off your fare.</p>` : '<p class="hint text-xs muted" style="margin-top:8px">Try DETTYDEC for 5% off.</p>'}
            </details>

            <div class="stack" style="gap:12px">
              <label class="check"><input type="checkbox" id="tc-general" required><span>I agree to Onburd's <a href="#home">booking terms</a> and the airline's fare rules.</span></label>
              <label class="check"><input type="checkbox" id="tc-promo"><span>I agree to the Detty December promotion terms (only needed when using a promo code).</span></label>
              <p class="error text-xs" id="pax-error" style="color:var(--danger-ink)" hidden>Please accept the booking terms to continue.</p>
            </div>
            <div><button class="btn btn-primary btn-lg" type="submit">Continue to extras ${icon('arrowRight')}</button></div>
          </form>
          <div class="aside-sticky">${OB.orderSummary(order)}
            <div class="notice notice-info">${icon('info')}<span>Prices stay held for 20 minutes while you book.</span></div>
          </div>
        </div>
      </main>
      ${OB.footer()}`;
  };

  OB.pages['flight-extras'] = () => {
    const order = OB.flightOrder();
    return `
      ${OB.nav()}
      <main class="container" style="padding-block:0 72px">
        ${OB.stepper(FLIGHT_STEPS, 2)}
        <div class="with-aside" style="margin-top:28px">
          <div class="stack" style="gap:24px">
            ${OB.backTitle('Make the trip easier', 'flight-trip')}
            <p class="muted" style="margin-top:-12px">Optional extras for your Lagos–Dubai trip. You can also add these later from My bookings.</p>
            <div class="stack" style="gap:12px">
              ${OB.flightExtras.map((x) => {
                const on = OB.state.extras.has(x.id);
                return `
                <div class="addon-row ${on ? 'is-selected' : ''}">
                  <span class="addon-thumb">${icon(x.icon)}</span>
                  <div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><a class="text-xs" href="#home">Terms &amp; conditions</a></div>
                  <div class="addon-side">
                    <span class="price">${fmt(x.price)}<small> ${x.perPax ? '/ traveller' : '/ year'}</small></span>
                    <button class="btn btn-sm ${on ? 'btn-added' : 'btn-secondary'}" type="button" data-action="toggle-extra" data-id="${x.id}" aria-pressed="${on}">${on ? icon('check') + ' Added' : icon('plus') + ' Add'}</button>
                  </div>
                </div>`;
              }).join('')}
            </div>
            <div class="row" style="flex-wrap:wrap"><a class="btn btn-primary btn-lg" href="#pay~flight">Continue to payment ${icon('arrowRight')}</a><a class="btn btn-ghost" href="#pay~flight">Skip extras</a></div>
          </div>
          <div class="aside-sticky">${OB.orderSummary(order)}</div>
        </div>
      </main>
      ${OB.footer()}`;
  };

  /* ---------- Shared payment + confirmation (all products) ---------- */
  OB.pages.payment = () => {
    const order = OB.state.order || OB.flightOrder();
    const total = OB.orderTotal(order);
    const m = OB.state.payMethod;
    const months = OB.state.pssMonths;
    const deposit = Math.round(total * 0.3);
    const inst = Math.ceil((total - deposit) / months / 100) * 100;
    const due = ['15 Nov 2026', '15 Dec 2026', '15 Jan 2027', '15 Feb 2027', '15 Mar 2027', '15 Apr 2027'];
    const panels = {
      pss: `
        <h3>Pay Small Small</h3>
        <p class="muted text-sm">Pay 30% today and spread the rest. No interest. Your booking is confirmed once the last instalment is paid.</p>
        <div class="plan-grid" role="radiogroup" aria-label="Instalment plan">
          ${[2, 3, 6].map((n) => `<label class="plan"><input type="radio" name="pss" value="${n}" data-action="pss-plan" ${months === n ? 'checked' : ''}><strong>${n} months</strong><span>${fmt(Math.ceil((total - deposit) / n / 100) * 100)}/month</span></label>`).join('')}
        </div>
        <div class="schedule">
          <div><span>Today (30% deposit)</span><strong class="num">${fmt(deposit)}</strong></div>
          ${due.slice(0, months).map((d) => `<div><span>${d}</span><strong class="num">${fmt(inst)}</strong></div>`).join('')}
        </div>
        <button class="btn btn-primary btn-lg" type="button" data-action="open-paystack" data-amount="${deposit}">Pay ${fmt(deposit)} deposit</button>`,
      card: `
        <h3>Pay with card</h3>
        <p class="muted text-sm">Visa, Mastercard and Verve. You'll confirm with your bank's one-time code.</p>
        <div class="notice notice-info">${icon('lock')}<span>Payments are processed securely by Paystack. Onburd never stores your card number.</span></div>
        <button class="btn btn-primary btn-lg" type="button" data-action="open-paystack" data-amount="${total}">Pay ${fmt(total)}</button>`,
      bank: `
        <h3>Bank transfer</h3>
        <p class="muted text-sm">Transfer the exact amount to a one-time account. We confirm automatically within 2 minutes.</p>
        <div class="bank-box">
          <dl>
            <dt>Bank</dt><dd>Wema Bank</dd>
            <dt>Account name</dt><dd>Onburd Checkout</dd>
            <dt>Account number</dt><dd>${OB.state.bankShown ? '8123 456 790 <button class="link-btn text-xs" type="button" data-action="copy" data-text="8123456790">' + icon('copy') + ' Copy</button>' : '<span class="masked">•••• ••• •••</span>'}</dd>
            <dt>Amount</dt><dd>${fmt(total)}</dd>
          </dl>
          ${OB.state.bankShown
            ? `<p class="text-xs muted">${icon('clock')} This account expires in 30 minutes.</p><button class="btn btn-primary" type="button" data-action="confirm-paid">I've sent the money</button>`
            : `<button class="btn btn-secondary" type="button" data-action="show-bank">Show account details</button>`}
        </div>`
    };
    return `
      ${OB.nav()}
      <main class="container" style="padding-block:0 72px">
        ${OB.stepper(order.steps, order.payStep)}
        <div class="with-aside" style="margin-top:28px">
          <div class="stack" style="gap:24px">
            ${OB.backTitle('Payment', order.back)}
            <div class="notice notice-pss">${icon('info')}<span>Once you choose how to pay, your price is locked and going back will start a new booking.</span></div>
            <div class="pay-methods">
              <div class="pay-tabs" role="tablist" aria-label="Payment method">
                <button class="pay-tab" role="tab" type="button" data-action="pay-method" data-m="pss" aria-selected="${m === 'pss'}">${icon('wallet')}<span>Pay Small Small<small>30% now, rest later</small></span></button>
                <button class="pay-tab" role="tab" type="button" data-action="pay-method" data-m="card" aria-selected="${m === 'card'}">${icon('card')}<span>Card<small>Visa, Mastercard, Verve</small></span></button>
                <button class="pay-tab" role="tab" type="button" data-action="pay-method" data-m="bank" aria-selected="${m === 'bank'}">${icon('bank')}<span>Bank transfer<small>Confirms in 2 minutes</small></span></button>
              </div>
              <div class="pay-panel" role="tabpanel">${panels[m]}</div>
            </div>
          </div>
          <div class="aside-sticky">${OB.orderSummary(order)}</div>
        </div>
      </main>
      ${OB.footer()}`;
  };

  OB.paystackModal = (amount) => `
    <div class="modal" data-action="close-overlay">
      <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Card payment" data-stop>
        <div class="modal-head"><h2>Card payment</h2><button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close">${icon('x')}</button></div>
        <div class="paystack">
          <div class="paystack-side"><b>PAY WITH</b><span class="on">${icon('card')} Card</span><span>${icon('bank')} Transfer</span><span>${icon('phone')} USSD</span></div>
          <form class="modal-body" data-form="card">
            <div class="row-between text-sm"><span class="muted">${esc(OB.state.loggedIn ? OB.state.user.email : 'guest@onburd.com')}</span><strong class="num" style="color:var(--blue-700)">Pay ${fmt(amount)}</strong></div>
            <div class="field-group"><label for="cc-num">Card number</label><input class="input num" id="cc-num" inputmode="numeric" value="5399 8312 4482 9104" autocomplete="off"></div>
            <div class="form-grid">
              <div class="field-group col-6"><label for="cc-exp">Expiry</label><input class="input num" id="cc-exp" value="08 / 28"></div>
              <div class="field-group col-6"><label for="cc-cvv">CVV</label><input class="input num" id="cc-cvv" value="123" inputmode="numeric"></div>
            </div>
            <button class="btn btn-primary btn-lg btn-block" type="submit">Pay ${fmt(amount)}</button>
          </form>
        </div>
        <div class="secured">${icon('lock')} Secured by ${OB.paystackLogo()}</div>
      </div>
    </div>`;

  const confirmInfo = (order) => {
    const S = OB.state;
    const lines = order.lines;
    const fmtDay = (d) => d;
    switch (order.kind) {
      case 'movie': {
        const m = OB.find(OB.movies, S.movieId || 'hail-mary'); const c = OB.find(OB.cinemas, S.show.cinema);
        const seats = [...S.seats];
        return { ic: 'film', heading: 'Your tickets', title: m.title, when: `${S.show.date} 2026, ${S.show.time}`, place: `${c.name}, ${c.area}, Lagos`,
          items: [[`Seats ${seats.join(', ') || '—'}`, null], ...lines], more: ['movies', 'Browse more movies'],
          body: (e) => `We have emailed your e-tickets to ${e}. Show them at the cinema entrance.` };
      }
      case 'event': {
        const e = OB.find(OB.events, S.eventId || 'afrobeats-live');
        return { ic: 'ticket', heading: 'Your tickets', title: e.title, when: `${e.date} 2026, ${e.time}`, place: `${e.venue}, ${e.city}`,
          items: lines, more: ['events', 'Browse more events'], body: (m) => `We have emailed your e-tickets to ${m}. Show them at the gate.` };
      }
      case 'experience': {
        const x = OB.find(OB.experiences, (S.order && S.order.back || '').split('~')[1] || 'egypt-nile');
        return { ic: 'compass', heading: 'Your booking', title: x.title, when: `Operated by ${x.by}`, place: x.place,
          items: lines, more: ['experiences', 'Browse more experiences'], body: (m) => `We have emailed your voucher to ${m}. ${x.by} will contact you with the next steps.` };
      }
      case 'extras':
        return { ic: 'luggage', heading: 'Your travel extras', title: 'Airport add-ons', when: S.ex.date, place: S.ex.airport,
          items: lines, more: ['extras', 'Browse more extras'], body: (m) => `We have emailed your service details to ${m}.` };
      default: {
        const fs = S.fs;
        return { ic: 'plane', heading: 'Your trip', title: OB.routeTitle ? OB.routeTitle() : order.item.title,
          when: `${OB.fsDate(fs.dep)}${fs.trip === 'round' && fs.ret ? ' – ' + OB.fsDate(fs.ret) : ''}`, place: `${order.item.sub.split(' · ')[0]} · ${fs.cabin}`,
          items: lines, more: ['flights', 'Search more flights'], body: (m) => `We have emailed your e-ticket and itinerary to ${m}.` };
      }
    }
  };

  OB.pages.confirmed = () => {
    const order = OB.state.order || OB.flightOrder();
    const S = OB.state;
    const ci = confirmInfo(order);
    const xc = S.xc || {}; const u = S.loggedIn ? S.user : {};
    const name = [xc.first || u.first, xc.last || u.last].filter(Boolean).join(' ') || 'Adaeze Mensah';
    const email = xc.email || u.email || 'adaeze.mensah@gmail.com';
    const phone = xc.phone ? `+234 ${xc.phone}` : (u.phone || '+234 803 456 7890');
    const total = OB.orderTotal(order);
    const digits = order.ref.replace(/\D/g, '');
    const bookingNo = `2610220${digits.padStart(6, '0')}`;
    const payRef = `20261022${digits.slice(-5).padStart(5, '1')}`;
    return `
      ${OB.nav()}
      <main class="container cf2">
        <section class="cf2-head">
          <span class="confirm-icon">${icon('check')}</span>
          <h1>Payment successful</h1>
          <p>Your payment went through. ${esc(ci.body(email))}</p>
        </section>
        <section class="cf2-card cf2-ref">
          <div><span class="eyebrow">Booking number</span><strong class="cf2-no">${bookingNo}</strong><span class="muted text-sm">Sent to ${esc(email)}</span></div>
          <button class="btn btn-secondary btn-sm" type="button" data-action="copy" data-text="${bookingNo}">${icon('copy')} Copy</button>
        </section>
        <section class="cf2-card" aria-labelledby="cf2-h">
          <h2 id="cf2-h">${ci.heading}</h2>
          <div class="cf2-item"><span class="cf2-ic">${icon(ci.ic)}</span><div><strong>${esc(ci.title)}</strong><span>${esc(ci.when)}</span></div></div>
          <p class="cf2-place">${icon('pin')} ${esc(ci.place)}</p>
          <div class="cf2-lines">
            ${ci.items.map(([l, v]) => `<div><span>${esc(l)}</span>${v == null ? '' : `<strong>${v < 0 ? '−' + fmt(-v) : fmt(v)}</strong>`}</div>`).join('')}
            <div><span>Booking status</span><strong class="cf-ok">Confirmed</strong></div>
            <div><span>Payment reference</span><strong>${payRef}</strong></div>
          </div>
          <div class="cf2-paid"><span>Paid</span><strong>${fmt(total)}</strong></div>
        </section>
        <section class="cf2-card" aria-labelledby="cf2-by">
          <h2 id="cf2-by">Booked by</h2>
          <div class="cf2-person"><div><strong>${esc(name)}</strong><span>${esc(email)}</span></div><span>${esc(phone)}</span></div>
        </section>
        <div class="row cf-actions"><a class="btn btn-primary" href="#${ci.more[0]}">${ci.more[1]}</a><a class="btn btn-secondary" href="#home">Back to home</a></div>
      </main>
      ${OB.footer()}`;
  };
})();
