import { ChevronDown } from "lucide-react";

type TermsSummaryProps = {
  items: string[];
};

/** Resumo dos termos em linguagem simples, aberto no próprio fluxo (`<details>`). */
export function TermsSummary({ items }: TermsSummaryProps) {
  return (
    <details className="group border-b border-linha">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-sm text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-texto [&::-webkit-details-marker]:hidden">
        Termos de uso e privacidade, em 4 pontos
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-texto-secundario transition-transform duration-200 group-open:rotate-180"
          strokeWidth={2}
        />
      </summary>
      <ol className="flex flex-col gap-3 pb-5">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] text-sm leading-relaxed text-texto-secundario">
            <span aria-hidden className="font-mono text-[11px] tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </details>
  );
}
