import type { Accent } from "@/lib/data/landing";
import { AccentDot } from "./accent-dot";

type DotListProps = {
  items: readonly string[];
  accent: Accent;
};

/** Lista curta de fatos, um por linha entre filetes, marcados com a cor do pilar. */
export function DotList({ items, accent }: DotListProps) {
  return (
    <ul className="border-t border-linha">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 border-b border-linha py-3 text-[15px] leading-snug">
          <AccentDot accent={accent} />
          {item}
        </li>
      ))}
    </ul>
  );
}
