import { FOLLOW_RADIUS, VACATED_FADE } from "./constants";

/**
 * Letra pronta para pintar (posição, caractere, cor, opacidade e tamanho da
 * célula); `cell`: casa na grade da cena (-1 = letra em voo).
 */
export type Glyph = { x: number; y: number; ch: string; r: number; g: number; b: number; a: number; size: number; cell: number };

/** Lista de letras reaproveitada entre quadros (evita criar objetos a cada quadro). */
export type GlyphList = { items: Glyph[]; count: number };

export const createGlyphList = (): GlyphList => ({ items: [], count: 0 });

export function pushGlyph(list: GlyphList, x: number, y: number, ch: string, r: number, g: number, b: number, a: number, size: number, cell: number) {
  let item = list.items[list.count];
  if (!item) {
    item = { x: 0, y: 0, ch: "", r: 0, g: 0, b: 0, a: 0, size: 0, cell: -1 };
    list.items.push(item);
  }
  item.x = x;
  item.y = y;
  item.ch = ch;
  item.r = r;
  item.g = g;
  item.b = b;
  item.a = a;
  item.size = size;
  item.cell = cell;
  list.count++;
}

/** Copia as letras ativas (a lista original continua sendo reaproveitada). */
export const snapshotGlyphs = (list: GlyphList): Glyph[] => list.items.slice(0, list.count).map((item) => ({ ...item }));

/** Índice casa da grade → letra da lista neste quadro (-1 = casa vazia). */
export function indexByCell(list: GlyphList, size: number, index: Int32Array<ArrayBuffer>): Int32Array<ArrayBuffer> {
  const map = index.length === size ? index : new Int32Array(size);
  map.fill(-1);
  for (let i = 0; i < list.count; i++) {
    const cell = list.items[i].cell;
    if (cell >= 0 && cell < size) map[cell] = i;
  }
  return map;
}

/**
 * Atualiza a letra guardada com a da cena ao vivo. A cena continua animando:
 * se a casa da letra esvaziou, ela pula para a casa ocupada mais próxima (anda
 * junto com o desenho); sem nenhuma por perto, vai sumindo. Assim nada pousa
 * num lugar vazio — era isso que deixava um "fantasma" no fim da troca.
 */
export function followLive(glyph: Glyph, list: GlyphList, map: Int32Array, cols: number, rows: number) {
  if (glyph.cell < 0 || glyph.cell >= map.length) return;
  let i = map[glyph.cell];
  if (i < 0) {
    const gx = glyph.cell % cols;
    const gy = (glyph.cell / cols) | 0;
    for (let ring = 1; ring <= FOLLOW_RADIUS && i < 0; ring++)
      for (let dy = -ring; dy <= ring && i < 0; dy++)
        for (let dx = -ring; dx <= ring; dx++) {
          if (Math.abs(dx) !== ring && Math.abs(dy) !== ring) continue;
          const x = gx + dx;
          const y = gy + dy;
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const found = map[y * cols + x];
          if (found >= 0) {
            i = found;
            glyph.cell = y * cols + x;
            break;
          }
        }
  }
  if (i < 0) {
    glyph.a *= VACATED_FADE;
    return;
  }
  const live = list.items[i];
  glyph.a = live.a;
  glyph.x = live.x;
  glyph.y = live.y;
  glyph.ch = live.ch;
  glyph.r = live.r;
  glyph.g = live.g;
  glyph.b = live.b;
  glyph.size = live.size;
}
