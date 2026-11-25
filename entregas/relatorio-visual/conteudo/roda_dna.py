"""Roda de valores do DNA: POTENCIALIZAÇÃO no centro, 4 pilares e 8 vertentes."""
from math import sin, cos, radians

PILARES = [  # (pilar, cor, cor do texto, vertentes)
    ("HOLÍSTICA", "#0B8FE0", "#fff", ("sistêmica", "prática")),
    ("ACESSIBILIDADE", "#12A180", "#fff", ("personalizada", "progressiva")),
    ("CONEXÃO", "#FF48B0", "#fff", ("coletividade", "profissional")),
    ("INOVAÇÃO", "#F5EE4A", "#1B1F3B", ("ousado", "gamificado")),
]
C, R0, R1, R2, R3 = 360, 128, 134, 238, 352  # centro, núcleo, início/fim do anel dos pilares, fim das vertentes


def p(r, a):
    a = radians(a)
    return C + r * sin(a), C - r * cos(a)


def setor(ri, ro, a0, a1, cor, op=1):
    x0, y0 = p(ro, a0); x1, y1 = p(ro, a1); x2, y2 = p(ri, a1); x3, y3 = p(ri, a0)
    g = 1 if a1 - a0 > 180 else 0
    return (f'<path d="M{x0:.1f},{y0:.1f} A{ro},{ro} 0 {g} 1 {x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} '
            f'A{ri},{ri} 0 {g} 0 {x3:.1f},{y3:.1f}Z" fill="{cor}" fill-opacity="{op}" stroke="#fff" stroke-width="5"/>')


def rotulo(i, r, a0, a1, texto, cor, tam, peso):
    meio = (a0 + a1) / 2 % 360
    if 135 < meio < 225:  # quadrante de baixo: caminho invertido para o texto ficar de pé
        (xa, ya), (xb, yb), sw = p(r, a1), p(r, a0), 0
    else:
        (xa, ya), (xb, yb), sw = p(r, a0), p(r, a1), 1
    return (f'<path id="r{i}" d="M{xa:.1f},{ya:.1f} A{r},{r} 0 0 {sw} {xb:.1f},{yb:.1f}" fill="none"/>'
            f'<text font-family="Instrument Sans" font-size="{tam}" font-weight="{peso}" fill="{cor}" letter-spacing=".04em">'
            f'<textPath href="#r{i}" startOffset="50%" text-anchor="middle" dominant-baseline="middle">{texto}</textPath></text>')


def svg():
    partes, k = [], 0
    for n, (pilar, cor, tx, vert) in enumerate(PILARES):
        a0 = -45 + n * 90; a1 = a0 + 90
        partes.append(setor(R1, R2, a0, a1, cor))
        partes.append(rotulo(k, (R1 + R2) / 2, a0, a1, pilar, tx, 27, 700)); k += 1
        for j, v in enumerate(vert):
            b0 = a0 + j * 45; b1 = b0 + 45
            partes.append(setor(R2, R3, b0, b1, cor, .38))
            partes.append(rotulo(k, (R2 + R3) / 2, b0, b1, v, "#1B1F3B", 25, 600)); k += 1
    partes.append(f'<circle cx="{C}" cy="{C}" r="{R0}" fill="#1B1F3B"/>')
    partes.append(f'<text x="{C}" y="{C - 14}" text-anchor="middle" font-family="JetBrains Mono" font-size="15" fill="#fff" fill-opacity=".7" letter-spacing=".18em">VALOR CENTRAL</text>')
    partes.append(f'<text x="{C}" y="{C + 22}" text-anchor="middle" font-family="Instrument Sans" font-size="23" font-weight="700" fill="#fff">POTENCIALIZAÇÃO</text>')
    return f'<svg viewBox="0 0 {2*C} {2*C}" width="{2*C}" height="{2*C}">' + "".join(partes) + "</svg>"
