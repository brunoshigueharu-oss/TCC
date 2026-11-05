# Rodada 4 — construção da logo a partir do seu vetor

Origem: `fontes/logo-bruno-v3.svg` (cópia do seu `Ativo 1.svg`). Medidas em módulos: **1u = 10 px do seu arquivo**. Origem no centro da cabeça; y cresce para baixo.

Abra `prancha-rodada-4.svg` primeiro.

## O que medi no seu vetor

O arquivo já é bem construído. O que está certo:

- Cabeça: círculo exato de raio 18u.
- Olhos: centros em (±10; 8), pupilas de 4,5 × 1,25 exatamente centradas.
- Armação branca: segue uma elipse de 9 × 7 a 45° com erro de 0,02 px.
- Miolo branco: elipse de 4,5 × 3,25 a 45°, concêntrica.
- Tentáculo lateral: arco de círculo exato, raio 16u.
- Ponte: fica 2u abaixo da linha dos olhos, que é onde as duas armações mais se aproximam.

Os desvios:

| Onde | O que encontrei |
|---|---|
| Aros pretos | elipse de 7,78 × 5,56 girada 45,6° (as outras estão a 45°); o aro esquerdo é o direito girado 90°, não espelhado. Gera a maior assimetria do arquivo: 1,5 px |
| Barras de dentro do leque | os dois lados não são paralelos (16,3° e 19,4°); nas barras de fora são (53,7° e 53,8°) |
| Larguras do leque | barras de dentro com 5,3u, de fora com 5,9u |
| Vãos do leque | 14° no meio e 20° nos lados |
| Ponta do tentáculo lateral | corte a 12,2°, que não aponta para o centro do olho (o radial seria 9,8°) |
| Centro do arco lateral | (±6,33; 5,23), sem relação com outro ponto do desenho |
| Sorriso | raio 2,43u; centro 0,02 px fora do eixo |

## A · Fiel corrigida

Suas medidas, mexendo só no que está na tabela acima.

- Aros: 7,75 × 5,5 a 45°, espelhados.
- Leque: mesmo centro (18,5u) e raio (17u); quatro barras iguais, de lados paralelos, com 5,61u, a 16,5° e 55,5°. As pontas de fora e de dentro ficam onde estavam (65° e 7°).
- Ponta do tentáculo lateral: corte radial a 10° a partir do centro do olho.
- Centro do arco lateral: (±6,25; 5,25).
- Sorriso: raio 2,5u, no eixo, a 15u do centro.

Distância para o seu contorno: média 0,4 px, máxima 4,3 px. A máxima está nos vértices dos vãos laterais do leque, entre a barra de dentro e a de fora; o vértice do vão central mudou 3,2 px. Os dois se deslocam porque as barras de dentro ficaram paralelas.

## B · Proposta

As mesmas proporções, com cada medida amarrada a uma regra.

- Aros: 7,5 × 5,5. A armação branca passa a ter 1,5u nos quatro vértices da elipse (no seu varia de 1,2u a 1,4u).
- Miolo: 5 × 3. O aro preto passa a ter 2,5u nos quatro vértices (no seu varia de 2,3u a 3,3u).
- Centro do arco lateral: sobre a reta que liga o centro da cabeça ao centro do olho, a 8u do centro da cabeça.
- Ponta do tentáculo lateral: corte radial a 9°, metade do passo do leque.
- Leque: centro na base da cabeça (18u) e raio igual ao dela (18u); barras a 18° e 54°, com barras e vãos de 18° cada.

Distância para o seu contorno: média 1,7 px, máxima 8,8 px, nas pontas das barras de dentro do leque. As diferenças visíveis são o miolo dos olhos um pouco mais alongado e o leque 6 px mais comprido.

## Por que a minha versão anterior parecia dura

Comparando a rodada 3 com o seu vetor, na mesma escala (cabeça = 10):

| | Rodada 3 | Seu vetor |
|---|---|---|
| Armação branca | 1,0 | 0,7 a 0,8 |
| Barras do leque | 3,5 | 2,9 a 3,3 |
| Tentáculo lateral | círculo de raio 7,1 centrado no olho | círculo de raio 8,9 com centro deslocado para dentro |
| Olhos | (±5; 5) | (±5,6; 4,4) |
| Sorriso | raio 1,25 a 9,25 | raio 1,35 a 8,3 |

Tudo na rodada 3 era mais grosso e mais fechado. O que mais pesa é o tentáculo lateral: centrado no olho ele vira uma bola; com o centro deslocado, como no seu, ele afina em direção à ponta e lê como braço.

## Limites

- Os arcos saem como curvas de Bézier (é o que a biblioteca de união de formas gera), não como arcos nativos.
- Conferido pela prévia do Quick Look; não abri no Illustrator.
