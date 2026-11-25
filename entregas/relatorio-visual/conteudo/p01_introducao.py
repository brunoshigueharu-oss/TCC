"""Capítulo 1: Introdução."""
from blocos import divisor, texto, cards

PAGINAS = [
    divisor("01", "", "Introdução", "A IA de código abriu a construção de produtos digitais a quem não programa. Falta ao designer um caminho para usá-la.", "noite"),
    texto("O problema", "e o contexto",
          lead="Para quem programa, a IA de código já é rotina. <strong>No design, ela ainda é pouco conhecida</strong>, e falta um caminho para usá-la.",
          bullets=[
              "<strong>84%</strong> dos desenvolvedores já usam IA para programar (DigitalApplied; Uvik, 2026).",
              "Entre os designers e criativos entrevistados, <strong>nenhum conhecia o potencial</strong> da IA de código.",
              "O assunto quase não circula no design, na ilustração e na música, e os materiais de ensino são pensados para quem já programa.",
              "A barreira não é a dificuldade: é a <strong>distância</strong> entre o mundo criativo e essas ferramentas.",
          ],
          nota="“Mais uma insegurança do que uma realidade.” Designer, sobre por que nunca tentou usar IA de código."),
    texto("Objetivo", "e pergunta",
          lead="<strong>Projetar o BASE8</strong>, um hub web e mobile que capacita designers a usar IA de código, e construí-lo como protótipo de alta fidelidade com as ferramentas que ele ensina.",
          kicker="Pergunta projetual (seção 5.1.1)",
          paragrafos=["“Como posso <strong>potencializar as competências do designer</strong> e ampliar o alcance de sua atuação incorporando, por meio da IA de código, expertises técnicas que excedem sua formação?”"],
          nota="O projeto é o seu próprio caso: como designer, dirigi a construção de um produto digital com apoio de IA de código (capítulo 12)."),
    cards("Método:", "Duplo Diamante", [
        ("Discover · cap. 2 a 4", "Descobrir", "Pesquisa bibliográfica, dados de mercado e pesquisa de campo."),
        ("Define · cap. 5", "Definir", "Pergunta projetual e DNA de marca."),
        ("Develop · cap. 6 a 11", "Desenvolver", "Benchmarking de estratégias, solução, identidade, protótipo e plano de divulgação."),
        ("Deliver · cap. 13", "Entregar", "Protótipo navegável, identidade visual, modelo de negócio e campanha de lançamento."),
    ], lead="Usei o modelo do Design Council, com quatro fases. <strong>A entrega é um protótipo navegável em código</strong>, não um aplicativo em operação.",
       nota="Os capítulos 1 a 4 foram escritos antes de outubro de 2026 e usam “IA agêntica” e “IA generativa”. Do capítulo 5 em diante, o termo é “IA de código”."),
    cards("Eixos", "de pesquisa", [
        ("Eixo 1", "IA de código e Claude Code", "O que é a ferramenta e como se posiciona frente a Copilot, Cursor e outras."),
        ("Eixo 2", "Design × programação", "Quanto o designer precisa entender de código e o que já reduz essa barreira."),
        ("Eixo 3", "Claude Code no design", "Como designers usam agentes de código e que lacunas existem."),
        ("Eixo 4", "Design, gestão e processo", "O Duplo Diamante fora do design: gestão, times ágeis e colaboração."),
        ("Eixo 5", "Estado da arte e riscos", "Frameworks de colaboração humano-IA, deskilling e delegação cognitiva."),
    ], lead="O roteiro exploratório de agosto de 2026 reuniu 12 tópicos iniciais em quatro eixos. <strong>O quinto surgiu durante a busca.</strong>"),
]
