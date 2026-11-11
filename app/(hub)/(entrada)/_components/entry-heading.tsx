import type { ReactNode } from "react";

type EntryHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Id do título, para `aria-labelledby` do formulário. */
  id?: string;
};

/** Abertura tipográfica das telas de entrada: rótulo, título grande, apoio. */
export function EntryHeading({ eyebrow, title, description, id }: EntryHeadingProps) {
  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
        <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
        {eyebrow}
      </p>
      <h1
        id={id}
        className="font-display text-[34px] leading-[1.02] font-medium tracking-[-0.04em] text-balance lg:text-[44px]"
      >
        {title}
      </h1>
      {description ? (
        <p className="max-w-[44ch] text-[15px] leading-relaxed text-texto-secundario">{description}</p>
      ) : null}
    </div>
  );
}
