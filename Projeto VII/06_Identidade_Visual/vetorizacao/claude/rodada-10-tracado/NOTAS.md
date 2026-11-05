# Rodada 10: letras BASE8 traçadas do rascunho (28/10/2026)

O Bruno pediu linhas o mais próximas possível do rascunho, com o jeito orgânico dele. Não usar a construção geométrica da rodada 9. O polvo ficou de fora: ele vai fazer depois.

## Arquivos
- `BASE8_letras_rodada10.ai`: camadas B, A, S, E e 8, com uma subcamada por objeto (33 no total). "rascunho (referência)" fica oculta e travada; "fundo" fica travada.
- `base8-letras-tracadas.svg`: a mesma arte.
- `tracar.py`: o traçador. `render.sh` gera as conferências em `_conferencia/`.
- `montar-ai.jsx`: monta o .ai a partir do SVG.
- O `BASE8_logo_rodada9.ai`, que o Bruno editou e salvou às 22:27 sem o polvo, **não foi alterado**.

## Como foi feito
1. Tinta: o rascunho com desfoque de 0,8 px e limiar de 235. Manchas com menos de 40 px saem.
2. Esqueleto: a linha central de cada traço (afinamento Zhang-Suen), sem os degraus de pixel.
3. Caminhos: liga os trechos que continuam através dos cruzamentos e emenda falhas do lápis de até 16 px quando as pontas estão alinhadas.
4. Separação por objeto: cada trecho vai para a região do objeto correspondente na rodada 9 (`_conferencia/rotulos.png`).
5. Curvas: média móvel de 5 px (tira só o tremido), simplificação de 0,9 px e curvas Bézier suaves. Os cantos com mais de 50° continuam vivos.

Uso: `python3 tracar.py [limiar] [janela]`, com `DESFOQUE=0.8`. Um limiar maior pega mais traços claros. Uma janela maior deixa a linha mais lisa.

## Pintura
São só traços: azul-noite #1B1F3B, 3,6 pt, ponta e junção redondas, sem preenchimento. Para pintar, use a Pintura Dinâmica (Live Paint) do Illustrator, que fecha as áreas entre as linhas.

## Limitações conhecidas
- As bolinhas cheias das notas musicais (no `fone` do 8) viraram traços curtos.
- Alguns traços muito claros, como as facetas do lápis, saíram parciais.
- Os nomes das camadas ainda são provisórios (ver a lista de dúvidas da rodada 9).
