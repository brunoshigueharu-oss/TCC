# Receitas de movimento do BASE8

Todas usam o motor (`B8`, em `assets/filme-modelo/motor.js`). `t` é o tempo do filme em segundos. Os números vêm do
manifesto, onde cada receita aparece aplicada (`Videos/films/base8-manifesto/film.js`).

## Índice
1. Grade de tempo
2. Curvas e molas
3. Frase que sobe
4. Estalo de entrada
5. Uma forma vira a outra
6. Cursor e clique
7. Digitação
8. Lista que empilha
9. Personagem pulando
10. Corte e rajada
11. Zoom em degraus e mosaico
12. Corte seco e silêncio
13. Fio, 8 e logo
14. Borrão de movimento
15. Som provisório

## 1. Grade de tempo

120 BPM: 1 batida = 0,5 s = 30 quadros; meia batida = 0,25 s = 15 quadros; um quarto = 0,125 s.

| Momento | Onde cai |
|---|---|
| Corte de cena, clique, golpe | na batida |
| Entrada de palavra ou peça | na batida ou em fila logo depois dela |
| Rajada | um corte a cada 0,25 s |
| Troca rápida (testar cores) | a cada 0,125 s |
| Piscar do cursor de texto | 0,25 s aceso, 0,25 s apagado (`blinkOn(t)`) |

Arco de 30 s que funcionou: silêncio (0–3) → pulso lento (3–8) → cenas encurtando 2 s, 1,5 s, 1 s, 1 s, 1 s → rajada
de 6 × 0,25 s → acúmulo com um degrau por batida → corte seco e 2,5 s de silêncio → nota longa → assinatura.

## 2. Curvas e molas

| Para | Use | Duração |
|---|---|---|
| Entrar | `E.oExpo(seg(t, t0, t0 + d))` | 0,3–0,55 s |
| Sair | `E.iCubic(seg(t, t0, t0 + d))` | 0,2–0,25 s |
| Mover na tela (cursor, símbolo) | `E.io` | 0,3–0,45 s |
| Estalar com passada | `E.oBack(x, 1.2–2.6)` | 0,2–0,3 s |
| Peça pequena (alternador, etiqueta) | `spring(t - t0, 5–6, 0.5)` | assenta em ~0,3 s |
| Forma virando outra | `spring(t - t0, 3–3.6, 0.5–0.62)` | assenta em ~0,5 s |
| Janela, cartão grande | `spring(t - t0, 3, 0.7)` | sem quicar |
| Agulha, contador | `E.lin` | a duração do trecho |

Fila de entradas: 0,02–0,07 s entre itens; a fila inteira em menos de 0,5 s.

## 3. Frase que sobe

```js
const L = lay('chave', [{ s: 'tudo' }, { s: 'começa' }, { s: 'num' }, { s: 'rabisco.', c: C.blue }], 78);
reveal(L, W / 2, 912, t - 4.0, { align: 'center', stag: 0.08, out: 1.5 });   // entra aos 4,0 s e sai aos 5,5 s
```

- `out` é contado desde a entrada da frase. Em fundo escuro, `dc: C.white`.
- Peso diferente numa palavra: `{ s: 'IA', w: 700 }`.
- Dê à frase pelo menos 0,6 s parada depois da última palavra.
- Variante da abertura do manifesto: uma bolinha quica de palavra em palavra e cada palavra entra quando a bolinha
  bate nela (`ball1` e `s1`).

## 4. Estalo de entrada

```js
const s = spring(t - 27.5, 3.6, 0.5);
at(W / 2, 790, s, s, 0, () => { shadow(50, 22, 0.28); box(-190, -46, 380, 92, 46, C.ink); noShadow(); text('base8.com', 0, 14, 40, { w: 600, c: C.white, align: 'center' }); });
ring(t, 0.5, W / 2, 540, C.blue, 90, 0.6);   // o anel acompanha um estalo ou um clique
```

Nunca só opacidade: toda entrada tem escala ou deslocamento junto.

## 5. Uma forma vira a outra

A regra da casa: o elemento antigo não sai, ele vira o novo.

```js
const p = spring(t - 11.5, 3.0, 0.52);
const R = mrect(BTN, { x: SC.x - SC.R, y: SC.y - SC.R, w: SC.R * 2, h: SC.R * 2, r: SC.R }, p);   // botão → círculo
rbox(R, C.blue);
flower(cx, cy, R.w / 2, spring(t - 11.72, 3.2, 0.5), -PI / 8, C.blue);   // círculo → flor (k de 0 a 1)
```

- `mrect` interpola posição, tamanho e canto. Para partir uma barra em quatro, crie quatro retângulos de origem lado a
  lado e mande cada um para o seu destino com 0,03 s de diferença.
- Texto do elemento antigo some nos primeiros 0,1 s; o do novo entra depois de 0,25 s.
- Antecipação: 0,12 s antes, encolha 7–8% na direção do movimento.
- Para uma linha virar outra linha (reta → rabisco → reta), interpole ponto a ponto com um atraso que corre ao longo
  do traço: `w = E.io(clamp(tau * 1.7 - u * 0.7))` (`tracePts`).

## 6. Cursor e clique

```js
const CUR = [[10.45, 1580, 1140], [11.0, 1012, 630, E.oExpo], [11.55, 1012, 630], [11.9, 1506, 566, E.io]];   // [t, x, y, curva]
const c = kf(t, CUR);
ring(t, 11.25, c[0], c[1], C.white, 60);
cursor(c[0], c[1], 'você', C.ink, { press: pressAt(t, [11.25]) });
```

- O cursor entra por baixo ou pela direita, chega 0,05–0,25 s antes do clique e fica parado (quadro repetido).
- Ao passar por cima, o botão cresce 5–6% com mola; no clique encolhe 9% e o anel abre.
- Cursor "IA": `cursor(x, y, 'IA', C.pink, { s: 1.5 })`. Um tremor de 3 px enquanto digita.
- Desenhe o cursor por último na cena.

## 7. Digitação

```js
const TYPE = typeTimes(CODE.length, 6.42, 0.041);          // um tempo por letra, com tremor fixo
const n = typedAt(TYPE, t);                                // quantas letras já saíram
text(CODE.slice(0, n), x, y, 58, { fam: MONO, w: 500, c: C.white });
if (n < CODE.length || blinkOn(t)) box(x + n * CW + 5, y - 52, 8, 72, 4, C.blue);   // cursor de texto
```

- 0,037 a 0,045 s por letra. Em Geist Mono, a largura da letra é `measure('0', 58, 500, MONO)`.
- No som, use os mesmos tempos (`som.js` tem o mesmo `rnd`).
- Selecionar e apagar antes de digitar: retângulo azul varrendo do fim para o começo (0,2 s), texto some, placa muda
  de largura, digita.

## 8. Lista que empilha

O item novo entra sempre na mesma altura, os antigos sobem uma entrelinha com mola e apagam para `C.dim`
(`list3`). Artigo em `C.mute`, substantivo em azul-noite.

## 9. Personagem pulando

Pouso na batida; entre dois pousos, parábola (`y -= 4 * h * f * (1 - f)`). No pouso esmaga 30% e volta
(`Math.exp(-e * 15) * Math.cos(e * 24)`); no ar estica até 16% conforme a velocidade; a plataforma afunda 10 px;
rastro de 5 pontos; uma piscada no meio (`heroAt`, `game`).

## 10. Corte e rajada

- Corte de cena comum: seco, na batida, com um elemento que atravessa (o fio azul).
- Rajada: cartões de tela inteira com fundo chapado, 0,25 s cada, sem texto novo. Cada cartão tem uma figura grande e
  um único gesto que termina em 0,18 s (escala 1,3 → 1 com `E.oExpo`). Alterne os fundos (azul-noite, rosa, claro,
  limão, verde, azul) e mude a cor das legendas de canto conforme o fundo (`CARDS`, `burst`).
- Passagem por estilhaço: rachaduras nos últimos 0,14 s e triângulos voando por cima do primeiro cartão.

## 11. Zoom em degraus e mosaico

Grade infinita de peças com conteúdo sorteado por `rnd(ix, iy, n)`. A cada batida o zoom dá um degrau
(`ZS = [2.3, 1.5, 1.05, 0.74, …]`, `E.oExpo` em 85% da batida, mais 4% de deriva para não parar). As peças entram do
centro para fora (`E.oBack`, 0,045 s por anel). Abaixo de 30 px a miniatura vira um sinal simples. 8% das peças
trocam de cor a cada 0,25 s para dar vida (`mosaic`, `icon`, `zoomAt`).

## 12. Corte seco e silêncio

Depois do clímax: tudo para no mesmo quadro (zoom, pisca-pisca, contador), o som zera e a imagem escurece 66%. No
manifesto sobe uma barra de player falsa, como se o vídeo tivesse pausado, e o cursor "IA" age em silêncio. Use esse
recurso uma vez por filme.

## 13. Fio, 8 e logo

- Recolher tudo num fio: as peças encolhem em fila, um zigue-zague azul fino aparece no lugar e se enrola no 8
  (`SERP`, `s5`).
- O 8 é um laço vertical contínuo com a volta de cima menor (`eight(v)`, `draw8`). Uma cabeça azul-noite com rastro
  percorre o laço sem parar (`loop8`). Nunca deite o 8.
- Fecho: `await B8.logo.load('assets/logo-base8.png', { w: 1000, cx: W / 2, cy: 392 })` no `init` e
  `B8.logo.draw(t, t0, 'do8')` na cena. `B8.logo.box8` dá o lugar do 8 para um traço se encaixar nele.
- O último quadro fica limpo: as legendas de canto somem 1,5 s antes do fim.

## 14. Borrão de movimento

`fast: [[3.0, 3.5, 6], [14.5, 16.0, 3]]` em `B8.start`. O motor desenha o quadro várias vezes dentro de 80% da duração
do quadro e tira a média. 4 a 6 amostras em cenas leves; 3 em cenas pesadas (mosaico). Fora dos trechos rápidos não
vale o custo.

## 15. Som provisório

```js
const m = require('./som')(30);
m.kick(3.0); m.bass(3.0, 33); m.hit(8.0); m.whoosh(8.0); m.blip(8.5, 60, 72); m.click(11.25);
m.silence(19.5, 22); m.echo(22); m.save('audio/mix.wav');
```

| Acontece na tela | Som |
|---|---|
| Ponto, clique | `click` |
| Palavra entrando, peça da logo | `blip` curto e agudo |
| Linha atravessando, corte | `whoosh` (+ `hit` no corte) |
| Tecla | `key` |
| Pulo, alternador, notificação | `blip` com glissando |
| Batida | `kick` + `bass` |
| Assinatura (igual em toda a campanha) | `tone(t, 76)` e `tone(t + 0.25, 81)` |

`silence` vem depois de todos os sons e `echo` só depois do silêncio, para não sujar o corte seco.
