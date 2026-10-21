import { Construction } from "lucide-react";

import { ActionLink } from "@/components/action-link";
import { SurfaceCard } from "@/components/surface-card";

type ScreenPlaceholderProps = {
  title: string;
  /** Nome da moldura correspondente no Figma (mapa de páginas). */
  figmaFrame?: string;
};

/** Tela ainda não construída no protótipo. */
export function ScreenPlaceholder({ title, figmaFrame }: ScreenPlaceholderProps) {
  return (
    <main className="flex flex-1 flex-col justify-center py-16">
      <SurfaceCard className="flex flex-col gap-3 p-6">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-trilha">
          <Construction aria-hidden className="size-6" strokeWidth={1.75} />
        </span>
        <p className="text-xs font-semibold text-texto-secundario">Em construção</p>
        <h1 className="font-display text-[28px] leading-none font-bold">{title}</h1>
        {figmaFrame ? (
          <p className="text-sm text-texto-secundario">Referência no Figma: “{figmaFrame}”.</p>
        ) : null}
        <ActionLink href="/inicio" variant="secondary" className="mt-2">
          Voltar para a Home
        </ActionLink>
      </SurfaceCard>
    </main>
  );
}
