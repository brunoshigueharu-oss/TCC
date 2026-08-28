# Jornada — redesenho Apple + correção do bug de scroll — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a página `/jornada` na identidade visual da Apple (preto/branco/cinza, tipografia de sistema, título "Progressão — Bruno Higashi") e corrigir o bug em que a rolagem trava e corta o conteúdo dos cards de baixo.

**Architecture:** Três mudanças independentes e sequenciais: (1) recalibrar tokens de cor/fonte e recolorir todos os componentes da página para grayscale puro; (2) dar à `HorizontalTimeline` um layout alternativo empilhado (para `prefers-reduced-motion`) e um teto de altura por card; (3) reescrever `ScrollShell` trocando o listener de `wheel`/`preventDefault` por um padrão de **scroll pinado** (sticky + `translateX` dirigido pelo scroll vertical nativo da página), com fallback simples para mobile.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4 (tokens via `@theme inline`), sem bibliotecas de animação.

**Spec:** `docs/superpowers/specs/2026-08-28-jornada-apple-redesign-design.md`

## Global Constraints

- Nenhuma lib de animação nova (Framer Motion etc.) — só CSS + um listener de `scroll`/`ResizeObserver`.
- `app/page.tsx` (home do site) não é tocado.
- Dark mode continua existindo só como classe `.dark` — sem toggle nesta página.
- Nenhum texto/copy da jornada é reescrito, exceto `heroTitle`.
- Sem `any` explícito (usar `unknown` + type guard se necessário) — CLAUDE.md do projeto.
- Tailwind only — sem CSS inline, sem styled-components.
- Nomes de arquivo kebab-case, componentes PascalCase (convenção já seguida nos arquivos existentes, não muda).
- Rodar `npm run type-check && npm run lint` ao final de cada task.

---

## Task 1: Identidade visual — tokens, tipografia e paleta cinza

**Files:**
- Modify: `app/globals.css:48-61` (tokens `@theme inline`), `app/globals.css:97-108` (`:root`), `app/globals.css:143-154` (`.dark`)
- Modify: `app/jornada/page.tsx`
- Modify: `app/jornada/_components/hero.tsx`
- Modify: `app/jornada/_components/trunk-commits.tsx`
- Modify: `app/jornada/_components/branch-station.tsx`
- Modify: `app/jornada/_components/horizontal-timeline.tsx:7-12` (só o mapa `STATUS_DOT`, o resto do arquivo é mexido na Task 2)
- Modify: `app/jornada/_components/scroll-shell.tsx:71,77` (só as 2 referências de cor `journey-accent` — o arquivo inteiro é reescrito na Task 3, isto é só pra não deixar uma classe Tailwind apontando pra um token removido entre as tasks)
- Modify: `lib/data/learning-journey.ts:55`

**Interfaces:**
- Produces: tokens de cor `--color-journey-{paper,surface,ink,ink-soft,line,line-strong}` e `--font-journey-sans` (usados por todas as tasks seguintes). Os tokens `--color-journey-{accent,accent-soft,warm,warm-soft,flag,flag-soft}` e `--font-journey-{mono,serif}` deixam de existir — nenhuma task seguinte pode referenciá-los.

- [ ] **Step 1: Recolorir os tokens em `app/globals.css`**

No bloco `@theme inline` (linhas 48-61), substituir:

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

por:

```css
  --color-journey-paper: var(--journey-paper);
  --color-journey-surface: var(--journey-surface);
  --color-journey-ink: var(--journey-ink);
  --color-journey-ink-soft: var(--journey-ink-soft);
  --color-journey-line: var(--journey-line);
  --color-journey-line-strong: var(--journey-line-strong);
  --font-journey-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
```

No bloco `:root` (linhas 97-108), substituir:

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

por:

```css
  --journey-paper: #f5f5f7;
  --journey-surface: #ffffff;
  --journey-ink: #1d1d1f;
  --journey-ink-soft: #6e6e73;
  --journey-line: #d2d2d7;
  --journey-line-strong: #86868b;
```

No bloco `.dark` (linhas 143-154), substituir:

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

por:

```css
  --journey-paper: #000000;
  --journey-surface: #1d1d1f;
  --journey-ink: #f5f5f7;
  --journey-ink-soft: #86868b;
  --journey-line: #424245;
  --journey-line-strong: #6e6e73;
```

- [ ] **Step 2: Atualizar `app/jornada/page.tsx`**

Substituir o arquivo inteiro por:

```tsx
import { learningJourney } from "@/lib/data/learning-journey";
import { Hero } from "./_components/hero";
import { HorizontalTimeline } from "./_components/horizontal-timeline";
import { TrunkCommits } from "./_components/trunk-commits";

export default function JornadaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-journey-paper font-journey-sans text-journey-ink">
      <Hero journey={learningJourney} />
      <HorizontalTimeline branches={learningJourney.branches} />
      <TrunkCommits items={learningJourney.trunkItems} />
      <footer className="flex flex-col gap-2 px-6 py-10 text-xs text-journey-ink-soft sm:px-10">
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

(remove os imports/instâncias de `Newsreader`/`Space_Mono` de `next/font/google`, e troca `font-journey-serif` por `font-journey-sans` no wrapper.)

- [ ] **Step 3: Atualizar `app/jornada/_components/hero.tsx`**

Substituir o arquivo inteiro por:

```tsx
import type { Journey } from "@/lib/data/learning-journey";

type HeroProps = {
  journey: Pick<Journey, "heroEyebrow" | "heroTitle" | "heroSubhead" | "startDate" | "updatedDate">;
};

export function Hero({ journey }: HeroProps) {
  return (
    <header className="flex flex-col gap-4 px-6 pt-16 pb-10 sm:px-10">
      <p className="text-xs tracking-[0.08em] text-journey-ink-soft uppercase">
        {journey.heroEyebrow}
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {journey.heroTitle}
      </h1>
      <p className="max-w-[62ch] text-lg text-journey-ink-soft">{journey.heroSubhead}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-journey-line pt-3 text-xs text-journey-ink-soft">
        <span>autor: Bruno Higashi</span>
        <span>início: {journey.startDate}</span>
        <span>última atualização: {journey.updatedDate}</span>
      </div>
    </header>
  );
}
```

(só removeu `font-journey-mono` das 3 classes — nenhuma outra mudança.)

- [ ] **Step 4: Atualizar `app/jornada/_components/trunk-commits.tsx`**

Substituir o arquivo inteiro por:

```tsx
import type { TrunkItem } from "@/lib/data/learning-journey";

export function TrunkCommits({ items }: { items: TrunkItem[] }) {
  return (
    <section className="flex flex-col gap-6 px-6 py-16 sm:px-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm tracking-[0.03em] text-journey-ink-soft uppercase">
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
            <dt className="text-xs tracking-[0.06em] text-journey-ink-soft uppercase sm:col-span-3">
              {item.label}
            </dt>
            <dd className="text-sm text-journey-ink-soft italic">{item.before}</dd>
            <span className="hidden text-journey-ink-soft sm:block" aria-hidden>
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

(removeu `font-journey-mono` das 2 classes que tinham, e trocou `text-journey-accent` por `text-journey-ink-soft` na seta.)

- [ ] **Step 5: Atualizar `app/jornada/_components/branch-station.tsx`**

Substituir o arquivo inteiro por:

```tsx
import { cn } from "@/lib/utils";
import type { Branch, CommitKind } from "@/lib/data/learning-journey";

const STATUS_STYLES: Record<
  Branch["status"],
  { border: string; text: string; dot: string; ring?: string }
> = {
  concluido: {
    border: "border-journey-line-strong",
    text: "text-journey-ink-soft",
    dot: "bg-journey-line-strong",
  },
  ativo: {
    border: "border-2 border-journey-ink",
    text: "text-journey-ink",
    dot: "bg-journey-ink",
  },
  insight: {
    border: "border-2 border-journey-ink",
    text: "text-journey-ink",
    dot: "bg-journey-ink",
    ring: "ring-2 ring-offset-2 ring-offset-journey-surface ring-journey-line-strong",
  },
  "nao-iniciado": {
    border: "border-dashed border-journey-line",
    text: "text-journey-ink-soft",
    dot: "border-2 border-journey-ink-soft bg-journey-surface",
  },
};

function commitDotClass(branchStatus: Branch["status"], kind: CommitKind) {
  if (kind === "insight") return "bg-journey-ink";
  return STATUS_STYLES[branchStatus].dot;
}

export function BranchStation({ branch }: { branch: Branch }) {
  const styles = STATUS_STYLES[branch.status];

  return (
    <div
      className={cn(
        "flex w-[320px] flex-col gap-3 rounded-lg border bg-journey-surface p-5 shadow-sm sm:w-[360px]",
        styles.border,
        styles.ring,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-journey-ink">{branch.name}</span>
        {branch.metaHref ? (
          <a
            href={branch.metaHref}
            className={cn("text-xs underline underline-offset-2", styles.text)}
          >
            {branch.meta}
          </a>
        ) : (
          <span className={cn("text-xs", styles.text)}>{branch.meta}</span>
        )}
      </div>
      <p className="text-sm text-journey-ink-soft">{branch.intro}</p>
      {branch.commits.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {branch.commits.map((commit) => (
            <li
              key={commit.label}
              className={cn(
                "flex gap-2.5 rounded-md",
                commit.kind === "insight" && "-mx-2 bg-journey-paper px-2 py-1.5",
              )}
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  commitDotClass(branch.status, commit.kind),
                )}
              />
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-xs font-bold text-journey-ink",
                    commit.kind === "flag" && "underline decoration-wavy underline-offset-4",
                  )}
                >
                  {commit.label}
                </span>
                <span className="text-sm text-journey-ink-soft">{commit.description}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {branch.openNote ? (
        <span className="w-fit rounded-full border border-journey-line px-2.5 py-1 text-[0.68rem] tracking-wide text-journey-ink-soft uppercase">
          {branch.openNote}
        </span>
      ) : null}
      {branch.reflection ? (
        <p className="border-l-2 border-journey-ink pl-3 text-sm text-journey-ink italic">
          {branch.reflection}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 6: Recolorir `STATUS_DOT` em `app/jornada/_components/horizontal-timeline.tsx`**

Substituir (linhas 7-12):

```tsx
const STATUS_DOT: Record<Branch["status"], string> = {
  concluido: "bg-journey-line-strong",
  ativo: "bg-journey-accent",
  insight: "bg-journey-warm",
  "nao-iniciado": "border-2 border-journey-ink-soft bg-journey-paper",
};
```

por:

```tsx
const STATUS_DOT: Record<Branch["status"], string> = {
  concluido: "bg-journey-line-strong",
  ativo: "bg-journey-ink",
  insight: "bg-journey-ink",
  "nao-iniciado": "border-2 border-journey-ink-soft bg-journey-paper",
};
```

Não mexer no resto do arquivo nesta task — a Task 2 reestrutura o layout.

- [ ] **Step 7: Corrigir as 2 referências de cor em `app/jornada/_components/scroll-shell.tsx`**

Trocar (linha 71):

```tsx
className="w-full overflow-x-auto focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-accent"
```

por:

```tsx
className="w-full overflow-x-auto focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-ink"
```

E trocar (linha 77):

```tsx
className="h-full bg-journey-accent transition-[width] duration-150"
```

por:

```tsx
className="h-full bg-journey-ink transition-[width] duration-150"
```

Isto é só pra não deixar o arquivo referenciando um token de cor removido — a Task 3 reescreve este arquivo inteiro.

- [ ] **Step 8: Trocar o título do Hero em `lib/data/learning-journey.ts`**

Na linha 55, trocar:

```ts
  heroTitle: "Pensar antes de commitar.",
```

por:

```ts
  heroTitle: "Progressão — Bruno Higashi",
```

- [ ] **Step 9: Verificar que nenhuma referência às cores/fontes antigas sobrou**

Run: `rg -n "journey-accent|journey-warm|journey-flag|font-journey-mono|font-journey-serif" app lib`
Expected: nenhuma ocorrência (comando não retorna nada).

- [ ] **Step 10: Type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 11: Verificação visual manual**

Com `npm run dev` rodando, abrir `http://localhost:3000/jornada` no navegador e confirmar:
- Nenhuma cor além de preto/branco/cinza em qualquer elemento da página (fundo, bordas, dots, badges).
- Título do Hero mostra "Progressão — Bruno Higashi".
- Tipografia é uma sans-serif do sistema (não mais a mono/serif anterior) em toda a página.
- A branch "insight" (Bruno Higashi's Mind) tem um anel visível ao redor do card; o commit "erro de escopo" (kind `flag`) tem o label sublinhado ondulado; o commit "o poder do designer" (kind `insight`) tem um fundo levemente destacado.

- [ ] **Step 12: Commit**

```bash
git add app/globals.css app/jornada/page.tsx app/jornada/_components/hero.tsx app/jornada/_components/trunk-commits.tsx app/jornada/_components/branch-station.tsx app/jornada/_components/horizontal-timeline.tsx app/jornada/_components/scroll-shell.tsx lib/data/learning-journey.ts
git commit -m "style(jornada): apply Apple-style grayscale palette and system typography"
```

---

## Task 2: Layout estrutural — fallback empilhado para `prefers-reduced-motion` e teto de altura dos cards

**Files:**
- Modify: `app/jornada/_components/horizontal-timeline.tsx` (arquivo inteiro)

**Interfaces:**
- Consumes: `STATUS_DOT` (definido nesta mesma task, recolorido na Task 1), `BranchStation` (de `./branch-station`, sem mudança de assinatura — continua `{ branch: Branch }`), `ScrollShell` (de `./scroll-shell` — a assinatura `{ children: ReactNode; "aria-label": string }` não muda nesta task, só na Task 3, e permanece compatível).
- Produces: duas árvores de DOM dentro da mesma `<section>` — o bloco em grade (visível por padrão, oculto via `motion-reduce:hidden`) e uma lista vertical simples (oculta por padrão, visível via `motion-reduce:flex`). A Task 3 depende de o bloco em grade ainda estar dentro de um `<ScrollShell>` com a mesma prop `aria-label`.

- [ ] **Step 1: Reescrever `app/jornada/_components/horizontal-timeline.tsx`**

Substituir o arquivo inteiro por:

```tsx
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { Branch } from "@/lib/data/learning-journey";
import { BranchStation } from "./branch-station";
import { ScrollShell } from "./scroll-shell";

const STATUS_DOT: Record<Branch["status"], string> = {
  concluido: "bg-journey-line-strong",
  ativo: "bg-journey-ink",
  insight: "bg-journey-ink",
  "nao-iniciado": "border-2 border-journey-ink-soft bg-journey-paper",
};

export function HorizontalTimeline({ branches }: { branches: Branch[] }) {
  return (
    <section
      aria-label="Linha do tempo horizontal da jornada com o Claude Code"
      className="relative w-full border-y border-journey-line bg-journey-paper"
    >
      <div className="motion-reduce:hidden">
        <ScrollShell aria-label="Linha do tempo horizontal da jornada com o Claude Code">
          <div className="grid w-max auto-cols-[340px] grid-flow-col grid-rows-[auto_auto_auto] px-16">
            {branches.map((branch, index) => (
              <Fragment key={branch.id}>
                <div className="flex items-end justify-center overflow-y-auto pb-3 sm:max-h-[calc(50dvh_-_1.5rem)]">
                  {index % 2 === 0 ? <BranchStation branch={branch} /> : null}
                </div>
                <div className="relative flex items-center justify-center py-6">
                  <span className="h-px w-full bg-journey-line-strong" aria-hidden />
                  <span
                    className={cn("absolute size-3 rounded-full", STATUS_DOT[branch.status])}
                    aria-hidden
                  />
                </div>
                <div className="flex items-start justify-center overflow-y-auto pt-3 sm:max-h-[calc(50dvh_-_1.5rem)]">
                  {index % 2 !== 0 ? <BranchStation branch={branch} /> : null}
                </div>
              </Fragment>
            ))}
          </div>
        </ScrollShell>
      </div>
      <ol className="hidden flex-col gap-8 px-6 py-16 motion-reduce:flex sm:px-10">
        {branches.map((branch) => (
          <li key={branch.id} className="flex gap-4">
            <span
              className={cn("mt-2 size-3 shrink-0 rounded-full", STATUS_DOT[branch.status])}
              aria-hidden
            />
            <BranchStation branch={branch} />
          </li>
        ))}
      </ol>
    </section>
  );
}
```

Mudanças em relação ao arquivo atual: (a) a `<section>` perde o `min-h-[75vh]` (a Task 3 dá à view pinada uma altura de `100dvh` via `ScrollShell` — não precisa mais ser forçada aqui); (b) o bloco em grade inteiro entra num `<div className="motion-reduce:hidden">`; (c) `grid-rows-[minmax(37.5vh,auto)_auto_minmax(37.5vh,auto)]` vira `grid-rows-[auto_auto_auto]` — o teto de altura agora é por card (`sm:max-h-[calc(50dvh_-_1.5rem)]` + `overflow-y-auto` nas duas células de conteúdo), não mais no nível da linha da grade; (d) nova `<ol>` com a lista empilhada, oculta por padrão e visível só com `motion-reduce:flex`.

- [ ] **Step 2: Type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Verificação manual — fallback de `prefers-reduced-motion`**

No Chrome, abrir `http://localhost:3000/jornada`, abrir o DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → `reduce`. Recarregar a página e confirmar:
- O bloco em grade (trunk + cards lado a lado) desaparece.
- Aparece uma lista vertical simples com as 6 estações, uma abaixo da outra, cada uma com um dot à esquerda.
- Desligar a emulação e confirmar que o bloco em grade volta a aparecer e a lista some.

- [ ] **Step 4: Verificação manual — teto de altura por card**

Redimensionar a janela do navegador para uma altura bem baixa (ex.: 1280x500, sem emular reduced-motion) e rolar a timeline horizontalmente até o card "Bruno Higashi's Mind" ou "Curso EliteDaIA" (os mais longos). Confirmar que o card não é cortado sem indício — ou ele cabe inteiro, ou ganha uma barra de rolagem interna visível que permite ver o resto do conteúdo.

- [ ] **Step 5: Commit**

```bash
git add app/jornada/_components/horizontal-timeline.tsx
git commit -m "feat(jornada): add reduced-motion stacked fallback and per-card height cap"
```

---

## Task 3: Correção do bug — `ScrollShell` com scroll pinado (sticky + transform)

**Files:**
- Modify: `app/jornada/_components/scroll-shell.tsx` (arquivo inteiro)

**Interfaces:**
- Consumes: mesma assinatura de props que hoje — `{ children: ReactNode; "aria-label": string }` (usada por `HorizontalTimeline`, que passa o bloco em grade da Task 2 como `children`).
- Produces: nenhuma prop nova exposta — o componente continua um wrapper opaco. Nenhum outro arquivo depende dos internals.

- [ ] **Step 1: Reescrever `app/jornada/_components/scroll-shell.tsx`**

Substituir o arquivo inteiro por:

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollShellProps = {
  children: ReactNode;
  "aria-label": string;
};

const DESKTOP_QUERY = "(min-width: 640px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function ScrollShell({ children, "aria-label": ariaLabel }: ScrollShellProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    function updatePinned() {
      setIsPinned(desktopQuery.matches && !reducedMotionQuery.matches);
    }

    updatePinned();
    desktopQuery.addEventListener("change", updatePinned);
    reducedMotionQuery.addEventListener("change", updatePinned);

    return () => {
      desktopQuery.removeEventListener("change", updatePinned);
      reducedMotionQuery.removeEventListener("change", updatePinned);
    };
  }, []);

  useEffect(() => {
    if (!isPinned) return;

    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    let maxTranslate = 0;
    let frame = 0;

    function applyProgress() {
      if (!wrapper || !track) return;
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = Math.max(1, wrapper.offsetHeight - window.innerHeight);
      const raw = (window.scrollY - wrapperTop) / scrollableDistance;
      const clamped = Math.min(1, Math.max(0, raw));
      track.style.transform = `translateX(-${clamped * maxTranslate}px)`;
      setProgress(clamped);
    }

    function measure() {
      if (!wrapper || !track) return;
      maxTranslate = Math.max(0, track.scrollWidth - window.innerWidth);
      wrapper.style.height = `${window.innerHeight + maxTranslate}px`;
      applyProgress();
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(applyProgress);
    }

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      wrapper.style.height = "";
      track.style.transform = "";
    };
  }, [isPinned]);

  useEffect(() => {
    if (isPinned) return;
    const container = mobileContainerRef.current;
    if (!container) return;

    function updateProgress() {
      if (!container) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setProgress(maxScrollLeft > 0 ? container.scrollLeft / maxScrollLeft : 0);
    }

    updateProgress();
    container.addEventListener("scroll", updateProgress, { passive: true });
    return () => container.removeEventListener("scroll", updateProgress);
  }, [isPinned]);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-journey-line">
        <div
          className="h-full bg-journey-ink transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {isPinned ? (
        <div ref={wrapperRef} className="relative w-full">
          <div className="sticky top-0 h-dvh overflow-hidden" role="group" aria-label={ariaLabel}>
            <div ref={trackRef} className="w-max will-change-transform">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={mobileContainerRef}
          role="group"
          aria-label={ariaLabel}
          tabIndex={0}
          className="w-full overflow-x-auto focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-ink"
        >
          {children}
        </div>
      )}
    </div>
  );
}
```

O que mudou em relação ao arquivo atual: sai inteiramente o listener de `wheel`/`preventDefault`. Entra `isPinned` (calculado via `matchMedia`, reage a mudanças de tamanho de janela e de `prefers-reduced-motion` em tempo real) que decide entre dois modos de renderização:
- **Pinado** (`isPinned === true`, desktop sem reduced-motion): `wrapperRef` é um bloco cuja altura é calculada como `innerHeight + maxTranslate` (`maxTranslate` = largura da trilha menos largura da viewport); dentro dele, um `sticky top-0 h-dvh overflow-hidden` prende a trilha na tela enquanto a página rola; um listener de `scroll` na window (com `requestAnimationFrame`) recalcula o progresso e aplica `translateX` na trilha. Sem `preventDefault` em lugar nenhum.
- **Não pinado** (mobile, ou `isPinned === false` por qualquer motivo): volta ao container simples `overflow-x-auto` de antes, sem JS nenhum controlando o scroll — só a barra de progresso é recalculada a partir do `scrollLeft` nativo.

- [ ] **Step 2: Type-check e lint**

Run: `npm run type-check && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Verificação manual — o bug original não reproduz mais (desktop)**

Com `npm run dev` rodando, redimensionar a janela do Chrome para 1280x800 e abrir `http://localhost:3000/jornada`. Rolar a página pra baixo com o mouse sobre a área da timeline (não usar a barra de rolagem lateral do trackpad) e confirmar:
- A seção "gruda" na tela e as 6 estações deslizam da direita pra esquerda conforme a página rola.
- A barra de progresso no topo da seção avança de 0% a 100%.
- Depois da última estação ("Produção Musical"), a página **solta** e continua rolando normalmente para a seção "commits no tronco" e o rodapé — sem nenhum travamento.
- Rolar de volta pra cima reverte o efeito suavemente, sem saltos.

- [ ] **Step 4: Verificação manual — fallback mobile**

Redimensionar a janela para 375x800 (ou usar o modo de emulação de dispositivo do Chrome DevTools). Confirmar que a timeline vira uma tira horizontal simples, sem "grudar" na tela — rolar a página verticalmente passa direto por ela (a rolagem lateral funciona por toque/arraste horizontal, não pela rodinha vertical).

- [ ] **Step 5: Commit**

```bash
git add app/jornada/_components/scroll-shell.tsx
git commit -m "fix(jornada): replace wheel-hijack scroll with sticky pin + scroll-driven transform"
```
