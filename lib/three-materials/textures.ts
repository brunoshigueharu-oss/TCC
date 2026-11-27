import { CanvasTexture, LinearFilter, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Texturas desenhadas em canvas (sem arquivo de imagem) que servem a mais de
 * um objeto 3D: latão, película da bolha, relevo do vidro, riscos de uso e
 * grão. As que só o orbe usa (mostrador da bússola, bola 8) ficam em
 * `lib/orb/orb-textures.ts`.
 */

/** Nitidez das texturas quando vistas de lado. */
const ANISOTROPY = 8;

/** Adia a pintura de uma textura: desenhar no canvas é a parte cara. */
export type PaintScheduler = (paint: () => void) => void;

export type TextureSettings = {
  /** Fração da resolução cheia. Na landing o objeto é pequeno e metade basta. */
  detail: number;
  /** Quando pintar as texturas pesadas: na hora, ou aos poucos, com o navegador à toa. */
  schedule: PaintScheduler;
};

/** Resolução cheia, tudo pintado na hora (página de estudo). */
export const FULL_TEXTURES: TextureSettings = { detail: 1, schedule: (paint) => paint() };

/**
 * Canvas para desenhar uma textura. Com `detail` menor que 1 o canvas encolhe,
 * mas quem desenha continua usando as medidas cheias: a escala cuida do resto.
 */
export function createCanvas(width: number, height: number, detail = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * detail);
  canvas.height = Math.round(height * detail);
  const context = canvas.getContext("2d");
  if (context && detail !== 1) context.scale(detail, detail);
  return { canvas, context };
}

/** Sorteio com semente: as texturas saem iguais em toda visita. */
export function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function toColorTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = ANISOTROPY;
  return texture;
}


/**
 * Direção (no espaço da esfera) de cada pixel de uma textura que "embrulha" a
 * bola, na mesma conta do SphereGeometry: o centro da imagem olha para +z.
 */
export function forEachSphereTexel(
  width: number,
  height: number,
  visit: (x: number, y: number, z: number, offset: number) => void,
) {
  for (let row = 0; row < height; row += 1) {
    const polar = ((row + 0.5) / height) * Math.PI;
    for (let column = 0; column < width; column += 1) {
      const azimuth = ((column + 0.5) / width) * Math.PI * 2;
      visit(
        -Math.cos(azimuth) * Math.sin(polar),
        Math.cos(polar),
        Math.sin(azimuth) * Math.sin(polar),
        (row * width + column) * 4,
      );
    }
  }
}

/* ---------------------------------------------------------------- latão */

const BRASS_SIZE = 1024;
const BRASS_BASE = "#c29a4c";
const BRASS_COUNTS = { streaks: 5200, tarnish: 420, wear: 160, verdigris: 70, pits: 900, dents: 22, scratches: 380 } as const;

/**
 * Latão antigo, em três mapas que usam o mesmo sorteio (a mancha escura na cor
 * é a mesma mancha áspera no brilho):
 *
 *   cor       manchas de oxidação, pontos de azinhavre e áreas polidas pelo uso
 *   aspereza  riscos, manchas foscas e o escovado do torno
 *   relevo    escovado do torno, furinhos de corrosão e amassados
 *
 * O escovado corre na horizontal da textura, que na caixa da bússola é a
 * volta em torno do eixo: são as marcas de quando a peça foi torneada.
 */
export function createBrassMaps({ detail, schedule }: TextureSettings = FULL_TEXTURES) {
  const color = createCanvas(BRASS_SIZE, BRASS_SIZE, detail);
  const roughness = createCanvas(BRASS_SIZE, BRASS_SIZE, detail);
  const bump = createCanvas(BRASS_SIZE, BRASS_SIZE, detail);
  const random = createRandom(1492);
  const layers = [color.context, roughness.context, bump.context];

  const map = toColorTexture(color.canvas);
  const roughnessMap = new CanvasTexture(roughness.canvas);
  const bumpMap = new CanvasTexture(bump.canvas);
  const textures = [map, roughnessMap, bumpMap];
  for (const texture of textures) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.anisotropy = ANISOTROPY;
  }

  schedule(() => {
    if (!color.context || !roughness.context || !bump.context) return;
    color.context.fillStyle = BRASS_BASE;
    roughness.context.fillStyle = "rgb(96, 96, 96)";
    bump.context.fillStyle = "rgb(128, 128, 128)";
    for (const context of layers) context?.fillRect(0, 0, BRASS_SIZE, BRASS_SIZE);

    /** Mancha macia, repetida nas bordas para a textura emendar sem costura. */
    const blot = (context: CanvasRenderingContext2D, x: number, y: number, size: number, rgb: string, alpha: number) => {
      for (const shiftX of [-BRASS_SIZE, 0, BRASS_SIZE]) {
        for (const shiftY of [-BRASS_SIZE, 0, BRASS_SIZE]) {
          const gradient = context.createRadialGradient(x + shiftX, y + shiftY, 0, x + shiftX, y + shiftY, size);
          gradient.addColorStop(0, `rgba(${rgb}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${rgb}, 0)`);
          context.fillStyle = gradient;
          context.fillRect(x + shiftX - size, y + shiftY - size, size * 2, size * 2);
        }
      }
    };

    for (let stain = 0; stain < BRASS_COUNTS.tarnish; stain += 1) {
      const x = random() * BRASS_SIZE;
      const y = random() * BRASS_SIZE;
      const size = 18 + random() * 120;
      const strength = random();
      blot(color.context, x, y, size, "84, 56, 22", strength * 0.2);
      blot(roughness.context, x, y, size, "255, 255, 255", strength * 0.3);
    }
    for (let patch = 0; patch < BRASS_COUNTS.wear; patch += 1) {
      const x = random() * BRASS_SIZE;
      const y = random() * BRASS_SIZE;
      const size = 20 + random() * 90;
      const strength = random();
      blot(color.context, x, y, size, "244, 220, 156", strength * 0.16);
      blot(roughness.context, x, y, size, "0, 0, 0", strength * 0.3);
    }
    for (let spot = 0; spot < BRASS_COUNTS.verdigris; spot += 1) {
      const x = random() * BRASS_SIZE;
      const y = random() * BRASS_SIZE;
      const size = 3 + random() * 12;
      blot(color.context, x, y, size, "74, 98, 78", 0.3 + random() * 0.3);
      blot(roughness.context, x, y, size, "255, 255, 255", 0.6);
    }

    // Escovado do torno: milhares de riscos horizontais muito finos.
    for (let streak = 0; streak < BRASS_COUNTS.streaks; streak += 1) {
      const x = random() * BRASS_SIZE;
      const y = random() * BRASS_SIZE;
      const length = 60 + random() * 420;
      const tone = random() > 0.5 ? 255 : 0;
      const alpha = 0.04 + random() * 0.14;
      const width = 0.5 + random() * 1.1;
      for (const context of [roughness.context, bump.context]) {
        context.strokeStyle = `rgba(${tone}, ${tone}, ${tone}, ${alpha})`;
        context.lineWidth = width;
        for (const shiftX of [0, -BRASS_SIZE]) {
          context.beginPath();
          context.moveTo(x + shiftX, y);
          context.lineTo(x + shiftX + length, y);
          context.stroke();
        }
      }
      color.context.strokeStyle = tone ? `rgba(250, 228, 170, ${alpha * 0.4})` : `rgba(70, 46, 16, ${alpha * 0.4})`;
      color.context.lineWidth = width;
      color.context.beginPath();
      color.context.moveTo(x, y);
      color.context.lineTo(x + length, y);
      color.context.stroke();
    }

    // Riscos de bolso: curtos, em qualquer direção, mais claros (o metal novo aparece).
    for (let scratch = 0; scratch < BRASS_COUNTS.scratches; scratch += 1) {
      const x = random() * BRASS_SIZE;
      const y = random() * BRASS_SIZE;
      const angle = random() * Math.PI * 2;
      const length = 10 + random() * 90;
      const alpha = 0.15 + random() * 0.4;
      const width = 0.5 + random() * 0.9;
      for (const [context, rgb] of [
        [color.context, "246, 224, 160"],
        [roughness.context, "255, 255, 255"],
        [bump.context, "0, 0, 0"],
      ] as const) {
        context.strokeStyle = `rgba(${rgb}, ${alpha})`;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        context.stroke();
      }
    }

    for (let pit = 0; pit < BRASS_COUNTS.pits; pit += 1) {
      const x = random() * BRASS_SIZE;
      const y = random() * BRASS_SIZE;
      const size = 1 + random() * 2.6;
      blot(bump.context, x, y, size, "0, 0, 0", 0.5 + random() * 0.4);
      blot(color.context, x, y, size * 1.6, "60, 40, 16", 0.35);
      blot(roughness.context, x, y, size * 1.6, "255, 255, 255", 0.5);
    }
    for (let dent = 0; dent < BRASS_COUNTS.dents; dent += 1) {
      blot(bump.context, random() * BRASS_SIZE, random() * BRASS_SIZE, 24 + random() * 60, "0, 0, 0", 0.1 + random() * 0.14);
    }
    for (const texture of textures) texture.needsUpdate = true;
  });

  return { map, roughnessMap, bumpMap };
}

/* ------------------------------------------------------ película da bolha */

const FILM_WIDTH = 512;
const FILM_HEIGHT = 256;
/**
 * Dois pontos da película um pouco mais grossos, um acima do outro, de frente
 * para a câmera. As faixas de cor contornam cada um e se juntam no meio: o
 * desenho das faixas vira um 8, como curvas de nível em volta de dois morros.
 */
const FILM_LOBES = [
  { height: 0.4, reach: 0.34, lift: 0.2 },
  { height: -0.36, reach: 0.42, lift: 0.22 },
] as const;

/**
 * Espessura da película de sabão (canal verde): fina em cima, grossa embaixo,
 * porque o líquido escorre, com ondas que viram as faixas coloridas.
 */
export function createFilmThicknessTexture() {
  const { canvas, context } = createCanvas(FILM_WIDTH, FILM_HEIGHT);

  if (context) {
    const image = context.createImageData(FILM_WIDTH, FILM_HEIGHT);
    const lobes = FILM_LOBES.map((lobe) => ({ ...lobe, depth: Math.sqrt(1 - lobe.height * lobe.height) }));
    forEachSphereTexel(FILM_WIDTH, FILM_HEIGHT, (x, y, z, offset) => {
      const pixel = offset / 4;
      const down = Math.floor(pixel / FILM_WIDTH) / FILM_HEIGHT;
      // Voltas inteiras no sentido horizontal, para a textura emendar sem costura.
      const around = ((pixel % FILM_WIDTH) / FILM_WIDTH) * Math.PI * 2;
      const waves =
        Math.sin(around * 2 + down * 9) * 0.06 +
        Math.sin(around * 5 - down * 14 + Math.sin(around * 3) * 1.5) * 0.04 +
        Math.sin(down * 31 + Math.sin(around * 4) * 2) * 0.025;
      let lift = 0;
      for (const lobe of lobes) {
        const distance = Math.hypot(x, y - lobe.height, z - lobe.depth);
        lift += lobe.lift * Math.exp(-((distance / lobe.reach) ** 2));
      }
      const thickness = Math.min(1, Math.max(0, 0.14 + down * 0.6 + waves + lift));
      image.data[offset] = image.data[offset + 1] = image.data[offset + 2] = thickness * 255;
      image.data[offset + 3] = 255;
    });
    context.putImageData(image, 0, 0);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  return texture;
}

/* -------------------------------------------------- relevos e riscos */

const BUMP_SIZE = 512;

/**
 * Relevo de manchas macias (cinza médio = plano). Serve para a superfície
 * levemente ondulada do vidro soprado ou para poros de uma casca,
 * conforme a quantidade e o tamanho das manchas.
 */
export function createBlobBumpTexture(seed: number, blobCount: number, blobSize: number) {
  const { canvas, context } = createCanvas(BUMP_SIZE, BUMP_SIZE);
  const random = createRandom(seed);

  if (context) {
    context.fillStyle = "rgb(128, 128, 128)";
    context.fillRect(0, 0, BUMP_SIZE, BUMP_SIZE);
    for (let blob = 0; blob < blobCount; blob += 1) {
      const x = random() * BUMP_SIZE;
      const y = random() * BUMP_SIZE;
      const size = blobSize * (0.5 + random());
      const tone = random() > 0.5 ? 255 : 0;
      // Desenha também as cópias do outro lado da borda, para a textura repetir sem emenda.
      for (const shiftX of [-BUMP_SIZE, 0, BUMP_SIZE]) {
        for (const shiftY of [-BUMP_SIZE, 0, BUMP_SIZE]) {
          const gradient = context.createRadialGradient(x + shiftX, y + shiftY, 0, x + shiftX, y + shiftY, size);
          gradient.addColorStop(0, `rgba(${tone}, ${tone}, ${tone}, 0.35)`);
          gradient.addColorStop(1, `rgba(${tone}, ${tone}, ${tone}, 0)`);
          context.fillStyle = gradient;
          context.fillRect(x + shiftX - size, y + shiftY - size, size * 2, size * 2);
        }
      }
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
}

const SCUFF_SIZE = 1024;
const SCUFF_LINE_COUNT = 700;
const SCUFF_SPECK_COUNT = 4000;

/**
 * Mapa de aspereza (canal verde) com riscos finíssimos e poeira: quebra o
 * reflexo perfeito de computador e deixa laca e metal com cara de objeto usado.
 * Mais claro = mais áspero.
 */
export function createScuffTexture() {
  const { canvas, context } = createCanvas(SCUFF_SIZE, SCUFF_SIZE);
  const random = createRandom(8);

  if (context) {
    context.fillStyle = "rgb(120, 120, 120)";
    context.fillRect(0, 0, SCUFF_SIZE, SCUFF_SIZE);

    for (let line = 0; line < SCUFF_LINE_COUNT; line += 1) {
      const x = random() * SCUFF_SIZE;
      const y = random() * SCUFF_SIZE;
      const angle = random() * Math.PI * 2;
      const length = 20 + random() * 160;
      context.strokeStyle = `rgba(255, 255, 255, ${0.08 + random() * 0.3})`;
      context.lineWidth = 0.6 + random() * 0.9;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(
        x + Math.cos(angle) * length * 0.5 + (random() - 0.5) * 20,
        y + Math.sin(angle) * length * 0.5 + (random() - 0.5) * 20,
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length,
      );
      context.stroke();
    }
    for (let speck = 0; speck < SCUFF_SPECK_COUNT; speck += 1) {
      context.fillStyle = `rgba(255, 255, 255, ${random() * 0.25})`;
      context.fillRect(random() * SCUFF_SIZE, random() * SCUFF_SIZE, 1.5, 1.5);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.anisotropy = ANISOTROPY;
  return texture;
}

const GRAIN_SIZE = 512;

/**
 * Ruído fino, um valor por pixel, sem suavização entre níveis de zoom. É ele
 * que vira os fios do feltro da bola de tênis.
 */
export function createGrainTexture(seed: number) {
  const { canvas, context } = createCanvas(GRAIN_SIZE, GRAIN_SIZE);
  const random = createRandom(seed);

  if (context) {
    const image = context.createImageData(GRAIN_SIZE, GRAIN_SIZE);
    for (let offset = 0; offset < image.data.length; offset += 4) {
      const value = random() * 255;
      image.data[offset] = image.data[offset + 1] = image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  return texture;
}
