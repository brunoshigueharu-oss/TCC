/**
 * Cores de pilar (Figma: variáveis "Paleta IDV"). Um pilar = uma cor:
 * trilha = limão, pratica = rosa, comunidade = azul riso, acao = verde-água.
 * Classes literais: o Tailwind não enxerga nomes montados (`bg-${tone}`).
 */
export type Tone = "trilha" | "pratica" | "comunidade" | "acao";

/** Fundo cheio — quadradinhos de ícone, miniaturas, marcadores. */
export const toneBg: Record<Tone, string> = {
  trilha: "bg-trilha",
  pratica: "bg-pratica",
  comunidade: "bg-comunidade",
  acao: "bg-acao",
};

/** Fundo suave (15%) — meia-lua da ilustração dentro dos cartões. */
export const toneSoftBg: Record<Tone, string> = {
  trilha: "bg-trilha/30",
  pratica: "bg-pratica/15",
  comunidade: "bg-comunidade/15",
  acao: "bg-acao/15",
};
