import { CURRENT_USERNAME, listPosts } from "@/lib/data/comunidade";
import { courses, formatLessonsCount } from "@/lib/data/cursos";
import { countUnreadNotifications } from "@/lib/data/notificacoes";
import { people } from "@/lib/data/pessoas";
import { activityKindLabel, practice } from "@/lib/data/praticar";
import { findCurrentLesson, track } from "@/lib/data/trilha";
import { formatAnswers, formatTwoDigits } from "@/lib/format";

/** Grupos da paleta, na ordem em que aparecem. */
export const commandGroups = ["acoes", "telas", "licoes", "atividades", "cursos", "posts", "pessoas"] as const;
export type CommandGroup = (typeof commandGroups)[number];

/** Ícones disponíveis (o mapa para o componente fica no cliente). */
export type CommandIcon =
  | "acao"
  | "tela"
  | "licao"
  | "atividade"
  | "curso"
  | "post"
  | "pessoa"
  | "tema"
  | "barra-lateral"
  | "configuracoes"
  | "notificacoes"
  | "escrever"
  | "continuar";

/** Ações que rodam no cliente em vez de navegar. */
export type CommandAction = "alternar-tema" | "alternar-barra-lateral";

/**
 * Teclas do atalho, na ordem. `mod` vira ⌘ no Mac e Ctrl nos outros; `alt`
 * vira ⌥ ou Alt. Teclas separadas por "então" (ex.: G depois H) usam `then`.
 */
export type CommandShortcut = { keys: string[]; isSequence?: boolean };

export type CommandItem = {
  id: string;
  group: CommandGroup;
  label: string;
  /** Contexto curto à direita/abaixo (ex.: "Módulo 1 · 8 min"). */
  hint?: string;
  /** Termos extras que também encontram o item. */
  keywords: string[];
  icon: CommandIcon;
  href?: string;
  action?: CommandAction;
  shortcut?: CommandShortcut;
};

const go = (key: string): CommandShortcut => ({ keys: ["G", key], isSequence: true });

/**
 * Monta o índice da paleta de comandos a partir dos dados do hub. Roda no
 * servidor (dados fictícios em `lib/data`); o cliente recebe só a lista pronta.
 * Na versão real, lições/cursos/pessoas viriam do endpoint de busca.
 */
export function buildCommandIndex(): CommandItem[] {
  const current = findCurrentLesson(track);
  const unread = countUnreadNotifications();

  const actions: CommandItem[] = [
    ...(current
      ? [
          {
            id: "acao:continuar-licao",
            group: "acoes",
            label: "Continuar lição",
            hint: `Lição ${formatTwoDigits(current.lesson.number)} — ${current.lesson.title}`,
            keywords: ["retomar", "trilha", "estudar", "aula"],
            icon: "continuar",
            href: `/educacao/licao/${current.lesson.id}`,
          } satisfies CommandItem,
        ]
      : []),
    {
      id: "acao:criar-post",
      group: "acoes",
      label: "Criar post",
      hint: "Pergunta ou discussão na comunidade",
      keywords: ["novo", "perguntar", "publicar", "escrever", "dúvida"],
      icon: "escrever",
      href: "/comunidade/novo",
    },
    {
      id: "acao:praticar",
      group: "acoes",
      label: "Praticar agora",
      hint: "Atividades curtas, avaliadas na hora",
      keywords: ["exercício", "atividade", "treinar"],
      icon: "atividade",
      href: "/educacao/praticar",
    },
    {
      id: "acao:notificacoes",
      group: "acoes",
      label: "Ver notificações",
      hint: unread > 0 ? `${unread} ${unread === 1 ? "nova" : "novas"}` : "Nenhuma nova",
      keywords: ["avisos", "novidades", "alertas"],
      icon: "notificacoes",
      href: "/perfil/notificacoes",
      shortcut: go("N"),
    },
    {
      id: "acao:tema",
      group: "acoes",
      label: "Mudar tema",
      hint: "Alterna entre claro e escuro",
      keywords: ["escuro", "claro", "dark", "light", "modo", "noite", "aparência"],
      icon: "tema",
      action: "alternar-tema",
      shortcut: { keys: ["alt", "T"] },
    },
    {
      id: "acao:configuracoes",
      group: "acoes",
      label: "Ir para configurações",
      hint: "Conta, notificações e privacidade",
      keywords: ["preferências", "conta", "privacidade", "ajustes", "settings"],
      icon: "configuracoes",
      href: "/perfil/configuracoes",
      shortcut: go("S"),
    },
    {
      id: "acao:barra-lateral",
      group: "acoes",
      label: "Recolher ou expandir a barra lateral",
      hint: "Só no computador",
      keywords: ["menu", "navegação", "sidebar", "ícones", "esconder"],
      icon: "barra-lateral",
      action: "alternar-barra-lateral",
      shortcut: { keys: ["mod", "B"] },
    },
    {
      id: "acao:criar-minicurso",
      group: "acoes",
      label: "Criar minicurso",
      hint: "Editor de aulas (computador)",
      keywords: ["curso", "aula", "ensinar", "publicar", "autor"],
      icon: "escrever",
      href: "/criar-minicurso",
    },
  ];

  const screens: CommandItem[] = [
    { label: "Home", href: "/inicio", keywords: ["início", "inicio", "começo"], shortcut: go("H") },
    { label: "Comunidade", href: "/comunidade", keywords: ["posts", "perguntas", "fórum"], shortcut: go("C") },
    { label: "Educação", href: "/educacao", keywords: ["trilha", "aprender", "módulos"], shortcut: go("E") },
    { label: "Perfil", href: "/perfil", keywords: ["meu perfil", "xp", "nível", "selos"], shortcut: go("P") },
    { label: "Busca", href: "/busca", keywords: ["procurar", "pesquisar"] },
    { label: "Cursos da comunidade", href: "/educacao/cursos", keywords: ["minicursos", "aulas"] },
    { label: "Praticar", href: "/educacao/praticar", keywords: ["atividades", "exercícios"] },
    { label: "Teste de proficiência", href: "/educacao/proficiencia", keywords: ["prova", "selo", "certificado"] },
    { label: "Ranking", href: "/perfil/ranking", keywords: ["amigos", "posição", "xp", "classificação"] },
    { label: "Notificações", href: "/perfil/notificacoes", keywords: ["avisos"] },
    { label: "Configurações", href: "/perfil/configuracoes", keywords: ["preferências", "conta"] },
    { label: "Moderação", href: "/moderacao", keywords: ["denúncias", "painel", "moderador"] },
    { label: "Página inicial do site", href: "/", keywords: ["landing", "apresentação", "sobre"] },
  ].map((screen) => ({
    ...screen,
    id: `tela:${screen.href}`,
    group: "telas" as const,
    icon: "tela" as const,
  }));

  const lessons: CommandItem[] = track.modules.flatMap((trackModule) =>
    trackModule.lessons.map((lesson) => ({
      id: `licao:${lesson.id}`,
      group: "licoes" as const,
      label: lesson.title,
      hint: `Módulo ${trackModule.number} · Lição ${formatTwoDigits(lesson.number)} · ${lesson.minutes} min`,
      keywords: [trackModule.title, "lição", "trilha"],
      icon: "licao" as const,
      href: `/educacao/licao/${lesson.id}`,
    })),
  );

  const activities: CommandItem[] = practice.activities.map((activity) => ({
    id: `atividade:${activity.id}`,
    group: "atividades" as const,
    label: activity.shortTitle,
    hint: `${activityKindLabel[activity.kind]} · ${activity.level} · ${activity.minutes} min`,
    keywords: [activity.title, "praticar", "atividade"],
    icon: "atividade" as const,
    href: `/educacao/praticar/${activity.id}`,
  }));

  const courseItems: CommandItem[] = courses.map((course) => ({
    id: `curso:${course.id}`,
    group: "cursos" as const,
    label: course.title,
    hint: `${course.author.name} · ${formatLessonsCount(course.lessons.length)}`,
    keywords: [...course.tags, "minicurso", "curso"],
    icon: "curso" as const,
    href: `/educacao/cursos/${course.id}`,
  }));

  const posts: CommandItem[] = listPosts().map((post) => ({
    id: `post:${post.id}`,
    group: "posts" as const,
    label: post.title,
    hint: `${post.author.name} · ${formatAnswers(post.answersCount)}`,
    keywords: [...post.tags.map((tag) => tag.slug), "post", "comunidade"],
    icon: "post" as const,
    href: `/comunidade/posts/${post.id}`,
  }));

  const peopleItems: CommandItem[] = people
    .filter((person) => person.username !== CURRENT_USERNAME)
    .map((person) => ({
      id: `pessoa:${person.username}`,
      group: "pessoas" as const,
      label: person.name,
      hint: `${person.role} · nível ${person.level}`,
      keywords: [`@${person.username}`, person.username, "pessoa", "perfil"],
      icon: "pessoa" as const,
      href: `/comunidade/pessoas/${person.username}`,
    }));

  return [...actions, ...screens, ...lessons, ...activities, ...courseItems, ...posts, ...peopleItems];
}
