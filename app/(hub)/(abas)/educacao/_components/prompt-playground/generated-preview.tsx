"use client";

import { AnimatePresence, motion } from "motion/react";

import type { FragmentId, PlaygroundScenario, PromptState } from "@/lib/data/playground";
import { getParamValue } from "@/lib/data/playground";
import { cn } from "@/lib/utils";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const widthClasses = ["w-[81%]", "w-[67%]", "w-full"];
const colorClasses = ["bg-acao", "bg-pratica", "bg-comunidade"];
const radiusClasses = ["rounded-xl", "rounded-none", "rounded-[20px]"];

const EASE = [0.22, 1, 0.36, 1] as const;
const layoutTransition = { duration: 0.35, ease: EASE };

type GeneratedPreviewProps = {
  scenario: PlaygroundScenario;
  state: PromptState;
  className?: string;
};

/**
 * A "interface gerada": um card de curso desenhado pelo hub que muda conforme
 * os trechos do prompt. Sem um trecho, o card mostra o palpite genérico que
 * uma IA daria (texto de exemplo, roxo, sombra pesada, botão pequeno).
 */
export function GeneratedPreview({ scenario, state, className }: GeneratedPreviewProps) {
  const has = (id: FragmentId) => state.enabled.includes(id);
  const { content } = scenario;

  const hasTokens = has("tokens");
  const hasHierarchy = has("hierarquia");
  const hasMeasures = has("medidas");
  const radius = hasTokens ? radiusClasses[state.values.raio] : "rounded-3xl";

  return (
    <div className={cn("flex w-full flex-col items-center gap-4", className)}>
      <motion.div
        layout
        transition={layoutTransition}
        className={cn("flex flex-col gap-2", hasMeasures ? widthClasses[state.values.largura] : "w-full")}
      >
        {/* Cota de largura, como numa prancheta. */}
        <motion.div layout="position" transition={layoutTransition} aria-hidden className="flex items-center gap-2">
          <span className={cn("h-px flex-1", hasMeasures ? "bg-texto-secundario" : "border-t border-dashed border-desativado")} />
          <span className="font-mono text-[10px] tracking-wide text-texto-secundario uppercase tabular-nums">
            {hasMeasures ? getParamValue(scenario, state, "largura") : "largura ?"}
          </span>
          <span className={cn("h-px flex-1", hasMeasures ? "bg-texto-secundario" : "border-t border-dashed border-desativado")} />
        </motion.div>

        <motion.article
          layout
          transition={layoutTransition}
          className={cn(
            "flex flex-col p-5 transition-[background-color,border-color,box-shadow,border-radius] duration-300",
            radius,
            hasTokens
              ? "border border-linha bg-fundo text-texto"
              : "border border-transparent bg-white text-tinta shadow-2xl shadow-violet-500/30",
            hasHierarchy ? "items-start gap-1 text-left" : "items-center gap-2 text-center",
          )}
        >
          {has("conteudo") ? (
            <>
              <motion.p
                layout="position"
                transition={layoutTransition}
                className={cn(
                  hasHierarchy
                    ? "text-[11px] font-semibold tracking-[0.08em] uppercase opacity-60"
                    : "text-base",
                )}
              >
                {content.eyebrow}
              </motion.p>
              <motion.h3
                layout="position"
                transition={layoutTransition}
                className={cn(
                  hasHierarchy
                    ? "font-display text-xl leading-tight font-semibold tracking-[-0.02em]"
                    : "text-base font-bold",
                )}
              >
                {content.title}
              </motion.h3>
              <motion.p
                layout="position"
                transition={layoutTransition}
                className={cn(hasHierarchy ? "text-[13px] opacity-60" : "text-base")}
              >
                {content.author} · {content.meta}
              </motion.p>
            </>
          ) : (
            <>
              <motion.h3
                layout="position"
                transition={layoutTransition}
                className={cn(
                  hasHierarchy
                    ? "font-display text-xl leading-tight font-semibold tracking-[-0.02em]"
                    : "text-base font-bold",
                )}
              >
                Título do card
              </motion.h3>
              <motion.p
                layout="position"
                transition={layoutTransition}
                className={cn(hasHierarchy ? "text-[13px] opacity-60" : "text-base")}
              >
                Lorem ipsum dolor sit amet.
              </motion.p>
            </>
          )}

          <motion.span
            layout
            transition={layoutTransition}
            className={cn(
              "mt-3 flex items-center justify-center font-semibold transition-[background-color,border-radius,color] duration-300",
              hasMeasures ? "h-11 w-full text-[15px]" : "h-7 px-3 text-xs",
              hasTokens
                ? cn(radius, colorClasses[state.values.cor], "text-tinta")
                : "rounded-full bg-violet-500 text-white",
            )}
          >
            <motion.span layout="position" transition={layoutTransition}>
              {has("conteudo") ? content.action : "Clique aqui"}
            </motion.span>
          </motion.span>
        </motion.article>
      </motion.div>

      {/* Estados do botão: só existem quando o prompt pede. */}
      <AnimatePresence initial={false}>
        {has("estados") ? (
          <motion.dl
            key="estados"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex items-end gap-5"
          >
            {[
              { label: "padrão", className: "" },
              { label: "hover", className: "opacity-75" },
              { label: "foco", className: "ring-2 ring-texto ring-offset-2 ring-offset-superficie" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <dd
                  className={cn(
                    "h-5 w-12 transition-[background-color,border-radius] duration-300",
                    hasTokens
                      ? cn(state.values.raio === 1 ? "rounded-none" : "rounded-md", colorClasses[state.values.cor])
                      : "rounded-full bg-violet-500",
                    item.className,
                  )}
                />
                <dt className="font-mono text-[10px] tracking-wide text-texto-secundario uppercase">{item.label}</dt>
              </div>
            ))}
          </motion.dl>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
