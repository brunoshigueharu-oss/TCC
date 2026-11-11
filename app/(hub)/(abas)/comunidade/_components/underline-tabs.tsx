"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type UnderlineTab = {
  label: string;
  href: string;
  isActive: boolean;
  /** Número em mono ao lado do rótulo (ex.: posts na tag). */
  count?: number;
};

type UnderlineTabsProps = {
  /** Nome único na tela: liga o indicador entre renderizações. */
  id: string;
  label: string;
  tabs: UnderlineTab[];
  className?: string;
};

/**
 * Abas/filtros em texto, com um traço que desliza até o item ativo. O estado
 * mora na URL (cada aba é um link); o componente só anima a troca. No celular
 * a faixa rola na horizontal, sangrando até a borda.
 */
export function UnderlineTabs({
  id,
  label,
  tabs,
  className,
}: UnderlineTabsProps) {
  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label={label}
        className={cn(
          "-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        <ul className="flex w-max gap-6 lg:w-auto lg:flex-wrap">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                scroll={false}
                aria-current={tab.isActive ? "true" : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-1.5 text-sm font-semibold whitespace-nowrap outline-none transition-colors duration-200 focus-visible:underline focus-visible:underline-offset-4",
                  tab.isActive
                    ? "text-texto"
                    : "text-texto-secundario hover:text-texto",
                )}
              >
                {tab.label}
                {tab.count === undefined ? null : (
                  <span className="font-mono text-[11px] font-normal tabular-nums text-texto-secundario">
                    {tab.count}
                  </span>
                )}
                {tab.isActive ? (
                  <motion.span
                    layoutId={`aba-ativa-${id}`}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-texto"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </MotionConfig>
  );
}
