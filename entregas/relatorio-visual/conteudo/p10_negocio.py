"""Capítulo 10 — Viabilidade e modelo de negócio."""
from blocos import bruto, colunas, divisor, numeros, tabela

# Lean Canvas resumido (Quadro 10): (título, texto, posição na grade)
LC = [
    ("Problema", "Falta um caminho de IA de código na língua do designer. Ele não sabe o que revisar no código gerado e teme perder prática.", "grid-column:1;grid-row:1/3"),
    ("Solução", "Trilha curta com prática na hora, nivelamento por desempenho, comunidade por tags e teste de proficiência.", "grid-column:2;grid-row:1"),
    ("Métricas", "Cadastros, conversão em compra, lições concluídas por semana e respostas úteis.", "grid-column:2;grid-row:2"),
    ("Proposta de valor", "Entregar ao designer a parte técnica que falta e manter com ele a decisão de projeto e a validação do resultado.", "grid-column:3;grid-row:1/3"),
    ("Diferencial", "Feito por designer, para designer. A comunidade atualiza o conteúdo no ritmo das ferramentas.", "grid-column:4;grid-row:1"),
    ("Canais", "Campanha “Até onde?”, pôsteres e oficina na PUCPR e indicação na comunidade.", "grid-column:4;grid-row:2"),
    ("Público", "Designers gráficos, digitais, de UX/UI e de produto que já tiveram algum contato com IA.", "grid-column:5;grid-row:1/3"),
    ("Custos", "Infraestrutura (cerca de R$ 248 por mês), avaliação por IA, taxas de pagamento, impostos e campanha.", "grid-column:1/3;grid-row:3"),
    ("Receita", "Curso completo com pagamento único (R$ 297) e comissão de 20% sobre os cursos pagos de criadores.", "grid-column:3/6;grid-row:3"),
]
_lc = "".join(f'<div style="{pos}"><h4>{t}</h4><p>{p}</p></div>' for t, p, pos in LC)

PAGINAS = [
    divisor("10", "Viabilidade e", "modelo de negócio",
            "Alternativas, mercado, receita, custos e uma projeção do primeiro ano em três cenários.",
            "rosa"),

    tabela("Alternativas", "e preços", ["Referência", "Modelo", "Preço", "Limite para o designer"], [
        ["Rocketseat ONE", "Assinatura anual de programação", "R$ 659,10 à vista ou 6 × R$ 128,16, em promoção", "Feita para quem quer ser desenvolvedor"],
        ["Origamid", "Assinatura de front-end e UI", "R$ 468 por ano, ou a partir de R$ 39 por mês", "Ensina a programar, não a dirigir a IA"],
        ["Alura", "Assinatura de 1 ou 2 anos", "Exibido só no fechamento da compra", "Sem recorte para o designer"],
        ["Udemy", "Curso avulso", "Varia; o instrutor fica com 37% das vendas da plataforma", "Organizada pelas funções da ferramenta"],
        ["Hotmart", "Venda de cursos de criadores", "9,9% mais R$ 2,49 por venda", "Não traz público nem comunidade"],
        ["Conteúdo gratuito", "Vídeos, documentação e fóruns", "Sem custo", "Disperso, sem ordem e sem correção"],
    ], lead="Um ano de plataforma de programação custa entre R$ 468 e R$ 659. <strong>Nenhuma alternativa parte do repertório do designer</strong> nem junta trilha, prática corrigida e comunidade.",
        nota="Preços consultados em novembro de 2026.", tam=20),

    numeros("Mercado", "e receita", [
        ("Grátis", "Comunidade, perfil, primeiras aulas da trilha e cursos gratuitos de criadores.", "Porta de entrada aberta"),
        ("R$ 297", "Curso completo, pago uma vez: trilha inteira, atividades avaliadas e teste de proficiência.", "Abaixo de um ano das assinaturas"),
        ("20%", "Comissão sobre os cursos pagos de criadores: acima da Hotmart, que não traz público, e bem abaixo da Udemy.", "Valor de trabalho"),
    ], lead="O design tinha cerca de <strong>103 mil profissionais</strong> no núcleo criativo formal em 2011. Mesmo no cenário otimista, 4 mil cadastros seriam menos de 4% disso: <strong>o limite é alcançar e converter.</strong>",
        nota="Sem assinatura: ela obriga a publicar conteúdo novo todo mês, e o projeto entrega capacidade."),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t"><span>Lean</span><b>Canvas</b></h1>
  <div class="lc" style="height:640px;grid-template-rows:1fr 1fr 170px">{_lc}</div>
  {{RODAPE}}
</section>'''),

    tabela("Projeção do", "primeiro ano", ["Linha", "Pessimista", "Base", "Otimista"], [
        ["Cadastros no ano", "500", "1.500", "4.000"],
        ["Conversão em compra", "2%", "4%", "6%"],
        ["Vendas do curso completo", "10", "60", "240"],
        ["Receita do curso", "R$ 2.970", "R$ 17.820", "R$ 71.280"],
        ["Receita de comissão", "R$ 0", "R$ 1.164", "R$ 5.820"],
        ["Resultado do ano", "−R$ 1.236", "R$ 11.504", "R$ 60.743"],
    ], num=True, tam=22,
        lead="Custos baixos: infraestrutura de cerca de R$ 248 por mês, avaliação por IA de cerca de R$ 0,04 por atividade, taxa de 4,98% e impostos de 6%. As conversões são premissas.",
        nota="<strong>A partir do cenário base, o primeiro ano já fecha no positivo</strong>, com custos de operação baixos e sem investimento inicial alto."),

    colunas("Viabilidade legal", "e síntese", [
        {"kicker": "Legal", "itens": [
            "<strong>Marca:</strong> busca inicial sem conflito.",
            "<strong>Domínio:</strong> base8.com.br já pertence a terceiros.",
            "<strong>Dados:</strong> LGPD, com consentimento por finalidade já no protótipo.",
            "<strong>Terceiros:</strong> termos de uso e regras de moderação.",
            "<strong>Formalização:</strong> CNPJ, nota e enquadramento com contador."]},
        {"kicker": "Síntese", "itens": [
            "Três escolhas: comunidade gratuita, compra única do curso e comissão sobre cursos de criadores.",
            "Custos de operação baixos e <strong>risco financeiro pequeno</strong> no lançamento."]},
    ]),
]
