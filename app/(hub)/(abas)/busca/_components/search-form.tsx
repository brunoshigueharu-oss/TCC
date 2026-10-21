import { Search } from "lucide-react";
import Link from "next/link";

import type { SearchType } from "../_data-access/search-hub";

type SearchFormProps = {
  query: string;
  type: SearchType;
};

/**
 * Campo de busca como formulário GET simples: o termo vai para `?q=` e a
 * página (Server Component) refaz a busca. Não precisa de JavaScript.
 */
export function SearchForm({ query, type }: SearchFormProps) {
  return (
    <form action="/busca" method="get" role="search" className="relative flex items-center">
      {type === "tudo" ? null : <input type="hidden" name="tipo" value={type} />}
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 size-5 text-texto-secundario"
        strokeWidth={1.75}
      />
      <input
        type="search"
        name="q"
        defaultValue={query}
        aria-label="Buscar lições, posts, minicursos e pessoas"
        placeholder="Lições, posts, minicursos, pessoas"
        enterKeyHint="search"
        className="h-12 w-full rounded-xl bg-superficie pr-20 pl-11 text-[15px] outline-none placeholder:text-texto-secundario focus-visible:ring-2 focus-visible:ring-texto [&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <Link
          href="/busca"
          className="absolute right-1 flex h-11 items-center px-3 text-sm font-semibold underline underline-offset-4"
        >
          Limpar
        </Link>
      ) : null}
    </form>
  );
}
