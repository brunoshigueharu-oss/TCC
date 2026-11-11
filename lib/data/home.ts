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
  /** Quem perguntou (primeiro nome). */
  author: z.string(),
  /** Tempo relativo, já escrito para exibição. */
  timeLabel: z.string(),
});

/** Limites da meta diária que a pessoa pode escolher na Home. */
export const DAILY_GOAL_MIN = 1;
export const DAILY_GOAL_MAX = 5;

export const dailyGoalInputSchema = z.object({
  target: z.number().int().min(DAILY_GOAL_MIN).max(DAILY_GOAL_MAX),
});
export type DailyGoalInput = z.infer<typeof dailyGoalInputSchema>;

const homeSchema = z.object({
  /** "Hoje" do protótipo — bate com a semana de `lib/data/perfil.ts` (sexta). */
  today: z.object({
    weekday: z.string(),
    dateLabel: z.string(),
  }),
  /** Minutos estudados na semana (lições + práticas). */
  studyMinutes: z.number().int().nonnegative(),
  /** Dúvidas da turma que a pessoa respondeu na semana. */
  answersGiven: z.number().int().nonnegative(),
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
  today: { weekday: "Sexta-feira", dateLabel: "13 nov 2026" },
  studyMinutes: 96,
  answersGiven: 2,
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
      author: "Marina",
      timeLabel: "há 18 min",
    },
    {
      id: "estado-componente",
      title: "Por que o componente perdeu o estado ao trocar de tela?",
      lessonNumber: 2,
      answers: 0,
      href: "/comunidade/posts/estado-componente",
      author: "Caio",
      timeLabel: "há 2 h",
    },
    {
      id: "prompt-mobile",
      title: "O prompt de exemplo funciona no mobile também?",
      lessonNumber: 3,
      answers: 1,
      href: "/comunidade/posts/prompt-mobile",
      author: "Rafael",
      timeLabel: "ontem",
    },
    {
      id: "ia-muda-arquivos",
      title: "A IA mexeu em arquivos que eu não pedi. Como evitar?",
      lessonNumber: 3,
      answers: 2,
      href: "/comunidade/posts/ia-muda-arquivos",
      author: "Júlia",
      timeLabel: "ontem",
    },
  ],
});
