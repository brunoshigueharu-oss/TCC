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
