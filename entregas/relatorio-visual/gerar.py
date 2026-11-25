"""Gera o relatório visual (16:9) do TCC: relatorio-visual.html + PDF.

Rodar nesta pasta:  python3 gerar.py          (só o HTML)
                    python3 gerar.py --pdf    (HTML + PDF pelo Chrome + checagem de texto estourado)

Conteúdo: conteudo/p00.py, p01.py, ... (em ordem). Cada módulo define PAGINAS = [...],
montadas com as funções de blocos.py.
"""
import glob, importlib.util, os, re, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import blocos  # noqa: E402

CSS_EXTRA = """
.fig img{display:block;width:100%}
.shot.fig{border-radius:8px}
.figbox{display:flex;align-items:center;justify-content:center;background:var(--sup);border-radius:8px;overflow:hidden;padding:24px}
.figbox img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.nota{margin-top:26px;max-width:1560px}
.tb td{font-size:var(--tdsz,24px);padding:14px 22px 14px 0}
.ep p{font-size:21px}
.ep h3{font-size:28px}
.s.escuro.noite,.s.escuro.riso,.s.escuro.rosa,.s.escuro.verde,.s.escuro.limao{background:var(--noite)}
.s.escuro .kicker::before{background:var(--c)}
.sum{columns:2;column-gap:120px;margin-top:10px}
.sum div{display:flex;align-items:baseline;gap:14px;padding:13px 0;border-bottom:1px solid var(--linha);break-inside:avoid}
.sum .k{font:600 22px/1 'JetBrains Mono',monospace;color:var(--ter);width:46px}
.sum .n{font:600 27px/1.2 'Instrument Sans';color:var(--texto);flex:1;text-transform:uppercase;letter-spacing:.01em}
.sum .p{font:500 22px/1 'JetBrains Mono',monospace;color:var(--ter)}
.refs{columns:3;column-gap:56px}
.refs p{font-size:14.5px;line-height:1.38;margin-bottom:9px;break-inside:avoid;color:var(--sec);overflow-wrap:anywhere}
.refs2 p{font-size:14px;line-height:1.36;margin-bottom:9px;color:var(--sec);overflow-wrap:anywhere}
"""

mods = sorted(glob.glob(os.path.join(AQUI, "conteudo", "p*.py")))
SO = sys.argv[sys.argv.index("--so") + 1] if "--so" in sys.argv else None  # testar um módulo só: --so p02
if SO:
    mods = [m for m in mods if os.path.basename(m).startswith(SO)]
SUF = f"-{SO}" if SO else ""
paginas = []
for m in mods:
    spec = importlib.util.spec_from_file_location(os.path.basename(m)[:-3], m)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    paginas += mod.PAGINAS

# sumário: número real de cada abertura de capítulo (+1 porque a abertura vem antes do conteúdo)
pag_cap = {}
for i, p in enumerate(paginas, 1):
    m = re.search(r'data-cap="([^"]+)"', p)
    if m:
        pag_cap[m.group(1)] = i
itens = "".join(f'<div><span class="k">{n}</span><span class="n">{nome}</span><span class="p">{pag_cap.get(n, "?"):02d}</span></div>'
                for n, nome in blocos.SUMARIO)
paginas = [p.replace("{SUMARIO}", f'<div class="sum">{itens}</div>') for p in paginas]

css = open(os.path.join(AQUI, "base.css"), encoding="utf-8").read() + CSS_EXTRA
html = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Relatório TCC — BASE8</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>{css}</style>
</head>
<body>
{chr(10).join(paginas)}
<script>
document.fonts.ready.then(()=>{{document.querySelectorAll('section.s').forEach((s,i)=>{{
  const r=s.getBoundingClientRect(); let estouro=s.scrollHeight>s.clientHeight+2||s.scrollWidth>s.clientWidth+2;
  s.querySelectorAll('*').forEach(e=>{{const b=e.getBoundingClientRect(); if(b.height&&b.bottom>r.bottom-40&&!e.closest('.foot')&&!e.closest('.panel')&&!s.classList.contains('div')&&!s.classList.contains('capa')) estouro=true;}});
  if(estouro) s.setAttribute('data-estouro','1');
}}); document.body.setAttribute('data-ok','1');}});
</script>
</body>
</html>"""
out = os.path.join(AQUI, f"relatorio-visual{SUF}.html")
open(out, "w", encoding="utf-8").write(html)
print(len(paginas), "páginas ->", out)

if "--pdf" in sys.argv:
    chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    dom = subprocess.run([chrome, "--headless=new", "--virtual-time-budget=20000", "--window-size=1920,1080", "--dump-dom", out],
                         capture_output=True, text=True).stdout
    secs = re.findall(r"<section[^>]*>", dom)
    ruins = [i for i, s in enumerate(secs, 1) if "data-estouro" in s]
    print("páginas:", len(secs))
    print("páginas com texto estourado:", ruins or "nenhuma")
    pdf = os.path.join(AQUI, f"Relatorio_TCC_BASE8_visual{SUF}.pdf")
    subprocess.run([chrome, "--headless=new", "--no-pdf-header-footer", "--virtual-time-budget=20000",
                    f"--print-to-pdf={pdf}", out], capture_output=True)
    print("PDF ->", pdf)
