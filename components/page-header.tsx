import { Bell, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { toneBg, type Tone } from "@/lib/tones";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Ícone e cor do pilar da aba (mesma lógica dos atalhos da Home). */
  icon: LucideIcon;
  tone: Tone;
  /** Mostra o atalho para as notificações (padrão: sim). */
  hasNotificationsLink?: boolean;
  /** Conteúdo abaixo do título, ex.: abas da Educação ou busca. */
  children?: ReactNode;
};

/**
 * Cabeçalho das abas principais (Comunidade, Educação, Perfil, ...). A Home
 * tem o banner ilustrado; as outras abas usam esta faixa branca com o
 * quadrado do pilar, que conversa com os atalhos da Home.
 */
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  tone,
  hasNotificationsLink = true,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-b-[28px] bg-fundo px-4 pt-5 pb-5 ring-1 ring-linha/70">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            toneBg[tone],
          )}
        >
          <Icon className="size-6 text-texto" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h1 className="font-display text-[22px] leading-tight font-bold">{title}</h1>
          {subtitle ? <p className="text-sm text-texto-secundario">{subtitle}</p> : null}
        </div>
        {hasNotificationsLink ? (
          <Link
            href="/notificacoes"
            aria-label="Notificações"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-superficie"
          >
            <Bell aria-hidden className="size-5" strokeWidth={1.75} />
          </Link>
        ) : null}
      </div>
      {children}
    </header>
  );
}
