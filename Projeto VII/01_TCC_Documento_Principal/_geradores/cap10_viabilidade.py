"""Capítulo 10 — Viabilidade e modelo de negócio. Os números vêm de projecao.py."""
import projecao as pj


def build(d):
    P, H, B = d.para, d.h, d.bullet
    c = {n: pj.calcular(n) for n in pj.CENARIOS}
    brl = pj.brl
    infra_mes = pj.INFRA_USD_MES * pj.CAMBIO
    ia = pj.custo_ia_atividade()
    eq = pj.equilibrio()
    eq_pl = pj.equilibrio(com_pro_labore=True)
    preco = brl(pj.PRECO_CURSO)
    com = "%d%%" % round(pj.COMISSAO * 100)

    def linha(rotulo, chave, fmt=brl):
        return [rotulo] + [fmt(c[n][chave]) for n in pj.CENARIOS]

    inteiro = lambda v: f"{v:,.0f}".replace(",", ".")
    pct = lambda v: "%d%%" % round(v * 100)
    projecao_rows = [
        linha("Cadastros no ano", "cadastros", inteiro),
        linha("Conversão em compra", "conversao", pct),
        linha("Vendas do curso completo", "vendas", inteiro),
        linha("Receita do curso", "rec_curso"),
        linha("Vendas de cursos de criadores", "vend_cri", inteiro),
        linha("Receita de comissão", "rec_com"),
        ["Taxas de pagamento e impostos"] + [brl(c[n]["taxas"] + c[n]["imposto"]) for n in pj.CENARIOS],
        ["Infraestrutura e domínio"] + [brl(c[n]["infra"] + c[n]["dominio"]) for n in pj.CENARIOS],
        linha("Avaliação por IA", "ia"),
        linha("Campanha de lançamento", "campanha"),
        linha("**Resultado do ano**", "resultado"),
        linha("Resultado com a minha remuneração", "resultado_pl"),
    ]
    return [
        H(1, "10 VIABILIDADE E MODELO DE NEGÓCIO"),
        P("Este capítulo avalia se o BASE8 se sustenta como negócio. Ele compara o hub com as alternativas que o designer já tem, dimensiona o mercado, propõe um modelo de receita, estima os custos de operação e projeta o primeiro ano em três cenários. Os preços usados aqui são valores de trabalho. A decisão final depende da pesquisa com designers (seção 13.2)."),
        H(2, "10.1 Alternativas e referências de preço"),
        P("O designer que quer aprender IA de código tem hoje três tipos de alternativa: as plataformas de programação por assinatura, os cursos avulsos em marketplaces e o conteúdo gratuito espalhado em vídeos e documentação. O Quadro 9 reúne as principais referências, com os preços consultados em novembro de 2026."),
        *d.table("Quadro 9 — Alternativas de aprendizagem e referências de preço",
                 ["Referência", "Modelo", "Preço", "Limite para o designer"],
                 [["Rocketseat ONE", "Assinatura anual de formações em programação", "R$ 659,10 à vista ou 6 × R$ 128,16, em promoção (Rocketseat, 2026)", "Feita para quem quer se tornar desenvolvedor"],
                  ["Origamid", "Assinatura de cursos de front-end e UI", "R$ 468 por ano, ou a partir de R$ 39 por mês (Origamid, 2026)", "Ensina a programar, e não a dirigir a IA"],
                  ["Alura", "Assinatura de 1 ou 2 anos, com trilhas de várias áreas", "Exibido só no fechamento da compra (Alura, 2026)", "Catálogo amplo, sem recorte para o designer"],
                  ["Udemy", "Curso avulso, pago uma vez", "Varia por curso e por promoção; o instrutor fica com 37% das vendas que a plataforma origina (Udemy, 2026)", "Cursos organizados pelas funções da ferramenta, com exemplos de programação"],
                  ["Hotmart", "Venda de cursos de criadores", "9,9% mais R$ 2,49 por venda, sem mensalidade (Hotmart, 2026)", "Só processa a venda; não traz público nem comunidade"],
                  ["Conteúdo gratuito", "Vídeos, documentação e fóruns", "Sem custo", "Disperso, sem ordem e sem correção"]],
                 [1500, 2300, 2771, 2500]),
        P("O quadro mostra dois pontos. O primeiro é a faixa de preço: um ano de acesso a uma plataforma de programação custa entre R$ 468 e R$ 659. O segundo é a lacuna: nenhuma das alternativas parte do repertório do designer nem junta, no mesmo lugar, trilha, prática corrigida e comunidade."),
        H(2, "10.2 Tamanho do mercado"),
        P("Não há uma contagem oficial e atual de designers no Brasil. Os dados disponíveis dão a ordem de grandeza. Segundo dados do Ministério do Desenvolvimento, Indústria e Comércio Exterior citados por Rocha (2016), a cadeia do design tinha, em 2011, cerca de 103 mil profissionais no núcleo criativo, contando apenas o mercado formal. Em 2023, a indústria criativa como um todo somava 1,26 milhão de vínculos formais, e a área de Consumo, que inclui o design, crescia 6,4% ao ano (Firjan, 2025). Esses números não contam freelancers, autônomos nem estudantes, que são parte importante do público do projeto (seção 3.2.2)."),
        P("Por isso, a projeção não parte do tamanho total do mercado. Ela parte do que a campanha de lançamento consegue alcançar, com a meta de 500 cadastros (seção 11.10). Mesmo no cenário otimista, o hub precisaria de 4 mil cadastros no primeiro ano, o que corresponde a menos de 4% do núcleo formal medido em 2011. Ou seja, o mercado não é o limite do projeto. O limite é a capacidade de alcançar e converter esse público."),
        H(2, "10.3 Modelo de receita"),
        P("O modelo proposto tem duas fontes de receita e mantém gratuita a maior parte do hub."),
        B("**Gratuito.** A comunidade, o perfil, as primeiras aulas da trilha e os cursos gratuitos de criadores. A porta de entrada fica aberta, e a comunidade cresce sem barreira."),
        B("**Curso completo, pago uma vez.** A trilha inteira, as atividades avaliadas e o teste de proficiência. O valor de trabalho é de %s." % preco),
        B("**Comissão sobre cursos de criadores.** O membro escolhe se o seu curso é gratuito ou pago. Nos pagos, a plataforma fica com %s." % com),
        P("A compra única é coerente com uma decisão anterior. A assinatura recorrente foi tratada como anti-referência no benchmarking (capítulo 6), porque ela obriga a publicar conteúdo novo todo mês, e o projeto entrega capacidade, e não conteúdo periódico."),
        P("O valor de %s fica abaixo de um ano das assinaturas do Quadro 9. A comissão de %s fica entre dois extremos do mercado. A Hotmart cobra 9,9%% mais R$ 2,49 por venda, mas não traz público (Hotmart, 2026). A Udemy fica com 63%% das vendas que ela mesma origina (Udemy, 2026). O BASE8 oferece ao criador um público já interessado no tema, o que justifica ficar acima da primeira e bem abaixo da segunda." % (preco, com)),
        P("O Quadro 10 resume o modelo no formato do Lean Canvas."),
        *d.table("Quadro 10 — Modelo de negócio do BASE8 no formato do Lean Canvas",
                 ["Bloco", "Conteúdo"],
                 [["Problema", "Falta um caminho de IA de código que fale a língua do designer. O código gerado exige revisão, e o designer não sabe o que revisar. Há medo de perder prática."],
                  ["Público", "Designers gráficos, digitais, de UX/UI e de produto que já tiveram algum contato com IA. Na comunicação, a campanha abre para criativos de áreas vizinhas."],
                  ["Proposta de valor", "Entregar ao designer a parte técnica que falta e manter com ele a decisão de projeto e a validação do resultado."],
                  ["Solução", "Trilha curta com prática na hora, nivelamento por desempenho, comunidade por tags ligada às lições e teste de proficiência."],
                  ["Diferencial", "Feito por designer, para designer. Interface cuidada para um público exigente. A comunidade atualiza o conteúdo no ritmo das ferramentas."],
                  ["Canais", "Campanha “Até onde?”, pôsteres e oficina na PUCPR e indicação dentro da comunidade."],
                  ["Receita", "Curso completo com pagamento único (%s) e comissão de %s sobre os cursos pagos de criadores." % (preco, com)],
                  ["Custos", "Infraestrutura (cerca de %s por mês), avaliação por IA, taxas de pagamento, impostos e campanha de lançamento." % brl(infra_mes)],
                  ["Métricas", "Cadastros, conversão em compra, lições concluídas por semana e respostas úteis na comunidade."]],
                 [2200, 6871]),
        H(2, "10.4 Custos de operação"),
        P("Como a produção de design, de código e de conteúdo é minha, os custos de operação se limitam à infraestrutura, à IA que avalia as atividades, às taxas e aos impostos (Quadro 11)."),
        *d.table("Quadro 11 — Custos de operação estimados",
                 ["Item", "Valor", "Base"],
                 [["Hospedagem", "US$ 20 por mês", "Plano Pro (Vercel, 2026)"],
                  ["Banco de dados e autenticação", "US$ 25 por mês", "Plano Pro (Supabase, 2026)"],
                  ["Domínio .com.br", "R$ 40 por ano", "Seção 11.9"],
                  ["Avaliação por IA", "Cerca de %s por atividade" % brl(ia, 2), "1.500 tokens de entrada e 400 de saída no modelo Claude Sonnet 5.5 (Anthropic, 2026)"],
                  ["Taxa de pagamento", "4,98% por venda", "Cartão de crédito com recebimento na hora (Mercado Pago, 2026)"],
                  ["Impostos", "6% da receita", "Primeira faixa do Anexo III do Simples Nacional (Brasil, 2006), a confirmar com contador"],
                  ["Câmbio", "R$ 5,51 por dólar", "Cotação de 9 nov. 2026 (Brasil 61, 2026)"]],
                 [2700, 2400, 3971]),
        P("A infraestrutura soma cerca de %s por mês. Na fase de testes, os planos gratuitos dos dois serviços bastam, mas o plano gratuito de hospedagem não permite uso comercial (Vercel, 2026). O custo da IA é baixo porque cada avaliação é curta. Supondo %d atividades avaliadas por comprador, cada um custa menos de R$ 2 no ano." % (brl(infra_mes), pj.ATIV_COMPRADOR)),
        H(2, "10.5 Projeção do primeiro ano"),
        P("A projeção cobre o primeiro ano depois do lançamento, em três cenários (Quadro 12). O cenário pessimista considera apenas os 500 cadastros da meta da campanha. O base e o otimista supõem que o hub continua crescendo depois dela. As taxas de conversão de 2%, 4% e 6% são premissas, e não dados medidos."),
        *d.table("Quadro 12 — Projeção do primeiro ano em três cenários",
                 ["Linha", "Pessimista", "Base", "Otimista"], projecao_rows, [3371, 1900, 1900, 1900]),
        P("Três leituras saem do quadro. A primeira é que o custo fixo é baixo: no cenário base, cerca de %d vendas no ano pagam a infraestrutura e a campanha. A segunda é que o cenário pessimista fecha com um prejuízo pequeno, de cerca de %s, que é o risco financeiro real do lançamento. A terceira é a mais importante: a conta só fecha assim porque o meu trabalho não está nela. Se eu incluir uma remuneração igual ao salário médio do designer gráfico (%s por mês, seção 3.2.2), o ponto de equilíbrio sobe para cerca de %d vendas por ano, ou %d por mês. Só o cenário otimista chega lá." % (
            round(eq), brl(round(-c["Pessimista"]["resultado"], -2)), brl(pj.PRO_LABORE_MES, 2), round(eq_pl), round(eq_pl / 12))),
        P("Ou seja, o BASE8 é viável como projeto paralelo desde o primeiro ano e só vira fonte principal de renda com escala. Os caminhos para essa escala são os que o modelo já prevê: mais criadores publicando cursos pagos e, no futuro, licenças para equipes, agências e instituições de ensino. A planilha da projeção acompanha este relatório, com as premissas editáveis."),
        H(2, "10.6 Viabilidade legal"),
        B("**Marca.** A busca inicial não encontrou produto com o nome BASE8 na mesma área. A consulta formal e o pedido de registro no INPI estão pendentes (seção 8.12)."),
        B("**Domínio.** O endereço base8.com.br já pertence a terceiros. A alternativa de endereço ainda será definida."),
        B("**Dados pessoais.** O hub trata dados de conta, de progresso e de publicações, sujeitos à Lei Geral de Proteção de Dados Pessoais (Brasil, 2018). O protótipo já prevê o consentimento por finalidade e a opção de baixar ou excluir os dados (seção 9.3.1)."),
        B("**Conteúdo de terceiros.** Os cursos e os posts de membros pedem termos de uso e regras de moderação. A tela de moderação do protótipo já prevê motivos como pirataria, plágio e desinformação."),
        B("**Formalização.** A venda do curso exige CNPJ e emissão de nota. O enquadramento tributário deve ser confirmado com um contador."),
        H(2, "10.7 Síntese"),
        P("O modelo se apoia em três escolhas: acesso gratuito à comunidade, compra única do curso e comissão sobre os cursos de criadores. Os custos de operação são baixos, e o risco financeiro do lançamento é pequeno. Ficam em aberto os preços definitivos, que dependem da pesquisa com designers, e as taxas de conversão, que só o lançamento pode medir."),
    ]


REFERENCIAS = [
    "ALURA. Planos. Disponível em: https://www.alura.com.br/planos-cursos-online. Acesso em: 12 nov. 2026.",
    "ANTHROPIC. Pricing. Disponível em: https://platform.claude.com/docs/en/about-claude/pricing. Acesso em: 12 nov. 2026.",
    "BRASIL. Lei Complementar nº 123, de 14 de dezembro de 2006. Institui o Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte. Brasília, DF: Presidência da República, 2006.",
    "BRASIL 61. Dólar hoje fecha em leve alta, a R$ 5,51, após oscilar entre queda e valorização. 9 nov. 2026. Disponível em: https://brasil61.com/n/dolar-hoje-fecha-em-leve-alta-a-r-5-51-apos-oscilar-entre-queda-e-valorizacao-bras2617447. Acesso em: 12 nov. 2026.",
    "FIRJAN. Mapeamento da Indústria Criativa 2025. Rio de Janeiro: Firjan, 2025. Disponível em: https://www.firjan.com.br/noticias/mapeamento-da-industria-criativa-2025-8AE4828D96AAF437019783E8CFE02F31-00.htm. Acesso em: 12 nov. 2026.",
    "HOTMART. Página inicial: tarifas. Disponível em: https://hotmart.com/pt-BR. Acesso em: 12 nov. 2026.",
    "MERCADO PAGO. Link de pagamento: taxas. Disponível em: https://www.mercadopago.com.br/ferramentas-para-vender/link-de-pagamento. Acesso em: 12 nov. 2026.",
    "ORIGAMID. Planos. Disponível em: https://www.origamid.com/planos/. Acesso em: 12 nov. 2026.",
    "ROCHA, C. (org.). Design em Goiás. Goiânia: Media Lab/UFG, 2016. (Coleção Dimensões Econômicas da Cultura). Disponível em: https://goias.gov.br/industriaecomercio/wp-content/uploads/sites/32/2018/09/Design-d3d.pdf. Acesso em: 12 nov. 2026.",
    "ROCKETSEAT. Rocketseat ONE. Disponível em: https://www.rocketseat.com.br/one. Acesso em: 12 nov. 2026.",
    "SUPABASE. Pricing. Disponível em: https://supabase.com/pricing. Acesso em: 12 nov. 2026.",
    "UDEMY. Instructor revenue share. Disponível em: https://support.udemy.com/hc/en-us/articles/229605008-Instructor-revenue-share. Acesso em: 12 nov. 2026.",
    "VERCEL. Pricing. Disponível em: https://vercel.com/pricing. Acesso em: 12 nov. 2026.",
]
