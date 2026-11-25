"""Capítulo 13: considerações finais (versão fechada, sem lista de pendências)."""
from blocos import divisor, cards, texto, destaque

PAGINAS = [
    divisor("13", "Considerações", "finais",
            "O que o projeto entrega e a resposta à pergunta projetual.", "rosa"),

    cards("O que o projeto", "entrega",
          [("Descobrir", "Pesquisa", "Levantamento exploratório, público-alvo, entrevista, questionário e pesquisa com designers."),
           ("Definir", "Pergunta e DNA", "Pergunta projetual e DNA de marca: potencialização, com quatro pilares e oito vertentes."),
           ("Desenvolver", "Benchmarking", "Estratégias de mercado traduzidas em princípios para cada valor do DNA."),
           ("Entregar", "Protótipo BASE8", "Hub navegável em código, no celular e no computador, construído com IA de código."),
           ("Entregar", "Identidade visual", "Nome, logo oficial, logo ilustrada, paleta, tipografia e brandbook de 32 pranchas."),
           ("Entregar", "Negócio e campanha", "Modelo de negócio com projeção em três cenários e a campanha de lançamento “Até onde?”.")]),

    texto("A resposta", "à pergunta",
          lead="A resposta veio em <strong>duas frentes</strong>: o hub que projetei e o processo com que o construí.",
          bullets=["<strong>O BASE8:</strong> trilha com a base comum das ferramentas, prática ligada ao trabalho real, "
                   "comunidade e perfil de progresso.",
                   "<strong>O processo:</strong> sem ser programador, entreguei um protótipo navegável, "
                   "uma identidade aplicada por scripts e um relatório com apoio de IA de código.",
                   "<strong>Três condições:</strong> briefing claro, julgamento de designer em cada rodada "
                   "e reconhecer o que eu não sei revisar.",
                   "São essas condições que o BASE8 se propõe a ensinar."]),

    destaque("Considerações finais",
             "A IA de código amplia o alcance do designer quando ele continua no papel de quem decide.",
             "A IA ampliou o alcance e a velocidade do trabalho. As decisões de projeto, o julgamento estético "
             "e a validação continuaram com o designer."),
]
