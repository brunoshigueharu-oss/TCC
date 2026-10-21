import { Chip } from "@/components/chip";
import type { CommunityTag } from "@/lib/data/comunidade";

type TagFilterLayout = "scroll" | "wrap";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const navClasses: Record<TagFilterLayout, string> = {
  // Faixa rolável no celular; a partir do `lg` as tags quebram linha.
  scroll: "-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0",
  // Sempre quebra linha (coluna lateral do computador).
  wrap: "",
};

const listClasses: Record<TagFilterLayout, string> = {
  scroll: "flex w-max gap-2 lg:w-auto lg:flex-wrap",
  wrap: "flex flex-wrap gap-2",
};

type TagFilterProps = {
  tags: CommunityTag[];
  activeSlug: string | null;
  /** "scroll" (padrão) = faixa do cabeçalho; "wrap" = bloco da coluna lateral. */
  layout?: TagFilterLayout;
};

/** Filtro do feed por tag; o filtro ativo fica na URL (`?tag=`). */
export function TagFilter({ tags, activeSlug, layout = "scroll" }: TagFilterProps) {
  return (
    <nav aria-label="Filtrar por tag" className={navClasses[layout]}>
      <ul className={listClasses[layout]}>
        <li>
          <Chip href="/comunidade" isActive={activeSlug === null} scroll={false}>
            Todas
          </Chip>
        </li>
        {tags.map((tag) => (
          <li key={tag.slug}>
            <Chip
              href={`/comunidade?tag=${tag.slug}`}
              isActive={activeSlug === tag.slug}
              scroll={false}
            >
              {tag.label}
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  );
}
