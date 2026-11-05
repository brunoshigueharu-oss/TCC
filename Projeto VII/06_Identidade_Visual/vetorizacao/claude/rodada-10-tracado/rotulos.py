"""Gera um SVG de rótulos: cada objeto da rodada 9 pintado com uma cor única (mapa de regiões)."""
import sys, os, json
R9 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "rodada-9-base8")
tmp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_conferencia", "_r9tmp")
sys.argv = ["x", tmp]
ns = {"__name__": "r9"}
exec(open(os.path.join(R9, "gerar-rodada-9.py")).read(), ns)
objetos = [o for o in ns["objetos"] if o[0] != "polvo"]
cores, lista = [], []
out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="700 740 1720 460" width="1720" height="460" shape-rendering="crispEdges">',
       '<rect x="700" y="740" width="1720" height="460" fill="#000000"/>']
for i, (letra, nome, partes) in enumerate(objetos):
    k = i + 1; cor = f"#{(k*5)%256:02x}{(k*37)%256:02x}{(k*91)%256:02x}"
    cor = f"#{k:02x}{k:02x}{k:02x}"   # cinza = índice (sem ambiguidade)
    lista.append([letra, nome])
    els = []
    for t, c in partes:
        if t in ("forma", "linha", "cheio"):
            els.append(f'<path d="{c}" fill="{cor}" stroke="{cor}" stroke-width="10" stroke-linejoin="round"/>')
        elif t in ("raw", "cheio_raw"):
            els.append(c.replace("/>", f' fill="{cor}" stroke="{cor}" stroke-width="10"/>'))
    out.append("<g>" + "".join(els) + "</g>")
out.append("</svg>")
open(os.path.join(os.path.dirname(tmp), "rotulos.svg"), "w").write("\n".join(out))
json.dump(lista, open(os.path.join(os.path.dirname(tmp), "rotulos.json"), "w"), ensure_ascii=False)
print(len(lista))
