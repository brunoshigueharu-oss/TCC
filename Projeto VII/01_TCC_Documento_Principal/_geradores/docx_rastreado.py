"""Ferramentas para editar o relatório .docx com alterações controladas (autor "Claude").

Uso: importar em um script de atualização. Trabalha direto no XML (lxml).
"""
import copy, os, re, shutil, unicodedata, zipfile
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"
AUTHOR = "Claude"
TEXT_WIDTH_EMU = 5760000  # 16 cm
TABLE_WIDTH = 9071


def q(tag):
    return "{%s}%s" % (W, tag)


class Doc:
    def __init__(self, src_docx, workdir, date, first_id=30000):
        if os.path.exists(workdir):
            shutil.rmtree(workdir)
        with zipfile.ZipFile(src_docx) as z:
            z.extractall(workdir)
        self.dir = workdir
        self.date = date
        self._id = first_id
        self.tree = etree.parse(os.path.join(workdir, "word/document.xml"))
        self.body = self.tree.getroot().find(q("body"))
        self.rels_path = os.path.join(workdir, "word/_rels/document.xml.rels")
        self.rels = etree.parse(self.rels_path)
        self.next_docpr = 1 + max([900] + [int(v) for v in re.findall(r'docPr id="(\d+)"', etree.tostring(self.tree, encoding="unicode"))])

    # ---------- básicos
    def mark(self, el):
        self._id += 1
        el.set(q("id"), str(self._id)); el.set(q("author"), AUTHOR); el.set(q("date"), self.date)
        return el

    def el(self, tag, **attrs):
        e = etree.Element(q(tag))
        for k, v in attrs.items():
            e.set(q(k), v)
        return e

    @staticmethod
    def text(p):
        return "".join(t.text or "" for t in p.iter(q("t")))

    @staticmethod
    def style(p):
        s = p.find(q("pPr") + "/" + q("pStyle"))
        return s.get(q("val")) if s is not None else ""

    def find(self, startswith, style=None, nth=0):
        hits = [p for p in self.body if p.tag == q("p") and self.text(p).startswith(startswith)
                and (style is None or self.style(p) == style)]
        if len(hits) <= nth:
            raise LookupError("não achei: %r (estilo %r)" % (startswith, style))
        return hits[nth]

    # ---------- construção de runs e parágrafos
    def run(self, text, bold=False, size=None):
        r = self.el("r"); rpr = self.el("rPr")
        if bold: rpr.append(self.el("b"))
        if size: rpr.append(self.el("sz", val=str(size)))
        rpr.append(self.el("lang", val="pt-BR")); r.append(rpr)
        t = self.el("t"); t.text = text; t.set(XML_SPACE, "preserve"); r.append(t)
        return r

    def runs(self, text, size=None, all_bold=False):
        """Aceita **negrito** no meio do texto."""
        out = []
        for i, part in enumerate(re.split(r"\*\*(.+?)\*\*", text)):
            if part:
                out.append(self.run(part, bold=all_bold or i % 2 == 1, size=size))
        return out

    def para(self, text, style=None, keep_next=False, spacing=None, ind_first0=False, jc=None, size=None, bold=False):
        p = self.el("p"); ppr = self.el("pPr")
        if style: ppr.append(self.el("pStyle", val=style))
        if keep_next: ppr.append(self.el("keepNext"))
        if spacing: ppr.append(self.el("spacing", **spacing))
        if ind_first0: ppr.append(self.el("ind", firstLine="0"))
        if jc: ppr.append(self.el("jc", val=jc))
        rpr = self.el("rPr"); rpr.append(self.mark(self.el("ins"))); ppr.append(rpr)
        p.append(ppr)
        ins = self.mark(self.el("ins"))
        for r in self.runs(text, size=size, all_bold=bold):
            ins.append(r)
        p.append(ins)
        return p

    def h(self, level, text):
        return self.para(text, style="Ttulo%d" % level)

    def bullet(self, text):
        return self.para(text, style="Commarcadores")

    def caption(self, text):
        return self.para(text, style="Legenda", keep_next=True)

    def fonte(self, text="Fonte: elaborado pelo autor (2026)."):
        return self.para(text, spacing={"line": "240", "lineRule": "auto", "after": "240"}, ind_first0=True, jc="left", size=20)

    def figure(self, image_path, number, caption, fonte="Fonte: elaborado pelo autor (2026)."):
        from PIL import Image
        w, h = Image.open(image_path).size
        cx = TEXT_WIDTH_EMU; cy = int(cx * h / w)
        ext = os.path.splitext(image_path)[1].lower().lstrip(".")
        name = "figura%02d.%s" % (number, ext)
        shutil.copy(image_path, os.path.join(self.dir, "word/media", name))
        rid = "rIdFig%d" % number
        rel = etree.SubElement(self.rels.getroot(), "{http://schemas.openxmlformats.org/package/2006/relationships}Relationship")
        rel.set("Id", rid); rel.set("Type", R + "/image"); rel.set("Target", "media/" + name)
        self._ensure_content_type(ext)
        did = self.next_docpr; self.next_docpr += 1
        descr = caption.split("—", 1)[-1].strip().replace('"', "'")
        xml = (
            '<w:r xmlns:w="%s" xmlns:r="%s" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:rPr><w:noProof/></w:rPr><w:drawing>'
            '<wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="%d" cy="%d"/><wp:effectExtent l="0" t="0" r="0" b="0"/>'
            '<wp:docPr id="%d" name="Figura %d" descr="%s"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
            '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
            '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="%d" name="%s"/><pic:cNvPicPr/></pic:nvPicPr>'
            '<pic:blipFill><a:blip r:embed="%s"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
            '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="%d" cy="%d"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
            '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>'
        ) % (W, R, cx, cy, did, number, descr, did, name, rid, cx, cy)
        run = etree.fromstring(xml)
        p = self.el("p"); ppr = self.el("pPr")
        ppr.append(self.el("keepNext")); ppr.append(self.el("spacing", line="240", lineRule="auto"))
        ppr.append(self.el("ind", firstLine="0")); ppr.append(self.el("jc", val="center"))
        rpr = self.el("rPr"); rpr.append(self.mark(self.el("ins"))); ppr.append(rpr); p.append(ppr)
        ins = self.mark(self.el("ins")); ins.append(run); p.append(ins)
        return [self.caption(caption), p, self.fonte(fonte)]

    def _ensure_content_type(self, ext):
        path = os.path.join(self.dir, "[Content_Types].xml")
        t = etree.parse(path); root = t.getroot()
        ns = "{http://schemas.openxmlformats.org/package/2006/content-types}"
        if not any(d.get("Extension") == ext for d in root.findall(ns + "Default")):
            d = etree.Element(ns + "Default"); d.set("Extension", ext)
            d.set("ContentType", {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png"}[ext])
            root.insert(0, d)
            t.write(path, xml_declaration=True, encoding="UTF-8", standalone=True)

    def table(self, caption, header, rows, widths, fonte="Fonte: elaborado pelo autor (2026)."):
        assert sum(widths) == TABLE_WIDTH, sum(widths)
        tbl = self.el("tbl"); pr = self.el("tblPr")
        pr.append(self.el("tblStyle", val="Tabelacomgrade")); pr.append(self.el("tblW", type="auto", w="0"))
        pr.append(self.el("jc", val="center")); pr.append(self.el("tblLayout", type="fixed"))
        pr.append(self.el("tblLook", firstColumn="1", firstRow="1", lastColumn="0", lastRow="0", noHBand="0", noVBand="1", val="04A0"))
        tbl.append(pr)
        grid = self.el("tblGrid")
        for w in widths: grid.append(self.el("gridCol", w=str(w)))
        tbl.append(grid)
        for ri, row in enumerate([header] + rows):
            assert len(row) == len(widths), row
            tr = self.el("tr"); trpr = self.el("trPr")
            if ri == 0: trpr.append(self.el("tblHeader"))
            trpr.append(self.mark(self.el("ins"))); tr.append(trpr)
            for w, cell in zip(widths, row):
                tc = self.el("tc"); tcpr = self.el("tcPr"); tcpr.append(self.el("tcW", type="dxa", w=str(w))); tc.append(tcpr)
                tc.append(self.para(cell, spacing={"line": "240", "lineRule": "auto", "after": "40"}, ind_first0=True, jc="left", size=18, bold=(ri == 0)))
                tr.append(tc)
            tbl.append(tr)
        return [self.caption(caption), tbl, self.fonte(fonte)]

    # ---------- edição rastreada do que já existe
    def delete_par(self, p):
        """Marca o parágrafo inteiro como excluído (texto e marca de parágrafo)."""
        assert p.find(".//" + q("sectPr")) is None
        ppr = p.find(q("pPr"))
        if ppr is None:
            ppr = self.el("pPr"); p.insert(0, ppr)
        rpr = ppr.find(q("rPr"))
        if rpr is None:
            rpr = self.el("rPr"); ppr.append(rpr)
        rpr.insert(0, self.mark(self.el("del")))
        for r in list(p.iter(q("r"))):
            d = self.mark(self.el("del")); r.getparent().replace(r, d); d.append(r)
            for t in r.iter(q("t")): t.tag = q("delText")

    def sub(self, p, old, new):
        """Troca rastreada de um trecho que está inteiro dentro de um run."""
        for r in p.findall(q("r")):
            t = r.find(q("t"))
            if t is None or old not in (t.text or ""): continue
            before, after = t.text.split(old, 1)
            def clone(text, deleted=False):
                c = copy.deepcopy(r); ct = c.find(q("t")); ct.text = text; ct.set(XML_SPACE, "preserve")
                if deleted: ct.tag = q("delText")
                return c
            pieces = []
            if before: pieces.append(clone(before))
            d = self.mark(self.el("del")); d.append(clone(old, True)); pieces.append(d)
            if new:
                i = self.mark(self.el("ins")); i.append(clone(new)); pieces.append(i)
            if after: pieces.append(clone(after))
            idx = list(p).index(r); p.remove(r)
            for k, piece in enumerate(pieces): p.insert(idx + k, piece)
            return
        raise LookupError("trecho não está em um run só: %r" % old)

    def insert_after(self, anchor, elements):
        for e in elements:
            anchor.addnext(e); anchor = e
        return anchor

    def insert_before(self, anchor, elements):
        for e in elements:
            anchor.addprevious(e)

    def between(self, start, end):
        out = []; e = start.getnext()
        while e is not None and e is not end:
            out.append(e); e = e.getnext()
        assert e is end
        return out

    # ---------- referências
    @staticmethod
    def _key(s):
        s = unicodedata.normalize("NFD", s.upper())
        return re.sub(r"[^A-Z0-9 ]", "", "".join(c for c in s if unicodedata.category(c) != "Mn"))

    def add_reference(self, text):
        head = self.find("REFERÊNCIAS", style="Ttulo1")
        e = head.getnext(); last = head
        while e is not None and e.tag == q("p"):
            if self.text(e) and self._key(self.text(e)) > self._key(text):
                e.addprevious(self.para(text)); return
            last = e; e = e.getnext()
        last.addnext(self.para(text))

    # ---------- versão limpa
    def accept_all(self, autor="Bruno Shigueharu de Camargo Higashi"):
        """Aceita todas as alterações controladas (inclusive as que já vinham na base)."""
        root = self.tree.getroot()
        # parágrafos com a marca de parágrafo excluída: somem se todo o conteúdo também foi excluído
        for p in list(root.iter(q("p"))):
            marca = p.find(q("pPr") + "/" + q("rPr") + "/" + q("del"))
            if marca is None:
                continue
            sobra = [e for e in p if e.tag not in (q("pPr"), q("del"), q("bookmarkStart"), q("bookmarkEnd"), q("proofErr"))]
            if sobra:
                marca.getparent().remove(marca)
            else:
                p.getparent().remove(p)
        for e in list(root.iter(q("del"))):
            e.getparent().remove(e)
        for e in list(root.iter(q("ins"))):
            parent = e.getparent()
            if len(e):
                idx = list(parent).index(e)
                for k, child in enumerate(list(e)):
                    parent.insert(idx + k, child)
            parent.remove(e)
        assert not list(root.iter(q("ins"))) and not list(root.iter(q("del"))) and not list(root.iter(q("delText")))
        core = os.path.join(self.dir, "docProps/core.xml")
        if os.path.exists(core):
            t = etree.parse(core)
            for el in t.getroot():
                tag = el.tag.split("}")[1]
                if tag in ("creator", "lastModifiedBy"): el.text = autor
                if tag == "description": el.text = ""
            t.write(core, xml_declaration=True, encoding="UTF-8", standalone=True)

    # ---------- saída
    def save(self, out_docx):
        self.tree.write(os.path.join(self.dir, "word/document.xml"), xml_declaration=True, encoding="UTF-8", standalone=True)
        self.rels.write(self.rels_path, xml_declaration=True, encoding="UTF-8", standalone=True)
        if os.path.exists(out_docx): os.remove(out_docx)
        with zipfile.ZipFile(out_docx, "w", zipfile.ZIP_DEFLATED) as z:
            ct = os.path.join(self.dir, "[Content_Types].xml"); z.write(ct, "[Content_Types].xml")
            for root, _, files in os.walk(self.dir):
                for f in sorted(files):
                    full = os.path.join(root, f); arc = os.path.relpath(full, self.dir)
                    if arc != "[Content_Types].xml": z.write(full, arc)
