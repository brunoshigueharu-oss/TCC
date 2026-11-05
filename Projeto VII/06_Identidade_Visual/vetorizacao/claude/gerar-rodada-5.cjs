/**
 * Rodada 5: logo nova a partir do rascunho fontes/rascunho-polvo-v4.png
 * (polvo de corpo em cápsula, óculos nas laterais, quatro tentáculos curtos).
 *
 * Unidades: módulo u (1u = 10 px). Origem no centro da cabeça; y cresce para baixo.
 * Uso: NODE_PATH=<pasta com node_modules> node gerar-rodada-5.cjs
 */
const fs = require('fs');
const path = require('path');
const paper = require('paper/dist/paper-core.js');

paper.setup(new paper.Size(10, 10));
const { Path, Point, Rectangle } = paper;

const U = 10;
const SAIDA = path.join(__dirname, 'rodada-5');
const COR = {
  noite: '#1B1F3B',
  branco: '#FFFFFF',
  agua: '#14B38E',
  rosa: '#FF48B0',
  limao: '#F5EE4A',
  riso: '#0B8FE0',
};
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
function elipse(cx, cy, rx, ry, graus) {
  const e = new Path.Ellipse({ center: P(cx, cy), radius: [rx * U, ry * U] });
  e.rotate(graus, P(cx, cy));
  return e;
}
function pilula(cx, cy, w, h, graus) {
  const p = retangulo(cx - w / 2, cy - h / 2, w, h, w / 2);
  p.rotate(graus, P(cx, cy));
  return p;
}

/**
 * Sistema (todas as medidas em u):
 *  - cabeça: círculo R10; o corpo desce reto das laterais até a linha dos vãos (y = 10).
 *    Proporção vertical cabeça : corpo : tentáculos = 10 : 10 : 4 (altura total 24).
 *  - tentáculos: largura 20 dividida em 4 tentáculos de 3,5 e 3 vãos de 2 (4·3,5 + 3·2 = 20);
 *    o vão central cai no eixo. Topo dos vãos em semicírculo r1; pontas com raio 1.
 *  - óculos: centro em (±7,5; -2) — 3/4 do raio para fora, 1/5 do raio acima do centro.
 *    Armação elipse 3,75 × 4,75, vidro 2,75 × 3,75 (armação de 1u), inclinadas 15° para fora.
 *    A armação passa 1,25u da silhueta: o óculos "abraça" a cabeça.
 *  - pupila: pílula 1 × 3, no centro do vidro, no mesmo ângulo.
 *  - boca: traço 2 × 0,75 com pontas redondas, no eixo, em y = 1,5.
 */
const BASE = {
  R: 10,
  yVao: 10,
  yBase: 14,
  perna: 3.5,
  vao: 2,
  rPonta: 1,
  olho: { x: 7.5, y: -2, inclina: 15 },
  armacao: [3.75, 4.75],
  vidro: [2.75, 3.75],
  pupila: [1, 3],
  boca: { y: 1.5, w: 2, h: 0.75 },
  alca: false,
  circuito: false,
};

function xsDosVaos(p) {
  const xs = [];
  let x = -p.R + p.perna;
  for (let i = 0; i < 3; i++) {
    xs.push(x + p.vao / 2);
    x += p.vao + p.perna;
  }
  return xs;
}

function silhueta(p) {
  const cabeca = disco(0, 0, p.R);
  const tronco = retangulo(-p.R, 0, 2 * p.R, p.yBase - p.rPonta);
  // tentáculos com pontas arredondadas
  const pernas = [];
  let x = -p.R;
  for (let i = 0; i < 4; i++) {
    pernas.push(retangulo(x, p.yVao - 1, p.perna, p.yBase - p.yVao + 1, p.rPonta));
    x += p.perna + p.vao;
  }
  let corpo = unir(cabeca, retangulo(-p.R, 0, 2 * p.R, p.yVao), ...pernas);
  tronco.remove();
  // vãos: retângulo + semicírculo no topo
  for (const cx of xsDosVaos(p)) {
    const r = p.vao / 2;
    const vao = unir(disco(cx, p.yVao + r, r), retangulo(cx - r, p.yVao + r, p.vao, p.yBase));
    corpo = corpo.subtract(vao);
  }
  return corpo;
}

function logo(p) {
  let forma = silhueta(p);
  for (const lado of [-1, 1]) {
    const cx = lado * p.olho.x;
    const g = lado * p.olho.inclina;
    forma = forma.unite(elipse(cx, p.olho.y, ...p.armacao, g));
    forma = forma.subtract(elipse(cx, p.olho.y, ...p.vidro, g));
    if (p.pupila) forma = forma.unite(pilula(cx, p.olho.y, ...p.pupila, g));
  }
  if (p.boca) forma = forma.subtract(pilula(0, p.boca.y, p.boca.h, p.boca.w, 90));
  if (p.alca) forma = forma.unite(alca(p));
  if (p.circuito) forma = forma.unite(circuito(p));
  return forma;
}

/** Alça: arco concêntrico à cabeça, R + 1,5 com 1u de espessura, ligando o topo das armações. */
function alca(p) {
  const anel = disco(0, 0, p.R + 2).subtract(disco(0, 0, p.R + 1));
  const corte = retangulo(-p.R - 3, p.olho.y - 1, 2 * p.R + 6, 30);
  const arco = anel.subtract(corte);
  return arco;
}

/**
 * Circuito: três trilhas por lado, 0,75u de espessura, terminando em nó r0,9.
 * Começam a cerca de 1,25u da silhueta, em y = -4, 1,5 e 6.
 */
function circuito(p) {
  const e = 0.75;
  const no = 0.9;
  const trilhas = [];
  for (const lado of [-1, 1]) {
    const X = (v) => lado * v;
    const h = (x1, x2, y) => retangulo(Math.min(X(x1), X(x2)), y - e / 2, Math.abs(x2 - x1), e);
    const v = (x, y1, y2) => retangulo(X(x) - e / 2, Math.min(y1, y2), e, Math.abs(y2 - y1));
    // de cima: sai da armação, dobra para cima
    trilhas.push(h(12.5, 14.5 + e / 2, -4), v(14.5, -4, -8), disco(X(14.5), -8, no));
    // do meio: reta longa
    trilhas.push(h(12.5, 18, 1.5), disco(X(18), 1.5, no));
    // de baixo: sai do corpo, dobra para baixo
    trilhas.push(h(11.25, 13.5 + e / 2, 6), v(13.5, 6, 10), disco(X(13.5), 10, no));
  }
  return unir(...trilhas);
}

// ---------- variantes ----------

const VARIANTES = [
  { id: 'a-principal', nome: 'A · Principal', sub: 'o rascunho, construído', p: { ...BASE } },
  { id: 'b-circuito', nome: 'B · Circuito', sub: 'trilhas de circuito do 2º rascunho', p: { ...BASE, circuito: true } },
  {
    id: 'c-reduzida',
    nome: 'C · Reduzida (16–24 px)',
    sub: 'sem boca, vidro e pupila maiores',
    p: { ...BASE, boca: null, armacao: [4, 5], vidro: [2.75, 3.75], pupila: [1.5, 3], olho: { ...BASE.olho, x: 7.25 } },
  },
  {
    id: 'd-olhar-reto',
    nome: 'D · Olhar reto',
    sub: 'óculos redondos, sem inclinação',
    p: { ...BASE, armacao: [4.25, 4.25], vidro: [3.25, 3.25], pupila: [1, 2.75], olho: { ...BASE.olho, inclina: 0 } },
  },
  { id: 'e-alca', nome: 'E · Alça', sub: 'o arco do rascunho lido como alça/fone', p: { ...BASE, alca: true } },
];

for (const v of VARIANTES) v.d = dados(logo(v.p));

// ---------- SVG ----------

const caminho = (d, a) => `<path d="${d}" ${a}/>`;
const grupo = (id, c, a = '') => `<g id="${id}"${a ? ' ' + a : ''}>\n${c}\n</g>`;
const linha = (x1, y1, x2, y2, a) => `<line x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}" ${a}/>`;
const circ = (x, y, r, a) => `<circle cx="${px(x)}" cy="${px(y)}" r="${px(r)}" ${a}/>`;
const elip = (x, y, rx, ry, g, a) =>
  `<ellipse cx="${px(x)}" cy="${px(y)}" rx="${px(rx)}" ry="${px(ry)}" transform="rotate(${g} ${px(x)} ${px(y)})" ${a}/>`;
const texto = (x, y, s, a = '') => `<text x="${px(x)}" y="${px(y)}" font-family="${FONTE}" ${a}>${s}</text>`;
const arte = (d, cor = COR.noite, id = 'logo') => grupo(id, caminho(d, `fill="${cor}" fill-rule="evenodd"`));

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
  const rotulo = (x, y, s, ancora = 'start', cor = GUIA.circulo) =>
    texto(x, y, s, `font-size="9" fill="${cor}" text-anchor="${ancora}"`);
  const g = [];

  // eixos e linhas horizontais de referência
  g.push(linha(0, -13, 0, p.yBase + 3, eixo));
  for (const [y, s] of [
    [-p.R, 'topo'],
    [p.olho.y, 'linha dos olhos (−2)'],
    [0, 'centro da cabeça (0)'],
    [p.boca ? p.boca.y : 1.5, 'boca (1,5)'],
    [p.yVao, 'vãos (10)'],
    [p.yBase, 'base (14)'],
  ]) {
    g.push(linha(-24, y, 24, y, fino));
    g.push(rotulo(24.5, y + 0.35, s, 'start', GUIA.eixo));
  }
  // laterais do corpo
  g.push(linha(-p.R, -13, -p.R, p.yBase + 3, fino), linha(p.R, -13, p.R, p.yBase + 3, fino));

  // cabeça
  g.push(circ(0, 0, p.R, c), circ(0, 0, 0.25, `fill="${GUIA.circulo}"`));
  g.push(rotulo(-2.5, -p.R - 0.6, 'cabeça R10', 'end'));

  // proporção vertical
  const cota = (y1, y2, s) => {
    g.push(linha(-21, y1, -21, y2, `stroke="${GUIA.cota}" stroke-width="0.8"`));
    g.push(linha(-21.6, y1, -20.4, y1, `stroke="${GUIA.cota}" stroke-width="0.8"`));
    g.push(linha(-21.6, y2, -20.4, y2, `stroke="${GUIA.cota}" stroke-width="0.8"`));
    g.push(rotulo(-21.8, (y1 + y2) / 2 + 0.35, s, 'end', GUIA.cota));
  };
  cota(-p.R, 0, '10');
  cota(0, p.yVao, '10');
  cota(p.yVao, p.yBase, '4');

  // tentáculos: colunas e vãos
  let x = -p.R;
  for (let i = 0; i < 4; i++) {
    g.push(`<rect x="${px(x)}" y="${px(p.yVao)}" width="${px(p.perna)}" height="${px(p.yBase - p.yVao)}" fill="none" stroke="${GUIA.eixo}" stroke-width="0.6"/>`);
    g.push(rotulo(x + p.perna / 2, p.yBase + 1.6, '3,5', 'middle', GUIA.cota));
    if (i < 3) g.push(rotulo(x + p.perna + p.vao / 2, p.yBase + 1.6, '2', 'middle', GUIA.cota));
    x += p.perna + p.vao;
  }
  for (const cx of xsDosVaos(p)) g.push(circ(cx, p.yVao + p.vao / 2, p.vao / 2, c));
  g.push(rotulo(0, p.yBase + 3.4, '4 × 3,5 + 3 × 2 = 20 · vãos r1', 'middle', GUIA.circulo));

  // óculos
  for (const lado of [-1, 1]) {
    const cx = lado * p.olho.x;
    const ang = lado * p.olho.inclina;
    g.push(elip(cx, p.olho.y, ...p.armacao, ang, c));
    g.push(elip(cx, p.olho.y, ...p.vidro, ang, c));
    const rad = (ang * Math.PI) / 180;
    const k = 6.5;
    g.push(linha(cx - Math.sin(rad) * -k, p.olho.y - Math.cos(rad) * k, cx + Math.sin(rad) * -k, p.olho.y + Math.cos(rad) * k, eixo));
    g.push(circ(cx, p.olho.y, 0.25, `fill="${GUIA.circulo}"`));
    g.push(linha(cx, p.olho.y, cx, -13, fino));
  }
  // centro dos olhos a 3/4 do raio
  g.push(linha(0, -11.6, p.olho.x, -11.6, `stroke="${GUIA.cota}" stroke-width="0.8"`));
  g.push(rotulo(p.olho.x / 2, -12, '7,5 = ¾ R', 'middle', GUIA.cota));
  g.push(rotulo(p.olho.x + 4.4, -7.4, `armação ${n(p.armacao[0]).replace('.', ',')} × ${n(p.armacao[1]).replace('.', ',')}`));
  g.push(rotulo(p.olho.x + 4.4, -6.3, `vidro ${n(p.vidro[0]).replace('.', ',')} × ${n(p.vidro[1]).replace('.', ',')}`));
  g.push(rotulo(p.olho.x + 4.4, -5.2, `inclinação ${p.olho.inclina}° para fora`));
  if (p.pupila) g.push(rotulo(p.olho.x + 4.4, -4.1, `pupila ${n(p.pupila[0]).replace('.', ',')} × ${p.pupila[1]}`));

  return grupo(`${prefixo}construcao`, g.join('\n'));
}

const CAIXA = { x0: -12, y0: -11, x1: 12, y1: 15 };
const CAIXA_CIRC = { x0: -19.5, y0: -11, x1: 19.5, y1: 15 };
const caixaDe = (v) => (v.p.circuito ? CAIXA_CIRC : CAIXA);
const caixaArr = (c, m = 1) => [c.x0 - m, c.y0 - m, c.x1 - c.x0 + 2 * m, c.y1 - c.y0 + 2 * m];

fs.mkdirSync(SAIDA, { recursive: true });

// peças soltas
for (const v of VARIANTES) {
  fs.writeFileSync(path.join(SAIDA, `${v.id}.svg`), documento(caixaArr(caixaDe(v)), v.nome, arte(v.d)), 'utf8');
}

// prancha de construção da principal
const A = VARIANTES[0];
fs.writeFileSync(
  path.join(SAIDA, 'a-construcao.svg'),
  documento(
    [-34, -16, 68, 34],
    'A · Principal — construção',
    [
      grade(-34, -16, 34, 18),
      grupo('arte', caminho(A.d, `fill="${COR.noite}" fill-rule="evenodd"`), 'opacity="0.18"'),
      construcao(A.p),
    ].join('\n'),
    COR.branco
  ),
  'utf8'
);

// ícone de app
function icone(v, fundo, frente, id) {
  const lado = 36;
  return grupo(
    id,
    [
      `<rect x="${px(-lado / 2)}" y="${px(-lado / 2)}" width="${px(lado)}" height="${px(lado)}" rx="${px(lado * 0.225)}" fill="${fundo}"/>`,
      `<g transform="translate(0 ${px(-1.5)}) scale(0.95)">${caminho(v.d, `fill="${frente}" fill-rule="evenodd"`)}</g>`,
    ].join('\n')
  );
}
fs.writeFileSync(path.join(SAIDA, 'f-icone-app.svg'), documento([-18, -18, 36, 36], 'F · Ícone de app', icone(A, COR.noite, COR.branco, 'icone')), 'utf8');

// ---------- prancha geral ----------

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
  const largura = esq * 2 + 4 * col + 3 * vao;
  const partes = [];
  const titulo = (y, s) => `<text x="${esq}" y="${y}" font-family="${FONTE}" font-size="20" font-weight="bold" fill="${COR.noite}">${s}</text>`;

  let y = 70;
  partes.push(titulo(y - 22, 'Rodada 5 — rascunho e construção'));
  partes.push(
    `<rect x="${X(0)}" y="${y}" width="${col}" height="${alt - 46}" fill="#ffffff" stroke="#e5e7eb"/>`,
    `<image href="../../fontes/rascunho-polvo-v4.png" x="${X(0) - 123}" y="${y + 42}" width="533.33" height="400" clip-path="url(#corte-rascunho)"/>`,
    `<clipPath id="corte-rascunho"><rect x="${X(0)}" y="${y}" width="${col}" height="${alt - 46}"/></clipPath>`,
    `<text x="${X(0)}" y="${y + alt - 28}" font-family="${FONTE}" font-size="13" font-weight="bold" fill="${COR.noite}">Seu rascunho</text>`,
    `<text x="${X(0)}" y="${y + alt - 12}" font-family="${FONTE}" font-size="11" fill="#6b7280">fontes/rascunho-polvo-v4.png</text>`
  );
  partes.push(celula({ x: X(1), y, w: col, h: alt, caixaPx: emPx(CAIXA), conteudo: arte(A.d, COR.noite, 'pr-a'), legenda: A.nome, sub: A.sub }));
  partes.push(
    celula({
      x: X(2), y, w: 2 * col + vao, h: alt,
      caixaPx: emPx({ x0: -34, y0: -16, x1: 34, y1: 18 }),
      conteudo: [grupo('pr-arte', caminho(A.d, `fill="${COR.noite}" fill-rule="evenodd"`), 'opacity="0.18"'), construcao(A.p, 'pr-')].join('\n'),
      legenda: 'Linhas de construção',
      sub: 'módulo u; cabeça : corpo : tentáculos = 10 : 10 : 4',
      fundo: '#ffffff',
    })
  );

  y += alt + 60;
  partes.push(titulo(y - 22, 'Variantes'));
  VARIANTES.slice(1).forEach((v, i) =>
    partes.push(celula({ x: X(i), y, w: col, h: alt, caixaPx: emPx(caixaDe(v)), conteudo: arte(v.d, COR.noite, `pr-${v.id}`), legenda: v.nome, sub: v.sub }))
  );

  y += alt + 60;
  partes.push(titulo(y - 22, 'Cor e aplicação (paleta Risografia + verde-água)'));
  const aplic = [
    { fundo: '#ffffff', frente: COR.noite, nome: 'Azul-noite sobre branco' },
    { fundo: COR.noite, frente: COR.branco, nome: 'Branco sobre azul-noite' },
    { fundo: COR.agua, frente: COR.noite, nome: 'Azul-noite sobre verde-água' },
  ];
  aplic.forEach((a, i) =>
    partes.push(celula({ x: X(i), y, w: col, h: alt, caixaPx: emPx(CAIXA), conteudo: arte(A.d, a.frente, `pr-cor-${i}`), legenda: a.nome, fundo: a.fundo }))
  );
  partes.push(
    celula({ x: X(3), y, w: col, h: alt, caixaPx: emPx({ x0: -18, y0: -18, x1: 18, y1: 18 }), conteudo: icone(A, COR.noite, COR.branco, 'pr-icone'), legenda: 'F · Ícone de app', sub: 'cantos 22,5% do lado' })
  );

  y += alt + 60;
  partes.push(titulo(y - 22, 'Tamanhos pequenos (16, 24, 32, 48 px)'));
  const tamanhos = [16, 24, 32, 48];
  [A, VARIANTES[2]].forEach((v, linhaI) => {
    let xx = esq;
    const yy = y + linhaI * 80;
    partes.push(`<text x="${xx}" y="${yy + 30}" font-family="${FONTE}" font-size="12" fill="${COR.noite}">${v.nome}</text>`);
    xx += 200;
    for (const t of tamanhos) {
      const k = t / ((CAIXA.y1 - CAIXA.y0) * U);
      partes.push(`<g transform="translate(${n(xx - k * CAIXA.x0 * U)} ${n(yy + 48 - t - k * CAIXA.y0 * U)}) scale(${n(k * 10000) / 10000})">${caminho(v.d, `fill="${COR.noite}" fill-rule="evenodd"`)}</g>`);
      xx += t + 40;
    }
  });
  y += 170;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${largura} ${y}">`,
    '<title>Rodada 5 — logo a partir do rascunho</title>',
    `<rect id="fundo" width="${largura}" height="${y}" fill="#ffffff"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

fs.writeFileSync(path.join(SAIDA, 'prancha-rodada-5.svg'), prancha(), 'utf8');
console.log('ok:', fs.readdirSync(SAIDA).join(', '));
