# INOVAÇÃO — Benchmarking de Estratégias

> Pilar 4 do DNA. Arquivo reúne as fichas do pilar e das duas vertentes (ousado,
> gamificado), cada bloco fechado por um quadro-síntese.
>
> **Estado:** alvo completo. Pilar INOVAÇÃO fechado (Cursor, Nubank, Nintendo Wii)
> e as duas vertentes fechadas — ousado (Basecamp/Shape Up, Patagonia, 42 School)
> e gamificado (Duolingo, cartão-fidelidade/progresso dotado, Beeminder) —, cada
> bloco com quadro-síntese. Pendências pontuais de dado ficam marcadas com
> `[verificar]` dentro de cada ficha; nenhuma trava a leitura do capítulo.

---

## INOVAÇÃO (pilar)

### Passo 1 — Definição do valor

**É:** trocar o critério que o setor usa para provar valor — credencial prévia,
estrutura física, especificação técnica — por outro mais acessível a quem fica
de fora desse critério.

**Não é:** novidade estética ou lançamento de recurso. É decisão estrutural que
o concorrente direto evita por medo de perder o que já tem.

### Passo 2 — Pergunta de mecanismo

O que faz que os concorrentes não ousam fazer?

Reescrita em atrito concreto: **que prova de qualidade o setor exige de quem
entrega, e o que trava para quem não tem essa prova mas entrega o resultado?**

### Passo 3 — Candidatos levantados

| Candidato | Distância | Mecanismo aparente |
|---|---|---|
| **Cursor (Anysphere)** | direto | agente edita código e roda comando sozinho |
| **Nubank no lançamento (2013)** | análogo | banco sem agência e sem tarifa |
| **Nintendo Wii** | extremo | ignora a corrida de potência gráfica |
| **Olin College** | extremo | engenharia sem departamentos |
| **Figma (navegador, multiplayer)** | direto | design colaborativo sem instalar nada |

### Passo 4 — Filtro

- **Cursor** — passa: direto, observável na própria documentação oficial, e o
  mecanismo (ceder execução ao agente) é o núcleo do projeto. → ficha abaixo
- **Nubank** — passa: análogo (fintech, não design/tech), evidência oficial
  nomeada, mecanismo (recusar o sinal de solidez do setor) não se repete.
  → ficha abaixo
- **Nintendo Wii** — passa: extremo, caso descrito em fonte nomeada (site
  oficial do framework *Blue Ocean Strategy*), mecanismo (mirar quem fica de
  fora da métrica do setor) não se repete. → ficha abaixo
- **Olin College** — em espera: repete, em espírito, o mecanismo educacional
  que a vertente ousado já cobre com a 42 School (ruptura estrutural de
  instituição de ensino) — evitar redundância entre pilar e vertente.
- **Figma** — em espera: mecanismo (colaboração em tempo real) serve melhor ao
  pilar CONEXÃO, já fechado com Patreon; manter fora para não duplicar valor.

---

### Cursor — INOVAÇÃO

**Contexto** — Editor de código com IA integrada da empresa Anysphere, usado por
times de engenharia em produtos comerciais desde 2023.

**Atrito** — Editores tradicionais autocompletam trechos, mas exigem que a
pessoa decida cada passo e rode cada comando manualmente. Diante de tarefa fora
do próprio domínio técnico, essa divisão trava o trabalho.

**Mecanismo** — A pessoa entrega a tarefa inteira; o agente edita e testa até concluir.

**Como funciona**
1. A pessoa descreve a tarefa em linguagem natural, sem especificar o arquivo
   ou o comando.
2. O agente localiza sozinho os arquivos relevantes no projeto.
3. Ele aplica as edições direto e executa comandos de terminal para testar o
   próprio resultado.
4. O agente encadeia várias chamadas de ferramenta na mesma tarefa e segue até
   concluir. *O quanto ele pede confirmação antes de rodar comandos depende da
   configuração do usuário [verificar na documentação antes de citar].*
5. A pessoa revisa o resultado depois, com pontos de restauração que revertem
   tudo a um estado anterior se o agente errar.

**Por que é forte** — Inverte a ordem do controle: em vez de decidir cada
micro-passo, a pessoa decide o resultado final e verifica depois. Isso remove o
requisito de saber operar o domínio técnico para obter o resultado nele — o que
um editor tradicional não faz, porque cederia controle demais ao software.

**Evidência**
- (b) CURSOR (Anysphere). *Agent*. Cursor Docs. Disponível em:
  https://cursor.com/docs/agent/overview
  Acesso em: 25 set. 2026. Confirma que o Agente "complete[s] complex coding
  tasks independently, run[s] terminal commands, and edit[s] code", sem limite
  de chamadas de ferramenta por tarefa, e com pontos de restauração para
  reverter alterações.

**Limite** — Autonomia alta também erra sozinha: o ponto de restauração existe
porque o agente pode aplicar edição errada antes de a pessoa perceber. O
mecanismo também pressupõe ambiente de execução real (terminal, arquivos) — não
serve a domínio sem essa infraestrutura.

**Transferência** — **Adoto** a lógica de "decidir o resultado, não o passo a
passo" como núcleo do projeto: o designer aciona o agente e revisa o que ele
entrega, sem operar o domínio técnico linha a linha. **Adapto** a revisão: ela
precisa vir explicada, para o designer entender o que aceita (ver a
anti-referência de POTENCIALIZAÇÃO).

---

### Nubank — INOVAÇÃO

**Contexto** — Banco digital brasileiro fundado em 6 de maio de 2013 por David
Vélez, Cristina Junqueira e Edward Wible. Número exato de clientes em 2023
**[verificar]**: a leitura da fonte oficial não permitiu confirmar o dado com
segurança — consultar relatório da Nu Holdings antes de citar no documento
principal.

**Atrito** — Bancos tradicionais no Brasil cobravam tarifa alta e mantinham
agência física como sinal de solidez. Investidores do setor consideravam banco
sem agência e sem tarifa inviável.

**Mecanismo** — Recusar a agência física e a tarifa — sinais de solidez do
setor — e apostar só no aplicativo.

**Como funciona**
1. A operação nasce inteiramente digital: sem agência, sem estrutura física de
   atendimento.
2. O primeiro produto, lançado em 2014, é um cartão de crédito internacional
   sem anuidade, controlado por aplicativo.
3. O modelo é apresentado a investidores antes de existir prova de mercado — só
   a promessa de eliminar burocracia e taxa.
4. O crescimento se apoia no boca a boca de clientes insatisfeitos com a
   experiência bancária tradicional.

**Por que é forte** — O setor tratava presença física e tarifa como prova de
confiança. Ao remover as duas, o produto trocou essa prova por outra —
conveniência e transparência de custo, validada pelo próprio uso do aplicativo.
Isso abriu um público que a banca tradicional não disputava, por julgá-lo pouco
rentável.

**Evidência**
- (b) NU HOLDINGS. *Nubank comemora dez anos e abre o escritório para evento
  com imprensa e influenciadores*. Sala de Imprensa Nu, 2023. Disponível em:
  https://nu.com/pt/sala-de-imprensa/companhia/nubank-comemora-dez-anos-e-abre-o-escritorio-para-evento-com-imprensa-e-influenciadores
  Acesso em: 25 set. 2026. Registra a fala de David Vélez sobre a reação dos
  especialistas do setor à proposta original de banco 100% digital e sem
  tarifa. *Redação exata da citação em português [verificar]: a leitura desta
  ficha usou um resumo da página, não o parágrafo integral — conferir a frase
  literal antes de citar entre aspas no documento principal.*

**Limite** — Sem agência, o produto exige confiança inteira num aplicativo e
num suporte remoto — parte do público mais velho ou menos digital fica de fora
justamente pelo que diferencia o produto.

**Transferência** — **Adoto** o princípio de recusar o sinal de solidez do
setor — aqui, o diploma ou a certificação formal — e substituí-lo por prova de
uso: o resultado que o designer entrega com apoio da IA agêntica, não o crachá
que carrega.

---

### Nintendo Wii — INOVAÇÃO

**Contexto** — Console doméstico da Nintendo, lançado em 2006, concorrendo com
PlayStation 3 (Sony) e Xbox 360 (Microsoft).

**Atrito** — A indústria de consoles competia havia décadas numa corrida de
potência gráfica, mirando o público que já jogava. Quem nunca jogou não via
motivo para começar.

**Mecanismo** — Abandonar a corrida por potência gráfica e mirar quem nunca
jogou vídeo game.

**Como funciona**
1. O controle de movimento simples substitui a potência gráfica como
   diferencial do console.
2. O preço de lançamento fica abaixo do Xbox 360 e do PlayStation 3 — o valor
   percentual exato **[verificar]**: circula em cobertura de mercado, não no
   material oficial consultado.
3. O jogo de lançamento (Wii Sports) mira famílias e não jogadores, não o
   público competitivo tradicional.
4. A empresa evita deliberadamente comparar especificação técnica com a dos
   concorrentes.

**Por que é forte** — Em vez de disputar a mesma fatia de jogadores exigentes,
o produto mira quem a indústria nunca tentou converter. Ao ignorar a métrica
que definia a competição, cria uma categoria de público nova em vez de uma
fatia maior da antiga.

**Evidência**
- (b) BLUE OCEAN STRATEGY (KIM, W. C.; MAUBORGNE, R.). *Nintendo Wii: video
  gaming case study*. Disponível em:
  https://www.blueoceanstrategy.com/teaching-materials/nintendo-wii/
  Acesso em: 25 set. 2026. Descreve a estratégia como reorientação "from
  current competition to alternatives and from customers to noncustomers".

**Limite** — O material oficial consultado não traz número de venda nem data
exata de lançamento. A estratégia dura enquanto ninguém copia o mesmo
movimento: Sony e Microsoft lançaram controle de movimento próprio (Move e
Kinect) poucos anos depois, e o mercado voltou a se acirrar na mesma métrica.

**Transferência** — **Recuso** copiar o abandono total de rigor técnico ao pé
da letra — o projeto não pode ignorar qualidade técnica, só a exigência de que
o designer a domine sozinho. **Adapto** o princípio: mirar quem hoje não tenta
o domínio técnico por achar a barreira de entrada alta demais.

---

### Quadro-síntese — INOVAÇÃO (pilar)

**Padrão** — Nas três fichas, o mecanismo ousado desloca o critério que o setor
usa para provar valor — linha de código dominada, agência física, potência
gráfica — para outro, mais acessível a quem fica de fora desse critério.

**Princípio adotado** — O projeto mede o resultado entregue com apoio do
agente, não a credencial prévia do designer no domínio técnico.

**Anti-referência** — A corrida de especificação, que o Wii abandonou: competir
por mais recurso técnico (modelo mais potente, mais integrações, mais comandos)
em vez de competir por quem hoje fica de fora. Recusada porque o público do
projeto não trava por falta de recurso, e sim por falta de entrada. Somar
recursos aumenta a distância entre o designer e o domínio técnico.

---

## ousado

### Passo 1 — Definição do valor

**É:** quebrar uma convenção do setor de propósito, sabendo o que se ganha com
isso.

**Não é:** rebeldia estética ou ruptura de marketing sem ganho real para quem
usa. Também não é o mesmo mecanismo do pilar — aqui a convenção quebrada é de
processo ou de discurso, não de critério de competência técnica.

### Passo 2 — Pergunta de mecanismo

Que convenção do setor quebra de propósito, e o que ganha com isso?

Reescrita em atrito concreto: **o que a convenção do setor protege, e o que ela
trava para quem está por fora dela?**

### Passo 3 — Candidatos levantados

| Candidato | Distância | Mecanismo aparente |
|---|---|---|
| **Basecamp / Shape Up** | direto | sem backlog nem sprint — só aposta de 6 semanas |
| **Patagonia ("Don't Buy This Jacket")** | análogo | anúncio pede para não comprar o produto |
| **42 School** | extremo | escola sem professor e sem mensalidade |
| **Liquid Death** | análogo | água mineral vendida como marca punk/heavy metal |
| **Minerva University** | extremo | universidade sem campus fixo, roda por 7 cidades |

### Passo 4 — Filtro

- **Basecamp / Shape Up** — passa: direto (processo de entrega de produto,
  mesmo domínio de quem executa projeto com apoio de IA), oficial e gratuito,
  mecanismo (recusar backlog permanente) não se repete. → ficha abaixo
- **Patagonia** — passa: análogo (varejo/marketing, não tech), evidência
  farta e nomeada, mecanismo (pedir para não comprar) não se repete.
  → ficha abaixo
- **42 School** — passa: extremo (educação, setor mais distante dos três),
  oficial, mecanismo (ensino sem professor e sem mensalidade) não se repete e
  não apareceu no pilar. → ficha abaixo
- **Liquid Death** — em espera: repete em espírito o mecanismo de "provocação
  como prova de coerência" que Patagonia já cobre.
- **Minerva University** — em espera: repete "instituição sem estrutura física
  fixa" que a 42 School já cobre por outro eixo (sem professor).

---

### Basecamp (Shape Up) — INOVAÇÃO › ousado

**Contexto** — Empresa de software (Basecamp/37signals) que desenvolveu o
método Shape Up para o próprio processo de produto e o publicou de graça.

**Atrito** — Times de produto usam sprint e backlog há décadas como convenção
de gestão ágil. O backlog cresce sem parar e nunca esvazia: ele estoca decisão
adiada, não organiza trabalho.

**Mecanismo** — Cancelar o backlog permanente; cada ciclo de seis semanas nasce
de uma aposta, não de uma lista.

**Como funciona**
1. Não existe backlog central: pedido, ideia e bug ficam soltos até alguém
   decidir moldá-los numa proposta.
2. A cada ciclo, uma mesa de apostas decide o que entra nas próximas seis
   semanas — só isso entra.
3. O prazo de seis semanas é fixo; por padrão, o projeto não ganha extensão se
   estourar o tempo.
4. Entre um ciclo e outro há uma semana de resfriamento, sem compromisso novo,
   para pensar a próxima aposta.

**Por que é forte** — O backlog tradicional promete lembrar toda ideia, mas na
prática vira depósito de decisão adiada. Apostar por ciclo fechado força a
prioridade a se decidir antes do trabalho começar, não durante.

**Evidência**
- (b) SINGER, R. *Bets, not backlogs*; *The Betting Table*. In: SINGER, R.
  *Shape Up: Stop Running in Circles and Ship Work that Matters*. Basecamp.
  Disponível em: https://basecamp.com/shapeup/2.1-chapter-07 e
  https://basecamp.com/shapeup/2.2-chapter-08
  Acesso em: 25 set. 2026. Livro oficial e gratuito da Basecamp descreve a mesa
  de apostas e a ausência de backlog central. *Ano de publicação [verificar]:
  o site não expõe data de edição na página consultada.*

**Limite** — Sem backlog, ideia que não vira aposta se perde — o método aceita
esquecer em troca de não acumular. Também exige uma mesa de apostas com
autoridade real para decidir; sem isso, o ciclo de seis semanas vira só um
prazo mais curto de sprint.

**Transferência** — **Adoto** o ciclo de prazo fixo e aposta única no lugar de
lista crescente de tarefa. **Recuso** aplicar isso a decisão que exige registro
formal — nesses casos, esquecer custa caro demais para o encorajamento
prometido.

---

### Patagonia — INOVAÇÃO › ousado

**Contexto** — Marca de vestuário outdoor americana. A peça analisada é o
anúncio de página inteira publicado no The New York Times em 25 de novembro de
2011 (Black Friday).

**Atrito** — Todo anúncio de varejo na Black Friday pede para comprar mais.
Marca que assume pauta ambiental corre o risco de parecer hipócrita ao pedir
qualquer consumo.

**Mecanismo** — Publicar, no dia de maior venda do ano, um anúncio pedindo para
não comprar o próprio produto.

**Como funciona**
1. O anúncio mostra o casaco mais vendido da marca (fleece R2) sob o título
   "Don't Buy This Jacket".
2. O texto lista o custo ambiental real do casaco: emissão de gases, consumo
   de água, resíduo gerado.
3. A peça pede explicitamente para o consumidor comprar menos e refletir antes
   de gastar.
4. A campanha promove, junto, o programa de reparo e reciclagem Common Threads
   da própria marca.

**Por que é forte** — Contraria o interesse de curto prazo — vender mais no
Black Friday — para provar um interesse de longo prazo: a marca não quer que o
cliente descarte e recompre. Isso transforma o anúncio em prova de coerência, e
prova de coerência gera confiança que publicidade comum não gera.

**Evidência**
- (b) GELLES, D. *The secret history of "Don't Buy This Jacket"*. David Gelles
  Substack. Disponível em:
  https://davidgelles.substack.com/p/the-secret-history-of-dont-buy-this
  Acesso em: 25 set. 2026. Traz a origem da campanha, o texto do anúncio e a
  fala atribuída ao então CEO Casey Sheahan sobre o retorno de publicidade
  gerado. *Valor exato citado (US$ 57 mil no anúncio; US$ 40–50 milhões em
  publicidade gratuita) [verificar]: reportado por fonte secundária nomeada,
  não confirmado em comunicado oficial da Patagonia.*

**Limite** — O mecanismo só convence se a marca já tem histórico de coerência
ambiental — a mesma peça, vinda de marca sem essa reputação prévia, soaria
como truque publicitário e se voltaria contra quem a publicasse.

**Transferência** — **Adoto** o princípio de nomear o limite do próprio produto
em vez de escondê-lo — o projeto pode dizer onde a IA agêntica não substitui o
designer. **Recuso** usar isso como truque de marketing sem lastro: só nomeio
limite real e verificável.

---

### 42 School — INOVAÇÃO › ousado

**Contexto** — Rede de escolas de tecnologia sem mensalidade, criada em Paris em
2013 por Xavier Niel; mais de 50 campi em mais de 30 países.

**Atrito** — O ensino técnico tradicional se apoia em professor, aula
expositiva e mensalidade como garantia de qualidade. Esse modelo cobra caro e
limita vaga a quem já tem diploma ou pré-requisito.

**Mecanismo** — Tirar o professor e a mensalidade; sustentar o aprendizado só
com projeto prático e avaliação entre pares.

**Como funciona**
1. Não há aula, curso ou professor — só projeto que o aluno resolve sozinho ou
   em grupo.
2. Toda avaliação é feita por outros alunos (peer review), não por uma
   autoridade docente.
3. A admissão não exige diploma, idade mínima ou experiência prévia em
   programação.
4. O curso inteiro é gratuito, sem mensalidade antes, durante ou depois.

**Por que é forte** — Ao remover professor e mensalidade — os dois itens que o
setor trata como prova de qualidade —, o modelo aposta que projeto real e
avaliação entre pares ensinam tanto quanto aula. Isso abre vaga para quem o
modelo tradicional filtraria pela falta de diploma ou de dinheiro.

**Evidência**
- (b) 42 NETWORK. *About us*. Disponível em: https://www.42network.org/about-us/
  Acesso em: 25 set. 2026. Confirma fundação em 2013 por Xavier Niel, ausência
  de mensalidade e seleção "based solely on talent and motivation", com
  admissão aberta independentemente de diploma, origem, gênero ou idade.

**Limite** — Sem professor, quem trava sozinho depende inteiramente dos
colegas — entrar numa turma pouco engajada significa aprender menos, sem
nenhuma rede de segurança docente.

**Transferência** — **Recuso** remover toda mediação humana como a 42 remove o
professor — o projeto mantém o designer como responsável final pela decisão; o
agente de IA não substitui julgamento. **Adoto** avaliar pelo projeto entregue,
não pelo diploma de quem entrega.

---

### Quadro-síntese — ousado

**Padrão** — As três quebras têm risco calculado: cada uma troca uma garantia
do setor por uma prova que custa mais caro de fingir — aposta pública, anúncio
contra a própria venda, avaliação por pares sem docente.

**Princípio adotado** — O projeto pode recusar uma convenção do setor de design
— por exemplo, exigir formação técnica prévia — desde que substitua por outra
prova de qualidade, nunca por ausência de prova.

**Anti-referência** — Recusa-se ruptura decorativa: quebrar uma convenção só
para parecer ousado, sem propor o que substitui a garantia removida. Recusada
porque, sem substituto, a ruptura só transfere o risco para o usuário.

---

## gamificado

### Passo 1 — Definição do valor

**É:** usar ciclo de recompensa para sustentar prática regular ao longo de meses.

**Não é:** pontuação decorativa (medalha sem consequência) nem competição como
fim. Também não é diversão: o jogo aqui é meio de constância, não de
entretenimento.

### Passo 2 — Pergunta de mecanismo

Que ciclo de recompensa traz a pessoa de volta amanhã sem virar compulsão vazia?

Reescrita em atrito concreto: **o que faz a pessoa voltar depois de ter falhado,
quando ninguém a obriga e recomeçar parece mais caro do que desistir?**

### Passo 3 — Candidatos levantados

| Candidato | Distância | Mecanismo aparente |
|---|---|---|
| **Duolingo (economia do streak)** | direto | o perdão da falta é vendido e presenteado |
| **Habitica** | direto | hábito vira RPG com dano e vida do personagem |
| **Anéis de atividade (Apple Watch)** | análogo (saúde) | meta diária vira forma fechada, não número |
| **Cartão carimbado de cafeteria** | análogo (varejo) | progresso presenteado no início acelera a conclusão |
| **Beeminder** | extremo | falhar cobra dinheiro real do próprio usuário |

### Passo 4 — Filtro

- **Duolingo** — passa: observável na loja do app, com fontes primárias e
  secundárias nomeadas, e o mecanismo (perdoar, não punir) não se repete em
  nenhum outro candidato. → ficha abaixo
- **Cartão carimbado** e **Beeminder** — indicados para as duas fichas restantes:
  cobrem, respectivamente, o progresso dado de graça no início (efeito de
  progresso dotado, fora de qualquer contexto de ensino) e o extremo punitivo,
  que serve principalmente como anti-referência.
- **Habitica** e **anéis da Apple** — em espera: Habitica é a versão punitiva de
  menor rigor que o Beeminder já cobre; os anéis repetem "contador de constância"
  do streak.

---

### Duolingo — INOVAÇÃO › gamificado

**Contexto** — Mesmo app; o recorte é a economia construída em volta do *streak*
(dias consecutivos de estudo), operada por um time de retenção dedicado.

**Atrito** — Quem quebra o streak tende a não voltar: o contador zerado apaga de
uma vez meses de esforço acumulado, e recomeçar do zero pesa mais do que nunca
ter começado.

**Mecanismo** — Vender e presentear o perdão da falta, em vez de punir a falta.

**Como funciona**
1. O streak é o número em destaque permanente na interface — o placar do produto
   não é o quanto se aprendeu, é a frequência.
2. O *Streak Freeze* é um item comprável com gemas (a moeda interna) que absorve
   a falta de um dia sem zerar o contador; a versão gratuita guarda até dois de
   cada vez — o que converte "não faltar" em "administrar um estoque de falta".
3. A própria empresa ensina a usar o mecanismo: o post oficial orienta a poupar
   gemas e estocar Freezes antes de uma viagem. Ou seja, instrui o usuário a
   planejar a própria ausência em vez de puni-la.
4. Em junho de 2026 a empresa foi além e ofereceu perdão em massa: o *Streak
   Revival* devolveu o maior streak histórico a quem já tivera pelo menos 30
   dias, bastando completar três lições numa sentada.
5. Todo o conjunto é continuamente testado — o time de retenção acumula mais de
   600 experimentos só em streak.

**Por que é forte** — Inverte quem paga a conta do erro. No desenho punitivo,
quem falha perde patrimônio e some; aqui, o patrimônio acumulado vira exatamente
a alavanca do retorno — quanto mais longo o histórico, maior o incentivo para
voltar e maior a disposição de pagar para preservá-lo. O mesmo acúmulo que,
quebrado, expulsaria a pessoa passa a ser o que a traz de volta.

**Evidência**
- (b) ZAKRYZHEVSKYY, M.; LESHER, B. *Dear Duolingo: How can I keep my streak
  while on vacation?* Duolingo Blog, 18 abr. 2023. Disponível em:
  https://blog.duolingo.com/how-to-keep-your-streak-on-vacation
  Acesso em: 18 set. 2026. Confirma a compra de Streak Freeze com gemas, o limite
  de 2 Freezes estocados na versão gratuita e a orientação de planejar a ausência
  ("Be strategic about your trip and plan in advance to keep some Streak Freezes
  at the ready").
- (b) SHUTTLEWORTH, J. [Entrevista a Lenny Rachitsky]. *Behind the product:
  Duolingo streaks*. Lenny's Newsletter, 15 dez. 2024. Disponível em:
  https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks
  Acesso em: 18 set. 2026. Registra o streak como "most important and innovative
  growth lever" e os 600+ experimentos do time de retenção.
- (b) ASTLE, A. *Duolingo is restoring lost streaks for a limited time, aiming to
  recover lapsed users*. PocketGamer.biz, 2 jun. 2026. Disponível em:
  https://www.pocketgamer.biz/duolingo-is-restoring-lost-streaks-for-a-limited-time-aiming-to-recover-lapsed-users/
  Acesso em: 18 set. 2026. Datas (1 a 30/06/2026) e regras do Streak Revival
  (streak anterior mínimo de 30 dias; três lições numa sentada).

*Pendências de verificação antes de entrar no documento principal:*
- **Reposição automática pela assinatura ("Auto Streak Repair") e reparo pago de
  streak perdido [verificar].** Constavam de uma versão anterior desta ficha e
  foram **removidas**: aparecem só em wiki de fãs (Duolingo Wiki/Fandom) e blogs
  de terceiros, nunca em fonte primária. Conferir na loja do app antes de
  reintroduzir.
- **Preço do Streak Freeze (200 gemas) [verificar].** Mesma situação: circula em
  blogs, não foi confirmado em fonte oficial. O post oficial fala em comprar com
  gemas, mas não dá o valor.
- **15,4 milhões de streaks revividos, cerca de 8 milhões deles sem streak ativo
  [verificar].** O dado é da carta aos acionistas do 2T 2026 da Duolingo Inc.
  (investors.duolingo.com), mas o PDF estourou o tempo na leitura direta e o
  número chegou por cobertura secundária. Confirmar na carta antes de citar.
- **Citação de von Ahn sobre engajamento [verificar].** *"We focus everything on
  engagement, because if users don't come back, they can't learn at all"* é
  atribuída à entrevista da Lenny's Newsletter, mas foi recolhida em cobertura
  secundária — não foi lida no transcript.

**Limite** — O motor é aversão à perda, e ele cobra. O placar mede frequência,
não aprendizagem — atribui-se a von Ahn a formulação *"we focus everything on
engagement, because if users don't come back, they can't learn at all"*
**[verificar — ver pendências acima]**. Monetizar o perdão significa que a versão gratuita
convive com o medo de perder; e o desenho não distingue quem volta porque quer
aprender de quem volta porque não suporta zerar o contador.

**Transferência** — **Adotar** a lógica de perdão (falta não zera acúmulo) e
**recusar** duas coisas: cobrar por ele e pôr frequência como placar principal.
No projeto o contador visível mede artefato entregue, e o perdão é gratuito e
automático — cobrar pelo alívio de uma culpa que o próprio produto criou é
incompatível com uma personalidade encorajadora.

---

### Cartão-fidelidade com progresso dotado — INOVAÇÃO › gamificado

**Contexto** — Estudo de campo num lava-rápido dos Estados Unidos, publicado no
*Journal of Consumer Research* em 2006 (Nunes; Drèze). O mesmo mecanismo é hoje
comum em cartão de fidelidade de café e lanchonete.

**Atrito** — Um cartão que exige 8 carimbos para o prêmio começa em zero: o
cliente vê o caminho inteiro pela frente, e a maioria desiste antes de
completar.

**Mecanismo** — Vender um cartão de 10 carimbos já com 2 carimbados de graça,
no mesmo esforço real de 8.

**Como funciona**
1. Metade dos clientes recebe cartão de 8 carimbos, sem nenhum dado de graça.
2. A outra metade recebe cartão de 10 carimbos, já com 2 carimbados no ato da
   entrega.
3. As duas versões exigem, na prática, os mesmos 8 carimbos restantes até o
   prêmio.
4. Os pesquisadores medem quem completa o cartão e em quanto tempo.

**Por que é forte** — A pessoa não avalia o esforço que falta em termo
absoluto — avalia em proporção ao que já parece percorrido. Presentear um
trecho inicial faz o cartão parecer "em andamento" em vez de "não começado", e
isso muda o comportamento sem mudar o esforço real.

**Evidência**
- (b) NUNES, J. C.; DRÈZE, X. The Endowed Progress Effect: How Artificial
  Advancement Increases Effort. *Journal of Consumer Research*, v. 32, n. 4, p.
  504-512, mar. 2006. DOI: 10.1086/500480. Disponível em:
  https://academic.oup.com/jcr/article-abstract/32/4/504/1787425
  Acesso em: 25 set. 2026 (resumo consultado; texto completo sob acesso
  institucional).

**Limite** — O efeito depende de o presente inicial parecer justificado: dado
sem explicação, ou visivelmente maior que o esforço restante, quebra a
confiança no prêmio. *Taxa de conclusão exata por grupo no experimento do
lava-rápido [verificar]: não visível no resumo público consultado, só no texto
completo.*

**Transferência** — **Adoto** o progresso dado de graça no início de uma
jornada nova — mostrar à pessoa que já andou um trecho, mesmo antes do primeiro
projeto real. **Recuso** justificar esse presente com má-fé: o trecho dado tem
que refletir algo real, como um progresso de onboarding, não decoração vazia.

---

### Beeminder — INOVAÇÃO › gamificado

**Contexto** — Aplicativo de acompanhamento de meta fundado nos Estados Unidos;
a pessoa define a própria meta e o próprio valor de aposta.

**Atrito** — Aplicativo de hábito comum só manda notificação quando a pessoa
falha, e notificação se ignora fácil. Quem quer se cobrar de verdade não tem
onde ancorar essa cobrança.

**Mecanismo** — Cobrar dinheiro real e automático de quem sai da própria meta,
sem aviso nem desculpa.

**Como funciona**
1. A pessoa desenha a própria "estrada": a taxa mínima de progresso que aceita
   para a meta.
2. Cada dado inserido, manual ou por integração automática, marca um ponto no
   gráfico da estrada.
3. Sair da estrada por qualquer margem — mesmo 0,1% — cobra o valor apostado do
   cartão vinculado, sem lembrete antes.
4. A cada nova falha, o valor da aposta sobe sozinho, até um teto que a própria
   pessoa define.
5. Existe uma janela de 7 dias (o "akrasia horizon") entre pedir para relaxar a
   meta e a mudança valer, para não dar espaço à desistência por impulso.

**Por que é forte** — Tira da pessoa a chance de negociar consigo mesma no
momento de fraqueza: a cobrança já está configurada antes de a tentação
aparecer, e o preço sobe sozinho se a falha se repete.

**Evidência**
- (b) BEEMINDER. *What is Beeminder?* Beeminder Help. Disponível em:
  https://help.beeminder.com/article/70-what-is-beeminder
  Acesso em: 25 set. 2026. Confirma a cobrança automática ao sair da meta e a
  janela de 7 dias antes de mudanças na meta valerem.

**Limite** — O motor é medo de perder dinheiro, não desejo de progredir — e
cobra de quem já está sem tempo ou saúde para cumprir a meta, sem distinguir
dificuldade real de desleixo. Incompatível com uma personalidade encorajadora.

**Transferência** — **Recuso** qualquer cobrança financeira ou punição por
falha no projeto: o valor central do DNA é encorajar, não amedrontar. Registro
o mecanismo só como anti-referência — mostra o oposto exato do que a marca quer
ser.

---

### Quadro-síntese — gamificado

**Padrão** — Nas três fichas, o ciclo de recompensa mexe na percepção do
esforço — por perdão, por presente inicial ou por aposta — mais do que na
dificuldade real da tarefa.

**Princípio adotado** — O projeto usa perdão gratuito e progresso dado de graça
no início para sustentar constância, e recusa qualquer cobrança monetária ou
punição por falha.

**Anti-referência** — Duas, uma por extremo oposto: o placar de frequência como
métrica principal (Duolingo) — medir presença no lugar de produção, e depois
vender o alívio da ausência; e a cobrança financeira por falha (Beeminder) —
sustentar constância pelo medo de perder dinheiro, incompatível com uma
personalidade encorajadora.
