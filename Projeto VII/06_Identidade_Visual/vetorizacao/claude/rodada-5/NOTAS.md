# Rodada 5 — logo a partir do rascunho de 23/10

Origem: `fontes/rascunho-polvo-v4.png`. Abra `prancha-rodada-5.svg` primeiro.
Medidas em módulos (1u = 10 px). Origem no centro da cabeça; y cresce para baixo.

## Sistema

| Elemento | Regra |
|---|---|
| Cabeça | círculo R10; as laterais descem retas e tangentes ao círculo |
| Proporção vertical | cabeça : corpo : tentáculos = 10 : 10 : 4 (altura 24, largura 20) |
| Tentáculos | 4 de 3,5u e 3 vãos de 2u (4 × 3,5 + 3 × 2 = 20); o vão central cai no eixo; topo dos vãos em semicírculo r1; pontas com raio 1 |
| Óculos | centros em (±7,5; −2): ¾ do raio para fora, ⅕ acima do centro. Armação 3,75 × 4,75, vidro 2,75 × 3,75 (armação de 1u), inclinados 15° para fora. A armação passa 1,25u para fora da silhueta, como no rascunho |
| Pupila | pílula 1 × 3, no centro do vidro, no mesmo ângulo |
| Boca | traço 2 × 0,75 com pontas redondas, no eixo, em y = 1,5 |

Os olhos ficam acima do centro geométrico da figura (y = 2), que é onde o olho espera encontrar o rosto.
Três níveis só (corpo, vidro, pupila): funciona em uma cor e segura em 24 px.

## Variantes

- **B · Circuito** — as trilhas do 2º rascunho: três por lado, 0,75u de espessura, nós r0,9, a cerca de 1,25 a 1,8u da silhueta. Leva o "código" para dentro do símbolo; é larga demais para favicon, melhor para campanha e cabeçalho.
- **C · Reduzida** — sem boca, vidro e pupila maiores. Para 16–24 px, onde a boca some.
- **D · Olhar reto** — óculos redondos sem inclinação. Mais sério e estável; perde um pouco da graça do rascunho.
- **E · Alça** — o arco sobre a cabeça no rascunho lido como alça/fone (anel R11–R12). Não sei se era essa a intenção ou se era só o contorno da esfera.
- **F · Ícone de app** — branco sobre azul-noite, cantos 22,5% do lado.

Cores aplicadas com a paleta fechada (azul-noite `#1B1F3B`, branco, verde-água `#14B38E`).

## Arquivos

- `a-principal.svg` e `b-…` a `f-…`: peças soltas, um caminho composto cada.
- `a-construcao.svg`: grupos separados `grade`, `arte` (20% de opacidade) e `construcao` — dá para desligar no Illustrator.
- Gerador: `../gerar-rodada-5.cjs` (`NODE_PATH=<pasta com node_modules/paper> node gerar-rodada-5.cjs`).

## Limites

- Os arcos saem como curvas de Bézier (resultado da união de formas), não arcos nativos.
- Conferido pelo Quick Look do macOS, não no Illustrator.
