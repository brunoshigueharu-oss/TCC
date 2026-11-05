/**
 * Rodada 3: a logo nova do Bruno (traços dos olhos na horizontal e sorriso)
 * refeita sobre o sistema de construção de gerar.cjs, mais alternativas.
 *
 * Uso: NODE_PATH=<pasta com node_modules/paper> node gerar-rodada-3.cjs
 */
const fs = require('fs');
const path = require('path');
const base = require('./gerar.cjs');

const { L, GUIA, construcaoLogo, grade, linha, circ, texto, elipse, U, COR, FONTE, n, px, P, disco, retangulo, unir, dados, caminho, grupo, documento, celula, emPx } = base;
const SAIDA = path.join(__dirname, 'rodada-3');

const N = {
  corte: 9, // graus: ponta dos tentáculos laterais em corte radial (metade do passo de 18° do leque)
  traco: { w: 2.5, h: 0.75 },
  sorriso: { y: 9.25, r: 1.25 },
  redondo: { armacao: 4.5, lente: 3.5, miolo: 2.25 },
  reduzido: { traco: { w: 3, h: 1 } },
};

function silhueta() {
  const laterais = [-1, 1].map((s) => {
    const meioPlano = retangulo(s * L.lente.x - 40, L.lente.y, 80, 40);
    meioPlano.rotate(s * N.corte, P(s * L.lente.x, L.lente.y));
    return disco(s * L.lente.x, L.lente.y, L.gola.r).intersect(meioPlano);
  });
  const limite = disco(0, L.leque.cy, L.leque.r);
  const barras = [];
  for (const ang of L.leque.angulos) {
    for (const s of [-1, 1]) {
      const barra = retangulo(-L.leque.largura / 2, L.leque.cy, L.leque.largura, L.leque.r + 2);
      barra.rotate(-s * ang, P(0, L.leque.cy));
      barras.push(barra.intersect(limite));
    }
  }
  return unir(disco(0, 0, L.cabeca.r), ...laterais, ...barras);
}

/** As três formas concêntricas de um olho: armação, lente e miolo. */
function camadasDoOlho(lente, s) {
  const x = s * L.lente.x;
  const y = L.lente.y;
  if (lente === 'circulo') {
    return [N.redondo.armacao, N.redondo.lente, N.redondo.miolo].map((r) => disco(x, y, r));
  }
  const el = L.elipses;
  return [el.armacao, el.lente, el.brilho].map(([rx, ry]) => elipse(x, y, rx, ry, -s * 45));
}

function desenhoDoOlho(tipo, s, traco) {
  const x = s * L.lente.x;
  const y = L.lente.y;
  if (tipo === 'arco') {
    return disco(x, y + 0.5, 1.625).subtract(disco(x, y + 0.5, 0.875)).intersect(retangulo(x - 3, y - 3, 6, 3.5));
  }
  return retangulo(x - traco.w / 2, y - traco.h / 2, traco.w, traco.h);
}

function logoNova({ lente = 'elipse', reduzida = false, olhos = ['traco', 'traco'], sorriso = N.sorriso } = {}) {
  let furos = retangulo(-L.ponte.meiaLargura, L.lente.y - L.ponte.h / 2, 2 * L.ponte.meiaLargura, L.ponte.h);
  let ilhas = null;

  [-1, 1].forEach((s, i) => {
    const [armacao, lenteForma, miolo] = camadasDoOlho(lente, s);
    if (reduzida) {
      // um nível só: lente branca com o traço preto dentro
      furos = furos.unite(lenteForma);
      const desenho = desenhoDoOlho(olhos[i], s, N.reduzido.traco);
      ilhas = ilhas ? ilhas.unite(desenho) : desenho;
      return;
    }
    furos = furos.subtract(lenteForma).unite(armacao.subtract(lenteForma)).unite(miolo);
    const desenho = desenhoDoOlho(olhos[i], s, N.traco);
    ilhas = ilhas ? ilhas.unite(desenho) : desenho;
  });

  if (sorriso) {
    furos = furos.unite(disco(0, sorriso.y, sorriso.r).intersect(retangulo(-5, sorriso.y, 10, 5)));
  }
  return dados(silhueta().subtract(furos).unite(ilhas));
}

const CAIXA = { x0: -L.lente.x - L.gola.r, y0: -10, x1: L.lente.x + L.gola.r, y1: 20 };

const PRINCIPAL = { arquivo: 'logo-nova-construida', titulo: 'Reconstruída', sub: 'sua versão nova sobre o sistema de medidas', d: logoNova() };
const ALTERNATIVAS = [
  { arquivo: 'alt-1-reduzida', titulo: 'Alt. 1 · Reduzida', sub: 'um nível por olho, para 16–32 px', d: logoNova({ reduzida: true }) },
  { arquivo: 'alt-2-oculos-redondos', titulo: 'Alt. 2 · Óculos redondos', sub: 'lentes em círculo, como as do mascote', d: logoNova({ lente: 'circulo' }) },
  { arquivo: 'alt-3-feliz', titulo: 'Alt. 3 · Feliz', sub: 'olhos em arco e sorriso um pouco maior', d: logoNova({ olhos: ['arco', 'arco'], sorriso: { y: 9, r: 1.5 } }) },
  { arquivo: 'alt-4-piscadela', titulo: 'Alt. 4 · Piscadela', sub: 'um olho em traço, o outro em arco', d: logoNova({ olhos: ['traco', 'arco'] }) },
  { arquivo: 'alt-5-redonda-reduzida', titulo: 'Alt. 5 · Redonda reduzida', sub: 'a alt. 2 com um nível por olho', d: logoNova({ lente: 'circulo', reduzida: true }) },
];
const TODAS = [PRINCIPAL, ...ALTERNATIVAS];

const arte = (d, cor, id) => grupo(id, caminho(d, `fill="${cor}" fill-rule="evenodd"`));

function construcaoNova() {
  const c = `fill="none" stroke="${GUIA.circulo}" stroke-width="0.9"`;
  const raio = `stroke="${GUIA.eixo}" stroke-width="0.9"`;
  const rot = `font-size="10" fill="${GUIA.circulo}"`;
  const itens = [];
  const rad = (N.corte * Math.PI) / 180;
  for (const s of [-1, 1]) {
    itens.push(linha(s * L.lente.x, L.lente.y, s * (L.lente.x + 10 * Math.cos(rad)), L.lente.y + 10 * Math.sin(rad), raio));
  }
  itens.push(circ(0, N.sorriso.y, N.sorriso.r, c));
  itens.push(linha(-3, N.sorriso.y, 3, N.sorriso.y, `stroke="${GUIA.eixo}" stroke-width="0.6" stroke-dasharray="2 3"`));
  itens.push(texto(15.2, 7.6, 'corte radial a 9°', rot));
  itens.push(texto(15.2, 8.8, '(meio passo do leque)', rot));
  itens.push(texto(-10.6, 17, 'sorriso r1,25', `${rot} text-anchor="end"`));
  itens.push(texto(-10.6, 18.2, 'topo a 9,25u do centro', `${rot} text-anchor="end"`));
  itens.push(texto(-12.6, 2, 'traço 2,5 × 0,75u', `${rot} text-anchor="end"`));
  itens.push(texto(-12.6, 3.2, 'na horizontal', `${rot} text-anchor="end"`));
  return grupo('construcao-da-versao-nova', itens.join('\n'));
}

const camadasDaConstrucao = (prefixo = '') =>
  [
    grupo(`${prefixo}arte`, caminho(PRINCIPAL.d, `fill="${COR.preto}" fill-rule="evenodd"`), 'opacity="0.22"'),
    construcaoLogo().replace('id="construcao"', `id="${prefixo}construcao"`),
    construcaoNova().replace('id="construcao-da-versao-nova"', `id="${prefixo}construcao-da-versao-nova"`),
  ].join('\n');

function icone(d, id) {
  const lado = 40;
  return grupo(
    id,
    [
      `<rect x="${px(-lado / 2)}" y="${px(-lado / 2)}" width="${px(lado)}" height="${px(lado)}" rx="${px(lado * 0.225)}" fill="${COR.roxo}"/>`,
      `<g transform="translate(0 ${px(-5)})">${caminho(d, `fill="${COR.branco}" fill-rule="evenodd"`)}</g>`,
    ].join('\n')
  );
}

for (const v of TODAS) {
  const m = 2;
  fs.writeFileSync(
    path.join(SAIDA, `${v.arquivo}.svg`),
    documento({
      caixa: [CAIXA.x0 - m, CAIXA.y0 - m, CAIXA.x1 - CAIXA.x0 + 2 * m, CAIXA.y1 - CAIXA.y0 + 2 * m],
      conteudo: arte(v.d, COR.preto, 'logo'),
      titulo: `Rodada 3 — ${v.titulo}`,
    }),
    'utf8'
  );
}

fs.writeFileSync(
  path.join(SAIDA, 'logo-nova-construcao.svg'),
  documento({
    caixa: [-25, -14, 54, 38],
    titulo: 'Logo nova — construção',
    fundo: COR.branco,
    conteudo: [grade(-25, -14, 29, 24), camadasDaConstrucao()].join('\n'),
  }),
  'utf8'
);

function prancha() {
  const col = 300;
  const vao = 20;
  const alt = 340;
  const esq = 40;
  const X = (i) => esq + i * (col + vao);
  const partes = [];
  const titulo = (y, s) => `<text x="${esq}" y="${y}" font-family="${FONTE}" font-size="20" font-weight="bold" fill="${COR.preto}">${s}</text>`;
  const REF = { w: 760, h: 900 };

  let y = 80;
  partes.push(titulo(y - 20, 'Sua versão nova, reconstruída'));
  partes.push(
    celula({
      x: X(0), y, w: col, h: alt,
      conteudo: `<image href="../../fontes/logo-bruno-v2.png" width="${REF.w}" height="${REF.h}"/>`,
      caixaPx: { x0: 60, y0: 90, x1: 700, y1: 880 },
      legenda: 'Sua versão (imagem enviada)',
      sub: 'traços na horizontal e sorriso',
    })
  );
  partes.push(celula({ x: X(1), y, w: col, h: alt, conteudo: arte(PRINCIPAL.d, COR.preto, 'pr-principal'), caixaPx: emPx(CAIXA), legenda: PRINCIPAL.titulo, sub: PRINCIPAL.sub }));
  partes.push(
    celula({
      x: X(2), y, w: 2 * col + vao, h: alt,
      conteudo: camadasDaConstrucao('pr-'),
      caixaPx: { x0: -250, y0: -140, x1: 290, y1: 240 },
      legenda: 'Construção',
      sub: 'três círculos R10 e 5√2, diagonais de 45°, leque de 18° e corte a 9°',
    })
  );
  partes.push(celula({ x: X(4), y, w: col, h: alt, conteudo: icone(PRINCIPAL.d, 'pr-icone'), caixaPx: { x0: -200, y0: -200, x1: 200, y1: 200 }, legenda: 'Como ícone de app' }));

  y += alt + 70;
  partes.push(titulo(y - 20, 'Alternativas a partir dela'));
  ALTERNATIVAS.forEach((v, i) => {
    partes.push(celula({ x: X(i), y, w: col, h: alt, conteudo: arte(v.d, COR.preto, `alt${i + 1}`), caixaPx: emPx(CAIXA), legenda: v.titulo, sub: v.sub }));
  });

  y += alt + 60;
  partes.push(titulo(y - 20, 'Tamanho pequeno (64 · 32 · 24 · 16 px de altura)'));
  const c = emPx(CAIXA);
  TODAS.forEach((v, i) => {
    const x0 = esq + i * 260;
    let cx = x0;
    for (const tam of [64, 32, 24, 16]) {
      const k = tam / (c.y1 - c.y0);
      partes.push(`<g transform="translate(${n(cx - k * c.x0)} ${n(y + 64 - tam - k * c.y0)}) scale(${n(k * 10000) / 10000})">${caminho(v.d, `fill="${COR.preto}" fill-rule="evenodd"`)}</g>`);
      cx += k * (c.x1 - c.x0) + 16;
    }
    partes.push(`<text x="${n(x0)}" y="${n(y + 86)}" font-family="${FONTE}" font-size="12" fill="${COR.preto}">${v.titulo}</text>`);
  });

  const largura = esq * 2 + 5 * col + 4 * vao;
  const altura = y + 120;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}">`,
    '<title>Rodada 3 — logo nova reconstruída</title>',
    `<rect id="fundo" width="${largura}" height="${altura}" fill="${COR.branco}"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

fs.writeFileSync(path.join(SAIDA, 'prancha-rodada-3.svg'), prancha(), 'utf8');
console.log('ok');
