# Benchmarking de Estratégias — POTENCIALIZAÇÃO (centro da roda)

> Status: **3 de 3 fichas. Quadro-síntese fechado.**

## Definição do valor neste projeto

**É** fazer o designer entregar, com qualidade profissional, um artefato que sua formação
sozinha não entregaria — porque a estrutura ao redor dele incorpora as expertises que faltam.

**Não é** substituir o designer, nem transformá-lo em programador. A competência central
continua sendo dele; o que muda é o entorno.

**Pergunta de mecanismo:** como faz a pessoa realizar algo que sozinha não realizaria?

---

### PAAR — Programa de Incorporação de Atletas de Alto Rendimento — POTENCIALIZAÇÃO

*Distância: análogo (esporte de alto rendimento / instituição militar — fora de edtech e SaaS).*

**Contexto** — Programa do Ministério da Defesa executado pelas três Forças Armadas, que
incorpora atletas civis como militares temporários. Cerca de 530 atletas em 34 modalidades.

**Atrito** — o atleta de elite brasileiro tem a competência, mas não o entorno: sem
patrocínio, precisa de um emprego para viver, e o emprego consome exatamente as horas de
treino. O talento existe e não chega a se converter em resultado. É o mesmo formato do atrito
do projeto — o designer tem repertório projetual e não tem o entorno técnico que converteria
a ideia em produto.

**Mecanismo** — vira militar temporário; treinar passa a ser o trabalho remunerado.

**Como funciona**
1. Cada Força abre edital público de alistamento voluntário.
2. A seleção converte histórico esportivo em pontuação: medalhas e resultados em competições
   nacionais e internacionais viram nota de classificação.
3. Aprovado, o atleta é incorporado em caráter temporário e passa a receber soldo, 13º
   salário, férias e assistência médica — incluindo nutricionista e fisioterapeuta.
4. Treina nas instalações militares (CEFAN/Marinha, CCFEx e Complexo Deodoro/Exército,
   UNIFA/Aeronáutica), com apoio de equipe multidisciplinar.
5. Em contrapartida, representa as Forças Armadas e o Brasil em competições. O vínculo dura
   até oito anos.

**Por que é forte** — o programa não premia o resultado, financia a condição de possibilidade
do resultado. Bolsa por desempenho chega depois do pódio e só a quem já chegou; o soldo chega
antes e compra a variável que de fato trava — o tempo integral de prática. E o custo marginal
para a instituição é baixo, porque o ativo caro já existia ocioso: pista, piscina, médico,
fisioterapeuta. O atleta não recebe um serviço novo, é realocado para dentro de uma estrutura
que já estava de pé.

**Evidência** — (b) fonte nomeada.
- MINISTÉRIO DA DEFESA. *Programa de Incorporação de Atletas de Alto Rendimento* (Comissão
  Desportiva Militar do Brasil). Disponível em:
  https://www.gov.br/defesa/pt-br/assuntos/esporte/departamento-de-desporto-militar-ddm/comissao-desportiva-militar-do-brasil/paar
  Acesso em: 18 set. 2026. Lista soldo, 13º, férias, assistência médica com nutricionista e
  fisioterapeuta, as instalações, os 530 atletas (266 homens, 264 mulheres), 34 modalidades, o
  vínculo de até oito anos e a seleção por pontuação de medalhas.
- MINISTÉRIO DA DEFESA. *Conheça o Paar*. Disponível em:
  https://www.gov.br/defesa/pt-br/assuntos/esporte/olimpiadas/conheca-o-paar-1
  Acesso em: 18 set. 2026. Registra 533 atletas em 35 modalidades e 8 medalhas de atletas
  militares em Tóquio 2021 (3 ouros, 1 prata, 4 bronzes).
- ALMEIDA, M.; OLIVEIRA, L. P.; REGO, R. C. A. *A importância do Programa de Atletas de Alto
  Rendimento (PAAR) das Forças Armadas para o desempenho de atletas brasileiros: um estudo
  transversal.* Revista de Educação Física, v. 90, n. 2, 2021. Disponível em:
  https://revistadeeducacaofisica.emnuvens.com.br/revista/article/view/2765
  Acesso em: 18 set. 2026. Censo dos atletas do programa por questionário online: 96,46%
  concordaram que o PAAR foi importante para a melhoria do seu desempenho esportivo; 82,2%
  classificaram as instalações como boas ou muito boas.

*Pendências de verificação antes de entrar no documento principal:*
- **Ano de criação [verificar].** As duas páginas oficiais divergem: "Conheça o Paar" data a
  criação em 2008; a página da CDMB atribui a criação a 2019, em parceria com o Ministério do
  Esporte. Provável que sejam duas coisas (o programa de 2008 e a formalização de 2019) —
  resolver antes de citar.
- **"Atletas do PAAR responderam por 11 das 20 medalhas do Brasil em Paris 2024 (55%)"
  [verificar].** O número circula na imprensa (Diário do Poder) e em notícias do gov.br/defesa,
  mas essas notícias retornam "conteúdo restrito" e os sites .mil.br devolvem 403 — não foi
  possível confirmar em fonte primária acessível.
- **Referência do artigo incompleta.** Faltam prenomes por extenso, intervalo de páginas e
  DOI — os autores aparecem na página como Marcelo de Almeida, Leonardo P. de Oliveira e
  Ricardo C. de A. Rego. Completar pelo PDF do artigo antes de citar em ABNT.
- **Divergência de números entre as duas páginas oficiais:** 530 atletas / 34 modalidades
  (CDMB) contra 533 / 35 ("Conheça o Paar"). Escolher uma página e datar a consulta.

**Limite** — a porta de entrada é o resultado passado: a seleção pontua medalhas já
conquistadas, de modo que o programa sustenta quem já performa, não quem está começando. É um
acelerador de elite, não uma rampa de acesso — quem mais precisaria da estrutura para chegar
ao primeiro resultado é exatamente quem não pontua no edital. Some-se o vínculo temporário
(até oito anos, sem carreira depois) e a contrapartida da hierarquia militar: parte da
autonomia sobre a própria trajetória é cedida à instituição.

**Transferência** — **Adoto** o princípio de que a estrutura assume tudo que não é a
competência central do designer, e **recuso** o critério de entrada por resultado prévio: no
projeto a incorporação precisa valer para quem ainda não tem portfólio técnico, senão o
mecanismo entrega POTENCIALIZAÇÃO ao custo de ACESSIBILIDADE.

---

### v0 (Vercel) — POTENCIALIZAÇÃO

*Distância: direto (mesmo problema — sair do design para o artefato executável — mesmo
público não-programador).*

**Contexto** — Ferramenta da Vercel que gera interfaces React/Next.js a partir de descrição em
texto; usada por designers, PMs e desenvolvedores dentro de um chat.

**Atrito** — A pessoa sabe como a tela deve parecer e se comportar, mas não sabe escrever o
componente nem integrá-lo a um projeto real. A distância entre a ideia visual e o código
publicável trava o trabalho — o mesmo tipo de trava que separa o designer do sistema técnico
que ele precisa entregar.

**Mecanismo** — Descrição em texto vira componente React pronto para publicar.

**Como funciona**
1. A pessoa escreve um prompt descrevendo a tela desejada.
2. A ferramenta gera o código da interface com componentes shadcn/ui e mostra uma prévia.
3. A pessoa refina por chat: pede mudanças, pede alternativas ou pede explicação de um trecho
   que não entende.
4. O código gerado pode ser instalado direto num projeto Next.js existente via linha de
   comando, ou vira um projeto novo do zero.
5. *A publicação da interface como URL ao vivo na própria Vercel é observável no produto, mas
   não consta do post citado [verificar na interface do v0 antes de citar].*

**Por que é forte** — A ferramenta absorve a sintaxe e o processo de publicação, e devolve à
pessoa só a decisão que já é dela: como a tela deve ficar e se comportar. O ciclo de chat
mantém o humano no controle da intenção; a implementação deixa de ser o gargalo.

**Evidência** — (b) fonte nomeada.
- POPE, A.; KHANDELWAL, A. *Maximizing outputs with v0: from UI generation to code
  creation*. Vercel Blog, 23 out. 2024. Disponível em:
  https://vercel.com/blog/maximizing-outputs-with-v0-from-ui-generation-to-code-creation
  Acesso em: 25 set. 2026. Confirma a geração com shadcn/ui, a instalação "directly into an
  existing Next.js project via the CLI" e o pedido de explicação ("Seek explanations for parts
  of the code you don't understand").

**Limite** — v0 gera a camada de interface; não decide arquitetura de dados, regra de negócio
nem integra um sistema inteiro sem apoio técnico externo. O não-programador pode chegar a um
componente bonito e ainda não saber conectá-lo ao resto do sistema.

**Transferência** — **Adoto** o princípio de manter a pessoa na camada de intenção e devolver a
implementação pronta, e **recuso** limitar esse ganho à interface: o projeto precisa da mesma
lógica de "descreve e sai artefato pronto" estendida a domínios além do front-end — dados,
integração, negócio —, que é o papel que cabe a um agente como Claude Code.

---

### Muro dos boxes — Fórmula 1 — POTENCIALIZAÇÃO

*Distância: extremo (decisão técnica e execução física radicalmente separadas em pessoas
diferentes, sob risco alto e tempo real — inviável de copiar em escala individual).*

**Contexto** — Equipe de estratégia de uma escuderia de Fórmula 1, de 3 a 8 pessoas sentadas no
muro dos boxes durante a corrida, com apoio remoto de um centro de operações na fábrica.

**Atrito** — O piloto dirige a mais de 300 km/h e não tem capacidade de processar telemetria,
degradação de pneu, clima e janela de pit stop ao mesmo tempo em que pilota. A decisão técnica
certa existe, mas não cabe em quem está com as mãos na tarefa principal — o mesmo formato do
designer que opera um agente de IA em paralelo à própria entrega.

**Mecanismo** — Equipe decide em tempo real; o piloto só executa a instrução.

**Como funciona**
1. Sensores do carro alimentam o muro dos boxes com dados de pneu, combustível e tempos por
   setor durante toda a corrida.
2. Um engenheiro de estratégia roda simulações contínuas sobre o melhor momento de pit stop.
3. Um engenheiro de pista acompanha os tempos e fala direto com o piloto pelo rádio.
4. A decisão final — quando entrar nos boxes, que pneu montar, que ritmo manter — chega ao
   piloto como instrução pronta pelo rádio.
5. O piloto executa a instrução sem precisar reconstruir o raciocínio técnico por trás dela.

**Por que é forte** — Quem decide não precisa ser quem executa, desde que o canal entre os dois
seja rápido e a instrução chegue pronta para agir. O piloto permanece insubstituível na única
tarefa que só ele faz — dirigir — e delega inteiramente a tarefa que não é dele: calcular
estratégia sob dado técnico.

**Evidência** — (b) fonte nomeada.
- BRAYBROOK, R. *Everything you need to know about the pitwall in F1 — who sits there and what
  does it do?* Autosport, 19 mar. 2024. Disponível em:
  https://www.autosport.com/f1/news/everything-you-need-to-know-about-the-pitwall-in-f1-who-sits-there-and-what-does-it-do/10588720/
  Acesso em: 25 set. 2026. Descreve os papéis no muro (engenheiro de pista, chefe de estratégia,
  diretor esportivo), a comunicação por rádio e o monitoramento de pneu, combustível e clima.

*Pendência de verificação antes de entrar no documento principal:*
- **Volume de dados por segundo gerado pelo carro [verificar].** Números como "1,1 milhão de
  pontos por segundo" circulam em fontes secundárias (Medium, SportBusiness Tech), sem
  confirmação em fonte primária de equipe ou da FIA nesta sessão. Não usado como base do
  argumento acima.

**Limite** — A decisão que chega ao piloto pode estar errada — a estratégia é probabilística, e
uma decisão errada custa a corrida inteira. Diferente do designer, o piloto não escolhe sua
equipe nem pode auditar o raciocínio no instante da decisão: só obedece. O modelo também
pressupõe uma equipe inteira dedicada a um único carro — custo que não escala para uso
individual.

**Transferência** — **Adoto** o princípio de que decisão técnica e execução podem ficar em
agentes diferentes, desde que o canal seja rápido e a instrução chegue pronta para agir, e
**recuso** a opacidade do rádio: no projeto o designer precisa poder auditar por que o agente
decidiu algo antes de aceitar, porque não tem uma escuderia inteira validando no lugar dele.

---

## Passo 6 — Quadro-síntese: POTENCIALIZAÇÃO

**Padrão** — Nos três casos, a estrutura ao redor absorve o que falta à pessoa — tempo
remunerado, sintaxe de código, cálculo técnico em tempo real — e devolve, pronta, a parte que
só ela sabe fazer: treinar, decidir design, dirigir. Em nenhum caso a pessoa precisa dominar
a competência que faltava: o entorno a supre.

**Princípio adotado** — O projeto potencializa entregando ao designer, pronta, a parte técnica
que falta — código, dado, decisão de negócio —, e mantém nele, auditável e não terceirizável, a
decisão de projeto e a validação do resultado.

**Anti-referência** — A opacidade do rádio da Fórmula 1: o piloto executa sem poder auditar o
raciocínio da estratégia no instante da decisão. Recusado porque colide com a personalidade
didática do DNA — o projeto existe para o designer entender o domínio que está usando, não para
escondê-lo atrás de uma instrução que só se obedece.

## Pendências deste arquivo

- [ ] **Ano de criação do PAAR [verificar]** — Ficha 1: fontes oficiais divergem entre 2008 e
  2019.
- [ ] **"55% das medalhas do Brasil em Paris 2024 vieram de atletas do PAAR" [verificar]** —
  Ficha 1: sem fonte primária acessível nesta sessão.
- [ ] **Referência completa do artigo de Almeida, Oliveira e Rego [verificar]** — Ficha 1:
  faltam prenomes, páginas e DOI.
- [ ] **Publicação em URL ao vivo no v0 [verificar]** — Ficha 2: conferir na interface do
  produto; o post citado não trata disso.
- [ ] **Volume de dados por segundo do carro de F1 [verificar]** — Ficha 3 (muro dos boxes): não
  usado como base do argumento, mas pendente antes de citar em número.
