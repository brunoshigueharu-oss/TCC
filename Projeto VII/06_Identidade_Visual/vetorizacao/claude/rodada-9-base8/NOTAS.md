# Rodada 9: logo BASE8 com objetos (28/10/2026)

Fonte: `../../fontes/rascunho-logo-base8.jpeg` (rascunho a lápis do Bruno).

## Arquivos
- `BASE8_logo_rodada9.ai`: uma camada por letra (polvo, B, A, S, E, 8) e uma subcamada por objeto. A camada "rascunho (referência)" fica oculta e travada; ligue-a para comparar. A "Camada 1" sobrou da importação do SVG e pode ser apagada.
- `base8-logo.svg`: a mesma arte, com um grupo por objeto.
- `polvo.svg` e `polvo-construcao.svg`: o símbolo limpo e a prancha com a grade e as linhas de construção.
- `gerar-rodada-9.py` gera os SVGs e `montar-ai.jsx` monta o .ai. Para conferir, `render.sh` gera PNGs com a sobreposição ao rascunho em `_conferencia/`.

## Pintura provisória
Preenchimento branco, contorno azul-noite #1B1F3B (3,2 pt) e detalhes com 2,6 pt. Sem sombra nem cor. Vale até chegarem os exemplos de pintura.

## Sistema
- Módulo g = altura das letras ÷ 32 (topo 774, base 1162 no rascunho). O polvo passa 1,5 g acima e abaixo das letras.
- Cabeça: R 11 g. Olhos: elipses de 6,5 × 8,5 g em (±7 g, 4,5 g), inclinadas 20°. Pupilas: 1 × 3,75 g, inclinadas 40° (o dobro).
- Tentáculos saem de um mesmo centro F (0, 12 g). Ponta em r 4,25 g, base em r 12,5 g e largura de 3,5 g na base. Eixos a ±20°, ±50° e ±80°, um a cada 30°.
- Tentáculos laterais (sob os olhos): curvos, no eixo de ±106°, com base em r 14 g.
- **Somam 8 tentáculos.** O par de baixo do rascunho foi lido como dois tentáculos que quase se tocam, sem um tentáculo central.

## Letras
Os objetos seguem o rascunho com geometria limpa: arcos verdadeiros e retas paralelas. O lápis, o microfone e o pen drive usam o mesmo ângulo de 21°, por isso as pernas do A ficam simétricas.

## Dúvidas (nomes provisórios das camadas)
- B: `arco-superior` (bojo de cima, com botão redondo, fenda e plugue), `papel-dobrado` (peça com o "V" em cima) e `grade-curva` (peça com grade e duas presilhas).
- S: `ondas` (o ponto e os 4 crescentes), `luminaria` (seria um sino?) e `telas-curvas` (a peça de baixo, com duas janelas).
- E: `braco-articulado`, `pilha` (seria uma lanterna?), `giz-de-cera` e `blocos-em-l` (os quadrados com o "o" e o traço).
- 8: `fone` (peça com as notinhas, o quadrilátero e o fio), `aviao-de-papel` (ou envelope?), `etiqueta-vi` e `monitor-curvo`.
