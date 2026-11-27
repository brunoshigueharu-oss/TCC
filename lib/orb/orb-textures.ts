import { smoothstep } from "@/lib/math";
import {
  createCanvas,
  createRandom,
  forEachSphereTexel,
  FULL_TEXTURES,
  toColorTexture,
  type TextureSettings,
} from "@/lib/three-materials/textures";

/**
 * Texturas desenhadas em canvas que só o orbe usa: mostrador da bússola e
 * pintura da bola 8. As da bola de tênis ficam junto dela; as compartilhadas
 * com as letras 3D (latão, vidro, riscos, grão) ficam em `lib/three-materials`.
 */

export const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
/** Algarismo arredondado, como o das bolas de sinuca de verdade. */
const ROUNDED = `'Arial Rounded MT Bold', ${SANS}`;

/* ------------------------------------------------- mostrador da bússola */

const DIAL_SIZE = 2048;
const DIAL_PAPER = "#efe4c2";
const DIAL_PAPER_SHADE = "#d9c794";
const DIAL_INK = "#2a211a";
/** Um traço por grau. */
const DIAL_TICK_COUNT = 360;
const DIAL_DEGREE_LABEL_STEP = 20;
const DIAL_CARDINALS = ["N", "L", "S", "O"] as const;
const DIAL_DIAGONALS = ["NE", "SE", "SO", "NO"] as const;
const DIAL_STAIN_COUNT = 260;
const DIAL_FIBER_COUNT = 5200;
/** Variação de cor do grão do papel, em níveis de 0 a 255. */
const DIAL_GRAIN = 9;
/** Raios (em fração do mostrador) da rosa dos ventos impressa. */
const DIAL_ROSE = { cardinal: 0.56, diagonal: 0.4, waist: 0.085, ring: 0.6, rays: 0.6 } as const;

/**
 * Mostrador de bússola antiga: papel amarelado, escala de graus, pontos
 * cardeais em serifa e a rosa dos ventos de oito pontas impressa em nanquim.
 * O "8" é só o ornamento acima do norte.
 */
export function createDialTexture({ detail, schedule }: TextureSettings = FULL_TEXTURES) {
  const { canvas, context } = createCanvas(DIAL_SIZE, DIAL_SIZE, detail);
  const texture = toColorTexture(canvas);
  const center = DIAL_SIZE / 2;
  const radius = DIAL_SIZE / 2;
  const random = createRandom(1808);
  /** Ponto no mostrador a partir do ângulo (0 = norte, sentido horário). */
  const at = (angle: number, distance: number) =>
    [center + Math.sin(angle) * distance * radius, center - Math.cos(angle) * distance * radius] as const;

  schedule(() => {
    if (!context) return;
    // Papel: mais claro no meio, amarelado na borda, com manchas de idade.
    const paper = context.createRadialGradient(center, center, 0, center, center, radius);
    paper.addColorStop(0, DIAL_PAPER);
    paper.addColorStop(1, DIAL_PAPER_SHADE);
    context.fillStyle = paper;
    context.fillRect(0, 0, DIAL_SIZE, DIAL_SIZE);
    for (let stain = 0; stain < DIAL_STAIN_COUNT; stain += 1) {
      const x = random() * DIAL_SIZE;
      const y = random() * DIAL_SIZE;
      const size = 20 + random() * 150;
      const blot = context.createRadialGradient(x, y, 0, x, y, size);
      blot.addColorStop(0, `rgba(150, 118, 60, ${random() * 0.07})`);
      blot.addColorStop(1, "rgba(150, 118, 60, 0)");
      context.fillStyle = blot;
      context.fillRect(x - size, y - size, size * 2, size * 2);
    }

    context.strokeStyle = DIAL_INK;
    context.fillStyle = DIAL_INK;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Escala de graus na borda, entre dois círculos.
    for (const [ring, width] of [
      [0.965, 5],
      [0.905, 4],
      [DIAL_ROSE.ring, 4],
      [DIAL_ROSE.waist * 2.2, 3],
    ] as const) {
      context.lineWidth = width;
      context.beginPath();
      context.arc(center, center, radius * ring, 0, Math.PI * 2);
      context.stroke();
    }
    for (let tick = 0; tick < DIAL_TICK_COUNT; tick += 1) {
      const angle = (tick / DIAL_TICK_COUNT) * Math.PI * 2;
      const isTen = tick % 10 === 0;
      const isFive = tick % 5 === 0;
      context.lineWidth = isTen ? 6 : 3;
      context.beginPath();
      context.moveTo(...at(angle, isTen ? 0.905 : isFive ? 0.925 : 0.94));
      context.lineTo(...at(angle, 0.965));
      context.stroke();
    }
    context.font = `400 50px ${SERIF}`;
    for (let degrees = 0; degrees < 360; degrees += DIAL_DEGREE_LABEL_STEP) {
      const angle = (degrees / 180) * Math.PI;
      const [x, y] = at(angle, 0.855);
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillText(String(degrees), 0, 0);
      context.restore();
    }

    // Raios finos atrás da rosa.
    context.lineWidth = 2.5;
    for (let ray = 0; ray < 32; ray += 1) {
      const angle = (ray / 32) * Math.PI * 2;
      context.beginPath();
      context.moveTo(...at(angle, DIAL_ROSE.waist * 2.2));
      context.lineTo(...at(angle, DIAL_ROSE.rays));
      context.stroke();
    }

    // Rosa de oito pontas: cada ponta é um losango, metade cheia e metade vazada.
    const drawPoint = (angle: number, length: number) => {
      const tip = at(angle, length);
      const before = at(angle - Math.PI / 4, DIAL_ROSE.waist);
      const after = at(angle + Math.PI / 4, DIAL_ROSE.waist);
      context.lineWidth = 4;
      context.fillStyle = DIAL_PAPER;
      context.beginPath();
      context.moveTo(center, center);
      context.lineTo(...before);
      context.lineTo(...tip);
      context.lineTo(...after);
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = DIAL_INK;
      context.beginPath();
      context.moveTo(center, center);
      context.lineTo(...tip);
      context.lineTo(...after);
      context.closePath();
      context.fill();
    };
    for (let point = 0; point < 4; point += 1) drawPoint(((point + 0.5) / 4) * Math.PI * 2, DIAL_ROSE.diagonal);
    for (let point = 0; point < 4; point += 1) drawPoint((point / 4) * Math.PI * 2, DIAL_ROSE.cardinal);

    context.fillStyle = DIAL_INK;
    context.font = `700 150px ${SERIF}`;
    DIAL_CARDINALS.forEach((label, index) => {
      context.fillText(label, ...at((index / DIAL_CARDINALS.length) * Math.PI * 2, 0.73));
    });
    context.font = `700 62px ${SERIF}`;
    DIAL_DIAGONALS.forEach((label, index) => {
      const angle = ((index + 0.5) / DIAL_DIAGONALS.length) * Math.PI * 2;
      const [x, y] = at(angle, 0.7);
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillText(label, 0, 0);
      context.restore();
    });

    // O 8, pequeno, onde as bússolas antigas trazem a flor-de-lis.
    context.font = `italic 700 74px ${SERIF}`;
    context.fillText("8", ...at(0, 0.635));

    // Fibras do papel: fiozinhos claros e escuros por cima de tudo, tinta inclusive.
    context.lineCap = "round";
    for (let fiber = 0; fiber < DIAL_FIBER_COUNT; fiber += 1) {
      const x = random() * DIAL_SIZE;
      const y = random() * DIAL_SIZE;
      const angle = random() * Math.PI * 2;
      const length = 12 + random() * 46;
      context.strokeStyle = random() > 0.5 ? `rgba(255, 248, 225, ${0.05 + random() * 0.12})` : `rgba(110, 84, 44, ${0.04 + random() * 0.08})`;
      context.lineWidth = 0.8 + random() * 1.4;
      context.beginPath();
      context.moveTo(x, y);
      context.quadraticCurveTo(
        x + Math.cos(angle) * length * 0.5 + (random() - 0.5) * 14,
        y + Math.sin(angle) * length * 0.5 + (random() - 0.5) * 14,
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length,
      );
      context.stroke();
    }
    // Grão: nenhum papel impresso tem cor chapada de pixel para pixel.
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let offset = 0; offset < image.data.length; offset += 4) {
      const grain = (random() - 0.5) * 2 * DIAL_GRAIN;
      image.data[offset] += grain;
      image.data[offset + 1] += grain;
      image.data[offset + 2] += grain;
    }
    context.putImageData(image, 0, 0);
    texture.needsUpdate = true;
  });

  return texture;
}

/* -------------------------------------------------------------- bola 8 */

const BALL_TEXTURE_WIDTH = 2048;
const BALL_TEXTURE_HEIGHT = 1024;
/** Raio do círculo claro, em raios da bola. */
const BALL_BADGE_RADIUS = 0.42;
/** Largura da borda suavizada (antisserrilhado), em raios da bola, na resolução cheia. */
const BALL_EDGE_SOFTNESS = 0.004;
/** Altura do número em relação ao diâmetro do círculo. */
const BALL_NUMERAL_HEIGHT = 0.5;
const BALL_BLACK = [7, 7, 9] as const;
/** Marfim: o círculo das bolas de sinuca não é branco puro. */
const BALL_IVORY = [240, 233, 214] as const;
const NUMERAL_CANVAS = 512;
/** Tamanho de fonte necessário para o número ter 1 de altura (o "8" ocupa ~72% da fonte). */
const FONT_SIZE_PER_NUMERAL_HEIGHT = 1.38;

/**
 * Um "8" em tipografia de verdade, centralizado num quadrado. Devolve quanta
 * tinta há em cada ponto; `x` e `y` vão de -1 a 1 (y para cima).
 */
export function createNumeralMask(font: string, height: number) {
  const { context } = createCanvas(NUMERAL_CANVAS, NUMERAL_CANVAS);
  if (!context) return () => 0;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, NUMERAL_CANVAS, NUMERAL_CANVAS);
  context.fillStyle = "#ffffff";
  context.font = `${font.replace("SIZE", `${NUMERAL_CANVAS * height * FONT_SIZE_PER_NUMERAL_HEIGHT}px`)}`;
  context.textAlign = "center";
  // Centraliza pela caixa real do desenho do número, não pela linha de base.
  const metrics = context.measureText("8");
  const baseline = NUMERAL_CANVAS / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  context.fillText("8", NUMERAL_CANVAS / 2, baseline);
  const pixels = context.getImageData(0, 0, NUMERAL_CANVAS, NUMERAL_CANVAS).data;

  return (x: number, y: number) => {
    const column = Math.round(((x + 1) / 2) * (NUMERAL_CANVAS - 1));
    const row = Math.round(((1 - y) / 2) * (NUMERAL_CANVAS - 1));
    if (column < 0 || row < 0 || column >= NUMERAL_CANVAS || row >= NUMERAL_CANVAS) return 0;
    return pixels[(row * NUMERAL_CANVAS + column) * 4] / 255;
  };
}


/**
 * Pintura da bola 8. Cada pixel é calculado olhando a bola de frente, então o
 * círculo e o 8 não saem deformados.
 */
export function createEightBallTexture({ detail, schedule }: TextureSettings = FULL_TEXTURES) {
  const width = Math.round(BALL_TEXTURE_WIDTH * detail);
  const height = Math.round(BALL_TEXTURE_HEIGHT * detail);
  const { canvas, context } = createCanvas(width, height);
  const texture = toColorTexture(canvas);
  // Com menos pixels a borda precisa ser mais larga para continuar lisa.
  const softness = BALL_EDGE_SOFTNESS / detail;

  schedule(() => {
    if (!context) return;
    const numeral = createNumeralMask(`400 SIZE ${ROUNDED}`, BALL_NUMERAL_HEIGHT);
    const image = context.createImageData(width, height);
    forEachSphereTexel(width, height, (x, y, z, offset) => {
      let ivory = 0;
      if (z > 0) {
        const badge = 1 - smoothstep(-softness, softness, Math.hypot(x, y) - BALL_BADGE_RADIUS);
        ivory = badge * (1 - numeral(x / BALL_BADGE_RADIUS, y / BALL_BADGE_RADIUS));
      }
      for (let channel = 0; channel < 3; channel += 1) {
        image.data[offset + channel] = BALL_BLACK[channel] + (BALL_IVORY[channel] - BALL_BLACK[channel]) * ivory;
      }
      image.data[offset + 3] = 255;
    });
    context.putImageData(image, 0, 0);
    texture.needsUpdate = true;
  });

  return texture;
}
