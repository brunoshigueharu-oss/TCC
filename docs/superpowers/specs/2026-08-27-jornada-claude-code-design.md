# Jornada — página interativa da curva de aprendizado com o Claude Code

## Visão geral

Página pessoal dentro do projeto do TCC que documenta, de forma visual e interativa, a curva de aprendizado do autor com o Claude Code — do primeiro curso até o uso atual na pesquisa do TCC. Serve tanto como registro pessoal quanto como possível material de apoio para a pesquisa (o TCC é sobre IA e Design).

Não tem banco de dados, não tem autenticação, não tem Server Actions. Conteúdo estático, editado via código quando o autor quiser adicionar um novo marco.

## Rota e estrutura de arquivos

```
app/jornada/
  layout.tsx                    # Server. Aplica as fontes da página (next/font/google) num wrapper.
  page.tsx                      # Server. Compõe a página inteira.
  _components/
    hero.tsx                    # Server. Título, subtítulo, meta.
    horizontal-timeline.tsx     # Client. Contêiner com rolagem lateral + barra de progresso.
    branch-station.tsx          # Server. Uma "estação" (branch) dentro da timeline.
    trunk-commits.tsx           # Server. Seção "aprendizados transversais".
lib/data/
  learning-journey.ts           # Schema Zod + conteúdo tipado da jornada.
```

O rodapé (fontes dos cursos + nota sobre cronologia aproximada) fica inline em `page.tsx` — pequeno demais para justificar um componente próprio.

A home do projeto (`app/page.tsx`) não é alterada.

## Modelo de dados

`lib/data/learning-journey.ts` exporta um objeto validado por um schema Zod, no topo do módulo (padrão já definido no `CLAUDE.md` do projeto).

```ts
const statusEnum = z.enum(["concluido", "ativo", "insight", "nao-iniciado"]);

const commitSchema = z.object({
  label: z.string(),
  description: z.string(),
  kind: z.enum(["default", "flag", "insight"]).default("default"),
});

const branchSchema = z.object({
  id: z.string(),
  name: z.string(),
  meta: z.string(),
  metaHref: z.string().url().optional(),
  status: statusEnum,
  intro: z.string(),
  commits: z.array(commitSchema).min(1),
  openNote: z.string().optional(),
  reflection: z.string().optional(),
});

const trunkItemSchema = z.object({
  label: z.string(),
  before: z.string(),
  after: z.string(),
});

const journeySchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubhead: z.string(),
  startDate: z.string(),
  updatedDate: z.string(),
  branches: z.array(branchSchema).min(1),
  trunkItems: z.array(trunkItemSchema).min(1),
  sources: z.array(z.object({ label: z.string(), href: z.string().url() })),
});

export const learningJourney = journeySchema.parse({ /* ... */ });
```

`status` dirige a cor semântica de cada estação (ver seção de Estilo). `commit.kind` diferencia commits normais, o marcador de "erro/custo" (`flag`) e o de "insight-chave" (`insight`) — mesma lógica usada no artifact de referência.

## Conteúdo

### Hero

- Eyebrow: `registro pessoal · desde 9 de agosto de 2026`
- Título: `Pensar antes de commitar.`
- Subtítulo: mesmo texto do artifact (grafo de commits em vez de mapa mental, do primeiro clique até o TCC).
- Meta: autor, início (9 de agosto de 2026), última atualização (27 de agosto de 2026). **Sem qualquer referência a "Dia dos Pais".**

### As 6 estações da timeline (nesta ordem)

1. **Curso Udemy** — status `concluido`
   - meta: `curso · Udemy — Claude Code do zero ao avançado` (link)
   - intro: primeiro contato com o Claude Code, o ponto de partida de toda a jornada.
   - commits: agentes & comandos; hooks; CLAUDE.md; integração no VS Code (interface usada até hoje, por dar mais liberdade visual que o terminal puro).
   - nota: a estrutura de pastas usada até hoje vem daqui.

2. **Hocus Pocus** — status `ativo`
   - meta: `projeto para uma empresa · em desenvolvimento`
   - intro: nasceu logo depois do curso, aplicando o que tinha sido aprendido — mas cresceu muito além de um exercício. Hoje é um projeto real, sendo desenvolvido para uma empresa, e segue em andamento.
   - commits: primeira aplicação simples (testar o potencial da ferramenta); crescimento contínuo de escopo e conhecimento do Claude Code ao longo do projeto.
   - **Importante**: este projeto é totalmente separado do curso Udemy — não é o "exercício do curso", é um projeto maior e independente que começou depois.

3. **Curso EliteDaIA** — status `concluido`
   - meta: `curso · EliteDaIA — segurança web + vibe coding` (link)
   - intro: segundo curso, focado em segurança web e em programar no estilo "vibe coding" — sem ser, de fato, programador. Não tem nome de projeto associado.
   - commits: revisão redundante com o curso anterior; correção de vulnerabilidades de segurança mesmo sem programar profissionalmente; deploy real (Hostinger + **VPS**); armazenamento de dados de cliente.
   - openNote: `em aberto: ainda não entendo bem backend`

4. **TCC (pesquisa)** — status `ativo`, marcado como "branch ativa — você está aqui"
   - Igual ao artifact: fontes/referências, estruturação da pesquisa, formalização em ABNT, este próprio diagrama.

5. **Bruno Higashi's Mind** — status `insight`
   - Igual ao artifact: erro de escopo (`kind: flag`), a ficha caiu sobre gestão de tokens, o poder do designer (`kind: insight`), comunicação por voz.
   - `reflection` (sem aspas de citação literal, tratado como síntese, não fala textual): "O potencial da ferramenta está em como você chega e conversa com ela — não é sobre saber programar."

6. **Produção Musical** — status `nao-iniciado`
   - Igual ao artifact: plugins/software para produção e mixagem, ainda não começou.

### Aprendizados transversais (trunk items)

Iguais ao artifact: gestão de tokens/contexto; escolha e divisão entre agentes; organização de projeto — cada um como "de → para".

### Fontes (rodapé)

Links dos dois cursos (Udemy e EliteDaIA) + nota: "Cronologia reconstruída a partir de relato pessoal em 27/08/2026 — datas dentro do período são aproximadas."

## Layout e composição da página

Rolagem vertical normal na página como um todo:

1. `Hero` — bloco estático.
2. `HorizontalTimeline` — seção de altura fixa (ex.: `75vh`), com rolagem própria lateral. Recebe as 6 `BranchStation` como `children` (Server Components passados de dentro de `page.tsx`, já que um Client Component não pode importar um Server Component diretamente, só recebê-lo como children).
3. `TrunkCommits` — bloco estático abaixo da timeline.
4. Rodapé — bloco estático, inline em `page.tsx`.

Dentro da `HorizontalTimeline`: um tronco horizontal (linha) atravessa a seção; as estações ficam penduradas nele, alternando acima/abaixo para caber na altura disponível sem gerar rolagem vertical dentro da seção. O tronco e os conectores são desenhados com CSS/HTML (divs posicionados), não com um SVG grande de coordenadas fixas — mais fácil de ajustar espaçamento depois.

## Mecânica da timeline horizontal

- Contêiner com `overflow-x: auto`, `overflow-y: hidden`, altura fixa.
- Um listener de `wheel` (dentro do Client Component) redireciona `deltaY` para `scrollLeft`, com `preventDefault()` — permite rolar de lado usando a rodinha do mouse normalmente, sem precisar de Shift.
- **Liberação nas bordas**: quando o contêiner já está no início (tentando rolar mais pra trás) ou no fim (tentando rolar mais pra frente) da rolagem lateral, o listener não chama `preventDefault()` — o scroll cai de volta para o comportamento vertical normal da página.
- Touch (celular) e gesto de duas dedos no touchpad já rolam lateralmente de forma nativa, sem precisar do listener.
- Contêiner focável (`tabIndex={0}`) para permitir rolagem por teclado (setas esquerda/direita), usando o comportamento nativo do navegador em elementos com overflow.
- Barra de progresso fina no topo ou na base da seção, refletindo `scrollLeft / (scrollWidth - clientWidth)`.
- **Acessibilidade / `prefers-reduced-motion`**: quando o sistema tem `prefers-reduced-motion: reduce`, o listener de `wheel` não é registrado — a seção continua rolável lateralmente (touch, touchpad, teclado, barra de scroll), só não "sequestra" a rodinha do mouse vertical.

## Estilo

- Novos tokens em `app/globals.css`, prefixados `journey-*` (`--color-journey-paper`, `--color-journey-ink`, `--color-journey-ink-soft`, `--color-journey-line`, `--color-journey-line-strong`, `--color-journey-accent`, `--color-journey-accent-soft`, `--color-journey-warm`, `--color-journey-warm-soft`, `--color-journey-flag`, `--color-journey-flag-soft`), definidos em `@theme inline` + `:root` + `.dark` — seguindo o padrão de dark mode via classe que o projeto já usa (não `prefers-color-scheme`).
- Tipografia própria da página via `next/font/google`: Space Mono (títulos, labels, dados) + Newsreader (texto corrido) — aplicada só dentro de `app/jornada/layout.tsx`, sem afetar o resto do site.
- Cores por `status`: `concluido` → neutro (`line-strong`/`ink-soft`); `ativo` → `accent` (verde-petróleo); `insight` → `accent-warm` (âmbar); `nao-iniciado` → tracejado/neutro, com nó vazado.
- `commit.kind === "flag"` usa `accent-flag` (ferrugem); `commit.kind === "insight"` usa `accent-warm` com fundo levemente destacado.

## Fora de escopo (por enquanto)

- Home/navegação nova.
- Edição de conteúdo pelo próprio site (sem banco de dados).
- Toggle de tema (a página funciona em modo claro; herda modo escuro só quando o projeto tiver um mecanismo de ativação).
- Qualquer biblioteca de animação nova (Framer Motion etc.) — tudo via CSS + um único listener de `wheel`.

## Decisões editoriais registradas nesta spec

- **VPN vs. VPS**: o relato original citou "VPN"; mantido como **VPS** por ser a leitura tecnicamente coerente com "hospedar um site" — não confirmado literalmente pelo autor. Revisar se necessário.
- **Citação do Bruno Higashi's Mind**: não é uma fala literal transcrita — é uma síntese do que foi dito. Por isso entra como `reflection` (texto de destaque), sem aspas de citação direta.

## Como construído (diferenças em relação a esta spec)

Registrado após a implementação completa, para a spec não ficar desatualizada em relação ao código real:

- **Sem `layout.tsx`**: a rota não tem sub-páginas, então as fontes (`next/font/google`) são aplicadas direto em `page.tsx`, sem um arquivo de layout dedicado. Simplificação decidida na fase de plano, comunicada na época — a spec nunca foi atualizada para refletir isso.
- **`horizontal-timeline.tsx` continua Server Component.** O único Client Component da rota é `app/jornada/_components/scroll-shell.tsx` (não previsto nesta spec) — ele encapsula só o contêiner de rolagem (ref + listener de `wheel` + barra de progresso), recebendo o conteúdo de `horizontal-timeline.tsx` como `children`. Isso preserva `BranchStation` e a lista de estações como Server Components de verdade.
- **`commits: z.array(commitSchema)` sem `.min(1)`**: necessário para a branch "Produção Musical", que ainda não tem nenhum commit (`commits: []`). A spec original listava `.min(1)`, o que teria quebrado esse caso.
- **Token faltante nesta lista**: `--color-journey-surface` (fundo dos cards) também foi adicionado junto dos outros `journey-*`.
- **Mecânica de altura mudou**: a Task de revisão final encontrou um bug real de recorte — com altura fixa (`h-[75vh]`) + `overflow-y: hidden`, o conteúdo do card mais longo ("Bruno Higashi's Mind") ficava invisível em qualquer altura de janela realista, sem nenhum indício visual. A implementação final usa **CSS Grid** (`grid-flow-col` com 3 linhas de grid compartilhadas, a do meio recebendo o tronco/pontos), com `minmax(37.5vh, auto)` nas linhas de conteúdo — 75vh vira uma altura *mínima*, não um teto, então nada é cortado, e o tronco fica estruturalmente alinhado entre as 6 estações (garantido pela grade, não coincidência numérica). O tronco deixou de ser uma única linha absoluta e passou a ser um segmento por coluna, unidos pela mesma linha de grade.
- **Barra de progresso no topo, não na base**: consequência do ponto anterior — a seção da timeline ficou mais alta que a viewport típica (conteúdo cresce conforme o card mais longo), então uma barra fixada na base ficava abaixo da dobra na maior parte do tempo. Movida para o topo da seção, opção já prevista nesta spec ("no topo ou na base").
