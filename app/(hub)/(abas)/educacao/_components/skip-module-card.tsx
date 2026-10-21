import { ActionLink } from "@/components/action-link";
import { SurfaceCard } from "@/components/surface-card";

type SkipModuleCardProps = {
  nextModuleNumber: number;
};

/** Atalho para a prova que permite pular o módulo atual. */
export function SkipModuleCard({ nextModuleNumber }: SkipModuleCardProps) {
  return (
    <SurfaceCard as="aside" className="flex items-center justify-between gap-3 py-3 pr-3 pl-4">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold">Já domina este módulo?</p>
        <p className="text-xs text-texto-secundario">
          Faça a prova e pule para o módulo {nextModuleNumber}
        </p>
      </div>
      <ActionLink href="/educacao/proficiencia" variant="secondary" className="shrink-0">
        Fazer prova
      </ActionLink>
    </SurfaceCard>
  );
}
