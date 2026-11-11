type TestDetailsProps = {
  prerequisite: string;
  totalMinutes: number;
  totalQuestions: number;
  passingPercent: number;
};

/** Regras do teste: três números grandes e finos + o pré-requisito. */
export function TestDetails({ prerequisite, totalMinutes, totalQuestions, passingPercent }: TestDetailsProps) {
  const figures = [
    { label: "Questões", value: String(totalQuestions), unit: "" },
    { label: "Duração", value: String(totalMinutes), unit: "min" },
    { label: "Aprovação", value: String(passingPercent), unit: "%" },
  ];

  return (
    <section aria-labelledby="como-funciona" className="flex flex-col gap-6">
      <h2
        id="como-funciona"
        className="flex min-h-11 items-center gap-2.5 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
      >
        <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
        Como funciona
      </h2>
      <dl className="grid grid-cols-3 gap-4 sm:gap-8">
        {figures.map((figure) => (
          <div key={figure.label} className="flex flex-col gap-2 border-t border-linha pt-3">
            <dt className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">{figure.label}</dt>
            <dd className="flex items-baseline gap-1">
              <span className="font-display text-[48px] leading-none font-light tracking-[-0.05em] tabular-nums lg:text-[64px]">
                {figure.value}
              </span>
              {figure.unit ? (
                <span className="font-mono text-xs text-texto-secundario uppercase">{figure.unit}</span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="border-t border-linha text-[15px]">
        <li className="flex items-baseline justify-between gap-4 border-b border-linha py-3">
          <span className="text-texto-secundario">Pré-requisito</span>
          <span>{prerequisite}</span>
        </li>
        <li className="flex items-baseline justify-between gap-4 border-b border-linha py-3">
          <span className="text-texto-secundario">Tentativas</span>
          <span>Sem limite</span>
        </li>
        <li className="flex items-baseline justify-between gap-4 border-b border-linha py-3">
          <span className="text-texto-secundario">Formato</span>
          <span>Múltipla escolha, A a D</span>
        </li>
      </ul>
    </section>
  );
}
