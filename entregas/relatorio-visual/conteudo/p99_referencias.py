"""Referências (as mesmas do relatório completo), em três colunas por página."""
import json, os
import blocos
from blocos import bruto
blocos.SUMARIO.append(("—", "Referências"))

REFS = json.load(open(os.path.join(os.path.dirname(__file__), "referencias.json"), encoding="utf-8"))
POR_COLUNA = 1820  # caracteres

colunas, atual, n = [], [], 0
for r in REFS:
    if n + len(r) > POR_COLUNA and atual:
        colunas.append(atual); atual, n = [], 0
    atual.append(r); n += len(r)
colunas.append(atual)

PAGINAS = []
for i in range(0, len(colunas), 3):
    tit = '<h1 class="t" style="margin-bottom:30px"><b>Referências</b></h1>' if i == 0 else '<h1 class="t" style="margin-bottom:30px"><span>Referências</span><b>(continuação)</b></h1>'
    cols = "".join('<div style="flex:1;min-width:0">' + "".join(f"<p>{r}</p>" for r in c) + "</div>" for c in colunas[i:i + 3])
    cap = ' data-cap="—"' if i == 0 else ""
    PAGINAS.append(bruto(f'<section class="s noite"{cap} style="padding-top:80px">{tit}<div class="refs2" style="display:flex;gap:56px">{cols}</div>'
                         '<div class="foot"><i></i>Referências</div></section>'))
