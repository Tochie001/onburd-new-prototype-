window.OB = window.OB || {};
(() => {
  const { icon, img, fmt } = OB;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  OB.esc = esc;
  OB.pssMonthly = (n) => Math.ceil(n / 6 / 100) * 100;
  OB.pss = (amount, unit = '') => `<span class="pss" title="Pay Small Small: spread the cost over 6 months"><img src="assets/brand/pss-logo.svg" alt="Pay Small Small"><strong>${OB.fmt(amount)}</strong>${unit ? `<small>${unit}</small>` : ''}</span>`;

  const flag = () => '<span class="flag" aria-hidden="true"><i></i><i></i><i></i></span>';
  OB.flag = flag;

  const X_PATH = 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z';
  const TIKTOK_PATH = 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';
  const LINKEDIN_PATH = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';
  const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
  const TG_PATH = 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z';
  let gradSeq = 0;
  OB.brandGlyph = (name) => {
    const g = {
      Instagram: '<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/></g><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/>',
      X: `<path transform="translate(3.5 3.5) scale(.71)" d="${X_PATH}" fill="currentColor"/>`,
      TikTok: `<path transform="translate(3.5 3) scale(.75)" d="${TIKTOK_PATH}" fill="currentColor"/>`,
      LinkedIn: `<path transform="translate(3 3) scale(.75)" d="${LINKEDIN_PATH}" fill="currentColor"/>`
    }[name];
    return `<svg class="brand-glyph" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">${g}</svg>`;
  };

  OB.brandLogo = (name, size = 36) => {
    const id = 'ig' + (++gradSeq);
    const tile = (bg, inner) => `<svg class="brand-logo" width="${size}" height="${size}" viewBox="0 0 40 40" role="img" aria-label="${name}">${bg}${inner}</svg>`;
    switch (name) {
      case 'Instagram': return tile(
        `<defs><radialGradient id="${id}" cx="0.28" cy="1.05" r="1.2"><stop offset="0" stop-color="#FFDD55"/><stop offset=".12" stop-color="#FFC342"/><stop offset=".45" stop-color="#FF543E"/><stop offset=".7" stop-color="#C837AB"/><stop offset="1" stop-color="#4F5BD5"/></radialGradient></defs><rect width="40" height="40" rx="10" fill="url(#${id})"/>`,
        `<g fill="none" stroke="#fff" stroke-width="2.6"><rect x="10" y="10" width="20" height="20" rx="6"/><circle cx="20" cy="20" r="4.8"/></g><circle cx="25.6" cy="14.4" r="1.5" fill="#fff"/>`);
      case 'X': return tile('<rect width="40" height="40" rx="10" fill="#000"/>', `<path transform="translate(10.5 10.5) scale(.79)" d="${X_PATH}" fill="#fff"/>`);
      case 'TikTok': return tile('<rect width="40" height="40" rx="10" fill="#000"/>',
        `<g transform="translate(9.5 9) scale(.88)"><path d="${TIKTOK_PATH}" fill="#25F4EE" transform="translate(-.9 -.7)"/><path d="${TIKTOK_PATH}" fill="#FE2C55" transform="translate(.9 .7)"/><path d="${TIKTOK_PATH}" fill="#fff"/></g>`);
      case 'WhatsApp': return `<svg class="brand-logo" width="${size}" height="${size}" viewBox="0 0 40 40" role="img" aria-label="WhatsApp"><circle cx="20" cy="20" r="20" fill="#25D366"/><path transform="translate(9 9) scale(.917)" d="${WA_PATH}" fill="#fff"/></svg>`;
      case 'Telegram': return `<svg class="brand-logo" width="${size}" height="${size}" viewBox="0 0 40 40" role="img" aria-label="Telegram"><circle cx="20" cy="20" r="20" fill="#2AABEE"/><path transform="translate(7.5 8) scale(1.0)" d="${TG_PATH}" fill="#fff"/></svg>`;
      case 'LinkedIn': return tile('<rect width="40" height="40" rx="10" fill="#0A66C2"/>', `<path transform="translate(10 10) scale(.84)" d="${LINKEDIN_PATH}" fill="#fff"/>`);
      default: return '';
    }
  };

  OB.nav = ({ overlay = false, current = '', home = 'home' } = {}) => {
    const s = OB.state;
    const logo = overlay ? 'logo-white' : 'logo-blue';
    const account = s.loggedIn
      ? `<a class="nav-link" href="#profile" aria-label="My account"><span class="avatar">${s.user.first[0]}${s.user.last[0]}</span><span>${esc(s.user.first)}</span></a>`
      : `<a class="nav-link" href="#signin">Log in</a><a class="btn btn-primary btn-sm" href="#signin">Create account</a>`;
    return `
    <header class="nav ${overlay ? 'is-overlay' : ''} ${home === 'home2' ? 'nav-wide' : ''}">
      <div class="container nav-inner">
        <a class="nav-logo" href="#${home}" aria-label="Onburd home"><img src="assets/brand/${logo}.svg" alt="onburd"></a>
        <nav class="nav-links" aria-label="Main">
          <a class="nav-link ${current === 'bookings' ? 'is-current' : ''}" href="#bookings">My bookings</a>
          <span class="nav-sep" aria-hidden="true"></span>
          <button class="nav-link" type="button" data-action="currency">${flag()} NGN ${icon('chevronDown')}</button>
          ${account}
        </nav>
        <button class="icon-btn nav-menu-btn" type="button" data-action="menu" aria-label="Open menu">${icon('menu')}</button>
      </div>
    </header>`;
  };

  OB.menuSheet = () => {
    const s = OB.state;
    return `
    <div class="menu-sheet" data-action="close-overlay">
      <div class="menu-sheet-panel" role="dialog" aria-label="Menu" data-stop>
        <div class="row-between" style="margin-bottom:12px">
          <img src="assets/brand/logo-blue.svg" alt="onburd" style="height:26px">
          <button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close menu">${icon('x')}</button>
        </div>
        <a class="nav-link" href="#home">${icon('plane')} Flights</a>
        <a class="nav-link" href="#events">${icon('ticket')} Events</a>
        <a class="nav-link" href="#experiences">${icon('compass')} Experiences</a>
        <a class="nav-link" href="#movies">${icon('film')} Movies</a>
        <a class="nav-link" href="#extras">${icon('luggage')} Travel extras</a>
        <hr class="divider" style="margin:8px 0">
        <a class="nav-link" href="#bookings">${icon('ticket')} My bookings</a>
        ${s.loggedIn ? `<a class="nav-link" href="#profile">${icon('user')} My profile</a>` : ''}
        <button class="nav-link" type="button" data-action="currency">${flag()} NGN · Naira</button>
        <div style="margin-top:12px">${s.loggedIn ? '' : '<a class="btn btn-primary btn-block" href="#signin">Log in or create account</a>'}</div>
      </div>
    </div>`;
  };

  OB.footer = () => `
    <footer>
      <div class="footer">
        <div class="container footer-grid">
          <div>
            <img class="footer-logo" src="assets/brand/logo-blue.svg" alt="onburd">
            <p style="max-width:36ch">Flights, hotels, concerts, experiences and cinema tickets across Africa, booked in one place.</p>
            <div class="footer-social">
              ${['Instagram', 'X', 'TikTok'].map((n) => `<a href="#home" aria-label="Onburd on ${n}">${OB.brandGlyph(n)}</a>`).join('')}
            </div>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li>WhatsApp: <a href="#home">+234 908 556 7540</a></li>
              <li>Speak to an agent: <a href="#home">+234 1 700 8208</a></li>
              <li>Support: <a href="#home">support@onburd.com</a></li>
            </ul>
          </div>
          <div>
            <h4>Onburd</h4>
            <ul>
              <li><a href="#home">About us</a></li>
              <li><a href="#home">Create an event</a></li>
              <li><a href="#home">Become an affiliate</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-base">
        <div class="container">
          <span>© 2026 Onburd. All rights reserved.</span>
          <nav aria-label="Legal"><a href="#home">Terms of use</a><a href="#home">Privacy policy</a></nav>
        </div>
      </div>
    </footer>`;

  OB.sectionHead = (title, { sub = '', href = '', rail = '' } = {}) => `
    <div class="section-head">
      <div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
      <div class="section-actions">
        ${href ? `<a class="link-btn" href="#${href}">View all ${icon('arrowRight')}</a>` : ''}
        ${rail ? `<span class="row rail-arrows" style="gap:8px">
          <button class="icon-btn" type="button" data-action="rail" data-dir="-1" data-target="${rail}" aria-label="Scroll back">${icon('chevronLeft')}</button>
          <button class="icon-btn" type="button" data-action="rail" data-dir="1" data-target="${rail}" aria-label="Scroll forward">${icon('chevronRight')}</button></span>` : ''}
      </div>
    </div>`;

  OB.rail = (id, items) => `<div class="rail" id="${id}">${items.join('')}</div>`;

  const share = (kind, id, title) =>
    `<button class="mcard-share" type="button" data-action="share" data-kind="${kind}" data-id="${id}" aria-label="Share ${esc(title)}">${icon('share')}</button>`;

  OB.eventCard = (e) => `
    <article class="mcard">
      <a class="mcard-media" href="#event~${e.id}" tabindex="-1" aria-hidden="true"><img src="${img(e.img)}" alt="">${e.tag ? `<span class="badge badge-solid">${esc(e.tag)}</span>` : ''}</a>
      ${share('event', e.id, e.title)}
      <div class="mcard-body">
        <a class="mcard-title" href="#event~${e.id}" style="color:inherit">${esc(e.title)}</a>
        <div class="mcard-meta">${icon('calendar')}<span>${e.date} · ${e.time}</span></div>
        <div class="mcard-meta">${icon('pin')}<span>${esc(e.venue)}</span></div>
        <div class="mcard-foot"><span class="price"><span class="price-from">From</span>${fmt(e.price)}</span></div>
      </div>
    </article>`;

  OB.dealCard = (d) => `
    <article class="mcard">
      <a class="mcard-media" href="#flights" tabindex="-1" aria-hidden="true"><img src="${img(d.img)}" alt=""></a>
      ${share('deal', d.id, `${d.from} to ${d.to}`)}
      <div class="mcard-body">
        <a class="mcard-title" href="#flights" style="color:inherit">${esc(d.from)} → ${esc(d.to)}</a>
        <div class="mcard-meta">${icon('clock')}<span>${d.duration} · ${d.stops} · ${d.cabin}</span></div>
        <div class="deal-price"><span class="price-from">Return from</span><span class="price price-lg">${fmt(d.price)}</span>${OB.pss(OB.pssMonthly(d.price))}</div>
      </div>
    </article>`;

  OB.expCard = (x) => `
    <article class="mcard">
      <a class="mcard-media" href="#experience~${x.id}" tabindex="-1" aria-hidden="true"><img src="${img(x.img)}" alt="">${x.tag ? `<span class="badge badge-solid">${esc(x.tag)}</span>` : ''}</a>
      ${share('experience', x.id, x.title)}
      <div class="mcard-body">
        <a class="mcard-title" href="#experience~${x.id}" style="color:inherit">${esc(x.title)}</a>
        <div class="mcard-meta">${icon('pin')}<span>${esc(x.place)}</span></div>
        <div class="mcard-meta">${icon('user')}<span>by ${esc(x.by)}</span></div>
        <div class="mcard-foot"><span class="price">${fmt(x.price)} <small>/ ${x.unit}</small></span></div>
      </div>
    </article>`;

  OB.hotelCard = (h) => `
    <article class="mcard">
      <a class="mcard-media" href="#hotels" tabindex="-1" aria-hidden="true"><img src="${img(h.img)}" alt=""></a>
      ${share('hotel', h.id, h.title)}
      <div class="mcard-body">
        <span class="mcard-title">${esc(h.title)}</span>
        <div class="mcard-meta">${icon('pin')}<span>${esc(h.place)}</span></div>
        <div class="mcard-foot">
          <span class="price">${fmt(h.price)} <small>/ night</small></span>
          <span class="badge ${h.note === 'Pay at hotel' ? 'badge-warning' : 'badge-success'}">${esc(h.note)}</span>
        </div>
      </div>
    </article>`;

  OB.diningCard = (d) => `
    <article class="mcard">
      <div class="mcard-media"><img src="${img(d.img)}" alt=""></div>
      ${share('dining', d.id, d.title)}
      <div class="mcard-body">
        <span class="eyebrow">${esc(d.kind)}</span>
        <span class="mcard-title">${esc(d.title)}</span>
        <div class="mcard-meta">${icon('pin')}<span>${esc(d.place)}</span></div>
        <div class="mcard-foot"><span class="price"><span class="price-from">Average per person</span>${fmt(d.price)}</span><button class="btn btn-soft btn-sm" type="button" data-action="toast" data-msg="Table reservations open in the next release.">Reserve</button></div>
      </div>
    </article>`;

  OB.poster = (m) => {
    const inner = m.img
      ? `<img src="${img(m.img)}" alt="">`
      : `<div class="poster-art" style="background:radial-gradient(120% 80% at 80% 10%, ${m.art[1]} 0%, transparent 55%), linear-gradient(160deg, ${m.art[0]} 30%, #05070B 100%)"></div>
         <span class="poster-title" style="${m.dark ? '' : ''}">${esc(m.title)}</span><span class="poster-tag">${esc(m.tagline)}</span>`;
    return `<div class="poster">${inner}${m.tag ? `<span class="badge badge-solid">${m.tag}</span>` : ''}</div>`;
  };

  OB.movieCard = (m) => `
    <article class="mcard" style="padding:10px 10px 14px">
      <a href="#movie~${m.id}" tabindex="-1" aria-hidden="true">${OB.poster(m)}</a>
      ${share('movie', m.id, m.title)}
      <div class="mcard-body">
        <a class="mcard-title" href="#movie~${m.id}" style="color:inherit">${esc(m.title)}</a>
        <div class="mcard-meta"><span>${esc(m.genre)} · ${m.runtime}</span></div>
        <div class="mcard-meta"><span class="badge badge-neutral">${m.rating}</span></div>
      </div>
    </article>`;

  OB.tile = (label, image, href) => `
    <a class="tile" href="#${href}"><img src="${img(image)}" alt=""><span class="tile-label">${esc(label)} ${icon('arrowRight')}</span></a>`;

  OB.shareTarget = (kind, id) => {
    const F = OB.find;
    switch (kind) {
      case 'event': { const e = F(OB.events, id); return { title: e.title, meta: `${e.date} · ${e.time} · ${e.venue}`, price: `From ${fmt(e.price)}`, img: e.img, path: `e/${e.id}` }; }
      case 'deal': { const d = F(OB.flightDeals, id); return { title: `${d.from} → ${d.to}`, meta: `${d.duration} · ${d.stops} · ${d.cabin}`, price: `Return from ${fmt(d.price)}`, img: d.img, path: `f/${d.id}` }; }
      case 'experience': { const x = F(OB.experiences, id); return { title: x.title, meta: `${x.place} · by ${x.by}`, price: `${fmt(x.price)} / ${x.unit}`, img: x.img, path: `x/${x.id}` }; }
      case 'hotel': { const h = F(OB.hotels, id); return { title: h.title, meta: h.place, price: `${fmt(h.price)} / night`, img: h.img, path: `h/${h.id}` }; }
      case 'dining': { const d = F(OB.dining, id); return { title: d.title, meta: `${d.kind} · ${d.place}`, price: `About ${fmt(d.price)} per person`, img: d.img, path: `d/${d.id}` }; }
      case 'movie': { const m = F(OB.movies, id); return { title: m.title, meta: `${m.genre} · ${m.runtime} · ${m.rating}`, price: 'Now showing in Lagos', img: m.img, movie: m, path: `m/${m.id}` }; }
      case 'search': {
        const fs = OB.state.fs; const low = Math.min(...OB.flights.map((f) => f.price));
        return { title: 'Lagos → Dubai', meta: `${OB.fsShort(fs.dep)}${fs.trip === 'round' && fs.ret ? ' – ' + OB.fsShort(fs.ret) : ' · One way'} · ${OB.paxLabel()} · ${fs.cabin}`, price: `From ${fmt(low)}`, icon: 'plane', path: `flights/LOS-DXB/${fs.dep}` };
      }
      default: return { title: 'Onburd', meta: 'Flights, concerts, experiences and cinema tickets across Africa.', price: '', icon: 'sparkles', path: '' };
    }
  };

  OB.shareModal = (kind, id) => {
    const t = OB.shareTarget(kind, id);
    const url = `https://onburd.com/${t.path}`;
    const text = encodeURIComponent(`${t.title} on Onburd`);
    const u = encodeURIComponent(url);
    const thumb = t.img ? `<img src="${img(t.img)}" alt="">` : t.movie ? `<span class="share-thumb-art" style="background:linear-gradient(160deg, ${t.movie.art[0]}, ${t.movie.art[1]})"></span>` : `<span class="share-thumb-icon">${icon(t.icon)}</span>`;
    const target = (name, href) => `<a class="share-target" href="${href}" target="_blank" rel="noopener">${OB.brandLogo(name, 56)}<span>${name}</span></a>`;
    return `
    <div class="modal" data-action="close-overlay">
      <div class="modal-panel share-panel" role="dialog" aria-modal="true" aria-labelledby="share-title" data-stop>
        <div class="share-top">
          <div><h2 id="share-title">Share with friends</h2><p>Send it to your group and plan it together.</p></div>
          <button class="icon-btn" type="button" data-action="close-overlay" aria-label="Close">${icon('x')}</button>
        </div>
        <div class="share-item">
          <span class="share-thumb">${thumb}</span>
          <div><strong>${esc(t.title)}</strong><span>${esc(t.meta)}</span>${t.price ? `<b>${esc(t.price)}</b>` : ''}</div>
        </div>
        <div class="share-targets">
          ${target('WhatsApp', `https://wa.me/?text=${text}%20${u}`)}
          ${target('Telegram', `https://t.me/share/url?url=${u}&text=${text}`)}
          ${target('X', `https://twitter.com/intent/tweet?url=${u}&text=${text}`)}
          <button class="share-target" type="button" data-action="share-instagram" data-text="${url}">${OB.brandLogo('Instagram', 56)}<span>Instagram</span></button>
        </div>
        <div class="share-link">
          <label class="sr-only" for="share-url">Link</label>
          <input class="input" id="share-url" value="${url}" readonly>
          <button class="btn btn-primary" type="button" data-action="copy" data-text="${url}">${icon('copy')} Copy link</button>
        </div>
      </div>
    </div>`;
  };

  OB.socialStrip = () => `
    <div class="social-strip">
      <div><h3>Stay tuned, fun things are happening</h3><p>Follow Onburd for drops, presales and giveaways.</p></div>
      <div class="social-list">
        ${[['Instagram', '78.1K'], ['X', '162.5K'], ['TikTok', '24.9K']].map(([n, f]) => `
          <div class="social-item">${OB.brandLogo(n, 36)}<div><strong>@onburd</strong><small>${f} followers</small></div>
          <button class="btn btn-on-dark btn-sm" type="button" data-action="toast" data-msg="Opens Onburd on ${n}.">Follow</button></div>`).join('')}
      </div>
    </div>`;

  OB.newsletter = () => `
    <section class="newsletter" aria-labelledby="nl-title">
      <div>
        <h2 id="nl-title">Get the best deals and plans first</h2>
        <p>Flash sales, presale codes and weekend ideas, delivered every Thursday. No spam, unsubscribe any time.</p>
        <form data-form="newsletter">
          <label class="sr-only" for="nl-email">Email address</label>
          <input class="input" id="nl-email" type="email" placeholder="Enter your email" required>
          <button class="btn btn-primary btn-lg" type="submit">Subscribe</button>
        </form>
      </div>
      <div class="newsletter-art">
        <img src="assets/img/newsletter-art.png" alt="Smiling traveller with a backpack. 120+ experiences to explore">
      </div>
    </section>`;

  OB.pageBand = (title, sub, crumbs = []) => `
    <div class="page-band"><div class="container">
      ${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([l, h], i) => i < crumbs.length - 1 ? `<a href="#${h}">${esc(l)}</a>${icon('chevronRight')}` : `<span>${esc(l)}</span>`).join('')}</nav>` : ''}
      <h1>${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}
    </div></div>`;

  OB.crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([l, h], i) => i < items.length - 1 ? `<a href="#${h}">${esc(l)}</a>${icon('chevronRight')}` : `<span>${esc(l)}</span>`).join('')}</nav>`;

  OB.stepper = (steps, current) => `
    <ol class="stepper" aria-label="Booking progress" style="list-style:none;margin:0">
      ${steps.map((label, i) => `
        ${i ? `<li class="step-line ${i <= current ? 'is-done' : ''}" aria-hidden="true"></li>` : ''}
        <li class="step ${i < current ? 'is-done' : i === current ? 'is-current' : ''}" ${i === current ? 'aria-current="step"' : ''}>
          <span class="step-dot">${i < current ? icon('check') : i + 1}</span><span class="step-label">${label}</span></li>`).join('')}
    </ol>`;

  OB.airlineLogo = (code, sm = false) => {
    const al = OB.airlines[code];
    const hasLogo = OB.airlineLogoFiles.has(code);
    return `<span class="airline-logo ${sm ? 'airline-logo-sm' : ''} ${hasLogo ? '' : 'is-fallback'}" title="${al.name}" style="--al:${al.color}">${hasLogo
      ? `<img src="assets/airlines/${code}.png" alt="${al.name}">` : `<b>${code}</b>`}</span>`;
  };

  OB.qr = (seed = 'OB') => {
    let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const n = 21; let cells = '';
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#101828"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#101828"/>`;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >>> 16) & 1) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#101828"/>`;
    }
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="Booking QR code"><rect width="${n}" height="${n}" fill="#fff"/>${cells}${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;
  };

  OB.mapArt = (label) => `
    <div class="map" role="img" aria-label="Map of ${esc(label)}">
      <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice">
        <rect width="600" height="260" fill="#E8EEF6"/>
        <path d="M0 190 C120 170 160 210 260 180 S420 120 600 150 L600 260 L0 260Z" fill="#CFE3F7"/>
        <path d="M330 0 C320 60 360 90 340 140 S300 220 320 260" stroke="#9CC3EC" stroke-width="14" fill="none"/>
        <g stroke="#fff" stroke-width="6" fill="none"><path d="M0 80 H600"/><path d="M120 0 V260"/><path d="M0 140 C200 120 420 100 600 60"/><path d="M460 0 L520 260"/></g>
        <g stroke="#fff" stroke-width="2.5" fill="none" opacity=".9"><path d="M0 40 H600"/><path d="M60 0 V260"/><path d="M220 0 V260"/><path d="M400 0 V260"/><path d="M0 220 H600"/></g>
        <rect x="150" y="96" width="60" height="34" rx="6" fill="#D8F0DC"/><rect x="420" y="170" width="80" height="40" rx="6" fill="#D8F0DC"/>
        <g transform="translate(300 120)"><circle r="26" fill="#2C90FF" opacity=".18"/><path d="M0 -26 C-14 -26 -22 -16 -22 -6 C-22 10 0 26 0 26 S22 10 22 -6 C22 -16 14 -26 0 -26Z" fill="#2C90FF"/><circle cy="-6" r="7" fill="#fff"/></g>
      </svg>
    </div>`;

  OB.backTitle = (title, back) => `
    <div class="page-title"><a class="back-btn" href="#${back}" aria-label="Go back">${icon('arrowLeft')}</a><h1>${esc(title)}</h1></div>`;

  OB.orderSummary = (order, { cta = '', note = '' } = {}) => {
    if (!order) return '';
    const rows = order.lines.map(([l, v, cls]) => `<div class="summary-row"><span>${esc(l)}</span><strong class="${cls || ''}">${v < 0 ? '−' + fmt(-v) : fmt(v)}</strong></div>`).join('');
    const total = order.lines.reduce((a, [, v]) => a + v, 0);
    return `
      <aside class="summary" aria-label="Order summary">
        <h3>${esc(order.summaryTitle || 'Summary')}</h3>
        ${order.item ? `<div class="summary-item"><img src="${img(order.item.img)}" alt=""><div><strong>${esc(order.item.title)}</strong><span>${esc(order.item.sub)}</span></div></div><hr class="divider">` : ''}
        ${rows}
        <div class="summary-total"><span>Total</span><strong>${fmt(total)}</strong></div>
        ${note}
        ${cta}
      </aside>`;
  };
  OB.mobileCta = ({ label = '', amount = '', button }) => `
    <div class="m-cta" role="region" aria-label="Booking">
      <div class="m-cta-text">${label ? `<small>${label}</small>` : ''}${amount ? `<strong>${amount}</strong>` : ''}</div>
      ${button}
    </div>`;
  OB.paystackLogo = () => `<span class="paystack-logo" aria-label="Paystack"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="2" width="18" height="3" rx="1.5" fill="#00C3F7"/><rect x="1" y="7" width="18" height="3" rx="1.5" fill="#011B33"/><rect x="1" y="12" width="18" height="3" rx="1.5" fill="#00C3F7"/><rect x="1" y="17" width="11" height="3" rx="1.5" fill="#011B33"/></svg><b>paystack</b></span>`;
  OB.orderTotal = (order) => order.lines.reduce((a, [, v]) => a + v, 0);
})();
