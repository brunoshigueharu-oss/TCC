/** Constantes compartilhadas pelo motor de caracteres (ver `lib/ascii-engine.ts`). */

/** Caracteres do mais vazio ao mais cheio. */
export const CHARS = " .:-=+*#%@";
export const VIDEO_FPS = 24;
/** Duração de um quadro do vídeo (s). */
export const FRAME_SECONDS = 1 / VIDEO_FPS;
/** Entrada: tempo total da pincelada e de cada caractere. */
export const REVEAL_MS = 2600;
export const EACH_MS = 700;
export const MOUSE_RADIUS = 70;
export const INK_MIN = 0.3;
/** Letra: peso da fonte e tamanho em relação à célula (> 1 = os caracteres se encostam e preenchem). */
export const GLYPH = { weight: 900, scale: 1.5 } as const;
export const FALLBACK_FONT = "ui-monospace, Menlo, monospace";
/**
 * Ímã do "8" (da base8): o mouse puxa as letras de perto para as vagas de um 8
 * e empurra as outras, abrindo o círculo em volta.
 * `top`/`bottom`: raios das duas voltas, em fração de `MOUSE_RADIUS`;
 * `spacing`: distância entre vagas, em fração da célula;
 * `grab`/`hold`: até que distância (fração de `MOUSE_RADIUS`, medida da casa da letra)
 * o ímã pega uma letra nova / segura a que já pegou;
 * `pull`: quanto a letra anda até a vaga por quadro (0–1).
 */
export const EIGHT = { top: 0.26, bottom: 0.3, spacing: 0.8, grab: 1.1, hold: 1.5, pull: 0.2 } as const;
/** Vizinhos de 4 (dx, dy) usados no realce de borda. */
export const NEIGHBORS = [1, 0, -1, 0, 0, 1, 0, -1] as const;

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
export const MORPH = { ms: 2600, spread: 0.55, handoff: 0.25, scatter: 4 } as const;
/** Caracteres cheios usados no embaralhamento do meio da troca. */
export const SCRAMBLE = "=+*#%@";
/** Quanto a letra some por quadro quando a cena andou e não há casa ocupada por perto. */
export const VACATED_FADE = 0.8;
/** Até quantas casas a letra procura uma casa ocupada quando a dela esvazia. */
export const FOLLOW_RADIUS = 3;
/** Lado da grade de baldes da busca de vizinho (pontos normalizados em 0–1). */
export const BUCKETS = 32;

/** Manchas menores que isto (células) são descartadas por `keepBigBlobs`… */
export const BLOB_MIN_CELLS = 25;
/** …ou menores que esta fração da maior mancha. */
export const BLOB_MIN_RATIO = 0.06;
/** Mouse "longe": fora de qualquer raio de efeito. */
export const MOUSE_FAR = -1e4;
