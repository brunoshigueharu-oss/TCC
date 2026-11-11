"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useDeferredValue, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import type { PostTeaser } from "@/lib/data/comunidade";
import { cn } from "@/lib/utils";
import { createPost } from "../_actions/create-post";
import {
  BODY_MIN_LENGTH,
  isPostTagSlug,
  MAX_POST_TAGS,
  postSchema,
  TITLE_MAX_LENGTH,
  type PostInput,
} from "../_actions/post-schema";
import { findSimilarPosts } from "../_lib/find-similar";
import { PostPreview } from "./post-preview";
import { SimilarPosts } from "./similar-posts";

type TagOption = { slug: string; label: string };
type LessonOption = { id: string; label: string };
type EditorMode = "escrever" | "previa";

type NewPostFormProps = {
  tagOptions: TagOption[];
  lessonOptions: LessonOption[];
  teasers: PostTeaser[];
};

/** Nome de quem escreve no protótipo (pessoa logada). */
const AUTHOR_NAME = "Marina Alves";

const typeOptions = [
  { value: "pergunta", label: "Pergunta", hint: "Você travou e quer uma resposta." },
  { value: "discussao", label: "Discussão", hint: "Você quer trocar experiências." },
] as const;

const modeOptions: { id: EditorMode; label: string }[] = [
  { id: "escrever", label: "Escrever" },
  { id: "previa", label: "Prévia" },
];

const fieldKeys = ["title", "type", "tags", "body", "prompt", "lessonId"] as const;

const sectionLabelClass = "text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase";

/**
 * Editor de novo post: título grande sem caixa, texto corrido, prompt
 * opcional em bloco mono, tags e lição. Aba "Prévia" mostra o post como a
 * turma vai ver; "dúvidas parecidas" aparecem enquanto o título é escrito.
 */
export function NewPostForm({ tagOptions, lessonOptions, teasers }: NewPostFormProps) {
  const [mode, setMode] = useState<EditorMode>("escrever");
  const [hasPrompt, setHasPrompt] = useState(false);
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    mode: "onTouched",
    defaultValues: { title: "", type: "pergunta", tags: [], body: "", prompt: "", lessonId: "" },
  });

  const values = useWatch({ control: form.control });
  const title = values.title ?? "";
  const body = values.body ?? "";
  const tags = values.tags ?? [];
  const deferredTitle = useDeferredValue(title);
  const similar = findSimilarPosts(deferredTitle, tags, teasers);

  async function handlePublish(input: PostInput) {
    // Em caso de sucesso a action redireciona para o feed.
    const result = await createPost(input);
    for (const key of fieldKeys) {
      const message = result.errors?.[key]?.[0];
      if (message) form.setError(key, { message });
    }
    if (!result.success && result.message) form.setError("root", { message: result.message });
  }

  /** Com erro, volta para a aba de escrita e foca o primeiro campo inválido. */
  function handleInvalid() {
    setMode("escrever");
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <MotionConfig reducedMotion="user">
      <form
        onSubmit={form.handleSubmit(handlePublish, handleInvalid)}
        noValidate
        aria-label="Novo post"
        className="flex flex-1 flex-col"
      >
        <main className="flex flex-1 flex-col gap-8 px-4 pt-6 pb-10 lg:px-10 lg:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-linha">
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <fieldset className="flex gap-1">
                  <legend className="sr-only">Tipo do post</legend>
                  {typeOptions.map((option, index) => (
                    <label
                      key={option.value}
                      title={option.hint}
                      className="relative flex h-11 cursor-pointer items-center px-3 text-sm font-semibold text-texto-secundario transition-colors first:pl-0 hover:text-texto has-checked:text-texto has-focus-visible:underline has-focus-visible:underline-offset-4"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                      {field.value === option.value ? (
                        <motion.span
                          layoutId="tipo-do-post"
                          aria-hidden
                          className={cn("absolute right-3 bottom-0 h-0.5 bg-texto", index === 0 ? "left-0" : "left-3")}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ) : null}
                    </label>
                  ))}
                </fieldset>
              )}
            />

            <div role="tablist" aria-label="Modo do editor" className="flex rounded-full bg-superficie p-1">
              {modeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  id={`aba-${option.id}`}
                  aria-selected={mode === option.id}
                  aria-controls={`painel-${option.id}`}
                  onClick={() => setMode(option.id)}
                  className={cn(
                    "relative h-8 rounded-full px-3.5 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto",
                    mode === option.id ? "text-texto" : "text-texto-secundario hover:text-texto",
                  )}
                >
                  {mode === option.id ? (
                    <motion.span
                      layoutId="modo-editor"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-fundo ring-1 ring-linha"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null}
                  <span className="relative">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            role="tabpanel"
            id="painel-previa"
            aria-labelledby="aba-previa"
            hidden={mode !== "previa"}
          >
            <PostPreview
              type={values.type ?? "pergunta"}
              title={title}
              body={body}
              prompt={hasPrompt ? (values.prompt ?? "") : ""}
              tags={tags}
              authorName={AUTHOR_NAME}
            />
          </div>

          <div
            role="tabpanel"
            id="painel-escrever"
            aria-labelledby="aba-escrever"
            hidden={mode !== "escrever"}
            className="flex flex-col gap-8"
          >
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid} className="group/title flex flex-col gap-2">
                  <label htmlFor="titulo" className={sectionLabelClass}>
                    Título
                  </label>
                  <textarea
                    {...field}
                    id="titulo"
                    rows={1}
                    maxLength={TITLE_MAX_LENGTH + 20}
                    placeholder="Qual é a sua dúvida, numa frase?"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="titulo-contador"
                    onKeyDown={(event) => {
                      // Título é uma linha só: Enter pula para o texto.
                      if (event.key === "Enter") {
                        event.preventDefault();
                        form.setFocus("body");
                      }
                    }}
                    className="field-sizing-content resize-none bg-transparent font-display text-[28px] leading-[1.08] font-medium tracking-[-0.035em] outline-none placeholder:text-desativado lg:text-[40px]"
                  />
                  <div className="flex items-start justify-between gap-4 border-t border-linha pt-2 transition-colors group-focus-within/title:border-texto group-data-[invalid=true]/title:border-destructive">
                    <FieldError errors={[fieldState.error]} className="text-[13px]" />
                    <span
                      id="titulo-contador"
                      className={cn(
                        "ml-auto shrink-0 font-mono text-[11px] tabular-nums",
                        title.length > TITLE_MAX_LENGTH ? "text-destructive" : "text-texto-secundario",
                      )}
                    >
                      {title.length}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>
                </div>
              )}
            />

            <SimilarPosts posts={similar} />

            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid} className="flex flex-col gap-2">
                  <label htmlFor="texto" className={sectionLabelClass}>
                    Contexto
                  </label>
                  <textarea
                    {...field}
                    id="texto"
                    placeholder="O que você tentou, o que esperava e o que aconteceu. Quanto mais concreto, melhor a resposta."
                    aria-invalid={fieldState.invalid}
                    aria-describedby="texto-ajuda"
                    className="field-sizing-content min-h-36 resize-none bg-transparent text-[17px] leading-[1.65] outline-none placeholder:text-desativado"
                  />
                  <div className="flex items-start justify-between gap-4 border-t border-linha pt-2">
                    <FieldError errors={[fieldState.error]} className="text-[13px]" />
                    <span id="texto-ajuda" className="ml-auto shrink-0 font-mono text-[11px] text-texto-secundario tabular-nums">
                      {body.trim().length < BODY_MIN_LENGTH
                        ? `mínimo ${BODY_MIN_LENGTH} · ${body.trim().length}`
                        : `${body.trim().length} caracteres`}
                    </span>
                  </div>
                </div>
              )}
            />

            {hasPrompt ? (
              <Controller
                name="prompt"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div data-invalid={fieldState.invalid} className="flex flex-col gap-2">
                    <div className="overflow-hidden rounded-xl border border-linha bg-superficie focus-within:ring-2 focus-within:ring-texto">
                      <div className="flex h-10 items-center justify-between border-b border-linha pr-1 pl-4">
                        <label
                          htmlFor="prompt"
                          className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-texto-secundario uppercase"
                        >
                          <span aria-hidden className="size-1.5 rounded-[1px] bg-acao" />
                          Prompt que você usou
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            form.setValue("prompt", "");
                            setHasPrompt(false);
                          }}
                          aria-label="Remover o bloco de prompt"
                          className="flex size-8 items-center justify-center rounded-lg text-texto-secundario outline-none hover:bg-superficie-forte hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
                        >
                          <X aria-hidden className="size-4" strokeWidth={1.75} />
                        </button>
                      </div>
                      <textarea
                        {...field}
                        id="prompt"
                        autoFocus
                        spellCheck={false}
                        placeholder="Cole aqui o pedido que você fez à IA."
                        aria-invalid={fieldState.invalid}
                        className="field-sizing-content min-h-28 w-full resize-none bg-transparent px-4 py-3.5 font-mono text-[13px] leading-[1.7] outline-none placeholder:text-desativado"
                      />
                    </div>
                    <FieldError errors={[fieldState.error]} className="text-[13px]" />
                  </div>
                )}
              />
            ) : (
              <button
                type="button"
                onClick={() => setHasPrompt(true)}
                className="flex h-11 w-fit items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-linha outline-none transition-colors hover:bg-superficie hover:ring-texto focus-visible:ring-2 focus-visible:ring-texto"
              >
                <Plus aria-hidden className="size-4" strokeWidth={2} />
                Adicionar o prompt que você usou
              </button>
            )}

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid} className="gap-3">
                  <FieldLegend variant="label" className={cn(sectionLabelClass, "mb-0 flex w-full justify-between data-[variant=label]:text-[11px]")}>
                    Tags
                    <span className="font-mono font-normal tracking-normal normal-case tabular-nums">
                      {field.value.length}/{MAX_POST_TAGS}
                    </span>
                  </FieldLegend>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => {
                      const isChecked = field.value.some((slug) => slug === tag.slug);
                      const isBlocked = !isChecked && field.value.length >= MAX_POST_TAGS;
                      return (
                        <label
                          key={tag.slug}
                          className={cn(
                            "flex h-9 cursor-pointer items-center rounded-full px-3.5 font-mono text-[13px] transition-[background-color,color,box-shadow] duration-200 has-focus-visible:ring-2 has-focus-visible:ring-texto has-focus-visible:ring-offset-2",
                            isChecked ? "bg-texto text-fundo" : "text-texto ring-1 ring-linha hover:ring-texto",
                            isBlocked && "cursor-not-allowed opacity-40 hover:ring-linha",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isBlocked}
                            onChange={(event) => {
                              if (!isPostTagSlug(tag.slug)) return;
                              const next = event.target.checked
                                ? [...field.value, tag.slug]
                                : field.value.filter((slug) => slug !== tag.slug);
                              field.onChange(next);
                              field.onBlur();
                            }}
                            className="sr-only"
                          />
                          #{tag.slug}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError errors={[fieldState.error]} className="text-[13px]" />
                </FieldSet>
              )}
            />

            <Controller
              name="lessonId"
              control={form.control}
              render={({ field, fieldState }) => (
                <div data-invalid={fieldState.invalid} className="flex flex-col gap-2">
                  <label htmlFor="licao" className={sectionLabelClass}>
                    Lição relacionada · opcional
                  </label>
                  <select
                    {...field}
                    id="licao"
                    aria-invalid={fieldState.invalid}
                    aria-describedby="licao-ajuda"
                    className="h-11 w-full rounded-xl border border-linha bg-fundo px-3 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-texto"
                  >
                    <option value="">Nenhuma</option>
                    {lessonOptions.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.label}
                      </option>
                    ))}
                  </select>
                  <p id="licao-ajuda" className="text-[13px] text-texto-secundario">
                    Ligado a uma lição, o post também aparece no fio de dúvidas da aula.
                  </p>
                  <FieldError errors={[fieldState.error]} className="text-[13px]" />
                </div>
              )}
            />
          </div>

          {form.formState.errors.root?.message ? (
            <p role="alert" className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          ) : null}
        </main>

        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-linha bg-fundo/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md lg:px-10 lg:pb-4">
          <p className="hidden font-mono text-[11px] text-texto-secundario sm:block">
            Publicado como {AUTHOR_NAME}
          </p>
          <ColorBurstButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:min-w-44">
            {isSubmitting ? "Publicando…" : "Publicar"}
          </ColorBurstButton>
        </div>
      </form>
    </MotionConfig>
  );
}
