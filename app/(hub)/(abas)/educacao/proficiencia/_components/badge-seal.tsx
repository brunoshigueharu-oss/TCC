import { cn } from "@/lib/utils";

/** Circunferência do anel do texto (r = 74), para o texto fechar a volta. */
const RING_LENGTH = 2 * Math.PI * 74 - 6;

type BadgeSealProps = {
  /** Texto que corre em volta do selo. */
  ringText: string;
  /** Número de série do selo, em mono no centro. */
  serial: string;
  className?: string;
};

/**
 * Selo desenhado em linha fina: anéis concêntricos, texto correndo em volta,
 * monograma "B8" ao centro e um traço limão como único acento de cor.
 */
export function BadgeSeal({ ringText, serial, className }: BadgeSealProps) {
  const ticks = Array.from({ length: 48 }, (_, index) => index * 7.5);

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Selo Profissional BASE8"
      className={cn("text-texto [&_text]:fill-current", className)}
    >
      <defs>
        <path id="selo-anel" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="0.75">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="86" />
        <circle cx="100" cy="100" r="62" />
        <circle cx="100" cy="100" r="58" strokeDasharray="1 3" />
      </g>
      <g stroke="currentColor" strokeWidth="0.75">
        {ticks.map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="4"
            x2="100"
            y2={angle % 45 === 0 ? 12 : 8}
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
      </g>
      <text className="font-mono text-[9.5px] tracking-[0.32em] uppercase">
        <textPath href="#selo-anel" startOffset="0" textLength={RING_LENGTH} lengthAdjust="spacing">
          {ringText}
        </textPath>
      </text>
      <text
        x="100"
        y="112"
        textAnchor="middle"
        className="font-display text-[44px] font-medium tracking-[-0.06em]"
      >
        B8
      </text>
      <line x1="80" y1="124" x2="120" y2="124" className="stroke-trilha" strokeWidth="3" />
      <text x="100" y="140" textAnchor="middle" className="font-mono text-[7px] tracking-[0.2em]">
        {serial}
      </text>
    </svg>
  );
}
