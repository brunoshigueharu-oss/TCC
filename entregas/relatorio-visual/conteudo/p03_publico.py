"""Capítulo 3: Levantamento de público-alvo."""
from blocos import divisor, numeros, cards, colunas

PAGINAS = [
    divisor("03", "Público-alvo:", "o designer generalista", "Quem é o designer que quer ir além da própria formação, e o que ele busca da IA.", "rosa"),
    numeros("O designer", "e a IA", [
        ("91%", "dos designers usam IA toda semana em tarefas de design, contra 54% em 2025.", "Designer Fund, 2026"),
        ("71%", "dos criadores já usam IA para visuais, marca ou posts.", "Adobe News, 2026"),
        ("65%", "dos designers dizem assumir mais responsabilidades de produto e engenharia.", "Designer Fund, 2026"),
    ], lead="O designer já usa IA no dia a dia, principalmente para imagem e texto. <strong>O passo seguinte é usá-la para construir.</strong>"),
    cards("Áreas", "em alta", [
        ("", "UX/UI", "Segue como a especialização mais procurada, puxada pelo comércio digital."),
        ("", "Motion design", "Já aparece como exigência em 45% das vagas seniores, em levantamentos internacionais."),
        ("", "Product design", "Cargos híbridos de interface, pesquisa e produto ganham relevância e salários mais altos."),
        ("", "Nichos", "O especialista em um nicho enfrenta menos concorrência e cobra mais que o generalista."),
        ("", "Lacuna de negócio", "Estudantes de design se sentem mais capazes de criar produtos; os de negócios, de vender (Christensen et al., 2023)."),
    ], lead="<strong>O público já usa IA</strong> e não precisa ser convencido a adotá-la."),
    numeros("O que", "eles buscam", [
        ("73%", "sentem crescer a expectativa sobre o que entregam com IA; só 28% das empresas atualizaram critérios.", "Designer Fund, 2026"),
        ("76%", "das pequenas empresas usam IA, mas só 14% a incorporaram às operações principais.", "Goldman Sachs, 2026"),
        ("73%", "dos donos de pequenos negócios se beneficiariam de mais treinamento e recursos.", "Goldman Sachs, 2026"),
    ], lead="Designers e empresas têm interesse. <strong>O que falta é um caminho guiado</strong> para transformar esse interesse em uso real."),
    colunas("Recorte", "final", [
        {"kicker": "Antes (agosto de 2026)", "itens": [
            "Designer-empreendedor.",
            "Limite nas áreas de negócio: mercado, preço, produção.",
        ]},
        {"kicker": "Depois (setembro a novembro)", "itens": [
            "Do início de carreira a gestores e fundadores.",
            "Critério de posicionamento: a relação com o limite da própria formação.",
            "Limite técnico: construir em código o que antes dependia de outra pessoa.",
            "Comunicação simples e didática, com curva de aprendizado guiada.",
        ]},
    ], lead="<strong>O que define o público é a posição do designer diante do limite do próprio domínio.</strong>",
       nota="O público mais inclinado à proposta já teve algum contato com IA. Quem nunca usou também é atendido pelo nivelamento (seção 7.2.1)."),
]
