import { CopyButton } from "../../../_components/prompt-playground/copy-button";

type PromptBlockProps = {
  text: string;
};

/** Exemplo de prompt: mono, com fio à esquerda e botão de copiar. */
export function PromptBlock({ text }: PromptBlockProps) {
  return (
    <figure className="flex flex-col border-y border-linha">
      <figcaption className="flex min-h-11 items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
          <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
          Exemplo de prompt
        </span>
        <CopyButton text={text} className="-mr-2.5" />
      </figcaption>
      <p className="flex gap-3 pt-1 pb-5 font-mono text-[14.5px] leading-[1.7]">
        <span aria-hidden className="text-texto-secundario select-none">
          &gt;
        </span>
        <span>{text}</span>
      </p>
    </figure>
  );
}

type CodeBlockProps = {
  label: string;
  content: string;
};

/** Trecho de código com numeração de linhas, no mesmo desenho do playground. */
export function CodeBlock({ label, content }: CodeBlockProps) {
  const lines = content.split("\n");

  return (
    <figure className="overflow-hidden rounded-xl border border-linha">
      <figcaption className="flex min-h-10 items-center justify-between gap-3 border-b border-linha bg-superficie pr-1.5 pl-4">
        <span className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase">{label}</span>
        <CopyButton text={content} />
      </figcaption>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="overflow-x-auto py-3 outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-inset"
      >
        <ol className="min-w-max font-mono text-[13px] leading-[1.7]">
          {lines.map((line, index) => (
            <li key={index} className="flex gap-4 pr-4 pl-3">
              <span aria-hidden className="w-5 shrink-0 text-right text-desativado tabular-nums select-none">
                {index + 1}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
