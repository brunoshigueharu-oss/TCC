#target illustrator
/* Logo oficial BASE8 (24/11/2026): "BASE" em Instrument Sans Bold + bola 8 colorida.
   Parte do rascunho do Bruno (fora das pranchetas do Brandbook_BASE8.ai: texto "BASE" 300 pt,
   tracking -20, e o grupo "bola 8 cor") e acerta as medidas num grid de módulo u.

   SISTEMA DE MEDIDAS
   u = espessura do traço das letras (braço do E) = altura das maiúsculas / 7.
   - maiúsculas: 7u (linha de base a linha das maiúsculas)
   - bola: 9u de diâmetro, centrada na altura das maiúsculas (3,5u) -> passa 1u acima e 1u abaixo
   - espaço entre o E e a bola: 1,5u
   - logo inteiro: 34u x 9u
   - área de proteção: 3u em volta
   No rascunho a bola tinha 8,97u e o espaço 1,4u: os acertos são pequenos (< 1 %).

   Gera um documento novo com 5 pranchetas (principal, azul-noite, branca, negativa, construção),
   salva BASE8_logo.ai e exporta SVG, PNG (2x, transparente) e PDF na mesma pasta.
   Não mexe no brandbook, não fecha nada. ES3. */
(function () {
    var PASTA = new File($.fileName).parent;
    var bb = app.documents.getByName("Brandbook_BASE8.ai");
    var antes = app.coordinateSystem;
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    var log = [];

    function rgb(r, g, b) { var c = new RGBColor(); c.red = r; c.green = g; c.blue = b; return c; }
    var AZUL = rgb(27, 31, 59), BRANCO = rgb(255, 255, 255), ROSA = rgb(255, 72, 176),
        LINHA = rgb(213, 215, 224), GELO = rgb(241, 242, 246);

    // ---------- 1. acha o rascunho ----------
    var tf = null, bola = null, i, j;
    var cam = bb.layers.getByName("Texto");
    for (i = 0; i < cam.pageItems.length; i++) {
        var it = cam.pageItems[i];
        if (it.typename === "TextFrame" && it.contents === "BASE" && it.geometricBounds[0] < -6000) { tf = it; }
    }
    // a bola do rascunho ("bola 8 cor") ficou com as manchas sem degradê; usa a da p. 20, mesmo desenho
    var camL = bb.layers.getByName("Logo");
    for (i = 0; i < camL.pageItems.length; i++) { if (camL.pageItems[i].name === "03 Logo simplificada / Principal") { bola = camL.pageItems[i]; } }
    if (!tf || !bola) { return "rascunho não encontrado"; }

    // ---------- 2. documento novo ----------
    var d = app.documents.add(DocumentColorSpace.RGB, 1400, 600);
    var L = d.layers[0]; L.name = "Logo";
    var prot = L.groupItems.add(); prot.name = "protótipos";

    // letras: contorna uma cópia do texto
    var t2 = tf.duplicate(L, ElementPlacement.PLACEATEND);
    var letras = t2.createOutline();
    // ordem dos glifos no grupo: E, S, A, B -> mede pelo x
    var gl = [];
    for (i = 0; i < letras.pageItems.length; i++) { gl.push(letras.pageItems[i]); }
    gl.sort(function (a, b) { return a.geometricBounds[0] - b.geometricBounds[0]; });
    var gB = gl[0], gE = gl[3];
    var base = gB.geometricBounds[3];               // pé do B = linha de base
    var H = gB.geometricBounds[1] - base;           // altura das maiúsculas
    var U = H / 7;
    letras.translate(-gB.geometricBounds[0], -base); // B encostado em x = 0, base em y = 0
    var xE = gE.geometricBounds[2];                  // fim do E
    log.push("H = " + H.toFixed(3) + "  u = " + U.toFixed(4) + "  fim do E = " + (xE / U).toFixed(3) + "u");
    function pinta(item, cor) {
        if (item.typename === "CompoundPathItem") { for (var k = 0; k < item.pathItems.length; k++) { item.pathItems[k].fillColor = cor; } }
        else if (item.typename === "PathItem") { item.fillColor = cor; }
        else if (item.typename === "GroupItem") { for (var m = 0; m < item.pageItems.length; m++) { pinta(item.pageItems[m], cor); } }
    }
    pinta(letras, AZUL);
    letras.name = "BASE";
    letras.move(prot, ElementPlacement.PLACEATEND);

    // bola: duplica, mede pelo recorte da camada "bola" e ajusta para 9u
    // copiar e colar (duplicate() entre documentos perde os degradês de forma livre da bola)
    function colar(item, docOrigem) {
        app.activeDocument = docOrigem; docOrigem.selection = null;
        var lay = item.layer, trav = lay.locked; lay.locked = false;
        item.selected = true; app.copy(); docOrigem.selection = null; lay.locked = trav;
        app.activeDocument = d; d.activeLayer = L; d.selection = null;
        app.paste();
        var r = d.selection[0]; d.selection = null;
        if (docOrigem === d) { var a = item.geometricBounds, b = r.geometricBounds; r.translate(a[0] - b[0], a[1] - b[1]); }
        return r;
    }
    var b2 = colar(bola, bb);
    function recorte(g) {
        for (var k = 0; k < g.pageItems.length; k++) { if (g.pageItems[k].name === "bola") { return g.pageItems[k].pageItems[0]; } }
        return null;
    }
    var rc = recorte(b2).geometricBounds;
    var D0 = rc[2] - rc[0], D = 9 * U;
    log.push("bola do rascunho = " + (D0 / U).toFixed(3) + "u -> 9u");
    var s = D / D0 * 100;
    b2.resize(s, s, true, true, true, true, 100, Transformation.CENTER);
    rc = recorte(b2).geometricBounds;
    var CX = xE + 1.5 * U + D / 2, CY = 3.5 * U;
    b2.translate(CX - (rc[0] + rc[2]) / 2, CY - (rc[1] + rc[3]) / 2);
    b2.name = "bola 8";
    b2.move(prot, ElementPlacement.PLACEATEND);
    var W = CX + D / 2;
    log.push("largura do logo = " + (W / U).toFixed(3) + "u");

    // bola de uma cor: círculo com o 8 vazado (Pathfinder subtrair)
    function bolaChapada(cor) {
        var c = L.pathItems.ellipse(CY + D / 2, CX - D / 2, D, D);
        c.filled = true; c.fillColor = cor; c.stroked = false;
        var oito = b2.pageItems[0].duplicate(L, ElementPlacement.PLACEATBEGINNING);
        d.selection = null; c.selected = true; oito.selected = true;
        app.executeMenuCommand("group");
        app.executeMenuCommand("Live Pathfinder Subtract");
        app.executeMenuCommand("expandStyle");
        var r = d.selection[0];
        d.selection = null;
        pinta(r, cor);
        return r;
    }

    // ---------- 3. versões ----------
    var PASSO = 9 * U + 200;
    function montar(nome, oy, corLetras, chapada) {
        var g = L.groupItems.add(); g.name = "logo / " + nome;
        var l = letras.duplicate(g, ElementPlacement.PLACEATEND); pinta(l, corLetras);
        if (chapada) { var bc = bolaChapada(chapada); bc.name = "bola 8"; bc.move(g, ElementPlacement.PLACEATEND); }
        else { var bc2 = colar(b2, d); bc2.move(g, ElementPlacement.PLACEATEND); }
        g.translate(0, oy);
        return g;
    }
    var vers = [["principal", AZUL, null], ["azul-noite", AZUL, AZUL], ["branca", BRANCO, BRANCO], ["negativa", BRANCO, null]];
    var abs = [];
    for (i = 0; i < vers.length; i++) {
        var oy = -i * PASSO;
        montar(vers[i][0], oy, vers[i][1], vers[i][2]);
        abs.push(["BASE8 logo - " + vers[i][0], [0, oy + 8 * U, W, oy - U]]);
    }
    // fundo de conferência para as versões claras (camada não exportada)
    var F = d.layers.add(); F.name = "fundo de conferência (não exportar)"; F.zOrder(ZOrderMethod.SENDTOBACK);
    for (i = 2; i < 4; i++) {
        var r0 = abs[i][1];
        var fr = F.pathItems.rectangle(r0[1] + U, r0[0] - U, r0[2] - r0[0] + 2 * U, r0[1] - r0[3] + 2 * U);
        fr.fillColor = AZUL; fr.stroked = false;
    }

    // ---------- 4. construção ----------
    var oyC = -4 * PASSO - 4 * U;
    var C = L.groupItems.add(); C.name = "construção";
    function ret(g, x0, y0, x1, y1, cor) { var r = g.pathItems.rectangle(y1, x0, x1 - x0, y1 - y0); r.filled = true; r.fillColor = cor; r.stroked = false; return r; }
    function linha(g, x0, y0, x1, y1, cor, esp, trac) {
        var p = g.pathItems.add(); p.setEntirePath([[x0, y0], [x1, y1]]);
        p.filled = false; p.stroked = true; p.strokeColor = cor; p.strokeWidth = esp;
        if (trac) { p.strokeDashes = [6, 4]; }
        return p;
    }
    var fonte = null;
    try { fonte = app.textFonts.getByName("InstrumentSans-Medium"); } catch (e1) {}
    if (!fonte) { for (i = 0; i < app.textFonts.length; i++) { if (app.textFonts[i].family === "Instrument Sans" && app.textFonts[i].style === "Medium") { fonte = app.textFonts[i]; break; } } }
    function rotulo(g, txt, cx, cy, cor) {
        var t = g.textFrames.add(); t.contents = txt;
        var a = t.textRange.characterAttributes; a.size = 18; a.fillColor = cor || AZUL; if (fonte) { a.textFont = fonte; }
        var b = t.geometricBounds; t.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
        t.name = "rótulo " + txt;
        return t;
    }
    function cota(g, x0, y0, x1, y1) { // linha de cota com marcas nas pontas
        var tk = 0.3 * U;
        linha(g, x0, y0, x1, y1, ROSA, 1);
        if (x0 === x1) { linha(g, x0 - tk, y0, x0 + tk, y0, ROSA, 1); linha(g, x1 - tk, y1, x1 + tk, y1, ROSA, 1); }
        else { linha(g, x0, y0 - tk, x0, y0 + tk, ROSA, 1); linha(g, x1, y1 - tk, x1, y1 + tk, ROSA, 1); }
    }
    var gF = C.groupItems.add(); gF.name = "fundo";
    ret(gF, -3 * U, -4 * U, W + 3 * U, 11 * U, GELO);
    ret(gF, 0, -U, W, 8 * U, BRANCO);
    var gG = C.groupItems.add(); gG.name = "grade (u)";
    for (i = -3; i <= 37; i++) { linha(gG, i * U, -4 * U, i * U, 11 * U, LINHA, 0.5); }
    for (i = -4; i <= 11; i++) { linha(gG, -3 * U, i * U, W + 3 * U, i * U, LINHA, 0.5); }
    var gLg = C.groupItems.add(); gLg.name = "logo";
    var gM = C.groupItems.add(); gM.name = "módulo";
    var mod = ret(gM, xE - U, 0, xE, U, ROSA); mod.opacity = 45;
    letras.duplicate(gLg, ElementPlacement.PLACEATEND); colar(b2, d).move(gLg, ElementPlacement.PLACEATEND);
    var gK = C.groupItems.add(); gK.name = "linhas-chave";
    var X0 = -3 * U, X1 = W + 3 * U;
    linha(gK, X0, 0, X1, 0, ROSA, 1); linha(gK, X0, 7 * U, X1, 7 * U, ROSA, 1);
    linha(gK, X0, -U, X1, -U, ROSA, 1); linha(gK, X0, 8 * U, X1, 8 * U, ROSA, 1);
    linha(gK, X0, 3.5 * U, X1, 3.5 * U, ROSA, 1, true);
    linha(gK, 0, -4 * U, 0, 11 * U, ROSA, 1); linha(gK, xE, -4 * U, xE, 11 * U, ROSA, 1);
    linha(gK, CX - D / 2, -4 * U, CX - D / 2, 11 * U, ROSA, 1); linha(gK, W, -4 * U, W, 11 * U, ROSA, 1);
    linha(gK, CX, -4 * U, CX, 11 * U, ROSA, 1, true);
    var circ = gK.pathItems.ellipse(CY + D / 2, CX - D / 2, D, D); circ.filled = false; circ.stroked = true; circ.strokeColor = ROSA; circ.strokeWidth = 1;
    var gC = C.groupItems.add(); gC.name = "cotas";
    cota(gC, -U, 0, -U, 7 * U); rotulo(gC, "7u", -2.1 * U, 3.5 * U);
    cota(gC, -U, 7 * U, -U, 8 * U); rotulo(gC, "1u", -2.1 * U, 7.5 * U);
    cota(gC, -U, -U, -U, 0); rotulo(gC, "1u", -2.1 * U, -0.5 * U);
    cota(gC, W + U, -U, W + U, 8 * U); rotulo(gC, "9u", W + 2.1 * U, 3.5 * U);
    cota(gC, xE, 9.5 * U, CX - D / 2, 9.5 * U); rotulo(gC, "1,5u", (xE + CX - D / 2) / 2, 10.35 * U);
    cota(gC, 0, -2.5 * U, W, -2.5 * U); rotulo(gC, "34u", W / 2, -3.35 * U);
    cota(gC, -3 * U, 9.5 * U, 0, 9.5 * U); rotulo(gC, "3u", -1.5 * U, 10.35 * U);
    rotulo(gC, "u", xE + 0.55 * U, 0.5 * U, ROSA);
    C.translate(0, oyC);
    abs.push(["BASE8 logo - construcao", [-3 * U, oyC + 11 * U, W + 3 * U, oyC - 4 * U]]);

    // protótipos fora de vista (o brandbook copia os grupos "logo / ...")
    prot.hidden = true;
    t2 = null;

    // ---------- 5. pranchetas ----------
    var ab0 = d.artboards[0];
    ab0.artboardRect = abs[0][1]; ab0.name = abs[0][0];
    for (i = 1; i < abs.length; i++) { var nb = d.artboards.add(abs[i][1]); nb.name = abs[i][0]; }

    // ---------- 6. salva e exporta ----------
    var ai = new File(PASTA + "/BASE8_logo.ai");
    d.saveAs(ai, new IllustratorSaveOptions());
    F.visible = false;
    for (i = 0; i < 4; i++) {
        d.artboards.setActiveArtboardIndex(i);
        var nome = abs[i][0].replace("BASE8 logo - ", "");
        var so = new ExportOptionsSVG();
        so.embedRasterImages = true; so.fontType = SVGFontType.OUTLINEFONT; so.coordinatePrecision = 3;
        so.saveMultipleArtboards = true; so.artboardRange = String(i + 1);
        d.exportFile(new File(PASTA + "/BASE8_logo_" + nome + ".svg"), ExportType.SVG, so);
        var po = new ExportOptionsPNG24(); po.artBoardClipping = true; po.transparency = true; po.horizontalScale = 200; po.verticalScale = 200; po.antiAliasing = true;
        d.exportFile(new File(PASTA + "/BASE8_logo_" + nome + "@2x.png"), ExportType.PNG24, po);
    }
    F.visible = true;
    d.artboards.setActiveArtboardIndex(4);
    var pc = new ExportOptionsPNG24(); pc.artBoardClipping = true; pc.transparency = false; pc.horizontalScale = 100; pc.verticalScale = 100;
    d.exportFile(new File(PASTA + "/BASE8_logo_construcao.png"), ExportType.PNG24, pc);
    var pdf = new PDFSaveOptions(); pdf.preserveEditability = false;
    d.saveAs(new File(PASTA + "/BASE8_logo.pdf"), pdf);
    d.saveAs(ai, new IllustratorSaveOptions());
    app.coordinateSystem = antes;
    log.push("salvo em " + ai.fsName);
    return log.join("\n");
}());
