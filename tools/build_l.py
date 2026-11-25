# -*- coding: utf-8 -*-
from dxfr_w25_11 import FRX, FRDX, NONE as NONE_FR
from syn_w25_11 import SYN
import re, json, os, sys, subprocess, shutil
sys.path.insert(0, '/home/claude/build/L')
import pymupdf
from qdata_w25_11 import Q, CHAPTERS, ANS_MS, DX
PID = 'w25_11'
OUT = '/home/claude/build/L/app'
os.makedirs(f'{OUT}/img/{PID}', exist_ok=True); os.makedirs(f'{OUT}/data', exist_ok=True); os.makedirs(f'{OUT}/audio', exist_ok=True)
W, H = 595.276, 841.89
# ---- answers check
for q in Q:
    assert '/'.join(q['ans']) == ANS_MS[q['n']], (q['n'], q['ans'], ANS_MS[q['n']])
    for L in q['opts']:
        if L not in q['ans']: assert L in q['x'] or q['kind'] == 'letter', ('missing distractor', q['n'], L)
# ---- geometry
PIC = {1:(3,323.7),2:(3,561.9),3:(4,232.7),4:(4,470.9),5:(4,709.1),6:(5,232.7),7:(5,470.9),8:(5,709.1),9:(6,326.7),10:(6,533.9),11:(6,740.1),12:(7,206.7),13:(7,418.9),14:(7,631.1)}
PX = [137.5, 236.7, 335.9, 435.1]
TXT = {20:(9,286.4,[240.6,275.1,309.6]),21:(9,286.4,[391.9,426.4,460.9]),22:(9,286.4,[543.1,577.6,612.1]),
 23:(10,286.4,[84.6,119.1,153.6]),24:(10,286.4,[235.9,270.4,304.9]),25:(10,286.4,[491.1,525.6,560.1]),26:(10,286.4,[642.4,676.9,711.4]),
 27:(11,286.4,[84.6,119.1,153.6]),28:(11,286.4,[235.9,270.4,304.9]),
 29:(12,375.7,[214.6,249.1,283.6,318.1]),30:(12,375.7,[400.4,434.9,469.4,503.9]),31:(12,375.7,[586.1,620.6,655.1,689.6]),
 32:(13,375.7,[84.6,119.1,153.6,188.1]),33:(13,375.7,[270.4,304.9,339.4,373.9]),34:(13,375.7,[456.1,490.6,525.1,559.6]),
 35:(14,452.3,[175.6,210.1,244.6,279.1,313.6]),36:(14,452.3,[382.9,417.4,451.9,486.4,520.9]),37:(15,418.3,[64.8,99.3,133.8,168.3,202.8])}
MARK = {1:(3,352),2:(3,590),3:(4,261),4:(4,499),5:(4,737),6:(5,261),7:(5,499),8:(5,737),9:(6,355),10:(6,562),11:(6,769),12:(7,235),13:(7,447),14:(7,659),
 20:(9,330),21:(9,481),22:(9,632),23:(10,174),24:(10,325),25:(10,580),26:(10,732),27:(11,174),28:(11,325),29:(12,338),30:(12,524),31:(12,710),
 32:(13,208),33:(13,394),34:(13,580),35:(14,334),36:(14,541),37:(15,223)}
for i, y in enumerate([218,257,296,335,374]): MARK[15+i] = (8, y)
qs = []
for q in Q:
    n = q['n']; o = dict(n=n, ch=q['ch'], kind=q['kind'], stem=q['stem'], stem_en=q['stem_en'], ans=q['ans'], pic=q['pic'])
    L = sorted(q['opts'])
    o['opts'] = [dict(L=l, fr=q['opts'][l][0], en=q['opts'][l][1]) for l in L]
    o['x'] = {l: dict(k=v[0], note=v[1], fr=(FRX.get(n, {}).get(l) or NONE_FR), quote=v[2]) for l, v in q['x'].items()}
    o['ev'] = q['ev']
    if n in PIC:
        pg, y = PIC[n]; o['page'] = pg
        o['boxes'] = [dict(L=l, x=PX[i], y=y, w=23, h=23) for i, l in enumerate(L)]
    elif n in TXT:
        pg, x, ys = TXT[n]; o['page'] = pg
        o['boxes'] = [dict(L=l, x=x, y=ys[i], w=22, h=22) for i, l in enumerate(L)]
    else:  # letter blanks 15-19
        pg, y = MARK[n]; o['page'] = pg
        o['boxes'] = [dict(L='_', x=197, y=y - 2, w=88, h=17)]
    mp, my = MARK[n]; o['pill'] = dict(x=526, y=my - 2)
    qs.append(o)
# ---- transcript
doc = pymupdf.open('/mnt/user-data/uploads/0520 2/0520_w25/0520_w25_qr_11.pdf')
raw = []
for i, p in enumerate(doc):
    if i == 0 or i >= 11: continue
    raw += p.get_text().split('\n')
lines = []
for l in raw:
    l = l.replace('\t', ' ').rstrip()
    if not l.strip(): continue
    if re.match(r'^(©|\[Turn|0520/11|\d+$|E\s*$)', l.strip()): continue
    if l.startswith('Cambridge Assessment') or l.startswith('Paper 1, Listening'): continue
    lines.append(l)
# group into entries
ent = []
for l in lines:
    m = re.match(r'^(M1|M2|F1|F2)\s+(.*)$', l)
    if m: ent.append(['S', m[1], m[2].strip()])
    elif l.startswith('('): ent.append(['P', l.strip()])
    elif ent and ent[-1][0] == 'S': ent[-1][2] += ' ' + l.strip()
cut = [('c1', None), ('c2', 'Question 2'), ('c3', 'Question 3'), ('c4', 'Question 4'), ('c5', 'Question 5'), ('c6', 'Question 6'), ('c7', 'Question 7'), ('c8', 'Question 8'),
       ('c9', 'Questions 9 à 14'), ('c15', 'Questions 15 à 19'), ('c20', 'Questions 20 à 28'), ('c25', 'Deuxième partie'), ('c29', 'Questions 29 à 34'), ('c35', 'Questions 35 à 37')]
secs = {k: [] for k, _ in cut}; cur = 'c1'
for e in ent:
    if e[0] == 'S':
        t = e[2]
        for k, mk in cut:
            if mk and t.startswith(mk): cur = k
        if t.startswith('Vous avez maintenant six minutes'): break
    secs[cur].append(e)
NARR = {k: 'M1' for k in secs}; NARR['c29'] = 'M2'
VOICE = {}
def clean(t): return re.sub(r'\s*\*+\s*', ' ', t).strip()
tr = {}
for k, es in secs.items():
    out = []
    for e in es:
        if e[0] == 'P': out.append(dict(p=e[1].strip('()')))
        else:
            t = clean(e[2]); 
            if not t: continue
            out.append(dict(s='N' if e[1] == NARR[k] else e[1], t=t))
    tr[k] = out
# evidence ranges
def nm(s): return re.sub(r'\s+',' ',s.replace('’',"'")).lower()
miss = []
for q in qs:
    q['hl'] = []
    for ev in q['ev']:
        found = False
        for li, ln in enumerate(tr[q['ch']]):
            if 't' in ln:
                i = nm(ln['t']).find(nm(ev))
                if i >= 0: q['hl'].append([li, i, i + len(ev)]); found = True; break
        if not found: miss.append((q['n'], ev))
    # also quotes for distractors
    for l, x in q['x'].items():
        x['hl'] = None
        if x['quote']:
            for li, ln in enumerate(tr[q['ch']]):
                if 't' in ln:
                    i = nm(ln['t']).find(nm(x['quote']))
                    if i >= 0: x['hl'] = [li, i, i + len(x['quote'])]; break
            if x['hl'] is None: miss.append((q['n'], 'QUOTE ' + x['quote']))
print('missing evidence:', miss)
for q in qs:
    q['dx'] = []
    for (L, note, quote) in DX.get(q['n'], []):
        pass
    for (L, note, quote) in DX.get(q['n'], []):
        hl = None
        if quote:
            for li, ln in enumerate(tr[q['ch']]):
                if 't' in ln:
                    i = nm(ln['t']).find(nm(quote))
                    if i >= 0: hl = [li, i, i + len(quote)]; break
            if hl is None: miss.append((q['n'], 'DX ' + quote))
        q['dx'].append(dict(L=L, kind='heard', note=note, fr=FRDX[q['n']][L], quote=quote, hl=hl))
# add 'not mentioned' flags while at least answers+1 options stay unflagged (never reveals the answer)
for q in qs:
    fl = {d['L'] for d in q['dx'] if d['L']}; cap = len(q['opts']) - len(q['ans']) - 1 - len(fl)
    if q['kind'] == 'letter': continue
    for L in sorted(q['x']):
        if cap <= 0: break
        if q['x'][L]['k'] == 'none' and L not in fl:
            q['dx'].append(dict(L=L, kind='none', note='Not mentioned anywhere in the recording.', fr=NONE_FR, quote='', hl=None)); cap -= 1; fl.add(L)
    assert len(q['opts']) - len(fl) >= len(q['ans']) + 1 and not (fl & set(q['ans'])), q['n']
for q in qs:
    q['syn'] = SYN.get(q['n'], {})
    assert set(q['syn']) >= {o['L'] for o in q['opts']}, ('synonyms missing', q['n'], [o['L'] for o in q['opts'] if o['L'] not in q['syn']])
print('missing after dx:', miss)
chs = [dict(id=i, label=lb, t=t) for i, lb, t in CHAPTERS]
_qp = pymupdf.open('/mnt/user-data/uploads/0520 2/0520_w25/0520_w25_qp_11.pdf')
WORDS = {}
for _p in [3,4,5,6,7,8,9,10,11,12,13,14,15]:
    _l = []
    for w in _qp[_p - 1].get_text('words'):
        t_ = w[4].strip()
        if not t_ or re.fullmatch(r'[\d\[\]:./]+|[A-F]|©|UCLES|Turn|over\]?|\[Turn', t_): continue
        _l.append([t_, round(w[0], 1), round(w[1], 1), round(w[2], 1), round(w[3], 1)])
    WORDS[_p] = _l
PICS = []
for q in qs:
    if q['pic']:
        for i, o in enumerate(q['opts']):
            b = q['boxes'][i]
            PICS.append(dict(n=q['n'], L=o['L'], x=round(106.3 + 99.2 * i, 1), y=round(b['y'] - 116.3, 1), w=85, h=85, fr=o['fr'], en=o['en'], p=q['page']))
sys.path.insert(0, '/home/claude/build')
import secrets, base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
def b64(b): return base64.b64encode(b).decode()
def kdf(code, salt): return PBKDF2HMAC(hashes.SHA256(), 32, salt, 120000).derive(code.encode('utf8'))
def encrypt(obj, codes):
    salt = secrets.token_bytes(16); K = secrets.token_bytes(32); iv = secrets.token_bytes(12)
    ct = AESGCM(K).encrypt(iv, json.dumps(obj, ensure_ascii=False).encode('utf8'), None); w = []
    for c in codes:
        wiv = secrets.token_bytes(12); w.append(dict(iv=b64(wiv), ct=b64(AESGCM(kdf(c, salt)).encrypt(wiv, K, None))))
    return dict(salt=b64(salt), iv=b64(iv), ct=b64(ct), w=w)
KEY = {q['n']: dict(a=q['ans'], hl=q['hl'], x=q['x']) for q in qs}
ENC = encrypt(KEY, [os.environ['L_CODE_PAPER'], os.environ['L_CODE_MASTER']])  # teacher codes come from the environment, never from the repo
for q in qs:
    for k in ('ans', 'ev', 'hl', 'x'): q.pop(k, None)
STM = {L: [49.8, y0, 229.3, 25.3] for L, y0 in zip('ABCDEF', [439.0, 479.8, 520.6, 561.4, 602.3, 643.1])}
# titles per chapter for transcript pane
data = dict(id=PID, title='Listening · Oct/Nov 2025 · Paper 11', code='0520/11/O/N/25', pages=[1,3,4,5,6,7,8,9,10,11,12,13,14,15], W=W, H=H, chapters=chs, q=qs, tr=tr, audio=f'audio/{PID}.mp3', enc=ENC, stm=STM, helpMax=2, words=WORDS, pics=PICS, parts=[dict(src=f'audio/{PID}_a.mp3', start=0), dict(src=f'audio/{PID}_b.mp3', start=1538)], dur=3055.26)
try:
    import importlib; data['phr'] = importlib.import_module('phr_'+PID).PHR
except ImportError: data['phr'] = []
json.dump(data, open(f'{OUT}/data/{PID}.json', 'w'), ensure_ascii=False)
# ---- pages
d = pymupdf.open('/mnt/user-data/uploads/0520 2/0520_w25/0520_w25_qp_11.pdf')
for p in data['pages']:
    d[p - 1].get_pixmap(dpi=130).save(f'{OUT}/img/{PID}/p{p}.jpg', jpg_quality=72)
print('words in transcript:', sum(len(l.get('t', '').split()) for v in tr.values() for l in v))

src = '/mnt/user-data/uploads/0520 2/0520_w25/0520_w25_sf_11.mp3'
dst = f'{OUT}/audio/{PID}.mp3'
if not os.path.exists(dst):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-ac', '1', '-ar', '32000', '-c:a', 'libmp3lame', '-b:a', '64k', dst], check=True)
print('audio MB', os.path.getsize(dst) / 1e6)
