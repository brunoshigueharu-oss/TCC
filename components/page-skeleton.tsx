import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  /**
   * `abas` = cabeçalho grande + blocos (telas principais);
   * `foco` = barra de voltar + texto corrido (lição, post);
   * `ferramenta` = painéis lado a lado (telas web).
   */
  variant: "abas" | "foco" | "ferramenta";
};

/** Linhas de uma lista com rótulo pequeno + título. */
function SkeletonRows({ count }: { count: number }) {
  return (
    <div className="flex flex-col divide-y divide-linha border-y border-linha">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonText className="w-1/4" />
            <SkeletonText className={cn(index % 2 === 0 ? "w-3/4" : "w-2/3")} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Esqueleto sóbrio dos `loading.tsx`: blocos neutros com o desenho da tela
 * (cabeçalho tipográfico, linhas, painéis), sem cartões falsos. Só aparece se
 * a espera passar de ~200ms (`animate-late-in`), para navegações rápidas não
 * piscarem.
 */
export function PageSkeleton({ variant }: PageSkeletonProps) {
  return (
    <div aria-busy="true" className="flex flex-1 animate-late-in flex-col">
      <span className="sr-only" role="status">
        Carregando…
      </span>

      {variant === "abas" ? (
        <div className="flex flex-col gap-8 px-4 pt-8 lg:px-0 lg:pt-4">
          <div className="flex flex-col gap-3 border-b border-linha pb-6">
            <SkeletonText className="w-24" />
            <Skeleton className="h-10 w-2/3 max-w-[480px] lg:h-14" />
            <SkeletonText className="w-1/2 max-w-[360px]" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <SkeletonRows count={3} />
        </div>
      ) : null}

      {variant === "foco" ? (
        <div className="flex flex-col">
          <div className="flex h-14 items-center gap-3 border-b border-linha px-4">
            <Skeleton className="size-6 rounded-full" />
            <SkeletonText className="w-40" />
          </div>
          <div className="flex flex-col gap-4 bg-fundo px-4 py-8 lg:px-8">
            <SkeletonText className="w-20" />
            <Skeleton className="h-9 w-4/5" />
            <div className="mt-4 flex flex-col gap-2.5">
              <SkeletonText className="w-full" />
              <SkeletonText className="w-11/12" />
              <SkeletonText className="w-full" />
              <SkeletonText className="w-3/5" />
            </div>
            <Skeleton className="mt-4 h-32 rounded-xl" />
          </div>
        </div>
      ) : null}

      {variant === "ferramenta" ? (
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4 pt-8 lg:grid-cols-[260px_minmax(0,1fr)_320px] lg:px-10">
          <div className="flex flex-col gap-3">
            <SkeletonText className="w-24" />
            <SkeletonRows count={4} />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
          <Skeleton className="hidden h-80 rounded-xl lg:block" />
        </div>
      ) : null}
    </div>
  );
}
