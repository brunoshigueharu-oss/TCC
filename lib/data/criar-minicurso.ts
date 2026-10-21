import { z } from "zod";

/**
 * Rascunho FICTÍCIO de minicurso no editor web. Na versão real vem do módulo
 * Cursos da comunidade, com a autora da sessão.
 */

const materialSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["arquivo", "link"]),
});

const draftLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  minutes: z.number().int().positive(),
  hasVideo: z.boolean(),
  materials: z.array(materialSchema),
});

const courseDraftSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  status: z.enum(["rascunho", "publicado"]),
  lessons: z.array(draftLessonSchema).min(1),
});

export type DraftLesson = z.infer<typeof draftLessonSchema>;
export type CourseDraft = z.infer<typeof courseDraftSchema>;

/** Mínimo de aulas para publicar um minicurso. */
export const MIN_LESSONS_TO_PUBLISH = 3;

export const courseDraft: CourseDraft = courseDraftSchema.parse({
  id: "prompts-prototipos-acessiveis",
  title: "Prompts para protótipos acessíveis",
  summary: "Como pedir à IA de código interfaces que já nascem acessíveis, e como revisar o resultado.",
  author: "Marina Alves",
  tags: ["acessibilidade", "prompts"],
  status: "rascunho",
  lessons: [
    {
      id: "a1",
      title: "Por que acessibilidade no prompt",
      description: "Entender o custo de corrigir acessibilidade depois que o código existe.",
      content:
        "Quando a acessibilidade entra só na revisão, cada ajuste mexe em estrutura, cor e foco ao mesmo tempo. Nesta aula, comparamos dois prompts para a mesma tela.",
      minutes: 8,
      hasVideo: true,
      materials: [],
    },
    {
      id: "a2",
      title: "Descrevendo componentes para a IA",
      description: "",
      content: "",
      minutes: 12,
      hasVideo: false,
      materials: [
        { id: "m1", label: "checklist-acessibilidade.pdf", kind: "arquivo" },
        { id: "m2", label: "Repositório de exemplo", kind: "link" },
      ],
    },
    {
      id: "a3",
      title: "Revisando o código gerado",
      description: "O que olhar no código: rótulos, ordem de foco e contraste.",
      content:
        "Abra o código gerado e procure três coisas antes de qualquer ajuste visual: rótulos dos campos, ordem do foco pelo teclado e contraste do texto.",
      minutes: 10,
      hasVideo: true,
      materials: [],
    },
    {
      id: "a4",
      title: "Checklist antes de publicar",
      description: "Uma lista curta para conferir cada tela antes de entregar.",
      content:
        "Antes de publicar, passe pela lista: textos alternativos, foco visível, tamanho mínimo de toque e mensagens de erro claras.",
      minutes: 8,
      hasVideo: false,
      materials: [],
    },
  ],
});

/** Uma aula conta como pronta quando tem vídeo ou texto. */
export function isLessonReady(lesson: DraftLesson) {
  return lesson.hasVideo || lesson.content.trim().length > 0;
}

export type PublishCheck = { id: string; label: string; isDone: boolean };

/** Requisitos para publicar — mostrados no painel e conferidos na Server Action. */
export function getPublishChecklist(course: CourseDraft): PublishCheck[] {
  const pendingLessons = course.lessons
    .map((lesson, index) => ({ lesson, number: index + 1 }))
    .filter(({ lesson }) => !isLessonReady(lesson))
    .map(({ number }) => number);

  return [
    {
      id: "titulo",
      label: "Título e resumo do curso",
      isDone: course.title.trim().length > 0 && course.summary.trim().length > 0,
    },
    {
      id: "aulas",
      label: `Pelo menos ${MIN_LESSONS_TO_PUBLISH} aulas`,
      isDone: course.lessons.length >= MIN_LESSONS_TO_PUBLISH,
    },
    {
      id: "conteudo",
      label:
        pendingLessons.length === 0
          ? "Todas as aulas com conteúdo"
          : `Conteúdo pendente: aula ${pendingLessons.join(", ")}`,
      isDone: pendingLessons.length === 0,
    },
  ];
}
