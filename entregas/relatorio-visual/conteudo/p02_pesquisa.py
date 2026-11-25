"""Capítulo 2: Levantamento de pesquisa exploratória."""
from blocos import divisor, cards, numeros, tabela, texto

PAGINAS = [
    divisor("02", "Pesquisa", "exploratória", "Cinco eixos, de agosto de 2026, para mapear o campo entre design, código e IA generativa.", "riso"),
    cards("Cinco eixos", "em síntese", [
        ("Eixo 1", "Agentes de código", "O Claude Code lê o projeto inteiro, planeja, edita vários arquivos, roda testes e corrige o que falhou."),
        ("Eixo 2", "Alfabetização técnica", "Um conhecimento básico de código ajuda. O designer não precisa virar desenvolvedor full-stack."),
        ("Eixo 3", "Uso no design", "Há relatos e casos de fornecedores, mas <strong>nenhum estudo acadêmico</strong> sobre designers usando agentes de código."),
        ("Eixo 4", "Duplo Diamante", "Serve também à gestão e a times ágeis, como linguagem comum entre design, produto e engenharia."),
        ("Eixo 5", "Riscos", "A literatura alerta para deskilling, delegação cognitiva excessiva e fixação de design."),
    ], lead="O levantamento partiu do roteiro do capítulo 1. <strong>A maior parte dos dados vem de fontes de mercado</strong>, não de artigos revisados por pares."),
    numeros("Adoção", "e confiança", [
        ("84%", "dos desenvolvedores já usam IA para programar, mas só <strong>29%</strong> confiam totalmente no que ela gera.", "DigitalApplied; Uvik, 2026"),
        ("11,4h", "por semana revisando código de IA, contra 9,8h escrevendo código novo.", "DigitalApplied; Uvik, 2026"),
        ("43%", "das mudanças geradas por IA ainda precisaram de depuração manual.", ""),
    ], lead="Entre programadores, a IA de código já é rotina. <strong>Revisar passou a tomar mais tempo do que escrever.</strong>"),
    numeros("Ganhos", "de produtividade", [
        ("55%", "mais rápido: desenvolvedores com GitHub Copilot em experimento controlado com 95 participantes.", "GitHub Research, 2022"),
        ("14–15%", "mais problemas resolvidos por hora no suporte, e 30–35% entre os menos experientes.", "Brynjolfsson et al., NBER"),
        ("88%", "das organizações usam IA em ao menos uma função de negócio.", "McKinsey, 2025"),
        ("US$ 37 bi", "gastos pelas empresas em IA generativa em 2025, contra US$ 11,5 bi em 2024.", "Menlo Ventures, 2025"),
    ], lead="O ganho é real em <strong>tarefas específicas e bem delimitadas</strong>."),
    numeros("Limites", "e riscos", [
        ("95%", "dos projetos-piloto de IA generativa nas empresas não geram impacto mensurável de P&amp;L.", "MIT, 2025"),
        ("39%", "das empresas relatam impacto mensurável no EBIT, mesmo com 88% de adoção.", "McKinsey, 2025"),
        ("40%+", "dos projetos de IA agêntica devem ser cancelados até o fim de 2027.", "Gartner"),
        ("Klarna", "substituiu atendentes de forma agressiva, perdeu qualidade e recontratou parte da equipe.", "Caso documentado"),
    ], lead="A causa principal é organizacional: <strong>falta aprender a integrar a IA ao trabalho</strong>, não falta tecnologia."),
    tabela("Precedente", "brasileiro",
           ["", "Dissertação USP (Souza, 2025)", "TCC (fase exploratória)"],
           [
               ["Programa", "Mestrado Profissional em Empreendedorismo (FEA-USP)", "Graduação em Design"],
               ["Método", "Design Science Research, com sessões Think Aloud", "Estudo de caso e análise crítica do uso de IA"],
               ["Objeto", "App de planejamento de viagens de lazer", "Designer usando IA para atuar fora do seu domínio"],
               ["Foco", "Um setor específico (turismo)", "O fenômeno da ampliação de domínio"],
           ],
           lead="O trabalho mais próximo que encontrei. <strong>Não há sobreposição de escopo, método nem objeto.</strong>",
           nota="Fonte: Tabela 1, elaborada pelo autor (2026). Na fase exploratória, o estudo de caso era um produto físico, depois substituído pelo BASE8.", tam=22),
    texto("Lacunas", "e posicionamento",
          lead="<strong>Ninguém estudou ainda o profissional individual</strong> que usa um agente de IA para ir além do que a formação cobre. É esse o espaço do TCC.",
          bullets=[
              "A IA generativa é muito usada na prototipagem e pouco na conceituação e em decisões fora do domínio do designer.",
              "Os estudos sobre IA como “co-founder” vêm da administração e quase não se cruzam com o design.",
              "Não encontrei precedente brasileiro com o mesmo recorte; o mais próximo é a dissertação da USP.",
              "Frameworks de colaboração humano-IA (COFI, Three-Level) ainda não foram aplicados ao designer generalista.",
          ]),
]
