"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Link2, Paperclip, Plus, Video, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { brandButtonVariants } from "@/components/brand-button-variants";
import { ColorBurstButton } from "@/components/color-burst-button";
import { ShortcutKeys } from "@/components/command-palette/shortcut-keys";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { DraftLesson } from "@/lib/data/criar-minicurso";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { saveLesson } from "../_actions/save-lesson";
import { MIN_CONTENT_LENGTH, lessonFormSchema, type LessonFormValues } from "../_schemas/lesson-form";

/** Limites mostrados no contador (iguais aos do schema). */
const LIMITS = { title: 80, description: 140 } as const;
const outlineButtonClass = brandButtonVariants({ variant: "secondary", size: "sm" });

type LessonEditorProps = {
  courseId: string;
  lesson: DraftLesson;
  lessonNumber: number;
  totalLessons: number;
};

/** Contador "24 / 80" em mono; fica em destaque perto do limite. */
function CharCount({ value, max }: { value: string; max: number }) {
  const length = value.trim().length;
  return (
    <span
      aria-hidden
      className={cn(
        "font-mono text-[11px] tabular-nums transition-colors",
        length > max ? "text-destructive" : length > max * 0.85 ? "text-texto" : "text-texto-secundario",
      )}
    >
      {length} / {max}
    </span>
  );
}

/**
 * Coluna central: edição da aula aberta. React Hook Form + Zod; o envio vai
 * para a Server Action `saveLesson`. Mostra contadores, avisa quando há
 * alterações não salvas e salva com ⌘S / Ctrl+S. O resultado vem num aviso
 * (toast) e, para leitores de tela, na linha de status do rodapé. Use
 * `key={lesson.id}` para reiniciar o formulário ao trocar de aula.
 */
export function LessonEditor({ courseId, lesson, lessonNumber, totalLessons }: LessonEditorProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(lesson.content.length > 0);
  const [videoName, setVideoName] = useState<string | null>(lesson.hasVideo ? "video-da-aula.mp4" : null);

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
  const [title, description, content] = useWatch({ control: form.control, name: ["title", "description", "content"] });
  const isDirty = form.formState.isDirty;

  // ⌘S / Ctrl+S salva a aula sem sair do campo.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoName(file.name);
    form.setValue("hasVideo", true, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
  }

  function handleRemoveVideo() {
    setVideoName(null);
    form.setValue("hasVideo", false, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
  }

  function handleSubmit(values: LessonFormValues) {
    setStatusMessage(null);
    startTransition(async () => {
      const response = await saveLesson(values);
      setStatusMessage(response.message ?? null);

      if (response.success) {
        form.reset(values);
        toast({ title: "Aula salva", description: response.message, tone: "sucesso" });
        return;
      }

      toast({ title: "Não foi possível salvar", description: response.message, tone: "erro" });
      for (const [field, messages] of Object.entries(response.errors ?? {})) {
        if (field in values && messages?.[0]) {
          form.setError(field as keyof LessonFormValues, { message: messages[0] });
        }
      }
    });
  }

  function handleInvalid() {
    toast({ title: "Revise os campos destacados", tone: "erro" });
  }

  return (
    <form
      ref={formRef}
      onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
      aria-labelledby="aula-titulo"
      className="flex flex-col gap-7"
      noValidate
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="aula-titulo" className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase">
          Aula
          <span className="font-mono font-normal text-texto-secundario tabular-nums">
            {formatTwoDigits(lessonNumber)} / {formatTwoDigits(totalLessons)}
          </span>
        </h2>
        <span
          className={cn(
            "flex items-center gap-1.5 font-mono text-[11px] transition-colors",
            isDirty ? "text-texto" : "text-texto-secundario",
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", isDirty ? "bg-pratica" : "bg-acao")} />
          {isDirty ? "Alterações não salvas" : "Salvo no rascunho"}
        </span>
      </div>

      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="aula-titulo-campo">Título da aula</FieldLabel>
              <CharCount value={title} max={LIMITS.title} />
            </div>
            <Input
              {...field}
              id="aula-titulo-campo"
              aria-invalid={fieldState.invalid}
              placeholder="Ex.: Descrevendo componentes para a IA"
              className="h-12 font-display text-lg font-medium tracking-[-0.02em]"
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
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor="aula-descricao">Descrição</FieldLabel>
              <CharCount value={description} max={LIMITS.description} />
            </div>
            <Input
              {...field}
              id="aula-descricao"
              aria-invalid={fieldState.invalid}
              placeholder="O que a pessoa aprende nesta aula, em uma frase."
            />
            <FieldDescription>Aparece embaixo do título na lista de aulas.</FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-baseline justify-between gap-3">
              <FieldLabel htmlFor={isWriting ? "aula-conteudo" : undefined}>Conteúdo da aula</FieldLabel>
              {isWriting && !videoName ? (
                <span className="font-mono text-[11px] text-texto-secundario tabular-nums">
                  {Math.min(content.trim().length, MIN_CONTENT_LENGTH)} / {MIN_CONTENT_LENGTH} mín.
                </span>
              ) : null}
            </div>

            <div
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-3 transition-colors",
                fieldState.invalid ? "border-destructive" : "border-linha",
              )}
            >
              {videoName ? (
                <div className="flex items-center gap-3 rounded-lg bg-superficie py-1 pr-1 pl-3">
                  <Video aria-hidden className="size-4 shrink-0 text-texto-secundario" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[13px]">{videoName}</span>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    aria-label="Remover vídeo"
                    className="flex size-11 items-center justify-center rounded-full text-texto-secundario outline-none transition-colors hover:bg-superficie-forte hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
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
                  className="min-h-48 border-0 px-1 hover:border-0 focus-visible:ring-0"
                />
              ) : null}

              {!isWriting && !videoName ? (
                <p className="px-1 py-6 text-center text-sm text-texto-secundario">
                  Envie um vídeo ou escreva o conteúdo da aula.
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 border-t border-linha pt-3">
                {videoName ? null : (
                  <label
                    className={cn(
                      outlineButtonClass,
                      "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-texto",
                    )}
                  >
                    <Video aria-hidden strokeWidth={1.75} />
                    Enviar vídeo
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="sr-only" />
                  </label>
                )}
                {isWriting ? null : (
                  <ColorBurstButton type="button" onClick={() => setIsWriting(true)} variant="secondary" size="sm">
                    <FileText aria-hidden strokeWidth={1.75} />
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
        <ul className="flex flex-col border-y border-linha">
          {lesson.materials.map((material) => (
            <li key={material.id} className="flex min-h-11 items-center gap-3 border-b border-linha text-sm last:border-b-0">
              {material.kind === "arquivo" ? (
                <Paperclip aria-hidden className="size-4 text-texto-secundario" strokeWidth={1.75} />
              ) : (
                <Link2 aria-hidden className="size-4 text-texto-secundario" strokeWidth={1.75} />
              )}
              <span className="flex-1">{material.label}</span>
              <span className="font-mono text-[11px] text-texto-secundario uppercase">{material.kind}</span>
            </li>
          ))}
          <li className="flex min-h-11 items-center gap-3 text-sm text-desativado">
            <Plus aria-hidden className="size-4" strokeWidth={1.75} />
            Adicionar material
            <span className="ml-auto font-mono text-[11px] uppercase">em breve</span>
          </li>
        </ul>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-col-reverse items-stretch gap-3 border-t border-linha bg-fundo/90 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-end lg:mx-0 lg:px-0">
        <p role="status" className="text-sm text-texto-secundario sm:mr-auto">
          {statusMessage ?? (
            <span className="hidden items-center gap-2 lg:flex">
              Salvar com <ShortcutKeys shortcut={{ keys: ["mod", "S"] }} />
            </span>
          )}
        </p>
        <ColorBurstButton type="submit" disabled={isPending} variant={isDirty ? "primary" : "secondary"}>
          {isPending ? "Salvando…" : "Salvar aula"}
        </ColorBurstButton>
      </div>
    </form>
  );
}
