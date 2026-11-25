(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const PID = new URLSearchParams(location.search).get('p') || 'w25_11';
const au = $('#au');
const S = { ans: {}, dx: {}, key: null, reveal: false, exam: false, zoom: 100, trCh: 'c1', noHelp: false, prepared: false };
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

/* ---------- chunks (orange dotted = read as one phrase) ---------- */
const nrm = t => t.toLowerCase().replace(/'/g, '’').replace(/[^a-zà-ÿœ’0-9-]/g, '');
let PT = null;
function phraseTokens() { if (!PT) PT = (D.phr || []).map((p, i) => ({ i, t: p[0].split(/\s+/).map(nrm).filter(Boolean) })).sort((a, b) => b.t.length - a.t.length); return PT; }
function pageChunks(p) { // word index -> phrase index
  const ws = D.words[p] || [], idx = [], tk = []; ws.forEach((w, i) => { const t = nrm(w[0]); if (t) { idx.push(i); tk.push(t); } }); const m = {};
  phraseTokens().forEach(ph => {
    for (let i = 0; i + ph.t.length <= tk.length; i++) {
      let ok = true; for (let j = 0; j < ph.t.length; j++) if (tk[i + j] !== ph.t[j] || m[idx[i + j]] != null) { ok = false; break; }
      if (ok) for (let j = 0; j < ph.t.length; j++) m[idx[i + j]] = ph.i;
    }
  });
  return m;
}
function drawChunks(p, ov) {
  const ws = D.words[p] || [], m = pageChunks(p); S.pc = S.pc || {}; S.pc[p] = m;
  let run = null; const flush = () => { if (!run) return; const u = document.createElement('u'); u.className = 'ph'; u.dataset.ph = run.ph; u.setAttribute('role', 'button'); u.title = 'Tap for the meaning of this phrase';
    u.style.left = run.x0 / D.W * 100 + '%'; u.style.width = (run.x1 - run.x0) / D.W * 100 + '%'; u.style.top = (run.y1 - 4) / D.H * 100 + '%'; u.style.height = 11 / D.H * 100 + '%'; ov.appendChild(u); run = null; };
  ws.forEach((w, i) => {
    if (m[i] == null) { flush(); return; }
    if (run && run.ph === m[i] && Math.abs(w[4] - run.y1) < 3) { run.x1 = w[3]; }
    else { flush(); run = { ph: m[i], x0: w[1], x1: w[3], y1: w[4] }; }
    if (m[i + 1] !== m[i]) flush();
  });
  flush();
}
/* ---------- pages ---------- */
function buildPages() {
  const host = $('#pages'); host.innerHTML = '<div id="legend">🟠 <b>Orange dotted line</b> = a phrase (read it as one chunk): tap the <b>line</b> for the phrase meaning · tap a <b>word</b> for that word only.</div><div id="pagesIn"></div>'; const inn = $('#pagesIn'); inn.style.width = S.zoom + '%';
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
      pl.innerHTML = '<button data-a="play" title="Play this part of the recording">▶</button><button data-a="dx" title="Show the distractors (wrong options)">🔍</button><button data-a="tr" title="Pause and read the transcript for this question">📄</button>';
      ov.appendChild(pl);
    });
    drawChunks(p, ov); inn.appendChild(pg);
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
  const uu = e.target.closest && e.target.closest('u.ph'); if (uu) { if (aid()) showChunk(+uu.dataset.ph, uu); return; }
  const t = e.target.closest('button'); if (!t) { closePick(); const pg = e.target.closest('.pg'); if (pg) pagePointer(e, pg, false); return; }
  if (t.dataset.a === 'again') { const q = byN(+t.dataset.n); if (S.exam) return; jumpTo(q.ch); return; }
  if (t.dataset.a === 'trq') { const q = byN(+t.dataset.n); if (S.exam) return; au.pause(); openTr(q.ch); return; }
  if (t.dataset.a === 'cx') { const c = t.closest('.dxc'); delete S.dx[+c.dataset.n]; paintDx(); if (!$('#tr').hidden) renderTr(S.trCh); return; }
  const n = +(t.dataset.n || (t.closest('.pill') || {}).dataset?.n);
  if (t.closest('.pill')) {
    const a = t.dataset.a; const q = byN(n);
    if (a === 'play') { jumpTo(q.ch); }
    if (a === 'dx') { toggleDx(n); }
    if (a === 'tr') { if (aid()) { au.pause(); S.dx[n] = true; paintDx(); openTr(q.ch); setTimeout(() => { const t = $('#trBody .dq'); if (t) t.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80); } }
    if (a === 'sh') { return; }
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
  paintDx();
  if (!$('#tr').hidden) renderTr(S.trCh);
}
function paintDx() {
  $$('.dxm,.dxc').forEach(e => e.remove());
  $$('.pill').forEach(p => { const b = p.querySelector('[data-a=dx]'); b.classList.toggle('on', !!S.dx[+p.dataset.n]); });
  Object.keys(S.dx).forEach(k => {
    const q = byN(+k); const pg = $(`.pg[data-p="${q.page}"] .ov`); if (!pg) return;
    addCallout(pg, q); return;
    q.dx.forEach(d => {
      if (!d.L) return;
      if (q.kind === 'letter') { const r = D.stm && D.stm[d.L]; if (r) addMark(pg, r, d.kind); }
      else { const b = q.boxes.find(b => b.L === d.L); if (b) addMark(pg, [b.x - 1, b.y - 1, b.w + 2, b.h + 2], d.kind); }
    });
  });
}
function addMark(ov, r, kind) {
  const d = document.createElement('div'); d.className = 'dxm ' + (kind === 'none' ? 'nomen' : 'heard'); const W = D.W, H = D.H;
  d.style.left = r[0] / W * 100 + '%'; d.style.top = r[1] / H * 100 + '%'; d.style.width = r[2] / W * 100 + '%'; d.style.height = r[3] / H * 100 + '%';
  d.textContent = kind === 'none' ? '∅' : '⚠'; ov.appendChild(d);
}

/* ---------- distractor callout, next to the question ---------- */
function addCallout(ov, q) {
  const pl = ov.querySelector(`.pill[data-n="${q.n}"]`); if (!pl) return;
  const c = document.createElement('div'); c.className = 'dxc'; c.dataset.n = q.n;
  c.style.right = pl.style.right; c.style.top = `calc(${pl.style.top} + 4.4cqw)`;
  const row = (d, tag, chip) => `<div class="it">${chip && d.L && d.L !== '_' ? `<span class="L ${tag}">${d.L}</span>` : ''}<span class="en">${esc(d.note)}${d.quote ? ` <i>“${esc(d.quote)}”</i>` : ''}</span><span class="fr">🇫🇷 ${esc(d.fr || '')}</span></div>`;
  const heard = q.dx.filter(d => d.kind !== 'none'), none = q.dx.filter(d => d.kind === 'none');
  let h = '<b>⚠ Possible distractors <span class="sub">(heard but not related to the question)</span></b><span class="sub">Les pièges : mots entendus mais sans rapport avec la question</span>';
  if (heard.length) heard.forEach(d => { h += row(d, 'hd', q.kind === 'letter'); }); else if (!none.length) h += '<div class="it"><span class="en">No tricky word here. Listen for the key idea.</span><span class="fr">🇫🇷 Pas de mot piège ici. Écoutez l’idée principale.</span></div>';
  if (none.length) h += '<div class="it nn2"><span class="en">Some of the options are never mentioned in the recording at all.</span><span class="fr">🇫🇷 Certaines options ne sont jamais mentionnées dans l’enregistrement.</span></div>';
  const k = S.key && S.key[q.n];
  if (k && S.reveal) {
    h += `<b class="ok">✅ Answer: ${k.a.join(' + ')}</b>`;
    q.opts.filter(o => !k.a.includes(o.L)).forEach(o => { if (q.dx.some(d => d.L === o.L) && !(k.x[o.L] && k.x[o.L].k !== 'none')) return; const x = (k.x || {})[o.L]; if (x) h += row({ L: o.L, note: x.note, fr: x.fr, quote: x.quote }, x.k === 'none' ? 'nm' : 'hd', true); });
  }
  h += `<div class="acts"><button data-a="again" data-n="${q.n}">🔁 Listen again · Réécouter</button><button data-a="trq" data-n="${q.n}">📄 Transcript</button></div>`;
  c.innerHTML = h + '<button class="cx" data-a="cx">✕</button>'; ov.appendChild(c);
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
    const t = ln.t, cls = new Array(t.length).fill(''), pcl = new Array(t.length).fill(-1);
    phraseTokens().forEach(ph => { const src = D.phr[ph.i][0]; const re = new RegExp('(?<![A-Za-zÀ-ÿŒœ’])' + src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/’/g, "['’]").replace(/\s+/g, '\\s+') + '(?![A-Za-zÀ-ÿŒœ’])', 'ig'); let m;
      while ((m = re.exec(t))) { if (pcl.slice(m.index, m.index + m[0].length).some(v => v >= 0)) continue; for (let i = m.index; i < m.index + m[0].length; i++) pcl[i] = ph.i; } });
    (rng[li] || []).forEach(r => { for (let i = r[0]; i < r[1] && i < t.length; i++) cls[i] = r[2]; });
    let out = '', last = 0; const spans = [];
    t.replace(WRE, (m, off) => { spans.push([off, off + m.length]); return m; });
    const key = i => cls[i] + '|' + pcl[i]; const pieces = [];
    const wrap = (i, j, word, isW) => { const c = cls[i]; const base = [isW ? 'w' : '', c].filter(Boolean).join(' '); const tx = esc(t.slice(i, j));
      pieces.push([pcl[i], isW ? `<span class="${base}" data-w="${esc(word)}">${tx}</span>` : (base ? `<span class="${base}">${tx}</span>` : tx)]); };
    const seg = (a, b) => { let i = a; while (i < b) { let j = i; while (j < b && key(j) === key(i)) j++; wrap(i, j, '', false); i = j; } };
    spans.forEach(([a, b]) => {
      seg(last, a);
      let i = a; while (i < b) { let j = i; while (j < b && key(j) === key(i)) j++; wrap(i, j, t.slice(a, b), true); i = j; }
      last = b;
    });
    seg(last, t.length);
    for (let k = 0; k < pieces.length;) { const p0 = pieces[k][0]; if (p0 < 0) { out += pieces[k][1]; k++; continue; } let e = k, inner = ''; while (e < pieces.length && pieces[e][0] === p0) { inner += pieces[e][1]; e++; } out += `<span class="ck" data-ph="${p0}">${inner}</span>`; k = e; }
    const nar = ln.s === 'N';
    h += `<p class="ln ${nar ? 'nar' : ''}"><span class="sp">${nar ? '🎙' : esc(ln.s)}</span>${out}</p>`;
  });
  $('#trBody').innerHTML = h; $('#trBody').scrollTop = 0;
}
$('#trBody').addEventListener('click', e => { const w = e.target.closest('.w'); if (w) { if (aid()) showPop(w.dataset.w, w); return; } const ck = e.target.closest('.ck'); if (ck) { if (aid()) showChunk(+ck.dataset.ph, ck); } else hidePop(); });
function lookup(w) {
  const G = window.GLOSS || {}; let k = w.toLowerCase().replace(/’$/, '');
  if (w.toLowerCase() === 'aujourd’hui') k = 'aujourd’hui';
  if (G[k]) return G[k];
  for (const alt of [k.replace(/s$/, ''), k.replace(/x$/, ''), k.replace(/es$/, 'e')]) if (G[alt]) return G[alt];
  return null;
}
function showWord(w, el) { showPop(w, el); }
function showChunk(i, el) { const ph = D.phr[i]; showPopHtml(`<div class="pb">🔗 <b>${esc(ph[0])}</b></div>= ${esc(ph[1])}<small>Phrase · read it as one chunk</small>`, el); }
function showPopHtml(html, el) { const p = $('#pop'); const r = el.getBoundingClientRect(); p.innerHTML = html; place(p, r); }
function place(p, r) { p.hidden = false; const pw = p.offsetWidth, phh = p.offsetHeight; let x = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8), y = r.top - phh - 8; if (y < 8) y = r.bottom + 8; p.style.left = x + 'px'; p.style.top = y + 'px'; }
function showPop(w, el) {
  const g = lookup(w), p = $('#pop'); const r = el.getBoundingClientRect();
  p.innerHTML = (g ? `<b>${esc(w)}</b> — ${esc(g[0])}<small>${esc(g[1] || '')}</small>` : `<b>${esc(w)}</b><small>No entry for this word yet.</small>`);
  p.hidden = false; const pw = p.offsetWidth, phh = p.offsetHeight;
  let x = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8), y = r.top - phh - 8; if (y < 8) y = r.bottom + 8;
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
  if (on) { closeTr(); au.playbackRate = 1; $('#speed').value = '1'; }
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
  paintDx();
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
    mine.filter(l => !k.a.includes(l)).forEach(l => { const x = (k.x || {})[l]; if (x) inner += `<div style="margin-top:3px">“${l}” is wrong. ${esc(x.note)}${x.quote ? ' <i>“' + esc(x.quote) + '”</i>' : ''}<br><small>🇫🇷 ${esc(x.fr || '')}</small></div>`; });
    if (!mine.length) inner += '<div style="margin-top:3px">No answer given.</div>';
    h += `<div class="ck ${okAll ? 'good' : 'bad'}">${inner}</div>`;
  });
  h += '<div class="row"><button class="primary" id="mC">Close</button></div>'; openModal(h); $('#mC').onclick = closeModal;
};
document.addEventListener('click', e => { if (e.target.closest('#pop') || e.target.closest('.w')) return; if (e.target.closest('.pg') && !e.target.closest('button')) return; hidePop(); });
if (location.hostname === 'localhost') window.__t = { S, get D() { return D; }, setKey(k) { S.key = k; afterUnlock(); setReveal(true); } };
})();
