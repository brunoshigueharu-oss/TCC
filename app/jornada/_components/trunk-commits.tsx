import type { TrunkItem } from "@/lib/data/learning-journey";

export function TrunkCommits({ items }: { items: TrunkItem[] }) {
  return (
    <section className="flex flex-col gap-6 px-6 py-16 sm:px-10">
      <div className="flex flex-col gap-1">
        <h2 className="font-journey-mono text-sm tracking-[0.03em] text-journey-ink-soft uppercase">
          commits no tronco
        </h2>
        <p className="max-w-[64ch] text-sm text-journey-ink-soft">
          Aprendizados que não pertencem a um projeto só — atravessam todas as estações.
        </p>
      </div>
      <dl className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 border-b border-journey-line py-5 last:border-b-0 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-5"
          >
            <dt className="font-journey-mono text-xs tracking-[0.06em] text-journey-ink-soft uppercase sm:col-span-3">
              {item.label}
            </dt>
            <dd className="text-sm text-journey-ink-soft italic">{item.before}</dd>
            <span className="hidden font-journey-mono text-journey-accent sm:block" aria-hidden>
              →
            </span>
            <dd className="text-sm text-journey-ink">{item.after}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
