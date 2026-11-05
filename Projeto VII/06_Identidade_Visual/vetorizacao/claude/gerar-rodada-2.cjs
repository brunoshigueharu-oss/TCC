/**
 * Rodada 2: variações do símbolo "rosto do mascote" que voltam a ler como polvo.
 * Reaproveita o sistema e os utilitários de gerar.cjs.
 *
 * Uso: NODE_PATH=<pasta com node_modules/paper> node gerar-rodada-2.cjs
 */
const fs = require('fs');
const path = require('path');
const base = require('./gerar.cjs');

const { U, COR, FONTE, M, R, n, px, P, disco, retangulo, unir, dados, caminho, grupo, documento, original, celula, dRosto, CAIXA_ROSTO, emPx } = base;
const SAIDA = path.join(__dirname, 'rodada-2');

const LENTE_X = M.lente.x;
const RAIO_CABECA = M.cabeca.r;

/** Leque de barras retas a partir de um centro, cortadas por um círculo. */
function leque({ cy, r, angulos, largura, miolo }) {
  const limite = disco(0, cy, r);
  const partes = [disco(0, cy, miolo)];
  for (const ang of angulos) {
    for (const s of [-1, 1]) {
      const barra = retangulo(-largura / 2, cy, largura, r + 2);
      barra.rotate(-s * ang, P(0, cy));
      partes.push(barra.intersect(limite));
    }
  }
  return unir(...partes);
}

/** Braço em U: haste reta, meia-volta em arco e ponta redonda virada para cima. */
function bracoEnrolado({ lado, xHaste, yTopo, yArco, raio, largura }) {
  const cx = lado * (xHaste + raio);
  const meiaVolta = disco(cx, yArco, raio + largura / 2)
    .subtract(disco(cx, yArco, raio - largura / 2))
    .intersect(retangulo(cx - 20, yArco, 40, 20));
  const haste = retangulo(lado * xHaste - largura / 2, yTopo, largura, yArco - yTopo);
  const ponta = disco(lado * (xHaste + 2 * raio), yArco, largura / 2);
  return unir(meiaVolta, haste, ponta);
}

/** Tentáculo lateral: faixa concêntrica ao óculo, com vão de 1u, que sobe pelo lado de fora. */
function tentaculoLateral({ lado, rDentro, rFora, anguloFim, anguloInicio }) {
  const faixa = disco(lado * LENTE_X, 0, rFora).subtract(disco(lado * LENTE_X, 0, rDentro));
  const pontos = [P(lado * LENTE_X, 0)];
  for (let a = anguloFim; a <= anguloInicio; a += 5) {
    const rad = (a * Math.PI) / 180;
    pontos.push(P(lado * (LENTE_X + 40 * Math.cos(rad)), 40 * Math.sin(rad)));
  }
  return faixa.intersect(new base.paper.Path({ segments: pontos, closed: true }));
}

function olho(tipo, lado) {
  const cx = lado * LENTE_X;
  const t = R.traco;
  if (tipo === 'arco') {
    return disco(cx, 1, 2.75).subtract(disco(cx, 1, 1.25)).intersect(retangulo(cx - 5, -5, 10, 6));
  }
  const traco = retangulo(cx - t.w / 2, -t.h / 2, t.w, t.h);
  if (tipo === 'focado') traco.rotate(-lado * 45, P(cx, 0));
  return traco;
}

/**
 * Monta um símbolo de uma cor só.
 * cabecaY: centro da cabeça em relação à linha dos olhos (negativo = cabeça mais alta).
 */
function simbolo({ cabecaY, bracos, gola, olhos = ['traco', 'traco'], boca = { y: 3.25, r: 1.5 }, ventosas = [] }) {
  const massas = [disco(0, cabecaY, RAIO_CABECA), disco(-LENTE_X, 0, M.lente.rFora), disco(LENTE_X, 0, M.lente.rFora), ...bracos];
  if (gola) {
    const faixa = retangulo(-40, gola.y, 80, 40);
    for (const s of [-1, 1]) massas.push(disco(s * LENTE_X, 0, gola.r).intersect(faixa));
  }
  let forma = unir(...massas);
  for (const s of [-1, 1]) forma = forma.subtract(disco(s * LENTE_X, 0, R.lente.rFuro));
  if (boca) forma = forma.subtract(disco(0, boca.y, boca.r).intersect(retangulo(-5, boca.y, 10, 5)));
  for (const [x, y, r] of ventosas) forma = forma.subtract(disco(x, y, r));
  forma = forma.unite(olho(olhos[0], -1)).unite(olho(olhos[1], 1));
  return dados(forma);
}

const CABECA_ALTA = -4; // o olho desce para a base da cabeça, como na logo original
const lequeDe4 = leque({ cy: 6.5, r: 9, angulos: [18, 54], largura: 3, miolo: 2 });
const lequeDe6 = () => leque({ cy: 8, r: 10, angulos: [15, 45, 75], largura: 3, miolo: 2.5 });
const enrolados = () => [
  retangulo(-6.5, 3, 13, 3), // base reta: os vãos entre os braços começam todos na mesma linha
  ...[-1, 1].map((lado) => bracoEnrolado({ lado, xHaste: 5.25, yTopo: 3, yArco: 8.5, raio: 3, largura: 2.5 })),
  ...[-1, 1].map((lado) => bracoEnrolado({ lado, xHaste: 1.75, yTopo: 3, yArco: 15, raio: 2.25, largura: 2.5 })),
];
const pontosNoBraco = (ang, cy, distancias) =>
  [-1, 1].flatMap((s) => distancias.map((d) => [s * d * Math.sin((ang * Math.PI) / 180), cy + d * Math.cos((ang * Math.PI) / 180), 0.6]));

const VARIACOES = [
  {
    arquivo: '1-manto-alto',
    titulo: '1 · Manto alto',
    sub: 'cabeça mais alta, olhos na base como na sua logo',
    caixa: { x0: -15, y0: -14, x1: 15, y1: 15.5 },
    d: simbolo({ cabecaY: CABECA_ALTA, bracos: [lequeDe4] }),
  },
  {
    arquivo: '2-seis-bracos',
    titulo: '2 · Seis braços',
    sub: 'leque de 6, todos retos e com a mesma largura',
    caixa: { x0: -15, y0: -14, x1: 15, y1: 18 },
    d: simbolo({ cabecaY: CABECA_ALTA, bracos: [lequeDe6()] }),
  },
  {
    arquivo: '3-tentaculos-laterais-colados',
    titulo: '3 · Tentáculos laterais colados',
    sub: 'seus 6 tentáculos; os laterais abraçam os óculos',
    caixa: { x0: -17, y0: -14, x1: 17, y1: 15.5 },
    d: simbolo({ cabecaY: CABECA_ALTA, bracos: [lequeDe4], gola: { r: 9, y: 3 }, boca: null }),
  },
  {
    arquivo: '4-olhar-focado',
    titulo: '4 · Olhar focado',
    sub: 'seis braços com os traços a 45° da sua logo',
    caixa: { x0: -15, y0: -14, x1: 15, y1: 18 },
    d: simbolo({ cabecaY: CABECA_ALTA, bracos: [lequeDe6()], olhos: ['focado', 'focado'] }),
  },
  {
    arquivo: '5-bracos-enrolados',
    titulo: '5 · Braços enrolados',
    sub: 'quatro braços em U, com vão de 1u entre eles',
    caixa: { x0: -15, y0: -14, x1: 15, y1: 18.5 },
    d: simbolo({ cabecaY: CABECA_ALTA, bracos: enrolados() }),
  },
  {
    arquivo: '6-piscadela',
    titulo: '6 · Piscadela',
    sub: 'um olho em arco, sorriso maior e ventosas',
    caixa: { x0: -15, y0: -14, x1: 15, y1: 18 },
    d: simbolo({
      cabecaY: CABECA_ALTA,
      bracos: [lequeDe6()],
      olhos: ['traco', 'arco'],
      boca: { y: 3, r: 2 },
      ventosas: [...pontosNoBraco(75, 8, [5, 7.25]), ...pontosNoBraco(45, 8, [5.5, 7.75])],
    }),
  },
  {
    arquivo: '7-tentaculos-laterais-soltos',
    titulo: '7 · Tentáculos laterais soltos',
    sub: 'os laterais com vão de 1u e ponta reta, iguais aos de baixo',
    caixa: { x0: -18, y0: -14, x1: 18, y1: 15.5 },
    d: simbolo({
      cabecaY: CABECA_ALTA,
      bracos: [lequeDe4, ...[-1, 1].map((lado) => tentaculoLateral({ lado, rDentro: 8, rFora: 10.5, anguloFim: 25, anguloInicio: 150 }))],
    }),
  },
];

const arte = (d, cor, id) => grupo(id, caminho(d, `fill="${cor}" fill-rule="evenodd"`));

function icone(v, id) {
  const lado = 40;
  const meioY = (v.caixa.y0 + v.caixa.y1) / 2;
  return grupo(
    id,
    [
      `<rect x="${px(-lado / 2)}" y="${px(-lado / 2)}" width="${px(lado)}" height="${px(lado)}" rx="${px(lado * 0.225)}" fill="${COR.roxo}"/>`,
      `<g transform="translate(0 ${px(-meioY)})">${caminho(v.d, `fill="${COR.branco}" fill-rule="evenodd"`)}</g>`,
    ].join('\n')
  );
}

for (const v of VARIACOES) {
  const m = 2;
  fs.writeFileSync(
    path.join(SAIDA, `${v.arquivo}.svg`),
    documento({
      caixa: [v.caixa.x0 - m, v.caixa.y0 - m, v.caixa.x1 - v.caixa.x0 + 2 * m, v.caixa.y1 - v.caixa.y0 + 2 * m],
      conteudo: arte(v.d, COR.preto, 'simbolo'),
      titulo: `Rodada 2 — ${v.titulo}`,
    }),
    'utf8'
  );
}

function prancha() {
  const col = 300;
  const vao = 20;
  const alt = 340;
  const esq = 40;
  const X = (i) => esq + i * (col + vao);
  const partes = [];
  const titulo = (y, s) => `<text x="${esq}" y="${y}" font-family="${FONTE}" font-size="20" font-weight="bold" fill="${COR.preto}">${s}</text>`;
  const logoOrig = original('logo-original.svg');

  let y = 80;
  partes.push(titulo(y - 20, 'De onde partimos'));
  partes.push(celula({ x: X(0), y, w: col, h: alt, conteudo: logoOrig.miolo, caixaPx: logoOrig.caixaPx, legenda: 'Sua logo', sub: 'cabeça alta, olhos na base, 6 tentáculos' }));
  partes.push(celula({ x: X(1), y, w: col, h: alt, conteudo: arte(dRosto, COR.preto, 'ref-rosto'), caixaPx: emPx(CAIXA_ROSTO), legenda: 'Rosto do mascote (rodada 1)', sub: 'olhos no meio da cabeça, braços curtos: alien' }));

  y += alt + 70;
  partes.push(titulo(y - 20, 'Variações'));
  VARIACOES.forEach((v, i) => {
    partes.push(celula({ x: X(i), y, w: col, h: alt, conteudo: arte(v.d, COR.preto, `v${i + 1}`), caixaPx: emPx(v.caixa), legenda: v.titulo, sub: v.sub }));
  });

  y += alt + 70;
  partes.push(titulo(y - 20, 'Como ícone de app'));
  VARIACOES.forEach((v, i) => {
    partes.push(celula({ x: X(i), y, w: col, h: alt, conteudo: icone(v, `icone${i + 1}`), caixaPx: { x0: -200, y0: -200, x1: 200, y1: 200 }, legenda: v.titulo }));
  });

  y += alt + 60;
  partes.push(titulo(y - 20, 'Tamanho pequeno (64 · 32 · 24 · 16 px de altura)'));
  VARIACOES.forEach((v, i) => {
    let cx = X(i);
    const c = emPx(v.caixa);
    for (const tam of [64, 32, 24, 16]) {
      const k = tam / (c.y1 - c.y0);
      partes.push(`<g transform="translate(${n(cx - k * c.x0)} ${n(y + 64 - tam - k * c.y0)}) scale(${n(k * 10000) / 10000})">${caminho(v.d, `fill="${COR.preto}" fill-rule="evenodd"`)}</g>`);
      cx += k * (c.x1 - c.x0) + 16;
    }
  });

  const largura = esq * 2 + VARIACOES.length * col + (VARIACOES.length - 1) * vao;
  const altura = y + 110;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}">`,
    '<title>Rodada 2 — rosto do mascote de volta a polvo</title>',
    `<rect id="fundo" width="${largura}" height="${altura}" fill="${COR.branco}"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

fs.writeFileSync(path.join(SAIDA, 'prancha-rodada-2.svg'), prancha(), 'utf8');
console.log('ok');
