import { Chip } from "@/components/chip";
import type { CommunityTag } from "@/lib/data/comunidade";

type TagFilterProps = {
  tags: CommunityTag[];
  activeSlug: string | null;
};

/** Filtro do feed por tag; o filtro ativo fica na URL (`?tag=`). */
export function TagFilter({ tags, activeSlug }: TagFilterProps) {
  return (
    <nav aria-label="Filtrar por tag" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
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
