"""Capítulo 11 — Plano de divulgação: a campanha "Até onde?"."""
from blocos import bruto, colunas, destaque, divisor, tabela, texto

FASES = [
    ("S-4 a S-3", "Preparação", "Perfis nas redes, página com lista de espera, manifesto e três episódios gravados, pôsteres impressos."),
    ("S-2 a S-1", "Teaser", "Pôsteres sem marca, com a pergunta e um QR; posts enigmáticos (8 = 1000)."),
    ("S1 a S2", "Lançamento", "Adesivo revela a marca; manifesto e episódios 1 e 2; metade da verba de anúncios."),
    ("S3 a S8", "Sustentação", "Um episódio por semana e bastidores; oficina na S4; episódio 8 com uma ideia do público."),
    ("S9", "Avaliação", "Resultados contra as metas, o que funcionou e a próxima temporada."),
]
_fases = "".join(f'<div class="fase"><div class="k">{k}</div><h3>{h}</h3><p>{p}</p></div>' for k, h, p in FASES)

EPISODIOS = [
    ("1", "Rabisco → site", "“…ou um site que ainda não aprendeu a rodar.”"),
    ("2", "Frase → livro", "“a próxima pode ser de código.”"),
    ("3", "Batida → música", "“era um app.” A batida vira um sequenciador web."),
    ("4", "Cor → imagem", "“mil imagens.” Pôsteres gerados por código."),
    ("5", "Foto → vídeo", "“agora ela quer.” Efeito de caracteres do BASE8."),
    ("6", "Lista → sistema", "“só faltava virar sistema.”"),
    ("7", "Ideia → software", "“você pode ser quem faz.”"),
    ("8", "Sua ideia → ∞", "Uma ideia enviada pelo público vira produto."),
]
_eps = "".join(f'<div class="ep" style="padding:24px 24px 26px"><div class="k">Ep. {n}</div><h3 style="font-size:28px">{t}</h3><p style="font-size:20px">{v}</p></div>'
               for n, t, v in EPISODIOS)

ORC = [
    ("Impressos", "R$ 260", "R$ 640", "R$ 970"),
    ("Domínio .com.br", "R$ 40", "R$ 40", "R$ 40"),
    ("Anúncios Instagram", "R$ 300", "R$ 600", "R$ 1.200"),
    ("Anúncios TikTok", "R$ 150", "R$ 300", "R$ 700"),
    ("Anúncios YouTube", "R$ 0", "R$ 300", "R$ 600"),
    ("Oficina", "R$ 0", "R$ 100", "R$ 150"),
]
_orc = ("<tr><th>Item</th><th>Enxuto</th><th>Recom.</th><th>Ampliado</th></tr>"
        + "".join("<tr>" + "".join(f"<td>{c}</td>" for c in l) + "</tr>" for l in ORC)
        + '<tr class="tot"><td>Total</td><td>R$ 750</td><td>R$ 1.980</td><td>R$ 3.660</td></tr>')
MET = [
    ("Teaser", "150 respostas a “o que você queria criar?”"),
    ("Lançamento", "30 mil visualizações nos canais de vídeo"),
    ("Fim da S8", "500 cadastros na lista de espera"),
    ("Tráfego pago", "Até R$ 4 por cadastro"),
    ("Engajamento", "Salvamentos e compartilhamentos acima das curtidas"),
    ("Oficina (S4)", "20 participantes"),
]
_met = "<tr><th>Momento</th><th>Meta inicial</th></tr>" + "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in MET)

PAGINAS = [
    divisor("11", "Plano de divulgação:", "“Até onde?”",
            "A campanha de lançamento do BASE8: conceito, fases, canais, roteiros, orçamento e metas.",
            "riso"),

    destaque("Conceito criativo", "Até onde vai a sua imaginação?",
             "Cada peça provoca no começo e vira no fim, devolvendo o protagonismo a quem cria: "
             "<span style=\"color:#fff;font-weight:600\">“a base você já tem. o resto a gente te ensina.”</span>"),

    colunas("Objetivos", "e público", [
        {"kicker": "Objetivos", "itens": [
            "Tornar o BASE8 conhecido entre estudantes e profissionais de design de todo o Brasil, pelas redes.",
            "Levar as pessoas à <strong>lista de espera</strong>, a principal medida de resultado.",
            "Recolher ideias do público e transformá-las em conteúdo."]},
        {"kicker": "Público", "itens": [
            "<strong>Centro:</strong> designers e estudantes de design com pouco contato com IA de código.",
            "<strong>Porta de entrada:</strong> criativos de áreas vizinhas, atraídos pela provocação.",
            "A comunicação amplia o alcance sem mudar o foco."]},
        {"kicker": "Símbolo", "itens": [
            "No fim de cada vídeo, o <strong>8 gira e deita</strong> e vira o sinal de infinito.",
            "A base é o ponto de partida; o alcance não tem limite.",
            "Em binário, 8 é 1000: “o oito que vale mil”."]},
    ]),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t"><span>Fases da</span><b>campanha</b></h1>
  <p class="lead" style="max-width:1500px;margin-bottom:60px">13 semanas contadas a partir do dia D. No teaser, pôsteres sem marca; no lançamento, <strong>um adesivo com o 8 deitado revela quem perguntou.</strong></p>
  <div style="display:flex;gap:30px">{_fases}</div>
  {{RODAPE}}
</section>'''),

    tabela("Canais e", "formatos", ["Canal", "Papel", "Frequência"], [
        ["Instagram", "Vitrine visual e principal canal de cadastro", "3 posts por semana e stories"],
        ["TikTok", "Alcance fora do círculo de quem já segue", "3 a 4 vídeos por semana"],
        ["YouTube", "Shorts orgânicos e anúncios em vídeo", "1 Short por semana"],
        ["LinkedIn e Behance", "Mostrar o processo a designers em atuação", "1 post por semana (opcional)"],
        ["Presencial", "Curiosidade local e prova de que a ideia vira produto", "Teaser, lançamento e S4"],
    ], lead="Cada episódio rende várias peças: o mesmo vídeo vertical vai para Reels, TikTok e Shorts, e o processo vira carrossel de bastidores.",
        nota="<strong>Tudo o que aparece nos vídeos é construído de verdade com IA de código</strong>, e os bastidores mostram esse processo."),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t" style="margin-bottom:30px"><span>Manifesto e</span><b>oito episódios</b></h1>
  <p style="font-size:24px;max-width:1560px;margin-bottom:30px">O <strong>manifesto</strong> abre no dia D: um ponto desenhado à mão vira rabisco, site, livro e música, até o 8 deitar. Depois, oito episódios de 15 a 20 s, um por semana, em quatro tempos: gancho, transformação, virada e fecho.</p>
  <div class="g4">{_eps}</div>
  <p class="small nota">Fecho dos episódios 1 a 7: “aprenda a tirar suas ideias do papel.”</p>
  {{RODAPE}}
</section>'''),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t"><span>Orçamento</span><b>e metas</b></h1>
  <p class="lead" style="max-width:1500px;margin-bottom:30px">A produção visual, a edição e a trilha são minhas: <strong>o gasto se limita a impressão, domínio e anúncios.</strong></p>
  <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:70px">
    <table class="tb num" style="--tdsz:21px">{_orc}</table>
    <table class="tb" style="--tdsz:21px">{_met}</table>
  </div>
  {{RODAPE}}
</section>'''),

    texto("Ações presenciais", "e produção",
          lead="A pergunta vai para a parede: <strong>três pôsteres A3 e um mural A2</strong>, com QR, na PUCPR e em espaços criativos, sempre com permissão.",
          bullets=["Flyers A6 e adesivos redondos com o 8 deitado.",
                   "Oficina “Até onde?” na S4: cada pessoa traz um rabisco e sai com uma página funcionando.",
                   "<strong>Produção:</strong> manifesto (34 s) e vídeo de divulgação (cerca de 1 min), montados em código, com trilha no Ableton Live.",
                   "Cartazes e story aplicados em mockups."]),
]
