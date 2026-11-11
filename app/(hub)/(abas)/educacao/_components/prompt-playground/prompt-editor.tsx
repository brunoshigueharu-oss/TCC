"use client";

import { ChevronsUpDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Switch } from "@/components/ui/switch";
import {
  getParam,
  getParamValue,
  splitFragmentText,
  type FragmentId,
  type ParamId,
  type PlaygroundScenario,
  type PromptState,
} from "@/lib/data/playground";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type PromptEditorProps = {
  scenario: PlaygroundScenario;
  state: PromptState;
  onToggleFragment: (id: FragmentId) => void;
  onCycleParam: (id: ParamId) => void;
};

type ParamButtonProps = {
  label: string;
  value: string;
  isDisabled: boolean;
  onCycle: () => void;
};

/** Valor trocável dentro do prompt: cada clique passa para a próxima opção. */
function ParamButton({ label, value, isDisabled, onCycle }: ParamButtonProps) {
  return (
    <button
      type="button"
      onClick={onCycle}
      disabled={isDisabled}
      aria-label={`${label}: ${value}. Trocar valor`}
      className="group/param -my-1 inline-flex items-baseline gap-1 rounded-md px-1 py-1 align-baseline font-semibold text-texto underline decoration-acao decoration-2 underline-offset-4 outline-none transition-colors hover:bg-superficie focus-visible:ring-2 focus-visible:ring-texto active:bg-superficie-forte disabled:text-inherit disabled:no-underline"
    >
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "0.9em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-0.9em", opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block whitespace-nowrap"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <ChevronsUpDown
        aria-hidden
        className="size-3 shrink-0 translate-y-px text-texto-secundario group-disabled/param:hidden"
        strokeWidth={2}
      />
    </button>
  );
}

/**
 * O prompt em trechos. A primeira frase (o pedido vago) é fixa; cada trecho
 * abaixo liga ou desliga e pode ter valores trocáveis.
 */
export function PromptEditor({ scenario, state, onToggleFragment, onCycleParam }: PromptEditorProps) {
  return (
    <div className="flex flex-col">
      <p className="flex gap-3 border-b border-linha py-4 font-mono text-[14px] leading-relaxed">
        <span aria-hidden className="text-texto-secundario select-none">
          &gt;
        </span>
        {scenario.basePrompt}
      </p>

      <ul>
        {scenario.fragments.map((fragment, index) => {
          const isEnabled = state.enabled.includes(fragment.id);
          const switchId = `trecho-${fragment.id}`;

          return (
            <li key={fragment.id} className="flex flex-col gap-2 border-b border-linha py-3.5">
              <label htmlFor={switchId} className="flex min-h-7 cursor-pointer items-center gap-3">
                <span aria-hidden className="w-5 font-mono text-[11px] text-texto-secundario tabular-nums">
                  {formatTwoDigits(index + 1)}
                </span>
                <span
                  className={cn(
                    "flex-1 text-xs font-semibold tracking-[0.08em] uppercase transition-colors",
                    isEnabled ? "text-texto" : "text-texto-secundario",
                  )}
                >
                  {fragment.label}
                </span>
                <Switch
                  id={switchId}
                  checked={isEnabled}
                  onCheckedChange={() => onToggleFragment(fragment.id)}
                  className="data-checked:bg-texto dark:data-checked:bg-texto"
                />
              </label>
              <p
                className={cn(
                  "pl-8 font-mono text-[13.5px] leading-relaxed transition-colors duration-200",
                  isEnabled ? "text-texto" : "text-desativado",
                )}
              >
                {splitFragmentText(fragment.text).map((part, partIndex) =>
                  part.type === "text" ? (
                    <span key={partIndex}>{part.value}</span>
                  ) : (
                    <ParamButton
                      key={partIndex}
                      label={getParam(scenario, part.id).label}
                      value={getParamValue(scenario, state, part.id)}
                      isDisabled={!isEnabled}
                      onCycle={() => onCycleParam(part.id)}
                    />
                  ),
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
