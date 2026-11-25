"""Capítulo 5: definição do projeto (pergunta projetual e DNA de marca)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import roda_dna  # noqa: E402
from blocos import divisor, destaque, tabela, cards, colunas, bruto

PAGINAS = [
    divisor("05", "Pergunta projetual", "e DNA de marca",
            "Fechamento da fase Define do Duplo Diamante: a pesquisa converge em uma pergunta, "
            "e a pergunta ganha um DNA de marca que orienta cada decisão.", "limao"),

    destaque("Pergunta projetual",
             "Como posso potencializar as competências do designer e ampliar o alcance de sua atuação "
             "incorporando, por meio da IA de código, expertises técnicas que excedem sua formação?",
             "Potencializar, e não substituir. A IA de código é o meio, e não quem age. "
             "O que se incorpora é expertise técnica, e não conteúdo."),

    tabela("Benchmarking", "de DNA de marca",
           ["Referência", "Valor", "Diretrizes", "Personalidade"],
           [["Duolingo", "Acessibilidade", "Gamificação, personalização, irreverência, comunidade", "Otimista, acolhedora"],
            ["PAAR", "Incorporação", "Representação, mérito, estabilidade, estrutura", "Disciplinada, patriótica"],
            ["Patreon", "Independência", "Autoria, proximidade, sustentação, pertencimento", "Íntima, encorajadora"],
            ["PUCPR", "Questionamento", "Conexão, humanismo, excelência, inovação", "Calorosa, encorajadora"]],
           lead="Analisei quatro marcas, a distâncias diferentes do problema, no mesmo modelo: "
                "<strong>valor, quatro diretrizes, oito direcionamentos e personalidade</strong>.",
           nota="Recusas registradas: a entrada pelo resultado passado (PAAR) e a assinatura recorrente (Patreon)."),

    destaque("Valor central · POTENCIALIZAÇÃO",
             "Fazer o designer entregar, com qualidade profissional, o que a sua formação sozinha não daria conta.",
             "Não é substituir o designer nem torná-lo programador. A competência central continua dele; "
             "o que muda é o entorno. Pergunta de mecanismo: como fazer a pessoa realizar algo que sozinha não conseguiria?"),

    bruto(f'''<section class="s {{COR}}">
  <div style="display:flex;gap:80px;align-items:center;height:100%">
    <div style="width:720px;flex:none">{roda_dna.svg()}</div>
    <div style="flex:1">
      <h1 class="t"><span>Quatro pilares,</span><b>oito vertentes</b></h1>
      <p class="lead" style="margin-bottom:30px">O DNA é uma <strong>síntese</strong> das quatro referências, e não uma escolha entre elas.</p>
      <ul class="b">
        <li style="--c:#0B8FE0;font-size:23px"><strong>Holística:</strong> conduzir um projeto inteiro em outra área, vendo o todo.</li>
        <li style="--c:#12A180;font-size:23px"><strong>Acessibilidade:</strong> entrar em uma área técnica sem baixar o teto de competência.</li>
        <li style="--c:#FF48B0;font-size:23px"><strong>Conexão:</strong> tirar o designer do aprendizado solitário e ligá-lo ao mercado.</li>
        <li style="--c:#F5EE4A;font-size:23px"><strong>Inovação:</strong> resolver por um caminho que o setor não segue, e mantê-lo.</li>
      </ul>
    </div>
  </div>
  {{RODAPE}}
</section>'''),

    colunas("Personalidade:", "encorajador e didático",
            [{"kicker": "Encorajador", "texto": "O problema do designer pode ser resolvido agora, com o repertório que ele já tem. "
              "Por isso, recusei o <strong>portão de fundamentos</strong>, que exige o geral antes do específico."},
             {"kicker": "Didático", "texto": "A explicação vem junto com a entrega. Sem o “como”, o designer não consegue "
              "<strong>revisar o resultado</strong>, e a pesquisa mostrou que essa revisão é indispensável."}],
            lead="Os dois adjetivos funcionam como <strong>filtros</strong>: cada um descarta um conjunto de soluções."),
]
