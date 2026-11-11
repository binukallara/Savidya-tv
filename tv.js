/* Savidya TV · Smart TV add-on
   index.html ലെ </body> ന് തൊട്ടുമുകളിൽ ചേർക്കുക:  <script src="tv.js"></script>
   നിലവിലുള്ള കോഡിൽ ഒരു മാറ്റവും വരുത്തുന്നില്ല. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const body = document.body;
  const SEL = '.header-actions button,.header-actions select,.tv-carousel .tv-card,#playerContainer,.tvx-actions button,#catFilter,#searchInput,#channelGrid .chan-card,#recent-grid .chan-card,.stream-modal-btn,#closeModal,#closeIosPopup,#errorClose';

  /* ---------- CSS ---------- */
  const css = `
  html{scroll-behavior:smooth}
  .tv-carousel{padding:14px 10px 18px!important}
  .tvx-actions{display:flex;gap:6px;align-items:center}
  .tvx-btn{background:var(--bg3);border:1px solid var(--border-color);color:var(--text);padding:5px 14px;border-radius:20px;font-size:.72rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px}
  .tvx-btn:hover{background:var(--accent);color:#fff}
  .tvx-help{display:none;padding:8px 16px;background:var(--bg3);border-top:1px solid var(--border-color);font-size:.8rem;color:var(--text2);gap:18px;flex-wrap:wrap}
  .tvx-help b{color:var(--text)}
  #tvxOsd{position:absolute;top:4%;left:3%;display:flex;align-items:center;gap:14px;background:rgba(10,10,20,.82);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:10px 20px 10px 12px;color:#fff;z-index:15;opacity:0;transform:translateY(-10px);transition:all .25s;pointer-events:none;max-width:90%}
  #tvxOsd.show{opacity:1;transform:none}
  #tvxOsd img{width:52px;height:52px;border-radius:10px;object-fit:contain;background:#fff2;padding:3px}
  #tvxOsd .n{font-size:1.5rem;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  #tvxOsd .t{font-size:1.05rem;font-weight:700}
  #tvxOsd .c{font-size:.75rem;opacity:.7}
  .player-wrapper:fullscreen .player-container,.player-wrapper:-webkit-full-screen .player-container{height:100vh!important;aspect-ratio:auto!important}
  .player-wrapper:fullscreen #tvxOsd{font-size:1.3em}
  body.keynav,body.keynav *{cursor:none!important}
  body.keynav :is(.tv-card,.chan-card,.btn,.tvx-btn,select,input,.stream-modal-btn,.modal-close):focus{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 7px var(--accent),0 12px 38px rgba(108,92,231,.7);transform:scale(1.08);z-index:6;position:relative;background:var(--bg3)}
  body.keynav .player-container:focus{outline:4px solid var(--accent);outline-offset:-4px;box-shadow:none;transform:none}
  body.keynav .player-container:focus::after{content:"OK = ഫുൾസ്ക്രീൻ · ◀ ▶ = ചാനൽ മാറ്റം";position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.65);color:#fff;font-size:.75rem;padding:4px 14px;border-radius:20px;pointer-events:none}
  .player-wrapper:fullscreen .player-container:focus::after{display:none}
  /* ===== TV MODE ===== */
  body.tv-mode .app{max-width:none;padding:2.2vw 3.2vw}
  body.tv-mode .header{padding:14px 22px}
  body.tv-mode .brand-name{font-size:1.9rem}
  body.tv-mode .brand-logo-img{width:52px;height:52px}
  body.tv-mode .brand-badge{font-size:.8rem}
  body.tv-mode .btn,body.tv-mode .country-picker,body.tv-mode .quality-picker,body.tv-mode .tvx-btn{font-size:1.05rem;padding:10px 20px}
  body.tv-mode .tv-section-title h2{font-size:1.6rem}
  body.tv-mode .tv-section-more{font-size:1rem}
  body.tv-mode .tv-carousel{gap:20px;padding:22px 16px 28px!important}
  body.tv-mode .tv-card{flex:0 0 190px;min-height:150px}
  body.tv-mode .tv-card .icon-wrap{font-size:2.6rem}
  body.tv-mode .tv-card .label{font-size:1.1rem}
  body.tv-mode .tv-card .live-tag{font-size:.7rem}
  body.tv-mode #channelGrid,body.tv-mode #recent-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:20px;padding:16px 8px 24px}
  body.tv-mode .chan-card{padding:18px 8px}
  body.tv-mode .chan-card img{width:84px;height:84px}
  body.tv-mode .chan-name{font-size:1.05rem}
  body.tv-mode .chan-cat{font-size:.85rem}
  body.tv-mode .chan-fav{display:none}
  body.tv-mode .filter-input,body.tv-mode .filter-select{font-size:1.1rem;padding:12px 18px}
  body.tv-mode .count-badge{font-size:.95rem}
  body.tv-mode .section-title{font-size:1.2rem}
  body.tv-mode .meta-name{font-size:1.3rem}
  body.tv-mode .meta-cat,body.tv-mode .status-label{font-size:.95rem}
  body.tv-mode .meta-logo{width:52px;height:52px}
  body.tv-mode .player-wrapper{width:min(100%,calc(62vh * 16 / 9));margin-left:auto;margin-right:auto}
  body.tv-mode .tvx-help{display:flex}
  body.tv-mode .app-footer{font-size:.95rem}
  body.tv-mode ::-webkit-scrollbar{display:none}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Inject UI: Prev / Next / Fav, OSD, TV button, help ---------- */
  const container = $('#playerContainer');
  const osd = document.createElement('div'); osd.id = 'tvxOsd';
  osd.innerHTML = '<img id="tvxLogo" alt=""><div><div class="n" id="tvxNum"></div><div class="t" id="tvxName"></div><div class="c" id="tvxCat"></div></div>';
  container.appendChild(osd);
  container.setAttribute('tabindex', '0');

  const meta = $('.player-meta');
  const act = document.createElement('div'); act.className = 'tvx-actions';
  act.innerHTML = '<button class="tvx-btn" id="tvxPrev">⏮ Prev</button><button class="tvx-btn" id="tvxNext">Next ⏭</button><button class="tvx-btn" id="tvxFav">♥ Fav</button>';
  meta.insertBefore(act, $('.meta-status'));
  const help = document.createElement('div'); help.className = 'tvx-help';
  help.innerHTML = '<span><b>◀ ▶ ▲ ▼</b> നീക്കുക</span><span><b>OK</b> തിരഞ്ഞെടുക്കുക</span><span><b>OK രണ്ടുതവണ</b> ഫുൾസ്ക്രീൻ</span><span><b>CH ▲▼ / PgUp-PgDn</b> അടുത്ത/മുൻ ചാനൽ</span><span><b>0-9</b> ചാനൽ നമ്പർ</span><span><b>🔴 Red</b> Fav</span><span><b>Back</b> തിരികെ</span>';
  meta.after(help);

  const row = $('.controls-row'), playBtn = $('#playBtn');
  const cp = document.createElement('button'); cp.className = 'ctrl-btn'; cp.textContent = '⏮'; cp.title = 'Previous';
  const cn = document.createElement('button'); cn.className = 'ctrl-btn'; cn.textContent = '⏭'; cn.title = 'Next';
  playBtn.after(cn); playBtn.after(cp);
  cp.onclick = () => step(-1); cn.onclick = () => step(1);
  $('#tvxPrev').onclick = () => step(-1); $('#tvxNext').onclick = () => step(1); $('#tvxFav').onclick = () => fav();

  const tvBtn = document.createElement('button'); tvBtn.className = 'btn'; tvBtn.id = 'tvModeBtn';
  $('#themeToggle').before(tvBtn);

  /* ---------- TV mode (auto-detect + toggle) ---------- */
  const isTVua = /SMART-TV|SmartTV|Tizen|Web0S|webOS|NetCast|HbbTV|AFTM|Android TV|BRAVIA|GoogleTV|CrKey|Roku|VIDAA|Hisense/i.test(navigator.userAgent);
  const qs = new URLSearchParams(location.search);
  let saved = null; try { saved = localStorage.getItem('iptv_tvmode'); } catch (e) {}
  let tv = qs.get('tv') === '1' || (qs.get('tv') !== '0' && (saved === 'on' || (saved === null && isTVua)));
  function applyTV() {
    body.classList.toggle('tv-mode', tv);
    tvBtn.textContent = tv ? '📺 TV: ON' : '📺 TV: OFF';
    try { localStorage.setItem('iptv_tvmode', tv ? 'on' : 'off'); } catch (e) {}
  }
  tvBtn.onclick = () => { tv = !tv; applyTV(); };
  applyTV();

  /* ---------- OSD ---------- */
  let osdTimer, ctlTimer;
  function showOsd(num, name, cat, logo) {
    $('#tvxNum').textContent = num || ''; $('#tvxName').textContent = name || ''; $('#tvxCat').textContent = cat || '';
    const im = $('#tvxLogo'); if (logo) { im.src = logo; im.style.display = ''; } else im.style.display = 'none';
    osd.classList.add('show'); container.classList.add('show-controls');
    clearTimeout(osdTimer); clearTimeout(ctlTimer);
    osdTimer = setTimeout(() => osd.classList.remove('show'), 3500);
    ctlTimer = setTimeout(() => container.classList.remove('show-controls'), 3500);
  }
  function osdChannel() {
    const cs = cards(), i = cs.findIndex(c => c.classList.contains('active'));
    showOsd(i >= 0 ? (i + 1) + ' / ' + cs.length : '', $('#metaName').textContent, $('#metaCat').textContent, $('#metaLogo').src);
  }

  /* ---------- Channel next / prev (follows the visible list order) ---------- */
  function cards() { return $$('#channelGrid .chan-card'); }
  function step(d) {
    const cs = cards(); if (!cs.length) return;
    let i = cs.findIndex(c => c.classList.contains('active'));
    i = i < 0 ? (d > 0 ? 0 : cs.length - 1) : (i + d + cs.length) % cs.length;
    cs[i].click();
    osdChannel();
  }
  function fav() {
    const f = document.activeElement && document.activeElement.closest && document.activeElement.closest('#channelGrid .chan-card');
    const c = f || $('#channelGrid .chan-card.active'); if (!c) return;
    const b = c.querySelector('.chan-fav'); if (b) b.click();
  }
  let nbuf = '', ntimer;
  function digit(d) {
    nbuf = nbuf.length >= 4 ? d : nbuf + d;
    showOsd('', '📺 ' + nbuf, 'ചാനൽ നമ്പർ');
    clearTimeout(ntimer);
    ntimer = setTimeout(() => {
      const n = +nbuf; nbuf = ''; const cs = cards();
      if (n >= 1 && n <= cs.length) { cs[n - 1].click(); osdChannel(); } else showOsd('', 'ചാനൽ ' + n + ' ഇല്ല', '');
    }, 1400);
  }

  /* ---------- Fullscreen (whole player, so OSD stays visible) ---------- */
  const isFS = () => document.fullscreenElement || document.webkitFullscreenElement;
  function vfs() { const v = $('#player-video'); (v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen || function () {}).call(v); }
  function toggleFS() {
    if (isFS()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    const w = $('.player-wrapper'), r = w.requestFullscreen || w.webkitRequestFullscreen;
    if (!r) return vfs();
    try { const p = r.call(w); if (p && p.catch) p.catch(vfs); } catch (e) { vfs(); }
  }
  document.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('#headerFsBtn,#fsBtn')) { e.stopPropagation(); e.preventDefault(); toggleFS(); }
  }, true);

  /* ---------- Spatial (D-pad) navigation ---------- */
  function prep() { $$(SEL).forEach(el => { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0'); }); $$('.chan-fav').forEach(b => b.setAttribute('tabindex', '-1')); }
  function visible(el) { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; }
  function cands() {
    const modal = $('#streamModal').classList.contains('active');
    return $$(modal ? '#streamModal .stream-modal-btn,#closeModal' : SEL).filter(el => !el.closest('.player-controls') && !el.disabled && visible(el));
  }
  function focusEl(el) {
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: el.closest('header') ? 'start' : 'center', inline: 'center', behavior: 'smooth' });
  }
  function move(dir) {
    const list = cands(), cur = document.activeElement;
    if (!list.includes(cur)) return focusEl(list.find(x => x.classList.contains('active')) || list[0]);
    const a = cur.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    let best = null, bs = 1e9;
    for (const el of list) {
      if (el === cur) continue;
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let p, s, t;
      const hgap = Math.max(0, r.left - a.right, a.left - r.right), vgap = Math.max(0, r.top - a.bottom, a.top - r.bottom);
      if (dir === 'r') { if (!(cx > ax + 1 && r.left > a.left)) continue; p = Math.max(0, r.left - a.right); s = vgap; t = Math.abs(cy - ay); if (s > a.height) continue; }
      else if (dir === 'l') { if (!(cx < ax - 1 && r.right < a.right)) continue; p = Math.max(0, a.left - r.right); s = vgap; t = Math.abs(cy - ay); if (s > a.height) continue; }
      else if (dir === 'd') { if (!(cy > ay + 1 && r.top > a.top)) continue; p = Math.max(0, r.top - a.bottom); s = hgap; t = Math.abs(cx - ax); }
      else { if (!(cy < ay - 1 && r.bottom < a.bottom)) continue; p = Math.max(0, a.top - r.bottom); s = hgap; t = Math.abs(cx - ax); }
      const score = p + 6 * s + 0.1 * t;
      if (score < bs) { bs = score; best = el; }
    }
    if (best) focusEl(best);
  }

  /* ---------- Keyboard / Remote ---------- */
  const DIR = { ArrowLeft: 'l', ArrowRight: 'r', ArrowUp: 'u', ArrowDown: 'd', 37: 'l', 39: 'r', 38: 'u', 40: 'd' };
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const k = e.key, c = e.keyCode, t = e.target, tag = t.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
    const back = k === 'Escape' || k === 'BrowserBack' || c === 10009 || c === 461 || (k === 'Backspace' && !inInput);
    const dir = DIR[k] || DIR[c];
    const chNext = k === 'ChannelUp' || c === 427 || c === 33 || c === 176 || c === 417 || (!inInput && k === 'n');
    const chPrev = k === 'ChannelDown' || c === 428 || c === 34 || c === 177 || c === 412 || (!inInput && k === 'p');
    const ok = k === 'Enter' || c === 13 || c === 29443 || c === 65376;
    const prevent = () => e.preventDefault();

    // ആദ്യ കീ അമർത്തിയാൽ ശബ്ദം ഓൺ
    const so = $('#soundOverlay');
    if (so.classList.contains('active') && !back && k !== 'Shift' && k !== 'Control') so.click();

    if (dir || ok || chNext || chPrev || back) body.classList.add('keynav');

    // Back
    if (back) {
      if (isFS()) { prevent(); toggleFS(); return; }
      if ($('#streamModal').classList.contains('active')) { prevent(); $('#closeModal').click(); return; }
      const ip = $('#iosInstallPopup'); if (ip && ip.style.display === 'block') { prevent(); $('#closeIosPopup').click(); return; }
      if (inInput) { prevent(); t.blur(); focusEl($('#catFilter')); return; }
      if (t !== container && k !== 'Escape') { prevent(); focusEl(container); }
      return;
    }

    // Channel keys / media keys
    if (chNext) { prevent(); return step(1); }
    if (chPrev) { prevent(); return step(-1); }
    if (c === 179 || c === 415 || c === 19 || k === 'MediaPlayPause' || k === 'MediaPlay' || k === 'MediaPause') { prevent(); return playBtn.click(); }
    if (c === 413 || k === 'MediaStop') { prevent(); if (!$('#player-video').paused) playBtn.click(); return; }
    if (c === 403) { prevent(); return fav(); }              // Red
    if (c === 404) { prevent(); return toggleFS(); }          // Green
    if (c === 405) { prevent(); tv = !tv; return applyTV(); } // Yellow
    if (c === 406) { prevent(); return focusEl($('#searchInput')); } // Blue
    if (!inInput && /^[0-9]$/.test(k)) { prevent(); return digit(k); }

    // Fullscreen: TV പോലെ പ്രവർത്തിക്കും
    if (isFS()) {
      if (dir === 'u') { prevent(); return step(1); }
      if (dir === 'd') { prevent(); return step(-1); }
      if (dir === 'l' || dir === 'r') {
        prevent(); const v = $('#volSlider'); const n = Math.min(2, Math.max(0, parseFloat(v.value) + (dir === 'r' ? 0.1 : -0.1)));
        v.value = n; v.dispatchEvent(new Event('input')); showOsd('🔊', Math.round(n * 100) + '%', 'Volume'); return;
      }
      if (ok) { prevent(); playBtn.click(); return osdChannel(); }
      return;
    }

    // Arrow navigation
    if (dir) {
      if (inInput && (dir === 'l' || dir === 'r') && t.value) return;     // ടൈപ്പ് ചെയ്യുമ്പോൾ cursor നീക്കം
      if (t === container && (dir === 'l' || dir === 'r')) { prevent(); return step(dir === 'r' ? 1 : -1); }
      prevent(); return move(dir);
    }

    // OK / Enter
    if (ok) {
      if (tag === 'SELECT') { prevent(); if (t.showPicker) { try { t.showPicker(); } catch (x) { t.click(); } } else t.click(); return; }
      if (t === container) { prevent(); return toggleFS(); }
      const card = t.closest && t.closest('.chan-card');
      if (card) { prevent(); const was = card.classList.contains('active'); card.click(); if (was) toggleFS(); else osdChannel(); return; }
      if (tag !== 'BUTTON' && tag !== 'INPUT' && t.click && t !== body) { prevent(); t.click(); }
    }
  }, true);

  ['mousemove', 'mousedown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => body.classList.remove('keynav'), { passive: true }));

  /* ---------- Focus management ---------- */
  let raf = 0;
  new MutationObserver(() => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; prep(); }); })
    .observe(body, { childList: true, subtree: true });
  // ഗ്രിഡ് വീണ്ടും വരയ്ക്കുമ്പോൾ ഫോക്കസ് നഷ്ടപ്പെടാതിരിക്കാൻ
  new MutationObserver(() => {
    if (body.classList.contains('keynav') && (document.activeElement === body || !document.activeElement)) {
      const a = $('#channelGrid .chan-card.active'); if (a) a.focus({ preventScroll: true });
    }
  }).observe($('#channelGrid'), { childList: true });
  // മോഡൽ തുറക്കുമ്പോൾ / അടയ്ക്കുമ്പോൾ
  const modal = $('#streamModal');
  new MutationObserver(() => {
    if (modal.classList.contains('active')) { body.classList.add('keynav'); const b = modal.querySelector('.stream-modal-btn'); if (b) b.focus(); }
    else if (body.classList.contains('keynav')) { const m = $('#malayalamCard'); if (m) m.focus({ preventScroll: true }); }
  }).observe(modal, { attributes: true, attributeFilter: ['class'] });

  // ചാനൽ പ്ലേ ആകാതിരുന്നാൽ സൂചന
  let bad = 0;
  setInterval(() => {
    const s = $('#statusLabel').textContent;
    if (s === 'LOADING' || s === 'BUFFERING') { if (++bad === 12) showOsd('⚠️', 'ചാനൽ ലഭ്യമല്ലെന്ന് തോന്നുന്നു', 'Next അമർത്തി അടുത്തത് നോക്കുക'); } else bad = 0;
  }, 1000);

  prep();
  if (tv) { body.classList.add('keynav'); setTimeout(() => { const m = $('#malayalamCard'); if (m) m.focus({ preventScroll: true }); }, 600); }
})();
