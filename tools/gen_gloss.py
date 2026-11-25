# -*- coding: utf-8 -*-
import json, re, sys
sys.path.insert(0, '/home/claude/build/L')
from extra_gloss import EX
t = open('/home/claude/build/out/data/gloss.js').read()
g = json.loads(t[t.index('{'):t.rindex('}')+1])
d = json.load(open('/home/claude/build/L/app/data/w25_11.json'))
def tok(s): return [w for w in re.split(r"[^\wÀ-ÿœŒ]+", s.replace('’', ' ')) if w]
texts = [l['t'] for v in d['tr'].values() for l in v if 't' in l]
for q in d['q']:
    texts += [q['stem']] + [o['fr'] for o in q['opts']]
for p, ws in d['words'].items(): texts += [w[0] for w in ws]
words = set(w.lower() for s in texts for w in tok(s))
sub = {w: g[w] for w in words if w in g}
for w, v in EX.items():
    if w in words or w in ("aujourd’hui",): sub[w] = v
sub['c'] = EX['c']; sub["aujourd’hui"] = EX["aujourd’hui"]
miss = sorted(w for w in words if w not in sub and not w.isdigit())
print(len(sub), 'missing:', miss)
open('/home/claude/build/L/app/data/gloss_w25_11.js', 'w').write('window.GLOSS=' + json.dumps(sub, ensure_ascii=False) + ';')
