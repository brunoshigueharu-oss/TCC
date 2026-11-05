/**
 * Rodada 7: oito braços e variações do selo (a partir da rodada 6).
 * Rodada 6 era: polvo "gordinho" a partir do retorno sobre a rodada 5.
 *  - corpo mais largo que a cabeça (barriga), vãos estreitos, tentáculos curtos e cheios;
 *  - lentes mais para a lateral, pupilas mais grossas;
 *  - folha de bocas; globo (símbolo de internet) na cabeça; selo em espaço negativo.
 *
 * Unidades: módulo u (1u = 10 px). Origem no centro da cabeça; y cresce para baixo.
 * Uso: NODE_PATH=<pasta com node_modules> node gerar-rodada-7.cjs
 */
const fs = require('fs');
const path = require('path');
const paper = require('paper/dist/paper-core.js');

paper.setup(new paper.Size(10, 10));
const { Path, Point, Rectangle } = paper;

const U = 10;
const SAIDA = path.join(__dirname, 'rodada-7');
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
  nPernas: 4,
  bracos: false,
};

const largura = (p) => 2 * (p.ombro.x + p.ombro.r);
const perna = (p) => (largura(p) - (p.nPernas - 1) * p.vao) / p.nPernas;

function xsDosVaos(p) {
  const xs = [];
  let x = -largura(p) / 2 + perna(p);
  for (let i = 0; i < p.nPernas - 1; i++) {
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
  const rp = Math.min(p.rPonta, perna(p) / 2);
  for (let i = 0; i < p.nPernas; i++) {
    corpo = corpo.unite(retangulo(x, p.yVao - rp - 0.5, perna(p), p.yBase - p.yVao + rp + 0.5, rp));
    x += perna(p) + p.vao;
  }
  for (const cx of xsDosVaos(p)) {
    const r = p.vao / 2;
    corpo = corpo.subtract(unir(disco(cx, p.yVao + r, r), retangulo(cx - r, p.yVao + r, p.vao, p.yBase)));
  }
  if (p.bracos) corpo = corpo.unite(bracinhos(p));
  return corpo;
}

/**
 * Bracinhos laterais (versão 6 + 2): quarto de anel com centro em (±(L + 0,5); 4),
 * raios 2 e 4,5 (braço de 2,5u), do lado de baixo até o de fora; ponta redonda r1,25.
 * Sai da lateral do corpo entre y = 6 e 8,5 e sobe para fora, como quem acena.
 */
const BRACO = { dx: 0.5, cy: 4, rDentro: 2, rFora: 4.5 };
function bracinhos(p) {
  const L = largura(p) / 2;
  const meio = (BRACO.rDentro + BRACO.rFora) / 2;
  const pecas = [];
  for (const lado of [-1, 1]) {
    const cx = lado * (L + BRACO.dx);
    const quadrante = retangulo(lado > 0 ? cx : cx - 10, BRACO.cy, 10, 10);
    pecas.push(anel(cx, BRACO.cy, BRACO.rFora, BRACO.rDentro).intersect(quadrante));
    pecas.push(disco(cx + lado * meio, BRACO.cy, (BRACO.rFora - BRACO.rDentro) / 2));
  }
  return unir(...pecas);
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

/** Contorno engordado (aprox. de Minkowski): o item somado a 8 cópias deslocadas de `d` u. */
function engordar(item, d) {
  let r = item.clone();
  for (let i = 0; i < 8; i++) {
    const c = item.clone();
    const ang = (i * Math.PI) / 4;
    c.translate(new Point(Math.cos(ang) * d * U, Math.sin(ang) * d * U));
    r = r.unite(c);
  }
  return r;
}

/**
 * Selo: disco R15 com o globo; o polvo fica na frente.
 *  estilo 'cheio' — disco em azul-noite, polvo vazado (espaço negativo); vidro e boca na cor do disco.
 *  estilo 'anel'  — globo só em linha (anel de 1u + grade), polvo positivo com 0,75u de respiro.
 *  grade 'completa' — meridiano rx7, central, equador e paralelos em ±8; 'simples' — meridiano rx7 e equador.
 *  k — escala do polvo; dy — deslocamento vertical do polvo.
 */
function selo(p, { estilo = 'cheio', grade = 'completa', k = 0.75, dy = 0.5 } = {}) {
  const R = 15;
  const e = estilo === 'anel' ? 0.75 : 0.6;
  const polvo = logo({ ...p, globo: false });
  let fora = silhueta(p);
  for (const lado of [-1, 1]) fora = fora.unite(elipse(lado * p.olho.x, p.olho.y, ...p.armacao, lado * p.olho.inclina));
  if (p.alca) fora = fora.unite(alca(p));
  // área dos tentáculos fechada, para as linhas do globo não entrarem nos vãos
  const bloco = fora.unite(retangulo(-largura(p) / 2, p.ombro.y, largura(p), p.yBase - p.ombro.y, Math.min(p.rPonta, perna(p) / 2)));
  for (const item of [polvo, fora, bloco]) {
    item.scale(k, P(0, 0));
    item.translate(P(0, dy));
  }
  const tracos = [elipse(0, 0, 7 + e / 2, R + 1).subtract(elipse(0, 0, 7 - e / 2, R + 1 - e)), retangulo(-R, -e / 2, 2 * R, e)];
  if (grade === 'completa') tracos.push(retangulo(-e / 2, -R, e, 2 * R), retangulo(-R, -8 - e / 2, 2 * R, e), retangulo(-R, 8 - e / 2, 2 * R, e));
  if (estilo === 'anel') {
    const halo = engordar(bloco, 0.75);
    const linhas = unir(...tracos).intersect(disco(0, 0, R - 0.5)).subtract(halo);
    return unir(anel(0, 0, R, R - 1).subtract(halo), linhas, polvo);
  }
  const linhas = unir(...tracos).subtract(bloco);
  return disco(0, 0, R).subtract(linhas).subtract(fora).unite(fora.subtract(polvo));
}

// ---------- variantes ----------

const OITO = { ...BASE, nPernas: 8, vao: 0.6, yBase: 13 }; // 8 × 2,225 + 7 × 0,6 = 22
const SEIS_DOIS = { ...BASE, nPernas: 6, vao: 0.75, bracos: true }; // 6 × 3,04 + 5 × 0,75 = 22

const VARIANTES = [
  { id: 'a-oito-em-fileira', nome: 'A · Oito em fileira', sub: '8 tentáculos de 2,2 com vãos de 0,6', p: OITO },
  { id: 'b-seis-mais-dois', nome: 'B · Seis + dois bracinhos', sub: '6 embaixo, 2 acenando nas laterais', p: SEIS_DOIS },
  { id: 'c-seis-mais-dois-alca', nome: 'C · Seis + dois, com alça', sub: 'B com o arco do rascunho', p: { ...SEIS_DOIS, alca: true } },
];
for (const v of VARIANTES) v.d = dados(logo(v.p));

const SELOS = [
  { id: 's1-selo-quatro', nome: 'S1 · Selo (rodada 6)', sub: 'o que você marcou, para comparar', d: dados(selo(BASE)) },
  { id: 's2-selo-oito', nome: 'S2 · Selo com oito', sub: '8 tentáculos em fileira', d: dados(selo(OITO)) },
  { id: 's3-selo-seis-mais-dois', nome: 'S3 · Selo com 6 + 2', sub: 'bracinhos encostando no globo', d: dados(selo(SEIS_DOIS, { k: 0.62, dy: 0.75 })) },
  { id: 's4-selo-grade-simples', nome: 'S4 · Grade simples', sub: 'só meridiano e equador: menos ruído', d: dados(selo(BASE, { grade: 'simples' })) },
  { id: 's5-selo-maior', nome: 'S5 · Polvo maior', sub: 'escala 0,85, quase tocando a borda', d: dados(selo(BASE, { grade: 'simples', k: 0.85, dy: 0.25 })) },
  { id: 's6-selo-anel', nome: 'S6 · Globo em linha', sub: 'polvo cheio, globo só no traço', d: dados(selo(BASE, { estilo: 'anel' })) },
  { id: 's7-selo-anel-oito', nome: 'S7 · Globo em linha, oito', sub: 'S6 com 8 tentáculos', d: dados(selo(OITO, { estilo: 'anel' })) },
  { id: 's8-selo-alca', nome: 'S8 · Selo com alça', sub: 'a alça como mais um paralelo', d: dados(selo({ ...BASE, alca: true }, { k: 0.7, dy: 1.5 })) },
];

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
  g.push(rotulo(p.ombro.x + p.ombro.r + (p.bracos ? 6 : 0.6), p.ombro.y + 2.4, `ombro r${p.ombro.r} em (±${p.ombro.x}; ${virgula(p.ombro.y)})`));
  g.push(rotulo(p.ombro.x + p.ombro.r + (p.bracos ? 6 : 0.6), p.ombro.y + 3.5, 'corpo = casco dos 3 círculos'));

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
  g.push(rotulo(0, p.yBase + 6, `${virgula(largura(p))} = ${p.nPernas} × ${virgula(perna(p))} + ${p.nPernas - 1} × ${virgula(p.vao)}`, 'middle', GUIA.cota));

  if (p.bracos) {
    for (const lado of [-1, 1]) {
      const cx = lado * (L + BRACO.dx);
      g.push(circ(cx, BRACO.cy, BRACO.rFora, c), circ(cx, BRACO.cy, BRACO.rDentro, c), circ(cx, BRACO.cy, 0.25, `fill="${GUIA.circulo}"`));
    }
    g.push(rotulo(L + 6, BRACO.cy + 6, `bracinho: anel r${BRACO.rDentro}–r${virgula(BRACO.rFora)}`));
    g.push(rotulo(L + 6, BRACO.cy + 7.1, `centro (±${virgula(L + BRACO.dx)}; ${BRACO.cy}), ponta r1,25`));
  }
  let x = -L;
  for (let i = 0; i < p.nPernas; i++) {
    g.push(`<rect x="${px(x)}" y="${px(p.yVao)}" width="${px(perna(p))}" height="${px(p.yBase - p.yVao)}" fill="none" stroke="${GUIA.eixo}" stroke-width="0.6"/>`);
    x += perna(p) + p.vao;
  }
  for (const cx of xsDosVaos(p)) g.push(circ(cx, p.yVao + p.vao / 2, p.vao / 2, c));
  g.push(rotulo(0, p.yBase + 2.2, `vãos r${virgula(p.vao / 2)} · pontas r${virgula(Math.min(p.rPonta, perna(p) / 2))}`, 'middle', GUIA.circulo));

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

const CAIXA = { x0: -13, y0: -11, x1: 13, y1: 14 };
const CAIXA_BRACOS = { x0: -17.5, y0: -11, x1: 17.5, y1: 14 };
const CAIXA_ALCA_BRACOS = { x0: -17.5, y0: -13.5, x1: 17.5, y1: 14 };
const CAIXA_SELO = { x0: -15.5, y0: -15.5, x1: 15.5, y1: 15.5 };
const caixaDe = (v) => (v.p.bracos ? (v.p.alca ? CAIXA_ALCA_BRACOS : CAIXA_BRACOS) : CAIXA);
const caixaArr = (c, m = 1) => [c.x0 - m, c.y0 - m, c.x1 - c.x0 + 2 * m, c.y1 - c.y0 + 2 * m];

fs.mkdirSync(SAIDA, { recursive: true });
for (const v of VARIANTES) fs.writeFileSync(path.join(SAIDA, `${v.id}.svg`), documento(caixaArr(caixaDe(v)), v.nome, arte(v.d)), 'utf8');
for (const s of SELOS) fs.writeFileSync(path.join(SAIDA, `${s.id}.svg`), documento(caixaArr(CAIXA_SELO), s.nome, arte(s.d)), 'utf8');

const construcaoDe = (v, prefixo = '') =>
  [grupo(`${prefixo}arte`, caminho(v.d, `fill="${COR.noite}" fill-rule="evenodd"`), 'opacity="0.18"'), construcao(v.p, prefixo)].join('\n');
for (const v of VARIANTES.slice(0, 2)) {
  fs.writeFileSync(
    path.join(SAIDA, `${v.id}-construcao.svg`),
    documento([-38, -16, 76, 36], `${v.nome} — construção`, [grade(-38, -16, 38, 20), construcaoDe(v)].join('\n'), COR.branco),
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

  let y = 70;
  partes.push(titulo(y - 22, 'Rodada 7 — oito braços'));
  VARIANTES.forEach((v, i) =>
    partes.push(celula({ x: X(i), y, w: col, h: alt, caixaPx: emPx(caixaDe(v)), conteudo: arte(v.d, COR.noite, `pr-${v.id}`), legenda: v.nome, sub: v.sub }))
  );
  partes.push(celula({ x: X(3), y, w: col, h: alt, caixaPx: emPx(caixaDe(VARIANTES[1])), conteudo: arte(VARIANTES[1].d, COR.branco, 'pr-b-cor'), legenda: 'B em branco sobre azul-noite', fundo: COR.noite }));

  y += alt + 60;
  partes.push(titulo(y - 22, 'Construção'));
  VARIANTES.slice(0, 2).forEach((v, i) =>
    partes.push(
      celula({
        x: X(2 * i), y, w: 2 * col + vao, h: alt,
        caixaPx: emPx({ x0: -38, y0: -16, x1: 38, y1: 20 }),
        conteudo: construcaoDe(v, `pr-${v.id}-`),
        legenda: `${v.nome} — linhas de construção`,
        fundo: '#ffffff',
      })
    )
  );

  for (let linha = 0; linha < 2; linha++) {
    y += alt + 60;
    partes.push(titulo(y - 22, linha === 0 ? 'Selos' : 'Selos (cont.)'));
    SELOS.slice(linha * 4, linha * 4 + 4).forEach((s, i) =>
      partes.push(celula({ x: X(i), y, w: col, h: alt, caixaPx: emPx(CAIXA_SELO), conteudo: arte(s.d, COR.noite, `pr-${s.id}`), legenda: s.nome, sub: s.sub }))
    );
  }

  y += alt + 60;
  partes.push(titulo(y - 22, 'Selo em cor (paleta Risografia + verde-água)'));
  const cores = [
    { fundo: '#ffffff', frente: COR.agua, nome: 'Verde-água sobre branco' },
    { fundo: '#ffffff', frente: COR.riso, nome: 'Azul riso sobre branco' },
    { fundo: COR.limao, frente: COR.noite, nome: 'Azul-noite sobre limão' },
    { fundo: COR.rosa, frente: COR.noite, nome: 'Azul-noite sobre rosa flúor' },
  ];
  cores.forEach((c, i) =>
    partes.push(celula({ x: X(i), y, w: col, h: alt, caixaPx: emPx(CAIXA_SELO), conteudo: arte(SELOS[0].d, c.frente, `pr-cor-${i}`), legenda: c.nome, fundo: c.fundo }))
  );

  y += alt + 60;
  partes.push(titulo(y - 22, 'Tamanhos pequenos (16, 24, 32, 48 px)'));
  [
    { nome: VARIANTES[0].nome, d: VARIANTES[0].d, c: CAIXA },
    { nome: VARIANTES[1].nome, d: VARIANTES[1].d, c: CAIXA_BRACOS },
    { nome: SELOS[0].nome, d: SELOS[0].d, c: CAIXA_SELO },
    { nome: SELOS[3].nome, d: SELOS[3].d, c: CAIXA_SELO },
  ].forEach((v, li) => {
    let xx = esq;
    const yy = y + li * 70;
    partes.push(`<text x="${xx}" y="${yy + 30}" font-family="${FONTE}" font-size="12" fill="${COR.noite}">${v.nome}</text>`);
    xx += 240;
    for (const t of [16, 24, 32, 48]) {
      const k = t / ((v.c.y1 - v.c.y0) * U);
      partes.push(`<g transform="translate(${n(xx - k * v.c.x0 * U)} ${n(yy + 48 - t - k * v.c.y0 * U)}) scale(${n(k * 10000) / 10000})">${caminho(v.d, `fill="${COR.noite}" fill-rule="evenodd"`)}</g>`);
      xx += t * ((v.c.x1 - v.c.x0) / (v.c.y1 - v.c.y0)) + 40;
    }
  });
  y += 4 * 70 + 20;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${larguraPx} ${y}">`,
    '<title>Rodada 7 — oito braços e selos</title>',
    `<rect id="fundo" width="${larguraPx}" height="${y}" fill="#ffffff"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

fs.writeFileSync(path.join(SAIDA, 'prancha-rodada-7.svg'), prancha(), 'utf8');
console.log('ok:', fs.readdirSync(SAIDA).join(', '));
