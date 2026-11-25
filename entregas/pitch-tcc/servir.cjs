// Servidor local da apresentação: node servir.cjs  →  http://localhost:4320
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const PORTA = Number(process.env.PORT) || 4320;
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };

http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(req.url.split('?')[0]); } catch (e) { res.writeHead(400); return res.end(); }
  const arq = path.join(RAIZ, rel === '/' ? 'index.html' : rel);
  if (arq !== RAIZ && !arq.startsWith(RAIZ + path.sep)) { res.writeHead(403); return res.end(); }
  fs.stat(arq, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('não encontrado'); }
    const tipo = TIPOS[path.extname(arq).toLowerCase()] || 'application/octet-stream';
    const envia = (fluxo) => fluxo.on('error', () => res.destroy()).pipe(res);
    const faixa = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
    if (faixa) {
      const ini = +faixa[1];
      const fim = Math.min(faixa[2] ? +faixa[2] : st.size - 1, st.size - 1);
      if (ini > fim) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end(); }
      res.writeHead(206, { 'Content-Type': tipo, 'Content-Range': `bytes ${ini}-${fim}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': fim - ini + 1 });
      return envia(fs.createReadStream(arq, { start: ini, end: fim }));
    }
    res.writeHead(200, { 'Content-Type': tipo, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    envia(fs.createReadStream(arq));
  });
}).listen(PORTA, () => console.log(`Pitch em http://localhost:${PORTA}`));
