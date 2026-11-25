(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const PID = new URLSearchParams(location.search).get('p') || 'w25_11';
const au = $('#au');
const S = { ans: {}, dx: {}, key: null, reveal: false, exam: false, zoom: 100, trCh: 'c1', sheetQ: 0, tab: 'dx' };
let D = null;
const sget = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const sset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* none */ } };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = t => { t = Math.max(0, t | 0); return (t / 60 | 0) + ':' + String(t % 60).padStart(2, '0'); };
const byN = n => D.q.find(q => q.n === n);

/* ---------- load ---------- */
fetch('data/' + PID + '.json').then(r => r.json()).then(d => { D = d; init(); }).catch(() => { $('#pages').innerHTML = '<p style="padding:20px">Could not load the paper.</p>'; });

function init() {
  document.title = D.title + ' · Learn French with Haresh Sir';
  $('#ptitle').textContent = D.title; $('#psub').textContent = D.code;
  S.ans = sget('fhl-ans-' + PID, {});
  au.src = PARTS()[0].src;
  $('#chap').innerHTML = D.chapters.map(c => `<option value="${c.t}">${esc(c.label)}</option>`).join('');
  $('#trChap').innerHTML = D.chapters.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join('');
  buildPages(); restoreAll(); applyUnlockFromSession();
  $('#back').onclick = () => { if (history.length > 1) history.back(); else location.href = '../'; };
}

/* ---------- pages ---------- */
function buildPages() {
  const host = $('#pages'); host.innerHTML = '<div id="pagesIn"></div>'; const inn = $('#pagesIn'); inn.style.width = S.zoom + '%';
  const W = D.W, H = D.H;
  D.pages.forEach(p => {
    const pg = document.createElement('div'); pg.className = 'pg'; pg.dataset.p = p;
    pg.innerHTML = `<img src="img/${PID}/p${p}.jpg" alt="Page ${p}" loading="lazy"><div class="ov"></div>`;
    const ov = pg.querySelector('.ov');
    D.q.filter(q => q.page === p).forEach(q => {
      q.boxes.forEach(b => {
        const e = document.createElement('button');
        e.className = q.kind === 'letter' ? 'lb' : 'bx'; e.dataset.n = q.n; e.dataset.l = b.L; e.setAttribute('aria-label', 'Question ' + q.n + (b.L !== '_' ? ' option ' + b.L : ''));
        e.style.left = b.x / W * 100 + '%'; e.style.top = b.y / H * 100 + '%'; e.style.width = b.w / W * 100 + '%'; e.style.height = b.h / H * 100 + '%';
        ov.appendChild(e);
      });
      const pl = document.createElement('div'); pl.className = 'pill'; pl.dataset.n = q.n;
      pl.style.right = (W - q.pill.x - 2) / W * 100 + '%'; pl.style.top = q.pill.y / H * 100 + '%';
      pl.innerHTML = '<button data-a="play" title="Play this part of the recording">▶</button><button data-a="dx" title="Show the distractors (wrong options)">🔍</button><button data-a="en" title="English meanings">🇬🇧</button>';
      ov.appendChild(pl);
    });
    inn.appendChild(pg);
  });
  inn.addEventListener('click', onPageClick);
}
function chosen(n) { const a = S.ans[n]; return Array.isArray(a) ? a : (a ? [a] : []); }
function restoreAll() {
  $$('.bx').forEach(b => b.classList.toggle('on', chosen(+b.dataset.n).includes(b.dataset.l)));
  $$('.lb').forEach(b => { const c = chosen(+b.dataset.n)[0]; b.textContent = c || ''; });
  paintReveal(); paintDx(); updScore();
}
function onPageClick(e) {
  const t = e.target.closest('button'); if (!t) { closePick(); return; }
  const n = +(t.dataset.n || (t.closest('.pill') || {}).dataset?.n);
  if (t.closest('.pill')) {
    const a = t.dataset.a; const q = byN(n);
    if (a === 'play') { jumpTo(q.ch); }
    if (a === 'dx') { toggleDx(n); }
    if (a === 'en') { openSheet(n, 'en'); }
    return;
  }
  const q = byN(n);
  if (t.classList.contains('lb')) { openPick(t, q); return; }
  let cur = chosen(n).slice(); const L = t.dataset.l;
  if (q.kind === 'two') { if (cur.includes(L)) cur = cur.filter(x => x !== L); else { cur.push(L); if (cur.length > 2) cur.shift(); } }
  else cur = cur.includes(L) ? [] : [L];
  S.ans[n] = cur; sset('fhl-ans-' + PID, S.ans); restoreAll();
}
function openPick(btn, q) {
  closePick(); const ov = btn.parentNode; const pk = document.createElement('div'); pk.className = 'lpick';
  pk.style.left = btn.style.left; pk.style.top = 'calc(' + btn.style.top + ' + 3.2cqw)';
  pk.innerHTML = 'ABCDEF'.split('').map(l => `<button data-l="${l}">${l}</button>`).join('') + '<button class="clr" data-l="">✕</button>';
  pk.onclick = ev => { const b = ev.target.closest('button'); if (!b) return; ev.stopPropagation(); S.ans[q.n] = b.dataset.l ? [b.dataset.l] : []; sset('fhl-ans-' + PID, S.ans); closePick(); restoreAll(); };
  ov.appendChild(pk);
}
function closePick() { $$('.lpick').forEach(p => p.remove()); }

/* ---------- distractors on the sheet ---------- */
function toggleDx(n) {
  const q = byN(n); const on = !S.dx[n];
  if (q.kind === 'letter') { Object.keys(S.dx).forEach(k => { if (byN(+k).kind === 'letter') delete S.dx[k]; }); }
  if (on) S.dx[n] = true; else delete S.dx[n];
  paintDx(); if (on) openSheet(n, 'dx'); else closeSheet();
  if (!$('#tr').hidden) renderTr(S.trCh);
}
function paintDx() {
  $$('.dxm').forEach(e => e.remove());
  $$('.pill').forEach(p => { const b = p.querySelector('[data-a=dx]'); b.classList.toggle('on', !!S.dx[+p.dataset.n]); });
  Object.keys(S.dx).forEach(k => {
    const q = byN(+k); const W = D.W, H = D.H;
    const pg = $(`.pg[data-p="${q.page}"] .ov`); if (!pg) return;
    if (q.kind === 'letter') {
      Object.entries(q.x).forEach(([L, x]) => { const r = D.stm && D.stm[L]; if (!r) return; addMark(pg, r, x.k); });
    } else {
      q.boxes.forEach(b => { const x = q.x[b.L]; if (!x) return; addMark(pg, [b.x - 1, b.y - 1, b.w + 2, b.h + 2], x.k, b.L); });
    }
  });
}
function addMark(ov, r, kind, L) {
  const d = document.createElement('div'); d.className = 'dxm ' + kind; const W = D.W, H = D.H;
  d.style.left = r[0] / W * 100 + '%'; d.style.top = r[1] / H * 100 + '%'; d.style.width = r[2] / W * 100 + '%'; d.style.height = r[3] / H * 100 + '%';
  d.textContent = kind === 'heard' ? '!' : '✗'; ov.appendChild(d);
}

/* ---------- bottom sheet ---------- */
const KIND = { none: 'Not mentioned', heard: 'Heard, but not the answer', opp: 'Says the opposite' };
function openSheet(n, tab) {
  S.sheetQ = n; S.tab = tab; const q = byN(n);
  $('#shTitle').innerHTML = `<b>Q${n}</b> ${esc(q.stem || (q.kind === 'two' ? 'Choose TWO correct statements' : ''))}`;
  $('#shTabs').innerHTML = `<button data-t="dx" class="${tab === 'dx' ? 'on' : ''}">🔍 Distractors</button><button data-t="en" class="${tab === 'en' ? 'on' : ''}">🇬🇧 Meanings</button>`;
  const b = $('#shBody');
  if (tab === 'en') {
    let h = '';
    if (q.stem) h += `<div class="hint"><b>${esc(q.stem)}</b><br>${esc(q.stem_en)}</div>`;
    else if (q.kind === 'two') h += '<div class="hint">Tick the <b>two</b> statements that are true.</div>';
    h += `<div class="hint" style="background:#fff8e6;border-color:var(--amber)">${q.pic ? 'Listen for the word shown under each picture.' : 'Listen for these ideas in the recording.'}</div>`;
    q.opts.forEach(o => { h += `<div class="opt"><span class="L">${o.L}</span><div><div class="fr">${esc(o.fr)}</div><div class="en">${esc(o.en)}</div></div></div>`; });
    b.innerHTML = h;
  } else {
    let h = '<div class="hint">' + (q.kind === 'two' ? 'These statements are <b>wrong</b>. Two others are right.' : 'These options are <b>wrong</b>. Which one is left?') + ' <small>(They are also marked on the paper.)</small></div>';
    if (!S.dx[n]) { S.dx[n] = true; paintDx(); }
    const L = q.opts.map(o => o.L).filter(l => q.x[l]);
    L.forEach(l => {
      const x = q.x[l], o = q.opts.find(o => o.L === l);
      h += `<div class="opt"><span class="L">${l}</span><div style="flex:1"><div class="fr">${esc(o.fr)}</div><div class="en">${esc(o.en)}</div><div>${esc(x.note)}</div>` +
        (x.quote ? `<div class="q">“${esc(x.quote)}”</div>` : '') +
        (x.hl ? `<button class="sbtn" data-sh="${l}">Show in transcript</button>` : '') + `</div><span class="b ${x.k}">${KIND[x.k]}</span></div>`;
    });
    if (S.key && S.key[n]) {
      const a = S.key[n].a;
      h += `<div class="hint" style="background:#effaf2;border-color:var(--green);margin-top:10px">✅ <b>Answer: ${a.join(' + ')}</b>` + (S.key[n].hl && S.key[n].hl.length ? ' <button class="sbtn" data-sh="*">Show the clue in the transcript</button>' : '') + '</div>';
    }
    b.innerHTML = h;
  }
  $('#sheet').hidden = false; document.body.classList.add('shOpen'); revealQ(n);
}
function closeSheet() { $('#sheet').hidden = true; document.body.classList.remove('shOpen'); }
function revealQ(n) {
  const q = byN(n); const sc = $('#pages'); let el = $(`.bx[data-n="${n}"],.lb[data-n="${n}"]`); if (q && q.kind === 'letter') el = $('.pg[data-p="' + q.page + '"]'); if (!el) return;
  const r = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
  sc.scrollTo({ top: sc.scrollTop + (r.top - sr.top) - (q && q.kind === 'letter' ? -(r.height * 0.43) : 150), behavior: 'smooth' });
}
$('#shX').onclick = () => { closeSheet(); };
$('#shTabs').onclick = e => { const t = e.target.closest('button'); if (t) openSheet(S.sheetQ, t.dataset.t); };
$('#shBody').onclick = e => {
  const b = e.target.closest('[data-sh]'); if (!b) return;
  const q = byN(S.sheetQ); showInTranscript(q, b.dataset.sh);
};
function showInTranscript(q, which) {
  if (S.exam) return; pauseAudio(); S.dx[q.n] = true; paintDx(); openTr(q.ch);
  setTimeout(() => { const t = which === '*' ? $('#trBody .ev') : $('#trBody .dq'); if (t) t.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80);
}

/* ---------- transcript ---------- */
function openTr(ch) { $('#tr').hidden = false; document.body.classList.add('trOpen'); renderTr(ch || S.trCh); }
function closeTr() { $('#tr').hidden = true; document.body.classList.remove('trOpen'); }
$('#trX').onclick = closeTr;
$('#trChap').onchange = e => renderTr(e.target.value);
const WRE = /aujourd’hui|[A-Za-zÀ-ÿŒœ0-9]+’?/g;
function renderTr(ch) {
  S.trCh = ch; $('#trChap').value = ch; const lines = D.tr[ch] || [];
  const rng = {}; const add = (li, s, e, c) => { (rng[li] = rng[li] || []).push([s, e, c]); };
  D.q.filter(q => q.ch === ch).forEach(q => {
    if (S.key && S.reveal && S.key[q.n]) S.key[q.n].hl.forEach(h => add(h[0], h[1], h[2], 'ev'));
    if (S.dx[q.n]) Object.values(q.x).forEach(x => { if (x.hl) add(x.hl[0], x.hl[1], x.hl[2], 'dq'); });
  });
  let h = '';
  lines.forEach((ln, li) => {
    if (ln.p) { h += `<div class="ps">⏸ ${esc(ln.p)}</div>`; return; }
    const t = ln.t, cls = new Array(t.length).fill('');
    (rng[li] || []).forEach(r => { for (let i = r[0]; i < r[1] && i < t.length; i++) cls[i] = r[2]; });
    let out = '', last = 0; const spans = [];
    t.replace(WRE, (m, off) => { spans.push([off, off + m.length]); return m; });
    const seg = (a, b) => { // plain run between words, split by highlight class
      let s = ''; let i = a; while (i < b) { let j = i; while (j < b && cls[j] === cls[i]) j++; s += cls[i] ? `<span class="${cls[i]}">${esc(t.slice(i, j))}</span>` : esc(t.slice(i, j)); i = j; } return s; };
    spans.forEach(([a, b]) => {
      out += seg(last, a);
      // word may straddle a highlight boundary: wrap each class-run of the word separately
      let i = a; while (i < b) { let j = i; while (j < b && cls[j] === cls[i]) j++; const wd = t.slice(a, b);
        out += `<span class="w ${cls[i]}" data-w="${esc(wd)}">${esc(t.slice(i, j))}</span>`; i = j; }
      last = b;
    });
    out += seg(last, t.length);
    const nar = ln.s === 'N';
    h += `<p class="ln ${nar ? 'nar' : ''}"><span class="sp">${nar ? '🎙' : esc(ln.s)}</span>${out}</p>`;
  });
  $('#trBody').innerHTML = h; $('#trBody').scrollTop = 0;
}
$('#trBody').addEventListener('click', e => { const w = e.target.closest('.w'); if (w) showPop(w.dataset.w, w); else hidePop(); });
function lookup(w) {
  const G = window.GLOSS || {}; let k = w.toLowerCase().replace(/’$/, '');
  if (w.toLowerCase() === 'aujourd’hui') k = 'aujourd’hui';
  if (G[k]) return G[k];
  for (const alt of [k.replace(/s$/, ''), k.replace(/x$/, ''), k.replace(/es$/, 'e')]) if (G[alt]) return G[alt];
  return null;
}
function showPop(w, el) {
  const g = lookup(w), p = $('#pop'); const r = el.getBoundingClientRect();
  p.innerHTML = g ? `<b>${esc(w)}</b> — ${esc(g[0])}<small>${esc(g[1] || '')}</small>` : `<b>${esc(w)}</b><small>No entry for this word yet.</small>`;
  p.hidden = false; const pw = p.offsetWidth, ph = p.offsetHeight;
  let x = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8), y = r.top - ph - 8; if (y < 8) y = r.bottom + 8;
  p.style.left = x + 'px'; p.style.top = y + 'px';
}
function hidePop() { $('#pop').hidden = true; }
document.addEventListener('scroll', hidePop, true);

/* ---------- audio (one recording, possibly stored as several parts) ---------- */
const PARTS = () => D.parts || [{ src: D.audio, start: 0 }];
let pIdx = 0;
const gt = () => PARTS()[pIdx].start + au.currentTime;
const gdur = () => D.dur || au.duration || 0;
function seekG(t, play) {
  const P = PARTS(); let i = 0; P.forEach((p, k) => { if (t >= p.start) i = k; });
  const was = play != null ? play : !au.paused, off = Math.max(0, t - P[i].start);
  if (i !== pIdx) { pIdx = i; au.src = P[i].src; const f = () => { au.removeEventListener('canplay', f); au.currentTime = off; if (was) au.play(); }; au.addEventListener('canplay', f); au.load(); }
  else { au.currentTime = off; if (was) au.play(); }
}
const bPlay = $('#bPlay');
function pauseAudio() { if (!S.exam) au.pause(); }
function jumpTo(ch) { if (S.exam) return; const c = D.chapters.find(c => c.id === ch); if (c) seekG(c.t, true); }
bPlay.onclick = () => { if (au.paused) au.play(); else if (!S.exam) au.pause(); };
au.addEventListener('play', () => { bPlay.textContent = S.exam ? '⏺' : '⏸'; if (S.exam) bPlay.disabled = true; hidePop(); });
au.addEventListener('pause', () => { bPlay.textContent = '▶'; });
au.addEventListener('ended', () => { const P = PARTS(); if (pIdx < P.length - 1) { seekG(P[pIdx + 1].start, true); return; } bPlay.textContent = '▶'; bPlay.disabled = false; });
au.addEventListener('timeupdate', () => {
  const d = gdur() || 1, t = gt(); $('#seek').value = t / d * 1000; $('#time').textContent = fmt(t) + ' / ' + fmt(d);
  const c = [...D.chapters].reverse().find(c => c.t <= t + 0.3); if (c && !S.exam && document.activeElement !== $('#chap')) $('#chap').value = c.t;
});
au.addEventListener('loadedmetadata', () => { $('#time').textContent = fmt(gt()) + ' / ' + fmt(gdur()); });
$('#seek').oninput = e => { if (!S.exam) seekG(e.target.value / 1000 * gdur()); };
$('#bBack').onclick = () => { seekG(Math.max(0, gt() - 10)); };
$('#bFwd').onclick = () => { seekG(Math.min(gdur(), gt() + 10)); };
$('#chap').onchange = e => { seekG(+e.target.value, true); };
$('#speed').onchange = e => { au.playbackRate = +e.target.value; };
$('#bTr').onclick = () => {
  if (S.exam) return; if (!$('#tr').hidden) { closeTr(); return; }
  au.pause(); const c = [...D.chapters].reverse().find(c => c.t <= gt() + 0.3) || D.chapters[0]; openTr(c.id);
};

/* ---------- practice / exam ---------- */
$('#btnMode').onclick = () => {
  if (S.exam) { setExam(false); return; }
  openModal(`<h3>🕑 Exam conditions</h3><p>The recording plays <b>once</b> from the start. You cannot pause, rewind, see the transcript or use the hints. Use this when you want to test yourself like the real exam.</p><div class="row"><button class="ghost" id="mNo">Not now</button><button class="primary" id="mYes">Start</button></div>`);
  $('#mNo').onclick = closeModal; $('#mYes').onclick = () => { closeModal(); setExam(true); };
};
function setExam(on) {
  S.exam = on; document.body.classList.toggle('exam', on); $('#btnMode').textContent = on ? '🕑 Exam' : '🎧 Practice'; $('#btnMode').classList.toggle('on', on);
  $('#examnote').hidden = !on; au.pause(); seekG(0, false); bPlay.disabled = false; bPlay.textContent = '▶';
  if (on) { closeTr(); closeSheet(); S.dx = {}; paintDx(); au.playbackRate = 1; $('#speed').value = '1'; }
}

/* ---------- zoom ---------- */
$('#btnZoomI').onclick = () => { S.zoom = Math.min(220, S.zoom + 20); $('#pagesIn').style.width = S.zoom + '%'; };
$('#btnZoomO').onclick = () => { S.zoom = Math.max(60, S.zoom - 20); $('#pagesIn').style.width = S.zoom + '%'; };

/* ---------- teacher unlock (the key is encrypted in the data file) ---------- */
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function tryCode(code) {
  const P = D.enc, enc = new TextEncoder(), salt = b64(P.salt);
  const base = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']);
  const kek = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  for (const w of P.w) {
    try {
      const K = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(w.iv) }, kek, b64(w.ct));
      const key = await crypto.subtle.importKey('raw', K, 'AES-GCM', false, ['decrypt']);
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(P.iv) }, key, b64(P.ct));
      return JSON.parse(new TextDecoder().decode(pt));
    } catch (e) { /* next */ }
  }
  return null;
}
function openModal(h) { $('#modalCard').innerHTML = h; $('#modal').hidden = false; }
function closeModal() { $('#modal').hidden = true; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
$('#btnLock').onclick = () => {
  if (S.key) {
    openModal(`<h3>🔓 Teacher mode</h3><label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="swR" ${S.reveal ? 'checked' : ''}> <span><b>Show the answers on the paper</b><br><small>Green = correct, red = a wrong tick.</small></span></label><div class="row"><button class="ghost" id="mC">Close</button><button class="ghost" id="mL">Lock again</button></div>`);
    $('#swR').onchange = e => setReveal(e.target.checked); $('#mC').onclick = closeModal;
    $('#mL').onclick = () => { S.key = null; setReveal(false); try { sessionStorage.removeItem('fhl-key-' + PID); } catch (e) { /* none */ } $('#btnLock').textContent = '🔒'; $('#btnCheck').hidden = true; closeModal(); };
    return;
  }
  openModal(`<h3>🔒 Teacher code</h3><p>Enter the code to see the official answers.</p><input type="password" id="code" autocomplete="off" placeholder="Code"><div class="err" id="err"></div><div class="row"><button class="ghost" id="mC">Cancel</button><button class="primary" id="mG">Unlock</button></div>`);
  $('#mC').onclick = closeModal;
  const go = async () => {
    $('#err').textContent = 'Checking…';
    try { const K = await tryCode($('#code').value.trim()); if (!K) { $('#err').textContent = 'That code does not open this paper.'; return; }
      S.key = K; try { sessionStorage.setItem('fhl-key-' + PID, JSON.stringify(K)); } catch (e) { /* none */ } afterUnlock(); closeModal(); setReveal(true);
    } catch (e) { $('#err').textContent = 'This browser cannot check codes here.'; }
  };
  $('#mG').onclick = go; $('#code').onkeydown = e => { if (e.key === 'Enter') go(); }; setTimeout(() => $('#code').focus(), 50);
};
function applyUnlockFromSession() { try { const v = sessionStorage.getItem('fhl-key-' + PID); if (v) { S.key = JSON.parse(v); afterUnlock(); } } catch (e) { /* none */ } }
function afterUnlock() { $('#btnLock').textContent = '🔓'; $('#btnCheck').hidden = false; }
function setReveal(on) { S.reveal = on; paintReveal(); updScore(); if (!$('#tr').hidden) renderTr(S.trCh); }
function paintReveal() {
  $$('.bx,.lb').forEach(b => b.classList.remove('right', 'wrong')); $$('.lbans').forEach(e => e.remove());
  if (!S.reveal || !S.key) return;
  $$('.bx').forEach(b => { const n = +b.dataset.n, k = S.key[n]; if (!k) return; const on = chosen(n).includes(b.dataset.l), ok = k.a.includes(b.dataset.l);
    if (ok) b.classList.add('right'); else if (on) b.classList.add('wrong'); });
  $$('.lb').forEach(b => { const n = +b.dataset.n, k = S.key[n]; if (!k) return; const c = chosen(n)[0]; b.classList.add(c === k.a[0] ? 'right' : 'wrong');
    if (c !== k.a[0]) { const s = document.createElement('div'); s.className = 'lbans'; s.textContent = '= ' + k.a[0]; s.style.left = (parseFloat(b.style.left) + parseFloat(b.style.width) + 1) + '%'; s.style.top = b.style.top; b.parentNode.appendChild(s); } });
}
function score() { let s = 0, tot = 0; D.q.forEach(q => { const k = S.key && S.key[q.n]; if (!k) return; tot += k.a.length; chosen(q.n).forEach(l => { if (k.a.includes(l)) s++; }); }); return [s, tot]; }
function updScore() { /* header badge only after unlock */ const b = $('#btnCheck'); if (S.key) { const [s, t] = score(); b.textContent = '📋 ' + s + '/' + t; } }

/* ---------- check my answers ---------- */
$('#btnCheck').onclick = () => {
  if (!S.key) return; const [s, t] = score(); let h = `<h3>📋 My answers: ${s} / ${t}</h3><p><small>Wrong answers are explained from the recording. Tap “Show in transcript” to hear where the clue is.</small></p>`;
  D.q.forEach(q => {
    const k = S.key[q.n]; if (!k) return; const mine = chosen(q.n); const okAll = mine.length === k.a.length && mine.every(l => k.a.includes(l));
    let inner = `<div class="h">Q${q.n} ${okAll ? '✅' : '❌'} <small>Your answer: ${mine.length ? mine.join(' + ') : '—'} · Correct: ${k.a.join(' + ')}</small></div>`;
    mine.filter(l => !k.a.includes(l)).forEach(l => { const x = q.x[l]; if (x) inner += `<div style="margin-top:3px">“${l}” is wrong. ${esc(x.note)}${x.quote ? ' <i>“' + esc(x.quote) + '”</i>' : ''}</div>`; });
    if (!mine.length) inner += '<div style="margin-top:3px">No answer given.</div>';
    h += `<div class="ck ${okAll ? 'good' : 'bad'}">${inner}</div>`;
  });
  h += '<div class="row"><button class="primary" id="mC">Close</button></div>'; openModal(h); $('#mC').onclick = closeModal;
};
document.addEventListener('click', e => { if (!e.target.closest('#pop') && !e.target.closest('.w')) hidePop(); });
if (location.hostname === 'localhost') window.__t = { S, get D() { return D; }, setKey(k) { S.key = k; afterUnlock(); setReveal(true); } };
})();
