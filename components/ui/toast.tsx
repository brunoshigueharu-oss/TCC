"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastTone = "neutro" | "sucesso" | "erro";
type ToastData = { tone?: ToastTone };

const toastManager = ToastPrimitive.createToastManager<ToastData>();

type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Tempo na tela, em ms (padrão 4000). */
  timeout?: number;
};

/**
 * Mostra um aviso curto no canto da tela. Pode ser chamado de qualquer Client
 * Component, sem contexto: `toast({ title: "Aula salva" })`.
 */
export function toast({ title, description, tone = "neutro", timeout = 4000 }: ToastOptions) {
  return toastManager.add({
    title,
    description,
    timeout,
    priority: tone === "erro" ? "high" : "low",
    data: { tone },
  });
}

// Classes literais por tom (o Tailwind não lê nomes montados).
const toneMarker: Record<ToastTone, string> = {
  neutro: "bg-texto-secundario",
  sucesso: "bg-acao",
  erro: "bg-destructive",
};

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>();

  return toasts.map((item) => (
    <ToastPrimitive.Root
      key={item.id}
      toast={item}
      swipeDirection={["right", "down"]}
      className="relative w-full translate-x-(--toast-swipe-movement-x) translate-y-(--toast-swipe-movement-y) rounded-xl border border-linha bg-fundo text-texto shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)] transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] select-none data-ending-style:opacity-0 data-limited:hidden data-starting-style:translate-y-3 data-starting-style:opacity-0 data-ending-style:data-[swipe-direction=right]:translate-x-[calc(var(--toast-swipe-movement-x)+100%)]"
    >
      <ToastPrimitive.Content className="flex items-start gap-3 py-3 pr-2 pl-4">
        <span
          aria-hidden
          className={cn("mt-[7px] size-2 shrink-0 rounded-[2px]", toneMarker[item.data?.tone ?? "neutro"])}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
          <ToastPrimitive.Title className="text-sm leading-snug font-semibold" />
          <ToastPrimitive.Description className="text-sm leading-snug text-texto-secundario" />
        </div>
        <ToastPrimitive.Close
          aria-label="Fechar aviso"
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
        >
          <X aria-hidden className="size-4" strokeWidth={2} />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ));
}

/**
 * Região dos avisos. Já está montada uma vez em `app/layout.tsx`; não monte de
 * novo. No celular sobe acima da barra inferior.
 */
export function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} limit={3}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-[calc(88px+env(safe-area-inset-bottom))] left-4 z-[90] flex flex-col-reverse gap-2 sm:left-auto sm:w-[360px] lg:right-6 lg:bottom-6">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
