// Filme-modelo do BASE8 (8 s, 60 qps): uma vinheta curta que já usa a linguagem da casa. Troque as cenas pelas do
// seu roteiro; o motor (motor.js) cuida de fontes, borrão de movimento, legendas de canto e do contrato do VideoHub.
//
// Grade de tempo: 120 BPM → 1 batida = 0,5 s = 30 quadros. Entradas, cliques e cortes caem na batida (ou na metade dela).
(function () {
  'use strict';
  const { W, H, C, PI, E, seg, spring, kf, pressAt, mrect, box, rbox, at, shadow, noShadow, circ, poly, studio, text, lay, reveal, cursor, ring, flower, logo } = B8;

  // layout que mais de uma cena usa fica aqui em cima, para as formas casarem na passagem
  const BTN = { x: W / 2 - 130, y: 640, w: 260, h: 84, r: 42 }, SYM = { x: W / 2, y: 500, R: 150 };
  const CUR = [[1.6, 1500, 1180], [2.2, W / 2 + 46, 690, E.oExpo], [2.5, W / 2 + 46, 690], [3.2, W / 2 + 330, 760, E.io], [4.0, W / 2 + 330, 760]];

  // --- cena 1 (0–4 s): o ponto, a frase, o clique que transforma o botão no símbolo
  function abertura(t, g) {
    studio();
    // 0,5 s: o ponto azul estala no centro (clique seco)
    if (t >= 0.5 && t < 1.0) { ring(t, 0.5, W / 2, 440, C.blue, 90, 0.6); const r = 18 * spring(t - 0.5, 4, 0.42) * (1 - E.iCubic(seg(t, 0.86, 1.0))); circ(W / 2, 440, r, C.blue); }
    // 1,0 s: a frase sobe palavra por palavra; uma palavra em azul
    reveal(lay('f1', [{ s: 'tudo' }, { s: 'isso' }, { s: 'é' }, { s: 'código.', c: C.blue }], 120), W / 2, 480, t - 1.0, { align: 'center', stag: 0.08, out: 1.35 });   // sai antes do clique, para nada passar por cima do texto
    // 1,5 s: o botão entra com mola; 2,5 s: clique; depois ele incha e vira a flor de 8 pétalas
    if (t >= 1.5) {
      const p = spring(t - 2.5, 3.0, 0.52), R = t < 2.5 ? BTN : mrect(BTN, { x: SYM.x - SYM.R, y: SYM.y - SYM.R, w: SYM.R * 2, h: SYM.R * 2, r: SYM.R }, p);
      const s = spring(t - 1.5, 3.6, 0.5) * (1 + 0.05 * spring(t - 2.25, 5, 0.5) - 0.09 * pressAt(t, [2.5]));
      const k = spring(t - 2.75, 3.2, 0.5), cx = R.x + R.w / 2, cy = R.y + R.h / 2;
      if (t < 2.75) at(cx, cy, s, s, 0, () => { shadow(40, 18, 0.24); box(-R.w / 2, -R.h / 2, R.w, R.h, R.r, C.blue); noShadow(); if (t < 2.6) { g.globalAlpha = 1 - seg(t, 2.5, 2.6); text('criar', 0, 13, 36, { w: 700, c: C.white, align: 'center' }); g.globalAlpha = 1; } });
      else flower(cx, cy, R.w / 2, k, -PI / 8 + (t - 2.75) * 0.9, C.blue, 0.27 * E.oBack(seg(t, 2.85, 3.1)));
      ring(t, 2.5, W / 2 + 46, 690, C.white, 60);
    }
    if (t > 1.6) { const c = kf(t, CUR); cursor(c[0], c[1], 'você', C.ink, { press: pressAt(t, [2.5]) }); }
  }

  // --- cena 2 (4–8 s): a logo monta objeto por objeto, a linha de apoio e o endereço
  function assinatura(t, g) {
    studio();
    logo.draw(t, 4.1, 'leitura');
    reveal(lay('f2', [{ s: 'aprenda' }, { s: 'a' }, { s: 'criar' }, { s: 'com' }, { s: 'IA', w: 700 }, { s: 'de', w: 700 }, { s: 'código.', w: 700 }], 56, 500), W / 2, 664, t - 5.0, { align: 'center', stag: 0.055 });
    if (t >= 5.5) { const s = spring(t - 5.5, 3.6, 0.5); at(W / 2, 790, s, s, 0, () => { shadow(50, 22, 0.28); box(-190, -46, 380, 92, 46, C.ink); noShadow(); text('base8.com', -16, 14, 40, { w: 600, c: C.white, align: 'center' }); g.strokeStyle = C.lime; g.lineWidth = 5; g.lineCap = g.lineJoin = 'round'; poly([[104, 0], [134, 0]]); g.stroke(); poly([[124, -10], [134, 0], [124, 10]]); g.stroke(); }); }
  }

  // g = contexto do quadro atual, entregue a cada cena (muda durante o borrão de movimento: nunca guarde numa variável fixa)
  B8.start({
    dur: 8, fps: 60, title: 'BASE8 — VINHETA',
    scenes: [{ name: 'Abertura', t0: 0, t1: 4, draw: abertura }, { name: 'Assinatura', t0: 4, t1: 8, draw: assinatura }],
    fast: [[2.5, 2.9, 4]],   // trechos rápidos com borrão: [início, fim, amostras]
    init: async () => { await logo.load('assets/logo-base8.png', { w: 1000, cx: W / 2, cy: 392 }); },
  });
})();
