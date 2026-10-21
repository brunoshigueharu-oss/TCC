import { Award } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { BadgeShapes } from "./badge-shapes";

type BadgeCardProps = {
  name: string;
  description: string;
};

/** O selo que a aprovação dá, com a ilustração provisória. */
export function BadgeCard({ name, description }: BadgeCardProps) {
  return (
    <section aria-labelledby="selo" className="flex flex-col gap-2">
      <SectionHeading id="selo" title="O que você conquista" icon={Award} tone="trilha" />
      <SurfaceCard className="flex">
        <div className="flex w-[38%] shrink-0 items-center justify-center rounded-r-[999px] bg-trilha/30 py-4">
          <BadgeShapes className="size-24" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1 p-4">
          <p className="font-display text-lg leading-snug font-bold">{name}</p>
          <p className="text-xs text-texto-secundario">Nome provisório</p>
          <p className="mt-1 text-sm leading-snug">{description}</p>
        </div>
      </SurfaceCard>
    </section>
  );
}
