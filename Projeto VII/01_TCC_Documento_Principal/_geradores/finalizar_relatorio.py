"""Versão final do relatório (24/11/2026): parte da versão limpa que sai do atualizar_relatorio.py.

O que faz (sem alterações controladas: o Bruno aceitou todas em 24/11/2026):
- aceita as alterações que ainda existirem;
- devolve a Tabela 1 (comparação com a dissertação da USP), que estava solta depois das referências, para a seção 2.6.6;
- legendas em preto, 10 pt (o estilo vinha azul, padrão do Word);
- aplica as correções de texto de correcoes_finais.py (trechos desatualizados ou com cara de rascunho);
- cap. 14 Considerações finais, antes das referências;
- pré-textuais na ordem da NBR 14724: resumo, abstract, lista de figuras, de quadros e de tabelas, antes do sumário.

Uso:  python3 finalizar_relatorio.py <docx-limpo-de-entrada> <docx-final> [paginas.json]
paginas.json = {"Figura 1": 82, "Quadro 1": 58, ...}, lido do PDF por gerar_final.sh (2ª passada em diante).
"""
import copy, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from docx_rastreado import Doc, q  # noqa: E402
import correcoes_finais as C  # noqa: E402

src, out = sys.argv[1], sys.argv[2]
paginas = json.load(open(sys.argv[3])) if len(sys.argv) > 3 and os.path.exists(sys.argv[3]) else {}
work = out + ".dir"

d = Doc(src, work, date="2026-11-24T22:00:00Z", first_id=60000)
d.accept_all()
P, H, B = d.para, d.h, d.bullet
body = d.body
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def achar(trecho):
    alvo = norm(trecho)
    hits = [p for p in body.iter(q("p")) if alvo in norm(d.text(p)) and not d.style(p).startswith("Sumrio")]
    if len(hits) != 1:
        raise LookupError("%d parágrafos com: %r" % (len(hits), trecho[:90]))
    return hits[0]


def trocar(antes, depois):
    """Troca um trecho dentro de um parágrafo, mesmo que ele esteja quebrado em vários runs."""
    p = achar(antes)
    ts = list(p.iter(q("t")))
    texto = "".join(t.text or "" for t in ts)
    m = re.search(r"\s+".join(re.escape(w) for w in antes.split()), texto)
    if not m:
        raise LookupError("trecho não casou: %r" % antes[:90])
    ini, fim = m.span()
    pos = 0; primeiro = True
    for t in ts:
        a = pos; b = pos + len(t.text or ""); pos = b
        if b <= ini or a >= fim:
            continue
        s = t.text or ""
        ca, cb = max(ini, a) - a, min(fim, b) - a
        t.text = s[:ca] + (depois if primeiro else "") + s[cb:]
        t.set(XML_SPACE, "preserve"); primeiro = False


def _comeca(inicio):
    alvo = norm(inicio)
    hits = [p for p in body.iter(q("p")) if norm(d.text(p)).startswith(alvo) and not d.style(p).startswith("Sumrio")]
    if len(hits) != 1:
        raise LookupError("%d parágrafos começando com: %r" % (len(hits), inicio[:90]))
    return hits[0]


def substituir_paragrafo(inicio, novos):
    """Troca o parágrafo que começa com `inicio` por um ou mais parágrafos novos, no mesmo estilo."""
    p = _comeca(inicio)
    estilo = d.style(p) or None
    novos = [novos] if isinstance(novos, str) else novos
    els = [P(t, style=estilo) for t in novos]
    d.insert_after(p, els)
    p.getparent().remove(p)


def inserir_depois(inicio, textos):
    p = _comeca(inicio)
    d.insert_after(p, [P(t) if isinstance(t, str) else t for t in textos])


def remover_paragrafo(inicio):
    p = _comeca(inicio)
    p.getparent().remove(p)


# ------------------------------------------------------------------ nova Figura 15 (logo oficial): as figuras 15 a 22 passam a 16 a 23
def _renumerar(m):
    n = int(m.group(1))
    return "Figura %d" % (n + 1) if 15 <= n <= 22 else m.group(0)
for t in body.iter(q("t")):
    if t.text and "Figura" in t.text:
        t.text = re.sub(r"Figura (\d+)", _renumerar, t.text)

# ------------------------------------------------------------------ Tabela 1 de volta à seção 2.6.6
cap_tab = achar("Comparação entre a dissertação da USP (Souza, 2025) e o TCC proposto")
trocar("Tabela 1 –", "Tabela 1 —")
tabs = [t for t in body if t.tag == q("tbl") and d.text(t).startswith("Dissertação USP (Túlio")]
assert len(tabs) == 1, len(tabs)
ref = d.find("REFERÊNCIAS", style="Ttulo1")
if list(body).index(tabs[0]) > list(body).index(ref):
    cap_tab.addnext(tabs[0])

# ------------------------------------------------------------------ legendas em preto
st_path = os.path.join(work, "word/styles.xml")
st = open(st_path, encoding="utf-8").read()
i = st.index('w:styleId="Legenda"'); j = st.index("</w:style>", i)
bloco = st[i:j].replace('<w:color w:val="4F81BD" w:themeColor="accent1"/>', '<w:color w:val="000000"/>')
bloco = bloco.replace('<w:sz w:val="18"/><w:szCs w:val="18"/>', '<w:sz w:val="20"/><w:szCs w:val="20"/>')
open(st_path, "w", encoding="utf-8").write(st[:i] + bloco + st[j:])

# ------------------------------------------------------------------ correções de texto
erros = []
def tentar(f, *a):
    try:
        f(*a)
    except LookupError as e:
        erros.append(str(e))
for antes, depois in C.TROCAS:
    tentar(trocar, antes, depois)
for inicio, novos in C.PARAGRAFOS:
    tentar(substituir_paragrafo, inicio, novos)
for inicio, textos in C.INSERCOES:
    tentar(inserir_depois, inicio, textos)
for inicio in C.REMOCOES:
    tentar(remover_paragrafo, inicio)
if erros:
    sys.exit("correções que não acharam o texto:\n- " + "\n- ".join(erros))
for mover, antes_de in getattr(C, "MOVER_REFERENCIA", []):
    _comeca(antes_de).addprevious(_comeca(mover))

# figura da logo oficial, depois do parágrafo da versão reduzida
FIG = os.path.join(HERE, "figuras")
_ancora = _comeca("A versão reduzida é a bola 8 sozinha.")
d.insert_after(_ancora, d.figure(os.path.join(FIG, "fig-logo-oficial.jpg"), 115,  # 115 só no nome interno (rIdFig15 já existe)
    "Figura 15 — Logo oficial do BASE8: versão principal e construção sobre o grid"))

# ------------------------------------------------------------------ cap. 14: considerações finais
d.insert_before(ref, [H(1, "14 CONSIDERAÇÕES FINAIS")] + [P(t) for t in C.CONCLUSAO])

# ------------------------------------------------------------------ pré-textuais (antes do sumário)
sumario = [p for p in body if p.tag == q("p") and d.text(p) == "SUMÁRIO"]
assert len(sumario) == 1
sumario = sumario[0]


def titulo_pre(texto):
    p = copy.deepcopy(sumario)
    for k in list(p.attrib):
        if "paraId" in k or "textId" in k:
            del p.attrib[k]
    for r in p.findall(q("r"))[1:]:
        p.remove(r)
    p.find(q("r")).find(q("t")).text = texto
    return p


def quebra_pagina():
    p = d.el("p"); r = d.el("r"); r.append(d.el("br", type="page")); p.append(r)
    return p


def texto_pre(texto, depois="0"):
    return P(texto, spacing={"line": "240", "lineRule": "auto", "after": depois}, ind_first0=True, jc="both")


def item_lista(rotulo, titulo, pagina):
    p = d.el("p"); ppr = d.el("pPr")
    tabs_ = d.el("tabs"); tabs_.append(d.el("tab", val="right", leader="dot", pos="9061")); ppr.append(tabs_)
    ppr.append(d.el("spacing", line="240", lineRule="auto", after="120"))
    ppr.append(d.el("ind", left="0", right="567", firstLine="0"))
    ppr.append(d.el("jc", val="left"))
    p.append(ppr)
    p.append(d.run("%s — %s" % (rotulo, titulo)))
    r = d.el("r"); r.append(d.el("tab")); p.append(r)
    p.append(d.run(str(pagina) if pagina else "?"))
    return p


def legendas(tipo):
    achados = []
    for p in body.iter(q("p")):
        if d.style(p) != "Legenda" and not (tipo == "Tabela" and d.style(p) == ""):
            continue
        m = re.match(r"(%s \d+)\s*[—–-]\s*(.+)" % tipo, norm(d.text(p)))
        if m and d.style(p) == "" and tipo == "Tabela":
            ppr = p.find(q("pPr"))
            if ppr is None:
                ppr = d.el("pPr"); p.insert(0, ppr)
            ppr.insert(0, d.el("pStyle", val="Legenda"))  # a legenda da Tabela 1 vinha sem estilo
        if m:
            achados.append((m.group(1), m.group(2)))
    return achados


pre = []
pre += [titulo_pre("RESUMO"), texto_pre(C.RESUMO, "240"), texto_pre("**Palavras-chave:** " + C.PALAVRAS_CHAVE), quebra_pagina()]
pre += [titulo_pre("ABSTRACT"), texto_pre(C.ABSTRACT, "240"), texto_pre("**Keywords:** " + C.KEYWORDS), quebra_pagina()]
for tipo, nome in (("Figura", "LISTA DE FIGURAS"), ("Quadro", "LISTA DE QUADROS"), ("Tabela", "LISTA DE TABELAS")):
    itens = legendas(tipo)
    nums = [int(r.split()[1]) for r, _ in itens]
    assert nums == list(range(1, len(nums) + 1)), (tipo, nums)
    pre.append(titulo_pre(nome))
    pre += [item_lista(r, t, paginas.get(r)) for r, t in itens]
    pre.append(quebra_pagina())
d.insert_before(sumario, pre)

d.accept_all()
d.save(out)
print("final:", out, "| legendas com página:", len(paginas))
