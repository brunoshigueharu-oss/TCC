import { z } from "zod";

import { findLesson, track } from "@/lib/data/trilha";

/**
 * Dados FICTÍCIOS da Comunidade para o protótipo. Na versão real vêm do
 * módulo "Comunidades" da API. As funções abaixo são buscas puras sobre estes
 * dados; as rotas chamam-nas pelos seus `_data-access`.
 */

/** Pessoa logada no protótipo — o link do autor vai para `/perfil`. */
export const CURRENT_USERNAME = "marina";

const personSchema = z.object({
  username: z.string(),
  name: z.string(),
});

export const postTypeSchema = z.enum(["pergunta", "discussao"]);

const tagSchema = z.object({
  slug: z.string(),
  label: z.string(),
  description: z.string(),
  followers: z.number().int().nonnegative(),
});

const answerSchema = z.object({
  id: z.string(),
  author: z.string(),
  timeAgo: z.string(),
  body: z.string(),
  /** Marcada como útil por quem perguntou (rende XP para quem respondeu). */
  isHelpful: z.boolean(),
});

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: postTypeSchema,
  author: z.string(),
  timeAgo: z.string(),
  body: z.string(),
  tags: z.array(z.string()).min(1),
  votes: z.number().int().nonnegative(),
  /** Lição da trilha a que o post está ligado (fio de dúvidas da aula). */
  lessonId: z.string().optional(),
  answers: z.array(answerSchema),
});

const communitySchema = z.object({
  people: z.array(personSchema).min(1),
  tags: z.array(tagSchema).min(1),
  posts: z.array(postSchema).min(1),
});

export type PostType = z.infer<typeof postTypeSchema>;
export type Person = z.infer<typeof personSchema>;
export type CommunityTag = z.infer<typeof tagSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type Post = z.infer<typeof postSchema>;

export const postTypeLabels: Record<PostType, string> = {
  pergunta: "Pergunta",
  discussao: "Discussão",
};

/** XP que quem respondeu ganha quando a resposta é marcada como útil. */
export const HELPFUL_ANSWER_XP = 10;

const community = communitySchema.parse({
  people: [
    { username: "marina", name: "Marina Alves" },
    { username: "rafael", name: "Rafael Souza" },
    { username: "ana", name: "Ana Lima" },
    { username: "caio", name: "Caio Martins" },
    { username: "julia", name: "Júlia Rocha" },
    { username: "pedro", name: "Pedro Nunes" },
  ],
  tags: [
    {
      slug: "prompts",
      label: "Prompts",
      description: "Como escrever, ajustar e reaproveitar pedidos para a IA de código.",
      followers: 312,
    },
    {
      slug: "layout",
      label: "Layout",
      description: "Grid, espaçamento e responsividade em telas geradas com IA.",
      followers: 248,
    },
    {
      slug: "componentes",
      label: "Componentes",
      description: "Componentes reutilizáveis, variações e design system no código.",
      followers: 201,
    },
    {
      slug: "estado",
      label: "Estado",
      description: "Dados que mudam na tela: formulários, filtros, navegação.",
      followers: 97,
    },
    {
      slug: "acessibilidade",
      label: "Acessibilidade",
      description: "Contraste, foco, leitores de tela e as regras WCAG no código.",
      followers: 164,
    },
    {
      slug: "ferramentas",
      label: "Ferramentas",
      description: "Editores, extensões e fluxos de trabalho com IA de código.",
      followers: 276,
    },
  ],
  posts: [
    {
      id: "grid-layout",
      title: "Como faço a IA respeitar meu grid?",
      type: "pergunta",
      author: "marina",
      timeAgo: "há 2 h",
      body: "Montei um grid de 4 colunas com margens de 16 px no Figma, mas a IA sempre devolve a tela com espaçamentos diferentes. Que informação devo colocar no prompt para ela seguir o grid?",
      tags: ["layout", "prompts"],
      votes: 14,
      lessonId: "m1-l3",
      answers: [
        {
          id: "r1",
          author: "rafael",
          timeAgo: "há 1 h",
          body: "Descreva o grid em números no prompt: colunas, margem e espaçamento entre colunas. Depois peça para a IA listar os valores que usou — fica fácil conferir.",
          isHelpful: true,
        },
        {
          id: "r2",
          author: "ana",
          timeAgo: "há 50 min",
          body: "Se o projeto tiver tokens de espaçamento, cite os nomes deles. A IA tende a inventar menos quando já existe um vocabulário definido.",
          isHelpful: false,
        },
        {
          id: "r3",
          author: "julia",
          timeAgo: "há 20 min",
          body: "Também ajuda colar um trecho de uma tela que já está certa e pedir que a nova siga o mesmo padrão.",
          isHelpful: false,
        },
      ],
    },
    {
      id: "estado-componente",
      title: "Por que o componente perdeu o estado ao trocar de tela?",
      type: "pergunta",
      author: "caio",
      timeAgo: "há 3 h",
      body: "Pedi para a IA criar um filtro com chips. Ele funciona, mas quando volto para a tela o filtro marcado some. É um problema do prompt ou do código?",
      tags: ["estado", "componentes"],
      votes: 6,
      lessonId: "m1-l2",
      answers: [],
    },
    {
      id: "prompt-mobile",
      title: "O prompt de exemplo funciona no mobile também?",
      type: "pergunta",
      author: "rafael",
      timeAgo: "há 5 h",
      body: "Testei o prompt da lição 3 numa tela de computador e deu certo. Preciso mudar alguma coisa para gerar a versão de celular?",
      tags: ["prompts", "layout"],
      votes: 9,
      lessonId: "m1-l3",
      answers: [
        {
          id: "r1",
          author: "pedro",
          timeAgo: "há 4 h",
          body: "Funciona, mas vale dizer a largura de referência (por exemplo, 390 px) e pedir que os alvos de toque tenham no mínimo 44 px.",
          isHelpful: false,
        },
      ],
    },
    {
      id: "botao-acessivel",
      title: "Como peço à IA um botão acessível?",
      type: "pergunta",
      author: "ana",
      timeAgo: "ontem",
      body: "Gerei o botão com a IA, mas o foco do teclado não aparece e o contraste ficou baixo. Que instrução devo incluir no prompt para ela seguir as regras de acessibilidade desde o início?",
      tags: ["acessibilidade", "prompts", "componentes"],
      votes: 21,
      answers: [
        {
          id: "r1",
          author: "pedro",
          timeAgo: "ontem",
          body: "Inclua no prompt: “siga a WCAG 2.2, mostre o foco visível e use contraste mínimo de 4,5:1”. Depois peça para a IA listar o que verificou.",
          isHelpful: true,
        },
        {
          id: "r2",
          author: "marina",
          timeAgo: "ontem",
          body: "Também ajuda colar o componente do seu design system como referência antes de pedir o código.",
          isHelpful: false,
        },
      ],
    },
    {
      id: "tokens-de-design",
      title: "Vale a pena passar os tokens de design para a IA?",
      type: "discussao",
      author: "pedro",
      timeAgo: "há 2 dias",
      body: "No meu projeto passei a colar o arquivo de tokens antes de cada pedido. O resultado ficou mais consistente, mas o prompt ficou longo. Como vocês fazem?",
      tags: ["componentes", "ferramentas"],
      votes: 11,
      answers: [
        {
          id: "r1",
          author: "julia",
          timeAgo: "há 2 dias",
          body: "Eu deixo os tokens num arquivo do projeto e só cito o caminho no prompt. A IA lê quando precisa.",
          isHelpful: false,
        },
        {
          id: "r2",
          author: "caio",
          timeAgo: "ontem",
          body: "Concordo com a Júlia. Colar tudo toda vez também gasta o limite de contexto.",
          isHelpful: false,
        },
      ],
    },
    {
      id: "ia-muda-arquivos",
      title: "O que fazer quando a IA muda arquivos que eu não pedi?",
      type: "pergunta",
      author: "julia",
      timeAgo: "há 3 dias",
      body: "Pedi só um ajuste de espaçamento e ela reescreveu o componente inteiro. Existe um jeito de limitar o que a IA pode alterar?",
      tags: ["ferramentas", "prompts"],
      votes: 17,
      answers: [
        {
          id: "r1",
          author: "rafael",
          timeAgo: "há 3 dias",
          body: "Diga no prompt quais arquivos ela pode editar e peça para mostrar o plano antes de mudar qualquer coisa.",
          isHelpful: true,
        },
      ],
    },
    {
      id: "figma-ou-codigo",
      title: "Começar pelo Figma ou direto pelo código?",
      type: "discussao",
      author: "rafael",
      timeAgo: "há 4 dias",
      body: "Para telas simples, tenho ido direto ao código com a IA e ajustado no navegador. Para fluxos maiores, ainda começo no Figma. Qual tem sido a ordem de vocês?",
      tags: ["ferramentas", "layout"],
      votes: 8,
      answers: [],
    },
  ],
});

export type PostLessonRef = {
  id: string;
  number: number;
  moduleNumber: number;
  title: string;
};

export type PostSummary = Omit<Post, "answers" | "lessonId" | "author" | "tags"> & {
  author: Person;
  tags: CommunityTag[];
  answersCount: number;
  lesson: PostLessonRef | null;
};

export type AnswerView = Omit<Answer, "author"> & { author: Person };

export type PostDetail = PostSummary & { answers: AnswerView[] };

export type LessonOption = { id: string; label: string };

function findPerson(username: string): Person {
  return (
    community.people.find((person) => person.username === username) ?? {
      username,
      name: username,
    }
  );
}

function resolveTags(slugs: string[]): CommunityTag[] {
  return slugs.flatMap((slug) => community.tags.filter((tag) => tag.slug === slug));
}

function resolveLesson(lessonId: string | undefined): PostLessonRef | null {
  if (!lessonId) return null;
  const found = findLesson(track, lessonId);
  if (!found) return null;
  return {
    id: found.lesson.id,
    number: found.lesson.number,
    moduleNumber: found.trackModule.number,
    title: found.lesson.title,
  };
}

function toSummary(post: Post): PostSummary {
  return {
    id: post.id,
    title: post.title,
    type: post.type,
    timeAgo: post.timeAgo,
    body: post.body,
    votes: post.votes,
    author: findPerson(post.author),
    tags: resolveTags(post.tags),
    answersCount: post.answers.length,
    lesson: resolveLesson(post.lessonId),
  };
}

/** Link do autor: a própria pessoa vai para `/perfil`; as outras, para o perfil público. */
export function getPersonHref(username: string) {
  return username === CURRENT_USERNAME ? "/perfil" : `/comunidade/pessoas/${username}`;
}

export function listTags(): CommunityTag[] {
  return community.tags;
}

export function findTag(slug: string): CommunityTag | null {
  return community.tags.find((tag) => tag.slug === slug) ?? null;
}

/** Posts mais recentes primeiro (ordem dos dados); filtra por tag quando houver. */
export function listPosts(tagSlug?: string): PostSummary[] {
  const posts = tagSlug
    ? community.posts.filter((post) => post.tags.includes(tagSlug))
    : community.posts;
  return posts.map(toSummary);
}

/** Mais úteis = mais votos primeiro. */
export function sortByVotes(posts: PostSummary[]): PostSummary[] {
  return [...posts].sort((first, second) => second.votes - first.votes);
}

export function findPost(postId: string): PostDetail | null {
  const post = community.posts.find((item) => item.id === postId);
  if (!post) return null;
  return {
    ...toSummary(post),
    answers: post.answers.map((answer) => ({ ...answer, author: findPerson(answer.author) })),
  };
}

/** Lições da trilha que podem ser ligadas a um post novo. */
export function listLessonOptions(): LessonOption[] {
  return track.modules.flatMap((trackModule) =>
    trackModule.lessons.map((lesson) => ({
      id: lesson.id,
      label: `Módulo ${trackModule.number} · Lição ${lesson.number} — ${lesson.title}`,
    })),
  );
}
