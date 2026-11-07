// Bola 8 — logo construída a partir do rascunho (fontes/rascunho-bola-8.png).
// Abre um documento NOVO; não fecha nem altera documentos abertos.
//
// Sistema de medidas (R = raio externo):
//   círculo interno  r = R / φ                      (≈ 0,618 R)
//   folgas do anel   topo : base = 1 : φ²           → círculo interno sobe d ≈ 0,171 R
//   o "8"            dois círculos r1 = 0,20 r e r2 = 0,25 r (4 : 5), vão g = 0,05 r,
//                    ligados pelas tangentes internas (o X do meio, como no rascunho),
//                    achatado a 90% na vertical e com leve subida ótica de 0,03 r.

#target illustrator

var PHI = (1 + Math.sqrt(5)) / 2;
var R = 400;                         // pt
var r = R / PHI;
var gapSum = 2 * (R - r);
var gapTop = gapSum / (1 + PHI * PHI);
var innerY = R - gapTop - r;         // centro do círculo interno (y para cima)

var r1 = 0.20 * r, r2 = 0.25 * r, g = 0.05 * r;
var SY = 0.90;                       // achatamento vertical do 8
var LIFT = 0.03 * r;

var STROKE = 22;                     // espessura da versão linear

function rgb(hex) {
  var c = new RGBColor();
  c.red = parseInt(hex.substr(1, 2), 16);
  c.green = parseInt(hex.substr(3, 2), 16);
  c.blue = parseInt(hex.substr(5, 2), 16);
  return c;
}
var NOITE = rgb("#1B1F3B"), BRANCO = rgb("#FFFFFF"), VERDE = rgb("#12A180");
var GUIA = rgb("#0B8FE0"), ROSA = rgb("#FF48B0"), CINZA = rgb("#C9CED8");

// ---------- geometria ----------
// Arco de a0 a a1 (graus, sentido anti-horário se a1 > a0) em segmentos Bézier.
function arc(cx, cy, rad, a0, a1) {
  var segs = [], n = Math.ceil(Math.abs(a1 - a0) / 90), step = (a1 - a0) / n;
  for (var i = 0; i < n; i++) {
    var t0 = (a0 + step * i) * Math.PI / 180, t1 = (a0 + step * (i + 1)) * Math.PI / 180;
    var k = 4 / 3 * Math.tan((t1 - t0) / 4);
    var p0 = [cx + rad * Math.cos(t0), cy + rad * Math.sin(t0)];
    var p3 = [cx + rad * Math.cos(t1), cy + rad * Math.sin(t1)];
    var c1 = [p0[0] - k * rad * Math.sin(t0), p0[1] + k * rad * Math.cos(t0)];
    var c2 = [p3[0] + k * rad * Math.sin(t1), p3[1] - k * rad * Math.cos(t1)];
    segs.push([p0, c1, c2, p3]);
  }
  return segs;
}

// Oito: devolve nós {a, i, o} (âncora, alça de entrada, alça de saída) em coordenadas locais.
function eightGeometry() {
  var c1y = g / 2 + r1, c2y = -(g / 2 + r2);
  var py = c1y - (c1y - c2y) * r1 / (r1 + r2);     // cruzamento P
  var alpha = Math.acos(r1 / (c1y - py)) * 180 / Math.PI;
  var top = arc(0, c1y, r1, -90 + alpha, 270 - alpha);       // anti-horário, por cima
  var bot = arc(0, c2y, r2, 90 - alpha, -270 + alpha);       // horário, por baixo
  var nodes = [];
  function pushSegs(segs) {
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (i === 0) nodes.push({ a: s[0], i: s[0], o: s[1] });
      else nodes[nodes.length - 1].o = s[1];
      nodes.push({ a: s[3], i: s[2], o: s[3] });
    }
  }
  pushSegs(top);   // termina em T1L; reta até T2R (início do arco de baixo)
  pushSegs(bot);   // termina em T2L; reta fechando até T1R
  // bbox vertical para centralizar
  var yTop = c1y + r1, yBot = c2y - r2, mid = (yTop + yBot) / 2;
  return { nodes: nodes, mid: mid, c1y: c1y, c2y: c2y, py: py, alpha: alpha, yTop: yTop, yBot: yBot };
}
var E = eightGeometry();

// transforma ponto local do 8 para coordenadas da bola (centro 0,0)
function eightPt(p) {
  return [p[0], (p[1] - E.mid) * SY + innerY + LIFT];
}

// ---------- desenho ----------
var doc = app.documents.add(DocumentColorSpace.RGB, 1200, 1200);
var AB = 1200, GAP = 120;
doc.artboards[0].artboardRect = [0, 0, 1200, -1200];
var names = ["construcao", "linear", "solida", "solida-verde", "tamanhos"];
for (var i = 1; i < names.length; i++) {
  var x = i * (AB + GAP);
  doc.artboards.add([x, 0, x + AB, -AB]);
}
for (var i = 0; i < names.length; i++) doc.artboards[i].name = names[i];

function center(i) { return [i * (AB + GAP) + AB / 2, -AB / 2]; }

function noFill(p) { p.filled = false; }
function circle(layer, cx, cy, rad) {
  var c = layer.pathItems.ellipse(cy + rad, cx - rad, rad * 2, rad * 2);
  return c;
}
function line(layer, a, b) {
  var p = layer.pathItems.add();
  p.setEntirePath([a, b]);
  p.filled = false;
  return p;
}
function strokeIt(p, col, w) { p.stroked = true; p.strokeColor = col; p.strokeWidth = w; }

function drawEight(layer, ox, oy, s) {
  var p = layer.pathItems.add();
  for (var i = 0; i < E.nodes.length; i++) {
    var n = E.nodes[i], pt = p.pathPoints.add();
    var a = eightPt(n.a), ii = eightPt(n.i), oo = eightPt(n.o);
    pt.anchor = [ox + a[0] * s, oy + a[1] * s];
    pt.leftDirection = [ox + ii[0] * s, oy + ii[1] * s];
    pt.rightDirection = [ox + oo[0] * s, oy + oo[1] * s];
    pt.pointType = PointType.SMOOTH;
  }
  p.closed = true;
  p.filled = false;
  p.name = "oito";
  return p;
}

var fontReg, fontBold;
try { fontReg = app.textFonts.getByName("InstrumentSans-Regular"); } catch (e) {}
try { fontBold = app.textFonts.getByName("InstrumentSans-SemiBold"); } catch (e) {}
function label(layer, txt, x, y, size, col, just) {
  var t = layer.textFrames.pointText([x, y]);
  t.contents = txt;
  var a = t.textRange.characterAttributes;
  a.size = size || 14; a.fillColor = col || GUIA;
  if (fontReg) a.textFont = fontReg;
  if (just) t.textRange.paragraphAttributes.justification = just;
  return t;
}

// Logo completa em (cx, cy) com escala s. mode: "linear" | "solida"
function drawLogo(layer, cx, cy, s, mode, ringColor, numColor) {
  var grp = layer.groupItems.add();
  grp.name = "bola8-" + mode;
  if (mode === "linear") {
    var o = circle(grp, cx, cy, R * s); noFill(o); strokeIt(o, ringColor, STROKE * s); o.name = "anel";
    var n = circle(grp, cx, cy + innerY * s, r * s); noFill(n); strokeIt(n, ringColor, STROKE * s); n.name = "disco";
  } else {
    var o2 = circle(grp, cx, cy, R * s); o2.filled = true; o2.fillColor = ringColor; o2.stroked = false; o2.name = "bola";
    var n2 = circle(grp, cx, cy + innerY * s, r * s); n2.filled = true; n2.fillColor = BRANCO; n2.stroked = false; n2.name = "disco";
  }
  var e = drawEight(grp, cx, cy, s); strokeIt(e, numColor, STROKE * s);
  e.strokeJoin = StrokeJoin.ROUNDENDJOIN; e.strokeCap = StrokeCap.ROUNDENDCAP;
  return grp;
}

// ---- 1. Construção ----
var lyRas = doc.layers[0]; lyRas.name = "rascunho";
var lyLogo = doc.layers.add(); lyLogo.name = "logo";
var lyCon = doc.layers.add(); lyCon.name = "construcao";

var c0 = center(0), cx = c0[0], cy = c0[1];

// rascunho por baixo, alinhado pelo círculo externo (centro ≈ 585,700 px; raio ≈ 250 px)
try {
  var f = File(File($.fileName).parent.parent.parent + "/fontes/rascunho-bola-8.png");
  var pl = lyRas.placedItems.add(); pl.file = f;
  var k = R / 250;
  pl.width = 1200 * k; pl.height = 1600 * k;
  pl.position = [cx - 585 * k, cy + 700 * k];
  pl.opacity = 35;
} catch (e) {}

var ghost = drawLogo(lyLogo, cx, cy, 1, "linear", CINZA, CINZA);

var W = 0.75;
var ext = R + 90;
strokeIt(line(lyCon, [cx - ext, cy], [cx + ext, cy]), GUIA, W);
strokeIt(line(lyCon, [cx, cy - ext], [cx, cy + ext]), GUIA, W);
strokeIt(line(lyCon, [cx - ext, cy + innerY], [cx + ext, cy + innerY]), GUIA, W);
var cO = circle(lyCon, cx, cy, R); noFill(cO); strokeIt(cO, GUIA, W);
var cI = circle(lyCon, cx, cy + innerY, r); noFill(cI); strokeIt(cI, GUIA, W);
// tangente comum no topo e linhas das folgas
strokeIt(line(lyCon, [cx - ext, cy + R], [cx + ext, cy + R]), GUIA, W);
strokeIt(line(lyCon, [cx - ext, cy - R], [cx + ext, cy - R]), GUIA, W);
strokeIt(line(lyCon, [cx - r - 40, cy + innerY + r], [cx + r + 40, cy + innerY + r]), GUIA, W);
strokeIt(line(lyCon, [cx - r - 40, cy + innerY - r], [cx + r + 40, cy + innerY - r]), GUIA, W);
// raios
strokeIt(line(lyCon, [cx, cy], [cx + R * Math.cos(-Math.PI / 4), cy + R * Math.sin(-Math.PI / 4)]), ROSA, 1.2);
strokeIt(line(lyCon, [cx, cy + innerY], [cx + r * Math.cos(Math.PI * 0.82), cy + innerY + r * Math.sin(Math.PI * 0.82)]), ROSA, 1.2);
// centros
function dot(x, y, col) { var d = lyCon.pathItems.ellipse(y + 4, x - 4, 8, 8); d.filled = true; d.fillColor = col; d.stroked = false; }
dot(cx, cy, ROSA); dot(cx, cy + innerY, ROSA);

// construção do 8
var e1 = eightPt([0, E.c1y]), e2 = eightPt([0, E.c2y]), eP = eightPt([0, E.py]);
var top1 = lyCon.pathItems.ellipse(cy + e1[1] + r1 * SY, cx - r1, r1 * 2, r1 * 2 * SY); noFill(top1); strokeIt(top1, ROSA, W);
var bot1 = lyCon.pathItems.ellipse(cy + e2[1] + r2 * SY, cx - r2, r2 * 2, r2 * 2 * SY); noFill(bot1); strokeIt(bot1, ROSA, W);
dot(cx + e1[0], cy + e1[1], ROSA); dot(cx + e2[0], cy + e2[1], ROSA); dot(cx, cy + eP[1], GUIA);
// tangentes internas estendidas
var a = E.alpha * Math.PI / 180;
var tA = eightPt([r1 * Math.cos(-Math.PI / 2 + a), E.c1y + r1 * Math.sin(-Math.PI / 2 + a)]);
var tB = eightPt([r2 * Math.cos(Math.PI / 2 + a), E.c2y + r2 * Math.sin(Math.PI / 2 + a)]);
function extLine(p, q, m) {
  var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy);
  return line(lyCon, [cx + p[0] - dx / L * m, cy + p[1] - dy / L * m], [cx + q[0] + dx / L * m, cy + q[1] + dy / L * m]);
}
strokeIt(extLine(tA, tB, 40), GUIA, W);
strokeIt(extLine([-tA[0], tA[1]], [-tB[0], tB[1]], 40), GUIA, W);

// rótulos
var Lx = cx + R + 30;
label(lyCon, "R", cx + R * 0.72 * Math.cos(-Math.PI / 4) + 8, cy + R * 0.72 * Math.sin(-Math.PI / 4) + 6, 16, ROSA);
label(lyCon, "r = R / φ", cx - r * 0.75, cy + innerY + 40, 14, ROSA);
label(lyCon, "folga topo  1", Lx, cy + R - (gapTop / 2) + 5, 13, GUIA);
label(lyCon, "folga base  φ²", Lx, cy + innerY - r - ((R - (r - innerY)) / 2) + 5, 13, GUIA);
label(lyCon, "8: r1 = 0,20 r · r2 = 0,25 r (4:5) · tangentes internas", cx - 470, cy - R - 60, 13, GUIA);
label(lyCon, "construção.", cx - 560, cy + 540, 28, rgb("#1B1F3B"));

// ---- 2. Linear ----
var c1 = center(1); drawLogo(lyLogo, c1[0], c1[1], 1, "linear", NOITE, NOITE);
// ---- 3. Sólida ----
var c2 = center(2); drawLogo(lyLogo, c2[0], c2[1], 1, "solida", NOITE, NOITE);
// ---- 4. Sólida verde-água ----
var c3 = center(3); drawLogo(lyLogo, c3[0], c3[1], 1, "solida", VERDE, NOITE);
// ---- 5. Tamanhos ----
var c4 = center(4), sizes = [1, 0.5, 0.25, 0.12, 0.06], xx = c4[0] - 560;
for (var i = 0; i < sizes.length; i++) {
  var s = sizes[i] * 0.55;
  drawLogo(lyLogo, xx + R * s, c4[1] + 230, s, "solida", NOITE, NOITE);
  drawLogo(lyLogo, xx + R * s, c4[1] - 330, s, "linear", NOITE, NOITE);
  xx += 2 * R * s + 50;
}

// exporta PNGs para conferência
var out = File($.fileName).parent;
for (var i = 0; i < names.length; i++) {
  doc.artboards.setActiveArtboardIndex(i);
  var opt = new ExportOptionsPNG24();
  opt.artBoardClipping = true; opt.antiAliasing = true; opt.transparency = false;
  opt.horizontalScale = 50; opt.verticalScale = 50;
  doc.exportFile(new File(out + "/bola8-" + names[i] + ".png"), ExportType.PNG24, opt);
}
doc.saveAs(new File(out + "/bola8.ai"));
"ok";
