import { z } from "zod";

/**
 * Dados FICTÍCIOS da trilha para o protótipo. Na versão real vêm do módulo
 * "Trilha e lições" da API, com o progresso da pessoa logada.
 */

const lessonStatusSchema = z.enum(["concluida", "em-andamento", "bloqueada"]);

const lessonStepSchema = z.object({
  body: z.string(),
  promptExample: z.string().optional(),
});

const lessonQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  answers: z.number().int().nonnegative(),
});

const lessonSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  status: lessonStatusSchema,
  minutes: z.number().int().positive(),
  xpReward: z.number().int().positive(),
  steps: z.array(lessonStepSchema).min(1),
  questionsCount: z.number().int().nonnegative(),
  questions: z.array(lessonQuestionSchema),
});

const quickQuestionSchema = z.object({
  text: z.string(),
  kind: z.enum(["Múltipla escolha", "Resposta curta"]),
});

const moduleSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  lessons: z.array(lessonSchema).min(1),
  checkpoint: z.object({
    status: z.enum(["liberado", "bloqueado", "concluido"]),
    learned: z.array(z.string()).min(1),
    quickQuestions: z.array(quickQuestionSchema).min(1),
  }),
});

const trackSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  modules: z.array(moduleSchema).min(1),
});

export type LessonStatus = z.infer<typeof lessonStatusSchema>;
export type LessonStep = z.infer<typeof lessonStepSchema>;
export type LessonQuestion = z.infer<typeof lessonQuestionSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type TrackModule = z.infer<typeof moduleSchema>;
export type Track = z.infer<typeof trackSchema>;

const emptySteps = [{ body: "Conteúdo da lição em produção." }];

export const track: Track = trackSchema.parse({
  title: "Trilha",
  subtitle: "Fundamentos de IA de código",
  modules: [
    {
      id: "m1",
      number: 1,
      title: "Prompts para interfaces",
      lessons: [
        {
          id: "m1-l1",
          number: 1,
          title: "O que é IA de código",
          status: "concluida",
          minutes: 8,
          xpReward: 20,
          steps: emptySteps,
          questionsCount: 0,
          questions: [],
        },
        {
          id: "m1-l2",
          number: 2,
          title: "O primeiro prompt",
          status: "concluida",
          minutes: 10,
          xpReward: 20,
          steps: emptySteps,
          questionsCount: 0,
          questions: [],
        },
        {
          id: "m1-l3",
          number: 3,
          title: "Ajustando o resultado",
          status: "em-andamento",
          minutes: 12,
          xpReward: 20,
          steps: [
            {
              body: "A primeira versão que a IA entrega quase nunca é a final. O seu trabalho é dirigir os ajustes, como faria numa revisão de layout.",
            },
            {
              body: "Quando a IA gera uma tela, revise o resultado como revisaria o trabalho de um colega: diga o que manter e o que mudar, com valores concretos.",
              promptExample:
                "Mantenha o layout. Aumente o botão para 48 px de altura e use texto de 15 px.",
            },
            {
              body: "Peça uma mudança de cada vez. Se pedir cinco coisas juntas, fica difícil saber qual delas quebrou o resultado.",
              promptExample: "Só troque a cor do botão para o verde-água. Não mexa no resto.",
            },
            {
              body: "Quando o resultado ficar bom, peça para a IA explicar o que mudou. Assim você aprende o código junto com o design.",
              promptExample: "Explique em três frases o que você alterou no código.",
            },
          ],
          questionsCount: 12,
          questions: [
            { id: "grid-layout", title: "Como faço a IA respeitar meu grid?", author: "Marina", answers: 3 },
            {
              id: "prompt-mobile",
              title: "O prompt de exemplo funciona no mobile também?",
              author: "Rafael",
              answers: 1,
            },
          ],
        },
        {
          id: "m1-l4",
          number: 4,
          title: "Componentes com IA",
          status: "bloqueada",
          minutes: 12,
          xpReward: 20,
          steps: emptySteps,
          questionsCount: 0,
          questions: [],
        },
        {
          id: "m1-l5",
          number: 5,
          title: "Estados e variações",
          status: "bloqueada",
          minutes: 10,
          xpReward: 20,
          steps: emptySteps,
          questionsCount: 0,
          questions: [],
        },
        {
          id: "m1-l6",
          number: 6,
          title: "Do protótipo ao projeto",
          status: "bloqueada",
          minutes: 14,
          xpReward: 20,
          steps: emptySteps,
          questionsCount: 0,
          questions: [],
        },
      ],
      checkpoint: {
        status: "bloqueado",
        learned: [
          "Escrever prompts com objetivo e restrições",
          "Revisar o resultado com valores concretos",
          "Pedir ajustes sem refazer a tela inteira",
        ],
        quickQuestions: [
          { text: "O que deixa um prompt de interface mais preciso?", kind: "Múltipla escolha" },
          { text: "Qual destes pedidos de ajuste é mais claro?", kind: "Múltipla escolha" },
          { text: "Reescreva um prompt vago em uma frase.", kind: "Resposta curta" },
        ],
      },
    },
  ],
});

/** Lição em andamento, para o cartão "Continuar de onde parou". */
export function findCurrentLesson(source: Track) {
  for (const trackModule of source.modules) {
    const lesson = trackModule.lessons.find((item) => item.status === "em-andamento");
    if (lesson) return { trackModule, lesson };
  }
  return null;
}

export function findLesson(source: Track, lessonId: string) {
  for (const trackModule of source.modules) {
    const lesson = trackModule.lessons.find((item) => item.id === lessonId);
    if (lesson) return { trackModule, lesson };
  }
  return null;
}

export function findModule(source: Track, moduleId: string) {
  return source.modules.find((item) => item.id === moduleId) ?? null;
}

export function getModuleProgress(trackModule: TrackModule) {
  const completed = trackModule.lessons.filter((lesson) => lesson.status === "concluida");
  return {
    completed: completed.length,
    total: trackModule.lessons.length,
    xpEarned: completed.reduce((sum, lesson) => sum + lesson.xpReward, 0),
    xpTotal: trackModule.lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0),
  };
}
