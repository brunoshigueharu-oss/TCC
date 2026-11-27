import {
  BackSide,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  type WebGLRenderer,
} from "three";

import type { OrbPalette } from "./palette";

/**
 * Estúdio de fotografia de produto, montado por código. Ele não aparece na
 * página; serve só para o que os materiais refletem.
 *
 * O que separa reflexo "de computador" de reflexo "de foto" é a luz não ser
 * uniforme: softbox de verdade tem miolo quente e borda que cai, janela tem
 * caixilho, e a mesa rebate a cor do lugar. Por isso cada painel aqui é uma
 * textura com degradê, e o chão do estúdio tem a cor do fundo da página: o
 * objeto reflete por baixo o mesmo "papel" em que está pousado.
 */

const ROOM_RADIUS = 30;
/** Desfoque aplicado ao estúdio antes de virar reflexo. */
const ENVIRONMENT_BLUR = 0.02;
const PANEL_TEXTURE_SIZE = 256;
/** Acima disso o fundo da página conta como claro. */
const LIGHT_BACKGROUND_ABOVE = 0.5;

/** Claridade do teto, das paredes e do chão, para página clara e escura. */
const ROOM_TONES = {
  light: { ceiling: 0.55, wall: 0.3, floor: 0.8 },
  dark: { ceiling: 0.16, wall: 0.1, floor: 0.03 },
} as const;

type PanelKind = "softbox" | "window";

type Panel = {
  kind: PanelKind;
  position: readonly [number, number, number];
  size: readonly [number, number];
  /** Acima de 1 = mais claro que branco (a luz estoura no reflexo, como numa foto). */
  brightness: number;
  /** Temperatura da luz: nenhum estúdio tem todas as fontes do mesmo branco. */
  tint: string;
};

const PANELS: readonly Panel[] = [
  // Principal, à esquerda e à frente: o reflexo comprido das esferas.
  { kind: "softbox", position: [-9, 5, 7], size: [7, 10], brightness: 11, tint: "#fff3e2" },
  // Janela à direita: os quadradinhos de luz clássicos em bolhas e bolas.
  { kind: "window", position: [8, 6.5, 8], size: [3.6, 5.4], brightness: 22, tint: "#e8f1ff" },
  // Teto: luz geral, grande e macia.
  { kind: "softbox", position: [0, 12, 1], size: [13, 9], brightness: 4, tint: "#ffffff" },
  // Contraluz à direita: recorta a borda oposta.
  { kind: "softbox", position: [10, 1, -7], size: [2, 12], brightness: 9, tint: "#fff8ee" },
  // Contraluz fraco à esquerda: fecha o contorno do outro lado.
  { kind: "softbox", position: [-10, 3, -8], size: [2.2, 9], brightness: 4, tint: "#eef4ff" },
];

function createPanelCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = PANEL_TEXTURE_SIZE;
  return { canvas, context: canvas.getContext("2d") };
}

/** Softbox: miolo quente, queda para a borda e cantos arredondados e macios. */
function createSoftboxTexture() {
  const { canvas, context } = createPanelCanvas();
  if (context) {
    const size = PANEL_TEXTURE_SIZE;
    const margin = size * 0.1;
    const falloff = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.7);
    falloff.addColorStop(0, "rgb(255, 255, 255)");
    falloff.addColorStop(0.55, "rgb(205, 205, 205)");
    falloff.addColorStop(1, "rgb(120, 120, 120)");
    context.filter = `blur(${size * 0.03}px)`;
    context.fillStyle = falloff;
    context.beginPath();
    context.roundRect(margin, margin, size - margin * 2, size - margin * 2, size * 0.08);
    context.fill();
  }
  return new CanvasTexture(canvas);
}

const WINDOW_PANES = { columns: 2, rows: 3, gap: 0.07 } as const;

/** Janela de caixilho: vidros separados, mais claros em cima (céu). */
function createWindowTexture() {
  const { canvas, context } = createPanelCanvas();
  if (context) {
    const size = PANEL_TEXTURE_SIZE;
    const gap = size * WINDOW_PANES.gap;
    const paneWidth = (size - gap * (WINDOW_PANES.columns + 1)) / WINDOW_PANES.columns;
    const paneHeight = (size - gap * (WINDOW_PANES.rows + 1)) / WINDOW_PANES.rows;
    const sky = context.createLinearGradient(0, 0, 0, size);
    sky.addColorStop(0, "rgb(255, 255, 255)");
    sky.addColorStop(1, "rgb(150, 150, 150)");
    context.fillStyle = sky;
    for (let column = 0; column < WINDOW_PANES.columns; column += 1) {
      for (let row = 0; row < WINDOW_PANES.rows; row += 1) {
        context.fillRect(gap + column * (paneWidth + gap), gap + row * (paneHeight + gap), paneWidth, paneHeight);
      }
    }
  }
  return new CanvasTexture(canvas);
}

/** Sala: teto, parede, linha do horizonte e chão, num degradê vertical. */
function createRoomTexture(tones: { ceiling: number; wall: number; floor: number }) {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (context) {
    const gray = (value: number) => {
      const level = Math.round(Math.min(1, value) * 255);
      return `rgb(${level}, ${level}, ${level})`;
    };
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, gray(tones.ceiling));
    gradient.addColorStop(0.42, gray(tones.wall));
    gradient.addColorStop(0.5, gray(tones.wall * 0.8));
    gradient.addColorStop(0.56, gray(tones.floor));
    gradient.addColorStop(1, gray(tones.floor * 0.7));
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  return new CanvasTexture(canvas);
}

export function createOrbEnvironment(renderer: WebGLRenderer, palette: OrbPalette) {
  const studio = new Scene();
  const disposables: { dispose: () => void }[] = [];
  const background = new Color(palette.fundo);
  const isLight = background.getHSL({ h: 0, s: 0, l: 0 }).l > LIGHT_BACKGROUND_ABOVE;

  const roomTexture = createRoomTexture(isLight ? ROOM_TONES.light : ROOM_TONES.dark);
  const roomGeometry = new SphereGeometry(ROOM_RADIUS, 32, 32);
  const roomMaterial = new MeshBasicMaterial({ map: roomTexture, side: BackSide });
  studio.add(new Mesh(roomGeometry, roomMaterial));
  disposables.push(roomTexture, roomGeometry, roomMaterial);

  const textures: Record<PanelKind, CanvasTexture> = {
    softbox: createSoftboxTexture(),
    window: createWindowTexture(),
  };
  disposables.push(textures.softbox, textures.window);

  for (const panel of PANELS) {
    const geometry = new PlaneGeometry(...panel.size);
    const material = new MeshBasicMaterial({
      map: textures[panel.kind],
      color: new Color(panel.tint).multiplyScalar(panel.brightness),
      transparent: true,
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...panel.position);
    mesh.lookAt(0, 0, 0);
    studio.add(mesh);
    disposables.push(geometry, material);
  }

  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(studio, ENVIRONMENT_BLUR);
  generator.dispose();
  for (const item of disposables) item.dispose();

  return { texture: target.texture, dispose: () => target.dispose() };
}
