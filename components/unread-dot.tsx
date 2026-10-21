import { cn } from "@/lib/utils";

/**
 * Bolinha de "tem novidade" sobre um ícone. O pai precisa de `relative`.
 * É só visual — quem usa coloca o aviso no `aria-label` do link.
 */
export function UnreadDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-pratica ring-2 ring-fundo", className)}
    />
  );
}
