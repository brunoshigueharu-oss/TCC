/** Composições disponíveis — uma por tela de boas-vindas. */
export type WelcomeComposition = "entrar" | "cadastro";

type WelcomeShapesProps = {
  composition: WelcomeComposition;
  className?: string;
};

/**
 * Ilustração PROVISÓRIA: formas geométricas Bauhaus em multiply, no lugar
 * reservado para a ilustração. Sai quando as ilustrações da campanha
 * estiverem prontas.
 */
export function WelcomeShapes({ composition, className }: WelcomeShapesProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      {composition === "entrar" ? (
        <g className="mix-blend-multiply">
          <circle cx="48" cy="62" r="32" className="fill-acao" />
          <rect x="60" y="22" width="38" height="38" className="fill-trilha opacity-90" />
          <path d="M66 104 L104 104 L85 70 Z" className="fill-comunidade opacity-90" />
        </g>
      ) : (
        <g className="mix-blend-multiply">
          <path d="M16 96 A44 44 0 0 1 104 96 Z" className="fill-trilha" />
          <circle cx="40" cy="40" r="20" className="fill-pratica opacity-90" />
          <rect x="66" y="22" width="32" height="32" rx="2" className="fill-acao opacity-90" />
        </g>
      )}
    </svg>
  );
}
