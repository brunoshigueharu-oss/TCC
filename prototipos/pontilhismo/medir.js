/**
 * Mede um vídeo ou imagem e devolve os valores do tema (SUBJECTS) para o
 * efeito de caracteres em cores originais. Roda dentro da página do protótipo
 * (localhost:4310), que serve esta pasta:
 *
 *   (0, eval)(await (await fetch("/medir.js")).text());
 *   await medir("novo.mp4")          // ou "novo.jpg"
 *   await medir("novo.mp4", { from: 23, to: 37 })   // só o trecho escolhido
 *
 * Devolve um JSON curto: tipo de fundo, fill, tinta, tom, recorte, cortes de cena
 * e a cobertura ao longo do tempo (para achar o botão fechado e a flor aberta).
 */
window.medir = async function medir(src, { step = 0.25, width = 160, from = 0, to = Infinity } = {}) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const el = isVideo ? document.createElement("video") : new Image();
  // o servidor do protótipo não aceita Range: sem blob o vídeo não avança no seek
  el.src = isVideo ? URL.createObjectURL(await (await fetch(src)).blob()) : src;
  if (isVideo) {
    el.muted = true; el.preload = "auto";
    await new Promise((ok, err) => { el.onloadeddata = ok; el.onerror = err; });
  } else await el.decode();

  const W0 = isVideo ? el.videoWidth : el.naturalWidth, H0 = isVideo ? el.videoHeight : el.naturalHeight;
  const w = width, h = Math.round(width * H0 / W0);
  const cnv = document.createElement("canvas"); cnv.width = w; cnv.height = h;
  const cx = cnv.getContext("2d", { willReadFrequently: true });
  const dur = isVideo ? el.duration : 0;

  const frames = []; // { t, d }
  const grab = t => { cx.drawImage(el, 0, 0, w, h); frames.push({ t, d: cx.getImageData(0, 0, w, h).data }); };
  if (isVideo) {
    for (let t = Math.max(0.02, from); t < Math.min(dur, to) - 0.02; t += step) {
      el.currentTime = t;
      await new Promise(ok => { el.onseeked = ok; });
      grab(t);
    }
  } else grab(0);

  const satOf = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx > 0 ? (mx - mn) / mx : 0; };
  const lOf = (r, g, b) => (Math.max(r, g, b) + Math.min(r, g, b)) / 510; // luminosidade HSL
  const pct = (arr, p) => { if (!arr.length) return 0; const s = Float32Array.from(arr).sort(); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
  const r3 = v => Math.round(v * 1000) / 1000;

  // fundo = borda de 3% em todos os quadros
  const bw = Math.max(2, Math.round(w * 0.03)), border = [];
  for (const { d } of frames) for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
    if (x >= bw && x < w - bw && y >= bw && y < h - bw) continue;
    const i = (y * w + x) * 4; border.push([d[i], d[i + 1], d[i + 2]]);
  }
  const med = k => pct(border.map(c => c[k]), 0.5);
  const fillRgb = [med(0), med(1), med(2)].map(Math.round);
  const fill = "#" + fillRgb.map(v => v.toString(16).padStart(2, "0")).join("");
  const dark = lOf(...fillRgb) < 0.25;

  // tinta: fundo claro → saturação; fundo escuro → brilho. O tema pode encostar na borda,
  // então o fundo é a mediana da borda e o corte fica um pouco acima
  const bgVals = border.map(c => dark ? Math.max(...c) / 255 : satOf(...c));
  const bg50 = pct(bgVals, 0.5);
  const inkOf = (r, g, b) => (dark ? Math.max(r, g, b) / 255 : satOf(r, g, b));
  const all = [];
  for (const { d } of frames) for (let i = 0; i < d.length; i += 4 * 3) all.push(inkOf(d[i], d[i + 1], d[i + 2]));
  // Otsu: o vale entre fundo e tema (bom quando o fundo tem cor, ex.: rosado)
  const hist = new Float64Array(100); for (const v of all) hist[Math.min(99, Math.floor(v * 100))]++;
  let best = 0, otsu = 0, wB = 0, sB = 0; const sum = hist.reduce((a, n, i) => a + n * i, 0);
  for (let i = 0; i < 100; i++) { wB += hist[i]; if (!wB || wB === all.length) continue; sB += hist[i] * i;
    const mB = sB / wB, mF = (sum - sB) / (all.length - wB), v = wB * (all.length - wB) * (mB - mF) ** 2; if (v > best) { best = v; otsu = i / 100; } }
  const floor = dark ? bg50 + 0.012 : Math.max(bg50 * 2 + 0.005, 0.04);
  // fundo com cor (claro, bg > 0,02): corta no meio do caminho até o Otsu; senão fica rente ao fundo
  const min = r3(!dark && bg50 > 0.02 ? Math.max(floor, (floor + otsu) / 2) : floor);
  const range = r3(Math.min(0.1, Math.max(0.03, dark ? min * 2.5 : min)));

  // tom, recorte, cobertura e cortes de cena
  const lums = [], cover = [], diffs = [];
  let x0 = w, y0 = h, x1 = 0, y1 = 0, prev = null;
  for (const { t, d } of frames) {
    let n = 0, diff = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2];
      if (prev) diff += Math.abs(r - prev[i]) + Math.abs(g - prev[i + 1]) + Math.abs(b - prev[i + 2]);
      if ((inkOf(r, g, b) - min) / range < 0.3) continue;
      n++; if (n % 3 === 0) lums.push(lOf(r, g, b));
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (prev) diffs.push([t, diff / (w * h * 3 * 255)]);
    cover.push([r3(t), r3(n / (w * h))]);
    prev = d;
  }
  // corte de cena: salto bem acima da mudança normal entre quadros
  const typical = pct(diffs.map(x => x[1]), 0.5);
  const cuts = diffs.filter(([, v]) => v > Math.max(0.04, typical * 2.5)).map(([t]) => r3(t));
  const pad = 0.02, cx0 = Math.max(0, x0 / w - pad), cy0 = Math.max(0, y0 / h - pad);
  const crop = { x: r3(cx0), y: r3(cy0), w: r3(Math.min(1, (x1 + 1) / w + pad) - cx0), h: r3(Math.min(1, (y1 + 1) / h + pad) - cy0) };

  // loop perfeito: compara os últimos quadros com o primeiro, quadro a quadro.
  // Se o último é cópia do primeiro, o modo "loop" mostra o mesmo quadro duas vezes
  // seguidas na emenda (a travadinha): o clip tem que acabar no começo dessa cópia
  let loop = null;
  if (isVideo && to === Infinity && dur > 1) {
    const seek = t => new Promise(ok => { el.onseeked = ok; el.currentTime = t; });
    const px = () => { cx.drawImage(el, 0, 0, w, h); return cx.getImageData(0, 0, w, h).data; };
    const dif = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) s += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); return s / (w * h * 3 * 255); };
    await seek(0.001); const first = px();
    const runs = []; // quadros do fim: { start, d }
    for (let t = Math.max(0.001, dur - 0.4); t < dur - 0.001; t += 1 / 120) {
      await seek(t); const d = px();
      if (!runs.length || dif(d, runs[runs.length - 1].d) > 1e-4) runs.push({ start: t, d });
    }
    if (runs.length > 2) {
      const adj = pct(runs.slice(1).map((r, i) => dif(r.d, runs[i].d)), 0.5); // mudança normal entre quadros
      const fps = Math.round((runs.length - 1) / (runs[runs.length - 1].start - runs[0].start));
      const last = runs[runs.length - 1], dLast = dif(last.d, first);
      const startOf = t => r3(0.02 + Math.round(t * fps) / fps); // capturas do protótipo começam em 0,02 s
      if (dLast < adj * 0.3) loop = { perfect: true, duplicate: true, fps, from: 0.02, to: startOf(last.start), diff: r3(dLast), adj: r3(adj) };
      else if (dLast < adj * 1.5) loop = { perfect: true, duplicate: false, fps, from: 0.02, to: r3(0.02 + dur), diff: r3(dLast), adj: r3(adj) };
      else loop = { perfect: false, fps, diff: r3(dLast), adj: r3(adj) };
    }
  }

  // cobertura resumida (~20 pontos) e os extremos: botão (mín.) e aberta (máx.)
  const every = Math.max(1, Math.ceil(cover.length / 20));
  const byCover = [...cover].sort((a, b) => a[1] - b[1]);
  return {
    src, kind: isVideo ? "video" : "image", size: [W0, H0], duration: r3(dur),
    bg: dark ? "escuro" : "claro", fill,
    ink: dark ? { by: "brilho", min, range } : { by: "saturacao", min, range },
    // claro: p25–p95 (pula sombras e caule); escuro: p5–p90. Calibrado nos temas feitos à mão
    tone: dark ? [r3(pct(lums, 0.05)), r3(pct(lums, 0.9))] : [r3(pct(lums, 0.25)), r3(pct(lums, 0.95))],
    crop, sceneCuts: cuts, loop,
    coverMin: byCover[0], coverMax: byCover[byCover.length - 1],
    cover: cover.filter((_, i) => i % every === 0),
  };
};
