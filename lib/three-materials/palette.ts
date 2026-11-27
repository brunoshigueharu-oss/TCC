/**
 * Cores dos objetos 3D (orbe e letras de BASE8), lidas dos tokens `--hub-*` de `app/globals.css` para não
 * duplicar a paleta. Os valores ao lado são só reserva (tema claro), caso o
 * token não exista.
 */
const TOKENS = {
  fundo: ["--hub-fundo", "#ffffff"],
  tinta: ["--hub-tinta", "#18181b"],
  papel: ["--hub-papel", "#ffffff"],
  linha: ["--hub-linha", "#d5d7e0"],
  superficieForte: ["--hub-superficie-forte", "#e3e5ec"],
  contorno: ["--hub-texto-secundario", "#52525b"],
  acao: ["--hub-acao", "#12a180"],
  trilha: ["--hub-trilha", "#f5ee4a"],
  pratica: ["--hub-pratica", "#ff48b0"],
  comunidade: ["--hub-comunidade", "#0b8fe0"],
} as const;

export type OrbPalette = Record<keyof typeof TOKENS, string>;

/** Só no cliente: lê as cores do tema que está valendo em `<html>`. */
export function readOrbPalette(): OrbPalette {
  const styles = getComputedStyle(document.documentElement);
  const entries = Object.entries(TOKENS).map(([name, [token, fallback]]) => {
    const value = styles.getPropertyValue(token).trim();
    return [name, value || fallback];
  });
  return Object.fromEntries(entries) as OrbPalette;
}
