import type { Glyph } from "./glyph-list";

export type Rgb = [number, number, number];
/** Instante do vídeo e giro (rad) em volta do pé do quadro. */
export type Pose = { t: number; rot: number };
export type ClockState = { isCaptured: boolean; lastFrameT: number };

export type AsciiScene = {
  /** Largura dos quadros guardados (a altura segue a proporção do vídeo). */
  frameWidth: number;
  /** Trecho do vídeo guardado (s); `to` é exclusivo. */
  capture: { from: number; to: number };
  /** Recorte do quadro, em fração do vídeo (padrão: quadro inteiro). */
  crop?: { x: number; y: number; w: number; h: number };
  /** Cor do fundo do vídeo, usada fora do quadro. */
  background: string;
  /** Tamanho da célula: `min(largura, altura) / divisor`, com piso `min`. */
  cell: { min: number; divisor: number };
  /** Quanto do palco o vídeo ocupa (0–1). */
  fit: number;
  /** Esfuma as bordas do vídeo (fração do quadro) para não aparecer um corte reto. */
  edgeFade?: number;
  /** Vídeo em loop: depois do último quadro vem o primeiro, como se estivesse em `loopEnd`. */
  loopEnd?: number;
  /** Desenha só as manchas grandes (descarta pontos soltos, como bolhas). */
  keepBigBlobs?: boolean;
  /** Fundo escuro: o claro ganha caractere denso. */
  isDarkBackground: boolean;
  /** Quanto de tinta (0–1) uma cor do vídeo tem; abaixo de 0,3 não desenha. */
  inkOf: (r: number, g: number, b: number) => number;
  /** Escreve em `out` a cor final do caractere; `detail` é o realce de borda. */
  color: (r: number, g: number, b: number, detail: number, out: Rgb) => void;
  /** Pose fixa para quem pede menos movimento. */
  staticPose: Pose;
  /** Cria o relógio da cena: diz a pose a cada quadro de tela. */
  createClock: () => (now: number, elapsedMs: number, state: ClockState) => Pose;
};

export type Frame = { t: number; bmp: ImageBitmap };

export type Particle = {
  gx: number;
  gy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  order: number;
  ink: number;
  lum: number;
  ch: string;
  chInk?: number;
  chLum?: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  /** Vaga do 8 que a letra ocupa (-1 = solta). */
  slot: number;
};

/** Vaga do 8, relativa ao mouse. */
export type EightSlot = { x: number; y: number };

export type Grid = {
  cols: number;
  rows: number;
  cell: number;
  cx: CanvasRenderingContext2D;
  src: [number, number, number, number];
  dst: [number, number, number, number];
  start: number;
  particles: Particle[];
  /** Vagas do 8 e quem ocupa cada uma neste quadro (índice da letra, -1 = livre). */
  slots: EightSlot[];
  slotOwner: Int32Array;
};

/** Uma cena ligada ao palco, com seus quadros guardados. */
export type Layer = {
  scene: AsciiScene;
  src: string;
  clock: ReturnType<AsciiScene["createClock"]>;
  frames: Frame[];
  abort: AbortController;
  isCaptured: boolean;
  hasFailed: boolean;
  hasStartedCapture: boolean;
  grid: Grid | null;
  /** Já entra inteira (veio de uma troca de cena): pula a pincelada de entrada. */
  isRevealed: boolean;
};

/** Letra em voo durante a troca de cena: de `from` (cena velha) para `to` (cena nova). */
export type MorphParticle = { from: Glyph; to: Glyph; delay: number; jx: number; jy: number; ch: string };

export type Morph = {
  start: number;
  particles: MorphParticle[];
  /** Letras de partida e de chegada (cada uma uma vez só; várias letras em voo podem dividir a mesma). */
  sources: Glyph[];
  targets: Glyph[];
  /** Cena que está saindo: continua animando até a troca acabar. */
  outgoing: Layer | null;
};

/** Mouse em coordenadas da área da cena (px). */
export type Mouse = { x: number; y: number };
