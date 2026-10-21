"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { SurfaceCard } from "@/components/surface-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createPost } from "../_actions/create-post";
import {
  isPostTagSlug,
  MAX_POST_TAGS,
  postSchema,
  type PostInput,
} from "../_actions/post-schema";

type TagOption = { slug: string; label: string };
type LessonOption = { id: string; label: string };

type NewPostFormProps = {
  tagOptions: TagOption[];
  lessonOptions: LessonOption[];
};

const typeOptions = [
  {
    value: "pergunta",
    label: "Pergunta",
    description: "Você tem uma dúvida e quer uma resposta.",
  },
  {
    value: "discussao",
    label: "Discussão",
    description: "Você quer trocar experiências com a turma.",
  },
] as const;

const fieldKeys = ["title", "type", "tags", "body", "lessonId"] as const;

const inputClass = "rounded-xl border-linha bg-fundo px-3 text-[15px]";

/** Formulário de novo post: tipo, título, tags, texto e lição opcional. */
export function NewPostForm({ tagOptions, lessonOptions }: NewPostFormProps) {
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", type: "pergunta", tags: [], body: "", lessonId: "" },
  });

  async function handlePublish(values: PostInput) {
    // Em caso de sucesso a action redireciona para o feed.
    const result = await createPost(values);
    for (const key of fieldKeys) {
      const message = result.errors?.[key]?.[0];
      if (message) form.setError(key, { message });
    }
    if (!result.success && result.message) form.setError("root", { message: result.message });
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(handlePublish)}
      noValidate
      className="flex flex-1 flex-col"
    >
      <main className="flex flex-1 flex-col gap-5 pt-5 pb-8">
        <SurfaceCard className="p-4">
          <FieldGroup>
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend variant="label" className="font-semibold">
                    Tipo
                  </FieldLegend>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    className="grid-cols-2"
                  >
                    {typeOptions.map((option) => (
                      <FieldLabel
                        key={option.value}
                        htmlFor={`tipo-${option.value}`}
                        className="w-full rounded-xl ring-1 ring-linha has-data-checked:bg-comunidade/15 has-data-checked:ring-2 has-data-checked:ring-comunidade"
                      >
                        <Field orientation="horizontal" className="items-start gap-2.5 p-3">
                          <RadioGroupItem
                            value={option.value}
                            id={`tipo-${option.value}`}
                            className="mt-0.5 border-texto data-checked:border-texto data-checked:bg-texto"
                          />
                          <span className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold">{option.label}</span>
                            <span className="text-xs leading-snug font-normal text-texto-secundario">
                              {option.description}
                            </span>
                          </span>
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  <FieldError errors={[fieldState.error]} />
                </FieldSet>
              )}
            />

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="titulo" className="font-semibold">
                    Título
                  </FieldLabel>
                  <Input
                    {...field}
                    id="titulo"
                    placeholder="Ex.: Como peço à IA um botão acessível?"
                    aria-invalid={fieldState.invalid}
                    className={cn(inputClass, "h-11")}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend variant="label" className="font-semibold">
                    Tags
                  </FieldLegend>
                  <FieldDescription className="text-xs text-texto-secundario">
                    Escolha de 1 a {MAX_POST_TAGS}. Elas definem em quais feeds o post aparece.
                  </FieldDescription>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map((tag) => {
                      const isChecked = field.value.some((slug) => slug === tag.slug);
                      return (
                        <FieldLabel
                          key={tag.slug}
                          htmlFor={`tag-${tag.slug}`}
                          className={cn(
                            "relative h-9 items-center rounded-full px-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-comunidade",
                            isChecked ? "bg-texto text-fundo" : "bg-fundo ring-1 ring-linha",
                          )}
                        >
                          <Checkbox
                            id={`tag-${tag.slug}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (!isPostTagSlug(tag.slug)) return;
                              const next = checked
                                ? [...field.value, tag.slug]
                                : field.value.filter((slug) => slug !== tag.slug);
                              field.onChange(next);
                            }}
                            className="pointer-events-none absolute opacity-0"
                          />
                          #{tag.slug}
                        </FieldLabel>
                      );
                    })}
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </FieldSet>
              )}
            />

            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="texto" className="font-semibold">
                    Texto
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="texto"
                    placeholder="Descreva sua dúvida ou o que quer discutir. Se puder, cole o prompt que usou."
                    aria-invalid={fieldState.invalid}
                    className={cn(inputClass, "min-h-36 py-2.5")}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="lessonId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="licao" className="font-semibold">
                    Lição relacionada (opcional)
                  </FieldLabel>
                  <select
                    {...field}
                    id="licao"
                    aria-invalid={fieldState.invalid}
                    className={cn(inputClass, "h-11 w-full border outline-none focus-visible:ring-3 focus-visible:ring-ring/50")}
                  >
                    <option value="">Nenhuma</option>
                    {lessonOptions.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.label}
                      </option>
                    ))}
                  </select>
                  <FieldDescription className="text-xs text-texto-secundario">
                    Ligado a uma lição, o post aparece também no fio de dúvidas da aula.
                  </FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </SurfaceCard>

        {form.formState.errors.root?.message ? (
          <p role="alert" className="mx-4 text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        ) : null}
      </main>

      <div className="sticky bottom-0 z-10 border-t border-linha bg-fundo px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-acao text-[15px] font-semibold text-texto hover:bg-acao/90"
        >
          {isSubmitting ? "Publicando…" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
