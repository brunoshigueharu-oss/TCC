"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Evento disparado em `instrumentation-client.ts`. */
const NAVIGATION_START_EVENT = "base8-navegacao-inicio";
/** Só aparece se a navegação passar disso (navegações rápidas não piscam). */
const SHOW_DELAY_MS = 120;
/** Se a navegação nunca terminar (erro de rede), some sozinha. */
const GIVE_UP_MS = 10_000;

type Phase = "parada" | "carregando" | "concluindo";

function ProgressLine() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("parada");
  const timers = useRef<number[]>([]);

  function clearTimers() {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }

  useEffect(() => {
    function handleStart() {
      clearTimers();
      timers.current.push(
        window.setTimeout(() => setPhase("carregando"), SHOW_DELAY_MS),
        window.setTimeout(() => setPhase("parada"), GIVE_UP_MS),
      );
    }
    window.addEventListener(NAVIGATION_START_EVENT, handleStart);
    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, handleStart);
      clearTimers();
    };
  }, []);

  // A URL mudou: a navegação terminou. Completa a barra (ajuste durante o
  // render, sem efeito em cascata) e cancela o "mostrar" pendente.
  const urlKey = `${pathname}?${searchParams.toString()}`;
  const [lastUrlKey, setLastUrlKey] = useState(urlKey);
  if (urlKey !== lastUrlKey) {
    setLastUrlKey(urlKey);
    setPhase((current) => (current === "carregando" ? "concluindo" : "parada"));
  }

  useEffect(() => {
    clearTimers();
  }, [urlKey]);

  useEffect(() => {
    if (phase !== "concluindo") return;
    const timer = window.setTimeout(() => setPhase("parada"), 600);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-texto transition-[transform,opacity] ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "parada" && "scale-x-0 opacity-0 duration-0",
        phase === "carregando" && "scale-x-[0.72] opacity-100 duration-[6000ms]",
        phase === "concluindo" && "scale-x-100 opacity-0 [transition-duration:300ms,400ms] [transition-delay:0ms,200ms]",
      )}
    />
  );
}

/**
 * Barra fina de carregamento no topo da janela, durante navegações que
 * demoram. Sobe até ~70% devagar e completa quando a tela nova chega.
 * Decorativa: o leitor de tela recebe o título da página nova.
 */
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressLine />
    </Suspense>
  );
}
