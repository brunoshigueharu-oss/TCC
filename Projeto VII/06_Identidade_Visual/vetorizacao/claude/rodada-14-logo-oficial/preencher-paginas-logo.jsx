#target illustrator
/* Põe a logo oficial (BASE + bola 8) no Brandbook_BASE8.ai aberto. Depende de:
   - BASE8_logo.ai aberto (gerar-logo-base8.jsx), com os grupos "logo / ..." e "construção"
   - página "construção do logo." já inserida (inserir-pagina-construcao.jsx)
   Páginas: 08 logo, 09 construção, 18 ilustração (recebe a logo ilustrada), 20 versões,
   22 área de proteção, 23 tamanho mínimo, 24 fundos permitidos, 25 usos incorretos.
   Copia por copiar/colar (duplicate() entre documentos perde os degradês da bola). Não salva. ES3. */
(function () {
    var d = app.documents.getByName("Brandbook_BASE8.ai");
    var M = app.documents.getByName("BASE8_logo.ai");
    var log = [], antes = app.coordinateSystem, travadas = [];
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    function rgb(r, g, b) { var c = new RGBColor(); c.red = r; c.green = g; c.blue = b; return c; }
    var AZUL = rgb(27, 31, 59), ROSA = rgb(255, 72, 176), GELO = rgb(241, 242, 246), LIMAO = rgb(245, 238, 74);
    var XE_U = 23.4985, OV_U = 0.10694, W_U = 34; // fim do E, ultrapassagem do S, largura (em u)
    try {
        var i, k, L;
        for (L = 0; L < d.layers.length; L++) { if (d.layers[L].locked) { travadas.push(d.layers[L]); d.layers[L].locked = false; } }
        var camLogo = d.layers.getByName("Logo"), camTexto = d.layers.getByName("Texto");
        var mapa = {}, p = d.pageItems;
        for (i = 0; i < p.length; i++) { if (p[i].name) { mapa[p[i].name] = p[i]; } }
        function item(n) { if (!mapa[n]) { throw new Error("não achei: " + n); } return mapa[n]; }
        function ab(nome) { for (var a = 0; a < d.artboards.length; a++) { if (d.artboards[a].name.indexOf(nome) >= 0) { return d.artboards[a].artboardRect; } } throw new Error("prancheta " + nome); }

        // fontes do mestre
        var fonte = {};
        for (i = 0; i < M.layers[0].pageItems.length; i++) { var mi = M.layers[0].pageItems[i]; fonte[mi.name] = mi; }
        function colar(nome) {
            app.activeDocument = M; M.selection = null; fonte[nome].selected = true; app.copy(); M.selection = null;
            app.activeDocument = d; d.activeLayer = camLogo; d.selection = null; app.paste();
            var r = d.selection[0]; d.selection = null; return r;
        }
        function filho(g, nome) { for (var q = 0; q < g.pageItems.length; q++) { if (g.pageItems[q].name === nome) { return g.pageItems[q]; } } return null; }
        // coloca uma versão do logo com o B em x0, a linha de base em yb e módulo u
        function logo(versao, nome, x0, yb, u) {
            var g = colar("logo / " + versao); g.name = nome;
            var b = filho(g, "BASE").geometricBounds, s = XE_U * u / (b[2] - b[0]) * 100;
            g.resize(s, s, true, true, true, true, 100, Transformation.CENTER);
            b = filho(g, "BASE").geometricBounds;
            g.translate(x0 - b[0], (yb - OV_U * u) - b[3]);
            return g;
        }
        // centrado numa caixa: largura w
        function logoCentro(versao, nome, cx, cy, w) { var u = w / W_U; return logo(versao, nome, cx - w / 2, cy - 3.5 * u, u); }
        var corTexto = item("03 Versões do logo / Versões / linha 1 / Quando usar").textRange.characterAttributes.fillColor;
        function escreve(nome, txt) { var t = item(nome); t.contents = txt; t.textRange.characterAttributes.fillColor = corTexto; return t; }
        function apaga(nome) { if (mapa[nome]) { mapa[nome].remove(); delete mapa[nome]; } }

        // ---------- p. 08 logo. ----------
        var R = ab("02 Logo"), CX = (R[0] + R[2]) / 2;
        var ilustrada = item("logo final / 02 Logo");
        logoCentro("principal", "02 Logo / Logo oficial", CX, R[1] - 520, 1120);
        escreve("02 Logo / Nota", "Logo oficial, de 24/11/2026: BASE em Instrument Sans Bold, azul-noite, com a bola 8 colorida. Construção na p. 09. A logo ilustrada com objetos passa a ser material de divulgação e iconografia (p. 18).");

        // ---------- p. 09 construção do logo. ----------
        R = ab("Construção do logo"); CX = (R[0] + R[2]) / 2;
        var C = colar("construção"); C.name = "02 Construção do logo / Grade";
        var fb = filho(C, "fundo").geometricBounds;
        C.translate(CX - (fb[0] + fb[2]) / 2, (R[1] - 236) - fb[1]);
        var colunas = [
            ["MÓDULO", "u é a espessura do traço das letras. A altura das maiúsculas tem 7u, e todas as medidas do logo são múltiplos de u."],
            ["PROPORÇÕES", "A bola 8 tem 9u de diâmetro, centrada na altura das maiúsculas: passa 1u acima e 1u abaixo das letras. Do E à bola, 1,5u. O logo inteiro mede 34u × 9u."],
            ["ÁREA DE PROTEÇÃO", "3u livres em volta, contados do B e das bordas da bola. Para ampliar ou reduzir, escalar tudo junto, sem mexer nas proporções."]];
        var mR = item("03 Área de proteção / Regra de proteção / rótulo"), mV = item("03 Área de proteção / Regra de proteção / valor");
        var X0 = R[0] + 96, yCol = R[1] - 770;
        for (i = 0; i < colunas.length; i++) {
            var x = X0 + i * 584;
            var tr = mR.duplicate(camTexto, ElementPlacement.PLACEATBEGINNING); tr.name = "02 Construção do logo / " + colunas[i][0] + " / rótulo"; tr.contents = colunas[i][0];
            var b0 = tr.geometricBounds; tr.translate(x - b0[0], yCol - b0[1]);
            var tv = mV.duplicate(camTexto, ElementPlacement.PLACEATBEGINNING); tv.name = "02 Construção do logo / " + colunas[i][0] + " / valor"; tv.contents = colunas[i][1];
            tv.textRange.characterAttributes.fillColor = corTexto;
            var dy = mV.geometricBounds[1] - mR.geometricBounds[1];
            b0 = tv.geometricBounds; tv.translate(x - b0[0], (yCol + dy) - b0[1]);
        }

        // ---------- p. 18 ilustração: recebe a logo ilustrada ----------
        R = ab("02 Ilustração");
        var caixa = null, ind = null;
        for (var nm in mapa) {
            if (nm === "02 Ilustração / Inserir exemplos" && mapa[nm].typename === "PathItem") { if (!caixa || mapa[nm].geometricBounds[0] < caixa.geometricBounds[0]) { caixa = mapa[nm]; } }
        }
        var tfs = camTexto.textFrames;
        for (i = 0; i < tfs.length; i++) { if (tfs[i].name === "02 Ilustração / Inserir exemplos / indicação" && (!ind || tfs[i].geometricBounds[0] < ind.geometricBounds[0])) { ind = tfs[i]; } }
        var cb = caixa.geometricBounds, ib = ilustrada.geometricBounds;
        var sI = (cb[2] - cb[0] - 60) / (ib[2] - ib[0]) * 100;
        ilustrada.resize(sI, sI, true, true, true, true, sI, Transformation.CENTER);
        ib = ilustrada.geometricBounds;
        ilustrada.translate((cb[0] + cb[2]) / 2 - (ib[0] + ib[2]) / 2, (cb[1] + cb[3]) / 2 - 10 - (ib[1] + ib[3]) / 2);
        ilustrada.name = "02 Ilustração / Logo ilustrada";
        if (ind) { ind.contents = "LOGO ILUSTRADA · DIVULGAÇÃO E ICONOGRAFIA"; }
        escreve("02 Ilustração / Estilo de ilustração / valor", "Objetos de trabalho e tecnologia em cores chapadas, com sombras em degradê. A logo ilustrada é só divulgação e iconografia.");

        // ---------- p. 20 versões do logo ----------
        var V = "03 Versões do logo / Versões / ";
        escreve(V + "linha 1 / Arquivo", "BASE8_logo_principal (SVG e PNG), BASE8_logo.ai");
        escreve(V + "linha 4 / Quando usar", "Sobre verde-água e limão: logo inteira em azul-noite, com o 8 vazado. Branca para fotos e fundos escuros");
        escreve(V + "linha 4 / Arquivo", "BASE8_logo_azul-noite e BASE8_logo_branca (SVG e PNG)");
        escreve(V + "linha 5 / Quando usar", "Sobre azul-noite: BASE em branco, bola colorida");
        escreve(V + "linha 5 / Arquivo", "BASE8_logo_negativa (SVG e PNG)");

        // ---------- p. 22 área de proteção ----------
        apaga("logo final / 03 Área de proteção");
        var bx = item("03 Área de proteção / Logo com área de proteção").geometricBounds;
        var u = 24, gx = (bx[0] + bx[2]) / 2 - 17 * u, gy = (bx[1] + bx[3]) / 2 - 3.5 * u; // B em gx, base em gy
        var A = camLogo.groupItems.add(); A.name = "03 Área de proteção / Desenho";
        function ret(g, x0, y0, x1, y1, cor) { var r = g.pathItems.rectangle(y1, x0, x1 - x0, y1 - y0); if (cor) { r.filled = true; r.fillColor = cor; } else { r.filled = false; } r.stroked = false; return r; }
        function linha(g, x0, y0, x1, y1, trac) { var q = g.pathItems.add(); q.setEntirePath([[x0, y0], [x1, y1]]); q.filled = false; q.stroked = true; q.strokeColor = ROSA; q.strokeWidth = 1; if (trac) { q.strokeDashes = [5, 4]; } return q; }
        ret(A, gx - 3 * u, gy - 4 * u, gx + 37 * u, gy + 11 * u, GELO);
        ret(A, gx, gy - u, gx + 34 * u, gy + 8 * u, rgb(255, 255, 255));
        var borda = ret(A, gx - 3 * u, gy - 4 * u, gx + 37 * u, gy + 11 * u, null); borda.stroked = true; borda.strokeColor = ROSA; borda.strokeWidth = 1; borda.strokeDashes = [5, 4];
        var lg = logo("principal", "03 Área de proteção / Logo", gx, gy, u); lg.move(A, ElementPlacement.PLACEATBEGINNING);
        // marcas de 3u nos quatro lados
        var cantos = [[gx - 3 * u, gy + 3.5 * u, gx, gy + 3.5 * u], [gx + 34 * u, gy + 3.5 * u, gx + 37 * u, gy + 3.5 * u], [gx + 17 * u, gy + 8 * u, gx + 17 * u, gy + 11 * u], [gx + 17 * u, gy - u, gx + 17 * u, gy - 4 * u]];
        var fonteR = null; try { fonteR = app.textFonts.getByName("InstrumentSans-Medium"); } catch (e2) {}
        for (k = 0; k < 4; k++) {
            var c4 = cantos[k]; linha(A, c4[0], c4[1], c4[2], c4[3]);
            var t3 = A.textFrames.add(); t3.contents = "3u"; var ca = t3.textRange.characterAttributes; ca.size = 15; ca.fillColor = ROSA; if (fonteR) { ca.textFont = fonteR; }
            var tb = t3.geometricBounds, mx = (c4[0] + c4[2]) / 2, my = (c4[1] + c4[3]) / 2;
            if (k < 2) { t3.translate(mx - (tb[0] + tb[2]) / 2, my + 14 - (tb[1] + tb[3]) / 2); } else { t3.translate(mx + 22 - (tb[0] + tb[2]) / 2, my - (tb[1] + tb[3]) / 2); }
        }
        escreve("03 Área de proteção / Regra de proteção / valor", "Em volta do logo fica livre uma área de 3u (u = espessura do traço das letras, 1/7 da altura das maiúsculas), contada a partir do B e das bordas da bola. Nenhum texto, imagem ou borda de página entra nessa área.");

        // ---------- p. 23 tamanho mínimo ----------
        var larg = [48, 64, 96, 128, 192, 256, 384];
        for (i = 0; i < larg.length; i++) {
            var gn = "logo final / 03 Tamanho mínimo " + larg[i] + " px";
            var ob = item(gn).geometricBounds; apaga(gn);
            var uu = larg[i] / W_U;
            var nl = logo("principal", "03 Tamanho mínimo / Logo " + larg[i] + " px", ob[0], ob[3] + uu, uu);
            if (larg[i] < 96) { nl.opacity = 30; }
        }
        escreve("03 Tamanho mínimo / Digital (px) / valor", "96 px de largura");
        escreve("03 Tamanho mínimo / Impresso (mm) / valor", "25 mm de largura");
        escreve("03 Tamanho mínimo / Nota fixa", "Largura do logo em cada exemplo. Abaixo do mínimo (48 e 64 px, apagados) o nome perde a leitura: nesses casos usar a logo simplificada (bola 8, p. 21).");

        // ---------- p. 24 fundos permitidos ----------
        var fundos = [["Branco", "principal"], ["Verde-água", "azul-noite"], ["Limão", "azul-noite"], ["Azul-noite", "negativa"]];
        for (i = 0; i < fundos.length; i++) {
            var fn = "logo final / 03 Fundos permitidos " + fundos[i][0];
            var fb2 = item("03 Fundos permitidos / Fundo " + fundos[i][0]).geometricBounds; apaga(fn);
            logoCentro(fundos[i][1], "03 Fundos permitidos / Logo " + fundos[i][0], (fb2[0] + fb2[2]) / 2, (fb2[1] + fb2[3]) / 2, 334);
        }
        escreve("03 Fundos permitidos / Fundo Azul-noite / legenda", "AZUL-NOITE · LOGO NEGATIVA").textRange.characterAttributes.fillColor = item("03 Fundos permitidos / Fundo Limão / legenda").textRange.characterAttributes.fillColor;

        // ---------- p. 25 usos incorretos ----------
        var U2 = "03 Usos incorretos / ";
        function noQuadro(rot, versao) {
            var qb = item(U2 + rot).geometricBounds;
            return logoCentro(versao, U2 + rot + " / exemplo", (qb[0] + qb[2]) / 2, (qb[1] + qb[3]) / 2 - 14, 400);
        }
        var e1 = noQuadro("Distorcer ou esticar", "principal"); e1.resize(70, 150, true, true, true, true, 100, Transformation.CENTER);
        var e2 = noQuadro("Trocar as cores", "principal"); var l2 = filho(e2, "BASE");
        (function pinta(it) { if (it.typename === "CompoundPathItem") { for (var z = 0; z < it.pathItems.length; z++) { it.pathItems[z].fillColor = ROSA; } } else if (it.typename === "PathItem") { it.fillColor = ROSA; } else if (it.typename === "GroupItem") { for (var w = 0; w < it.pageItems.length; w++) { pinta(it.pageItems[w]); } } }(l2));
        var e3 = noQuadro("Aplicar sombra, contorno ou efeitos", "principal"); var l3 = filho(e3, "BASE");
        (function contorna(it) { if (it.typename === "CompoundPathItem") { for (var z = 0; z < it.pathItems.length; z++) { var pz = it.pathItems[z]; pz.stroked = true; pz.strokeColor = ROSA; pz.strokeWidth = 3; } } else if (it.typename === "GroupItem") { for (var w = 0; w < it.pageItems.length; w++) { contorna(it.pageItems[w]); } } }(l3));
        var e4 = noQuadro("Girar", "principal"); e4.rotate(12);
        var qb5 = item(U2 + "Usar sobre fundo com pouco contraste").geometricBounds;
        var f5 = camLogo.pathItems.rectangle(qb5[1] - 44, qb5[0] + 12, qb5[2] - qb5[0] - 24, qb5[1] - qb5[3] - 56); f5.filled = true; f5.fillColor = LIMAO; f5.stroked = false; f5.name = U2 + "Usar sobre fundo com pouco contraste / fundo";
        var e5 = noQuadro("Usar sobre fundo com pouco contraste", "branca"); e5.translate(0, -8);
        var e6 = noQuadro("Alterar a proporção entre símbolo e nome", "principal");
        var bo = filho(e6, "bola 8"); if (bo) { bo.resize(55, 55, true, true, true, true, 100, Transformation.BOTTOMLEFT); }

        log.push("ok");
    } catch (e) {
        log.push("ERRO: " + e.message + " (linha " + e.line + ")");
    } finally {
        for (var t = 0; t < travadas.length; t++) { travadas[t].locked = true; }
        app.coordinateSystem = antes;
    }
    return log.join("\n");
}());
