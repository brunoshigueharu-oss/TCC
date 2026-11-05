/**
 * Peixe betta desenhado com caracteres (porte do protótipo `prototipos/pontilhismo`,
 * tema "Betta nadando" (`betta-loop.mp4`), estilo "Caracteres", cores originais, em fundo preto).
 *
 * Loop: o vídeo já termina na pose do começo. Depois do último quadro vem o
 * primeiro, misturado como quaisquer dois quadros vizinhos (sem travadinha).
 * O desenho em si fica em `ascii-engine`.
 */

import { startAsciiScene, vividHsl, type AsciiScene } from "./ascii-engine";

/** Trecho usado do vídeo (s): `to` é o fim do último quadro guardado, não arredondar. */
const CLIP = { from: 0.02, to: 8.895 };
/**
 * O começo do vídeo quase não se mexe (o fim é rápido): toca `RUSH.factor`× mais
 * rápido e desacelera até 1× em `RUSH.seconds` segundos.
 */
const RUSH = { seconds: 2, factor: 5 } as const;
/** Cor: saturação, faixa de luminosidade do vídeo → faixa no fundo escuro, realce de borda. */
const VIVID = { sat: 1.2, tone: [0.04, 0.54], range: [0.45, 0.82], edge: 2.5 } as const;
/** No máximo 0,1 s por quadro de tela (aba escondida/travada), para não pular. */
const MAX_STEP_SECONDS = 0.1;

export type AsciiBettaOptions = {
  /** URL do vídeo do betta. */
  src: string;
};

const smoothstep = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

const BETTA_SCENE: AsciiScene = {
  // sobra para a grade; ~213 quadros na memória
  frameWidth: 300,
  capture: CLIP,
  background: "#000",
  cell: { min: 7, divisor: 80 },
  fit: 0.9,
  // o peixe encosta nas bordas do vídeo
  edgeFade: 0.06,
  loopEnd: CLIP.to,
  // as bolhas são pontos soltos e ficam de fora
  keepBigBlobs: true,
  isDarkBackground: true,
  /**
   * Fundo preto: brilho = peixe (medido: min 0,016, range 0,04). Exige vermelho
   * (r acima de g e b) para não desenhar a coluna de bolhas, que é cinza-azulada.
   */
  inkOf(r, g, b) {
    const mx = Math.max(r, g, b) / 255;
    const red = (r - Math.max(g, b)) / 255;
    return Math.min(1, Math.max(0, (mx - 0.016) / 0.04)) * Math.min(1, Math.max(0, (red - 0.02) / 0.06));
  },
  color(r, g, b, detail, out) {
    vividHsl(r, g, b, detail, VIVID, out);
  },
  staticPose: { t: CLIP.from, rot: 0 },
  createClock() {
    /** Posição no loop (s desde `CLIP.from`) e hora do último quadro de tela. */
    let loopT = 0;
    let lastNow: number | null = null;
    return (now, _elapsedMs, { isCaptured, lastFrameT }) => {
      const dt = lastNow === null ? 0 : Math.min(MAX_STEP_SECONDS, (now - lastNow) / 1000);
      lastNow = now;
      const speed = 1 + (RUSH.factor - 1) * (1 - smoothstep(0, RUSH.seconds, loopT));
      const next = loopT + dt * speed;
      // carregando: espera no último quadro guardado; carregado: recomeça depois do último
      loopT = isCaptured ? next % (CLIP.to - CLIP.from) : Math.min(next, lastFrameT - CLIP.from);
      return { t: CLIP.from + loopT, rot: 0 };
    };
  },
};

/**
 * Liga a animação no canvas. Devolve a função que desliga tudo (quadros
 * guardados, observadores e o laço de desenho).
 */
export function startAsciiBetta(canvas: HTMLCanvasElement, { src }: AsciiBettaOptions) {
  return startAsciiScene(canvas, BETTA_SCENE, src);
}
