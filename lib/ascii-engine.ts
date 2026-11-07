/**
 * Motor comum dos efeitos de caracteres (porte do protótipo `prototipos/pontilhismo`).
 *
 * O vídeo é guardado quadro a quadro na memória; a cada quadro de tela ele é
 * desenhado numa grade pequena e cada célula com cor vira um caractere.
 * Cada efeito (`ascii-bloom`, `ascii-betta`) só descreve a sua cena: recorte,
 * tinta, cor e o relógio que diz qual instante do vídeo mostrar.
 */

const CHARS = " .:-=+*#%@";
const VIDEO_FPS = 24;
/** Duração de um quadro do vídeo (s). */
export const FRAME_SECONDS = 1 / VIDEO_FPS;
/** Entrada: tempo total da pincelada e de cada caractere. */
const REVEAL_MS = 2600;
const EACH_MS = 700;
const MOUSE_RADIUS = 70;
const INK_MIN = 0.3;
/** Letra: peso da fonte e tamanho em relação à célula (> 1 = os caracteres se encostam e preenchem). */
const GLYPH = { weight: 900, scale: 1.5 } as const;
const FALLBACK_FONT = "ui-monospace, Menlo, monospace";
/**
 * Ímã do "8" (da base8): o mouse puxa as letras de perto para as vagas de um 8
 * e empurra as outras, abrindo o círculo em volta.
 * `top`/`bottom`: raios das duas voltas, em fração de `MOUSE_RADIUS`;
 * `spacing`: distância entre vagas, em fração da célula;
 * `grab`/`hold`: até que distância (fração de `MOUSE_RADIUS`, medida da casa da letra)
 * o ímã pega uma letra nova / segura a que já pegou;
 * `pull`: quanto a letra anda até a vaga por quadro (0–1).
 */
const EIGHT = { top: 0.26, bottom: 0.3, spacing: 0.8, grab: 1.1, hold: 1.5, pull: 0.2 } as const;
/** Vizinhos de 4 (dx, dy) usados no realce de borda. */
const NEIGHBORS = [1, 0, -1, 0, 0, 1, 0, -1] as const;

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

type Frame = { t: number; bmp: ImageBitmap };

type Particle = {
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
type EightSlot = { x: number; y: number };

type Grid = {
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

export const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

/** Vagas do 8 (duas voltas empilhadas), espaçadas de `step` px e centradas no mouse. */
function buildEightSlots(step: number): EightSlot[] {
  const rt = MOUSE_RADIUS * EIGHT.top;
  const rb = MOUSE_RADIUS * EIGHT.bottom;
  // cruzamento um pouco acima do mouse (a volta de baixo é maior), para o 8 ficar centrado
  const cross = rt - rb;
  const loops = [
    { cy: cross - rt, r: rt },
    { cy: cross + rb, r: rb },
  ];
  const slots: EightSlot[] = [];
  for (const { cy, r } of loops) {
    const count = Math.max(6, Math.round((2 * Math.PI * r) / step));
    // o topo da volta de baixo é o mesmo ponto do pé da volta de cima: pula para não dobrar a vaga
    for (let k = 0; k < count; k++) {
      const angle = Math.PI / 2 + (2 * Math.PI * k) / count;
      const x = r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (cy > cross && k === Math.round(count / 2)) continue;
      slots.push({ x, y });
    }
  }
  return slots;
}

/** Luminosidade HSL (0–1) do pixel `i` em dados RGBA. */
const lightnessAt = (d: Uint8ClampedArray, i: number) =>
  (Math.max(d[i], d[i + 1], d[i + 2]) + Math.min(d[i], d[i + 1], d[i + 2])) / 510;

function pickChar(lum: number, ink: number) {
  // mais "denso" onde a cor tem mais tinta; começa em "=": só caracteres cheios
  const k = Math.min(CHARS.length - 1, 4 + Math.floor((1 - lum) * 4 + ink * 2 + Math.random() * 1.5));
  return CHARS[k];
}

export type VividOptions = {
  /** Multiplica a saturação. */
  sat: number;
  /** Luminosidade do vídeo (p5–p95)… */
  tone: readonly [number, number];
  /** …remapeada para esta faixa no fundo da página. */
  range: readonly [number, number];
  /** Força do realce de borda. */
  edge: number;
};

/** Cores mais vivas (HSL) e tom remapeado para o fundo da página; `detail` reforça bordas. Escreve em `out`. */
export function vividHsl(r8: number, g8: number, b8: number, detail: number, { sat, tone, range, edge }: VividOptions, out: Rgb) {
  const r = r8 / 255;
  const g = g8 / 255;
  const b = b8 / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  let h = 0;
  let l = (mx + mn) / 2;
  let s = mx === mn ? 0 : (mx - mn) / (l > 0.5 ? 2 - mx - mn : mx + mn);
  if (mx !== mn) {
    const d = mx - mn;
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  s = Math.min(1, s * sat);
  const [lo, hi] = tone;
  const u = Math.min(1, Math.max(0, (l - lo) / (hi - lo) + (detail / (hi - lo)) * edge));
  l = range[0] + u * (range[1] - range[0]);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  out[0] = Math.round(hueToChannel(p, q, h + 1 / 3) * 255);
  out[1] = Math.round(hueToChannel(p, q, h) * 255);
  out[2] = Math.round(hueToChannel(p, q, h - 1 / 3) * 255);
}

function hueToChannel(p: number, q: number, t: number) {
  t = (t + 1) % 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/** Espera um evento do vídeo; desiste (rejeita) se a animação for desligada antes. */
function waitForVideo(video: HTMLVideoElement, event: "loadeddata" | "seeked", signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener(event, handleDone);
      video.removeEventListener("error", handleError);
      signal.removeEventListener("abort", handleAbort);
    };
    const handleDone = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error("vídeo inválido"));
    };
    const handleAbort = () => {
      cleanup();
      reject(signal.reason);
    };
    if (signal.aborted) return handleAbort();
    video.addEventListener(event, handleDone);
    video.addEventListener("error", handleError);
    signal.addEventListener("abort", handleAbort);
  });
}

/** Guarda os quadros pulando o vídeo de 1/24 em 1/24 s (o arquivo vem inteiro como blob). */
async function captureFrames(src: string, scene: AsciiScene, frames: Frame[], signal: AbortSignal) {
  const res = await fetch(src, { signal });
  if (!res.ok) throw new Error("vídeo não encontrado");
  const url = URL.createObjectURL(await res.blob());
  const video = document.createElement("video");
  try {
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    const loaded = waitForVideo(video, "loadeddata", signal);
    video.src = url;
    await loaded;
    const height = Math.round((scene.frameWidth * video.videoHeight) / video.videoWidth);
    const end = Math.min(video.duration, scene.capture.to);
    for (let t = scene.capture.from; t < end; t += FRAME_SECONDS) {
      const seeked = waitForVideo(video, "seeked", signal);
      video.currentTime = t;
      await seeked;
      const bmp = await createImageBitmap(video, { resizeWidth: scene.frameWidth, resizeHeight: height, resizeQuality: "medium" });
      // desligado no meio da captura: a limpeza já rodou, então solta o quadro aqui
      if (signal.aborted) {
        bmp.close();
        return;
      }
      frames.push({ t, bmp });
    }
  } finally {
    // solta o vídeo e o blob mesmo se a captura parar no meio
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}

/** Ordem de entrada "pincelada": percorre a mancha por vizinhança (BFS), como um pincel passando. */
function orderStroke(pts: Particle[], index: Int32Array, cols: number, rows: number) {
  if (!pts.length) return;
  const dist = new Float32Array(pts.length).fill(-1);
  const byX = pts.map((_, i) => i).sort((a, b) => pts[a].gx - pts[b].gx);
  let base = 0;
  for (const seed of byX) {
    if (dist[seed] >= 0) continue;
    const queue = [seed];
    dist[seed] = base;
    let maxD = base;
    for (let h = 0; h < queue.length; h++) {
      const p = pts[queue[h]];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = p.gx + dx;
          const ny = p.gy + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const n = index[ny * cols + nx];
          if (n >= 0 && dist[n] < 0) {
            dist[n] = dist[queue[h]] + 1;
            if (dist[n] > maxD) maxD = dist[n];
            queue.push(n);
          }
        }
    }
    base = maxD * 0.6; // manchas soltas começam antes da anterior terminar
  }
  let mx = 0;
  pts.forEach((p, i) => {
    p.order = dist[i] + Math.random() * 4;
    mx = Math.max(mx, p.order);
  });
  pts.forEach((p) => (p.order /= mx || 1));
}

function readFontFamily(canvas: HTMLCanvasElement) {
  // Geist Mono (variável, carregada no layout raiz) tem peso 900: caracteres mais cheios
  const geistMono = getComputedStyle(canvas).getPropertyValue("--font-geist-mono").trim();
  return geistMono ? `${geistMono}, ui-monospace, monospace` : FALLBACK_FONT;
}

/**
 * Troca de cena (`show` com outra cena): as letras do desenho atual andam até
 * as casas do próximo, mudando de cor e embaralhando o caractere no caminho.
 * As duas cenas continuam animando durante a troca: cada letra sai de onde a
 * cena velha está agora e chega onde a nova está agora (nada congela).
 * `ms`: duração total; `spread`: fração do tempo em que as partidas se espalham
 * (da esquerda para a direita, com ruído); `handoff`: fração final, com todas
 * as letras já pousadas, em que a cena nova assume no lugar delas;
 * `scatter`: desvio máximo do caminho, em células.
 */
const MORPH = { ms: 2600, spread: 0.55, handoff: 0.25, scatter: 4 } as const;
/** Caracteres cheios usados no embaralhamento do meio da troca. */
const SCRAMBLE = "=+*#%@";

/**
 * Letra pronta para pintar (posição, caractere, cor, opacidade e tamanho da
 * célula); `cell`: casa na grade da cena (-1 = letra em voo).
 */
type Glyph = { x: number; y: number; ch: string; r: number; g: number; b: number; a: number; size: number; cell: number };

/** Lista de letras reaproveitada entre quadros (evita criar objetos a cada quadro). */
type GlyphList = { items: Glyph[]; count: number };

const createGlyphList = (): GlyphList => ({ items: [], count: 0 });

function pushGlyph(list: GlyphList, x: number, y: number, ch: string, r: number, g: number, b: number, a: number, size: number, cell: number) {
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
const snapshotGlyphs = (list: GlyphList): Glyph[] => list.items.slice(0, list.count).map((item) => ({ ...item }));

/** Letra em voo durante a troca de cena: de `from` (cena velha) para `to` (cena nova). */
type MorphParticle = { from: Glyph; to: Glyph; delay: number; jx: number; jy: number; ch: string };

type Morph = {
  start: number;
  particles: MorphParticle[];
  /** Letras de partida e de chegada (cada uma uma vez só; várias letras em voo podem dividir a mesma). */
  sources: Glyph[];
  targets: Glyph[];
  /** Cena que está saindo: continua animando até a troca acabar. */
  outgoing: Layer | null;
};

/** Índice casa da grade → letra da lista neste quadro (-1 = casa vazia). */
function indexByCell(list: GlyphList, size: number, index: Int32Array<ArrayBuffer>): Int32Array<ArrayBuffer> {
  const map = index.length === size ? index : new Int32Array(size);
  map.fill(-1);
  for (let i = 0; i < list.count; i++) {
    const cell = list.items[i].cell;
    if (cell >= 0 && cell < size) map[cell] = i;
  }
  return map;
}

/** Quanto a letra some por quadro quando a cena andou e não há casa ocupada por perto. */
const VACATED_FADE = 0.8;
/** Até quantas casas a letra procura uma casa ocupada quando a dela esvazia. */
const FOLLOW_RADIUS = 3;

/**
 * Atualiza a letra guardada com a da cena ao vivo. A cena continua animando:
 * se a casa da letra esvaziou, ela pula para a casa ocupada mais próxima (anda
 * junto com o desenho); sem nenhuma por perto, vai sumindo. Assim nada pousa
 * num lugar vazio — era isso que deixava um "fantasma" no fim da troca.
 */
function followLive(glyph: Glyph, list: GlyphList, map: Int32Array, cols: number, rows: number) {
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

/** Uma cena ligada ao palco, com seus quadros guardados. */
type Layer = {
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

/**
 * Casa cada letra da cena velha com a letra mais próxima da nova, comparando
 * as duas silhuetas esticadas para a mesma caixa (o rabo do peixe vai para a
 * ponta do gato, a cabeça para a cabeça). Letras novas que ninguém pegou saem
 * da letra velha mais próxima. Sem uma das cenas, as letras só aparecem/somem.
 */
function pairGlyphs(from: Glyph[], to: Glyph[], cell: number): MorphParticle[] {
  const particle = (a: Glyph, b: Glyph, sourceX: number): MorphParticle => {
    const angle = Math.random() * Math.PI * 2;
    const scatter = Math.random() * MORPH.scatter * cell;
    return {
      from: a,
      to: b,
      // partida da esquerda para a direita, com ruído: parece uma onda que mistura as letras
      delay: MORPH.spread * (0.55 * Math.random() + 0.45 * sourceX),
      jx: Math.cos(angle) * scatter,
      jy: Math.sin(angle) * scatter,
      ch: a.ch,
    };
  };
  if (!from.length) return to.map((b) => particle({ ...b, a: 0 }, b, Math.random()));
  if (!to.length) return from.map((a) => particle(a, { ...a, a: 0 }, Math.random()));

  const box = (list: Glyph[]) => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const { x, y } of list) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    return list.map(({ x, y }) => [(x - minX) / w, (y - minY) / h] as const);
  };
  const nFrom = box(from);
  const nTo = box(to);
  const nearestTo = buildNearest(nTo);
  const nearestFrom = buildNearest(nFrom);

  const particles: MorphParticle[] = [];
  const isTaken = new Uint8Array(to.length);
  for (let i = 0; i < from.length; i++) {
    const j = nearestTo(nFrom[i]);
    isTaken[j] = 1;
    particles.push(particle(from[i], to[j], nFrom[i][0]));
  }
  for (let j = 0; j < to.length; j++) {
    if (isTaken[j]) continue;
    const i = nearestFrom(nTo[j]);
    particles.push(particle(from[i], to[j], nFrom[i][0]));
  }
  return particles;
}

/** Lado da grade de baldes da busca de vizinho (pontos normalizados em 0–1). */
const BUCKETS = 32;

/**
 * Prepara a busca do ponto mais próximo (pontos em 0–1) com uma grade de
 * baldes: procura em anéis crescentes em volta do balde do ponto, em vez de
 * comparar com todos (o quadro em que a troca começa não engasga).
 */
function buildNearest(points: (readonly [number, number])[]) {
  const bucketOf = (v: number) => Math.min(BUCKETS - 1, Math.max(0, Math.floor(v * BUCKETS)));
  const buckets: number[][] = Array.from({ length: BUCKETS * BUCKETS }, () => []);
  points.forEach(([x, y], k) => buckets[bucketOf(y) * BUCKETS + bucketOf(x)].push(k));
  return ([px, py]: readonly [number, number]) => {
    const bx = bucketOf(px);
    const by = bucketOf(py);
    let best = 0;
    let bestDist2 = Infinity;
    for (let ring = 0; ring < BUCKETS; ring++) {
      // nada mais perto fora deste anel: para
      const reach = (ring - 1) / BUCKETS;
      if (ring > 0 && reach > 0 && reach * reach > bestDist2) break;
      for (let y = by - ring; y <= by + ring; y++) {
        if (y < 0 || y >= BUCKETS) continue;
        for (let x = bx - ring; x <= bx + ring; x++) {
          if (x < 0 || x >= BUCKETS) continue;
          // só a borda do anel (o miolo já foi visto)
          if (ring > 0 && y !== by - ring && y !== by + ring && x !== bx - ring && x !== bx + ring) continue;
          for (const k of buckets[y * BUCKETS + x]) {
            const dx = points[k][0] - px;
            const dy = points[k][1] - py;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < bestDist2) {
              bestDist2 = dist2;
              best = k;
            }
          }
        }
      }
    }
    return best;
  };
}

/** Palco: um canvas que mostra uma cena por vez e troca de cena com morph. */
export type AsciiStage = {
  /** Mostra a cena; se já houver outra na tela, as letras se transformam nela. */
  show: (scene: AsciiScene, src: string) => void;
  /** Desliga tudo (quadros guardados, observadores e o laço de desenho). */
  stop: () => void;
};

/**
 * Liga o palco no canvas. Cada cena só baixa o vídeo quando o canvas aparece
 * na tela; a próxima cena é preparada enquanto a atual continua animando.
 */
export function createAsciiStage(canvas: HTMLCanvasElement): AsciiStage {
  const maybeContext = canvas.getContext("2d");
  if (!maybeContext) return { show: () => {}, stop: () => {} };
  const ctx: CanvasRenderingContext2D = maybeContext;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fontFamily = readFontFamily(canvas);
  const rgb: Rgb = [0, 0, 0];
  const mouse = { x: -1e4, y: -1e4 };
  /** O que foi pintado no último quadro (ponto de partida de uma troca de cena). */
  const drawn = createGlyphList();
  /** Rascunho da cena nova no instante em que a troca começa. */
  const target = createGlyphList();
  /** Cenas ao vivo durante a troca (a que sai e a que entra) e o índice casa → letra de cada uma. */
  const outgoingLive = createGlyphList();
  const incomingLive = createGlyphList();
  let outgoingIndex = new Int32Array(0);
  let incomingIndex = new Int32Array(0);
  let current: Layer | null = null;
  let pending: Layer | null = null;
  let morph: Morph | null = null;
  let isStopped = false;
  let isVisible = false;
  let W = 0;
  let H = 0;
  let DPR = 0;
  let cellSize = 0;
  let raf = 0;
  // buffers da máscara de manchas grandes, refeitos só quando a grade muda de tamanho
  let lit = new Uint8Array(0);
  let labels = new Int32Array(0);
  let stack = new Int32Array(0);
  let keep = new Uint8Array(0);

  // a fonte da página só baixa quando usada no DOM: pede o peso 900 para o canvas
  document.fonts.load(`${GLYPH.weight} 16px ${fontFamily}`).then(schedule, () => {});

  function createLayer(scene: AsciiScene, src: string): Layer {
    return {
      scene,
      src,
      clock: scene.createClock(),
      frames: [],
      abort: new AbortController(),
      isCaptured: false,
      hasFailed: false,
      hasStartedCapture: false,
      grid: null,
      isRevealed: false,
    };
  }

  function releaseLayer(layer: Layer) {
    layer.abort.abort();
    layer.frames.forEach((f) => f.bmp.close());
    layer.frames.length = 0;
  }

  function startCapture(layer: Layer) {
    if (layer.hasStartedCapture) return;
    layer.hasStartedCapture = true;
    captureFrames(layer.src, layer.scene, layer.frames, layer.abort.signal)
      .then(() => {
        layer.isCaptured = true;
        schedule();
      })
      .catch(() => (layer.hasFailed = true));
  }

  function currentPose(layer: Layer, g: Grid, now: number): Pose {
    const { frames, isCaptured, scene } = layer;
    const lastFrameT = frames[frames.length - 1].t;
    const pose = reducedMotion ? scene.staticPose : layer.clock(now, Math.max(0, now - g.start), { isCaptured, lastFrameT });
    // durante a captura, o tempo não passa do último quadro guardado
    return isCaptured ? pose : { t: Math.min(pose.t, lastFrameT), rot: pose.rot };
  }

  /** Desenha o vídeo na grade pequena, girado em volta do pé do quadro e misturando quadros vizinhos. */
  function sample(layer: Layer, g: Grid, pose: Pose) {
    const { frames, scene } = layer;
    let lo = 0;
    let hi = frames.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (frames[mid].t <= pose.t) lo = mid;
      else hi = mid - 1;
    }
    const a = frames[lo];
    let b: Frame | undefined = frames[lo + 1];
    let bt = b?.t ?? 0;
    // loop: depois do último quadro vem o primeiro, misturado como os outros (sem travadinha)
    if (!b && layer.isCaptured && scene.loopEnd !== undefined) {
      b = frames[0];
      bt = scene.loopEnd;
    }
    const [sx, sy, sw, sh] = g.src;
    const [dx, dy, dw, dh] = g.dst;
    const cx = g.cx;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.globalAlpha = 1;
    cx.fillStyle = scene.background;
    cx.fillRect(0, 0, g.cols, g.rows);
    cx.translate(dx + dw / 2, dy + dh);
    cx.rotate(pose.rot);
    cx.translate(-dw / 2, -dh);
    cx.drawImage(a.bmp, sx, sy, sw, sh, 0, 0, dw, dh);
    if (b && pose.t > a.t && bt > a.t) {
      cx.globalAlpha = Math.min(1, (pose.t - a.t) / (bt - a.t));
      cx.drawImage(b.bmp, sx, sy, sw, sh, 0, 0, dw, dh);
      cx.globalAlpha = 1;
    }
    if (scene.edgeFade) fadeEdges(cx, scene.background, dw, dh, scene.edgeFade);
    cx.setTransform(1, 0, 0, 1, 0, 0);
    return cx.getImageData(0, 0, g.cols, g.rows).data;
  }

  function fadeEdges(cx: CanvasRenderingContext2D, background: string, dw: number, dh: number, amount: number) {
    const ex = dw * amount;
    const ey = dh * amount;
    const fades: [number, number, number, number, number, number, number, number][] = [
      [0, 0, ex, 0, 0, 0, ex, dh],
      [dw, 0, dw - ex, 0, dw - ex, 0, ex, dh],
      [0, 0, 0, ey, 0, 0, dw, ey],
      [0, dh, 0, dh - ey, 0, dh - ey, dw, ey],
    ];
    for (const [x0, y0, x1, y1, rx, ry, rw, rh] of fades) {
      const grad = cx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, background);
      grad.addColorStop(1, "transparent");
      cx.fillStyle = grad;
      cx.fillRect(rx, ry, rw, rh);
    }
  }

  /** Marca as células com tinta e guarda só as manchas grandes (vizinhança de 8). */
  function bigBlobs(scene: AsciiScene, g: Grid, d: Uint8ClampedArray) {
    const n = g.cols * g.rows;
    if (lit.length !== n) {
      lit = new Uint8Array(n);
      labels = new Int32Array(n);
      stack = new Int32Array(n);
      keep = new Uint8Array(n);
    }
    for (let i = 0; i < n; i++) lit[i] = scene.inkOf(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) >= INK_MIN ? 1 : 0;
    labels.fill(0);
    const sizes = [0];
    let largest = 0;
    for (let i = 0; i < n; i++) {
      if (!lit[i] || labels[i]) continue;
      const id = sizes.length;
      let top = 0;
      let size = 0;
      stack[top++] = i;
      labels[i] = id;
      while (top) {
        const j = stack[--top];
        const x = j % g.cols;
        const y = (j / g.cols) | 0;
        size++;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
            const k = ny * g.cols + nx;
            if (lit[k] && !labels[k]) {
              labels[k] = id;
              stack[top++] = k;
            }
          }
      }
      sizes.push(size);
      if (size > largest) largest = size;
    }
    const min = Math.max(25, 0.06 * largest);
    for (let i = 0; i < n; i++) keep[i] = labels[i] && sizes[labels[i]] >= min ? 1 : 0;
    return keep;
  }

  /** Realce de borda: luminosidade do ponto menos a média dos vizinhos com tinta. */
  function edgeDetail(scene: AsciiScene, g: Grid, d: Uint8ClampedArray, gx: number, gy: number) {
    let sum = 0;
    let n = 0;
    for (let k = 0; k < NEIGHBORS.length; k += 2) {
      const x = gx + NEIGHBORS[k];
      const y = gy + NEIGHBORS[k + 1];
      if (x < 0 || y < 0 || x >= g.cols || y >= g.rows) continue;
      const i = (y * g.cols + x) * 4;
      if (scene.inkOf(d[i], d[i + 1], d[i + 2]) < INK_MIN) continue;
      sum += lightnessAt(d, i);
      n++;
    }
    return n ? lightnessAt(d, (gy * g.cols + gx) * 4) - sum / n : 0;
  }

  function buildGrid(layer: Layer, start: number): Grid | null {
    const first = layer.frames[0];
    const { scene } = layer;
    // caractere proporcional ao palco, com piso para continuar legível em telas menores
    const cell = Math.max(scene.cell.min, Math.round(Math.min(W, H) / scene.cell.divisor));
    const cols = Math.ceil(W / cell);
    const rows = Math.ceil(H / cell);
    if (!first || cols < 2 || rows < 2) return null;
    const crop = scene.crop ?? { x: 0, y: 0, w: 1, h: 1 };
    const fw = first.bmp.width * crop.w;
    const fh = first.bmp.height * crop.h;
    const s = Math.min((W * scene.fit) / fw, (H * scene.fit) / fh);
    const cnv = document.createElement("canvas");
    cnv.width = cols;
    cnv.height = rows;
    const cx = cnv.getContext("2d", { willReadFrequently: true });
    if (!cx) return null;
    cx.imageSmoothingQuality = "high";
    const dw = (fw * s) / cell;
    const dh = (fh * s) / cell;
    const ox = (W - cols * cell) / 2;
    const oy = (H - rows * cell) / 2;
    const g: Grid = {
      cols,
      rows,
      cell,
      cx,
      src: [crop.x * first.bmp.width, crop.y * first.bmp.height, fw, fh],
      dst: [(cols - dw) / 2, (rows - dh) / 2, dw, dh],
      start,
      particles: [],
      slots: [],
      slotOwner: new Int32Array(0),
    };
    g.slots = buildEightSlots(cell * EIGHT.spacing);
    g.slotOwner = new Int32Array(g.slots.length);
    const d = sample(layer, g, { t: first.t, rot: 0 });
    // entrada pela silhueta do primeiro quadro; o resto (o que surge depois) aparece no fim
    const index = new Int32Array(cols * rows).fill(-1);
    const litParticles: Particle[] = [];
    const rest: Particle[] = [];
    for (let gy = 0; gy < rows; gy++)
      for (let gx = 0; gx < cols; gx++) {
        const i = (gy * cols + gx) * 4;
        const tx = ox + gx * cell + cell / 2;
        const ty = oy + gy * cell + cell / 2;
        const p: Particle = { gx, gy, tx, ty, x: tx, y: ty, order: 1, ink: 0, lum: 0.5, ch: "", vx: 0, vy: 0, ox: 0, oy: 0, slot: -1 };
        if (scene.inkOf(d[i], d[i + 1], d[i + 2]) >= INK_MIN) {
          index[gy * cols + gx] = litParticles.length;
          litParticles.push(p);
        } else rest.push(p);
      }
    orderStroke(litParticles, index, cols, rows);
    rest.forEach((p) => (p.order = 0.85 + Math.random() * 0.15));
    g.particles = litParticles.concat(rest);
    cellSize = cell;
    return g;
  }

  /**
   * Calcula as letras da cena neste quadro e as acrescenta em `out`, com a
   * opacidade multiplicada por `alpha`. `isMagnetOn`: o mouse mexe nas letras.
   */
  function render(layer: Layer, g: Grid, now: number, out: GlyphList, alpha: number, isMagnetOn: boolean) {
    const { scene } = layer;
    const pose = currentPose(layer, g, now);
    const revealMs = now - g.start;
    const d = sample(layer, g, pose);
    const mask = scene.keepBigBlobs ? bigBlobs(scene, g, d) : null;
    const grab2 = (MOUSE_RADIUS * EIGHT.grab) ** 2;
    const hold2 = (MOUSE_RADIUS * EIGHT.hold) ** 2;
    g.slotOwner.fill(-1);
    // letras perto do mouse ainda sem vaga: ganham uma depois do laço
    const candidates: { index: number; dist2: number }[] = [];
    for (let index = 0; index < g.particles.length; index++) {
      const p = g.particles[index];
      // letra que some neste quadro (sem tinta, fora da mancha) solta a vaga
      const heldSlot = p.slot;
      p.slot = -1;
      const e = reducedMotion || layer.isRevealed ? 1 : ease((revealMs - p.order * REVEAL_MS) / EACH_MS);
      if (e <= 0) continue;
      const cellIndex = p.gy * g.cols + p.gx;
      if (mask && !mask[cellIndex]) continue;
      const i = cellIndex * 4;
      const r = d[i];
      const gr = d[i + 1];
      const b = d[i + 2];
      const ink = scene.inkOf(r, gr, b);
      if (ink < INK_MIN) continue;
      scene.color(r, gr, b, edgeDetail(scene, g, d, p.gx, p.gy), rgb);
      const luminance = (0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]) / 255;
      p.ink = ink;
      p.lum = scene.isDarkBackground ? 1 - luminance : luminance;
      // o caractere foi escolhido com outro tom (algo que surgiu ou virou): escolhe de novo
      if (p.chInk === undefined || p.chLum === undefined || Math.abs(p.ink - p.chInk) > 0.25 || Math.abs(p.lum - p.chLum) > 0.2) {
        p.ch = pickChar(p.lum, p.ink);
        p.chInk = p.ink;
        p.chLum = p.lum;
      } else if (!reducedMotion && Math.random() < 0.004) p.ch = pickChar(p.lum, p.ink);
      // ímã: segura a vaga enquanto a casa da letra estiver perto do mouse
      const hdx = p.tx - mouse.x;
      const hdy = p.ty - mouse.y;
      const home2 = hdx * hdx + hdy * hdy;
      if (heldSlot >= 0 && isMagnetOn && home2 <= hold2 && g.slotOwner[heldSlot] < 0) p.slot = heldSlot;
      if (p.slot >= 0) {
        // presa no 8: anda até a vaga e acompanha o mouse
        g.slotOwner[p.slot] = index;
        const slot = g.slots[p.slot];
        p.ox += (mouse.x + slot.x - p.tx - p.ox) * EIGHT.pull;
        p.oy += (mouse.y + slot.y - p.ty - p.oy) * EIGHT.pull;
        p.vx = p.vy = 0;
      } else {
        if (isMagnetOn && home2 < grab2) candidates.push({ index, dist2: home2 });
        // empurrão do mouse (abre o círculo em volta do 8), com mola de volta
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dd = dx * dx + dy * dy;
        if (dd < MOUSE_RADIUS * MOUSE_RADIUS && isMagnetOn) {
          const dist = Math.sqrt(dd);
          const f = (1 - dist / MOUSE_RADIUS) * 2.2;
          p.vx += (dx / (dist + 1)) * f;
          p.vy += (dy / (dist + 1)) * f;
        }
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.ox = p.ox * 0.9 + p.vx;
        p.oy = p.oy * 0.9 + p.vy;
      }
      p.x = p.tx + p.ox;
      p.y = p.ty + p.oy;
      pushGlyph(out, p.x, p.y, p.ch, rgb[0], rgb[1], rgb[2], e * alpha, g.cell, cellIndex);
    }
    if (candidates.length) fillEightSlots(g, candidates);
  }

  /**
   * Distribui as vagas livres do 8: as letras mais perto do mouse escolhem
   * primeiro, cada uma a vaga livre mais próxima de onde está agora.
   * Elas começam a andar no próximo quadro.
   */
  function fillEightSlots(g: Grid, candidates: { index: number; dist2: number }[]) {
    let free = 0;
    for (let s = 0; s < g.slotOwner.length; s++) if (g.slotOwner[s] < 0) free++;
    if (!free) return;
    candidates.sort((a, b) => a.dist2 - b.dist2);
    for (const { index } of candidates) {
      const p = g.particles[index];
      let best = -1;
      let bestDist2 = Infinity;
      for (let s = 0; s < g.slots.length; s++) {
        if (g.slotOwner[s] >= 0) continue;
        const sx = mouse.x + g.slots[s].x - p.x;
        const sy = mouse.y + g.slots[s].y - p.y;
        const dist2 = sx * sx + sy * sy;
        if (dist2 < bestDist2) {
          bestDist2 = dist2;
          best = s;
        }
      }
      g.slotOwner[best] = index;
      p.slot = best;
      if (--free === 0) return;
    }
  }

  /** Letras em voo: posição, cor, opacidade e caractere misturados de uma cena para a outra. */
  function renderMorph(m: Morph, k: number, out: GlyphList, alpha: number) {
    // todas pousam antes da passagem final: nela, a cena nova assume com as letras já no lugar
    const flight = k / (1 - MORPH.handoff);
    const travel = 1 - MORPH.spread;
    for (const p of m.particles) {
      const u = Math.min(1, Math.max(0, (flight - p.delay) / travel));
      const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      const { from, to } = p;
      // desvia do caminho reto no meio do voo: as letras se espalham e se misturam
      const bend = Math.sin(Math.PI * e);
      if (e <= 0.12) p.ch = from.ch;
      else if (e >= 0.88) p.ch = to.ch;
      else if (Math.random() < 0.3) p.ch = SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
      pushGlyph(
        out,
        from.x + (to.x - from.x) * e + p.jx * bend,
        from.y + (to.y - from.y) * e + p.jy * bend,
        p.ch,
        Math.round(from.r + (to.r - from.r) * e),
        Math.round(from.g + (to.g - from.g) * e),
        Math.round(from.b + (to.b - from.b) * e),
        (from.a + (to.a - from.a) * e) * alpha,
        // cada cena tem o próprio tamanho de letra: muda aos poucos durante o voo
        from.size + (to.size - from.size) * e,
        -1,
      );
    }
  }

  function paint(list: GlyphList) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let fontPx = -1;
    for (let i = 0; i < list.count; i++) {
      const glyph = list.items[i];
      if (glyph.a <= 0.01) continue;
      // tamanho em meios pixels: troca a fonte só quando muda de verdade
      const px = Math.round(glyph.size * GLYPH.scale * 2) / 2;
      if (px !== fontPx) {
        fontPx = px;
        ctx.font = `${GLYPH.weight} ${px}px ${fontFamily}`;
      }
      ctx.globalAlpha = Math.min(1, glyph.a);
      ctx.fillStyle = `rgb(${glyph.r},${glyph.g},${glyph.b})`;
      ctx.fillText(glyph.ch, glyph.x, glyph.y);
    }
    ctx.globalAlpha = 1;
  }

  /** Encerra a troca em andamento e solta a cena que estava saindo. */
  function endMorph() {
    if (morph?.outgoing) releaseLayer(morph.outgoing);
    morph = null;
  }

  /** A cena seguinte tem o primeiro quadro: começa a troca a partir do que está na tela. */
  function beginMorph(next: Layer, now: number) {
    const from = snapshotGlyphs(drawn);
    // troca interrompida por outra: a cena que ainda saía já não aparece
    endMorph();
    const outgoing = current;
    current = next;
    pending = null;
    // sem nada na tela (ou menos movimento): só entra, com a pincelada de sempre
    const grid = from.length && !reducedMotion ? buildGrid(next, now) : null;
    if (!grid) {
      if (outgoing) releaseLayer(outgoing);
      return;
    }
    // a cena nova já começa a animar agora, por baixo das letras em voo
    next.grid = grid;
    next.isRevealed = true;
    target.count = 0;
    render(next, grid, now, target, 1, false);
    const targets = snapshotGlyphs(target);
    morph = { start: now, particles: pairGlyphs(from, targets, cellSize), sources: from, targets, outgoing };
  }

  /** As duas cenas andam um quadro; as letras em voo seguem a casa delas em cada uma. */
  function followScenes(m: Morph, layer: Layer | null, now: number) {
    outgoingLive.count = 0;
    incomingLive.count = 0;
    const out = m.outgoing;
    if (out?.grid) {
      render(out, out.grid, now, outgoingLive, 1, false);
      outgoingIndex = indexByCell(outgoingLive, out.grid.cols * out.grid.rows, outgoingIndex);
    }
    if (layer?.grid) {
      render(layer, layer.grid, now, incomingLive, 1, false);
      incomingIndex = indexByCell(incomingLive, layer.grid.cols * layer.grid.rows, incomingIndex);
    }
    if (out?.grid) for (const glyph of m.sources) followLive(glyph, outgoingLive, outgoingIndex, out.grid.cols, out.grid.rows);
    if (layer?.grid) for (const glyph of m.targets) followLive(glyph, incomingLive, incomingIndex, layer.grid.cols, layer.grid.rows);
  }

  function draw(now: number) {
    raf = 0;
    if (isStopped) return;
    if (pending?.hasFailed) {
      releaseLayer(pending);
      pending = null;
    }
    if (pending && pending.frames.length && W > 10) beginMorph(pending, now);
    const layer = current;
    if (layer && !layer.grid && layer.frames.length && W > 10) layer.grid = buildGrid(layer, now);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawn.count = 0;
    if (morph) {
      const k = (now - morph.start) / MORPH.ms;
      if (k >= 1) endMorph();
      else {
        followScenes(morph, layer, now);
        // fim da troca: a cena nova, já animada, assume no lugar das letras em voo
        const handoff = Math.min(1, Math.max(0, (k - (1 - MORPH.handoff)) / MORPH.handoff));
        renderMorph(morph, k, drawn, 1 - handoff);
        if (handoff > 0) {
          for (let i = 0; i < incomingLive.count; i++) {
            const glyph = incomingLive.items[i];
            pushGlyph(drawn, glyph.x, glyph.y, glyph.ch, glyph.r, glyph.g, glyph.b, glyph.a * handoff, glyph.size, glyph.cell);
          }
        }
      }
    }
    if (!morph && layer?.grid) render(layer, layer.grid, now, drawn, 1, !reducedMotion);
    paint(drawn);
    // menos movimento: a imagem é fixa, então para depois de desenhar o vídeo inteiro uma vez
    const isSettled = reducedMotion && !pending && !!layer?.isCaptured && !!layer.grid;
    if (!isSettled && !(layer?.hasFailed && !pending)) schedule();
  }

  function schedule() {
    if (!raf && isVisible && !isStopped) raf = requestAnimationFrame(draw);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    // o observador sempre avisa uma vez ao começar: sem mudança, não refaz a entrada
    if (r.width === W && r.height === H && dpr === DPR) return;
    DPR = dpr;
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    // refaz a grade (e a entrada) no próximo quadro; uma troca no meio do caminho é cortada
    endMorph();
    if (current) {
      current.grid = null;
      current.isRevealed = false;
    }
    schedule();
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resizeObserver.observe(canvas);
  // fora da tela (ou oculto por `hidden`): não baixa o vídeo e para o laço de desenho
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) {
      if (current) startCapture(current);
      if (pending) startCapture(pending);
    }
    schedule();
  });
  visibilityObserver.observe(canvas);

  const handlePointerMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  };
  const handlePointerLeave = () => {
    mouse.x = mouse.y = -1e4;
  };
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);

  resize();

  return {
    show(scene, src) {
      if (isStopped) return;
      const shown = pending ?? current;
      if (shown && shown.scene === scene && shown.src === src) return;
      if (pending) releaseLayer(pending);
      const layer = createLayer(scene, src);
      if (current) pending = layer;
      else current = layer;
      if (isVisible) startCapture(layer);
      schedule();
    },
    stop() {
      isStopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      endMorph();
      if (current) releaseLayer(current);
      if (pending) releaseLayer(pending);
    },
  };
}

/**
 * Liga uma cena só no canvas. Devolve a função que desliga tudo (quadros
 * guardados, observadores e o laço de desenho).
 */
export function startAsciiScene(canvas: HTMLCanvasElement, scene: AsciiScene, src: string) {
  const stage = createAsciiStage(canvas);
  stage.show(scene, src);
  return stage.stop;
}
