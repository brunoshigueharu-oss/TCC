"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useCallback, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ExpandPanelProps = {
  /** Conteúdo do gatilho: é a partir dele que o painel cresce. */
  trigger: ReactNode;
  triggerClassName?: string;
  /** Nome acessível do gatilho, quando o conteúdo dele não é texto. */
  triggerLabel?: string;
  /** `false` tira o gatilho da ordem do Tab, quando o teclado chega a ele por outro caminho. */
  isTriggerTabbable?: boolean;
  /** Rótulo pequeno acima do título do painel. */
  eyebrow: string;
  title: string;
  children: ReactNode;
};

/**
 * Abertura: a caixa cresce na curva padrão do site e fica opaca logo no
 * começo, para dar para ver que ela sai do gatilho. Fechamento: encolhe um
 * pouco mais rápido e só some no fim, já em cima do gatilho.
 */
const boxTransition = cn(
  "[transition:translate_.42s_cubic-bezier(0.22,1,0.36,1),scale_.42s_cubic-bezier(0.22,1,0.36,1),opacity_.12s_linear]",
  "data-ending-style:[transition:translate_.34s_cubic-bezier(0.22,1,0.36,1),scale_.34s_cubic-bezier(0.22,1,0.36,1),opacity_.18s_linear_.14s]",
);

/**
 * Ponto de partida (e de chegada, ao fechar): o painel fica do tamanho e no
 * lugar do gatilho. As variáveis `--from-*` são medidas quando ele monta.
 *
 * No ponto de partida a transição fica desligada: as variáveis chegam um
 * instante depois do painel e, com a transição ligada, ele sairia do centro
 * (o valor reserva) em vez de sair do gatilho.
 */
const boxFromTrigger = cn(
  "data-starting-style:transition-none",
  "data-starting-style:translate-x-[calc(-50%_+_var(--from-x,0px))] data-starting-style:translate-y-[calc(-50%_+_var(--from-y,0px))]",
  "data-starting-style:scale-x-[var(--from-scale-x,0.9)] data-starting-style:scale-y-[var(--from-scale-y,0.9)] data-starting-style:opacity-0",
  "data-ending-style:translate-x-[calc(-50%_+_var(--from-x,0px))] data-ending-style:translate-y-[calc(-50%_+_var(--from-y,0px))]",
  "data-ending-style:scale-x-[var(--from-scale-x,0.9)] data-ending-style:scale-y-[var(--from-scale-y,0.9)] data-ending-style:opacity-0",
);

/**
 * "Expande para mostrar mais": o elemento clicado cresce até virar um painel
 * por cima da página. É um diálogo modal (fecha no X, no Esc ou clicando
 * fora; o foco volta para o gatilho). Com `prefers-reduced-motion`, abre sem
 * a transição.
 */
export function ExpandPanel({
  trigger,
  triggerClassName,
  triggerLabel,
  isTriggerTabbable = true,
  eyebrow,
  title,
  children,
}: ExpandPanelProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  /** Ao montar, o painel anota de onde sai: centro e tamanho do gatilho em relação aos dele. */
  const measureFromTrigger = useCallback((popup: HTMLDivElement | null) => {
    const origin = triggerRef.current;
    if (!popup || !origin) return;
    const from = origin.getBoundingClientRect();
    popup.style.setProperty("--from-x", `${from.left + from.width / 2 - window.innerWidth / 2}px`);
    popup.style.setProperty("--from-y", `${from.top + from.height / 2 - window.innerHeight / 2}px`);
    popup.style.setProperty("--from-scale-x", String(from.width / popup.offsetWidth));
    popup.style.setProperty("--from-scale-y", String(from.height / popup.offsetHeight));
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger
        ref={triggerRef}
        aria-label={triggerLabel}
        tabIndex={isTriggerTabbable ? undefined : -1}
        className={triggerClassName}
      >
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-tinta/45 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          ref={measureFromTrigger}
          className={cn(
            "group/painel fixed top-1/2 left-1/2 z-[81] flex max-h-[calc(100dvh-2rem)] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-linha bg-fundo text-texto shadow-[0_32px_80px_-24px_rgb(0_0_0/0.45)] outline-none",
            boxTransition,
            boxFromTrigger,
          )}
        >
          {/* O conteúdo aparece depois que a caixa já cresceu, para não ser visto esticado. */}
          <div className="flex min-h-0 flex-1 flex-col transition-opacity delay-150 duration-300 group-data-ending-style/painel:opacity-0 group-data-ending-style/painel:delay-0 group-data-ending-style/painel:duration-100 group-data-starting-style/painel:opacity-0">
            <header className="flex items-start justify-between gap-6 border-b border-linha py-5 pr-4 pl-6 sm:pr-5 sm:pl-8">
              <div className="flex flex-col gap-2">
                <p className="eyebrow">{eyebrow}</p>
                <Dialog.Title className="font-display text-[clamp(24px,3vw,36px)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
                  {title}
                </Dialog.Title>
              </div>
              <Dialog.Close
                aria-label="Fechar"
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
              >
                <X aria-hidden className="size-5" strokeWidth={1.5} />
              </Dialog.Close>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">{children}</div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
