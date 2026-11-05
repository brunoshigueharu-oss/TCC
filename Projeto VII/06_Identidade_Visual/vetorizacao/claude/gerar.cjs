/**
 * Gerador das peças vetoriais (logo e mascote) a partir de um sistema de construção.
 * Tudo é medido em módulos (u). 1u = espessura da armação dos óculos.
 *
 * Uso: NODE_PATH=<pasta com node_modules/paper> node gerar.cjs
 * Dependência: `paper` (só para as operações de união/subtração de formas).
 */
const fs = require('fs');
const path = require('path');
const paper = require('paper/dist/paper-core.js');

paper.setup(new paper.Size(10, 10));
const { Path, Point, Rectangle } = paper;

const U = 10; // px por módulo
const SAIDA = __dirname;
const FONTES = path.join(__dirname, '..', 'fontes');

const COR = { roxo: '#674b7b', roxoMedio: '#523a65', roxoEscuro: '#3d294f', preto: '#211915', branco: '#ffffff' };
const GUIA = { circulo: '#e5007d', eixo: '#0090d4', grade: '#211915' };
const FONTE = 'Helvetica, Arial, sans-serif';

// ---------- utilitários de geometria ----------

const n = (v) => String(Math.round(v * 100) / 100);
const px = (v) => n(v * U);
const P = (x, y) => new Point(x * U, y * U);
const disco = (x, y, r) => new Path.Circle(P(x, y), r * U);
const retangulo = (x, y, w, h) => new Path.Rectangle(new Rectangle(x * U, y * U, w * U, h * U));
const unir = (...itens) => itens.reduce((a, b) => a.unite(b));
const dados = (item) => item.pathData.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (m) => n(parseFloat(m)));

function elipse(cx, cy, rx, ry, graus) {
  const e = new Path.Ellipse({ center: P(cx, cy), radius: [rx * U, ry * U] });
  e.rotate(graus, P(cx, cy));
  return e;
}

/** Cápsula afilada: dois círculos ligados pelas tangentes externas. Retorna o `d` com arcos reais. */
function afilado(x1, y1, r1, x2, y2, r2) {
  const fi = Math.atan2(y2 - y1, x2 - x1);
  const beta = Math.acos((r1 - r2) / Math.hypot(x2 - x1, y2 - y1));
  const pt = (cx, cy, r, ang) => `${px(cx + r * Math.cos(ang))},${px(cy + r * Math.sin(ang))}`;
  const grande = r1 >= r2 ? [0, 1] : [1, 0];
  return [
    `M${pt(x1, y1, r1, fi + beta)}`,
    `L${pt(x2, y2, r2, fi + beta)}`,
    `A${px(r2)},${px(r2)} 0 ${grande[0]} 0 ${pt(x2, y2, r2, fi - beta)}`,
    `L${pt(x1, y1, r1, fi - beta)}`,
    `A${px(r1)},${px(r1)} 0 ${grande[1]} 0 ${pt(x1, y1, r1, fi + beta)}`,
    'Z',
  ].join(' ');
}

// ---------- utilitários de SVG ----------

const circ = (x, y, r, attrs) => `<circle cx="${px(x)}" cy="${px(y)}" r="${px(r)}" ${attrs}/>`;
const ret = (x, y, w, h, attrs) => `<rect x="${px(x)}" y="${px(y)}" width="${px(w)}" height="${px(h)}" ${attrs}/>`;
const linha = (x1, y1, x2, y2, attrs) => `<line x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}" ${attrs}/>`;
const caminho = (d, attrs) => `<path d="${d}" ${attrs}/>`;
const grupo = (id, conteudo, attrs = '') => `<g id="${id}"${attrs ? ' ' + attrs : ''}>\n${conteudo}\n</g>`;
const texto = (x, y, s, attrs = '') =>
  `<text x="${px(x)}" y="${px(y)}" font-family="${FONTE}" ${attrs}>${s}</text>`;

function documento({ caixa, conteudo, titulo, fundo }) {
  const [x, y, w, h] = caixa.map((v) => v * U);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(x)} ${n(y)} ${n(w)} ${n(h)}">`,
    `<title>${titulo}</title>`,
    fundo ? `<rect id="fundo" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fundo}"/>` : '',
    conteudo,
    '</svg>',
    '',
  ].join('\n');
}

const PRINCIPAL = require.main === module;
const gravar = (nome, svg) => {
  if (PRINCIPAL) fs.writeFileSync(path.join(SAIDA, nome), svg, 'utf8');
};

// ---------- MASCOTE ----------
// Origem (0,0): cruzamento do eixo de simetria com a linha dos olhos.

const M = {
  cabeca: { y: -1.5, r: 10 },
  lente: { x: 8, rFora: 7, rDentro: 6 }, // armação = 1u
  olho: { r: 4.5 },
  traco: { w: 4, h: 1 },
  boca: { y: 4.5, r: 1.5 }, // topo tangente à base dos olhos
  // cada tentáculo: círculo de cima (r 1,75) ligado por tangentes ao círculo da ponta (r 0,6)
  tentaculo: {
    rTopo: 1.75,
    rPonta: 0.6,
    yTopo: 6.5,
    fora: { xTopo: 3.5, xPonta: 2.6, fundo: 19 },
    dentro: { xTopo: 1.5, xPonta: 0.85, fundo: 20.5 },
  },
  // braço: faixa entre dois círculos excêntricos; 3u na base, 1,25u na ponta
  braco: { cx: 9.75, cy: 10, rFora: 4.8125, rDentro: 2.6875, desvio: 0.4375, yTopo: 5, anguloFim: -30 },
};

const EXPRESSOES = ['neutro', 'feliz', 'focado', 'triste', 'surpreso'];

function olhosEBoca(expr, p) {
  const tracoAttrs = `fill="none" stroke="${COR.preto}" stroke-width="${px(M.traco.h)}"`;
  const partes = { olhos: [], boca: '' };
  const bocaMeiaLua = (r) =>
    caminho(`M${px(-r)},${px(M.boca.y)} A${px(r)},${px(r)} 0 0 0 ${px(r)},${px(M.boca.y)} Z`, `fill="${COR.branco}"`);

  for (const lado of [-1, 1]) {
    const cx = lado * M.lente.x;
    if (expr === 'neutro') {
      partes.olhos.push(ret(cx - M.traco.w / 2, -M.traco.h / 2, M.traco.w, M.traco.h, `fill="${COR.preto}"`));
    } else if (expr === 'feliz') {
      // arco de raio 2u com centro 1u abaixo da linha dos olhos
      partes.olhos.push(caminho(`M${px(cx - 2)},${px(1)} A${px(2)},${px(2)} 0 0 1 ${px(cx + 2)},${px(1)}`, tracoAttrs));
    } else if (expr === 'focado') {
      // traços a 45°, o mesmo gesto dos olhos da logo
      const k = (M.traco.w / 2) * Math.SQRT1_2;
      partes.olhos.push(linha(cx - k, lado * k, cx + k, -lado * k, tracoAttrs));
    } else if (expr === 'triste') {
      const k = (M.traco.w / 2) * Math.SQRT1_2;
      partes.olhos.push(linha(cx - k, -lado * k * 0.6, cx + k, lado * k * 0.6, tracoAttrs));
    } else if (expr === 'surpreso') {
      partes.olhos.push(circ(cx, 0, 1.25, `fill="${COR.preto}"`));
    }
  }

  if (expr === 'neutro' || expr === 'focado') partes.boca = bocaMeiaLua(M.boca.r);
  if (expr === 'feliz') partes.boca = bocaMeiaLua(2.25);
  if (expr === 'triste') {
    partes.boca = caminho(
      `M${px(-1.5)},${px(6.25)} A${px(1.5)},${px(1.5)} 0 0 1 ${px(1.5)},${px(6.25)}`,
      `fill="none" stroke="${COR.branco}" stroke-width="${px(0.75)}"`
    );
  }
  if (expr === 'surpreso') partes.boca = circ(0, 5.75, 1, `fill="${COR.branco}"`);

  return [
    grupo(`${p}olhos-${expr}`, partes.olhos.join('\n')),
    grupo(`${p}boca-${expr}`, partes.boca),
  ].join('\n');
}

function oculos() {
  const anel = (x) => disco(x, 0, M.lente.rFora).subtract(disco(x, 0, M.lente.rDentro));
  const ponte = retangulo(-1.5, -0.5, 3, 1)
    .subtract(disco(-M.lente.x, 0, M.lente.rDentro))
    .subtract(disco(M.lente.x, 0, M.lente.rDentro));
  return dados(unir(anel(-M.lente.x), anel(M.lente.x), ponte));
}

function tentaculosMascote() {
  const t = M.tentaculo;
  const par = (g) => [-1, 1].map((s) => afilado(s * g.xTopo, t.yTopo, t.rTopo, s * g.xPonta, g.fundo - t.rPonta, t.rPonta));
  return { fora: par(t.fora), dentro: par(t.dentro) };
}

/** Geometria do braço: os dois círculos excêntricos e o círculo que fecha a ponta. */
function geometriaBraco() {
  const b = M.braco;
  const fora = { x: b.cx - b.desvio, y: b.cy, r: b.rFora };
  const dentro = { x: b.cx + b.desvio, y: b.cy, r: b.rDentro };
  const rad = (b.anguloFim * Math.PI) / 180;
  const dx = Math.cos(rad);
  const tFora = -dx * b.desvio + Math.sqrt(dx * dx * b.desvio * b.desvio - b.desvio * b.desvio + b.rFora * b.rFora);
  const tDentro = dx * b.desvio + Math.sqrt(dx * dx * b.desvio * b.desvio - b.desvio * b.desvio + b.rDentro * b.rDentro);
  const tMeio = (tFora + tDentro) / 2;
  const ponta = { x: b.cx + tMeio * dx, y: b.cy + tMeio * Math.sin(rad), r: (tFora - tDentro) / 2 };
  return { fora, dentro, ponta, rad };
}

function bracoMascote() {
  const b = M.braco;
  const g = geometriaBraco();
  const faixa = disco(g.fora.x, g.fora.y, g.fora.r).subtract(disco(g.dentro.x, g.dentro.y, g.dentro.r));
  const setor = new Path({
    segments: [P(b.cx, b.cy), P(b.cx + 20 * Math.cos(g.rad), b.cy + 20 * Math.sin(g.rad)), P(b.cx + 20, b.cy)],
    closed: true,
  });
  const visivel = unir(retangulo(b.cx - 20, b.cy, 40, 20), setor);
  const xEsq = g.fora.x - g.fora.r;
  const haste = retangulo(xEsq, b.yTopo, g.dentro.x - g.dentro.r - xEsq, b.cy - b.yTopo);
  return dados(unir(faixa.intersect(visivel), haste, disco(g.ponta.x, g.ponta.y, g.ponta.r)));
}

function mascote({ prefixo = '', bracos = 'um', expr = 'neutro', soCabeca = false } = {}) {
  const p = prefixo;
  const camadas = [];

  if (!soCabeca) {
    const dBraco = bracoMascote();
    const tent = tentaculosMascote();
    const bracosSvg = [caminho(dBraco, `fill="${COR.roxoEscuro}"`)];
    if (bracos === 'dois') bracosSvg.push(caminho(dBraco, `fill="${COR.roxoEscuro}" transform="scale(-1,1)"`));
    camadas.push(grupo(`${p}bracos`, bracosSvg.join('\n')));
    camadas.push(grupo(`${p}tentaculos-de-tras`, tent.fora.map((d) => caminho(d, `fill="${COR.roxoEscuro}"`)).join('\n')));
    camadas.push(grupo(`${p}tentaculos-da-frente`, tent.dentro.map((d) => caminho(d, `fill="${COR.roxoMedio}"`)).join('\n')));
  }

  camadas.push(
    grupo(
      `${p}cabeca`,
      [
        circ(0, M.cabeca.y, M.cabeca.r, `fill="${COR.roxo}"`),
        circ(-M.lente.x, 0, M.lente.rDentro, `fill="${COR.roxo}"`),
        circ(M.lente.x, 0, M.lente.rDentro, `fill="${COR.roxo}"`),
      ].join('\n')
    )
  );
  camadas.push(
    grupo(
      `${p}brancos-dos-olhos`,
      [circ(-M.lente.x, 0, M.olho.r, `fill="${COR.branco}"`), circ(M.lente.x, 0, M.olho.r, `fill="${COR.branco}"`)].join('\n')
    )
  );
  camadas.push(grupo(`${p}oculos`, caminho(oculos(), `fill="${COR.preto}"`)));
  camadas.push(olhosEBoca(expr, p));

  return grupo(`${p}mascote`, camadas.join('\n'));
}

const CAIXA_MASCOTE = { x0: -15, y0: -11.5, x1: 15, y1: 20.5 };

function construcaoMascote() {
  const c = `fill="none" stroke="${GUIA.circulo}" stroke-width="0.9"`;
  const e = `stroke="${GUIA.eixo}" stroke-width="0.9" stroke-dasharray="8 3 1.5 3"`;
  const t = M.tentaculo;
  const rot = `font-size="10" fill="${GUIA.circulo}"`;
  const itens = [];

  itens.push(linha(0, -14, 0, 23, e), linha(-24, 0, 24, 0, e));
  itens.push(linha(-24, M.boca.y, 24, M.boca.y, `stroke="${GUIA.eixo}" stroke-width="0.6" stroke-dasharray="2 3"`));

  itens.push(circ(0, M.cabeca.y, M.cabeca.r, c));
  for (const x of [-M.lente.x, M.lente.x]) {
    itens.push(circ(x, 0, M.lente.rFora, c), circ(x, 0, M.lente.rDentro, c), circ(x, 0, M.olho.r, c));
    itens.push(linha(x - 0.6, 0, x + 0.6, 0, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
    itens.push(linha(x, -0.6, x, 0.6, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
  }
  itens.push(linha(-0.6, M.cabeca.y, 0.6, M.cabeca.y, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
  itens.push(linha(0, M.cabeca.y - 0.6, 0, M.cabeca.y + 0.6, `stroke="${GUIA.circulo}" stroke-width="0.9"`));

  for (const g of [t.fora, t.dentro]) {
    for (const s of [-1, 1]) {
      itens.push(circ(s * g.xTopo, t.yTopo, t.rTopo, c), circ(s * g.xPonta, g.fundo - t.rPonta, t.rPonta, c));
      itens.push(linha(s * g.xTopo, t.yTopo, s * g.xPonta, g.fundo - t.rPonta, `stroke="${GUIA.eixo}" stroke-width="0.5"`));
    }
  }
  const gb = geometriaBraco();
  itens.push(circ(gb.fora.x, gb.fora.y, gb.fora.r, c), circ(gb.dentro.x, gb.dentro.y, gb.dentro.r, c), circ(gb.ponta.x, gb.ponta.y, gb.ponta.r, c));
  for (const k of [gb.fora, gb.dentro]) {
    itens.push(linha(k.x - 0.4, k.y, k.x + 0.4, k.y, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
    itens.push(linha(k.x, k.y - 0.4, k.x, k.y + 0.4, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
  }

  itens.push(texto(-6.6, -9.6, 'cabeça R10', `${rot} text-anchor="end"`));
  itens.push(texto(-15.2, -5.6, 'armação R7 · r6', `${rot} text-anchor="end"`));
  itens.push(texto(-8, 2.9, 'olho r4,5', `${rot} text-anchor="middle"`));
  itens.push(texto(-6.2, 13, 'tentáculo: r1,75', `${rot} text-anchor="end"`));
  itens.push(texto(-6.2, 14.2, 'até ponta r0,6', `${rot} text-anchor="end"`));
  itens.push(texto(15.2, 13, 'braço: dois círculos', rot));
  itens.push(texto(15.2, 14.2, 'excêntricos, 3u → 1,25u', rot));
  itens.push(texto(24, -0.4, 'linha dos olhos', `font-size="9" fill="${GUIA.eixo}" text-anchor="end"`));
  itens.push(texto(24, M.boca.y - 0.4, 'topo da boca', `font-size="9" fill="${GUIA.eixo}" text-anchor="end"`));
  itens.push(texto(0.5, -8.7, '16u entre centros', `font-size="9" fill="${GUIA.eixo}"`));
  itens.push(linha(-8, -8.2, 8, -8.2, `stroke="${GUIA.eixo}" stroke-width="0.6"`));
  itens.push(linha(-8, -8.6, -8, -7.8, `stroke="${GUIA.eixo}" stroke-width="0.6"`), linha(8, -8.6, 8, -7.8, `stroke="${GUIA.eixo}" stroke-width="0.6"`));

  return grupo('construcao', itens.join('\n'));
}

// ---------- LOGO ----------
// Origem (0,0): centro da cabeça.

const L = {
  cabeca: { r: 10 },
  lente: { x: 5, y: 5 }, // sobre as diagonais a 45°
  gola: { r: 5 * Math.SQRT2 }, // círculo que passa pelo centro da cabeça
  leque: { cy: 10, r: 10, angulos: [18, 54], largura: 3.5 }, // centro na base da cabeça
  elipses: { armacao: [5, 4], lente: [4, 3], brilho: [2.75, 1.75] },
  traco: { w: 3, h: 0.75 },
  ponte: { meiaLargura: 1.5, h: 1 },
};

function silhuetaLogo() {
  const metadeDeBaixo = retangulo(-30, L.lente.y, 60, 40);
  const golas = [-1, 1].map((s) => disco(s * L.lente.x, L.lente.y, L.gola.r).intersect(metadeDeBaixo));
  const limite = disco(0, L.leque.cy, L.leque.r);
  const barras = [];
  for (const ang of L.leque.angulos) {
    for (const s of [-1, 1]) {
      const barra = retangulo(-L.leque.largura / 2, L.leque.cy, L.leque.largura, L.leque.r + 2);
      barra.rotate(-s * ang, P(0, L.leque.cy));
      barras.push(barra.intersect(limite));
    }
  }
  return unir(disco(0, 0, L.cabeca.r), ...golas, ...barras);
}

function logoFiel({ lenteSimples = false } = {}) {
  const el = L.elipses;
  let furos = retangulo(-L.ponte.meiaLargura, L.lente.y - L.ponte.h / 2, 2 * L.ponte.meiaLargura, L.ponte.h);
  let ilhas = null;

  for (const s of [-1, 1]) {
    const x = s * L.lente.x;
    const giro = -s * 45;
    const armacao = elipse(x, L.lente.y, el.armacao[0], el.armacao[1], giro);
    const lente = elipse(x, L.lente.y, el.lente[0], el.lente[1], giro);
    furos = furos.subtract(lente).unite(armacao.subtract(lente));

    const traco = lenteSimples
      ? retangulo(x - 1.75, L.lente.y - 0.5, 3.5, 1)
      : retangulo(x - L.traco.w / 2, L.lente.y - L.traco.h / 2, L.traco.w, L.traco.h);
    traco.rotate(giro, P(x, L.lente.y));

    if (lenteSimples) {
      furos = furos.unite(traco);
    } else {
      furos = furos.unite(elipse(x, L.lente.y, el.brilho[0], el.brilho[1], giro));
      ilhas = ilhas ? ilhas.unite(traco) : traco;
    }
  }

  let logo = silhuetaLogo().subtract(furos);
  if (ilhas) logo = logo.unite(ilhas);
  return dados(logo);
}

const CAIXA_LOGO = { x0: -L.lente.x - L.gola.r, y0: -10, x1: L.lente.x + L.gola.r, y1: 20 };

function construcaoLogo() {
  const c = `fill="none" stroke="${GUIA.circulo}" stroke-width="0.9"`;
  const e = `stroke="${GUIA.eixo}" stroke-width="0.9" stroke-dasharray="8 3 1.5 3"`;
  const fino = `stroke="${GUIA.eixo}" stroke-width="0.6" stroke-dasharray="2 3"`;
  const rot = `font-size="10" fill="${GUIA.circulo}"`;
  const el = L.elipses;
  const itens = [];

  itens.push(linha(0, -13, 0, 23, e), linha(-16, L.lente.y, 16, L.lente.y, e));
  itens.push(linha(-11, -11, 11, 11, fino), linha(11, -11, -11, 11, fino));
  itens.push(ret(-5, -5, 10, 10, `fill="none" stroke="${GUIA.eixo}" stroke-width="0.6"`));

  itens.push(circ(0, 0, L.cabeca.r, c), circ(0, L.leque.cy, L.leque.r, c));
  for (const s of [-1, 1]) {
    const x = s * L.lente.x;
    itens.push(circ(x, L.lente.y, L.gola.r, c));
    for (const [rx, ry] of [el.armacao, el.lente, el.brilho]) {
      itens.push(
        `<ellipse cx="${px(x)}" cy="${px(L.lente.y)}" rx="${px(rx)}" ry="${px(ry)}" transform="rotate(${-s * 45} ${px(x)} ${px(L.lente.y)})" ${c}/>`
      );
    }
  }
  for (const ang of [0, 18, 36, 54, 72]) {
    for (const s of ang === 0 ? [1] : [-1, 1]) {
      const rad = (ang * Math.PI) / 180;
      const eixoBarra = ang === 18 || ang === 54;
      itens.push(
        linha(0, L.leque.cy, s * 12 * Math.sin(rad), L.leque.cy + 12 * Math.cos(rad), eixoBarra ? `stroke="${GUIA.eixo}" stroke-width="0.9"` : fino)
      );
    }
  }
  for (const [x, y] of [[0, 0], [0, L.leque.cy], [-5, 5], [5, 5]]) {
    itens.push(linha(x - 0.6, y, x + 0.6, y, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
    itens.push(linha(x, y - 0.6, x, y + 0.6, `stroke="${GUIA.circulo}" stroke-width="0.9"`));
  }

  itens.push(texto(-7.4, -7.6, 'cabeça R10', `${rot} text-anchor="end"`));
  itens.push(texto(-12.6, 9, 'tentáculo lateral r = 5√2', `${rot} text-anchor="end"`));
  itens.push(texto(-12.6, 10.2, '(passa pelo centro)', `${rot} text-anchor="end"`));
  itens.push(texto(10.6, 17, 'leque R10', rot));
  itens.push(texto(10.6, 18.2, 'barras a 18° e 54°', rot));
  itens.push(texto(10.6, 19.4, 'largura 3,5u', rot));
  itens.push(texto(12.6, 2, 'elipses 5×4 · 4×3', rot));
  itens.push(texto(12.6, 3.2, 'giradas 45°', rot));
  itens.push(texto(16, L.lente.y - 0.3, 'linha dos olhos', `font-size="9" fill="${GUIA.eixo}" text-anchor="end"`));
  itens.push(texto(5.3, -5.3, 'quadrado 10u', `font-size="9" fill="${GUIA.eixo}"`));

  return grupo('construcao', itens.join('\n'));
}

// ---------- ALTERNATIVA: logo com o rosto do mascote ----------

const R = {
  lente: { rFuro: 5.5 }, // armação 1,5u para aguentar tamanho pequeno
  traco: { w: 4.5, h: 1.5 },
  boca: { y: 5, r: 1.75 },
  leque: { cy: 8.5, r: 8, angulos: [18, 54], largura: 3 }, // centro na base da cabeça do mascote
};

function logoRosto() {
  const q = R.leque;
  const limite = disco(0, q.cy, q.r);
  const barras = [];
  for (const ang of q.angulos) {
    for (const s of [-1, 1]) {
      const barra = retangulo(-q.largura / 2, q.cy, q.largura, q.r + 2);
      barra.rotate(-s * ang, P(0, q.cy));
      barras.push(barra.intersect(limite));
    }
  }
  let forma = unir(
    disco(0, M.cabeca.y, M.cabeca.r),
    disco(-M.lente.x, 0, M.lente.rFora),
    disco(M.lente.x, 0, M.lente.rFora),
    ...barras
  );
  const boca = disco(0, R.boca.y, R.boca.r).intersect(retangulo(-5, R.boca.y, 10, 5));
  forma = forma.subtract(disco(-M.lente.x, 0, R.lente.rFuro)).subtract(disco(M.lente.x, 0, R.lente.rFuro)).subtract(boca);
  for (const s of [-1, 1]) {
    forma = forma.unite(retangulo(s * M.lente.x - R.traco.w / 2, -R.traco.h / 2, R.traco.w, R.traco.h));
  }
  return dados(forma);
}

const CAIXA_ROSTO = { x0: -15, y0: -11.5, x1: 15, y1: 16.5 };

// ---------- montagem das peças ----------

function peca({ caixa, margem = 2, conteudo, titulo, fundo }) {
  return documento({
    caixa: [caixa.x0 - margem, caixa.y0 - margem, caixa.x1 - caixa.x0 + 2 * margem, caixa.y1 - caixa.y0 + 2 * margem],
    conteudo,
    titulo,
    fundo,
  });
}

function grade(x0, y0, x1, y1) {
  const linhas = [];
  for (let x = Math.ceil(x0); x <= x1; x++) {
    linhas.push(linha(x, y0, x, y1, `stroke="${GUIA.grade}" stroke-width="${x % 5 === 0 ? 0.6 : 0.3}" opacity="${x % 5 === 0 ? 0.22 : 0.1}"`));
  }
  for (let y = Math.ceil(y0); y <= y1; y++) {
    linhas.push(linha(x0, y, x1, y, `stroke="${GUIA.grade}" stroke-width="${y % 5 === 0 ? 0.6 : 0.3}" opacity="${y % 5 === 0 ? 0.22 : 0.1}"`));
  }
  return grupo('grade', linhas.join('\n'));
}

const dLogo = logoFiel();
const dLogoSimples = logoFiel({ lenteSimples: true });
const dRosto = logoRosto();

const arteLogo = (d, cor = COR.preto, id = 'logo') => grupo(id, caminho(d, `fill="${cor}" fill-rule="evenodd"`));

function iconeApp(id = 'icone-app') {
  const lado = 40;
  return grupo(
    id,
    [
      `<rect x="${px(-lado / 2)}" y="${px(-lado / 2)}" width="${px(lado)}" height="${px(lado)}" rx="${px(lado * 0.225)}" fill="${COR.roxo}"/>`,
      `<g transform="translate(0 ${px(-2.5)})">${caminho(dRosto, `fill="${COR.branco}" fill-rule="evenodd"`)}</g>`,
    ].join('\n')
  );
}

function folhaExpressoes(prefixo = '') {
  const passo = 34;
  return grupo(
    `${prefixo}expressoes`,
    EXPRESSOES.map((expr, i) => {
      const dx = (i - (EXPRESSOES.length - 1) / 2) * passo;
      return [
        `<g transform="translate(${px(dx)} 0)">`,
        mascote({ prefixo: `${prefixo}${expr}-`, expr, soCabeca: true }),
        texto(0, 14, expr, `font-size="26" fill="${COR.preto}" text-anchor="middle"`),
        '</g>',
      ].join('\n');
    }).join('\n')
  );
}

const CAIXA_EXPRESSOES = { x0: -2 * 34 - 15, y0: -11.5, x1: 2 * 34 + 15, y1: 15 };

// peças finais
gravar('logo-construida.svg', peca({ caixa: CAIXA_LOGO, conteudo: arteLogo(dLogo), titulo: 'Logo construída' }));
gravar('mascote-construido.svg', peca({ caixa: CAIXA_MASCOTE, conteudo: mascote(), titulo: 'Mascote construído' }));

// pranchas de construção
gravar(
  'logo-construcao.svg',
  documento({
    caixa: [-27, -14, 52, 38],
    titulo: 'Logo — construção',
    fundo: COR.branco,
    conteudo: [grade(-27, -14, 25, 24), grupo('arte', caminho(dLogo, `fill="${COR.preto}" fill-rule="evenodd"`), 'opacity="0.22"'), construcaoLogo()].join('\n'),
  })
);
gravar(
  'mascote-construcao.svg',
  documento({
    caixa: [-27, -15, 58, 39],
    titulo: 'Mascote — construção',
    fundo: COR.branco,
    conteudo: [grade(-27, -15, 31, 24), grupo('arte', mascote({ prefixo: 'arte-' }), 'opacity="0.3"'), construcaoMascote()].join('\n'),
  })
);

// alternativas
gravar('alt-logo-1-lente-simples.svg', peca({ caixa: CAIXA_LOGO, conteudo: arteLogo(dLogoSimples), titulo: 'Alternativa de logo 1 — lente simples' }));
gravar('alt-logo-2-rosto-do-mascote.svg', peca({ caixa: CAIXA_ROSTO, conteudo: arteLogo(dRosto), titulo: 'Alternativa de logo 2 — rosto do mascote' }));
gravar('alt-logo-3-icone-de-app.svg', peca({ caixa: { x0: -20, y0: -20, x1: 20, y1: 20 }, conteudo: iconeApp(), titulo: 'Alternativa de logo 3 — ícone de app' }));
gravar('alt-mascote-1-dois-bracos.svg', peca({ caixa: CAIXA_MASCOTE, conteudo: mascote({ bracos: 'dois' }), titulo: 'Alternativa de mascote 1 — dois braços' }));
gravar('alt-mascote-2-expressoes.svg', peca({ caixa: CAIXA_EXPRESSOES, conteudo: folhaExpressoes(), titulo: 'Alternativa de mascote 2 — expressões' }));

// ---------- prancha geral ----------

function original(nome) {
  const svg = fs.readFileSync(path.join(FONTES, nome), 'utf8');
  const [x, y, w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const miolo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<!--[\s\S]*?-->/g, '');
  return { miolo, caixaPx: { x0: x, y0: y, x1: x + w, y1: y + h } };
}

/** Encaixa um conteúdo (medido em px) dentro de uma célula, centralizado. */
function celula({ x, y, w, h, caixaPx, conteudo, legenda, sub }) {
  const cw = caixaPx.x1 - caixaPx.x0;
  const ch = caixaPx.y1 - caixaPx.y0;
  const area = h - 46;
  const k = Math.min((w - 24) / cw, (area - 24) / ch);
  const tx = x + w / 2 - k * (caixaPx.x0 + cw / 2);
  const ty = y + area / 2 - k * (caixaPx.y0 + ch / 2);
  return [
    `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(area)}" fill="#f6f4f8"/>`,
    `<g transform="translate(${n(tx)} ${n(ty)}) scale(${n(k * 1000) / 1000})">${conteudo}</g>`,
    `<text x="${n(x)}" y="${n(y + area + 18)}" font-family="${FONTE}" font-size="13" font-weight="bold" fill="${COR.preto}">${legenda}</text>`,
    sub ? `<text x="${n(x)}" y="${n(y + area + 34)}" font-family="${FONTE}" font-size="11" fill="#6b6470">${sub}</text>` : '',
  ].join('\n');
}

const emPx = (c) => ({ x0: c.x0 * U, y0: c.y0 * U, x1: c.x1 * U, y1: c.y1 * U });

function pranchaGeral() {
  const col = 300;
  const vao = 20;
  const alt = 330;
  const esq = 40;
  const X = (i) => esq + i * (col + vao);
  const partes = [];
  const titulo = (y, s) =>
    `<text x="${esq}" y="${y}" font-family="${FONTE}" font-size="20" font-weight="bold" fill="${COR.preto}">${s}</text>`;

  const logoOrig = original('logo-original.svg');
  const mascOrig = original('mascote-original.svg');

  let y = 80;
  partes.push(titulo(y - 20, 'Logo'));
  const logos = [
    { conteudo: logoOrig.miolo, caixaPx: logoOrig.caixaPx, legenda: 'Original', sub: 'traçado à mão, como veio' },
    { conteudo: arteLogo(dLogo, COR.preto, 'pg-logo'), caixaPx: emPx(CAIXA_LOGO), legenda: 'Construída', sub: 'mesma ideia, sobre o sistema' },
    {
      conteudo: [grupo('pg-logo-arte', caminho(dLogo, `fill="${COR.preto}" fill-rule="evenodd"`), 'opacity="0.22"'), construcaoLogo().replace('id="construcao"', 'id="pg-logo-construcao"')].join('\n'),
      caixaPx: { x0: -220, y0: -140, x1: 220, y1: 240 },
      legenda: 'Construção',
      sub: 'três círculos, diagonais e leque de 18°',
    },
    { conteudo: arteLogo(dLogoSimples, COR.preto, 'pg-alt-logo-1'), caixaPx: emPx(CAIXA_LOGO), legenda: 'Alt. 1 — lente simples', sub: 'um anel a menos por olho' },
    { conteudo: arteLogo(dRosto, COR.preto, 'pg-alt-logo-2'), caixaPx: emPx(CAIXA_ROSTO), legenda: 'Alt. 2 — rosto do mascote', sub: 'logo e mascote com a mesma cara' },
    { conteudo: iconeApp('pg-alt-logo-3'), caixaPx: { x0: -200, y0: -200, x1: 200, y1: 200 }, legenda: 'Alt. 3 — ícone de app', sub: 'a alt. 2 em negativo sobre roxo' },
  ];
  logos.forEach((c, i) => partes.push(celula({ x: X(i), y, w: col, h: alt, ...c })));

  y += alt + 70;
  partes.push(titulo(y - 20, 'Mascote'));
  const mascotes = [
    { conteudo: mascOrig.miolo, caixaPx: mascOrig.caixaPx, legenda: 'Original', sub: 'traçado à mão, como veio' },
    { conteudo: mascote({ prefixo: 'pg-m1-' }), caixaPx: emPx(CAIXA_MASCOTE), legenda: 'Construído', sub: 'chapado, em três roxos' },
    {
      conteudo: [grupo('pg-masc-arte', mascote({ prefixo: 'pg-mc-' }), 'opacity="0.3"'), construcaoMascote().replace('id="construcao"', 'id="pg-masc-construcao"')].join('\n'),
      caixaPx: { x0: -270, y0: -150, x1: 310, y1: 240 },
      legenda: 'Construção',
      sub: 'raios 10 · 7 · 6 · 4,5; membros por círculos e tangentes',
    },
    { conteudo: mascote({ prefixo: 'pg-m2-', bracos: 'dois' }), caixaPx: emPx(CAIXA_MASCOTE), legenda: 'Alt. 1 — dois braços', sub: 'silhueta simétrica, como no rascunho' },
  ];
  mascotes.forEach((c, i) => partes.push(celula({ x: X(i), y, w: col, h: alt, ...c })));
  partes.push(
    celula({
      x: X(4),
      y,
      w: 2 * col + vao,
      h: alt,
      conteudo: folhaExpressoes('pg-'),
      caixaPx: emPx(CAIXA_EXPRESSOES),
      legenda: 'Alt. 2 — expressões',
      sub: 'só olhos e boca mudam; "focado" repete o gesto dos olhos da logo',
    })
  );

  y += alt + 70;
  partes.push(titulo(y - 20, 'Teste de tamanho pequeno (64 · 32 · 24 · 16 px de altura)'));
  const testes = [
    { nome: 'Original', miolo: logoOrig.miolo, caixaPx: logoOrig.caixaPx },
    { nome: 'Construída', miolo: caminho(dLogo, `fill="${COR.preto}" fill-rule="evenodd"`), caixaPx: emPx(CAIXA_LOGO) },
    { nome: 'Alt. 1', miolo: caminho(dLogoSimples, `fill="${COR.preto}" fill-rule="evenodd"`), caixaPx: emPx(CAIXA_LOGO) },
    { nome: 'Alt. 2', miolo: caminho(dRosto, `fill="${COR.preto}" fill-rule="evenodd"`), caixaPx: emPx(CAIXA_ROSTO) },
  ];
  testes.forEach((t, i) => {
    const x0 = X(i === 0 ? 0 : i + 0);
    let cx = x0;
    for (const tam of [64, 32, 24, 16]) {
      const ch = t.caixaPx.y1 - t.caixaPx.y0;
      const k = tam / ch;
      partes.push(`<g transform="translate(${n(cx - k * t.caixaPx.x0)} ${n(y + 64 - tam - k * t.caixaPx.y0)}) scale(${n(k * 10000) / 10000})">${t.miolo}</g>`);
      cx += (k * (t.caixaPx.x1 - t.caixaPx.x0)) + 18;
    }
    partes.push(`<text x="${n(x0)}" y="${n(y + 88)}" font-family="${FONTE}" font-size="13" font-weight="bold" fill="${COR.preto}">${t.nome}</text>`);
  });

  const largura = esq * 2 + 6 * col + 5 * vao;
  const altura = y + 120;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${largura} ${altura}">`,
    '<title>Prancha geral — logo e mascote construídos (Claude)</title>',
    `<rect id="fundo" width="${largura}" height="${altura}" fill="${COR.branco}"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

gravar('prancha-geral.svg', pranchaGeral());
if (PRINCIPAL) console.log('ok');

module.exports = { L, GUIA, construcaoLogo, grade, linha, circ, texto, elipse, paper, U, COR, FONTE, M, R, n, px, P, disco, retangulo, unir, dados, caminho, grupo, documento, original, celula, dLogo, dRosto, CAIXA_LOGO, CAIXA_ROSTO, emPx };
