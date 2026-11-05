/**
 * Rodada 6: polvo "gordinho" a partir do retorno sobre a rodada 5.
 *  - corpo mais largo que a cabeça (barriga), vãos estreitos, tentáculos curtos e cheios;
 *  - lentes mais para a lateral, pupilas mais grossas;
 *  - folha de bocas; globo (símbolo de internet) na cabeça; selo em espaço negativo.
 *
 * Unidades: módulo u (1u = 10 px). Origem no centro da cabeça; y cresce para baixo.
 * Uso: NODE_PATH=<pasta com node_modules> node gerar-rodada-6.cjs
 */
const fs = require('fs');
const path = require('path');
const paper = require('paper/dist/paper-core.js');

paper.setup(new paper.Size(10, 10));
const { Path, Point, Rectangle } = paper;

const U = 10;
const SAIDA = path.join(__dirname, 'rodada-6');
const COR = { noite: '#1B1F3B', branco: '#FFFFFF', agua: '#14B38E', rosa: '#FF48B0', limao: '#F5EE4A', riso: '#0B8FE0' };
const GUIA = { circulo: '#e5007d', eixo: '#0090d4', grade: '#1B1F3B', cota: '#6b7280' };
const FONTE = 'Helvetica, Arial, sans-serif';

// ---------- geometria ----------

const n = (v) => String(Math.round(v * 100) / 100);
const px = (v) => n(v * U);
const P = (x, y) => new Point(x * U, y * U);
const disco = (x, y, r) => new Path.Circle(P(x, y), r * U);
const retangulo = (x, y, w, h, r = 0) =>
  new Path.Rectangle({ rectangle: new Rectangle(x * U, y * U, w * U, h * U), radius: r * U });
const unir = (...i) => i.reduce((a, b) => a.unite(b));
const dados = (item) => item.pathData.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (m) => n(parseFloat(m)));
function elipse(cx, cy, rx, ry, graus = 0) {
  const e = new Path.Ellipse({ center: P(cx, cy), radius: [rx * U, ry * U] });
  e.rotate(graus, P(cx, cy));
  return e;
}
function pilula(cx, cy, w, h, graus = 0) {
  const p = retangulo(cx - w / 2, cy - h / 2, w, h, Math.min(w, h) / 2);
  p.rotate(graus, P(cx, cy));
  return p;
}
const anel = (x, y, rFora, rDentro) => disco(x, y, rFora).subtract(disco(x, y, rDentro));

/**
 * Casco convexo de círculos (em ordem horária na tela), com arcos e tangentes reais.
 * Cada círculo: [x, y, r]. Devolve um Path do paper.
 */
function casco(circulos) {
  const k = circulos.length;
  const tang = [];
  for (let i = 0; i < k; i++) {
    const [ax, ay, ra] = circulos[i];
    const [bx, by, rb] = circulos[(i + 1) % k];
    const d = Math.hypot(bx - ax, by - ay);
    const vx = (bx - ax) / d;
    const vy = (by - ay) / d;
    const c = (ra - rb) / d;
    const s = Math.sqrt(1 - c * c);
    // normal para fora: v·c + perp(v)·s, perp(v) = (vy, -vx) aponta para fora no sentido horário da tela
    const nx = vx * c + vy * s;
    const ny = vy * c - vx * s;
    tang.push({ de: [ax + ra * nx, ay + ra * ny], para: [bx + rb * nx, by + rb * ny] });
  }
  const pt = (p) => `${px(p[0])},${px(p[1])}`;
  let d = `M${pt(tang[k - 1].para)}`;
  for (let i = 0; i < k; i++) {
    const [cx, cy, r] = circulos[i];
    const ini = tang[(i - 1 + k) % k].para;
    const fim = tang[i].de;
    let a0 = Math.atan2(ini[1] - cy, ini[0] - cx);
    let a1 = Math.atan2(fim[1] - cy, fim[0] - cx);
    let span = a1 - a0;
    while (span < 0) span += 2 * Math.PI;
    d += ` A${px(r)},${px(r)} 0 ${span > Math.PI ? 1 : 0} 1 ${pt(fim)}`;
    d += ` L${pt(tang[i].para)}`;
  }
  return new Path({ pathData: d + ' Z', insert: false });
}

/**
 * Sistema base da rodada 6 (u):
 *  - cabeça R10 em (0, 0); "ombros" r3 em (±8; 4,5). O casco dos três círculos dá a barriga:
 *    o corpo chega a 22u de largura (cabeça 20), lateral reta de y = 4,5 até os vãos.
 *  - proporção vertical cabeça : corpo : tentáculos = 10 : 9 : 3,5 (altura 22,5 ≈ largura 22).
 *  - tentáculos: 4 de 4,75 e 3 vãos de 1 (4 × 4,75 + 3 × 1 = 22); topo dos vãos semicírculo r0,5;
 *    pontas com raio 1,5.
 *  - lentes em (±8,5; −1,5), armação 3,25 × 4,5, vidro 2,25 × 3,5, inclinação 20°.
 *  - pupila 1,5 × 3 (mais grossa que na rodada 5, como o traço do rascunho).
 */
const BASE = {
  R: 10,
  ombro: { x: 8, y: 4.5, r: 3 },
  yVao: 9,
  yBase: 12.5,
  vao: 1,
  rPonta: 1.5,
  olho: { x: 8.5, y: -1.5, inclina: 20 },
  armacao: [3.25, 4.5],
  vidro: [2.25, 3.5],
  pupila: [1.5, 3],
  boca: 'traco',
  alca: false,
  globo: false,
};

const largura = (p) => 2 * (p.ombro.x + p.ombro.r);
const perna = (p) => (largura(p) - 3 * p.vao) / 4;

function xsDosVaos(p) {
  const xs = [];
  let x = -largura(p) / 2 + perna(p);
  for (let i = 0; i < 3; i++) {
    xs.push(x + p.vao / 2);
    x += p.vao + perna(p);
  }
  return xs;
}

function silhueta(p) {
  const L = largura(p) / 2;
  const topo = casco([
    [0, 0, p.R],
    [p.ombro.x, p.ombro.y, p.ombro.r],
    [-p.ombro.x, p.ombro.y, p.ombro.r],
  ]);
  let corpo = unir(topo, retangulo(-L, p.ombro.y, 2 * L, p.yVao - p.ombro.y + 0.5));
  let x = -L;
  for (let i = 0; i < 4; i++) {
    corpo = corpo.unite(retangulo(x, p.yVao - p.rPonta - 0.5, perna(p), p.yBase - p.yVao + p.rPonta + 0.5, p.rPonta));
    x += perna(p) + p.vao;
  }
  for (const cx of xsDosVaos(p)) {
    const r = p.vao / 2;
    corpo = corpo.subtract(unir(disco(cx, p.yVao + r, r), retangulo(cx - r, p.yVao + r, p.vao, p.yBase)));
  }
  return corpo;
}

const BOCAS = {
  traco: { nome: 'traço', forma: (y) => pilula(0, y, 2.25, 1) },
  sorriso: {
    nome: 'sorriso',
    forma: (y) => disco(0, y - 0.25, 1.25).subtract(retangulo(-2, y - 2, 4, 1.75)),
  },
  cursor: {
    nome: 'cursor >_',
    forma: (y) => {
      const e = 0.6;
      const chevron = unir(pilula(-1.15, y - 0.35, e, 1.4, -45), pilula(-1.15, y + 0.35, e, 1.4, 45));
      return unir(chevron, pilula(0.85, y + 0.75, 1.9, e));
    },
  },
  o: { nome: '"o"', forma: (y) => disco(0, y + 0.25, 0.8) },
  w: {
    nome: '"w"',
    forma: (y) => {
      const meia = (cx) => anel(cx, y, 0.95, 0.4).subtract(retangulo(cx - 1, y - 1, 2, 1));
      return unir(meia(-0.675), meia(0.675));
    },
  },
};
const Y_BOCA = 2.5;

function rosto(p, forma) {
  for (const lado of [-1, 1]) {
    const cx = lado * p.olho.x;
    const g = lado * p.olho.inclina;
    forma = forma.unite(elipse(cx, p.olho.y, ...p.armacao, g));
    forma = forma.subtract(elipse(cx, p.olho.y, ...p.vidro, g));
    forma = forma.unite(pilula(cx, p.olho.y, ...p.pupila, g));
  }
  if (p.boca) forma = forma.subtract(BOCAS[p.boca].forma(Y_BOCA));
  return forma;
}

/** Alça: anel R11,25–R12,5 em volta da cabeça, até a linha dos olhos, entrando nas armações. */
function alca(p) {
  return anel(0, 0, p.R + 2.5, p.R + 1.25).subtract(retangulo(-20, p.olho.y, 40, 40));
}

/**
 * Globo: as linhas do símbolo de internet gravadas em negativo na calota da cabeça,
 * acima da linha dos olhos — meridiano central, meridiano elíptico (rx 5) e um paralelo a y = −6.
 * Traço de 0,75u. O "equador" é a própria linha dos olhos, onde a alça/óculos se apoia.
 */
function linhasDoGlobo(p, e = 0.75) {
  const calota = disco(0, 0, p.R).intersect(retangulo(-p.R, -p.R, 2 * p.R, p.R + p.olho.y - p.armacao[1] * 0.2));
  const linhas = unir(
    elipse(0, 0, 5 + e / 2, p.R + 5).subtract(elipse(0, 0, 5 - e / 2, p.R + 5 - e)),
    retangulo(-e / 2, -p.R - 1, e, 2 * p.R),
    retangulo(-p.R - 1, -6 - e / 2, 2 * p.R + 2, e)
  );
  return linhas.intersect(calota);
}

function logo(p) {
  let forma = silhueta(p);
  if (p.globo) forma = forma.subtract(linhasDoGlobo(p));
  if (p.alca) forma = forma.unite(alca(p));
  return rosto(p, forma);
}

/**
 * Selo: disco R15 em azul-noite com o polvo vazado (espaço negativo), em escala 0,75,
 * na frente das linhas do globo (meridiano rx7, central, equador e dois paralelos, traço 0,6);
 * as linhas param no contorno do polvo e não entram nos vãos.
 * Corpo e pupilas viram branco; vidro e boca continuam azul-noite.
 */
function selo(p) {
  const R = 15;
  const e = 0.6;
  const k = 0.75;
  const centro = P(0, 0.5);
  const polvo = logo({ ...p, globo: false });
  let fora = silhueta(p);
  for (const lado of [-1, 1]) fora = fora.unite(elipse(lado * p.olho.x, p.olho.y, ...p.armacao, lado * p.olho.inclina));
  // área dos tentáculos fechada, para as linhas do globo não entrarem nos vãos
  const bloco = fora.unite(retangulo(-largura(p) / 2, p.ombro.y, largura(p), p.yBase - p.ombro.y, p.rPonta));
  for (const item of [polvo, fora, bloco]) {
    item.scale(k, P(0, 0));
    item.translate(centro);
  }
  const linhas = unir(
    elipse(0, 0, 7 + e / 2, R + 1).subtract(elipse(0, 0, 7 - e / 2, R + 1 - e)),
    retangulo(-e / 2, -R, e, 2 * R),
    retangulo(-R, -e / 2, 2 * R, e),
    retangulo(-R, -8 - e / 2, 2 * R, e),
    retangulo(-R, 8 - e / 2, 2 * R, e)
  ).subtract(bloco);
  return disco(0, 0, R).subtract(linhas).subtract(fora).unite(fora.subtract(polvo));
}

// ---------- variantes ----------

const VARIANTES = [
  { id: 'a-gordinho', nome: 'A · Gordinho', sub: 'barriga, vãos de 1u, tentáculos curtos', p: { ...BASE } },
  { id: 'b-gordinho-alca', nome: 'B · Gordinho com alça', sub: 'o arco do rascunho como alça', p: { ...BASE, alca: true } },
  { id: 'c-globo', nome: 'C · Globo', sub: 'símbolo de internet na calota da cabeça', p: { ...BASE, globo: true } },
  { id: 'd-globo-alca', nome: 'D · Globo com alça', sub: 'calota em rede + alça', p: { ...BASE, globo: true, alca: true } },
];
for (const v of VARIANTES) v.d = dados(logo(v.p));
const SELO = { id: 'e-selo-negativo', nome: 'E · Selo em espaço negativo', sub: 'polvo vazado dentro do globo', d: dados(selo(BASE)) };
const BOCAS_V = Object.keys(BOCAS).map((b) => ({ id: `boca-${b}`, nome: BOCAS[b].nome, d: dados(logo({ ...BASE, boca: b })) }));

// ---------- SVG ----------

const caminho = (d, a) => `<path d="${d}" ${a}/>`;
const grupo = (id, c, a = '') => `<g id="${id}"${a ? ' ' + a : ''}>\n${c}\n</g>`;
const linha = (x1, y1, x2, y2, a) => `<line x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}" ${a}/>`;
const circ = (x, y, r, a) => `<circle cx="${px(x)}" cy="${px(y)}" r="${px(r)}" ${a}/>`;
const elip = (x, y, rx, ry, g, a) =>
  `<ellipse cx="${px(x)}" cy="${px(y)}" rx="${px(rx)}" ry="${px(ry)}" transform="rotate(${g} ${px(x)} ${px(y)})" ${a}/>`;
const texto = (x, y, s, a = '') => `<text x="${px(x)}" y="${px(y)}" font-family="${FONTE}" ${a}>${s}</text>`;
const arte = (d, cor = COR.noite, id = 'logo') => grupo(id, caminho(d, `fill="${cor}" fill-rule="evenodd"`));
const virgula = (v) => n(v).replace('.', ',');

function documento(caixa, titulo, conteudo, fundo) {
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

function grade(x0, y0, x1, y1) {
  const l = [];
  for (let x = Math.ceil(x0); x <= x1; x++)
    l.push(linha(x, y0, x, y1, `stroke="${GUIA.grade}" stroke-width="${x % 5 ? 0.3 : 0.6}" opacity="${x % 5 ? 0.08 : 0.2}"`));
  for (let y = Math.ceil(y0); y <= y1; y++)
    l.push(linha(x0, y, x1, y, `stroke="${GUIA.grade}" stroke-width="${y % 5 ? 0.3 : 0.6}" opacity="${y % 5 ? 0.08 : 0.2}"`));
  return grupo('grade', l.join('\n'));
}

function construcao(p, prefixo = '') {
  const c = `fill="none" stroke="${GUIA.circulo}" stroke-width="1"`;
  const eixo = `stroke="${GUIA.eixo}" stroke-width="0.9" stroke-dasharray="8 3 2 3"`;
  const fino = `stroke="${GUIA.eixo}" stroke-width="0.6" stroke-dasharray="3 3"`;
  const rotulo = (x, y, s, ancora = 'start', cor = GUIA.circulo) => texto(x, y, s, `font-size="9" fill="${cor}" text-anchor="${ancora}"`);
  const g = [];
  const L = largura(p) / 2;

  g.push(linha(0, -13, 0, p.yBase + 3, eixo));
  for (const [y, s] of [
    [-p.R, 'topo (−10)'],
    [p.olho.y, `linha dos olhos (${virgula(p.olho.y).replace('-', '−')})`],
    [0, 'centro da cabeça (0)'],
    [Y_BOCA, `boca (${virgula(Y_BOCA)})`],
    [p.ombro.y, `ombros (${virgula(p.ombro.y)})`],
    [p.yVao, `vãos (${virgula(p.yVao)})`],
    [p.yBase, `base (${virgula(p.yBase)})`],
  ]) {
    g.push(linha(-25, y, 25, y, fino));
    g.push(rotulo(25.5, y + 0.35, s, 'start', GUIA.eixo));
  }
  g.push(linha(-L, -13, -L, p.yBase + 3, fino), linha(L, -13, L, p.yBase + 3, fino));

  // círculos geradores do corpo e tangentes
  g.push(circ(0, 0, p.R, c), circ(0, 0, 0.25, `fill="${GUIA.circulo}"`));
  for (const lado of [-1, 1]) {
    g.push(circ(lado * p.ombro.x, p.ombro.y, p.ombro.r, c), circ(lado * p.ombro.x, p.ombro.y, 0.25, `fill="${GUIA.circulo}"`));
    g.push(linha(0, 0, lado * p.ombro.x, p.ombro.y, `stroke="${GUIA.circulo}" stroke-width="0.6" stroke-dasharray="2 2"`));
  }
  g.push(rotulo(-3, -p.R - 0.6, 'cabeça R10', 'end'));
  g.push(rotulo(p.ombro.x + p.ombro.r + 0.6, p.ombro.y + 2.4, `ombro r${p.ombro.r} em (±${p.ombro.x}; ${virgula(p.ombro.y)})`));
  g.push(rotulo(p.ombro.x + p.ombro.r + 0.6, p.ombro.y + 3.5, 'corpo = casco dos 3 círculos'));

  const cota = (y1, y2, s) => {
    const a = `stroke="${GUIA.cota}" stroke-width="0.8"`;
    g.push(linha(-22, y1, -22, y2, a), linha(-22.6, y1, -21.4, y1, a), linha(-22.6, y2, -21.4, y2, a));
    g.push(rotulo(-22.8, (y1 + y2) / 2 + 0.35, s, 'end', GUIA.cota));
  };
  cota(-p.R, 0, '10');
  cota(0, p.yVao, virgula(p.yVao));
  cota(p.yVao, p.yBase, virgula(p.yBase - p.yVao));
  // largura total
  const a = `stroke="${GUIA.cota}" stroke-width="0.8"`;
  g.push(linha(-L, p.yBase + 4.5, L, p.yBase + 4.5, a), linha(-L, p.yBase + 3.9, -L, p.yBase + 5.1, a), linha(L, p.yBase + 3.9, L, p.yBase + 5.1, a));
  g.push(rotulo(0, p.yBase + 6, `${virgula(largura(p))} = 4 × ${virgula(perna(p))} + 3 × ${virgula(p.vao)}`, 'middle', GUIA.cota));

  let x = -L;
  for (let i = 0; i < 4; i++) {
    g.push(`<rect x="${px(x)}" y="${px(p.yVao)}" width="${px(perna(p))}" height="${px(p.yBase - p.yVao)}" fill="none" stroke="${GUIA.eixo}" stroke-width="0.6"/>`);
    x += perna(p) + p.vao;
  }
  for (const cx of xsDosVaos(p)) g.push(circ(cx, p.yVao + p.vao / 2, p.vao / 2, c));
  g.push(rotulo(0, p.yBase + 2.2, `vãos r${virgula(p.vao / 2)} · pontas r${virgula(p.rPonta)}`, 'middle', GUIA.circulo));

  for (const lado of [-1, 1]) {
    const cx = lado * p.olho.x;
    const ang = lado * p.olho.inclina;
    g.push(elip(cx, p.olho.y, ...p.armacao, ang, c), elip(cx, p.olho.y, ...p.vidro, ang, c));
    const rad = (ang * Math.PI) / 180;
    const k = 6.5;
    g.push(linha(cx + Math.sin(rad) * k, p.olho.y - Math.cos(rad) * k, cx - Math.sin(rad) * k, p.olho.y + Math.cos(rad) * k, eixo));
    g.push(circ(cx, p.olho.y, 0.25, `fill="${GUIA.circulo}"`));
  }
  g.push(rotulo(-p.olho.x - 5, -13.4, `lentes em (±${virgula(p.olho.x)}; ${virgula(p.olho.y).replace('-', '−')})`, 'end'));
  g.push(rotulo(-p.olho.x - 5, -12.3, `armação ${virgula(p.armacao[0])} × ${virgula(p.armacao[1])}`, 'end'));
  g.push(rotulo(-p.olho.x - 5, -11.2, `vidro ${virgula(p.vidro[0])} × ${virgula(p.vidro[1])}`, 'end'));
  g.push(rotulo(-p.olho.x - 5, -10.1, `pupila ${virgula(p.pupila[0])} × ${p.pupila[1]} · ${p.olho.inclina}° para fora`, 'end'));

  if (p.globo) {
    g.push(elip(0, 0, 5, p.R, 0, c));
    g.push(rotulo(5.6, -9.2, 'meridiano rx5 · paralelo em −6 · traço 0,75'));
  }
  return grupo(`${prefixo}construcao`, g.join('\n'));
}

const CAIXA = { x0: -13, y0: -11, x1: 13, y1: 13.5 };
const CAIXA_ALCA = { x0: -13, y0: -13.5, x1: 13, y1: 13.5 };
const CAIXA_SELO = { x0: -15.5, y0: -15.5, x1: 15.5, y1: 15.5 };
const caixaDe = (v) => (v.p && v.p.alca ? CAIXA_ALCA : CAIXA);
const caixaArr = (c, m = 1) => [c.x0 - m, c.y0 - m, c.x1 - c.x0 + 2 * m, c.y1 - c.y0 + 2 * m];

fs.mkdirSync(SAIDA, { recursive: true });
for (const v of VARIANTES) fs.writeFileSync(path.join(SAIDA, `${v.id}.svg`), documento(caixaArr(caixaDe(v)), v.nome, arte(v.d)), 'utf8');
fs.writeFileSync(path.join(SAIDA, `${SELO.id}.svg`), documento(caixaArr(CAIXA_SELO), SELO.nome, arte(SELO.d)), 'utf8');

for (const v of [VARIANTES[0], VARIANTES[2]]) {
  fs.writeFileSync(
    path.join(SAIDA, `${v.id}-construcao.svg`),
    documento(
      [-36, -16, 72, 36],
      `${v.nome} — construção`,
      [grade(-36, -16, 36, 20), grupo('arte', caminho(v.d, `fill="${COR.noite}" fill-rule="evenodd"`), 'opacity="0.18"'), construcao(v.p)].join('\n'),
      COR.branco
    ),
    'utf8'
  );
}

// ---------- prancha ----------

function celula({ x, y, w, h, caixaPx, conteudo, legenda, sub, fundo = '#f3f5f8' }) {
  const cw = caixaPx.x1 - caixaPx.x0;
  const ch = caixaPx.y1 - caixaPx.y0;
  const area = h - 46;
  const k = Math.min((w - 32) / cw, (area - 32) / ch);
  const tx = x + w / 2 - k * (caixaPx.x0 + cw / 2);
  const ty = y + area / 2 - k * (caixaPx.y0 + ch / 2);
  return [
    `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(area)}" fill="${fundo}"/>`,
    `<g transform="translate(${n(tx)} ${n(ty)}) scale(${n(k * 1000) / 1000})">${conteudo}</g>`,
    `<text x="${n(x)}" y="${n(y + area + 18)}" font-family="${FONTE}" font-size="13" font-weight="bold" fill="${COR.noite}">${legenda}</text>`,
    sub ? `<text x="${n(x)}" y="${n(y + area + 34)}" font-family="${FONTE}" font-size="11" fill="#6b7280">${sub}</text>` : '',
  ].join('\n');
}
const emPx = (c) => ({ x0: c.x0 * U, y0: c.y0 * U, x1: c.x1 * U, y1: c.y1 * U });

function prancha() {
  const esq = 40;
  const col = 300;
  const vao = 20;
  const alt = 340;
  const X = (i) => esq + i * (col + vao);
  const larguraPx = esq * 2 + 4 * col + 3 * vao;
  const partes = [];
  const titulo = (y, s) => `<text x="${esq}" y="${y}" font-family="${FONTE}" font-size="20" font-weight="bold" fill="${COR.noite}">${s}</text>`;
  const A = VARIANTES[0];

  let y = 70;
  partes.push(titulo(y - 22, 'Rodada 6 — gordinho'));
  partes.push(
    `<rect x="${X(0)}" y="${y}" width="${col}" height="${alt - 46}" fill="#ffffff" stroke="#e5e7eb"/>`,
    `<image href="../../fontes/rascunho-polvo-v4-zoom.png" x="${X(0) + 25}" y="${y + 3}" width="250" height="288"/>`,
    `<text x="${X(0)}" y="${y + alt - 28}" font-family="${FONTE}" font-size="13" font-weight="bold" fill="${COR.noite}">Rascunho (zoom)</text>`,
    `<text x="${X(0)}" y="${y + alt - 12}" font-family="${FONTE}" font-size="11" fill="#6b7280">fontes/rascunho-polvo-v4-zoom.png</text>`
  );
  partes.push(celula({ x: X(1), y, w: col, h: alt, caixaPx: emPx(CAIXA), conteudo: arte(A.d, COR.noite, 'pr-a'), legenda: A.nome, sub: A.sub }));
  partes.push(
    celula({
      x: X(2), y, w: 2 * col + vao, h: alt,
      caixaPx: emPx({ x0: -36, y0: -16, x1: 36, y1: 20 }),
      conteudo: [grupo('pr-arte', caminho(A.d, `fill="${COR.noite}" fill-rule="evenodd"`), 'opacity="0.18"'), construcao(A.p, 'pr-')].join('\n'),
      legenda: 'Linhas de construção',
      sub: 'cabeça : corpo : tentáculos = 10 : 9 : 3,5 · largura 22 ≈ altura 22,5',
      fundo: '#ffffff',
    })
  );

  y += alt + 60;
  partes.push(titulo(y - 22, 'Bocas (mesmo corpo, só a boca muda)'));
  const colB = (larguraPx - 2 * esq - 4 * vao) / 5;
  BOCAS_V.forEach((b, i) =>
    partes.push(celula({ x: esq + i * (colB + vao), y, w: colB, h: 280, caixaPx: emPx({ x0: -12, y0: -6, x1: 12, y1: 6 }), conteudo: arte(b.d, COR.noite, `pr-${b.id}`), legenda: b.nome }))
  );
  y += 280 - alt;

  y += alt + 60;
  partes.push(titulo(y - 22, 'Alça, globo e espaço negativo'));
  [VARIANTES[1], VARIANTES[2], VARIANTES[3]].forEach((v, i) =>
    partes.push(celula({ x: X(i), y, w: col, h: alt, caixaPx: emPx(caixaDe(v)), conteudo: arte(v.d, COR.noite, `pr-${v.id}`), legenda: v.nome, sub: v.sub }))
  );
  partes.push(celula({ x: X(3), y, w: col, h: alt, caixaPx: emPx(CAIXA_SELO), conteudo: arte(SELO.d, COR.noite, 'pr-selo'), legenda: SELO.nome, sub: SELO.sub }));

  y += alt + 60;
  partes.push(titulo(y - 22, 'Globo — construção e cor'));
  const C = VARIANTES[2];
  partes.push(
    celula({
      x: X(0), y, w: 2 * col + vao, h: alt,
      caixaPx: emPx({ x0: -36, y0: -16, x1: 36, y1: 20 }),
      conteudo: [grupo('pr-c-arte', caminho(C.d, `fill="${COR.noite}" fill-rule="evenodd"`), 'opacity="0.18"'), construcao(C.p, 'pr-c-')].join('\n'),
      legenda: 'C · Globo — linhas de construção',
      fundo: '#ffffff',
    })
  );
  partes.push(celula({ x: X(2), y, w: col, h: alt, caixaPx: emPx(CAIXA), conteudo: arte(C.d, COR.branco, 'pr-c-cor1'), legenda: 'Branco sobre azul-noite', fundo: COR.noite }));
  partes.push(celula({ x: X(3), y, w: col, h: alt, caixaPx: emPx(CAIXA_SELO), conteudo: arte(SELO.d, COR.noite, 'pr-selo-cor'), legenda: 'Selo sobre verde-água', fundo: COR.agua }));

  y += alt + 60;
  partes.push(titulo(y - 22, 'Tamanhos pequenos (16, 24, 32, 48 px)'));
  [VARIANTES[0], VARIANTES[2]].forEach((v, li) => {
    let xx = esq;
    const yy = y + li * 80;
    partes.push(`<text x="${xx}" y="${yy + 30}" font-family="${FONTE}" font-size="12" fill="${COR.noite}">${v.nome}</text>`);
    xx += 200;
    for (const t of [16, 24, 32, 48]) {
      const k = t / ((CAIXA.y1 - CAIXA.y0) * U);
      partes.push(`<g transform="translate(${n(xx - k * CAIXA.x0 * U)} ${n(yy + 48 - t - k * CAIXA.y0 * U)}) scale(${n(k * 10000) / 10000})">${caminho(v.d, `fill="${COR.noite}" fill-rule="evenodd"`)}</g>`);
      xx += t + 40;
    }
  });
  y += 170;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${larguraPx} ${y}">`,
    '<title>Rodada 6 — gordinho, bocas, globo e espaço negativo</title>',
    `<rect id="fundo" width="${larguraPx}" height="${y}" fill="#ffffff"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

fs.writeFileSync(path.join(SAIDA, 'prancha-rodada-6.svg'), prancha(), 'utf8');
console.log('ok:', fs.readdirSync(SAIDA).join(', '));
