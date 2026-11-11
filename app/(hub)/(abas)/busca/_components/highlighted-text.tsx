import { splitHighlight } from "../_lib/search-items";

type HighlightedTextProps = {
  text: string;
  query: string;
};

/** Texto com o termo buscado marcado (fundo suave, sem trocar a cor do texto). */
export function HighlightedText({ text, query }: HighlightedTextProps) {
  return (
    <>
      {splitHighlight(text, query).map((part, index) =>
        part.isMatch ? (
          <mark key={index} className="rounded-[3px] bg-acao/25 text-inherit">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
