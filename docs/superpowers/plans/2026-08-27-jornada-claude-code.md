# Jornada Claude Code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a rota `/jornada` — uma página estática dentro do projeto Next.js do TCC que mostra, como uma timeline horizontal, a curva de aprendizado do autor com o Claude Code (cursos + projetos), com rolagem lateral acionável pela roda do mouse.

**Architecture:** Server Components para todo o conteúdo estático (dados vêm de um módulo tipado com Zod em `lib/data/`); um único Client Component (`ScrollShell`) só para o comportamento de rolagem lateral via wheel, recebendo o conteúdo já renderizado no servidor como `children`. Sem banco de dados, sem Server Actions.

**Tech Stack:** Next.js 16 (App Router, Server Components), Tailwind CSS 4 (tokens via `@theme inline`), Zod 4, `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-08-27-jornada-claude-code-design.md`

## Global Constraints

- Sem framework de testes neste projeto (`package.json` não tem `test` script nem `vitest`/`jest`). Verificação por tarefa = `npm run type-check`, `npm run lint`, e checagem manual via `npm run dev` — não invente um test runner novo.
- `PageProps`/`LayoutProps` gerados (`.next/dev/types/routes.d.ts`) **não são usados** neste plano — a rota não tem parâmetros dinâmicos, então `page.tsx` não recebe props e não precisamos rodar build antes do type-check por causa disso.
- NUNCA usar `any` explícito — usar `unknown` + type guard quando necessário.
- Tailwind only — sem CSS inline, sem styled-components.
- Toda nova cor/fonte usada como classe Tailwind precisa antes existir como token no bloco `@theme inline` de `app/globals.css` (Tailwind 4 é CSS-first).
- Classe Tailwind dinâmica (`bg-tone-${tone}`) não funciona — todo mapeamento de status/kind para classe é feito via objeto literal (`Record<.... , string>`), nunca template string.
- Nomes de arquivo em kebab-case; componentes em PascalCase; pasta de componentes de página com underscore (`_components/`).
- Server Component por padrão — só `'use client'` onde há estado/efeito/evento de fato (neste plano, só em `scroll-shell.tsx`).
- Import de módulos do projeto via alias `@/*` (raiz do projeto), conforme `tsconfig.json`.

---

### Task 1: Dados da jornada (schema + conteúdo)

**Files:**
- Create: `lib/data/learning-journey.ts`

**Interfaces:**
- Produces: `learningJourney: Journey` (default export nomeado), e os tipos `Journey`, `Branch`, `BranchStatus`, `Commit`, `CommitKind`, `TrunkItem` — usados por todas as tarefas seguintes.

- [ ] **Step 1: Criar o arquivo de dados**

Crie `lib/data/learning-journey.ts` com o conteúdo abaixo (schema Zod validado no topo do módulo, seguido do conteúdo real da jornada):

```ts
import { z } from "zod";

const branchStatusSchema = z.enum(["concluido", "ativo", "insight", "nao-iniciado"]);
const commitKindSchema = z.enum(["default", "flag", "insight"]);

const commitSchema = z.object({
  label: z.string(),
  description: z.string(),
  kind: commitKindSchema.default("default"),
});

const branchSchema = z.object({
  id: z.string(),
  name: z.string(),
  meta: z.string(),
  metaHref: z.string().url().optional(),
  status: branchStatusSchema,
  intro: z.string(),
  commits: z.array(commitSchema),
  openNote: z.string().optional(),
  reflection: z.string().optional(),
});

const trunkItemSchema = z.object({
  label: z.string(),
  before: z.string(),
  after: z.string(),
});

const sourceSchema = z.object({
  label: z.string(),
  href: z.string().url(),
});

const journeySchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubhead: z.string(),
  startDate: z.string(),
  updatedDate: z.string(),
  branches: z.array(branchSchema).min(1),
  trunkItems: z.array(trunkItemSchema).min(1),
  sources: z.array(sourceSchema),
});

export type BranchStatus = z.infer<typeof branchStatusSchema>;
export type CommitKind = z.infer<typeof commitKindSchema>;
export type Commit = z.infer<typeof commitSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type TrunkItem = z.infer<typeof trunkItemSchema>;
export type Journey = z.infer<typeof journeySchema>;

export const learningJourney: Journey = journeySchema.parse({
  heroEyebrow: "registro pessoal · desde 9 de agosto de 2026",
  heroTitle: "Pensar antes de commitar.",
  heroSubhead:
    "Um grafo de commits em vez de um mapa mental: cada estação abaixo é um curso ou um projeto onde venho aprendendo, na prática, a trabalhar com o Claude Code. Do primeiro curso até descobrir que o diferencial de um designer nessa relação não é saber programar — é saber estruturar o pensamento antes de conversar com a ferramenta.",
  startDate: "9 de agosto de 2026",
  updatedDate: "27 de agosto de 2026",
  branches: [
    {
      id: "curso-udemy",
      name: "Curso Udemy",
      meta: "curso · Claude Code do zero ao avançado",
      metaHref: "https://www.udemy.com/course/claude-code-do-zero-ao-avancado/",
      status: "concluido",
      intro:
        "Primeiro contato com o Claude Code — o ponto de partida de toda a jornada, ainda dentro de um curso introdutório sobre geração de código com IA.",
      commits: [
        {
          label: "agentes & comandos",
          description:
            "Entender o que são agentes dentro do Claude Code, os comandos disponíveis e para que serve cada função.",
          kind: "default",
        },
        {
          label: "hooks",
          description:
            "Primeiro contato com hooks — automações que disparam em resposta a eventos do próprio Claude Code.",
          kind: "default",
        },
        {
          label: "claude.md",
          description:
            "Entender a função do arquivo CLAUDE.md como memória e instrução persistente do projeto.",
          kind: "default",
        },
        {
          label: "integração no vs code",
          description:
            "Configurar o Claude Code para uso diário dentro do VS Code — interface que sigo usando até hoje por dar mais liberdade visual do que o terminal puro.",
          kind: "default",
        },
      ],
    },
    {
      id: "hocus-pocus",
      name: "Hocus Pocus",
      meta: "projeto para uma empresa · em desenvolvimento",
      status: "ativo",
      intro:
        "Nasceu logo depois do curso, aplicando o que tinha sido aprendido — mas cresceu muito além de um exercício. Hoje é um projeto real, sendo desenvolvido para uma empresa, e segue em andamento. É totalmente separado do curso: não é o exercício dele, é maior e independente.",
      commits: [
        {
          label: "primeira aplicação",
          description:
            "Construir uma aplicação web bem simples só para testar até onde ia o potencial do Claude Code.",
          kind: "default",
        },
        {
          label: "crescimento contínuo",
          description:
            "O escopo e o conhecimento sobre o Claude Code foram crescendo junto com o projeto, que segue em desenvolvimento até hoje.",
          kind: "default",
        },
      ],
    },
    {
      id: "curso-elite",
      name: "Curso EliteDaIA",
      meta: "curso · segurança web + vibe coding",
      metaHref: "https://elitedaia.com.br",
      status: "concluido",
      intro:
        'Segundo curso, focado em segurança web e em programar no estilo "vibe coding" — sem ser, de fato, programador.',
      commits: [
        {
          label: "revisão, não novidade",
          description:
            "Boa parte dos processos do Claude Code já tinha sido vista no curso anterior — pouco ganho novo por aqui.",
          kind: "default",
        },
        {
          label: "segurança",
          description:
            "Aprender a identificar e corrigir vulnerabilidades em código, mesmo sem saber programar profissionalmente.",
          kind: "default",
        },
        {
          label: "deploy real",
          description: "Colocar um site no ar de verdade: Hostinger + VPS para hospedagem.",
          kind: "default",
        },
        {
          label: "dados de cliente",
          description:
            "Entender como funciona o armazenamento de dados de um sistema para os clientes que o usariam.",
          kind: "default",
        },
      ],
      openNote: "em aberto: ainda não entendo bem backend",
    },
    {
      id: "tcc",
      name: "TCC (pesquisa)",
      meta: "pesquisa acadêmica · branch ativa — você está aqui",
      status: "ativo",
      intro:
        "Aplicar o Claude Code na própria pesquisa do TCC: da busca de referências à formalização do texto final.",
      commits: [
        { label: "fontes", description: "Buscar fontes e referências para embasar a pesquisa.", kind: "default" },
        {
          label: "estrutura da pesquisa",
          description:
            "Mapear o que eu queria descobrir e pedir ajuda para transformar isso numa investigação organizada.",
          kind: "default",
        },
        {
          label: "formalização em abnt",
          description:
            "Pedir para transformar o que já tinha sido discutido em um documento Word formatado nas normas ABNT.",
          kind: "default",
        },
        {
          label: "esta página",
          description: "Documentar a própria curva de aprendizado — a timeline que você está vendo agora.",
          kind: "default",
        },
      ],
    },
    {
      id: "bruno-higashis-mind",
      name: "Bruno Higashi's Mind",
      meta: "projeto pessoal · sistema gamificado de rotina e tarefas",
      status: "insight",
      intro:
        "Projeto pessoal para testar até onde a IA agêntica vai dentro do processo criativo — e onde veio a lição mais importante da jornada até aqui.",
      commits: [
        {
          label: "erro de escopo",
          description:
            "Descrevi a ideia de forma genérica demais. Resultado: muito crédito gasto e o projeto não saiu do lugar, sem chegar no que eu queria.",
          kind: "flag",
        },
        {
          label: "gestão de tokens — a ficha caiu",
          description:
            'Percebi que ir "no seco" — sem estruturar bem o pedido, por preguiça de explicar o que já sabia na cabeça — encarece e complica tudo. Foi aqui que entendi de verdade o que é gestão de tokens.',
          kind: "default",
        },
        {
          label: "o poder do designer",
          description:
            "O diferencial não é saber programar: é a capacidade de visualizar mentalmente o processo inteiro e organizar o pensamento antes de conversar com a IA.",
          kind: "insight",
        },
        {
          label: "comunicação por voz",
          description:
            "Descobri que ditar por voz me ajuda a explicar ideias de forma mais completa e natural do que digitando.",
          kind: "default",
        },
      ],
      reflection:
        "O potencial da ferramenta está em como você chega e conversa com ela — não é sobre saber programar.",
    },
    {
      id: "producao-musical",
      name: "Produção Musical",
      meta: "projeto pessoal · ainda não iniciada",
      status: "nao-iniciado",
      intro:
        "Objetivo futuro: desenvolver plugins e softwares que ajudem no processo de produção e mixagem musical. Próxima estação a abrir.",
      commits: [],
    },
  ],
  trunkItems: [
    {
      label: "GESTÃO DE TOKENS E CONTEXTO",
      before: "gastar crédito sem entender por quê",
      after: "planejar o pedido antes de escrever, sabendo o que estou gastando e por quê",
    },
    {
      label: "ESCOLHA E DIVISÃO ENTRE AGENTES",
      before: "usar um agente genérico para tudo",
      after: "entender quando vale separar tarefas entre agentes especializados",
    },
    {
      label: "ORGANIZAÇÃO DE PROJETO",
      before: "pastas improvisadas, herdadas de um curso",
      after: "estrutura pensada para o que cada projeto realmente precisa",
    },
  ],
  sources: [
    {
      label: "Udemy — Claude Code do zero ao avançado",
      href: "https://www.udemy.com/course/claude-code-do-zero-ao-avancado/",
    },
    { label: "EliteDaIA", href: "https://elitedaia.com.br" },
  ],
});
```

- [ ] **Step 2: Rodar o type-check**

Run: `npm run type-check`
Expected: sem erros. Se o Zod acusar erro de shape em algum branch (ex: `metaHref` inválido), corrija o dado, não o schema.

- [ ] **Step 3: Commit**

```bash
git add lib/data/learning-journey.ts
git commit -m "feat(jornada): add typed learning journey content"
```

---

### Task 2: Tokens de design em `app/globals.css`

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: classes Tailwind `bg-journey-*`, `text-journey-*`, `border-journey-*`, `font-journey-mono`, `font-journey-serif` — usadas por todos os componentes de `/jornada` a partir da Task 3.

- [ ] **Step 1: Adicionar os tokens ao bloco `@theme inline`**

No arquivo `app/globals.css`, dentro do bloco `@theme inline` (o mesmo que já tem `--color-primary: var(--primary);` etc.), adicione estas linhas antes do `}` que fecha o bloco (linha 48 no arquivo atual):

```css
  --color-journey-paper: var(--journey-paper);
  --color-journey-surface: var(--journey-surface);
  --color-journey-ink: var(--journey-ink);
  --color-journey-ink-soft: var(--journey-ink-soft);
  --color-journey-line: var(--journey-line);
  --color-journey-line-strong: var(--journey-line-strong);
  --color-journey-accent: var(--journey-accent);
  --color-journey-accent-soft: var(--journey-accent-soft);
  --color-journey-warm: var(--journey-warm);
  --color-journey-warm-soft: var(--journey-warm-soft);
  --color-journey-flag: var(--journey-flag);
  --color-journey-flag-soft: var(--journey-flag-soft);
  --font-journey-mono: var(--font-space-mono);
  --font-journey-serif: var(--font-newsreader);
```

- [ ] **Step 2: Adicionar os valores claros ao bloco `:root`**

Dentro do bloco `:root { ... }` (o que já tem `--background: #ffffff;` etc.), adicione antes do `}` que fecha o bloco:

```css
  --journey-paper: #edefe9;
  --journey-surface: #f7f8f3;
  --journey-ink: #1f2420;
  --journey-ink-soft: #56615b;
  --journey-line: #c9cfc3;
  --journey-line-strong: #a9b29f;
  --journey-accent: #2b6e63;
  --journey-accent-soft: #dce7e1;
  --journey-warm: #c97a2e;
  --journey-warm-soft: #f3e1cb;
  --journey-flag: #b0492e;
  --journey-flag-soft: #f1dad1;
```

- [ ] **Step 3: Adicionar os valores escuros ao bloco `.dark`**

Dentro do bloco `.dark { ... }`, adicione antes do `}` que fecha o bloco:

```css
  --journey-paper: #141815;
  --journey-surface: #1b211d;
  --journey-ink: #e7e9e1;
  --journey-ink-soft: #9aa398;
  --journey-line: #2b322c;
  --journey-line-strong: #3a4339;
  --journey-accent: #5fbfae;
  --journey-accent-soft: #1e332e;
  --journey-warm: #e3a55a;
  --journey-warm-soft: #3a2e1c;
  --journey-flag: #e08668;
  --journey-flag-soft: #3a241c;
```

- [ ] **Step 4: Rodar o build para confirmar que o Tailwind aceita os tokens novos**

Run: `npm run build`
Expected: build conclui sem erro (o conteúdo visual ainda não usa essas classes — essa etapa só garante que o CSS é válido).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(jornada): add journey color and font design tokens"
```

---

### Task 3: Página base com Hero

**Files:**
- Create: `app/jornada/_components/hero.tsx`
- Create: `app/jornada/page.tsx`

**Interfaces:**
- Consumes: `learningJourney` de `@/lib/data/learning-journey` (Task 1); tokens `journey-*` (Task 2).
- Produces: rota `/jornada` acessível; componente `Hero({ journey })` reutilizado apenas aqui.

- [ ] **Step 1: Criar o componente Hero**

Crie `app/jornada/_components/hero.tsx`:

```tsx
import type { Journey } from "@/lib/data/learning-journey";

type HeroProps = {
  journey: Pick<Journey, "heroEyebrow" | "heroTitle" | "heroSubhead" | "startDate" | "updatedDate">;
};

export function Hero({ journey }: HeroProps) {
  return (
    <header className="flex flex-col gap-4 px-6 pt-16 pb-10 sm:px-10">
      <p className="font-journey-mono text-xs tracking-[0.08em] text-journey-ink-soft uppercase">
        {journey.heroEyebrow}
      </p>
      <h1 className="font-journey-mono text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {journey.heroTitle}
      </h1>
      <p className="max-w-[62ch] text-lg text-journey-ink-soft">{journey.heroSubhead}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-journey-line pt-3 font-journey-mono text-xs text-journey-ink-soft">
        <span>autor: Bruno Higashi</span>
        <span>início: {journey.startDate}</span>
        <span>última atualização: {journey.updatedDate}</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Criar a página**

Crie `app/jornada/page.tsx`:

```tsx
import { Newsreader, Space_Mono } from "next/font/google";

import { learningJourney } from "@/lib/data/learning-journey";
import { Hero } from "./_components/hero";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function JornadaPage() {
  return (
    <div
      className={`${spaceMono.variable} ${newsreader.variable} flex min-h-screen flex-col bg-journey-paper font-journey-serif text-journey-ink`}
    >
      <Hero journey={learningJourney} />
      <footer className="flex flex-col gap-2 px-6 py-10 font-journey-mono text-xs text-journey-ink-soft sm:px-10">
        <span>
          Cronologia reconstruída a partir de relato pessoal em 27/08/2026 — datas dentro do
          período são aproximadas.
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {learningJourney.sources.map((source) => (
            <a key={source.href} href={source.href} className="underline underline-offset-2">
              {source.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Rodar type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 4: Rodar o servidor e conferir a rota**

Run:
```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:3000/jornada | grep -o "Pensar antes de commitar"
kill $DEV_PID
```
Expected: a saída do `curl` imprime `Pensar antes de commitar` (confirma que a página renderiza sem erro 500). Abra `http://localhost:3000/jornada` no navegador para conferir visualmente o fundo (`journey-paper`), a tipografia mono no título e o rodapé com os dois links dos cursos.

- [ ] **Step 5: Commit**

```bash
git add app/jornada/page.tsx app/jornada/_components/hero.tsx
git commit -m "feat(jornada): add hero section and base route"
```

---

### Task 4: Seção "commits no tronco"

**Files:**
- Create: `app/jornada/_components/trunk-commits.tsx`
- Modify: `app/jornada/page.tsx`

**Interfaces:**
- Consumes: `learningJourney.trunkItems` (Task 1).
- Produces: componente `TrunkCommits({ items })`.

- [ ] **Step 1: Criar o componente**

Crie `app/jornada/_components/trunk-commits.tsx`:

```tsx
import type { TrunkItem } from "@/lib/data/learning-journey";

export function TrunkCommits({ items }: { items: TrunkItem[] }) {
  return (
    <section className="flex flex-col gap-6 px-6 py-16 sm:px-10">
      <div className="flex flex-col gap-1">
        <h2 className="font-journey-mono text-sm tracking-[0.03em] text-journey-ink-soft uppercase">
          commits no tronco
        </h2>
        <p className="max-w-[64ch] text-sm text-journey-ink-soft">
          Aprendizados que não pertencem a um projeto só — atravessam todas as estações.
        </p>
      </div>
      <dl className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 border-b border-journey-line py-5 last:border-b-0 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-5"
          >
            <dt className="font-journey-mono text-xs tracking-[0.06em] text-journey-ink-soft uppercase sm:col-span-3">
              {item.label}
            </dt>
            <dd className="text-sm text-journey-ink-soft italic">{item.before}</dd>
            <span className="hidden font-journey-mono text-journey-accent sm:block" aria-hidden>
              →
            </span>
            <dd className="text-sm text-journey-ink">{item.after}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 2: Ligar o componente na página**

Em `app/jornada/page.tsx`, adicione o import e o uso do componente:

```tsx
import { TrunkCommits } from "./_components/trunk-commits";
```

E troque:
```tsx
      <Hero journey={learningJourney} />
      <footer
```
por:
```tsx
      <Hero journey={learningJourney} />
      <TrunkCommits items={learningJourney.trunkItems} />
      <footer
```

- [ ] **Step 3: Rodar type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 4: Conferir visualmente**

Run:
```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:3000/jornada | grep -o "GESTÃO DE TOKENS E CONTEXTO"
kill $DEV_PID
```
Expected: a saída imprime o texto do label. Abra no navegador e confirme que as 3 linhas "de → para" aparecem entre o hero e o rodapé.

- [ ] **Step 5: Commit**

```bash
git add app/jornada/_components/trunk-commits.tsx app/jornada/page.tsx
git commit -m "feat(jornada): add cross-cutting trunk commits section"
```

---

### Task 5: `BranchStation` + `HorizontalTimeline` (rolagem nativa, sem JS)

**Files:**
- Create: `app/jornada/_components/branch-station.tsx`
- Create: `app/jornada/_components/horizontal-timeline.tsx`
- Modify: `app/jornada/page.tsx`

**Interfaces:**
- Consumes: `Branch`, `Commit`, `CommitKind` de `@/lib/data/learning-journey`; `cn` de `@/lib/utils`.
- Produces: `BranchStation({ branch })`, `HorizontalTimeline({ branches })` — este último é importado por `page.tsx` e, na Task 6, por sua vez importará `ScrollShell`.

Ao final desta tarefa, a timeline já é totalmente utilizável por rolagem lateral nativa (touchpad de dois dedos, touch no celular, Shift+roda do mouse, ou arrastando a barra de rolagem) — a Task 6 só adiciona a conversão da roda do mouse vertical.

- [ ] **Step 1: Criar `branch-station.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { Branch, CommitKind } from "@/lib/data/learning-journey";

const STATUS_STYLES: Record<Branch["status"], { border: string; text: string; dot: string }> = {
  concluido: {
    border: "border-journey-line-strong",
    text: "text-journey-ink-soft",
    dot: "bg-journey-line-strong",
  },
  ativo: {
    border: "border-journey-accent",
    text: "text-journey-accent",
    dot: "bg-journey-accent",
  },
  insight: {
    border: "border-journey-warm",
    text: "text-journey-warm",
    dot: "bg-journey-warm",
  },
  "nao-iniciado": {
    border: "border-dashed border-journey-ink-soft",
    text: "text-journey-ink-soft",
    dot: "border-2 border-journey-ink-soft bg-journey-paper",
  },
};

function commitDotClass(branchStatus: Branch["status"], kind: CommitKind) {
  if (kind === "flag") return "bg-journey-flag";
  if (kind === "insight") return "bg-journey-warm";
  return STATUS_STYLES[branchStatus].dot;
}

export function BranchStation({ branch }: { branch: Branch }) {
  const styles = STATUS_STYLES[branch.status];

  return (
    <div
      className={cn(
        "flex w-[320px] flex-col gap-3 rounded-lg border bg-journey-surface p-5 shadow-sm sm:w-[360px]",
        styles.border,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="font-journey-mono text-base font-bold text-journey-ink">{branch.name}</span>
        {branch.metaHref ? (
          <a
            href={branch.metaHref}
            className={cn("font-journey-mono text-xs underline underline-offset-2", styles.text)}
          >
            {branch.meta}
          </a>
        ) : (
          <span className={cn("font-journey-mono text-xs", styles.text)}>{branch.meta}</span>
        )}
      </div>
      <p className="text-sm text-journey-ink-soft">{branch.intro}</p>
      {branch.commits.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {branch.commits.map((commit) => (
            <li key={commit.label} className="flex gap-2.5">
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  commitDotClass(branch.status, commit.kind),
                )}
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-journey-mono text-xs font-bold text-journey-ink">
                  {commit.label}
                </span>
                <span className="text-sm text-journey-ink-soft">{commit.description}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {branch.openNote ? (
        <span className="w-fit rounded-full bg-journey-flag-soft px-2.5 py-1 font-journey-mono text-[0.68rem] tracking-wide text-journey-flag uppercase">
          {branch.openNote}
        </span>
      ) : null}
      {branch.reflection ? (
        <p className="border-l-2 border-journey-warm pl-3 text-sm text-journey-ink italic">
          {branch.reflection}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Criar `horizontal-timeline.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { Branch } from "@/lib/data/learning-journey";
import { BranchStation } from "./branch-station";

const STATUS_DOT: Record<Branch["status"], string> = {
  concluido: "bg-journey-line-strong",
  ativo: "bg-journey-accent",
  insight: "bg-journey-warm",
  "nao-iniciado": "border-2 border-journey-ink-soft bg-journey-paper",
};

export function HorizontalTimeline({ branches }: { branches: Branch[] }) {
  return (
    <section
      aria-label="Linha do tempo horizontal da jornada com o Claude Code"
      className="relative h-[75vh] w-full overflow-x-auto overflow-y-hidden border-y border-journey-line bg-journey-paper"
    >
      <div className="relative flex h-full w-max items-stretch px-16">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-journey-line-strong" />
        {branches.map((branch, index) => (
          <div key={branch.id} className="flex h-full w-[340px] shrink-0 flex-col items-center">
            <div className="flex flex-1 items-end justify-center pb-3">
              {index % 2 === 0 ? <BranchStation branch={branch} /> : null}
            </div>
            <div className="relative flex w-full items-center justify-center">
              <span className="h-4 w-px bg-journey-line-strong" aria-hidden />
              <span
                className={cn("absolute size-3 rounded-full", STATUS_DOT[branch.status])}
                aria-hidden
              />
            </div>
            <div className="flex flex-1 items-start justify-center pt-3">
              {index % 2 !== 0 ? <BranchStation branch={branch} /> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Ligar na página**

Em `app/jornada/page.tsx`, adicione o import:

```tsx
import { HorizontalTimeline } from "./_components/horizontal-timeline";
```

E troque:
```tsx
      <Hero journey={learningJourney} />
      <TrunkCommits items={learningJourney.trunkItems} />
```
por:
```tsx
      <Hero journey={learningJourney} />
      <HorizontalTimeline branches={learningJourney.branches} />
      <TrunkCommits items={learningJourney.trunkItems} />
```

- [ ] **Step 4: Rodar type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 5: Conferir visualmente a rolagem nativa**

Run:
```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:3000/jornada | grep -o "Hocus Pocus"
kill $DEV_PID
```
Expected: a saída imprime `Hocus Pocus`. Abra no navegador, use o touchpad (dois dedos) ou Shift+roda do mouse sobre a seção da timeline e confirme que rola lateralmente, mostrando as 6 estações alternando acima/abaixo da linha central.

- [ ] **Step 6: Commit**

```bash
git add app/jornada/_components/branch-station.tsx app/jornada/_components/horizontal-timeline.tsx app/jornada/page.tsx
git commit -m "feat(jornada): add horizontal timeline with native scroll"
```

---

### Task 6: `ScrollShell` — rolagem pela roda do mouse + acessibilidade

**Files:**
- Create: `app/jornada/_components/scroll-shell.tsx`
- Modify: `app/jornada/_components/horizontal-timeline.tsx`

**Interfaces:**
- Produces: `ScrollShell({ children, "aria-label": string })` — único Client Component da rota.
- Consumes (em `horizontal-timeline.tsx`): `ScrollShell`.

- [ ] **Step 1: Criar `scroll-shell.tsx`**

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollShellProps = {
  children: ReactNode;
  "aria-label": string;
};

export function ScrollShell({ children, "aria-label": ariaLabel }: ScrollShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function handleWheel(event: WheelEvent) {
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollingForward = event.deltaY > 0;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= maxScrollLeft - 1;

      if ((scrollingForward && atEnd) || (!scrollingForward && atStart)) {
        return;
      }

      event.preventDefault();
      container.scrollLeft += event.deltaY;
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      className="h-full w-full overflow-x-auto overflow-y-hidden focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-accent"
    >
      {children}
    </div>
  );
}
```

Por que `atEnd`/`atStart` liberam o evento: quando o usuário já chegou numa borda da timeline e continua rolando na mesma direção, o handler não chama `preventDefault()` — o navegador então trata o scroll normalmente, rolando a página para baixo. Quando `prefers-reduced-motion: reduce` está ativo, o listener nem é registrado: a seção continua rolável (touch, touchpad, teclado, barra de rolagem), só não sequestra a roda do mouse vertical.

- [ ] **Step 2: Usar `ScrollShell` dentro de `horizontal-timeline.tsx`**

Substitua todo o conteúdo de `app/jornada/_components/horizontal-timeline.tsx` por:

```tsx
import { cn } from "@/lib/utils";
import type { Branch } from "@/lib/data/learning-journey";
import { BranchStation } from "./branch-station";
import { ScrollShell } from "./scroll-shell";

const STATUS_DOT: Record<Branch["status"], string> = {
  concluido: "bg-journey-line-strong",
  ativo: "bg-journey-accent",
  insight: "bg-journey-warm",
  "nao-iniciado": "border-2 border-journey-ink-soft bg-journey-paper",
};

export function HorizontalTimeline({ branches }: { branches: Branch[] }) {
  return (
    <section
      aria-label="Linha do tempo horizontal da jornada com o Claude Code"
      className="relative h-[75vh] w-full border-y border-journey-line bg-journey-paper"
    >
      <ScrollShell aria-label="Linha do tempo horizontal da jornada com o Claude Code">
        <div className="relative flex h-full w-max items-stretch px-16">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-journey-line-strong" />
          {branches.map((branch, index) => (
            <div key={branch.id} className="flex h-full w-[340px] shrink-0 flex-col items-center">
              <div className="flex flex-1 items-end justify-center pb-3">
                {index % 2 === 0 ? <BranchStation branch={branch} /> : null}
              </div>
              <div className="relative flex w-full items-center justify-center">
                <span className="h-4 w-px bg-journey-line-strong" aria-hidden />
                <span
                  className={cn("absolute size-3 rounded-full", STATUS_DOT[branch.status])}
                  aria-hidden
                />
              </div>
              <div className="flex flex-1 items-start justify-center pt-3">
                {index % 2 !== 0 ? <BranchStation branch={branch} /> : null}
              </div>
            </div>
          ))}
        </div>
      </ScrollShell>
    </section>
  );
}
```

A única mudança em relação à Task 5 é: o `<section>` perde `overflow-x-auto overflow-y-hidden` do `className` (isso agora vive dentro do `ScrollShell`), e a `<div>` com a linha do tronco e as estações passa a ser filha de `<ScrollShell>` em vez de filha direta do `<section>`.

- [ ] **Step 3: Rodar type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 4: Testar a rolagem pela roda do mouse e a liberação nas bordas**

Run:
```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:3000/jornada | grep -o "Bruno Higashi&#x27;s Mind\|Bruno Higashi's Mind"
kill $DEV_PID
```
Expected: a saída confirma que o texto ainda está no HTML renderizado no servidor (prova de que `BranchStation` continua Server Component, mesmo dentro do `ScrollShell` client). No navegador (com mouse de roda, não touchpad): passe o cursor sobre a timeline e use a roda normalmente — deve rolar de lado. Continue rolando até o fim — a página deve voltar a rolar para baixo normalmente. Em "Configurações do sistema" ative "reduzir movimento" e recarregue: a roda do mouse não deve mais rolar a timeline lateralmente (mas touch/touchpad/teclado continuam funcionando).

- [ ] **Step 5: Commit**

```bash
git add app/jornada/_components/scroll-shell.tsx app/jornada/_components/horizontal-timeline.tsx
git commit -m "feat(jornada): convert wheel scroll to horizontal with edge release"
```

---

### Task 7: Barra de progresso

**Files:**
- Modify: `app/jornada/_components/scroll-shell.tsx`

**Interfaces:**
- Nenhuma mudança de interface pública — `ScrollShell` continua recebendo os mesmos props.

- [ ] **Step 1: Adicionar o estado de progresso e a barra**

Substitua todo o conteúdo de `app/jornada/_components/scroll-shell.tsx` por:

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollShellProps = {
  children: ReactNode;
  "aria-label": string;
};

export function ScrollShell({ children, "aria-label": ariaLabel }: ScrollShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateProgress() {
      if (!container) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setProgress(maxScrollLeft > 0 ? container.scrollLeft / maxScrollLeft : 0);
    }

    updateProgress();
    container.addEventListener("scroll", updateProgress, { passive: true });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let handleWheel: ((event: WheelEvent) => void) | undefined;

    if (!prefersReducedMotion) {
      handleWheel = (event: WheelEvent) => {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScrollLeft = scrollWidth - clientWidth;
        const scrollingForward = event.deltaY > 0;
        const atStart = scrollLeft <= 0;
        const atEnd = scrollLeft >= maxScrollLeft - 1;

        if ((scrollingForward && atEnd) || (!scrollingForward && atStart)) {
          return;
        }

        event.preventDefault();
        container.scrollLeft += event.deltaY;
      };
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      container.removeEventListener("scroll", updateProgress);
      if (handleWheel) container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        className="h-full w-full overflow-x-auto overflow-y-hidden focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-accent"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-journey-line">
        <div
          className="h-full bg-journey-accent transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rodar type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Conferir visualmente**

Run:
```bash
npm run dev
```
Abra `http://localhost:3000/jornada`, role a timeline de ponta a ponta e confirme que a barrinha fina na base da seção cresce de 0% a 100% acompanhando a posição. Pare o servidor com Ctrl+C ao terminar.

- [ ] **Step 4: Commit**

```bash
git add app/jornada/_components/scroll-shell.tsx
git commit -m "feat(jornada): add scroll progress bar to timeline"
```

---

### Task 8: Revisão final

**Files:**
- Nenhum arquivo novo — apenas verificação e pequenos ajustes se algo for encontrado.

- [ ] **Step 1: Type-check e lint completos do projeto**

Run: `npm run type-check && npm run lint`
Expected: sem erros em nenhum arquivo do projeto (não só `/jornada`).

- [ ] **Step 2: Build de produção**

Run: `npm run build`
Expected: build conclui com sucesso, incluindo a rota `/jornada` na listagem de rotas geradas.

- [ ] **Step 3: Checklist manual no navegador**

Com `npm run dev` rodando, em `http://localhost:3000/jornada`, confirme:
- As 6 estações aparecem na ordem: Curso Udemy → Hocus Pocus → Curso EliteDaIA → TCC → Bruno Higashi's Mind → Produção Musical.
- Cores por status: cinza para os dois cursos, verde para Hocus Pocus e TCC, âmbar para Bruno Higashi's Mind, tracejado/vazado para Produção Musical.
- A tag "em aberto: ainda não entendo bem backend" aparece no card do Curso EliteDaIA.
- A reflexão em itálico aparece no card do Bruno Higashi's Mind, sem aspas de citação.
- Os links dos dois cursos (Udemy e EliteDaIA) abrem as URLs corretas.
- Abra o DevTools, adicione a classe `dark` na tag `<html>` manualmente e confirme que as cores da timeline continuam legíveis (paleta escura).
- Redimensione a janela para uma largura estreita (~375px) e confirme que a página não gera scroll horizontal no `body` — só dentro da seção da timeline.

- [ ] **Step 4: Corrigir o que for encontrado e commitar**

Se qualquer item do checklist falhar, corrija o arquivo correspondente e rode novamente `npm run type-check && npm run lint` antes de commitar. Adicione **apenas os arquivos desta feature** que você de fato alterou (nunca `git add -A`/`git add .` — este repositório tem outras pastas soltas, não relacionadas, ainda não commitadas):

```bash
git add app/jornada lib/data/learning-journey.ts app/globals.css
git commit -m "fix(jornada): address final review findings"
```

Se nada for encontrado, nenhum commit é necessário nesta tarefa.
