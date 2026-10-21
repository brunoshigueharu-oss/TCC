import Link from "next/link";

import { cn } from "@/lib/utils";

type OrderOption = {
  label: string;
  href: string;
  isActive: boolean;
};

type OrderTabsProps = {
  options: OrderOption[];
};

/** Alternância Recentes / Mais úteis; a ordem fica na URL (`?ordem=`). */
export function OrderTabs({ options }: OrderTabsProps) {
  return (
    <nav aria-label="Ordenar posts" className="mx-4 lg:mx-0">
      <ul className="grid grid-cols-2 gap-1 rounded-2xl bg-fundo p-1 ring-1 ring-linha/70 lg:w-80">
        {options.map((option) => (
          <li key={option.label}>
            <Link
              href={option.href}
              scroll={false}
              aria-current={option.isActive ? "true" : undefined}
              className={cn(
                "flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                option.isActive ? "bg-texto text-fundo" : "text-texto-secundario hover:text-texto",
              )}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
