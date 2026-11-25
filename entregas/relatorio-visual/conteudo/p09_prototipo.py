"""Capítulo 9 — O protótipo do BASE8."""
from blocos import bruto, celulares, divisor, tabela

WEB = [("w-inicio", "Home"), ("w-licao", "Lição"), ("w-inicio-escuro", "Tema escuro"),
       ("w-minicurso", "Criar minicurso"), ("w-moderacao", "Moderação"), ("w-landing", "Landing")]
_web = "".join(f'<div><div class="shot fig"><img src="img/v2/{i}.jpg"></div><div class="cap">{c}</div></div>' for i, c in WEB)

PAGINAS = [
    divisor("09", "O protótipo", "do BASE8",
            "Da estrutura às telas: a organização do hub, os fluxos principais, a versão para computador e o que o protótipo simula.",
            "verde"),

    tabela("Organização", "do hub", ["Área", "Telas", "Função"], [
        ["Entrada", "Entrar, cadastro, onboarding, consentimento e nivelamento", "Receber e definir o ponto de partida"],
        ["Home", "Início", "Mostrar o próximo passo e a meta do dia"],
        ["Educação", "Trilha, lição, checkpoint, praticar, cursos da comunidade e proficiência", "Ensinar, exercitar e comprovar"],
        ["Comunidade", "Feed, tag, post, novo post e perfil de pessoa", "Tirar dúvidas e trocar soluções"],
        ["Perfil", "Perfil, ranking, notificações e configurações", "Acompanhar o progresso"],
        ["Busca", "Busca, com paleta de comandos", "Achar qualquer conteúdo"],
        ["Computador", "Landing, criar minicurso e moderação", "Apresentar, publicar e moderar"],
    ], lead="<strong>31 telas de produto.</strong> No celular, uma barra inferior com quatro destinos; no computador, uma barra lateral.",
        tam=22),

    celulares("Entrada", "e Home", [("m-onboarding", "Onboarding"), ("m-nivelamento", "Nivelamento"), ("m-inicio", "Home")],
              texto="O ponto de partida vem do <strong>desempenho</strong>, e não só da autoavaliação.",
              bullets=["Onboarding com três perguntas: objetivo, área e uso de IA de código.",
                       "Consentimento por finalidade: trilha, notificações e e-mails.",
                       "Nivelamento com oito questões sobre situações reais; dá para responder “ainda não sei”."]),

    celulares("Educação", "na prática", [("m-licao", "Lição"), ("m-praticar", "Laboratório"), ("m-resultado", "Resultado")],
              texto="Lições curtas, de cerca de <strong>dez minutos</strong>, com prática na hora.",
              bullets=["Leitura, antes e depois, pergunta de conferência e espaço para o próprio prompt.",
                       "Praticar: escrever um prompt, revisar um código ou fazer um projeto curto.",
                       "Parecer por critério, com comentário sobre o que melhorar.",
                       "Proficiência: dez questões, 70% de acerto e um selo no perfil."]),

    celulares("Comunidade", "e perfil", [("m-comunidade", "Comunidade"), ("m-post", "Post"), ("m-perfil", "Perfil")],
              texto="Comunidade por <strong>tags</strong>, sem feed genérico, ligada às lições.",
              bullets=["A resposta que resolveu rende XP a quem respondeu.",
                       "Posts ligados a uma lição aparecem nela como dúvidas da aula.",
                       "Perfil com nível, XP, sequência de dias, ranking entre amigos e selos."]),

    bruto(f'''<section class="s {{COR}}">
  <h1 class="t" style="margin-bottom:26px"><span>Versão para</span><b>computador</b></h1>
  <p style="font-size:24px;max-width:1560px;margin-bottom:24px">O celular é para o hábito diário; o computador, para sessões longas. <strong>Mesmo código</strong>, adaptado ao tamanho da tela.</p>
  <div class="g3" style="max-width:1260px">{_web}</div>
  {{RODAPE}}
</section>'''),

    tabela("Protótipo", "e produto", ["Parte", "No protótipo", "No produto final"], [
        ["Formulários", "Validam e mostram os erros", "Gravam os dados"],
        ["Cadastro e login", "Levam direto à Home", "Autenticação real"],
        ["Dados", "Exemplos fixos, iguais para todos", "Banco de dados por pessoa"],
        ["Avaliação", "Parecer de exemplo", "Parecer gerado por IA a cada envio"],
        ["Vídeo dos cursos", "Espaço reservado", "Player com os vídeos enviados"],
        ["Uso das ferramentas de IA", "Números fictícios", "Dados das contas conectadas"],
        ["Conteúdo da trilha", "Três lições do primeiro módulo", "Grade completa"],
    ], lead="Next.js, React, TypeScript, Tailwind e shadcn: 33 rotas e cerca de 29 mil linhas, escritas com IA de código sob a minha direção. "
            "<strong>O objetivo era provar a experiência, não a infraestrutura.</strong>",
        nota="Navegação e telas funcionam por completo. Um sistema de design único, com cores, espaços e fontes em variáveis, troca o tema claro pelo escuro sem redesenhar nada.",
        tam=22),
]
