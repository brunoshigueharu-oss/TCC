"""Atualização do relatório (12/11/2026, com o cap. 10 de viabilidade; logo final em 23/11/2026) (alterações controladas, autor "Claude").

Base: Relatório_TCC_ABNT_revisado_divulgacao.docx
Saída: Relatório_TCC_BASE8.docx

O que faz:
- capa: nomes dos orientadores;
- cap. 1 vira Introdução (o roteiro antigo fica como 1.1 a 1.3);
- 3.9.4: atualização do recorte de público;
- cap. 7 reescrito (hub BASE8, sem pet);
- cap. 8 ganha as seções 8.8 a 8.16 (paleta, tipografia, nome, logo, direção, brandbook);
- cap. 9 novo: o protótipo;
- cap. 10 novo: viabilidade e modelo de negócio (cap10_viabilidade.py + projecao.py);
- plano de divulgação passa de cap. 9 para cap. 11 (Quadros 6-12 viram 13-19);
- cap. 12 novo: processo de projeto com IA de código;
- cap. 13 novo: próximas etapas;
- referências novas.

Rodar a partir desta pasta:  python3 atualizar_relatorio.py
"""
import glob, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from docx_rastreado import Doc, q  # noqa: E402

DOCS = os.path.dirname(HERE)
FIG = os.path.join(HERE, "figuras")
src = [f for f in glob.glob(os.path.join(DOCS, "Versoes_Anteriores", "*.docx")) if f.endswith("_revisado_divulgacao.docx")][0]
out = os.path.join(DOCS, "Relatório_TCC_BASE8.docx")
work = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "_tmp")

d = Doc(src, work, date="2026-11-12T20:00:00Z")
P, H, B = d.para, d.h, d.bullet

# ------------------------------------------------------------------ âncoras
capa_orientador = d.find("Orientador(a):")
h1 = d.find("1 ROTEIRO DE PESQUISA EXPLORATÓRIA", style="Ttulo1")
sub1 = h1.getnext(); assert d.text(sub1).startswith("Design × Claude Code")
h11 = d.find("1.1 Contexto e objetivo", style="Ttulo2")
p11 = h11.getnext(); assert d.text(p11).startswith("Neste capítulo, organizo")
h4 = d.find("4 PESQUISA DE CAMPO", style="Ttulo1")
h7 = d.find("7 A SOLUÇÃO PROPOSTA", style="Ttulo1")
h8 = d.find("8 IDENTIDADE VISUAL", style="Ttulo1")
h81 = d.find("8.1 Ponto de partida", style="Ttulo2")
h_div = d.find("9 PLANO DE DIVULGAÇÃO", style="Ttulo1")
h_ref = d.find("REFERÊNCIAS", style="Ttulo1")

# ------------------------------------------------------------------ capa
d.sub(capa_orientador, "Orientador(a): [nome do(a) orientador(a) a definir]",
      "Orientadores: Luciane Hilu, Gabriela Unger Unruh e Carlos Roberto Romaniello")

# título e subtítulo escolhidos pelo Bruno em 12/11/2026 (capa e folha de rosto)
titulos = [d.find("O DESIGNER GENERALISTA E A INTELIGÊNCIA ARTIFICIAL GENERATIVA", nth=k) for k in (0, 1)]
subtitulos = [d.find("levantamento exploratório para definição do tema", nth=k) for k in (0, 1)]
for p_ in titulos:
    d.sub(p_, "O DESIGNER GENERALISTA E A INTELIGÊNCIA ARTIFICIAL GENERATIVA", "O DESIGNER E A IA DE CÓDIGO")
for p_ in subtitulos:
    d.sub(p_, "levantamento exploratório para definição do tema de um trabalho de conclusão de curso em Design",
          "BASE8, um hub de capacitação para ampliar o alcance da atuação em design")

# ------------------------------------------------------------------ cap. 1: introdução
d.sub(h1, "ROTEIRO DE PESQUISA EXPLORATÓRIA", "INTRODUÇÃO")
d.delete_par(sub1)
intro = [
    P("A inteligência artificial (IA) generativa mudou quem consegue construir produtos digitais. Ferramentas que escrevem código a partir de um pedido em texto, chamadas neste trabalho de IA de código, permitem que pessoas sem formação em programação criem sites, protótipos e sistemas. Entre designers, esse movimento já é visível: 91% usam IA toda semana em tarefas de design e 50% já enviaram para produção um código gerado por IA (Designer Fund, 2026), como detalha a seção 3.8.1."),
    P("Mesmo assim, falta um caminho. Os materiais de ensino que encontrei são, em sua maioria, pensados para quem já programa, e o designer acaba aprendendo sozinho, por tentativa e erro. Além disso, a pesquisa de campo mostrou que o código gerado por IA exige revisão cuidadosa (capítulo 4), e o designer nem sempre sabe o que revisar. O problema deste projeto está nesse ponto: dar ao designer um caminho estruturado para usar a IA de código, sem que ele deixe de ser designer."),
    P("A pergunta projetual que orienta o trabalho, fechada na fase de definição (seção 5.1.1), é: “Como posso potencializar as competências do designer e ampliar o alcance de sua atuação incorporando, por meio da IA de código, expertises técnicas que excedem sua formação?”."),
    P("O objetivo geral é projetar o BASE8, um hub web e mobile que capacita designers a usar IA de código, e construí-lo como protótipo de alta fidelidade com as próprias ferramentas que ele ensina. Os objetivos específicos são:"),
    B("mapear como a IA generativa vem sendo estudada no processo de design e na ampliação das competências do designer (capítulo 2);"),
    B("definir o público, a pergunta projetual e o DNA de marca do projeto (capítulos 3 a 5);"),
    B("levantar, no mercado e fora dele, estratégias que entregam cada valor do DNA (capítulo 6);"),
    B("propor a solução, a sua identidade visual e o seu protótipo em código (capítulos 7 a 9);"),
    B("avaliar a viabilidade e o modelo de negócio (capítulo 10);"),
    B("planejar a divulgação do lançamento (capítulo 11);"),
    B("documentar o processo de projeto com IA de código e avaliar onde ela ajudou, onde falhou e que validação humana continuou necessária (capítulo 12)."),
    P("O trabalho se justifica por dois lados. Para o designer, dominar essas ferramentas amplia o alcance da própria atuação sem exigir uma segunda formação. Para a área, ainda são poucos os estudos sobre o uso de IA de código por designers, lacuna registrada na seção 2.4.3. Além disso, o projeto é o seu próprio caso: eu, como designer, dirigi a construção de um produto digital com apoio de IA de código, e esse processo está documentado no capítulo 12."),
    P("O método é o Duplo Diamante, do Design Council, com quatro fases. Na fase Discover (capítulos 2 a 4), reuni a pesquisa bibliográfica, os dados de mercado e a pesquisa de campo. Na fase Define (capítulo 5), fechei a pergunta projetual e o DNA de marca. Na fase Develop (capítulos 6 a 11), fiz o benchmarking de estratégias e desenvolvi a solução, a identidade, o protótipo e o plano de divulgação. A fase Deliver, com os testes com usuários e os ajustes finais, está planejada no capítulo 13."),
    P("Duas observações ajudam a leitura. A primeira é sobre o escopo: a entrega é um protótipo de alta fidelidade, navegável e construído em código, e não um aplicativo em operação. O que o protótipo simula está descrito na seção 9.6. A segunda é sobre os termos: os capítulos 1 a 4 usam “IA agêntica”, que era o termo do projeto até outubro de 2026. Do capítulo 5 em diante, o termo é “IA de código”, pelas razões explicadas na seção 5.1.2. Mantive os dois para preservar o registro de cada etapa."),
    P("As seções 1.1 a 1.3, a seguir, preservam o roteiro exploratório que abriu o trabalho, em agosto de 2026. Elas ficam como registro do ponto de partida. A pergunta e os objetivos que aparecem ali são anteriores ao recorte final e foram substituídos pelos desta introdução."),
]
d.insert_after(sub1, intro)
d.sub(h11, "Contexto", "Roteiro exploratório: contexto")
d.sub(p11, "Neste capítulo, organizo", "Nesta parte, organizo")

# ------------------------------------------------------------------ 3.9.4
d.insert_before(h4, [
    H(3, "3.9.4 Atualização do recorte (novembro de 2026)"),
    P("Duas mudanças posteriores ajustam a leitura desta seção. A primeira é a troca do meio, de IA agêntica para IA de código (seção 5.1.2). Com ela, o limite de domínio que interessa ao projeto deixou de ser o das áreas de negócio, citado na seção 3.9.1, e passou a ser o técnico: construir, em código, o que antes dependia de outra pessoa. A segunda mudança confirma a seção 3.9.2. O público mais inclinado à proposta é o designer que já teve algum contato com IA e quer um caminho estruturado para usá-la. Quem nunca usou também é atendido, porque o nivelamento define o ponto de partida de cada pessoa (seção 7.2.1)."),
])

# ------------------------------------------------------------------ 4.6: pesquisa com designers (parcial, 2 respostas em 12/11)
h5 = d.find("5 DEFINIÇÃO DO PROJETO", style="Ttulo1")
d.insert_before(h5, [
    H(2, "4.6 Pesquisa com designers: o que eles imaginam da IA de código"),
    P("Em novembro de 2026, iniciei uma segunda coleta, agora com o público do projeto. O instrumento é um questionário de 11 perguntas abertas, enviado em arquivo de texto, sobre três pontos: o que o designer acha que a IA de código consegue fazer, até onde ele acha que dá para ir e como ele imagina o processo. Até o fechamento desta versão, duas pessoas responderam: R1, designer gráfico com cinco anos de atuação, por escrito, e R2, por áudio. Nenhuma das duas usou IA para gerar código. Por isso, o que segue são indícios iniciais, e não resultados. As falas de R2 vêm de transcrição automática do áudio e ainda serão conferidas."),
    P("As duas pessoas atribuem muita capacidade à ferramenta. Para R1, “não acho que hoje em dia nesse meio de programação exista algo que ela não saiba fazer”. R2 imagina sites, jogos e outras peças gráficas. Mesmo assim, as duas hesitam quando a pergunta passa para o que um designer conseguiria fazer com ela. Diante de sete tipos de projeto, as respostas se dividiram entre “sim”, “talvez” e “não”, e só um item recebeu “sim” das duas: um sistema para organizar clientes e projetos. R1 respondeu “não” para jogo e para aplicativo de celular. R2 respondeu “não” para portfólio com animações e para vídeo gerado por código."),
    P("O processo é imaginado de duas formas opostas. R1 descreve um único passo, “dou um comando, descrevo o que e como eu quero e a IA gera tudo pra mim”, e estima algumas horas para um site. R2 imagina o contrário: acha que levaria meses e que a pessoa precisa de um conhecimento básico de programação para começar. Nenhuma das duas descrições inclui as etapas de revisar, ajustar e testar, que são o centro do trabalho com essas ferramentas (seção 4.4.3)."),
    P("A barreira que aparece não é o medo da tecnologia. R1 diz não ter receios, “apenas curiosidades”, e nunca tentou porque o trabalho atual não exige. R2 nunca tentou porque a ferramenta parece complexa demais, mas avalia que isso é mais insegurança do que realidade. As duas também defendem o papel do designer. Para R1, deixar a criação com a IA transformaria a pessoa em “gerenciador de IA”. Para R2, o resultado sem a interferência humana tende a ficar raso."),
    P("Ao longo das conversas, percebi também que os exemplos grandes, como jogos e aplicativos completos, não são os que mais aproximam o designer da ferramenta. As duas pessoas tratam a IA como facilitadora, e R2 diz que a usaria para tarefas mecânicas e chatas. Por isso, considero importante mostrar também capacidades simples, ligadas à rotina de criação: vetorizar uma ilustração com fidelidade, montar fluxogramas, operar o Figma, o Canva e o Illustrator por meio de scripts, criar e automatizar brandbooks, publicar posts, editar vídeos e tratar imagens. São tarefas que o designer já faz e nas quais a IA de código economiza tempo sem tirar dele a autoria."),
    P("Esses indícios conversam com o projeto em quatro pontos. O primeiro é a distância entre o que a ferramenta parece capaz de fazer e o que o designer acha que ele mesmo conseguiria. É o espaço que a campanha “Até onde?” explora (capítulo 11). O segundo é a imagem do processo, ora simples demais, ora difícil demais: o conteúdo inicial da trilha precisa mostrar o processo real, com pedido, revisão e ajuste. O terceiro é a condição que as duas pessoas colocam. Para R1, o designer vai longe se souber usar a ferramenta. Para R2, falta mais facilidade de acesso às IAs de código. É essa a proposta do BASE8. O quarto é a escolha dos exemplos: a trilha, a vitrine do site e a campanha devem equilibrar o projeto grandioso com a automação do trabalho cotidiano. A coleta continua, e esta seção será revista com mais respostas."),
])

# ------------------------------------------------------------------ cap. 7
antigo7 = d.between(h7, h8)
cap7 = [
    P("Este capítulo abre a fase Develop do Duplo Diamante. Nele, apresento a solução na sua forma atual, o BASE8, descrevo as suas áreas e registro o que mudou desde a primeira proposta."),
    H(2, "7.1 Visão geral"),
    P("A solução é o BASE8, um hub web e mobile que capacita designers a usar ferramentas de IA de código. O objetivo é que o designer aprenda a usá-las de forma eficiente e, com o tempo, de forma profissional, em projetos reais. O hub não quer transformar o designer em programador. Ele quer potencializar as competências que o designer já tem, trazendo para a sua prática conhecimentos técnicos que excedem a sua formação."),
    P("O público prioritário é o designer que já teve algum contato com IA e sente falta de um caminho estruturado (seção 3.9). Quem nunca usou também é atendido, porque o nivelamento ajusta o ponto de partida de cada pessoa."),
    P("Para isso, o hub junta em um só lugar uma trilha de aprendizagem e uma comunidade. Parto da ideia de que muitos designers não se afastam dessas ferramentas por falta de capacidade. Eles se afastam porque falta um caminho que converse com a forma como pensam e trabalham. Por isso, o cuidado com o design da própria experiência é parte central da solução. Uma interface pouco cuidada afastaria justamente o público que o hub quer atrair."),
    P("O hub também não se esgota depois das primeiras lições. As ferramentas de IA de código mudam rápido, e a comunidade produz conteúdo o tempo todo. Por isso, a solução serve tanto a quem está começando quanto a quem já usa as ferramentas e quer se aprofundar."),
    P("A solução se organiza em quatro áreas, Entrada, Educação, Comunidade e Perfil, além de duas ferramentas para computador. O capítulo 9 mostra como cada uma ficou no protótipo."),
    H(2, "7.2 Áreas do hub"),
    H(3, "7.2.1 Entrada: onboarding e nivelamento"),
    P("No primeiro acesso, o hub pergunta o objetivo da pessoa, a sua área de atuação e quanto ela já usou IA de código. Em seguida, um teste curto, com situações reais de projeto, define em que ponto da trilha ela começa. A pessoa pode pular o teste e começar do início. Além disso, pode fazer um teste a qualquer momento para avançar um módulo que já domina."),
    P("Esse formato é a conciliação que proponho para a tensão registrada na seção 6.4.2, entre o questionário curto de nível e o princípio de não começar pela autoavaliação. A pergunta inicial só ajusta a entrada. Quem define o nível é o desempenho no teste, e não a resposta declarada."),
    H(3, "7.2.2 Educação"),
    P("A área de Educação tem quatro partes. A trilha é o caminho principal: módulos com lições curtas, em etapas, com o progresso sempre visível. Cada lição combina leitura, exemplo e prática na hora, e cada módulo termina com um checkpoint que mostra o que a pessoa já consegue fazer. A área Praticar traz atividades curtas, corrigidas por critérios claros, para exercitar sem depender da ordem da trilha."),
    P("Os cursos da comunidade são minicursos criados por membros, sobre temas que a trilha não cobre ou que mudam rápido demais para ela. Por fim, o teste de proficiência comprova o que a pessoa sabe e dá uma classificação própria no perfil."),
    P("O ponto de chegada é o uso profissional, ou seja, a aplicação das ferramentas em projetos reais. O conteúdo completo da trilha, com a ordem dos módulos e as ferramentas abordadas, ainda está em definição (seção 7.5)."),
    H(3, "7.2.3 Comunidade"),
    P("A comunidade é organizada por tags de assunto, e não por um feed genérico. Nela, a pessoa pergunta o que travou, mostra o prompt que funcionou e aprende com quem está um passo à frente. Cada lição da trilha tem o seu fio de dúvidas, que vive na comunidade. Essa é a ponte entre as duas áreas: a dúvida nasce na aula, e a resposta fica disponível para os próximos alunos."),
    P("Com isso, a comunidade alimenta o hub. Cada resposta, cada discussão e cada minicurso vira conteúdo novo. Assim, o conhecimento deixa de vir só da plataforma e acompanha o ritmo em que as ferramentas mudam."),
    H(3, "7.2.4 Perfil e progressão"),
    P("O perfil mostra o nível, o progresso na trilha, os selos e a participação na comunidade. A progressão segue cinco regras."),
    B("**Uma pontuação só.** O XP é a única pontuação do hub. Não há moedas nem loja."),
    B("**XP por aprender.** Lições e atividades concluídas rendem XP."),
    B("**XP por ajudar, com limite.** Na comunidade, só a resposta marcada como útil rende XP, e há um teto. Assim, pontua quem ajuda, e não quem publica muito."),
    B("**Comparação só entre amigos.** O ranking reúne amigos e conta o XP das aulas."),
    B("**Sem punição.** A ausência não tira XP nem nível."),
    P("Há ainda duas distinções. O nível mais alto por XP reconhece quem mais contribuiu. Já a classificação do teste de proficiência é separada do nível: ela comprova conhecimento, e não tempo de uso. A lógica se aproxima das faixas do judô, vistas na seção 6.4.3: cada degrau exige uma prova, e todos sabem o que a pessoa já consegue fazer."),
    P("O ranking entre amigos é a forma que encontrei de tratar a tensão da seção 6.6.3. A comparação existe, mas fica restrita a quem a pessoa escolheu, e a ausência não gera perda."),
    H(3, "7.2.5 Ferramentas para computador"),
    P("Duas funções existem só no computador, por pedirem sessões mais longas. A primeira é o editor de minicursos, em que o membro monta e publica o seu curso. A segunda é a moderação, que recebe as denúncias da comunidade e registra as decisões. Se a comunidade alimenta o hub, a qualidade desse conteúdo vira um ponto crítico, e a moderação é a resposta a esse risco."),
    H(2, "7.3 Relação com o DNA do projeto"),
    P("Todas as áreas convergem para o valor central, a potencialização: o designer amplia o que já sabe fazer, em vez de começar do zero em outra área. Cada área também responde a um pilar da roda de valores. A trilha e a prática, com teoria aplicada na hora, entregam a HOLÍSTICA nas vertentes sistêmica e prática. O nivelamento e o avanço em etapas entregam a ACESSIBILIDADE, que é personalizada e progressiva. A comunidade, os minicursos e o teste de proficiência entregam a CONEXÃO, coletiva e profissional. Por fim, o XP, os selos e o cuidado estético entregam a INOVAÇÃO na vertente gamificada. A vertente ousada não virou tela: ela está na comunicação e no tom do projeto como um todo (capítulo 11)."),
    H(2, "7.4 Escopo de entrega"),
    P("A entrega do projeto é um protótipo de alta fidelidade do hub, navegável e construído em código, nas versões para celular e para computador (capítulo 9). Ele mostra a experiência completa, mas ainda não opera com contas e dados reais. Além do protótipo, a entrega inclui a identidade visual (capítulo 8) e o plano da campanha de lançamento (capítulo 11)."),
    H(2, "7.5 Decisões tomadas e em aberto"),
    P("A primeira versão deste capítulo listava nove decisões em aberto. A maior parte foi resolvida ao longo da fase Develop."),
    B("**Plataforma e tecnologia.** Web responsivo, com uma versão para celular e outra para computador a partir do mesmo código (seção 9.5)."),
    B("**Recorte da entrega.** Protótipo de alta fidelidade, com um módulo piloto (seção 7.4)."),
    B("**Comparação com colegas.** Ranking restrito a amigos e sem punição (seção 7.2.4)."),
    B("**Pet.** Retirado da solução (seção 7.6)."),
    B("**Primeiro acesso.** Cadastro, onboarding e nivelamento (seção 7.2.1)."),
    B("**Identidade.** Nome, paleta, tipografia, tom e logo definidos (capítulo 8)."),
    P("Continuam em aberto:"),
    B("**Conteúdo da trilha.** Quais ferramentas entram, em que ordem, e como os fundamentos comuns e os temas específicos se organizam, o que também resolve a tensão da seção 6.3.1."),
    B("**Critérios de curadoria.** Quem pode publicar minicursos, como a comunidade os avalia e em que condições uma classificação é suspensa."),
    B("**Nome da classificação do teste.** “Profissional” e “Capacitado” são as opções em estudo."),
    B("**Preços.** O modelo de receita está proposto no capítulo 10, mas os valores definitivos dependem da pesquisa com designers."),
    B("**Validação.** O teste de usabilidade com designers está planejado no capítulo 13."),
    H(2, "7.6 O que mudou desde a primeira proposta"),
    P("A primeira proposta, de setembro de 2026, era um aplicativo com sete frentes. Entre elas estavam um pet, um polvo customizável que acompanhava a jornada, e uma moeda interna, trocada por roupas e acessórios para ele. A ideia era dar um rosto ao progresso e criar um vínculo afetivo com o aplicativo."),
    P("Em outubro, retirei o pet e as moedas. Ao desenhar as telas, percebi que eles deixavam o produto com cara infantil, e o público do projeto é profissional. O que o pet fazia foi redistribuído. O progresso ganhou rosto no perfil, com nível, selos e histórico. O vínculo passou a vir da comunidade e do ranking entre amigos. A regra de nunca punir a ausência, que nasceu com o pet, foi mantida."),
    P("Duas outras mudanças vieram junto. O produto deixou de ser pensado como um aplicativo de celular e passou a ser um hub, com versões para celular e computador e papéis diferentes para cada uma. E o projeto ganhou nome, BASE8 (seção 8.12)."),
]
d.insert_after(h7, cap7)
for p in antigo7:
    d.delete_par(p)

# ------------------------------------------------------------------ cap. 8
d.sub(h8, ": CONSTRUÇÃO DA LOGO E DO MASCOTE", "")
d.insert_before(h81, [
    P("As seções 8.1 a 8.7 registram essa primeira etapa, de outubro de 2026, quando o projeto ainda tinha um mascote. As seções 8.8 a 8.16 registram o que veio depois: a saída do mascote, os painéis de referência, a paleta, a tipografia, o nome, a logo, a direção visual da interface e o brandbook."),
])
cap8 = [
    H(2, "8.8 Mudança de rumo: sem mascote na plataforma"),
    P("Ainda em outubro de 2026, duas decisões mudaram o rumo da identidade. A primeira foi retirar o pet da solução (seção 7.6), porque ele deixava o produto infantil. A segunda veio em seguida: a plataforma não tem personagem. Travei na versatilidade do polvo como personagem e concluí que a interface de um produto profissional funciona melhor sem ele. Personagens podem aparecer na comunicação, mas não nas telas."),
    P("O trabalho das seções anteriores não se perdeu. O método de medir o vetor, comparar duas ferramentas e voltar ao meu traço quando a geometria endurece o desenho foi reaproveitado na logo nova (seção 8.13). O uso do polvo como símbolo de apoio segue em estudo."),
    H(2, "8.9 Painel semântico e objetos de referência"),
    P("Para definir a linguagem visual, montei um painel semântico com ilustrações, cartazes e peças de artistas que conversam com o público criativo (Figura 13). Tirei dele quatro pontos: cor saturada e chapada sobre fundo branco; acúmulo de objetos que formam uma figura maior; gesto e pincelada como sinal de mão humana; e personagens expressivos, sem tom infantil. Tirei também uma decisão: a interface fica sóbria, e o apelo estético vem da cor e da ilustração."),
    *d.figure(os.path.join(FIG, "fig-painel.jpg"), 13, "Figura 13 — Painel semântico do projeto",
              "Fonte: painel montado pelo autor (2026), com imagens de terceiros reunidas como referência."),
    P("O segundo painel reúne objetos que misturam design, tecnologia e aprendizado (Figura 14). Entre eles estão o risógrafo, a calculadora Braun ET66, o xadrez da Bauhaus, o sintetizador OP-1, a máquina de escrever Olivetti Valentine, o Macintosh 128K, o Game Boy, o Arduino, o cartão perfurado, o LEGO, a régua de cálculo e o terminal VT100. Eles guiam o tom do projeto: uma ferramenta profissional com cara de objeto querido. O risógrafo, em especial, deu origem à paleta, com tinta chapada e cores sobrepostas."),
    *d.figure(os.path.join(FIG, "fig-objetos.jpg"), 14, "Figura 14 — Objetos de referência",
              "Fonte: painel montado pelo autor (2026), com imagens da Wikimedia Commons."),
    H(2, "8.10 Paleta"),
    P("A paleta foi fechada em 16 de outubro de 2026. Ela parte das tintas da risografia (rosa flúor, limão e azul) e soma um verde-água. O fundo é branco puro, e a cor escura é um azul-noite, sem preto puro. Cada cor recebeu um nome de marca e um papel fixo na interface, como mostra o Quadro 6."),
    *d.table("Quadro 6 — Paleta do BASE8: cor, nome de marca e papel na interface",
             ["Cor", "Hex", "Nome de marca", "Papel na interface"],
             [["Branco", "#FFFFFF", "Possibilidades", "Fundo das telas"],
              ["Azul-noite", "#1B1F3B", "Descoberta", "Cor escura da marca, ícones e logo"],
              ["Verde-água", "#12A180", "Criatividade", "Home, botão principal e sucesso"],
              ["Limão", "#F5EE4A", "Adaptação", "Trilha e proficiência"],
              ["Rosa flúor", "#FF48B0", "Ousadia", "Atividades práticas"],
              ["Azul riso", "#0B8FE0", "Conectividade", "Comunidade e cursos"],
              ["Cinza gelo", "#F1F2F6", "Técnica", "Áreas e painéis"],
              ["Cinza frio", "#5A5E74", "Refinamento", "Legendas e apoio"]],
             [1900, 1400, 2100, 3671]),
    P("A regra de uso é “uma área, uma cor”: o limão marca a trilha, o rosa marca a prática, o azul marca a comunidade e o verde-água marca a ação principal e a Home. A cor entra como acento, em marcadores, barras de progresso e estados ativos, e não como decoração. Mais tarde, o texto corrido da interface passou a usar cinzas frios neutros, que deixam a leitura mais leve do que o azul-noite."),
    P("A acessibilidade exigiu um ajuste. Nenhuma das cores vivas alcança, com texto branco, o contraste mínimo de 4,5:1 que as diretrizes WCAG pedem para texto normal (W3C, 2018). Como prefiro texto branco sobre as cores vivas, por ser mais leve, escureci o verde-água de #14B38E para #12A180. Com isso, o branco sobre o verde chegou a 3,3:1, acima do mínimo de 3:1 para texto grande. A regra ficou assim: texto branco sobre cor viva só em tamanho grande, e texto azul-noite sobre o limão. O brandbook traz a tabela de contraste de cada cor."),
    H(2, "8.11 Tipografia"),
    P("A identidade usa duas famílias, ambas de uso livre. A Instrument Sans, uma grotesca de desenho atual e firme, fica nos títulos, no nome e nos números. A Figtree, mais arredondada e leve, fica no texto corrido, por ser fácil de ler em telas pequenas. As mesmas fontes estão no brandbook e no código do protótipo."),
    H(2, "8.12 Nome"),
    P("O nome BASE8, lido “base oito”, foi fechado em 23 de outubro de 2026. Ele se apoia em três leituras. “Base” é fundamento: a base de design que o designer já tem e a base técnica que ele ganha. O 8 são as oito vertentes do DNA do projeto (seção 5.3). E base 8 é o nome do sistema octal, um sistema de numeração usado na computação. A campanha explora outras leituras do número, como o 8 que, deitado, vira o símbolo de infinito (seção 11.3.2)."),
    P("Antes da decisão, descartei nomes que já pertenciam a outros produtos, como Prisma, Kroma e Nibble. Uma busca inicial não encontrou produto com o nome BASE8 na mesma área. A consulta formal ao Instituto Nacional da Propriedade Industrial (INPI) ainda está pendente, e o domínio base8.com.br já tem dono, o que pede outra solução de endereço."),
    H(2, "8.13 Logo"),
    P("A logo foi fechada em 23 de novembro de 2026 (Figura 15). Ela é um lettering em que cada letra de BASE8 é montada com objetos de trabalho e de tecnologia, como régua, mouse, lápis, bateria, teclado, microfone e engrenagem. Esse caminho nasce do painel de objetos da seção 8.9 e traduz a ideia do projeto: o designer monta algo maior a partir das ferramentas que já conhece e das que passa a dominar. O estudo de uma bola 8 de sinuca, feito em paralelo, não entrou na versão final."),
    P("O processo teve três etapas. Primeiro, desenhei o rascunho a lápis. Na passagem para o vetor, repeti o aprendizado da seção 8.6: a primeira reconstrução, toda geométrica, perdeu a graça do desenho, e voltei a seguir a linha do rascunho. Depois, pintei a versão ilustrada no Procreate, com as cores da paleta chapadas, sombras de aerógrafo e granulado. Por fim, vetorizei essa pintura com IA de código: cada objeto virou uma silhueta em cor chapada, com as seções separadas, e as sombras viraram degradês nativos do Illustrator, com as cores tiradas da pintura. Na revisão, apontei as diferenças entre o vetor e a pintura e fiz os ajustes da versão final."),
    P("O arquivo final tem uma camada por letra e uma subcamada por objeto, o que facilita recolorir ou animar cada peça. O granulado fica em uma camada própria, que pode ser ocultada. A logo foi exportada em SVG, PDF e PNG. Falta uma versão reduzida para tamanhos pequenos, como o ícone do app e o favicon, porque em poucos pixels os objetos deixam de ser lidos."),
    *d.figure(os.path.join(FIG, "fig-logo.jpg"), 15, "Figura 15 — Logo do BASE8: rascunho, pintura e vetor final"),
    H(2, "8.14 Direção visual da interface"),
    P("A interface segue uma direção que chamei de editorial sóbria. A primeira versão das telas usava formas geométricas coloridas e cartões genéricos, e ficou simples demais e divertida demais para um público profissional. Na revisão de novembro, escrevi oito princípios, entre eles: a tipografia carrega a hierarquia; linhas finas separam o conteúdo no lugar de caixas; o fundo é branco; a cor é acento; e todo movimento é curto e tem propósito."),
    P("A gamificação continua, mas com tratamento sóbrio: números grandes e finos, rótulos em caixa alta e nenhum tom de joguinho. A ilustração da marca é feita em caracteres coloridos (arte ASCII), gerados por código a partir de vídeos e imagens. Ela aparece na landing e na entrada do hub e liga o apelo visual ao assunto do produto, que é o código. A interface tem também um tema escuro, em que os papéis de cor se mantêm."),
    H(2, "8.15 Brandbook"),
    P("As regras da identidade estão reunidas em um brandbook de 28 pranchas, em formato 1920 × 1080 px. Já estão preenchidas as pranchas de nome, cores, aplicação das cores, contraste e acessibilidade, áreas e tipografia. As pranchas de logo, área de proteção, tamanho mínimo e fundos permitidos já trazem a logo final; nos fundos de cor, ela aparece em versão monocromática. As pranchas de ícones, ilustração e aplicações estão estruturadas e serão preenchidas nas próximas etapas. O arquivo é gerado por um script no Illustrator, escrito com IA de código. Assim, quando uma regra muda, o documento inteiro é atualizado de uma vez, e os ajustes que faço à mão voltam para o script (seção 12.3)."),
    H(2, "8.16 Síntese e pendências"),
    P("A identidade tem hoje paleta, tipografia, nome, logo e direção de interface definidos, e um brandbook em andamento. Ficam pendentes a versão reduzida da logo, as medidas de área de proteção e de tamanho mínimo, o estilo das ilustrações de apoio, as pranchas restantes do brandbook e a aplicação da logo no protótipo. Essas etapas estão listadas no capítulo 13."),
]
d.insert_before(h_div, cap8)

# ------------------------------------------------------------------ cap. 9: protótipo
cap9 = [
    H(1, "9 O PROTÓTIPO DO BASE8"),
    P("Este capítulo apresenta o protótipo do BASE8. Ele descreve o caminho da estrutura até as telas, a organização do hub, os fluxos principais, a versão para computador, o sistema de design e a tecnologia usada. Ao final, registra o que o protótipo simula."),
    H(2, "9.1 Da estrutura às telas"),
    P("O caminho teve quatro passos. Primeiro, desenhei a estrutura do hub em um quadro no FigJam (Figura 16). Cada área aparece com o valor do DNA que ela entrega e com a referência de produto que a inspira: o Duolingo para a trilha e o nivelamento, o Reddit para a comunidade por tags, a Udemy para a página de curso, o Patreon para o perfil de criador e o Gym Rats para o ranking entre amigos."),
    *d.figure(os.path.join(FIG, "fig-estrutura.jpg"), 16, "Figura 16 — Estrutura revisada do hub, com o valor do DNA e a referência de cada área",
              "Fonte: elaborado pelo autor (2026), com capturas de tela dos produtos de referência."),
    P("Depois, transformei a estrutura em um mapa de páginas no Figma, com 32 telas ligadas por 33 setas de navegação. As telas do hub foram desenhadas para celular (390 × 844 px), e a landing, a criação de minicurso e a moderação foram desenhadas para computador (1440 × 900 px). O terceiro passo foram os wireframes em preto e branco de todas as telas, gerados com IA a partir das minhas instruções e revisados por mim. O quarto foi a construção em código, já com a paleta e a tipografia da identidade."),
    H(2, "9.2 Organização do hub"),
    P("O protótipo tem 31 telas de produto, organizadas em seis áreas e um conjunto de ferramentas para computador (Quadro 7)."),
    *d.table("Quadro 7 — Áreas e telas do protótipo",
             ["Área", "Telas", "Função"],
             [["Entrada", "Entrar, cadastro, onboarding, consentimento e nivelamento", "Receber a pessoa e definir o ponto de partida"],
              ["Home", "Início", "Mostrar o próximo passo, a meta do dia e as dúvidas em aberto"],
              ["Educação", "Trilha, lição, checkpoint, praticar (lista, atividade e resultado), cursos da comunidade (lista, curso e player) e proficiência (apresentação, prova e resultado)", "Ensinar, exercitar e comprovar"],
              ["Comunidade", "Feed, página de tag, post, novo post e perfil de pessoa", "Tirar dúvidas e trocar soluções"],
              ["Perfil", "Perfil, ranking, notificações e configurações", "Acompanhar o progresso"],
              ["Busca", "Busca, com paleta de comandos", "Achar qualquer conteúdo do hub"],
              ["Ferramentas para computador", "Landing, criar minicurso e moderação", "Apresentar o produto, publicar cursos e cuidar da comunidade"]],
             [1900, 4271, 2900]),
    P("No celular, a navegação fica em uma barra inferior com quatro destinos: Home, Comunidade, Educação e Perfil. No computador, a mesma navegação vira uma barra lateral, que também dá acesso às ferramentas."),
    H(2, "9.3 Fluxos principais"),
    H(3, "9.3.1 Entrada"),
    P("O primeiro acesso passa por quatro passos (Figura 17). Depois do cadastro, o onboarding faz três perguntas: o objetivo, a área de atuação e quanto a pessoa já usou IA de código. Em seguida, ela escolhe o que autoriza: personalização da trilha, notificações e e-mails. Por fim, o nivelamento traz oito questões de múltipla escolha sobre situações reais, como escolher o melhor pedido para corrigir uma tela. A pessoa pode responder “ainda não sei” ou pular o teste. Assim, o ponto de partida vem do desempenho, e não só da autoavaliação (seção 7.2.1)."),
    *d.figure(os.path.join(FIG, "fig-entrada.jpg"), 17, "Figura 17 — Entrada e Home no celular: entrar, onboarding, nivelamento e início"),
    H(3, "9.3.2 Educação"),
    P("A trilha mostra os módulos e o mapa de lições do módulo atual. Cada lição é curta, com cerca de dez minutos, e se divide em etapas: leitura, exemplo de antes e depois, pergunta de conferência e um espaço para a pessoa escrever e ajustar o próprio prompt. Junto do conteúdo ficam as anotações pessoais e as dúvidas daquela aula, que vêm da comunidade (Figura 18). Ao final de cada módulo, um checkpoint resume o que a pessoa já consegue fazer."),
    P("A área Praticar reúne atividades curtas de três tipos: escrever um prompt, revisar um código e fazer um projeto curto. Cada atividade mostra os critérios antes do envio. O resultado volta como um parecer por critério, com a marca de atendido ou parcial, e um comentário sobre o que melhorar. Há também um laboratório, sem avaliação e sem XP, em que a pessoa liga e desliga trechos de um prompt e vê como o resultado muda."),
    P("Os cursos da comunidade são minicursos criados por membros, com página própria, lista de aulas e player. O teste de proficiência tem dez questões e pede 70% de acerto. Quem passa recebe um selo no perfil, separado do nível por XP, e libera os módulos da trilha que ainda não fez."),
    *d.figure(os.path.join(FIG, "fig-educacao.jpg"), 18, "Figura 18 — Educação no celular: trilha, lição, laboratório do Praticar e resultado de uma atividade"),
    H(3, "9.3.3 Comunidade e perfil"),
    P("A comunidade é organizada por tags, como prompts, layout, componentes, estado, acessibilidade e ferramentas. Não há um feed genérico. Um post pode ser uma pergunta ou uma discussão e pode levar trechos de prompt e de código. Quem perguntou marca a resposta que resolveu, e essa marca rende XP a quem respondeu. Posts ligados a uma lição aparecem dentro dela, como dúvidas da aula. É essa ligação que faz a ponte entre Educação e Comunidade."),
    P("O perfil reúne o nível, o XP, a sequência de dias, o ranking entre amigos, o progresso na trilha e os selos de proficiência (Figura 19). Ele também tem uma seção de uso das ferramentas de IA, que mostra como ficaria o painel depois de a pessoa conectar as suas contas."),
    *d.figure(os.path.join(FIG, "fig-comunidade.jpg"), 19, "Figura 19 — Comunidade e perfil no celular: feed, post, perfil e teste de proficiência"),
    H(2, "9.4 Versão para computador"),
    P("O hub tem duas versões com papéis diferentes. O celular é para o hábito diário: uma lição curta, uma atividade rápida, uma resposta na comunidade. O computador é para as sessões longas, como praticar com a IA de código de verdade, escrever um post maior ou criar um minicurso (Figura 20). As duas versões usam o mesmo código e se adaptam ao tamanho da tela."),
    *d.figure(os.path.join(FIG, "fig-web1.jpg"), 20, "Figura 20 — Versão para computador: Home e lição"),
    P("Duas ferramentas existem só no computador (Figura 21). No editor de minicurso, o membro monta a estrutura, escreve cada aula, vê a prévia e confere uma lista antes de publicar. Na moderação, a equipe revisa as denúncias no contexto e registra uma decisão: manter, advertir ou remover o conteúdo."),
    *d.figure(os.path.join(FIG, "fig-web2.jpg"), 21, "Figura 21 — Ferramentas para computador: criar minicurso e moderação"),
    P("A landing apresenta o produto para quem ainda não tem conta (Figura 22). Ela abre com a frase “Sua imaginação é o limite.” e com flores em arte ASCII. Depois, mostra uma vitrine do que dá para criar com IA de código, o problema, as quatro frentes do hub, uma demonstração do mesmo pedido escrito de três formas e as perguntas frequentes. Ao longo da rolagem, um objeto em 3D muda de forma: bolinha de gude, bolha de sabão, bússola, bola 8 e bola de tênis."),
    *d.figure(os.path.join(FIG, "fig-landing.jpg"), 22, "Figura 22 — Landing do BASE8"),
    H(2, "9.5 Sistema de design e tecnologia"),
    P("As telas usam um sistema de design único. As cores, os espaçamentos e as fontes são definidos uma vez, como variáveis, e todos os componentes partem delas. É isso que permite trocar o tema claro pelo escuro sem redesenhar nada. Os componentes de base, como botões, campos, interruptores, avisos e esqueletos de carregamento, têm foco visível e área de toque de pelo menos 44 px, e respeitam a preferência de movimento reduzido do sistema."),
    P("A navegação tem recursos pensados para o uso frequente: uma paleta de comandos, aberta por atalho de teclado, que busca telas, lições, posts e pessoas; atalhos para os destinos principais; e transições curtas entre as telas."),
    P("O protótipo foi construído com Next.js, React e TypeScript, com estilos em Tailwind CSS e componentes da biblioteca shadcn. São 33 rotas (as 31 telas de produto e duas páginas de estudo) e cerca de 29 mil linhas de código, escritas com IA de código sob a minha direção (capítulo 12). O conteúdo das telas vem de arquivos de dados de exemplo, validados por esquema, o que facilita a troca por um banco de dados no futuro."),
    H(2, "9.6 O que o protótipo simula"),
    P("O protótipo é de alta fidelidade: tem o visual final, navega por todos os fluxos e valida os formulários. Mesmo assim, ele não é um aplicativo em operação. O Quadro 8 separa o que funciona do que é simulado."),
    *d.table("Quadro 8 — O que funciona e o que é simulado no protótipo",
             ["Parte", "No protótipo", "No produto final"],
             [["Navegação e telas", "Funcionam por completo, no celular e no computador", "Sem mudança"],
              ["Formulários", "Validam os campos e mostram os erros", "Gravam os dados"],
              ["Cadastro e login", "Levam direto à Home, sem criar conta", "Autenticação real"],
              ["Dados (perfil, posts, cursos e progresso)", "Exemplos fixos, iguais para todos", "Banco de dados por pessoa"],
              ["Avaliação das atividades", "Parecer de exemplo", "Parecer gerado por IA a cada envio"],
              ["Vídeo dos cursos", "Espaço reservado", "Player com os vídeos enviados"],
              ["Uso das ferramentas de IA", "Números fictícios", "Dados das contas conectadas"],
              ["Conteúdo da trilha", "Três lições completas do primeiro módulo", "Grade completa"]],
             [2700, 3371, 3000]),
    P("Essa escolha é intencional. O objetivo desta etapa era provar a experiência, e não a infraestrutura. Os passos para chegar ao produto final estão no capítulo 13."),
]
d.insert_before(h_div, cap9)

# ------------------------------------------------------------------ cap. 10: viabilidade
import cap10_viabilidade  # noqa: E402
d.insert_before(h_div, cap10_viabilidade.build(d))

# ------------------------------------------------------------------ divulgação: cap. 9 -> 10, Quadros 6-12 -> 9-15
QUADRO_SHIFT = 7
faixa = [h_div] + d.between(h_div, h_ref)
n_head = n_quad = n_fonte = 0
for e in faixa:
    pars = [e] if e.tag == q("p") else list(e.iter(q("p")))
    for p in pars:
        st = d.style(p)
        ts = list(p.iter(q("t")))
        if st in ("Ttulo1", "Ttulo2", "Ttulo3") and ts and re.match(r"9(\.\d+)* ", d.text(p)):
            assert re.match(r"9[. ]", ts[0].text)
            ts[0].text = "11" + ts[0].text[1:]; n_head += 1
        if st == "Ttulo3" and d.text(p).startswith("Fonte:"):
            ppr = p.find(q("pPr")); ppr.remove(ppr.find(q("pStyle")))
            for k, el in enumerate([d.el("spacing", line="240", lineRule="auto", after="240"), d.el("ind", firstLine="0"), d.el("jc", val="left")]):
                ppr.insert(k, el)
            for r in p.iter(q("r")):
                r.find(q("rPr")).insert(0, d.el("sz", val="20"))
            n_fonte += 1
        for t in ts:
            new, k = re.subn(r"Quadro (\d+)", lambda m: "Quadro %d" % (int(m.group(1)) + QUADRO_SHIFT), t.text or "")
            if k: t.text = new; n_quad += k
        joined = d.text(p)
        assert len(re.findall(r"Quadro \d+", joined)) == sum(len(re.findall(r"Quadro \d+", t.text or "")) for t in ts), joined[:80]
p_div1 = h_div.getnext()
for t in p_div1.iter(q("t")):
    if "aplicativo funcionando" in (t.text or ""):
        t.text = t.text.replace("além do aplicativo funcionando, uma campanha de comunicação", "além do protótipo do hub, o plano de uma campanha de comunicação")
assert "protótipo do hub" in d.text(p_div1), d.text(p_div1)[:200]
p_div2 = p_div1.getnext()
for t in p_div2.iter(q("t")):
    if "depois da banca" in (t.text or ""):
        t.text = t.text.replace("depois da banca", "depois da apresentação do projeto")
assert "depois da apresentação do projeto" in d.text(p_div2)
print("divulgação: títulos", n_head, "| quadros", n_quad, "| fontes corrigidas", n_fonte)

# ------------------------------------------------------------------ cap. 11: processo
cap11 = [
    H(1, "12 PROCESSO DE PROJETO COM IA DE CÓDIGO"),
    P("A pergunta projetual trata de incorporar, por meio da IA de código, expertises técnicas que excedem a formação do designer. Este projeto foi feito assim. Por isso, este capítulo documenta o processo: como dividi o trabalho com as ferramentas, o que deu certo, o que deu errado e o que continuou dependendo de mim."),
    H(2, "12.1 Como o trabalho foi dividido"),
    P("Em todas as etapas, a divisão seguiu o princípio adotado na seção 6.2: a ferramenta assume a parte técnica, e a decisão de projeto e a validação ficam comigo. Na prática, eu escrevia o briefing, escolhia entre as alternativas, apontava o que estava errado e decidia quando parar. A IA media, escrevia o código, gerava as variações e aplicava as correções. O Quadro 20 resume essa divisão por etapa."),
    *d.table("Quadro 20 — Divisão do trabalho entre o designer e a IA, por etapa",
             ["Etapa", "Ferramentas", "O que eu fiz", "O que a IA fez"],
             [["Pesquisa e relatório", "Claude", "Defini os eixos, escolhi o recorte e revisei o texto", "Buscou e organizou fontes e redigiu rascunhos"],
              ["Estrutura do hub", "FigJam e Claude Code", "Decidi as áreas, as regras e as referências", "Montou o mapa e as ligações"],
              ["Wireframes e telas", "Figma, agente de IA do Figma e Claude Code", "Defini a hierarquia e escolhi entre versões", "Gerou os modelos das 32 telas"],
              ["Identidade visual", "Illustrator, Claude Code e Codex", "Desenhei, escolhi e ajustei à mão", "Mediu os vetores, construiu a geometria, vetorizou a pintura da logo e escreveu o script do brandbook"],
              ["Protótipo", "Claude Code", "Escrevi a direção visual e revisei cada tela no navegador", "Escreveu o código e rodou as verificações automáticas"],
              ["Divulgação", "Claude Code e HyperFrames", "Defini o conceito, o público e o tom", "Estruturou o plano e testou as ferramentas de vídeo"]],
             [1700, 2000, 2671, 2700]),
    H(2, "12.2 Linha do tempo"),
    P("O Quadro 21 mostra o que aconteceu em cada mês de 2026, de acordo com as fases do Duplo Diamante."),
    *d.table("Quadro 21 — Linha do tempo do projeto",
             ["Mês", "Fase", "Marcos"],
             [["Agosto", "Discover", "Roteiro e pesquisa exploratória; levantamento de público; instrumentos de campo, entrevista E1 e questionário; primeiros testes com Claude Code"],
              ["Setembro", "Define", "Pergunta projetual; benchmarking de marca e DNA; ajuste da linguagem do relatório; benchmarking de estratégias; primeira proposta de solução"],
              ["Outubro", "Develop", "Construção da logo e do mascote; troca para “IA de código”; saída do pet e desenho do hub; paleta; mapa de 32 telas e wireframes; primeira versão do protótipo em código; nome BASE8 e brandbook"],
              ["Novembro", "Develop", "Landing e arte ASCII; plano de divulgação; revisão editorial de todas as telas; objeto 3D da landing; logo final; apresentação de 27 de novembro"]],
             [1500, 1400, 6171]),
    H(2, "12.3 Cinco casos"),
    P("Escolhi cinco casos que mostram, juntos, o alcance e os limites das ferramentas."),
    P("**Caso 1: duas ferramentas, o mesmo briefing.** Na logo (capítulo 8), entreguei o mesmo briefing ao Claude Code e ao Codex. A medição ponto a ponto mostrou erros do meu vetor que eu não via a olho, e de que tamanho eram. Mas a versão mais regrada ficou dura. Semanas depois, o lettering da logo nova repetiu a história: a reconstrução geométrica perdeu a graça do rascunho, e pedi um traçado fiel ao meu desenho. A IA acerta a medida. Quem sabe quando a medida estraga o desenho sou eu."),
    P("**Caso 2: 32 telas em um dia.** Os wireframes das 32 telas foram gerados em um dia, por vários agentes de IA trabalhando ao mesmo tempo, a partir do mapa de páginas. O ganho de velocidade foi enorme. Em contrapartida, a IA preencheu as lacunas do briefing com regras que eu não tinha decidido, como “o nivelamento não vale XP”. Elas pareciam razoáveis, e justamente por isso eram perigosas. Passei a revisar toda tela gerada em busca de decisões que não eram minhas. Nessa etapa também comparei dois caminhos e preferi as telas geradas pelo agente de IA do próprio Figma às montadas por script."),
    P("**Caso 3: o brandbook que se regenera.** O brandbook é gerado por um script no Illustrator. Nas primeiras versões, eu achava os alinhamentos tortos, mesmo com a conta certa. O que resolveu foi inverter o fluxo: eu ajustava as pranchas à mão, e a IA lia as minhas medidas no arquivo e as levava para o script. Houve também um erro grave. Em uma das rodadas, um comando fechou sem salvar os documentos que eu tinha abertos, e perdi trabalho. Desde então, vale uma regra fixa: nenhum script fecha arquivo meu."),
    P("**Caso 4: o objeto 3D e o limite do olho.** O objeto 3D da landing passou por várias rodadas. As transições agradaram de primeira. A aparência, não: achei o resultado artificial e precisei mandar fotos de referência de cada material, como latão antigo, vidro e feltro. Depois veio outro problema, o peso. A animação estava pesada demais para uma página de entrada e foi refeita em um formato leve. Por fim, eu mesmo cortei parte do efeito, porque o começo da página tinha ficado poluído. Nesse caso, a técnica nunca foi o obstáculo. O que faltava à IA era o critério de quando o resultado convence."),
    P("**Caso 5: uma direção escrita, cinco frentes em paralelo.** Em novembro, achei a interface simples demais e divertida demais para o público. Em vez de corrigir tela por tela, escrevi uma direção visual com princípios, exemplos e uma lista do que não fazer (seção 8.14). Com esse documento, a revisão de todas as telas foi feita em um dia, em cinco frentes paralelas: landing, Home e perfil, educação, comunidade e entrada, e navegação. Quando a direção está escrita, a IA mantém a consistência em um volume que eu não alcançaria sozinho."),
    H(2, "12.4 Onde a IA ajudou"),
    P("O ganho mais claro foi de alcance. Sem ser programador, entreguei um protótipo navegável com 31 telas, tema escuro, animações e um objeto 3D. Em um processo tradicional, eu teria parado nas telas do Figma. O segundo ganho foi de expertise incorporada. A IA trouxe para o projeto conhecimentos que não são da minha formação, como o cálculo de contraste das cores (seção 8.10), as regras de acessibilidade dos componentes e a estrutura do código. O terceiro foi de velocidade na exploração: gerar variações de logo, de paleta e de tela ficou barato, e pude escolher olhando, e não imaginando."),
    H(2, "12.5 Onde a IA falhou"),
    P("As falhas se repetiram em quatro padrões. O primeiro é inventar: diante de uma lacuna, a IA decide por conta própria e não avisa. O segundo é tender ao genérico e ao certinho: a primeira versão de quase tudo saiu correta e sem graça. O terceiro é a primeira entrega visual, que raramente convence e depende de referências e de várias rodadas. O quarto é agir sem medir a consequência, como no comando que fechou os meus arquivos. Além disso, a IA erra o tom: os primeiros textos e diagramas saíram difíceis e abstratos, distantes de como eu me comunico."),
    H(2, "12.6 O que continuou dependendo de mim"),
    P("Três coisas não foram delegadas. A primeira são as decisões de projeto: tirar o pet, trocar o termo do trabalho, escolher o nome e a paleta. A segunda é o julgamento estético, que nos cinco casos foi o que fechou cada etapa. A terceira é a validação: conferi cada tela no navegador, no celular e no computador, nos dois temas."),
    P("Reconheço um limite. A pesquisa de campo mostrou que quem desenvolve não aceita código de IA sem revisão cuidadosa (seção 4.4.3). Eu não tenho formação para auditar a arquitetura ou a segurança do código. No protótipo, essa revisão ficou com verificações automáticas de tipos e de padrões e com um agente revisor. Isso basta para um protótipo com dados de exemplo. Para um produto com dados reais de pessoas, a revisão de um desenvolvedor passa a ser obrigatória. É o risco de delegação excessiva, discutido na seção 2.6.3, aplicado ao meu próprio caso."),
    P("Por fim, a redação deste relatório também teve o apoio da IA, na busca de fontes, na organização e nos rascunhos. O recorte, as decisões e a revisão são meus. Em setembro, por exemplo, achei o texto difícil demais e defini o registro que o documento usa hoje, formal e simples."),
    H(2, "12.7 Síntese: o que o processo responde"),
    P("A pergunta projetual começa com “como posso”. O processo dá uma resposta em três partes. Posso, quando o trabalho começa por um briefing claro e por uma direção escrita. Posso, quando julgo o resultado com o olho de designer e peço outra rodada. E posso, quando reconheço o que não sei revisar e busco essa validação fora. Essas três condições são também o que o BASE8 se propõe a ensinar."),
]
# ------------------------------------------------------------------ cap. 12: próximas etapas
cap12 = [
    H(1, "13 PRÓXIMAS ETAPAS"),
    P("Este capítulo reúne o que fica para depois desta entrega. São as etapas da fase Deliver do Duplo Diamante e os passos para levar o protótipo a um produto em operação."),
    H(2, "13.1 Teste de usabilidade"),
    P("O teste de usabilidade com designers não foi aplicado nesta etapa e é o primeiro passo previsto. O protocolo está no Quadro 22. Cinco participantes costumam bastar para revelar a maior parte dos problemas de uso em uma rodada (Nielsen, 2000). A escala SUS mede a percepção geral de facilidade de uso (Brooke, 1996), e a média de referência é de 68 pontos (Sauro, 2011)."),
    *d.table("Quadro 22 — Protocolo do teste de usabilidade",
             ["Item", "Definição"],
             [["Objetivo", "Verificar se um designer consegue entrar, aprender, praticar e pedir ajuda sem orientação"],
              ["Participantes", "Cinco designers do público do projeto, com algum contato com IA"],
              ["Formato", "Sessão individual de 30 a 40 minutos, moderada, com o protótipo no celular e no computador"],
              ["Tarefa 1", "Criar a conta e fazer o nivelamento"],
              ["Tarefa 2", "Concluir uma lição da trilha"],
              ["Tarefa 3", "Fazer uma atividade do Praticar e explicar o parecer recebido"],
              ["Tarefa 4", "Encontrar a resposta de uma dúvida na comunidade e publicar uma pergunta"],
              ["Tarefa 5", "Localizar o próprio progresso e o teste de proficiência"],
              ["Medidas", "Conclusão de cada tarefa, erros, pedidos de ajuda, falas em voz alta e questionário SUS"],
              ["Uso dos resultados", "Lista de ajustes por gravidade, aplicada ao protótipo antes do desenvolvimento do produto"]],
             [2200, 6871]),
    H(2, "13.2 Pesquisa com designers"),
    P("A pesquisa de campo do capítulo 4 começou por quem desenvolve. A coleta com designers, o público do projeto, foi iniciada em novembro e tem duas respostas (seção 4.6). O passo seguinte é ampliar essa coleta e conferir se os indícios se repetem, inclusive a percepção de que as capacidades simples de automação aproximam mais o designer do que os projetos grandes. As entrevistas com os perfis de gestão (seção 4.3) seguem com o roteiro pronto."),
    H(2, "13.3 Do protótipo ao produto"),
    P("Para o protótipo virar um produto em operação, faltam as partes que o Quadro 8 marca como simuladas: autenticação, banco de dados, progresso salvo por pessoa, avaliação das atividades por IA e envio de vídeos. A avaliação por IA pede atenção especial, porque tem custo a cada uso e precisa de critérios estáveis. Entram também as obrigações com dados pessoais previstas na Lei Geral de Proteção de Dados Pessoais (Brasil, 2018), os termos de uso e as regras de moderação. Como registrado na seção 12.6, essa etapa pede a revisão de um desenvolvedor."),
    H(2, "13.4 Conteúdo"),
    P("O protótipo tem três lições completas. A grade definitiva ainda está em aberto. Um estudo de outubro propõe sete módulos e 34 aulas, organizados por competência e válidos para as principais ferramentas do mercado. O protótipo, por sua vez, mostra uma trilha mais curta, centrada em interface. Fechar essa grade resolve também a tensão entre fundamentos e área específica, registrada na seção 6.3.1."),
    H(2, "13.5 Identidade e campanha"),
    P("Na identidade, faltam a versão reduzida da logo, as regras de uso que dependem dela e as ilustrações de apoio (seção 8.16). Na campanha, o plano do capítulo 11 está pronto para ser produzido: o vídeo manifesto, a série de oito episódios, os pôsteres e os carrosséis. O registro da marca no INPI acompanha essa etapa."),
]
d.insert_before(h_ref, cap11 + cap12)

# ------------------------------------------------------------------ referências
for ref in [
    "BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018.",
    "BROOKE, J. SUS: a “quick and dirty” usability scale. In: JORDAN, P. W. et al. (ed.). Usability evaluation in industry. London: Taylor & Francis, 1996. p. 189-194.",
    "NIELSEN, J. Why you only need to test with 5 users. Nielsen Norman Group, 2000. Disponível em: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/. Acesso em: 12 nov. 2026.",
    "SAURO, J. Measuring usability with the System Usability Scale (SUS). MeasuringU, 2011. Disponível em: https://measuringu.com/sus/. Acesso em: 12 nov. 2026.",
    "W3C. Web Content Accessibility Guidelines (WCAG) 2.1. 2018. Disponível em: https://www.w3.org/TR/WCAG21/. Acesso em: 12 nov. 2026.",
]:
    d.add_reference(ref)
for ref in cap10_viabilidade.REFERENCIAS:
    d.add_reference(ref)

d.save(out)
print("salvo:", out)

# Versão limpa (sem alterações controladas), usada para gerar o PDF de envio:
#   python3 atualizar_relatorio.py <pasta-temporária> <caminho-do-docx-limpo>
if len(sys.argv) > 2:
    d.accept_all()
    d.save(sys.argv[2])
    print("versão limpa:", sys.argv[2])
