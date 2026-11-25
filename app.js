(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const PID = new URLSearchParams(location.search).get('p') || 'w25_11';
const au = $('#au');
const S = { ans: {}, dx: {}, key: null, reveal: false, exam: false, zoom: 100, trCh: 'c1', sheetQ: 0, tab: 'dx', noHelp: false, prepared: false };
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
  buildPages(); restoreAll(); applyUnlockFromSession(); initHelp();
  $('#back').onclick = () => { if (history.length > 1) history.back(); else location.href = '../'; };
}

/* ---------- helpers budget: aids (word meanings, picture words, distractors, English) work on D.helpMax papers per session ---------- */
const HK = 'fhl-help';
function helpSet() { try { return JSON.parse(sessionStorage.getItem(HK) || '[]'); } catch (e) { return []; } }
function helpSave(a) { try { sessionStorage.setItem(HK, JSON.stringify(a)); } catch (e) { /* none */ } }
function initHelp() {
  const hs = helpSet(); S.noHelp = !S.key && hs.length >= (D.helpMax || 2) && !hs.includes(PID);
  $('#helpnote').hidden = !S.noHelp; if (S.noHelp) lockedChoice(true);
}
function aid() { // true when an aid may be used right now; the first aid on a paper uses up one of the session's papers
  if (S.key) return true;
  if (S.noHelp) { lockedChoice(false); return false; }
  const hs = helpSet(); if (!hs.includes(PID)) { hs.push(PID); helpSave(hs); }
  return true;
}
function lockedChoice(first) {
  openModal(`<h3>🔒 Helpers used up for this session</h3>
    <p>You have already used the helpers (word meanings, picture words, distractors) on <b>${D.helpMax || 2} papers</b> in this session. For this paper you can choose:</p>
    <div class="row" style="flex-direction:column;align-items:stretch">
      <button class="primary" id="mPrep">📚 Prepare first: study the meanings and possible distractors, then do the paper on your own</button>
      <button class="ghost" id="mAlone">▶ Do the paper on my own now</button></div>`);
  $('#mPrep').onclick = () => { closeModal(); openPrep(); }; $('#mAlone').onclick = closeModal;
}
function openPrep() {
  S.prepared = true; let h = '<h3>📚 Prepare for this paper</h3><p><small>Read this, then close it and do the paper on your own. The helpers on the paper stay locked.</small></p>';
  D.q.forEach(q => {
    h += `<div class="ck"><div class="h">Q${q.n} ${esc(q.stem || (q.kind === 'two' ? 'Choose TWO correct statements' : ''))}</div>`;
    if (q.stem_en) h += `<small>${esc(q.stem_en)}</small>`;
    h += '<div style="margin-top:4px">' + q.opts.map(o => `<div><b>${o.L}</b> ${esc(o.fr)} <small>— ${esc(o.en)}</small></div>`).join('') + '</div>';
    if (q.dx.length) h += '<div class="hint" style="margin-top:6px;background:#fff4e0;border-color:var(--orange)">' + q.dx.map(d => '⚠ ' + (d.L ? '<b>' + d.L + '</b> · ' : '') + esc(d.note)).join('<br>') + '</div>';
    else h += '<div class="hint" style="margin-top:6px;background:#fff4e0;border-color:var(--orange)">⚠ No tricky word here. Listen for the key idea.</div>';
    h += '</div>';
  });
  h += '<div class="row"><button class="primary" id="mC">Start the paper</button></div>'; openModal(h); $('#mC').onclick = closeModal;
}
$('#helpnote').onclick = () => lockedChoice(false);

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
  inn.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const pg = e.target.closest && e.target.closest('.pg'); if (!pg || e.target.closest('button')) return; const [x, y] = ptOf(e, pg); const pc = picAt(+pg.dataset.p, x, y);
    if (pc && S.lastPic !== pc.n + pc.L) { S.lastPic = pc.n + pc.L; pagePointer(e, pg, true); } else if (!pc && S.lastPic) { S.lastPic = null; hidePop(); $$('.whl').forEach(x => x.remove()); } });
}
function chosen(n) { const a = S.ans[n]; return Array.isArray(a) ? a : (a ? [a] : []); }
function restoreAll() {
  $$('.bx').forEach(b => b.classList.toggle('on', chosen(+b.dataset.n).includes(b.dataset.l)));
  $$('.lb').forEach(b => { const c = chosen(+b.dataset.n)[0]; b.textContent = c || ''; });
  paintReveal(); paintDx(); updScore();
}
function ptOf(e, pg) { const r = pg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * D.W, (e.clientY - r.top) / r.height * D.H, r]; }
function picAt(p, x, y) { return (D.pics || []).find(c => c.p === p && x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h); }
function wordAt(p, x, y) {
  let best = null, ba = 1e9;
  (D.words[p] || []).forEach(w => { if (x >= w[1] - 1.2 && x <= w[3] + 1.2 && y >= w[2] - 1.2 && y <= w[4] + 1.2) { const a = (w[3] - w[1]) * (w[4] - w[2]); if (a < ba) { ba = a; best = w; } } });
  return best;
}
function flash(pg, x0, y0, x1, y1) {
  $$('.whl').forEach(e => e.remove()); const ov = pg.querySelector('.ov'), d = document.createElement('div'); d.className = 'whl';
  d.style.left = x0 / D.W * 100 + '%'; d.style.top = y0 / D.H * 100 + '%'; d.style.width = (x1 - x0) / D.W * 100 + '%'; d.style.height = (y1 - y0) / D.H * 100 + '%'; ov.appendChild(d); return d;
}
function pagePointer(e, pg, hover) {
  const p = +pg.dataset.p, [x, y] = ptOf(e, pg);
  const pc = picAt(p, x, y);
  if (pc) { if (!aid()) return; const el = flash(pg, pc.x, pc.y, pc.x + pc.w, pc.y + pc.h); showPopHtml(`<b>${esc(pc.fr)}</b> — ${esc(pc.en)}<small>Picture ${pc.L} · the word you may hear</small>`, el); return; }
  if (hover) return;
  const w = wordAt(p, x, y); if (!w) { hidePop(); return; }
  if (!aid()) return;
  // choose the part of a word with an apostrophe or hyphen that was clicked
  const raw = w[0].replace(/^[^A-Za-zÀ-ÿŒœ’]+|[^A-Za-zÀ-ÿŒœ’]+$/g, ''); const frac = Math.min(.999, Math.max(0, (x - w[1]) / Math.max(1, w[3] - w[1])));
  const parts = raw.split(/(?<=’)|-/).filter(Boolean); let acc = 0, pick = parts[0] || raw; const tot = raw.length;
  for (const pt of parts) { acc += pt.length; if (frac * tot < acc) { pick = pt; break; } }
  const el = flash(pg, w[1], w[2], w[3], w[4]); showWord(raw.toLowerCase().includes('aujourd’hui') ? 'aujourd’hui' : pick, el);
}
function onPageClick(e) {
  const t = e.target.closest('button'); if (!t) { closePick(); const pg = e.target.closest('.pg'); if (pg) pagePointer(e, pg, false); return; }
  const n = +(t.dataset.n || (t.closest('.pill') || {}).dataset?.n);
  if (t.closest('.pill')) {
    const a = t.dataset.a; const q = byN(n);
    if (a === 'play') { jumpTo(q.ch); }
    if (a === 'dx') { toggleDx(n); }
    if (a === 'en') { if (aid()) openSheet(n, 'en'); }
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

/* ---------- possible distractors (heard but not related to the question) ---------- */
function toggleDx(n) {
  const q = byN(n); const on = !S.dx[n];
  if (on && !aid()) return;
  if (q.kind === 'letter') { Object.keys(S.dx).forEach(k => { if (byN(+k).kind === 'letter') delete S.dx[k]; }); }
  if (on) S.dx[n] = true; else delete S.dx[n];
  paintDx(); if (on) openSheet(n, 'dx'); else closeSheet();
  if (!$('#tr').hidden) renderTr(S.trCh);
}
function paintDx() {
  $$('.dxm').forEach(e => e.remove());
  $$('.pill').forEach(p => { const b = p.querySelector('[data-a=dx]'); b.classList.toggle('on', !!S.dx[+p.dataset.n]); });
  Object.keys(S.dx).forEach(k => {
    const q = byN(+k); const pg = $(`.pg[data-p="${q.page}"] .ov`); if (!pg) return;
    q.dx.forEach(d => {
      if (!d.L) return;
      if (q.kind === 'letter') { const r = D.stm && D.stm[d.L]; if (r) addMark(pg, r); }
      else { const b = q.boxes.find(b => b.L === d.L); if (b) addMark(pg, [b.x - 1, b.y - 1, b.w + 2, b.h + 2]); }
    });
  });
}
function addMark(ov, r) {
  const d = document.createElement('div'); d.className = 'dxm heard'; const W = D.W, H = D.H;
  d.style.left = r[0] / W * 100 + '%'; d.style.top = r[1] / H * 100 + '%'; d.style.width = r[2] / W * 100 + '%'; d.style.height = r[3] / H * 100 + '%';
  d.textContent = '⚠'; ov.appendChild(d);
}

/* ---------- bottom sheet ---------- */
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
    let h = '<div class="hint" style="background:#fff4e0;border-color:var(--orange)"><b>⚠ Possible distractors</b><br>Words you will hear that sound right but are <b>not</b> the answer to this question.</div>';
    if (!S.dx[n]) { S.dx[n] = true; paintDx(); }
    if (!q.dx.length) h += '<div class="opt"><span class="L">✓</span><div>No tricky word in this question. Listen for the key idea and tick what you hear.</div></div>';
    q.dx.forEach((d, i) => {
      const o = d.L ? q.opts.find(o => o.L === d.L) : null;
      h += `<div class="opt"><span class="L">${d.L || '⚠'}</span><div style="flex:1">${o ? `<div class="fr">${esc(o.fr)}</div><div class="en">${esc(o.en)}</div>` : ''}<div>${esc(d.note)}</div>` +
        (d.quote ? `<div class="q">“${esc(d.quote)}”</div>` : '') + (d.hl && !S.exam ? `<button class="sbtn" data-sh="${i}">Show in transcript</button>` : '') + `</div><span class="b heard">Possible distractor</span></div>`;
    });
    if (S.key && S.key[n]) {
      const a = S.key[n].a;
      h += `<div class="hint" style="background:#effaf2;border-color:var(--green);margin-top:10px">✅ <b>Answer: ${a.join(' + ')}</b>` + (S.key[n].hl && S.key[n].hl.length && !S.exam ? ' <button class="sbtn" data-sh="*">Show the clue in the transcript</button>' : '') + '</div>';
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
$('#shTabs').onclick = e => { const t = e.target.closest('button'); if (!t) return; if (t.dataset.t === 'dx') { if (!aid()) return; } else if (!aid()) return; openSheet(S.sheetQ, t.dataset.t); };
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
    if (S.dx[q.n]) q.dx.forEach(x => { if (x.hl) add(x.hl[0], x.hl[1], x.hl[2], 'dq'); });
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
$('#trBody').addEventListener('click', e => { const w = e.target.closest('.w'); if (w) { if (aid()) showPop(w.dataset.w, w); } else hidePop(); });
function lookup(w) {
  const G = window.GLOSS || {}; let k = w.toLowerCase().replace(/’$/, '');
  if (w.toLowerCase() === 'aujourd’hui') k = 'aujourd’hui';
  if (G[k]) return G[k];
  for (const alt of [k.replace(/s$/, ''), k.replace(/x$/, ''), k.replace(/es$/, 'e')]) if (G[alt]) return G[alt];
  return null;
}
function showWord(w, el) { showPop(w, el); }
function showPopHtml(html, el) { const p = $('#pop'); const r = el.getBoundingClientRect(); p.innerHTML = html; place(p, r); }
function place(p, r) { p.hidden = false; const pw = p.offsetWidth, ph = p.offsetHeight; let x = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8), y = r.top - ph - 8; if (y < 8) y = r.bottom + 8; p.style.left = x + 'px'; p.style.top = y + 'px'; }
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
  openModal(`<h3>🕑 Exam conditions</h3><p>The recording plays <b>once</b> from the start. You cannot pause, rewind or read the transcript. The helpers (word meanings, picture words, distractors) still work, within your two helped papers per session.</p><div class="row"><button class="ghost" id="mNo">Not now</button><button class="primary" id="mYes">Start</button></div>`);
  $('#mNo').onclick = closeModal; $('#mYes').onclick = () => { closeModal(); setExam(true); };
};
function setExam(on) {
  S.exam = on; document.body.classList.toggle('exam', on); $('#btnMode').textContent = on ? '🕑 Exam' : '🎧 Practice'; $('#btnMode').classList.toggle('on', on);
  $('#examnote').hidden = !on; au.pause(); seekG(0, false); bPlay.disabled = false; bPlay.textContent = '▶';
  if (on) { closeTr(); closeSheet(); au.playbackRate = 1; $('#speed').value = '1'; }
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
    openModal(`<h3>🔓 Teacher mode</h3><label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="swR" ${S.reveal ? 'checked' : ''}> <span><b>Show the answers on the paper</b><br><small>Green = correct, red = a wrong tick.</small></span></label><div class="row"><button class="ghost" id="mRs">Reset helper count</button><button class="ghost" id="mC">Close</button><button class="ghost" id="mL">Lock again</button></div>`);
    $('#mRs').onclick = () => { helpSave([]); closeModal(); };
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
function afterUnlock() { $('#btnLock').textContent = '🔓'; $('#btnCheck').hidden = false; S.noHelp = false; $('#helpnote').hidden = true; }
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
    mine.filter(l => !k.a.includes(l)).forEach(l => { const x = (k.x || {})[l]; if (x) inner += `<div style="margin-top:3px">“${l}” is wrong. ${esc(x.note)}${x.quote ? ' <i>“' + esc(x.quote) + '”</i>' : ''}</div>`; });
    if (!mine.length) inner += '<div style="margin-top:3px">No answer given.</div>';
    h += `<div class="ck ${okAll ? 'good' : 'bad'}">${inner}</div>`;
  });
  h += '<div class="row"><button class="primary" id="mC">Close</button></div>'; openModal(h); $('#mC').onclick = closeModal;
};
document.addEventListener('click', e => { if (e.target.closest('#pop') || e.target.closest('.w')) return; if (e.target.closest('.pg') && !e.target.closest('button')) return; hidePop(); });
if (location.hostname === 'localhost') window.__t = { S, get D() { return D; }, setKey(k) { S.key = k; afterUnlock(); setReveal(true); } };
})();
