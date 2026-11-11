import type { Metadata } from "next";

import { SearchExperience } from "./_components/search-experience";
import { getSearchData, parseSearchQuery } from "./_data-access/search-hub";

export const metadata: Metadata = { title: "Busca" };

/** Busca do hub. O termo inicial vem de `?q=`; a partir daí a busca roda a cada tecla. */
export default async function SearchPage({ searchParams }: PageProps<"/busca">) {
  const query = parseSearchQuery((await searchParams).q);
  const data = await getSearchData();

  return (
    <div className="flex flex-1 flex-col">
      <SearchExperience data={data} initialQuery={query} />
    </div>
  );
}
