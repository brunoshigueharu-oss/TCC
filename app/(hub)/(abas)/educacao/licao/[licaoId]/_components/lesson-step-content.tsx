import { SurfaceCard } from "@/components/surface-card";
import type { LessonStep } from "@/lib/data/trilha";

type LessonStepContentProps = {
  step: LessonStep;
};

/** Bloco de conteúdo de uma etapa, com exemplo de prompt opcional. */
export function LessonStepContent({ step }: LessonStepContentProps) {
  return (
    <SurfaceCard as="article" className="flex flex-col gap-4 p-4 lg:gap-5 lg:p-6">
      <p className="text-[15px] leading-relaxed">{step.body}</p>
      {step.promptExample ? (
        <figure className="flex flex-col gap-1.5 rounded-xl bg-trilha/30 p-3">
          <figcaption className="text-xs font-semibold">Exemplo de prompt</figcaption>
          <p className="text-sm leading-relaxed">{step.promptExample}</p>
        </figure>
      ) : null}
    </SurfaceCard>
  );
}
