"""Blocos de página do relatório visual (16:9, 1920×1080), no sistema visual do checkpoint.

Cada função devolve uma página (<section>). O capítulo atual (número, nome e cor) é
definido por `divisor`, e as páginas seguintes herdam a cor e o rodapé dele.

Cores: "noite", "riso", "rosa", "verde", "limao".
Texto aceita HTML simples: <strong>, <em>, <br>.
Imagens: caminho relativo a img/ (ex.: "rel/fig15.jpg", "v2/m-inicio.jpg").
"""

ESTADO = {"cor": "noite", "rodape": "", "num": "", "nome": ""}
SUMARIO = []  # (num, nome, índice da página) — preenchido por divisor; gerar.py troca pelo número real


def _cls(extra=""):
    return f'class="s {ESTADO["cor"]} {extra}"'.replace("  ", " ")


def _titulo(a, b, estilo=""):
    st = f' style="{estilo}"' if estilo else ""
    return f'<h1 class="t"{st}><span>{a}</span><b>{b}</b></h1>'


def _rodape():
    return f'<div class="foot"><i></i>{ESTADO["rodape"]}</div>'


def _lista(itens, tam=25):
    return '<ul class="b">' + "".join(f'<li style="font-size:{tam}px">{i}</li>' for i in itens) + "</ul>"


def _paras(paras, tam=25):
    return "".join(f'<p style="font-size:{tam}px;margin-bottom:16px">{p}</p>' for p in paras)


def _nota(nota):
    return f'<p class="small nota">{nota}</p>' if nota else ""


def _lead(lead):
    return f'<p class="lead" style="max-width:1500px;margin-bottom:34px">{lead}</p>' if lead else ""


FORMAS = {
    "noite": '<circle cx="320" cy="400" r="170" fill="none" stroke="#fff" stroke-width="14"/><circle cx="320" cy="730" r="170" fill="none" stroke="#fff" stroke-width="14"/>',
    "riso": '<rect x="110" y="250" width="420" height="420" fill="none" stroke="#fff" stroke-width="14"/><rect x="230" y="370" width="180" height="180" fill="#fff"/>',
    "rosa": '<circle cx="320" cy="430" r="210" fill="none" stroke="#fff" stroke-width="14"/><circle cx="320" cy="430" r="60" fill="#fff"/><rect x="110" y="760" width="420" height="60" fill="#1B1F3B"/><rect x="110" y="850" width="300" height="60" fill="#fff"/>',
    "verde": '<circle cx="320" cy="360" r="140" fill="none" stroke="#fff" stroke-width="14"/><circle cx="320" cy="720" r="190" fill="none" stroke="#fff" stroke-width="14"/><circle cx="320" cy="360" r="40" fill="#fff"/>',
    "limao": '<rect x="120" y="200" width="180" height="180" fill="#1B1F3B"/><rect x="340" y="200" width="180" height="180" fill="#FF48B0"/><rect x="120" y="420" width="180" height="180" fill="#0B8FE0"/><rect x="340" y="420" width="180" height="180" fill="#12A180"/><rect x="120" y="640" width="400" height="200" fill="#fff"/>',
}


def divisor(num, a, b, texto, cor):
    """Abertura de capítulo. `num` = "01"; `a`/`b` = título em duas linhas (fina / negrito)."""
    ESTADO.update(cor=cor, num=num, nome=f"{a} {b}".strip(), rodape=f"{num} · {a} {b}".strip())
    SUMARIO.append((num, f"{a} {b}".strip()))
    return (f'<section class="s div {cor} nofoot" data-cap="{num}"><div class="l"><div class="num">{num}</div>'
            f'<h2><span>{a}</span>{b}</h2><p class="lead" style="max-width:900px">{texto}</p></div>'
            f'<div class="panel" style="position:relative;width:640px"><svg viewBox="0 0 640 1080">{FORMAS[cor]}</svg></div></section>')


def texto(a, b, lead=None, paragrafos=(), bullets=(), kicker=None, nota=None, img=None, legenda=None, img_larg=820):
    """Página de texto. Com `img`, o texto fica à esquerda e a imagem à direita."""
    corpo = _lead(lead) + (f'<div class="kicker">{kicker}</div>' if kicker else "") + _paras(paragrafos) + (_lista(bullets) if bullets else "") + _nota(nota)
    if img:
        cap = f'<div class="cap">{legenda}</div>' if legenda else ""
        corpo = (f'<div style="display:flex;gap:70px;align-items:flex-start"><div style="flex:1">{corpo}</div>'
                 f'<div style="width:{img_larg}px;flex:none"><div class="shot fig"><img src="img/{img}"></div>{cap}</div></div>')
        return f'<section {_cls()}>{_titulo(a, b)}{corpo}{_rodape()}</section>'
    return f'<section {_cls()}>{_titulo(a, b)}<div style="max-width:1560px">{corpo}</div>{_rodape()}</section>'


def colunas(a, b, cols, lead=None, nota=None):
    """2 a 4 colunas. Cada coluna: {"kicker": ..., "itens": [...]} ou {"kicker": ..., "texto": "..."}."""
    html = ""
    for c in cols:
        miolo = _lista(c["itens"], 23) if "itens" in c else _paras([c["texto"]], 23)
        html += f'<div class="col"><div class="kicker">{c.get("kicker", "")}</div>{miolo}</div>'
    return f'<section {_cls()}>{_titulo(a, b)}{_lead(lead)}<div class="row" style="gap:56px">{html}</div>{_nota(nota)}{_rodape()}</section>'


def cards(a, b, cards, lead=None, nota=None):
    """Cartões em grade (2 a 4 por linha; até 8). Cada cartão: (tag, título, texto)."""
    n = len(cards)
    por_linha = 4 if n in (4, 7, 8) else 3 if n in (3, 5, 6, 9) else 2
    html = "".join(
        f'<div class="ep">{f"<div class=k>{t}</div>" if t else ""}<h3>{h}</h3><p>{p}</p></div>' for t, h, p in cards)
    return (f'<section {_cls()}>{_titulo(a, b)}{_lead(lead)}'
            f'<div style="display:grid;grid-template-columns:repeat({por_linha},1fr);gap:22px">{html}</div>{_nota(nota)}{_rodape()}</section>')


def numeros(a, b, itens, lead=None, nota=None):
    """Números grandes. Cada item: (número, texto, fonte). Até 5 itens."""
    html = "".join(f'<div class="stat"><div class="n">{n}</div><p>{t}</p><div class="src">{f}</div></div>' for n, t, f in itens)
    return f'<section {_cls()}>{_titulo(a, b)}{_lead(lead)}<div>{html}</div>{_nota(nota)}{_rodape()}</section>'


def tabela(a, b, cab, linhas, lead=None, nota=None, num=False, tam=None):
    """Tabela. `cab` = lista de cabeçalhos; `linhas` = lista de listas. `num=True` alinha números à direita."""
    st = f' style="--tdsz:{tam}px"' if tam else ""
    th = "".join(f"<th>{c}</th>" for c in cab)
    tr = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in l) + "</tr>" for l in linhas)
    cls = "tb num" if num else "tb"
    return f'<section {_cls()}>{_titulo(a, b)}{_lead(lead)}<table class="{cls}"{st}><tr>{th}</tr>{tr}</table>{_nota(nota)}{_rodape()}</section>'


def figura(a, b, img, legenda=None, texto=None, altura=640):
    """Figura grande, com uma linha de texto opcional."""
    cap = f'<div class="cap">{legenda}</div>' if legenda else ""
    tx = f'<p style="font-size:24px;max-width:1560px;margin-bottom:24px">{texto}</p>' if texto else ""
    return (f'<section {_cls()}>{_titulo(a, b, "margin-bottom:26px")}{tx}'
            f'<div class="figbox" style="height:{altura}px"><img src="img/{img}"></div>{cap}{_rodape()}</section>')


def destaque(kicker, frase, sub=None):
    """Página escura com uma frase central (pergunta projetual, proposta de valor)."""
    s = f'<p style="color:rgba(255,255,255,.75);font-size:28px;margin-top:40px;max-width:1300px">{sub}</p>' if sub else ""
    return (f'<section class="s escuro {ESTADO["cor"]}"><div class="kicker" style="color:#fff">{kicker}</div>'
            f'<div class="mid"><p style="font:600 72px/1.12 \'Instrument Sans\';color:#fff;max-width:1500px;letter-spacing:-.01em">{frase}</p>{s}</div>{_rodape()}</section>')


def celulares(a, b, imgs, texto=None, bullets=(), kicker=None):
    """Telas de celular (até 4) à direita, texto à esquerda. imgs: [(arquivo em img/v2 sem .jpg, legenda)]."""
    tel = "".join(f'<div><div class="phone sm"><img src="img/v2/{i}.jpg"></div><div class="cap">{c}</div></div>' for i, c in imgs)
    esq = (f'<p style="font-size:24px;margin-bottom:24px">{texto}</p>' if texto else "") + (f'<div class="kicker">{kicker}</div>' if kicker else "") + (_lista(bullets, 22) if bullets else "")
    return (f'<section {_cls()}><div style="display:flex;gap:60px;height:100%"><div style="width:560px;flex:none">{_titulo(a, b)}{esq}</div>'
            f'<div style="flex:1;display:flex;gap:26px;justify-content:flex-end;align-items:flex-start">{tel}</div></div>{_rodape()}</section>')


def bruto(html):
    """Página com HTML livre (usar só quando nenhum bloco serve). Deve conter <section ...>."""
    return html.replace("{RODAPE}", _rodape()).replace("{COR}", ESTADO["cor"])
