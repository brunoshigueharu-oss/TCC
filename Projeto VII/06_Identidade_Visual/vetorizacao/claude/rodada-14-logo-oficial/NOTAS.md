# Rodada 14: logo oficial BASE8 (24/11/2026)

O Bruno definiu a logo oficial: **"BASE" em Instrument Sans Bold, azul-noite, + a bola 8 colorida**.
A logo ilustrada (lettering de objetos, rodada 13) passa a ser **material de divulgação e iconografia**.

Rascunho dele: fora das pranchetas do `Brandbook_BASE8.ai` (à esquerda da capa), texto "BASE" 300 pt,
tracking -20 + bola 8 ao lado. A bola do rascunho estava com as manchas sem degradê (renderizava preta);
usei a bola da p. 21 (logo simplificada, "Principal"), que é o mesmo desenho.

## Grid

u = espessura do traço das letras (braço do E) = altura das maiúsculas / 7.

| medida | valor | no rascunho |
|---|---|---|
| maiúsculas | 7u | 7u |
| bola 8 | 9u de diâmetro, centrada em 3,5u (passa 1u acima e abaixo) | 8,97u, já centrada |
| E → bola | 1,5u | 1,40u |
| logo inteiro | 34u × 9u | — |
| área de proteção | 3u em volta | — |
| tamanho mínimo | 96 px / 25 mm de largura | — |

Espaçamento entre as letras: o da fonte com tracking -20 (como no rascunho).

## Arquivos

- `gerar-logo-base8.jsx` → `BASE8_logo.ai` (pranchetas principal, azul-noite, branca, negativa, construção), SVG, PNG @2x, PDF.
  Rodar com o Brandbook aberto (lê o texto do rascunho e a bola da p. 21). Repetível (feche o BASE8_logo.ai antes).
- `inserir-pagina-construcao.jsx` → insere "construção do logo." como p. 09 (rodar 1×).
- `preencher-paginas-logo.jsx` → põe a logo nas pp. 08, 09, 18, 20, 22, 23, 24, 25.

## Lições

- `duplicate()` e até copiar/colar de um objeto cujas manchas viraram GrayColor não trazem a cor de volta:
  conferir `fillColor.typename` (tem de ser GradientColor) antes de usar uma bola como fonte.
- A bola 8 de uma cor é círculo − 8 (Pathfinder subtrair via `executeMenuCommand`), então o 8 fica vazado.
