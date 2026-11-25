"""Capítulo 6: benchmarking de estratégias."""
from blocos import divisor, tabela, cards

CAB = ["Alvo", "Referências", "Princípio adotado"]

PAGINAS = [
    divisor("06", "Benchmarking", "de estratégias",
            "Da fase Define para a Develop. O caminho inverso do capítulo 5: de cada valor do DNA aos mecanismos de mercado que o colocam em prática.", "riso"),

    cards("Valor central", "POTENCIALIZAÇÃO",
          [("Referência", "PAAR", "O atleta vira militar temporário. O programa paga as condições que tornam o resultado possível."),
           ("Referência", "v0 (Vercel)", "Transforma uma descrição em interface pronta e orienta a pedir explicação do código."),
           ("Referência", "Muro dos boxes", "A equipe decide a estratégia; o piloto segue insubstituível no que só ele faz: dirigir.")],
          lead="Princípio adotado: <strong>entregar pronta a parte técnica que falta e manter com o designer "
               "a decisão de projeto e a validação</strong>.",
          nota="Método: para cada um dos 13 alvos do DNA, três mecanismos de mercado (39 fichas), um princípio adotado e uma "
               "anti-referência. Aqui, a anti-referência é a instrução opaca do rádio da Fórmula 1."),

    tabela("Pilar", "HOLÍSTICA", CAB,
           [["HOLÍSTICA", "PUCPR, checklist da OMS, Bauhaus", "A visão do todo entra no início de cada ciclo de trabalho, nunca como portão de entrada."],
            ["sistêmica", "Trilha do Duolingo, manual IKEA, mapa de Beck", "Mostrar o sistema como diagrama de dependências, com o mapa completo a um clique."],
            ["prática", "The Odin Project, residência médica, Nand2Tetris", "Toda entrega termina em artefato real e testável; o primeiro contato é supervisionado."]],
           lead="O todo não é conteúdo a mais: <strong>está presente no momento da decisão</strong>."),

    tabela("Pilar", "ACESSIBILIDADE", CAB,
           [["ACESSIBILIDADE", "Scratch, Super Mario Bros. 1-1, bicicleta de equilíbrio", "Isolar a barreira do iniciante dentro da tarefa, nunca por manual antes da primeira ação."],
            ["personalizada", "Birdbrain (Duolingo), exame de refração, Stitch Fix", "Descobrir o repertório pela reação a exemplos concretos, nunca por autoavaliação."],
            ["progressiva", "Anki, faixas do judô, Couch to 5K", "A dificuldade sobe e desce pelo desempenho comprovado; recuar não apaga o conquistado."]],
           lead="A entrada fica mais fácil quando <strong>uma barreira é removida</strong>, e não quando se acrescenta instrução."),

    tabela("Pilar", "CONEXÃO", CAB,
           [["CONEXÃO", "Recurse Center, Focusmate, padrinho dos Alcoólicos Anônimos", "Oferecer um contato humano fácil em cada trava, e não uma aula."],
            ["coletividade", "Pull requests (GitHub), mutirão, brigada de cozinha", "Organizar a contribuição do grupo por papéis complementares e visíveis."],
            ["profissional", "Patreon, Airbnb Superhost, BloomTech", "Cada entrega gera um registro público e portátil do resultado."]],
           lead="O mecanismo não ensina conteúdo: cria <strong>uma testemunha ou um par</strong> que enxerga o progresso."),

    tabela("Pilar", "INOVAÇÃO", CAB,
           [["INOVAÇÃO", "Cursor, Nubank, Nintendo Wii", "Medir o resultado entregue com o agente, e não a formação técnica prévia."],
            ["ousado", "Basecamp (Shape Up), Patagonia, 42 School", "Recusar uma convenção do setor só quando outra prova de qualidade a substitui."],
            ["gamificado", "Sequência do Duolingo, cartão-fidelidade, Beeminder", "Perdão gratuito e progresso dado no início; nenhuma cobrança por falha."]],
           lead="Inovar é <strong>trocar o critério que o setor usa para provar valor</strong> por outro, mais acessível."),

    cards("Síntese:", "cinco ideias",
          [("01", "Descobrir em vez de perguntar", "O sistema descobre o nível pelo que a pessoa faz, erra ou escolhe."),
           ("02", "A estrutura assume o técnico", "O agente executa; o designer aprova com a explicação à vista."),
           ("03", "Artefato real como medida", "O placar conta entregas, e não dias de uso."),
           ("04", "Errar sem perder o conquistado", "Toda ação do agente pode ser desfeita e revista."),
           ("05", "Pares no lugar do professor", "A revisão humana é distribuída entre pares com papéis claros.")],
          lead="Lidos juntos, os 13 princípios se resumem a cinco ideias, <strong>o critério para avaliar as alternativas</strong>."),

    tabela("Das ideias", "ao projeto", ["Tensão", "Saída adotada"],
           [["Autonomia do agente × revisão do designer", "Delegar a execução, mas exigir revisão explicada antes de aceitar."],
            ["Supervisão no início × entrada sem portão", "A supervisão acompanha a tarefa real, em vez de vir antes dela."],
            ["Trilha única × liberdade de quem já sabe", "Um próximo passo visível, mapa a um clique e opção de pular."],
            ["Nível descoberto × autonomia da pessoa", "O sistema propõe o nível, e a pessoa o contesta com uma entrega."]],
           lead="Algumas ideias puxam para lados opostos. <strong>Registrei as tensões</strong> e uma saída para cada uma.",
           nota="Essas ideias e tensões foram o ponto de partida da geração de alternativas (capítulo 7).", tam=23),
]
