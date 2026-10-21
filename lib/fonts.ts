import { Figtree, Instrument_Sans } from "next/font/google";

/** Fontes do hub e das telas web (landing, criar minicurso, moderação). */
export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

/** Classes que ligam as variáveis das fontes. Usar na casca de cada área. */
export const hubFontClasses = `${instrumentSans.variable} ${figtree.variable}`;
