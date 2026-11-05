"""Gera a logo BASE8 (rodada 9) a partir do rascunho de 28/10/2026.

Coordenadas no espaço do rascunho (2732 x 2048 px). Cada objeto vira um <g>
próprio; o polvo é construído sobre o módulo g (altura das letras = 32 g).
"""
import math, os, sys

OUT = sys.argv[1]
NOITE = "#1B1F3B"
SW = 3.2           # traço do contorno
SWD = 2.6          # traço dos detalhes
G = 388 / 32       # módulo: altura das letras (774 → 1162) = 32 g
TOPO, BASE = 774, 1162

def f(v): return f"{v:.2f}".rstrip("0").rstrip(".")
def pt(p): return f"{f(p[0])} {f(p[1])}"

# ---------- primitivas ----------
def poly(pts, close=True):
    d = "M" + " L".join(pt(p) for p in pts)
    return d + (" Z" if close else "")

def circ3(a, b, c):
    ax, ay = a; bx, by = b; cx, cy = c
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    ux = ((ax*ax+ay*ay)*(by-cy) + (bx*bx+by*by)*(cy-ay) + (cx*cx+cy*cy)*(ay-by)) / d
    uy = ((ax*ax+ay*ay)*(cx-bx) + (bx*bx+by*by)*(ax-cx) + (cx*cx+cy*cy)*(bx-ax)) / d
    return (ux, uy), math.hypot(ax-ux, ay-uy)

def arc3(a, m, b):
    """Comando A do arco que passa por a, m, b (a é o ponto atual)."""
    (ux, uy), r = circ3(a, m, b)
    T = 2 * math.pi
    aa = math.atan2(a[1]-uy, a[0]-ux); am = math.atan2(m[1]-uy, m[0]-ux); ab = math.atan2(b[1]-uy, b[0]-ux)
    dm, db = (am-aa) % T, (ab-aa) % T
    if dm < db:   # sentido de ângulo crescente (horário na tela)
        sweep, large = 1, 1 if db > math.pi else 0
    else:
        sweep, large = 0, 1 if (T-db) > math.pi else 0
    return f" A{f(r)} {f(r)} 0 {large} {sweep} {pt(b)}"

def sag(a, b, s):
    """Ponto médio da corda a-b deslocado s (positivo = para a esquerda de a→b)."""
    mx, my = (a[0]+b[0])/2, (a[1]+b[1])/2
    dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy)
    return (mx + dy/L*s, my - dx/L*s)

def pol(c, r, ang):  # ang em graus, 0 = para a direita, sentido horário (y para baixo)
    a = math.radians(ang); return (c[0] + r*math.cos(a), c[1] + r*math.sin(a))

def sector(c, r_out, r_in, a0, a1):
    """Setor de anel entre os ângulos a0→a1 (horário)."""
    p0, p1 = pol(c, r_out, a0), pol(c, r_out, a1)
    q1, q0 = pol(c, r_in, a1), pol(c, r_in, a0)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return (f"M{pt(p0)} A{f(r_out)} {f(r_out)} 0 {large} 1 {pt(p1)} L{pt(q1)} "
            f"A{f(r_in)} {f(r_in)} 0 {large} 0 {pt(q0)} Z")

def rrect(x, y, w, h, r):
    return (f"M{pt((x+r, y))} H{f(x+w-r)} A{f(r)} {f(r)} 0 0 1 {pt((x+w, y+r))} V{f(y+h-r)} "
            f"A{f(r)} {f(r)} 0 0 1 {pt((x+w-r, y+h))} H{f(x+r)} A{f(r)} {f(r)} 0 0 1 {pt((x, y+h-r))} "
            f"V{f(y+r)} A{f(r)} {f(r)} 0 0 1 {pt((x+r, y))} Z")

def rot(pts, c, ang):
    a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
    return [(c[0] + (x-c[0])*ca - (y-c[1])*sa, c[1] + (x-c[0])*sa + (y-c[1])*ca) for x, y in pts]

def capsule(a, b, r):
    """Cápsula (pílula) com eixo a→b e raio r."""
    dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy); nx, ny = -dy/L*r, dx/L*r
    p1, p2 = (a[0]+nx, a[1]+ny), (b[0]+nx, b[1]+ny)
    p3, p4 = (b[0]-nx, b[1]-ny), (a[0]-nx, a[1]-ny)
    return f"M{pt(p1)} L{pt(p2)} A{f(r)} {f(r)} 0 0 0 {pt(p3)} L{pt(p4)} A{f(r)} {f(r)} 0 0 0 {pt(p1)} Z"

def line(a, b): return f"M{pt(a)} L{pt(b)}"
def circle(c, r): return f'<circle cx="{f(c[0])}" cy="{f(c[1])}" r="{f(r)}"/>'
def ellipse(c, rx, ry, ang=0):
    return f'<ellipse cx="{f(c[0])}" cy="{f(c[1])}" rx="{f(rx)}" ry="{f(ry)}" transform="rotate({f(ang)} {pt(c)})"/>'

# ---------- objetos ----------
objetos = []   # (letra, id, [(tipo, conteúdo)])  tipo: 'forma' (preenchida) | 'linha' | 'cheio' (preenchido escuro) | 'raw'

def obj(letra, nome, *partes):
    objetos.append((letra, nome, list(partes)))

F = lambda d: ("forma", d)
L = lambda d: ("linha", d)
C = lambda d: ("cheio", d)
R = lambda s: ("raw", s)

# ===== B =====
# régua (haste)
reg = [line((780, y), (780 + (21 if i % 5 == 0 else 13), y)) for i, y in enumerate(range(786, 976, 10))]
obj("B", "regua", F(poly([(780, 774), (850, 774), (850, 982), (780, 982)])), *[L(d) for d in reg])

# mouse (traço de cima)
obj("B", "mouse",
    F(rrect(853, 783, 108, 52, 26)),
    L(line((899, 783), (899, 835))), L(line((853, 809), (899, 809))),
    F(rrect(869, 804, 22, 10, 5)))

# objeto do arco superior (dúvida) — banda em "D" com botão, fenda e plugue
a_out = [(972, 776), (1062, 866), (1020, 952)]
a_in = [(965, 829), (996, 878), (962, 934)]
d = f"M{pt(a_out[0])}" + arc3(a_out[0], a_out[1], a_out[2]) + f" L{pt(a_in[2])}" + arc3(a_in[2], a_in[1], a_in[0]) + " Z"
obj("B", "arco-superior",
    F(d),
    F(poly(rot([(989, 789), (1011, 789), (1011, 799), (989, 799)], (1000, 794), 32))),
    R(circle((1027, 862), 24)),
    F(poly(rot([(1044, 912), (1060, 912), (1060, 930), (1044, 930)], (1052, 921), -30))),
    F(poly(rot([(1052, 930), (1064, 930), (1064, 944), (1052, 944)], (1052, 921), -30))))
obj("B", "conector-do-mouse", F(poly(rot([(958, 790), (978, 790), (978, 808), (958, 808)], (968, 799), 12))))

# pino de localização (barra do meio)
pc, pr = (873, 960), 26
tip = (1003, 958)
def tangentes(c, r, p):
    dx, dy = p[0]-c[0], p[1]-c[1]; dd = math.hypot(dx, dy); a = math.atan2(dy, dx); b = math.acos(r/dd)
    return (c[0]+r*math.cos(a+b), c[1]+r*math.sin(a+b)), (c[0]+r*math.cos(a-b), c[1]+r*math.sin(a-b))
t1, t2 = tangentes(pc, pr, tip)
obj("B", "pino-de-localizacao",
    F(f"M{pt(tip)} L{pt(t1)} A{pr} {pr} 0 1 1 {pt(t2)} Z"),
    R(circle(pc, 18)))

# escudo
obj("B", "escudo",
    F(f"M813 988 L848 1024" + arc3((848, 1024), (838, 1068), (815, 1095)) + arc3((815, 1095), (790, 1068), (779, 1024)) + " Z"),
    L(f"M813 1000 L838 1026" + arc3((838, 1026), (830, 1063), (815, 1083)) + arc3((815, 1083), (798, 1063), (789, 1026)) + " Z"),
    L(line((813, 1000), (815, 1083))), L(line((790, 1038), (842, 1038))))

# plugue com cabo
obj("B", "plugue",
    F(poly([(749, 1121), (781, 1121), (781, 1130), (749, 1130)])),
    F(poly([(749, 1143), (781, 1143), (781, 1152), (749, 1152)])),
    F(f"M781 1108 L818 1108 A27 27 0 0 1 818 1162 L781 1162 Z"),
    F(f"M851 1124" + arc3((851, 1124), (884, 1112), (901, 1107)) + " L901 1120" + arc3((901, 1120), (888, 1131), (851, 1140)) + " Z"),
    F(poly([(844, 1122), (853, 1122), (853, 1146), (844, 1146)])))

# envelope / papel dobrado (topo do bojo inferior) — dúvida
obj("B", "papel-dobrado",
    F("M957 983 L992 969 L1030 970" + arc3((1030, 970), (1050, 987), (1061, 1012)) + " L1040 1040 L1007 1030" +
      arc3((1007, 1030), (983, 1003), (957, 983)) + " Z"),
    L(poly([(997, 969), (1012, 988), (1027, 970)], close=False)))

# CD
cd = (1043, 1056)
raios = []
for ang, r0, r1 in [(-40, 14, 38), (-28, 16, 36), (140, 14, 38), (152, 16, 38), (128, 16, 36)]:
    raios.append(L(line(pol(cd, r0, ang), pol(cd, r1, ang))))
obj("B", "cd", R(circle(cd, 42)), R(circle(cd, 11)), *raios)

# transferidor / grade curva (base) — dúvida
gc, r_o = circ3((922, 1161), (1003, 1150), (1053, 1113))
r_i = r_o - 50
def ang_of(p): return math.degrees(math.atan2(p[1]-gc[1], p[0]-gc[0]))
a0, a1 = ang_of((922, 1161)), ang_of((1053, 1113))
def arco(r, aa, bb): return f"M{pt(pol(gc, r, aa))} A{f(r)} {f(r)} 0 0 0 {pt(pol(gc, r, bb))}"
radiais = [a0 + (a1 - a0) * t for t in (0.2, 0.4, 0.6, 0.8)]
obj("B", "grade-curva",
    F(f"M{pt(pol(gc, r_i, a0))} L{pt(pol(gc, r_o, a0))} A{f(r_o)} {f(r_o)} 0 0 0 {pt(pol(gc, r_o, a1))} L{pt(pol(gc, r_i, a1))} A{f(r_i)} {f(r_i)} 0 0 1 {pt(pol(gc, r_i, a0))} Z"),
    *[L(arco(r, a0, a1)) for r in (r_i + 17, r_i + 34)],
    *[L(line(pol(gc, r_i + 17, a), pol(gc, r_o, a))) for a in radiais],
    F(poly(rot([(943, 1100), (955, 1100), (955, 1116), (943, 1116)], (949, 1108), -10))),
    F(poly(rot([(980, 1090), (992, 1090), (992, 1106), (980, 1106)], (986, 1098), -22))))

# ===== A =====
# lápis (perna esquerda) — eixo inclinado 21°
ang_leg = 21
ax = (math.sin(math.radians(ang_leg)), -math.cos(math.radians(ang_leg)))  # direção para cima
nx_ = (math.cos(math.radians(ang_leg)), math.sin(math.radians(ang_leg)))   # perpendicular para a direita
def along(p, s, n): return (p[0] + ax[0]*s + nx_[0]*n, p[1] + ax[1]*s + nx_[1]*n)
pb = (1117, 1162)          # centro da base do lápis
hw = 33                    # meia largura
def at_y(p_on_axis_side, y):  # interseção da linha lateral com y
    return p_on_axis_side
# laterais: retas paralelas ao eixo, cortadas em y = BASE
def side_point(n, s): return along(pb, s, n)
def cut_base(n):
    p = along(pb, 0, n); t = (BASE - p[1]) / ax[1]; return (p[0] + ax[0]*t, BASE)
s_madeira = 132; s_ponta = 205; s_grafite = 182
L0, R0 = cut_base(-hw), cut_base(hw)
L1, R1 = along(pb, s_madeira, -hw), along(pb, s_madeira, hw)
apex = along(pb, s_ponta, 0)
gL, gR = along(pb, s_grafite, -hw*(s_ponta-s_grafite)/(s_ponta-s_madeira)), along(pb, s_grafite, hw*(s_ponta-s_grafite)/(s_ponta-s_madeira))
# recortes de madeira (3 arcos) sobre a base do cone
bumps = []
pts_b = [along(pb, s_madeira, n) for n in (-hw, -hw/3, hw/3, hw)]
d_b = f"M{pt(pts_b[0])}"
for i in range(3):
    m = along(pb, s_madeira + 10, (-hw + hw*2/3*(i+0.5)))
    d_b += arc3(pts_b[i], m, pts_b[i+1])
obj("A", "lapis",
    F(poly([L0, L1, apex, R1, R0])),
    L(d_b),
    L(line(gL, gR)),
    L(line(along(pb, s_madeira + 10 - 2, -hw/3), cut_base(-hw/3))),
    L(line(along(pb, s_madeira + 10 - 2, hw/3), cut_base(hw/3))))

# pen drive (perna direita) — espelho do lápis
ang_r = -21
axr = (math.sin(math.radians(ang_r)), -math.cos(math.radians(ang_r)))
nxr = (math.cos(math.radians(ang_r)), math.sin(math.radians(ang_r)))
def alr(p, s, n): return (p[0] + axr[0]*s + nxr[0]*n, p[1] + axr[1]*s + nxr[1]*n)
pr0 = (1403, 1137)       # centro da base do corpo
corpo = [alr(pr0, 0, -34), alr(pr0, 0, 34), alr(pr0, 135, 34), alr(pr0, 135, -34)]
tampa = [alr(pr0, 135, -28), alr(pr0, 135, 28), alr(pr0, 146, 28), alr(pr0, 146, -28)]
tampa2 = [alr(pr0, 146, -12), alr(pr0, 146, 12), alr(pr0, 155, 12), alr(pr0, 155, -12)]
usb = [alr(pr0, 0, -24), alr(pr0, 0, 24), alr(pr0, -24, 24), alr(pr0, -24, -24)]
# conector cortado na base
def clip_base(p_top, p_bot):
    t = (BASE - p_top[1]) / (p_bot[1] - p_top[1]); return (p_top[0] + (p_bot[0]-p_top[0])*t, BASE)
usb_pts = [alr(pr0, 0, -24), alr(pr0, 0, 24), clip_base(alr(pr0, 0, 24), alr(pr0, -40, 24)), clip_base(alr(pr0, 0, -24), alr(pr0, -40, -24))]
furos = [[alr(pr0, -10, n-5), alr(pr0, -10, n+5), alr(pr0, -18, n+5), alr(pr0, -18, n-5)] for n in (-10, 10)]
obj("A", "pen-drive",
    F(poly(usb_pts)), *[C(poly(p)) for p in furos],
    F(poly(corpo)), F(poly(tampa)), F(poly(tampa2)),
    L(line(alr(pr0, 112, -14), alr(pr0, 48, -14))),
    L(poly([alr(pr0, 70, -6), alr(pr0, 78, 4), alr(pr0, 74, 18), alr(pr0, 30, 18)], close=False)),
    L(line(alr(pr0, 74, 4), alr(pr0, 22, 4))))

# bateria (barra do A)
obj("A", "bateria",
    F(poly([(1198, 1023), (1206, 1023), (1206, 1049), (1198, 1049)])),
    F(poly([(1206, 1011), (1328, 1011), (1334, 1063), (1206, 1063)])),
    L(poly([(1222, 1020), (1318, 1020), (1322, 1054), (1222, 1054)])),
    L(line((1254, 1020), (1254, 1054))), L(line((1286, 1020), (1286, 1054))))

# microfone (braço esquerdo superior) — eixo paralelo ao lápis (21°)
mc, mr = (1214, 886), 35
ma, mb = along(mc, 30, 0), along(mc, -30, 0)
def mic_pt(s_, n_): return along(mc, s_, n_)
grade = [L(line(mic_pt(-36, n), mic_pt(-58, n))) for n in (-14, 0, 14)]
riscos = [L(line(mic_pt(t, -35), mic_pt(t, -24))) for t in (14, 4, -6)] + [L(line(mic_pt(t, 35), mic_pt(t, 24))) for t in (-4, -14, -24)]
obj("A", "microfone",
    F(poly([(1222, 775), (1305, 775), (1301, 790), (1218, 790)])),
    F(poly([(1238, 790), (1249, 790), (1241, 822), (1230, 822)])),
    F(f"M{pt(mic_pt(10, -46))}" + arc3(mic_pt(10, -46), mic_pt(30 + 46, 0), mic_pt(10, 46)) + f" L{pt(mic_pt(-12, 46))} L{pt(mic_pt(-12, 37))} L{pt(mic_pt(10, 37))}" +
      arc3(mic_pt(10, 37), mic_pt(30 + 37, 0), mic_pt(10, -37)) + " Z"),
    F(capsule(ma, mb, mr)),
    *grade, *riscos)

# controle de videogame (braço direito superior)
ctl = [(1300, 776), (1374, 972), (1340, 978), (1318, 975), (1300, 960), (1303, 945), (1296, 938),
       (1293, 905), (1275, 862), (1270, 850), (1262, 800), (1278, 780)]
obj("A", "controle",
    F("M1290 776 L1372 972" + arc3((1372, 972), (1345, 980), (1318, 974)) +
      " L1300 958 L1303 946 L1296 938 L1294 905 L1278 862 L1271 850" + arc3((1271, 850), (1262, 818), (1270, 792)) +
      arc3((1270, 792), (1279, 780), (1290, 776)) + " Z"),
    *[C(poly(rot(p, (1288, 816), 0))) for p in [
        [(1284, 798), (1293, 798), (1288, 806)], [(1278, 812), (1278, 821), (1270, 816)],
        [(1298, 812), (1298, 821), (1306, 816)], [(1284, 834), (1293, 834), (1288, 826)]]],
    *[R(circle(c, 6)) for c in [(1335, 942), (1324, 956), (1346, 956), (1335, 970)]],
    L(line((1303, 870), (1320, 910))), L(line((1302, 840), (1320, 830))), L(line((1326, 915), (1344, 915))))

# ===== S =====
gear_c = (1501, 886)
dentes = []
nT, r_body, r_tooth = 8, 47, 58
d_g = ""
for i in range(nT):
    a = -90 + i * 360 / nT
    w_body, w_tip = 13, 11
    pts = [pol(gear_c, r_body, a - w_body), pol(gear_c, r_tooth, a - w_tip * 0.8), pol(gear_c, r_tooth, a + w_tip * 0.8), pol(gear_c, r_body, a + w_body)]
    nxt = pol(gear_c, r_body, a + 360 / nT - w_body)
    seg = (f"M{pt(pts[0])}" if i == 0 else f" L{pt(pts[0])}") + f" L{pt(pts[1])} L{pt(pts[2])} L{pt(pts[3])} A{r_body} {r_body} 0 0 1 {pt(nxt)}"
    d_g += seg
obj("S", "engrenagem", F(d_g + " Z"), R(circle(gear_c, 25)))

onda_dot = (1526, 822)
ondas = []
for cx, cy in [(1549, 815), (1572, 805), (1596, 799), (1621, 797)]:
    c0 = (cx - 38, cy)
    ondas.append(F(sector(c0, 38, 25, -52, 52)))
obj("S", "ondas", R(circle(onda_dot, 10)), *ondas)

# luminária / sino (dúvida)
obj("S", "luminaria",
    F("M1632 770 L1697 788" + arc3((1697, 788), (1680, 808), (1648, 805)) + arc3((1648, 805), (1636, 790), (1632, 770)) + " Z"),
    F(capsule((1665, 815), (1683, 836), 5.5)),
    F(capsule((1686, 834), (1708, 834), 5.5)),
    R(circle((1680, 836), 7.5)),
    F(f"M1680 893 L1755 893" + arc3((1755, 893), (1745, 858), (1718, 848)) + arc3((1718, 848), (1690, 858), (1683, 885)) + " Z"),
    R(circle((1716, 903), 8)),
    F(poly([(1712, 893), (1720, 893), (1720, 897), (1712, 897)])))

# teclado (espinha do S)
k_tl, k_tr, k_br, k_bl = (1548, 906), (1712, 963), (1676, 1022), (1499, 952)
def lerp(a, b, t): return (a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t)
teclas = []
n = 11
for i in range(1, n):
    t = i / n
    teclas.append(L(line(lerp(k_tl, k_tr, t), lerp(k_bl, k_br, t))))
pretas = []
for i in (1, 2, 4, 5, 6, 8, 9):
    t = i / n
    c_top = lerp(k_tl, k_tr, t); c_bot = lerp(k_bl, k_br, t)
    w = 0.32 / n
    a1, a2 = lerp(k_tl, k_tr, t - w), lerp(k_tl, k_tr, t + w)
    b1, b2 = lerp(a1, lerp(k_bl, k_br, t - w), 0.55), lerp(a2, lerp(k_bl, k_br, t + w), 0.55)
    pretas.append(C(poly([a1, a2, b2, b1])))
obj("S", "teclado-musical",
    F(f"M{pt(k_tl)}" + arc3(k_tl, (1632, 928), k_tr) + f" L{pt(k_br)}" + arc3(k_br, (1590, 993), k_bl) + " Z"),
    *teclas, *pretas)

# lâmpada
obj("S", "lampada",
    F("M1712 1095 L1735 1095" + arc3((1735, 1095), (1740, 1075), (1752, 1060)) + arc3((1752, 1060), (1718, 1003), (1686, 1060)) +
      arc3((1686, 1060), (1700, 1075), (1705, 1095)) + " Z"),
    F(poly([(1708, 1095), (1738, 1095), (1736, 1115), (1710, 1115)])),
    L(poly([(1713, 1095), (1708, 1040), (1712, 1028), (1716, 1038), (1721, 1027), (1725, 1038), (1730, 1027), (1734, 1038), (1738, 1028), (1732, 1095)], close=False)))

# papel rasgado
def zig(a, b, n, amp):
    pts = []
    for i in range(n * 2 + 1):
        t = i / (n * 2); p = lerp(a, b, t)
        dx, dy = b[0]-a[0], b[1]-a[1]; Lr = math.hypot(dx, dy)
        s = amp if i % 2 else 0
        pts.append((p[0] - dy/Lr*s, p[1] + dx/Lr*s))
    return pts
top_z = zig((1450, 1040), (1516, 1048), 4, 14)
side_z = zig((1590, 1112), (1578, 1166), 4, 12)
obj("S", "papel-rasgado",
    F(poly(top_z, close=False) + arc3((1516, 1048), (1545, 1093), side_z[0]) + " L" + " L".join(pt(p) for p in side_z[1:]) +
      arc3(side_z[-1], (1495, 1135), (1450, 1040)) + " Z"))

# objeto curvo com telas (base do S) — dúvida
obj("S", "telas-curvas",
    F("M1596 1115" + arc3((1596, 1115), (1640, 1110), (1676, 1097)) + " L1724 1127" + arc3((1724, 1127), (1660, 1158), (1593, 1164)) + " Z"),
    L(poly([(1602, 1122), (1640, 1118), (1655, 1152), (1600, 1157)])),
    L(poly([(1652, 1117), (1686, 1110), (1716, 1131), (1666, 1146)])),
    C(poly(rot([(1678, 1129), (1695, 1129), (1695, 1135), (1678, 1135)], (1686, 1132), -18))))

# ===== E =====
obj("E", "cursor",
    F(poly([(1796, 777), (1848, 776), (1822, 792), (1838, 808), (1829, 816), (1812, 802), (1799, 822)])))
obj("E", "braco-articulado",
    F("M1797 840" + arc3((1797, 840), (1821, 864), (1797, 889)) + " Z"),
    F(capsule((1813, 852), (1866, 806), 5)),
    R(circle((1838, 830), 7)),
    F("M1890 780" + arc3((1890, 780), (1864, 809), (1890, 838)) + " Z"))
obj("E", "pilha",
    F(poly([(1892, 778), (2068, 780), (2068, 830), (1895, 832)])),
    L(line((2050, 779), (2050, 831))),
    F(poly([(2068, 790), (2083, 790), (2083, 816), (2068, 816)])))
obj("E", "giz-de-cera",
    F(f"M1866 940" + arc3((1866, 940), (1960, 937), (2052, 942)) + " L2052 990 L1866 990 Z"),
    F(poly([(1866, 942), (1824, 965), (1866, 988)])),
    L(line((1888, 944), (1888, 990))), L(line((2020, 945), (2020, 990))))
obj("E", "blocos-em-l",
    F(poly([(1797, 902), (1862, 902), (1862, 945), (1866, 945), (1866, 988), (1862, 988), (1862, 1102),
            (2074, 1102), (2074, 1160), (1797, 1160)])),
    L(line((1797, 970), (1830, 970))), L(line((1806, 1038), (1856, 1038))),
    L(line((1797, 1102), (1862, 1102))), L(line((1862, 1102), (1862, 1160))),
    L(line((1935, 1102), (1935, 1160))), L(line((2002, 1102), (2002, 1160))),
    R(circle((1830, 1131), 10)))

# ===== 8 =====
oc = (2262, 870)   # centro do bojo superior
obj("8", "fone",
    F(f"M2126 838" + arc3((2126, 838), (2148, 802), (2186, 784)) + " L2201 830" + arc3((2201, 830), (2178, 836), (2165, 858)) + " Z"),
    *[C(f"M{pt(c)} m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0") for c in [(2164, 806), (2183, 825)]],
    L(line((2160, 808), (2146, 822))), L(line((2179, 827), (2165, 841))),
    F(poly([(2111, 828), (2180, 852), (2178, 890), (2110, 902)])),
    F(f"M2135 900 L2150 898" + arc3((2150, 898), (2152, 925), (2143, 952)) + arc3((2143, 952), (2132, 945), (2140, 920)) + " Z"))
obj("8", "pilha-curva",
    F(f"M2228 773" + arc3((2228, 773), (2370, 860), (2329, 951)) + " L2293 900" + arc3((2293, 900), (2297, 860), (2229, 823)) + " Z"),
    F(f"M2293 900 L2329 951" + arc3((2329, 951), (2290, 968), (2236, 968)) + " L2236 937" + arc3((2236, 937), (2270, 925), (2293, 900)) + " Z"),
    F(poly([(2215, 778), (2228, 776), (2228, 820), (2217, 820)])),
    F(poly([(2222, 942), (2236, 942), (2236, 968), (2222, 968)])),
    L(line((2257, 952), (2283, 946))), L(line((2268, 938), (2272, 962))))
obj("8", "aviao-de-papel",
    F("M2103 1008" + arc3((2103, 1008), (2137, 980), (2188, 955)) + " L2210 985 L2170 1020" + arc3((2170, 1020), (2140, 996), (2103, 1008)) + " Z"),
    L(poly([(2188, 955), (2165, 980), (2170, 1020)], close=False)), L(line((2165, 980), (2210, 985))))
obj("8", "bola-8",
    R(circle((2131, 1050), 37)), R(circle((2130, 1050), 21)),
    L("M2130 1049 m-6 -8 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M2130 1049 m-7 8 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0"))
obj("8", "etiqueta-vi",
    F("M2272 992" + arc3((2272, 992), (2305, 975), (2335, 963)) + arc3((2335, 963), (2382, 1030), (2367, 1100)) +
      " L2352 1090" + arc3((2352, 1090), (2326, 1081), (2300, 1077)) + arc3((2300, 1077), (2296, 1033), (2272, 992)) + " Z"),
    L("M2290 995" + arc3((2290, 995), (2313, 984), (2337, 976)) + arc3((2337, 976), (2370, 1032), (2358, 1085)) +
      arc3((2358, 1085), (2333, 1076), (2310, 1071)) + arc3((2310, 1071), (2308, 1032), (2290, 995)) + " Z"),
    L(poly([(2315, 992), (2325, 1008), (2337, 987)], close=False)),
    L(line((2327, 1024), (2332, 1050))),
    F(poly(rot([(2333, 1073), (2353, 1073), (2353, 1093), (2333, 1093)], (2343, 1083), 25))))
bc = (2215, 950)
obj("8", "monitor-curvo",
    F(f"M2113 1113 L2177 1086" + arc3((2177, 1086), (2240, 1113), (2300, 1090)) + " L2338 1134" +
      arc3((2338, 1134), (2235, 1170), (2113, 1113)) + " Z"),
    L(f"M2177 1110" + arc3((2177, 1110), (2238, 1128), (2296, 1112)) + " L2308 1135" + arc3((2308, 1135), (2240, 1153), (2160, 1140)) + " Z"))

# ===== polvo (construído sobre g) =====
H = (496, 889)                      # centro da cabeça
def gp(x, y): return (H[0] + x*G, H[1] + y*G)
R_cab = 11 * G
Fc = gp(0, 12)                    # centro do leque dos tentáculos
r1, r2, hb, ht = 4.25 * G, 12.5 * G, 1.75 * G, 0.4 * G
def dirv(th):  # th em graus a partir de "para baixo", positivo para a direita
    a = math.radians(th); return (math.sin(a), math.cos(a))
def tentaculo(th):
    dv = dirv(th); pv = (dv[1], -dv[0])
    a1 = (Fc[0] + dv[0]*r1 + pv[0]*ht, Fc[1] + dv[1]*r1 + pv[1]*ht)
    a2 = (Fc[0] + dv[0]*r1 - pv[0]*ht, Fc[1] + dv[1]*r1 - pv[1]*ht)
    b1 = (Fc[0] + dv[0]*r2 + pv[0]*hb, Fc[1] + dv[1]*r2 + pv[1]*hb)
    b2 = (Fc[0] + dv[0]*r2 - pv[0]*hb, Fc[1] + dv[1]*r2 - pv[1]*hb)
    return poly([a1, b1, b2, a2])
def gancho(lado):  # tentáculo lateral curvo (sob o olho)
    s = lado
    ap = (Fc[0] + dirv(s*106)[0]*r1, Fc[1] + dirv(s*106)[1]*r1)
    dv = dirv(s*106); pv = (dv[1], -dv[0])
    ob = (Fc[0] + dv[0]*14*G + pv[0]*hb*s, Fc[1] + dv[1]*14*G + pv[1]*hb*s)  # borda de baixo
    ot = (Fc[0] + dv[0]*14*G - pv[0]*hb*s, Fc[1] + dv[1]*14*G - pv[1]*hb*s)  # borda de cima
    mb = sag(ap, ob, -1.1*G*s); mt = sag(ap, ot, -1.4*G*s)
    return f"M{pt(ap)}" + arc3(ap, mb, ob) + f" L{pt(ot)}" + arc3(ot, mt, ap) + " Z", (ap, ob, ot, mb, mt)
olho_c = {-1: gp(-7, 4.5), 1: gp(7, 4.5)}
pup_c = {-1: gp(-7, 4.5), 1: gp(7, 4.5)}
TILT_OLHO, TILT_PUP = 20, 40
polvo = [("cabeca", [R(circle(H, R_cab))])]
for s, nome in ((-1, "esquerdo"), (1, "direito")):
    polvo.append((f"tentaculo-lateral-{nome}", [F(gancho(s)[0])]))
for th in (-80, -50, -20, 20, 50, 80):
    lado = "esquerdo" if th < 0 else "direito"
    ordem = {20: "1", 50: "2", 80: "3"}[abs(th)]
    polvo.append((f"tentaculo-{ordem}-{lado}", [F(tentaculo(th))]))
for s, nome in ((-1, "esquerdo"), (1, "direito")):
    polvo.append((f"olho-{nome}", [R(ellipse(olho_c[s], 3.25*G, 4.25*G, -s*TILT_OLHO))]))
    pc_ = pup_c[s]; Lp, Wp = 3.75*G, 1.0*G
    polvo.append((f"pupila-{nome}", [C(f'M{pt(pc_)}') if False else ("cheio_raw",
        f'<rect x="{f(pc_[0]-Wp/2)}" y="{f(pc_[1]-Lp/2)}" width="{f(Wp)}" height="{f(Lp)}" rx="{f(Wp/2)}" transform="rotate({f(-s*TILT_PUP)} {pt(pc_)})"/>')]))
for nome, partes in polvo:
    objetos.append(("polvo", nome, partes))

# ---------- saída ----------
NOMES_LETRA = {"polvo": "polvo", "B": "letra-B", "A": "letra-A", "S": "letra-S", "E": "letra-E", "8": "numero-8"}
ORDEM = ["polvo", "B", "A", "S", "E", "8"]

def render_parte(tipo, cont):
    if tipo == "forma":
        return f'<path d="{cont}" fill="#FFFFFF" stroke="{NOITE}" stroke-width="{SW}" stroke-linejoin="round"/>'
    if tipo == "linha":
        return f'<path d="{cont}" fill="none" stroke="{NOITE}" stroke-width="{SWD}" stroke-linecap="round" stroke-linejoin="round"/>'
    if tipo == "cheio":
        return f'<path d="{cont}" fill="{NOITE}" stroke="{NOITE}" stroke-width="1" stroke-linejoin="round"/>'
    if tipo == "cheio_raw":
        return cont.replace("/>", f' fill="{NOITE}"/>')
    if tipo == "raw":
        return cont.replace("/>", f' fill="#FFFFFF" stroke="{NOITE}" stroke-width="{SW}"/>')
    raise ValueError(tipo)

def svg_logo(fundo=None, so=None, vb=(300, 735, 2120, 470)):
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" width="{vb[2]}" height="{vb[3]}">',
           '<title>BASE8 — logo (rodada 9)</title>']
    if fundo:
        out.append(fundo)
    else:
        out.append(f'<rect id="fundo" x="{vb[0]}" y="{vb[1]}" width="{vb[2]}" height="{vb[3]}" fill="#FFFFFF"/>')
    for letra in ORDEM:
        if so and letra not in so: continue
        out.append(f'<g id="{NOMES_LETRA[letra]}">')
        for l, nome, partes in objetos:
            if l != letra: continue
            out.append(f'<g id="{nome}">' + "".join(render_parte(t, c) for t, c in partes) + '</g>')
        out.append('</g>')
    out.append('</svg>')
    return "\n".join(out)

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, "base8-logo.svg"), "w").write(svg_logo())
foto = sys.argv[2] if len(sys.argv) > 2 else None
if foto:
    bg = f'<rect x="0" y="0" width="2732" height="2048" fill="#fff"/><image href="file://{foto}" x="0" y="0" width="2732" height="2048" opacity="0.55"/>'
    s = svg_logo(fundo=bg).replace('fill="#FFFFFF" stroke', 'fill="none" stroke').replace(f'stroke="{NOITE}"', 'stroke="#E5007E"').replace(f'fill="{NOITE}"', 'fill="#E5007E"')
    open(os.path.join(OUT, "_sobreposicao.svg"), "w").write(s)

# exporta dados do polvo para a prancha de construção
import json
json.dump({"G": G, "H": H, "Fc": Fc, "R_cab": R_cab, "r1": r1, "r2": r2,
           "olhos": {str(k): v for k, v in olho_c.items()}, "pupilas": {str(k): v for k, v in pup_c.items()},
           "ganchos": {str(s): gancho(s)[1] for s in (-1, 1)}},
          open(os.path.join(OUT, "_polvo.json"), "w"))
print("ok", len(objetos), "objetos")

# ---------- polvo: peça limpa e prancha de construção ----------
def pecas_polvo():
    return "".join(f'<g id="{nome}">' + "".join(render_parte(t, c) for t, c in partes) + '</g>'
                   for l, nome, partes in objetos if l == "polvo")
PV = (H[0] - 19*G, H[1] - 13.5*G, 38*G, 44*G)
vb = " ".join(f(v) for v in PV)
open(os.path.join(OUT, "polvo.svg"), "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><title>Polvo — símbolo (rodada 9)</title>'
    f'<rect id="fundo" x="{f(PV[0])}" y="{f(PV[1])}" width="{f(PV[2])}" height="{f(PV[3])}" fill="#FFFFFF"/>'
    f'<g id="polvo">{pecas_polvo()}</g></svg>')

ROSA = "#FF48B0"; AZ = "#0B8FE0"
cs = []
def cl(d, cor=AZ, w=0.9, dash=None, op=1):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    cs.append(f'<path d="{d}" fill="none" stroke="{cor}" stroke-width="{w}" opacity="{op}"{da}/>')
def cc(c, r, cor=AZ, w=0.9, dash=None):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    cs.append(f'<circle cx="{f(c[0])}" cy="{f(c[1])}" r="{f(r)}" fill="none" stroke="{cor}" stroke-width="{w}"{da}/>')
def tx(p, s, cor=ROSA, size=7.5, anchor="start"):
    cs.append(f'<text x="{f(p[0])}" y="{f(p[1])}" font-family="Figtree, Helvetica, Arial, sans-serif" font-size="{size}" fill="{cor}" text-anchor="{anchor}">{s}</text>')
# grade de 1 g (linhas fortes a cada 4 g)
x0, y0, W_, H_ = PV
for i in range(0, 39):
    x = H[0] + (i - 19) * G
    cl(f"M{f(x)} {f(y0)} V{f(y0 + H_)}", NOITE, 0.6 if i % 4 == 0 else 0.3, op=0.25 if i % 4 == 0 else 0.1)
for j in range(0, 45):
    y = H[1] + (j - 13.5) * G
    cl(f"M{f(x0)} {f(y)} H{f(x0 + W_)}", NOITE, 0.6 if j % 4 == 0 else 0.3, op=0.25 if j % 4 == 0 else 0.1)
# eixos
cl(f"M{f(H[0])} {f(y0)} V{f(y0 + H_)}", ROSA, 0.9, "6 4")
cl(f"M{f(x0)} {f(H[1])} H{f(x0 + W_)}", ROSA, 0.6, "6 4")
cl(f"M{f(x0)} {f(TOPO)} H{f(x0 + W_)}", ROSA, 0.6, "2 3"); tx((x0 + 4, TOPO - 4), "topo das letras")
cl(f"M{f(x0)} {f(BASE)} H{f(x0 + W_)}", ROSA, 0.6, "2 3"); tx((x0 + 4, BASE - 4), "linha de base")
# cabeça
cc(H, R_cab); cl(f"M{pt(H)} L{pt(pol(H, R_cab, -45))}"); tx(pol(H, R_cab * 0.55, -52), "R 11 g")
# olhos: eixos inclinados
for s in (-1, 1):
    c = olho_c[s]
    cl(f"M{pt(H)} L{pt(c)}", AZ, 0.6, "3 3")
    a = math.radians(-s * TILT_OLHO); ux, uy = math.sin(a), -math.cos(a)
    cl(f"M{f(c[0] - ux*6*G)} {f(c[1] - uy*6*G)} L{f(c[0] + ux*6*G)} {f(c[1] + uy*6*G)}", ROSA, 0.7, "4 3")
    a2 = math.radians(-s * TILT_PUP); vx, vy = math.sin(a2), -math.cos(a2)
    cl(f"M{f(c[0] - vx*3.5*G)} {f(c[1] - vy*3.5*G)} L{f(c[0] + vx*3.5*G)} {f(c[1] + vy*3.5*G)}", AZ, 0.7)
    cs.append(f'<circle cx="{f(c[0])}" cy="{f(c[1])}" r="1.8" fill="{ROSA}"/>')
tx((olho_c[1][0] + 4.5*G, olho_c[1][1] - 4*G), "olho 6,5 × 8,5 g · 20°")
tx((olho_c[1][0] + 4.5*G, olho_c[1][1] - 4*G + 9), "pupila 1 × 3,75 g · 40°")
tx((olho_c[-1][0] - 4.5*G, olho_c[-1][1] - 5*G), "olhos em (±7 g, 4,5 g)", anchor="end")
# leque
cc(Fc, r1, AZ, 0.8, "3 3"); cc(Fc, r2, AZ, 0.8, "3 3"); cc(Fc, 14*G, AZ, 0.6, "1 3")
cs.append(f'<circle cx="{f(Fc[0])}" cy="{f(Fc[1])}" r="2.2" fill="{ROSA}"/>')
tx((Fc[0] + 3, Fc[1] - 3), "F (0, 12 g)")
for th in (-106, -80, -50, -20, 20, 50, 80, 106):
    d = dirv(th); e = (Fc[0] + d[0]*15*G, Fc[1] + d[1]*15*G)
    cl(f"M{pt(Fc)} L{pt(e)}", ROSA, 0.6, "5 3")
    if th > 0: tx((e[0] + 2, e[1] + 3), f"{th}°")
tx((Fc[0] + 2, Fc[1] + r1 + 9), "r 4,25 g")
tx((Fc[0] + 4, Fc[1] + r2 + 9), "r 12,5 g")
ge = gancho(-1)[1]
for p in ge[3:]:
    cs.append(f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="1.6" fill="{AZ}"/>')
tx((x0 + 4, y0 + H_ - 16), "módulo g = altura das letras ÷ 32 · tentáculos: base 3,5 g, ponta 0,8 g, eixos a 20°, 50°, 80°")
tx((x0 + 4, y0 + H_ - 6), "laterais: arcos de 3 pontos no eixo de 106°, ponta em r 4,25 g, base em r 14 g")
open(os.path.join(OUT, "polvo-construcao.svg"), "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"><title>Polvo — construção (rodada 9)</title>'
    f'<rect id="fundo" x="{f(PV[0])}" y="{f(PV[1])}" width="{f(PV[2])}" height="{f(PV[3])}" fill="#FFFFFF"/>'
    f'<g id="arte" opacity="0.9">{pecas_polvo()}</g><g id="construcao">{"".join(cs)}</g></svg>')
