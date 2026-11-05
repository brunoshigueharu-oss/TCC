// Abre base8-logo.svg e reorganiza: 1 camada por letra, 1 subcamada por objeto.
var D = "/Users/brunohigashi/Documents/Claude Code/TCC/Projeto VII/06_Identidade_Visual/vetorizacao/claude/rodada-9-base8";
var doc = app.open(new File(D + "/base8-logo.svg"));
var base = doc.layers[0];
var ROT = {"polvo":"polvo","letra-B":"B","letra-A":"A","letra-S":"S","letra-E":"E","numero-8":"8"};
function achar(container, nome) {
  for (var i = 0; i < container.pageItems.length; i++) {
    var it = container.pageItems[i];
    if (it.name == nome) return it;
    if (it.typename == "GroupItem") { var r = achar(it, nome); if (r) return r; }
  }
  return null;
}
var ordem = ["polvo","letra-B","letra-A","letra-S","letra-E","numero-8"];
for (var k = ordem.length - 1; k >= 0; k--) {
  var g = achar(base, ordem[k]);
  if (!g) continue;
  var lay = doc.layers.add(); lay.name = ROT[ordem[k]];
  var filhos = [];
  for (var j = 0; j < g.pageItems.length; j++) filhos.push(g.pageItems[j]);
  for (var j = filhos.length - 1; j >= 0; j--) {
    var sub = lay.layers.add(); sub.name = filhos[j].name;
    filhos[j].move(sub, ElementPlacement.PLACEATBEGINNING);
  }
  // ordem das subcamadas igual à do SVG (primeiro objeto no fundo)
}
// fundo branco vai para uma camada própria, travada
var fundo = achar(base, "fundo");
var lf = doc.layers.add(); lf.name = "fundo";
if (fundo) fundo.move(lf, ElementPlacement.PLACEATBEGINNING);
lf.zOrder(ZOrderMethod.SENDTOBACK);
// rascunho de referência
var lr = doc.layers.add(); lr.name = "rascunho (referência)";
var img = lr.placedItems.add(); img.file = new File(D + "/../../fontes/rascunho-logo-base8.jpeg");
var ab = doc.artboards[0].artboardRect; // [l, t, r, b]
// SVG: viewBox começa em (300, 735) e 1 unidade = 1 pt; rascunho tem 2732 x 2048
img.width = 2732; img.height = 2048;
img.left = ab[0] - 300; img.top = ab[1] + 735;
img.opacity = 40;
lr.zOrder(ZOrderMethod.SENDTOBACK); lf.zOrder(ZOrderMethod.SENDTOBACK);
lr.locked = true; lr.visible = false; lf.locked = true;
try { if (base.pageItems.length == 0) base.remove(); } catch (e) {}
var op = new IllustratorSaveOptions(); op.pdfCompatible = true;
doc.saveAs(new File(D + "/BASE8_logo_rodada9.ai"), op);
"ok " + doc.layers.length;
