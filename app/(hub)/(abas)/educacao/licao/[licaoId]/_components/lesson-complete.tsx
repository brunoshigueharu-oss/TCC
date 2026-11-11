"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { ActionLink } from "@/components/action-link";
import { formatTwoDigits } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;

type LessonCompleteProps = {
  lessonNumber: number;
  lessonTitle: string;
  xp: number;
  stepsCount: number;
  questions: { total: number; firstTry: number };
  minutes: number;
  moduleNumber: number;
  nextLesson: { id: string; number: number; title: string } | null;
  moduleId: string;
  onReview: () => void;
};

function Stat({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="flex flex-col gap-2 border-t border-linha pt-3"
    >
      <dt className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">{label}</dt>
      <dd className="font-mono text-2xl font-light tabular-nums">{value}</dd>
    </motion.div>
  );
}

/**
 * Fechamento da lição: sóbrio, sem comemoração. O XP aparece grande e fino,
 * como os números do herói; abaixo, o resumo e o próximo passo.
 */
export function LessonComplete({
  lessonNumber,
  lessonTitle,
  xp,
  stepsCount,
  questions,
  minutes,
  moduleNumber,
  nextLesson,
  moduleId,
  onReview,
}: LessonCompleteProps) {
  return (
    <section aria-labelledby="licao-concluida" className="flex max-w-[720px] flex-col gap-10 py-6 lg:py-12">
      <div className="flex flex-col gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase"
        >
          <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
          Lição {formatTwoDigits(lessonNumber)} concluída
        </motion.p>
        <motion.h2
          id="licao-concluida"
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display text-[40px] leading-[1] font-medium tracking-[-0.045em] text-balance lg:text-[64px]"
        >
          {lessonTitle}
        </motion.h2>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className="flex items-baseline gap-3"
      >
        <span className="font-display text-[88px] leading-none font-light tracking-[-0.06em] tabular-nums lg:text-[120px]">
          +{xp}
        </span>
        <span className="font-mono text-sm tracking-wide text-texto-secundario uppercase">XP</span>
      </motion.p>

      <dl className="grid grid-cols-3 gap-4 sm:gap-8">
        <Stat label="Etapas" value={formatTwoDigits(stepsCount)} delay={0.3} />
        <Stat
          label="De primeira"
          value={`${formatTwoDigits(questions.firstTry)}/${formatTwoDigits(questions.total)}`}
          delay={0.38}
        />
        <Stat label="Minutos" value={formatTwoDigits(minutes)} delay={0.46} />
      </dl>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="flex flex-col gap-6"
      >
        {nextLesson ? (
          <div className="flex flex-col gap-1 border-t border-texto pt-4">
            <p className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase">
              A seguir · Lição {formatTwoDigits(nextLesson.number)}
            </p>
            <p className="font-display text-2xl leading-tight font-medium tracking-[-0.03em]">{nextLesson.title}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 border-t border-texto pt-4">
            <p className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase">A seguir</p>
            <p className="font-display text-2xl leading-tight font-medium tracking-[-0.03em]">
              Checkpoint do módulo {formatTwoDigits(moduleNumber)}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {/* No protótipo a próxima lição continua bloqueada: o botão leva de volta ao mapa. */}
          <ActionLink href={nextLesson ? "/educacao" : `/educacao/checkpoint/${moduleId}`}>
            {nextLesson ? "Voltar à trilha" : "Abrir checkpoint"}
            <ArrowRight aria-hidden />
          </ActionLink>
          <button
            type="button"
            onClick={onReview}
            className="flex h-11 items-center rounded-full px-5 text-sm font-semibold outline-none ring-1 ring-linha transition-colors hover:bg-superficie hover:ring-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.98]"
          >
            Rever a lição
          </button>
        </div>
      </motion.div>
    </section>
  );
}
