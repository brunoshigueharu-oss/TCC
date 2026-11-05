"""Rodada 10: traça a linha central dos traços a lápis do rascunho BASE8 (só as letras).

Fiel ao desenho: não redesenha nada; só tira o tremido do lápis.
Cada traço vai para o objeto da rodada 9 cuja região ele ocupa (mapa _conferencia/rotulos.png).
Uso: python3 tracar.py [limiar] [suavizacao]
"""
import sys, os, json, math
from collections import deque, Counter
import numpy as np
from PIL import Image, ImageFilter

AQUI = os.path.dirname(os.path.abspath(__file__))
FOTO = os.path.join(AQUI, "..", "..", "fontes", "rascunho-logo-base8.jpeg")
X0, Y0, W, H = 700, 740, 1720, 460
LIMIAR = int(sys.argv[1]) if len(sys.argv) > 1 else 222
JAN = int(sys.argv[2]) if len(sys.argv) > 2 else 7          # janela da média móvel (px)
NOITE, SW = "#1B1F3B", 3.6

# ---------- 1. tinta ----------
img = Image.open(FOTO).convert("L").crop((X0, Y0, X0 + W, Y0 + H))
img = img.filter(ImageFilter.GaussianBlur(float(os.environ.get("DESFOQUE", "0.8"))))
ink = np.array(img) < LIMIAR

def componentes(mask):
    lab = np.zeros(mask.shape, int); n = 0; tam = [0]
    hh, ww = mask.shape
    for y, x in zip(*np.nonzero(mask)):
        if lab[y, x]: continue
        n += 1; q = deque([(y, x)]); lab[y, x] = n; c = 0
        while q:
            cy, cx = q.popleft(); c += 1
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < hh and 0 <= nx < ww and mask[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; q.append((ny, nx))
        tam.append(c)
    return lab, np.array(tam)
lab, tam = componentes(ink)
ink = ink & (tam[lab] >= 40)

# ---------- 2. esqueleto (Zhang-Suen) ----------
def afinar(m):
    m = np.pad(m.astype(np.uint8), 1)
    while True:
        mudou = False
        for passo in (0, 1):
            P2 = np.roll(m, 1, 0); P4 = np.roll(m, -1, 1); P6 = np.roll(m, -1, 0); P8 = np.roll(m, 1, 1)
            P3 = np.roll(P2, -1, 1); P5 = np.roll(P6, -1, 1); P7 = np.roll(P6, 1, 1); P9 = np.roll(P2, 1, 1)
            seq = [P2, P3, P4, P5, P6, P7, P8, P9, P2]
            B = sum(seq[:8]).astype(int)
            A = sum(((seq[i] == 0) & (seq[i + 1] == 1)).astype(int) for i in range(8))
            if passo == 0:
                c = (P2 * P4 * P6 == 0) & (P4 * P6 * P8 == 0)
            else:
                c = (P2 * P4 * P8 == 0) & (P2 * P6 * P8 == 0)
            apaga = (m == 1) & (B >= 2) & (B <= 6) & (A == 1) & c
            if apaga.any():
                m[apaga] = 0; mudou = True
        if not mudou: break
    return m[1:-1, 1:-1].astype(bool)
sk = afinar(ink)
def tirar_escadas(m):
    # apaga pixel de canto de escadinha: dois vizinhos em cruz adjacentes ligados e canto oposto vazio
    m = m.copy()
    for _ in range(3):
        P = np.pad(m, 1)
        N, S_, E, O = P[:-2, 1:-1], P[2:, 1:-1], P[1:-1, 2:], P[1:-1, :-2]
        NE, NO, SE, SO = P[:-2, 2:], P[:-2, :-2], P[2:, 2:], P[2:, :-2]
        tot = N.astype(int) + S_ + E + O + NE + NO + SE + SO
        apaga = m & (((N & E) & ~SO) | ((E & S_) & ~NO) | ((S_ & O) & ~NE) | ((O & N) & ~SE)) & (tot == 2)
        if not apaga.any(): break
        # apaga um de cada vez por paridade para não quebrar a linha
        for par in (0, 1):
            yy, xx = np.nonzero(apaga)
            sel = ((yy + xx) % 2) == par
            m[yy[sel], xx[sel]] = False
            P = np.pad(m, 1)
            N, S_, E, O = P[:-2, 1:-1], P[2:, 1:-1], P[1:-1, 2:], P[1:-1, :-2]
            NE, NO, SE, SO = P[:-2, 2:], P[:-2, :-2], P[2:, 2:], P[2:, :-2]
            tot = N.astype(int) + S_ + E + O + NE + NO + SE + SO
            apaga = m & (((N & E) & ~SO) | ((E & S_) & ~NO) | ((S_ & O) & ~NE) | ((O & N) & ~SE)) & (tot == 2)
    return m
sk = tirar_escadas(sk)

N8 = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
def vizinhos(p):
    y, x = p
    return [(y + dy, x + dx) for dy, dx in N8 if 0 <= y + dy < H and 0 <= x + dx < W and sk[y + dy, x + dx]]
def cruzamento(p):
    y, x = p
    v = [1 if (0 <= y + dy < H and 0 <= x + dx < W and sk[y + dy, x + dx]) else 0 for dy, dx in N8]
    return sum(1 for i in range(8) if v[i] == 0 and v[(i + 1) % 8] == 1)

# ---------- 3. caminhos ----------
pix = set(zip(*np.nonzero(sk)))
grau = {p: len(vizinhos(p)) for p in pix}
nos = {p for p in pix if grau[p] <= 1 or cruzamento(p) >= 3}
usado = set(); caminhos = []
def andar(a, b):
    cam = [a, b]; ant, cur = a, b
    while cur not in nos:
        usado.add(cur)
        nx = [q for q in vizinhos(cur) if q != ant and q not in usado and q not in cam[-3:]]
        if not nx:
            nx = [q for q in vizinhos(cur) if q in nos and q != ant]
            if not nx: break
        # prefere vizinho em cruz (evita escadinha)
        nx.sort(key=lambda q: abs(q[0] - cur[0]) + abs(q[1] - cur[1]))
        ant, cur = cur, nx[0]; cam.append(cur)
    return cam
ares = set()
for n in nos:
    for v in vizinhos(n):
        if v in usado: continue
        if v in nos:
            k = tuple(sorted([n, v]))
            if k in ares: continue
            ares.add(k); caminhos.append([n, v]); continue
        caminhos.append(andar(n, v))
for p in list(pix):
    if p in usado or p in nos: continue
    vs = vizinhos(p)
    if not vs: continue
    usado.add(p); cam = andar(p, vs[0]); caminhos.append(cam)

# remove fiapos curtos que saem de junções
def comp(c): return sum(math.dist(c[i], c[i + 1]) for i in range(len(c) - 1))
caminhos = [c for c in caminhos if not (comp(c) < 10 and (grau.get(c[0], 0) > 2) != (grau.get(c[-1], 0) > 2))]
caminhos = [c for c in caminhos if comp(c) >= 1]

# ---------- 4. emendas ----------
def direcao(c, fim, k=8):
    if fim: a, b = c[max(0, len(c) - 1 - k)], c[-1]
    else: a, b = c[min(len(c) - 1, k)], c[0]
    d = (b[0] - a[0], b[1] - a[1]); n = math.hypot(*d) or 1
    return (d[0] / n, d[1] / n)
def emendar(cams, dist_max, ang_min, so_pontas):
    """Emenda pontas próximas e alinhadas numa só passada (gulosa, melhores pares primeiro)."""
    pontas = []
    for i, c in enumerate(cams):
        for fim in (0, 1):
            p = c[-1] if fim else c[0]
            if so_pontas and grau.get(p, 2) != 1: continue
            pontas.append((i, fim, p, direcao(c, bool(fim))))
    cel = {}
    for k, (i, fi, p, d) in enumerate(pontas):
        cel.setdefault((int(p[0] // dist_max), int(p[1] // dist_max)), []).append(k)
    cand = []
    for k, (i, fi, p, di) in enumerate(pontas):
        cy, cx = int(p[0] // dist_max), int(p[1] // dist_max)
        for yy in (cy - 1, cy, cy + 1):
            for xx in (cx - 1, cx, cx + 1):
                for m in cel.get((yy, xx), []):
                    if m <= k: continue
                    j, fj, q, dj = pontas[m]
                    if i == j and len(cams[i]) < 12: continue
                    d = math.dist(p, q)
                    if d > dist_max: continue
                    if d > 1.5:
                        v = ((q[0] - p[0]) / d, (q[1] - p[1]) / d)
                        if di[0] * v[0] + di[1] * v[1] < ang_min or -(dj[0] * v[0] + dj[1] * v[1]) < ang_min: continue
                    elif -(di[0] * dj[0] + di[1] * dj[1]) < ang_min: continue
                    cand.append((d - 4 * (-(di[0] * dj[0] + di[1] * dj[1])), (i, fi), (j, fj)))
    cand.sort()
    par = {}
    pai = list(range(len(cams)))
    def raiz(x):
        while pai[x] != x: pai[x] = pai[pai[x]]; x = pai[x]
        return x
    for _, ea, eb in cand:
        if ea in par or eb in par: continue
        par[ea] = eb; par[eb] = ea
        pai[raiz(ea[0])] = raiz(eb[0])
    # monta as cadeias
    vis = set(); out = []
    def cadeia(i, fim_entrada):
        seq = []; atual, entrada = i, fim_entrada
        while True:
            vis.add(atual)
            c = cams[atual] if entrada == 0 else cams[atual][::-1]
            seq = seq + (c[1:] if seq and seq[-1] == c[0] else c)
            saida = (atual, 1 - entrada)
            if saida not in par: return seq, False
            prox = par[saida]
            if prox[0] in vis: return seq, True
            atual, entrada = prox
    for i in range(len(cams)):
        if i in vis: continue
        # anda até uma ponta livre
        cur, ent, passos = i, 0, 0
        while (cur, ent) in par and passos <= len(cams):
            pr = par[(cur, ent)]; cur, ent = pr[0], 1 - pr[1]; passos += 1
            if cur == i: break
        seq, fechado = cadeia(cur, ent)
        if fechado and seq[0] != seq[-1]: seq = seq + [seq[0]]
        out.append(seq)
    return out
caminhos = emendar(caminhos, 2.0, 0.6, False)   # continuidade através das junções
caminhos = emendar(caminhos, 16.0, 0.7, True)   # falhas do lápis

# ---------- 5. rótulos ----------
rot = np.array(Image.open(os.path.join(AQUI, "_conferencia", "rotulos.png")).convert("L")).astype(int)
lista = json.load(open(os.path.join(AQUI, "_conferencia", "rotulos.json")))
for _ in range(30):   # espalha os rótulos para os pixels vazios vizinhos
    vazio = rot == 0
    if not vazio.any(): break
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        s = np.roll(rot, (dy, dx), (0, 1)); m = vazio & (s > 0); rot[m] = s[m]; vazio = rot == 0

def partir_por_rotulo(c):
    labs = [rot[p] for p in c]
    # suaviza: corridas curtas herdam o vizinho
    runs = []
    for i, l in enumerate(labs):
        if runs and runs[-1][0] == l: runs[-1][2] = i
        else: runs.append([l, i, i])
    mudou = True
    while mudou and len(runs) > 1:
        mudou = False
        for k, r in enumerate(runs):
            if r[2] - r[1] + 1 < 14:
                viz = runs[k - 1] if k > 0 else runs[k + 1]
                if k > 0 and k + 1 < len(runs) and (runs[k + 1][2] - runs[k + 1][1]) > (runs[k - 1][2] - runs[k - 1][1]):
                    viz = runs[k + 1]
                r[0] = viz[0]; mudou = True
        fund = []
        for r in runs:
            if fund and fund[-1][0] == r[0]: fund[-1][2] = r[2]
            else: fund.append(r)
        if len(fund) < len(runs): mudou = True
        runs = fund
        if not mudou: break
    return [(r[0], c[r[1]:r[2] + 2]) for r in runs]

pecas = {}
for c in caminhos:
    for l, seg in partir_por_rotulo(c):
        if len(seg) >= 2 and l > 0:
            pecas.setdefault(l, []).append(seg)

# ---------- 6. suavização e curvas ----------
def suavizar(c):
    pts = np.array([(x + X0 + 0.5, y + Y0 + 0.5) for y, x in c], float)
    fechado = len(c) > 8 and math.dist(c[0], c[-1]) <= 1.5
    if len(pts) < 5: return pts, fechado
    k = JAN // 2; out = pts.copy()
    for i in range(len(pts)):
        if fechado:
            idx = [(i + j) % len(pts) for j in range(-k, k + 1)]
        else:
            kk = min(k, i, len(pts) - 1 - i); idx = range(i - kk, i + kk + 1)
        out[i] = pts[list(idx)].mean(0)
    return out, fechado
def rdp(p, eps):
    if len(p) < 3: return p
    a, b = p[0], p[-1]; ab = b - a; n = np.hypot(*ab)
    d = np.abs(ab[0] * (p[:, 1] - a[1]) - ab[1] * (p[:, 0] - a[0])) / n if n > 0 else np.hypot(*(p - a).T)
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([rdp(p[:i + 1], eps)[:-1], rdp(p[i:], eps)])
    return np.array([a, b])
def fmt(v): return f"{v:.1f}".rstrip("0").rstrip(".")
def curva(pts, fechado):
    p = rdp(pts, 0.9)
    if fechado and len(p) > 3 and np.hypot(*(p[0] - p[-1])) < 2: p = p[:-1]
    n = len(p)
    if n < 2: return ""
    def canto(i):
        if not fechado and (i == 0 or i == n - 1): return True
        a, b, c = p[(i - 1) % n], p[i], p[(i + 1) % n]
        u, v = b - a, c - b
        cosang = (u @ v) / ((np.hypot(*u) * np.hypot(*v)) or 1)
        return cosang < math.cos(math.radians(50))
    d = f"M{fmt(p[0][0])} {fmt(p[0][1])}"
    segs = n if fechado else n - 1
    for i in range(segs):
        a, b = p[i], p[(i + 1) % n]
        pa = p[(i - 1) % n] if (fechado or i > 0) else a
        pb = p[(i + 2) % n] if (fechado or i + 2 < n) else b
        t1 = (b - pa) / 6 if not canto(i) else np.zeros(2)
        t2 = (pb - a) / 6 if not canto((i + 1) % n) else np.zeros(2)
        c1, c2 = a + t1, b - t2
        if not t1.any() and not t2.any():
            d += f" L{fmt(b[0])} {fmt(b[1])}"
        else:
            d += f" C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(b[0])} {fmt(b[1])}"
    return d + (" Z" if fechado else "")

NOMES_LETRA = {"B": "B", "A": "A", "S": "S", "E": "E", "8": "8"}
grupos = {}
total = 0
for l, segs in pecas.items():
    letra, nome = lista[l - 1]
    ds = [curva(*suavizar(s)) for s in segs]
    ds = [d for d in ds if d]
    total += len(ds)
    grupos.setdefault(letra, []).append((nome, ds))

def svg(fundo=""):
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{X0} {Y0} {W} {H}" width="{W}" height="{H}">',
         '<title>BASE8 — letras traçadas do rascunho (rodada 10)</title>',
         fundo or f'<rect id="fundo" x="{X0}" y="{Y0}" width="{W}" height="{H}" fill="#FFFFFF"/>']
    for letra in ["B", "A", "S", "E", "8"]:
        o.append(f'<g id="letra-{letra}">')
        for nome, ds in sorted(grupos.get(letra, []), key=lambda t: [x[1] for x in lista].index(t[0])):
            o.append(f'<g id="{nome}" fill="none" stroke="{NOITE}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">' +
                     "".join(f'<path d="{d}"/>' for d in ds) + "</g>")
        o.append("</g>")
    o.append("</svg>")
    return "\n".join(o)
open(os.path.join(AQUI, "base8-letras-tracadas.svg"), "w").write(svg())
bg = f'<image href="file://{os.path.abspath(FOTO)}" x="0" y="0" width="2732" height="2048" opacity="0.6"/>'
open(os.path.join(AQUI, "_conferencia", "sobreposicao.svg"), "w").write(svg(bg).replace(NOITE, "#E5007E").replace(f'stroke-width="{SW}"', 'stroke-width="1.6"'))
print("caminhos:", total, "objetos:", sum(len(v) for v in grupos.values()))
