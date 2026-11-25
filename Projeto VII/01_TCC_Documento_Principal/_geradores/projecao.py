"""Premissas e contas da projeção financeira do BASE8 (ano 1 após o lançamento).

Fonte única dos números: o capítulo de viabilidade do relatório e a planilha
entregas/projecao-financeira-base8.xlsx saem daqui.
Os valores marcados como DECISÃO são provisórios e dependem do Bruno.
"""
CAMBIO = 5.51                 # R$/US$, dólar comercial de 09/11/2026
PRECO_CURSO = 297.00          # DECISÃO: curso completo, compra única
PRECO_CURSO_CRIADOR = 97.00   # DECISÃO: preço médio de um curso de criador
COMISSAO = 0.20               # DECISÃO: parte da plataforma nos cursos de criadores
TAXA_PAGAMENTO = 0.0498       # cartão de crédito com recebimento na hora (Mercado Pago)
IMPOSTO = 0.06                # Simples Nacional, Anexo III, 1ª faixa
INFRA_USD_MES = 20 + 25       # Vercel Pro + Supabase Pro
DOMINIO_ANO = 40.00
TOKENS_IN, TOKENS_OUT = 1500, 400          # por atividade avaliada
IA_USD_IN, IA_USD_OUT = 2.00, 10.00        # Claude Sonnet 5.5, por milhão de tokens
ATIV_COMPRADOR = 48           # atividades avaliadas por comprador no ano
ATIV_CADASTRO = 5             # atividades avaliadas nas aulas gratuitas, por cadastro
PRO_LABORE_MES = 3777.92      # salário médio do designer gráfico (seção 3.2.2)

CENARIOS = {  # nome: (cadastros no ano, conversão em compra, vendas de cursos de criadores, verba da campanha)
    "Pessimista": (500, 0.02, 0, 750.00),
    "Base": (1500, 0.04, 60, 1980.00),
    "Otimista": (4000, 0.06, 300, 3660.00),
}

def custo_ia_atividade():
    return (TOKENS_IN * IA_USD_IN + TOKENS_OUT * IA_USD_OUT) / 1e6 * CAMBIO

def calcular(nome):
    cad, conv, vend_cri, campanha = CENARIOS[nome]
    vendas = cad * conv
    rec_curso = vendas * PRECO_CURSO
    rec_com = vend_cri * PRECO_CURSO_CRIADOR * COMISSAO
    bruta = rec_curso + rec_com
    taxas = bruta * TAXA_PAGAMENTO
    imposto = bruta * IMPOSTO
    liquida = bruta - taxas - imposto
    infra = INFRA_USD_MES * CAMBIO * 12
    ia = (vendas * ATIV_COMPRADOR + cad * ATIV_CADASTRO) * custo_ia_atividade()
    custos = infra + DOMINIO_ANO + ia + campanha
    resultado = liquida - custos
    return dict(cadastros=cad, conversao=conv, vendas=vendas, rec_curso=rec_curso, vend_cri=vend_cri, rec_com=rec_com,
                bruta=bruta, taxas=taxas, imposto=imposto, liquida=liquida, infra=infra, dominio=DOMINIO_ANO, ia=ia,
                campanha=campanha, custos=custos, resultado=resultado, resultado_pl=resultado - PRO_LABORE_MES * 12)

def margem_por_venda():
    return PRECO_CURSO * (1 - TAXA_PAGAMENTO - IMPOSTO) - ATIV_COMPRADOR * custo_ia_atividade()

def equilibrio(nome="Base", com_pro_labore=False):
    c = calcular(nome)
    fixos = c["infra"] + c["dominio"] + c["campanha"] + c["cadastros"] * ATIV_CADASTRO * custo_ia_atividade()
    if com_pro_labore: fixos += PRO_LABORE_MES * 12
    return fixos / margem_por_venda()

def brl(v, casas=0):
    s = f"{abs(v):,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("−" if v < 0 else "") + "R$ " + s

if __name__ == "__main__":
    print("IA por atividade:", round(custo_ia_atividade(), 4), "| margem por venda:", round(margem_por_venda(), 2))
    for n in CENARIOS:
        c = calcular(n); print(n, {k: round(v, 2) for k, v in c.items()})
    print("equilíbrio (vendas/ano):", round(equilibrio(), 1), "| com pró-labore:", round(equilibrio(com_pro_labore=True), 1))
