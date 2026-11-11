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

/** Trecho em fonte mono dentro de um post ou resposta: o prompt usado ou um pedaço de código. */
const snippetSchema = z.object({
  kind: z.enum(["prompt", "codigo"]),
  /** Rótulo da barra do bloco, ex.: "prompt" ou "button.tsx". */
  label: z.string(),
  content: z.string(),
});

const answerSchema = z.object({
  id: z.string(),
  author: z.string(),
  timeAgo: z.string(),
  body: z.string(),
  snippet: snippetSchema.optional(),
  /** Quantas pessoas acharam a resposta útil. */
  votes: z.number().int().nonnegative(),
  /** Aceita por quem perguntou (rende XP para quem respondeu). */
  isHelpful: z.boolean(),
});

const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: postTypeSchema,
  author: z.string(),
  timeAgo: z.string(),
  body: z.string(),
  snippet: snippetSchema.optional(),
  tags: z.array(z.string()).min(1),
  votes: z.number().int().nonnegative(),
  /** Resumo da discussão em poucos pontos (posts com várias respostas). */
  summary: z.array(z.string()).optional(),
  /** Lição da trilha a que o post está ligado (fio de dúvidas da aula). */
  lessonId: z.string().optional(),
  answers: z.array(answerSchema),
});

const communitySchema = z.object({
  people: z.array(personSchema).min(1),
  tags: z.array(tagSchema).min(1),
  posts: z.array(postSchema).min(1),
  /** Post em destaque na semana (aparece no topo do feed). */
  weekHighlightId: z.string(),
});

export type PostType = z.infer<typeof postTypeSchema>;
export type Person = z.infer<typeof personSchema>;
export type CommunityTag = z.infer<typeof tagSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type Snippet = z.infer<typeof snippetSchema>;
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
  weekHighlightId: "botao-acessivel",
  posts: [
    {
      id: "grid-layout",
      title: "Como faço a IA respeitar meu grid?",
      type: "pergunta",
      author: "marina",
      timeAgo: "há 2 h",
      body: "Montei um grid de 4 colunas com margens de 16 px no Figma, mas a IA sempre devolve a tela com espaçamentos diferentes. Que informação devo colocar no prompt para ela seguir o grid?",
      snippet: {
        kind: "prompt",
        label: "prompt que usei",
        content: "Crie a tela de catálogo seguindo o layout do Figma.\nUse um grid e deixe tudo bem alinhado.",
      },
      tags: ["layout", "prompts"],
      votes: 14,
      lessonId: "m1-l3",
      summary: [
        "Descreva o grid em números: colunas, margem e espaço entre colunas.",
        "Cite os tokens de espaçamento do projeto pelo nome, quando existirem.",
        "Peça para a IA listar os valores que usou e confira antes de aceitar.",
      ],
      answers: [
        {
          id: "r1",
          author: "rafael",
          timeAgo: "há 1 h",
          body: "Descreva o grid em números no prompt: colunas, margem e espaçamento entre colunas. Depois peça para a IA listar os valores que usou — fica fácil conferir.",
          snippet: {
            kind: "prompt",
            label: "prompt",
            content: "Crie a tela de catálogo.\nGrid: 4 colunas, margem lateral de 16px, 12px entre colunas.\nTodo espaçamento vertical é múltiplo de 8px.\nAo terminar, liste os valores de espaçamento que você usou.",
          },
          votes: 9,
          isHelpful: true,
        },
        {
          id: "r2",
          author: "ana",
          timeAgo: "há 50 min",
          body: "Se o projeto tiver tokens de espaçamento, cite os nomes deles. A IA tende a inventar menos quando já existe um vocabulário definido.",
          votes: 4,
          isHelpful: false,
        },
        {
          id: "r3",
          author: "julia",
          timeAgo: "há 20 min",
          body: "Também ajuda colar um trecho de uma tela que já está certa e pedir que a nova siga o mesmo padrão.",
          votes: 2,
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
          votes: 3,
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
      summary: [
        "Peça a regra pelo nome (WCAG 2.2) e pelos números: foco visível e contraste de 4,5:1.",
        "Cole o componente do design system como referência antes de pedir o código.",
        "Termine pedindo a lista do que a IA verificou.",
      ],
      answers: [
        {
          id: "r1",
          author: "pedro",
          timeAgo: "ontem",
          body: "Inclua a regra e os números no prompt, e termine pedindo a lista do que foi verificado. Sem isso a IA costuma entregar só a aparência do botão.",
          snippet: {
            kind: "prompt",
            label: "prompt",
            content: "Crie o componente de botão primário.\nSiga a WCAG 2.2: foco visível de 2px, contraste mínimo de 4,5:1\ne alvo de toque de pelo menos 44px.\nNo fim, liste o que você verificou.",
          },
          votes: 15,
          isHelpful: true,
        },
        {
          id: "r2",
          author: "marina",
          timeAgo: "ontem",
          body: "Também ajuda colar o componente do seu design system como referência antes de pedir o código.",
          snippet: {
            kind: "codigo",
            label: "button.tsx",
            content: "<button\n  className=\"h-11 rounded-full px-5 focus-visible:ring-2\"\n  aria-label=\"Salvar alterações\"\n>\n  Salvar\n</button>",
          },
          votes: 6,
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
      summary: [
        "A maioria deixa os tokens num arquivo do projeto e cita só o caminho.",
        "Colar tudo a cada pedido gasta o limite de contexto.",
      ],
      answers: [
        {
          id: "r1",
          author: "julia",
          timeAgo: "há 2 dias",
          body: "Eu deixo os tokens num arquivo do projeto e só cito o caminho no prompt. A IA lê quando precisa.",
          votes: 7,
          isHelpful: false,
        },
        {
          id: "r2",
          author: "caio",
          timeAgo: "ontem",
          body: "Concordo com a Júlia. Colar tudo toda vez também gasta o limite de contexto.",
          votes: 2,
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
          snippet: {
            kind: "prompt",
            label: "prompt",
            content: "Ajuste só o espaçamento do cabeçalho.\nEdite apenas components/header.tsx.\nAntes de alterar, me mostre o plano em 3 linhas e espere meu ok.",
          },
          votes: 12,
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
    {
      id: "tema-escuro",
      title: "A IA criou o tema escuro, mas as cores de destaque sumiram",
      type: "pergunta",
      author: "caio",
      timeAgo: "há 5 dias",
      body: "Pedi o tema escuro e o texto sobre os botões coloridos ficou branco sobre amarelo. Como explico para a IA quais cores invertem e quais ficam fixas?",
      tags: ["componentes", "acessibilidade"],
      votes: 13,
      answers: [
        {
          id: "r1",
          author: "ana",
          timeAgo: "há 5 dias",
          body: "Separe as cores em dois grupos e dê nome a cada um: as que invertem com o tema (fundo, texto, linha) e as fixas (texto sobre cor viva). Com os nomes no prompt, a IA para de adivinhar.",
          snippet: {
            kind: "codigo",
            label: "globals.css",
            content: ":root {\n  --texto: #18181b; /* inverte no escuro */\n  --tinta: #18181b; /* fixa: texto sobre cor viva */\n}\n.dark {\n  --texto: #f4f4f6;\n}",
          },
          votes: 8,
          isHelpful: true,
        },
        {
          id: "r2",
          author: "pedro",
          timeAgo: "há 4 dias",
          body: "Peça também uma captura das duas versões lado a lado. Fica fácil ver onde o contraste caiu.",
          votes: 1,
          isHelpful: false,
        },
      ],
    },
    {
      id: "revisar-codigo-gerado",
      title: "Como vocês revisam o código que a IA entrega?",
      type: "discussao",
      author: "ana",
      timeAgo: "há 6 dias",
      body: "Sou designer e ainda não leio código com segurança. Tenho conferido só o resultado na tela. Quem já criou um roteiro de revisão pode compartilhar?",
      tags: ["ferramentas", "componentes"],
      votes: 19,
      answers: [
        {
          id: "r1",
          author: "julia",
          timeAgo: "há 6 dias",
          body: "Meu roteiro tem três passos: abrir a tela no celular e no computador, navegar só com o teclado e pedir à IA um resumo do que mudou em cada arquivo.",
          votes: 10,
          isHelpful: false,
        },
      ],
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
  /** Pergunta com resposta aceita. */
  isSolved: boolean;
  lesson: PostLessonRef | null;
};

export type AnswerView = Omit<Answer, "author"> & { author: Person };

export type PostDetail = PostSummary & { answers: AnswerView[] };

export type LessonOption = { id: string; label: string };

/** Resposta de uma pessoa, com o post onde ela foi dada (perfil público). */
export type PersonAnswer = {
  postId: string;
  postTitle: string;
  timeAgo: string;
  body: string;
  isHelpful: boolean;
};

/** Post enxuto para comparar títulos no navegador ("dúvidas parecidas"). */
export type PostTeaser = {
  id: string;
  title: string;
  tags: string[];
  answersCount: number;
  isSolved: boolean;
};

export type WeekHighlight = { post: PostSummary; answer: AnswerView | null };

export type TagWithCount = CommunityTag & { postsCount: number };

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
    snippet: post.snippet,
    summary: post.summary,
    votes: post.votes,
    author: findPerson(post.author),
    tags: resolveTags(post.tags),
    answersCount: post.answers.length,
    isSolved: post.answers.some((answer) => answer.isHelpful),
    lesson: resolveLesson(post.lessonId),
  };
}

function toAnswerView(answer: Answer): AnswerView {
  return { ...answer, author: findPerson(answer.author) };
}

/** Link do autor: a própria pessoa vai para `/perfil`; as outras, para o perfil público. */
export function getPersonHref(username: string) {
  return username === CURRENT_USERNAME ? "/perfil" : `/comunidade/pessoas/${username}`;
}

/** Pessoa logada no protótipo, para as respostas enviadas na hora. */
export function getCurrentPerson(): Person {
  return findPerson(CURRENT_USERNAME);
}

export function listTags(): CommunityTag[] {
  return community.tags;
}

/** Tags com o número de posts de cada uma (coluna lateral e busca). */
export function listTagsWithCount(): TagWithCount[] {
  return community.tags.map((tag) => ({
    ...tag,
    postsCount: community.posts.filter((post) => post.tags.includes(tag.slug)).length,
  }));
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
    // A resposta aceita sobe para o topo; as outras ficam na ordem em que chegaram.
    answers: [...post.answers]
      .sort((first, second) => Number(second.isHelpful) - Number(first.isHelpful))
      .map(toAnswerView),
  };
}

/** Destaque da semana: o post escolhido e a resposta aceita (se houver). */
export function getWeekHighlight(): WeekHighlight | null {
  const post = community.posts.find((item) => item.id === community.weekHighlightId);
  if (!post) return null;
  const accepted = post.answers.find((answer) => answer.isHelpful);
  return { post: toSummary(post), answer: accepted ? toAnswerView(accepted) : null };
}

/** Outros posts que dividem pelo menos uma tag com este, os mais votados primeiro. */
export function listRelatedPosts(postId: string, limit = 3): PostSummary[] {
  const post = community.posts.find((item) => item.id === postId);
  if (!post) return [];
  const related = community.posts.filter(
    (item) => item.id !== postId && item.tags.some((tag) => post.tags.includes(tag)),
  );
  return sortByVotes(related.map(toSummary)).slice(0, limit);
}

export function listPostsByAuthor(username: string): PostSummary[] {
  return community.posts.filter((post) => post.author === username).map(toSummary);
}

export function listAnswersByAuthor(username: string): PersonAnswer[] {
  return community.posts.flatMap((post) =>
    post.answers
      .filter((answer) => answer.author === username)
      .map((answer) => ({
        postId: post.id,
        postTitle: post.title,
        timeAgo: answer.timeAgo,
        body: answer.body,
        isHelpful: answer.isHelpful,
      })),
  );
}

/** Todos os posts em versão enxuta, para a busca de dúvidas parecidas. */
export function listPostTeasers(): PostTeaser[] {
  return community.posts.map((post) => ({
    id: post.id,
    title: post.title,
    tags: post.tags,
    answersCount: post.answers.length,
    isSolved: post.answers.some((answer) => answer.isHelpful),
  }));
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
