import type { InteractionHintText } from "@/lib/data/landing";
import { cn } from "@/lib/utils";

type CrumpleCalloutProps = {
  hint: InteractionHintText;
  /** Some depois do primeiro papel amassado: a pessoa já entendeu o gesto. */
  isVisible: boolean;
};

const onlyWithMouse = "[@media(hover:none)]:hidden";
const onlyWithTouch = "hidden [@media(hover:none)]:inline";

/**
 * Dica escrita ao lado do primeiro post-it, com uma seta curva que vai e volta
 * na direção dele. Acima do papel quando a tela é estreita; à esquerda dele
 * quando sobra margem (2xl). Fica dentro da caixa do post-it (`callout`).
 */
export function CrumpleCallout({ hint, isVisible }: CrumpleCalloutProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-30 flex w-44 flex-col items-start transition-opacity duration-300",
        "bottom-[96%] left-[-2%]",
        "2xl:top-[2%] 2xl:right-[96%] 2xl:bottom-auto 2xl:left-auto",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="font-display text-base font-medium tracking-[-0.01em] text-texto">
        <span className={onlyWithMouse}>{hint.pointer}</span>
        <span className={onlyWithTouch}>{hint.touch}</span>
      </span>
      <svg
        viewBox="0 0 72 48"
        fill="none"
        className="mt-1 ml-16 h-12 w-[72px] animate-nudge text-texto [--nudge-x:5px] [--nudge-y:5px] motion-reduce:animate-none"
      >
        <path
          d="M4 4 C 10 26, 30 40, 62 40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M54 33 L63 40 L54 46"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
