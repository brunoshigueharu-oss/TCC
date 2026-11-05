import { cva, type VariantProps } from "class-variance-authority";

/**
 * Estilo único de botão do site, vindo do CTA da Landing: pílula com texto
 * semibold.
 * - `primary`: azul-noite com texto branco; no hover a tinta colorida
 *   (`InkBurst`) se espalha e o texto passa a azul-noite.
 * - `secondary`: branco com contorno fino, para a ação de apoio.
 * Use por meio de `ColorBurstLink` (links) ou `ColorBurstButton` (formulários).
 */
export const brandButtonVariants = cva(
  "group relative isolate flex shrink-0 transform-gpu items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap outline-none transition-[color,background-color,box-shadow,transform] duration-300 focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-texto text-fundo hover:bg-acao hover:text-texto focus-visible:bg-acao focus-visible:text-texto",
        secondary: "bg-fundo text-texto ring-1 ring-linha hover:bg-superficie hover:ring-texto",
      },
      size: {
        md: "h-12 px-8 text-[15px]",
        sm: "h-11 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type BrandButtonVariantProps = VariantProps<typeof brandButtonVariants>;
