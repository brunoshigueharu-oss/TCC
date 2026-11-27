import type { Metadata } from "next";

import { orbData } from "@/lib/data/orbe";
import { hubFontClasses } from "@/lib/fonts";
import { OrbStage } from "./_components/orb-stage";

export const metadata: Metadata = {
  title: "Render 3D",
  description: "Estudo do objeto 3D da landing: cinco formas redondas que viram uma na outra com a rolagem.",
  robots: { index: false },
};

/**
 * Página de estudo do render 3D, separada da landing: só o objeto, no meio da
 * tela, respondendo à rolagem. Daqui ele segue para a landing depois de aprovado.
 */
export default function OrbPage() {
  return (
    <main className={`${hubFontClasses} bg-fundo font-texto text-texto`}>
      <h1 className="sr-only">Render 3D do Base 8</h1>
      <OrbStage data={orbData} />
    </main>
  );
}
