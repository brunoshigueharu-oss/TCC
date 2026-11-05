# Síntese geral do benchmarking de estratégias

> Fechado em 25 set. 2026. Os 13 alvos do DNA têm 3 fichas cada (39 no total), e
> cada alvo termina com um quadro-síntese. As fichas completas estão nos arquivos
> de cada pilar.

## Como o levantamento foi feito

O benchmarking de marca extraiu o DNA de referências externas. Este benchmarking
faz o caminho inverso. Parte de cada valor do DNA e busca no mercado o
**mecanismo** que entrega esse valor. A unidade de análise é a jogada, não a
empresa.

Cada alvo seguiu os mesmos seis passos:

1. definir o valor neste projeto, e o que ele não é;
2. traduzir o valor em uma pergunta sobre um atrito concreto;
3. levantar ao menos cinco candidatos, em três distâncias: direto (mesmo público),
   análogo (outro setor, mesmo comportamento) e extremo (caso radical);
4. filtrar para três fichas: observável, transferível e sem mecanismo repetido;
5. dissecar cada ficha em oito campos, da evidência ao limite;
6. fechar o alvo com padrão, princípio adotado e anti-referência.

Nenhum dado entrou sem rastro. Quando a fonte não foi confirmada, o trecho ficou
marcado como **[verificar]** e aparece listado ao final deste documento.

## Mapa dos alvos

| Alvo | Fichas | Princípio adotado |
|---|---|---|
| **POTENCIALIZAÇÃO** | PAAR · v0 · Muro dos boxes da F1 | Entregar pronta a parte técnica que falta e manter no designer a decisão de projeto e a validação. |
| **HOLÍSTICA** | PUCPR · Checklist da OMS · Bauhaus | Pôr a visão do todo no início de cada ciclo de trabalho, nunca como portão de entrada. |
| └ sistêmica | Duolingo (trilha) · Manual IKEA · Mapa de Beck | Mostrar o sistema como diagrama de dependências, com o mapa completo sempre acessível. |
| └ prática | The Odin Project · Residência médica · Nand2Tetris | Toda entrega termina em artefato real e testável por terceiros; o primeiro contato é supervisionado. |
| **ACESSIBILIDADE** | Scratch · Super Mario Bros 1-1 · Bicicleta de equilíbrio | Isolar a barreira do iniciante dentro da tarefa, nunca por manual antes da primeira ação. |
| └ personalizada | Duolingo (Birdbrain) · Exame de refração · Stitch Fix | Inferir repertório pela reação a artefatos concretos, nunca por autoavaliação. |
| └ progressiva | Anki · Faixas de judô · Couch to 5K | A dificuldade sobe e desce pelo desempenho verificável; recuar não apaga o conquistado. |
| **CONEXÃO** | Recurse Center · Focusmate · Alcoólicos Anônimos | Oferecer um contato humano de baixo atrito em cada trava, não uma aula. |
| └ coletividade | Pull requests (GitHub) · Mutirão · Brigada de cozinha | Organizar a contribuição do grupo por papéis complementares e visíveis. |
| └ profissional | Patreon · Airbnb Superhost · BloomTech/ISA | Cada entrega gera um registro público e portátil de resultado. |
| **INOVAÇÃO** | Cursor · Nubank · Nintendo Wii | Medir o resultado entregue com o agente, não a credencial técnica prévia. |
| └ ousado | Basecamp (Shape Up) · Patagonia · 42 School | Recusar uma convenção do setor só quando outra prova de qualidade a substitui. |
| └ gamificado | Duolingo (streak) · Cartão-fidelidade · Beeminder | Perdão gratuito e progresso dado no início; nenhuma cobrança por falha. |

## O que se repete entre os pilares

Lidos em conjunto, os 13 princípios se reduzem a cinco ideias. Elas são a
contribuição do benchmarking para a fase de geração de alternativas.

1. **Inferir em vez de perguntar.** O sistema descobre o nível da pessoa pelo que
   ela faz, erra ou escolhe. Aparece em personalizada (Birdbrain, refração, Stitch
   Fix) e em progressiva (Anki, que ajusta o intervalo pela resposta anterior).
   Decisão: o projeto não abre com questionário de nível.
2. **A estrutura assume o técnico; o designer guarda a decisão.** O entorno supre a
   competência que falta, mas a escolha de projeto continua com a pessoa. Aparece
   em POTENCIALIZAÇÃO (PAAR, v0, F1) e em INOVAÇÃO (Cursor). Decisão: o agente
   executa, e o designer aprova com a explicação à vista.
3. **Artefato real como unidade de medida.** O progresso se mede pelo que existe
   fora da plataforma. Aparece em prática (Odin, Nand2Tetris), em profissional
   (Patreon, Superhost), em INOVAÇÃO (resultado no lugar de credencial) e em
   gamificado (contador de artefatos, não de dias). Decisão: o placar do projeto
   conta entregas.
4. **Errar sem perder o acumulado.** A falha tem saída barata. Aparece em
   gamificado (perdão do streak), em progressiva (recuo sem apagar), em
   ACESSIBILIDADE (bicicleta sem pedal, blocos que não encaixam errado) e em
   INOVAÇÃO (pontos de restauração do Cursor). Decisão: toda ação do agente pode
   ser desfeita e revista.
5. **Pares no lugar do professor.** O apoio vem de pessoas com papéis claros, não
   de uma autoridade única. Aparece em CONEXÃO (Recurse Center, padrinho do AA),
   em coletividade (revisão de pull request, mutirão) e em ousado (42 School).
   Decisão: a revisão humana é distribuída entre pares.

## Tensões que a próxima fase precisa resolver

Alguns princípios puxam em direções opostas. O benchmarking não resolve essas
tensões; ele as deixa nomeadas para a geração de alternativas.

- **Autonomia do agente × auditoria do designer.** O Cursor mostra o ganho de
  delegar a tarefa inteira. A F1 mostra o risco de executar sem entender. Saída
  provisória: delegar a execução e exigir revisão explicada antes de aceitar.
- **Supervisão no primeiro contato × entrada sem portão.** A vertente prática pede
  supervisão no início. HOLÍSTICA e ACESSIBILIDADE recusam qualquer barreira
  antes da primeira ação. Saída provisória: a supervisão acompanha a tarefa real;
  ela não vem antes dela.
- **Trilha única × liberdade de quem já sabe.** A trilha da Duolingo protege o
  iniciante e aperta o avançado. Saída provisória: um só "próximo passo" visível,
  com o mapa completo a um clique e a opção de pular.
- **Dificuldade inferida × autonomia declarada.** Progressiva e personalizada
  recusam que a pessoa escolha o próprio nível. Isso pode soar controlador para
  quem já tem repertório. Saída provisória: o sistema propõe o nível, e a pessoa
  pode contestar com uma entrega.

## Anti-referências consolidadas

O projeto recusa deliberadamente estes mecanismos:

| Alvo | Mecanismo recusado | Motivo, em uma linha |
|---|---|---|
| POTENCIALIZAÇÃO | Instrução opaca do rádio da F1 | Executar sem entender contraria a personalidade didática. |
| HOLÍSTICA | Portão de fundamentos (Vorkurs) | Bloqueia quem chega com um problema real e urgente. |
| sistêmica | Resumo apresentado como se fosse o todo | Ensina uma ilusão de domínio. |
| prática | Exposição direta ao sistema real no primeiro uso | O iniciante ainda não avalia se a saída é segura. |
| ACESSIBILIDADE | Tutorial em texto antes da primeira ação | Tira o aprendizado do momento em que ele importa. |
| personalizada | Seletor "iniciante / intermediário / avançado" | Entrega a decisão a quem menos sabe e rotula a pessoa. |
| progressiva | Modo de assistência autodeclarado | Devolve uma decisão que o iniciante não consegue tomar bem. |
| CONEXÃO | Instrutor único como fonte de correção | Recria a hierarquia professor-aluno. |
| coletividade | Cadeia de comando fixa da brigada | Papel diferente não precisa virar autoridade. |
| profissional | Remuneração atrelada a colocação não auditada (ISA) | Incentiva inflar a taxa de sucesso. |
| INOVAÇÃO | Corrida de especificação | Mais recurso aumenta a distância do iniciante. |
| ousado | Ruptura decorativa, sem substituto | Transfere o risco para o usuário. |
| gamificado | Placar de frequência e multa por falha | Mede presença e sustenta a constância pelo medo. |

## Pendências antes de levar ao relatório principal

Os trechos **[verificar]** estão listados nas seções de pendências de cada
arquivo. Os mais importantes para a banca são:

- PAAR: ano de criação (2008 ou 2019) e o dado das medalhas de Paris 2024.
- Mutirão, Brigada de cozinha e Super Mario Bros 1-1: trocar a Wikipedia por
  fonte acadêmica ou primária.
- Duolingo: preço do Streak Freeze, número de streaks revividos e a citação de
  von Ahn.
- Patagonia e Nubank: valores e citações vindos de fonte secundária.
- Referências incompletas: artigo do PAAR, artigo do PMC sobre residência médica.

Nenhuma dessas pendências sustenta sozinha um mecanismo. Todas cobrem um dado
dentro de uma ficha.
