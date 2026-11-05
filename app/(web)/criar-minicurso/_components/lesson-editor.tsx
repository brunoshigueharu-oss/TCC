"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Link2, Paperclip, Plus, Video, X } from "lucide-react";
import { useState, useTransition, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";

import { brandButtonVariants } from "@/components/brand-button-variants";
import { ColorBurstButton } from "@/components/color-burst-button";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DraftLesson } from "@/lib/data/criar-minicurso";
import { saveLesson, type SaveLessonResult } from "../_actions/save-lesson";
import { lessonFormSchema, type LessonFormValues } from "../_schemas/lesson-form";

const inputClass = "h-11 rounded-xl bg-fundo px-3 text-[15px] md:text-[15px]";
const outlineButtonClass = brandButtonVariants({ variant: "secondary", size: "sm" });

type LessonEditorProps = {
  courseId: string;
  lesson: DraftLesson;
  lessonNumber: number;
  totalLessons: number;
};

/**
 * Coluna central: edição da aula aberta. Formulário com React Hook Form + Zod;
 * o envio vai para a Server Action `saveLesson`. Use `key={lesson.id}` para
 * reiniciar o formulário ao trocar de aula.
 */
export function LessonEditor({ courseId, lesson, lessonNumber, totalLessons }: LessonEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SaveLessonResult | null>(null);
  const [isWriting, setIsWriting] = useState(lesson.content.length > 0);
  const [videoName, setVideoName] = useState<string | null>(
    lesson.hasVideo ? "video-da-aula.mp4" : null,
  );

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      courseId,
      lessonId: lesson.id,
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      hasVideo: lesson.hasVideo,
    },
  });

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoName(file.name);
    form.setValue("hasVideo", true, { shouldValidate: form.formState.isSubmitted });
  }

  function handleRemoveVideo() {
    setVideoName(null);
    form.setValue("hasVideo", false, { shouldValidate: form.formState.isSubmitted });
  }

  function handleSubmit(values: LessonFormValues) {
    setResult(null);
    startTransition(async () => {
      const response = await saveLesson(values);
      setResult(response);
      if (response.errors) {
        for (const [field, messages] of Object.entries(response.errors)) {
          if (field in values && messages?.[0]) {
            form.setError(field as keyof LessonFormValues, { message: messages[0] });
          }
        }
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      aria-labelledby="aula-titulo"
      className="flex flex-col gap-5 p-5 lg:p-6"
      noValidate
    >
      <h2 id="aula-titulo" className="text-xs font-semibold text-texto-secundario">
        Aula {lessonNumber} de {totalLessons}
      </h2>

      <FieldGroup className="grid gap-5 md:grid-cols-2">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="aula-titulo-campo">Título da aula</FieldLabel>
              <Input
                {...field}
                id="aula-titulo-campo"
                aria-invalid={fieldState.invalid}
                placeholder="Ex.: Descrevendo componentes para a IA"
                className={inputClass}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="aula-descricao">Descrição</FieldLabel>
              <Input
                {...field}
                id="aula-descricao"
                aria-invalid={fieldState.invalid}
                placeholder="O que a pessoa aprende nesta aula, em uma frase."
                className={inputClass}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FieldGroup>

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={isWriting ? "aula-conteudo" : undefined}>Conteúdo da aula</FieldLabel>
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-linha bg-superficie p-4">
              {!isWriting && !videoName ? (
                <p className="py-4 text-center text-sm text-texto-secundario">
                  Envie um vídeo ou escreva o conteúdo da aula.
                </p>
              ) : null}

              {videoName ? (
                <div className="flex items-center gap-3 rounded-xl bg-fundo px-3 py-2 ring-1 ring-linha">
                  <Video aria-hidden className="size-4 shrink-0" strokeWidth={2} />
                  <span className="min-w-0 flex-1 truncate text-sm">{videoName}</span>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    aria-label="Remover vídeo"
                    className="flex size-9 items-center justify-center rounded-full hover:bg-superficie"
                  >
                    <X aria-hidden className="size-4" strokeWidth={2} />
                  </button>
                </div>
              ) : null}

              {isWriting ? (
                <Textarea
                  {...field}
                  id="aula-conteudo"
                  aria-invalid={fieldState.invalid}
                  placeholder="Escreva a explicação, os passos e um prompt de exemplo."
                  className="min-h-40 rounded-xl bg-fundo px-3 py-2.5 text-[15px] md:text-[15px]"
                />
              ) : null}

              <div className="flex flex-wrap justify-center gap-2">
                {videoName ? null : (
                  <label className={`${outlineButtonClass} cursor-pointer focus-within:ring-2 focus-within:ring-texto`}>
                    <Video aria-hidden className="size-4" strokeWidth={2} />
                    Enviar vídeo
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="sr-only" />
                  </label>
                )}
                {isWriting ? null : (
                  <ColorBurstButton type="button" onClick={() => setIsWriting(true)} variant="secondary" size="sm">
                    <FileText aria-hidden strokeWidth={2} />
                    Escrever texto
                  </ColorBurstButton>
                )}
              </div>
            </div>
            <FieldDescription>O vídeo não é enviado de verdade no protótipo.</FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Materiais de apoio</p>
        <ul className="flex flex-wrap gap-2">
          {lesson.materials.map((material) => (
            <li
              key={material.id}
              className="flex h-11 items-center gap-2 rounded-xl bg-fundo px-3 text-sm ring-1 ring-linha"
            >
              {material.kind === "arquivo" ? (
                <Paperclip aria-hidden className="size-4" strokeWidth={2} />
              ) : (
                <Link2 aria-hidden className="size-4" strokeWidth={2} />
              )}
              {material.label}
            </li>
          ))}
          <li>
            <Button
              type="button"
              disabled
              className="h-11 rounded-full border border-dashed border-linha bg-fundo px-5 text-sm font-semibold text-texto"
            >
              <Plus aria-hidden strokeWidth={2.5} />
              Adicionar material
              <span className="sr-only">(em breve)</span>
            </Button>
          </li>
        </ul>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-linha pt-5 sm:flex-row sm:items-center sm:justify-end">
        {result ? (
          <p
            role={result.success ? "status" : "alert"}
            className="text-sm text-texto-secundario sm:mr-auto"
          >
            {result.message}
          </p>
        ) : null}
        <ColorBurstButton type="submit" disabled={isPending} variant="secondary">
          {isPending ? "Salvando…" : "Salvar aula"}
        </ColorBurstButton>
      </div>
    </form>
  );
}
