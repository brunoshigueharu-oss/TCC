import { cn } from "@/lib/utils";

/**
 * Manchas de tinta do hover, lado a lado ao longo do botão.
 * - `follow`: segue o mouse com força e sentido próprios (algumas vão contra o
 *   ponteiro, o que faz as cores se cruzarem) e com atraso diferente, para a
 *   tinta parecer viscosa.
 * - `orbit`: giro lento de cada mancha, com duração e sentido próprios.
 * Classes literais porque o Tailwind não enxerga nomes montados em runtime.
 */
const inkBlobs = [
  {
    color: "bg-pratica",
    position: "left-[-18%] -top-5",
    follow:
      "translate-x-[calc(var(--pointer-x,0px)*0.9)] translate-y-[calc(var(--pointer-y,0px)*0.9)] duration-300",
    orbit: "[animation-duration:3.2s]",
    delay: "delay-0",
  },
  {
    color: "bg-trilha",
    position: "left-[14%] top-[-34px]",
    follow:
      "translate-x-[calc(var(--pointer-x,0px)*-0.6)] translate-y-[calc(var(--pointer-y,0px)*0.7)] duration-700",
    orbit: "[animation-duration:4.4s] [animation-direction:reverse]",
    delay: "delay-75",
  },
  {
    color: "bg-comunidade",
    position: "left-[44%] -top-2",
    follow:
      "translate-x-[calc(var(--pointer-x,0px)*0.7)] translate-y-[calc(var(--pointer-y,0px)*-0.8)] duration-500",
    orbit: "[animation-duration:3.8s]",
    delay: "delay-150",
  },
  {
    color: "bg-acao",
    position: "left-[74%] top-[-30px]",
    follow:
      "translate-x-[calc(var(--pointer-x,0px)*-0.8)] translate-y-[calc(var(--pointer-y,0px)*-0.6)] duration-1000",
    orbit: "[animation-duration:5s] [animation-direction:reverse]",
    delay: "delay-200",
  },
] as const;

/**
 * Camada de tinta do botão primário. O elemento pai precisa ter `group`,
 * `relative isolate overflow-hidden` (já vem em `brandButtonVariants`) e
 * receber os handlers de `usePointerOffset`.
 */
export function InkBurst() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 saturate-[1.8]">
      {inkBlobs.map((blob) => (
        <span
          key={blob.color}
          className={cn(
            "absolute size-20 transition-[translate] ease-out motion-reduce:translate-none",
            blob.position,
            blob.follow,
          )}
        >
          <span
            className={cn(
              "block size-full scale-0 rounded-full opacity-0 blur-md transition-[scale,opacity] duration-700 ease-out group-hover:scale-[1.6] group-hover:animate-blob-orbit group-hover:opacity-100 group-focus-visible:scale-[1.6] group-focus-visible:animate-blob-orbit group-focus-visible:opacity-100 motion-reduce:transition-none motion-reduce:animate-none!",
              blob.color,
              blob.orbit,
              blob.delay,
            )}
          />
        </span>
      ))}
    </span>
  );
}
