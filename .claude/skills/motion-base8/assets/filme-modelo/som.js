// Sintetizador mínimo para a trilha PROVISÓRIA (só para sentir o ritmo no preview; o mix final vem do Ableton Live).
// Sem dependências e sem créditos pagos. Uso: const m = require('./som')(30); m.kick(3); ...; m.save('audio/mix.wav');
'use strict';
const fs = require('fs'), path = require('path');
module.exports = function mixer(DUR, SR = 44100) {
  const N = Math.round(SR * DUR), L = new Float32Array(N), R = new Float32Array(N); let seed = 8;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
  const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - Math.max(0, pan)); R[i] += v * (1 + Math.min(0, pan)); } };
  const midi = m => 440 * Math.pow(2, (m - 69) / 12);
  // o mesmo hash do motor.js: use rnd(i, semente) para os toques de teclado caírem nas letras de B8.typeTimes
  function hash(n) { n = Math.imul(n ^ 0x9E3779B9, 0x85EBCA6B); n ^= n >>> 13; n = Math.imul(n, 0xC2B2AE35); n ^= n >>> 16; return (n >>> 0) / 4294967296; }
  const rnd = (a, b = 0, c = 0) => hash(Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663) ^ Math.imul(c | 0, 83492791));
  const m = {
    SR, rnd,
    kick(t, amp = 0.8) { const n = Math.round(0.32 * SR), i0 = Math.round(t * SR); let ph = 0; for (let i = 0; i < n; i++) { const x = i / SR, f = 44 + 120 * Math.exp(-x * 30); ph += 2 * Math.PI * f / SR; add(i0 + i, Math.sin(ph) * Math.exp(-x * 10) * amp); } },
    noise(t, dur, amp, hp, decay, pan = 0) { const n = Math.round(dur * SR), i0 = Math.round(t * SR); let lp = 0; for (let i = 0; i < n; i++) { const x = i / SR, w = rand(); lp += (w - lp) * hp; add(i0 + i, (w - lp) * Math.exp(-x * decay) * amp, pan); } },
    whoosh(t, amp = 0.16, dur = 0.2) { const n = Math.round(dur * SR), i0 = Math.round((t - dur * 0.45) * SR); let lp = 0; for (let i = 0; i < n; i++) { const u = i / n, w = rand(); lp += (w - lp) * (0.04 + 0.5 * u); add(i0 + i, lp * Math.sin(Math.PI * u) * amp, u * 0.9 - 0.45); } },
    bass(t, note, dur = 0.42, amp = 0.28) { const n = Math.round(dur * SR), i0 = Math.round(t * SR), f = midi(note); for (let i = 0; i < n; i++) { const x = i / SR, e = Math.min(1, x / 0.008) * Math.exp(-x * 5); add(i0 + i, (Math.sin(2 * Math.PI * f * x) + 0.35 * Math.sin(4 * Math.PI * f * x) + 0.15 * Math.sin(6 * Math.PI * f * x)) * e * amp); } },
    tone(t, note, dur, amp, attack, decay, pan = 0) { const n = Math.round(dur * SR), i0 = Math.round(t * SR), f = midi(note); for (let i = 0; i < n; i++) { const x = i / SR, e = Math.min(1, x / attack) * Math.exp(-x * decay) * Math.min(1, (dur - x) / Math.min(0.25, dur / 2)); add(i0 + i, (Math.sin(2 * Math.PI * f * x) + 0.25 * Math.sin(4 * Math.PI * f * x)) * e * amp, pan); } },
    // som de interface: senoide com glissando (nota n0 → n1). Pulos, moedas, estalos, alternadores.
    blip(t, n0, n1, dur = 0.09, amp = 0.16, pan = 0) { const n = Math.round(dur * SR), i0 = Math.round(t * SR); let ph = 0; for (let i = 0; i < n; i++) { const u = i / n, f = midi(n0 + (n1 - n0) * u); ph += 2 * Math.PI * f / SR; add(i0 + i, Math.sin(ph) * Math.sin(Math.PI * Math.min(1, u * 6) / 2) * Math.pow(1 - u, 1.6) * amp, pan); } },
    click(t, amp = 0.5, pan = 0) { m.noise(t, 0.02, amp, 0.6, 260, pan); m.tone(t, 96, 0.05, amp * 0.4, 0.0005, 90, pan); },
    hit(t, amp = 0.3) { m.noise(t, 0.16, amp, 0.34, 26); },                      // acento de corte
    key(t, pan = 0) { m.noise(t, 0.03, 0.17, 0.5, 190, pan); },                   // tecla
    silence(t0, t1) { for (let i = Math.round(t0 * SR); i < Math.min(N, Math.round(t1 * SR)); i++) { L[i] = 0; R[i] = 0; } },   // corte seco: zera tudo no trecho (chame DEPOIS de escrever os sons)
    echo(from, delay = 0.31, fb = 0.3) { const d = Math.round(delay * SR); for (let i = Math.round(from * SR) + d; i < N; i++) { L[i] += R[i - d] * fb; R[i] += L[i - d] * fb; } },
    save(file) {
      const data = Buffer.alloc(N * 4);
      for (let i = 0; i < N; i++) { const fade = Math.min(1, (N - i) / (0.15 * SR)); data.writeInt16LE(Math.round(Math.tanh(L[i] * 1.1) * fade * 30000), i * 4); data.writeInt16LE(Math.round(Math.tanh(R[i] * 1.1) * fade * 30000), i * 4 + 2); }
      const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
      h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
      fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.concat([h, data])); console.log(`${file}: ${DUR} s (provisório)`);
    },
  };
  return m;
};
