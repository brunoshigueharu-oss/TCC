import { Play } from "lucide-react";

import { ExpandPanel } from "../expand-panel";
import { FilmWatchPlayer } from "./film-watch-player";

/** Página que toca o manifesto ao vivo: cópia de `film.js` + `assets` do filme (ver o comentário do HTML). */
const MANIFESTO_PLAYER = "/landing/manifesto/index.html";

/**
 * Peça do palco: o manifesto do BASE8, um motion design escrito em código.
 * Cada quadro é desenhado num canvas a partir do tempo, então o filme toca
 * direto do código, sem arquivo de vídeo. Fica num iframe para o script do
 * filme (que procura o próprio canvas e carrega os próprios arquivos) não
 * se misturar com a página.
 *
 * A prévia toca em loop e sem som; "Assistir com som" abre o filme inteiro,
 * do começo, com a trilha e controles.
 */
export function FilmPiece() {
  return (
    <div className="w-full max-w-[860px] px-2 sm:px-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-linha bg-papel">
        <iframe
          src={MANIFESTO_PLAYER}
          title="Manifesto do BASE8: um motion design"
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 size-full border-0"
        />
        <ExpandPanel
          eyebrow="Um motion design"
          title="O manifesto do BASE8"
          triggerClassName="group absolute top-2.5 right-2.5 flex min-h-9 items-center gap-2 rounded-full border border-linha bg-fundo/85 py-1.5 pr-3.5 pl-3 text-[13px] font-medium text-texto outline-none backdrop-blur-sm transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-texto focus-visible:ring-2 focus-visible:ring-texto active:translate-y-0 sm:top-4 sm:right-4 sm:min-h-10 sm:pr-4 sm:text-sm"
          trigger={
            <>
              <Play
                aria-hidden
                className="size-3.5 fill-current sm:size-4 transition-transform duration-200 group-hover:scale-110"
                strokeWidth={1.5}
              />
              Assistir com som
            </>
          }
        >
          <FilmWatchPlayer />
        </ExpandPanel>
      </div>
    </div>
  );
}
