import { z } from "zod";

/**
 * Dados FICTÍCIOS das pessoas do hub (perfil público e ranking de amigos).
 * Na versão real vêm dos módulos Identidade, Gamificação e Comunidades da API.
 * Os ids de posts e minicursos batem com os das telas da Comunidade e dos
 * Cursos da comunidade.
 */

const avatarToneSchema = z.enum(["noite", "trilha", "pratica", "comunidade", "acao"]);

const badgeSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.enum(["Básico", "Intermediário", "Avançado"]),
});

const personPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  tag: z.string(),
  answers: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
});

const personCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessons: z.number().int().positive(),
  students: z.number().int().nonnegative(),
});

const personSchema = z.object({
  username: z.string(),
  name: z.string(),
  role: z.string(),
  level: z.number().int().positive(),
  xp: z.number().int().nonnegative(),
  weeklyXp: z.number().int().nonnegative(),
  monthlyXp: z.number().int().nonnegative(),
  avatarTone: avatarToneSchema,
  isLookingForCollaborators: z.boolean(),
  badges: z.array(badgeSchema),
  posts: z.array(personPostSchema),
  courses: z.array(personCourseSchema),
});

export type AvatarTone = z.infer<typeof avatarToneSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type PersonPost = z.infer<typeof personPostSchema>;
export type PersonCourse = z.infer<typeof personCourseSchema>;
export type Person = z.infer<typeof personSchema>;

/** `@marina` é a pessoa logada no protótipo. */
export const CURRENT_USERNAME = "marina";

export const people: Person[] = z.array(personSchema).parse([
  {
    username: "marina",
    name: "Marina Alves",
    role: "Designer de produto",
    level: 3,
    xp: 1240,
    weeklyXp: 320,
    monthlyXp: 1310,
    avatarTone: "noite",
    isLookingForCollaborators: false,
    badges: [{ id: "prompts-basico", title: "Prompts para interfaces", level: "Básico" }],
    posts: [
      {
        id: "grid-layout",
        title: "Como faço a IA respeitar meu grid?",
        tag: "layout",
        answers: 3,
        likes: 12,
      },
    ],
    courses: [],
  },
  {
    username: "rafael",
    name: "Rafael Souza",
    role: "Designer de interfaces",
    level: 5,
    xp: 2380,
    weeklyXp: 410,
    monthlyXp: 1280,
    avatarTone: "comunidade",
    isLookingForCollaborators: true,
    badges: [
      { id: "prompts-intermediario", title: "Prompts para interfaces", level: "Intermediário" },
      { id: "tokens-basico", title: "Tokens e temas", level: "Básico" },
    ],
    posts: [
      {
        id: "prompt-mobile",
        title: "O prompt de exemplo funciona no mobile também?",
        tag: "prompts",
        answers: 1,
        likes: 5,
      },
    ],
    courses: [{ id: "figma-para-codigo", title: "Do Figma ao código com IA", lessons: 6, students: 142 }],
  },
  {
    username: "ana",
    name: "Ana Lima",
    role: "Designer de UX",
    level: 6,
    xp: 3020,
    weeklyXp: 385,
    monthlyXp: 1520,
    avatarTone: "pratica",
    isLookingForCollaborators: false,
    badges: [
      { id: "prompts-avancado", title: "Prompts para interfaces", level: "Avançado" },
      { id: "componentes-intermediario", title: "Componentes e estado", level: "Intermediário" },
      { id: "acessibilidade-basico", title: "Acessibilidade", level: "Básico" },
    ],
    posts: [
    ],
    courses: [
      { id: "tokens-com-ia", title: "Design tokens com IA", lessons: 4, students: 86 },
    ],
  },
  {
    username: "caio",
    name: "Caio Martins",
    role: "Designer gráfico em transição para produto",
    level: 4,
    xp: 1760,
    weeklyXp: 350,
    monthlyXp: 1100,
    avatarTone: "trilha",
    isLookingForCollaborators: true,
    badges: [{ id: "prompts-basico", title: "Prompts para interfaces", level: "Básico" }],
    posts: [
      {
        id: "estado-componente",
        title: "Por que o componente perdeu o estado ao trocar de tela?",
        tag: "estado",
        answers: 0,
        likes: 2,
      },
    ],
    courses: [],
  },
  {
    username: "julia",
    name: "Júlia Rocha",
    role: "Designer de interação",
    level: 4,
    xp: 1980,
    weeklyXp: 260,
    monthlyXp: 790,
    avatarTone: "acao",
    isLookingForCollaborators: false,
    badges: [
      { id: "prompts-intermediario", title: "Prompts para interfaces", level: "Intermediário" },
    ],
    posts: [],
    courses: [
      { id: "micro-interacoes", title: "Micro-interações e estados", lessons: 5, students: 58 },
    ],
  },
  {
    username: "pedro",
    name: "Pedro Nunes",
    role: "Estudante de design",
    level: 2,
    xp: 640,
    weeklyXp: 190,
    monthlyXp: 860,
    avatarTone: "comunidade",
    isLookingForCollaborators: true,
    badges: [],
    posts: [],
    courses: [],
  },
]);

export function findPerson(username: string) {
  return people.find((person) => person.username === username) ?? null;
}
