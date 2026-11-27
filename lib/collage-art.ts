/**
 * Adesivos de colagem da Landing (pinos, post-its, lupa, lâmpadas): fotos
 * tratadas pelo script de `Projeto VII/06_Identidade_Visual/objetos_graficos`,
 * já reduzidas para a web em `public/landing/colagem/`. Todas têm fundo
 * transparente, com a borda de papel recortado e a sombra na própria imagem.
 */

export type CollageArt = {
  /** Caminho em `public/`. */
  src: string;
  width: number;
  height: number;
};

const art = (name: string, width: number, height: number): CollageArt => ({
  src: `/landing/colagem/${name}.webp`,
  width,
  height,
});

export const collageArt = {
  /** Pino visto de lado, com a agulha aparecendo. */
  pinSide: art("pin-1", 220, 363),
  /** Pinos vistos de cima, um ângulo para cada post-it da fileira. */
  pinsTop: [art("pin-2", 200, 265), art("pin-3", 200, 252), art("pin-4", 200, 223)],
  /** As três fases do post-it, uma variação para cada papel da fileira. */
  noteSmooth: [art("post-it-liso-1", 720, 723), art("post-it-liso-2", 720, 721), art("post-it-liso-3", 720, 722)],
  /**
   * Pares liso + amassado no mesmo esquadro: um troca pelo outro sem "pular".
   * O liso 2 não tem amassado no mesmo esquadro, por isso fica de fora.
   */
  noteSheets: [
    { smooth: art("post-it-liso-1", 720, 723), crumpled: art("post-it-amassado-1", 720, 718) },
    { smooth: art("post-it-liso-3", 720, 722), crumpled: art("post-it-amassado-3", 720, 714) },
  ],
  /** Amassado e torto, para composições soltas. */
  noteCrumpledTilted: art("post-it-amassado-2", 720, 719),
  noteBall: [
    art("post-it-bolinha-1", 420, 432),
    art("post-it-bolinha-2", 420, 400),
    art("post-it-bolinha-3", 420, 445),
  ],
  magnifier: art("lupa", 560, 819),
  /** Mesma lâmpada, mesmo enquadramento: dá para sobrepor uma à outra. */
  lampOff: art("lampada-desligada", 520, 877),
  lampOn: art("lampada-ligada", 520, 877),
  /**
   * As fotos de origem, no mesmo tamanho e enquadramento do adesivo
   * correspondente (sem borda nem tratamento): uma sobrepõe a outra exatamente.
   */
  photos: {
    magnifier: art("lupa-foto", 560, 819),
    lampOn: art("lampada-foto", 520, 877),
    pinSide: art("pin-1-foto", 220, 363),
  },
} as const;

/** Variação de um adesivo para o item `index` de uma fileira (dá a volta na lista). */
export function pickArt(options: readonly CollageArt[], index: number) {
  return options[index % options.length];
}
