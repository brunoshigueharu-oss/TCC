---
name: motion-base8
description: >
  Cria vídeos e animações em código na linguagem de motion do BASE8 (a do manifesto da campanha "Até onde?"):
  interface como personagem, estúdio branco, formas chapadas, um fio azul contínuo, cursores com nome, tipografia em
  caixa baixa e cortes na batida de 120 BPM. Traz o motor pronto, um filme-modelo, scripts de conferência e a lista dos
  erros que já aconteceram. Use SEMPRE que o Bruno pedir motion, vídeo, animação, vinheta, teaser, episódio da série,
  peça de divulgação, abertura ou encerramento, reels ou stories animados, "anima esse roteiro", "faz o motion de…",
  "na vibe do manifesto", "igual aos outros vídeos", ou quando ele mandar vídeos de referência de motion, mesmo que
  não cite a skill. Não use para animação de interface dentro do app Next.js (skill `motion`) nem para o efeito de
  caracteres (skill `efeito-ascii`).
---

# Motion do BASE8

O Bruno dirige (roteiro, referências, notas) e você programa. Cada filme é uma página com um canvas que desenha o
segundo `t`; o VideoHub toca essa página sem renderizar e é lá que ele revisa.

O exemplo completo é o manifesto: `/Users/brunohigashi/Documents/Claude Code/Videos/films/base8-manifesto/film.js`
(30 s, 6 cenas). Leia os trechos dele quando precisar ver uma receita aplicada de ponta a ponta.

## 0. Antes de animar

1. **Tenha um roteiro.** Os roteiros ficam em `Projeto VII/07_Divulgacao/02_Roteiros/`. Sem roteiro, ajude a escrever
   um (cenas com tempo, textos na tela, trilha) e espere o sim dele: animar antes do roteiro já gerou retrabalho.
2. **Veja em que pé a campanha está.** Leia a memória `tcc-videos-divulgacao-hyperframes.md` (voz, trilha, o que foi
   aprovado e reprovado) e as notas dele no manifesto (`hub_notes` com `project` = pasta do manifesto e
   `status: "all"`). A direção muda com o retorno dele: **uma nota do Bruno vale mais do que esta skill**. Quando uma
   nota contradisser algo daqui, siga a nota e corrija a skill no mesmo trabalho.
3. **Carregue as skills `videohub` e `motion-design`.** São regras globais dele; esta skill só acrescenta a linguagem
   da marca por cima.
4. **Se ele mandar vídeos de referência, olhe todos antes de decidir qualquer coisa.**
   `scripts/folha-de-video.sh <vídeo> <prefixo>` vira o vídeo em folhas de quadros. Diga a ele, em uma linha por
   vídeo, o que você tirou de cada um. Referência dele é direção de arte, não só de movimento.
5. **Regras que não mudam:**
   - Não renderize. Prévia pelo `hub_live`; render só quando ele pedir, pelo `hub_render`.
   - Nada que gaste créditos (narração, imagem ou vídeo gerados) sem um sim explícito. A trilha provisória é
     sintetizada em código justamente por isso.
   - Peça refeita não apaga a anterior: mova a versão antiga para `versoes-antigas/<peça>-vN_<o-que-a-distingue>/`
     dentro da pasta do filme.
   - Fora da tela: o símbolo ∞, marcas e telas de ferramentas reais de IA. O endereço `base8.com` é fictício.

## 1. A linguagem em uma página

A ideia por trás de tudo: **o vídeo é feito de código e parece feito de código**. Por isso os elementos são os que um
designer reconhece do próprio trabalho (cursor, botão, alça de vetor, amostra de cor, linha do tempo), limpos e exatos.

- **Interface como personagem.** Quem atua são pílulas, cartões, botões, alternadores e janelas. Um elemento vira o
  outro (a barra vira plataformas, o botão vira símbolo) em vez de sair e entrar outro.
- **Um fio azul nunca sai da tela.** Em cada filme, escolha o elemento azul que carrega a história e faça-o passar de
  forma em forma (no manifesto: ponto → linha → rabisco → cursor de texto → personagem → botão → flor → avatar → fio
  → 8 → logo). É o que amarra cortes rápidos.
- **Cursores com nome.** "você" (azul-noite) faz as coisas; "IA" (rosa) aparece quando a IA age. Um cursor chega
  antes de clicar e o clique tem consequência visível.
- **Marcas de ofício:** guias de construção, âncoras e alças de vetor, caixa de seleção, amostras de cor com hex,
  régua com marcações, linha do tempo com agulha e losangos, legendas de visor nos cantos (contador de quadros).
- **Fundo de estúdio:** branco puro em cima e chão frio embaixo. O Bruno não gosta de branco cremoso nem de neutros
  quentes.
- **Texto:** caixa baixa, frase curta com ponto final, uma palavra em azul. Entra palavra por palavra subindo de uma
  máscara. Texto sempre sobre fundo liso; se a imagem atrás for cheia, ponha o texto numa placa azul-noite.
- **Cor:** branco, azul-noite e azul dominam; rosa, verde e limão entram como faísca e crescem até a logo colorida
  chegar. Corte de cor chapada (tela inteira) só em rajadas rápidas.
- **Humor seco:** uma piada visual por filme no máximo (o vídeo que "pausa", o quiz que responde 8). Tom
  profissional; nada infantil nem mascote conduzindo a peça.
- **Não volte para o que foi reprovado em 24/11/2026:** risografia, colagem, granulado, retícula, registro
  desalinhado, "fervura" e movimento em degraus de 12 poses.

| Papel | Cor | Uso |
|---|---|---|
| fundo | `#FFFFFF` → chão `#DFE3EA` | estúdio |
| tinta | `#1B1F3B` azul-noite | texto, formas, placas, cursor "você" |
| fio | `#0B8FE0` azul | o elemento que carrega a história, palavra de destaque |
| faíscas | `#FF48B0`, `#12A180`, `#F5EE4A` | detalhes, cursor "IA" (rosa), cortes da rajada |
| apoio | `#EEF0F5`, `#D5D9E3`, `#B7BCCB`, `#8A90A6` | cartões, linhas, texto apagado, legendas |

Fontes: Figtree (peso 600 nas frases, 700–800 em destaque) e Geist Mono (código, hex, legendas). São as do app.

Detalhes, medidas e o que cada vídeo de referência trouxe: `references/direcao-de-arte.md`. Leia antes de desenhar
uma cena nova.

## 2. Passo a passo

1. **Crie a pasta do filme.** `hub_workspace` diz qual é a pasta de filmes. Depois:
   `scripts/novo-filme.sh "<pasta de filmes>/<nome-do-filme>" <duração>`. Ele copia o filme-modelo (motor, fontes,
   logo, som) e o `render.js` do VideoHub já em 60 qps. Formato padrão: 1920×1080 (YouTube). Vertical: troque o
   tamanho do canvas no `index.html` e `VW`/`VH` no `render.js`; o motor lê o tamanho do canvas.
2. **Decupe o roteiro na grade de 120 BPM** antes de desenhar: 1 batida = 0,5 s = 30 quadros. Escreva a linha do
   tempo como comentário no topo do `film.js` (tempo → o que acontece → som). Entradas, cliques e cortes caem na
   batida ou na metade dela; cortes sempre em múltiplos de 1/60 s. Cenas aceleram em direção ao clímax (2 s, 1,5 s,
   1 s… até rajadas de 0,25 s) e o clímax termina em corte seco.
3. **Escreva as cenas com o motor.** `motor.js` expõe `B8` (curvas, molas, texto que sobe, cursor, alças, flor,
   personagem, logo em peças, legendas, borrão de movimento) e cada função tem um comentário de uso. Guarde no topo
   do arquivo o layout que duas cenas compartilham, para as formas casarem na passagem. Receitas prontas (transformar
   uma forma em outra, digitar, rajada, zoom em degraus, montar a logo): `references/movimento.md`.
4. **Confira em quadros parados, não em render.**
   `scripts/quadros.sh "<filme>" <folha.jpg> 0.7 1.5 2.4 …` monta uma folha com até 8 quadros; olhe a folha e abra um
   quadro solto (`snaps/<t>.jpg`) quando precisar de detalhe. Cubra toda entrada, toda passagem e o último quadro.
   Depois `node scripts/varrer.js "<filme>"` passa por todos os quadros atrás de erro.
5. **Faça a trilha provisória** em `make-audio.js` com `som.js`, nos mesmos tempos do filme (os cortes, cliques e
   teclas). Ela só serve para sentir o ritmo: o mix final vem do Ableton Live e substitui `audio/mix.wav`. Se o
   roteiro pede silêncio, o silêncio é absoluto (`m.silence(t0, t1)` depois de todos os sons).
6. **Registre e abra.** `hub_project({project, set: {title, status: "in-progress", render: {workers: 2, env: {DUR}}}})`
   e `hub_live({project})`. Pare e diga a ele, em português, para assistir no VideoHub, deixar notas nos quadros e
   apertar **Send to your agent**. Conte o que você acrescentou por conta própria ao roteiro, para ele poder cortar.
7. **Notas chegam → corrija no código** (a prévia recarrega sozinha) e marque cada uma com `hub_note_update`.
   Atualize a memória da campanha com o que ele aprovou ou reprovou.

## 3. Como o movimento se comporta

- **Entrar:** `E.oExpo` (chega rápido e pousa), 0,3 a 0,55 s. **Sair:** `E.iCubic` (acelera), 0,2 a 0,25 s.
  Nunca linear, exceto agulha de linha do tempo e contadores.
- **Estalar e transformar:** `spring(t - t0, f, z)`. Estalo de peça pequena: `f` 5–6, `z` 0,5. Forma que vira outra:
  `f` 3–3,6, `z` 0,5–0,6. Janela ou cartão pesado: `z` 0,7 (quase sem passada).
- **Antecipação antes do golpe:** a barra encolhe 8% antes de explodir, o símbolo gira um pouco para trás antes de
  girar. **Reação depois:** a plataforma afunda quando o personagem pousa, o celular treme na notificação.
- **Três camadas em toda cena:** o que conduz (o fio azul), o que acompanha (cursor, âncoras, placar, rastro) e o que
  dá vida ao fundo (régua, contador de quadros, guias).
- **Um foco por vez:** o item novo em azul-noite, os anteriores apagam para `C.dim`. No máximo um terço dos
  elementos se mexe ao mesmo tempo.
- **Borrão de movimento só nos trechos rápidos** (`fast: [[t0, t1, amostras]]`), 4 a 6 amostras.

## 4. Erros que já aconteceram

| Sintoma | Causa | O que fazer |
|---|---|---|
| Palavras somem numa placa escura | `reveal` pinta em azul-noite por padrão | passe `dc: C.white` |
| Elemento que deveria se transformar some atrás de um cartão | ordem de desenho | desenhe o que está em transformação depois do cartão novo |
| Símbolo de pétalas parece engrenagem | lóbulos em senoide com furo no meio | use `flower` (8 círculos + miolo) |
| Cursor em cima do item errado no clique | chegou exatamente no instante do clique | chegue 0,05 a 0,1 s antes e segure (`kf` com quadro repetido) |
| Um quadro mistura duas cenas | borrão atravessando o corte | o motor só amostra para a frente; mantenha os cortes em múltiplos de 1/60 s |
| Forma "pula" entre duas cenas | cada cena calculou a posição por conta própria | constantes de layout compartilhadas no topo do arquivo |
| Texto estoura a tela | tamanho fixo | meça com `lay(...).width` e reduza; margem lateral mínima de 140 px |
| Animação diferente a cada vez que toca | `Math.random()` ou estado entre quadros | `rnd(i, semente)`, `vn(x, semente)`; tudo função de `t` |
| `node render.js snap` diz que falta `puppeteer-core` | o filme não tem `node_modules` | os scripts da skill já definem `VIDEOHUB_DIR` |
| Folha de quadros falha com "Invalid chars" | zsh lê `$n:l` como modificador | os scripts usam bash; não reescreva em zsh |
| Comando fica retido esperando aprovação | `rm -rf` no meio do comando | não apague; crie pasta nova (`teste-2`) |
| Logo aparece com serrilhado | peça recortada sem a borda suave | `B8.logo.load` já leva a borda; não recorte por retângulo |

## 5. Antes de abrir a prévia

- [ ] Todos os textos do roteiro estão na tela, na ordem, e dá tempo de ler cada um (0,6 s parado no mínimo).
- [ ] O fio azul está presente do primeiro ao último quadro.
- [ ] O último quadro está limpo (serve de miniatura): logo, linha de apoio, endereço, sem legendas de canto.
- [ ] `varrer.js` sem erros; folhas de quadros vistas para todas as passagens.
- [ ] `audio/mix.wav` tem a mesma duração do filme; silêncios do roteiro estão zerados.
- [ ] `README.md` do filme diz roteiro, direção e o que é provisório.
- [ ] Nada foi renderizado.
