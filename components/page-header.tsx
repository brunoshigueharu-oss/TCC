import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { toneBg, type Tone } from "@/lib/tones";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Mantido por compatibilidade; o cabeçalho editorial não mostra ícone. */
  icon?: LucideIcon;
  tone: Tone;
  /** Rótulo pequeno acima do título (padrão: nenhum). */
  eyebrow?: string;
  /** Ações à direita do título (ex.: botão "Criar post"). */
  actions?: ReactNode;
  /** Conteúdo abaixo do título, ex.: abas da Educação ou busca. */
  children?: ReactNode;
};

/**
 * Cabeçalho das abas principais (Comunidade, Educação, Perfil, ...): só
 * tipografia, no espírito do herói da Landing — título grande e apertado,
 * marcador pequeno na cor do pilar e uma linha fina fechando o bloco.
 */
export function PageHeader({ title, subtitle, tone, eyebrow, actions, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-linha bg-fundo px-4 pt-8 pb-5 lg:px-0 lg:pt-4 lg:pb-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
            <span aria-hidden className={cn("size-2 rounded-[2px]", toneBg[tone])} />
            {eyebrow ?? "BASE8"}
          </p>
          <h1 className="font-display text-[34px] leading-[1.02] font-medium tracking-[-0.04em] text-balance lg:text-[52px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-texto-secundario">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}
