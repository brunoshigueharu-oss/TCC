"""Gera apresentacao-processo.html: a apresentação de processo do TCC num visual só.

Junta, no visual do checkpoint v2 (HTML 1920×1080, paleta BASE8):
  - a pesquisa e a definição das apresentações de setembro (PROJETO VII-3.pdf, 26 slides),
    reescritas com o termo atual ("IA de código") e com o percurso da pergunta projetual;
  - os 28 slides de conteúdo do checkpoint v2 (12/11), com a logo oficial no lugar do rascunho.

Seções: 01 Pesquisa (riso) · 02 Definição (rosa) · 03 Referências visuais (limão)
        04 Solução (verde) · 05 Negócio (noite) · 06 Campanha (riso)

Rodar nesta pasta:  python3 gerar.py
PDF:  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
        --virtual-time-budget=20000 --print-to-pdf=Apresentacao_Processo_TCC_BASE8.pdf apresentacao-processo.html
"""
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
# O checkpoint v2 mora no checkout principal (entregas/ não é versionado no worktree).
CK = os.environ.get("CHECKPOINT_DIR", "/Users/brunohigashi/Documents/Claude Code/TCC/entregas/checkpoint-tcc")


def secoes(path):
    src = open(path, encoding="utf-8").read()
    return src, ["<section" + s.split("</section>")[0] + "</section>" for s in src.split("<section")[1:]]


src2, v2 = secoes(os.path.join(CK, "checkpoint-tcc-v2.html"))
_, v1 = secoes(os.path.join(CK, "checkpoint-tcc.html"))
V1 = lambda n: v1[n - 1]
V2 = lambda n: v2[n - 1]

head = src2[: src2.find("<body>") + len("<body>")].replace("<title>Checkpoint TCC — BASE8</title>", "<title>Processo TCC — BASE8</title>")
head = head.replace("</style>", """
.case h4{font:600 19px/1 'Instrument Sans';letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin:0 0 22px}
.case p,.case li{font-size:27px;line-height:1.45}
.case ol{padding-left:30px}.case ol li{margin-bottom:6px;padding-left:6px}
.valor{position:absolute;right:120px;top:96px;text-align:right}
.valor small{display:block;font:600 15px/1 'Instrument Sans';letter-spacing:.18em;text-transform:uppercase;color:var(--ter);margin-bottom:8px}
.valor b{font:700 34px/1 'Instrument Sans';color:var(--ink);letter-spacing:.02em}
.q{font:500 38px/1.3 'Instrument Sans';color:var(--texto)}
.q strong{font-weight:700}
.passo{flex:1;border-top:6px solid var(--c);padding-top:20px}
.passo .k{font:500 17px/1 'JetBrains Mono',monospace;color:var(--ter);margin-bottom:14px}
.passo p{font-size:23px;line-height:1.4}
.passo.final p{color:var(--texto)}
.tb.bm td{font-size:21px}.tb.bm td:first-child{font-size:23px}
</style>""")

# ---------------------------------------------------------------- ajudantes

def title(a, b, style=""):
    return f'<h1 class="t" style="{style}"><span>{a}</span><b>{b}</b></h1>'


def foot(txt):
    return f'<div class="foot"><i></i>{txt}</div>'


def bullets(items, size=24, color=None):
    c = f' style="--c:var(--{color})"' if color else ""
    return f'<ul class="b"{c}>' + "".join(f'<li style="font-size:{size}px">{i}</li>' for i in items) + "</ul>"


def divisor(cls, num, a, b, lead, svg):
    return (f'<section class="s div {cls} nofoot"><div class="l"><div class="num">{num}</div><h2><span>{a}</span>{b}</h2>'
            f'<p class="lead" style="max-width:900px">{lead}</p></div>'
            f'<div class="panel" style="position:relative;width:640px"><svg viewBox="0 0 640 1080">{svg}</svg></div></section>')


def stats(cls, a, b, kicker, itens, rodape, nota=""):
    linhas = "".join(f'<div class="stat" style="padding:20px 0"><div class="n" style="font-size:78px;min-width:220px">{n}</div><p>{t}</p><div class="src">{s}</div></div>'
                     for n, t, s in itens)
    extra = f'<p class="lead" style="margin-top:34px">{nota}</p>' if nota else ""
    return f'''<section class="s {cls}">
  {title(a, b, "margin-bottom:24px")}
  <div class="mid"><div class="kicker">{kicker}</div>{linhas}{extra}</div>
  {foot(rodape)}
</section>'''


def roda(centro, pilares, vertentes, cores, tam=760):
    """Roda de valores: centro, 4 pilares no anel do meio, 8 vertentes (2 por pilar) no anel de fora."""
    forte, medio, claro, tinta, tc = cores
    R0, R1, R2 = 135, 275, 410
    P = lambda r, a: (r * math.cos(a), r * math.sin(a))
    o = [f'<svg width="{tam}" height="{tam}" viewBox="-430 -430 860 860">',
         f'<circle r="{R2}" fill="{claro}"/><circle r="{R1}" fill="{medio}"/><circle r="{R0}" fill="{forte}"/>']
    for i in range(8):
        a = -math.pi / 2 + i * math.pi / 4
        (x1, y1), (x2, y2) = P(R1, a), P(R2, a)
        o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#fff" stroke-width="4"/>')
    for i in range(4):
        a = -math.pi / 2 + i * math.pi / 2
        (x1, y1), (x2, y2) = P(R0, a), P(R2, a)
        o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#fff" stroke-width="8"/>')
    o.append(f'<circle r="{R0}" fill="none" stroke="#fff" stroke-width="8"/><circle r="{R1}" fill="none" stroke="#fff" stroke-width="8"/>')
    fs = 25 if len(centro) <= 13 else 21
    o.append(f'<text y="8" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="{fs}" fill="{tc}">{centro}</text>')
    for i, p in enumerate(pilares):
        a = -math.pi / 2 + math.pi / 4 + i * math.pi / 2
        x, y = P((R0 + R1) / 2, a)
        o.append(f'<text x="{x:.1f}" y="{y + 8:.1f}" text-anchor="middle" font-family="Instrument Sans" font-weight="700" font-size="{19 if len(p) > 10 else 23}" fill="{tinta}">{p}</text>')
    for i, v in enumerate(vertentes):
        a = -math.pi / 2 + math.pi / 8 + i * math.pi / 4
        x, y = P((R1 + R2) / 2, a)
        o.append(f'<text x="{x:.1f}" y="{y + 7:.1f}" text-anchor="middle" font-family="Figtree" font-weight="500" font-size="20" fill="{tinta}">{v}</text>')
    o.append("</svg>")
    return "".join(o)


ROSA = ("#FF48B0", "#FFC2E5", "#FFE3F3", "#1B1F3B", "#fff")

P1, P2 = "01 · Pesquisa", "02 · Definição"
slides = []

# ---------------------------------------------------------------- abertura
capa = V2(1)
capa = capa.replace("<h1><em>CHECK</em><br>POINT</h1>", "<h1><em>PROJETO</em><br>VII</h1>")
capa = capa.replace("O que fiz até agora: referências visuais, linguagem visual, modelo de solução, modelo de negócio, campanha e o protótipo em código.",
                    "O processo do TCC: pesquisa, definição, referências visuais, solução, modelo de negócio e campanha do BASE8.")
capa = capa.replace('<div class="logo8" style="position:absolute;left:0;right:0;top:645px;justify-content:center;color:#fff">BASE <b>8</b></div>',
                    '<img src="img/logo/BASE8_logo_branca@2x.png" style="position:absolute;left:150px;width:460px;top:612px">')
slides.append(capa)

fases = V1(2)
fases = fases.replace('<h1 class="t"><span>Onde</span><b>estou</b></h1>', title("O", "processo"))
fases = fases.replace("Sigo o Duplo Diamante. As fases de descoberta e definição estão fechadas. Hoje estou no meio da fase <strong>Develop</strong>: a identidade está quase pronta e o app já roda em código.",
                      "Segui o Duplo Diamante, do Design Council. Descoberta, definição e desenvolvimento estão fechados. Agora estou na <strong>entrega</strong>: relatório final, apresentação e campanha.")
fases = re.sub(r'<div class="here">Estou aqui</div>', "", fases)
fases = fases.replace('<polygon points="200,0 400,75 200,150" fill="#fff" opacity=".55"/>', "")
fases = fases.replace('<div class="st" style="color:var(--verde)">● em andamento</div>', '<div class="st" style="color:var(--verde)">✓ concluída</div>')
fases = fases.replace('<li>Benchmarking de estratégias</li><li>Solução, estrutura e telas</li><li>Identidade visual e nome</li><li>App em código + campanha</li>',
                      '<li>Benchmarking de estratégias</li><li>Solução, estrutura e telas</li><li>Identidade, nome e logo</li><li>Protótipo, negócio e campanha</li>')
fases = fases.replace('<div class="dia"><svg viewBox="0 0 400 150" preserveAspectRatio="none"><polygon points="0,75 400,0 400,150" fill="none" stroke="#1B1F3B" stroke-width="3" stroke-dasharray="10 8" vector-effect="non-scaling-stroke"/></svg></div>',
                      '<div class="here">Estou aqui</div><div class="dia"><svg viewBox="0 0 400 150" preserveAspectRatio="none"><polygon points="0,75 200,0 400,75 200,150" fill="#1B1F3B"/><polygon points="200,0 400,75 200,150" fill="#fff" opacity=".55"/></svg></div>')
fases = fases.replace('<div class="st" style="color:var(--ter)">○ próxima</div>', '<div class="st" style="color:var(--noite)">● em andamento</div>')
fases = fases.replace('<h3>Deliver</h3><div class="when">nov → banca</div>', '<h3>Deliver</h3><div class="when">nov</div>')
fases = fases.replace('<ul class="b" style="--c:var(--linha)"><li>Testes com designers</li><li>Ajustes e conteúdo final</li><li>Lançamento e banca</li></ul>',
                      '<ul class="b" style="--c:var(--noite)"><li>Relatório final</li><li>Apresentação em 27/11</li><li>Peças da campanha</li></ul>')
fases = fases.replace("ago – set", "ago – set").replace(foot("Visão geral"), foot("Visão geral"))
slides.append(fases)

# ---------------------------------------------------------------- 01 pesquisa
slides.append(V1(3).replace("Tema, recorte, dados de mercado e pesquisa de campo. É a base que sustenta a pergunta projetual.",
                            "Pesquisa exploratória, recorte de tema e de público, dados de mercado e pesquisa de campo. É a base que sustenta a pergunta projetual."))

slides.append(f'''<section class="s riso">
  <div class="withpanel mid">
    {title("Ponto de", "partida")}
    <div class="kicker">Questionamento inicial · agosto</div>
    <p class="q">“De que forma o uso de agentes de código pode apoiar <strong>designers-empreendedores</strong> na ampliação do seu campo de atuação empresarial para <strong>áreas de negócio</strong> nas quais não possuem expertise (como viabilidade de mercado e produção)?”</p>
    <p style="margin-top:50px;max-width:1000px">Foi a pergunta que abriu a pesquisa exploratória. Na fase de definição, o designer-empreendedor e as áreas de negócio saíram, e a tecnologia ganhou nome: <strong>IA de código</strong>.</p>
  </div>
  <div class="panel w420"><svg viewBox="0 0 420 1080"><rect x="90" y="300" width="240" height="160" fill="none" stroke="#fff" stroke-width="12"/><rect x="40" y="460" width="340" height="26" fill="#fff"/><circle cx="330" cy="140" r="40" fill="#fff"/><circle cx="420" cy="930" r="220" fill="#fff"/></svg></div>
  {foot(P1)}
</section>''')

slides.append(f'''<section class="s riso">
  {title("Objetivos", "da pesquisa")}
  <div class="mid"><div class="row" style="gap:80px">
    <div class="col"><div class="kicker">Fase 1 · entender</div>{bullets([
        "Mapear como a IA generativa vem sendo estudada no <strong>processo de design</strong> e na ampliação de competências de designers e desenvolvedores.",
        "Investigar <strong>frameworks de colaboração humano-IA</strong> aplicáveis a um designer atuando fora do seu domínio.",
        "Levantar <strong>riscos e perspectivas críticas</strong> para orientar um uso responsável da IA."], 27, "riso")}</div>
    <div class="col"><div class="kicker">Fase 2 · fazer</div>{bullets([
        "Conduzir a pesquisa de mercado e de viabilidade <strong>com apoio de IA</strong>, documentando o processo.",
        "Construir o artefato com <strong>ferramentas de IA de código</strong>.",
        "Avaliar criticamente <strong>onde a IA ajudou, onde falhou</strong> e que validação humana continuou necessária."], 27, "riso")}</div>
  </div></div>
  {foot(P1)}
</section>''')

enfoques = [
    ("Primeiro enfoque", "Princípios de design para IA generativa",
     ["Design responsável", "Para a variabilidade generativa", "Para modelos mentais", "Para cocriação", "Para confiança e dependência apropriadas", "Para a imperfeição"],
     "A solução precisa atender a esses seis princípios.", "Weisz et al., CHI 2024"),
    ("Segundo enfoque", "Colaboração humano-IA",
     ["Três níveis: <strong>assistência passiva</strong>, cocriação interativa e colaboração proativa",
      "Sistema GSM (DALL-E + robótica): dar ao humano o controle da <strong>autonomia da IA</strong> aumenta a flexibilidade criativa sem perda de autoria"],
     "Há frameworks consolidados, mas nenhum focado no designer usando IA para executar.", "ACM, 2023"),
    ("Terceiro enfoque", "Riscos e perspectivas críticas",
     ["<strong>Deskilling:</strong> erosão de competências quando a execução é delegada à IA",
      "<strong>Cognitive offloading:</strong> transferir também o julgamento, e não só a execução",
      "<strong>Fixação de design:</strong> polir o resultado gerado em vez de entender o problema"],
     "Pesquisas de 2024 a 2026 já documentam esses riscos.", "Ironies of AI-Assisted Design"),
]
slides.append(f'''<section class="s riso">
  {title("Pesquisa", "exploratória")}
  <div class="mid"><div class="row" style="gap:28px">
  {"".join(f'<div class="col card"><span class="tag">{k}</span><h3 style="font-size:32px;margin-bottom:18px">{h}</h3>{bullets(it, 21)}<p class="small" style="margin-top:14px;color:var(--sec)">{n}</p><p class="small" style="margin-top:10px">{f}</p></div>' for k, h, it, n, f in enfoques)}
  </div></div>
  {foot(P1)}
</section>''')

slides.append(f'''<section class="s riso">
  {title("Recorte", "de tema")}
  <div class="mid">
  <p class="lead" style="max-width:1560px;margin-bottom:60px">As IAs abrem um horizonte de oportunidades e, ao mesmo tempo, assustam justamente pelo que as torna inovadoras. Como na Revolução Industrial, o mercado já está se adaptando. Cabe às pessoas encontrar o caminho para se manterem atualizadas.</p>
  <div class="row" style="gap:60px">
    <div class="col"><div class="kicker">O mercado já adotou</div><p><strong>88%</strong> das organizações usam IA em ao menos uma função. O uso de IA generativa saltou de <strong>33% para 72%</strong> entre 2024 e 2025.</p><p class="small" style="margin-top:12px">McKinsey, 2025</p></div>
    <div class="col"><div class="kicker">Quem sabe menos ganha mais</div><p>Com o GitHub Copilot, tarefas saem <strong>55% mais rápido</strong>. Iniciantes ganham 52% de produtividade; os mais experientes, 40%. A IA abre espaço para quem quer atuar <strong>fora da própria área</strong>.</p><p class="small" style="margin-top:12px">GitHub, 2022</p></div>
    <div class="col"><div class="kicker">O paradoxo</div><p><strong>95%</strong> dos pilotos corporativos de IA generativa não geram impacto financeiro. O que falta é <strong>integrar as ferramentas ao trabalho</strong> de forma estruturada.</p><p class="small" style="margin-top:12px">MIT, 2025</p></div>
  </div>
  </div>
  {foot(P1)}
</section>''')

slides.append(stats("riso", "Justificativa", "do recorte", "Desenvolvedores com IA de código", [
    ("88%", "se sentiram mais produtivos.", "GitHub Research 2022"),
    ("77%", "gastam menos tempo buscando informação.", "GitHub Blog"),
    ("87%", "relatam menos esforço mental em tarefas repetitivas.", "GitHub Blog"),
    ("88%", "de aumento de produtividade em tarefas repetitivas.", "Menlo Ventures"),
    ("55%", "mais agilidade para completar uma tarefa de código com o GitHub Copilot.", "Microsoft")], P1))
slides.append(stats("riso", "Justificativa", "do recorte", "Empresas e mercado", [
    ("88%", "das empresas globais já adotam IA em ao menos uma função de negócio.", "McKinsey 2025"),
    ("40%", "dos projetos de IA agêntica correm risco de cancelamento até 2027, por falhas de integração e custo.", "Gartner 2025"),
    ("80%", "dos usuários de ferramentas low-code estarão fora da área técnica de TI em 2026.", "Gartner 2026"),
    ("95%", "dos testes corporativos não geram valor por falta de adaptação ao fluxo de trabalho.", "MIT 2025"),
    ("29%", "dos desenvolvedores confiam totalmente no código gerado por IA: a validação humana continua.", "Uvik 2026")], P1))

perfil = [("Idade", "Sem recorte fixo: do início de carreira a gestores e fundadores. O que define o público é a posição, e não a idade."),
          ("Formação", "Superior em design (gráfico, digital ou UX/UI) ou áreas próximas de produto e tecnologia. Inclui gestão em agências, estúdios e startups."),
          ("Atuação", "Design digital, gráfico, product design e áreas próximas. Como independente, em time interno ou à frente de uma operação."),
          ("Posicionamento", "Domina o design, mas quer <strong>ampliar a atuação</strong> para o que excede a sua formação, usando a IA de código como apoio.")]
slides.append(f'''<section class="s riso">
  {title("Recorte", "de público")}
  <div class="mid"><div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
  {"".join(f'<div class="card" style="padding:30px 36px"><span class="tag">{k}</span><p style="font-size:25px">{t}</p></div>' for k, t in perfil)}
  </div></div>
  {foot(P1)}
</section>''')
slides.append(f'''<section class="s riso">
  <div class="withpanel mid">
    {title("Relação com IA", "e comunicação")}
    <div class="kicker">Relação com IA</div>
    <p>Já usa ou está começando a usar IA no trabalho e quer aplicá-la de forma <strong>mais estruturada</strong>. Não é um público que precisa ser convencido a experimentar: é um público que já experimenta. O problema deixa de ser convencer e passa a ser <strong>organizar</strong>.</p>
    <div class="kicker" style="margin-top:56px">Comunicação</div>
    <p><strong>Simples e didática</strong>, sem linguagem técnica demais. Traduz conceitos em benefícios concretos, usa analogias e exemplos práticos e guia a curva de aprendizado. Gera confiança e curiosidade a partir de <strong>resultados visíveis</strong>.</p>
  </div>
  <div class="panel w420"><svg viewBox="0 0 420 1080"><circle cx="210" cy="420" r="120" fill="none" stroke="#fff" stroke-width="12"/><circle cx="210" cy="660" r="120" fill="none" stroke="#fff" stroke-width="12"/><rect x="40" y="60" width="60" height="60" fill="#fff"/><rect x="320" y="960" width="60" height="60" fill="#fff"/></svg></div>
  {foot(P1)}
</section>''')
slides.append(stats("riso", "Justificativa", "do público", "Designers e criadores", [
    ("65%", "dos designers já assumem mais responsabilidades de produto e engenharia.", "Designer Fund 2026"),
    ("91%", "dos designers usam IA toda semana em tarefas de design, contra 54% em 2025.", "Designer Fund 2026"),
    ("50%", "dos designers já enviaram código gerado por IA direto para produção.", "Designer Fund 2026"),
    ("87%", "dos criadores dizem que a IA generativa acelerou o crescimento do próprio negócio.", "Adobe 2026"),
    ("41%", "dos líderes de pequenas e médias empresas já pilotam agentes de IA em decisões.", "Upwork 2026")], P1))
slides.append(V1(6))

# ---------------------------------------------------------------- 02 definição
slides.append(V1(7).replace("Benchmarking de marca, DNA do projeto e benchmarking de estratégias. São os critérios",
                            "Pergunta projetual, benchmarking de marca, DNA do projeto e benchmarking de estratégias. São os critérios"))
slides.append(f'''<section class="s rosa">
  <div class="withpanel mid">
    {title("Pergunta", "projetual")}
    <p class="q" style="font-size:50px;line-height:1.25">Como posso <strong>potencializar as competências</strong> do designer e <strong>ampliar o alcance</strong> de sua atuação incorporando, por meio da <strong>IA de código</strong>, expertises técnicas que <strong>excedem sua formação</strong>?</p>
  </div>
  <div class="panel w420"><svg viewBox="0 0 420 1080"><circle cx="330" cy="140" r="56" fill="#fff"/><circle cx="170" cy="560" r="120" fill="#fff"/><circle cx="420" cy="930" r="250" fill="#fff"/><circle cx="60" cy="860" r="22" fill="#fff"/><circle cx="260" cy="330" r="30" fill="#fff"/></svg></div>
  {foot(P2)}
</section>''')
slides.append(f'''<section class="s rosa">
  {title("Como a pergunta", "mudou")}
  <div class="row" style="gap:36px">
    <div class="passo"><div class="k">AGO · QUESTIONAMENTO INICIAL</div><p>“De que forma o uso de IA generativa pode apoiar <strong>designers-empreendedores</strong> na ampliação do seu campo de atuação empresarial para <strong>áreas de negócio</strong> nas quais não possuem expertise?”</p></div>
    <div class="passo"><div class="k">SET · VERSÃO INTERMEDIÁRIA</div><p>“Como a <strong>IA agêntica</strong> pode apoiar designers a atuarem em campos empresariais fora do seu domínio técnico?”</p></div>
    <div class="passo final"><div class="k">OUT · PERGUNTA FECHADA</div><p>“Como posso potencializar as competências do designer e ampliar o alcance de sua atuação incorporando, por meio da <strong>IA de código</strong>, expertises técnicas que excedem sua formação?”</p></div>
  </div>
  <div class="kicker" style="margin-top:70px">O que mudou</div>
  <div class="row" style="gap:36px">
    <div class="col"><h3>Saiu o designer-empreendedor</h3><p style="font-size:23px">O recorte não é abrir um negócio, e sim ampliar uma atuação que já existe.</p></div>
    <div class="col"><h3>O limite é técnico</h3><p style="font-size:23px">“Áreas de negócio” virou “expertises técnicas”: 50% dos designers já põem código de IA em produção.</p></div>
    <div class="col"><h3>IA de código</h3><p style="font-size:23px">“IA generativa” e “IA agêntica” eram amplas demais. O código é o limite que o designer está ultrapassando.</p></div>
  </div>
  {foot(P2)}
</section>''')

marcas = [
    ("Duolingo", "ACESSIBILIDADE", ["GAMIFICAÇÃO", "PERSONALIZAÇÃO", "IRREVERÊNCIA", "COMUNIDADE"],
     ["lúdica", "viciante", "adaptativa", "inteligente", "ousada", "sarcástica", "coletiva", "competitiva"], "Carismático e caótico",
     "O maior app de educação do mundo transformou uma missão séria numa experiência <strong>gamificada</strong>, viciante e com marca muito forte. É referência em três frentes: <strong>engajamento</strong> (gamificação, sequências, personalização por IA), comunicação de marca ousada e <strong>retenção</strong> em escala."),
    ("PAAR", "INCORPORAÇÃO", ["ESTRUTURA", "ESTABILIDADE", "REPRESENTAÇÃO", "MÉRITO"],
     ["especializada", "integrada", "previsível", "duradoura", "orgulhosa", "nacional", "exigente", "seletiva"], "Disciplinado e patriótico",
     "O Programa de Atletas de Alto Rendimento incorpora atletas às Forças Armadas com salário, centro de treinamento e equipe técnica. Em Paris 2024, os atletas do programa trouxeram <strong>11 das 20 medalhas</strong> do Brasil. É a tese deste projeto em forma de instituição: <strong>incorporar as expertises</strong> que o indivíduo não domina e liberá-lo para o que só ele faz."),
    ("Patreon", "INDEPENDÊNCIA", ["AUTORIA", "PROXIMIDADE", "SUSTENTAÇÃO", "PERTENCIMENTO"],
     ["livre", "autoral", "direta", "humana", "recorrente", "confiável", "exclusiva", "íntima"], "Íntimo e encorajador",
     "A plataforma de financiamento recorrente liga o criador direto ao seu público. Resolve o mesmo problema deste projeto em outro contexto: dar a um profissional autônomo a estrutura para <strong>operar sozinho</strong> o que antes exigia uma indústria. A plataforma assume pagamento e gestão; o criador fica com o seu <strong>ofício</strong>."),
    ("PUCPR", "QUESTIONAMENTO", ["INOVAÇÃO", "EXCELÊNCIA", "HUMANISMO", "CONEXÃO"],
     ["empreendedora", "ágil", "criteriosa", "reconhecida", "marista", "comunitária", "global", "profissional"], "Caloroso e encorajador",
     "A marca é voltada “para quem quer criar o futuro” e promete <strong>“questionamos o conhecido”</strong>: a postura do designer que vai além da sua formação. O discurso vira prática em metodologias ativas, no ecossistema Hotmilk e na formação humanística. E é onde este trabalho é feito, o que torna a análise <strong>próxima e verificável</strong>."),
]
for nome, centro, pil, ver, pers, texto in marcas:
    slides.append(f'''<section class="s rosa" style="padding-right:60px">
  <div style="display:flex;gap:40px;align-items:center;height:100%">
    <div style="width:800px;flex:none">
      {title("Benchmarking", nome)}
      <p style="font-size:26px">{texto}</p>
      <div class="kicker" style="margin-top:40px">Personalidade</div>
      <p style="font:600 34px/1.2 'Instrument Sans';color:var(--texto)">{pers}</p>
    </div>
    <div style="flex:1;display:flex;justify-content:center">{roda(centro, pil, ver, ROSA)}</div>
  </div>
  {foot(P2 + " · Benchmarking de marca")}
</section>''')

quadro = [("Duolingo", "Acessibilidade", "Gamificação, personalização, irreverência, comunidade", "Carismático, caótico"),
          ("PAAR", "Incorporação", "Estrutura, estabilidade, representação, mérito", "Disciplinado, patriótico"),
          ("Patreon", "Independência", "Autoria, proximidade, sustentação, pertencimento", "Íntimo, encorajador"),
          ("PUCPR", "Questionamento", "Inovação, excelência, humanismo, conexão", "Caloroso, encorajador")]
slides.append(f'''<section class="s rosa">
  {title("Benchmarking", "síntese")}
  <div class="mid">
  <table class="tb bm"><tr><th style="width:16%">Referência</th><th style="width:20%">Valor</th><th style="width:40%">Diretrizes</th><th>Personalidade</th></tr>
  {"".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>" for a, b, c, d in quadro)}</table>
  <p class="lead" style="margin-top:46px">Das quatro rodas saiu uma só: o <strong>DNA do projeto</strong>.</p>
  </div>
  {foot(P2)}
</section>''')

dna = V1(9).replace('<svg id="wheel" width="860" height="860" viewBox="-430 -430 860 860"></svg>',
                    roda("POTENCIALIZAÇÃO", ["HOLÍSTICA", "ACESSIBILIDADE", "INOVAÇÃO", "CONEXÃO"],
                         ["sistêmica", "prática", "personalizada", "progressiva", "gamificado", "ousado", "profissional", "coletividade"], ROSA, 860))
dna = dna.replace('<div class="kicker">Proposta de valor</div>', '<div class="kicker">Encorajador e didático</div>')
slides.append(dna)
slides.append(V1(10))


def caso(nome, valor, b1, c1, b2, c2):
    return f'''<section class="s rosa">
  {title("Benchmarking", "de estratégias")}
  <div class="valor"><small>Valor atingido</small><b>{valor}</b></div>
  <div class="kicker" style="margin-top:-10px">{nome}</div>
  <div class="mid"><div class="row case" style="gap:80px">
    <div class="col"><h4>{b1}</h4>{c1}</div>
    <div class="col"><h4>{b2}</h4>{c2}</div>
  </div></div>
  {foot(P2 + " · Benchmarking de estratégias")}
</section>'''


ol = lambda xs: "<ol>" + "".join(f"<li>{x}</li>" for x in xs) + "</ol>"
slides.append(caso("PAAR · Programa de Atletas de Alto Rendimento", "POTENCIALIZAÇÃO", "Como funciona", ol([
    "Cada Força abre edital público de alistamento voluntário.",
    "A seleção converte o histórico esportivo em pontuação: medalhas viram nota.",
    "Aprovado, o atleta recebe soldo, 13º, férias e assistência médica, com nutricionista e fisioterapeuta.",
    "Treina nas instalações militares, com equipe multidisciplinar.",
    "Em troca, representa as Forças Armadas e o Brasil. O vínculo dura até oito anos."]),
    "Por que é forte", "<p>O programa não premia o resultado: <strong>financia a condição</strong> para o resultado. A bolsa por desempenho chega depois do pódio; o soldo chega antes e compra o que de fato trava, o <strong>tempo integral de prática</strong>. E o custo é baixo, porque a estrutura cara já existia: pista, piscina, médico. O atleta é realocado para dentro de algo que já estava de pé.</p>"))
slides.append(caso("PAAR · Programa de Atletas de Alto Rendimento", "POTENCIALIZAÇÃO", "Limite",
    "<p>A porta de entrada é o <strong>resultado passado</strong>: o programa sustenta quem já performa, e não quem está começando. É um acelerador de elite, e não uma rampa de acesso. Some-se o vínculo temporário e a hierarquia militar: parte da autonomia sobre a própria trajetória fica com a instituição.</p>",
    "Transferência", "<p>Adoto o princípio de que <strong>a estrutura assume tudo</strong> que não é a competência central do designer. E recuso o critério de entrada por resultado prévio: aqui a incorporação precisa valer para quem <strong>ainda não tem portfólio técnico</strong>. Senão, o mecanismo entrega POTENCIALIZAÇÃO ao custo de ACESSIBILIDADE.</p>"))
slides.append(caso("PUCPR · Eixo humanístico + Projeto Comunitário", "HOLÍSTICA", "Como funciona", ol([
    "Cultura Religiosa, Ética e Filosofia entram na grade de todos os cursos, não como eletiva.",
    "Essas disciplinas ficam nos períodos iniciais, antes da especialização.",
    "Soma-se o Projeto Comunitário, com coordenação própria, separada da escola do aluno.",
    "Todo estudante cumpre 30 horas de voluntariado em instituições parceiras.",
    "O conjunto é a formação “Gente Boa”, apresentada como um diploma que complementa o do curso."]),
    "Por que é forte", "<p>A visão do todo não é conteúdo extra: é <strong>obrigação estrutural</strong>. O aluno é colocado diante de alguém que não fala a língua do seu curso e tem de responder a ele. E, ao nomear o conjunto e apresentá-lo como credencial, a instituição transforma a “matéria obrigatória chata” em parte da <strong>identidade</strong> de quem se forma.</p>"))
slides.append(caso("PUCPR · Eixo humanístico + Projeto Comunitário", "HOLÍSTICA", "Limite",
    "<p>O eixo fica nos períodos iniciais, quando o aluno ainda <strong>não tem repertório técnico</strong> para ligar a ética à sua prática: a conexão é oferecida antes de existir a peça a conectar. Na minha leitura, o Projeto Comunitário <strong>mede horas</strong>, e não integração. E a obrigatoriedade sem escolha é o mais fácil de esvaziar: vira taxa a pagar.</p>",
    "Transferência", "<p>O projeto adota a obrigação de <strong>responder a alguém de fora do design</strong>, mas troca a métrica: em vez de horas cumpridas, cada entrega feita com IA de código passa por um interlocutor do domínio invadido (dev, analista, gestor). E essa camada não fica no começo, porque aqui ela só faz sentido quando já existe <strong>artefato na mão</strong>.</p>"))
slides.append(caso("OMS · Checklist cirúrgico de segurança", "HOLÍSTICA", "Como funciona", ol([
    "São 19 itens, desenhados para melhorar a comunicação da equipe, e não a técnica cirúrgica.",
    "O fluxo tem três paradas: antes da anestesia, antes da incisão e antes de o paciente sair da sala.",
    "Cada item é dito em voz alta e respondido por quem responde por ele: cirurgião, anestesista, enfermagem.",
    "É uma folha curta, e não um manual: cabe no tempo real do procedimento.",
    "Antes da incisão, cada membro da equipe se apresenta por nome e função."]),
    "Por que é forte", "<p>O todo não precisa ser aprendido: precisa estar <strong>presente no instante da decisão</strong>. Um ritual curto, obrigatório e falado faz mais do que um treinamento sobre pensamento sistêmico, porque age quando a informação ainda pode mudar a ação. Falar em voz alta transforma o saber de cada especialista em <strong>saber compartilhado</strong>.</p>"))

# ---------------------------------------------------------------- 03 a 06: checkpoint v2
NOVO = {"01 · Referências visuais": "03 · Referências visuais", "02 · Solução": "04 · Solução", "03 · Negócio": "05 · Negócio", "04 · Campanha": "06 · Campanha"}


def renumera(html, divnum=None):
    html = re.sub(r"(0[1-4]) · (Referências visuais|Solução|Negócio|Campanha)", lambda m: NOVO[m.group(0)], html)
    if divnum:
        html = re.sub(r'<div class="num">0\d</div>', f'<div class="num">{divnum}</div>', html)
    return html


DIVS = {2: "03", 10: "04", 21: "05", 25: "06"}
logo_slide = f'''<section class="s limao">
  {title("Nome", "e logo")}
  <div class="row" style="gap:80px">
    <div style="width:620px;flex:none">
      <ul class="b" style="--c:var(--noite)">
        <li><strong>Base</strong> é fundamento: a base de design que o designer já tem, mais a base técnica que ele ganha.</li>
        <li><strong>8</strong> são as oito vertentes do DNA.</li>
        <li><strong>Base 8</strong> é o sistema octal da computação. E 8 em binário é 1000: “o oito que vale mil”.</li>
      </ul>
      <p class="small" style="margin-top:24px">Nome fechado em 23/10. Logo oficial em 24/11: “BASE” em Instrument Sans Bold, azul-noite, com a bola 8 colorida.</p>
    </div>
    <div style="flex:1">
      <div class="shot" style="border-radius:8px;padding:70px 80px;background:#fff"><img src="img/logo/BASE8_logo_principal@2x.png" style="width:100%"></div>
      <div class="row" style="gap:24px;margin-top:24px">
        <div class="col"><div class="shot" style="border-radius:8px;height:230px;background:#fff;display:grid;place-items:center;padding:20px"><img src="img/rascunho-logo-crop.jpg" style="max-width:100%;max-height:190px;width:auto"></div><div class="cap">Rascunho: letras feitas de objetos</div></div>
        <div class="col"><div class="shot" style="border-radius:8px;height:230px;background:#fff;display:grid;place-items:center;padding:20px"><img src="img/logo/BASE8_logo_construcao.png" style="max-width:100%;max-height:190px;width:auto"></div><div class="cap">Construção: grid de 34 × 9 módulos</div></div>
      </div>
    </div>
  </div>
  {foot("03 · Referências visuais")}
</section>'''

for n in range(2, 30):
    sl = renumera(V2(n), DIVS.get(n))
    if n == 6:
        sl = logo_slide
    if n == 9:
        sl = sl.replace("28 pranchas geradas por script no Illustrator. Preenchidas: nome, cores, aplicação, contraste, áreas e tipografia. As demais aguardam a <strong>logo final</strong>.",
                        "32 pranchas geradas por script no Illustrator: nome, cores, aplicação, contraste, áreas, tipografia e a <strong>logo oficial</strong>.")
    if 21 <= n <= 24:  # negócio passa a azul-noite (rosa ficou com a definição)
        sl = sl.replace('class="s rosa', 'class="s noite').replace('class="s div rosa', 'class="s div noite').replace("var(--rosa)", "var(--noite)")
        sl = sl.replace('fill="#1B1F3B"', 'fill="#FF48B0"')
    slides.append(sl)

ref = V1(24).replace("<li><strong>Riscos.</strong>", "<li><strong>Princípios e riscos.</strong> Princípios de design para IA generativa (Weisz et al.); sistema GSM (ACM, 2023). <strong>Riscos.</strong>")
ref = ref.replace("<li><strong>Designers.</strong> Designer Fund. Pesquisa sobre designers e IA. 2026.</li>",
                  "<li><strong>Designers e criadores.</strong> Designer Fund, 2026. · Adobe, 2026. · Upwork, 2026. · GitHub Research, 2022. · Menlo Ventures. · Microsoft.</li>")
ref = ref.replace("Benchmarking de marca.</strong> Duolingo;", "Benchmarking de marca.</strong> Duolingo;").replace(
    "Lista completa no cap. 6 do relatório.", "Lista completa no cap. 6 do relatório.")
slides.append(ref)
slides.append(V2(30))

tail = src2[src2.rfind("</section>") + len("</section>"):]
tail = re.sub(r"<script>\s*// roda do DNA.*?</script>", "", tail, flags=re.S)  # a roda agora é SVG estático
out = os.path.join(HERE, "apresentacao-processo.html")
open(out, "w", encoding="utf-8").write(head + "\n\n" + "\n\n".join(slides) + tail)
print(len(slides), "slides ->", out)
