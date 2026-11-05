# Rodada 11: contorno das letras BASE8 em 1 pt (28/10/2026)

Contorno feito à mão, seguindo o rascunho como está (com as quebras orgânicas), com linha de 1 pt azul-noite #1B1F3B e sem preenchimento. O polvo fica para depois.

- `base8-contorno.svg`: arquivo principal. Um grupo por letra e, dentro dele, um grupo por objeto (33). No Illustrator, selecione o grupo da letra no painel Camadas e use "Liberar para camadas (sequência)" para transformar os grupos em subcamadas.
- `objetos.py`: os pontos de cada objeto, lidos do rascunho, na notação da caneta (L = reta, S = curva suave por pontos, O = círculo, E = elipse).
- `contorno.py`: gera o SVG.
- `ov.sh nome x0 y0 x1 y1 escala`: gera a sobreposição ampliada com grade em `_conf/`, para conferir trechos.
