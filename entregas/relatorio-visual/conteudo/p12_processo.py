"""Capítulo 12: processo de projeto com IA de código."""
from blocos import divisor, tabela, colunas

PAGINAS = [
    divisor("12", "Processo de projeto", "com IA de código",
            "Este projeto foi feito como a pergunta propõe. Registro como dividi o trabalho, "
            "o que deu certo, o que deu errado e o que dependeu de mim.", "noite"),

    tabela("Designer", "× IA", ["Etapa", "O que eu fiz", "O que a IA fez"],
           [["Pesquisa e relatório", "Defini os eixos, o recorte e revisei", "Buscou fontes e redigiu rascunhos"],
            ["Estrutura do hub", "Decidi áreas, regras e referências", "Montou o mapa e as ligações"],
            ["Wireframes e telas", "Defini a hierarquia e escolhi versões", "Gerou os modelos das 32 telas"],
            ["Identidade visual", "Desenhei, escolhi e ajustei à mão", "Mediu, construiu a geometria e os scripts"],
            ["Protótipo", "Escrevi a direção e revisei cada tela", "Escreveu o código e as verificações"],
            ["Divulgação", "Defini conceito, público e tom", "Estruturou o plano e montou os vídeos"]],
           lead="A ferramenta assume a parte técnica; <strong>a decisão e a validação ficam comigo</strong>.", tam=23),

    tabela("Linha", "do tempo", ["Mês", "Fase", "Marcos"],
           [["Agosto", "Discover", "Pesquisa exploratória, público, entrevista E1, questionário, primeiros testes"],
            ["Setembro", "Define", "Pergunta projetual, DNA, benchmarking de estratégias, primeira proposta"],
            ["Outubro", "Develop", "Logo, saída do pet, paleta, 32 telas, primeiro protótipo, nome BASE8"],
            ["Novembro", "Develop", "Landing, plano de divulgação, revisão das telas, logo oficial, campanha"]],
           tam=23),

    colunas("O que o", "processo mostrou",
            [{"kicker": "Onde a IA ajudou", "itens": [
                "<strong>Alcance:</strong> sem ser programador, entreguei um protótipo navegável.",
                "<strong>Expertise:</strong> contraste, acessibilidade e estrutura de código.",
                "<strong>Velocidade:</strong> escolher olhando, e não imaginando."]},
             {"kicker": "Onde falhou", "itens": [
                "Decidiu lacunas sem avisar.",
                "Tendeu ao genérico e ao certinho.",
                "Agiu sem medir a consequência e errou o tom."]},
             {"kicker": "O que dependeu de mim", "itens": [
                "As decisões de projeto.",
                "O julgamento estético.",
                "A validação, e buscar fora a revisão que não sei fazer."]}],
            lead="Posso, quando há <strong>briefing claro</strong>, quando julgo com <strong>olho de designer</strong> "
                 "e quando reconheço <strong>o que não sei revisar</strong>."),
]
