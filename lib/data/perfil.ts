import { z } from "zod";

/**
 * Dados FICTÍCIOS e privados da pessoa logada (Meu perfil e Configurações).
 * Os dados públicos dela (nível, XP, selos) ficam em `lib/data/pessoas.ts`;
 * o progresso na trilha vem de `lib/data/trilha.ts`.
 */

const weekDaySchema = z.object({
  label: z.string(),
  xp: z.number().int().nonnegative(),
  /** Dia que ainda não chegou — aparece apagado no gráfico. */
  isFuture: z.boolean(),
});

/** Um dia no mapa de consistência. `xp` 0 = dia sem estudo. */
const activityDaySchema = z.object({
  /** Data ISO (aaaa-mm-dd). */
  date: z.string(),
  xp: z.number().int().nonnegative(),
  lessons: z.number().int().nonnegative(),
  isFuture: z.boolean(),
});

const milestoneSchema = z.object({
  id: z.string(),
  /** Data curta, já escrita para exibição (ex.: "02 nov"). */
  dateLabel: z.string(),
  kind: z.enum(["inicio", "nivel", "selo", "trilha", "comunidade"]),
  title: z.string(),
  detail: z.string(),
});

const profileSchema = z.object({
  /** Quando a pessoa entrou no hub, já escrito para exibição. */
  memberSince: z.string(),
  /** Maior sequência de dias seguidos já registrada. */
  longestStreakDays: z.number().int().nonnegative(),
  /** Últimas 26 semanas, de segunda a domingo; a última é a semana atual. */
  activity: z.array(z.array(activityDaySchema).length(7)).length(26),
  /** Conquistas em ordem do mais recente para o mais antigo. */
  milestones: z.array(milestoneSchema),
  email: z.email(),
  /** XP total em que começa o próximo nível. */
  nextLevelXp: z.number().int().positive(),
  streakDays: z.number().int().nonnegative(),
  week: z.array(weekDaySchema).length(7),
  community: z.object({
    posts: z.number().int().nonnegative(),
    answers: z.number().int().nonnegative(),
    helpfulVotes: z.number().int().nonnegative(),
  }),
  /** Selos que ainda podem ser conquistados no Teste de proficiência. */
  lockedBadges: z.array(z.string()),
});

export const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Escreva o nome com pelo menos 3 letras.")
    .max(60, "Use no máximo 60 caracteres."),
  email: z.email("Escreva um e-mail válido, como nome@email.com."),
  role: z.string().trim().max(60, "Use no máximo 60 caracteres."),
});

export const preferencesSchema = z.object({
  pushNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  isProfilePublic: z.boolean(),
  isInFriendsRanking: z.boolean(),
  hasResearchConsent: z.boolean(),
});

export type ActivityDay = z.infer<typeof activityDaySchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type WeekDay = z.infer<typeof weekDaySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type PreferenceKey = keyof Preferences;

const currentWeek = [
  { label: "Seg", xp: 60, isFuture: false },
  { label: "Ter", xp: 80, isFuture: false },
  { label: "Qua", xp: 0, isFuture: false },
  { label: "Qui", xp: 100, isFuture: false },
  { label: "Sex", xp: 80, isFuture: false },
  { label: "Sáb", xp: 0, isFuture: true },
  { label: "Dom", xp: 0, isFuture: true },
];

const ACTIVITY_WEEKS = 26;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Segunda-feira da semana atual do protótipo (09/11/2026), em UTC. */
const CURRENT_WEEK_START = Date.UTC(2026, 10, 9);
/** A Marina entrou no hub na semana 9 do mapa; antes disso não há registro. */
const FIRST_ACTIVE_WEEK = 9;
const XP_PER_LESSON = 40;

/** Gerador determinístico (mulberry32): o mapa sai igual em todo render. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Monta o histórico fictício: nada antes da entrada, ritmo irregular no
 * começo e mais constante nas últimas semanas; fim de semana rende menos.
 */
function buildActivity() {
  const random = createRandom(8);
  return Array.from({ length: ACTIVITY_WEEKS }, (_, week) => {
    const weekStart = CURRENT_WEEK_START - (ACTIVITY_WEEKS - 1 - week) * 7 * DAY_MS;
    const isCurrentWeek = week === ACTIVITY_WEEKS - 1;
    const habit = Math.min(0.85, 0.35 + (week - FIRST_ACTIVE_WEEK) * 0.035);

    return Array.from({ length: 7 }, (_, day) => {
      const date = new Date(weekStart + day * DAY_MS).toISOString().slice(0, 10);
      if (isCurrentWeek) {
        const { xp, isFuture } = currentWeek[day];
        return { date, xp, lessons: Math.round(xp / XP_PER_LESSON), isFuture };
      }
      const roll = random();
      const intensity = random();
      const isWeekend = day >= 5;
      const isActive = week >= FIRST_ACTIVE_WEEK && roll < (isWeekend ? habit * 0.45 : habit);
      const lessons = isActive ? 1 + Math.floor(intensity * 3) : 0;
      return { date, xp: lessons * XP_PER_LESSON, lessons, isFuture: false };
    });
  });
}

export const profile: Profile = profileSchema.parse({
  memberSince: "set 2026",
  longestStreakDays: 6,
  activity: buildActivity(),
  milestones: [
    {
      id: "nivel-3",
      dateLabel: "11 nov",
      kind: "nivel",
      title: "Nível 03",
      detail: "1.000 XP somados entre lições, práticas e respostas.",
    },
    {
      id: "resposta-util",
      dateLabel: "06 nov",
      kind: "comunidade",
      title: "10 votos de útil",
      detail: "Suas respostas ajudaram a turma dez vezes.",
    },
    {
      id: "selo-prompts",
      dateLabel: "29 out",
      kind: "selo",
      title: "Selo: Prompts para interfaces",
      detail: "Nível Básico no Teste de proficiência, com 82% de acerto.",
    },
    {
      id: "nivel-2",
      dateLabel: "14 out",
      kind: "nivel",
      title: "Nível 02",
      detail: "Primeiros 400 XP.",
    },
    {
      id: "primeira-licao",
      dateLabel: "09 set",
      kind: "trilha",
      title: "Primeira lição concluída",
      detail: "Módulo 01 · O que é IA de código.",
    },
    {
      id: "entrada",
      dateLabel: "07 set",
      kind: "inicio",
      title: "Entrada no BASE8",
      detail: "Objetivo escolhido: levar protótipos do Figma ao código.",
    },
  ],
  email: "marina.alves@email.com",
  nextLevelXp: 1500,
  streakDays: 2,
  week: currentWeek,
  community: { posts: 2, answers: 7, helpfulVotes: 15 },
  lockedBadges: ["Componentes e estado", "Acessibilidade"],
});

export const defaultPreferences: Preferences = preferencesSchema.parse({
  pushNotifications: true,
  inAppNotifications: true,
  emailNotifications: false,
  isProfilePublic: true,
  isInFriendsRanking: true,
  hasResearchConsent: true,
});
