"""Capítulo 8 — Identidade visual."""
from blocos import bruto, destaque, divisor, figura, texto

CORES = [
    # (fundo, cor do texto, nome de marca, cor e hex, papel)
    ("#FFFFFF", "#1B1F3B", "Possibilidades", "Branco · #FFFFFF", "Fundo das telas"),
    ("#1B1F3B", "#FFFFFF", "Descoberta", "Azul-noite · #1B1F3B", "Cor escura, ícones e logo"),
    ("#12A180", "#FFFFFF", "Criatividade", "Verde-água · #12A180", "Home, botão principal e sucesso"),
    ("#F5EE4A", "#1B1F3B", "Adaptação", "Limão · #F5EE4A", "Trilha e proficiência"),
    ("#FF48B0", "#FFFFFF", "Ousadia", "Rosa flúor · #FF48B0", "Atividades práticas"),
    ("#0B8FE0", "#FFFFFF", "Conectividade", "Azul riso · #0B8FE0", "Comunidade e cursos"),
    ("#F1F2F6", "#1B1F3B", "Técnica", "Cinza gelo · #F1F2F6", "Áreas e painéis"),
    ("#5A5E74", "#FFFFFF", "Refinamento", "Cinza frio · #5A5E74", "Legendas e apoio"),
]
_sw = "".join(
    f'<div class="sw" style="background:{f};color:{c};border:1px solid var(--linha);height:250px">'
    f'<em>{papel}</em><div><b>{nome}</b><br><small>{hexa}</small></div></div>'
    for f, c, nome, hexa, papel in CORES)

BB = [("bb-01", "Capa"), ("bb-09", "Cores"), ("bb-10", "Aplicação das cores"),
      ("bb-11", "Contraste e acessibilidade"), ("bb-12", "Áreas e cores"), ("bb-13", "Tipografia")]
_bb = "".join(f'<div><div class="shot fig"><img src="img/v2/{i}.jpg"></div><div class="cap">{c}</div></div>' for i, c in BB)

PAGINAS = [
    divisor("08", "Identidade", "visual",
            "Do polvo desenhado à mão à logo oficial do BASE8: paleta, tipografia, nome, logo, interface e brandbook.",
            "limao"),

    figura("Ponto de partida:", "o polvo", "rel/fig02.png",
           texto="Desenhei uma logo e um mascote, um polvo de óculos, e entreguei <strong>o mesmo briefing a duas ferramentas</strong>, "
                 "Claude Code e Codex, para reconstruí-los com rigor geométrico. O Codex foi mais fiel ao desenho; o Claude, mais claro no sistema.",
           legenda="Logo original e reconstruções da primeira rodada (Claude Code e Codex).", altura=560),

    figura("Quatro rodadas,", "duas versões", "rel/fig09.png",
           texto="A versão mais regrada ficou dura, e só a volta ao meu vetor resolveu. "
                 "<strong>O rigor geométrico não substitui o olhar do designer.</strong>",
           legenda="Quarta rodada: versão do autor, versão A (fiel corrigida) e versão B (proposta).", altura=560),

    destaque("Mudança de rumo · outubro de 2026", "A plataforma não tem personagem.",
             "O pet deixava o produto infantil, e a interface de um produto profissional funciona melhor sem o polvo. "
             "Personagens podem aparecer na comunicação, mas não nas telas."),

    bruto('''<section class="s {COR}">
  <h1 class="t" style="margin-bottom:26px"><span>Painel semântico</span><b>e objetos</b></h1>
  <p style="font-size:24px;max-width:1560px;margin-bottom:24px">Cor saturada sobre branco, acúmulo de objetos e gesto humano. Uma ferramenta profissional com cara de objeto querido: <strong>o risógrafo deu origem à paleta.</strong></p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
    <div><div class="figbox" style="height:560px"><img src="img/rel/fig13.jpg"></div><div class="cap">Painel semântico (imagens de terceiros reunidas como referência).</div></div>
    <div><div class="figbox" style="height:560px"><img src="img/rel/fig14.jpg"></div><div class="cap">Objetos de referência: risógrafo, Braun ET66, OP-1, Game Boy, LEGO e outros.</div></div>
  </div>
  {RODAPE}
</section>'''),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t"><span>Paleta de</span><b>risografia</b></h1>
  <p class="lead" style="max-width:1500px;margin-bottom:34px">Tintas da risografia mais um verde-água, sobre branco puro. Cada cor tem um nome de marca e um papel fixo: <strong>uma área, uma cor.</strong></p>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0">{_sw}</div>
  <p class="small nota">Texto branco sobre cor viva só em tamanho grande, e azul-noite sobre o limão. O verde-água foi escurecido para #12A180 e chegou a 3,3:1 com o branco.</p>
  {{RODAPE}}
</section>'''),

    texto("Tipografia", "e nome",
          lead="<strong>Instrument Sans</strong> nos títulos, no nome e nos números; <strong>Figtree</strong> no texto corrido. Duas famílias de uso livre.",
          kicker="BASE8, lido “base oito”",
          bullets=["<strong>Base:</strong> o fundamento de design que o designer já tem e a base técnica que ganha.",
                   "<strong>8:</strong> as oito vertentes do DNA do projeto.",
                   "<strong>Base 8:</strong> o sistema octal, usado na computação.",
                   "Fechado em 23 de outubro de 2026, com busca inicial de marca sem conflito."],
          img="v2/bb-13.jpg", legenda="Prancha de tipografia do brandbook.", img_larg=800),

    figura("Logo", "oficial", "rel/fig15.jpg",
           texto="“BASE” em Instrument Sans Bold e uma bola 8 colorida, sobre um grid em que <strong>u é a espessura do traço</strong>: "
                 "34u × 9u, proteção de 3u e mínimo de 96 px. A versão reduzida é a bola 8 sozinha.",
           legenda="Versão principal e construção sobre o grid (24 nov. 2026).", altura=580),

    figura("Logo", "ilustrada", "rel/fig16.jpg",
           texto="Cada letra é montada com objetos de trabalho e de tecnologia: rascunho a lápis, pintura no Procreate e vetor feito com IA de código. "
                 "Hoje é material de divulgação: <strong>os 31 objetos viraram padrões e ícones.</strong>",
           legenda="Rascunho, pintura e vetor final (23 nov. 2026).", altura=580),

    texto("Direção da", "interface",
          lead="Uma direção <strong>editorial sóbria</strong>: a primeira versão das telas ficou simples e divertida demais para um público profissional.",
          bullets=["A tipografia carrega a hierarquia.",
                   "Linhas finas separam o conteúdo, no lugar de caixas.",
                   "Fundo branco; a cor é acento.",
                   "Gamificação sóbria: números grandes e finos, rótulos em caixa alta.",
                   "Ilustração em caracteres coloridos (arte ASCII), gerada por código.",
                   "Tema escuro com os mesmos papéis de cor."],
          img="v2/w-inicio.jpg", legenda="Home no computador.", img_larg=860),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t" style="margin-bottom:26px"><span>Brandbook de</span><b>32 pranchas</b></h1>
  <p style="font-size:24px;max-width:1560px;margin-bottom:26px">Essência, tom de voz, cores, contraste, tipografia, logo, ícones, ilustração, fotografia e aplicações. <strong>Gerado por scripts no Illustrator</strong>: quando uma regra muda, o documento inteiro se atualiza.</p>
  <div class="g3" style="max-width:1320px">{_bb}</div>
  {{RODAPE}}
</section>'''),
]
