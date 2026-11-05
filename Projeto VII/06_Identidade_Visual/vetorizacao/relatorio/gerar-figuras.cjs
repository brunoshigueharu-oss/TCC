/**
 * Monta as figuras do capítulo 8 do relatório do TCC a partir dos SVGs das rodadas.
 * Cada figura é um SVG que referencia as peças por <image>; depois é convertida em PNG.
 *
 * Uso: node gerar-figuras.cjs
 */
const fs = require('fs');
const path = require('path');

const L = 1600; // largura da figura (corresponde aos 16 cm da mancha de texto)
const VAO = 24;
const FUNDO = '#f6f4f8';
const FONTE = 'Helvetica, Arial, sans-serif';

function figura(nome, linhas) {
  const partes = [];
  let y = 0;
  for (const linha of linhas) {
    const pesos = linha.celulas.map((c) => c.peso || 1);
    const util = L - VAO * (linha.celulas.length - 1);
    const total = pesos.reduce((a, b) => a + b, 0);
    let x = 0;
    if (linha.titulo) {
      partes.push(`<text x="0" y="${y + 34}" font-family="${FONTE}" font-size="34" font-weight="bold" fill="#211915">${linha.titulo}</text>`);
      y += 56;
    }
    linha.celulas.forEach((c, i) => {
      const w = (util * pesos[i]) / total;
      const m = c.margem === undefined ? 24 : c.margem;
      partes.push(`<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${linha.altura}" fill="${c.fundo || FUNDO}"/>`);
      partes.push(
        `<image href="${c.src}" x="${(x + m).toFixed(1)}" y="${y + m}" width="${(w - 2 * m).toFixed(1)}" height="${linha.altura - 2 * m}" preserveAspectRatio="xMidYMid meet"/>`
      );
      if (c.rotulo) {
        partes.push(`<text x="${x.toFixed(1)}" y="${y + linha.altura + 38}" font-family="${FONTE}" font-size="30" fill="#211915">${c.rotulo}</text>`);
      }
      x += w + VAO;
    });
    y += linha.altura + (linha.celulas.some((c) => c.rotulo) ? 70 : 24);
  }
  const altura = y;
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${altura}">`,
    `<rect width="${L}" height="${altura}" fill="#ffffff"/>`,
    partes.join('\n'),
    '</svg>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(__dirname, `${nome}.svg`), svg, 'utf8');
  return { nome, largura: L, altura };
}

const C = '../claude';
const X = '../codex';
const F = '../fontes';

const figuras = [
  figura('fig-01-ponto-de-partida', [
    { altura: 430, celulas: [
      { src: `${F}/logo-original.svg`, rotulo: 'Logo' },
      { src: `${F}/mascote-original.svg`, rotulo: 'Mascote' },
      { src: `${F}/rascunhos-polvo.jpg`, rotulo: 'Rascunhos a lápis', peso: 2.4, fundo: '#ffffff', margem: 0 },
    ] },
  ]),
  figura('fig-02-logo-rodada-1', [
    { altura: 520, celulas: [
      { src: `${F}/logo-original.svg`, rotulo: 'Original' },
      { src: `${C}/logo-construida.svg`, rotulo: 'Claude' },
      { src: `${X}/logo-final.svg`, rotulo: 'Codex' },
    ] },
  ]),
  figura('fig-03-logo-construcao-rodada-1', [
    { altura: 700, celulas: [
      { src: `${C}/logo-construcao.svg`, rotulo: 'Claude', fundo: '#ffffff', margem: 0 },
      { src: `${X}/logo-construcao.svg`, rotulo: 'Codex', fundo: '#ffffff', margem: 0 },
    ] },
  ]),
  figura('fig-04-mascote-rodada-1', [
    { altura: 520, celulas: [
      { src: `${F}/mascote-original.svg`, rotulo: 'Original' },
      { src: `${C}/mascote-construido.svg`, rotulo: 'Claude' },
      { src: `${X}/mascote-final.svg`, rotulo: 'Codex' },
    ] },
  ]),
  figura('fig-05-mascote-construcao-rodada-1', [
    { altura: 640, celulas: [
      { src: `${C}/mascote-construcao.svg`, rotulo: 'Claude', fundo: '#ffffff', margem: 0 },
      { src: `${X}/mascote-construcao.svg`, rotulo: 'Codex', fundo: '#ffffff', margem: 0 },
    ] },
  ]),
  figura('fig-06-alternativas-rodada-1', [
    { titulo: 'Claude', altura: 300, celulas: [
      { src: `${C}/alt-logo-1-lente-simples.svg`, rotulo: 'Lente simples' },
      { src: `${C}/alt-logo-2-rosto-do-mascote.svg`, rotulo: 'Rosto do mascote' },
      { src: `${C}/alt-logo-3-icone-de-app.svg`, rotulo: 'Ícone de app' },
      { src: `${C}/alt-mascote-1-dois-bracos.svg`, rotulo: 'Dois braços' },
    ] },
    { altura: 250, celulas: [{ src: `${C}/alt-mascote-2-expressoes.svg`, rotulo: 'Expressões do mascote' }] },
    { titulo: 'Codex', altura: 300, celulas: [
      { src: `${X}/logo-alternativa-01-micro.svg`, rotulo: 'Logo óptica' },
      { src: `${X}/logo-alternativa-02-familia.svg`, rotulo: 'Logo circular' },
      { src: `${X}/mascote-alternativa-01-acolhimento.svg`, rotulo: 'Acolhimento' },
      { src: `${X}/mascote-alternativa-02-atencao.svg`, rotulo: 'Atenção' },
    ] },
  ]),
  figura('fig-07-variacoes-rodada-2', [
    { altura: 330, celulas: [
      { src: `${C}/rodada-2/1-manto-alto.svg`, rotulo: '1 · Manto alto' },
      { src: `${C}/rodada-2/2-seis-bracos.svg`, rotulo: '2 · Seis braços' },
      { src: `${C}/rodada-2/3-tentaculos-laterais-colados.svg`, rotulo: '3 · Laterais colados' },
      { src: `${C}/rodada-2/4-olhar-focado.svg`, rotulo: '4 · Olhar focado' },
    ] },
    { altura: 330, celulas: [
      { src: `${C}/rodada-2/5-bracos-enrolados.svg`, rotulo: '5 · Braços enrolados' },
      { src: `${C}/rodada-2/6-piscadela.svg`, rotulo: '6 · Piscadela' },
      { src: `${C}/rodada-2/7-tentaculos-laterais-soltos.svg`, rotulo: '7 · Laterais soltos' },
      { src: `${C}/alt-logo-2-rosto-do-mascote.svg`, rotulo: 'Referência: rodada 1', fundo: '#ffffff' },
    ] },
  ]),
  figura('fig-08-rodada-3', [
    { altura: 360, celulas: [
      { src: `${C}/rodada-3/logo-nova-construida.svg`, rotulo: 'Reconstruída' },
      { src: `${C}/rodada-3/alt-1-reduzida.svg`, rotulo: 'Reduzida' },
      { src: `${C}/rodada-3/alt-2-oculos-redondos.svg`, rotulo: 'Óculos redondos' },
      { src: `${C}/rodada-3/alt-3-feliz.svg`, rotulo: 'Feliz' },
      { src: `${C}/rodada-3/alt-4-piscadela.svg`, rotulo: 'Piscadela' },
    ] },
  ]),
  figura('fig-09-tres-versoes', [
    { altura: 620, celulas: [
      { src: `${F}/logo-bruno-v3.svg`, rotulo: 'Versão do autor' },
      { src: `${C}/rodada-4/a-logo.svg`, rotulo: 'A · Fiel corrigida' },
      { src: `${C}/rodada-4/b-logo.svg`, rotulo: 'B · Proposta' },
    ] },
  ]),
  figura('fig-10-sobreposicao', [
    { altura: 760, celulas: [
      { src: `${C}/rodada-4/a-sobreposicao.svg`, rotulo: 'Contorno da versão A sobre o vetor do autor' },
      { src: `${C}/rodada-4/b-sobreposicao.svg`, rotulo: 'Contorno da versão B sobre o vetor do autor' },
    ] },
  ]),
  figura('fig-11-construcao-a', [{ altura: 1008, celulas: [{ src: `${C}/rodada-4/a-construcao.svg`, fundo: '#ffffff', margem: 0 }] }]),
  figura('fig-12-construcao-b', [{ altura: 1008, celulas: [{ src: `${C}/rodada-4/b-construcao.svg`, fundo: '#ffffff', margem: 0 }] }]),
];

fs.writeFileSync(path.join(__dirname, 'figuras.json'), JSON.stringify(figuras, null, 2), 'utf8');
console.log(figuras.map((f) => `${f.nome} ${f.largura}x${f.altura}`).join('\n'));
