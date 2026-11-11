import { BadgeSeal } from "./badge-seal";

type BadgeCardProps = {
  name: string;
  description: string;
  profileChanges: string[];
};

/** O selo que a aprovação dá e o que muda no perfil. */
export function BadgeCard({ name, description, profileChanges }: BadgeCardProps) {
  return (
    <section aria-labelledby="selo" className="flex flex-col gap-6">
      <h2
        id="selo"
        className="flex min-h-11 items-center gap-2.5 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
      >
        <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
        O que você conquista
      </h2>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <BadgeSeal
          ringText="BASE8 · Profissional · IA de código · Aprovado ·"
          serial="Nº 0001 / 2026"
          className="size-40 shrink-0 transition-transform duration-700 ease-out hover:rotate-[8deg] lg:size-48"
        />
        <div className="flex flex-col gap-2">
          <p className="font-display text-2xl leading-tight font-medium tracking-[-0.03em]">{name}</p>
          <p className="text-[15px] leading-relaxed text-texto-secundario">{description}</p>
        </div>
      </div>
      <ol className="border-t border-linha">
        {profileChanges.map((change, index) => (
          <li key={change} className="flex gap-4 border-b border-linha py-3 text-[15px] leading-snug">
            <span className="w-6 shrink-0 pt-0.5 font-mono text-[11px] text-texto-secundario tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {change}
          </li>
        ))}
      </ol>
    </section>
  );
}
