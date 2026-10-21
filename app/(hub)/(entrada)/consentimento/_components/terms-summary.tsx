import { ChevronDown } from "lucide-react";

type TermsSummaryProps = {
  items: string[];
};

/**
 * "Ler Termos de uso e Política de privacidade": abre um resumo dentro do
 * próprio cartão (`<details>` nativo, sem JavaScript).
 */
export function TermsSummary({ items }: TermsSummaryProps) {
  return (
    <details className="group border-t border-linha">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold underline underline-offset-4 [&::-webkit-details-marker]:hidden">
        Ler Termos de uso e Política de privacidade
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 transition-transform group-open:rotate-180"
          strokeWidth={2.5}
        />
      </summary>
      <ul className="flex list-disc flex-col gap-2 px-4 pb-4 pl-8 text-sm leading-relaxed text-texto-secundario">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}
