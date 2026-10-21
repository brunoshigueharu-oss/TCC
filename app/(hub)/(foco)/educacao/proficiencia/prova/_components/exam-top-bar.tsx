import { Clock, X } from "lucide-react";
import Link from "next/link";

type ExamTopBarProps = {
  minutesLeft: number;
};

/** Barra da prova: sair à esquerda, tempo de referência restante à direita. */
export function ExamTopBar({ minutesLeft }: ExamTopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 bg-fundo px-2 ring-1 ring-linha/70">
      <Link
        href="/educacao/proficiencia"
        className="flex h-11 items-center gap-2 rounded-xl px-2 text-[15px] font-semibold"
      >
        <X aria-hidden className="size-[22px]" strokeWidth={1.75} />
        Sair da prova
      </Link>
      <p className="mr-2 flex items-center gap-1.5 rounded-full bg-superficie px-3 py-1.5 text-sm font-semibold">
        <Clock aria-hidden className="size-4" strokeWidth={2} />≈ {minutesLeft} min restantes
      </p>
    </header>
  );
}
