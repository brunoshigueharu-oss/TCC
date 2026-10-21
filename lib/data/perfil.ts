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

const profileSchema = z.object({
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

export type WeekDay = z.infer<typeof weekDaySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type PreferenceKey = keyof Preferences;

export const profile: Profile = profileSchema.parse({
  email: "marina.alves@email.com",
  nextLevelXp: 1500,
  streakDays: 2,
  week: [
    { label: "Seg", xp: 60, isFuture: false },
    { label: "Ter", xp: 80, isFuture: false },
    { label: "Qua", xp: 0, isFuture: false },
    { label: "Qui", xp: 100, isFuture: false },
    { label: "Sex", xp: 80, isFuture: false },
    { label: "Sáb", xp: 0, isFuture: true },
    { label: "Dom", xp: 0, isFuture: true },
  ],
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
