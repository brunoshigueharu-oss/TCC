#target illustrator
/* Brandbook BASE8 — Bruno Higashi. UTF-8, ExtendScript ES3.
   Execute em Arquivo > Scripts > Outro Script. Salve o documento como .ai.
   Estilo: páginas claras com cabeçalho e rodapé finos, divisores de seção escuros,
   títulos em minúsculas com ponto final, rótulos em caixa alta espaçada e linhas de chamada.
   A geração não altera documentos existentes. Não salva nem sobrescreve arquivos. */

// Fontes: nomes PostScript, em ordem de preferência.
// Texto = Figtree; títulos e nome = Instrument Sans (as mesmas do app, em lib/fonts.ts).
var FONTE = ["Figtree-Regular", "Inter-Regular", "HelveticaNeue", "ArialMT"];
var FONTE_LEVE = ["Figtree-Light", "Figtree-Regular", "Inter-Light", "HelveticaNeue-Light", "ArialMT"];
var FONTE_SEMI = ["Figtree-SemiBold", "Figtree-Bold", "Inter-SemiBold", "HelveticaNeue-Medium", "Arial-BoldMT"];
var FONTE_DISPLAY = ["InstrumentSans-SemiBold", "InstrumentSans-Bold", "InstrumentSans-Medium", "InstrumentSans-Regular"];
var FONTE_DISPLAY_MEDIO = ["InstrumentSans-Medium", "InstrumentSans-Regular", "InstrumentSans-SemiBold"];
var FONTE_DISPLAY_FORTE = ["InstrumentSans-Bold", "InstrumentSans-SemiBold"];
var FONTE_DISPLAY_REGULAR = ["InstrumentSans-Regular", "InstrumentSans-Medium"];
// Pesos mostrados nas páginas de tipografia.
var PESOS_DISPLAY = [["Regular", "InstrumentSans-Regular"], ["Medium", "InstrumentSans-Medium"], ["Semibold", "InstrumentSans-SemiBold"], ["Bold", "InstrumentSans-Bold"]];
var PESOS_TEXTO = [["Regular", "Figtree-Regular"], ["Medium", "Figtree-Medium"], ["Semibold", "Figtree-SemiBold"], ["Bold", "Figtree-Bold"]];
var NOME = "BASE8";
// Medidas em pontos (equivalentes a pixels no documento RGB).
var LARGURA = 1920;
var ALTURA = 1080;
var MARGEM = 96;
var COLUNAS = 12;
var GUTTER = 24;
var PRANCHETAS_POR_LINHA = 4;
var ESPACO_PRANCHETAS = 100;
var TOPO = 236; // início do conteúdo nas páginas claras
// Cores das páginas do brandbook: fundo em branco puro, neutros frios da Paleta IDV.
var CORES = {
    fundo: [255, 255, 255], texto: [27, 31, 59], secundario: [90, 94, 116],
    linha: [213, 215, 224], destaque: [18, 161, 128], apagado: [154, 157, 174]
};
// Paleta do app: Risografia + verde-água, fechada em 16/10/2026 (coleção "Paleta IDV" do Figma).
// conceito: nome de marca de cada cor (Bruno, 23/10/2026). claro: o texto sobre a cor é branco.
// Branco sobre verde-água (3,3:1), rosa (3,1:1) e azul riso (3,5:1): só em texto grande (títulos e botões).
// Verde-água escurecido de #14B38E para #12A180 em 23/10/2026 para o branco passar de 3:1.
var PALETA = [
    { papel: "Fundo", nome: "Branco", conceito: "Possibilidades", hex: "#FFFFFF", claro: false, uso: "Fundo das telas" },
    { papel: "Texto", nome: "Azul-noite", conceito: "Descoberta", hex: "#1B1F3B", claro: true, uso: "Texto, ícones e logo" },
    { papel: "Ação", nome: "Verde-água", conceito: "Criatividade", hex: "#12A180", claro: true, uso: "Home, botão principal e sucesso" },
    { papel: "Trilha", nome: "Limão", conceito: "Adaptação", hex: "#F5EE4A", claro: false, uso: "Aprendizado e proficiência" },
    { papel: "Praticar", nome: "Rosa flúor", conceito: "Ousadia", hex: "#FF48B0", claro: true, uso: "Atividades práticas" },
    { papel: "Comunidade", nome: "Azul riso", conceito: "Conectividade", hex: "#0B8FE0", claro: true, uso: "Comunidade e cursos" },
    { papel: "Superfície", nome: "Cinza gelo", conceito: "Técnica", hex: "#F1F2F6", claro: false, uso: "Áreas e painéis" },
    { papel: "Texto secundário", nome: "Cinza frio", conceito: "Refinamento", hex: "#5A5E74", claro: true, uso: "Legendas e apoio" }
];
var GRUPOS = ["essência da marca", "identidade visual", "normas e usos", "aplicações"];
// Logo: ainda em desenvolvimento. Enquanto LOGO.aprovado estiver vazio, cada lugar do logo
// mostra um espaço tracejado. Quando o logo for aprovado, cole aqui o atributo d do <path> do SVG.
var LOGO_VERSAO = "aprovado";
var LOGO = { aprovado: "" };

(function () {
    var doc = null;
    var criado = 0;
    var camadas = {};
    var cores = {};
    var paleta = {};
    var logoLido = null;
    var estilos = {};
    var avisos = [];
    var larguraUtil = LARGURA - 2 * MARGEM;
    var paginas = [];
    var regular, leve, semi, display, displayMedio, displayForte, displayRegular;

    function fonteSegura(nomes, reserva) {
        var i;
        for (i = 0; i < nomes.length; i++) {
            try { return app.textFonts.getByName(nomes[i]); } catch (ignorar) {}
        }
        if (reserva) {
            avisos.push("Fonte " + nomes[0] + " indisponível: usando " + reserva.name + ".");
            return reserva;
        }
        try {
            if (app.textFonts.length > 0) {
                avisos.push("Fontes preferidas indisponíveis: usando " + app.textFonts[0].name + ".");
                return app.textFonts[0];
            }
        } catch (ignorarReserva) {}
        throw new Error("Nenhuma fonte está disponível no Illustrator.");
    }
    function fonteOpcional(nome) {
        try { return app.textFonts.getByName(nome); } catch (ignorar) { return null; }
    }
    // grupo: índice em GRUPOS (null na capa, sumário e fechamento). escura: fundo azul-noite.
    function pagina(nome, grupo, titulo, curto, desenhar, escura) {
        paginas.push({ nome: nome, grupo: grupo, titulo: titulo, curto: curto, desenhar: desenhar, escura: !!escura });
    }
    // Cada divisor ganha a cor de uma área; sobre o limão, texto em azul-noite.
    var FUNDO_DIVISOR = ["Comunidade", "Praticar", "Trilha", "Ação"];
    function divisor(grupo) {
        pagina("Divisor – " + GRUPOS[grupo], grupo, "", "", function (p) {
            var cor = p.fundo === "Trilha" ? paleta.Texto : cores.fundo;
            pontual(p, "Número", dois(grupo + 1), LARGURA / 2, 440, "Número de seção", cor, Justification.CENTER);
            pontual(p, "Título", GRUPOS[grupo], LARGURA / 2, 600, "Divisor", cor, Justification.CENTER);
        }, true);
        paginas[paginas.length - 1].fundo = FUNDO_DIVISOR[grupo];
    }
    function dois(n) { return n < 10 ? "0" + n : "" + n; }
    function ret(p, camada, nome, x, y, w, h, preenchimento, traco, tracejado) {
        var obj = camadas[camada].pathItems.rectangle(p.top - y, p.left + x, w, h);
        obj.name = p.nome + " / " + nome;
        obj.filled = !!preenchimento;
        if (preenchimento) { obj.fillColor = preenchimento; }
        obj.stroked = !!traco;
        if (traco) { obj.strokeColor = traco; obj.strokeWidth = 1; }
        if (tracejado) { obj.strokeDashes = [8, 6]; }
        return obj;
    }
    function arredondado(p, nome, x, y, w, h, raio, preenchimento, traco) {
        var obj = camadas.Estrutura.pathItems.roundedRectangle(p.top - y, p.left + x, w, h, raio, raio);
        obj.name = p.nome + " / " + nome;
        obj.filled = !!preenchimento;
        if (preenchimento) { obj.fillColor = preenchimento; }
        obj.stroked = !!traco;
        if (traco) { obj.strokeColor = traco; obj.strokeWidth = 1; }
        return obj;
    }
    function linha(p, camada, nome, x1, y1, x2, y2, guia, cor) {
        var obj = camadas[camada].pathItems.add();
        obj.name = p.nome + " / " + nome;
        obj.setEntirePath([[p.left + x1, p.top - y1], [p.left + x2, p.top - y2]]);
        obj.filled = false;
        obj.stroked = true;
        obj.strokeWidth = 1;
        obj.strokeColor = cor || cores.linha;
        if (guia) { obj.guides = true; }
        return obj;
    }
    function ajustar(obj, estilo, cor, alinhar) {
        estilos[estilo || "Corpo"].applyTo(obj.textRange, true);
        if (cor) { obj.textRange.characterAttributes.fillColor = cor; }
        if (alinhar) { obj.textRange.paragraphAttributes.justification = alinhar; }
        return obj;
    }
    // Texto em caixa (quebra linhas dentro da largura).
    function texto(p, nome, conteudo, x, y, w, h, estilo, cor, alinhar, camada) {
        var path = ret(p, camada || "Texto", nome + " / caixa", x, y, w, h, null, null, false);
        var obj = doc.textFrames.areaText(path);
        obj.name = p.nome + " / " + nome;
        obj.contents = conteudo;
        return ajustar(obj, estilo, cor, alinhar);
    }
    // Texto de ponto (uma linha, ancorado na linha de base em yBase).
    function pontual(p, nome, conteudo, x, yBase, estilo, cor, alinhar) {
        var obj = camadas.Texto.textFrames.pointText([p.left + x, p.top - yBase]);
        obj.name = p.nome + " / " + nome;
        obj.contents = conteudo;
        return ajustar(obj, estilo, cor, alinhar);
    }
    // Caixa exata dos glifos, em coordenadas da página (x1, y1 = canto superior esquerdo).
    function medir(p, obj) {
        var copia = obj.duplicate();
        var contorno = copia.createOutline();
        var gb = contorno.geometricBounds;
        contorno.remove();
        return { x1: gb[0] - p.left, y1: p.top - gb[1], x2: gb[2] - p.left, y2: p.top - gb[3] };
    }
    function rotulo(p, nome, conteudo, x, y, w, cor) {
        return texto(p, nome, conteudo.toUpperCase(), x, y, w, 26, "Rótulo", cor);
    }
    function campo(p, nome, x, y, w, h, valor) {
        rotulo(p, nome + " / rótulo", nome, x, y, w);
        texto(p, nome + " / valor", valor || "A preencher", x, y + 36, w, h || 60, valor ? "Corpo" : "A preencher");
    }
    // Linha de chamada: traço de (x1, y1) até (x2, y2) e rótulo na ponta.
    function chamada(p, nome, x1, y1, x2, y2, conteudo, tx, ty, tw) {
        linha(p, "Estrutura", nome + " / linha", x1, y1, x2, y2, false, cores.texto);
        texto(p, nome, conteudo.toUpperCase(), tx, ty, tw, 90, "Chamada");
    }
    function corRGB(valores) {
        var rgb = new RGBColor();
        rgb.red = valores[0]; rgb.green = valores[1]; rgb.blue = valores[2];
        return rgb;
    }
    function hexParaRGB(hex) {
        return [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)];
    }
    function amostraGlobal(grupo, nome, valores) {
        var spot = doc.spots.add();
        var sc = new SpotColor();
        spot.name = nome; spot.colorType = ColorModel.PROCESS; spot.color = corRGB(valores);
        sc.spot = spot; sc.tint = 100;
        grupo.addSpot(spot);
        return sc;
    }
    function dadosPaleta(papel) {
        var i;
        for (i = 0; i < PALETA.length; i++) { if (PALETA[i].papel === papel) { return PALETA[i]; } }
        return null;
    }
    // Lê o atributo d de um <path> SVG (comandos M, L, H, V, C e Z) e devolve os subcaminhos
    // com âncora (a), alça de entrada (e) e alça de saída (s), além da caixa que os contém.
    function lerCaminho(d) {
        var partes = d.match(/[MmLlHhVvCcZz][^MmLlHhVvCcZz]*/g);
        var sub = [], atual = null, pt = null;
        var x = 0, y = 0, x0 = 0, y0 = 0, bx, by, i, j, c, rel, n, passo, primeiro;
        var caixa = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
        function ponto(px, py) {
            pt = { a: [px, py], e: [px, py], s: [px, py] };
            atual.push(pt); x = px; y = py;
            caixa.x1 = Math.min(caixa.x1, px); caixa.x2 = Math.max(caixa.x2, px);
            caixa.y1 = Math.min(caixa.y1, py); caixa.y2 = Math.max(caixa.y2, py);
        }
        for (i = 0; i < partes.length; i++) {
            c = partes[i].charAt(0);
            rel = c === c.toLowerCase();
            c = c.toUpperCase();
            if (c === "Z") { x = x0; y = y0; continue; }
            n = partes[i].substring(1).match(/-?\d*\.?\d+/g) || [];
            for (j = 0; j < n.length; j++) { n[j] = parseFloat(n[j]); }
            passo = c === "C" ? 6 : (c === "H" || c === "V" ? 1 : 2);
            for (j = 0; j + passo <= n.length; j += passo) {
                bx = rel ? x : 0; by = rel ? y : 0;
                if (c === "M" && j === 0) {
                    atual = []; sub.push(atual);
                    ponto(n[0] + bx, n[1] + by); x0 = x; y0 = y;
                } else if (c === "H") { ponto(n[j] + bx, y); }
                else if (c === "V") { ponto(x, n[j] + by); }
                else if (c === "C") {
                    pt.s = [n[j] + bx, n[j + 1] + by];
                    ponto(n[j + 4] + bx, n[j + 5] + by);
                    pt.e = [n[j + 2] + bx, n[j + 3] + by];
                } else { ponto(n[j] + bx, n[j + 1] + by); }
            }
        }
        // Subcaminho fechado que termina onde começou: o último ponto se funde ao primeiro.
        for (i = 0; i < sub.length; i++) {
            primeiro = sub[i][0]; pt = sub[i][sub[i].length - 1];
            if (sub[i].length > 1 && Math.abs(pt.a[0] - primeiro.a[0]) < 0.01 && Math.abs(pt.a[1] - primeiro.a[1]) < 0.01) {
                primeiro.e = pt.e; sub[i].pop();
            }
        }
        return { sub: sub, caixa: caixa };
    }
    // Desenha o símbolo como caminho composto, ajustado e centralizado na área indicada.
    function logo(p, nome, x, y, w, h, cor) {
        var i, j, item, pp, q, sub, cx, lw, lh, esc, ox, oy, composto;
        if (!logoLido) { logoLido = lerCaminho(LOGO[LOGO_VERSAO]); }
        sub = logoLido.sub; cx = logoLido.caixa;
        lw = cx.x2 - cx.x1; lh = cx.y2 - cx.y1;
        esc = Math.min(w / lw, h / lh);
        ox = p.left + x + (w - lw * esc) / 2;
        oy = p.top - y - (h - lh * esc) / 2;
        function conv(v) { return [ox + (v[0] - cx.x1) * esc, oy - (v[1] - cx.y1) * esc]; }
        composto = camadas.Logo.compoundPathItems.add();
        composto.name = p.nome + " / " + nome;
        for (i = 0; i < sub.length; i++) {
            item = composto.pathItems.add();
            for (j = 0; j < sub[i].length; j++) {
                q = sub[i][j];
                pp = item.pathPoints.add();
                pp.anchor = conv(q.a); pp.leftDirection = conv(q.e); pp.rightDirection = conv(q.s);
                pp.pointType = PointType.CORNER;
            }
            item.closed = true; item.evenodd = true;
            item.filled = true; item.fillColor = cor; item.stroked = false;
        }
        return composto;
    }
    // Logo final, ou espaço tracejado enquanto ele não existir.
    function marca(p, nome, x, y, w, h, cor, legenda) {
        if (LOGO[LOGO_VERSAO]) { return logo(p, nome, x, y, w, h, cor); }
        ret(p, "Espaços para imagem", nome, x, y, w, h, null, cor, true);
        if (legenda && w >= 160 && h >= 80) {
            if (w >= 420) {
                texto(p, nome + " / indicação", "LOGO EM DESENVOLVIMENTO", x, y + h / 2 - 12, w, 26, "Rótulo", cor, Justification.CENTER, "Espaços para imagem");
            } else {
                texto(p, nome + " / indicação", "LOGO EM\rDESENVOLVIMENTO", x, y + h / 2 - 24, w, 50, "Rótulo", cor, Justification.CENTER, "Espaços para imagem");
            }
        }
        return null;
    }
    function imagem(p, nome, x, y, w, h) {
        ret(p, "Espaços para imagem", nome, x, y, w, h, null, cores.apagado, true);
        texto(p, nome + " / indicação", nome.toUpperCase(), x + 24, y + 24, w - 48, Math.min(100, h - 32), "Rótulo", cores.secundario, null, "Espaços para imagem");
    }
    function quadros(p, nomes, x, y, w, h, colunas) {
        var rows = Math.ceil(nomes.length / colunas);
        var cw = (w - (colunas - 1) * GUTTER) / colunas;
        var ch = (h - (rows - 1) * GUTTER) / rows;
        var i;
        for (i = 0; i < nomes.length; i++) {
            imagem(p, nomes[i], x + (i % colunas) * (cw + GUTTER), y + Math.floor(i / colunas) * (ch + GUTTER), cw, ch);
        }
    }
    // Tabela aberta: rótulos em caixa alta, fio escuro sob o cabeçalho e fios claros entre as linhas.
    function tabela(p, nome, titulos, linhas, larguras, x, y, alturaLinha) {
        var r, c, xx, yy, valor, estilo, alturaAtual;
        var total = 0;
        for (c = 0; c < larguras.length; c++) { total += larguras[c]; }
        xx = x;
        for (c = 0; c < titulos.length; c++) {
            rotulo(p, nome + " / " + titulos[c], titulos[c], xx, y + 10, larguras[c] - 32);
            xx += larguras[c];
        }
        linha(p, "Estrutura", nome + " / cabeçalho", x, y + 46, x + total, y + 46, false, cores.texto);
        yy = y + 46;
        for (r = 0; r < linhas.length; r++) {
            alturaAtual = typeof alturaLinha === "number" ? alturaLinha : alturaLinha[r];
            xx = x;
            for (c = 0; c < larguras.length; c++) {
                valor = linhas[r][c];
                estilo = valor === "A preencher" ? "A preencher" : "Corpo";
                texto(p, nome + " / linha " + (r + 1) + " / " + titulos[c], valor, xx, yy + 16, larguras[c] - 32, alturaAtual - 24, estilo);
                xx += larguras[c];
            }
            linha(p, "Estrutura", nome + " / linha " + (r + 1), x, yy + alturaAtual, x + total, yy + alturaAtual, false);
            yy += alturaAtual;
        }
    }
    function criarEstilo(nome, tamanho, fonte, cor, entrelinha, espacamento) {
        var s = doc.paragraphStyles.add(nome);
        s.characterAttributes.textFont = fonte;
        s.characterAttributes.size = tamanho;
        s.characterAttributes.autoLeading = false;
        s.characterAttributes.leading = tamanho * (entrelinha || 1.3);
        s.characterAttributes.tracking = espacamento || 0;
        s.characterAttributes.fillColor = cor;
        s.paragraphAttributes.hyphenation = false;
        s.paragraphAttributes.spaceAfter = 0;
        s.paragraphAttributes.justification = Justification.LEFT;
        estilos[nome] = s;
    }
    function base(p, indice) {
        var i, x;
        var cw = (larguraUtil - (COLUNAS - 1) * GUTTER) / COLUNAS;
        ret(p, "Fundo", "Fundo", 0, 0, LARGURA, ALTURA, p.fundo ? paleta[p.fundo] : (p.escura ? cores.texto : cores.fundo), null, false);
        for (i = 0; i < COLUNAS; i++) {
            x = MARGEM + i * (cw + GUTTER);
            linha(p, "Guias", "Coluna " + (i + 1) + " / início", x, MARGEM, x, ALTURA - MARGEM, true);
            linha(p, "Guias", "Coluna " + (i + 1) + " / fim", x + cw, MARGEM, x + cw, ALTURA - MARGEM, true);
        }
        if (p.escura) { return; }
        // Cabeçalho: grupo à esquerda, nome da marca à direita, fio fino embaixo.
        texto(p, "Cabeçalho / grupo", GRUPOS[p.grupo].toUpperCase(), MARGEM, 40, 900, 26, "Cabeçalho");
        texto(p, "Cabeçalho / marca", NOME, LARGURA - MARGEM - 400, 40, 400, 26, "Cabeçalho", null, Justification.RIGHT);
        linha(p, "Estrutura", "Cabeçalho / fio", MARGEM, 76, LARGURA - MARGEM, 76, false, cores.texto);
        // Rodapé.
        linha(p, "Estrutura", "Rodapé / fio", MARGEM, 1004, LARGURA - MARGEM, 1004, false, cores.texto);
        texto(p, "Rodapé / documento", "BRAND BOOK", MARGEM, 1018, 400, 26, "Cabeçalho");
        texto(p, "Rodapé / página", dois(indice + 1), LARGURA - MARGEM - 100, 1018, 100, 26, "Cabeçalho", null, Justification.RIGHT);
        texto(p, "Título", p.titulo, MARGEM, 106, larguraUtil, 80, "Título");
    }
    function amostrasDePeso(p, pesos, reserva, y) {
        var i, x, f, obj;
        var cw = (larguraUtil - 3 * GUTTER) / 4;
        for (i = 0; i < pesos.length; i++) {
            x = MARGEM + i * (cw + GUTTER);
            linha(p, "Estrutura", "Peso " + pesos[i][0] + " / fio", x, y, x + cw, y, false);
            obj = pontual(p, "Peso " + pesos[i][0], pesos[i][0], x, y + 76, "Peso");
            f = fonteOpcional(pesos[i][1]);
            obj.textRange.characterAttributes.textFont = f || reserva;
            if (!f) { avisos.push("Peso " + pesos[i][1] + " indisponível."); }
            rotulo(p, "Peso " + pesos[i][0] + " / nome", pesos[i][1], x, y + 104, cw);
        }
    }
    function paginaTipografia(p, cfg) {
        pontual(p, "Aa", "Aa", MARGEM - 8, 600, cfg.estiloAa);
        texto(p, "Espécime", "ABCDEFGHIJKLMNOPQRSTUVWXYZ\rabcdefghijklmnopqrstuvwxyz\rÁÂÃÀÇÉÊÍÓÔÕÚ áâãàçéêíóôõú\r0123456789 !?@#&%", 720, TOPO + 20, 664, 260, cfg.estiloEspecime);
        rotulo(p, "Família", cfg.papel + " — " + cfg.familia, 1408, TOPO + 20, 416);
        texto(p, "Descrição", cfg.descricao, 1408, TOPO + 60, 416, 200, "Corpo");
        rotulo(p, "Licença / rótulo", "Licença", 1408, TOPO + 286, 416);
        texto(p, "Licença", "SIL Open Font License 1.1 · Google Fonts", 1408, TOPO + 318, 416, 64, "Corpo");
        amostrasDePeso(p, cfg.pesos, cfg.reserva, 760);
    }

    // ---------- Páginas ----------
    pagina("Capa", null, "", "", function (p) {
        var nome, caixa, i, x, lado = 26, vao = 10, total;
        rotulo(p, "Tipo de documento", "Brand book", MARGEM, 96, 600, cores.fundo);
        nome = pontual(p, "Nome", NOME, LARGURA / 2, 600, "Capa", cores.fundo, Justification.CENTER);
        caixa = medir(p, nome);
        total = PALETA.length * lado + (PALETA.length - 1) * vao;
        for (i = 0; i < PALETA.length; i++) {
            x = LARGURA / 2 - total / 2 + i * (lado + vao);
            ret(p, "Estrutura", "Amostra " + PALETA[i].nome, x, caixa.y2 + 70, lado, lado, paleta[PALETA[i].papel], PALETA[i].papel === "Texto" ? cores.apagado : null, false);
        }
        rotulo(p, "Assunto", "Identidade visual · 2026", MARGEM, 958, 800, cores.fundo);
        texto(p, "Autor", "BRUNO HIGASHI", LARGURA - MARGEM - 600, 958, 600, 26, "Rótulo", cores.fundo, Justification.RIGHT);
    }, true);
    pagina("Sumário", null, "", "", function (p) {
        var g, j, n, x, y, itens;
        texto(p, "Título", "sumário.", MARGEM, 106, 800, 80, "Título", cores.fundo);
        for (g = 0; g < GRUPOS.length; g++) {
            x = MARGEM + (g % 2) * 880;
            y = 260 + Math.floor(g / 2) * 400;
            pontual(p, "Número " + dois(g + 1), dois(g + 1), x - 6, y + 128, "Número", cores.apagado);
            texto(p, "Grupo " + dois(g + 1), GRUPOS[g], x + 290, y + 4, 520, 40, "Subtítulo", cores.fundo);
            itens = []; n = 0;
            for (j = 0; j < paginas.length; j++) {
                if (paginas[j].grupo === g && !paginas[j].escura) {
                    texto(p, "Grupo " + dois(g + 1) + " / " + paginas[j].curto, paginas[j].curto, x + 290, y + 56 + n * 27, 400, 26, "Legenda", cores.apagado);
                    texto(p, "Grupo " + dois(g + 1) + " / " + paginas[j].curto + " / página", dois(j + 1), x + 690, y + 56 + n * 27, 120, 26, "Legenda", cores.apagado, Justification.RIGHT);
                    n++;
                }
            }
        }
    }, true);

    divisor(0);
    pagina("01 Essência", 0, "essência.", "essência", function (p) {
        var itens = [
            ["Valor central", "Potencialização"],
            ["Pilares", "Holística (sistêmica, prática) · Acessibilidade (personalizada, progressiva) · Conexão (coletividade, profissional) · Inovação (ousado, gamificado)"],
            ["Personalidade", "Encorajador e didático"],
            ["Impressão desejada", "Segurança e ousadia, diversão, criatividade e design; convidativa e carismática"],
            ["Público", "Designers sem contato com IA de código"],
            ["Propósito", "A preencher"], ["Promessa", "A preencher"], ["Posicionamento", "A preencher"]
        ];
        var alturas = [70, 104, 70, 104, 70, 70, 70, 70];
        var i, y = TOPO;
        for (i = 0; i < itens.length; i++) {
            rotulo(p, itens[i][0], itens[i][0], 720, y + 6, 300);
            texto(p, itens[i][0] + " / valor", itens[i][1], 1040, y, 784, alturas[i] - 12, itens[i][1] === "A preencher" ? "A preencher" : "Corpo");
            linha(p, "Estrutura", itens[i][0] + " / fio", 720, y + alturas[i] - 14, LARGURA - MARGEM, y + alturas[i] - 14, false);
            y += alturas[i];
        }
    });
    pagina("01 Nome", 0, "nome.", "nome", function (p) {
        var inteiro, parte, cb, c8, meioBase, meio8;
        inteiro = pontual(p, "Nome", NOME, MARGEM - 10, 640, "Nome");
        cb = medir(p, inteiro);
        parte = pontual(p, "Medida", "BASE", MARGEM - 10, 640, "Nome");
        c8 = medir(p, parte);
        parte.remove();
        meioBase = (cb.x1 + c8.x2) / 2;
        meio8 = (cb.y1 + cb.y2) / 2;
        chamada(p, "Chamada / base", meioBase, cb.y1 - 24, meioBase, 300, "Base = fundamento: a base de design que o designer já tem + a base técnica que ganha", meioBase + 16, 278, 820);
        chamada(p, "Chamada / 8", cb.x2 + 28, meio8, 1300, meio8, "8 = as oito vertentes do DNA da marca. Base 8 = sistema octal da computação", 1316, meio8 - 13, 508);
        campo(p, "Como escrever", MARGEM, 800, 540, 90, "BASE8: caixa alta, sem espaço, em Instrument Sans.");
        campo(p, "Pronúncia", 690, 800, 540, 90, "“Base oito”.");
        campo(p, "Assinatura (tagline)", 1284, 800, 540, 90);
    });
    pagina("01 Tom de voz", 0, "tom de voz.", "tom de voz", function (p) {
        texto(p, "Frase fixa", "A marca fala de forma encorajadora e didática.", MARGEM, TOPO, larguraUtil, 50, "Subtítulo");
        tabela(p, "Somos", ["Somos", "Não somos"], [["", ""], ["", ""], ["", ""]], [864, 864], MARGEM, TOPO + 66, 56);
        tabela(p, "Situações", ["Situação", "Assim", "Assim não"], [
            ["Boas-vindas", "A preencher", "A preencher"], ["Erro do usuário", "A preencher", "A preencher"],
            ["Conquista", "A preencher", "A preencher"], ["Lembrete de retorno", "A preencher", "A preencher"]
        ], [440, 644, 644], MARGEM, TOPO + 330, 66);
    });

    divisor(1);
    pagina("02 Logo", 1, "logo.", "logo", function (p) {
        marca(p, "Logo principal", MARGEM, TOPO, larguraUtil, 600, cores.apagado, true);
        texto(p, "Nota", "O logo final ainda está em desenvolvimento. Este espaço recebe a versão principal quando ela for aprovada.", MARGEM, TOPO + 630, 1000, 70, "Legenda");
    });
    pagina("02 Cores", 1, "cores.", "cores", function (p) {
        // Mosaico sem vãos: branco ocupa 1/3; as demais cores dividem os 2/3 restantes em 3 colunas e 2 linhas.
        // [papel, x, y, largura, altura]
        var blocos = [
            ["Fundo", 0, 0, 576, 680],
            ["Texto", 576, 0, 384, 340], ["Trilha", 960, 0, 384, 340], ["Comunidade", 1344, 0, 384, 340],
            ["Ação", 576, 340, 384, 340], ["Praticar", 960, 340, 384, 340],
            ["Superfície", 1344, 340, 192, 340], ["Texto secundário", 1536, 340, 192, 340]
        ];
        var i, b, d, x, y, cor;
        for (i = 0; i < blocos.length; i++) {
            b = blocos[i]; d = dadosPaleta(b[0]);
            x = MARGEM + b[1]; y = TOPO + b[2];
            cor = d.claro ? cores.fundo : cores.texto;
            ret(p, "Estrutura", d.nome + " / bloco", x, y, b[3], b[4], paleta[b[0]], b[0] === "Fundo" ? cores.linha : null, false);
            rotulo(p, d.nome + " / conceito", d.conceito, x + 20, y + 20, b[3] - 40, cor);
            rotulo(p, d.nome + " / nome", d.nome, x + 20, y + b[4] - 70, b[3] - 40, cor);
            rotulo(p, d.nome + " / hex", d.hex, x + 20, y + b[4] - 44, b[3] - 40, cor);
        }
    });
    pagina("02 Cores – Aplicação", 1, "aplicação das cores.", "aplicação das cores", function (p) {
        var cw = (larguraUtil - 2 * GUTTER) / 3; // 560
        var colA = MARGEM, colB = MARGEM + cw + GUTTER, colC = MARGEM + 2 * (cw + GUTTER);
        var yCol = TOPO + 234; // início das três colunas
        var i, x, w, d, y, obj;

        // 1. Proporção de uso: barra única, da cor mais usada à menos usada.
        var proporcao = [["Fundo", 55], ["Superfície", 15], ["Texto", 15], ["Ação", 9], ["Trilha", 2], ["Praticar", 2], ["Comunidade", 2]];
        rotulo(p, "Proporção / rótulo", "Proporção de uso", MARGEM, TOPO, 600);
        x = MARGEM;
        for (i = 0; i < proporcao.length; i++) {
            d = dadosPaleta(proporcao[i][0]);
            w = larguraUtil * proporcao[i][1] / 100;
            ret(p, "Estrutura", "Proporção / " + d.nome, x, TOPO + 40, w, 96, paleta[proporcao[i][0]], proporcao[i][0] === "Fundo" ? cores.linha : null, false);
            if (i < 4) {
                rotulo(p, "Proporção / " + d.nome + " / conceito", d.conceito, x, TOPO + 152, w - 8);
                texto(p, "Proporção / " + d.nome + " / valor", proporcao[i][1] + "%", x, TOPO + 178, w - 8, 30, "Legenda");
            }
            x += w;
        }
        w = larguraUtil * 6 / 100;
        rotulo(p, "Proporção / Áreas / nome", "Áreas", x - w, TOPO + 152, w);
        texto(p, "Proporção / Áreas / valor", "6%", x - w, TOPO + 178, w, 30, "Legenda");

        // 2. Regras de aplicação.
        var regras = [
            "Possibilidades (branco) é o fundo; Técnica (cinza gelo) separa áreas e painéis.",
            "Texto em Descoberta (azul-noite) e apoio em Refinamento (cinza frio). Nunca preto.",
            "Cada área tem sua cor: Criatividade na Home, Adaptação no aprendizado, Ousadia na prática e Conectividade na comunidade.",
            "Sobre as cores vivas, texto em branco e grande (títulos e botões). Sobre o limão, sempre azul-noite."
        ];
        var alturasRegras = [88, 88, 122, 102];
        rotulo(p, "Regras / rótulo", "Como aplicar", colA, yCol, cw);
        y = yCol + 40;
        for (i = 0; i < regras.length; i++) {
            linha(p, "Estrutura", "Regra " + dois(i + 1) + " / fio", colA, y, colA + cw, y, false);
            rotulo(p, "Regra " + dois(i + 1) + " / número", dois(i + 1), colA, y + 18, 40);
            texto(p, "Regra " + dois(i + 1), regras[i], colA + 56, y + 14, cw - 56, alturasRegras[i] - 14, "Corpo");
            y += alturasRegras[i];
        }

        // 3. Contraste (WCAG 2.2): texto comum pede 4,5:1; texto grande (24 px, ou 19 px em negrito) pede 3:1.
        // [fundo, cor do texto ("Texto" ou "Fundo"), razão, veredito]
        var pares = [
            ["Fundo", "Texto", "16,1:1", "PODE"], ["Texto", "Fundo", "16,1:1", "PODE"],
            ["Trilha", "Texto", "13,2:1", "PODE"], ["Texto secundário", "Fundo", "6,4:1", "PODE"],
            ["Comunidade", "Fundo", "3,5:1", "TEXTO GRANDE"], ["Praticar", "Fundo", "3,1:1", "TEXTO GRANDE"],
            ["Ação", "Texto", "4,9:1", "PODE"], ["Ação", "Fundo", "3,3:1", "TEXTO GRANDE"]
        ];
        var tw = (cw - 12) / 2, th = 92.5, corTexto;
        rotulo(p, "Contraste / rótulo", "Contraste do texto", colB, yCol, cw);
        for (i = 0; i < pares.length; i++) {
            x = colB + (i % 2) * (tw + 12);
            y = yCol + 40 + Math.floor(i / 2) * (th + 12);
            corTexto = pares[i][1] === "Texto" ? cores.texto : cores.fundo;
            ret(p, "Estrutura", "Contraste " + dois(i + 1) + " / fundo", x, y, tw, th, paleta[pares[i][0]], pares[i][0] === "Fundo" ? cores.linha : null, false);
            pontual(p, "Contraste " + dois(i + 1) + " / amostra", "Aa", x + 20, y + 62, "Amostra", corTexto);
            texto(p, "Contraste " + dois(i + 1) + " / razão", pares[i][2], x + tw - 180, y + 20, 160, 26, "Rótulo", corTexto, Justification.RIGHT);
            texto(p, "Contraste " + dois(i + 1) + " / uso", pares[i][3], x + tw - 180, y + 48, 160, 26, "Chamada", corTexto, Justification.RIGHT);
        }

        // 4. Na interface: tela em cinza gelo, cartão branco, uma ação em verde-água.
        var ty = yCol + 40, sx = colC + 28, sw = cw - 56;
        var cy = ty + 72, cx = sx + 28, cwI = sw - 56;
        rotulo(p, "Interface / rótulo", "Na interface", colC, yCol, cw);
        ret(p, "Estrutura", "Interface / tela", colC, ty, cw, 406, paleta["Superfície"], null, false);
        // Barra superior: nome da marca e avatar.
        pontual(p, "Interface / marca", NOME, sx, ty + 46, "Marca da interface");
        obj = camadas.Estrutura.pathItems.ellipse(p.top - (ty + 22), p.left + colC + cw - 28 - 32, 32, 32);
        obj.name = p.nome + " / Interface / avatar"; obj.fillColor = paleta.Texto; obj.stroked = false;
        // Cartão.
        arredondado(p, "Interface / cartão", sx, cy, sw, 306, 16, paleta.Fundo, cores.linha);
        // Posições da etiqueta, marcadores e botão vêm do ajuste manual do Bruno no .ai (23/10).
        arredondado(p, "Interface / etiqueta", cx, cy + 28, 157.2, 32, 16, paleta["Superfície"], null);
        obj = texto(p, "Interface / etiqueta / texto", "APRENDIZADO", cx + 30, cy + 39.5, 150, 26, "Rótulo");
        obj.textRange.characterAttributes.size = 11;
        texto(p, "Interface / título", "Fundamentos de IA de código", cx, cy + 80, cwI, 44, "Título do cartão");
        texto(p, "Interface / progresso / legenda", "Módulo 3 de 8", cx, cy + 124, 300, 30, "Legenda");
        texto(p, "Interface / progresso / valor", "38%", cx + cwI - 100, cy + 124, 100, 30, "Legenda", null, Justification.RIGHT);
        arredondado(p, "Interface / progresso / trilho", cx, cy + 160, cwI, 8, 4, paleta["Superfície"], null);
        arredondado(p, "Interface / progresso / barra", cx, cy + 160, cwI * 3 / 8, 8, 4, paleta.Texto, null);
        obj = camadas.Estrutura.pathItems.ellipse(p.top - (cy + 183), p.left + cx, 10, 10);
        obj.name = p.nome + " / Interface / marcador praticar"; obj.fillColor = paleta.Praticar; obj.stroked = false;
        texto(p, "Interface / marcador praticar / texto", "2 práticas", cx + 20, cy + 184, 160, 30, "Legenda");
        obj = camadas.Estrutura.pathItems.ellipse(p.top - (cy + 183), p.left + cx + 180, 10, 10);
        obj.name = p.nome + " / Interface / marcador comunidade"; obj.fillColor = paleta.Comunidade; obj.stroked = false;
        texto(p, "Interface / marcador comunidade / texto", "14 na comunidade", cx + 200, cy + 184, 220, 30, "Legenda");
        arredondado(p, "Interface / botão", cx, cy + 226, cwI, 52, 10, paleta["Ação"], null);
        texto(p, "Interface / botão / texto", "Continuar trilha", cx, cy + 244.5, cwI, 34, "Botão", cores.fundo, Justification.CENTER);
    });
    pagina("02 Cores – Contraste", 1, "contraste e acessibilidade.", "contraste e acessibilidade", function (p) {
        var esq = 1152, i, x, y, d, c, cel, obj;
        var colN = MARGEM + esq + GUTTER * 2, wN = larguraUtil - esq - GUTTER * 2; // coluna das normas

        // 1. Os dois mínimos da WCAG 2.2 (critério 1.4.3).
        var minimos = [
            ["Texto comum", "4,5:1", "Corpo, legendas, rótulos e links: tudo abaixo de 24 px (ou de 19 px em negrito)."],
            ["Texto grande", "3:1", "Títulos e botões a partir de 24 px, ou a partir de 19 px em negrito."]
        ];
        var wm = (esq - GUTTER) / 2;
        for (i = 0; i < minimos.length; i++) {
            x = MARGEM + i * (wm + GUTTER);
            rotulo(p, "Mínimo " + dois(i + 1) + " / rótulo", minimos[i][0], x, TOPO, wm);
            pontual(p, "Mínimo " + dois(i + 1) + " / razão", minimos[i][1], x - 4, TOPO + 128, "Razão");
            texto(p, "Mínimo " + dois(i + 1) + " / descrição", minimos[i][2], x, TOPO + 150, wm - 40, 60, "Legenda");
        }

        // 2. Tabela: cada cor como fundo, com texto branco e com texto azul-noite.
        // [papel, razão com branco, veredito, razão com azul-noite, veredito]  (null = mesma cor)
        var linhas = [
            ["Fundo", null, null, "16,1:1", "Todo texto"],
            ["Texto", "16,1:1", "Todo texto", null, null],
            ["Ação", "3,3:1", "Só texto grande", "4,9:1", "Todo texto"],
            ["Trilha", "1,2:1", "Não usar", "13,2:1", "Todo texto"],
            ["Praticar", "3,1:1", "Só texto grande", "5,2:1", "Todo texto"],
            ["Comunidade", "3,5:1", "Só texto grande", "4,6:1", "Todo texto"],
            ["Superfície", "1,1:1", "Não usar", "14,4:1", "Todo texto"],
            ["Texto secundário", "6,4:1", "Todo texto", "2,5:1", "Não usar"]
        ];
        var yT = TOPO + 236, alt = (TOPO + 680 - yT - 46) / linhas.length;
        var xs = [MARGEM, MARGEM + 384, MARGEM + 768];
        var titulos = ["Fundo", "Texto branco", "Texto azul-noite"];
        for (c = 0; c < 3; c++) { rotulo(p, "Tabela / " + titulos[c], titulos[c], xs[c], yT + 10, 360); }
        linha(p, "Estrutura", "Tabela / cabeçalho", MARGEM, yT + 46, MARGEM + esq, yT + 46, false, cores.texto);
        for (i = 0; i < linhas.length; i++) {
            d = dadosPaleta(linhas[i][0]);
            y = yT + 46 + i * alt;
            ret(p, "Estrutura", "Tabela / " + d.nome + " / amostra", xs[0], y + (alt - 32) / 2, 32, 32, paleta[linhas[i][0]], linhas[i][0] === "Fundo" || linhas[i][0] === "Superfície" ? cores.linha : null, false);
            texto(p, "Tabela / " + d.nome + " / nome", d.conceito + " · " + d.nome.toLowerCase(), xs[0] + 52, y + alt / 2 - 14, 320, 30, "Corpo");
            for (c = 0; c < 2; c++) {
                cel = xs[c + 1];
                if (linhas[i][1 + c * 2] === null) {
                    texto(p, "Tabela / " + d.nome + " / " + titulos[c + 1], "—", cel, y + alt / 2 - 14, 100, 30, "A preencher");
                    continue;
                }
                ret(p, "Estrutura", "Tabela / " + d.nome + " / " + titulos[c + 1] + " / amostra", cel, y + (alt - 32) / 2, 56, 32, paleta[linhas[i][0]], linhas[i][0] === "Fundo" || linhas[i][0] === "Superfície" ? cores.linha : null, false);
                obj = pontual(p, "Tabela / " + d.nome + " / " + titulos[c + 1] + " / Aa", "Aa", cel + 12, y + alt / 2 + 8, "Amostra pequena", c === 0 ? cores.fundo : cores.texto);
                texto(p, "Tabela / " + d.nome + " / " + titulos[c + 1] + " / razão", linhas[i][1 + c * 2], cel + 76, y + alt / 2 - 14, 100, 30, "Corpo");
                texto(p, "Tabela / " + d.nome + " / " + titulos[c + 1] + " / veredito", linhas[i][2 + c * 2].toUpperCase(), cel + 176, y + alt / 2 - 10, 200, 26, linhas[i][2 + c * 2] === "Todo texto" ? "Rótulo" : "Chamada");
            }
            linha(p, "Estrutura", "Tabela / " + d.nome + " / fio", MARGEM, y + alt, MARGEM + esq, y + alt, false);
        }

        // 3. Normas de aplicação.
        var normas = [
            "Nas telas e peças, todo texto segue os mínimos ao lado: 4,5:1 para texto comum e 3:1 para texto grande.",
            "Branco sobre Criatividade, Ousadia e Conectividade só em títulos e botões grandes. Legendas e textos pequenos vão sobre branco ou cinza gelo.",
            "Sobre Adaptação (limão) e Técnica (cinza gelo), texto sempre em azul-noite.",
            "Cores vivas não são cor de texto sobre branco (no máximo 3,5:1). Elas aparecem em fundos, barras e marcadores.",
            "A cor nunca é o único sinal: cada área ou estado também leva nome, ícone ou rótulo (WCAG 1.4.1)."
        ];
        var altN = [112, 140, 84, 112, 112];
        rotulo(p, "Normas / rótulo", "Normas", colN, TOPO, wN);
        y = TOPO + 40;
        for (i = 0; i < normas.length; i++) {
            linha(p, "Estrutura", "Norma " + dois(i + 1) + " / fio", colN, y, colN + wN, y, false);
            rotulo(p, "Norma " + dois(i + 1) + " / número", dois(i + 1), colN, y + 18, 40);
            texto(p, "Norma " + dois(i + 1), normas[i], colN + 56, y + 14, wN - 56, altN[i] - 14, "Corpo");
            y += altN[i];
        }
    });
    pagina("02 Áreas", 1, "Áreas e cores.", "áreas e cores", function (p) {
        // [papel, área do app, descrição]
        var areas = [
            ["Ação", "Home.", "Início, botão principal e sucesso"],
            ["Trilha", "Aprendizado.", "Trilha de estudos e proficiência"],
            ["Praticar", "Praticar.", "Atividades práticas"],
            ["Comunidade", "Comunidade.", "Comunidade e cursos da comunidade"]
        ];
        var cw = (larguraUtil - 3 * GUTTER) / 4;
        var i, x, d, cor;
        for (i = 0; i < areas.length; i++) {
            d = dadosPaleta(areas[i][0]);
            x = MARGEM + i * (cw + GUTTER);
            cor = d.claro ? cores.fundo : cores.texto;
            ret(p, "Estrutura", d.nome + " / barra", x, TOPO, cw, 680, paleta[areas[i][0]], null, false);
            texto(p, d.nome + " / área", areas[i][1], x + 28, TOPO + 27, cw - 56, 70, "Nome da área", cor);
            rotulo(p, d.nome + " / conceito", d.conceito, x + 28, TOPO + 550, cw - 56, cor);
            texto(p, d.nome + " / uso", areas[i][2], x + 28, TOPO + 580, cw - 56, 56, "Legenda", cor);
            rotulo(p, d.nome + " / hex", d.hex, x + 28, TOPO + 636, cw - 56, cor);
        }
    });
    pagina("02 Tipografia – Display", 1, "tipografia.", "tipografia · display", function (p) {
        paginaTipografia(p, {
            estiloAa: "Aa display", estiloEspecime: "Espécime display", papel: "Primária", familia: "Instrument Sans",
            descricao: "Grotesca contemporânea, precisa e com personalidade. Dá voz ao nome BASE8, aos títulos e aos números de destaque.",
            pesos: PESOS_DISPLAY, reserva: display
        });
    });
    pagina("02 Tipografia – Texto", 1, "tipografia.", "tipografia · texto", function (p) {
        paginaTipografia(p, {
            estiloAa: "Aa texto", estiloEspecime: "Espécime", papel: "Secundária", familia: "Figtree",
            descricao: "Sem serifa geométrica e amigável, confortável de ler em telas pequenas. Carrega o corpo de texto, os botões, os rótulos e as legendas.",
            pesos: PESOS_TEXTO, reserva: regular
        });
    });
    pagina("02 Tipografia – Escala", 1, "escala tipográfica.", "escala tipográfica", function (p) {
        tabela(p, "Escala", ["Nível", "Tamanho", "Peso", "Altura de linha"], [
            ["Título 1", "A preencher", "A preencher", "A preencher"], ["Título 2", "A preencher", "A preencher", "A preencher"],
            ["Título 3", "A preencher", "A preencher", "A preencher"], ["Corpo", "A preencher", "A preencher", "A preencher"],
            ["Legenda", "A preencher", "A preencher", "A preencher"]
        ], [432, 432, 432, 432], MARGEM, TOPO, 110);
    });
    pagina("02 Iconografia", 1, "ícones.", "ícones", function (p) {
        var regras = ["Grade", "Espessura do traço", "Cantos e terminações", "Estilo (contorno ou preenchido)", "Tamanho mínimo"];
        var i, nomes = [];
        for (i = 0; i < regras.length; i++) { campo(p, regras[i], MARGEM, TOPO + i * 128, 510, 60); }
        for (i = 1; i <= 12; i++) { nomes.push("Ícone " + dois(i)); }
        quadros(p, nomes, 696, TOPO, 1128, 380, 6);
        quadros(p, ["Correto", "Fora do padrão"], 696, TOPO + 404, 1128, 230, 2);
    });
    pagina("02 Ilustração", 1, "ilustração.", "ilustração", function (p) {
        var nomes = ["Estilo de ilustração", "Formas e padrões de apoio", "Fotografia"];
        var i, x;
        for (i = 0; i < nomes.length; i++) {
            x = MARGEM + i * 584;
            campo(p, nomes[i], x, TOPO, 560, 100);
            imagem(p, "Inserir exemplos", x, TOPO + 166, 560, 500);
        }
    });

    divisor(2);
    pagina("03 Versões do logo", 2, "versões do logo.", "versões do logo", function (p) {
        tabela(p, "Versões", ["Versão", "Quando usar", "Arquivo"], [
            ["Principal (horizontal)", "A preencher", "A preencher"], ["Empilhada (vertical)", "A preencher", "A preencher"],
            ["Símbolo isolado", "A preencher", "A preencher"], ["Monocromática", "A preencher", "A preencher"], ["Negativa", "A preencher", "A preencher"]
        ], [520, 680, 528], MARGEM, TOPO, 112);
    });
    pagina("03 Área de proteção", 2, "área de proteção.", "área de proteção", function (p) {
        marca(p, "Logo com área de proteção", MARGEM, TOPO, 1100, 680, cores.apagado, true);
        campo(p, "Regra de proteção", 1260, TOPO, 564, 220);
    });
    pagina("03 Tamanho mínimo", 2, "tamanho mínimo.", "tamanho mínimo", function (p) {
        var alturas = [16, 24, 32, 48, 64, 96, 128, 192];
        var i, x;
        campo(p, "Digital (px)", MARGEM, TOPO, 780, 80);
        campo(p, "Impresso (mm)", 984, TOPO, 840, 80);
        for (i = 0; i < alturas.length; i++) {
            x = MARGEM + i * 216;
            marca(p, "Redução " + alturas[i] + " px", x, 760 - alturas[i], alturas[i], alturas[i], cores.apagado, false);
            rotulo(p, "Redução " + alturas[i] + " px / legenda", alturas[i] + " px", x, 784, 190);
        }
        texto(p, "Nota fixa", "O símbolo precisa continuar legível em 16 px (favicon).", MARGEM, 870, larguraUtil, 60, "Corpo");
    });
    pagina("03 Fundos permitidos", 2, "fundos permitidos.", "fundos permitidos", function (p) {
        var fundos = [
            ["Branco", paleta.Fundo, cores.texto, "Branco · logo em azul-noite"],
            ["Verde-água", paleta["Ação"], cores.texto, "Verde-água · logo em azul-noite"],
            ["Limão", paleta.Trilha, cores.texto, "Limão · logo em azul-noite"],
            ["Azul-noite", paleta.Texto, cores.fundo, "Azul-noite · logo em branco"]
        ];
        var cw = (larguraUtil - 3 * GUTTER) / 4;
        var i, x;
        for (i = 0; i < fundos.length; i++) {
            x = MARGEM + i * (cw + GUTTER);
            ret(p, "Estrutura", "Fundo " + fundos[i][0], x, TOPO, cw, 560, fundos[i][1], i === 0 ? cores.linha : null, false);
            marca(p, "Logo sobre " + fundos[i][0], x + 72, TOPO + 120, cw - 144, 320, fundos[i][2], true);
            rotulo(p, "Fundo " + fundos[i][0] + " / legenda", fundos[i][3], x, TOPO + 584, cw);
        }
    });
    pagina("03 Usos incorretos", 2, "usos incorretos.", "usos incorretos", function (p) {
        quadros(p, ["Distorcer ou esticar", "Trocar as cores", "Aplicar sombra, contorno ou efeitos", "Girar", "Usar sobre fundo com pouco contraste", "Alterar a proporção entre símbolo e nome"], MARGEM, TOPO, larguraUtil, 680, 3);
    });

    divisor(3);
    pagina("04 Telas do app", 3, "telas do app.", "telas do app", function (p) {
        quadros(p, ["Onboarding", "Home", "Trilha", "Comunidade"], MARGEM, TOPO, larguraUtil, 680, 4);
    });
    pagina("04 Peças", 3, "peças.", "peças", function (p) {
        quadros(p, ["Ícone do app e favicon", "Peças da campanha", "Redes sociais", "Apresentação da banca"], MARGEM, TOPO, larguraUtil, 680, 2);
    });
    pagina("04 Arquivos e tokens", 3, "arquivos e tokens.", "arquivos e tokens", function (p) {
        tabela(p, "Arquivos", ["Item", "Formato", "Onde fica"], [
            ["Logo", "SVG e PNG", "A preencher"], ["Ícones", "SVG", "A preencher"],
            ["Fontes", "Google Fonts", "lib/fonts.ts (Instrument Sans e Figtree)"], ["Tokens de cor e tipografia", "CSS", "app/globals.css · Figma: coleção Paleta IDV"]
        ], [650, 350, 728], MARGEM, TOPO, 110);
    });
    pagina("Obrigado", null, "", "", function (p) {
        var cores3 = [paleta.Trilha, paleta["Ação"], paleta.Praticar];
        var i;
        for (i = 0; i < 3; i++) { pontual(p, "Obrigado " + (i + 1), "obrigado.", LARGURA / 2, 420 + i * 200, "Fechamento", cores3[i], Justification.CENTER); }
    }, true);

    // ---------- Geração ----------
    var coordenadasAnteriores;
    var coordenadasSalvas = false;
    try {
        regular = fonteSegura(FONTE, null);
        leve = fonteSegura(FONTE_LEVE, regular);
        semi = fonteSegura(FONTE_SEMI, regular);
        display = fonteSegura(FONTE_DISPLAY, semi);
        displayMedio = fonteSegura(FONTE_DISPLAY_MEDIO, display);
        displayForte = fonteSegura(FONTE_DISPLAY_FORTE, display);
        displayRegular = fonteSegura(FONTE_DISPLAY_REGULAR, displayMedio);
        var linhasGrade = Math.ceil(paginas.length / PRANCHETAS_POR_LINHA);
        var totalW = PRANCHETAS_POR_LINHA * LARGURA + (PRANCHETAS_POR_LINHA - 1) * ESPACO_PRANCHETAS;
        var totalH = linhasGrade * ALTURA + (linhasGrade - 1) * ESPACO_PRANCHETAS;
        if (paginas.length > 100 || totalW > 15000 || totalH > 15000 || larguraUtil <= 0 || PRANCHETAS_POR_LINHA < 1) {
            throw new Error("Configuração excede a grade segura de pranchetas. Reduza dimensões, espaçamento ou quantidade.");
        }
        coordenadasAnteriores = app.coordinateSystem;
        coordenadasSalvas = true;
        app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
        doc = app.documents.add(DocumentColorSpace.RGB, LARGURA, ALTURA);
        doc.rulerOrigin = [0, 0];
        var inicial = doc.layers[0];
        var ordem = ["Fundo", "Guias", "Estrutura", "Espaços para imagem", "Logo", "Texto"];
        var i, k;
        for (i = 0; i < ordem.length; i++) { camadas[ordem[i]] = doc.layers.add(); camadas[ordem[i]].name = ordem[i]; }
        inicial.remove();
        var grupo = doc.swatchGroups.add(); grupo.name = "Brandbook";
        var chaves = ["fundo", "texto", "secundario", "linha", "destaque", "apagado"];
        var nomesCores = ["Fundo", "Texto", "Texto secundário", "Linha", "Destaque", "Apagado"];
        for (i = 0; i < chaves.length; i++) {
            k = chaves[i];
            cores[k] = amostraGlobal(grupo, nomesCores[i], CORES[k]);
        }
        var grupoApp = doc.swatchGroups.add(); grupoApp.name = "Paleta do app";
        for (i = 0; i < PALETA.length; i++) {
            paleta[PALETA[i].papel] = amostraGlobal(grupoApp, "App · " + PALETA[i].papel, hexParaRGB(PALETA[i].hex));
        }
        criarEstilo("Título", 46, displayMedio, cores.texto, 1.2, -10);
        criarEstilo("Divisor", 132, displayForte, cores.fundo, 1.1, -20);
        estilos.Divisor.characterAttributes.capitalization = FontCapsOption.ALLCAPS;
        criarEstilo("Número de seção", 30, displayForte, cores.destaque, 1.3, 0);
        criarEstilo("Capa", 260, display, cores.fundo, 1.0, -20);
        criarEstilo("Nome", 300, display, cores.texto, 1.0, -20);
        criarEstilo("Fechamento", 170, display, cores.fundo, 1.0, -20);
        criarEstilo("Número", 150, displayMedio, cores.apagado, 1.0, -20);
        criarEstilo("Subtítulo", 30, leve, cores.texto, 1.3, 0);
        criarEstilo("Corpo", 21, leve, cores.texto, 1.45, 0);
        criarEstilo("Legenda", 17, leve, cores.secundario, 1.4, 0);
        criarEstilo("A preencher", 21, leve, cores.apagado, 1.45, 0);
        criarEstilo("Rótulo", 14, semi, cores.texto, 1.6, 160);
        criarEstilo("Cabeçalho", 14, displayRegular, cores.texto, 1.6, 160);
        criarEstilo("Chamada", 14, leve, cores.texto, 1.6, 160);
        criarEstilo("Amostra", 44, display, cores.texto, 1.0, -10);
        criarEstilo("Botão", 19, semi, cores.fundo, 24 * 1.2 / 19, 0);
        criarEstilo("Razão", 96, display, cores.texto, 1.0, -20);
        criarEstilo("Amostra pequena", 20, display, cores.texto, 1.0, 0);
        criarEstilo("Nome da área", 34, displayMedio, cores.texto, 1.2, -10);
        criarEstilo("Título do cartão", 30, display, cores.texto, 1.2, -10);
        criarEstilo("Marca da interface", 22, display, cores.texto, 1.0, -10);
        criarEstilo("Espécime", 34, regular, cores.texto, 1.35, 0);
        criarEstilo("Espécime display", 34, display, cores.texto, 1.35, 0);
        criarEstilo("Aa display", 380, display, cores.texto, 1.0, -30);
        criarEstilo("Aa texto", 380, regular, cores.texto, 1.0, -30);
        criarEstilo("Peso", 52, regular, cores.texto, 1.1, 0);
        var p, ab, bounds;
        for (i = 0; i < paginas.length; i++) {
            p = paginas[i];
            p.left = -totalW / 2 + (i % PRANCHETAS_POR_LINHA) * (LARGURA + ESPACO_PRANCHETAS);
            p.top = totalH / 2 - Math.floor(i / PRANCHETAS_POR_LINHA) * (ALTURA + ESPACO_PRANCHETAS);
            bounds = [p.left, p.top, p.left + LARGURA, p.top - ALTURA];
            if (i === 0) { ab = doc.artboards[0]; ab.artboardRect = bounds; }
            else { ab = doc.artboards.add(bounds); }
            ab.name = dois(i + 1) + " " + p.nome; criado++;
            base(p, i); p.desenhar(p);
        }
        camadas.Guias.locked = true;
        camadas.Guias.visible = false;
        camadas.Fundo.locked = true;
        doc.activeLayer = camadas.Texto;
        doc.artboards.setActiveArtboardIndex(0);
        doc.selection = null;
        app.redraw();
        alert("Brandbook criado: " + criado + " pranchetas.\nTexto: " + leve.name + " / " + regular.name + " / " + semi.name + "\nDisplay: " + displayRegular.name + " / " + displayMedio.name + " / " + display.name + " / " + displayForte.name + "\n\nSalve como .ai. Edite as amostras nos grupos Brandbook e Paleta do app e os estilos de parágrafo.\nAs guias estão na camada Guias, inicialmente oculta." + (avisos.length ? "\n\n" + avisos.join("\n") : ""));
    } catch (erro) {
        alert("Não foi possível concluir o brandbook.\nPranchetas criadas: " + criado + ".\n" + erro.message + (erro.line ? "\nLinha: " + erro.line : "") + "\nSe houver um documento parcial aberto, ele foi preservado para inspeção.");
    } finally {
        if (coordenadasSalvas) { app.coordinateSystem = coordenadasAnteriores; }
    }
}());
