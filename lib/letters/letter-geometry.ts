import { Box3, ExtrudeGeometry, ShapePath, type BufferGeometry } from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { BASE8_FONT, BASE8_GLYPHS, type LetterGlyph } from "./base8-glyphs";

/**
 * Letras de BASE8 em 3D: o contorno da fonte da marca ganha espessura e um
 * chanfro arredondado (é ele que pega os brilhos e faz o material parecer de
 * verdade). Tudo é medido em "alturas de maiúscula": a altura das letras vale 1.
 */

const UNIT = 1 / BASE8_FONT.capHeight;
/** Espessura da letra, tamanho do chanfro e quão lisas saem as curvas. */
const EXTRUDE = { depth: 0.3, bevelThickness: 0.03, bevelSize: 0.024, bevelSegments: 5, curveSegments: 16 } as const;
/**
 * Folga extra entre as letras, somada ao kerning da fonte. Em 3D e vistas de
 * lado, as letras precisam de mais ar que no texto: a espessura de uma
 * encostaria na vizinha.
 */
const TRACKING = 0.05;
/**
 * Até este ângulo entre faces vizinhas a superfície é lida como contínua: o
 * chanfro vira uma borda arredondada, e a frente da letra continua plana.
 */
const HARD_CREASE = Math.PI / 3;
/** Feltro: nenhuma quina, para as "cascas" de fios crescerem sem abrir fresta. */
const SOFT_CREASE = Math.PI;

export type Letter3D = {
  character: string;
  /** Superfície dura (metal, vidro, resina): quinas vivas, chanfro arredondado. */
  geometry: BufferGeometry;
  /** A mesma forma com todas as normais suavizadas, para o feltro. */
  softGeometry: BufferGeometry;
  /** Centro da letra na palavra, com a palavra centrada em zero. */
  x: number;
  width: number;
};

const COMMAND = /([MLCQZ])([^MLCQZ]*)/g;

/** Lê o caminho da letra (comandos do SVG) e devolve as formas, já com os furos. */
function createShapes(glyph: LetterGlyph) {
  const path = new ShapePath();
  for (const [, command, values] of glyph.path.matchAll(COMMAND)) {
    const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] = values
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((value) => Number(value) * UNIT);
    if (command === "M") path.moveTo(a, b);
    if (command === "L") path.lineTo(a, b);
    if (command === "Q") path.quadraticCurveTo(a, b, c, d);
    if (command === "C") path.bezierCurveTo(a, b, c, d, e, f);
    if (command === "Z") path.currentPath?.closePath();
  }
  // O three separa sozinho o que é contorno de fora e o que é furo.
  return path.toShapes();
}

/**
 * Monta as cinco letras, cada uma centrada no próprio meio (para girar em
 * torno do eixo dela) e com a posição que ocupa na palavra.
 */
export function createBase8Letters() {
  const bounds = new Box3();
  let cursor = 0;

  const placed = BASE8_GLYPHS.map((glyph, index) => {
    const extruded = new ExtrudeGeometry(createShapes(glyph), { ...EXTRUDE, bevelEnabled: true });
    extruded.computeBoundingBox();
    bounds.copy(extruded.boundingBox ?? bounds);
    const centerX = (bounds.min.x + bounds.max.x) / 2;
    const width = bounds.max.x - bounds.min.x;
    extruded.translate(-centerX, -0.5, -EXTRUDE.depth / 2);

    const geometry = toCreasedNormals(extruded, HARD_CREASE);
    const softGeometry = toCreasedNormals(extruded, SOFT_CREASE);
    extruded.dispose();

    const left = cursor + centerX - width / 2;
    const letter = { character: glyph.character, geometry, softGeometry, x: cursor + centerX, width, left };
    cursor += (glyph.advance + (BASE8_FONT.kerning[index] ?? 0)) * UNIT + TRACKING;
    return letter;
  });

  const first = placed[0];
  const last = placed[placed.length - 1];
  const wordLeft = first.left;
  const wordWidth = last.left + last.width - wordLeft;
  const letters: Letter3D[] = placed.map((letter) => ({
    character: letter.character,
    geometry: letter.geometry,
    softGeometry: letter.softGeometry,
    x: letter.x - wordLeft - wordWidth / 2,
    width: letter.width,
  }));

  return {
    letters,
    /** Largura da palavra inteira; a altura das letras é 1 e a espessura, `depth`. */
    width: wordWidth,
    depth: EXTRUDE.depth + EXTRUDE.bevelThickness * 2,
    dispose() {
      for (const letter of letters) {
        letter.geometry.dispose();
        letter.softGeometry.dispose();
      }
    },
  };
}

export type Base8Letters = ReturnType<typeof createBase8Letters>;
