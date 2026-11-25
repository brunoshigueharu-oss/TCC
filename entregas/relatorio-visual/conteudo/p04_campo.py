"""Capítulo 4: Pesquisa de campo."""
from blocos import divisor, tabela, cards, numeros, texto

PAGINAS = [
    divisor("04", "Pesquisa", "de campo", "Entrevistei profissionais de tecnologia e ouvi designers para testar o que a literatura dizia.", "verde"),
    tabela("Método", "e amostra",
           ["Instrumento", "Público", "Participantes"],
           [
               ["Entrevista semiestruturada (6 blocos, 25 perguntas)", "Profissional de tecnologia", "1 entrevista (E1)"],
               ["Questionário (Google Forms)", "Profissionais de tecnologia", "5 respostas"],
               ["Questionário aberto (11 perguntas)", "Designers", "2 respostas"],
           ],
           lead="Três instrumentos qualitativos, de agosto a novembro de 2026: <strong>ouvir quem já usa IA de código e quem ainda não usa</strong>.", tam=23),
    cards("Entrevista E1:", "dados e BI", [
        ("Achado", "Contexto evita o genérico", "Um repositório interno de marca usado como contexto deixa os resultados alinhados à identidade."),
        ("Achado", "Revisão obrigatória", "Mesmo com uso diário, a revisão humana continua regra. A IA “acaba fazendo muita coisa muito rápido”."),
        ("Achado", "Depende do papel da IA", "Pedir opinião limita a criatividade; dar forma a uma ideia vaga a amplia."),
        ("Achado", "Decisão intuitiva", "Usar ou não a ferramenta segue o “feeling”, sem processo definido."),
        ("Recomendação", "Entender o “como”", "Para o designer, o essencial é entender como a IA chega ao resultado, não tratá-la como caixa-preta."),
        ("Perfil", "Visão complementar", "Analista de dados com dois anos de tecnologia: o olhar de quem usa IA de código no dia a dia, fora do design."),
    ]),
    numeros("Questionário", "(n = 5)", [
        ("1,4", "de 5 é a confiança em aceitar código de IA sem revisão cuidadosa. <strong>Nenhuma resposta acima de 2.</strong>", "Resultado mais consistente"),
        ("3,6", "de 5 para “prefiro que designers não mexam em código”, com respostas divididas (5, 1, 5, 2, 5).", "Opinião dividida"),
        ("3,8", "de 5 para a sensação de estar “perdendo prática” por deixar tarefas com a IA.", "Risco percebido"),
        ("4 de 5", "usam IA de código todos os dias. Nenhum dos respondentes é designer.", "Perfil da amostra"),
    ], lead="Os dois que discordam da restrição <strong>são os que têm contato regular com designers</strong>. A resistência parece vir da distância, não da técnica."),
    texto("Pesquisa", "com designers",
          lead="Os designers acham que a IA consegue tudo, <strong>mas duvidam do que eles mesmos conseguiriam fazer com ela</strong>.",
          bullets=[
              "Duas respostas (R1 e R2). Nenhuma das duas usou IA para gerar código.",
              "Só um tipo de projeto teve “sim” das duas: um sistema para organizar clientes e projetos.",
              "O processo é imaginado como simples demais (horas) ou difícil demais (meses), sem revisar, ajustar e testar.",
              "A barreira não é medo: é falta de necessidade no trabalho atual ou a sensação de complexidade.",
              "As duas defendem o papel do designer: sem interferência humana, o resultado fica raso.",
          ],
          nota="Daí a escolha de mostrar também capacidades simples da rotina: vetorizar, montar fluxogramas, automatizar brandbooks, editar vídeos."),
    texto("Síntese", "da pesquisa de campo",
          lead="Os achados de campo <strong>orientaram o recorte do capítulo 5</strong> e o conteúdo do BASE8.",
          bullets=[
              "<strong>Revisão humana é regra</strong> em todos os perfis técnicos, mesmo com uso diário e maduro.",
              "O resultado genérico depende mais do contexto de marca do que da ferramenta.",
              "A familiaridade com a colaboração, não só com a ferramenta, pode explicar as diferenças de opinião.",
              "O conteúdo do BASE8 precisa mostrar o processo real: pedido, revisão e ajuste.",
          ]),
]
