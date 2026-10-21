import { Play } from "lucide-react";

/**
 * Área do vídeo PROVISÓRIA: fundo azul riso suave com formas Bauhaus e o
 * botão de reproduzir desenhado. O vídeo real entra com a API de mídia.
 */
export function VideoPlaceholder() {
  return (
    <figure className="relative flex aspect-video items-center justify-center overflow-hidden bg-comunidade/15">
      <svg aria-hidden viewBox="0 0 320 180" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
        <g className="mix-blend-multiply">
          <circle cx="250" cy="40" r="56" className="fill-comunidade opacity-60" />
          <rect x="24" y="110" width="64" height="64" className="fill-trilha opacity-70" />
          <path d="M270 180 L320 180 L320 120 Z" className="fill-pratica opacity-60" />
        </g>
      </svg>
      <span className="relative flex size-16 items-center justify-center rounded-full bg-fundo shadow-[0_2px_8px_rgb(27_31_59/0.12)]">
        <Play aria-hidden className="size-7 translate-x-0.5 text-texto" strokeWidth={1.75} />
      </span>
      <figcaption className="sr-only">Vídeo da aula (em produção no protótipo)</figcaption>
    </figure>
  );
}
