import { ActionLink } from "@/components/action-link";

type ScreenPlaceholderProps = {
  title: string;
  /** Nome da moldura correspondente no Figma (mapa de páginas). */
  figmaFrame?: string;
};

/** Tela ainda não construída no protótipo: só tipografia, sem cartão. */
export function ScreenPlaceholder({ title, figmaFrame }: ScreenPlaceholderProps) {
  return (
    <main className="flex flex-1 flex-col justify-center gap-5 px-4 py-16 lg:px-0">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
        <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
        Em construção
      </p>
      <h1 className="max-w-[16ch] font-display text-[34px] leading-[1.02] font-medium tracking-[-0.04em] text-balance lg:text-[52px]">
        {title}
      </h1>
      <p className="max-w-[46ch] text-[15px] leading-relaxed text-texto-secundario">
        Esta tela faz parte do mapa do hub, mas ainda não foi montada no protótipo.
      </p>
      {figmaFrame ? (
        <p className="border-t border-linha pt-3 font-mono text-[11px] text-texto-secundario">
          Figma · {figmaFrame}
        </p>
      ) : null}
      <ActionLink href="/inicio" variant="secondary" className="w-fit">
        Voltar para a Home
      </ActionLink>
    </main>
  );
}
