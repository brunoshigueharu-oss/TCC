"""Insere o capítulo 8 (identidade visual) no relatório do TCC, como alterações controladas.

Lê a versão base, grava uma cópia nova e não altera o arquivo de origem.
Uso: python3 inserir-capitulo.py
"""
import json
import os
import shutil
import zipfile
from xml.sax.saxutils import escape

AQUI = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.normpath(os.path.join(AQUI, "..", "..", "..", "01_TCC_Documento_Principal"))
BASE = os.path.join(DOCS, "Relatório_TCC_ABNT_revisado_solucao.docx")
SAIDA = os.path.join(DOCS, "Relatório_TCC_ABNT_revisado_identidade.docx")

AUTOR = "Claude"
DATA = "2026-10-07T01:30:00Z"
LARGURA_EMU = 5760000  # 16 cm, a largura da mancha de texto
LARGURA_DXA = 9071

_id = [30000]


def novo_id():
    _id[0] += 1
    return _id[0]


def marca():
    return f'w:id="{novo_id()}" w:author="{AUTOR}" w:date="{DATA}"'


def corrida(texto, negrito=False, tamanho=None):
    rpr = ("<w:b/>" if negrito else "") + (f'<w:sz w:val="{tamanho}"/>' if tamanho else "") + '<w:lang w:val="pt-BR"/>'
    return f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{escape(texto)}</w:t></w:r>'


def paragrafo(conteudo, ppr=""):
    return f"<w:p><w:pPr>{ppr}<w:rPr><w:ins {marca()}/></w:rPr></w:pPr><w:ins {marca()}>{conteudo}</w:ins></w:p>"


def titulo(nivel, texto, quebra=False):
    quebra_xml = '<w:br w:type="page"/>' if quebra else ""
    conteudo = f'<w:r><w:rPr><w:lang w:val="pt-BR"/></w:rPr>{quebra_xml}<w:t xml:space="preserve">{escape(texto)}</w:t></w:r>'
    return paragrafo(conteudo, f'<w:pStyle w:val="Ttulo{nivel}"/>')


def texto(*partes):
    """Parágrafo de corpo. Cada parte é um texto ou uma tupla (texto, 'b') para negrito."""
    corridas = "".join(corrida(p[0], negrito=True) if isinstance(p, tuple) else corrida(p) for p in partes)
    return paragrafo(corridas)


def legenda(s):
    return paragrafo(corrida(s), '<w:pStyle w:val="Legenda"/><w:keepNext/>')


def fonte(s="Fonte: elaborado pelo autor (2026)."):
    return paragrafo(corrida(s, tamanho=20), '<w:spacing w:line="240" w:lineRule="auto" w:after="240"/><w:ind w:firstLine="0"/><w:jc w:val="left"/>')


imagens = []  # (rId, arquivo de origem, nome na pasta media)
FIGURAS = {f["nome"]: f for f in json.load(open(os.path.join(AQUI, "figuras.json"), encoding="utf-8"))}
_fig = [0]


def figura(nome, titulo_fig, fonte_fig="Fonte: elaborado pelo autor, com Claude Code e Codex (2026)."):
    _fig[0] += 1
    numero = _fig[0]
    dados = FIGURAS[nome]
    rid = f"rIdFig{numero}"
    media = f"figura{numero:02d}.png"
    imagens.append((rid, os.path.join(AQUI, "png", nome + ".png"), media))
    cx = LARGURA_EMU
    cy = round(cx * dados["altura"] / dados["largura"])
    desc = escape(titulo_fig, {'"': "&quot;"})
    desenho = (
        '<w:r><w:rPr><w:noProof/></w:rPr><w:drawing>'
        f'<wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>'
        f'<wp:docPr id="{900 + numero}" name="Figura {numero}" descr="{desc}"/>'
        '<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
        '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        f'<pic:nvPicPr><pic:cNvPr id="{900 + numero}" name="{media}"/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
        "</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>"
    )
    quadro_img = paragrafo(desenho, '<w:keepNext/><w:spacing w:line="240" w:lineRule="auto"/><w:ind w:firstLine="0"/><w:jc w:val="center"/>')
    return legenda(f"Figura {numero} — {titulo_fig}") + quadro_img + fonte(fonte_fig)


def quadro(titulo_quadro, larguras, linhas):
    assert sum(larguras) == LARGURA_DXA, sum(larguras)
    grade = "".join(f'<w:gridCol w:w="{w}"/>' for w in larguras)
    corpo = []
    for i, linha in enumerate(linhas):
        celulas = []
        for j, (w, valor) in enumerate(zip(larguras, linha)):
            negrito = i == 0 or j == 0
            p = (
                f'<w:p><w:pPr><w:spacing w:line="240" w:lineRule="auto" w:after="40"/><w:ind w:firstLine="0"/><w:jc w:val="left"/>'
                f"<w:rPr><w:ins {marca()}/></w:rPr></w:pPr><w:ins {marca()}>{corrida(valor, negrito=negrito, tamanho=18)}</w:ins></w:p>"
            )
            celulas.append(f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{w}"/></w:tcPr>{p}</w:tc>')
        cabecalho = "<w:tblHeader/>" if i == 0 else ""
        corpo.append(f"<w:tr><w:trPr>{cabecalho}<w:ins {marca()}/></w:trPr>{''.join(celulas)}</w:tr>")
    tabela = (
        '<w:tbl><w:tblPr><w:tblStyle w:val="Tabelacomgrade"/><w:tblW w:type="auto" w:w="0"/><w:jc w:val="center"/><w:tblLayout w:type="fixed"/>'
        '<w:tblLook w:firstColumn="1" w:firstRow="1" w:lastColumn="0" w:lastRow="0" w:noHBand="0" w:noVBand="1" w:val="04A0"/></w:tblPr>'
        f"<w:tblGrid>{grade}</w:tblGrid>{''.join(corpo)}</w:tbl>"
    )
    return legenda(titulo_quadro) + tabela + fonte()


# ---------------------------------------------------------------- conteúdo

CAPITULO = "".join(
    [
        titulo(1, "8 IDENTIDADE VISUAL: CONSTRUÇÃO DA LOGO E DO MASCOTE", quebra=True),
        texto(
            "Este capítulo registra a primeira etapa da identidade visual, uma das decisões em aberto da seção 7.5. "
            "Nele, descrevo como a logo e o mascote que desenhei foram reconstruídos com rigor geométrico, com o apoio de duas ferramentas de IA agêntica. "
            "Cores, tipografia e nome ficam para a etapa seguinte. Por isso, todas as peças usam uma paleta provisória de roxo, preto e branco."
        ),
        texto(
            "O processo também serve de exemplo do que o projeto defende. "
            "Eu dirigi o trabalho como designer, e as ferramentas executaram a parte de geometria e de código."
        ),
        titulo(2, "8.1 Ponto de partida"),
        texto(
            "Desenhei no Illustrator a primeira versão das duas peças. O mascote é um polvo de óculos redondos. "
            "A logo é um símbolo preto do mesmo polvo, com seis tentáculos: dois laterais, sob os óculos, e quatro em leque. "
            "Além dos vetores, eu tinha rascunhos a lápis com vistas, poses e expressões (Figura 1)."
        ),
        texto(
            "Os dois vetores foram traçados a olho. Por isso, tinham centros desalinhados, raios quase iguais que deveriam ser iguais e curvas livres onde caberia um arco. "
            "O objetivo desta etapa foi corrigir esses pontos sem perder o desenho."
        ),
        figura("fig-01-ponto-de-partida", "Ponto de partida: logo, mascote e rascunhos", "Fonte: elaborado pelo autor (2026)."),
        titulo(2, "8.2 Método: um briefing, duas ferramentas"),
        texto(
            "Escrevi um único briefing e o entreguei a duas ferramentas: o Claude Code, da Anthropic, e o Codex, da OpenAI. "
            "As duas receberam os mesmos arquivos de origem e trabalharam sem ver o resultado uma da outra. Assim, pude comparar as respostas. "
            "O Claude Code usou o modelo Claude Opus 5.5, e o Codex, na versão 0.160.1, usou o modelo gpt-6-astra."
        ),
        texto(
            "O briefing pedia três coisas. A primeira era reconstruir a logo e o mascote sobre um sistema explícito, com módulo, círculos, arcos, tangências e eixos de simetria. "
            "A segunda era mostrar as linhas de construção de cada peça. A terceira era propor versões alternativas, cada uma com um motivo de design."
        ),
        texto(
            "As duas ferramentas desenham escrevendo o arquivo SVG em código. Ou seja, cada forma nasce de uma medida, e não de um traço à mão. "
            "Os resultados foram conferidos pela renderização dos arquivos SVG. A abertura dos arquivos no Illustrator ainda não foi testada."
        ),
        titulo(2, "8.3 Primeira rodada: reconstrução e comparação"),
        titulo(3, "8.3.1 Logo"),
        texto(
            "A Figura 2 mostra a logo original e as duas reconstruções. "
            "O Claude adotou uma cabeça de raio 10, olhos sobre as diagonais de 45°, tentáculos laterais em círculos que passam pelo centro da cabeça e um leque com barras a 18° e 54°. "
            "O Codex adotou uma cabeça de raio 18, lentes em elipses de 9 por 7 inclinadas a 45°, tentáculos laterais em arcos de raio 16 e um leque com pontas a 25°, 45°, 65° e 83°. "
            "A Figura 3 traz as linhas de construção de cada uma."
        ),
        figura("fig-02-logo-rodada-1", "Logo: original e reconstruções da primeira rodada"),
        figura("fig-03-logo-construcao-rodada-1", "Linhas de construção da logo na primeira rodada"),
        titulo(3, "8.3.2 Mascote"),
        texto(
            "No mascote original, os brancos dos olhos estavam fora do centro das lentes, e a boca estava fora do eixo de simetria. "
            "As duas reconstruções deixaram olhos, lentes e armações concêntricos (Figura 4). "
            "Nos tentáculos, o Claude usou cápsulas afiladas, formadas por dois círculos ligados por tangentes. O Codex usou elipses, que ficaram mais próximas do meu traço. "
            "Nos dois casos, o degradê deu lugar a três roxos chapados. A Figura 5 traz as linhas de construção."
        ),
        figura("fig-04-mascote-rodada-1", "Mascote: original e reconstruções da primeira rodada"),
        figura("fig-05-mascote-construcao-rodada-1", "Linhas de construção do mascote na primeira rodada"),
        titulo(3, "8.3.3 Comparação entre as ferramentas"),
        texto(
            "O Quadro 3 resume a comparação. Em síntese, o Codex foi mais fiel ao meu desenho, e o Claude chegou a um sistema de construção mais claro."
        ),
        quadro(
            "Quadro 3 — Comparação entre as reconstruções do Claude e do Codex",
            [2271, 3400, 3400],
            [
                ["Critério", "Claude", "Codex"],
                ["Fidelidade ao desenho original", "Menor. Os tentáculos laterais da logo ficaram com corte reto e mais pesados.", "Maior. Manteve as pontas inclinadas dos tentáculos laterais."],
                ["Regras de construção", "Poucas medidas, amarradas entre si: raios 10, 7, 6 e 4,5 no mascote; leque a 18° e 54° na logo.", "Medidas corretas, mas mais soltas: pontas do leque a 25°, 45°, 65° e 83°."],
                ["Tentáculos do mascote", "Cápsulas afiladas, mais rígidas.", "Elipses, mais orgânicas."],
                ["Logo para tamanho pequeno", "Mantém a armação dos óculos; ainda embola em 16 px.", "Elipse branca com traço preto, sem armação; segura melhor em 16 px."],
                ["Alternativas", "Cinco: três de logo e duas de mascote, incluindo cinco expressões.", "Quatro: duas de logo e duas de mascote, incluindo as ventosas do rascunho."],
                ["Prancha", "Mostra o original ao lado de cada peça.", "Testa a logo em negativo sobre roxo e sobre preto."],
            ],
        ),
        titulo(3, "8.3.4 Alternativas"),
        texto(
            "A Figura 6 reúne as alternativas das duas ferramentas. A que mais me chamou a atenção foi a logo com o rosto do mascote, proposta pelo Claude. "
            "Ela nasceu de uma observação: a logo e o mascote tinham rostos diferentes, uma com lentes ovais inclinadas e o outro com óculos redondos. "
            "Mesmo assim, sem o corpo, a figura deixou de parecer um polvo e me lembrou um alien."
        ),
        figura("fig-06-alternativas-rodada-1", "Alternativas propostas na primeira rodada"),
        titulo(2, "8.4 Segunda rodada: do rosto do mascote de volta ao polvo"),
        texto(
            "Pedi então variações que juntassem a minha ideia e a do rosto do mascote. "
            "A análise apontou duas causas para a leitura de alien: os olhos ficavam no meio da cabeça e os braços eram curtos. "
            "Na minha logo, os olhos ficam na base de uma cabeça alta. Por isso, todas as variações subiram a cabeça (Figura 7)."
        ),
        texto(
            "Nessa rodada, percebi também um erro de leitura. A ferramenta tratava as duas formas laterais da logo como asas ou gola. Expliquei que elas são tentáculos. "
            "A partir daí, a variação 7 separou os laterais dos óculos e deu a eles a mesma ponta reta dos quatro de baixo, para que os seis fossem lidos como a mesma coisa."
        ),
        figura("fig-07-variacoes-rodada-2", "Variações da segunda rodada", "Fonte: elaborado pelo autor, com Claude Code (2026)."),
        titulo(2, "8.5 Terceira rodada: uma nova versão da logo"),
        texto(
            "Com base nesses testes, voltei ao Illustrator e ajustei a logo a partir da reconstrução do Codex, que estava mais próxima do meu desenho. Fiz duas mudanças. "
            "Deixei os traços dos olhos na horizontal, porque inclinados eles davam a impressão de que o polvo estava bravo. "
            "Além disso, acrescentei um sorriso, o que aproximou a logo do mascote."
        ),
        texto(
            "Pedi ao Claude que refizesse essa versão sobre o seu sistema de medidas, com alternativas (Figura 8). "
            "O resultado ficou coerente, mas duro. Faltava a leveza do meu desenho."
        ),
        figura("fig-08-rodada-3", "Terceira rodada: reconstrução da nova versão e alternativas", "Fonte: elaborado pelo autor, com Claude Code (2026)."),
        titulo(2, "8.6 Quarta rodada: construção a partir do vetor"),
        texto(
            "Para resolver isso, enviei o vetor da nova versão e mudei o pedido. Em vez de alternativas, pedi foco na construção: "
            "uma versão bem próxima da minha, com os erros corrigidos, e uma versão de como a ferramenta faria."
        ),
        titulo(3, "8.6.1 Medição do vetor"),
        texto(
            "O primeiro passo foi medir o meu arquivo ponto a ponto. A unidade adotada foi o módulo u, igual a 10 px do arquivo, com a cabeça em raio de 18u. "
            "A medição mostrou que o arquivo já estava bem construído. A cabeça, os centros dos olhos, as pupilas, a armação dos óculos e o arco dos tentáculos laterais estavam exatos. "
            "Os desvios encontrados eram poucos e pequenos (Quadro 4)."
        ),
        quadro(
            "Quadro 4 — Desvios medidos no vetor da logo",
            [2871, 6200],
            [
                ["Elemento", "Medida encontrada"],
                ["Aros pretos", "Elipse de 7,78 por 5,56 girada a 45,6°, enquanto as demais estão a 45°. O aro esquerdo é o direito girado, e não espelhado. É a maior assimetria do arquivo: 1,5 px."],
                ["Barras de dentro do leque", "Os dois lados não são paralelos (16,3° e 19,4°). Nas barras de fora, são (53,7° e 53,8°)."],
                ["Larguras do leque", "Barras de dentro com 5,3u e barras de fora com 5,9u."],
                ["Vãos do leque", "14° no meio e 20° nos lados."],
                ["Ponta do tentáculo lateral", "Corte a 12,2°, que não aponta para o centro do olho. O corte radial seria de 9,8°."],
                ["Centro do arco lateral", "Em (±6,33; 5,23), sem relação com outro ponto do desenho."],
                ["Sorriso", "Raio de 2,43u, com o centro 0,02 px fora do eixo."],
            ],
        ),
        titulo(3, "8.6.2 Versão fiel e versão proposta"),
        texto(
            "A versão A, fiel, mantém as minhas medidas e corrige apenas os desvios do Quadro 4. "
            "A versão B, proposta, mantém as mesmas proporções e amarra cada medida a uma regra (Figura 9). O Quadro 5 compara as duas."
        ),
        figura("fig-09-tres-versoes", "Logo: versão do autor, versão A e versão B", "Fonte: elaborado pelo autor, com Claude Code (2026)."),
        quadro(
            "Quadro 5 — Sistema de construção das versões A e B (medidas em módulos)",
            [1871, 2200, 2400, 2600],
            [
                ["Elemento", "Versão do autor", "A · Fiel corrigida", "B · Proposta"],
                ["Cabeça", "Círculo de raio 18.", "Igual.", "Igual."],
                ["Olhos", "Centros em (±10; 8).", "Igual.", "Igual."],
                ["Armação branca", "Elipse de 9 × 7 a 45°.", "Igual.", "Igual."],
                ["Aro preto", "7,78 × 5,56 a 45,6°.", "7,75 × 5,5 a 45°, espelhado.", "7,5 × 5,5. A armação passa a ter 1,5 nos quatro vértices."],
                ["Miolo branco", "4,5 × 3,25.", "Igual.", "5 × 3. O aro passa a ter 2,5 nos quatro vértices."],
                ["Tentáculo lateral", "Arco de raio 16, centro em (±6,33; 5,23).", "Arco de raio 16, centro em (±6,25; 5,25).", "Arco de raio 16, centro sobre a reta cabeça–olho, a 8 do centro da cabeça."],
                ["Ponta do tentáculo lateral", "Corte a 12,2°.", "Corte radial a 10°.", "Corte radial a 9°, metade do passo do leque."],
                ["Leque", "Centro a 18,5 e raio 17. Barras de 5,3 e 5,9.", "Centro a 18,5 e raio 17. Quatro barras de 5,61, a 16,5° e 55,5°.", "Centro a 18 e raio 18. Barras e vãos de 18°, a 18° e 54°."],
                ["Sorriso", "Raio 2,43.", "Raio 2,5, a 15 do centro.", "Igual à versão A."],
            ],
        ),
        texto(
            "A Figura 10 mostra o contorno de cada versão sobre o meu vetor, que tem 534 px de altura. "
            "A versão A fica, em média, a 0,4 px do meu contorno, com máximo de 4,3 px. A versão B fica, em média, a 1,7 px, com máximo de 8,8 px. "
            "As diferenças visíveis da versão B são o miolo dos olhos um pouco mais alongado e o leque 6 px mais comprido. "
            "As Figuras 11 e 12 trazem as linhas de construção das duas versões."
        ),
        figura("fig-10-sobreposicao", "Contorno das versões A e B sobre o vetor do autor", "Fonte: elaborado pelo autor, com Claude Code (2026)."),
        figura("fig-11-construcao-a", "Linhas de construção da versão A", "Fonte: elaborado pelo autor, com Claude Code (2026)."),
        figura("fig-12-construcao-b", "Linhas de construção da versão B", "Fonte: elaborado pelo autor, com Claude Code (2026)."),
        titulo(3, "8.6.3 Por que a versão anterior parecia dura"),
        texto(
            "A comparação entre a terceira rodada e o meu vetor, na mesma escala, explicou a dureza. Tudo na reconstrução anterior era mais grosso e mais fechado. "
            "Considerando a cabeça com raio 10, a armação branca tinha 1,0 contra 0,7 a 0,8 no meu vetor, e as barras do leque tinham 3,5 contra 2,9 a 3,3."
        ),
        texto(
            "O que mais pesava era o tentáculo lateral. A ferramenta o havia centrado no olho, e ele virou uma bola. "
            "No meu desenho, o centro do arco é deslocado para dentro. Por isso, o tentáculo afina até a ponta e é lido como braço."
        ),
        titulo(2, "8.7 Síntese e próximos passos"),
        texto(
            "Três aprendizados ficam desta etapa. O primeiro é que as duas ferramentas se complementaram: uma preservou melhor o desenho, e a outra organizou melhor as regras. "
            "O segundo é que o rigor geométrico não substitui o olhar do designer. A versão mais regrada foi a que achei dura, e só a volta ao meu vetor resolveu o problema. "
            "O terceiro é que a medição ponto a ponto, feita pela ferramenta, mostrou onde estavam os erros e de que tamanho eram."
        ),
        texto(
            "Algumas decisões continuam em aberto. Falta escolher entre as versões A e B da logo e definir a versão reduzida para tamanhos pequenos. "
            "Falta também revisar o mascote com o mesmo cuidado de construção da quarta rodada e conferir os arquivos no Illustrator. "
            "Por fim, cores, tipografia e nome serão definidos na etapa seguinte da identidade visual."
        ),
    ]
)

# ---------------------------------------------------------------- montagem


def main():
    with zipfile.ZipFile(BASE) as z:
        itens = {info.filename: (info, z.read(info.filename)) for info in z.infolist()}

    doc = itens["word/document.xml"][1].decode("utf-8")
    # o título REFERÊNCIAS do corpo do texto (o do sumário vem antes e não tem este marcador)
    alvo = doc.index('<w:bookmarkStart w:id="78" w:name="_Toc239021323"/><w:r><w:t>REFERÊNCIAS</w:t>')
    inicio = doc.rindex("<w:p ", 0, alvo)
    assert 'w:val="Ttulo1"' in doc[inicio:alvo], "título REFERÊNCIAS não encontrado como esperado"
    for ns, uri in [("wp", "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"), ("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")]:
        assert f'xmlns:{ns}="{uri}"' in doc[:6000], ns
    doc = doc[:inicio] + CAPITULO + doc[inicio:]

    rels = itens["word/_rels/document.xml.rels"][1].decode("utf-8")
    novas = "".join(
        f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{media}"/>'
        for rid, _, media in imagens
    )
    rels = rels.replace("</Relationships>", novas + "</Relationships>")

    tipos = itens["[Content_Types].xml"][1].decode("utf-8")
    if 'Extension="png"' not in tipos:
        tipos = tipos.replace("<Default Extension=\"rels\"", '<Default Extension="png" ContentType="image/png"/><Default Extension="rels"')

    novos = {"word/document.xml": doc.encode("utf-8"), "word/_rels/document.xml.rels": rels.encode("utf-8"), "[Content_Types].xml": tipos.encode("utf-8")}

    tmp = SAIDA + ".tmp"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as saida:
        for nome, (info, dados) in itens.items():
            if nome.endswith("/"):
                continue
            saida.writestr(nome, novos.get(nome, dados))
        for _, origem, media in imagens:
            saida.write(origem, f"word/media/{media}")
    shutil.move(tmp, SAIDA)
    print("gravado:", SAIDA)
    print("figuras:", len(imagens), "| ids de revisão usados:", _id[0] - 30000)


if __name__ == "__main__":
    main()
