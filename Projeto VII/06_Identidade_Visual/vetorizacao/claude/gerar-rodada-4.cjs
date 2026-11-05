/**
 * Rodada 4: construção da logo a partir do vetor do Bruno (fontes/logo-bruno-v3.svg).
 *   A — fiel: as medidas dele, com os desvios corrigidos.
 *   B — proposta: as mesmas proporções, com cada medida amarrada a uma regra.
 * Unidades: u = 10 px do arquivo dele; origem no centro da cabeça.
 *
 * Uso: NODE_PATH=<pasta com node_modules/paper> node gerar-rodada-4.cjs
 */
const fs = require('fs');
const path = require('path');
const base = require('./gerar.cjs');

const { GUIA, grade, linha, circ, texto, elipse, paper, U, COR, FONTE, n, px, P, disco, retangulo, unir, dados, caminho, grupo, documento, original, celula } = base;
const SAIDA = path.join(__dirname, 'rodada-4');
const CENTRO_DELE = { x: 216, y: 180 }; // centro da cabeça no arquivo do Bruno

const EIXO_OLHO = Math.hypot(10, 8); // distância do centro da cabeça ao centro do olho

const A = {
  nome: 'A · Fiel corrigida',
  cabeca: 18,
  olho: { x: 10, y: 8 },
  armacao: [9, 7],
  aro: [7.75, 5.5],
  miolo: [4.5, 3.25],
  pupila: { w: 4.5, h: 1.25 },
  ponte: { y: 10, h: 2, meia: 2.5 },
  boca: { y: 15, r: 2.5 },
  lateral: { x: 6.25, y: 5.25, r: 16, corte: 10 },
  leque: { y: 18.5, r: 17, centros: [16.5, 55.5], meio: 9.5 },
};

const B = {
  nome: 'B · Proposta',
  cabeca: 18,
  olho: { x: 10, y: 8 },
  armacao: [9, 7],
  aro: [7.5, 5.5], // armação branca de 1,5u em toda a volta
  miolo: [5, 3], // aro preto de 2,5u em toda a volta
  pupila: { w: 4.5, h: 1.25 },
  ponte: { y: 10, h: 2, meia: 2.5 },
  boca: { y: 15, r: 2.5 },
  // centro do arco sobre o eixo cabeça–olho, a 8u do centro da cabeça
  lateral: { x: (8 * 10) / EIXO_OLHO, y: (8 * 8) / EIXO_OLHO, r: 16, corte: 9 },
  // leque com centro na base da cabeça e o mesmo raio dela; barras e vãos de 18°
  leque: { y: 18, r: 18, centros: [18, 54], meio: 9 },
};

const larguraDaBarra = (p) => 2 * p.leque.r * Math.sin((p.leque.meio * Math.PI) / 180);

function logo(p) {
  const massas = [disco(0, 0, p.cabeca)];
  for (const s of [-1, 1]) {
    const meioPlano = retangulo(s * p.olho.x - 60, p.olho.y, 120, 60);
    meioPlano.rotate(s * p.lateral.corte, P(s * p.olho.x, p.olho.y));
    massas.push(disco(s * p.lateral.x, p.lateral.y, p.lateral.r).intersect(meioPlano));
  }
  const limite = disco(0, p.leque.y, p.leque.r);
  const w = larguraDaBarra(p);
  for (const ang of p.leque.centros) {
    for (const s of [-1, 1]) {
      const barra = retangulo(-w / 2, p.leque.y, w, p.leque.r + 2);
      barra.rotate(-s * ang, P(0, p.leque.y));
      massas.push(barra.intersect(limite));
    }
  }

  let furos = retangulo(-p.ponte.meia, p.ponte.y - p.ponte.h / 2, 2 * p.ponte.meia, p.ponte.h);
  let ilhas = null;
  for (const s of [-1, 1]) {
    const x = s * p.olho.x;
    const [armacao, aro, miolo] = [p.armacao, p.aro, p.miolo].map(([a, b]) => elipse(x, p.olho.y, a, b, -s * 45));
    furos = furos.subtract(aro).unite(armacao.subtract(aro)).unite(miolo);
    const pupila = retangulo(x - p.pupila.w / 2, p.olho.y - p.pupila.h / 2, p.pupila.w, p.pupila.h);
    // o aro sai da cabeça pelo lado de fora, então entra como forma própria, não como sobra da silhueta
    const olho = aro.subtract(miolo).unite(pupila);
    ilhas = ilhas ? ilhas.unite(olho) : olho;
  }
  furos = furos.unite(disco(0, p.boca.y, p.boca.r).intersect(retangulo(-6, p.boca.y, 12, 6)));
  return unir(...massas).subtract(furos).unite(ilhas);
}

function construcao(p, id) {
  const c = `fill="none" stroke="${GUIA.circulo}" stroke-width="0.9"`;
  const eixo = `stroke="${GUIA.eixo}" stroke-width="0.9" stroke-dasharray="8 3 1.5 3"`;
  const cheio = `stroke="${GUIA.eixo}" stroke-width="0.9"`;
  const fino = `stroke="${GUIA.eixo}" stroke-width="0.6" stroke-dasharray="2 3"`;
  const rot = `font-size="11" fill="${GUIA.circulo}"`;
  const rotEixo = `font-size="10" fill="${GUIA.eixo}"`;
  const cruz = (x, y) => [linha(x - 0.6, y, x + 0.6, y, `stroke="${GUIA.circulo}" stroke-width="0.9"`), linha(x, y - 0.6, x, y + 0.6, `stroke="${GUIA.circulo}" stroke-width="0.9"`)];
  const itens = [];

  itens.push(linha(0, -21, 0, p.leque.y + p.leque.r + 3, eixo));
  itens.push(linha(-27, p.olho.y, 27, p.olho.y, eixo));
  itens.push(linha(-9, p.ponte.y, 9, p.ponte.y, fino));

  itens.push(circ(0, 0, p.cabeca, c), ...cruz(0, 0));
  itens.push(circ(0, p.leque.y, p.leque.r, c), ...cruz(0, p.leque.y));
  itens.push(circ(0, p.boca.y, p.boca.r, c));

  for (const s of [-1, 1]) {
    const x = s * p.olho.x;
    // eixo cabeça–olho e eixos da elipse
    itens.push(linha(0, 0, s * 1.55 * p.olho.x, 1.55 * p.olho.y, fino));
    itens.push(linha(x - 8, p.olho.y + s * 8, x + 8, p.olho.y - s * 8, fino));
    itens.push(...cruz(x, p.olho.y));
    for (const [a, b] of [p.armacao, p.aro, p.miolo]) {
      itens.push(`<ellipse cx="${px(x)}" cy="${px(p.olho.y)}" rx="${px(a)}" ry="${px(b)}" transform="rotate(${-s * 45} ${px(x)} ${px(p.olho.y)})" ${c}/>`);
    }
    itens.push(circ(s * p.lateral.x, p.lateral.y, p.lateral.r, c), ...cruz(s * p.lateral.x, p.lateral.y));
    const rad = (p.lateral.corte * Math.PI) / 180;
    itens.push(linha(x, p.olho.y, s * (p.olho.x + 15 * Math.cos(rad)), p.olho.y + 15 * Math.sin(rad), cheio));
  }

  const alcance = p.leque.r + 2;
  const raioDoLeque = (ang, s, estilo) => {
    const rad = (ang * Math.PI) / 180;
    return linha(0, p.leque.y, s * alcance * Math.sin(rad), p.leque.y + alcance * Math.cos(rad), estilo);
  };
  for (const ang of p.leque.centros) {
    for (const s of [-1, 1]) {
      itens.push(raioDoLeque(ang, s, cheio), raioDoLeque(ang - p.leque.meio, s, fino), raioDoLeque(ang + p.leque.meio, s, fino));
    }
  }

  const f = (v) => String(Math.round(v * 100) / 100).replace('.', ',');
  const esq = (y, s) => itens.push(texto(-28, y, s, `${rot} text-anchor="end"`));
  const dir = (y, s) => itens.push(texto(28, y, s, rot));
  esq(-14, `cabeça R${f(p.cabeca)}`);
  esq(-2, `olhos em (±${f(p.olho.x)}; ${f(p.olho.y)})`);
  esq(-0.4, 'elipses a 45°:');
  esq(1.2, `armação ${f(p.armacao[0])} × ${f(p.armacao[1])}`);
  esq(2.8, `aro ${f(p.aro[0])} × ${f(p.aro[1])}`);
  esq(4.4, `miolo ${f(p.miolo[0])} × ${f(p.miolo[1])}`);
  esq(6, `pupila ${f(p.pupila.w)} × ${f(p.pupila.h)}`);
  esq(16, `sorriso r${f(p.boca.r)}, a ${f(p.boca.y)} do centro`);
  esq(17.6, `ponte ${f(p.ponte.h)} de altura, a ${f(p.ponte.y)}`);
  dir(-2, `tentáculo lateral: arco R${f(p.lateral.r)}`);
  dir(-0.4, `centro em (±${f(p.lateral.x)}; ${f(p.lateral.y)})`);
  dir(13.5, `ponta: corte radial a ${f(p.lateral.corte)}°`);
  dir(26, `leque R${f(p.leque.r)}, centro a ${f(p.leque.y)}`);
  dir(27.6, `barras a ${f(p.leque.centros[0])}° e ${f(p.leque.centros[1])}°`);
  dir(29.2, `largura ${f(larguraDaBarra(p))} (±${f(p.leque.meio)}°)`);
  itens.push(texto(27, p.olho.y - 0.5, 'linha dos olhos', `${rotEixo} text-anchor="end"`));

  return grupo(id, itens.join('\n'));
}

// ---------- comparação com o vetor do Bruno ----------

const dele = original('logo-bruno-v3.svg');
const formasDele = [
  ...[...dele.miolo.matchAll(/<path[^>]* d="([^"]+)"/g)].map((m) => new paper.CompoundPath({ pathData: m[1] })),
  ...[...dele.miolo.matchAll(/<rect[^>]* x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map(
    (m) => new paper.Path.Rectangle(new paper.Rectangle(+m[1], +m[2], +m[3], +m[4]))
  ),
];

function desvio(forma) {
  const alvo = forma.clone();
  alvo.translate(new paper.Point(CENTRO_DELE.x, CENTRO_DELE.y));
  let max = 0;
  let soma = 0;
  let total = 0;
  for (const item of formasDele) {
    for (const sub of item.children || [item]) {
      for (const curva of sub.curves) {
        for (let t = 0; t < 1; t += 0.05) {
          const ponto = curva.getPointAtTime(t);
          const d = alvo.getNearestPoint(ponto).getDistance(ponto);
          max = Math.max(max, d);
          soma += d;
          total += 1;
        }
      }
    }
  }
  return { max, media: soma / total };
}

const VERSOES = [A, B].map((p, i) => {
  const forma = logo(p);
  return { p, letra: 'ab'[i], d: dados(forma), desvio: desvio(forma) };
});

// ---------- saída ----------

const CAIXA = { x0: -22, y0: -18, x1: 22, y1: 36 };
const preto = (d, id) => grupo(id, caminho(d, `fill="${COR.preto}" fill-rule="evenodd"`));
const camadasDeConstrucao = (v, prefixo) =>
  [grupo(`${prefixo}arte`, caminho(v.d, `fill="${COR.preto}" fill-rule="evenodd"`), 'opacity="0.2"'), construcao(v.p, `${prefixo}construcao`)].join('\n');

for (const v of VERSOES) {
  const m = 2;
  fs.writeFileSync(
    path.join(SAIDA, `${v.letra}-logo.svg`),
    documento({ caixa: [CAIXA.x0 - m, CAIXA.y0 - m, CAIXA.x1 - CAIXA.x0 + 2 * m, CAIXA.y1 - CAIXA.y0 + 2 * m], conteudo: preto(v.d, 'logo'), titulo: v.p.nome }),
    'utf8'
  );
  fs.writeFileSync(
    path.join(SAIDA, `${v.letra}-construcao.svg`),
    documento({ caixa: [-50, -23, 100, 63], titulo: `${v.p.nome} — construção`, fundo: COR.branco, conteudo: [grade(-50, -23, 50, 40), camadasDeConstrucao(v, '')].join('\n') }),
    'utf8'
  );
}

function sobreposicao(v, id) {
  return [
    `<g id="${id}-vetor-do-bruno" opacity="0.28">${dele.miolo}</g>`,
    `<g id="${id}-contorno" transform="translate(${CENTRO_DELE.x} ${CENTRO_DELE.y})">${caminho(v.d, `fill="none" stroke="${GUIA.circulo}" stroke-width="1.2"`)}</g>`,
  ].join('\n');
}

for (const v of VERSOES) {
  fs.writeFileSync(
    path.join(SAIDA, `${v.letra}-sobreposicao.svg`),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 472 573.77">`,
      `<title>${v.p.nome} — contorno sobre o vetor original</title>`,
      sobreposicao(v, v.letra),
      '</svg>',
      '',
    ].join('\n'),
    'utf8'
  );
}

function prancha() {
  const col = 330;
  const vao = 20;
  const alt = 420;
  const esq = 40;
  const X = (i) => esq + i * (col + vao);
  const partes = [];
  const titulo = (y, s) => `<text x="${esq}" y="${y}" font-family="${FONTE}" font-size="20" font-weight="bold" fill="${COR.preto}">${s}</text>`;
  const caixaDele = dele.caixaPx;
  const caixaMinha = { x0: CAIXA.x0 * U, y0: CAIXA.y0 * U, x1: CAIXA.x1 * U, y1: CAIXA.y1 * U };
  const f = (x) => x.toFixed(1).replace('.', ',');

  let y = 80;
  partes.push(titulo(y - 20, 'As três versões'));
  partes.push(celula({ x: X(0), y, w: col, h: alt, conteudo: dele.miolo.replace(/id="[^"]*"/g, ''), caixaPx: caixaDele, legenda: 'Sua versão', sub: 'vetor que você enviou, sem alteração' }));
  partes.push(celula({ x: X(1), y, w: col, h: alt, conteudo: preto(VERSOES[0].d, 'pr-a'), caixaPx: caixaMinha, legenda: A.nome, sub: 'suas medidas, com os desvios corrigidos' }));
  partes.push(celula({ x: X(2), y, w: col, h: alt, conteudo: preto(VERSOES[1].d, 'pr-b'), caixaPx: caixaMinha, legenda: B.nome, sub: 'mesmas proporções, cada medida amarrada a uma regra' }));

  VERSOES.forEach((v) => {
    y += alt + 70;
    partes.push(titulo(y - 20, `${v.p.nome} — construção`));
    partes.push(
      celula({
        x: X(0), y, w: col, h: alt,
        conteudo: sobreposicao(v, `pr-${v.letra}-sobre`).replace(/id="(?!pr-)[^"]*"/g, ''),
        caixaPx: caixaDele,
        legenda: 'Contorno sobre a sua versão',
        sub: `desvio máximo ${f(v.desvio.max)} px, médio ${f(v.desvio.media)} px (em 534 px de altura)`,
      })
    );
    partes.push(
      celula({ x: X(1), y, w: 2 * col + vao, h: alt, conteudo: camadasDeConstrucao(v, `pr-${v.letra}-`), caixaPx: { x0: -500, y0: -230, x1: 500, y1: 400 }, legenda: 'Linhas de construção', sub: 'medidas em módulos (1u = 10 px do seu arquivo)' })
    );
  });

  const largura = esq * 2 + 3 * col + 2 * vao;
  const altura = y + alt + 30;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} ${altura}">`,
    '<title>Rodada 4 — construção da logo</title>',
    `<rect id="fundo" width="${largura}" height="${altura}" fill="${COR.branco}"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
}

fs.writeFileSync(path.join(SAIDA, 'prancha-rodada-4.svg'), prancha(), 'utf8');
for (const v of VERSOES) console.log(v.p.nome, '| desvio max', v.desvio.max.toFixed(2), 'px | medio', v.desvio.media.toFixed(2), 'px');
