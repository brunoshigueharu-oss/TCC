import { Instrument_Serif, Pixelify_Sans, Space_Mono, Unbounded } from "next/font/google";

/**
 * Fontes que aparecem só na animação do título da Landing (troca de letras no
 * hover). Ficam fora de `lib/fonts.ts` para não pesar nas outras telas.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const spaceMono = Space_Mono({
  variable: "--font-shuffle-mono-src",
  subsets: ["latin"],
  weight: "700",
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

/** Classes que ligam as variáveis. Usar no elemento que envolve o título. */
export const shuffleFontClasses = [
  instrumentSerif.variable,
  spaceMono.variable,
  pixelifySans.variable,
  unbounded.variable,
].join(" ");
