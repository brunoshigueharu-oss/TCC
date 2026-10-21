import Link from "next/link";

import { ReportForm } from "./report-form";

type ReportSheetProps = {
  postId: string;
};

/**
 * Folha "Denunciar post" (Figma: "Denunciar (modal)"). Abre por cima do post
 * quando a URL tem `?denunciar=1`; fechar = voltar para a URL sem o parâmetro.
 */
export function ReportSheet({ postId }: ReportSheetProps) {
  const closeHref = `/comunidade/posts/${postId}`;

  return (
    <div className="fixed inset-0 z-30">
      <div className="relative mx-auto flex h-full max-w-[480px] flex-col justify-end lg:max-w-none lg:items-center lg:justify-center lg:p-6">
        <Link
          href={closeHref}
          scroll={false}
          aria-label="Fechar denúncia"
          className="absolute inset-0 bg-texto/50"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-denuncia"
          aria-describedby="descricao-denuncia"
          className="relative flex max-h-[90dvh] flex-col gap-4 overflow-y-auto rounded-t-[28px] bg-fundo px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] lg:w-full lg:max-w-[520px] lg:rounded-[28px] lg:px-6 lg:pt-6 lg:pb-6 lg:shadow-xl"
        >
          <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-superficie-forte lg:hidden" />
          <div className="flex flex-col gap-1">
            <h2 id="titulo-denuncia" className="font-display text-[22px] leading-tight font-bold">
              Denunciar post
            </h2>
            <p id="descricao-denuncia" className="text-sm leading-[1.45] text-texto-secundario">
              Por que você está denunciando este post? A moderação analisa em até 24 h.
            </p>
          </div>
          <ReportForm postId={postId} closeHref={closeHref} />
        </div>
      </div>
    </div>
  );
}
