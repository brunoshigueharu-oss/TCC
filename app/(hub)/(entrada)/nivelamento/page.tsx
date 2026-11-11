import type { Metadata } from "next";

import { BrandHeader } from "../_components/brand-header";
import { parsePosition } from "../_lib/parse-position";
import { LevelingConversation } from "./_components/leveling-conversation";
import { getLeveling } from "./_data-access/get-leveling";

export const metadata: Metadata = { title: "Nivelamento" };

/**
 * Nivelamento: perguntas curtas, uma de cada vez, numa conversa diagramada.
 * `?pergunta=N` abre numa pergunta; no fim, o ponto de partida sugerido.
 */
export default async function LevelingPage({ searchParams }: PageProps<"/nivelamento">) {
  const { questions, results } = await getLeveling();
  const position = parsePosition((await searchParams).pergunta, questions.length);

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8 lg:flex-none lg:px-0 lg:pt-0 lg:pb-0">
        <LevelingConversation questions={questions} results={results} initialIndex={position - 1} />
      </main>
    </>
  );
}
