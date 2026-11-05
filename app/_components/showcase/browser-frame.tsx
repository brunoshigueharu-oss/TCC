import Image from "next/image";

type BrowserFrameProps = {
  url: string;
  image: string;
  imageAlt: string;
};

/** Print de um site dentro de uma janela de navegador simplificada. */
export function BrowserFrame({ url, image, imageAlt }: BrowserFrameProps) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return (
    <div className="flex size-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-linha px-3 py-2">
        <span className="size-2 rounded-full bg-pratica" />
        <span className="size-2 rounded-full bg-trilha" />
        <span className="size-2 rounded-full bg-acao" />
        <span className="ml-2 flex-1 truncate rounded-full bg-superficie px-3 py-0.5 text-[10px] text-texto-secundario">
          {host}
        </span>
      </div>
      <div className="relative flex-1">
        <Image
          src={image}
          alt={imageAlt}
          fill
          // Todas as peças ficam montadas na faixa sem fim; carregar já evita buraco ao girar.
          loading="eager"
          draggable={false}
          sizes="(min-width: 640px) 640px, 70vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
