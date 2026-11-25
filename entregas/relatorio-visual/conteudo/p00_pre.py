"""Pré-textuais: capa, folha de rosto, resumo, abstract e sumário."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "Projeto VII", "01_TCC_Documento_Principal", "_geradores"))
import correcoes_finais as C  # noqa: E402
from blocos import bruto

TITULO = "O designer e a IA de código"
# Versão fechada: sem as duas frases finais, que falam de etapas seguintes
RESUMO = C.RESUMO.split(" Mostra também que")[0].strip()
ABSTRACT = C.ABSTRACT.split(" It also shows that")[0].strip()
SUB = "BASE8, um hub de capacitação para ampliar o alcance da atuação em design"

PAGINAS = [
    bruto(f'''<section class="s capa nofoot">
  <div class="l">
    <div class="kicker">Projeto VII · Trabalho de Conclusão de Curso · Design PUCPR</div>
    <div>
      <h1>O designer<br><em>e a IA de código</em></h1>
      <p class="lead" style="max-width:820px;margin-top:40px">{SUB}.</p>
    </div>
    <div><p style="font:600 26px/1.3 'Instrument Sans';color:var(--texto)">Bruno Shigueharu de Camargo Higashi</p><p class="small">Curitiba · 2026</p></div>
  </div>
  <div class="r" style="display:grid;place-items:center"><img src="img/BASE8_logo_branca.svg" style="width:560px"></div>
</section>'''),
    bruto(f'''<section class="s nofoot" style="justify-content:space-between">
  <div class="kicker">Pontifícia Universidade Católica do Paraná · Escola de Belas Artes · Curso de Design</div>
  <div>
    <p style="font:700 84px/1 'Instrument Sans';text-transform:uppercase;color:var(--noite);letter-spacing:-.01em">{TITULO}</p>
    <p class="lead" style="margin-top:28px;max-width:1100px">{SUB}</p>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end">
    <div><p style="font:600 26px/1.3 'Instrument Sans';color:var(--texto)">Bruno Shigueharu de Camargo Higashi</p><p class="small">Curitiba · 2026</p></div>
    <p style="max-width:760px;font-size:22px;text-align:right">Trabalho de Conclusão de Curso apresentado ao curso de Design da Pontifícia Universidade Católica do Paraná (PUCPR), como requisito parcial para a obtenção do grau de Bacharel em Design.<br><br><strong>Orientadores:</strong> Luciane Hilu, Gabriela Unger Unruh e Carlos Roberto Romaniello</p>
  </div>
</section>'''),
    bruto(f'''<section class="s nofoot">
  <h1 class="t"><b>Resumo</b></h1>
  <p style="font-size:24px;line-height:1.5;max-width:1680px">{RESUMO}</p>
  <p style="font-size:22px;margin-top:30px"><strong>Palavras-chave:</strong> {C.PALAVRAS_CHAVE}</p>
</section>'''),
    bruto(f'''<section class="s nofoot">
  <h1 class="t"><b>Abstract</b></h1>
  <p style="font-size:24px;line-height:1.5;max-width:1680px">{ABSTRACT}</p>
  <p style="font-size:22px;margin-top:30px"><strong>Keywords:</strong> {C.KEYWORDS}</p>
</section>'''),
    bruto('''<section class="s nofoot">
  <h1 class="t"><b>Sumário</b></h1>
  {SUMARIO}
</section>'''),
]
