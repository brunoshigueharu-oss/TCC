import { Flag, Ellipsis } from "lucide-react";
import Link from "next/link";

type PostMenuProps = {
  postId: string;
};

/**
 * Menu (⋯) da barra do post. Usa `<details>` para abrir sem JavaScript; a
 * opção "Denunciar" abre a folha pela URL (`?denunciar=1`).
 */
export function PostMenu({ postId }: PostMenuProps) {
  return (
    <details className="group relative">
      <summary
        aria-label="Mais opções do post"
        className="flex size-11 cursor-pointer list-none items-center justify-center rounded-xl [&::-webkit-details-marker]:hidden group-open:bg-superficie"
      >
        <Ellipsis aria-hidden className="size-[22px]" strokeWidth={1.75} />
      </summary>
      <div className="absolute top-12 right-0 z-20 w-52 overflow-hidden rounded-2xl bg-fundo shadow-lg ring-1 ring-linha/70">
        <Link
          href={`/comunidade/posts/${postId}?denunciar=1`}
          scroll={false}
          className="flex min-h-11 items-center gap-3 px-4 text-sm font-semibold"
        >
          <Flag aria-hidden className="size-4" strokeWidth={2} />
          Denunciar post
        </Link>
      </div>
    </details>
  );
}
