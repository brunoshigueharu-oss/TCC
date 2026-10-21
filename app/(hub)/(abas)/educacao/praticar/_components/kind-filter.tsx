import { Chip } from "@/components/chip";
import { activityKindLabel, activityKinds, type ActivityKind } from "@/lib/data/praticar";

type KindFilterProps = {
  active: ActivityKind | null;
};

/** Filtro por tipo de atividade. O tipo escolhido fica na URL (`?tipo=`). */
export function KindFilter({ active }: KindFilterProps) {
  return (
    <nav aria-label="Filtrar por tipo" className="px-4">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Chip href="/educacao/praticar" isActive={active === null} scroll={false}>
            Todos
          </Chip>
        </li>
        {activityKinds.map((kind) => (
          <li key={kind}>
            <Chip href={`/educacao/praticar?tipo=${kind}`} isActive={active === kind} scroll={false}>
              {activityKindLabel[kind]}
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  );
}
