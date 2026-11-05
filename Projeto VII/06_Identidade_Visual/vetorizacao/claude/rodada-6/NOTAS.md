# Rodada 6 — gordinho, bocas, globo e espaço negativo

Retorno sobre a rodada 5: "perdeu um pouco da essência"; menos espaço entre os tentáculos, mais gordinho, experimentar a boca, integrar o símbolo de internet (globo), espaço negativo.
Referência: `fontes/rascunho-polvo-v4-zoom.png`. Abra `prancha-rodada-6.svg` primeiro. Módulo u (1u = 10 px), origem no centro da cabeça.

## O que mudou em relação à rodada 5

| | Rodada 5 | Rodada 6 |
|---|---|---|
| Corpo | lateral reta, largura = cabeça (20) | barriga: casco da cabeça R10 com dois "ombros" r3 em (±8; 4,5) — largura 22 |
| Proporção | 10 : 10 : 4 (alto) | 10 : 9 : 3,5 — altura 22,5 ≈ largura 22 (atarracado) |
| Tentáculos | 3,5 com vãos de 2 | 4,75 com vãos de 1 (4 × 4,75 + 3 × 1 = 22), pontas r1,5 |
| Lentes | (±7,5; −2), 15° | (±8,5; −1,5), 20°: mais para a lateral, como no rascunho |
| Pupila | 1 × 3 | 1,5 × 3, mais próxima do traço grosso do lápis |

## Peças

- **A · Gordinho** — base desta rodada (+ `a-gordinho-construcao.svg`).
- **Bocas** — traço, sorriso, cursor `>_` (ligação com código), "o", "w". Só na prancha; o gerador troca com `boca: '<nome>'`.
- **B · Com alça** — no zoom do rascunho o arco sobre a cabeça parece fone/alça ligando as lentes; acho que é parte da essência.
- **C · Globo** — linhas do símbolo de internet (meridiano central, meridiano elíptico rx5, paralelo em −6) gravadas em negativo só na calota, acima dos olhos; o rosto fica limpo (+ `c-globo-construcao.svg`).
- **D · Globo com alça**.
- **E · Selo em espaço negativo** — disco R15 com a grade do globo; o polvo (escala 0,75) é vazado, vidro e boca continuam na cor do disco. As linhas param no contorno e não entram nos vãos.

## Observações

- Em 16 px as linhas do globo (C) viram textura; para favicon use A.
- Evitei a forma da marca da Globo (esfera com tela): a referência foi o ícone genérico de internet.
- Conferido pelo Quick Look, não no Illustrator. Os arcos saem como curvas de Bézier depois da união de formas (o casco do corpo é calculado com arcos e tangentes exatos, mas também vira Bézier na união).
