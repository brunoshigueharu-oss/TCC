#target illustrator
/* Insere a página "construção do logo." no Brandbook_BASE8.ai aberto, como p. 09 (logo depois de "logo.").
   - prancheta nova no fim da grade; o conteúdo das pp. 09–29 anda uma prancheta para a frente
   - nomes das pranchetas, rodapés, sumário e citações "p. NN" renumerados
   - estrutura (cabeçalho, título, rodapé, fundo, guias) copiada da p. 08
   O conteúdo da página é posto por preencher-paginas-logo.jsx. Rodar uma vez só. Não salva. ES3. */
(function () {
    var d = app.documents.getByName("Brandbook_BASE8.ai");
    var log = [], antes = app.coordinateSystem, travadas = [];
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    try {
        var i, j, k, L;
        for (i = 0; i < d.artboards.length; i++) { if (d.artboards[i].name.indexOf("Construção") >= 0) { return "já existe: " + d.artboards[i].name; } }
        for (L = 0; L < d.layers.length; L++) { if (d.layers[L].locked) { travadas.push(d.layers[L]); d.layers[L].locked = false; } }
        var POS = 8, ULT = d.artboards.length - 1;
        var rU = d.artboards[ULT].artboardRect, LARG = rU[2] - rU[0];
        d.artboards.add([rU[2] + 100, rU[1], rU[2] + 100 + LARG, rU[3]]);
        var rects = [];
        for (i = 0; i < d.artboards.length; i++) { rects.push(d.artboards[i].artboardRect); }
        function onde(b) {
            var cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, a;
            for (a = 0; a < rects.length - 1; a++) { var r = rects[a]; if (cx >= r[0] && cx <= r[2] && cy <= r[1] && cy >= r[3]) { return a; } }
            return -1;
        }
        var por = {};
        for (L = 0; L < d.layers.length; L++) {
            var its = d.layers[L].pageItems;
            for (i = 0; i < its.length; i++) {
                var a = onde(its[i].geometricBounds);
                if (a >= POS) { if (!por[a]) { por[a] = []; } por[a].push(its[i]); }
            }
        }
        var mov = 0;
        for (k = ULT; k >= POS; k--) {
            var de = rects[k], para = rects[k + 1], lista = por[k] || [];
            for (i = 0; i < lista.length; i++) { try { lista[i].translate(para[0] - de[0], para[1] - de[1]); mov++; } catch (e1) { log.push("não movi " + lista[i].name); } }
        }
        function dois(n) { return (n < 10 ? "0" : "") + n; }
        for (j = ULT + 1; j > POS; j--) { d.artboards[j].name = dois(j + 1) + d.artboards[j - 1].name.substr(2); }
        d.artboards[POS].name = dois(POS + 1) + " 02 Construção do logo";
        log.push("movidos " + mov + " itens");

        // rodapés e sumário ("... / página") e citações "p. NN"
        var tf = d.textFrames, n1 = 0, n2 = 0;
        for (i = 0; i < tf.length; i++) {
            var nm = tf[i].name;
            if (nm.length > 9 && nm.substr(nm.length - 9) === " / página") {
                var v = parseInt(tf[i].contents, 10);
                if (!isNaN(v) && v >= POS + 1) { tf[i].contents = dois(v + 1); n1++; }
            } else {
                var c = tf[i].contents;
                if (/p\. \d/.test(c)) {
                    var novo = c.replace(/p\. (\d\d?)/g, function (m, g1) { var x = parseInt(g1, 10); return x >= POS + 1 ? "p. " + (x + 1) : m; });
                    if (novo !== c) { tf[i].contents = novo; n2++; log.push("citação: " + nm); }
                }
            }
        }
        log.push("páginas renumeradas " + n1 + ", citações " + n2);

        // mapa de nomes
        var mapa = {}, p = d.pageItems;
        for (i = 0; i < p.length; i++) { if (p[i].name) { mapa[p[i].name] = p[i]; } }
        // sumário
        var G = "Sumário / Grupo 02 / ", PASSO = 27;
        var abaixo = ["cores", "aplicação das cores", "contraste e acessibilidade", "áreas e cores", "tipografia · display", "tipografia · texto", "escala tipográfica", "ícones", "ilustração"];
        for (i = 0; i < abaixo.length; i++) {
            if (mapa[G + abaixo[i]]) { mapa[G + abaixo[i]].translate(0, -PASSO); }
            if (mapa[G + abaixo[i] + " / página"]) { mapa[G + abaixo[i] + " / página"].translate(0, -PASSO); }
        }
        var s1 = mapa[G + "logo"], s2 = mapa[G + "logo / página"];
        if (s1 && s2) {
            var a1 = s1.duplicate(), a2 = s2.duplicate();
            a1.translate(0, -PASSO); a2.translate(0, -PASSO);
            a1.name = G + "construção do logo"; a1.contents = "construção do logo";
            a2.name = G + "construção do logo / página"; a2.contents = dois(POS + 1);
        } else { log.push("sumário: não achei a linha logo"); }

        // estrutura da página nova copiada da p. 08
        var R = rects[POS + 1 - 1 + 0], RV = rects[POS - 1];
        R = d.artboards[POS].artboardRect;
        var DX = R[0] - RV[0], DY = R[1] - RV[1];
        var PV = "02 Logo / ", PN = "02 Construção do logo / ";
        var cop = 0;
        for (var nome in mapa) {
            if (nome.indexOf(PV) === 0 && nome !== PV + "Nota") {
                var cc = mapa[nome].duplicate(); cc.translate(DX, DY); cc.name = PN + nome.substr(PV.length); cop++;
                if (cc.name === PN + "Título") { cc.contents = "construção do logo."; }
                if (cc.name === PN + "Rodapé / página") { cc.contents = dois(POS + 1); }
            }
        }
        log.push("estrutura copiada: " + cop + " itens; pranchetas " + d.artboards.length);
    } catch (e) {
        log.push("ERRO: " + e.message + " (linha " + e.line + ")");
    } finally {
        for (var t = 0; t < travadas.length; t++) { travadas[t].locked = true; }
        app.coordinateSystem = antes;
    }
    return log.join("\n");
}());
