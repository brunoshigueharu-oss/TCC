import { z } from "zod";

/**
 * Dados FICTÍCIOS da Home para o protótipo. Na versão real eles vêm da API
 * (módulos Identidade, Gamificação e Comunidades). A lição atual vem de
 * `lib/data/trilha.ts`.
 */

const openQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessonNumber: z.number().int().positive(),
  answers: z.number().int().nonnegative(),
  href: z.string(),
});

const homeSchema = z.object({
  user: z.object({
    firstName: z.string(),
    level: z.number().int().positive(),
    xp: z.number().int().nonnegative(),
  }),
  dailyGoal: z.object({
    done: z.number().int().nonnegative(),
    target: z.number().int().positive(),
  }),
  weeklyXp: z.object({
    xp: z.number().int().nonnegative(),
    friendsRank: z.number().int().positive(),
  }),
  openQuestions: z.array(openQuestionSchema),
});

export type OpenQuestion = z.infer<typeof openQuestionSchema>;
export type HomeData = z.infer<typeof homeSchema>;

export const homeData: HomeData = homeSchema.parse({
  user: { firstName: "Marina", level: 3, xp: 1240 },
  dailyGoal: { done: 2, target: 3 },
  weeklyXp: { xp: 320, friendsRank: 4 },
  openQuestions: [
    {
      id: "grid-layout",
      title: "Como faço a IA respeitar meu grid?",
      lessonNumber: 3,
      answers: 3,
      href: "/comunidade/posts/grid-layout",
    },
    {
      id: "estado-componente",
      title: "Por que o componente perdeu o estado ao trocar de tela?",
      lessonNumber: 2,
      answers: 0,
      href: "/comunidade/posts/estado-componente",
    },
  ],
});
