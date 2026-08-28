# Jornada — redesenho visual Apple + correção do bug de scroll

## Visão geral

Duas mudanças na página `/jornada` (já existente, ver `docs/superpowers/specs/2026-08-27-jornada-claude-code-design.md`):

1. **Bug de scroll**: reproduzido ao vivo — rolando a página com o mouse sobre a `HorizontalTimeline`, a rolagem trava completamente a partir de um certo ponto (nem avança o carrossel horizontal, nem solta pro scroll vertical da página). O usuário não consegue ver o restante do conteúdo dos cards de baixo. Causa raiz: o listener de `wheel` em `scroll-shell.tsx` intercepta `deltaY` e chama `preventDefault()` sempre que o carrossel horizontal não está exatamente no início/fim — e a seção pode ser mais alta que a viewport (grid com `minmax(37.5vh, auto)`), então o usuário fica sem conseguir revelar o que passa da dobra.
2. **Identidade visual**: a página passa a seguir a identidade visual da Apple — preto, branco e cinza (nenhuma cor), tipografia clean (fonte do sistema, uma família só), e título do Hero trocado para "Progressão — Bruno Higashi".

Este documento cobre só essas duas mudanças. Estrutura de dados, conteúdo (fora do `heroTitle`), e composição da página (Hero → HorizontalTimeline → TrunkCommits → rodapé) continuam como na spec original.

## Tipografia

- Remove as fontes carregadas via `next/font/google` (`Space_Mono`, `Newsreader`) de `app/jornada/page.tsx` — a página deixa de importar `next/font/google` inteiramente.
- Nova stack, definida como valor bruto de CSS (não como var de `next/font`): `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif`.
- Em `app/globals.css`, o token `--font-journey-mono` e `--font-journey-serif` (dentro de `@theme inline`) são substituídos por um único `--font-journey-sans` apontando pra essa stack.
- Hierarquia visual passa a vir só de peso e tamanho (400/500/600/700, `text-xs` a `text-5xl` como já usado), nunca de troca de família.
- Todos os usos de `font-journey-mono`/`font-journey-serif` nos componentes (`hero.tsx`, `branch-station.tsx`, `horizontal-timeline.tsx`, `trunk-commits.tsx`, rodapé em `page.tsx`) são removidos — a família passa a vir só da classe aplicada no wrapper raiz da página (`font-journey-sans`), sem overrides por elemento.

## Paleta de cores — cinza puro

Os tokens `--journey-*` em `app/globals.css` são recalibrados para uma escala neutra inspirada diretamente nos tokens reais do design da Apple (valores usados em apple.com):

| token | claro | escuro | uso |
|---|---|---|---|
| `--journey-paper` | `#f5f5f7` | `#000000` | fundo da página |
| `--journey-surface` | `#ffffff` | `#1d1d1f` | fundo dos cards |
| `--journey-ink` | `#1d1d1f` | `#f5f5f7` | texto principal, elementos de destaque ("ativo"/"insight") |
| `--journey-ink-soft` | `#6e6e73` | `#86868b` | texto secundário |
| `--journey-line` | `#d2d2d7` | `#424245` | bordas/divisores padrão, traço do "não iniciado" |
| `--journey-line-strong` | `#86868b` | `#6e6e73` | barra de progresso, dot do "concluído" |

Os tokens `--journey-accent`, `--journey-accent-soft`, `--journey-warm`, `--journey-warm-soft`, `--journey-flag`, `--journey-flag-soft` (verde, âmbar, ferrugem) são **removidos** — nenhuma cor sobrevive, só as 6 variáveis acima.

## Diferenciação de status sem cor

Sem verde/âmbar/vermelho, `Branch["status"]` e `commit.kind` se diferenciam só por peso, traço e preenchimento — tudo em `branch-station.tsx` e `horizontal-timeline.tsx`:

- **`concluido`**: borda sólida fina (`journey-line-strong`), dot preenchido `journey-line-strong`, texto em `journey-ink-soft`.
- **`ativo`** ("você está aqui"): borda mais grossa em `journey-ink`, dot preenchido `journey-ink`, texto em `journey-ink`.
- **`insight`**: mesma borda de `ativo`, mas o dot ganha um anel ao redor (`ring-2 ring-offset-2 ring-journey-line-strong`); o `reflection` continua em itálico — já é o suficiente pra destacar sem cor.
- **`nao-iniciado`**: borda tracejada em `journey-line`, dot vazado (contorno `journey-ink-soft`, fundo `journey-surface`) — igual a hoje, só recolorido.
- **`commit.kind === "flag"`**: em vez do dot ferrugem, o label do commit recebe sublinhado ondulado (`underline decoration-wavy underline-offset-4`) em `journey-ink-soft`; dot volta a usar a cor neutra do status da branch.
- **`commit.kind === "insight"`**: dot preenchido `journey-ink` (em vez de âmbar) + label em `font-semibold` (peso extra é o único destaque).
- `trunk-commits.tsx`: a seta `→` (hoje `text-journey-accent`) passa a `text-journey-ink-soft`.

## Correção do bug — mecânica de scroll

`app/jornada/_components/scroll-shell.tsx` é reescrito do zero: sai o listener de `wheel`/`preventDefault`, entra um padrão de **scroll pinado** (o mesmo usado em páginas de produto da Apple):

- **Wrapper externo**: bloco alto, cuja altura é calculada em runtime (via `ResizeObserver`/`useLayoutEffect` sobre a largura real da trilha) como `viewportHeight + (larguraTotalDaTrilha - larguraDaViewport)` — não um `vh` fixo chutado. Isso garante que a distância de scroll vertical necessária corresponda 1:1 à distância horizontal que precisa ser percorrida, em qualquer tamanho de tela/conteúdo.
- **Bloco interno**: `position: sticky; top: 0; height: 100dvh`, contendo o tronco + as 6 estações lado a lado (a trilha).
- Um único listener de `scroll` na página (com `requestAnimationFrame` pra throttle) calcula `progress` (0 a 1) a partir da posição de scroll relativa ao wrapper, e aplica `transform: translateX()` na trilha proporcional a esse progresso.
- **Nenhum `preventDefault()` em lugar nenhum** — o scroll vertical da página é 100% nativo do início ao fim. É isso que mata o bug pela raiz: não existe mais um estado onde a rolagem fica "presa".
- Barra de progresso: mesmo valor de `progress`, sem depender mais de `scrollLeft`/`scrollWidth`.
- Teclado/foco: sem contêiner com scroll interno próprio, a navegação por Tab/setas volta a ser o comportamento nativo de scroll da página — sempre acessível, sem lógica customizada.

### Salvaguardas

- **`prefers-reduced-motion: reduce`**: detectado uma vez no mount; quando ativo, o componente **não** monta o mecanismo de pin/transform — renderiza as 6 estações empilhadas verticalmente, layout mais simples, sem sticky.
- **Telas pequenas (abaixo do breakpoint `sm`)**: também pulam o pin — a trilha vira uma tira horizontal simples (`overflow-x-auto` nativo, sem JS, sem sticky), rolável por toque/swipe. Prender o scroll da página por várias alturas de viewport não funciona bem em celular.
- **Cards que não cabem na metade disponível** (ex.: "Bruno Higashi's Mind", "Curso EliteDaIA"): **só no modo pinado** (desktop, sem `prefers-reduced-motion`), cada metade do tronco (acima/abaixo) tem um teto de `calc(50dvh - <espessura do tronco>/2)` (não mais `minmax(..., auto)` crescendo livre); se o conteúdo do card ultrapassar esse teto, ele ganha `overflow-y: auto` nativo (scrollbar fina) — visível e alcançável com o scroll normal do mouse sobre o card, sem sequestrar nada da página. Nos fallbacks (reduced-motion empilhado, e tira horizontal mobile), essa altura é livre — a página cresce normalmente, sem teto nem overflow interno.

## Conteúdo alterado

Só `heroTitle` muda, em `lib/data/learning-journey.ts`: de `"Pensar antes de commitar."` para `"Progressão — Bruno Higashi"`. Nenhum outro texto (subhead, commits, notas) é reescrito.

## Arquivos afetados

```
app/globals.css                              # tokens journey-* recalibrados (cor + fonte)
app/jornada/page.tsx                         # remove next/font/google, remove font-journey-serif do wrapper
app/jornada/_components/scroll-shell.tsx     # reescrito: pin + transform em vez de wheel-hijack
app/jornada/_components/horizontal-timeline.tsx  # recolore dots de status, ajusta teto de altura por metade
app/jornada/_components/branch-station.tsx   # recolore bordas/dots/flags/insight, remove font-journey-mono
app/jornada/_components/hero.tsx             # remove font-journey-mono
app/jornada/_components/trunk-commits.tsx    # remove font-journey-mono, recolore seta
lib/data/learning-journey.ts                 # heroTitle novo
```

## Fora de escopo

- Nenhuma lib de animação nova (Framer Motion etc.) — pin + transform via CSS/JS puro, mesma restrição da spec original.
- Home do site (`app/page.tsx`) não é tocada.
- Toggle de tema — dark mode continua existindo só como classe (`.dark`), sem mecanismo de ativação nesta página.
- Conteúdo/copy da jornada (fora do `heroTitle`) não é revisado.

## Decisões registradas nesta spec

- **Valores de cor**: os hexadecimais da paleta (`#f5f5f7`, `#1d1d1f`, `#6e6e73`, `#d2d2d7`, `#86868b`) replicam os tokens de cinza publicamente usados no design da Apple — não são uma aproximação livre.
- **Fallback mobile pula o pin, não só desativa a transição**: decisão de implementação (não perguntada explicitamente) — presa por várias alturas de viewport em tela pequena tende a ficar ruim; a alternativa (tira horizontal simples) preserva a usabilidade em celular.
- **Cards com overflow interno como salvaguarda**: mesmo com o teto de altura calculado a partir da viewport (não mais do conteúdo), texto muito longo ainda pode, em janelas muito baixas, não caber — nesse caso o card ganha scroll interno nativo em vez de cortar conteúdo sem indício (é o oposto do bug original: aqui a affordance é visível).
