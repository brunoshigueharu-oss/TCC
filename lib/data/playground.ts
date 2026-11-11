import { z } from "zod";

/**
 * Dados FICTÍCIOS do playground de prompt. Nada aqui chama uma IA: o prompt é
 * montado com trechos que ligam e desligam, e o "resultado" é uma interface
 * desenhada pelo próprio hub que reage a cada trecho. É determinístico: o
 * mesmo prompt sempre dá o mesmo resultado.
 */

export const fragmentIds = ["conteudo", "hierarquia", "medidas", "tokens", "estados", "formato"] as const;
export const fragmentIdSchema = z.enum(fragmentIds);
export type FragmentId = z.infer<typeof fragmentIdSchema>;

export const paramIds = ["largura", "cor", "raio"] as const;
export const paramIdSchema = z.enum(paramIds);
export type ParamId = z.infer<typeof paramIdSchema>;

const paramSchema = z.object({
  id: paramIdSchema,
  /** Nome lido por leitores de tela no botão que troca o valor. */
  label: z.string(),
  /** Valores possíveis, na ordem em que o clique alterna. */
  options: z.array(z.string()).min(2),
});

const fragmentSchema = z.object({
  id: fragmentIdSchema,
  /** Nome curto do trecho (o que ele especifica). */
  label: z.string(),
  /** Texto do trecho no prompt. `{largura}` marca um valor que a pessoa troca. */
  text: z.string(),
  /** O que a IA inventa quando o trecho está desligado. */
  guess: z.string(),
});

const scenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Primeira frase do prompt: o pedido vago, sempre presente. */
  basePrompt: z.string(),
  fragments: z.array(fragmentSchema).length(fragmentIds.length),
  params: z.array(paramSchema).length(paramIds.length),
  /** Trechos ligados ao abrir o playground. */
  initialFragments: z.array(fragmentIdSchema),
  /** Conteúdo real do card, usado quando o trecho "conteúdo" está ligado. */
  content: z.object({
    eyebrow: z.string(),
    title: z.string(),
    author: z.string(),
    meta: z.string(),
    action: z.string(),
  }),
});

export type PlaygroundParam = z.infer<typeof paramSchema>;
export type PlaygroundFragment = z.infer<typeof fragmentSchema>;
export type PlaygroundScenario = z.infer<typeof scenarioSchema>;

/** Estado do prompt: trechos ligados + índice do valor escolhido em cada parâmetro. */
export type PromptState = {
  enabled: FragmentId[];
  values: Record<ParamId, number>;
};

export const playgroundScenario: PlaygroundScenario = scenarioSchema.parse({
  id: "card-de-curso",
  title: "Card de curso",
  basePrompt: "Crie um card de curso bonito.",
  fragments: [
    {
      id: "conteudo",
      label: "Conteúdo",
      text: "O card mostra a categoria, o título do curso, quem criou, a duração e um botão “Começar”.",
      guess: "o texto (“Lorem ipsum” e “Clique aqui”)",
    },
    {
      id: "hierarquia",
      label: "Hierarquia",
      text: "Título em 20 px semibold, alinhado à esquerda; metadados em 13 px na cor secundária.",
      guess: "os tamanhos e o alinhamento do texto",
    },
    {
      id: "medidas",
      label: "Medidas",
      text: "Largura máxima de {largura} e botão com 44 px de altura, ocupando a largura do card.",
      guess: "a largura do card e o tamanho do botão",
    },
    {
      id: "tokens",
      label: "Tokens",
      text: "Use os tokens do projeto: botão na cor {cor}, cantos de {raio}, borda de 1 px e nenhuma sombra.",
      guess: "as cores, os cantos e a sombra",
    },
    {
      id: "estados",
      label: "Estados",
      text: "Inclua os estados de hover e de foco visível no botão.",
      guess: "se o botão reage ao cursor e ao teclado (não reage)",
    },
    {
      id: "formato",
      label: "Formato",
      text: "Devolva só o componente em React com Tailwind, sem explicações.",
      guess: "o formato da resposta (veio com três parágrafos de conversa)",
    },
  ],
  params: [
    { id: "largura", label: "Largura máxima", options: ["390 px", "320 px", "480 px"] },
    { id: "cor", label: "Cor do botão", options: ["verde-água", "rosa", "azul"] },
    { id: "raio", label: "Raio dos cantos", options: ["12 px", "0 px", "20 px"] },
  ],
  initialFragments: ["conteudo"],
  content: {
    eyebrow: "Minicurso",
    title: "Do Figma ao código com IA",
    author: "por Rafael Souza",
    meta: "6 aulas · 58 min",
    action: "Começar",
  },
});

export function createInitialPromptState(scenario: PlaygroundScenario): PromptState {
  return { enabled: [...scenario.initialFragments], values: { largura: 0, cor: 0, raio: 0 } };
}

/** Prompt vago (nenhum trecho) e prompt completo (todos), para o "antes e depois". */
export function createEdgePromptStates(): { vague: PromptState; precise: PromptState } {
  const values = { largura: 0, cor: 0, raio: 0 };
  return { vague: { enabled: [], values }, precise: { enabled: [...fragmentIds], values } };
}

export function getParam(scenario: PlaygroundScenario, id: ParamId) {
  const param = scenario.params.find((item) => item.id === id);
  if (!param) throw new Error(`Parâmetro desconhecido: ${id}`);
  return param;
}

export function getParamValue(scenario: PlaygroundScenario, state: PromptState, id: ParamId) {
  const { options } = getParam(scenario, id);
  return options[state.values[id] % options.length];
}

export type FragmentPart = { type: "text"; value: string } | { type: "param"; id: ParamId };

/** Quebra o texto do trecho em partes fixas e valores trocáveis (`{largura}`). */
export function splitFragmentText(text: string): FragmentPart[] {
  return text
    .split(/(\{[a-z]+\})/)
    .filter((piece) => piece.length > 0)
    .map((piece): FragmentPart => {
      const id = paramIdSchema.safeParse(piece.slice(1, -1));
      return piece.startsWith("{") && id.success ? { type: "param", id: id.data } : { type: "text", value: piece };
    });
}

/** Prompt em texto corrido, como seria colado numa IA de código. */
export function buildPromptText(scenario: PlaygroundScenario, state: PromptState) {
  const fragments = scenario.fragments
    .filter((fragment) => state.enabled.includes(fragment.id))
    .map((fragment) =>
      splitFragmentText(fragment.text)
        .map((part) => (part.type === "text" ? part.value : getParamValue(scenario, state, part.id)))
        .join(""),
    );
  return [scenario.basePrompt, ...fragments].join(" ");
}

/** Classes do Tailwind que cada valor vira no código "gerado". */
const widthClass = ["max-w-[390px]", "max-w-[320px]", "max-w-[480px]"];
const colorClass = ["bg-acao", "bg-pratica", "bg-comunidade"];
const radiusClass = ["rounded-xl", "rounded-none", "rounded-[20px]"];

export type OutputLine = { text: string; kind: "codigo" | "conversa" };

/**
 * Resposta simulada da IA em linhas. Sem o trecho "formato" ela vem embrulhada
 * em conversa; cada outro trecho troca palpites por classes específicas.
 */
export function buildOutput(scenario: PlaygroundScenario, state: PromptState): OutputLine[] {
  const has = (id: FragmentId) => state.enabled.includes(id);
  const { content } = scenario;
  const radius = has("tokens") ? radiusClass[state.values.raio] : "rounded-3xl";
  const width = has("medidas") ? ` w-full ${widthClass[state.values.largura]}` : " w-full";
  const surface = has("tokens") ? "border border-linha bg-fundo" : "bg-white shadow-2xl";
  const align = has("hierarquia") ? "" : " text-center";

  const titleClass = has("hierarquia") ? "text-xl font-semibold tracking-tight" : "text-base font-bold";
  const metaClass = has("hierarquia") ? "text-[13px] text-texto-secundario" : "text-base";

  const buttonClasses = [
    has("medidas") ? "h-11 w-full" : "h-7 px-3",
    has("tokens") ? `${radius} ${colorClass[state.values.cor]} text-tinta` : "rounded-full bg-violet-500 text-white",
    "font-semibold",
    ...(has("estados") ? ["hover:opacity-90", "focus-visible:ring-2 focus-visible:ring-texto"] : []),
  ].join(" ");

  const code: string[] = [
    "export function CourseCard() {",
    "  return (",
    `    <article className="${radius}${width} ${surface} p-5${align}">`,
    ...(has("conteudo")
      ? [
          `      <p className="${metaClass}">${content.eyebrow}</p>`,
          `      <h3 className="${titleClass}">${content.title}</h3>`,
          `      <p className="${metaClass}">${content.author} · ${content.meta}</p>`,
        ]
      : [
          `      <h3 className="${titleClass}">Título do card</h3>`,
          `      <p className="${metaClass}">Lorem ipsum dolor sit amet.</p>`,
        ]),
    `      <button className="${buttonClasses}">`,
    `        ${has("conteudo") ? content.action : "Clique aqui"}`,
    "      </button>",
    "    </article>",
    "  );",
    "}",
  ];

  const codeLines = code.map((text): OutputLine => ({ text, kind: "codigo" }));
  if (has("formato")) return codeLines;

  return [
    { text: "Claro! Aqui está um card de curso bonito e moderno.", kind: "conversa" },
    { text: "Usei um visual limpo, com cores vibrantes para chamar atenção:", kind: "conversa" },
    { text: "", kind: "conversa" },
    ...codeLines,
    { text: "", kind: "conversa" },
    { text: "Se quiser, posso adicionar animações, modo escuro ou mais variações!", kind: "conversa" },
  ];
}
