---
name: efeito-ascii
description: >
  Transforma um vídeo ou imagem no efeito de caracteres coloridos do projeto
  (protótipo `prototipos/pontilhismo`, servido em localhost:4310) e, se pedido,
  leva para o app via `lib/ascii-bloom.ts`. Gatilhos: "transforma esse vídeo/imagem
  no efeito", "faz em ascii/caracteres", "novo tema no pontilhismo", "coloca essa
  flor/bicho no herói", qualquer mídia nova para o efeito da 4310.
---

# Mídia → efeito de caracteres

**Sempre: estilo Caracteres + cores Originais.** Não perguntar estilo, paleta ou
fundo; não testar pontos/dither/riso. Fundo da página: **branco** por padrão;
**preto** quando o pedido disser ("fundo preto", "no escuro"). Azul-noite só se pedido. Economizar tokens: não ler `index.html` inteiro (1000+ linhas) —
usar os trechos indicados abaixo com `grep -n`/`sed -n`.

## 1. Preparar

- Copiar a mídia para `prototipos/pontilhismo/` com nome curto kebab-case (`orquidea.mp4`).
  Mídia fica fora do git: o `.gitignore` lista arquivo por arquivo (sem glob), então
  adicionar a linha `prototipos/pontilhismo/<nome>` (e `public/<área>/<nome>` no passo 5).
- Servidor: `preview_start {name: "pontilhismo-proto"}` (porta 4310). Ele não aceita
  Range — por isso o medidor baixa o vídeo como blob; não "consertar" isso.

## 2. Medir (uma chamada, sem olhar quadro a quadro)

`javascript_tool` na aba da 4310:

```js
(0, eval)(await (await fetch("/medir.js?" + Date.now())).text());
const { cover, ...r } = await medir("orquidea.mp4"); r
```

Opções: `{ from, to }` (segundos) mede só um trecho; `{ step }` (padrão 0,25 s).
Só pedir `cover` (cobertura ao longo do tempo) se precisar escolher o trecho.

Saída e uso:

| campo | vai para |
|---|---|
| `bg` `"claro"`/`"escuro"` | escolhe a função de tinta (abaixo) |
| `fill` | `fill` do tema |
| `ink {by, min, range}` | `inkSat(min, range)` (claro) ou tinta por brilho (escuro) |
| `tone [lo, hi]` | `vivid.tone` |
| `crop` | `crop` do clip (ou `capture` se o vídeo for gravação de tela/tem lixo em volta) |
| `sceneCuts` | `maxT` = antes do primeiro corte que não seja do tema. Aproximado: no passo 0,25 s pode faltar corte ou sobrar (legenda sumindo). Se o fim do loop pular, medir de novo com `{ step: 0.1, from, to }` perto do fim |
| `loop` | `perfect: true` → clip `mode: "loop"` com `from`/`to` exatamente como vieram (ver "Loop perfeito"). `perfect: false` → não é loop. `null` → não foi checado (só checa medindo o vídeo inteiro, sem `to`) |
| `coverMin` / `coverMax` | `[t, área]`: botão fechado / tema mais aberto → `from` / `to` do clip `bloom` |

Calibrado contra os temas feitos à mão (lírio, gérbera, dália): `ink` bate quase
exato; `tone` é ponto de partida (ajustar ±0,1 vendo na tela).

## 3. Tema no protótipo (`prototipos/pontilhismo/index.html`)

Pontos de edição (`grep -n` para achar):
- `const inkSat` / `function inkDalia` — funções de tinta. Fundo claro: `const inkX = inkSat(min, range);`.
  Fundo escuro: copiar `inkDalia` trocando `0.012`→`min` e `0.03`→`range`.
- `const SUBJECTS = {` — adicionar o tema, modelo:

```js
orquidea: {
  label: "Orquídea desabrochando desenhada com caracteres",
  src: "orquidea.mp4",
  frameWidth: 300,              // ~300 px de largura; retrato: 256
  maxT: Infinity,               // ou o corte de cena
  // gravação de tela / lixo em volta: minT, capture: {x,y,w,h}, fps: 15
  fill: "<fill>",
  ink: inkOrquidea,
  only: { style: "chars", colors: "original", bg: "branco" }, // ou bg: "preto"
  // claro (pastel): sat 1.8, onWhite [0.26, 0.6]; escuro: sat 1.2, onWhite [0.1, 0.46]
  // fundo preto usa onDark ([0.45, 0.82]; sombras sumindo → subir o 1º valor)
  vivid: { sat: 1.8, tone: [<lo>, <hi>], onWhite: [0.26, 0.6], onDark: [0.45, 0.82], edge: 2.5 },
  clips: {
    bloom: { from: <coverMin.t>, to: <coverMax.t>, crop: <crop>, mode: "bloom", loop: true },
  },
},
```

  Modos de clip existentes: `loop` (vídeo que já emenda; ver abaixo), `bloom` (abre/fecha), `pingpong` (vai e volta), `swim`
  (anda e volta à pose; precisa de `shift`). Trecho longo (>8 s): `bloom: { speed: 1.6, openMs: 2600 }`.
- `const defaultClip` — incluir `orquidea: "bloom"`.
- Bloco `?tema=` (logo abaixo de `const state`) — incluir o nome na condição.

**Loop perfeito (sem travadinha):** quando `medir` devolve `loop.perfect: true`, usar
`{ from: loop.from, to: loop.to, crop, mode: "loop" }` **sem arredondar `to`**.
- `duplicate: true`: o último quadro é cópia do primeiro; `to` já para no começo da
  cópia, então ela nunca aparece (antes aparecia o mesmo quadro duas vezes = travadinha).
- `duplicate: false`: `to` = fim do último quadro. Cortar antes (ex.: `5.0` num vídeo de
  5,04 s) pula um quadro e dá tranco.
- O protótipo já mistura o último quadro com o primeiro na emenda (`sampleVideo`), como
  entre quaisquer dois quadros. Não criar crossfade próprio.
- Conferir sem animação (funciona com o painel escondido): na aba da 4310,
  `sampleVideo(vgrid, { t, x: 0, y: 0, rot: 0 })` para `t` passando pela emenda a cada
  1/60 s; a diferença entre quadros na emenda deve ficar perto da mediana (tranco = 3× ou mais).

**Imagem parada:** o caminho de foto (`IMAGES`, `inkBlackBg`, `analyse`) só serve
para fundo escuro. Fundo escuro: adicionar em `IMAGES` e ajustar `inkBlackBg` com
`min`/`range` medidos. Fundo claro: trocar `inkBlackBg` em `analyse` e `buildTargets`
por `inkSat(min, range)` medido (de preferência como `ink` por imagem em `IMAGES`).

## 4. Conferir

`navigate` para `http://localhost:4310/?tema=orquidea` (`&fundo=preto` força o fundo
preto para comparar sem editar o tema), esperar ~3 s e **um**
`screenshot` (scale 0.5). Ajustar só o que estiver visivelmente errado:
- fundo virando caractere → subir `ink.min`; tema falhando/sumindo → baixar
- cores lavadas ou escuras demais → mexer em `tone` (não em `sat`)
- tema cortado → `crop`; pulo no loop → `from`/`to`

## 5. Levar para o app (só se pedido)

Flor em fundo claro, ciclo abre/fecha → reaproveitar `lib/ascii-bloom.ts`:
1. Copiar o vídeo para `public/<área>/<nome>.mp4` (ex.: `public/landing/`).
2. Em `PRESETS`, novo item: `frameWidth`, `clip {from,to}`, `crop`, `fill`,
   `ink {min, range}`, `tone` — mesmos valores do protótipo.
3. Usar `<AsciiBloom flower="<nome>" src="/<área>/<nome>.mp4" className=... />`
   (`app/_components/ascii-bloom.tsx`).

Fundo da página preto: `lib/ascii-bloom.ts` só tem `onWhite`; usar o padrão `onDark`
de `lib/ascii-betta.ts`. Loop perfeito no app: mesma regra (`to` medido e, na emenda,
misturar o último quadro com o primeiro).

Vídeo com fundo escuro ou movimento que não é abrir/fechar → seguir `lib/ascii-betta.ts` +
`app/(hub)/(entrada)/_components/ascii-betta.tsx` (tinta por brilho, modo swim).
Não criar terceiro motor sem necessidade: generalizar o preset existente.

Depois: `npm run type-check && npm run lint`.
