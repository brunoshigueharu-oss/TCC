// Motor de motion do BASE8: tudo o que se repete de um filme para o outro (paleta, curvas, texto que sobe, cursor
// com nome, alças de vetor, flor de 8 pétalas, personagem, logo em peças, legendas de visor, borrão de movimento).
// Tirado do manifesto (Videos/films/base8-manifesto/film.js), que é o exemplo completo.
//
// Uso (film.js):
//   const { C, E, seg, spring, box, text, reveal, lay, cursor } = B8;
//   B8.start({ dur: 8, title: 'BASE8 — VINHETA', scenes: [{ name: 'Abertura', t0: 0, t1: 4, draw(t, g) { ... } }], fast: [[3.9, 4.3, 5]] });
//
// O motor define window.renderOut(t), window.READY e window.VH_SCENES (contrato do VideoHub).
// Regra de ouro: o quadro é função pura de t. Nada de Date.now(), Math.random() ou estado entre quadros; para
// aleatoriedade use rnd(a, b, c) e vn(x, semente).
window.B8 = (function () {
  'use strict';
  const cv = document.getElementById('c'), W = cv.width, H = cv.height, MAIN = cv.getContext('2d');
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const TMPC = mk(W, H), TMP = TMPC.getContext('2d');
  let g = MAIN, FPS = 60;

  // ------------------------------------------------------------------ paleta e tipos da marca
  const C = {
    white: '#FFFFFF', ink: '#1B1F3B', blue: '#0B8FE0', pink: '#FF48B0', green: '#12A180', lime: '#F5EE4A',
    fog: '#EEF0F5', line: '#D5D9E3', dim: '#B7BCCB', mute: '#8A90A6', floor: '#DFE3EA', key: '#2E3355',
  };
  const SANS = 'Figtree, system-ui, sans-serif', MONO = '"Geist Mono", ui-monospace, monospace';
  const PI = Math.PI, TAU = PI * 2;

  // ------------------------------------------------------------------ matemática e curvas
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, f) => a + (b - a) * f;
  const seg = (t, a, b) => clamp((t - a) / (b - a));           // 0 → 1 entre os tempos a e b
  const E = {
    lin: x => x,
    oExpo: x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x),   // entrada padrão: chega rápido e pousa
    oCubic: x => 1 - Math.pow(1 - x, 3),
    iCubic: x => x * x * x,                                         // saída padrão: sai acelerando
    io: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    oBack: (x, s = 1.70158) => x <= 0 ? 0 : x >= 1 ? 1 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),   // estalo com passada
  };
  // mola amortecida de 0 a 1: x em segundos desde o início, f em Hz, z = amortecimento (0,45 quica; 0,7 quase não passa)
  const spring = (x, f = 4.5, z = 0.45) => { if (x <= 0) return 0; const w = TAU * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + z * w / wd * Math.sin(wd * x)); };
  function hash(n) { n = Math.imul(n ^ 0x9E3779B9, 0x85EBCA6B); n ^= n >>> 13; n = Math.imul(n, 0xC2B2AE35); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
  const rnd = (a, b = 0, c = 0) => hash(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663) ^ Math.imul(c | 0, 83492791));   // 0..1, sempre igual para os mesmos números
  function vn(x, s = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + s * 7919), hash(i + 1 + s * 7919), u); }   // ruído suave
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, f) => { const A = hex(a), B = hex(b); f = clamp(f); return `rgb(${Math.round(lerp(A[0], B[0], f))},${Math.round(lerp(A[1], B[1], f))},${Math.round(lerp(A[2], B[2], f))})`; };
  const rgba = (h, a) => { const A = hex(h); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; };
  // quadros-chave [t, x, y, curva]: a curva vale para o trecho que termina naquele quadro. Repita um quadro para segurar.
  function kf(t, K) {
    if (t <= K[0][0]) return [K[0][1], K[0][2]];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const a = K[i - 1], b = K[i], f = (b[3] || E.io)(seg(t, a[0], b[0])); return [lerp(a[1], b[1], f), lerp(a[2], b[2], f)]; }
    const z = K[K.length - 1]; return [z[1], z[2]];
  }
  const pressAt = (t, list) => { let m = 0; for (const c of list) m = Math.max(m, 1 - Math.abs(t - c) / 0.08); return Math.max(0, m); };   // 0..1 em volta de cada clique
  const mrect = (a, b, p) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p), r: lerp(a.r, b.r, p) });   // uma forma vira a outra

  // ------------------------------------------------------------------ desenho básico
  function box(x, y, w, h, r, fillc, o) {
    if (w <= 0 || h <= 0) return;
    g.beginPath(); g.roundRect(x, y, w, h, Math.max(0, Math.min(r || 0, w / 2, h / 2)));
    if (fillc) { g.fillStyle = fillc; g.fill(); }
    if (o && o.stroke) { g.lineWidth = o.lw || 2; g.strokeStyle = o.stroke; g.stroke(); }
  }
  const rbox = (R, fillc, o) => box(R.x, R.y, R.w, R.h, R.r, fillc, o);
  function circ(x, y, r, fillc, o) {
    if (r <= 0) return;
    g.beginPath(); g.arc(x, y, r, 0, TAU);
    if (fillc) { g.fillStyle = fillc; g.fill(); }
    if (o && o.stroke) { g.lineWidth = o.lw || 2; g.strokeStyle = o.stroke; g.stroke(); }
  }
  function at(x, y, sx, sy, rot, fn) { g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(sx, sy == null ? sx : sy); fn(); g.restore(); }
  const shadow = (blur, oy, a) => { g.shadowColor = rgba(C.ink, a); g.shadowBlur = blur; g.shadowOffsetY = oy; };
  const noShadow = () => { g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0; };
  const fill = c => { g.fillStyle = c; g.fillRect(0, 0, W, H); };
  function poly(pts, close) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); if (close) g.closePath(); }
  // fundo de estúdio: branco puro em cima, chão frio embaixo (o Bruno não gosta de branco cremoso)
  let STUDIO = null;
  function studio() {
    if (!STUDIO) { STUDIO = mk(W, H); const x = STUDIO.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, C.white); gr.addColorStop(0.6, C.white); gr.addColorStop(1, C.floor); x.fillStyle = gr; x.fillRect(0, 0, W, H); }
    g.drawImage(STUDIO, 0, 0);
  }

  // ------------------------------------------------------------------ texto
  function font(size, weight = 600, fam = SANS) { g.font = `${weight} ${size}px ${fam}`; g.letterSpacing = (fam === SANS ? -0.022 * size : 0).toFixed(2) + 'px'; }
  // o = { w: peso, fam, c: cor, align, base, ls: espaçamento em px }
  function text(str, x, y, size, o = {}) { font(size, o.w, o.fam); if (o.ls != null) g.letterSpacing = o.ls + 'px'; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic'; g.fillStyle = o.c || C.ink; g.fillText(str, x, y); }
  const measure = (str, size, weight, fam) => { font(size, weight, fam); return g.measureText(str).width; };
  const LAY = new Map();
  // mede a frase palavra por palavra (uma vez só, guardada pela chave). parts = [{ s: 'palavra', c: cor, w: peso }]
  function lay(key, parts, size, weight = 600) {
    if (LAY.has(key)) return LAY.get(key);
    font(size, weight); const sp = g.measureText(' ').width; let x = 0; const items = [];
    for (const p of parts) { font(size, p.w || weight); const w = g.measureText(p.s).width; items.push({ s: p.s, x, w, c: p.c, wt: p.w || weight }); x += w + sp; }
    const L = { items, width: x - sp, size }; LAY.set(key, L); return L;
  }
  // a frase da casa: cada palavra sobe de baixo de uma máscara. t = segundos desde o início da frase.
  // o = { align: 'center', stag: atraso entre palavras, out: quando sai (para cima), dc: cor padrão (use branco em fundo escuro), c: cor de tudo }
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
  // digitação: tempos de cada letra (com um tremor fixo, para parecer mão) e quantas já saíram no tempo t
  const typeTimes = (n, t0, per = 0.041, seed = 7) => Array.from({ length: n }, (_, i) => t0 + i * per + (rnd(i, seed) - 0.5) * per * 0.5);
  const typedAt = (times, t) => { let n = 0; while (n < times.length && times[n] <= t) n++; return n; };
  const blinkOn = t => Math.floor(t * 4) % 2 === 0;   // cursor de texto piscando na colcheia de 120 BPM

  // ------------------------------------------------------------------ cursor com nome, clique, alças de vetor
  // o = { press: 0..1, s: escala, tc: cor do texto, lag }. "você" em azul-noite; "IA" em rosa.
  function cursor(x, y, label, color, o = {}) {
    const s = 1.3 * (o.s || 1) * (1 - 0.14 * (o.press || 0));
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.lineTo(8, 23.2); g.lineTo(13.6, 35.6); g.lineTo(19.2, 33); g.lineTo(13.7, 21); g.lineTo(24, 21); g.closePath();
    shadow(14, 5, 0.28); g.fillStyle = color; g.fill(); noShadow(); g.lineWidth = 2.6; g.lineJoin = 'round'; g.strokeStyle = C.white; g.stroke();
    if (label) { font(19, 700); const w = g.measureText(label).width + 24, lx = 20 + (o.lag || 0), ly = 34; shadow(14, 5, 0.2); box(lx, ly, w, 33, 11, color); noShadow(); text(label, lx + 12, ly + 23, 19, { w: 700, c: o.tc || C.white }); }
    g.restore();
  }
  // anel que se abre num clique ou num estalo (tc = quando)
  function ring(t, tc, x, y, col, R = 56, dur = 0.45) {
    const e = t - tc; if (e < 0 || e > dur) return; const p = E.oExpo(e / dur);
    g.save(); g.globalAlpha = 1 - p; g.lineWidth = lerp(7, 1, p); g.strokeStyle = col; g.beginPath(); g.arc(x, y, lerp(6, R, p), 0, TAU); g.stroke(); g.restore();
  }
  // âncora de vetor (quadradinho branco); s = escala da entrada
  function anchor(x, y, s, col = C.ink, sz = 13) { if (s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = C.white; g.fillRect(-sz / 2, -sz / 2, sz, sz); g.lineWidth = 2.5; g.strokeStyle = col; g.strokeRect(-sz / 2, -sz / 2, sz, sz); g.restore(); }
  // caixa de seleção com 8 âncoras em volta de uma área
  function selection(B, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = C.ink; g.lineWidth = 2; g.strokeRect(B.x, B.y, B.w, B.h); for (const i of [0, 0.5, 1]) for (const j of [0, 0.5, 1]) if (i !== 0.5 || j !== 0.5) anchor(B.x + B.w * i, B.y + B.h * j, 1); g.restore(); }

  // ------------------------------------------------------------------ figuras da casa
  // flor de 8 pétalas (o "símbolo" genérico; 8 sutil). k = 0 é um círculo, k = 1 é a flor aberta.
  function flower(x, y, R, k, rot, col, center = 0.27, ccol = C.white) {
    if (R <= 0) return; k = clamp(k, 0, 1.3);
    const rp = lerp(R, R * 0.36, k), d = lerp(0, R * 0.66, k);
    g.fillStyle = col; g.beginPath();
    for (let i = 0; i < 8; i++) { const a = rot + i * PI / 4, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; g.moveTo(px + rp, py); g.arc(px, py, rp, 0, TAU); }
    g.moveTo(x + R * 0.62, y); g.arc(x, y, R * 0.62, 0, TAU); g.fill();
    if (center > 0) circ(x, y, R * center, ccol);
  }
  // personagem: quadrado arredondado com dois olhos; (x, y) = pés. o = { c, look: -1..1, blink, eyes: 0..1, r }
  function hero(x, y, size, sx, sy, o = {}) {
    g.save(); g.translate(x, y); g.scale(sx, sy);
    box(-size / 2, -size, size, size, size * (o.r == null ? 0.26 : o.r), o.c || C.blue);
    const ea = o.eyes == null ? 1 : o.eyes;
    if (ea > 0) { const ey = -size * 0.58, ex = size * 0.19, look = (o.look || 0) * size * 0.07, bl = o.blink ? 0.12 : 1; for (const d of [-1, 1]) { g.save(); g.translate(d * ex + look, ey); g.scale(ea, ea * bl); circ(0, 0, size * 0.115, C.white); circ(look * 0.5, 0, size * 0.055, C.ink); g.restore(); } }
    g.restore();
  }
  // "foto" de marcador de imagem (sol e montanhas). p = { sky, sun, m1, m2 }
  function picture(x, y, w, h, r, p) {
    g.save(); g.beginPath(); g.roundRect(x, y, w, h, r); g.clip();
    g.fillStyle = p.sky; g.fillRect(x, y, w, h); circ(x + w * 0.7, y + h * 0.3, Math.min(w, h) * 0.13, p.sun);
    g.fillStyle = p.m1; poly([[x - w * 0.1, y + h], [x + w * 0.3, y + h * 0.45], [x + w * 0.72, y + h]], true); g.fill();
    g.fillStyle = p.m2; poly([[x + w * 0.3, y + h], [x + w * 0.68, y + h * 0.62], [x + w * 1.1, y + h]], true); g.fill();
    g.restore();
  }
  // o 8 em laço contínuo (nunca o símbolo ∞ deitado): v de 0 a 1 dá a volta; laço de cima menor
  function eight(v, EA = 424, EB = 250) { const ph = TAU * v, s = Math.sin(ph), c = Math.cos(ph), d = 1 + s * s; let x = EA * s * c / d, y = -EB * c / d; if (y < 0) { x *= 0.86; y *= 0.86; } return [x, y]; }
  function draw8(cx, cy, sc, lw, col, v0 = 0, v1 = 1) { g.strokeStyle = col; g.lineWidth = lw; g.lineCap = g.lineJoin = 'round'; g.beginPath(); const n = Math.max(8, Math.ceil(240 * Math.abs(v1 - v0))); for (let i = 0; i <= n; i++) { const p = eight(lerp(v0, v1, i / n)); i ? g.lineTo(cx + p[0] * sc, cy + p[1] * sc) : g.moveTo(cx + p[0] * sc, cy + p[1] * sc); } g.stroke(); }

  // ------------------------------------------------------------------ logo BASE8 em peças (cada objeto entra sozinho)
  const logo = {
    pieces: [], box8: null, rect: null,
    // place = { w: largura na tela, cx, cy }. Carregue no init do filme: await B8.logo.load('assets/logo-base8.png', { w: 1000, cx: 960, cy: 392 })
    async load(src, place) {
      const img = await loadImage(src), w = img.naturalWidth, h = img.naturalHeight, c = mk(w, h), x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, w, h).data, lab = new Int32Array(w * h), stack = new Int32Array(w * h), comps = [null];
      for (let p0 = 0; p0 < w * h; p0++) {   // componentes conexos do canal alfa = objetos soltos da logo
        if (lab[p0] || d[p0 * 4 + 3] < 60) continue;
        const id = comps.length, cc = { id, x0: w, x1: 0, y0: h, y1: 0, n: 0 }; let sp = 0; stack[sp++] = p0; lab[p0] = id;
        while (sp) { const q = stack[--sp], qx = q % w, qy = (q / w) | 0; cc.n++; if (qx < cc.x0) cc.x0 = qx; if (qx > cc.x1) cc.x1 = qx; if (qy < cc.y0) cc.y0 = qy; if (qy > cc.y1) cc.y1 = qy;
          if (qx > 0 && !lab[q - 1] && d[(q - 1) * 4 + 3] >= 60) { lab[q - 1] = id; stack[sp++] = q - 1; } if (qx < w - 1 && !lab[q + 1] && d[(q + 1) * 4 + 3] >= 60) { lab[q + 1] = id; stack[sp++] = q + 1; }
          if (qy > 0 && !lab[q - w] && d[(q - w) * 4 + 3] >= 60) { lab[q - w] = id; stack[sp++] = q - w; } if (qy < h - 1 && !lab[q + w] && d[(q + w) * 4 + 3] >= 60) { lab[q + w] = id; stack[sp++] = q + w; } }
        comps.push(cc);
      }
      const big = comps.filter(cc => cc && cc.n >= 900), map = new Int32Array(comps.length);   // migalhas vão com a peça grande mais próxima
      for (const cc of comps) { if (!cc) continue; if (cc.n >= 900) { map[cc.id] = cc.id; continue; } let best = big[0], bd = 1e18; const mx = (cc.x0 + cc.x1) / 2, my = (cc.y0 + cc.y1) / 2; for (const b of big) { const dx = Math.max(b.x0 - mx, 0, mx - b.x1), dy = Math.max(b.y0 - my, 0, my - b.y1), dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = b; } } map[cc.id] = best.id; best.x0 = Math.min(best.x0, cc.x0); best.x1 = Math.max(best.x1, cc.x1); best.y0 = Math.min(best.y0, cc.y0); best.y1 = Math.max(best.y1, cc.y1); }
      for (let p = 0; p < w * h; p++) if (lab[p]) lab[p] = map[lab[p]];
      for (let pass = 0; pass < 3; pass++) { const add = []; for (let p = 0; p < w * h; p++) { if (lab[p] || !d[p * 4 + 3]) continue; const qx = p % w; const nb = (qx > 0 && lab[p - 1]) || (qx < w - 1 && lab[p + 1]) || (p >= w && lab[p - w]) || (p < w * h - w && lab[p + w]); if (nb) add.push(p, nb); } for (let i = 0; i < add.length; i += 2) lab[add[i]] = add[i + 1]; }   // a borda suavizada vai junto
      const k = place.w / w, lx = place.cx - place.w / 2, ly = place.cy - h * k / 2, CEN = [0.1, 0.316, 0.522, 0.724, 0.89];   // centros de B, A, S, E, 8
      logo.rect = { x: lx, y: ly, w: place.w, h: h * k };
      logo.pieces = big.map(b => {
        const x0 = Math.max(0, b.x0 - 3), y0 = Math.max(0, b.y0 - 3), bw = Math.min(w, b.x1 + 4) - x0, bh = Math.min(h, b.y1 + 4) - y0, pc = mk(bw, bh), px = pc.getContext('2d'), im = px.createImageData(bw, bh);
        for (let yy = 0; yy < bh; yy++) for (let xx = 0; xx < bw; xx++) { const s = (y0 + yy) * w + x0 + xx; if (lab[s] === b.id) { const o = (yy * bw + xx) * 4, i = s * 4; im.data[o] = d[i]; im.data[o + 1] = d[i + 1]; im.data[o + 2] = d[i + 2]; im.data[o + 3] = d[i + 3]; } }
        px.putImageData(im, 0, 0);
        const fx = (x0 + bw / 2) / w; let li = 0; CEN.forEach((cn, i) => { if (Math.abs(fx - cn) < Math.abs(fx - CEN[li])) li = i; });
        return { c: pc, x: lx + (x0 + bw / 2) * k, y: ly + (y0 + bh / 2) * k, w: bw * k, h: bh * k, li, id: b.id, rot: (rnd(b.id, 61) - 0.5) * 1.4 };
      });
      logo.pieces.sort((a, b) => a.li - b.li || (a.y + a.x * 0.3) - (b.y + b.x * 0.3)); const cnt = [0, 0, 0, 0, 0]; logo.pieces.forEach(p => { p.k = cnt[p.li]++; });
      const e8 = logo.pieces.filter(p => p.li === 4), ex0 = Math.min(...e8.map(p => p.x - p.w / 2)), ex1 = Math.max(...e8.map(p => p.x + p.w / 2)), ey0 = Math.min(...e8.map(p => p.y - p.h / 2)), ey1 = Math.max(...e8.map(p => p.y + p.h / 2));
      logo.box8 = { cx: (ex0 + ex1) / 2, cy: (ey0 + ey1) / 2, w: ex1 - ex0, h: ey1 - ey0 };
    },
    // t0 = quando começa. order 'do8' = o 8 entra primeiro e depois E, S, A, B (o 8 é a base); 'leitura' = B, A, S, E, 8
    draw(t, t0, order = 'do8') {
      const off = order === 'do8' ? [0.76, 0.62, 0.48, 0.34, 0] : [0, 0.14, 0.28, 0.42, 0.56];
      for (const p of logo.pieces) { const e = t - (t0 + off[p.li] + p.k * 0.035); if (e <= 0) continue; const s = spring(e, 3.4, 0.5); g.save(); g.translate(p.x, p.y + (1 - E.oExpo(seg(e, 0, 0.3))) * 34); g.rotate(p.rot * (1 - E.oExpo(seg(e, 0, 0.4)))); g.scale(s, s); g.drawImage(p.c, -p.w / 2, -p.h / 2, p.w, p.h); g.restore(); }
    },
  };

  // ------------------------------------------------------------------ legendas de canto (como um visor)
  // o = { title, idx, total, name, col, a }
  function hud(t, o) {
    if (!o || o.a <= 0) return;
    g.save(); g.globalAlpha = o.a; const m = 44, col = o.col || C.mute, st = { fam: MONO, w: 500, c: col, ls: 1.6 };
    text(o.title, m + 22, m + 22, 16, st); text(`${String(o.idx).padStart(2, '0')} / ${String(o.total).padStart(2, '0')}`, W - m - 22, m + 22, 16, { ...st, align: 'right' });
    text(o.name.toUpperCase(), m + 22, H - m - 11, 16, st); text(`F ${String(Math.round(t * FPS)).padStart(4, '0')} · ${FPS} QPS`, W - m - 22, H - m - 11, 16, { ...st, align: 'right' });
    g.strokeStyle = col; g.lineWidth = 2; for (const [x, y, dx, dy] of [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]) { g.beginPath(); g.moveTo(x + 12 * dx, y); g.lineTo(x, y); g.lineTo(x, y + 12 * dy); g.stroke(); }
    g.restore();
  }

  const loadImage = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

  // ------------------------------------------------------------------ partida
  // o = { dur, fps, title, scenes: [{ name, t0, t1, draw(t, g) }], fast: [[t0, t1, amostras]], hud(t, padrão) → objeto ou null, init: async () => {} }
  // fast = trechos rápidos que ganham borrão de movimento (média de subquadros DENTRO do quadro, para nunca misturar
  // dois lados de um corte; por isso os cortes têm de cair em múltiplos de 1/fps).
  function start(o) {
    const DUR = o.dur, SC = o.scenes; FPS = o.fps || 60; api.FPS = FPS; api.DUR = DUR;
    window.VH_SCENES = SC.map(s => ({ name: s.name, t0: s.t0, t1: s.t1 }));
    const sceneAt = t => { for (let i = 0; i < SC.length; i++) if (t >= SC[i].t0 && t < SC[i].t1) return i; return SC.length - 1; };
    function frame(t) { g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; noShadow(); SC[sceneAt(t)].draw(t, g); }
    window.renderOut = function (t) {
      t = clamp(+t || 0, 0, DUR - 1 / FPS / 2);
      let n = 1; if (window.VH_BLUR !== false) for (const f of (o.fast || [])) if (t >= f[0] && t < f[1]) n = f[2];
      if (n === 1) { g = MAIN; frame(t); }
      else for (let k = 0; k < n; k++) { g = TMP; frame(t + k / n * 0.8 / FPS); MAIN.setTransform(1, 0, 0, 1, 0, 0); MAIN.globalAlpha = 1 / (k + 1); MAIN.drawImage(TMPC, 0, 0); }
      g = MAIN; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
      if (o.hud !== false) { const i = sceneAt(t), def = { title: o.title || 'BASE8', idx: i + 1, total: SC.length, name: SC[i].name, col: C.mute, a: 0.9 * seg(t, 0.5, 0.9) * (1 - seg(t, DUR - 1.5, DUR - 1.1)) }; hud(t, typeof o.hud === 'function' ? o.hud(t, def) : def); }
    };
    (async () => {
      const fonts = [new FontFace('Figtree', 'url(assets/fonts/Figtree-VariableFont_wght.ttf)', { weight: '300 900' }), new FontFace('Geist Mono', 'url(assets/fonts/geist-mono-latin.woff2)', { weight: '100 900' })];
      for (const f of fonts) { await f.load(); document.fonts.add(f); }
      await document.fonts.ready;
      if (o.init) await o.init();
      window.renderOut(0);
      window.READY = true;
    })();
  }

  const api = { W, H, FPS, DUR: 0, C, SANS, MONO, PI, TAU, E, clamp, lerp, seg, spring, hash, rnd, vn, mix, rgba, kf, pressAt, mrect,
    box, rbox, circ, at, shadow, noShadow, fill, poly, studio, font, text, measure, lay, reveal, typeTimes, typedAt, blinkOn,
    cursor, ring, anchor, selection, flower, hero, picture, eight, draw8, logo, loadImage, mk, start, get g() { return g; } };
  return api;
})();
