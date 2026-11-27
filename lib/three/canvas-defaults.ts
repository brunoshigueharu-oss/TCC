import { NeutralToneMapping } from "three";

/**
 * Ajustes comuns aos canvas 3D leves da landing (peça do palco e letras de
 * BASE8): fundo transparente por cima da página e sem pós-processamento, com
 * a curva de exposição direto no renderizador.
 */
export const RENDERER_OPTIONS = {
  antialias: true,
  alpha: true,
  toneMapping: NeutralToneMapping,
  powerPreference: "high-performance",
} as const;

/** Densidade de pixels do canvas: a da tela, entre 1 e 2 (acima disso o custo não compensa). */
export const PIXEL_RATIO: [number, number] = [1, 2];
