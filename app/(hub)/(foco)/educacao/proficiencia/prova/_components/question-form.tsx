"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ActionLink } from "@/components/action-link";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  examAnswerSchema,
  optionLetterSchema,
  optionLetters,
  type ExamAnswer,
  type OptionLetter,
} from "@/lib/data/proficiencia";
import { answerQuestion } from "../_actions/answer-question";

type QuestionFormProps = {
  questionNumber: number;
  totalQuestions: number;
  text: string;
  options: string[];
  /** Alternativa já escolhida antes (ao voltar para a questão). */
  savedAnswer: OptionLetter | null;
  /** Respostas atuais no formato da URL. */
  answersParam: string;
  previousHref: string | null;
};

/** Enunciado + alternativas da questão, com Anterior / Próxima. */
export function QuestionForm({
  questionNumber,
  totalQuestions,
  text,
  options,
  savedAnswer,
  answersParam,
  previousHref,
}: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ExamAnswer>({
    resolver: zodResolver(examAnswerSchema),
    defaultValues: { answer: savedAnswer ?? undefined },
  });
  const isLastQuestion = questionNumber === totalQuestions;

  function handleSubmit(values: ExamAnswer) {
    startTransition(async () => {
      const result = await answerQuestion(questionNumber, answersParam, values);
      if (result.success) return;
      const message = result.errors?.answer?.[0] ?? result.message;
      if (message) form.setError("answer", { message });
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <Controller
        name="answer"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid} className="gap-4 px-4 lg:px-0">
            <FieldLegend className="mb-5 font-display leading-tight font-bold data-[variant=legend]:text-[22px] lg:data-[variant=legend]:text-[26px]">
              {text}
            </FieldLegend>
            <RadioGroup
              name={field.name}
              value={field.value ?? ""}
              onValueChange={(value) => {
                const letter = optionLetterSchema.safeParse(value);
                if (letter.success) field.onChange(letter.data);
              }}
              aria-invalid={fieldState.invalid}
              className="gap-3 lg:grid-cols-2"
            >
              {optionLetters.map((letter, index) => (
                <FieldLabel
                  key={letter}
                  htmlFor={`alternativa-${letter}`}
                  className="rounded-2xl border-0 bg-fundo ring-1 ring-linha/70 has-data-checked:border-0 has-data-checked:bg-trilha/30 has-data-checked:ring-texto"
                >
                  <Field orientation="horizontal" className="min-h-14 gap-3 px-4 py-3">
                    <RadioGroupItem
                      value={letter}
                      id={`alternativa-${letter}`}
                      className="size-5 border-texto-secundario data-checked:border-texto data-checked:bg-texto"
                    />
                    <span className="text-[15px] leading-snug font-normal">
                      <span className="font-semibold">{letter}.</span> {options[index]}
                    </span>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />

      <div className="flex gap-3 px-4 lg:justify-end lg:px-0">
        {previousHref ? (
          <ActionLink href={previousHref} variant="secondary" className="h-12 flex-1 lg:w-44 lg:flex-none">
            Anterior
          </ActionLink>
        ) : null}
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 flex-1 lg:w-56 lg:flex-none rounded-xl bg-acao text-[15px] font-semibold text-texto hover:bg-acao/90"
        >
          {isPending ? "Salvando…" : isLastQuestion ? "Ver resultado" : "Próxima"}
        </Button>
      </div>
    </form>
  );
}
