// BASE8 · Manifesto, versão 4 (38 s, 1920x1080, 60 qps).
// Roteiro: TCC/Projeto VII/07_Divulgacao/02_Roteiros/manifesto-roteiro.md. Contrato: docs/PROJECT-CONTRACT.md do VideoHub.
//
//   window.renderOut(t)  desenha o segundo t, de forma síncrona, no canvas #c
//   window.READY = true  depois que fontes e imagens carregam
//   window.VH_SCENES     as seis cenas, para a linha do tempo do VideoHub
//
// Direção de arte (notas do Bruno de 24/11/2026 sobre a versão 2, que está em versoes-antigas/):
//   · quem conduz o filme é uma bola azul, que no fim se revela a bola 8 da marca. Ela segue reto e abre caminho
//     (referência: "Believe You Can", de Lucas Mariano);
//   · degradês com um pouco de granulado (GRAIN, logo abaixo, regula a força);
//   · o rabisco é de giz, não uma linha de vetor;
//   · os exemplos são reais: o site do BASE8, a identidade visual, a animação 3D do site, as telas do app;
//   · o texto de cada exemplo fica embaixo, no centro; o resto da tela é do exemplo.
//
// Linha do tempo (120 BPM, 1 batida = 0,5 s; a trilha entra aos 5 s). Versão 4 = notas #18–#28 do VideoHub (24/11/2026):
//    0,0– 5,0  a pergunta    a bola nasce no centro e pinga de palavra em palavra (v5); pousa como o pingo do "?"
//    5,0–10,5  o traço       rabisco de giz → o cursor puxa e vira o prompt → respiro → envio (9,5) → cores e objetos da marca
//   10,5–19,5  as formas     jogo de plataforma da bola (10,5) · site (13) · marca (15) · portfólio, com arraste (16,5) · animação 2D (18)
//   19,5–21,0  rajada        seis cortes de 0,25 s
//   21,0–28,0  o acúmulo     mosaico; pausa aos 24,5 (sem trilha até 28); a IA reescreve a frase: "e a IA cuida dessa parte."
//   28,0–31,0  a resposta    tudo volta para a bola, que mostra o 8 e troca de cor a cada palavra (a cada 0,3 s)
//   31,0–38,0  assinatura    a bola rola, revela BASE; "designer/músico/…, aprenda a criar com IA de código."; o botão
//                            do site ganha a tinta colorida, a pessoa clica, anéis de cor varrem a tela e fica só a logo BASE8 (v5)
//
// Regra de ouro: o quadro é função pura de t. Nada de Date.now(), Math.random() ou estado entre quadros.
(function () {
  'use strict';
  const W = 1920, H = 1080, DUR = 38, FPS = 60;
  const cv = document.getElementById('c'), MAIN = cv.getContext('2d');
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const TMPC = mk(W, H), TMP = TMPC.getContext('2d');
  let g = MAIN;

  // ------------------------------------------------------------------ paleta e tipos (troque aqui para mudar o filme todo)
  const C = {
    white: '#FFFFFF', ink: '#1B1F3B', blue: '#0B8FE0', pink: '#FF48B0', green: '#12A180', lime: '#F5EE4A',
    fog: '#EEF0F5', line: '#D5D9E3', dim: '#B7BCCB', mute: '#8A90A6', floor: '#DFE3EA', key: '#2E3355',
  };
  const SANS = 'Figtree, system-ui, sans-serif', MONO = '"Geist Mono", ui-monospace, monospace', DISPLAY = '"Instrument Sans", Figtree, sans-serif', PIX = '"PixelSerif", monospace';
  const PI = Math.PI, TAU = PI * 2;
  const GRAIN = 0.16;   // força do granulado (0 desliga)

  window.VH_SCENES = [
    { name: 'A pergunta', t0: 0, t1: 5 },
    { name: 'O traço', t0: 5, t1: 10.5 },
    { name: 'As formas', t0: 10.5, t1: 21 },
    { name: 'O acúmulo', t0: 21, t1: 28 },
    { name: 'A resposta', t0: 28, t1: 31 },
    { name: 'Assinatura', t0: 31, t1: DUR },
  ];

  // ------------------------------------------------------------------ matemática
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, f) => a + (b - a) * f;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    lin: x => x,
    oExpo: x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x),
    oCubic: x => 1 - Math.pow(1 - x, 3),
    iCubic: x => x * x * x,
    io: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    oBack: (x, s = 1.70158) => x <= 0 ? 0 : x >= 1 ? 1 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
  };
  // mola amortecida de 0 a 1; x em segundos, f em Hz, z = amortecimento
  const spring = (x, f = 4.5, z = 0.45) => { if (x <= 0) return 0; const w = TAU * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); };
  function hash(n) { n = Math.imul(n ^ 0x9E3779B9, 0x85EBCA6B); n ^= n >>> 13; n = Math.imul(n, 0xC2B2AE35); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
  const rnd = (a, b = 0, c = 0) => hash(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663) ^ Math.imul(c | 0, 83492791));
  function vn(x, s = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + s * 7919), hash(i + 1 + s * 7919), u); }
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, f) => { const A = hex(a), B = hex(b); f = clamp(f); return `rgb(${Math.round(lerp(A[0], B[0], f))},${Math.round(lerp(A[1], B[1], f))},${Math.round(lerp(A[2], B[2], f))})`; };
  const rgba = (h, a) => { const A = hex(h); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; };
  // quadros-chave [t, x, y, curva]: a curva vale para o trecho que termina naquele quadro
  function kf(t, K) {
    if (t <= K[0][0]) return [K[0][1], K[0][2]];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const a = K[i - 1], b = K[i], f = (b[3] || E.io)(seg(t, a[0], b[0])); return [lerp(a[1], b[1], f), lerp(a[2], b[2], f)]; }
    const z = K[K.length - 1]; return [z[1], z[2]];
  }
  const pressAt = (t, list) => { let m = 0; for (const c of list) m = Math.max(m, 1 - Math.abs(t - c) / 0.08); return Math.max(0, m); };
  const mrect = (a, b, p) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p), r: lerp(a.r, b.r, p) });

  // ------------------------------------------------------------------ desenho básico
  function box(x, y, w, h, r, fill, o) {
    if (w <= 0 || h <= 0) return;
    g.beginPath(); g.roundRect(x, y, w, h, Math.max(0, Math.min(r || 0, w / 2, h / 2)));
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (o && o.stroke) { g.lineWidth = o.lw || 2; g.strokeStyle = o.stroke; g.stroke(); }
  }
  const rbox = (R, fill, o) => box(R.x, R.y, R.w, R.h, R.r, fill, o);
  function circ(x, y, r, fill, o) {
    if (r <= 0) return;
    g.beginPath(); g.arc(x, y, r, 0, TAU);
    if (fill) { g.fillStyle = fill; g.fill(); }
    if (o && o.stroke) { g.lineWidth = o.lw || 2; g.strokeStyle = o.stroke; g.stroke(); }
  }
  function at(x, y, sx, sy, rot, fn) { g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(sx, sy == null ? sx : sy); fn(); g.restore(); }
  const shadow = (blur, oy, a) => { g.shadowColor = rgba(C.ink, a); g.shadowBlur = blur; g.shadowOffsetY = oy; };
  const noShadow = () => { g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0; };
  const fill = c => { g.fillStyle = c; g.fillRect(0, 0, W, H); };
  function poly(pts, close) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); if (close) g.closePath(); }
  // fundo de estúdio: branco puro em cima, chão frio embaixo
  let STUDIO = null;
  function studio() {
    if (!STUDIO) { STUDIO = mk(W, H); const x = STUDIO.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, C.white); gr.addColorStop(0.6, C.white); gr.addColorStop(1, C.floor); x.fillStyle = gr; x.fillRect(0, 0, W, H); }
    g.drawImage(STUDIO, 0, 0);
  }

  // ------------------------------------------------------------------ texto
  function font(size, weight = 600, fam = SANS) { g.font = `${weight} ${size}px ${fam}`; g.letterSpacing = (fam === SANS ? -0.022 * size : 0).toFixed(2) + 'px'; }
  function text(str, x, y, size, o = {}) { font(size, o.w, o.fam); if (o.ls != null) g.letterSpacing = o.ls + 'px'; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic'; g.fillStyle = o.c || C.ink; g.fillText(str, x, y); }
  const LAY = new Map();
  // divide a frase em palavras medidas; parts = [{s, c, w}]
  function lay(key, parts, size, weight = 600) {
    if (LAY.has(key)) return LAY.get(key);
    font(size, weight); const sp = g.measureText(' ').width; let x = 0; const items = [];
    for (const p of parts) { font(size, p.w || weight); const w = g.measureText(p.s).width; items.push({ s: p.s, x, w, c: p.c, wt: p.w || weight }); x += w + sp; }
    const L = { items, width: x - sp, size }; LAY.set(key, L); return L;
  }
  // palavras sobem de baixo de uma máscara, uma por vez; o.out = quando saem (para cima)
  function reveal(L, x, y, t, o = {}) {
    const size = L.size, x0 = o.align === 'center' ? x - L.width / 2 : x, stag = o.stag == null ? 0.07 : o.stag;
    g.save(); g.beginPath(); g.rect(x0 - 30, y - size * 1.04, L.width + 60, size * 1.4); g.clip();
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    L.items.forEach((it, i) => {
      const ts = i * stag; if (t < ts) return;
      let dy = (1 - E.oExpo(seg(t, ts, ts + 0.55))) * size * 1.2;
      if (o.out != null) dy -= E.iCubic(seg(t, o.out + i * 0.025, o.out + i * 0.025 + 0.24)) * size * 1.3;
      font(size, it.wt); g.fillStyle = o.c || it.c || o.dc || C.ink; g.fillText(it.s, x0 + it.x, y + dy);
    });
    g.restore();
  }

  // ------------------------------------------------------------------ cursor com nome, clique, alças
  function cursor(x, y, label, color, o = {}) {
    const s = 1.3 * (o.s || 1) * (1 - 0.14 * (o.press || 0));
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.lineTo(8, 23.2); g.lineTo(13.6, 35.6); g.lineTo(19.2, 33); g.lineTo(13.7, 21); g.lineTo(24, 21); g.closePath();
    shadow(14, 5, 0.28); g.fillStyle = color; g.fill(); noShadow(); g.lineWidth = 2.6; g.lineJoin = 'round'; g.strokeStyle = C.white; g.stroke();
    if (label) { font(19, 700); const w = g.measureText(label).width + 24, lx = 20 + (o.lag || 0), ly = 34; shadow(14, 5, 0.2); box(lx, ly, w, 33, 11, color); noShadow(); text(label, lx + 12, ly + 23, 19, { w: 700, c: o.tc || C.white }); }
    g.restore();
  }
  function ring(t, tc, x, y, col, R = 56, dur = 0.45) {
    const e = t - tc; if (e < 0 || e > dur) return; const p = E.oExpo(e / dur);
    g.save(); g.globalAlpha = 1 - p; g.lineWidth = lerp(7, 1, p); g.strokeStyle = col; g.beginPath(); g.arc(x, y, lerp(6, R, p), 0, TAU); g.stroke(); g.restore();
  }
  function anchor(x, y, s, col = C.ink, sz = 13) { if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.white; g.fillRect(-sz / 2, -sz / 2, sz, sz); g.lineWidth = 2.5; g.strokeStyle = col; g.strokeRect(-sz / 2, -sz / 2, sz, sz); g.restore(); }

  function picture(x, y, w, h, r, p) {
    g.save(); g.beginPath(); g.roundRect(x, y, w, h, r); g.clip();
    g.fillStyle = p.sky; g.fillRect(x, y, w, h); circ(x + w * 0.7, y + h * 0.3, Math.min(w, h) * 0.13, p.sun);
    g.fillStyle = p.m1; poly([[x - w * 0.1, y + h], [x + w * 0.3, y + h * 0.45], [x + w * 0.72, y + h]], true); g.fill();
    g.fillStyle = p.m2; poly([[x + w * 0.3, y + h], [x + w * 0.68, y + h * 0.62], [x + w * 1.1, y + h]], true); g.fill();
    g.restore();
  }

  // ------------------------------------------------------------------ medida da frase de abertura (acha o pingo do "?", que é onde a bola pousa)
  function initP1() {
    const parts = [{ s: 'até' }, { s: 'onde' }, { s: 'você' }, { s: 'consegue' }, { s: 'imaginar?', c: C.blue }];
    let size = 104, L = lay('p1', parts, size);
    if (L.width > 1580) { size = Math.floor(size * 1580 / L.width); LAY.delete('p1'); L = lay('p1', parts, size); }
    P1.size = size; P1.L = L; P1.x0 = (W - L.width) / 2; P1.y = 588;
    font(size, 600); P1.qx0 = P1.x0 + L.items[4].x + g.measureText('imaginar').width;
    // acha o pingo do "?" medindo o glifo: o pingo é o ponto azul da cena, o gancho é desenhado por recorte
    const cw = Math.ceil(size), chh = Math.ceil(size * 1.4), base = Math.round(size * 1.1), c = mk(cw, chh), x = c.getContext('2d');
    x.font = `600 ${size}px ${SANS}`; x.textBaseline = 'alphabetic'; x.fillStyle = '#000'; x.fillText('?', 0, base);
    const d = x.getImageData(0, 0, cw, chh).data;
    const row = yy => { let a = -1, b = -1; for (let i = 0; i < cw; i++) if (d[(yy * cw + i) * 4 + 3] > 90) { if (a < 0) a = i; b = i; } return a < 0 ? null : [a, b]; };
    let yy = chh - 1; while (yy > 0 && !row(yy)) yy--; const bot = yy; let mn = 1e9, mx = -1;
    while (yy > 0 && row(yy)) { const r = row(yy); mn = Math.min(mn, r[0]); mx = Math.max(mx, r[1]); yy--; }
    const top = yy + 1; let gy = yy; while (gy > 0 && !row(gy)) gy--;
    const S = rowY => P1.y - (base - rowY);
    P1.q = { x: P1.qx0 + (mn + mx + 1) / 2, y: S((top + bot + 1) / 2), r: Math.max(mx - mn + 1, bot - top + 1) / 2, cut: S((top + gy) / 2 + 0.5) };
  }

  // ------------------------------------------------------------------ os seis cartões da rajada (16,5–18 s)
  const CARDS = [
    { name: 'uma fonte', hud: C.white, fn: e => {
      fill(C.ink); const S = 600, by = 745, p = E.oExpo(clamp(e / 0.2));
      [[by, 0], [by - S * 0.5, 0.02], [by - S * 0.7, 0.04]].forEach(([yy, d]) => { const q = E.oExpo(clamp((e - d) / 0.17)); box(0, yy - 1.5, W * q, 3, 0, C.blue); });
      at(W / 2, by - S * 0.3, lerp(1.3, 1, p), null, 0, () => text('Aa', 0, S * 0.3, S, { w: 800, c: C.white, align: 'center' }));
      [[520, by], [1400, by], [520, by - S * 0.7], [1400, by - S * 0.5]].forEach(([x, y], i) => anchor(x, y, E.oBack(clamp((e - 0.04 - i * 0.02) / 0.12)), C.blue, 18));
      text('Figtree ExtraBold · 600 pt', 96, by + 150, 22, { fam: MONO, w: 500, c: C.mute });
    } },
    { name: 'um pôster', hud: C.ink, fn: e => {
      fill(C.pink); const p = E.oExpo(clamp(e / 0.2));
      at(W / 2, 540 - (1 - p) * 170, lerp(1.16, 1, p), null, lerp(-0.2, -0.07, p), () => {
        shadow(70, 36, 0.3); box(-230, -320, 460, 640, 6, C.white); noShadow();
        circ(-40, -110, 150, C.blue); g.fillStyle = C.ink; g.beginPath(); g.moveTo(230, 40); g.arc(230, 40, 190, PI / 2, PI); g.closePath(); g.fill();
        box(-196, 96, 150, 150, 0, C.lime); box(-196, 264, 260, 22, 0, C.ink); box(-196, -296, 120, 12, 0, C.ink); box(96, -296, 100, 12, 0, C.ink);
      });
    } },
    { name: 'um filtro de foto', hud: C.ink, fn: e => {
      fill(C.fog); const p = E.oExpo(clamp(e / 0.2)), x = 540, y = 270, w = 840, h = 540, sx = x + w * lerp(0.2, 0.62, E.oExpo(clamp(e / 0.23)));
      at(W / 2, 540, lerp(1.1, 1, p), null, 0, () => { g.translate(-W / 2, -540);
        shadow(70, 36, 0.2); box(x, y, w, h, 30, C.white); noShadow();
        picture(x, y, w, h, 30, { sky: mix(C.blue, C.white, 0.74), sun: C.lime, m1: C.green, m2: C.ink });
        g.save(); g.beginPath(); g.rect(sx, y, x + w - sx, h); g.clip(); picture(x, y, w, h, 30, { sky: C.pink, sun: C.white, m1: C.ink, m2: C.blue }); g.restore();
        box(sx - 4, y - 26, 8, h + 52, 4, C.white); shadow(20, 8, 0.3); circ(sx, 540, 34, C.white); noShadow(); circ(sx, 540, 34, null, { stroke: C.blue, lw: 6 });
        g.strokeStyle = C.blue; g.lineWidth = 5; g.lineCap = g.lineJoin = 'round'; poly([[sx - 8, 530], [sx - 17, 540], [sx - 8, 550]]); g.stroke(); poly([[sx + 8, 530], [sx + 17, 540], [sx + 8, 550]]); g.stroke(); });
    } },
    { name: 'uma loja', hud: C.ink, fn: e => {
      fill(C.lime); const p = E.oBack(clamp(e / 0.2), 1.4), b = E.oBack(clamp((e - 0.06) / 0.17), 2);
      at(760, 540, p, null, -0.04, () => {
        shadow(70, 36, 0.24); box(-230, -290, 460, 580, 36, C.white); noShadow();
        g.strokeStyle = C.ink; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.arc(0, -96, 62, PI, TAU); g.stroke();
        poly([[-112, -96], [112, -96], [134, 130], [-134, 130]], true); g.fillStyle = C.ink; g.fill(); ball8(0, 22, 48, { face: 1 });
        text('R$ 88', -180, 232, 58, { w: 800 }); circ(160, 212, 30, C.pink); g.strokeStyle = C.white; g.lineWidth = 6; poly([[146, 212], [174, 212]]); g.stroke(); poly([[160, 198], [160, 226]]); g.stroke();
      });
      at(1300, 540, b, null, 0.03, () => { shadow(40, 20, 0.25); box(-220, -70, 440, 140, 70, C.ink); noShadow(); text('comprar', 0, 19, 56, { w: 700, c: C.white, align: 'center' }); });
    } },
    { name: 'um mapa', hud: C.white, fn: e => {
      fill(C.green); g.strokeStyle = rgba(C.white, 0.2); g.lineWidth = 26; g.lineCap = 'round';
      [[[-50, 300], [2000, 120]], [[-50, 760], [2000, 900]], [[420, -50], [300, 1130]], [[1080, -50], [1240, 1130]], [[1640, -50], [1560, 1130]], [[-50, 520], [2000, 560]]].forEach(l => { poly(l); g.stroke(); });
      const R = [[360, 800], [700, 770], [860, 540], [1140, 548], [1260, 330], [1500, 300]], d = E.oExpo(clamp(e / 0.19)); let tot = 0; const sl = []; for (let i = 1; i < R.length; i++) { const l = Math.hypot(R[i][0] - R[i - 1][0], R[i][1] - R[i - 1][1]); sl.push(l); tot += l; }
      const pts = [R[0]]; let left = tot * d; for (let i = 1; i < R.length && left > 0; i++) { const f = Math.min(1, left / sl[i - 1]); pts.push([lerp(R[i - 1][0], R[i][0], f), lerp(R[i - 1][1], R[i][1], f)]); left -= sl[i - 1]; }
      g.strokeStyle = C.white; g.lineWidth = 20; g.lineJoin = 'round'; poly(pts); g.stroke(); circ(360, 800, 26, C.white); circ(360, 800, 11, C.green);
      const pp = clamp((e - 0.09) / 0.12), dy = (1 - E.oBack(pp, 2.4)) * -260; if (pp > 0) { g.save(); g.globalAlpha = 0.25 * pp; g.fillStyle = C.ink; g.beginPath(); g.ellipse(1500, 304, 40 * pp, 12 * pp, 0, 0, TAU); g.fill(); g.restore();
        at(1500, 300 + dy, 1, 1, 0, () => { g.fillStyle = C.ink; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-74, -80, -66, -168, 0, -168); g.bezierCurveTo(66, -168, 74, -80, 0, 0); g.fill(); circ(0, -104, 24, C.lime); }); }
    } },
    { name: 'um quiz', hud: C.white, fn: e => {
      fill(C.blue); const p = E.oExpo(clamp(e / 0.18)); text('qual é a base?', W / 2, 330 - (1 - p) * 40, 84, { w: 700, c: C.white, align: 'center' });
      ['2', '8', '10'].forEach((s, i) => { const q = E.oExpo(clamp((e - i * 0.025) / 0.17)), ok = i === 1 && e > 0.12, k = ok ? E.oBack(clamp((e - 0.12) / 0.1), 2.6) : 0, x = W / 2 - 410 + i * 410;
        at(x, 620 + (1 - q) * 120, 1 + 0.08 * k, null, 0, () => { shadow(40, 18, 0.2); box(-180, -110, 360, 220, 44, ok ? C.ink : C.white); noShadow(); text(s, 0, 44, 124, { w: 800, c: ok ? C.white : C.ink, align: 'center' });
          if (k > 0) at(140, -90, k, k, 0, () => { circ(0, 0, 38, C.lime); g.strokeStyle = C.ink; g.lineWidth = 8; g.lineCap = g.lineJoin = 'round'; poly([[-15, 1], [-4, 12], [16, -11]]); g.stroke(); }); }); });
    } },
  ];

  // ------------------------------------------------------------------ peças do mosaico: paletas, degraus do zoom (no tempo da versão 2) e miniaturas
  const TPAL = [{ bg: C.fog, fg: C.ink, ac: C.blue }, { bg: C.ink, fg: C.white, ac: C.lime }, { bg: C.blue, fg: C.white, ac: C.ink }, { bg: C.pink, fg: C.ink, ac: C.white }, { bg: C.green, fg: C.white, ac: C.lime }, { bg: C.lime, fg: C.ink, ac: C.pink }];
  const ZS = [2.3, 1.5, 1.05, 0.74, 0.52, 0.37, 0.27, 0.2];
  function zoomAt(t) { const tt = clamp(t, 16, 19.5), k = Math.min(6, Math.floor((tt - 16) * 2)), f = (tt - 16) * 2 - k, a = k === 0 ? ZS[0] : ZS[k] * 0.96, b = ZS[k + 1]; return Math.exp(lerp(Math.log(a), Math.log(b), E.oExpo(clamp(f / 0.85)))) * (1 - 0.04 * f); }
  function icon(k, x, y, s, P) {
    g.save(); g.translate(x, y); g.scale(s / 100, s / 100); g.lineCap = g.lineJoin = 'round'; g.lineWidth = 9; g.strokeStyle = P.fg; g.fillStyle = P.fg;
    if (s < 30) { if (k % 3 === 0) circ(0, 0, 26, P.ac); else if (k % 3 === 1) box(-22, -22, 44, 44, 10, P.fg); else circ(0, 0, 21, null, { stroke: P.fg, lw: 11 }); g.restore(); return; }
    switch (k) {
      case 0: box(-34, -34, 68, 68, 18, P.ac); circ(-12, -7, 8.5, P.bg); circ(13, -7, 8.5, P.bg); break;
      case 1: box(-44, -34, 88, 68, 13, null, { stroke: P.fg, lw: 9 }); poly([[-44, -13], [44, -13]]); g.stroke(); circ(-28, -24, 4.5, P.ac); box(-28, 2, 34, 9, 4, P.fg); box(-28, 17, 22, 9, 4, P.ac); break;
      case 2: circ(0, 0, 40, P.ac); circ(5, -6, 20, P.bg); break;
      case 3: box(-46, -32, 92, 64, 9, P.fg); box(-36, -18, 32, 36, 5, P.bg); box(4, -18, 32, 36, 5, P.bg); circ(-20, 0, 9, P.ac); break;
      case 4: box(-25, -45, 50, 90, 14, P.fg); box(-17, -36, 34, 62, 6, P.bg); circ(0, 35, 4.5, P.bg); box(-11, -28, 22, 7, 3, P.ac); break;
      case 5: text('Aa', 0, 22, 66, { w: 800, c: P.fg, align: 'center' }); break;
      case 6: box(-30, -42, 60, 84, 5, null, { stroke: P.fg, lw: 8 }); circ(-2, -12, 17, P.ac); box(-18, 16, 36, 8, 2, P.fg); break;
      case 7: poly([[-40, 0], [40, 0]]); g.stroke(); circ(12, 0, 17, P.ac, { stroke: P.fg, lw: 8 }); break;
      case 8: g.lineWidth = 8; g.beginPath(); g.arc(0, -10, 20, PI, TAU); g.stroke(); poly([[-32, -10], [32, -10], [38, 40], [-38, 40]], true); g.fill(); circ(0, 16, 9, P.ac); break;
      case 9: g.fillStyle = P.ac; g.beginPath(); g.moveTo(0, 44); g.bezierCurveTo(-44, -4, -38, -46, 0, -46); g.bezierCurveTo(38, -46, 44, -4, 0, 44); g.fill(); circ(0, -10, 12, P.bg); break;
      case 10: circ(0, 0, 38, P.ac); g.strokeStyle = P.bg; poly([[-16, 1], [-5, 13], [17, -12]]); g.stroke(); break;
      case 11: g.translate(-20, -30); g.scale(2.3, 2.3); poly([[0, 0], [0, 30], [8, 23.2], [13.6, 35.6], [19.2, 33], [13.7, 21], [24, 21]], true); g.fill(); break;
      case 12: text('</>', 0, 16, 46, { fam: MONO, w: 700, c: P.fg, align: 'center' }); break;
      case 13: box(-38, -21, 76, 42, 21, P.ac); circ(17, 0, 14, P.bg); break;
      case 14: poly([[-22, -32], [34, 0], [-22, 32]], true); g.fill(); break;
      default: circ(-16, 26, 15, P.fg); g.lineWidth = 9; poly([[-2, 26], [-2, -36], [30, -26]]); g.stroke(); circ(22, 14, 0, P.fg);
    }
    g.restore();
  }

  // ------------------------------------------------------------------ a logo ilustrada em peças (cada objeto solto é uma peça)
  function initLogo(img) {
    LOGO = img; const w = img.naturalWidth, h = img.naturalHeight, c = mk(w, h), x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, w, h).data, lab = new Int32Array(w * h), stack = new Int32Array(w * h), comps = [null];
    // cada objeto solto da logo vira uma peça (componentes conexos do canal alfa)
    for (let p0 = 0; p0 < w * h; p0++) {
      if (lab[p0] || d[p0 * 4 + 3] < 60) continue;
      const id = comps.length, cc = { id, x0: w, x1: 0, y0: h, y1: 0, n: 0 }; let sp = 0; stack[sp++] = p0; lab[p0] = id;
      while (sp) { const q = stack[--sp], qx = q % w, qy = (q / w) | 0; cc.n++; if (qx < cc.x0) cc.x0 = qx; if (qx > cc.x1) cc.x1 = qx; if (qy < cc.y0) cc.y0 = qy; if (qy > cc.y1) cc.y1 = qy;
        if (qx > 0 && !lab[q - 1] && d[(q - 1) * 4 + 3] >= 60) { lab[q - 1] = id; stack[sp++] = q - 1; } if (qx < w - 1 && !lab[q + 1] && d[(q + 1) * 4 + 3] >= 60) { lab[q + 1] = id; stack[sp++] = q + 1; }
        if (qy > 0 && !lab[q - w] && d[(q - w) * 4 + 3] >= 60) { lab[q - w] = id; stack[sp++] = q - w; } if (qy < h - 1 && !lab[q + w] && d[(q + w) * 4 + 3] >= 60) { lab[q + w] = id; stack[sp++] = q + w; } }
      comps.push(cc);
    }
    // migalhas juntam-se à peça grande mais próxima
    const big = comps.filter(cc => cc && cc.n >= 900), map = new Int32Array(comps.length);
    for (const cc of comps) { if (!cc) continue; if (cc.n >= 900) { map[cc.id] = cc.id; continue; } let best = big[0], bd = 1e18; const mx = (cc.x0 + cc.x1) / 2, my = (cc.y0 + cc.y1) / 2; for (const b of big) { const dx = Math.max(b.x0 - mx, 0, mx - b.x1), dy = Math.max(b.y0 - my, 0, my - b.y1), dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = b; } } map[cc.id] = best.id; best.x0 = Math.min(best.x0, cc.x0); best.x1 = Math.max(best.x1, cc.x1); best.y0 = Math.min(best.y0, cc.y0); best.y1 = Math.max(best.y1, cc.y1); }
    for (let p = 0; p < w * h; p++) if (lab[p]) lab[p] = map[lab[p]];
    // a borda suavizada (alfa baixo) vai com a peça vizinha
    for (let pass = 0; pass < 3; pass++) { const add = []; for (let p = 0; p < w * h; p++) { if (lab[p] || !d[p * 4 + 3]) continue; const qx = p % w; const nb = (qx > 0 && lab[p - 1]) || (qx < w - 1 && lab[p + 1]) || (p >= w && lab[p - w]) || (p < w * h - w && lab[p + w]); if (nb) add.push(p, nb); } for (let i = 0; i < add.length; i += 2) lab[add[i]] = add[i + 1]; }
    const k = LG.w / w, lx = LG.cx - LG.w / 2, ly = LG.cy - h * k / 2, CEN = [0.1, 0.316, 0.522, 0.724, 0.89];
    PIECES = big.map(b => {
      const x0 = Math.max(0, b.x0 - 3), y0 = Math.max(0, b.y0 - 3), bw = Math.min(w, b.x1 + 4) - x0, bh = Math.min(h, b.y1 + 4) - y0, pc = mk(bw, bh), px = pc.getContext('2d'), im = px.createImageData(bw, bh);
      for (let yy = 0; yy < bh; yy++) for (let xx = 0; xx < bw; xx++) { const s = (y0 + yy) * w + x0 + xx; if (lab[s] === b.id) { const o = (yy * bw + xx) * 4, i = s * 4; im.data[o] = d[i]; im.data[o + 1] = d[i + 1]; im.data[o + 2] = d[i + 2]; im.data[o + 3] = d[i + 3]; } }
      px.putImageData(im, 0, 0);
      const fx = (x0 + bw / 2) / w; let li = 0; CEN.forEach((cn, i) => { if (Math.abs(fx - cn) < Math.abs(fx - CEN[li])) li = i; });
      return { c: pc, x: lx + (x0 + bw / 2) * k, y: ly + (y0 + bh / 2) * k, w: bw * k, h: bh * k, li, id: b.id };
    });
    // (fim de initLogo) na versão 3 a logo ilustrada aparece na prancha da marca; as peças entram de B a 8
    // nota #40: o modo Contorno do Illustrator (a silhueta de cada peça em linha azul fina) e algumas âncoras por peça,
    // para a animação do rascunho virando vetor
    { const oc = mk(w, h), ox = oc.getContext('2d'), oi = ox.createImageData(w, h), A = p => d[p * 4 + 3] >= 60, ab = hex(C.blue), RR = 3, edges = new Map();
      for (let yy = RR; yy < h - RR; yy++) for (let xx = RR; xx < w - RR; xx++) { const p = yy * w + xx; if (!A(p) || (A(p - 1) && A(p + 1) && A(p - w) && A(p + w))) continue;
        for (let dy = -RR; dy <= RR; dy++) for (let dx = -RR; dx <= RR; dx++) { if (dx * dx + dy * dy > RR * RR) continue; const o = ((yy + dy) * w + xx + dx) * 4; oi.data[o] = ab[0]; oi.data[o + 1] = ab[1]; oi.data[o + 2] = ab[2]; oi.data[o + 3] = 255; }
        const id = lab[p]; if (id) { if (!edges.has(id)) edges.set(id, []); edges.get(id).push(xx, yy); } }
      ox.putImageData(oi, 0, 0); OUTL = oc; ANC = [];
      for (const [id, e] of edges) { const n = e.length / 2, m = Math.max(3, Math.min(7, Math.round(n / 260))); for (let j = 0; j < m; j++) { const q = Math.floor((j + rnd(id, j, 5) * 0.5) * n / m) * 2; ANC.push([lx + e[q] * k, ly + e[q + 1] * k]); } } }
    LGB.x0 = Math.min(...PIECES.map(p => p.x - p.w / 2)); LGB.x1 = Math.max(...PIECES.map(p => p.x + p.w / 2)); LGB.y0 = Math.min(...PIECES.map(p => p.y - p.h / 2)); LGB.y1 = Math.max(...PIECES.map(p => p.y + p.h / 2));
    LG.h = h * k; const cnt = [0, 0, 0, 0, 0];
    PIECES.sort((a, b) => a.li - b.li || (a.y + a.x * 0.3) - (b.y + b.x * 0.3)); PIECES.forEach(p => { p.t0 = 15.06 + p.li * 0.06 + cnt[p.li]++ * 0.025; p.rot = (rnd(p.id, 61) - 0.5) * 1.4; });
  }
  const LG = { w: 980, cx: W / 2, cy: 348, h: 300 }, LGB = {}, IMG = {}, OBJ = []; let PIECES = [], LOGO = null, OUTL = null, ANC = [], SKETCH = null;
  // o rascunho a lápis da logo (06_Identidade_Visual/vetorizacao/fontes): o papel vira transparente e fica só o grafite;
  // recorta só o BASE8 (o polvo, à esquerda, fica de fora)
  function initSketch(img) {
    const w = img.naturalWidth, h = img.naturalHeight, c = mk(w, h), x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const im = x.getImageData(0, 0, w, h), d = im.data; let x0 = w, x1 = 0, y0 = h, y1 = 0;
    for (let p = 0; p < w * h; p++) { const l = (d[p * 4] + d[p * 4 + 1] + d[p * 4 + 2]) / 3, a = clamp((232 - l) / 110), px = p % w, py = (p / w) | 0; d[p * 4] = 58; d[p * 4 + 1] = 62; d[p * 4 + 2] = 82; d[p * 4 + 3] = Math.round(a * 255);
      if (px < w * 0.26 || px > w * 0.985) d[p * 4 + 3] = 0; else if (a > 0.45) { if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; } }
    x.putImageData(im, 0, 0); const s = mk(x1 - x0 + 1, y1 - y0 + 1); s.getContext('2d').drawImage(c, -x0, -y0); SKETCH = s;
  }

  // ------------------------------------------------------------------ degradês e granulado
  const grd = (x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  // halo suave em volta de um ponto (é nele que o granulado mais aparece)
  function glow(x, y, r, col, a) { if (r <= 0 || a <= 0) return; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(0.45, rgba(col, a * 0.35)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  // a mesma cor com a luminosidade multiplicada por k (é como o brandbook escurece os degradês da bola 8)
  function hslK(h, k) {
    const [r, gg, b] = hex(h).map(v => v / 255), mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), d = mx - mn; let hh = 0, s = 0, l = (mx + mn) / 2;
    if (d) { s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); hh = (mx === r ? (gg - b) / d + (gg < b ? 6 : 0) : mx === gg ? (b - r) / d + 2 : (r - gg) / d + 4) / 6; }
    l = clamp(l * k); const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = x => { x = (x + 1) % 1; return x < 1 / 6 ? p + (q - p) * 6 * x : x < 1 / 2 ? q : x < 2 / 3 ? p + (q - p) * (2 / 3 - x) * 6 : p; };
    return '#' + [f(hh + 1 / 3), f(hh), f(hh - 1 / 3)].map(v => Math.round(clamp(v) * 255).toString(16).padStart(2, '0')).join('');
  }
  const tones = col => col === 'ink' ? [mix(C.ink, C.blue, 0.42), C.ink] : [C[col], hslK(C[col], 0.72)];
  // granulado: ruído em "overlay" por cima do quadro pronto. Branco e preto puros não mudam; as cores e os degradês ganham textura.
  const NOISE = mk(512, 512);
  { const x = NOISE.getContext('2d'), im = x.createImageData(512, 512); for (let i = 0; i < 262144; i++) { const v = Math.round(128 + (hash(i * 7 + 13) - 0.5) * 230); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } x.putImageData(im, 0, 0); }
  function grain(t) {
    if (GRAIN <= 0) return; const k = Math.floor(t * 24), ox = Math.floor(rnd(k, 1) * 768), oy = Math.floor(rnd(k, 2) * 768);
    MAIN.save(); MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = GRAIN; MAIN.globalCompositeOperation = 'overlay';
    for (let y = -oy; y < H; y += 768) for (let x = -ox; x < W; x += 768) MAIN.drawImage(NOISE, x, y, 768, 768);
    MAIN.restore();
  }

  // ------------------------------------------------------------------ a bola 8 (logo simplificada do brandbook, página 20)
  // Variações: as quatro cores da paleta, preto e branco, e a colorida (principal).
  const BV = {}; for (const k of ['blue', 'green', 'lime', 'pink']) { const d = hslK(C[k], 0.75); BV[k] = { ball: [d, C[k]], disc: [C[k], d], num: [d, C[k]], gl: C[k] }; }
  BV.pb = { ball: ['#000000', '#2B2B2B', '#DADADA'], disc: ['#FFFFFF', '#1C1C1C'], num: ['#2E2E2E', '#FFFFFF'], gl: C.mute };
  BV.cor = { conic: true, disc: ['#3BABF3', '#0A62B8'], num: ['#FFFFFF', '#FFFFFF'], gl: C.pink };
  function ballBase(R, v) {
    if (v.conic) { const gr = g.createConicGradient(-PI / 2, 0, 0); [[0, C.lime], [0.2, C.pink], [0.45, C.blue], [0.63, C.green], [0.82, '#D2CB25'], [1, C.lime]].forEach(s => gr.addColorStop(s[0], s[1])); g.fillStyle = gr; }
    else g.fillStyle = grd(-R, 0, R, 0, v.ball);
    g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
  }
  // o círculo com o 8, girado th em torno do eixo vertical da bola (0 = de frente; ±90° = some na borda)
  function ballFace(R, v, th) {
    const c = Math.cos(th); if (c <= 0.03) return; const r = R * 0.575;
    g.save(); g.translate(R * 0.07 * c + Math.sin(th) * R * 0.9, -R * 0.13); g.scale(c, 1);
    g.fillStyle = grd(-r * 0.7, -r * 0.7, r * 0.7, r * 0.7, v.disc); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill();
    g.font = `800 ${(r * 1.5).toFixed(1)}px ${SANS}`; g.letterSpacing = '0px'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = grd(-r * 0.4, -r * 0.6, r * 0.4, r * 0.6, v.num); g.fillText('8', 0, r * 0.53);
    g.restore();
  }
  // o = { v: variação, v2 + f: mistura para a próxima (0 a 1), face: 0 a 1 (mostra o 8), th: giro da face, rot: bola rolando, sx, sy }
  function ball8(x, y, R, o = {}) {
    if (R <= 0) return; const v = BV[o.v || 'blue'];
    g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); g.scale(o.sx || 1, o.sy || 1);
    // a colorida (principal) é a bola oficial da IDV, a imagem da rodada 14 (nota #29), não um desenho em código
    if (o.v === 'cor' && IMG.bola8) { g.drawImage(IMG.bola8, -R, -R, R * 2, R * 2); g.restore(); return; }
    ballBase(R, v);
    if (o.v2 && o.v2 !== 'cor' && o.f > 0) { g.save(); g.globalAlpha *= clamp(o.f); ballBase(R, BV[o.v2]); g.restore(); }
    if (o.face > 0) { const th = o.th || 0; g.save(); g.beginPath(); g.arc(0, 0, R, 0, TAU); g.clip(); g.globalAlpha *= clamp(o.face); if (o.v2 && o.v2 !== 'cor' && th > PI / 2) ballFace(R, BV[o.v2], th - PI); else ballFace(R, v, th); g.restore(); }
    if (o.v2 === 'cor' && o.f > 0 && IMG.bola8) { g.save(); g.globalAlpha *= clamp(o.f); g.drawImage(IMG.bola8, -R, -R, R * 2, R * 2); g.restore(); }
    g.restore();
  }
  // arcos finos com pontos, girando devagar (vida de fundo)
  function orbits(t, cx, cy, a) {
    if (a <= 0) return; g.save(); g.globalAlpha = a; g.lineWidth = 1.6;
    [[330, 0.5, 0.11, C.dim, C.blue], [470, 2.3, -0.07, C.line, C.pink], [640, 4.0, 0.05, C.dim, C.green]].forEach(([r, a0, w, c, dot]) => { const a1 = a0 + t * w; g.strokeStyle = c; g.beginPath(); g.arc(cx, cy, r, a1, a1 + 1.9); g.stroke(); circ(cx + Math.cos(a1 + 1.9) * r, cy + Math.sin(a1 + 1.9) * r, 5, dot); circ(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, 3, C.mute); });
    g.restore();
  }
  // como reveal(), mas cada palavra tem a sua hora de entrar
  function wordsAt(L, x, y, times, t, out, dur = 0.5) {
    const size = L.size, x0 = x - L.width / 2; g.save(); g.beginPath(); g.rect(x0 - 30, y - size * 1.04, L.width + 60, size * 1.4); g.clip(); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    L.items.forEach((it, i) => { const e = t - times[i] - 0.04; if (e < 0) return; let dy = (1 - E.oExpo(clamp(e / dur))) * size * 1.2; if (out != null) dy -= E.iCubic(seg(t, out + i * 0.025, out + i * 0.025 + 0.24)) * size * 1.3; font(size, it.wt); g.fillStyle = it.c || C.ink; g.fillText(it.s, x0 + it.x, y + dy); });
    g.restore();
  }

  // ================================================================== CENA 1 · A pergunta (0–5 s)
  // A bola segue reto pela linha da frase. Em cada trecho há um par de formas barrando o caminho: elas se afastam quando a
  // bola chega e a palavra daquele trecho aparece atrás dela. No fim a bola pousa como o pingo do "?".
  // A bola anda em velocidade constante (só acelera na saída e freia na chegada): não para entre as palavras. Cada palavra
  // sai de trás dela, como se a bola a trouxesse; as formas de cada trecho se abrem um pouco antes de ela chegar.
  // Versão 5 (nota #34): de volta à bolinha da versão 2. Ela nasce no centro, salta para a primeira palavra e pinga de
  // palavra em palavra (como bolinha de karaokê); cada palavra sobe quando a bola pousa nela. Ficaram da versão 4 as formas
  // que se abrem, as órbitas, o halo, os anéis e o rastro pontilhado (agora seguindo os arcos dos pulos).
  const P1 = {}, TC = [1.3, 1.75, 2.2, 2.65, 3.1], TL1 = 3.65, RB = 26, HT = [0.76, 0.76, 0.74, 0.55, 0.74];
  const GATE = [{ top: 'circ', bot: 'half', col: 'ink', s: 330, d: 250 }, { top: 'half', bot: 'rect', col: 'pink', s: 290, d: 270 }, { top: 'rect', bot: 'circ', col: 'lime', s: 280, d: 240 }, { top: 'tri', bot: 'half', col: 'green', s: 330, d: 280 }, { top: 'circ', bot: 'tri', col: 'blue', s: 370, d: 260 }];
  function initS1() {
    initP1(); const it = P1.L.items; P1.yl = P1.y - P1.size * 0.27; P1.b = [P1.x0 - 120];
    for (let i = 1; i < 5; i++) P1.b.push(P1.x0 + (it[i - 1].x + it[i - 1].w + it[i].x) / 2); P1.b.push(P1.q.x);
    P1.cx = it.map((w, i) => (P1.b[i] + P1.b[i + 1]) / 2);
    P1.stop = it.map((w, i) => [P1.x0 + w.x + w.w / 2, P1.y - HT[i] * P1.size - RB]);   // onde a bola pousa em cada palavra
    window.VH_S1 = { pass: TC };   // make-audio.js usa estes tempos
  }
  // forma encostada na linha (y = 0), para cima (dir = -1) ou para baixo (dir = 1); o degradê clareia perto da linha
  function gateShape(kind, s, col, dir) {
    g.fillStyle = grd(0, 0, 0, dir * s * 1.5, tones(col)); g.beginPath();
    if (kind === 'circ') g.arc(0, dir * s, s, 0, TAU);
    else if (kind === 'half') g.arc(0, 0, s, dir > 0 ? 0 : PI, dir > 0 ? PI : TAU);
    else if (kind === 'rect') g.roundRect(-s * 0.62, dir > 0 ? 0 : -s * 1.7, s * 1.24, s * 1.7, dir > 0 ? [0, 0, s * 0.3, s * 0.3] : [s * 0.3, s * 0.3, 0, 0]);
    else { g.moveTo(-s, 0); g.lineTo(s, 0); g.lineTo(0, dir * s * 1.5); g.closePath(); }
    g.fill();
  }
  function ball1(t) {
    const q = P1.q, S = P1.stop;
    if (t < 0.95) { const a = seg(t, 0.72, 0.95); return { x: W / 2, y: 540 + a * 6, r: RB * spring(t - 0.35, 4, 0.42), sx: 1 + 0.24 * a, sy: 1 - 0.22 * a }; }   // nasce no centro e agacha antes do pulo
    let a, b, ta, tb, h, r = RB;
    if (t < TC[0]) { a = [W / 2, 540]; b = S[0]; ta = 0.95; tb = TC[0]; h = 230; }
    else if (t < TC[4]) { const i = Math.min(3, Math.floor((t - TC[0]) / 0.45)); a = S[i]; b = S[i + 1]; ta = TC[i]; tb = TC[i + 1]; h = 96; }
    else if (t < TL1) { a = S[4]; b = [q.x, q.y]; ta = TC[4]; tb = TL1; h = 92; r = lerp(RB, q.r, E.io(seg(t, ta, tb))); }
    else { const e = t - TL1, bump = Math.exp(-e * 20) * Math.cos(e * 30), pulse = Math.sin(PI * seg(t, 4.2, 4.5)); return { x: q.x, y: q.y, r: q.r * (1 + 0.9 * pulse), sx: 1 + 0.3 * bump, sy: 1 - 0.3 * bump }; }
    const f = seg(t, ta, tb), x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f) - 4 * h * f * (1 - f);
    // amassa ao pousar e ao tomar impulso; no ar estica um pouco no sentido do movimento
    const land = ta > 1 ? Math.max(0, 1 - (t - ta) / 0.08) : 0, take = Math.max(0, 1 - (tb - t) / 0.05) * 0.6, bump = Math.max(land, take), v = Math.abs(1 - 2 * f) * (1 - bump);
    return { x, y: y + r * 0.3 * bump, r, sx: 1 + 0.3 * bump - 0.08 * v, sy: 1 - 0.3 * bump + 0.12 * v };
  }
  function s1(t) {
    studio(); const q = P1.q, sz = P1.size, L = P1.L, y = P1.y, yl = P1.yl, b = ball1(t);
    orbits(t, W / 2, yl, seg(t, 0.3, 0.9) * (1 - seg(t, 4.5, 4.9)));
    // as formas de cada trecho se abrem quando a bola vem pingar na palavra
    for (let i = 4; i >= 0; i--) {
      const G = GATE[i], inn = E.oBack(seg(t, 0.04 + i * 0.05, 0.42 + i * 0.05), 1.2), o = spring(t - (TC[i] - 0.28), 2.6, 0.62), ex = E.iCubic(seg(t, 4.5 + i * 0.03, 4.96)), sg = i % 2 ? 1 : -1, fl = Math.sin(t * 1.3 + i * 1.7) * 5 * clamp(o);
      if (inn <= 0 || ex >= 1) continue;
      for (const dir of [-1, 1]) { g.save(); g.translate(P1.cx[i], yl + dir * (G.d * o + 760 * ex + fl)); g.rotate(dir * sg * 0.2 * o); g.scale(inn, inn); gateShape(dir < 0 ? G.top : G.bot, G.s, G.col, dir); g.restore(); }
    }
    // o rastro pontilhado segue os arcos dos pulos
    if (t > 0.95 && t < 4.2) { g.save(); g.globalAlpha = 0.5 * (1 - seg(t, 3.6, 4.2)); g.strokeStyle = C.blue; g.lineWidth = 3; g.lineCap = 'round'; g.setLineDash([2, 14]); g.beginPath(); const te = Math.min(t, TL1);
      for (let tt = 0.95, k = 0; tt <= te; tt += 1 / 120, k++) { const p = ball1(tt); k ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); } g.stroke(); g.restore(); }
    // cada palavra sobe de baixo da linha quando a bola pinga nela
    g.save(); g.beginPath(); g.rect(0, y - sz * 1.1, W, sz * 1.45); g.clip(); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    L.items.forEach((it, i) => { if (t < TC[i]) return; const dy = (1 - spring(t - TC[i], 5, 0.5)) * sz * 0.85 + E.iCubic(seg(t, 4.7 + i * 0.035, 4.92 + i * 0.035)) * sz * 1.4; font(sz, 600); g.fillStyle = it.c || C.ink; g.fillText(i < 4 ? it.s : 'imaginar', P1.x0 + it.x, y + dy); });
    g.restore();
    if (t >= TL1 && t < 4.9) { // gancho do "?" (o pingo é a bola)
      const p = spring(t - TL1, 5, 0.45) * (1 - E.iCubic(seg(t, 4.74, 4.9)));
      g.save(); g.beginPath(); g.rect(P1.qx0 - 12, y - sz * 1.1, sz, q.cut - (y - sz * 1.1)); g.clip();
      g.translate(q.x, q.cut); g.scale(p, p); g.translate(-q.x, -q.cut); font(sz, 600); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = C.blue; g.fillText('?', P1.qx0, y); g.restore();
    }
    if (t >= 0.35) {
      ring(t, 0.35, W / 2, 540, C.blue, 90, 0.6); ring(t, 4.2, q.x, q.y, C.blue, 74, 0.55); TC.forEach((tc, i) => ring(t, tc, P1.stop[i][0], P1.stop[i][1] + RB, rgba(C.blue, 0.55), 46, 0.36));
      glow(b.x, b.y, b.r * 4.6 + 30, C.blue, 0.46 * clamp(b.r / RB + 0.4));
      // nota #43: um brilho branco redondo em volta da bola, para ela se destacar das formas coloridas do começo
      const hl = 1 - seg(t, 4.4, 4.9);
      if (hl > 0) { glow(b.x, b.y, b.r * 2.4 + 18, C.white, 0.95 * hl); at(b.x, b.y, b.sx, b.sy, 0, () => { g.save(); g.globalAlpha *= hl; g.shadowColor = C.white; g.shadowBlur = 22; circ(0, 0, b.r + 5, null, { stroke: C.white, lw: 5 }); g.restore(); }); }
      ball8(b.x, b.y, b.r, { sx: b.sx, sy: b.sy });
    }
  }

  // ================================================================== CENA 2 · O traço (5–10 s)
  const NS = 420, BAR = { x: 370, y: 465, w: 1180, h: 150, r: 38 }, CODE = 'crie(o_que_você_imaginar)', CSZ = 58, CX0 = BAR.x + 112, TYPE = [];
  const T2 = { draw0: 5.4, draw1: 7.05, grab: 7.2, pull0: 7.3, pull1: 7.75, send: 9.5 };
  let CW = 34.8, SE = [1465, 540];
  for (let i = 0; i < CODE.length; i++) TYPE.push(8.0 + i * 0.032 + (rnd(i, 7) - 0.5) * 0.018);
  const typed = t => { let n = 0; while (n < TYPE.length && TYPE[n] <= t) n++; return n; };
  const L2 = u => [lerp(420, 1500, u), 540];
  // o rabisco: laços de quem testa uma caneta, com o tremor da mão
  function Scr(u) {
    u = clamp(u); const env = Math.pow(Math.sin(PI * u), 0.5), w = E.io(seg(u, 0.5, 0.62)), jx = (vn(u * 46, 11) - 0.5) * 16, jy = (vn(u * 52, 12) - 0.5) * 16;
    const A = 150 * env * (0.5 + 0.95 * vn(u * 7, 3)), th = TAU * (5.2 * u + 0.6 * (vn(u * 3.2, 5) - 0.5));          // primeira metade: laços de tamanhos diferentes
    const z = u * 26, tri = 4 * Math.abs(z - Math.floor(z + 0.5)) - 1, B = 125 * env * (0.55 + 0.75 * vn(u * 9, 8));   // segunda metade: vai e vem apertado
    return [lerp(455, 1465, u) + lerp(A * Math.sin(th), -30 * tri, w) + jx, 520 + 30 * Math.sin(TAU * u * 1.2) + lerp(-A * Math.cos(th), B * tri, w) + jy];
  }
  function initS2() { font(CSZ, 500, MONO); CW = g.measureText('0').width; SE = Scr(1); }
  function tracePts(t) {
    const pts = [];
    if (t < T2.pull0) { const um = Math.pow(seg(t, T2.draw0, T2.draw1), 0.92), n = Math.max(2, Math.ceil(NS * um)); for (let i = 0; i <= n; i++) pts.push(Scr(um * i / n)); }
    else { const tu = seg(t, T2.pull0, T2.pull1); for (let i = 0; i <= NS; i++) { const u = i / NS, w = E.io(clamp(tu * 1.6 - (1 - u) * 0.6)), a = Scr(u), b = L2(u); pts.push([lerp(a[0], b[0], w), lerp(a[1], b[1], w)]); } }
    return pts;
  }
  // traço de giz: espessura irregular, uma segunda passada desencontrada e falhas de textura (o papel aparece)
  const SCRC = mk(W, H), SCX = SCRC.getContext('2d'), CRAY = mk(256, 256); let CRAYP = null;
  { const x = CRAY.getContext('2d'), im = x.createImageData(256, 256); for (let j = 0; j < 128; j++) for (let i = 0; i < 128; i++) { const a = hash(i * 131 + j * 977 + 5) > 0.72 ? 150 + hash(i + j * 311) * 105 : hash(i * 17 + j * 29) * 46; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) im.data[((j * 2 + dy) * 256 + i * 2 + dx) * 4 + 3] = a; } x.putImageData(im, 0, 0); }
  function scribble(pts, lw, col) {
    SCX.setTransform(1, 0, 0, 1, 0, 0); SCX.globalCompositeOperation = 'source-over'; SCX.globalAlpha = 1; SCX.clearRect(0, 0, W, H); if (pts.length < 2) return;
    SCX.strokeStyle = col; SCX.lineCap = SCX.lineJoin = 'round';
    for (let p = 0; p < 2; p++) for (let i = 1; i < pts.length; i += 3) {
      const j = Math.min(pts.length - 1, i + 3), k = (i / 3) | 0, o = p ? 5 : 0, ox = o * (vn(k * 0.3, 31) - 0.5) * 2;
      SCX.lineWidth = lw * (p ? 0.42 : 0.62 + 0.6 * vn(k * 0.21, 21)); SCX.beginPath(); SCX.moveTo(pts[i - 1][0] + ox, pts[i - 1][1] + o); for (let m = i; m <= j; m++) SCX.lineTo(pts[m][0] + ox, pts[m][1] + o); SCX.stroke();
    }
    CRAYP = CRAYP || SCX.createPattern(CRAY, 'repeat'); SCX.globalCompositeOperation = 'destination-out'; SCX.fillStyle = CRAYP; SCX.fillRect(0, 0, W, H); SCX.globalCompositeOperation = 'source-over';
    g.drawImage(SCRC, 0, 0);
  }
  function codeLine(n, x, y, colA, colB, colC) { // crie ( argumento )
    font(CSZ, 500, MONO); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    for (let i = 0; i < n; i++) { const ch = CODE[i]; g.fillStyle = i < 4 ? colA : (ch === '(' || ch === ')') ? colB : colC; g.fillText(ch, x + i * CW, y); }
  }
  // a bola nesta cena: sai do "?", é a ponta do giz, é por onde o cursor puxa o traço, e vai morar na ponta da barra
  function ball2(t, end) {
    const q = P1.q, s0 = Scr(0);
    if (t < T2.draw0) { const f = E.io(seg(t, 5.0, T2.draw0)); return { x: lerp(q.x, s0[0], f), y: lerp(q.y, s0[1], f) - 4 * 70 * f * (1 - f), r: lerp(q.r, 13, f) }; }
    if (t < T2.pull1) return { x: end[0], y: end[1], r: 13 };
    const f = E.io(seg(t, T2.pull1, 8.04)); return { x: lerp(1500, BAR.x + 62, f), y: 540 - 4 * 50 * f * (1 - f), r: lerp(13, 19, f) * (1 + 0.16 * pressAt(t, [T2.send - 0.04])) };
  }
  // 9,5–10,5 s (antes, meio segundo de respiro com o cursor piscando): enviar o prompt solta as cores e os objetos da marca; é o respiro antes do primeiro exemplo
  const CONF = [];
  for (let i = 0; i < 30; i++) CONF.push({ a: (i / 30) * TAU + (rnd(i, 41) - 0.5) * 0.5, d: 300 + rnd(i, 42) * 520, img: i % 2 === 0 ? (i / 2) % 16 : -1, k: Math.floor(rnd(i, 43) * 5), col: ['blue', 'pink', 'green', 'lime', 'ink'][i % 5], s: 0.7 + rnd(i, 44) * 0.7, r0: (rnd(i, 45) - 0.5) * 6, dl: rnd(i, 46) * 0.16 });
  function geo(k, s, col) {
    g.fillStyle = grd(-s, -s, s, s, tones(col)); g.beginPath();
    if (k === 0) g.arc(0, 0, s, 0, TAU); else if (k === 1) g.arc(0, 0, s * 1.2, 0, PI); else if (k === 2) g.roundRect(-s, -s, s * 2, s * 2, s * 0.3); else if (k === 3) { g.moveTo(-s, s); g.lineTo(s, s); g.lineTo(0, -s); g.closePath(); } else { g.arc(0, 0, s * 1.3, 0, PI / 2); g.arc(0, 0, s * 0.6, PI / 2, 0, true); g.closePath(); }
    g.fill();
  }
  function burst2(t) {
    const e = t - T2.send; if (e < 0 || t > 10.9) return; const cx = W / 2, cy = 540, rr = i => 1250 * E.oExpo(seg(e, i * 0.075, i * 0.075 + 0.6));
    // anéis de cor que varrem a tela e devolvem o branco
    [C.blue, C.pink, C.lime, C.green].forEach((c, i) => { const r0 = rr(i), r1 = rr(i === 3 ? 4 : i + 1); if (r0 - r1 < 0.5) return; const gr = g.createRadialGradient(cx, cy, r1, cx, cy, r0 + 1); gr.addColorStop(0, hslK(c, 0.8)); gr.addColorStop(0.5, c); gr.addColorStop(1, mix(c, C.white, 0.3)); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r0, 0, TAU); g.arc(cx, cy, r1, 0, TAU, true); g.fill(); });
    // objetos da logo e formas da paleta, lançados do centro; ficam um instante no ar e somem quando o jogo entra
    CONF.forEach((c, i) => {
      const p = E.oExpo(seg(e, c.dl, c.dl + 0.62)), out = E.iCubic(seg(t, 10.32 + (i % 6) * 0.02, 10.64 + (i % 6) * 0.02)); if (p <= 0 || out >= 1) return;
      const d = c.d * (p + 0.07 * (e - c.dl)) * (1 + 0.5 * out), sc = c.s * E.oBack(seg(e, c.dl, c.dl + 0.3), 1.6) * (1 - out);
      g.save(); g.translate(cx + Math.cos(c.a) * d * 1.25, cy + Math.sin(c.a) * d * 0.72 + 70 * e * e); g.rotate(c.r0 * (1 - p) + (rnd(i, 47) - 0.5) * 0.6 * e); g.scale(sc, sc);
      const im = c.img >= 0 ? OBJ[c.img] : null;
      if (im) { const k = 170 / Math.max(im.naturalWidth, im.naturalHeight); g.drawImage(im, -im.naturalWidth * k / 2, -im.naturalHeight * k / 2, im.naturalWidth * k, im.naturalHeight * k); } else geo(c.k, 46, c.col);
      g.restore();
    });
  }
  function s2(t) {
    studio();
    reveal(lay('p2', [{ s: 'tudo' }, { s: 'começa' }, { s: 'num' }, { s: 'rabisco.', c: C.blue }], 80), W / 2, 978, t - 5.9, { align: 'center', stag: 0.08, out: 1.5 });
    let b = null;
    if (t < T2.pull1) { const pts = tracePts(t); if (t >= T2.draw0) scribble(pts, 17, C.blue); b = ball2(t, pts[pts.length - 1]); }
    else {
      // 7,75 s: a linha engrossa e vira a barra de comando
      const p = spring(t - T2.pull1, 3.6, 0.58), ant = E.iCubic(seg(t, T2.send - 0.14, T2.send)), ex = seg(t, T2.send, T2.send + 0.16), R = mrect({ x: 420, y: 532, w: 1080, h: 16, r: 8 }, BAR, p), la = seg(t, 8.2, 8.5) * (1 - seg(t, T2.send - 0.1, T2.send));
      if (la > 0) { g.save(); g.globalAlpha = la; text('~/ideias', BAR.x + 14, BAR.y + BAR.h + 52 - (1 - la) * 10, 21, { fam: MONO, w: 500, c: C.mute }); text('enter para criar', BAR.x + BAR.w - 14, BAR.y + BAR.h + 52 - (1 - la) * 10, 21, { fam: MONO, w: 500, c: C.mute, align: 'right' }); g.restore(); }
      if (ex < 1) {
        const sc = 1 + 0.3 * ex; g.save(); g.globalAlpha = 1 - ex; g.translate(W / 2, 540); g.scale((1 - 0.08 * ant) * sc, (1 + 0.12 * ant) * sc); g.translate(-W / 2, -540);
        shadow(70 * p, 34 * p, 0.26 * clamp(p)); rbox(R, mix(C.blue, C.ink, seg(t, T2.pull1, T2.pull1 + 0.14))); noShadow();
        const ca = seg(t, 7.87, 8.05);
        if (ca > 0) {
          const by = 540 + CSZ * 0.34, n = typed(t), kp = pressAt(t, [T2.send]), ks = (1 - 0.14 * kp) * E.oBack(seg(t, 8.05, 8.35));
          g.save(); g.globalAlpha *= ca; codeLine(n, CX0, by, C.white, C.mute, C.lime);
          if (t < TYPE[TYPE.length - 1] + 0.1 || Math.floor(t * 4) % 2 === 0) box(CX0 + n * CW + 5, 540 - 36, 8, 72, 4, C.blue);
          at(BAR.x + BAR.w - 76, 540, ks, ks, 0, () => { box(-40, -40, 80, 80, 18, t > T2.send - 0.05 ? C.blue : C.key); g.strokeStyle = C.white; g.lineWidth = 5; g.lineCap = g.lineJoin = 'round'; poly([[14, -14], [14, 6], [-14, 6]]); g.stroke(); poly([[-6, -3], [-15, 6], [-6, 15]]); g.stroke(); });
          g.restore();
        }
        g.restore();
      }
      if (t < T2.send) b = ball2(t);
    }
    if (t >= T2.send) { burst2(t); game(t); b = ball3(t); }
    glow(b.x, b.y, b.r * 3.4, C.blue, t < T2.pull1 || t >= T2.send ? 0.3 : 0.5); ball8(b.x, b.y, b.r, { sx: b.sx, sy: b.sy });
    if (t > 6.7 && t < 8.25) { // o cursor pega a bola na ponta do rabisco e puxa
      const c = t < 7.14 ? kf(t, [[6.7, 1720, 1180], [7.14, SE[0] + 8, SE[1] + 8, E.oExpo]]) : t < T2.pull1 ? [b.x + 8, b.y + 8] : kf(t, [[T2.pull1, 1508, 548], [7.86, 1508, 548], [8.25, 2080, 820, E.iCubic]]);
      ring(t, T2.grab, SE[0], SE[1], C.ink, 60); cursor(c[0], c[1], 'você', C.ink, { press: t > T2.grab && t < T2.pull1 ? 0.6 : 0 });
    }
  }

  // ================================================================== CENA 3 · As formas (10,5–19,5 s)
  // O nome de cada exemplo fica embaixo, no centro; o resto da tela é do exemplo. A bola pula de um para o outro e, em
  // cada um, faz um papel: a luz que guia o Kaiho no Hikari no Mon, o favicon do site, o azul da paleta, o dedo que acende
  // a mesa do portfólio e a própria bola quicando num exercício de animação.
  const GS = { x: 370, y: 92, w: 1180, h: 664, r: 26 }, GK = GS.w / 1600, gx = ix => GS.x + ix * GK, gy = iy => GS.y + iy * GK;
  const WIN = { x: 370, y: 92, w: 1180, h: 744, r: 26 }, BARH = 64, FAV = [WIN.x + 152, WIN.y + 37];
  const PAL = i => [960 + (i - 2) * 132, 700], PALR = 44, PALS = [['ink', 'AZUL-NOITE', '#1B1F3B'], ['blue', 'AZUL RISO', '#0B8FE0'], ['green', 'VERDE-ÁGUA', '#12A180'], ['lime', 'LIMÃO', '#F5EE4A'], ['pink', 'ROSA FLÚOR', '#FF48B0']];
  const TOG = [gx(66), gy(866)];
  const AP = { x: 300, y: 96, w: 1320, h: 700, r: 26 }, FLOOR = 610, BX0 = 560, BX1 = 1380, BT0 = 18.32, BT1 = 19.32;
  const ITEMS = [['um', 'jogo.', 10.6], ['um', 'site.', 13.1], ['uma', 'marca.', 15.1], ['um', 'portfólio interativo.', 16.6], ['uma', 'animação.', 18.1]];
  function label3(t) {
    ITEMS.forEach((it, i) => { const nx = i + 1 < ITEMS.length ? ITEMS[i + 1][2] : 19.5; if (t < it[2] || t > nx + 0.4) return; reveal(lay('it' + i, [{ s: it[0], c: C.mute }, { s: it[1] }], 80), W / 2, 978, t - it[2], { align: 'center', stag: 0.07, out: nx - it[2] - 0.2 }); });
  }
  // o caminho da bola: [início, fim, de, para, altura do arco, raio inicial, raio final, curva]
  let B3 = null;
  function initB3() {
    // do prompt para a primeira plataforma do jogo, os quatro pulos da fase, e da bandeira para o favicon do site
    B3 = [[9.5, 10.9, [BAR.x + 62, 540], STAND(0), 430, 19, GR, E.lin], ...JUMP.map(([a, b, h], i) => [a, b, STAND(i), STAND(i + 1), h, GR, GR, E.lin]), [12.95, 13.35, STAND(4), FAV, 170, GR, 11, E.lin],
      [15.0, 15.38, FAV, PAL(1), 150, 11, PALR, E.lin], [16.5, 16.92, PAL(1), TOG, 190, PALR, 16, E.lin], [18.0, BT0, TOG, [BX0, 300], 120, 16, 34, E.lin]];
  }
  // o quique do exercício de animação: cai do alto e quica três vezes, cada vez mais baixo (y do centro da bola)
  const BOUNCE = [[0.22, 0, 1], [0.36, 190], [0.28, 110], [0.14, 50]];
  function bounceAt(u) {   // u em segundos desde BT0; devolve [y, tempo desde o último contato]
    const fl = FLOOR - 34; let t0 = 0;
    for (let i = 0; i < BOUNCE.length; i++) { const [d, h] = BOUNCE[i]; if (u < t0 + d || i === BOUNCE.length - 1) { const f = clamp((u - t0) / d); return i === 0 ? [lerp(300, fl, f * f), 9] : [fl - 4 * h * f * (1 - f), u - t0]; } t0 += BOUNCE[i][0]; }
    return [fl, 9];
  }
  function ball3(t) {
    if (t >= BT0) { const u = t - BT0, [y, e] = bounceAt(u), x = lerp(BX0, BX1, E.lin(seg(t, BT0, BT1))), land = t >= BT1 ? t - BT1 : e, bump = land < 0.3 ? Math.exp(-land * 16) * Math.cos(land * 26) : 0;
      return { x, y: t >= BT1 ? FLOOR - 34 + 6 * bump : y + 10 * bump, r: 34, sx: 1 + 0.3 * bump, sy: 1 - 0.3 * bump }; }
    let S = B3[0], e = 9; for (const s of B3) { if (t >= s[0]) S = s; if (s[4] > 0 && t >= s[1]) e = t - s[1]; }   // e = tempo desde o último pouso
    const u = seg(t, S[0], S[1]), f = S[7](u), r = lerp(S[5], S[6], E.io(u)), fly = S[4] > 0 && u > 0 && u < 1;
    const vy = fly ? Math.abs((S[3][1] - S[2][1]) - 4 * S[4] * (1 - 2 * u)) / (S[1] - S[0]) : 0, st = clamp(vy / 1700) * 0.16, bump = e < 0.35 ? Math.exp(-e * 15) * Math.cos(e * 24) : 0;
    const bob = 0;
    return { x: lerp(S[2][0], S[3][0], f), y: lerp(S[2][1], S[3][1], f) - 4 * S[4] * u * (1 - u) + r * 0.28 * bump + bob, r, sx: 1 + 0.24 * bump - st * 0.6, sy: 1 - 0.28 * bump + st };
  }
  // --- jogo (10,4–13), versão 5 (nota #35): um joguinho de plataforma feito só de formas da marca. A própria bola é a
  // heroína: pousa na primeira plataforma, pula de uma em uma pegando as moedas, pisa no bloquinho rosa e chega à bandeira.
  // Os pulos estão em B3 (initB3); aqui fica o cenário, que reage a eles.
  const GR = 18, PLAT = [{ x: 520, y: 604, w: 220, c: 'blue' }, { x: 770, y: 498, w: 170, c: 'pink' }, { x: 1010, y: 572, w: 170, c: 'green' }, { x: 1250, y: 452, w: 190, c: 'lime' }, { x: 1452, y: 566, w: 150, c: 'blue' }];
  const STAND = i => [PLAT[i].x, PLAT[i].y - GR], JUMP = [[11.05, 11.4, 150], [11.5, 11.85, 130], [11.95, 12.3, 190], [12.4, 12.72, 124]], TGOAL = 12.72, TSTOMP = 12.3;
  // as moedas ficam no alto de cada pulo; a bola pega no meio do arco
  const COIN = JUMP.map(([a, b, h], i) => { const p = STAND(i), q = STAND(i + 1); return { x: (p[0] + q[0]) / 2, y: (p[1] + q[1]) / 2 - h, t: (a + b) / 2 }; });
  function star(x, y, r, col) { g.fillStyle = col; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); }
  function game(t) {
    if (t < 10.4 || t >= 13.1) return;
    const on = spring(t - 10.4, 3.2, 0.62), crt = E.oExpo(seg(t, 10.52, 10.8)), out = E.iCubic(seg(t, 12.88, 13.08)), cx = GS.x + GS.w / 2, cy = GS.y + GS.h / 2;
    g.save(); g.globalAlpha = 1 - out; g.translate(cx, cy); g.scale(lerp(0.3, 1, clamp(on)) * (1 - 0.08 * out), lerp(0.3, 1, clamp(on)) * (1 - 0.08 * out)); g.translate(-cx, -cy);
    shadow(90, 40, 0.3); box(GS.x - 16, GS.y - 16, GS.w + 32, GS.h + 32, GS.r + 12, C.ink); noShadow();
    g.save(); g.beginPath(); g.roundRect(GS.x, GS.y, GS.w, GS.h, GS.r - 8); g.clip(); g.fillStyle = '#0D1030'; g.fillRect(GS.x, GS.y, GS.w, GS.h);
    const ch = GS.h * crt; g.beginPath(); g.rect(GS.x, cy - ch / 2, GS.w, ch); g.clip();   // liga como tela de tubo: uma faixa que abre
    // céu: degradê noturno, formas grandes da paleta flutuando devagar (paralaxe) e pontinhos piscando
    g.fillStyle = grd(0, GS.y, 0, GS.y + GS.h, ['#121640', '#1E2660', '#2A2F6E']); g.fillRect(GS.x, GS.y, GS.w, GS.h);
    [[560, 250, 150, C.pink, 0.16], [1180, 210, 210, C.blue, 0.2], [880, 700, 260, C.green, 0.16], [1420, 680, 170, C.lime, 0.12]].forEach(([x, y, r, c, a], i) => { g.save(); g.globalAlpha *= a; circ(x - (t - 10.4) * (14 + i * 6), y + Math.sin(t * 0.9 + i) * 8, r, c); g.restore(); });
    for (let i = 0; i < 26; i++) { const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (1.5 + rnd(i, 71) * 2) + i)); g.save(); g.globalAlpha *= 0.7 * tw; circ(GS.x + 30 + rnd(i, 72) * (GS.w - 60), GS.y + 40 + rnd(i, 73) * 360, 1.6 + rnd(i, 74) * 1.8, C.white); g.restore(); }
    // espinhos no fundo do poço
    for (let x = GS.x - 10; x < GS.x + GS.w + 30; x += 44) { g.fillStyle = grd(0, 712, 0, 760, [C.pink, hslK(C.pink, 0.7)]); poly([[x, 760], [x + 22, 712], [x + 44, 760]], true); g.fill(); }
    // plataformas: amassam um pouco quando a bola pousa
    PLAT.forEach((p, i) => {
      const tl = i === 0 ? 10.9 : JUMP[i - 1][1], e = t - tl, dip = e > 0 && e < 0.4 ? Math.exp(-e * 12) * Math.sin(e * 30) * 6 : 0;
      g.save(); g.translate(0, dip); shadow(24, 12, 0.35); g.fillStyle = grd(0, p.y, 0, p.y + 46, tones(p.c)); g.beginPath(); g.roundRect(p.x - p.w / 2, p.y, p.w, 46, 14); g.fill(); noShadow();
      box(p.x - p.w / 2 + 14, p.y + 7, p.w - 28, 5, 3, rgba(C.white, 0.4)); g.restore();
      // poeira do pouso
      if (e > 0 && e < 0.35) for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const q = e / 0.35; g.save(); g.globalAlpha *= 0.6 * (1 - q); circ(p.x + s * (14 + k * 12 + 60 * q), p.y - 6 - k * 3 - 14 * q, 5 - k, C.white); g.restore(); }
    });
    // a bandeira na última plataforma: sobe quando a bola chega
    const G4 = PLAT[4], fx = G4.x + 46, fu = E.oBack(seg(t, TGOAL, TGOAL + 0.25), 2); box(fx - 3, G4.y - 120, 6, 120, 3, C.white);
    g.fillStyle = C.lime; const fy = lerp(G4.y - 30, G4.y - 118, fu), wv = Math.sin(t * 9) * 5; poly([[fx + 3, fy], [fx + 58, fy + 14 + wv], [fx + 3, fy + 30]], true); g.fill();
    // o bloquinho rosa anda na plataforma limão até a bola cair em cima dele
    const P3 = PLAT[3], sq = E.oExpo(seg(t, TSTOMP - 0.02, TSTOMP + 0.08)), gone = seg(t, TSTOMP + 0.06, TSTOMP + 0.3);
    if (gone < 1) { const ex = P3.x + 58 * Math.sin((t - TSTOMP) * 3.6), eh = lerp(46, 10, sq), ew = lerp(50, 70, sq); g.save(); g.globalAlpha *= 1 - gone; g.fillStyle = grd(0, P3.y - eh, 0, P3.y, tones('pink')); g.beginPath(); g.roundRect(ex - ew / 2, P3.y - eh, ew, eh, 10); g.fill();
      if (sq < 0.5) { const lk = Math.cos((t - TSTOMP) * 3.6) > 0 ? 4 : -4; circ(ex - 10 + lk, P3.y - eh + 17, 6, C.white); circ(ex + 10 + lk, P3.y - eh + 17, 6, C.white); circ(ex - 9 + lk * 1.3, P3.y - eh + 18, 3, C.ink); circ(ex + 11 + lk * 1.3, P3.y - eh + 18, 3, C.ink); } g.restore(); }
    if (t > TSTOMP && t < TSTOMP + 0.4) { const q = seg(t, TSTOMP, TSTOMP + 0.4); for (let k = 0; k < 6; k++) { const a = -PI + k * PI / 5; g.save(); g.globalAlpha *= 1 - q; star(P3.x + Math.cos(a) * 70 * E.oExpo(q), P3.y - 14 + Math.sin(a) * 50 * E.oExpo(q), 9, C.lime); g.restore(); } }
    // moedas: giram e flutuam; somem num estalo quando a bola passa, com um "+1"
    let score = 0;
    COIN.forEach((c, i) => {
      const yb = c.y + Math.sin(t * 4 + i) * 6;
      if (t < c.t) { const sx = 0.25 + 0.75 * Math.abs(Math.cos(t * 5 + i * 0.8)); at(c.x, yb, sx, 1, 0, () => { circ(0, 0, 17, C.lime); circ(0, 0, 10, null, { stroke: hslK(C.lime, 0.7), lw: 4 }); }); }
      else { score++; const q = seg(t, c.t, c.t + 0.45); ring(t, c.t, c.x, yb, C.lime, 46, 0.35); if (q < 1) { g.save(); g.globalAlpha *= 1 - q; text('+1', c.x, yb - 30 - 40 * E.oExpo(q), 30, { w: 800, c: C.lime, align: 'center' }); g.restore(); } }
    });
    if (t >= TSTOMP) score++;
    // placar e fase
    star(GS.x + 52, GS.y + 50, 18, C.lime); text(String(score).padStart(2, '0'), GS.x + 82, GS.y + 62, 34, { fam: MONO, w: 700, c: C.white });
    text('FASE 1', GS.x + GS.w - 40, GS.y + 62, 26, { fam: MONO, w: 600, c: rgba(C.white, 0.7), align: 'right', ls: 2 });
    // notas #38 e #39: sem título no começo e sem "fase completa" no fim (tiravam o foco da bola)
    g.restore(); g.restore();
  }
  // --- site (13–15): o site do BASE8 de verdade, rolando dentro da janela; a bola é o favicon da aba
  function site(t) {
    if (t < 12.95 || t >= 15.0) return;
    const out = E.iCubic(seg(t, 14.78, 14.98)), un = E.oExpo(seg(t, 12.95, 13.4)), cx = WIN.x + WIN.w / 2, cy = WIN.y + WIN.h / 2, sc = lerp(1, 0.9, out), hh = lerp(BARH, WIN.h, un), VY = WIN.y + BARH, k = WIN.w / 1200, roll = E.io(seg(t, 13.4, 14.6));
    g.save(); g.globalAlpha = (1 - out) * clamp(seg(t, 12.95, 13.1)); g.translate(cx, cy + 40 * out); g.scale(sc, sc); g.translate(-cx, -cy);
    shadow(90, 40, 0.2 * un); box(WIN.x, WIN.y, WIN.w, hh, WIN.r, C.white); noShadow();
    g.save(); g.beginPath(); g.roundRect(WIN.x, WIN.y, WIN.w, hh, WIN.r); g.clip();
    if (IMG.site) { g.drawImage(IMG.site, WIN.x, VY - 640 * roll * k, WIN.w, IMG.site.naturalHeight * k); g.drawImage(IMG.siteTop, WIN.x, VY, WIN.w, IMG.siteTop.naturalHeight * k); }
    g.fillStyle = C.fog; g.fillRect(WIN.x, WIN.y, WIN.w, BARH); [C.pink, C.lime, C.green].forEach((c, i) => circ(WIN.x + 38 + i * 28, WIN.y + 32, 8.5, c));
    g.beginPath(); g.roundRect(WIN.x + 126, WIN.y + 10, 200, BARH - 10, [14, 14, 0, 0]); g.fillStyle = C.white; g.fill(); text('BASE8', FAV[0] + 24, WIN.y + 44, 19, { w: 700 });
    box(WIN.x + 360, WIN.y + 15, 520, 34, 17, C.white); text('base8.com', WIN.x + 384, WIN.y + 38, 16, { fam: MONO, w: 500, c: C.mute });
    box(WIN.x + WIN.w - 13, VY + 8 + (WIN.h - BARH - 196) * roll, 6, 180, 3, rgba(C.ink, 0.25));
    g.restore(); box(WIN.x, WIN.y, WIN.w, hh, WIN.r, null, { stroke: C.line, lw: 2 });
    g.restore();
  }
  // --- marca (15–16,5): a identidade do BASE8: a logo ilustrada montando, as guias e a paleta; a bola é o azul riso
  const SW0 = 15.26, SW1 = 15.86, SWD = 0.16;   // a caneta varre a logo de SW0 a SW1; a cor entra SWD depois
  function brand(t) {
    if (t < 15.0 || t >= 16.5) return; const out = E.iCubic(seg(t, 16.3, 16.48)), ga = E.oExpo(seg(t, 15.05, 15.45)), x0 = LG.cx - LG.w / 2, y0 = LG.cy - LG.h / 2;
    g.save(); g.globalAlpha = 1 - out; g.translate(0, 30 * out);
    g.save(); g.globalAlpha *= ga; g.strokeStyle = C.dim; g.lineWidth = 1.6; g.setLineDash([6, 8]);
    for (const yy of [y0, y0 + LG.h]) { g.beginPath(); g.moveTo(LG.cx - (LG.w / 2 + 80) * ga, yy); g.lineTo(LG.cx + (LG.w / 2 + 80) * ga, yy); g.stroke(); }
    for (const xx of [x0, x0 + LG.w]) { g.beginPath(); g.moveTo(xx, LG.cy - (LG.h / 2 + 50) * ga); g.lineTo(xx, LG.cy + (LG.h / 2 + 50) * ga); g.stroke(); }
    g.setLineDash([]); for (const a of [0, 1]) for (const b of [0, 1]) anchor(x0 + a * LG.w, y0 + b * LG.h, E.oBack(seg(t, 15.2 + (a + b) * 0.04, 15.4 + (a + b) * 0.04)));
    text(t < SW0 ? 'rascunho-logo-base8.jpg' : 'logo-base8.ai · contorno', x0, y0 - 66, 16, { fam: MONO, w: 500, c: C.mute }); text(Math.round(LG.w) + ' × ' + Math.round(LG.h), x0 + LG.w, y0 - 66, 16, { fam: MONO, w: 500, c: C.mute, align: 'right' });
    g.restore();
    // nota #40: o rascunho a lápis vira vetor. A caneta passa da esquerda para a direita traçando o contorno azul com as
    // âncoras (como no modo Contorno do Illustrator); logo atrás dela cada peça ganha a cor e o grafite some.
    const B = LGB, sw = lerp(B.x0 - 30, B.x1 + 30, E.io(seg(t, SW0, SW1))), ff = lerp(B.x0 - 30, B.x1 + 30, E.io(seg(t, SW0 + SWD, SW1 + SWD)));
    const ska = E.oCubic(seg(t, 15.02, 15.28));
    if (SKETCH && ska > 0 && ff < B.x1 + 30) { g.save(); g.beginPath(); g.rect(ff, 0, W, H); g.clip(); g.globalAlpha *= ska; g.drawImage(SKETCH, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0); g.restore(); }
    if (OUTL && t > SW0 && ff < B.x1 + 30) {
      g.save(); g.beginPath(); g.rect(ff - 40, 0, Math.max(0, sw - ff + 40), H); g.clip(); g.drawImage(OUTL, x0, y0, LG.w, LG.h); g.restore();
      for (const [ax, ay] of ANC) if (ax < sw && ax > ff - 40) anchor(ax, ay, 0.62 * E.oBack(clamp((sw - ax) / 40), 2), C.blue, 10);
    }
    for (const p of PIECES) { const f = E.oCubic(clamp((ff - (p.x - p.w * 0.3)) / 90)); if (f <= 0) continue; g.save(); g.globalAlpha *= f; g.translate(p.x, p.y); g.scale(lerp(0.94, 1, f), lerp(0.94, 1, f)); g.drawImage(p.c, -p.w / 2, -p.h / 2, p.w, p.h); g.restore(); }
    // a caneta (ferramenta Caneta) na frente do traço, com uma linha de varredura fina
    if (t > SW0 - 0.04 && t < SW1 + 0.06) {
      const pa = seg(t, SW0 - 0.04, SW0 + 0.04) * (1 - seg(t, SW1, SW1 + 0.06)), py = lerp(B.y0, B.y1, 0.5 + 0.4 * Math.sin((t - SW0) * 30));
      g.save(); g.globalAlpha *= pa; box(sw - 1, B.y0 - 24, 2, B.y1 - B.y0 + 48, 1, rgba(C.blue, 0.45));
      at(sw, py, 1, 1, -0.5, () => { shadow(14, 5, 0.25); g.fillStyle = C.ink; g.beginPath(); g.moveTo(0, 0); g.lineTo(-13, -30); g.lineTo(-9, -52); g.lineTo(9, -52); g.lineTo(13, -30); g.closePath(); g.fill(); noShadow(); g.lineWidth = 2.5; g.strokeStyle = C.white; g.stroke(); box(-11, -70, 22, 15, 3, C.ink, { stroke: C.white, lw: 2.5 }); circ(0, -26, 4, C.white); poly([[0, 0], [0, -22]]); g.stroke(); });
      g.restore();
    }
    PALS.forEach((s, i) => {
      const ap = E.oBack(seg(t, 15.8 + i * 0.05, 16.06 + i * 0.05), 1.5), [x, y] = PAL(i); if (ap <= 0) return;
      if (i !== 1) at(x, y, ap, ap, 0, () => { g.fillStyle = s[0] === 'ink' ? grd(-PALR, 0, PALR, 0, [C.ink, mix(C.ink, C.blue, 0.3)]) : grd(-PALR, 0, PALR, 0, [hslK(C[s[0]], 0.75), C[s[0]]]); g.beginPath(); g.arc(0, 0, PALR, 0, TAU); g.fill(); });
      g.save(); g.globalAlpha *= clamp(ap); text(s[1], x, y + PALR + 32, 14, { fam: MONO, w: 600, align: 'center', ls: 1.2 }); text(s[2], x, y + PALR + 54, 13, { fam: MONO, w: 500, c: C.mute, align: 'center' }); g.restore();
    });
    g.restore();
  }
  // --- portfólio (16,5–18): a mesa interativa do portfólio do Bruno; a bola aperta o botão e a mesa passa da noite para o dia.
  // Versão 5 (nota #36): depois, o cursor "você" pega o controle de videogame e arrasta pela mesa, para mostrar que os
  // objetos se mexem. O controle é recortado da foto do dia pela cor (cinza sobre madeira) e o buraco é coberto com madeira.
  const TCLK = 17.05, PFB = { x: 1330, y: 148, w: 240, h: 192 }, PFG = [1450, 238], TGRAB = 17.2, TDROP = 17.64, PFD = [-190, 96, -0.32];
  let PFS = null, PFP = null;
  function initPF(img) {
    const { x, y, w, h } = PFB, sp = mk(w, h), sx = sp.getContext('2d'); sx.drawImage(img, x, y, w, h, 0, 0, w, h);
    const im = sx.getImageData(0, 0, w, h), d = im.data;
    for (let i = 0; i < w * h; i++) { const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), sat = mx ? (mx - mn) / mx : 0; d[i * 4 + 3] = Math.round(255 * clamp((0.36 - sat) / 0.1)); }
    sx.putImageData(im, 0, 0); PFS = sp;
    // remendo: a faixa de madeira logo abaixo do controle (mesma luz), repetida e espelhada, recortada no formato do controle,
    // um pouco maior e com a borda esfumada (sombra desfocada, que funciona em qualquer navegador, em vez de filter)
    const pc = mk(w, h), px = pc.getContext('2d'), sh = 34, sy = y + h + 14;
    for (let k = 0; k * sh < h; k++) { px.save(); if (k % 2) { px.translate(0, (k + 1) * sh); px.scale(1, -1); px.drawImage(img, x, sy, w, sh, 0, 0, w, sh); } else px.drawImage(img, x, sy, w, sh, 0, k * sh, w, sh); px.restore(); }
    const mc = mk(w, h), mx2 = mc.getContext('2d'); mx2.shadowColor = '#000'; mx2.shadowBlur = 12; mx2.shadowOffsetX = 4000;
    for (const [dx, dy] of [[0, 0], [-6, 0], [6, 0], [0, -6], [0, 6], [-5, -5], [5, 5], [-5, 5], [5, -5]]) mx2.drawImage(sp, dx - 4000, dy);
    px.globalCompositeOperation = 'destination-in'; px.drawImage(mc, 0, 0); PFP = pc;
  }
  function portfolio(t) {
    if (t < 16.42 || t >= 18.0) return;
    const p = spring(t - 16.42, 3.0, 0.62), out = E.iCubic(seg(t, 17.82, 18.0)), cx = GS.x + GS.w / 2, cy = GS.y + GS.h / 2, sc = lerp(0.9, 1, clamp(p)) * (1 - 0.06 * out), day = E.io(seg(t, TCLK + 0.04, TCLK + 0.42)), z = 1 + 0.035 * seg(t, 16.42, 18.0);
    g.save(); g.globalAlpha = clamp(p * 2) * (1 - out); g.translate(cx, cy); g.scale(sc, sc); g.translate(-cx, -cy);
    shadow(90, 40, 0.28); box(GS.x, GS.y, GS.w, GS.h, GS.r, C.ink); noShadow();
    g.save(); g.beginPath(); g.roundRect(GS.x, GS.y, GS.w, GS.h, GS.r); g.clip();
    const dw = GS.w * z, dh = GS.h * z, ox = TOG[0] - (TOG[0] - GS.x) * z, oy = TOG[1] - (TOG[1] - GS.y) * z, k = dw / 1600;   // zoom lento ancorado no botão
    if (IMG.pf1) g.drawImage(IMG.pf1, ox, oy, dw, dh);
    if (IMG.pf2 && day > 0) { g.save(); g.beginPath(); g.arc(TOG[0], TOG[1], 1500 * day, 0, TAU); g.clip(); g.drawImage(IMG.pf2, ox, oy, dw, dh); g.restore(); }   // o dia se espalha a partir do clique
    // o arraste: o controle sobe (sombra maior), anda e gira um pouco seguindo o cursor, e assenta de novo
    if (PFS && t >= TGRAB) {
      const lift = E.oExpo(seg(t, TGRAB, TGRAB + 0.1)) * (1 - E.io(seg(t, TDROP, TDROP + 0.12))), mv = E.io(seg(t, TGRAB + 0.04, TDROP)), dx = PFD[0] * mv, dy = PFD[1] * mv;
      g.drawImage(PFP, ox + PFB.x * k, oy + PFB.y * k, PFB.w * k, PFB.h * k);
      at(ox + (PFG[0] + dx) * k, oy + (PFG[1] + dy) * k, k * (1 + 0.07 * lift), null, PFD[2] * mv, () => {
        g.shadowColor = 'rgba(20,10,0,0.55)'; g.shadowBlur = 14 + 40 * lift; g.shadowOffsetX = 6 + 16 * lift; g.shadowOffsetY = 10 + 26 * lift;
        g.drawImage(PFS, PFB.x - PFG[0], PFB.y - PFG[1]); noShadow(); g.shadowOffsetX = 0;
      });
    }
    g.restore(); g.restore();
  }
  // o cursor do arraste (desenhado por cima de tudo, fora do recorte da janela)
  function portfolioCursor(t) {
    if (t < 16.95 || t > 17.98) return;
    const z = 1 + 0.035 * seg(t, 16.42, 18.0), k = GS.w * z / 1600, ox = TOG[0] - (TOG[0] - GS.x) * z, oy = TOG[1] - (TOG[1] - GS.y) * z, mv = E.io(seg(t, TGRAB + 0.04, TDROP));
    const gx0 = ox + PFG[0] * k, gy0 = oy + PFG[1] * k, hx = gx0 + PFD[0] * mv * k, hy = gy0 + PFD[1] * mv * k;
    const c = t < TGRAB ? kf(t, [[16.95, 1700, 1140], [TGRAB, gx0, gy0, E.oExpo]]) : t < TDROP + 0.06 ? [hx, hy] : kf(t, [[TDROP + 0.06, hx, hy], [17.98, 2060, 1000, E.iCubic]]);
    ring(t, TGRAB, gx0, gy0, C.white, 70, 0.4);
    cursor(c[0], c[1], 'você', C.ink, { press: t > TGRAB && t < TDROP ? 0.6 : 0 });
  }
  // --- animação (18–19,5): o exercício clássico da bola quicando, com casca de cebola, caminho e linha do tempo; a bola é a própria bola
  function anim(t) {
    if (t < 17.95 || t >= 19.62) return;
    const p = spring(t - 17.95, 3.0, 0.62), out = E.iCubic(seg(t, 19.4, 19.6)), a = clamp(p * 2) * (1 - out);
    g.save(); g.globalAlpha = a; const cx = AP.x + AP.w / 2, cy = AP.y + AP.h / 2, sc = lerp(0.92, 1, clamp(p)); g.translate(cx, cy); g.scale(sc, sc); g.translate(-cx, -cy);
    shadow(80, 36, 0.16); box(AP.x, AP.y, AP.w, AP.h, AP.r, C.white); noShadow(); box(AP.x, AP.y, AP.w, AP.h, AP.r, null, { stroke: C.line, lw: 2 });
    // grade de fundo e chão
    g.strokeStyle = rgba(C.ink, 0.06); g.lineWidth = 1.5; for (let x = AP.x + 60; x < AP.x + AP.w; x += 60) { g.beginPath(); g.moveTo(x, AP.y + 20); g.lineTo(x, FLOOR); g.stroke(); } for (let y = FLOOR; y > AP.y + 20; y -= 60) { g.beginPath(); g.moveTo(AP.x + 20, y); g.lineTo(AP.x + AP.w - 20, y); g.stroke(); }
    box(AP.x + 40, FLOOR, AP.w - 80, 4, 2, C.ink);
    text('quique.anim', AP.x + 34, AP.y + 44, 18, { fam: MONO, w: 600 }); text('24 qps', AP.x + AP.w - 34, AP.y + 44, 18, { fam: MONO, w: 500, c: C.mute, align: 'right' });
    // caminho tracejado (o arco que a bola vai fazer)
    const pa = E.oExpo(seg(t, 18.1, 18.5)); g.save(); g.globalAlpha *= 0.55 * pa; g.strokeStyle = C.blue; g.lineWidth = 3; g.setLineDash([3, 12]); g.lineCap = 'round'; g.beginPath();
    for (let i = 0; i <= 120; i++) { const u = i / 120 * (BT1 - BT0), x = lerp(BX0, BX1, u / (BT1 - BT0)), y = bounceAt(u)[0]; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
    // casca de cebola: quadros anteriores, em rosa
    if (t > BT0) for (let k = 6; k >= 1; k--) { const tk = t - k * 0.06; if (tk < BT0) continue; const b = ball3(tk); g.save(); g.globalAlpha *= 0.4 * (1 - k / 7); circ(b.x, b.y, 34, null, { stroke: C.pink, lw: 3 }); g.restore(); }
    // linha do tempo: réguas, chaves nos contatos e nos picos, agulha
    const ty = AP.y + AP.h - 70, tx0 = AP.x + 80, tx1 = AP.x + AP.w - 80; box(AP.x + 20, ty - 46, AP.w - 40, 96, 18, C.fog);
    g.strokeStyle = C.dim; g.lineWidth = 2; g.beginPath(); for (let i = 0; i <= 24; i++) { const x = lerp(tx0, tx1, i / 24); g.moveTo(x, ty + 22); g.lineTo(x, ty + 22 - (i % 6 ? 8 : 16)); } g.stroke();
    let acc = 0; const keys = [0]; BOUNCE.forEach(([d, h], i) => { if (i) keys.push(acc + d / 2); acc += d; keys.push(acc); });
    keys.forEach((k, i) => { const x = lerp(tx0, tx1, k / (BT1 - BT0)), dp = E.oBack(seg(t, 18.15 + i * 0.03, 18.32 + i * 0.03)); at(x, ty - 10, dp, dp, PI / 4, () => box(-9, -9, 18, 18, 3, i % 2 ? C.pink : C.ink)); });
    const ph = lerp(tx0, tx1, seg(t, BT0, BT1)); box(ph - 2.5, ty - 40, 5, 66, 2.5, C.blue); circ(ph, ty - 40, 9, C.blue);
    text('f ' + String(Math.min(24, Math.round(seg(t, BT0, BT1) * 24))).padStart(2, '0'), AP.x + AP.w - 34, AP.y + 76, 18, { fam: MONO, w: 600, c: C.blue, align: 'right' });
    g.restore();
  }
  function s3(t) {
    studio(); label3(t); if (t < 10.9) burst2(t);
    game(t); site(t); brand(t); portfolio(t); anim(t);
    const b = ball3(t);
    if (t < 10.9) for (let k = 1; k <= 5; k++) { const p = ball3(Math.max(9.5, t - k * 0.035)); g.save(); g.globalAlpha = 0.5 - k * 0.09; circ(p.x, p.y, Math.min(p.r * 0.3, 5.5 - k * 0.6), C.blue); g.restore(); }   // rastro do pulo
    ring(t, TCLK, TOG[0], TOG[1], C.white, 90, 0.5);
    const pr = 1 - 0.2 * pressAt(t, [TCLK]);
    glow(b.x, b.y, b.r * 3.2, C.blue, 0.32 * clamp((b.r - 10) / 14)); ball8(b.x, b.y, b.r * pr, { sx: b.sx, sy: b.sy });
    portfolioCursor(t);
  }

  // ------------------------------------------------------------------ rajada (16,5–18 s): seis cortes de 0,25 s (os cartões estão em CARDS)
  function burst(t) {
    const k = Math.min(5, Math.floor((t - 16.5) / 0.25)), e = t - 16.5 - k * 0.25; CARDS[k].fn(e);
    if (t < 16.78) { // estilhaços do celular por cima do primeiro corte
      const d = t - 16.5; for (let i = 0; i < 18; i++) { const a = rnd(i, 31) * TAU, sp = 1300 + rnd(i, 32) * 2200, s = 34 + rnd(i, 33) * 80; at(960 + Math.cos(a) * sp * d, 455 + Math.sin(a) * sp * d + 900 * d * d, 1, 1, rnd(i, 34) * 6 + d * (rnd(i, 35) - 0.5) * 30, () => { g.fillStyle = [C.white, C.blue, C.white, C.pink, C.lime][i % 5]; poly([[-s / 2, s / 3], [s / 2, s / 2.4], [s * (rnd(i, 36) - 0.5), -s / 2]], true); g.fill(); }); }
    }
  }

  // ================================================================== CENA 4 · O acúmulo (18–25 s)
  // O mosaico segue a grade da trilha, 2 s depois da versão 2 (por isso zoomAt recebe t - SH4). A peça do centro é a bola.
  const SH4 = 2;
  function mosaic(t, pull) {
    const tq = Math.min(t, 21.5) - SH4, s = zoomAt(tq), T = 216 * s, nx = Math.ceil((W / 2 + T / 2) / T), ny = Math.ceil((H / 2 + T / 2) / T), fl = Math.floor((t < 24.5 ? tq : t - 5) * 4), dm = Math.max(nx, ny);
    for (let iy = -ny; iy <= ny; iy++) for (let ix = -nx; ix <= nx; ix++) {
      const d = Math.max(Math.abs(ix), Math.abs(iy)), p = E.oBack(seg(t, 18 + d * 0.045, 18.3 + d * 0.045), 1.25); if (p <= 0) continue;
      const k = pull ? pull(d, dm) : 0; if (k >= 1 || (pull && !d)) continue;   // pull: 0 = no lugar, 1 = engolida pelo centro
      let h = rnd(ix, iy, 1); if (rnd(ix, iy, fl + 50) < 0.08) h = rnd(ix, iy, fl + 9);
      let ci = h < 0.32 ? 0 : h < 0.58 ? 1 : h < 0.8 ? 2 : h < 0.87 ? 3 : h < 0.93 ? 4 : 5, ik = Math.floor(rnd(ix, iy, 2) * 16);
      if (!d) { ci = 0; ik = 2; }
      const P = TPAL[ci], cx = W / 2 + ix * T * (1 - k), cy = H / 2 + iy * T * (1 - k), sz = T * 0.93 * p * (1 - k);
      box(cx - sz / 2, cy - sz / 2, sz, sz, sz * 0.14, P.bg); icon(ik, cx, cy, sz * 0.62, P);
    }
  }
  const TXB = 'e a IA cuida dessa parte.', TB0 = 22.45, TBD = 0.037;
  function plate(t) {
    if (t < 19.0 || t >= 24.54) return;
    const size = 124, LA = lay('p4', [{ s: 'tudo' }, { s: 'isso' }, { s: 'é' }, { s: 'código.', c: C.lime }], size, 700);
    font(size, 700); const wB = g.measureText(TXB).width, big = E.oExpo(seg(t, 22.3, 22.56));
    const pw = lerp(LA.width, wB, big) + 160, ph = 240, sc = spring(t - 19.0, 3.4, 0.52) * (1 - E.iCubic(seg(t, 24.3, 24.54)));
    g.save(); g.translate(W / 2, 540); g.scale(sc, sc); g.translate(-W / 2, -540);
    shadow(90, 40, 0.4); box(W / 2 - pw / 2, 540 - ph / 2, pw, ph, 52, C.ink); noShadow();
    const by = 540 + size * 0.345;
    if (t < 22.3) {
      const sel = E.io(seg(t, 22.0, 22.22)); if (sel > 0) box(W / 2 + LA.width / 2 + 14 - (LA.width + 28) * sel, 540 - 84, (LA.width + 28) * sel, 168, 10, C.blue);
      reveal(LA, W / 2, by, t - 19.1, { align: 'center', stag: 0.07, dc: C.white });
    } else {
      const n = clamp(Math.floor((t - TB0) / TBD) + 1, 0, TXB.length), x0 = W / 2 - wB / 2; let x = x0;
      font(size, 700); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
      for (const [a, b, c] of [[0, 4, C.white], [4, 6, C.pink], [6, TXB.length, C.white]]) { const s = TXB.slice(a, Math.min(b, n)); if (n > a) { g.fillStyle = c; g.fillText(s, x, by); } x += g.measureText(TXB.slice(a, b)).width; }
      const done = n >= TXB.length, cx = x0 + g.measureText(TXB.slice(0, n)).width + (n === 0 ? 0 : 8);
      if (!done || Math.floor(t * 4) % 2 === 0) box(cx, 540 - 68, 9, 136, 4, C.pink);
    }
    g.restore();
  }
  const CUR4 = [[21.72, 2040, 250], [22.0, 0, 0, E.oExpo], [22.22, 0, 0, E.io], [22.4, 0, 0, E.io], [23.36, 0, 0, E.lin], [23.8, 0, 0], [24.2, 2100, 900, E.iCubic]];
  function s4(t) {
    fill(C.white); mosaic(t);
    const dim = 0.66 * seg(t, 21.5, 21.64) * (1 - seg(t, 24.44, 24.7)); if (dim > 0) fill(rgba(C.ink, dim));
    plate(t);
    if (t >= 21.5) {
      // "o vídeo pausou": o símbolo de pausa salta, a barra de player sobe. Aos 24,3 s alguém aperta o play e o filme respira.
      const up = E.oExpo(seg(t, 21.5, 21.82)) * (1 - E.iCubic(seg(t, 24.4, 24.62))), y = 1130 - 150 * up, pp = t - 21.5, kp = 1 - 0.12 * pressAt(t, [24.3]);
      if (pp < 0.75) { const s = E.oBack(seg(pp, 0, 0.2), 2) * (1 + 0.12 * seg(pp, 0.42, 0.75)); g.save(); g.globalAlpha = 1 - seg(pp, 0.42, 0.75); at(W / 2, 250, s, s, 0, () => { circ(0, 0, 66, C.white); box(-24, -27, 16, 54, 4, C.ink); box(8, -27, 16, 54, 4, C.ink); }); g.restore(); }
      shadow(40, 16, 0.4); box(W / 2 - 400, y - 38, 800, 76, 38, C.white); noShadow();
      at(W / 2 - 346, y, kp, kp, 0, () => { if (t < 24.3) { box(-14, -16, 10, 32, 3, C.ink); box(4, -16, 10, 32, 3, C.ink); } else { g.fillStyle = C.blue; poly([[-12, -17], [16, 0], [-12, 17]], true); g.fill(); } });
      text('0:24', W / 2 - 304, y + 8, 22, { fam: MONO, w: 600 }); text('0:38', W / 2 + 362, y + 8, 22, { fam: MONO, w: 600, c: C.mute, align: 'right' });
      box(W / 2 - 226, y - 4, 500, 8, 4, C.line); box(W / 2 - 226, y - 4, 316, 8, 4, C.blue); circ(W / 2 + 90, y, 12, C.blue);
      // o cursor da IA entra, seleciona a frase, apaga e escreve a dela
      font(124, 700); const LA = lay('p4', [], 124, 700), wB = g.measureText(TXB).width, K = CUR4.map(k => k.slice());
      K[1][1] = W / 2 + LA.width / 2 + 16; K[1][2] = 590; K[2][1] = W / 2 - LA.width / 2 - 10; K[2][2] = 596; K[3][1] = W / 2 - wB / 2 + 30; K[3][2] = 640; K[4][1] = W / 2 + wB / 2 + 40; K[4][2] = 640; K[5][1] = K[4][1]; K[5][2] = 640;
      if (t < 24.2) { const c = kf(t, K), wob = t > TB0 && t < 23.36 ? Math.sin(t * 60) * 3 : 0; cursor(c[0], c[1] + wob, 'IA', C.pink, { s: 1.5, press: t > 22.0 && t < 22.22 ? 0.7 : 0 }); }
    }
  }

  // ================================================================== CENA 5 · A resposta (28–31 s)
  // Tudo é engolido pela peça do centro, que é a bola. Ela cresce, gira e mostra o 8. A cada palavra (agora a cada 0,3 s,
  // sem travar) a bola gira para a cor seguinte do brandbook; na última chega a colorida.
  const BC = { x: W / 2, y: 380, R: 150 }, TS = [28.95, 29.25, 29.55, 29.85, 30.15], VAR = ['blue', 'green', 'lime', 'pink', 'pb', 'cor'], ROLL = 0.24;
  function ballState(t) {
    let i = 0; while (i < 5 && t >= TS[i] + ROLL) i++;
    if (i < 5 && t >= TS[i]) { const p = E.io(seg(t, TS[i], TS[i] + ROLL)); return { v: VAR[i], v2: VAR[i + 1], f: seg(p, 0.25, 0.75), th: p * PI, face: 1, p }; }
    return { v: VAR[i], face: t < 28.72 ? 0 : 1, th: -(PI / 2) * (1 - E.oCubic(seg(t, 28.72, 28.95))), p: 0 };
  }
  const say5 = (t, out) => { wordsAt(lay('p5a', [{ s: 'as' }, { s: 'opções' }, { s: 'são' }], 82), W / 2, 730, [TS[0], TS[1], TS[2]], t, out, 0.32); wordsAt(lay('p5b', [{ s: 'literalmente' }, { s: 'infinitas.', c: C.blue }], 82), W / 2, 852, [TS[3], TS[4]], t, out == null ? null : out + 0.04, 0.32); };
  function s5(t) {
    studio();
    if (t < 28.95) { fill(rgba(C.white, 1 - seg(t, 28.45, 28.95))); mosaic(t - 3, (d, dm) => E.io(clamp((t - 28.0 - (dm - d) * 0.015) / 0.55))); }
    const st = ballState(t), R = lerp(9, BC.R, spring(t - 28.3, 2.4, 0.66)) * (1 + 0.07 * Math.sin(PI * st.p)), y = lerp(H / 2, BC.y, E.io(seg(t, 28.3, 28.95)));
    orbits(t, BC.x, y, seg(t, 28.8, 29.4));
    const ga = 0.34 * seg(t, 28.4, 28.9); glow(BC.x, y, R * 2.6, BV[st.v].gl, ga * (1 - (st.f || 0))); if (st.v2) glow(BC.x, y, R * 2.6, BV[st.v2].gl, ga * st.f);
    if (st.v === 'cor' || st.v2 === 'cor') glow(BC.x - R * 0.5, y + R * 0.3, R * 2.4, C.blue, 0.2 * (st.v === 'cor' ? 1 : st.f));
    TS.forEach((ts, i) => ring(t, ts + 0.08, BC.x, y, BV[VAR[i + 1]].gl, R + 110, 0.5));
    [C.blue, C.pink, C.lime, C.green].forEach((c, j) => ring(t, 30.4 + j * 0.07, BC.x, y, c, R + 160 + j * 60, 0.75));
    ball8(BC.x, y, R, st);
    say5(t);
  }

  // ================================================================== CENA 6 · Assinatura (31–38 s)
  // A bola colorida recua, rola para a direita e para no lugar do 8; cada letra de BASE sobe quando ela passa. Embaixo, a
  // frase final com o ofício trocando (designer, músico, ilustrador, editor). Por fim o botão do site: a pessoa passa o
  // mouse, a tinta colorida se espalha, ela clica e o botão explode em formas e cores.
  const WM = { fs: 300, y: 478, ls: -0.02 }; let WMI = null;   // proporções da logo oficial (rodada 14): bola = 9/7 das maiúsculas, respiro de 1,5/7, tracking -20
  function initWM() {
    g.font = `600 ${WM.fs}px ${DISPLAY}`; g.letterSpacing = (WM.ls * WM.fs) + 'px'; const xs = [0]; for (const ch of 'BASE') xs.push(xs[xs.length - 1] + g.measureText(ch).width);
    const cap = g.measureText('B').actualBoundingBoxAscent || WM.fs * 0.7, R = cap * 9 / 14, gap = cap * 1.5 / 7, x0 = (W - (xs[4] + gap + R * 2)) / 2; g.letterSpacing = '0px';
    WMI = { xs, x0, R, cy: WM.y - cap / 2, xa: x0 - R - 40, xb: x0 + xs[4] + gap + R, tc: [] };
    WMI.bx = t => lerp(WMI.xa, WMI.xb, E.oBack(seg(t, 31.5, 32.3), 0.9));
    for (let i = 0; i < 4; i++) { const c = x0 + (xs[i] + xs[i + 1]) / 2; let tt = 31.5; while (tt < 32.3 && WMI.bx(tt) < c) tt += 1 / 240; WMI.tc.push(tt); }   // quando a bola passa por cada letra
  }
  // a frase final: o ofício (que troca) + o resto. Nada anda (nota #30): o resto fica num lugar fixo e o ofício encosta
  // nele pela direita; o conjunto é centralizado pelo ofício mais largo. A troca é a cada 0,5 s (nota #37).
  const NOUNS = ['designer', 'músico', 'ilustrador', 'editor'], NCOL = [C.blue, C.pink, C.green, C.blue], TAG0 = 32.45, NSTEP = 0.5, NSWAP = 0.22, TAGY = 690;
  const TAGR = [{ s: ', aprenda a criar com ', w: 500 }, { s: 'IA de código.', w: 700 }]; let TAG = null;
  function initTag() {
    let size = 74; const meas = sz => { font(sz, 600); const nw = NOUNS.map(n => g.measureText(n).width); let rw = 0; const rs = TAGR.map(r => { font(sz, r.w); const w = g.measureText(r.s).width; rw += w; return w; }); return { nw, rw, rs }; };
    let M = meas(size); const mx = Math.max(...M.nw) + M.rw; if (mx > 1680) { size = Math.floor(size * 1680 / mx); M = meas(size); }
    TAG = { size, ...M };
  }
  function tagline(t) {
    if (t < TAG0) return; const sz = TAG.size, rise = (1 - E.oExpo(seg(t, TAG0, TAG0 + 0.55))) * sz * 1.2;
    const k = Math.floor((t - TAG0) / NSTEP), sw = k > 0 ? E.io(seg(t, TAG0 + k * NSTEP, TAG0 + k * NSTEP + NSWAP)) : 1, cur = k % 4, prev = (k + 3) % 4;
    const px = (W - Math.max(...TAG.nw) - TAG.rw) / 2 + Math.max(...TAG.nw);
    g.save(); g.beginPath(); g.rect(0, TAGY - sz * 1.05, W, sz * 1.42); g.clip(); g.textBaseline = 'alphabetic';
    font(sz, 600); g.textAlign = 'right';
    if (k > 0 && sw < 1) { g.fillStyle = NCOL[prev]; g.fillText(NOUNS[prev], px, TAGY + rise - sw * sz * 1.3); }
    g.fillStyle = NCOL[cur]; g.fillText(NOUNS[cur], px, TAGY + rise + (k > 0 ? (1 - sw) * sz * 1.3 : 0));
    g.textAlign = 'left'; let x = px; TAGR.forEach((r, i) => { font(sz, r.w); g.fillStyle = C.ink; g.fillText(r.s, x, TAGY + rise); x += TAG.rs[i]; });
    g.restore();
  }
  // o botão do site (primário): pílula azul-noite; no hover a tinta colorida se espalha e o texto fica escuro.
  // Versão 5 (nota #31): a tinta é um degradê que se mistura (manchas de borda macia, sem faixas). As manchas são degradês
  // radiais, não um blur por filter, para ficar igual no preview e no render.
  const BTN = { x: W / 2, y: 840, w: 470, h: 110 }, TB = 33.3, THV = 35.15, TCK = 35.9;
  const INK = [{ c: C.lime, f: -0.06, dy: -0.3, d: 3.2, s: 1 }, { c: C.pink, f: 0.26, dy: 0.4, d: 4.4, s: -1 }, { c: C.blue, f: 0.56, dy: -0.35, d: 3.8, s: 1 }, { c: C.green, f: 0.9, dy: 0.3, d: 5, s: -1 }];
  function blob(x, y, r, col, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(0.45, rgba(col, a * 0.8)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function button(t, gone = 0) {
    if (t < TB || gone >= 1) return;
    const hv = E.oCubic(seg(t, THV, THV + 0.55)), s = spring(t - TB, 3.6, 0.5) * (1 - 0.07 * pressAt(t, [TCK])) * (1 + 0.04 * hv) * (1 - gone), { w, h } = BTN;
    at(BTN.x, BTN.y, s, s, 0, () => {
      shadow(50, 22, 0.28 * (1 - hv * 0.4)); box(-w / 2, -h / 2, w, h, h / 2, C.ink); noShadow();
      if (hv > 0) { g.save(); g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, h / 2); g.clip();
        // fundo já misturado (as quatro cores em degradê) e, por cima, as manchas girando devagar, que se fundem umas nas outras
        g.globalAlpha = hv; g.fillStyle = grd(-w / 2, 0, w / 2, 0, [C.lime, C.pink, C.blue, C.green]); g.fillRect(-w / 2, -h / 2, w, h);
        INK.forEach((b, i) => { const sc = clamp(hv * 1.25 - i * 0.08), a = b.s * TAU * (t - THV) / b.d, bx = -w / 2 + b.f * w + Math.cos(a) * 26, by = b.dy * h * 0.5 + Math.sin(a) * 20; blob(bx, by, 150 * (0.4 + 0.6 * sc), b.c, 0.95); });
        g.restore(); }
      const tc = mix(C.white, C.ink, hv); text('base8.com', -22, 18, 50, { w: 600, c: tc, align: 'center' });
      g.strokeStyle = hv > 0.5 ? C.ink : C.lime; g.lineWidth = 6; g.lineCap = g.lineJoin = 'round'; const ax = 132 + 10 * hv; poly([[ax, 0], [ax + 38, 0]]); g.stroke(); poly([[ax + 25, -13], [ax + 38, 0], [ax + 25, 13]]); g.stroke();
    });
  }
  // Versão 5 (nota #32): o clique solta anéis de cor que varrem a tela a partir do botão e devolvem o branco. Sem confetes:
  // dentro do branco que volta só fica a logo BASE8, que depois desce para o centro da tela.
  const TBOOM = TCK + 0.04, rrB = (t, i) => 2300 * E.oExpo(seg(t - TBOOM, i * 0.08, i * 0.08 + 0.8));
  function boom(t) {
    if (t < TBOOM) return; const cx = BTN.x, cy = BTN.y;
    [C.pink, C.blue, C.lime, C.green].forEach((c, i) => { const r0 = rrB(t, i), r1 = rrB(t, i === 3 ? 4 : i + 1); if (r0 - r1 < 0.5) return; const gr = g.createRadialGradient(cx, cy, r1, cx, cy, r0 + 1); gr.addColorStop(0, hslK(c, 0.8)); gr.addColorStop(0.5, c); gr.addColorStop(1, mix(c, C.white, 0.3)); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r0, 0, TAU); g.arc(cx, cy, r1, 0, TAU, true); g.fill(); });
  }
  // a logo: BASE sobe letra a letra quando a bola passa; dy desce tudo para o centro no fim
  function wordmark(t, dy) {
    const M = WMI;
    g.save(); g.translate(0, dy); g.beginPath(); g.rect(M.x0 - 40, WM.y - WM.fs * 0.82, M.xs[4] + 80, WM.fs * 0.9); g.clip();
    g.font = `600 ${WM.fs}px ${DISPLAY}`; g.letterSpacing = (WM.ls * WM.fs) + 'px'; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = C.ink;
    'BASE'.split('').forEach((ch, i) => { const e = t - M.tc[i]; if (e >= 0) g.fillText(ch, M.x0 + M.xs[i], WM.y + (1 - E.oExpo(clamp(e / 0.5))) * WM.fs * 0.8); });
    g.restore(); g.letterSpacing = '0px';
  }
  const CUR6 = [[34.55, 1760, 1180], [35.15, BTN.x + 70, BTN.y + 22, E.oExpo], [35.9, BTN.x + 64, BTN.y + 18, E.io], [36.6, 2080, 1060, E.iCubic]];
  function s6(t) {
    const M = WMI, mv = E.io(seg(t, 31.0, 31.46)), x = t < 31.5 ? lerp(BC.x, M.xa, mv) : M.bx(t), R = lerp(BC.R, M.R, mv), rot = t < 31.5 ? lerp(0, (M.xa - M.xb) / M.R, mv) : (x - M.xb) / M.R;
    // nota #42: sem movimento de fecho. O branco que volta no clique já mostra a logo parada no centro da tela, e ela fica
    // assim até o fim (para dar para ler quando o vídeo para no último quadro).
    const DYC = H / 2 - M.cy;
    const logo = (dy = 0) => {
      const y = lerp(BC.y, M.cy, mv) + dy;
      wordmark(t, dy);
      const land = t - 32.3; if (land > 0 && land < 0.6) for (const [c, j] of [[C.pink, 0], [C.blue, 1]]) ring(t, 32.3 + j * 0.07, M.xb, M.cy, c, M.R + 70 + j * 40, 0.5);
      glow(x + R * 0.2, y - R * 0.2, R * 2.3, C.pink, 0.16); glow(x - R * 0.3, y + R * 0.2, R * 2.2, C.blue, 0.16);
      ball8(x, y, R, { v: 'cor', face: 1, rot });
    };
    studio(); say5(t, 31.0); logo(); tagline(t); button(t);
    if (t > 34.55 && t < 36.6) { const c = kf(t, CUR6); cursor(c[0], c[1], 'você', C.ink, { press: pressAt(t, [TCK]) }); }
    boom(t);
    // o branco que volta no meio dos anéis já é o fim: só a logo
    const hole = rrB(t, 4); if (hole > 0) { g.save(); g.beginPath(); g.arc(BTN.x, BTN.y, hole, 0, TAU); g.clip(); studio(); logo(DYC); g.restore(); }
  }

  // ------------------------------------------------------------------ legendas de canto (como um visor): somem na explosão de cores, no acúmulo e no fim
  function hud(t) {
    let a = 0.9 * seg(t, 0.5, 0.9), col = C.mute, idx = 1, name = '';
    for (let i = 0; i < 6; i++) if (t >= window.VH_SCENES[i].t0) { idx = i + 1; name = window.VH_SCENES[i].name; }
    if (t >= 9.5 && t < 10.4) a *= 1 - Math.sin(PI * seg(t, 9.5, 10.4));
    if (t >= 19.5 && t < 21) { const k = Math.min(5, Math.floor((t - 19.5) / 0.25)); name = CARDS[k].name; col = CARDS[k].hud; a = 0.85; }
    if (t >= 21 && t < 28.6) a = 0; else if (t >= 28.6) a = 0.9 * seg(t, 28.6, 29.0) * (1 - seg(t, 33.0, 33.4));
    if (a <= 0) return;
    g.save(); g.globalAlpha = a; const m = 44, o = { fam: MONO, w: 500, c: col, ls: 1.6 };
    text('BASE8 — MANIFESTO', m + 22, m + 22, 16, o); text(`0${idx} / 06`, W - m - 22, m + 22, 16, { ...o, align: 'right' });
    text(name.toUpperCase(), m + 22, H - m - 11, 16, o); text(`F ${String(Math.round(t * FPS)).padStart(4, '0')} · ${FPS} QPS`, W - m - 22, H - m - 11, 16, { ...o, align: 'right' });
    g.strokeStyle = col; g.lineWidth = 2; for (const [x, y, dx, dy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { g.beginPath(); g.moveTo(x + 12 * dx, y); g.lineTo(x, y); g.lineTo(x, y + 12 * dy); g.stroke(); }
    g.restore();
  }

  // ------------------------------------------------------------------ quadro
  // A rajada e o acúmulo são os mesmos da versão 3, 3 s mais tarde (por isso recebem t - 3).
  function frame(t) {
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.setLineDash([]); noShadow(); g.filter = 'none';
    if (t < 5) s1(t); else if (t < 10.5) s2(t); else if (t < 19.5) s3(t); else if (t < 21) burst(t - 3); else if (t < 28) s4(t - 3); else if (t < 31) s5(t); else s6(t);
  }
  // borrão de movimento: nos trechos rápidos, média de subquadros dentro do próprio quadro (nunca atravessa um corte)
  const FAST = [[1.0, 3.5, 3], [7.3, 8.1, 6], [9.36, 10.2, 5], [10.4, 10.9, 4], [12.95, 13.4, 4], [15.0, 15.4, 4], [16.5, 16.95, 4], [18.0, 19.35, 4], [19.5, 21.0, 3], [21.0, 24.5, 3], [28.0, 28.95, 5], [31.0, 32.35, 5], [35.95, 36.8, 4]];
  window.renderOut = function (t) {
    t = clamp(+t || 0, 0, DUR - 1 / FPS / 2);
    let n = 1; if (window.VH_BLUR !== false) for (const f of FAST) if (t >= f[0] && t < f[1]) n = f[2];
    if (n === 1) { g = MAIN; frame(t); }
    else for (let k = 0; k < n; k++) { g = TMP; frame(t + k / n * 0.8 / FPS); MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = 1 / (k + 1); MAIN.drawImage(TMPC, 0, 0); }
    g = MAIN; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; grain(t); hud(t);
  };

  const loadImage = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('não carregou: ' + src)); i.src = src; });
  (async () => {
    const fonts = [new FontFace('Figtree', 'url(assets/fonts/Figtree-VariableFont_wght.ttf)', { weight: '300 900' }), new FontFace('Geist Mono', 'url(assets/fonts/geist-mono-latin.woff2)', { weight: '100 900' }), new FontFace('Instrument Sans', 'url(assets/fonts/InstrumentSans-SemiBold.ttf)', { weight: '600' }), new FontFace('PixelSerif', 'url(assets/fonts/PixelSerif_16px_v02.ttf)', { weight: '400' })];
    for (const f of fonts) { await f.load(); document.fonts.add(f); }
    await document.fonts.ready;
    // imagens reais: o site do BASE8, a mesa do portfólio (noite e dia), a bola 8 colorida da IDV (rodada 14) e os objetos da logo
    const T = { site: 'telas/site.jpg', siteTop: 'telas/site-topo.jpg', pf1: 'telas/portfolio-1.jpg', pf2: 'telas/portfolio-2.jpg', bola8: 'idv/bola8.png' };
    await Promise.all(Object.keys(T).map(async k => { IMG[k] = await loadImage('assets/' + T[k]); }));
    for (let i = 1; i <= 16; i++) OBJ.push(await loadImage(`assets/objetos/o${String(i).padStart(2, '0')}.png`));
    initS1(); initS2(); initB3(); initWM(); initTag(); initPF(IMG.pf2); initSketch(await loadImage('assets/idv/rascunho-logo-base8.jpg')); initLogo(await loadImage('assets/logo-base8.png'));
    window.renderOut(0);
    window.READY = true;
  })().catch(e => { window.VH_LOAD_ERROR = String(e && e.stack || e); console.error('film.js não carregou:', window.VH_LOAD_ERROR); });
})();
