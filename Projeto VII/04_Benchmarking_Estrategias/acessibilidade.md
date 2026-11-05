# ACESSIBILIDADE — Benchmarking de Estratégias

> Pilar 2 do DNA. Arquivo reúne as fichas do pilar e das duas vertentes
> (personalizada, progressiva), cada bloco fechado por um quadro-síntese.
>
> **Estado:** alvo completo. Pilar ACESSIBILIDADE (3 fichas + síntese),
> vertente **personalizada** (3 fichas + síntese) e vertente **progressiva**
> (3 fichas + síntese) fechados. A ficha 1 de personalizada (Duolingo/Birdbrain)
> foi aberta antes das demais, puxada por empresa e fora da ordem prescrita
> pela skill; as fichas seguintes já seguiram a ordem pilar → personalizada →
> progressiva.

---

## ACESSIBILIDADE (pilar)

*Pergunta de mecanismo: como quem não sabe nada entra e não trava?*

### Passo 1 — Definição do valor

**É:** baixar o piso de entrada de um domínio técnico sem baixar o teto de
competência — a pessoa produz algo real já no primeiro contato.

**Não é:** WCAG nem acessibilidade sensorial. Também não é simplificação que
empobrece o resultado final — o teto continua alto.

### Passo 2 — Pergunta de mecanismo

Reescrita em atrito concreto: **o que faz alguém sem nenhum repertório técnico
começar a produzir algo real, em vez de travar na primeira tela?**

### Passo 3 — Candidatos levantados

| Candidato | Distância | Mecanismo aparente |
|---|---|---|
| **Scratch (MIT Media Lab)** | direto | blocos só encaixam de formas válidas; erro de sintaxe não existe |
| **Canva** | direto | modelo pronto substitui a tela em branco |
| **Figma Community** | direto | duplicar arquivo de outra pessoa substitui criar do zero |
| **Arduino** | direto | placa e biblioteca padronizada escondem a eletrônica |
| **Super Mario Bros, fase 1-1** | análogo | a fase ensina a jogar sem nenhum texto |
| **Bicicleta de equilíbrio (balance bike)** | extremo | remove os pedais; isola o único problema (equilíbrio) |

### Passo 4 — Filtro

- **Scratch** — passa: fonte acadêmica nomeada, mecanismo nomeável, cobre em
  cheio um dos domínios do projeto (código). → ficha abaixo
- **Super Mario Bros, fase 1-1** — passa: mecanismo bem documentado por fonte
  nomeada, distância análoga (jogos), mesmo comportamento — aprender fazendo,
  sem travar. → ficha abaixo
- **Bicicleta de equilíbrio** — passa: caso radical, fora de qualquer
  software, princípio transferível mesmo sendo objeto físico. → ficha abaixo
- **Canva** e **Figma Community** — descartados nesta rodada: repetem o mesmo
  mecanismo entre si (modelo pronto reduz a decisão de partir do zero); um dos
  dois bastaria, e nenhum tem fonte primária tão nomeável quanto Scratch.
- **Arduino** — descartado por redundância com Scratch: os dois escondem
  complexidade técnica atrás de uma camada padronizada (bloco / biblioteca);
  Scratch tem fonte acadêmica melhor documentada.

---

### Scratch (MIT Media Lab) — ACESSIBILIDADE (pilar)

**Contexto** — Linguagem de programação em blocos, do Lifelong Kindergarten
Group do MIT Media Lab, usada por crianças e iniciantes em todo o mundo.

**Atrito** — Escrever código de texto exige memorizar sintaxe antes de
conseguir expressar qualquer ideia. Um erro de digitação trava o iniciante
antes que ele veja qualquer resultado — o mesmo travamento do designer diante
de uma linha de comando.

**Mecanismo** — Blocos com encaixe geométrico só permitem combinações
sintaticamente válidas.

**Como funciona**
1. Cada bloco tem um formato específico por tipo — comando, valor, condição —
   e só encaixa fisicamente onde a combinação é válida.
2. A pessoa arrasta e solta blocos; não digita código nem pontuação.
3. Clicar no bloco montado já executa o trecho, sem etapa separada de compilar.
4. Erro de sintaxe deixa de existir como categoria: o encaixe errado
   simplesmente não se conecta, em vez de gerar mensagem de erro.
5. Acima desse piso, os blocos se combinam em profundidade crescente —
   variáveis, listas, clones — sem trocar de ferramenta.

**Por que é forte** — Papert defendia "low floor" (fácil começar) e "high
ceiling" (espaço para complexidade); Resnick e a equipe do Scratch somaram
"wide walls" — projetos de tipos variados, para caber interesses diferentes.
O piso desce porque uma categoria inteira de erro é eliminada pela própria
interface, não ensinada por tutorial.

**Evidência** — (b) fonte nomeada.
- RESNICK, M. *et al.* Scratch: programming for all. *Communications of the
  ACM*, v. 52, n. 11, p. 60-67, nov. 2009. DOI: 10.1145/1592761.1592779.
  Acesso em: 25 set. 2026. Define "low floor, high ceiling" (de Papert) e a
  extensão "wide walls", da equipe do Scratch.
- O encaixe geométrico dos blocos, que impede erro de sintaxe, é observável
  diretamente no editor público, em scratch.mit.edu — evidência (a).

**Limite** — O teto declarado é mais baixo que o de uma linguagem de propósito
geral: Scratch não compila para produção nem integra bibliotecas externas do
mundo real. Quem sai do ambiente pedagógico enfrenta de novo a sintaxe de
texto, sem ponte oficial de um lado para o outro.

**Transferência** — **Adoto** o princípio de eliminar uma categoria inteira de
erro pela própria interface, em vez de ensinar a evitá-la, e **recuso** o teto
baixo: no projeto, o agente de IA precisa assumir a sintaxe real por trás,
sem trocar de ferramenta quando o resultado tiver de rodar em produção.

---

### Super Mario Bros, fase 1-1 — ACESSIBILIDADE (pilar)

**Contexto** — Primeira fase do primeiro *Super Mario Bros* (Nintendo, 1985),
jogada por praticamente todo comprador do console na época; não existe tela
de tutorial antes dela.

**Atrito** — Um jogo novo apresenta comandos, inimigos e regras que o jogador
não conhece. Explicar tudo em texto antes de jogar afasta quem só quer
começar — o mesmo efeito de um manual técnico antes do primeiro prompt.

**Mecanismo** — O próprio desenho da fase ensina a jogar, sem nenhuma palavra
escrita.

**Como funciona**
1. A fase abre com um espaço vazio à frente de Mario, convidando o jogador a
   andar e descobrir sozinho o primeiro obstáculo.
2. O primeiro inimigo é um Goomba: a equipe descartou ali um Koopa Troopa por
   ser mais difícil de vencer, segundo Miyamoto e Tezuka.
3. Os primeiros blocos de interrogação ficam num corredor estreito que força
   o contato, revelando moeda e cogumelo antes de qualquer risco maior.
4. Canos de alturas crescentes ensinam, na prática, que segurar o botão de
   pulo por mais tempo produz um salto mais alto.
5. Alguns buracos têm piso no fundo: o jogador cai, mas não morre — erra sem
   ser punido no primeiro contato com o risco.

**Por que é forte** — Miyamoto descreveu a fase como pensada para o jogador
"gradually and naturally understand what they're doing" e, ao entender
sozinho, sentir o jogo como seu. O ensino acontece dentro da própria ação, sem
pausar para instruir, e o primeiro erro é reversível por desenho, não por
sorte.

**Evidência** — (b) fontes nomeadas.
- KERR, C. How Miyamoto built *Super Mario Bros.*' legendary World 1-1. *Game
  Developer*, 8 set. 2015. Disponível em:
  https://www.gamedeveloper.com/design/how-miyamoto-built-i-super-mario-bros-i-legendary-world-1-1
  Acesso em: 25 set. 2026. Reporta a entrevista de Miyamoto e Tezuka à
  Eurogamer (2015), com a fala citada acima sobre compreensão gradual.
- WIKIPEDIA. *World 1-1*. Acesso em: 25 set. 2026. Disponível em:
  https://en.wikipedia.org/wiki/World_1-1 Reúne, a partir da mesma entrevista
  de 2015 e de análise de Jeremy Parish (1UP.com, 2012), os detalhes do
  Goomba, do corredor do cogumelo, dos canos e dos buracos com piso — **fonte
  terciária: reforçar com a entrevista original (Eurogamer/Miyamoto) antes do
  documento principal [verificar]**.

**Limite** — A fase pressupõe um jogador presente, testando por tentativa e
erro num ambiente sem custo real de falha. Fora de um jogo, corrigir errado
pode custar caro — o "piso no fundo do buraco" não existe em decisão de
negócio nem em código publicado.

**Transferência** — **Adoto** o princípio de ensinar dentro da própria tarefa,
sem tela de instrução antes de começar, e **recuso** a ausência de rede de
segurança real: no projeto, o "piso no fundo do buraco" precisa ser literal —
desfazer, sandbox, ambiente de teste — porque aqui o erro tem custo fora da
tela.

---

### Bicicleta de equilíbrio (balance bike) — ACESSIBILIDADE (pilar)

**Contexto** — Bicicleta infantil sem pedais, corrente ou rodinhas laterais,
usada como primeira bicicleta antes de a criança aprender a pedalar.

**Atrito** — Andar de bicicleta tradicional exige equilibrar e pedalar ao
mesmo tempo — duas habilidades novas e simultâneas. A rodinha lateral não
resolve: impede a queda, mas também impede a criança de sentir e corrigir o
próprio desequilíbrio.

**Mecanismo** — Remove os pedais; a criança aprende só o equilíbrio, isolado
de pedalar.

**Como funciona**
1. Sem pedais nem corrente, a criança se impulsiona com os pés no chão,
   controlando velocidade e direção.
2. Toda a atenção recai sobre uma única variável: manter o equilíbrio em
   movimento.
3. Erro de equilíbrio tem correção imediata e barata — basta apoiar o pé no
   chão, sem queda.
4. Dominado o equilíbrio, pedalar é a única habilidade nova a somar, e chega
   isolada, sem competir por atenção com o resto.

**Por que é forte** — Em vez de somar apoio externo, como a rodinha, o
mecanismo subtrai a tarefa mais difícil de dentro da tarefa composta e a
isola. A criança pratica exatamente a variável que trava o aprendizado, sem
carregar junto uma segunda variável que ainda não domina.

**Evidência**
- (a) observável no produto — bicicletas de equilíbrio comerciais não têm
  pedais, corrente nem rodinha lateral; o mecanismo é visível no objeto
  físico, sem depender de fonte terceira.
- (c) sem evidência pública de estudo controlado, localizada nesta sessão,
  comparando tempo até pedalar sem apoio entre balance bike e rodinhas. A
  afirmação de ganho ("aprende mais cedo e com mais confiança") circula em
  reportagens de varejo especializado, não em pesquisa publicada.

**Limite** — É um objeto físico para aprendizado motor; a transposição para
software vale só como princípio — "isolar uma variável" não é literal em toda
tarefa cognitiva. Também pressupõe substituir uma ferramenta inteira por
outra, custo que nem todo contexto permite pagar.

**Transferência** — **Adoto** o princípio de isolar a única variável que trava
a pessoa e adiar as demais, em vez de dar suporte a todas de uma vez, como
critério para desenhar a primeira tarefa do designer com IA agêntica: uma
tarefa que treina exatamente uma competência, sem empilhar outras exigências
no primeiro contato.

---

### Quadro-síntese — ACESSIBILIDADE (pilar)

**Padrão** — Nos três casos o piso desce por remoção ou blindagem de uma
barreira específica, nunca por instrução adicional. Scratch blinda contra
erro de sintaxe pelo formato do bloco; a fase 1-1 blinda contra punição pelo
próprio desenho do ambiente; a bicicleta de equilíbrio remove de vez a
variável mais difícil até a outra estar resolvida. Instrução em texto não
aparece em nenhum dos três.

**Princípio adotado** — ACESSIBILIDADE se entrega isolando ou blindando,
dentro da própria tarefa, exatamente a barreira que travaria um iniciante —
nunca por manual, tutorial em texto ou tela de configuração anterior à
primeira ação.

**Anti-referência** — O manual ou tutorial em texto antes da primeira ação
(por exemplo, um onboarding longo antes do primeiro prompt). Recusado porque
desloca o aprendizado para fora do momento em que ele importa — nenhum dos
três casos fortes usa esse formato — e porque, na personalidade encorajadora
do projeto, pedir para ler antes de agir comunica desconfiança na capacidade
da pessoa de aprender fazendo.

---
---

## personalizada

### Passo 1 — Definição do valor

**É:** ajustar o percurso ao repertório real da pessoa, inferindo esse repertório
do comportamento dela.

**Não é:** personalização estética (tema, avatar) nem escolha de trilha por menu.
Um seletor "iniciante / intermediário / avançado" não é personalização — é
transferir para quem menos sabe a decisão que o sistema deveria tomar.

### Passo 2 — Pergunta de mecanismo

Como se molda ao repertório e ao objetivo de cada um sem perguntar o que o
iniciante não sabe responder?

Reescrita em atrito concreto: **o que faz um sistema acertar o que a pessoa
precisa quando ela não sabe formular o pedido?**

### Passo 3 — Candidatos levantados

| Candidato | Distância | Mecanismo aparente |
|---|---|---|
| **Duolingo (Birdbrain)** | direto | erro do aluno vira estimativa de proficiência |
| **Anki (repetição espaçada)** | direto | autoavaliação por card define o intervalo de revisão |
| **Spotify (Discover Weekly)** | análogo (música) | comportamento de escuta substitui declaração de gosto |
| **Stitch Fix** | análogo (varejo de moda) | reação a imagem substitui questionário de gosto |
| **Exame de refração ("melhor assim, ou assim?")** | extremo (saúde) | pergunta impossível vira sequência de comparações binárias |

### Passo 4 — Filtro

- **Duolingo / Birdbrain** — passa: fonte primária pública, mecanismo nomeável,
  não repete ninguém. → ficha abaixo
- **Exame de refração** — passa: caso extremo, fonte de sociedade médica
  nomeada, substitui integralmente a autoavaliação por comparação par a par.
  → ficha abaixo
- **Stitch Fix** — passa: análogo fora de qualquer contexto de ensino, fonte
  oficial da própria empresa, personaliza por reação, não por declaração.
  → ficha abaixo
- **Spotify** — descartado nesta rodada: repete "inferir do comportamento
  agregado", já coberto pelo Birdbrain, sem ganhar mecanismo novo.
- **Anki** — não repete ninguém aqui, mas inverte o princípio da vertente
  (pede autoavaliação explícita por botão, não infere de erro em silêncio); é
  mais útil como progressão de dificuldade — migrou para a vertente
  **progressiva** (ver ficha lá).

---

### Duolingo (Birdbrain) — ACESSIBILIDADE › personalizada

**Contexto** — Mesmo app da ficha de `holistica.md`; o recorte aqui é o modelo
que monta cada lição, lançado em 2020.

**Atrito** — Currículo fixo serve mal aos dois extremos ao mesmo tempo. Os
autores do post oficial: *"if the material is too challenging, it's easy to get
frustrated... and if what you're seeing is too easy, then it's probably because
you've already mastered the topic!"* E perguntar o nível ao aluno não resolve:
quem está começando não tem como responder.

**Mecanismo** — Erro do aluno vira estimativa de proficiência, sem questionário.

**Como funciona**
1. A cada exercício respondido o modelo faz um palpite: *"Birdbrain makes an
   educated guess about whether a learner will get a given exercise right."*
2. Duas estimativas são atualizadas juntas — a proficiência do aluno e a
   dificuldade daquele exercício.
3. A previsão é entregue ao *Session Generator*, que monta a lição seguinte
   escolhendo *"which of all the possible exercises are at just the right
   difficulty level for this specific learner"*.
4. O modelo melhora com o volume agregado: *"The more exercises all of our
   learners complete, the more Birdbrain learns about how much you know."*
5. Nada disso aparece na interface — não existe tela de configuração de nível.

**Por que é forte** — Cada resposta é ao mesmo tempo prática e diagnóstico, então
calibrar o percurso custa zero de esforço extra e, sobretudo, zero de
constrangimento: a pessoa nunca precisa declarar o que não sabe. E como a
dificuldade do item é estimada junto com a proficiência, o sistema não depende de
alguém ter classificado o conteúdo corretamente de antemão — a calibragem emerge
do uso.

**Evidência** — (b) fonte nomeada.
- BICKNELL, K.; BRUST, C. *Learning how to help you learn: introducing
  Birdbrain*. Duolingo Blog, 7 out. 2020. Disponível em:
  https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain
  Acesso em: 18 set. 2026. Traz as formulações citadas acima e o papel do Session
  Generator na montagem da lição.

⚠️ **Não usar**: a "zona Goldilocks" e o alvo de ~80% de acerto circulam em blogs
de terceiros, mas o post oficial **não** declara taxa-alvo nem faixa de
dificuldade ideal, e não menciona teoria de resposta ao item. O que o post
justifica é só a direção — frustração se for difícil demais, redundância se for
fácil demais.

**Limite** — Exige volume. O modelo funciona porque milhões de pessoas respondem
os mesmos itens; um projeto com poucos usuários e conteúdo próprio não reproduz
essa calibragem. E personaliza dificuldade, não destino: o Birdbrain ajusta *quão
difícil*, nunca *para onde* a pessoa quer ir — o objetivo continua sendo o do
currículo, não o dela. Para um projeto cujo valor central é POTENCIALIZAÇÃO, essa
é a metade que falta.

**Transferência** — **Adotar** o princípio (inferir repertório do que a pessoa
produz e erra, em vez de perguntar num onboarding) e **recusar** a implementação:
sem base de usuários para treinar modelo, o diagnóstico sai de regras sobre os
artefatos entregues. A lacuna do Birdbrain — não personalizar objetivo — é
justamente o que o projeto precisa cobrir por outro mecanismo.

---

### Exame de refração — ACESSIBILIDADE › personalizada

**Contexto** — Etapa do exame oftalmológico em que o profissional ajusta o grau
dos óculos com o paciente olhando pelo refrator, técnica descrita em guias de
formação de oftalmologistas.

**Atrito** — Só o paciente sente a própria visão, mas ninguém sabe dizer "preciso
de menos 2,25 dioptrias" — a pergunta certa não tem resposta possível de quem
não tem repertório técnico algum sobre o próprio problema.

**Mecanismo** — Substitui a pergunta impossível por uma sequência de comparações
binárias.

**Como funciona**
1. O exame começa por uma medida objetiva automatizada, que já entrega um ponto
   de partida aproximado.
2. A partir daí, o examinador troca pares de lentes e pergunta apenas: *"Which
   do you see better, #1 or #2?"*
3. A pessoa nunca declara um valor técnico — só compara duas opções concretas,
   uma de cada vez.
4. As respostas encaminham o ajuste fino, em passos pequenos de grau, até as
   opções ficarem indistinguíveis.
5. Um teste de duas cores fecha o ajuste, perguntando qual cor aparece mais
   nítida — de novo, comparação, não declaração.

**Por que é forte** — A pessoa não precisa entender óptica para fornecer o dado
que falta; precisa só perceber qual das duas opções é mais nítida, julgamento
que qualquer um consegue fazer. A técnica transforma uma pergunta técnica sem
resposta possível numa sequência de julgamentos triviais, e cada julgamento
carrega informação suficiente para o profissional convergir no valor certo.

**Evidência** — (b) fonte nomeada.
- SILVERSTEIN, E. *Refraction 101: go forth and refract*. American Academy of
  Ophthalmology, YO Info, 12 jun. 2019. Disponível em:
  https://www.aao.org/young-ophthalmologists/yo-info/article/refraction-101-go-forth-and-refract
  Acesso em: 25 set. 2026. Descreve a instrução padrão ao paciente, a sequência
  de pares comparados e o teste de duas cores para o ajuste final.

**Limite** — A técnica precisa de um especialista humano conduzindo a sequência
em tempo real — o paciente nunca opera o processo sozinho, só responde. Não é
um formulário que a pessoa preenche em qualquer momento, sem companhia.

**Transferência** — **Adoto** o princípio de substituir a pergunta técnica
impossível por comparações binárias simples ("isto ou aquilo, o que funciona
melhor no seu caso?"), e **recuso** depender de um especialista humano
conduzindo ao vivo: no projeto, o agente de IA precisa gerar e interpretar
essas comparações sozinho.

---

### Stitch Fix (Style Shuffle) — ACESSIBILIDADE › personalizada

**Contexto** — Serviço de assinatura de roupas dos EUA, que envia caixas físicas
escolhidas por algoritmo e estilista humano; Style Shuffle é o recurso do app
lançado em março de 2018.

**Atrito** — Pedir para o cliente descrever o próprio estilo em palavras produz
respostas vagas ("gosto de básico, mas não muito"). Quem começa num domínio não
consegue nomear a própria preferência com a precisão que orientaria uma escolha.

**Mecanismo** — Curtir ou descurtir fotos de roupa, em sequência, substitui o
formulário de preferências.

**Como funciona**
1. O app mostra uma foto de peça ou combinação por vez; o cliente só responde
   com joinha para cima ou para baixo.
2. Cada resposta atualiza, em tempo real, o modelo de estilo pessoal do
   cliente, chamado internamente de "Latent Style".
3. O mesmo sinal também vem de fora do jogo: o que o cliente compra ou devolve
   das caixas físicas retroalimenta o mesmo modelo.
4. O volume agregado — 10 bilhões de interações registradas até agosto de 2022
   — constrói um mapa de estilo usado tanto pelo algoritmo quanto pelo
   estilista humano.

**Por que é forte** — Descrever gosto em palavras é uma habilidade que a maioria
não tem; reagir a uma imagem concreta com gostei ou não gostei é quase
universal. Ao trocar declaração por reação, o sistema recolhe sinal de
qualidade de qualquer pessoa, independente do vocabulário que ela tem para
falar sobre o próprio gosto.

**Evidência** — (b) fonte nomeada.
- STITCH FIX. *10 billion interactions (and counting!) on Style Shuffle: the
  data powering your personalized shopping experience*. Stitch Fix Newsroom,
  3 ago. 2022. Disponível em:
  https://newsroom.stitchfix.com/blog/10-billion-interactions-and-counting-on-style-shuffle-the-data-powering-your-personalized-shopping-experience/
  Acesso em: 25 set. 2026. Confirma o lançamento em março de 2018, os 10
  bilhões de interações e o funcionamento do "Latent Style" em tempo real.

**Limite** — O sinal é sobre gosto estético — gostar ou não de uma foto —, não
sobre necessidade funcional; o app não substitui saber o próprio caso de uso.
O mecanismo também pressupõe volume: aprende de verdade sobre um cliente ao
longo de várias caixas, não numa única interação.

**Transferência** — **Adoto** o princípio de coletar preferência por reação a
exemplos concretos, em vez de pedir descrição aberta, e **adapto** a escala:
sem 10 bilhões de interações, o sinal por reação precisa valer já nas
primeiras trocas, calibrado por regras explícitas em vez de aprendido por
volume.

---

### Quadro-síntese — personalizada

**Padrão** — Nos três casos o sistema nunca pergunta à pessoa o que ela não
sabe responder. Em vez disso, capta um sinal indireto e barato — erro
cometido, escolha entre duas opções, reação a uma imagem — e converte esse
sinal em ajuste. A pergunta explícita de repertório não aparece em nenhum.

**Princípio adotado** — A personalização do projeto nunca abre com uma
pergunta de autoavaliação; ela infere repertório e objetivo a partir de
reação a artefatos concretos — erro, comparação binária ou escolha entre
exemplos — e ajusta a partir daí.

**Anti-referência** — O seletor de nível declarado no primeiro acesso
("iniciante / intermediário / avançado"). Recusado porque transfere para quem
menos sabe exatamente a decisão que o sistema deveria tomar por inferência —
e porque rotular alguém como "iniciante" logo na entrada colide com a
personalidade encorajadora do projeto.

---
---

## progressiva

*Pergunta de mecanismo: como a dificuldade sobe sem quebrar quem começou ontem?*

### Passo 1 — Definição do valor

**É:** aumentar a exigência no ritmo que o desempenho recente da pessoa
sustenta, permitindo recuar sem custo quando ela erra.

**Não é:** dificuldade fixa por nível declarado, nem gamificação de pontos que
não altera a exigência real da tarefa.

### Passo 2 — Pergunta de mecanismo

Reescrita em atrito concreto: **o que faz a exigência subir logo depois de um
acerto e descer logo depois de um erro, sem exigir que a pessoa negocie o
próprio nível?**

### Passo 3 — Candidatos levantados

| Candidato | Distância | Mecanismo aparente |
|---|---|---|
| **Anki (repetição espaçada)** | direto | intervalo de revisão cresce ou encolhe pela resposta anterior |
| **Faixas de judô (kyu/dan)** | análogo (esporte) | exame técnico por faixa; não pula etapa |
| **Couch to 5K (NHS)** | análogo (fitness) | repete a semana inteira se não conseguir, sem recomeçar do zero |
| **Residência médica ("ver um, fazer um, ensinar um")** | extremo (saúde) | responsabilidade cresce por exposição supervisionada |
| **Curva de dificuldade de jogos (assist mode, ex. Celeste)** | extremo (jogos) | jogador ajusta manualmente o eixo de dificuldade |

### Passo 4 — Filtro

- **Anki** — passa: fonte oficial nomeada, mecanismo nomeável, não repete
  Birdbrain (aqui o sinal é autoavaliação explícita por botão; lá é inferência
  silenciosa a partir do erro). → ficha abaixo
- **Faixas de judô** — passa: fonte de federação oficial, distância análoga
  (esporte, fora de software), mecanismo de gate técnico distinto do de Anki.
  → ficha abaixo
- **Couch to 5K** — passa: fonte primária (NHS), mecanismo distinto de Anki e
  das faixas de judô — quem não consegue repete a semana inteira, sem perder o
  que já tinha conquistado nem recomeçar do zero. → ficha abaixo
- **Residência médica** — **sai do alvo**: mecanismo já usado em
  `holistica.md` (vertente prática, Ficha 2, mesma fonte Halsted). O método
  proíbe mecanismo repetido entre alvos; candidato descartado aqui por esse
  motivo, não por fraqueza.
- **Assist mode de jogos (Celeste)** — descartado: o ajuste é declarado
  manualmente pelo jogador, o que se aproxima do seletor "iniciante /
  intermediário / avançado" já recusado na vertente personalizada — repetiria
  uma recusa, não traria mecanismo novo.

---

> **Composição do trio:** com a saída da residência médica, as três fichas ficam em
> direto (Anki) e análogo (judô, Couch to 5K). A distância extrema segue coberta
> no Passo 3 e entra no quadro-síntese como anti-referência (o *assist mode*
> autodeclarado, do tipo Celeste).

### Anki (repetição espaçada) — ACESSIBILIDADE › progressiva

**Contexto** — Software gratuito e de código aberto de cartões de
memorização, usado para estudar qualquer conteúdo memorizável — idiomas,
anatomia, direito.

**Atrito** — Revisar tudo com a mesma frequência desperdiça tempo em conteúdo
já dominado e revisa de menos o que a pessoa está prestes a esquecer. Decidir
manualmente o que revisar exige uma autoavaliação que quase ninguém faz bem.

**Mecanismo** — O intervalo até a próxima revisão cresce ou encolhe pela
resposta anterior.

**Como funciona**
1. Depois de responder um cartão, a pessoa avalia a própria lembrança num de
   quatro botões: Errei, Difícil, Bom ou Fácil.
2. Cada cartão carrega um fator de facilidade próprio, que começa em 230% por
   padrão.
3. Resposta Fácil aumenta o próximo intervalo e sobe o fator de facilidade em
   15 pontos percentuais; resposta Bom mantém o fator e multiplica o
   intervalo por ele.
4. Resposta Errei manda o cartão de volta para um modo de reaprendizagem, com
   intervalo curto, sem apagar o histórico nem punir o restante do baralho.
5. O sistema evita que um cartão fique preso num intervalo curto para sempre:
   falhas repetidas não travam o fator de facilidade de forma permanente.

**Por que é forte** — A dificuldade sobe automaticamente para quem acerta — o
intervalo cresce sozinho — e desce automaticamente para quem erra, sem exigir
que a pessoa negocie o próprio nível ou reinicie do zero. O erro custa um
intervalo curto, nunca o progresso acumulado no resto do baralho.

**Evidência** — (b) fonte nomeada.
- ANKI. *What spaced repetition algorithm does Anki use?* Anki FAQs
  (documentação oficial). Disponível em:
  https://faqs.ankiweb.net/what-spaced-repetition-algorithm Acesso em: 25 set.
  2026. Descreve o fator de facilidade inicial de 230%, os ajustes de 15 e 20
  pontos por resposta e o modo de reaprendizagem para cartões errados.

**Limite** — O sistema pressupõe granularidade artificial — cartão único,
resposta certa ou errada — que não existe em toda tarefa; decidir sobre um
projeto de negócio não se resume a "lembrei ou esqueci". A autoavaliação nos
botões também é declarada pela pessoa: se ela se avalia mal, o intervalo erra
junto.

**Transferência** — **Adoto** o princípio de ajustar a exigência
automaticamente pela resposta anterior, para cima em acerto e para baixo em
erro, sem checkpoint fixo por nível. **Adapto** a granularidade: em vez de
cartão certo ou errado, o sinal do projeto vem da revisão do artefato
entregue pelo agente de IA.

---

### Faixas de judô (sistema kyu/dan) — ACESSIBILIDADE › progressiva

**Contexto** — Sistema de graduação por faixas coloridas do judô, criado por
Jigoro Kano e adotado por federações nacionais, entre elas a British Judo
Association.

**Atrito** — Ensinar uma técnica avançada — uma finalização, uma projeção
complexa — para quem ainda não sustenta as quedas básicas é perigoso e
ineficaz. Alguém precisa decidir, de forma visível e aceita por todos, quando
a pessoa está pronta para o próximo degrau.

**Mecanismo** — Exame técnico por faixa; a pessoa só avança demonstrando o
grau atual.

**Como funciona**
1. O praticante avança por seis graus kyu, em ordem, antes de poder tentar a
   faixa preta.
2. Cada grau tem um currículo técnico próprio, definido pela federação, que
   precisa ser demonstrado na prática, não só estudado.
3. O exame cobra também o vocabulário japonês da técnica, associando nome e
   execução.
4. Não existe atalho: o praticante não pula grau, mesmo demonstrando talento
   em técnicas de graus mais altos.
5. O prazo até a faixa preta varia por dedicação — de dois a três anos de
   treino regular —, mas a ordem dos graus não varia.

**Por que é forte** — O avanço fica amarrado a uma demonstração concreta, não
a tempo de calendário nem a autoavaliação. A faixa é reconhecida por qualquer
outro praticante no mundo, então a pessoa sempre sabe, e todos ao redor
sabem, exatamente que exigência ela já sustenta.

**Evidência** — (b) fonte nomeada.
- BRITISH JUDO ASSOCIATION. *Kyu grade scheme*. Disponível em:
  https://www.britishjudo.org.uk/get-started/grading/kyu-grade-scheme/ Acesso
  em: 25 set. 2026. Descreve os seis graus kyu, a exigência de demonstração
  técnica e de terminologia japonesa, e o prazo de dois a três anos até a
  faixa preta.

**Limite** — O exame depende de um examinador humano presente fisicamente —
não escala para autoatendimento digital. E o sistema mede técnica isolada,
não desempenho sob pressão real: um exame de faixa não é uma luta valendo
algo.

**Transferência** — **Adoto** o princípio de gate técnico visível e sem
atalho por grau, e **recuso** a dependência de examinador humano presencial:
no projeto, o "exame" de cada etapa precisa ser um critério que o próprio
agente de IA ou um artefato entregue consiga verificar, sem depender de
alguém graduando em pessoa.

---

### Couch to 5K (NHS) — ACESSIBILIDADE › progressiva

**Contexto** — Programa de corrida para iniciantes do serviço público de
saúde britânico (NHS), gratuito, com plano em PDF, site e app com locução de
treinador.

**Atrito** — Quem nunca correu não aguenta 30 minutos seguidos, mas subir a
meta toda semana sem margem expulsa quem tiver uma semana ruim. Recomeçar do
zero depois de falhar desmotiva mais do que o cansaço físico em si.

**Mecanismo** — Repete a semana inteira se não conseguir, sem recomeçar do
zero.

**Como funciona**
1. O plano dura 9 semanas, com 3 sessões por semana, cada uma alternando
   corrida e caminhada.
2. Na semana 1, a pessoa corre 1 minuto e caminha 1 minuto e 30 segundos,
   repetindo o ciclo 7 vezes, com aquecimento e volta à calma a pé.
3. A cada semana o tempo de corrida cresce e o de caminhada encolhe, até a
   semana 9, com três sessões de 30 minutos de corrida contínua.
4. Quando a semana é difícil demais, a orientação oficial é repetir a mesma
   semana quantas vezes for preciso, em vez de avançar ou desistir.
5. O app opcional guia o ritmo por áudio e marca o tempo de cada trecho, sem
   exigir que a pessoa calcule nada sozinha.

**Por que é forte** — A meta sobe automaticamente a cada semana concluída, mas
falhar não custa o progresso acumulado — só adia o próximo degrau. Ao nomear a
repetição como caminho oficial, e não como fracasso, o programa tira da
pessoa a culpa de "não estar pronta" e devolve isso a uma variável do plano.

**Evidência** — (b) fonte nomeada.
- NHS. *Couch to 5K running plan*. Better Health, NHS. Disponível em:
  https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/couch-to-5k-running-plan/
  Acesso em: 25 set. 2026. Traz a estrutura de 9 semanas, o padrão da semana 1
  e a orientação oficial: *"if you need to repeat any of the runs or weeks,
  that's totally okay."*

**Limite** — O plano é de calendário, não de desempenho fino: a meta da
semana é igual para todo mundo, e só a permissão de repetir absorve a
diferença entre pessoas. Não existe ajuste dentro da semana, só entre uma
semana e a próxima.

**Transferência** — **Adoto** o princípio de nomear a repetição como caminho
oficial do plano, nunca como fracasso, e **adapto** a granularidade: no
projeto, a unidade que pode ser repetida sem penalidade é a tarefa entregue
pelo agente de IA, não uma semana de calendário.

---

### Quadro-síntese — progressiva

**Padrão** — Anki, faixas de judô e Couch to 5K sobem a exigência em resposta
a um critério de desempenho verificável — resposta ao cartão, exame técnico,
conseguir concluir a corrida da semana —, nunca por autodeclaração de nível.
Quando a pessoa erra ou não atinge o critério, os três mecanismos permitem
repetir a mesma etapa sem punição, em vez de expulsá-la ou mandá-la para o
início.

**Princípio adotado** — A dificuldade no projeto sobe e desce em resposta ao
desempenho verificável na tarefa anterior — nunca por um nível declarado no
início nem por tempo de uso —, e todo recuo devolve a pessoa a uma exigência
menor sem apagar o que ela já tinha conquistado.

**Anti-referência** — O ajuste de dificuldade autodeclarado pelo próprio
usuário, à moda de um *assist mode* de jogo, em que a pessoa escolhe
manualmente reduzir a exigência. Recusado porque devolve à pessoa exatamente
a decisão que ela ainda não tem repertório para tomar bem — o mesmo motivo
que já levou o projeto a recusar o seletor "iniciante / intermediário /
avançado" na vertente personalizada.
