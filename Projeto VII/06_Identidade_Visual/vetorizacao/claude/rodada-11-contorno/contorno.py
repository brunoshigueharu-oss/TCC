"""Rodada 11 — contorno do rascunho BASE8 em linha de 1 pt, um grupo por objeto.

Cada traço é escrito como na ferramenta caneta, em coordenadas do rascunho (px):
  "M x,y  L x,y x,y ...  S x,y x,y ...  Z"
  L = retas até os pontos;  S = curva suave passando pelos pontos (Catmull-Rom → Bézier);
  O cx,cy,r = círculo;  E cx,cy,rx,ry,ang = elipse.
Segue o desenho do Bruno como está (nada de redesenhar).
"""
import os, re, sys, math

AQUI = os.path.dirname(os.path.abspath(__file__))
NOITE, SW = "#1B1F3B", 1.0
OBJ = []   # (letra, nome, [traços])
def obj(letra, nome, *tracos): OBJ.append((letra, nome, list(tracos)))

# ---------- conversão da notação ----------
def _f(v): return f"{v:.2f}".rstrip("0").rstrip(".")
def _pts(txt): return [tuple(map(float, p.split(","))) for p in txt.split()]
def converter(t):
    t = t.strip()
    if t.startswith("O "):
        cx, cy, r = map(float, t[2:].replace(",", " ").split())
        return f'<circle cx="{_f(cx)}" cy="{_f(cy)}" r="{_f(r)}"/>'
    if t.startswith("E "):
        cx, cy, rx, ry, a = map(float, t[2:].replace(",", " ").split())
        return f'<ellipse cx="{_f(cx)}" cy="{_f(cy)}" rx="{_f(rx)}" ry="{_f(ry)}" transform="rotate({_f(a)} {_f(cx)} {_f(cy)})"/>'
    toks = re.findall(r"[MLSZ]|[-\d.]+,[-\d.]+", t)
    P, T, cmd, fechado = [], [], None, False
    for tk in toks:
        if tk == "Z": fechado = True
        elif tk in "MLS": cmd = tk
        else: P.append(tuple(map(float, tk.split(",")))); T.append(cmd)
    Tc = "L"
    if fechado and math.dist(P[0], P[-1]) < 0.01:
        P.pop(); Tc = T.pop()                               # o último ponto repetia o primeiro
    elif fechado and T[-1] == "S":
        Tc = "S"
    n = len(P)
    def tipo_entrada(j): return Tc if (j == 0 and fechado) else T[j]
    def tipo_saida(i): return (tipo_entrada((i + 1) % n) if (fechado or i + 1 < n) else None)
    d = f"M{_f(P[0][0])} {_f(P[0][1])}"
    for i in range(n if fechado else n - 1):
        j = (i + 1) % n; a, b = P[i], P[j]
        if tipo_entrada(j) != "S":
            d += f" L{_f(b[0])} {_f(b[1])}"; continue
        if tipo_entrada(i) == "S" and (fechado or i > 0):
            q = P[(i - 1) % n]; t1 = ((b[0] - q[0]) / 6, (b[1] - q[1]) / 6)
        else:
            t1 = None
        if tipo_saida(j) == "S":
            q = P[(j + 1) % n]; t2 = ((q[0] - a[0]) / 6, (q[1] - a[1]) / 6)
        else:
            t2 = None
        if t1 is None: t1 = ((b[0] - a[0]) / 3 - (t2[0] / 2 if t2 else 0), (b[1] - a[1]) / 3 - (t2[1] / 2 if t2 else 0))
        if t2 is None: t2 = ((b[0] - a[0]) / 3 - t1[0] / 2, (b[1] - a[1]) / 3 - t1[1] / 2)
        c1 = (a[0] + t1[0], a[1] + t1[1]); c2 = (b[0] - t2[0], b[1] - t2[1])
        d += f" C{_f(c1[0])} {_f(c1[1])} {_f(c2[0])} {_f(c2[1])} {_f(b[0])} {_f(b[1])}"
    if fechado: d += " Z"
    return f'<path d="{d}"/>'

exec(open(os.path.join(AQUI, "objetos.py"), encoding="utf-8").read())

LETRAS = ["B", "A", "S", "E", "8"]
def svg(vb=(700, 740, 1720, 460), fundo=None, cor=NOITE, sw=SW, so=None):
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(map(str, vb))}" width="{vb[2]}" height="{vb[3]}">',
         "<title>BASE8 — contorno das letras (rodada 11)</title>",
         fundo if fundo is not None else f'<rect id="fundo" x="{vb[0]}" y="{vb[1]}" width="{vb[2]}" height="{vb[3]}" fill="#FFFFFF"/>']
    for L in LETRAS:
        if so and L not in so: continue
        o.append(f'<g id="letra-{L}">')
        for letra, nome, tr in OBJ:
            if letra != L: continue
            o.append(f'<g id="{nome}" fill="none" stroke="{cor}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'
                     + "".join(converter(t) for t in tr) + "</g>")
        o.append("</g>")
    o.append("</svg>")
    return "\n".join(o)

if __name__ == "__main__":
    open(os.path.join(AQUI, "base8-contorno.svg"), "w").write(svg())
    # sobreposição para conferência: linha magenta fina sobre o rascunho
    if len(sys.argv) > 1:
        x0, y0, x1, y1, k = map(int, sys.argv[1:6])
        foto = os.path.abspath(os.path.join(AQUI, "..", "..", "fontes", "rascunho-logo-base8.jpeg"))
        s = svg(vb=(x0, y0, x1 - x0, y1 - y0), fundo="", cor="#FF0090", sw=0.8)
        s = s.replace(f'width="{x1-x0}" height="{y1-y0}"', f'width="{(x1-x0)*k}" height="{(y1-y0)*k}"', 1)
        open(os.path.join(AQUI, "_conf", "_ov.svg"), "w").write(s)
    print(len(OBJ), "objetos")
