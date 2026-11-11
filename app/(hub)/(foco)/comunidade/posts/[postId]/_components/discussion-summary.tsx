type DiscussionSummaryProps = {
  points: string[];
  answersCount: number;
};

/**
 * Resumo da discussão: os pontos que as respostas têm em comum, numerados.
 * Na versão real é gerado pela IA a partir das respostas e revisto pela
 * moderação; no protótipo vem dos dados.
 */
export function DiscussionSummary({ points, answersCount }: DiscussionSummaryProps) {
  return (
    <section aria-labelledby="resumo-discussao" className="flex flex-col gap-4 rounded-xl bg-superficie p-5 lg:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="resumo-discussao"
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase"
        >
          <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
          Resumo da discussão
        </h2>
        <p className="font-mono text-[11px] text-texto-secundario">
          a partir de {answersCount} {answersCount === 1 ? "resposta" : "respostas"}
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {points.map((point, index) => (
          <li key={point} className="grid grid-cols-[2.25rem_minmax(0,1fr)] text-[15px] leading-relaxed">
            <span aria-hidden className="pt-0.5 font-mono text-xs text-texto-secundario tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {point}
          </li>
        ))}
      </ol>
    </section>
  );
}
