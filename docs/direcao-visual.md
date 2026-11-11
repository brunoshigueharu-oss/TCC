# Direção visual do BASE8 — "editorial sóbrio"

Vale para o hub, a landing e as telas web. Referência interna: **o começo da
landing** (`app/_components/landing-hero.tsx` + faixa da vitrine). Tudo o que
for criado deve parecer irmão daquele trecho.

## O que o Bruno pediu (11/11/2026)

- Tom **chique, bem feito, gostoso de usar, interativo**. Nada infantil.
- Estava "simples demais / divertido demais": **formas Bauhaus** (círculos,
  quadrados e triângulos coloridos decorativos) e **cards brancos genéricos**
  sobre cinza. Os dois saem.
- Gamificação (XP, nível, sequência, ranking) **fica**, mas com tratamento
  sóbrio: números grandes e finos, rótulos em caixa alta, sem cara de jogo.
- Branco puro (ele odeia creme), neutros frios, poucos matizes.

## Princípios

1. **Tipografia carrega a hierarquia.** Títulos em `font-display`
   (Instrument Sans), peso 500, `tracking-[-0.04em]` ou mais apertado,
   `leading` perto de 1. Tamanho generoso. Corpo em Figtree 15–16px.
2. **Linha antes de caixa.** Separe com linhas finas (`border-linha`) e
   espaço em branco. Cartão (`SurfaceCard`) só quando o conteúdo é um objeto
   de verdade (um post, um curso). Nunca cartão dentro de cartão. Sem sombra
   difusa; no máximo borda de 1px. Raio padrão 12px (`rounded-xl`).
3. **Fundo branco.** A página é `bg-fundo`. `bg-superficie` é para áreas
   pequenas (campo, hover, faixa), não para o fundo da página.
4. **Cor é acento, não decoração.** Cada pilar tem uma cor (trilha = limão,
   prática = rosa, comunidade = azul, ação = verde-água). Use em marcadores
   pequenos (quadrado de 8px), barra de progresso, estado ativo, um detalhe
   por bloco. Áreas grandes de cor só em momentos de destaque (uma por tela).
5. **Rótulos pequenos em caixa alta** (`text-xs font-semibold
   tracking-[0.08em] uppercase`) e **números em mono** (`font-mono
   tabular-nums`), como o "03 / 06" da vitrine.
6. **Ilustração = ASCII art**, a assinatura da marca (`lib/ascii-*.ts`,
   `app/_components/ascii-bloom.tsx`). É ela que substitui as formas Bauhaus
   onde houver espaço para imagem. Onde não couber, deixe só tipografia.
7. **Movimento curto e com propósito.** 150–300ms,
   `cubic-bezier(0.22, 1, 0.36, 1)`. Entrada com `animate-fade-up` /
   `animate-blur-in`; hover com deslocamento de 1–2px, seta que anda,
   sublinhado que cresce. Tudo respeita `prefers-reduced-motion`.
8. **Interação com retorno.** Todo item clicável tem hover, foco visível
   (`focus-visible:ring-2 ring-texto`) e estado pressionado. Alvo de toque
   ≥ 44px.

## Fundação já pronta (não refazer, usar)

- `components/page-header.tsx` — cabeçalho tipográfico (aceita `eyebrow`,
  `actions`, `children`).
- `components/section-heading.tsx` — rótulo de seção com linha (aceita
  `meta`).
- `components/surface-card.tsx` — cartão de linha fina, 12px.
- `components/theme-toggle.tsx` — tema claro/escuro (`ThemeToggle`,
  `useIsDarkTheme`). A classe `dark` vai em `<html>`.
- Botões: `ActionLink` / `ColorBurstLink` / `ColorBurstButton` (pílula
  azul-noite com tinta no hover). É o único estilo de botão de ação.

## Tema escuro

Os tokens do hub invertem sozinhos sob `.dark` (`app/globals.css`). Regras:

- Use sempre os tokens (`bg-fundo`, `text-texto`, `border-linha`,
  `bg-superficie`...). **Nada de `bg-white`, `text-black`, hex solto.**
- Texto ou ícone **sobre cor viva** (limão, rosa, azul, verde-água) usa
  `text-tinta` (escuro fixo), não `text-texto` — senão fica branco sobre
  limão no escuro.
- Branco que não pode inverter (texto sobre foto): `text-papel`.
- `bg-texto text-fundo` (pílula escura) inverte sozinho e está correto.
- Confira cada tela nos dois temas antes de dar por pronta.

## Não fazer

- Formas geométricas coloridas soltas como enfeite; emojis; ícones dentro de
  quadradinhos coloridos grandes; gradientes; sombras difusas; cantos muito
  redondos (> 16px) em blocos de conteúdo; tom de voz de joguinho
  ("Uhuu!", "Mandou bem!").
- Tela cheia de cartões iguais. Varie o ritmo: um bloco grande, uma lista
  com linhas, um número em destaque.

## Referências externas (linha, não cópia)

Linear, Vercel, Read.cv, Teenage Engineering, Are.na, Stripe Press,
Rauno Freiberg (rauno.me), Family (family.co) para microinterações.

## Casca do hub (navegação e transições)

- **Paleta de comandos** (`components/command-palette/`): ⌘K / Ctrl+K ou `/`
  abrem de qualquer tela do hub, das telas web e da 404. Busca difusa por
  telas, lições, atividades, cursos, posts, pessoas e ações; mostra recentes
  com o campo vazio. O índice é montado no servidor em `lib/command-index.ts`
  a partir de `lib/data/*` — tela nova = uma linha lá. Para abrir de um botão:
  `<CommandPaletteTrigger />` (campo "Buscar ⌘K") ou `variant="icon"` (lupa),
  ou `openCommandPalette()` em código cliente.
- **Atalhos globais**: `G` depois `H`/`C`/`E`/`P` (destinos), `G` `N`
  (notificações), `G` `S` (configurações), `⌥T` (tema), `⌘B` (recolher a
  barra lateral). Não disparam com o foco num campo de texto.
- **Barra lateral** recolhe para ícones (lembra a escolha; dicas com o nome e
  o atalho). Indicadores de item ativo deslizam (motion `layoutId`) na
  lateral e na barra inferior. No celular, a faixa do topo (`MobileTopBar`)
  traz a lupa e o tema.
- **Transições**: `template.tsx` dos grupos `(abas)`, `(foco)` e `(web)`
  envolvem a tela em `PageTransition` (React `<ViewTransition>`): a antiga
  some em 110ms, a nova entra com fade + 6px. Barra fina de carregamento no
  topo (`NavigationProgress`, alimentada por `instrumentation-client.ts`).
  `loading.tsx` usam `PageSkeleton`; `error.tsx` usam `ErrorState`.
- **Tema**: o script que evita o clarão mora em `components/theme-init.ts`
  (módulo de servidor). Não importe constantes de um arquivo `"use client"`
  num Server Component — vira referência e o valor some.

## Primitivos

Todos usam só tokens (funcionam nos dois temas), têm foco visível
(`ring-2 ring-texto`) e área de toque de 44px. `Button` (`components/ui/button`)
é o botão utilitário — pílula escura, contorno, fantasma; a ação principal
segue em `ColorBurstButton`/`ActionLink`. `Input`/`Textarea` têm hover, foco
com borda escura e halo leve, erro em vermelho. `Checkbox`/`Radio` de 20px
com alvo ampliado, `Switch` em verde-água com polegar que estica ao pressionar.
**Novos:** `Tooltip` (`ui/tooltip`, aceita `shortcut`; agrupe com
`TooltipProvider` para abrir em sequência sem espera) — reforço, nunca o
único nome do gatilho. `Kbd`/`KbdGroup` (`ui/kbd`) — tecla em mono; para
atalhos com ⌘/Ctrl automático use `ShortcutKeys` da paleta. `Skeleton`/
`SkeletonText` (`ui/skeleton`) — blocos neutros com pulso lento; o contêiner
leva `aria-busy`. `Toast` (`ui/toast`) — chame `toast({ title, description,
tone: "sucesso" | "erro" | "neutro" })` de qualquer Client Component; o
`<Toaster />` já está no layout raiz (canto inferior, acima da barra no
celular). `AnimatedNumber` (`ui/animated-number`) — conta até o valor ao
entrar na tela; de Server Component passe `format="milhar" | "dois-digitos" |
"compacto"` (funções não atravessam). Também: `ProgressBar` agora é um
`role="progressbar"` que cresce ao aparecer (`isStatic` desliga), `Chip` com
hover/pressão, `BackBar` translúcida com linha, `UserAvatar` (iniciais em
mono), `AsciiFlourish` (flor ASCII ajustada ao tema, para vazios e
exceções) e `BrandMark` tipográfica (BASE + "8" em mono num quadrado de linha;
`compact` mostra só o monograma).
