import { Color, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, SphereGeometry } from "three";

import { lerp, smoothstep } from "@/lib/math";
import {
  createCanvas,
  createGrainTexture,
  createRandom,
  forEachSphereTexel,
  FULL_TEXTURES,
  toColorTexture,
  type TextureSettings,
} from "@/lib/three-materials/textures";

import { createNumeralMask, SANS } from "./orb-textures";

/**
 * Bola de tênis: borracha coberta de feltro amarelo-esverdeado, com a costura
 * branca. O feltro é feito de "cascas": várias esferas quase coladas, cada
 * uma mostrando só pontinhos (os fios), cada vez mais ralos para fora. De
 * frente parece tecido; na borda, vira o contorno peludo da bola de verdade.
 */

/**
 * Curva da costura sobre a esfera. Com `wide + narrow = 1` e
 * `rise = 2·√(wide·narrow)` ela fica exatamente na superfície.
 */
const SEAM_CURVE = { wide: 0.7, narrow: 0.3, rise: 0.9165 } as const;
const SEAM_SAMPLES = 180;
/** Metade da largura da costura, em raios da bola. */
const SEAM_HALF_WIDTH = 0.04;
const SEAM_EDGE_SOFTNESS = 0.012;
/** A distância até a costura é medida numa grade pequena e ampliada depois. */
const DISTANCE_WIDTH = 512;
const DISTANCE_HEIGHT = 256;
const MAP_WIDTH = 1024;
const MAP_HEIGHT = 512;
const FELT = [203, 226, 38] as const;
const SEAM = [234, 236, 224] as const;
const PRINT = [56, 62, 40] as const;
/** Quanto a cor do feltro varia de um ponto para outro. */
const FELT_MOTTLE = 0.07;
/** Metade do tamanho do "8" impresso, em raios da bola. */
const PRINT_HALF_SIZE = 0.2;
const PRINT_OPACITY = 0.7;

const SHELL_COUNT = 18;
/** Comprimento dos fios, em raios da bola. */
const FUZZ_LENGTH = 0.05;
/** Quantas vezes o ruído dos fios se repete em volta da bola. */
const GRAIN_REPEAT = [4, 2] as const;
/** Sombra na raiz dos fios e claro nas pontas. */
const SHELL_SHADE = { root: 0.55, tip: 1.08 } as const;
/** Abaixo disso o feltro está rente à borracha e as cascas saem da cena. */
const FUZZ_HIDDEN_BELOW = 0.02;

/** Distância de cada ponto da esfera até a costura, numa grade pequena. */
function measureSeamDistance(detail: number) {
  const gridWidth = Math.round(DISTANCE_WIDTH * detail);
  const gridHeight = Math.round(DISTANCE_HEIGHT * detail);
  const seam: number[] = [];
  for (let sample = 0; sample < SEAM_SAMPLES; sample += 1) {
    const angle = (sample / SEAM_SAMPLES) * Math.PI * 2;
    seam.push(
      SEAM_CURVE.wide * Math.cos(angle) + SEAM_CURVE.narrow * Math.cos(3 * angle),
      SEAM_CURVE.wide * Math.sin(angle) - SEAM_CURVE.narrow * Math.sin(3 * angle),
      SEAM_CURVE.rise * Math.sin(2 * angle),
    );
  }

  const distances = new Float32Array(gridWidth * gridHeight);
  forEachSphereTexel(gridWidth, gridHeight, (x, y, z, offset) => {
    let nearest = Infinity;
    for (let index = 0; index < seam.length; index += 3) {
      const deltaX = x - seam[index];
      const deltaY = y - seam[index + 1];
      const deltaZ = z - seam[index + 2];
      const squared = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
      if (squared < nearest) nearest = squared;
    }
    distances[offset / 4] = Math.sqrt(nearest);
  });

  /** Lê a grade com interpolação; `u` e `v` de 0 a 1. */
  return (u: number, v: number) => {
    const column = Math.min(gridWidth - 1.001, Math.max(0, u * gridWidth - 0.5));
    const row = Math.min(gridHeight - 1.001, Math.max(0, v * gridHeight - 0.5));
    const left = Math.floor(column);
    const top = Math.floor(row);
    const mixX = column - left;
    const mixY = row - top;
    const at = (cellColumn: number, cellRow: number) => distances[cellRow * gridWidth + cellColumn];
    return lerp(lerp(at(left, top), at(left + 1, top), mixX), lerp(at(left, top + 1), at(left + 1, top + 1), mixX), mixY);
  };
}

/**
 * Pintura da bola: feltro, costura e o "8" impresso (o número que toda bola
 * de tênis traz). Devolve duas versões: a da borracha, opaca, e a das cascas,
 * transparente na costura para ali não nascer fio.
 */
function createTennisMaps({ detail, schedule }: TextureSettings) {
  const width = Math.round(MAP_WIDTH * detail);
  const height = Math.round(MAP_HEIGHT * detail);
  const base = createCanvas(width, height);
  const shell = createCanvas(width, height);
  const baseMap = toColorTexture(base.canvas);
  const shellMap = toColorTexture(shell.canvas);

  schedule(() => {
    if (!base.context || !shell.context) return;
    const seamDistance = measureSeamDistance(detail);
    const numeral = createNumeralMask(`700 SIZE ${SANS}`, 0.8);
    const random = createRandom(2026);
    const baseImage = base.context.createImageData(width, height);
    const shellImage = shell.context.createImageData(width, height);

    forEachSphereTexel(width, height, (x, y, z, offset) => {
      const pixel = offset / 4;
      const u = ((pixel % width) + 0.5) / width;
      const v = (Math.floor(pixel / width) + 0.5) / height;
      const felt = smoothstep(SEAM_HALF_WIDTH - SEAM_EDGE_SOFTNESS, SEAM_HALF_WIDTH + SEAM_EDGE_SOFTNESS, seamDistance(u, v));
      const ink = z > 0 ? numeral(x / PRINT_HALF_SIZE, y / PRINT_HALF_SIZE) * PRINT_OPACITY * felt : 0;
      const mottle = 1 + (random() - 0.5) * 2 * FELT_MOTTLE;

      for (let channel = 0; channel < 3; channel += 1) {
        const feltColor = lerp(FELT[channel] * mottle, PRINT[channel], ink);
        const color = Math.min(255, lerp(SEAM[channel], feltColor, felt));
        baseImage.data[offset + channel] = color;
        shellImage.data[offset + channel] = color;
      }
      baseImage.data[offset + 3] = 255;
      shellImage.data[offset + 3] = felt * 255;
    });

    base.context.putImageData(baseImage, 0, 0);
    shell.context.putImageData(shellImage, 0, 0);
    baseMap.needsUpdate = shellMap.needsUpdate = true;
  });

  return { baseMap, shellMap };
}

export function createTennisBall(textures: TextureSettings = FULL_TEXTURES) {
  const { baseMap, shellMap } = createTennisMaps(textures);
  const grain = createGrainTexture(1877);
  grain.repeat.set(...GRAIN_REPEAT);
  const geometry = new SphereGeometry(1, 96, 64);

  const baseMaterial = new MeshPhysicalMaterial({
    map: baseMap,
    roughness: 1,
    // Brilho aveludado de tecido, mais claro nas bordas.
    sheen: 1,
    sheenRoughness: 0.6,
    sheenColor: new Color("#f2f7a8"),
    bumpMap: grain,
    bumpScale: 0.6,
  });
  const base = new Mesh(geometry, baseMaterial);

  const shells = new Group();
  const shellMeshes = Array.from({ length: SHELL_COUNT }, (_, index) => {
    const height = (index + 1) / SHELL_COUNT;
    const material = new MeshStandardMaterial({
      map: shellMap,
      alphaMap: grain,
      // Quanto mais para fora, menos pontos passam: o fio afina até sumir.
      alphaTest: lerp(0.3, 0.93, height),
      color: new Color().setScalar(lerp(SHELL_SHADE.root, SHELL_SHADE.tip, height ** 0.7)),
      roughness: 1,
    });
    const mesh = new Mesh(geometry, material);
    shells.add(mesh);
    return { mesh, height };
  });

  const group = new Group();
  group.add(base, shells);

  return {
    group,
    base,
    /** 0 = borracha lisa; 1 = feltro com os fios em pé. */
    setFuzz(amount: number) {
      shells.visible = amount > FUZZ_HIDDEN_BELOW;
      for (const { mesh, height } of shellMeshes) mesh.scale.setScalar(1 + amount * FUZZ_LENGTH * height);
    },
    dispose() {
      shellMap.dispose();
      grain.dispose();
    },
  };
}
