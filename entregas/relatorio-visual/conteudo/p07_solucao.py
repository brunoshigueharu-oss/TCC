"""Capítulo 7: a solução proposta."""
from blocos import divisor, cards, figura, tabela, colunas

PAGINAS = [
    divisor("07", "A solução", "proposta",
            "O BASE8: um hub web e mobile que capacita designers a usar IA de código em projetos reais, "
            "sem transformá-los em programadores.", "verde"),

    cards("Áreas", "do hub",
          [("Entrada", "Nivelamento", "Objetivo, área e uso de IA. Um teste curto, com situações reais, define onde a pessoa começa."),
           ("Educação", "Trilha e prática", "Lições curtas com leitura, exemplo e prática. Checkpoints mostram o que já se consegue fazer."),
           ("Comunidade", "Por tags", "Perguntar o que travou e mostrar o que funcionou. Cada lição tem o seu fio de dúvidas."),
           ("Perfil", "Progressão", "Nível, selos e participação. O XP é a única pontuação, e a ausência não pune."),
           ("Computador", "Editor e moderação", "Montar minicursos e moderar a comunidade, em sessões mais longas.")],
          lead="Uma trilha de aprendizagem e uma comunidade <strong>no mesmo lugar</strong>, "
               "para quem já teve contato com IA e sente falta de um caminho."),

    figura("Estrutura", "do hub", "rel/fig17.jpg",
           legenda="Estrutura revisada do hub, com o valor do DNA e a referência de cada área. Fonte: elaborado pelo autor (2026).",
           texto="Cada área aparece com o <strong>valor do DNA</strong> que entrega e a referência de mercado que a inspirou.",
           altura=700),

    tabela("Relação", "com o DNA", ["Pilar", "Vertentes", "Onde aparece no hub"],
           [["HOLÍSTICA", "sistêmica e prática", "Trilha e Praticar, com teoria aplicada na hora"],
            ["ACESSIBILIDADE", "personalizada e progressiva", "Nivelamento e avanço em etapas"],
            ["CONEXÃO", "coletividade e profissional", "Comunidade, minicursos e teste de proficiência"],
            ["INOVAÇÃO", "gamificado", "XP, selos e cuidado estético"],
            ["INOVAÇÃO", "ousado", "Na comunicação e no tom da campanha (capítulo 11)"]],
           lead="Todas as áreas convergem para a <strong>POTENCIALIZAÇÃO</strong>: o designer amplia o que já sabe, "
                "em vez de começar do zero."),

    colunas("Entrega e", "mudanças",
            [{"kicker": "Escopo de entrega", "itens": [
                "<strong>Protótipo de alta fidelidade</strong>, navegável e em código, para celular e computador.",
                "Identidade visual (capítulo 8).",
                "Modelo de negócio (capítulo 10) e campanha de lançamento (capítulo 11)."]},
             {"kicker": "Desde a primeira proposta", "itens": [
                "Saíram o <strong>pet</strong> e as moedas: deixavam o produto com cara infantil.",
                "O progresso foi para o perfil; o vínculo, para a comunidade.",
                "A regra de nunca punir a ausência ficou.",
                "O aplicativo virou um hub com nome: <strong>BASE8</strong>."]}]),
]
