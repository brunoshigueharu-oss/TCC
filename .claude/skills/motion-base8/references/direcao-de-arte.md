# Direção de arte do motion do BASE8

Fonte: os 7 vídeos que o Bruno mandou em 24/11/2026 como "vibes e direcionamento artístico" para o manifesto, mais as
preferências dele registradas na memória do projeto. A primeira versão do manifesto (risografia e colagem) foi
reprovada; esta direção nasceu depois disso.

## Índice
1. O que cada referência trouxe
2. O que elas têm em comum
3. Cor
4. Tipografia
5. Composição e medidas
6. Vocabulário de elementos
7. O que evitar
8. Como ler referências novas

## 1. O que cada referência trouxe

| Referência (X) | O que é | O que usamos |
|---|---|---|
| "motion study 02 / made in code" | Pílula preta que vira player, controle de volume, alternador, seletor Day/Week/Month, cartão de gráfico com números rolando, paleta de comandos ("frame" → "Every frame is code") e botão "Generate". Fundo de estúdio cinza-claro, cursor conduzindo, borrão de movimento. | Um elemento vira o próximo; cursor como ator; estúdio; números rolando; barra de comando sendo digitada |
| Logo da Framer (Gal Shir) | Logo construída por quadrados sobre azul com guias pontilhadas, um cursor-triângulo amarelo arrastando as peças, menu de contexto, amostras de cor com hex em leque, logo em vidro, boné. | Guias de construção, amostras com hex, cursor que monta a marca, troca seca de fundo |
| Bonequinho laranja no After Effects | Câmera 3D voando sobre uma interface com um personagem de bloco pulando em cima dos painéis. | Personagem de bloco simples com olhos, pulando de elemento em elemento (com esmagar e esticar) |
| "Claude motion reel 2026" | Tipografia cinética gigante em campos de cor chapada (vermelho, branco, azul, quase preto), itálico serifado de contraponto, legendas de visor nos cantos com cena e código de tempo, grade de cubos, infográfico com números rolando, partículas, cartão "Render queue". | Legendas de canto, cortes de cor chapada, "EVERY / SINGLE / FRAME" como modelo de rajada, cartões de interface |
| earshot 0.3 (Leon Lin) | Branco, preto e azul elétrico. Formas geométricas com alças de vetor, réguas, "every sound **is code.**" em dois tons, "201 sounds. 0 files." sobre uma grade de sinais miúdos, zoom para dentro de uma forma como passagem, terminal sendo digitado, grade de peças com rótulo, forma de onda. | É a referência mais próxima: frase curta em caixa baixa com uma parte em azul, alças de vetor, grade de peças (o mosaico), zoom como passagem |
| Rebrand da Caixa | Linha do tempo das logos, construção em contorno sobre azul-marinho, logo em azul chapado, aplicações, padronagem azul/laranja/branco que se multiplica. | Construção em contorno, padronagem que cobre a tela (o acúmulo), fecho na logo |
| Reel de kanji vermelho/preto | Tipos gigantes como blocos de layout, grade de células, pasta de arquivos com cursor, papel estilhaçando. | Grade de células, estilhaço como passagem, cursor sobre ícone |

## 2. O que elas têm em comum

- Linguagem vetorial e de interface, chapada, sem textura de impressão.
- Poucas cores por peça: um neutro claro, um quase preto e um ou dois saturados, com azul liderando.
- Cursor, componente de interface ou personagem mínimo como ator; nunca cenário ilustrado.
- Marcas de construção à mostra (guias, alças, réguas): o processo aparece.
- A mensagem de fundo é a mesma do BASE8: "cada quadro é código".
- Passagens por transformação, zoom ou corte seco na batida. Quase nenhum fade.

## 3. Cor

Preferências do Bruno que valem aqui: branco puro (nada de creme), neutros frios, poucos matizes, primárias chapadas
com preto e branco (Bauhaus).

- A logo final é colorida (rosa, verde, azul, limão). Para ela não chegar do nada, as faíscas de cor aparecem aos
  poucos e crescem até o fecho.
- Proporção num quadro comum: cerca de 70% branco, 20% azul-noite, 8% azul, 2% faíscas. No acúmulo do manifesto, as
  peças são 32% claras, 26% azul-noite, 22% azul e 20% divididos entre rosa, verde e limão.
- Texto sobre cor viva: branco sobre azul, rosa e verde; azul-noite sobre limão.
- Tons claros de uma cor da marca são permitidos (`mix(C.blue, C.white, 0.74)` para um céu, por exemplo). Cor nova,
  não.
- Todas as cores ficam no bloco `C` do `motor.js`. Se ele pedir o azul elétrico e o preto puro das referências
  (`#1F4FFF`, `#0E0E10`), é ali que se troca.

## 4. Tipografia

| Uso | Fonte e peso | Tamanho em 1080p |
|---|---|---|
| Frase principal | Figtree 600 | 78 a 104 px |
| Frase de impacto em placa | Figtree 700 | 124 px |
| Lista que empilha ("um jogo.") | Figtree 600, artigo em `C.mute` | 82 px, entrelinha 106 |
| Linha de apoio | Figtree 500 com destaque 700 | 56 a 62 px |
| Texto de botão | Figtree 600–700 | 31 a 40 px |
| Código e terminal | Geist Mono 500 | 58 px |
| Hex, rótulos, legendas de canto | Geist Mono 500–600, espaçamento 1,6 px, caixa alta | 15 a 22 px |

- Sempre caixa baixa nas frases, com ponto final. Espaçamento entre letras de −2,2% (o motor já aplica).
- Uma palavra em azul por frase, a que carrega o sentido ("imaginar?", "rabisco.", "infinitas.").
- Em placa escura: texto branco, destaque em limão ou rosa.

## 5. Composição e medidas (1920×1080)

- Margem das legendas de canto: 44 px. Margem lateral mínima de texto: 140 px.
- Cena com lista: texto à esquerda (x = 140 a 680) e palco à direita (x = 760 a 1800, centro em 1280, 540).
- Cena de frase única: centralizada, linha de base perto de y = 590.
- Cartões: canto de 22 a 30 px, sombra `shadow(70–90, 34–40, 0.18–0.26)`. Pílulas: canto = metade da altura.
- Traço do fio: 16 px na linha, 24 px no 8, pontas redondas.
- Âncora de vetor: quadrado branco de 13 px com contorno azul-noite de 2,5 px.
- Fecho: logo com 1000 px de largura centrada em y = 392, linha de apoio em y = 664, pílula do endereço em y = 790.

## 6. Vocabulário de elementos (o que já existe no motor ou no manifesto)

- `cursor()` com nome; `ring()` no clique; `selection()` e `anchor()`; guias de construção (círculos e raios finos).
- Barra de comando azul-noite com texto mono, cursor de texto azul e tecla enter.
- Janela de navegador com três bolinhas (rosa, limão, verde), faixas de texto, botão azul, `picture()`.
- `flower()`: o símbolo genérico de marca (8 pétalas, um 8 discreto). `hero()`: personagem de bloco.
- Amostras de cor com hex em pé; película com furos, quadros numerados, régua, losangos e agulha.
- Celular com avatar, alternador, linhas e barra de abas; notificação que salta.
- Mosaico de peças com miniaturas; placa azul-noite com frase; barra de player falsa.
- Fio em zigue-zague que vira o 8 (`eight()`, `draw8()`); logo em peças (`B8.logo`).

Antes de inventar um elemento novo, veja se um destes resolve: repetir o vocabulário é o que faz os filmes da
campanha parecerem da mesma família.

## 7. O que evitar

- Risografia, colagem, granulado, retícula, registro desalinhado, "fervura", movimento em degraus (reprovados).
- Branco cremoso, neutros quentes, degradês coloridos, brilho neon, vidro e 3D realista.
- Texto por cima de imagem cheia sem placa; mais de uma frase nova na tela ao mesmo tempo.
- Marcas e telas de ferramentas reais; o símbolo ∞; estrela de raios (lembra marca de IA existente).
- Personagem com cara de mascote infantil conduzindo a peça inteira.
- Reaproveitar elementos visuais do site nas animações (pedido dele).

## 8. Como ler referências novas

1. `scripts/folha-de-video.sh <vídeo> <prefixo>` e olhe todas as folhas, do começo ao fim.
2. Para cada vídeo, anote: paleta, tipo, quem atua, como passa de uma cena para outra, ritmo dos cortes, um detalhe
   que só ele tem.
3. Procure o que se repete entre os vídeos: isso é a direção. O que aparece em um só é tempero.
4. Diga ao Bruno em uma linha por vídeo o que você tirou. Acrescente a linha na tabela da seção 1.
5. Se as referências novas contradisserem esta página, vale a mais recente: atualize a página.
