# Briefing — vetorização construída da logo e do mascote

Este é o mesmo briefing entregue às duas IAs (Claude e Codex/ChatGPT), para o Bruno comparar os resultados. Responda e escreva tudo em português.

## Contexto

O Bruno é designer e está criando a identidade visual do app do TCC dele: um app web que capacita designers a usar IA agêntica, com trilha e nivelamento no estilo Duolingo e um mascote. O mascote é um **polvo de óculos redondos**. A logo é um símbolo preto derivado do mesmo polvo.

Personalidade da marca: encorajadora e didática; ousada, divertida, convidativa, e ao mesmo tempo segura e limpa. Referências dele: Gumroad (chapado, contorno, ousadia), Duolingo (limpeza apesar de cor e personagem; a marca deriva do mascote), Figma (formas primitivas grossas).

## Arquivos de origem (pasta `../fontes/`, somente leitura)

- `logo-original.svg` — a logo atual, desenhada por ele. **É a referência.**
- `mascote-original.svg` — o mascote atual, desenhado por ele. **É a referência.**
- `logo-original.svg.png` e `mascote-original.svg.png` — prévias renderizadas dos dois.
- `rascunhos-polvo.jpg` — rascunhos a lápis. Servem **só para entender as ideias** (vistas frontal e lateral, poses, expressões, versão com dois braços e ventosas). Não são a referência de forma.

## O que fazer

1. **Reconstruir a logo e o mascote com construção geométrica rigorosa.** Os originais foram traçados a olho: há centros desalinhados, raios quase iguais que deveriam ser iguais, curvas livres onde caberia um arco. Refaça os dois sobre um sistema explícito: módulo/grade, círculos e arcos, tangências, eixos de simetria, proporções que se repetem. O resultado deve continuar reconhecível como o desenho dele, só que "super certinho".
2. **Mostrar as linhas de construção.** Para cada peça, entregue também uma prancha com a arte e, por cima ou ao lado, a construção visível: grade, círculos geradores, eixos, medidas em módulos.
3. **Propor versões alternativas melhoradas.** A partir das ideias dele (vetores e rascunhos), proponha versões que você considera melhores ou caminhos que valem ser vistos: da logo e do mascote. A intenção é ele ver o que você consegue pensar. Cada alternativa precisa de um motivo de design, não de variação gratuita.

## Restrições

- Cores e tipografia ficam para depois. Use uma paleta provisória: roxos próximos de `#674b7b` e `#3d294f`, preto `#211915`, branco. Não inclua nome nem texto na logo.
- Saída em **SVG** limpo, que abra no Illustrator: formas básicas (`circle`, `ellipse`, `rect`) e `path` com arcos sempre que possível; grupos e camadas com nomes legíveis em português (`id`); sem imagem raster embutida; sem fonte externa obrigatória.
- Linhas de construção em grupo/camada separada da arte, para ele poder desligar.
- A logo precisa funcionar em uma cor só e em tamanho pequeno (16–32 px).

## Entrega

Grave tudo **nesta pasta** (o diretório de trabalho atual). Não altere nada fora dela.

- Um SVG por peça final (logo, mascote), um SVG por prancha de construção, um SVG por alternativa.
- Uma prancha geral (`prancha-geral.svg`) reunindo tudo lado a lado, com legendas curtas.
- `NOTAS.md` — curto: o sistema de construção adotado (módulo, proporções, regras), o que foi corrigido em relação aos originais, o motivo de cada alternativa e o que você não conseguiu resolver.

Se quiser conferir o resultado visualmente neste Mac, `qlmanage -t -s 1600 -o <pasta> arquivo.svg` gera um PNG do SVG. Confira o que desenhou antes de encerrar.
