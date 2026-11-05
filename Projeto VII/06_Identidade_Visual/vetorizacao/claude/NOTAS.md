# Notas — versão do Claude

Abra primeiro `prancha-geral.svg`: reúne originais, peças construídas, construções, alternativas e o teste de tamanho pequeno.

## Sistema de construção

O módulo (`u`) é a espessura da armação dos óculos do mascote. Tudo é múltiplo ou meio múltiplo de `u`. Logo e mascote usam a mesma cabeça (círculo de raio 10u).

### Mascote

Origem no cruzamento do eixo de simetria com a linha dos olhos.

| Elemento | Construção |
|---|---|
| Cabeça | círculo R10, centro 1,5u acima da linha dos olhos |
| Óculos | dois anéis R7 / r6 (armação de 1u), centros a 16u um do outro; ponte de 2u × 1u sobre a linha dos olhos |
| Olhos | círculos r4,5 concêntricos com as lentes; traço de 4u × 1u no centro |
| Boca | meio círculo r1,5; o topo reto fica na tangente à base dos olhos |
| Tentáculos | quatro cápsulas afiladas: círculo r1,75 em cima ligado por tangentes a um círculo r0,6 na ponta |
| Braço | faixa entre dois círculos excêntricos (R4,8125 e r2,6875, centros a 0,875u), que afina de 3u na base para 1,25u na ponta |

A figura cabe em 30u × 32u.

### Logo

Origem no centro da cabeça.

| Elemento | Construção |
|---|---|
| Cabeça | círculo R10 |
| Olhos | centros em (±5, 5), sobre as diagonais de 45° da cabeça |
| Lentes | elipses concêntricas giradas 45°: armação 5 × 4, lente 4 × 3, miolo 2,75 × 1,75; traço de 3u × 0,75u no mesmo ângulo |
| Tentáculos laterais | metade de baixo de dois círculos de raio 5√2 centrados nos olhos; cada um passa pelo centro da cabeça |
| Tentáculos de baixo | leque com centro na base da cabeça, em (0, 10): barras de 3,5u a 18° e 54° do eixo, cortadas por um círculo R10 |

O círculo do leque é o círculo da cabeça deslocado 10u para baixo: um passa pelo centro do outro.

## O que foi corrigido em relação aos originais

As medidas abaixo estão nas unidades do arquivo original, em que a armação dos óculos tem 7.

- **Mascote:** os brancos dos olhos estavam 1,2 a 1,7 fora do centro das lentes, e os traços dos olhos 1,5 acima da linha dos óculos. Agora tudo é concêntrico.
- **Mascote:** a boca estava cerca de 1 fora do eixo de simetria.
- **Mascote:** tentáculos e braço eram curvas livres com degradê. Viraram círculos e tangentes, em cor chapada (três roxos: `#674b7b`, `#523a65`, `#3d294f`). O roxo do meio é novo e provisório.
- **Logo:** as lentes eram curvas livres, com o miolo deslocado do centro e inclinação de cerca de 56°. Viraram elipses concêntricas a 45°. O miolo deslocado dava a impressão de olhar para baixo; isso se perdeu.
- **Logo:** os quatro tentáculos tinham ângulos e larguras diferentes entre si (cerca de 20° e 57°). Passaram a 18° e 54°, com a mesma largura.
- **Logo:** a curva de baixo dos tentáculos laterais já era quase um arco de raio 7 centrado no olho; assumi isso como regra.
- A logo saiu como um caminho composto único, com furos de verdade (funciona sobre qualquer fundo).

## Alternativas e o motivo de cada uma

- **Logo alt. 1 — lente simples.** Cada olho perde um anel: fica armação branca, lente preta e traço branco. Segura melhor em 16–24 px, onde os quatro níveis do original viram mancha.
- **Logo alt. 2 — rosto do mascote.** Hoje a logo e o mascote têm rostos diferentes (lentes ovais inclinadas contra óculos redondos com traço horizontal). Esta versão usa o rosto do mascote em uma cor, com o leque da logo. É a que melhor se lê em 16 px.
- **Logo alt. 3 — ícone de app.** A alt. 2 em branco sobre quadrado roxo de cantos arredondados.
- **Mascote alt. 1 — dois braços.** O rascunho frontal tem dois braços; o vetor tem um. Com dois, a silhueta fica simétrica.
- **Mascote alt. 2 — expressões.** Cinco estados trocando só olhos e boca: neutro, feliz, focado, triste, surpreso. O "focado" usa os traços a 45° da logo, o que amarra as duas peças.

## O que não ficou resolvido

- **Alt. 2 lembra outro bicho.** Sem o corpo, olhos brancos grandes numa cabeça redonda puxam para macaco ou mosca. Uma primeira tentativa, com tentáculos retos em vez do leque, virou caveira e foi descartada.
- **Tentáculos laterais da logo.** O corte reto na linha dos olhos ficou mais duro que as pontas do original.
- **Ventosas, vista lateral e poses do rascunho** não foram feitas. Poses soltas não saem bem por construção geométrica.
- **Conferência visual** foi feita só pelo Quick Look do macOS; não abri os arquivos no Illustrator.

## Como regerar

`gerar.cjs` produz todos os SVGs a partir dos parâmetros no topo de cada seção (`M` para o mascote, `L` para a logo, `R` para a alt. 2). Depende do pacote `paper`:

```
npm i paper
node gerar.cjs
```
