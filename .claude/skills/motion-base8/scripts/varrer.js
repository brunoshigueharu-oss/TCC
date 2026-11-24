// Varre o filme inteiro atrás de erros de execução e mede o tempo de desenho por quadro, sem renderizar nada.
//   node varrer.js <pasta-do-filme> [duração em s] [qps]
// Sai com código 1 se algum quadro lançar erro. Use antes de abrir a prévia (hub_live).
'use strict';
const path = require('path'), fs = require('fs'), os = require('os'), { pathToFileURL } = require('url');
const film = path.resolve(process.argv[2] || '.'), hub = process.env.VIDEOHUB_DIR || '/Users/brunohigashi/Documents/Claude Code/Videohub';
let puppeteer; for (const p of [path.join(film, 'node_modules', 'puppeteer-core'), path.join(hub, 'node_modules', 'puppeteer-core')]) { try { puppeteer = require(p); break; } catch {} }
if (!puppeteer) { console.error('puppeteer-core não encontrado (defina VIDEOHUB_DIR com a pasta do VideoHub).'); process.exit(2); }
const exe = [process.env.CHROME, process.env.VIDEOHUB_BROWSER, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium',
  path.join(os.homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome')].filter(Boolean).find(x => fs.existsSync(x));
if (!exe) { console.error('Chrome/Edge não encontrado (defina CHROME com o executável).'); process.exit(2); }
(async () => {
  const br = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--allow-file-access-from-files', '--force-device-scale-factor=1'] });
  const p = await br.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(pathToFileURL(path.join(film, 'index.html')).href);
  try { await p.waitForFunction('window.READY === true', { timeout: 20000 }); } catch { console.log('A página não chegou a window.READY = true. Erros:', JSON.stringify(errs)); await br.close(); process.exit(1); }
  const res = await p.evaluate((durArg, fpsArg) => {
    const sc = window.VH_SCENES || [], dur = durArg || (sc.length ? sc[sc.length - 1].t1 : 10), fps = fpsArg || 60, bad = []; let worst = 0, worstT = 0, sum = 0, n = 0;
    for (let f = 0; f < Math.round(dur * fps); f++) { const t = f / fps, a = performance.now(); try { window.renderOut(t); } catch (x) { bad.push(t.toFixed(3) + ' s: ' + x.message); if (bad.length > 8) break; } const ms = performance.now() - a; sum += ms; n++; if (ms > worst) { worst = ms; worstT = t; } }
    return { dur, fps, quadros: n, cenas: sc.map(s => `${s.name} ${s.t0}–${s.t1}`), mediaMs: +(sum / n).toFixed(2), piorMs: +worst.toFixed(1), piorEm: +worstT.toFixed(2), erros: bad };
  }, +process.argv[3] || 0, +process.argv[4] || 0);
  console.log(JSON.stringify({ ...res, errosDePagina: errs }, null, 1));
  await br.close(); process.exit(res.erros.length || errs.length ? 1 : 0);
})();
