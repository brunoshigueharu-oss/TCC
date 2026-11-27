import { cn } from "@/lib/utils";

/** Seta pontilhada entre dois post-its. Horizontal no desktop, girada para baixo quando eles empilham. */
export function DottedArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 12"
      fill="none"
      aria-hidden
      className={cn("pointer-events-none absolute text-texto-secundario", className)}
    >
      <path d="M3 6 H38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 5" />
      <path
        d="M37 1.8 L43.5 6 L37 10.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
