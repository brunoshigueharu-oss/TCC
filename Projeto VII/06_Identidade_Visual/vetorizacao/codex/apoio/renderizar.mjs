import sharp from '/Users/brunohigashi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
import {readdir} from 'node:fs/promises';
for (const nome of (await readdir('.')).filter(n=>n.endsWith('.svg'))) {
 await sharp(nome).png().toFile(`previas/${nome.replace('.svg','.png')}`);
 console.log(nome);
}
for (const nome of ['logo-final','logo-alternativa-01-micro']) {
 for (const tamanho of [16,24,32,48,64]) {
  await sharp(`${nome}.svg`).resize(tamanho,tamanho).png().toFile(`previas/${nome}-${tamanho}px.png`);
 }
}
