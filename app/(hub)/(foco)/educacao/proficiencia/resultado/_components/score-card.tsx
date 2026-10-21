import { SurfaceCard } from "@/components/surface-card";

type ScoreCardProps = {
  correct: number;
  total: number;
  percent: number;
  passingPercent: number;
};

/** Três números da prova: acertos, aproveitamento e mínimo exigido. */
export function ScoreCard({ correct, total, percent, passingPercent }: ScoreCardProps) {
  const items = [
    { label: "acertos", value: `${correct}/${total}` },
    { label: "aproveitamento", value: `${percent}%` },
    { label: "mínimo exigido", value: `${passingPercent}%` },
  ];

  return (
    <SurfaceCard>
      <dl className="grid grid-cols-3 divide-x divide-linha">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col-reverse items-center gap-1 px-2 py-4">
            <dt className="text-xs text-texto-secundario">{item.label}</dt>
            <dd className="font-display text-[22px] leading-none font-bold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </SurfaceCard>
  );
}
