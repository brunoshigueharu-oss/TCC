import { z } from "zod";

/**
 * Dados FICTÍCIOS da trilha para o protótipo. Na versão real vêm do módulo
 * "Trilha e lições" da API, com o progresso da pessoa logada.
 */

const lessonStatusSchema = z.enum(["concluida", "em-andamento", "bloqueada"]);

/**
 * Tipos de etapa de uma lição:
 * - `leitura`: texto, com exemplo de prompt e/ou bloco de código opcionais;
 * - `comparacao`: "antes e depois" de um prompt, com divisória arrastável;
 * - `pergunta`: múltipla escolha com retorno por alternativa;
 * - `playground`: a pessoa monta o prompt e vê o resultado simulado.
 */
const lessonStepKindSchema = z.enum(["leitura", "comparacao", "pergunta", "playground"]);

const stepQuestionSchema = z
  .object({
    prompt: z.string(),
    options: z
      .array(z.object({ text: z.string(), feedback: z.string() }))
      .min(2)
      .max(4),
    correctIndex: z.number().int().nonnegative(),
  })
  .refine((question) => question.correctIndex < question.options.length, {
    message: "correctIndex precisa apontar para uma alternativa existente.",
  });

const lessonStepSchema = z
  .object({
    kind: lessonStepKindSchema.default("leitura"),
    /** Título curto da etapa, mostrado acima do texto. */
    title: z.string().optional(),
    body: z.string(),
    promptExample: z.string().optional(),
    code: z.object({ label: z.string(), content: z.string() }).optional(),
    question: stepQuestionSchema.optional(),
  })
  .refine((step) => step.kind !== "pergunta" || step.question !== undefined, {
    message: "Etapa do tipo pergunta precisa do campo question.",
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
  /** Uma frase sobre o que a lição ensina, usada no mapa da trilha. */
  summary: z.string(),
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

/** Módulo que ainda não abriu: só o suficiente para o índice da trilha. */
const upcomingModuleSchema = z.object({
  number: z.number().int().positive(),
  title: z.string(),
  lessonsCount: z.number().int().positive(),
});

const glossaryEntrySchema = z.object({
  id: z.string(),
  term: z.string(),
  /** Grafias que disparam o termo no texto da lição (sem diferenciar maiúsculas). */
  matches: z.array(z.string()).min(1),
  definition: z.string(),
});

const trackSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  modules: z.array(moduleSchema).min(1),
  upcomingModules: z.array(upcomingModuleSchema),
});

export type LessonStatus = z.infer<typeof lessonStatusSchema>;
export type LessonStepKind = z.infer<typeof lessonStepKindSchema>;
export type StepQuestion = z.infer<typeof stepQuestionSchema>;
export type GlossaryEntry = z.infer<typeof glossaryEntrySchema>;
export type UpcomingModule = z.infer<typeof upcomingModuleSchema>;
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
          summary: "O que muda no seu trabalho quando a IA escreve o código.",
          status: "concluida",
          minutes: 8,
          xpReward: 20,
          steps: [
            {
              title: "Um assistente que escreve código",
              body: "IA de código é um assistente que escreve e altera código a partir de pedidos em linguagem natural. Você descreve a interface; ela devolve os arquivos que formam a tela.",
            },
            {
              title: "Muda a ferramenta, não o ofício",
              body: "Para quem desenha, hierarquia, espaçamento e estados continuam sendo decisões suas. A IA executa; você dirige. Por isso um bom prompt se parece mais com um briefing do que com um comando.",
            },
            {
              kind: "pergunta",
              title: "Confira",
              body: "Uma pergunta rápida antes de seguir.",
              question: {
                prompt: "Ao trabalhar com IA de código, qual é o papel de quem desenha?",
                options: [
                  {
                    text: "Aceitar a primeira versão que a IA entrega",
                    feedback: "A primeira versão é um ponto de partida. Cabe a você revisar e pedir os ajustes.",
                  },
                  {
                    text: "Decidir o que a tela precisa e dirigir os ajustes",
                    feedback: "As decisões de design continuam com você; a IA escreve o código que as executa.",
                  },
                  {
                    text: "Escrever todo o código à mão e usar a IA só para revisar",
                    feedback: "Pode ser um uso, mas não é o ponto: a IA escreve, e você orienta o que ela escreve.",
                  },
                ],
                correctIndex: 1,
              },
            },
          ],
          questionsCount: 0,
          questions: [],
        },
        {
          id: "m1-l2",
          number: 2,
          title: "O primeiro prompt",
          summary: "Objetivo, conteúdo e restrições: a anatomia de um bom pedido.",
          status: "concluida",
          minutes: 10,
          xpReward: 20,
          steps: [
            {
              title: "Um pedido por escrito",
              body: "Um prompt é um pedido por escrito. Quanto mais ele se parece com um bom briefing, melhor o resultado: diga o objetivo, o conteúdo e as restrições.",
              promptExample:
                "Crie um card de curso com título, autor, duração e um botão “Começar”. Largura máxima de 390 px.",
            },
            {
              title: "O que você não diz, a IA inventa",
              body: "Tudo o que fica fora do prompt vira palpite: o texto de exemplo, as cores, o tamanho do botão. Restrições explícitas trocam palpites por decisões.",
            },
            {
              kind: "pergunta",
              title: "Confira",
              body: "Uma pergunta rápida antes de seguir.",
              question: {
                prompt: "O que deixa um prompt de interface mais preciso?",
                options: [
                  {
                    text: "Adjetivos como “bonito” e “moderno”",
                    feedback: "Adjetivos não dizem o que fazer. Cada pessoa (e cada IA) entende “bonito” de um jeito.",
                  },
                  {
                    text: "Um texto longo, com o máximo de palavras possível",
                    feedback: "Tamanho não é precisão. Um prompt curto com valores concretos funciona melhor.",
                  },
                  {
                    text: "Objetivo, conteúdo e restrições com valores concretos",
                    feedback: "Com objetivo, conteúdo e medidas, sobra pouco para a IA adivinhar.",
                  },
                ],
                correctIndex: 2,
              },
            },
          ],
          questionsCount: 0,
          questions: [],
        },
        {
          id: "m1-l3",
          number: 3,
          title: "Ajustando o resultado",
          summary: "Como dirigir os ajustes depois da primeira versão, com valores concretos e um pedido de cada vez.",
          status: "em-andamento",
          minutes: 12,
          xpReward: 20,
          steps: [
            {
              title: "A primeira versão é um rascunho",
              body: "A primeira versão que a IA entrega quase nunca é a final. O seu trabalho é dirigir os ajustes, como faria numa revisão de layout: dizer o que manter, o que mudar e em quanto.",
            },
            {
              title: "Revise com valores concretos",
              body: "Quando a IA gera uma tela, revise o resultado como revisaria o trabalho de um colega. Em vez de “aumenta um pouco”, informe a medida. Em vez de “outra cor”, cite o token do projeto.",
              promptExample:
                "Mantenha o layout. Aumente o botão para 48 px de altura e use texto de 15 px.",
            },
            {
              kind: "comparacao",
              title: "Antes e depois",
              body: "O mesmo pedido, escrito de dois jeitos. Arraste a divisória para comparar o que a IA entrega em cada caso.",
            },
            {
              kind: "pergunta",
              title: "Confira",
              body: "Você recebeu um card quase certo: só o título ficou pequeno.",
              question: {
                prompt: "Qual destes pedidos de ajuste é o mais claro?",
                options: [
                  {
                    text: "“Melhore o card.”",
                    feedback: "Sem dizer o que melhorar, a IA pode mexer justamente no que já estava bom.",
                  },
                  {
                    text: "“Mantenha o layout e aumente o título para 20 px.”",
                    feedback: "Diz o que preservar, o que mudar e em quanto. É um pedido que dá para conferir.",
                  },
                  {
                    text: "“Refaça o card do zero, com mais destaque.”",
                    feedback: "Refazer do zero descarta o que já funcionava, e “mais destaque” continua vago.",
                  },
                  {
                    text: "“Aumente o título, troque a cor, arredonde os cantos e mude a fonte.”",
                    feedback: "São quatro mudanças de uma vez. Se algo quebrar, fica difícil saber qual delas foi.",
                  },
                ],
                correctIndex: 1,
              },
            },
            {
              kind: "playground",
              title: "Agora dirija você",
              body: "Ligue e desligue os trechos do prompt e troque os valores sublinhados. O resultado ao lado é simulado, mas reage como uma IA de código reagiria: o que você não especifica, ela adivinha.",
            },
            {
              title: "Peça a explicação",
              body: "Quando o resultado ficar bom, peça para a IA explicar o que mudou. Assim você aprende o código junto com o design e consegue revisar os próximos ajustes. Uma mudança de cada vez deixa essa leitura simples.",
              promptExample: "Explique em três frases o que você alterou no código.",
              code: {
                label: "O que mudou",
                content:
                  '<button className="h-12 rounded-xl bg-acao px-6 text-[15px] font-semibold">\n  Começar\n</button>',
              },
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
          summary: "Pedir peças reutilizáveis em vez de telas inteiras.",
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
          summary: "Hover, foco, erro e vazio: o que descrever para cada estado.",
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
          summary: "Levar o que a IA gerou para dentro de um projeto de verdade.",
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
  upcomingModules: [
    { number: 2, title: "Componentes e sistemas", lessonsCount: 5 },
    { number: 3, title: "Do layout ao código", lessonsCount: 6 },
    { number: 4, title: "Projeto guiado", lessonsCount: 4 },
  ],
});

/** Termos explicados ao passar o cursor (ou tocar) no texto das lições. */
export const glossary: GlossaryEntry[] = z.array(glossaryEntrySchema).parse([
  {
    id: "prompt",
    term: "Prompt",
    matches: ["prompt", "prompts"],
    definition: "O pedido que você escreve para a IA. Funciona como um briefing: objetivo, conteúdo e restrições.",
  },
  {
    id: "ia-de-codigo",
    term: "IA de código",
    matches: ["IA de código"],
    definition: "Assistente que escreve e altera código a partir de pedidos em linguagem natural.",
  },
  {
    id: "token",
    term: "Token de design",
    matches: ["token", "tokens"],
    definition: "Valor com nome (cor, espaço, tipografia) reutilizado em todo o projeto, como “verde-água” ou “raio 12”.",
  },
  {
    id: "restricao",
    term: "Restrição",
    matches: ["restrições", "restrição"],
    definition: "Limite explícito no pedido: largura máxima, altura do botão, o que não pode mudar.",
  },
  {
    id: "estado",
    term: "Estado",
    matches: ["estados"],
    definition: "Cada situação de um componente: padrão, hover, foco, erro, carregando, vazio.",
  },
  {
    id: "layout",
    term: "Layout",
    matches: ["layout"],
    definition: "A organização dos elementos na tela: grid, alinhamento e espaçamento.",
  },
  {
    id: "briefing",
    term: "Briefing",
    matches: ["briefing"],
    definition: "Documento curto que orienta um trabalho: para quem é, o que precisa ter e quais são os limites.",
  },
]);

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

/** Lição seguinte dentro do mesmo módulo (ou `null` na última). */
export function findNextLesson(trackModule: TrackModule, lessonId: string) {
  const index = trackModule.lessons.findIndex((lesson) => lesson.id === lessonId);
  return trackModule.lessons[index + 1] ?? null;
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
    minutesLeft: trackModule.lessons
      .filter((lesson) => lesson.status !== "concluida")
      .reduce((sum, lesson) => sum + lesson.minutes, 0),
  };
}
