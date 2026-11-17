/* Savidya TV · Smart TV Remote add-on v2
   index.html ൽ:  <script src="tv.js?v=2"></script>  (</body> ന് മുകളിൽ)  */
(function () {
  'use strict';
  if (window.__tvxLoaded) return; window.__tvxLoaded = true;
  const $ = s => document.querySelector(s);
  const $$ = s => Array.prototype.slice.call(document.querySelectorAll(s));
  const body = document.body;
  const vid = $('#player-video');
  const SEL_BASE = '.header-actions button,.header-actions select,.tv-carousel .tv-card,#playerContainer,.tvx-actions button,#catFilter,#searchInput,.stream-modal-btn,#closeModal,#closeIosPopup,#errorClose';
  const SEL_ALL = SEL_BASE + ',#channelGrid .chan-card,#recent-grid .chan-card';

  /* ---------- Tizen: റിമോട്ട് കീകൾ രജിസ്റ്റർ ---------- */
  try {
    if (window.tizen && tizen.tvinputdevice) {
      ['0','1','2','3','4','5','6','7','8','9','ChannelUp','ChannelDown','MediaPlayPause','MediaPlay','MediaPause','MediaStop','MediaRewind','MediaFastForward','ColorF0Red','ColorF1Green','ColorF2Yellow','ColorF3Blue']
        .forEach(k => { try { tizen.tvinputdevice.registerKey(k); } catch (e) {} });
    }
  } catch (e) {}

  /* ---------- CSS ---------- */
  const css = `
  .tv-carousel{padding:14px 10px 18px!important}
  .player-overlay,#soundOverlay,.stream-modal-overlay{top:0;left:0;right:0;bottom:0}
  .player-container::before{content:"";display:block;padding-top:56.25%;width:0}
  @supports (aspect-ratio:16/9){.player-container::before{display:none}}
  .tvx-actions{display:flex;align-items:center}
  .tvx-actions .tvx-btn{margin-right:6px}
  .tvx-btn{background:var(--bg3);border:1px solid var(--border-color);color:var(--text);padding:5px 14px;border-radius:20px;font-size:.72rem;font-weight:700;cursor:pointer;display:flex;align-items:center}
  .tvx-btn:hover{background:var(--accent);color:#fff}
  .tvx-help{display:none;padding:8px 16px;background:var(--bg3);border-top:1px solid var(--border-color);font-size:.8rem;color:var(--text2);flex-wrap:wrap}
  .tvx-help span{margin-right:18px}
  .tvx-help b{color:var(--text)}
  #tvxOsd{position:absolute;top:4%;left:3%;display:flex;align-items:center;background:rgba(10,10,20,.82);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:10px 20px 10px 12px;color:#fff;z-index:15;opacity:0;transform:translateY(-10px);transition:opacity .25s,transform .25s;pointer-events:none;max-width:90%}
  #tvxOsd.show{opacity:1;transform:none}
  #tvxOsd img{width:52px;height:52px;border-radius:10px;object-fit:contain;background:rgba(255,255,255,.13);padding:3px;margin-right:14px}
  #tvxOsd .n{font-size:1.5rem;font-weight:800;color:#a29bfe}
  #tvxOsd .t{font-size:1.05rem;font-weight:700}
  #tvxOsd .c{font-size:.75rem;opacity:.7}
  /* ഫുൾസ്ക്രീനിൽ ചാനൽ ലിസ്റ്റ് */
  #tvxList{position:absolute;top:0;right:0;bottom:0;width:36%;min-width:240px;background:rgba(8,8,16,.92);z-index:16;display:none;flex-direction:column;color:#fff}
  #tvxList.show{display:flex}
  #tvxList h4{margin:0;padding:12px 16px;font-size:.95em;background:#6c5ce7}
  #tvxListBody{flex:1;overflow:hidden;position:relative}
  .tvx-li{padding:9px 16px;font-size:1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:6px solid transparent}
  .tvx-li i{font-style:normal;opacity:.6;display:inline-block;min-width:3em}
  .tvx-li.cur{color:#4ade80}
  .tvx-li.sel{background:#6c5ce7;border-left-color:#fff;font-weight:700;color:#fff}
  .player-wrapper:fullscreen .player-container,.player-wrapper:-webkit-full-screen .player-container{height:100vh!important}
  .player-wrapper:fullscreen #tvxOsd,.player-wrapper:-webkit-full-screen #tvxOsd{font-size:1.3em}
  .player-wrapper:fullscreen #tvxList,.player-wrapper:-webkit-full-screen #tvxList{font-size:1.3em}
  body.keynav,body.keynav *{cursor:none!important}
  body.keynav .tv-card:focus,body.keynav .chan-card:focus,body.keynav .btn:focus,body.keynav .tvx-btn:focus,body.keynav select:focus,body.keynav input:focus,body.keynav .stream-modal-btn:focus,body.keynav .modal-close:focus,body.keynav .error-close:focus,body.keynav .ios-close-btn:focus{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 7px #6c5ce7,0 12px 38px rgba(108,92,231,.7);transform:scale(1.07);z-index:6;position:relative;background:var(--bg3)}
  body.keynav .player-container:focus{outline:4px solid #6c5ce7;outline-offset:-4px}
  body.keynav .player-container:focus::after{content:"OK = ഫുൾസ്ക്രീൻ · ◀ ▶ = ചാനൽ മാറ്റം";position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.65);color:#fff;font-size:.75rem;padding:4px 14px;border-radius:20px;pointer-events:none}
  .player-wrapper:fullscreen .player-container:focus::after,.player-wrapper:-webkit-full-screen .player-container:focus::after{display:none}
  /* ===== TV MODE ===== */
  html{scroll-behavior:auto!important}
  body.tv-mode .app{max-width:none;padding:2.2vw 3.2vw;display:flex;flex-direction:column}
  body.tv-mode .header{order:0;padding:14px 22px}
  body.tv-mode .player-wrapper{order:1;width:62vw;width:min(100%,calc(62vh * 16 / 9));margin-left:auto;margin-right:auto}
  body.tv-mode .tv-section{order:2}
  body.tv-mode #recentSection{order:3}
  body.tv-mode .filter-bar{order:4}
  body.tv-mode .app>.section-title{order:5}
  body.tv-mode #channelGrid{order:6}
  body.tv-mode .app-footer{order:9}
  body.tv-mode .brand-name{font-size:1.9rem}
  body.tv-mode .brand-logo-img{width:52px;height:52px}
  body.tv-mode .brand-badge{font-size:.8rem}
  body.tv-mode .btn,body.tv-mode .country-picker,body.tv-mode .quality-picker,body.tv-mode .tvx-btn{font-size:1.05rem;padding:10px 20px}
  body.tv-mode .tv-section-title h2{font-size:1.6rem}
  body.tv-mode .tv-section-more{font-size:1rem}
  body.tv-mode .tv-carousel{gap:20px;padding:24px 26px 30px!important;scroll-snap-type:none!important}
  body.tv-mode .tv-card{flex:0 0 190px;min-height:150px}
  body.tv-mode .tv-card .icon-wrap{font-size:2.6rem}
  body.tv-mode .tv-card .label{font-size:1.1rem}
  body.tv-mode .tv-card .live-tag{font-size:.7rem}
  body.tv-mode #channelGrid,body.tv-mode #recent-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:20px;padding:20px 12px 24px}
  body.tv-mode .chan-card{padding:18px 8px;contain:none}
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
  body.tv-mode .tvx-help{display:flex}
  body.tv-mode .app-footer{font-size:.95rem}
  body.tv-mode ::-webkit-scrollbar{display:none}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- UI ഘടകങ്ങൾ ---------- */
  const container = $('#playerContainer');
  container.setAttribute('tabindex', '0');

  const osd = document.createElement('div'); osd.id = 'tvxOsd';
  osd.innerHTML = '<img id="tvxLogo" alt=""><div><div class="n" id="tvxNum"></div><div class="t" id="tvxName"></div><div class="c" id="tvxCat"></div></div>';
  container.appendChild(osd);

  const lst = document.createElement('div'); lst.id = 'tvxList';
  lst.innerHTML = '<h4>📺 ചാനലുകൾ · OK = കാണുക · Back = അടയ്ക്കുക</h4><div id="tvxListBody"></div>';
  container.appendChild(lst);
  const lbody = lst.querySelector('#tvxListBody');

  const meta = $('.player-meta');
  const act = document.createElement('div'); act.className = 'tvx-actions';
  act.innerHTML = '<button class="tvx-btn" id="tvxPrev">⏮ Prev</button><button class="tvx-btn" id="tvxNext">Next ⏭</button><button class="tvx-btn" id="tvxFav">♥ Fav</button>';
  meta.insertBefore(act, $('.meta-status'));
  const help = document.createElement('div'); help.className = 'tvx-help';
  help.innerHTML = '<span><b>◀ ▶ ▲ ▼</b> നീക്കുക</span><span><b>OK</b> തിരഞ്ഞെടുക്കുക / ഫുൾസ്ക്രീൻ</span><span><b>ഫുൾസ്ക്രീനിൽ ▲▼</b> ചാനൽ മാറ്റം</span><span><b>ഫുൾസ്ക്രീനിൽ OK</b> ചാനൽ ലിസ്റ്റ്</span><span><b>CH ▲▼</b> അടുത്ത/മുൻ ചാനൽ</span><span><b>0-9</b> ചാനൽ നമ്പർ</span><span><b>🔴</b> Fav  <b>🟢</b> ഫുൾസ്ക്രീൻ  <b>🟡</b> TV മോഡ്  <b>🔵</b> തിരയൽ</span><span><b>Back</b> തിരികെ</span>';
  meta.after(help);

  const playBtn = $('#playBtn');
  const cp = document.createElement('button'); cp.className = 'ctrl-btn'; cp.textContent = '⏮'; cp.title = 'Previous';
  const cn = document.createElement('button'); cn.className = 'ctrl-btn'; cn.textContent = '⏭'; cn.title = 'Next';
  playBtn.after(cn); playBtn.after(cp);
  cp.onclick = () => step(-1); cn.onclick = () => step(1);
  $('#tvxPrev').onclick = () => step(-1); $('#tvxNext').onclick = () => step(1); $('#tvxFav').onclick = () => fav();

  const tvBtn = document.createElement('button'); tvBtn.className = 'btn'; tvBtn.id = 'tvModeBtn';
  $('#themeToggle').before(tvBtn);

  /* ---------- TV മോഡ് ---------- */
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

  /* ---------- ശബ്ദം: ചാനൽ മാറ്റുമ്പോൾ mute ആകാതിരിക്കാൻ ---------- */
  let soundOn = false, userMuted = false;
  const allowSound = () => { soundOn = true; };
  ['keydown', 'mousedown', 'touchstart', 'click'].forEach(ev => document.addEventListener(ev, allowSound, { capture: true, passive: true }));
  $('#muteBtn').addEventListener('click', () => { userMuted = vid.muted; });
  vid.addEventListener('playing', () => {
    if (soundOn && !userMuted && vid.muted) {
      vid.muted = false;
      $('#volIcon').style.display = 'block'; $('#muteIcon').style.display = 'none';
      const p = vid.play(); if (p && p.catch) p.catch(() => { vid.muted = true; });
    }
  });

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

  /* ---------- ചാനൽ next / prev ---------- */
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

  /* ---------- Fav ലിസ്റ്റ് ↔ എല്ലാ ചാനലും ---------- */
  let favMode = false;
  const favBtn = $('#viewFavBtn');
  function resetFav() { if (favMode) { favMode = false; favBtn.textContent = '❤️ Fav'; } }
  document.addEventListener('click', e => {
    const t = e.target; if (!t || !t.closest) return;
    if (t.closest('#viewFavBtn')) {
      if (favMode) {
        e.stopPropagation(); e.preventDefault(); resetFav();
        $('#catFilter').dispatchEvent(new Event('change'));
      } else {
        let n = 0; try { n = JSON.parse(localStorage.getItem('iptv_favs') || '[]').length; } catch (x) {}
        if (n) { favMode = true; favBtn.textContent = '📋 എല്ലാം'; }
      }
    } else if (t.closest('.tv-card,.stream-modal-btn')) resetFav();
  }, true);
  $('#catFilter').addEventListener('change', resetFav);
  $('#searchInput').addEventListener('input', resetFav);
  $('#countryPicker').addEventListener('change', resetFav);

  /* ---------- ഫുൾസ്ക്രീൻ ---------- */
  const isFS = () => document.fullscreenElement || document.webkitFullscreenElement;
  function vfs() { (vid.requestFullscreen || vid.webkitRequestFullscreen || vid.webkitEnterFullscreen || function () {}).call(vid); }
  function toggleFS() {
    if (isFS()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    const w = $('.player-wrapper'), r = w.requestFullscreen || w.webkitRequestFullscreen;
    if (!r) return vfs();
    try { const p = r.call(w); if (p && p.catch) p.catch(vfs); } catch (e) { vfs(); }
  }
  document.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('#headerFsBtn,#fsBtn')) { e.stopPropagation(); e.preventDefault(); toggleFS(); }
  }, true);
  function onFsChange() {
    closeList();
    if (!isFS() && body.classList.contains('keynav')) { try { container.focus({ preventScroll: true }); } catch (e) { container.focus(); } }
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

  /* ---------- ഫുൾസ്ക്രീൻ ചാനൽ ലിസ്റ്റ് (OK അമർത്തിയാൽ) ---------- */
  let lopen = false, lidx = 0, lcards = [];
  function openList() {
    lcards = cards(); if (!lcards.length) return;
    lidx = Math.max(0, lcards.findIndex(c => c.classList.contains('active')));
    lbody.innerHTML = '';
    lcards.forEach((c, i) => {
      const d = document.createElement('div'); d.className = 'tvx-li' + (c.classList.contains('active') ? ' cur' : '');
      const n = document.createElement('i'); n.textContent = (i + 1);
      const nm = c.querySelector('.chan-name');
      d.appendChild(n); d.appendChild(document.createTextNode(nm ? nm.textContent : ''));
      lbody.appendChild(d);
    });
    lopen = true; lst.classList.add('show'); lsel(lidx, true);
  }
  function closeList() { lopen = false; lst.classList.remove('show'); }
  function lsel(i, wrap) {
    const n = lbody.children.length; if (!n) return;
    lidx = wrap ? (i + n) % n : Math.min(n - 1, Math.max(0, i));
    const old = lbody.querySelector('.sel'); if (old) old.classList.remove('sel');
    const el = lbody.children[lidx]; el.classList.add('sel');
    lbody.scrollTop = el.offsetTop - lbody.clientHeight / 2 + el.offsetHeight / 2;
  }

  /* ---------- D-pad നാവിഗേഷൻ ---------- */
  function prep() { $$(SEL_ALL).forEach(el => { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0'); }); $$('.chan-fav').forEach(b => b.setAttribute('tabindex', '-1')); }
  function visible(el) { return el.offsetWidth > 0 && el.offsetHeight > 0; }
  function gridOf(el) { return el && el.closest ? (el.closest('#channelGrid') || el.closest('#recent-grid')) : null; }
  function rowCards(g, last) {
    if (!g || !visible(g)) return [];
    const it = $$('#' + g.id + ' .chan-card'); if (!it.length) return [];
    const ref = last ? it[it.length - 1].offsetTop : it[0].offsetTop;
    return it.filter(x => x.offsetTop === ref);
  }
  function cands(dir, skip) {
    if ($('#streamModal').classList.contains('active')) return $$('#streamModal .stream-modal-btn,#closeModal').filter(visible);
    let out = $$(SEL_BASE).filter(el => !el.closest('.player-controls') && !el.disabled && visible(el));
    ['#recent-grid', '#channelGrid'].forEach(id => { const g = $(id); if (g && g !== skip) out = out.concat(rowCards(g, dir === 'u')); });
    return out;
  }
  function reveal(el) {
    if (el === container && tv) { window.scrollTo(0, 0); return; }
    if (el.closest && el.closest('header')) { window.scrollTo(0, 0); return; }
    const r = el.getBoundingClientRect(), vh = window.innerHeight, vw = window.innerWidth;
    const v = r.top < 40 || r.bottom > vh - 40, h = r.left < 0 || r.right > vw;
    if (v || h) el.scrollIntoView({ block: v ? 'center' : 'nearest', inline: h ? 'center' : 'nearest' });
  }
  function focusEl(el) {
    if (!el) return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
    reveal(el);
  }
  function colsOf(items) {
    const top = items[0].offsetTop; let n = 0;
    while (n < items.length && items[n].offsetTop === top) n++;
    return n || 1;
  }
  function move(dir) {
    const cur = document.activeElement, g = gridOf(cur);
    if (g && cur.classList.contains('chan-card')) {
      const items = $$('#' + g.id + ' .chan-card'), i = items.indexOf(cur);
      if (i >= 0) {
        if (dir === 'l' && i > 0) return focusEl(items[i - 1]);
        if (dir === 'r' && i < items.length - 1) return focusEl(items[i + 1]);
        if (dir === 'd' || dir === 'u') {
          const cols = colsOf(items), j = dir === 'd' ? i + cols : i - cols;
          if (j >= 0 && j < items.length) return focusEl(items[j]);
          if (dir === 'd' && Math.floor(i / cols) < Math.floor((items.length - 1) / cols)) return focusEl(items[items.length - 1]);
        }
      }
    }
    const list = cands(dir, g);
    if (!list.includes(cur)) {
      if (g && dir !== 'u' && dir !== 'd') return;
      if (!g) return focusEl(list.find(x => x.classList.contains('active')) || list[0]);
    }
    const a = cur.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    let best = null, bs = 1e9;
    for (let n = 0; n < list.length; n++) {
      const el = list[n]; if (el === cur) continue;
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const hgap = Math.max(0, r.left - a.right, a.left - r.right), vgap = Math.max(0, r.top - a.bottom, a.top - r.bottom);
      let p, s, t;
      if (dir === 'r') { if (!(cx > ax + 1 && r.left > a.left)) continue; p = Math.max(0, r.left - a.right); s = vgap; t = Math.abs(cy - ay); if (s > a.height) continue; }
      else if (dir === 'l') { if (!(cx < ax - 1 && r.right < a.right)) continue; p = Math.max(0, a.left - r.right); s = vgap; t = Math.abs(cy - ay); if (s > a.height) continue; }
      else if (dir === 'd') { if (!(cy > ay + 1 && r.top > a.top)) continue; p = Math.max(0, r.top - a.bottom); s = hgap; t = Math.abs(cx - ax); }
      else { if (!(cy < ay - 1 && r.bottom < a.bottom)) continue; p = Math.max(0, a.top - r.bottom); s = hgap; t = Math.abs(cx - ax); }
      const score = p + 6 * s + 0.1 * t;
      if (score < bs) { bs = score; best = el; }
    }
    if (best) focusEl(best);
  }

  /* ---------- കീബോർഡ് / റിമോട്ട് ---------- */
  const DIR = { ArrowLeft: 'l', ArrowRight: 'r', ArrowUp: 'u', ArrowDown: 'd', 37: 'l', 39: 'r', 38: 'u', 40: 'd' };
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const k = e.key, c = e.keyCode, t = e.target, tag = t.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
    const back = k === 'Escape' || k === 'BrowserBack' || k === 'GoBack' || c === 10009 || c === 461 || c === 4 || (k === 'Backspace' && !inInput);
    const dir = DIR[k] || DIR[c];
    const chNext = k === 'ChannelUp' || c === 427 || c === 166 || c === 33 || c === 176 || c === 417 || (!inInput && k === 'n');
    const chPrev = k === 'ChannelDown' || c === 428 || c === 167 || c === 34 || c === 177 || c === 412 || (!inInput && k === 'p');
    const ok = k === 'Enter' || c === 13 || c === 23 || c === 29443 || c === 65376;
    const prevent = () => e.preventDefault();

    // ആദ്യ കീ അമർത്തിയാൽ ശബ്ദം ഓൺ
    const so = $('#soundOverlay');
    if (so.classList.contains('active') && !back && k !== 'Shift' && k !== 'Control') so.click();

    if (dir || ok || chNext || chPrev || back) body.classList.add('keynav');

    // Back
    if (back) {
      if (lopen) { prevent(); closeList(); return; }
      if (isFS()) { prevent(); toggleFS(); return; }
      if ($('#streamModal').classList.contains('active')) { prevent(); $('#closeModal').click(); return; }
      const ip = $('#iosInstallPopup'); if (ip && ip.style.display === 'block') { prevent(); $('#closeIosPopup').click(); return; }
      if (inInput) { prevent(); t.blur(); focusEl($('#catFilter')); return; }
      if (t !== container && k !== 'Escape') { prevent(); focusEl(container); }
      return;
    }

    // ചാനൽ ലിസ്റ്റ് തുറന്നിരിക്കുമ്പോൾ
    if (lopen) {
      prevent();
      if (dir === 'u') lsel(lidx - 1, true);
      else if (dir === 'd') lsel(lidx + 1, true);
      else if (chNext) lsel(lidx - 8, false);
      else if (chPrev) lsel(lidx + 8, false);
      else if (ok && !e.repeat) { const cc = cards()[lidx]; closeList(); if (cc) { cc.click(); osdChannel(); } }
      return;
    }

    // ചാനൽ കീകൾ / മീഡിയ കീകൾ
    if (chNext) { prevent(); return step(1); }
    if (chPrev) { prevent(); return step(-1); }
    if (c === 179 || c === 415 || c === 19 || c === 85 || c === 126 || c === 127 || k === 'MediaPlayPause' || k === 'MediaPlay' || k === 'MediaPause') { prevent(); return playBtn.click(); }
    if (c === 413 || k === 'MediaStop') { prevent(); if (!vid.paused) playBtn.click(); return; }
    if (c === 403) { prevent(); return fav(); }                     // Red
    if (c === 404) { prevent(); return toggleFS(); }                // Green
    if (c === 405) { prevent(); tv = !tv; return applyTV(); }       // Yellow
    if (c === 406) { prevent(); return focusEl($('#searchInput')); } // Blue
    if (!inInput && k === 'f') { prevent(); return fav(); }
    if (!inInput && k === 'm') { prevent(); return $('#muteBtn').click(); }
    if (!inInput && /^[0-9]$/.test(k)) { prevent(); return digit(k); }

    // ഫുൾസ്ക്രീൻ: ടിവി പോലെ
    if (isFS()) {
      prevent();
      if (dir === 'u') return step(1);
      if (dir === 'd') return step(-1);
      if (dir === 'l' || dir === 'r') {
        const v = $('#volSlider'), n = Math.min(2, Math.max(0, Math.round((parseFloat(v.value) + (dir === 'r' ? 0.1 : -0.1)) * 100) / 100));
        userMuted = false; v.value = n; v.dispatchEvent(new Event('input')); return showOsd('🔊', Math.round(n * 100) + '%', 'Volume');
      }
      if (ok && !e.repeat) return openList();
      return;
    }

    // ആരോ നാവിഗേഷൻ
    if (dir) {
      if (inInput && (dir === 'l' || dir === 'r') && t.value) return;   // ടൈപ്പ് ചെയ്യുമ്പോൾ cursor നീക്കം
      prevent();
      if (t === container && (dir === 'l' || dir === 'r')) return step(dir === 'r' ? 1 : -1);
      return move(dir);
    }

    // OK / Enter
    if (ok) {
      if (e.repeat) { prevent(); return; }
      if (tag === 'SELECT' || inInput) return;                          // browser തന്നെ തുറക്കും
      if (t === container) { prevent(); return toggleFS(); }
      const card = t.closest && t.closest('.chan-card');
      if (card) {
        prevent();
        const was = card.classList.contains('active');
        card.click();
        if (was) toggleFS(); else { osdChannel(); focusEl(container); }
        return;
      }
      if (tag === 'BUTTON') { if (k !== 'Enter') { prevent(); t.click(); } return; }
      if (t !== body && t.click) { prevent(); t.click(); }
    }
  }, true);

  // പോയിന്റർ ശരിക്കും നീങ്ങിയാൽ മാത്രം keynav ഓഫ് (Magic Remote jitter ഒഴിവാക്കാൻ)
  let lx = 0, ly = 0;
  document.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly) > 12) body.classList.remove('keynav');
    lx = e.clientX; ly = e.clientY;
  }, { passive: true });
  ['mousedown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => body.classList.remove('keynav'), { passive: true }));

  /* ---------- ഫോക്കസ് നഷ്ടപ്പെടാതിരിക്കാൻ ---------- */
  let lastId = '';
  document.addEventListener('focusin', e => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('chan-card')) lastId = (t.closest('#channelGrid') && t.dataset.id) || '';
  });
  let raf = 0;
  new MutationObserver(() => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; prep(); }); })
    .observe(body, { childList: true, subtree: true });
  // ഗ്രിഡ് വീണ്ടും വരയ്ക്കുമ്പോൾ
  new MutationObserver(() => {
    if (body.classList.contains('keynav') && (document.activeElement === body || !document.activeElement)) {
      const target = (lastId && $('#channelGrid .chan-card[data-id="' + lastId + '"]')) || $('#channelGrid .chan-card.active') || container;
      try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
    }
  }).observe($('#channelGrid'), { childList: true });
  // Malayalam മോഡൽ തുറക്കുമ്പോൾ / അടയ്ക്കുമ്പോൾ
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
  if (tv) { body.classList.add('keynav'); setTimeout(() => { try { container.focus({ preventScroll: true }); } catch (e) { container.focus(); } window.scrollTo(0, 0); }, 600); }
})();
