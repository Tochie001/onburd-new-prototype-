window.OB = window.OB || {};
(() => {
  const { icon, img, esc, fmt } = OB;

  const authShell = (panel) => `
    <main class="auth">
      <section class="auth-art" aria-hidden="true">
        <div class="auth-cards">
          <div class="auth-card c1">Memorable experiences<img src="${img('event-crowd')}" alt=""></div>
          <div class="auth-card c2">Cheapest flights ever<img src="${img('dest-maldives')}" alt=""></div>
          <div class="auth-card c3">Pay Small Small<img src="${img('newsletter-traveller')}" alt=""></div>
        </div>
        <img src="assets/brand/logo-white.svg" alt="" style="height:30px;width:auto;margin-bottom:auto;position:absolute;top:40px;left:48px">
        <h2>Book your next trip &amp; weekend plans, all in one place</h2>
        <p>Flights, hotels, concerts, experiences and cinema tickets across Africa.</p>
      </section>
      <div class="auth-main">${panel}</div>
    </main>`;

  const panelLogo = `<a href="#home" aria-label="Onburd home"><img src="assets/brand/logo-blue.svg" alt="onburd" style="height:30px;width:auto"></a>`;

  OB.pages.signin = () => authShell(`
    <form class="auth-panel" data-form="signin">
      ${panelLogo}
      <div><h1>Log in or create an account</h1><p class="sub">Use your email and we'll send you a 6-digit code. No password needed.</p></div>
      <div class="grid-3" style="grid-template-columns:1fr 1fr;gap:10px">
        <button class="btn btn-secondary" type="button" data-action="social-login">${icon('google')} Google</button>
        <button class="btn btn-secondary" type="button" data-action="social-login">${icon('apple')} Apple</button>
      </div>
      <div class="or">or</div>
      <div class="field-group"><label for="si-email">Email address</label><input class="input" id="si-email" type="email" placeholder="you@example.com" value="${esc(OB.state.pendingEmail || '')}" required autocomplete="email">
        <span class="error" id="si-error" hidden>Enter a valid email address, like name@example.com.</span></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Continue</button>
      <p class="text-xs muted" style="text-align:center">By continuing you agree to our <a href="#home">Terms</a> and <a href="#home">Privacy policy</a>.</p>
    </form>`);

  OB.pages.otp = () => authShell(`
    <form class="auth-panel" data-form="otp">
      ${panelLogo}
      <div><h1>Check your email</h1><p class="sub">Enter the 6-digit code we sent to <strong style="color:var(--ink)">${esc(OB.state.pendingEmail || 'adaeze.mensah@gmail.com')}</strong>.</p></div>
      <fieldset class="otp" style="border:0;padding:0;margin:0"><legend class="sr-only">Verification code</legend>
        ${Array.from({ length: 6 }, (_, i) => `<input id="otp-${i}" inputmode="numeric" maxlength="1" aria-label="Digit ${i + 1}" data-otp="${i}">`).join('')}</fieldset>
      <div class="row-between text-sm"><span class="muted">Didn't get it? Check spam.</span><button class="link-btn" type="button" data-action="toast" data-msg="New code sent. It expires in 10 minutes.">Resend code</button></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Verify</button>
      <a class="text-sm" href="#signin" style="text-align:center">Use a different email</a>
      <p class="text-xs muted" style="text-align:center">Prototype: any 6 digits work.</p>
    </form>`);

  OB.pages.signup = () => authShell(`
    <form class="auth-panel" data-form="signup">
      ${panelLogo}
      <div><h1>Finish creating your account</h1><p class="sub">Just a few details so we can fill in your bookings faster.</p></div>
      <div class="form-grid">
        <div class="field-group col-6"><label for="su-first">First name</label><input class="input" id="su-first" value="Adaeze" required></div>
        <div class="field-group col-6"><label for="su-last">Surname</label><input class="input" id="su-last" value="Mensah" required></div>
        <div class="field-group col-12"><label for="su-phone">Phone number</label><div class="phone-input"><select class="select" id="su-cc" aria-label="Country code"><option>🇳🇬 +234</option><option>🇬🇭 +233</option></select><input class="input" id="su-phone" type="tel" value="803 456 7890"></div></div>
        <div class="field-group col-12"><label for="su-pw">Password <span class="muted">(optional, for faster log in)</span></label>
          <div class="input-wrap"><input class="input" id="su-pw" type="password" placeholder="At least 8 characters" data-action="pw"><button class="input-action" type="button" data-action="reveal" data-for="su-pw" aria-label="Show password">${icon('eye')}</button></div>
          <div class="pw-meter" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div>
      </div>
      <label class="check"><input type="checkbox" id="su-news" checked> Send me deals and presale codes (you can turn this off any time)</label>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Create account</button>
    </form>`);

  const sideNav = (current) => `
    <nav class="side-nav" aria-label="Account">
      <div class="side-user"><span class="avatar avatar-lg">${OB.state.user.first[0]}${OB.state.user.last[0]}</span><div><strong>${esc(OB.state.user.first)} ${esc(OB.state.user.last)}</strong><span>${esc(OB.state.user.email)}</span></div></div>
      <a class="side-link ${current === 'bookings' ? 'is-current' : ''}" href="#bookings">${icon('ticket')} My bookings</a>
      <a class="side-link ${current === 'profile' ? 'is-current' : ''}" href="#profile">${icon('user')} Personal details</a>
      <a class="side-link" href="#profile-travellers">${icon('users')} Travellers</a>
      <a class="side-link" href="#home" data-action="toast" data-msg="Saved items appear here.">${icon('heart')} Saved (${OB.state.favs.size})</a>
      <button class="side-link danger" type="button" data-action="signout">${icon('logout')} Sign out</button>
    </nav>`;

  const needLogin = (title) => `
    ${OB.nav()}
    <main class="container page-body"><div class="panel empty" style="max-width:520px;margin-inline:auto">
      ${icon('lock')}<strong style="color:var(--ink);font-size:var(--fs-h3)">Log in to see ${title}</strong>
      <span>Your bookings and saved travellers live in your Onburd account.</span>
      <div class="row"><a class="btn btn-primary" href="#signin">Log in</a><button class="btn btn-secondary" type="button" data-action="demo-login">Use demo account</button></div>
    </div></main>${OB.footer()}`;

  const kindIcon = { flight: 'plane', event: 'ticket', experience: 'compass', movie: 'film', extras: 'luggage' };
  const statusBadge = (s) => `<span class="badge ${s === 'Upcoming' ? '' : s === 'Current' ? 'badge-success' : 'badge-neutral'}">${s}</span>`;

  OB.pages.bookings = () => {
    if (!OB.state.loggedIn) return needLogin('your bookings');
    const tab = OB.state.bkTab;
    const q = OB.state.bkQuery.trim().toLowerCase();
    const list = OB.bookings.filter((b) => (tab === 'All' || b.status === tab || (tab === 'Past' && b.status === 'Completed')) && (!q || b.ref.toLowerCase().includes(q) || b.title.toLowerCase().includes(q)));
    const count = (t) => OB.bookings.filter((b) => t === 'Past' ? b.status === 'Completed' : b.status === t).length;
    return `
      ${OB.nav({ current: 'bookings' })}
      ${OB.pageBand(`Welcome back, ${OB.state.user.first}`, 'Manage your flights, tickets and experiences in one place.', [['Home', 'home'], ['My bookings', '']])}
      <main class="container page-body" style="gap:0">
        <div class="account-layout">
          ${sideNav('bookings')}
          <div class="stack" style="gap:20px;min-width:0">
            <div class="row-between">
              <div class="bk-tabs" role="group" aria-label="Filter bookings">
                ${['All', 'Upcoming', 'Current', 'Past'].map((t) => `<button class="chip" type="button" data-action="bk-tab" data-v="${t}" aria-pressed="${tab === t}">${t}${t !== 'All' ? ` (${count(t)})` : ''}</button>`).join('')}
              </div>
              <div class="input-wrap" style="flex:1 1 260px;max-width:340px"><label class="sr-only" for="bk-q">Search bookings</label>
                <input class="input" id="bk-q" placeholder="Search by reference, e.g. OB-48213" value="${esc(OB.state.bkQuery)}" data-action="bk-search"><span class="input-action" aria-hidden="true">${icon('search')}</span></div>
            </div>
            ${list.length ? list.map((b) => `
              <article class="bk-card">
                <img src="${img(b.img)}" alt="">
                <div class="bk-card-body">
                  <div class="bk-card-head">
                    <div class="stack" style="gap:4px"><span class="eyebrow">${icon(kindIcon[b.kind])} ${b.kind}</span><h3>${esc(b.title)}</h3><span class="text-sm muted">${b.date}</span></div>
                    ${statusBadge(b.status)}
                  </div>
                  <dl class="bk-facts" style="margin:0">${b.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
                  <div class="bk-card-foot"><span>Ref <strong style="color:var(--ink)">${b.ref}</strong> · Booked ${b.booked} · ${fmt(b.total)}</span>
                    <a class="btn btn-secondary btn-sm" href="#booking~${b.ref}">View details ${icon('arrowRight')}</a></div>
                </div>
              </article>`).join('') : `<div class="panel empty">${icon('search')}<strong style="color:var(--ink)">No bookings found</strong><span>Check the reference or try another tab.</span></div>`}
          </div>
        </div>
      </main>
      ${OB.footer()}`;
  };

  OB.pages.booking = (ref) => {
    if (!OB.state.loggedIn) return needLogin('this booking');
    const b = OB.bookings.find((x) => x.ref === ref) || OB.bookings[0];
    const isFlight = b.kind === 'flight';
    const invoice = isFlight
      ? [['Base fare (1 adult)', 830700], ['Taxes & surcharges', 467300], ['Lounge access, Lagos T2', 45000], ['Travel insurance (Cover+)', 12000], ['Travel reminders', 3000], ['Service charge', 4500], ['Promo DETTYDEC', -64900]]
      : [['Tickets', Math.round(b.total * 0.97)], ['Service fee', b.total - Math.round(b.total * 0.97)]];
    const total = invoice.reduce((a, [, v]) => a + v, 0);
    return `
      ${OB.nav({ current: 'bookings' })}
      ${OB.pageBand(`Booking ${b.ref}`, `${b.title} · ${b.date}`, [['Home', 'home'], ['My bookings', 'bookings'], [b.ref, '']])}
      <main class="container page-body" style="gap:24px">
        <div class="with-aside">
          <div class="stack" style="gap:20px;min-width:0">
            <div class="ref-box">
              <div class="stack" style="gap:6px">
                <div class="row">${statusBadge(b.status)}<span class="text-xs muted">Booked on ${b.booked}</span></div>
                <span class="eyebrow">Booking reference</span><span class="ref-code">${b.ref}</span>
                <span class="text-sm muted">${isFlight ? 'Scan at the check-in counter or boarding gate.' : 'Show this code at the entrance.'}</span>
              </div>
              <div class="qr">${OB.qr(b.ref)}</div>
            </div>
            ${isFlight ? `
            <section class="panel stack" style="gap:20px">
              <div class="route-big">
                <div><span class="code">LOS</span><div class="text-xs muted">Lagos</div></div>
                <div class="leg-track"><span>12h 55m</span><span class="leg-line">${icon('plane')}</span><span class="leg-stops">1 stop · DOH</span></div>
                <div style="text-align:right"><span class="code">DXB</span><div class="text-xs muted">Dubai</div></div>
              </div>
              <div class="row">${OB.airlineLogo('QR', true)}<span class="text-sm"><strong>Qatar Airways QR 1406</strong> · Boeing 787-9 · Economy Comfort</span></div>
              <dl class="kv" style="margin:0">
                <div><dt>Departure</dt><dd>22:10 · Fri, 18 Dec 2026<br><span class="muted">Murtala Muhammed Intl, Terminal 2</span></dd></div>
                <div><dt>Arrival</dt><dd>13:05 · Sat, 19 Dec 2026<br><span class="muted">Dubai International, Terminal 1 · via Doha</span></dd></div>
              </dl>
              <hr class="divider">
              <div class="row-between"><div class="row"><span class="badge">Return</span><span class="text-sm">Sun, 3 Jan 2027 · QR 1407 · 15:20 → 06:35 +1</span></div><a class="link-btn" href="#booking~${b.ref}">Manage</a></div>
            </section>
            <section class="panel"><div class="panel-head"><h2>Passenger &amp; seating</h2></div>
              <dl class="kv" style="margin:0">
                <div><dt>Passenger</dt><dd>${esc(OB.state.user.first)} ${esc(OB.state.user.last)}</dd></div>
                <div><dt>Passport</dt><dd>A09345821</dd></div>
                <div><dt>Seat</dt><dd>34A (window)</dd></div>
                <div><dt>Baggage</dt><dd>2 × 23kg checked · 7kg cabin</dd></div>
              </dl></section>` : `
            <section class="panel"><div class="panel-head"><h2>Details</h2></div>
              <dl class="kv" style="margin:0">${b.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Date</dt><dd>${b.date}</dd></div><div><dt>Lead guest</dt><dd>${esc(OB.state.user.first)} ${esc(OB.state.user.last)}</dd></div></dl></section>`}
            <section class="panel"><div class="panel-head"><h2>Payment</h2><span class="badge badge-success">Paid</span></div>
              <dl class="kv" style="margin:0 0 20px">
                <div><dt>Method</dt><dd>Mastercard ending 9104</dd></div><div><dt>Transaction ID</dt><dd>TXN-20261014-7842</dd></div>
              </dl>
              <table class="ledger"><tbody>
                ${invoice.map(([l, v]) => `<tr><td>${esc(l)}</td><td style="${v < 0 ? 'color:var(--success-ink)' : ''}">${v < 0 ? '−' + fmt(-v) : fmt(v)}</td></tr>`).join('')}
                <tr class="total"><td>Total paid</td><td>${fmt(total)}</td></tr>
              </tbody></table></section>
          </div>
          <div class="aside-sticky">
            <div class="summary">
              <h3>Need help with this booking?</h3>
              <button class="btn btn-secondary btn-block" type="button" data-action="toast" data-msg="Receipt sent to ${esc(OB.state.user.email)}.">${icon('mail')} Email my receipt</button>
              ${isFlight ? `<button class="btn btn-secondary btn-block" type="button" data-action="toast" data-msg="Seat selection opens 48 hours before departure.">${icon('seat')} Change seat</button>
              <a class="btn btn-secondary btn-block" href="#extras">${icon('plus')} Add travel extras</a>` : ''}
              <button class="btn btn-ghost btn-block" type="button" data-action="toast" data-msg="An agent will call you within 15 minutes.">${icon('phone')} Talk to an agent</button>
            </div>
          </div>
        </div>
      </main>
      ${OB.footer()}`;
  };

  OB.pages.profile = (section) => {
    if (!OB.state.loggedIn) return needLogin('your profile');
    const u = OB.state.user;
    const ed = OB.state.editing;
    const field = (id, label, val, col = 6, type = 'text') => `<div class="field-group col-${col}"><label for="${id}">${label}</label><input class="input" id="${id}" type="${type}" value="${esc(val)}" ${ed === 'personal' || ed === 'passport' ? '' : 'readonly'}></div>`;
    const ro = (key) => ed === key ? '' : 'readonly';
    return `
      ${OB.nav()}
      ${OB.pageBand('My profile', 'Keep your details ready for faster checkout. We fill them in only when you ask.', [['Home', 'home'], ['My profile', '']])}
      <main class="container page-body" style="gap:0">
        <div class="account-layout">
          ${sideNav('profile')}
          <div class="stack" style="gap:20px;min-width:0">
            <form class="panel" data-form="profile-personal">
              <div class="panel-head"><div><h2>Personal details</h2><p>Used for tickets, confirmations and travel documents.</p></div>
                ${ed === 'personal' ? `<div class="row"><button class="btn btn-ghost btn-sm" type="button" data-action="edit" data-v="">Cancel</button><button class="btn btn-primary btn-sm" type="submit">Save</button></div>` : `<button class="btn btn-secondary btn-sm" type="button" data-action="edit" data-v="personal">${icon('edit')} Edit</button>`}</div>
              <div class="form-grid">
                <div class="field-group col-6"><label for="pf-name">Full name</label><input class="input" id="pf-name" value="${esc(u.first + ' ' + u.last)}" ${ro('personal')}></div>
                <div class="field-group col-6"><label for="pf-email">Email address</label><input class="input" id="pf-email" type="email" value="${esc(u.email)}" ${ro('personal')}></div>
                <div class="field-group col-6"><label for="pf-phone">Phone number</label><input class="input" id="pf-phone" value="${esc(u.phone)}" ${ro('personal')}></div>
                <div class="field-group col-6"><label for="pf-dob">Date of birth</label><input class="input" id="pf-dob" type="date" value="${u.dob}" ${ro('personal')}></div>
                <div class="field-group col-6"><label for="pf-nat">Nationality</label><input class="input" id="pf-nat" value="${esc(u.nationality)}" ${ro('personal')}></div>
                <div class="field-group col-6"><label for="pf-res">Country of residence</label><input class="input" id="pf-res" value="${esc(u.residence)}" ${ro('personal')}></div>
              </div>
            </form>
            <form class="panel" data-form="profile-passport">
              <div class="panel-head"><div><h2>Passport</h2><p>Make sure these match your passport exactly.</p></div>
                ${ed === 'passport' ? `<div class="row"><button class="btn btn-ghost btn-sm" type="button" data-action="edit" data-v="">Cancel</button><button class="btn btn-primary btn-sm" type="submit">Save</button></div>` : `<button class="btn btn-secondary btn-sm" type="button" data-action="edit" data-v="passport">${icon('edit')} Edit</button>`}</div>
              <div class="form-grid">
                <div class="field-group col-6"><label for="pp-num">Passport number</label><input class="input" id="pp-num" value="${u.passport.number}" ${ro('passport')}></div>
                <div class="field-group col-6"><label for="pp-country">Issuing country</label><input class="input" id="pp-country" value="${u.passport.country}" ${ro('passport')}></div>
                <div class="field-group col-6"><label for="pp-issued">Date issued</label><input class="input" id="pp-issued" type="date" value="${u.passport.issued}" ${ro('passport')}></div>
                <div class="field-group col-6"><label for="pp-exp">Expiry date</label><input class="input" id="pp-exp" type="date" value="${u.passport.expiry}" ${ro('passport')}></div>
              </div>
            </form>
            <section class="panel" id="travellers" aria-labelledby="tv-h">
              <div class="panel-head"><div><h2 id="tv-h">Travellers</h2><p>People you often book for. Edit or remove them any time.</p></div>
                <button class="btn btn-primary btn-sm" type="button" data-action="toast" data-msg="The add-traveller form uses the passenger fields from checkout.">${icon('plus')} Add traveller</button></div>
              <div class="traveller-grid">
                ${OB.travellers.map((t) => `
                  <article class="traveller">
                    <header><span class="avatar">${t.name.split(' ').map((p) => p[0]).join('')}</span><div><strong>${esc(t.name)}</strong><span>${t.type} traveller</span></div>
                      <button class="icon-btn" type="button" aria-label="Edit ${esc(t.name)}" data-action="toast" data-msg="Editing opens the same form as Add traveller.">${icon('edit')}</button></header>
                    <dl class="kv" style="margin:0"><div><dt>Date of birth</dt><dd>${t.dob}</dd></div><div><dt>Nationality</dt><dd>${t.nationality}</dd></div><div><dt>Passport</dt><dd>${t.passport}</dd></div><div><dt>Expires</dt><dd>${t.expiry}</dd></div></dl>
                    <button class="btn btn-danger-ghost btn-sm" type="button" style="justify-self:start" data-action="toast" data-msg="${esc(t.name)} would be removed after you confirm.">${icon('trash')} Remove</button>
                  </article>`).join('')}
              </div>
            </section>
          </div>
        </div>
      </main>
      ${OB.footer()}`;
  };
})();
