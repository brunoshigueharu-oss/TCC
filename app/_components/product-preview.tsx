import { Check, Circle, Sparkles } from "lucide-react";

import type { LandingData } from "@/lib/data/landing";

type ProductPreviewProps = {
  preview: LandingData["preview"];
};

/**
 * Prévia do produto (trilha + editor): uma miniatura estática do hub, com
 * sombra deslocada em rosa como no Figma.
 */
export function ProductPreview({ preview }: ProductPreviewProps) {
  return (
    <section aria-labelledby="previa" className="mx-auto w-full max-w-[920px]">
      <h2 id="previa" className="sr-only">
        Prévia do produto
      </h2>
      <div className="relative">
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-pratica" />
        <figure className="relative overflow-hidden rounded-2xl bg-fundo ring-1 ring-texto">
          <div aria-hidden className="flex h-9 items-center gap-1.5 border-b border-linha px-4">
            <span className="size-2.5 rounded-full bg-superficie-forte" />
            <span className="size-2.5 rounded-full bg-superficie-forte" />
            <span className="size-2.5 rounded-full bg-superficie-forte" />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] bg-superficie md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="flex flex-col gap-3 p-4 md:border-r md:border-linha">
              <p className="text-xs font-semibold text-texto-secundario">{preview.moduleLabel}</p>
              <ol className="divide-y divide-linha overflow-hidden rounded-2xl bg-fundo ring-1 ring-linha/70">
                {preview.lessons.map((lesson) => (
                  <li key={lesson.title} className="flex items-center gap-3 px-4 py-3 text-sm">
                    {lesson.isDone ? (
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-acao">
                        <Check aria-hidden className="size-3.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <Circle aria-hidden className="size-6 shrink-0 text-linha" strokeWidth={1.5} />
                    )}
                    <span className={lesson.isDone ? "text-texto-secundario" : "font-semibold"}>
                      {lesson.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-3 p-4">
              <div className="rounded-2xl bg-fundo p-4 ring-1 ring-linha/70">
                <p className="text-xs font-semibold text-texto-secundario">Seu prompt</p>
                <p className="mt-1 text-sm leading-relaxed">{preview.prompt}</p>
              </div>
              <pre className="overflow-x-auto rounded-2xl bg-texto p-4 text-xs leading-relaxed text-fundo">
                <code>{`<article className="grid gap-4 p-4">
  <img className="aspect-[4/3]" alt="" />
  <h3 className="text-lg">Cadeira Bauhaus</h3>
  <button>Comprar</button>
</article>`}</code>
              </pre>
              <div className="flex items-start gap-3 rounded-2xl bg-fundo p-4 ring-1 ring-linha/70">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-pratica">
                  <Sparkles aria-hidden className="size-4" strokeWidth={2} />
                </span>
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">Feedback da IA: </span>
                  {preview.feedback}
                </p>
              </div>
            </div>
          </div>
          <figcaption className="sr-only">
            Miniatura do hub: lições da trilha à esquerda e um exercício com feedback de IA à direita.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
