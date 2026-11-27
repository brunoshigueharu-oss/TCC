import Image from "next/image";

import type { CollageArt } from "@/lib/collage-art";

type CollageImageProps = {
  art: CollageArt;
  /** Largura aproximada na tela, para o navegador escolher o arquivo certo. */
  sizes: string;
  className?: string;
};

/** Adesivo de colagem (`lib/collage-art.ts`): sempre decorativo e sem arrasto nativo da imagem. */
export function CollageImage({ art, sizes, className }: CollageImageProps) {
  return (
    <Image
      src={art.src}
      alt=""
      width={art.width}
      height={art.height}
      sizes={sizes}
      draggable={false}
      className={className}
    />
  );
}
