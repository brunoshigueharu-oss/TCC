// Trilha PROVISÓRIA do filme-modelo (8 s, 120 BPM): cada som cai no mesmo tempo do film.js.
// Troque pelos tempos do seu filme. O mix final vem do Ableton Live e substitui audio/mix.wav.
//   node make-audio.js
'use strict';
const path = require('path'), m = require('./som')(8);
m.click(0.5, 0.6);                                                    // o ponto estala
[72, 74, 76, 79].forEach((n, i) => m.blip(1.0 + i * 0.08, n, n + 1, 0.06, 0.09));   // palavras subindo
m.blip(1.5, 64, 69, 0.08, 0.1);                                       // o botão entra
m.click(2.5, 0.4); m.whoosh(2.6, 0.2, 0.3); m.kick(2.5, 0.6);         // clique: o botão vira o símbolo
for (let b = 0; b < 6; b++) { const t = 2.5 + b * 0.5; if (b % 2 === 0) m.kick(t, 0.7); m.bass(t, 33, 0.42, 0.24); }
m.hit(4.0, 0.3); m.whoosh(4.0, 0.2, 0.26);                            // corte para a assinatura
for (let k = 0; k < 25; k++) m.blip(4.1 + k * 0.03, 72 + (k % 7), 73 + (k % 7), 0.04, 0.045, (k % 5 - 2) * 0.2);   // peças da logo
m.tone(5.0, 76, 2.4, 0.26, 0.004, 1.6, -0.2); m.tone(5.25, 81, 2.4, 0.3, 0.004, 1.4, 0.2);   // assinatura de 2 notas (a mesma em toda a campanha)
m.blip(5.5, 64, 69, 0.08, 0.1);
m.echo(4.0);
m.save(path.join(__dirname, 'audio', 'mix.wav'));
